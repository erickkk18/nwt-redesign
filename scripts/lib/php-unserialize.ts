// Facts:
// 1. Called by scripts/migrate.ts when parsing `trx_addons_options` postmeta
//    (PHP-serialized arrays produced by TRX Addons for cpt_team / cpt_services).
// 2. Glob: scripts/** under nwt-payload/ returned No files found before this write.
// 3. Pure parser. Input example:
//      a:2:{s:5:"email";s:17:"jane@example.com";s:5:"phone";s:12:"555-555-5555";}
//    Output: { email: "jane@example.com", phone: "555-555-5555" }
// 4. User: "Extracts ACF fields from wp:postmeta key-value pairs using a helper
//    function" and "Handle missing/null ACF fields gracefully".

export type PhpValue =
  | null
  | boolean
  | number
  | string
  | PhpValue[]
  | { [key: string]: PhpValue }

interface Cursor {
  buf: Buffer
  pos: number
}

function expect(c: Cursor, ch: string): void {
  const got = String.fromCharCode(c.buf[c.pos])
  if (got !== ch) {
    throw new Error(
      `php-unserialize: expected "${ch}" at byte ${c.pos}, got "${got}"`,
    )
  }
  c.pos += 1
}

function readUntil(c: Cursor, ch: string): string {
  const target = ch.charCodeAt(0)
  const start = c.pos
  while (c.pos < c.buf.length && c.buf[c.pos] !== target) {
    c.pos += 1
  }
  const out = c.buf.subarray(start, c.pos).toString('utf8')
  c.pos += 1
  return out
}

function readBytes(c: Cursor, len: number): string {
  const out = c.buf.subarray(c.pos, c.pos + len).toString('utf8')
  c.pos += len
  return out
}

function readValue(c: Cursor): PhpValue {
  if (c.pos >= c.buf.length) {
    return null
  }

  const tag = String.fromCharCode(c.buf[c.pos])
  c.pos += 1

  switch (tag) {
    case 'N': {
      expect(c, ';')
      return null
    }
    case 'b': {
      expect(c, ':')
      const v = readBytes(c, 1)
      expect(c, ';')
      return v === '1'
    }
    case 'i': {
      expect(c, ':')
      const numStr = readUntil(c, ';')
      return Number.parseInt(numStr, 10)
    }
    case 'd': {
      expect(c, ':')
      const numStr = readUntil(c, ';')
      return Number.parseFloat(numStr)
    }
    case 's': {
      expect(c, ':')
      const lenStr = readUntil(c, ':')
      const len = Number.parseInt(lenStr, 10)
      expect(c, '"')
      const out = readBytes(c, len)
      expect(c, '"')
      expect(c, ';')
      return out
    }
    case 'a': {
      expect(c, ':')
      const lenStr = readUntil(c, ':')
      const len = Number.parseInt(lenStr, 10)
      expect(c, '{')

      const entries: Array<[PhpValue, PhpValue]> = []
      for (let i = 0; i < len; i += 1) {
        const k = readValue(c)
        const v = readValue(c)
        entries.push([k, v])
      }
      expect(c, '}')

      const looksLikeArray = entries.every(
        ([k], idx) => typeof k === 'number' && k === idx,
      )
      if (looksLikeArray) {
        return entries.map(([, v]) => v)
      }
      const obj: { [key: string]: PhpValue } = {}
      for (const [k, v] of entries) {
        obj[String(k)] = v
      }
      return obj
    }
    default: {
      return null
    }
  }
}

export function phpUnserialize(input: string | null | undefined): PhpValue {
  if (input == null || input === '') {
    return null
  }
  const buf = Buffer.from(input, 'utf8')
  const cursor: Cursor = { buf, pos: 0 }
  try {
    return readValue(cursor)
  } catch {
    return null
  }
}

export function isPhpObject(
  v: PhpValue,
): v is { [key: string]: PhpValue } {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export function isPhpArray(v: PhpValue): v is PhpValue[] {
  return Array.isArray(v)
}

export function asString(v: PhpValue): string {
  return typeof v === 'string' ? v : ''
}
