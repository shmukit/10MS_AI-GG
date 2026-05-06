import { Batch, Notice, Roadmap, RoadmapTask, StudentProfile, StudentProgress, User } from '../services/database';

export interface StudentDashboardData {
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
}
