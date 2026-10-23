import { useSyncExternalStore } from 'react'

const query = '(max-width: 640px)'
const subscribe = (listener) => {
  const media = window.matchMedia(query)
  media.addEventListener('change', listener)
  return () => media.removeEventListener('change', listener)
}
const getSnapshot = () => window.matchMedia(query).matches

export function useCompactLayout() {
  return useSyncExternalStore(subscribe, getSnapshot)
}
