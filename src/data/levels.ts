import { GridCell, LevelData, Difficulty } from '../types';

// Helper to construct level grid cleanly
function buildGrid(
  rows: number,
  cols: number,
  definitions: Array<{
    r: number;
    c: number;
    type: 'given' | 'slot' | 'operator';
    value?: number | '+' | '-' | '×' | '÷' | '=';
    solution?: number;
  }>
): Record<string, GridCell> {
  const cells: Record<string, GridCell> = {};

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = `r${r}c${c}`;
      cells[id] = {
        id,
        row: r,
        col: c,
        type: 'blank',
      };
    }
  }

  for (const def of definitions) {
    const id = `r${def.r}c${def.c}`;
    cells[id] = {
      id,
      row: def.r,
      col: def.c,
      type: def.type,
      value: def.value,
      solution: def.solution,
      currentValue: null,
      tileId: null,
    };
  }

  return cells;
}

// ----------------------------------------------------
// LEVEL 1: Easy Starter (5x5) - Gentle Addition
// ----------------------------------------------------
// Row 0: [2] + 3 = [5]
// Row 2: [4] + 1 = [5]
// Row 4: [6] + 4 = [10]
// Col 0: 2 + 4 = 6
// Col 4: 5 + 5 = 10
const level1Definitions: Array<{
  r: number;
  c: number;
  type: 'given' | 'slot' | 'operator';
  value?: number | '+' | '-' | '×' | '÷' | '=';
  solution?: number;
}> = [
  // Row 0: [2] + 3 = [5]
  { r: 0, c: 0, type: 'slot', solution: 2 },
  { r: 0, c: 1, type: 'operator', value: '+' },
  { r: 0, c: 2, type: 'given', value: 3 },
  { r: 0, c: 3, type: 'operator', value: '=' },
  { r: 0, c: 4, type: 'slot', solution: 5 },

  // Vertical operators
  { r: 1, c: 0, type: 'operator', value: '+' },
  { r: 1, c: 4, type: 'operator', value: '+' },

  // Row 2: [4] + 1 = [5]
  { r: 2, c: 0, type: 'slot', solution: 4 },
  { r: 2, c: 1, type: 'operator', value: '+' },
  { r: 2, c: 2, type: 'given', value: 1 },
  { r: 2, c: 3, type: 'operator', value: '=' },
  { r: 2, c: 4, type: 'slot', solution: 5 },

  // Vertical operators
  { r: 3, c: 0, type: 'operator', value: '=' },
  { r: 3, c: 4, type: 'operator', value: '=' },

  // Row 4: [6] + 4 = [10]
  { r: 4, c: 0, type: 'slot', solution: 6 },
  { r: 4, c: 1, type: 'operator', value: '+' },
  { r: 4, c: 2, type: 'given', value: 4 },
  { r: 4, c: 3, type: 'operator', value: '=' },
  { r: 4, c: 4, type: 'slot', solution: 10 },
];

export const LEVEL_1: LevelData = {
  id: 'level_1_easy_starter',
  name: 'Level 1 • Easy Starter',
  difficulty: 'EASY',
  rows: 5,
  cols: 5,
  cells: buildGrid(5, 5, level1Definitions),
  rackValues: [2, 4, 5, 5, 6, 10],
};

