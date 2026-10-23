import { useEffect, useRef } from 'react'

export function useModalDialog(open, returnFocusSelector) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!open || !dialog) return
    const trigger = returnFocusSelector ? document.querySelector(returnFocusSelector) : document.activeElement
    dialog.showModal()

    return () => {
      dialog.close()
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus()
    }
  }, [open, returnFocusSelector])

  return ref
}
