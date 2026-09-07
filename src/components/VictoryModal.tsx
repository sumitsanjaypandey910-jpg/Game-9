import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, ArrowRight, RotateCcw, List } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface VictoryModalProps {
  timeSeconds: number;
  hintsUsed: number;
  levelName: string;
  onNextLevel: () => void;
  onReplay: () => void;
  onSelectLevel: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  timeSeconds,
  hintsUsed,
  levelName,
  onNextLevel,
  onReplay,
  onSelectLevel,
}) => {
  useEffect(() => {
    soundManager.playWin();

    // Trigger celebratory confetti burst
    const end = Date.now() + 1200;
    const colors = ['#86efac', '#38bdf8', '#fbbf24', '#f472b6', '#a78bfa'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem.toString().padStart(2, '0')}`;
  };

  const stars = hintsUsed === 0 ? 3 : hintsUsed <= 2 ? 2 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-[#383272] border border-white/20 rounded-2xl p-6 text-white text-center shadow-2xl flex flex-col items-center">
        {/* Trophy icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center mb-4 text-amber-300">
          <Trophy className="w-9 h-9" />
        </div>

        <h2 className="text-2xl font-black mb-1 tracking-wide">Excellent!</h2>
        <p className="text-white/70 text-sm font-medium mb-4">{levelName} Solved</p>

        {/* Stars */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((starIndex) => (
            <Star
              key={starIndex}
              className={`w-8 h-8 ${
                starIndex <= stars
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]'
                  : 'text-white/20'
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 w-full mb-6">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-white/60 block">Time</span>
            <span className="text-lg font-bold font-mono text-emerald-300">
              {formatTime(timeSeconds)}
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-white/60 block">Hints Used</span>
            <span className="text-lg font-bold font-mono text-amber-300">
              {hintsUsed}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            id="modal-next-level"
            onClick={onNextLevel}
            className="w-full py-3.5 px-4 rounded-xl tile-3d-green font-bold text-base flex items-center justify-center gap-2 cursor-pointer transition hover:brightness-105"
          >
            <span>Next Level</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              id="modal-replay"
              onClick={onReplay}
              className="py-2.5 px-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay</span>
            </button>
            <button
              id="modal-levels"
              onClick={onSelectLevel}
              className="py-2.5 px-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              <List className="w-4 h-4" />
              <span>Levels</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
