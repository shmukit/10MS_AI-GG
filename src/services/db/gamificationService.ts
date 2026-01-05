import { supabase } from '../../lib/supabase';

/**
 * XP Point Values (as per PLATFORM_EXPANSION_PLAN.md)
 */
export const XP_VALUES = {
    CORRECT_PRACTICE: 10,
    FINISH_MODULE: 100,
    DAILY_STREAK: 50,
} as const;

export interface StudentXPStats {
    studentId: string;
    batchId: string;
    totalXP: number;
    rank: number;
    totalStudents: number;
}

export interface LeaderboardEntry {
    rank: number;
    studentId: string;
    studentName: string;
    xpPoints: number;
    progress?: number;
    profilePicture?: string;
}

export const awardXP = async (
    studentId: string,
    batchId: string,
    points: number,
    reason: string
): Promise<boolean> => {
    try {
        console.log(`🎮 Awarding ${points} XP to student ${studentId} for: ${reason}`);

        const { data: assignment, error: fetchError } = await supabase
            .from('student_batch_assignments')
            .select('xp_points')
            .eq('student_id', studentId)
            .eq('batch_id', batchId)
            .single();

        if (fetchError) {
            console.error('Error fetching student assignment:', fetchError);
            return false;
        }

        const currentXP = (assignment as any)?.xp_points || 0;
        const newXP = currentXP + points;

        const { error: updateError } = await supabase
            .from('student_batch_assignments')
            .update({
                xp_points: newXP,
                updated_at: new Date().toISOString()
            } as unknown as never)
            .eq('student_id', studentId)
            .eq('batch_id', batchId);

        if (updateError) {
            console.error('Error updating XP:', updateError);
            return false;
        }

        console.log(`✅ XP updated: ${currentXP} → ${newXP}`);
        return true;
    } catch (error) {
        console.error('Error in awardXP:', error);
        return false;
    }
};

export const calculateXP = (action: 'correct_practice' | 'finish_module' | 'daily_streak'): number => {
    switch (action) {
        case 'correct_practice':
            return XP_VALUES.CORRECT_PRACTICE;
        case 'finish_module':
            return XP_VALUES.FINISH_MODULE;
        case 'daily_streak':
            return XP_VALUES.DAILY_STREAK;
        default:
            return 0;
    }
};

export const awardTaskCompletionXP = async (
    studentId: string,
    batchId: string
): Promise<boolean> => {
    return await awardXP(
        studentId,
        batchId,
        XP_VALUES.FINISH_MODULE,
        'Task/Week completion'
    );
};

export const awardPracticeXP = async (
    studentId: string,
    batchId: string
): Promise<boolean> => {
    return await awardXP(
        studentId,
        batchId,
        XP_VALUES.CORRECT_PRACTICE,
        'Correct practice answer'
    );
};

export const getLeaderboard = async (
    batchId: string,
    timeframe: 'weekly' | 'all-time' = 'all-time',
    limit: number = 10
): Promise<LeaderboardEntry[]> => {
    try {
        console.log(`📊 Fetching ${timeframe} leaderboard for batch ${batchId}`);

        // Only fetch students who have some progress or XP
        let query = supabase
            .from('student_batch_assignments')
            .select(`
                student_id,
                xp_points,
                progress_percentage,
                users!inner(
                  first_name,
                  last_name,
                  profile_picture_url
                )
            `)
            .eq('batch_id', batchId)
            .eq('status', 'active')
            .order('progress_percentage', { ascending: false })
            .order('xp_points', { ascending: false })
            .limit(limit);

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }

        if (!data || data.length === 0) {
            return [];
        }

        const leaderboard: LeaderboardEntry[] = data.map((entry: any, index: number) => ({
            rank: index + 1,
            studentId: entry.student_id,
            studentName: `${entry.users.first_name} ${entry.users.last_name}`,
            xpPoints: entry.xp_points || 0,
            progress: entry.progress_percentage || 0,
            profilePicture: entry.users.profile_picture_url || undefined,
        }));

        console.log(`✅ Leaderboard fetched: ${leaderboard.length} entries`);
        return leaderboard;
    } catch (error) {
        console.error('Error in getLeaderboard:', error);
        return [];
    }
};

export const getStudentStats = async (
    studentId: string,
    batchId: string
): Promise<StudentXPStats | null> => {
    try {
        const { data: assignment, error: assignmentError } = await supabase
            .from('student_batch_assignments')
            .select('xp_points')
            .eq('student_id', studentId)
            .eq('batch_id', batchId)
            .single();

        if (assignmentError) {
            // If assignment doesn't exist, return default 0 stats instead of null
            // so the UI can still display the card with 0 progress
            const { count: totalStudents } = await supabase
                .from('student_batch_assignments')
                .select('*', { count: 'exact', head: true })
                .eq('batch_id', batchId)
                .eq('status', 'active');

            return {
                studentId,
                batchId,
                totalXP: 0,
                rank: 0, // 0 indicates unranked
                totalStudents: totalStudents || 0,
            };
        }

        const studentXP = (assignment as any)?.xp_points || 0;

        const { count: totalStudents } = await supabase
            .from('student_batch_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('batch_id', batchId)
            .eq('status', 'active');

        const { count: studentsAbove } = await supabase
            .from('student_batch_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('batch_id', batchId)
            .eq('status', 'active')
            .gt('xp_points', studentXP);

        const rank = (studentsAbove || 0) + 1;

        return {
            studentId,
            batchId,
            totalXP: studentXP,
            rank,
            totalStudents: totalStudents || 0,
        };
    } catch (error) {
        console.error('Error in getStudentStats:', error);
        return {
            studentId,
            batchId,
            totalXP: 0,
            rank: 0,
            totalStudents: 0
        };
    }
};

export const getStudentXP = async (
    studentId: string,
    batchId: string
): Promise<number> => {
    try {
        const { data, error } = await supabase
            .from('student_batch_assignments')
            .select('xp_points')
            .eq('student_id', studentId)
            .eq('batch_id', batchId)
            .single();

        if (error) {
            console.error('Error fetching student XP:', error);
            return 0;
        }

        return (data as any)?.xp_points || 0;
    } catch (error) {
        console.error('Error in getStudentXP:', error);
        return 0;
    }
};

export const checkDailyStreak = async (
    _studentId: string,
    _batchId: string
): Promise<boolean> => {
    // Placeholder for daily streak logic
    return false;
};

// Aliases and Initializers
export const initializeGamificationProfile = async (_userId: string): Promise<boolean> => {
    // Gamification is initialized via student_batch_assignments
    return true;
};

export const getStudentGamificationProfile = async (userId: string): Promise<any> => {
    // Fetch a default batch stats for now, or null
    // Assuming we can just find any active batch
    try {
        const { data: assignment } = await supabase
            .from('student_batch_assignments')
            .select('batch_id')
            .eq('student_id', userId)
            .eq('status', 'active')
            .limit(1)
            .single();

        if (assignment) {
            return await getStudentStats(userId, (assignment as any).batch_id);
        }
        return null;
    } catch {
        return null;
    }
};
