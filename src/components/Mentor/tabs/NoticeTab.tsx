import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Calendar, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/useAuth';
import { Notice, Batch } from '../../../types/mentor';
import { getTagColor } from '../../../utils/mentorUtils';

interface NoticeTabProps {
    notices: Notice[];
    batches: Batch[];
    selectedBatch: string;
    setSelectedBatch: (id: string) => void;
    onUpdate: () => void;
}

const inputClass = 'w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 transition-colors duration-200 bg-muted text-foreground';

export const NoticeTab: React.FC<NoticeTabProps> = ({
    notices,
    batches,
    selectedBatch,
    setSelectedBatch,
    onUpdate
}) => {
    const { user } = useAuth();
    const [isAddingNotice, setIsAddingNotice] = useState(false);
    const [noticeToEdit, setNoticeToEdit] = useState<Notice | null>(null);

    const [newNotice, setNewNotice] = useState({
        title: '',
        content: '',
        tag: 'Reminder',
        scheduledDate: '',
        scheduledTime: '',
        isPublished: true,
        batchId: ''
    });

    const handleAddNotice = async () => {
        try {
            const { error } = await supabase
                .from('notices')
                .insert([{
                    title: newNotice.title,
                    content: newNotice.content,
                    tag: newNotice.tag,
                    scheduled_date: newNotice.scheduledDate,
                    scheduled_time: newNotice.scheduledTime || null,
                    is_published: newNotice.isPublished,
                    author_id: user?.id,
                    batch_id: selectedBatch || null
                }] as unknown as never)
                .select()
                .single() as { data: any; error: any };

            if (error) throw error;

            setIsAddingNotice(false);
            setNewNotice({
                title: '',
                content: '',
                tag: 'Reminder',
                scheduledDate: '',
                scheduledTime: '',
                isPublished: true,
                batchId: ''
            });
            onUpdate();
        } catch (error) {
            console.error('Error creating notice:', error);
            alert('Failed to create notice');
        }
    };

    const handleUpdateNotice = async () => {
        if (!noticeToEdit) return;

        try {
            const { error } = await supabase
                .from('notices')
                .update({
                    title: noticeToEdit.title,
                    content: noticeToEdit.content,
                    tag: noticeToEdit.tag,
                    scheduled_date: noticeToEdit.scheduledDate,
                    scheduled_time: noticeToEdit.scheduledTime,
                    is_published: noticeToEdit.isPublished
                } as unknown as never)
                .eq('id', noticeToEdit.id);

            if (error) throw error;

            setNoticeToEdit(null);
            onUpdate();
        } catch (error) {
            console.error('Error updating notice:', error);
            alert('Failed to update notice');
        }
    };

    const handleDeleteNotice = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this notice?')) return;

        try {
            const { error } = await supabase
                .from('notices')
                .delete()
                .eq('id', id);

            if (error) throw error;
            onUpdate();
        } catch (error) {
            console.error('Error deleting notice:', error);
            alert('Failed to delete notice');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between">
                <h3 className="text-lg font-bold text-foreground transition-colors duration-200">
                    Notice Management
                </h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Filter by Batch
                        </label>
                        <select
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-border bg-muted text-foreground transition-colors"
                        >
                            <option value="">All Batches</option>
                            {batches.map(batch => (
                                <option key={batch.id} value={batch.id}>{batch.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => setIsAddingNotice(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors h-10"
                    >
                        <Plus className="w-4 h-4" />
                        Create Notice
                    </button>
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden transition-colors duration-200">
                <div className="p-6">
                    <div className="space-y-4">
                        {notices
                            .filter(notice => !selectedBatch || notice.batchId === selectedBatch || !notice.batchId)
                            .map((notice) => (
                                <div
                                    key={notice.id}
                                    className="p-4 rounded-lg border border-border bg-muted transition-colors duration-200"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-semibold text-foreground transition-colors duration-200">
                                                    {notice.title}
                                                </h4>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTagColor(notice.tag)}`}>
                                                    {notice.tag}
                                                </span>
                                                {!notice.isPublished && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                                                        Draft
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm mb-3 leading-relaxed text-muted-foreground transition-colors duration-200">
                                                {notice.content}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground transition-colors duration-200">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{notice.scheduledDate || 'No date'}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{notice.scheduledTime || 'No time'}</span>
                                                </div>
                                                {notice.batchId && (
                                                    <div className="flex items-center gap-1 text-primary">
                                                        For: {batches.find(b => b.id === notice.batchId)?.name || 'Unknown Batch'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setNoticeToEdit(notice)}
                                                className="p-2 rounded transition-colors hover:bg-accent text-muted-foreground"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteNotice(notice.id)}
                                                className="p-2 rounded hover:bg-destructive/10 text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        {notices.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No notices found.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isAddingNotice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg bg-card transition-colors duration-200">
                        <h3 className="text-lg font-bold mb-4 text-foreground transition-colors duration-200">
                            Create New Notice
                        </h3>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={newNotice.title}
                                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                    Content
                                </label>
                                <textarea
                                    value={newNotice.content}
                                    onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                                    rows={4}
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                        Tag
                                    </label>
                                    <select
                                        value={newNotice.tag}
                                        onChange={(e) => setNewNotice({ ...newNotice, tag: e.target.value as any })}
                                        className={inputClass}
                                    >
                                        <option value="Reminder">Reminder</option>
                                        <option value="Homework">Homework</option>
                                        <option value="Assignment">Assignment</option>
                                        <option value="Exam">Exam</option>
                                        <option value="Cancellation">Cancellation</option>
                                        <option value="Resources">Resources</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={newNotice.scheduledDate}
                                        onChange={(e) => setNewNotice({ ...newNotice, scheduledDate: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        value={newNotice.scheduledTime}
                                        onChange={(e) => setNewNotice({ ...newNotice, scheduledTime: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="publish"
                                    checked={newNotice.isPublished}
                                    onChange={(e) => setNewNotice({ ...newNotice, isPublished: e.target.checked })}
                                    className="w-4 h-4 text-primary rounded focus:ring-primary/15 focus:border-primary"
                                />
                                <label htmlFor="publish" className="text-sm text-muted-foreground transition-colors duration-200">
                                    Publish immediately
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleAddNotice}
                                className="flex-1 py-2 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors"
                            >
                                Create Notice
                            </button>
                            <button
                                onClick={() => setIsAddingNotice(false)}
                                className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors bg-muted hover:bg-accent text-muted-foreground"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {noticeToEdit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg bg-card transition-colors duration-200">
                        <h3 className="text-lg font-bold mb-4 text-foreground transition-colors duration-200">
                            Edit Notice
                        </h3>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={noticeToEdit.title}
                                    onChange={(e) => setNoticeToEdit({ ...noticeToEdit, title: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                    Content
                                </label>
                                <textarea
                                    value={noticeToEdit.content}
                                    onChange={(e) => setNoticeToEdit({ ...noticeToEdit, content: e.target.value })}
                                    rows={4}
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                        Tag
                                    </label>
                                    <select
                                        value={noticeToEdit.tag}
                                        onChange={(e) => setNoticeToEdit({ ...noticeToEdit, tag: e.target.value as any })}
                                        className={inputClass}
                                    >
                                        <option value="Reminder">Reminder</option>
                                        <option value="Homework">Homework</option>
                                        <option value="Assignment">Assignment</option>
                                        <option value="Exam">Exam</option>
                                        <option value="Cancellation">Cancellation</option>
                                        <option value="Resources">Resources</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={noticeToEdit.scheduledDate || ''}
                                        onChange={(e) => setNoticeToEdit({ ...noticeToEdit, scheduledDate: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        value={noticeToEdit.scheduledTime || ''}
                                        onChange={(e) => setNoticeToEdit({ ...noticeToEdit, scheduledTime: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="edit-publish"
                                    checked={noticeToEdit.isPublished}
                                    onChange={(e) => setNoticeToEdit({ ...noticeToEdit, isPublished: e.target.checked })}
                                    className="w-4 h-4 text-primary rounded focus:ring-primary/15 focus:border-primary"
                                />
                                <label htmlFor="edit-publish" className="text-sm text-muted-foreground transition-colors duration-200">
                                    Published
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleUpdateNotice}
                                className="flex-1 py-2 px-4 bg-muted text-foreground hover:bg-muted/80 border border-border rounded-lg font-medium transition-colors"
                            >
                                Update Notice
                            </button>
                            <button
                                onClick={() => setNoticeToEdit(null)}
                                className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors bg-muted hover:bg-accent text-muted-foreground"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
