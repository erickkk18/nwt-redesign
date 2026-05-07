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
import { Geist, Geist_Mono, Newsreader } from 'next/font/google'
import './globals.css'

import { NavServer } from '@/components/site/NavServer'
import { FooterServer } from '@/components/site/FooterServer'

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
})

const geist = Geist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-geist',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-geist-mono',
  display: 'swap',
})

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
    <html
      lang="en"
      className={`${newsreader.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body>
        <NavServer />
        {children}
        <FooterServer />
      </body>
    </html>
  )
}
