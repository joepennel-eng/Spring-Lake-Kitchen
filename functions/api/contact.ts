interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO: string;    // where inquiries land, e.g. hello@springlakekitchen.com
  CONTACT_FROM: string;  // a verified Resend sender on your domain
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function esc(value: unknown): string {
  return String(value ?? '')
    .slice(0, 2000)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: 'Invalid request.' }, 400);
  }

  // Honeypot — bots fill hidden fields, people don't.
  if (body._gotcha) return json({ success: true });

  const name = esc(body.name);
  const email = esc(body.email);
  if (!name || !email.includes('@')) {
    return json({ success: false, error: 'Please include your name and a valid email.' }, 400);
  }

  const rows = [
    ['Name', name],
    ['Email', email],
    ['Phone', esc(body.phone)],
    ['Occasion', esc(body.occasion)],
    ['Needed by', esc(body.neededBy)],
    ['Guest count', esc(body.guestCount)],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `<tr><td><strong>${label}</strong></td><td>${value}</td></tr>`)
    .join('');

  const html = `<h2>New custom order inquiry</h2>
<table cellpadding="6">${rows}</table>
<h3>Message</h3>
<p>${esc(body.message).replace(/\n/g, '<br>')}</p>`;

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    console.error('Contact form is not configured (RESEND_API_KEY / CONTACT_TO / CONTACT_FROM)');
    return json({ success: false, error: 'The inquiry form is not set up yet.' }, 500);
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: email,
      subject: `Custom order inquiry — ${name}`,
      html,
    }),
  });

  if (!response.ok) {
    console.error('Resend failed', await response.text());
    return json({ success: false, error: 'We could not send that just now.' }, 502);
  }

  return json({ success: true });
};
