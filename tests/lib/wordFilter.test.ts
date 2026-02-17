import { describe, it, expect } from "vitest"
import { filterWords, searchWords } from "@/lib/wordFilter"
import { testWords } from "../fixtures/words"
import type { FilterOptions } from "@/types"

describe("filterWords", () => {
  const defaultOptions: FilterOptions = {
    categories: [],
    difficulties: [],
    statuses: [],
    searchQuery: "",
  }

  it("returns all words when no filters are applied", () => {
    const result = filterWords(testWords, defaultOptions)
    expect(result).toHaveLength(testWords.length)
  })

  it("filters by single category", () => {
    const result = filterWords(testWords, { ...defaultOptions, categories: ["syntax"] })
    expect(result.every((w) => w.category === "syntax")).toBe(true)
    expect(result).toHaveLength(3)
  })

  it("filters by single difficulty", () => {
    const result = filterWords(testWords, { ...defaultOptions, difficulties: ["beginner"] })
    expect(result.every((w) => w.difficulty === "beginner")).toBe(true)
    expect(result).toHaveLength(5)
  })

  it("filters by category AND difficulty combined", () => {
    const result = filterWords(testWords, {
      ...defaultOptions,
      categories: ["syntax"],
      difficulties: ["beginner"],
    })
    expect(result.every((w) => w.category === "syntax" && w.difficulty === "beginner")).toBe(true)
    expect(result).toHaveLength(3)
  })

  it("filters by multiple categories (OR logic)", () => {
    const result = filterWords(testWords, {
      ...defaultOptions,
      categories: ["syntax", "git"],
    })
    expect(result.every((w) => w.category === "syntax" || w.category === "git")).toBe(true)
    expect(result).toHaveLength(4)
  })

  it("returns empty array when no words match filter", () => {
    const result = filterWords(testWords, {
      ...defaultOptions,
      categories: ["devops"],
      difficulties: ["beginner"],
    })
    expect(result).toHaveLength(0)
  })
})

describe("searchWords", () => {
  it("searches by english word (partial match)", () => {
    const result = searchWords(testWords, "refact")
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("refactor")
  })

  it("searches by japanese meaning", () => {
    const result = searchWords(testWords, "変数")
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("variable")
  })

  it("searches case-insensitively", () => {
    const result = searchWords(testWords, "REFACTOR")
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("refactor")
  })

  it("returns all words for empty query", () => {
    const result = searchWords(testWords, "")
    expect(result).toHaveLength(testWords.length)
  })

  it("returns empty array when no match found", () => {
    const result = searchWords(testWords, "zzzzz")
    expect(result).toHaveLength(0)
  })
})
