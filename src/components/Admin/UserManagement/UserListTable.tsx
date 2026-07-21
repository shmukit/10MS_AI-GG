import React from 'react';
import {
  Award,
  CheckCircle,
  GraduationCap,
  Shield,
  User,
  XCircle,
} from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { getCertificateCohortLabel, type StudentCertificateRecord } from '../../../lib/certificateTypes';
import { buildUserDisplayName } from './userListSelectors';
import { UserRowActionsMenu } from './UserRowActionsMenu';
import type { EnrollmentInfo, UserData } from './types';

const roleIcons = {
  admin: <Shield className="w-4 h-4 text-primary" />,
  mentor: <User className="w-4 h-4 text-primary" />,
  student: <GraduationCap className="w-4 h-4 text-green-600" />,
};

interface UserListTableProps {
  users: UserData[];
  enrollmentsByUser: Record<string, EnrollmentInfo>;
  certificatesByStudent: Record<string, StudentCertificateRecord[]>;
  activeMenuId: string | null;
  onToggleActionMenu: (userId: string) => void;
  onToggleStatus: (userId: string, currentStatus: boolean, userName: string) => void;
  onIssueCertificate: (user: UserData) => void;
  onManageCertificates: (user: UserData) => void;
  onDeleteUser: (userId: string, userName: string) => void;
}

export const UserListTable: React.FC<UserListTableProps> = ({
  users,
  enrollmentsByUser,
  certificatesByStudent,
  activeMenuId,
  onToggleActionMenu,
  onToggleStatus,
  onIssueCertificate,
  onManageCertificates,
  onDeleteUser,
}) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left text-sm min-w-[960px]">
      <thead>
        <tr className="border-b border-border text-muted-foreground">
          <th className="py-3 px-4 font-medium">User</th>
          <th className="py-3 px-4 font-medium">Role</th>
          <th className="py-3 px-4 font-medium">Roadmaps</th>
          <th className="py-3 px-4 font-medium">Batches</th>
          <th className="py-3 px-4 font-medium">Status</th>
          <th className="py-3 px-4 font-medium">Joined</th>
          <th className="py-3 px-4 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {users.map((user) => {
          const enrollment = enrollmentsByUser[user.id];
          const studentCerts = certificatesByStudent[user.id] || [];
          const userName = buildUserDisplayName(user);

          return (
            <tr key={user.id} className="hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs text-muted-foreground">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </div>
                  <div>
                    <div className="font-medium text-foreground flex items-center gap-2">
                      {user.first_name} {user.last_name}
                      {user.role === 'student' && studentCerts.length > 0 && (
                        <div className="relative group inline-flex items-center">
                          <span className="inline-flex items-center justify-center bg-primary/10 text-primary p-1.5 rounded-full cursor-help transition-transform hover:scale-110">
                            <Award className="w-4 h-4" strokeWidth={2.5} />
                            {studentCerts.length > 1 && (
                              <span className="sr-only">{studentCerts.length} certificates</span>
                            )}
                          </span>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[280px] bg-foreground text-background text-xs rounded py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-left">
                            <p className="font-semibold mb-1 text-center">
                              {studentCerts.length === 1 ? 'Certificate Awarded' : `${studentCerts.length} Certificates`}
                            </p>
                            <ul className="space-y-1 opacity-90">
                              {studentCerts.map((cert) => (
                                <li key={cert.id}>
                                  {getCertificateCohortLabel(cert)} — {new Date(cert.issued_at).toLocaleDateString()}
                                </li>
                              ))}
                            </ul>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-1.5 capitalize text-foreground">
                  {roleIcons[user.role]}
                  {user.role}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1 max-w-[220px]">
                  {enrollment?.roadmaps?.length ? (
                    enrollment.roadmaps.map((title) => (
                      <Badge key={title} variant="outline" className="px-2 py-0.5 text-[11px] max-w-[200px] truncate" title={title}>
                        {title}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1 max-w-[220px]">
                  {enrollment?.batches?.length ? (
                    enrollment.batches.map((name) => (
                      <Badge key={name} variant="muted" className="px-2 py-0.5 text-[11px] max-w-[200px] truncate" title={name}>
                        {name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                {user.is_active ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    <XCircle className="w-3 h-3" /> Inactive
                  </span>
                )}
              </td>
              <td className="py-3 px-4 text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <UserRowActionsMenu
                user={user}
                isOpen={activeMenuId === user.id}
                onToggle={() => onToggleActionMenu(user.id)}
                onToggleStatus={() => onToggleStatus(user.id, user.is_active, userName)}
                onIssueCertificate={() => onIssueCertificate(user)}
                onManageCertificates={() => onManageCertificates(user)}
                onDelete={() => onDeleteUser(user.id, userName)}
              />
            </tr>
          );
        })}
      </tbody>
    </table>
    {users.length === 0 && (
      <div className="text-center py-12 text-muted-foreground">No users found.</div>
    )}
  </div>
);
