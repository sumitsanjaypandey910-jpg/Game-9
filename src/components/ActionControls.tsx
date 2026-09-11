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
    <div className="w-full max-w-[460px] mx-auto px-3 xs:px-4 py-1.5 sm:py-2.5 flex items-center justify-between select-none">
      {/* Undo & Redo on the left */}
      <div className="flex items-center gap-2 xs:gap-3">
        <button
          id="undo-button"
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo move"
          className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl border border-white/25 bg-white/10 hover:bg-white/15 active:bg-white/25 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all cursor-pointer shadow-sm"
        >
          <Undo2 className="w-4 h-4 xs:w-5 xs:h-5 stroke-[2.2]" />
        </button>

        <button
          id="redo-button"
          onClick={onRedo}
          disabled={!canRedo}
          aria-label="Redo move"
          className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl border border-white/25 bg-white/10 hover:bg-white/15 active:bg-white/25 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all cursor-pointer shadow-sm"
        >
          <Redo2 className="w-4 h-4 xs:w-5 xs:h-5 stroke-[2.2]" />
        </button>
      </div>

      {/* Reset on the right */}
      <button
        id="reset-button"
        onClick={onReset}
        aria-label="Reset puzzle"
        className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl border border-white/25 bg-white/10 hover:bg-white/15 active:bg-white/25 flex items-center justify-center text-white transition-all cursor-pointer shadow-sm"
      >
        <RotateCcw className="w-4 h-4 xs:w-5 xs:h-5 stroke-[2.2]" />
      </button>
    </div>
  );
};
