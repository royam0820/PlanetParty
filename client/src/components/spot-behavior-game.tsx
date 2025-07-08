import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GameResult } from "@/types/game";
import { GAME_POINTS } from "@/lib/game-logic";

interface Character {
  id: string;
  name: string;
  emoji: string;
  behavior: string;
  isGood: boolean;
  x: number;
  y: number;
}

interface SpotBehaviorGameProps {
  onComplete: (result: GameResult) => void;
}

const characters: Character[] = [
  { id: '1', name: 'Cycliste', emoji: '🚴', behavior: 'Utilise un vélo', isGood: true, x: 20, y: 30 },
  { id: '2', name: 'Pollueur', emoji: '🚗', behavior: 'Jette un déchet par la fenêtre', isGood: false, x: 70, y: 50 },
  { id: '3', name: 'Jardinier', emoji: '🧑‍🌾', behavior: 'Arrose les plantes', isGood: true, x: 40, y: 70 },
  { id: '4', name: 'Fumeur', emoji: '🚬', behavior: 'Jette son mégot par terre', isGood: false, x: 60, y: 20 },
  { id: '5', name: 'Piéton', emoji: '🚶', behavior: 'Marche au lieu de prendre la voiture', isGood: true, x: 80, y: 80 },
  { id: '6', name: 'Nettoyeur', emoji: '🧹', behavior: 'Ramasse les déchets', isGood: true, x: 30, y: 50 },
];

export default function SpotBehaviorGame({ onComplete }: SpotBehaviorGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [clickedCharacters, setClickedCharacters] = useState<string[]>([]);
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
    setGameStarted(true);
    setTimeLeft(20);
    setScore(0);
    setClickedCharacters([]);
    setFeedback({});
    setStartTime(Date.now());
  };

  const endGame = () => {
    setGameStarted(false);
    const correctClicks = clickedCharacters.filter(id => 
      characters.find(char => char.id === id)?.isGood
    ).length;
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    onComplete({
      gameType: 'spot-behavior',
      score,
      timeSpent,
      correct: correctClicks,
      total: characters.filter(char => char.isGood).length
    });
  };

  const handleCharacterClick = (characterId: string) => {
    if (clickedCharacters.includes(characterId)) return;
    
    const character = characters.find(char => char.id === characterId);
    if (!character) return;
    
    setClickedCharacters([...clickedCharacters, characterId]);
    
    if (character.isGood) {
      setScore(score + GAME_POINTS.SPOT_BEHAVIOR);
      setFeedback({ ...feedback, [characterId]: 'correct' });
    } else {
      setFeedback({ ...feedback, [characterId]: 'incorrect' });
    }
  };

  return (
    <div className="space-y-6">
      {!gameStarted ? (
        <div className="text-center">
          <h4 className="text-xl font-semibold mb-2">Repère les bons gestes !</h4>
          <p className="text-gray-600 mb-6">
            Clique sur les personnages qui ont un comportement écoresponsable. 
            Attention aux mauvais comportements !
          </p>
          <Button onClick={startGame} className="bg-pink-500 text-white hover:bg-pink-600">
            Commencer l'observation !
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

          <Card className="bg-green-100">
            <CardContent className="p-6">
              <div className="relative h-80 bg-gradient-to-b from-sky-200 to-green-300 rounded-lg overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0">
                  <div className="absolute bottom-0 left-0 text-6xl">🏠</div>
                  <div className="absolute top-4 right-4 text-4xl">☀️</div>
                  <div className="absolute bottom-0 right-0 text-5xl">🌳</div>
                  <div className="absolute top-1/2 left-1/4 text-3xl">🌺</div>
                </div>
                
                {/* Characters */}
                {characters.map((character) => (
                  <div
                    key={character.id}
                    className={`absolute text-3xl cursor-pointer transition-all duration-200 ${
                      clickedCharacters.includes(character.id)
                        ? feedback[character.id] === 'correct'
                          ? 'scale-125 animate-pulse'
                          : 'scale-75 opacity-50'
                        : 'hover:scale-110'
                    }`}
                    style={{
                      left: `${character.x}%`,
                      top: `${character.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => handleCharacterClick(character.id)}
                    title={character.behavior}
                  >
                    {character.emoji}
                    {clickedCharacters.includes(character.id) && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <span className={`text-lg ${
                          feedback[character.id] === 'correct' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {feedback[character.id] === 'correct' ? '✓' : '✗'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">Clique sur les personnages avec de bons comportements écologiques !</p>
            <p>
              Trouvés: {clickedCharacters.filter(id => 
                characters.find(char => char.id === id)?.isGood
              ).length} / {characters.filter(char => char.isGood).length}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
