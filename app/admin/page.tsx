'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import { ProductsTab } from '../components/admin/ProductsTab';
import { SalesReportsTab } from '../components/admin/SalesReportsTab';
import { CustomerInsightsTab } from '../components/admin/CustomerInsightsTab';
import { AnalyticsTab } from '../components/admin/AnalyticsTab';

type Order = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  governorate: string;
  payment_method: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#C9A96E',
  on_the_way: '#6B9FBF',
  delivered: '#6BAF7A',
  cancelled: '#a0445a',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  on_the_way: 'On the Way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'sales-reports' | 'customer-insights' | 'analytics'>('overview');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const auth = document.cookie.includes('admin_auth=true');
      if (!auth) {
        router.push('/admin/login');
        return;
      }
      setAuthenticated(true);
      fetchOrders();
    };
    checkAuth();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } else {
        setOrders(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders([]);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    setMessage('');
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) {
        console.error('Error updating status:', error);
        setMessage(`Failed to update status: ${error.message || 'Unknown error'}`);
      } else {
        setMessage('Status updated successfully.');
        await fetchOrders();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      setMessage('Failed to update status. Please try again.');
    }
    setUpdatingId(null);
  };

  // Metrics
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const onTheWayOrders = orders.filter(o => o.status === 'on_the_way').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
  const explorersSold = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => {
    const item = o.items?.find((i: any) => i.id === 'explorers-quest');
    return sum + (item ? item.quantity : 0);
  }, 0);
  const odysseySold = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => {
    const item = o.items?.find((i: any) => i.id === 'forbidden-odyssey');
    return sum + (item ? item.quantity : 0);
  }, 0);
  const codOrders = orders.filter(o => o.payment_method === 'cod').length;
  const cardOrders = orders.filter(o => o.payment_method === 'card').length;

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const revenueByDay = last7Days.map(day => ({
    day: day.slice(5),
    revenue: orders
      .filter(o => o.status !== 'cancelled' && o.created_at.startsWith(day))
      .reduce((sum, o) => sum + o.total, 0),
    count: orders.filter(o => o.created_at.startsWith(day)).length,
  }));

  const maxRevenue = Math.max(...revenueByDay.map(d => d.revenue), 1);

  const filteredOrders = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

  const cardStyle = {
    background: 'rgba(201,169,110,0.04)',
    border: '1px solid rgba(201,169,110,0.12)',
    padding: '1.5rem',
  };

  if (!authenticated) return null;

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Top Bar */}
      <div style={{ borderBottom: '1px solid rgba(201,169,110,0.1)', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: 0, background: 'rgba(13,10,7,0.95)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/compass.png" alt="Compass" style={{ width: '28px', height: '28px', filter: 'drop-shadow(0 0 6px rgba(201,169,110,0.4))' }} />
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.2em', color: 'var(--gold)', margin: 0 }}>VENTURO</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.45rem', letterSpacing: '0.3em', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase' }}>Admin Dashboard</p>
          </div>
        </div>
      </div>

      {message && (
        <div style={{ padding: '1rem', textAlign: 'center', background: message.includes('Failed') ? 'rgba(160, 68, 90, 0.1)' : 'rgba(201, 169, 110, 0.1)', borderBottom: `1px solid ${message.includes('Failed') ? '#a0445a' : 'var(--gold)'}` }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: message.includes('Failed') ? '#a0445a' : 'var(--gold)', letterSpacing: '0.1em' }}>{message}</p>
        </div>
      )}

      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {[['overview', 'Overview'], ['orders', 'Orders'], ['products', 'Products'], ['sales-reports', 'Sales Reports'], ['customer-insights', 'Customers'], ['analytics', 'Analytics']].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)}
              style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0.6rem 1.5rem', cursor: 'pointer', border: 'none', background: activeTab === tab ? 'var(--gold)' : 'transparent', color: activeTab === tab ? 'var(--black)' : 'var(--text-muted)', borderBottom: activeTab !== tab ? '1px solid rgba(201,169,110,0.2)' : 'none', transition: 'all 0.3s ease' }}
            >{label}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <motion.img src="/compass.png" alt="Loading"
              animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ width: '50px', height: '50px', margin: '0 auto', display: 'block', opacity: 0.5 }}
            />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '1rem', letterSpacing: '0.2em' }}>Loading data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>

                {/* KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {[
                    { label: 'Total Revenue', value: `${totalRevenue.toLocaleString()} EGP`, color: 'var(--gold)' },
                    { label: 'Total Orders', value: orders.length, color: 'var(--cream)' },
                    { label: 'Pending', value: pendingOrders, color: '#C9A96E' },
                    { label: 'On the Way', value: onTheWayOrders, color: '#6B9FBF' },
                    { label: 'Delivered', value: deliveredOrders, color: '#6BAF7A' },
                    { label: 'Cancelled', value: cancelledOrders, color: '#a0445a' },
                  ].map((kpi, i) => (
                    <motion.div key={kpi.label}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      style={cardStyle}
                    >
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.48rem', letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{kpi.label}</p>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: kpi.color, margin: 0 }}>{kpi.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Revenue Chart */}
                <div style={{ ...cardStyle, marginBottom: '2rem' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Revenue — Last 7 Days</p>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '160px' }}>
                    {revenueByDay.map((d, i) => (
                      <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.45rem', color: 'var(--text-muted)' }}>{d.revenue > 0 ? `${(d.revenue / 1000).toFixed(1)}k` : ''}</p>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: d.revenue === 0 ? '4px' : `${(d.revenue / maxRevenue) * 120}px` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          style={{ width: '100%', background: d.revenue > 0 ? 'linear-gradient(to top, var(--gold), rgba(201,169,110,0.3))' : 'rgba(201,169,110,0.1)', borderRadius: '2px 2px 0 0' }}
                        />
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.45rem', color: 'var(--text-muted)' }}>{d.day}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>

                  {/* Collections */}
                  <div style={cardStyle}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Collections Sold</p>
                    {[
                      { name: "Explorer's Quest", sold: explorersSold, color: 'var(--gold)' },
                      { name: 'Forbidden Odyssey', sold: odysseySold, color: '#a0445a' },
                    ].map(col => (
                      <div key={col.name} style={{ marginBottom: '1.2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--cream)' }}>{col.name}</p>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: col.color }}>{col.sold}</p>
                        </div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${explorersSold + odysseySold === 0 ? 0 : (col.sold / (explorersSold + odysseySold)) * 100}%` }}
                            transition={{ duration: 1 }}
                            style={{ height: '100%', background: col.color, borderRadius: '2px' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Methods */}
                  <div style={cardStyle}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Payment Methods</p>
                    {[
                      { name: 'Cash on Delivery', count: codOrders, color: 'var(--gold)' },
                      { name: 'Card / Online', count: cardOrders, color: '#6B9FBF' },
                    ].map(pm => (
                      <div key={pm.name} style={{ marginBottom: '1.2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--cream)' }}>{pm.name}</p>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: pm.color }}>{pm.count}</p>
                        </div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${orders.length === 0 ? 0 : (pm.count / orders.length) * 100}%` }}
                            transition={{ duration: 1 }}
                            style={{ height: '100%', background: pm.color, borderRadius: '2px' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Governorates */}
                <div style={cardStyle}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Top Governorates</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
                    {Object.entries(
                      orders.reduce((acc: Record<string, number>, o) => {
                        acc[o.governorate] = (acc[o.governorate] || 0) + 1;
                        return acc;
                      }, {})
                    ).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([gov, count]) => (
                      <div key={gov} style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.08)', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>{gov}</p>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--gold)' }}>{count}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>

                {/* Filter */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  {['all', 'pending', 'on_the_way', 'delivered', 'cancelled'].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.15em',
                        textTransform: 'uppercase', padding: '0.4rem 1rem', cursor: 'pointer',
                        border: `1px solid ${statusFilter === s ? 'var(--gold)' : 'rgba(201,169,110,0.15)'}`,
                        background: statusFilter === s ? 'rgba(201,169,110,0.1)' : 'transparent',
                        color: statusFilter === s ? 'var(--gold)' : 'var(--text-muted)',
                        transition: 'all 0.2s ease',
                      }}
                    >{s === 'all' ? 'All' : STATUS_LABELS[s]} {s !== 'all' && `(${orders.filter(o => o.status === s).length})`}</button>
                  ))}
                </div>

                {/* Orders Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {filteredOrders.length === 0 ? (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>No orders found.</p>
                  ) : filteredOrders.map((order, i) => (
                    <motion.div key={order.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                      style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                    >
                      <div>
                        {/* Order Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                          <span style={{
                            fontFamily: 'var(--font-body)', fontSize: '0.48rem', letterSpacing: '0.15em',
                            textTransform: 'uppercase', padding: '0.3rem 0.8rem',
                            background: `${STATUS_COLORS[order.status]}20`,
                            color: STATUS_COLORS[order.status],
                            border: `1px solid ${STATUS_COLORS[order.status]}40`,
                          }}>{STATUS_LABELS[order.status] || order.status}</span>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                            {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        {/* Customer */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem 2rem', marginBottom: '1rem' }}>
                          <div>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.45rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Customer</p>
                            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--cream)', letterSpacing: '0.05em' }}>{order.first_name} {order.last_name}</p>
                          </div>
                          <div>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.45rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Contact</p>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--cream)' }}>{order.phone}</p>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>{order.email}</p>
                          </div>
                          <div>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.45rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Delivery</p>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--cream)' }}>{order.city}, {order.governorate}</p>
                          </div>
                          <div>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.45rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Payment</p>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--cream)' }}>{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Card'}</p>
                          </div>
                        </div>

                        {/* Items */}
                        <div style={{ borderTop: '1px solid rgba(201,169,110,0.08)', paddingTop: '0.75rem' }}>
                          {order.items?.map((item: any) => (
                            <p key={item.id} style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                              — {item.name} × {item.quantity}
                            </p>
                          ))}
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold)', marginTop: '0.5rem' }}>
                            {order.total.toLocaleString()} EGP
                          </p>
                        </div>
                      </div>

                      {/* Status Controls */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.45rem', letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Update Status</p>
                        {['pending', 'on_the_way', 'delivered', 'cancelled'].map(s => (
                          <button key={s}
                            onClick={() => updateStatus(order.id, s)}
                            disabled={order.status === s || updatingId === order.id}
                            style={{
                              fontFamily: 'var(--font-body)', fontSize: '0.48rem', letterSpacing: '0.12em',
                              textTransform: 'uppercase', padding: '0.4rem 0.6rem', cursor: order.status === s ? 'default' : 'pointer',
                              border: `1px solid ${order.status === s ? STATUS_COLORS[s] : 'rgba(201,169,110,0.15)'}`,
                              background: order.status === s ? `${STATUS_COLORS[s]}20` : 'transparent',
                              color: order.status === s ? STATUS_COLORS[s] : 'var(--text-muted)',
                              opacity: updatingId === order.id ? 0.5 : 1,
                              transition: 'all 0.2s ease',
                            }}
                          >{STATUS_LABELS[s]}</button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                <ProductsTab cardStyle={cardStyle} />
              </motion.div>
            )}

            {activeTab === 'sales-reports' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                <SalesReportsTab cardStyle={cardStyle} />
              </motion.div>
            )}

            {activeTab === 'customer-insights' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                <CustomerInsightsTab cardStyle={cardStyle} />
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                <AnalyticsTab cardStyle={cardStyle} />
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}