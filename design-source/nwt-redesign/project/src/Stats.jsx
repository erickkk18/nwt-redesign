// "Big law experience in a boutique format" — animated stats
function Stats() {
  const ref = useReveal();
  const [attorneys, attorneysRef] = useCounter(53);
  const [years, yearsRef] = useCounter(370);
  const [cases, casesRef] = useCounter(3284);

  return (
    <section data-screen-label="Stats" style={{
      background: 'var(--teal-800)',
      color: 'var(--cream)',
      padding: '160px 0 180px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle at 30% 30%, rgba(199,112,74,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(20,97,122,0.4) 0%, transparent 60%)`,
        pointerEvents: 'none',
      }}/>

      <div className="container-wide" ref={ref} className="reveal" style={{ position: 'relative' }}>
        <div className="eyebrow" style={{ color: 'rgba(246,242,234,0.55)', marginBottom: 32 }}>
          <span style={{ color: 'var(--accent)', marginRight: 10 }}>05</span>
          About Us
        </div>

        <h2 className="display" style={{
          fontSize: 'clamp(48px, 6vw, 96px)',
          color: 'var(--cream)',
          maxWidth: 1100,
          marginBottom: 100,
        }}>
          Big law experience in a <span className="display-italic" style={{ color: 'var(--teal-100)' }}>boutique</span> format.
        </h2>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 0,
          borderTop: '1px solid rgba(246,242,234,0.18)',
          marginBottom: 80,
        }}>
          <StatCell ref={attorneysRef} value={attorneys} suffix="" label="Combined attorneys" sub="Partners, counsel, associates"/>
          <StatCell ref={yearsRef} value={years} suffix="+" label="Years of practice" sub="Combined experience"/>
          <StatCell ref={casesRef} value={cases.toLocaleString()} suffix="" label="Matters resolved" sub="Across our practice areas" isLast/>
        </div>

        {/* Cities marquee */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '8px 40px',
          fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 300,
          color: 'rgba(246,242,234,0.85)',
          paddingTop: 40,
          borderTop: '1px solid rgba(246,242,234,0.18)',
        }}>
          {['Houston', 'Austin', 'Dallas', 'The Woodlands', 'San Antonio', 'El Paso', 'Corpus Christi', 'Galveston', 'San Angelo', 'Fort Worth'].map((city, i, arr) => (
            <React.Fragment key={city}>
              <span>{city}</span>
              {i < arr.length - 1 && <span style={{ color: 'var(--accent)' }}>·</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

const StatCell = React.forwardRef(({ value, suffix, label, sub, isLast }, ref) => (
  <div ref={ref} style={{
    padding: '48px 32px 32px 0',
    borderRight: isLast ? 'none' : '1px solid rgba(246,242,234,0.18)',
  }}>
    <div className="display" style={{
      fontSize: 'clamp(80px, 10vw, 156px)',
      lineHeight: 0.9,
      color: 'var(--cream)',
      marginBottom: 24,
      fontFeatureSettings: '"lnum"',
    }}>
      {value}{suffix}
    </div>
    <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontStyle: 'italic', fontWeight: 300, color: 'var(--teal-100)', marginBottom: 6 }}>
      {label}
    </div>
    <div className="eyebrow" style={{ color: 'rgba(246,242,234,0.5)' }}>{sub}</div>
  </div>
));

window.Stats = Stats;
