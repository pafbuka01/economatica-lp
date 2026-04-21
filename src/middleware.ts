import { defineMiddleware } from 'astro:middleware';

const USERNAME = 'admin';
const PASSWORD = 'batman01$';

function unauthorized() {
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Economatica LP Preview"',
      'Cache-Control': 'no-store',
    },
  });
}

export const onRequest = defineMiddleware(async ({ request }, next) => {
  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Basic ')) return unauthorized();

  try {
    const encoded = auth.slice(6);
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    const idx = decoded.indexOf(':');
    const user = idx >= 0 ? decoded.slice(0, idx) : '';
    const pass = idx >= 0 ? decoded.slice(idx + 1) : '';

    if (user !== USERNAME || pass !== PASSWORD) return unauthorized();
  } catch {
    return unauthorized();
  }

  return next();
});
