import React from 'react';
import { RackTile } from '../types';

interface RackProps {
  tiles: RackTile[];
  selectedTileId: string | null;
  onTileClick: (tileId: string) => void;
  onDragStartTile: (e: React.DragEvent, tileId: string) => void;
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
          className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 max-w-[50px] rounded-lg sm:rounded-xl bg-black/25 border border-white/10 flex items-center justify-center opacity-40 cursor-default"
        >
          <span className="text-white/30 font-bold text-sm xs:text-base sm:text-lg tabular-nums">
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
        onDragStart={(e) => onDragStartTile(e, tile.id)}
        onClick={() => onTileClick(tile.id)}
        aria-label={`Number tile ${tile.value}`}
        className={`w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 max-w-[50px] rounded-lg sm:rounded-xl flex items-center justify-center font-black text-base xs:text-lg sm:text-xl md:text-2xl tabular-nums cursor-grab active:cursor-grabbing transition-all select-none ${
          isSelected
            ? 'tile-3d-green-selected ring-3 ring-amber-300'
            : 'tile-3d-green hover:brightness-105 hover:-translate-y-0.5'
        }`}
      >
        <span className="leading-none text-[#052e16] font-black drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]">
          {tile.value}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full max-w-[460px] mx-auto px-2 xs:px-3 py-1 sm:py-2 flex flex-col items-center gap-1.5 sm:gap-2 select-none">
      {/* Row 1 */}
      <div className="flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 w-full">
        {row1.map(renderTileButton)}
      </div>

      {/* Row 2 */}
      <div className="flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 w-full">
        {row2.map(renderTileButton)}
      </div>
    </div>
  );
};
