import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Head from 'next/head';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Calendar, 
  Clock, 
  Users, 
  Mail, 
  Phone, 
  User, 
  MessageSquare, 
  UtensilsCrossed,
  ChevronLeft,
  Check,
  X,
  Loader2,
  MapPin,
  Star,
  ArrowRight,
  Heart,
  Gift,
  Briefcase,
  PartyPopper,
  Globe
} from 'lucide-react';

// Import CSS for react-datepicker and react-phone-input-2
import 'react-datepicker/dist/react-datepicker.css';
import 'react-phone-input-2/lib/style.css';

const ReservationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityData, setAvailabilityData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [language, setLanguage] = useState('en');
  const [reservationResult, setReservationResult] = useState(null);

  // Language options
  const languages = {
    en: { name: 'English', code: 'en', dir: 'ltr' },
    ku: { name: 'کوردی', code: 'ku', dir: 'rtl' },
    ar: { name: 'العربية', code: 'ar', dir: 'rtl' }
  };

  // Translations
  const translations = {
    en: {
      title: 'Make a Reservation',
      subtitle: 'Reserve your table at Nature Village',
      step1: 'Personal Information',
      step2: 'Reservation Details',
      step3: 'Special Requests',
      step4: 'Confirmation',
      
      // Form fields
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      date: 'Preferred Date',
      time: 'Preferred Time',
      partySize: 'Party Size',
      specialOccasion: 'Special Occasion',
      specialRequests: 'Special Requests',
      dietaryRestrictions: 'Dietary Restrictions',
      
      // Validation messages
      nameRequired: 'Full name is required',
      emailRequired: 'Email address is required',
      emailInvalid: 'Please enter a valid email address',
      phoneRequired: 'Phone number is required',
      dateRequired: 'Please select a date',
      timeRequired: 'Please select a time',
      partySizeRequired: 'Please select party size',
      
      // Buttons
      next: 'Next Step',
      previous: 'Previous',
      submit: 'Confirm Reservation',
      backToHome: 'Back to Home',
      
      // Status messages
      checking: 'Checking availability...',
      available: 'Available',
      fullyBooked: 'Fully Booked',
      limitedAvailability: 'Limited Availability',
      
      // Success/Error
      success: 'Reservation confirmed successfully!',
      error: 'Sorry, there was an error processing your reservation.',
      
      // Special occasions
      occasions: {
        birthday: 'Birthday',
        anniversary: 'Anniversary',
        business: 'Business Meeting',
        dateNight: 'Date Night',
        familyDinner: 'Family Dinner',
        celebration: 'Celebration',
        other: 'Other'
      },
      
      // Additional info
      confirmationCode: 'Confirmation Code',
      reservationDetails: 'Reservation Details',
      thankYou: 'Thank you for choosing Nature Village!',
      emailSent: 'A confirmation email has been sent to your email address.',
      
      // Placeholders
      namePlaceholder: 'Enter your full name',
      emailPlaceholder: 'Enter your email address',
      phonePlaceholder: 'Enter your phone number',
      requestsPlaceholder: 'Any special requests or preferences...',
      dietaryPlaceholder: 'Please mention any dietary restrictions...',
      
      // Party size options
      partySizeOptions: [
        { value: 1, label: '1 Person' },
        { value: 2, label: '2 People' },
        { value: 3, label: '3 People' },
        { value: 4, label: '4 People' },
        { value: 5, label: '5 People' },
        { value: 6, label: '6 People' },
        { value: 7, label: '7 People' },
        { value: 8, label: '8 People' },
        { value: 9, label: '9 People' },
        { value: 10, label: '10 People' },
        { value: 11, label: '11-15 People' },
        { value: 16, label: '16-20 People' }
      ]
    },
    ku: {
      title: 'جێگە حیجازکردن',
      subtitle: 'مێزەکەت لە گوندی سروشت حیجاز بکە',
      step1: 'زانیاری کەسی',
      step2: 'وردەکاری حیجازکردن',
      step3: 'داواکاری تایبەت',
      step4: 'پەسەندکردن',
      
      // Form fields
      name: 'ناوی تەواو',
      email: 'ناونیشانی ئیمەیڵ',
      phone: 'ژمارەی تەلەفۆن',
      date: 'ڕێکەوتی بەدڵخواز',
      time: 'کاتی بەدڵخواز',
      partySize: 'ژمارەی کەسەکان',
      specialOccasion: 'بۆنەی تایبەت',
      specialRequests: 'داواکاری تایبەت',
      dietaryRestrictions: 'سنوورداری خۆراک',
      
      // Validation messages
      nameRequired: 'ناوی تەواو پێویستە',
      emailRequired: 'ناونیشانی ئیمەیڵ پێویستە',
      emailInvalid: 'تکایە ناونیشانێکی دروستی ئیمەیڵ بنووسە',
      phoneRequired: 'ژمارەی تەلەفۆن پێویستە',
      dateRequired: 'تکایە ڕێکەوتێک هەڵبژێرە',
      timeRequired: 'تکایە کاتێک هەڵبژێرە',
      partySizeRequired: 'تکایە ژمارەی کەسەکان هەڵبژێرە',
      
      // Buttons
      next: 'هەنگاوی داهاتوو',
      previous: 'گەڕانەوە',
      submit: 'پەسەندکردنی حیجازکردن',
      backToHome: 'گەڕانەوە بۆ ماڵەوە',
      
      // Status messages
      checking: 'پشکنینی بەردەستبوون...',
      available: 'بەردەستە',
      fullyBooked: 'تەواو پڕە',
      limitedAvailability: 'بەردەستبوونی سنووردار',
      
      // Success/Error
      success: 'حیجازکردن بە سەرکەوتوویی پەسەند کرا!',
      error: 'ببوورە، هەڵەیەک هەبوو لە پرۆسێسکردنی حیجازکردنەکەت.',
      
      // Special occasions
      occasions: {
        birthday: 'ڕۆژی لەدایکبوون',
        anniversary: 'ساڵیاد',
        business: 'کۆبوونەوەی بازرگانی',
        dateNight: 'شەوی یەکەم',
        familyDinner: 'نانی خێزان',
        celebration: 'ئاهەنگ',
        other: 'هیتر'
      }
    },
    ar: {
      title: 'حجز طاولة',
      subtitle: 'احجز طاولتك في قرية الطبيعة',
      step1: 'المعلومات الشخصية',
      step2: 'تفاصيل الحجز',
      step3: 'الطلبات الخاصة',
      step4: 'التأكيد',
      
      // Form fields
      name: 'الاسم الكامل',
      email: 'عنوان البريد الإلكتروني',
      phone: 'رقم الهاتف',
      date: 'التاريخ المفضل',
      time: 'الوقت المفضل',
      partySize: 'عدد الأشخاص',
      specialOccasion: 'مناسبة خاصة',
      specialRequests: 'طلبات خاصة',
      dietaryRestrictions: 'قيود غذائية',
      
      // Validation messages
      nameRequired: 'الاسم الكامل مطلوب',
      emailRequired: 'عنوان البريد الإلكتروني مطلوب',
      emailInvalid: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
      phoneRequired: 'رقم الهاتف مطلوب',
      dateRequired: 'يرجى اختيار تاريخ',
      timeRequired: 'يرجى اختيار وقت',
      partySizeRequired: 'يرجى اختيار عدد الأشخاص',
      
      // Buttons
      next: 'الخطوة التالية',
      previous: 'السابق',
      submit: 'تأكيد الحجز',
      backToHome: 'العودة للرئيسية',
      
      // Status messages
      checking: 'فحص التوفر...',
      available: 'متوفر',
      fullyBooked: 'محجوز بالكامل',
      limitedAvailability: 'توفر محدود',
      
      // Success/Error
      success: 'تم تأكيد الحجز بنجاح!',
      error: 'عذراً، حدث خطأ في معالجة حجزك.',
      
      // Special occasions
      occasions: {
        birthday: 'عيد ميلاد',
        anniversary: 'ذكرى سنوية',
        business: 'اجتماع عمل',
        dateNight: 'ليلة رومانسية',
        familyDinner: 'عشاء عائلي',
        celebration: 'احتفال',
        other: 'أخرى'
      }
    }
  };

  const t = translations[language];
  const isRTL = languages[language].dir === 'rtl';

  // Validation schema
  const schema = yup.object().shape({
    name: yup.string().required(t.nameRequired),
    email: yup.string().email(t.emailInvalid).required(t.emailRequired),
    phone: yup.string().required(t.phoneRequired),
    date: yup.date().required(t.dateRequired),
    time: yup.string().required(t.timeRequired),
    partySize: yup.number().required(t.partySizeRequired).min(1).max(20),
    specialOccasion: yup.string(),
    specialRequests: yup.string(),
    dietaryRestrictions: yup.string()
  });

  const { control, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const watchedDate = watch('date');
  const watchedTime = watch('time');
  const watchedPartySize = watch('partySize');

  // Check availability when date changes
  useEffect(() => {
    if (watchedDate) {
      checkAvailability(watchedDate);
    }
  }, [watchedDate]);

  const checkAvailability = async (date) => {
    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: date.toISOString().split('T')[0] })
      });
      
      const data = await response.json();
      setAvailableTimes(data.availableTimes || []);
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Error checking availability');
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const formattedData = {
        ...data,
        date: data.date.toISOString().split('T')[0],
        language: language
      };

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData)
      });

      const result = await response.json();

      if (response.ok) {
        setReservationResult(result);
        setCurrentStep(5); // Success step
        toast.success(t.success);
      } else {
        toast.error(result.error || t.error);
      }
    } catch (error) {
      console.error('Reservation error:', error);
      toast.error(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = {
      1: ['name', 'email', 'phone'],
      2: ['date', 'time', 'partySize'],
      3: [] // Optional fields
    };

    const isValid = await trigger(fieldsToValidate[currentStep]);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today;
  };

  // Get maximum date (60 days from today)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    return maxDate;
  };

  // Filter dates to exclude closed days
  const isDateAvailable = (date) => {
    const day = date.getDay();
    // Assuming restaurant is open all days, but you can modify this
    return true;
  };

  const timeOptions = [
    { value: '11:00', label: '11:00 AM' },
    { value: '11:30', label: '11:30 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '12:30', label: '12:30 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '13:30', label: '1:30 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '18:30', label: '6:30 PM' },
    { value: '19:00', label: '7:00 PM' },
    { value: '19:30', label: '7:30 PM' },
    { value: '20:00', label: '8:00 PM' },
    { value: '20:30', label: '8:30 PM' },
    { value: '21:00', label: '9:00 PM' }
  ];

  const occasionOptions = Object.entries(t.occasions).map(([key, label]) => ({
    value: key,
    label,
    icon: {
      birthday: <PartyPopper className="w-4 h-4" />,
      anniversary: <Heart className="w-4 h-4" />,
      business: <Briefcase className="w-4 h-4" />,
      dateNight: <Heart className="w-4 h-4" />,
      familyDinner: <Users className="w-4 h-4" />,
      celebration: <PartyPopper className="w-4 h-4" />,
      other: <Gift className="w-4 h-4" />
    }[key]
  }));

  // Step components
  const StepIndicator = () => (
    <div className={`flex items-center justify-center mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              currentStep >= step
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {currentStep > step ? <Check className="w-5 h-5" /> : step}
          </div>
          {step < 4 && (
            <div
              className={`h-1 w-16 mx-2 ${
                currentStep > step ? 'bg-amber-600' : 'bg-gray-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const PersonalInfoStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-amber-800 mb-2">{t.step1}</h2>
        <p className="text-gray-600">Please provide your contact information</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            {t.name}
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder={t.namePlaceholder}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              />
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            {t.email}
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                placeholder={t.emailPlaceholder}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ direction: 'ltr' }} // Email always LTR
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            {t.phone}
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                {...field}
                country="us"
                placeholder={t.phonePlaceholder}
                inputClass={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                containerClass="w-full"
                enableSearch={true}
                searchPlaceholder="Search countries..."
              />
            )}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>
    </motion.div>
  );

  const ReservationDetailsStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-amber-800 mb-2">{t.step2}</h2>
        <p className="text-gray-600">When would you like to dine with us?</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            {t.date}
          </label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                minDate={getMinDate()}
                maxDate={getMaxDate()}
                filterDate={isDateAvailable}
                placeholderText="Select a date"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
                dateFormat="MMMM d, yyyy"
                showPopperArrow={false}
              />
            )}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            {t.time}
          </label>
          <Controller
            name="time"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={timeOptions}
                placeholder="Select a time"
                className={`react-select-container ${errors.time ? 'border-red-500' : ''}`}
                classNamePrefix="react-select"
                isSearchable={false}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '48px',
                    border: errors.time ? '1px solid #ef4444' : '1px solid #d1d5db',
                    '&:hover': {
                      border: errors.time ? '1px solid #ef4444' : '1px solid #d1d5db'
                    },
                    '&:focus': {
                      border: '2px solid #f59e0b',
                      boxShadow: '0 0 0 1px #f59e0b'
                    }
                  })
                }}
              />
            )}
          />
          {errors.time && (
            <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-2" />
            {t.partySize}
          </label>
          <Controller
            name="partySize"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={t.partySizeOptions}
                placeholder="Select party size"
                className={`react-select-container ${errors.partySize ? 'border-red-500' : ''}`}
                classNamePrefix="react-select"
                isSearchable={false}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '48px',
                    border: errors.partySize ? '1px solid #ef4444' : '1px solid #d1d5db',
                    '&:hover': {
                      border: errors.partySize ? '1px solid #ef4444' : '1px solid #d1d5db'
                    },
                    '&:focus': {
                      border: '2px solid #f59e0b',
                      boxShadow: '0 0 0 1px #f59e0b'
                    }
                  })
                }}
              />
            )}
          />
          {errors.partySize && (
            <p className="text-red-500 text-sm mt-1">{errors.partySize.message}</p>
          )}
        </div>

        {availableTimes.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-green-700">
              <Check className="w-5 h-5" />
              <span className="font-medium">{t.available}</span>
            </div>
            <p className="text-green-600 text-sm mt-1">
              Great! We have availability for your selected date and time.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const SpecialRequestsStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-amber-800 mb-2">{t.step3}</h2>
        <p className="text-gray-600">Tell us about any special requirements</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Gift className="w-4 h-4 inline mr-2" />
            {t.specialOccasion}
          </label>
          <Controller
            name="specialOccasion"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={occasionOptions}
                placeholder="Select an occasion (optional)"
                className="react-select-container"
                classNamePrefix="react-select"
                isClearable
                isSearchable={false}
                formatOptionLabel={(option) => (
                  <div className="flex items-center space-x-2">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                )}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '48px'
                  })
                }}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            {t.specialRequests}
          </label>
          <Controller
            name="specialRequests"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={4}
                placeholder={t.requestsPlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <UtensilsCrossed className="w-4 h-4 inline mr-2" />
            {t.dietaryRestrictions}
          </label>
          <Controller
            name="dietaryRestrictions"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={3}
                placeholder={t.dietaryPlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              />
            )}
          />
        </div>
      </div>
    </motion.div>
  );

  const ConfirmationStep = () => {
    const formData = watch();
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-amber-800 mb-2">{t.step4}</h2>
          <p className="text-gray-600">Please review your reservation details</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">{t.reservationDetails}</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{formData.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{formData.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{formData.phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">
                {formData.date?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{formData.time?.label}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Party Size:</span>
              <span className="font-medium">{formData.partySize?.label}</span>
            </div>
            {formData.specialOccasion && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Occasion:</span>
                <span className="font-medium">{formData.specialOccasion.label}</span>
              </div>
            )}
            {formData.specialRequests && (
              <div>
                <span className="text-gray-600">Special Requests:</span>
                <p className="font-medium mt-1">{formData.specialRequests}</p>
              </div>
            )}
            {formData.dietaryRestrictions && (
              <div>
                <span className="text-gray-600">Dietary Restrictions:</span>
                <p className="font-medium mt-1">{formData.dietaryRestrictions}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Nature Village Restaurant</h4>
              <p className="text-blue-600 text-sm">123 Kurdistan Street, City Center</p>
              <p className="text-blue-600 text-sm">Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const SuccessStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-10 h-10 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-green-800 mb-2">{t.success}</h2>
        <p className="text-lg text-gray-600 mb-4">{t.thankYou}</p>
        <p className="text-gray-600">{t.emailSent}</p>
      </div>

      {reservationResult && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 max-w-md mx-auto">
          <h3 className="font-semibold text-green-800 mb-2">{t.confirmationCode}</h3>
          <p className="text-2xl font-mono font-bold text-green-600">
            {reservationResult.confirmationCode}
          </p>
          <p className="text-sm text-green-600 mt-2">
            Please save this code for your records
          </p>
        </div>
      )}

      <div className="space-y-3">
        <Link href="/">
          <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
            {t.backToHome}
          </button>
        </Link>
      </div>
    </motion.div>
  );

  return (
    <>
      <Head>
        <title>{t.title} - Nature Village Kurdish Restaurant</title>
        <meta name="description" content="Reserve your table at Nature Village Kurdish Restaurant. Experience authentic Kurdish cuisine in a warm, traditional setting." />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100" style={{ direction: languages[language].dir }}>
        <Toaster position="top-center" />
        
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link href="/">
                <div className={`flex items-center space-x-3 cursor-pointer ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <img 
                    src="https://naturevillagerestaurant.com/wp-content/uploads/2024/09/cropped-NatureVillage-Logo_circle-1222-2048x2048-1.webp" 
                    alt="Nature Village Restaurant Logo" 
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h1 className="text-xl font-serif font-bold text-amber-800">Nature Village</h1>
                    <p className="text-sm text-amber-600">Kurdish Restaurant</p>
                  </div>
                </div>
              </Link>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="appearance-none bg-transparent text-amber-800 hover:text-amber-600 font-medium text-sm border-none outline-none cursor-pointer pr-6"
                  >
                    {Object.entries(languages).map(([code, lang]) => (
                      <option key={code} value={code} className="bg-white text-amber-800">
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  <Globe className="w-4 h-4 absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none text-amber-800" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-8 text-center">
              <h1 className="text-3xl font-serif font-bold mb-2">{t.title}</h1>
              <p className="text-amber-100">{t.subtitle}</p>
            </div>

            <div className="p-8">
              {currentStep <= 4 && <StepIndicator />}

              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {currentStep === 1 && <PersonalInfoStep key="step1" />}
                  {currentStep === 2 && <ReservationDetailsStep key="step2" />}
                  {currentStep === 3 && <SpecialRequestsStep key="step3" />}
                  {currentStep === 4 && <ConfirmationStep key="step4" />}
                  {currentStep === 5 && <SuccessStep key="step5" />}
                </AnimatePresence>

                {currentStep <= 4 && (
                  <div className={`flex justify-between mt-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className={`flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        isRTL ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>{t.previous}</span>
                    </button>

                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className={`flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors ${
                          isRTL ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <span>{t.next}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          isRTL ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>{t.submit}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 text-gray-600">
          <p>© 2024 Nature Village Kurdish Restaurant. All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default ReservationPage;
