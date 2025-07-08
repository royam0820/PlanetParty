import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GameResult } from "@/types/game";
import { GAME_POINTS } from "@/lib/game-logic";

interface Plant {
  id: string;
  emoji: string;
  name: string;
  needsWater: boolean;
  x: number;
  y: number;
  watered: boolean;
}

interface WateringGameProps {
  onComplete: (result: GameResult) => void;
}

const plants: Plant[] = [
  { id: '1', emoji: '🌱', name: 'Pousse', needsWater: true, x: 20, y: 30, watered: false },
  { id: '2', emoji: '🌿', name: 'Fougère', needsWater: false, x: 70, y: 25, watered: false },
  { id: '3', emoji: '🌺', name: 'Fleur', needsWater: true, x: 40, y: 50, watered: false },
  { id: '4', emoji: '🌵', name: 'Cactus', needsWater: false, x: 60, y: 70, watered: false },
  { id: '5', emoji: '🌷', name: 'Tulipe', needsWater: true, x: 80, y: 60, watered: false },
  { id: '6', emoji: '🌻', name: 'Tournesol', needsWater: false, x: 30, y: 75, watered: false },
  { id: '7', emoji: '🪴', name: 'Plante verte', needsWater: true, x: 15, y: 65, watered: false },
  { id: '8', emoji: '🌲', name: 'Sapin', needsWater: false, x: 85, y: 35, watered: false },
];

export default function WateringGame({ onComplete }: WateringGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const [score, setScore] = useState(0);
  const [gamePlants, setGamePlants] = useState<Plant[]>([]);
  const [feedback, setFeedback] = useState<{ [key: string]: 'correct' | 'incorrect' }>({});
  const [startTime, setStartTime] = useState(Date.now());

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
    // Randomize which plants need water
    const shuffledPlants = plants.map(plant => ({
      ...plant,
      needsWater: Math.random() > 0.4, // 60% chance of needing water
      watered: false
    }));
    
    setGamePlants(shuffledPlants);
    setGameStarted(true);
    setTimeLeft(25);
    setScore(0);
    setFeedback({});
    setStartTime(Date.now());
  };

  const endGame = () => {
    setGameStarted(false);
    const correctActions = Object.keys(feedback).filter(id => feedback[id] === 'correct').length;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    onComplete({
      gameType: 'watering-game',
      score,
      timeSpent,
      correct: correctActions,
      total: gamePlants.filter(plant => plant.needsWater).length
    });
  };

  const handlePlantClick = (plantId: string) => {
    const plant = gamePlants.find(p => p.id === plantId);
    if (!plant || plant.watered) return;
    
    setGamePlants(prev => prev.map(p => 
      p.id === plantId ? { ...p, watered: true } : p
    ));
    
    if (plant.needsWater) {
      setScore(score + GAME_POINTS.WATERING_GAME);
      setFeedback({ ...feedback, [plantId]: 'correct' });
    } else {
      setFeedback({ ...feedback, [plantId]: 'incorrect' });
    }
  };

  return (
    <div className="space-y-6">
      {!gameStarted ? (
        <div className="text-center">
          <h4 className="text-xl font-semibold mb-2">Le bon arrosage !</h4>
          <p className="text-gray-600 mb-6">
            Observe bien les plantes et arrose seulement celles qui en ont besoin. 
            Certaines sont déjà suffisamment arrosées !
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
              💡 <strong>Indices :</strong> Les plantes qui ont l'air fanées ou sèches ont besoin d'eau.
              Les cactus et certaines plantes grasses n'ont pas souvent besoin d'être arrosés.
            </p>
          </div>
          <Button onClick={startGame} className="bg-cyan-500 text-white hover:bg-cyan-600">
            Commencer l'arrosage !
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

          <Card className="bg-green-50">
            <CardContent className="p-6">
              <div className="relative h-80 bg-gradient-to-b from-blue-100 to-green-200 rounded-lg overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0">
                  <div className="absolute bottom-0 left-0 text-5xl">🏠</div>
                  <div className="absolute top-2 right-2 text-3xl">☀️</div>
                  <div className="absolute bottom-2 right-8 text-3xl">🪣</div>
                  <div className="absolute top-1/3 left-8 text-2xl">🚿</div>
                </div>
                
                {/* Plants */}
                {gamePlants.map((plant) => (
                  <div
                    key={plant.id}
                    className={`absolute text-4xl cursor-pointer transition-all duration-200 ${
                      plant.watered
                        ? feedback[plant.id] === 'correct'
                          ? 'scale-125 animate-pulse'
                          : 'scale-75 opacity-50'
                        : 'hover:scale-110'
                    }`}
                    style={{
                      left: `${plant.x}%`,
                      top: `${plant.y}%`,
                      transform: 'translate(-50%, -50%)',
                      filter: plant.needsWater && !plant.watered ? 'sepia(50%) brightness(0.8)' : 'none'
                    }}
                    onClick={() => handlePlantClick(plant.id)}
                    title={`${plant.name} - ${plant.needsWater ? 'A besoin d\'eau' : 'Déjà arrosée'}`}
                  >
                    {plant.emoji}
                    {plant.watered && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <span className={`text-lg ${
                          feedback[plant.id] === 'correct' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {feedback[plant.id] === 'correct' ? '💧' : '❌'}
                        </span>
                      </div>
                    )}
                    {plant.needsWater && !plant.watered && (
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                        <span className="text-xs">😵</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">Clique sur les plantes qui ont besoin d'eau ! 💧</p>
            <p>
              Plantes à arroser: {gamePlants.filter(p => p.needsWater && !p.watered).length} restantes
            </p>
          </div>
        </>
      )}
    </div>
  );
}