import { Card, CardContent } from "@/components/ui/card";
import { UserProgress } from "@/types/game";

interface ProgressSectionProps {
  progress: UserProgress;
}

export default function ProgressSection({ progress }: ProgressSectionProps) {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Tes progrès</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-800">Défis réussis</h4>
            <p className="text-3xl font-bold eco-green">{progress.completedChallenges}</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-800">Série actuelle</h4>
            <p className="text-3xl font-bold eco-blue">{progress.currentStreak}</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌟</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-800">Badges gagnés</h4>
            <p className="text-3xl font-bold eco-orange">{progress.badges.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
