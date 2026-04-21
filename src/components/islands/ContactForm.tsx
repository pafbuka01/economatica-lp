import { useState } from 'react';

type ContactDict = {
  email: string; company: string; role: string; size: string; sizes: string[];
  segment: string; segments: string[];
  integration: string; integrations: string[];
  phone: string; usecase: string; usecasePlaceholder: string;
  submit: string; success: string;
  sidebarTitle: string;
  sidebarSteps: { t: string; d: string }[];
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm({ t, locale }: { t: ContactDict; locale: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    const errs: Record<string, string> = {};
    if (!data.name?.trim()) errs.name = 'required';
    if (!emailRe.test(data.email || '')) errs.email = 'invalid email';
    if (!data.company?.trim()) errs.company = 'required';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error('submit failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="form-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#10003;</div>
        <h3>{t.success}</h3>
      </div>
    );
  }

  return (
    <div className="contact-grid">
      <form className="form-card" onSubmit={onSubmit} noValidate>
        <div className="form-row two">
          <div>
            <label className="form-label">Nome</label>
            <input name="name" type="text" className={`form-input ${errors.name ? 'has-error' : ''}`} required />
            {errors.name && <em style={{ color: 'var(--red)', fontSize: 12 }}>{errors.name}</em>}
          </div>
          <div>
            <label className="form-label">{t.email}</label>
            <input name="email" type="email" className={`form-input ${errors.email ? 'has-error' : ''}`} required />
            {errors.email && <em style={{ color: 'var(--red)', fontSize: 12 }}>{errors.email}</em>}
          </div>
        </div>
        <div className="form-row two">
          <div>
            <label className="form-label">{t.company}</label>
            <input name="company" type="text" className={`form-input ${errors.company ? 'has-error' : ''}`} required />
            {errors.company && <em style={{ color: 'var(--red)', fontSize: 12 }}>{errors.company}</em>}
          </div>
          <div>
            <label className="form-label">{t.role}</label>
            <input name="role" type="text" className="form-input" />
          </div>
        </div>
        <div className="form-row two">
          <div>
            <label className="form-label">{t.size}</label>
            <select name="size" className="form-select" defaultValue="">
              <option value="" disabled>&mdash;</option>
              {t.sizes.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">{t.segment}</label>
            <select name="segment" className="form-select" defaultValue="">
              <option value="" disabled>&mdash;</option>
              {t.segments.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row two">
          <div>
            <label className="form-label">{t.integration}</label>
            <select name="integration" className="form-select" defaultValue="">
              <option value="" disabled>&mdash;</option>
              {t.integrations.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">{t.phone}</label>
            <input name="phone" type="tel" className="form-input" />
          </div>
        </div>
        <div className="form-row">
          <label className="form-label">{t.usecase}</label>
          <textarea name="usecase" className="form-textarea" rows={4} placeholder={t.usecasePlaceholder} />
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: 8 }}
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? '...' : t.submit}
        </button>
        {status === 'error' && (
          <p style={{ color: 'var(--red)', marginTop: 8, fontSize: 14 }}>
            Algo deu errado. Tente novamente ou escreva para sales@economatica.com
          </p>
        )}
      </form>

      <aside className="contact-sidebar">
        <h4 style={{ marginBottom: 24 }}>{t.sidebarTitle}</h4>
        {t.sidebarSteps.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
            <span className="mono" style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--accent)',
              flexShrink: 0,
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--accent-soft)',
              borderRadius: 8,
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <strong style={{ display: 'block', fontSize: 15, color: 'var(--fg)', marginBottom: 4 }}>{s.t}</strong>
              <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.5 }}>{s.d}</p>
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}
