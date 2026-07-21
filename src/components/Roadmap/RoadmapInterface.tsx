import React, { useState, useEffect } from 'react';
import { ArrowLeft, GitBranch, Map, Presentation, ChevronDown } from 'lucide-react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth';
import {
  DatabaseService,
  Roadmap,
  RoadmapWeek,
  RoadmapTask,
  BatchEnabledResources,
  EnabledSlideDeck,
} from '../../services/database';
import { supabase } from '../../lib/supabase';
import { RoadmapCanvas } from './RoadmapCanvas';
import { ProgressBar } from './ProgressBar';
import { generateRoadmapData } from '../../data/roadmapData';
import { getNodeUnitLabel } from '../../utils/roadmapNodeUtils';
import { StudentHeader } from '../Student/StudentHeader';
import { RoadmapDropdown } from '../Student/dashboard/RoadmapDropdown';
import { useNavigate } from 'react-router-dom';
import { posthog } from '../../lib/posthog';
import { AgenticDecisionTree } from '../Playbooks/AgenticDecisionTree';
import { RoadmapSlidesModal } from './RoadmapSlidesModal';
import { Breadcrumbs } from '../ui/Breadcrumbs';

type RoadmapView = 'sessions' | 'decision-tree';

const EMPTY_RESOURCES: BatchEnabledResources = {
  slideDecks: [],
  decisionTrees: [],
  usesLegacyFallback: false,
};

interface RoadmapInterfaceProps {
  onBack: () => void;
}

async function resolveStudentBatchId(params: {
  databaseUserId: string;
  roadmapSlug: string;
  roadmapId: string;
  batchIdParam: string | null;
  enrolledBatches: any[];
  fallbackBatch: { id?: string } | null;
}): Promise<string | null> {
  const { databaseUserId, roadmapSlug, roadmapId, batchIdParam, enrolledBatches, fallbackBatch } = params;

  if (batchIdParam) return batchIdParam;

  const batchForRoadmap = await DatabaseService.getStudentBatchForRoadmap(databaseUserId, roadmapId);
  if (batchForRoadmap?.id) return batchForRoadmap.id;

  const enrolledMatch = enrolledBatches.find(
    (batch) =>
      batch.roadmap &&
      DatabaseService.generateRoadmapSlug(batch.roadmap.title) === roadmapSlug
  );
  if (enrolledMatch?.id) return enrolledMatch.id;

  return fallbackBatch?.id ?? null;
}

