import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, CanonicalStop } from '../types/economy';
import { sampleAssessmentQuestions } from '../utils/questionSampler';
import { sound } from '../utils/audio';

type Action =
  | { type: 'SET_SCREEN'; screen: AppState['screen'] }
  | { type: 'NAVIGATE_STOP'; stop: CanonicalStop }
  | { type: 'COMPLETE_STOP'; stop: CanonicalStop }
  | { type: 'VISIT_NODE'; nodeId: string }
  | { type: 'SELECT_PRODUCT'; productId: string }
  | { type: 'SET_SCENARIO'; scenarioId: string }
  | { type: 'SET_PREDICTION'; predictionId: string }
  | { type: 'LOCK_PREDICTION' }
  | { type: 'START_SIMULATION' }
  | { type: 'SET_SIMULATION_STEP'; step: number }
  | { type: 'FINISH_SIMULATION' }
  | { type: 'RECORD_REASONING_ATTEMPT'; isCorrect: boolean }
  | { type: 'ADD_FIXED_CONNECTION'; connectionId: string }
  | { type: 'RECORD_WRONG_FIX' }
  | { type: 'SET_CHAIN_ORDER'; order: string[] }
  | { type: 'SUBMIT_CHAIN'; isValid: boolean }
  | { type: 'RECORD_ANSWER'; questionId: string; answer: string | string[]; isCorrect: boolean }
  | { type: 'NEXT_QUESTION' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'TOGGLE_CLASSROOM_MODE' }
  | { type: 'TOGGLE_REDUCED_MOTION' }
  | { type: 'SET_LANGUAGE'; language: AppState['language'] }
  | { type: 'SET_FLOW_MODE'; flowMode: AppState['flowMode'] }
  | { type: 'SET_STUDENT_NAME'; name: string }
  | { type: 'UPDATE_SANDBOX'; key: keyof AppState['sandbox']; value: number }
  | { type: 'PLAY_AGAIN' }
  | { type: 'RESET_ENTIRE_APP' };

const INITIAL_STATE: AppState = {
  currentStop: 'explore',
  screen: 'start',
  completedStops: [],
  selectedProduct: 'cotton-shirt',
  visitedNodeIds: [],
  activeConnections: [],
  scenarioId: 'scenario-transport-blocked',
  predictionId: null,
  predictionLocked: false,
  simulationRunning: false,
  simulationStep: 0,
  simulationFinished: false,
  isMachineFrozen: false,
  fixedConnections: [],
  chainOrder: [],
  chainSubmitted: false,
  chainValid: null,
  assessmentQuestions: [],
  currentQuestionIndex: 0,
  userAnswers: {},
  scores: {
    exploration: 0,
    prediction: 0,
    reasoning: 0,
    problemSolving: 0,
    assessment: 0
  },
  firstAttemptPredictions: {},
  firstAttemptReasoning: {},
  wrongFixAttempts: 0,
  soundEnabled: false,
  classroomMode: false,
  reducedMotion: false,
  language: 'en',
  flowMode: 'goods',
  sandbox: {
    rainfall: 50,
    fuelCost: 50,
    marketDemand: 50
  },
  studentName: ''
};

function economyReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };

    case 'NAVIGATE_STOP':
      return {
        ...state,
        currentStop: action.stop,
        screen: 'main'
      };

    case 'COMPLETE_STOP': {
      if (state.completedStops.includes(action.stop)) {
        return state;
      }
      return {
        ...state,
        completedStops: [...state.completedStops, action.stop]
      };
    }

    case 'VISIT_NODE': {
      if (state.visitedNodeIds.includes(action.nodeId)) {
        return state;
      }
      const updatedNodes = [...state.visitedNodeIds, action.nodeId];
      // Check if nodes cover primary, secondary, and tertiary
      // Node sector points: max 10 points
      const hasPrimary = updatedNodes.some(id => id.includes('farm') || id.includes('forest'));
      const hasSecondary = updatedNodes.some(id => id.includes('mill') || id.includes('plant') || id.includes('workshop'));
      const hasTertiary = updatedNodes.some(id => id.includes('truck') || id.includes('bank') || id.includes('shop') || id.includes('consumer'));

      let explorationScore = 0;
      if (hasPrimary) explorationScore += 3;
      if (hasSecondary) explorationScore += 3;
      if (hasTertiary) explorationScore += 4;

      return {
        ...state,
        visitedNodeIds: updatedNodes,
        scores: {
          ...state.scores,
          exploration: Math.min(10, explorationScore)
        }
      };
    }

    case 'SELECT_PRODUCT':
      return { ...state, selectedProduct: action.productId };

    case 'SET_SCENARIO':
      return {
        ...state,
        scenarioId: action.scenarioId,
        predictionId: null,
        predictionLocked: false,
        simulationRunning: false,
        simulationStep: 0,
        simulationFinished: false,
        isMachineFrozen: true
      };

    case 'SET_PREDICTION':
      if (state.predictionLocked) return state;
      return { ...state, predictionId: action.predictionId };

    case 'LOCK_PREDICTION': {
      if (!state.scenarioId || !state.predictionId) return state;

      // Score first attempt only (20 points if correct)
      const isFirst = state.firstAttemptPredictions[state.scenarioId] === undefined;
      const isCorrect = state.predictionId.includes('correct');
      const newScore = isFirst && isCorrect ? 20 : state.scores.prediction;

      return {
        ...state,
        predictionLocked: true,
        firstAttemptPredictions: {
          ...state.firstAttemptPredictions,
          [state.scenarioId]: isCorrect
        },
        scores: {
          ...state.scores,
          prediction: newScore
        }
      };
    }

    case 'START_SIMULATION':
      return {
        ...state,
        simulationRunning: true,
        simulationStep: 0,
        simulationFinished: false,
        isMachineFrozen: false
      };

    case 'SET_SIMULATION_STEP':
      return { ...state, simulationStep: action.step };

    case 'FINISH_SIMULATION':
      return {
        ...state,
        simulationRunning: false,
        simulationFinished: true
      };

    case 'RECORD_REASONING_ATTEMPT': {
      if (!state.scenarioId) return state;
      const isFirst = state.firstAttemptReasoning[state.scenarioId] === undefined;
      const newScore = isFirst && action.isCorrect ? 20 : state.scores.reasoning;

      return {
        ...state,
        firstAttemptReasoning: {
          ...state.firstAttemptReasoning,
          [state.scenarioId]: action.isCorrect
        },
        scores: {
          ...state.scores,
          reasoning: newScore
        }
      };
    }

    case 'ADD_FIXED_CONNECTION': {
      if (state.fixedConnections.includes(action.connectionId)) return state;
      const updated = [...state.fixedConnections, action.connectionId];
      // Problem solving score calculation: Fix + Chain = 20 pts max
      // Fix gives 10 pts, minus 2 per wrong attempt (min 4)
      const fixBase = Math.max(4, 10 - state.wrongFixAttempts * 2);
      const chainScore = state.chainValid ? 10 : 0;
      return {
        ...state,
        fixedConnections: updated,
        scores: {
          ...state.scores,
          problemSolving: fixBase + chainScore
        }
      };
    }

    case 'RECORD_WRONG_FIX':
      return {
        ...state,
        wrongFixAttempts: state.wrongFixAttempts + 1
      };

    case 'SET_CHAIN_ORDER':
      return { ...state, chainOrder: action.order };

    case 'SUBMIT_CHAIN': {
      const chainPts = action.isValid ? 10 : 0;
      const fixBase = state.fixedConnections.length >= 2 ? Math.max(4, 10 - state.wrongFixAttempts * 2) : 0;
      return {
        ...state,
        chainSubmitted: true,
        chainValid: action.isValid,
        scores: {
          ...state.scores,
          problemSolving: fixBase + chainPts
        }
      };
    }

    case 'RECORD_ANSWER': {
      if (state.userAnswers[action.questionId] !== undefined) return state; // Anti-random clicking: first attempt locked
      const updatedAnswers = {
        ...state.userAnswers,
        [action.questionId]: action.answer
      };
      // Each correct question gives 3 points (10 questions * 3 = 30 points)
      const correctCount = Object.keys(updatedAnswers).filter(qid => {
        const q = state.assessmentQuestions.find(item => item.id === qid);
        return q && updatedAnswers[qid] === q.answer;
      }).length + (action.isCorrect ? 1 : 0);

      return {
        ...state,
        userAnswers: updatedAnswers,
        scores: {
          ...state.scores,
          assessment: Math.min(30, correctCount * 3)
        }
      };
    }

    case 'NEXT_QUESTION': {
      const nextIdx = state.currentQuestionIndex + 1;
      if (nextIdx >= state.assessmentQuestions.length) {
        return {
          ...state,
          currentStop: 'results',
          completedStops: state.completedStops.includes('assessment')
            ? state.completedStops
            : [...state.completedStops, 'assessment']
        };
      }
      return {
        ...state,
        currentQuestionIndex: nextIdx
      };
    }

    case 'TOGGLE_SOUND': {
      const nextSound = !state.soundEnabled;
      sound.setEnabled(nextSound);
      return { ...state, soundEnabled: nextSound };
    }

    case 'TOGGLE_CLASSROOM_MODE':
      return { ...state, classroomMode: !state.classroomMode };

    case 'TOGGLE_REDUCED_MOTION':
      return { ...state, reducedMotion: !state.reducedMotion };

    case 'SET_LANGUAGE':
      return { ...state, language: action.language };

    case 'SET_FLOW_MODE':
      return { ...state, flowMode: action.flowMode };

    case 'SET_STUDENT_NAME':
      return { ...state, studentName: action.name };

    case 'UPDATE_SANDBOX':
      return {
        ...state,
        sandbox: {
          ...state.sandbox,
          [action.key]: action.value
        }
      };

    case 'PLAY_AGAIN': {
      // Re-sample unseen questions from question pool, preserving answered list for exclusion
      const answeredIds = Object.keys(state.userAnswers);
      const { questions } = sampleAssessmentQuestions(answeredIds);
      return {
        ...INITIAL_STATE,
        screen: 'main',
        currentStop: 'explore',
        assessmentQuestions: questions,
        soundEnabled: state.soundEnabled,
        classroomMode: state.classroomMode,
        reducedMotion: state.reducedMotion,
        language: state.language
      };
    }

    case 'RESET_ENTIRE_APP':
      return {
        ...INITIAL_STATE,
        soundEnabled: state.soundEnabled,
        classroomMode: state.classroomMode,
        reducedMotion: state.reducedMotion,
        language: state.language
      };

    default:
      return state;
  }
}

