# Tasks: プログラミング英単語学習アプリ

## Phase 1: プロジェクトセットアップ

### T-1.1: プロジェクト初期化
- [x] Vite + React + TypeScript でプロジェクト作成 (`npm create vite@latest prog-vocab`)
- [x] 依存関係インストール: react-router-dom, tailwindcss
- [x] 開発依存関係インストール: vitest, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, jsdom
- [x] Tailwind CSS v4 の設定
- [x] Vitest の設定 (vitest.config.ts, setupTests.ts)
- [x] ESLint の設定
- [x] tsconfig.json のパスエイリアス設定 (`@/` → `src/`)
- [x] ディレクトリ構成の作成

### T-1.2: 型定義
- [x] `src/types/index.ts` に全型定義を作成
  - Word, Category, Difficulty
  - WordProgress, LearningStatus, FlashcardResult, QuizResult, QuizType
  - ProgressStore
  - FilterOptions, QuizConfig, QuizQuestion
  - OverallStats, CategoryStats, DifficultyStats

---

## Phase 2: コアロジック（TDD）

### T-2.1: storage.ts
- [x] テスト作成: `tests/lib/storage.test.ts` (UT-1.1〜1.4)
- [x] 実装: `src/lib/storage.ts`
  - loadProgress, saveProgress, updateWordProgress, resetProgress
- [x] テスト通過確認（9テスト通過）

### T-2.2: wordFilter.ts
- [x] テスト作成: `tests/lib/wordFilter.test.ts` (UT-2.1〜2.2)
- [x] 実装: `src/lib/wordFilter.ts`
  - filterWords, searchWords
- [x] テスト通過確認（11テスト通過）

### T-2.3: quizGenerator.ts
- [x] テスト作成: `tests/lib/quizGenerator.test.ts` (UT-3.1〜3.2)
- [x] 実装: `src/lib/quizGenerator.ts`
  - generateQuiz, generateOptions
- [x] テスト通過確認（10テスト通過）

### T-2.4: statsCalculator.ts
- [x] テスト作成: `tests/lib/statsCalculator.test.ts` (UT-4.1〜4.4)
- [x] 実装: `src/lib/statsCalculator.ts`
  - calculateOverallStats, calculateCategoryStats, calculateDifficultyStats, determineStatus
- [x] テスト通過確認（13テスト通過）

### T-2.5: テストフィクスチャ
- [x] `tests/fixtures/words.ts` にテスト用単語データ作成
- [x] `tests/fixtures/progress.ts` にテスト用進捗データ作成

---

## Phase 3: カスタムフック

### T-3.1: useWords
- [x] 実装: `src/hooks/useWords.ts`

### T-3.2: useProgress
- [x] 実装: `src/hooks/useProgress.ts`

### T-3.3: useFlashCard
- [x] 実装: `src/hooks/useFlashCard.ts`

### T-3.4: useQuiz
- [x] 実装: `src/hooks/useQuiz.ts`

---

## Phase 4: UIコンポーネント

### T-4.1: 共通レイアウト
- [x] `src/components/layout/Layout.tsx` - 共通レイアウト（ヘッダー+コンテンツ領域）
- [x] `src/components/layout/Header.tsx` - ナビゲーションヘッダー
- [x] `src/app/App.tsx` - ルーター設定

### T-4.2: UI部品
- [x] `src/components/ui/FilterBar.tsx` - カテゴリ・難易度フィルタ
- [x] `src/components/ui/SearchInput.tsx` - デバウンス付き検索
- [x] `src/components/ui/ProgressBar.tsx` - プログレスバー

### T-4.3: フラッシュカード
- [x] `src/components/flashcard/FlashCard.tsx` - カード表裏のフリップ
- [x] `src/components/flashcard/FlashCardDeck.tsx` - デッキ管理+覚えた/まだ

### T-4.4: クイズ
- [x] `src/components/quiz/QuizSetup.tsx` - クイズ設定画面
- [x] `src/components/quiz/MultipleChoice.tsx` - 4択問題
- [x] `src/components/quiz/TypingQuiz.tsx` - タイピング問題
- [x] `src/components/quiz/QuizResult.tsx` - クイズ結果画面

### T-4.5: ダッシュボード
- [x] `src/components/dashboard/ProgressChart.tsx` - 進捗チャート
- [x] `src/components/dashboard/StatsCard.tsx` - 統計カード

### T-4.6: 単語一覧
- [x] `src/components/word/WordList.tsx` - 単語リスト

---

## Phase 5: ページ統合

### T-5.1: ページ実装
- [x] `src/pages/HomePage.tsx` - ホーム画面（モード選択+簡易統計）
- [x] `src/pages/FlashCardPage.tsx` - フラッシュカードページ（フィルタ+デッキ）
- [x] `src/pages/QuizPage.tsx` - クイズページ（設定→出題→結果の状態遷移）
- [x] `src/pages/DashboardPage.tsx` - ダッシュボードページ
- [x] `src/pages/WordListPage.tsx` - 単語一覧ページ（検索+フィルタ+リスト）

---

## Phase 6: 単語データ

### T-6.1: 単語データ作成
- [x] `src/data/words.json` に150単語を作成（10カテゴリ x 15単語、各カテゴリ beginner/intermediate/advanced 5語ずつ）

---

## Phase 7: 仕上げ

### T-7.2: 品質チェック
- [x] 全テスト通過確認 (`npm run test`) - 43テスト通過
- [x] TypeScript型チェック (`npx tsc -b`) - エラー0
- [x] ビルド成功確認 (`npm run build`) - 成功

---

## 実装順序

```
Phase 1 (セットアップ)       ✅ 完了
  ↓
Phase 2 (コアロジック)        ✅ 完了 - TDD: 43テスト全通過
  ↓
Phase 3 (フック)             ✅ 完了
  ↓
Phase 4 (UIコンポーネント)    ✅ 完了
  ↓
Phase 5 (ページ統合)          ✅ 完了
  ↓
Phase 6 (単語データ)          ✅ 完了 - 150単語
  ↓
Phase 7 (仕上げ)             ✅ 完了 - ビルド成功
```
