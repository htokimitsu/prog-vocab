# Design: プログラミング英単語学習アプリ

## 技術スタック

| 項目 | 選定 | 理由 |
|------|------|------|
| ビルドツール | Vite | 高速HMR、設定最小限 |
| UI | React 19 + TypeScript | 型安全、コンポーネント指向 |
| ルーティング | React Router v7 | SPA内ページ遷移 |
| スタイリング | Tailwind CSS v4 | ユーティリティファーストで高速開発 |
| テスト | Vitest + Testing Library | Viteと統合、高速 |
| リンター | ESLint + Prettier | コード品質担保 |

## プロジェクト構成

```
prog-vocab/
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx              # ルートコンポーネント（Router設定）
│   │   └── routes.tsx           # ルート定義
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx       # ヘッダー（ナビゲーション）
│   │   │   └── Layout.tsx       # 共通レイアウト
│   │   ├── flashcard/
│   │   │   ├── FlashCard.tsx    # カード1枚のコンポーネント
│   │   │   └── FlashCardDeck.tsx # カードデッキ（複数カード管理）
│   │   ├── quiz/
│   │   │   ├── MultipleChoice.tsx  # 4択問題
│   │   │   ├── TypingQuiz.tsx      # タイピング問題
│   │   │   ├── QuizSetup.tsx       # クイズ設定画面
│   │   │   └── QuizResult.tsx      # クイズ結果画面
│   │   ├── dashboard/
│   │   │   ├── ProgressChart.tsx    # 進捗チャート
│   │   │   └── StatsCard.tsx        # 統計カード
│   │   ├── word/
│   │   │   ├── WordList.tsx         # 単語一覧
│   │   │   └── WordDetail.tsx       # 単語詳細
│   │   └── ui/
│   │       ├── FilterBar.tsx        # カテゴリ・難易度フィルタ
│   │       ├── SearchInput.tsx      # 検索入力
│   │       └── ProgressBar.tsx      # プログレスバー
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── FlashCardPage.tsx
│   │   ├── QuizPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── WordListPage.tsx
│   ├── hooks/
│   │   ├── useWords.ts           # 単語データの読み込み・フィルタ
│   │   ├── useProgress.ts        # 学習進捗の読み書き
│   │   ├── useQuiz.ts            # クイズのステート管理
│   │   └── useFlashCard.ts       # フラッシュカードのステート管理
│   ├── lib/
│   │   ├── storage.ts            # localStorage操作
│   │   ├── wordFilter.ts         # フィルタ・検索ロジック
│   │   ├── quizGenerator.ts      # クイズ問題生成ロジック
│   │   └── statsCalculator.ts    # 統計計算ロジック
│   ├── types/
│   │   └── index.ts              # 型定義
│   ├── data/
│   │   └── words.json            # 単語データ
│   ├── main.tsx
│   └── index.css                 # Tailwind設定
├── tests/
│   ├── lib/                      # libのユニットテスト
│   ├── hooks/                    # hookのテスト
│   └── components/               # コンポーネントテスト
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── eslint.config.js
```

## データモデル

### Word（単語）

```typescript
interface Word {
  id: string                    // ユニークID（例: "refactor"）
  english: string               // 英単語
  japanese: string              // 日本語の意味
  example: string               // 使用例（コードまたは文脈）
  category: Category            // 技術カテゴリ
  difficulty: Difficulty         // 難易度
}

type Category =
  | "syntax"          // 基本構文
  | "data-structures" // データ構造・アルゴリズム
  | "git"             // Git / バージョン管理
  | "api"             // API / HTTP
  | "database"        // データベース
  | "error-handling"  // エラーハンドリング / デバッグ
  | "design-patterns" // 設計パターン / アーキテクチャ
  | "testing"         // テスト
  | "devops"          // DevOps / インフラ
  | "collaboration"   // コードレビュー / コラボレーション

type Difficulty = "beginner" | "intermediate" | "advanced"
```

### WordProgress（学習進捗）

