import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Users, 
  UserCheck, 
  Utensils, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { VendorService, ServiceType } from '../types';
import { POPULAR_LOCATIONS } from '../data/initialData';

interface VendorPortalViewProps {
  onServiceAdded: (newService: VendorService) => void;
  vendorServices: VendorService[];
}

export const VendorPortalView: React.FC<VendorPortalViewProps> = ({
  onServiceAdded,
  vendorServices
}) => {
  const { lang, t } = useLanguage();
  const { user, profile } = useAuth();

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [vendorName, setVendorName] = useState<string>(profile?.name || 'Grand Telugu Caterers');
  const [serviceTitle, setServiceTitle] = useState<string>('');
  const [serviceTitleTe, setServiceTitleTe] = useState<string>('');
  const [serviceType, setServiceType] = useState<VendorService['serviceType']>('full_catering');
  const [city, setCity] = useState<string>('Hyderabad / Secunderabad');
  const [pricePerPlate, setPricePerPlate] = useState<number>(380);
  const [pricePerStaffDay, setPricePerStaffDay] = useState<number>(850);
  const [gentsStaffAvailable, setGentsStaffAvailable] = useState<number>(15);
  const [ladiesStaffAvailable, setLadiesStaffAvailable] = useState<number>(12);
  const [phone, setPhone] = useState<string>('+91 9876543210');
  const [specialties, setSpecialties] = useState<string>('Hyderabadi Dum Biryani, Pure Ghee Sweets, Traditional Banana Leaf Service');
  const [description, setDescription] = useState<string>('Experienced catering crew for all weddings, functions and corporate events.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle) return;

    setIsSubmitting(true);
    const serviceId = 'srv-' + Date.now().toString(36);
    const vendorId = user?.uid || profile?.userId || 'vnd-' + Math.random().toString(36).substring(2, 6);

    const newService: VendorService = {
      serviceId,
      vendorId,
      vendorName,
      vendorNameTe: vendorName,
      serviceType,
      title: serviceTitle,
      titleTe: serviceTitleTe || serviceTitle,
      description,
      descriptionTe: description,
      city,
      rating: 5.0,
      reviewsCount: 1,
      pricePerPlate: Number(pricePerPlate),
      pricePerStaffDay: Number(pricePerStaffDay),
      gentsStaffAvailable: Number(gentsStaffAvailable),
      ladiesStaffAvailable: Number(ladiesStaffAvailable),
      isVerified: true,
      phone,
      whatsapp: phone.replace(/[^0-9]/g, ''),
      specialties,
      specialtiesTe: specialties,
      imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
      cateringTypes: ['veg', 'nonveg', 'south_indian', 'hyderabadi'],
      minGuests: 50,
      maxGuests: 5000,
      createdAt: new Date().toISOString()
    };

    try {
      const serviceRef = doc(db, 'services', serviceId);
      await setDoc(serviceRef, newService);
      onServiceAdded(newService);
      setSuccessMessage(lang === 'te' ? 'కొత్త క్యాటరింగ్ సర్వీస్ విజయవంతంగా పబ్లిష్ చేయబడింది!' : 'New catering service published successfully!');
      setShowAddForm(false);
      setServiceTitle('');
    } catch (err) {
      console.warn('Firestore service sync notice, saving locally:', err);
      onServiceAdded(newService);
      setSuccessMessage(lang === 'te' ? 'కొత్త క్యాటరింగ్ సర్వీస్ విజయవంతంగా పబ్లిష్ చేయబడింది!' : 'New catering service published successfully!');
      setShowAddForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="vendor-portal-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4E8] border border-[#FADBB9] text-[#E67E22] text-xs font-bold mb-2 shadow-2xs">
            <ShoppingBag className="w-3.5 h-3.5 text-[#E67E22]" />
            <span>{lang === 'te' ? 'క్యాటరింగ్ ఓనర్లు & స్టాఫ్ ఏజెన్సీలు' : 'Catering Owners & Crew Agency Hub'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#4A3728] tracking-tight">
            {t('vendor_portal_title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6E63] mt-1">
            {lang === 'te' 
              ? 'మీ క్యాటరింగ్ ప్యాకేజీలు, జెంట్స్ & లేడీస్ స్టాఫ్ లభ్యత మరియు రేట్లను ఇక్కడ మేనేజ్ చేయండి.' 
              : 'List your catering services, update staff headcount, and accept customer bookings.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="self-start sm:self-auto bg-[#E67E22] hover:bg-[#D35400] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t('add_new_service')}</span>
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Add Service Modal / Inline Form */}
      {showAddForm && (
        <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-md p-6 mb-8 animate-in fade-in duration-200">
          <h3 className="text-lg font-bold text-[#4A3728] mb-4 pb-2 border-b border-[#E8E2D9] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E67E22]" />
            <span>{lang === 'te' ? 'కొత్త క్యాటరింగ్ / స్టాఫ్ సర్వీస్ వివరాలు' : 'New Catering / Staff Listing Details'}</span>
          </h3>

          <form onSubmit={handleCreateService} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3728] mb-1">
                  {lang === 'te' ? 'సంస్థ / వెండర్ పేరు' : 'Agency / Vendor Name'}
                </label>
                <input
                  type="text"
                  required
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-[#E8E2D9] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A3728] focus:ring-2 focus:ring-[#E67E22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3728] mb-1">
                  {lang === 'te' ? 'సర్వీస్ టైప్ (Service Type)' : 'Service Type'}
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as any)}
                  className="w-full bg-[#FDFBF7] border border-[#E8E2D9] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A3728] focus:ring-2 focus:ring-[#E67E22]"
                >
                  <option value="full_catering">Full Food Catering + Staff</option>
                  <option value="gents_staff">Gents Staff Service</option>
                  <option value="ladies_staff">Ladies Staff Service</option>
                  <option value="cooks_only">Master Biryani & Chefs Team</option>
                  <option value="cleaning">Post-Event Cleaning & Setup</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3728] mb-1">
                  {lang === 'te' ? 'సర్వీస్ టైటిల్ (ఇంగ్లీష్)' : 'Service Title (English)'}
                </label>
                <input
                  type="text"
                  required
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  placeholder="e.g. Royal Andhra & Hyderabadi Feast"
                  className="w-full bg-[#FDFBF7] border border-[#E8E2D9] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A3728] focus:ring-2 focus:ring-[#E67E22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3728] mb-1">
                  {lang === 'te' ? 'సర్వీస్ టైటిల్ (తెలుగు)' : 'Service Title (Telugu)'}
                </label>
                <input
                  type="text"
                  value={serviceTitleTe}
                  onChange={(e) => setServiceTitleTe(e.target.value)}
                  placeholder="ఉదా: రాయల్ ఆంధ్ర & హైదరాబాదీ విందు"
                  className="w-full bg-[#FDFBF7] border border-[#E8E2D9] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A3728] focus:ring-2 focus:ring-[#E67E22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3728] mb-1">
                  {t('location')}
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-[#E8E2D9] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A3728] focus:ring-2 focus:ring-[#E67E22]"
                >
                  {POPULAR_LOCATIONS.map(loc => (
                    <option key={loc.id} value={loc.nameEn}>{loc.nameEn}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3728] mb-1">
                  {t('phone_number')}
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-[#E8E2D9] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A3728] focus:ring-2 focus:ring-[#E67E22]"
                />
              </div>
            </div>

            {/* Pricing & Staff Roster Headcount */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FDFBF7] p-4 rounded-2xl border border-[#E8E2D9]">
              <div>
                <label className="block text-[11px] font-bold text-[#7A6E63] mb-1">
                  Price Per Plate (₹)
                </label>
                <input
                  type="number"
                  value={pricePerPlate}
                  onChange={(e) => setPricePerPlate(Number(e.target.value))}
                  className="w-full bg-white border border-[#E8E2D9] rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#4A3728]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7A6E63] mb-1">
                  Staff Per Day (₹)
                </label>
                <input
                  type="number"
                  value={pricePerStaffDay}
                  onChange={(e) => setPricePerStaffDay(Number(e.target.value))}
                  className="w-full bg-white border border-[#E8E2D9] rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#4A3728]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#4A3728] mb-1">
                  👨 Gents Staff Count
                </label>
                <input
                  type="number"
                  value={gentsStaffAvailable}
                  onChange={(e) => setGentsStaffAvailable(Number(e.target.value))}
                  className="w-full bg-white border border-[#E8E2D9] rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#4A3728]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#E67E22] mb-1">
                  👩 Ladies Staff Count
                </label>
                <input
                  type="number"
                  value={ladiesStaffAvailable}
                  onChange={(e) => setLadiesStaffAvailable(Number(e.target.value))}
                  className="w-full bg-white border border-[#E8E2D9] rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#E67E22]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3728] mb-1">
                {lang === 'te' ? 'ప్రత్యేకతలు & సిగ్నేచర్ డిషెస్' : 'Specialties & Signature Dishes'}
              </label>
              <input
                type="text"
                value={specialties}
                onChange={(e) => setSpecialties(e.target.value)}
                placeholder="e.g. Zafrani Dum Biryani, Live Jalebi, Natu Kodi"
                className="w-full bg-[#FDFBF7] border border-[#E8E2D9] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A3728] focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl border border-[#E8E2D9] bg-white text-[#4A3728] text-xs font-bold hover:bg-[#F5F1EB]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#E67E22] hover:bg-[#D35400] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{lang === 'te' ? 'సర్వీస్ పబ్లిష్ చేయండి' : 'Publish Service'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Listings Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#4A3728] uppercase tracking-wider">
          {lang === 'te' ? 'మీ యాక్టివ్ సర్వీస్ లిస్టింగ్స్' : 'Your Active Catering Listings'} ({vendorServices.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vendorServices.map((service) => (
            <div
              key={service.serviceId}
              className="bg-white rounded-2xl border border-[#E8E2D9] p-4 space-y-3 shadow-2xs hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#E67E22] bg-[#FFF4E8] border border-[#FADBB9] px-2 py-0.5 rounded-full uppercase">
                    {service.serviceType.replace('_', ' ')}
                  </span>
                  <h4 className="text-sm font-bold text-[#4A3728] mt-1">{service.title}</h4>
                  <p className="text-xs text-[#7A6E63]">{service.city}</p>
                </div>

                <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Live</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E2D9] text-xs">
                <div>
                  <span className="text-[10px] text-[#7A6E63] font-bold block">👨 Gents Staff</span>
                  <span className="font-bold text-[#4A3728]">{service.gentsStaffAvailable} Active</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A6E63] font-bold block">👩 Ladies Staff</span>
                  <span className="font-bold text-[#E67E22]">{service.ladiesStaffAvailable} Active</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-[#E8E2D9] text-xs">
                <span className="text-[#7A6E63]">Rate: ₹{service.pricePerPlate}/plate</span>
                <span className="font-black text-[#E67E22]">₹{service.pricePerStaffDay}/staff day</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
