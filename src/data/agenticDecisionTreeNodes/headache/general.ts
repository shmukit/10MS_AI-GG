import { headacheNode } from '../headacheNodeBuilder';

export const generalHeadacheNode = headacheNode('q-headache-general', 'office', [
  {
    label: 'Clean up a messy Excel you got on WhatsApp',
    example: 'Wrong columns, merged cells → usable table for your boss.',
    modality: 'numbers',
    nextId: 'q-finished',
    contextValue: 'messy-excel',
  },
  {
    label: 'Write a formal email, memo, or short report',
    example: 'Bullet points → professional email or 1-page report in Bangla or English.',
    modality: 'text',
    nextId: 'q-finished',
    contextValue: 'formal-email',
  },
  {
    label: 'Meeting voice note → action items',
    example: '15-min recording → who does what by when (you confirm).',
    modality: 'voice',
    nextId: 'q-finished',
    contextValue: 'meeting-actions',
  },
  {
    label: 'Presentation or slide outline from your notes',
    example: 'Rough bullets → slide titles, one chart suggestion per section, speaker notes.',
    modality: 'text',
    nextId: 'q-finished',
    contextValue: 'office-presentation',
  },
  {
    label: 'Analyze a sheet someone sent you (trends, totals, problems)',
    example: '“What stands out?” → 5 insights with row references you can check.',
    modality: 'numbers',
    nextId: 'q-finished',
    contextValue: 'office-data-analysis',
  },
  {
    label: 'Clean data: duplicates, dates, names, mixed formats',
    example: 'One dirty export → trustworthy table before share or pivot table.',
    modality: 'numbers',
    nextId: 'q-finished',
    contextValue: 'office-data-clean',
  },
  {
    label: 'Organize scattered files on Drive or email',
    example: 'Random attachments → folders, naming rules, and a one-page index.',
    modality: 'text',
    nextId: 'q-finished-chain',
    contextValue: 'office-doc-org',
  },
  {
    label: 'Scan and digitize old paper forms or binders',
    example: 'Paper stack → scanned PDFs with consistent names and a search index.',
    modality: 'image',
    nextId: 'q-finished-batch',
    contextValue: 'office-digitization',
  },
  {
    label: 'Help prepare a demo or briefing for your boss or client',
    example: 'Product screenshots + talking points → demo flow and Q&A prep.',
    modality: 'text',
    nextId: 'q-finished',
    contextValue: 'office-demo-prep',
  },
]);
