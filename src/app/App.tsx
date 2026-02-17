import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { DashboardPage } from "@/pages/DashboardPage"
import { FlashCardPage } from "@/pages/FlashCardPage"
import { HomePage } from "@/pages/HomePage"
import { QuizPage } from "@/pages/QuizPage"
import { WordListPage } from "@/pages/WordListPage"

export function App() {
  return (
    <BrowserRouter basename="/prog-vocab">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/flashcard" element={<FlashCardPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/words" element={<WordListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
