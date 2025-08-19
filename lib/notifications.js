import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import axios from 'axios';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Initialize services
let emailTransporter = null;
let twilioClient = null;

// Initialize email service
function initializeEmailService() {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return 'sendgrid';
  } else if (process.env.GMAIL_USER && process.env.GMAIL_PASSWORD) {
    emailTransporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    return 'nodemailer';
  }
  return null;
}

// Initialize Twilio
function initializeTwilio() {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    return true;
  }
  return false;
}

// Main notification function
export async function sendNotification(options) {
  const {
    type,
    template,
    recipient,
    subject,
    message,
    content,
    language = 'en',
    data = {},
    referenceId,
    referenceType
  } = options;

  try {
    let result = null;

    switch (type) {
      case 'email':
        result = await sendEmail({ template, recipient, language, data, subject, content });
        break;
      case 'sms':
        result = await sendSMS({ recipient, message });
        break;
      case 'whatsapp':
        result = await sendWhatsApp({ recipient, message, data });
        break;
      case 'slack':
        result = await sendSlack(options.data);
        break;
      case 'discord':
        result = await sendDiscord(options.data);
        break;
      case 'calendar':
        result = await createCalendarEvent(options.data);
        break;
      default:
        throw new Error(`Unsupported notification type: ${type}`);
    }

    // Log notification
    await logNotification({
      referenceId,
      referenceType,
      notificationType: type,
      recipient,
      subject: subject || template,
      content: content || message || JSON.stringify(data),
      status: result.success ? 'sent' : 'failed',
      errorMessage: result.error || null
    });

    return result;

  } catch (error) {
    console.error(`Notification error (${type}):`, error);
    
    // Log failed notification
    await logNotification({
      referenceId,
      referenceType,
      notificationType: type,
      recipient,
      subject: subject || template,
      content: content || message || JSON.stringify(data),
      status: 'failed',
      errorMessage: error.message
    });

    return { success: false, error: error.message };
  }
}

// Email notification
async function sendEmail({ template, recipient, language, data, subject, content }) {
  const emailService = initializeEmailService();
  
  if (!emailService) {
    throw new Error('No email service configured');
  }

  let emailContent = { subject, html: content, text: content };

  // Get template if specified
  if (template) {
    emailContent = await getEmailTemplate(template, language, data);
  }

  if (emailService === 'sendgrid') {
    const msg = {
      to: recipient,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@naturevillage.com',
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    };

    await sgMail.send(msg);
    return { success: true, provider: 'sendgrid' };

  } else if (emailService === 'nodemailer') {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: recipient,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    };

    await emailTransporter.sendMail(mailOptions);
    return { success: true, provider: 'nodemailer' };
  }

  throw new Error('Email service not initialized');
}

// SMS notification
async function sendSMS({ recipient, message }) {
  if (!initializeTwilio()) {
    throw new Error('Twilio not configured');
  }

  const result = await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: recipient
  });

  return { success: true, messageId: result.sid, provider: 'twilio' };
}

