import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GameResult } from "@/types/game";

interface ResultModalProps {
  result: GameResult;
  onClose: () => void;
}

const gameTypeNames = {
  'waste-sorting': 'Tri des déchets',
  'eco-quiz': 'Quiz Éclair',
  'catch-waste': 'Attrape les déchets',
  'true-false': 'Vrai ou Faux',
  'spot-behavior': 'Repère les bons gestes',
  'mobility-plan': 'Plan de mobilité',
  'cigarette-battle': 'Bataille contre les mégots',
  'watering-game': 'Le bon arrosage',
  'facade-renovation': 'Refais la façade',
};

export default function ResultModal({ result, onClose }: ResultModalProps) {
  const getResultIcon = () => {
    const percentage = (result.correct / result.total) * 100;
    if (percentage >= 80) return '🎉';
    if (percentage >= 60) return '👍';
    return '💪';
  };

  const getResultMessage = () => {
    const percentage = (result.correct / result.total) * 100;
    if (percentage >= 80) return 'Excellent ! Tu es un vrai champion de l\'écologie !';
    if (percentage >= 60) return 'Bien joué ! Tu maîtrises les bases de l\'écologie urbaine.';
    return 'Continue tes efforts ! Chaque geste compte pour la planète.';
  };

  const getResultTitle = () => {
    const percentage = (result.correct / result.total) * 100;
    if (percentage >= 80) return 'Bravo !';
    if (percentage >= 60) return 'Bien joué !';
    return 'Continue !';
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="p-8 text-center">
          <div className="text-6xl mb-4 animate-bounce-in">{getResultIcon()}</div>
          <h3 className="text-2xl font-bold mb-2">{getResultTitle()}</h3>
          <h4 className="text-lg text-gray-600 mb-4">
            {gameTypeNames[result.gameType as keyof typeof gameTypeNames]}
          </h4>
          <p className="text-gray-600 mb-6">{getResultMessage()}</p>
          
          <Card className="bg-green-50 mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="eco-green font-semibold">Score final</div>
                  <div className="text-2xl font-bold eco-green">{result.score}</div>
                </div>
                <div>
                  <div className="eco-blue font-semibold">Précision</div>
                  <div className="text-2xl font-bold eco-blue">
                    {result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0}%
                  </div>
                </div>
                <div>
                  <div className="eco-orange font-semibold">Temps</div>
                  <div className="text-lg font-bold eco-orange">{result.timeSpent}s</div>
                </div>
                <div>
                  <div className="text-gray-600 font-semibold">Réussis</div>
                  <div className="text-lg font-bold">{result.correct}/{result.total}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button 
            onClick={onClose} 
            className="bg-eco-blue text-white hover:bg-eco-blue/80"
          >
            Continuer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
