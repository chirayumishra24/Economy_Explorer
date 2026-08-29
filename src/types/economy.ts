export type EconomicSector = 'primary' | 'secondary' | 'tertiary';
export type ActivityType = 'economic' | 'non-economic';
export type OutputType = 'good' | 'service';
export type ConfidenceLevel = 1 | 2 | 3 | 4; // 1: Need help, 2: Getting it, 3: Understand, 4: Can explain

export interface WorkerProfile {
  id: string;
  name: string;
  role: string;
  icon: string;
  whatTheyDo: string;
  whatTheyProvide: string;
  outputType: OutputType;
  sector: EconomicSector;
  whyEarns: string;
  ncertConnection: string;
}

export interface ActivityCard {
  id: string;
  name: string;
  icon: string;
  description: string;
  sector: EconomicSector;
  reason: string;
  natureResource?: string;
  transformedFrom?: string;
  serviceBeneficiary?: string;
}

export interface EconomicCheckScenario {
  id: string;
  title: string;
  context: string;
  person: string;
  action: string;
  isEconomic: boolean;
  whyExplanation: string;
  keyLearning: string;
  ncertRef: string;
}

export interface TransformationPipeline {
  id: string;
  title: string;
  productName: string;
  rawMaterial: {
    name: string;
    source: string;
    sector: 'primary';
    icon: string;
    details: string;
  };
  processing: {
    name: string;
    stages: string[];
    sector: 'secondary';
    icon: string;
    details: string;
  };
  product: {
    name: string;
    usage: string;
    sector: 'secondary' | 'tertiary';
    icon: string;
    details: string;
  };
  keyIdea: string;
}

export interface ServicePillar {
  id: string;
  name: string;
  icon: string;
  whoUsesIt: string;
  howItHelps: string;
  withoutItConsequence: string;
  sector: 'tertiary';
  example: string;
}

export interface ValueChainStage {
  stageNumber: number;
  actor: string;
  sector: EconomicSector;
  icon: string;
  whatHappens: string;
  needsFromPrevious: string;
  providesToNext: string;
  realWorldExample: string;
}

export interface ValueChain {
  id: string;
  productName: string;
  icon: string;
  description: string;
  stages: ValueChainStage[];
  disruptionScenario: {
    disruptedStageIndex: number;
    description: string;
    rippleEffect: string;
    lesson: string;
  };
}

export interface LocalityShop {
  id: string;
  name: string;
  category: string;
  icon: string;
  proprietor: string;
  whatIsProvided: string;
  outputType: OutputType;
  sector: EconomicSector;
  keyInputsNeeded: string[];
  interconnectedSectors: string;
  description: string;
}

export interface AmulStage {
  step: number;
  title: string;
  actor: string;
  sector: EconomicSector;
  icon: string;
  whatHappens: string;
  equipmentOrTools: string;
  connectionToNext: string;
  whyCooperativeMatters: string;
}

export interface ThinkPrompt {
  id: string;
  title: string;
  question: string;
  hint: string;
  modelExplanation: string;
  ncertRef: string;
  guidingPoints: string[];
}

export interface MisconceptionItem {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
  realFact: string;
  ncertRef: string;
}

export interface ConceptNode {
  id: string;
  label: string;
  sector?: EconomicSector;
  shortDesc: string;
  definition: string;
  example: string;
  connectedNodeIds: string[];
  quickCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export type QuestionType =
  | 'mcq'
  | 'multi-select'
  | 'classification'
  | 'ordering'
  | 'drag-drop'
  | 'scenario'
  | 'reasoning'
  | 'goods-services';

export interface PracticeQuestion {
  id: string;
  sectionId: string;
  type: QuestionType;
  question: string;
  scenarioContext?: string;
  options?: string[];
  correctAnswer: string | string[] | number | number[];
  hint1: string;
  hint2: string;
  explanation: string;
  keyIdea: string;
  ncertRef: string;
  classificationItems?: { id: string; text: string; category: string }[];
  orderingItems?: { id: string; text: string; correctPos: number }[];
}

export interface AssessmentQuestion {
  id: string;
  competency: 'understanding' | 'classification' | 'connections' | 'goods_services' | 'application' | 'reasoning';
  points: number;
  type: QuestionType;
  question: string;
  scenarioContext?: string;
  options?: string[];
  correctAnswer: string | string[] | number | number[];
  explanation: string;
  ncertRef: string;
  reviewSectionId: string;
  classificationItems?: { id: string; text: string; category: string }[];
  orderingItems?: { id: string; text: string; correctPos: number }[];
}

export interface CompetencyScore {
  name: string;
  key: 'understanding' | 'classification' | 'connections' | 'goods_services' | 'application' | 'reasoning';
  earned: number;
  max: number;
  percentage: number;
}

export interface LearningNote {
  sectionId: string;
  text: string;
  updatedAt: string;
}

export interface UserState {
  currentSectionId: string;
  completedSections: string[];
  sectionConfidence: Record<string, ConfidenceLevel>;
  bookmarks: string[];
  notes: Record<string, string>;
  practiceAnswers: Record<string, any>;
  assessmentAnswers: Record<string, any>;
  assessmentSubmitted: boolean;
  assessmentScore: number;
  competencyScores: Record<string, { earned: number; max: number }>;
  wrongQuestionIds: string[];
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  reducedMotion: boolean;
  tapMode: boolean; // Accessible toggle instead of drag & drop
}

// ─── Activity / Game Types ───────────────────────────────────────────

export type GameMode = 'team' | 'individual';

export type ActivityId =
  | 'sector-auction'
  | 'supply-chain-relay'
  | 'economy-pictionary'
  | 'goods-vs-services'
  | 'buzzer-round'
  | 'snakes-ladders';

export interface Team {
  name: string;
  score: number;
  color: string;
}

export interface Player {
  name: string;
  score: number;
  isAI?: boolean;
  aiDifficulty?: 'easy' | 'medium' | 'hard';
}

export interface ActivityMeta {
  id: ActivityId;
  title: string;
  description: string;
  icon: string;
  mode: GameMode;
  playerCount: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  concepts: string[];
}

export interface AuctionItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  correctSector: EconomicSector;
  baseValue: number;
}

export interface PictionaryWord {
  id: string;
  word: string;
  category: 'worker' | 'sector' | 'concept' | 'product';
  difficulty: 'easy' | 'medium' | 'hard';
  hints: string[];
}

export interface BuzzerScenario {
  id: string;
  description: string;
  personOrItem: string;
  correctSector: EconomicSector;
  correctOutputType: OutputType;
  explanation: string;
}

export interface SortItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  correctType: OutputType;
  difficulty: number; // 1=easy, 2=medium, 3=hard
}

export interface BoardTile {
  position: number;
  type: 'normal' | 'snake' | 'ladder' | 'question';
  question?: {
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  snakeTo?: number;
  ladderTo?: number;
  label?: string;
}

export interface SupplyChainChallenge {
  id: string;
  productName: string;
  icon: string;
  stages: {
    id: string;
    text: string;
    sector: EconomicSector;
    correctOrder: number;
  }[];
  disruptionQuestion: string;
  disruptionOptions: string[];
  disruptionCorrectIndex: number;
}

export interface ActivityAppState {
  currentScreen: 'hub' | 'setup' | 'playing' | 'results';
  currentActivity: ActivityId | null;
  gameMode: GameMode | null;
  teams: [Team, Team] | null;
  players: [Player, Player] | null;
  roundNumber: number;
  activityState: Record<string, any>;
  winnerName: string | null;
  finalScores: { name: string; score: number }[] | null;
}
