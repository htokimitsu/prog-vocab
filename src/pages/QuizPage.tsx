import { MultipleChoice } from "@/components/quiz/MultipleChoice"
import { QuizResult } from "@/components/quiz/QuizResult"
import { QuizSetup } from "@/components/quiz/QuizSetup"
import { TypingQuiz } from "@/components/quiz/TypingQuiz"
import { useProgress } from "@/hooks/useProgress"
import { useQuiz } from "@/hooks/useQuiz"
import { useWords } from "@/hooks/useWords"

export function QuizPage() {
  const { allWords } = useWords()
  const { progress, recordQuizResult } = useProgress()
  const quiz = useQuiz(allWords, progress)

  const handleAnswer = (answer: string) => {
    if (quiz.currentQuestion) {
      const correct = answer === quiz.currentQuestion.correctAnswer
      recordQuizResult(quiz.currentQuestion.word.id, correct, quiz.currentQuestion.type)
    }
    quiz.answerQuestion(answer)
  }

  if (quiz.phase === "setup") {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Quiz</h1>
        <QuizSetup onStart={quiz.startQuiz} availableWordCount={allWords.length} />
      </div>
    )
  }

  if (quiz.phase === "result") {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Quiz Result</h1>
        <QuizResult
          score={quiz.score}
          totalQuestions={quiz.totalQuestions}
          wrongWords={quiz.wrongWords}
          onRetry={quiz.resetQuiz}
        />
      </div>
    )
  }

  if (!quiz.currentQuestion) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Quiz</h1>
      {quiz.currentQuestion.type === "typing" ? (
        <TypingQuiz
          question={quiz.currentQuestion}
          questionNumber={quiz.currentIndex + 1}
          totalQuestions={quiz.totalQuestions}
          onAnswer={handleAnswer}
        />
      ) : (
        <MultipleChoice
          question={quiz.currentQuestion}
          questionNumber={quiz.currentIndex + 1}
          totalQuestions={quiz.totalQuestions}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  )
}
