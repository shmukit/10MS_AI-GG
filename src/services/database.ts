import { supabase } from '../lib/supabase';

// Types for database operations
export interface Roadmap {
  id: string;
  title: string;
  description: string;
  total_weeks: number;
  difficulty_level: string;
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
  description: string;
  domain: string;
  created_at: string;
}

export interface RoadmapTask {
  id: string;
  week_id: string;
  task_name: string;
  task_details: string;
  task_type: string;
  relevant_links: string[];
  deadline: string;
  estimated_hours: number;
  points: number;
  is_required: boolean;
  created_at: string;
}

export interface Batch {
  id: string;
  name: string;
  roadmap_id: string;
  mentor_id: string;
  max_students: number;
  current_students: number;
  start_date: string;
  end_date: string;
  whatsapp_link: string;
  discord_link: string;
  emergency_contact: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  institute: string;
  year: string;
  subject: string;
  degree: string;
  batch_id: string;
  completed_weeks: number;
  progress_percentage: number;
  enrollment_date: string;
  created_at: string;
  updated_at: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  author_id: string;
  batch_id: string;
  tag: string;
  priority: string;
  scheduled_date: string;
  scheduled_time: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Database service functions
export const databaseService = {
  // Roadmaps
  async getRoadmaps(): Promise<Roadmap[]> {
    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getRoadmapBySlug(slug: string): Promise<Roadmap | null> {
    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('id', slug)
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createRoadmap(roadmap: Omit<Roadmap, 'id' | 'created_at' | 'updated_at'>): Promise<Roadmap> {
    const { data, error } = await supabase
      .from('roadmaps')
      .insert([roadmap])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Roadmap Weeks
  async getRoadmapWeeks(roadmapId: string): Promise<RoadmapWeek[]> {
    const { data, error } = await supabase
      .from('roadmap_weeks')
      .select('*')
      .eq('roadmap_id', roadmapId)
      .order('week_number', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async createRoadmapWeek(week: Omit<RoadmapWeek, 'id' | 'created_at'>): Promise<RoadmapWeek> {
    const { data, error } = await supabase
      .from('roadmap_weeks')
      .insert([week])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Roadmap Tasks
  async getRoadmapTasks(weekId: string): Promise<RoadmapTask[]> {
    const { data, error } = await supabase
      .from('roadmap_tasks')
      .select('*')
      .eq('week_id', weekId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async createRoadmapTask(task: Omit<RoadmapTask, 'id' | 'created_at'>): Promise<RoadmapTask> {
    const { data, error } = await supabase
      .from('roadmap_tasks')
      .insert([task])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Batches
  async getBatches(): Promise<Batch[]> {
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createBatch(batch: Omit<Batch, 'id' | 'created_at' | 'updated_at'>): Promise<Batch> {
    const { data, error } = await supabase
      .from('batches')
      .insert([batch])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Students
  async getStudents(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getStudentsByBatch(batchId: string): Promise<Student[]> {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('batch_id', batchId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Notices
  async getNotices(): Promise<Notice[]> {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createNotice(notice: Omit<Notice, 'id' | 'created_at' | 'updated_at'>): Promise<Notice> {
    const { data, error } = await supabase
      .from('notices')
      .insert([notice])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Student Progress
  async getStudentProgress(studentId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('student_progress')
      .select(`
        *,
        roadmap_tasks (
          task_name,
          task_details,
          task_type,
          points
        )
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async updateStudentProgress(progressId: string, updates: Partial<any>): Promise<any> {
    const { data, error } = await supabase
      .from('student_progress')
      .update(updates)
      .eq('id', progressId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
