import { supabase } from '../../lib/supabase';

/**
 * XP Point Values (as per PLATFORM_EXPANSION_PLAN.md)
 */
export const XP_VALUES = {
    CORRECT_PRACTICE: 10,    // Correct answer in practice card
    FINISH_MODULE: 100,       // Complete a week/module
    DAILY_STREAK: 50,         // Maintain daily activity
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
    profilePicture?: string;
}

/**
 * Award XP points to a student for a specific action
 */
export const awardXP = async (
    studentId: string,
    batchId: string,
    points: number,
    reason: string
): Promise<boolean> => {
    try {
        console.log(`🎮 Awarding ${points} XP to student ${studentId} for: ${reason}`);

        // Get current assignment
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

        // Update XP
        // Type casting to 'never' is required here because of a Supabase type inference issue
        // consistent with practiceDeckService.ts
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

/**
 * Calculate XP based on action type
 */
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

/**
 * Award XP for completing a task/week
 */
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

/**
 * Award XP for correct practice answer
 */
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

/**
 * Get leaderboard for a batch
 */
export const getLeaderboard = async (
    batchId: string,
    timeframe: 'weekly' | 'all-time' = 'all-time',
    limit: number = 10
): Promise<LeaderboardEntry[]> => {
    try {
        console.log(`📊 Fetching ${timeframe} leaderboard for batch ${batchId}`);

        let query = supabase
            .from('student_batch_assignments')
            .select(`
        student_id,
        xp_points,
        users!inner(
          first_name,
          last_name,
          profile_picture_url
        )
      `)
            .eq('batch_id', batchId)
            .eq('status', 'active')
            .order('xp_points', { ascending: false })
            .limit(limit);

        // For weekly, we would need a created_at or last_xp_update field
        // Currently not implemented in schema - treating as all-time

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }

        if (!data || data.length === 0) {
            return [];
        }

        // Transform to leaderboard entries
        const leaderboard: LeaderboardEntry[] = data.map((entry: any, index: number) => ({
            rank: index + 1,
            studentId: entry.student_id,
            studentName: `${entry.users.first_name} ${entry.users.last_name}`,
            xpPoints: entry.xp_points || 0,
            profilePicture: entry.users.profile_picture_url || undefined,
        }));

        console.log(`✅ Leaderboard fetched: ${leaderboard.length} entries`);
        return leaderboard;
    } catch (error) {
        console.error('Error in getLeaderboard:', error);
        return [];
    }
};

/**
 * Get student's XP stats including rank
 */
export const getStudentStats = async (
    studentId: string,
    batchId: string
): Promise<StudentXPStats | null> => {
    try {
        // Get student's XP
        const { data: assignment, error: assignmentError } = await supabase
            .from('student_batch_assignments')
            .select('xp_points')
            .eq('student_id', studentId)
            .eq('batch_id', batchId)
            .single();

        if (assignmentError) {
            console.error('Error fetching student assignment:', assignmentError);
            return null;
        }

        const studentXP = (assignment as any)?.xp_points || 0;

        // Get total number of students in batch
        const { count: totalStudents } = await supabase
            .from('student_batch_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('batch_id', batchId)
            .eq('status', 'active');

        // Get rank by counting how many students have more XP
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
        return null;
    }
};

/**
 * Get student's current XP for a batch
 */
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

/**
 * Check if student has maintained daily streak
 * Returns true if student completed any action today
 */
export const checkDailyStreak = async (
    _studentId: string,
    _batchId: string
): Promise<boolean> => {
    try {
        // TODO: Implement when we have daily activity tracking
        // This would check student_progress or a dedicated activity log table
        // to see if student completed any task today

        // For now, return false (no streak system yet)
        return false;
    } catch (error) {
        console.error('Error in checkDailyStreak:', error);
        return false;
    }
};
