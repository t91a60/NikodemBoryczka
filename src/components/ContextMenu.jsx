import { useEffect, useRef } from 'react'
import { Terminal, Folder, User, ArrowsOutSimple } from '@phosphor-icons/react'

const items = [
  { id: 'terminal', label: 'Open Terminal', icon: Terminal },
  { id: 'projects', label: 'New Projects Window', icon: Folder },
  { id: 'about', label: 'View About', icon: User },
  { type: 'separator' },
  { id: 'arrange', label: 'Arrange Windows', icon: ArrowsOutSimple },
]

export default function ContextMenu({ x, y, onClose, onAction }) {
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose()
      }
    }
    function keyHandler(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', keyHandler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', keyHandler)
    }
  }, [onClose])

  const menuX = Math.min(x, window.innerWidth - 200)
  const menuY = Math.min(y, window.innerHeight - 220)

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: menuX,
        top: menuY,
        zIndex: 600,
        minWidth: 200,
        padding: '4px 0',
        backgroundColor: 'rgba(22, 10, 20, 0.95)',
        border: '1px solid var(--color-border)',
        borderRadius: 10,
        boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {items.map((item, i) => {
        if (item.type === 'separator') {
          return (
            <div
              key={`sep-${i}`}
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
