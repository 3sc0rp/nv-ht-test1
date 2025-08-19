import { createClient } from '@supabase/supabase-js';
import { sendNotification } from '../../lib/notifications';
import { generateConfirmationCode } from '../../lib/utils';
import { validateReservationData } from '../../lib/validation';
import { checkRateLimit } from '../../lib/rateLimit';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      // Rate limiting
      const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const rateLimitResult = await checkRateLimit(clientIP, 'reservation');
      
      if (!rateLimitResult.allowed) {
        return res.status(429).json({ 
          error: 'Too many reservation attempts. Please try again later.',
          resetTime: rateLimitResult.resetTime
        });
      }

      // Validate input data
      const validationResult = validateReservationData(req.body);
      if (!validationResult.isValid) {
        return res.status(400).json({ 
          error: 'Invalid reservation data',
          details: validationResult.errors
        });
      }

      const {
        name,
        email,
        phone,
        date,
        time,
        partySize,
        specialOccasion,
        specialRequests,
        dietaryRestrictions,
        language = 'en'
      } = req.body;

      // Check table availability
      const availabilityCheck = await checkTableAvailability(date, time.value, partySize.value);
      if (!availabilityCheck.available) {
        return res.status(400).json({ 
          error: 'No tables available for the selected date and time',
          suggestion: availabilityCheck.suggestion
        });
      }

      // Generate confirmation code
      const confirmationCode = generateConfirmationCode();

      // Insert reservation into database
      const { data: reservation, error: insertError } = await supabase
        .from('reservations')
        .insert({
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          reservation_date: date,
          reservation_time: time.value,
          party_size: partySize.value,
          special_occasion: specialOccasion?.value || null,
          special_requests: specialRequests || null,
          dietary_restrictions: dietaryRestrictions || null,
          confirmation_code: confirmationCode,
          preferred_language: language,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error:', insertError);
        return res.status(500).json({ error: 'Failed to create reservation' });
      }

      // Update table availability
      await updateTableAvailability(date, time.value, -1);

      // Send notifications
      try {
        // Send customer confirmation email
        await sendNotification({
          type: 'email',
          template: 'reservation_confirmation',
          recipient: email,
          language: language,
          data: {
            customer_name: name,
            reservation_date: new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            reservation_time: time.label,
            party_size: partySize.label,
            confirmation_code: confirmationCode,
            special_requests: specialRequests || 'None',
            dietary_restrictions: dietaryRestrictions || 'None'
          },
          referenceId: reservation.id,
          referenceType: 'reservation'
        });

        // Send admin notification
        await sendNotification({
          type: 'email',
          template: 'admin_new_reservation',
          recipient: process.env.ADMIN_EMAIL,
          language: 'en',
          data: {
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            reservation_date: new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            reservation_time: time.label,
            party_size: partySize.label,
            special_occasion: specialOccasion?.label || 'None',
            special_requests: specialRequests || 'None',
            dietary_restrictions: dietaryRestrictions || 'None',
            confirmation_code: confirmationCode
          },
          referenceId: reservation.id,
          referenceType: 'reservation'
        });

        // Send SMS notification if configured
        if (process.env.TWILIO_ACCOUNT_SID) {
          await sendNotification({
            type: 'sms',
            recipient: process.env.RESTAURANT_PHONE,
            message: `New reservation: ${name} for ${partySize.label} on ${new Date(date).toLocaleDateString()} at ${time.label}. Code: ${confirmationCode}`,
            referenceId: reservation.id,
            referenceType: 'reservation'
          });
        }

        // Send Slack notification if configured
        if (process.env.SLACK_WEBHOOK_URL) {
          await sendNotification({
            type: 'slack',
            data: {
              text: `🍽️ New Reservation Alert`,
              blocks: [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `*New Reservation Received*\n\n*Customer:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Date:* ${new Date(date).toLocaleDateString()}\n*Time:* ${time.label}\n*Party Size:* ${partySize.label}\n*Confirmation Code:* ${confirmationCode}`
                  }
                }
              ]
            },
            referenceId: reservation.id,
            referenceType: 'reservation'
          });
        }

        // Add to Google Calendar if configured
        if (process.env.GOOGLE_CALENDAR_ID) {
          await sendNotification({
            type: 'calendar',
            data: {
              summary: `Reservation - ${name}`,
              description: `Reservation for ${partySize.label}\nPhone: ${phone}\nEmail: ${email}\nSpecial Requests: ${specialRequests || 'None'}\nConfirmation Code: ${confirmationCode}`,
              start: {
                dateTime: `${date}T${time.value}:00`,
                timeZone: 'America/New_York'
              },
              end: {
                dateTime: `${date}T${addHours(time.value, 2)}:00`,
                timeZone: 'America/New_York'
              },
              attendees: [
                { email: email, displayName: name }
              ]
            },
            referenceId: reservation.id,
            referenceType: 'reservation'
          });
        }

      } catch (notificationError) {
        console.error('Notification error:', notificationError);
        // Don't fail the reservation if notifications fail
      }

      res.status(201).json({
        success: true,
        message: 'Reservation created successfully',
        reservationId: reservation.id,
        confirmationCode: confirmationCode,
        data: reservation
      });

    } catch (error) {
      console.error('Reservation API error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'An error occurred while processing your reservation'
      });
    }
  }

  else if (req.method === 'GET') {
    try {
      const { confirmationCode, email } = req.query;

      if (confirmationCode) {
        // Get reservation by confirmation code
        const { data: reservation, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('confirmation_code', confirmationCode)
          .single();

        if (error || !reservation) {
          return res.status(404).json({ error: 'Reservation not found' });
        }

        res.status(200).json({ reservation });
      } else if (email) {
        // Get reservations by email
        const { data: reservations, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('customer_email', email)
          .order('reservation_date', { ascending: true });

        if (error) {
          return res.status(500).json({ error: 'Failed to fetch reservations' });
        }

        res.status(200).json({ reservations });
      } else {
        res.status(400).json({ error: 'Missing required parameters' });
      }
    } catch (error) {
      console.error('Get reservation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  else if (req.method === 'PUT') {
    try {
      const { confirmationCode, action, ...updateData } = req.body;

      if (!confirmationCode) {
        return res.status(400).json({ error: 'Confirmation code required' });
      }

      // Get existing reservation
      const { data: existingReservation, error: fetchError } = await supabase
        .from('reservations')
        .select('*')
        .eq('confirmation_code', confirmationCode)
        .single();

      if (fetchError || !existingReservation) {
        return res.status(404).json({ error: 'Reservation not found' });
      }

      let updateFields = {};

      if (action === 'cancel') {
        updateFields.status = 'cancelled';
        
        // Free up table availability
        await updateTableAvailability(
          existingReservation.reservation_date,
          existingReservation.reservation_time,
          1
        );

        // Send cancellation notifications
        await sendNotification({
          type: 'email',
          template: 'reservation_cancelled',
          recipient: existingReservation.customer_email,
          language: existingReservation.preferred_language,
          data: {
            customer_name: existingReservation.customer_name,
            confirmation_code: confirmationCode,
            reservation_date: new Date(existingReservation.reservation_date).toLocaleDateString(),
            reservation_time: existingReservation.reservation_time
          },
          referenceId: existingReservation.id,
          referenceType: 'reservation'
        });

      } else if (action === 'modify') {
        // Handle reservation modifications
        const validationResult = validateReservationData(updateData);
        if (!validationResult.isValid) {
          return res.status(400).json({ 
            error: 'Invalid update data',
            details: validationResult.errors
          });
        }

        updateFields = {
          ...updateData,
          updated_at: new Date().toISOString()
        };
      }

      // Update reservation
      const { data: updatedReservation, error: updateError } = await supabase
        .from('reservations')
        .update(updateFields)
        .eq('confirmation_code', confirmationCode)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ error: 'Failed to update reservation' });
      }

      res.status(200).json({
        success: true,
        message: 'Reservation updated successfully',
        data: updatedReservation
      });

    } catch (error) {
      console.error('Update reservation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Helper functions
async function checkTableAvailability(date, time, partySize) {
  try {
    // Get or create availability record for the date/time
    const { data: availability, error } = await supabase
      .from('table_availability')
      .select('*')
      .eq('date', date)
      .eq('time_slot', time)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!availability) {
      // Create new availability record with default capacity
      const { data: newAvailability, error: insertError } = await supabase
        .from('table_availability')
        .insert({
          date: date,
          time_slot: time,
          available_tables: 20, // Default capacity
          total_tables: 20
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return { available: true, availableTables: 20 };
    }

    // Check if we have enough capacity
    const tablesNeeded = Math.ceil(partySize / 4); // Assume 4 people per table
    const available = availability.available_tables >= tablesNeeded;

    return { 
      available,
      availableTables: availability.available_tables,
      suggestion: available ? null : getAlternativeTimeSlots(date, partySize)
    };

  } catch (error) {
    console.error('Availability check error:', error);
    return { available: false, error: 'Unable to check availability' };
  }
}

async function updateTableAvailability(date, time, change) {
  try {
    const { error } = await supabase
      .from('table_availability')
      .update({
        available_tables: supabase.rpc('increment_available_tables', {
          p_date: date,
          p_time_slot: time,
          p_change: change
        })
      })
      .eq('date', date)
      .eq('time_slot', time);

    if (error) {
      console.error('Update availability error:', error);
    }
  } catch (error) {
    console.error('Update availability error:', error);
  }
}

async function getAlternativeTimeSlots(date, partySize) {
  try {
    const { data: alternatives, error } = await supabase
      .from('table_availability')
      .select('time_slot, available_tables')
      .eq('date', date)
      .gte('available_tables', Math.ceil(partySize / 4))
      .order('time_slot', { ascending: true });

    if (error) {
      return [];
    }

    return alternatives.map(alt => alt.time_slot);
  } catch (error) {
    return [];
  }
}

function addHours(timeString, hours) {
  const [hour, minute] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hour) + hours, parseInt(minute), 0, 0);
  return date.toTimeString().slice(0, 5);
}
