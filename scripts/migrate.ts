// Facts:
// 1. Run via package.json `migrate` script → `tsx scripts/migrate.ts`. Entry point.
//    Imports ../src/payload.config and ./lib/{php-unserialize,html-to-lexical}.
// 2. Glob: **/scripts/migrate.ts under nwt-payload/ returned No files found.
// 3. Reads WP_EXPORT_PATH (./wp-export/export.xml) and files under WP_UPLOADS_PATH.
//    WXR fields: wp:post_id (num), wp:post_type, wp:post_name (kebab-case),
//    wp:post_date_gmt "YYYY-MM-DD HH:MM:SS" → ISO-8601, postmeta key/value,
//    wp:author{id,login,email,display_name}, wp:category{term_id,nicename,parent},
//    wp:tag{term_id,slug,name}, <item>{title, content:encoded, dc:creator,
//    category[domain,nicename]}.
//    Writes to MongoDB via Payload Local API. Slugs kebab-case, dates ISO-8601,
//    idempotency keys wpUserId / wpTermId / wpAttachmentId / wpPostId.
// 4. User: "PHASE 2 — MIGRATION SCRIPT ... Inits Payload with local:true, parses
//    export.xml using fast-xml-parser, routes by wp:post_type, extracts ACF
//    fields from postmeta, creates via payload.create(), migrates media from
//    local uploads, logs progress, never crashes loop. Run with:
//    npx tsx scripts/migrate.ts"

import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { XMLParser } from 'fast-xml-parser'
import slugifyLib from 'slugify'
import mime from 'mime-types'
import { getPayload } from 'payload'
import type { Payload } from 'payload'

import config from '../src/payload.config'
import {
  phpUnserialize,
  isPhpObject,
  isPhpArray,
  asString,
  type PhpValue,
} from './lib/php-unserialize'
import { htmlToLexical } from './lib/html-to-lexical'

// -----------------------------------------------------------------------------
// Types — narrow representations of WXR shapes we read.
// -----------------------------------------------------------------------------

interface WxrAuthor {
  id: number
  login: string
  email: string
  displayName: string
  firstName: string
  lastName: string
}

interface WxrTerm {
  termId: number
  slug: string
  name: string
  parentSlug?: string
}

interface WxrCategoryRef {
  domain: string
  nicename: string
  text: string
}

interface WxrPostMeta {
  key: string
  value: string
}

interface WxrItem {
  postId: number
  postType: string
  postName: string
  status: string
  title: string
  contentHtml: string
  excerpt: string
  creator: string
  guid: string
  link: string
  postDateGmt: string
  postModifiedGmt: string
  postParent: number
  menuOrder: number
  attachmentUrl: string
  postmeta: WxrPostMeta[]
  categories: WxrCategoryRef[]
}

// -----------------------------------------------------------------------------
// Config and small helpers
// -----------------------------------------------------------------------------

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const PROJECT_ROOT = path.resolve(dirname, '..')
const DEFAULT_EXPORT_PATH = path.join(PROJECT_ROOT, 'wp-export', 'export.xml')
const DEFAULT_UPLOADS_PATH =
  'C:\\Users\\azerty\\Local Sites\\nwt\\app\\public\\wp-content\\uploads'

const exportPath = path.resolve(
  process.env.WP_EXPORT_PATH || DEFAULT_EXPORT_PATH,
)
const uploadsPath = path.resolve(
  process.env.WP_UPLOADS_PATH || DEFAULT_UPLOADS_PATH,
)

const SKIP_POST_TYPES = new Set<string>([
  'attachment', // handled separately
  'nav_menu_item',
  'elementor_library',
  'cpt_layouts',
  'adp-popup',
  'acf-field',
  'acf-field-group',
  'wp_global_styles',
  'mc4wp-form',
  'custom_css',
])

const log = {
  info: (msg: string) => console.log(`\x1b[36m[migrate]\x1b[0m ${msg}`),
  ok: (msg: string) => console.log(`\x1b[32m[migrate]\x1b[0m ${msg}`),
  warn: (msg: string) => console.log(`\x1b[33m[migrate]\x1b[0m ${msg}`),
  err: (msg: string, err?: unknown) => {
    const detail = err instanceof Error ? err.message : String(err ?? '')
    console.log(`\x1b[31m[migrate]\x1b[0m ${msg} ${detail}`)
  },
}

