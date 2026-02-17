import { describe, it, expect } from "vitest"
import {
  calculateOverallStats,
  calculateCategoryStats,
  calculateDifficultyStats,
  determineStatus,
} from "@/lib/statsCalculator"
import { testWords } from "../fixtures/words"
import { createEmptyProgress, createProgressWithWords, createWordProgress } from "../fixtures/progress"

describe("calculateOverallStats", () => {
  it("returns all zeros for empty progress", () => {
    const result = calculateOverallStats(testWords, createEmptyProgress())
    expect(result.totalWords).toBe(testWords.length)
    expect(result.masteredCount).toBe(0)
    expect(result.learningCount).toBe(0)
    expect(result.unlearnedCount).toBe(testWords.length)
    expect(result.masteryRate).toBe(0)
  })

  it("calculates correctly with some mastered words", () => {
    const progress = createProgressWithWords([
      { wordId: "variable", overrides: { status: "mastered" } },
      { wordId: "function", overrides: { status: "mastered" } },
      { wordId: "loop", overrides: { status: "mastered" } },
    ])
    const result = calculateOverallStats(testWords, progress)
    expect(result.masteredCount).toBe(3)
    expect(result.masteryRate).toBe(30) // 3/10 = 30%
  })

  it("calculates correctly when all words are mastered", () => {
    const entries = testWords.map((w) => ({
      wordId: w.id,
      overrides: { status: "mastered" as const },
    }))
    const progress = createProgressWithWords(entries)
    const result = calculateOverallStats(testWords, progress)
    expect(result.masteryRate).toBe(100)
  })

  it("counts all statuses correctly and they sum to totalWords", () => {
    const progress = createProgressWithWords([
      { wordId: "variable", overrides: { status: "mastered" } },
      { wordId: "function", overrides: { status: "learning" } },
      { wordId: "loop", overrides: { status: "learning" } },
    ])
    const result = calculateOverallStats(testWords, progress)
    expect(result.masteredCount + result.learningCount + result.unlearnedCount).toBe(
      result.totalWords,
    )
  })
})

describe("calculateCategoryStats", () => {
  it("calculates stats per category", () => {
    const progress = createProgressWithWords([
      { wordId: "variable", overrides: { status: "mastered" } },
      { wordId: "function", overrides: { status: "mastered" } },
      { wordId: "loop", overrides: { status: "learning" } },
    ])
    const result = calculateCategoryStats(testWords, progress)
    const syntaxStats = result.find((s) => s.category === "syntax")
    expect(syntaxStats).toBeDefined()
    expect(syntaxStats!.totalWords).toBe(3)
    expect(syntaxStats!.masteredCount).toBe(2)
  })

  it("returns 0% mastery for unstudied categories", () => {
    const progress = createProgressWithWords([
      { wordId: "variable", overrides: { status: "mastered" } },
    ])
    const result = calculateCategoryStats(testWords, progress)
    const gitStats = result.find((s) => s.category === "git")
    expect(gitStats).toBeDefined()
    expect(gitStats!.masteryRate).toBe(0)
  })
})

describe("calculateDifficultyStats", () => {
  it("calculates stats per difficulty", () => {
    const progress = createProgressWithWords([
      { wordId: "variable", overrides: { status: "mastered" } },
      { wordId: "function", overrides: { status: "mastered" } },
      { wordId: "commit", overrides: { status: "mastered" } },
      { wordId: "endpoint", overrides: { status: "mastered" } },
      { wordId: "loop", overrides: { status: "mastered" } },
    ])
    const result = calculateDifficultyStats(testWords, progress)
    const beginnerStats = result.find((s) => s.difficulty === "beginner")
    expect(beginnerStats).toBeDefined()
    expect(beginnerStats!.masteredCount).toBe(5)
    expect(beginnerStats!.masteryRate).toBe(100)
  })
})

describe("determineStatus", () => {
  it("returns 'unlearned' when no history", () => {
    const wp = createWordProgress("test")
    expect(determineStatus(wp)).toBe("unlearned")
  })

  it("returns 'learning' when 3 out of 5 recent results are correct", () => {
    const wp = createWordProgress("test", {
      flashcardResults: [
        { remembered: true, timestamp: "2025-01-01T00:00:00Z" },
        { remembered: true, timestamp: "2025-01-02T00:00:00Z" },
        { remembered: true, timestamp: "2025-01-03T00:00:00Z" },
        { remembered: false, timestamp: "2025-01-04T00:00:00Z" },
        { remembered: false, timestamp: "2025-01-05T00:00:00Z" },
      ],
    })
    expect(determineStatus(wp)).toBe("learning")
  })

  it("returns 'mastered' when 4 out of 5 recent results are correct", () => {
    const wp = createWordProgress("test", {
      flashcardResults: [
        { remembered: true, timestamp: "2025-01-01T00:00:00Z" },
        { remembered: true, timestamp: "2025-01-02T00:00:00Z" },
        { remembered: true, timestamp: "2025-01-03T00:00:00Z" },
        { remembered: true, timestamp: "2025-01-04T00:00:00Z" },
        { remembered: false, timestamp: "2025-01-05T00:00:00Z" },
      ],
    })
    expect(determineStatus(wp)).toBe("mastered")
  })

  it("returns 'mastered' when all 5 recent results are correct", () => {
    const wp = createWordProgress("test", {
      quizResults: [
        { correct: true, quizType: "en-to-ja", timestamp: "2025-01-01T00:00:00Z" },
        { correct: true, quizType: "en-to-ja", timestamp: "2025-01-02T00:00:00Z" },
        { correct: true, quizType: "en-to-ja", timestamp: "2025-01-03T00:00:00Z" },
        { correct: true, quizType: "en-to-ja", timestamp: "2025-01-04T00:00:00Z" },
        { correct: true, quizType: "en-to-ja", timestamp: "2025-01-05T00:00:00Z" },
      ],
    })
    expect(determineStatus(wp)).toBe("mastered")
  })

  it("returns 'learning' when fewer than 5 results even if all correct", () => {
    const wp = createWordProgress("test", {
      flashcardResults: [
        { remembered: true, timestamp: "2025-01-01T00:00:00Z" },
        { remembered: true, timestamp: "2025-01-02T00:00:00Z" },
      ],
    })
    expect(determineStatus(wp)).toBe("learning")
  })

  it("combines flashcard and quiz results for determination", () => {
    const wp = createWordProgress("test", {
      flashcardResults: [
        { remembered: true, timestamp: "2025-01-01T00:00:00Z" },
        { remembered: true, timestamp: "2025-01-02T00:00:00Z" },
      ],
      quizResults: [
        { correct: true, quizType: "en-to-ja", timestamp: "2025-01-03T00:00:00Z" },
        { correct: true, quizType: "typing", timestamp: "2025-01-04T00:00:00Z" },
        { correct: true, quizType: "ja-to-en", timestamp: "2025-01-05T00:00:00Z" },
      ],
    })
    expect(determineStatus(wp)).toBe("mastered")
  })
})
