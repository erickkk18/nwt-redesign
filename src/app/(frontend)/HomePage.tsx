// Facts:
// 1. Imported by src/app/(frontend)/page.tsx (default route "/").
//    page.tsx:15  `import { HomePage } from './HomePage'`
//    page.tsx:16  `import type { NewsPost, Service, TeamMember } from './HomePage'`
// 2. Glob: src/app/(frontend)/HomePage.tsx existed before this rewrite (the
//    1449-line monolith that we just split). After rewrite this file is a thin
//    orchestrator only; section UI lives under src/components/home/*.
// 3. No file I/O. Receives plain-JSON `team`, `posts`, `services` from page.tsx.
//    Field shapes (TeamMember/NewsPost/Service/PayloadMedia/HomePageProps) are
//    re-exported from src/components/home/_shared.tsx so page.tsx's existing
//    `import type` line keeps working unchanged. publishedAt is ISO-8601 UTC.
// 4. User: "the homepage fix the links make the sections components wire it up"

import type { ReactNode } from 'react'

import { Approach } from '@/components/home/Approach'
import { Attorneys } from '@/components/home/Attorneys'
import { Awards } from '@/components/home/Awards'
import { Contact } from '@/components/home/Contact'
import { FAQ } from '@/components/home/FAQ'
import { Hero } from '@/components/home/Hero'
import { Industries } from '@/components/home/Industries'
import { News } from '@/components/home/News'
import { Practices } from '@/components/home/Practices'
import { Protect } from '@/components/home/Protect'
import { Stats } from '@/components/home/Stats'
import { Testimonial } from '@/components/home/Testimonial'

// Re-export the Payload-shaped types so page.tsx's existing
// `import type { NewsPost, Service, TeamMember } from './HomePage'` keeps
// working without changes.
export type {
  HomePageContent,
  HomePageProps,
  NewsPost,
  PayloadMedia,
  Service,
  TeamMember,
} from '@/components/home/_shared'

import type { HomePageProps } from '@/components/home/_shared'

export function HomePage({ team, posts, services, content }: HomePageProps = {}): ReactNode {
  return (
    <>
      <Hero content={content?.hero} />
      <Protect content={content?.protect} />
      <Industries content={content?.industries} />
      <Approach content={content?.approach} />
      <Practices services={services} content={content?.practices} />
      <Stats content={content?.stats} />
      <Attorneys team={team} content={content?.attorneys} />
      <Testimonial content={content?.testimonial} />
      <News posts={posts} content={content?.news} />
      <FAQ content={content?.faq} />
      <Awards content={content?.awards} />
      <Contact content={content?.contact} />
    </>
  )
}
