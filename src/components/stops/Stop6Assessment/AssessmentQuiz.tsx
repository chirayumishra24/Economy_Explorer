import React, { useState } from 'react';
import { useEconomy } from '../../../context/EconomyStore';
import { sound } from '../../../utils/audio';

export const AssessmentQuiz: React.FC = () => {
  const { state, dispatch } = useEconomy();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const currentQ = state.assessmentQuestions[state.currentQuestionIndex];

  if (!currentQ) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 bg-surface">
        <div className="text-center">
          <p className="text-base text-textMuted">Loading assessment questions...</p>
        </div>
      </div>
    );
  }

  const handleSelectOption = (optId: string) => {
    if (isAnswerRevealed) return; // Locked once answered
    sound.playClick();
    setSelectedOptionId(optId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId || isAnswerRevealed) return;
    const isCorrect = selectedOptionId === currentQ.answer;

    if (isCorrect) {
      sound.playConnectionMade();
    } else {
      sound.playClick();
    }

    setIsAnswerRevealed(true);
    dispatch({
      type: 'RECORD_ANSWER',
      questionId: currentQ.id,
      answer: selectedOptionId,
      isCorrect
    });
  };

  const handleNextQuestion = () => {
    sound.playClick();
    setSelectedOptionId(null);
    setIsAnswerRevealed(false);
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const isLastQuestion = state.currentQuestionIndex === state.assessmentQuestions.length - 1;

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 select-none overflow-hidden">
      {/* Top Progress & Concept Header */}
      <div className="flex items-center justify-between bg-surface border border-border rounded-card p-3 shadow-soft z-20">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-textMain">
              Question {state.currentQuestionIndex + 1} of {state.assessmentQuestions.length}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-border/40 text-textMuted font-bold capitalize">
              Concept: {currentQ.concept.replace('-', ' ')}
            </span>
          </div>
          <p className="text-xs text-textMuted mt-0.5">
            Target: {currentQ.objective}
          </p>
        </div>

        {/* Difficulty Badge */}
        <div className="flex items-center gap-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            currentQ.difficulty === 1
              ? 'bg-statusSuccess/15 text-statusSuccess border border-statusSuccess/30'
              : currentQ.difficulty === 2
              ? 'bg-statusWarning/15 text-textMain border border-statusWarning/30'
              : 'bg-statusDisrupted/15 text-statusDisrupted border border-statusDisrupted/30'
          }`}>
            {currentQ.difficulty === 1 ? 'Level 1: Foundation' : currentQ.difficulty === 2 ? 'Level 2: Reasoning' : 'Level 3: Application'}
          </span>
        </div>
      </div>

      {/* Question Card Arena */}
      <div className="relative flex-1 w-full my-2 bg-surface border border-border rounded-card p-5 sm:p-8 shadow-soft flex flex-col justify-between overflow-hidden">
        {/* Question Prompt */}
        <div>
          <h3 className="text-lg sm:text-xl font-black text-textMain mb-4 leading-snug">
            {currentQ.prompt}
          </h3>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentQ.options?.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrectAnswer = opt.id === currentQ.answer;

              let optionStyle = 'bg-background hover:bg-border/40 border-border text-textMain';

              if (isAnswerRevealed) {
                if (isCorrectAnswer) {
                  optionStyle = 'bg-statusSuccess/20 border-statusSuccess font-bold text-textMain ring-2 ring-statusSuccess/30';
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle = 'bg-statusDisrupted/15 border-statusDisrupted text-textMain';
                } else {
                  optionStyle = 'bg-background/40 border-border/40 opacity-40 text-textMuted';
                }
              } else if (isSelected) {
                optionStyle = 'bg-accentYellow/20 border-accentYellow font-bold text-textMain ring-2 ring-accentYellow/30';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isAnswerRevealed}
                  className={`w-full p-3.5 rounded-btn text-left text-sm border-2 transition-all min-h-[44px] flex items-center justify-between ${optionStyle}`}
                >
                  <span className="flex-1">{opt.text}</span>
                  {isAnswerRevealed && isCorrectAnswer && (
                    <span className="text-statusSuccess font-bold text-sm ml-2">✓ Correct</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation Reveal Card (Always shown after answering) */}
        {isAnswerRevealed && (
          <div className="mt-4 p-3.5 rounded-btn bg-background border border-border animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-textMuted uppercase tracking-wider">
                Why this is correct:
              </span>
            </div>
            <p className="text-sm text-textMain leading-relaxed font-medium">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Actions Bottom Bar */}
        <div className="flex items-center justify-end pt-3 border-t border-border mt-4">
          {!isAnswerRevealed ? (
            <button
              onClick={handleConfirmAnswer}
              disabled={!selectedOptionId}
              className={`px-6 py-2.5 rounded-btn font-bold text-xs min-h-[44px] flex items-center gap-1.5 shadow-soft transition-all ${
                selectedOptionId
                  ? 'bg-accentYellow hover:brightness-105 text-textMain cursor-pointer active:scale-95'
                  : 'bg-border/40 text-textMuted/50 cursor-not-allowed'
              }`}
            >
              <span>SUBMIT ANSWER</span>
              <span>→</span>
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2.5 rounded-btn bg-textMain text-surface font-bold text-xs shadow-soft min-h-[44px] flex items-center gap-1.5 hover:brightness-110 active:scale-95 animate-in fade-in"
            >
              <span>{isLastQuestion ? 'SEE FINAL RESULTS' : 'NEXT QUESTION'}</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
