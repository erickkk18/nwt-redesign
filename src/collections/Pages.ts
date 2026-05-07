// Facts:
// 1. Called by src/payload.config.ts line 16 (import { Pages } from './collections/Pages');
//    queried by Phase-4 routes app/[slug]/page.tsx and app/page.tsx via Payload Local API;
//    written to by scripts/migrate.ts for every WP item where wp:post_type === 'page'.
// 2. Glob check: '**/collections/Pages.ts' under nwt-payload/ returned No files found.
// 3. Schema example record (synthetic):
//    { title: "About Us", slug: "about-us", publishedAt: "2024-03-12T08:00:00.000Z",
//      hero: { heading, image }, layout: [{ blockType: "content", body: {...} }, ...],
//      seo: { metaTitle, metaDescription }, wpPostId: 567 }
//    Date format: ISO-8601 UTC. Slug format: kebab-case.
// 4. User instruction: "Pages collection must use a `layout` blocks field for flexible layouts"
//    "Always include: title (text), slug (text, unique), publishedAt (date)"
//    "ACF flexible_content → Payload blocks"

import type { CollectionConfig } from 'payload'

import { HeroBlock } from '../blocks/HeroBlock'
import { ContentBlock } from '../blocks/ContentBlock'
import { ImageBlock } from '../blocks/ImageBlock'
import { TwoColumnBlock } from '../blocks/TwoColumnBlock'
import { CtaBlock } from '../blocks/CtaBlock'
import { TeamBlock } from '../blocks/TeamBlock'
import { ServicesBlock } from '../blocks/ServicesBlock'
import { GalleryBlock } from '../blocks/GalleryBlock'
import { FormBlock } from '../blocks/FormBlock'

const ABOUT_SLUGS = ['what-sets-us-apart', 'about', 'about-us']
const CONTACT_SLUGS = ['contact-us', 'thank-you-contact', 'thank-you-get-in-touch']
const TEAM_SLUGS = ['our-team', 'team']
const SERVICES_SLUGS = ['our-services', 'what-we-do', 'services', 'practices']

