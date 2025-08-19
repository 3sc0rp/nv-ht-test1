import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT');
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
      const { date, time, partySize } = req.body;

      if (!date) {
        return res.status(400).json({ error: 'Date is required' });
      }

      // Get default time slots
      const defaultTimeSlots = [
        '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
        '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
      ];

      // Check if the date is in the past
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return res.status(400).json({ 
          error: 'Cannot check availability for past dates',
          availableTimes: []
        });
      }

      // Check if the date is too far in the future
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 60);
      if (selectedDate > maxDate) {
        return res.status(400).json({ 
          error: 'Cannot book more than 60 days in advance',
          availableTimes: []
        });
      }

      // Check day of week restrictions (if any)
      const dayOfWeek = selectedDate.getDay();
      // Add any restaurant closure days here
      // For now, assume open all days

      // Get existing availability records for the date
      const { data: existingAvailability, error: fetchError } = await supabase
        .from('table_availability')
        .select('*')
        .eq('date', date)
        .order('time_slot', { ascending: true });

      if (fetchError) {
        console.error('Error fetching availability:', fetchError);
        return res.status(500).json({ error: 'Failed to check availability' });
      }

      // Calculate availability for each time slot
      const availabilityMap = {};
      
      // Initialize with default capacity
      defaultTimeSlots.forEach(timeSlot => {
        availabilityMap[timeSlot] = {
          time: timeSlot,
          available: true,
          availableTables: 20, // Default restaurant capacity
          totalTables: 20,
          reservationCount: 0
        };
      });

      // Update with existing data
      existingAvailability.forEach(record => {
        if (availabilityMap[record.time_slot]) {
          availabilityMap[record.time_slot].availableTables = record.available_tables;
          availabilityMap[record.time_slot].totalTables = record.total_tables;
          availabilityMap[record.time_slot].reservationCount = record.total_tables - record.available_tables;
          
          // Determine availability status
          const tablesNeeded = partySize ? Math.ceil(partySize / 4) : 1;
          availabilityMap[record.time_slot].available = record.available_tables >= tablesNeeded;
        }
      });

      // Get confirmed reservations for the date to get accurate counts
      const { data: reservations, error: reservationError } = await supabase
        .from('reservations')
        .select('reservation_time, party_size')
        .eq('reservation_date', date)
        .in('status', ['confirmed', 'pending']);

      if (reservationError) {
        console.error('Error fetching reservations:', reservationError);
      } else {
        // Update availability based on actual reservations
        reservations.forEach(reservation => {
          const timeSlot = reservation.reservation_time;
          if (availabilityMap[timeSlot]) {
            const tablesUsed = Math.ceil(reservation.party_size / 4);
            availabilityMap[timeSlot].reservationCount += 1;
            availabilityMap[timeSlot].availableTables = Math.max(0, 
              availabilityMap[timeSlot].availableTables - tablesUsed);
            
            // Update availability status
            const tablesNeeded = partySize ? Math.ceil(partySize / 4) : 1;
            availabilityMap[timeSlot].available = availabilityMap[timeSlot].availableTables >= tablesNeeded;
          }
        });
      }

      // Filter for current time if checking today
      const now = new Date();
      const isToday = selectedDate.toDateString() === now.toDateString();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const availableTimes = Object.values(availabilityMap).filter(slot => {
        if (isToday) {
          const [slotHour, slotMinute] = slot.time.split(':').map(Number);
          const slotTimeInMinutes = slotHour * 60 + slotMinute;
          const currentTimeInMinutes = currentHour * 60 + currentMinute;
          
          // Allow booking if slot is at least 2 hours from now
          return slotTimeInMinutes > currentTimeInMinutes + 120;
        }
        return true;
      });

      // Add time labels for display
      const timesWithLabels = availableTimes.map(slot => ({
        ...slot,
        label: formatTimeLabel(slot.time),
        status: getAvailabilityStatus(slot)
      }));

      // Sort by time
      timesWithLabels.sort((a, b) => a.time.localeCompare(b.time));

      res.status(200).json({
        date: date,
        availableTimes: timesWithLabels,
        summary: {
          totalSlots: timesWithLabels.length,
          availableSlots: timesWithLabels.filter(slot => slot.available).length,
          fullyBookedSlots: timesWithLabels.filter(slot => !slot.available).length
        }
      });

    } catch (error) {
      console.error('Availability check error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  else if (req.method === 'GET') {
    try {
      const { startDate, endDate, month, year } = req.query;

      let query = supabase.from('table_availability').select('*');

      if (startDate && endDate) {
        query = query.gte('date', startDate).lte('date', endDate);
      } else if (month && year) {
        const monthStart = `${year}-${month.padStart(2, '0')}-01`;
        const monthEnd = `${year}-${month.padStart(2, '0')}-31`;
        query = query.gte('date', monthStart).lte('date', monthEnd);
      } else {
        // Default to next 30 days
        const today = new Date().toISOString().split('T')[0];
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        const future = futureDate.toISOString().split('T')[0];
        
        query = query.gte('date', today).lte('date', future);
      }

      const { data: availability, error } = await query.order('date', { ascending: true });

      if (error) {
        return res.status(500).json({ error: 'Failed to fetch availability data' });
      }

      // Group by date
      const availabilityByDate = {};
      availability.forEach(record => {
        if (!availabilityByDate[record.date]) {
          availabilityByDate[record.date] = [];
        }
        availabilityByDate[record.date].push({
          time: record.time_slot,
          label: formatTimeLabel(record.time_slot),
          available: record.available_tables > 0,
          availableTables: record.available_tables,
          totalTables: record.total_tables,
          status: record.available_tables > 5 ? 'available' : 
                  record.available_tables > 0 ? 'limited' : 'full'
        });
      });

      res.status(200).json({
        availability: availabilityByDate,
        period: {
          startDate: startDate || `${new Date().toISOString().split('T')[0]}`,
          endDate: endDate || `${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`
        }
      });

    } catch (error) {
      console.error('Get availability error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  else if (req.method === 'PUT') {
    try {
      // Admin endpoint to update availability
      const { date, timeSlot, availableTables, totalTables } = req.body;

      if (!date || !timeSlot) {
        return res.status(400).json({ error: 'Date and time slot are required' });
      }

      // Upsert availability record
      const { data, error } = await supabase
        .from('table_availability')
        .upsert({
          date: date,
          time_slot: timeSlot,
          available_tables: availableTables || 20,
          total_tables: totalTables || 20
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: 'Failed to update availability' });
      }

      res.status(200).json({
        success: true,
        message: 'Availability updated successfully',
        data: data
      });

    } catch (error) {
      console.error('Update availability error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Helper functions
function formatTimeLabel(time) {
  const [hour, minute] = time.split(':');
  const hourNum = parseInt(hour);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
  return `${displayHour}:${minute} ${ampm}`;
}

function getAvailabilityStatus(slot) {
  if (!slot.available) return 'full';
  if (slot.availableTables <= 2) return 'limited';
  return 'available';
}
