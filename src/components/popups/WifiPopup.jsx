import { WifiHigh } from '@phosphor-icons/react'

const networks = ['Orange Fiber', 'Play 5G', 'Home Network', 'UPC WiFi']

export default function WifiPopup() {
  return (
    <div className="p-3 space-y-1 min-w-[200px]">
      <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-dim)' }}>Wi-Fi Networks</div>
      {networks.map(n => (
        <div key={n} className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors popup-item" style={{ color: 'var(--color-text-muted)' }}>
          <WifiHigh size={12} style={{ color: 'var(--color-accent)' }} />
          {n}
        </div>
      ))}
      <div className="pt-1.5 mt-1.5 border-t text-[11px] text-center" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-dim)' }}>
        Connected to <span style={{ color: 'var(--color-accent)' }}>Orange Fiber</span>
      </div>
    </div>
  )
}
