export type WorkModality = 'text' | 'numbers' | 'image' | 'voice' | 'video' | 'code' | 'quality';

export interface DecisionOption {
  label: string;
  nextId: string;
  contextKey?: 'sector' | 'role' | 'headache' | 'finished' | 'processShape';
  contextValue?: string;
  modality?: WorkModality;
  example?: string;
}

export interface DecisionQuestionNode {
  id: string;
  type: 'question';
  stepLabel: string;
  question: string;
  helpText: string;
  examples?: string[];
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
  plainSummary: string;
  summary: string;
  goodFor: string[];
  notFor: string[];
  safetyRule: string;
  mondayFirstStepByModality: Partial<Record<WorkModality, string>>;
  toolsByModality: Partial<Record<WorkModality, DecisionToolLink[]>>;
  toolLinks: DecisionToolLink[];
  pros: string[];
  cons: string[];
  harness: string[];
  doNot: string;
  harnessCardHints: { field: string; hint: string }[];
  facilitatorPatternName: string;
}

export type DecisionNode = DecisionQuestionNode | DecisionResultNode;

export interface PathContext {
  sector?: string;
  role?: string;
  headache?: string;
  modality?: WorkModality;
  finished?: string;
  processShape?: string;
}

export const MODALITY_LABELS: Record<WorkModality, string> = {
  text: 'Writing & documents',
  numbers: 'Numbers & money',
  image: 'Photos & scans',
  voice: 'Voice & calls',
  video: 'Video & clips',
  code: 'Code & systems',
  quality: 'Checking quality',
};
