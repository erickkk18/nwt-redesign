// Facts:
// 1. Called by scripts/migrate.ts to convert WP `content:encoded` HTML into
//    Payload Lexical richText JSON (Posts.content, Pages ContentBlock.body,
//    Team.bio, Services.content).
// 2. Glob: **/html-to-lexical.ts under nwt-payload/ returned No files found.
// 3. Pure converter. Input: HTML string. Output: Lexical root JSON.
// 4. User: "wysiwyg → richText" / "Map every ACF field to the correct Payload field type"
//
// Pragmatic, lossy converter for the common WP/TinyMCE tag set: p, h1..h6,
// strong, em, u, a, ul, ol, li, br, blockquote, code, pre. Unknown tags are
// flattened to their text content. Output is valid Lexical JSON the editor
// will render and let editors refine.

import { parseDocument } from 'htmlparser2'
import type { Document, Element, Node, Text } from 'domhandler'

const FORMAT_BOLD = 1
const FORMAT_ITALIC = 1 << 1
const FORMAT_UNDERLINE = 1 << 3
const FORMAT_CODE = 1 << 4

interface LexicalTextNode {
  type: 'text'
  text: string
  format: number
  style: string
  mode: 'normal'
  detail: 0
  version: 1
}

interface LexicalLinkNode {
  type: 'link'
  fields: {
    linkType: 'custom'
    url: string
    newTab: boolean
  }
  format: ''
  indent: 0
  version: 1
  children: LexicalInlineNode[]
}

type LexicalInlineNode = LexicalTextNode | LexicalLinkNode

interface LexicalParagraphNode {
  type: 'paragraph'
  format: ''
  indent: 0
  version: 1
  children: LexicalInlineNode[]
  direction: 'ltr'
  textFormat: 0
  textStyle: ''
}

interface LexicalHeadingNode {
  type: 'heading'
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  format: ''
  indent: 0
  version: 1
  children: LexicalInlineNode[]
  direction: 'ltr'
}

interface LexicalListItemNode {
  type: 'listitem'
  value: number
  format: ''
  indent: 0
  version: 1
  children: LexicalInlineNode[]
  direction: 'ltr'
}

interface LexicalListNode {
  type: 'list'
  listType: 'bullet' | 'number'
  start: 1
  tag: 'ul' | 'ol'
  format: ''
  indent: 0
  version: 1
  children: LexicalListItemNode[]
  direction: 'ltr'
}

interface LexicalQuoteNode {
  type: 'quote'
  format: ''
  indent: 0
  version: 1
  children: LexicalInlineNode[]
  direction: 'ltr'
}

type LexicalBlockNode =
  | LexicalParagraphNode
  | LexicalHeadingNode
  | LexicalListNode
  | LexicalQuoteNode

export interface LexicalRoot {
  root: {
    type: 'root'
    format: ''
    indent: 0
    version: 1
    children: LexicalBlockNode[]
    direction: 'ltr'
  }
}

function makeText(text: string, format: number): LexicalTextNode {
  return {
    type: 'text',
    text,
    format,
    style: '',
    mode: 'normal',
    detail: 0,
    version: 1,
  }
}

function makeParagraph(children: LexicalInlineNode[]): LexicalParagraphNode {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    children: children.length > 0 ? children : [makeText('', 0)],
    direction: 'ltr',
    textFormat: 0,
    textStyle: '',
  }
}

function isElement(n: Node): n is Element {
  return n.type === 'tag' || n.type === 'script' || n.type === 'style'
}

function isText(n: Node): n is Text {
  return n.type === 'text'
}

