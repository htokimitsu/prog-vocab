import { ProgressBar } from "@/components/ui/ProgressBar"
import type { CategoryStats, DifficultyStats, OverallStats } from "@/types"
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from "@/types"

interface ProgressChartProps {
  overall: OverallStats
  categoryStats: CategoryStats[]
  difficultyStats: DifficultyStats[]
}

export function ProgressChart({ overall, categoryStats, difficultyStats }: ProgressChartProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-3 text-lg font-bold text-gray-900">全体進捗</h2>
        <ProgressBar value={overall.masteryRate} label="習得率" color="blue" />
        <p className="mt-2 text-sm text-gray-600">
          {overall.masteredCount} / {overall.totalWords} 単語習得
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold text-gray-900">カテゴリ別</h2>
        <div className="space-y-3">
          {categoryStats
            .filter((s) => s.totalWords > 0)
            .map((stat) => (
              <ProgressBar
                key={stat.category}
                value={stat.masteryRate}
                label={CATEGORY_LABELS[stat.category]}
                color={stat.masteryRate >= 80 ? "green" : stat.masteryRate >= 40 ? "yellow" : "red"}
              />
            ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold text-gray-900">難易度別</h2>
        <div className="space-y-3">
          {difficultyStats
            .filter((s) => s.totalWords > 0)
            .map((stat) => (
              <ProgressBar
                key={stat.difficulty}
                value={stat.masteryRate}
                label={DIFFICULTY_LABELS[stat.difficulty]}
                color={stat.masteryRate >= 80 ? "green" : stat.masteryRate >= 40 ? "yellow" : "red"}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
