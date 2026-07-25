/**
 * Generates external printable handout + internal .mmd chart files.
 * Run: npm run generate:decision-tree-printable
 *
 * Design: human-first. Mermaid only for overview, sectors, and follow-ups.
 * Step 3 = deduped role tables (once each). No A/B/C codes.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { AGENTIC_RESULTS } from '../src/data/agenticDecisionTreeResults';
import { HEADACHE_NODES } from '../src/data/agenticDecisionTreeNodes/headache';
import { SECTOR_ROLES } from '../src/data/agenticDecisionTreeNodes/sectorRoles';
import type { WorkModality } from '../src/data/agenticDecisionTreeTypes';

const DOCS = resolve(process.cwd(), 'docs');
const CHARTS_OUT = resolve(DOCS, 'decision-tree-charts');
const OUT_MD = resolve(DOCS, 'AGENTIC_DECISION_TREE_PRINTABLE.md');

const SECTOR_LABELS: Record<string, string> = {
  bank: 'Bank / MFI / financial services',
  rmg: 'RMG / factory / industrial',
  corporate: 'Corporate office (any industry)',
  agency: 'Agency / sales / distribution',
  education: 'Education / NGO / development',
  it: 'Software / IT / digital product',
  other: 'Other office / mixed',
};

const HEADACHE_TITLES: Record<string, string> = {
  'q-headache-planning': 'Planning / BD / reporting',
  'q-headache-accounts': 'Accounts / finance',
  'q-headache-sales': 'Sales / business development',
  'q-headache-marketing': 'Marketing / communications',
  'q-headache-hr': 'HR / admin',
  'q-headache-ops': 'Operations / customer care',
  'q-headache-lead': 'Team lead / manager',
  'q-headache-engineer': 'Software engineer / developer',
  'q-headache-qa': 'QA / evaluation / compliance',
  'q-headache-education': 'Education / teaching',
  'q-headache-general': 'General office staff',
};

/** Plain next instruction — no letter codes. */
const NEXT_PLAIN: Record<string, string> = {
  'q-finished': 'Ask yourself: one finished thing, or several steps? → Follow-ups chart',
  'q-needs-files': 'Ask: can I paste in chat, or must AI read company files? → Follow-ups chart',
  'q-process-shape': 'Ask: I approve each step / overnight batch / two roles hand off? → Follow-ups chart',
  'q-finished-chain': 'Ask: I approve each step, or two different roles hand off? → Follow-ups chart',
  'q-finished-batch': 'Your match is **Type 6** (nightly batch) — skip to Types below',
  'q-finished-code': 'Your match is **Type 4** (coding helper) — skip to Types below',
  'q-finished-code-quality': 'Your match is **Type 7** (quality checker) — skip to Types below',
};

function sanitizeId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

function mermaidLabel(text: string, max = 48): string {
  const trimmed = text.length > max ? `${text.slice(0, max - 1)}…` : text;
  return `"${trimmed.replace(/"/g, "'")}"`;
}

function escapeCell(text: string): string {
  return text.replace(/\|/g, '\\|');
}

function nextPlain(nextId: string): string {
  return NEXT_PLAIN[nextId] ?? 'Continue to the Follow-ups chart';
}

function mondayStarter(resultId: string): string {
  const r = AGENTIC_RESULTS[resultId];
  if (!r) return '—';
  const steps = r.mondayFirstStepByModality;
  const preferred: WorkModality[] = ['text', 'numbers', 'image', 'voice', 'code', 'quality', 'video'];
  for (const m of preferred) {
    if (steps[m]) return steps[m]!;
  }
  return Object.values(steps)[0] ?? '—';
}

function saveChart(filename: string, body: string): void {
  writeFileSync(resolve(CHARTS_OUT, filename), body, 'utf8');
}

function buildOverviewChart(): string {
  return [
    '%%{init: {"flowchart": {"curve": "linear", "padding": 16}} }%%',
    'flowchart LR',
    '  start(["Start"]) --> s1["① Sector"]',
    '  s1 --> s2["② Role"]',
    '  s2 --> s3["③ One task"]',
    '  s3 --> s4["④ Follow-ups"]',
    '  s4 --> s5(["⑤ Your Type 1–7"])',
    '',
    '  classDef step fill:#e8f4fc,stroke:#2563eb,stroke-width:2px',
    '  classDef end fill:#dcfce7,stroke:#16a34a,stroke-width:2px',
    '  class s1,s2,s3,s4 step',
    '  class s5 end',
  ].join('\n');
}