// WhatsApp notification
async function sendWhatsApp({ recipient, message, data }) {
  if (process.env.WHATSAPP_API_URL && process.env.WHATSAPP_API_TOKEN) {
    const response = await axios.post(
      process.env.WHATSAPP_API_URL,
      {
        to: recipient,
        message: message,
        data: data
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return { success: true, response: response.data, provider: 'whatsapp' };
  }

  // Fallback to Twilio WhatsApp if configured
  if (initializeTwilio() && process.env.TWILIO_WHATSAPP_NUMBER) {
    const result = await twilioClient.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${recipient}`
    });

    return { success: true, messageId: result.sid, provider: 'twilio-whatsapp' };
  }

  throw new Error('WhatsApp service not configured');
}

// Slack notification
async function sendSlack(data) {
  if (!process.env.SLACK_WEBHOOK_URL) {
    throw new Error('Slack webhook not configured');
  }

  const response = await axios.post(process.env.SLACK_WEBHOOK_URL, data, {
    headers: { 'Content-Type': 'application/json' }
  });

  return { success: true, response: response.data, provider: 'slack' };
}

// Discord notification
async function sendDiscord(data) {
  if (!process.env.DISCORD_WEBHOOK_URL) {
    throw new Error('Discord webhook not configured');
  }

  const response = await axios.post(process.env.DISCORD_WEBHOOK_URL, data, {
    headers: { 'Content-Type': 'application/json' }
  });

  return { success: true, response: response.data, provider: 'discord' };
}

// Calendar event creation
async function createCalendarEvent(eventData) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error('Google Calendar not configured');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'urn:ietf:wg:oauth:2.0:oob'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    resource: eventData
  });

  return { success: true, eventId: event.data.id, provider: 'google-calendar' };
}

// Get email template
async function getEmailTemplate(templateKey, language, data) {
  try {
    const { data: template, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_key', templateKey)
      .eq('active', true)
      .single();

    if (error || !template) {
      throw new Error(`Template not found: ${templateKey}`);
    }

    // Get language-specific content
    let subject = template.subject;
    let htmlContent = template.html_content;
    let textContent = template.text_content;

    if (language === 'ku' && template.subject_ku) {
      subject = template.subject_ku;
      htmlContent = template.html_content_ku || htmlContent;
      textContent = template.text_content_ku || textContent;
    } else if (language === 'ar' && template.subject_ar) {
      subject = template.subject_ar;
      htmlContent = template.html_content_ar || htmlContent;
      textContent = template.text_content_ar || textContent;
    }

    // Replace placeholders with data
    subject = replacePlaceholders(subject, data);
    htmlContent = replacePlaceholders(htmlContent, data);
    textContent = replacePlaceholders(textContent, data);

    return {
      subject,
      html: htmlContent,
      text: textContent
    };

  } catch (error) {
    console.error('Template fetch error:', error);
    
    // Return default template if database template fails
    return getDefaultTemplate(templateKey, language, data);
  }
}

// Default email templates (fallback)
function getDefaultTemplate(templateKey, language, data) {
  const templates = {
    reservation_confirmation: {
      en: {
        subject: 'Reservation Confirmation - Nature Village',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #d97706;">Reservation Confirmed!</h1>
            <p>Dear ${data.customer_name || 'Valued Customer'},</p>
            <p>Your reservation has been confirmed for ${data.party_size || 'your party'} on ${data.reservation_date || 'your selected date'} at ${data.reservation_time || 'your selected time'}.</p>
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #d97706;">Confirmation Code: ${data.confirmation_code || 'N/A'}</h3>
            </div>
            <p>We look forward to serving you at Nature Village!</p>
            <p>Best regards,<br>Nature Village Team</p>
          </div>
        `,
        text: `Reservation Confirmed! Dear ${data.customer_name || 'Valued Customer'}, Your reservation has been confirmed for ${data.party_size || 'your party'} on ${data.reservation_date || 'your selected date'} at ${data.reservation_time || 'your selected time'}. Confirmation Code: ${data.confirmation_code || 'N/A'}. We look forward to serving you!`
      }
    },
    catering_inquiry_received: {
      en: {
        subject: 'Catering Inquiry Received - Nature Village',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #d97706;">Catering Inquiry Received</h1>
            <p>Dear ${data.customer_name || 'Valued Customer'},</p>
            <p>Thank you for your catering inquiry for ${data.guest_count || 'your event'} guests on ${data.event_date || 'your selected date'}.</p>
            <p>Our team will review your request and respond within 24 hours with a detailed quote.</p>
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #d97706;">Inquiry Code: ${data.confirmation_code || 'N/A'}</h3>
            </div>
            <p>Thank you for choosing Nature Village for your special event!</p>
            <p>Best regards,<br>Nature Village Team</p>
          </div>
        `,
        text: `Catering Inquiry Received. Dear ${data.customer_name || 'Valued Customer'}, Thank you for your catering inquiry for ${data.guest_count || 'your event'} guests on ${data.event_date || 'your selected date'}. Our team will review your request and respond within 24 hours. Inquiry Code: ${data.confirmation_code || 'N/A'}`
      }
    }
  };

  const template = templates[templateKey]?.[language] || templates[templateKey]?.en;
  
  if (!template) {
    return {
      subject: 'Notification from Nature Village',
      html: '<p>Thank you for contacting Nature Village. We will be in touch soon.</p>',
      text: 'Thank you for contacting Nature Village. We will be in touch soon.'
    };
  }

  return template;
}

// Replace placeholders in templates
function replacePlaceholders(content, data) {
  if (!content || !data) return content;

  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match;
  });
}

// Log notification
async function logNotification(logData) {
  try {
    await supabase.from('notification_logs').insert({
      reference_id: logData.referenceId,
      reference_type: logData.referenceType,
      notification_type: logData.notificationType,
      recipient: logData.recipient,
      subject: logData.subject,
      content: logData.content,
      status: logData.status,
      error_message: logData.errorMessage,
      sent_at: logData.status === 'sent' ? new Date().toISOString() : null
    });
  } catch (error) {
    console.error('Failed to log notification:', error);
  }
}

// Batch notification sending
export async function sendBatchNotifications(notifications) {
  const results = [];
  
  for (const notification of notifications) {
    try {
      const result = await sendNotification(notification);
      results.push({ ...notification, result });
    } catch (error) {
      results.push({ ...notification, result: { success: false, error: error.message } });
    }
  }
  
  return results;
}

// Scheduled notifications (for reminders, follow-ups, etc.)
export async function scheduleNotification(notification, scheduleDate) {
  // This would typically use a job queue like Bull or Agenda
  // For now, we'll just log it to the database for manual processing
  try {
    await supabase.from('scheduled_notifications').insert({
      notification_data: JSON.stringify(notification),
      scheduled_for: scheduleDate,
      status: 'pending'
    });
    
    return { success: true, message: 'Notification scheduled successfully' };
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return { success: false, error: error.message };
  }
}
