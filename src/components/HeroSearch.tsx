import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar as CalendarIcon, 
  Users, 
  Sparkles, 
  ChefHat, 
  UserCheck, 
  UtensilsCrossed, 
  SprayCan,
  PartyPopper
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { POPULAR_LOCATIONS, EVENT_TYPES_LIST } from '../data/initialData';

interface HeroSearchProps {
  onOpenInstantQuote: () => void;
  onFilterApply: (city: string, serviceType: string, eventType: string) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onOpenInstantQuote,
  onFilterApply
}) => {
  const { lang, t } = useLanguage();

  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [guestCount, setGuestCount] = useState<number>(200);

  const mainCategories = [
    { id: 'gents_staff', labelTe: 'జెంట్స్ స్టాఫ్', labelEn: 'Gents Staff', icon: '👨' },
    { id: 'ladies_staff', labelTe: 'లేడీస్ స్టాఫ్', labelEn: 'Ladies Staff', icon: '👩' },
    { id: 'full_catering', labelTe: 'ఫుల్ క్యాటరింగ్', labelEn: 'Food Catering', icon: '🍛' },
    { id: 'cooks_only', labelTe: 'మాస్టర్ కుక్స్', labelEn: 'Pro Cooks', icon: '👨‍🍳' },
    { id: 'cleaning', labelTe: 'క్లీనింగ్ & సెటప్', labelEn: 'Cleaning', icon: '🧹' },
    { id: 'all', labelTe: 'అన్ని సర్వీసెస్', labelEn: 'All Services', icon: '🎉' },
  ];

  const handleApplyFilter = (city = selectedCity, sType = selectedServiceType, eType = selectedEventType) => {
    onFilterApply(city, sType, eType);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      
      {/* Natural Tones Hero Banner (#FFF4E8 with #FADBB9 border) */}
      <div className="bg-[#FFF4E8] rounded-3xl p-6 sm:p-10 border border-[#FADBB9] relative overflow-hidden shadow-xs">
        
        {/* Subtle Background Decorative Watermark */}
        <div className="absolute right-[-20px] top-[-20px] opacity-10 text-[180px] font-black select-none pointer-events-none text-[#4A3728]">
          CATER
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          
          {/* Natural Tone Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F1EB] border border-[#E8E2D9] text-[#4A3728] text-xs font-bold shadow-2xs">
            <span className="text-[#E67E22]">📍</span>
            <span>{lang === 'te' ? 'తెలంగాణ & ఆంధ్రప్రదేశ్ స్పెషలైజ్డ్ క్యాటరింగ్' : 'AP & Telangana Verified Catering & Staffing'}</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-[#4A3728] tracking-tight">
            {lang === 'te' ? (
              <>
                మీ వేడుకకు కావాల్సిన Catering & Staff...<br />
                <span className="text-[#E67E22]">ఒక్క Appలో!</span>
              </>
            ) : (
              <>
                Everything your Celebration needs...<br />
                <span className="text-[#E67E22]">In One Unified App!</span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#7A6E63] max-w-2xl leading-relaxed">
            {lang === 'te' 
              ? 'నైపుణ్యం గల జెంట్స్ మరియు లేడీస్ క్యాటరింగ్ సిబ్బంది, రుచికరమైన సాంప్రదాయ వంటకాలు & తక్షణ కొటేషన్ లెక్కింపు.' 
              : 'Hire verified Gents buffet servers, Master chefs, and authentic Ladies dining hospitality staff.'}
          </p>

          {/* Quick Search & Filter Controls Container */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E2D9] shadow-md mt-6 space-y-4 text-left">
            
            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              
              {/* Location Selector */}
              <div>
                <label className="block text-[11px] font-bold text-[#7A6E63] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E67E22]" />
                  <span>{t('location')}</span>
                </label>
                <select
                  id="hero-city-select"
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    handleApplyFilter(e.target.value, selectedServiceType, selectedEventType);
                  }}
                  className="w-full bg-[#F5F1EB] border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-xs font-bold text-[#4A3728] focus:ring-2 focus:ring-[#E67E22] focus:bg-white"
                >
                  <option value="all">{lang === 'te' ? 'అన్ని నగరాలు (All Cities)' : 'All Locations'}</option>
                  {POPULAR_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.nameEn}>
                      {lang === 'te' ? loc.nameTe : loc.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Type Selector */}
              <div>
                <label className="block text-[11px] font-bold text-[#7A6E63] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#E67E22]" />
                  <span>{t('service_type')}</span>
                </label>
                <select
                  id="hero-service-type-select"
                  value={selectedServiceType}
                  onChange={(e) => {
                    setSelectedServiceType(e.target.value);
                    handleApplyFilter(selectedCity, e.target.value, selectedEventType);
                  }}
                  className="w-full bg-[#F5F1EB] border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-xs font-bold text-[#4A3728] focus:ring-2 focus:ring-[#E67E22] focus:bg-white"
                >
                  <option value="all">{lang === 'te' ? 'అన్ని కేటగిరీలు' : 'All Categories'}</option>
                  <option value="gents_staff">👨 Gents Staff Crew</option>
                  <option value="ladies_staff">👩 Ladies Staff Crew</option>
                  <option value="full_catering">🍛 Full Food Catering</option>
                  <option value="cooks_only">👨‍🍳 Master Chefs Only</option>
                  <option value="cleaning">🧹 Post-Event Cleaning</option>
                </select>
              </div>

              {/* Guests Selector */}
              <div>
                <label className="block text-[11px] font-bold text-[#7A6E63] uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#E67E22]" />
                    <span>{t('guest_count')}</span>
                  </span>
                  <strong className="text-[#E67E22] font-black">{guestCount} Pax</strong>
                </label>
                <input
                  id="hero-guest-range"
                  type="range"
                  min={30}
                  max={2500}
                  step={25}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full accent-[#E67E22] h-2 bg-[#F5F1EB] rounded-lg cursor-pointer mt-2"
                />
              </div>

              {/* Instant Quote Calculator CTA */}
              <div className="sm:col-span-3 lg:col-span-1 flex items-end">
                <button
                  id="hero-instant-quote-trigger-btn"
                  onClick={onOpenInstantQuote}
                  className="w-full h-10 bg-[#E67E22] hover:bg-[#D35400] text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4 text-amber-100" />
                  <span>{t('instant_quote_btn')}</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* 6 Quick Category Cards Bar (Matching Design Template) */}
      <div className="mt-6">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-[#4A3728]">
            {lang === 'te' ? 'ప్రధాన విభాగాలు (Main Categories)' : 'Main Categories'}
          </h3>
          <button
            onClick={() => handleApplyFilter('all', 'all', 'all')}
            className="text-[#E67E22] hover:underline font-bold text-xs"
          >
            {lang === 'te' ? 'అన్నీ చూపించు (View All)' : 'View All Categories'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {mainCategories.map((cat) => {
            const isSelected = selectedServiceType === cat.id;
            return (
              <div
                key={cat.id}
                id={`category-card-${cat.id}`}
                onClick={() => {
                  setSelectedServiceType(cat.id);
                  handleApplyFilter(selectedCity, cat.id, selectedEventType);
                }}
                className={`bg-white p-4 rounded-2xl border transition-all flex flex-col items-center gap-2.5 cursor-pointer shadow-xs select-none ${
                  isSelected
                    ? 'border-[#E67E22] ring-2 ring-[#E67E22]/20 bg-[#FFF4E8]'
                    : 'border-[#E8E2D9] hover:border-[#E67E22] hover:bg-[#FDFBF7]'
                }`}
              >
                <div className="w-13 h-13 bg-[#F5F1EB] rounded-2xl flex items-center justify-center text-2xl shadow-2xs">
                  {cat.icon}
                </div>
                <span className={`text-xs font-bold text-center leading-snug ${isSelected ? 'text-[#E67E22]' : 'text-[#4A3728]'}`}>
                  {lang === 'te' ? cat.labelTe : cat.labelEn}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
