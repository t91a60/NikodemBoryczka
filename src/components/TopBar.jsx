import { useState, useEffect } from 'react'
import { WifiHigh, SpeakerHigh, BatteryFull, UserCircle, Bell, BellRinging } from '@phosphor-icons/react'
import { useNotify } from '../hooks/useNotify.js'
import { Popup, WifiPopup, SpeakerPopup, BatteryPopup, UserPopup } from './popups/index.js'

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
    <div className="top-bar" role="banner" aria-label="Top bar">
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

      <div className="flex items-center gap-3 font-mono text-sm tabular-nums" role="timer" aria-label="Current time" style={{ color: 'var(--color-text)' }}>
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </div>

      <div className="flex items-center gap-1" style={{ color: 'var(--color-text-dim)' }} role="toolbar" aria-label="System controls">
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
