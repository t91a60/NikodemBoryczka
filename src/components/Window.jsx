import { motion, useDragControls, useMotionValue, useReducedMotion } from 'motion/react'
import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { X, Minus, ArrowsOutSimple, ArrowsInSimple, ArrowLeft } from '@phosphor-icons/react'
import { useCompactLayout } from '../hooks/useCompactLayout.js'
import { fitWindowPosition } from '../lib/windowLayout.js'

export default function Window({ id, title, children, isActive, onFocus, onClose, onMinimize, onPositionChange, style, width, height, layoutVersion = 0 }) {
  const mobile = useCompactLayout()
  const reducedMotion = useReducedMotion()
  const controls = useDragControls()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [size, setSize] = useState({ width, height, version: layoutVersion })
  const [maximizeState, setMaximizeState] = useState(null)
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [isResizing, setIsResizing] = useState(false)
  const originRef = useRef(null)
  const resizeCleanup = useRef(null)
  const maximized = maximizeState === layoutVersion
  const currentSize = size.version === layoutVersion ? size : { width, height }
  const bounds = { width: viewport.width, height: Math.max(0, viewport.height - 40 - 96) }
  const winWidth = Math.min(currentSize.width, Math.max(0, bounds.width - 24))
  const winHeight = Math.min(currentSize.height, bounds.height)
  const position = fitWindowPosition(style, winWidth, winHeight, bounds)

  useEffect(() => {
    function handleResize() {
      setViewport({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      resizeCleanup.current?.()
    }
  }, [])

  useLayoutEffect(() => {
    x.set(0)
    y.set(0)
  }, [position.left, position.top, layoutVersion, maximized, mobile, x, y])

  function toggleMaximize() {
    setMaximizeState(maximized ? null : layoutVersion)
  }

  const handleResize = useCallback((dir) => (event) => {
    if (mobile || maximized) return
    event.preventDefault()
    event.stopPropagation()
    onFocus()
    resizeCleanup.current?.()
    setIsResizing(true)
    const startX = event.clientX
    const startY = event.clientY
    const startW = winWidth
    const startH = winHeight

    function onMove(moveEvent) {
      setSize({
        width: dir.includes('e') ? Math.min(bounds.width - position.left, Math.max(320, startW + moveEvent.clientX - startX)) : startW,
        height: dir.includes('s') ? Math.min(bounds.height - position.top, Math.max(200, startH + moveEvent.clientY - startY)) : startH,
        version: layoutVersion,
      })
    }

    function cleanup() {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }

    function onUp() {
      setIsResizing(false)
      cleanup()
    }

    resizeCleanup.current = cleanup
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }, [mobile, maximized, onFocus, winWidth, winHeight, bounds.width, bounds.height, position.left, position.top, layoutVersion])

  function handleTitleKeyDown(event) {
    const steps = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] }
    const step = steps[event.key]
    if (!event.altKey || !step || mobile || maximized) return
    event.preventDefault()
    onPositionChange?.(id, fitWindowPosition({ left: position.left + step[0], top: position.top + step[1] }, winWidth, winHeight, bounds))
  }

  return (
    <motion.div
      className="desktop-window"
      role="region"
      aria-label={`${title} window`}
      inert={mobile && !isActive}
      drag={!mobile && !maximized && !isResizing}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{ left: -position.left, right: Math.max(0, bounds.width - winWidth - position.left), top: -position.top, bottom: Math.max(0, bounds.height - winHeight - position.top) }}
      onPointerDown={onFocus}
      onFocusCapture={onFocus}
      onDragStart={() => { originRef.current = position }}
      onDragEnd={(_, info) => {
        const origin = originRef.current || position
        onPositionChange?.(id, fitWindowPosition({ left: origin.left + info.offset.x, top: origin.top + info.offset.y }, winWidth, winHeight, bounds))
      }}
      initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.97 }}
      transition={{ duration: reducedMotion ? 0 : 0.18, ease: [0.23, 1, 0.32, 1] }}
      style={{
        x, y,
        left: mobile || maximized ? 0 : position.left,
        top: mobile || maximized ? 0 : position.top,
        width: mobile || maximized ? '100%' : winWidth,
        height: mobile ? 'calc(100% - 80px - env(safe-area-inset-bottom))' : maximized ? bounds.height : winHeight,
        border: '1px solid',
        borderColor: isActive ? 'var(--color-border-light)' : 'var(--color-border)',
        borderRadius: mobile || maximized ? 0 : 8,
        backgroundColor: 'var(--color-surface-window)',
        boxShadow: isActive ? '0 16px 48px rgba(0,0,0,0.5)' : '0 6px 24px rgba(0,0,0,0.3)',
        position: 'absolute',
        zIndex: style?.zIndex,
      }}
    >
      <div
        className="window-titlebar"
        style={{ backgroundColor: isActive ? 'var(--color-surface-elevated)' : 'var(--color-surface)', cursor: mobile || maximized ? 'default' : 'grab' }}
        tabIndex={0}
        aria-label={`${title} title bar. Alt and arrow keys move the window.`}
        onKeyDown={handleTitleKeyDown}
        onPointerDown={(event) => {
          if (!mobile && !maximized && !event.target.closest('button')) controls.start(event)
        }}
        onDoubleClick={(event) => {
          if (!mobile && !event.target.closest('button')) toggleMaximize()
        }}
      >
        {mobile && <button className="window-control" onClick={() => onClose(id)} aria-label={`Go back from ${title}`}><ArrowLeft size={16} /></button>}
        <span className="window-title">{title}</span>
        <div className="window-controls">
          <button className="window-control window-control-close" onClick={() => onClose(id)} aria-label={`Close ${title} window`}><X size={14} weight="bold" /></button>
          <button className="window-control" onClick={() => onMinimize(id)} aria-label={`Minimize ${title} window`}><Minus size={14} weight="bold" /></button>
          {!mobile && <button className="window-control" onClick={toggleMaximize} aria-label={`${maximized ? 'Restore' : 'Maximize'} ${title} window`}>
            {maximized ? <ArrowsInSimple size={14} /> : <ArrowsOutSimple size={14} />}
          </button>}
        </div>
      </div>
      <div className="window-content">{children}</div>
      {!maximized && !mobile && ['e', 's', 'se'].map(dir => (
        <div key={dir} className={`window-resize window-resize-${dir}`} onPointerDown={handleResize(dir)} aria-hidden="true" />
      ))}
    </motion.div>
  )
}
