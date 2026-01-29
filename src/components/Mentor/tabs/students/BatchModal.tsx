import React from 'react';


interface BatchModalProps {
    isDarkMode: boolean;
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    batchData: any; // newBatch or editingBatchData
    setBatchData: (data: any) => void;
    onSubmit: () => void;
    roadmaps?: any[]; // Only for create
}

export const BatchModal: React.FC<BatchModalProps> = ({
    isDarkMode,
    isOpen,
    onClose,
    mode,
    batchData,
    setBatchData,
    onSubmit,
    roadmaps
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`max-w-md w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {mode === 'create' ? 'Create New Batch' : `Edit Batch: ${batchData.name}`}
                </h3>

                <div className="space-y-4 mb-6">
                    {mode === 'create' ? (
                        <>
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Batch Name
                                </label>
                                <input
                                    type="text"
                                    value={batchData.name}
                                    onChange={(e) => setBatchData({ ...batchData, name: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    Assign Roadmap
                                </label>
                                <select
                                    value={batchData.roadmapId}
                                    onChange={(e) => {
                                        const selectedRoadmap = roadmaps?.find(r => r.id === e.target.value);
                                        setBatchData({
                                            ...batchData,
                                            roadmapId: e.target.value,
                                            roadmapName: selectedRoadmap?.name || ''
                                        });
                                    }}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    required
                                >
                                    <option value="">Select Roadmap</option>
                                    {roadmaps?.map(roadmap => (
                                        <option key={roadmap.id} value={roadmap.id}>
                                            {roadmap.title} ({roadmap.total_weeks} weeks)
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={batchData.startDate || ''}
                                    onChange={(e) => setBatchData({ ...batchData, startDate: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    WhatsApp Group Link
                                </label>
                                <input
                                    type="url"
                                    value={batchData.whatsappLink}
                                    onChange={(e) => setBatchData({ ...batchData, whatsappLink: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Discord Server Link
                                </label>
                                <input
                                    type="url"
                                    value={batchData.discordLink}
                                    onChange={(e) => setBatchData({ ...batchData, discordLink: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Emergency Contact
                                </label>
                                <input
                                    type="tel"
                                    value={batchData.emergencyContact}
                                    onChange={(e) => setBatchData({ ...batchData, emergencyContact: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Status
                                </label>
                                <select
                                    value={batchData.status || 'active'}
                                    onChange={(e) => setBatchData({ ...batchData, status: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                >
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onSubmit}
                            className={`flex-1 py-2 px-4 text-white rounded-lg font-medium transition-colors ${mode === 'create' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'
                                }`}
                        >
                            {mode === 'create' ? 'Create Batch' : 'Update Batch'}
                        </button>
                        <button
                            onClick={onClose}
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
        </div>
    );
};
