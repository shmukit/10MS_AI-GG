import type { DecisionQuestionNode, WorkModality } from '../agenticDecisionTreeTypes';
import { q } from './builders';

export function headacheNode(
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

export function roleNode(
  sectorKey: string,
  sectorLabel: string,
  sectorRoles: Record<string, { label: string; nextId: string }[]>
): DecisionQuestionNode {
  const roles = sectorRoles[sectorKey] ?? sectorRoles.other;
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
