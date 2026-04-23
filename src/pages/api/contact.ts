import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resendApiKey = import.meta.env.RESEND_API_KEY;
const resendFrom = import.meta.env.RESEND_FROM || 'Economatica <onboarding@resend.dev>';
const contactTo = import.meta.env.CONTACT_TO || 'info@economatica.com.br';

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const POST: APIRoute = async ({ request }) => {
  let payload: Record<string, string>;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const { name, email, company } = payload;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !emailRe.test(email || '') || !company) {
    return json({ ok: false, error: 'invalid_fields' }, 422);
  }

  if (!resend) {
    console.error('[contact] missing RESEND_API_KEY');
    return json({ ok: false, error: 'email_not_configured' }, 500);
  }

  const locale = payload.locale || 'pt';
  const subject = `[Eco News API] Novo lead — ${name} / ${company}`;
  const html = renderLeadEmail(payload, locale);

  try {
    const result = await resend.emails.send({
      from: resendFrom,
      to: [contactTo],
      replyTo: email,
      subject,
      html,
    });

    console.log('[contact] lead emailed', { name, email, company, result });
    return json({ ok: true, id: result.data?.id ?? null });
  } catch (error) {
    console.error('[contact] resend error', error);
    return json({ ok: false, error: 'email_send_failed' }, 500);
  }
};

function renderLeadEmail(payload: Record<string, string>, locale: string) {
  const usageMap: Record<string, Record<string, string>> = {
    pt: { internal: 'Interno', b2b: 'B2B', b2b2c: 'B2B2C' },
    en: { internal: 'Internal', b2b: 'B2B', b2b2c: 'B2B2C' },
    es: { internal: 'Interno', b2b: 'B2B', b2b2c: 'B2B2C' },
  };

  const usage = usageMap[locale]?.[payload.usage_type || ''] || payload.usage_type || '-';
  const rows = [
    ['Nome', payload.name],
    ['Email', payload.email],
    ['Empresa', payload.company],
    ['Cargo', payload.role],
    ['Telefone', payload.phone],
    ['Tipo de uso', usage],
    ['Tamanho da empresa', payload.company_size],
    ['Usuários finais estimados', payload.estimated_users],
    ['Caso de uso', payload.usecase],
    ['Idioma do formulário', locale],
  ].filter(([, value]) => value && String(value).trim() !== '');

  const rowsHtml = rows
    .map(([label, value]) => `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${escapeHtml(String(value)).replace(/\n/g, '<br/>')}</td></tr>`)
    .join('');

  return `
    <div style="font-family:Inter,Arial,sans-serif;color:#111827;line-height:1.5;">
      <h2 style="margin:0 0 16px;">Novo lead — Eco News API</h2>
      <p style="margin:0 0 16px;">Um novo formulário foi enviado pela landing page da Eco News API.</p>
      <table style="border-collapse:collapse;width:100%;max-width:760px;background:#ffffff;">
        ${rowsHtml}
      </table>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
