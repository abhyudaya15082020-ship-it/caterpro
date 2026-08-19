import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  te: {
    // App Header & Branding
    'app_name': 'CaterPro',
    'app_tagline': 'మీ వేడుకకు కావాల్సిన Catering… ఒక్క Appలో!',
    'switch_lang': 'English',
    'support_call': 'సహాయం: +91 98765 43210',
    'emergency_whatsapp': 'WhatsApp Enquiry',
    
    // Navigation
    'nav_home': 'హోమ్ (Home)',
    'nav_staff': 'స్టాఫ్ కేటలాగ్ (Staff)',
    'nav_menu': 'ఫుడ్ మెనూ (Menu)',
    'nav_quote': 'కొటేషన్ కాలిక్యులేటర్ (Quote)',
    'nav_my_bookings': 'నా బుకింగ్స్ (My Bookings)',
    'nav_vendor_portal': 'వెండర్ పోర్టల్ (Vendor)',
    'nav_admin_panel': 'అడ్మిన్ డ్యాష్‌బోర్డ్ (Admin)',

    // Hero Section
    'hero_title': 'జెంట్స్ & లేడీస్ క్యాటరింగ్ సర్వీసెస్ & ఫుడ్ విందు',
    'hero_subtitle': 'మీ వివాహం, పుట్టినరోజు, గృహప్రవేశం మరియు అన్ని ఫంక్షన్లకు అనుభవజ్ఞులైన వంట మాస్టర్లు, సర్వర్లు, సహాయకులు మరియు రుచికరమైన భోజన సేవలు.',
    'search_placeholder': 'మీ ప్రాంతంలో క్యాటరింగ్ లేదా స్టాఫ్ కోసం వెతకండి...',
    'location': 'ప్రాంతం (Location)',
    'event_date': 'ఈవెంట్ తేదీ (Date)',
    'guest_count': 'అతిథుల సంఖ్య (Guests)',
    'event_type': 'ఈవెంట్ రకం (Event Type)',
    'budget_filter': 'బడ్జెట్ పరిధి',
    'search_now': 'వెతకండి (Search Services)',
    'instant_quote_btn': '⚡ తక్షణ కొటేషన్ లెక్కించండి (Calculate Quote)',

    // Category Tabs
    'cat_all': 'అన్నీ (All Services)',
    'cat_gents_staff': '👨 జెంట్స్ స్టాఫ్ (Gents Staff)',
    'cat_ladies_staff': '👩 లేడీస్ స్టాఫ్ (Ladies Staff)',
    'cat_food_catering': '🍛 ఫుడ్ క్యాటరింగ్ (Food Catering)',
    'cat_cooks': '👨‍🍳 వంట మాస్టర్లు (Cooks & Chefs)',
    'cat_cleaning': '🧹 క్లీనింగ్ & సెటప్ (Cleaning & Setup)',

    // Staff Showcase
    'staff_showcase_title': 'జెంట్స్ & లేడీస్ ప్రత్యేక క్యాటరింగ్ సిబ్బంది',
    'staff_showcase_sub': 'మీ ఈవెంట్ స్థాయికి తగిన విధంగా క్రమశిక్షణ గల సర్వర్లు, హెల్పర్లు మరియు హోస్టెస్‌లు అందుబాటులో ఉన్నారు.',
    'gents_staff_heading': '👨 జెంట్స్ క్యాటరింగ్ స్టాఫ్',
    'gents_staff_desc': 'బఫెట్ లైన్ మేనేజ్‌మెంట్, వేగవంతమైన టేబుల్ సర్వీస్, డెగ్చీ సెటప్ మరియు రాత్రి విందులకు నమ్మకమైన సిబ్బంది.',
    'ladies_staff_heading': '👩 లేడీస్ క్యాటరింగ్ స్టాఫ్',
    'ladies_staff_desc': 'సాంప్రదాయ పంక్తి భోజనాల వడ్డన, పిండివంటలు, బొబ్బట్లు, వెల్‌కమ్ డ్రింక్స్ మరియు కుటుంబ వేడుకలకు ఆప్యాయమైన సేవలు.',
    'view_all_staff': 'మొత్తం సిబ్బందిని చూడండి',
    'per_day': 'రోజుకు',
    'exp_years': 'సంవత్సరాల అనుభవం',
    'book_staff_now': 'ఈ స్టాఫ్‌ను బుక్ చేయండి',

    // Service Card
    'verified_badge': 'ధృవీకరించబడిన టీమ్',
    'per_plate': 'ప్లేట్ కు',
    'min_guests': 'కనీస అతిథులు',
    'view_details': 'వివరాలు & మెనూ',
    'book_now': 'ఇప్పుడే బుక్ చేయండి',
    'instant_quote': 'కొటేషన్ తీసుకోండి',
    'call_now': 'కాల్ చేయండి',
    'whatsapp_now': 'WhatsApp లో మాట్లాడండి',

    // Quotation Builder
    'quote_builder_title': 'CaterPro స్మార్ట్ కొటేషన్ కాలిక్యులేటర్',
    'step_event': '1. ఈవెంట్ వివరాలు',
    'step_staff': '2. జెంట్స్ & లేడీస్ స్టాఫ్',
    'step_menu': '3. మెనూ ఎంపిక',
    'step_summary': '4. బిల్ & బుకింగ్ సారాంశం',
    'select_event_type': 'ఈవెంట్ రకం ఎంచుకోండి',
    'select_date_time': 'తేదీ & సమయం',
    'select_location': 'ఈవెంట్ జరిగే ప్రదేశం',
    'approx_guests': 'సుమారు అతిథుల సంఖ్య (Guests Count)',
    'gents_servers_count': 'జెంట్స్ సర్వర్లు (Gents Servers)',
    'gents_cooks_count': 'బిర్యానీ / మెయిన్ కుక్స్ (Head Cooks)',
    'gents_helpers_count': 'జెంట్స్ హెల్పర్లు (Gents Helpers)',
    'ladies_servers_count': 'లేడీస్ సర్వర్లు (Ladies Servers)',
    'ladies_helpers_count': 'లేడీస్ కిచెన్ హెల్పర్లు (Kitchen Ladies)',
    'ladies_hospitality_count': 'లేడీస్ వెల్‌కమ్ హోస్టెస్‌లు (Hostesses)',
    'menu_selection': 'మెనూ ఐటమ్స్ సెలెక్ట్ చేసుకోండి',
    'price_breakdown': 'ధరల వివరాల సారాంశం',
    'food_cost': 'ఫుడ్ చార్జ్ (Food Cost)',
    'staff_cost': 'స్టాఫ్ చార్జ్ (Staff Charges)',
    'setup_cost': 'సెటప్ & సర్వీస్ చార్జ్',
    'total_amount': 'మొత్తం బిల్లు (Total Amount)',
    'advance_required': 'అడ్వాన్స్ చెల్లించవలసిన మొత్తం (20%)',
    'balance_amount': 'ఈవెంట్ రోజు చెల్లించాల్సిన బ్యాలెన్స్ (80%)',
    'download_quote': 'PDF కొటేషన్ డౌన్‌లోడ్',
    'confirm_booking_btn': 'ఈ కొటేషన్‌తో బుకింగ్ కన్ఫర్మ్ చేయండి',

    // Booking Flow & Modal
    'booking_title': 'క్యాటరింగ్ & స్టాఫ్ బుకింగ్ ఫారమ్',
    'your_name': 'మీ పూర్తి పేరు (Full Name)',
    'phone_number': 'మొబైల్ నంబర్ (Phone Number)',
    'email_address': 'ఈమెయిల్ అడ్రస్ (Email)',
    'event_address': 'ఈవెంట్ జరిగే పూర్తి చిరునామా / ఫంక్షన్ హాల్',
    'special_notes': 'ప్రత్యేక సూచనలు / ఏమైనా చెప్పాలనుకుంటున్నారా?',
    'payment_mode': 'అడ్వాన్స్ చెల్లింపు పద్ధతి',
    'pay_online_advance': 'ఆన్‌లైన్ అడ్వాన్స్ పేమెంట్ (UPI / GPay / PhonePe / Card)',
    'pay_at_event': 'నేరుగా ఈవెంట్ లో చెల్లింపు (Cash on Event)',
    'proceed_payment': 'అడ్వాన్స్ చెల్లించి బుకింగ్ పూర్తి చేయండి',

    // My Bookings
    'my_bookings_title': 'నా బుకింగ్స్ & ఆర్డర్ ట్రాకింగ్',
    'no_bookings_yet': 'మీకు ఇంకా ఏ బుకింగ్స్ లేవు.',
    'booking_id': 'బుకింగ్ ID',
    'status_pending': 'పరిశీలనలో ఉంది (Pending)',
    'status_confirmed': 'ధృవీకరించబడింది (Confirmed)',
    'status_in_progress': 'సిబ్బంది కేటాయించబడింది (In Progress)',
    'status_completed': 'పూర్తయింది (Completed)',
    'status_cancelled': 'రద్దు చేయబడింది (Cancelled)',
    'assigned_team': 'కేటాయించిన క్యాటరింగ్ టీమ్',
    'gents_team_lead': 'జెంట్స్ టీమ్ కెప్టెన్',
    'ladies_team_lead': 'లేడీస్ టీమ్ ఇన్‌ఛార్జ్',
    'download_receipt': 'బుకింగ్ రశీదు డౌన్‌లోడ్ (Receipt)',
    'cancel_booking': 'బుకింగ్ రద్దు చేయండి',

    // Vendor Portal & Admin
    'vendor_portal_title': 'క్యాటరింగ్ వెండర్ & స్టాఫ్ పోర్టల్',
    'add_new_service': 'కొత్త సర్వీస్ లేదా స్టాఫ్ ప్యాకేజీని జోడించండి',
    'admin_dashboard_title': 'CaterPro సూపర్ అడ్మిన్ డ్యాష్‌బోర్డ్',
    'total_bookings': 'మొత్తం బుకింగ్స్',
    'total_revenue': 'మొత్తం వ్యాపారం (రూ.)',
    'active_gents_staff': 'యాక్టివ్ జెంట్స్ స్టాఫ్',
    'active_ladies_staff': 'యాక్టివ్ లేడీస్ స్టాఫ్',
    'registered_vendors': 'రిజిస్టర్డ్ వెండర్లు',
    'approve_booking': 'ఆమోదించండి (Approve)',
    'assign_staff': 'సిబ్బందిని కేటాయించండి',
    'reviews_and_ratings': 'కస్టమర్ రేటింగ్స్ & రివ్యూలు',
    'write_review': 'రివ్యూ రాయండి',

    // Footer
    'footer_about': 'CaterPro అనేది ఆంధ్రప్రదేశ్ & తెలంగాణలోని ఉత్తమ క్యాటరింగ్ సంస్థలు, జెంట్స్ మరియు లేడీస్ సర్వింగ్ సిబ్బందిని ఒకే వేదికపైకి తెచ్చే అధునాతన డిజిటల్ ప్లాట్‌ఫారమ్.',
    'served_cities': 'మేము సేవలందిస్తున్న నగరాలు',
    'all_rights': 'సర్వ హక్కులు ప్రత్యేకించబడ్డాయి.'
  },
  en: {
    // App Header & Branding
    'app_name': 'CaterPro',
    'app_tagline': 'All your catering & event staffing in one App!',
    'switch_lang': 'తెలుగు',
    'support_call': 'Support: +91 98765 43210',
    'emergency_whatsapp': 'WhatsApp Enquiry',

    // Navigation
    'nav_home': 'Home',
    'nav_staff': 'Staff Catalog',
    'nav_menu': 'Food Menu',
    'nav_quote': 'Quotation Calculator',
    'nav_my_bookings': 'My Bookings',
    'nav_vendor_portal': 'Vendor Portal',
    'nav_admin_panel': 'Admin Dashboard',

    // Hero Section
    'hero_title': 'Gents & Ladies Catering Staff & Gourmet Feasts',
    'hero_subtitle': 'Professional uniformed servers, master chefs, kitchen helpers, and traditional Andhra, Telangana & Hyderabadi catering for weddings, birthdays, and celebrations.',
    'search_placeholder': 'Search catering teams, gents staff, ladies staff, master cooks...',
    'location': 'Location / City',
    'event_date': 'Event Date',
    'guest_count': 'Guest Count',
    'event_type': 'Event Type',
    'budget_filter': 'Budget Range',
    'search_now': 'Search Services',
    'instant_quote_btn': '⚡ Calculate Instant Quotation',

    // Category Tabs
    'cat_all': 'All Services',
    'cat_gents_staff': '👨 Gents Staff',
    'cat_ladies_staff': '👩 Ladies Staff',
    'cat_food_catering': '🍛 Food Catering',
    'cat_cooks': '👨‍🍳 Master Cooks & Chefs',
    'cat_cleaning': '🧹 Cleaning & Setup',

    // Staff Showcase
    'staff_showcase_title': 'Specialized Gents & Ladies Catering Staff',
    'staff_showcase_sub': 'Disciplined, well-groomed, and experienced event crews tailored specifically for your celebration.',
    'gents_staff_heading': '👨 Gents Catering Staff',
    'gents_staff_desc': 'Fast buffet lines, table service, heavy vessel logistics, and swift event-wide dining coordination.',
    'ladies_staff_heading': '👩 Ladies Catering Staff',
    'ladies_staff_desc': 'Traditional banana leaf sevanam, live hot Bobbatlu, sweet making, hospitality & warm family guest welcome.',
    'view_all_staff': 'View All Staff',
    'per_day': 'per day',
    'exp_years': 'years exp',
    'book_staff_now': 'Hire This Staff Member',

    // Service Card
    'verified_badge': 'Verified Catering Team',
    'per_plate': 'per plate',
    'min_guests': 'Min Guests',
    'view_details': 'Details & Menu',
    'book_now': 'Book Now',
    'instant_quote': 'Instant Quote',
    'call_now': 'Call',
    'whatsapp_now': 'WhatsApp',

    // Quotation Builder
    'quote_builder_title': 'CaterPro Smart Quotation Calculator',
    'step_event': '1. Event Details',
    'step_staff': '2. Gents & Ladies Staff',
    'step_menu': '3. Menu Selection',
    'step_summary': '4. Cost & Booking Summary',
    'select_event_type': 'Select Event Type',
    'select_date_time': 'Date & Time',
    'select_location': 'Event Location / Hall',
    'approx_guests': 'Approximate Guests Count',
    'gents_servers_count': 'Gents Buffet / Table Servers',
    'gents_cooks_count': 'Head Biryani / Main Cooks',
    'gents_helpers_count': 'Gents Kitchen Helpers',
    'ladies_servers_count': 'Ladies Traditional Servers',
    'ladies_helpers_count': 'Ladies Kitchen & Roti Specialists',
    'ladies_hospitality_count': 'Ladies Hospitality Hostesses',
    'menu_selection': 'Customize Menu Items',
    'price_breakdown': 'Price Breakdown Summary',
    'food_cost': 'Food Package Cost',
    'staff_cost': 'Total Staff Charges',
    'setup_cost': 'Setup & Equipment Cost',
    'total_amount': 'Grand Total',
    'advance_required': 'Advance Required (20%)',
    'balance_amount': 'Balance on Event Day (80%)',
    'download_quote': 'Download PDF Quotation',
    'confirm_booking_btn': 'Confirm Booking with this Quote',

    // Booking Flow & Modal
    'booking_title': 'Catering & Staff Reservation',
    'your_name': 'Your Full Name',
    'phone_number': 'Phone Number',
    'email_address': 'Email Address',
    'event_address': 'Event Address / Function Hall Name',
    'special_notes': 'Special instructions or food preferences',
    'payment_mode': 'Advance Payment Option',
    'pay_online_advance': 'Online Advance Payment (UPI / GPay / PhonePe / Cards)',
    'pay_at_event': 'Pay Advance at Event Venue (Cash on Event)',
    'proceed_payment': 'Pay Advance & Confirm Reservation',

    // My Bookings
    'my_bookings_title': 'My Bookings & Order Tracking',
    'no_bookings_yet': 'You have no active catering bookings yet.',
    'booking_id': 'Booking Reference ID',
    'status_pending': 'Under Review (Pending)',
    'status_confirmed': 'Confirmed by Team',
    'status_in_progress': 'Staff Assigned & Dispatched',
    'status_completed': 'Event Completed Successfully',
    'status_cancelled': 'Cancelled',
    'assigned_team': 'Assigned Catering Team',
    'gents_team_lead': 'Gents Staff Captain',
    'ladies_team_lead': 'Ladies Staff In-Charge',
    'download_receipt': 'Download Receipt Voucher',
    'cancel_booking': 'Cancel Reservation',

    // Vendor Portal & Admin
    'vendor_portal_title': 'Catering Vendor & Staff Portal',
    'add_new_service': 'Add New Service Package / Staff Team',
    'admin_dashboard_title': 'CaterPro Super Admin Panel',
    'total_bookings': 'Total Bookings',
    'total_revenue': 'Total Business (₹)',
    'active_gents_staff': 'Active Gents Staff',
    'active_ladies_staff': 'Active Ladies Staff',
    'registered_vendors': 'Registered Caterers',
    'approve_booking': 'Approve Booking',
    'assign_staff': 'Assign Staff Leads',
    'reviews_and_ratings': 'Customer Reviews & Feedback',
    'write_review': 'Write a Review',

    // Footer
    'footer_about': 'CaterPro is the premier catering and event staffing marketplace across Andhra Pradesh and Telangana connecting customers with verified cooks, gents and ladies serving staff.',
    'served_cities': 'Cities We Serve',
    'all_rights': 'All rights reserved.'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'te',
  setLang: () => {},
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('te'); // Default to Telugu as requested by user

  useEffect(() => {
    const saved = localStorage.getItem('caterpro_lang') as Language;
    if (saved && (saved === 'te' || saved === 'en')) {
      setLang(saved);
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('caterpro_lang', newLang);
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
