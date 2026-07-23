import type { DecisionNode, DecisionQuestionNode, WorkModality } from './agenticDecisionTreeTypes';
import { AGENTIC_RESULTS } from './agenticDecisionTreeResults';

export const AGENTIC_DECISION_START_ID = 'q-sector';

const SECTOR_ROLES: Record<string, { label: string; nextId: string }[]> = {
  bank: [
    { label: 'Accounts / finance', nextId: 'q-headache-accounts' },
    { label: 'Sales / relationship', nextId: 'q-headache-sales' },
    { label: 'Strategy / research / planning', nextId: 'q-headache-planning' },
    { label: 'Operations / customer service', nextId: 'q-headache-ops' },
    { label: 'Team lead / manager', nextId: 'q-headache-lead' },
    { label: 'QA / compliance checker', nextId: 'q-headache-qa' },
  ],
  rmg: [
    { label: 'Accounts / finance', nextId: 'q-headache-accounts' },
    { label: 'HR / admin', nextId: 'q-headache-hr' },
    { label: 'Operations / floor coordination', nextId: 'q-headache-ops' },
    { label: 'Planning / reporting', nextId: 'q-headache-planning' },
    { label: 'Team lead / manager', nextId: 'q-headache-lead' },
  ],
  corporate: [
    { label: 'Accounts / finance', nextId: 'q-headache-accounts' },
    { label: 'Sales / business development', nextId: 'q-headache-sales' },
    { label: 'Marketing / communications', nextId: 'q-headache-marketing' },
    { label: 'Strategy / planning / research', nextId: 'q-headache-planning' },
    { label: 'HR / admin', nextId: 'q-headache-hr' },
    { label: 'Operations / customer care', nextId: 'q-headache-ops' },
    { label: 'Team lead / manager', nextId: 'q-headache-lead' },
    { label: 'QA / evaluation', nextId: 'q-headache-qa' },
  ],
  agency: [
    { label: 'Marketing / creative', nextId: 'q-headache-marketing' },
    { label: 'Sales / client servicing', nextId: 'q-headache-sales' },
    { label: 'Strategy / BD / planning', nextId: 'q-headache-planning' },
    { label: 'Accounts / billing', nextId: 'q-headache-accounts' },
    { label: 'Operations', nextId: 'q-headache-ops' },
  ],
  education: [
    { label: 'Teacher / program staff', nextId: 'q-headache-education' },
    { label: 'Program manager / M&E / reporting', nextId: 'q-headache-planning' },
    { label: 'HR / admin', nextId: 'q-headache-hr' },
    { label: 'Operations / student support', nextId: 'q-headache-ops' },
    { label: 'QA / assessment checker', nextId: 'q-headache-qa' },
  ],
  it: [
    { label: 'Software engineer / developer', nextId: 'q-headache-engineer' },
    { label: 'QA / test engineer', nextId: 'q-headache-qa' },
    { label: 'Product / business analyst', nextId: 'q-headache-planning' },
    { label: 'Team lead / engineering manager', nextId: 'q-headache-lead' },
    { label: 'Sales / presales (IT services)', nextId: 'q-headache-sales' },
  ],
  other: [
    { label: 'General office staff', nextId: 'q-headache-general' },
    { label: 'Planning / reporting / admin support', nextId: 'q-headache-planning' },
    { label: 'Accounts / finance', nextId: 'q-headache-accounts' },
    { label: 'HR / admin', nextId: 'q-headache-hr' },
    { label: 'Team lead / manager', nextId: 'q-headache-lead' },
  ],
};

function q(
  id: string,
  stepLabel: string,
  question: string,
  helpText: string,
  options: DecisionQuestionNode['options'],
  examples?: string[]
): DecisionQuestionNode {
  return { id, type: 'question', stepLabel, question, helpText, options, examples };
}

