import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { badges } from "@/lib/game-data";

interface AchievementToastProps {
  achievements: string[];
  onClose: () => void;
}

export default function AchievementToast({ achievements, onClose }: AchievementToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const getBadgeInfo = (badgeId: string) => {
    return badges.find(badge => badge.id === badgeId) || {
      name: 'Nouveau badge',
      emoji: '🏆',
      description: 'Félicitations !'
    };
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {achievements.map((achievementId, index) => {
        const badge = getBadgeInfo(achievementId);
        return (
          <Card key={index} className="animate-slide-up shadow-lg border-l-4 border-l-yellow-400">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{badge.emoji}</div>
                <div>
                  <div className="font-semibold text-gray-800">Nouveau badge !</div>
                  <div className="text-sm text-gray-600">{badge.name}</div>
                  <div className="text-xs text-gray-500">{badge.description}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
