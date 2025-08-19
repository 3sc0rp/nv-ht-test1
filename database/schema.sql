-- Supabase Database Schema for Nature Village Restaurant
-- Run these SQL commands in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types for enums
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'no_show');
CREATE TYPE catering_status AS ENUM ('inquiry', 'quote_sent', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE event_type AS ENUM ('corporate', 'wedding', 'private_party', 'cultural_event', 'birthday', 'anniversary', 'business_meeting', 'other');
CREATE TYPE venue_option AS ENUM ('our_location', 'customer_location', 'delivery_only');
CREATE TYPE party_size_category AS ENUM ('small', 'medium', 'large', 'extra_large');

-- Reservations table
CREATE TABLE reservations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Customer Information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    
    -- Reservation Details
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    party_size INTEGER NOT NULL CHECK (party_size >= 1 AND party_size <= 20),
    
    -- Additional Information
    special_occasion VARCHAR(100),
    special_requests TEXT,
    dietary_restrictions TEXT,
    
    -- Status and Management
    status reservation_status DEFAULT 'pending',
    confirmation_code VARCHAR(20) UNIQUE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Admin notes
    admin_notes TEXT,
    table_number INTEGER,
    
    -- Customer preferences
    preferred_language VARCHAR(5) DEFAULT 'en',
    marketing_consent BOOLEAN DEFAULT false,
    
    -- Follow-up tracking
    reminder_sent BOOLEAN DEFAULT false,
    feedback_requested BOOLEAN DEFAULT false,
    
    CONSTRAINT valid_party_size CHECK (party_size BETWEEN 1 AND 20),
    CONSTRAINT future_reservation CHECK (reservation_date >= CURRENT_DATE)
);

-- Catering inquiries table
CREATE TABLE catering_inquiries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Customer Information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    organization VARCHAR(255),
    
    -- Event Details
    event_type event_type NOT NULL,
    event_date DATE NOT NULL,
    event_end_date DATE, -- For multi-day events
    event_time TIME,
    guest_count INTEGER NOT NULL CHECK (guest_count >= 10),
    
    -- Venue Information
    venue_option venue_option NOT NULL,
    venue_address TEXT,
    venue_details TEXT,
    
    -- Menu and Budget
    menu_preferences TEXT,
    dietary_restrictions TEXT,
    budget_range VARCHAR(50),
    
    -- Requirements
    detailed_requirements TEXT,
    special_equipment_needed TEXT,
    service_style VARCHAR(100), -- buffet, plated, family-style, etc.
    
    -- Files and Documents
    venue_photos JSONB, -- Array of file URLs
    event_layout JSONB, -- Array of file URLs
    
    -- Status and Management
    status catering_status DEFAULT 'inquiry',
    quote_amount DECIMAL(10,2),
    quote_details TEXT,
    confirmation_code VARCHAR(20) UNIQUE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Admin management
    assigned_to VARCHAR(255), -- Staff member assigned
    admin_notes TEXT,
    follow_up_date DATE,
    
    -- Customer preferences
    preferred_language VARCHAR(5) DEFAULT 'en',
    marketing_consent BOOLEAN DEFAULT false,
    
    CONSTRAINT valid_guest_count CHECK (guest_count >= 10),
    CONSTRAINT future_event CHECK (event_date >= CURRENT_DATE),
    CONSTRAINT valid_date_range CHECK (event_end_date IS NULL OR event_end_date >= event_date)
);

-- Menu packages for catering
CREATE TABLE catering_packages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_person DECIMAL(8,2) NOT NULL,
    minimum_guests INTEGER DEFAULT 10,
    maximum_guests INTEGER,
    package_details JSONB, -- Array of items included
    dietary_options JSONB, -- Array of dietary accommodations
    active BOOLEAN DEFAULT true,
    
    -- Multilingual support
    name_ku VARCHAR(255),
    name_ar VARCHAR(255),
    description_ku TEXT,
    description_ar TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table availability management
CREATE TABLE table_availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL,
    time_slot TIME NOT NULL,
    available_tables INTEGER NOT NULL DEFAULT 0,
    total_tables INTEGER NOT NULL DEFAULT 20,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(date, time_slot)
);

-- Email templates
CREATE TABLE email_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    template_key VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT NOT NULL,
    
    -- Multilingual versions
    subject_ku VARCHAR(255),
    subject_ar VARCHAR(255),
    html_content_ku TEXT,
    html_content_ar TEXT,
    text_content_ku TEXT,
    text_content_ar TEXT,
    
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification logs
CREATE TABLE notification_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reference_id UUID NOT NULL, -- ID of reservation or catering inquiry
    reference_type VARCHAR(20) NOT NULL, -- 'reservation' or 'catering'
    notification_type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'whatsapp', 'slack'
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    content TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin', -- 'admin', 'manager', 'staff'
    active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table for restaurant configuration
