// Single source of truth for the public origin. Set VITE_SITE_URL in the
// Cloudflare Pages project (Settings -> Environment variables) once the real
// domain is attached; the fallback is only used for local dev.
export const siteUrl = (
  import.meta.env.VITE_SITE_URL ?? 'https://springlakekitchen.com'
).replace(/\/$/, '');

export const siteName = 'The Spring Lake Kitchen Company';
export const siteDescription =
  'Small-batch homemade baked goods for Memphis families, with local pickup details and weekly menu favorites.';
export const ogImage = '/images/hero-baked-goods.webp';
