import type { FilterOptions, Word } from "@/types"

export function filterWords(words: ReadonlyArray<Word>, options: FilterOptions): Word[] {
  return words.filter((word) => {
    const matchesCategory =
      options.categories.length === 0 || options.categories.includes(word.category)
    const matchesDifficulty =
      options.difficulties.length === 0 || options.difficulties.includes(word.difficulty)
    const matchesSearch =
      options.searchQuery === "" || matchesSearchQuery(word, options.searchQuery)

    return matchesCategory && matchesDifficulty && matchesSearch
  })
}

export function searchWords(words: ReadonlyArray<Word>, query: string): Word[] {
  if (query === "") {
    return [...words]
  }
  return words.filter((word) => matchesSearchQuery(word, query))
}

function matchesSearchQuery(word: Word, query: string): boolean {
  const lowerQuery = query.toLowerCase()
  return (
    word.english.toLowerCase().includes(lowerQuery) ||
    word.japanese.toLowerCase().includes(lowerQuery)
  )
}
