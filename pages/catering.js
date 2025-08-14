import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Head from 'next/head';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';
import { useDropzone } from 'react-dropzone';
import Slider from 'react-slider';
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
  Upload,
  FileText,
  DollarSign,
  ArrowRight,
  Building,
  Heart,
  PartyPopper,
  Briefcase,
  Globe,
  Camera,
  Star,
  ChefHat,
  Truck,
  Home,
  Package
} from 'lucide-react';

// Import CSS
import 'react-datepicker/dist/react-datepicker.css';
import 'react-phone-input-2/lib/style.css';

const CateringPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState('en');
  const [cateringResult, setCateringResult] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [estimatedCost, setEstimatedCost] = useState(0);

  // Language options
  const languages = {
    en: { name: 'English', code: 'en', dir: 'ltr' },
    ku: { name: 'کوردی', code: 'ku', dir: 'rtl' },
    ar: { name: 'العربية', code: 'ar', dir: 'rtl' }
  };

  // Translations
  const translations = {
    en: {
      title: 'Catering Services',
      subtitle: 'Authentic Kurdish cuisine for your special events',
      step1: 'Event Information',
      step2: 'Menu & Packages',
      step3: 'Venue & Requirements',
      step4: 'Files & Budget',
      step5: 'Review & Submit',
      
      // Form fields
      name: 'Contact Name',
      email: 'Email Address',
      phone: 'Phone Number',
      organization: 'Organization/Company',
      eventType: 'Event Type',
      eventDate: 'Event Date',
      eventEndDate: 'Event End Date (if multi-day)',
      eventTime: 'Event Start Time',
      guestCount: 'Number of Guests',
      venueOption: 'Venue Option',
      venueAddress: 'Venue Address',
      venueDetails: 'Venue Details',
      menuPreferences: 'Menu Preferences',
      dietaryRestrictions: 'Dietary Restrictions',
      serviceStyle: 'Service Style',
      specialEquipment: 'Special Equipment Needed',
      detailedRequirements: 'Detailed Requirements',
      budgetRange: 'Budget Range',
      venuePhotos: 'Venue Photos',
      eventLayout: 'Event Layout/Floor Plan',
      
      // Event types
      eventTypes: {
        corporate: 'Corporate Event',
        wedding: 'Wedding',
        private_party: 'Private Party',
        cultural_event: 'Cultural Event',
        birthday: 'Birthday Party',
        anniversary: 'Anniversary',
        business_meeting: 'Business Meeting',
        other: 'Other'
      },
      
      // Venue options
      venueOptions: {
        our_location: 'Our Restaurant Location',
        customer_location: 'Customer Location',
        delivery_only: 'Delivery Only'
      },
      
      // Service styles
      serviceStyles: {
        buffet: 'Buffet Style',
        plated: 'Plated Service',
        family_style: 'Family Style',
        cocktail: 'Cocktail Reception',
        mixed: 'Mixed Service'
      },
      
      // Budget ranges
      budgetRanges: [
        { value: 'under_1000', label: 'Under $1,000' },
        { value: '1000_2500', label: '$1,000 - $2,500' },
        { value: '2500_5000', label: '$2,500 - $5,000' },
        { value: '5000_10000', label: '$5,000 - $10,000' },
        { value: 'over_10000', label: 'Over $10,000' },
        { value: 'flexible', label: 'Flexible/Discuss' }
      ],
      
      // Catering packages
      packages: {
        traditional: {
          name: 'Traditional Kurdish Feast',
          description: 'Complete traditional Kurdish dining experience',
          pricePerPerson: 35,
          minGuests: 10,
          items: ['Kebab-e Kubideh', 'Dolma', 'Yaprakh', 'Ash-e Reshteh', 'Kurdish Rice', 'Fresh Bread', 'Dessert', 'Tea Service']
        },
        vegetarian: {
          name: 'Vegetarian Delight',
          description: 'Carefully curated vegetarian and vegan dishes',
          pricePerPerson: 28,
          minGuests: 10,
          items: ['Dolma', 'Khorak-e Bademjan', 'Kurdish Salads', 'Stuffed Peppers', 'Lentil Soup', 'Hummus Selection', 'Fresh Bread', 'Baklava']
        },
        premium: {
          name: 'Premium Wedding Package',
          description: 'Elegant dining experience for special celebrations',
          pricePerPerson: 45,
          minGuests: 25,
          items: ['Welcome Appetizers', 'Mixed Grill Platter', 'Traditional Stews', 'Saffron Rice', 'Wedding Cake', 'Traditional Sweets', 'Coffee & Tea Service']
        },
        corporate: {
          name: 'Corporate Lunch',
          description: 'Professional catering for business events',
          pricePerPerson: 25,
          minGuests: 15,
          items: ['Mixed Appetizers', 'Business Lunch Entrees', 'Fresh Salads', 'Bread Basket', 'Fresh Fruit', 'Coffee Service']
        }
      },
      
      // Validation messages
      nameRequired: 'Contact name is required',
      emailRequired: 'Email address is required',
      emailInvalid: 'Please enter a valid email address',
      phoneRequired: 'Phone number is required',
      eventTypeRequired: 'Please select an event type',
      eventDateRequired: 'Please select an event date',
      guestCountRequired: 'Please specify number of guests',
      venueOptionRequired: 'Please select a venue option',
      
      // Buttons
      next: 'Next Step',
      previous: 'Previous',
      submit: 'Submit Catering Request',
      backToHome: 'Back to Home',
      uploadFiles: 'Upload Files',
      removeFile: 'Remove File',
      
      // Messages
      success: 'Catering inquiry submitted successfully!',
      error: 'Sorry, there was an error processing your inquiry.',
      thankYou: 'Thank you for your catering inquiry!',
      emailSent: 'We will review your request and respond within 24 hours.',
      estimatedCost: 'Estimated Cost',
      inquiryCode: 'Inquiry Code',
      
      // Placeholders
      namePlaceholder: 'Enter contact name',
      emailPlaceholder: 'Enter email address',
      phonePlaceholder: 'Enter phone number',
      organizationPlaceholder: 'Company or organization name',
      venueAddressPlaceholder: 'Full venue address',
      venueDetailsPlaceholder: 'Venue size, facilities, parking, etc.',
      menuPreferencesPlaceholder: 'Any specific menu requests or preferences...',
      dietaryPlaceholder: 'Allergies, vegetarian, vegan, halal requirements...',
      equipmentPlaceholder: 'Tables, chairs, linens, audio/visual equipment...',
      requirementsPlaceholder: 'Any additional requirements or special instructions...',
      
      // File upload
      dropZoneText: 'Drag & drop files here, or click to select',
      supportedFormats: 'Supported formats: JPG, PNG, PDF (max 5MB each)',
      maxFiles: 'Maximum 5 files',
      
      // Guest count slider
      guestCountLabel: 'guests',
      guestCountNote: 'Minimum 10 guests for catering services'
    },
    ku: {
      title: 'خزمەتگوزاری قوناغکردن',
      subtitle: 'خۆراکی ڕەسەنی کوردی بۆ ئاهەنگە تایبەتەکانت',
      step1: 'زانیاری ئاهەنگ',
      step2: 'مێنو و پاکێجەکان',
      step3: 'شوێن و پێداویستی',
      step4: 'فایل و بودجە',
      step5: 'پێداچوونەوە و ناردن',
      
      eventTypes: {
        corporate: 'ئاهەنگی کۆمپانیا',
        wedding: 'زەماوەند',
        private_party: 'ئاهەنگی تایبەت',
        cultural_event: 'ئاهەنگی کولتووری',
        birthday: 'ئاهەنگی ڕۆژی لەدایکبوون',
        anniversary: 'ساڵیاد',
        business_meeting: 'کۆبوونەوەی بازرگانی',
        other: 'هیتر'
      }
    },
    ar: {
      title: 'خدمات التقديم',
      subtitle: 'المأكولات الكردية الأصيلة لفعالياتك الخاصة',
      step1: 'معلومات الفعالية',
      step2: 'القائمة والباقات',
      step3: 'المكان والمتطلبات',
      step4: 'الملفات والميزانية',
      step5: 'المراجعة والإرسال',
      
      eventTypes: {
        corporate: 'فعالية الشركات',
        wedding: 'حفل زفاف',
        private_party: 'حفلة خاصة',
        cultural_event: 'فعالية ثقافية',
        birthday: 'عيد ميلاد',
        anniversary: 'ذكرى سنوية',
        business_meeting: 'اجتماع عمل',
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
    organization: yup.string(),
    eventType: yup.string().required(t.eventTypeRequired),
    eventDate: yup.date().required(t.eventDateRequired),
    eventEndDate: yup.date().nullable(),
    eventTime: yup.string(),
    guestCount: yup.number().required(t.guestCountRequired).min(10).max(500),
    venueOption: yup.string().required(t.venueOptionRequired),
    venueAddress: yup.string(),
    venueDetails: yup.string(),
    menuPreferences: yup.string(),
    dietaryRestrictions: yup.string(),
    serviceStyle: yup.string(),
    specialEquipment: yup.string(),
    detailedRequirements: yup.string(),
    budgetRange: yup.string()
  });

  const { control, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      guestCount: 25
    }
  });

  const watchedGuestCount = watch('guestCount');
  const watchedEventType = watch('eventType');
  const watchedVenueOption = watch('venueOption');

  // Calculate estimated cost based on selections
  useEffect(() => {
    if (selectedPackages.length > 0 && watchedGuestCount) {
      const total = selectedPackages.reduce((sum, pkg) => {
        return sum + (pkg.pricePerPerson * watchedGuestCount);
      }, 0);
      setEstimatedCost(total);
    }
  }, [selectedPackages, watchedGuestCount]);

  // File upload handling
  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.slice(0, 5 - uploadedFiles.length);
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  });

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Add form data
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          if (key === 'eventDate' || key === 'eventEndDate') {
            formData.append(key, data[key]?.toISOString().split('T')[0] || '');
          } else {
            formData.append(key, data[key]);
          }
        }
      });
      
      // Add files
      uploadedFiles.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
      
      // Add additional data
      formData.append('selectedPackages', JSON.stringify(selectedPackages));
      formData.append('estimatedCost', estimatedCost);
      formData.append('language', language);

      const response = await fetch('/api/catering', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setCateringResult(result);
        setCurrentStep(6); // Success step
        toast.success(t.success);
      } else {
        toast.error(result.error || t.error);
      }
    } catch (error) {
      console.error('Catering error:', error);
      toast.error(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = {
      1: ['name', 'email', 'phone', 'eventType'],
      2: [], // Package selection validation handled separately
      3: ['eventDate', 'guestCount', 'venueOption'],
      4: [], // Optional fields
      5: [] // Review step
    };

    const isValid = await trigger(fieldsToValidate[currentStep]);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Get minimum date (7 days from today for catering lead time)
  const getMinDate = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7);
    return minDate;
  };

  // Get maximum date (1 year from today)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return maxDate;
  };

  // Step components
  const StepIndicator = () => (
    <div className={`flex items-center justify-center mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {[1, 2, 3, 4, 5].map((step) => (
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
          {step < 5 && (
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

  const EventInfoStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-amber-800 mb-2">{t.step1}</h2>
        <p className="text-gray-600">Tell us about your event and contact information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Building className="w-4 h-4 inline mr-2" />
            {t.organization}
          </label>
          <Controller
            name="organization"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder={t.organizationPlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              />
            )}
          />
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
                style={{ direction: 'ltr' }}
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
              />
            )}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <PartyPopper className="w-4 h-4 inline mr-2" />
          {t.eventType}
        </label>
        <Controller
          name="eventType"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={Object.entries(t.eventTypes).map(([key, label]) => ({
                value: key,
                label,
                icon: {
                  corporate: <Briefcase className="w-4 h-4" />,
                  wedding: <Heart className="w-4 h-4" />,
                  private_party: <PartyPopper className="w-4 h-4" />,
                  cultural_event: <Star className="w-4 h-4" />,
                  birthday: <PartyPopper className="w-4 h-4" />,
                  anniversary: <Heart className="w-4 h-4" />,
                  business_meeting: <Briefcase className="w-4 h-4" />,
                  other: <Calendar className="w-4 h-4" />
                }[key]
              }))}
              placeholder="Select event type"
              className={`react-select-container ${errors.eventType ? 'border-red-500' : ''}`}
              classNamePrefix="react-select"
              isSearchable={false}
              formatOptionLabel={(option) => (
                <div className="flex items-center space-x-2">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              )}
            />
          )}
        />
        {errors.eventType && (
          <p className="text-red-500 text-sm mt-1">{errors.eventType.message}</p>
        )}
      </div>
    </motion.div>
  );

  const PackageStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-amber-800 mb-2">{t.step2}</h2>
        <p className="text-gray-600">Choose your catering packages and menu options</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(t.packages).map(([key, pkg]) => (
          <div
            key={key}
            className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
              selectedPackages.some(p => p.key === key)
                ? 'border-amber-500 bg-amber-50'
                : 'border-gray-200 hover:border-amber-300'
            }`}
            onClick={() => {
              const isSelected = selectedPackages.some(p => p.key === key);
              if (isSelected) {
                setSelectedPackages(prev => prev.filter(p => p.key !== key));
              } else {
                setSelectedPackages(prev => [...prev, { key, ...pkg }]);
              }
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-amber-800">{pkg.name}</h3>
                <p className="text-gray-600 text-sm">{pkg.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-amber-600">${pkg.pricePerPerson}</div>
                <div className="text-sm text-gray-500">per person</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Includes:</p>
              <div className="flex flex-wrap gap-1">
                {pkg.items.slice(0, 3).map((item, index) => (
                  <span key={index} className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs">
                    {item}
                  </span>
                ))}
                {pkg.items.length > 3 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    +{pkg.items.length - 3} more
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              Minimum {pkg.minGuests} guests
            </div>
          </div>
        ))}
      </div>

      {selectedPackages.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">Selected Packages:</h4>
          <div className="space-y-1">
            {selectedPackages.map((pkg) => (
              <div key={pkg.key} className="flex justify-between items-center text-green-700">
                <span>{pkg.name}</span>
                <span>${pkg.pricePerPerson}/person</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <ChefHat className="w-4 h-4 inline mr-2" />
          {t.menuPreferences}
        </label>
        <Controller
          name="menuPreferences"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={3}
              placeholder={t.menuPreferencesPlaceholder}
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
    </motion.div>
  );

  const VenueRequirementsStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-amber-800 mb-2">{t.step3}</h2>
        <p className="text-gray-600">Event details and venue information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            {t.eventDate}
          </label>
          <Controller
            name="eventDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                minDate={getMinDate()}
                maxDate={getMaxDate()}
                placeholderText="Select event date"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.eventDate ? 'border-red-500' : 'border-gray-300'
                }`}
                dateFormat="MMMM d, yyyy"
                showPopperArrow={false}
              />
            )}
          />
          {errors.eventDate && (
            <p className="text-red-500 text-sm mt-1">{errors.eventDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            {t.eventEndDate}
          </label>
          <Controller
            name="eventEndDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                minDate={watch('eventDate') || getMinDate()}
                maxDate={getMaxDate()}
                placeholderText="Optional for multi-day events"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                dateFormat="MMMM d, yyyy"
                showPopperArrow={false}
                isClearable
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            {t.eventTime}
          </label>
          <Controller
            name="eventTime"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="time"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-2" />
            {t.guestCount}: {watchedGuestCount} {t.guestCountLabel}
          </label>
          <Controller
            name="guestCount"
            control={control}
            render={({ field }) => (
              <div className="px-4">
                <Slider
                  {...field}
                  min={10}
                  max={500}
                  step={5}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  className="w-full"
                  thumbClassName="w-6 h-6 bg-amber-600 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
                  trackClassName="h-2 bg-gray-200 rounded-full"
                  renderThumb={(props) => <div {...props} className="w-6 h-6 bg-amber-600 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500" />}
                  renderTrack={(props, state) => (
                    <div {...props} className={`h-2 rounded-full ${state.index === 0 ? 'bg-amber-600' : 'bg-gray-200'}`} />
                  )}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>10</span>
                  <span>500+</span>
                </div>
              </div>
            )}
          />
          <p className="text-sm text-gray-500 mt-2">{t.guestCountNote}</p>
          {errors.guestCount && (
            <p className="text-red-500 text-sm mt-1">{errors.guestCount.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-2" />
          {t.venueOption}
        </label>
        <Controller
          name="venueOption"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(t.venueOptions).map(([key, label]) => (
                <div
                  key={key}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    field.value === key
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                  onClick={() => field.onChange(key)}
                >
                  <div className="text-center">
                    {key === 'our_location' && <Home className="w-8 h-8 mx-auto mb-2 text-amber-600" />}
                    {key === 'customer_location' && <MapPin className="w-8 h-8 mx-auto mb-2 text-amber-600" />}
                    {key === 'delivery_only' && <Truck className="w-8 h-8 mx-auto mb-2 text-amber-600" />}
                    <div className="font-medium text-gray-800">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        />
        {errors.venueOption && (
          <p className="text-red-500 text-sm mt-1">{errors.venueOption.message}</p>
        )}
      </div>

      {watchedVenueOption === 'customer_location' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.venueAddress}
            </label>
            <Controller
              name="venueAddress"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder={t.venueAddressPlaceholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.venueDetails}
            </label>
            <Controller
              name="venueDetails"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  placeholder={t.venueDetailsPlaceholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                />
              )}
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Package className="w-4 h-4 inline mr-2" />
          {t.serviceStyle}
        </label>
        <Controller
          name="serviceStyle"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={Object.entries(t.serviceStyles).map(([key, label]) => ({
                value: key,
                label
              }))}
              placeholder="Select service style"
              className="react-select-container"
              classNamePrefix="react-select"
              isSearchable={false}
              isClearable
            />
          )}
        />
      </div>
    </motion.div>
  );

  const FileBudgetStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-amber-800 mb-2">{t.step4}</h2>
        <p className="text-gray-600">Additional requirements and budget information</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Camera className="w-4 h-4 inline mr-2" />
          {t.venuePhotos}
        </label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">{t.dropZoneText}</p>
          <p className="text-sm text-gray-500">{t.supportedFormats}</p>
          <p className="text-xs text-gray-400 mt-1">{t.maxFiles}</p>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="w-4 h-4 inline mr-2" />
          {t.budgetRange}
        </label>
        <Controller
          name="budgetRange"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={t.budgetRanges}
              placeholder="Select budget range"
              className="react-select-container"
              classNamePrefix="react-select"
              isSearchable={false}
              isClearable
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Package className="w-4 h-4 inline mr-2" />
          {t.specialEquipment}
        </label>
        <Controller
          name="specialEquipment"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={3}
              placeholder={t.equipmentPlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MessageSquare className="w-4 h-4 inline mr-2" />
          {t.detailedRequirements}
        </label>
        <Controller
          name="detailedRequirements"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={4}
              placeholder={t.requirementsPlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            />
          )}
        />
      </div>

      {estimatedCost > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h4 className="font-semibold text-amber-800 mb-2">{t.estimatedCost}</h4>
          <div className="text-3xl font-bold text-amber-600">
            ${estimatedCost.toLocaleString()}
          </div>
          <p className="text-sm text-amber-600 mt-1">
            Based on selected packages for {watchedGuestCount} guests
          </p>
          <p className="text-xs text-amber-500 mt-2">
            *Final pricing may vary based on specific requirements and customizations
          </p>
        </div>
      )}
    </motion.div>
  );

  const ReviewStep = () => {
    const formData = watch();
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-amber-800 mb-2">{t.step5}</h2>
          <p className="text-gray-600">Please review your catering request details</p>
        </div>

        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Name:</span>
                <div className="font-medium">{formData.name}</div>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <div className="font-medium">{formData.email}</div>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <div className="font-medium">{formData.phone}</div>
              </div>
              {formData.organization && (
                <div>
                  <span className="text-gray-600">Organization:</span>
                  <div className="font-medium">{formData.organization}</div>
                </div>
              )}
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Event Type:</span>
                <div className="font-medium">{t.eventTypes[formData.eventType]}</div>
              </div>
              <div>
                <span className="text-gray-600">Date:</span>
                <div className="font-medium">
                  {formData.eventDate?.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Guest Count:</span>
                <div className="font-medium">{formData.guestCount} guests</div>
              </div>
              <div>
                <span className="text-gray-600">Venue:</span>
                <div className="font-medium">{t.venueOptions[formData.venueOption]}</div>
              </div>
            </div>
          </div>

          {/* Selected Packages */}
          {selectedPackages.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-4">Selected Packages</h3>
              <div className="space-y-3">
                {selectedPackages.map((pkg) => (
                  <div key={pkg.key} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{pkg.name}</div>
                      <div className="text-sm text-gray-600">{pkg.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-amber-600">${pkg.pricePerPerson}/person</div>
                      <div className="text-sm text-gray-500">
                        ${(pkg.pricePerPerson * formData.guestCount).toLocaleString()} total
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {estimatedCost > 0 && (
                <div className="border-t border-amber-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-amber-800">Estimated Total:</span>
                    <span className="text-2xl font-bold text-amber-600">
                      ${estimatedCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
            <div className="space-y-3">
              {formData.menuPreferences && (
                <div>
                  <span className="text-gray-600">Menu Preferences:</span>
                  <div className="font-medium">{formData.menuPreferences}</div>
                </div>
              )}
              {formData.dietaryRestrictions && (
                <div>
                  <span className="text-gray-600">Dietary Restrictions:</span>
                  <div className="font-medium">{formData.dietaryRestrictions}</div>
                </div>
              )}
              {formData.detailedRequirements && (
                <div>
                  <span className="text-gray-600">Special Requirements:</span>
                  <div className="font-medium">{formData.detailedRequirements}</div>
                </div>
              )}
              {uploadedFiles.length > 0 && (
                <div>
                  <span className="text-gray-600">Uploaded Files:</span>
                  <div className="font-medium">{uploadedFiles.length} file(s) attached</div>
                </div>
              )}
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

      {cateringResult && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 max-w-md mx-auto">
          <h3 className="font-semibold text-green-800 mb-2">{t.inquiryCode}</h3>
          <p className="text-2xl font-mono font-bold text-green-600">
            {cateringResult.confirmationCode}
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
        <meta name="description" content="Professional catering services from Nature Village Kurdish Restaurant. Authentic Kurdish cuisine for weddings, corporate events, and special occasions." />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100" style={{ direction: languages[language].dir }}>
        <Toaster position="top-center" />
        
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-6">
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
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-8 text-center">
              <h1 className="text-3xl font-serif font-bold mb-2">{t.title}</h1>
              <p className="text-amber-100">{t.subtitle}</p>
            </div>

            <div className="p-8">
              {currentStep <= 5 && <StepIndicator />}

              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {currentStep === 1 && <EventInfoStep key="step1" />}
                  {currentStep === 2 && <PackageStep key="step2" />}
                  {currentStep === 3 && <VenueRequirementsStep key="step3" />}
                  {currentStep === 4 && <FileBudgetStep key="step4" />}
                  {currentStep === 5 && <ReviewStep key="step5" />}
                  {currentStep === 6 && <SuccessStep key="step6" />}
                </AnimatePresence>

                {currentStep <= 5 && (
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

                    {currentStep < 5 ? (
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

export default CateringPage;
