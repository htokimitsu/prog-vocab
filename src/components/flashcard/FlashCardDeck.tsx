import type { Word } from "@/types"
import { useFlashCard } from "@/hooks/useFlashCard"
import { FlashCard } from "./FlashCard"

interface FlashCardDeckProps {
  words: ReadonlyArray<Word>
  onRemembered: (wordId: string) => void
  onForgotten: (wordId: string) => void
}

export function FlashCardDeck({ words, onRemembered, onForgotten }: FlashCardDeckProps) {
  const { currentWord, currentIndex, isFlipped, isComplete, totalCards, flipCard, goToNext, reset } =
    useFlashCard(words)

  if (totalCards === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        該当する単語がありません。フィルタを変更してください。
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="py-12 text-center">
        <p className="text-2xl font-bold text-gray-900">完了!</p>
        <p className="mt-2 text-gray-600">{totalCards}枚のカードを学習しました</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          もう一度
        </button>
      </div>
    )
  }

  if (!currentWord) return null

  const handleRemembered = () => {
    onRemembered(currentWord.id)
    goToNext()
  }

  const handleForgotten = () => {
    onForgotten(currentWord.id)
    goToNext()
  }

  return (
    <div className="space-y-6">
      <FlashCard word={currentWord} isFlipped={isFlipped} onFlip={flipCard} />

      <p className="text-center text-sm text-gray-500">
        {currentIndex + 1} / {totalCards}
      </p>

      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={handleForgotten}
          className="rounded-lg bg-red-100 px-6 py-3 font-medium text-red-700 hover:bg-red-200"
        >
          まだ
        </button>
        <button
          type="button"
          onClick={handleRemembered}
          className="rounded-lg bg-green-100 px-6 py-3 font-medium text-green-700 hover:bg-green-200"
        >
          覚えた
        </button>
      </div>
    </div>
  )
}
