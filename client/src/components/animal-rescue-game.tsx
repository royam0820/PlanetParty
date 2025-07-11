import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GameResult } from "@/types/game";

const ANIMALS = [
  { name: 'Ours polaire', emoji: '🐻‍❄️', habitat: 'Banquise' },
  { name: 'Tigre', emoji: '🐅', habitat: 'Jungle' },
  { name: 'Panda', emoji: '🐼', habitat: 'Forêt de bambous' },
  { name: 'Tortue marine', emoji: '🐢', habitat: 'Océan' },
  { name: 'Koala', emoji: '🐨', habitat: 'Forêt d’eucalyptus' },
];
const HABITATS = [
  'Banquise',
  'Jungle',
  'Forêt de bambous',
  'Océan',
  'Forêt d’eucalyptus',
];

function shuffle(arr: any[]) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

export default function AnimalRescueGame({ onComplete }: { onComplete: (result: GameResult) => void }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [animals, setAnimals] = useState(shuffle(ANIMALS));
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [dragged, setDragged] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'playing' | 'win'>('playing');

  const startGame = () => {
    setGameStarted(true);
    setAnimals(shuffle(ANIMALS));
    setMatches({});
    setScore(0);
    setStatus('playing');
  };

  const onDragStart = (name: string) => setDragged(name);
  const onDrop = (habitat: string) => {
    if (!dragged) return;
    const animal = animals.find(a => a.name === dragged);
    if (animal && animal.habitat === habitat) {
      setMatches(m => ({ ...m, [dragged]: habitat }));
      setScore(s => s + 1);
      if (Object.keys(matches).length + 1 === animals.length) {
        setStatus('win');
        setTimeout(() => {
          onComplete({
            gameType: 'animal-rescue',
            score: score + 1,
            timeSpent: score + 1,
            correct: score + 1,
            total: animals.length
          });
        }, 1200);
      }
    }
    setDragged(null);
  };

  return (
    <div className="space-y-6 text-center">
      {!gameStarted ? (
        <>
          <h4 className="text-xl font-semibold mb-2">Sauvetage des animaux menacés 🐾</h4>
          <p className="text-gray-600 mb-4">Associe chaque animal à son habitat naturel (drag & drop) avant qu’il ne disparaisse !</p>
          <Button onClick={startGame} className="bg-orange-600 text-white hover:bg-orange-700">Commencer</Button>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {animals.map(animal => (
              <div
                key={animal.name}
                draggable={!matches[animal.name]}
                onDragStart={() => onDragStart(animal.name)}
                className={`p-2 rounded shadow text-2xl bg-white border-2 ${matches[animal.name] ? 'opacity-50' : 'cursor-grab'}`}
                style={{ minWidth: 60 }}
              >
                {animal.emoji}
                <div className="text-xs mt-1">{animal.name}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {HABITATS.map(habitat => (
              <div
                key={habitat}
                onDragOver={e => e.preventDefault()}
                onDrop={() => onDrop(habitat)}
                className="p-4 rounded-lg bg-green-100 border-2 border-green-400 min-w-[120px] min-h-[60px] flex flex-col items-center justify-center"
              >
                <span className="font-bold text-green-800">{habitat}</span>
                <div className="mt-2 text-2xl">
                  {Object.entries(matches).find(([_, h]) => h === habitat) ?
                    animals.find(a => matches[a.name] === habitat)?.emoji : ''}
                </div>
              </div>
            ))}
          </div>
          <div className="mb-2 text-lg">Score : <span className="font-bold text-orange-700">{score}</span> / {animals.length}</div>
          {status === 'win' && <div className="text-green-700 font-bold">Bravo, tu as sauvé tous les animaux !</div>}
          {status === 'playing' && <div className="text-gray-600">Fais glisser chaque animal vers son habitat.</div>}
        </div>
      )}
    </div>
  );
} 