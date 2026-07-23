export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Existing Tables
      batches: {
        Row: {
          id: string
          name: string
          roadmap_id: string | null
          mentor_id: string | null
          max_students: number
          current_students: number
          start_date: string
          end_date: string | null
          whatsapp_link: string | null
          discord_link: string | null
          emergency_contact: string | null
          status: 'active' | 'completed' | 'cancelled' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          roadmap_id?: string | null
          mentor_id?: string | null
          max_students?: number
          current_students?: number
          start_date: string
          end_date?: string | null
          whatsapp_link?: string | null
          discord_link?: string | null
          emergency_contact?: string | null
          status?: 'active' | 'completed' | 'cancelled' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          roadmap_id?: string | null
          mentor_id?: string | null
          max_students?: number
          current_students?: number
          start_date?: string
          end_date?: string | null
          whatsapp_link?: string | null
          discord_link?: string | null
          emergency_contact?: string | null
          status?: 'active' | 'completed' | 'cancelled' | null
          created_at?: string
          updated_at?: string
        }
      }
      batch_mentors: {
        Row: {
          batch_id: string
          mentor_id: string
          created_at: string
        }
        Insert: {
          batch_id: string
          mentor_id: string
          created_at?: string
        }
        Update: {
          batch_id?: string
          mentor_id?: string
          created_at?: string
        }
      }
      mentor_profiles: {
        Row: {
          id: string
          user_id: string | null
          organization: string
          designation: string
          expertise_areas: string[] | null
          bio: string | null
          years_of_experience: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          organization: string
          designation: string
          expertise_areas?: string[] | null
          bio?: string | null
          years_of_experience?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          organization?: string
          designation?: string
          expertise_areas?: string[] | null
          bio?: string | null
          years_of_experience?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      notices: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string | null
          batch_id: string | null
          tag: string | null
          priority: 'low' | 'medium' | 'high' | 'urgent' | null
          scheduled_date: string | null
          scheduled_time: string | null
          is_published: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id?: string | null
          batch_id?: string | null
          tag?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent' | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          is_published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string | null
          batch_id?: string | null
          tag?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent' | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          is_published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      roadmap_tasks: {
        Row: {
          id: string
          week_id: string | null
          task_name: string
          task_details: string | null
          task_type: 'watch' | 'read' | 'project' | 'attend' | 'mcq' | 'written'
          relevant_links: string[] | null
          deadline: string | null
          estimated_hours: number | null
          points: number | null
          is_required: boolean | null
          created_at: string | null
          meeting_time: string | null
          is_active: boolean | null
        }
        Insert: {
          id?: string
          week_id?: string | null
          task_name: string
          task_details?: string | null
          task_type: 'watch' | 'read' | 'project' | 'attend' | 'mcq' | 'written'
          relevant_links?: string[] | null
          deadline?: string | null
          estimated_hours?: number | null
          points?: number | null
          is_required?: boolean | null
          created_at?: string | null
          meeting_time?: string | null
          is_active?: boolean | null
        }
        Update: {
          id?: string
          week_id?: string | null
          task_name?: string
          task_details?: string | null
          task_type?: 'watch' | 'read' | 'project' | 'attend' | 'mcq' | 'written'
          relevant_links?: string[] | null
          deadline?: string | null
          estimated_hours?: number | null
          points?: number | null
          is_required?: boolean | null
          created_at?: string | null
          meeting_time?: string | null
          is_active?: boolean | null
        }
      }
      roadmap_weeks: {
        Row: {
          id: string
          roadmap_id: string | null
          week_number: number
          title: string
          description: string | null
          domain: string
          created_at: string | null
        }
        Insert: {
          id?: string
          roadmap_id?: string | null
          week_number: number
          title: string
          description?: string | null
          domain: string
          created_at?: string | null
        }
        Update: {
          id?: string
          roadmap_id?: string | null
          week_number?: number
          title?: string
          description?: string | null
          domain?: string
          created_at?: string | null
        }
      }
      roadmaps: {
        Row: {
          id: string
          title: string
          description: string | null
          total_weeks: number
          difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null
          category: string
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          total_weeks: number
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | null
          category: string
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          total_weeks?: number
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | null
          category: string
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      student_batch_assignments: {
        Row: {
          id: string
          student_id: string | null
          batch_id: string | null
          enrollment_date: string | null
          status: 'active' | 'completed' | 'dropped' | 'suspended' | null
          progress_percentage: number | null
          completed_weeks: number | null
          created_at: string | null
          updated_at: string | null
          xp_points: number | null // Added in Phase 1
        }
        Insert: {
          id?: string
          student_id?: string | null
          batch_id?: string | null
          enrollment_date?: string | null
          status?: 'active' | 'completed' | 'dropped' | 'suspended' | null
          progress_percentage?: number | null
          completed_weeks?: number | null
          created_at?: string | null
          updated_at?: string | null
          xp_points?: number | null
        }
        Update: {
          id?: string
          student_id?: string | null
          batch_id?: string | null
          enrollment_date?: string | null
          status?: 'active' | 'completed' | 'dropped' | 'suspended' | null
          progress_percentage?: number | null
          completed_weeks?: number | null
          created_at?: string | null
          updated_at?: string | null
          xp_points?: number | null
        }
      }
      student_profiles: {
        Row: {
          id: string
          user_id: string | null
          institute: string
          year: string
          subject: string
          degree: string
          completed_weeks: number | null
          progress_percentage: number | null
          enrollment_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          institute: string
          year: string
          subject: string
          degree: string
          completed_weeks?: number | null
          progress_percentage?: number | null
          enrollment_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          institute?: string
          year?: string
          subject?: string
          degree?: string
          completed_weeks?: number | null
          progress_percentage?: number | null
          enrollment_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      student_progress: {
        Row: {
          id: string
          student_id: string | null
          task_id: string | null
          status: 'not_started' | 'in_progress' | 'completed' | 'overdue' | null
          completed_at: string | null
          score: number | null
          feedback: string | null
          submitted_files: string[] | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          student_id?: string | null
          task_id?: string | null
          status?: 'not_started' | 'in_progress' | 'completed' | 'overdue' | null
          completed_at?: string | null
          score?: number | null
          feedback?: string | null
          submitted_files?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string | null
          task_id?: string | null
          status?: 'not_started' | 'in_progress' | 'completed' | 'overdue' | null
          completed_at?: string | null
          score?: number | null
          feedback?: string | null
          submitted_files?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string | null
          session_token: string
          expires_at: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_token: string
          expires_at: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          session_token?: string
          expires_at?: string
          created_at?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          role: 'student' | 'mentor' | 'admin'
          first_name: string
          last_name: string
          profile_picture_url: string | null
          phone: string | null
          is_active: boolean | null
          email_verified: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          role: 'student' | 'mentor' | 'admin'
          first_name: string
          last_name: string
          profile_picture_url?: string | null
          phone?: string | null
          is_active?: boolean | null
          email_verified?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          role?: 'student' | 'mentor' | 'admin'
          first_name?: string
          last_name?: string
          profile_picture_url?: string | null
          phone?: string | null
          is_active?: boolean | null
          email_verified?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }

      // New Tables (Phase 1)
      concepts: {
        Row: {
          id: string
          name: string
          description: string | null
          parent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          parent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          parent_id?: string | null
          created_at?: string
        }
      }
      concept_relationships: {
        Row: {
          source_id: string
          target_id: string
          type: 'prerequisite' | 'related'
          created_at: string
        }
        Insert: {
          source_id: string
          target_id: string
          type: 'prerequisite' | 'related'
          created_at?: string
        }
        Update: {
          source_id?: string
          target_id?: string
          type?: 'prerequisite' | 'related'
          created_at?: string
        }
      }
      student_concept_mastery: {
        Row: {
          student_id: string
          concept_id: string
          mastery_level: number
          streak_count: number
          last_practiced_at: string | null
          next_review_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          student_id: string
          concept_id: string
          mastery_level?: number
          streak_count?: number
          last_practiced_at?: string | null
          next_review_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          student_id?: string
          concept_id?: string
          mastery_level?: number
          streak_count?: number
          last_practiced_at?: string | null
          next_review_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      practice_decks: {
        Row: {
          id: string
          title: string
          description: string | null
          cover_image: string | null
          roadmap_id: string | null
          created_by: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          cover_image?: string | null
          roadmap_id?: string | null
          created_by?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          cover_image?: string | null
          roadmap_id?: string | null
          created_by?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      practice_cards: {
        Row: {
          id: string
          deck_id: string
          concept_id: string | null
          card_type: 'text' | 'image' | 'video' | 'quiz'
          content: Json
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          deck_id: string
          concept_id?: string | null
          card_type: 'text' | 'image' | 'video' | 'quiz'
          content: Json
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          deck_id?: string
          concept_id?: string | null
          card_type?: 'text' | 'image' | 'video' | 'quiz'
          content?: Json
          order_index?: number
          created_at?: string
        }
      }
      roadmap_discussions: {
        Row: {
          id: string
          entity_type: 'roadmap' | 'week' | 'task'
          entity_id: string
          user_id: string | null
          content: string
          parent_id: string | null
          is_pinned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          entity_type: 'roadmap' | 'week' | 'task'
          entity_id: string
          user_id?: string | null
          content: string
          parent_id?: string | null
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          entity_type?: 'roadmap' | 'week' | 'task'
          entity_id?: string
          user_id?: string | null
          content?: string
          parent_id?: string | null
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      live_sessions: {
        Row: {
          id: string
          batch_id: string | null
          mentor_id: string | null
          title: string
          description: string | null
          start_time: string
          duration_minutes: number
          meeting_link: string | null
          platform: string
          session_type: 'clinic' | 'anchor' | 'workshop' | 'office_hours' | null
          target_audience: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          batch_id?: string | null
          mentor_id?: string | null
          title: string
          description?: string | null
          start_time: string
          duration_minutes?: number
          meeting_link?: string | null
          platform?: string
          session_type?: 'clinic' | 'anchor' | 'workshop' | 'office_hours' | null
          target_audience?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          batch_id?: string | null
          mentor_id?: string | null
          title?: string
          description?: string | null
          start_time?: string
          duration_minutes?: number
          meeting_link?: string | null
          platform?: string
          session_type?: 'clinic' | 'anchor' | 'workshop' | 'office_hours' | null
          target_audience?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      roadmap_slide_decks: {
        Row: {
          id: string
          roadmap_id: string
          title: string
          slides_url: string
          sort_order: number
          is_default_enabled: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          roadmap_id: string
          title: string
          slides_url: string
          sort_order?: number
          is_default_enabled?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          roadmap_id?: string
          title?: string
          slides_url?: string
          sort_order?: number
          is_default_enabled?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      roadmap_decision_trees: {
        Row: {
          id: string
          roadmap_id: string
          title: string
          tree_key: string
          sort_order: number
          is_default_enabled: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          roadmap_id: string
          title: string
          tree_key: string
          sort_order?: number
          is_default_enabled?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          roadmap_id?: string
          title?: string
          tree_key?: string
          sort_order?: number
          is_default_enabled?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      batch_slide_decks: {
        Row: {
          batch_id: string
          slide_deck_id: string
          is_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          batch_id: string
          slide_deck_id: string
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          batch_id?: string
          slide_deck_id?: string
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      batch_decision_trees: {
        Row: {
          batch_id: string
          decision_tree_id: string
          is_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          batch_id: string
          decision_tree_id: string
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          batch_id?: string
          decision_tree_id?: string
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      student_card_mastery: {
        Row: {
          student_id: string
          card_id: string
          mastery_level: number | null
          streak: number | null
          last_practiced_at: string | null
          next_review_at: string | null
        }
        Insert: {
          student_id: string
          card_id: string
          mastery_level?: number | null
          streak?: number | null
          last_practiced_at?: string | null
          next_review_at?: string | null
        }
        Update: {
          student_id?: string
          card_id?: string
          mastery_level?: number | null
          streak?: number | null
          last_practiced_at?: string | null
          next_review_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_new_user: {
        Args: {
          p_email: string
          p_password: string
          p_first_name: string
          p_last_name: string
          p_role: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
