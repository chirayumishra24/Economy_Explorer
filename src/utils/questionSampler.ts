import { Question } from '../types/economy';
import { QUESTIONS } from '../data/questions';

// Simple pseudo-random number generator for seeded questions
function createPrng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Samples exactly 10 questions meeting all constraints:
 * - >= 1 per concept (all 6 concepts represented)
 * - roughly 4 easy (diff 1), 4 medium (diff 2), 2 hard (diff 3)
 * - never the same format 3 times in a row
 * - prefers unseen questions across sessions
 */
export function sampleAssessmentQuestions(
  excludedIds: string[] = [],
  seedString?: string | null
): { questions: Question[]; allExhausted: boolean } {
  let rng = Math.random;

  if (seedString) {
    let numSeed = 0;
    for (let i = 0; i < seedString.length; i++) {
      numSeed = (numSeed << 5) - numSeed + seedString.charCodeAt(i);
      numSeed |= 0;
    }
    rng = createPrng(Math.abs(numSeed) || 12345);
  }

  // Filter out previously answered questions if possible
  let available = QUESTIONS.filter(q => !excludedIds.includes(q.id));
  let allExhausted = false;

  if (available.length < 10) {
    // If not enough unseen questions remain, include previously seen ones
    allExhausted = true;
    available = [...QUESTIONS];
  }

  // Group by concept
  const concepts: Question['concept'][] = [
    'sectors',
    'goods-services',
    'roles',
    'chain',
    'interdependence',
    'disruption'
  ];

  const selected: Question[] = [];
  const selectedIds = new Set<string>();

  // Helper to pick a random item from array using rng
  const pickRandom = (items: Question[]): Question | null => {
    const unselected = items.filter(item => !selectedIds.has(item.id));
    if (unselected.length === 0) return null;
    const idx = Math.floor(rng() * unselected.length);
    return unselected[idx];
  };

  // Step 1: Guarantee at least 1 question per concept (6 questions)
  for (const concept of concepts) {
    const conceptPool = available.filter(q => q.concept === concept);
    const chosen = pickRandom(conceptPool);
    if (chosen) {
      selected.push(chosen);
      selectedIds.add(chosen.id);
    }
  }

  // Step 2: Target difficulty distribution: roughly 4 easy, 4 medium, 2 hard
  // Check what we have so far
  while (selected.length < 10) {
    const easyCount = selected.filter(q => q.difficulty === 1).length;
    const medCount = selected.filter(q => q.difficulty === 2).length;

    let targetDiff: 1 | 2 | 3 = 1;
    if (easyCount >= 4 && medCount < 4) {
      targetDiff = 2;
    } else if (easyCount >= 4 && medCount >= 4) {
      targetDiff = 3;
    } else if (medCount >= 4) {
      targetDiff = 1;
    } else {
      targetDiff = easyCount <= medCount ? 1 : 2;
    }

    const diffPool = available.filter(q => q.difficulty === targetDiff && !selectedIds.has(q.id));
    const chosen = pickRandom(diffPool.length > 0 ? diffPool : available.filter(q => !selectedIds.has(q.id)));

    if (chosen) {
      selected.push(chosen);
      selectedIds.add(chosen.id);
    } else {
      break;
    }
  }

  // Step 3: Ensure never the same format three times in a row
  // Shuffle/reorder if 3 consecutive formats occur
  const ordered: Question[] = [];
  const remaining = [...selected];

  while (remaining.length > 0) {
    let candidateIndex = 0;
    // Check last two formats
    const len = ordered.length;
    if (len >= 2 && ordered[len - 1].format === ordered[len - 2].format) {
      const avoidFormat = ordered[len - 1].format;
      const altIdx = remaining.findIndex(q => q.format !== avoidFormat);
      if (altIdx !== -1) {
        candidateIndex = altIdx;
      }
    }
    ordered.push(remaining.splice(candidateIndex, 1)[0]);
  }

  return {
    questions: ordered,
    allExhausted
  };
}