CREATE TABLE restaurant_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    data_type VARCHAR(20) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer feedback table
CREATE TABLE customer_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reference_id UUID, -- Links to reservation or catering inquiry
    reference_type VARCHAR(20), -- 'reservation' or 'catering'
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    
    -- Ratings (1-5 scale)
    food_rating INTEGER CHECK (food_rating BETWEEN 1 AND 5),
    service_rating INTEGER CHECK (service_rating BETWEEN 1 AND 5),
    ambiance_rating INTEGER CHECK (ambiance_rating BETWEEN 1 AND 5),
    overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
    
    -- Comments
    feedback_text TEXT,
    suggestions TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    
    -- Review management
    approved BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    response TEXT, -- Admin response to feedback
    responded_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_email ON reservations(customer_email);
CREATE INDEX idx_reservations_phone ON reservations(customer_phone);
CREATE INDEX idx_reservations_confirmation ON reservations(confirmation_code);

CREATE INDEX idx_catering_date ON catering_inquiries(event_date);
CREATE INDEX idx_catering_status ON catering_inquiries(status);
CREATE INDEX idx_catering_email ON catering_inquiries(customer_email);
CREATE INDEX idx_catering_confirmation ON catering_inquiries(confirmation_code);

CREATE INDEX idx_availability_date ON table_availability(date);
CREATE INDEX idx_notifications_reference ON notification_logs(reference_id, reference_type);
CREATE INDEX idx_feedback_reference ON customer_feedback(reference_id, reference_type);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_catering_updated_at BEFORE UPDATE ON catering_inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON catering_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON restaurant_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO restaurant_settings (setting_key, setting_value, data_type, description) VALUES
('max_party_size', '20', 'number', 'Maximum party size for reservations'),
('min_catering_guests', '10', 'number', 'Minimum number of guests for catering'),
('advance_booking_days', '60', 'number', 'Maximum days in advance for bookings'),
('booking_cutoff_hours', '2', 'number', 'Hours before service time to stop taking bookings'),
('default_service_times', '["11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"]', 'json', 'Available reservation time slots'),
('restaurant_capacity', '100', 'number', 'Total restaurant capacity'),
('catering_lead_time_days', '7', 'number', 'Minimum lead time for catering events'),
('auto_confirm_reservations', 'false', 'boolean', 'Automatically confirm reservations'),
('require_deposit_catering', 'true', 'boolean', 'Require deposit for catering bookings'),
('deposit_percentage', '25', 'number', 'Percentage of total for catering deposit');

-- Insert default catering packages
INSERT INTO catering_packages (name, name_ku, name_ar, description, description_ku, description_ar, price_per_person, minimum_guests, package_details) VALUES
('Traditional Kurdish Feast', 'خۆراکی نەریتی کوردی', 'وليمة كردية تقليدية', 'A complete traditional Kurdish dining experience featuring our most popular dishes', 'ئەزموونێکی تەواوی خۆراکی نەریتی کوردی لەگەڵ خۆراکە بەناوبانگەکانمان', 'تجربة طعام كردية تقليدية كاملة تضم أشهر أطباقنا', 35.00, 10, '["Kebab-e Kubideh", "Dolma", "Yaprakh", "Ash-e Reshteh", "Kurdish Rice", "Fresh Bread", "Dessert", "Tea Service"]'),
('Vegetarian Delight', 'خۆراکی ڕووەکی', 'متعة نباتية', 'A carefully curated selection of our finest vegetarian and vegan Kurdish dishes', 'هەڵبژاردەیەکی وردبینانە لە باشترین خۆراکە ڕووەکی و ڤێگانەکانی کوردی', 'مجموعة مختارة بعناية من أجود الأطباق الكردية النباتية والنباتية الصرفة', 28.00, 10, '["Dolma", "Khorak-e Bademjan", "Kurdish Salads", "Stuffed Peppers", "Lentil Soup", "Hummus Selection", "Fresh Bread", "Baklava"]'),
('Premium Wedding Package', 'پاکێجی زەماوەندی نایاب', 'باقة الزفاف المميزة', 'An elegant dining experience perfect for weddings and special celebrations', 'ئەزموونێکی ناز و نەریتی خۆراک کە تەواو بۆ زەماوەند و ئاهەنگە تایبەتەکان', 'تجربة طعام أنيقة مثالية لحفلات الزفاف والاحتفالات الخاصة', 45.00, 25, '["Welcome Appetizers", "Mixed Grill Platter", "Traditional Stews", "Saffron Rice", "Wedding Cake", "Traditional Sweets", "Coffee & Tea Service", "Floral Garnish"]'),
('Corporate Lunch', 'نانی نیوەڕۆی کۆمپانیا', 'غداء الشركات', 'Professional catering service ideal for business meetings and corporate events', 'خزمەتگوزاری پیشەیی خۆراک کە گونجاوە بۆ کۆبوونەوەی بازرگانی و ئاهەنگەکانی کۆمپانیا', 'خدمة تقديم طعام احترافية مثالية للاجتماعات التجارية وفعاليات الشركات', 25.00, 15, '["Mixed Appetizers", "Business Lunch Entrees", "Fresh Salads", "Bread Basket", "Fresh Fruit", "Coffee Service", "Disposable Elegant Packaging"]');