function headacheNode(
  id: string,
  roleLabel: string,
  items: { label: string; example: string; modality: WorkModality; nextId: string; contextValue: string }[]
): DecisionQuestionNode {
  return q(
    id,
    'Your task',
    'What is the one work headache you want help with this week?',
    `Pick the closest match to your real ${roleLabel} work. Examples show what “done” might look like.`,
    items.map((item) => ({
      label: item.label,
      nextId: item.nextId,
      contextKey: 'headache' as const,
      contextValue: item.contextValue,
      modality: item.modality,
      example: item.example,
    })),
    items.map((i) => i.example)
  );
}

const HEADACHE_NODES: Record<string, DecisionQuestionNode> = {
  'q-headache-planning': headacheNode('q-headache-planning', 'planning / BD / reporting', [
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
  ]),
  'q-headache-accounts': headacheNode('q-headache-accounts', 'accounts/finance', [
    {
      label: 'Match bank / bKash / Nagad SMS to Excel',
      example: '40 SMS lines vs one sheet—find what does not match before month-end.',
      modality: 'numbers',
      nextId: 'q-finished',
      contextValue: 'bank-sms-reconcile',
    },
    {
      label: 'Pull amounts from challan or receipt photos into a sheet',
      example: 'Dealer challan photos → correct amount column for outstanding report.',
      modality: 'image',
      nextId: 'q-finished',
      contextValue: 'challan-extract',
    },
    {
      label: 'Summarize a long audit or policy PDF',
      example: '30-page PDF → bullet summary with page references for your manager.',
      modality: 'text',
      nextId: 'q-needs-files',
      contextValue: 'audit-summary',
    },
    {
      label: 'Check payroll or incentive sheet before send',
      example: 'Compare two versions; flag wrong totals or missing names.',
      modality: 'numbers',
      nextId: 'q-finished',
      contextValue: 'payroll-check',
    },
    {
      label: 'Monthly financial report narrative from the numbers',
      example: 'P&L + cashflow tabs → plain-language summary for CFO with 3 risks called out.',
      modality: 'text',
      nextId: 'q-needs-files',
      contextValue: 'finance-report',
    },
    {
      label: 'Analyze expense or revenue trends in Excel',
      example: '12 months of GL export → top cost drivers and one chart-ready table.',
      modality: 'numbers',
      nextId: 'q-finished',
      contextValue: 'finance-analysis',
    },
    {
      label: 'Clean transaction export before reconciliation',
      example: 'Raw bank/ERP dump → standard columns, no duplicates, ready for VLOOKUP.',
      modality: 'numbers',
      nextId: 'q-finished',
      contextValue: 'finance-data-clean',
    },
  ]),
  'q-headache-sales': headacheNode('q-headache-sales', 'sales', [
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
  ]),
  'q-headache-marketing': headacheNode('q-headache-marketing', 'marketing', [
    {
      label: 'Rewrite ad copy or Facebook post in clear Bangla/English',
      example: 'Campaign brief → 3 caption options under 150 words.',
      modality: 'text',
      nextId: 'q-finished',
      contextValue: 'ad-copy',
    },
    {
      label: 'Fix or resize creatives for social',
      example: 'Old banner → square crop + text readable on mobile.',
      modality: 'image',
      nextId: 'q-finished',
      contextValue: 'social-creative',
    },
    {
      label: 'Plan a short product video from a brief',
      example: 'Bullets → 30s script + shot list for intern/editor.',
      modality: 'video',
      nextId: 'q-finished',
      contextValue: 'video-brief',
    },
    {
      label: 'Check claims before publish (compliance pass)',
      example: 'Draft post vs brand rules—flag risky lines before go-live.',
      modality: 'quality',
      nextId: 'q-finished-code-quality',
      contextValue: 'marketing-qa',
    },
    {
      label: 'Campaign results presentation for leadership',
      example: 'Reach, spend, leads → slide outline + speaker notes for Friday review.',
      modality: 'text',
      nextId: 'q-finished',
      contextValue: 'campaign-presentation',
    },
    {
      label: 'Organize brand assets and old campaign files',
      example: 'Mixed Drive folders → one library with naming rules and “approved” vs “draft”.',
      modality: 'text',
      nextId: 'q-finished-chain',
      contextValue: 'marketing-doc-org',
    },
  ]),
  'q-headache-hr': headacheNode('q-headache-hr', 'HR/admin', [
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
  ]),
  'q-headache-ops': headacheNode('q-headache-ops', 'operations', [
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
  ]),
  'q-headache-lead': headacheNode('q-headache-lead', 'team lead', [
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
  ]),
  'q-headache-engineer': headacheNode('q-headache-engineer', 'software', [
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
  ]),
  'q-headache-qa': headacheNode('q-headache-qa', 'QA/evaluation', [
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
      label: 'Build deterministic checks before LLM judge',
      example: 'Regex/totals first; AI only on ambiguous 10%.',
      modality: 'quality',
      nextId: 'q-finished-code-quality',
      contextValue: 'deterministic-qa',
    },
  ]),
  'q-headache-education': headacheNode('q-headache-education', 'education', [
    {
      label: 'Lesson plan or facilitator notes from syllabus',
      example: 'Syllabus PDF → session plan with activities and timing.',
      modality: 'text',
      nextId: 'q-needs-files',
      contextValue: 'lesson-plan',
    },
    {
      label: 'Feedback on student assignments (rubric-based)',
      example: '10 submissions scored against pinned rubric; you override edge cases.',
      modality: 'quality',
      nextId: 'q-finished-code-quality',
      contextValue: 'grade-assignments',
    },
    {
      label: 'Parent or student message drafts in Bangla',
      example: 'Bullet facts → polite message; you send from official account.',
      modality: 'text',
      nextId: 'q-finished',
      contextValue: 'parent-message',
    },
    {
      label: 'Donor or management program report',
      example: 'Activity data + stories → impact report with numbers you can verify.',
      modality: 'text',
      nextId: 'q-needs-files',
      contextValue: 'program-report',
    },
    {
      label: 'Training presentation from module outline',
      example: 'Syllabus bullets → slide titles, activities, and timing for a 2-hour session.',
      modality: 'text',
      nextId: 'q-finished',
      contextValue: 'training-presentation',
    },
    {
      label: 'Clean student or beneficiary data export',
      example: 'Enrollment dump → deduped names, correct grades/districts for M&E sheet.',
      modality: 'numbers',
      nextId: 'q-finished',
      contextValue: 'education-data-clean',
    },
  ]),
  'q-headache-general': headacheNode('q-headache-general', 'office', [
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
  ]),
};

