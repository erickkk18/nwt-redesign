function Footer() {
  return (
    <footer data-screen-label="Footer" style={{
      background: 'var(--teal-900)',
      color: 'var(--cream)',
      padding: '80px 0 40px',
    }}>
      <div className="container-wide">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 48,
          paddingBottom: 64,
          borderBottom: '1px solid rgba(246,242,234,0.18)',
        }}>
          <div>
            <img
              src="assets/nwt-logo.png"
              alt="Nichols Weitzner Thomas"
              style={{ height: 56, width: 'auto', filter: 'brightness(0) invert(1)', marginBottom: 28 }}
            />
            <p style={{ fontFamily: 'var(--serif)', fontSize: 18, fontStyle: 'italic', fontWeight: 300, color: 'rgba(245,241,232,0.7)', maxWidth: 360 }}>
              Client focused. Creative solutions.
            </p>
          </div>

          {[
            { title: 'Firm', links: ['What We Do', 'Our Firm', 'Who We Are', 'About Us'] },
            { title: 'Resources', links: ['News & Insights', 'Cases', 'FAQ', 'Awards'] },
            { title: 'Contact', links: ['Houston', 'Austin', 'Dallas', 'careers@nwtlaw'] },
          ].map((col, i) => (
            <div key={i}>
              <div className="eyebrow" style={{ color: 'rgba(246,242,234,0.5)', marginBottom: 20 }}>{col.title}</div>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 10 }}>
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" style={{ color: 'var(--cream)', textDecoration: 'none', fontSize: 14, transition: 'opacity 0.2s' }}
                       onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
                       onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 32, gap: 24, flexWrap: 'wrap',
        }}>
          <div className="eyebrow" style={{ color: 'rgba(245,241,232,0.5)' }}>
            © 2026 Nichols Weitzner Thomas LLP &middot; All rights reserved
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Disclaimer', 'Sitemap'].map((l) => (
              <a key={l} href="#" style={{ color: 'rgba(246,242,234,0.5)', fontSize: 12, textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Massive footer wordmark */}
      <div style={{
        marginTop: 80,
        textAlign: 'center',
        fontFamily: 'var(--serif)',
        fontSize: 'clamp(80px, 18vw, 280px)',
        lineHeight: 0.9,
        letterSpacing: '-0.04em',
        color: 'rgba(246,242,234,0.06)',
        userSelect: 'none',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}>
NWT <span style={{ fontStyle: 'italic' }}>Law</span>
      </div>
    </footer>
  );
}

window.Footer = Footer;
