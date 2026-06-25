const ANSI_COLORS = {
  '30': '#2b1a24', '31': '#c7162b', '32': '#0E8420',
  '33': '#F99B11', '34': '#3355ff', '35': '#a86aa0',
  '36': '#0ea0a0', '37': '#eee8ee', '90': '#6a5a66',
  '91': '#ff453a', '92': '#30d158', '93': '#ffd60a',
  '94': '#5a7aff', '95': '#d0a0c8', '96': '#40c8c8',
  '97': '#ffffff',
}

export function parseAnsi(text) {
  if (!text) return [{ text: '', style: {} }]
  const parts = []
  const regex = /\x1b\[([\d;]*)m/g // eslint-disable-line no-control-regex
  let lastIndex = 0
  let currentStyles = {}

  for (let match; (match = regex.exec(text)) !== null;) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), style: { ...currentStyles } })
    }
    const codes = match[1].split(';').filter(Boolean).map(Number)
    for (const code of codes) {
      if (code === 0) {
        currentStyles = {}
      } else if (code === 1) {
        currentStyles.fontWeight = 700
      } else if (code >= 30 && code <= 37) {
        currentStyles.color = ANSI_COLORS[String(code)]
      } else if (code >= 90 && code <= 97) {
        currentStyles.color = ANSI_COLORS[String(code)]
      }
    }
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), style: { ...currentStyles } })
  }

  return parts.length ? parts : [{ text, style: {} }]
}