function slugify(input: string): string {
  return (
    slugifyLib(input || 'untitled', { lower: true, strict: true }) || 'untitled'
  )
}

function gmtToIso(gmt: string): string | undefined {
  if (!gmt || gmt.startsWith('0000')) return undefined
  return new Date(gmt.replace(' ', 'T') + 'Z').toISOString()
}

function toArray<T>(v: T | T[] | undefined): T[] {
  if (v == null) return []
  return Array.isArray(v) ? v : [v]
}

function getStr(v: unknown): string {
  if (v == null) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number') return String(v)
  if (typeof v === 'object' && '#text' in (v as Record<string, unknown>)) {
    return getStr((v as Record<string, unknown>)['#text'])
  }
  return ''
}

function getNum(v: unknown): number {
  const s = getStr(v).trim()
  return s === '' ? 0 : Number.parseInt(s, 10) || 0
}

function cdataOrText(v: unknown): string {
  if (v == null) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number') return String(v)
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>
    if (typeof o['#cdata'] === 'string') return o['#cdata']
    if (typeof o['#text'] === 'string') return o['#text']
  }
  return ''
}

// -----------------------------------------------------------------------------
// XML parsing
// -----------------------------------------------------------------------------

interface ParsedWxr {
  authors: WxrAuthor[]
  categories: WxrTerm[]
  tags: WxrTerm[]
  items: WxrItem[]
}

function parseWxr(xmlText: string): ParsedWxr {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    cdataPropName: '#cdata',
    parseTagValue: false,
    parseAttributeValue: false,
    trimValues: true,
    isArray: (name) =>
      [
        'item',
        'wp:author',
        'wp:category',
        'wp:tag',
        'wp:postmeta',
        'category',
      ].includes(name),
  })

  const parsed = parser.parse(xmlText) as Record<string, unknown>
  const channel = (parsed.rss as { channel?: Record<string, unknown> } | undefined)
    ?.channel
  if (!channel) {
    throw new Error('WXR parse error: <channel> not found')
  }

  const authors: WxrAuthor[] = toArray(channel['wp:author'] as unknown).map(
    (a) => {
      const o = a as Record<string, unknown>
      return {
        id: getNum(o['wp:author_id']),
        login: cdataOrText(o['wp:author_login']),
        email: cdataOrText(o['wp:author_email']),
        displayName: cdataOrText(o['wp:author_display_name']),
        firstName: cdataOrText(o['wp:author_first_name']),
        lastName: cdataOrText(o['wp:author_last_name']),
      }
    },
  )

  const categories: WxrTerm[] = toArray(channel['wp:category'] as unknown).map(
    (c) => {
      const o = c as Record<string, unknown>
      const parent = cdataOrText(o['wp:category_parent'])
      return {
        termId: getNum(o['wp:term_id']),
        slug: cdataOrText(o['wp:category_nicename']),
        name: cdataOrText(o['wp:cat_name']),
        parentSlug: parent && parent !== '' ? parent : undefined,
      }
    },
  )

  const tags: WxrTerm[] = toArray(channel['wp:tag'] as unknown).map((t) => {
    const o = t as Record<string, unknown>
    return {
      termId: getNum(o['wp:term_id']),
      slug: cdataOrText(o['wp:tag_slug']),
      name: cdataOrText(o['wp:tag_name']),
    }
  })

  const items: WxrItem[] = toArray(channel.item as unknown).map((it) => {
    const o = it as Record<string, unknown>
    const postmetas = toArray(o['wp:postmeta'] as unknown).map((m) => {
      const mo = m as Record<string, unknown>
      return {
        key: cdataOrText(mo['wp:meta_key']),
        value: cdataOrText(mo['wp:meta_value']),
      }
    })
    const cats = toArray(o.category as unknown).map((c) => {
      if (typeof c === 'string') {
        return { domain: 'category', nicename: '', text: c }
      }
      const co = c as Record<string, unknown>
      return {
        domain: getStr(co['@_domain']) || 'category',
        nicename: getStr(co['@_nicename']),
        text: cdataOrText(co),
      }
    })
    return {
      postId: getNum(o['wp:post_id']),
      postType: cdataOrText(o['wp:post_type']),
      postName: cdataOrText(o['wp:post_name']),
      status: cdataOrText(o['wp:status']),
      title: cdataOrText(o.title),
      contentHtml: cdataOrText(o['content:encoded']),
      excerpt: cdataOrText(o['excerpt:encoded']),
      creator: cdataOrText(o['dc:creator']),
      guid: cdataOrText(o.guid),
      link: cdataOrText(o.link),
      postDateGmt: cdataOrText(o['wp:post_date_gmt']),
      postModifiedGmt: cdataOrText(o['wp:post_modified_gmt']),
      postParent: getNum(o['wp:post_parent']),
      menuOrder: getNum(o['wp:menu_order']),
      attachmentUrl: cdataOrText(o['wp:attachment_url']),
      postmeta: postmetas,
      categories: cats,
    }
  })

  return { authors, categories, tags, items }
}

