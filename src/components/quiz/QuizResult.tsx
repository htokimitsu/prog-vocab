import { Link } from "react-router-dom"
import type { Word } from "@/types"

interface QuizResultProps {
  score: number
  totalQuestions: number
  wrongWords: Word[]
  onRetry: () => void
}

export function QuizResult({ score, totalQuestions, wrongWords, onRetry }: QuizResultProps) {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0

  const getResultColor = () => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <div>
        <p className="text-4xl font-bold">
          <span className={getResultColor()}>
            {score} / {totalQuestions}
          </span>
        </p>
        <p className="mt-1 text-lg text-gray-600">正答率: {percentage}%</p>
      </div>

      {wrongWords.length > 0 && (
        <div className="text-left">
          <p className="mb-2 font-medium text-gray-700">間違えた単語:</p>
          <div className="space-y-2">
            {wrongWords.map((word) => (
              <div
                key={word.id}
                className="rounded-lg border border-red-100 bg-red-50 px-4 py-2"
              >
                <span className="font-medium text-gray-900">{word.english}</span>
                <span className="mx-2 text-gray-400">-</span>
                <span className="text-gray-700">{word.japanese}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="flex-1 rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
        >
          もう一度
        </button>
        <Link
          to="/"
          className="flex flex-1 items-center justify-center rounded-lg bg-gray-100 py-3 font-medium text-gray-700 hover:bg-gray-200"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  )
}
