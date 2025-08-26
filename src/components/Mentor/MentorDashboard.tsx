import React, { useState } from 'react';
import { ArrowLeft, Moon, Sun, Users, BookOpen, MessageSquare, Bell, Plus, Edit2, Trash2, ExternalLink, LogOut, User, Phone, Mail, Calendar, Clock, X } from 'lucide-react';

interface MentorDashboardProps {
  onBack: () => void;
  onLogout?: () => void;
  onProfile?: () => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

interface RoadmapItem {
  id: string;
  weekNumber: number;
  domain: string;
  taskType: 'Watch' | 'Read' | 'Project' | 'Attend' | 'MCQ' | 'Written';
  taskName: string;
  taskDetails: string;
  relevantLinks: string;
  deadline: string;
}

interface Batch {
  id: string;
  name: string;
  studentCount: number;
  roadmapId: string;
  roadmapName: string;
  whatsappLink: string;
  discordLink: string;
  emergencyContact: string;
  createdDate: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  institute: string;
  year: string;
  subject: string;
  degree: string;
  batchId: string;
  completedWeeks: number;
  progressPercentage: number;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  tag: 'Reminder' | 'Homework' | 'Assignment' | 'Exam' | 'Cancellation' | 'Resources';
  scheduledDate: string;
  scheduledTime: string;
  isPublished: boolean;
  createdAt: string;
}

const mockRoadmapData: RoadmapItem[] = [
  {
    id: '1',
    weekNumber: 1,
    domain: 'Python Basics',
    taskType: 'Watch',
    taskName: 'Introduction to Python',
    taskDetails: 'Learn Python fundamentals and syntax',
    relevantLinks: 'https://youtube.com/watch?v=example1',
    deadline: '2025-01-15'
  },
  {
    id: '2',
    weekNumber: 1,
    domain: 'Python Basics',
    taskType: 'Read',
    taskName: 'Python Variables and Data Types',
    taskDetails: 'Understanding different data types in Python',
    relevantLinks: 'https://medium.com/python-variables',
    deadline: '2025-01-17'
  },
  {
    id: '3',
    weekNumber: 2,
    domain: 'Control Structures',
    taskType: 'Project',
    taskName: 'Build a Calculator',
    taskDetails: 'Create a simple calculator using Python',
    relevantLinks: 'https://github.com/example/calculator',
    deadline: '2025-01-22'
  }
];

const mockBatches: Batch[] = [
  {
    id: '1',
    name: 'Python Learning Cohort - Batch 15',
    studentCount: 25,
    roadmapId: 'python-basics',
    roadmapName: 'Python Fundamentals',
    whatsappLink: 'https://chat.whatsapp.com/batch15',
    discordLink: 'https://discord.gg/batch15',
    emergencyContact: '+8801234567890',
    createdDate: '2025-01-01'
  },
  {
    id: '2',
    name: 'Data Science Bootcamp - Batch 8',
    studentCount: 18,
    roadmapId: 'data-structures',
    roadmapName: 'Data Structures',
    whatsappLink: 'https://chat.whatsapp.com/batch8',
    discordLink: 'https://discord.gg/batch8',
    emergencyContact: '+8801234567891',
    createdDate: '2025-01-15'
  }
];

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Amira K.',
    email: 'amira.k@example.com',
    phone: '+8801234567892',
    institute: 'Dhaka University',
    year: '3rd Year',
    subject: 'Computer Science',
    degree: 'BSc',
    batchId: '1',
    completedWeeks: 3,
    progressPercentage: 75
  },
  {
    id: '2',
    name: 'Sarah Ahmed',
    email: 'sarah.ahmed@example.com',
    phone: '+8801234567893',
    institute: 'BUET',
    year: '2nd Year',
    subject: 'Software Engineering',
    degree: 'BSc',
    batchId: '1',
    completedWeeks: 2,
    progressPercentage: 60
  }
];

