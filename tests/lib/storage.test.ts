import { describe, it, expect, beforeEach } from "vitest"
import { loadProgress, saveProgress, updateWordProgress, resetProgress } from "@/lib/storage"
import type { ProgressStore } from "@/types"

const STORAGE_KEY = "prog-vocab-progress"

beforeEach(() => {
  localStorage.clear()
})

describe("loadProgress", () => {
  it("returns initial ProgressStore when localStorage is empty", () => {
    const result = loadProgress()
    expect(result).toEqual({ version: 1, progress: {} })
  })

  it("parses and returns saved data when valid JSON exists", () => {
    const saved: ProgressStore = {
      version: 1,
      progress: {
        refactor: {
          wordId: "refactor",
          status: "learning",
          flashcardResults: [{ remembered: true, timestamp: "2025-01-01T00:00:00Z" }],
          quizResults: [],
          lastStudiedAt: "2025-01-01T00:00:00Z",
        },
      },
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))

    const result = loadProgress()
    expect(result).toEqual(saved)
  })

  it("falls back to initial value when invalid JSON is stored", () => {
    localStorage.setItem(STORAGE_KEY, "not-valid-json{{{")

    const result = loadProgress()
    expect(result).toEqual({ version: 1, progress: {} })
  })

  it("migrates when version is outdated", () => {
    const oldData = { version: 0, progress: { foo: { wordId: "foo" } } }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldData))

    const result = loadProgress()
    expect(result.version).toBe(1)
  })
})

describe("saveProgress", () => {
  it("saves ProgressStore to localStorage as JSON", () => {
    const store: ProgressStore = {
      version: 1,
      progress: {
        variable: {
          wordId: "variable",
          status: "mastered",
          flashcardResults: [],
          quizResults: [],
          lastStudiedAt: null,
        },
      },
    }

    saveProgress(store)

    const raw = localStorage.getItem(STORAGE_KEY)
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw!)).toEqual(store)
  })
})

describe("updateWordProgress", () => {
  it("adds progress for a new word", () => {
    const result = updateWordProgress("variable", { status: "learning" })

    expect(result.progress["variable"]).toBeDefined()
    expect(result.progress["variable"].status).toBe("learning")
    expect(result.progress["variable"].wordId).toBe("variable")
  })

  it("updates existing word progress", () => {
    const initial: ProgressStore = {
      version: 1,
      progress: {
        variable: {
          wordId: "variable",
          status: "learning",
          flashcardResults: [{ remembered: false, timestamp: "2025-01-01T00:00:00Z" }],
          quizResults: [],
          lastStudiedAt: "2025-01-01T00:00:00Z",
        },
      },
    }
    saveProgress(initial)

    const result = updateWordProgress("variable", { status: "mastered" })
    expect(result.progress["variable"].status).toBe("mastered")
  })

  it("preserves other fields when partially updating", () => {
    const initial: ProgressStore = {
      version: 1,
      progress: {
        variable: {
          wordId: "variable",
          status: "learning",
          flashcardResults: [{ remembered: true, timestamp: "2025-01-01T00:00:00Z" }],
          quizResults: [],
          lastStudiedAt: "2025-01-01T00:00:00Z",
        },
      },
    }
    saveProgress(initial)

    const result = updateWordProgress("variable", { status: "mastered" })
    expect(result.progress["variable"].flashcardResults).toHaveLength(1)
    expect(result.progress["variable"].lastStudiedAt).toBe("2025-01-01T00:00:00Z")
  })
})

describe("resetProgress", () => {
  it("resets all progress to initial state", () => {
    const store: ProgressStore = {
      version: 1,
      progress: {
        variable: {
          wordId: "variable",
          status: "mastered",
          flashcardResults: [],
          quizResults: [],
          lastStudiedAt: null,
        },
      },
    }
    saveProgress(store)

    resetProgress()

    const result = loadProgress()
    expect(result).toEqual({ version: 1, progress: {} })
  })
})