// ----------------------------------------------------
// LEVEL 2: Add & Subtract (5x5)
// ----------------------------------------------------
// Row 0: [9] - 4 = [5]
// Row 2: [3] + 4 = [7]
// Row 4: [6] + 6 = [12]
// Col 0: 9 - 3 = 6
// Col 4: 5 + 7 = 12
const level2Definitions: Array<{
  r: number;
  c: number;
  type: 'given' | 'slot' | 'operator';
  value?: number | '+' | '-' | '×' | '÷' | '=';
  solution?: number;
}> = [
  // Row 0: [9] - 4 = [5]
  { r: 0, c: 0, type: 'slot', solution: 9 },
  { r: 0, c: 1, type: 'operator', value: '-' },
  { r: 0, c: 2, type: 'given', value: 4 },
  { r: 0, c: 3, type: 'operator', value: '=' },
  { r: 0, c: 4, type: 'slot', solution: 5 },

  // Vertical operators
  { r: 1, c: 0, type: 'operator', value: '-' },
  { r: 1, c: 4, type: 'operator', value: '+' },

  // Row 2: [3] + 4 = [7]
  { r: 2, c: 0, type: 'slot', solution: 3 },
  { r: 2, c: 1, type: 'operator', value: '+' },
  { r: 2, c: 2, type: 'given', value: 4 },
  { r: 2, c: 3, type: 'operator', value: '=' },
  { r: 2, c: 4, type: 'slot', solution: 7 },

  // Vertical operators
  { r: 3, c: 0, type: 'operator', value: '=' },
  { r: 3, c: 4, type: 'operator', value: '=' },

  // Row 4: [6] + 6 = [12]
  { r: 4, c: 0, type: 'slot', solution: 6 },
  { r: 4, c: 1, type: 'operator', value: '+' },
  { r: 4, c: 2, type: 'given', value: 6 },
  { r: 4, c: 3, type: 'operator', value: '=' },
  { r: 4, c: 4, type: 'slot', solution: 12 },
];

export const LEVEL_2: LevelData = {
  id: 'level_2_step_up',
  name: 'Level 2 • Step Up',
  difficulty: 'EASY',
  rows: 5,
  cols: 5,
  cells: buildGrid(5, 5, level2Definitions),
  rackValues: [3, 5, 6, 7, 9, 12],
};

// ----------------------------------------------------
// LEVEL 3: Dual Operations (7x7) - Medium
// ----------------------------------------------------
// Row 0: 15 + [18] = [33]
// Row 2: [3] ... [15] + 5 = 20
// Row 4: [45] - [27] = [18] ... [2]
// Row 6: [9] ... [40]
// Row 8: 7 × 4 = [28]
const level3Definitions: Array<{
  r: number;
  c: number;
  type: 'given' | 'slot' | 'operator';
  value?: number | '+' | '-' | '×' | '÷' | '=';
  solution?: number;
}> = [
  // R0: 12 + [8] = [20]
  { r: 0, c: 0, type: 'given', value: 12 },
  { r: 0, c: 1, type: 'operator', value: '+' },
  { r: 0, c: 2, type: 'slot', solution: 8 },
  { r: 0, c: 3, type: 'operator', value: '=' },
  { r: 0, c: 4, type: 'slot', solution: 20 },

  // Vertical operators
  { r: 1, c: 0, type: 'operator', value: '×' },
  { r: 1, c: 4, type: 'operator', value: '-' },

  // R2: [3] + 5 = [8] ... [6]
  { r: 2, c: 0, type: 'slot', solution: 3 },
  { r: 2, c: 4, type: 'slot', solution: 6 },
  { r: 2, c: 5, type: 'operator', value: '=' },
  { r: 2, c: 6, type: 'slot', solution: 14 },

  // Vertical operators
  { r: 3, c: 0, type: 'operator', value: '=' },
  { r: 3, c: 4, type: 'operator', value: '=' },

  // R4: [36] - [22] = [14]
  { r: 4, c: 0, type: 'slot', solution: 36 },
  { r: 4, c: 1, type: 'operator', value: '-' },
  { r: 4, c: 2, type: 'slot', solution: 22 },
  { r: 4, c: 3, type: 'operator', value: '=' },
  { r: 4, c: 4, type: 'slot', solution: 14 },
  { r: 4, c: 5, type: 'operator', value: '+' },
  { r: 4, c: 6, type: 'given', value: 10 },
];

export const LEVEL_3: LevelData = {
  id: 'level_3_medium',
  name: 'Level 3 • Dual Flow',
  difficulty: 'MEDIUM',
  rows: 5,
  cols: 5,
  cells: buildGrid(5, 5, [
    { r: 0, c: 0, type: 'given', value: 12 },
    { r: 0, c: 1, type: 'operator', value: '+' },
    { r: 0, c: 2, type: 'slot', solution: 8 },
    { r: 0, c: 3, type: 'operator', value: '=' },
    { r: 0, c: 4, type: 'slot', solution: 20 },

    { r: 1, c: 0, type: 'operator', value: '×' },
    { r: 1, c: 4, type: 'operator', value: '-' },

    { r: 2, c: 0, type: 'slot', solution: 3 },
    { r: 2, c: 1, type: 'operator', value: '×' },
    { r: 2, c: 2, type: 'given', value: 2 },
    { r: 2, c: 3, type: 'operator', value: '=' },
    { r: 2, c: 4, type: 'slot', solution: 6 },

    { r: 3, c: 0, type: 'operator', value: '=' },
    { r: 3, c: 4, type: 'operator', value: '=' },

    { r: 4, c: 0, type: 'slot', solution: 36 },
    { r: 4, c: 1, type: 'operator', value: '-' },
    { r: 4, c: 2, type: 'slot', solution: 22 },
    { r: 4, c: 3, type: 'operator', value: '=' },
    { r: 4, c: 4, type: 'slot', solution: 14 },
  ]),
  rackValues: [3, 6, 8, 14, 20, 22, 36],
};

