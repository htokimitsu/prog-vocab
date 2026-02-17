import type { ProgressStore, WordProgress } from "@/types"

const STORAGE_KEY = "prog-vocab-progress"
const CURRENT_VERSION = 1

function createInitialStore(): ProgressStore {
  return { version: CURRENT_VERSION, progress: {} }
}

function createDefaultWordProgress(wordId: string): WordProgress {
  return {
    wordId,
    status: "unlearned",
    flashcardResults: [],
    quizResults: [],
    lastStudiedAt: null,
  }
}

function migrate(store: ProgressStore): ProgressStore {
  if (store.version < CURRENT_VERSION) {
    return { ...store, version: CURRENT_VERSION }
  }
  return store
}

export function loadProgress(): ProgressStore {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return createInitialStore()
  }

  try {
    const parsed = JSON.parse(raw) as ProgressStore
    return migrate(parsed)
  } catch {
    return createInitialStore()
  }
}

export function saveProgress(store: ProgressStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function updateWordProgress(
  wordId: string,
  update: Partial<WordProgress>,
): ProgressStore {
  const store = loadProgress()
  const existing = store.progress[wordId] ?? createDefaultWordProgress(wordId)
  const updated: ProgressStore = {
    ...store,
    progress: {
      ...store.progress,
      [wordId]: { ...existing, ...update, wordId },
    },
  }
  saveProgress(updated)
  return updated
}

export function resetProgress(): void {
  saveProgress(createInitialStore())
}