function buildSectorChart(): string {
  const shortSectors = [
    'Bank / MFI',
    'RMG / Factory',
    'Corporate',
    'Agency / Sales',
    'Education / NGO',
    'Software / IT',
    'Other office',
  ];
  const lines = [
    '%%{init: {"flowchart": {"curve": "linear", "padding": 12}} }%%',
    'flowchart LR',
    '  start(["① Your sector"])',
  ];
  shortSectors.forEach((label, index) => {
    lines.push(`  start --> sec_${index}[${mermaidLabel(label, 22)}]`);
  });
  return lines.join('\n');
}

/** One simple follow-up diamond chart — the only “decision” Mermaid that matters. */
function buildFollowupsChart(): string {
  return [
    '%%{init: {"flowchart": {"curve": "linear", "padding": 14}} }%%',
    'flowchart LR',
    '  q1{"When this job is finished, what do you have?"}',
    '  q1 -->|One message, doc, image, or answer| q2{"Does AI need company files?"}',
    '  q2 -->|No — paste in chat| t1(["Type 1 · Quick helper"])',
    '  q2 -->|Yes — read our PDFs / sheets / scans| t2(["Type 2 · Company brain"])',
    '  q1 -->|Several steps until sheet / inbox / status updates| q3{"How should it run?"}',
    '  q3 -->|I approve each step| t3(["Type 3 · Work buddy"])',
    '  q3 -->|Many similar items overnight| t6(["Type 6 · Batch"])',
    '  q3 -->|Two different roles hand off| t5(["Type 5 · Handoff"])',
    '',
    '  classDef q fill:#fef9c3,stroke:#ca8a04',
    '  classDef t fill:#dcfce7,stroke:#16a34a,stroke-width:2px',
    '  class q1,q2,q3 q',
    '  class t1,t2,t3,t5,t6 t',
  ].join('\n');
}

function buildRoleTaskTable(nodeId: string): string {
  const node = HEADACHE_NODES[nodeId];
  const title = HEADACHE_TITLES[nodeId] ?? nodeId;
  const rows = node.options.map((opt, index) => {
    return `| ${index + 1} | ${escapeCell(opt.label)} | ${escapeCell(opt.example ?? '—')} | ${escapeCell(nextPlain(opt.nextId))} |`;
  });

  return [
    `### ${title}`,
    '',
    '| # | Your task this week | What “done” looks like | What to do next |',
    '|---|---------------------|------------------------|-----------------|',
    ...rows,
    '',
  ].join('\n');
}

function buildStep2RoleLists(): string {
  return Object.entries(SECTOR_ROLES)
    .map(([sectorKey, roles]) => {
      const sectorLabel = SECTOR_LABELS[sectorKey] ?? sectorKey;
      const bullets = roles
        .map((role) => {
          const tableTitle = HEADACHE_TITLES[role.nextId] ?? role.label;
          return `- **${role.label}** → open the **${tableTitle}** table in Step 3`;
        })
        .join('\n');
      return `#### ${sectorLabel}\n\n${bullets}\n`;
    })
    .join('\n');
}

function buildStep3UniqueRoles(): string {
  return Object.keys(HEADACHE_NODES)
    .sort((a, b) => (HEADACHE_TITLES[a] ?? a).localeCompare(HEADACHE_TITLES[b] ?? b))
    .map(buildRoleTaskTable)
    .join('\n');
}

function buildTypesSection(): string {
  return Object.values(AGENTIC_RESULTS)
    .sort((a, b) => a.typeCode - b.typeCode)
    .map((r) => {
      const monday = escapeCell(mondayStarter(r.id));
      return `### Type ${r.typeCode} — ${r.title}

${r.plainSummary}

| | |
|--|--|
| **Safety** | ${escapeCell(r.safetyRule)} |
| **Monday (15 min)** | ${monday} |
`;
    })
    .join('\n');
}

