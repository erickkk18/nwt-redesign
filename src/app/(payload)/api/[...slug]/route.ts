// Facts:
// 1. Next.js App Router auto-mounts every "/api/..." HTTP request to this
//    catch-all. Admin UI and external clients hit Payload REST endpoints
//    (/api/posts, /api/media, /api/users/login, ...) through here.
// 2. Glob: src/app/(payload)/api/[...slug]/route.ts returned No files found.
// 3. No data I/O in this file directly. REST_* handlers from
//    @payloadcms/next/routes consume @payload-config and dispatch to Payload's
//    collection/global handlers.
// 4. User: "proceed" — Phase 4 routing.

import config from '@payload-config'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
