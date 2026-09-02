import { Helmet } from '@dr.pogodin/react-helmet';
import { ArrowLeft, Leaf, Minus, Plus, Search, ShoppingBag, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { menu, products, type Product } from '@/content';
import { siteUrl } from '@/site';

const heroImage = '/images/hero-baked-goods.webp';
const cartStorageKey = 'spring-lake-kitchen-cart';

/** cart is { [product.name]: quantity } */
type Cart = Record<string, number>;

function formatPrice(cents: number | null | undefined): string {
  if (typeof cents !== 'number') return 'Price coming soon';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function readCart(): Cart {
  try {
    const raw = window.localStorage.getItem(cartStorageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Cart;
    if (!parsed || typeof parsed !== 'object') return {};
    // Drop anything that is no longer on the menu.
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([name, qty]) => typeof qty === 'number' && qty > 0 && products.some((p) => p.name === name)
      )
    );
  } catch {
    return {};
  }
}

export default function MenuPage() {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<Cart>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [cartError, setCartError] = useState('');

  useEffect(() => {
    setCart(readCart());
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    } catch {
      /* private browsing — cart just won't persist */
    }
  }, [cart]);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      `${product.label} ${product.description}`.toLowerCase().includes(query)
    );
  }, [search]);

  const lineItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([name, quantity]) => {
          const product = products.find((p) => p.name === name);
          return product ? { product, quantity } : null;
        })
        .filter((entry): entry is { product: Product; quantity: number } => entry !== null),
    [cart]
  );

  const itemCount = lineItems.reduce((sum, line) => sum + line.quantity, 0);
  const total = lineItems.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  function addProduct(product: Product) {
    setCartError('');
    setCart((current) => ({ ...current, [product.name]: (current[product.name] ?? 0) + 1 }));
    setCartOpen(true);
  }

  function updateQuantity(name: string, quantity: number) {
    if (quantity < 1) return;
    setCart((current) => ({ ...current, [name]: quantity }));
  }

  function removeItem(name: string) {
    setCart((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  async function checkout() {
    if (!lineItems.length) return;
    setCheckingOut(true);
    setCartError('');
    try {
      const origin = window.location.origin;
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Only names + quantities go up. Prices are looked up server-side so
          // a tampered cart can't change what gets charged.
          items: lineItems.map((line) => ({ name: line.product.name, quantity: line.quantity })),
          cancelUrl: `${origin}/menu`,
          successUrl: `${origin}/order-received`,
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || 'Unable to start checkout');
      window.localStorage.removeItem(cartStorageKey);
      window.location.assign(data.url);
    } catch {
      setCartError('We couldn’t start secure checkout. Please try again.');
      setCheckingOut(false);
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteUrl}/menu#webpage`,
    name: 'Bakery Menu | The Spring Lake Kitchen Company',
    url: `${siteUrl}/menu`,
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` },
  };

  return (
    <>
      <Helmet>
        <title>Bakery Menu | Spring Lake Kitchen</title>
        <meta name="description" content="Browse fresh small-batch breads and cinnamon rolls from The Spring Lake Kitchen Company in Memphis." />
        <link rel="canonical" href={`${siteUrl}/menu`} />
        <meta property="og:title" content="Bakery Menu | Spring Lake Kitchen" />
        <meta property="og:description" content="Browse fresh small-batch breads and cinnamon rolls from The Spring Lake Kitchen Company in Memphis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/menu`} />
        <meta property="og:image" content={`${siteUrl}${heroImage}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bakery Menu | Spring Lake Kitchen" />
        <meta name="twitter:description" content="Browse fresh small-batch breads and cinnamon rolls from The Spring Lake Kitchen Company in Memphis." />
        <meta name="twitter:image" content={`${siteUrl}${heroImage}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main className="bg-background px-5 py-12 text-foreground md:px-8 md:py-20">
        <section className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-foreground">
              <ArrowLeft size={16} aria-hidden="true" /> Back to home
            </Link>
            <button type="button" onClick={() => setCartOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">
              <ShoppingBag size={17} aria-hidden="true" /> Cart ({itemCount})
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 rounded-[2rem] border border-border bg-secondary p-8 md:p-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-primary"><Leaf size={16} aria-hidden="true" /> <span>{menu.hero.eyebrow}</span></p>
              <h1 className="mt-5 font-heading text-5xl leading-[0.98] md:text-7xl">{menu.hero.title}</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">{menu.hero.body}</p>
            </div>
            <div className="self-end rounded-[1.5rem] border border-border bg-card p-6">
              <label htmlFor="menu-search" className="text-sm font-bold text-foreground">{menu.hero.searchLabel}</label>
              <div className="mt-3 flex items-center gap-3 rounded-full border border-border bg-background px-4 py-3">
                <Search size={18} className="text-primary" aria-hidden="true" />
                <input id="menu-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={menu.hero.searchPlaceholder} className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{menu.hero.pickupNote}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-7xl" aria-labelledby="menu-list-title">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-primary">{menu.catalog.eyebrow}</p>
              <h2 id="menu-list-title" className="mt-2 font-heading text-4xl">{menu.catalog.title}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{menu.catalog.seasonalNote}</p>
          </div>

          {visibleProducts.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-border bg-card p-6 text-muted-foreground">{menu.catalog.empty}</p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => (
                <article key={product.name} className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm">
                  {product.image ? (
                    <img src={product.image} alt={product.label} width={800} height={600} loading="lazy" className="h-56 w-full object-cover" />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-muted text-muted-foreground"><Leaf size={34} aria-hidden="true" /></div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-heading text-2xl leading-tight">{product.label}</h3>
                      <span className="shrink-0 text-sm font-bold text-primary">{formatPrice(product.price)}</span>
                    </div>
                    <p className="mt-4 leading-7 text-muted-foreground">{product.description || menu.catalog.fallbackDescription}</p>
                    <div className="mt-6 flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-primary">{menu.catalog.pickupLabel}</p>
                      <button type="button" onClick={() => addProduct(product)} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Add to cart</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {cartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-foreground/40" role="dialog" aria-modal="true" aria-label="Shopping cart">
          <div className="flex h-full w-full max-w-md flex-col bg-background p-6 shadow-2xl md:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-heading text-3xl">Your cart</h2>
              <button type="button" onClick={() => setCartOpen(false)} className="rounded-full border border-border p-2 text-foreground" aria-label="Close cart"><X size={20} /></button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Local Memphis pickup is confirmed during checkout.</p>

            <div className="mt-7 flex-1 overflow-y-auto">
              {!lineItems.length ? (
                <p className="rounded-2xl bg-muted p-5 leading-7 text-muted-foreground">Your cart is ready when you are. Add a few fresh-baked favorites from the menu.</p>
              ) : (
                <div className="grid gap-4">
                  {lineItems.map(({ product, quantity }) => (
                    <div key={product.name} className="rounded-2xl border border-border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{product.label}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{formatPrice(product.price * quantity)}</p>
                        </div>
                        <button type="button" onClick={() => removeItem(product.name)} className="text-muted-foreground hover:text-destructive" aria-label={`Remove ${product.label}`}><Trash2 size={18} /></button>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <button type="button" onClick={() => updateQuantity(product.name, Math.max(1, quantity - 1))} disabled={quantity <= 1} className="rounded-full border border-border p-1.5 disabled:opacity-40" aria-label="Decrease quantity"><Minus size={15} /></button>
                        <span className="min-w-6 text-center font-bold">{quantity}</span>
                        <button type="button" onClick={() => updateQuantity(product.name, quantity + 1)} className="rounded-full border border-border p-1.5" aria-label="Increase quantity"><Plus size={15} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartError && <p role="alert" className="mt-4 rounded-xl bg-destructive p-3 text-sm font-semibold text-destructive-foreground">{cartError}</p>}

            <div className="mt-6 border-t border-border pt-5">
              <div className="flex items-center justify-between font-heading text-2xl"><span>Total</span><span>{formatPrice(total)}</span></div>
              <button type="button" onClick={checkout} disabled={!lineItems.length || checkingOut} className="mt-5 w-full rounded-full bg-primary px-5 py-3.5 font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">
                {checkingOut ? 'Preparing checkout…' : 'Secure checkout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