// -----------------------------------------------------------------------------
// Idempotent upsert helpers
// -----------------------------------------------------------------------------

type AnyDoc = { id: string | number }

async function findByWp<T extends AnyDoc = AnyDoc>(
  payload: Payload,
  collection: string,
  field: string,
  value: number,
): Promise<T | null> {
  if (!value) return null
  const res = await payload.find({
    collection: collection as Parameters<Payload['find']>[0]['collection'],
    where: { [field]: { equals: value } },
    limit: 1,
    depth: 0,
  })
  const doc = res.docs[0] as unknown as T | undefined
  return doc ?? null
}

// -----------------------------------------------------------------------------
// Postmeta utilities
// -----------------------------------------------------------------------------

function getMeta(metas: WxrPostMeta[], key: string): string {
  for (const m of metas) if (m.key === key) return m.value
  return ''
}

// -----------------------------------------------------------------------------
// Media migration helpers
// -----------------------------------------------------------------------------

function uploadsRelativePath(attachmentUrl: string): string | null {
  const marker = '/wp-content/uploads/'
  const idx = attachmentUrl.indexOf(marker)
  if (idx === -1) return null
  return attachmentUrl
    .slice(idx + marker.length)
    .split('?')[0]
    .replace(/\/+/g, '/')
}

function readAttachmentFile(
  attachmentUrl: string,
): { data: Buffer; filename: string; mimetype: string } | null {
  const rel = uploadsRelativePath(attachmentUrl)
  if (!rel) return null
  const abs = path.join(uploadsPath, ...rel.split('/'))
  if (!fs.existsSync(abs)) return null
  const data = fs.readFileSync(abs)
  const filename = path.basename(abs)
  const mimetype = mime.lookup(filename) || 'application/octet-stream'
  return { data, filename, mimetype }
}

// -----------------------------------------------------------------------------
// Phase A — Users
// -----------------------------------------------------------------------------

async function migrateUsers(
  payload: Payload,
  authors: WxrAuthor[],
): Promise<Map<number, string>> {
  const idMap = new Map<number, string>()
  log.info(`Phase A: ${authors.length} authors`)

  for (const a of authors) {
    if (!a.email) {
      log.warn(`  skipping author ${a.id} (${a.login}) — no email`)
      continue
    }
    try {
      const existing = await findByWp(payload, 'users', 'wpUserId', a.id)
      if (existing) {
        idMap.set(a.id, String(existing.id))
        log.info(`  ↻ user already migrated: ${a.email}`)
        continue
      }

      const tempPassword = `Wp${a.id}_${Math.random().toString(36).slice(2, 10)}!`
      const created = await payload.create({
        collection: 'users',
        data: {
          email: a.email,
          password: tempPassword,
          name:
            a.displayName ||
            [a.firstName, a.lastName].filter(Boolean).join(' ') ||
            a.login,
          role: 'editor',
          wpUserId: a.id,
        },
      })
      idMap.set(a.id, String(created.id))
      log.ok(`  + user ${a.email}`)
    } catch (err) {
      log.err(`  ! user ${a.email}:`, err)
    }
  }

  return idMap
}

// -----------------------------------------------------------------------------
// Phase B — Categories (2-pass)
// -----------------------------------------------------------------------------

