import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useAuth } from '../../../../lib/useAuth';
import { Batch } from '../../../../types/mentor';
import { DatabaseService } from '../../../../services/database';
import type { BatchResourceSelection } from '../../../../types/models';
import { useToast } from '../../../ui/ToastProvider';

const EMPTY_RESOURCE_SELECTION: BatchResourceSelection = {
    slideDecks: [],
    decisionTrees: [],
};

const getDefaultStudentPassword = () =>
    import.meta.env.VITE_DEFAULT_STUDENT_PASSWORD || '';

interface UseStudentsTabProps {
    selectedBatch: string;
    onUpdate: () => void;
}

export const useStudentsTab = ({ selectedBatch, onUpdate }: UseStudentsTabProps) => {
    const { user, userRole } = useAuth();
    const { success, error: toastError, info } = useToast();
    const [isAddingBatch, setIsAddingBatch] = useState(false);
    const [isEditingBatch, setIsEditingBatch] = useState(false);
    const [isAddingStudent, setIsAddingStudent] = useState(false);
    const [isAssigningStudents, setIsAssigningStudents] = useState(false);
    const [editingBatchData, setEditingBatchData] = useState<Batch | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [availableStudents, setAvailableStudents] = useState<any[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [isSyncingProgress, setIsSyncingProgress] = useState(false);

    const [newBatch, setNewBatch] = useState({
        name: '',
        roadmapId: '',
        roadmapName: '',
        whatsappLink: '',
        discordLink: '',
        emergencyContact: '',
        startDate: ''
    });

    const [batchResourceSelection, setBatchResourceSelection] = useState<BatchResourceSelection>(
        EMPTY_RESOURCE_SELECTION
    );

    const [newStudent, setNewStudent] = useState({
        name: '',
        email: '',
        phone: '',
        password: getDefaultStudentPassword(),
        institute: '',
        year: '1st Year',
        subject: '',
        degree: 'BSc'
    });

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            success('Password copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            success('Password copied to clipboard!');
        }
    };

    const loadAvailableStudents = async () => {
        try {
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
                .eq('is_active', true) as { data: any[]; error: any };

            if (error) throw error;

            const { data: existingAssignments } = await supabase
                .from('student_batch_assignments')
                .select('student_id')
                .eq('batch_id', selectedBatch)
                .eq('status', 'active') as { data: any[]; error: any };

            const existingStudentIds = new Set(existingAssignments?.map(a => a.student_id) || []);

            const studentsWithStatus = allStudentsData?.map(student => ({
                ...student,
                isAssigned: existingStudentIds.has(student.id)
            })) || [];

            setAvailableStudents(studentsWithStatus);
        } catch (error) {
            console.error('Error loading students:', error);
        }
    };

    const handleAddBatch = async () => {
        // Enforce Role-Based Access Control
        if (userRole !== 'admin' && userRole !== 'mentor') {
            toastError('Unauthorized: Only Admins and Mentors can create batches.');
            return;
        }

        if (!newBatch.startDate) {
            toastError('Start Date is required');
            return;
        }

        try {
            const { data: createdBatch, error } = await supabase
                .from('batches')
                .insert([{
                    name: newBatch.name,
                    roadmap_id: newBatch.roadmapId,
                    whatsapp_link: newBatch.whatsappLink,
                    discord_link: newBatch.discordLink,
                    emergency_contact: newBatch.emergencyContact,
                    mentor_id: user?.id,
                    start_date: newBatch.startDate
                }] as unknown as never)
                .select()
                .single() as { data: any; error: any };

            if (error) throw error;

            if (createdBatch?.id && newBatch.roadmapId) {
                if (
                    batchResourceSelection.slideDecks.length > 0 ||
                    batchResourceSelection.decisionTrees.length > 0
                ) {
                    await DatabaseService.saveBatchResourceSelection(createdBatch.id, batchResourceSelection);
                } else {
                    await DatabaseService.seedBatchResourcesFromCatalog(createdBatch.id, newBatch.roadmapId);
                }
            }

            setIsAddingBatch(false);
            setNewBatch({
                name: '',
                roadmapId: '',
                roadmapName: '',
                whatsappLink: '',
                discordLink: '',
                emergencyContact: '',
                startDate: ''
            });
            setBatchResourceSelection(EMPTY_RESOURCE_SELECTION);
            onUpdate();
        } catch (error) {
            console.error('Error creating batch:', error);
            toastError('Failed to create batch');
        }
    };

    const handleUpdateBatch = async () => {
        if (!editingBatchData) return;

        try {
            const today = new Date().toISOString().split('T')[0];
            const nextStatus = editingBatchData.status || 'active';
            const updatePayload: Record<string, unknown> = {
                whatsapp_link: editingBatchData.whatsappLink,
                discord_link: editingBatchData.discordLink,
                emergency_contact: editingBatchData.emergencyContact,
                status: nextStatus,
                updated_at: new Date().toISOString(),
            };

            if (nextStatus === 'completed' || nextStatus === 'cancelled') {
                updatePayload.end_date = today;
            }

            const { error } = await supabase
                .from('batches')
                .update(updatePayload as unknown as never)
                .eq('id', editingBatchData.id);

            if (error) throw error;

            if (editingBatchData.roadmapId) {
                await DatabaseService.saveBatchResourceSelection(
                    editingBatchData.id,
                    batchResourceSelection
                );
            }

            setIsEditingBatch(false);
            setEditingBatchData(null);
            setBatchResourceSelection(EMPTY_RESOURCE_SELECTION);
            onUpdate();
            success(`Batch "${editingBatchData.name}" updated successfully!`);
        } catch (error) {
            console.error('Error updating batch:', error);
            toastError('Failed to update batch');
        }
    };

    const handleAddStudent = async () => {
        if (!newStudent.name || !newStudent.email || !selectedBatch) {
            toastError('Please fill in name, email, and select a batch');
            return;
        }

        try {
            const studentPassword = newStudent.password || getDefaultStudentPassword();
            if (!studentPassword) {
                toastError('Please set a password for the student or configure VITE_DEFAULT_STUDENT_PASSWORD.');
                return;
            }
            const { data: existingUser, error: checkError } = await supabase
                .from('users')
                .select('id, email')
                .eq('email', newStudent.email)
                .single() as { data: any; error: any };

            if (checkError && checkError.code !== 'PGRST116') throw checkError;

            const firstName = newStudent.name.split(' ')[0] || newStudent.name;
            const lastName = newStudent.name.split(' ').slice(1).join(' ') || '';
            const preferredUserId = existingUser?.id || crypto.randomUUID();

            // IMPORTANT:
            // Supabase login uses auth.users, not public.users.password_hash.
            // This RPC ensures the student exists in BOTH auth.users and public.users
            // and sets the password consistently.
            const { data: upsertData, error: upsertError } = await supabase.rpc('upsert_student_user', {
                p_user_id: preferredUserId,
                p_email: newStudent.email,
                p_password: studentPassword,
                p_first_name: firstName,
                p_last_name: lastName,
                p_phone: newStudent.phone || null
            } as any);

            if (upsertError) throw upsertError;

            const userId: string = (upsertData as any)?.id || preferredUserId;

            const { error: profileError } = await supabase
                .from('student_profiles')
                .upsert([{
                    user_id: userId,
                    institute: newStudent.institute,
                    year: newStudent.year,
                    subject: newStudent.subject,
                    degree: newStudent.degree,
                    completed_weeks: 0,
                    progress_percentage: 0,
                    enrollment_date: new Date().toISOString()
                }] as unknown as never, { onConflict: 'user_id' });

            if (profileError) throw profileError;

            const { error: assignmentError } = await supabase
                .from('student_batch_assignments')
                .upsert([{
                    student_id: userId,
                    batch_id: selectedBatch,
                    status: 'active',
                    enrollment_date: new Date().toISOString().split('T')[0]
                }] as unknown as never, { onConflict: 'student_id,batch_id' });

            if (assignmentError) throw assignmentError;

            setIsAddingStudent(false);
            setNewStudent({
                name: '',
                email: '',
                phone: '',
                password: studentPassword,
                institute: '',
                year: '1st Year',
                subject: '',
                degree: 'BSc'
            });
            onUpdate();
            success(`Student "${newStudent.name}" added successfully!`);
        } catch (error: any) {
            console.error('Error adding student:', error);
            toastError(error.message || 'Failed to add student');
        }
    };

    const handleAssignStudents = async () => {
        if (!selectedBatch || selectedStudents.length === 0) {
            toastError('Please select a batch and at least one student');
            return;
        }

        try {
            const assignments = selectedStudents.map(studentId => ({
                student_id: studentId,
                batch_id: selectedBatch,
                status: 'active',
                enrollment_date: new Date().toISOString().split('T')[0]
            }));

            const { error } = await supabase
                .from('student_batch_assignments')
                .insert(assignments as unknown as never);

            if (error) throw error;

            setIsAssigningStudents(false);
            setSelectedStudents([]);
            onUpdate();
            success('Students assigned successfully!');
        } catch (error) {
            console.error('Error assigning students:', error);
            toastError('Failed to assign students');
        }
    };

    const handleDeleteStudent = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this student from the batch?')) return;

        try {
            const { error } = await supabase
                .from('student_batch_assignments')
                .delete()
                .eq('student_id', id)
                .eq('batch_id', selectedBatch);

            if (error) throw error;
            onUpdate();
        } catch (error) {
            console.error('Error removing student:', error);
            toastError('Failed to remove student');
        }
    };

    const handleSyncProgress = async () => {
        if (!selectedBatch) return;
        setIsSyncingProgress(true);
        try {
            const { ProgressSyncService } = await import('../../../../services/progressSync');
            const result = await ProgressSyncService.syncBatchProgress(selectedBatch);
            onUpdate();
            if (result.success) {
                success(`Progress synced for ${result.syncedStudents} students.`);
            } else if (result.errors.length > 0) {
                console.error('Sync errors:', result.errors);
                info(`Synced ${result.syncedStudents} students. Some errors: ${result.errors.slice(0, 2).join(', ')}`);
            }
        } catch (error) {
            console.error('Error syncing progress:', error);
            toastError('Failed to sync progress. Please try again.');
        } finally {
            setIsSyncingProgress(false);
        }
    };

    return {
        isAddingBatch, setIsAddingBatch,
        isEditingBatch, setIsEditingBatch,
        isAddingStudent, setIsAddingStudent,
        isAssigningStudents, setIsAssigningStudents,
        editingBatchData, setEditingBatchData,
        selectedStudents, setSelectedStudents,
        availableStudents, setAvailableStudents,
        showPassword, setShowPassword,
        newBatch, setNewBatch,
        batchResourceSelection, setBatchResourceSelection,
        newStudent, setNewStudent,
        copyToClipboard,
        loadAvailableStudents,
        handleAddBatch,
        handleUpdateBatch,
        handleAddStudent,
        handleAssignStudents,
        handleDeleteStudent,
        handleSyncProgress,
        isSyncingProgress,
        userRole
    };
};
