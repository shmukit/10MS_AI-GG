
import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Loader } from 'lucide-react';
import { LiveSession, getUpcomingSessions } from '../../services/liveSessionService';
import { LiveSessionCard } from './LiveSessionCard';

interface LiveSessionListProps {
    batchId: string;
    isMentor?: boolean;
    refreshTrigger?: number; // A simple counter to trigger Refetch
    currentLevel?: number;
}

export const LiveSessionList: React.FC<LiveSessionListProps> = ({ batchId, isMentor = false, refreshTrigger, currentLevel }) => {
    const [sessions, setSessions] = useState<LiveSession[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        // If no batch, maybe don't fetch anything? Or fetch all?
        // For now assuming batchId is provided (e.g. from Dashboard context)
        if (!batchId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await getUpcomingSessions(batchId);
            // Client-side sort just in case: Live ones first, then nearest future
            // Actually DB query handles time order.
            setSessions(data);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [batchId, refreshTrigger]);

    if (loading) return (
        <div className="flex justify-center p-8 text-blue-500">
            <Loader className="w-6 h-6 animate-spin" />
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                    Upcoming Sessions
                </h3>
                {/* If we had a "view all" link, it would go here */}
            </div>

            {sessions.length === 0 ? (
                <div className="text-center py-6 bg-muted/20 rounded-xl border border-dashed border-border">
                    <p className="text-sm text-muted-foreground">No upcoming sessions scheduled.</p>
                    {isMentor && <p className="text-xs text-muted-foreground mt-1">Click "Schedule Class" to add one.</p>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sessions.map(session => (
                        <LiveSessionCard
                            key={session.id}
                            session={session}
                            isMentor={isMentor}
                            onDelete={fetchSessions}
                            currentLevel={currentLevel}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
