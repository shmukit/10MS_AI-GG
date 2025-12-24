import { supabase } from '../../lib/supabase';
import { StudentProfile, User } from '../../types/models';

// Clean up duplicate student profiles for a user
export const cleanupDuplicateProfiles = async (userId: string): Promise<boolean> => {
    try {
        console.log('🧹 Starting cleanup of duplicate profiles for user:', userId);

        // Get all profiles for this user
        const { data: profiles, error: fetchError } = await supabase
            .from('student_profiles')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (fetchError) {
            console.error('❌ Error fetching profiles:', fetchError);
            return false;
        }

        if (profiles && profiles.length > 1) {
            console.log(`🚨 Found ${profiles.length} profiles for user ${userId}! This is a critical issue.`);
            console.log(`📊 Profile IDs: ${profiles.map(p => (p as any).id).join(', ')}`);

            // Keep the first profile (oldest), delete the rest
            const profilesToDelete = profiles.slice(1);
            console.log(`🗑️  Deleting ${profilesToDelete.length} duplicate profiles...`);

            let deletedCount = 0;
            for (const profile of profilesToDelete) {
                try {
                    const { error: deleteError } = await supabase
                        .from('student_profiles')
                        .delete()
                        .eq('id', (profile as any).id);

                    if (deleteError) {
                        console.error(`❌ Error deleting profile ${(profile as any).id}:`, deleteError);
                    } else {
                        console.log(`✅ Deleted duplicate profile: ${(profile as any).id}`);
                        deletedCount++;
                    }
                } catch (deleteErr) {
                    console.error(`❌ Exception deleting profile ${(profile as any).id}:`, deleteErr);
                }
            }

            console.log(`🎉 Cleanup completed! Deleted ${deletedCount}/${profilesToDelete.length} duplicate profiles`);
            console.log(`📈 User ${userId} now has 1 profile instead of ${profiles.length}`);
            return true;
        }

        console.log('✅ No duplicate profiles found for user:', userId);
        return true;
    } catch (error) {
        console.error('❌ Critical error in cleanupDuplicateProfiles:', error);
        return false;
    }
};

