import { SignOut, Gear, Info } from '@phosphor-icons/react'

export default function UserPopup() {
  return (
    <div className="py-1 min-w-[180px]">
      <div className="px-4 py-3 flex items-center gap-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white select-none"
          style={{ backgroundColor: 'var(--color-accent)' }}
          aria-hidden="true"
        >
          N
        </div>
        <div>
          <div className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>nikodem</div>
          <div className="text-[10px]" style={{ color: 'var(--color-text-dim)' }}>nikodem@dev-desktop</div>
        </div>
      </div>
      <div className="py-1">
        <button className="popup-action-btn">
          <Gear size={14} />
          Settings
        </button>
        <button className="popup-action-btn">
          <Info size={14} />
          About This Desktop
        </button>
      </div>
      <div className="border-t" style={{ borderColor: 'var(--color-border)' }}>
        <button className="popup-action-btn" style={{ color: 'var(--color-text-dim)' }} aria-label="Lock or log out">
          <SignOut size={14} />
          Lock / Log Out
        </button>
      </div>
    </div>
  )
}
