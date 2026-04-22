'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'password' | 'twofa'>('password');
  const [otp, setOtp] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const data = await res.json();
      setSessionToken(data.sessionToken);
      setStep('twofa');
    } else {
      setError('Invalid password');
    }
    setLoading(false);
  };

  const handleTwoFAVerify = async () => {
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin-login/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionToken, otp }),
    });
    if (res.ok) {
      router.push('/admin');
    } else {
      const data = await res.json();
      setError(data.error || '2FA verification failed');
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

        {step === 'password' ? (
          <>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>ENTER PASSWORD</p>
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
                outline: 'none', letterSpacing: '0.1em', marginBottom: '0.5rem',
                textAlign: 'center',
              }}
            />
          </>
        ) : (
          <>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>ENTER 2FA CODE</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', color: 'rgba(201,169,110,0.6)', marginBottom: '1rem' }}>A 6-digit code has been sent to your phone</p>
            <input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyDown={e => e.key === 'Enter' && handleTwoFAVerify()}
              maxLength={6}
              style={{
                width: '100%', background: 'transparent', border: 'none',
                borderBottom: '1px solid rgba(201,169,110,0.3)', padding: '1rem 0',
                fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--gold)',
                outline: 'none', letterSpacing: '0.2em', marginBottom: '0.5rem',
                textAlign: 'center',
              }}
            />
            <button
              onClick={() => { setStep('password'); setOtp(''); setError(''); }}
              style={{
                background: 'none', border: 'none', color: 'var(--text-muted)',
                fontFamily: 'var(--font-body)', fontSize: '0.5rem', cursor: 'pointer',
                letterSpacing: '0.1em', marginTop: '1rem',
              }}
            >
              Back to password
            </button>
          </>
        )}

        {error && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: '#a0445a', marginBottom: '1rem', letterSpacing: '0.1em' }}>{error}</p>}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={step === 'password' ? handleLogin : handleTwoFAVerify}
          style={{
            width: '100%', fontFamily: 'var(--font-body)', fontSize: '0.6rem',
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'var(--black)', background: 'var(--gold)',
            border: 'none', padding: '1rem', cursor: 'pointer',
            marginTop: '1.5rem', transition: 'all 0.3s ease',
          }}
        >
          {loading ? 'Processing...' : step === 'password' ? 'Continue' : 'Verify'}
        </motion.button>
      </motion.div>
    </div>
  );
}