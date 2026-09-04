// Web Speech API Narrator — 100% Client-Side & Offline Capable

type SpeechListener = (speaking: boolean, text: string) => void;

class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: SpeechListener[] = [];
  private currentText: string = '';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isSupported(): boolean {
    return this.synth !== null;
  }

  public getUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }

  public subscribe(listener: SpeechListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(speaking: boolean, text: string): void {
    this.currentText = speaking ? text : '';
    this.listeners.forEach(l => l(speaking, this.currentText));
  }

  public stop(): void {
    if (!this.synth) return;
    this.synth.cancel();
    this.currentUtterance = null;
    this.notify(false, '');
  }

  public speak(text: string, lang: 'en' | 'hi' = 'en'): void {
    if (!this.synth) return;

    // If already speaking the exact same text, toggle off
    if (this.synth.speaking && this.currentText === text) {
      this.stop();
      return;
    }

    this.stop();

    const cleanText = text.trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95; // Slightly slower, ideal for Class 6 clarity
    utterance.pitch = 1.0;

    // Attempt to pick matching regional voice if available
    const voices = this.synth.getVoices();
    const matchingVoice = voices.find(v =>
      lang === 'hi' ? v.lang.startsWith('hi') : (v.lang === 'en-IN' || v.lang.startsWith('en'))
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      this.notify(true, cleanText);
    };

    utterance.onend = () => {
      this.notify(false, '');
    };

    utterance.onerror = () => {
      this.notify(false, '');
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }
}

export const speech = new SpeechEngine();
