import { createClient } from '@supabase/supabase-js';
import { adminRateLimit } from '../../../../lib/rateLimit';
import { sendNotification } from '../../../../lib/notifications';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Apply rate limiting
  await new Promise((resolve) => {
    adminRateLimit(req, res, resolve);
  });

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { data: catering, error } = await supabase
        .from('catering_inquiries')
        .select(`
          *,
          catering_files (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching catering inquiry:', error);
        return res.status(404).json({ error: 'Catering inquiry not found' });
      }

      res.status(200).json(catering);
    } catch (error) {
      console.error('Admin catering fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { status, admin_notes, estimated_cost, proposal_details } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      // Valid status values
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'quoted'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }

      // Get current catering inquiry for notifications
      const { data: currentCatering, error: fetchError } = await supabase
        .from('catering_inquiries')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching current catering inquiry:', fetchError);
        return res.status(404).json({ error: 'Catering inquiry not found' });
      }

      // Update catering inquiry
      const updateData = { 
        status, 
        admin_notes,
        updated_at: new Date().toISOString()
      };

      if (estimated_cost) {
        updateData.estimated_cost = parseFloat(estimated_cost);
      }

      if (proposal_details) {
        updateData.proposal_details = proposal_details;
      }

      const { data: catering, error } = await supabase
        .from('catering_inquiries')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating catering inquiry:', error);
        return res.status(500).json({ error: 'Failed to update catering inquiry' });
      }

      // Send notification to customer about status change
      try {
        if (status !== currentCatering.status) {
          const notificationData = {
            customerEmail: catering.contact_email,
            customerName: catering.contact_name,
            eventDate: catering.event_date,
            eventType: catering.event_type,
            status: status,
            confirmationCode: catering.confirmation_code
          };

          if (status === 'quoted' && estimated_cost) {
            notificationData.estimatedCost = estimated_cost;
            notificationData.proposalDetails = proposal_details;
          }

          await sendNotification('cateringStatusUpdate', notificationData);
        }
      } catch (notificationError) {
        console.error('Error sending status update notification:', notificationError);
        // Don't fail the request if notification fails
      }

      res.status(200).json(catering);
    } catch (error) {
      console.error('Admin catering update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Get catering inquiry details for notification
      const { data: catering, error: fetchError } = await supabase
        .from('catering_inquiries')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching catering inquiry for deletion:', fetchError);
        return res.status(404).json({ error: 'Catering inquiry not found' });
      }

      // Delete associated files first
      const { error: filesError } = await supabase
        .from('catering_files')
        .delete()
        .eq('catering_id', id);

      if (filesError) {
        console.error('Error deleting catering files:', filesError);
      }

      // Delete catering inquiry
      const { error } = await supabase
        .from('catering_inquiries')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting catering inquiry:', error);
        return res.status(500).json({ error: 'Failed to delete catering inquiry' });
      }

      // Send cancellation notification
      try {
        await sendNotification('cateringCancellation', {
          customerEmail: catering.contact_email,
          customerName: catering.contact_name,
          eventDate: catering.event_date,
          eventType: catering.event_type,
          confirmationCode: catering.confirmation_code
        });
      } catch (notificationError) {
        console.error('Error sending cancellation notification:', notificationError);
      }

      res.status(200).json({ message: 'Catering inquiry deleted successfully' });
    } catch (error) {
      console.error('Admin catering deletion error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
