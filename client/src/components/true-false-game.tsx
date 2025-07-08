import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trueFalseQuestions } from "@/lib/game-data";
import { GameResult, TrueFalseQuestion } from "@/types/game";
import { getRandomItems, GAME_POINTS } from "@/lib/game-logic";

interface TrueFalseGameProps {
  onComplete: (result: GameResult) => void;
}

export default function TrueFalseGame({ onComplete }: TrueFalseGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<TrueFalseQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const selectedQuestions = getRandomItems(trueFalseQuestions, 5);
    setQuestions(selectedQuestions);
    setStartTime(Date.now());
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: boolean) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    if (answer === currentQuestion.answer) {
      setScore(score + GAME_POINTS.TRUE_FALSE);
      setCorrectAnswers(correctAnswers + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    onComplete({
      gameType: 'true-false',
      score,
      timeSpent,
      correct: correctAnswers,
      total: questions.length
    });
  };

  if (!currentQuestion) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h4 className="text-xl font-semibold mb-2">Vrai ou Faux : Ville Durable</h4>
        <div className="text-lg text-gray-600">
          Question {currentQuestionIndex + 1} sur {questions.length}
        </div>
      </div>

      <Card className="bg-purple-50">
        <CardContent className="p-6">
          <h5 className="text-lg font-semibold mb-6 text-center">
            {currentQuestion.statement}
          </h5>
          <div className="flex justify-center space-x-4">
            <Button
              variant={
                selectedAnswer === true
                  ? currentQuestion.answer === true
                    ? "default"
                    : "destructive"
                  : "outline"
              }
              className={`px-8 py-4 text-lg font-semibold ${
                selectedAnswer !== null && currentQuestion.answer === true
                  ? 'bg-green-500 text-white'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
              onClick={() => handleAnswerSelect(true)}
              disabled={selectedAnswer !== null}
            >
              ✓ VRAI
            </Button>
            <Button
              variant={
                selectedAnswer === false
                  ? currentQuestion.answer === false
                    ? "default"
                    : "destructive"
                  : "outline"
              }
              className={`px-8 py-4 text-lg font-semibold ${
                selectedAnswer !== null && currentQuestion.answer === false
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
              onClick={() => handleAnswerSelect(false)}
              disabled={selectedAnswer !== null}
            >
              ✗ FAUX
            </Button>
          </div>
        </CardContent>
      </Card>

      {showExplanation && (
        <Card className="bg-green-50">
          <CardContent className="p-4">
            <p className="text-sm text-green-800">{currentQuestion.explanation}</p>
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <div className="text-sm text-gray-500 mb-4">
          Score actuel : <span className="font-semibold eco-green">{score}</span> points
        </div>
        {showExplanation && (
          <Button onClick={handleNextQuestion} className="bg-purple-500 text-white hover:bg-purple-600">
            {currentQuestionIndex < questions.length - 1 ? 'Question suivante' : 'Terminer'}
          </Button>
        )}
      </div>
    </div>
  );
}
