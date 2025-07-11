import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GameResult } from "@/types/game";

const GRID_WIDTH = 8;
const GRID_HEIGHT = 6;
const INITIAL_MACHINES = [
  { id: 1, x: 0, y: 2 },
  { id: 2, x: 0, y: 4 },
];
const FOREST_LINE = GRID_WIDTH - 1;
const GAME_DURATION = 20; // nombre de tours à survivre

export default function ForestDefenseGame({ onComplete }: { onComplete: (result: GameResult) => void }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [machines, setMachines] = useState(INITIAL_MACHINES);
  const [trees, setTrees] = useState<{ x: number, y: number }[]>([]);
  const [turn, setTurn] = useState(0);
  const [status, setStatus] = useState<'playing' | 'win' | 'lose'>('playing');
  const [selectedCell, setSelectedCell] = useState<{ x: number, y: number } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!gameStarted || status !== 'playing') return;
    if (turn >= GAME_DURATION) {
      setStatus('win');
      setTimeout(() => {
        onComplete({
          gameType: 'forest-defense',
          score: 100,
          timeSpent: turn,
          correct: 1,
          total: 1
        });
      }, 1200);
      return;
    }
    intervalRef.current = setTimeout(() => {
      setTurn(t => t + 1);
      setMachines(prev => prev.map(machine => {
        // Si arbre devant, ne bouge pas ce tour
        if (trees.some(tree => tree.x === machine.x + 1 && tree.y === machine.y)) {
          return { ...machine };
        }
        return { ...machine, x: machine.x + 1 };
      }));
    }, 900);
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [gameStarted, turn, status, trees, onComplete]);

  useEffect(() => {
    if (!gameStarted || status !== 'playing') return;
    if (machines.some(m => m.x >= FOREST_LINE)) {
      setStatus('lose');
      setTimeout(() => {
        onComplete({
          gameType: 'forest-defense',
          score: turn * 3,
          timeSpent: turn,
          correct: 0,
          total: 1
        });
      }, 1200);
    }
  }, [machines, gameStarted, status, turn, onComplete]);

  const startGame = () => {
    setGameStarted(true);
    setMachines(INITIAL_MACHINES);
    setTrees([]);
    setTurn(0);
    setStatus('playing');
    setSelectedCell(null);
  };

  const handleCellClick = (x: number, y: number) => {
    if (!gameStarted || status !== 'playing') return;
    if (x === 0 || x === FOREST_LINE) return; // pas sur le bord
    if (trees.some(tree => tree.x === x && tree.y === y)) return;
    if (machines.some(m => m.x === x && m.y === y)) return;
    setTrees([...trees, { x, y }]);
  };

  return (
    <div className="space-y-6 text-center">
      {!gameStarted ? (
        <>
          <h4 className="text-xl font-semibold mb-2">La Forêt en Détresse 🌳</h4>
          <p className="text-gray-600 mb-4">Plante des arbres (🌳) pour ralentir les machines (🚜) qui avancent vers la forêt ! Clique sur une case pour planter un arbre. Tiens {GAME_DURATION} tours pour gagner.</p>
          <Button onClick={startGame} className="bg-green-700 text-white hover:bg-green-800">Commencer</Button>
        </>
      ) : (
        <div className="inline-block border-2 border-green-700 bg-white rounded p-2">
          {Array.from({ length: GRID_HEIGHT }).map((_, y) => (
            <div key={y} className="flex">
              {Array.from({ length: GRID_WIDTH }).map((_, x) => {
                const isMachine = machines.some(m => m.x === x && m.y === y);
                const isTree = trees.some(t => t.x === x && t.y === y);
                const isForest = x === FOREST_LINE;
                return (
                  <div
                    key={x}
                    className={`w-8 h-8 flex items-center justify-center text-lg font-bold border border-gray-200 cursor-pointer select-none ${isForest ? 'bg-green-200' : isTree ? 'bg-green-700 text-white' : isMachine ? 'bg-yellow-200' : 'bg-white'} ${selectedCell && selectedCell.x === x && selectedCell.y === y ? 'ring-2 ring-green-500' : ''}`}
                    onClick={() => handleCellClick(x, y)}
                  >
                    {isMachine ? '🚜' : isTree ? '🌳' : isForest ? '🌲' : ''}
                  </div>
                );
              })}
            </div>
          ))}
          <div className="mt-4 text-green-900 font-bold">Tour : {turn + 1} / {GAME_DURATION}</div>
          {status === 'win' && <div className="mt-2 text-green-700 font-bold">Bravo, tu as sauvé la forêt ! 🌲</div>}
          {status === 'lose' && <div className="mt-2 text-red-700 font-bold">Oh non, la forêt a été détruite ! 😢</div>}
          {status === 'playing' && <div className="mt-2 text-gray-600">Clique sur une case pour planter un arbre.</div>}
        </div>
      )}
    </div>
  );
} 