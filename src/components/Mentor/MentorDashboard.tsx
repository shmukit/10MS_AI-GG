import React, { useState, useEffect } from 'react';
import { ArrowLeft, Moon, Sun, Users, BookOpen, MessageSquare, Bell, Plus, Edit2, Trash2, ExternalLink, LogOut, User, Phone, Mail, Calendar, Clock, X, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { MentorHeader } from './MentorHeader';
import { useAuth } from '../../lib/useAuth';
import { supabase } from '../../lib/supabase';

interface MentorDashboardProps {
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
  meetingTime?: string;
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
  tag: 'Reminder' | 'Homework' | 'Assignment' | 'Exam' | 'Cancellation' | 'Resources' | 'Welcome' | string;
  scheduledDate: string;
  scheduledTime: string;
  isPublished: boolean;
  createdAt: string;
  batchId?: string; // Added for filtering
}

// Mock data removed - now using real API data

export const MentorDashboard: React.FC<MentorDashboardProps> = ({ 
  onLogout, 
  onProfile, 
  isDarkMode = false, 
  toggleDarkMode 
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'roadmap' | 'students' | 'notice'>('dashboard');
  const [roadmapData, setRoadmapData] = useState<RoadmapItem[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingBatch, setIsAddingBatch] = useState(false);
  const [isEditingBatch, setIsEditingBatch] = useState(false);
  const [editingBatchData, setEditingBatchData] = useState<Batch | null>(null);
  const [noticeToDelete, setNoticeToDelete] = useState<string | null>(null);
  const [noticeToEdit, setNoticeToEdit] = useState<Notice | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isAssigningStudents, setIsAssigningStudents] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [availableStudents, setAvailableStudents] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isAddingNotice, setIsAddingNotice] = useState(false);
  const [isAddingRoadmap, setIsAddingRoadmap] = useState(false);
  const [isEditingRoadmap, setIsEditingRoadmap] = useState(false);
  const [showAddWeekModal, setShowAddWeekModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<string>('');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingRoadmapData, setEditingRoadmapData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Password copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Password copied to clipboard!');
    }
  };

  const [roadmaps, setRoadmaps] = useState<any[]>([]);

  const getCurrentRoadmap = () => {
    return roadmaps.find(r => r.id === selectedRoadmap) || roadmaps[0];
  };

  const getWeekOptions = () => {
    const current = getCurrentRoadmap();
    return current && current.total_weeks ? Array.from({ length: current.total_weeks }, (_, i) => i + 1) : [];
  };

  const [newTask, setNewTask] = useState<Omit<RoadmapItem, 'id'> & { meetingTime?: string }>({
    weekNumber: 1,
    domain: '',
    taskType: 'Watch',
    taskName: '',
    taskDetails: '',
    relevantLinks: '',
    deadline: '',
    meetingTime: ''
  });

  const [newRoadmap, setNewRoadmap] = useState({
    title: '',
    description: '',
    total_weeks: 8,
    difficulty_level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    prerequisites: '',
    category: ''
  });

  const [editingTaskData, setEditingTaskData] = useState<RoadmapItem | null>(null);
  const [weekFilter, setWeekFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [newBatch, setNewBatch] = useState<Omit<Batch, 'id' | 'createdDate'>>({
    name: '',
    studentCount: 0,
    roadmapId: '',
    roadmapName: '',
    whatsappLink: '',
    discordLink: '',
    emergencyContact: ''
  });

  const [newStudent, setNewStudent] = useState<Omit<Student, 'id' | 'completedWeeks' | 'progressPercentage'> & { password: string }>({
    name: '',
    email: '',
    phone: '',
    password: 'NeverStopLearning!',
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

  const handleAddTask = async () => {
    if (!selectedRoadmap || !newTask.weekNumber) {
      setError('Please select a roadmap and week');
      return;
    }

    try {
      console.log('🔄 Adding new task:', newTask);
      
      // First, get the week ID for the selected week number
      const { data: weekData, error: weekError } = await supabase
        .from('roadmap_weeks')
        .select('id')
        .eq('roadmap_id', selectedRoadmap)
        .eq('week_number', newTask.weekNumber)
        .single();

      if (weekError) {
        console.error('Error finding week:', weekError);
        throw new Error(`Week ${newTask.weekNumber} not found. Please add the week first.`);
      }

      // Insert new task into roadmap_tasks table
      const { data: taskData, error: taskError } = await supabase
        .from('roadmap_tasks')
        .insert([{
          week_id: weekData.id,
          task_name: newTask.taskName,
          task_details: newTask.taskDetails,
          task_type: newTask.taskType.toLowerCase(),
          relevant_links: newTask.relevantLinks ? [newTask.relevantLinks] : [],
          deadline: newTask.deadline || null,
          meeting_time: newTask.meetingTime || null,
          is_active: true
        }])
        .select()
        .single();

      if (taskError) {
        console.error('Error adding task:', taskError);
        throw taskError;
      }

      console.log('✅ Task added successfully:', taskData);
      
      // Add to local state
      const task: RoadmapItem = {
        id: taskData.id,
        weekNumber: newTask.weekNumber,
        domain: newTask.domain,
        taskType: newTask.taskType,
        taskName: newTask.taskName,
        taskDetails: newTask.taskDetails,
        relevantLinks: newTask.relevantLinks,
        deadline: newTask.deadline,
        meetingTime: newTask.meetingTime
      };
      
      setRoadmapData([...roadmapData, task]);
      
      // Reset form
      setNewTask({
        weekNumber: 1,
        domain: '',
        taskType: 'Watch',
        taskName: '',
        taskDetails: '',
        relevantLinks: '',
        deadline: '',
        meetingTime: ''
      });
      
      setIsAddingTask(false);
      alert(`✅ Task "${newTask.taskName}" added successfully to Week ${newTask.weekNumber}!`);
      
    } catch (err) {
      console.error('❌ Error adding task:', err);
      setError('Failed to add task');
      alert(`❌ Failed to add task: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
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

  const handleUpdateBatch = async () => {
    if (!editingBatchData) return;
    
    try {
      console.log('🔄 Updating batch:', editingBatchData);
      
      // Update batch in database - using correct column names
      const { data, error } = await supabase
        .from('batches')
        .update({
          whatsapp_link: editingBatchData.whatsappLink || null,
          discord_link: editingBatchData.discordLink || null,
          emergency_contact: editingBatchData.emergencyContact || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingBatchData.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating batch:', error);
        throw error;
      }

      console.log('✅ Batch updated successfully:', data);
      
      // Update local state with the updated data
      const updatedBatch = {
        ...editingBatchData,
        whatsappLink: editingBatchData.whatsappLink || '',
        discordLink: editingBatchData.discordLink || '',
        emergencyContact: editingBatchData.emergencyContact || ''
      };
      
      setBatches(batches.map(batch => 
        batch.id === editingBatchData.id ? updatedBatch : batch
      ));
      
      // The selectedBatchData will automatically update since it's computed from the batches array
      
      setIsEditingBatch(false);
      setEditingBatchData(null);
      
      // Refresh data to show updated batch information
      await fetchData();
      
      alert(`✅ Batch "${editingBatchData.name}" updated successfully!`);
      
    } catch (err) {
      console.error('❌ Error updating batch:', err);
      setError('Failed to update batch');
      alert(`❌ Failed to update batch: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.email || !selectedBatch) {
      setError('Please fill in name, email, and select a batch');
      return;
    }

    try {
      console.log('🔄 Adding new student:', newStudent);
      
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', newStudent.email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing user:', checkError);
        throw checkError;
      }

      let userId: string;

      if (existingUser) {
        // User already exists, use their ID
        userId = existingUser.id;
        console.log('✅ User already exists:', userId);
      } else {
        // Create a new user with a generated UUID
        userId = crypto.randomUUID();
        console.log('✅ Generated new user ID:', userId);
      }

      // Insert or update user in users table
      let insertedUser;
      
      if (existingUser) {
        // Update existing user
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            role: 'student',
            first_name: newStudent.name.split(' ')[0] || newStudent.name,
            last_name: newStudent.name.split(' ').slice(1).join(' ') || '',
            is_active: true,
            email_verified: true
          })
          .eq('id', userId)
          .select()
          .single();
          
        if (updateError) {
          console.error('Error updating user:', updateError);
          throw updateError;
        }
        
        insertedUser = updatedUser;
        console.log('✅ User updated in users table:', insertedUser);
      } else {
        // Insert new user
        const { data: newUser, error: userInsertError } = await supabase
          .from('users')
          .insert([{
            id: userId,
            email: newStudent.email,
            password_hash: `$2a$10$${newStudent.password}`, // Simple hash for MVP - replace with proper bcrypt in production
            role: 'student',
            first_name: newStudent.name.split(' ')[0] || newStudent.name,
            last_name: newStudent.name.split(' ').slice(1).join(' ') || '',
            is_active: true,
            email_verified: true
          }])
          .select()
          .single();
          
        if (userInsertError) {
          console.error('Error inserting user:', userInsertError);
          throw userInsertError;
        }
        
        insertedUser = newUser;
        console.log('✅ User inserted into users table:', insertedUser);
      }



      // Create student profile (without batch_id - that's handled separately)
      const { data: profileData, error: profileError } = await supabase
        .from('student_profiles')
        .insert([{
          user_id: userId,
          institute: newStudent.institute,
          year: newStudent.year,
          subject: newStudent.subject,
          degree: newStudent.degree,
          completed_weeks: 0,
          progress_percentage: 0,
          enrollment_date: new Date().toISOString()
        }])
        .select()
        .single();

      if (profileError) {
        console.error('Error creating student profile:', profileError);
        throw profileError;
      }

      console.log('✅ Student profile created:', profileData);

      // Add student to batch assignments
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('student_batch_assignments')
        .insert([{
          student_id: userId,
          batch_id: selectedBatch,
          status: 'active',
          enrollment_date: new Date().toISOString().split('T')[0] // DATE format, not timestamp
        }])
        .select()
        .single();

      if (assignmentError) {
        console.error('Error assigning student to batch:', assignmentError);
        throw assignmentError;
      }

      console.log('✅ Student assigned to batch:', assignmentData);

      // Add to local state
      const student: Student = {
        id: userId,
        name: newStudent.name,
        email: newStudent.email,
        phone: newStudent.phone,
        institute: newStudent.institute,
        year: newStudent.year,
        subject: newStudent.subject,
        degree: newStudent.degree,
        batchId: selectedBatch,
        completedWeeks: 0,
        progressPercentage: 0
      };
      
      setStudents([...students, student]);
      
      // Reset form
      setNewStudent({
        name: '',
        email: '',
        phone: '',
        password: 'NeverStopLearning!',
        institute: '',
        year: '1st Year',
        subject: '',
        degree: 'BSc',
        batchId: selectedBatch
      });
      
      setIsAddingStudent(false);
      
      alert(`✅ Student "${newStudent.name}" added successfully! They can login with their email and password: ${newStudent.password}`);
      
    } catch (err) {
      console.error('❌ Error adding student:', err);
      setError('Failed to add student');
      alert(`❌ Failed to add student: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleAssignStudents = async () => {
    if (!selectedBatch || selectedStudents.length === 0) {
      setError('Please select a batch and at least one student');
      return;
    }

    try {
      console.log('🔄 Assigning students to batch:', { batch: selectedBatch, students: selectedStudents });
      
      // Get batch info for display
      const batchInfo = batches.find(b => b.id === selectedBatch);
      
      // Assign each selected student to the batch
      const assignments = selectedStudents.map(studentId => ({
        student_id: studentId,
        batch_id: selectedBatch,
        status: 'active',
        enrollment_date: new Date().toISOString().split('T')[0] // DATE format, not timestamp
      }));

      const { data: assignmentData, error: assignmentError } = await supabase
        .from('student_batch_assignments')
        .insert(assignments)
        .select();

      if (assignmentError) {
        console.error('Error assigning students to batch:', assignmentError);
        throw assignmentError;
      }

      console.log('✅ Students assigned to batch successfully:', assignmentData);
      
      // Refresh the students list
      await fetchData();
      
      // Reset form
      setSelectedStudents([]);
      setIsAssigningStudents(false);
      
      alert(`✅ Successfully assigned ${selectedStudents.length} students to ${batchInfo?.name || 'the selected batch'}!`);
      
    } catch (err) {
      console.error('❌ Error assigning students:', err);
      setError('Failed to assign students to batch');
      alert(`❌ Failed to assign students: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const loadAvailableStudents = async () => {
    try {
      console.log('🔄 Loading all students for assignment...');
      
      // Fetch all students
      const { data: allStudentsData, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          first_name,
          last_name,
          role
        `)
        .eq('role', 'student')
        .eq('is_active', true);

      if (error) {
        console.error('Error loading students:', error);
        throw error;
      }

      // Get existing assignments for the selected batch
      const { data: existingAssignments } = await supabase
        .from('student_batch_assignments')
        .select('student_id')
        .eq('batch_id', selectedBatch)
        .eq('status', 'active');

      const existingStudentIds = new Set(existingAssignments?.map(a => a.student_id) || []);
      
      // Add isAssigned flag to all students
      const studentsWithAssignmentStatus = allStudentsData?.map(student => ({
        ...student,
        isAssigned: existingStudentIds.has(student.id)
      })) || [];

      console.log('✅ Loaded all students with assignment status:', studentsWithAssignmentStatus);
      setAvailableStudents(studentsWithAssignmentStatus);
      
    } catch (err) {
      console.error('❌ Error loading students:', err);
      setError('Failed to load students');
    }
  };

  const handleAddNotice = async () => {
    if (!newNotice.title || !newNotice.content) {
      setError('Please fill in title and content');
      return;
    }

    try {
      console.log('🔄 Adding new notice:', newNotice);
      
      // Insert new notice into notices table
      const { data: noticeData, error: noticeError } = await supabase
        .from('notices')
        .insert([{
          title: newNotice.title,
          content: newNotice.content,
          tag: newNotice.tag,
          scheduled_date: newNotice.scheduledDate || null,
          scheduled_time: newNotice.scheduledTime || null,
          is_published: newNotice.isPublished,
          batch_id: selectedBatch || null,
          author_id: user?.id || null
        }])
        .select()
        .single();

      if (noticeError) {
        console.error('Error adding notice:', noticeError);
        throw noticeError;
      }

      console.log('✅ Notice added successfully:', noticeData);
      
      // Add to local state with proper property mapping
      const notice: Notice = {
        id: noticeData.id,
        title: noticeData.title,
        content: noticeData.content,
        tag: noticeData.tag,
        scheduledDate: noticeData.scheduled_date || '',
        scheduledTime: noticeData.scheduled_time || '',
        isPublished: noticeData.is_published,
        batchId: noticeData.batch_id || '',
        createdAt: noticeData.created_at
      };
      
      setNotices([notice, ...notices]);
      
      // Reset form
      setNewNotice({
        title: '',
        content: '',
        tag: 'Reminder',
        scheduledDate: '',
        scheduledTime: '',
        isPublished: false
      });
      
      setIsAddingNotice(false);
      
      const status = newNotice.isPublished ? 'published' : 'saved as draft';
      alert(`✅ Notice "${newNotice.title}" ${status} successfully!`);
      
    } catch (err) {
      console.error('❌ Error adding notice:', err);
      setError('Failed to add notice');
      alert(`❌ Failed to add notice: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      console.log('🔄 Deleting task from database:', id);
      
      // Delete task from roadmap_tasks table
      const { error: deleteError } = await supabase
        .from('roadmap_tasks')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting task:', deleteError);
        throw deleteError;
      }

      console.log('✅ Task deleted from database');
      
      // Update local state
      setRoadmapData(roadmapData.filter(task => task.id !== id));
      
      alert('✅ Task deleted successfully!');
      
    } catch (err) {
      console.error('❌ Error deleting task:', err);
      setError('Failed to delete task');
      alert(`❌ Failed to delete task: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDeleteBatch = (id: string) => {
    setBatches(batches.filter(batch => batch.id !== id));
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const handleDeleteNotice = async (id: string) => {
    try {
      console.log('🔄 Deleting notice:', id);
      
      // Delete notice from database
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting notice:', error);
        throw error;
      }

      console.log('✅ Notice deleted from database');
      
      // Update local state
      setNotices(notices.filter(notice => notice.id !== id));
      
      alert('✅ Notice deleted successfully!');
      
    } catch (err) {
      console.error('❌ Error deleting notice:', err);
      setError('Failed to delete notice');
      alert(`❌ Failed to delete notice: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleEditNotice = async (updatedNotice: Notice) => {
    try {
      console.log('🔄 Updating notice:', updatedNotice);
      
      // Update notice in database
      const { error } = await supabase
        .from('notices')
        .update({
          title: updatedNotice.title,
          content: updatedNotice.content,
          tag: updatedNotice.tag,
          scheduled_date: updatedNotice.scheduledDate,
          scheduled_time: updatedNotice.scheduledTime,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedNotice.id);

      if (error) {
        console.error('Error updating notice:', error);
        throw error;
      }

      console.log('✅ Notice updated in database');
      
      // Update local state
      setNotices(notices.map(notice => 
        notice.id === updatedNotice.id ? updatedNotice : notice
      ));
      
      setNoticeToEdit(null);
      alert('✅ Notice updated successfully!');
      
    } catch (err) {
      console.error('❌ Error updating notice:', err);
      setError('Failed to update notice');
      alert(`❌ Failed to update notice: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleAddWeek = async () => {
    if (!selectedRoadmap) {
      setError('Please select a roadmap first');
      return;
    }

    try {
      console.log('🔄 Adding new week to roadmap:', selectedRoadmap);
      
      const currentRoadmap = getCurrentRoadmap();
      if (!currentRoadmap) {
        throw new Error('Current roadmap not found');
      }

      const nextWeekNumber = currentRoadmap.total_weeks + 1;
      
      // Insert new week into roadmap_weeks table
      const { data: weekData, error: weekError } = await supabase
        .from('roadmap_weeks')
        .insert([{
          roadmap_id: selectedRoadmap,
          week_number: nextWeekNumber,
          title: `Week ${nextWeekNumber}`,
          description: `Week ${nextWeekNumber} content`,
          domain: 'General'
        }])
        .select()
        .single();

      if (weekError) {
        console.error('Error adding week:', weekError);
        throw weekError;
      }

      // Update roadmap total_weeks count
      const { error: roadmapError } = await supabase
        .from('roadmaps')
        .update({ total_weeks: nextWeekNumber })
        .eq('id', selectedRoadmap);

      if (roadmapError) {
        console.error('Error updating roadmap:', roadmapError);
        throw roadmapError;
      }

      console.log('✅ Week added successfully:', weekData);
      
      // Update local roadmaps state
      setRoadmaps(roadmaps.map(roadmap => 
        roadmap.id === selectedRoadmap 
          ? { ...roadmap, total_weeks: nextWeekNumber }
          : roadmap
      ));
      
      setShowAddWeekModal(false);
      alert(`✅ Week ${nextWeekNumber} added successfully to ${currentRoadmap.title}!`);
      
    } catch (err) {
      console.error('❌ Error adding week:', err);
      setError('Failed to add week');
      alert(`❌ Failed to add week: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTaskData || !editingTask) return;
    
    try {
      console.log('🔄 Updating task in database:', editingTaskData);
      
      // Update task in roadmap_tasks table
      const { data: updatedTask, error: updateError } = await supabase
        .from('roadmap_tasks')
        .update({
          task_name: editingTaskData.taskName,
          task_details: editingTaskData.taskDetails,
          task_type: editingTaskData.taskType.toLowerCase(),
          relevant_links: editingTaskData.relevantLinks ? [editingTaskData.relevantLinks] : [],
          deadline: editingTaskData.deadline || null,
          meeting_time: editingTaskData.meetingTime || null
        })
        .eq('id', editingTask)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating task:', updateError);
        throw updateError;
      }

      console.log('✅ Task updated in database:', updatedTask);
      
      // Update local state
      const updatedTasks = roadmapData.map(task => 
        task.id === editingTask ? editingTaskData : task
      );
      setRoadmapData(updatedTasks);
      
      setEditingTask(null);
      setEditingTaskData(null);
      
      // Refresh roadmap tasks to ensure data consistency
      if (selectedRoadmap) {
        await fetchRoadmapTasks(selectedRoadmap);
      }
      
      alert(`✅ Task "${editingTaskData.taskName}" updated successfully!`);
      
    } catch (err) {
      console.error('❌ Error updating task:', err);
      setError('Failed to update task');
      alert(`❌ Failed to update task: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleAddRoadmap = async () => {
    try {
      console.log('🔄 Adding new roadmap:', newRoadmap);
      
      const { data, error } = await supabase
        .from('roadmaps')
        .insert([{
          title: newRoadmap.title,
          description: newRoadmap.description,
          total_weeks: newRoadmap.total_weeks,
          difficulty_level: newRoadmap.difficulty_level,
          category: newRoadmap.category,
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding roadmap:', error);
        throw error;
      }

      console.log('✅ Roadmap added successfully:', data);
      
      // Update local state
      setRoadmaps([...roadmaps, data]);
      
      // Reset form and close modal
      setNewRoadmap({
        title: '',
        description: '',
        total_weeks: 8,
        difficulty_level: 'beginner',
        prerequisites: '',
        category: ''
      });
      setIsAddingRoadmap(false);
      
    } catch (err) {
      console.error('❌ Error adding roadmap:', err);
      setError('Failed to add roadmap');
    }
  };

  const handleUpdateRoadmap = async () => {
    if (!editingRoadmapData) return;
    
    try {
      console.log('🔄 Updating roadmap:', editingRoadmapData);
      
      const { data, error } = await supabase
        .from('roadmaps')
        .update({
          title: editingRoadmapData.title,
          description: editingRoadmapData.description,
          total_weeks: editingRoadmapData.total_weeks,
          difficulty_level: editingRoadmapData.difficulty_level,
          category: editingRoadmapData.category
        })
        .eq('id', editingRoadmapData.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating roadmap:', error);
        throw error;
      }

      console.log('✅ Roadmap updated successfully:', data);
      
      // Update local state
      setRoadmaps(roadmaps.map(roadmap => 
        roadmap.id === editingRoadmapData.id ? data : roadmap
      ));
      
      setIsEditingRoadmap(false);
      setEditingRoadmapData(null);
      
    } catch (err) {
      console.error('❌ Error updating roadmap:', err);
      setError('Failed to update roadmap');
    }
  };

  const handleDeleteRoadmap = async () => {
    if (!editingRoadmapData) return;
    
    try {
      console.log('🔄 Permanently deleting roadmap:', editingRoadmapData.id);
      
      // Hard delete - completely remove from database
      const { error } = await supabase
        .from('roadmaps')
        .delete()
        .eq('id', editingRoadmapData.id);

      if (error) {
        console.error('Error deleting roadmap:', error);
        throw error;
      }

      console.log('✅ Roadmap permanently deleted from database');
      
      // Remove from local state
      setRoadmaps(roadmaps.filter(roadmap => roadmap.id !== editingRoadmapData.id));
      
      // Reset selection if this was the selected roadmap
      if (selectedRoadmap === editingRoadmapData.id) {
        setSelectedRoadmap('');
        setRoadmapData([]);
      }
      
      setIsEditingRoadmap(false);
      setEditingRoadmapData(null);
      setShowDeleteConfirmModal(false);
      
      // Show success message
      alert(`✅ Roadmap "${editingRoadmapData.title}" has been permanently deleted.`);
      
    } catch (err) {
      console.error('❌ Error deleting roadmap:', err);
      setError('Failed to delete roadmap');
      alert(`❌ Failed to delete roadmap: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
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
      Reminder: 'bg-blue-100 text-blue-800 border-blue-200',
      Homework: 'bg-purple-100 text-purple-800 border-purple-200',
      Assignment: 'bg-green-100 text-green-800 border-green-200',
      Exam: 'bg-red-100 text-red-800 border-red-200',
      Cancellation: 'bg-gray-100 text-gray-800 border-gray-200',
      Resources: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Welcome: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      Meeting: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[tag as keyof typeof colors] || colors.Reminder;
  };

  // Calculate dashboard statistics from real data
  const getDashboardStats = () => {
    const totalStudents = students.length;
    const totalBatches = batches.length;
    const totalRoadmapTasks = roadmapData.length;
    const totalNotices = notices.length;

    return { totalStudents, totalBatches, totalRoadmapTasks, totalNotices };
  };

  const stats = getDashboardStats();

  const getFilteredTasks = () => {
    let filteredTasks = roadmapData;

    if (weekFilter) {
      filteredTasks = filteredTasks.filter(task => task.weekNumber.toString() === weekFilter);
    }

    if (typeFilter) {
      filteredTasks = filteredTasks.filter(task => task.taskType === typeFilter);
    }

    return filteredTasks;
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className={`p-6 rounded-xl border transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
                              <p className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.totalStudents}</p>
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
          {/* Removed Add Batch button - it's already in the Batch & Students tab */}
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
                    <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      View Only
                    </span>
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
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full sm:w-auto">
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
                  {roadmap.title} ({roadmap.total_weeks} weeks)
                </option>
              ))}
            </select>
          </div>
          
          {/* Edit Roadmap Button */}
          {selectedRoadmap && (
            <button
              onClick={() => {
                const currentRoadmap = getCurrentRoadmap();
                if (currentRoadmap) {
                  setEditingRoadmapData(currentRoadmap);
                  setIsEditingRoadmap(true);
                }
              }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Roadmap
            </button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsAddingRoadmap(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Roadmap
          </button>
          <button
            onClick={() => setShowAddWeekModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Week
          </button>
          <button
            onClick={() => setIsAddingTask(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Filters */}
      {selectedRoadmap && (
        <div className={`rounded-xl p-4 border transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full sm:w-auto">
            <div className="w-full sm:w-auto">
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Filter by Week
                </label>
                <select
                  value={weekFilter}
                  onChange={(e) => setWeekFilter(e.target.value)}
                  className={`px-3 py-2 border rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">All Weeks</option>
                  {getWeekOptions().map(week => (
                    <option key={week} value={week.toString()}>Week {week}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Filter by Task Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className={`px-3 py-2 border rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">All Types</option>
                  <option value="Watch">Watch</option>
                  <option value="Read">Read</option>
                  <option value="Project">Project</option>
                  <option value="Attend">Attend</option>
                  <option value="MCQ">MCQ</option>
                  <option value="Written">Written</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setWeekFilter('');
                  setTypeFilter('');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-bold mb-6 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {getCurrentRoadmap()?.title || 'Selected Roadmap'} - Tasks
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
              {getFilteredTasks().map((task, index) => (
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
                        onClick={() => {
                          setEditingTask(task.id);
                          setEditingTaskData(task);
                        }}
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

            {/* Meeting Time - Only show for Attend tasks */}
            {newTask.taskType === 'Attend' && (
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Meeting Time
                </label>
                <input
                  type="time"
                  value={newTask.meetingTime}
                  onChange={(e) => setNewTask({...newTask, meetingTime: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            )}

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
                Add Week to {getCurrentRoadmap()?.title || 'Selected Roadmap'}
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
                  Current Weeks: {getCurrentRoadmap()?.total_weeks || 0}
                </label>
                <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Adding a new week will extend this roadmap to {(getCurrentRoadmap()?.total_weeks || 0) + 1} weeks.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddWeek}
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

      {/* Edit Task Modal */}
      {editingTask && editingTaskData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Edit Task
              </h3>
              <button
                onClick={() => {setEditingTask(null); setEditingTaskData(null);}}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Week Number
                  </label>
                  <select
                    value={editingTaskData.weekNumber}
                    onChange={(e) => setEditingTaskData({...editingTaskData, weekNumber: parseInt(e.target.value)})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
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
                    value={editingTaskData.taskType}
                    onChange={(e) => setEditingTaskData({...editingTaskData, taskType: e.target.value as any})}
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

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Domain
                </label>
                <input
                  type="text"
                  value={editingTaskData.domain}
                  onChange={(e) => setEditingTaskData({...editingTaskData, domain: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., Python Basics, Web Development"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Task Name
                </label>
                <input
                  type="text"
                  value={editingTaskData.taskName}
                  onChange={(e) => setEditingTaskData({...editingTaskData, taskName: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter task name"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Task Details
                </label>
                <textarea
                  value={editingTaskData.taskDetails}
                  onChange={(e) => setEditingTaskData({...editingTaskData, taskDetails: e.target.value})}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter task details"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Relevant Links
                  </label>
                  <input
                    type="url"
                    value={editingTaskData.relevantLinks}
                    onChange={(e) => setEditingTaskData({...editingTaskData, relevantLinks: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={editingTaskData.deadline}
                    onChange={(e) => setEditingTaskData({...editingTaskData, deadline: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              {/* Meeting Time for Attend Tasks */}
              {editingTaskData.taskType === 'Attend' && (
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Meeting Time
                  </label>
                  <input
                    type="time"
                    value={editingTaskData.meetingTime || ''}
                    onChange={(e) => setEditingTaskData({...editingTaskData, meetingTime: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateTask}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Update Task
              </button>
              <button
                onClick={() => {setEditingTask(null); setEditingTaskData(null);}}
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

      {/* Add Roadmap Modal */}
      {isAddingRoadmap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Add New Roadmap
              </h3>
              <button
                onClick={() => setIsAddingRoadmap(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Roadmap Title
                </label>
                <input
                  type="text"
                  value={newRoadmap.title}
                  onChange={(e) => setNewRoadmap({...newRoadmap, title: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., Python Fundamentals"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  value={newRoadmap.description}
                  onChange={(e) => setNewRoadmap({...newRoadmap, description: e.target.value})}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter roadmap description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Week Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="52"
                    value={newRoadmap.total_weeks}
                    onChange={(e) => setNewRoadmap({...newRoadmap, total_weeks: parseInt(e.target.value) || 8})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Difficulty Level
                  </label>
                  <select
                    value={newRoadmap.difficulty_level}
                    onChange={(e) => setNewRoadmap({...newRoadmap, difficulty_level: e.target.value as any})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category
                </label>
                <input
                  type="text"
                  value={newRoadmap.category}
                  onChange={(e) => setNewRoadmap({...newRoadmap, category: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., Programming, Data Science, Web Development"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Prerequisites
                </label>
                <input
                  type="text"
                  value={newRoadmap.prerequisites}
                  onChange={(e) => setNewRoadmap({...newRoadmap, prerequisites: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., Basic computer knowledge"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddRoadmap}
                className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Add Roadmap
              </button>
              <button
                onClick={() => setIsAddingRoadmap(false)}
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

      {/* Edit Roadmap Modal */}
      {isEditingRoadmap && editingRoadmapData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Edit Roadmap
              </h3>
              <button
                onClick={() => {
                  setIsEditingRoadmap(false);
                  setEditingRoadmapData(null);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Roadmap Title
                </label>
                <input
                  type="text"
                  value={editingRoadmapData.title}
                  onChange={(e) => setEditingRoadmapData({...editingRoadmapData, title: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  value={editingRoadmapData.description || ''}
                  onChange={(e) => setEditingRoadmapData({...editingRoadmapData, description: e.target.value})}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Week Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="52"
                    value={editingRoadmapData.total_weeks}
                    onChange={(e) => setEditingRoadmapData({...editingRoadmapData, total_weeks: parseInt(e.target.value) || 8})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Difficulty Level
                  </label>
                  <select
                    value={editingRoadmapData.difficulty_level}
                    onChange={(e) => setEditingRoadmapData({...editingRoadmapData, difficulty_level: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category
                </label>
                <input
                  type="text"
                  value={editingRoadmapData.category || ''}
                  onChange={(e) => setEditingRoadmapData({...editingRoadmapData, category: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateRoadmap}
                className="flex-1 py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
              >
                Update Roadmap
              </button>
              <button
                onClick={() => setShowDeleteConfirmModal(true)}
                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setIsEditingRoadmap(false);
                  setEditingRoadmapData(null);
                }}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && editingRoadmapData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
            </div>
            
            <h3 className={`text-lg font-bold text-center mb-2 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Permanent Delete Warning
            </h3>
            
            <p className={`text-center mb-4 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Are you sure you want to permanently delete the roadmap <strong>"{editingRoadmapData.title}"</strong>?
            </p>
            
            <div className={`bg-red-50 border border-red-200 rounded-lg p-3 mb-6 transition-colors duration-200 ${
              isDarkMode ? 'bg-red-900/20 border-red-700' : ''
            }`}>
              <p className={`text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                This action will:
              </p>
              <ul className={`text-xs space-y-1 transition-colors duration-200 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                <li>• Remove the roadmap completely from the database</li>
                <li>• Delete all associated weeks and tasks</li>
                <li>• Cannot be undone or recovered</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRoadmap}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Delete Permanently
              </button>
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
              {selectedBatchData.whatsappLink && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-500" />
                    <a href={selectedBatchData.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 text-sm">
                      WhatsApp Group
                    </a>
                  </div>
                  <button
                    onClick={() => {
                      setEditingBatchData(selectedBatchData);
                      setIsEditingBatch(true);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                      isDarkMode 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              )}
              {selectedBatchData.discordLink && (
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  <a href={selectedBatchData.discordLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 text-sm">
                    Discord Server
                  </a>
                </div>
              )}
              {selectedBatchData.emergencyContact && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-500" />
                  <a href={`tel:${selectedBatchData.emergencyContact}`} className="text-red-600 hover:text-red-700 text-sm">
                    {selectedBatchData.emergencyContact}
                  </a>
                </div>
              )}
              {!selectedBatchData.whatsappLink && !selectedBatchData.discordLink && !selectedBatchData.emergencyContact && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 italic">No community links added yet</div>
                  <button
                    onClick={() => {
                      setEditingBatchData(selectedBatchData);
                      setIsEditingBatch(true);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                      isDarkMode 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                    <Edit2 className="w-4 h-4" />
                    Add Links
                  </button>
                </div>
              )}
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
          
          <div className="space-y-3 lg:space-y-4">
            {batchStudents.map((student) => (
              <div
                key={student.id}
                className={`p-3 lg:p-4 rounded-lg border transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {/* Mobile Layout */}
                <div className="lg:hidden">
                  {/* Student Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className={`font-semibold text-sm truncate transition-colors duration-200 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {student.name}
                        </h5>
                        <p className={`text-xs truncate transition-colors duration-200 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {student.degree} {student.subject}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="p-1 rounded hover:bg-red-100 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Student Details */}
                  <div className="space-y-2 mb-3">
                    <div className={`text-xs transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {student.institute}
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`mailto:${student.email}`} className="flex items-center gap-1 text-xs text-blue-600">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{student.email}</span>
                      </a>
                    </div>
                    {student.phone && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Phone className="w-3 h-3" />
                        <span>{student.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress Section */}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium transition-colors duration-200 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Week {student.completedWeeks}/6
                      </span>
                      <span className={`text-xs transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {student.progressPercentage}% Complete
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full ${
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${student.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:block">
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
                      {roadmap.title} ({roadmap.total_weeks} weeks)
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

      {/* Edit Batch Modal */}
      {isEditingBatch && editingBatchData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
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
                  onChange={(e) => setEditingBatchData({...editingBatchData, whatsappLink: e.target.value})}
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
                  value={editingBatchData.discordLink}
                  onChange={(e) => setEditingBatchData({...editingBatchData, discordLink: e.target.value})}
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
                  value={editingBatchData.emergencyContact}
                  onChange={(e) => setEditingBatchData({...editingBatchData, emergencyContact: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
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
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newStudent.password}
                    onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
                    className={`w-full px-3 py-2 pr-20 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Default password for student login"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(newStudent.password)}
                      className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 ml-1 ${
                        isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title="Copy password"
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

      {/* Assign Existing Students Modal */}
      {isAssigningStudents && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Assign Students to Batch
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select Batch
                </label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                >
                  <option value="">Select a batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select Students to Assign
                  <span className={`block text-xs font-normal mt-1 transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Students with ✓ are already assigned to this batch
                  </span>
                </label>
                <div className={`max-h-60 overflow-y-auto border rounded-lg p-3 transition-colors duration-200 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}>
                  {availableStudents.map((student) => (
                    <div key={student.id} className={`flex items-center gap-3 p-2 rounded transition-colors duration-200 ${
                      student.isAssigned 
                        ? (isDarkMode ? 'bg-green-900/20 border border-green-600/30' : 'bg-green-50 border border-green-200')
                        : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}>
                      <div className="flex items-center gap-2">
                        {student.isAssigned ? (
                          <div className="flex items-center gap-1">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                              Assigned
                            </span>
                          </div>
                        ) : (
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedStudents([...selectedStudents, student.id]);
                                } else {
                                  setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </label>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium transition-colors duration-200 ${
                          student.isAssigned 
                            ? (isDarkMode ? 'text-green-300' : 'text-green-800')
                            : (isDarkMode ? 'text-white' : 'text-gray-900')
                        }`}>
                          {student.first_name} {student.last_name}
                        </div>
                        <div className={`text-sm transition-colors duration-200 ${
                          student.isAssigned 
                            ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                            : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
                        }`}>
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
                disabled={!selectedBatch || selectedStudents.length === 0}
                className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-medium transition-colors"
              >
                Assign {selectedStudents.length} Students
              </button>
              <button
                onClick={() => {
                  setIsAssigningStudents(false);
                  setSelectedStudents([]);
                }}
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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between">
        <h3 className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Notice Management
        </h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full sm:w-auto">
          {/* Batch Dropdown */}
          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Filter by Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                isDarkMode 
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
      <div className={`rounded-xl border overflow-hidden transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          <div className="space-y-4">
            {notices
              .filter(notice => !selectedBatch || notice.batchId === selectedBatch)
              .map((notice) => (
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
                        <span>{notice.scheduledDate || 'No date'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{notice.scheduledTime || 'No time'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setNoticeToEdit(notice)}
                      className={`p-2 rounded transition-colors ${
                        isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setNoticeToDelete(notice.id)}
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

  const fetchRoadmapTasks = async (roadmapId: string) => {
    if (!roadmapId) return;
    
    try {
      console.log('🔄 Fetching tasks for roadmap:', roadmapId);
      
      // Get roadmap weeks
      const { data: weeksData, error: weeksError } = await supabase
        .from('roadmap_weeks')
        .select('*')
        .eq('roadmap_id', roadmapId)
        .order('week_number');

      if (weeksError) {
        console.error('Error fetching weeks:', weeksError);
        throw weeksError;
      }

      console.log('✅ Weeks found:', weeksData?.length || 0);

      // Get tasks for all weeks
      const allTasks: RoadmapItem[] = [];
      
      for (const week of weeksData || []) {
        const { data: tasksData, error: tasksError } = await supabase
          .from('roadmap_tasks')
          .select('*')
          .eq('week_id', week.id)
          .order('created_at');

        if (tasksError) {
          console.error('Error fetching tasks for week:', week.week_number, tasksError);
          continue;
        }

        // Transform tasks to RoadmapItem format
        const weekTasks = (tasksData || []).map((task: any) => ({
          id: task.id,
          weekNumber: week.week_number,
          domain: week.domain || '',
          taskType: task.task_type.charAt(0).toUpperCase() + task.task_type.slice(1) as any,
          taskName: task.task_name,
          taskDetails: task.task_details || '',
          relevantLinks: Array.isArray(task.relevant_links) ? task.relevant_links[0] || '' : task.relevant_links || '',
          deadline: task.deadline || '',
          meetingTime: task.meeting_time || ''
        }));

        allTasks.push(...weekTasks);
      }

      console.log('✅ Total tasks fetched:', allTasks.length);
      setRoadmapData(allTasks);
    } catch (err) {
      console.error('❌ Error fetching roadmap tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch roadmap tasks');
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch roadmap tasks when selectedRoadmap changes
  useEffect(() => {
    if (selectedRoadmap) {
      console.log('🔄 Selected roadmap changed to:', selectedRoadmap);
      fetchRoadmapTasks(selectedRoadmap);
    }
  }, [selectedRoadmap]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching real data from database...');
      
      // Fetch all roadmaps
      const { data: roadmapsData, error: roadmapsError } = await supabase
        .from('roadmaps')
        .select('*')
        .order('title');

      if (roadmapsError) {
        console.error('Error fetching roadmaps:', roadmapsError);
        throw roadmapsError;
      }
      
      console.log('✅ Roadmaps fetched:', roadmapsData?.length || 0);

      // Fetch all batches
      const { data: batchesData, error: batchesError } = await supabase
        .from('batches')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (batchesError) {
        console.error('Error fetching batches:', batchesError);
        throw batchesError;
      }
      
      console.log('✅ Batches fetched:', batchesData?.length || 0);

      // Fetch student batch assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('student_batch_assignments')
        .select('*')
        .eq('status', 'active');

      if (assignmentsError) {
        console.error('Error fetching student assignments:', assignmentsError);
        throw assignmentsError;
      }

      // Fetch user data for students
      const studentIds = [...new Set(assignmentsData?.map(a => a.student_id) || [])];
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, phone, is_active')
        .in('id', studentIds);

      if (usersError) {
        console.error('Error fetching user data:', usersError);
        throw usersError;
      }

      // Fetch student profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('student_profiles')
        .select('*')
        .in('user_id', studentIds);

      if (profilesError) {
        console.error('Error fetching student profiles:', profilesError);
        throw profilesError;
      }
      
      console.log('✅ Student assignments fetched:', assignmentsData?.length || 0);
      console.log('✅ Student users fetched:', usersData?.length || 0);
      console.log('✅ Student profiles fetched:', profilesData?.length || 0);

      // Fetch all notices
      const { data: noticesData, error: noticesError } = await supabase
        .from('notices')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (noticesError) {
        console.error('Error fetching notices:', noticesError);
        throw noticesError;
      }
      
      console.log('✅ Notices fetched:', noticesData?.length || 0);

      // Map batches data to frontend format
      const mappedBatches = (batchesData || []).map((batch: any) => ({
        id: batch.id,
        name: batch.name,
        studentCount: batch.student_count || 0,
        roadmapId: batch.roadmap_id || '',
        roadmapName: batch.roadmap_name || '',
        whatsappLink: batch.whatsapp_link || '',
        discordLink: batch.discord_link || '',
        emergencyContact: batch.emergency_contact || '',
        createdDate: batch.created_at ? new Date(batch.created_at).toLocaleDateString() : 'N/A'
      }));
      setBatches(mappedBatches);
      
      // Map students data by combining assignments, users, and profiles
      const mappedStudents = (assignmentsData || []).map((assignment: any) => {
        const user = usersData?.find(u => u.id === assignment.student_id);
        const profile = profilesData?.find(p => p.user_id === assignment.student_id);
        
        return {
          id: assignment.student_id,
          name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
          email: user?.email || '',
          phone: user?.phone || '',
          institute: profile?.institute || '',
          year: profile?.year || '',
          subject: profile?.subject || '',
          degree: profile?.degree || '',
          batchId: assignment.batch_id,
          completedWeeks: profile?.completed_weeks || 0,
          progressPercentage: profile?.progress_percentage || 0
        };
      });
      setStudents(mappedStudents);
      
      // Map notices data to frontend format
      const mappedNotices = (noticesData || []).map((notice: any) => ({
        id: notice.id,
        title: notice.title,
        content: notice.content,
        tag: notice.tag,
        scheduledDate: notice.scheduled_date || '',
        scheduledTime: notice.scheduled_time || '',
        isPublished: notice.is_published,
        batchId: notice.batch_id || '',
        createdAt: notice.created_at
      }));
      setNotices(mappedNotices);
      
      setRoadmaps(roadmapsData || []);
      
      if (batchesData && batchesData.length > 0) {
        setSelectedBatch(batchesData[0].id);
      }

      // Set default selected roadmap if available
      if (roadmapsData && roadmapsData.length > 0) {
        setSelectedRoadmap(roadmapsData[0].id);
        await fetchRoadmapTasks(roadmapsData[0].id);
      }

      console.log('🎉 All data fetched successfully!');
      
    } catch (err) {
      console.error('❌ Error loading data:', err);
      setError('Failed to load data from database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <MentorHeader 
        userName={user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Mentor'}
        userRole="mentor"
        pageTitle="Mentor Dashboard"
      />

      {/* Navigation Tabs - Mobile Responsive */}
      <div className={`border-b h-16 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-8">
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
          
          {/* Mobile Navigation */}
          <div className="lg:hidden grid grid-cols-4 h-16">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Users },
              { id: 'roadmap', label: 'Roadmap', icon: BookOpen },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'notice', label: 'Notice', icon: Bell }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                  activeTab === id
                    ? isDarkMode 
                      ? 'text-blue-400 bg-gray-700' 
                      : 'text-blue-600 bg-blue-50'
                    : isDarkMode 
                      ? 'text-gray-400' 
                      : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading data from database...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {error}
            </div>
            <button
              onClick={fetchData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'roadmap' && renderRoadmap()}
            {activeTab === 'students' && renderStudents()}
            {activeTab === 'notice' && renderNotice()}
          </>
        )}
      </div>

      {/* Notice Delete Confirmation Modal */}
      {noticeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Confirm Delete
            </h3>
            <p className={`mb-6 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to delete this notice? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setNoticeToDelete(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteNotice(noticeToDelete);
                  setNoticeToDelete(null);
                }}
                className="px-4 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Notice Modal */}
      {noticeToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Edit Notice
              </h3>
              <button
                onClick={() => setNoticeToEdit(null)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Title
                </label>
                <input
                  type="text"
                  value={noticeToEdit.title}
                  onChange={(e) => setNoticeToEdit({...noticeToEdit, title: e.target.value})}
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
                  value={noticeToEdit.content}
                  onChange={(e) => setNoticeToEdit({...noticeToEdit, content: e.target.value})}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tag
                  </label>
                  <select
                    value={noticeToEdit.tag}
                    onChange={(e) => setNoticeToEdit({...noticeToEdit, tag: e.target.value as any})}
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
                    value={noticeToEdit.scheduledDate}
                    onChange={(e) => setNoticeToEdit({...noticeToEdit, scheduledDate: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setNoticeToEdit(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleEditNotice(noticeToEdit)}
                className="px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Update Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};