import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Star,
  Trophy,
  Sparkles,
  HelpCircle,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  ChevronRight,
  Flame,
  Info,
  X,
} from 'lucide-react';
import { LevelData, LevelProgress, PlayerProfile } from '../types';
import { ALL_LEVELS } from '../data/levels';

interface DashboardProps {
  playerProfile: PlayerProfile;
  levelProgress: Record<string, LevelProgress>;
  currentLevelIndex: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHowToPlay: () => void;
  onStartLevel: (index: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  playerProfile,
  levelProgress,
  currentLevelIndex,
  soundEnabled,
  onToggleSound,
  onOpenHowToPlay,
  onStartLevel,
}) => {
  const [showLeavesModal, setShowLeavesModal] = useState(false);
  const activeLevel = ALL_LEVELS[currentLevelIndex] || ALL_LEVELS[0];

  const formatTime = (secs?: number) => {
    if (!secs) return '--:--';
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/40';
      case 'HARD':
        return 'bg-orange-500/20 text-orange-300 border-orange-400/40';
      case 'EXPERT':
        return 'bg-rose-500/20 text-rose-300 border-rose-400/40';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-400/40';
    }
  };

  const completedCount = (Object.values(levelProgress) as LevelProgress[]).filter((p) => p.completed).length;
  const totalLevels = ALL_LEVELS.length;
  const progressPercent = Math.round((completedCount / totalLevels) * 100);

  return (
    <div className="min-h-screen w-full bg-[#3d3774] text-white flex flex-col items-center select-none font-sans overflow-y-auto pb-12">
      {/* Top Navigation Bar */}
      <header className="w-full max-w-2xl px-4 py-4 flex items-center justify-between border-b border-white/10 bg-[#342e66]/80 backdrop-blur-md sticky top-0 z-30 shadow-md">
        {/* Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-300/40 font-black text-xl text-white">
            +
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wide leading-tight flex items-center gap-1.5">
              CROSSMATH
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                PRO
              </span>
            </h1>
            <p className="text-xs text-white/60 font-medium">Math Crossword Puzzle</p>
          </div>
        </div>

        {/* Top Badges (Leaves, Stars, Sound, Help) */}
        <div className="flex items-center gap-2">
          {/* UNLIMITED LEAVES BADGE */}
          <button
            id="dashboard-leaves-badge"
            onClick={() => setShowLeavesModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 hover:bg-emerald-500/30 active:scale-95 transition cursor-pointer group shadow-sm"
            title="Unlimited Leaves Status"
            aria-label="Unlimited leaves status"
          >
            <span className="text-base animate-pulse">🍃</span>
            <span className="text-emerald-300 font-extrabold text-sm tracking-tight flex items-center gap-0.5">
              ∞ <span className="text-[11px] font-bold uppercase hidden sm:inline">Leaves</span>
            </span>
          </button>

          {/* STARS COUNT */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{playerProfile.totalStars}</span>
          </div>

          {/* AUDIO TOGGLE */}
          <button
            id="dashboard-sound-toggle"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition border border-white/20 text-white/80 cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-white/40" />}
          </button>

          {/* HOW TO PLAY */}
          <button
            id="dashboard-how-to-play"
            onClick={onOpenHowToPlay}
            aria-label="How to play"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition border border-white/20 text-white/80 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-2xl px-4 py-6 flex flex-col gap-6">
        {/* UNLIMITED LEAVES HERO BANNER */}
        <div
          onClick={() => setShowLeavesModal(true)}
          className="w-full rounded-2xl bg-gradient-to-r from-emerald-600/30 via-teal-600/20 to-emerald-700/30 border border-emerald-400/30 p-4 flex items-center justify-between shadow-lg cursor-pointer hover:border-emerald-400/50 transition group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition">
              🍃
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black tracking-wide text-emerald-300 uppercase">
                  Unlimited Leaves Active
                </h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/40 font-bold text-white uppercase">
                  Infinite
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                Zero energy limits. Play and replay any puzzle endlessly without wait times!
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-400/70 group-hover:translate-x-0.5 transition" />
        </div>

        {/* HERO CONTINUE / NEXT LEVEL CARD */}
        <div className="w-full rounded-3xl bg-gradient-to-b from-[#4e468e] to-[#403978] border border-white/20 p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle decorative background pattern */}
          <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-6 -top-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-black uppercase px-2.5 py-1 rounded-full border ${getDifficultyColor(
                  activeLevel.difficulty
                )}`}
              >
                {activeLevel.difficulty}
              </span>
              <span className="text-xs text-white/60 font-medium">
                Level {currentLevelIndex + 1} of {totalLevels}
              </span>
            </div>
            {levelProgress[activeLevel.id]?.completed && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> Solved
              </span>
            )}
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white mb-2">{activeLevel.name}</h2>
          <p className="text-sm text-white/70 mb-5">
            {currentLevelIndex === 0
              ? 'Begin with this friendly, gentle warm-up grid. Drag or tap numbers to complete the math!'
              : currentLevelIndex === 3
              ? 'The Classic Crossmath 9×9 interlocking matrix with 12 rack numbers.'
              : `Fill all recessed slots to balance horizontal and vertical equations.`}
          </p>

          {/* Progress bar */}
          <div className="w-full mb-6">
            <div className="flex justify-between text-xs text-white/70 font-semibold mb-1.5">
              <span>Campaign Progress</span>
              <span>
                {completedCount}/{totalLevels} Completed ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden border border-white/10 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>
          </div>

          {/* Big Green 3D Action Button */}
          <button
            id="dashboard-play-hero-button"
            onClick={() => onStartLevel(currentLevelIndex)}
            className="w-full py-4 rounded-2xl bg-gradient-to-b from-[#7ef79a] via-[#5ae87c] to-[#36c75b] hover:brightness-105 active:translate-y-1 active:shadow-none transition-all duration-150 cursor-pointer shadow-[0_5px_0_#21853d,0_10px_16px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 font-black text-lg text-[#164a23] tracking-wide"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>
              {levelProgress[activeLevel.id]?.completed ? 'PLAY AGAIN' : 'START PUZZLE'}
            </span>
          </button>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#463f82]/80 border border-white/15 rounded-2xl p-3.5 flex flex-col items-center text-center shadow-md">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mb-1.5">
              <Trophy className="w-4 h-4" />
            </div>
            <span className="text-xl font-black text-white">{completedCount}</span>
            <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">
              Solved
            </span>
          </div>

          <div className="bg-[#463f82]/80 border border-white/15 rounded-2xl p-3.5 flex flex-col items-center text-center shadow-md">
            <div className="w-8 h-8 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center mb-1.5">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="text-xl font-black text-white">{playerProfile.totalStars}</span>
            <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">
              Stars
            </span>
          </div>

          <div className="bg-[#463f82]/80 border border-white/15 rounded-2xl p-3.5 flex flex-col items-center text-center shadow-md">
            <div className="w-8 h-8 rounded-full bg-teal-400/20 text-teal-300 flex items-center justify-center mb-1.5">
              <span className="text-sm font-bold">🍃</span>
            </div>
            <span className="text-xl font-black text-emerald-300">∞</span>
            <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">
              Leaves
            </span>
          </div>
        </div>

        {/* PROGRESSIVE LEVEL JOURNEY (Easy to Hard) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-base font-black tracking-wide text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              Level Progression
            </h3>
            <span className="text-xs text-white/60 font-medium">
              Start Easy &rarr; Advance to Expert
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {ALL_LEVELS.map((level, idx) => {
              const progress = levelProgress[level.id];
              const isCompleted = progress?.completed;
              const isSelected = idx === currentLevelIndex;
              const stars = progress?.stars || 0;

              return (
                <div
                  key={level.id}
                  id={`dashboard-level-card-${idx}`}
                  onClick={() => onStartLevel(idx)}
                  className={`w-full rounded-2xl p-4 transition-all duration-200 cursor-pointer flex items-center justify-between border ${
                    isSelected
                      ? 'bg-[#524996] border-emerald-400/60 shadow-lg ring-2 ring-emerald-400/30'
                      : 'bg-[#433b7e]/90 border-white/15 hover:bg-[#4b438c] hover:border-white/30'
                  }`}
                >
                  {/* Left: Index badge & Level info */}
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-black text-base border shadow-sm ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                          : isSelected
                          ? 'bg-white/20 text-white border-white/40'
                          : 'bg-black/20 text-white/70 border-white/10'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-white">{level.name}</h4>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${getDifficultyColor(
                            level.difficulty
                          )}`}
                        >
                          {level.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/60 font-medium">
                        <span>
                          {level.rows}×{level.cols} Grid
                        </span>
                        <span>•</span>
                        <span>{level.rackValues.length} Numbers</span>
                        {progress?.bestTimeSeconds && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-emerald-300/90 font-mono">
                              <Clock className="w-3 h-3" />
                              {formatTime(progress.bestTimeSeconds)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Stars & Action */}
                  <div className="flex items-center gap-3">
                    {/* Stars */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-4 h-4 ${
                            starIdx <= stars
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-black/30 text-white/20'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Small Play Button */}
                    <button
                      id={`level-play-btn-${idx}`}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-90 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-400 text-emerald-950 font-bold shadow-md'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                      aria-label={`Play ${level.name}`}
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* UNLIMITED LEAVES MODAL */}
      <AnimatePresence>
        {showLeavesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-sm bg-[#4a4287] rounded-3xl p-6 border border-white/20 shadow-2xl relative text-center"
            >
              <button
                id="close-leaves-modal-btn"
                onClick={() => setShowLeavesModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner">
                🍃
              </div>

              <h3 className="text-xl font-black text-white mb-1">Unlimited Leaves Active</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-4">
                Infinite Energy Guaranteed
              </p>

              <div className="bg-black/20 rounded-2xl p-4 text-left border border-white/10 space-y-2.5 mb-5 text-xs text-white/80">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero stamina loss:</strong> You will never run out of hearts or leaves, no matter how many mistakes you make.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>No waiting timers:</strong> Play non-stop as long as you want without cooldown intervals.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Unlimited retries:</strong> Restart or retry any puzzle anytime without penalties.
                  </span>
                </div>
              </div>

              <button
                id="dismiss-leaves-modal-button"
                onClick={() => setShowLeavesModal(false)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-600 text-white font-extrabold text-sm shadow-[0_4px_0_#1b6833] active:translate-y-1 active:shadow-none transition cursor-pointer"
              >
                GOT IT, LET'S PLAY!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
