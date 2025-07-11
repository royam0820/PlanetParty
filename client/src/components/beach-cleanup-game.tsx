import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GameResult } from "@/types/game";

const INITIAL_ITEMS = [
  { id: 1, type: 'trash', emoji: '🗑️', x: 20, y: 40 },
  { id: 2, type: 'trash', emoji: '🍾', x: 60, y: 30 },
  { id: 3, type: 'trash', emoji: '🥤', x: 40, y: 60 },
  { id: 4, type: 'crab', emoji: '🦀', x: 30, y: 20 },
  { id: 5, type: 'crab', emoji: '🦀', x: 70, y: 55 },
];

export default function BeachCleanupGame({ onComplete }: { onComplete: (result: GameResult) => void }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'playing' | 'win'>('playing');

  const startGame = () => {
    setGameStarted(true);
    setItems(INITIAL_ITEMS);
    setScore(0);
    setStatus('playing');
  };

  const onDragStart = (id: number) => setDraggedId(id);
  const onDragEnd = () => setDraggedId(null);

  const onDrop = () => {
    if (draggedId == null) return;
    const item = items.find(i => i.id === draggedId);
    if (!item) return;
    if (item.type === 'trash') {
      const newItems = items.filter(i => i.id !== draggedId);
      setItems(newItems);
      setScore(s => s + 1);
      if (newItems.filter(i => i.type === 'trash').length === 0) {
        setStatus('win');
        setTimeout(() => {
          onComplete({
            gameType: 'beach-cleanup',
            score: score + 1,
            timeSpent: score + 1,
            correct: score + 1,
            total: INITIAL_ITEMS.filter(i => i.type === 'trash').length
          });
        }, 1200);
      }
    } else {
      // Crabe : il revient à sa place
    }
    setDraggedId(null);
  };

  return (
    <div className="space-y-6 text-center">
      {!gameStarted ? (
        <>
          <h4 className="text-xl font-semibold mb-2">Nettoie la plage 🏖️</h4>
          <p className="text-gray-600 mb-4">Ramasse les déchets (drag & drop) dans la poubelle. Attention aux crabes 🦀 : ils ne comptent pas !</p>
          <Button onClick={startGame} className="bg-blue-400 text-white hover:bg-blue-500">Commencer</Button>
        </>
      ) : (
        <div className="relative w-full max-w-xs mx-auto h-64 bg-gradient-to-b from-yellow-100 to-blue-200 rounded-lg border-2 border-blue-300">
          {/* Plage et objets */}
          {items.map(item => (
            <div
              key={item.id}
              draggable
              onDragStart={() => onDragStart(item.id)}
              onDragEnd={onDragEnd}
              style={{
                position: 'absolute',
                left: `${item.x}%`,
                top: `${item.y}%`,
                opacity: draggedId === item.id ? 0.5 : 1,
                cursor: 'grab',
                fontSize: 32,
                zIndex: 2
              }}
            >
              {item.emoji}
            </div>
          ))}
          {/* Poubelle (drop zone) */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={onDrop}
            className="absolute left-1/2 -translate-x-1/2 bottom-2 w-16 h-16 flex items-center justify-center bg-gray-200 rounded-full border-2 border-gray-500 text-3xl z-10"
            style={{ boxShadow: '0 2px 8px #0002' }}
          >
            🗑️
          </div>
          {/* Score et statut */}
          <div className="absolute top-2 left-2 bg-white/80 rounded px-2 py-1 text-blue-700 font-bold">Score : {score}</div>
          {status === 'win' && <div className="absolute inset-0 flex items-center justify-center text-green-700 text-xl font-bold bg-white/80">Bravo, la plage est propre !</div>}
        </div>
      )}
    </div>
  );
} 