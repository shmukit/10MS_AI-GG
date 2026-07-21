import React from 'react';
import { Skeleton } from '../../ui/Skeleton';
import { useToast } from '../../ui/ToastProvider';
import { useUserList } from './useUserList';
import { UserListFilters } from './UserListFilters';
import { UserListTable } from './UserListTable';
import { UserListModals } from './UserListModals';

export const UserList: React.FC = () => {
  const { success } = useToast();
  const {
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
  } = useUserList();

  return (
    <div className="space-y-4">
      <UserListFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        roadmapFilter={roadmapFilter}
        onRoadmapFilterChange={setRoadmapFilter}
        batchFilter={batchFilter}
        onBatchFilterChange={setBatchFilter}
        roadmapOptions={roadmapOptions}
        batchOptions={batchOptions}
        onAddUser={() => setIsAddUserModalOpen(true)}
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">Error: {error}</div>
      ) : (
        <UserListTable
          users={filteredUsers}
          enrollmentsByUser={enrollmentsByUser}
          certificatesByStudent={certificatesByStudent}
          activeMenuId={activeMenuId}
          onToggleActionMenu={toggleActionMenu}
          onToggleStatus={handleToggleStatus}
          onIssueCertificate={(user) => {
            setIssueCertUser(user);
            closeActionMenu();
          }}
          onManageCertificates={(user) => {
            setManageCertUser(user);
            closeActionMenu();
          }}
          onDeleteUser={handleDeleteUser}
        />
      )}

      <UserListModals
        isAddUserModalOpen={isAddUserModalOpen}
        issueCertUser={issueCertUser}
        manageCertUser={manageCertUser}
        enrollmentsByUser={enrollmentsByUser}
        certificatesByStudent={certificatesByStudent}
        onCloseAddUser={() => setIsAddUserModalOpen(false)}
        onAddUserSuccess={() => {
          fetchUsers();
          setIsAddUserModalOpen(false);
        }}
        onCloseIssueCert={() => setIssueCertUser(null)}
        onIssueCertSuccess={() => {
          setIssueCertUser(null);
          success('Certificate issued successfully!');
          fetchUsers();
        }}
        onCloseManageCert={() => setManageCertUser(null)}
      />
    </div>
  );
};
