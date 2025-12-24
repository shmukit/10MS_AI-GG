import { supabase } from '../../lib/supabase';
import { cache, CACHE_TTL } from '../../lib/cache';
import { Roadmap, RoadmapWeek, RoadmapTask } from '../../types/models';
import { getUserById } from './userService';
import { getStudentBatch } from './batchService';

export const generateRoadmapSlug = (roadmapTitle: string): string => {
    return roadmapTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .replace(/_+/g, '_') // Replace multiple underscores with single
        .trim();
};

export const getStudentRoadmap = async (userId: string): Promise<Roadmap | null> => {
    try {
        const batch = await getStudentBatch(userId);
        if (!batch?.roadmap_id) {
            console.log('No roadmap found for user:', userId);
            return null;
        }

        const { data, error } = await supabase
            .from('roadmaps')
            .select('*')
            .eq('id', batch.roadmap_id)
            .single();

        if (error) {
            console.error('Error fetching roadmap:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in getStudentRoadmap:', error);
        return null;
    }
};

export const getEnrolledRoadmaps = async (userId: string): Promise<Roadmap[]> => {
    try {
        console.log('🔍 getEnrolledRoadmaps called for user:', userId);

        // Get user email to determine if this is a company user
        const userData = await getUserById(userId);
        const isCompanyUser = userData?.email?.includes('@10minuteschool.com') || userData?.email?.includes('@lightcastlepartners.com');

        // Get all batches the user is enrolled in
        console.log('🔍 Querying student_batch_assignments for enrolled roadmaps, user:', userId);
        const { data: batchEnrollments, error: batchError } = await supabase
            .from('student_batch_assignments')
            .select(`
        batch_id,
        enrollment_date,
        batches!inner(
          id,
          name,
          roadmap_id,
          roadmaps!inner(*)
        )
      `)
            .eq('student_id', userId)
            .eq('status', 'active')
            .order('enrollment_date', { ascending: false }); // Most recent enrollments first

        console.log('📊 Batch enrollments query result:', { batchEnrollments, batchError });

        if (batchError) {
            console.error('❌ Error fetching batch enrollments:', batchError);
            return [];
        }

        console.log('📊 Batch enrollments found:', batchEnrollments);

        // Extract roadmaps from batch enrollments
        const roadmaps = batchEnrollments
            ?.map(enrollment => {
                const batch = (enrollment as any).batches;
                return batch?.roadmaps as Roadmap;
            })
            .filter(Boolean) || [];

        console.log('🗺️  Roadmaps extracted from batches:', roadmaps);

        // If no roadmaps found, return empty array
        if (roadmaps.length === 0) {
            console.log('📝 No roadmaps found for user:', userId);
            return [];
        }

        // For company users, sort roadmaps to prioritize Augmedix/AI/ML over Python
        if (isCompanyUser && roadmaps.length > 1) {
            roadmaps.sort((a: any, b: any) => {
                const aTitle = a.title?.toLowerCase() || '';
                const bTitle = b.title?.toLowerCase() || '';
                const aDesc = a.description?.toLowerCase() || '';
                const bDesc = b.description?.toLowerCase() || '';

                // Priority scoring
                const getScore = (title: string, desc: string) => {
                    if (title.includes('augmedix') || desc.includes('augmedix')) return 4;
                    if (title.includes('ai') || title.includes('ml') || title.includes('machine learning')) return 3;
                    if (title.includes('python')) return 1; // Lowest priority for company users
                    return 2; // Default priority
                };

                const scoreA = getScore(aTitle, aDesc);
                const scoreB = getScore(bTitle, bDesc);

                return scoreB - scoreA; // Higher score first
            });

            console.log('🏢 Company user - roadmaps sorted for priority:', roadmaps.map((r: any) => r.title));
        }

        console.log('✅ Returning real roadmaps:', roadmaps);
        return roadmaps;
    } catch (error) {
        console.error('❌ Error in getEnrolledRoadmaps:', error);
        return [];
    }
};

export const getRoadmapWeeks = async (roadmapId: string): Promise<RoadmapWeek[]> => {
    try {
        const { data, error } = await supabase
            .from('roadmap_weeks')
            .select('*')
            .eq('roadmap_id', roadmapId)
            .order('week_number');

        if (error) {
            console.error('Error fetching roadmap weeks:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getRoadmapWeeks:', error);
        return [];
    }
};

export const getRoadmapTasks = async (weekId: string): Promise<RoadmapTask[]> => {
    try {
        const { data, error } = await supabase
            .from('roadmap_tasks')
            .select('*')
            .eq('week_id', weekId)
            .order('created_at');

        if (error) {
            console.error('Error fetching roadmap tasks:', error);
            return [];
        }

        // Transform database field names to frontend field names
        const transformedTasks = (data || []).map((task: any) => ({
            id: task.id,
            week_id: task.week_id,
            task_name: task.task_name,
            task_details: task.task_details,
            task_type: task.task_type,
            relevant_links: task.relevant_links,
            deadline: task.deadline,
            estimated_hours: task.estimated_hours,
            points: task.points,
            is_required: task.is_required,
            created_at: task.created_at,
            meeting_time: task.meeting_time,
            is_active: task.is_active
        }));

        return transformedTasks;
    } catch (error) {
        console.error('Error in getRoadmapTasks:', error);
        return [];
    }
};

export const getCurrentWeekTasks = async (userId: string, roadmapId?: string): Promise<RoadmapTask[]> => {
    try {
        console.log('🔄 Getting current week tasks for user:', userId, 'roadmapId:', roadmapId);

        let targetRoadmapId = roadmapId;

        // If no roadmapId provided, get from student's batch
        if (!targetRoadmapId) {
            const batch = await getStudentBatch(userId);
            console.log('📊 Batch data:', batch);

            if (!batch?.roadmap_id) {
                console.log('❌ No batch or roadmap found for user');
                return [];
            }
            targetRoadmapId = batch.roadmap_id;
        }

        // Get current week (you might want to calculate this based on enrollment date)
        const currentWeek = 1; // For now, hardcoded to week 1
        console.log('📅 Current week:', currentWeek);

        // Get roadmap weeks
        const weeks = await getRoadmapWeeks(targetRoadmapId);
        console.log('📋 Roadmap weeks:', weeks);

        const currentWeekData = weeks.find(w => w.week_number === currentWeek);
        console.log('🎯 Current week data:', currentWeekData);

        if (!currentWeekData) {
            console.log('❌ No current week data found');
            return [];
        }

        // Get tasks for current week
        const tasks = await getRoadmapTasks(currentWeekData.id);
        console.log('📝 Tasks for current week:', tasks);

        // Filter to only required tasks
        const requiredTasks = tasks.filter(task => task.is_required);
        console.log('✅ Required tasks:', requiredTasks);

        return requiredTasks;
    } catch (error) {
        console.error('❌ Error in getCurrentWeekTasks:', error);
        return [];
    }
};

export const getUpcomingTasks = async (userId: string, roadmapId?: string): Promise<RoadmapTask[]> => {
    try {
        console.log('🔄 Getting upcoming tasks for user:', userId, 'roadmapId:', roadmapId);

        let targetRoadmapId = roadmapId;

        // If no roadmapId provided, get from student's batch
        if (!targetRoadmapId) {
            const batch = await getStudentBatch(userId);
            console.log('📊 Batch data:', batch);

            if (!batch?.roadmap_id) {
                console.log('❌ No batch or roadmap found for user');
                return [];
            }
            targetRoadmapId = batch.roadmap_id;
        }

        // Get roadmap weeks
        const weeks = await getRoadmapWeeks(targetRoadmapId);
        console.log('📋 Roadmap weeks:', weeks);

        // Get tasks for next few weeks (weeks 2-4)
        const upcomingTasks: RoadmapTask[] = [];

        for (let weekNum = 2; weekNum <= 4; weekNum++) {
            const weekData = weeks.find(w => w.week_number === weekNum);
            if (weekData) {
                const weekTasks = await getRoadmapTasks(weekData.id);
                console.log(`📝 Tasks for week ${weekNum}:`, weekTasks);

                // Add week number to each task for display
                const tasksWithWeek = weekTasks
                    .filter(task => task.is_required)
                    .map(task => ({
                        ...task,
                        week_number: weekNum
                    }));
                upcomingTasks.push(...tasksWithWeek);
            }
        }

        console.log('✅ Total upcoming tasks:', upcomingTasks);
        return upcomingTasks;
    } catch (error) {
        console.error('❌ Error in getUpcomingTasks:', error);
        return [];
    }
};

export const getRoadmapBySlug = async (slug: string): Promise<Roadmap | null> => {
    try {
        // Check cache first
        const cacheKey = `roadmap_slug_${slug}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            console.log('✅ Returning cached roadmap for slug:', slug);
            return cached as unknown as Roadmap;
        }

        console.log('🔍 Searching for roadmap with slug:', slug);

        // Convert slug back to a more precise search pattern
        const searchPattern = slug.replace(/_/g, ' ').toLowerCase();
        console.log('🔍 Search pattern:', searchPattern);

        // First try exact title match (case insensitive)
        let { data, error } = await supabase
            .from('roadmaps')
            .select('*')
            .ilike('title', searchPattern)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Error in exact title match:', error);
        }

        if (data) {
            const roadmap = data as unknown as Roadmap;
            console.log('✅ Found roadmap with exact title match:', roadmap.title);
            // Cache the result
            cache.set(cacheKey, roadmap, CACHE_TTL.LONG);
            return roadmap;
        }

        // If no exact match, try to find the best match by generating slugs for all roadmaps
        // and comparing them directly
        const { data: allRoadmaps, error: allRoadmapsError } = await supabase
            .from('roadmaps')
            .select('*')
            .eq('is_active', true);

        if (allRoadmapsError) {
            console.error('Error fetching all roadmaps:', allRoadmapsError);
            return null;
        }

        const candidates = allRoadmaps as unknown as Roadmap[];

        if (candidates && candidates.length > 0) {
            // Generate slugs for all roadmaps and find the best match
            let bestMatch: Roadmap | null = null;
            let bestScore = 0;

            for (const roadmap of candidates) {
                const roadmapSlug = generateRoadmapSlug(roadmap.title);
                console.log(`🔍 Comparing "${slug}" with "${roadmapSlug}" for roadmap "${roadmap.title}"`);

                if (roadmapSlug === slug) {
                    console.log('✅ Found exact slug match:', roadmap.title);
                    return roadmap;
                }

                // Calculate similarity score for partial matches
                const slugWords = slug.split('_').filter(word => word.length > 2);
                const roadmapSlugWords = roadmapSlug.split('_').filter(word => word.length > 2);

                let score = 0;
                for (const word of slugWords) {
                    if (roadmapSlugWords.includes(word)) {
                        score += 1;
                    }
                }

                // Normalize score by total words
                const normalizedScore = score / Math.max(slugWords.length, roadmapSlugWords.length);

                if (normalizedScore > bestScore && normalizedScore > 0.5) { // Require at least 50% match
                    bestScore = normalizedScore;
                    bestMatch = roadmap;
                }
            }

            if (bestMatch) {
                console.log('✅ Found best partial match:', bestMatch.title, 'Score:', bestScore);
                // Cache the result
                cache.set(cacheKey, bestMatch, CACHE_TTL.LONG);
                return bestMatch;
            }
        }

        console.log('❌ No roadmap found for slug:', slug);
        return null;
    } catch (err) {
        console.error('Error in getRoadmapBySlug:', err);
        return null;
    }
};
