// Big CTA + contact form
function Contact() {
  const ref = useReveal();
  const [form, setForm] = useState({ name: '', email: '', phone: '', firm: '', message: '' });

  const inputStyle = {
    width: '100%',
    padding: '16px 0',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--line-2)',
    fontFamily: 'var(--sans)',
    fontSize: 16,
    color: 'var(--ink)',
    outline: 'none',
    transition: 'border-color 0.3s',
  };
  const labelStyle = {
    fontFamily: 'var(--mono)',
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
    marginBottom: 8,
    display: 'block',
  };

  return (
    <>
      {/* CTA strip */}
      <section data-screen-label="CTA" style={{
        background: 'var(--ink)',
        color: 'var(--cream)',
        padding: '100px 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="container-wide" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 48, flexWrap: 'wrap',
        }}>
          <h2 className="display" style={{ fontSize: 'clamp(36px, 4vw, 60px)', maxWidth: 800, color: 'var(--cream)' }}>
            We bring proven experience with personalized counsel to <a href="#contact" className="display-italic" style={{ color: 'var(--accent)', borderBottom: '1px solid currentColor', textDecoration: 'none' }}>complex healthcare</a>.
          </h2>
          <a href="#contact" className="btn btn-light" style={{ padding: '18px 32px' }}>
            Get In Touch <Icon.Arrow size={14}/>
          </a>
        </div>
      </section>

      {/* Contact form */}
      <section id="contact" data-screen-label="Contact" style={{ background: 'var(--paper)', padding: '160px 0 120px' }}>
        <div className="container-wide" ref={ref} className="reveal">
          <div style={{ marginBottom: 80, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 24 }}>
            <div className="eyebrow"><span style={{ color: 'var(--accent)', marginRight: 10 }}>09</span> Contact</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 100 }}>
            <div>
              <h2 className="display" style={{ fontSize: 'clamp(36px, 4vw, 56px)', color: 'var(--ink)', marginBottom: 40 }}>
                Contact <span className="display-italic" style={{ color: 'var(--teal-800)' }}>Details.</span>
              </h2>

              <div style={{ display: 'grid', gap: 32 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>Houston Office</div>
                  <p className="body" style={{ color: 'var(--ink)' }}>
                    1717 West Loop South, Suite 1800<br/>
                    Houston, Texas 77027
                  </p>
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>Phone</div>
                  <p className="body" style={{ color: 'var(--ink)' }}>+1 (713) 555-0140</p>
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>Email</div>
                  <a href="#" className="ulink body" style={{ color: 'var(--ink)' }}>info@nwtlaw.example</a>
                </div>
              </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'grid', gap: 28 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={(e) => e.target.style.borderColor = 'var(--teal-800)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--line-2)'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={(e) => e.target.style.borderColor = 'var(--teal-800)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--line-2)'}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    onFocus={(e) => e.target.style.borderColor = 'var(--teal-800)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--line-2)'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Company / Firm</label>
                  <input style={inputStyle} value={form.firm} onChange={(e) => setForm({ ...form, firm: e.target.value })}
                    onFocus={(e) => e.target.style.borderColor = 'var(--teal-800)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--line-2)'}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>How can we help?</label>
                <textarea rows={4} style={{ ...inputStyle, resize: 'none' }} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onFocus={(e) => e.target.style.borderColor = 'var(--teal-800)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--line-2)'}
                />
              </div>
              <p className="body-sm" style={{ marginTop: 16 }}>
                Submitting this form does not create an attorney-client relationship. By contacting us, you acknowledge that we may not represent you until a formal engagement is established.
              </p>
              <div>
                <button type="submit" className="btn btn-primary" style={{ padding: '16px 32px' }}>
                  Send Message <Icon.Arrow size={14}/>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

window.Contact = Contact;
