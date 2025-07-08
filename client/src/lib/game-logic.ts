import { GameResult, UserProgress } from "@/types/game";

export const GAME_POINTS = {
  WASTE_SORTING: 10,
  QUIZ_CORRECT: 20,
  TRUE_FALSE: 15,
  CATCH_WASTE: 5,
  SPOT_BEHAVIOR: 25,
  MOBILITY_PLAN: 30,
  CIGARETTE_BATTLE: 5,
  WATERING_GAME: 20,
  FACADE_RENOVATION: 15,
  TIME_BONUS: 5,
  PERFECT_SCORE: 50
};

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500];

export function calculateLevel(totalScore: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalScore >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

export function calculateTimeBonus(timeSpent: number, timeLimit: number): number {
  const remainingTime = timeLimit - timeSpent;
  const bonusPercentage = remainingTime / timeLimit;
  return Math.floor(bonusPercentage * GAME_POINTS.TIME_BONUS);
}

export function checkForBadges(progress: UserProgress, gameResult: GameResult): string[] {
  const newBadges: string[] = [];
  
  // Tri Master - 10 waste sorting challenges
  if (gameResult.gameType === 'waste-sorting' && 
      progress.completedChallenges >= 10 && 
      !progress.badges.includes('tri-master')) {
    newBadges.push('tri-master');
  }
  
  // Speed Demon - finish in under 10 seconds
  if (gameResult.timeSpent < 10 && !progress.badges.includes('speed-demon')) {
    newBadges.push('speed-demon');
  }
  
  // Perfectionist - perfect score
  if (gameResult.correct === gameResult.total && !progress.badges.includes('perfectionist')) {
    newBadges.push('perfectionist');
  }
  
  // Eco Expert - answer 50 questions correctly (quiz games)
  if (['eco-quiz', 'true-false'].includes(gameResult.gameType) && 
      progress.completedChallenges >= 25 && 
      !progress.badges.includes('eco-expert')) {
    newBadges.push('eco-expert');
  }
  
  // Eco Warrior - try all game types
  const gameTypes = ['waste-sorting', 'eco-quiz', 'true-false', 'catch-waste', 'spot-behavior', 'mobility-plan', 'cigarette-battle', 'watering-game', 'facade-renovation'];
  // This would need to be tracked differently in a real implementation
  
  return newBadges;
}

export function updateProgress(currentProgress: UserProgress, gameResult: GameResult): UserProgress {
  const newScore = currentProgress.totalScore + gameResult.score;
  const newLevel = calculateLevel(newScore);
  const newStreak = currentProgress.currentStreak + 1;
  const newBadges = checkForBadges(currentProgress, gameResult);
  
  return {
    ...currentProgress,
    totalScore: newScore,
    level: newLevel,
    completedChallenges: currentProgress.completedChallenges + 1,
    currentStreak: newStreak,
    badges: [...currentProgress.badges, ...newBadges],
    lastPlayed: new Date()
  };
}

export function getLocalProgress(): UserProgress {
  const saved = localStorage.getItem('ecoGame_progress');
  if (saved) {
    return JSON.parse(saved);
  }
  
  return {
    totalScore: 0,
    level: 1,
    completedChallenges: 0,
    currentStreak: 0,
    badges: [],
    lastPlayed: new Date()
  };
}

export function saveLocalProgress(progress: UserProgress): void {
  localStorage.setItem('ecoGame_progress', JSON.stringify(progress));
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomItems<T>(array: T[], count: number): T[] {
  return shuffleArray(array).slice(0, count);
}
