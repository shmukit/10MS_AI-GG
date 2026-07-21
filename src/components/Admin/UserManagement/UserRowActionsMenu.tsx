import React from 'react';
import {
  Award,
  FileText,
  MoreVertical,
  Power,
  Trash2,
} from 'lucide-react';
import { buildUserDisplayName } from './userListSelectors';
import type { UserData } from './types';

interface UserRowActionsMenuProps {
  user: UserData;
  isOpen: boolean;
  onToggle: () => void;
  onToggleStatus: () => void;
  onIssueCertificate: () => void;
  onManageCertificates: () => void;
  onDelete: () => void;
}

export const UserRowActionsMenu: React.FC<UserRowActionsMenuProps> = ({
  user,
  isOpen,
  onToggle,
  onToggleStatus,
  onIssueCertificate,
  onManageCertificates,
  onDelete,
}) => (
  <td className="py-3 px-4 text-right relative action-menu-container">
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="p-1 hover:bg-muted rounded text-muted-foreground transition-colors"
      aria-label={`Actions for ${buildUserDisplayName(user)}`}
    >
      <MoreVertical className="w-4 h-4" />
    </button>

    {isOpen && (
      <div className="absolute right-8 top-0 w-48 bg-card rounded-lg border border-border py-1 z-[100] text-left">
        <button
          onClick={onToggleStatus}
          className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
        >
          <Power className={`w-4 h-4 ${user.is_active ? 'text-red-500' : 'text-green-500'}`} />
          {user.is_active ? 'Deactivate User' : 'Activate User'}
        </button>
        {user.role === 'student' && (
          <>
            <button
              onClick={onIssueCertificate}
              className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2 border-t border-border"
            >
              <Award className="w-4 h-4 text-primary" />
              Issue Certificate
            </button>
            <button
              onClick={onManageCertificates}
              className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-primary" />
              Manage Certificates
            </button>
          </>
        )}
        <button
          onClick={onDelete}
          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 border-t border-border"
        >
          <Trash2 className="w-4 h-4" />
          Delete User
        </button>
      </div>
    )}
  </td>
);
