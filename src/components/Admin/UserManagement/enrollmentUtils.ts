import type { EnrollmentInfo } from './types';

export function buildEnrollmentMap(batchData: any[] | null): Record<string, EnrollmentInfo> {
  const enrollmentMap: Record<string, EnrollmentInfo> = {};

  (batchData || []).forEach((row: any) => {
    const studentId = row.student_id as string;
    if (!studentId) return;

    const batch = Array.isArray(row.batches) ? row.batches[0] : row.batches;
    const roadmapRaw = batch?.roadmaps;
    const roadmap = Array.isArray(roadmapRaw) ? roadmapRaw[0] : roadmapRaw;

    if (!enrollmentMap[studentId]) {
      enrollmentMap[studentId] = {
        batches: [],
        roadmaps: [],
        batchIds: [],
        roadmapIds: [],
        details: [],
      };
    }

    const info = enrollmentMap[studentId];
    if (batch?.name && !info.batches.includes(batch.name)) {
      info.batches.push(batch.name);
    }
    if (batch?.id && !info.batchIds.includes(batch.id)) {
      info.batchIds.push(batch.id);
    }
    if (roadmap?.title && !info.roadmaps.includes(roadmap.title)) {
      info.roadmaps.push(roadmap.title);
    }
    if (roadmap?.id && !info.roadmapIds.includes(roadmap.id)) {
      info.roadmapIds.push(roadmap.id);
    }
    if (batch?.id && batch?.name && roadmap?.id && roadmap?.title) {
      const exists = info.details.some((d) => d.batchId === batch.id);
      if (!exists) {
        info.details.push({
          batchId: batch.id,
          batchName: batch.name,
          roadmapId: roadmap.id,
          roadmapTitle: roadmap.title,
        });
      }
    }
  });

  return enrollmentMap;
}

export function buildCertificatesMap(certData: any[] | null) {
  const certMap: Record<string, any[]> = {};

  (certData || []).forEach((cert) => {
    if (!certMap[cert.student_id]) {
      certMap[cert.student_id] = [];
    }
    certMap[cert.student_id].push(cert);
  });

  return certMap;
}