const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Python Assignment Due Tomorrow',
    content: 'Please submit your Python loops assignment by 11:59 PM tomorrow. Make sure to include both examples as discussed in class.',
    tag: 'Assignment',
    scheduledDate: '2025-01-15',
    scheduledTime: '14:30',
    isPublished: true,
    createdAt: '2025-01-14T14:30:00Z'
  },
  {
    id: '2',
    title: 'Weekly Quiz Reminder',
    content: 'Don\'t forget about the weekly quiz on Python fundamentals scheduled for Friday.',
    tag: 'Reminder',
    scheduledDate: '2025-01-16',
    scheduledTime: '10:15',
    isPublished: true,
    createdAt: '2025-01-15T10:15:00Z'
  }
];

export const MentorDashboard: React.FC<MentorDashboardProps> = ({ 
  onBack, 
  onLogout, 
  onProfile, 
  isDarkMode = false, 
  toggleDarkMode 
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'roadmap' | 'students' | 'notice'>('dashboard');
  const [roadmapData, setRoadmapData] = useState(mockRoadmapData);
  const [batches, setBatches] = useState(mockBatches);
  const [students, setStudents] = useState(mockStudents);
  const [notices, setNotices] = useState(mockNotices);
  const [selectedBatch, setSelectedBatch] = useState<string>('1');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingBatch, setIsAddingBatch] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isAddingNotice, setIsAddingNotice] = useState(false);
  const [showAddWeekModal, setShowAddWeekModal] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<string>('python-basics');
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const [roadmaps] = useState([
    { id: 'python-basics', name: 'Python Fundamentals', weeks: 8 },
    { id: 'data-structures', name: 'Data Structures', weeks: 6 },
    { id: 'web-development', name: 'Web Development', weeks: 10 },
    { id: 'machine-learning', name: 'Machine Learning', weeks: 12 }
  ]);

  const getCurrentRoadmap = () => {
    return roadmaps.find(r => r.id === selectedRoadmap) || roadmaps[0];
  };

  const getWeekOptions = () => {
    return Array.from({ length: getCurrentRoadmap().weeks }, (_, i) => i + 1);
  };

  const [newTask, setNewTask] = useState<Omit<RoadmapItem, 'id'>>({
    weekNumber: 1,
    domain: '',
    taskType: 'Watch',
    taskName: '',
    taskDetails: '',
    relevantLinks: '',
    deadline: ''
  });

  const [newBatch, setNewBatch] = useState<Omit<Batch, 'id' | 'createdDate'>>({
    name: '',
    studentCount: 0,
    roadmapId: '',
    roadmapName: '',
    whatsappLink: '',
    discordLink: '',
    emergencyContact: ''
  });

  const [newStudent, setNewStudent] = useState<Omit<Student, 'id' | 'completedWeeks' | 'progressPercentage'>>({
    name: '',
    email: '',
    phone: '',
    institute: '',
    year: '1st Year',
    subject: '',
    degree: 'BSc',
    batchId: selectedBatch
  });

  const [newNotice, setNewNotice] = useState<Omit<Notice, 'id' | 'createdAt'>>({
    title: '',
    content: '',
    tag: 'Reminder',
    scheduledDate: '',
    scheduledTime: '',
    isPublished: false
  });

  const handleAddTask = () => {
    const task: RoadmapItem = {
      ...newTask,
      id: Date.now().toString()
    };
    setRoadmapData([...roadmapData, task]);
    setNewTask({
      weekNumber: 1,
      domain: '',
      taskType: 'Watch',
      taskName: '',
      taskDetails: '',
      relevantLinks: '',
      deadline: ''
    });
    setIsAddingTask(false);
  };

  const handleAddBatch = () => {
    const batch: Batch = {
      ...newBatch,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split('T')[0]
    };
    setBatches([...batches, batch]);
    setNewBatch({
      name: '',
      studentCount: 0,
      roadmapId: '',
      roadmapName: '',
      whatsappLink: '',
      discordLink: '',
      emergencyContact: ''
    });
    setIsAddingBatch(false);
  };

  const handleAddStudent = () => {
    const student: Student = {
      ...newStudent,
      id: Date.now().toString(),
      batchId: selectedBatch,
      completedWeeks: 0,
      progressPercentage: 0
    };
    setStudents([...students, student]);
    setNewStudent({
      name: '',
      email: '',
      phone: '',
      institute: '',
      year: '1st Year',
      subject: '',
      degree: 'BSc',
      batchId: selectedBatch
    });
    setIsAddingStudent(false);
  };

  const handleAddNotice = () => {
    const notice: Notice = {
      ...newNotice,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setNotices([...notices, notice]);
    setNewNotice({
      title: '',
      content: '',
      tag: 'Reminder',
      scheduledDate: '',
      scheduledTime: '',
      isPublished: false
    });
    setIsAddingNotice(false);
  };

  const handleDeleteTask = (id: string) => {
    setRoadmapData(roadmapData.filter(task => task.id !== id));
  };

  const handleDeleteBatch = (id: string) => {
    setBatches(batches.filter(batch => batch.id !== id));
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const handleDeleteNotice = (id: string) => {
    setNotices(notices.filter(notice => notice.id !== id));
  };

  const handleAddWeek = (weekData: any) => {
    // Add week logic here
    console.log('Adding week:', weekData);
    setShowAddWeekModal(false);
  };

  const selectedBatchData = batches.find(batch => batch.id === selectedBatch);
  const batchStudents = students.filter(student => student.batchId === selectedBatch);

  const getTaskTypeColor = (type: string) => {
    const colors = {
      'Watch': isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700',
      'Read': isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700',
      'Project': isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700',
      'Attend': isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-700',
      'MCQ': isDarkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-50 text-yellow-700',
      'Written': isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-50 text-orange-700'
    };
    return colors[type as keyof typeof colors] || colors.Watch;
  };

  const getTagColor = (tag: string) => {
    const colors = {
      'Reminder': isDarkMode ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700' : 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Homework': isDarkMode ? 'bg-blue-900/30 text-blue-300 border-blue-700' : 'bg-blue-50 text-blue-700 border-blue-200',
      'Assignment': isDarkMode ? 'bg-purple-900/30 text-purple-300 border-purple-700' : 'bg-purple-50 text-purple-700 border-purple-200',
      'Exam': isDarkMode ? 'bg-red-900/30 text-red-300 border-red-700' : 'bg-red-50 text-red-700 border-red-200',
      'Cancellation': isDarkMode ? 'bg-orange-900/30 text-orange-300 border-orange-700' : 'bg-orange-50 text-orange-700 border-orange-200',
      'Resources': isDarkMode ? 'bg-green-900/30 text-green-300 border-green-700' : 'bg-green-50 text-green-700 border-green-200'
    };
    return colors[tag as keyof typeof colors] || colors.Reminder;
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl border transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>25</p>
              <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Students</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-500" />
            <div>
              <p className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{batches.length}</p>
              <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Batches</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-green-500" />
            <div>
              <p className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{roadmapData.length}</p>
              <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Roadmap Tasks</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-orange-500" />
            <div>
              <p className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{notices.length}</p>
              <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Notices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Batch-Roadmap Management Table */}
      <div className={`rounded-xl p-6 shadow-sm border mb-8 transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Batch & Roadmap Management
          </h3>
          <button
            onClick={() => setIsAddingBatch(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Batch
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b transition-colors duration-200 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-3 px-4 font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Batch Name
                </th>
                <th className={`text-left py-3 px-4 font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Assigned Roadmap
                </th>
                <th className={`text-left py-3 px-4 font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Students
                </th>
                <th className={`text-left py-3 px-4 font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id} className={`border-b transition-colors duration-200 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className={`py-3 px-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {batch.name}
                  </td>
                  <td className={`py-3 px-4 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {batch.roadmapName}
                  </td>
                  <td className={`py-3 px-4 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {students.filter(s => s.batchId === batch.id).length} students
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {/* Handle edit */}}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode 
                            ? 'hover:bg-gray-700 text-gray-400' 
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBatch(batch.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode 
                            ? 'hover:bg-gray-700 text-red-400' 
                            : 'hover:bg-gray-100 text-red-600'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRoadmap = () => (
    <div className="space-y-6">
      {/* Roadmap Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4 items-center">
          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Select Roadmap
            </label>
            <select
              value={selectedRoadmap}
              onChange={(e) => setSelectedRoadmap(e.target.value)}
              className={`px-3 py-2 border rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {roadmaps.map(roadmap => (
                <option key={roadmap.id} value={roadmap.id}>
                  {roadmap.name} ({roadmap.weeks} weeks)
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddWeekModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Week
          </button>
          <button
            onClick={() => setIsAddingTask(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-bold mb-6 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {getCurrentRoadmap().name} - Tasks
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`transition-colors duration-200 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Week</th>
                <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Domain</th>
                <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</th>
                <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Task Name</th>
                <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Details</th>
                <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Links</th>
                <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Deadline</th>
                <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roadmapData.map((task, index) => (
                <tr key={task.id} className={`border-t transition-colors duration-200 ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <td className={`px-4 py-3 text-sm transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Week {task.weekNumber}
                  </td>
                  <td className={`px-4 py-3 text-sm transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {task.domain}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskTypeColor(task.taskType)}`}>
                      {task.taskType}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {task.taskName}
                  </td>
                  <td className={`px-4 py-3 text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {task.taskDetails}
                  </td>
                  <td className="px-4 py-3">
                    {task.relevantLinks && (
                      <a
                        href={task.relevantLinks}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </td>
                  <td className={`px-4 py-3 text-sm transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {task.deadline}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingTask(task.id)}
                        className={`p-1 rounded transition-colors ${
                          isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 rounded hover:bg-red-100 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Task Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Add New Task
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Week
                </label>
                <select
                  value={newTask.weekNumber}
                  onChange={(e) => setNewTask({...newTask, weekNumber: parseInt(e.target.value)})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                >
                  <option value="">Select Week</option>
                  {getWeekOptions().map(week => (
                    <option key={week} value={week}>Week {week}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Task Type
                </label>
                <select
                  value={newTask.taskType}
                  onChange={(e) => setNewTask({...newTask, taskType: e.target.value as any})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="Watch">Watch</option>
                  <option value="Read">Read</option>
                  <option value="Project">Project</option>
                  <option value="Attend">Attend</option>
                  <option value="MCQ">MCQ</option>
                  <option value="Written">Written</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Domain
                </label>
                <input
                  type="text"
                  value={newTask.domain}
                  onChange={(e) => setNewTask({...newTask, domain: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Task Name
                </label>
                <input
                  type="text"
                  value={newTask.taskName}
                  onChange={(e) => setNewTask({...newTask, taskName: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Task Details
              </label>
              <textarea
                value={newTask.taskDetails}
                onChange={(e) => setNewTask({...newTask, taskDetails: e.target.value})}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Relevant Links
                </label>
                <input
                  type="url"
                  value={newTask.relevantLinks}
                  onChange={(e) => setNewTask({...newTask, relevantLinks: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Deadline
                </label>
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddTask}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Add Task
              </button>
              <button
                onClick={() => setIsAddingTask(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  isDarkMode 
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

      {/* Add Week Modal */}
      {showAddWeekModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl p-6 shadow-lg max-w-md w-full mx-4 transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Add Week to {getCurrentRoadmap().name}
              </h3>
              <button
                onClick={() => setShowAddWeekModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Current Weeks: {getCurrentRoadmap().weeks}
                </label>
                <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Adding a new week will extend this roadmap to {getCurrentRoadmap().weeks + 1} weeks.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAddWeek({ roadmapId: selectedRoadmap })}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Add Week
                </button>
                <button
                  onClick={() => setShowAddWeekModal(false)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    isDarkMode 
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
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      {/* Header with Batch Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Batch & Students Management
          </h3>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className={`px-3 py-2 rounded-lg border transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {batches.map(batch => (
              <option key={batch.id} value={batch.id}>{batch.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddingBatch(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Batch
          </button>
          <button
            onClick={() => setIsAddingStudent(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      {/* Batch Info */}
      {selectedBatchData && (
        <div className={`rounded-xl p-6 border transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
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
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-500" />
                <a href={selectedBatchData.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 text-sm">
                  WhatsApp Group
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                <a href={selectedBatchData.discordLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 text-sm">
                  Discord Server
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500" />
                <a href={`tel:${selectedBatchData.emergencyContact}`} className="text-red-600 hover:text-red-700 text-sm">
                  {selectedBatchData.emergencyContact}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students List */}
      <div className={`rounded-xl border transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          <h4 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Students ({batchStudents.length})
          </h4>
          
          <div className="space-y-4">
            {batchStudents.map((student) => (
              <div
                key={student.id}
                className={`p-4 rounded-lg border transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
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

                  <div className="flex items-center gap-4">
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
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Batch Modal */}
      {isAddingBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
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
                  onChange={(e) => setNewBatch({...newBatch, name: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
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
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                >
                  <option value="">Select Roadmap</option>
                  {roadmaps.map(roadmap => (
                    <option key={roadmap.id} value={roadmap.id}>
                      {roadmap.name} ({roadmap.weeks} weeks)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  WhatsApp Group Link
                </label>
                <input
                  type="url"
                  value={newBatch.whatsappLink}
                  onChange={(e) => setNewBatch({...newBatch, whatsappLink: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Discord Server Link
                </label>
                <input
                  type="url"
                  value={newBatch.discordLink}
                  onChange={(e) => setNewBatch({...newBatch, discordLink: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  value={newBatch.emergencyContact}
                  onChange={(e) => setNewBatch({...newBatch, emergencyContact: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddBatch}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Create Batch
              </button>
              <button
                onClick={() => setIsAddingBatch(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  isDarkMode 
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
          <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
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
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
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
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
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
                  onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Institute
                </label>
                <input
                  type="text"
                  value={newStudent.institute}
                  onChange={(e) => setNewStudent({...newStudent, institute: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Year
                </label>
                <select
                  value={newStudent.year}
                  onChange={(e) => setNewStudent({...newStudent, year: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subject
                </label>
                <input
                  type="text"
                  value={newStudent.subject}
                  onChange={(e) => setNewStudent({...newStudent, subject: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
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
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  isDarkMode 
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

  const renderNotice = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Notice Management
        </h3>
        <button
          onClick={() => setIsAddingNotice(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Notice
        </button>
      </div>
      
      {/* Notices List */}
      <div className={`rounded-xl border overflow-hidden transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className={`p-4 rounded-lg border transition-colors duration-200 ${
                  isDarkMode 
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
                        <span>{notice.scheduledDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{notice.scheduledTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {/* Handle edit */}}
                      className={`p-2 rounded transition-colors ${
                        isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
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
          </div>
        </div>
      </div>

      {/* Add Notice Modal */}
      {isAddingNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
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
                  onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Content
                </label>
                <textarea
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
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
                    onChange={(e) => setNewNotice({...newNotice, tag: e.target.value as any})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
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
                    onChange={(e) => setNewNotice({...newNotice, scheduledDate: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
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
                    onChange={(e) => setNewNotice({...newNotice, scheduledTime: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="publish"
                  checked={newNotice.isPublished}
                  onChange={(e) => setNewNotice({...newNotice, isPublished: e.target.checked})}
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
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  isDarkMode 
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

  const renderNoticeOld = () => (
    <div className="space-y-6">
      <h3 className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Notice Management
      </h3>
      
      <div className={`p-6 rounded-xl border transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <p className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Notice board management features will be implemented here. This will include:
        </p>
        <ul className={`mt-4 space-y-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <li>• Create new announcements</li>
          <li>• Set announcement categories (Reminder, Assignment, etc.)</li>
          <li>• Schedule announcements</li>
          <li>• View announcement analytics</li>
          <li>• Manage announcement visibility</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <div className={`border-b h-16 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">10MS</span>
              </div>
              <h1 className={`text-xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>10MS SheSTEM - Mentor</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {toggleDarkMode && (
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}
              <div className="flex items-center gap-2">
                <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Uttam Deb
                </span>
                <button
                  onClick={onProfile}
                  className="w-8 h-8 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors"
                >
                  <User className="w-4 h-4 mx-auto text-gray-600" />
                </button>
                <button
                  onClick={onLogout}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`border-b h-16 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Mentor Dashboard', icon: Users },
              { id: 'roadmap', label: 'Roadmap', icon: BookOpen },
              { id: 'students', label: 'Batch & Students', icon: Users },
              { id: 'notice', label: 'Notice', icon: Bell }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'roadmap' && renderRoadmap()}
        {activeTab === 'students' && renderStudents()}
        {activeTab === 'notice' && renderNotice()}
      </div>
    </div>
  );
};