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
      const { data: reservation, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching reservation:', error);
        return res.status(404).json({ error: 'Reservation not found' });
      }

      res.status(200).json(reservation);
    } catch (error) {
      console.error('Admin reservation fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { status, notes, admin_notes } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      // Valid status values
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }

      // Get current reservation for notifications
      const { data: currentReservation, error: fetchError } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching current reservation:', fetchError);
        return res.status(404).json({ error: 'Reservation not found' });
      }

      // Update reservation
      const { data: reservation, error } = await supabase
        .from('reservations')
        .update({ 
          status, 
          notes, 
          admin_notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating reservation:', error);
        return res.status(500).json({ error: 'Failed to update reservation' });
      }

      // Send notification to customer about status change
      try {
        if (status !== currentReservation.status) {
          await sendNotification('reservationStatusUpdate', {
            customerEmail: reservation.customer_email,
            customerName: reservation.customer_name,
            reservationDate: reservation.reservation_date,
            reservationTime: reservation.reservation_time,
            status: status,
            confirmationCode: reservation.confirmation_code
          });
        }
      } catch (notificationError) {
        console.error('Error sending status update notification:', notificationError);
        // Don't fail the request if notification fails
      }

      res.status(200).json(reservation);
    } catch (error) {
      console.error('Admin reservation update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Get reservation details for notification
      const { data: reservation, error: fetchError } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching reservation for deletion:', fetchError);
        return res.status(404).json({ error: 'Reservation not found' });
      }

      // Delete reservation
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting reservation:', error);
        return res.status(500).json({ error: 'Failed to delete reservation' });
      }

      // Send cancellation notification
      try {
        await sendNotification('reservationCancellation', {
          customerEmail: reservation.customer_email,
          customerName: reservation.customer_name,
          reservationDate: reservation.reservation_date,
          reservationTime: reservation.reservation_time,
          confirmationCode: reservation.confirmation_code
        });
      } catch (notificationError) {
        console.error('Error sending cancellation notification:', notificationError);
      }

      res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
      console.error('Admin reservation deletion error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
