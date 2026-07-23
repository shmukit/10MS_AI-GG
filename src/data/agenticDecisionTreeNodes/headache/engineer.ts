import { headacheNode } from '../headacheNodeBuilder';

export const engineerHeadacheNode = headacheNode('q-headache-engineer', 'software', [
  {
    label: 'Fix failing test or small bug on a branch',
    example: 'Red CI → green tests → PR ready for review.',
    modality: 'code',
    nextId: 'q-finished-code',
    contextValue: 'fix-test',
  },
  {
    label: 'Ship small feature with review checklist',
    example: 'Ticket → code + tests + PR description; teammate reviews.',
    modality: 'code',
    nextId: 'q-finished-code',
    contextValue: 'ship-feature',
  },
  {
    label: 'Review PR with security + test checklist',
    example: 'AI flags issues; you decide merge—tests must pass.',
    modality: 'quality',
    nextId: 'q-finished-code-quality',
    contextValue: 'pr-review',
  },
  {
    label: 'Build clickable demo or prototype for sales / demo day',
    example: 'Real flows on staging → working demo branch + 5-minute script for presales.',
    modality: 'code',
    nextId: 'q-finished-code',
    contextValue: 'demo-prototype',
  },
  {
    label: 'Document API or internal wiki from existing code',
    example: 'Undocumented service → README + endpoint table a new hire can follow.',
    modality: 'text',
    nextId: 'q-needs-files',
    contextValue: 'tech-documentation',
  },
]);