```typescript
interface WordProgress {
  wordId: string
  status: LearningStatus
  flashcardResults: FlashcardResult[]  // 直近N回の結果
  quizResults: QuizResult[]            // 直近N回の結果
  lastStudiedAt: string | null         // ISO日付文字列
}

type LearningStatus = "unlearned" | "learning" | "mastered"

interface FlashcardResult {
  remembered: boolean
  timestamp: string
}

interface QuizResult {
  correct: boolean
  quizType: QuizType
  timestamp: string
}

type QuizType = "en-to-ja" | "ja-to-en" | "typing"
```

### ProgressStore（localStorage構造）

```typescript
interface ProgressStore {
  version: number                         // スキーマバージョン
  progress: Record<string, WordProgress>  // wordIdをキーとした進捗Map
}
```

## 画面設計

### ホーム画面 (`/`)

```
┌──────────────────────────────┐
│  Prog Vocab                  │
├──────────────────────────────┤
│                              │
│   ┌────────┐  ┌────────┐    │
│   │ Flash  │  │  Quiz  │    │
│   │ Card   │  │  Mode  │    │
│   └────────┘  └────────┘    │
│                              │
│   ┌────────┐  ┌────────┐    │
│   │ Word   │  │ Dash   │    │
│   │ List   │  │ board  │    │
│   └────────┘  └────────┘    │
│                              │
│  ── Quick Stats ──           │
│  習得済み: 24/150 (16%)      │
│  今日の学習: 12単語           │
│                              │
└──────────────────────────────┘
```

### フラッシュカード画面 (`/flashcard`)

```
┌──────────────────────────────┐
│  <- Back     Flash Card      │
├──────────────────────────────┤
│  [Category v] [Difficulty v] │
│                              │
│  ┌──────────────────────┐    │
│  │                      │    │
│  │     refactor         │    │
│  │                      │    │
│  │  (タップでめくる)     │    │
│  │                      │    │
│  └──────────────────────┘    │
│                              │
│     3 / 25                   │
│                              │
│  [まだ]        [覚えた]      │
│                              │
└──────────────────────────────┘
```

裏面:
```
┌──────────────────────────────┐
│  ┌──────────────────────┐    │
│  │  refactor             │    │
│  │  ──────────           │    │
│  │  リファクタリングする  │    │
│  │                       │    │
│  │  // Before            │    │
│  │  const x = a + b;    │    │
│  │  // After refactoring │    │
│  │  const sum = add(a,b) │    │
│  └──────────────────────┘    │
```

### クイズ画面 (`/quiz`)

設定画面 → 出題画面 → 結果画面の3ステップ

#### 設定画面
```
┌──────────────────────────────┐
│  <- Back     Quiz Setup      │
├──────────────────────────────┤
│                              │
│  出題形式:                    │
│  ○ 英語→日本語 (4択)         │
│  ○ 日本語→英語 (4択)         │
│  ○ タイピング                 │
│                              │
│  出題数:                      │
│  ○ 10問  ○ 20問  ○ 全問     │
│                              │
│  カテゴリ: [全て v]           │
│  難易度:   [全て v]           │
│                              │
│  [ ] 苦手な単語を優先         │
│                              │
│  [ スタート ]                 │
│                              │
└──────────────────────────────┘
```

#### 出題画面（4択）
```
┌──────────────────────────────┐
│  Q3 / 10                     │
├──────────────────────────────┤
│                              │
│     "deprecate"              │
│                              │
│  ┌────────────────────────┐  │
│  │ A. 非推奨にする         │  │
│  ├────────────────────────┤  │
│  │ B. デバッグする         │  │
│  ├────────────────────────┤  │
│  │ C. リファクタリング     │  │
│  ├────────────────────────┤  │
│  │ D. デプロイする         │  │
│  └────────────────────────┘  │
│                              │
│  正解数: 2/3                  │
│                              │
└──────────────────────────────┘
```

### ダッシュボード画面 (`/dashboard`)

```
┌──────────────────────────────┐
│  <- Back     Dashboard       │
├──────────────────────────────┤
│                              │
│  全体進捗                     │
│  ========----  52%           │
│  78 / 150 単語習得            │
│                              │
│  ── カテゴリ別 ──             │
│  基本構文      ========== 90%│
│  Git          ========-- 80% │
│  API          ====------ 40% │
│  DB           ==-------- 20% │
│  ...                         │
│                              │
│  ── 難易度別 ──               │
│  初級  ============ 95%      │
│  中級  ======------ 55%      │
│  上級  ==---------- 15%      │
│                              │
└──────────────────────────────┘
```

