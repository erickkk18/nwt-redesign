// Facts:
// 1. Registered in src/payload.config.ts under `globals`. Read by
//    src/app/(frontend)/page.tsx via payload.findGlobal({ slug: 'home-page' }).
//    Each section group is consumed by the matching component in
//    src/components/home/*.tsx.
// 2. Glob: src/globals/HomePage.ts returned No files found before this write.
// 3. Singleton MongoDB doc. Section groups carry text/textarea/number/group/array
//    fields only (no dates). defaultValues pre-populate on first admin read so
//    initial state mirrors current hardcoded frontend copy.
// 4. User: "the homepage on the backend still uses one component … I want each
//    section on the current home page front end desgign to be converted to
//    components and on the backend i will be able to edit them and its
//    prepopulated with the current frontend homepage content"

import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  access: {
    read: () => true,
  },
  admin: {
    description:
      'Edit each homepage section individually. Defaults match the current frontend; clear a field to fall back to the default.',
  },
  fields: [
    // ----- 01. Hero -------------------------------------------------------
    {
      name: 'hero',
      type: 'group',
      label: '01 · Hero',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Est. 2007 · Houston, Texas' },
        { name: 'titleLine1', type: 'text', defaultValue: 'Healthcare. Focused.' },
        { name: 'titleLine2', type: 'text', defaultValue: 'Attorneys.', admin: { description: 'Italic accent line — sits between line 1 and line 3.' } },
        { name: 'titleLine3', type: 'text', defaultValue: '', admin: { description: 'Optional third line, regular weight. Leave empty for a 2-line hero.' } },
        { name: 'tagline', type: 'textarea', defaultValue: 'A nimble law firm with a modern approach.' },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional. Replaces the procedural SVG skyline. Image is dimmed to ~22% opacity over the dark teal canvas to keep the headline legible.' },
        },
        {
          name: 'primaryCta',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'Our Approach' },
            { name: 'href', type: 'text', defaultValue: '#approach' },
          ],
        },
        {
          name: 'secondaryCta',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'Get in Touch' },
            { name: 'href', type: 'text', defaultValue: '#contact' },
          ],
        },
      ],
    },

    // ----- 02. The Firm / Protect ----------------------------------------
    {
      name: 'protect',
      type: 'group',
      label: '02 · The Firm',
      fields: [
        { name: 'eyebrowNumber', type: 'text', defaultValue: '01' },
        { name: 'eyebrowText', type: 'text', defaultValue: 'The Firm' },
        { name: 'locations', type: 'text', defaultValue: 'Houston · Austin · Dallas' },

        { name: 'headline', type: 'text', defaultValue: 'We Protect Everything' },
        { name: 'headlineItalic', type: 'text', defaultValue: "You've Built." },
        {
          name: 'intro',
          type: 'textarea',
          defaultValue:
            "Legal challenges don't pause if you fail to do so. They threaten your business, partnerships, and everything you've worked to build. Our highly-experienced team handles the toughest cases.",
        },
        {
          name: 'primaryLink',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'What we do' },
            { name: 'href', type: 'text', defaultValue: '/our-services' },
          ],
        },
        {
          name: 'secondaryLink',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'Read about our cases' },
            { name: 'href', type: 'text', defaultValue: '/posts' },
          ],
        },
        { name: 'badge', type: 'text', defaultValue: '19 Years of Practice' },
        {
          name: 'image1',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Top-row image (next to "We Protect Everything"). 4:3 ratio works best.' },
        },

        { name: 'subEyebrow', type: 'text', defaultValue: 'A Different Kind of Texas Law Firm' },
        { name: 'subHeadline', type: 'text', defaultValue: 'At Nichols Weitzner, we know big' },
        { name: 'subHeadlineItalic', type: 'text', defaultValue: 'law', admin: { description: 'Italic word inside the subhead.' } },
        { name: 'subHeadlineTail', type: 'text', defaultValue: " — we've managed it." },
        {
          name: 'subBody1',
          type: 'textarea',
          defaultValue:
            'Our legal experience has been augmented by hard-earned business experience and the ability to put yourself, your team and your work first.',
        },
        {
          name: 'subBody2Prefix',
          type: 'textarea',
          defaultValue: "When you work with us, you'll immediately notice the ",
        },
        { name: 'subBody2LinkLabel', type: 'text', defaultValue: 'difference' },
        { name: 'subBody2LinkHref', type: 'text', defaultValue: '/what-sets-us-apart' },
        { name: 'subBody2Suffix', type: 'text', defaultValue: '.' },
        {
          name: 'image2',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Bottom-row image (next to "we know big law"). 5:4 ratio works best.' },
        },
      ],
    },

    // ----- 03. Industries -------------------------------------------------
    {
      name: 'industries',
      type: 'group',
      label: '03 · Industries',
      fields: [
        { name: 'eyebrowNumber', type: 'text', defaultValue: '02' },
        { name: 'eyebrowText', type: 'text', defaultValue: 'Industries We Serve' },
        {
          name: 'headline',
          type: 'text',
          defaultValue:
            'Our clients include entrepreneurs, large public companies, family-owned businesses, and',
        },
        { name: 'headlineItalic', type: 'text', defaultValue: 'everything' },
        { name: 'headlineTail', type: 'text', defaultValue: 'in between.' },
        {
          name: 'items',
          type: 'array',
          labels: { singular: 'Industry', plural: 'Industries' },
          defaultValue: [
            { number: '01', name: 'Healthcare', description: "We work to advance our clients' goals at the intersection of healthcare, business, and the law. We provide thoughtful, business-minded counsel to physicians, providers, hospitals, and health systems." },
            { number: '02', name: 'Investors & Entrepreneurs', description: 'We help our clients structure deals, navigate disputes and raise capital. From the boardroom to the courtroom, we counsel investors, founders and operators on the matters that move their business forward.' },
            { number: '03', name: 'Life Sciences', description: 'Pharmaceutical and life-science clients turn to us for our depth and breadth across regulatory, transactional, and dispute-resolution challenges from drug development to commercialization.' },
            { number: '04', name: 'Engineering, Manufacturing, & Construction', description: 'We represent engineers, manufacturers and construction companies in matters that range from contract negotiation and project administration to dispute resolution and litigation.' },
            { number: '05', name: 'Outside General Counsel', description: 'Our experienced attorneys serve as outside general counsel to growing companies, providing the day-to-day legal guidance an in-house team would, with the depth of a full firm behind it.' },
          ],
          fields: [
            { name: 'number', type: 'text', required: true },
            { name: 'name', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
          ],
        },
      ],
    },

    // ----- 04. Approach ---------------------------------------------------
    {
      name: 'approach',
      type: 'group',
      label: '04 · Approach',
      fields: [
        { name: 'eyebrowNumber', type: 'text', defaultValue: '03' },
        { name: 'eyebrowText', type: 'text', defaultValue: 'How We Work' },
        { name: 'headline', type: 'text', defaultValue: "We've reimagined what a" },
        { name: 'headlineItalic', type: 'text', defaultValue: 'client-attorney' },
        { name: 'headlineTail', type: 'text', defaultValue: 'relationship should look like.' },
        {
          name: 'cta',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'Get In Touch' },
            { name: 'href', type: 'text', defaultValue: '#contact' },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Sticky image in the left column. 4:3 ratio works best.' },
        },
        {
          name: 'pillars',
          type: 'array',
          labels: { singular: 'Pillar', plural: 'Pillars' },
          defaultValue: [
            { title: 'We Solve Problems, Not Create Them', description: 'We will achieve your business objectives in a defined timeframe, on or under budget. We aim to give you definitive answers and pragmatic advice based on real-world experience.' },
            { title: 'We Stay Accessible', description: 'We answer the phone or email when you call. We aim for next-day responses to most inquiries, and same-day to anything urgent. Your matter receives the focus it deserves.' },
            { title: "We Anticipate Tomorrow's Challenges", description: 'To serve, who would dare to think will need to know more, anticipate even more clearly the new technologies of our future and apply that knowledge to your work today.' },
            { title: 'We Save You Time, Money, and Stress', description: 'Legal services are an investment in your business. We will work efficiently to add value and bring tangible results to ensure long-term success.' },
          ],
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
          ],
        },
      ],
    },

    // ----- 05. Practices --------------------------------------------------
    {
      name: 'practices',
      type: 'group',
      label: '05 · Practices',
      admin: {
        description: 'Cards are pulled from the Services collection. Edit eyebrow / link text here.',
      },
      fields: [
        { name: 'eyebrowNumber', type: 'text', defaultValue: '04' },
        { name: 'eyebrowText', type: 'text', defaultValue: 'Practice Areas' },
        {
          name: 'viewAll',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'View all practices →' },
            { name: 'href', type: 'text', defaultValue: '/our-services' },
          ],
        },
      ],
    },

    // ----- 06. Stats / About Us ------------------------------------------
    {
      name: 'stats',
      type: 'group',
      label: '06 · About Us / Stats',
      fields: [
        { name: 'eyebrowNumber', type: 'text', defaultValue: '05' },
        { name: 'eyebrowText', type: 'text', defaultValue: 'About Us' },
        { name: 'headline', type: 'text', defaultValue: 'Big law experience in a' },
        { name: 'headlineItalic', type: 'text', defaultValue: 'boutique' },
        { name: 'headlineTail', type: 'text', defaultValue: 'format.' },
        {
          name: 'items',
          type: 'array',
          labels: { singular: 'Stat', plural: 'Stats' },
          minRows: 3,
          maxRows: 3,
          defaultValue: [
            { value: 53, suffix: '', label: 'Combined attorneys', sub: 'Partners, counsel, associates' },
            { value: 370, suffix: '+', label: 'Years of practice', sub: 'Combined experience' },
            { value: 3284, suffix: '', label: 'Matters resolved', sub: 'Across our practice areas' },
          ],
          fields: [
            { name: 'value', type: 'number', required: true },
            { name: 'suffix', type: 'text' },
            { name: 'label', type: 'text', required: true },
            { name: 'sub', type: 'text' },
          ],
        },
        {
          name: 'cities',
          type: 'array',
          labels: { singular: 'City', plural: 'Cities' },
          defaultValue: [
            { name: 'Houston' }, { name: 'Austin' }, { name: 'Dallas' }, { name: 'The Woodlands' },
            { name: 'San Antonio' }, { name: 'El Paso' }, { name: 'Corpus Christi' },
            { name: 'Galveston' }, { name: 'San Angelo' }, { name: 'Fort Worth' },
          ],
          fields: [{ name: 'name', type: 'text', required: true }],
        },
      ],
    },

    // ----- 07. Attorneys --------------------------------------------------
    {
      name: 'attorneys',
      type: 'group',
      label: '07 · Attorneys',
      admin: {
        description: 'Cards are pulled from the Team collection. Edit eyebrow / link text here.',
      },
      fields: [
        { name: 'eyebrowNumber', type: 'text', defaultValue: '06' },
        { name: 'eyebrowText', type: 'text', defaultValue: 'Who We Are' },
        {
          name: 'headline',
          type: 'text',
          defaultValue: 'Our attorneys are veterans of big law firms, public company',
        },
        { name: 'headlineItalic', type: 'text', defaultValue: 'boardrooms' },
        { name: 'headlineTail', type: 'text', defaultValue: ', and academic medical centers.' },
        {
          name: 'viewAll',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'View all attorneys →' },
            { name: 'href', type: 'text', defaultValue: '/our-team' },
          ],
        },
      ],
    },

    // ----- 08. Testimonial ------------------------------------------------
    {
      name: 'testimonial',
      type: 'group',
      label: '08 · Testimonial',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Client Voices' },
        {
          name: 'quotes',
          type: 'array',
          labels: { singular: 'Quote', plural: 'Quotes' },
          minRows: 1,
          defaultValue: [
            { text: 'Amazing law firm to take care of all of our needs! Seriously great people work here and they are very thorough.', author: 'Health Org', role: 'Healthcare Client' },
            { text: 'Their team understands the business of medicine in ways most lawyers simply do not. Pragmatic, proactive, sharp.', author: 'Provider Group', role: 'Outside General Counsel' },
            { text: "When we needed to act fast, they delivered — quickly and on budget. They've become a trusted extension of our team.", author: 'Investor', role: 'Private Equity' },
          ],
          fields: [
            { name: 'text', type: 'textarea', required: true },
            { name: 'author', type: 'text', required: true },
            { name: 'role', type: 'text' },
          ],
        },
      ],
    },

    // ----- 09. News -------------------------------------------------------
    {
      name: 'news',
      type: 'group',
      label: '09 · News & Insights',
      admin: {
        description: 'Cards are pulled from the Posts collection. Edit eyebrow / link text here.',
      },
      fields: [
        { name: 'eyebrowNumber', type: 'text', defaultValue: '07' },
        { name: 'eyebrowText', type: 'text', defaultValue: 'News & Insights' },
        { name: 'headline', type: 'text', defaultValue: 'In' },
        { name: 'headlineItalic', type: 'text', defaultValue: 'The News.' },
        {
          name: 'viewAll',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'View all →' },
            { name: 'href', type: 'text', defaultValue: '/posts' },
          ],
        },
      ],
    },

    // ----- 10. FAQ --------------------------------------------------------
    {
      name: 'faq',
      type: 'group',
      label: '10 · FAQ',
      fields: [
        { name: 'eyebrowNumber', type: 'text', defaultValue: '08' },
        { name: 'eyebrowText', type: 'text', defaultValue: 'Frequently Asked' },
        { name: 'headline', type: 'text', defaultValue: 'Frequently Asked' },
        { name: 'headlineItalic', type: 'text', defaultValue: 'Questions.' },
        {
          name: 'items',
          type: 'array',
          labels: { singular: 'FAQ', plural: 'FAQs' },
          defaultValue: [
            { question: 'What does Nichols Weitzner Thomas spell over the past five firms?', answer: "Unlike larger firms in our market, we're the operational equivalent of any one of the firms you might have heard of. Our partners managed and built the business of multinational firms before founding NWT. As a result, our team is fluent across firm operations, billing models, conflict checking, and matter management." },
            { question: 'Why should we consider outside general counsel instead of project-based legal work?', answer: 'Outside general counsel offers consistent, business-aligned legal support without the overhead of an in-house team. Your matters are handled by attorneys who already understand your business, with predictable monthly retainers.' },
            { question: "I've been burned by attorneys who didn't understand my business. How do I know you're different?", answer: "Our attorneys have run businesses, served on boards, and led divisions inside operating companies. We're not just legal advisors — we're business advisors who happen to practice law." },
            { question: 'Do you work with businesses of all sizes?', answer: 'Yes. We work with everyone from solo founders to publicly traded companies. Our model is built to scale with your stage and complexity.' },
            { question: 'What experience does your team have in healthcare law?', answer: 'Our team has decades of combined experience in healthcare regulatory work, payor-provider disputes, transactions involving healthcare companies, and compliance counseling for providers across the spectrum.' },
            { question: 'What types of healthcare compliance issues does your firm handle?', answer: 'HIPAA, Stark, anti-kickback, Medicare/Medicaid billing, state licensure, corporate practice of medicine, fee-splitting, and audit defense — to name several.' },
            { question: 'What makes a good healthcare litigation lawyer?', answer: "Deep substantive knowledge of healthcare regulation, sharp courtroom instincts, and the operational understanding to know what a win actually looks like for the client's business." },
          ],
          fields: [
            { name: 'question', type: 'text', required: true },
            { name: 'answer', type: 'textarea', required: true },
          ],
        },
      ],
    },

    // ----- 11. Awards -----------------------------------------------------
    {
      name: 'awards',
      type: 'group',
      label: '11 · Awards',
      fields: [
        {
          name: 'items',
          type: 'array',
          labels: { singular: 'Award', plural: 'Awards' },
          defaultValue: [
            { title: 'Best Lawyers®', subtitle: 'Best Law Firms', year: '2026', tag: 'Recognized' },
            { title: 'Best Lawyers®', subtitle: 'And Texas Super Lawyers', year: '2026', tag: 'Honored' },
          ],
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'subtitle', type: 'text' },
            { name: 'year', type: 'text' },
            { name: 'tag', type: 'text' },
          ],
        },
      ],
    },

    // ----- 12. Contact ----------------------------------------------------
    {
      name: 'contact',
      type: 'group',
      label: '12 · Contact',
      fields: [
        { name: 'bannerHeadline', type: 'text', defaultValue: 'We bring proven experience with personalized counsel to' },
        { name: 'bannerHighlight', type: 'text', defaultValue: 'complex healthcare', admin: { description: 'Highlighted (accent + italic) inline phrase.' } },
        { name: 'bannerHighlightHref', type: 'text', defaultValue: '#contact' },
        { name: 'bannerSuffix', type: 'text', defaultValue: '.' },
        {
          name: 'bannerCta',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'Get In Touch' },
            { name: 'href', type: 'text', defaultValue: '#contact' },
          ],
        },

        { name: 'eyebrowNumber', type: 'text', defaultValue: '09' },
        { name: 'eyebrowText', type: 'text', defaultValue: 'Contact' },
        { name: 'headline', type: 'text', defaultValue: 'Contact' },
        { name: 'headlineItalic', type: 'text', defaultValue: 'Details.' },

        { name: 'sharedEmail', type: 'text', defaultValue: 'firm@nwtlaw.com', admin: { description: 'Single email shown above the office cards. Linked as mailto:.' } },
        {
          name: 'hours',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'Monday – Friday' },
            { name: 'value', type: 'text', defaultValue: '9:00 AM – 6:00 PM' },
          ],
        },
        {
          name: 'offices',
          type: 'array',
          labels: { singular: 'Office', plural: 'Offices' },
          minRows: 1,
          defaultValue: [
            { label: 'Houston Office', address: '2402 Dunlavy Street, Suite 2000\nHouston, Texas 77006', phone: '713-405-7090' },
            { label: 'Austin Office', address: '2901 Bee Caves Road, Suite A\nAustin, Texas 78746', phone: '512-221-3057' },
          ],
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'address', type: 'textarea', required: true },
            { name: 'phone', type: 'text' },
          ],
        },

        {
          name: 'form',
          type: 'group',
          fields: [
            {
              name: 'disclaimer',
              type: 'textarea',
              defaultValue:
                'Submitting this form does not create an attorney-client relationship. By contacting us, you acknowledge that we may not represent you until a formal engagement is established.',
            },
            { name: 'submitLabel', type: 'text', defaultValue: 'Send Message' },
          ],
        },
      ],
    },
  ],
}
