import React from 'react';
import { Question } from '../../../types/economy';
import { sound } from '../../../utils/audio';

interface Props {
  questions: Question[];
  userAnswers: Record<string, string | string[]>;
  onClose: () => void;
}

export const ReviewModal: React.FC<Props> = ({ questions, userAnswers, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-textMain/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-card shadow-lift max-w-3xl w-full max-h-[88vh] flex flex-col justify-between p-6 select-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
          <div>
            <h3 className="text-lg font-black text-textMain">Assessment Review</h3>
            <p className="text-xs text-textMuted">See which concepts you mastered and review the explanations.</p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-full hover:bg-background flex items-center justify-center text-textMuted hover:text-textMain min-h-[44px]"
            aria-label="Close review"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Questions List */}
        <div className="flex-1 scrollable-panel space-y-3.5 pr-2">
          {questions.map((q, idx) => {
            const userAnswer = userAnswers[q.id];
            const isCorrect = userAnswer === q.answer;
            const chosenOption = q.options?.find(o => o.id === userAnswer);
            const correctOption = q.options?.find(o => o.id === q.answer);

            return (
              <div
                key={q.id}
                className={`p-4 rounded-btn border ${
                  isCorrect
                    ? 'bg-background border-border/70'
                    : 'bg-statusDisrupted/5 border-statusDisrupted/30'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-black text-textMain">
                    Q{idx + 1}. Concept: {q.concept.toUpperCase()}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isCorrect
                      ? 'bg-statusSuccess/15 text-statusSuccess'
                      : 'bg-statusDisrupted/15 text-statusDisrupted'
                  }`}>
                    {isCorrect ? '✓ Correct' : '✕ Needs Review'}
                  </span>
                </div>

                <p className="text-sm font-bold text-textMain mb-2">{q.prompt}</p>

                <div className="text-xs space-y-1 text-textMuted mb-2">
                  <div>
                    <span className="font-semibold text-textMain">Your Answer: </span>
                    <span className={isCorrect ? 'text-statusSuccess font-medium' : 'text-statusDisrupted font-medium'}>
                      {chosenOption?.text || 'No answer selected'}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div>
                      <span className="font-semibold text-textMain">Correct Answer: </span>
                      <span className="text-statusSuccess font-medium">
                        {correctOption?.text}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-2.5 rounded bg-surface border border-border text-xs text-textMain">
                  <span className="font-bold text-textMuted block mb-0.5">Explanation:</span>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border mt-3 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded-btn bg-accentYellow text-textMain font-bold text-xs shadow-soft min-h-[44px]"
          >
            Close Review
          </button>
        </div>
      </div>
    </div>
  );
};
