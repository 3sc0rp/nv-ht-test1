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
      // Get catering inquiries with filters
      const { status, limit = 50, offset = 0 } = req.query;
      
      let query = supabase
        .from('catering_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply status filter
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // Apply pagination
      query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

      const { data: catering, error } = await query;

      if (error) {
        console.error('Error fetching catering inquiries:', error);
        return res.status(500).json({ error: 'Failed to fetch catering inquiries' });
      }

      res.status(200).json(catering);
    } catch (error) {
      console.error('Admin catering API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
