import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../lib/supabase';
import { Trash2, ExternalLink, Award, CircleDashed } from 'lucide-react';
import { useConfirm } from '../../ui/ConfirmProvider';
import { useToast } from '../../ui/ToastProvider';
import {
  buildEnrollmentLabel,
  formatCertificateType,
  getCertificateCohortLabel,
  type EnrollmentDetail,
  type StudentCertificateRecord,
} from '../../../lib/certificateTypes';

interface ManageCertificatesModalProps {
  student: {
    id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    raw_user_meta_data?: { full_name?: string };
  };
  enrollments: EnrollmentDetail[];
  onClose: () => void;
}

export const ManageCertificatesModal: React.FC<ManageCertificatesModalProps> = ({
  student,
  enrollments,
  onClose,
}) => {
  const { confirm } = useConfirm();
  const { error: toastError } = useToast();
  const [certificates, setCertificates] = useState<StudentCertificateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const studentName =
    student?.raw_user_meta_data?.full_name ||
    [student?.first_name, student?.last_name].filter(Boolean).join(' ') ||
    student?.email ||
    'Student';

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('student_certificates')
        .select('*')
        .eq('student_id', student.id)
        .order('issued_at', { ascending: false });

      if (fetchError) throw fetchError;
      setCertificates((data as StudentCertificateRecord[]) || []);
    } catch (err: unknown) {
      console.error('Error fetching certificates:', err);
      setError(err instanceof Error ? err.message : 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [student.id]);

  const certByBatchId = useMemo(() => {
    const map = new Map<string, StudentCertificateRecord>();
    certificates.forEach((cert) => {
      if (cert.batch_id) map.set(cert.batch_id, cert);
    });
    return map;
  }, [certificates]);

  const legacyCertificates = useMemo(
    () => certificates.filter((cert) => !cert.batch_id),
    [certificates]
  );

  const handleDelete = async (certId: string, imageUrl: string | null) => {
    const confirmed = await confirm({
      title: 'Revoke certificate?',
      message: 'This will permanently delete the certificate record and image. This action cannot be undone.',
      confirmLabel: 'Revoke',
      variant: 'destructive',
    });
    if (!confirmed) return;

    try {
      if (imageUrl) {
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
          await supabase.storage.from('certificates').remove([fileName]);
        }
      }

      const { error: dbError } = await supabase
        .from('student_certificates')
        .delete()
        .eq('id', certId);

      if (dbError) throw dbError;
      fetchCertificates();
    } catch (err: unknown) {
      console.error('Failed to delete certificate:', err);
      toastError(err instanceof Error ? err.message : 'Failed to delete certificate');
    }
  };

  const hasEnrollments = enrollments.length > 0;
  const hasAnyContent = certificates.length > 0 || hasEnrollments;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-medium text-foreground">Manage Certificates — {studentName}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-background space-y-6">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading certificates...</div>
          ) : !hasAnyContent ? (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border">
              No batch enrollments or certificates for this student.
            </div>
          ) : (
            <>
              {hasEnrollments && (
                <section>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Enrollments</h4>
                  <div className="space-y-2">
                    {enrollments.map((enrollment) => {
                      const cert = certByBatchId.get(enrollment.batchId);
                      return (
                        <div
                          key={enrollment.batchId}
                          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {buildEnrollmentLabel(enrollment)}
                            </p>
                            {cert ? (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Issued {new Date(cert.issued_at).toLocaleDateString()}
                              </p>
                            ) : (
                              <p className="text-xs text-muted-foreground mt-0.5">No certificate issued</p>
                            )}
                          </div>
                          {cert ? (
                            <Award className="w-4 h-4 text-primary shrink-0" aria-hidden />
                          ) : (
                            <CircleDashed className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {certificates.length > 0 ? (
                <section>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Issued certificates</h4>
                  <div className="space-y-4">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="bg-card p-4 rounded-lg border border-border shadow-sm flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {cert.image_url ? (
                            <img
                              src={cert.image_url}
                              alt="Certificate preview"
                              className="h-16 w-auto object-cover rounded border border-border shrink-0"
                            />
                          ) : (
                            <div className="h-16 w-24 bg-muted flex items-center justify-center text-xs text-muted-foreground rounded shrink-0">
                              No Image
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-medium text-foreground">
                              {formatCertificateType(cert.certificate_type)}
                            </h4>
                            <p className="text-sm text-muted-foreground truncate">
                              {getCertificateCohortLabel(cert)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Issued: {new Date(cert.issued_at).toLocaleDateString()}
                            </p>
                            <a
                              href={`/certificate/${cert.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-primary flex items-center gap-1 mt-1 hover:underline w-fit"
                            >
                              View Public Link <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(cert.id, cert.image_url)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"
                          title="Revoke Certificate"
                          aria-label="Revoke certificate"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              ) : hasEnrollments ? (
                <div className="text-center py-6 text-muted-foreground bg-card rounded-lg border border-border text-sm">
                  No certificates have been issued yet. Use <strong>Issue Certificate</strong> from the user actions menu.
                </div>
              ) : null}

              {legacyCertificates.length > 0 && !hasEnrollments && (
                <p className="text-xs text-muted-foreground">
                  Legacy certificates without batch context are listed above.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
