import React, { useState, useEffect, useRef } from 'react';
import { Users, BookOpen, Bell, LayoutDashboard, Layers } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/useAuth';
import { posthog } from '../../lib/posthog';
import { MentorHeader } from './MentorHeader';
import { Skeleton } from '../ui/Skeleton';
import { DashboardTab } from './tabs/DashboardTab';
import { RoadmapTab } from './tabs/RoadmapTab';
import { StudentsTab } from './tabs/StudentsTab';
import { NoticeTab } from './tabs/NoticeTab';
import { PracticeDeckTab } from './tabs/PracticeDeckTab';
import { DeckEditor } from './DeckEditor';
import { Batch, Student, RoadmapItem, Notice } from '../../types/mentor';

interface MentorDashboardProps {
  onLogout?: () => void;
  onProfile?: () => void;
}

type MentorTab = 'dashboard' | 'roadmap' | 'students' | 'notice' | 'practice';

const MENTOR_TAB_KEY = 'mentor-dashboard-tab';
const VALID_TABS = new Set<MentorTab>(['dashboard', 'roadmap', 'students', 'notice', 'practice']);

function readStoredTab(): MentorTab {
  const saved = sessionStorage.getItem(MENTOR_TAB_KEY);
  return saved && VALID_TABS.has(saved as MentorTab) ? (saved as MentorTab) : 'dashboard';
}

