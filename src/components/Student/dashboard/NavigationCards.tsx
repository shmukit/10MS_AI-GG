import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Users } from 'lucide-react';
import { DatabaseService } from '../../../services/database';
import { useToast } from '../../ui/ToastProvider';

interface NavigationCardsProps {
    isDarkMode: boolean;
    currentRoadmap: any;
    enrolledRoadmaps: any[];
    batch: any;
}

export const NavigationCards: React.FC<NavigationCardsProps> = ({
    currentRoadmap,
    enrolledRoadmaps,
    batch
}) => {
    const navigate = useNavigate();
    const { info } = useToast();

    return (
        <div className="hidden md:grid grid-cols-2 gap-4">
            <div
                onClick={() => {
                    if (currentRoadmap) {
                        const roadmapSlug = DatabaseService.generateRoadmapSlug(currentRoadmap?.title || '');
                        navigate(`/student/roadmap/${roadmapSlug}`);
                    } else if (enrolledRoadmaps?.length > 0) {
                        const firstRoadmap = enrolledRoadmaps[0];
                        const roadmapSlug = DatabaseService.generateRoadmapSlug(firstRoadmap.title || '');
                        navigate(`/student/roadmap/${roadmapSlug}`);
                    } else {
                        console.warn('No roadmaps available for navigation');
                        info('No roadmaps available. Please contact your administrator.');
                    }
                }}
                className="rounded-xl border border-border bg-card p-4 text-center transition-all duration-200 group cursor-pointer hover:shadow-lg transform hover:scale-[1.02] hover:bg-accent"
            >
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-all duration-200 bg-primary group-hover:opacity-90">
                    <Map className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium transition-colors duration-200 text-foreground">Roadmap</span>
            </div>

            <button
                onClick={() => {
                    if (currentRoadmap) {
                        const roadmapSlug = DatabaseService.generateRoadmapSlug(currentRoadmap?.title || '');
                        navigate(`/student/community/${roadmapSlug}`);
                    } else if (enrolledRoadmaps?.length > 0) {
                        const firstRoadmap = enrolledRoadmaps[0];
                        const roadmapSlug = DatabaseService.generateRoadmapSlug(firstRoadmap.title || '');
                        navigate(`/student/community/${roadmapSlug}`);
                    } else if (batch) {
                        const batchSlug = DatabaseService.generateBatchSlug(batch.name);
                        navigate(`/student/community/${batchSlug}`);
                    } else {
                        console.warn('No roadmaps or batches available for navigation');
                        info('No roadmaps available. Please contact your administrator.');
                    }
                }}
                className="rounded-xl border border-border bg-card p-4 text-center transition-all duration-200 group hover:shadow-lg transform hover:scale-[1.02] hover:bg-accent"
            >
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-all duration-200 bg-primary group-hover:opacity-90">
                    <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium transition-colors duration-200 text-foreground">Community</span>
            </button>
        </div>
    );
};
