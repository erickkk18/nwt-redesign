// Facts:
// 1. Auto-mounted by Next.js when sibling page.tsx (RootPage) calls notFound()
//    for an unknown admin segment.
// 2. Glob: src/app/(payload)/admin/[[...segments]]/not-found.tsx returned
//    No files found.
// 3. No data I/O. NotFoundPage from @payloadcms/next/views renders the admin
//    404 using @payload-config + importMap.
// 4. User: "proceed" — Phase 4 routing.

import type { Metadata } from 'next'

import config from '@payload-config'
import {
  generatePageMetadata,
  NotFoundPage,
} from '@payloadcms/next/views'

import { importMap } from '../../admin/importMap.js'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({
  params,
  searchParams,
}: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, params, searchParams, importMap })

export default NotFound
