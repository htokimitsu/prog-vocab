import { Link } from "react-router-dom"

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-gray-900">
          Prog Vocab
        </Link>
        <nav className="flex gap-4">
          <Link to="/flashcard" className="text-sm text-gray-600 hover:text-gray-900">
            Flash Card
          </Link>
          <Link to="/quiz" className="text-sm text-gray-600 hover:text-gray-900">
            Quiz
          </Link>
          <Link to="/words" className="text-sm text-gray-600 hover:text-gray-900">
            Words
          </Link>
          <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  )
}