interface EconomyContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  resetApp: () => void;
  playAgain: () => void;
  nextStop: () => void;
}

const EconomyContext = createContext<EconomyContextType | null>(null);

const CANONICAL_STOP_ORDER: CanonicalStop[] = [
  'explore',
  'follow-product',
  'what-if',
  'fix-economy',
  'final-challenge',
  'assessment',
  'results',
  'review'
];

export const EconomyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(economyReducer, INITIAL_STATE);

  // Initialize questions on load
  useEffect(() => {
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const seed = searchParams?.get('seed');
    const { questions } = sampleAssessmentQuestions([], seed);
    dispatch({ type: 'RECORD_ANSWER', questionId: '__init__', answer: '', isCorrect: false }); // no-op trigger
    // Load sampled questions into store
    state.assessmentQuestions = questions;
  }, []);

  // Sync motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        dispatch({ type: 'TOGGLE_REDUCED_MOTION' });
      }
      const listener = (e: MediaQueryListEvent) => {
        if (e.matches !== state.reducedMotion) {
          dispatch({ type: 'TOGGLE_REDUCED_MOTION' });
        }
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  const resetApp = () => {
    dispatch({ type: 'RESET_ENTIRE_APP' });
  };

  const playAgain = () => {
    dispatch({ type: 'PLAY_AGAIN' });
  };

  const nextStop = () => {
    const currentIdx = CANONICAL_STOP_ORDER.indexOf(state.currentStop);
    if (currentIdx !== -1 && currentIdx < CANONICAL_STOP_ORDER.length - 1) {
      const next = CANONICAL_STOP_ORDER[currentIdx + 1];
      dispatch({ type: 'NAVIGATE_STOP', stop: next });
    }
  };

  return (
    <EconomyContext.Provider value={{ state, dispatch, resetApp, playAgain, nextStop }}>
      {children}
    </EconomyContext.Provider>
  );
};

export function useEconomy() {
  const ctx = useContext(EconomyContext);
  if (!ctx) {
    throw new Error('useEconomy must be used within an EconomyProvider');
  }
  return ctx;
}
