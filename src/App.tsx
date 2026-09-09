import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GridCell, RackTile, MoveAction, LevelData, LevelProgress, PlayerProfile } from './types';
import { ALL_LEVELS } from './data/levels';
import { extractEquations, evaluateGameState } from './utils/puzzleEngine';
import { soundManager } from './utils/audio';
import { loadLevelProgress, saveLevelProgress, loadPlayerProfile } from './utils/storage';
import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { Rack } from './components/Rack';
import { ActionControls } from './components/ActionControls';
import { VictoryModal } from './components/VictoryModal';
import { PauseModal } from './components/PauseModal';
import { DifficultyModal } from './components/DifficultyModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { Dashboard } from './components/Dashboard';

export default function App() {
  // Screen routing: 'dashboard' or 'game'
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'game'>('dashboard');

  // Persistence: Player profile & level progress
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(() => loadPlayerProfile());
  const [levelProgress, setLevelProgress] = useState<Record<string, LevelProgress>>(() =>
    loadLevelProgress()
  );

  // Current level index in ALL_LEVELS (starts with Level 1 - Easy Starter!)
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(() => {
    const prof = loadPlayerProfile();
    return Math.min(prof.currentLevelIndex, ALL_LEVELS.length - 1);
  });

  const currentLevel = ALL_LEVELS[currentLevelIndex] || ALL_LEVELS[0];

  // Board grid cells
  const [cells, setCells] = useState<Record<string, GridCell>>(() =>
    JSON.parse(JSON.stringify(currentLevel.cells))
  );

  // Rack tiles
  const [rackTiles, setRackTiles] = useState<RackTile[]>(() =>
    currentLevel.rackValues.map((val, idx) => ({
      id: `tile_${idx}_${val}`,
      value: val,
      isUsed: false,
      placedInCellId: null,
    }))
  );

  // Selections
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);

  // Move history for Undo/Redo
  const [history, setHistory] = useState<MoveAction[]>([]);
  const [future, setFuture] = useState<MoveAction[]>([]);

  // Timer & state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(() => soundManager.isEnabled());

  // Modals
  const [isVictory, setIsVictory] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState(false);
  const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState(false);

  // Extract all 5-item equations for current level
  const equations = useMemo(
    () => extractEquations(cells, currentLevel.rows, currentLevel.cols),
    [cells, currentLevel.rows, currentLevel.cols]
  );

  // Real-time gameState evaluation
  const gameState = useMemo(
    () => evaluateGameState(cells, equations),
    [cells, equations]
  );

  // Set of cell IDs in the currently active/focused equation (row or col containing selectedCellId)
  const activeEquationCellIds = useMemo(() => {
    if (!selectedCellId) return new Set<string>();
    const set = new Set<string>();
    equations.forEach((eq) => {
      if (eq.cells.includes(selectedCellId)) {
        eq.cells.forEach((id) => set.add(id));
      }
    });
    return set;
  }, [selectedCellId, equations]);

  // Set of cell IDs in any currently solved/completed equations
  const solvedCellIds = useMemo(() => {
    const set = new Set<string>();
    equations.forEach((eq) => {
      if (gameState.solvedEquationIds.has(eq.id)) {
        eq.cells.forEach((id) => set.add(id));
      }
    });
    return set;
  }, [equations, gameState.solvedEquationIds]);

  // Previous solved equations count to play chime
  const [prevSolvedCount, setPrevSolvedCount] = useState(0);

  useEffect(() => {
    const solvedCount = gameState.solvedEquationIds.size;
    if (solvedCount > prevSolvedCount && prevSolvedCount > 0) {
      soundManager.playEquationSolved();
    }
    setPrevSolvedCount(solvedCount);

    if (gameState.isCompleted && !isVictory) {
      setIsVictory(true);
      // Save progress to persistent storage
      saveLevelProgress(currentLevel.id, elapsedSeconds, hintsUsed);
      setLevelProgress(loadLevelProgress());
      setPlayerProfile(loadPlayerProfile());
    }
  }, [gameState, prevSolvedCount, isVictory, currentLevel.id, elapsedSeconds, hintsUsed]);

  // Timer interval (only runs while on game screen)
  useEffect(() => {
    if (currentScreen !== 'game' || isPaused || isVictory || isPauseModalOpen) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentScreen, isPaused, isVictory, isPauseModalOpen]);

  // Load a new level
  const loadLevelByIndex = useCallback((index: number) => {
    const targetIdx = Math.max(0, Math.min(index, ALL_LEVELS.length - 1));
    const targetLevel = ALL_LEVELS[targetIdx];
    setCurrentLevelIndex(targetIdx);
    setCells(JSON.parse(JSON.stringify(targetLevel.cells)));
    setRackTiles(
      targetLevel.rackValues.map((val, idx) => ({
        id: `tile_${idx}_${val}`,
        value: val,
        isUsed: false,
        placedInCellId: null,
      }))
    );
    setSelectedCellId(null);
    setSelectedTileId(null);
    setHistory([]);
    setFuture([]);
    setElapsedSeconds(0);
    setHintsUsed(0);
    setIsVictory(false);
    setIsPaused(false);
    setIsPauseModalOpen(false);
    setIsDifficultyModalOpen(false);
    setPrevSolvedCount(0);
  }, []);

  const handleStartLevelFromDashboard = (index: number) => {
    soundManager.playTap();
    loadLevelByIndex(index);
    setCurrentScreen('game');
  };

  // Core action: place tile into cell
  const placeTileInCell = useCallback(
    (cellId: string, tileId: string, recordHistory = true) => {
      const targetCell = cells[cellId];
      const targetTile = rackTiles.find((t) => t.id === tileId);

      if (!targetCell || targetCell.type !== 'slot' || !targetTile) {
        return;
      }

      const prevTileId = targetCell.tileId;
      const prevValue = targetCell.currentValue;

      // Update cells
      setCells((prev) => ({
        ...prev,
        [cellId]: {
          ...prev[cellId],
          currentValue: targetTile.value,
          tileId: targetTile.id,
        },
      }));

      // Update rack
      setRackTiles((prev) =>
        prev.map((t) => {
          if (t.id === targetTile.id) {
            return { ...t, isUsed: true, placedInCellId: cellId };
          }
          if (prevTileId && t.id === prevTileId) {
            // Return displaced tile back to rack
            return { ...t, isUsed: false, placedInCellId: null };
          }
          return t;
        })
      );

      soundManager.playPlace();

      if (recordHistory) {
        setHistory((prev) => [
          ...prev,
          {
            type: 'place',
            cellId,
            tileId: targetTile.id,
            prevValue,
            prevTileId,
          },
        ]);
        setFuture([]);
      }

      setSelectedCellId(null);
      setSelectedTileId(null);
    },
    [cells, rackTiles]
  );

  // Core action: remove tile from cell
  const removeTileFromCell = useCallback(
    (cellId: string, recordHistory = true) => {
      const targetCell = cells[cellId];
      if (!targetCell || targetCell.type !== 'slot' || !targetCell.tileId) {
        return;
      }

      const removedTileId = targetCell.tileId;
      const removedValue = targetCell.currentValue;

      setCells((prev) => ({
        ...prev,
        [cellId]: {
          ...prev[cellId],
          currentValue: null,
          tileId: null,
          isHinted: false,
        },
      }));

      setRackTiles((prev) =>
        prev.map((t) =>
          t.id === removedTileId ? { ...t, isUsed: false, placedInCellId: null } : t
        )
      );

      soundManager.playTap();

      if (recordHistory) {
        setHistory((prev) => [
          ...prev,
          {
            type: 'remove',
            cellId,
            tileId: removedTileId,
            prevValue: removedValue,
          },
        ]);
        setFuture([]);
      }

      setSelectedCellId(null);
      setSelectedTileId(null);
    },
    [cells]
  );

  // Click handler for board cells
  const handleCellClick = (cellId: string) => {
    const cell = cells[cellId];
    if (!cell || cell.type !== 'slot') return;

    if (cell.currentValue !== null && cell.tileId) {
      if (selectedTileId) {
        placeTileInCell(cellId, selectedTileId);
      } else {
        removeTileFromCell(cellId);
      }
      return;
    }

    if (selectedTileId) {
      placeTileInCell(cellId, selectedTileId);
      return;
    }

    setSelectedCellId((prev) => (prev === cellId ? null : cellId));
  };

  // Click handler for rack tiles
  const handleTileClick = (tileId: string) => {
    const tile = rackTiles.find((t) => t.id === tileId);
    if (!tile) return;

    if (tile.isUsed && tile.placedInCellId) {
      removeTileFromCell(tile.placedInCellId);
      return;
    }

    if (selectedCellId) {
      placeTileInCell(selectedCellId, tileId);
      return;
    }

    setSelectedTileId((prev) => (prev === tileId ? null : tileId));
    soundManager.playTap();
  };

  // Drag and drop handlers
  const handleDragStartTile = (e: React.DragEvent, tileId: string) => {
    if (e?.dataTransfer) {
      e.dataTransfer.setData('text/plain', tileId);
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDropTile = (cellId: string, tileId: string) => {
    if (cellId && tileId) {
      placeTileInCell(cellId, tileId);
    }
  };

  // Undo action
  const handleUndo = () => {
    if (history.length === 0) return;
    const lastAction = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));

    if (lastAction.type === 'place') {
      const targetCell = cells[lastAction.cellId];
      if (targetCell) {
        setCells((prev) => ({
          ...prev,
          [lastAction.cellId]: {
            ...prev[lastAction.cellId],
            currentValue: lastAction.prevValue || null,
            tileId: lastAction.prevTileId || null,
          },
        }));

        setRackTiles((prev) =>
          prev.map((t) => {
            if (t.id === lastAction.tileId) {
              return { ...t, isUsed: false, placedInCellId: null };
            }
            if (lastAction.prevTileId && t.id === lastAction.prevTileId) {
              return { ...t, isUsed: true, placedInCellId: lastAction.cellId };
            }
            return t;
          })
        );
      }
    } else if (lastAction.type === 'remove') {
      const tile = rackTiles.find((t) => t.id === lastAction.tileId);
      if (tile) {
        setCells((prev) => ({
          ...prev,
          [lastAction.cellId]: {
            ...prev[lastAction.cellId],
            currentValue: tile.value,
            tileId: tile.id,
          },
        }));

        setRackTiles((prev) =>
          prev.map((t) =>
            t.id === lastAction.tileId
              ? { ...t, isUsed: true, placedInCellId: lastAction.cellId }
              : t
          )
        );
      }
    }

    setFuture((prev) => [lastAction, ...prev]);
    soundManager.playTap();
  };

  // Redo action
  const handleRedo = () => {
    if (future.length === 0) return;
    const nextAction = future[0];
    setFuture((prev) => prev.slice(1));

    if (nextAction.type === 'place') {
      placeTileInCell(nextAction.cellId, nextAction.tileId, false);
    } else if (nextAction.type === 'remove') {
      removeTileFromCell(nextAction.cellId, false);
    }

    setHistory((prev) => [...prev, nextAction]);
    soundManager.playTap();
  };

  // Reset action
  const handleReset = () => {
    soundManager.playReset();
    setCells((prev) => {
      const reset = { ...prev };
      Object.keys(reset).forEach((id) => {
        if (reset[id].type === 'slot') {
          reset[id] = {
            ...reset[id],
            currentValue: null,
            tileId: null,
            isHinted: false,
          };
        }
      });
      return reset;
    });

    setRackTiles((prev) =>
      prev.map((t) => ({ ...t, isUsed: false, placedInCellId: null }))
    );

    setSelectedCellId(null);
    setSelectedTileId(null);
    setHistory([]);
    setFuture([]);
  };

  // Hint logic: finds an empty or incorrect slot and places the correct number
  const handleUseHint = () => {
    const targetSlot = (Object.values(cells) as GridCell[]).find(
      (c) => c.type === 'slot' && (c.currentValue === null || c.currentValue !== c.solution)
    );

    if (!targetSlot || targetSlot.solution === undefined) return;

    const correctTile = rackTiles.find(
      (t) => t.value === targetSlot.solution && !t.isUsed
    );

    if (correctTile) {
      if (targetSlot.currentValue !== null) {
        removeTileFromCell(targetSlot.id);
      }
      placeTileInCell(targetSlot.id, correctTile.id);
      setCells((prev) => ({
        ...prev,
        [targetSlot.id]: {
          ...prev[targetSlot.id],
          isHinted: true,
        },
      }));
      setHintsUsed((prev) => prev + 1);
      soundManager.playHint();
    } else {
      const misplacedTile = rackTiles.find(
        (t) => t.value === targetSlot.solution && t.placedInCellId
      );
      if (misplacedTile && misplacedTile.placedInCellId) {
        removeTileFromCell(misplacedTile.placedInCellId);
        placeTileInCell(targetSlot.id, misplacedTile.id);
        setCells((prev) => ({
          ...prev,
          [targetSlot.id]: {
            ...prev[targetSlot.id],
            isHinted: true,
          },
        }));
        setHintsUsed((prev) => prev + 1);
        soundManager.playHint();
      }
    }
  };

  // Next level navigation
  const handleNextLevel = () => {
    const nextIndex = (currentLevelIndex + 1) % ALL_LEVELS.length;
    loadLevelByIndex(nextIndex);
  };

  return (
    <>
      {currentScreen === 'dashboard' ? (
        /* SCREEN 1: DASHBOARD */
        <Dashboard
          playerProfile={playerProfile}
          levelProgress={levelProgress}
          currentLevelIndex={currentLevelIndex}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            const newState = soundManager.toggleSound();
            setSoundEnabled(newState);
          }}
          onOpenHowToPlay={() => setIsHowToPlayModalOpen(true)}
          onStartLevel={handleStartLevelFromDashboard}
        />
      ) : (
        /* SCREEN 2: GAMEPLAY SCREEN */
        <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#4c468a] text-white flex flex-col justify-between items-center relative overflow-hidden select-none font-sans overscroll-none">
          {/* Top Header with Home/Dashboard button & Unlimited Leaves badge */}
          <Header
            elapsedSeconds={elapsedSeconds}
            isPaused={isPaused}
            difficulty={currentLevel.difficulty}
            hintCount={0}
            levelName={currentLevel.name}
            onPauseToggle={() => {
              soundManager.playTap();
              setIsPaused(true);
              setIsPauseModalOpen(true);
            }}
            onOpenDifficulty={() => {
              soundManager.playTap();
              setIsDifficultyModalOpen(true);
            }}
            onUseHint={handleUseHint}
            onGoToDashboard={() => {
              soundManager.playTap();
              setCurrentScreen('dashboard');
            }}
          />

          {/* Main Interactive Crossword Grid */}
          <GameBoard
            cells={cells}
            rows={currentLevel.rows}
            cols={currentLevel.cols}
            selectedCellId={selectedCellId}
            erroneousCellIds={gameState.erroneousCellIds}
            solvedEquationIds={gameState.solvedEquationIds}
            activeEquationCellIds={activeEquationCellIds}
            solvedCellIds={solvedCellIds}
            onCellClick={handleCellClick}
            onDropTile={handleDropTile}
          />

          {/* Bottom Number Tray (Rack) */}
          <div className="w-full shrink-0 pb-1 sm:pb-2">
            <Rack
              tiles={rackTiles}
              selectedTileId={selectedTileId}
              onTileClick={handleTileClick}
              onDragStartTile={handleDragStartTile}
            />

            {/* Action Controls: Undo, Redo, Reset */}
            <ActionControls
              canUndo={history.length > 0}
              canRedo={future.length > 0}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onReset={handleReset}
            />
          </div>

          {/* Modals */}
          {isVictory && (
            <VictoryModal
              timeSeconds={elapsedSeconds}
              hintsUsed={hintsUsed}
              levelName={currentLevel.name}
              onNextLevel={handleNextLevel}
              onReplay={() => loadLevelByIndex(currentLevelIndex)}
              onSelectLevel={() => {
                setIsVictory(false);
                setCurrentScreen('dashboard');
              }}
            />
          )}

          <PauseModal
            isOpen={isPauseModalOpen}
            soundEnabled={soundEnabled}
            onSoundToggle={() => {
              const newState = soundManager.toggleSound();
              setSoundEnabled(newState);
            }}
            onResume={() => {
              setIsPauseModalOpen(false);
              setIsPaused(false);
            }}
            onRestart={() => {
              setIsPauseModalOpen(false);
              setIsPaused(false);
              handleReset();
            }}
            onOpenHowToPlay={() => {
              setIsHowToPlayModalOpen(true);
            }}
          />

          <DifficultyModal
            isOpen={isDifficultyModalOpen}
            currentLevelId={currentLevel.id}
            onSelectLevel={(level) => {
              soundManager.playTap();
              const idx = ALL_LEVELS.findIndex((l) => l.id === level.id);
              if (idx !== -1) {
                loadLevelByIndex(idx);
              }
            }}
            onClose={() => setIsDifficultyModalOpen(false)}
          />

          <HowToPlayModal
            isOpen={isHowToPlayModalOpen}
            onClose={() => setIsHowToPlayModalOpen(false)}
          />
        </div>
      )}
    </>
  );
}
