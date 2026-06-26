import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'

export default function Popup({ children, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose?.()
    }
    function handleKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 6,
        minWidth: 180,
        backgroundColor: 'rgba(20, 10, 18, 0.96)',
        border: '1px solid var(--color-border)',
        borderRadius: 10,
        boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(233,84,32,0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 400,
        overflow: 'hidden',
        transformOrigin: 'top right',
      }}
    >
      {children}
    </motion.div>
  )
}
