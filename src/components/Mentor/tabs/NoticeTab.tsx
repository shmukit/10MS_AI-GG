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
    isDarkMode: boolean;
    onUpdate: () => void;
}

export const NoticeTab: React.FC<NoticeTabProps> = ({
    notices,
    batches,
    selectedBatch,
    setSelectedBatch,
    isDarkMode,
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
                    scheduled_time: newNotice.scheduledTime,
                    is_published: newNotice.isPublished,
                    author_id: user?.id,
                    batch_id: selectedBatch || null // Associate with selected batch or global
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
                <h3 className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Notice Management
                </h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                    {/* Batch Dropdown */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Filter by Batch
                        </label>
                        <select
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            className={`px-3 py-2 rounded-lg border transition-colors ${isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                }`}
                        >
                            <option value="">All Batches</option>
                            {batches.map(batch => (
                                <option key={batch.id} value={batch.id}>{batch.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => setIsAddingNotice(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors h-10"
                    >
                        <Plus className="w-4 h-4" />
                        Create Notice
                    </button>
                </div>
            </div>

            {/* Notices List */}
            <div className={`rounded-xl border overflow-hidden transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                <div className="p-6">
                    <div className="space-y-4">
                        {notices
                            .filter(notice => !selectedBatch || notice.batchId === selectedBatch || !notice.batchId) // Show batch specific or global
                            .map((notice) => (
                                <div
                                    key={notice.id}
                                    className={`p-4 rounded-lg border transition-colors duration-200 ${isDarkMode
                                        ? 'bg-gray-700 border-gray-600'
                                        : 'bg-gray-50 border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className={`font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {notice.title}
                                                </h4>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTagColor(notice.tag)}`}>
                                                    {notice.tag}
                                                </span>
                                                {!notice.isPublished && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                        Draft
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-sm mb-3 leading-relaxed transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {notice.content}
                                            </p>
                                            <div className={`flex items-center gap-4 text-xs transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{notice.scheduledDate || 'No date'}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{notice.scheduledTime || 'No time'}</span>
                                                </div>
                                                {notice.batchId && (
                                                    <div className="flex items-center gap-1 text-blue-500">
                                                        For: {batches.find(b => b.id === notice.batchId)?.name || 'Unknown Batch'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setNoticeToEdit(notice)}
                                                className={`p-2 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                                                    }`}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteNotice(notice.id)}
                                                className="p-2 rounded hover:bg-red-100 text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        {notices.length === 0 && (
                            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                No notices found.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Notice Modal */}
            {isAddingNotice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Create New Notice
                        </h3>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={newNotice.title}
                                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Content
                                </label>
                                <textarea
                                    value={newNotice.content}
                                    onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                                    rows={4}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Tag
                                    </label>
                                    <select
                                        value={newNotice.tag}
                                        onChange={(e) => setNewNotice({ ...newNotice, tag: e.target.value as any })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
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
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={newNotice.scheduledDate}
                                        onChange={(e) => setNewNotice({ ...newNotice, scheduledDate: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        value={newNotice.scheduledTime}
                                        onChange={(e) => setNewNotice({ ...newNotice, scheduledTime: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="publish"
                                    checked={newNotice.isPublished}
                                    onChange={(e) => setNewNotice({ ...newNotice, isPublished: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="publish" className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Publish immediately
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleAddNotice}
                                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Create Notice
                            </button>
                            <button
                                onClick={() => setIsAddingNotice(false)}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${isDarkMode
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Notice Modal */}
            {noticeToEdit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Edit Notice
                        </h3>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={noticeToEdit.title}
                                    onChange={(e) => setNoticeToEdit({ ...noticeToEdit, title: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Content
                                </label>
                                <textarea
                                    value={noticeToEdit.content}
                                    onChange={(e) => setNoticeToEdit({ ...noticeToEdit, content: e.target.value })}
                                    rows={4}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Tag
                                    </label>
                                    <select
                                        value={noticeToEdit.tag}
                                        onChange={(e) => setNoticeToEdit({ ...noticeToEdit, tag: e.target.value as any })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
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
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={noticeToEdit.scheduledDate || ''}
                                        onChange={(e) => setNoticeToEdit({ ...noticeToEdit, scheduledDate: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        value={noticeToEdit.scheduledTime || ''}
                                        onChange={(e) => setNoticeToEdit({ ...noticeToEdit, scheduledTime: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="edit-publish"
                                    checked={noticeToEdit.isPublished}
                                    onChange={(e) => setNoticeToEdit({ ...noticeToEdit, isPublished: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="edit-publish" className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Published
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleUpdateNotice}
                                className="flex-1 py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Update Notice
                            </button>
                            <button
                                onClick={() => setNoticeToEdit(null)}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${isDarkMode
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
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
