'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '8rem' }}>

      {/* ── HERO ── */}
      <section style={{ textAlign: 'center', padding: '0 3rem 6rem', position: 'relative', overflow: 'hidden' }}>
        <motion.div
          style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(107,26,42,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          style={{ position: 'relative' }}
        >
          {/* Spinning compass */}
          <motion.img
            src="/compass.png"
            alt="Compass"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{ width: '80px', height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 0 16px rgba(201,169,110,0.35))', margin: '0 auto 2rem', display: 'block' }}
          />
          <p className="section-label" style={{ marginBottom: '1.5rem' }}>Our Story</p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 7vw, 6rem)',
            fontWeight: 300, letterSpacing: '0.12em', color: 'var(--cream)', marginBottom: '1.5rem', lineHeight: 1,
          }}>
            Born at the Edge<br />of the Known World
          </h1>
          <motion.div
            style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, var(--gold), transparent)', margin: '0 auto' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </motion.div>
      </section>

      {/* ── ORIGIN ── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', padding: '4rem 6rem', maxWidth: '1200px', margin: '0 auto', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          <p className="section-label" style={{ marginBottom: '1.5rem' }}>The Origin</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, letterSpacing: '0.08em', color: 'var(--cream)', marginBottom: '2rem', lineHeight: 1.3 }}>
            Egypt. Where Civilization Was Born and Scent Was Sacred.
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 2, letterSpacing: '0.03em', marginBottom: '1.5rem' }}>
            Venturo was born in 2026 from a simple but radical belief — that perfume is not decoration. It is identity. It is memory. It is the invisible signature you leave on every room, every person, every moment you touch.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 2, letterSpacing: '0.03em' }}>
            Rooted in Egypt — the ancient crossroads of Africa, the Middle East, and the Mediterranean — we draw from thousands of years of olfactory tradition, and we push it into something entirely new.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}
        >
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.7,
          }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,10,7,0.8) 0%, transparent 60%)' }} />
          {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
            <motion.div key={`${v}${h}`}
              style={{
                position: 'absolute', [v]: '1.5rem', [h]: '1.5rem',
                width: '24px', height: '24px',
                borderTop: v === 'top' ? '1px solid rgba(201,169,110,0.5)' : 'none',
                borderBottom: v === 'bottom' ? '1px solid rgba(201,169,110,0.5)' : 'none',
                borderLeft: h === 'left' ? '1px solid rgba(201,169,110,0.5)' : 'none',
                borderRight: h === 'right' ? '1px solid rgba(201,169,110,0.5)' : 'none',
              }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: Math.random() }}
            />
          ))}
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--gold)', letterSpacing: '0.2em' }}>MMXXVI</p>
          </div>
        </motion.div>
      </section>

      {/* ── MANIFESTO ── */}
      <section style={{ padding: '6rem 3rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.div
          style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,169,110,0.04) 0%, transparent 70%)', pointerEvents: 'none' }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}
        >
          <p className="section-label" style={{ marginBottom: '2rem' }}>The Philosophy</p>
          <blockquote style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
            fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.05em',
            lineHeight: 1.5, color: 'var(--cream)', marginBottom: '2rem',
          }}>
            &ldquo;Not all who wander are lost — some are simply searching for a scent worth remembering.&rdquo;
          </blockquote>
          <motion.div
            style={{ height: '1px', background: 'var(--gold)', margin: '0 auto' }}
            animate={{ width: ['0px', '60px', '0px'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ padding: '6rem 3rem', maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <p className="section-label" style={{ marginBottom: '1rem' }}>What We Stand For</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, letterSpacing: '0.1em', color: 'var(--cream)' }}>
            The Venturo Code
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3rem' }}>
          {[
            { num: '01', title: 'Scent is Identity', desc: 'We do not make perfume. We make the invisible part of you that arrives before you do and lingers long after you leave.' },
            { num: '02', title: 'Luxury Without Apology', desc: 'Every bottle, every box, every note was chosen with obsessive care. We believe you deserve nothing less than extraordinary.' },
            { num: '03', title: 'Rooted in the Ancient', desc: 'Egypt has been trading in scent since before recorded history. We carry that legacy into every collection we craft.' },
            { num: '04', title: 'Five Stories, One Journey', desc: 'Each collection is a curated set of five perfumes — five moods, five moments, five versions of you.' },
          ].map((item, i) => (
            <motion.div key={item.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.12 }}
              style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}
            >
              <motion.p
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
                style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'rgba(201,169,110,0.12)', marginBottom: '1rem', lineHeight: 1 }}
              >{item.num}</motion.p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 300, letterSpacing: '0.08em', color: 'var(--cream)', marginBottom: '1rem' }}>{item.title}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.9, letterSpacing: '0.03em' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── COLLECTIONS CTA ── */}
      <section style={{ padding: '6rem 3rem', textAlign: 'center', borderTop: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <motion.div
          style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(107,26,42,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          style={{ position: 'relative' }}
        >
          <p className="section-label" style={{ marginBottom: '1.5rem' }}>The Collections</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, letterSpacing: '0.1em', color: 'var(--cream)', marginBottom: '2.5rem' }}>
            Ready to Find Your Scent?
          </h2>
          <a href="/shop" style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.25em',
            textTransform: 'uppercase', color: 'var(--black)', background: 'var(--gold)',
            padding: '1.2rem 3.5rem', display: 'inline-block', transition: 'all 0.4s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; }}
          >Explore Collections</a>
        </motion.div>
      </section>

    </div>
  );
}