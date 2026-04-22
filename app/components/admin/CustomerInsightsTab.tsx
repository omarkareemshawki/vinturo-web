'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CustomerInsightsTabProps {
  cardStyle: any;
}

export function CustomerInsightsTab({ cardStyle }: CustomerInsightsTabProps) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/customer-behavior');
      const data = await res.json();
      setInsights(data.insights);
    } catch (err) {
      console.error('Failed to fetch insights:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
        Loading customer insights...
      </p>
    );
  }

  if (!insights) {
    return (
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
        No customer data available
      </p>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold)', marginBottom: '2rem' }}>
        CUSTOMER INSIGHTS
      </h2>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Customers', value: insights.totalCustomers, color: 'var(--gold)' },
          { label: 'Repeat Customers', value: insights.repeatCustomers, color: '#6BAF7A' },
          { label: 'Frequent Customers', value: insights.frequentCustomers, color: '#6B9FBF' },
          { label: 'Repeat Rate', value: `${insights.repeatRate.toFixed(1)}%`, color: 'var(--gold)' },
          { label: 'Churn Rate', value: `${insights.churnRate.toFixed(1)}%`, color: '#a0445a' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ ...cardStyle }}
          >
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.48rem', letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              {kpi.label}
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: kpi.color, margin: 0 }}>
              {kpi.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Top Customers */}
      {insights.topCustomers && insights.topCustomers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ ...cardStyle, marginBottom: '2rem' }}
        >
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--gold)', marginBottom: '1rem' }}>
            TOP CUSTOMERS
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {insights.topCustomers.slice(0, 5).map((customer: any, i: number) => (
              <div key={customer.email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--cream)', marginBottom: '0.25rem' }}>
                    {i + 1}. {customer.email}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', color: 'var(--text-muted)' }}>
                    {customer.totalPurchases} purchase{customer.totalPurchases !== 1 ? 's' : ''}
                  </p>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--gold)' }}>
                  {Math.round(customer.totalSpent).toLocaleString()} EGP
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Churned Customers */}
      {insights.atRiskCustomers && insights.atRiskCustomers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ ...cardStyle, background: 'rgba(160,68,90,0.04)', border: '1px solid rgba(160,68,90,0.12)' }}
        >
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: '#a0445a', marginBottom: '1rem' }}>
            AT-RISK CUSTOMERS (No purchase in 30 days)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {insights.atRiskCustomers.slice(0, 5).map((customer: any) => (
              <div key={customer.email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(160,68,90,0.1)' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--cream)', marginBottom: '0.25rem' }}>
                    {customer.email}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', color: 'var(--text-muted)' }}>
                    Last purchase: {new Date(customer.lastPurchaseAt).toLocaleDateString()}
                  </p>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', color: '#a0445a', fontWeight: 'bold' }}>
                  AT RISK
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
