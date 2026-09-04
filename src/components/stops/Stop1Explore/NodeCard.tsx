import React, { useState, useEffect } from 'react';
import { EconomicNode } from '../../../types/economy';
import { NodeIconRenderer, SectorBadge } from '../../icons/EconomicIcons';
import { sound } from '../../../utils/audio';
import { speech } from '../../../utils/speech';
import { useEconomy } from '../../../context/EconomyStore';
import { NODE_TRANSLATIONS, UI_TRANSLATIONS } from '../../../data/translations';

interface Props {
  node: EconomicNode;
  onClose: () => void;
  onNextNode?: (nodeId: string) => void;
}

export const NodeCard: React.FC<Props> = ({ node, onClose }) => {
  const { state } = useEconomy();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const lang = state.language;
  const translation = NODE_TRANSLATIONS[node.id]?.[lang];
  const ui = UI_TRANSLATIONS[lang].card;

  const nodeLabel = translation?.label || node.label;
  const nodeWho = translation?.who || node.who;
  const nodeDoing = translation?.doing || node.doing;
  const nodeOutput = translation?.outputLabel || node.output.label;

  useEffect(() => {
    const unsubscribe = speech.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      speech.stop();
      unsubscribe();
    };
  }, []);

  const narrationText = `${nodeLabel}. ${nodeWho}. ${nodeDoing}. ${nodeOutput}.`;

  const handleToggleSpeech = () => {
    sound.playClick();
    if (isSpeaking) {
      speech.stop();
    } else {
      speech.speak(narrationText, lang);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="node-title"
      className="fixed inset-0 z-40 bg-textMain/30 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-surface border border-border rounded-card shadow-lift max-w-lg w-full p-6 relative select-none animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            speech.stop();
            onClose();
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-background flex items-center justify-center text-textMuted hover:text-textMain min-h-[44px]"
          aria-label="Close details"
        >
          ✕
        </button>

        {/* Header with Icon, Title & Read-Aloud Button */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-card bg-background border border-border flex items-center justify-center text-textMain shrink-0 shadow-sm">
            <NodeIconRenderer name={node.icon} size={32} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <SectorBadge sector={node.sector} />
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-border/40 text-textMuted uppercase">
                {node.output.kind}
              </span>
              {/* Read Aloud Button */}
              <button
                onClick={handleToggleSpeech}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors flex items-center gap-1 min-h-[32px] ${
                  isSpeaking
                    ? 'bg-statusSuccess text-surface animate-pulse'
                    : 'bg-background hover:bg-border/60 text-textMain border border-border'
                }`}
                title={isSpeaking ? ui.stopAudio : ui.readAloud}
              >
                <span>{isSpeaking ? '🔊' : '🔈'}</span>
                <span>{isSpeaking ? ui.stopAudio : ui.readAloud}</span>
              </button>
            </div>
            <h2 id="node-title" className="text-xl font-black text-textMain">{nodeLabel}</h2>
          </div>
        </div>

        {/* 5 Questions Structured Information */}
        <div className="space-y-3 my-4">
          {/* Who? */}
          <div className="p-3 rounded-btn bg-background border border-border/70">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider block">{ui.worker}</span>
            <p className="text-base font-bold text-textMain mt-0.5">{nodeWho}</p>
          </div>

          {/* What are they doing? */}
          <div className="p-3 rounded-btn bg-background border border-border/70">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider block">{ui.activity}</span>
            <p className="text-base text-textMain mt-0.5 font-medium">{nodeDoing}</p>
          </div>

          {/* Output: Good or Service? */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-btn bg-background border border-border/70">
              <span className="text-xs font-bold text-textMuted uppercase tracking-wider block">{ui.output}</span>
              <p className="text-sm font-bold text-textMain mt-0.5">{nodeOutput}</p>
            </div>
            <div className="p-3 rounded-btn bg-background border border-border/70">
              <span className="text-xs font-bold text-textMuted uppercase tracking-wider block">Type</span>
              <p className="text-sm font-bold capitalize text-textMain mt-0.5">
                {node.output.kind === 'good' ? `📦 ${ui.good}` : `🤝 ${ui.service}`}
              </p>
            </div>
          </div>

          {/* What happens next? */}
          <div className="p-3 rounded-btn bg-background border border-border/70">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider block">
              {lang === 'hi' ? 'आगे क्या होता है?' : 'What happens next?'}
            </span>
            <p className="text-sm text-textMuted mt-0.5">
              {lang === 'hi' ? (
                node.sector === 'primary' ? 'यह कच्चा माल परिवहन द्वारा कारखानों में विनिर्माण हेतु भेजा जाता है।' :
                node.sector === 'secondary' ? 'यह तैयार वस्तु बाजार की दुकान पर पहुंचती है जहां उपभोक्ता इसे खरीदते हैं।' :
                'यह सेवा उत्पादकों को उपभोक्ताओं से जोड़ती है और अर्थव्यवस्था को सुचारू रखती है।'
              ) : (
                node.sector === 'primary' ? 'This raw natural material is picked up by transport to go to factories for making.' :
                node.sector === 'secondary' ? 'This newly made product travels to the bazaar shop so local families can purchase it.' :
                'This service connects producers to consumers or helps keep community activities running.'
              )}
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-5 pt-3 border-t border-border flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              speech.stop();
              onClose();
            }}
            className="px-6 py-2.5 rounded-btn bg-accentYellow font-bold text-textMain text-sm hover:brightness-105 min-h-[44px] shadow-soft"
          >
            {lang === 'hi' ? 'खोज पूरी हुई' : 'Done Exploring This Node'}
          </button>
        </div>
      </div>
    </div>
  );
};

