import { RoadmapItem } from '../../../../../types/mentor';
import { getNodeUnitLabel } from '../../../../../utils/roadmapNodeUtils';

export function selectCurrentRoadmap(roadmaps: any[], selectedRoadmap: string) {
    return roadmaps.find(r => r.id === selectedRoadmap) || roadmaps[0];
}

export function selectNodeLabel(roadmaps: any[], selectedRoadmap: string) {
    return getNodeUnitLabel(selectCurrentRoadmap(roadmaps, selectedRoadmap));
}

export function selectWeekOptions(roadmaps: any[], selectedRoadmap: string) {
    const current = selectCurrentRoadmap(roadmaps, selectedRoadmap);
    return current && current.total_weeks
        ? Array.from({ length: current.total_weeks }, (_, i) => i + 1)
        : [];
}

export function selectFilteredTasks(
    roadmapData: RoadmapItem[],
    weekFilter: string,
    typeFilter: string
) {
    return roadmapData.filter(task => {
        const matchesWeek = weekFilter ? task.weekNumber.toString() === weekFilter : true;
        const matchesType = typeFilter ? task.taskType === typeFilter : true;
        return matchesWeek && matchesType;
    });
}
