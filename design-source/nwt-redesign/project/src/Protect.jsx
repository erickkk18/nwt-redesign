// "We Protect Everything You've Built" + "A Different Kind of Texas Law Firm"
function Protect() {
  const ref1 = useReveal();
  const ref2 = useReveal();
  const ref3 = useReveal();

  return (
    <section data-screen-label="Protect" style={{ background: 'var(--paper)', padding: '160px 0 140px' }}>
      <div className="container-wide">

        {/* Section eyebrow */}
        <div ref={ref1} className="reveal" style={{ marginBottom: 100, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 24 }}>
          <div className="eyebrow">
            <span style={{ color: 'var(--accent)', marginRight: 10 }}>01</span>
            The Firm
          </div>
          <div className="eyebrow" style={{ color: 'var(--ink-4)' }}>Houston &middot; Austin &middot; Dallas</div>
        </div>

        {/* First block — type left, image right */}
        <div ref={ref2} className="reveal" style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: 100,
          alignItems: 'center',
          marginBottom: 140,
        }}>
          <div>
            <h2 className="display" style={{ fontSize: 'clamp(44px, 5vw, 76px)', marginBottom: 32, color: 'var(--ink)' }}>
              We Protect Everything <span className="display-italic" style={{ color: 'var(--teal-800)' }}>You've Built.</span>
            </h2>
            <p className="body-lg" style={{ maxWidth: 520 }}>
              Legal challenges don't pause if you fail to do so. They threaten your business, partnerships, and everything you've worked to build. Our highly-experienced team handles the toughest cases.
            </p>
            <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 24 }}>
              <a href="#" className="ulink" style={{ fontSize: 14, fontWeight: 500 }}>What we do</a>
              <span style={{ width: 24, height: 1, background: 'var(--line-2)' }}/>
              <a href="#" className="ulink" style={{ fontSize: 14, fontWeight: 500 }}>Read about our cases</a>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <Placeholder label="Attorney with client — desk shot" ratio="4/3" tone="cream"/>
            <div style={{
              position: 'absolute', bottom: -28, left: -28,
              background: 'var(--cream)', padding: '16px 22px',
              fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'var(--ink-2)', border: '1px solid var(--line)',
            }}>
              <span style={{ color: 'var(--accent)', marginRight: 8 }}>◆</span>
              19 Years of Practice
            </div>
          </div>
        </div>

        {/* Second block — image left, type right (asymmetric) */}
        <div ref={ref3} className="reveal" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: 100,
          alignItems: 'center',
        }}>
          <div style={{ position: 'relative' }}>
            <Placeholder label="Modern desk — laptop & docs" ratio="5/4" tone="cream"/>
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: 20, color: 'var(--teal-800)' }}>A Different Kind of Texas Law Firm</div>
            <h2 className="display" style={{ fontSize: 'clamp(36px, 4vw, 58px)', marginBottom: 28, color: 'var(--ink)', maxWidth: 640 }}>
              At Nichols Weitzner, we know big <span className="display-italic">law</span> — we've managed it.
            </h2>
            <p className="body-lg" style={{ maxWidth: 580, marginBottom: 20 }}>
              Our legal experience has been augmented by hard-earned business experience and the ability to put yourself, your team and your work first.
            </p>
            <p className="body-lg" style={{ maxWidth: 580 }}>
              When you work with us, you'll immediately notice the <a href="#" className="ulink" style={{ color: 'var(--teal-800)', fontWeight: 500 }}>difference</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Protect = Protect;
