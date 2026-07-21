import React from 'react';
import { UserList } from './UserManagement/UserList';

/** Dedicated User Management page (not embedded on Overview). */
export const AdminUsers: React.FC = () => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">User Management</h2>
        <p className="text-sm text-muted-foreground">
          Manage students, mentors, and administrators.
        </p>
      </div>
      <div className="p-4 sm:p-6">
        <UserList />
      </div>
    </div>
  );
};
