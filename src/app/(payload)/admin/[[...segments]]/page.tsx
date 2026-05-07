// Facts:
// 1. Auto-discovered by Next.js App Router. Handles "/admin" and every nested
//    admin URL via the optional catch-all segment. Wrapped by
//    src/app/(payload)/layout.tsx.
// 2. Glob: src/app/(payload)/admin/[[...segments]]/page.tsx returned No files found.
// 3. No data I/O directly. RootPage from @payloadcms/next/views reads
//    @payload-config + importMap and renders the admin route based on
//    params.segments and searchParams.
// 4. User: "proceed" — Phase 4 routing.

import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'

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

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, params, searchParams, importMap })

export default Page
