export type {
  WorkModality,
  DecisionOption,
  DecisionQuestionNode,
  DecisionResultNode,
  DecisionToolLink,
  DecisionNode,
  PathContext,
} from './agenticDecisionTreeTypes';

export { MODALITY_LABELS } from './agenticDecisionTreeTypes';

export { AGENTIC_DECISION_START_ID, buildAgenticDecisionNodes } from './agenticDecisionTreeNodes';

import type {
  DecisionNode,
  DecisionResultNode,
  PathContext,
  WorkModality,
} from './agenticDecisionTreeTypes';
import { AGENTIC_DECISION_START_ID, buildAgenticDecisionNodes } from './agenticDecisionTreeNodes';

export const agenticDecisionNodes: Record<string, DecisionNode> = buildAgenticDecisionNodes();

export function getDecisionNode(id: string): DecisionNode | undefined {
  return agenticDecisionNodes[id];
}

export function extractPathContext(
  treeKey: string,
  path: string[],
  getNode: (treeKey: string, id: string) => DecisionNode | undefined
): PathContext {
  const ctx: PathContext = {};
  for (let i = 0; i < path.length - 1; i++) {
    const node = getNode(treeKey, path[i]);
    const nextId = path[i + 1];
    if (!node || node.type !== 'question') continue;
    const chosen = node.options.find((o) => o.nextId === nextId);
    if (!chosen) continue;
    if (chosen.contextKey === 'sector') ctx.sector = chosen.contextValue ?? chosen.label;
    if (chosen.contextKey === 'role') ctx.role = chosen.contextValue ?? chosen.label;
    if (chosen.contextKey === 'headache') {
      ctx.headache = chosen.contextValue ?? chosen.label;
      ctx.modality = chosen.modality;
    }
    if (chosen.contextKey === 'finished') ctx.finished = chosen.contextValue ?? chosen.label;
    if (chosen.contextKey === 'processShape') ctx.processShape = chosen.contextValue ?? chosen.label;
    if (chosen.modality && !ctx.modality) ctx.modality = chosen.modality;
  }
  return ctx;
}

export function resolveMondayStep(result: DecisionResultNode, modality?: WorkModality): string {
  const key = modality ?? 'text';
  return (
    result.mondayFirstStepByModality[key] ??
    result.mondayFirstStepByModality.text ??
    'Open your usual AI tool, paste your real work sample, ask for one improvement, and review before sending.'
  );
}

export function resolveToolsForModality(
  result: DecisionResultNode,
  modality?: WorkModality
): import('./agenticDecisionTreeTypes').DecisionToolLink[] {
  const key = modality ?? 'text';
  return result.toolsByModality[key] ?? result.toolLinks;
}

export function buildWhyForYou(ctx: PathContext): string {
  const parts = [
    ctx.sector && `You work in ${ctx.sector}.`,
    ctx.role && `Your role is ${ctx.role}.`,
    ctx.headache && `This week you want help with: ${humanizeHeadache(ctx.headache)}.`,
    ctx.modality && `That is mainly ${modalityPlain(ctx.modality)} work.`,
  ].filter(Boolean);
  return parts.join(' ') || 'You picked a real task from your week—we matched the simplest AI setup that fits.';
}

function humanizeHeadache(key: string): string {
  return key.replace(/-/g, ' ');
}

function modalityPlain(m: WorkModality): string {
  const map: Record<WorkModality, string> = {
    text: 'writing and documents',
    numbers: 'numbers and spreadsheets',
    image: 'photos and scans',
    voice: 'voice and calls',
    video: 'video and clips',
    code: 'software and code',
    quality: 'checking quality',
  };
  return map[m];
}

export { AGENTIC_DECISION_START_ID as defaultStartId };
