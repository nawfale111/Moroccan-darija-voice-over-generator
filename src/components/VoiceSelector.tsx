import React from 'react';
import { VOICES, VoicePersona } from '../data/voices';
import { Mic, User, Sparkles, Check } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoice: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir' | 'Charon';
  onSelectVoice: (voice: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir' | 'Charon') => void;
  language: 'moroccan_darija' | 'modern_standard_arabic';
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onSelectVoice,
  language,
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-indigo-400" />
          <h3 className="font-semibold text-white text-sm">Select Voice Persona</h3>
        </div>
        <span className="text-xs text-slate-500">
          5 Studio Voices (Male / Female)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {VOICES.map((voice) => {
          const isSelected = selectedVoice === voice.id;
          return (
            <div
              key={voice.id}
              onClick={() => onSelectVoice(voice.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/95 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${voice.avatarColor} border flex items-center justify-center font-bold text-xs`}
                  >
                    {voice.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-100 text-sm">{voice.name}</span>
                      <span className="text-xs text-slate-400 font-arabic">({voice.nameAr})</span>
                    </div>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {voice.gender === 'female' ? 'Female' : 'Male'} · {voice.id}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-snug mb-2 font-medium">
                  {language === 'moroccan_darija' ? voice.taglineAr : voice.tagline}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400 block truncate" title={voice.bestFor}>
                  🎯 {voice.bestFor}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