function buildExternalMarkdown(): string {
  return `# Find the simplest AI help for your job

You will leave with **one AI pattern** (Type 1–7) that fits a real task from your week — not the flashiest tool.

**How to use (about 10 minutes)**

1. Circle your **sector** (Step 1) and **role** (Step 2).
2. In Step 3, open **only your role’s table**. Circle **one** task number.
3. Follow the **What to do next** column — either a short question (use the Follow-ups chart) or a Type number.
4. Read that Type card. Fill the worksheet on the last page.

---

## The path (left → right)

\`\`\`mermaid
${buildOverviewChart()}
\`\`\`

---

## Step 1 — Which sector are you in?

Circle one.

\`\`\`mermaid
${buildSectorChart()}
\`\`\`

---

## Step 2 — Which role is closest to your job?

Find your sector. Circle one role. Remember the **table name** it points to for Step 3.

${buildStep2RoleLists()}

---

## Step 3 — Pick one real task this week

Open **only the table for your role**. Circle one row. Read **What to do next**.

If the next column says “Follow-ups chart,” go to Step 4.  
If it already names **Type 4 / 6 / 7**, skip straight to that Type card.

${buildStep3UniqueRoles()}

---

## Step 4 — Follow-up questions → your Type

Use this chart when Step 3 sent you here. Answer the diamonds left → right.

Some tasks skip this chart and go straight to Type 4, 6, or 7 — trust the Step 3 column.

\`\`\`mermaid
${buildFollowupsChart()}
\`\`\`

**In words (if the chart does not render):**

1. **When this job is finished, what do you have?**
   - One message, doc, image, or answer → go to question 2  
   - Several steps until a sheet, inbox, or status is updated → go to question 3
2. **Does AI need company files?**
   - No, I can paste in chat → **Type 1**  
   - Yes, it must read our PDFs / sheets / scans → **Type 2**
3. **How should multi-step work run?**
   - I approve each step → **Type 3**  
   - Many similar items overnight → **Type 6**  
   - Two different roles hand off → **Type 5**

---

## Step 5 — Your Type (read the card, then act)

${buildTypesSection()}

---

## Your worksheet

| | Write here |
|--|------------|
| My sector | |
| My role | |
| Task # (from my table) | |
| My **Type 1–7** | |
| **Monday 15-minute action** (copy from your Type card) | |
| **Safety check** before I send / publish | |
`;
}

function writeInternalCharts(): void {
  mkdirSync(CHARTS_OUT, { recursive: true });
  saveChart('01-overview.mmd', buildOverviewChart());
  saveChart('02-sectors.mmd', buildSectorChart());
  // Role charts kept for facilitators who want visuals — not embedded in external MD
  Object.entries(SECTOR_ROLES).forEach(([key, roles]) => {
    const hub = sanitizeId(`hub_${key}`);
    const lines = [
      '%%{init: {"flowchart": {"curve": "linear", "padding": 12}} }%%',
      'flowchart LR',
      `  ${hub}(["${SECTOR_LABELS[key] ?? key}"])`,
    ];
    roles.forEach((role, index) => {
      const roleId = sanitizeId(`${key}_r${index}`);
      const short = role.label.length > 36 ? `${role.label.slice(0, 35)}…` : role.label;
      lines.push(`  ${hub} --> ${roleId}[${mermaidLabel(short, 36)}]`);
    });
    saveChart(`02-roles-${key}.mmd`, lines.join('\n'));
  });
  saveChart('03-followups-to-results.mmd', buildFollowupsChart());
  const resultsLines = [
    '%%{init: {"flowchart": {"curve": "linear", "padding": 12}} }%%',
    'flowchart LR',
    '  root(["Types 1–7"])',
  ];
  for (const r of Object.values(AGENTIC_RESULTS).sort((a, b) => a.typeCode - b.typeCode)) {
    resultsLines.push(`  root --> ${sanitizeId(r.id)}[${mermaidLabel(`T${r.typeCode}: ${r.title}`, 28)}]`);
  }
  saveChart('04-results-types.mmd', resultsLines.join('\n'));
}

function main() {
  writeInternalCharts();
  writeFileSync(OUT_MD, buildExternalMarkdown(), 'utf8');
  console.log(`Wrote ${OUT_MD}`);
  console.log(`Wrote internal charts in ${CHARTS_OUT}/`);
}

main();
