import { useCallback, useSyncExternalStore } from "react"
import { loadProgress, saveProgress, updateWordProgress } from "@/lib/storage"
import { determineStatus } from "@/lib/statsCalculator"
import type { FlashcardResult, ProgressStore, QuizResultEntry, QuizType } from "@/types"

let currentStore: ProgressStore = loadProgress()
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): ProgressStore {
  return currentStore
}

function notify() {
  for (const listener of listeners) {
    listener()
  }
}

function setStore(store: ProgressStore) {
  currentStore = store
  saveProgress(store)
  notify()
}

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot)

  const recordFlashcardResult = useCallback((wordId: string, remembered: boolean) => {
    const store = loadProgress()
    const wp = store.progress[wordId] ?? {
      wordId,
      status: "unlearned" as const,
      flashcardResults: [],
      quizResults: [],
      lastStudiedAt: null,
    }

    const newResult: FlashcardResult = {
      remembered,
      timestamp: new Date().toISOString(),
    }

    const updatedWp = {
      ...wp,
      flashcardResults: [...wp.flashcardResults, newResult],
      lastStudiedAt: new Date().toISOString(),
    }
    const status = determineStatus(updatedWp)

    const updated = updateWordProgress(wordId, {
      ...updatedWp,
      status,
    })
    setStore(updated)
  }, [])

  const recordQuizResult = useCallback(
    (wordId: string, correct: boolean, quizType: QuizType) => {
      const store = loadProgress()
      const wp = store.progress[wordId] ?? {
        wordId,
        status: "unlearned" as const,
        flashcardResults: [],
        quizResults: [],
        lastStudiedAt: null,
      }

      const newResult: QuizResultEntry = {
        correct,
        quizType,
        timestamp: new Date().toISOString(),
      }

      const updatedWp = {
        ...wp,
        quizResults: [...wp.quizResults, newResult],
        lastStudiedAt: new Date().toISOString(),
      }
      const status = determineStatus(updatedWp)

      const updated = updateWordProgress(wordId, {
        ...updatedWp,
        status,
      })
      setStore(updated)
    },
    [],
  )

  const resetAllProgress = useCallback(() => {
    const initial: ProgressStore = { version: 1, progress: {} }
    saveProgress(initial)
    setStore(initial)
  }, [])

  return {
    progress,
    recordFlashcardResult,
    recordQuizResult,
    resetAllProgress,
  }
}
