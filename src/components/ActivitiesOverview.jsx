import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MagnifyingGlass, Terminal, Folder, User, X } from '@phosphor-icons/react'

const apps = [
  { id: 'terminal', label: 'Terminal', icon: Terminal, desc: 'Command-line emulator with 20+ commands' },
  { id: 'projects', label: 'Projects', icon: Folder, desc: 'Browse portfolio projects and source code' },
  { id: 'about', label: 'About', icon: User, desc: 'Developer profile and system information' },
]

export default function ActivitiesOverview({ open, windows, minimizedWindows, onOpen, onCloseOverview }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const prevOpen = useRef(open)
  useEffect(() => {
    if (prevOpen.current && !open) {
      setQuery('')
    }
    prevOpen.current = open
  }, [open])

  useEffect(() => {
    function handler(e) {
      if (e.key === 'Escape' && open) {
        onCloseOverview()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onCloseOverview])

  const filtered = query
    ? apps.filter(a => a.label.toLowerCase().includes(query.toLowerCase()) || a.desc.toLowerCase().includes(query.toLowerCase()))
    : apps

  const openIds = Object.keys(windows)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 500,
            backgroundColor: 'rgba(12, 6, 12, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '10vh',
          }}
          role="dialog"
          aria-label="Activities overview"
          aria-modal="true"
        >
          <div style={{ position: 'relative', width: '90%', maxWidth: 480 }}>
            <MagnifyingGlass
              size={18}
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-dim)',
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Type to search apps…"
              aria-label="Search applications"
              style={{
                width: '100%',
                padding: '14px 16px 14px 46px',
                borderRadius: 12,
                border: '1px solid var(--color-border-light)',
                backgroundColor: 'rgba(28, 10, 24, 0.85)',
                color: 'var(--color-text)',
                fontSize: 16,
                outline: 'none',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              gap: 16,
              marginTop: 32,
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: 700,
            }}
            role="list"
            aria-label="Available applications"
          >
            {filtered.map((app, i) => {
              const Icon = app.icon
              const isOpen = openIds.includes(app.id)
              const isMinimized = isOpen && minimizedWindows?.[app.id]
              return (
                <motion.button
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  onClick={() => { onOpen(app.id); onCloseOverview() }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    padding: '20px 24px',
                    borderRadius: 16,
                    border: isOpen ? '1px solid var(--color-border-light)' : '1px solid transparent',
                    backgroundColor: isOpen ? 'rgba(233,84,32,0.08)' : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    minWidth: 100,
                    transition: 'background-color 0.15s, border-color 0.15s',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(233,84,32,0.12)'; e.currentTarget.style.borderColor = 'var(--color-border-light)' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = isOpen ? 'rgba(233,84,32,0.08)' : 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = isOpen ? 'var(--color-border-light)' : 'transparent' }}
                  role="listitem"
                  aria-label={`${app.label}: ${app.desc}${isMinimized ? ' (minimized)' : ''}`}
                >
                  <Icon size={36} weight="duotone" style={{ color: 'var(--color-accent-bright)' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{app.label}</span>
                  <span style={{ fontSize: 10, color: 'var(--color-text-dim)' }}>{app.desc}</span>
                  {isMinimized && (
                    <span style={{ fontSize: 10, color: 'var(--color-warning)' }}>Minimized</span>
                  )}
                </motion.button>
              )
            })}
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={onCloseOverview}
            style={{
              marginTop: 40,
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              backgroundColor: 'rgba(255,255,255,0.03)',
              color: 'var(--color-text-dim)',
              cursor: 'pointer',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            aria-label="Close activities overview"
          >
            <X size={14} />
            Close Overview
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
