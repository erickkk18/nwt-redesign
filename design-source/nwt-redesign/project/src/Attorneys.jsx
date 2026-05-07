// Attorneys — editorial mosaic w/ hover bio reveal
function Attorneys() {
  const ref = useReveal();

  const people = [
    { name: 'Scott Nichols', role: 'Partner', city: 'Houston', tag: 'Founding' },
    { name: 'Marissa Weitzner', role: 'Partner', city: 'Houston', tag: 'Founding' },
    { name: 'Josh Thomas', role: 'Partner', city: 'Austin' },
    { name: 'Kevin Wood', role: 'Partner', city: 'Dallas' },
    { name: 'Melanie Kuhnsey', role: 'Counsel', city: 'Houston' },
    { name: 'Michelle Sanchez', role: 'Counsel', city: 'San Antonio' },
    { name: 'Louis Williams', role: 'Counsel', city: 'Houston' },
    { name: 'Greg Hines', role: 'Counsel', city: 'Dallas' },
    { name: 'Leah Larson', role: 'Associate', city: 'Houston' },
    { name: 'Jackie Harrison', role: 'Associate', city: 'Austin' },
    { name: 'Adam Pena', role: 'Associate', city: 'El Paso' },
    { name: 'Tracie Boggess', role: 'Associate', city: 'Galveston' },
  ];

  return (
    <section data-screen-label="Attorneys" style={{ background: 'var(--paper)', padding: '160px 0 140px' }}>
      <div className="container-wide" ref={ref} className="reveal">

        <div style={{ marginBottom: 80, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 24 }}>
          <div className="eyebrow"><span style={{ color: 'var(--accent)', marginRight: 10 }}>06</span> Who We Are</div>
          <a href="#" className="ulink" style={{ fontSize: 13 }}>View all attorneys →</a>
        </div>

        <h2 className="display" style={{
          fontSize: 'clamp(40px, 4.5vw, 72px)',
          color: 'var(--ink)',
          maxWidth: 1100,
          marginBottom: 96,
        }}>
          Our attorneys are veterans of big law firms, public company <span className="display-italic" style={{ color: 'var(--teal-800)' }}>boardrooms</span>, and academic medical centers.
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 32,
        }}>
          {people.map((p, i) => <AttorneyCard key={p.name} {...p} index={i}/>)}
        </div>
      </div>
    </section>
  );
}

function AttorneyCard({ name, role, city, tag }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 18,
        background: 'var(--cream-2)',
      }}>
        <div style={{
          aspectRatio: '4/5',
          background: `repeating-linear-gradient(135deg, #cdb89a 0 14px, #c3ae90 14px 28px)`,
          transition: 'transform 0.6s cubic-bezier(.2,.7,.2,1)',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          position: 'relative',
        }}>
          {/* Faux portrait silhouette */}
          <svg viewBox="0 0 200 250" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id={`grad-${name.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1a3540" stopOpacity="0.55"/>
                <stop offset="1" stopColor="#0a3a47" stopOpacity="0.85"/>
              </linearGradient>
            </defs>
            <ellipse cx="100" cy="95" rx="34" ry="40" fill={`url(#grad-${name.replace(/\s/g, '')})`}/>
            <path d={`M 30 250 Q 30 165 100 155 Q 170 165 170 250 Z`} fill={`url(#grad-${name.replace(/\s/g, '')})`}/>
          </svg>

          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(15,76,92,0.92) 100%)',
            padding: '32px 16px 16px',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.35s ease',
            color: 'var(--cream)',
          }}>
            <div className="eyebrow" style={{ color: 'rgba(246,242,234,0.7)', marginBottom: 4 }}>{city}</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 13 }}>View profile →</div>
          </div>

          {tag && (
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: 'var(--accent)', color: 'var(--cream)',
              padding: '4px 10px',
              fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
            }}>{tag}</div>
          )}
        </div>
      </div>
      <h3 style={{
        fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 400,
        color: 'var(--ink)', marginBottom: 4,
        letterSpacing: '-0.01em',
      }}>{name}</h3>
      <div className="eyebrow" style={{ color: 'var(--ink-3)' }}>{role}</div>
    </div>
  );
}

window.Attorneys = Attorneys;
