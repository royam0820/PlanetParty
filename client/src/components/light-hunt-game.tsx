import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GameResult } from "@/types/game";
import { GAME_POINTS, GAME_DIFFICULTY, getDifficultyLevel, getLocalProgress } from "@/lib/game-logic";

interface Window {
  id: string;
  x: number;
  y: number;
  isLightOn: boolean;
  isWasteful: boolean;
  clicked: boolean;
  buildingId: number;
}

interface LightHuntGameProps {
  onComplete: (result: GameResult) => void;
}

const generateWindows = (count: number): Window[] => {
  const windows: Window[] = [];
  const buildings = [
    { x: 15, y: 20, width: 20, height: 60 },
    { x: 40, y: 15, width: 18, height: 70 },
    { x: 65, y: 25, width: 22, height: 55 },
    { x: 90, y: 10, width: 8, height: 75 }
  ];
  
  for (let i = 0; i < count; i++) {
    const building = buildings[i % buildings.length];
    const isLightOn = Math.random() > 0.3; // 70% chance of light being on
    const isWasteful = isLightOn && Math.random() > 0.4; // 60% of lit windows are wasteful
    
    windows.push({
      id: `window-${i}`,
      x: building.x + Math.random() * building.width,
      y: building.y + Math.random() * building.height,
      isLightOn,
      isWasteful,
      clicked: false,
      buildingId: i % buildings.length
    });
  }
  
  return windows;
};

export default function LightHuntGame({ onComplete }: LightHuntGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [windows, setWindows] = useState<Window[]>([]);
  const [feedback, setFeedback] = useState<{ [key: string]: 'correct' | 'incorrect' }>({});
  const [startTime, setStartTime] = useState(Date.now());

  // Get user level and difficulty
  const userProgress = getLocalProgress();
  const difficultyLevel = getDifficultyLevel(userProgress.level);
  const difficulty = GAME_DIFFICULTY.WATERING_GAME[difficultyLevel]; // Reuse watering game difficulty

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

  const startGame = () => {
    // Generate windows based on difficulty level
    const windowCount = difficulty.plantCount * 2; // More windows than plants for challenge
    const gameWindows = generateWindows(windowCount);
    
    setWindows(gameWindows);
    setGameStarted(true);
    setTimeLeft(difficulty.timeLimit);
    setScore(0);
    setFeedback({});
    setStartTime(Date.now());
  };

  const endGame = () => {
    setGameStarted(false);
    const correctActions = Object.keys(feedback).filter(id => feedback[id] === 'correct').length;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    onComplete({
      gameType: 'light-hunt',
      score,
      timeSpent,
      correct: correctActions,
      total: windows.filter(window => window.isWasteful).length
    });
  };

  const handleWindowClick = (windowId: string) => {
    const window = windows.find(w => w.id === windowId);
    if (!window || window.clicked) return;
    
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, clicked: true } : w
    ));
    
    if (window.isWasteful) {
      setScore(score + GAME_POINTS.LIGHT_HUNT);
      setFeedback({ ...feedback, [windowId]: 'correct' });
    } else {
      setFeedback({ ...feedback, [windowId]: 'incorrect' });
    }
  };

  return (
    <div className="space-y-6">
      {!gameStarted ? (
        <div className="text-center">
          <h4 className="text-xl font-semibold mb-2">Chasse aux lumières ! 💡</h4>
          <p className="text-gray-600 mb-2">
            Clique sur toutes les fenêtres allumées inutilement pour économiser l'énergie et réduire la pollution lumineuse !
          </p>
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-800">
              Niveau de difficulté: <span className="font-bold">{difficultyLevel}</span>
            </p>
            <p className="text-xs text-green-600 mt-1">
              Fenêtres: {difficulty.plantCount * 2} | Temps: {difficulty.timeLimit}s
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-yellow-800">
              💡 <strong>Astuce :</strong> Les bureaux vides ou les pièces inutilement éclairées gaspillent de l'énergie.
              Ne clique que sur les lumières vraiment inutiles !
            </p>
          </div>
          <Button onClick={startGame} className="bg-yellow-500 text-white hover:bg-yellow-600">
            Commencer la chasse !
          </Button>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="text-lg font-bold text-orange-600">⏱️ {timeLeft}s</div>
              <div className="text-lg font-bold eco-green">🎯 {score} points</div>
            </div>
          </div>

          <Card className="bg-slate-900">
            <CardContent className="p-6">
              <div className="relative h-80 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden">
                {/* Night sky background */}
                <div className="absolute inset-0">
                  <div className="absolute top-2 left-4 text-2xl">🌙</div>
                  <div className="absolute top-4 right-8 text-lg">⭐</div>
                  <div className="absolute top-8 left-1/3 text-sm">✨</div>
                  <div className="absolute top-6 right-1/4 text-sm">⭐</div>
                </div>
                
                {/* Building silhouettes */}
                <div className="absolute bottom-0 left-0 w-full h-full">
                  <div className="absolute bottom-0 left-[10%] w-[25%] h-[70%] bg-slate-700 rounded-t-lg"></div>
                  <div className="absolute bottom-0 left-[35%] w-[20%] h-[80%] bg-slate-600 rounded-t-lg"></div>
                  <div className="absolute bottom-0 left-[55%] w-[25%] h-[60%] bg-slate-700 rounded-t-lg"></div>
                  <div className="absolute bottom-0 left-[80%] w-[15%] h-[85%] bg-slate-600 rounded-t-lg"></div>
                </div>
                
                {/* Windows */}
                {windows.map((window) => (
                  <div
                    key={window.id}
                    className={`absolute w-3 h-3 cursor-pointer transition-all duration-200 ${
                      window.clicked
                        ? feedback[window.id] === 'correct'
                          ? 'bg-green-400 animate-pulse'
                          : 'bg-red-400 opacity-50'
                        : window.isLightOn
                        ? 'bg-yellow-300 hover:bg-yellow-400 shadow-lg'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                    style={{
                      left: `${window.x}%`,
                      top: `${window.y}%`,
                      transform: 'translate(-50%, -50%)',
                      boxShadow: window.isLightOn && !window.clicked ? '0 0 8px rgba(255, 255, 0, 0.6)' : 'none'
                    }}
                    onClick={() => handleWindowClick(window.id)}
                    title={window.isWasteful ? 'Lumière inutile - Clique pour éteindre' : 'Éclairage nécessaire'}
                  >
                    {window.clicked && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className={`text-xs ${
                          feedback[window.id] === 'correct' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {feedback[window.id] === 'correct' ? '✅' : '❌'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">Clique sur les fenêtres allumées inutilement ! 💡</p>
            <p>
              Lumières à éteindre: {windows.filter(w => w.isWasteful && !w.clicked).length} restantes
            </p>
          </div>
        </>
      )}
    </div>
  );
}