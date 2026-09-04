import React, { useState } from 'react';
import { useEconomy } from '../../../context/EconomyStore';
import { sound } from '../../../utils/audio';
import { speech } from '../../../utils/speech';
import { UI_TRANSLATIONS } from '../../../data/translations';

export const EconomySandbox: React.FC = () => {
  const { state, dispatch } = useEconomy();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const lang = state.language;
  const ui = UI_TRANSLATIONS[lang].sandbox;

  const { rainfall, fuelCost, marketDemand } = state.sandbox;

  // Calculate live sector feedback metrics
  // Agriculture: optimal rainfall is between 40 and 65
  let agHealth = 100 - Math.abs(rainfall - 55) * 1.8;
  agHealth = Math.max(20, Math.min(100, Math.round(agHealth)));

  // Industrial output: needs raw materials (agHealth) and affordable fuel
  let indOutput = agHealth * 0.7 + (100 - fuelCost) * 0.3;
  indOutput = Math.max(15, Math.min(100, Math.round(indOutput)));

  // Shop Inflation / Price Pressure: high fuel and high demand drive prices up, low supply drives prices up
  let inflationPressure = Math.round(fuelCost * 0.45 + marketDemand * 0.35 + (100 - agHealth) * 0.2);
  inflationPressure = Math.max(10, Math.min(100, inflationPressure));

  // Determine key dynamic insight based on student's dial positions
  let dynamicInsight = '';
  if (rainfall < 30) {
    dynamicInsight = ui.lowRain;
  } else if (fuelCost > 70) {
    dynamicInsight = ui.highFuel;
  } else if (marketDemand > 75) {
    dynamicInsight = ui.highDemand;
  } else if (rainfall > 85) {
    dynamicInsight = lang === 'hi'
      ? 'अत्यधिक बाढ़ से फसलें नष्ट हो जाती हैं और मालवाहक ट्रकों का आवागमन बाधित होता है।'
      : 'Excessive monsoon flooding damages standing cotton and delays highway transport delivery.';
  } else {
    dynamicInsight = lang === 'hi'
      ? 'संतुलित मानसून और सामान्य ईंधन दरों से पूरी अर्थव्यवस्था निर्बाध रूप से कार्य कर रही है।'
      : 'With balanced rainfall and steady fuel rates, goods and services move smoothly across all three sectors.';
  }

  const handleSliderChange = (key: 'rainfall' | 'fuelCost' | 'marketDemand', val: number) => {
    dispatch({ type: 'UPDATE_SANDBOX', key, value: val });
  };

  const handleReset = () => {
    sound.playClick();
    dispatch({ type: 'UPDATE_SANDBOX', key: 'rainfall', value: 50 });
    dispatch({ type: 'UPDATE_SANDBOX', key: 'fuelCost', value: 50 });
    dispatch({ type: 'UPDATE_SANDBOX', key: 'marketDemand', value: 50 });
  };

  const handleToggleSpeech = () => {
    sound.playClick();
    if (isSpeaking) {
      speech.stop();
      setIsSpeaking(false);
    } else {
      speech.speak(dynamicInsight, lang);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 overflow-y-auto select-none">
      {/* Header Banner */}
      <div className="bg-surface border border-border rounded-card p-4 shadow-soft mb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-textMain flex items-center gap-2">
              <span>🎛️</span>
              <span>{ui.title}</span>
            </h3>
            <p className="text-xs text-textMuted mt-0.5 max-w-2xl">{ui.subtitle}</p>
          </div>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-btn border border-border bg-background hover:bg-border/50 text-textMuted hover:text-textMain text-xs font-bold transition-colors min-h-[36px]"
          >
            🔄 {ui.reset}
          </button>
        </div>
      </div>

      {/* Main Grid: Levers on Left, Real-Time Indicators on Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* Left Column: Interactive Levers */}
        <div className="bg-surface border border-border rounded-card p-5 shadow-soft flex flex-col justify-between gap-4">
          <div className="text-xs font-black text-textMuted uppercase tracking-wider">
            {lang === 'hi' ? 'आर्थिक नियंत्रण डायल' : 'Environmental & Market Dials'}
          </div>

          {/* Slider 1: Rainfall */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-textMain">
              <span className="flex items-center gap-1.5">
                <span>🌧️</span>
                <span>{ui.rainfall}</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-background border border-border text-[11px]">
                {rainfall < 30 ? (lang === 'hi' ? 'सूखा (Drought)' : 'Drought') : rainfall > 75 ? (lang === 'hi' ? 'बाढ़ (Flood)' : 'Heavy Flood') : (lang === 'hi' ? 'सामान्य वर्षा' : 'Normal')}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={rainfall}
              onChange={(e) => handleSliderChange('rainfall', Number(e.target.value))}
              className="w-full accent-sectorPrimary cursor-pointer h-2 bg-background rounded-lg border border-border"
            />
            <div className="flex justify-between text-[10px] text-textMuted">
              <span>0% (Dry)</span>
              <span>50% (Ideal)</span>
              <span>100% (Flood)</span>
            </div>
          </div>

          {/* Slider 2: Fuel / Diesel */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-textMain">
              <span className="flex items-center gap-1.5">
                <span>⛽</span>
                <span>{ui.fuel}</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-background border border-border text-[11px]">
                {fuelCost > 70 ? (lang === 'hi' ? 'अत्यधिक महंगा' : 'Spike!') : fuelCost < 30 ? (lang === 'hi' ? 'सस्ता ईंधन' : 'Subsidized') : (lang === 'hi' ? 'सामान्य दर' : 'Standard')}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={fuelCost}
              onChange={(e) => handleSliderChange('fuelCost', Number(e.target.value))}
              className="w-full accent-accentOrange cursor-pointer h-2 bg-background rounded-lg border border-border"
            />
            <div className="flex justify-between text-[10px] text-textMuted">
              <span>Cheap</span>
              <span>Standard</span>
              <span>Spike!</span>
            </div>
          </div>

          {/* Slider 3: Consumer Demand */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-textMain">
              <span className="flex items-center gap-1.5">
                <span>🛍️</span>
                <span>{ui.demand}</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-background border border-border text-[11px]">
                {marketDemand > 75 ? (lang === 'hi' ? 'त्योहारी भीड़' : 'Festive Rush') : marketDemand < 30 ? (lang === 'hi' ? 'मंदी (Slump)' : 'Slump') : (lang === 'hi' ? 'सामान्य' : 'Normal')}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={marketDemand}
              onChange={(e) => handleSliderChange('marketDemand', Number(e.target.value))}
              className="w-full accent-sectorTertiary cursor-pointer h-2 bg-background rounded-lg border border-border"
            />
            <div className="flex justify-between text-[10px] text-textMuted">
              <span>Low Demand</span>
              <span>Moderate</span>
              <span>Festive Rush</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic System Gauges */}
        <div className="bg-surface border border-border rounded-card p-5 shadow-soft flex flex-col justify-between gap-3">
          <div className="text-xs font-black text-textMuted uppercase tracking-wider">
            {lang === 'hi' ? 'अर्थव्यवस्था पर प्रभाव (लाइव मीटर)' : 'Live Economic Ripple Health'}
          </div>

          {/* Gauge 1: Agriculture / Nature Health */}
          <div className="p-3 rounded-btn bg-background border border-border/80 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-sectorPrimary flex items-center gap-1">
                <span>🌾</span> {ui.agricultureHealth}
              </span>
              <span className="font-mono">{agHealth}%</span>
            </div>
            <div className="w-full bg-border/40 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-sectorPrimary transition-all duration-300"
                style={{ width: `${agHealth}%` }}
              />
            </div>
          </div>

          {/* Gauge 2: Factory & Industry Output */}
          <div className="p-3 rounded-btn bg-background border border-border/80 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-sectorSecondary flex items-center gap-1">
                <span>🏭</span> {ui.industrialOutput}
              </span>
              <span className="font-mono">{indOutput}%</span>
            </div>
            <div className="w-full bg-border/40 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-sectorSecondary transition-all duration-300"
                style={{ width: `${indOutput}%` }}
              />
            </div>
          </div>

          {/* Gauge 3: Inflation & Price Pressure */}
          <div className="p-3 rounded-btn bg-background border border-border/80 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-accentOrange flex items-center gap-1">
                <span>🏷️</span> {ui.marketPrice}
              </span>
              <span className="font-mono">{inflationPressure}% {inflationPressure > 65 ? '⚠️ High' : '✅ Stable'}</span>
            </div>
            <div className="w-full bg-border/40 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${inflationPressure > 65 ? 'bg-statusError' : 'bg-statusSuccess'}`}
                style={{ width: `${inflationPressure}%` }}
              />
            </div>
          </div>

          {/* Dynamic Educational Chain Explanation Card */}
          <div className="p-3 rounded-btn bg-amber-500/10 border border-amber-500/30 text-xs">
            <div className="flex items-center justify-between font-bold text-amber-900 mb-1">
              <span className="flex items-center gap-1">
                <span>💡</span> {ui.insightTitle}
              </span>
              <button
                onClick={handleToggleSpeech}
                className="text-[11px] px-2 py-0.5 rounded bg-surface border border-border text-textMain hover:bg-border/50 flex items-center gap-1"
                title="Narrate Insight"
              >
                <span>{isSpeaking ? '🔊' : '🔈'}</span>
                <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
              </button>
            </div>
            <p className="text-amber-950 font-medium leading-relaxed">{dynamicInsight}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
