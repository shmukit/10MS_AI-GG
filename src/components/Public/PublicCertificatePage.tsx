import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Link as LinkIcon, Download, AlertCircle } from 'lucide-react';
import { useToast } from '../ui/ToastProvider';

const actionLinkClass =
  'inline-flex items-center px-4 py-2 rounded-full border text-sm font-medium transition-colors';
const primaryActionClass = `${actionLinkClass} border-transparent bg-primary text-primary-foreground hover:bg-primary/90`;
const secondaryActionClass = `${actionLinkClass} border-border bg-card text-foreground hover:bg-muted`;

export const PublicCertificatePage = () => {
  const { id } = useParams<{ id: string }>();
  const { success } = useToast();
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('student_certificates')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setCertificate(data);
      } catch (err: unknown) {
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card rounded-xl border border-border p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Certificate Not Found</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareText = `Check out my SheSTEM Certificate of Participation!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    success('Link copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-foreground">Certificate of Completion</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Issued to {certificate.metadata?.student_name || 'Student'} on{' '}
            {new Date(certificate.issued_at).toLocaleDateString()}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl overflow-hidden border border-border"
        >
          <div className="p-8 flex justify-center bg-muted/50">
            {certificate.image_url ? (
              <img
                src={certificate.image_url}
                alt="SheSTEM Certificate"
                className="max-w-full h-auto rounded-lg border border-border"
              />
            ) : (
              <div className="w-full aspect-video bg-muted flex items-center justify-center rounded-lg border-2 border-dashed border-border">
                <p className="text-muted-foreground">Certificate image not available</p>
              </div>
            )}
          </div>

          <div className="px-8 py-6 bg-card flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              <p>
                Credential ID:{' '}
                <span className="font-mono text-foreground">{certificate.id}</span>
              </p>
              <p>
                Type:{' '}
                <span className="font-medium text-foreground">
                  {certificate.certificate_type.replace(/_/g, ' ')}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {certificate.image_url && (
                <a
                  href={certificate.image_url}
                  download={`Certificate-${certificate.id}.png`}
                  target="_blank"
                  rel="noreferrer"
                  className={primaryActionClass}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </a>
              )}

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className={secondaryActionClass}
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent('My SheSTEM Certificate')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`}
                className={secondaryActionClass}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </a>

              <button type="button" onClick={handleCopyLink} className={secondaryActionClass}>
                <LinkIcon className="w-4 h-4 mr-2" />
                Copy Link
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
