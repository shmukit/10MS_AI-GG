import React from 'react';

export const RoadmapInterfaceLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
      <p className="text-lg text-muted-foreground">Loading roadmap...</p>
    </div>
  </div>
);
