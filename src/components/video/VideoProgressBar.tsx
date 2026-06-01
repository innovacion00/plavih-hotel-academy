type Props = {
  percent: number          // 0-100
  showLabel?: boolean
  colorClass?: string
}

export default function VideoProgressBar({
  percent,
  showLabel = true,
  colorClass = 'bg-[#00A9E0]',
}: Props) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colorClass}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-right text-[10px] text-[#5F6368] mt-0.5">{clamped}% completado</p>
      )}
    </div>
  )
}
