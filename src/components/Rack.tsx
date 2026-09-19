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
  // Split rack into 2 equal rows
  const half = Math.ceil(tiles.length / 2);
  const row1 = tiles.slice(0, half);
  const row2 = tiles.slice(half);

  const maxInRow = Math.max(row1.length, row2.length, 1);

  // Dynamic large button sizing based on how many tiles are in the row
  const getTileSizeClasses = () => {
    if (maxInRow <= 3) {
      return 'w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-xl sm:rounded-2xl';
    }
    if (maxInRow <= 4) {
      return 'w-13 h-13 xs:w-15 xs:h-15 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl sm:rounded-2xl';
    }
    if (maxInRow <= 5) {
      return 'w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-xl sm:rounded-2xl';
    }
    if (maxInRow <= 6) {
      return 'w-11 h-11 xs:w-13 xs:h-13 sm:w-15 sm:h-15 md:w-16 md:h-16 rounded-xl sm:rounded-2xl';
    }
    return 'w-10 h-10 xs:w-11 xs:h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-lg sm:rounded-xl';
  };

  // Big, bold font sizes with responsive scaling for single or multi-digit values
  const getFontSizeClass = (val: number) => {
    const len = Math.abs(val).toString().length;
    if (maxInRow <= 3) {
      if (len >= 3) return 'text-2xl xs:text-3xl sm:text-4xl';
      if (len === 2) return 'text-3xl xs:text-4xl sm:text-5xl';
      return 'text-4xl xs:text-5xl sm:text-6xl';
    }
    if (maxInRow <= 4) {
      if (len >= 3) return 'text-xl xs:text-2xl sm:text-3xl';
      if (len === 2) return 'text-2xl xs:text-3xl sm:text-4xl';
      return 'text-3xl xs:text-4xl sm:text-5xl';
    }
    if (maxInRow <= 5) {
      if (len >= 3) return 'text-lg xs:text-xl sm:text-2xl';
      if (len === 2) return 'text-xl xs:text-2xl sm:text-3xl';
      return 'text-2xl xs:text-3xl sm:text-4xl';
    }
    if (maxInRow <= 6) {
      if (len >= 3) return 'text-base xs:text-lg sm:text-xl';
      if (len === 2) return 'text-lg xs:text-xl sm:text-2xl';
      return 'text-xl xs:text-2xl sm:text-3xl';
    }
    if (len >= 3) return 'text-sm xs:text-base sm:text-lg';
    if (len === 2) return 'text-base xs:text-lg sm:text-xl';
    return 'text-lg xs:text-xl sm:text-2xl';
  };

  const tileSizeClasses = getTileSizeClasses();

  const renderTileButton = (tile: RackTile) => {
    const isSelected = selectedTileId === tile.id;
    const fontSizeClass = getFontSizeClass(tile.value);

    if (tile.isUsed) {
      // Tile has already been placed on the board: show 3D recessed slot
      return (
        <div
          key={tile.id}
          className={`${tileSizeClasses} tile-slot-recessed flex items-center justify-center cursor-default`}
        >
          <span
            className={`leading-none num-3d-recessed font-black ${fontSizeClass} tabular-nums select-none`}
          >
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
        className={`${tileSizeClasses} flex items-center justify-center font-black ${fontSizeClass} tabular-nums cursor-grab active:cursor-grabbing transition-all select-none ${
          isSelected
            ? 'tile-3d-green-selected ring-4 ring-amber-300'
            : 'tile-3d-green hover:brightness-105 active:scale-[0.98]'
        }`}
      >
        <span className="leading-none num-3d-green font-black select-none pointer-events-none">
          {tile.value}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full max-w-[500px] mx-auto px-2 xs:px-3 py-1.5 sm:py-2.5 flex flex-col items-center gap-2 sm:gap-2.5 select-none">
      {/* Row 1 */}
      <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 w-full">
        {row1.map(renderTileButton)}
      </div>

      {/* Row 2 */}
      <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 w-full">
        {row2.map(renderTileButton)}
      </div>
    </div>
  );
};
