import type {
  CategoryStats,
  DifficultyStats,
  LearningStatus,
  OverallStats,
  ProgressStore,
  Word,
  WordProgress,
} from "@/types"
import { CATEGORIES, DIFFICULTIES } from "@/types"

const RECENT_COUNT = 5
const MASTERY_THRESHOLD = 4

export function calculateOverallStats(
  words: ReadonlyArray<Word>,
  progress: ProgressStore,
): OverallStats {
  const totalWords = words.length
  let masteredCount = 0
  let learningCount = 0

  for (const word of words) {
    const status = getWordStatus(word.id, progress)
    if (status === "mastered") masteredCount++
    else if (status === "learning") learningCount++
  }

  const unlearnedCount = totalWords - masteredCount - learningCount
  const masteryRate = totalWords > 0 ? Math.round((masteredCount / totalWords) * 100) : 0

  return { totalWords, masteredCount, learningCount, unlearnedCount, masteryRate }
}

export function calculateCategoryStats(
  words: ReadonlyArray<Word>,
  progress: ProgressStore,
): CategoryStats[] {
  return CATEGORIES.map((category) => {
    const categoryWords = words.filter((w) => w.category === category)
    const masteredCount = categoryWords.filter(
      (w) => getWordStatus(w.id, progress) === "mastered",
    ).length
    const totalWords = categoryWords.length
    const masteryRate = totalWords > 0 ? Math.round((masteredCount / totalWords) * 100) : 0

    return { category, totalWords, masteredCount, masteryRate }
  })
}

export function calculateDifficultyStats(
  words: ReadonlyArray<Word>,
  progress: ProgressStore,
): DifficultyStats[] {
  return DIFFICULTIES.map((difficulty) => {
    const diffWords = words.filter((w) => w.difficulty === difficulty)
    const masteredCount = diffWords.filter(
      (w) => getWordStatus(w.id, progress) === "mastered",
    ).length
    const totalWords = diffWords.length
    const masteryRate = totalWords > 0 ? Math.round((masteredCount / totalWords) * 100) : 0

    return { difficulty, totalWords, masteredCount, masteryRate }
  })
}

export function determineStatus(wp: WordProgress): LearningStatus {
  const allResults = collectRecentResults(wp)

  if (allResults.length === 0) return "unlearned"
  if (allResults.length < RECENT_COUNT) return "learning"

  const recentResults = allResults.slice(-RECENT_COUNT)
  const correctCount = recentResults.filter((r) => r).length

  return correctCount >= MASTERY_THRESHOLD ? "mastered" : "learning"
}

function collectRecentResults(wp: WordProgress): boolean[] {
  const flashcardEntries = wp.flashcardResults.map((r) => ({
    correct: r.remembered,
    timestamp: r.timestamp,
  }))
  const quizEntries = wp.quizResults.map((r) => ({
    correct: r.correct,
    timestamp: r.timestamp,
  }))

  const combined = [...flashcardEntries, ...quizEntries]
  combined.sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  return combined.map((e) => e.correct)
}

function getWordStatus(wordId: string, progress: ProgressStore): LearningStatus {
  const wp = progress.progress[wordId]
  if (!wp) return "unlearned"
  return wp.status
}