// ----------------------------------------------------
// LEVEL 4: Classic Crossmath (The Screenshot Level!)
// 9x9 Medium Matrix with 12 rack tiles
// ----------------------------------------------------
const level4Definitions: Array<{
  r: number;
  c: number;
  type: 'given' | 'slot' | 'operator';
  value?: number | '+' | '-' | '×' | '÷' | '=';
  solution?: number;
}> = [
  // Row 0: 6 + 2 = [8]
  { r: 0, c: 2, type: 'given', value: 6 },
  { r: 0, c: 3, type: 'operator', value: '+' },
  { r: 0, c: 4, type: 'given', value: 2 },
  { r: 0, c: 5, type: 'operator', value: '=' },
  { r: 0, c: 6, type: 'slot', solution: 8 },

  // Row 1: vertical operator
  { r: 1, c: 6, type: 'operator', value: '-' },

  // Row 2: [22] × [4] = 88
  { r: 2, c: 4, type: 'slot', solution: 22 },
  { r: 2, c: 5, type: 'operator', value: '×' },
  { r: 2, c: 6, type: 'slot', solution: 4 },
  { r: 2, c: 7, type: 'operator', value: '=' },
  { r: 2, c: 8, type: 'given', value: 88 },

  // Row 3: vertical operators
  { r: 3, c: 4, type: 'operator', value: '-' },
  { r: 3, c: 6, type: 'operator', value: '=' },

  // Row 4: 50 ... 4 ... [9] + [4] = [13]
  { r: 4, c: 0, type: 'given', value: 50 },
  { r: 4, c: 2, type: 'given', value: 4 },
  { r: 4, c: 4, type: 'slot', solution: 9 },
  { r: 4, c: 5, type: 'operator', value: '+' },
  { r: 4, c: 6, type: 'slot', solution: 4 },
  { r: 4, c: 7, type: 'operator', value: '=' },
  { r: 4, c: 8, type: 'slot', solution: 13 },

  // Row 5: vertical operators
  { r: 5, c: 0, type: 'operator', value: '+' },
  { r: 5, c: 2, type: 'operator', value: '×' },
  { r: 5, c: 4, type: 'operator', value: '=' },
  { r: 5, c: 8, type: 'operator', value: '+' },

  // Row 6: [26] - [13] = [13] ... [53]
  { r: 6, c: 0, type: 'slot', solution: 26 },
  { r: 6, c: 1, type: 'operator', value: '-' },
  { r: 6, c: 2, type: 'slot', solution: 13 },
  { r: 6, c: 3, type: 'operator', value: '=' },
  { r: 6, c: 4, type: 'slot', solution: 13 },
  { r: 6, c: 8, type: 'slot', solution: 53 },

  // Row 7: vertical operators
  { r: 7, c: 0, type: 'operator', value: '=' },
  { r: 7, c: 2, type: 'operator', value: '=' },
  { r: 7, c: 8, type: 'operator', value: '=' },

  // Row 8: 76 ... 52 ... 11 × [6] = [66]
  { r: 8, c: 0, type: 'given', value: 76 },
  { r: 8, c: 2, type: 'given', value: 52 },
  { r: 8, c: 4, type: 'given', value: 11 },
  { r: 8, c: 5, type: 'operator', value: '×' },
  { r: 8, c: 6, type: 'slot', solution: 6 },
  { r: 8, c: 7, type: 'operator', value: '=' },
  { r: 8, c: 8, type: 'slot', solution: 66 },
];

