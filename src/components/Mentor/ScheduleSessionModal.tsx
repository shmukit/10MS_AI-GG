
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Video, Users, BookOpen, Users as UsersIcon } from 'lucide-react';
import { createSession } from '../../services/liveSessionService';
import { DatabaseService } from '../../services/database';
import { supabase } from '../../lib/supabase';
import { posthog } from '../../lib/posthog';

interface ScheduleSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSessionCreated: () => void;
    batchId?: string;
}

interface Roadmap {
    id: string;
    title: string;
}

interface Batch {
    id: string;
    name: string;
    roadmap_id: string;
}

interface RoadmapWeek {
    id: string;
    week_number: number;
    title: string;
}

const inputClass = 'w-full p-2 border border-border rounded-lg outline-none transition-colors duration-200 bg-muted text-foreground placeholder:text-muted-foreground';

export const ScheduleSessionModal: React.FC<ScheduleSessionModalProps> = ({ isOpen, onClose, onSessionCreated, batchId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState(60);
    const [meetingLink, setMeetingLink] = useState('');
    const [sessionType, setSessionType] = useState<'clinic' | 'anchor' | 'workshop' | 'office_hours'>('clinic');
    const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [mentorId, setMentorId] = useState<string | null>(null);

    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [weeks, setWeeks] = useState<RoadmapWeek[]>([]);
    const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>('');
    const [selectedBatchId, setSelectedBatchId] = useState<string>(batchId || '');

    useEffect(() => {
        const fetchUser = async () => {
            const user = await DatabaseService.getCurrentUser();
            if (user) setMentorId(user.id);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: roadmapsData } = await supabase
                    .from('roadmaps')
                    .select('id, title')
                    .eq('is_active', true);

                if (roadmapsData) setRoadmaps(roadmapsData);

                const { data: batchesData } = await supabase
                    .from('batches')
                    .select('id, name, roadmap_id')
                    .eq('status', 'active');

                if (batchesData) {
                    setBatches(batchesData);

                    if (batchId) {
                        const matchedBatch = (batchesData as Batch[]).find(b => b.id === batchId);
                        if (matchedBatch) {
                            setSelectedRoadmapId(matchedBatch.roadmap_id);
                            setSelectedBatchId(batchId);
                        }
                    }
                }

            } catch (error) {
                console.error('Error fetching selection data:', error);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen, batchId]);

    useEffect(() => {
        const fetchWeeks = async () => {
            if (!selectedRoadmapId) {
                setWeeks([]);
                return;
            }

            try {
                const { data: weeksData } = await supabase
                    .from('roadmap_weeks')
                    .select('id, week_number, title')
                    .eq('roadmap_id', selectedRoadmapId)
                    .order('week_number');

                if (weeksData) setWeeks(weeksData);
            } catch (error) {
                console.error('Error fetching weeks:', error);
            }
        };

        fetchWeeks();
    }, [selectedRoadmapId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mentorId) {
            alert('You must be logged in');
            return;
        }

        const finalBatchId = selectedBatchId;

        if (!finalBatchId) {
            alert('Please select a batch for this session.');
            return;
        }

        const startDateTime = new Date(`${date}T${time}`);

        setLoading(true);
        try {
            await createSession({
                mentor_id: mentorId,
                batch_id: finalBatchId,
                title,
                description,
                start_time: startDateTime.toISOString(),
                duration_minutes: duration,
                meeting_link: meetingLink,
                platform: meetingLink.includes('zoom') ? 'zoom' : meetingLink.includes('meet') ? 'meet' : 'other',
                session_type: sessionType,
                target_audience: selectedWeeks.length > 0 ? selectedWeeks : ['all']
            });
            
            posthog?.capture('mentor_session_scheduled', {
                mentor_id: mentorId,
                batch_id: finalBatchId,
                session_type: sessionType,
                topic: title
            });

            onSessionCreated();
            onClose();
            resetForm();
        } catch (error) {
            console.error('Failed to schedule session', error);
            alert('Failed to schedule session');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDate('');
        setTime('');
        setDuration(60);
        setMeetingLink('');
        setSessionType('clinic');
        setSelectedWeeks([]);
        if (!batchId) {
            setSelectedRoadmapId('');
            setSelectedBatchId('');
        }
    };

    const toggleWeek = (weekTitle: string) => {
        setSelectedWeeks(prev =>
            prev.includes(weekTitle) ? prev.filter(w => w !== weekTitle) : [...prev, weekTitle]
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="rounded-xl shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh] bg-card transition-colors duration-200">
                <div className="flex justify-between items-center p-6 border-b border-border transition-colors duration-200">
                    <h2 className="text-xl font-bold text-foreground transition-colors duration-200">Schedule Live Session</h2>
                    <button onClick={onClose} className="transition-colors duration-200 text-muted-foreground hover:text-foreground">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg border border-border">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground transition-colors duration-200">
                                <BookOpen className="inline w-4 h-4 mr-1" /> Roadmap
                            </label>
                            <select
                                value={selectedRoadmapId}
                                onChange={(e) => {
                                    setSelectedRoadmapId(e.target.value);
                                    setSelectedBatchId('');
                                }}
                                className={inputClass}
                            >
                                <option value="">Select Roadmap</option>
                                {roadmaps.map(roadmap => (
                                    <option key={roadmap.id} value={roadmap.id}>{roadmap.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground transition-colors duration-200">
                                <UsersIcon className="inline w-4 h-4 mr-1" /> Batch
                            </label>
                            <select
                                value={selectedBatchId}
                                onChange={(e) => setSelectedBatchId(e.target.value)}
                                disabled={!selectedRoadmapId}
                                className={`${inputClass} disabled:opacity-50`}
                            >
                                <option value="">Select Batch</option>
                                {batches
                                    .filter(b => b.roadmap_id === selectedRoadmapId)
                                    .map(batch => (
                                        <option key={batch.id} value={batch.id}>{batch.name}</option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-muted-foreground transition-colors duration-200">Session Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className={`${inputClass} focus:border-primary focus:ring-[3px] focus:ring-primary/15`}
                            placeholder="e.g., Module 2 Deep Dive"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground transition-colors duration-200">Session Type</label>
                            <select
                                value={sessionType}
                                onChange={(e) => setSessionType(e.target.value as any)}
                                className={inputClass}
                            >
                                <option value="clinic">Clinic (Level Specific)</option>
                                <option value="workshop">Workshop (General)</option>
                                <option value="anchor">Anchor Session</option>
                                <option value="office_hours">Office Hours</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-muted-foreground transition-colors duration-200">
                            <Users className="w-4 h-4" /> Weekly Modules (Topics)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {weeks.length > 0 ? (
                                weeks.map(week => (
                                    <button
                                        key={week.id}
                                        type="button"
                                        onClick={() => toggleWeek(`Week ${week.week_number}: ${week.title}`)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors text-left ${selectedWeeks.includes(`Week ${week.week_number}: ${week.title}`)
                                            ? 'bg-accent border-primary/30 text-foreground'
                                            : 'bg-muted border-border text-muted-foreground hover:bg-accent'
                                            }`}
                                    >
                                        Week {week.week_number}: {week.title}
                                    </button>
                                ))
                            ) : (
                                <span className="text-sm text-muted-foreground">
                                    {selectedRoadmapId ? 'No weeks found for this roadmap.' : 'Select a roadmap to see topics.'}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground transition-colors duration-200"><Calendar className="inline w-4 h-4 mr-1" /> Date</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground transition-colors duration-200"><Clock className="inline w-4 h-4 mr-1" /> Time</label>
                            <input
                                type="time"
                                required
                                value={time}
                                onChange={e => setTime(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-muted-foreground transition-colors duration-200">Duration (minutes)</label>
                        <select
                            value={duration}
                            onChange={e => setDuration(Number(e.target.value))}
                            className={inputClass}
                        >
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>1 hour</option>
                            <option value={90}>1.5 hours</option>
                            <option value={120}>2 hours</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-muted-foreground transition-colors duration-200"><Video className="inline w-4 h-4 mr-1" /> Meeting Link</label>
                        <input
                            type="url"
                            required
                            value={meetingLink}
                            onChange={e => setMeetingLink(e.target.value)}
                            placeholder="https://zoom.us/j/..."
                            className={`${inputClass} focus:border-primary focus:ring-[3px] focus:ring-primary/15`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-muted-foreground transition-colors duration-200">Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className={`${inputClass} focus:border-primary focus:ring-[3px] focus:ring-primary/15 resize-none`}
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4 transition-colors duration-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg transition-colors text-muted-foreground hover:bg-accent"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Scheduling...' : 'Schedule Session'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
