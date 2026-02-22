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
    const result = filterWords(testWords, { ...defaultOptions, categories: ["basics"] })
    expect(result.every((w) => w.category === "basics")).toBe(true)
    expect(result).toHaveLength(2)
  })

  it("filters by single difficulty", () => {
    const result = filterWords(testWords, { ...defaultOptions, difficulties: ["beginner"] })
    expect(result.every((w) => w.difficulty === "beginner")).toBe(true)
    expect(result).toHaveLength(7)
  })

  it("filters by category AND difficulty combined", () => {
    const result = filterWords(testWords, {
      ...defaultOptions,
      categories: ["basics"],
      difficulties: ["beginner"],
    })
    expect(result.every((w) => w.category === "basics" && w.difficulty === "beginner")).toBe(true)
    expect(result).toHaveLength(2)
  })

  it("filters by multiple categories (OR logic)", () => {
    const result = filterWords(testWords, {
      ...defaultOptions,
      categories: ["basics", "gas"],
    })
    expect(result.every((w) => w.category === "basics" || w.category === "gas")).toBe(true)
    expect(result).toHaveLength(3)
  })

  it("returns empty array when no words match filter", () => {
    const result = filterWords(testWords, {
      ...defaultOptions,
      categories: ["python"],
      difficulties: ["beginner"],
    })
    expect(result).toHaveLength(0)
  })
})

describe("searchWords", () => {
  it("searches by english word (partial match)", () => {
    const result = searchWords(testWords, "prom")
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("promise")
  })

  it("searches by japanese meaning", () => {
    const result = searchWords(testWords, "変数")
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("variable")
  })

  it("searches case-insensitively", () => {
    const result = searchWords(testWords, "PROMISE")
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("promise")
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
