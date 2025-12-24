import { supabase } from '../../lib/supabase';
import { Batch } from '../../types/models';
import { createDefaultStudentProfile } from './studentService';
import { getUserById } from './userService';

export const generateBatchSlug = (batchName: string = 'batch'): string => {
    return (batchName || 'batch')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .replace(/_+/g, '_') // Replace multiple underscores with single
        .trim();
};

export const getBatchBySlug = async (slug: string): Promise<Batch | null> => {
    try {
        // First try to find by slug (if we had a slug column)
        // For now, we'll need to search by name pattern
        const { data, error } = await supabase
            .from('batches')
            .select('*')
            .ilike('name', `%${slug.replace(/_/g, ' ')}%`)
            .single();

        if (error) {
            console.error('Error fetching batch by slug:', error);
            return null;
        }

        return data;
    } catch (err) {
        console.error('Error in getBatchBySlug:', err);
        return null;
    }
};

export const getStudentBatch = async (userId: string): Promise<Batch | null> => {
    try {
        console.log('Fetching batch for user:', userId);

        // Use the new student_batch_assignments table
        console.log('🔍 Querying student_batch_assignments for user:', userId);
        const { data: batchAssignments, error: assignmentError } = await supabase
            .from('student_batch_assignments')
            .select(`
        batch_id,
        batches!inner(*)
      `)
            .eq('student_id', userId)
            .eq('status', 'active');

        console.log('📊 Batch assignments query result:', { batchAssignments, assignmentError });

        if (assignmentError) {
            console.error('Error fetching batch assignment:', assignmentError);
            return null;
        }

        if (batchAssignments && batchAssignments.length > 0) {
            // Get the most recent active assignment
            type BatchJoinResult = {
                batch_id: string;
                batches: Batch;
            };
            const latestAssignment = batchAssignments[0] as unknown as BatchJoinResult;
            console.log('✅ Batch found from new assignment table:', latestAssignment.batches);
            return latestAssignment.batches;
        }

        console.log('⚠️  No active batch assignments found, trying fallback method');

        // Try the old method as fallback
        const { data: profile, error: profileError } = await supabase
            .from('student_profiles')
            .select('batch_id')
            .eq('user_id', userId)
            .single();

        if (profileError) {
            console.error('Error fetching student profile:', profileError);
            // Profile doesn't exist, try to create one
            const newProfile = await createDefaultStudentProfile(userId);
            if (newProfile?.batch_id) {
                // Profile was created with a batch, fetch it
                const { data: batchData, error: batchError } = await supabase
                    .from('batches')
                    .select('*')
                    .eq('id', newProfile.batch_id)
                    .single();

                if (batchError) {
                    console.error('Error fetching batch from new profile:', batchError);
                    return null;
                }

                console.log('Batch found from new profile:', batchData);
                return batchData;
            }
        }

        if ((profile as any)?.batch_id) {
            console.log('User has batch_id:', (profile as any).batch_id);

            const { data, error } = await supabase
                .from('batches')
                .select('*')
                .eq('id', (profile as any).batch_id)
                .single();

            if (error) {
                console.error('Error fetching batch:', error);
                return null;
            }

            console.log('Batch found:', data);
            return data;
        }

        console.log('No batch assigned to user:', userId);
        // Don't auto-assign here to prevent conflicts - let the dashboard handle it
        // The user should have been assigned during signup or by admin
        return null;
    } catch (error) {
        console.error('Error in getStudentBatch:', error);
        return null;
    }
};

