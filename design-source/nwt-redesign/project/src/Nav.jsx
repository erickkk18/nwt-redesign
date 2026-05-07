// Sticky nav with scroll-based shrink
function Nav() {
  const y = useScrollY();
  const scrolled = y > 60;
  const [menuOpen, setMenuOpen] = useState(false);

  const linkStyle = {
    fontFamily: 'var(--sans)',
    fontSize: 13,
    fontWeight: 500,
    color: scrolled ? 'var(--ink)' : 'var(--cream)',
    textDecoration: 'none',
    letterSpacing: '0.01em',
    padding: '8px 0',
    transition: 'color 0.3s',
    position: 'relative',
    cursor: 'pointer',
  };

  return (
    <nav
      data-screen-label="Nav"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(251,250,246,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'saturate(180%) blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'saturate(180%) blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
        transition: 'all 0.4s ease',
      }}
    >
      <div className="container-wide" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: scrolled ? 64 : 88,
        transition: 'height 0.4s ease',
      }}>
        {/* Logo */}
        <a href="#top" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src="assets/nwt-logo.png"
            alt="Nichols Weitzner Thomas — Attorneys at Law"
            style={{
              height: scrolled ? 40 : 52,
              width: 'auto',
              transition: 'all 0.4s ease',
              filter: scrolled ? 'none' : 'brightness(0) invert(1)',
            }}
          />
        </a>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {['What We Do', 'Our Firm', 'Who We Are', 'About Us', 'News & Insights'].map((label) => (
            <a key={label} href="#" style={linkStyle}
               onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
               onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >{label}</a>
          ))}
          <a href="#contact" className="btn" style={{
            background: scrolled ? 'var(--teal-800)' : 'var(--cream)',
            color: scrolled ? 'var(--cream)' : 'var(--ink)',
            padding: '10px 18px',
            fontSize: 13,
          }}>
            Get in Touch <Icon.Arrow size={14} />
          </a>
        </div>
      </div>
    </nav>
  );
}

function NWTLogo({ color = 'currentColor' }) {
  // Simple monogram mark — three pillars suggesting columns/initials
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ transition: 'all 0.3s' }}>
      <rect x="0" y="0" width="40" height="40" rx="2" fill={color} fillOpacity="0.08"/>
      <g stroke={color} strokeWidth="1.5" fill="none">
        <path d="M8 30 L8 10 L14 10 L14 24" strokeLinecap="round"/>
        <path d="M16 30 L20 10 L24 30 L28 10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M30 10 L36 10 M33 10 L33 30" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

window.Nav = Nav;
window.NWTLogo = NWTLogo;
