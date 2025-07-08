import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { quizQuestions } from "@/lib/game-data";
import { GameResult, QuizQuestion } from "@/types/game";
import { getRandomItems, GAME_POINTS } from "@/lib/game-logic";

interface EcoQuizGameProps {
  onComplete: (result: GameResult) => void;
}

export default function EcoQuizGame({ onComplete }: EcoQuizGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const selectedQuestions = getRandomItems(quizQuestions, 5);
    setQuestions(selectedQuestions);
    setStartTime(Date.now());
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + GAME_POINTS.QUIZ_CORRECT);
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
      gameType: 'eco-quiz',
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
        <h4 className="text-xl font-semibold mb-2">Quiz Éclair sur l'Écologie Urbaine</h4>
        <div className="text-lg text-gray-600">
          Question {currentQuestionIndex + 1} sur {questions.length}
        </div>
      </div>

      <Card className="bg-blue-50">
        <CardContent className="p-6">
          <h5 className="text-lg font-semibold mb-4">{currentQuestion.question}</h5>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  selectedAnswer === index
                    ? index === currentQuestion.correctAnswer
                      ? "default"
                      : "destructive"
                    : "outline"
                }
                className={`w-full text-left p-4 h-auto justify-start ${
                  selectedAnswer === null ? 'hover:bg-blue-100' : ''
                } ${
                  selectedAnswer !== null && index === currentQuestion.correctAnswer
                    ? 'bg-green-100 border-green-500'
                    : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
              >
                <span className="font-semibold text-blue-600 mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </Button>
            ))}
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
          <Button onClick={handleNextQuestion} className="bg-eco-blue text-white">
            {currentQuestionIndex < questions.length - 1 ? 'Question suivante' : 'Terminer'}
          </Button>
        )}
      </div>
    </div>
  );
}
