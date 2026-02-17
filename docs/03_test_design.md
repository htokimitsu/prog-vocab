# Test Design: プログラミング英単語学習アプリ

## テストツール

- **Vitest**: ユニットテスト・統合テスト
- **@testing-library/react**: コンポーネントテスト
- **@testing-library/user-event**: ユーザー操作シミュレーション
- **jsdom**: DOM環境

## テスト構成

```
tests/
├── lib/
│   ├── storage.test.ts
│   ├── wordFilter.test.ts
│   ├── quizGenerator.test.ts
│   └── statsCalculator.test.ts
├── hooks/
│   ├── useWords.test.ts
│   ├── useProgress.test.ts
│   ├── useQuiz.test.ts
│   └── useFlashCard.test.ts
└── components/
    ├── flashcard/
    │   ├── FlashCard.test.tsx
    │   └── FlashCardDeck.test.tsx
    ├── quiz/
    │   ├── MultipleChoice.test.tsx
    │   ├── TypingQuiz.test.tsx
    │   ├── QuizSetup.test.tsx
    │   └── QuizResult.test.tsx
    ├── dashboard/
    │   └── ProgressChart.test.tsx
    ├── word/
    │   └── WordList.test.tsx
    └── ui/
        ├── FilterBar.test.tsx
        └── SearchInput.test.tsx
```

## テストデータ

```typescript
// tests/fixtures/words.ts
// テスト用の最小限の単語セット（10単語、カテゴリ・難易度を網羅）
```

---

## UT-1: storage.ts

### UT-1.1: loadProgress

| ID | テストケース | 入力 | 期待結果 |
|----|------------|------|---------|
| UT-1.1.1 | localStorageが空の場合、初期ProgressStoreを返す | localStorage空 | `{ version: 1, progress: {} }` |
| UT-1.1.2 | 保存済みデータがある場合、パースして返す | 有効なJSON | パース済みProgressStore |
| UT-1.1.3 | 不正なJSONの場合、初期値にフォールバック | 不正なJSON文字列 | `{ version: 1, progress: {} }` |
| UT-1.1.4 | バージョンが古い場合、マイグレーションする | version: 0 | version: 1に更新 |

### UT-1.2: saveProgress

| ID | テストケース | 入力 | 期待結果 |
|----|------------|------|---------|
| UT-1.2.1 | ProgressStoreをlocalStorageに保存する | 有効なProgressStore | localStorageにJSON文字列で保存 |

### UT-1.3: updateWordProgress

| ID | テストケース | 入力 | 期待結果 |
|----|------------|------|---------|
| UT-1.3.1 | 新規単語の進捗を追加する | 未登録のwordId | 新規WordProgressが追加される |
| UT-1.3.2 | 既存の進捗を更新する | 登録済みのwordId | 該当WordProgressが更新される |
| UT-1.3.3 | 部分更新が既存フィールドを保持する | statusのみの更新 | 他フィールドは元の値を保持 |

### UT-1.4: resetProgress

| ID | テストケース | 入力 | 期待結果 |
|----|------------|------|---------|
| UT-1.4.1 | 全進捗をリセットする | - | localStorageのデータが初期化される |

---

## UT-2: wordFilter.ts

### UT-2.1: filterWords

| ID | テストケース | 入力 | 期待結果 |
|----|------------|------|---------|
| UT-2.1.1 | フィルタなし（全件取得） | categories=[], difficulties=[] | 全単語を返す |
| UT-2.1.2 | カテゴリでフィルタ | categories=["syntax"] | syntaxカテゴリのみ |
| UT-2.1.3 | 難易度でフィルタ | difficulties=["beginner"] | 初級のみ |
| UT-2.1.4 | カテゴリ+難易度の複合フィルタ | categories=["syntax"], difficulties=["beginner"] | 両方に合致するもの |
| UT-2.1.5 | 複数カテゴリ選択 | categories=["syntax", "git"] | いずれかに合致するもの |
| UT-2.1.6 | 該当なしの場合 | categories=["devops"], 該当なし | 空配列 |
| UT-2.1.7 | 学習状態でフィルタ | statuses=["mastered"] | 習得済みのみ |

### UT-2.2: searchWords

| ID | テストケース | 入力 | 期待結果 |
|----|------------|------|---------|
| UT-2.2.1 | 英単語で検索 | query="refact" | "refactor"を含む結果 |
| UT-2.2.2 | 日本語で検索 | query="変数" | "variable"を含む結果 |
| UT-2.2.3 | 大文字小文字を無視して検索 | query="REFACTOR" | "refactor"を含む結果 |
| UT-2.2.4 | 空文字列で全件返す | query="" | 全単語 |
| UT-2.2.5 | 一致なしの場合 | query="zzzzz" | 空配列 |

