import { Helmet } from '@dr.pogodin/react-helmet';
import { ArrowDownRight, Clock3, Leaf, MapPin, Sprout } from 'lucide-react';
import { motion } from 'motion/react';
import { home } from '@/content';
import { siteUrl } from '@/site';


const heroImage = '/images/hero-baked-goods.webp';
const cinnamonRollsImage = '/images/menu-cinnamon-rolls.png';

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } }
} as const;

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'The Spring Lake Kitchen Company', url: `${siteUrl}/` },
    { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'The Spring Lake Kitchen Company', url: `${siteUrl}/` },
    { '@type': 'WebPage', '@id': `${siteUrl}/#webpage`, name: 'The Spring Lake Kitchen Company | Memphis Baked Goods', url: `${siteUrl}/`, isPartOf: { '@id': `${siteUrl}/#website` }, about: { '@id': `${siteUrl}/#organization` }, datePublished: '2026-08-28', dateModified: '2026-08-28' },
    { '@type': 'LocalBusiness', '@id': `${siteUrl}/#business`, name: 'The Spring Lake Kitchen Company', url: `${siteUrl}/`, address: { '@type': 'PostalAddress', addressLocality: 'Memphis', addressRegion: 'TN', addressCountry: 'US' } }]

  };

  return (
    <>
      <Helmet>
        <title>The Spring Lake Kitchen Company | Memphis Baked Goods</title>
        <meta name="description" content="Small-batch homemade baked goods for Memphis families, with local pickup details and weekly menu favorites." />
        <link rel="canonical" href={`${siteUrl}/`} />
        <meta property="og:title" content="The Spring Lake Kitchen Company | Memphis Baked Goods" />
        <meta property="og:description" content="Small-batch homemade baked goods for Memphis families, with local pickup details and weekly menu favorites." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/`} />
        <meta property="og:image" content={`${siteUrl}${heroImage}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Spring Lake Kitchen Company | Memphis Baked Goods" />
        <meta name="twitter:description" content="Small-batch homemade baked goods for Memphis families, with local pickup details and weekly menu favorites." />
        <meta name="twitter:image" content={`${siteUrl}${heroImage}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main className="overflow-hidden bg-background text-foreground">
        <section className="relative px-5 pb-20 pt-8 md:px-8 md:pb-28 md:pt-12">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div initial="hidden" animate="visible" variants={reveal} className="relative z-10 order-2 -mt-8 rounded-[2rem] border border-border bg-card p-7 shadow-xl md:-mt-14 md:p-12 lg:order-1 lg:-mr-16 lg:mt-0">
              <div className="flex items-center gap-2 text-sm font-bold text-primary"><Sprout size={17} aria-hidden="true" /><span>{home.hero.eyebrow}</span></div>
              <h1 className="mt-6 max-w-xl font-heading text-5xl leading-[0.98] text-foreground md:text-7xl">{home.hero.title}</h1>
              <p className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">{home.hero.body}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4"><a href="/menu" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-bold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5">{home.hero.cta} <ArrowDownRight size={18} aria-hidden="true" /></a><span className="rounded-full border border-border px-4 py-3 text-sm font-semibold text-muted-foreground">{home.hero.note}</span></div>
              <div className="pointer-events-none absolute -bottom-12 -left-10 hidden h-28 w-28 rounded-full border-[10px] border-accent lg:block" aria-hidden="true" />
            </motion.div>
            <figure className="relative order-1 overflow-hidden rounded-[2rem] lg:order-2"><img src={heroImage} alt="Freshly baked artisan bread and pastries on a rustic kitchen table" width={1600} height={1000} loading="eager" fetchPriority="high" className="h-[420px] w-full object-cover md:h-[620px]" /><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" /><figcaption className="absolute bottom-6 right-6 rounded-full bg-card px-4 py-2 text-sm font-bold text-primary">From our oven to your table</figcaption></figure>
          </div>
        </section>

        <section id="our-kitchen" className="relative px-5 pb-20 md:px-8 md:pb-28"><div className="mx-auto max-w-7xl"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal} className="relative grid grid-cols-1 overflow-hidden rounded-[2rem] border border-border bg-secondary md:grid-cols-[1.1fr_0.9fr]"><div className="p-8 md:p-12"><p className="text-sm font-bold text-primary">A note from the kitchen</p><h2 className="mt-4 max-w-xl font-heading text-4xl leading-tight text-foreground md:text-5xl">The best things start with a well-loved recipe.</h2><p className="mt-5 max-w-lg text-sm leading-6 text-muted-foreground">We make room for slow mixing, generous butter, and the kind of treats that turn an ordinary afternoon into a reason to gather.</p></div><div className="relative min-h-64 overflow-hidden"><img src="/images/kitchen-recipe-bread.jpg" alt="Freshly baked bread on a rustic wooden board beside a knife" width={900} height={700} loading="lazy" fetchPriority="auto" className="absolute inset-0 h-full w-full object-cover" /><div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-secondary to-transparent" /></div></motion.div></div></section>

        <section id="menu" className="px-5 py-20 md:px-8 md:py-28"><div className="mx-auto max-w-7xl"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={reveal} className="max-w-2xl"><p className="text-sm font-bold text-primary">{home.menu.eyebrow}</p><h2 className="mt-4 font-heading text-4xl leading-tight text-foreground md:text-6xl">{home.menu.title}</h2><p className="mt-5 text-lg leading-8 text-muted-foreground">{home.menu.intro}</p></motion.div><div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">{home.menu.items.map((item, index) => <motion.article key={item.id} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={reveal} whileHover={{ y: -5 }} transition={{ duration: 0.18 }} className={`group rounded-[1.75rem] border border-border bg-card p-6 shadow-sm ${index === 0 ? 'lg:row-span-2' : ''}`}>{index === 0 && <img src={cinnamonRollsImage} alt="Homemade cinnamon rolls on a ceramic plate" width={800} height={900} loading="lazy" fetchPriority="auto" className="mb-6 h-64 w-full rounded-[1.25rem] object-cover md:h-72" />}<div className="flex items-start justify-between gap-4"><h3 className="font-heading text-2xl leading-tight text-foreground">{item.name}</h3><Leaf className="shrink-0 text-accent" size={22} aria-hidden="true" /></div><p className="mt-4 leading-7 text-muted-foreground">{item.description}</p><p className="mt-6 text-sm font-bold text-primary">{item.price}</p></motion.article>)}</div></div></section>

        <section id="pickup" className="px-5 pb-20 md:px-8 md:pb-28"><div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={reveal} className="rounded-[2rem] bg-primary p-8 text-primary-foreground md:p-12"><p className="text-sm font-bold">{home.pickup.eyebrow}</p><h2 className="mt-4 font-heading text-4xl leading-tight md:text-5xl">{home.pickup.title}</h2><p className="mt-6 text-lg leading-8">{home.pickup.body}</p></motion.div><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={reveal} className="relative rounded-[2rem] border border-border bg-card p-8 md:p-12"><div className="absolute right-8 top-8 h-16 w-16 rounded-full border-[9px] border-accent" aria-hidden="true" /><div className="relative grid grid-cols-1 gap-7 sm:grid-cols-2"><div className="flex gap-4"><MapPin className="mt-1 shrink-0 text-primary" aria-hidden="true" /><div><h3 className="font-heading text-2xl text-foreground">Where</h3><p className="mt-2 leading-7 text-muted-foreground">{home.pickup.location}</p></div></div><div className="flex gap-4"><Clock3 className="mt-1 shrink-0 text-primary" aria-hidden="true" /><div><h3 className="font-heading text-2xl text-foreground">When</h3><p className="mt-2 leading-7 text-muted-foreground">{home.pickup.days}</p></div></div></div><div className="mt-8 border-t border-border pt-7"><p className="font-semibold text-foreground">{home.pickup.leadTime}</p></div><ol className="mt-8 grid grid-cols-1 gap-4 border-t border-border pt-7 sm:grid-cols-3"><li className="rounded-2xl bg-muted p-4"><span className="text-sm font-bold text-primary">01</span><h3 className="mt-2 font-heading text-xl text-foreground">Choose your treats</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Browse the weekly menu and select the breads and sweets you’d like us to bake.</p></li><li className="rounded-2xl bg-muted p-4"><span className="text-sm font-bold text-primary">02</span><h3 className="mt-2 font-heading text-xl text-foreground">Order 48 hours ahead</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">A little lead time lets us make every loaf, roll, and box with small-batch care.</p></li><li className="rounded-2xl bg-muted p-4"><span className="text-sm font-bold text-primary">03</span><h3 className="mt-2 font-heading text-xl text-foreground">Collect in Memphis</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">We’ll share your confirmed pickup window and collection guidance with your order.</p></li></ol></motion.div></div></section>

        <section className="px-5 pb-24 md:px-8 md:pb-32"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={reveal} className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-[2rem] border border-border bg-muted md:grid-cols-[1fr_0.8fr]"><div className="p-8 md:p-14"><p className="text-sm font-bold text-primary">Fresh from Spring Lake</p><h2 className="mt-4 max-w-xl font-heading text-4xl leading-tight text-foreground md:text-5xl">{home.cta.title}</h2><p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">{home.cta.body}</p><a href="/menu" className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-bold text-accent-foreground transition-transform duration-200 hover:-translate-y-0.5">{home.cta.button} <ArrowDownRight size={18} aria-hidden="true" /></a></div><div className="relative min-h-72 overflow-hidden md:min-h-full"><img src={cinnamonRollsImage} alt="Cinnamon rolls ready for a local pickup box" width={800} height={900} loading="lazy" fetchPriority="auto" className="absolute inset-0 h-full w-full object-cover" /><div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent to-muted" /></div></motion.div></section>
      </main>
    </>);

}
