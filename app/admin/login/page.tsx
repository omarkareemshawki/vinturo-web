'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [step, setStep] = useState<'password' | '2fa'>('password');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
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
      const data = await res.json();
      if (res.ok && data.requires2FA) {
        setStep('2fa');
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch {
      setError('Something went wrong');
    }
    setLoading(false);
  };

  const handleVerify2FA = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin-login/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: 'admin', otp }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid code');
      }
    } catch {
      setError('Something went wrong');
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
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.3em', color: 'var(--text-muted)', marginBottom: '3rem', textTransform: 'uppercase' }}>
          {step === 'password' ? 'Admin Dashboard' : '2FA Verification'}
        </p>

        {step === 'password' ? (
          <>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%', background: 'transparent', border: 'none',
                borderBottom: '1px solid rgba(201,169,110,0.3)', padding: '1rem 0',
                fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--cream)',
                outline: 'none', letterSpacing: '0.1em', textAlign: 'center',
              }}
            />
            {error && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: '#a0445a', margin: '0.75rem 0', letterSpacing: '0.1em' }}>{error}</p>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogin}
              style={{
                width: '100%', fontFamily: 'var(--font-body)', fontSize: '0.6rem',
                letterSpacing: '0.25em', textTransform: 'uppercase',
                color: 'var(--black)', background: 'var(--gold)',
                border: 'none', padding: '1rem', cursor: 'pointer',
                marginTop: '1.5rem', transition: 'all 0.3s ease',
              }}
            >{loading ? 'Verifying...' : 'Enter'}</motion.button>
          </>
        ) : (
          <>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.8 }}>
              A 6-digit code has been logged to your server console.<br />
              Check your Vercel logs to find it.
            </p>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleVerify2FA()}
              maxLength={6}
              style={{
                width: '100%', background: 'transparent', border: 'none',
                borderBottom: '1px solid rgba(201,169,110,0.3)', padding: '1rem 0',
                fontFamily: 'var(--font-body)', fontSize: '1.2rem', color: 'var(--gold)',
                outline: 'none', letterSpacing: '0.5em', textAlign: 'center',
              }}
            />
            {error && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: '#a0445a', margin: '0.75rem 0', letterSpacing: '0.1em' }}>{error}</p>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleVerify2FA}
              style={{
                width: '100%', fontFamily: 'var(--font-body)', fontSize: '0.6rem',
                letterSpacing: '0.25em', textTransform: 'uppercase',
                color: 'var(--black)', background: 'var(--gold)',
                border: 'none', padding: '1rem', cursor: 'pointer',
                marginTop: '1.5rem', transition: 'all 0.3s ease',
              }}
            >{loading ? 'Verifying...' : 'Verify Code'}</motion.button>
            <button
              onClick={() => { setStep('password'); setError(''); setOtp(''); }}
              style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.15em', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', marginTop: '1rem', textTransform: 'uppercase' }}
            >← Back</button>
          </>
        )}
      </motion.div>
    </div>
  );
}