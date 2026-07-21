import React from 'react';
import { AddUserModal } from './AddUserModal';
import { IssueCertificateModal } from '../Certificates/IssueCertificateModal';
import { ManageCertificatesModal } from '../Certificates/ManageCertificatesModal';
import { buildStudentModalPayload } from './userListSelectors';
import type { EnrollmentInfo, UserData } from './types';
import type { StudentCertificateRecord } from '../../../lib/certificateTypes';

interface UserListModalsProps {
  isAddUserModalOpen: boolean;
  issueCertUser: UserData | null;
  manageCertUser: UserData | null;
  enrollmentsByUser: Record<string, EnrollmentInfo>;
  certificatesByStudent: Record<string, StudentCertificateRecord[]>;
  onCloseAddUser: () => void;
  onAddUserSuccess: () => void;
  onCloseIssueCert: () => void;
  onIssueCertSuccess: () => void;
  onCloseManageCert: () => void;
}

export const UserListModals: React.FC<UserListModalsProps> = ({
  isAddUserModalOpen,
  issueCertUser,
  manageCertUser,
  enrollmentsByUser,
  certificatesByStudent,
  onCloseAddUser,
  onAddUserSuccess,
  onCloseIssueCert,
  onIssueCertSuccess,
  onCloseManageCert,
}) => (
  <>
    {isAddUserModalOpen && (
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={onCloseAddUser}
        onSuccess={onAddUserSuccess}
      />
    )}

    {issueCertUser && (
      <IssueCertificateModal
        student={buildStudentModalPayload(issueCertUser)}
        enrollments={enrollmentsByUser[issueCertUser.id]?.details || []}
        certifiedBatchIds={(certificatesByStudent[issueCertUser.id] || [])
          .map((cert) => cert.batch_id)
          .filter((id): id is string => Boolean(id))}
        onClose={onCloseIssueCert}
        onSuccess={onIssueCertSuccess}
      />
    )}

    {manageCertUser && (
      <ManageCertificatesModal
        student={buildStudentModalPayload(manageCertUser)}
        enrollments={enrollmentsByUser[manageCertUser.id]?.details || []}
        onClose={onCloseManageCert}
      />
    )}
  </>
);
