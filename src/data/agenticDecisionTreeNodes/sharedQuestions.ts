import { q } from './builders';

export const SHARED_QUESTIONS = {
  'q-sector': q(
    'q-sector',
    'Sector',
    'Which sector best describes where you work?',
    'This helps us show examples that feel like your office—not Silicon Valley.',
    [
      { label: 'Bank / MFI / NBFI / financial services', nextId: 'q-role-bank', contextKey: 'sector', contextValue: 'Bank / MFI / NBFI' },
      { label: 'RMG / factory / industrial', nextId: 'q-role-rmg', contextKey: 'sector', contextValue: 'RMG / factory' },
      { label: 'Corporate office (any industry)', nextId: 'q-role-corporate', contextKey: 'sector', contextValue: 'Corporate office' },
      { label: 'Agency / sales / distribution', nextId: 'q-role-agency', contextKey: 'sector', contextValue: 'Agency / sales' },
      { label: 'Education / NGO / development', nextId: 'q-role-education', contextKey: 'sector', contextValue: 'Education / NGO' },
      { label: 'Software / IT / digital product', nextId: 'q-role-it', contextKey: 'sector', contextValue: 'Software / IT' },
      { label: 'Other office / mixed', nextId: 'q-role-other', contextKey: 'sector', contextValue: 'Other office' },
    ],
    ['Examples: Gulshan bank tower, Gazipur RMG floor, Mirpur startup, Dhanmondi NGO program office.']
  ),
  'q-finished': q(
    'q-finished',
    'Your output',
    'When this job is finished, what do you have?',
    'Pick one — the next screen will show your recommendation. You only need one answer here.',
    [
      {
        label: 'One message, doc, image, or answer I am happy with',
        nextId: 'q-needs-files',
        contextKey: 'finished',
        contextValue: 'one-thing',
      },
      {
        label: 'Several steps done until sheet, inbox, or status is updated',
        nextId: 'q-process-shape',
        contextKey: 'finished',
        contextValue: 'chain',
      },
    ]
  ),
  'q-finished-code': q(
    'q-finished-code',
    'Code done',
    'When this coding job is finished, what proves it is done?',
    'For engineers, “done” should be objective—not vibes.',
    [
      {
        label: 'Tests pass / CI is green and PR is ready',
        nextId: 'result-4',
        contextKey: 'finished',
        contextValue: 'tests-green',
      },
    ]
  ),
  'q-finished-code-quality': q(
    'q-finished-code-quality',
    'Quality done',
    'When this quality job is finished, what proves it is done?',
    'Your checklist is the contract—pin it so it does not drift.',
    [
      {
        label: 'Outputs scored; fails routed to a human',
        nextId: 'result-7',
        contextKey: 'finished',
        contextValue: 'graded',
      },
    ]
  ),
  'q-finished-batch': q(
    'q-finished-batch',
    'Batch volume',
    'How much volume are you dealing with?',
    'Batch helpers are for many similar items—not one sensitive approval.',
    [
      {
        label: 'Dozens or hundreds of similar items (overnight is OK)',
        nextId: 'result-6',
        contextKey: 'finished',
        contextValue: 'batch',
      },
    ]
  ),
  'q-finished-chain': q(
    'q-finished-chain',
    'Multi-step',
    'This sounds like multi-step work. How should it run?',
    'You stay in control—especially for money, customers, or official records.',
    [
      {
        label: 'Step-by-step with my approval before anything goes out',
        nextId: 'result-3',
        contextKey: 'processShape',
        contextValue: 'buddy',
      },
      {
        label: 'Two different jobs hand off to each other (e.g. extract → confirm)',
        nextId: 'result-5',
        contextKey: 'processShape',
        contextValue: 'handoff',
      },
    ]
  ),
  'q-needs-files': q(
    'q-needs-files',
    'Your files',
    'Does the AI need your company files to answer correctly?',
    'Policies, old sheets, PDFs, scans—anything official you would open to double-check.',
    [
      {
        label: 'No — I can paste what I have in chat',
        nextId: 'result-1',
        contextKey: 'processShape',
        contextValue: 'quick',
      },
      {
        label: 'Yes — it must read our documents or scans',
        nextId: 'result-2',
        contextKey: 'processShape',
        contextValue: 'brain',
      },
    ]
  ),
  'q-process-shape': q(
    'q-process-shape',
    'How it runs',
    'How should this multi-step work run?',
    'Pick the simplest shape that still matches reality.',
    [
      {
        label: 'I approve each step before the next one runs',
        nextId: 'result-3',
        contextKey: 'processShape',
        contextValue: 'buddy',
      },
      {
        label: 'Many similar items can run overnight; I check a sample AM',
        nextId: 'result-6',
        contextKey: 'processShape',
        contextValue: 'batch',
      },
      {
        label: 'Two different roles must hand off (research → publish, extract → confirm)',
        nextId: 'result-5',
        contextKey: 'processShape',
        contextValue: 'handoff',
      },
    ]
  ),
};
