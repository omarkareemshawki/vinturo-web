'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnalyticsTabProps {
  cardStyle: any;
}

export function AnalyticsTab({ cardStyle }: AnalyticsTabProps) {
  const [analysisType, setAnalysisType] = useState<'popular-products' | 'revenue-forecast'>('popular-products');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [analysisType]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?type=${analysisType}`);
      const result = await res.json();
      setData(result.data || result);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold)', marginBottom: '2rem' }}>
        ANALYTICS & INSIGHTS
      </h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          ['popular-products', 'Popular Products'],
          ['revenue-forecast', 'Revenue Forecast']
        ].map(([type, label]) => (
          <button
            key={type}
            onClick={() => setAnalysisType(type as any)}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.15em',
              textTransform: 'uppercase', padding: '0.6rem 1rem', cursor: 'pointer',
              border: `1px solid ${analysisType === type ? 'var(--gold)' : 'rgba(201,169,110,0.15)'}`,
              background: analysisType === type ? 'rgba(201,169,110,0.1)' : 'transparent',
              color: analysisType === type ? 'var(--gold)' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
          Loading analytics...
        </p>
      ) : analysisType === 'popular-products' && Array.isArray(data) ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {data.slice(0, 12).map((product: any, i: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ ...cardStyle }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'var(--gold)', flex: 1 }}>
                  {product.name}
                </h3>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.1em',
                  textTransform: 'uppercase', background: 'rgba(201,169,110,0.1)',
                  color: 'var(--gold)', padding: '0.25rem 0.5rem', whiteSpace: 'nowrap'
                }}>
                  #{i + 1}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.45rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    UNITS SOLD
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#6BAF7A', margin: 0 }}>
                    {product.unitsSold}
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.45rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    REVENUE
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold)', margin: 0 }}>
                    {Math.round(product.totalRevenue).toLocaleString()} EGP
                  </p>
                </div>
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem',
                paddingTop: '0.75rem', borderTop: '1px solid rgba(201,169,110,0.1)'
              }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.45rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    ORDERS
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--cream)', margin: 0 }}>
                    {product.orderCount}
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.45rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    AVG PRICE
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--cream)', margin: 0 }}>
                    {Math.round(product.avgPrice)} EGP
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : analysisType === 'revenue-forecast' && data && data.metrics ? (
        <div>
          {/* Forecast Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Avg Daily Revenue', value: `${data.metrics.avgDailyRevenue.toLocaleString()} EGP`, color: 'var(--gold)' },
              { label: 'Sales Consistency', value: `${data.metrics.salesConsistency.toFixed(1)}%`, color: '#6B9FBF' },
              { label: 'Trend', value: data.metrics.trend.toUpperCase(), color: data.metrics.trend === 'upward' ? '#6BAF7A' : data.metrics.trend === 'downward' ? '#a0445a' : 'var(--text-muted)' },
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

          {/* Forecast */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ ...cardStyle }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--gold)', marginBottom: '1rem' }}>
              7-DAY FORECAST
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.forecast.map((day: any, i: number) => (
                <div key={day.date} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingBottom: '0.75rem', borderBottom: i < data.forecast.length - 1 ? '1px solid rgba(201,169,110,0.1)' : 'none'
                }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', color: 'var(--cream)', marginBottom: '0.25rem' }}>
                      {new Date(day.date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', color: day.confidence === 'high' ? '#6BAF7A' : 'var(--text-muted)' }}>
                      {day.confidence.toUpperCase()} CONFIDENCE
                    </p>
                  </div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--gold)' }}>
                    {day.forecastedRevenue.toLocaleString()} EGP
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
          No data available
        </p>
      )}
    </div>
  );
}
