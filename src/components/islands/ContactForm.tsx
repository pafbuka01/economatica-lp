import { useState } from 'react';

type ContactDict = {
  email: string; company: string; role: string; size: string; sizes: string[];
  segment: string; segments: string[];
  integration: string; integrations: string[];
  phone: string; usecase: string; usecasePlaceholder: string;
  submit: string; success: string;
  sidebarTitle: string;
  sidebarSteps: { t: string; d: string }[];
  // new fields added via props
  usage?: string;
  usageOptions?: string[];
  companySize?: string;
  companySizes?: string[];
  estimatedUsers?: string;
};

type UsageType = '' | 'internal' | 'b2b' | 'b2b2c';
type Status = 'idle' | 'submitting' | 'success' | 'error';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatNumber(val: string): string {
  const digits = val.replace(/\D/g, '');
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const USAGE_LABELS: Record<string, Record<UsageType, string>> = {
  pt: { '': '', internal: 'Interno', b2b: 'B2B', b2b2c: 'B2B2C' },
  en: { '': '', internal: 'Internal', b2b: 'B2B', b2b2c: 'B2B2C' },
  es: { '': '', internal: 'Interno', b2b: 'B2B', b2b2c: 'B2B2C' },
};

const LABELS: Record<string, { usage: string; companySize: string; companySizes: string[]; estimatedUsers: string }> = {
  pt: {
    usage: 'Tipo de uso',
    companySize: 'Tamanho da empresa',
    companySizes: ['1\u201350', '50\u2013250', '250\u20131.000', '1.000+'],
    estimatedUsers: 'Usuarios finais estimados',
  },
  en: {
    usage: 'Usage type',
    companySize: 'Company size',
    companySizes: ['1\u201350', '50\u2013250', '250\u20131,000', '1,000+'],
    estimatedUsers: 'Estimated end users',
  },
  es: {
    usage: 'Tipo de uso',
    companySize: 'Tamano de la empresa',
    companySizes: ['1\u201350', '50\u2013250', '250\u20131.000', '1.000+'],
    estimatedUsers: 'Usuarios finales estimados',
  },
};

export default function ContactForm({ t, locale }: { t: ContactDict; locale: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [usageType, setUsageType] = useState<UsageType>('');
  const [estUsers, setEstUsers] = useState('');

  const loc = LABELS[locale] || LABELS.pt;
  const usageLabels = USAGE_LABELS[locale] || USAGE_LABELS.pt;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    data.usage_type = usageType;
    if (estUsers) data.estimated_users = estUsers.replace(/\D/g, '');

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
        {/* Row 1: Nome + Email */}
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

        {/* Row 2: Empresa + Cargo */}
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

        {/* Row 3: Tipo de uso + Segmento */}
        <div className="form-row two">
          <div>
            <label className="form-label">{loc.usage}</label>
            <div className="segments">
              {(['internal', 'b2b', 'b2b2c'] as UsageType[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`segment ${usageType === opt ? 'active' : ''}`}
                  onClick={() => setUsageType(usageType === opt ? '' : opt)}
                >
                  {usageLabels[opt]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="form-label">{t.segment}</label>
            <select name="segment" className="form-select" defaultValue="">
              <option value="" disabled>&mdash;</option>
              {t.segments.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Conditional row: Tamanho empresa (interno) OR Usuarios estimados (B2B/B2B2C) */}
        {usageType === 'internal' && (
          <div className="form-row two" style={{ animation: 'feedIn .3s ease both' }}>
            <div>
              <label className="form-label">{loc.companySize}</label>
              <select name="company_size" className="form-select" defaultValue="">
                <option value="" disabled>&mdash;</option>
                {loc.companySizes.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">{t.phone}</label>
              <input name="phone" type="tel" className="form-input" />
            </div>
          </div>
        )}

        {(usageType === 'b2b' || usageType === 'b2b2c') && (
          <div className="form-row two" style={{ animation: 'feedIn .3s ease both' }}>
            <div>
              <label className="form-label">{loc.estimatedUsers}</label>
              <input
                name="estimated_users"
                type="text"
                inputMode="numeric"
                className="form-input"
                placeholder="10.000"
                value={estUsers}
                onChange={(e) => setEstUsers(formatNumber(e.target.value))}
              />
            </div>
            <div>
              <label className="form-label">{t.phone}</label>
              <input name="phone" type="tel" className="form-input" />
            </div>
          </div>
        )}

        {/* Phone row when no usage selected */}
        {usageType === '' && (
          <div className="form-row two">
            <div>
              <label className="form-label">{t.phone}</label>
              <input name="phone" type="tel" className="form-input" />
            </div>
            <div />
          </div>
        )}

        {/* Caso de uso */}
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
