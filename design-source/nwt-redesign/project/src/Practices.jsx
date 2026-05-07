// Practice areas — horizontal image rail
function Practices() {
  const items = [
    { label: 'Outside General Counsel for Growing Providers', tag: 'Healthcare', desc: 'We act as your in-house counsel from negotiation to litigation.' },
    { label: 'Healthcare Payor-Provider Disputes', tag: 'Disputes', desc: 'A deep bench across reimbursement, audit, and contract litigation.' },
    { label: 'Labor & Employment', tag: 'Workforce', desc: 'Counsel for non-competes, executive separations, and litigation.' },
    { label: 'Regulatory & Compliance', tag: 'Regulated', desc: 'Federal, state and local compliance for highly regulated industries.' },
    { label: 'Business Services & Transactions', tag: 'Corporate', desc: 'Mergers, acquisitions, equity raises, and joint ventures.' },
  ];
  const ref = useReveal();

  return (
    <section data-screen-label="Practices" style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '120px 0 140px' }}>
      <div className="container-wide" ref={ref} className="reveal">
        <div style={{ marginBottom: 64, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div className="eyebrow" style={{ color: 'rgba(246,242,234,0.55)' }}>
            <span style={{ color: 'var(--accent)', marginRight: 10 }}>04</span>
            Practice Areas
          </div>
          <a href="#" className="ulink" style={{ fontSize: 14, color: 'var(--cream)', borderColor: 'rgba(246,242,234,0.3)' }}>View all practices →</a>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 0,
          borderTop: '1px solid rgba(246,242,234,0.12)',
        }}>
          {items.map((item, i) => (
            <PracticeCell key={i} {...item} isLast={i === items.length - 1}/>
          ))}
        </div>
      </div>
    </section>
  );
}

function PracticeCell({ label, tag, desc, isLast }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        padding: '24px 24px 32px',
        borderRight: isLast ? 'none' : '1px solid rgba(246,242,234,0.12)',
        cursor: 'pointer',
        transition: 'background 0.4s',
        background: hovered ? 'rgba(20,97,122,0.4)' : 'transparent',
        minHeight: 380,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}
    >
      {/* Image at top */}
      <div style={{ marginBottom: 20 }}>
        <Placeholder
          label={tag}
          ratio="4/3"
          tone="dark"
          style={{
            transition: 'transform 0.6s ease',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
          }}
        />
      </div>

      <div>
        <div className="eyebrow" style={{
          color: hovered ? 'var(--accent)' : 'rgba(246,242,234,0.5)',
          transition: 'color 0.3s', marginBottom: 12,
        }}>{tag}</div>
        <h3 className="display" style={{ fontSize: 22, lineHeight: 1.15, marginBottom: 12, color: 'var(--cream)' }}>
          {label}
        </h3>
        <p style={{
          fontSize: 13, color: 'rgba(246,242,234,0.65)', lineHeight: 1.5,
          maxHeight: hovered ? 100 : 0,
          opacity: hovered ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.4s ease',
        }}>{desc}</p>
      </div>
    </div>
  );
}

window.Practices = Practices;
