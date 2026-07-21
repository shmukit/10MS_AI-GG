import React, { useMemo, useState, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuthContext } from '../../../lib/AuthContext';
import {
  buildEnrollmentLabel,
  type EnrollmentDetail,
} from '../../../lib/certificateTypes';

interface IssueCertificateModalProps {
  student: {
    id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    raw_user_meta_data?: { full_name?: string };
  };
  enrollments: EnrollmentDetail[];
  certifiedBatchIds?: string[];
  onClose: () => void;
  onSuccess: () => void;
}

export const IssueCertificateModal: React.FC<IssueCertificateModalProps> = ({
  student,
  enrollments,
  certifiedBatchIds = [],
  onClose,
  onSuccess,
}) => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [editableName, setEditableName] = useState(
    student?.raw_user_meta_data?.full_name ||
      [student?.first_name, student?.last_name].filter(Boolean).join(' ') ||
      student?.email ||
      'Student'
  );

  const availableEnrollments = useMemo(
    () => enrollments.filter((e) => !certifiedBatchIds.includes(e.batchId)),
    [enrollments, certifiedBatchIds]
  );

  const [selectedBatchId, setSelectedBatchId] = useState<string>(() => {
    if (availableEnrollments.length === 1) return availableEnrollments[0].batchId;
    return '';
  });

  const selectedEnrollment = availableEnrollments.find((e) => e.batchId === selectedBatchId);

  const templateSrc = '/shestem_certificate_template.png';

  const generateAndUploadImage = async (): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) return reject('Canvas not found');

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('Canvas context not supported');

      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        ctx.font = 'normal 80px "Great Vibes", "Brush Script MT", "Dancing Script", cursive';
        ctx.fillStyle = '#0A2540';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        const xPos = canvas.width / 2;
        const yPos = canvas.height * 0.665;
        ctx.fillText(editableName, xPos, yPos);

        canvas.toBlob(async (blob) => {
          if (!blob) return reject('Failed to create image blob');

          try {
            const fileName = `cert_${student.id}_${Date.now()}.png`;
            const { error: uploadError } = await supabase.storage
              .from('certificates')
              .upload(fileName, blob, {
                contentType: 'image/png',
                cacheControl: '3600',
                upsert: false,
              });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
              .from('certificates')
              .getPublicUrl(fileName);

            resolve(urlData.publicUrl);
          } catch (err) {
            reject(err);
          }
        }, 'image/png');
      };
      img.onerror = () => reject('Failed to load template image');
      img.src = templateSrc;
    });
  };

  const handleIssue = async () => {
    if (enrollments.length === 0) {
      setError('This student has no batch enrollments. Assign them to a batch before issuing a certificate.');
      return;
    }

    if (!selectedEnrollment) {
      setError('Select the batch and roadmap this certificate is for.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const imageUrl = await generateAndUploadImage();
      const cohortLabel = buildEnrollmentLabel(selectedEnrollment);

      const { error: dbError } = await supabase.from('student_certificates').insert({
        student_id: student.id,
        issued_by: user?.id,
        certificate_type: 'SheSTEM_Zoom_Completion',
        image_url: imageUrl,
        batch_id: selectedEnrollment.batchId,
        roadmap_id: selectedEnrollment.roadmapId,
        metadata: {
          student_name: editableName,
          batch_name: selectedEnrollment.batchName,
          roadmap_title: selectedEnrollment.roadmapTitle,
        },
      } as never);

      if (dbError) {
        if (dbError.code === '23505') {
          throw new Error(`A certificate has already been issued for ${cohortLabel}.`);
        }
        throw dbError;
      }

      const { error: noticeError } = await supabase.from('notices').insert({
        title: 'Congratulations! Certificate Issued 🎓',
        content: `Great news! Your SheSTEM Zoom Completion Certificate for ${cohortLabel} has been issued. View, download, and share it from your profile under "My Certificates & Achievements".`,
        author_id: user?.id,
        target_student_id: student.id,
        tag: 'certificate',
        priority: 'high',
        is_published: true,
      } as never);

      if (noticeError) {
        console.error('Failed to send notice but certificate was issued:', noticeError);
      }

      onSuccess();
    } catch (err: unknown) {
      console.error('Failed to issue certificate:', err);
      const message = err instanceof Error ? err.message : 'An error occurred while issuing the certificate.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const allEnrollmentsCertified =
    enrollments.length > 0 && availableEnrollments.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-medium text-foreground">Issue Certificate</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-4">
            You are about to issue a <strong>SheSTEM Zoom Completion</strong> certificate to:
          </p>

          {enrollments.length === 0 ? (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-200">
              This student is not enrolled in any batch. Assign them to a batch before issuing a certificate.
            </div>
          ) : allEnrollmentsCertified ? (
            <div className="mb-4 rounded-lg border border-border bg-muted p-3 text-sm text-muted-foreground">
              A certificate has already been issued for every enrolled batch.
            </div>
          ) : (
            <div className="bg-muted p-4 rounded-lg mb-4">
              <label htmlFor="cohort-select" className="block text-sm font-medium text-foreground mb-1">
                Cohort (batch · roadmap)
              </label>
              {availableEnrollments.length === 1 ? (
                <p className="text-sm text-foreground">{buildEnrollmentLabel(availableEnrollments[0])}</p>
              ) : (
                <select
                  id="cohort-select"
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 bg-background text-foreground text-sm"
                >
                  <option value="">Select batch and roadmap…</option>
                  {availableEnrollments.map((enrollment) => (
                    <option key={enrollment.batchId} value={enrollment.batchId}>
                      {buildEnrollmentLabel(enrollment)}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                One certificate is issued per batch enrollment. Students in multiple cohorts need separate certificates.
              </p>
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg mb-6">
            <label htmlFor="cert-name" className="block text-sm font-medium text-foreground mb-1">
              Name on Certificate
            </label>
            <input
              id="cert-name"
              type="text"
              value={editableName}
              onChange={(e) => setEditableName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 bg-background text-foreground placeholder:text-muted-foreground"
              placeholder="Enter full name"
            />
            <p className="text-xs text-muted-foreground mt-2">
              You can edit the name above if it needs correction before issuing.
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleIssue}
              disabled={loading || enrollments.length === 0 || allEnrollmentsCertified || !selectedEnrollment}
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Issue Certificate'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
