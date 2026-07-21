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
    mentor_profiles?: MentorProfile[];
}

export interface BatchStudentProfile {
    institute: string;
    year: string;
    subject: string;
    degree: string;
    enrollment_date: string;
}

export interface BatchStudentProgress {
    completed_weeks: number;
    progress_percentage: number;
    current_week: number;
}

export type BatchStudent = User & {
    profile?: BatchStudentProfile | null;
    progress: BatchStudentProgress;
};

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
    node_unit_label?: string;
    slides_url?: string | null;
    decision_tree_enabled?: boolean;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/** Cohort switcher entry; full batch when joined, partial when batch row is missing. */
export type EnrolledBatch = Partial<Batch> & {
    id: string;
    name: string;
    roadmap: Roadmap | null;
    assignmentStatus?: string | null;
    enrollment_date?: string | null;
};

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
    week_number?: number;
    meeting_time?: string;
    is_active?: boolean;
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

export interface RoadmapSlideDeck {
    id: string;
    roadmap_id: string;
    title: string;
    slides_url: string;
    sort_order: number;
    is_default_enabled: boolean;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface RoadmapDecisionTree {
    id: string;
    roadmap_id: string;
    title: string;
    tree_key: string;
    sort_order: number;
    is_default_enabled: boolean;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface EnabledSlideDeck extends RoadmapSlideDeck {
    is_enabled: boolean;
}

export interface EnabledDecisionTree extends RoadmapDecisionTree {
    is_enabled: boolean;
}

export interface BatchEnabledResources {
    slideDecks: EnabledSlideDeck[];
    decisionTrees: EnabledDecisionTree[];
    usesLegacyFallback: boolean;
}

export interface BatchResourceSelection {
    slideDecks: { id: string; is_enabled: boolean }[];
    decisionTrees: { id: string; is_enabled: boolean }[];
}
