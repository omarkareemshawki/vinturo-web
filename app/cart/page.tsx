'use client';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWindowSize } from '../hooks/useWindowSize';

export default function CartPage() {
  const { items, removeFromCart, total } = useCartStore();
  const router = useRouter();
  const { isMobile } = useWindowSize();

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '8rem', overflowX: 'hidden' }}>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center', padding: '0 1.5rem 4rem' }}
      >
        <p className="section-label" style={{ marginBottom: '1rem' }}>Your Selection</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '2.2rem' : 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, letterSpacing: '0.12em', color: 'var(--cream)' }}>
          Your Cart
        </h1>
      </motion.div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: isMobile ? '0 1.5rem 4rem' : '0 3rem 8rem', width: '100%' }}>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <motion.img src="/compass.png" alt="Compass"
              animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              style={{ width: '70px', height: '70px', margin: '0 auto 2rem', display: 'block', filter: 'drop-shadow(0 0 12px rgba(201,169,110,0.3))', opacity: 0.5 }}
            />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '2rem' }}>
              Your cart is empty
            </p>
            <Link href="/shop" style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--black)', background: 'var(--gold)', padding: '1rem 2.5rem', display: 'inline-block' }}>
              Explore Collections
            </Link>
          </motion.div>
        ) : (
          <>
            <div style={{ marginBottom: '3rem' }}>
              {items.map((item, i) => (
                <motion.div key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '72px 1fr auto',
                    gap: '1rem',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border)',
                    paddingTop: '1.5rem',
                    marginBottom: '1.5rem',
                    width: '100%',
                    minWidth: 0,
                  }}
                >
                  <div style={{ width: '72px', height: '72px', flexShrink: 0, backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: 300, letterSpacing: '0.08em', color: 'var(--cream)', marginBottom: '0.25rem' }}>
                      {item.name}
                    </h3>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>Qty: {item.quantity}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold)', marginBottom: '0.5rem', whiteSpace: 'nowrap' }}>
                      {(item.price * item.quantity).toLocaleString()} <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>EGP</span>
                    </p>
                    <button onClick={() => removeFromCart(item.id)}
                      style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.15em', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >Remove</button>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', marginBottom: '2.5rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subtotal</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--gold)' }}>
                  {total().toLocaleString()} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>EGP</span>
                </p>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>Shipping calculated at checkout</p>
            </motion.div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/checkout')}
              style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--black)', background: 'var(--gold)', border: 'none', padding: '1.2rem', cursor: 'pointer', marginBottom: '1rem' }}
            >Proceed to Checkout</motion.button>

            <Link href="/shop" style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >← Continue Shopping</Link>
          </>
        )}
      </div>
    </div>
  );
}