import { motion } from 'motion/react'
import { UserCircle } from '@phosphor-icons/react'
import { useEffect, useState, useCallback } from 'react'

export default function LockScreen({ onUnlock }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const unlock = useCallback(() => onUnlock?.(), [onUnlock])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') unlock()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [unlock])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Lock screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      onClick={unlock}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        backgroundColor: 'rgba(12, 6, 12, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        cursor: 'pointer',
      }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white select-none"
        style={{ backgroundColor: 'var(--color-accent)' }}
        aria-hidden="true"
      >
        N
      </div>
      <div className="font-mono text-5xl tabular-nums select-none" style={{ color: 'var(--color-text)' }}>
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-sm font-semibold select-none" style={{ color: 'var(--color-text-muted)' }}>nikodem</div>
      <button
        onClick={(e) => { e.stopPropagation(); unlock() }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm cursor-pointer"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border-light)',
          fontFamily: 'var(--font-sans)',
        }}
        aria-label="Unlock screen"
      >
        <UserCircle size={18} weight="duotone" style={{ color: 'var(--color-accent)' }} />
        Unlock
      </button>
    </motion.div>
  )
}