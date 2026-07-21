import { useState, useEffect, useMemo, useCallback } from 'react';
import { useConfirm } from '../../ui/ConfirmProvider';
import { useToast } from '../../ui/ToastProvider';
import {
  deleteUserFromDb,
  fetchUserListData,
  toggleUserActiveStatus,
} from './userListApi';
import { filterUsersByEnrollment } from './userListSelectors';
import type {
  EnrollmentInfo,
  RoleFilter,
  StatusFilter,
  UserData,
} from './types';
import type { StudentCertificateRecord } from '../../../lib/certificateTypes';

export function useUserList() {
  const { confirm } = useConfirm();
  const { success, error: toastError } = useToast();

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [roadmapFilter, setRoadmapFilter] = useState<string>('all');
  const [batchFilter, setBatchFilter] = useState<string>('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [issueCertUser, setIssueCertUser] = useState<UserData | null>(null);
  const [manageCertUser, setManageCertUser] = useState<UserData | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [certificatesByStudent, setCertificatesByStudent] = useState<
    Record<string, StudentCertificateRecord[]>
  >({});
  const [enrollmentsByUser, setEnrollmentsByUser] = useState<Record<string, EnrollmentInfo>>({});
  const [roadmapOptions, setRoadmapOptions] = useState<{ id: string; title: string }[]>([]);
  const [batchOptions, setBatchOptions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenuId && !(event.target as Element).closest('.action-menu-container')) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenuId]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchUserListData({
        roleFilter,
        statusFilter,
        debouncedSearch,
      });

      setUsers(result.users);
      setEnrollmentsByUser(result.enrollmentsByUser);
      setCertificatesByStudent(result.certificatesByStudent);
      setRoadmapOptions(result.roadmapOptions);
      setBatchOptions(result.batchOptions);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(
    () => filterUsersByEnrollment(users, enrollmentsByUser, batchFilter, roadmapFilter),
    [users, enrollmentsByUser, batchFilter, roadmapFilter]
  );

  const handleToggleStatus = useCallback(async (
    userId: string,
    currentStatus: boolean,
    userName: string
  ) => {
    const confirmed = await confirm({
      title: currentStatus ? 'Deactivate user?' : 'Activate user?',
      message: currentStatus
        ? `${userName} will lose access until reactivated.`
        : `${userName} will regain access to the platform.`,
      confirmLabel: currentStatus ? 'Deactivate' : 'Activate',
      variant: currentStatus ? 'destructive' : 'default',
    });
    if (!confirmed) return;

    try {
      const { error } = await toggleUserActiveStatus(userId, currentStatus);
      if (error) throw error;

      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, is_active: !currentStatus } : u)));
      setActiveMenuId(null);
      success(currentStatus ? 'User deactivated' : 'User activated');
    } catch (err) {
      console.error('Error updating status:', err);
      toastError('Failed to update status');
    }
  }, [confirm, success, toastError]);

  const handleDeleteUser = useCallback(async (userId: string, userName: string) => {
    const confirmed = await confirm({
      title: 'Delete user?',
      message: `Are you sure you want to delete ${userName}? This action cannot be undone.`,
      confirmLabel: 'Delete',
      variant: 'destructive',
    });
    if (!confirmed) return;

    try {
      const { error } = await deleteUserFromDb(userId);
      if (error) throw error;

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setActiveMenuId(null);
      success('User deleted');
    } catch (err) {
      console.error('Error deleting user:', err);
      toastError('Failed to delete user');
    }
  }, [confirm, success, toastError]);

  const toggleActionMenu = useCallback((userId: string) => {
    setActiveMenuId((prev) => (prev === userId ? null : userId));
  }, []);

  const closeActionMenu = useCallback(() => {
    setActiveMenuId(null);
  }, []);

  return {
    users,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    roadmapFilter,
    setRoadmapFilter,
    batchFilter,
    setBatchFilter,
    isAddUserModalOpen,
    setIsAddUserModalOpen,
    issueCertUser,
    setIssueCertUser,
    manageCertUser,
    setManageCertUser,
    activeMenuId,
    certificatesByStudent,
    enrollmentsByUser,
    roadmapOptions,
    batchOptions,
    filteredUsers,
    fetchUsers,
    handleToggleStatus,
    handleDeleteUser,
    toggleActionMenu,
    closeActionMenu,
  };
}
