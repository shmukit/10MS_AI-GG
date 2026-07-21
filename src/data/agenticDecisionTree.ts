export interface DecisionOption {
  label: string;
  nextId: string;
}

export interface DecisionQuestionNode {
  id: string;
  type: 'question';
  question: string;
  helpText?: string;
  options: DecisionOption[];
}

export interface DecisionToolLink {
  label: string;
  url: string;
}

export interface DecisionResultNode {
  id: string;
  type: 'result';
  typeCode: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  title: string;
  summary: string;
  pros: string[];
  cons: string[];
  harness: string[];
  toolLinks: DecisionToolLink[];
  doNot: string;
  harnessCardHints: { field: string; hint: string }[];
}

export type DecisionNode = DecisionQuestionNode | DecisionResultNode;

export const AGENTIC_DECISION_START_ID = 'q-start';

export const agenticDecisionNodes: Record<string, DecisionNode> = {
  'q-start': {
    id: 'q-start',
    type: 'question',
    question: 'What kind of work are you trying to automate?',
    helpText: 'Start with your daily workflow, not the AI feature you want to buy.',
    options: [
      { label: 'A standard business workflow (most cases)', nextId: 'q-one-or-continue' },
      { label: 'Shipping or fixing code in a repository', nextId: 'result-4' },
      { label: 'Quality assurance / grading outputs', nextId: 'result-7' },
    ],
  },
  'q-one-or-continue': {
    id: 'q-one-or-continue',
    type: 'question',
    question: 'Is the output one answer, or does work continue until a business state changes?',
    helpText: 'Example: rewrite an email = one answer. Quote → PO → CRM updated = work continues.',
    options: [
      { label: 'One answer and we are done', nextId: 'q-knowledge' },
      { label: 'Work continues until something in the business changes', nextId: 'q-live-systems' },
    ],
  },
  'q-knowledge': {
    id: 'q-knowledge',
    type: 'question',
    question: 'Do people need to search policies, SOPs, or internal documents?',
    options: [
      { label: 'Yes — answer from our documents', nextId: 'result-2' },
      { label: 'No — just generate or transform text', nextId: 'result-1' },
    ],
  },
  'q-live-systems': {
    id: 'q-live-systems',
    type: 'question',
    question: 'Does it need live systems (CRM, ERP, database, email, sheets, web)?',
    options: [
      { label: 'No — mostly chat or documents', nextId: 'q-knowledge' },
      { label: 'Yes — it touches real systems', nextId: 'q-read-write' },
    ],
  },
  'q-read-write': {
    id: 'q-read-write',
    type: 'question',
    question: 'Are tools mostly READ, or do they WRITE / spend money / change records?',
    helpText: 'If writes are irreversible, you need state, limits, and human approval.',
    options: [
      { label: 'Mostly read / lookup', nextId: 'result-2' },
      { label: 'Write, spend, or change records', nextId: 'q-loop-shape' },
    ],
  },
  'q-loop-shape': {
    id: 'q-loop-shape',
    type: 'question',
    question: 'One specialist loop, or many roles / phases?',
    options: [
      { label: 'One loop with many steps (best ROI for most ops)', nextId: 'result-3' },
      { label: 'User front door + truly different specialists', nextId: 'result-5' },
      { label: 'Batch / overnight / little chat (many items)', nextId: 'result-6' },
    ],
  },
  'result-1': {
    id: 'result-1',
    type: 'result',
    typeCode: 1,
    title: 'Instruction-only (quick answer)',
    summary: 'Prompt + schema + logging. No sandbox, multi-agent, or heavy human-in-the-loop unless compliance requires it.',
    pros: ['Cheap and fast', 'Easy to evaluate', 'Great for high-volume text'],
    cons: ['Does not complete workflows', 'No tool access'],
    harness: ['Clear prompt template', 'Output schema (JSON if needed)', 'Basic logging'],
    toolLinks: [
      { label: 'ChatGPT', url: 'https://chat.openai.com' },
      { label: 'Claude', url: 'https://claude.ai' },
      { label: 'Prompt cheatsheet (workshop)', url: '/student/playbooks/agentic-decision' },
    ],
    doNot: 'Do not put a multi-agent factory on a FAQ bot or email rewrite.',
    harnessCardHints: [
      { field: 'Success', hint: 'Good answer in the right format — not a business state change' },
      { field: 'Limits', hint: 'Rate limits and PII rules if customer data is involved' },
      { field: 'Validation', hint: 'Golden test cases (20+ examples)' },
    ],
  },
  'result-2': {
    id: 'result-2',
    type: 'result',
    typeCode: 2,
    title: 'Knowledge assistant (docs / lookup)',
    summary: 'Chat over documents plus optional read-only lookups. Invest in context and light guardrails.',
    pros: ['Familiar UX', 'Lower autonomy risk', 'Good for triage and policy Q&A'],
    cons: ['Weak retrieval = hallucination', 'Vendor may call it an “agent” when it is not'],
    harness: ['Retrieval allowlist', 'Session memory', 'PII filtering', 'Rate limits'],
    toolLinks: [
      { label: 'NotebookLM', url: 'https://notebooklm.google.com' },
      { label: 'ChatGPT Projects', url: 'https://chat.openai.com' },
      { label: 'Claude Projects', url: 'https://claude.ai' },
    ],
    doNot: 'Do not add write tools without upgrading to a workflow agent with approvals.',
    harnessCardHints: [
      { field: 'Context', hint: 'Which doc corpus must be in every turn?' },
      { field: 'Tools', hint: 'Read-only CRM/ERP lookups if needed' },
      { field: 'Validation', hint: 'Spot-check answers against source docs' },
    ],
  },
  'result-3': {
    id: 'result-3',
    type: 'result',
    typeCode: 3,
    title: 'Single workflow agent',
    summary: 'One agent loop with 3–7 tools, max steps, action log, and human approval on writes.',
    pros: ['Best ROI for most business automation', 'Clear audit trail'],
    cons: ['Doom loops without step caps', 'Tool abuse without limits'],
    harness: ['Tool policy (read vs write)', 'maxSteps / wall clock', 'Traces', 'HITL on writes'],
    toolLinks: [
      { label: 'n8n (automation)', url: 'https://n8n.io' },
      { label: 'ChatGPT with actions', url: 'https://chat.openai.com' },
      { label: 'Claude Projects + tools', url: 'https://claude.ai' },
    ],
    doNot: 'Do not skip human approval on money movement or irreversible CRM updates.',
    harnessCardHints: [
      { field: 'State', hint: 'What persists between steps (case ID, draft, staging queue)?' },
      { field: 'Limits', hint: 'Cap tools at 7; kill switch for runaway loops' },
      { field: 'Validation', hint: 'Deterministic checks first; LLM judge only where needed' },
    ],
  },
  'result-4': {
    id: 'result-4',
    type: 'result',
    typeCode: 4,
    title: 'Coding / engineering harness',
    summary: 'Sandbox + tests as the definition of done. Engineering-only surface area.',
    pros: ['Deterministic “done” via tests', 'Strong feedback loop'],
    cons: ['High security cost', 'Not for general business users'],
    harness: ['Container sandbox', 'Path ACL', 'Test oracle', 'No unsandboxed shell'],
    toolLinks: [
      { label: 'Cursor', url: 'https://cursor.com' },
      { label: 'GitHub Copilot', url: 'https://github.com/features/copilot' },
    ],
    doNot: 'Never run unsandboxed shell or repo access for non-engineering workflows.',
    harnessCardHints: [
      { field: 'Validation', hint: 'Tests passing = done' },
      { field: 'Limits', hint: 'Network and filesystem boundaries' },
    ],
  },
  'result-5': {
    id: 'result-5',
    type: 'result',
    typeCode: 5,
    title: 'Multi-specialist handoff',
    summary: 'Router + 2+ roles with different tools. Use only when domains truly diverge.',
    pros: ['Clear role boundaries', 'Matches org mental model'],
    cons: ['Handoff cost', 'Cascade errors', 'Often loses to a good single agent'],
    harness: ['Routing policy', 'Message schema', 'Least-privilege tools per role'],
    toolLinks: [
      { label: 'n8n multi-step flows', url: 'https://n8n.io' },
      { label: 'Custom GPTs / Gems per role', url: 'https://chat.openai.com' },
    ],
    doNot: 'Do not build a “team of agents” for homogeneous tasks like email rewrite.',
    harnessCardHints: [
      { field: 'Context', hint: 'Structured handoff payload between roles' },
      { field: 'Validation', hint: 'Each role has its own done criteria' },
    ],
  },
  'result-6': {
    id: 'result-6',
    type: 'result',
    typeCode: 6,
    title: 'Batch / pipeline automation',
    summary: 'Durable jobs, stage contracts, staging HITL, reconcile rules. For volume and overnight work.',
    pros: ['Throughput and audit', 'Crash recovery'],
    cons: ['Higher build cost', 'Needs ops discipline'],
    harness: ['Checkpoints', 'Staging queue', 'Stage contracts', 'Reconcile on failure'],
    toolLinks: [
      { label: 'n8n', url: 'https://n8n.io' },
      { label: 'Zapier', url: 'https://zapier.com' },
      { label: 'Make', url: 'https://www.make.com' },
    ],
    doNot: 'Do not run 500-item batch jobs inside an interactive chat loop.',
    harnessCardHints: [
      { field: 'State', hint: 'Job ID, per-item status, dead-letter queue' },
      { field: 'Validation', hint: 'Reconcile counts; sample QA + judge on outputs' },
    ],
  },
  'result-7': {
    id: 'result-7',
    type: 'result',
    typeCode: 7,
    title: 'Quality judge / evaluation layer',
    summary: 'Pinned rubric + mostly deterministic checks. Layer on top of another workflow type.',
    pros: ['Assurance for high-stakes outputs', 'CI-friendly'],
    cons: ['Judge drift without pinned rubrics', 'Extra latency'],
    harness: ['Pinned rubric version', '70%+ deterministic checks', 'Separate judge from worker'],
    toolLinks: [
      { label: 'OpenAI Evals docs', url: 'https://platform.openai.com/docs/guides/evals' },
      { label: 'Promptfoo', url: 'https://www.promptfoo.dev' },
    ],
    doNot: 'Do not let the same agent grade its own output with an unpinned rubric.',
    harnessCardHints: [
      { field: 'Validation', hint: 'Faithfulness, tone, policy — define rubric SHA' },
      { field: 'Limits', hint: 'Fail closed into human review' },
    ],
  },
};

export function getDecisionNode(id: string): DecisionNode | undefined {
  return agenticDecisionNodes[id];
}
