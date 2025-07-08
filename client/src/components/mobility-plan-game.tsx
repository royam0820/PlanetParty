import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GameResult } from "@/types/game";
import { GAME_POINTS } from "@/lib/game-logic";

interface Journey {
  id: string;
  from: string;
  to: string;
  distance: string;
  options: TransportOption[];
  correctAnswer: number;
}

interface TransportOption {
  name: string;
  emoji: string;
  co2: string;
  time: string;
}

interface MobilityPlanGameProps {
  onComplete: (result: GameResult) => void;
}

const journeys: Journey[] = [
  {
    id: '1',
    from: 'Maison',
    to: 'École (2km)',
    distance: '2km',
    options: [
      { name: 'Voiture', emoji: '🚗', co2: '300g CO2', time: '8 min' },
      { name: 'Vélo', emoji: '🚴', co2: '0g CO2', time: '8 min' },
      { name: 'Bus', emoji: '🚌', co2: '80g CO2', time: '15 min' },
      { name: 'À pied', emoji: '🚶', co2: '0g CO2', time: '25 min' }
    ],
    correctAnswer: 1
  },
  {
    id: '2',
    from: 'École',
    to: 'Magasin (5km)',
    distance: '5km',
    options: [
      { name: 'Voiture', emoji: '🚗', co2: '750g CO2', time: '15 min' },
      { name: 'Métro', emoji: '🚇', co2: '100g CO2', time: '20 min' },
      { name: 'Trottinette', emoji: '🛴', co2: '20g CO2', time: '25 min' },
      { name: 'Covoiturage', emoji: '🚗👥', co2: '250g CO2', time: '18 min' }
    ],
    correctAnswer: 1
  },
  {
    id: '3',
    from: 'Magasin',
    to: 'Parc (1km)',
    distance: '1km',
    options: [
      { name: 'Voiture', emoji: '🚗', co2: '150g CO2', time: '5 min' },
      { name: 'À pied', emoji: '🚶', co2: '0g CO2', time: '12 min' },
      { name: 'Vélo', emoji: '🚴', co2: '0g CO2', time: '4 min' },
      { name: 'Bus', emoji: '🚌', co2: '40g CO2', time: '8 min' }
    ],
    correctAnswer: 2
  },
  {
    id: '4',
    from: 'Parc',
    to: 'Cinéma (8km)',
    distance: '8km',
    options: [
      { name: 'Voiture', emoji: '🚗', co2: '1200g CO2', time: '25 min' },
      { name: 'Train', emoji: '🚄', co2: '120g CO2', time: '18 min' },
      { name: 'Bus', emoji: '🚌', co2: '200g CO2', time: '35 min' },
      { name: 'Vélo électrique', emoji: '🚴‍♀️⚡', co2: '30g CO2', time: '30 min' }
    ],
    correctAnswer: 1
  },
  {
    id: '5',
    from: 'Cinéma',
    to: 'Maison (6km)',
    distance: '6km',
    options: [
      { name: 'Taxi', emoji: '🚕', co2: '900g CO2', time: '20 min' },
      { name: 'Métro', emoji: '🚇', co2: '120g CO2', time: '25 min' },
      { name: 'Trottinette partagée', emoji: '🛴', co2: '40g CO2', time: '35 min' },
      { name: 'Covoiturage', emoji: '🚗👥', co2: '300g CO2', time: '22 min' }
    ],
    correctAnswer: 1
  }
];

export default function MobilityPlanGame({ onComplete }: MobilityPlanGameProps) {
  const [currentJourneyIndex, setCurrentJourneyIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const currentJourney = journeys[currentJourneyIndex];

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(optionIndex);
    setShowExplanation(true);
    
    if (optionIndex === currentJourney.correctAnswer) {
      setScore(score + GAME_POINTS.MOBILITY_PLAN);
      setCorrectAnswers(correctAnswers + 1);
    }
  };

  const handleNextJourney = () => {
    if (currentJourneyIndex < journeys.length - 1) {
      setCurrentJourneyIndex(currentJourneyIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    onComplete({
      gameType: 'mobility-plan',
      score,
      timeSpent,
      correct: correctAnswers,
      total: journeys.length
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h4 className="text-xl font-semibold mb-2">Plan de Mobilité Écologique</h4>
        <div className="text-lg text-gray-600">
          Trajet {currentJourneyIndex + 1} sur {journeys.length}
        </div>
      </div>

      <Card className="bg-indigo-50">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h5 className="text-lg font-semibold mb-2">
              {currentJourney.from} → {currentJourney.to}
            </h5>
            <p className="text-gray-600">Distance: {currentJourney.distance}</p>
            <p className="text-sm text-gray-500 mt-2">
              Choisis le moyen de transport le plus écologique !
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentJourney.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  selectedOption === index
                    ? index === currentJourney.correctAnswer
                      ? "default"
                      : "destructive"
                    : "outline"
                }
                className={`p-4 h-auto ${
                  selectedOption === null ? 'hover:bg-indigo-100' : ''
                } ${
                  selectedOption !== null && index === currentJourney.correctAnswer
                    ? 'bg-green-100 border-green-500'
                    : ''
                }`}
                onClick={() => handleOptionSelect(index)}
                disabled={selectedOption !== null}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{option.emoji}</div>
                  <div className="font-semibold">{option.name}</div>
                  <div className="text-sm text-gray-600">{option.co2}</div>
                  <div className="text-sm text-gray-500">{option.time}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {showExplanation && (
        <Card className="bg-green-50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-green-800 mb-2">
                <strong>Meilleur choix:</strong> {currentJourney.options[currentJourney.correctAnswer].name}
              </p>
              <p className="text-xs text-green-700">
                Le transport le plus écologique produit le moins de CO2 par personne pour ce trajet.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <div className="text-sm text-gray-500 mb-4">
          Score actuel : <span className="font-semibold eco-green">{score}</span> points
        </div>
        {showExplanation && (
          <Button onClick={handleNextJourney} className="bg-indigo-500 text-white hover:bg-indigo-600">
            {currentJourneyIndex < journeys.length - 1 ? 'Trajet suivant' : 'Terminer'}
          </Button>
        )}
      </div>
    </div>
  );
}
