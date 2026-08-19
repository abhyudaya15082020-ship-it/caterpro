import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Star, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Phone, 
  Shirt, 
  CheckCircle2, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { STAFF_PROFILES } from '../data/initialData';
import { CateringStaffProfile } from '../types';

interface StaffShowcaseProps {
  onSelectStaffToQuote: (staff: CateringStaffProfile) => void;
}

export const StaffShowcase: React.FC<StaffShowcaseProps> = ({ onSelectStaffToQuote }) => {
  const { lang, t } = useLanguage();
  const [selectedGender, setSelectedGender] = useState<'all' | 'gents' | 'ladies'>('all');

  const filteredStaff = STAFF_PROFILES.filter(
    s => selectedGender === 'all' || s.gender === selectedGender
  );

  return (
    <section id="staff-showcase-section" className="py-10 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header in Natural Tones */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF4E8] border border-[#FADBB9] text-[#E67E22] text-xs font-bold mb-3 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-[#E67E22]" />
            <span>{lang === 'te' ? 'జెంట్స్ & లేడీస్ స్పెషలైజ్డ్ స్టాఫ్' : 'Specialized Gents & Ladies Crew'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#4A3728] tracking-tight">
            {t('staff_showcase_title')}
          </h2>
          <p className="text-sm text-[#7A6E63] mt-2">
            {t('staff_showcase_sub')}
          </p>

          {/* Gender Filter Buttons */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              id="staff-filter-all"
              onClick={() => setSelectedGender('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                selectedGender === 'all'
                  ? 'bg-[#2D241E] text-white'
                  : 'bg-white text-[#4A3728] hover:bg-[#F5F1EB] border border-[#E8E2D9]'
              }`}
            >
              {lang === 'te' ? 'అందరు సిబ్బంది (All Staff)' : 'All Staff'} ({STAFF_PROFILES.length})
            </button>
            <button
              id="staff-filter-gents"
              onClick={() => setSelectedGender('gents')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                selectedGender === 'gents'
                  ? 'bg-[#E67E22] text-white'
                  : 'bg-white text-[#4A3728] hover:bg-[#FFF4E8] border border-[#E8E2D9]'
              }`}
            >
              <span>👨</span>
              <span>{lang === 'te' ? 'జెంట్స్ స్టాఫ్ (Gents Staff)' : 'Gents Staff'}</span>
            </button>
            <button
              id="staff-filter-ladies"
              onClick={() => setSelectedGender('ladies')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                selectedGender === 'ladies'
                  ? 'bg-[#E67E22] text-white'
                  : 'bg-white text-[#4A3728] hover:bg-[#FFF4E8] border border-[#E8E2D9]'
              }`}
            >
              <span>👩</span>
              <span>{lang === 'te' ? 'లేడీస్ స్టాఫ్ (Ladies Staff)' : 'Ladies Staff'}</span>
            </button>
          </div>
        </div>

        {/* Dual Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          
          {/* Gents Banner */}
          <div className="bg-[#2D241E] text-[#FDFBF7] rounded-3xl p-6 shadow-sm border border-[#4A3728] relative overflow-hidden">
            <div className="relative z-10 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👨</span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {t('gents_staff_heading')}
                </h3>
              </div>
              <p className="text-xs text-[#E8E2D9] leading-relaxed">
                {t('gents_staff_desc')}
              </p>
              <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-semibold text-[#FADBB9]">
                <span className="bg-[#4A3728]/80 px-2.5 py-1 rounded-lg border border-[#7A6E63]/30">✓ Buffet Servers</span>
                <span className="bg-[#4A3728]/80 px-2.5 py-1 rounded-lg border border-[#7A6E63]/30">✓ Biryani Ustads</span>
                <span className="bg-[#4A3728]/80 px-2.5 py-1 rounded-lg border border-[#7A6E63]/30">✓ Vessel Helpers</span>
                <span className="bg-[#4A3728]/80 px-2.5 py-1 rounded-lg border border-[#7A6E63]/30">✓ Event Setup</span>
              </div>
            </div>
          </div>

          {/* Ladies Banner */}
          <div className="bg-[#4A3728] text-[#FDFBF7] rounded-3xl p-6 shadow-sm border border-[#7A6E63]/30 relative overflow-hidden">
            <div className="relative z-10 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👩</span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {t('ladies_staff_heading')}
                </h3>
              </div>
              <p className="text-xs text-[#E8E2D9] leading-relaxed">
                {t('ladies_staff_desc')}
              </p>
              <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-semibold text-[#FADBB9]">
                <span className="bg-[#2D241E]/70 px-2.5 py-1 rounded-lg border border-[#7A6E63]/30">✓ Traditional Dining Servers</span>
                <span className="bg-[#2D241E]/70 px-2.5 py-1 rounded-lg border border-[#7A6E63]/30">✓ Bobbatlu & Sweets</span>
                <span className="bg-[#2D241E]/70 px-2.5 py-1 rounded-lg border border-[#7A6E63]/30">✓ Hospitality Hostesses</span>
                <span className="bg-[#2D241E]/70 px-2.5 py-1 rounded-lg border border-[#7A6E63]/30">✓ Kitchen Pre-Prep</span>
              </div>
            </div>
          </div>

        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredStaff.map((staff) => {
            const isGents = staff.gender === 'gents';
            return (
              <div
                key={staff.id}
                id={`staff-card-${staff.id}`}
                className="bg-white rounded-2xl border border-[#E8E2D9] hover:border-[#E67E22] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
              >
                {/* Photo & Badge */}
                <div className="relative h-44 overflow-hidden bg-[#F5F1EB]">
                  <img
                    src={staff.photoUrl}
                    alt={staff.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D241E]/90 via-transparent to-transparent"></div>
                  
                  {/* Gender Tag */}
                  <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs ${
                    isGents 
                      ? 'bg-[#2D241E] text-white border border-[#7A6E63]/40' 
                      : 'bg-[#4A3728] text-white border border-[#7A6E63]/40'
                  }`}>
                    {isGents ? '👨 Gents Crew' : '👩 Ladies Crew'}
                  </span>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#FFF4E8] text-[#E67E22] border border-[#FADBB9] px-2 py-0.5 rounded-md text-[11px] font-black shadow-xs">
                    <Star className="w-3 h-3 fill-[#E67E22]" />
                    <span>{staff.rating}</span>
                  </div>

                  {/* Name overlay */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h4 className="font-bold text-sm leading-snug drop-shadow-xs">{staff.name}</h4>
                    <p className="text-[11px] text-[#FADBB9] font-medium line-clamp-1">
                      {lang === 'te' ? staff.roleTe : staff.role}
                    </p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  
                  <div className="space-y-2 text-xs">
                    {/* Experience & Availability */}
                    <div className="flex items-center justify-between text-[#7A6E63] text-[11px]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#7A6E63]" />
                        <strong className="text-[#4A3728]">{staff.experienceYears}+</strong> {t('exp_years')}
                      </span>
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {lang === 'te' ? 'అందుబాటులో ఉంది' : 'Available'}
                      </span>
                    </div>

                    {/* Uniform info */}
                    <div className="flex items-start gap-1.5 text-[#4A3728] bg-[#F5F1EB] p-2 rounded-xl text-[11px]">
                      <Shirt className="w-3.5 h-3.5 text-[#E67E22] shrink-0 mt-0.5" />
                      <span className="line-clamp-1"><strong>Uniform:</strong> {staff.uniformColor}</span>
                    </div>

                    {/* Specialties */}
                    <p className="text-[#7A6E63] text-[11px] line-clamp-2 leading-relaxed italic">
                      "{lang === 'te' ? staff.specialtyTe : staff.specialty}"
                    </p>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-2.5 border-t border-[#E8E2D9] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#7A6E63] font-bold uppercase tracking-wider block">
                        {lang === 'te' ? 'రోజు వారి రేటు' : 'Daily Rate'}
                      </span>
                      <span className="text-sm font-black text-[#E67E22]">
                        ₹{staff.dailyRate} <span className="text-[10px] font-normal text-[#7A6E63]">/{t('per_day')}</span>
                      </span>
                    </div>

                    <button
                      id={`book-staff-btn-${staff.id}`}
                      onClick={() => onSelectStaffToQuote(staff)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 bg-[#2D241E] hover:bg-[#4A3728] text-white shadow-xs transition-transform hover:scale-105"
                    >
                      <span>{lang === 'te' ? 'బుక్ చేయండి' : 'Hire Staff'}</span>
                      <ArrowRight className="w-3 h-3 text-[#E67E22]" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
