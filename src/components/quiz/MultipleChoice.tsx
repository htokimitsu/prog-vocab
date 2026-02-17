import { useState } from "react"
import type { QuizQuestion } from "@/types"

interface MultipleChoiceProps {
  question: QuizQuestion
  questionNumber: number
  totalQuestions: number
  onAnswer: (answer: string) => void
}

export function MultipleChoice({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: MultipleChoiceProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const isEnToJa = question.type === "en-to-ja"
  const promptText = isEnToJa ? question.word.english : question.word.japanese

  const handleSelect = (answer: string) => {
    if (showResult) return
    setSelectedAnswer(answer)
    setShowResult(true)
    setTimeout(() => {
      onAnswer(answer)
      setSelectedAnswer(null)
      setShowResult(false)
    }, 1200)
  }

  const getOptionStyle = (option: string) => {
    if (!showResult) {
      return "border-gray-200 bg-white hover:bg-gray-50"
    }
    if (option === question.correctAnswer) {
      return "border-green-500 bg-green-50 text-green-800"
    }
    if (option === selectedAnswer && option !== question.correctAnswer) {
      return "border-red-500 bg-red-50 text-red-800"
    }
    return "border-gray-200 bg-white opacity-50"
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Q{questionNumber} / {totalQuestions}
        </span>
      </div>

      <div className="text-center">
        <p className="text-2xl font-bold text-gray-900">{promptText}</p>
      </div>

      <div className="space-y-3">
        {question.options.map((option, i) => (
          <button
            key={option}
            type="button"
            onClick={() => handleSelect(option)}
            disabled={showResult}
            className={`w-full rounded-lg border-2 px-4 py-3 text-left transition-colors ${getOptionStyle(option)}`}
          >
            <span className="font-medium">
              {String.fromCharCode(65 + i)}.{" "}
            </span>
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
