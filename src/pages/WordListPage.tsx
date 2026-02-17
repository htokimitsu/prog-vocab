import { useCallback } from "react"
import { FilterBar } from "@/components/ui/FilterBar"
import { SearchInput } from "@/components/ui/SearchInput"
import { WordList } from "@/components/word/WordList"
import { useProgress } from "@/hooks/useProgress"
import { useWords } from "@/hooks/useWords"
import type { LearningStatus } from "@/types"

export function WordListPage() {
  const { filteredWords, categories, setCategories, difficulties, setDifficulties, setSearchQuery } =
    useWords()
  const { progress } = useProgress()

  const progressMap: Record<string, LearningStatus> = {}
  for (const [wordId, wp] of Object.entries(progress.progress)) {
    progressMap[wordId] = wp.status
  }

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
    },
    [setSearchQuery],
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Word List</h1>

      <SearchInput onSearch={handleSearch} placeholder="英単語・日本語で検索..." />

      <FilterBar
        selectedCategories={categories}
        selectedDifficulties={difficulties}
        onCategoriesChange={setCategories}
        onDifficultiesChange={setDifficulties}
      />

      <p className="text-sm text-gray-500">{filteredWords.length} 件</p>

      <WordList words={filteredWords} progressMap={progressMap} />
    </div>
  )
}
