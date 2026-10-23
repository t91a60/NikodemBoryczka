import { Terminal, Folder, User, ArrowsOutSimple } from '@phosphor-icons/react'
import { useDismissableLayer } from '../hooks/useDismissableLayer.js'

const items = [
  { id: 'terminal', label: 'Open Terminal', icon: Terminal },
  { id: 'projects', label: 'Open Projects', icon: Folder },
  { id: 'about', label: 'View About', icon: User },
  { type: 'separator' },
  { id: 'arrange', label: 'Arrange Windows', icon: ArrowsOutSimple },
]

export default function ContextMenu({ x, y, onClose, onAction }) {
  const ref = useDismissableLayer(onClose)

  const menuX = Math.max(0, Math.min(x, window.innerWidth - 200))
  const menuY = Math.max(0, Math.min(y, window.innerHeight - 240))

  return (
    <div
      ref={ref}
      data-dismissable-layer="context-menu"
      role="menu"
      aria-label="Desktop context menu"
      onKeyDown={(event) => {
        const buttons = Array.from(ref.current.querySelectorAll('[role="menuitem"]'))
        const index = buttons.indexOf(document.activeElement)
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          buttons[(index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length]?.focus()
        } else if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault()
          buttons[event.key === 'Home' ? 0 : buttons.length - 1]?.focus()
        } else if (event.key === 'Tab') {
          onClose()
        }
      }}
      style={{
        position: 'fixed',
        left: menuX,
        top: menuY,
        zIndex: 600,
        minWidth: 200,
        padding: '4px 0',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 10,
        boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
      }}
    >
      {items.map((item, i) => {
        if (item.type === 'separator') {
          return (
            <div
              key={`sep-${i}`}
              role="separator"
              style={{
                height: 1,
                margin: '4px 8px',
                backgroundColor: 'var(--color-border)',
              }}
            />
          )
        }
        const Icon = item.icon
        return (
          <button
            key={item.id}
            role="menuitem"
            onClick={() => { onAction(item.id); onClose() }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '8px 14px',
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-muted)',
              fontSize: 12,
              cursor: 'pointer',
              textAlign: 'left',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(233,84,32,0.1)'; e.currentTarget.style.color = 'var(--color-text)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
          >
            <Icon size={14} style={{ color: 'var(--color-accent)' }} />
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
