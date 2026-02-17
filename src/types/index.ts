// === Word Data ===

export const CATEGORIES = [
  "syntax",
  "data-structures",
  "git",
  "api",
  "database",
  "error-handling",
  "design-patterns",
  "testing",
  "devops",
  "collaboration",
] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_LABELS: Record<Category, string> = {
  syntax: "基本構文",
  "data-structures": "データ構造・アルゴリズム",
  git: "Git / バージョン管理",
  api: "API / HTTP",
  database: "データベース",
  "error-handling": "エラーハンドリング / デバッグ",
  "design-patterns": "設計パターン / アーキテクチャ",
  testing: "テスト",
  devops: "DevOps / インフラ",
  collaboration: "コードレビュー / コラボレーション",
}

export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const

export type Difficulty = (typeof DIFFICULTIES)[number]

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
}

export interface Word {
  id: string
  english: string
  japanese: string
  example: string
  category: Category
  difficulty: Difficulty
}

// === Progress ===

export const LEARNING_STATUSES = ["unlearned", "learning", "mastered"] as const

export type LearningStatus = (typeof LEARNING_STATUSES)[number]

export const LEARNING_STATUS_LABELS: Record<LearningStatus, string> = {
  unlearned: "未学習",
  learning: "学習中",
  mastered: "習得済み",
}

export interface FlashcardResult {
  remembered: boolean
  timestamp: string
}

export const QUIZ_TYPES = ["en-to-ja", "ja-to-en", "typing"] as const

export type QuizType = (typeof QUIZ_TYPES)[number]

export const QUIZ_TYPE_LABELS: Record<QuizType, string> = {
  "en-to-ja": "英語→日本語 (4択)",
  "ja-to-en": "日本語→英語 (4択)",
  typing: "タイピング",
}

export interface QuizResultEntry {
  correct: boolean
  quizType: QuizType
  timestamp: string
}

export interface WordProgress {
  wordId: string
  status: LearningStatus
  flashcardResults: FlashcardResult[]
  quizResults: QuizResultEntry[]
  lastStudiedAt: string | null
}

export interface ProgressStore {
  version: number
  progress: Record<string, WordProgress>
}

// === Filter ===

export interface FilterOptions {
  categories: Category[]
  difficulties: Difficulty[]
  statuses: LearningStatus[]
  searchQuery: string
}

// === Quiz ===

export interface QuizConfig {
  type: QuizType
  count: number
  categories: Category[]
  difficulties: Difficulty[]
  prioritizeWeak: boolean
}

export interface QuizQuestion {
  word: Word
  type: QuizType
  options: string[]
  correctAnswer: string
}

// === Stats ===

export interface OverallStats {
  totalWords: number
  masteredCount: number
  learningCount: number
  unlearnedCount: number
  masteryRate: number
}

export interface CategoryStats {
  category: Category
  totalWords: number
  masteredCount: number
  masteryRate: number
}

export interface DifficultyStats {
  difficulty: Difficulty
  totalWords: number
  masteredCount: number
  masteryRate: number
}
