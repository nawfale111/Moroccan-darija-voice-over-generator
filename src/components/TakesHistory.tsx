import React, { useState } from 'react';
import { History, Play, Pause, Download, Trash2, FileAudio, ExternalLink } from 'lucide-react';
import { convertWavToMp3BlobAsync } from '../utils/audioUtils';

export interface VoiceoverTake {
  id: string;
  createdAt: number;
  voice: string;
  tone: string;
  language: string;
  rate: number;
  emphasis: string;
  scriptSnippet: string;
  audioBase64: string;
}

interface TakesHistoryProps {
  takes: VoiceoverTake[];
  onSelectTake: (take: VoiceoverTake) => void;
  onDeleteTake: (id: string) => void;
  onClearAll: () => void;
}

export const TakesHistory: React.FC<TakesHistoryProps> = ({
  takes,
  onSelectTake,
  onDeleteTake,
  onClearAll,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioElem, setAudioElem] = useState<HTMLAudioElement | null>(null);

  const toggleQuickPlay = (take: VoiceoverTake) => {
    if (playingId === take.id) {
      if (audioElem) {
        audioElem.pause();
      }
      setPlayingId(null);
    } else {
      if (audioElem) {
        audioElem.pause();
      }
      const sound = new Audio(`data:audio/wav;base64,${take.audioBase64}`);
      sound.onended = () => setPlayingId(null);
      sound.play().catch(console.error);
      setAudioElem(sound);
      setPlayingId(take.id);
    }
  };

  const handleDownloadWav = (take: VoiceoverTake, e: React.MouseEvent) => {
    e.stopPropagation();
    const binary = atob(take.audioBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sawtify_${take.voice}_${take.tone}_${take.id}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMp3 = async (take: VoiceoverTake, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const binary = atob(take.audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const mp3Blob = await convertWavToMp3BlobAsync(bytes.buffer, 192);
      const url = URL.createObjectURL(mp3Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sawtify_${take.voice}_${take.tone}_${take.id}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating MP3:', err);
    }
  };

  if (takes.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 text-center text-slate-500 text-xs">
        <History className="w-6 h-6 mx-auto mb-2 text-slate-600 opacity-60" />
        <p>No voiceover takes generated yet in this session.</p>
        <p className="text-[11px] text-slate-600 mt-0.5">
          Generate an audio take above to build your marketing voiceover portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" />
          <h3 className="font-semibold text-white text-sm">Session Takes & Variations</h3>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-medium">
            {takes.length} takes
          </span>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {takes.map((take) => {
          const isPlayingThis = playingId === take.id;
          return (
            <div
              key={take.id}
              onClick={() => onSelectTake(take)}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-950 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-pointer"
            >
              <div className="flex items-start sm:items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleQuickPlay(take);
                  }}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                    isPlayingThis
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                  }`}
                  title={isPlayingThis ? 'Pause' : 'Play take'}
                >
                  {isPlayingThis ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 text-xs">{take.voice}</span>
                    <span className="text-[11px] text-slate-500 capitalize">· {take.tone}</span>
                    <span className="text-[11px] text-slate-500">
                      · {take.language === 'moroccan_darija' ? '🇲🇦 Darija' : '🌐 Arabic'}
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono">
                      {take.rate}x
                    </span>
                  </div>
                  <p
                    dir="rtl"
                    className="text-xs text-slate-400 font-arabic truncate max-w-sm mt-0.5"
                  >
                    {take.scriptSnippet}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-center">
                <button
                  type="button"
                  onClick={(e) => handleDownloadMp3(take, e)}
                  title="Download MP3"
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-white text-[11px] font-medium border border-indigo-500/20 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <FileAudio className="w-3.5 h-3.5" />
                  <span>MP3</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDownloadWav(take, e)}
                  title="Download Lossless WAV"
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>WAV</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTake(take.id);
                  }}
                  title="Delete take"
                  className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
