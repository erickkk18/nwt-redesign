// Best Lawyers awards — two cards side-by-side
function Awards() {
  const ref = useReveal();
  const cards = [
    { title: 'Best Lawyers®', subtitle: 'Best Law Firms', year: '2026', tag: 'Recognized' },
    { title: 'Best Lawyers®', subtitle: 'And Texas Super Lawyers', year: '2026', tag: 'Honored' },
  ];

  return (
    <section data-screen-label="Awards" style={{ background: 'var(--paper)', padding: '120px 0 80px' }}>
      <div className="container-wide" ref={ref} className="reveal">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
        }}>
          {cards.map((c, i) => <AwardCard key={i} {...c}/>)}
        </div>
      </div>
    </section>
  );
}

function AwardCard({ title, subtitle, year, tag }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--teal-900)',
        color: 'var(--cream)',
        padding: '48px 48px 0',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.4s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
      }}
    >
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 16 }}>{tag} · {year}</div>
          <h3 className="display" style={{ fontSize: 44, color: 'var(--cream)', marginBottom: 8 }}>{title}</h3>
          <div className="display-italic" style={{ fontSize: 22, color: 'var(--teal-100)' }}>{subtitle}</div>
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'var(--accent)', color: 'var(--cream)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          transform: hovered ? 'rotate(-45deg)' : 'rotate(0)',
          transition: 'transform 0.4s',
        }}>
          <Icon.ArrowUpRight size={18}/>
        </div>
      </div>

      {/* Faux row of headshots at bottom */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
        marginTop: 48,
      }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            aspectRatio: '3/4',
            background: `repeating-linear-gradient(135deg, rgba(246,242,234,0.12) 0 8px, rgba(246,242,234,0.06) 8px 16px)`,
          }}/>
        ))}
      </div>
    </div>
  );
}

window.Awards = Awards;
