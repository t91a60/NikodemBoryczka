import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Terminal, Folder, User,
  WifiHigh, SpeakerHigh, BatteryFull, UserCircle, Bell, BellRinging,
} from '@phosphor-icons/react'
import { useNotify } from '../hooks/useNotify.js'
import TaskbarAppButton from './TaskbarAppButton.jsx'
import { Popup, WifiPopup, SpeakerPopup, BatteryPopup, UserPopup } from './popups/index.js'

const appMeta = {
  terminal: { icon: Terminal, label: 'Terminal' },
  projects: { icon: Folder, label: 'Projects' },
  about: { icon: User, label: 'About' },
}

export default function TopBar({
  onActivitiesClick,
  windows = {},
  minimizedWindows = {},
  activeWindow,
  onAppClick,
}) {
  const [time, setTime] = useState(new Date())
  const [openPopup, setOpenPopup] = useState(null)
  const { toasts } = useNotify()

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const toggle = useCallback((name) => setOpenPopup((prev) => (prev === name ? null : name)), [])
  const closePopup = useCallback(() => setOpenPopup(null), [])

  const openIds = Object.keys(windows).filter((id) => windows[id])
  const hasNotifications = toasts.length > 0

  return (
    <div className="top-bar" role="banner" aria-label="Desktop taskbar">
      <div className="topbar-left">
        <button
          className="activities-trigger"
          onClick={onActivitiesClick}
          aria-label="Activities overview"
        >
          <span className="activities-dots" aria-hidden="true">
            <span /><span /><span />
          </span>
          Activities
        </button>
      </div>

      <div className="topbar-center" role="toolbar" aria-label="Running applications">
        <AnimatePresence>
          {openIds.map((id) => {
            const meta = appMeta[id]
            if (!meta) return null
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: 'auto' }}
                exit={{ opacity: 0, scale: 0.8, width: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{ overflow: 'hidden', display: 'flex' }}
              >
                <TaskbarAppButton
                  id={id}
                  icon={meta.icon}
                  label={meta.label}
                  isActive={activeWindow === id}
                  isMinimized={!!minimizedWindows[id]}
                  onClick={() => onAppClick?.(id)}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <div className="topbar-right">
        <button
          className="topbar-clock"
          onClick={() => toggle('notifications')}
          aria-label={`Current time ${time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
        >
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </button>

        <div className="topbar-tray" role="toolbar" aria-label="System controls">
          <TrayItem>
            <TrayButton
              icon={hasNotifications ? BellRinging : Bell}
              active={hasNotifications}
              setActive={openPopup === 'notifications'}
              label="Notifications"
              onClick={() => toggle('notifications')}
            />
            <AnimatePresence>
              {openPopup === 'notifications' && (
                <Popup key="notif-popup" onClose={closePopup}>
                  <NotificationsPopup toasts={toasts} onClose={closePopup} />
                </Popup>
              )}
            </AnimatePresence>
          </TrayItem>

          <TraySeparator />

          <TrayItem>
            <TrayButton icon={WifiHigh} setActive={openPopup === 'wifi'} label="Wi-Fi" onClick={() => toggle('wifi')} />
            <AnimatePresence>
              {openPopup === 'wifi' && <Popup key="wifi-popup" onClose={closePopup}><WifiPopup /></Popup>}
            </AnimatePresence>
          </TrayItem>
          <TrayItem>
            <TrayButton icon={SpeakerHigh} setActive={openPopup === 'speaker'} label="Volume" onClick={() => toggle('speaker')} />
            <AnimatePresence>
              {openPopup === 'speaker' && <Popup key="speaker-popup" onClose={closePopup}><SpeakerPopup /></Popup>}
            </AnimatePresence>
          </TrayItem>
          <TrayItem>
            <TrayButton icon={BatteryFull} setActive={openPopup === 'battery'} label="Battery" onClick={() => toggle('battery')} />
            <AnimatePresence>
              {openPopup === 'battery' && <Popup key="battery-popup" onClose={closePopup}><BatteryPopup /></Popup>}
            </AnimatePresence>
          </TrayItem>

          <TraySeparator />

          <TrayItem>
            <TrayButton icon={UserCircle} setActive={openPopup === 'user'} label="User menu" onClick={() => toggle('user')} highlight />
            <AnimatePresence>
              {openPopup === 'user' && <Popup key="user-popup" onClose={closePopup}><UserPopup /></Popup>}
            </AnimatePresence>
          </TrayItem>
        </div>
      </div>
    </div>
  )
}

function TrayButton({ icon: Icon, active, setActive, label, onClick, highlight }) {
  return (
    <motion.button
      className="tray-btn"
      onClick={onClick}
      aria-label={label}
      aria-expanded={setActive || undefined}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        color: active
          ? 'var(--color-accent-bright)'
          : setActive
            ? 'var(--color-accent)'
            : highlight
              ? 'var(--color-accent)'
              : undefined,
      }}
    >
      <Icon size={14} weight={highlight ? 'duotone' : 'regular'} />
    </motion.button>
  )
}

function TrayItem({ children }) {
  return <div className="tray-item">{children}</div>
}

function TraySeparator() {
  return <div className="tray-sep" role="separator" aria-orientation="vertical" />
}

function NotificationsPopup({ toasts, onClose }) {
  if (!toasts || toasts.length === 0) {
    return (
      <div className="p-6 text-center">
        <Bell size={20} style={{ color: 'var(--color-text-dim)', margin: '0 auto 8px', display: 'block' }} />
        <div className="text-xs" style={{ color: 'var(--color-text-dim)' }}>No notifications</div>
      </div>
    )
  }
  return (
    <div className="py-1 min-w-[240px] max-h-[300px] overflow-y-auto">
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-dim)' }}>Notifications</span>
        <button
          className="text-[10px] font-medium cursor-pointer transition-colors"
          style={{ color: 'var(--color-accent)', background: 'none', border: 'none' }}
          onClick={() => onClose?.()}
        >
          Clear all
        </button>
      </div>
      {toasts.map((t, i) => (
        <div key={i} className="px-3 py-2 text-xs transition-colors popup-item" style={{ color: 'var(--color-text-muted)' }}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