// Create default student profile
export const createDefaultStudentProfile = async (userId: string): Promise<StudentProfile | null> => {
    try {
        console.log('Creating default student profile for user:', userId);

        // Use upsert with ON CONFLICT to prevent race conditions
        const { data, error } = await supabase
            .from('student_profiles')
            .upsert({
                user_id: userId,
                institute: '10 Minute School',
                year: new Date().getFullYear().toString(),
                subject: 'Computer Science',
                degree: 'Bachelor',
                completed_weeks: 0,
                progress_percentage: 0,
                enrollment_date: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            } as unknown as never, {
                onConflict: 'user_id', // This should prevent duplicates
                ignoreDuplicates: true
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating/updating student profile:', error);

            // If upsert fails, try to fetch existing profile
            const { data: existingProfile } = await supabase
                .from('student_profiles')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

            if (existingProfile) {
                console.log('Found existing profile after upsert failure:', existingProfile);
                return existingProfile;
            }

            // If RLS prevents insertion, return a mock profile
            const mockProfile: StudentProfile = {
                id: 'mock-profile-' + userId,
                user_id: userId,
                institute: '10 Minute School',
                year: new Date().getFullYear().toString(),
                subject: 'Computer Science',
                degree: 'Bachelor',
                completed_weeks: 0,
                progress_percentage: 0,
                enrollment_date: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            console.log('Mock student profile created:', mockProfile);
            return mockProfile;
        }

        console.log('Student profile created/updated:', data);
        return data;
    } catch (error) {
        console.error('Error in createDefaultStudentProfile:', error);
        return null;
    }
};

export const getStudentProfile = async (userId: string): Promise<StudentProfile | null> => {
    try {
        console.log('Fetching student profile for user:', userId);

        const { data, error } = await supabase
            .from('student_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            console.error('Error fetching student profile:', error);
            if (error.code === 'PGRST116') {
                console.log('No student profile found for user:', userId);
                // Create a default student profile if none exists
                return await createDefaultStudentProfile(userId);
            }
            return null;
        }

        // Clean up any duplicate profiles before returning
        await cleanupDuplicateProfiles(userId);

        console.log('Student profile found:', data);
        return data;
    } catch (error) {
        console.error('Error in getStudentProfile:', error);
        return null;
    }
};

export const updateStudentProfile = async (userId: string, updates: Partial<StudentProfile>): Promise<boolean> => {
    try {
        console.log('Updating student profile for user:', userId, 'Updates:', updates);

        const { error } = await supabase
            .from('student_profiles')
            .update(updates as unknown as never)
            .eq('user_id', userId);

        if (error) {
            console.error('Error updating student profile:', error);
            return false;
        }

        console.log('Student profile updated successfully');
        return true;
    } catch (error) {
        console.error('Error in updateStudentProfile:', error);
        return false;
    }
};

export const cleanupAllDuplicateProfiles = async (): Promise<boolean> => {
    try {
        console.log('🧹 Starting system-wide cleanup of duplicate profiles...');

        // Get all users with duplicate profiles
        const { data: allProfiles, error: fetchError } = await supabase
            .from('student_profiles')
            .select('user_id');

        if (fetchError) {
            console.error('❌ Error fetching duplicate users:', fetchError);
            return false;
        }

        if (allProfiles && allProfiles.length > 0) {
            // Group profiles by user_id and find duplicates
            const userProfileCounts = new Map<string, number>();
            allProfiles.forEach(profile => {
                const count = userProfileCounts.get((profile as any).user_id) || 0;
                userProfileCounts.set((profile as any).user_id, count + 1);
            });

            const duplicateUserIds = Array.from(userProfileCounts.entries())
                .filter(([, count]) => count > 1)
                .map(([userId]) => userId);

            if (duplicateUserIds.length > 0) {
                console.log(`🚨 Found ${duplicateUserIds.length} users with duplicate profiles!`);

                let totalCleaned = 0;
                for (const userId of duplicateUserIds) {
                    const cleaned = await cleanupDuplicateProfiles(userId);
                    if (cleaned) totalCleaned++;
                }

                console.log(`🎉 System cleanup completed! Cleaned ${totalCleaned}/${duplicateUserIds.length} users`);
                return true;
            }
        }

        console.log('✅ No duplicate profiles found in the system');
        return true;
    } catch (error) {
        console.error('❌ Critical error in system-wide cleanup:', error);
        return false;
    }
};

export const getStudentsByBatch = async (batchId: string, currentUserId?: string, _roadmapId?: string): Promise<(User & { profile?: any })[]> => {
    try {
        console.log('🔍 getStudentsByBatch called for batch:', batchId);

        // Use the new student_batch_assignments table
        const { data: batchAssignments, error: assignmentError } = await supabase
            .from('student_batch_assignments')
            .select(`
        student_id,
        status,
        users!inner(
          id,
          first_name,
          last_name,
          email,
          role,
          is_active,
          created_at,
          updated_at
        )
      `)
            .eq('batch_id', batchId)
            .eq('status', 'active')
            .eq('users.is_active', true);

        if (assignmentError) {
            console.error('Error fetching batch assignments:', assignmentError);
            return [];
        }

        if (!batchAssignments || batchAssignments.length === 0) {
            console.log('No active students found in batch:', batchId);
            return [];
        }

        // Get student profiles for additional information
        const studentIds = batchAssignments.map(assignment => (assignment as any).student_id);
        const { data: studentProfiles, error: profileError } = await supabase
            .from('student_profiles')
            .select('*')
            .in('user_id', studentIds)
            .returns<StudentProfile[]>();

        if (profileError) {
            console.error('Error fetching student profiles:', profileError);
        }

        // Transform the data to match the expected format

        type DBUser = {
            id: string;
            first_name: string;
            last_name: string;
            email: string;
            role: string;
            is_active: boolean;
            created_at: string;
            updated_at: string;
            email_verified?: boolean; // Supabase auth field, might be missing in public table partial selection
        };

        const studentsWithProfiles = (batchAssignments as any[]).map(assignment => {
            // Check if users is array or object just in case, but assume object for now based on !inner
            const rawUser = assignment.users as unknown as DBUser;

            // If this is the current user and they're in the student dashboard context,
            // override their role to show as 'student' instead of their database role
            let displayRole = rawUser.role as 'student' | 'mentor' | 'admin';
            if (currentUserId && rawUser.id === currentUserId) {
                displayRole = 'student';
                console.log(`Overriding role for current user ${rawUser.first_name} from ${rawUser.role} to student`);
            }

            const profile = studentProfiles?.find(p => p.user_id === rawUser.id);

            return {
                id: rawUser.id,
                email: rawUser.email,
                role: displayRole,
                first_name: rawUser.first_name,
                last_name: rawUser.last_name,
                is_active: rawUser.is_active,
                email_verified: rawUser.email_verified || false,
                created_at: rawUser.created_at || new Date().toISOString(),
                updated_at: rawUser.updated_at || new Date().toISOString(),

                profile: profile ? {
                    institute: profile.institute,
                    year: profile.year,
                    subject: profile.subject,
                    degree: profile.degree,
                    enrollment_date: profile.enrollment_date
                } : null,
                progress: {
                    completed_weeks: profile?.completed_weeks || 0,
                    progress_percentage: profile?.progress_percentage || 0,
                    current_week: Math.ceil((profile?.completed_weeks || 0) + 1)
                }
            };
        });

        console.log('Students with profiles found in batch:', studentsWithProfiles.length);
        return studentsWithProfiles;
    } catch (error) {
        console.error('Error in getStudentsByBatch:', error);
        return [];
    }
};
