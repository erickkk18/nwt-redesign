// Facts:
// 1. Imported by detail/list routes under src/app/(frontend) for non-home pages.
//    HomePage keeps its internal Nav.
// 2. Glob: src/components/site/Nav.tsx returned No files found.
// 3. No I/O. Client component (uses scroll listener).
// 4. User: "wire up sections on the pages and create components".

'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

function BurgerIcon({ open }: { open: boolean }) {
  // Two-line burger that morphs into an X.
  const top: CSSProperties = {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 1.5,
    background: 'currentColor',
    transition: 'transform 0.3s ease, top 0.3s ease',
    top: open ? '50%' : '36%',
    transform: open ? 'translateY(-50%) rotate(45deg)' : 'none',
  }
  const bottom: CSSProperties = {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 1.5,
    background: 'currentColor',
    transition: 'transform 0.3s ease, bottom 0.3s ease',
    bottom: open ? '50%' : '36%',
    transform: open ? 'translateY(50%) rotate(-45deg)' : 'none',
  }
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 28, height: 28 }} aria-hidden>
      <span style={top} />
      <span style={bottom} />
    </span>
  )
}

interface NavLink {
  label: string
  href: string
  openInNewTab?: boolean
}

interface NavCta {
  label: string
  href: string
}

const DEFAULT_LINKS: NavLink[] = [
  { label: 'What We Do', href: '/our-services' },
  { label: 'Our Team', href: '/our-team' },
  { label: 'About Us', href: '/what-sets-us-apart' },
  { label: 'News & Insights', href: '/posts' },
]

const DEFAULT_CTA: NavCta = { label: 'Get in Touch', href: '/contact-us' }

interface NavProps {
  /** Fallback when no <HeroTheme> is mounted on the page. */
  initialTheme?: 'dark' | 'light'
  links?: NavLink[]
  cta?: NavCta
  logoUrl?: string
  logoAlt?: string
}

function readBodyHeroTheme(): 'dark' | 'light' | null {
  if (typeof document === 'undefined') return null
  const v = document.body.dataset.heroTheme
  if (v === 'dark' || v === 'light') return v
  return null
}

function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginLeft: 8 }}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function Nav({
  initialTheme = 'light',
  links = DEFAULT_LINKS,
  cta = DEFAULT_CTA,
  logoUrl = '/nwt-logo.png',
  logoAlt = 'Nichols Weitzner Thomas — Attorneys at Law',
}: NavProps = {}) {
  const [scrolled, setScrolled] = useState(false)
  const [heroTheme, setHeroTheme] = useState<'dark' | 'light'>(initialTheme)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while drawer is open.
  useEffect(() => {
    if (typeof document === 'undefined') return
    const prev = document.body.style.overflow
    document.body.style.overflow = mobileOpen ? 'hidden' : prev || ''
    return () => {
      document.body.style.overflow = prev || ''
    }
  }, [mobileOpen])

  // Esc to close.
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  // Sync to body.dataset.heroTheme so any <HeroTheme value="..."> client
  // helper rendered by a route swaps the global Nav's mode on navigation.
  useEffect(() => {
    const sync = () => setHeroTheme(readBodyHeroTheme() ?? initialTheme)
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-hero-theme'],
    })
    return () => observer.disconnect()
  }, [initialTheme])

  const isLight = scrolled || heroTheme === 'light'

  const linkStyle: CSSProperties = {
    fontFamily: 'var(--sans)',
    fontSize: 13,
    fontWeight: 500,
    color: isLight ? 'var(--ink)' : 'var(--cream)',
    textDecoration: 'none',
    letterSpacing: '0.01em',
    padding: '8px 0',
    transition: 'color 0.3s, opacity 0.2s',
    cursor: 'pointer',
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: isLight ? 'rgba(251,250,246,0.85)' : 'transparent',
        backdropFilter: isLight ? 'saturate(180%) blur(14px)' : 'none',
        WebkitBackdropFilter: isLight ? 'saturate(180%) blur(14px)' : 'none',
        borderBottom: isLight
          ? '1px solid var(--line)'
          : '1px solid transparent',
        transition: 'all 0.4s ease',
      }}
    >
      <div
        className="container-wide"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: scrolled ? 64 : 88,
          transition: 'height 0.4s ease',
        }}
      >
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <Image
            src={logoUrl}
            alt={logoAlt}
            width={208}
            height={104}
            priority
            style={{
              height: scrolled ? 40 : 52,
              width: 'auto',
              transition: 'all 0.4s ease',
              filter: isLight ? 'none' : 'brightness(0) invert(1)',
            }}
          />
        </a>

        <div
          className="nav-links"
          style={{ display: 'flex', alignItems: 'center', gap: 36 }}
        >
          {links.map((l, i) => (
            <a
              key={`${l.href}-${i}`}
              href={l.href}
              target={l.openInNewTab ? '_blank' : undefined}
              rel={l.openInNewTab ? 'noopener noreferrer' : undefined}
              style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {l.label}
            </a>
          ))}
          <a
            href={cta.href}
            className="btn"
            style={{
              background: isLight ? 'var(--teal-800)' : 'var(--cream)',
              color: isLight ? 'var(--cream)' : 'var(--ink)',
              padding: '10px 18px',
              fontSize: 13,
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {cta.label}
            <ArrowIcon />
          </a>
        </div>

        <button
          type="button"
          className="nav-burger"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-drawer"
          onClick={() => setMobileOpen((v) => !v)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 6,
            color: isLight || mobileOpen ? 'var(--ink)' : 'var(--cream)',
            position: 'relative',
            zIndex: 102,
          }}
        >
          <BurgerIcon open={mobileOpen} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav-drawer"
        className="nav-drawer"
        aria-hidden={!mobileOpen}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--paper)',
          zIndex: 101,
          transform: mobileOpen ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1)',
          flexDirection: 'column',
          padding: '120px 24px 48px',
          overflowY: 'auto',
          visibility: mobileOpen ? 'visible' : 'hidden',
        }}
      >
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'grid',
            gap: 4,
            borderTop: '1px solid var(--line)',
          }}
        >
          {links.map((l, i) => (
            <li
              key={`m-${l.href}-${i}`}
              style={{ borderBottom: '1px solid var(--line)' }}
            >
              <a
                href={l.href}
                target={l.openInNewTab ? '_blank' : undefined}
                rel={l.openInNewTab ? 'noopener noreferrer' : undefined}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '24px 4px',
                  fontFamily: 'var(--serif)',
                  fontSize: 28,
                  letterSpacing: '-0.01em',
                  color: 'var(--ink)',
                  textDecoration: 'none',
                }}
              >
                <span>{l.label}</span>
                <span aria-hidden style={{ color: 'var(--accent)' }}>→</span>
              </a>
            </li>
          ))}
        </ul>

        <a
          href={cta.href}
          onClick={() => setMobileOpen(false)}
          className="btn btn-primary"
          style={{
            marginTop: 40,
            justifyContent: 'center',
            padding: '18px 24px',
            fontSize: 14,
          }}
        >
          {cta.label}
          <ArrowIcon />
        </a>
      </div>
    </nav>
  )
}
