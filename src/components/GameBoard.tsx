import React, { useState } from 'react';
import { GridCell } from '../types';

interface GameBoardProps {
  cells: Record<string, GridCell>;
  rows: number;
  cols: number;
  selectedCellId: string | null;
  erroneousCellIds: Set<string>;
  solvedEquationIds: Set<string>;
  onCellClick: (cell: GridCell) => void;
  onDropTile: (cellId: string, tileId: string) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  cells,
  rows,
  cols,
  selectedCellId,
  erroneousCellIds,
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

  // Render the grid
  return (
    <div className="w-full flex-1 flex items-center justify-center p-2 sm:p-3 overflow-hidden">
      <div
        className="grid gap-1 sm:gap-1.5 w-full max-w-[420px] aspect-square mx-auto p-1.5"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: rows }).flatMap((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const id = `r${r}c${c}`;
            const cell = cells[id];

            if (!cell || cell.type === 'blank') {
              return <div key={id} className="w-full h-full" />;
            }

            const isSelected = selectedCellId === id;
            const isDragTarget = dragOverCellId === id;
            const isError = erroneousCellIds.has(id);
            const isGiven = cell.type === 'given';
            const isOperator = cell.type === 'operator';
            const isSlot = cell.type === 'slot';
            const hasPlacedNumber = isSlot && cell.currentValue !== null && cell.currentValue !== undefined;

            // Render White 3D button for Given Numbers & Operators
            if (isGiven || isOperator) {
              return (
                <div
                  key={id}
                  id={`cell-${id}`}
                  className="w-full h-full flex items-center justify-center rounded-lg sm:rounded-xl tile-3d-white font-extrabold text-sm sm:text-base select-none"
                >
                  <span className={isOperator ? 'text-slate-700 text-base sm:text-lg' : 'text-slate-900'}>
                    {cell.value}
                  </span>
                </div>
              );
            }

            // Render Slot (Empty or Filled with user placed Green tile)
            if (isSlot) {
              if (hasPlacedNumber) {
                // Placed tile looks like a green 3D button slotted in
                return (
                  <button
                    key={id}
                    id={`cell-${id}`}
                    onClick={() => onCellClick(cell)}
                    onDragOver={(e) => handleDragOver(e, id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, id)}
                    aria-label={`Slot at row ${r + 1} column ${c + 1} with number ${cell.currentValue}. Click to remove`}
                    className={`w-full h-full flex items-center justify-center rounded-lg sm:rounded-xl font-extrabold text-sm sm:text-base transition-transform cursor-pointer relative ${
                      isError
                        ? 'bg-rose-100 text-rose-800 shadow-[0_4px_0_#f43f5e] ring-2 ring-rose-500'
                        : isSelected
                        ? 'tile-3d-green-selected ring-2 ring-emerald-400'
                        : 'tile-3d-green hover:brightness-105'
                    } ${cell.isHinted ? 'ring-2 ring-amber-300 ring-offset-1' : ''}`}
                  >
                    <span className="leading-none">{cell.currentValue}</span>
                    {cell.isHinted && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
                    )}
                  </button>
                );
              }

              // Empty slot (dark purple recessed square)
              return (
                <button
                  key={id}
                  id={`cell-${id}`}
                  onClick={() => onCellClick(cell)}
                  onDragOver={(e) => handleDragOver(e, id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, id)}
                  aria-label={`Empty slot at row ${r + 1} column ${c + 1}. Click or drag number here`}
                  className={`w-full h-full flex items-center justify-center rounded-lg sm:rounded-xl transition-all cursor-pointer ${
                    isDragTarget
                      ? 'bg-purple-500/50 ring-2 ring-amber-300 scale-105'
                      : isSelected
                      ? 'tile-slot-selected ring-2 ring-amber-300'
                      : 'tile-slot-empty hover:bg-white/15'
                  }`}
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
