import { useLayoutEffect, useRef } from 'react'

export function useDismissableLayer(onClose) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const trigger = document.activeElement
    const layer = ref.current
    const focusable = layer?.querySelector('button, input, a[href], [tabindex="0"]')
    const target = focusable || layer
    target?.focus({ preventScroll: true })

    function onPointerDown(event) {
      if (trigger instanceof HTMLElement && trigger.contains(event.target)) return
      if (layer && !layer.contains(event.target)) onClose()
    }

    function onKeyDown(event) {
      if (document.querySelector('dialog[open]')) return
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopPropagation()
      onClose()
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown, true)
      if (layer?.contains(document.activeElement) && trigger instanceof HTMLElement && trigger.isConnected) trigger.focus()
    }
  }, [onClose])

  return ref
}
