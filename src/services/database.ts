import { supabase } from '../lib/supabase';
import { cache, CACHE_KEYS, CACHE_TTL } from '../lib/cache';

// Types for database entities
export interface User {
  id: string;
  email: string;
  role: 'student' | 'mentor' | 'admin';
  first_name: string;
  last_name: string;
  profile_picture_url?: string;
  phone?: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  institute: string;
  year: string;
  subject: string;
  degree: string;
  batch_id?: string;
  completed_weeks: number;
  progress_percentage: number;
  enrollment_date: string;
  created_at: string;
  updated_at: string;
}

export interface MentorProfile {
  id: string;
  user_id: string;
  organization: string;
  designation: string;
  expertise_areas: string[];
  bio?: string;
  years_of_experience?: number;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: string;
  name: string;
  roadmap_id?: string;
  mentor_id?: string;
  max_students: number;
  current_students: number;
  start_date: string;
  end_date?: string;
  whatsapp_link?: string;
  discord_link?: string;
  emergency_contact?: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description?: string;
  total_weeks: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoadmapWeek {
  id: string;
  roadmap_id: string;
  week_number: number;
  title: string;
  description?: string;
  domain: string;
  created_at: string;
}

export interface RoadmapTask {
  id: string;
  week_id: string;
  task_name: string;
  task_details?: string;
  task_type: 'watch' | 'read' | 'project' | 'attend' | 'mcq' | 'written';
  relevant_links?: string[];
  deadline?: string;
  estimated_hours?: number;
  points: number;
  is_required: boolean;
  created_at: string;
}

export interface StudentProgress {
  id: string;
  student_id: string;
  task_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  completed_at?: string;
  score?: number;
  feedback?: string;
  submitted_files?: string[];
  created_at: string;
  updated_at: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  author_id: string;
  batch_id?: string;
  tag?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduled_date?: string;
  scheduled_time?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Database service functions
export class DatabaseService {
  // User management
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return null;
    }
  }

