// Testimonial — large pull quote, paginated
function Testimonial() {
  const quotes = [
    { text: 'Amazing law firm to take care of all of our needs! Seriously great people work here and they are very thorough.', author: 'Health Org', role: 'Healthcare Client' },
    { text: 'Their team understands the business of medicine in ways most lawyers simply do not. Pragmatic, proactive, sharp.', author: 'Provider Group', role: 'Outside General Counsel' },
    { text: 'When we needed to act fast, they delivered — quickly and on budget. They\'ve become a trusted extension of our team.', author: 'Investor', role: 'Private Equity' },
  ];
  const [idx, setIdx] = useState(0);
  const ref = useReveal();

  return (
    <section data-screen-label="Testimonial" style={{ background: 'var(--cream)', padding: '140px 0 160px', borderTop: '1px solid var(--line)' }}>
      <div className="container-narrow" ref={ref} className="reveal">
        <div className="eyebrow" style={{ marginBottom: 48, textAlign: 'center' }}>Client Voices</div>

        <blockquote style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(28px, 3.5vw, 52px)',
          lineHeight: 1.2,
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'var(--ink)',
          textAlign: 'center',
          letterSpacing: '-0.01em',
          marginBottom: 56,
          minHeight: 220,
        }}>
          <span style={{ color: 'var(--accent)', fontSize: '1.4em', verticalAlign: '-0.2em', marginRight: 8 }}>"</span>
          {quotes[idx].text}
          <span style={{ color: 'var(--accent)', fontSize: '1.4em', verticalAlign: '-0.2em', marginLeft: 4 }}>"</span>
        </blockquote>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          {quotes.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 32 : 8, height: 8, borderRadius: 4,
                background: i === idx ? 'var(--teal-800)' : 'var(--line-2)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.3s',
                padding: 0,
              }}
            />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <span className="eyebrow" style={{ color: 'var(--ink-3)' }}>{quotes[idx].author} &middot; {quotes[idx].role}</span>
        </div>
      </div>
    </section>
  );
}

window.Testimonial = Testimonial;
