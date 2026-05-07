// Facts:
// 1. Auto-loaded by Next.js App Router as the root layout for the (frontend)
//    route group. Wraps src/app/(frontend)/page.tsx (homepage). Imports
//    ./globals.css and Google fonts. Called by Next.js at build/render time.
// 2. Glob: src/app/**/layout.tsx under nwt-payload/ returned No files found.
// 3. No data file I/O. HTML shell only.
// 4. User: "for the front end lets redesign it instead for the homepage ...
//    Use the existing images and logo. For the text/copies dont change it and
//    use the original. we were only changing the layout. Implement: index.html"

import type { Metadata } from 'next'
import './globals.css'

import { NavServer } from '@/components/site/NavServer'
import { FooterServer } from '@/components/site/FooterServer'

export const metadata: Metadata = {
  title:
    'Nichols Weitzner Thomas LLP — Healthcare. Focused. Attorneys.',
  description:
    'A nimble healthcare law firm with a modern approach. Houston, Texas.',
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,300;1,6..72,400&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NavServer />
        {children}
        <FooterServer />
      </body>
    </html>
  )
}
