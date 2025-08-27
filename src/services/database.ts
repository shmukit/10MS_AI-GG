import { supabase } from '../lib/supabase';

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
      
      // Try to create a real profile first
      const { data, error } = await supabase
        .from('student_profiles')
        .insert({
          user_id: userId,
          institute: '10 Minute School',
          year: new Date().getFullYear().toString(),
          subject: 'Computer Science',
          degree: 'Bachelor',
          completed_weeks: 0,
          progress_percentage: 0,
          enrollment_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating real student profile:', error);
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

      console.log('Real student profile created:', data);
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
      
      // First, check if user already has a batch assigned
      const { data: profile, error: profileError } = await supabase
        .from('student_profiles')
        .select('batch_id')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching student profile:', profileError);
        // Profile doesn't exist, try to create one
        const newProfile = await this.createDefaultStudentProfile(userId);
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

      if (profile?.batch_id) {
        console.log('User has batch_id:', profile.batch_id);
        
        const { data, error } = await supabase
          .from('batches')
          .select('*')
          .eq('id', profile.batch_id)
          .single();

        if (error) {
          console.error('Error fetching batch:', error);
          return null;
        }

        console.log('Batch found:', data);
        return data;
      }

      console.log('No batch assigned to user:', userId);
      // Try to assign user to an available batch
      return await this.assignUserToAvailableBatch(userId);
    } catch (error) {
      console.error('Error in getStudentBatch:', error);
      return null;
    }
  }

  // Assign user to available batch
  static async assignUserToAvailableBatch(userId: string): Promise<Batch | null> {
    try {
      console.log('Attempting to assign user to available batch:', userId);
      
      // First, try to find any existing batch
      const { data: existingBatches, error: existingError } = await supabase
        .from('batches')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: true })
        .limit(1);

      if (existingError) {
        console.error('Error fetching existing batches:', existingError);
      }

      if (existingBatches && existingBatches.length > 0) {
        const selectedBatch = existingBatches[0];
        console.log('Found existing batch for assignment:', selectedBatch);
        
        // Try to update student profile with batch_id
        const { error: updateError } = await supabase
          .from('student_profiles')
          .update({ batch_id: selectedBatch.id })
          .eq('user_id', userId);

        if (updateError) {
          console.error('Error updating student profile with batch:', updateError);
        }

        return selectedBatch;
      }

      // If no existing batches, create a new one
      console.log('No existing batches found, creating new batch');
      const newBatch: Partial<Batch> = {
        name: 'Python Learning Cohort - Batch 1',
        status: 'active',
        max_students: 30,
        current_students: 1,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 6 * 7 * 24 * 60 * 60 * 1000).toISOString(), // 6 weeks from now
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
        // Return a mock roadmap for demonstration
        const mockRoadmap: Roadmap = {
          id: 'mock-roadmap-' + userId,
          title: 'Python Learning Path',
          description: 'A comprehensive Python learning journey for beginners',
          total_weeks: 6,
          difficulty_level: 'beginner',
          category: 'Programming',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        console.log('Mock roadmap created for user:', mockRoadmap);
        return mockRoadmap;
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

      return data || [];
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
      const { error } = await supabase
        .from('student_progress')
        .upsert({
          student_id: userId,
          task_id: taskId,
          status,
          score,
          feedback,
          completed_at: status === 'completed' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating task progress:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateTaskProgress:', error);
      return false;
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

  static async markNoticeAsRead(noticeId: string, userId: string): Promise<boolean> {
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
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserById:', error);
      return null;
    }
  }

  // Get students by batch
  static async getStudentsByBatch(batchId: string): Promise<User[]> {
    try {
      console.log('Fetching students for batch:', batchId);
      
      const { data: profiles, error: profileError } = await supabase
        .from('student_profiles')
        .select('user_id')
        .eq('batch_id', batchId);

      if (profileError || !profiles) {
        console.error('Error fetching student profiles:', profileError);
        return [];
      }

      if (profiles.length === 0) {
        console.log('No students found in batch:', batchId);
        return [];
      }

      const userIds = profiles.map(p => p.user_id);
      
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, role')
        .in('id', userIds)
        .eq('is_active', true);

      if (userError) {
        console.error('Error fetching users:', userError);
        return [];
      }

      console.log('Students found in batch:', users?.length || 0);
      return users || [];
    } catch (error) {
      console.error('Error in getStudentsByBatch:', error);
      return [];
    }
  }

  // Dashboard data aggregation
  static async getDashboardData(userId: string): Promise<{
    profile: StudentProfile | null;
    batch: Batch | null;
    roadmap: Roadmap | null;
    progress: StudentProgress[];
    notices: Notice[];
    mentors: User[];
    weekStreaks: { week: number; status: 'completed' | 'current' | 'incomplete' }[];
    upcomingTasks: RoadmapTask[];
  }> {
    try {
      const [profile, batch, roadmap, progress, userData] = await Promise.all([
        this.getStudentProfile(userId),
        this.getStudentBatch(userId),
        this.getStudentRoadmap(userId),
        this.getStudentProgress(userId),
        this.getUserById(userId)
      ]);

      const [notices, mentors] = await Promise.all([
        this.getNotices(batch?.id),
        this.getMentors(batch?.id)
      ]);

      // Add sample notices if none exist
      let finalNotices = notices;
      if (!notices || notices.length === 0) {
        finalNotices = [
          {
            id: 'sample-1',
            title: 'Welcome to Python Learning Cohort!',
            content: 'Welcome to Week 1 of your Python journey. Complete your first assignment by Friday.',
            type: 'announcement',
            priority: 'high',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'sample-2',
            title: 'Office Hours This Week',
            content: 'Join us for office hours every Wednesday at 3 PM to get help with your assignments.',
            type: 'reminder',
            priority: 'medium',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }

      // Calculate week streaks based on actual progress
      let weekStreaks: { week: number; status: 'completed' | 'current' | 'incomplete'; completion: number }[] = [];
      
      if (roadmap) {
        // Use roadmap data if available
        weekStreaks = Array.from({ length: roadmap.total_weeks }, (_, i) => {
          const weekNumber = i + 1;
          
          // Get completed tasks for this week
          const weekProgress = progress.filter(p => {
            // Map task_id to week number (you may need to adjust this logic based on your data structure)
            // For now, we'll use a simple calculation
            return p.status === 'completed';
          });
          
          // Calculate completion percentage for the week
          const weekCompletion = weekProgress.length > 0 ? 
            (weekProgress.filter(p => p.status === 'completed').length / weekProgress.length) * 100 : 0;
          
          let status: 'completed' | 'current' | 'incomplete';
          
          if (weekCompletion >= 80) {
            status = 'completed';
          } else if (weekNumber === Math.ceil((profile?.completed_weeks || 0) + 1)) {
            status = 'current';
          } else {
            status = 'incomplete';
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

      // Get upcoming tasks (simplified)
      const upcomingTasks: RoadmapTask[] = [];

      return {
        profile,
        batch,
        roadmap,
        progress,
        notices: finalNotices,
        mentors,
        weekStreaks,
        upcomingTasks,
        userData
      };
    } catch (error) {
      console.error('Error in getDashboardData:', error);
      return {
        profile: null,
        batch: null,
        roadmap: null,
        progress: [],
        notices: [],
        mentors: [],
        weekStreaks: [],
        upcomingTasks: []
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

      // Update or create student profile with this batch
      const { error: profileError } = await supabase
        .from('student_profiles')
        .upsert({
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
        console.error('Error updating student profile:', profileError);
        return false;
      }

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
      console.log('Updating student profile for user:', userId, 'Updates:', updates);
      
      const { error } = await supabase
        .from('student_profiles')
        .update(updates)
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

// Get roadmap by slug
export const getRoadmapBySlug = async (slug: string): Promise<Roadmap | null> => {
  try {
    // First try to find by slug (if we had a slug column)
    // For now, we'll need to search by title pattern
    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .ilike('title', `%${slug.replace(/_/g, ' ')}%`)
      .single();
    
    if (error) {
      console.error('Error fetching roadmap by slug:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Error in getRoadmapBySlug:', err);
    return null;
  }
};
