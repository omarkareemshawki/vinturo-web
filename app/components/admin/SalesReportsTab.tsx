'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SalesReportsTabProps {
  cardStyle: any;
}

export function SalesReportsTab({ cardStyle }: SalesReportsTabProps) {
  const [reportType, setReportType] = useState<'overview' | 'by-product' | 'by-date'>('overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sales-report?type=${reportType}`);
      const result = await res.json();
      setData(result.data);
    } catch (err) {
      console.error('Failed to fetch report:', err);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold)', marginBottom: '2rem' }}>
        SALES REPORTS
      </h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          ['overview', 'Overview'],
          ['by-date', 'By Date'],
          ['by-product', 'By Product']
        ].map(([type, label]) => (
          <button
            key={type}
            onClick={() => setReportType(type as any)}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.15em',
              textTransform: 'uppercase', padding: '0.6rem 1rem', cursor: 'pointer',
              border: `1px solid ${reportType === type ? 'var(--gold)' : 'rgba(201,169,110,0.15)'}`,
              background: reportType === type ? 'rgba(201,169,110,0.1)' : 'transparent',
              color: reportType === type ? 'var(--gold)' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
          Loading report...
        </p>
      ) : reportType === 'overview' && data ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Total Revenue', value: `${Math.round(data.totalRevenue).toLocaleString()} EGP`, color: 'var(--gold)' },
            { label: 'Total Orders', value: data.totalOrders, color: 'var(--cream)' },
            { label: 'Completed', value: data.completedOrders, color: '#6BAF7A' },
            { label: 'Cancelled', value: data.cancelledOrders, color: '#a0445a' },
            { label: 'Avg Order Value', value: `${Math.round(data.averageOrderValue)} EGP`, color: 'var(--gold)' },
            { label: 'Cancel Rate', value: `${data.cancelRate.toFixed(1)}%`, color: '#a0445a' },
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
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: kpi.color, margin: 0 }}>
                {kpi.value}
              </p>
            </motion.div>
          ))}
        </div>
      ) : reportType === 'by-product' && Array.isArray(data) ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse',
            fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--cream)'
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(201,169,110,0.2)' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--gold)', fontWeight: 'normal' }}>Product</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--gold)', fontWeight: 'normal' }}>Units Sold</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--gold)', fontWeight: 'normal' }}>Revenue</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--gold)', fontWeight: 'normal' }}>Avg Price</th>
              </tr>
            </thead>
            <tbody>
              {data.map((product: any) => (
                <tr key={product.name} style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
                  <td style={{ padding: '0.75rem' }}>{product.name}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>{product.unitsSold}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--gold)' }}>
                    {Math.round(product.totalRevenue).toLocaleString()} EGP
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    {Math.round(product.avgPrice)} EGP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : reportType === 'by-date' && Array.isArray(data) ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {data.map((day: any) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ ...cardStyle }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--gold)' }}>
                  {new Date(day.date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--gold)' }}>
                  {Math.round(day.revenue).toLocaleString()} EGP
                </p>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                {day.orders} order{day.orders !== 1 ? 's' : ''} • {day.units} unit{day.units !== 1 ? 's' : ''}
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
          No data available
        </p>
      )}
    </div>
  );
}
