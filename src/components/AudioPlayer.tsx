import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Repeat,
  Sparkles,
  FileAudio,
  Check,
  Share2,
} from 'lucide-react';
import { convertWavToMp3BlobAsync, audioBufferToWav, renderWithRate } from '../utils/audioUtils';

interface AudioPlayerProps {
  audioBase64: string;
  mimeType?: string;
  voiceName: string;
  tone: string;
  language: string;
  rate: number;
  emphasis: string;
  scriptSnippet: string;
  onTakeSaved?: (take: any) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioBase64,
  voiceName,
  tone,
  language,
  rate,
  emphasis,
  scriptSnippet,
  onTakeSaved,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isLooping, setIsLooping] = useState(false);

  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [wavArrayBuffer, setWavArrayBuffer] = useState<ArrayBuffer | null>(null);

  const [isExportingMp3, setIsExportingMp3] = useState(false);
  const [isExportingWav, setIsExportingWav] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Initialize and decode audio
  useEffect(() => {
    if (!audioBase64) return;

    try {
      const binary = atob(audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const rawWavBuffer = bytes.buffer;
      setWavArrayBuffer(rawWavBuffer);

      const blob = new Blob([bytes], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // Decode into AudioBuffer to compute waveform peaks
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtx
        .decodeAudioData(rawWavBuffer.slice(0))
        .then((decodedBuffer) => {
          setAudioBuffer(decodedBuffer);
          setDuration(decodedBuffer.duration);

          // Extract waveform peaks (e.g. 100 bars)
          const channelData = decodedBuffer.getChannelData(0);
          const barCount = 100;
          const blockSize = Math.floor(channelData.length / barCount);
          const computedPeaks: number[] = [];

          for (let i = 0; i < barCount; i++) {
            let max = 0;
            const start = i * blockSize;
            for (let j = 0; j < blockSize; j++) {
              const val = Math.abs(channelData[start + j] || 0);
              if (val > max) max = val;
            }
            computedPeaks.push(Math.max(0.08, max));
          }
          setPeaks(computedPeaks);
        })
        .catch((err) => {
          console.warn('Could not decode audio data for waveform:', err);
        });

      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      console.error('Error preparing audio buffer:', err);
    }
  }, [audioBase64]);

  // Handle Play/Pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Spacebar hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement)?.tagName !== 'TEXTAREA' && (e.target as HTMLElement)?.tagName !== 'INPUT') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  // Audio element events
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !duration) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    handleSeek(ratio * duration);
  };

  // Draw Waveform Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || peaks.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const progress = duration > 0 ? currentTime / duration : 0;
    const barWidth = width / peaks.length;
    const gap = 1.5;

    for (let i = 0; i < peaks.length; i++) {
      const peak = peaks[i];
      const barHeight = Math.max(4, peak * (height - 8));
      const x = i * barWidth;
      const y = (height - barHeight) / 2;

      const barProgress = i / peaks.length;
      const isPast = barProgress <= progress;

      if (isPast) {
        // Active played gradient
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(1, '#818cf8');
        ctx.fillStyle = grad;
      } else {
        // Remaining unplayed bar
        ctx.fillStyle = '#334155';
      }

      ctx.beginPath();
      ctx.roundRect(x + gap / 2, y, Math.max(1, barWidth - gap), barHeight, 2);
      ctx.fill();
    }
  }, [peaks, currentTime, duration]);

  // Export as MP3
  const handleExportMp3 = async () => {
    if (!audioBuffer) return;
    try {
      setIsExportingMp3(true);

      // If user altered playback speed, render with rate
      const renderedBuffer =
        playbackSpeed !== 1.0 ? await renderWithRate(audioBuffer, playbackSpeed) : audioBuffer;
      const renderedWav = audioBufferToWav(renderedBuffer);

      const mp3Blob = await convertWavToMp3BlobAsync(renderedWav, 192);
      const url = URL.createObjectURL(mp3Blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `sawtify_${voiceName.toLowerCase()}_${tone}_${language}_${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating MP3 export:', err);
    } finally {
      setIsExportingMp3(false);
    }
  };

  // Export as WAV
  const handleExportWav = async () => {
    if (!audioBuffer) return;
    try {
      setIsExportingWav(true);

      const renderedBuffer =
        playbackSpeed !== 1.0 ? await renderWithRate(audioBuffer, playbackSpeed) : audioBuffer;
      const wavData = audioBufferToWav(renderedBuffer);

      const wavBlob = new Blob([wavData], { type: 'audio/wav' });
      const url = URL.createObjectURL(wavBlob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `sawtify_${voiceName.toLowerCase()}_${tone}_${language}_${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting WAV:', err);
    } finally {
      setIsExportingWav(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-2xl backdrop-blur-md">
      {/* Hidden native audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
          loop={isLooping}
        />
      )}

      {/* Top Meta Details */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">
                Master Take: {voiceName}
              </span>
              <span className="text-xs text-slate-400 capitalize">· {tone}</span>
              <span className="text-xs text-slate-400 capitalize">· {language === 'moroccan_darija' ? 'Darija' : 'Arabic'}</span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-md mt-0.5">
              {scriptSnippet ? `"${scriptSnippet.slice(0, 70)}..."` : 'Voiceover ready'}
            </p>
          </div>
        </div>

        {/* Speed & Loop toggles */}
        <div className="flex items-center gap-1.5 text-xs">
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700/60">
            {[0.8, 1.0, 1.25, 1.5].map((spd) => (
              <button
                key={spd}
                onClick={() => handleSpeedChange(spd)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  playbackSpeed === spd
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsLooping(!isLooping)}
            title="Toggle Loop"
            className={`p-2 rounded-lg border transition-colors ${
              isLooping
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Waveform Canvas */}
      <div className="relative mb-3 group cursor-pointer bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
        <canvas
          ref={canvasRef}
          width={650}
          height={64}
          onClick={handleCanvasClick}
          className="w-full h-16 block rounded"
        />

        {/* Scrubber pointer indicator on hover */}
        <div className="flex justify-between items-center text-xs text-slate-400 mt-2 px-1">
          <span className="font-mono">{formatTime(currentTime)}</span>
          <span className="text-[11px] text-slate-500 font-sans">
            Press [Space] to Play/Pause · Click waveform to seek
          </span>
          <span className="font-mono">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Transport & Export Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Left: Playback & Volume */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-transform active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={() => handleSeek(0)}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            title="Replay from beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Volume Slider */}
          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/60">
            <button
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                if (audioRef.current) audioRef.current.muted = nextMute;
              }}
              className="text-slate-400 hover:text-white"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
                setIsMuted(false);
                if (audioRef.current) {
                  audioRef.current.volume = val;
                  audioRef.current.muted = false;
                }
              }}
              className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        {/* Right: Export Deck (MP3 & WAV) */}
        <div className="flex items-center gap-2">
          {/* MP3 Export Button */}
          <button
            onClick={handleExportMp3}
            disabled={isExportingMp3 || !audioBuffer}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95 cursor-pointer"
          >
            {isExportingMp3 ? (
              <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
            ) : (
              <FileAudio className="w-4 h-4 text-indigo-200" />
            )}
            <span>Export MP3</span>
            <span className="text-[10px] bg-indigo-700/80 px-1.5 py-0.5 rounded text-indigo-100">192k</span>
          </button>

          {/* WAV Export Button */}
          <button
            onClick={handleExportWav}
            disabled={isExportingWav || !audioBuffer}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-semibold border border-slate-700 transition-all active:scale-95 cursor-pointer"
          >
            {isExportingWav ? (
              <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
            ) : (
              <Download className="w-4 h-4 text-slate-300" />
            )}
            <span>Export WAV</span>
            <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-300">Lossless</span>
          </button>
        </div>
      </div>
    </div>
  );
};