const SHARED_QUESTIONS: Record<string, DecisionQuestionNode> = {
  'q-sector': q(
    'q-sector',
    'Sector',
    'Which sector best describes where you work?',
    'This helps us show examples that feel like your office—not Silicon Valley.',
    [
      { label: 'Bank / MFI / financial services', nextId: 'q-role-bank', contextKey: 'sector', contextValue: 'Bank / MFI' },
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

function roleNode(sectorKey: string, sectorLabel: string): DecisionQuestionNode {
  const roles = SECTOR_ROLES[sectorKey] ?? SECTOR_ROLES.other;
  return q(
    `q-role-${sectorKey}`,
    'Role',
    'What is your main job most days?',
    `Choose the role closest to yours in ${sectorLabel}. Software builders and QA checkers belong here too.`,
    roles.map((r) => ({
      label: r.label,
      nextId: r.nextId,
      contextKey: 'role' as const,
      contextValue: r.label,
    }))
  );
}

export function buildAgenticDecisionNodes(): Record<string, DecisionNode> {
  return {
    ...SHARED_QUESTIONS,
    ...HEADACHE_NODES,
    ...AGENTIC_RESULTS,
    'q-role-bank': roleNode('bank', 'bank / MFI'),
    'q-role-rmg': roleNode('rmg', 'RMG / factory'),
    'q-role-corporate': roleNode('corporate', 'corporate office'),
    'q-role-agency': roleNode('agency', 'agency / sales'),
    'q-role-education': roleNode('education', 'education / NGO'),
    'q-role-it': roleNode('it', 'software / IT'),
    'q-role-other': roleNode('other', 'your office'),
  };
}
