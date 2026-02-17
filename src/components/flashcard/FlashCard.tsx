import type { Word } from "@/types"

interface FlashCardProps {
  word: Word
  isFlipped: boolean
  onFlip: () => void
}

export function FlashCard({ word, isFlipped, onFlip }: FlashCardProps) {
  return (
    <div className="perspective-1000 mx-auto w-full max-w-md">
      <button
        type="button"
        onClick={onFlip}
        className={`relative h-64 w-full cursor-pointer transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border-2 border-gray-200 bg-white shadow-lg [backface-visibility:hidden]">
          <p className="text-3xl font-bold text-gray-900">{word.english}</p>
          <p className="mt-4 text-sm text-gray-400">タップでめくる</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border-2 border-blue-200 bg-blue-50 p-6 shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-2xl font-bold text-gray-900">{word.english}</p>
          <hr className="my-3 w-16 border-gray-300" />
          <p className="text-xl text-blue-800">{word.japanese}</p>
          <pre className="mt-4 max-w-full overflow-x-auto rounded bg-gray-800 px-4 py-2 text-left text-xs text-green-400">
            <code>{word.example}</code>
          </pre>
        </div>
      </button>
    </div>
  )
}
