import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Users, 
  UserCheck, 
  ChefHat, 
  Utensils, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Printer, 
  MessageSquare, 
  ShieldCheck, 
  Percent,
  Plus,
  Minus,
  Wand2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ALL_MENU_ITEMS, EVENT_TYPES_LIST, POPULAR_LOCATIONS } from '../data/initialData';
import { MenuItem, QuotationDetails, EventType, VendorService, CateringStaffProfile } from '../types';

interface QuotationBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToBook: (quote: QuotationDetails) => void;
  initialService?: VendorService | null;
  initialStaff?: CateringStaffProfile | null;
  selectedMenuItems?: MenuItem[];
}

export const QuotationBuilderModal: React.FC<QuotationBuilderModalProps> = ({
  isOpen,
  onClose,
  onProceedToBook,
  initialService,
  initialStaff,
  selectedMenuItems = []
}) => {
  const { lang, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Event Details
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [eventDate, setEventDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [eventTime, setEventTime] = useState<string>('Lunch (11:30 AM - 3:30 PM)');
  const [location, setLocation] = useState<string>('Hyderabad / Secunderabad');
  const [guestCount, setGuestCount] = useState<number>(200);

  // Step 2: Staff Configuration
  const [gentsServers, setGentsServers] = useState<number>(4);
  const [gentsCooks, setGentsCooks] = useState<number>(2);
  const [gentsHelpers, setGentsHelpers] = useState<number>(2);
  const [gentsCleaning, setGentsCleaning] = useState<number>(2);

  const [ladiesServers, setLadiesServers] = useState<number>(3);
  const [ladiesHelpers, setLadiesHelpers] = useState<number>(2);
  const [ladiesHospitality, setLadiesHospitality] = useState<number>(2);
  const [ladiesCleaning, setLadiesCleaning] = useState<number>(1);

  // Step 3: Food Items
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);

  // Rates
  const GENTS_SERVER_RATE = 850;
  const GENTS_COOK_RATE = 1800;
  const GENTS_HELPER_RATE = 750;
  const GENTS_CLEANING_RATE = 650;

  const LADIES_SERVER_RATE = 850;
  const LADIES_HELPER_RATE = 750;
  const LADIES_HOSPITALITY_RATE = 950;
  const LADIES_CLEANING_RATE = 650;

  const BASE_FOOD_PER_PLATE = 320;

  // Initialize defaults
  useEffect(() => {
    if (selectedMenuItems && selectedMenuItems.length > 0) {
      setSelectedItems(selectedMenuItems);
    } else {
      // Default recommended popular items
      const defaults = ALL_MENU_ITEMS.filter(i => 
        ['m1', 'm6', 'm11', 'm18', 'm23', 'm28', 'm30', 'm34', 'm36', 'm46'].includes(i.id)
      );
      setSelectedItems(defaults);
    }

    if (initialStaff) {
      if (initialStaff.gender === 'gents') {
        setGentsServers(prev => Math.max(prev, 4));
        if (initialStaff.specialization.includes('Cook') || initialStaff.specialization.includes('Biryani')) {
          setGentsCooks(prev => Math.max(prev, 2));
        }
      } else {
        setLadiesServers(prev => Math.max(prev, 4));
        if (initialStaff.specialization.includes('Sweet') || initialStaff.specialization.includes('Bobbatlu')) {
          setLadiesHelpers(prev => Math.max(prev, 2));
        }
      }
    }

    if (initialService) {
      if (initialService.gentsStaffAvailable > 0) {
        setGentsServers(Math.min(initialService.gentsStaffAvailable, 6));
      }
      if (initialService.ladiesStaffAvailable > 0) {
        setLadiesServers(Math.min(initialService.ladiesStaffAvailable, 4));
      }
    }
  }, [initialService, initialStaff, selectedMenuItems]);

  // Auto-calculate recommended staff when guests change
  const handleAutoRecommendStaff = () => {
    const serversPer100 = 2;
    const recommendedGentsServers = Math.max(2, Math.round((guestCount / 100) * serversPer100));
    const recommendedGentsCooks = Math.max(1, Math.round(guestCount / 150));
    const recommendedGentsHelpers = Math.max(1, Math.round(guestCount / 150));
    const recommendedGentsCleaning = Math.max(1, Math.round(guestCount / 200));

    const recommendedLadiesServers = Math.max(2, Math.round((guestCount / 100) * 1.5));
    const recommendedLadiesHelpers = Math.max(1, Math.round(guestCount / 200));
    const recommendedLadiesHospitality = Math.max(1, Math.round(guestCount / 250));
    const recommendedLadiesCleaning = Math.max(1, Math.round(guestCount / 250));

    setGentsServers(recommendedGentsServers);
    setGentsCooks(recommendedGentsCooks);
    setGentsHelpers(recommendedGentsHelpers);
    setGentsCleaning(recommendedGentsCleaning);

    setLadiesServers(recommendedLadiesServers);
    setLadiesHelpers(recommendedLadiesHelpers);
    setLadiesHospitality(recommendedLadiesHospitality);
    setLadiesCleaning(recommendedLadiesCleaning);
  };

  const handleToggleItem = (item: MenuItem) => {
    if (selectedItems.some(i => i.id === item.id)) {
      setSelectedItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      setSelectedItems(prev => [...prev, item]);
    }
  };

  // Pricing calculations
  const extraPerPlate = selectedItems.reduce((acc, curr) => acc + (curr.priceExtra || 0), 0);
  const perPlateBase = BASE_FOOD_PER_PLATE + extraPerPlate;
  const foodCost = guestCount * perPlateBase;

  const gentsStaffCost = 
    (gentsServers * GENTS_SERVER_RATE) +
    (gentsCooks * GENTS_COOK_RATE) +
    (gentsHelpers * GENTS_HELPER_RATE) +
    (gentsCleaning * GENTS_CLEANING_RATE);

  const ladiesStaffCost = 
    (ladiesServers * LADIES_SERVER_RATE) +
    (ladiesHelpers * LADIES_HELPER_RATE) +
    (ladiesHospitality * LADIES_HOSPITALITY_RATE) +
    (ladiesCleaning * LADIES_CLEANING_RATE);

  const staffCost = gentsStaffCost + ladiesStaffCost;
  const setupCost = 2500; // standard chafing dish warmers, fuel & transport
  const subtotal = foodCost + staffCost + setupCost;
  const discount = Math.round(subtotal * 0.05); // 5% online booking discount
  const total = subtotal - discount;
  const advanceAmount = Math.round(total * 0.20); // 20% advance

  const currentQuote: QuotationDetails = {
    eventType,
    eventDate,
    eventTime,
    location,
    guestCount,
    gentsServers,
    gentsCooks,
    gentsHelpers,
    gentsCleaning,
    ladiesServers,
    ladiesHelpers,
    ladiesHospitality,
    ladiesCleaning,
    selectedItems,
    perPlateBase,
    foodCost,
    staffCost,
    setupCost,
    subtotal,
    discount,
    total,
    advanceAmount
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const summaryText = lang === 'te' ? 
`*CaterPro క్యాటరింగ్ కొటేషన్ సారాంశం:*
🎉 ఈవెంట్: ${eventType}
📅 తేదీ: ${eventDate} (${eventTime})
📍 ప్రదేశం: ${location}
👥 అతిథులు: ${guestCount} మంది

👨 *జెంట్స్ స్టాఫ్ (${gentsServers + gentsCooks + gentsHelpers + gentsCleaning}):* సర్వర్లు ${gentsServers}, కుక్స్ ${gentsCooks}, హెల్పర్లు ${gentsHelpers}
👩 *లేడీస్ స్టాఫ్ (${ladiesServers + ladiesHelpers + ladiesHospitality + ladiesCleaning}):* సర్వర్లు ${ladiesServers}, పిండివంటలు ${ladiesHelpers}, హోస్టెస్‌లు ${ladiesHospitality}

🍽️ *మెనూ ఐటమ్స్ (${selectedItems.length}):*
${selectedItems.map(i => `• ${i.nameTe}`).join('\n')}

💰 *బిల్లు వివరాలు:*
- ఫుడ్ చార్జ్ (₹${perPlateBase}/ప్లేట్): ₹${foodCost.toLocaleString('en-IN')}
- స్టాఫ్ చార్జీలు: ₹${staffCost.toLocaleString('en-IN')}
- మొత్తం బిల్లు: ₹${total.toLocaleString('en-IN')}
- అడ్వాన్స్ (20%): ₹${advanceAmount.toLocaleString('en-IN')}

CaterPro ద్వారా బుక్ చేయడానికి సంప్రదించండి!` :
`*CaterPro Catering Quotation Breakdown:*
🎉 Event: ${eventType}
📅 Date: ${eventDate} (${eventTime})
📍 Location: ${location}
👥 Guests: ${guestCount} pax

👨 *Gents Staff (${gentsServers + gentsCooks + gentsHelpers + gentsCleaning}):* Servers ${gentsServers}, Chefs ${gentsCooks}, Helpers ${gentsHelpers}
👩 *Ladies Staff (${ladiesServers + ladiesHelpers + ladiesHospitality + ladiesCleaning}):* Servers ${ladiesServers}, Sweet Makers ${ladiesHelpers}, Hostesses ${ladiesHospitality}

🍽️ *Menu Selected (${selectedItems.length} items):*
${selectedItems.map(i => `• ${i.nameEn}`).join('\n')}

💰 *Cost Breakdown:*
- Food (₹${perPlateBase}/plate): ₹${foodCost.toLocaleString('en-IN')}
- Staff Crew Charges: ₹${staffCost.toLocaleString('en-IN')}
- Grand Total: ₹${total.toLocaleString('en-IN')}
- Advance (20%): ₹${advanceAmount.toLocaleString('en-IN')}

Book via CaterPro App!`;

    const url = `https://wa.me/?text=${encodeURIComponent(summaryText)}`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D241E]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#FDFBF7] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#E8E2D9] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#2D241E] text-white px-5 py-4 flex items-center justify-between shrink-0 border-b border-[#4A3728]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E67E22] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {t('quote_builder_title')}
              </h2>
              <p className="text-xs text-[#FADBB9]">
                {lang === 'te' ? 'జెంట్స్ & లేడీస్ స్టాఫ్ + కస్టమ్ ఫుడ్ మెనూ' : 'Gents & Ladies Staff + Custom Food Menu'}
              </p>
            </div>
          </div>

          <button 
            id="close-quote-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#4A3728] hover:bg-[#7A6E63] text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="bg-white border-b border-[#E8E2D9] px-4 py-2.5 grid grid-cols-4 gap-2 text-center text-xs font-bold shrink-0">
          {[
            { num: 1, label: t('step_event') },
            { num: 2, label: t('step_staff') },
            { num: 3, label: t('step_menu') },
            { num: 4, label: t('step_summary') },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                currentStep === s.num
                  ? 'bg-[#E67E22] text-white shadow-xs'
                  : currentStep > s.num
                  ? 'bg-[#FFF4E8] text-[#E67E22] border border-[#FADBB9]'
                  : 'text-[#7A6E63] hover:bg-[#F5F1EB]'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black/15 flex items-center justify-center text-[10px]">
                {s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: EVENT DETAILS & GUESTS */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Event Type */}
                <div>
                  <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider mb-1.5">
                    {t('select_event_type')}
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full bg-white border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm font-semibold text-[#4A3728] focus:ring-2 focus:ring-[#E67E22]"
                  >
                    {EVENT_TYPES_LIST.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {lang === 'te' ? ev.nameTe : ev.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider mb-1.5">
                    {t('event_date')}
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-white border border-[#E8E2D9] rounded-xl px-3 py-2 text-sm font-semibold text-[#4A3728] focus:ring-2 focus:ring-[#E67E22]"
                  />
                </div>

                {/* Event Time Slot */}
                <div>
                  <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider mb-1.5">
                    {lang === 'te' ? 'సమయం / సెషన్ (Session Slot)' : 'Event Time / Session Slot'}
                  </label>
                  <select
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full bg-white border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm font-semibold text-[#4A3728] focus:ring-2 focus:ring-[#E67E22]"
                  >
                    <option value="Morning Breakfast (7:00 AM - 10:30 AM)">Morning Breakfast (7:00 AM - 10:30 AM)</option>
                    <option value="Lunch Feast (11:30 AM - 3:30 PM)">Grand Lunch Feast (11:30 AM - 3:30 PM)</option>
                    <option value="Evening High Tea (4:30 PM - 7:00 PM)">Evening High Tea & Snacks (4:30 PM - 7:00 PM)</option>
                    <option value="Dinner Buffet (7:00 PM - 11:00 PM)">Grand Dinner Buffet (7:00 PM - 11:00 PM)</option>
                    <option value="Full Day All Meals (24 Hours Service)">Full Day All Meals Service</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider mb-1.5">
                    {t('select_location')}
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm font-semibold text-[#4A3728] focus:ring-2 focus:ring-[#E67E22]"
                  >
                    {POPULAR_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.nameEn}>
                        {lang === 'te' ? loc.nameTe : loc.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Guest Count Slider Card */}
              <div className="bg-white border border-[#E8E2D9] rounded-2xl p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#4A3728]">
                      {t('approx_guests')}
                    </h3>
                    <p className="text-xs text-[#7A6E63]">
                      {lang === 'te' ? 'అతిథుల సంఖ్య ఆధారంగా స్టాఫ్ మరియు వంటకాలు లెక్కించబడతాయి' : 'Pricing & staff recommendations scale automatically'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#E67E22]">{guestCount}</span>
                    <span className="text-xs font-bold text-[#4A3728] ml-1">Pax</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={30}
                  max={3000}
                  step={20}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full accent-[#E67E22] h-2.5 bg-[#F5F1EB] rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[11px] font-bold text-[#7A6E63] mt-2">
                  <span>30 Guests (Small Party)</span>
                  <span>500 Guests (Grand Wedding)</span>
                  <span>3000+ Guests (Royal)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: GENTS & LADIES STAFF SELECTION */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Smart Auto-Suggest Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between bg-[#2D241E] text-white p-3.5 rounded-xl gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <Wand2 className="w-4 h-4 text-[#E67E22] shrink-0" />
                  <span>
                    {lang === 'te' 
                      ? `${guestCount} మంది అతిథులకు సరిపడా సిబ్బందిని ఆటోమేటిక్‌గా సెట్ చేయండి:` 
                      : `Auto-calculate recommended crew for ${guestCount} guests:`}
                  </span>
                </div>
                <button
                  onClick={handleAutoRecommendStaff}
                  className="bg-[#E67E22] hover:bg-[#D35400] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs whitespace-nowrap"
                >
                  ⚡ {lang === 'te' ? 'సిఫార్సు చేసిన స్టాఫ్ సెట్ చేయి' : 'Auto Recommend Crew'}
                </button>
              </div>

              {/* Gents Staff Section */}
              <div className="border border-[#E8E2D9] bg-white rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👨</span>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#4A3728]">
                        {t('gents_staff_heading')}
                      </h3>
                      <p className="text-[11px] text-[#7A6E63]">
                        {lang === 'te' ? 'బఫెట్ సర్వింగ్, భారీ వంటలు & డెగ్చీ సెటప్' : 'Buffet service, heavy cooking & equipment setup'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#4A3728] bg-[#F5F1EB] border border-[#E8E2D9] px-2.5 py-1 rounded-full">
                    {gentsServers + gentsCooks + gentsHelpers + gentsCleaning} {lang === 'te' ? 'జెంట్స్ స్టాఫ్' : 'Gents Crew'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Gents Servers */}
                  <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E8E2D9] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#4A3728]">{t('gents_servers_count')}</p>
                      <p className="text-[10px] text-[#7A6E63]">₹{GENTS_SERVER_RATE}/{t('per_day')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setGentsServers(Math.max(0, gentsServers - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-[#E8E2D9] hover:bg-[#F5F1EB] flex items-center justify-center font-bold text-[#4A3728]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-black text-sm text-[#4A3728]">{gentsServers}</span>
                      <button 
                        onClick={() => setGentsServers(gentsServers + 1)}
                        className="w-7 h-7 rounded-lg bg-[#E67E22] hover:bg-[#D35400] text-white flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Gents Cooks */}
                  <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E8E2D9] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#4A3728]">{t('gents_cooks_count')}</p>
                      <p className="text-[10px] text-[#7A6E63]">₹{GENTS_COOK_RATE}/{t('per_day')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setGentsCooks(Math.max(0, gentsCooks - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-[#E8E2D9] hover:bg-[#F5F1EB] flex items-center justify-center font-bold text-[#4A3728]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-black text-sm text-[#4A3728]">{gentsCooks}</span>
                      <button 
                        onClick={() => setGentsCooks(gentsCooks + 1)}
                        className="w-7 h-7 rounded-lg bg-[#E67E22] hover:bg-[#D35400] text-white flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Gents Helpers */}
                  <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E8E2D9] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#4A3728]">{t('gents_helpers_count')}</p>
                      <p className="text-[10px] text-[#7A6E63]">₹{GENTS_HELPER_RATE}/{t('per_day')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setGentsHelpers(Math.max(0, gentsHelpers - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-[#E8E2D9] hover:bg-[#F5F1EB] flex items-center justify-center font-bold text-[#4A3728]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-black text-sm text-[#4A3728]">{gentsHelpers}</span>
                      <button 
                        onClick={() => setGentsHelpers(gentsHelpers + 1)}
                        className="w-7 h-7 rounded-lg bg-[#E67E22] hover:bg-[#D35400] text-white flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Gents Cleaners */}
                  <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E8E2D9] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#4A3728]">{lang === 'te' ? 'డైనింగ్ & వెస్సల్ క్లీనర్లు' : 'Dining & Vessel Cleaners'}</p>
                      <p className="text-[10px] text-[#7A6E63]">₹{GENTS_CLEANING_RATE}/{t('per_day')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setGentsCleaning(Math.max(0, gentsCleaning - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-[#E8E2D9] hover:bg-[#F5F1EB] flex items-center justify-center font-bold text-[#4A3728]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-black text-sm text-[#4A3728]">{gentsCleaning}</span>
                      <button 
                        onClick={() => setGentsCleaning(gentsCleaning + 1)}
                        className="w-7 h-7 rounded-lg bg-[#E67E22] hover:bg-[#D35400] text-white flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ladies Staff Section */}
              <div className="border border-[#E8E2D9] bg-white rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👩</span>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#4A3728]">
                        {t('ladies_staff_heading')}
                      </h3>
                      <p className="text-[11px] text-[#7A6E63]">
                        {lang === 'te' ? 'పంక్తి భోజనాల వడ్డన, పిండివంటలు & సాంప్రదాయ ఆప్యాయత' : 'Traditional banana leaf dining, sweet making & guest welcome'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#4A3728] bg-[#F5F1EB] border border-[#E8E2D9] px-2.5 py-1 rounded-full">
                    {ladiesServers + ladiesHelpers + ladiesHospitality + ladiesCleaning} {lang === 'te' ? 'లేడీస్ స్టాఫ్' : 'Ladies Crew'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Ladies Servers */}
                  <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E8E2D9] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#4A3728]">{t('ladies_servers_count')}</p>
                      <p className="text-[10px] text-[#7A6E63]">₹{LADIES_SERVER_RATE}/{t('per_day')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setLadiesServers(Math.max(0, ladiesServers - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-[#E8E2D9] hover:bg-[#F5F1EB] flex items-center justify-center font-bold text-[#4A3728]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-black text-sm text-[#4A3728]">{ladiesServers}</span>
                      <button 
                        onClick={() => setLadiesServers(ladiesServers + 1)}
                        className="w-7 h-7 rounded-lg bg-[#E67E22] hover:bg-[#D35400] text-white flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Ladies Sweet / Kitchen Helpers */}
                  <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E8E2D9] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#4A3728]">{t('ladies_helpers_count')}</p>
                      <p className="text-[10px] text-[#7A6E63]">₹{LADIES_HELPER_RATE}/{t('per_day')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setLadiesHelpers(Math.max(0, ladiesHelpers - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-[#E8E2D9] hover:bg-[#F5F1EB] flex items-center justify-center font-bold text-[#4A3728]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-black text-sm text-[#4A3728]">{ladiesHelpers}</span>
                      <button 
                        onClick={() => setLadiesHelpers(ladiesHelpers + 1)}
                        className="w-7 h-7 rounded-lg bg-[#E67E22] hover:bg-[#D35400] text-white flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Ladies Hospitality Hostesses */}
                  <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E8E2D9] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#4A3728]">{t('ladies_hospitality_count')}</p>
                      <p className="text-[10px] text-[#7A6E63]">₹{LADIES_HOSPITALITY_RATE}/{t('per_day')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setLadiesHospitality(Math.max(0, ladiesHospitality - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-[#E8E2D9] hover:bg-[#F5F1EB] flex items-center justify-center font-bold text-[#4A3728]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-black text-sm text-[#4A3728]">{ladiesHospitality}</span>
                      <button 
                        onClick={() => setLadiesHospitality(ladiesHospitality + 1)}
                        className="w-7 h-7 rounded-lg bg-[#E67E22] hover:bg-[#D35400] text-white flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Ladies Cleaning */}
                  <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E8E2D9] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#4A3728]">{lang === 'te' ? 'డైనింగ్ హాల్ శానిటైజేషన్ సిబ్బంది' : 'Dining Area Sanitizers'}</p>
                      <p className="text-[10px] text-[#7A6E63]">₹{LADIES_CLEANING_RATE}/{t('per_day')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setLadiesCleaning(Math.max(0, ladiesCleaning - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-[#E8E2D9] hover:bg-[#F5F1EB] flex items-center justify-center font-bold text-[#4A3728]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-black text-sm text-[#4A3728]">{ladiesCleaning}</span>
                      <button 
                        onClick={() => setLadiesCleaning(ladiesCleaning + 1)}
                        className="w-7 h-7 rounded-lg bg-[#E67E22] hover:bg-[#D35400] text-white flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: CUSTOMIZE FOOD MENU */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#E8E2D9] shadow-xs">
                <div className="text-xs">
                  <span className="font-bold text-[#4A3728]">{selectedItems.length} {lang === 'te' ? 'వంటకాలు ఎంపిక చేయబడ్డాయి' : 'Items Selected'}</span>
                  <span className="text-[#7A6E63] ml-2">• Base ₹{BASE_FOOD_PER_PLATE} + Extra ₹{extraPerPlate} = <strong className="text-[#E67E22] font-extrabold">₹{perPlateBase}/plate</strong></span>
                </div>
                <span className="text-xs font-black text-[#E67E22]">
                  Total: ₹{foodCost.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {ALL_MENU_ITEMS.map((item) => {
                  const isSelected = selectedItems.some(i => i.id === item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleItem(item)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between select-none ${
                        isSelected
                          ? 'bg-[#E67E22] text-white border-[#E67E22] shadow-xs'
                          : 'bg-white hover:bg-[#FFF4E8] text-[#4A3728] border-[#E8E2D9]'
                      }`}
                    >
                      <div className="space-y-0.5 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${item.isVeg ? (isSelected ? 'bg-emerald-300' : 'bg-emerald-600') : (isSelected ? 'bg-red-300' : 'bg-red-600')}`}></span>
                          <span className="font-bold line-clamp-1">{lang === 'te' ? item.nameTe : item.nameEn}</span>
                        </div>
                        <p className={`text-[10px] ${isSelected ? 'text-amber-100' : 'text-[#7A6E63]'}`}>
                          {item.category.replace('_', ' ')} {item.priceExtra ? `(+₹${item.priceExtra})` : ''}
                        </p>
                      </div>

                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white text-[#E67E22]' : 'border border-[#E8E2D9]'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 font-bold" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: QUOTATION SUMMARY & FINAL BREAKDOWN */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Event & Staff Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-[#E8E2D9] shadow-xs">
                  <span className="text-[10px] text-[#7A6E63] block uppercase font-bold">{t('event_type')}</span>
                  <span className="font-bold text-[#4A3728]">{eventType}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E8E2D9] shadow-xs">
                  <span className="text-[10px] text-[#7A6E63] block uppercase font-bold">{t('event_date')}</span>
                  <span className="font-bold text-[#4A3728]">{eventDate}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E8E2D9] shadow-xs">
                  <span className="text-[10px] text-[#7A6E63] block uppercase font-bold">👨 {lang === 'te' ? 'జెంట్స్ స్టాఫ్' : 'Gents Crew'}</span>
                  <span className="font-bold text-[#4A3728]">{gentsServers + gentsCooks + gentsHelpers + gentsCleaning} Persons</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E8E2D9] shadow-xs">
                  <span className="text-[10px] text-[#7A6E63] block uppercase font-bold">👩 {lang === 'te' ? 'లేడీస్ స్టాఫ్' : 'Ladies Crew'}</span>
                  <span className="font-bold text-[#4A3728]">{ladiesServers + ladiesHelpers + ladiesHospitality + ladiesCleaning} Persons</span>
                </div>
              </div>

              {/* Selected Menu Pills */}
              <div className="bg-white p-3.5 rounded-xl border border-[#E8E2D9] shadow-xs">
                <p className="text-xs font-bold text-[#4A3728] mb-2">
                  🍽️ {lang === 'te' ? 'ఎంచుకున్న వంటకాల జాబితా' : 'Selected Menu Items'} ({selectedItems.length}):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItems.map((item) => (
                    <span key={item.id} className="bg-[#F5F1EB] border border-[#E8E2D9] text-[#4A3728] text-[11px] font-semibold px-2 py-0.5 rounded-md">
                      {lang === 'te' ? item.nameTe : item.nameEn}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Calculation Bill */}
              <div className="bg-[#2D241E] text-[#FDFBF7] rounded-2xl p-5 space-y-3 shadow-md border border-[#4A3728]">
                <h4 className="text-xs font-bold text-[#E67E22] uppercase tracking-widest border-b border-[#4A3728] pb-2">
                  {t('price_breakdown')}
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#E8E2D9]/80">
                    <span>{t('food_cost')} ({guestCount} Guests × ₹{perPlateBase}/plate)</span>
                    <span className="font-bold text-white">₹{foodCost.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-[#E8E2D9]/80">
                    <span>👨 {lang === 'te' ? 'జెంట్స్ స్టాఫ్ చార్జీలు' : 'Gents Crew Total Charges'}</span>
                    <span className="font-bold text-[#FADBB9]">₹{gentsStaffCost.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-[#E8E2D9]/80">
                    <span>👩 {lang === 'te' ? 'లేడీస్ స్టాఫ్ చార్జీలు' : 'Ladies Crew Total Charges'}</span>
                    <span className="font-bold text-[#FADBB9]">₹{ladiesStaffCost.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-[#E8E2D9]/80">
                    <span>{t('setup_cost')} (Buffet warmer setup, fuel & delivery)</span>
                    <span className="font-bold text-white">₹{setupCost.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-emerald-400 font-semibold pt-1 border-t border-[#4A3728]">
                    <span>🎉 {lang === 'te' ? 'CaterPro ఆన్‌లైన్ ఆఫర్ డిస్కౌంట్ (5%)' : 'Online Booking Discount (5%)'}</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Grand Total */}
                  <div className="flex justify-between items-baseline pt-2 border-t border-[#E67E22]/40 text-sm sm:text-base">
                    <span className="font-bold text-[#FADBB9]">{t('total_amount')}</span>
                    <span className="font-black text-xl sm:text-2xl text-[#E67E22]">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Advance vs Balance Box */}
                <div className="grid grid-cols-2 gap-3 bg-[#4A3728]/70 border border-[#7A6E63]/30 p-3 rounded-xl text-xs mt-3">
                  <div className="border-r border-[#7A6E63]/40 pr-2">
                    <span className="text-[10px] text-[#FADBB9] font-bold uppercase block">{t('advance_required')}</span>
                    <span className="text-base font-black text-emerald-400">₹{advanceAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#E8E2D9]/70 font-bold uppercase block">{t('balance_amount')}</span>
                    <span className="text-base font-bold text-white">₹{(total - advanceAmount).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Share & Print Quick Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-3 py-2 rounded-xl bg-white border border-[#E8E2D9] hover:bg-[#F5F1EB] text-[#4A3728] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#7A6E63]" />
                    <span>{t('download_quote')}</span>
                  </button>
                  <button
                    onClick={handleShareWhatsApp}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{lang === 'te' ? 'WhatsApp లో పంపండి' : 'Share on WhatsApp'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-[#E8E2D9] px-5 py-3.5 flex items-center justify-between shrink-0">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 rounded-xl border border-[#E8E2D9] text-[#4A3728] text-xs font-bold flex items-center gap-1.5 hover:bg-[#F5F1EB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? 'వెనుకకు (Back)' : 'Back'}</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-[#E67E22] hover:bg-[#D35400] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all hover:scale-105"
            >
              <span>{lang === 'te' ? 'తదుపరి దశ (Next Step)' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              id="confirm-quote-and-book-btn"
              onClick={() => {
                onProceedToBook(currentQuote);
              }}
              className="bg-[#E67E22] hover:bg-[#D35400] text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-105"
            >
              <Check className="w-4 h-4" />
              <span>{t('confirm_booking_btn')}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
