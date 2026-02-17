import { useEffect, useRef, useState } from "react"
import type { QuizQuestion } from "@/types"

interface TypingQuizProps {
  question: QuizQuestion
  questionNumber: number
  totalQuestions: number
  onAnswer: (answer: string) => void
}

export function TypingQuiz({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: TypingQuizProps) {
  const [input, setInput] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [question])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (showResult || input.trim() === "") return

    const correct = input.trim().toLowerCase() === question.correctAnswer.toLowerCase()
    setIsCorrect(correct)
    setShowResult(true)

    setTimeout(() => {
      onAnswer(correct ? question.correctAnswer : input.trim())
      setInput("")
      setShowResult(false)
      setIsCorrect(false)
    }, 1500)
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Q{questionNumber} / {totalQuestions}
        </span>
      </div>

      <div className="text-center">
        <p className="text-2xl font-bold text-gray-900">{question.word.japanese}</p>
        <p className="mt-1 text-sm text-gray-500">英単語を入力してください</p>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={showResult}
          autoComplete="off"
          className={`w-full rounded-lg border-2 px-4 py-3 text-center text-lg focus:outline-none ${
            showResult
              ? isCorrect
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
              : "border-gray-300 focus:border-blue-500"
          }`}
          placeholder="英単語を入力..."
        />
        {showResult && !isCorrect && (
          <p className="mt-2 text-center text-sm text-red-600">
            正答: <span className="font-bold">{question.correctAnswer}</span>
          </p>
        )}
        {!showResult && (
          <button
            type="submit"
            className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            回答する
          </button>
        )}
      </form>
    </div>
  )
}
