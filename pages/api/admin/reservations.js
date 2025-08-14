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
      // Get reservations with filters
      const { status, dateRange, limit = 50, offset = 0 } = req.query;
      
      let query = supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply status filter
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // Apply date range filter
      if (dateRange && dateRange !== 'all') {
        const now = new Date();
        let startDate;

        switch (dateRange) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            query = query.gte('reservation_date', startDate.toISOString());
            break;
          case 'week':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7);
            query = query.gte('reservation_date', startDate.toISOString());
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            query = query.gte('reservation_date', startDate.toISOString());
            break;
        }
      }

      // Apply pagination
      query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

      const { data: reservations, error } = await query;

      if (error) {
        console.error('Error fetching reservations:', error);
        return res.status(500).json({ error: 'Failed to fetch reservations' });
      }

      res.status(200).json(reservations);
    } catch (error) {
      console.error('Admin reservations API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
