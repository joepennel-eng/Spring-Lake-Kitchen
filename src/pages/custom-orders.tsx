import { Helmet } from '@dr.pogodin/react-helmet';
import { CalendarDays, CakeSlice, MapPin, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { custom_orders } from '@/content';
import { siteUrl } from '@/site';



type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export default function CustomOrdersPage() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const pageUrl = `${siteUrl}/custom-orders`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    name: 'Custom Orders | The Spring Lake Kitchen Company',
    url: pageUrl,
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` },
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    if (formData.get('_gotcha')) return;

    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();
    const occasion = String(formData.get('occasion') ?? '').trim();
    const neededBy = String(formData.get('neededBy') ?? '').trim();
    const guestCount = String(formData.get('guestCount') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();

    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, occasion, neededBy, guestCount, message }),
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.error || 'Something went wrong.');
      setStatus('success');
      form.reset();
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <>
      <Helmet>
        <title>Custom Orders | Spring Lake Kitchen</title>
        <meta name="description" content="Request a custom cake, event baking, breads, or sweet rolls for local Memphis pickup from The Spring Lake Kitchen Company." />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content="Custom Orders | Spring Lake Kitchen" />
        <meta property="og:description" content="Request a custom cake, event baking, breads, or sweet rolls for local Memphis pickup." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={`${siteUrl}/images/hero-baked-goods.webp`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Custom Orders | Spring Lake Kitchen" />
        <meta name="twitter:description" content="Request a custom cake, event baking, breads, or sweet rolls for local Memphis pickup." />
        <meta name="twitter:image" content={`${siteUrl}/images/hero-baked-goods.webp`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main className="bg-background px-5 py-14 text-foreground md:px-8 md:py-20">
        <section className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold text-primary">{custom_orders.hero.eyebrow}</p>
            <h1 className="mt-4 font-heading text-5xl leading-[0.98] md:text-7xl">{custom_orders.hero.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{custom_orders.hero.body}</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {custom_orders.highlights.map((highlight, index) => {
              const Icon = [CakeSlice, CalendarDays, MapPin][index];
              return <article key={highlight.id} className="rounded-[1.5rem] border border-border bg-card p-6">
                <Icon className="text-accent" aria-hidden="true" size={28} />
                <h2 className="mt-5 font-heading text-2xl">{highlight.title}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">{highlight.body}</p>
              </article>;
            })}
          </div>
        </section>

        <section className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] bg-secondary p-8 md:p-12">
            <p className="text-sm font-bold text-primary">Custom baking, simply planned</p>
            <h2 className="mt-4 font-heading text-4xl leading-tight md:text-5xl">{custom_orders.details.title}</h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{custom_orders.details.body}</p>
            <p className="mt-8 rounded-2xl bg-card p-5 font-semibold leading-7 text-foreground">Please reach out early for custom orders so we can confirm availability and give your bake the care it deserves.</p>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-7 shadow-sm md:p-10">
            <h2 className="font-heading text-3xl md:text-4xl">{custom_orders.form.title}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{custom_orders.form.intro}</p>
            <form className="mt-8 grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
              <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">Your name<input name="name" required className="rounded-xl border border-border bg-background px-4 py-3 text-base font-normal outline-none ring-ring focus:ring-2" /></label>
                <label className="grid gap-2 text-sm font-semibold">Email address<input name="email" type="email" required className="rounded-xl border border-border bg-background px-4 py-3 text-base font-normal outline-none ring-ring focus:ring-2" /></label>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">Phone number<input name="phone" type="tel" required className="rounded-xl border border-border bg-background px-4 py-3 text-base font-normal outline-none ring-ring focus:ring-2" /></label>
                <label className="grid gap-2 text-sm font-semibold">What are you celebrating?<select name="occasion" required defaultValue="" className="rounded-xl border border-border bg-background px-4 py-3 text-base font-normal outline-none ring-ring focus:ring-2"><option value="" disabled>Select an occasion</option><option>Birthday</option><option>Shower or party</option><option>Family gathering</option><option>Office or community event</option><option>Something else</option></select></label>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">When do you need it?<input name="neededBy" type="date" required className="rounded-xl border border-border bg-background px-4 py-3 text-base font-normal outline-none ring-ring focus:ring-2" /></label>
                <label className="grid gap-2 text-sm font-semibold">Estimated guest count<input name="guestCount" type="number" min="1" required className="rounded-xl border border-border bg-background px-4 py-3 text-base font-normal outline-none ring-ring focus:ring-2" /></label>
              </div>
              <label className="grid gap-2 text-sm font-semibold">Tell us what you have in mind<textarea name="message" rows={6} required className="resize-y rounded-xl border border-border bg-background px-4 py-3 text-base font-normal outline-none ring-ring focus:ring-2" /></label>
              {status === 'error' && <p role="alert" className="rounded-xl bg-destructive p-4 text-sm font-semibold text-destructive-foreground">{errorMessage}</p>}
              {status === 'success' && <p role="status" className="rounded-xl bg-secondary p-4 text-sm font-semibold text-foreground">{custom_orders.form.success}</p>}
              <button type="submit" disabled={status === 'sending'} className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"><Send size={17} aria-hidden="true" />{status === 'sending' ? 'Sending inquiry…' : custom_orders.form.submit}</button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
