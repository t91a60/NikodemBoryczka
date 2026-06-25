import { useEffect, useRef } from 'react'

export default function Background() {
  const canvasRef = useRef(null)
  const stateRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth <= 640
    const isLowPerf = isMobile || prefersReduced

    let animId
    let w, h

    function resize() {
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.scale(dpr, dpr)
    }

    const ACCENT = { r: 233, g: 84, b: 32 }
    const PURPLE = { r: 176, g: 112, b: 168 }

    function createBlob(seed) {
      return {
        x: w * (0.2 + seed * 0.15),
        y: h * (0.2 + seed * 0.2),
        vx: (Math.sin(seed * 50) * 0.06 + 0.01) * (isLowPerf ? 0 : 1),
        vy: (Math.cos(seed * 70) * 0.04 + 0.01) * (isLowPerf ? 0 : 1),
        radius: 180 + seed * 60,
        color: seed % 2 === 0 ? ACCENT : PURPLE,
        alpha: 0.05 + seed * 0.008,
      }
    }

    const blobCount = isLowPerf ? 3 : 5
    const blobs = Array.from({ length: blobCount }, (_, i) => createBlob(i))

    stateRef.current = { blobs, time: 0 }

    function render() {
      ctx.clearRect(0, 0, w, h)

      for (const blob of blobs) {
        if (!isLowPerf) {
          blob.x += blob.vx
          blob.y += blob.vy

          const m = blob.radius
          if (blob.x < -m || blob.x > w + m) blob.vx *= -1
          if (blob.y < -m || blob.y > h + m) blob.vy *= -1
          blob.x = Math.max(-m, Math.min(w + m, blob.x))
          blob.y = Math.max(-m, Math.min(h + m, blob.y))
        }

        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius)
        grad.addColorStop(0, `rgba(${blob.color.r},${blob.color.g},${blob.color.b},${blob.alpha})`)
        grad.addColorStop(0.5, `rgba(${blob.color.r},${blob.color.g},${blob.color.b},${blob.alpha * 0.3})`)
        grad.addColorStop(1, `rgba(${blob.color.r},${blob.color.g},${blob.color.b},0)`)

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!isLowPerf) {
        animId = requestAnimationFrame(render)
      }
    }

    resize()
    render()

    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  )
}
