import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Users } from 'lucide-react';
import { generateRoadmapSlug, generateBatchSlug } from '../../../services/database';

interface NavigationCardsProps {
    isDarkMode: boolean;
    currentRoadmap: any;
    enrolledRoadmaps: any[];
    batch: any;
}

export const NavigationCards: React.FC<NavigationCardsProps> = ({
    isDarkMode,
    currentRoadmap,
    enrolledRoadmaps,
    batch
}) => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-2 gap-4">
            <div
                onClick={() => {
                    if (currentRoadmap) {
                        const roadmapSlug = generateRoadmapSlug(currentRoadmap?.title || '');
                        navigate(`/student/roadmap/${roadmapSlug}`);
                    } else if (enrolledRoadmaps?.length > 0) {
                        // Fallback: use first available roadmap
                        const firstRoadmap = enrolledRoadmaps[0];
                        const roadmapSlug = generateRoadmapSlug(firstRoadmap.title || '');
                        navigate(`/student/roadmap/${roadmapSlug}`);
                    } else {
                        // No roadmaps available, stay on dashboard
                        console.warn('No roadmaps available for navigation');
                        alert('No roadmaps available. Please contact your administrator.');
                    }
                }}
                className={`border rounded-xl p-4 text-center transition-all duration-200 group cursor-pointer hover:shadow-lg transform hover:scale-[1.02] ${isDarkMode
                    ? 'bg-orange-900/20 border-orange-800 hover:bg-orange-900/30 hover:border-orange-700'
                    : 'bg-orange-50 border-orange-200 hover:bg-orange-100 hover:border-orange-300'
                    }`}
            >
                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-all duration-200 ${isDarkMode
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 group-hover:from-orange-600 group-hover:to-orange-700'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 group-hover:from-orange-600 group-hover:to-orange-700'
                    }`}>
                    <Map className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Roadmap</span>
            </div>

            <button
                onClick={() => {
                    // Navigate to community with roadmap context
                    if (currentRoadmap) {
                        const roadmapSlug = generateRoadmapSlug(currentRoadmap?.title || '');
                        navigate(`/student/community/${roadmapSlug}`);
                    } else if (enrolledRoadmaps?.length > 0) {
                        // Fallback: use first available roadmap
                        const firstRoadmap = enrolledRoadmaps[0];
                        const roadmapSlug = generateRoadmapSlug(firstRoadmap.title || '');
                        navigate(`/student/community/${roadmapSlug}`);
                    } else if (batch) {
                        const batchSlug = generateBatchSlug(batch.name);
                        navigate(`/student/community/${batchSlug}`);
                    } else {
                        // No roadmaps or batches available, stay on dashboard
                        console.warn('No roadmaps or batches available for navigation');
                        alert('No roadmaps available. Please contact your administrator.');
                    }
                }}
                className={`border rounded-xl p-4 text-center transition-all duration-200 group hover:shadow-lg transform hover:scale-[1.02] ${isDarkMode
                    ? 'bg-blue-900/20 border-blue-800 hover:bg-blue-900/30 hover:border-blue-700'
                    : 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                    }`}
            >
                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-all duration-200 ${isDarkMode
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 group-hover:from-blue-500 group-hover:to-blue-600'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700'
                    }`}>
                    <Users className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Community</span>
            </button>
        </div>
    );
};
