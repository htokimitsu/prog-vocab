import type { ProgressStore, QuizConfig, QuizQuestion, QuizType, Word } from "@/types"

export function generateQuiz(
  words: ReadonlyArray<Word>,
  progress: ProgressStore,
  config: QuizConfig,
): QuizQuestion[] {
  let filtered = [...words]

  if (config.categories.length > 0) {
    filtered = filtered.filter((w) => config.categories.includes(w.category))
  }
  if (config.difficulties.length > 0) {
    filtered = filtered.filter((w) => config.difficulties.includes(w.difficulty))
  }

  if (config.prioritizeWeak) {
    filtered = sortByWeakness(filtered, progress)
  } else {
    filtered = shuffle(filtered)
  }

  const count = Math.min(config.count, filtered.length)
  const selected = filtered.slice(0, count)

  return selected.map((word) => createQuestion(word, words, config.type))
}

export function generateOptions(
  correctWord: Word,
  allWords: ReadonlyArray<Word>,
  type: QuizType,
): string[] {
  const correctAnswer = type === "en-to-ja" ? correctWord.japanese : correctWord.english
  const otherWords = allWords.filter((w) => w.id !== correctWord.id)
  const shuffled = shuffle([...otherWords])
  const distractorCount = Math.min(3, shuffled.length)
  const distractors = shuffled.slice(0, distractorCount).map((w) =>
    type === "en-to-ja" ? w.japanese : w.english,
  )

  const options = shuffle([correctAnswer, ...distractors])
  return options
}

function createQuestion(
  word: Word,
  allWords: ReadonlyArray<Word>,
  type: QuizType,
): QuizQuestion {
  const correctAnswer = type === "en-to-ja" ? word.japanese : word.english
  const options = type === "typing" ? [correctAnswer] : generateOptions(word, allWords, type)

  return { word, type, options, correctAnswer }
}

function sortByWeakness(words: Word[], progress: ProgressStore): Word[] {
  return [...words].sort((a, b) => {
    const scoreA = getWeaknessScore(a.id, progress)
    const scoreB = getWeaknessScore(b.id, progress)
    // Higher weakness score = more priority (earlier in array)
    // Add small random factor to avoid deterministic order for same scores
    return scoreB - scoreA + (Math.random() - 0.5) * 0.1
  })
}

function getWeaknessScore(wordId: string, progress: ProgressStore): number {
  const wp = progress.progress[wordId]
  if (!wp) return 0.5 // unlearned words get medium priority

  const flashcardIncorrect = wp.flashcardResults.filter((r) => !r.remembered).length
  const quizIncorrect = wp.quizResults.filter((r) => !r.correct).length
  const totalAttempts =
    wp.flashcardResults.length + wp.quizResults.length

  if (totalAttempts === 0) return 0.5

  const incorrectRate = (flashcardIncorrect + quizIncorrect) / totalAttempts

  // Mastered words get lowest priority
  if (wp.status === "mastered") return incorrectRate * 0.1

  return incorrectRate + 0.5
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}
