-- Forward-fix for sql/20260721_become_manager_of_ai_agents_roadmap.sql
-- Use this script if the original seed failed in Supabase SQL Editor with errors like
-- relation "components" or relation "steps" does not exist (string-literal parsing).
-- Idempotent: safe to re-run after partial inserts.
-- Includes prerequisite column adds so it runs standalone in Supabase SQL Editor.

-- ============ PREREQUISITES (idempotent) ============
ALTER TABLE roadmaps
  ADD COLUMN IF NOT EXISTS node_unit_label VARCHAR(50) NOT NULL DEFAULT 'Week';

ALTER TABLE roadmaps
  ADD COLUMN IF NOT EXISTS slides_url TEXT;

ALTER TABLE roadmaps
  ADD COLUMN IF NOT EXISTS decision_tree_enabled BOOLEAN NOT NULL DEFAULT false;

-- ============ ROADMAP ============
INSERT INTO roadmaps (title, description, total_weeks, node_unit_label, difficulty_level, category, is_active, decision_tree_enabled)
SELECT
  $$Become a Manager of AI Agents$$,
  $$Single-day workshop for professionals exploring AI. Three sessions: foundations and prompting, break down business workflows and choose the right AI pattern, manage a supervised AI workforce.$$,
  3,
  $$Session$$,
  $$beginner$$,
  $$AI Leadership$$,
  true,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM roadmaps WHERE title = $$Become a Manager of AI Agents$$
);

-- Ensure flags on existing row if roadmap was inserted in a prior partial run
UPDATE roadmaps
SET
  node_unit_label = $$Session$$,
  decision_tree_enabled = true,
  total_weeks = 3
WHERE title = $$Become a Manager of AI Agents$$;

-- ============ SESSION NODES ============
INSERT INTO roadmap_weeks (roadmap_id, week_number, title, description, domain)
SELECT r.id, 1,
  $$Session 1: Foundations - Work WITH AI$$,
  $$For novices and explorers: what AI is, where the LLM thinking brain fits, Prompting Properly (levels), and your first AI employee.$$,
  $$AI Collaboration$$
FROM roadmaps r
WHERE r.title = $$Become a Manager of AI Agents$$
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_weeks w
    WHERE w.roadmap_id = r.id AND w.week_number = 1
  );

INSERT INTO roadmap_weeks (roadmap_id, week_number, title, description, domain)
SELECT r.id, 2,
  $$Session 2: Business Ops - Break Down and Decide$$,
  $$Map daily workflows into phases: rule-based automation, LLM thinking, interactive decision tree, then build the simplest fitting assistant.$$,
  $$AI Workflows$$
FROM roadmaps r
WHERE r.title = $$Become a Manager of AI Agents$$
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_weeks w
    WHERE w.roadmap_id = r.id AND w.week_number = 2
  );

INSERT INTO roadmap_weeks (roadmap_id, week_number, title, description, domain)
SELECT r.id, 3,
  $$Session 3: Manage - Work BY AI$$,
  $$Design your AI workforce, complete the Harness Card, failure lab, capstone redesign, demo day, and 30-day adoption plan.$$,
  $$AI Workforce Management$$
FROM roadmaps r
WHERE r.title = $$Become a Manager of AI Agents$$
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_weeks w
    WHERE w.roadmap_id = r.id AND w.week_number = 3
  );

