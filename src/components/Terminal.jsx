import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { Terminal as TerminalIcon } from '@phosphor-icons/react'
import { parseAnsi } from '../lib/ansi.js'

const cmdHistory = []

const bootLines = [
  { text: 'EFI boot: starting Ubuntu 24.04 LTS', color: '--color-text-dim', delay: 200 },
  { text: 'kernel: Linux 6.8.0-generic #1 SMP PREEMPT_DYNAMIC', color: '--color-accent-purple', delay: 350 },
  { text: 'kernel: CPU: AMD Ryzen 7 - 8 cores / 16 threads', color: '--color-accent-purple', delay: 300 },
  { text: 'init: Starting GNOME Display Manager (pid 42)', color: '--color-success', delay: 400 },
  { text: 'systemd: Started User Manager for UID 1000', color: '--color-text-dim', delay: 250 },
  { text: 'gdm-pam: pam_unix(gdm-password:session) - session opened', color: '--color-accent-purple', delay: 350 },
  { text: '\x1b[32m✓\x1b[0m Welcome to Ubuntu 24.04 LTS - \x1b[33mnikodem@dev-desktop\x1b[0m', color: '--color-text', delay: 500 },
]

export default function Terminal() {
  const [lines, setLines] = useState([])
  const [input, setInput] = useState('')
  const [bootDone, setBootDone] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (currentLine < bootLines.length) {
      const timer = setTimeout(() => {
        setLines(prev => [...prev, {
          text: bootLines[currentLine].text,
          type: 'boot',
          color: bootLines[currentLine].color
        }])
        setCurrentLine(c => c + 1)
      }, bootLines[currentLine].delay)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setBootDone(true), 600)
      return () => clearTimeout(timer)
    }
  }, [currentLine])

  useEffect(() => {
    if (bootDone && inputRef.current) {
      inputRef.current.focus()
    }
  }, [bootDone])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  function handleCommand(cmd) {
    const trimmed = cmd.trim()
    const lower = trimmed.toLowerCase()

    if (!trimmed) {
      setLines(prev => [...prev, { text: '$ ', type: 'input' }])
      return
    }

    cmdHistory.push(trimmed)
    setHistoryIndex(-1)
    window.__terminalHistory = cmdHistory

    const newLines = [...lines, { text: `$ ${cmd}`, type: 'input' }]

    if (lower === 'clear') {
      setLines([])
      return
    }

    const output = commands[lower]
    if (output) {
      const result = typeof output === 'function' ? output() : output
      setLines([...newLines, { text: result, type: 'output' }])
    } else if (lower.startsWith('echo ')) {
      setLines([...newLines, { text: cmd.slice(5), type: 'output' }])
    } else {
      setLines([...newLines, {
        text: `\x1b[91mcommand not found\x1b[0m: ${lower}. Try \x1b[33mhelp\x1b[0m`,
        type: 'output'
      }])
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!input.trim()) return
    handleCommand(input)
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length === 0) return
      const idx = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(idx)
      setInput(cmdHistory[idx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const idx = historyIndex + 1
      if (idx >= cmdHistory.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(idx)
        setInput(cmdHistory[idx])
      }
    }
  }

  return (
    <div
      className="flex flex-col h-full font-mono text-sm"
      style={{ backgroundColor: '#120a10' }}
      onClick={() => inputRef.current?.focus()}
      role="terminal"
      aria-label="Terminal emulator"
    >
      <div
        className="flex items-center gap-2 px-4 py-1.5 text-[11px] border-b select-none"
        style={{
          backgroundColor: '#1a0e18',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-dim)',
        }}
      >
        <TerminalIcon size={12} weight="fill" style={{ color: 'var(--color-accent)' }} />
        <span>nikodem@dev-desktop: ~</span>
        <div className="flex-1" />
        <span style={{ color: 'var(--color-success)' }}>&#9679;</span>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4"
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        <div className="space-y-1">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -2 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.12, ease: [0.23, 1, 0.32, 1] }}
            >
              {line.type === 'boot' && (
                <pre className="text-[13px] leading-relaxed whitespace-pre-wrap font-mono">
                  {parseAnsi(line.text).map((part, j) => (
                    <span key={j} style={part.style}>{part.text}</span>
                  ))}
                </pre>
              )}
              {line.type === 'input' && (
                <span className="text-[13px]" style={{ color: 'var(--color-success)' }}>
                  {line.text}
                </span>
              )}
              {line.type === 'output' && (
                <pre className="text-[13px] leading-relaxed whitespace-pre-wrap font-mono">
                  {parseAnsi(line.text).map((part, j) => (
                    <span key={j} style={part.style}>{part.text}</span>
                  ))}
                </pre>
              )}
            </motion.div>
          ))}
          {bootDone && (
            <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
              <span style={{ color: 'var(--color-success)', fontSize: 13 }}>$</span>
              <input
                ref={inputRef}
                id="terminal-input"
                name="terminal-command"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none border-none text-[13px]"
                style={{ color: 'var(--color-text)', caretColor: 'var(--color-accent)' }}
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
            </form>
          )}
          {!bootDone && (
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-block w-2 h-[14px] animate-pulse" style={{ backgroundColor: 'var(--color-accent)' }} />
              <span className="text-[11px]" style={{ color: 'var(--color-text-dim)' }}>Booting system...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const commands = {
  help: () =>
    '\x1b[33mAvailable commands:\x1b[0m\n' +
    '  \x1b[32mhelp\x1b[0m      Show this message\n' +
    '  \x1b[32mprojects\x1b[0m  List projects\n' +
    '  \x1b[32mabout\x1b[0m     About me\n' +
    '  \x1b[32mcontact\x1b[0m   Contact info\n' +
    '  \x1b[32mclear\x1b[0m     Clear terminal\n' +
    '  \x1b[32mhistory\x1b[0m   Command history\n' +
    '  \x1b[32mecho\x1b[0m      Print text\n' +
    '  \x1b[32mwhoami\x1b[0m    Display current user\n' +
    '  \x1b[32mls\x1b[0m        List directory\n' +
    '  \x1b[32mdate\x1b[0m      Current date\n' +
    '  \x1b[32mneofetch\x1b[0m  System info',

  whoami: 'nikodem',
  date: () => new Date().toLocaleString('pl-PL'),
  ls: '\x1b[36mDocuments/\x1b[0m  \x1b[36mProjects/\x1b[0m  \x1b[36mAbout/\x1b[0m  \x1b[36mContact/\x1b[0m  \x1b[33mREADME.md\x1b[0m',

  about: () =>
    '\x1b[1;37mNikodem Boryczka\x1b[0m\n' +
    '\x1b[33mAI Developer & Software Engineer\x1b[0m\n' +
    'Student, technikum programistyczne (AI)\n' +
    'Silesia, Poland\n' +
    '\nOpen-source builder. I build things that work.',

  contact: () =>
    '\x1b[34mgithub\x1b[0m  \x1b[36mt91a60\x1b[0m\n' +
    '\x1b[34memail\x1b[0m   \x1b[36mnikodem\x1b[33m@\x1b[36mexample.com\x1b[0m',

  projects: () =>
    '\x1b[1;33mProjects:\x1b[0m\n' +
    '  \x1b[32mOSP Logbook\x1b[0m    \x1b[36mFlask\x1b[0m/\x1b[36mPostgreSQL\x1b[0m/\x1b[36mDocker\x1b[0m\n' +
    '  \x1b[32mAlkoRater\x1b[0m      \x1b[36mPWA\x1b[0m/\x1b[36mJavaScript\x1b[0m/\x1b[36miOS\x1b[0m\n' +
    '  \x1b[32mGather\x1b[0m        \x1b[36mFastAPI\x1b[0m/\x1b[36mPostgreSQL\x1b[0m/\x1b[36mRedis\x1b[0m\n' +
    '  \x1b[32mUPM Ultras\x1b[0m     \x1b[36mHTML\x1b[0m/\x1b[36mCSS\x1b[0m/\x1b[36mStatic Site\x1b[0m\n' +
    'Type \x1b[33mopen &lt;name&gt;\x1b[0m for details.',

  history: () => {
    const h = window.__terminalHistory || []
    return h.length
      ? h.map((c, i) => `${String(i + 1).padStart(3)}  ${c}`).join('\n')
      : '\x1b[90mno commands in history\x1b[0m'
  },

  neofetch: () =>
    '\x1b[1;33m          .-/+ooo+/--.            \x1b[0m\x1b[1;37mnikodem@dev-desktop\x1b[0m\n' +
    '\x1b[33m      .:+ooooooooooo+/-          \x1b[0m\x1b[34mOS:\x1b[0m \x1b[36mUbuntu 24.04 LTS x86_64\x1b[0m\n' +
    '\x1b[33m    .+ooooooooooooooooo/.        \x1b[0m\x1b[34mHost:\x1b[0m \x1b[36mDev Machine v2.4\x1b[0m\n' +
    '\x1b[33m   /oooooooooooooooooooo+.       \x1b[0m\x1b[34mKernel:\x1b[0m \x1b[36mLinux 6.8.0-generic\x1b[0m\n' +
    '\x1b[33m  :ooooooooooooooooooooooo:      \x1b[0m\x1b[34mUptime:\x1b[0m \x1b[36m' + Math.floor(Math.random() * 999) + ' hours\x1b[0m\n' +
    '\x1b[32m -/ooooooooooooooooooooooo/-     \x1b[0m\x1b[34mDE:\x1b[0m \x1b[36mGNOME 46\x1b[0m\n' +
    '\x1b[32m:ooooooooooooooooooooooooooo:    \x1b[0m\x1b[34mShell:\x1b[0m \x1b[35mdev-portfolio 1.0\x1b[0m\n' +
    '\x1b[32m:ooooooooooooooooooooooooooo:    \x1b[0m\x1b[34mTerminal:\x1b[0m \x1b[36m/dev/tty1\x1b[0m\n' +
    '\x1b[32m -/ooooooooooooooooooooooo/-     \x1b[0m\x1b[34mCPU:\x1b[0m \x1b[36mAMD Ryzen 7 (16) @ 4.2GHz\x1b[0m\n' +
    '\x1b[33m  :ooooooooooooooooooooooo:      \x1b[0m\x1b[34mMemory:\x1b[0m \x1b[36m' + (Math.floor(Math.random() * 8 + 12)) + 'GB / ' + (Math.floor(Math.random() * 4 + 28)) + 'GB\x1b[0m\n' +
    '\x1b[33m   /oooooooooooooooooooo+.       \x1b[0m\x1b[34mStack:\x1b[0m \x1b[36mPython Flask React PWA\x1b[0m\n' +
    '\x1b[33m    .+ooooooooooooooooo/.        \x1b[0m\n' +
    '\x1b[33m      .:+ooooooooooo+/-          \x1b[0m\x1b[35mMade with love by t91a60\x1b[0m\n' +
    '\x1b[33m          .-/+ooo+/--.            \x1b[0m',
}
