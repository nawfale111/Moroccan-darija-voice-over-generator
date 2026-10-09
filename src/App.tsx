/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Mic,
  Sparkles,
  Zap,
  Volume2,
  FileAudio,
  Download,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Headphones,
  Sliders,
  Radio,
} from 'lucide-react';
import { ScriptEditor } from './components/ScriptEditor';
import { VoiceSelector } from './components/VoiceSelector';
import { ToneAndPacingControls } from './components/ToneAndPacingControls';
import { AudioPlayer } from './components/AudioPlayer';
import { TakesHistory, VoiceoverTake } from './components/TakesHistory';
import { ScriptTemplate, MARKETING_TEMPLATES } from './data/templates';
import { VOICES } from './data/voices';

export default function App() {
  // Script state (defaulting to a punchy Moroccan Darija COD eCommerce hook)
  const [script, setScript] = useState<string>(
    'واش باقي كتعاني من هاد المشكل كل نهار؟ [وقفة قصيرة] دابا الحل وصل بين يديك! هاد المنتج الأكثر مبيعاً فهاد الشهر جا باش يسهل عليك حياتك. والخبر الزوين؟ التوصيل فابور حتى لباب دارك فجميع مدن المغرب، وما تخلص حتى تقلب سلعتك بعينيك! الكمية قربت تسالي، كليكي دابا على الرابط لتحت وطلب ديالك قبل ما يفوت الفوت!'
  );
  const [language, setLanguage] = useState<'moroccan_darija' | 'modern_standard_arabic'>(
    'moroccan_darija'
  );

  // Voice & acoustic parameters
  const [voice, setVoice] = useState<'Kore' | 'Puck' | 'Zephyr' | 'Fenrir' | 'Charon'>('Puck');
  const [tone, setTone] = useState<'hype' | 'professional' | 'dramatic' | 'emotional' | 'sales_driven'>(
    'sales_driven'
  );
  const [rate, setRate] = useState<number>(1.15);
  const [emphasis, setEmphasis] = useState<'subtle' | 'balanced' | 'punchy' | 'maximum'>('punchy');

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Current master audio take
  const [currentTake, setCurrentTake] = useState<{
    audioBase64: string;
    mimeType: string;
    voice: string;
    tone: string;
    language: string;
    rate: number;
    emphasis: string;
    scriptSnippet: string;
  } | null>(null);

  // Saved takes history (persisted in localStorage)
  const [takes, setTakes] = useState<VoiceoverTake[]>(() => {
    try {
      const saved = localStorage.getItem('sawtify_takes_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sawtify_takes_v1', JSON.stringify(takes));
    } catch (e) {
      console.warn('Could not persist takes to localStorage:', e);
    }
  }, [takes]);

  // Handle template selection
  const handleApplyTemplate = (template: ScriptTemplate) => {
    setScript(template.script);
    setLanguage(template.language);
    setVoice(template.recommendedVoice);
    setTone(template.recommendedTone);
    setRate(template.recommendedRate);
  };

  // Generate Audio API Call
  const handleGenerateVoiceover = async () => {
    if (!script.trim()) {
      setErrorMessage('Please enter or select a marketing script first.');
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMessage(null);

      const response = await fetch('/api/voiceover/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: script.trim(),
          language,
          voice,
          tone,
          rate,
          emphasis,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate voiceover.');
      }

      const newTake: VoiceoverTake = {
        id: `take_${Date.now()}`,
        createdAt: Date.now(),
        voice,
        tone,
        language,
        rate,
        emphasis,
        scriptSnippet: script.slice(0, 100),
        audioBase64: data.audioBase64,
      };

      setCurrentTake({
        audioBase64: data.audioBase64,
        mimeType: data.mimeType || 'audio/wav',
        voice,
        tone,
        language,
        rate,
        emphasis,
        scriptSnippet: script.slice(0, 100),
      });

      setTakes((prev) => [newTake, ...prev]);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during synthesis.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTakeFromHistory = (take: VoiceoverTake) => {
    setCurrentTake({
      audioBase64: take.audioBase64,
      mimeType: 'audio/wav',
      voice: take.voice,
      tone: take.tone,
      language: take.language,
      rate: take.rate,
      emphasis: take.emphasis,
      scriptSnippet: take.scriptSnippet,
    });
  };

  const handleDeleteTake = (id: string) => {
    setTakes((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearAllTakes = () => {
    setTakes([]);
  };

  // Find current voice meta
  const currentVoiceObj = VOICES.find((v) => v.id === voice) || VOICES[0];

  return (
    <div className="min-h-screen bg-[#0c0f17] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Studio Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-teal-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-sky-400">
                <Radio className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Sawtify Studio
                </h1>
                <span className="text-xs font-arabic text-indigo-400 font-bold hidden sm:inline">
                  صوتِيفَاي الإعلاني
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Arabic & Moroccan Darija Marketing Voiceover Engine
              </p>
            </div>
          </div>

          {/* Dialect & Model Quality Badges */}
          <div className="flex items-center gap-2 text-xs">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
              <Headphones className="w-3.5 h-3.5 text-indigo-400" />
              <span>Studio 24kHz / MP3 192k</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
              <span>🇲🇦 الدارجة المغربية</span>
              <span className="text-slate-500">/</span>
              <span>🌐 الفصحى</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3 text-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold block mb-0.5">Synthesis Alert</strong>
              <p>{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-rose-500/20 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Section 1: Script Creation & AI Direction */}
        <section>
          <ScriptEditor
            script={script}
            setScript={setScript}
            language={language}
            setLanguage={setLanguage}
            rate={rate}
            onApplyTemplate={handleApplyTemplate}
          />
        </section>

        {/* Section 2: Voice Persona Selection */}
        <section>
          <VoiceSelector
            selectedVoice={voice}
            onSelectVoice={setVoice}
            language={language}
          />
        </section>

        {/* Section 3: Tone & Acoustic Controls */}
        <section>
          <ToneAndPacingControls
            selectedTone={tone}
            onSelectTone={setTone}
            rate={rate}
            onRateChange={setRate}
            emphasis={emphasis}
            onEmphasisChange={setEmphasis}
          />
        </section>

        {/* Primary Action Button Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <span>Configured Take:</span>
                <span className="text-indigo-400 font-bold">{currentVoiceObj.name}</span>
                <span className="text-slate-400">({currentVoiceObj.nameAr})</span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'moroccan_darija' ? 'Moroccan Darija' : 'Standard Arabic'} · {tone} tone · {rate}x speed · {emphasis} emphasis
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateVoiceover}
            disabled={isGenerating || !script.trim()}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-600 hover:from-indigo-600 hover:to-sky-600 disabled:opacity-50 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Synthesizing Voiceover Audio...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Studio Voiceover</span>
                <span className="text-xs font-arabic opacity-80">(توليد الصوت)</span>
              </>
            )}
          </button>
        </div>

        {/* Section 4: Master Audio Player & Visualizer */}
        {currentTake && (
          <section className="scroll-mt-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="font-semibold text-white text-sm">
                  Active Master Recording & Player
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                WAV Lossless & MP3 192kbps Ready
              </span>
            </div>

            <AudioPlayer
              audioBase64={currentTake.audioBase64}
              mimeType={currentTake.mimeType}
              voiceName={currentTake.voice}
              tone={currentTake.tone}
              language={currentTake.language}
              rate={currentTake.rate}
              emphasis={currentTake.emphasis}
              scriptSnippet={currentTake.scriptSnippet}
            />
          </section>
        )}

        {/* Section 5: Session Takes History */}
        <section>
          <TakesHistory
            takes={takes}
            onSelectTake={handleSelectTakeFromHistory}
            onDeleteTake={handleDeleteTake}
            onClearAll={handleClearAllTakes}
          />
        </section>

        {/* Section 6: Marketers & Creators Guidelines */}
        <section className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5 text-xs text-slate-400 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
              <span>🇲🇦 Moroccan Darija Conversion</span>
            </div>
            <p className="leading-relaxed">
              For TikTok & Reels in Morocco, lead with authentic colloquial hooks ("واش باقي...", "شوف هاد المفاجأة"). Darija voiceover converts 3.4x higher than formal language for e-commerce COD offers.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-sky-300 font-semibold text-sm">
              <span>🌐 Arabic Pronunciation & Diacritics</span>
            </div>
            <p className="leading-relaxed">
              When using Modern Standard Arabic, include Tashkeel (حركات التشكيل) on brand names or tricky consonants. Use comma pauses to give the AI speaker breathing room.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
              <span>⚡ Pace & Audio Export</span>
            </div>
            <p className="leading-relaxed">
              Use 1.15x–1.25x for 15-second TikTok ad rushes, and 0.85x–0.95x for luxury real estate or emotional storytelling. Export in 192kbps MP3 for fast social uploads, or WAV for video editors.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>
          Sawtify Studio · Built for Marketers, YouTubers, Ad Agencies & E-Commerce Sellers across the Arab World & Morocco
        </p>
      </footer>
    </div>
  );
}
