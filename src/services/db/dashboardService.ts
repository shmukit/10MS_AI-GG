import { isPartnerEmail, partnerConfig } from '../../config/partnerConfig';
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
import { getStudentBatch, getEnrolledBatches } from './batchService';
import {
    getStudentRoadmap,
    getCurrentWeekTasks,
    getUpcomingTasks
} from './roadmapService';
import { getStudentProgress } from './progressService';
import { getNotices } from './noticeService';
import { getMentors } from './mentorService';

export const getDashboardData = async (userId: string, options?: { batchId?: string }): Promise<{
    profile: StudentProfile | null;
    batch: Batch | null;
    roadmap: Roadmap | null;
    enrolledBatches: (Batch & { roadmap: any })[];
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
        const cacheKey = cache.createKey(CACHE_KEYS.DASHBOARD_DATA, userId, options?.batchId || 'default');

        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            console.log('🎯 Returning cached data');
            return cachedData as any;
        }

        // Fetching dashboard data components
        const [profile, defaultBatch, roadmap, enrolledBatches, progress, userData] = await Promise.all([
            getStudentProfile(userId),
            getStudentBatch(userId), // Keep this as fallback/default
            getStudentRoadmap(userId),
            getEnrolledBatches(userId),
            getStudentProgress(userId),
            getUserById(userId)
        ]);

        const isCompanyUser = isPartnerEmail(userData?.email);

        // Determine effective batch and roadmap
        let batch: (Batch & { roadmap?: any }) | null = null;
        let effectiveRoadmap: Roadmap | null = null;

        if (options?.batchId) {
            // If batch is explicitly selected, find it in enrolled batches
            const selectedBatch = enrolledBatches.find(b => b.id === options.batchId);
            if (selectedBatch) {
                batch = selectedBatch;
                effectiveRoadmap = selectedBatch.roadmap;
                console.log(`🎯 Using selected batch: ${batch?.name}`);
            }
        }

        // If no batch selected or not found, use prioritization logic or default
        if (!batch) {
            if (enrolledBatches.length > 0) {
                // Apply prioritization logic for company users
                if (isCompanyUser && enrolledBatches.length > 1) {
                    const keyword = partnerConfig.roadmapKeyword;
                    const augmedixBatch = keyword
                        ? enrolledBatches.find(b =>
                            b.name?.toLowerCase().includes(keyword) ||
                            b.roadmap?.title?.toLowerCase().includes(keyword)
                        )
                        : undefined;

                    const aiMlBatch = enrolledBatches.find(b =>
                        b.roadmap?.title?.toLowerCase().includes('ai') ||
                        b.roadmap?.title?.toLowerCase().includes('ml')
                    );

                    const nonPythonBatch = enrolledBatches.find(b =>
                        !b.roadmap?.title?.toLowerCase().includes('python')
                    );

                    const preferredBatch = augmedixBatch || aiMlBatch || nonPythonBatch || enrolledBatches[0];
                    batch = preferredBatch;
                    effectiveRoadmap = preferredBatch.roadmap;
                    console.log(`🎯 Auto-selected prioritized batch: ${batch.name}`);
                } else {
                    // Default to first enrolled batch
                    batch = enrolledBatches[0];
                    effectiveRoadmap = batch.roadmap;
                    console.log(`🎯 Using default first batch: ${batch.name}`);
                }
            } else {
                // No enrollments found, fallback to legacy checks
                batch = defaultBatch;
                effectiveRoadmap = roadmap;
            }
        }

        // Final fallback if still no roadmap but we have a batch
        if (batch && !effectiveRoadmap && batch.roadmap_id) {
            // Need to fetch roadmap if not attached properties
            const { data: roadmapData } = await supabase
                .from('roadmaps')
                .select('*')
                .eq('id', batch.roadmap_id)
                .single();
            if (roadmapData) effectiveRoadmap = roadmapData as unknown as Roadmap;
        }

        // Dashboard data components fetched
        // console.log('📊 Dashboard data components fetched');

        // Debug: Check if any component is null
        if (!profile) console.log('⚠️  Profile is null');
        if (!batch) console.log('⚠️  Batch is null');
        if (!roadmap) console.log('⚠️  Roadmap is null');
        if (!enrolledBatches || enrolledBatches.length === 0) console.log('⚠️  No enrolled batches');
        if (!progress || progress.length === 0) console.log('⚠️  No progress data');
        if (!userData) console.log('⚠️  User data is null');

        // Get notices and mentors based on the selected batch
        let notices: Notice[] = [];
        let mentors: User[] = [];

        if (batch) {
            // Get data for specific batch
            // console.log('📊 Getting data for batch:', batch.name);
            notices = await getNotices(batch.id, userId);
            mentors = await getMentors(batch.id);
        }
        // (Removed complex roadmap-based batch searching logic in favor of direct batch selection)

        // Fallback to batch-specific data if no roadmap-specific data found
        if (notices.length === 0) {
            notices = await getNotices(batch?.id, userId);
        }
        if (mentors.length === 0) {
            mentors = await getMentors(batch?.id);
        }

        // Add sample notices if none exist, based on the selected roadmap
        let finalNotices = notices;
        if (!notices || notices.length === 0) {
            let roadmapTitle = 'Learning Cohort';
            if (effectiveRoadmap) {
                roadmapTitle = effectiveRoadmap.title;
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

        if (effectiveRoadmap) {
            // Use roadmap data if available
            weekStreaks = Array.from({ length: effectiveRoadmap.total_weeks }, (_, i) => {
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
        console.log('🔄 Fetching tasks for roadmap:', effectiveRoadmap?.title);
        const [currentWeekTasks, upcomingTasks] = await Promise.all([
            getCurrentWeekTasks(userId, effectiveRoadmap?.id),
            getUpcomingTasks(userId, effectiveRoadmap?.id)
        ]);
        const dashboardData = {
            profile,
            batch,
            roadmap: effectiveRoadmap,
            enrolledBatches,
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
    } catch {
        // Error in getDashboardData
        return {
            profile: null,
            batch: null,
            roadmap: null,
            enrolledBatches: [],
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
