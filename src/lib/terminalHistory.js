const history = []
const MAX_HISTORY = 100

export function pushHistory(cmd) {
  history.push(cmd)
  if (history.length > MAX_HISTORY) history.shift()
}

export function getHistory() {
  return [...history]
}

export function getHistoryLength() {
  return history.length
}
