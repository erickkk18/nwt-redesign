// "We've reimagined what a client-attorney relationship should look like"
function Approach() {
  const ref = useReveal();

  const pillars = [
    {
      title: 'We Solve Problems, Not Create Them',
      desc: 'We will achieve your business objectives in a defined timeframe, on or under budget. We aim to give you definitive answers and pragmatic advice based on real-world experience.',
    },
    {
      title: 'We Stay Accessible',
      desc: 'We answer the phone or email when you call. We aim for next-day responses to most inquiries, and same-day to anything urgent. Your matter receives the focus it deserves.',
    },
    {
      title: 'We Anticipate Tomorrow\'s Challenges',
      desc: 'To serve, who would dare to think will need to know more, anticipate even more clearly the new technologies of our future and apply that knowledge to your work today.',
    },
    {
      title: 'We Save You Time, Money, and Stress',
      desc: 'Legal services are an investment in your business. We will work efficiently to add value and bring tangible results to ensure long-term success.',
    },
  ];

  return (
    <section
      id="approach"
      data-screen-label="Approach"
      style={{
        background: 'var(--paper)',
        padding: '160px 0',
      }}
    >
      <div className="container-wide" ref={ref} className="reveal">
        <div style={{ marginBottom: 80, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 24 }}>
          <div className="eyebrow"><span style={{ color: 'var(--accent)', marginRight: 10 }}>03</span> How We Work</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 100, alignItems: 'flex-start' }}>
          {/* Left — image + heading */}
          <div style={{ position: 'sticky', top: 120 }}>
            <h2 className="display" style={{ fontSize: 'clamp(40px, 4.5vw, 64px)', marginBottom: 40, color: 'var(--ink)' }}>
              We've reimagined what a <span className="display-italic" style={{ color: 'var(--teal-800)' }}>client-attorney</span> relationship should look like.
            </h2>
            <div style={{ position: 'relative', marginBottom: 32 }}>
              <Placeholder label="Workspace — pen, glasses, paper" ratio="4/3" tone="cream"/>
            </div>
            <a href="#contact" className="btn btn-primary">Get In Touch <Icon.Arrow size={14}/></a>
          </div>

          {/* Right — pillars */}
          <div>
            {pillars.map((p, i) => (
              <Pillar key={i} {...p} index={i}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillar({ title, desc, index }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" style={{
      padding: '32px 0',
      borderBottom: '1px solid var(--line)',
      display: 'grid',
      gridTemplateColumns: '40px 1fr',
      gap: 24,
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'var(--teal-50)',
        color: 'var(--teal-800)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon.Check size={16}/>
      </div>
      <div>
        <h3 className="display" style={{ fontSize: 28, marginBottom: 12, color: 'var(--ink)' }}>{title}</h3>
        <p className="body" style={{ maxWidth: 560 }}>{desc}</p>
      </div>
    </div>
  );
}

window.Approach = Approach;
