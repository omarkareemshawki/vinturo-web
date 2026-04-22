'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('password'); // 'password' or '2fa'
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePasswordSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    
    if (data.requires2FA) {
      setStep('2fa');
    } else {
      alert('Invalid Credentials');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    const res = await fetch('/api/admin-login/verify-2fa', {
      method: 'POST',
      body: JSON.stringify({ otp, sessionToken: 'admin-session' }), // sessionToken added to match your API
    });
    
    if (res.ok) {
      router.push('/admin');
    } else {
      alert('Invalid or Expired OTP');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {step === 'password' ? (
        <>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{color: 'black'}} />
          <button onClick={handlePasswordSubmit}>{loading ? 'Checking...' : 'Next'}</button>
        </>
      ) : (
        <>
          <p>Check logs for OTP code</p>
          <input type="text" placeholder="6-digit code" value={otp} onChange={e => setOtp(e.target.value)} style={{color: 'black'}} />
          <button onClick={handleVerifyOTP}>{loading ? 'Verifying...' : 'Login'}</button>
        </>
      )}
    </div>
  );
}
