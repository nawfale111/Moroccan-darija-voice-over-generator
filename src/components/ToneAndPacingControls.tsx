import React from 'react';
import { TONE_OPTIONS, ToneOption } from '../data/voices';
import { Sliders, Zap, Volume2, Gauge } from 'lucide-react';

interface ToneAndPacingControlsProps {
  selectedTone: 'hype' | 'professional' | 'dramatic' | 'emotional' | 'sales_driven';
  onSelectTone: (tone: 'hype' | 'professional' | 'dramatic' | 'emotional' | 'sales_driven') => void;
  rate: number;
  onRateChange: (rate: number) => void;
  emphasis: 'subtle' | 'balanced' | 'punchy' | 'maximum';
  onEmphasisChange: (emphasis: 'subtle' | 'balanced' | 'punchy' | 'maximum') => void;
}

export const ToneAndPacingControls: React.FC<ToneAndPacingControlsProps> = ({
  selectedTone,
  onSelectTone,
  rate,
  onRateChange,
  emphasis,
  onEmphasisChange,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Tone Selection (Left/Main, 7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-white text-sm">Marketing Tone Conditioning</h3>
          </div>
          <span className="text-xs text-slate-500">
            5 Commercial Styles
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {TONE_OPTIONS.map((tone) => {
            const isSelected = selectedTone === tone.id;
            return (
              <button
                key={tone.id}
                type="button"
                onClick={() => onSelectTone(tone.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500 text-white'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div>
                  <span className="text-lg block mb-1">{tone.icon}</span>
                  <div className="font-semibold text-xs text-white">{tone.label}</div>
                  <div className="text-[10px] text-slate-400 font-arabic truncate mt-0.5">
                    {tone.labelAr}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 line-clamp-2 leading-tight">
                  {tone.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Speaking Rate & Emphasis (Right, 5 cols) */}
      <div className="lg:col-span-5 flex flex-col justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
        {/* Speaking Rate Slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Gauge className="w-4 h-4 text-sky-400" />
              <span>Speaking Rate</span>
            </div>
            <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
              {rate.toFixed(2)}x
            </span>
          </div>

          <input
            type="range"
            min="0.75"
            max="1.4"
            step="0.05"
            value={rate}
            onChange={(e) => onRateChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 mb-2"
          />

          {/* Quick Preset Buttons */}
          <div className="flex items-center justify-between gap-1 text-[11px]">
            {[
              { val: 0.85, label: 'Story (0.85x)' },
              { val: 1.0, label: 'Normal (1.0x)' },
              { val: 1.15, label: 'Ad Reel (1.15x)' },
              { val: 1.3, label: 'Hype (1.3x)' },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => onRateChange(preset.val)}
                className={`px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  Math.abs(rate - preset.val) < 0.02
                    ? 'bg-sky-500 text-white font-semibold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Emphasis Level Selector */}
        <div className="pt-2.5 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Volume2 className="w-4 h-4 text-purple-400" />
              <span>Vocal Emphasis & Punch</span>
            </div>
            <span className="text-[11px] text-slate-400 capitalize">{emphasis}</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'subtle', label: 'Subtle', labelAr: 'هادئ' },
              { id: 'balanced', label: 'Balanced', labelAr: 'متوازن' },
              { id: 'punchy', label: 'Punchy', labelAr: 'قوي' },
              { id: 'maximum', label: 'Maximum', labelAr: 'أقصى' },
            ].map((emp) => (
              <button
                key={emp.id}
                type="button"
                onClick={() => onEmphasisChange(emp.id as any)}
                className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer ${
                  emphasis === emp.id
                    ? 'bg-purple-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="text-[11px] font-medium">{emp.label}</div>
                <div className="text-[9px] text-slate-400 font-arabic">{emp.labelAr}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
