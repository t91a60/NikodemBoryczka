import { useState, useEffect } from 'react'

export default function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className="absolute top-5 right-5 z-[5] text-right select-none"
      style={{ color: 'var(--color-text-dim)' }}
    >
      <p className="text-xs font-mono tabular-nums tracking-wider">
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </p>
      <p className="text-[10px] font-mono tabular-nums" style={{ color: 'var(--color-text-dim)' }}>
        {time.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
      </p>
    </div>
  )
}