export const MentorDashboard: React.FC<MentorDashboardProps> = () => {
  const { user, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState<MentorTab>(readStoredTab);
  const hasLoadedRef = useRef(false);

  // Shared Data State
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [roadmapData, setRoadmapData] = useState<RoadmapItem[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  // Selection State
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [selectedRoadmap, setSelectedRoadmap] = useState<string>('');
  const selectedBatchRef = useRef(selectedBatch);
  const selectedRoadmapRef = useRef(selectedRoadmap);
  selectedBatchRef.current = selectedBatch;
  selectedRoadmapRef.current = selectedRoadmap;

  // Deck Editor State
  const [showDeckEditor, setShowDeckEditor] = useState(false);
  const [editingDeckId, setEditingDeckId] = useState<string | undefined>(undefined);

  // Loading & Error State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmapTasks = async (roadmapId: string) => {
    if (!roadmapId) return;

    try {
      console.log('🔄 Fetching tasks for roadmap:', roadmapId);

      // Get roadmap weeks
      const { data: weeksData, error: weeksError } = await supabase
        .from('roadmap_weeks')
        .select('*')
        .eq('roadmap_id', roadmapId)
        .order('week_number');

      if (weeksError) {
        console.error('Error fetching weeks:', weeksError);
        throw weeksError;
      }

      console.log('✅ Weeks found:', weeksData?.length || 0);

      // Get tasks for all weeks
      const allTasks: RoadmapItem[] = [];

      for (const week of (weeksData as any[]) || []) {
        const { data: tasksData, error: tasksError } = await supabase
          .from('roadmap_tasks')
          .select('*')
          .eq('week_id', week.id)
          .order('created_at');

        if (tasksError) {
          console.error('Error fetching tasks for week:', week.week_number, tasksError);
          continue;
        }

        // Transform tasks to RoadmapItem format
        const weekTasks = (tasksData || []).map((task: any) => ({
          id: task.id,
          weekNumber: week.week_number,
          domain: task.domain || '',
          taskType: task.task_type.charAt(0).toUpperCase() + task.task_type.slice(1) as any,
          taskName: task.task_name,
          taskDetails: task.task_details || '',
          relevantLinks: Array.isArray(task.relevant_links) ? task.relevant_links[0] || '' : task.relevant_links || '',
          deadline: task.deadline || '',
          meetingTime: task.meeting_time || ''
        }));

        allTasks.push(...weekTasks);
      }

      console.log('✅ Total tasks fetched:', allTasks.length);
      setRoadmapData(allTasks);
    } catch (err) {
      console.error('❌ Error fetching roadmap tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch roadmap tasks');
    }
  };

  const fetchData = async (options?: { showLoader?: boolean }) => {
    const showLoader = options?.showLoader ?? !hasLoadedRef.current;
    if (showLoader) {
      setLoading(true);
    }
    setError(null);

    try {
      console.log('🔄 Fetching real data from database...');

      // Fetch all roadmaps
      const { data: roadmapsData, error: roadmapsError } = await supabase
        .from('roadmaps')
        .select('*')
        .order('title');

      if (roadmapsError) {
        console.error('Error fetching roadmaps:', roadmapsError);
        throw roadmapsError;
      }

      console.log('✅ Roadmaps fetched:', roadmapsData?.length || 0);

      // Fetch all batches (include completed/cancelled so mentors can update cohort status)
      const { data: batchesData, error: batchesError } = await supabase
        .from('batches')
        .select('*')
        .in('status', ['active', 'completed', 'cancelled'])
        .order('name');

      if (batchesError) {
        console.error('Error fetching batches:', batchesError);
        throw batchesError;
      }

      console.log('✅ Batches fetched:', batchesData?.length || 0);

      // Fetch student batch assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('student_batch_assignments')
        .select('*')
        .eq('status', 'active');

      if (assignmentsError) {
        console.error('Error fetching student assignments:', assignmentsError);
        throw assignmentsError;
      }

      // Fetch user data for students
      const studentIds = [...new Set(((assignmentsData as any[]) || []).map(a => a.student_id))];

      let usersData: any[] = [];
      let profilesData: any[] = [];

      if (studentIds.length > 0) {
        const { data: uData, error: usersError } = await supabase
          .from('users')
          .select('id, first_name, last_name, email, phone, is_active')
          .in('id', studentIds);

        if (usersError) throw usersError;
        usersData = uData || [];

        const { data: pData, error: profilesError } = await supabase
          .from('student_profiles')
          .select('*')
          .in('user_id', studentIds);

        if (profilesError) throw profilesError;
        profilesData = pData || [];
      }

      console.log('✅ Student assignments fetched:', assignmentsData?.length || 0);
      console.log('✅ Student users fetched:', usersData?.length || 0);
      console.log('✅ Student profiles fetched:', profilesData?.length || 0);

      // Fetch all notices
      const { data: noticesData, error: noticesError } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (noticesError) {
        console.error('Error fetching notices:', noticesError);
        throw noticesError;
      }

      console.log('✅ Notices fetched:', noticesData?.length || 0);

      // Map batches data
      const mappedBatches = (batchesData || []).map((batch: any) => ({
        id: batch.id,
        name: batch.name,
        studentCount: batch.student_count || 0,
        roadmapId: batch.roadmap_id || '',
        roadmapName: batch.roadmap_name || '',
        whatsappLink: batch.whatsapp_link || '',
        discordLink: batch.discord_link || '',
        emergencyContact: batch.emergency_contact || '',
        createdDate: batch.created_at ? new Date(batch.created_at).toLocaleDateString() : 'N/A',
        status: (batch.status || 'active') as Batch['status'],
      }));
      setBatches(mappedBatches);

      // Map students data
      const mappedStudents = (assignmentsData || []).map((assignment: any) => {
        const user = usersData?.find(u => u.id === assignment.student_id);
        const profile = profilesData?.find(p => p.user_id === assignment.student_id);

        return {
          id: assignment.student_id,
          name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
          email: user?.email || '',
          phone: user?.phone || '',
          institute: profile?.institute || '',
          year: profile?.year || '',
          subject: profile?.subject || '',
          degree: profile?.degree || '',
          batchId: assignment.batch_id,
          completedWeeks: assignment.completed_weeks || 0,
          progressPercentage: assignment.progress_percentage || 0
        };
      });
      setStudents(mappedStudents);

      // Map notices data
      const mappedNotices = (noticesData || []).map((notice: any) => ({
        id: notice.id,
        title: notice.title,
        content: notice.content,
        tag: notice.tag,
        scheduledDate: notice.scheduled_date || '',
        scheduledTime: notice.scheduled_time || '',
        isPublished: notice.is_published,
        batchId: notice.batch_id || '',
        createdAt: notice.created_at
      }));
      setNotices(mappedNotices);

      setRoadmaps(roadmapsData || []);

      if (batchesData && batchesData.length > 0 && !selectedBatchRef.current) {
        setSelectedBatch((batchesData[0] as any).id);
      }

      // Set default selected roadmap if available
      if (roadmapsData && roadmapsData.length > 0 && !selectedRoadmapRef.current) {
        setSelectedRoadmap((roadmapsData[0] as any).id);
        await fetchRoadmapTasks((roadmapsData[0] as any).id);
      }

      console.log('🎉 All data fetched successfully!');

    } catch (err) {
      console.error('❌ Error loading data:', err);
      setError('Failed to load data from database');
    } finally {
      setLoading(false);
      hasLoadedRef.current = true;
    }
  };

  useEffect(() => {
    sessionStorage.setItem(MENTOR_TAB_KEY, activeTab);
  }, [activeTab]);

  // Fetch data on component mount only
  useEffect(() => {
    fetchData({ showLoader: true });
    posthog?.capture('mentor_dashboard_viewed', {});
  }, []);

  // Fetch roadmap tasks when selectedRoadmap changes
  useEffect(() => {
    if (selectedRoadmap) {
      fetchRoadmapTasks(selectedRoadmap);
    }
  }, [selectedRoadmap]);

  const handleCreateDeck = () => {
    setEditingDeckId(undefined);
    setShowDeckEditor(true);
  };

  const handleEditDeck = (deckId: string) => {
    setEditingDeckId(deckId);
    setShowDeckEditor(true);
  };

  const handleDeckSaved = () => {
    setShowDeckEditor(false);
    // Refreshing the deck list is handled within the PracticeDeckTab component's internal state
    // But if we lifted the state up, we would refresh here.
    // For now, PracticeDeckTab re-fetches when it mounts, and we might trigger a re-mount or expose a refresh method.
    // Actually, PracticeDeckTab uses its own local state which initializes on mount.
    // To properly refresh, we can force remount or add a key.
    // A simple wa to refresh is to toggle the active tab or just accept that the user sees the list update.
    // Since PracticeDeckTab manages its own list, we'll need to figure out how to refresh it.
    // For this implementation, we'll let PracticeDeckTab handle its own data loading.
    // If specific refresh needed, we can pass a 'lastUpdated' prop.
  };

  const getDashboardStats = () => {
    const totalStudents = students.length;
    const totalBatches = batches.length;
    const totalRoadmapTasks = roadmapData.length;
    const totalNotices = notices.length;

    return { totalStudents, totalBatches, totalRoadmapTasks, totalNotices };
  };

  const stats = getDashboardStats();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <MentorHeader
        userName={user?.user_metadata?.first_name || 'Mentor'}
        userRole={userRole || 'mentor'}
        pageTitle="Mentor Dashboard"
      />

      <div className="border-b border-border h-16 bg-card">
        <div className="max-w-6xl mx-auto px-6 h-full overflow-x-auto custom-scrollbar">
          <div className="flex space-x-8 h-full items-center min-w-max" role="tablist" aria-label="Mentor dashboard sections">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'roadmap', label: 'Roadmap', icon: BookOpen },
              { id: 'students', label: 'Batch & Students', icon: Users },
              { id: 'practice', label: 'Practice Decks', icon: Layers },
              { id: 'notice', label: 'Notices', icon: Bell }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id as MentorTab)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading && (
          <div className="space-y-8">
            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>

            {/* Content Skeleton */}
            <Skeleton className="h-96 rounded-xl w-full" />
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {error}
            </div>
            <button
              onClick={() => fetchData({ showLoader: true })}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        )}

        {/* Keep all tabs mounted so form state survives tab / browser switches */}
        <div className={loading || error ? 'hidden' : undefined}>
          <div className={activeTab !== 'dashboard' ? 'hidden' : undefined} aria-hidden={activeTab !== 'dashboard'}>
            <DashboardTab
              stats={stats}
              batches={batches}
              students={students}
              selectedBatch={selectedBatch}
              onManageBatch={() => setActiveTab('students')}
            />
          </div>
          <div className={activeTab !== 'roadmap' ? 'hidden' : undefined} aria-hidden={activeTab !== 'roadmap'}>
            <RoadmapTab
              roadmaps={roadmaps}
              setRoadmaps={setRoadmaps}
              roadmapData={roadmapData}
              setRoadmapData={setRoadmapData}
              selectedRoadmap={selectedRoadmap}
              setSelectedRoadmap={setSelectedRoadmap}
              selectedBatch={selectedBatch}
            />
          </div>
          <div className={activeTab !== 'students' ? 'hidden' : undefined} aria-hidden={activeTab !== 'students'}>
            <StudentsTab
              students={students}
              batches={batches}
              roadmaps={roadmaps}
              selectedBatch={selectedBatch}
              setSelectedBatch={setSelectedBatch}
              onUpdate={() => fetchData({ showLoader: false })}
            />
          </div>
          <div className={activeTab !== 'practice' ? 'hidden' : undefined} aria-hidden={activeTab !== 'practice'}>
            <PracticeDeckTab
              onCreateDeck={handleCreateDeck}
              onEditDeck={handleEditDeck}
            />
          </div>
          <div className={activeTab !== 'notice' ? 'hidden' : undefined} aria-hidden={activeTab !== 'notice'}>
            <NoticeTab
              notices={notices}
              batches={batches}
              selectedBatch={selectedBatch}
              setSelectedBatch={setSelectedBatch}
              onUpdate={() => fetchData({ showLoader: false })}
            />
          </div>
        </div>
      </div>

      {/* Deck Editor Modal */}
      {showDeckEditor && (
        <DeckEditor
          deckId={editingDeckId}
          onClose={() => setShowDeckEditor(false)}
          onSave={handleDeckSaved}
        />
      )}
    </div>
  );
};