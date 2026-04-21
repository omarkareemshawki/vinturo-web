'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useWindowSize } from './hooks/useWindowSize';

function FloatingParticle({ delay, x, size }: { delay: number; x: string; size: number }) {
  return (
    <motion.div
      style={{ position: 'absolute', bottom: '-10px', left: x, width: size, height: size, borderRadius: '50%', background: 'var(--gold)', opacity: 0, pointerEvents: 'none' }}
      animate={{ y: [0, -700], opacity: [0, 0.6, 0], x: [0, 30, -20, 10] }}
      transition={{ duration: 8 + delay, repeat: Infinity, delay, ease: 'easeOut' }}
    />
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 180]);
  const [mounted, setMounted] = useState(false);
  const { isMobile } = useWindowSize();

  useEffect(() => { setMounted(true); }, []);

  const particles = [
    { delay: 0, x: '10%', size: 2 }, { delay: 1.5, x: '25%', size: 1.5 },
    { delay: 3, x: '40%', size: 2.5 }, { delay: 0.8, x: '55%', size: 1 },
    { delay: 2.2, x: '70%', size: 2 }, { delay: 4, x: '82%', size: 1.5 },
    { delay: 1, x: '90%', size: 1 }, { delay: 3.5, x: '18%', size: 2 },
    { delay: 2.8, x: '62%', size: 1.5 }, { delay: 0.5, x: '48%', size: 1 },
  ];

  return (
    <div ref={containerRef} style={{ background: 'var(--black)' }}>

      {/* ── HERO ── */}
      <section style={{ height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div style={{ position: 'absolute', inset: '-20%', backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.18, y: heroY }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,10,7,0.5) 0%, rgba(13,10,7,0.3) 50%, rgba(13,10,7,0.7) 100%)', pointerEvents: 'none' }} />
        <motion.div
          style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(107,26,42,0.25) 0%, transparent 70%)', pointerEvents: 'none' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        {mounted && particles.map((p, i) => <FloatingParticle key={i} {...p} />)}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 2 }}
          style={{ position: 'relative', textAlign: 'center', zIndex: 2, padding: isMobile ? '0 1rem' : '0 2rem', width: 'auto', maxWidth: '1200px' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: mounted ? 1 : 0, scale: 1 }}
            transition={{ duration: 2.5, delay: 0.3 }}
            style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}
          >
            <motion.img
              src="/compass.png" alt="Venturo Compass"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              style={{ width: isMobile ? '80px' : '120px', height: isMobile ? '80px' : '120px', objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(201,169,110,0.4))' }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: mounted ? 1 : 0 }}
            transition={{ duration: 2, delay: 0.5 }}
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--gold)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.25em' }}
          >A Forbidden Odyssey</motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: mounted ? 1 : 0, y: 0 }}
            transition={{ duration: 1.8, delay: 0.7 }}
            style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 'clamp(3rem, 18vw, 5rem)' : 'clamp(4rem, 10vw, 9rem)', fontWeight: 300, letterSpacing: '0.12em', color: 'var(--cream)', lineHeight: 0.9, marginBottom: '1rem' }}
          >VENTURO</motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: mounted ? 0.5 : 0 }}
            transition={{ duration: 2, delay: 1.2 }}
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.5em', color: 'var(--gold)', marginBottom: '3rem', textTransform: 'uppercase' }}
          >MMXXVI</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: 0 }}
            transition={{ duration: 1.5, delay: 1.5 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', padding: '0 1rem' }}
          >
            <Link href="/shop" style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--black)', background: 'var(--gold)', padding: '1rem 2rem', transition: 'all 0.4s ease', display: 'inline-block' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-light)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; }}
            >Explore Collections</Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ delay: 2.5, duration: 1 }}
          style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
        >
          <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }}
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.3em', color: 'var(--text-muted)', textTransform: 'uppercase' }}
          >Scroll</motion.p>
          <motion.div
            animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--gold), transparent)', transformOrigin: 'top' }}
          />
        </motion.div>

        {!isMobile && <>
          <motion.div style={{ position: 'absolute', left: '3rem', top: '50%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.3))', transformOrigin: 'left' }}
            animate={{ width: ['0px', '80px', '0px'] }} transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }} />
          <motion.div style={{ position: 'absolute', right: '3rem', top: '50%', height: '1px', background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.3))', transformOrigin: 'right' }}
            animate={{ width: ['0px', '80px', '0px'] }} transition={{ duration: 4, repeat: Infinity, repeatDelay: 1, delay: 0.5 }} />
        </>}
      </section>

      {/* ── COLLECTIONS ── */}
      <section style={{ padding: isMobile ? '4rem 1.5rem' : '8rem 3rem', maxWidth: '1400px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <p className="section-label" style={{ marginBottom: '1rem' }}>The Collections</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '2rem' : 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, letterSpacing: '0.1em', color: 'var(--cream)' }}>
            Two Worlds. One Obsession.
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
          {[
            { href: '/shop?collection=mens', image: '/male-box.jpg', label: 'For Him', name: "Explorer's Quest", tagline: 'Hey Handsome, are you ready to break necks?', accent: 'var(--gold)', accentRgb: '201,169,110' },
            { href: '/shop?collection=womens', image: '/female-box.jpg', label: 'For Her', name: 'Forbidden Odyssey', tagline: 'Hey there gorgeous, what mood are you in today?', accent: '#a0445a', accentRgb: '107,26,42' },
          ].map((col, i) => (
            <motion.div key={col.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: i * 0.15 }}
              whileHover={{ scale: 1.02 }}
            >
              <Link href={col.href} style={{ display: 'block', position: 'relative', overflow: 'hidden', aspectRatio: isMobile ? '4/3' : '3/4', cursor: 'none' }}>
                <motion.div
                  style={{ position: 'absolute', inset: 0, backgroundImage: `url(${col.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.8 }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,10,7,0.92) 0%, rgba(13,10,7,0.2) 60%, transparent 100%)' }} />
                {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
                  <motion.div key={`${v}${h}`}
                    style={{ position: 'absolute', [v]: '1.5rem', [h]: '1.5rem', width: '20px', height: '20px', borderTop: v === 'top' ? `1px solid rgba(${col.accentRgb},0.5)` : 'none', borderBottom: v === 'bottom' ? `1px solid rgba(${col.accentRgb},0.5)` : 'none', borderLeft: h === 'left' ? `1px solid rgba(${col.accentRgb},0.5)` : 'none', borderRight: h === 'right' ? `1px solid rgba(${col.accentRgb},0.5)` : 'none' }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  />
                ))}
                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.3em', color: col.accent, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{col.label}</p>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '1.6rem' : '2.2rem', fontWeight: 300, letterSpacing: '0.1em', color: 'var(--cream)', marginBottom: '0.4rem' }}>{col.name}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{col.tagline}</p>
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}
                    style={{ display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.2em', color: col.accent, textTransform: 'uppercase', borderBottom: `1px solid rgba(${col.accentRgb},0.4)`, paddingBottom: '2px' }}
                  >Discover →</motion.span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section style={{ padding: isMobile ? '4rem 1.5rem' : '8rem 3rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,169,110,0.05) 0%, transparent 70%)', pointerEvents: 'none' }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div style={{ position: 'absolute', top: '30%', left: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.1), transparent)' }}
          animate={{ width: ['0%', '100%', '0%'] }} transition={{ duration: 6, repeat: Infinity }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.4 }}
          style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}
        >
          <p className="section-label" style={{ marginBottom: '2rem' }}>The Venturo Manifesto</p>
          <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '1.4rem' : 'clamp(1.6rem, 3.5vw, 2.8rem)', fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.05em', lineHeight: 1.5, color: 'var(--cream)', marginBottom: '2rem' }}>
            &ldquo;Not all who wander are lost — some are simply searching for a scent worth remembering.&rdquo;
          </blockquote>
          <motion.div style={{ height: '1px', background: 'var(--gold)', margin: '0 auto' }}
            animate={{ width: ['0px', '40px', '0px'] }} transition={{ duration: 4, repeat: Infinity }} />
        </motion.div>
      </section>

      {/* ── WHY VENTURO ── */}
      <section style={{ padding: isMobile ? '4rem 1.5rem' : '8rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <p className="section-label" style={{ marginBottom: '1rem' }}>The Craft</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '1.8rem' : 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 300, letterSpacing: '0.1em', color: 'var(--cream)' }}>Why Venturo</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '2rem' : '3rem' }}>
          {[
            { num: '01', title: 'Five Souls Per Box', desc: 'Each collection contains five distinct perfumes — five moods, five stories, one journey.' },
            { num: '02', title: 'Crafted in Egypt', desc: 'Born from the ancient crossroads of civilizations. Every bottle carries centuries of olfactory wisdom.' },
            { num: '03', title: 'Made to Be Remembered', desc: 'Long-lasting, deeply personal, and impossible to forget. This is not a scent — it is a signature.' },
          ].map((item, i) => (
            <motion.div key={item.num}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.15 }}
              style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}
            >
              <motion.p animate={{ y: [0, -6, 0] }} transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
                style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'rgba(201,169,110,0.15)', marginBottom: '1rem', lineHeight: 1 }}
              >{item.num}</motion.p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 300, letterSpacing: '0.08em', color: 'var(--cream)', marginBottom: '1rem' }}>{item.title}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.9 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: isMobile ? '4rem 1.5rem' : '8rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(107,26,42,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}
          animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 5, repeat: Infinity }} />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }} style={{ position: 'relative' }}>
          <p className="section-label" style={{ marginBottom: '1.5rem' }}>Begin Your Journey</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '2rem' : 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 300, letterSpacing: '0.1em', color: 'var(--cream)', marginBottom: '2.5rem' }}>
            Which world calls to you?
          </h2>
          <Link href="/shop" style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--black)', background: 'var(--gold)', padding: '1.2rem 3.5rem', display: 'inline-block', transition: 'all 0.4s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; }}
          >Shop Now</Link>
        </motion.div>
      </section>

    </div>
  );
}