const showFor =
  (slugs: readonly string[]) =>
  ({ siblingData, data }: { siblingData?: { slug?: string | null }; data?: { slug?: string | null } }) => {
    const slug = siblingData?.slug ?? data?.slug
    return typeof slug === 'string' && slugs.includes(slug)
  }

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedAt', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Use "home" for the homepage. Otherwise kebab-case path segment.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'hero',
      type: 'group',
      admin: {
        description: 'Page hero — separate from layout blocks so every page has a consistent header treatment',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'heading',
          type: 'text',
        },
        {
          name: 'subheading',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Page layout',
      minRows: 0,
      blocks: [
        HeroBlock,
        ContentBlock,
        ImageBlock,
        TwoColumnBlock,
        CtaBlock,
        TeamBlock,
        ServicesBlock,
        GalleryBlock,
        FormBlock,
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO (Yoast import)',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        {
          name: 'metaImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'sectionContent',
      type: 'group',
      label: 'Section Content',
      admin: {
        description:
          'Section-by-section content for known landing pages (about / contact / team / services). The relevant group appears automatically based on the page slug.',
      },
      fields: [
        {
          name: 'about',
          type: 'group',
          label: 'About sections',
          admin: { condition: showFor(ABOUT_SLUGS) },
          fields: [
            {
              name: 'hero',
              type: 'group',
              label: '01 · Hero',
              fields: [
                { name: 'eyebrowNumber', type: 'text', defaultValue: '02' },
                { name: 'eyebrowText', type: 'text', defaultValue: 'What We Do' },
                { name: 'headline', type: 'text', defaultValue: 'All the Experience of a' },
                {
                  name: 'headlineItalic',
                  type: 'text',
                  defaultValue: 'Big Law Firm Without the Waste.',
                },
                { name: 'lede', type: 'textarea' },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'Optional. Right-side hero image (4:5 portrait works best).' },
                },
              ],
            },
            {
              name: 'pillars',
              type: 'group',
              label: '02 · Differentiators',
              fields: [
                { name: 'eyebrowNumber', type: 'text', defaultValue: '03' },
                { name: 'eyebrowText', type: 'text', defaultValue: 'How We Work' },
                { name: 'heading', type: 'text', defaultValue: 'Personable.' },
                { name: 'headingItalic', type: 'text', defaultValue: 'Creative. Efficient.' },
                {
                  name: 'items',
                  type: 'array',
                  minRows: 1,
                  maxRows: 6,
                  fields: [
                    { name: 'numLabel', type: 'text' },
                    { name: 'title', type: 'text' },
                    { name: 'body', type: 'textarea' },
                  ],
                },
              ],
            },
            {
              name: 'licenses',
              type: 'group',
              label: '03 · Licenses',
              fields: [
                { name: 'eyebrowNumber', type: 'text', defaultValue: '04' },
                { name: 'eyebrowText', type: 'text', defaultValue: 'State Bar Qualification' },
                { name: 'heading', type: 'text', defaultValue: 'Our' },
                { name: 'headingItalic', type: 'text', defaultValue: 'Licenses.' },
                { name: 'disclaimer', type: 'textarea' },
                {
                  name: 'items',
                  type: 'array',
                  minRows: 1,
                  maxRows: 6,
                  fields: [
                    { name: 'jurisdiction', type: 'text' },
                    { name: 'body', type: 'textarea' },
                  ],
                },
                {
                  name: 'cta',
                  type: 'group',
                  fields: [
                    { name: 'label', type: 'text', defaultValue: 'View Our Team' },
                    { name: 'href', type: 'text', defaultValue: '/our-team' },
                  ],
                },
              ],
            },
            {
              name: 'cta',
              type: 'group',
              label: '04 · Closing CTA',
              fields: [
                { name: 'eyebrowText', type: 'text', defaultValue: 'Get in Touch' },
                { name: 'headline', type: 'text', defaultValue: 'We bring proven experience' },
                { name: 'headlineItalic', type: 'text', defaultValue: 'with personalized counsel.' },
                { name: 'body', type: 'textarea' },
                {
                  name: 'primaryCta',
                  type: 'group',
                  fields: [
                    { name: 'label', type: 'text', defaultValue: 'Contact Us' },
                    { name: 'href', type: 'text', defaultValue: '/contact-us' },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'contact',
          type: 'group',
          label: 'Contact sections',
          admin: { condition: showFor(CONTACT_SLUGS) },
          fields: [
            {
              name: 'header',
              type: 'group',
              label: '01 · Header',
              fields: [
                { name: 'eyebrowNumber', type: 'text', defaultValue: '09' },
                { name: 'eyebrowText', type: 'text', defaultValue: 'Contact' },
                { name: 'heading', type: 'text', defaultValue: 'Tell us about' },
                { name: 'headingItalic', type: 'text', defaultValue: 'your matter.' },
                { name: 'lede', type: 'textarea' },
              ],
            },
            {
              name: 'details',
              type: 'group',
              label: '02 · Contact Details',
              fields: [
                { name: 'detailsHeading', type: 'text', defaultValue: 'Contact' },
                { name: 'detailsHeadingItalic', type: 'text', defaultValue: 'Details.' },
                {
                  name: 'offices',
                  type: 'array',
                  minRows: 1,
                  maxRows: 5,
                  fields: [
                    { name: 'label', type: 'text' },
                    { name: 'addressLine1', type: 'text' },
                    { name: 'addressLine2', type: 'text' },
                    { name: 'phone', type: 'text' },
                  ],
                },
                { name: 'sharedEmail', type: 'text' },
                { name: 'hoursLabel', type: 'text', defaultValue: 'Hours' },
                { name: 'hoursBody', type: 'textarea' },
              ],
            },
            {
              name: 'form',
              type: 'group',
              label: '03 · Form Copy',
              fields: [
                { name: 'submitLabel', type: 'text', defaultValue: 'Send Message' },
                { name: 'disclaimer', type: 'textarea' },
                { name: 'successEyebrow', type: 'text', defaultValue: 'Message received' },
                { name: 'successHeading', type: 'text', defaultValue: 'Thank you' },
                { name: 'successBody', type: 'textarea' },
              ],
            },
          ],
        },
        {
          name: 'team',
          type: 'group',
          label: 'Team list sections',
          admin: { condition: showFor(TEAM_SLUGS) },
          fields: [
            {
              name: 'intro',
              type: 'group',
              label: '01 · Intro',
              fields: [
                { name: 'eyebrowNumber', type: 'text', defaultValue: '06' },
                { name: 'eyebrowText', type: 'text', defaultValue: 'Our Team' },
                { name: 'heading', type: 'text', defaultValue: 'Founded By Veterans of' },
                { name: 'headingItalic', type: 'text', defaultValue: 'Big Law Firms.' },
                { name: 'description', type: 'textarea' },
              ],
            },
            {
              name: 'cta',
              type: 'group',
              label: '02 · Closing CTA',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: true },
                { name: 'eyebrowText', type: 'text', defaultValue: 'Work with us' },
                { name: 'heading', type: 'text', defaultValue: 'Looking for the right' },
                { name: 'headingItalic', type: 'text', defaultValue: 'attorney?' },
                { name: 'body', type: 'textarea' },
                {
                  name: 'primaryCta',
                  type: 'group',
                  fields: [
                    { name: 'label', type: 'text', defaultValue: 'Get in Touch' },
                    { name: 'href', type: 'text', defaultValue: '/contact-us' },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'services',
          type: 'group',
          label: 'Services list sections',
          admin: { condition: showFor(SERVICES_SLUGS) },
          fields: [
            {
              name: 'intro',
              type: 'group',
              label: '01 · Intro',
              fields: [
                { name: 'eyebrowNumber', type: 'text', defaultValue: '04' },
                { name: 'eyebrowText', type: 'text', defaultValue: 'Excellence in Customer Service' },
                { name: 'heading', type: 'text', defaultValue: 'Full-Service' },
                { name: 'headingItalic', type: 'text', defaultValue: 'Law Firm.' },
                { name: 'description', type: 'textarea' },
              ],
            },
            {
              name: 'cta',
              type: 'group',
              label: '02 · Closing CTA',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: true },
                { name: 'eyebrowText', type: 'text', defaultValue: 'Why Our Firm' },
                { name: 'heading', type: 'text', defaultValue: 'We provide the highest quality counsel' },
                { name: 'headingItalic', type: 'text', defaultValue: 'for your business.' },
                { name: 'body', type: 'textarea' },
                {
                  name: 'primaryCta',
                  type: 'group',
                  fields: [
                    { name: 'label', type: 'text', defaultValue: 'Contact Us' },
                    { name: 'href', type: 'text', defaultValue: '/contact-us' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        position: 'sidebar',
        description: 'Mirrors WP `post_parent` for nested pages',
      },
    },
    {
      name: 'wpPostId',
      type: 'number',
      unique: true,
      index: true,
      admin: {
        description: 'Original WordPress page ID — idempotency key for re-runs',
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