export const RoadmapInterface: React.FC<RoadmapInterfaceProps> = ({ onBack }) => {
  const { roadmapSlug } = useParams();
  const [searchParams] = useSearchParams();
  const { user, databaseUserId } = useAuth();

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
  const [showRoadmapDropdown, setShowRoadmapDropdown] = useState(false);
  const [activeView, setActiveView] = useState<RoadmapView>('sessions');
  const [selectedTreeKey, setSelectedTreeKey] = useState<string>('agentic');
  const [selectedSlideDeck, setSelectedSlideDeck] = useState<EnabledSlideDeck | null>(null);
  const [showSlidesModal, setShowSlidesModal] = useState(false);
  const [showSlidePicker, setShowSlidePicker] = useState(false);
  const navigate = useNavigate();

  const refreshRoadmapData = async () => {
    if (!databaseUserId) return;

    try {
      const { data: progressData } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', databaseUserId);

      setStudentProgress(progressData || []);

      if (weeks.length > 0 && batchId) {
        await fetchCompletionStats();
      }
    } catch (err) {
      console.error('Error refreshing roadmap data:', err);
    }
  };

  const fetchCompletionStats = async () => {
    if (!batchId || weeks.length === 0) return;

    try {
      const stats: { [weekId: string]: any } = {};

      for (const week of weeks) {
        const weekStats = await DatabaseService.getWeekCompletionStats(week.id, batchId);
        stats[week.id] = weekStats;
      }

      setCompletionStats(stats);
    } catch (error) {
      console.error('Error fetching completion stats:', error);
    }
  };

  const handleBatchChange = async (newBatchId: string) => {
    const selectedBatch = enrolledBatches.find((b) => b.id === newBatchId);
    if (selectedBatch && selectedBatch.roadmap) {
      const slug = DatabaseService.generateRoadmapSlug(selectedBatch.roadmap.title);
      navigate(`/student/roadmap/${slug}?batch_id=${newBatchId}`);
      setShowRoadmapDropdown(false);
    }
  };

  useEffect(() => {
    const fetchRoadmapData = async () => {
      if (!databaseUserId) return;

      try {
        setLoading(true);
        setError(null);

        posthog?.capture('roadmap_view', {
          user_id: databaseUserId,
          roadmap_slug: roadmapSlug,
          viewed_at: new Date().toISOString(),
        });

        const weekParam = searchParams.get('week');
        if (weekParam) {
          const weekNum = parseInt(weekParam, 10);
          if (!isNaN(weekNum) && weekNum > 0) {
            setTargetWeekNumber(weekNum);
          }
        }

        const viewParam = searchParams.get('view');
        const treeParam = searchParams.get('tree');
        const batchIdParam = searchParams.get('batch_id');

        const [userDataQuery, batchQuery, enrolledQuery, progressQuery] = await Promise.all([
          DatabaseService.getUserById(databaseUserId),
          DatabaseService.getStudentBatch(databaseUserId),
          DatabaseService.getEnrolledBatches(databaseUserId),
          supabase.from('student_progress').select('*').eq('student_id', databaseUserId),
        ]);

        if (userDataQuery?.first_name) {
          setUserName(userDataQuery.first_name);
        } else if (user?.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name);
        } else if (user?.email) {
          setUserName(user.email.split('@')[0]);
        }

        const enrolled = enrolledQuery ?? [];
        setEnrolledBatches(enrolled);
        setStudentProgress(progressQuery.data || []);

        if (!roadmapSlug) {
          setError('No roadmap specified in URL');
          setLoading(false);
          return;
        }

        const roadmapData = await DatabaseService.getRoadmapBySlug(roadmapSlug);
        if (!roadmapData) {
          setError(`No roadmap found for "${roadmapSlug}". Please check the URL or contact support.`);
          setLoading(false);
          return;
        }

        setRoadmap(roadmapData);

        const resolvedBatchId = await resolveStudentBatchId({
          databaseUserId,
          roadmapSlug,
          roadmapId: roadmapData.id,
          batchIdParam,
          enrolledBatches: enrolled,
          fallbackBatch: batchQuery,
        });
        setBatchId(resolvedBatchId);

        const resources = await DatabaseService.getBatchEnabledResources(resolvedBatchId, roadmapData);
        setBatchResources(resources);

        if (viewParam === 'decision-tree' && resources.decisionTrees.length > 0) {
          setActiveView('decision-tree');
          const matchedTree = resources.decisionTrees.find((tree) => tree.tree_key === treeParam);
          setSelectedTreeKey(matchedTree?.tree_key ?? resources.decisionTrees[0].tree_key);
        } else {
          setActiveView('sessions');
        }

        const weeksData = await DatabaseService.getRoadmapWeeks(roadmapData.id);
        setWeeks(weeksData);

        if (weeksData.length > 0) {
          const weekIds = weeksData.map((week) => week.id);
          const { data: allTasks, error: tasksError } = await supabase
            .from('roadmap_tasks')
            .select(`*, batch_task_deadlines!left(deadline, batch_id)`)
            .in('week_id', weekIds)
            .order('created_at');

          if (!tasksError && allTasks) {
            const transformedTasks = allTasks.map((task: any) => {
              let finalDeadline = task.deadline;
              if (resolvedBatchId && task.batch_task_deadlines) {
                const deadlines = Array.isArray(task.batch_task_deadlines)
                  ? task.batch_task_deadlines
                  : [task.batch_task_deadlines];
                const batchSpecific = deadlines.find((d: any) => d.batch_id === resolvedBatchId);
                if (batchSpecific?.deadline) finalDeadline = batchSpecific.deadline;
              }
              return { ...task, deadline: finalDeadline };
            });
            setTasks(transformedTasks);
          } else {
            setTasks([]);
          }
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error('Error fetching roadmap data:', err);
        setError('Failed to load roadmap data');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmapData();
  }, [databaseUserId, roadmapSlug, searchParams]);

  useEffect(() => {
    if (weeks.length > 0 && batchId && !loading) {
      setTimeout(() => {
        fetchCompletionStats();
      }, 100);
    }
  }, [weeks, batchId, loading]);

  const handleViewChange = (view: RoadmapView, treeKey?: string) => {
    setActiveView(view);
    const params = new URLSearchParams(searchParams);
    if (batchId) params.set('batch_id', batchId);
    if (view === 'decision-tree') {
      params.set('view', 'decision-tree');
      const key = treeKey ?? selectedTreeKey ?? batchResources.decisionTrees[0]?.tree_key;
      if (key) {
        params.set('tree', key);
        setSelectedTreeKey(key);
      }
    } else {
      params.delete('view');
      params.delete('tree');
    }
    const query = params.toString();
    navigate(`/student/roadmap/${roadmapSlug}${query ? `?${query}` : ''}`, { replace: true });
  };

  const openSlides = () => {
    const decks = batchResources.slideDecks;
    if (decks.length === 0) return;
    if (decks.length === 1) {
      setSelectedSlideDeck(decks[0]);
      setShowSlidesModal(true);
      return;
    }
    setShowSlidePicker(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4 text-foreground">Error Loading Roadmap</h2>
          <p className="text-muted-foreground mb-6">{error || 'No roadmap available'}</p>
          <button onClick={onBack} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const roadmapData = generateRoadmapData(weeks, tasks, studentProgress, batchId || undefined);
  const nodesWithStats = roadmapData.nodes.map((node) => ({
    ...node,
    completionStats: completionStats[node.id] || undefined,
  }));

  const completedNodes = nodesWithStats.filter((node) => {
    const completedTasks = node.tasks.filter((task) => task.completed).length;
    return completedTasks === node.tasks.length && node.tasks.length > 0;
  }).length;

  const nodeUnitLabel = getNodeUnitLabel(roadmap);
  const enabledTrees = batchResources.decisionTrees;
  const showDecisionTree = enabledTrees.length > 0;
  const enabledSlides = batchResources.slideDecks;
  const currentBatch = enrolledBatches.find((b) => b.id === batchId);
  const batchName = currentBatch?.name ?? roadmap.title;

  return (
    <div className="h-screen flex flex-col bg-background">
      <StudentHeader
        userName={userName}
        userRole="student"
        pageTitle="Roadmap"
        actions={
          enrolledBatches.length > 1 && (
            <RoadmapDropdown
              enrolledBatches={enrolledBatches}
              currentBatch={enrolledBatches.find((b) => b.id === batchId) || roadmap}
              showDropdown={showRoadmapDropdown}
              setShowDropdown={setShowRoadmapDropdown}
              handleBatchChange={handleBatchChange}
              selectedBatchId={batchId || ''}
            />
          )
        }
      />

      <div className="border-b border-border min-h-12 md:min-h-16 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 md:py-4">
          <Breadcrumbs
            className="mb-2 md:mb-3"
            items={[
              { label: 'Dashboard', href: '/student/dashboard' },
              { label: 'Roadmap' },
              { label: batchName },
            ]}
          />
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 md:gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-medium text-xs md:text-base">Back to Dashboard</span>
            </button>

            {enabledSlides.length > 0 && (
              <button
                type="button"
                onClick={openSlides}
                className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-primary text-primary-foreground text-xs md:text-sm font-medium hover:bg-primary/90"
              >
                <Presentation className="w-4 h-4" />
                View Slides
                {enabledSlides.length > 1 && <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {showSlidePicker && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-semibold text-foreground mb-4">Choose a slide deck</h3>
            <div className="space-y-2">
              {enabledSlides.map((deck) => (
                <button
                  key={deck.id}
                  onClick={() => {
                    setSelectedSlideDeck(deck);
                    setShowSlidePicker(false);
                    setShowSlidesModal(true);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-accent text-sm"
                >
                  {deck.title}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSlidePicker(false)}
              className="mt-4 w-full py-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {selectedSlideDeck && (
        <RoadmapSlidesModal
          isOpen={showSlidesModal}
          onClose={() => {
            setShowSlidesModal(false);
            setSelectedSlideDeck(null);
          }}
          slidesUrl={selectedSlideDeck.slides_url}
          roadmapTitle={selectedSlideDeck.title || roadmap.title}
        />
      )}

      <ProgressBar completed={completedNodes} total={nodesWithStats.length} />

      {showDecisionTree && (
        <div className="border-b border-border bg-card">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap gap-1 py-2">
              <button
                onClick={() => handleViewChange('sessions')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'sessions'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Map className="w-4 h-4" />
                {nodeUnitLabel}s
              </button>
              {enabledTrees.length === 1 ? (
                <button
                  onClick={() => handleViewChange('decision-tree', enabledTrees[0].tree_key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeView === 'decision-tree'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <GitBranch className="w-4 h-4" />
                  {enabledTrees[0].title}
                </button>
              ) : (
                enabledTrees.map((tree) => (
                  <button
                    key={tree.id}
                    onClick={() => handleViewChange('decision-tree', tree.tree_key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeView === 'decision-tree' && selectedTreeKey === tree.tree_key
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <GitBranch className="w-4 h-4" />
                    {tree.title}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 relative overflow-y-auto">
        {activeView === 'decision-tree' && showDecisionTree ? (
          <AgenticDecisionTree embedded treeKey={selectedTreeKey} />
        ) : (
          <RoadmapCanvas
            roadmapNodes={nodesWithStats}
            onRefresh={refreshRoadmapData}
            batchId={batchId}
            targetWeekNumber={targetWeekNumber}
            nodeUnitLabel={nodeUnitLabel}
            onOpenDecisionTree={
              showDecisionTree
                ? () => handleViewChange('decision-tree', enabledTrees[0]?.tree_key)
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
};
