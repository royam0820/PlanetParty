import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import WasteSortingGame from "./waste-sorting-game";
import EcoQuizGame from "./eco-quiz-game";
import CatchWasteGame from "./catch-waste-game";
import TrueFalseGame from "./true-false-game";
import SpotBehaviorGame from "./spot-behavior-game";
import MobilityPlanGame from "./mobility-plan-game";
import CigaretteBattleGame from "./cigarette-battle-game";
import WateringGame from "./watering-game";
import FacadeRenovationGame from "./facade-renovation-game";
import { GameResult } from "@/types/game";

interface GameModalProps {
  gameType: string;
  onComplete: (result: GameResult) => void;
  onClose: () => void;
}

const gameComponents = {
  'waste-sorting': WasteSortingGame,
  'eco-quiz': EcoQuizGame,
  'catch-waste': CatchWasteGame,
  'true-false': TrueFalseGame,
  'spot-behavior': SpotBehaviorGame,
  'mobility-plan': MobilityPlanGame,
  'cigarette-battle': CigaretteBattleGame,
  'watering-game': WateringGame,
  'facade-renovation': FacadeRenovationGame,
};

const gameTitles = {
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

export default function GameModal({ gameType, onComplete, onClose }: GameModalProps) {
  const GameComponent = gameComponents[gameType as keyof typeof gameComponents];
  const title = gameTitles[gameType as keyof typeof gameTitles];

  if (!GameComponent) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <GameComponent onComplete={onComplete} />
      </DialogContent>
    </Dialog>
  );
}
