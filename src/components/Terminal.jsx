import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { Terminal as TerminalIcon } from '@phosphor-icons/react'
import { parseAnsi } from '../lib/ansi.js'
import { pushHistory } from '../lib/terminalHistory.js'
import { commands, autoCompleteMap, bootLines } from '../data/commands.js'

export default function Terminal() {
  const [lines, setLines] = useState([])
  const [input, setInput] = useState('')
  const [bootDone, setBootDone] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [historyStack, setHistoryStack] = useState([])
  const [suggestions, setSuggestions] = useState([])
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
      const timer = setTimeout(() => setBootDone(true), 400)
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

  function getSuggestions(prefix) {
    if (!prefix) return []
    const lower = prefix.toLowerCase()
    return autoCompleteMap.filter(cmd => cmd.startsWith(lower)).slice(0, 5)
  }

  function handleCommand(cmd) {
    const trimmed = cmd.trim()
    const lower = trimmed.toLowerCase()

    if (!trimmed) {
      setLines(prev => [...prev, { text: '$ ', type: 'input' }])
      return
    }

    pushHistory(trimmed)
    setHistoryStack(prev => [...prev, trimmed])
    setHistoryIndex(-1)

    const newLines = [...lines, { text: `$ ${cmd}`, type: 'input' }]

    if (lower === 'clear') {
      setLines([])
      return
    }

    if (lower.startsWith('sudo ')) {
      const actual = lower.slice(5)
      if (commands[actual]) {
        const result = typeof commands[actual] === 'function' ? commands[actual]() : commands[actual]
        setLines([...newLines, { text: '\x1b[33m[sudo] password for nikodem:\x1b[0m', type: 'output' }, { text: '\x1b[32mOK\x1b[0m', type: 'output' }, { text: result, type: 'output' }])
      } else if (actual.startsWith('echo ')) {
        setLines([...newLines, { text: '\x1b[33m[sudo] password for nikodem:\x1b[0m', type: 'output' }, { text: '\x1b[32mOK\x1b[0m', type: 'output' }, { text: cmd.slice(5), type: 'output' }])
      } else {
        setLines([...newLines, {
          text: '\x1b[33m[sudo] password for nikodem:\x1b[0m',
          type: 'output'
        }, {
          text: '\x1b[91mSorry, try again.\x1b[0m',
          type: 'output'
        }])
      }
      return
    }

    if (lower.startsWith('echo ')) {
      setLines([...newLines, { text: cmd.slice(5), type: 'output' }])
      return
    }

    if (lower.startsWith('open ')) {
      const project = lower.slice(5).trim()
      const result = typeof commands.open === 'function' ? commands.open(project) : commands.open
      setLines([...newLines, { text: result, type: 'output' }])
      return
    }

    const output = commands[lower]
    if (output) {
      const result = typeof output === 'function' ? output() : output
      setLines([...newLines, { text: result, type: 'output' }])
    } else if (lower === 'ps') {
      setLines([...newLines, { text: '  PID TTY          TIME CMD\n 1000 pts/0    00:00:02 zsh\n 1001 pts/0    00:00:00 terminal-portfolio', type: 'output' }])
    } else if (lower.startsWith('ping ')) {
      const target = lower.slice(5) || 'localhost'
      setLines([...newLines, { text: `PING ${target} (127.0.0.1) 56(84) bytes of data.\n64 bytes from localhost (127.0.0.1): icmp_seq=1 ttl=64 time=0.023ms\n64 bytes from localhost (127.0.0.1): icmp_seq=2 ttl=64 time=0.018ms\n64 bytes from localhost (127.0.0.1): icmp_seq=3 ttl=64 time=0.021ms\n--- ${target} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2043ms`, type: 'output' }])
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
    setSuggestions([])
  }

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      if (suggestions.length > 0) {
        setInput(suggestions[0])
        setSuggestions([])
      }
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyStack.length === 0) return
      const idx = historyIndex === -1 ? historyStack.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(idx)
      setInput(historyStack[idx])
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const idx = historyIndex + 1
      if (idx >= historyStack.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(idx)
        setInput(historyStack[idx])
      }
      return
    }
  }

  function handleInputChange(e) {
    const val = e.target.value
    setInput(val)
    const lastWord = val.trim().split(/\s+/).pop() || ''
    if (lastWord && !val.includes(' ')) {
      setSuggestions(getSuggestions(lastWord))
    } else {
      setSuggestions([])
    }
  }

  return (
    <div
      className="flex flex-col h-full font-mono text-sm"
      style={{ backgroundColor: '#0d0810' }}
      onClick={() => inputRef.current?.focus()}
      role="terminal"
      aria-label="Terminal emulator"
    >
      <div
        className="flex items-center gap-2 px-4 py-1.5 text-[11px] border-b select-none"
        style={{
          backgroundColor: '#160a14',
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
        className="flex-1 overflow-y-auto p-3"
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        <div className="space-y-0.5">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -1 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.08, ease: [0.23, 1, 0.32, 1] }}
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
            <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1 relative">
              <span style={{ color: 'var(--color-success)', fontSize: 13 }}>$</span>
              <input
                ref={inputRef}
                id="terminal-input"
                name="terminal-command"
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none border-none text-[13px]"
                style={{ color: 'var(--color-text)', caretColor: 'var(--color-accent)' }}
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
              {suggestions.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: 0,
                    display: 'flex',
                    gap: 4,
                    padding: '4px 8px',
                    backgroundColor: 'rgba(22, 10, 24, 0.95)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 6,
                  }}
                >
                  {suggestions.map(s => (
                    <span
                      key={s}
                      style={{
                        fontSize: 11,
                        color: 'var(--color-accent)',
                        cursor: 'pointer',
                        padding: '1px 6px',
                        borderRadius: 3,
                      }}
                      onClick={() => { setInput(s); setSuggestions([]); inputRef.current?.focus() }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
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
