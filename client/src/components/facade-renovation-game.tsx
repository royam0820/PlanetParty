import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GameResult } from "@/types/game";
import { GAME_POINTS } from "@/lib/game-logic";

interface RenovationOption {
  id: string;
  name: string;
  emoji: string;
  description: string;
  ecoScore: number;
  cost: number;
  benefit: string;
}

interface FacadeRenovationGameProps {
  onComplete: (result: GameResult) => void;
}

const renovationOptions: RenovationOption[] = [
  {
    id: '1',
    name: 'Mur végétal',
    emoji: '🌿',
    description: 'Installation d\'un mur végétalisé',
    ecoScore: 9,
    cost: 3,
    benefit: 'Améliore la qualité de l\'air et isole naturellement'
  },
  {
    id: '2',
    name: 'Panneaux solaires',
    emoji: '☀️',
    description: 'Toiture avec panneaux photovoltaïques',
    ecoScore: 10,
    cost: 4,
    benefit: 'Produit de l\'énergie renouvelable'
  },
  {
    id: '3',
    name: 'Balcons potagers',
    emoji: '🌱',
    description: 'Espaces de culture sur les balcons',
    ecoScore: 7,
    cost: 2,
    benefit: 'Permet l\'agriculture urbaine et réduit les déchets'
  },
  {
    id: '4',
    name: 'Isolation écologique',
    emoji: '🏠',
    description: 'Matériaux d\'isolation naturels',
    ecoScore: 8,
    cost: 3,
    benefit: 'Réduit la consommation énergétique'
  },
  {
    id: '5',
    name: 'Récupération d\'eau',
    emoji: '💧',
    description: 'Système de récupération d\'eau de pluie',
    ecoScore: 8,
    cost: 2,
    benefit: 'Économise l\'eau potable'
  },
  {
    id: '6',
    name: 'Peinture blanche',
    emoji: '🎨',
    description: 'Peinture simple sans isolation',
    ecoScore: 2,
    cost: 1,
    benefit: 'Rafraîchit légèrement le bâtiment'
  }
];

