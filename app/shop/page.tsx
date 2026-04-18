'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/cartStore';
import { useWindowSize } from '../hooks/useWindowSize';

const products = [
  {
    id: 'explorers-quest',
    name: "Explorer's Quest",
    subtitle: 'For Him',
    tagline: 'Hey Handsome, are you ready to break necks?',
    image: '/male-box.jpg',
    price: 2200,
    accent: 'var(--gold)',
    accentRgb: '201,169,110',
    description: 'A bold collection of five powerful scents for the man who commands every room he enters. Housed in a hand-crafted leather box with brass fittings. 5 x 30ml',
    notes: ['Oud', 'Sandalwood', 'spices', 'Amber', 'Cedar'],
  },
  {
    id: 'forbidden-odyssey',
    name: 'Forbidden Odyssey',
    subtitle: 'For Her',
    tagline: 'Hey there gorgeous, what mood are you in today?',
    image: '/female-box.jpg',
    price: 2200,
    accent: '#a0445a',
    accentRgb: '107,26,42',
    description: 'Five intoxicating scents for the woman who leaves a trail wherever she goes. Presented in a crimson leather box — a treasure worth opening. 5 x 30ml',
    notes: ['Rose', 'Musk', 'Vanilla', 'Jasmine', 'Patchouli'],
  },
];

export default function ShopPage() {
  const router = useRouter();
  const addToCart = useCartStore(s => s.addToCart);
  const [added, setAdded] = useState<string | null>(null);
  const { isMobile } = useWindowSize();

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
    setAdded(product.id);
    setTimeout(() => { router.push('/cart'); }, 600);
  };

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '8rem', overflowX: 'hidden' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center', padding: '0 1.5rem 3rem' }}
      >
        <p className="section-label" style={{ marginBottom: '1rem' }}>The Collections</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '2rem' : 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, letterSpacing: '0.12em', color: 'var(--cream)' }}>
          Choose Your Journey
        </h1>
        <motion.div
          style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--gold), transparent)', margin: '2rem auto 0' }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Products grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 480px))',
        gap: '2rem',
        padding: isMobile ? '0 1.5rem 4rem' : '0 2rem 8rem',
        maxWidth: '1060px',
        margin: '0 auto',
        justifyContent: 'center',
        width: '100%',
      }}>
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: i * 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0 }}
          >
            {/* Image */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              style={{ position: 'relative', aspectRatio: isMobile ? '4/3' : '4/5', overflow: 'hidden', marginBottom: '1.5rem', width: '100%' }}
            >
              <motion.div
                style={{ position: 'absolute', inset: 0, backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.8 }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,10,7,0.7) 0%, transparent 60%)' }} />

              {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
                <motion.div key={`${v}${h}`}
                  style={{
                    position: 'absolute', [v]: '1rem', [h]: '1rem',
                    width: '20px', height: '20px',
                    borderTop: v === 'top' ? `1px solid rgba(${product.accentRgb},0.5)` : 'none',
                    borderBottom: v === 'bottom' ? `1px solid rgba(${product.accentRgb},0.5)` : 'none',
                    borderLeft: h === 'left' ? `1px solid rgba(${product.accentRgb},0.5)` : 'none',
                    borderRight: h === 'right' ? `1px solid rgba(${product.accentRgb},0.5)` : 'none',
                  }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                />
              ))}

              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.25em', color: product.accent, textTransform: 'uppercase' }}>{product.subtitle}</p>
              </div>
            </motion.div>

            {/* Info */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 300, letterSpacing: '0.1em', color: 'var(--cream)', marginBottom: '0.5rem' }}>
                {product.name}
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1rem' }}>
                {product.tagline}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
                {product.description}
              </p>

              {/* Notes */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {product.notes.map(note => (
                  <span key={note} style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.15em',
                    color: product.accent, border: `1px solid rgba(${product.accentRgb},0.3)`,
                    padding: '0.25rem 0.6rem', textTransform: 'uppercase',
                  }}>{note}</span>
                ))}
              </div>

              {/* Price & CTA */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1.5rem',
                flexWrap: 'wrap', gap: '1rem',
              }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Price</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--gold)' }}>
                    {product.price.toLocaleString()} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>EGP</span>
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAddToCart(product)}
                  style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.2em',
                    textTransform: 'uppercase', color: 'var(--black)',
                    background: added === product.id ? 'var(--gold-light)' : 'var(--gold)',
                    border: 'none', padding: '0.85rem 1.8rem', cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: isMobile ? '100%' : 'auto',
                  }}
                >
                  {added === product.id ? 'Added ✓' : 'Add to Cart'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}