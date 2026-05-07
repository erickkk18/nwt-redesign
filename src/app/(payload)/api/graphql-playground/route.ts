// Facts:
// 1. Next.js auto-mounts GET /api/graphql-playground to this file. Browser
//    requests the interactive GraphQL playground from here.
// 2. Glob: src/app/(payload)/api/graphql-playground/route.ts returned
//    No files found.
// 3. No data I/O directly. GRAPHQL_PLAYGROUND_GET from
//    @payloadcms/next/routes reads @payload-config and renders the playground.
// 4. User: "proceed" — Phase 4 routing.

import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