-- Insert default email templates
INSERT INTO email_templates (template_key, subject, subject_ku, subject_ar, html_content, text_content) VALUES
('reservation_confirmation', 'Reservation Confirmation - Nature Village', 'پەسەندکردنی جێگە حیجازکردن - گوندی سروشت', 'تأكيد الحجز - قرية الطبيعة', 
'<h1>Reservation Confirmed!</h1><p>Dear {{customer_name}},</p><p>Your reservation has been confirmed for {{party_size}} guests on {{reservation_date}} at {{reservation_time}}.</p><p>Confirmation Code: <strong>{{confirmation_code}}</strong></p><p>We look forward to serving you!</p>',
'Reservation Confirmed! Dear {{customer_name}}, Your reservation has been confirmed for {{party_size}} guests on {{reservation_date}} at {{reservation_time}}. Confirmation Code: {{confirmation_code}} We look forward to serving you!'),

('catering_inquiry_received', 'Catering Inquiry Received - Nature Village', 'داواکاری قوناغی پێگەیشتن - گوندی سروشت', 'تم استلام استفسار التقديم - قرية الطبيعة',
'<h1>Catering Inquiry Received</h1><p>Dear {{customer_name}},</p><p>Thank you for your catering inquiry for {{guest_count}} guests on {{event_date}}.</p><p>Our team will review your request and respond within 24 hours with a detailed quote.</p><p>Inquiry Code: <strong>{{confirmation_code}}</strong></p>',
'Catering Inquiry Received. Dear {{customer_name}}, Thank you for your catering inquiry for {{guest_count}} guests on {{event_date}}. Our team will review your request and respond within 24 hours with a detailed quote. Inquiry Code: {{confirmation_code}}'),

('admin_new_reservation', 'New Reservation Alert - {{customer_name}}', 'ئاگاداریی جێگە حیجازکردنی نوێ - {{customer_name}}', 'تنبيه حجز جديد - {{customer_name}}',
'<h2>New Reservation Alert</h2><p><strong>Customer:</strong> {{customer_name}}</p><p><strong>Email:</strong> {{customer_email}}</p><p><strong>Phone:</strong> {{customer_phone}}</p><p><strong>Date:</strong> {{reservation_date}}</p><p><strong>Time:</strong> {{reservation_time}}</p><p><strong>Party Size:</strong> {{party_size}}</p><p><strong>Special Requests:</strong> {{special_requests}}</p>',
'New Reservation Alert. Customer: {{customer_name}}, Email: {{customer_email}}, Phone: {{customer_phone}}, Date: {{reservation_date}}, Time: {{reservation_time}}, Party Size: {{party_size}}, Special Requests: {{special_requests}}'),

('admin_new_catering', 'New Catering Inquiry - {{customer_name}}', 'داواکاری قوناغی نوێ - {{customer_name}}', 'استفسار تقديم جديد - {{customer_name}}',
'<h2>New Catering Inquiry</h2><p><strong>Customer:</strong> {{customer_name}}</p><p><strong>Email:</strong> {{customer_email}}</p><p><strong>Phone:</strong> {{customer_phone}}</p><p><strong>Event Type:</strong> {{event_type}}</p><p><strong>Date:</strong> {{event_date}}</p><p><strong>Guests:</strong> {{guest_count}}</p><p><strong>Venue:</strong> {{venue_option}}</p><p><strong>Budget:</strong> {{budget_range}}</p>',
'New Catering Inquiry. Customer: {{customer_name}}, Email: {{customer_email}}, Phone: {{customer_phone}}, Event Type: {{event_type}}, Date: {{event_date}}, Guests: {{guest_count}}, Venue: {{venue_option}}, Budget: {{budget_range}}');

-- Create RLS (Row Level Security) policies
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE catering_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_feedback ENABLE ROW LEVEL SECURITY;

-- Allow public read access to packages (for pricing display)
ALTER TABLE catering_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to active packages" ON catering_packages FOR SELECT USING (active = true);

-- Allow public read access to email templates (for preview)
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to active templates" ON email_templates FOR SELECT USING (active = true);

-- Note: Add specific RLS policies based on your authentication requirements
-- These would typically allow users to see only their own reservations/inquiries
-- and admins to see everything.
