import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import {
  Roadmap,
  RoadmapTask,
  RoadmapWeek,
  BatchEnabledResources,
} from '../../../services/database';
import { loadRoadmapInterfaceData } from './loadRoadmapInterfaceData';
import { fetchStudentProgress, fetchWeekCompletionStats } from './roadmapInterfaceApi';
import { EMPTY_RESOURCES, type RoadmapView } from './types';

interface UseRoadmapInterfaceDataParams {
  databaseUserId: string | undefined;
  roadmapSlug: string | undefined;
  searchParams: URLSearchParams;
  user: User | null;
}

export function useRoadmapInterfaceData({
  databaseUserId,
  roadmapSlug,
  searchParams,
  user,
}: UseRoadmapInterfaceDataParams) {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [weeks, setWeeks] = useState<RoadmapWeek[]>([]);
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [studentProgress, setStudentProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Student');
  const [batchId, setBatchId] = useState<string | null>(null);
  const [batchResources, setBatchResources] = useState<BatchEnabledResources>(EMPTY_RESOURCES);
  const [completionStats, setCompletionStats] = useState<{ [weekId: string]: any }>({});
  const [targetWeekNumber, setTargetWeekNumber] = useState<number | null>(null);
  const [enrolledBatches, setEnrolledBatches] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<RoadmapView>('sessions');
  const [selectedTreeKey, setSelectedTreeKey] = useState<string>('agentic');

  const fetchCompletionStats = useCallback(async () => {
    if (!batchId || weeks.length === 0) return;

    try {
      const stats = await fetchWeekCompletionStats(weeks, batchId);
      setCompletionStats(stats);
    } catch (err) {
      console.error('Error fetching completion stats:', err);
    }
  }, [batchId, weeks]);

  const refreshRoadmapData = useCallback(async () => {
    if (!databaseUserId) return;

    try {
      const progressData = await fetchStudentProgress(databaseUserId);
      setStudentProgress(progressData);

      if (weeks.length > 0 && batchId) {
        await fetchCompletionStats();
      }
    } catch (err) {
      console.error('Error refreshing roadmap data:', err);
    }
  }, [databaseUserId, weeks, batchId, fetchCompletionStats]);

  useEffect(() => {
    const fetchRoadmapData = async () => {
      if (!databaseUserId) return;

      try {
        setLoading(true);
        setError(null);

        const result = await loadRoadmapInterfaceData({
          databaseUserId,
          roadmapSlug,
          searchParams,
          user,
        });

        if ('error' in result) {
          setError(result.error);
          setLoading(false);
          return;
        }

        const { data } = result;
        setUserName(data.userName);
        setEnrolledBatches(data.enrolledBatches);
        setStudentProgress(data.studentProgress);
        setRoadmap(data.roadmap);
        setBatchId(data.batchId);
        setBatchResources(data.batchResources);
        setActiveView(data.activeView);
        setSelectedTreeKey(data.selectedTreeKey);
        setWeeks(data.weeks);
        setTasks(data.tasks);
        setTargetWeekNumber(data.targetWeekNumber);
      } catch (err) {
        console.error('Error fetching roadmap data:', err);
        setError('Failed to load roadmap data');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmapData();
  }, [databaseUserId, roadmapSlug, searchParams, user]);

  useEffect(() => {
    if (weeks.length > 0 && batchId && !loading) {
      setTimeout(() => {
        fetchCompletionStats();
      }, 100);
    }
  }, [weeks, batchId, loading, fetchCompletionStats]);

  return {
    roadmap,
    weeks,
    tasks,
    studentProgress,
    loading,
    error,
    userName,
    batchId,
    batchResources,
    completionStats,
    targetWeekNumber,
    enrolledBatches,
    activeView,
    setActiveView,
    selectedTreeKey,
    setSelectedTreeKey,
    refreshRoadmapData,
  };
}
