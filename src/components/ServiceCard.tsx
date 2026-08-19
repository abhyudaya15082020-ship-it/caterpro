import React from 'react';
import { 
  Star, 
  MapPin, 
  Users, 
  UserCheck, 
  Utensils, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { VendorService } from '../types';

interface ServiceCardProps {
  service: VendorService;
  onOpenQuoteForService: (service: VendorService) => void;
  onOpenBookingForService: (service: VendorService) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onOpenQuoteForService,
  onOpenBookingForService
}) => {
  const { lang, t } = useLanguage();

  return (
    <div 
      id={`service-card-${service.serviceId}`}
      className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5 flex flex-col justify-between gap-3.5 shadow-xs hover:border-[#E67E22] hover:shadow-md transition-all relative group"
    >
      {/* Verified Tag Top Right */}
      {service.isVerified && (
        <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-2xs z-10">
          <ShieldCheck className="w-3 h-3" />
          <span>VERIFIED</span>
        </div>
      )}

      {/* Top Header & Photo Thumbnail */}
      <div className="flex gap-3">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F5F1EB] shrink-0 border border-[#E8E2D9]">
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex-1 min-w-0 pr-16">
          <span className="text-[10px] font-bold text-[#E67E22] uppercase tracking-wider block">
            {lang === 'te' && service.vendorNameTe ? service.vendorNameTe : service.vendorName}
          </span>
          <h4 className="font-bold text-base text-[#4A3728] leading-tight line-clamp-1">
            {lang === 'te' && service.titleTe ? service.titleTe : service.title}
          </h4>
          <p className="text-xs text-[#7A6E63] line-clamp-1 mt-0.5">
            {lang === 'te' && service.descriptionTe ? service.descriptionTe : service.description}
          </p>
        </div>
      </div>

      {/* 2x2 Information Grid */}
      <div className="grid grid-cols-2 gap-2 text-[11px] font-medium bg-[#F5F1EB] p-2.5 rounded-xl border border-[#E8E2D9]/60">
        <div className="flex items-center gap-1.5 text-[#4A3728]">
          <span className="text-sm">👨</span> 
          <span><strong>{service.gentsStaffAvailable}</strong> Gents Staff</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#4A3728]">
          <span className="text-sm">👩</span> 
          <span><strong>{service.ladiesStaffAvailable}</strong> Ladies Staff</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#4A3728]">
          <span className="text-[#E67E22]">⭐</span> 
          <span><strong className="text-[#4A3728]">{service.rating}</strong> ({service.reviewsCount} reviews)</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#4A3728]">
          <span className="text-[#E67E22]">📍</span> 
          <span className="truncate">{service.city}</span>
        </div>
      </div>

      {/* Specialties Tag */}
      <div className="text-[11px] text-[#7A6E63] italic bg-[#FFF4E8] px-2.5 py-1.5 rounded-lg border border-[#FADBB9] line-clamp-1">
        ✨ {lang === 'te' && service.specialtiesTe ? service.specialtiesTe : service.specialties}
      </div>

      {/* Pricing & Contact & Booking Action Row */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D9]">
        <div>
          <span className="text-[10px] font-bold text-[#7A6E63] uppercase tracking-wider block">
            {service.serviceType === 'full_catering' ? 'Food Price' : 'Staff Rate'}
          </span>
          <div className="text-lg font-black text-[#E67E22] leading-none">
            ₹{service.serviceType === 'full_catering' ? service.pricePerPlate : service.pricePerStaffDay}{' '}
            <span className="text-xs font-normal text-[#7A6E63]">
              /{service.serviceType === 'full_catering' ? (lang === 'te' ? 'ప్లేట్' : 'person') : (lang === 'te' ? 'రోజు' : 'day')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <a
            id={`whatsapp-service-${service.serviceId}`}
            href={`https://wa.me/${service.whatsapp}?text=Hi%2C%20I%20saw%20${encodeURIComponent(service.title)}%20on%20CaterPro`}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp Enquiry"
            className="p-2 rounded-xl bg-[#F5F1EB] hover:bg-[#FFF4E8] text-[#4A3728] border border-[#E8E2D9] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#E67E22]" />
          </a>

          <button
            id={`quote-service-btn-${service.serviceId}`}
            onClick={() => onOpenQuoteForService(service)}
            className="bg-[#FFF4E8] hover:bg-[#FADBB9] text-[#E67E22] border border-[#FADBB9] px-3 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            {t('instant_quote')}
          </button>

          <button
            id={`book-service-btn-${service.serviceId}`}
            onClick={() => onOpenBookingForService(service)}
            className="bg-[#2D241E] hover:bg-[#4A3728] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
          >
            <span>{t('book_now')}</span>
            <ArrowRight className="w-3 h-3 text-[#E67E22]" />
          </button>
        </div>
      </div>
    </div>
  );
};
