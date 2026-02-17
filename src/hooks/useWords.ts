import { useMemo, useState } from "react"
import { filterWords } from "@/lib/wordFilter"
import type { Category, Difficulty, FilterOptions, Word } from "@/types"
import wordsData from "@/data/words.json"

export function useWords() {
  const [categories, setCategories] = useState<Category[]>([])
  const [difficulties, setDifficulties] = useState<Difficulty[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const allWords = wordsData as Word[]

  const filterOptions: FilterOptions = useMemo(
    () => ({
      categories,
      difficulties,
      statuses: [],
      searchQuery,
    }),
    [categories, difficulties, searchQuery],
  )

  const filteredWords = useMemo(
    () => filterWords(allWords, filterOptions),
    [allWords, filterOptions],
  )

  return {
    allWords,
    filteredWords,
    categories,
    setCategories,
    difficulties,
    setDifficulties,
    searchQuery,
    setSearchQuery,
  }
}
