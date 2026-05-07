// In The News
function News() {
  const ref = useReveal();
  const items = [
    {
      cat: 'OIG Releases',
      title: 'OIG Releases First-Ever Medicare Advantage Compliance Program Guidance Since 1999',
      img: 'patient-doctor',
    },
    {
      cat: 'Compliance',
      title: 'New Medicare Prior Authorization Requirements in Pain Management: What Texas ASCs Must Know in 2026',
      img: 'paper-signing',
    },
    {
      cat: 'Awards',
      title: 'Nichols Weitzner Thomas LLP Partners Lead Presentation on Private Equity in Healthcare for HBA Health Law Section',
      img: 'attorney-portrait',
    },
  ];

  return (
    <section data-screen-label="News" style={{ background: 'var(--paper)', padding: '160px 0 140px' }}>
      <div className="container-wide" ref={ref} className="reveal">
        <div style={{ marginBottom: 64, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 24 }}>
          <div className="eyebrow"><span style={{ color: 'var(--accent)', marginRight: 10 }}>07</span> News &amp; Insights</div>
          <a href="#" className="ulink" style={{ fontSize: 13 }}>View all →</a>
        </div>

        <h2 className="display" style={{ fontSize: 'clamp(40px, 4.5vw, 64px)', marginBottom: 80, color: 'var(--ink)', maxWidth: 800 }}>
          In <span className="display-italic" style={{ color: 'var(--teal-800)' }}>The News.</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
          {items.map((item, i) => <NewsCard key={i} {...item}/>)}
        </div>
      </div>
    </section>
  );
}

function NewsCard({ cat, title, img }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href="#"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'block', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
    >
      <div style={{ overflow: 'hidden', marginBottom: 24 }}>
        <Placeholder
          label={img}
          ratio="3/2"
          tone="cream"
          style={{
            transition: 'transform 0.7s cubic-bezier(.2,.7,.2,1)',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
      </div>
      <div className="eyebrow" style={{ marginBottom: 12, color: 'var(--accent)' }}>{cat}</div>
      <h3 style={{
        fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 400,
        lineHeight: 1.25, color: 'var(--ink)',
        letterSpacing: '-0.01em',
        transition: 'color 0.3s',
        ...(hovered ? { color: 'var(--teal-800)' } : {}),
      }}>{title}</h3>
      <div style={{
        marginTop: 16,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontSize: 13, color: 'var(--ink-3)',
        transform: hovered ? 'translateX(6px)' : 'none',
        transition: 'transform 0.3s',
      }}>
        Read article <Icon.Arrow size={13}/>
      </div>
    </a>
  );
}

window.News = News;
