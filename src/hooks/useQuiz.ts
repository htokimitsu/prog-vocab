import { useCallback, useMemo, useState } from "react"
import { generateQuiz } from "@/lib/quizGenerator"
import type { ProgressStore, QuizConfig, QuizQuestion, Word } from "@/types"

type QuizPhase = "setup" | "playing" | "result"

interface QuizState {
  phase: QuizPhase
  questions: QuizQuestion[]
  currentIndex: number
  answers: Array<{ questionIndex: number; selectedAnswer: string; correct: boolean }>
}

export function useQuiz(words: ReadonlyArray<Word>, progress: ProgressStore) {
  const [state, setState] = useState<QuizState>({
    phase: "setup",
    questions: [],
    currentIndex: 0,
    answers: [],
  })

  const currentQuestion = state.questions[state.currentIndex] ?? null

  const score = useMemo(
    () => state.answers.filter((a) => a.correct).length,
    [state.answers],
  )

  const wrongWords = useMemo(
    () =>
      state.answers
        .filter((a) => !a.correct)
        .map((a) => state.questions[a.questionIndex].word),
    [state.answers, state.questions],
  )

  const startQuiz = useCallback(
    (config: QuizConfig) => {
      const questions = generateQuiz(words, progress, config)
      setState({
        phase: "playing",
        questions,
        currentIndex: 0,
        answers: [],
      })
    },
    [words, progress],
  )

  const answerQuestion = useCallback(
    (selectedAnswer: string) => {
      setState((prev) => {
        const question = prev.questions[prev.currentIndex]
        if (!question) return prev

        const correct = selectedAnswer === question.correctAnswer
        const newAnswers = [
          ...prev.answers,
          { questionIndex: prev.currentIndex, selectedAnswer, correct },
        ]

        const nextIndex = prev.currentIndex + 1
        const isFinished = nextIndex >= prev.questions.length

        return {
          ...prev,
          answers: newAnswers,
          currentIndex: isFinished ? prev.currentIndex : nextIndex,
          phase: isFinished ? "result" : "playing",
        }
      })
    },
    [],
  )

  const resetQuiz = useCallback(() => {
    setState({
      phase: "setup",
      questions: [],
      currentIndex: 0,
      answers: [],
    })
  }, [])

  return {
    phase: state.phase,
    currentQuestion,
    currentIndex: state.currentIndex,
    totalQuestions: state.questions.length,
    score,
    wrongWords,
    answers: state.answers,
    startQuiz,
    answerQuestion,
    resetQuiz,
  }
}
