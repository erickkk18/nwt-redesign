// Facts:
// 1. Next.js auto-mounts POST /api/graphql to this file. GraphQL clients
//    and Payload's admin GraphQL panel post queries here.
// 2. Glob: src/app/(payload)/api/graphql/route.ts returned No files found.
// 3. No data I/O directly. GRAPHQL_POST from @payloadcms/next/routes consumes
//    @payload-config and resolves the Payload GraphQL schema.
// 4. User: "proceed" — Phase 4 routing.

import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'

export const POST = GRAPHQL_POST(config)
export const OPTIONS = REST_OPTIONS(config)
