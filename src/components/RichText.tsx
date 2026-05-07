// Facts:
// 1. Called by detail routes (posts/[slug], team/[slug], services/[slug],
//    [slug]) and by components/blocks/BlockRenderer.tsx for ContentBlock /
//    TwoColumnBlock body fields.
// 2. Glob: src/components/RichText.tsx returned No files found.
// 3. Receives Lexical JSON (root + children). No file I/O.
//    Example input: { root: { type: 'root', children: [{ type: 'heading',
//    tag: 'h2', children: [{ type: 'text', text: '...' }] }] } }
// 4. User: "proceed" (continuing Phase 4 routing per prior summary).

import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import type { CSSProperties } from 'react'

interface RichTextProps {
  data: unknown
  className?: string
  style?: CSSProperties
}

export function RichText({ data, className, style }: RichTextProps) {
  if (!data || typeof data !== 'object') return null

  return (
    <div className={className} style={style}>
      <PayloadRichText
        data={data as Parameters<typeof PayloadRichText>[0]['data']}
      />
    </div>
  )
}
