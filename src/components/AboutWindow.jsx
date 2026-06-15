import { motion } from 'motion/react'
import { GithubLogo, MapPin, CalendarBlank, Brain, Terminal, Code, UserCircle, WifiHigh, HardDrives, Cpu } from '@phosphor-icons/react'

export default function AboutWindow() {
  const specs = [
    { icon: <UserCircle size={15} />, label: 'User', value: 'Nikodem Boryczka' },
    { icon: <Terminal size={15} />, label: 'Hostname', value: 'nikodem-dev-desktop' },
    { icon: <MapPin size={15} />, label: 'Location', value: 'Silesia, Poland' },
    { icon: <CalendarBlank size={15} />, label: 'Currently', value: 'Technikum programistyczne' },
    { icon: <Brain size={15} />, label: 'Focus', value: 'AI, Full-stack, Open source' },
    { icon: <GithubLogo size={15} />, label: 'GitHub', value: <a href="https://github.com/t91a60" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>t91a60</a> },
  ]

  const stack = ['Python', 'Flask', 'PostgreSQL', 'Docker', 'React', 'JavaScript', 'PWA', 'Linux', 'Git', 'TypeScript', 'Redis']

  return (
    <div className="flex flex-col h-full font-sans">
      <div
        className="flex items-center gap-4 px-5 py-4"
        style={{
          background: 'linear-gradient(135deg, rgba(233,84,32,0.06), rgba(176,112,168,0.04))',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-purple))',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(233,84,32,0.25)',
          }}
        >
          NB
        </div>
        <div>
          <p className="text-base font-bold" style={{ color: 'var(--color-text)' }}>Nikodem Boryczka</p>
          <p className="text-sm" style={{ color: 'var(--color-accent)' }}>AI Developer & Software Engineer</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-success)' }} />
            <span className="text-[11px]" style={{ color: 'var(--color-text-dim)' }}>Active</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="rounded-xl p-4 text-sm leading-relaxed"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
          >
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-dim)' }}>
              <Code size={14} />
              About me
            </div>
            Student at technikum programistyczne with AI specialization.
            Building open-source tools, web applications, and exploring
            software engineering and artificial intelligence.
            Based in Silesia, Poland.
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-dim)' }}>
              <HardDrives size={14} />
              System info
            </div>
            <div className="space-y-px">
              {specs.map((spec, i) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.04, duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <span style={{ color: 'var(--color-accent)' }}>{spec.icon}</span>
                  <span className="font-medium" style={{ color: 'var(--color-text-dim)' }}>{spec.label}</span>
                  <span className="ml-auto font-medium">{spec.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-dim)' }}>
              <Cpu size={14} />
              Dev stack
            </div>
            <div
              className="rounded-xl p-3.5"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <div className="flex flex-wrap gap-1.5">
                {stack.map((s, i) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 + i * 0.03, duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium"
                    style={{
                      backgroundColor: i % 2 === 0 ? 'rgba(233,84,32,0.08)' : 'rgba(176,112,168,0.08)',
                      color: i % 2 === 0 ? 'var(--color-accent)' : 'var(--color-accent-purple)',
                      border: `1px solid ${i % 2 === 0 ? 'rgba(233,84,32,0.15)' : 'rgba(176,112,168,0.15)'}`,
                    }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
