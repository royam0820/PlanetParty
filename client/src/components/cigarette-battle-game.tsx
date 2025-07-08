import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { GameResult } from "@/types/game";
import { GAME_POINTS } from "@/lib/game-logic";

interface Cigarette {
  id: string;
  x: number;
  y: number;
  timeLeft: number;
}

interface CigaretteBattleGameProps {
  onComplete: (result: GameResult) => void;
}

export default function CigaretteBattleGame({ onComplete }: CigaretteBattleGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [cigarettes, setCigarettes] = useState<Cigarette[]>([]);
  const [clicked, setClicked] = useState(0);
  const [missed, setMissed] = useState(0);

  const spawnCigarette = useCallback(() => {
    if (!gameStarted) return;
    
    const newCigarette: Cigarette = {
      id: Date.now().toString(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
      timeLeft: 3000 + Math.random() * 2000, // 3-5 seconds
    };
    
    setCigarettes(prev => [...prev, newCigarette]);
  }, [gameStarted]);

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
      const spawnInterval = setInterval(spawnCigarette, 1000);
      return () => clearInterval(spawnInterval);
    }
  }, [gameStarted, spawnCigarette]);

  useEffect(() => {
    if (gameStarted) {
      const updateInterval = setInterval(() => {
        setCigarettes(prev => {
          const updated = prev.map(cigarette => ({
            ...cigarette,
            timeLeft: cigarette.timeLeft - 50
          }));
          
          // Remove cigarettes that expired
          const remaining = updated.filter(cigarette => {
            if (cigarette.timeLeft <= 0) {
              setMissed(prevMissed => prevMissed + 1);
              return false;
            }
            return true;
          });
          
          return remaining;
        });
      }, 50);
      
      return () => clearInterval(updateInterval);
    }
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(30);
    setScore(0);
    setCigarettes([]);
    setClicked(0);
    setMissed(0);
  };

  const endGame = () => {
    setGameStarted(false);
    onComplete({
      gameType: 'cigarette-battle',
      score,
      timeSpent: 30 - timeLeft,
      correct: clicked,
      total: clicked + missed
    });
  };

  const handleCigaretteClick = (cigaretteId: string) => {
    setScore(score + GAME_POINTS.CIGARETTE_BATTLE);
    setClicked(clicked + 1);
    setCigarettes(prev => prev.filter(c => c.id !== cigaretteId));
  };

  return (
    <div className="space-y-6">
      {!gameStarted ? (
        <div className="text-center">
          <h4 className="text-xl font-semibold mb-2">Bataille contre les mégots !</h4>
          <p className="text-gray-600 mb-6">
            Des mégots apparaissent dans le parc. Clique vite dessus pour les ramasser avant qu'ils ne polluent !
          </p>
          <Button onClick={startGame} className="bg-red-500 text-white hover:bg-red-600">
            Commencer la bataille !
          </Button>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="text-lg font-bold text-orange-600">⏱️ {timeLeft}s</div>
              <div className="text-lg font-bold eco-green">🎯 {score} points</div>
              <div className="text-lg font-bold text-red-600">🚬 {clicked} ramassés</div>
            </div>
          </div>

          <div className="relative bg-gradient-to-b from-green-200 to-green-400 rounded-lg h-96 overflow-hidden">
            {/* Background park elements */}
            <div className="absolute inset-0">
              <div className="absolute bottom-2 left-4 text-4xl">🌳</div>
              <div className="absolute bottom-2 right-4 text-4xl">🌳</div>
              <div className="absolute top-4 left-1/4 text-3xl">🌺</div>
              <div className="absolute top-4 right-1/4 text-3xl">🌸</div>
              <div className="absolute bottom-8 left-1/2 text-2xl transform -translate-x-1/2">🪑</div>
            </div>
            
            {/* Cigarettes */}
            {cigarettes.map((cigarette) => {
              const opacity = Math.max(0.3, cigarette.timeLeft / 5000);
              return (
                <div
                  key={cigarette.id}
                  className="absolute text-2xl cursor-pointer hover:scale-125 transition-transform animate-pulse"
                  style={{
                    left: `${cigarette.x}%`,
                    top: `${cigarette.y}%`,
                    transform: 'translate(-50%, -50%)',
                    opacity
                  }}
                  onClick={() => handleCigaretteClick(cigarette.id)}
                >
                  🚬
                </div>
              );
            })}
          </div>

          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">Clique vite sur les mégots pour nettoyer le parc !</p>
            <p>Ramassés: {clicked} | Échappés: {missed}</p>
          </div>
        </>
      )}
    </div>
  );
}