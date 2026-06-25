import { useState, useEffect, useRef } from 'react'
import { WifiHigh, SpeakerHigh, BatteryFull, UserCircle, SignOut, Bell, BellRinging } from '@phosphor-icons/react'
import { useNotify } from '../hooks/useNotify.js'

function Popup({ children, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      className="popup"
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 4,
        minWidth: 180,
        backgroundColor: '#1a0e18',
        border: '1px solid var(--color-border)',
        borderRadius: 10,
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 400,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  )
}

function WifiPopup() {
  const networks = ['Orange Fiber', 'Play 5G', 'Home Network', 'UPC WiFi']
  return (
    <div className="p-3 space-y-1 min-w-[200px]">
      <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-dim)' }}>Wi-Fi Networks</div>
      {networks.map(n => (
        <div key={n} className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors popup-item" style={{ color: 'var(--color-text-muted)' }}>
          <WifiHigh size={12} style={{ color: 'var(--color-accent)' }} />
          {n}
        </div>
      ))}
      <div className="pt-1.5 mt-1.5 border-t text-[11px] text-center" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-dim)' }}>
        Connected to <span style={{ color: 'var(--color-accent)' }}>Orange Fiber</span>
      </div>
    </div>
  )
}

function SpeakerPopup() {
  const [vol, setVol] = useState(75)
  return (
    <div className="p-4 min-w-[200px]">
      <div className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-dim)' }}>Volume</div>
      <div className="flex items-center gap-3">
        <SpeakerHigh size={16} style={{ color: 'var(--color-accent)' }} />
        <input
          type="range"
          min="0"
          max="100"
          value={vol}
          onChange={e => setVol(e.target.value)}
          style={{
            flex: 1, height: 4, appearance: 'none',
            background: `linear-gradient(to right, var(--color-accent) ${vol}%, var(--color-border) ${vol}%)`,
            borderRadius: 2, outline: 'none', cursor: 'pointer',
          }}
        />
        <span className="text-xs font-mono" style={{ color: 'var(--color-text-dim)', minWidth: 32, textAlign: 'right' }}>{vol}%</span>
      </div>
    </div>
  )
}

function BatteryPopup() {
  return (
    <div className="p-4 min-w-[180px]">
      <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-dim)' }}>Battery</div>
      <div className="flex items-center gap-3 mb-2">
        <BatteryFull size={20} weight="fill" style={{ color: 'var(--color-success)' }} />
        <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>87%</span>
      </div>
      <div className="text-[11px]" style={{ color: 'var(--color-text-dim)' }}>Charging (2h 14m until full)</div>
    </div>
  )
}

function UserPopup() {
  return (
    <div className="py-1 min-w-[160px]">
      <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>nikodem</div>
        <div className="text-[10px]" style={{ color: 'var(--color-text-dim)' }}>nikodem@dev-desktop</div>
      </div>
      <button className="flex items-center gap-2 w-full px-3 py-2 text-xs cursor-pointer transition-colors popup-item" style={{ color: 'var(--color-text-muted)' }}>
        <SignOut size={14} />
        Lock / Log Out
      </button>
    </div>
  )
}

export default function TopBar({ onActivitiesClick, minimizedWindows }) {
  const [time, setTime] = useState(new Date())
  const [openPopup, setOpenPopup] = useState(null)
  const { toasts } = useNotify()

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const toggle = (name) => setOpenPopup(prev => prev === name ? null : name)

  const hasNotifications = toasts.length > 0
  const minimizedCount = minimizedWindows ? Object.keys(minimizedWindows).length : 0

  return (
    <div className="top-bar">
      <div className="flex items-center gap-2">
        <div
          className="desktop-only flex items-center gap-2 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer activities-btn"
          style={{ color: 'var(--color-text-muted)' }}
          onClick={onActivitiesClick}
          role="button"
          tabIndex={0}
          aria-label="Activities overview"
          onKeyDown={e => { if (e.key === 'Enter') onActivitiesClick?.() }}
        >
          Activities
        </div>
        {minimizedCount > 0 && (
          <span className="desktop-only text-[10px]" style={{ color: 'var(--color-text-dim)' }}>
            {minimizedCount} minimized
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 font-mono text-sm tabular-nums" style={{ color: 'var(--color-text)' }}>
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </div>

      <div className="flex items-center gap-1" style={{ color: 'var(--color-text-dim)' }}>
        <div className="relative">
          <button onClick={() => toggle('wifi')} className="flex items-center justify-center p-1.5 rounded transition-colors cursor-pointer topbar-icon-btn" style={{ color: openPopup === 'wifi' ? 'var(--color-accent)' : undefined }}
            aria-label="Wi-Fi settings"
          >
            <WifiHigh size={14} />
          </button>
          {openPopup === 'wifi' && <Popup onClose={() => setOpenPopup(null)}><WifiPopup /></Popup>}
        </div>

        <div className="relative">
          <button onClick={() => toggle('speaker')} className="flex items-center justify-center p-1.5 rounded transition-colors cursor-pointer topbar-icon-btn"
            aria-label="Volume settings"
          >
            <SpeakerHigh size={14} />
          </button>
          {openPopup === 'speaker' && <Popup onClose={() => setOpenPopup(null)}><SpeakerPopup /></Popup>}
        </div>

        <div className="relative">
          <button onClick={() => toggle('battery')} className="flex items-center justify-center p-1.5 rounded transition-colors cursor-pointer topbar-icon-btn"
            aria-label="Battery status"
          >
            <BatteryFull size={14} />
          </button>
          {openPopup === 'battery' && <Popup onClose={() => setOpenPopup(null)}><BatteryPopup /></Popup>}
        </div>

        <div className="w-px h-4 mx-0.5" style={{ backgroundColor: 'var(--color-border)' }} />

        <div className="relative">
          <button
            onClick={() => toggle('notifications')}
            className="flex items-center justify-center p-1.5 rounded transition-colors cursor-pointer topbar-icon-btn"
            aria-label="Notifications"
            style={{ color: hasNotifications ? 'var(--color-accent-bright)' : undefined }}
          >
            {hasNotifications ? <BellRinging size={14} /> : <Bell size={14} />}
          </button>
        </div>

        <div className="relative">
          <button onClick={() => toggle('user')} className="flex items-center justify-center p-0.5 rounded transition-colors cursor-pointer topbar-icon-btn"
            style={{ color: openPopup === 'user' ? 'var(--color-accent-bright)' : 'var(--color-accent)' }}
            aria-label="User menu"
          >
            <UserCircle size={18} weight="duotone" />
          </button>
          {openPopup === 'user' && <Popup onClose={() => setOpenPopup(null)}><UserPopup /></Popup>}
        </div>
      </div>
    </div>
  )
}
