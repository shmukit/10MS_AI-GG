import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const MentorNotices: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/mentor/dashboard')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
        <h1 className="text-3xl font-bold text-foreground mb-6">Manage Notices</h1>
        
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <p className="text-muted-foreground">Notice management content will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};
