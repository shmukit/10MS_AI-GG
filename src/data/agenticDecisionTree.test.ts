import { describe, expect, it } from 'vitest';
import {
  AGENTIC_DECISION_START_ID,
  agenticDecisionNodes,
  buildAgenticDecisionNodes,
} from './agenticDecisionTree';
import type { DecisionNode, DecisionQuestionNode, DecisionResultNode, WorkModality } from './agenticDecisionTreeTypes';

function isQuestion(node: DecisionNode): node is DecisionQuestionNode {
  return node.type === 'question';
}

function isResult(node: DecisionNode): node is DecisionResultNode {
  return node.type === 'result';
}

function collectPaths(
  nodes: Record<string, DecisionNode>,
  startId: string,
  maxDepth = 20
): string[][] {
  const paths: string[][] = [];

  function walk(nodeId: string, trail: string[], depth: number) {
    if (depth > maxDepth) {
      throw new Error(`Path exceeded max depth at ${nodeId}`);
    }
    const node = nodes[nodeId];
    if (!node) {
      throw new Error(`Missing node: ${nodeId}`);
    }
    const nextTrail = [...trail, nodeId];
    if (isQuestion(node)) {
      for (const option of node.options) {
        walk(option.nextId, nextTrail, depth + 1);
      }
      return;
    }
    if (isResult(node)) {
      paths.push(nextTrail);
    }
  }

  walk(startId, [], 0);
  return paths;
}

describe('agenticDecisionTree', () => {
  const nodes = agenticDecisionNodes;

  it('builds the same node map as the exported constant', () => {
    expect(buildAgenticDecisionNodes()).toEqual(nodes);
  });

  it('starts at q-sector', () => {
    expect(AGENTIC_DECISION_START_ID).toBe('q-sector');
    expect(nodes[AGENTIC_DECISION_START_ID]?.type).toBe('question');
  });

  it('resolves every nextId to an existing node', () => {
    const missing: string[] = [];
    for (const node of Object.values(nodes)) {
      if (node.type !== 'question') continue;
      for (const option of node.options) {
        if (!nodes[option.nextId]) {
          missing.push(`${node.id} → ${option.nextId}`);
        }
      }
    }
    expect(missing, missing.join('\n')).toEqual([]);
  });

  it('reaches a result from every path from start', () => {
    const paths = collectPaths(nodes, AGENTIC_DECISION_START_ID);
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      const last = nodes[path[path.length - 1]];
      expect(last?.type).toBe('result');
    }
  });

  it('includes all seven result types', () => {
    const paths = collectPaths(nodes, AGENTIC_DECISION_START_ID);
    const typeCodes = new Set(
      paths.map((path) => {
        const last = nodes[path[path.length - 1]];
        return last.type === 'result' ? last.typeCode : null;
      })
    );
    expect(typeCodes).toEqual(new Set([1, 2, 3, 4, 5, 6, 7]));
  });

  it('covers office multimodal, software builder, and QA sample paths', () => {
    const paths = collectPaths(nodes, AGENTIC_DECISION_START_ID);

    const findPath = (predicate: (path: string[]) => boolean) =>
      paths.find(predicate);

    const officeNumbers = findPath((path) =>
      path.includes('q-role-bank') &&
      path.includes('q-headache-accounts') &&
      path.some((id) => {
        const n = nodes[id];
        return n.type === 'question' && n.options.some((o) => o.contextValue === 'bank-sms-reconcile');
      })
    );
    expect(officeNumbers).toBeDefined();

    const builder = findPath((path) =>
      path.includes('q-role-it') &&
      path.includes('q-headache-engineer') &&
      path.includes('result-4')
    );
    expect(builder).toBeDefined();

    const qa = findPath((path) =>
      path.includes('q-headache-qa') && path.includes('result-7')
    );
    expect(qa).toBeDefined();

    const modalities = new Set<WorkModality>();
    for (const node of Object.values(nodes)) {
      if (node.type !== 'question') continue;
      for (const option of node.options) {
        if (option.modality) modalities.add(option.modality);
      }
    }
    for (const m of ['text', 'numbers', 'image', 'voice', 'video', 'code', 'quality'] as WorkModality[]) {
      expect(modalities.has(m), `missing modality ${m}`).toBe(true);
    }

    const planningPaths = paths.filter((path) => path.includes('q-headache-planning'));
    expect(planningPaths.length).toBeGreaterThan(0);

    const planningNode = nodes['q-headache-planning'];
    expect(planningNode?.type).toBe('question');
    if (planningNode?.type === 'question') {
      expect(planningNode.options.some((o) => o.contextValue === 'presentation-deck')).toBe(true);
    }

    const scenarioKeys = new Set<string>();
    for (const node of Object.values(nodes)) {
      if (node.type !== 'question') continue;
      for (const option of node.options) {
        if (option.contextValue) scenarioKeys.add(option.contextValue);
      }
    }
    for (const key of [
      'mgmt-report',
      'presentation-deck',
      'bd-strategy',
      'data-analysis',
      'data-cleaning',
      'doc-organization',
      'doc-digitization',
      'demo-walkthrough',
      'office-presentation',
      'office-data-analysis',
      'office-digitization',
      'demo-prototype',
    ]) {
      expect(scenarioKeys.has(key), `missing scenario ${key}`).toBe(true);
    }
  });

  it('uses unique React keys per option on nodes with shared nextId targets', () => {
    for (const node of Object.values(nodes)) {
      if (node.type !== 'question') continue;
      const keys = node.options.map(
        (option, index) => `${node.id}-${option.contextValue ?? option.label}-${index}`
      );
      expect(new Set(keys).size, `${node.id} has duplicate option keys`).toBe(keys.length);
    }
  });
});
