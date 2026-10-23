import { useState } from 'react'
import { MagnifyingGlass, Terminal, Folder, User, X } from '@phosphor-icons/react'
import { useModalDialog } from '../hooks/useModalDialog.js'

const apps = [
  { id: 'terminal', label: 'Terminal', icon: Terminal, desc: 'Command-line emulator with 20+ commands' },
  { id: 'projects', label: 'Projects', icon: Folder, desc: 'Browse portfolio projects and source code' },
  { id: 'about', label: 'About', icon: User, desc: 'Developer profile and system information' },
]

export default function ActivitiesOverview({ open, windows, minimizedWindows, onOpen, onCloseOverview }) {
  const [query, setQuery] = useState('')
  const dialogRef = useModalDialog(open)

  function closeOverview() {
    setQuery('')
    onCloseOverview()
  }

  const filtered = query
    ? apps.filter(app => `${app.label} ${app.desc}`.toLowerCase().includes(query.toLowerCase()))
    : apps

  return (
    <dialog
      ref={dialogRef}
      className="desktop-modal activities-overview"
      aria-label="Activities overview"
      onCancel={(event) => { event.preventDefault(); closeOverview() }}
    >
      <div className="overview-search">
        <MagnifyingGlass size={18} aria-hidden="true" />
        <input
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Type to search apps…"
          aria-label="Search applications"
        />
      </div>
      <div className="overview-apps" role="group" aria-label="Available applications">
        {filtered.map(app => {
          const Icon = app.icon
          const isOpen = !!windows[app.id]
          const isMinimized = isOpen && minimizedWindows?.[app.id]
          return (
            <button
              key={app.id}
              className="overview-app"
              data-open={isOpen || undefined}
              onClick={() => { onOpen(app.id); closeOverview() }}
              aria-label={`${app.label}: ${app.desc}${isMinimized ? ' (minimized)' : ''}`}
            >
              <Icon size={36} weight="duotone" aria-hidden="true" />
              <span className="overview-app-name">{app.label}</span>
              <span>{app.desc}</span>
              {isMinimized && <span className="overview-minimized">Minimized</span>}
            </button>
          )
        })}
      </div>
      {filtered.length === 0 && (
        <p role="status" className="p-4 text-sm">No applications match “{query}”. Try Terminal, Projects, or About.</p>
      )}
      <button className="overview-close" onClick={closeOverview} aria-label="Close activities overview">
        <X size={14} aria-hidden="true" />
        Close Overview
      </button>
    </dialog>
  )
}
