// Facts:
// 1. Auto-discovered by Next.js App Router for the (payload) route group;
//    wraps admin/[[...segments]]/page.tsx and api/[...slug]/route.ts.
// 2. Glob: src/app/(payload)/layout.tsx returned No files found.
// 3. No data files read/written here. RootLayout from @payloadcms/next/layouts
//    consumes @payload-config and renders the admin shell. importMap loaded
//    from ./admin/importMap.js (run `pnpm payload generate:importmap`).
// 4. User: "proceed" — Phase 4 routing.

import type { ServerFunctionClient } from 'payload'

import config from '@payload-config'
import '@payloadcms/next/css'
import {
  RootLayout,
  handleServerFunctions,
} from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    importMap={importMap}
    serverFunction={serverFunction}
  >
    {children}
  </RootLayout>
)

export default Layout
