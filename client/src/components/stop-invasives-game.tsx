import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GameResult } from "@/types/game";

const SPECIES = [
  { type: 'invasive', emoji: '🌵' },
  { type: 'invasive', emoji: '🐍' },
  { type: 'invasive', emoji: '🦎' },
  { type: 'native', emoji: '🌳' },
  { type: 'native', emoji: '🐦' },
  { type: 'protected', emoji: '🦋' },
  { type: 'protected', emoji: '🐢' },
];

function getRandomSpecies() {
  return SPECIES[Math.floor(Math.random() * SPECIES.length)];
}

export default function StopInvasivesGame({ onComplete }: { onComplete: (result: GameResult) => void }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [current, setCurrent] = useState<{ type: string, emoji: string } | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(0);
  const [status, setStatus] = useState<'playing' | 'win' | 'lose'>('playing');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const TOTAL_ROUNDS = 15;

  useEffect(() => {
    if (!gameStarted || status !== 'playing') return;
    if (round >= TOTAL_ROUNDS) {
      setStatus('win');
      setTimeout(() => {
        onComplete({
          gameType: 'stop-invasives',
          score,
          timeSpent: round,
          correct: score,
          total: TOTAL_ROUNDS
        });
      }, 1200);
      return;
    }
    const next = () => {
      setCurrent(getRandomSpecies());
      setRound(r => r + 1);
    };
    timerRef.current = setTimeout(() => {
      next();
    }, 1200);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameStarted, round, status, onComplete, score]);

  useEffect(() => {
    if (lives <= 0 && status === 'playing') {
      setStatus('lose');
      setTimeout(() => {
        onComplete({
          gameType: 'stop-invasives',
          score,
          timeSpent: round,
          correct: score,
          total: TOTAL_ROUNDS
        });
      }, 1200);
    }
  }, [lives, status, onComplete, score, round]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLives(3);
    setRound(0);
    setStatus('playing');
    setCurrent(getRandomSpecies());
  };

  const handleClick = () => {
    if (!current) return;
    if (current.type === 'invasive') {
      setScore(s => s + 1);
    } else if (current.type === 'protected') {
      setLives(l => l - 1);
    }
    setCurrent(getRandomSpecies());
    setRound(r => r + 1);
  };

  return (
    <div className="space-y-6 text-center">
      {!gameStarted ? (
        <>
          <h4 className="text-xl font-semibold mb-2">Stop Invasives ! 🦎</h4>
          <p className="text-gray-600 mb-4">Clique sur les espèces envahissantes (🌵🐍🦎) pour les éliminer, mais ne touche pas aux espèces protégées (🦋🐢) ! Tu as 3 vies.</p>
          <Button onClick={startGame} className="bg-lime-600 text-white hover:bg-lime-700">Commencer</Button>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <div className="mb-4 text-5xl cursor-pointer select-none" onClick={handleClick}>
            {current ? current.emoji : ''}
          </div>
          <div className="mb-2 text-lg">Score : <span className="font-bold text-lime-700">{score}</span> | Vies : <span className="font-bold text-red-600">{lives}</span> | Manche : {round}/{TOTAL_ROUNDS}</div>
          {status === 'win' && <div className="text-green-700 font-bold">Bravo, tu as protégé la biodiversité !</div>}
          {status === 'lose' && <div className="text-red-700 font-bold">Tu as perdu toutes tes vies !</div>}
          {status === 'playing' && <div className="text-gray-600">Clique vite sur les envahissantes, attention aux protégées !</div>}
        </div>
      )}
    </div>
  );
} 