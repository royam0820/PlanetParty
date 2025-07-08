import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { wasteItems, binTypes } from "@/lib/game-data";
import { GameResult, WasteItem } from "@/types/game";
import { getRandomItems, calculateTimeBonus, GAME_POINTS } from "@/lib/game-logic";

interface WasteSortingGameProps {
  onComplete: (result: GameResult) => void;
}

export default function WasteSortingGame({ onComplete }: WasteSortingGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [currentItems, setCurrentItems] = useState<WasteItem[]>([]);
  const [sortedItems, setSortedItems] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    setCurrentItems(getRandomItems(wasteItems, 6));
  }, []);

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
    setTimeLeft(15);
    setScore(0);
    setSortedItems([]);
    setCurrentItems(getRandomItems(wasteItems, 6));
  };

  const endGame = () => {
    setGameStarted(false);
    const correctItems = currentItems.filter(item => sortedItems.includes(item.id));
    const timeBonus = calculateTimeBonus(15 - timeLeft, 15);
    const finalScore = (correctItems.length * GAME_POINTS.WASTE_SORTING) + timeBonus;
    
    onComplete({
      gameType: 'waste-sorting',
      score: finalScore,
      timeSpent: 15 - timeLeft,
      correct: correctItems.length,
      total: currentItems.length
    });
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent, binType: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (!draggedItem) return;
    
    const item = currentItems.find(i => i.id === draggedItem);
    if (!item) return;
    
    const isCorrect = item.type === binType;
    if (isCorrect) {
      setScore(score + GAME_POINTS.WASTE_SORTING);
      setSortedItems([...sortedItems, draggedItem]);
      setCurrentItems(currentItems.filter(i => i.id !== draggedItem));
    }
    
    setDraggedItem(null);
  };

  const availableItems = currentItems.filter(item => !sortedItems.includes(item.id));

  return (
    <div className="space-y-6">
      {!gameStarted ? (
        <div className="text-center">
          <h4 className="text-xl font-semibold mb-2">Trie les déchets dans les bonnes poubelles !</h4>
          <p className="text-gray-600 mb-6">
            Glisse chaque déchet dans la bonne poubelle. Tu as 15 secondes !
          </p>
          <Button onClick={startGame} className="bg-eco-green text-white hover:bg-eco-green/80">
            Commencer le tri !
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

          {/* Waste Items to Sort */}
          <div className="mb-6">
            <h5 className="text-lg font-semibold mb-3">Déchets à trier :</h5>
            <div className="flex flex-wrap gap-3 justify-center">
              {availableItems.map((item) => (
                <Card 
                  key={item.id}
                  className="waste-item cursor-grab"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                >
                  <CardContent className="p-3">
                    <div className="text-center">
                      <div className="text-2xl mb-1">{item.emoji}</div>
                      <div className="text-sm">{item.name}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sorting Bins */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {binTypes.map((bin) => (
              <div
                key={bin.id}
                className="drag-zone border-2 border-dashed border-gray-300 p-6 rounded-lg text-center min-h-32 flex flex-col items-center justify-center"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, bin.id)}
              >
                <div className="text-4xl mb-2">{bin.emoji}</div>
                <div className={`font-semibold text-${bin.color}-600`}>{bin.name}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
