import { useState, useCallback, useEffect, lazy, Suspense } from 'react'
import { AnimatePresence } from 'motion/react'
import { Terminal, Folder, User } from '@phosphor-icons/react'
import TopBar from './components/TopBar.jsx'
import Window from './components/Window.jsx'
import Dock from './components/Dock.jsx'
import Background from './components/Background.jsx'
import ActivitiesOverview from './components/ActivitiesOverview.jsx'
import ContextMenu from './components/ContextMenu.jsx'
import JsonLdInjector from './components/JsonLdInjector.jsx'
import { NotificationProvider } from './components/NotificationCenter.jsx'
import { useNotify } from './hooks/useNotify.js'
import WindowErrorBoundary from './components/ErrorBoundary.jsx'

const TerminalWindow = lazy(() => import('./components/Terminal.jsx'))
const ProjectWindow = lazy(() => import('./components/ProjectWindow.jsx'))
const AboutWindow = lazy(() => import('./components/AboutWindow.jsx'))

const windowConfigs = {
  terminal: { title: 'Terminal', component: TerminalWindow, width: 600, height: 400 },
  projects: { title: 'Projects', component: ProjectWindow, width: 660, height: 480 },
  about: { title: 'About', component: AboutWindow, width: 440, height: 500 },
}

const desktopIcons = [
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'about', label: 'About', icon: User },
]

function isMobile() {
  return window.innerWidth <= 640
}

const defaultPositions = {
  terminal: { left: 80, top: 60 },
  projects: { left: 240, top: 80 },
  about: { left: 140, top: 120 },
}

function loadPositions() {
  try {
    const saved = localStorage.getItem('window-positions')
    const base = saved ? { ...defaultPositions, ...JSON.parse(saved) } : defaultPositions
    if (isMobile()) {
      Object.keys(base).forEach(k => { base[k].left = 0; base[k].top = 0 })
    }
    return base
  } catch {
    return isMobile()
      ? { terminal: { left: 0, top: 0 }, projects: { left: 0, top: 0 }, about: { left: 0, top: 0 } }
      : defaultPositions
  }
}

function savePosition(id, { left, top }) {
  try {
    const current = JSON.parse(localStorage.getItem('window-positions') || '{}')
    current[id] = { left, top }
    localStorage.setItem('window-positions', JSON.stringify(current))
  // eslint-disable-next-line no-empty
  } catch {}
}