async function migrateCategories(
  payload: Payload,
  cats: WxrTerm[],
): Promise<Map<number, string>> {
  const idMap = new Map<number, string>()
  const slugToTermId = new Map<string, number>()
  log.info(`Phase B: ${cats.length} categories`)

  for (const c of cats) {
    slugToTermId.set(c.slug, c.termId)
    try {
      const existing = await findByWp(payload, 'categories', 'wpTermId', c.termId)
      if (existing) {
        idMap.set(c.termId, String(existing.id))
        continue
      }
      const created = await payload.create({
        collection: 'categories',
        data: {
          title: c.name,
          slug: c.slug || slugify(c.name),
          wpTermId: c.termId,
        },
      })
      idMap.set(c.termId, String(created.id))
      log.ok(`  + category ${c.name}`)
    } catch (err) {
      log.err(`  ! category ${c.name}:`, err)
    }
  }

  for (const c of cats) {
    if (!c.parentSlug) continue
    const parentTermId = slugToTermId.get(c.parentSlug)
    const myId = idMap.get(c.termId)
    const parentId = parentTermId ? idMap.get(parentTermId) : undefined
    if (!myId || !parentId) continue
    try {
      await payload.update({
        collection: 'categories',
        id: myId,
        data: { parent: parentId },
      })
    } catch (err) {
      log.err(`  ! category parent ${c.name}:`, err)
    }
  }

  return idMap
}

// -----------------------------------------------------------------------------
// Phase C — Tags
// -----------------------------------------------------------------------------

async function migrateTags(
  payload: Payload,
  tags: WxrTerm[],
): Promise<Map<number, string>> {
  const idMap = new Map<number, string>()
  log.info(`Phase C: ${tags.length} tags`)
  for (const t of tags) {
    try {
      const existing = await findByWp(payload, 'tags', 'wpTermId', t.termId)
      if (existing) {
        idMap.set(t.termId, String(existing.id))
        continue
      }
      const created = await payload.create({
        collection: 'tags',
        data: {
          title: t.name,
          slug: t.slug || slugify(t.name),
          wpTermId: t.termId,
        },
      })
      idMap.set(t.termId, String(created.id))
      log.ok(`  + tag ${t.name}`)
    } catch (err) {
      log.err(`  ! tag ${t.name}:`, err)
    }
  }
  return idMap
}

// -----------------------------------------------------------------------------
// Phase D — Media
// -----------------------------------------------------------------------------

async function migrateMedia(
  payload: Payload,
  items: WxrItem[],
): Promise<Map<number, string>> {
  const idMap = new Map<number, string>()
  const attachments = items.filter((it) => it.postType === 'attachment')
  log.info(`Phase D: ${attachments.length} attachments`)

  let i = 0
  for (const a of attachments) {
    i += 1
    try {
      const existing = await findByWp(payload, 'media', 'wpAttachmentId', a.postId)
      if (existing) {
        idMap.set(a.postId, String(existing.id))
        continue
      }

      const file = readAttachmentFile(a.attachmentUrl)
      if (!file) {
        log.warn(
          `  [${i}/${attachments.length}] missing local file: ${a.attachmentUrl}`,
        )
        continue
      }

      const altMeta = getMeta(a.postmeta, '_wp_attachment_image_alt')
      const created = await payload.create({
        collection: 'media',
        file: {
          data: file.data,
          mimetype: file.mimetype,
          name: file.filename,
          size: file.data.length,
        },
        data: {
          alt: altMeta || a.title || file.filename,
          caption: a.excerpt,
          wpAttachmentId: a.postId,
          wpSourceUrl: a.attachmentUrl,
        },
      })
      idMap.set(a.postId, String(created.id))
      if (i % 25 === 0) {
        log.info(`  [${i}/${attachments.length}] media so far`)
      }
    } catch (err) {
      log.err(`  ! attachment ${a.postId}:`, err)
    }
  }

  log.ok(`  media migrated: ${idMap.size}`)
  return idMap
}

// -----------------------------------------------------------------------------
// Posts / Pages / Team / Services helpers
// -----------------------------------------------------------------------------

