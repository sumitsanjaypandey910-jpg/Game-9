import { GridCell, Equation, OperatorType } from '../types';

// Detect all 5-element equations in the grid (Horizontal and Vertical)
export function extractEquations(cells: Record<string, GridCell>, rows: number, cols: number): Equation[] {
  const equations: Equation[] = [];

  // Horizontal equations: [num, op, num, '=', num]
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c <= cols - 5; c++) {
      const c0 = cells[`r${r}c${c}`];
      const c1 = cells[`r${r}c${c + 1}`];
      const c2 = cells[`r${r}c${c + 2}`];
      const c3 = cells[`r${r}c${c + 3}`];
      const c4 = cells[`r${r}c${c + 4}`];

      if (
        c0 && c1 && c2 && c3 && c4 &&
        (c0.type === 'given' || c0.type === 'slot') &&
        c1.type === 'operator' && ['+', '-', '×', '÷'].includes(c1.value as string) &&
        (c2.type === 'given' || c2.type === 'slot') &&
        c3.type === 'operator' && c3.value === '=' &&
        (c4.type === 'given' || c4.type === 'slot')
      ) {
        equations.push({
          id: `h_${r}_${c}`,
          direction: 'horizontal',
          cells: [c0.id, c1.id, c2.id, c3.id, c4.id],
          op: c1.value as '+' | '-' | '×' | '÷',
          isComplete: false,
          isCorrect: false,
        });
      }
    }
  }

  // Vertical equations: [num, op, num, '=', num]
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r <= rows - 5; r++) {
      const c0 = cells[`r${r}c${c}`];
      const c1 = cells[`r${r + 1}c${c}`];
      const c2 = cells[`r${r + 2}c${c}`];
      const c3 = cells[`r${r + 3}c${c}`];
      const c4 = cells[`r${r + 4}c${c}`];

      if (
        c0 && c1 && c2 && c3 && c4 &&
        (c0.type === 'given' || c0.type === 'slot') &&
        c1.type === 'operator' && ['+', '-', '×', '÷'].includes(c1.value as string) &&
        (c2.type === 'given' || c2.type === 'slot') &&
        c3.type === 'operator' && c3.value === '=' &&
        (c4.type === 'given' || c4.type === 'slot')
      ) {
        equations.push({
          id: `v_${r}_${c}`,
          direction: 'vertical',
          cells: [c0.id, c1.id, c2.id, c3.id, c4.id],
          op: c1.value as '+' | '-' | '×' | '÷',
          isComplete: false,
          isCorrect: false,
        });
      }
    }
  }

  return equations;
}

export function getCellValue(cell: GridCell): number | null {
  if (cell.type === 'given' && typeof cell.value === 'number') {
    return cell.value;
  }
  if (cell.type === 'slot') {
    return cell.currentValue ?? null;
  }
  return null;
}

export function calculateOp(a: number, op: OperatorType, b: number): number {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '×': return a * b;
    case '÷': return b !== 0 ? a / b : NaN;
    default: return NaN;
  }
}

// Evaluate status of all equations in real-time
export function evaluateGameState(
  cells: Record<string, GridCell>,
  equations: Equation[]
): {
  evaluatedEquations: Equation[];
  hasError: boolean;
  isCompleted: boolean;
  erroneousCellIds: Set<string>;
  solvedEquationIds: Set<string>;
} {
  const erroneousCellIds = new Set<string>();
  const solvedEquationIds = new Set<string>();
  let allCompleteAndCorrect = true;
  let totalSlots = 0;
  let filledSlots = 0;

  (Object.values(cells) as GridCell[]).forEach(cell => {
    if (cell.type === 'slot') {
      totalSlots++;
      if (cell.currentValue !== null && cell.currentValue !== undefined) {
        filledSlots++;
      }
    }
  });

  const evaluatedEquations = equations.map(eq => {
    const c0 = cells[eq.cells[0]];
    const c1 = cells[eq.cells[1]];
    const c2 = cells[eq.cells[2]];
    const c4 = cells[eq.cells[4]];

    const valA = getCellValue(c0);
    const valB = getCellValue(c2);
    const valC = getCellValue(c4);
    const op = c1.value as OperatorType;

    const isComplete = valA !== null && valB !== null && valC !== null;
    let isCorrect = false;

    if (isComplete) {
      const calculated = calculateOp(valA!, op, valB!);
      // Use small epsilon for floating point division safety
      isCorrect = Math.abs(calculated - valC!) < 0.0001;

      if (!isCorrect) {
        // Mark the user slots as errors
        if (c0.type === 'slot') erroneousCellIds.add(c0.id);
        if (c2.type === 'slot') erroneousCellIds.add(c2.id);
        if (c4.type === 'slot') erroneousCellIds.add(c4.id);
        allCompleteAndCorrect = false;
      } else {
        solvedEquationIds.add(eq.id);
      }
    } else {
      allCompleteAndCorrect = false;
    }

    return {
      ...eq,
      isComplete,
      isCorrect,
    };
  });

  const isCompleted = allCompleteAndCorrect && totalSlots > 0 && filledSlots === totalSlots;

  return {
    evaluatedEquations,
    hasError: erroneousCellIds.size > 0,
    isCompleted,
    erroneousCellIds,
    solvedEquationIds,
  };
}
