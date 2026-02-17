import type { LearningStatus, Word } from "@/types"
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from "@/types"

interface WordListProps {
  words: ReadonlyArray<Word>
  progressMap: Record<string, LearningStatus>
}

const STATUS_ICON: Record<LearningStatus, string> = {
  unlearned: "---",
  learning: "...",
  mastered: "[OK]",
}

const STATUS_COLOR: Record<LearningStatus, string> = {
  unlearned: "text-gray-400",
  learning: "text-yellow-600",
  mastered: "text-green-600",
}

export function WordList({ words, progressMap }: WordListProps) {
  if (words.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        該当する単語がありません。
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {words.map((word) => {
        const status = progressMap[word.id] ?? "unlearned"
        return (
          <div
            key={word.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{word.english}</span>
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                  {DIFFICULTY_LABELS[word.difficulty]}
                </span>
                <span className="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-600">
                  {CATEGORY_LABELS[word.category]}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-gray-600">{word.japanese}</p>
            </div>
            <span className={`ml-3 text-sm font-mono font-bold ${STATUS_COLOR[status]}`}>
              {STATUS_ICON[status]}
            </span>
          </div>
        )
      })}
    </div>
  )
}
