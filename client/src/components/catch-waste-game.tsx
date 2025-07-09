import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { GameResult } from "@/types/game";
import { GAME_POINTS, GAME_DIFFICULTY, getDifficultyLevel } from "@/lib/game-logic";
import { getLocalProgress } from "@/lib/game-logic";

interface FallingWaste {
  id: string;
  x: number;
  y: number;
  emoji: string;
  speed: number;
}

interface CatchWasteGameProps {
  onComplete: (result: GameResult) => void;
}

export default function CatchWasteGame({ onComplete }: CatchWasteGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [fallingWastes, setFallingWastes] = useState<FallingWaste[]>([]);
  const [basketX, setBasketX] = useState(50);
  const [caught, setCaught] = useState(0);
  const [missed, setMissed] = useState(0);

  const wasteEmojis = ['🥤', '🍌', '📄', '🥫', '🍷', '🥛'];
  
  // Get user level and difficulty
  const userProgress = getLocalProgress();
  const difficultyLevel = getDifficultyLevel(userProgress.level);
  const difficulty = GAME_DIFFICULTY.CATCH_WASTE[difficultyLevel];

  const spawnWaste = useCallback(() => {
    if (!gameStarted) return;
    
    const newWaste: FallingWaste = {
      id: Date.now().toString(),
      x: Math.random() * 80 + 10,
      y: 0,
      emoji: wasteEmojis[Math.floor(Math.random() * wasteEmojis.length)],
      speed: Math.random() * difficulty.speedVariation + difficulty.baseSpeed
    };
    
    setFallingWastes(prev => [...prev, newWaste]);
  }, [gameStarted, difficulty]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [gameStarted, timeLeft]);

  useEffect(() => {
    if (gameStarted) {
      const spawnInterval = setInterval(spawnWaste, difficulty.spawnRate);
      return () => clearInterval(spawnInterval);
    }
  }, [gameStarted, spawnWaste, difficulty.spawnRate]);

  useEffect(() => {
    if (gameStarted) {
      const updateInterval = setInterval(() => {
        setFallingWastes(prev => {
          const updated = prev.map(waste => ({
            ...waste,
            y: waste.y + waste.speed
          }));
          
          // Remove wastes that fell off screen
          const onScreen = updated.filter(waste => {
            if (waste.y > 90) {
              setLives(currentLives => {
                const newLives = currentLives - 1;
                if (newLives <= 0) {
                  setTimeout(endGame, 100);
                }
                return newLives;
              });
              setMissed(prev => prev + 1);
              return false;
            }
            return true;
          });
          
          return onScreen;
        });
      }, 50);
      
      return () => clearInterval(updateInterval);
    }
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(30);
    setScore(0);
    setLives(3);
    setFallingWastes([]);
    setBasketX(50);
    setCaught(0);
    setMissed(0);
  };

  const endGame = () => {
    setGameStarted(false);
    onComplete({
      gameType: 'catch-waste',
      score,
      timeSpent: 30 - timeLeft,
      correct: caught,
      total: caught + missed
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gameStarted) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(5, Math.min(95, x)));
  };

  const handleWasteClick = (wasteId: string) => {
    const waste = fallingWastes.find(w => w.id === wasteId);
    if (waste && Math.abs(waste.x - basketX) < 15) {
      setScore(score + GAME_POINTS.CATCH_WASTE);
      setCaught(caught + 1);
      setFallingWastes(prev => prev.filter(w => w.id !== wasteId));
    }
  };

  return (
    <div className="space-y-6">
      {!gameStarted ? (
        <div className="text-center">
          <h4 className="text-xl font-semibold mb-2">Attrape les déchets qui tombent !</h4>
          <p className="text-gray-600 mb-2">
            Déplace ton panier et clique sur les déchets pour les attraper. Attention aux vies !
          </p>
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-800">
              Niveau de difficulté: <span className="font-bold">{difficultyLevel}</span>
            </p>
            <p className="text-xs text-green-600 mt-1">
              Vitesse: {difficulty.baseSpeed}x | Fréquence: {1500/difficulty.spawnRate}x
            </p>
          </div>
          <Button onClick={startGame} className="bg-eco-warning text-white hover:bg-eco-warning/80">
            Commencer la chasse !
          </Button>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="text-lg font-bold text-orange-600">⏱️ {timeLeft}s</div>
              <div className="text-lg font-bold eco-green">🎯 {score} points</div>
              <div className="text-lg font-bold text-red-600">❤️ {lives} vies</div>
            </div>
          </div>

          <div 
            className="catch-game-container bg-gradient-to-b from-sky-200 to-green-200 rounded-lg h-96 relative cursor-pointer"
            onMouseMove={handleMouseMove}
          >
            {/* Falling waste items */}
            {fallingWastes.map((waste) => (
              <div
                key={waste.id}
                className="absolute text-2xl cursor-pointer hover:scale-110 transition-transform"
                style={{
                  left: `${waste.x}%`,
                  top: `${waste.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleWasteClick(waste.id)}
              >
                {waste.emoji}
              </div>
            ))}
            
            {/* Basket */}
            <div
              className="absolute bottom-4 text-6xl transition-all duration-100 ease-out"
              style={{
                left: `${basketX}%`,
                transform: 'translateX(-50%)'
              }}
            >
              🗑️
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            Attrapés: {caught} | Ratés: {missed}
          </div>
        </>
      )}
    </div>
  );
}