export const LEVEL_4: LevelData = {
  id: 'level_4_screenshot_classic',
  name: 'Level 4 • Classic Crossmath',
  difficulty: 'MEDIUM',
  rows: 9,
  cols: 9,
  cells: buildGrid(9, 9, level4Definitions),
  // Exactly matching the screenshot rack!
  rackValues: [4, 4, 6, 8, 9, 13, 13, 13, 22, 26, 53, 66],
};

// ----------------------------------------------------
// LEVEL 5: Number Labyrinth (Hard - 9x9)
// ----------------------------------------------------
// Fully connected, mathematically verified 9x9 matrix:
// 1. R0 (c=2..6): [48] ÷ 6 = [8]
// 2. C2 (r=0..4): [48] - [32] = [16]
// 3. R2 (c=2..6): [32] - 15 = [17]
// 4. C6 (r=0..4): [8] + [17] = [25]
// 5. R4 (c=2..6): [16] + 9 = [25]
// 6. C6 (r=4..8): [25] + [7] = [32]
// 7. R6 (c=0..4): [14] - 8 = 6
// 8. R8 (c=2..6): [56] - [24] = [32]
const level5Definitions: Array<{
  r: number;
  c: number;
  type: 'given' | 'slot' | 'operator';
  value?: number | '+' | '-' | '×' | '÷' | '=';
  solution?: number;
}> = [
  // R0 (c=2..6): [48] ÷ 6 = [8]
  { r: 0, c: 2, type: 'slot', solution: 48 },
  { r: 0, c: 3, type: 'operator', value: '÷' },
  { r: 0, c: 4, type: 'given', value: 6 },
  { r: 0, c: 5, type: 'operator', value: '=' },
  { r: 0, c: 6, type: 'slot', solution: 8 },

  // C2 & C6 upper operators
  { r: 1, c: 2, type: 'operator', value: '-' },
  { r: 1, c: 6, type: 'operator', value: '+' },

  // R2 (c=2..6): [32] - 15 = [17]
  { r: 2, c: 2, type: 'slot', solution: 32 },
  { r: 2, c: 3, type: 'operator', value: '-' },
  { r: 2, c: 4, type: 'given', value: 15 },
  { r: 2, c: 5, type: 'operator', value: '=' },
  { r: 2, c: 6, type: 'slot', solution: 17 },

  // C2 & C6 mid operators
  { r: 3, c: 2, type: 'operator', value: '=' },
  { r: 3, c: 6, type: 'operator', value: '=' },

  // R4 (c=2..6): [16] + 9 = [25]
  { r: 4, c: 2, type: 'slot', solution: 16 },
  { r: 4, c: 3, type: 'operator', value: '+' },
  { r: 4, c: 4, type: 'given', value: 9 },
  { r: 4, c: 5, type: 'operator', value: '=' },
  { r: 4, c: 6, type: 'slot', solution: 25 },

  // C6 lower operator
  { r: 5, c: 6, type: 'operator', value: '+' },

  // R6 (c=0..4): [14] - 8 = 6 & C6 (r=6): [7]
  { r: 6, c: 0, type: 'slot', solution: 14 },
  { r: 6, c: 1, type: 'operator', value: '-' },
  { r: 6, c: 2, type: 'given', value: 8 },
  { r: 6, c: 3, type: 'operator', value: '=' },
  { r: 6, c: 4, type: 'given', value: 6 },
  { r: 6, c: 6, type: 'slot', solution: 7 },

  // C6 bottom operator
  { r: 7, c: 6, type: 'operator', value: '=' },

  // R8 (c=2..6): [56] - [24] = [32]
  { r: 8, c: 2, type: 'slot', solution: 56 },
  { r: 8, c: 3, type: 'operator', value: '-' },
  { r: 8, c: 4, type: 'slot', solution: 24 },
  { r: 8, c: 5, type: 'operator', value: '=' },
  { r: 8, c: 6, type: 'slot', solution: 32 },
];

export const LEVEL_5: LevelData = {
  id: 'level_5_hard_labyrinth',
  name: 'Level 5 • Hard Labyrinth',
  difficulty: 'HARD',
  rows: 9,
  cols: 9,
  cells: buildGrid(9, 9, level5Definitions),
  rackValues: [7, 8, 14, 16, 17, 24, 25, 32, 32, 48, 56],
};

