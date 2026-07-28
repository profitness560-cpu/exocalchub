import { useEffect } from 'react'

const DEFAULT_TITLE = 'QuickCalcHub — Free Online Calculators'
const DEFAULT_DESCRIPTION =
  'Free online calculators for finance, health, math, and everyday use.'

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title

    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    )

    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }

    meta.content = description

    return () => {
      document.title = DEFAULT_TITLE

      if (meta) {
        meta.content = DEFAULT_DESCRIPTION
      }
    }
  }, [title, description])
}
