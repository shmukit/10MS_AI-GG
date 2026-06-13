import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { posthog } from '../../../lib/posthog';

interface CertificateCardProps {
  certificate: {
    id: string;
    certificate_type: string;
    issued_at: string;
    image_url: string;
  };
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${window.location.origin}/certificate/${certificate.id}`;

  useEffect(() => {
    posthog?.capture('certificate_viewed', {
      certificate_id: certificate.id,
      certificate_type: certificate.certificate_type
    });
  }, [certificate.id, certificate.certificate_type]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    posthog?.capture('certificate_shared', {
      certificate_id: certificate.id,
      platform: 'copy_link'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`;
    posthog?.capture('certificate_shared', {
      certificate_id: certificate.id,
      platform: 'linkedin'
    });
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = () => {
    posthog?.capture('certificate_downloaded', {
      certificate_id: certificate.id,
      certificate_type: certificate.certificate_type
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl shadow-sm border border-border overflow-hidden"
    >
      {/* Image Preview */}
      <div className="bg-muted aspect-video flex items-center justify-center p-4 border-b border-border">
        {certificate.image_url ? (
          <img 
            src={certificate.image_url} 
            alt="Certificate" 
            className="max-h-full object-contain rounded drop-shadow-md"
          />
        ) : (
          <div className="text-muted-foreground flex flex-col items-center">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Image not available</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {certificate.certificate_type.replace(/_/g, ' ')}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Issued: {new Date(certificate.issued_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href={certificate.image_url}
            download={`SheSTEM-Certificate-${certificate.id}.png`}
            target="_blank"
            rel="noreferrer"
            onClick={handleDownload}
            className="flex items-center justify-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15"
          >
            <svg className="mr-2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </a>

          <button
            onClick={handleShareLinkedIn}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0A66C2] hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A66C2]"
          >
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Share
          </button>

          <button
            onClick={handleCopyLink}
            className={`flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-[3px] focus:ring-offset-2 ${
              copied 
                ? 'border-green-500 text-green-700 bg-green-50 focus:ring-green-500/15' 
                : 'border-border text-foreground bg-card hover:bg-muted focus:border-primary focus:ring-primary/15'
            }`}
          >
            {copied ? (
              <>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
