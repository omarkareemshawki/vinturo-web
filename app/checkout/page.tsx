'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useRouter } from 'next/navigation';
import { useWindowSize } from '../hooks/useWindowSize';
import { supabase } from '../lib/supabase';

type Step = 'details' | 'payment' | 'confirmed';

const COD_FEE = 100;

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string) {
  return /^(\+20|0020|0)?1[0125][0-9]{8}$/.test(phone.replace(/\s/g, ''));
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const { isMobile } = useWindowSize();
  const [step, setStep] = useState<Step>('details');
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<'cod' | 'card' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', governorate: '', notes: '',
  });

  const codTotal = total() + COD_FEE;
  const finalTotal = payment === 'cod' ? codTotal : total();

  const inputStyle = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(201,169,110,0.2)',
    padding: '0.85rem 0',
    fontFamily: 'var(--font-body)',
    fontSize: '0.78rem',
    color: 'var(--cream)',
    letterSpacing: '0.04em',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    WebkitAppearance: 'none' as const,
    borderRadius: 0,
  };

  const labelStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: '0.48rem',
    letterSpacing: '0.25em',
    color: 'var(--gold)',
    textTransform: 'uppercase' as const,
    display: 'block',
    marginBottom: '0.4rem',
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (form.firstName.trim().length < 2) newErrors.firstName = 'At least 2 characters';
    if (form.lastName.trim().length < 2) newErrors.lastName = 'At least 2 characters';
    if (!validateEmail(form.email)) newErrors.email = 'Enter a valid email address';
    if (!validatePhone(form.phone)) newErrors.phone = 'Enter a valid Egyptian phone number';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.governorate) newErrors.governorate = 'Please select a governorate';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) setStep('payment');
  };

  const handleConfirm = async () => {
    if (!payment) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('orders').insert({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        governorate: form.governorate,
        notes: form.notes,
        payment_method: payment,
        items: items,
        total: finalTotal,
        status: 'pending',
      });

      if (error) { console.error('Order error:', error); setLoading(false); return; }

      await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, items, total: finalTotal, payment }),
      });

      clearCart();
      setStep('confirmed');
    } catch (err) {
      console.error('Unexpected error:', err);
      setLoading(false);
    }
  };

  const governorates = [
    'Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Red Sea', 'Beheira',
    'Fayoum', 'Gharbia', 'Ismailia', 'Menofia', 'Minya', 'Qalyubia',
    'New Valley', 'North Sinai', 'Port Said', 'Sharqia', 'South Sinai',
    'Suez', 'Luxor', 'Matrouh', 'Qena', 'Aswan', 'Assiut', 'Beni Suef',
    'Kafr el-Sheikh', 'Sohag', 'Damietta', 'Matruh',
  ];

  if (items.length === 0 && step !== 'confirmed') {
    return (
      <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '8rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Your cart is empty</p>
        <a href="/shop" style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--black)', background: 'var(--gold)', padding: '1rem 2.5rem', display: 'inline-block' }}>Shop Now</a>
      </div>
    );
  }

  const ErrorMsg = ({ field }: { field: string }) => errors[field] ? (
    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', color: '#a0445a', letterSpacing: '0.1em', marginTop: '0.3rem' }}>{errors[field]}</p>
  ) : null;

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '6rem', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' as any }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center', padding: isMobile ? '0 1.5rem 2rem' : '0 3rem 3rem' }}
      >
        <p className="section-label" style={{ marginBottom: '1rem' }}>Secure Checkout</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '1.8rem' : 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, letterSpacing: '0.12em', color: 'var(--cream)' }}>
          Complete Your Order
        </h1>

        {step !== 'confirmed' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {(['details', 'payment'] as Step[]).map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    border: `1px solid ${step === s || (s === 'details' && step === 'payment') ? 'var(--gold)' : 'rgba(201,169,110,0.2)'}`,
                    background: step === s || (s === 'details' && step === 'payment') ? 'var(--gold)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.4s ease',
                  }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', color: step === s || (s === 'details' && step === 'payment') ? 'var(--black)' : 'var(--text-muted)' }}>{i + 1}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: step === s ? 'var(--gold)' : 'var(--text-muted)' }}>
                    {s === 'details' ? 'Your Details' : 'Payment'}
                  </span>
                </div>
                {i === 0 && <div style={{ width: '40px', height: '1px', background: step === 'payment' ? 'var(--gold)' : 'rgba(201,169,110,0.2)', transition: 'all 0.4s ease' }} />}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Main grid */}
      <div style={{
        maxWidth: '1000px', margin: '0 auto',
        padding: isMobile ? '0 1.5rem 4rem' : '0 3rem 8rem',
        display: 'grid',
        gridTemplateColumns: (isMobile || step === 'confirmed') ? '1fr' : '1fr 360px',
        gap: isMobile ? '2rem' : '4rem',
        width: '100%',
      }}>

        <AnimatePresence mode="wait">

          {/* STEP 1 — DETAILS */}
          {step === 'details' && (
            <motion.div key="details" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }}>
              <p className="section-label" style={{ marginBottom: '2rem' }}>Delivery Information</p>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0 2rem' }}>
                {[{ key: 'firstName', label: 'First Name' }, { key: 'lastName', label: 'Last Name' }].map(field => (
                  <div key={field.key} style={{ marginBottom: '1.8rem' }}>
                    <label style={labelStyle}>{field.label}</label>
                    <input type="text" value={form[field.key as keyof typeof form]}
                      onChange={e => { setForm({ ...form, [field.key]: e.target.value }); setErrors({ ...errors, [field.key]: '' }); }}
                      style={{ ...inputStyle, borderBottomColor: errors[field.key] ? '#a0445a' : 'rgba(201,169,110,0.2)' }}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--gold)')}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = errors[field.key] ? '#a0445a' : 'rgba(201,169,110,0.2)')}
                    />
                    <ErrorMsg field={field.key} />
                  </div>
                ))}
              </div>

              {[
                { key: 'email', label: 'Email Address', type: 'email' },
                { key: 'phone', label: 'Phone Number', type: 'tel' },
                { key: 'address', label: 'Street Address', type: 'text' },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: '1.8rem' }}>
                  <label style={labelStyle}>{field.label}</label>
                  <input type={field.type} value={form[field.key as keyof typeof form]}
                    onChange={e => { setForm({ ...form, [field.key]: e.target.value }); setErrors({ ...errors, [field.key]: '' }); }}
                    style={{ ...inputStyle, borderBottomColor: errors[field.key] ? '#a0445a' : 'rgba(201,169,110,0.2)' }}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--gold)')}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = errors[field.key] ? '#a0445a' : 'rgba(201,169,110,0.2)')}
                  />
                  <ErrorMsg field={field.key} />
                </div>
              ))}

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0 2rem' }}>
                <div style={{ marginBottom: '1.8rem' }}>
                  <label style={labelStyle}>City</label>
                  <input type="text" value={form.city}
                    onChange={e => { setForm({ ...form, city: e.target.value }); setErrors({ ...errors, city: '' }); }}
                    style={{ ...inputStyle, borderBottomColor: errors.city ? '#a0445a' : 'rgba(201,169,110,0.2)' }}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--gold)')}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = errors.city ? '#a0445a' : 'rgba(201,169,110,0.2)')}
                  />
                  <ErrorMsg field="city" />
                </div>
                <div style={{ marginBottom: '1.8rem' }}>
                  <label style={labelStyle}>Governorate</label>
                  <select value={form.governorate}
                    onChange={e => { setForm({ ...form, governorate: e.target.value }); setErrors({ ...errors, governorate: '' }); }}
                    style={{ ...inputStyle, cursor: 'pointer', borderBottomColor: errors.governorate ? '#a0445a' : 'rgba(201,169,110,0.2)' }}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--gold)')}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = errors.governorate ? '#a0445a' : 'rgba(201,169,110,0.2)')}
                  >
                    <option value="" style={{ background: '#0D0A07' }}>Select...</option>
                    {governorates.map(g => <option key={g} value={g} style={{ background: '#1a1008' }}>{g}</option>)}
                  </select>
                  <ErrorMsg field="governorate" />
                </div>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <label style={labelStyle}>Order Notes (optional)</label>
                <textarea rows={3} value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--gold)')}
                  onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(201,169,110,0.2)')}
                />
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleContinue}
                style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--black)', background: 'var(--gold)', border: 'none', padding: '1.1rem', cursor: 'pointer', transition: 'all 0.4s ease' }}
              >Continue to Payment</motion.button>
            </motion.div>
          )}

          {/* STEP 2 — PAYMENT */}
          {step === 'payment' && (
            <motion.div key="payment"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.6 }}
              onAnimationComplete={() => { if (isMobile) window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <p className="section-label" style={{ marginBottom: '2rem' }}>Payment Method</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', fee: '+100 EGP service fee' },
                  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Meeza — powered by Paymob', fee: 'Free shipping' },
                ].map(option => (
                  <motion.div key={option.id} whileHover={{ scale: 1.01 }}
                    onClick={() => setPayment(option.id as 'cod' | 'card')}
                    style={{
                      border: `1px solid ${payment === option.id ? 'var(--gold)' : 'rgba(201,169,110,0.15)'}`,
                      padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s ease',
                      background: payment === option.id ? 'rgba(201,169,110,0.05)' : 'transparent',
                      display: 'flex', alignItems: 'flex-start', gap: '1rem',
                    }}
                  >
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, marginTop: '2px', border: `1px solid ${payment === option.id ? 'var(--gold)' : 'rgba(201,169,110,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {payment === option.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--cream)', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{option.label}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{option.desc}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.1em', color: option.id === 'cod' ? '#a0445a' : 'var(--gold)', textTransform: 'uppercase' }}>{option.fee}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {payment === 'cod' && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                  style={{ background: 'rgba(107,26,42,0.1)', border: '1px solid rgba(107,26,42,0.3)', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}
                >
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', color: '#c0566a', lineHeight: 1.7 }}>
                    A service fee of <strong>100 EGP</strong> is added for cash on delivery orders. Choose card payment for free shipping.
                  </p>
                </motion.div>
              )}

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                  🚚 Delivery within <span style={{ color: 'var(--gold)' }}>3–5 business days</span> across Egypt
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setStep('details')}
                  style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', background: 'transparent', border: '1px solid rgba(201,169,110,0.2)', padding: '1.1rem', cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.2)')}
                >← Back</button>
                <motion.button whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}
                  onClick={() => !loading && payment && handleConfirm()}
                  style={{
                    flex: 2, fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                    color: payment && !loading ? 'var(--black)' : 'var(--text-muted)',
                    background: payment && !loading ? 'var(--gold)' : 'rgba(201,169,110,0.15)',
                    border: 'none', padding: '1.1rem', cursor: payment && !loading ? 'pointer' : 'not-allowed', transition: 'all 0.4s ease',
                  }}
                >{loading ? 'Placing Order...' : 'Place Order'}</motion.button>
              </div>
            </motion.div>
          )}

          {/* CONFIRMED */}
          {step === 'confirmed' && (
            <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
              style={{ textAlign: 'center', padding: '4rem 2rem', gridColumn: '1 / -1' }}
            >
              <motion.img src="/compass.png" alt="Compass"
                animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{ width: '90px', height: '90px', margin: '0 auto 2.5rem', display: 'block', filter: 'drop-shadow(0 0 20px rgba(201,169,110,0.5))' }}
              />
              <p className="section-label" style={{ marginBottom: '1.5rem' }}>Order Confirmed</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '2rem' : 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '1.5rem' }}>
                Your Journey Begins
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.9, maxWidth: '480px', margin: '0 auto 1rem' }}>
                Thank you, {form.firstName}. Your order has been placed and will be delivered to {form.city} within 3–5 business days.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
                A confirmation will be sent to <span style={{ color: 'var(--gold)' }}>{form.email}</span>
              </p>
              <motion.div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--gold), transparent)', margin: '0 auto 3rem' }}
                animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
              />
              <a href="/shop" style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--black)', background: 'var(--gold)', padding: '1rem 2.5rem', display: 'inline-block' }}>
                Continue Exploring
              </a>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Order Summary sidebar */}
        {step !== 'confirmed' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
            style={{ alignSelf: 'start', position: isMobile ? 'relative' : 'sticky', top: '8rem' }}
          >
            <p className="section-label" style={{ marginBottom: '1.5rem' }}>Order Summary</p>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '56px', height: '56px', flexShrink: 0, backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--cream)', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>{item.name}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--gold)', flexShrink: 0 }}>{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subtotal</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--cream)' }}>{total().toLocaleString()} EGP</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Shipping</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: payment === 'cod' ? '#c0566a' : 'var(--gold)' }}>
                  {payment === 'cod' ? '+100 EGP' : 'Free'}
                </p>
              </div>
              {payment === 'cod' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}
                >
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: '#c0566a', textTransform: 'uppercase' }}>COD Fee</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#c0566a' }}>100 EGP</p>
                </motion.div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--cream)' }}>Total</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--gold)' }}>
                  {(payment === 'cod' ? codTotal : total()).toLocaleString()} <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>EGP</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}