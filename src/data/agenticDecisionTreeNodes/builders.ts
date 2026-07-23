import type { DecisionQuestionNode } from '../agenticDecisionTreeTypes';

export function q(
  id: string,
  stepLabel: string,
  question: string,
  helpText: string,
  options: DecisionQuestionNode['options'],
  examples?: string[]
): DecisionQuestionNode {
  return { id, type: 'question', stepLabel, question, helpText, options, examples };
}
