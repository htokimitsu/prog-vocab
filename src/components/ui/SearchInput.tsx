import { useEffect, useState } from "react"

interface SearchInputProps {
  onSearch: (query: string) => void
  placeholder?: string
  debounceMs?: number
}

export function SearchInput({
  onSearch,
  placeholder = "検索...",
  debounceMs = 300,
}: SearchInputProps) {
  const [value, setValue] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [value, debounceMs, onSearch])

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
    />
  )
}
