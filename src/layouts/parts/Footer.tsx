import { Link } from 'react-router';
import { home } from '@/content';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-muted">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <img
              src="/images/logo-horizontal.png"
              alt="The Spring Lake Kitchen Company"
              className="block h-auto max-h-12 w-auto max-w-full object-contain"
              width={300}
              height={120}
              loading="lazy"
            />
            <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">{home.footer.tagline}</p>
            <p className="mt-4 inline-flex rounded-full border border-primary px-3 py-1 text-xs font-bold text-primary">Made in small batches</p>
          </div>
          <div>
            <h2 className="font-heading text-lg text-foreground">From the pantry</h2>
            <nav className="mt-4 flex flex-col gap-3" aria-label="Footer links">
              <Link to="/menu" className="text-sm text-muted-foreground hover:text-primary">Full menu</Link>
              <Link to="/custom-orders" className="text-sm text-muted-foreground hover:text-primary">Custom orders</Link>
              <a href="/#pickup" className="text-sm text-muted-foreground hover:text-primary">Pickup details</a>
              <a href="/#our-kitchen" className="text-sm text-muted-foreground hover:text-primary">Our kitchen</a>
            </nav>
          </div>
          <div>
            <h2 className="font-heading text-lg text-foreground">Local to Memphis</h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">Pickup details and weekly availability will be shared with each menu drop.</p>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} {home.footer.copyright}</p>
          <p>{home.footer.pickup}</p>
        </div>
      </div>
    </footer>
  );
}
