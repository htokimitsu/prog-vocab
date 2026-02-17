import { FilterBar } from "@/components/ui/FilterBar"
import { FlashCardDeck } from "@/components/flashcard/FlashCardDeck"
import { useProgress } from "@/hooks/useProgress"
import { useWords } from "@/hooks/useWords"

export function FlashCardPage() {
  const { filteredWords, categories, setCategories, difficulties, setDifficulties } = useWords()
  const { recordFlashcardResult } = useProgress()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Flash Card</h1>

      <FilterBar
        selectedCategories={categories}
        selectedDifficulties={difficulties}
        onCategoriesChange={setCategories}
        onDifficultiesChange={setDifficulties}
      />

      <FlashCardDeck
        words={filteredWords}
        onRemembered={(wordId) => recordFlashcardResult(wordId, true)}
        onForgotten={(wordId) => recordFlashcardResult(wordId, false)}
      />
    </div>
  )
}
