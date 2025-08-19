import { createClient } from '@supabase/supabase-js';
import { adminRateLimit } from '../../../lib/rateLimit';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Apply rate limiting
  await new Promise((resolve) => {
    adminRateLimit(req, res, resolve);
  });

  if (req.method === 'GET') {
    try {
      // Get current date for calculations
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      // Parallel queries for statistics
      const [
        todayReservationsResult,
        pendingReservationsResult,
        pendingCateringResult,
        monthlyReservationsResult,
        totalCustomersResult,
        recentActivityResult
      ] = await Promise.all([
        // Today's reservations
        supabase
          .from('reservations')
          .select('id', { count: 'exact' })
          .gte('reservation_date', today.toISOString())
          .lt('reservation_date', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()),

        // Pending reservations
        supabase
          .from('reservations')
          .select('id', { count: 'exact' })
          .eq('status', 'pending'),

        // Pending catering requests
        supabase
          .from('catering_inquiries')
          .select('id', { count: 'exact' })
          .eq('status', 'pending'),

        // This month's reservations
        supabase
          .from('reservations')
          .select('id')
          .gte('created_at', thisMonth.toISOString())
          .eq('status', 'confirmed'),

        // Total unique customers
        supabase
          .from('reservations')
          .select('customer_email')
          .not('customer_email', 'is', null),

        // Recent activity (last 10 reservations)
        supabase
          .from('reservations')
          .select('id, customer_name, customer_email, reservation_date, reservation_time, status, created_at')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      // Calculate monthly revenue estimate (assuming average $30 per person)
      const avgRevenuePerReservation = 30;
      const monthlyRevenue = (monthlyReservationsResult.data?.length || 0) * avgRevenuePerReservation;

      // Count unique customers
      const uniqueEmails = new Set(
        totalCustomersResult.data?.map(item => item.customer_email) || []
      );

      // Get growth statistics
      const lastMonthReservationsResult = await supabase
        .from('reservations')
        .select('id', { count: 'exact' })
        .gte('created_at', lastMonth.toISOString())
        .lt('created_at', thisMonth.toISOString())
        .eq('status', 'confirmed');

      const thisMonthCount = monthlyReservationsResult.data?.length || 0;
      const lastMonthCount = lastMonthReservationsResult.count || 0;
      const growthPercentage = lastMonthCount > 0 
        ? Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100)
        : 0;

      // Additional statistics
      const [
        totalReservationsResult,
        totalCateringResult,
        avgPartySizeResult,
        popularTimeSlotsResult
      ] = await Promise.all([
        supabase
          .from('reservations')
          .select('id', { count: 'exact' }),

        supabase
          .from('catering_inquiries')
          .select('id', { count: 'exact' }),

        supabase
          .from('reservations')
          .select('party_size')
          .not('party_size', 'is', null),

        supabase
          .from('reservations')
          .select('reservation_time')
          .not('reservation_time', 'is', null)
          .eq('status', 'confirmed')
          .gte('created_at', thisMonth.toISOString())
      ]);

      // Calculate average party size
      const partySizes = avgPartySizeResult.data?.map(r => r.party_size) || [];
      const avgPartySize = partySizes.length > 0
        ? Math.round(partySizes.reduce((sum, size) => sum + size, 0) / partySizes.length * 10) / 10
        : 0;

      // Calculate popular time slots
      const timeSlots = popularTimeSlotsResult.data?.map(r => r.reservation_time) || [];
      const timeSlotCounts = timeSlots.reduce((acc, time) => {
        acc[time] = (acc[time] || 0) + 1;
        return acc;
      }, {});

      const popularTimeSlots = Object.entries(timeSlotCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([time, count]) => ({ time, count }));

      // Status distribution for reservations
      const statusDistributionResult = await supabase
        .from('reservations')
        .select('status')
        .gte('created_at', thisMonth.toISOString());

      const statusDistribution = statusDistributionResult.data?.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {}) || {};

      const stats = {
        // Main metrics
        todayReservations: todayReservationsResult.count || 0,
        pendingRequests: (pendingReservationsResult.count || 0) + (pendingCateringResult.count || 0),
        monthlyRevenue: monthlyRevenue,
        totalCustomers: uniqueEmails.size,

        // Growth metrics
        monthlyReservations: thisMonthCount,
        lastMonthReservations: lastMonthCount,
        growthPercentage: growthPercentage,

        // Operational metrics
        totalReservations: totalReservationsResult.count || 0,
        totalCateringInquiries: totalCateringResult.count || 0,
        avgPartySize: avgPartySize,
        popularTimeSlots: popularTimeSlots,

        // Status distribution
        statusDistribution: statusDistribution,

        // Recent activity
        recentActivity: recentActivityResult.data || [],

        // Additional insights
        insights: {
          busyDay: popularTimeSlots.length > 0 ? 'Peak times identified' : 'No peak time data',
          customerRetention: uniqueEmails.size > 0 ? 'Growing customer base' : 'New restaurant',
          monthlyTrend: growthPercentage > 0 ? 'Growing' : growthPercentage < 0 ? 'Declining' : 'Stable'
        }
      };

      res.status(200).json(stats);
    } catch (error) {
      console.error('Admin stats API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
