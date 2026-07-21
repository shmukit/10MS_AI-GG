import { agenticDecisionNodes, AGENTIC_DECISION_START_ID, DecisionNode } from './agenticDecisionTree';

export const DECISION_TREE_KEYS = ['agentic'] as const;
export type DecisionTreeKey = (typeof DECISION_TREE_KEYS)[number];

export const DECISION_TREE_REGISTRY: Record<string, Record<string, DecisionNode>> = {
  agentic: agenticDecisionNodes,
};

export const DECISION_TREE_START_IDS: Record<string, string> = {
  agentic: AGENTIC_DECISION_START_ID,
};

export function getDecisionTreeNodes(treeKey: string): Record<string, DecisionNode> | undefined {
  return DECISION_TREE_REGISTRY[treeKey];
}

export function getDecisionTreeStartId(treeKey: string): string {
  return DECISION_TREE_START_IDS[treeKey] ?? AGENTIC_DECISION_START_ID;
}

export function getDecisionTreeNode(treeKey: string, nodeId: string): DecisionNode | undefined {
  return DECISION_TREE_REGISTRY[treeKey]?.[nodeId];
}

export function isKnownDecisionTreeKey(treeKey: string): treeKey is DecisionTreeKey {
  return treeKey in DECISION_TREE_REGISTRY;
}
