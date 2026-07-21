import React from 'react';

export const ProfileSkeleton: React.FC = () => (
  <div className="min-h-screen bg-background animate-pulse">
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-muted rounded-full"></div>
          <div className="flex-1">
            <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
