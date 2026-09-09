import React, { useState } from 'react';
import { GridCell } from '../types';

interface GameBoardProps {
  cells: Record<string, GridCell>;
  rows: number;
  cols: number;
  selectedCellId: string | null;
  erroneousCellIds: Set<string>;
  solvedEquationIds: Set<string>;
  activeEquationCellIds?: Set<string>;
  solvedCellIds?: Set<string>;
  onCellClick: (cellId: string) => void;
  onDropTile: (cellId: string, tileId: string) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  cells,
  rows,
  cols,
  selectedCellId,
  erroneousCellIds,
  activeEquationCellIds = new Set(),
  solvedCellIds = new Set(),
  onCellClick,
  onDropTile,
}) => {
  const [dragOverCellId, setDragOverCellId] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent, cellId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCellId !== cellId) {
      setDragOverCellId(cellId);
    }
  };

  const handleDragLeave = () => {
    setDragOverCellId(null);
  };

  const handleDrop = (e: React.DragEvent, cellId: string) => {
    e.preventDefault();
    setDragOverCellId(null);
    const tileId = e.dataTransfer.getData('text/plain');
    if (tileId) {
      onDropTile(cellId, tileId);
    }
  };

  // Dynamic board sizing responsive to both screen width and vertical height
  const isLargeGrid = cols >= 9;
  const boardSizeConstraint = isLargeGrid
    ? 'min(94vw, calc(100dvh - 200px), 410px)'
    : 'min(84vw, calc(100dvh - 220px), 330px)';

  return (
    <div className="w-full flex-1 min-h-0 flex items-center justify-center p-1 sm:p-2 overflow-hidden select-none">
      <div
        className="grid mx-auto"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gap: isLargeGrid ? '3px' : '6px',
          width: boardSizeConstraint,
          height: boardSizeConstraint,
          padding: isLargeGrid ? '2px' : '4px',
        }}
      >
        {Array.from({ length: rows }).flatMap((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const id = `r${r}c${c}`;
            const cell = cells[id];

            if (!cell || cell.type === 'blank') {
              return <div key={id} className="w-full h-full pointer-events-none" />;
            }

            const isSelected = selectedCellId === id;
            const isDragTarget = dragOverCellId === id;
            const isError = erroneousCellIds.has(id);
            const isInActiveEquation = activeEquationCellIds.has(id);
            const isInSolvedEquation = solvedCellIds.has(id);

            const isGiven = cell.type === 'given';
            const isOperator = cell.type === 'operator';
            const isSlot = cell.type === 'slot';
            const hasPlacedNumber = isSlot && cell.currentValue !== null && cell.currentValue !== undefined;

            // Render Operators with crisp, bold, high-contrast symbols (+, -, ×, ÷, =)
            if (isOperator) {
              const isEquals = cell.value === '=';
              let operatorClasses = 'tile-3d-white text-slate-950 border border-slate-200/90 shadow-[0_2.5px_0_#94a3b8] sm:shadow-[0_3.5px_0_#94a3b8]';

              if (isInActiveEquation) {
                operatorClasses = 'bg-amber-100 text-amber-950 border-amber-300 ring-2 ring-amber-400/90 shadow-[0_2.5px_0_#d97706]';
              } else if (isInSolvedEquation) {
                operatorClasses = 'bg-emerald-50 text-emerald-950 border-emerald-300 ring-1 ring-emerald-400/80 shadow-[0_2.5px_0_#16a34a]';
              }

              return (
                <div
                  key={id}
                  id={`cell-${id}`}
                  className={`w-full h-full flex items-center justify-center rounded-lg sm:rounded-xl font-black select-none transition-all ${operatorClasses}`}
                >
                  <span
                    className={`leading-none font-black drop-shadow-[0_1px_0_rgba(255,255,255,0.7)] ${
                      isLargeGrid
                        ? isEquals
                          ? 'text-xs sm:text-sm md:text-base'
                          : 'text-sm sm:text-base md:text-lg'
                        : isEquals
                        ? 'text-sm sm:text-base md:text-lg'
                        : 'text-base sm:text-lg md:text-xl'
                    }`}
                  >
                    {cell.value}
                  </span>
                </div>
              );
            }

            // Render Given Numbers with prominent high-contrast styling
            if (isGiven) {
              const valStr = cell.value?.toString() || '';
              const isMultiDigit = valStr.length > 1;
              let givenClasses = 'tile-3d-white text-slate-950 border border-slate-200/90 shadow-[0_2.5px_0_#94a3b8] sm:shadow-[0_3.5px_0_#94a3b8]';

              if (isInActiveEquation) {
                givenClasses = 'bg-amber-50 text-slate-950 border-amber-300 ring-2 ring-amber-300 shadow-[0_2.5px_0_#d97706]';
              } else if (isInSolvedEquation) {
                givenClasses = 'bg-emerald-50 text-emerald-950 border-emerald-300 ring-1 ring-emerald-400 shadow-[0_2.5px_0_#16a34a]';
              }

              return (
                <div
                  key={id}
                  id={`cell-${id}`}
                  className={`w-full h-full flex items-center justify-center rounded-lg sm:rounded-xl font-black select-none transition-all ${givenClasses}`}
                >
                  <span
                    className={`leading-none tabular-nums font-black tracking-tight drop-shadow-[0_1px_0_rgba(255,255,255,0.7)] ${
                      isLargeGrid
                        ? isMultiDigit
                          ? 'text-[11px] xs:text-xs sm:text-sm'
                          : 'text-xs xs:text-sm sm:text-base'
                        : isMultiDigit
                        ? 'text-sm sm:text-base'
                        : 'text-base sm:text-lg'
                    }`}
                  >
                    {cell.value}
                  </span>
                </div>
              );
            }

            // Render Slot (Empty or Filled with user placed Green tile)
            if (isSlot) {
              if (hasPlacedNumber) {
                const valStr = cell.currentValue!.toString();
                const isMultiDigit = valStr.length > 1;

                let placedClasses = 'tile-3d-green text-[#052e16]';
                if (isError) {
                  placedClasses = 'bg-gradient-to-b from-rose-100 to-rose-200 text-rose-950 border border-rose-300 shadow-[0_3px_0_#e11d48] ring-2 ring-rose-500 animate-pulse';
                } else if (isSelected) {
                  placedClasses = 'tile-3d-green-selected ring-3 ring-amber-300';
                } else if (isInSolvedEquation) {
                  placedClasses = 'tile-3d-green ring-2 ring-emerald-400 shadow-[0_3px_0_#15803d,0_0_8px_rgba(74,222,128,0.5)]';
                } else if (isInActiveEquation) {
                  placedClasses = 'tile-3d-green ring-2 ring-amber-300/80';
                }

                return (
                  <button
                    key={id}
                    id={`cell-${id}`}
                    onClick={() => onCellClick(id)}
                    onDragOver={(e) => handleDragOver(e, id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, id)}
                    aria-label={`Slot at row ${r + 1} column ${c + 1} with number ${cell.currentValue}. Tap to remove`}
                    className={`w-full h-full flex items-center justify-center rounded-lg sm:rounded-xl font-black transition-all cursor-pointer relative ${placedClasses} ${
                      cell.isHinted ? 'ring-2 ring-amber-300 ring-offset-1 ring-offset-purple-900' : ''
                    }`}
                  >
                    <span
                      className={`leading-none tabular-nums font-black drop-shadow-[0_1px_0_rgba(255,255,255,0.4)] ${
                        isLargeGrid
                          ? isMultiDigit
                            ? 'text-[11px] xs:text-xs sm:text-sm'
                            : 'text-xs xs:text-sm sm:text-base'
                          : isMultiDigit
                          ? 'text-sm sm:text-base'
                          : 'text-base sm:text-lg'
                      }`}
                    >
                      {cell.currentValue}
                    </span>
                    {cell.isHinted && (
                      <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                    )}
                  </button>
                );
              }

              // Empty slot (recessed square with contextual focus states)
              let slotClasses = 'tile-slot-empty hover:bg-white/15';
              if (isDragTarget) {
                slotClasses = 'bg-purple-500/50 ring-2 ring-emerald-300 scale-105';
              } else if (isSelected) {
                slotClasses = 'tile-slot-selected ring-2 ring-amber-300';
              } else if (isInActiveEquation) {
                slotClasses = 'bg-[#3b3478]/90 border-amber-400/50 ring-1 ring-amber-400/40 shadow-inner';
              }

              return (
                <button
                  key={id}
                  id={`cell-${id}`}
                  onClick={() => onCellClick(id)}
                  onDragOver={(e) => handleDragOver(e, id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, id)}
                  aria-label={`Empty slot at row ${r + 1} column ${c + 1}. Tap or drag number here`}
                  className={`w-full h-full flex items-center justify-center rounded-lg sm:rounded-xl transition-all cursor-pointer ${slotClasses}`}
                >
                  <span className="sr-only">Empty slot</span>
                </button>
              );
            }

            return <div key={id} className="w-full h-full" />;
          })
        )}
      </div>
    </div>
  );
};
