export type CellType = 'given' | 'slot' | 'operator' | 'blank';

export type OperatorType = '+' | '-' | '×' | '÷' | '=';

export interface GridCell {
  id: string; // e.g. "r0c2"
  row: number;
  col: number;
  type: CellType;
  value?: number | OperatorType; // for given or operator
  solution?: number; // target number for slot
  currentValue?: number | null; // currently placed number by player
  tileId?: string | null; // id of the rack tile currently in this cell
  isError?: boolean;
  isHinted?: boolean;
}

export interface RackTile {
  id: string;
  value: number;
  isUsed: boolean;
  placedInCellId: string | null;
}

export interface Equation {
  id: string;
  direction: 'horizontal' | 'vertical';
  cells: string[]; // cell IDs in order: [num1, op, num2, eq, result]
  op: '+' | '-' | '×' | '÷';
  isComplete: boolean;
  isCorrect: boolean;
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

export interface LevelData {
  id: string;
  name: string;
  difficulty: Difficulty;
  rows: number;
  cols: number;
  cells: Record<string, GridCell>;
  rackValues: number[];
}

export interface MoveAction {
  type: 'place' | 'remove' | 'swap';
  tileId: string;
  cellId: string;
  prevValue?: number | null;
  prevTileId?: string | null;
}

export interface LevelProgress {
  levelId: string;
  completed: boolean;
  bestTimeSeconds?: number;
  stars?: number; // 1, 2, or 3
}

export interface PlayerProfile {
  totalStars: number;
  solvedCount: number;
  unlimitedLeaves: boolean;
  streakDays: number;
  currentLevelIndex: number;
}