-- ============ SESSION 1 TASKS ============
INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$What AI actually is (and isn't)$$,
  $$AI vs traditional software; LLMs in plain language. Facilitator frames: chat is instruction plus chat; workflow agents are model plus harness.$$,
  $$watch$$,
  ARRAY[$$https://www.youtube.com/watch?v=placeholder-ai-basics$$],
  15, 10, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 1
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t WHERE t.week_id = w.id AND t.task_name = $$What AI actually is (and isn't)$$
  );

INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$The thinking brain: where LLMs help$$,
  $$LLM = think, brainstorm, plan, draft, critique - not the whole workflow. Contrast with calculators, forms, databases, and rules engines.$$,
  $$attend$$,
  ARRAY[$$https://docs.google.com/document/d/placeholder-thinking-brain$$],
  20, 10, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 1
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t WHERE t.week_id = w.id AND t.task_name = $$The thinking brain: where LLMs help$$
  );

INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$Chat vs assistant vs agent$$,
  $$Same model, different job design. When a simple conversation is enough vs when you need a structured workflow.$$,
  $$watch$$,
  ARRAY[$$https://www.youtube.com/watch?v=placeholder-chat-vs-agent$$],
  15, 10, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 1
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t WHERE t.week_id = w.id AND t.task_name = $$Chat vs assistant vs agent$$
  );

INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$Prompting Properly$$,
  $$Levels: zero-shot, role/context, structured output (format and constraints), few-shot/examples, then verify and iterate. Deliverable: personal prompt cheatsheet.$$,
  $$project$$,
  ARRAY[$$https://docs.google.com/document/d/placeholder-prompt-cheatsheet$$],
  30, 15, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 1
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t WHERE t.week_id = w.id AND t.task_name = $$Prompting Properly$$
  );

INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$Tool landscape (light)$$,
  $$Run the same small task in 2-3 tools (ChatGPT, Claude, Perplexity). Notice differences in tone, citations, and speed.$$,
  $$project$$,
  ARRAY[$$https://chat.openai.com$$, $$https://claude.ai$$, $$https://www.perplexity.ai$$],
  20, 10, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 1
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t WHERE t.week_id = w.id AND t.task_name = $$Tool landscape (light)$$
  );

INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$Meet your first AI employee$$,
  $$Configure a simple Executive Assistant in ChatGPT Projects or Claude Projects for your own role.$$,
  $$project$$,
  ARRAY[$$https://chat.openai.com$$, $$https://claude.ai$$],
  25, 15, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 1
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t WHERE t.week_id = w.id AND t.task_name = $$Meet your first AI employee$$
  );

INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$Reflection: opportunity map$$,
  $$List 5 repetitive tasks. Mark each: needs LLM thinking vs rule-based automation vs must stay human.$$,
  $$written$$,
  ARRAY[$$https://docs.google.com/document/d/placeholder-opportunity-map$$],
  15, 10, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 1
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t WHERE t.week_id = w.id AND t.task_name = $$Reflection: opportunity map$$
  );

-- ============ SESSION 2 TASKS ============
INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$Day-to-day business workflow catalog$$,
  $$Families: intake/triage, research and brief, document ops, support, sales/BD, finance, HR/legal, content/data factory - in business language.$$,
  $$attend$$,
  ARRAY[$$https://docs.google.com/document/d/placeholder-workflow-catalog$$],
  20, 10, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 2
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t WHERE t.week_id = w.id AND t.task_name = $$Day-to-day business workflow catalog$$
  );

INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$Break a workflow into phases$$,
  $$Pick one real process. Map each phase. Tag each: Deterministic/rule-based vs LLM thinking (interpret, plan, draft, critique) vs Human must decide.$$,
  $$project$$,
  ARRAY[$$https://docs.google.com/document/d/placeholder-workflow-canvas$$],
  30, 15, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 2
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t
    WHERE t.week_id = w.id AND t.task_name IN ($$Break a workflow into phases$$, $$Break a workflow into steps$$)
  );

INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$Where the thinking brain sits$$,
  $$Annotate your workflow map: which phases call an LLM, which stay scripts/rules/UI, which need human approval.$$,
  $$project$$,
  ARRAY[$$https://docs.google.com/document/d/placeholder-workflow-canvas$$],
  20, 10, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 2
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t WHERE t.week_id = w.id AND t.task_name = $$Where the thinking brain sits$$
  );

INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$Interactive decision tree$$,
  $$Use the in-app decision tree to classify your process and get pattern plus tool recommendations. Save your result for the Harness Card.$$,
  $$project$$,
  ARRAY[$$/student/roadmap/become_a_manager_of_ai_agents?view=decision-tree$$],
  25, 15, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 2
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t WHERE t.week_id = w.id AND t.task_name = $$Interactive decision tree$$
  );

INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$Build the simplest fitting assistant$$,
  $$Only as complex as the tree says - usually a knowledge assistant or single workflow helper. Simplest solution that works.$$,
  $$project$$,
  ARRAY[$$https://chat.openai.com$$, $$https://claude.ai$$, $$https://notebooklm.google.com$$],
  25, 15, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 2
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t WHERE t.week_id = w.id AND t.task_name = $$Build the simplest fitting assistant$$
  );

INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$Reflection: time and risk$$,
  $$Estimate hours saved vs risk if under- or over-automated. What stays human?$$,
  $$written$$,
  ARRAY[$$https://docs.google.com/document/d/placeholder-reflection-time-risk$$],
  10, 10, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 2
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t WHERE t.week_id = w.id AND t.task_name = $$Reflection: time and risk$$
  );

-- ============ SESSION 3 TASKS ============
INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$Design your AI workforce$$,
  $$Org chart of AI employees for your role: researcher, drafter, reviewer - thinking jobs, not engineering jargon.$$,
  $$project$$,
  ARRAY[$$https://docs.google.com/document/d/placeholder-ai-workforce-canvas$$],
  25, 15, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 3
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t WHERE t.week_id = w.id AND t.task_name = $$Design your AI workforce$$
  );

INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$Complete the Harness Card$$,
  $$Workflow, tools, context, what persists, limits/approvals, how you know it is done.$$,
  $$project$$,
  ARRAY[$$https://docs.google.com/document/d/placeholder-harness-card$$],
  20, 15, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 3
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t WHERE t.week_id = w.id AND t.task_name = $$Complete the Harness Card$$
  );

INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$Failure lab$$,
  $$Intentionally break workflows: missing context, hallucination, wrong tool, no approval, doom loop. Document what failed and why.$$,
  $$project$$,
  ARRAY[$$https://docs.google.com/document/d/placeholder-failure-lab$$],
  20, 10, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 3
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t WHERE t.week_id = w.id AND t.task_name = $$Failure lab$$
  );

INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$Capstone: redesign one real workflow$$,
  $$Current process, pain points, AI opportunities (rule vs LLM vs human), revised workflow, review points, expected ROI.$$,
  $$project$$,
  ARRAY[$$https://docs.google.com/document/d/placeholder-capstone-template$$],
  35, 20, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 3
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t WHERE t.week_id = w.id AND t.task_name = $$Capstone: redesign one real workflow$$
  );

INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$Demo day + peer review$$,
  $$5-minute demo of your capstone. Peer feedback and voting.$$,
  $$attend$$,
  ARRAY[$$https://docs.google.com/forms/d/placeholder-demo-feedback$$],
  30, 15, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 3
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t WHERE t.week_id = w.id AND t.task_name = $$Demo day + peer review$$
  );

INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, estimated_hours, points, is_required)
SELECT w.id,
  $$30-day AI adoption plan$$,
  $$What you will try at work over the next month. Start simple; promote complexity only when the decision tree says so.$$,
  $$written$$,
  ARRAY[$$https://docs.google.com/document/d/placeholder-adoption-plan$$],
  15, 10, true
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 3
  AND NOT EXISTS (
    SELECT 1 FROM roadmap_tasks t WHERE t.week_id = w.id AND t.task_name = $$30-day AI adoption plan$$
  );

-- ============ VERIFICATION ============
-- SELECT id, title, node_unit_label, total_weeks, slides_url FROM roadmaps WHERE title = 'Become a Manager of AI Agents';
-- SELECT w.week_number, w.title, w.domain, COUNT(t.id) AS task_count
-- FROM roadmap_weeks w
-- JOIN roadmaps r ON r.id = w.roadmap_id
-- LEFT JOIN roadmap_tasks t ON t.week_id = w.id
-- WHERE r.title = 'Become a Manager of AI Agents'
-- GROUP BY w.week_number, w.title, w.domain
-- ORDER BY w.week_number;
-- SELECT t.task_name, t.task_type, t.estimated_hours
-- FROM roadmap_tasks t
-- JOIN roadmap_weeks w ON w.id = t.week_id
-- JOIN roadmaps r ON r.id = w.roadmap_id
-- WHERE r.title = 'Become a Manager of AI Agents'
-- ORDER BY w.week_number, t.task_name;
