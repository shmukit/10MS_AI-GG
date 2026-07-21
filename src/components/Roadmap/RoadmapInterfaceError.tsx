import React from 'react';

interface RoadmapInterfaceErrorProps {
  error: string | null;
  onBack: () => void;
}

export const RoadmapInterfaceError: React.FC<RoadmapInterfaceErrorProps> = ({ error, onBack }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4 text-foreground">Error Loading Roadmap</h2>
      <p className="text-muted-foreground mb-6">{error || 'No roadmap available'}</p>
      <button
        onClick={onBack}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
      >
        Go Back
      </button>
    </div>
  </div>
);
