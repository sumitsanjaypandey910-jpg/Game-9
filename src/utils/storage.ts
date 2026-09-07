import { LevelProgress, PlayerProfile } from '../types';
import { ALL_LEVELS } from '../data/levels';

const PROGRESS_KEY = 'crossmath_level_progress_v1';
const PROFILE_KEY = 'crossmath_player_profile_v1';

export function loadLevelProgress(): Record<string, LevelProgress> {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load level progress', e);
  }
  return {};
}

export function saveLevelProgress(
  levelId: string,
  timeSeconds: number,
  hintsUsed: number
): { progress: Record<string, LevelProgress>; isNewClear: boolean; stars: number } {
  const current = loadLevelProgress();
  const stars = hintsUsed === 0 ? 3 : hintsUsed <= 2 ? 2 : 1;
  const existing = current[levelId];

  const isNewClear = !existing || !existing.completed;
  const bestTime = existing?.bestTimeSeconds
    ? Math.min(existing.bestTimeSeconds, timeSeconds)
    : timeSeconds;
  const bestStars = existing?.stars ? Math.max(existing.stars, stars) : stars;

  const updated: Record<string, LevelProgress> = {
    ...current,
    [levelId]: {
      levelId,
      completed: true,
      bestTimeSeconds: bestTime,
      stars: bestStars,
    },
  };

  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save level progress', e);
  }

  return { progress: updated, isNewClear, stars: bestStars };
}

export function loadPlayerProfile(): PlayerProfile {
  const progress = loadLevelProgress();
  const completedLevels = Object.values(progress).filter((p) => p.completed);
  const totalStars = completedLevels.reduce((sum, p) => sum + (p.stars || 0), 0);

  let currentIdx = 0;
  // Find first non-completed level
  const firstUnfinished = ALL_LEVELS.findIndex((lvl) => !progress[lvl.id]?.completed);
  if (firstUnfinished !== -1) {
    currentIdx = firstUnfinished;
  } else {
    currentIdx = Math.max(0, ALL_LEVELS.length - 1);
  }

  return {
    totalStars,
    solvedCount: completedLevels.length,
    unlimitedLeaves: true, // Always unlimited as requested!
    streakDays: 1,
    currentLevelIndex: currentIdx,
  };
}