---

## UT-3: quizGenerator.ts

### UT-3.1: generateQuiz

| ID | テストケース | 入力 | 期待結果 |
|----|------------|------|---------|
| UT-3.1.1 | 指定数の問題を生成する | count=10 | 10問のQuizQuestion配列 |
| UT-3.1.2 | 単語数が出題数より少ない場合 | count=100, 単語30個 | 30問（全単語分） |
| UT-3.1.3 | カテゴリフィルタ付きで生成 | categories=["git"] | gitカテゴリの単語のみ出題 |
| UT-3.1.4 | 苦手優先モードで誤答が多い単語を優先 | prioritizeWeak=true | 誤答率が高い単語が前方に出現 |
| UT-3.1.5 | 出題順がランダムである | 同じconfig | 複数回実行で異なる順序（統計的確認） |
| UT-3.1.6 | en-to-ja形式で正答が日本語 | type="en-to-ja" | correctAnswerが日本語 |
| UT-3.1.7 | ja-to-en形式で正答が英語 | type="ja-to-en" | correctAnswerが英語 |

### UT-3.2: generateOptions

| ID | テストケース | 入力 | 期待結果 |
|----|------------|------|---------|
| UT-3.2.1 | 4つの選択肢を生成 | 正答の単語+全単語リスト | 4つの選択肢（正答を含む） |
| UT-3.2.2 | 正答が必ず選択肢に含まれる | - | options内に正答が存在 |
| UT-3.2.3 | 重複する選択肢がない | - | 全選択肢がユニーク |
| UT-3.2.4 | 単語が4つ未満の場合 | 2単語のみ | 利用可能な数の選択肢 |

---

## UT-4: statsCalculator.ts

### UT-4.1: calculateOverallStats

| ID | テストケース | 入力 | 期待結果 |
|----|------------|------|---------|
| UT-4.1.1 | 進捗なし（初期状態） | 空のprogress | totalWords=全件, mastered=0, rate=0 |
| UT-4.1.2 | 一部習得済み | 3/10がmastered | masteredCount=3, masteryRate=30 |
| UT-4.1.3 | 全習得 | 全てmastered | masteryRate=100 |
| UT-4.1.4 | 各ステータスのカウントが正しい | 混在データ | 各カウントの合計=totalWords |

### UT-4.2: calculateCategoryStats

| ID | テストケース | 入力 | 期待結果 |
|----|------------|------|---------|
| UT-4.2.1 | カテゴリ別の集計が正しい | 複数カテゴリのデータ | カテゴリごとの正しい集計 |
| UT-4.2.2 | 進捗なしのカテゴリは習得率0% | 一部カテゴリのみ学習 | 未学習カテゴリのrate=0 |

### UT-4.3: calculateDifficultyStats

| ID | テストケース | 入力 | 期待結果 |
|----|------------|------|---------|
| UT-4.3.1 | 難易度別の集計が正しい | 各難易度のデータ | 難易度ごとの正しい集計 |

### UT-4.4: determineStatus

| ID | テストケース | 入力 | 期待結果 |
|----|------------|------|---------|
| UT-4.4.1 | 履歴なしの場合 | 結果配列が空 | "unlearned" |
| UT-4.4.2 | 直近5回中3回正解 | 5回中3回true | "learning" |
| UT-4.4.3 | 直近5回中4回正解 | 5回中4回true | "mastered" |
| UT-4.4.4 | 直近5回中5回正解 | 5回中5回true | "mastered" |
| UT-4.4.5 | 5回未満の履歴（2回中2回正解） | 2回中2回true | "learning" |
| UT-4.4.6 | フラッシュカードとクイズの混合結果 | 両方の結果が存在 | 全結果を統合して判定 |

---

## UT-5〜8: カスタムフック（useWords, useProgress, useQuiz, useFlashCard）

省略（本文は test_design.md 参照）

---

## CT-1〜10: コンポーネントテスト

省略（本文は test_design.md 参照）

---

## テスト優先度

### P0（必須・最優先）
- UT-1: storage.ts（データ永続化の正確性）
- UT-3: quizGenerator.ts（クイズの核心ロジック）
- UT-4.4: determineStatus（習得判定の正確性）

### P1（重要）
- UT-2: wordFilter.ts
- UT-4.1〜4.3: statsCalculator.ts
- CT-3: MultipleChoice
- CT-4: TypingQuiz

### P2（通常）
- UT-5〜8: カスタムフック
- CT-1, CT-2: フラッシュカード
- CT-5, CT-6: クイズ設定・結果

### P3（低優先）
- CT-7〜10: UI部品・ダッシュボード
