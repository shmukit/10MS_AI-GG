import { headacheNode } from '../headacheNodeBuilder';

export const opsHeadacheNode = headacheNode('q-headache-ops', 'operations', [
  {
    label: 'Reply to customer ticket using SOP',
    example: 'Angry email + SOP PDF → draft reply you approve before send.',
    modality: 'text',
    nextId: 'q-needs-files',
    contextValue: 'ticket-reply',
  },
  {
    label: 'Tag or sort a big inbox overnight',
    example: '200 emails → category column by morning; you spot-check 10.',
    modality: 'text',
    nextId: 'q-finished-batch',
    contextValue: 'inbox-batch',
  },
  {
    label: 'Coordinate field updates from WhatsApp messages',
    example: 'Daily dealer updates → one master sheet (multi-step, you confirm).',
    modality: 'numbers',
    nextId: 'q-finished-chain',
    contextValue: 'whatsapp-sheet',
  },
  {
    label: 'Analyze ops or support metrics for weekly report',
    example: 'Ticket export → volume, top issues, SLA misses in bullets for Monday standup.',
    modality: 'numbers',
    nextId: 'q-finished',
    contextValue: 'ops-metrics-analysis',
  },
  {
    label: 'Organize SOPs and process docs into one handbook',
    example: 'PDFs in email/Drive chaos → single indexed folder with “current SOP” labels.',
    modality: 'text',
    nextId: 'q-finished-chain',
    contextValue: 'sop-organization',
  },
  {
    label: 'Clean operational data export before dashboard',
    example: 'Raw CSV from system → fixed dates, categories, and nulls for Sheets dashboard.',
    modality: 'numbers',
    nextId: 'q-finished',
    contextValue: 'ops-data-clean',
  },
  {
    label: 'Track supply-chain delays or order exceptions',
    example: 'PO/shipment sheet → late lines, reason codes, and escalation list for South Asia ops standup.',
    modality: 'numbers',
    nextId: 'q-finished',
    contextValue: 'supply-chain-exceptions',
  },
  {
    label: 'Draft vendor / logistics follow-up from status sheet',
    example: 'Delayed SKUs + agreed SLA → polite email/WhatsApp you approve before send.',
    modality: 'text',
    nextId: 'q-finished',
    contextValue: 'vendor-followup',
  },
]);
