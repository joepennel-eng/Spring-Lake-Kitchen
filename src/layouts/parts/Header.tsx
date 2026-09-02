import { Link } from 'react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/menu', label: 'Menu' },
  { href: '/custom-orders', label: 'Custom orders' },
  { href: '/#pickup', label: 'Pickup details' },
  { href: '/#our-kitchen', label: 'Our kitchen' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3 md:px-8">
        <Link to="/" className="min-w-0 shrink" aria-label="The Spring Lake Kitchen Company home">
          <img
            src="/images/logo-horizontal.png"
            alt="The Spring Lake Kitchen Company"
            className="block h-auto max-h-10 w-auto max-w-full self-center object-contain md:max-h-14"
            width={300}
            height={120}
            loading="eager"
            fetchPriority="high"
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
              {item.label}
            </a>
          ))}
          <Link to="/menu" className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5">
            Today’s menu
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          className="rounded-full border border-border p-2 text-foreground transition-colors hover:bg-secondary md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <nav className="border-t border-border bg-background px-5 py-5 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-base font-semibold text-foreground hover:bg-secondary">
                {item.label}
              </a>
            ))}
            <Link to="/menu" onClick={() => setIsMobileMenuOpen(false)} className="mt-2 rounded-full bg-primary px-5 py-3 text-center text-sm font-bold text-primary-foreground">
              Today’s menu
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
