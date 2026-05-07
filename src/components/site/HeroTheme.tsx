// Facts:
// 1. Imported by routes whose first section is light (paper) so the global
//    Nav switches to ink text. Currently used by team/[slug]/page.tsx.
// 2. Glob: src/components/site/HeroTheme.tsx returned No files found.
// 3. No I/O. Client component. Mutates body.dataset.heroTheme on mount and
//    restores on unmount.
// 4. User: "make the header and footer global for all pages".

'use client'

import { useEffect } from 'react'

interface HeroThemeProps {
  value: 'dark' | 'light'
}

export function HeroTheme({ value }: HeroThemeProps) {
  useEffect(() => {
    const previous = document.body.dataset.heroTheme
    document.body.dataset.heroTheme = value
    return () => {
      if (previous === undefined) {
        delete document.body.dataset.heroTheme
      } else {
        document.body.dataset.heroTheme = previous
      }
    }
  }, [value])

  return null
}