### 単語一覧画面 (`/words`)

```
┌──────────────────────────────┐
│  <- Back     Words           │
├──────────────────────────────┤
│  [検索...]                   │
│  [Category v] [Difficulty v] │
│  [Status v]                  │
│                              │
│  ┌────────────────────────┐  │
│  │ refactor    中級  [OK] │  │
│  │ リファクタリングする    │  │
│  ├────────────────────────┤  │
│  │ deprecate   中級  [...] │  │
│  │ 非推奨にする            │  │
│  ├────────────────────────┤  │
│  │ assertion   上級  [---] │  │
│  │ アサーション・表明       │  │
│  └────────────────────────┘  │
│                              │
└──────────────────────────────┘
```

## 主要ロジック設計

### 1. storage.ts（localStorage操作）

```typescript
// キー: "prog-vocab-progress"
// 読み込み時にバージョンチェック、マイグレーション対応

function loadProgress(): ProgressStore
function saveProgress(store: ProgressStore): void
function updateWordProgress(wordId: string, update: Partial<WordProgress>): void
function resetProgress(): void
```

### 2. wordFilter.ts（フィルタ・検索）

```typescript
interface FilterOptions {
  categories: Category[]
  difficulties: Difficulty[]
  statuses: LearningStatus[]
  searchQuery: string
}

function filterWords(words: Word[], options: FilterOptions): Word[]
function searchWords(words: Word[], query: string): Word[]
```

### 3. quizGenerator.ts（クイズ生成）

```typescript
interface QuizConfig {
  type: QuizType
  count: number
  categories: Category[]
  difficulties: Difficulty[]
  prioritizeWeak: boolean
}

interface QuizQuestion {
  word: Word
  type: QuizType
  options?: string[]          // 4択の選択肢（MultipleChoiceのみ）
  correctAnswer: string
}

function generateQuiz(words: Word[], progress: ProgressStore, config: QuizConfig): QuizQuestion[]
function generateOptions(correctWord: Word, allWords: Word[], type: QuizType): string[]
```

### 4. statsCalculator.ts（統計計算）

```typescript
interface OverallStats {
  totalWords: number
  masteredCount: number
  learningCount: number
  unlearnedCount: number
  masteryRate: number
}

interface CategoryStats {
  category: Category
  totalWords: number
  masteredCount: number
  masteryRate: number
}

interface DifficultyStats {
  difficulty: Difficulty
  totalWords: number
  masteredCount: number
  masteryRate: number
}

function calculateOverallStats(words: Word[], progress: ProgressStore): OverallStats
function calculateCategoryStats(words: Word[], progress: ProgressStore): CategoryStats[]
function calculateDifficultyStats(words: Word[], progress: ProgressStore): DifficultyStats[]
```

### 5. 習得判定ロジック

```typescript
// 直近5回の学習結果で判定
// - 5回中4回以上「覚えた」or「正解」→ mastered
// - 1回以上の学習履歴あり → learning
// - 履歴なし → unlearned

function determineStatus(progress: WordProgress): LearningStatus
```

## ルーティング

| パス | ページ | 説明 |
|------|--------|------|
| `/` | HomePage | ホーム画面（モード選択） |
| `/flashcard` | FlashCardPage | フラッシュカード学習 |
| `/quiz` | QuizPage | クイズ学習（設定→出題→結果） |
| `/dashboard` | DashboardPage | 学習進捗ダッシュボード |
| `/words` | WordListPage | 単語一覧・検索 |

## 状態管理方針

- **グローバル状態は使わない**（Redux等は不要）
- 各ページ・コンポーネントでカスタムフックを通じてデータアクセス
- `useWords()`: 単語データのロード・フィルタ
- `useProgress()`: localStorage経由の進捗読み書き
- `useQuiz()`: クイズの出題・回答・結果管理
- `useFlashCard()`: フラッシュカードのめくり・進行管理

## 初期単語データ

初回リリースでは各カテゴリ15単語×10カテゴリ = **約150単語**を用意する。

## デプロイ

- `npm run dev` でローカル開発
- `npm run build` で静的ファイル生成
- GitHub Pages or Vercel で必要に応じてデプロイ可能
