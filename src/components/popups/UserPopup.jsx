import { SignOut } from '@phosphor-icons/react'

export default function UserPopup() {
  return (
    <div className="py-1 min-w-[160px]">
      <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>nikodem</div>
        <div className="text-[10px]" style={{ color: 'var(--color-text-dim)' }}>nikodem@dev-desktop</div>
      </div>
      <button
        className="flex items-center gap-2 w-full px-3 py-2 text-xs cursor-pointer transition-colors popup-item"
        style={{ color: 'var(--color-text-muted)' }}
        aria-label="Lock or log out"
      >
        <SignOut size={14} />
        Lock / Log Out
      </button>
    </div>
  )
}
