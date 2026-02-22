import { describe, it, expect } from "vitest"
import { generateQuiz, generateOptions } from "@/lib/quizGenerator"
import { testWords } from "../fixtures/words"
import { createEmptyProgress, createProgressWithWords } from "../fixtures/progress"
import type { QuizConfig } from "@/types"

describe("generateQuiz", () => {
  const baseConfig: QuizConfig = {
    type: "en-to-ja",
    count: 10,
    categories: [],
    difficulties: [],
    prioritizeWeak: false,
  }

  it("generates the specified number of questions", () => {
    const result = generateQuiz(testWords, createEmptyProgress(), {
      ...baseConfig,
      count: 5,
    })
    expect(result).toHaveLength(5)
  })

  it("caps at total word count when count exceeds available words", () => {
    const result = generateQuiz(testWords, createEmptyProgress(), {
      ...baseConfig,
      count: 100,
    })
    expect(result).toHaveLength(testWords.length)
  })

  it("filters by category", () => {
    const result = generateQuiz(testWords, createEmptyProgress(), {
      ...baseConfig,
      categories: ["gas"],
      count: 100,
    })
    expect(result.every((q) => q.word.category === "gas")).toBe(true)
  })

  it("prioritizes weak words when prioritizeWeak is true", () => {
    const progress = createProgressWithWords([
      {
        wordId: "variable",
        overrides: {
          status: "learning",
          quizResults: [
            { correct: false, quizType: "en-to-ja", timestamp: "2025-01-01T00:00:00Z" },
            { correct: false, quizType: "en-to-ja", timestamp: "2025-01-02T00:00:00Z" },
          ],
        },
      },
      {
        wordId: "decorator",
        overrides: {
          status: "mastered",
          quizResults: [
            { correct: true, quizType: "en-to-ja", timestamp: "2025-01-01T00:00:00Z" },
            { correct: true, quizType: "en-to-ja", timestamp: "2025-01-02T00:00:00Z" },
          ],
        },
      },
    ])

    const results = Array.from({ length: 20 }, () =>
      generateQuiz(testWords, progress, {
        ...baseConfig,
        count: 3,
        prioritizeWeak: true,
      }),
    )

    // "variable" should appear as first question more often than "decorator"
    const variableFirstCount = results.filter((r) => r[0].word.id === "variable").length
    const decoratorFirstCount = results.filter((r) => r[0].word.id === "decorator").length
    expect(variableFirstCount).toBeGreaterThan(decoratorFirstCount)
  })

  it("sets correctAnswer to japanese for en-to-ja type", () => {
    const result = generateQuiz(testWords, createEmptyProgress(), {
      ...baseConfig,
      type: "en-to-ja",
      count: 1,
    })
    const question = result[0]
    expect(question.correctAnswer).toBe(question.word.japanese)
  })

  it("sets correctAnswer to english for ja-to-en type", () => {
    const result = generateQuiz(testWords, createEmptyProgress(), {
      ...baseConfig,
      type: "ja-to-en",
      count: 1,
    })
    const question = result[0]
    expect(question.correctAnswer).toBe(question.word.english)
  })
})

describe("generateOptions", () => {
  it("generates 4 options", () => {
    const options = generateOptions(testWords[0], testWords, "en-to-ja")
    expect(options).toHaveLength(4)
  })

  it("includes the correct answer in options", () => {
    const word = testWords[0]
    const options = generateOptions(word, testWords, "en-to-ja")
    expect(options).toContain(word.japanese)
  })

  it("has no duplicate options", () => {
    const word = testWords[0]
    const options = generateOptions(word, testWords, "en-to-ja")
    const unique = new Set(options)
    expect(unique.size).toBe(options.length)
  })

  it("returns fewer options when not enough words available", () => {
    const twoWords = testWords.slice(0, 2)
    const options = generateOptions(twoWords[0], twoWords, "en-to-ja")
    expect(options).toHaveLength(2)
  })
})
