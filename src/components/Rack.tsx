import React from 'react';
import { RackTile } from '../types';

interface RackProps {
  tiles: RackTile[];
  selectedTileId: string | null;
  onTileClick: (tile: RackTile) => void;
  onDragStartTile: (tile: RackTile, e: React.DragEvent) => void;
}

export const Rack: React.FC<RackProps> = ({
  tiles,
  selectedTileId,
  onTileClick,
  onDragStartTile,
}) => {
  // Split rack into 2 equal rows (typically 6 tiles per row, as in screenshot)
  const half = Math.ceil(tiles.length / 2);
  const row1 = tiles.slice(0, half);
  const row2 = tiles.slice(half);

  const renderTileButton = (tile: RackTile) => {
    const isSelected = selectedTileId === tile.id;

    if (tile.isUsed) {
      // Tile has already been placed on the board: show ghost recessed slot
      return (
        <div
          key={tile.id}
          className="w-11 h-11 sm:w-13 sm:h-13 rounded-lg sm:rounded-xl bg-black/20 border border-white/10 flex items-center justify-center opacity-40 cursor-default"
        >
          <span className="text-white/30 font-bold text-sm sm:text-base tabular-nums">
            {tile.value}
          </span>
        </div>
      );
    }

    return (
      <button
        key={tile.id}
        id={`rack-tile-${tile.id}`}
        draggable
        onDragStart={(e) => onDragStartTile(tile, e)}
        onClick={() => onTileClick(tile)}
        aria-label={`Number tile ${tile.value}`}
        className={`w-11 h-11 sm:w-13 sm:h-13 rounded-lg sm:rounded-xl flex items-center justify-center font-black text-base sm:text-lg tabular-nums cursor-grab active:cursor-grabbing transition-transform select-none ${
          isSelected
            ? 'tile-3d-green-selected ring-2 ring-amber-300'
            : 'tile-3d-green hover:brightness-105 hover:-translate-y-0.5'
        }`}
      >
        <span className="leading-none">{tile.value}</span>
      </button>
    );
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-3 py-2 flex flex-col items-center gap-2 select-none">
      {/* Row 1 */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full">
        {row1.map(renderTileButton)}
      </div>

      {/* Row 2 */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full">
        {row2.map(renderTileButton)}
      </div>
    </div>
  );
};
