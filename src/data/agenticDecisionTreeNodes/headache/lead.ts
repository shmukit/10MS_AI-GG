import { headacheNode } from '../headacheNodeBuilder';

export const leadHeadacheNode = headacheNode('q-headache-lead', 'team lead', [
  {
    label: 'Weekly team update from scattered notes',
    example: 'Slack/WhatsApp/notes → one manager email with priorities.',
    modality: 'text',
    nextId: 'q-finished',
    contextValue: 'team-update',
  },
  {
    label: 'Review team outputs before they go out',
    example: 'Score 10 drafts against team checklist; fail → send back.',
    modality: 'quality',
    nextId: 'q-finished-code-quality',
    contextValue: 'team-qa',
  },
  {
    label: 'Consolidate numbers from 3 departments',
    example: 'Three sheets → one dashboard tab with flagged mismatches.',
    modality: 'numbers',
    nextId: 'q-finished-chain',
    contextValue: 'dept-consolidate',
  },
  {
    label: 'Leadership presentation from team inputs',
    example: 'Dept updates + KPI sheet → board-ready slide outline and speaker notes.',
    modality: 'text',
    nextId: 'q-finished',
    contextValue: 'leadership-presentation',
  },
  {
    label: 'Quarterly plan or strategy draft for your unit',
    example: 'Goals, budget ask, risks, and milestones in one doc for sign-off.',
    modality: 'text',
    nextId: 'q-process-shape',
    contextValue: 'unit-strategy',
  },
  {
    label: 'Monthly performance report from scattered inputs',
    example: 'Email threads + 4 sheets → one manager report with charts described.',
    modality: 'text',
    nextId: 'q-needs-files',
    contextValue: 'monthly-report',
  },
  {
    label: 'Briefing pack for MD / director before a meeting',
    example: 'Emails + KPIs + open issues → 1-page brief with decisions needed (you still own the stamp).',
    modality: 'text',
    nextId: 'q-needs-files',
    contextValue: 'md-briefing-pack',
  },
  {
    label: 'Action tracker after leadership meeting',
    example: 'Messy notes → owners, deadlines, and status table for the MD office follow-up.',
    modality: 'text',
    nextId: 'q-finished',
    contextValue: 'leadership-action-tracker',
  },
]);
