import { RoadmapItem } from '../../../../../types/mentor';

export interface UseRoadmapTabProps {
    roadmaps: any[];
    setRoadmaps: React.Dispatch<React.SetStateAction<any[]>>;
    roadmapData: RoadmapItem[];
    setRoadmapData: React.Dispatch<React.SetStateAction<RoadmapItem[]>>;
    selectedRoadmap: string;
    setSelectedRoadmap: (id: string) => void;
    selectedBatch?: string;
}

export type NewTaskForm = Omit<RoadmapItem, 'id'> & { meetingTime?: string };

export type NewRoadmapForm = {
    title: string;
    description: string;
    total_weeks: number;
    node_unit_label: string;
    slides_url: string;
    decision_tree_enabled: boolean;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    prerequisites: string;
    category: string;
};

export const DEFAULT_NEW_TASK: NewTaskForm = {
    weekNumber: 1,
    domain: '',
    taskType: 'Watch',
    taskName: '',
    taskDetails: '',
    relevantLinks: '',
    deadline: '',
    meetingTime: '',
};

export const DEFAULT_NEW_ROADMAP: NewRoadmapForm = {
    title: '',
    description: '',
    total_weeks: 8,
    node_unit_label: 'Week',
    slides_url: '',
    decision_tree_enabled: false,
    difficulty_level: 'beginner',
    prerequisites: '',
    category: '',
};
