interface ProgressBarProps {
  current: number
  total: number
  labels: string[]
}

export function ProgressBar({ current, total, labels }: ProgressBarProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs text-zinc-600">
        <span className="font-medium text-zinc-800">{labels[current]}</span>
        <span aria-label={`전체 ${total}단계 중 ${current + 1}단계`}>
          {current + 1} / {total}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= current ? 'bg-blue-500' : 'bg-zinc-100'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