function collectInline(
  nodes: Node[] | undefined,
  format: number,
): LexicalInlineNode[] {
  const out: LexicalInlineNode[] = []
  if (!nodes) return out

  for (const n of nodes) {
    if (isText(n)) {
      const text = (n.data ?? '').replace(/\s+/g, ' ')
      if (text.length === 0) continue
      out.push(makeText(text, format))
      continue
    }

    if (!isElement(n)) continue

    const tag = n.name.toLowerCase()
    switch (tag) {
      case 'br':
        out.push(makeText('\n', format))
        break
      case 'strong':
      case 'b':
        out.push(...collectInline(n.children, format | FORMAT_BOLD))
        break
      case 'em':
      case 'i':
        out.push(...collectInline(n.children, format | FORMAT_ITALIC))
        break
      case 'u':
        out.push(...collectInline(n.children, format | FORMAT_UNDERLINE))
        break
      case 'code':
        out.push(...collectInline(n.children, format | FORMAT_CODE))
        break
      case 'a': {
        const href = n.attribs?.href ?? '#'
        const target = n.attribs?.target
        out.push({
          type: 'link',
          fields: {
            linkType: 'custom',
            url: href,
            newTab: target === '_blank',
          },
          format: '',
          indent: 0,
          version: 1,
          children: collectInline(n.children, format),
        })
        break
      }
      case 'span':
      case 'small':
      case 'mark':
      case 'sub':
      case 'sup':
        out.push(...collectInline(n.children, format))
        break
      default:
        out.push(...collectInline(n.children, format))
    }
  }

  return out
}

function collectListItems(parent: Element): LexicalListItemNode[] {
  const items: LexicalListItemNode[] = []
  let value = 1
  for (const child of parent.children) {
    if (!isElement(child)) continue
    if (child.name.toLowerCase() !== 'li') continue
    const inline = collectInline(child.children, 0)
    items.push({
      type: 'listitem',
      value,
      format: '',
      indent: 0,
      version: 1,
      children: inline.length > 0 ? inline : [makeText('', 0)],
      direction: 'ltr',
    })
    value += 1
  }
  return items
}

function collectBlocks(nodes: Node[]): LexicalBlockNode[] {
  const out: LexicalBlockNode[] = []

  for (const n of nodes) {
    if (isText(n)) {
      const text = (n.data ?? '').trim()
      if (!text) continue
      out.push(makeParagraph([makeText(text, 0)]))
      continue
    }
    if (!isElement(n)) continue

    const tag = n.name.toLowerCase()
    switch (tag) {
      case 'p': {
        const inline = collectInline(n.children, 0)
        if (inline.length > 0) out.push(makeParagraph(inline))
        break
      }
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        out.push({
          type: 'heading',
          tag: tag as LexicalHeadingNode['tag'],
          format: '',
          indent: 0,
          version: 1,
          children: collectInline(n.children, 0),
          direction: 'ltr',
        })
        break
      case 'ul':
      case 'ol':
        out.push({
          type: 'list',
          listType: tag === 'ul' ? 'bullet' : 'number',
          start: 1,
          tag,
          format: '',
          indent: 0,
          version: 1,
          children: collectListItems(n),
          direction: 'ltr',
        })
        break
      case 'blockquote':
        out.push({
          type: 'quote',
          format: '',
          indent: 0,
          version: 1,
          children: collectInline(n.children, 0),
          direction: 'ltr',
        })
        break
      case 'pre':
        out.push(makeParagraph(collectInline(n.children, FORMAT_CODE)))
        break
      case 'div':
      case 'section':
      case 'article':
      case 'main':
      case 'aside':
      case 'figure':
      case 'header':
      case 'footer':
        out.push(...collectBlocks(n.children))
        break
      case 'br':
      case 'span':
      case 'a':
      case 'strong':
      case 'em':
      case 'b':
      case 'i':
      case 'u': {
        const inline = collectInline([n], 0)
        if (inline.length > 0) out.push(makeParagraph(inline))
        break
      }
      default:
        out.push(...collectBlocks(n.children))
    }
  }

  return out
}

export function emptyLexicalRoot(): LexicalRoot {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [makeParagraph([makeText('', 0)])],
      direction: 'ltr',
    },
  }
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function htmlToLexical(html: string | null | undefined): LexicalRoot {
  if (!html || html.trim().length === 0) {
    return emptyLexicalRoot()
  }

  const doc: Document = parseDocument(html, { decodeEntities: true })
  const blocks = collectBlocks(doc.children)
  const children =
    blocks.length > 0
      ? blocks
      : [makeParagraph([makeText(stripTags(html), 0)])]

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children,
      direction: 'ltr',
    },
  }
}