  static async getUserRole(userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data.role;
    } catch (error) {
      console.error('Error in getUserRole:', error);
      return null;
    }
  }

  // Student profile management
  static async getStudentProfile(userId: string): Promise<StudentProfile | null> {
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
          return await this.createDefaultStudentProfile(userId);
        }
        return null;
      }

      // Clean up any duplicate profiles before returning
      await this.cleanupDuplicateProfiles(userId);

      console.log('Student profile found:', data);
      return data;
    } catch (error) {
      console.error('Error in getStudentProfile:', error);
      return null;
    }
  }

  // Create default student profile
  static async createDefaultStudentProfile(userId: string): Promise<StudentProfile | null> {
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
        }, {
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
          batch_id: undefined,
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
  }

  // Batch management
  static async getStudentBatch(userId: string): Promise<Batch | null> {
    try {
      console.log('Fetching batch for user:', userId);
      
      // Use the new student_batch_assignments table with correct syntax
      console.log('🔍 Querying student_batch_assignments for user:', userId);
      const { data: batchAssignments, error: assignmentError } = await supabase
        .from('student_batch_assignments')
        .select(`
          batch_id,
          batches (
            id,
            name,
            roadmap_id,
            mentor_id,
            max_students,
            current_students,
            start_date,
            end_date,
            whatsapp_link,
            discord_link,
            emergency_contact,
            status,
            created_at,
            updated_at
          )
        `)
        .eq('student_id', userId)
        .eq('status', 'active')
        .order('enrollment_date', { ascending: false }); // Get most recent assignment first
      
      console.log('📊 Batch assignments query result:', { batchAssignments, assignmentError });

      if (assignmentError) {
        console.error('Error fetching batch assignment:', assignmentError);
        return null;
      }

      if (batchAssignments && batchAssignments.length > 0) {
        // Get the most recent active assignment
        const latestAssignment = batchAssignments[0];
        console.log('✅ Batch found from new assignment table:', latestAssignment.batches);
        return latestAssignment.batches as any;
      }

      console.log('⚠️  No active batch assignments found');
      console.log('❌ User is not assigned to any batch. Please contact administrator to assign user to a batch.');
      return null;
    } catch (error) {
      console.error('Error in getStudentBatch:', error);
      return null;
    }
  }

  // Assign user to available batch
  static async assignUserToAvailableBatch(userId: string): Promise<Batch | null> {
    try {
      console.log('Attempting to assign user to available batch:', userId);
      
      // Check if user has a specific intended roadmap (from email domain or other criteria)
      const userData = await this.getUserById(userId);
      let preferredRoadmapId: string | null = null;
      
      // Check if user should be assigned to Augmedix roadmap based on email
      if (userData?.email?.includes('10minuteschool.com') || userData?.email?.includes('lightcastlepartners.com')) {
        console.log('🏢 Company email detected:', userData.email, '- Looking for Augmedix roadmap');
        
        // First try exact title match for "Augmedix" (case insensitive)
        let { data: augmedixRoadmap, error: exactError } = await supabase
          .from('roadmaps')
          .select('id, title')
          .ilike('title', '%augmedix%')
          .eq('is_active', true)
          .limit(1)
          .single();
        
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
            // Find roadmap that contains "augmedix" in title or description
            augmedixRoadmap = allRoadmaps.find(r => 
              r.title?.toLowerCase().includes('augmedix') || 
              r.description?.toLowerCase().includes('augmedix')
            ) || null;
            
            if (augmedixRoadmap) {
              console.log('🎯 Found Augmedix roadmap via broader search:', augmedixRoadmap.title);
            } else {
              // Try to find a roadmap with "machine learning" or "ai" for Augmedix users
              augmedixRoadmap = allRoadmaps.find(r => 
                r.title?.toLowerCase().includes('machine learning') || 
                r.title?.toLowerCase().includes('ai') ||
                r.title?.toLowerCase().includes('ml')
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
            batch_id: selectedBatch.id,
            status: 'active',
            enrollment_date: new Date().toISOString().split('T')[0]
          }]);

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
        
        if (roadmapData) {
          batchName = `${roadmapData.title} - Batch 1`;
          console.log('🎯 Creating new batch with preferred roadmap:', roadmapData.title);
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
          const nonPythonRoadmap = availableRoadmaps.find(r => 
            !r.title?.toLowerCase().includes('python')
          );
          
          const selectedRoadmap = nonPythonRoadmap || availableRoadmaps[0];
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
        .insert(newBatch)
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
  }

  // Roadmap management
  static async getStudentRoadmap(userId: string): Promise<Roadmap | null> {
    try {
      const batch = await this.getStudentBatch(userId);
      if (!batch?.roadmap_id) {
        console.log('No roadmap found for user:', userId);
        return null;
      }

      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('id', batch.roadmap_id)
        .single();

      if (error) {
        console.error('Error fetching roadmap:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getStudentRoadmap:', error);
      return null;
    }
  }

  static async getEnrolledRoadmaps(userId: string): Promise<Roadmap[]> {
    try {
      console.log('🔍 getEnrolledRoadmaps called for user:', userId);
      
      // Get user email to determine if this is a company user
      const userData = await this.getUserById(userId);
      const isCompanyUser = userData?.email?.includes('@10minuteschool.com') || userData?.email?.includes('@lightcastlepartners.com');
      
      // Get all batches the user is enrolled in
      console.log('🔍 Querying student_batch_assignments for enrolled roadmaps, user:', userId);
      const { data: batchEnrollments, error: batchError } = await supabase
        .from('student_batch_assignments')
        .select(`
          batch_id,
          enrollment_date,
          batches (
            id,
            name,
            roadmap_id,
            roadmaps (
              id,
              title,
              description,
              total_weeks,
              difficulty_level,
              category,
              is_active,
              created_at,
              updated_at
            )
          )
        `)
        .eq('student_id', userId)
        .eq('status', 'active')
        .order('enrollment_date', { ascending: false }); // Most recent enrollments first
      
      console.log('📊 Batch enrollments query result:', { batchEnrollments, batchError });

      if (batchError) {
        console.error('❌ Error fetching batch enrollments:', batchError);
        return [];
      }

      console.log('📊 Batch enrollments found:', batchEnrollments);

      // Extract roadmaps from batch enrollments
      const roadmaps = batchEnrollments
        ?.map(enrollment => (enrollment.batches as any)?.roadmaps)
        .filter(Boolean) || [];

      console.log('🗺️  Roadmaps extracted from batches:', roadmaps);

      // If no roadmaps found, return empty array
      if (roadmaps.length === 0) {
        console.log('📝 No roadmaps found for user:', userId);
        return [];
      }

      // For company users, sort roadmaps to prioritize Augmedix/AI/ML over Python
      if (isCompanyUser && roadmaps.length > 1) {
        roadmaps.sort((a: any, b: any) => {
          const aTitle = a.title?.toLowerCase() || '';
          const bTitle = b.title?.toLowerCase() || '';
          const aDesc = a.description?.toLowerCase() || '';
          const bDesc = b.description?.toLowerCase() || '';
          
          // Priority scoring
          const getScore = (title: string, desc: string) => {
            if (title.includes('augmedix') || desc.includes('augmedix')) return 4;
            if (title.includes('ai') || title.includes('ml') || title.includes('machine learning')) return 3;
            if (title.includes('python')) return 1; // Lowest priority for company users
            return 2; // Default priority
          };
          
          const scoreA = getScore(aTitle, aDesc);
          const scoreB = getScore(bTitle, bDesc);
          
          return scoreB - scoreA; // Higher score first
        });
        
        console.log('🏢 Company user - roadmaps sorted for priority:', roadmaps.map((r: any) => r.title));
      }

      console.log('✅ Returning real roadmaps:', roadmaps);
      return roadmaps;
    } catch (error) {
      console.error('❌ Error in getEnrolledRoadmaps:', error);
      return [];
    }
  }

  static async getRoadmapWeeks(roadmapId: string): Promise<RoadmapWeek[]> {
    try {
      const { data, error } = await supabase
        .from('roadmap_weeks')
        .select('*')
        .eq('roadmap_id', roadmapId)
        .order('week_number');

      if (error) {
        console.error('Error fetching roadmap weeks:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRoadmapWeeks:', error);
      return [];
    }
  }

  static async getRoadmapTasks(weekId: string): Promise<RoadmapTask[]> {
    try {
      const { data, error } = await supabase
        .from('roadmap_tasks')
        .select('*')
        .eq('week_id', weekId)
        .order('created_at');

      if (error) {
        console.error('Error fetching roadmap tasks:', error);
        return [];
      }

      // Transform database field names to frontend field names
      const transformedTasks = (data || []).map((task: any) => ({
        id: task.id,
        week_id: task.week_id,
        task_name: task.task_name,
        task_details: task.task_details,
        task_type: task.task_type,
        relevant_links: task.relevant_links,
        deadline: task.deadline,
        estimated_hours: task.estimated_hours,
        points: task.points,
        is_required: task.is_required,
        created_at: task.created_at,
        meeting_time: task.meeting_time // Keep the original field name for now
      }));

      return transformedTasks;
    } catch (error) {
      console.error('Error in getRoadmapTasks:', error);
      return [];
    }
  }

  // Progress tracking
  static async getStudentProgress(userId: string): Promise<StudentProgress[]> {
    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', userId);

      if (error) {
        console.error('Error fetching student progress:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getStudentProgress:', error);
      return [];
    }
  }

  static async updateTaskProgress(
    userId: string, 
    taskId: string, 
    status: StudentProgress['status'],
    score?: number,
    feedback?: string
  ): Promise<boolean> {
    try {
      console.log('🔄 Updating task progress:', { userId, taskId, status, score, feedback });
      
      // First, check if progress already exists
      const { data: existingProgress, error: fetchError } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', userId)
        .eq('task_id', taskId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching existing progress:', fetchError);
        return false;
      }

      const progressData = {
        student_id: userId,
        task_id: taskId,
        status,
        score,
        feedback,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };

      let result;
      if (existingProgress) {
        // Update existing progress
        console.log('📝 Updating existing progress');
        result = await supabase
          .from('student_progress')
          .update(progressData)
          .eq('student_id', userId)
          .eq('task_id', taskId);
      } else {
        // Insert new progress
        console.log('➕ Inserting new progress');
        result = await supabase
          .from('student_progress')
          .insert(progressData);
      }

      if (result.error) {
        console.error('Error updating task progress:', result.error);
        return false;
      }

      console.log('✅ Task progress updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateTaskProgress:', error);
      return false;
    }
  }

  static async markWeekAsComplete(
    userId: string,
    weekId: string
  ): Promise<boolean> {
    try {
      console.log('🔄 Starting markWeekAsComplete for user:', userId, 'week:', weekId);
      
      // First, get all tasks for this week
      const weekTasks = await this.getRoadmapTasks(weekId);
      console.log('📋 Found tasks for week:', weekTasks.length, weekTasks);
      
      // Mark all tasks as completed for this user
      for (const task of weekTasks) {
        console.log('✅ Marking task as completed:', task.id, task.task_name);
        
        const { error } = await supabase
          .from('student_progress')
          .upsert({
            student_id: userId,
            task_id: task.id,
            status: 'completed',
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('❌ Error updating task progress:', error);
          return false;
        }
        
        console.log('✅ Successfully marked task as completed:', task.id);
      }

      console.log('🎉 All tasks for week marked as completed successfully');
      
      // Sync progress after all tasks are completed - this will update all progress tables
      try {
        const { ProgressSyncService } = await import('./progressSync');
        const syncResult = await ProgressSyncService.syncStudentProgress(userId);
        console.log('✅ Progress synced after week completion:', syncResult);
        
        if (!syncResult.success) {
          console.error('❌ Progress sync failed:', syncResult.errors);
          // Don't return false here as tasks were marked complete, just log the error
        }
      } catch (syncError) {
        console.warn('⚠️ Progress sync failed after week completion:', syncError);
        // Don't return false here as tasks were marked complete, just log the error
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error in markWeekAsComplete:', error);
      return false;
    }
  }

  // Get week completion statistics for all students in a batch
  static async getWeekCompletionStats(weekId: string, batchId: string): Promise<{
    totalStudents: number;
    completedStudents: number;
    completionPercentage: number;
    completedStudentNames: string[];
  }> {
    try {
      // Get all students in the batch
      const { data: batchStudents, error: batchError } = await supabase
        .from('student_batch_assignments')
        .select(`
          student_id,
          users (first_name, last_name)
        `)
        .eq('batch_id', batchId)
        .eq('status', 'active');

      if (batchError) {
        console.error('Error fetching batch students:', batchError);
        return {
          totalStudents: 0,
          completedStudents: 0,
          completionPercentage: 0,
          completedStudentNames: []
        };
      }

      if (!batchStudents || batchStudents.length === 0) {
        return {
          totalStudents: 0,
          completedStudents: 0,
          completionPercentage: 0,
          completedStudentNames: []
        };
      }

      const totalStudents = batchStudents.length;
      const studentIds = batchStudents.map(s => s.student_id);

      // Get all tasks for this week
      const weekTasks = await this.getRoadmapTasks(weekId);
      if (weekTasks.length === 0) {
        return {
          totalStudents,
          completedStudents: 0,
          completionPercentage: 0,
          completedStudentNames: []
        };
      }

      // Get progress for all students in this batch for this week's tasks
      const { data: progressData, error: progressError } = await supabase
        .from('student_progress')
        .select(`
          student_id,
          task_id,
          status
        `)
        .in('student_id', studentIds)
        .in('task_id', weekTasks.map(t => t.id));

      if (progressError) {
        console.error('Error fetching progress data:', progressError);
        return {
          totalStudents,
          completedStudents: 0,
          completionPercentage: 0,
          completedStudentNames: []
        };
      }

      // Calculate completion for each student
      const studentCompletion = new Map<string, { completed: number; total: number; name: string }>();
      
      // Initialize all students
      batchStudents.forEach(student => {
        studentCompletion.set(student.student_id, {
          completed: 0,
          total: weekTasks.length,
          name: `${(student.users as any).first_name} ${(student.users as any).last_name}`.trim()
        });
      });

      // Count completed tasks for each student
      progressData?.forEach(progress => {
        if (progress.status === 'completed') {
          const student = studentCompletion.get(progress.student_id);
          if (student) {
            student.completed++;
          }
        }
      });

      // Find students who completed 80% or more tasks (week completion threshold)
      const completedStudents = Array.from(studentCompletion.values())
        .filter(student => {
          const completionPercentage = (student.completed / student.total) * 100;
          return completionPercentage >= 80; // Same threshold as Class Completion section
        });
      
      
      const completedStudentNames = completedStudents
        .map(student => student.name)
        .sort(); // Sort alphabetically

      const completionPercentage = totalStudents > 0 ? (completedStudents.length / totalStudents) * 100 : 0;

      return {
        totalStudents,
        completedStudents: completedStudents.length,
        completionPercentage,
        completedStudentNames
      };
    } catch (error) {
      console.error('Error in getWeekCompletionStats:', error);
      return {
        totalStudents: 0,
        completedStudents: 0,
        completionPercentage: 0,
        completedStudentNames: []
      };
    }
  }

  // Get detailed student completion for a specific week
  static async getWeekStudentCompletionDetails(weekId: string, batchId: string): Promise<{
    studentId: string;
    studentName: string;
    completedTasks: number;
    totalTasks: number;
    completionPercentage: number;
    completedTaskNames: string[];
    lastCompletedAt?: string;
  }[]> {
    try {
      // Get all students in the batch
      const { data: batchStudents, error: batchError } = await supabase
        .from('student_batch_assignments')
        .select(`
          student_id,
          users (first_name, last_name)
        `)
        .eq('batch_id', batchId)
        .eq('status', 'active');

      if (batchError || !batchStudents) {
        console.error('Error fetching batch students:', batchError);
        return [];
      }

      // Get all tasks for this week
      const weekTasks = await this.getRoadmapTasks(weekId);
      if (weekTasks.length === 0) {
        return [];
      }

      const studentIds = batchStudents.map(s => s.student_id);
      const taskIds = weekTasks.map(t => t.id);

      // Get progress for all students in this batch for this week's tasks
      const { data: progressData, error: progressError } = await supabase
        .from('student_progress')
        .select(`
          student_id,
          task_id,
          status,
          completed_at
        `)
        .in('student_id', studentIds)
        .in('task_id', taskIds);

      if (progressError) {
        console.error('Error fetching progress data:', progressError);
        return [];
      }

      // Calculate completion for each student
      const studentDetails = batchStudents.map(batchStudent => {
        const studentId = batchStudent.student_id;
        const studentName = `${(batchStudent.users as any).first_name} ${(batchStudent.users as any).last_name}`.trim();
        
        // Get completed tasks for this student (unique task IDs only)
        const studentProgress = progressData?.filter(p => 
          p.student_id === studentId && p.status === 'completed'
        ) || [];

        // Count unique completed tasks to avoid duplicates
        const uniqueCompletedTasks = new Set(studentProgress.map(p => p.task_id));
        const completedTasks = uniqueCompletedTasks.size;
        const totalTasks = weekTasks.length;
        const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        // Get completed task names (unique only)
        const completedTaskNames = Array.from(uniqueCompletedTasks)
          .map(taskId => {
            const task = weekTasks.find(t => t.id === taskId);
            return task ? task.task_name : 'Unknown Task';
          })
          .sort();

        // Get last completion time
        const lastCompletedAt = studentProgress.length > 0 
          ? Math.max(...studentProgress.map(progress => new Date(progress.completed_at || 0).getTime()))
          : undefined;

        return {
          studentId,
          studentName,
          completedTasks,
          totalTasks,
          completionPercentage,
          completedTaskNames,
          lastCompletedAt: lastCompletedAt ? new Date(lastCompletedAt).toISOString() : undefined
        };
      });

      // Sort by completion percentage (highest first), then by last completed time
      return studentDetails.sort((a, b) => {
        if (a.completionPercentage !== b.completionPercentage) {
          return b.completionPercentage - a.completionPercentage;
        }
        if (a.lastCompletedAt && b.lastCompletedAt) {
          return new Date(b.lastCompletedAt).getTime() - new Date(a.lastCompletedAt).getTime();
        }
        return 0;
      });
    } catch (error) {
      console.error('Error in getWeekStudentCompletionDetails:', error);
      return [];
    }
  }

  // Notices management
  static async getNotices(batchId?: string): Promise<Notice[]> {
    try {
      let query = supabase
        .from('notices')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (batchId) {
        query = query.eq('batch_id', batchId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching notices:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getNotices:', error);
      return [];
    }
  }

  static async markNoticeAsRead(_noticeId: string, _userId: string): Promise<boolean> {
    try {
      // This would typically update a separate read_status table
      // For now, we'll just return success
      return true;
    } catch (error) {
      console.error('Error in markNoticeAsRead:', error);
      return false;
    }
  }

  // Mentor management
  static async getMentors(batchId?: string): Promise<User[]> {
    try {
      let query = supabase
        .from('users')
        .select('*')
        .eq('role', 'mentor')
        .eq('is_active', true);

      if (batchId) {
        const { data: batch } = await supabase
          .from('batches')
          .select('mentor_id')
          .eq('id', batchId)
          .single();
        
        if (batch?.mentor_id) {
          query = query.eq('id', batch.mentor_id);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching mentors:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getMentors:', error);
      return [];
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<User | null> {
    try {
      console.log('🔍 getUserById called with userId:', userId);
      
      // First try to get a single user
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching user from database:', error);
        console.log('📝 Error details - code:', error.code, 'message:', error.message);
        
        // If single query fails, try to get all users with this ID and take the first one
        console.log('🔄 Trying fallback method to get user...');
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .limit(1);

        if (fallbackError) {
          console.error('❌ Fallback query also failed:', fallbackError);
          return null;
        }

        if (fallbackData && fallbackData.length > 0) {
          console.log('✅ User data found via fallback (multiple records detected):', fallbackData[0]);
          console.log('⚠️  WARNING: Multiple user records found for ID:', userId);
          return fallbackData[0];
        }
        
        return null;
      }

      if (data) {
        console.log('✅ User data found:', data);
        return data;
      }

      console.log('❌ No user found with ID:', userId);
      return null;
    } catch (error) {
      console.error('❌ Exception in getUserById:', error);
      return null;
    }
  }

  // Get user by email (fallback method)
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      console.log('🔍 getUserByEmail called with email:', email);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error('❌ Error fetching user by email:', error);
        console.log('📝 Error details - code:', error.code, 'message:', error.message);
        return null;
      }

      console.log('✅ User data found by email:', data);
      return data;
    } catch (error) {
      console.error('❌ Exception in getUserByEmail:', error);
      return null;
    }
  }

  // Get students by batch ID using the new student_batch_assignments table
  static async getStudentsByBatch(batchId: string, currentUserId?: string): Promise<(User & { profile?: any })[]> {
    try {
      console.log('🔍 getStudentsByBatch called for batch:', batchId);
      
      // Use the new student_batch_assignments table
      const { data: batchAssignments, error: assignmentError } = await supabase
        .from('student_batch_assignments')
        .select(`
          student_id,
          status,
          users (
            id,
            first_name,
            last_name,
            email,
            role,
            is_active
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
      const studentIds = batchAssignments.map(assignment => assignment.student_id);
      const { data: studentProfiles, error: profileError } = await supabase
        .from('student_profiles')
        .select('*')
        .in('user_id', studentIds);

      if (profileError) {
        console.error('Error fetching student profiles:', profileError);
      }

      // Transform the data to match the expected format
      const studentsWithProfiles = batchAssignments.map(assignment => {
        const userData = assignment.users as any;
        const profile = studentProfiles?.find(p => p.user_id === userData.id);
        
        // If this is the current user and they're in the student dashboard context,
        // override their role to show as 'student' instead of their database role
        let displayRole = userData.role;
        if (currentUserId && userData.id === currentUserId) {
          displayRole = 'student';
          console.log(`Overriding role for current user ${userData.first_name} from ${userData.role} to student`);
        }
        
        return {
          ...userData,
          role: displayRole,
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
  }

  // Dashboard data aggregation
  static async getDashboardData(userId: string, selectedRoadmapId?: string): Promise<{
    profile: StudentProfile | null;
    batch: Batch | null;
    roadmap: Roadmap | null;
    enrolledRoadmaps: Roadmap[];
    progress: StudentProgress[];
    notices: Notice[];
    mentors: User[];
    weekStreaks: { week: number; status: 'done' | 'current' | 'incomplete' }[];
    upcomingTasks: RoadmapTask[];
    currentWeekTasks: RoadmapTask[];
    userData: User | null;
  }> {
    try {
      console.log('🔍 getDashboardData called with userId:', userId, 'selectedRoadmapId:', selectedRoadmapId);
      
      // Get user info first
      let userInfo = await this.getUserById(userId);
      console.log('👤 User info retrieved:', userInfo);
      
      // If userInfo is null, try to find user by email from Supabase Auth
      if (!userInfo) {
        console.log('⚠️ User not found by ID, trying to find by email from Supabase Auth...');
        
        // Get the current session to find the email
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          console.log('📧 Found email in session:', session.user.email);
          
          // Look up user by email in our custom users table
          const { data: userByEmail, error: emailError } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single();
            
          if (emailError) {
            console.error('❌ Error finding user by email:', emailError);
          } else if (userByEmail) {
            console.log('✅ Found user by email:', userByEmail);
            userInfo = userByEmail;
            // Update the userId to use the correct ID from our users table
            userId = userByEmail.id;
            console.log('🔄 Updated userId to:', userId);
          }
        }
      }
      
      // Check if this is a company user (bypass cache for fresh data)
      const isCompanyUser = userInfo?.email?.includes('@10minuteschool.com') || userInfo?.email?.includes('@lightcastlepartners.com');
      console.log('🏢 Is company user:', isCompanyUser);
      
      // Create cache key
      const cacheKey = cache.createKey(CACHE_KEYS.DASHBOARD_DATA, userId, selectedRoadmapId || 'default');
      console.log('🔑 Cache key:', cacheKey);
      
      // Check cache first (skip for company users to ensure fresh data)
      if (!isCompanyUser && userInfo) {
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
          console.log('🎯 Returning cached data for non-company user');
          return cachedData as any;
        }
      } else {
        console.log('🏢 Bypassing cache for company user or user not found to ensure fresh data');
      }

      // Skip expensive cleanup unless there are known issues
      // await this.cleanupDuplicateProfiles(userId);
      
      // Fetching dashboard data components
      const [profile, enrolledRoadmaps, progress, userData] = await Promise.all([
        this.getStudentProfile(userId),
        this.getEnrolledRoadmaps(userId),
        this.getStudentProgress(userId),
        this.getUserById(userId)
      ]);
      
      // Determine which roadmap and batch to use
      let roadmap: Roadmap | null = null;
      let batch: Batch | null = null;
      
      if (selectedRoadmapId) {
        // Use the selected roadmap
        console.log('🎯 Using selected roadmap:', selectedRoadmapId);
        roadmap = enrolledRoadmaps.find(r => r.id === selectedRoadmapId) || null;
        if (roadmap) {
          batch = await this.getBatchForRoadmap(userId, selectedRoadmapId);
        }
      } else {
        // Use the most recent batch (default behavior)
        console.log('📅 Using most recent batch (default)');
        batch = await this.getStudentBatch(userId);
        if (batch?.roadmap_id) {
          roadmap = enrolledRoadmaps.find(r => r.id === batch!.roadmap_id) || null;
        }
      }
      
      // Fetch weeks and tasks for the selected roadmap
      let weeks: RoadmapWeek[] = [];
      let tasks: RoadmapTask[] = [];
      
      if (selectedRoadmapId) {
        weeks = await this.getRoadmapWeeks(selectedRoadmapId);
        if (weeks.length > 0) {
          const weekIds = weeks.map(week => week.id);
          const { data: allTasks, error: tasksError } = await supabase
            .from('roadmap_tasks')
            .select('*')
            .in('week_id', weekIds)
            .order('created_at');
          
          if (!tasksError && allTasks) {
            tasks = allTasks;
          }
        }
      } else if (roadmap) {
        weeks = await this.getRoadmapWeeks(roadmap.id);
        if (weeks.length > 0) {
          const weekIds = weeks.map(week => week.id);
          const { data: allTasks, error: tasksError } = await supabase
            .from('roadmap_tasks')
            .select('*')
            .in('week_id', weekIds)
            .order('created_at');
          
          if (!tasksError && allTasks) {
            tasks = allTasks;
          }
        }
      }
      
      // Dashboard data components fetched
      console.log('📊 Dashboard data components fetched');
      console.log('👤 Profile:', profile);
      console.log('📦 Batch:', batch);
      console.log('🗺️  Roadmap:', roadmap);
      console.log('📚 Enrolled Roadmaps:', enrolledRoadmaps);
      console.log('📈 Progress:', progress);
      console.log('👤 User Data:', userData);
      
      // Debug: Check if any component is null
      if (!profile) console.log('⚠️  Profile is null');
      if (!batch) console.log('⚠️  Batch is null');
      if (!roadmap) console.log('⚠️  Roadmap is null');
      if (!enrolledRoadmaps || enrolledRoadmaps.length === 0) console.log('⚠️  No enrolled roadmaps');
      if (!progress || progress.length === 0) console.log('⚠️  No progress data');
      if (!userData) console.log('⚠️  User data is null');







      // Get notices and mentors based on the current batch (roadmap-specific)
      let notices: Notice[] = [];
      let mentors: User[] = [];
      
      if (batch?.id) {
        console.log('📊 Getting data for batch:', batch.name, 'ID:', batch.id);
        notices = await this.getNotices(batch.id);
        mentors = await this.getMentors(batch.id);
        console.log('📝 Notices for batch:', notices.length);
        console.log('👥 Mentors for batch:', mentors.length);
      }

      // Add sample notices if none exist, based on the selected roadmap
      let finalNotices = notices;
      if (!notices || notices.length === 0) {
        let roadmapTitle = 'Learning Cohort';
        if (selectedRoadmapId && roadmap) {
          roadmapTitle = roadmap.title;
        }
        
        finalNotices = [
          {
            id: 'sample-1',
            title: `Welcome to ${roadmapTitle}!`,
            content: `Welcome to Week 1 of your ${roadmapTitle} journey. Complete your first assignment by Friday.`,
            priority: 'high',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as Notice,
          {
            id: 'sample-2',
            title: 'Office Hours This Week',
            content: 'Join us for office hours every Wednesday at 3 PM to get help with your assignments.',
            priority: 'medium',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as Notice
        ];
      }

      // Calculate week streaks based on actual progress and date-based current week
      let weekStreaks: { week: number; status: 'done' | 'current' | 'incomplete'; completion: number }[] = [];
      
      if (roadmap) {
        // Calculate current week based on dates
        let currentWeek = 1; // Default fallback
        
        if (profile?.enrollment_date && batch?.start_date) {
          const enrollmentDate = new Date(profile.enrollment_date);
          const batchStartDate = new Date(batch.start_date);
          const currentDate = new Date();
          
          // Use the later of enrollment date or batch start date
          const startDate = enrollmentDate > batchStartDate ? enrollmentDate : batchStartDate;
          
          // Calculate weeks elapsed since start
          const timeDiff = currentDate.getTime() - startDate.getTime();
          const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
          const weeksElapsed = Math.floor(daysDiff / 7);
          
          // Current week is weeks elapsed + 1 (since we start counting from week 1)
          currentWeek = Math.max(1, weeksElapsed + 1);
          
          console.log('📅 Dashboard week calculation for roadmap:', roadmap.title, {
            enrollmentDate: enrollmentDate.toISOString(),
            batchStartDate: batchStartDate.toISOString(),
            currentDate: currentDate.toISOString(),
            startDate: startDate.toISOString(),
            daysDiff,
            weeksElapsed,
            currentWeek
          });
        }
        
        // Use roadmap data if available
        weekStreaks = Array.from({ length: roadmap.total_weeks }, (_, i) => {
          const weekNumber = i + 1;
          
          // Get all tasks for this specific week
          const weekTasks = tasks.filter(task => {
            // Find the week that contains this task
            const taskWeek = weeks.find(w => w.id === task.week_id);
            return taskWeek && taskWeek.week_number === weekNumber;
          });
          
          // Get completed tasks for this week
          const completedTasks = weekTasks.filter(task => {
            const taskProgress = progress.find(p => p.task_id === task.id);
            return taskProgress && taskProgress.status === 'completed';
          });
          
          // Calculate completion percentage for the week
          const weekCompletion = weekTasks.length > 0 ? 
            (completedTasks.length / weekTasks.length) * 100 : 0;
          
          let status: 'done' | 'current' | 'incomplete';
          
          if (weekCompletion >= 80) {
            status = 'done';
          } else if (weekNumber === currentWeek) {
            status = 'current';
          } else if (weekNumber < currentWeek) {
            status = 'incomplete'; // Past weeks that weren't completed
          } else {
            status = 'incomplete'; // Future weeks
          }
          
          return { week: weekNumber, status, completion: weekCompletion };
        });
      } else {
        // Fallback: Create default 6 weeks without status data
        weekStreaks = Array.from({ length: 6 }, (_, i) => {
          const weekNumber = i + 1;
          return { week: weekNumber, status: 'incomplete' as const, completion: 0 };
        });
      }

      // Get current week tasks and upcoming tasks
      const roadmapIdForTasks = selectedRoadmapId || roadmap?.id;
      console.log('🔄 Fetching tasks for roadmapId:', roadmapIdForTasks);
      const [currentWeekTasks, upcomingTasks] = await Promise.all([
        this.getCurrentWeekTasks(userId, roadmapIdForTasks),
        this.getUpcomingTasks(userId, roadmapIdForTasks)
      ]);
      const dashboardData = {
        profile,
        batch,
        roadmap,
        enrolledRoadmaps,
        progress,
        notices: finalNotices,
        mentors,
        weekStreaks,
        upcomingTasks,
        currentWeekTasks,
        userData
      };

      // Cache the result for faster subsequent loads
      cache.set(cacheKey, dashboardData, CACHE_TTL.MEDIUM);

      return dashboardData;
    } catch (error) {
      // Error in getDashboardData
      return {
        profile: null,
        batch: null,
        roadmap: null,
        enrolledRoadmaps: [],
        progress: [],
        notices: [],
        mentors: [],
        weekStreaks: [],
        upcomingTasks: [],
        currentWeekTasks: [],
        userData: null
      };
    }
  }

  // Manually assign user to existing batch
  static async assignUserToExistingBatch(userId: string, batchId: string): Promise<boolean> {
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
          })
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
          });
        
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
  }

  // Update student profile
  static async updateStudentProfile(userId: string, updates: Partial<StudentProfile>): Promise<boolean> {
    try {
      console.log('🔄 Starting updateStudentProfile with userId:', userId, 'Updates:', updates);
      
      // Get current auth user to verify permissions
      const { data: { user: authUser } } = await supabase.auth.getUser();
      console.log('🔐 Current auth user for profile update:', authUser?.id, authUser?.email);
      console.log('🔍 Auth user ID matches userId?', authUser?.id === userId);
      
      // Try to update using the auth user ID instead of the custom user ID
      const targetUserId = authUser?.id || userId;
      console.log('🎯 Using target user ID for profile update:', targetUserId);
      
      const { data, error } = await supabase
        .from('student_profiles')
        .update(updates)
        .eq('user_id', targetUserId)
        .select(); // Add select to see what was actually updated

      if (error) {
        console.error('❌ Error updating student profile:', error);
        console.error('❌ Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // Try alternative approach - find profile by email if ID fails
        if (authUser?.email) {
          console.log('🔄 Trying to find and update profile by email as fallback:', authUser.email);
          
          // First, find the user by email to get the correct user_id
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('email', authUser.email)
            .single();
            
          if (userError || !userData) {
            console.error('❌ Could not find user by email:', userError);
            return false;
          }
          
          console.log('✅ Found user by email, user_id:', userData.id);
          
          // Now update the profile using the correct user_id
          const { data: profileData, error: profileError } = await supabase
            .from('student_profiles')
            .update(updates)
            .eq('user_id', userData.id)
            .select();
            
          if (profileError) {
            console.error('❌ Profile update by email lookup also failed:', profileError);
            return false;
          } else {
            console.log('✅ Profile update by email lookup successful:', profileData);
            cache.clear();
            return true;
          }
        }
        
        return false;
      }

      console.log('✅ Student profile updated successfully:', data);
      // Clear cache for this user's dashboard data
      cache.clear();
      console.log('🧹 Cache cleared after successful profile update');
      return true;
    } catch (error) {
      console.error('❌ Exception in updateStudentProfile:', error);
      return false;
    }
  }

  // Update user data
  static async updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
    try {
      console.log('🔄 Starting updateUser with userId:', userId, 'Updates:', updates);
      
      // Get current auth user to verify permissions
      const { data: { user: authUser } } = await supabase.auth.getUser();
      console.log('🔐 Current auth user:', authUser?.id, authUser?.email);
      console.log('🔍 Auth user ID matches userId?', authUser?.id === userId);
      
      // Try to update using the auth user ID instead of the custom user ID
      const targetUserId = authUser?.id || userId;
      console.log('🎯 Using target user ID:', targetUserId);
      
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', targetUserId)
        .select(); // Add select to see what was actually updated

      if (error) {
        console.error('❌ Error updating user data:', error);
        console.error('❌ Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // Try alternative approach - update by email if ID fails
        if (authUser?.email) {
          console.log('🔄 Trying to update by email as fallback:', authUser.email);
          const { data: emailData, error: emailError } = await supabase
            .from('users')
            .update(updates)
            .eq('email', authUser.email)
            .select();
            
          if (emailError) {
            console.error('❌ Email update also failed:', emailError);
            return false;
          } else {
            console.log('✅ Email update successful:', emailData);
            cache.clear();
            return true;
          }
        }
        
        return false;
      }

      console.log('✅ User data updated successfully:', data);
      // Clear cache for this user's dashboard data
      cache.clear();
      console.log('🧹 Cache cleared after successful update');
      return true;
    } catch (error) {
      console.error('❌ Exception in updateUser:', error);
      return false;
    }
  }

  // Clean up duplicate student profiles for a user
  static async cleanupDuplicateProfiles(userId: string): Promise<boolean> {
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
        console.log(`📊 Profile IDs: ${profiles.map(p => p.id).join(', ')}`);
        
        // Keep the first profile (oldest), delete the rest
        const profilesToDelete = profiles.slice(1);
        console.log(`🗑️  Deleting ${profilesToDelete.length} duplicate profiles...`);
        
        let deletedCount = 0;
        for (const profile of profilesToDelete) {
          try {
            const { error: deleteError } = await supabase
              .from('student_profiles')
              .delete()
              .eq('id', profile.id);
            
            if (deleteError) {
              console.error(`❌ Error deleting profile ${profile.id}:`, deleteError);
            } else {
              console.log(`✅ Deleted duplicate profile: ${profile.id}`);
              deletedCount++;
            }
          } catch (deleteErr) {
            console.error(`❌ Exception deleting profile ${profile.id}:`, deleteErr);
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
  }

  // Clean up ALL duplicate profiles across the entire system
  static async cleanupAllDuplicateProfiles(): Promise<boolean> {
    try {
      console.log('🧹 Starting system-wide cleanup of duplicate profiles...');
      
      // Get all users with duplicate profiles
      // Note: Supabase doesn't support GROUP BY with HAVING in the same way
      // We'll fetch all profiles and handle the grouping in JavaScript
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
          const count = userProfileCounts.get(profile.user_id) || 0;
          userProfileCounts.set(profile.user_id, count + 1);
        });
        
        const duplicateUserIds = Array.from(userProfileCounts.entries())
          .filter(([, count]) => count > 1)
          .map(([userId]) => userId);
        
        if (duplicateUserIds.length > 0) {
          console.log(`🚨 Found ${duplicateUserIds.length} users with duplicate profiles!`);
          
          let totalCleaned = 0;
          for (const userId of duplicateUserIds) {
            const cleaned = await this.cleanupDuplicateProfiles(userId);
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
  }

  // Create mentor profile for user
  static async createMentorProfile(userId: string, batchId?: string): Promise<any> {
    try {
      console.log('Creating mentor profile for user:', userId);
      
      // First, update user role to mentor
      const { error: userUpdateError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userUpdateError) {
        console.error('Error fetching user:', userUpdateError);
        return null;
      }

      // Update user role to mentor
      const { error: roleUpdateError } = await supabase
        .from('users')
        .update({ role: 'mentor' })
        .eq('id', userId);

      if (roleUpdateError) {
        console.error('Error updating user role:', roleUpdateError);
      }

      // Create mentor profile
      const { data, error } = await supabase
        .from('mentor_profiles')
        .insert({
          user_id: userId,
          specialization: 'Python Programming',
          experience_years: 3,
          bio: 'Experienced Python developer and educator',
          batch_id: batchId,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating mentor profile:', error);
        // Return mock mentor profile if RLS prevents insertion
        return {
          id: 'mock-mentor-' + userId,
          user_id: userId,
          specialization: 'Python Programming',
          experience_years: 3,
          bio: 'Experienced Python developer and educator',
          batch_id: batchId,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }

      console.log('Mentor profile created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in createMentorProfile:', error);
      return null;
    }
  }

  // Get batch for a specific roadmap
  static async getBatchForRoadmap(userId: string, roadmapId: string): Promise<Batch | null> {
    try {
      console.log('🔍 Getting batch for roadmap:', roadmapId, 'user:', userId);
      
      const { data: batchAssignments, error: assignmentError } = await supabase
        .from('student_batch_assignments')
        .select(`
          batch_id,
          batches (
            id,
            name,
            roadmap_id,
            mentor_id,
            max_students,
            current_students,
            start_date,
            end_date,
            whatsapp_link,
            discord_link,
            emergency_contact,
            status,
            created_at,
            updated_at
          )
        `)
        .eq('student_id', userId)
        .eq('status', 'active')
        .order('enrollment_date', { ascending: false });
      
      if (assignmentError) {
        console.error('Error fetching batch assignments:', assignmentError);
        return null;
      }

      if (batchAssignments && batchAssignments.length > 0) {
        // Find the batch that matches the roadmap ID
        const matchingAssignment = batchAssignments.find(assignment => 
          assignment.batches && (assignment.batches as any).roadmap_id === roadmapId
        );
        
        if (matchingAssignment && matchingAssignment.batches) {
          console.log('✅ Found batch for roadmap:', (matchingAssignment.batches as any).name);
          return matchingAssignment.batches as any;
        }
      }

      console.log('⚠️ No batch found for roadmap:', roadmapId);
      return null;
    } catch (error) {
      console.error('Error in getBatchForRoadmap:', error);
      return null;
    }
  }

  // Get current week tasks for a student
  static async getCurrentWeekTasks(userId: string, roadmapId?: string): Promise<RoadmapTask[]> {
    try {
      console.log('🔄 Getting current week tasks for user:', userId, 'roadmapId:', roadmapId);
      
      let targetRoadmapId = roadmapId;
      
      // If no roadmapId provided, get from student's batch
      if (!targetRoadmapId) {
        const batch = await this.getStudentBatch(userId);
        console.log('📊 Batch data:', batch);
        
        if (!batch?.roadmap_id) {
          console.log('❌ No batch or roadmap found for user');
          return [];
        }
        targetRoadmapId = batch.roadmap_id;
      }

      // Calculate current week based on enrollment date and current date
      const profile = await this.getStudentProfile(userId);
      const batch = await this.getStudentBatch(userId);
      
      let currentWeek = 1; // Default fallback
      
      if (profile?.enrollment_date && batch?.start_date) {
        const enrollmentDate = new Date(profile.enrollment_date);
        const batchStartDate = new Date(batch.start_date);
        const currentDate = new Date();
        
        // Use the later of enrollment date or batch start date
        const startDate = enrollmentDate > batchStartDate ? enrollmentDate : batchStartDate;
        
        // Calculate weeks elapsed since start
        const timeDiff = currentDate.getTime() - startDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        const weeksElapsed = Math.floor(daysDiff / 7);
        
        // Current week is weeks elapsed + 1 (since we start counting from week 1)
        currentWeek = Math.max(1, weeksElapsed + 1);
        
        console.log('📅 Date-based calculation:', {
          enrollmentDate: enrollmentDate.toISOString(),
          batchStartDate: batchStartDate.toISOString(),
          currentDate: currentDate.toISOString(),
          startDate: startDate.toISOString(),
          daysDiff,
          weeksElapsed,
          currentWeek
        });
      } else {
        console.log('📅 Using default week 1 (no enrollment/batch dates available)');
      }
      
      console.log('📅 Current week:', currentWeek);

      // Get roadmap weeks
      const weeks = await this.getRoadmapWeeks(targetRoadmapId);
      console.log('📋 Roadmap weeks:', weeks);
      
      const currentWeekData = weeks.find(w => w.week_number === currentWeek);
      console.log('🎯 Current week data:', currentWeekData);
      
      if (!currentWeekData) {
        console.log('❌ No current week data found');
        return [];
      }

      // Get tasks for current week
      const tasks = await this.getRoadmapTasks(currentWeekData.id);
      console.log('📝 Tasks for current week:', tasks);
      
      // Filter to only required tasks
      const requiredTasks = tasks.filter(task => task.is_required);
      console.log('✅ Required tasks:', requiredTasks);
      
      return requiredTasks;
    } catch (error) {
      console.error('❌ Error in getCurrentWeekTasks:', error);
      return [];
    }
  }

  // Get upcoming tasks for a student
  static async getUpcomingTasks(userId: string, roadmapId?: string): Promise<RoadmapTask[]> {
    try {
      console.log('🔄 Getting upcoming tasks for user:', userId, 'roadmapId:', roadmapId);
      
      let targetRoadmapId = roadmapId;
      
      // If no roadmapId provided, get from student's batch
      if (!targetRoadmapId) {
        const batch = await this.getStudentBatch(userId);
        console.log('📊 Batch data:', batch);
        
        if (!batch?.roadmap_id) {
          console.log('❌ No batch or roadmap found for user');
          return [];
        }
        targetRoadmapId = batch.roadmap_id;
      }

      // Get roadmap weeks
      const weeks = await this.getRoadmapWeeks(targetRoadmapId);
      console.log('📋 Roadmap weeks:', weeks);
      
      // Get tasks for next few weeks (weeks 2-4)
      const upcomingTasks: RoadmapTask[] = [];
      
      for (let weekNum = 2; weekNum <= 4; weekNum++) {
        const weekData = weeks.find(w => w.week_number === weekNum);
        if (weekData) {
          const weekTasks = await this.getRoadmapTasks(weekData.id);
          console.log(`📝 Tasks for week ${weekNum}:`, weekTasks);
          
          // Add week number to each task for display
          const tasksWithWeek = weekTasks
            .filter(task => task.is_required)
            .map(task => ({
              ...task,
              week_number: weekNum
            }));
          upcomingTasks.push(...tasksWithWeek);
        }
      }
      
      console.log('✅ Total upcoming tasks:', upcomingTasks);
      return upcomingTasks;
    } catch (error) {
      console.error('❌ Error in getUpcomingTasks:', error);
      return [];
    }
  }
}

// Generate human-readable slugs
export const generateBatchSlug = (batchName: string): string => {
  return batchName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .trim();
};

export const generateRoadmapSlug = (roadmapTitle: string): string => {
  return roadmapTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .trim();
};

// Get batch by slug
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

// Get roadmap by slug with caching
export const getRoadmapBySlug = async (slug: string): Promise<Roadmap | null> => {
  try {
    // Check cache first
    const cacheKey = `roadmap_slug_${slug}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('✅ Returning cached roadmap for slug:', slug);
      return cached as Roadmap;
    }

    console.log('🔍 Searching for roadmap with slug:', slug);
    
    // Convert slug back to a more precise search pattern
    const searchPattern = slug.replace(/_/g, ' ').toLowerCase();
    console.log('🔍 Search pattern:', searchPattern);
    
    // First try partial title match (case insensitive)
    let { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .ilike('title', `%${searchPattern}%`)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error in partial title match:', error);
    }
    
    if (data) {
      console.log('✅ Found roadmap with partial title match:', data.title);
      // Cache the result
      cache.set(cacheKey, data, CACHE_TTL.LONG);
      return data;
    }
    
    // If partial match failed, try searching for key terms
    console.log('🔍 Partial match failed, trying key terms search...');
    const keyTerms = searchPattern.split(' ').filter(term => term.length > 2);
    console.log('🔍 Key terms:', keyTerms);
    
    for (const term of keyTerms) {
      const { data: termData, error: termError } = await supabase
        .from('roadmaps')
        .select('*')
        .ilike('title', `%${term}%`)
        .single();
      
      if (!termError && termData) {
        console.log(`✅ Found roadmap with key term "${term}":`, termData.title);
        // Cache the result
        cache.set(cacheKey, termData, CACHE_TTL.LONG);
        return termData;
      }
    }
    
    // If no exact match, try to find the best match by generating slugs for all roadmaps
    // and comparing them directly
    const { data: allRoadmaps, error: allRoadmapsError } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('is_active', true);
    
    if (allRoadmapsError) {
      console.error('Error fetching all roadmaps:', allRoadmapsError);
      return null;
    }
    
    if (allRoadmaps && allRoadmaps.length > 0) {
      // Generate slugs for all roadmaps and find the best match
      let bestMatch: Roadmap | null = null;
      let bestScore = 0;
      
      for (const roadmap of allRoadmaps) {
        const roadmapSlug = generateRoadmapSlug(roadmap.title);
        console.log(`🔍 Comparing "${slug}" with "${roadmapSlug}" for roadmap "${roadmap.title}"`);
        
        if (roadmapSlug === slug) {
          console.log('✅ Found exact slug match:', roadmap.title);
          return roadmap;
        }
        
        // Calculate similarity score for partial matches
        const slugWords = slug.split('_').filter(word => word.length > 2);
        const roadmapSlugWords = roadmapSlug.split('_').filter(word => word.length > 2);
        
        let score = 0;
        for (const word of slugWords) {
          if (roadmapSlugWords.includes(word)) {
            score += 1;
          }
        }
        
        // Normalize score by total words
        const normalizedScore = score / Math.max(slugWords.length, roadmapSlugWords.length);
        
        if (normalizedScore > bestScore && normalizedScore > 0.5) { // Require at least 50% match
          bestScore = normalizedScore;
          bestMatch = roadmap;
        }
      }
      
      if (bestMatch) {
        console.log('✅ Found best partial match:', bestMatch.title, 'Score:', bestScore);
        // Cache the result
        cache.set(cacheKey, bestMatch, CACHE_TTL.LONG);
        return bestMatch;
      }
    }
    
    console.log('❌ No roadmap found for slug:', slug);
    return null;
  } catch (err) {
    console.error('Error in getRoadmapBySlug:', err);
    return null;
  }
};
