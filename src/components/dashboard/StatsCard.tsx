type Props = {
  label: string
  value: string | number
  icon: string
  trend?: string
  trendUp?: boolean
  color?: string
}

export default function StatsCard({ label, value, icon, trend, trendUp, color = 'bg-[#E8F7FD]' }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[#5F6368] text-xs font-medium mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-[#222222]">{value}</p>
        {trend && (
          <p className={`text-xs mt-0.5 font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
    </div>
  )
}
