import { supabase } from '../../lib/supabase';
import { cache, CACHE_KEYS, CACHE_TTL } from '../../lib/cache';
import {
    StudentProfile,
    Batch,
    Roadmap,
    StudentProgress,
    Notice,
    User,
    RoadmapTask
} from '../../types/models';
import { getUserById } from './userService';
import { getStudentProfile } from './studentService';
import { getStudentBatch, getStudentBatchForRoadmap, getAnyActiveBatchForRoadmap } from './batchService';
import {
    getStudentRoadmap,
    getEnrolledRoadmaps,
    getCurrentWeekTasks,
    getUpcomingTasks
} from './roadmapService';
import { getStudentProgress } from './progressService';
import { getNotices } from './noticeService';
import { getMentors } from './mentorService';

export const getDashboardData = async (userId: string, selectedRoadmapId?: string): Promise<{
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
}> => {
    try {
        // Check cache first (but bypass cache for company users during debugging)
        const userInfo = await getUserById(userId);
        const isCompanyUser = userInfo?.email?.includes('@10minuteschool.com') || userInfo?.email?.includes('@lightcastlepartners.com');

        const cacheKey = cache.createKey(CACHE_KEYS.DASHBOARD_DATA, userId, selectedRoadmapId || 'default');

        // Temporarily bypass cache for company users to ensure fresh data
        if (!isCompanyUser) {
            const cachedData = cache.get(cacheKey);
            if (cachedData) {
                console.log('🎯 Returning cached data for non-company user');
                return cachedData as any;
            }
        } else {
            console.log('🏢 Bypassing cache for company user to ensure fresh data');
        }

        // Skip expensive cleanup unless there are known issues
        // await this.cleanupDuplicateProfiles(userId);

        // Fetching dashboard data components
        const [profile, defaultBatch, roadmap, enrolledRoadmaps, progress, userData] = await Promise.all([
            getStudentProfile(userId),
            getStudentBatch(userId), // Keep this as fallback/default
            getStudentRoadmap(userId),
            getEnrolledRoadmaps(userId),
            getStudentProgress(userId),
            getUserById(userId)
        ]);

        // Determine the actual batch to use
        let batch = defaultBatch;
        if (selectedRoadmapId) {
            let specificBatch = await getStudentBatchForRoadmap(userId, selectedRoadmapId);

            if (!specificBatch) {
                // Fallback: If user isn't assigned, get ANY active batch for this roadmap
                // so the dashboard (leaderboard etc) shows relevant data
                specificBatch = await getAnyActiveBatchForRoadmap(selectedRoadmapId);
            }

            if (specificBatch) {
                batch = specificBatch;
                console.log(`🎯 Using batch for roadmap ${selectedRoadmapId}: ${batch.name}`);
            }
        } else if (roadmap?.id) {
            // If no selected roadmap but we have a current default roadmap
            let specificBatch = await getStudentBatchForRoadmap(userId, roadmap.id);

            if (!specificBatch) {
                specificBatch = await getAnyActiveBatchForRoadmap(roadmap.id);
            }

            if (specificBatch) {
                batch = specificBatch;
            }
        }

        // Dashboard data components fetched
        console.log('📊 Dashboard data components fetched');
        console.log('👤 Profile:', profile);
        console.log('📦 Batch:', batch);
        console.log('🗺️  Roadmap:', roadmap);
        console.log('📚 Enrolled Roadmaps:', enrolledRoadmaps);
        console.log('📈 Progress:', progress);
        console.log('👤 User Data:', userData);

        // Debug: Check if any component is null
        if (!profile) console.log('⚠️  Profile is null');
        if (!batch) console.log('⚠️  Batch is null');
        if (!roadmap) console.log('⚠️  Roadmap is null');
        if (!enrolledRoadmaps || enrolledRoadmaps.length === 0) console.log('⚠️  No enrolled roadmaps');
        if (!progress || progress.length === 0) console.log('⚠️  No progress data');
        if (!userData) console.log('⚠️  User data is null');

        // Get notices and mentors based on the selected roadmap
        let notices: Notice[] = [];
        let mentors: User[] = [];

        if (selectedRoadmapId) {
            // If a specific roadmap is selected, get data for that roadmap
            // Getting roadmap-specific data

            // Get the roadmap to find its associated batch
            const { data: roadmapData, error: roadmapError } = await supabase
                .from('roadmaps')
                .select('*')
                .eq('id', selectedRoadmapId)
                .single();

            if (roadmapError) {
                console.error('Error fetching roadmap:', roadmapError);
            }

            if (roadmapData) {
                const roadmap = roadmapData as unknown as Roadmap;
                console.log('📊 Found roadmap:', roadmap.title);

                // Find batches associated with this roadmap
                const { data: roadmapBatches, error: batchError } = await supabase
                    .from('batches')
                    .select('*')
                    .eq('roadmap_id', selectedRoadmapId);

                if (batchError) {
                    console.error('Error fetching roadmap batches:', batchError);
                }

                if (roadmapBatches && roadmapBatches.length > 0) {
                    console.log('📊 Found batches for roadmap:', roadmapBatches.length);

                    // Get notices for all batches of this roadmap
                    const roadmapNotices: Notice[] = [];
                    const roadmapMentors: User[] = [];

                    for (const batchItem of roadmapBatches) {
                        const batch = batchItem as unknown as Batch;
                        const batchNotices = await getNotices(batch.id);
                        const batchMentors = await getMentors(batch.id);
                        roadmapNotices.push(...batchNotices);
                        roadmapMentors.push(...batchMentors);
                    }

                    notices = roadmapNotices;
                    mentors = roadmapMentors;
                    console.log('📝 Roadmap-specific notices:', notices.length);
                    console.log('👥 Roadmap-specific mentors:', mentors.length);
                }
            }
        }

        // Fallback to batch-specific data if no roadmap-specific data found
        if (notices.length === 0) {
            notices = await getNotices(batch?.id);
        }
        if (mentors.length === 0) {
            mentors = await getMentors(batch?.id);
        }

        // Add sample notices if none exist, based on the selected roadmap
        let finalNotices = notices;
        if (!notices || notices.length === 0) {
            let roadmapTitle = 'Learning Cohort';
            if (selectedRoadmapId && roadmap) {
                roadmapTitle = roadmap.title;
            }

            finalNotices = [
                {
                    id: 'sample-1',
                    title: `Welcome to ${roadmapTitle}!`,
                    content: `Welcome to Week 1 of your ${roadmapTitle} journey. Complete your first assignment by Friday.`,
                    priority: 'high',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                } as Notice,
                {
                    id: 'sample-2',
                    title: 'Office Hours This Week',
                    content: 'Join us for office hours every Wednesday at 3 PM to get help with your assignments.',
                    priority: 'medium',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                } as Notice
            ];
        }

        // Calculate week streaks based on actual progress
        let weekStreaks: { week: number; status: 'done' | 'current' | 'incomplete'; completion: number }[] = [];

        if (roadmap) {
            // Use roadmap data if available
            weekStreaks = Array.from({ length: roadmap.total_weeks }, (_, i) => {
                const weekNumber = i + 1;

                // Get completed tasks for this week
                const weekProgress = progress.filter(p => {
                    // Map task_id to week number (you may need to adjust this logic based on your data structure)
                    // For now, we'll use a simple calculation
                    return p.status === 'completed';
                });

                // Calculate completion percentage for the week
                const weekCompletion = weekProgress.length > 0 ?
                    (weekProgress.filter(p => p.status === 'completed').length / weekProgress.length) * 100 : 0;

                let status: 'done' | 'current' | 'incomplete';

                if (weekCompletion >= 80) {
                    status = 'done';
                } else if (weekNumber === Math.ceil((profile?.completed_weeks || 0) + 1)) {
                    status = 'current';
                } else {
                    status = 'incomplete';
                }

                return { week: weekNumber, status, completion: weekCompletion };
            });
        } else {
            // Fallback: Create default 6 weeks without status data
            weekStreaks = Array.from({ length: 6 }, (_, i) => {
                const weekNumber = i + 1;
                return { week: weekNumber, status: 'incomplete' as const, completion: 0 };
            });
        }

        // Get current week tasks and upcoming tasks
        console.log('🔄 Fetching tasks for roadmapId:', selectedRoadmapId);
        const [currentWeekTasks, upcomingTasks] = await Promise.all([
            getCurrentWeekTasks(userId, selectedRoadmapId),
            getUpcomingTasks(userId, selectedRoadmapId)
        ]);
        const dashboardData = {
            profile,
            batch,
            roadmap,
            enrolledRoadmaps,
            progress,
            notices: finalNotices,
            mentors,
            weekStreaks,
            upcomingTasks,
            currentWeekTasks,
            userData
        };

        // Cache the result for faster subsequent loads
        cache.set(cacheKey, dashboardData, CACHE_TTL.MEDIUM);

        return dashboardData;
    } catch (error) {
        // Error in getDashboardData
        return {
            profile: null,
            batch: null,
            roadmap: null,
            enrolledRoadmaps: [],
            progress: [],
            notices: [],
            mentors: [],
            weekStreaks: [],
            upcomingTasks: [],
            currentWeekTasks: [],
            userData: null
        };
    }
};
