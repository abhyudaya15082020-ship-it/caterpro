import React, { useState, useEffect } from 'react';
import { 
  LanguageProvider, 
  useLanguage 
} from './context/LanguageContext';
import { 
  AuthProvider, 
  useAuth 
} from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { StaffShowcase } from './components/StaffShowcase';
import { ServiceCard } from './components/ServiceCard';
import { FoodMenuShowcase } from './components/FoodMenuShowcase';
import { QuotationBuilderModal } from './components/QuotationBuilderModal';
import { BookingModal } from './components/BookingModal';
import { BookingSuccessModal } from './components/BookingSuccessModal';
import { MyBookingsView } from './components/MyBookingsView';
import { VendorPortalView } from './components/VendorPortalView';
import { ReviewModal } from './components/ReviewModal';
import { Footer } from './components/Footer';
import { INITIAL_VENDOR_SERVICES, ALL_REVIEWS } from './data/initialData';
import { 
  VendorService, 
  CateringStaffProfile, 
  MenuItem, 
  QuotationDetails, 
  Booking, 
  Review 
} from './types';
import { 
  Sparkles, 
  Users, 
  UserCheck, 
  Utensils, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  ArrowRight,
  Filter,
  CalendarCheck
} from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

function MainAppContent() {
  const { lang, t } = useLanguage();
  const { profile } = useAuth();

  // Active view state
  const [activeTab, setActiveTab] = useState<'services' | 'staff' | 'menu' | 'bookings' | 'vendor'>('services');

  // Search & Filter State
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');

  // Services list (loaded from initial data + Firestore)
  const [services, setServices] = useState<VendorService[]>(INITIAL_VENDOR_SERVICES);

  // Modals state
  const [isQuoteOpen, setIsQuoteOpen] = useState<boolean>(false);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState<boolean>(false);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);

  // Selected entities for actions
  const [selectedService, setSelectedService] = useState<VendorService | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<CateringStaffProfile | null>(null);
  const [selectedMenuCart, setSelectedMenuCart] = useState<MenuItem[]>([]);
  const [activeQuote, setActiveQuote] = useState<QuotationDetails | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);

  // Listen to Firestore for any dynamic new vendor services added
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const servicesCol = collection(db, 'services');
      unsubscribe = onSnapshot(servicesCol, (snapshot) => {
        if (!snapshot.empty) {
          const list: VendorService[] = [];
          snapshot.forEach((doc) => {
            list.push(doc.data() as VendorService);
          });
          // Merge with initial data
          const merged = [...INITIAL_VENDOR_SERVICES];
          list.forEach(item => {
            if (!merged.some(m => m.serviceId === item.serviceId)) {
              merged.unshift(item);
            }
          });
          setServices(merged);
        }
      }, (err) => {
        console.warn('Firestore services snapshot fallback to initial data:', err);
      });
    } catch (e) {
      console.warn('Firestore init notice:', e);
    }
    return () => unsubscribe();
  }, []);

  // Filter services based on search criteria
  const filteredServices = services.filter((srv) => {
    const matchesCity = 
      selectedCity === 'all' || 
      srv.city.toLowerCase().includes(selectedCity.toLowerCase()) || 
      (selectedCity === 'Hyderabad' && srv.city.includes('Hyderabad'));

    const matchesType = 
      selectedServiceType === 'all' || 
      srv.serviceType === selectedServiceType;

    return matchesCity && matchesType;
  });

  // Handlers
  const handleOpenQuoteForService = (service: VendorService) => {
    setSelectedService(service);
    setSelectedStaff(null);
    setIsQuoteOpen(true);
  };

  const handleOpenBookingForService = (service: VendorService) => {
    setSelectedService(service);
    // Create a quick default quotation
    const defaultQuote: QuotationDetails = {
      eventType: 'wedding',
      eventDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      eventTime: 'Lunch (11:30 AM - 3:30 PM)',
      location: service.city,
      guestCount: 200,
      gentsServers: service.gentsStaffAvailable > 4 ? 4 : service.gentsStaffAvailable,
      gentsCooks: 2,
      gentsHelpers: 2,
      gentsCleaning: 2,
      ladiesServers: service.ladiesStaffAvailable > 3 ? 3 : service.ladiesStaffAvailable,
      ladiesHelpers: 2,
      ladiesHospitality: 2,
      ladiesCleaning: 1,
      selectedItems: [],
      perPlateBase: service.pricePerPlate,
      foodCost: service.pricePerPlate * 200,
      staffCost: 12500,
      setupCost: 2500,
      subtotal: (service.pricePerPlate * 200) + 15000,
      discount: Math.round(((service.pricePerPlate * 200) + 15000) * 0.05),
      total: Math.round(((service.pricePerPlate * 200) + 15000) * 0.95),
      advanceAmount: Math.round(((service.pricePerPlate * 200) + 15000) * 0.95 * 0.2)
    };
    setActiveQuote(defaultQuote);
    setIsBookingOpen(true);
  };

  const handleStaffSelectForQuote = (staff: CateringStaffProfile) => {
    setSelectedStaff(staff);
    setSelectedService(null);
    setIsQuoteOpen(true);
  };

  const handleAddMenuItemToQuote = (dish: MenuItem) => {
    if (!selectedMenuCart.some(i => i.id === dish.id)) {
      setSelectedMenuCart(prev => [...prev, dish]);
    }
  };

  const handleProceedQuoteToBooking = (quote: QuotationDetails) => {
    setActiveQuote(quote);
    setIsQuoteOpen(false);
    setIsBookingOpen(true);
  };

  const handleBookingConfirmed = (booking: Booking) => {
    setIsBookingOpen(false);
    setConfirmedBooking(booking);
    setIsSuccessOpen(true);
  };

  const handleServiceAdded = (newService: VendorService) => {
    setServices(prev => [newService, ...prev]);
  };

  const handleOpenReview = (booking: Booking) => {
    setSelectedBookingForReview(booking);
    setIsReviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D241E] flex flex-col font-sans selection:bg-[#E67E22] selection:text-white">
      
      {/* Top Navigation in Natural Tones */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuote={() => {
          setSelectedService(null);
          setSelectedStaff(null);
          setIsQuoteOpen(true);
        }}
      />

      {/* Main View Router */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME & SERVICES DIRECTORY */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            
            {/* Hero Search Engine */}
            <HeroSearch
              onOpenInstantQuote={() => {
                setSelectedService(null);
                setSelectedStaff(null);
                setIsQuoteOpen(true);
              }}
              onFilterApply={(city, serviceType, eventType) => {
                setSelectedCity(city);
                setSelectedServiceType(serviceType);
                setSelectedEventType(eventType);
                // Scroll to services list
                const element = document.getElementById('services-grid-anchor');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* Specialized Gents & Ladies Staff Showcase Section */}
            <StaffShowcase
              onSelectStaffToQuote={handleStaffSelectForQuote}
            />

            {/* Verified Catering Teams Grid (Natural Tones Grid) */}
            <section id="services-grid-anchor" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4E8] border border-[#FADBB9] text-[#E67E22] text-xs font-bold mb-2 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E67E22]" />
                    <span>{lang === 'te' ? 'ధృవీకరించబడిన క్యాటరర్లు & సర్వీస్ ప్రొవైడర్లు' : 'Verified Catering & Event Teams'}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#4A3728] tracking-tight">
                    {t('catering_packages_title')}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#7A6E63] mt-1">
                    {lang === 'te' 
                      ? 'పూర్తి క్యాటరింగ్, లైవ్ కౌంటర్లు మరియు నైపుణ్యం గల జెంట్స్/లేడీస్ సిబ్బందితో కూడిన ప్యాకేజీలు.' 
                      : 'Explore full wedding banquets, vegetarian feasts, and dedicated staff agencies.'}
                  </p>
                </div>

                {/* Quick Count Badge */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-bold text-[#4A3728] bg-white border border-[#E8E2D9] px-3.5 py-1.5 rounded-xl shadow-xs">
                    {filteredServices.length} {lang === 'te' ? 'క్యాటరింగ్ సర్వీసెస్ అందుబాటులో ఉన్నాయి' : 'Services Found'}
                  </span>
                </div>
              </div>

              {/* Grid of Catering Services */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.serviceId}
                    service={service}
                    onOpenQuoteForService={handleOpenQuoteForService}
                    onOpenBookingForService={handleOpenBookingForService}
                  />
                ))}
              </div>

              {filteredServices.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#E8E2D9] p-6 space-y-3">
                  <Utensils className="w-12 h-12 text-[#7A6E63] mx-auto" />
                  <p className="text-[#4A3728] font-bold text-sm">
                    {lang === 'te' ? 'ఎంచుకున్న ఫిల్టర్‌లకు సరిపోయే క్యాటరింగ్ సర్వీసెస్ కనుగొనబడలేదు' : 'No catering services match your active filters'}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCity('all');
                      setSelectedServiceType('all');
                      setSelectedEventType('all');
                    }}
                    className="text-xs font-bold text-[#E67E22] underline hover:text-[#D35400]"
                  >
                    {lang === 'te' ? 'అన్ని ఫిల్టర్‌లను తొలగించండి' : 'Reset all filters'}
                  </button>
                </div>
              )}

            </section>

            {/* Food Menu Catalog Section */}
            <FoodMenuShowcase
              onAddMenuItemToQuote={handleAddMenuItemToQuote}
              onOpenFullQuote={() => {
                setSelectedService(null);
                setSelectedStaff(null);
                setIsQuoteOpen(true);
              }}
            />

            {/* Why Choose CaterPro Trust Banner in Warm Natural Espresso (#2D241E) */}
            <section className="py-14 bg-[#2D241E] text-[#FDFBF7] border-y border-[#4A3728]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-10">
                  <span className="text-[#E67E22] text-xs font-bold tracking-widest uppercase block mb-2">
                    {lang === 'te' ? 'మా నాణ్యతా ప్రమాణాలు' : 'Why Clients Trust CaterPro'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {lang === 'te' ? 'శుభకార్యం ఏదైనా.. తిరుగులేని క్యాటరింగ్ & సర్వీస్ బాధ్యత మాది' : 'Flawless Catering & Professional Staff for Every Celebration'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                  <div className="bg-[#4A3728]/70 border border-[#7A6E63]/30 rounded-2xl p-5 space-y-2.5 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F1EB] text-2xl flex items-center justify-center font-bold">
                      👨
                    </div>
                    <h4 className="font-bold text-sm text-white">
                      {lang === 'te' ? 'నైపుణ్యం గల జెంట్స్ సిబ్బంది' : 'Trained Gents Crew'}
                    </h4>
                    <p className="text-[#E8E2D9]/80 leading-relaxed">
                      {lang === 'te' ? 'భారీ డెగ్చీ వంటలు, బిర్యానీ ఉస్తాద్‌లు, వేగవంతమైన బఫెట్ సర్వింగ్ & సెటప్.' : 'Master Biryani chefs, heavy cooking vessels, rapid buffet refill & event setup.'}
                    </p>
                  </div>

                  <div className="bg-[#4A3728]/70 border border-[#7A6E63]/30 rounded-2xl p-5 space-y-2.5 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F1EB] text-2xl flex items-center justify-center font-bold">
                      👩
                    </div>
                    <h4 className="font-bold text-sm text-white">
                      {lang === 'te' ? 'ఆప్యాయతతో కూడిన లేడీస్ సిబ్బంది' : 'Traditional Ladies Crew'}
                    </h4>
                    <p className="text-[#E8E2D9]/80 leading-relaxed">
                      {lang === 'te' ? 'సాంప్రదాయ అరిటాకు భోజనాలు, వేడి వేడి బొబ్బట్లు/స్వీట్స్ మేకింగ్ & అతిథి మర్యాదలు.' : 'Warm banana leaf dining hospitality, live hot Bobbatlu, sweet makers & guest care.'}
                    </p>
                  </div>

                  <div className="bg-[#4A3728]/70 border border-[#7A6E63]/30 rounded-2xl p-5 space-y-2.5 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF4E8] text-[#E67E22] text-2xl flex items-center justify-center font-bold">
                      ⚡
                    </div>
                    <h4 className="font-bold text-sm text-white">
                      {lang === 'te' ? 'తక్షణ కొటేషన్ & బెస్ట్ ప్రైస్' : 'Instant Transparent Quotes'}
                    </h4>
                    <p className="text-[#E8E2D9]/80 leading-relaxed">
                      {lang === 'te' ? 'దాచిన ఛార్జీలు లేవు. అతిథుల సంఖ్యను బట్టి తక్షణమే పక్కాగా బిల్లు లెక్కింపు.' : 'No hidden costs. Dynamic accurate pricing based on guests and staff requirements.'}
                    </p>
                  </div>

                  <div className="bg-[#4A3728]/70 border border-[#7A6E63]/30 rounded-2xl p-5 space-y-2.5 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 text-2xl flex items-center justify-center font-bold border border-emerald-800/40">
                      🛡️
                    </div>
                    <h4 className="font-bold text-sm text-white">
                      {lang === 'te' ? '100% ఆన్-టైమ్ గ్యారెంటీ' : '100% On-Time Guarantee'}
                    </h4>
                    <p className="text-[#E8E2D9]/80 leading-relaxed">
                      {lang === 'te' ? 'ఈవెంట్ సమయానికి 2 గంటల ముందే యూనిఫాం సిబ్బంది వేదిక వద్ద హాజరవుతారు.' : 'Uniformed staff arrives 2 hours prior with complete setup readiness.'}
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* Client Testimonials Section */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-[#E67E22] text-xs font-bold uppercase tracking-wider block mb-1">
                  {lang === 'te' ? 'వినియోగదారుల స్పందనలు' : 'Client Success Stories'}
                </span>
                <h3 className="text-2xl font-black text-[#4A3728]">
                  {lang === 'te' ? 'మా సేవలను పొందిన ప్రముఖుల అనుభవాలు' : 'What Families Say About CaterPro'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {ALL_REVIEWS.map((rev) => (
                  <div
                    key={rev.reviewId}
                    className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#E67E22] text-[#E67E22]" />
                          ))}
                        </div>
                        <span className="text-[10px] text-[#7A6E63]">{rev.eventDate}</span>
                      </div>

                      <p className="text-xs text-[#4A3728] leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E8E2D9] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FFF4E8] text-[#E67E22] border border-[#FADBB9] font-bold flex items-center justify-center text-xs">
                        {rev.userName[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#4A3728]">{rev.userName}</p>
                        <p className="text-[10px] text-emerald-700 font-semibold">✓ Verified Telugu Event Booking</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: SPECIALIZED STAFF SHOWCASE */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <StaffShowcase
              onSelectStaffToQuote={handleStaffSelectForQuote}
            />
          </div>
        )}

        {/* VIEW 3: FOOD MENU BROWSER */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <FoodMenuShowcase
              onAddMenuItemToQuote={handleAddMenuItemToQuote}
              onOpenFullQuote={() => {
                setSelectedService(null);
                setSelectedStaff(null);
                setIsQuoteOpen(true);
              }}
            />
          </div>
        )}

        {/* VIEW 4: MY BOOKINGS & LIVE TRACKING */}
        {activeTab === 'bookings' && (
          <MyBookingsView
            onOpenNewQuote={() => {
              setSelectedService(null);
              setSelectedStaff(null);
              setIsQuoteOpen(true);
            }}
            onOpenReviewModal={handleOpenReview}
          />
        )}

        {/* VIEW 5: VENDOR & STAFF AGENCY PORTAL */}
        {activeTab === 'vendor' && (
          <VendorPortalView
            onServiceAdded={handleServiceAdded}
            vendorServices={services}
          />
        )}

      </main>

      {/* Floating Instant Quote & Help Hotline Bar */}
      <div className="sticky bottom-4 z-40 max-w-xl mx-auto px-4 w-full">
        <div className="bg-[#2D241E] text-white p-2.5 rounded-2xl shadow-2xl border border-[#4A3728] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 pl-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E67E22] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E67E22]"></span>
            </span>
            <div className="text-xs">
              <span className="font-bold block leading-none text-white">
                {lang === 'te' ? 'లైవ్ కొటేషన్ కాలిక్యులేటర్' : 'Smart Event Calculator'}
              </span>
              <span className="text-[10px] text-[#FADBB9]">
                {lang === 'te' ? 'జెంట్స్ + లేడీస్ సిబ్బంది' : 'Gents & Ladies Staff Ready'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href="tel:+919876543210"
              className="p-2 rounded-xl bg-[#4A3728] hover:bg-[#7A6E63] text-white transition-colors"
              title="Call Catering Specialist"
            >
              <PhoneCall className="w-4 h-4 text-[#E67E22]" />
            </a>

            <button
              id="sticky-instant-quote-btn"
              onClick={() => {
                setSelectedService(null);
                setSelectedStaff(null);
                setIsQuoteOpen(true);
              }}
              className="bg-[#E67E22] hover:bg-[#D35400] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-100" />
              <span>{t('instant_quote_btn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuotationBuilderModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        onProceedToBook={handleProceedQuoteToBooking}
        initialService={selectedService}
        initialStaff={selectedStaff}
        selectedMenuItems={selectedMenuCart}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        quote={activeQuote}
        service={selectedService}
        onBookingSuccess={handleBookingConfirmed}
      />

      <BookingSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        booking={confirmedBooking}
        onViewMyBookings={() => {
          setIsSuccessOpen(false);
          setActiveTab('bookings');
        }}
      />

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        booking={selectedBookingForReview}
        onReviewSubmitted={(newRev) => {
          // Review submitted
        }}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
