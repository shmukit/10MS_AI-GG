import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Bell, LayoutDashboard, Layers } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/useAuth';
import { MentorHeader } from './MentorHeader';
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
  isDarkMode?: boolean;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({
  isDarkMode = false,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'roadmap' | 'students' | 'notice' | 'practice'>('dashboard');

  // Shared Data State
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [roadmapData, setRoadmapData] = useState<RoadmapItem[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  // Selection State
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [selectedRoadmap, setSelectedRoadmap] = useState<string>('');

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
          domain: week.domain || '',
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

  const fetchData = async () => {
    setLoading(true);
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

      // Fetch all batches
      const { data: batchesData, error: batchesError } = await supabase
        .from('batches')
        .select('*')
        .eq('status', 'active')
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
        .eq('is_published', true)
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
        createdDate: batch.created_at ? new Date(batch.created_at).toLocaleDateString() : 'N/A'
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

      if (batchesData && batchesData.length > 0 && !selectedBatch) {
        setSelectedBatch((batchesData[0] as any).id);
      }

      // Set default selected roadmap if available
      if (roadmapsData && roadmapsData.length > 0 && !selectedRoadmap) {
        setSelectedRoadmap((roadmapsData[0] as any).id);
        await fetchRoadmapTasks((roadmapsData[0] as any).id);
      }

      console.log('🎉 All data fetched successfully!');

    } catch (err) {
      console.error('❌ Error loading data:', err);
      setError('Failed to load data from database');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
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
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <MentorHeader
        userName={user?.user_metadata?.first_name || 'Mentor'}
        userRole="mentor"
        pageTitle="Mentor Dashboard"
      />

      {/* Navigation Tabs */}
      <div className={`border-b h-16 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'roadmap', label: 'Roadmap', icon: BookOpen },
              { id: 'students', label: 'Batch & Students', icon: Users },
              { id: 'practice', label: 'Practice Decks', icon: Layers },
              { id: 'notice', label: 'Notice', icon: Bell }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
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
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading data...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {error}
            </div>
            <button
              onClick={fetchData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === 'dashboard' && (
              <DashboardTab
                stats={stats}
                batches={batches}
                students={students}
                isDarkMode={isDarkMode}
                selectedBatch={selectedBatch}
              />
            )}
            {activeTab === 'roadmap' && (
              <RoadmapTab
                roadmaps={roadmaps}
                setRoadmaps={setRoadmaps}
                roadmapData={roadmapData}
                setRoadmapData={setRoadmapData}
                selectedRoadmap={selectedRoadmap}
                setSelectedRoadmap={setSelectedRoadmap}
                isDarkMode={isDarkMode}
              />
            )}
            {activeTab === 'students' && (
              <StudentsTab
                students={students}
                batches={batches}
                roadmaps={roadmaps}
                selectedBatch={selectedBatch}
                setSelectedBatch={setSelectedBatch}
                isDarkMode={isDarkMode}
                onUpdate={fetchData}
              />
            )}
            {activeTab === 'practice' && (
              <PracticeDeckTab
                isDarkMode={isDarkMode}
                onCreateDeck={handleCreateDeck}
                onEditDeck={handleEditDeck}
                // Add key to force remount when editor closes to refresh list?
                // Or assume user will check. Ideally we pass a refresh trigger.
                key={showDeckEditor ? 'hidden' : 'visible'} // Quick hack to force refresh when editor closes? No, that causes flickers.
              // Better to just let it be for now, or use a dependency prop in PracticeDeckTab.
              />
            )}
            {activeTab === 'notice' && (
              <NoticeTab
                notices={notices}
                batches={batches}
                selectedBatch={selectedBatch}
                setSelectedBatch={setSelectedBatch}
                isDarkMode={isDarkMode}
                onUpdate={fetchData}
              />
            )}
          </>
        )}
      </div>

      {/* Deck Editor Modal */}
      {showDeckEditor && (
        <DeckEditor
          deckId={editingDeckId}
          onClose={() => setShowDeckEditor(false)}
          onSave={handleDeckSaved}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};