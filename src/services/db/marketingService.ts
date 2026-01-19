import { supabase } from '../../lib/supabase';
import { Roadmap, User, Batch } from '../../types/models';

export interface RoadmapMarketingData extends Roadmap {
    batches: (Batch & {
        mentors: User[];
    })[];
}

export interface MarketingPageData {
    roadmaps: RoadmapMarketingData[];
    mentors: (User & {
        roadmaps: Roadmap[];
    })[];
}

export const getMarketingData = async (): Promise<MarketingPageData> => {
    try {
        // 1. Fetch all roadmaps
        const { data: roadmapsData, error: roadmapsError } = await supabase
            .from('roadmaps')
            .select('*');

        if (roadmapsError) throw roadmapsError;
        const roadmaps = (roadmapsData || []) as Roadmap[];

        // 2. Fetch all batches for these roadmaps
        const { data: batchesData, error: batchesError } = await supabase
            .from('batches')
            .select('*')
            .in('roadmap_id', roadmaps.map(r => r.id));

        if (batchesError) throw batchesError;
        const batches = (batchesData || []) as Batch[];

        // 3. Fetch all batch_mentors relationships - handle missing table gracefully
        const { data: batchMentorsData, error: batchMentorsError } = await supabase
            .from('batch_mentors')
            .select('batch_id, mentor_id');

        if (batchMentorsError) {
            console.warn('batch_mentors table might be missing, falling back to empty:', batchMentorsError.message);
        }
        const batchMentors = (batchMentorsData || []) as { batch_id: string; mentor_id: string }[];

        // 4. Fetch all mentor profiles and user details
        const { data: mentorsData, error: mentorsError } = await supabase
            .from('users')
            .select('*, mentor_profiles(*)')
            .eq('role', 'mentor');

        if (mentorsError) throw mentorsError;
        const mentors = (mentorsData || []) as User[];

        // 5. Aggregate data
        const roadmapMarketingData: RoadmapMarketingData[] = roadmaps.map(roadmap => {
            const roadmapBatches = batches.filter(b => b.roadmap_id === roadmap.id);

            return {
                ...roadmap,
                batches: roadmapBatches.map(batch => {
                    const mentorIds = batchMentors
                        .filter(bm => bm.batch_id === batch.id)
                        .map(bm => bm.mentor_id);

                    return {
                        ...batch,
                        mentors: mentors.filter(m => mentorIds.includes(m.id))
                    };
                })
            };
        });

        // Aggregate mentors with their roadmaps
        const mentorMarketingData = mentors.map(mentor => {
            const mentorBatchIds = batchMentors
                .filter(bm => bm.mentor_id === mentor.id)
                .map(bm => bm.batch_id);

            const mentorRoadmapIds = batches
                .filter(b => mentorBatchIds.includes(b.id))
                .map(b => b.roadmap_id);

            return {
                ...mentor,
                roadmaps: roadmaps.filter(r => mentorRoadmapIds.includes(r.id))
            };
        });

        return {
            roadmaps: roadmapMarketingData,
            mentors: mentorMarketingData
        };
    } catch (error) {
        console.error('Error fetching marketing data:', error);
        return {
            roadmaps: [],
            mentors: []
        };
    }
};
