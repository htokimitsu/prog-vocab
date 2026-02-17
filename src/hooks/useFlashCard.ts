import { useCallback, useState } from "react"
import type { Word } from "@/types"

interface FlashCardState {
  currentIndex: number
  isFlipped: boolean
  isComplete: boolean
}

export function useFlashCard(words: ReadonlyArray<Word>) {
  const [state, setState] = useState<FlashCardState>({
    currentIndex: 0,
    isFlipped: false,
    isComplete: false,
  })

  const currentWord = words[state.currentIndex] ?? null

  const flipCard = useCallback(() => {
    setState((prev) => ({ ...prev, isFlipped: !prev.isFlipped }))
  }, [])

  const goToNext = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentIndex + 1
      if (nextIndex >= words.length) {
        return { ...prev, isComplete: true, isFlipped: false }
      }
      return { currentIndex: nextIndex, isFlipped: false, isComplete: false }
    })
  }, [words.length])

  const reset = useCallback(() => {
    setState({ currentIndex: 0, isFlipped: false, isComplete: false })
  }, [])

  return {
    currentWord,
    currentIndex: state.currentIndex,
    isFlipped: state.isFlipped,
    isComplete: state.isComplete,
    totalCards: words.length,
    flipCard,
    goToNext,
    reset,
  }
}
