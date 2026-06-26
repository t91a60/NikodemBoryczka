import { motion } from 'motion/react'
import { BatteryFull, Lightning } from '@phosphor-icons/react'

export default function BatteryPopup() {
  const percent = 87
  const charging = true
  const timeRemaining = '2h 14m'

  return (
    <div className="p-4 min-w-[200px] space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-dim)' }}>Battery</span>
        {charging && <Lightning size={12} weight="fill" style={{ color: 'var(--color-success)' }} />}
      </div>
      <div className="flex items-center gap-3">
        <BatteryFull size={28} weight="fill" style={{ color: percent <= 20 ? 'var(--color-warning)' : 'var(--color-success)' }} />
        <div className="flex-1">
          <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{percent}%</div>
          <div className="text-[11px]" style={{ color: 'var(--color-text-dim)' }}>
            {charging ? `Charging \u2014 ${timeRemaining} until full` : `${timeRemaining} remaining`}
          </div>
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{ backgroundColor: percent <= 20 ? 'var(--color-warning)' : 'var(--color-success)' }}
        />
      </div>
    </div>
  )
}
