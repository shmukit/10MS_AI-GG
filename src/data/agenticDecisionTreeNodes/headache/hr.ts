import { headacheNode } from '../headacheNodeBuilder';

export const hrHeadacheNode = headacheNode('q-headache-hr', 'HR/admin', [
  {
    label: 'Joining letter or offer letter from template + sheet row',
    example: 'One employee row → complete letter with correct dates and salary words.',
    modality: 'text',
    nextId: 'q-finished',
    contextValue: 'joining-letter',
  },
  {
    label: 'Read NID / photo for onboarding checklist',
    example: 'Scan photo → name/ID fields typed for HR file (you verify).',
    modality: 'image',
    nextId: 'q-finished',
    contextValue: 'nid-onboard',
  },
  {
    label: 'Attendance or leave sheet cleanup',
    example: 'Mixed attendance export → one clean table for payroll handoff.',
    modality: 'numbers',
    nextId: 'q-finished',
    contextValue: 'attendance-clean',
  },
  {
    label: 'Digitize employee paper files into HR folders',
    example: 'Signed forms and NID copies → scanned, named, indexed in one Drive structure.',
    modality: 'image',
    nextId: 'q-finished-batch',
    contextValue: 'hr-digitization',
  },
  {
    label: 'Organize HR policies and letter templates',
    example: 'Scattered Word/PDF files → one handbook folder with version dates.',
    modality: 'text',
    nextId: 'q-finished-chain',
    contextValue: 'hr-doc-org',
  },
]);
