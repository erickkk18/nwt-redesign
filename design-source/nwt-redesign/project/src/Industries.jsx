// "Industries We Serve" — editorial numbered list
function Industries() {
  const ref = useReveal();

  const items = [
    {
      n: '01',
      name: 'Healthcare',
      desc: 'We work to advance our clients\' goals at the intersection of healthcare, business, and the law. We provide thoughtful, business-minded counsel to physicians, providers, hospitals, and health systems.',
    },
    {
      n: '02',
      name: 'Investors & Entrepreneurs',
      desc: 'We help our clients structure deals, navigate disputes and raise capital. From the boardroom to the courtroom, we counsel investors, founders and operators on the matters that move their business forward.',
    },
    {
      n: '03',
      name: 'Life Sciences',
      desc: 'Pharmaceutical and life-science clients turn to us for our depth and breadth across regulatory, transactional, and dispute-resolution challenges from drug development to commercialization.',
    },
    {
      n: '04',
      name: 'Engineering, Manufacturing, & Construction',
      desc: 'We represent engineers, manufacturers and construction companies in matters that range from contract negotiation and project administration to dispute resolution and litigation.',
    },
    {
      n: '05',
      name: 'Outside General Counsel',
      desc: 'Our experienced attorneys serve as outside general counsel to growing companies, providing the day-to-day legal guidance an in-house team would, with the depth of a full firm behind it.',
    },
  ];

  return (
    <section data-screen-label="Industries" style={{
      background: 'var(--cream)',
      padding: '160px 0 180px',
      borderTop: '1px solid var(--line)',
      borderBottom: '1px solid var(--line)',
    }}>
      <div className="container-wide" ref={ref} className="reveal">

        {/* Header */}
        <div style={{ marginBottom: 96, display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 80, alignItems: 'end' }}>
          <div className="eyebrow">
            <span style={{ color: 'var(--accent)', marginRight: 10 }}>02</span>
            Industries We Serve
          </div>
          <h2 className="display" style={{ fontSize: 'clamp(40px, 4.5vw, 68px)', color: 'var(--ink)', maxWidth: 900 }}>
            Our clients include entrepreneurs, large public companies, family-owned businesses, and <span className="display-italic" style={{ color: 'var(--teal-800)' }}>everything</span> in between.
          </h2>
        </div>

        {/* Editorial list */}
        <ul style={{ listStyle: 'none' }}>
          {items.map((item, i) => (
            <IndustryRow key={item.n} item={item} isLast={i === items.length - 1}/>
          ))}
        </ul>
      </div>
    </section>
  );
}

function IndustryRow({ item, isLast }) {
  const [hovered, setHovered] = useState(false);
  return (
    <li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr 1.4fr 60px',
        gap: 40,
        alignItems: 'baseline',
        padding: '40px 0',
        borderBottom: isLast ? 'none' : '1px solid var(--line-2)',
        cursor: 'pointer',
        transition: 'all 0.4s ease',
        position: 'relative',
      }}
    >
      <div className="eyebrow" style={{ color: hovered ? 'var(--accent)' : 'var(--ink-4)', transition: 'color 0.3s' }}>
        — {item.n}
      </div>
      <h3 className="display" style={{
        fontSize: 'clamp(28px, 3vw, 44px)',
        color: hovered ? 'var(--teal-800)' : 'var(--ink)',
        transition: 'color 0.3s',
        transform: hovered ? 'translateX(8px)' : 'none',
      }}>
        {item.name}
      </h3>
      <p style={{
        fontSize: 16, lineHeight: 1.55, color: 'var(--ink-3)',
        opacity: hovered ? 1 : 0.7,
        transition: 'opacity 0.3s',
        maxWidth: 560,
      }}>
        {item.desc}
      </p>
      <div style={{
        color: hovered ? 'var(--teal-800)' : 'var(--ink-4)',
        transform: hovered ? 'translateX(8px)' : 'none',
        transition: 'all 0.3s',
        textAlign: 'right',
      }}>
        <Icon.ArrowUpRight size={22}/>
      </div>
    </li>
  );
}

window.Industries = Industries;
