'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWindowSize } from '../hooks/useWindowSize';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const { isMobile } = useWindowSize();

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(201,169,110,0.2)',
    padding: '1rem 0',
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    color: 'var(--cream)',
    letterSpacing: '0.05em',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  };

  const infoItems = [
    { label: 'Email', value: 'hello@venturo.eg', isLink: false },
    { label: 'Phone', value: '+20 12 710 85877', isLink: false },
    { label: 'Location', value: 'Cairo, Egypt', isLink: false },
    { label: 'Instagram', value: 'venturo', isLink: true },
  ];

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '8rem', overflowX: 'hidden' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        style={{ textAlign: 'center', padding: isMobile ? '0 1.5rem 3rem' : '0 3rem 5rem', position: 'relative' }}
      >
        <motion.div
          style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(107,26,42,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.img
          src="/compass.png"
          alt="Compass"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{ width: '60px', height: '60px', objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(201,169,110,0.3))', margin: '0 auto 2rem', display: 'block' }}
        />
        <p className="section-label" style={{ marginBottom: '1rem' }}>Get in Touch</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '2.2rem' : 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 300, letterSpacing: '0.12em', color: 'var(--cream)' }}>
          Contact Us
        </h1>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '3rem' : '6rem',
        padding: isMobile ? '0 1.5rem 4rem' : '0 6rem 8rem',
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
      }}>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          <p className="section-label" style={{ marginBottom: '2rem' }}>Reach Us</p>
          {infoItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
              style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}
            >
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {item.label}
              </p>
              {item.isLink ? (
                <a
                  href="https://www.instagram.com/venturo.eg?igsh=ZWpudW42YjN1OGhx"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.55rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--black)',
                    background: 'var(--gold)',
                    padding: '0.6rem 1.5rem',
                    marginTop: '0.25rem',
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                >
                  venturo
                </a>
              ) : (
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.06em', color: 'var(--cream)' }}>
                  {item.value}
                </p>
              )}
            </motion.div>
          ))}
          <motion.div
            style={{ height: '1px', background: 'linear-gradient(to right, var(--gold), transparent)', marginTop: '3rem' }}
            animate={{ width: ['0%', '100%', '0%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: isMobile ? 0 : 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          style={{ width: '100%', minWidth: 0 }}
        >
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: 'center', paddingTop: '4rem' }}
            >
              <motion.img
                src="/compass.png"
                alt="Compass"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{ width: '60px', height: '60px', margin: '0 auto 2rem', display: 'block', filter: 'drop-shadow(0 0 12px rgba(201,169,110,0.4))' }}
              />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '1rem' }}>
                Message Sent
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                Thank you for reaching out. We will get back to you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <div style={{ width: '100%' }}>
              <p className="section-label" style={{ marginBottom: '2rem' }}>Send a Message</p>
              {[
                { key: 'name', label: 'Full Name', type: 'text' },
                { key: 'email', label: 'Email Address', type: 'email' },
                { key: 'phone', label: 'Phone Number (optional)', type: 'tel' },
              ].map((field, i) => (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                  style={{ marginBottom: '2rem', width: '100%' }}
                >
                  <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--gold)')}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(201,169,110,0.2)')}
                  />
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                style={{ marginBottom: '2.5rem', width: '100%' }}
              >
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                  Message
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--gold)')}
                  onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(201,169,110,0.2)')}
                />
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'var(--black)',
                  background: 'var(--gold)',
                  border: 'none',
                  padding: '1rem 2.5rem',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.3s ease',
                }}
              >
                Send Message
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
