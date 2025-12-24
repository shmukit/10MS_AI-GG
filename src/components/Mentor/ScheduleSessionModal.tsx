
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Video, Users } from 'lucide-react';
import { liveSessionService } from '../../services/liveSessionService';
import { DatabaseService } from '../../services/database';

interface ScheduleSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSessionCreated: () => void;
    batchId?: string; // Optional: pre-fill batch if creating from a context
}

export const ScheduleSessionModal: React.FC<ScheduleSessionModalProps> = ({ isOpen, onClose, onSessionCreated, batchId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState(60);
    const [meetingLink, setMeetingLink] = useState('');
    const [sessionType, setSessionType] = useState<'clinic' | 'anchor' | 'workshop' | 'office_hours'>('clinic');
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]); // For TaRL targeting
    const [loading, setLoading] = useState(false);
    const [mentorId, setMentorId] = useState<string | null>(null);

    // Available levels for targeting (Mock for now, could come from DB constants)
    const availableLevels = ['Module 1', 'Module 2', 'Module 3', 'Advanced'];

    useEffect(() => {
        const fetchUser = async () => {
            const user = await DatabaseService.getCurrentUser();
            if (user) setMentorId(user.id);
        };
        fetchUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mentorId) {
            alert('You must be logged in');
            return;
        }

        // Combine date and time
        const startDateTime = new Date(`${date}T${time}`);

        setLoading(true);
        try {
            await liveSessionService.createSession({
                mentor_id: mentorId,
                batch_id: batchId || null, // If explicit batch context is missing, might be global or need selection (skipping global selection for now)
                title,
                description,
                start_time: startDateTime.toISOString(),
                duration_minutes: duration,
                meeting_link: meetingLink,
                platform: meetingLink.includes('zoom') ? 'zoom' : meetingLink.includes('meet') ? 'meet' : 'other',
                session_type: sessionType,
                target_audience: selectedLevels.length > 0 ? selectedLevels : ['all']
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
        setSelectedLevels([]);
    };

    const toggleLevel = (level: string) => {
        setSelectedLevels(prev =>
            prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Schedule Live Session</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Session Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g., Module 2 Deep Dive"
                        />
                    </div>

                    {/* Type & Levels (TaRL) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
                            <select
                                value={sessionType}
                                onChange={(e) => setSessionType(e.target.value as any)}
                                className="w-full p-2 border rounded-lg outline-none bg-white"
                            >
                                <option value="clinic">Clinic (Level Specific)</option>
                                <option value="workshop">Workshop (General)</option>
                                <option value="anchor">Anchor Session</option>
                                <option value="office_hours">Office Hours</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Users className="w-4 h-4" /> Target Audience (Levels)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {availableLevels.map(level => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => toggleLevel(level)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${selectedLevels.includes(level)
                                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                            {selectedLevels.length === 0 && <span className="text-xs text-gray-400 self-center">(Defaults to All)</span>}
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1"><Calendar className="inline w-4 h-4 mr-1" /> Date</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full p-2 border rounded-lg outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1"><Clock className="inline w-4 h-4 mr-1" /> Time</label>
                            <input
                                type="time"
                                required
                                value={time}
                                onChange={e => setTime(e.target.value)}
                                className="w-full p-2 border rounded-lg outline-none"
                            />
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                        <select
                            value={duration}
                            onChange={e => setDuration(Number(e.target.value))}
                            className="w-full p-2 border rounded-lg outline-none bg-white"
                        >
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>1 hour</option>
                            <option value={90}>1.5 hours</option>
                            <option value={120}>2 hours</option>
                        </select>
                    </div>

                    {/* Meeting Link */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1"><Video className="inline w-4 h-4 mr-1" /> Meeting Link</label>
                        <input
                            type="url"
                            required
                            value={meetingLink}
                            onChange={e => setMeetingLink(e.target.value)}
                            placeholder="https://zoom.us/j/..."
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            rows={3}
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Scheduling...' : 'Schedule Session'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