export const assignUserToAvailableBatch = async (userId: string): Promise<Batch | null> => {
    try {
        console.log('Attempting to assign user to available batch:', userId);

        // Check if user has a specific intended roadmap (from email domain or other criteria)
        const userData = await getUserById(userId);
        let preferredRoadmapId: string | null = null;

        // Check if user should be assigned to Augmedix roadmap based on email
        if (userData?.email?.includes('10minuteschool.com') || userData?.email?.includes('lightcastlepartners.com')) {
            console.log('🏢 Company email detected:', userData.email, '- Looking for Augmedix roadmap');

            // First try exact title match for "Augmedix" (case insensitive)
            let augmedixRoadmap: any = null;

            let { data: exactMatch, error: exactError } = await supabase
                .from('roadmaps')
                .select('id, title, description') // consistent selection
                .ilike('title', '%augmedix%')
                .eq('is_active', true)
                .limit(1)
                .maybeSingle(); // Use maybeSingle to avoid error on not found

            augmedixRoadmap = exactMatch;

            if (exactError && exactError.code !== 'PGRST116') {
                console.error('Error searching for Augmedix roadmap:', exactError);
            }

            // If exact match failed, try broader search
            if (!augmedixRoadmap) {
                console.log('🔍 Exact Augmedix match not found, trying broader search...');
                const { data: allRoadmaps, error: allError } = await supabase
                    .from('roadmaps')
                    .select('id, title, description')
                    .eq('is_active', true);

                if (!allError && allRoadmaps) {
                    const roadmaps = allRoadmaps as { id: string; title: string | null; description: string | null }[];

                    // Find roadmap that contains "augmedix" in title or description
                    augmedixRoadmap = roadmaps.find(r =>
                        (r.title && r.title.toLowerCase().includes('augmedix')) ||
                        (r.description && r.description.toLowerCase().includes('augmedix'))
                    ) || null;

                    if (augmedixRoadmap) {
                        console.log('🎯 Found Augmedix roadmap via broader search:', augmedixRoadmap.title);
                    } else {
                        // Try to find a roadmap with "machine learning" or "ai" for Augmedix users
                        augmedixRoadmap = roadmaps.find(r =>
                            (r.title && r.title.toLowerCase().includes('machine learning')) ||
                            (r.title && r.title.toLowerCase().includes('ai')) ||
                            (r.title && r.title.toLowerCase().includes('ml'))
                        ) || null;

                        if (augmedixRoadmap) {
                            console.log('🤖 Found ML/AI roadmap for company user:', augmedixRoadmap.title);
                        }
                    }
                }
            }

            if (augmedixRoadmap) {
                preferredRoadmapId = augmedixRoadmap.id;
                console.log('✅ Company user will be assigned to roadmap:', augmedixRoadmap.title, 'ID:', preferredRoadmapId);
            } else {
                console.warn('⚠️ No suitable roadmap found for company email:', userData.email);
            }
        }

        // First, try to find existing batch with preferred roadmap
        let existingBatches;
        if (preferredRoadmapId) {
            const { data, error } = await supabase
                .from('batches')
                .select('*')
                .eq('status', 'active')
                .eq('roadmap_id', preferredRoadmapId)
                .order('created_at', { ascending: true })
                .limit(1);

            if (!error && data && data.length > 0) {
                existingBatches = data;
                console.log('Found preferred roadmap batch:', existingBatches[0]);
            }
        }

        // If no preferred batch found, try any existing batch
        if (!existingBatches || existingBatches.length === 0) {
            const { data, error: existingError } = await supabase
                .from('batches')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: true })
                .limit(1);

            if (existingError) {
                console.error('Error fetching existing batches:', existingError);
            } else {
                existingBatches = data;
            }
        }

        if (existingBatches && existingBatches.length > 0) {
            const selectedBatch = existingBatches[0];
            console.log('Found existing batch for assignment:', selectedBatch);

            // Create assignment in student_batch_assignments table
            const { error: assignmentError } = await supabase
                .from('student_batch_assignments')
                .insert([{
                    student_id: userId,
                    batch_id: (selectedBatch as any).id,
                    status: 'active',
                    enrollment_date: new Date().toISOString().split('T')[0]
                }] as unknown as never);

            if (assignmentError) {
                console.error('Error creating batch assignment:', assignmentError);
            }

            return selectedBatch;
        }

        // If no existing batches, create a new one with appropriate roadmap
        console.log('No existing batches found, creating new batch');

        // Determine roadmap for new batch
        let roadmapId = preferredRoadmapId;
        let batchName = 'General Learning Cohort - Batch 1';

        if (preferredRoadmapId) {
            // Get roadmap details for proper naming
            const { data: roadmapData } = await supabase
                .from('roadmaps')
                .select('title')
                .eq('id', preferredRoadmapId)
                .single();

            const roadmapInfo = roadmapData as any;

            if (roadmapInfo?.title) {
                batchName = `${roadmapInfo.title} - Batch 1`;
                console.log('🎯 Creating new batch with preferred roadmap:', roadmapInfo.title);
            }
        } else {
            console.log('🔍 No preferred roadmap, selecting default...');

            // Prioritize non-Python roadmaps for better user experience
            const { data: availableRoadmaps } = await supabase
                .from('roadmaps')
                .select('id, title')
                .eq('is_active', true)
                .order('created_at', { ascending: true });

            if (availableRoadmaps && availableRoadmaps.length > 0) {
                // Try to avoid Python as the default (look for other options first)
                const roadmaps = availableRoadmaps as { id: string; title: string | null }[];
                const nonPythonRoadmap = roadmaps.find(r =>
                    r.title && !r.title.toLowerCase().includes('python')
                );

                const selectedRoadmap = nonPythonRoadmap || roadmaps[0];
                roadmapId = selectedRoadmap.id;
                batchName = `${selectedRoadmap.title} - Batch 1`;

                console.log('📚 Selected default roadmap:', selectedRoadmap.title,
                    nonPythonRoadmap ? '(non-Python preferred)' : '(fallback to first available)');
            } else {
                console.warn('⚠️ No active roadmaps found! Creating batch without roadmap.');
            }
        }

        const newBatch: Partial<Batch> = {
            name: batchName,
            roadmap_id: roadmapId || undefined,
            status: 'active',
            max_students: 30,
            current_students: 1,
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000).toISOString(), // 12 weeks from now
        };

        const { data: createdBatch, error: createError } = await supabase
            .from('batches')
            .insert(newBatch as unknown as never)
            .select()
            .single();

        if (createError) {
            console.error('Error creating new batch:', createError);
            // Return a mock batch as fallback
            const mockBatch: Batch = {
                id: 'mock-batch-' + userId,
                name: 'Python Learning Cohort - Demo Batch',
                roadmap_id: 'mock-roadmap-' + userId,
                mentor_id: 'mock-mentor-' + userId,
                max_students: 30,
                current_students: 1,
                status: 'active',
                start_date: new Date().toISOString(),
                end_date: new Date(Date.now() + 6 * 7 * 24 * 60 * 60 * 1000).toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            console.log('Mock batch created for user:', mockBatch);
            return mockBatch;
        }

        console.log('New batch created successfully:', createdBatch);
        return createdBatch;
    } catch (error) {
        console.error('Error in assignUserToAvailableBatch:', error);
        return null;
    }
};

