export interface EnrollmentDetail {
  batchId: string;
  batchName: string;
  roadmapId: string;
  roadmapTitle: string;
}

export interface StudentCertificateRecord {
  id: string;
  student_id: string;
  certificate_type: string;
  issued_at: string;
  image_url: string | null;
  batch_id?: string | null;
  roadmap_id?: string | null;
  metadata?: {
    student_name?: string;
    batch_name?: string;
    roadmap_title?: string;
  } | null;
}

export function formatCertificateType(type: string): string {
  return type.replace(/_/g, ' ');
}

export function getCertificateCohortLabel(cert: Pick<StudentCertificateRecord, 'metadata'>): string {
  const batch = cert.metadata?.batch_name;
  const roadmap = cert.metadata?.roadmap_title;
  if (batch && roadmap) return `${batch} · ${roadmap}`;
  if (batch) return batch;
  if (roadmap) return roadmap;
  return 'Program completion';
}

export function buildEnrollmentLabel(enrollment: EnrollmentDetail): string {
  return `${enrollment.batchName} · ${enrollment.roadmapTitle}`;
}
