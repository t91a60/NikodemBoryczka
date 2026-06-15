import { useState } from 'react'
import { projects } from '../data/projects'
import { motion, AnimatePresence } from 'motion/react'
import { GithubLogo, Code, Globe, Star, GitFork, Clock } from '@phosphor-icons/react'

const projectColors = {
  'osp-logbook': { primary: '#0E8420', bg: 'rgba(14,132,32,0.08)', border: 'rgba(14,132,32,0.2)' },
  'alkorater': { primary: '#3355ff', bg: 'rgba(51,85,255,0.08)', border: 'rgba(51,85,255,0.2)' },
  'upm-ultras': { primary: '#F99B11', bg: 'rgba(249,155,17,0.08)', border: 'rgba(249,155,17,0.2)' },
  'gather': { primary: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)' },
}

export default function ProjectWindow() {
  const [activeId, setActiveId] = useState(projects[0].id)
  const project = projects.find(p => p.id === activeId)
  const colors = projectColors[activeId] || projectColors['osp-logbook']

  return (
    <div className="flex h-full">
      <div
        className="w-44 shrink-0 overflow-y-auto flex flex-col"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
        }}
      >
        <div className="px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--color-text-dim)' }}>
          Projects
        </div>
        {projects.map(p => {
          const c = projectColors[p.id]
          const isActive = activeId === p.id
          return (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-left transition-all cursor-pointer"
              style={{
                color: isActive ? c.primary : 'var(--color-text-muted)',
                backgroundColor: isActive ? c.bg : 'transparent',
                borderLeft: isActive ? `2px solid ${c.primary}` : '2px solid transparent',
              }}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: c.primary }}
              />
              <div className="min-w-0">
                <span className="text-xs font-semibold block truncate">{p.title}</span>
                <span className="text-[10px]" style={{ color: 'var(--color-text-dim)' }}>{p.tech[0]}</span>
              </div>
            </button>
          )
        })}

        <div className="mt-auto px-3.5 py-2.5 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--color-text-dim)' }}>
            <GitFork size={12} />
            <span>4 repositories</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {project && (
            <motion.div
              key={project.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: colors.bg }}
                  >
                    <Code size={20} weight="duotone" style={{ color: colors.primary }} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                      {project.title}
                    </h2>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                      {project.description}
                    </p>
                  </div>
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    color: colors.primary,
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <GithubLogo size={14} weight="fill" />
                  Source
                </a>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tech.map(t => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      color: 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div
                className="rounded-xl p-4"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div className="flex items-center gap-2 pb-2.5 mb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <Star size={13} weight="fill" style={{ color: colors.primary }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>Highlights</span>
                </div>
                <div className="space-y-2.5">
                  {project.highlights.map(h => (
                    <div key={h} className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-sm"
                        style={{ backgroundColor: colors.primary }}
                      />
                      <span className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
