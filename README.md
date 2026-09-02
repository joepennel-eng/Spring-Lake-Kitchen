# The Spring Lake Kitchen Company

The bakery site, lifted off Airo and rebuilt to run on Cloudflare Pages.

React 19 + Vite + React Router 7 + Tailwind. The storefront that used to run on
Airo's hosted commerce now runs on Stripe Checkout through a Cloudflare Pages
Function.

---

## First run (only if you want to preview locally)

```bash
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173). Needs Node 18, 20,
or 22+. Opening `index.html` by double-clicking it will show a blank page — this
is a React app, so it has to be served over http, not opened as a file.

You do **not** need any of this to deploy. Cloudflare builds it for you.

### About the images

The site's images still live on the old Airo preview. `scripts/fetch-assets.mjs`
runs automatically as a `prebuild` step, so every build pulls them down into
`public/images/`. Images already present in the repo are never overwritten, and a
failed download never fails the build.

This is a bootstrap, not a permanent arrangement. Once you have the originals:
commit `public/images/`, then delete the script and the `"prebuild"` line in
`package.json` so the site stops depending on Airo being online.

## Deploying to Cloudflare Pages

Push this to a Git repo (GitHub or GitLab), then in the Cloudflare dashboard:
Workers & Pages → Create → Pages → Connect to Git.

Build settings:

- Framework preset: **None**
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: leave blank (unless the repo has the project in a subfolder)

Cloudflare picks up the `functions/` directory automatically, so `/api/checkout`
and `/api/contact` deploy alongside the site. Nothing extra to configure.

Then set these environment variables in the Pages project (Settings → Environment
   variables). Mark the secrets as **encrypted**:

   | Variable | What it is |
   |---|---|
   | `VITE_SITE_URL` | The real public origin, e.g. `https://springlakekitchen.com`. Feeds canonical tags, OG images, and JSON-LD. **Set this or SEO points at the wrong domain.** |
   | `STRIPE_SECRET_KEY` | Stripe secret key (`sk_live_…`). Secret. |
   | `RESEND_API_KEY` | Resend API key, for the custom-orders inquiry email. Secret. |
   | `CONTACT_TO` | Where inquiries land, e.g. `hello@springlakekitchen.com` |
   | `CONTACT_FROM` | A verified Resend sender on the domain |

`VITE_SITE_URL` is baked in at build time, so changing it needs a redeploy. The
rest are read at request time by the Functions.

The site deploys fine before any of these are set. Without `STRIPE_SECRET_KEY`,
checkout returns "Checkout is not configured yet" instead of breaking; without
the Resend variables, the custom-orders form says the same. Everything else works.

## How ordering works now

- The menu is a static list in `src/content/catalog-snapshot.json` (prices in cents).
- The cart lives in the browser's `localStorage`. Nothing server-side holds it.
- "Secure checkout" POSTs `{ name, quantity }` pairs to `/api/checkout`.
  **Prices are looked up server-side from the same catalog file** — a tampered
  cart can't change what gets charged.
- The Function creates a Stripe Checkout Session and returns its URL. Stripe
  handles the card, the receipt, and the confirmation email.
- Checkout collects a phone number and a "Preferred pickup date" custom field,
  and shows the 48-hour notice on the payment page.

To change a price or add an item, edit `src/content/catalog-snapshot.json` and
redeploy. New items need a photo at `public/images/products/<name>.jpg` and the
matching `image` path in the JSON; without one the card falls back to a leaf icon.

There is no Stripe webhook yet, so a customer who pays and then closes the tab
before the redirect still gets a Stripe receipt, but nothing on this site records
the order. If order records matter, the next step is a webhook Function writing
to a Cloudflare D1 table or KV.

## Editing copy

Page text lives in `src/content/pages/*.json`, not in the components. Editing
`home.json` changes the home page. The Airo `virtual:content` module was replaced
by plain JSON imports in `src/content/index.ts`.

## Layout of the repo

```
functions/api/checkout.ts   Stripe Checkout session (Pages Function)
functions/api/contact.ts    Custom-orders inquiry -> email via Resend
public/images/              Site + product images (populated by fetch-assets)
src/content/                Page copy + product catalog
src/layouts/                Header, Footer, page shell
src/pages/                  index, menu, custom-orders, order-received, _404
src/styles/globals.css      Theme tokens (colors, fonts, radii, shadows)
```

## Still open

- Three products have no photo: cinnamon-brown-sugar-bread,
  cinnamon-raisin-bread, jalapeno-cheddar-bread.
- The photos that do exist are small originals — the product shots are 240x320,
  and the cinnamon roll image on the home page is 148x194 but rendered nearly
  full-height. They look soft on a large screen. Re-shooting or re-uploading at
  higher resolution is the single biggest visual win available.
- The logo is a 659 KB PNG at 600px wide. Worth re-exporting at header size.
- The home page still says "Our full menu is coming next" while `/menu` has all
  11 items live. Copy fix in `src/content/pages/home.json`.
- No phone, email, or address anywhere on the site.
- `/custom-orders` existed in the Airo project but was never routed. It is routed
  here and linked from the header and footer.
