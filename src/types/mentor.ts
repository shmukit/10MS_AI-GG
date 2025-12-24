export interface RoadmapItem {
    id: string;
    weekNumber: number;
    domain: string;
    taskType: 'Watch' | 'Read' | 'Project' | 'Attend' | 'MCQ' | 'Written';
    taskName: string;
    taskDetails: string;
    relevantLinks: string;
    deadline: string;
    meetingTime?: string;
}

export interface Batch {
    id: string;
    name: string;
    studentCount: number;
    roadmapId: string;
    roadmapName: string;
    whatsappLink: string;
    discordLink: string;
    emergencyContact: string;
    createdDate: string;
}

export interface Student {
    id: string;
    name: string;
    email: string;
    phone: string;
    institute: string;
    year: string;
    subject: string;
    degree: string;
    batchId: string;
    completedWeeks: number;
    progressPercentage: number;
}

export interface Notice {
    id: string;
    title: string;
    content: string;
    tag: 'Reminder' | 'Homework' | 'Assignment' | 'Exam' | 'Cancellation' | 'Resources' | 'Welcome' | string;
    scheduledDate: string;
    scheduledTime: string;
    isPublished: boolean;
    createdAt: string;
    batchId?: string;
}
