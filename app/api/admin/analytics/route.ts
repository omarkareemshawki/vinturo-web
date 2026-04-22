import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const analysisType = searchParams.get('type') || 'popular-products';

    // Fetch all orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (analysisType === 'popular-products') {
      // Analyze popular products
      const productAnalytics: Record<string, any> = {};

      orders?.forEach((order: any) => {
        if (order.status !== 'cancelled') {
          order.items?.forEach((item: any) => {
            if (!productAnalytics[item.id]) {
              productAnalytics[item.id] = {
                id: item.id,
                name: item.name,
                unitsSold: 0,
                totalRevenue: 0,
                orderCount: 0,
                lastSoldAt: null,
              };
            }
            productAnalytics[item.id].unitsSold += item.quantity;
            productAnalytics[item.id].totalRevenue += item.price * item.quantity;
            productAnalytics[item.id].orderCount += 1;
            productAnalytics[item.id].lastSoldAt = order.created_at;
          });
        }
      });

      const popularProducts = Object.values(productAnalytics)
        .map((product: any) => ({
          ...product,
          avgPrice: product.totalRevenue / product.unitsSold,
          pricePerOrder: product.totalRevenue / product.orderCount,
        }))
        .sort((a: any, b: any) => b.unitsSold - a.unitsSold);

      return NextResponse.json({
        type: 'popular-products',
        data: popularProducts,
      });
    }

    // Revenue forecasting using simple trend analysis
    if (analysisType === 'revenue-forecast') {
      // Get daily revenue for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const dailyRevenue: Record<string, number> = {};
      const dailyOrders: Record<string, number> = {};

      // Initialize all days with 0
      for (let i = 0; i < 30; i++) {
        const date = new Date(thirtyDaysAgo);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        dailyRevenue[dateStr] = 0;
        dailyOrders[dateStr] = 0;
      }

      // Calculate actual revenue
      orders?.forEach((order: any) => {
        if (order.status !== 'cancelled') {
          const date = order.created_at.split('T')[0];
          if (dailyRevenue[date] !== undefined) {
            dailyRevenue[date] += order.total;
            dailyOrders[date] += 1;
          }
        }
      });

      // Create timeline data
      const timeline = Object.entries(dailyRevenue).map(([date, revenue]) => ({
        date,
        revenue,
        orders: dailyOrders[date],
      }));

      // Calculate metrics for forecasting
      const validDays = timeline.filter(d => d.revenue > 0);
      const avgDailyRevenue = validDays.length > 0 ? validDays.reduce((sum, d) => sum + d.revenue, 0) / validDays.length : 0;
      const totalDaysWithSales = validDays.length;
      const salesConsistency = (totalDaysWithSales / 30) * 100;

      // Simple linear trend
      let trendRevenue = 0;
      if (validDays.length >= 2) {
        const firstWeek = validDays.slice(0, Math.min(7, validDays.length));
        const lastWeek = validDays.slice(Math.max(0, validDays.length - 7));

        const firstWeekAvg = firstWeek.reduce((sum, d) => sum + d.revenue, 0) / firstWeek.length;
        const lastWeekAvg = lastWeek.reduce((sum, d) => sum + d.revenue, 0) / lastWeek.length;

        trendRevenue = lastWeekAvg - firstWeekAvg;
      }

      // Forecast next 7 days
      const forecast = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        const dateStr = date.toISOString().split('T')[0];
        
        // Simple forecast: average daily revenue with trend
        const forecastedRevenue = Math.max(0, avgDailyRevenue + (trendRevenue * (i + 1) / 7));
        
        return {
          date: dateStr,
          forecastedRevenue: Math.round(forecastedRevenue),
          confidence: salesConsistency > 50 ? 'high' : 'medium',
        };
      });

      return NextResponse.json({
        type: 'revenue-forecast',
        historical: timeline,
        forecast,
        metrics: {
          avgDailyRevenue: Math.round(avgDailyRevenue),
          salesConsistency: Math.round(salesConsistency),
          trend: trendRevenue > 0 ? 'upward' : trendRevenue < 0 ? 'downward' : 'stable',
        },
      });
    }

    return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 });
  } catch (err) {
    console.error('Failed to analyze products:', err);
    return NextResponse.json({ error: 'Failed to analyze products' }, { status: 500 });
  }
}
