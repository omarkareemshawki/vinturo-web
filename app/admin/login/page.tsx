'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (res.ok) {
        // Cookie is set by server, redirect to admin
        router.push('/admin');
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center', width: '100%', maxWidth: '400px', padding: '0 2rem' }}
      >
        <motion.img
          src="/compass.png"
          alt="Compass"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{ width: '60px', height: '60px', margin: '0 auto 2rem', display: 'block', filter: 'drop-shadow(0 0 12px rgba(201,169,110,0.4))' }}
        />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, letterSpacing: '0.2em', color: 'var(--gold)', marginBottom: '0.5rem' }}>VENTURO</h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.3em', color: 'var(--text-muted)', marginBottom: '3rem', textTransform: 'uppercase' }}>Admin Dashboard</p>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>ENTER PASSWORD</p>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          disabled={loading}
          style={{
            width: '100%', background: 'transparent', border: 'none',
            borderBottom: '1px solid rgba(201,169,110,0.3)', padding: '1rem 0',
            fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--cream)',
            outline: 'none', letterSpacing: '0.1em', textAlign: 'center',
            opacity: loading ? 0.6 : 1,
          }}
        />
        
        {error && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: '#a0445a', marginTop: '0.75rem', letterSpacing: '0.1em' }}>{error}</p>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', fontFamily: 'var(--font-body)', fontSize: '0.6rem',
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'var(--black)', background: 'var(--gold)',
            border: 'none', padding: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '1.5rem', transition: 'all 0.3s ease',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Entering...' : 'Enter'}
        </motion.button>
      </motion.div>
    </div>
  );
}