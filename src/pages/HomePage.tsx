import { Link } from "react-router-dom"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { useProgress } from "@/hooks/useProgress"
import { useWords } from "@/hooks/useWords"
import { calculateOverallStats } from "@/lib/statsCalculator"

export function HomePage() {
  const { allWords } = useWords()
  const { progress } = useProgress()
  const stats = calculateOverallStats(allWords, progress)

  const menuItems = [
    { to: "/flashcard", label: "Flash Card", description: "カードをめくって学習", color: "bg-blue-500" },
    { to: "/quiz", label: "Quiz", description: "クイズで理解度チェック", color: "bg-green-500" },
    { to: "/words", label: "Word List", description: "単語一覧を閲覧", color: "bg-purple-500" },
    { to: "/dashboard", label: "Dashboard", description: "学習進捗を確認", color: "bg-orange-500" },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Prog Vocab</h1>
        <p className="mt-1 text-gray-600">プログラミング英単語学習</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`mb-3 inline-block rounded-lg ${item.color} px-3 py-1 text-sm font-medium text-white`}>
              {item.label}
            </div>
            <p className="text-sm text-gray-600">{item.description}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-gray-500">Quick Stats</h2>
        <div className="grid grid-cols-3 gap-3">
          <StatsCard label="習得済み" value={stats.masteredCount} color="green" />
          <StatsCard label="学習中" value={stats.learningCount} color="yellow" />
          <StatsCard label="未学習" value={stats.unlearnedCount} color="gray" />
        </div>
      </div>
    </div>
  )
}
