import { useState } from 'react'
import { SpeakerHigh, SpeakerSimpleX } from '@phosphor-icons/react'

export default function SpeakerPopup() {
  const [vol, setVol] = useState(75)
  const [muted, setMuted] = useState(false)
  const Icon = muted ? SpeakerSimpleX : SpeakerHigh

  return (
    <div className="p-4 min-w-[220px]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-dim)' }}>Volume</span>
        {muted && <span className="text-[10px]" style={{ color: 'var(--color-text-dim)' }}>Muted</span>}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMuted(!muted)}
          className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors cursor-pointer"
          style={{
            color: muted ? 'var(--color-text-dim)' : 'var(--color-accent)',
            background: 'transparent',
            border: 'none',
          }}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          <Icon size={18} weight={muted ? 'regular' : 'fill'} />
        </button>
        <div className="flex-1 relative">
          <input
            type="range"
            min="0"
            max="100"
            value={muted ? 0 : vol}
            onChange={e => { setVol(Number(e.target.value)); setMuted(false) }}
            aria-label="Volume slider"
            className="volume-slider"
            style={{
              width: '100%',
              height: 4,
              appearance: 'none',
              background: `linear-gradient(to right, var(--color-accent) ${muted ? 0 : vol}%, var(--color-border) ${muted ? 0 : vol}%)`,
              borderRadius: 2,
              outline: 'none',
              cursor: muted ? 'default' : 'pointer',
            }}
          />
        </div>
        <span className="text-xs font-mono tabular-nums" style={{ color: 'var(--color-text-dim)', minWidth: 28, textAlign: 'right' }}>
          {muted ? 0 : vol}
        </span>
      </div>
    </div>
  )
}
