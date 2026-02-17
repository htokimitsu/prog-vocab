import type { ProgressStore, WordProgress } from "@/types"

export function createEmptyProgress(): ProgressStore {
  return {
    version: 1,
    progress: {},
  }
}

export function createWordProgress(
  wordId: string,
  overrides: Partial<WordProgress> = {},
): WordProgress {
  return {
    wordId,
    status: "unlearned",
    flashcardResults: [],
    quizResults: [],
    lastStudiedAt: null,
    ...overrides,
  }
}

export function createProgressWithWords(
  entries: Array<{ wordId: string; overrides?: Partial<WordProgress> }>,
): ProgressStore {
  const progress: Record<string, WordProgress> = {}
  for (const entry of entries) {
    progress[entry.wordId] = createWordProgress(entry.wordId, entry.overrides)
  }
  return { version: 1, progress }
}