export default function FacadeRenovationGame({ onComplete }: FacadeRenovationGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [budget, setBudget] = useState(8);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  const startGame = () => {
    setGameStarted(true);
    setSelectedOptions([]);
    setBudget(8);
    setShowResults(false);
    setScore(0);
    setStartTime(Date.now());
  };

  const handleOptionSelect = (optionId: string) => {
    const option = renovationOptions.find(opt => opt.id === optionId);
    if (!option) return;

    if (selectedOptions.includes(optionId)) {
      // Deselect option
      setSelectedOptions(prev => prev.filter(id => id !== optionId));
      setBudget(prev => prev + option.cost);
    } else {
      // Select option if budget allows
      if (budget >= option.cost) {
        setSelectedOptions(prev => [...prev, optionId]);
        setBudget(prev => prev - option.cost);
      }
    }
  };

  const finishRenovation = () => {
    const totalEcoScore = selectedOptions.reduce((total, optionId) => {
      const option = renovationOptions.find(opt => opt.id === optionId);
      return total + (option ? option.ecoScore : 0);
    }, 0);

    const finalScore = totalEcoScore * GAME_POINTS.FACADE_RENOVATION;
    setScore(finalScore);
    setShowResults(true);
  };

  const endGame = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const totalEcoScore = selectedOptions.reduce((total, optionId) => {
      const option = renovationOptions.find(opt => opt.id === optionId);
      return total + (option ? option.ecoScore : 0);
    }, 0);

    onComplete({
      gameType: 'facade-renovation',
      score,
      timeSpent,
      correct: Math.min(totalEcoScore, 25), // Max eco score for perfect
      total: 25
    });
  };

  const getSelectedOptions = () => {
    return selectedOptions.map(id => renovationOptions.find(opt => opt.id === id)!);
  };

  const getTotalEcoScore = () => {
    return selectedOptions.reduce((total, optionId) => {
      const option = renovationOptions.find(opt => opt.id === optionId);
      return total + (option ? option.ecoScore : 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {!gameStarted ? (
        <div className="text-center">
          <h4 className="text-xl font-semibold mb-2">Refais la façade !</h4>
          <p className="text-gray-600 mb-6">
            Tu as un budget limité pour verdir cet immeuble gris. 
            Choisis les meilleures solutions écologiques !
          </p>
          <div className="bg-emerald-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-emerald-800">
              🏢 <strong>Objectif :</strong> Maximise l'impact écologique avec un budget de 8 points.
              Chaque solution a un coût et un bénéfice différent.
            </p>
          </div>
          <Button onClick={startGame} className="bg-emerald-500 text-white hover:bg-emerald-600">
            Commencer la rénovation !
          </Button>
        </div>
      ) : !showResults ? (
        <>
          <div className="text-center mb-6">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="text-lg font-bold text-orange-600">💰 Budget: {budget} points</div>
              <div className="text-lg font-bold eco-green">🌱 Éco-score: {getTotalEcoScore()}</div>
            </div>
          </div>

          {/* Building visualization */}
          <Card className="bg-gray-100 mb-6">
            <CardContent className="p-6">
              <div className="relative h-64 bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex flex-col">
                  {/* Building facade */}
                  <div className="flex-1 relative">
                    {selectedOptions.includes('1') && (
                      <div className="absolute left-0 top-0 w-1/3 h-full bg-green-200 flex items-center justify-center text-4xl">
                        🌿
                      </div>
                    )}
                    {selectedOptions.includes('4') && (
                      <div className="absolute inset-0 bg-yellow-100 opacity-30"></div>
                    )}
                    {selectedOptions.includes('6') && (
                      <div className="absolute inset-0 bg-white opacity-40"></div>
                    )}
                    
                    {/* Windows with balcony gardens */}
                    <div className="absolute top-8 left-1/2 w-8 h-6 bg-blue-200 border-2 border-gray-600">
                      {selectedOptions.includes('3') && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-sm">🌱</div>
                      )}
                    </div>
                    <div className="absolute top-8 right-8 w-8 h-6 bg-blue-200 border-2 border-gray-600">
                      {selectedOptions.includes('3') && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-sm">🌱</div>
                      )}
                    </div>
                    
                    {/* Water collection system */}
                    {selectedOptions.includes('5') && (
                      <div className="absolute bottom-4 right-4 text-2xl">💧</div>
                    )}
                  </div>
                  
                  {/* Roof with solar panels */}
                  <div className="h-8 bg-red-800 relative">
                    {selectedOptions.includes('2') && (
                      <div className="absolute inset-0 bg-blue-900 flex items-center justify-center text-lg">
                        ☀️☀️☀️
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Renovation options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {renovationOptions.map((option) => (
              <Card 
                key={option.id}
                className={`cursor-pointer transition-all ${
                  selectedOptions.includes(option.id)
                    ? 'border-green-500 bg-green-50'
                    : budget < option.cost
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleOptionSelect(option.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{option.emoji}</div>
                    <div className="flex-1">
                      <h5 className="font-semibold">{option.name}</h5>
                      <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-green-600">🌱 Éco: {option.ecoScore}/10</span>
                        <span className="text-orange-600">💰 Coût: {option.cost}</span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">{option.benefit}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={finishRenovation} 
              disabled={selectedOptions.length === 0}
              className="bg-emerald-500 text-white hover:bg-emerald-600"
            >
              Terminer la rénovation
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center space-y-6">
          <h4 className="text-2xl font-bold">Rénovation terminée !</h4>
          
          <Card className="bg-emerald-50">
            <CardContent className="p-6">
              <div className="text-lg font-semibold mb-4">Votre impact écologique :</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-emerald-600 font-semibold">Éco-score total</div>
                  <div className="text-2xl font-bold text-emerald-600">{getTotalEcoScore()}/25</div>
                </div>
                <div>
                  <div className="text-blue-600 font-semibold">Budget utilisé</div>
                  <div className="text-2xl font-bold text-blue-600">{8 - budget}/8</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <h5 className="font-semibold">Solutions choisies :</h5>
            {getSelectedOptions().map((option) => (
              <div key={option.id} className="text-sm bg-white p-2 rounded border">
                {option.emoji} {option.name} - {option.benefit}
              </div>
            ))}
          </div>

          <Button onClick={endGame} className="bg-emerald-500 text-white">
            Continuer
          </Button>
        </div>
      )}
    </div>
  );
}