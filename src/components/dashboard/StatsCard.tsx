interface StatsCardProps {
  label: string
  value: number | string
  color?: "blue" | "green" | "yellow" | "gray"
}

const BG_MAP = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  yellow: "bg-yellow-50 text-yellow-700",
  gray: "bg-gray-50 text-gray-700",
} as const

export function StatsCard({ label, value, color = "blue" }: StatsCardProps) {
  return (
    <div className={`rounded-xl p-4 ${BG_MAP[color]}`}>
      <p className="text-sm opacity-75">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  )
}
