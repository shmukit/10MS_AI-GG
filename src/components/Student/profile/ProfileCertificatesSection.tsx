import React from 'react';
import { Award } from 'lucide-react';
import { CertificateCard } from '../Certificates/CertificateCard';
import { EmptyState } from '../../ui/EmptyState';

interface ProfileCertificatesSectionProps {
  certificates: any[];
}

export const ProfileCertificatesSection: React.FC<ProfileCertificatesSectionProps> = ({ certificates }) => (
  <div className="mt-8 bg-card border border-border rounded-2xl p-8">
    <h3 className="text-xl font-bold mb-6 text-foreground">
      My Certificates & Achievements
    </h3>
    {certificates.length > 0 ? (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <CertificateCard key={cert.id} certificate={cert} />
        ))}
      </div>
    ) : (
      <EmptyState
        icon={Award}
        title="No certificates yet"
        description="Certificates you earn will appear here."
      />
    )}
  </div>
);