// ----------------------------------------------------
// LEVEL 6: Expert Matrix (Expert - 7x7)
// ----------------------------------------------------
// Fully connected 7x7 Crossmath matrix:
// 1. R0 (c=0..4): [84] ÷ 7 = [12]
// 2. C0 (r=0..4): [84] - [36] = [48]
// 3. R4 (c=0..4): [48] - [19] = [29]
// 4. C4 (r=0..4): [12] + [17] = [29]
// 5. R2 (c=2..6): [20] × 3 = [60]
// 6. C2 (r=2..6): [20] + [19] = [39]
// 7. R6 (c=2..6): [39] - 14 = [25]
// 8. C6 (r=2..6): [60] - 35 = [25]
const level6Definitions: Array<{
  r: number;
  c: number;
  type: 'given' | 'slot' | 'operator';
  value?: number | '+' | '-' | '×' | '÷' | '=';
  solution?: number;
}> = [
  // R0 (c=0..4): [84] ÷ 7 = [12]
  { r: 0, c: 0, type: 'slot', solution: 84 },
  { r: 0, c: 1, type: 'operator', value: '÷' },
  { r: 0, c: 2, type: 'given', value: 7 },
  { r: 0, c: 3, type: 'operator', value: '=' },
  { r: 0, c: 4, type: 'slot', solution: 12 },

  // C0 & C4 upper operators
  { r: 1, c: 0, type: 'operator', value: '-' },
  { r: 1, c: 4, type: 'operator', value: '+' },

  // R2 (c=2..6): [20] × 3 = [60] & C0 (r=2): [36]
  { r: 2, c: 0, type: 'slot', solution: 36 },
  { r: 2, c: 2, type: 'slot', solution: 20 },
  { r: 2, c: 3, type: 'operator', value: '×' },
  { r: 2, c: 4, type: 'given', value: 3 },
  { r: 2, c: 5, type: 'operator', value: '=' },
  { r: 2, c: 6, type: 'slot', solution: 60 },

  // C0 & C2 & C4 & C6 operators
  { r: 3, c: 0, type: 'operator', value: '=' },
  { r: 3, c: 2, type: 'operator', value: '+' },
  { r: 3, c: 4, type: 'operator', value: '=' },
  { r: 3, c: 6, type: 'operator', value: '-' },

  // R4 (c=0..4): [48] - [19] = [29] & C6 (r=4): 35
  { r: 4, c: 0, type: 'slot', solution: 48 },
  { r: 4, c: 1, type: 'operator', value: '-' },
  { r: 4, c: 2, type: 'slot', solution: 19 },
  { r: 4, c: 3, type: 'operator', value: '=' },
  { r: 4, c: 4, type: 'slot', solution: 29 },
  { r: 4, c: 6, type: 'given', value: 35 },

  // C2 & C6 lower operators
  { r: 5, c: 2, type: 'operator', value: '=' },
  { r: 5, c: 6, type: 'operator', value: '=' },

  // R6 (c=2..6): [39] - 14 = [25]
  { r: 6, c: 2, type: 'slot', solution: 39 },
  { r: 6, c: 3, type: 'operator', value: '-' },
  { r: 6, c: 4, type: 'given', value: 14 },
  { r: 6, c: 5, type: 'operator', value: '=' },
  { r: 6, c: 6, type: 'slot', solution: 25 },
];

export const LEVEL_6: LevelData = {
  id: 'level_6_expert_matrix',
  name: 'Level 6 • Expert Matrix',
  difficulty: 'EXPERT',
  rows: 7,
  cols: 7,
  cells: buildGrid(7, 7, level6Definitions),
  rackValues: [12, 19, 20, 25, 29, 36, 39, 48, 60, 84],
};

// Ordered progression starting EASY and scaling up smoothly to EXPERT
export const ALL_LEVELS: LevelData[] = [
  LEVEL_1, // Start easy
  LEVEL_2, // Easy step up
  LEVEL_3, // Medium dual
  LEVEL_4, // Screenshot classic 9x9
  LEVEL_5, // Hard labyrinth
  LEVEL_6, // Expert matrix
];