interface TermMaps {
  users: Map<number, string>
  categories: Map<number, string>
  tags: Map<number, string>
  media: Map<number, string>
}

function categoriesByDomain(
  refs: WxrCategoryRef[],
  domain: 'category' | 'post_tag',
  termIdBySlug: Map<string, number>,
  idMap: Map<number, string>,
): string[] {
  const out: string[] = []
  for (const r of refs) {
    if (r.domain !== domain) continue
    const termId = termIdBySlug.get(r.nicename)
    if (!termId) continue
    const id = idMap.get(termId)
    if (id) out.push(id)
  }
  return out
}

function findAuthorByLogin(
  authors: WxrAuthor[],
  login: string,
): WxrAuthor | undefined {
  return authors.find((a) => a.login === login || a.displayName === login)
}

function readSeo(metas: WxrPostMeta[]): {
  metaTitle?: string
  metaDescription?: string
} {
  const seo: { metaTitle?: string; metaDescription?: string } = {}
  const t = getMeta(metas, '_yoast_wpseo_title')
  const d = getMeta(metas, '_yoast_wpseo_metadesc')
  if (t) seo.metaTitle = t
  if (d) seo.metaDescription = d
  return seo
}

// -----------------------------------------------------------------------------
// Phase E — Posts
// -----------------------------------------------------------------------------

async function migratePosts(
  payload: Payload,
  items: WxrItem[],
  authors: WxrAuthor[],
  termIdBySlug: { categories: Map<string, number>; tags: Map<string, number> },
  maps: TermMaps,
): Promise<void> {
  const posts = items.filter(
    (it) => it.postType === 'post' && it.status !== 'trash',
  )
  log.info(`Phase E: ${posts.length} posts`)

  for (const p of posts) {
    try {
      const existing = await findByWp(payload, 'posts', 'wpPostId', p.postId)
      const author = findAuthorByLogin(authors, p.creator)
      const authorId = author ? maps.users.get(author.id) : undefined
      const featuredId = maps.media.get(
        getNum(getMeta(p.postmeta, '_thumbnail_id')),
      )
      const seo = readSeo(p.postmeta)

      const data = {
        title: p.title || '(untitled)',
        slug: p.postName || slugify(p.title || `post-${p.postId}`),
        publishedAt: gmtToIso(p.postDateGmt),
        excerpt: p.excerpt || undefined,
        content: htmlToLexical(p.contentHtml),
        featuredImage: featuredId,
        author: authorId,
        categories: categoriesByDomain(
          p.categories,
          'category',
          termIdBySlug.categories,
          maps.categories,
        ),
        tags: categoriesByDomain(
          p.categories,
          'post_tag',
          termIdBySlug.tags,
          maps.tags,
        ),
        seo,
        wpPostId: p.postId,
        _status: p.status === 'publish' ? 'published' : 'draft',
      }

      if (existing) {
        await payload.update({ collection: 'posts', id: existing.id, data })
        log.info(`  ↻ post ${p.title}`)
      } else {
        await payload.create({ collection: 'posts', data })
        log.ok(`  + post ${p.title}`)
      }
    } catch (err) {
      log.err(`  ! post ${p.postId} ${p.title}:`, err)
    }
  }
}

// -----------------------------------------------------------------------------
// Phase F — Pages
// -----------------------------------------------------------------------------

