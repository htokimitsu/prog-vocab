interface ProgressBarProps {
  value: number // 0-100
  label?: string
  color?: "blue" | "green" | "yellow" | "red"
}

const COLOR_MAP = {
  blue: "bg-blue-600",
  green: "bg-green-600",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
} as const

export function ProgressBar({ value, label, color = "blue" }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value))

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-gray-700">{label}</span>
          <span className="font-medium text-gray-900">{clampedValue}%</span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-300 ${COLOR_MAP[color]}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}
