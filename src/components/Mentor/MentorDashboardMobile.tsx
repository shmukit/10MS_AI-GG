import React from 'react';
import { Monitor } from 'lucide-react';
import { MentorDashboard } from './MentorDashboard';

interface MentorDashboardMobileProps {
  onLogout?: () => void;
  onProfile?: () => void;
}

/**
 * Legacy mobile entry point — delegates to the full desktop dashboard
 * with a notice banner. The previous mobile-only UI was incomplete
 * (no data fetching, non-functional tabs).
 */
export const MentorDashboardMobile: React.FC<MentorDashboardMobileProps> = () => (
  <div className="min-h-screen bg-background text-foreground">
    <div className="lg:hidden border-b border-border bg-muted/50 px-4 py-3">
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Monitor className="w-4 h-4 shrink-0" />
        <span>
          Mobile view uses the full dashboard. Rotate your device or use a larger screen for the best experience.
        </span>
      </div>
    </div>
    <MentorDashboard />
  </div>
);