export const assignUserToExistingBatch = async (userId: string, batchId: string): Promise<boolean> => {
    try {
        console.log('Manually assigning user to existing batch:', { userId, batchId });

        // First, check if batch exists
        const { data: batch, error: batchError } = await supabase
            .from('batches')
            .select('*')
            .eq('id', batchId)
            .single();

        if (batchError || !batch) {
            console.error('Batch not found:', batchError);
            return false;
        }

        // First check if profile already exists
        const { data: existingProfile } = await supabase
            .from('student_profiles')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (existingProfile) {
            // Update existing profile with new batch
            const { error: profileError } = await supabase
                .from('student_profiles')
                .update({
                    batch_id: batchId,
                    updated_at: new Date().toISOString(),
                } as unknown as never)
                .eq('user_id', userId);

            if (profileError) {
                console.error('Error updating existing student profile:', profileError);
                return false;
            }
        } else {
            // Create new profile only if none exists
            const { error: profileError } = await supabase
                .from('student_profiles')
                .insert({
                    user_id: userId,
                    batch_id: batchId,
                    institute: '10 Minute School',
                    year: new Date().getFullYear().toString(),
                    subject: 'Computer Science',
                    degree: 'Bachelor',
                    completed_weeks: 0,
                    progress_percentage: 0,
                    enrollment_date: new Date().toISOString(),
                } as unknown as never);

            if (profileError) {
                console.error('Error creating new student profile:', profileError);
                return false;
            }
        }

        // Profile updated/created successfully

        console.log('User successfully assigned to existing batch:', batchId);
        return true;
    } catch (error) {
        console.error('Error in assignUserToExistingBatch:', error);
        return false;
    }
};