function WindowFallback() {
  return (
    <div className="p-4 space-y-3 skeleton-pulse" role="status" aria-label="Loading window content">
      <div className="flex items-center gap-1.5 pb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-warning)' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-success)' }} />
      </div>
      <div className="space-y-2.5">
        <div className="h-3 rounded" style={{ backgroundColor: 'var(--color-border)', width: '76%' }} />
        <div className="h-3 rounded" style={{ backgroundColor: 'var(--color-border)', width: '52%' }} />
        <div className="h-3 rounded" style={{ backgroundColor: 'var(--color-border)', width: '64%' }} />
        <div className="h-3 rounded" style={{ backgroundColor: 'var(--color-border)', width: '38%' }} />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

let nextZ = 101

function AppContent() {
  const [windows, setWindows] = useState({ terminal: true, projects: true, about: true })
  const [activeWindow, setActiveWindow] = useState('terminal')
  const [zIndices, setZIndices] = useState({ terminal: 100, projects: 99, about: 98 })
  const [positions] = useState(loadPositions)
  const [minimizedWindows, setMinimizedWindows] = useState({})
  const [overviewOpen, setOverviewOpen] = useState(false)
  const [contextMenu, setContextMenu] = useState(null)
  const notify = useNotify()

  useEffect(() => {
    const welcomed = sessionStorage.getItem('welcomed')
    if (!welcomed) {
      notify('Welcome to Nikodem\'s dev desktop. Press Super+1-3 to switch windows.', { duration: 5000 })
      sessionStorage.setItem('welcomed', 'true')
    }
  }, [notify])

  const openWindow = useCallback((id) => {
    setWindows(prev => ({ ...prev, [id]: true }))
    setActiveWindow(id)
    setZIndices(prev => {
      nextZ++
      return { ...prev, [id]: nextZ }
    })
    if (isMobile()) {
      setTimeout(() => {
        document.getElementById(`window-${id}`)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [])

  const minimizeWindow = useCallback((id) => {
    setMinimizedWindows(prev => ({ ...prev, [id]: true }))
    setActiveWindow(prev => prev === id ? null : prev)
  }, [])

  const restoreWindow = useCallback((id) => {
    setMinimizedWindows(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setActiveWindow(id)
    setZIndices(prev => {
      nextZ++
      return { ...prev, [id]: nextZ }
    })
  }, [])

  const closeWindow = useCallback((id) => {
    setWindows(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setMinimizedWindows(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setActiveWindow(prev => prev === id ? null : prev)
  }, [])

  const focusWindow = useCallback((id) => {
    setActiveWindow(id)
    setZIndices(prev => {
      nextZ++
      return { ...prev, [id]: nextZ }
    })
  }, [])

  const handlePositionChange = useCallback((id, pos) => {
    savePosition(id, pos)
  }, [])

  const handleContextAction = useCallback((action) => {
    if (action === 'terminal' || action === 'projects' || action === 'about') {
      openWindow(action)
    } else if (action === 'arrange') {
      notify('Windows arranged. Drag them to reposition.', { duration: 3000 })
    }
  }, [openWindow, notify])

  useEffect(() => {
    function handler(e) {
      if (e.button === 2) {
        const target = e.target
        const isDesktop = target?.id === 'main-content' || target?.closest?.('#main-content') === target
        if (isDesktop) {
          e.preventDefault()
          setContextMenu({ x: e.clientX, y: e.clientY })
        }
      }
    }
    document.addEventListener('contextmenu', handler)
    return () => document.removeEventListener('contextmenu', handler)
  }, [])

  useEffect(() => {
    function handler(e) {
      if (e.key === 'Escape') {
        if (overviewOpen) { setOverviewOpen(false); return }
        if (activeWindow) {
          e.preventDefault()
          closeWindow(activeWindow)
          return
        }
      }

      const mod = e.metaKey || e.ctrlKey
      if (!mod || e.shiftKey) return

      if (e.key === 'Tab') {
        e.preventDefault()
        const ids = Object.keys(windows)
        if (ids.length === 0) return
        const idx = ids.indexOf(activeWindow)
        const next = ids[(idx + 1) % ids.length]
        if (minimizedWindows[next]) {
          restoreWindow(next)
        } else {
          focusWindow(next)
        }
        return
      }

      const numMap = { '1': 'terminal', '2': 'projects', '3': 'about' }
      const target = numMap[e.key]
      if (target) {
        e.preventDefault()
        if (minimizedWindows[target]) {
          restoreWindow(target)
        } else if (windows[target]) {
          focusWindow(target)
        } else {
          openWindow(target)
        }
        return
      }

      if (e.key === 'w' && activeWindow) {
        e.preventDefault()
        closeWindow(activeWindow)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeWindow, windows, minimizedWindows, overviewOpen, focusWindow, openWindow, closeWindow, restoreWindow])

  const visibleWindows = Object.keys(windows).filter(id => !minimizedWindows[id])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'var(--color-bg)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 36,
      }}
    >
      <a href="#main-content" className="skip-link" aria-label="Skip to main content">
        Skip to content
      </a>

      <Background />

      <h1
        className="sr-only"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        Nikodem Boryczka — AI Developer & Software Engineer Portfolio — Ubuntu desktop simulator
      </h1>

      <TopBar
        onActivitiesClick={() => setOverviewOpen(true)}
        minimizedWindows={minimizedWindows}
      />

      <main
        id="main-content"
        tabIndex={-1}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <AnimatePresence>
          {visibleWindows.map(id => {
            const config = windowConfigs[id]
            const Component = config.component
            return (
              <div key={id} id={`window-${id}`} style={isMobile() ? { position: 'fixed', inset: 0, zIndex: zIndices[id], paddingTop: 36 } : undefined}>
                <Window
                  id={id}
                  title={config.title}
                  isActive={activeWindow === id}
                  onFocus={() => focusWindow(id)}
                  onClose={closeWindow}
                  onMinimize={minimizeWindow}
                  onPositionChange={handlePositionChange}
                  width={config.width}
                  height={config.height}
                  style={isMobile() ? { left: 0, top: 0, zIndex: zIndices[id] } : { ...positions[id], zIndex: zIndices[id] }}
                >
                  <WindowErrorBoundary title={config.title}>
                    <Suspense fallback={<WindowFallback />}>
                      <Component />
                    </Suspense>
                  </WindowErrorBoundary>
                </Window>
              </div>
            )
          })}
        </AnimatePresence>

        {!isMobile() && (
          <nav className="desktop-sidebar" aria-label="Desktop shortcuts" style={{
            position: 'absolute',
            left: 12,
            top: 16,
            zIndex: 'var(--z-desktop-icons)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}>
            {desktopIcons.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => openWindow(item.id)}
                  className={`desktop-icon flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all cursor-pointer text-center ${windows[item.id] ? 'active' : ''}`}
                  style={{
                    color: windows[item.id] ? 'var(--color-accent-bright)' : 'var(--color-text-dim)',
                    width: 68,
                  }}
                  aria-label={`Open ${item.label}`}
                >
                  <Icon size={24} weight={windows[item.id] ? 'fill' : 'regular'} />
                  <span className="text-[10px] font-medium leading-tight truncate w-full">{item.label}</span>
                </button>
              )
            })}
          </nav>
        )}

        <Dock
          onOpen={(id) => {
            if (minimizedWindows[id]) {
              restoreWindow(id)
            } else if (windows[id]) {
              focusWindow(id)
            } else {
              openWindow(id)
            }
          }}
          openWindows={Object.keys(windows)}
          minimizedWindows={minimizedWindows}
        />
      </main>

      <ActivitiesOverview
        open={overviewOpen}
        windows={windows}
        minimizedWindows={minimizedWindows}
        onOpen={(id) => {
          if (minimizedWindows[id]) {
            restoreWindow(id)
          } else {
            openWindow(id)
          }
        }}
        onFocus={focusWindow}
        onClose={closeWindow}
        onCloseOverview={() => setOverviewOpen(false)}
      />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onAction={handleContextAction}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <NotificationProvider>
      <JsonLdInjector />
      <AppContent />
    </NotificationProvider>
  )
}
