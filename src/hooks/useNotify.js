import { useContext } from 'react'
import { NotificationContext } from '../lib/notificationContext.js'

const noop = () => {}
const fallbackCtx = { notify: noop, dismiss: noop, clearAll: noop, toasts: [], panelOpen: false, setPanelOpen: noop }

export function useNotify() {
  const ctx = useContext(NotificationContext)
  return ctx || fallbackCtx
}
