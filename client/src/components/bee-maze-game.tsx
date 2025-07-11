import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GameResult } from "@/types/game";

// Constantes du labyrinthe
const MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 2, 0, 3, 1],
  [1, 0, 1, 1, 1, 0, 1, 1],
  [1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];
// 0: vide, 1: mur, 2: pesticide, 3: fleur (arrivée)
const START_POS = { x: 1, y: 1 };

export default function BeeMazeGame({ onComplete }: { onComplete: (result: GameResult) => void }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [beePos, setBeePos] = useState(START_POS);
  const [status, setStatus] = useState<'playing' | 'win' | 'lose'>('playing');
  const [moves, setMoves] = useState(0);
  const mazeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameStarted || status !== 'playing') return;
    const handleKey = (e: KeyboardEvent) => {
      let { x, y } = beePos;
      if (e.key === 'ArrowUp') y--;
      else if (e.key === 'ArrowDown') y++;
      else if (e.key === 'ArrowLeft') x--;
      else if (e.key === 'ArrowRight') x++;
      else return;
      if (MAZE[y][x] === 1) return; // mur
      setBeePos({ x, y });
      setMoves(m => m + 1);
      if (MAZE[y][x] === 2) setStatus('lose');
      if (MAZE[y][x] === 3) setStatus('win');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [beePos, gameStarted, status]);

  useEffect(() => {
    if (status === 'win') {
      setTimeout(() => {
        onComplete({
          gameType: 'bee-maze',
          score: 100 - moves * 2,
          timeSpent: moves,
          correct: 1,
          total: 1
        });
      }, 1200);
    } else if (status === 'lose') {
      setTimeout(() => {
        onComplete({
          gameType: 'bee-maze',
          score: 0,
          timeSpent: moves,
          correct: 0,
          total: 1
        });
      }, 1200);
    }
  }, [status, moves, onComplete]);

  const startGame = () => {
    setGameStarted(true);
    setBeePos(START_POS);
    setStatus('playing');
    setMoves(0);
    setTimeout(() => {
      mazeRef.current?.focus();
    }, 100);
  };

  return (
    <div className="space-y-6 text-center">
      {!gameStarted ? (
        <>
          <h4 className="text-xl font-semibold mb-2">Sauve les abeilles ! 🐝</h4>
          <p className="text-gray-600 mb-4">Guide l'abeille à travers le champ sans toucher les pesticides 🚫 et atteins la fleur 🌸 !<br/>Utilise les flèches du clavier.</p>
          <Button onClick={startGame} className="bg-yellow-300 text-white hover:bg-yellow-400">Commencer</Button>
        </>
      ) : (
        <div ref={mazeRef} tabIndex={0} className="outline-none flex flex-col items-center">
          <div className="inline-block border-2 border-yellow-400 bg-white rounded p-2">
            {MAZE.map((row, y) => (
              <div key={y} className="flex">
                {row.map((cell, x) => (
                  <div
                    key={x}
                    className={`w-8 h-8 flex items-center justify-center text-lg font-bold border border-gray-200 ${cell === 1 ? 'bg-gray-400' : cell === 2 ? 'bg-red-200' : cell === 3 ? 'bg-green-200' : 'bg-yellow-50'} ${beePos.x === x && beePos.y === y ? 'bg-yellow-300' : ''}`}
                  >
                    {beePos.x === x && beePos.y === y ? '🐝' : cell === 2 ? '🚫' : cell === 3 ? '🌸' : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-4">
            {status === 'win' && <span className="text-green-600 font-bold">Bravo ! Tu as sauvé l'abeille ! 🌸</span>}
            {status === 'lose' && <span className="text-red-600 font-bold">Oh non, l'abeille a touché un pesticide ! 🚫</span>}
            {status === 'playing' && <span className="text-gray-600">Déplace l'abeille avec les flèches du clavier.</span>}
          </div>
        </div>
      )}
    </div>
  );
} 