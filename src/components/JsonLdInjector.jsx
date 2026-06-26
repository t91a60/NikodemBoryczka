import { useEffect } from 'react'
import { generateSupplementaryJsonLd } from '../lib/jsonLd.js'

export default function JsonLdInjector() {
  useEffect(() => {
    const schemas = generateSupplementaryJsonLd()
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'json-ld-supplementary'
    script.textContent = JSON.stringify(schemas, null, 2)
    document.head.appendChild(script)

    return () => {
      const existing = document.getElementById('json-ld-supplementary')
      if (existing) existing.remove()
    }
  }, [])

  return null
}
