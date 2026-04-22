import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
  try {
    // Fetch all orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Analyze customer behavior
    const customerMap: Record<string, any> = {};

    orders?.forEach((order: any) => {
      const email = order.email;
      if (!customerMap[email]) {
        customerMap[email] = {
          email,
          totalPurchases: 0,
          totalSpent: 0,
          lastPurchaseAt: null,
          favoriteProduct: null,
          products: {} as Record<string, number>,
        };
      }

      customerMap[email].totalPurchases += 1;
      customerMap[email].totalSpent += order.status !== 'cancelled' ? order.total : 0;
      customerMap[email].lastPurchaseAt = order.created_at;

      // Track product preferences
      order.items?.forEach((item: any) => {
        if (!customerMap[email].products[item.id]) {
          customerMap[email].products[item.id] = 0;
        }
        customerMap[email].products[item.id] += item.quantity;
      });
    });

    // Process customer data
    const customers = Object.values(customerMap).map((customer: any) => {
      // Find favorite product
      let maxCount = 0;
      let favoriteProduct = null;
      Object.entries(customer.products).forEach(([productId, count]: [string, any]) => {
        if (count > maxCount) {
          maxCount = count;
          favoriteProduct = productId;
        }
      });

      customer.favoriteProduct = favoriteProduct;

      // Determine purchase frequency
      let frequency = 'one-time';
      if (customer.totalPurchases >= 5) {
        frequency = 'frequent';
      } else if (customer.totalPurchases >= 2) {
        frequency = 'repeat';
      }

      return {
        email: customer.email,
        totalPurchases: customer.totalPurchases,
        totalSpent: customer.totalSpent,
        lastPurchaseAt: customer.lastPurchaseAt,
        favoriteProduct: customer.favoriteProduct,
        purchaseFrequency: frequency,
        averageOrderValue: customer.totalPurchases > 0 ? customer.totalSpent / customer.totalPurchases : 0,
      };
    });

    // Calculate insights
    const totalCustomers = customers.length;
    const repeatCustomers = customers.filter(c => c.totalPurchases > 1).length;
    const frequentCustomers = customers.filter(c => c.purchaseFrequency === 'frequent').length;

    // Top customers
    const topCustomers = customers
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    // Churn analysis (customers who haven't purchased in 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const churnedCustomers = customers.filter(c => {
      const lastPurchaseDate = new Date(c.lastPurchaseAt);
      return lastPurchaseDate < thirtyDaysAgo && c.totalPurchases > 1;
    });

    return NextResponse.json({
      insights: {
        totalCustomers,
        repeatCustomers,
        frequentCustomers,
        repeatRate: totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0,
        frequentRate: totalCustomers > 0 ? (frequentCustomers / totalCustomers) * 100 : 0,
        churnedCustomers: churnedCustomers.length,
        churnRate: repeatCustomers > 0 ? (churnedCustomers.length / repeatCustomers) * 100 : 0,
        topCustomers,
        atRiskCustomers: churnedCustomers.sort(
          (a, b) => new Date(b.lastPurchaseAt).getTime() - new Date(a.lastPurchaseAt).getTime()
        ),
      },
    });
  } catch (err) {
    console.error('Failed to analyze customer behavior:', err);
    return NextResponse.json({ error: 'Failed to analyze customer behavior' }, { status: 500 });
  }
}
