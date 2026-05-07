import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Link as LinkIcon, Download } from 'lucide-react';

export const PublicCertificatePage = () => {
  const { id } = useParams<{ id: string }>();
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Remove restricted auth.users join. We will use metadata or the burned-in image.
        const { data, error } = await supabase
          .from('student_certificates')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setCertificate(data);
      } catch (err: any) {
        console.error('Error fetching certificate:', err);
        setError('Certificate not found or invalid link.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificate Not Found</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareText = `Check out my SheSTEM Certificate of Participation!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Certificate of Completion</h1>
          <p className="mt-2 text-lg text-gray-600">
            Issued to {certificate.metadata?.student_name || 'Student'} on {new Date(certificate.issued_at).toLocaleDateString()}
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="p-8 flex justify-center bg-gray-100">
            {certificate.image_url ? (
              <img 
                src={certificate.image_url} 
                alt="SheSTEM Certificate" 
                className="max-w-full h-auto rounded-lg shadow-sm"
              />
            ) : (
              <div className="w-full aspect-video bg-gray-200 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">Certificate image not available</p>
              </div>
            )}
          </div>
          
          <div className="px-8 py-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              <p>Credential ID: <span className="font-mono text-gray-900">{certificate.id}</span></p>
              <p>Type: <span className="font-medium text-gray-900">{certificate.certificate_type.replace(/_/g, ' ')}</span></p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {certificate.image_url && (
                <a 
                  href={certificate.image_url} 
                  download={`Certificate-${certificate.id}.png`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </a>
              )}
              
              {/* Share Buttons */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
                LinkedIn
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent('My SheSTEM Certificate')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                Email
              </a>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <LinkIcon className="w-4 h-4 mr-2 text-gray-500" />
                Copy Link
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
