import { WifiHigh, WifiSlash, CheckCircle } from '@phosphor-icons/react'

const networks = [
  { name: 'Orange Fiber', secured: true, strength: 4 },
  { name: 'Play 5G', secured: true, strength: 3 },
  { name: 'Home Network', secured: true, strength: 2 },
  { name: 'UPC WiFi', secured: false, strength: 1 },
]

export default function WifiPopup() {
  return (
    <div className="p-3 min-w-[220px]">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-dim)' }}>Wi-Fi</span>
        <WifiHigh size={14} style={{ color: 'var(--color-accent)' }} />
      </div>
      <div className="space-y-0.5">
        {networks.map((n) => {
          const Icon = n.strength >= 3 ? WifiHigh : WifiSlash
          return (
            <div
              key={n.name}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors popup-item"
              style={{ color: n.name === 'Orange Fiber' ? 'var(--color-accent-bright)' : 'var(--color-text-muted)' }}
            >
              <Icon size={12} weight={n.name === 'Orange Fiber' ? 'fill' : 'regular'} />
              <span className="flex-1">{n.name}</span>
              {n.secured && <span className="text-[9px]" style={{ color: 'var(--color-text-dim)' }}>Secured</span>}
              {n.name === 'Orange Fiber' && <CheckCircle size={10} weight="fill" style={{ color: 'var(--color-success)' }} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
