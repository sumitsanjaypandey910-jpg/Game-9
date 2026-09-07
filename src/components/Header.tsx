import React, { useState } from 'react';
import { Pause, Lightbulb, Home, X, CheckCircle2 } from 'lucide-react';
import { Difficulty } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  elapsedSeconds: number;
  isPaused: boolean;
  difficulty: Difficulty;
  hintCount: number;
  levelName?: string;
  onPauseToggle: () => void;
  onOpenDifficulty: () => void;
  onUseHint: () => void;
  onGoToDashboard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  elapsedSeconds,
  difficulty,
  hintCount,
  levelName,
  onPauseToggle,
  onOpenDifficulty,
  onUseHint,
  onGoToDashboard,
}) => {
  const [showLeavesPopup, setShowLeavesPopup] = useState(false);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <header className="w-full flex items-center justify-between px-3.5 py-2.5 select-none bg-black/10 border-b border-white/10 backdrop-blur-sm">
        {/* Left: Home / Dashboard & Pause/Timer button */}
        <div className="flex items-center gap-2">
          <button
            id="header-home-button"
            onClick={onGoToDashboard}
            aria-label="Back to Dashboard"
            className="p-2 rounded-lg border border-white/30 bg-white/10 hover:bg-white/15 active:scale-95 transition text-white cursor-pointer group"
            title="Return to Dashboard"
          >
            <Home className="w-4 h-4 text-white/90 group-hover:text-emerald-300 transition-colors" />
          </button>

          <button
            id="pause-timer-button"
            onClick={onPauseToggle}
            aria-label="Pause game"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/15 active:bg-white/20 transition text-white font-bold text-sm tracking-wider cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span className="tabular-nums font-mono text-sm font-semibold">
              {formatTime(elapsedSeconds)}
            </span>
          </button>
        </div>

        {/* Center: Unlimited Leaves Badge */}
        <button
          id="header-leaves-badge"
          onClick={() => setShowLeavesPopup(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 hover:bg-emerald-500/30 transition text-emerald-300 text-xs font-black cursor-pointer shadow-sm"
          title="Unlimited Leaves Active"
        >
          <span className="text-sm">🍃</span>
          <span>∞</span>
        </button>

        {/* Right: Difficulty badge & Hint button */}
        <div className="flex items-center gap-2">
          <button
            id="difficulty-badge-button"
            onClick={onOpenDifficulty}
            aria-label="Change difficulty"
            className="px-2.5 py-1.5 rounded-lg border border-white/35 bg-white/10 hover:bg-white/15 active:bg-white/20 transition text-white font-bold text-[11px] tracking-wider uppercase cursor-pointer"
          >
            {difficulty}
          </button>

          <button
            id="hint-button"
            onClick={onUseHint}
            aria-label="Use hint"
            className="relative p-2 rounded-lg border border-white/35 bg-white/10 hover:bg-white/15 active:bg-white/20 transition text-white cursor-pointer group"
          >
            <Lightbulb className="w-4 h-4 text-white/90 group-hover:text-yellow-300 transition-colors" />
            {hintCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow">
                {hintCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Unlimited Leaves quick explanation modal */}
      <AnimatePresence>
        {showLeavesPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xs bg-[#4a4287] rounded-2xl p-5 border border-white/20 shadow-2xl relative text-center"
            >
              <button
                onClick={() => setShowLeavesPopup(false)}
                className="absolute top-3 right-3 p-1 rounded-full bg-white/10 text-white/70 hover:bg-white/20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl mx-auto mb-3">
                🍃
              </div>

              <h4 className="text-base font-extrabold text-white mb-0.5">Unlimited Leaves</h4>
              <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-3">
                Play Without Boundaries
              </p>

              <p className="text-xs text-white/80 leading-relaxed mb-4">
                You have unlimited leaves! There are no penalties for wrong placements, no timers, and no heart depletion.
              </p>

              <button
                onClick={() => setShowLeavesPopup(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow hover:bg-emerald-400 transition cursor-pointer"
              >
                Continue Playing
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