async function migratePages(
  payload: Payload,
  items: WxrItem[],
  maps: TermMaps,
): Promise<void> {
  const pages = items.filter(
    (it) => it.postType === 'page' && it.status !== 'trash',
  )
  log.info(`Phase F: ${pages.length} pages`)

  const wpToPayload = new Map<number, string>()
  for (const p of pages) {
    try {
      const existing = await findByWp(payload, 'pages', 'wpPostId', p.postId)
      const featuredId = maps.media.get(
        getNum(getMeta(p.postmeta, '_thumbnail_id')),
      )
      const seo = readSeo(p.postmeta)

      const data = {
        title: p.title || '(untitled)',
        slug: p.postName || slugify(p.title || `page-${p.postId}`),
        publishedAt: gmtToIso(p.postDateGmt),
        hero: {
          enabled: false,
          heading: p.title || undefined,
          image: featuredId,
        },
        layout: [
          {
            blockType: 'content',
            columns: 'single',
            body: htmlToLexical(p.contentHtml),
          },
        ],
        seo,
        wpPostId: p.postId,
        _status: p.status === 'publish' ? 'published' : 'draft',
      }

      let id: string | number
      if (existing) {
        const updated = await payload.update({
          collection: 'pages',
          id: existing.id,
          data,
        })
        id = updated.id
        log.info(`  ↻ page ${p.title}`)
      } else {
        const created = await payload.create({ collection: 'pages', data })
        id = created.id
        log.ok(`  + page ${p.title}`)
      }
      wpToPayload.set(p.postId, String(id))
    } catch (err) {
      log.err(`  ! page ${p.postId} ${p.title}:`, err)
    }
  }

  for (const p of pages) {
    if (!p.postParent) continue
    const myId = wpToPayload.get(p.postId)
    const parentId = wpToPayload.get(p.postParent)
    if (!myId || !parentId) continue
    try {
      await payload.update({
        collection: 'pages',
        id: myId,
        data: { parent: parentId },
      })
    } catch (err) {
      log.err(`  ! page parent ${p.postId}:`, err)
    }
  }
}

// -----------------------------------------------------------------------------
// Phase G — Team (cpt_team) with TRX Addons options
// -----------------------------------------------------------------------------

interface TrxOptions {
  subtitle: string
  email: string
  phone: string
  address: string
  socials: { platform: string; url: string }[]
}

const SOCIAL_NAME_MAP: Record<string, string> = {
  'icon-twitter': 'twitter',
  'icon-x': 'twitter',
  'icon-linkedin': 'linkedin',
  'icon-linkedin2': 'linkedin',
  'icon-facebook': 'facebook',
  'icon-facebook2': 'facebook',
  'icon-instagram': 'instagram',
  'icon-instagram2': 'instagram',
  'icon-github': 'github',
  'icon-globe': 'website',
}

function readTrxOptions(metas: WxrPostMeta[]): TrxOptions {
  const empty: TrxOptions = {
    subtitle: '',
    email: '',
    phone: '',
    address: '',
    socials: [],
  }
  const raw = getMeta(metas, 'trx_addons_options')
  if (!raw) return empty
  const parsed = phpUnserialize(raw)
  if (!isPhpObject(parsed)) return empty

  const socialsRaw = parsed.socials
  const socials: TrxOptions['socials'] = []
  if (isPhpArray(socialsRaw)) {
    for (const s of socialsRaw) {
      if (!isPhpObject(s)) continue
      const url = asString(s.url as PhpValue)
      if (!url) continue
      const name = asString(s.name as PhpValue)
      socials.push({
        platform: SOCIAL_NAME_MAP[name] ?? 'website',
        url,
      })
    }
  }

  return {
    subtitle: asString(parsed.subtitle),
    email: asString(parsed.email),
    phone: asString(parsed.phone),
    address: asString(parsed.address),
    socials,
  }
}

async function migrateTeam(
  payload: Payload,
  items: WxrItem[],
  maps: TermMaps,
): Promise<void> {
  const team = items.filter(
    (it) => it.postType === 'cpt_team' && it.status !== 'trash',
  )
  log.info(`Phase G: ${team.length} cpt_team items`)

  for (const t of team) {
    try {
      const existing = await findByWp(payload, 'team', 'wpPostId', t.postId)
      const featuredId = maps.media.get(
        getNum(getMeta(t.postmeta, '_thumbnail_id')),
      )
      const trx = readTrxOptions(t.postmeta)
      const teamCategory = t.categories.find(
        (c) => c.domain === 'cpt_team_group',
      )?.nicename

      const data = {
        name: t.title || '(untitled)',
        slug: t.postName || slugify(t.title || `team-${t.postId}`),
        publishedAt: gmtToIso(t.postDateGmt),
        role: trx.subtitle || undefined,
        category: teamCategory,
        photo: featuredId,
        bio: htmlToLexical(t.contentHtml),
        email: trx.email || undefined,
        phone: trx.phone || undefined,
        address: trx.address || undefined,
        social: trx.socials,
        order: t.menuOrder || undefined,
        wpPostId: t.postId,
      }

      if (existing) {
        await payload.update({ collection: 'team', id: existing.id, data })
        log.info(`  ↻ team ${t.title}`)
      } else {
        await payload.create({ collection: 'team', data })
        log.ok(`  + team ${t.title}`)
      }
    } catch (err) {
      log.err(`  ! team ${t.postId} ${t.title}:`, err)
    }
  }
}

