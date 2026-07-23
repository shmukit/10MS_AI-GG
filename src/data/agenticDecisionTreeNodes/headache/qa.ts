import { headacheNode } from '../headacheNodeBuilder';

export const qaHeadacheNode = headacheNode('q-headache-qa', 'QA/evaluation', [
  {
    label: 'Grade AI or agent replies with a rubric',
    example: '20 support drafts → pass/fail tags; fails go to senior.',
    modality: 'quality',
    nextId: 'q-finished-code-quality',
    contextValue: 'grade-replies',
  },
  {
    label: 'Spot-check overnight batch outputs',
    example: '500 tagged rows → sample 15 + exception queue.',
    modality: 'quality',
    nextId: 'q-finished-batch',
    contextValue: 'batch-qa',
  },
  {
    label: 'Run fixed checklist / formula checks before asking AI to judge',
    example: 'Totals and required fields first; AI only on the unclear 10%.',
    modality: 'quality',
    nextId: 'q-finished-code-quality',
    contextValue: 'deterministic-qa',
  },
]);
