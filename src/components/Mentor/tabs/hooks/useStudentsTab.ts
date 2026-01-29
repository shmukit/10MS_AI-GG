import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useAuth } from '../../../../lib/useAuth';
import { Batch } from '../../../../types/mentor';

interface UseStudentsTabProps {
    selectedBatch: string;
    onUpdate: () => void;
}

export const useStudentsTab = ({ selectedBatch, onUpdate }: UseStudentsTabProps) => {
    const { user } = useAuth();
    const [isAddingBatch, setIsAddingBatch] = useState(false);
    const [isEditingBatch, setIsEditingBatch] = useState(false);
    const [isAddingStudent, setIsAddingStudent] = useState(false);
    const [isAssigningStudents, setIsAssigningStudents] = useState(false);
    const [editingBatchData, setEditingBatchData] = useState<Batch | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [availableStudents, setAvailableStudents] = useState<any[]>([]);
    const [showPassword, setShowPassword] = useState(false);

    const [newBatch, setNewBatch] = useState({
        name: '',
        roadmapId: '',
        roadmapName: '',
        whatsappLink: '',
        discordLink: '',
        emergencyContact: '',
        startDate: ''
    });

    const [newStudent, setNewStudent] = useState({
        name: '',
        email: '',
        phone: '',
        password: 'NeverStopLearning!',
        institute: '',
        year: '1st Year',
        subject: '',
        degree: 'BSc'
    });

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Password copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Password copied to clipboard!');
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
        try {
            const { error } = await supabase
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
            onUpdate();
        } catch (error) {
            console.error('Error creating batch:', error);
            alert('Failed to create batch');
        }
    };

    const handleUpdateBatch = async () => {
        if (!editingBatchData) return;

        try {
            const { error } = await supabase
                .from('batches')
                .update({
                    whatsapp_link: editingBatchData.whatsappLink,
                    discord_link: editingBatchData.discordLink,
                    emergency_contact: editingBatchData.emergencyContact,
                    status: editingBatchData.status,
                    updated_at: new Date().toISOString()
                } as unknown as never)
                .eq('id', editingBatchData.id);

            if (error) throw error;

            setIsEditingBatch(false);
            setEditingBatchData(null);
            onUpdate();
            alert(`Batch "${editingBatchData.name}" updated successfully!`);
        } catch (error) {
            console.error('Error updating batch:', error);
            alert('Failed to update batch');
        }
    };

    const handleAddStudent = async () => {
        if (!newStudent.name || !newStudent.email || !selectedBatch) {
            alert('Please fill in name, email, and select a batch');
            return;
        }

        try {
            const { data: existingUser, error: checkError } = await supabase
                .from('users')
                .select('id, email')
                .eq('email', newStudent.email)
                .single() as { data: any; error: any };

            if (checkError && checkError.code !== 'PGRST116') throw checkError;

            let userId: string;

            if (existingUser) {
                userId = existingUser.id;
                const { error: updateError } = await supabase
                    .from('users')
                    .update({
                        role: 'student',
                        first_name: newStudent.name.split(' ')[0] || newStudent.name,
                        last_name: newStudent.name.split(' ').slice(1).join(' ') || '',
                        is_active: true,
                        email_verified: true
                    } as unknown as never)
                    .eq('id', userId);

                if (updateError) throw updateError;
            } else {
                userId = crypto.randomUUID();
                const { error: userInsertError } = await supabase
                    .from('users')
                    .insert([{
                        id: userId,
                        email: newStudent.email,
                        password_hash: `$2a$10$${newStudent.password}`,
                        role: 'student',
                        first_name: newStudent.name.split(' ')[0] || newStudent.name,
                        last_name: newStudent.name.split(' ').slice(1).join(' ') || '',
                        is_active: true,
                        email_verified: true
                    }] as unknown as never);

                if (userInsertError) throw userInsertError;
            }

            const { error: profileError } = await supabase
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
                }] as unknown as never);

            if (profileError) throw profileError;

            const { error: assignmentError } = await supabase
                .from('student_batch_assignments')
                .insert([{
                    student_id: userId,
                    batch_id: selectedBatch,
                    status: 'active',
                    enrollment_date: new Date().toISOString().split('T')[0]
                }] as unknown as never);

            if (assignmentError) throw assignmentError;

            setIsAddingStudent(false);
            setNewStudent({
                name: '',
                email: '',
                phone: '',
                password: 'NeverStopLearning!',
                institute: '',
                year: '1st Year',
                subject: '',
                degree: 'BSc'
            });
            onUpdate();
            alert(`Student "${newStudent.name}" added successfully!`);
        } catch (error: any) {
            console.error('Error adding student:', error);
            alert(error.message || 'Failed to add student');
        }
    };

    const handleAssignStudents = async () => {
        if (!selectedBatch || selectedStudents.length === 0) {
            alert('Please select a batch and at least one student');
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
            alert('Students assigned successfully!');
        } catch (error) {
            console.error('Error assigning students:', error);
            alert('Failed to assign students');
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
            alert('Failed to remove student');
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
        newStudent, setNewStudent,
        copyToClipboard,
        loadAvailableStudents,
        handleAddBatch,
        handleUpdateBatch,
        handleAddStudent,
        handleAssignStudents,
        handleDeleteStudent
    };
};
