# Spring Lake Kitchen — porting notes (Airo → Cloudflare)

Source: `https://m3veo1xd7m.preview.c37.airoapp.ai` (Airo preview, running a Vite dev
server, so the original TSX sources were readable rather than just the built bundle).

## What the site actually is

React 18 + Vite + React Router + Tailwind (shadcn token setup) + Framer Motion
(`motion/react`) + lucide-react icons + `@dr.pogodin/react-helmet` for head tags.

Page copy is NOT hardcoded. It lives in `src/content/pages/*.json` and is injected
through a Vite virtual module (`virtual:content`). That part ports cleanly — the
virtual module just needs replacing with plain JSON imports.

## Pages

| Route | File | Ports cleanly? |
|---|---|---|
| `/` | `src/pages/index.tsx` | Yes |
| `/menu` | `src/pages/menu.tsx` | **No — see commerce below** |
| `/order-received` | `src/pages/order-received.tsx` | Yes (shell only) |
| `*` | `src/pages/_404.tsx` | Yes |
| — | `src/pages/custom-orders.tsx` | Exists but is **not wired into `routes.tsx`** — it is dead code on the live site. The form posts to Airo's `/api/contact/custom-orders`. |

## The blocker: commerce

`/menu` is a real storefront (browse, cart, quantity, checkout). It does none of
that itself — it calls Airo-hosted server endpoints:

- `GET  /api/commerce/products?first=48`
- `GET  /api/commerce/cart/:id`
- `PATCH/DELETE /api/commerce/cart/:id/items/:itemId`
- `POST /api/commerce/checkout`  → returns a hosted checkout URL

Those are Airo's server proxying GoDaddy's commerce GraphQL with credentials this
side never sees. On Cloudflare they do not exist. The cart and payment layer has to
be replaced, not ported.

The catalog itself is captured in `src/content/catalog-snapshot.json` (11 products,
prices in cents) so nothing is lost.

## Assets

Images are served from Airo at `/airo-assets/images/...` and need to be pulled down
into the repo:

- Logo (horizontal, light) — 659 KB PNG. Oversized for a header logo; worth
  re-exporting.
- `pages/home/hero-baked-goods` — 284 KB WebP
- `pages/home/kitchen-recipe-bread` — 239 KB JPEG
- `pages/home/menu-cinnamon-rolls` — 85 KB PNG
- 8 product images (16–85 KB each)
- 3 products have **no image** on the live site: cinnamon-brown-sugar-bread,
  cinnamon-raisin-bread, jalapeno-cheddar-bread

## Things worth fixing in the rebuild

1. `siteUrl` is hardcoded to the Airo preview host in every page, and it feeds the
   canonical tag, all OG/Twitter image URLs, and the JSON-LD `@id`s. Every one of
   those currently points at the preview domain.
2. Header nav uses `#menu` / `#pickup` / `#our-kitchen` anchors, and the "Today's
   menu" button also goes to `#menu` rather than `/menu`. From any page other than
   the home page those anchors go nowhere.
3. Footer "From the pantry" links have the same anchor-only problem.
4. Home page menu section still says "Our full menu is coming next" while a full
   11-item menu is live at `/menu`.
5. No phone number, email, or address anywhere on the site — pickup details are
   "announced with each weekly menu drop."
