import { headacheNode } from '../headacheNodeBuilder';

export const planningHeadacheNode = headacheNode('q-headache-planning', 'planning / BD / reporting', [
  {
    label: 'Write management or board report from notes and numbers',
    example: 'WhatsApp updates + 3 Excel tabs → one 2-page report with highlights and risks.',
    modality: 'text',
    nextId: 'q-needs-files',
    contextValue: 'mgmt-report',
  },
  {
    label: 'Build presentation / slide deck for client or internal meeting',
    example: 'Bullet outline + last month’s chart → slide titles, speaker notes, and one chart caption per slide.',
    modality: 'text',
    nextId: 'q-finished',
    contextValue: 'presentation-deck',
  },
  {
    label: 'Draft BD plan or market / expansion strategy',
    example: 'Target segment, 5 partners, timeline, and budget rough-cut for leadership review—not a 50-page fantasy doc.',
    modality: 'text',
    nextId: 'q-process-shape',
    contextValue: 'bd-strategy',
  },
  {
    label: 'Analyze data for trends, outliers, or top performers',
    example: 'Sales or ops export → “what changed vs last month?” with 5 bullet insights you can defend.',
    modality: 'numbers',
    nextId: 'q-finished',
    contextValue: 'data-analysis',
  },
  {
    label: 'Clean messy data before analysis or sharing',
    example: 'Duplicate rows, wrong dates, mixed Bangla/English names → one trustworthy table.',
    modality: 'numbers',
    nextId: 'q-finished',
    contextValue: 'data-cleaning',
  },
  {
    label: 'Organize scattered docs into folders + index',
    example: 'Years of Drive/WhatsApp/email attachments → named folders, README index, “official version” tagged.',
    modality: 'text',
    nextId: 'q-finished-chain',
    contextValue: 'doc-organization',
  },
  {
    label: 'Digitize paper files / binders into searchable archive',
    example: 'Stack of signed forms or old contracts → scans OCR’d, filed, and findable by name/date.',
    modality: 'image',
    nextId: 'q-finished-batch',
    contextValue: 'doc-digitization',
  },
  {
    label: 'Prepare real demo product walkthrough (what to show and say)',
    example: 'Live product or prototype → 10-min demo script, click path, and answers to likely client questions.',
    modality: 'text',
    nextId: 'q-finished',
    contextValue: 'demo-walkthrough',
  },
]);
