import catalog from '../../src/content/catalog-snapshot.json';

interface Env {
  STRIPE_SECRET_KEY: string;
}

type IncomingItem = { name?: unknown; quantity?: unknown };

const MAX_QTY_PER_LINE = 50;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.STRIPE_SECRET_KEY) {
    return json({ error: 'Checkout is not configured yet.' }, 500);
  }

  let payload: { items?: IncomingItem[]; successUrl?: string; cancelUrl?: string };
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const origin = new URL(request.url).origin;
  // Never trust client-supplied redirect targets pointing off-site.
  const safeUrl = (value: unknown, fallback: string) => {
    if (typeof value !== 'string') return fallback;
    try {
      const url = new URL(value);
      return url.origin === origin ? url.toString() : fallback;
    } catch {
      return fallback;
    }
  };

  const successUrl = safeUrl(payload.successUrl, `${origin}/order-received`);
  const cancelUrl = safeUrl(payload.cancelUrl, `${origin}/menu`);

  const incoming = Array.isArray(payload.items) ? payload.items : [];
  if (!incoming.length) return json({ error: 'Your cart is empty.' }, 400);

  // Price and label come from the server-side catalog, never from the browser.
  const lines: Array<{ label: string; price: number; quantity: number }> = [];
  for (const item of incoming) {
    const product = catalog.products.find((p) => p.name === item.name);
    if (!product) continue;
    const quantity = Math.min(
      MAX_QTY_PER_LINE,
      Math.max(1, Math.floor(Number(item.quantity) || 0))
    );
    lines.push({ label: product.label, price: product.price, quantity });
  }
  if (!lines.length) return json({ error: 'Those items are no longer available.' }, 400);

  const form = new URLSearchParams();
  form.set('mode', 'payment');
  form.set('success_url', successUrl);
  form.set('cancel_url', cancelUrl);
  form.set('phone_number_collection[enabled]', 'true');
  form.set('custom_fields[0][key]', 'pickupdate');
  form.set('custom_fields[0][type]', 'text');
  form.set('custom_fields[0][label][type]', 'custom');
  form.set('custom_fields[0][label][custom]', 'Preferred pickup date');
  form.set('custom_text[submit][message]',
    'Orders need at least 48 hours notice. We will confirm your Memphis pickup window by email.');

  lines.forEach((line, index) => {
    form.set(`line_items[${index}][price_data][currency]`, 'usd');
    form.set(`line_items[${index}][price_data][product_data][name]`, line.label);
    form.set(`line_items[${index}][price_data][unit_amount]`, String(line.price));
    form.set(`line_items[${index}][quantity]`, String(line.quantity));
  });

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form,
  });

  const session = (await response.json()) as { url?: string; error?: { message?: string } };
  if (!response.ok || !session.url) {
    console.error('Stripe checkout failed', session.error?.message);
    return json({ error: 'Unable to start checkout.' }, 502);
  }

  return json({ url: session.url });
};
