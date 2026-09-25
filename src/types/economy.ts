export type Sector = 'primary' | 'secondary' | 'tertiary';
export type Provenance = 'textbook' | 'teacher-supplied' | 'everyday-example' | 'unverified';
export type OutputKind = 'good' | 'service';

export type IconName =
  | 'farm'
  | 'dairy'
  | 'forest'
  | 'factory'
  | 'dairy-plant'
  | 'workshop'
  | 'truck'
  | 'shop'
  | 'bank'
  | 'school'
  | 'clinic'
  | 'consumer';

export interface EconomicNode {
  id: string;
  label: string;                 // e.g. "Cotton farm"
  sector: Sector;
  who: string;                   // e.g. "Ramesh, a cotton farmer"
  doing: string;                 // one short sentence, <= 18 words
  output: { kind: OutputKind; label: string };
  position: { x: number; y: number };   // coordinates (percentages or relative scale 0-100)
  icon: IconName;
  source: Provenance;
}

export interface Connection {
  id: string;
  from: string;                  // EconomicNode id
  to: string;                    // EconomicNode id
  carries: string;               // e.g. "raw cotton"
  rationale: string;             // why this link makes sense
  wrongLinkFeedback?: string;    // shown when a student proposes this link wrongly
}

export interface ProductJourney {
  id: string;
  product: string;               // e.g. "A cotton shirt"
  description: string;           // short overview
  stages: Array<{
    nodeId: string;
    caption: string;             // <= 20 words
    changeHere: string;          // what is different after this stage
  }>;
  source: Provenance;
}

export interface Scenario {      // powers What If? and the broken machine
  id: string;
  title: string;
  trigger: string;               // e.g. "The truck route is blocked"
  description: string;
  affectedIds: string[];         // nodes/connections that change
  predictions: Array<{ id: string; text: string; correct: boolean; whyNot?: string }>;
  ripple: Array<{ nodeId: string; effect: string; order: number }>; // animation order
  observed: string;              // What happened
  whyItHappened: string;         // Explanation
  keyIdea: string;               // the one sentence to remember
  source: Provenance;
}

export interface Question {
  id: string;
  concept: 'sectors' | 'goods-services' | 'roles' | 'chain' | 'interdependence' | 'disruption';
  difficulty: 1 | 2 | 3;
  format: 'scenario' | 'cause-effect' | 'sequence' | 'identify-role'
        | 'predict-next' | 'connection-reasoning' | 'journey-order';
  prompt: string;
  options?: Array<{ id: string; text: string }>;
  answer: string | string[];     // string[] = ordering questions
  explanation: string;           // shown after answering, always
  objective: string;             // maps to acceptance tests in section 1
  source: Provenance;
}

export interface EconomyScores {
  exploration: number;     // max 10
  prediction: number;      // max 20
  reasoning: number;       // max 20
  problemSolving: number;  // max 20
  assessment: number;      // max 30
}

export type CanonicalStop =
  | 'explore'
  | 'follow-product'
  | 'what-if'
  | 'fix-economy'
  | 'final-challenge'
  | 'assessment'
  | 'results'
  | 'review'
  | 'sector-battle'
  | 'amul-flowchart';

export interface SectorCard {
  id: string;
  title: string;
  description: string;
  sector: Sector;
  activityKind: string;
  actor: string;
  hint: string;
  funFact: string;
  illustrationKey: string;
  hindiTitle?: string;
  hindiDescription?: string;
}

export interface AmulStageCard {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  sector: Sector | 'collection' | 'consumer';
  location: string;
  actor: string;
  rationale: string;
  wrongOrderClue: string;
  illustrationKey: string;
  hindiTitle?: string;
  hindiDescription?: string;
}

export interface TeamProfile {
  id: 'teamA' | 'teamB';
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  avatar: string;
  mascot: string;
}

export type Language = 'en' | 'hi';
export type FlowMode = 'goods' | 'money';

export interface SandboxState {
  rainfall: number; // 0 (Drought) to 100 (Flood), 50 is normal
  fuelCost: number; // 0 (Low) to 100 (High), 50 is standard
  marketDemand: number; // 0 (Low) to 100 (Festive Rush), 50 is standard
}

export interface AppState {
  currentStop: CanonicalStop;
  screen: 'start' | 'how-to-play' | 'main' | 'teacher' | 'team-games';
  completedStops: string[];
  selectedProduct: string;
  visitedNodeIds: string[];
  activeConnections: string[];
  scenarioId: string | null;
  predictionId: string | null;
  predictionLocked: boolean;
  simulationRunning: boolean;
  simulationStep: number;
  simulationFinished: boolean;
  isMachineFrozen: boolean;
  fixedConnections: string[];
  chainOrder: string[];
  chainSubmitted: boolean;
  chainValid: boolean | null;
  assessmentQuestions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string | string[]>;
  scores: EconomyScores;
  firstAttemptPredictions: Record<string, boolean>;
  firstAttemptReasoning: Record<string, boolean>;
  wrongFixAttempts: number;
  soundEnabled: boolean;
  classroomMode: boolean;
  reducedMotion: boolean;
  language: Language;
  flowMode: FlowMode;
  sandbox: SandboxState;
  studentName: string;
}

