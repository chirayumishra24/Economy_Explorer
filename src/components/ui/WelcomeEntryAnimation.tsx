'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Sprout, 
  Factory, 
  Truck, 
  Store, 
  ArrowRight, 
  BookOpen, 
  X,
  Compass
} from 'lucide-react';

interface WelcomeEntryAnimationProps {
  onStart: () => void;
}

export const WelcomeEntryAnimation: React.FC<WelcomeEntryAnimationProps> = ({ onStart }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Check if student has already seen welcome screen in this session
    const hasSeenWelcome = sessionStorage.getItem('economy_explorer_welcome_seen');
    if (hasSeenWelcome) {
      setIsVisible(false);
      return;
    }

    // Stagger animation steps
    const timer1 = setTimeout(() => setStep(1), 300);
    const timer2 = setTimeout(() => setStep(2), 700);
    const timer3 = setTimeout(() => setStep(3), 1100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('economy_explorer_welcome_seen', 'true');
    setIsVisible(false);
    onStart();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md transition-opacity duration-500 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-white via-ncert-warm-bg to-white rounded-3xl p-6 sm:p-10 border border-ncert-warm-border shadow-2xl overflow-hidden animate-scale-soft-in">
        {/* Subtle Background Shimmer Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-orange-500 to-purple-600 animate-shimmer" />

        {/* Close / Skip Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          title="Skip Intro"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Container */}
        <div className="text-center space-y-6">
          {/* Animated Header Badge */}
          <div className={`transition-all duration-700 transform ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-ncert-blue-50 text-ncert-blue border border-ncert-blue-100 shadow-sm">
              <Compass className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
              NCERT Grade 6 Social Science • Theme E
            </span>
          </div>

          {/* Title */}
          <div className={`space-y-2 transition-all duration-700 delay-100 transform ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              ECONOMY EXPLORER
            </h2>
            <p className="text-sm sm:text-base font-semibold text-ncert-blue">
              Chapter 14: Economic Activities Around Us
            </p>
          </div>

          {/* Floating Sector Icons Grid */}
          <div className={`grid grid-cols-4 gap-3 py-2 transition-all duration-700 delay-200 transform ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col items-center gap-1.5 shadow-xs animate-float-slow">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-emerald-900">1. Primary</span>
              <span className="text-[9px] text-gray-500">Nature</span>
            </div>

            <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 flex flex-col items-center gap-1.5 shadow-xs animate-float-slow" style={{ animationDelay: '0.4s' }}>
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm">
                <Factory className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-orange-900">2. Secondary</span>
              <span className="text-[9px] text-gray-500">Factory</span>
            </div>

            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex flex-col items-center gap-1.5 shadow-xs animate-float-slow" style={{ animationDelay: '0.8s' }}>
              <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-purple-900">3. Tertiary</span>
              <span className="text-[9px] text-gray-500">Services</span>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col items-center gap-1.5 shadow-xs animate-float-slow" style={{ animationDelay: '1.2s' }}>
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-amber-900">4. Market</span>
              <span className="text-[9px] text-gray-500">Consumers</span>
            </div>
          </div>

          {/* Description */}
          <div className={`p-4 bg-white/80 rounded-2xl border border-gray-200 text-xs sm:text-sm text-gray-700 font-medium leading-relaxed transition-all duration-700 delay-300 transform ${step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            🌟 <strong>Welcome!</strong> Discover how farmers, factory workers, transporters, and shopkeepers connect together in our everyday living economic web.
          </div>

          {/* Action Trigger Button */}
          <div className={`pt-2 transition-all duration-700 delay-300 transform ${step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button
              onClick={handleDismiss}
              className="w-full sm:w-auto px-8 py-3.5 bg-ncert-blue hover:bg-ncert-blue-dark text-white rounded-2xl font-black text-sm shadow-md hover:shadow-lg active:scale-95 transition-all inline-flex items-center justify-center gap-2 group animate-soft-glow"
            >
              <span>Begin Chapter 14 Exploration</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
