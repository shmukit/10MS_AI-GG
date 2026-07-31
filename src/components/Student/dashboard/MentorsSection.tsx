import React from 'react';
import { Users } from 'lucide-react';
import { User } from '../../../types/models';
import { EmptyState } from '../../ui/EmptyState';

interface MentorsSectionProps {
    mentors?: User[];
}

export const MentorsSection: React.FC<MentorsSectionProps> = ({ mentors = [] }) => {
    return (
        <div className="rounded-xl border border-border bg-card p-4 md:p-6 transition-all duration-200">
            <h3 className="font-bold mb-4 transition-colors duration-200 text-foreground">Mentors</h3>

            {mentors.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No mentors assigned"
                    description="Your batch mentor will appear here once assigned."
                    className="py-8"
                />
            ) : (
                <div className="space-y-3">
                    {mentors.map((mentor) => {
                        const name = `${mentor.first_name || ''} ${mentor.last_name || ''}`.trim() || mentor.email;
                        const profile = mentor.mentor_profiles?.[0];
                        const subtitle = profile
                            ? `${profile.designation}${profile.organization ? `, ${profile.organization}` : ''}`
                            : 'Mentor';

                        return (
                            <div key={mentor.id} className="flex items-center justify-between gap-2 min-w-0">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="w-10 h-10 shrink-0 bg-muted rounded-full flex items-center justify-center border border-border text-sm font-medium text-muted-foreground">
                                        {name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-medium transition-colors duration-200 text-foreground truncate" title={name}>{name}</div>
                                        <div className="text-xs transition-colors duration-200 text-muted-foreground truncate" title={subtitle}>{subtitle}</div>
                                    </div>
                                </div>
                                {profile?.expertise_areas && profile.expertise_areas.length > 0 && (
                                    <div className="flex gap-1 flex-wrap justify-end max-w-[40%]">
                                        {profile.expertise_areas.slice(0, 3).map((area) => (
                                            <span
                                                key={area}
                                                className="text-xs px-2 py-1 rounded transition-colors duration-200 text-muted-foreground bg-muted"
                                            >
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
