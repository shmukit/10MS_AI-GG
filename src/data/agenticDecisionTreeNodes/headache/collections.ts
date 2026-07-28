import { headacheNode } from '../headacheNodeBuilder';

/** Collections, recovery, PAR — common in banks / NBFIs (e.g. IPDC, bank SEO). */
export const collectionsHeadacheNode = headacheNode(
  'q-headache-collections',
  'collections / recovery',
  [
    {
      label: 'Prioritize overdue accounts for today’s call list',
      example: 'Aging / PAR sheet → Top 20 to call with reason and suggested next action (you still dial).',
      modality: 'numbers',
      nextId: 'q-finished',
      contextValue: 'collection-prioritize',
    },
    {
      label: 'Draft polite recovery / reminder message (Bangla or English)',
      example: 'Account facts + tone rules → SMS/WhatsApp/email draft you approve before send.',
      modality: 'text',
      nextId: 'q-finished',
      contextValue: 'recovery-message',
    },
    {
      label: 'Summarize portfolio-at-risk (PAR) movement for leadership',
      example: 'This week vs last week buckets → 1-page narrative + 3 risks for Head of Collections.',
      modality: 'numbers',
      nextId: 'q-needs-files',
      contextValue: 'par-summary',
    },
    {
      label: 'Extract promise-to-pay or field notes into a tracker',
      example: 'Call notes / WhatsApp updates → structured sheet: date, amount promised, follow-up.',
      modality: 'text',
      nextId: 'q-finished-chain',
      contextValue: 'ptp-tracker',
    },
    {
      label: 'Batch-classify many overdue cases overnight',
      example: 'Hundreds of rows → soft/hard/legal tags by morning; you spot-check a sample.',
      modality: 'numbers',
      nextId: 'q-finished-batch',
      contextValue: 'collection-batch-tag',
    },
    {
      label: 'Prepare recovery file pack before escalation',
      example: 'Statement + notices + call log → checklist of missing docs for legal/ops handoff.',
      modality: 'text',
      nextId: 'q-needs-files',
      contextValue: 'recovery-file-pack',
    },
  ]
);
