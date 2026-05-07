import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page (/what-sets-us-apart)',
  access: { read: () => true },
  admin: {
    description:
      'Edit the What Sets Us Apart page section by section. Defaults match the original WordPress copy.',
  },
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
        {
          name: 'lede',
          type: 'textarea',
          defaultValue:
            "Before you hire that giant international firm, give us a call. Big Law has its place, but it's not every place. Our lawyers have BigLaw pedigrees — all the high-profile experience and elite-level skills, because that's where they came from. Combined, our team has 130+ years representing the nation's largest, most demanding clients on transactions and litigation involving billions of dollars.",
        },
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
          defaultValue: [
            {
              numLabel: '01',
              title: 'Personable',
              body:
                "With us, you'll be represented by the lawyer you hire, not some low-level stranger. Firms often hook you with sales pitches by flashy big-name partners — but then delegate most of the actual work to people you'll never meet and who don't care as much. At NWT Law, we won't abandon you. Before you even engage us, you'll know who'll handle your work. And when the work starts, you'll have immediate access to everyone on your team.",
            },
            {
              numLabel: '02',
              title: 'Creative',
              body:
                "We're not tethered to outdated institutional rituals and restraints. We can develop fresh approaches without seeking permission from firm committees. We can offer a menu of flexible strategic options as a matter progresses. If the matter requires lawyering up, we can quickly assemble an experienced team of attorneys that is better, more efficient, and less costly than an army of junior associates. We also offer a suite of alternative fee structures.",
            },
            {
              numLabel: '03',
              title: 'Efficient',
              body:
                "Law firms are locked in a battle to distinguish themselves from the rest, largely by inflating profits per equity partner. Compensation budgets soar while firms shovel cash into lavish offices, marketing, and other pursuits that don't benefit clients. The unavoidable result? Bloated hourly rates that increase every year. Because NWT Law is immune from that rat-race, we don't have to play the game. Our rates are affordable and reflect the actual value we provide.",
            },
          ],
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
        {
          name: 'disclaimer',
          type: 'textarea',
          defaultValue:
            'Unless otherwise noted, our lawyers are not certified by the Texas Board of Legal Specialization.',
        },
        {
          name: 'items',
          type: 'array',
          minRows: 1,
          maxRows: 6,
          defaultValue: [
            { jurisdiction: 'Texas', body: 'All of our attorneys are licensed in Texas.' },
            { jurisdiction: 'California', body: 'Scott Nichols and Zach Thomas are licensed in California.' },
            { jurisdiction: 'Other States', body: 'Zach Thomas is also licensed in Illinois, Missouri, and Oregon.' },
          ],
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
        {
          name: 'headlineItalic',
          type: 'text',
          defaultValue: 'with personalized counsel.',
        },
        {
          name: 'body',
          type: 'textarea',
          defaultValue:
            'Complex healthcare regulations require counsel who understands both the law and the operational pressures behind it. Tell us about your matter — a partner will respond within one business day.',
        },
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
}
