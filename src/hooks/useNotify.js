import { useContext } from 'react'
import { NotificationContext } from '../lib/notificationContext.js'

export function useNotify() {
  return useContext(NotificationContext)
}
