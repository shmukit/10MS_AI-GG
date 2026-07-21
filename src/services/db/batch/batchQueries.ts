import { supabase } from '../../../lib/supabase';
import { Batch, EnrolledBatch } from '../../../types/models';
import { createDefaultStudentProfile } from '../studentService';

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

export const getStudentBatchForRoadmap = async (userId: string, roadmapIdentifier: string): Promise<Batch | null> => {
    try {
        console.log('Fetching batch for user:', userId, 'and roadmap:', roadmapIdentifier);

        // First, check if input is a UUID (roadmap_id) or a slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(roadmapIdentifier);

        // If it's a slug, we need to find the UUID first
        let roadmapId = roadmapIdentifier;

        if (!isUUID) {
            console.log('Identifier is a slug, looking up roadmap ID...');
            const { data: roadmap } = await supabase
                .from('roadmaps')
                .select('id')
                .eq('slug', roadmapIdentifier) // Assuming slug column exists, or we might need to match title/generate slug match
                .maybeSingle(); // Use maybeSingle to avoid errors

            if (roadmap) {
                roadmapId = (roadmap as any).id;
            } else {
                console.log('Coult not resolve slug directly, will try filtering assignments by roadmap details');
            }
        }

        // Query student_batch_assignments joined with batch and roadmap
        const { data: assignments, error: assignmentError } = await supabase
            .from('student_batch_assignments')
            .select(`
                batch_id,
                batches!inner (
                    *,
                    roadmaps!inner (
                        id,
                        slug
                    )
                )
            `)
            .eq('student_id', userId)
            .eq('status', 'active');

        if (assignmentError) {
            console.error('Error fetching assignments:', assignmentError);
            return null;
        }

        if (!assignments || assignments.length === 0) {
            return null;
        }

        // Filter for the matching roadmap
        // We cast to any because the nested join types can be tricky to infer automatically
        const validAssignment = assignments.find((a: any) => {
            const batch = a.batches;
            const roadmap = batch?.roadmaps;

            if (!roadmap) return false;

            // Match by ID
            if (roadmap.id === roadmapId) return true;

            // Match by slug (if identifier is slug)
            if (!isUUID && roadmap.slug === roadmapIdentifier) return true;

            return false;
        });

        if (validAssignment) {
            console.log('✅ Found specific batch for roadmap:', (validAssignment as any).batches.name);
            // Return the batch object (sanitize it to remove the nested roadmap if needed by Batch type)
            const batchData = { ...(validAssignment as any).batches };
            delete batchData.roadmaps;
            return batchData as Batch;
        }

        return null;

    } catch (error) {
        console.error('Error in getStudentBatchForRoadmap:', error);
        return null;
    }
};

export const getAnyActiveBatchForRoadmap = async (roadmapIdentifier: string): Promise<Batch | null> => {
    try {
        console.log('Fetching any active batch for roadmap:', roadmapIdentifier);

        // Resolve roadmap ID if slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(roadmapIdentifier);
        let roadmapId = roadmapIdentifier;

        if (!isUUID) {
            const { data: roadmap } = await supabase
                .from('roadmaps')
                .select('id')
                .eq('slug', roadmapIdentifier)
                .maybeSingle();
            if (roadmap) roadmapId = (roadmap as any).id;
        }

        // Find the most recent active batch for this roadmap
        const { data: batches, error } = await supabase
            .from('batches')
            .select('*')
            .eq('roadmap_id', roadmapId)
            .eq('status', 'active')
            .order('start_date', { ascending: false })
            .limit(1);

        if (error) {
            console.error('Error fetching generic batch:', error);
            return null;
        }

        if (batches && batches.length > 0) {
            console.log('✅ Found generic batch for roadmap:', (batches[0] as any).name);
            return batches[0] as Batch;
        }

        return null;
    } catch (error) {
        console.error('Error in getAnyActiveBatchForRoadmap:', error);
        return null;
    }
};

export const getEnrolledBatches = async (
    userId: string,
    options?: { alternateUserIds?: (string | null | undefined)[] }
): Promise<EnrolledBatch[]> => {
    try {
        const candidateIds = Array.from(
            new Set(
                [userId, ...(options?.alternateUserIds || [])]
                    .filter((id): id is string => typeof id === 'string' && id.length > 0)
            )
        );

        console.log('Fetching enrolled batches for user id(s):', candidateIds);

        // Two-step fetch: nested !inner joins silently drop enrollments when a
        // roadmap/batch row is missing. Assignments alone are the source of truth.
        const { data: assignments, error: assignmentError } = await supabase
            .from('student_batch_assignments')
            .select('batch_id, status, enrollment_date, student_id')
            .in('student_id', candidateIds)
            .order('enrollment_date', { ascending: false });

        if (assignmentError) {
            console.error('Error fetching enrolled batches:', assignmentError);
            return [];
        }

        if (!assignments || assignments.length === 0) {
            console.log('⚠️ No student_batch_assignments rows for', candidateIds);
            return [];
        }

        const batchIds = Array.from(
            new Set(assignments.map((a: any) => a.batch_id).filter(Boolean))
        );

        let batchById = new Map<string, any>();
        if (batchIds.length > 0) {
            const { data: batches, error: batchError } = await supabase
                .from('batches')
                .select('*, roadmaps(*)')
                .in('id', batchIds);

            if (batchError) {
                console.error('Error fetching batches for enrollments:', batchError);
            } else {
                for (const b of batches || []) {
                    batchById.set((b as any).id, b);
                }
            }
        }

        const result: EnrolledBatch[] = [];
        const seen = new Set<string>();

        for (const a of assignments as any[]) {
            const batchId = a.batch_id as string;
            if (!batchId || seen.has(batchId)) continue;
            seen.add(batchId);

            const batch = batchById.get(batchId);
            if (!batch) {
                result.push({
                    id: batchId,
                    name: 'Previous cohort',
                    roadmap: null,
                    assignmentStatus: a.status,
                    enrollment_date: a.enrollment_date,
                });
                continue;
            }

            // PostgREST may return roadmaps as object or single-element array
            const rawRoadmap = (batch as any).roadmaps;
            const roadmap = Array.isArray(rawRoadmap) ? rawRoadmap[0] ?? null : rawRoadmap ?? null;
            const { roadmaps: _r, ...batchData } = batch as any;
            result.push({
                ...batchData,
                roadmap,
                assignmentStatus: a.status,
            });
        }

        result.sort((a: any, b: any) => {
            const aActive = a.assignmentStatus === 'active' ? 0 : 1;
            const bActive = b.assignmentStatus === 'active' ? 0 : 1;
            return aActive - bActive;
        });

        console.log(`✅ Found ${result.length} enrolled batches (from ${assignments.length} assignment rows)`);
        return result;
    } catch (error) {
        console.error('Error in getEnrolledBatches:', error);
        return [];
    }
};

export const getBatchStudents = async (batchId: string): Promise<any[]> => {
    try {
        const { data, error } = await supabase
            .from('student_batch_assignments')
            .select(`
                student_id,
                users!inner(first_name, last_name, email)
            `)
            .eq('batch_id', batchId)
            .eq('status', 'active');

        if (error) {
            console.error('Error fetching batch students:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getBatchStudents:', error);
        return [];
    }
};
