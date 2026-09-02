import { Helmet } from '@dr.pogodin/react-helmet';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import { order_received } from '@/content';
import { siteUrl } from '@/site';



export default function OrderReceivedPage() {
  const pageUrl = `${siteUrl}/order-received`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    name: 'Order Received | The Spring Lake Kitchen Company',
    url: pageUrl,
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` },
  };

  return <>
    <Helmet>
      <title>Order Received | Spring Lake Kitchen</title>
      <meta name="description" content="The Spring Lake Kitchen Company is confirming your order details." />
      <link rel="canonical" href={pageUrl} />
      <meta property="og:title" content="Order Received | Spring Lake Kitchen" /><meta property="og:description" content="The Spring Lake Kitchen Company is confirming your order details." /><meta property="og:type" content="website" /><meta property="og:url" content={pageUrl} /><meta property="og:image" content={`${siteUrl}/images/hero-baked-goods.webp`} />
      <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="Order Received | Spring Lake Kitchen" /><meta name="twitter:description" content="The Spring Lake Kitchen Company is confirming your order details." /><meta name="twitter:image" content={`${siteUrl}/images/hero-baked-goods.webp`} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
    <main className="bg-background px-5 py-24 text-foreground md:px-8 md:py-32"><section className="mx-auto max-w-2xl rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm md:p-14"><CheckCircle2 className="mx-auto text-primary" size={52} aria-hidden="true" /><h1 className="mt-6 font-heading text-5xl leading-tight">{order_received.hero.title}</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">{order_received.hero.body}</p><Link to="/menu" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3.5 font-bold text-primary-foreground">{order_received.hero.button}</Link></section></main>
  </>;
}
