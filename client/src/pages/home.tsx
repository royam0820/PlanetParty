import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GameModal from "@/components/game-modal";
import ProgressSection from "@/components/progress-section";
import ResultModal from "@/components/result-modal";
import AchievementToast from "@/components/achievement-toast";
import { GameResult, UserProgress } from "@/types/game";
import { getLocalProgress, saveLocalProgress, updateProgress } from "@/lib/game-logic";
import { useEffect } from "react";

const challenges = [
  {
    id: 'waste-sorting',
    title: 'Tri des déchets',
    description: 'Trie les déchets dans les bonnes poubelles en 15 secondes !',
    emoji: '🗂️',
    color: 'bg-eco-green',
    tags: ['⏱️ 15 sec', '🎯 Précision'],
    tagColors: ['bg-orange-100 text-orange-600', 'bg-blue-100 text-blue-600']
  },
  {
    id: 'eco-quiz',
    title: 'Quiz Éclair',
    description: 'Réponds aux questions sur l\'écologie urbaine !',
    emoji: '🧠',
    color: 'bg-eco-blue',
    tags: ['❓ 5 questions', '🎓 Éducatif'],
    tagColors: ['bg-orange-100 text-orange-600', 'bg-green-100 text-green-600']
  },
  {
    id: 'catch-waste',
    title: 'Attrape les déchets',
    description: 'Empêche les déchets de tomber au sol !',
    emoji: '🎯',
    color: 'bg-eco-warning',
    tags: ['🎮 Arcade', '⚡ Réflexes'],
    tagColors: ['bg-red-100 text-red-600', 'bg-yellow-100 text-yellow-600']
  },
  {
    id: 'true-false',
    title: 'Vrai ou Faux',
    description: 'Teste tes connaissances sur la ville durable !',
    emoji: '✅',
    color: 'bg-purple-500',
    tags: ['✓ Facile', '🏃 Rapide'],
    tagColors: ['bg-green-100 text-green-600', 'bg-blue-100 text-blue-600']
  },
  {
    id: 'spot-behavior',
    title: 'Repère les bons gestes',
    description: 'Clique sur les comportements écoresponsables !',
    emoji: '👀',
    color: 'bg-pink-500',
    tags: ['🔍 Observation', '👥 Social'],
    tagColors: ['bg-pink-100 text-pink-600', 'bg-green-100 text-green-600']
  },
  {
    id: 'mobility-plan',
    title: 'Plan de mobilité',
    description: 'Choisis le transport le plus écologique !',
    emoji: '🚲',
    color: 'bg-indigo-500',
    tags: ['🚗 Transport', '🌱 Écolo'],
    tagColors: ['bg-indigo-100 text-indigo-600', 'bg-green-100 text-green-600']
  },
  {
    id: 'cigarette-battle',
    title: 'Bataille contre les mégots',
    description: 'Clique vite sur les mégots pour nettoyer le parc !',
    emoji: '🚬',
    color: 'bg-red-500',
    tags: ['⚡ Réflexes', '🏃 Rapide'],
    tagColors: ['bg-red-100 text-red-600', 'bg-yellow-100 text-yellow-600']
  },
  {
    id: 'watering-game',
    title: 'Le bon arrosage',
    description: 'Arrose seulement les plantes qui en ont besoin !',
    emoji: '💧',
    color: 'bg-cyan-500',
    tags: ['🌱 Plantes', '🎯 Précision'],
    tagColors: ['bg-green-100 text-green-600', 'bg-blue-100 text-blue-600']
  },
  {
    id: 'facade-renovation',
    title: 'Refais la façade',
    description: 'Verdir un immeuble avec des solutions écologiques !',
    emoji: '🏢',
    color: 'bg-emerald-500',
    tags: ['🏠 Urbanisme', '🌿 Végétal'],
    tagColors: ['bg-gray-100 text-gray-600', 'bg-green-100 text-green-600']
  }
];

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [progress, setProgress] = useState<UserProgress>(getLocalProgress());
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    const savedProgress = getLocalProgress();
    setProgress(savedProgress);
  }, []);

  const handleGameComplete = (result: GameResult) => {
    const newProgress = updateProgress(progress, result);
    setProgress(newProgress);
    saveLocalProgress(newProgress);
    setGameResult(result);
    setSelectedGame(null);
    
    // Check for new achievements
    const newBadges = newProgress.badges.filter(badge => !progress.badges.includes(badge));
    if (newBadges.length > 0) {
      setAchievements(newBadges);
    }
  };

  const handleCloseResult = () => {
    setGameResult(null);
  };

  const handleCloseAchievement = () => {
    setAchievements([]);
  };

  return (
    <div className="min-h-screen plant-background bg-gradient-to-br from-green-100 to-green-200">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-eco-green rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">🌱</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Ma Petite Planète</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                <span className="text-lg">⭐</span>
                <span className="font-semibold eco-green">{progress.totalScore.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
                <span className="text-lg">🏆</span>
                <span className="font-semibold eco-blue">Niveau {progress.level}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="text-center mb-12">
          <div className="float-animation">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">🌍 Défis Écologiques Urbains</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Relève des défis amusants et apprends les gestes écoresponsables pour une ville plus durable !
            </p>
          </div>
        </section>

        {/* Challenge Selection Grid */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Choisis ton défi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="game-card cursor-pointer" onClick={() => setSelectedGame(challenge.id)}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className={`w-16 h-16 ${challenge.color}/10 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-3xl">{challenge.emoji}</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{challenge.title}</h4>
                    <p className="text-gray-600 mb-4">{challenge.description}</p>
                    <div className="flex justify-center space-x-2 mb-4">
                      {challenge.tags.map((tag, index) => (
                        <span key={index} className={`${challenge.tagColors[index]} px-3 py-1 rounded-full text-sm`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button className={`w-full ${challenge.color} text-white hover:opacity-80`}>
                      Commencer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Progress Section */}
        <ProgressSection progress={progress} />
      </main>

      {/* Game Modal */}
      {selectedGame && (
        <GameModal 
          gameType={selectedGame}
          onComplete={handleGameComplete}
          onClose={() => setSelectedGame(null)}
        />
      )}

      {/* Result Modal */}
      {gameResult && (
        <ResultModal 
          result={gameResult}
          onClose={handleCloseResult}
        />
      )}

      {/* Achievement Toast */}
      {achievements.length > 0 && (
        <AchievementToast 
          achievements={achievements}
          onClose={handleCloseAchievement}
        />
      )}
    </div>
  );
}
