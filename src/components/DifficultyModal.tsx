import React from 'react';
import { X, Check } from 'lucide-react';
import { Difficulty, LevelData } from '../types';
import { ALL_LEVELS } from '../data/levels';

interface DifficultyModalProps {
  isOpen: boolean;
  currentLevelId: string;
  onSelectLevel: (level: LevelData) => void;
  onClose: () => void;
}

export const DifficultyModal: React.FC<DifficultyModalProps> = ({
  isOpen,
  currentLevelId,
  onSelectLevel,
  onClose,
}) => {
  if (!isOpen) return null;

  const difficultyColors: Record<Difficulty, string> = {
    EASY: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300',
    MEDIUM: 'bg-amber-500/20 border-amber-400/40 text-amber-300',
    HARD: 'bg-orange-500/20 border-orange-400/40 text-orange-300',
    EXPERT: 'bg-rose-500/20 border-rose-400/40 text-rose-300',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#3a3474] border border-white/20 rounded-2xl p-5 text-white shadow-2xl flex flex-col max-h-[85vh]">
        <div className="w-full flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold tracking-wide">Select Level</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-white/70 mb-4">
          Choose a level to test your mental math crossword abilities.
        </p>

        <div className="flex flex-col gap-2.5 overflow-y-auto pr-1">
          {ALL_LEVELS.map((lvl) => {
            const isCurrent = lvl.id === currentLevelId;
            return (
              <button
                key={lvl.id}
                onClick={() => onSelectLevel(lvl)}
                className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition cursor-pointer ${
                  isCurrent
                    ? 'border-emerald-400/80 bg-white/15 ring-2 ring-emerald-400'
                    : 'border-white/15 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-white">
                      {lvl.name}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                        difficultyColors[lvl.difficulty]
                      }`}
                    >
                      {lvl.difficulty}
                    </span>
                  </div>
                  <span className="text-xs text-white/50 block">
                    {lvl.rows}x{lvl.cols} Grid • {lvl.rackValues.length} Numbers
                  </span>
                </div>

                {isCurrent && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-900 flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
