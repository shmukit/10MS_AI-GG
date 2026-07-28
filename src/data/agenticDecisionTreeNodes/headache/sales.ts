import { headacheNode } from '../headacheNodeBuilder';

export const salesHeadacheNode = headacheNode('q-headache-sales', 'sales', [
  {
    label: 'Bangla follow-up after dealer or client visit',
    example: 'Visit notes → polite WhatsApp message with next step and date.',
    modality: 'text',
    nextId: 'q-finished',
    contextValue: 'dealer-followup',
  },
  {
    label: 'Clean product photos for Facebook or catalog',
    example: 'Phone photo → brighter, cropped, ready for post.',
    modality: 'image',
    nextId: 'q-finished',
    contextValue: 'product-photo',
  },
  {
    label: 'Turn voice note from client into CRM update draft',
    example: '2-min Bangla voice note → bullet summary + draft reply (you send).',
    modality: 'voice',
    nextId: 'q-finished',
    contextValue: 'voice-crm',
  },
  {
    label: 'Outstanding / pipeline report from messy sheet',
    example: 'Dealer list with mixed formats → clean summary table for Monday meeting.',
    modality: 'numbers',
    nextId: 'q-finished',
    contextValue: 'pipeline-report',
  },
  {
    label: 'BD plan for new territory, product, or partner line',
    example: 'Who to target, visit cadence, and 90-day pipeline goals for your manager.',
    modality: 'text',
    nextId: 'q-process-shape',
    contextValue: 'sales-bd-plan',
  },
  {
    label: 'Client demo script and talk track for a real product',
    example: '15-min meeting: opening, 5 screens to show, objection answers, and close ask.',
    modality: 'text',
    nextId: 'q-finished',
    contextValue: 'sales-demo-script',
  },
  {
    label: 'Win/loss or pipeline analysis from CRM export',
    example: 'Last quarter deals → why we won/lost and where pipeline is stuck.',
    modality: 'numbers',
    nextId: 'q-finished',
    contextValue: 'pipeline-analysis',
  },
  {
    label: 'Proposal or pitch deck from discovery notes',
    example: 'Visit notes + pricing sheet → client-facing slides and cover email draft.',
    modality: 'text',
    nextId: 'q-finished',
    contextValue: 'sales-pitch-deck',
  },
  {
    label: 'Liability / deposit product talking points for a client visit',
    example: 'Rate card + eligibility rules → 1-pager and FAQ you review before the meeting.',
    modality: 'text',
    nextId: 'q-needs-files',
    contextValue: 'liability-talk-track',
  },
  {
    label: 'Corporate / retail liability pipeline update for leadership',
    example: 'Messy CRM notes → clean funnel table + 5 bullets on stuck deals.',
    modality: 'numbers',
    nextId: 'q-finished',
    contextValue: 'liability-pipeline',
  },
]);
