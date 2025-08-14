import { createClient } from '@supabase/supabase-js';
import { sendNotification } from '../../lib/notifications';
import { generateConfirmationCode } from '../../lib/utils';
import { validateCateringData } from '../../lib/validation';
import { checkRateLimit } from '../../lib/rateLimit';
import { uploadFiles } from '../../lib/fileUpload';
import multer from 'multer';
import { promisify } from 'util';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'), false);
    }
  }
});

const uploadMiddleware = promisify(upload.any());

export const config = {
  api: {
    bodyParser: false,
  },
};

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
      const rateLimitResult = await checkRateLimit(clientIP, 'catering');
      
      if (!rateLimitResult.allowed) {
        return res.status(429).json({ 
          error: 'Too many catering requests. Please try again later.',
          resetTime: rateLimitResult.resetTime
        });
      }

      // Handle file uploads
      await uploadMiddleware(req, res);

      const formData = req.body;
      const files = req.files || [];

      // Parse JSON fields
      const selectedPackages = formData.selectedPackages ? JSON.parse(formData.selectedPackages) : [];
      
      // Validate input data
      const validationResult = validateCateringData(formData);
      if (!validationResult.isValid) {
        return res.status(400).json({ 
          error: 'Invalid catering data',
          details: validationResult.errors
        });
      }

      const {
        name,
        email,
        phone,
        organization,
        eventType,
        eventDate,
        eventEndDate,
        eventTime,
        guestCount,
        venueOption,
        venueAddress,
        venueDetails,
        menuPreferences,
        dietaryRestrictions,
        serviceStyle,
        specialEquipment,
        detailedRequirements,
        budgetRange,
        estimatedCost,
        language = 'en'
      } = formData;

      // Check catering availability and minimum requirements
      const availabilityCheck = await checkCateringAvailability(eventDate, guestCount);
      if (!availabilityCheck.available) {
        return res.status(400).json({ 
          error: availabilityCheck.message,
          suggestion: availabilityCheck.suggestion
        });
      }

      // Upload files if any
      let uploadedFileUrls = [];
      if (files.length > 0) {
        try {
          uploadedFileUrls = await uploadFiles(files, 'catering');
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
          // Continue without files rather than failing the entire request
        }
      }

      // Generate confirmation code
      const confirmationCode = generateConfirmationCode();

      // Insert catering inquiry into database
      const { data: cateringInquiry, error: insertError } = await supabase
        .from('catering_inquiries')
        .insert({
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          organization: organization || null,
          event_type: eventType,
          event_date: eventDate,
          event_end_date: eventEndDate || null,
          event_time: eventTime || null,
          guest_count: parseInt(guestCount),
          venue_option: venueOption,
          venue_address: venueAddress || null,
          venue_details: venueDetails || null,
          menu_preferences: menuPreferences || null,
          dietary_restrictions: dietaryRestrictions || null,
          service_style: serviceStyle || null,
          special_equipment_needed: specialEquipment || null,
          detailed_requirements: detailedRequirements || null,
          budget_range: budgetRange || null,
          venue_photos: uploadedFileUrls.length > 0 ? uploadedFileUrls : null,
          confirmation_code: confirmationCode,
          preferred_language: language,
          status: 'inquiry',
          quote_amount: estimatedCost ? parseFloat(estimatedCost) : null
        })
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error:', insertError);
        return res.status(500).json({ error: 'Failed to create catering inquiry' });
      }

      // Send notifications
      try {
        // Send customer confirmation email
        await sendNotification({
          type: 'email',
          template: 'catering_inquiry_received',
          recipient: email,
          language: language,
          data: {
            customer_name: name,
            event_type: getEventTypeLabel(eventType, language),
            event_date: new Date(eventDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            guest_count: guestCount,
            venue_option: getVenueOptionLabel(venueOption, language),
            confirmation_code: confirmationCode,
            estimated_cost: estimatedCost ? `$${parseInt(estimatedCost).toLocaleString()}` : 'TBD'
          },
          referenceId: cateringInquiry.id,
          referenceType: 'catering'
        });

        // Send admin notification
        await sendNotification({
          type: 'email',
          template: 'admin_new_catering',
          recipient: process.env.ADMIN_EMAIL,
          language: 'en',
          data: {
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            organization: organization || 'Not specified',
            event_type: getEventTypeLabel(eventType, 'en'),
            event_date: new Date(eventDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            guest_count: guestCount,
            venue_option: getVenueOptionLabel(venueOption, 'en'),
            venue_address: venueAddress || 'Not specified',
            budget_range: budgetRange || 'Not specified',
            estimated_cost: estimatedCost ? `$${parseInt(estimatedCost).toLocaleString()}` : 'TBD',
            confirmation_code: confirmationCode,
            selected_packages: selectedPackages.map(pkg => pkg.name).join(', ') || 'Custom menu',
            menu_preferences: menuPreferences || 'None specified',
            dietary_restrictions: dietaryRestrictions || 'None specified',
            special_equipment: specialEquipment || 'None specified',
            detailed_requirements: detailedRequirements || 'None specified',
            files_uploaded: uploadedFileUrls.length
          },
          referenceId: cateringInquiry.id,
          referenceType: 'catering'
        });

        // Send SMS notification if configured
        if (process.env.TWILIO_ACCOUNT_SID) {
          await sendNotification({
            type: 'sms',
            recipient: process.env.RESTAURANT_PHONE,
            message: `New catering inquiry: ${name} for ${guestCount} guests on ${new Date(eventDate).toLocaleDateString()}. Event: ${getEventTypeLabel(eventType, 'en')}. Code: ${confirmationCode}`,
            referenceId: cateringInquiry.id,
            referenceType: 'catering'
          });
        }

        // Send Slack notification if configured
        if (process.env.SLACK_WEBHOOK_URL) {
          await sendNotification({
            type: 'slack',
            data: {
              text: `🍽️ New Catering Inquiry`,
              blocks: [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `*New Catering Inquiry Received*\n\n*Customer:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Event Type:* ${getEventTypeLabel(eventType, 'en')}\n*Date:* ${new Date(eventDate).toLocaleDateString()}\n*Guests:* ${guestCount}\n*Venue:* ${getVenueOptionLabel(venueOption, 'en')}\n*Estimated Cost:* ${estimatedCost ? `$${parseInt(estimatedCost).toLocaleString()}` : 'TBD'}\n*Confirmation Code:* ${confirmationCode}`
                  }
                },
                {
                  type: 'actions',
                  elements: [
                    {
                      type: 'button',
                      text: {
                        type: 'plain_text',
                        text: 'View Details'
                      },
                      url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/catering/${cateringInquiry.id}`
                    }
                  ]
                }
              ]
            },
            referenceId: cateringInquiry.id,
            referenceType: 'catering'
          });
        }

        // Add to Google Calendar if configured
        if (process.env.GOOGLE_CALENDAR_ID && eventDate && eventTime) {
          const eventStartDateTime = `${eventDate}T${eventTime}:00`;
          const eventEndDateTime = eventEndDate 
            ? `${eventEndDate}T${eventTime}:00`
            : `${eventDate}T${addHours(eventTime, 4)}:00`;

          await sendNotification({
            type: 'calendar',
            data: {
              summary: `Catering - ${name} (${getEventTypeLabel(eventType, 'en')})`,
              description: `Catering event for ${guestCount} guests\n\nCustomer: ${name}\nPhone: ${phone}\nEmail: ${email}\nOrganization: ${organization || 'N/A'}\nVenue: ${getVenueOptionLabel(venueOption, 'en')}\nAddress: ${venueAddress || 'N/A'}\n\nMenu Preferences: ${menuPreferences || 'None'}\nDietary Restrictions: ${dietaryRestrictions || 'None'}\nSpecial Equipment: ${specialEquipment || 'None'}\nBudget Range: ${budgetRange || 'Not specified'}\nEstimated Cost: ${estimatedCost ? `$${parseInt(estimatedCost).toLocaleString()}` : 'TBD'}\n\nConfirmation Code: ${confirmationCode}`,
              start: {
                dateTime: eventStartDateTime,
                timeZone: 'America/New_York'
              },
              end: {
                dateTime: eventEndDateTime,
                timeZone: 'America/New_York'
              },
              attendees: [
                { email: email, displayName: name }
              ],
              location: venueAddress || 'Nature Village Restaurant'
            },
            referenceId: cateringInquiry.id,
            referenceType: 'catering'
          });
        }

      } catch (notificationError) {
        console.error('Notification error:', notificationError);
        // Don't fail the catering request if notifications fail
      }

      res.status(201).json({
        success: true,
        message: 'Catering inquiry submitted successfully',
        inquiryId: cateringInquiry.id,
        confirmationCode: confirmationCode,
        data: cateringInquiry
      });

    } catch (error) {
      console.error('Catering API error:', error);
      
      if (error.message.includes('Only images and PDF files')) {
        return res.status(400).json({ error: 'Only image and PDF files are allowed' });
      }
      
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'An error occurred while processing your catering inquiry'
      });
    }
  }

  else if (req.method === 'GET') {
    try {
      const { confirmationCode, email, status } = req.query;

      let query = supabase.from('catering_inquiries').select('*');

      if (confirmationCode) {
        query = query.eq('confirmation_code', confirmationCode).single();
      } else if (email) {
        query = query.eq('customer_email', email);
        if (status) {
          query = query.eq('status', status);
        }
        query = query.order('event_date', { ascending: true });
      } else {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      const { data, error } = await query;

      if (error) {
        if (confirmationCode) {
          return res.status(404).json({ error: 'Catering inquiry not found' });
        }
        return res.status(500).json({ error: 'Failed to fetch catering inquiries' });
      }

      if (confirmationCode) {
        res.status(200).json({ inquiry: data });
      } else {
        res.status(200).json({ inquiries: data });
      }

    } catch (error) {
      console.error('Get catering error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  else if (req.method === 'PUT') {
    try {
      const { confirmationCode, action, ...updateData } = req.body;

      if (!confirmationCode) {
        return res.status(400).json({ error: 'Confirmation code required' });
      }

      // Get existing inquiry
      const { data: existingInquiry, error: fetchError } = await supabase
        .from('catering_inquiries')
        .select('*')
        .eq('confirmation_code', confirmationCode)
        .single();

      if (fetchError || !existingInquiry) {
        return res.status(404).json({ error: 'Catering inquiry not found' });
      }

      let updateFields = {};

      if (action === 'cancel') {
        updateFields.status = 'cancelled';
        
        // Send cancellation notifications
        await sendNotification({
          type: 'email',
          template: 'catering_cancelled',
          recipient: existingInquiry.customer_email,
          language: existingInquiry.preferred_language,
          data: {
            customer_name: existingInquiry.customer_name,
            confirmation_code: confirmationCode,
            event_date: new Date(existingInquiry.event_date).toLocaleDateString(),
            event_type: getEventTypeLabel(existingInquiry.event_type, existingInquiry.preferred_language)
          },
          referenceId: existingInquiry.id,
          referenceType: 'catering'
        });

      } else if (action === 'modify') {
        // Handle inquiry modifications
        const validationResult = validateCateringData(updateData);
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

      } else if (action === 'update_status') {
        updateFields.status = updateData.status;
        if (updateData.quote_amount) {
          updateFields.quote_amount = updateData.quote_amount;
        }
        if (updateData.quote_details) {
          updateFields.quote_details = updateData.quote_details;
        }
        if (updateData.admin_notes) {
          updateFields.admin_notes = updateData.admin_notes;
        }
      }

      // Update inquiry
      const { data: updatedInquiry, error: updateError } = await supabase
        .from('catering_inquiries')
        .update(updateFields)
        .eq('confirmation_code', confirmationCode)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ error: 'Failed to update catering inquiry' });
      }

      res.status(200).json({
        success: true,
        message: 'Catering inquiry updated successfully',
        data: updatedInquiry
      });

    } catch (error) {
      console.error('Update catering error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Helper functions
async function checkCateringAvailability(eventDate, guestCount) {
  try {
    const minGuestCount = parseInt(process.env.MIN_CATERING_GUESTS || '10');
    const leadTimeDays = parseInt(process.env.CATERING_LEAD_TIME_DAYS || '7');
    
    if (parseInt(guestCount) < minGuestCount) {
      return {
        available: false,
        message: `Minimum ${minGuestCount} guests required for catering services`,
        suggestion: 'Please consider our restaurant dining for smaller groups'
      };
    }

    const eventDateObj = new Date(eventDate);
    const minBookingDate = new Date();
    minBookingDate.setDate(minBookingDate.getDate() + leadTimeDays);

    if (eventDateObj < minBookingDate) {
      return {
        available: false,
        message: `Catering requires at least ${leadTimeDays} days advance notice`,
        suggestion: `Please select a date after ${minBookingDate.toLocaleDateString()}`
      };
    }

    // Check for existing catering bookings on the same date
    const { data: existingBookings, error } = await supabase
      .from('catering_inquiries')
      .select('guest_count')
      .eq('event_date', eventDate)
      .in('status', ['confirmed', 'in_progress']);

    if (error) {
      throw error;
    }

    const totalGuestsBooked = existingBookings.reduce((sum, booking) => sum + booking.guest_count, 0);
    const maxDailyCapacity = parseInt(process.env.MAX_DAILY_CATERING_CAPACITY || '500');

    if (totalGuestsBooked + parseInt(guestCount) > maxDailyCapacity) {
      return {
        available: false,
        message: 'Catering capacity limit reached for this date',
        suggestion: 'Please select an alternative date or reduce guest count'
      };
    }

    return { available: true };

  } catch (error) {
    console.error('Catering availability check error:', error);
    return { 
      available: false, 
      message: 'Unable to check availability',
      error: 'System error checking availability' 
    };
  }
}

function getEventTypeLabel(eventType, language) {
  const labels = {
    en: {
      corporate: 'Corporate Event',
      wedding: 'Wedding',
      private_party: 'Private Party',
      cultural_event: 'Cultural Event',
      birthday: 'Birthday Party',
      anniversary: 'Anniversary',
      business_meeting: 'Business Meeting',
      other: 'Other'
    },
    ku: {
      corporate: 'ئاهەنگی کۆمپانیا',
      wedding: 'زەماوەند',
      private_party: 'ئاهەنگی تایبەت',
      cultural_event: 'ئاهەنگی کولتووری',
      birthday: 'ئاهەنگی ڕۆژی لەدایکبوون',
      anniversary: 'ساڵیاد',
      business_meeting: 'کۆبوونەوەی بازرگانی',
      other: 'هیتر'
    },
    ar: {
      corporate: 'فعالية الشركات',
      wedding: 'حفل زفاف',
      private_party: 'حفلة خاصة',
      cultural_event: 'فعالية ثقافية',
      birthday: 'عيد ميلاد',
      anniversary: 'ذكرى سنوية',
      business_meeting: 'اجتماع عمل',
      other: 'أخرى'
    }
  };

  return labels[language]?.[eventType] || eventType;
}

function getVenueOptionLabel(venueOption, language) {
  const labels = {
    en: {
      our_location: 'Our Restaurant Location',
      customer_location: 'Customer Location',
      delivery_only: 'Delivery Only'
    },
    ku: {
      our_location: 'شوێنی چێشتخانەکەمان',
      customer_location: 'شوێنی کڕیار',
      delivery_only: 'تەنها گەیاندن'
    },
    ar: {
      our_location: 'موقع مطعمنا',
      customer_location: 'موقع العميل',
      delivery_only: 'التوصيل فقط'
    }
  };

  return labels[language]?.[venueOption] || venueOption;
}

function addHours(timeString, hours) {
  if (!timeString) return '18:00'; // Default fallback
  
  const [hour, minute] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hour) + hours, parseInt(minute), 0, 0);
  return date.toTimeString().slice(0, 5);
}
