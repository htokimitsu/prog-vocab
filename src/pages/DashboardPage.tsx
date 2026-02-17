import { ProgressChart } from "@/components/dashboard/ProgressChart"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { useProgress } from "@/hooks/useProgress"
import { useWords } from "@/hooks/useWords"
import {
  calculateCategoryStats,
  calculateDifficultyStats,
  calculateOverallStats,
} from "@/lib/statsCalculator"

export function DashboardPage() {
  const { allWords } = useWords()
  const { progress } = useProgress()

  const overall = calculateOverallStats(allWords, progress)
  const categoryStats = calculateCategoryStats(allWords, progress)
  const difficultyStats = calculateDifficultyStats(allWords, progress)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatsCard label="全単語数" value={overall.totalWords} color="blue" />
        <StatsCard label="習得済み" value={overall.masteredCount} color="green" />
        <StatsCard label="学習中" value={overall.learningCount} color="yellow" />
        <StatsCard label="未学習" value={overall.unlearnedCount} color="gray" />
      </div>

      <ProgressChart
        overall={overall}
        categoryStats={categoryStats}
        difficultyStats={difficultyStats}
      />
    </div>
  )
}
