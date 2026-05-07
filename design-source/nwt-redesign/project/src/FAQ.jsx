// FAQ — accordion
function FAQ() {
  const items = [
    { q: 'What does Nichols Weitzner Thomas spell over the past five firms?', a: 'Unlike larger firms in our market, we\'re the operational equivalent of any one of the firms you might have heard of. Our partners managed and built the business of multinational firms before founding NWT. As a result, our team is fluent across firm operations, billing models, conflict checking, and matter management.' },
    { q: 'Why should we consider outside general counsel instead of project-based legal work?', a: 'Outside general counsel offers consistent, business-aligned legal support without the overhead of an in-house team. Your matters are handled by attorneys who already understand your business, with predictable monthly retainers.' },
    { q: 'I\'ve been burned by attorneys who didn\'t understand my business. How do I know you\'re different?', a: 'Our attorneys have run businesses, served on boards, and led divisions inside operating companies. We\'re not just legal advisors — we\'re business advisors who happen to practice law.' },
    { q: 'Do you work with businesses of all sizes?', a: 'Yes. We work with everyone from solo founders to publicly traded companies. Our model is built to scale with your stage and complexity.' },
    { q: 'What experience does your team have in healthcare law?', a: 'Our team has decades of combined experience in healthcare regulatory work, payor-provider disputes, transactions involving healthcare companies, and compliance counseling for providers across the spectrum.' },
    { q: 'What types of healthcare compliance issues does your firm handle?', a: 'HIPAA, Stark, anti-kickback, Medicare/Medicaid billing, state licensure, corporate practice of medicine, fee-splitting, and audit defense — to name several.' },
    { q: 'What makes a good healthcare litigation lawyer?', a: 'Deep substantive knowledge of healthcare regulation, sharp courtroom instincts, and the operational understanding to know what a win actually looks like for the client\'s business.' },
  ];
  const [open, setOpen] = useState(0);
  const ref = useReveal();

  return (
    <section data-screen-label="FAQ" style={{ background: 'var(--cream)', padding: '160px 0 180px', borderTop: '1px solid var(--line)' }}>
      <div className="container-wide" ref={ref} className="reveal">
        <div style={{ marginBottom: 80, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--line-2)', paddingBottom: 24 }}>
          <div className="eyebrow"><span style={{ color: 'var(--accent)', marginRight: 10 }}>08</span> Frequently Asked</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 80, alignItems: 'start' }}>
          <h2 className="display" style={{ fontSize: 'clamp(40px, 4.5vw, 60px)', color: 'var(--ink)', position: 'sticky', top: 120 }}>
            Frequently Asked <span className="display-italic" style={{ color: 'var(--teal-800)' }}>Questions.</span>
          </h2>

          <div>
            {items.map((it, i) => (
              <FaqRow key={i} {...it} isOpen={open === i} onClick={() => setOpen(open === i ? -1 : i)} isLast={i === items.length - 1}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqRow({ q, a, isOpen, onClick, isLast }) {
  return (
    <div style={{ borderBottom: isLast ? 'none' : '1px solid var(--line-2)' }}>
      <button onClick={onClick} style={{
        width: '100%', textAlign: 'left',
        background: 'transparent', border: 'none', cursor: 'pointer',
        padding: '28px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 24,
        fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 400,
        color: isOpen ? 'var(--teal-800)' : 'var(--ink)',
        letterSpacing: '-0.01em',
        transition: 'color 0.3s',
      }}>
        <span style={{ flex: 1 }}>{q}</span>
        <span style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '1px solid var(--line-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
          transition: 'transform 0.3s',
          color: 'var(--ink)',
        }}>
          <Icon.Plus size={14}/>
        </span>
      </button>
      <div style={{
        maxHeight: isOpen ? 400 : 0,
        opacity: isOpen ? 1 : 0,
        overflow: 'hidden',
        transition: 'all 0.45s ease',
      }}>
        <p className="body-lg" style={{ paddingBottom: 32, maxWidth: 720 }}>{a}</p>
      </div>
    </div>
  );
}

window.FAQ = FAQ;
