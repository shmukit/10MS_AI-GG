import React from 'react';
import { Plus, Users, Edit2, Trash2, Mail, Phone, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { Batch, Student } from '../../../types/mentor';
import { useStudentsTab } from './hooks/useStudentsTab';

interface StudentsTabProps {
    students: Student[];
    batches: Batch[];
    roadmaps: any[];
    selectedBatch: string;
    setSelectedBatch: (id: string) => void;
    isDarkMode: boolean;
    onUpdate: () => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({
    students,
    batches,
    roadmaps,
    selectedBatch,
    setSelectedBatch,
    isDarkMode,
    onUpdate
}) => {
    const {
        isAddingBatch, setIsAddingBatch,
        isEditingBatch, setIsEditingBatch,
        isAddingStudent, setIsAddingStudent,
        isAssigningStudents, setIsAssigningStudents,
        editingBatchData, setEditingBatchData,
        selectedStudents, setSelectedStudents,
        availableStudents,
        showPassword, setShowPassword,
        newBatch, setNewBatch,
        newStudent, setNewStudent,
        copyToClipboard,
        loadAvailableStudents,
        handleAddBatch,
        handleUpdateBatch,
        handleAddStudent,
        handleAssignStudents,
        handleDeleteStudent
    } = useStudentsTab({ selectedBatch, onUpdate });

    const selectedBatchData = batches.find(b => b.id === selectedBatch);
    const batchStudents = students.filter(s => s.batchId === selectedBatch);

    return (
        <div className="space-y-6">
            {/* Header with Batch Selector */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                    <h3 className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Batch & Students Management
                    </h3>
                    <select
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                        className={`px-3 py-2 rounded-lg border transition-colors ${isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                            }`}
                    >
                        {batches.map(batch => (
                            <option key={batch.id} value={batch.id}>{batch.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setIsAddingBatch(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Batch
                    </button>
                    {selectedBatch && (
                        <>
                            <button
                                onClick={() => setIsAddingStudent(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Student
                            </button>
                            <button
                                onClick={async () => {
                                    setIsAssigningStudents(true);
                                    await loadAvailableStudents();
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                            >
                                <Users className="w-4 h-4" />
                                Assign Students
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Batch Info */}
            {selectedBatchData && (
                <div className={`rounded-xl p-6 border transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h4 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {selectedBatchData.name}
                            </h4>
                            <div className="space-y-2">
                                <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <strong>Students:</strong> {batchStudents.length}
                                </p>
                                <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <strong>Created:</strong> {selectedBatchData.createdDate}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {/* Links display ... same as before */}
                            {selectedBatchData.whatsappLink && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-green-500" />
                                        <a href={selectedBatchData.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 text-sm">
                                            WhatsApp Group
                                        </a>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingBatchData(selectedBatchData);
                                            setIsEditingBatch(true);
                                        }}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${isDarkMode
                                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                                            }`}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                </div>
                            )}
                            {/* ... simplified ... */}
                            <button
                                onClick={() => {
                                    setEditingBatchData(selectedBatchData);
                                    setIsEditingBatch(true);
                                }}
                                className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${isDarkMode
                                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                                    }`}
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Batch Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Students List */}
            <div className={`rounded-xl border transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                <div className="p-6">
                    <h4 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Students ({batchStudents.length})
                    </h4>

                    <div className="space-y-4">
                        {batchStudents.map((student) => (
                            <div
                                key={student.id}
                                className={`p-4 rounded-lg border transition-colors duration-200 ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600'
                                    : 'bg-gray-50 border-gray-200'
                                    }`}
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-gray-600">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>

                                        <div className="flex-1">
                                            <h5 className={`font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {student.name}
                                            </h5>
                                            <div className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {student.degree} {student.subject} • {student.year}
                                            </div>
                                            <div className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {student.institute}
                                            </div>
                                            <div className="flex items-center gap-4 mt-1">
                                                <a href={`mailto:${student.email}`} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                                                    <Mail className="w-3 h-3" />
                                                    {student.email}
                                                </a>
                                                <a href={`tel:${student.phone}`} className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700">
                                                    <Phone className="w-3 h-3" />
                                                    {student.phone}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="text-center">
                                            <div className={`text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                Week {student.completedWeeks}/6
                                            </div>
                                            <div className={`text-xs transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {student.progressPercentage}% Complete
                                            </div>
                                            <div className={`w-20 h-2 rounded-full mt-1 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                                <div
                                                    className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                                                    style={{ width: `${student.progressPercentage}%` }}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDeleteStudent(student.id)}
                                            className="p-2 rounded hover:bg-red-100 text-red-600"
                                            title="Remove from batch"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {batchStudents.length === 0 && (
                            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                No students in this batch yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Batch Modal */}
            {/* ... same as before ... */}
            {isAddingBatch && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`max-w-md w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Create New Batch
                        </h3>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Batch Name
                                </label>
                                <input
                                    type="text"
                                    value={newBatch.name}
                                    onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
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
                                    value={newBatch.roadmapId}
                                    onChange={(e) => {
                                        const selectedRoadmap = roadmaps.find(r => r.id === e.target.value);
                                        setNewBatch({
                                            ...newBatch,
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
                                    {roadmaps.map(roadmap => (
                                        <option key={roadmap.id} value={roadmap.id}>
                                            {roadmap.title} ({roadmap.total_weeks} weeks)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* ... Other batch inputs ... */}
                            <div>
                                <button
                                    onClick={handleAddBatch}
                                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Create Batch
                                </button>
                                <button
                                    onClick={() => setIsAddingBatch(false)}
                                    className={`w-full mt-2 py-2 px-4 rounded-lg font-medium transition-colors ${isDarkMode
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
            )}

            {/* Edit Batch Modal */}
            {isEditingBatch && editingBatchData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`max-w-md w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Edit Batch: {editingBatchData.name}
                        </h3>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    WhatsApp Group Link
                                </label>
                                <input
                                    type="url"
                                    value={editingBatchData.whatsappLink}
                                    onChange={(e) => setEditingBatchData({ ...editingBatchData, whatsappLink: e.target.value })}
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
                                    value={editingBatchData.discordLink}
                                    onChange={(e) => setEditingBatchData({ ...editingBatchData, discordLink: e.target.value })}
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
                                    value={editingBatchData.emergencyContact}
                                    onChange={(e) => setEditingBatchData({ ...editingBatchData, emergencyContact: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleUpdateBatch}
                                className="flex-1 py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Update Batch
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditingBatch(false);
                                    setEditingBatchData(null);
                                }}
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

            {/* Add Student Modal */}
            {isAddingStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Add New Student
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={newStudent.name}
                                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={newStudent.email}
                                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={newStudent.phone}
                                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newStudent.password}
                                        onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                                        className={`w-full px-3 py-2 pr-20 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="p-1"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(newStudent.password)}
                                            className="p-1 ml-1"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>


                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Institute
                                </label>
                                <input
                                    type="text"
                                    value={newStudent.institute}
                                    onChange={(e) => setNewStudent({ ...newStudent, institute: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Year
                                </label>
                                <select
                                    value={newStudent.year}
                                    onChange={(e) => setNewStudent({ ...newStudent, year: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                >
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                    <option value="5th Year">5th Year</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleAddStudent}
                                className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Add Student
                            </button>
                            <button
                                onClick={() => setIsAddingStudent(false)}
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

            {/* Assign Students Modal */}
            {isAssigningStudents && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Assign Students to Batch
                        </h3>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Select Students
                                </label>
                                <div className={`max-h-60 overflow-y-auto border rounded-lg p-3 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                                    }`}>
                                    {availableStudents.map((student) => (
                                        <div key={student.id} className={`flex items-center gap-3 p-2 rounded transition-colors duration-200 ${student.isAssigned
                                            ? (isDarkMode ? 'bg-green-900/20 border border-green-600/30' : 'bg-green-50 border border-green-200')
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                                            }`}>
                                            <div className="flex items-center gap-2">
                                                {student.isAssigned ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedStudents.includes(student.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) setSelectedStudents([...selectedStudents, student.id]);
                                                            else setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {student.first_name} {student.last_name}
                                                </div>
                                                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {student.email}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleAssignStudents}
                                disabled={selectedStudents.length === 0}
                                className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-medium transition-colors"
                            >
                                Assign {selectedStudents.length} Students
                            </button>
                            <button
                                onClick={() => {
                                    setIsAssigningStudents(false);
                                    setSelectedStudents([]);
                                }}
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
