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
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching student profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getStudentProfile:', error);
      return null;
    }
  }

  // Batch management
  static async getStudentBatch(userId: string): Promise<Batch | null> {
    try {
      const { data: profile } = await supabase
        .from('student_profiles')
        .select('batch_id')
        .eq('user_id', userId)
        .single();

      if (!profile?.batch_id) return null;

      const { data, error } = await supabase
        .from('batches')
        .select('*')
        .eq('id', profile.batch_id)
        .single();

      if (error) {
        console.error('Error fetching batch:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getStudentBatch:', error);
      return null;
    }
  }

  // Roadmap management
  static async getStudentRoadmap(userId: string): Promise<Roadmap | null> {
    try {
      const batch = await this.getStudentBatch(userId);
      if (!batch?.roadmap_id) return null;

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
      const [profile, batch, roadmap, progress] = await Promise.all([
        this.getStudentProfile(userId),
        this.getStudentBatch(userId),
        this.getStudentRoadmap(userId),
        this.getStudentProgress(userId)
      ]);

      const [notices, mentors] = await Promise.all([
        this.getNotices(batch?.id),
        this.getMentors(batch?.id)
      ]);

      // Calculate week streaks
      const weekStreaks = roadmap ? Array.from({ length: roadmap.total_weeks }, (_, i) => {
        const weekNumber = i + 1;
        const weekTasks = progress.filter(p => {
          // This is a simplified logic - you'd need to map tasks to weeks
          return p.status === 'completed';
        });
        
        if (weekNumber <= 2) return { week: weekNumber, status: 'completed' as const };
        if (weekNumber === 3) return { week: weekNumber, status: 'current' as const };
        if (weekNumber === 6) return { week: weekNumber, status: 'incomplete' as const };
        return { week: weekNumber, status: 'incomplete' as const };
      }) : [];

      // Get upcoming tasks (simplified)
      const upcomingTasks: RoadmapTask[] = [];

      return {
        profile,
        batch,
        roadmap,
        progress,
        notices,
        mentors,
        weekStreaks,
        upcomingTasks
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
}
