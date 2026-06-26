import { useState } from 'react'
import { SpeakerHigh } from '@phosphor-icons/react'

export default function SpeakerPopup() {
  const [vol, setVol] = useState(75)
  return (
    <div className="p-4 min-w-[200px]">
      <div className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-dim)' }}>Volume</div>
      <div className="flex items-center gap-3">
        <SpeakerHigh size={16} style={{ color: 'var(--color-accent)' }} />
        <input
          type="range"
          min="0"
          max="100"
          value={vol}
          onChange={e => setVol(e.target.value)}
          aria-label="Volume slider"
          style={{
            flex: 1, height: 4, appearance: 'none',
            background: `linear-gradient(to right, var(--color-accent) ${vol}%, var(--color-border) ${vol}%)`,
            borderRadius: 2, outline: 'none', cursor: 'pointer',
          }}
        />
        <span className="text-xs font-mono" style={{ color: 'var(--color-text-dim)', minWidth: 32, textAlign: 'right' }}>{vol}%</span>
      </div>
    </div>
  )
}
