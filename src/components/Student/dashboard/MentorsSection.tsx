import React from 'react';

interface MentorsSectionProps {
    isDarkMode: boolean;
}

export const MentorsSection: React.FC<MentorsSectionProps> = () => {
    return (
        <div className="rounded-xl border border-border bg-card p-4 md:p-6 transition-all duration-200 hover:shadow-md">
            <h3 className="font-bold mb-4 transition-colors duration-200 text-foreground">Mentors</h3>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-full"></div>
                        <div>
                            <div className="font-medium transition-colors duration-200 text-foreground">Uttam Deb</div>
                            <div className="text-xs transition-colors duration-200 text-muted-foreground">Senior BI Executive, 10 Minute School</div>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <span className="text-xs px-2 py-1 rounded transition-colors duration-200 text-muted-foreground bg-muted">Python</span>
                        <span className="text-xs px-2 py-1 rounded transition-colors duration-200 text-muted-foreground bg-muted">SQL</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
