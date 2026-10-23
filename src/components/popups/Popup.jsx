import { motion } from 'motion/react'
import { useDismissableLayer } from '../../hooks/useDismissableLayer.js'

export default function Popup({ children, onClose }) {
  const ref = useDismissableLayer(onClose)

  return (
    <motion.div
      ref={ref}
      className="system-popup"
      data-dismissable-layer="popup"
      tabIndex={-1}
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
        backgroundColor: '#140a12',
        border: '1px solid var(--color-border)',
        borderRadius: 10,
        boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(233,84,32,0.05)',
        zIndex: 400,
        overflow: 'hidden',
        transformOrigin: 'top right',
      }}
    >
      {children}
    </motion.div>
  )
}
