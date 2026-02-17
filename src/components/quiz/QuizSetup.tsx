import { useState } from "react"
import { FilterBar } from "@/components/ui/FilterBar"
import { QUIZ_TYPE_LABELS, QUIZ_TYPES } from "@/types"
import type { Category, Difficulty, QuizConfig, QuizType } from "@/types"

interface QuizSetupProps {
  onStart: (config: QuizConfig) => void
  availableWordCount: number
}

const COUNT_OPTIONS = [10, 20, 0] as const // 0 = all

export function QuizSetup({ onStart, availableWordCount }: QuizSetupProps) {
  const [type, setType] = useState<QuizType>("en-to-ja")
  const [count, setCount] = useState<number>(10)
  const [categories, setCategories] = useState<Category[]>([])
  const [difficulties, setDifficulties] = useState<Difficulty[]>([])
  const [prioritizeWeak, setPrioritizeWeak] = useState(false)

  const handleStart = () => {
    onStart({
      type,
      count: count === 0 ? availableWordCount : count,
      categories,
      difficulties,
      prioritizeWeak,
    })
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">出題形式</p>
        <div className="space-y-2">
          {QUIZ_TYPES.map((qt) => (
            <label key={qt} className="flex items-center gap-2">
              <input
                type="radio"
                name="quizType"
                value={qt}
                checked={type === qt}
                onChange={() => setType(qt)}
                className="text-blue-600"
              />
              <span className="text-sm">{QUIZ_TYPE_LABELS[qt]}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">出題数</p>
        <div className="flex gap-3">
          {COUNT_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-1.5">
              <input
                type="radio"
                name="count"
                value={opt}
                checked={count === opt}
                onChange={() => setCount(opt)}
                className="text-blue-600"
              />
              <span className="text-sm">{opt === 0 ? "全問" : `${opt}問`}</span>
            </label>
          ))}
        </div>
      </div>

      <FilterBar
        selectedCategories={categories}
        selectedDifficulties={difficulties}
        onCategoriesChange={setCategories}
        onDifficultiesChange={setDifficulties}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={prioritizeWeak}
          onChange={(e) => setPrioritizeWeak(e.target.checked)}
          className="text-blue-600"
        />
        <span className="text-sm">苦手な単語を優先</span>
      </label>

      <button
        type="button"
        onClick={handleStart}
        className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
      >
        スタート
      </button>
    </div>
  )
}
