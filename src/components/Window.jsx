import { motion } from 'motion/react'
import { useRef, useState, useCallback } from 'react'

const HANDLE_SIZE = 6
const HANDLE_HIT = 10

export default function Window({ id, title, children, isActive, onFocus, onClose, onMinimize, onPositionChange, style, width, height }) {
  const originRef = useRef({ left: style?.left || 0, top: style?.top || 0 })
  const [size, setSize] = useState({ width, height })
  const [maximized, setMaximized] = useState(false)
  const prevRect = useRef(null)
  const resizing = useRef(null)

  function toggleMaximize() {
    if (maximized) {
      if (prevRect.current) {
        originRef.current = { left: prevRect.current.left, top: prevRect.current.top }
        setSize({ width: prevRect.current.width, height: prevRect.current.height })
        onPositionChange?.(id, { left: prevRect.current.left, top: prevRect.current.top })
      }
      setMaximized(false)
    } else {
      prevRect.current = {
        left: originRef.current.left,
        top: originRef.current.top,
        width: size.width,
        height: size.height,
      }
      originRef.current = { left: 0, top: 0 }
      setMaximized(true)
    }
  }

  const handleResize = useCallback((dir) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    onFocus()
    resizing.current = dir

    const startX = e.clientX
    const startY = e.clientY
    const startW = size.width
    const startH = size.height
    const startLeft = originRef.current.left
    const startTop = originRef.current.top

    function onMove(ev) {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY

      let newW = startW
      let newH = startH
      let newLeft = startLeft
      let newTop = startTop

      if (dir.includes('e')) newW = Math.max(320, startW + dx)
      if (dir.includes('s')) newH = Math.max(200, startH + dy)
      if (dir.includes('w')) {
        const w = Math.max(320, startW - dx)
        newW = w
        newLeft = Math.max(0, startLeft + (startW - w))
      }
      if (dir.includes('n')) {
        const h = Math.max(200, startH - dy)
        newH = h
        newTop = Math.max(0, startTop + (startH - h))
      }

      setSize({ width: newW, height: newH })
      if (newLeft !== startLeft || newTop !== startTop) {
        originRef.current = { left: newLeft, top: newTop }
      }
    }

    function onUp() {
      resizing.current = null
      onPositionChange?.(id, originRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [id, size, onFocus, onPositionChange])

  return (
    <motion.div
      drag={maximized ? false : !resizing.current}
      dragMomentum={false}
      onMouseDown={(e) => {
        if (resizing.current) return
        onFocus()
      }}
      onDragStart={() => {
        if (maximized) return
        originRef.current = { left: style?.left || 0, top: style?.top || 0 }
      }}
      onDragEnd={(_, info) => {
        if (maximized) return
        const newLeft = Math.max(0, originRef.current.left + info.offset.x)
        const newTop = Math.max(0, originRef.current.top + info.offset.y)
        originRef.current = { left: newLeft, top: newTop }
        onPositionChange?.(id, originRef.current)
      }}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        left: maximized ? 0 : style?.left,
        top: maximized ? 0 : style?.top,
        width: maximized ? '100vw' : `min(${size.width}px, calc(100vw - 24px))`,
        height: maximized ? 'calc(100vh - 36px)' : `min(${size.height}px, calc(100vh - 80px))`,
        borderRadius: maximized ? 0 : 8,
      }}
      exit={{ opacity: 0, scale: 0.5, y: 150, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }}
      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
      style={{
        border: '1px solid',
        borderColor: isActive ? 'var(--color-border-light)' : 'var(--color-border)',
        backgroundColor: 'var(--color-surface-window)',
        boxShadow: isActive
          ? '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(233,84,32,0.08)'
          : '0 6px 24px rgba(0,0,0,0.3)',
        position: 'absolute',
        zIndex: style?.zIndex,
      }}
      whileDrag={{
        boxShadow: '0 24px 72px rgba(0,0,0,0.55), 0 0 0 1px rgba(233,84,32,0.12)',
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-2 select-none cursor-grab active:cursor-grabbing"
        style={{
          backgroundColor: isActive ? 'var(--color-surface-elevated)' : 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          borderRadius: maximized ? 0 : '7px 7px 0 0',
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onDoubleClick={toggleMaximize}
      >
        <span
          className="text-xs font-medium tracking-wide"
          style={{ color: 'var(--color-text-dim)' }}
        >
          {title}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(id); }}
            className="flex items-center justify-center w-[13px] h-[13px] rounded-full"
            style={{ backgroundColor: 'var(--color-accent)' }}
            aria-label="Close window"
          />
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(id); }}
            className="flex items-center justify-center w-[13px] h-[13px] rounded-full"
            style={{ backgroundColor: 'var(--color-warning)' }}
            aria-label="Minimize window"
          />
          <button
            onClick={(e) => { e.stopPropagation(); toggleMaximize(); }}
            className="flex items-center justify-center w-[13px] h-[13px] rounded-full"
            style={{ backgroundColor: 'var(--color-success)' }}
            aria-label={maximized ? 'Restore window' : 'Maximize window'}
          />
        </div>
      </div>
      <div className="overflow-auto" style={{ height: 'calc(100% - 36px)' }}>
        {children}
      </div>

      {!maximized && (
        <>
          <div
            onMouseDown={handleResize('se')}
            style={{
              position: 'absolute', right: -HANDLE_SIZE, bottom: -HANDLE_SIZE,
              width: HANDLE_HIT * 2, height: HANDLE_HIT * 2,
              cursor: 'nwse-resize', zIndex: 10,
            }}
          />
          <div
            onMouseDown={handleResize('e')}
            style={{
              position: 'absolute', right: -HANDLE_SIZE, top: 0, bottom: HANDLE_HIT,
              width: HANDLE_HIT, cursor: 'ew-resize', zIndex: 10,
            }}
          />
          <div
            onMouseDown={handleResize('s')}
            style={{
              position: 'absolute', bottom: -HANDLE_SIZE, left: 0, right: HANDLE_HIT,
              height: HANDLE_HIT, cursor: 'ns-resize', zIndex: 10,
            }}
          />
        </>
      )}
    </motion.div>
  )
}
