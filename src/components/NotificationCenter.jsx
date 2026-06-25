import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, BellRinging } from '@phosphor-icons/react'
import { NotificationContext } from '../lib/notificationContext.js'

let nextId = 0

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [panelOpen, setPanelOpen] = useState(false)

  const notify = useCallback((message, options = {}) => {
    const id = ++nextId
    setToasts(prev => [...prev, { id, message, type: options.type || 'info', icon: options.icon || null }])
    if (!options.persistent) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, options.duration || 4000)
    }
    return id
  }, [])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <NotificationContext.Provider value={{ notify, dismiss, clearAll, toasts, panelOpen, setPanelOpen }}>
      {children}

      <div
        style={{
          position: 'fixed',
          top: 44,
          right: 12,
          zIndex: 450,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          maxWidth: 340,
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              style={{
                pointerEvents: 'auto',
                padding: '10px 14px',
                borderRadius: 10,
                backgroundColor: 'rgba(22, 10, 24, 0.95)',
                border: '1px solid var(--color-border-light)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              {t.icon || <BellRinging size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />}
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', flex: 1 }}>{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-dim)',
                  cursor: 'pointer',
                  padding: 2,
                }}
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  )
}
