import { memo } from 'react'
import { motion } from 'motion/react'

function TaskbarAppButton({ icon: Icon, label, isActive, isMinimized, onClick }) {
  return (
    <motion.button
      layout
      className="taskbar-app-btn"
      onClick={onClick}
      title={`${label}${isMinimized ? ' (minimized)' : ''}${isActive ? ' (active)' : ''}`}
      aria-label={`${label}${isMinimized ? ' (minimized)' : ''}${isActive ? ' (active window)' : ''}`}
      aria-current={isActive ? 'true' : undefined}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{ opacity: isMinimized ? 0.45 : 1 }}
    >
      <Icon size={16} weight={isActive && !isMinimized ? 'fill' : 'regular'} />
      <motion.div
        className="taskbar-app-indicator"
        animate={{
          width: isActive ? 20 : (isMinimized ? 4 : 6),
          borderRadius: isMinimized ? '50%' : '3px',
          opacity: isActive ? 1 : 0.5,
          backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-text-dim)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      />
    </motion.button>
  )
}

export default memo(TaskbarAppButton)
