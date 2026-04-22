import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'overview';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Fetch all orders
    let ordersQuery = supabase.from('orders').select('*');

    if (startDate && endDate) {
      ordersQuery = ordersQuery
        .gte('created_at', startDate)
        .lte('created_at', endDate);
    }

    const { data: orders, error } = await ordersQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (reportType === 'by-product') {
      // Group sales by product
      const productSales: Record<string, any> = {};

      orders?.forEach((order: any) => {
        if (order.status !== 'cancelled') {
          order.items?.forEach((item: any) => {
            if (!productSales[item.id]) {
              productSales[item.id] = {
                name: item.name,
                unitsSold: 0,
                totalRevenue: 0,
                avgPrice: 0,
              };
            }
            productSales[item.id].unitsSold += item.quantity;
            productSales[item.id].totalRevenue += item.price * item.quantity;
          });
        }
      });

      // Calculate averages
      Object.keys(productSales).forEach(key => {
        const product = productSales[key];
        product.avgPrice = product.totalRevenue / product.unitsSold;
      });

      return NextResponse.json({
        type: 'by-product',
        data: Object.values(productSales).sort(
          (a: any, b: any) => b.totalRevenue - a.totalRevenue
        ),
      });
    }

    if (reportType === 'by-date') {
      // Group sales by date
      const salesByDate: Record<string, any> = {};

      orders?.forEach((order: any) => {
        if (order.status !== 'cancelled') {
          const date = order.created_at.split('T')[0];
          if (!salesByDate[date]) {
            salesByDate[date] = {
              date,
              orders: 0,
              revenue: 0,
              units: 0,
            };
          }
          salesByDate[date].orders += 1;
          salesByDate[date].revenue += order.total;
          salesByDate[date].units += order.items?.reduce(
            (sum: number, item: any) => sum + item.quantity,
            0
          ) || 0;
        }
      });

      return NextResponse.json({
        type: 'by-date',
        data: Object.values(salesByDate).sort(
          (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
      });
    }

    // Overview stats
    const totalRevenue = orders
      ?.filter((o: any) => o.status !== 'cancelled')
      .reduce((sum: number, o: any) => sum + o.total, 0) || 0;

    const totalOrders = orders?.length || 0;
    const cancelledOrders = orders?.filter((o: any) => o.status === 'cancelled').length || 0;
    const completedOrders = orders?.filter((o: any) => o.status === 'delivered').length || 0;

    const totalUnits = orders
      ?.filter((o: any) => o.status !== 'cancelled')
      .reduce((sum: number, o: any) => {
        return sum + (o.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0);
      }, 0) || 0;

    return NextResponse.json({
      type: 'overview',
      data: {
        totalRevenue,
        totalOrders,
        cancelledOrders,
        completedOrders,
        totalUnits,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        cancelRate: totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0,
      },
    });
  } catch (err) {
    console.error('Failed to generate report:', err);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
