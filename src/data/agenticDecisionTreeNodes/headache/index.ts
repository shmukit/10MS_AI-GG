import type { DecisionQuestionNode } from '../../agenticDecisionTreeTypes';
import { accountsHeadacheNode } from './accounts';
import { collectionsHeadacheNode } from './collections';
import { educationHeadacheNode } from './education';
import { engineerHeadacheNode } from './engineer';
import { generalHeadacheNode } from './general';
import { hrHeadacheNode } from './hr';
import { leadHeadacheNode } from './lead';
import { marketingHeadacheNode } from './marketing';
import { opsHeadacheNode } from './ops';
import { planningHeadacheNode } from './planning';
import { qaHeadacheNode } from './qa';
import { salesHeadacheNode } from './sales';

export const HEADACHE_NODES: Record<string, DecisionQuestionNode> = {
  'q-headache-planning': planningHeadacheNode,
  'q-headache-accounts': accountsHeadacheNode,
  'q-headache-collections': collectionsHeadacheNode,
  'q-headache-sales': salesHeadacheNode,
  'q-headache-marketing': marketingHeadacheNode,
  'q-headache-hr': hrHeadacheNode,
  'q-headache-ops': opsHeadacheNode,
  'q-headache-lead': leadHeadacheNode,
  'q-headache-engineer': engineerHeadacheNode,
  'q-headache-qa': qaHeadacheNode,
  'q-headache-education': educationHeadacheNode,
  'q-headache-general': generalHeadacheNode,
};
