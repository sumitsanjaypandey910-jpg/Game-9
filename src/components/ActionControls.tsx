import React from 'react';
import { RotateCcw, Undo2, Redo2 } from 'lucide-react';

interface ActionControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
}) => {
  return (
    <div className="w-full max-w-[420px] mx-auto px-4 py-3 flex items-center justify-between select-none">
      {/* Undo & Redo on the left */}
      <div className="flex items-center gap-3">
        <button
          id="undo-button"
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo move"
          className="w-11 h-11 rounded-xl border border-white/25 bg-white/10 hover:bg-white/15 active:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all cursor-pointer shadow-sm"
        >
          <Undo2 className="w-5 h-5 stroke-[2.2]" />
        </button>

        <button
          id="redo-button"
          onClick={onRedo}
          disabled={!canRedo}
          aria-label="Redo move"
          className="w-11 h-11 rounded-xl border border-white/25 bg-white/10 hover:bg-white/15 active:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all cursor-pointer shadow-sm"
        >
          <Redo2 className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>

      {/* Reset on the right */}
      <button
        id="reset-button"
        onClick={onReset}
        aria-label="Reset puzzle"
        className="w-11 h-11 rounded-xl border border-white/25 bg-white/10 hover:bg-white/15 active:bg-white/25 flex items-center justify-center text-white transition-all cursor-pointer shadow-sm"
      >
        <RotateCcw className="w-5 h-5 stroke-[2.2]" />
      </button>
    </div>
  );
};
