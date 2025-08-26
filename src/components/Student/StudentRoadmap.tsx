import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const StudentRoadmap: React.FC = () => {
  const navigate = useNavigate();
  const { roadmapSlug } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {roadmapSlug ? `Roadmap: ${roadmapSlug}` : 'Learning Roadmap'}
        </h1>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-gray-600">Roadmap content will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};
