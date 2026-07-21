import { useCallback, useState } from 'react';
import {
    selectCurrentRoadmap,
    selectFilteredTasks,
    selectNodeLabel,
    selectWeekOptions,
} from './roadmapSelectors';
import { useRoadmapManagement } from './useRoadmapManagement';
import { useRoadmapNodes } from './useRoadmapNodes';
import { useRoadmapTasks } from './useRoadmapTasks';
import type { UseRoadmapTabProps } from './types';

export const useRoadmapTab = ({
    roadmaps,
    setRoadmaps,
    roadmapData,
    setRoadmapData,
    selectedRoadmap,
    setSelectedRoadmap,
    selectedBatch,
}: UseRoadmapTabProps) => {
    const [weekFilter, setWeekFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const getCurrentRoadmap = useCallback(
        () => selectCurrentRoadmap(roadmaps, selectedRoadmap),
        [roadmaps, selectedRoadmap]
    );

    const getNodeLabel = useCallback(
        () => selectNodeLabel(roadmaps, selectedRoadmap),
        [roadmaps, selectedRoadmap]
    );

    const getWeekOptions = useCallback(
        () => selectWeekOptions(roadmaps, selectedRoadmap),
        [roadmaps, selectedRoadmap]
    );

    const getFilteredTasks = useCallback(
        () => selectFilteredTasks(roadmapData, weekFilter, typeFilter),
        [roadmapData, weekFilter, typeFilter]
    );

    const {
        refreshRoadmapNodes,
        ...nodeState
    } = useRoadmapNodes({
        selectedRoadmap,
        roadmaps,
        setRoadmaps,
        getCurrentRoadmap,
        getNodeLabel,
    });

    const tasks = useRoadmapTasks({
        selectedRoadmap,
        selectedBatch,
        roadmapData,
        setRoadmapData,
        getNodeLabel,
        refreshRoadmapNodes,
    });

    const management = useRoadmapManagement({
        roadmaps,
        setRoadmaps,
        selectedRoadmap,
        setSelectedRoadmap,
        setRoadmapData,
    });

    return {
        weekFilter,
        setWeekFilter,
        typeFilter,
        setTypeFilter,
        ...nodeState,
        ...tasks,
        ...management,
        getNodeLabel,
        getCurrentRoadmap,
        getWeekOptions,
        getFilteredTasks,
    };
};
