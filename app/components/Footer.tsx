'use client';
import Link from 'next/link';
import { useWindowSize } from '../hooks/useWindowSize';

export default function Footer() {
  const { isMobile } = useWindowSize();

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: isMobile ? '3rem 1.5rem 2rem' : '4rem 3rem 2rem',
      marginTop: '4rem',
      overflowX: 'hidden',
      width: '100%',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
        gap: isMobile ? '2rem' : '2rem',
        marginBottom: '3rem',
      }}>
        {/* Brand */}
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.35em', color: 'var(--gold)', marginBottom: '0.5rem' }}>VENTURO</div>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>MMXXVI</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: '200px' }}>
            A collection born from the edge of the known world.
          </p>
        </div>

        {/* Navigate */}
        <div>
          <div className="section-label" style={{ marginBottom: '1.5rem' }}>Navigate</div>
          {([['Home', '/'], ['Shop', '/shop'], ['About', '/about'], ['Contact', '/contact']] as [string, string][]).map(([label, href]) => (
            <Link key={label} href={href} style={{
              display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)',
              letterSpacing: '0.1em', marginBottom: '0.75rem', transition: 'color 0.3s ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >{label}</Link>
          ))}
        </div>

        {/* Collections */}
        <div>
          <div className="section-label" style={{ marginBottom: '1.5rem' }}>Collections</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Explorer&apos;s Quest</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Forbidden Odyssey</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid var(--border)', paddingTop: '1.5rem',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? '0.75rem' : '0',
      }}>
        <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
          © MMXXVI VENTURO. ALL RIGHTS RESERVED.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)' }} />
          <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>EGYPT</p>
        </div>
      </div>
    </footer>
  );
}