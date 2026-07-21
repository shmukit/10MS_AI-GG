import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AgenticDecisionTree } from './AgenticDecisionTree';

export const AgenticDecisionTreePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>
      <AgenticDecisionTree />
    </div>
  );
};
