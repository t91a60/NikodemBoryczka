import { BatteryFull } from '@phosphor-icons/react'

export default function BatteryPopup() {
  return (
    <div className="p-4 min-w-[180px]">
      <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-dim)' }}>Battery</div>
      <div className="flex items-center gap-3 mb-2">
        <BatteryFull size={20} weight="fill" style={{ color: 'var(--color-success)' }} />
        <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>87%</span>
      </div>
      <div className="text-[11px]" style={{ color: 'var(--color-text-dim)' }}>Charging (2h 14m until full)</div>
    </div>
  )
}
