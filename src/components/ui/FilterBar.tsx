import { CATEGORIES, CATEGORY_LABELS, DIFFICULTIES, DIFFICULTY_LABELS } from "@/types"
import type { Category, Difficulty } from "@/types"

interface FilterBarProps {
  selectedCategories: Category[]
  selectedDifficulties: Difficulty[]
  onCategoriesChange: (categories: Category[]) => void
  onDifficultiesChange: (difficulties: Difficulty[]) => void
}

export function FilterBar({
  selectedCategories,
  selectedDifficulties,
  onCategoriesChange,
  onDifficultiesChange,
}: FilterBarProps) {
  const handleCategoryChange = (category: Category) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category))
    } else {
      onCategoriesChange([...selectedCategories, category])
    }
  }

  const handleDifficultyChange = (difficulty: Difficulty) => {
    if (selectedDifficulties.includes(difficulty)) {
      onDifficultiesChange(selectedDifficulties.filter((d) => d !== difficulty))
    } else {
      onDifficultiesChange([...selectedDifficulties, difficulty])
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1.5 text-sm font-medium text-gray-700">カテゴリ</p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedCategories.includes(cat)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-sm font-medium text-gray-700">難易度</p>
        <div className="flex gap-1.5">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => handleDifficultyChange(diff)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedDifficulties.includes(diff)
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {DIFFICULTY_LABELS[diff]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
