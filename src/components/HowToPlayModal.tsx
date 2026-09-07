import React from 'react';
import { X, CheckCircle2, Sparkles, MousePointerClick } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#3a3474] border border-white/20 rounded-2xl p-5 text-white shadow-2xl flex flex-col max-h-[85vh]">
        <div className="w-full flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold tracking-wide flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            How to Play
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 text-sm text-white/85 overflow-y-auto pr-1">
          {/* Rule 1 */}
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5">Solve the Equations</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Place numbers into the empty dark slots so that every horizontal and vertical equation is mathematically correct.
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5">Tap or Drag Tiles</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Tap an empty slot and then tap a number from your rack to place it. You can also drag numbers directly onto slots, or tap placed numbers to return them.
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5">Need a Hint?</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Tap the lightbulb button at the top right to automatically reveal and place a correct number.
              </p>
            </div>
          </div>

          {/* Example illustration */}
          <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-center">
            <div className="text-xs text-white/60 mb-2 font-medium">Example Row:</div>
            <div className="flex items-center justify-center gap-1.5 font-black text-sm">
              <span className="w-7 h-7 rounded-lg tile-3d-white flex items-center justify-center">6</span>
              <span className="w-7 h-7 rounded-lg tile-3d-white flex items-center justify-center text-slate-700">+</span>
              <span className="w-7 h-7 rounded-lg tile-3d-white flex items-center justify-center">2</span>
              <span className="w-7 h-7 rounded-lg tile-3d-white flex items-center justify-center text-slate-700">=</span>
              <span className="w-7 h-7 rounded-lg tile-3d-green flex items-center justify-center">8</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl tile-3d-green font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition hover:brightness-105 mt-1"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Got It, Let's Play!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
