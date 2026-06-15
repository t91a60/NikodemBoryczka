import { motion } from 'motion/react'
import { Terminal, Folder, User } from '@phosphor-icons/react'

const dockItems = [
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'about', label: 'About', icon: User },
]

export default function Dock({ onOpen, openWindows }) {
  return (
    <nav
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 16,
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '6px 10px',
        borderRadius: 12,
        backgroundColor: 'rgba(14, 8, 14, 0.85)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(233,84,32,0.05)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 200,
      }}
      aria-label="Application dock"
    >
      {dockItems.map((item) => {
        const Icon = item.icon
        const isOpen = openWindows.includes(item.id)
        return (
          <button
            key={item.id}
            onClick={() => onOpen(item.id)}
            className="dock-item"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '6px 10px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              color: isOpen ? 'var(--color-accent-bright)' : 'var(--color-text-dim)',
              transition: 'color 150ms var(--ease-out), transform 150ms var(--ease-out)',
            }}
            aria-label={`Open ${item.label}`}
            aria-pressed={isOpen}
          >
            <Icon size={22} weight={isOpen ? 'fill' : 'regular'} />
            <span style={{ fontSize: 10, fontWeight: 500, lineHeight: 1 }}>{item.label}</span>
            {isOpen && (
              <motion.div
                layoutId="dock-active"
                style={{
                  position: 'absolute',
                  bottom: -4,
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent)',
                }}
              />
            )}
          </button>
        )
      })}

      <style>{`
        .dock-item:active {
          transform: scale(0.95);
        }
        @media (hover: hover) and (pointer: fine) {
          .dock-item:hover {
            transform: translateY(-4px) scale(1.05);
          }
        }
      `}</style>
    </nav>
  )
}