// -----------------------------------------------------------------------------
// Phase H — Services (cpt_services)
// -----------------------------------------------------------------------------

async function migrateServices(
  payload: Payload,
  items: WxrItem[],
  maps: TermMaps,
): Promise<void> {
  const services = items.filter(
    (it) => it.postType === 'cpt_services' && it.status !== 'trash',
  )
  log.info(`Phase H: ${services.length} cpt_services items`)

  for (const s of services) {
    try {
      const existing = await findByWp(payload, 'services', 'wpPostId', s.postId)
      const featuredId = maps.media.get(
        getNum(getMeta(s.postmeta, '_thumbnail_id')),
      )
      const seo = readSeo(s.postmeta)

      const data = {
        title: s.title || '(untitled)',
        slug: s.postName || slugify(s.title || `service-${s.postId}`),
        publishedAt: gmtToIso(s.postDateGmt),
        summary: s.excerpt || undefined,
        featuredImage: featuredId,
        content: htmlToLexical(s.contentHtml),
        order: s.menuOrder || undefined,
        seo,
        wpPostId: s.postId,
        _status: s.status === 'publish' ? 'published' : 'draft',
      }

      if (existing) {
        await payload.update({ collection: 'services', id: existing.id, data })
        log.info(`  ↻ service ${s.title}`)
      } else {
        await payload.create({ collection: 'services', data })
        log.ok(`  + service ${s.title}`)
      }
    } catch (err) {
      log.err(`  ! service ${s.postId} ${s.title}:`, err)
    }
  }
}

// -----------------------------------------------------------------------------
// main()
// -----------------------------------------------------------------------------

async function main(): Promise<void> {
  log.info(`reading export: ${exportPath}`)
  if (!fs.existsSync(exportPath)) {
    throw new Error(`WP_EXPORT_PATH not found: ${exportPath}`)
  }
  log.info(`uploads root: ${uploadsPath}`)
  if (!fs.existsSync(uploadsPath)) {
    log.warn(`uploads path missing — media will be skipped: ${uploadsPath}`)
  }

  const xml = fs.readFileSync(exportPath, 'utf8')
  const wxr = parseWxr(xml)
  log.info(
    `parsed: ${wxr.authors.length} authors, ${wxr.categories.length} categories, ${wxr.tags.length} tags, ${wxr.items.length} items`,
  )

  const skipCounts = new Map<string, number>()
  for (const it of wxr.items) {
    if (SKIP_POST_TYPES.has(it.postType)) {
      skipCounts.set(it.postType, (skipCounts.get(it.postType) ?? 0) + 1)
    }
  }
  for (const [pt, n] of skipCounts) {
    log.info(`  skipping ${n} items of type ${pt}`)
  }

  log.info('initializing Payload (local)...')
  const payload = await getPayload({ config })

  const termIdBySlug = {
    categories: new Map(wxr.categories.map((c) => [c.slug, c.termId])),
    tags: new Map(wxr.tags.map((t) => [t.slug, t.termId])),
  }

  const userMap = await migrateUsers(payload, wxr.authors)
  const categoryMap = await migrateCategories(payload, wxr.categories)
  const tagMap = await migrateTags(payload, wxr.tags)
  const mediaMap = await migrateMedia(payload, wxr.items)

  const maps: TermMaps = {
    users: userMap,
    categories: categoryMap,
    tags: tagMap,
    media: mediaMap,
  }

  await migratePosts(payload, wxr.items, wxr.authors, termIdBySlug, maps)
  await migratePages(payload, wxr.items, maps)
  await migrateTeam(payload, wxr.items, maps)
  await migrateServices(payload, wxr.items, maps)

  log.ok('migration complete')
  process.exit(0)
}

const invokedDirectly =
  process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url

if (invokedDirectly) {
  main().catch((err) => {
    log.err('fatal:', err)
    process.exit(1)
  })
}
