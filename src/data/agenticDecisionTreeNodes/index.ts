import type { DecisionNode } from '../agenticDecisionTreeTypes';
import { AGENTIC_RESULTS } from '../agenticDecisionTreeResults';
import { roleNode } from './headacheNodeBuilder';
import { HEADACHE_NODES } from './headache';
import { SECTOR_ROLES } from './sectorRoles';
import { SHARED_QUESTIONS } from './sharedQuestions';

export const AGENTIC_DECISION_START_ID = 'q-sector';

export function buildAgenticDecisionNodes(): Record<string, DecisionNode> {
  return {
    ...SHARED_QUESTIONS,
    ...HEADACHE_NODES,
    ...AGENTIC_RESULTS,
    'q-role-bank': roleNode('bank', 'bank / MFI', SECTOR_ROLES),
    'q-role-rmg': roleNode('rmg', 'RMG / factory', SECTOR_ROLES),
    'q-role-corporate': roleNode('corporate', 'corporate office', SECTOR_ROLES),
    'q-role-agency': roleNode('agency', 'agency / sales', SECTOR_ROLES),
    'q-role-education': roleNode('education', 'education / NGO', SECTOR_ROLES),
    'q-role-it': roleNode('it', 'software / IT', SECTOR_ROLES),
    'q-role-other': roleNode('other', 'your office', SECTOR_ROLES),
  };
}
