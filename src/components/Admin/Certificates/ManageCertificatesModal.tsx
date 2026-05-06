import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Trash2, ExternalLink } from 'lucide-react';

interface ManageCertificatesModalProps {
  student: any;
  onClose: () => void;
}

export const ManageCertificatesModal: React.FC<ManageCertificatesModalProps> = ({ student, onClose }) => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const studentName = student?.raw_user_meta_data?.full_name || student?.first_name || student?.email || 'Student';

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('student_certificates')
        .select('*')
        .eq('student_id', student.id)
        .order('issued_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (err: any) {
      console.error('Error fetching certificates:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [student.id]);

  const handleDelete = async (certId: string, imageUrl: string | null) => {
    if (!window.confirm('Are you sure you want to revoke this certificate? This action cannot be undone.')) return;

    try {
      // 1. Delete the image from storage if it exists
      if (imageUrl) {
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
          await supabase.storage.from('certificates').remove([fileName]);
        }
      }

      // 2. Delete the DB record
      const { error: dbError } = await supabase
        .from('student_certificates')
        .delete()
        .eq('id', certId);

      if (dbError) throw dbError;

      // Refresh list
      fetchCertificates();
    } catch (err: any) {
      console.error('Failed to delete certificate:', err);
      alert('Failed to delete certificate: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Manage Certificates - {studentName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-900">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading certificates...</div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              No certificates have been issued to this student.
            </div>
          ) : (
            <div className="space-y-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {cert.image_url ? (
                      <img src={cert.image_url} alt="Cert" className="h-16 w-auto object-cover rounded border border-gray-200 dark:border-gray-700" />
                    ) : (
                      <div className="h-16 w-24 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500 rounded">No Image</div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{cert.certificate_type.replace(/_/g, ' ')}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Issued: {new Date(cert.issued_at).toLocaleDateString()}</p>
                      <a href={`/certificate/${cert.id}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1 hover:underline">
                        View Public Link <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(cert.id, cert.image_url)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Revoke Certificate"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
