import { useState, useCallback, useEffect, lazy, Suspense } from 'react'
import { AnimatePresence } from 'motion/react'
import { Terminal, Folder, User } from '@phosphor-icons/react'
import TopBar from './components/TopBar.jsx'
import Window from './components/Window.jsx'
import Dock from './components/Dock.jsx'
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
  { id: 'about', label: 'About me', icon: User },
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
      Object.keys(base).forEach(k => { base[k].left = 12; base[k].top = 12 })
    }
    return base
  } catch {
    return isMobile() ? { terminal: { left: 12, top: 12 }, projects: { left: 12, top: 12 }, about: { left: 12, top: 12 } } : defaultPositions
  }
}

function savePosition(id, { left, top }) {
  try {
    const current = JSON.parse(localStorage.getItem('window-positions') || '{}')
    current[id] = { left, top }
    localStorage.setItem('window-positions', JSON.stringify(current))
  } catch {}
}

function WindowFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <span
        className="inline-block w-5 h-5 border-2 rounded-full animate-spin"
        style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-accent)' }}
      />
    </div>
  )
}

let nextZ = 101

export default function App() {
  const [windows, setWindows] = useState({ terminal: true, projects: true, about: true })
  const [activeWindow, setActiveWindow] = useState('terminal')
  const [zIndices, setZIndices] = useState({ terminal: 100, projects: 99, about: 98 })
  const [positions] = useState(loadPositions)

  const openWindow = useCallback((id) => {
    setWindows(prev => ({ ...prev, [id]: true }))
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

  useEffect(() => {
    function handler(e) {
      const mod = e.metaKey || e.ctrlKey
      if (!mod || e.shiftKey) return

      const numMap = { '1': 'terminal', '2': 'projects', '3': 'about' }
      const target = numMap[e.key]
      if (target) {
        e.preventDefault()
        if (windows[target]) {
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
  }, [activeWindow, windows, focusWindow, openWindow, closeWindow])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'var(--color-bg)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 36,
        background: `
          radial-gradient(ellipse 100% 70% at 20% 30%, rgba(233,84,32,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 60%, rgba(176,112,168,0.05) 0%, transparent 50%),
          radial-gradient(ellipse 40% 50% at 50% 90%, rgba(233,84,32,0.03) 0%, transparent 40%),
          linear-gradient(135deg, rgba(233,84,32,0.02) 0%, transparent 25%, rgba(176,112,168,0.02) 50%, transparent 75%, rgba(233,84,32,0.02) 100%),
          repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(255,255,255,0.005) 60px, rgba(255,255,255,0.005) 61px),
          repeating-linear-gradient(-45deg, transparent, transparent 60px, rgba(255,255,255,0.005) 60px, rgba(255,255,255,0.005) 61px),
          radial-gradient(circle at 50% 50%, rgba(233,84,32,0.03) 0%, transparent 70%)
        `,
      }}
    >
      <h1
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
        Nikodem Boryczka - Ubuntu desktop portfolio
      </h1>

      <TopBar />

      <div id="main-content" style={{ width: '100%', height: '100%', position: 'relative' }}>
        <AnimatePresence>
          {Object.keys(windows).map(id => {
            const config = windowConfigs[id]
            const Component = config.component
            return (
              <Window
                key={id}
                id={id}
                title={config.title}
                isActive={activeWindow === id}
                onFocus={() => focusWindow(id)}
                onClose={closeWindow}
                onPositionChange={handlePositionChange}
                width={config.width}
                height={config.height}
                style={{ ...positions[id], zIndex: zIndices[id] }}
              >
                <WindowErrorBoundary title={config.title}>
                  <Suspense fallback={<WindowFallback />}>
                    <Component />
                  </Suspense>
                </WindowErrorBoundary>
              </Window>
            )
          })}
        </AnimatePresence>

        <div className="desktop-sidebar" style={{
          position: 'absolute',
          left: 12,
          top: 16,
          zIndex: 'var(--z-desktop-icons)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
          {desktopIcons.map(item => {
            const Icon = item.icon
            const isOpen = windows[item.id]
            return (
              <button
                key={item.id}
                onClick={() => openWindow(item.id)}
                className={`desktop-icon flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all cursor-pointer text-left ${isOpen ? 'active' : ''}`}
                style={{
                  color: isOpen ? 'var(--color-accent-bright)' : 'var(--color-text-dim)',
                }}
              >
                <Icon size={16} weight={isOpen ? 'fill' : 'regular'} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>

        <Dock
          onOpen={(id) => {
            if (windows[id]) {
              focusWindow(id)
            } else {
              openWindow(id)
            }
          }}
          openWindows={Object.keys(windows)}
        />
      </div>
    </div>
  )
}
