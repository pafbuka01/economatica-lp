// src/components/islands/ContactForm.tsx
// React island — qualification form with client validation + submit state.
//
// Submits to /api/contact (Astro serverless route). See README section 8.

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
      <div className="contact-success card">
        <h3>{t.success}</h3>
      </div>
    );
  }

  return (
    <div className="contact-grid">
      <form className="contact-form card" onSubmit={onSubmit} noValidate>
        <div className="form-row">
          <Field name="name" label="Nome" error={errors.name} />
          <Field name="email" label={t.email} type="email" error={errors.email} />
        </div>
        <div className="form-row">
          <Field name="company" label={t.company} error={errors.company} />
          <Field name="role" label={t.role} />
        </div>
        <div className="form-row">
          <Select name="size" label={t.size} options={t.sizes} />
          <Select name="segment" label={t.segment} options={t.segments} />
        </div>
        <div className="form-row">
          <Select name="integration" label={t.integration} options={t.integrations} />
          <Field name="phone" label={t.phone} type="tel" />
        </div>
        <label className="form-field">
          <span>{t.usecase}</span>
          <textarea name="usecase" rows={4} placeholder={t.usecasePlaceholder} />
        </label>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? '…' : t.submit}
        </button>
        {status === 'error' && (
          <p style={{ color: 'var(--red)', marginTop: 8 }}>
            Algo deu errado. Tente novamente ou escreva para sales@economatica.com
          </p>
        )}
      </form>

      <aside className="contact-sidebar">
        <h4>{t.sidebarTitle}</h4>
        <ol className="contact-steps">
          {t.sidebarSteps.map((s, i) => (
            <li key={i}>
              <span className="step-num mono">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <strong>{s.t}</strong>
                <p>{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}

function Field({
  name, label, type = 'text', error,
}: { name: string; label: string; type?: string; error?: string }) {
  return (
    <label className={`form-field ${error ? 'has-error' : ''}`}>
      <span>{label}</span>
      <input name={name} type={type} required />
      {error && <em>{error}</em>}
    </label>
  );
}

function Select({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <select name={name} defaultValue="">
        <option value="" disabled>—</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
