import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX, HelpCircle, X } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface PauseModalProps {
  isOpen: boolean;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  onResume: () => void;
  onRestart: () => void;
  onOpenHowToPlay: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  soundEnabled,
  onSoundToggle,
  onResume,
  onRestart,
  onOpenHowToPlay,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xs bg-[#3a3474] border border-white/20 rounded-2xl p-5 text-white shadow-2xl flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold tracking-wide">Game Paused</h2>
          <button
            onClick={onResume}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5 w-full">
          {/* Resume button */}
          <button
            onClick={() => {
              soundManager.playTap();
              onResume();
            }}
            className="w-full py-3 px-4 rounded-xl tile-3d-green font-bold text-base flex items-center justify-center gap-2 cursor-pointer transition hover:brightness-105"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Resume</span>
          </button>

          {/* Sound toggle button */}
          <button
            onClick={onSoundToggle}
            className="w-full py-2.5 px-4 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm flex items-center justify-between cursor-pointer transition"
          >
            <span className="flex items-center gap-2">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4 text-rose-300" />}
              Sound Effects
            </span>
            <span className="text-xs uppercase font-bold text-white/70">
              {soundEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* How to play button */}
          <button
            onClick={() => {
              soundManager.playTap();
              onOpenHowToPlay();
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm flex items-center gap-2 cursor-pointer transition"
          >
            <HelpCircle className="w-4 h-4 text-cyan-300" />
            <span>How to Play</span>
          </button>

          {/* Restart button */}
          <button
            onClick={() => {
              soundManager.playTap();
              onRestart();
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm flex items-center gap-2 cursor-pointer transition"
          >
            <RotateCcw className="w-4 h-4 text-amber-300" />
            <span>Restart Level</span>
          </button>
        </div>
      </div>
    </div>
  );
};
