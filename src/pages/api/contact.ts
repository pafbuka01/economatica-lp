// src/pages/api/contact.ts
// Astro serverless route (requires output: 'server' + vercel serverless adapter).
// Forwards to your CRM / Slack / email provider of choice.

import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let payload: Record<string, string>;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  // Minimal server-side validation — mirror the client rules.
  const { name, email, company } = payload;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !emailRe.test(email || '') || !company) {
    return json({ ok: false, error: 'invalid_fields' }, 422);
  }

  // TODO: forward to your CRM / Slack / Sendgrid here.
  // Example: Slack webhook
  // await fetch(import.meta.env.SLACK_WEBHOOK_URL, {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     text: `New Eco News API lead: ${name} @ ${company} (${email})`,
  //   }),
  // });

  console.log('[contact] new lead', payload);

  return json({ ok: true });
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
