import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import WasteSortingGame from "./waste-sorting-game";
import EcoQuizGame from "./eco-quiz-game";
import CatchWasteGame from "./catch-waste-game";
import TrueFalseGame from "./true-false-game";
import SpotBehaviorGame from "./spot-behavior-game";
import MobilityPlanGame from "./mobility-plan-game";
import CigaretteBattleGame from "./cigarette-battle-game";
import LightHuntGame from "./light-hunt-game";
import FacadeRenovationGame from "./facade-renovation-game";
import BeeMazeGame from "./bee-maze-game";
import ForestDefenseGame from "./forest-defense-game";
import BeachCleanupGame from "./beach-cleanup-game";
import StopInvasivesGame from "./stop-invasives-game";
import AnimalRescueGame from "./animal-rescue-game";
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
  'animal-rescue': AnimalRescueGame,
  'mobility-plan': MobilityPlanGame,
  'cigarette-battle': CigaretteBattleGame,
  'light-hunt': LightHuntGame,
  'stop-invasives': StopInvasivesGame,
  'bee-maze': BeeMazeGame,
  'forest-defense': ForestDefenseGame,
  'beach-cleanup': BeachCleanupGame,
};

const gameTitles = {
  'waste-sorting': 'Tri des déchets',
  'eco-quiz': 'Quiz Éclair',
  'catch-waste': 'Attrape les déchets',
  'true-false': 'Vrai ou Faux',
  'animal-rescue': 'Sauvetage des animaux menacés',
  'mobility-plan': 'Plan de mobilité',
  'cigarette-battle': 'Bataille contre les mégots',
  'light-hunt': 'Chasse aux lumières',
  'stop-invasives': 'Stop Invasives !',
  'bee-maze': 'Sauve les abeilles',
  'forest-defense': 'La Forêt en Détresse',
  'beach-cleanup': 'Nettoie la plage',
};

export default function GameModal({ gameType, onComplete, onClose }: GameModalProps) {
  const GameComponent = gameComponents[gameType as keyof typeof gameComponents];
  const title = gameTitles[gameType as keyof typeof gameTitles];

  if (!GameComponent) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto eco-pattern">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <GameComponent onComplete={onComplete} />
      </DialogContent>
    </Dialog>
  );
}
