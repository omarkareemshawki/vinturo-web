'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCartStore(s => s.items);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: '0.65rem',
    fontWeight: 400,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: 'var(--text-muted)',
    transition: 'color 0.3s ease',
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '1.5rem 3rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.6s ease',
        background: scrolled ? 'rgba(13,10,7,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,169,110,0.1)' : 'none',
      }}>

        {/* Left links — desktop */}
        <div className="nav-links" style={{ display: 'flex', gap: '2.5rem' }}>
          {['Shop', 'About'].map(item => (
            <Link key={item} href={`/${item.toLowerCase()}`}
              style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >{item}</Link>
          ))}
        </div>

        {/* Center logo */}
        <Link href="/" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300, letterSpacing: '0.35em', color: 'var(--gold)' }}>VENTURO</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.45rem', letterSpacing: '0.4em', color: 'var(--text-muted)', marginTop: '2px' }}>MMXXVI</div>
        </Link>

        {/* Right — desktop */}
        <div className="nav-links" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <Link href="/contact" style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >Contact</Link>

          <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem', ...linkStyle, color: 'var(--gold)', border: '1px solid rgba(201,169,110,0.4)', padding: '0.4rem 1rem' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = 'var(--black)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gold)'; }}
          >
            Cart
            {cartCount > 0 && (
              <span style={{
                background: 'var(--gold)', color: 'var(--black)',
                borderRadius: '50%', width: '16px', height: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.45rem', fontWeight: 600, letterSpacing: 0,
                flexShrink: 0,
              }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Hamburger — mobile */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', flexDirection: 'column', gap: '5px' }}
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: '22px', height: '1px', background: 'var(--gold)',
              transition: 'all 0.3s ease',
              transform: menuOpen
                ? i === 0 ? 'rotate(45deg) translate(4px, 4px)'
                : i === 1 ? 'scaleX(0)'
                : 'rotate(-45deg) translate(4px, -4px)'
                : 'none',
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(13,10,7,0.98)', zIndex: 999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '2.5rem',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {[['Shop', '/shop'], ['About', '/about'], ['Contact', '/contact'], ['Cart', '/cart']].map(([label, href]) => (
          <Link key={label} href={href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 300,
              letterSpacing: '0.15em', color: 'var(--cream)', transition: 'color 0.3s ease',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--cream)')}
          >
            {label}
            {label === 'Cart' && cartCount > 0 && (
              <span style={{ background: 'var(--gold)', color: 'var(--black)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600 }}>
                {cartCount}
              </span>
            )}
          </Link>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}