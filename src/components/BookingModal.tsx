import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building, 
  Banknote, 
  CheckCircle2, 
  Loader2, 
  Users, 
  Calendar, 
  MapPin, 
  Phone 
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Booking, QuotationDetails, VendorService } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: QuotationDetails | null;
  service?: VendorService | null;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  quote,
  service,
  onBookingSuccess
}) => {
  const { lang, t } = useLanguage();
  const { user, profile } = useAuth();

  const [customerName, setCustomerName] = useState<string>(profile?.name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(profile?.phone || '');
  const [customerEmail, setCustomerEmail] = useState<string>(profile?.email || '');
  const [eventAddress, setEventAddress] = useState<string>('');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cash'>('upi');
  const [upiId, setUpiId] = useState<string>('caterpro@upi');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalAmount = quote ? quote.total : (service ? service.pricePerPlate * 100 : 25000);
  const advanceAmount = quote ? quote.advanceAmount : Math.round(totalAmount * 0.2);
  const guestCount = quote ? quote.guestCount : 100;
  const gentsStaffCount = quote ? (quote.gentsServers + quote.gentsCooks + quote.gentsHelpers + quote.gentsCleaning) : (service?.gentsStaffAvailable || 5);
  const ladiesStaffCount = quote ? (quote.ladiesServers + quote.ladiesHelpers + quote.ladiesHospitality + quote.ladiesCleaning) : (service?.ladiesStaffAvailable || 5);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !eventAddress) {
      setErrorMessage(lang === 'te' ? 'దయచేసి పేరు, ఫోన్ నంబర్ మరియు చిరునామా నమోదు చేయండి.' : 'Please enter your name, phone and event address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const bookingId = 'BK-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
    const userId = user?.uid || profile?.userId || 'guest_' + Math.random().toString(36).substring(2, 8);

    const newBooking: Booking = {
      bookingId,
      userId,
      customerName,
      customerPhone,
      customerEmail: customerEmail || 'guest@caterpro.com',
      serviceId: service?.serviceId || 'srv-custom',
      serviceTitle: service?.title || `${quote?.eventType?.toUpperCase()} Catering & Staff`,
      eventType: quote?.eventType || 'wedding',
      eventDate: quote?.eventDate || new Date().toISOString().split('T')[0],
      eventTime: quote?.eventTime || '11:30 AM - 3:30 PM',
      eventLocation: `${eventAddress}, ${quote?.location || 'Hyderabad'}`,
      guestCount,
      gentsStaffCount,
      ladiesStaffCount,
      selectedMenu: quote?.selectedItems.map(i => i.nameEn) || ['Traditional Andhra Meals', 'Hyderabadi Biryani'],
      specialInstructions: specialNotes,
      totalAmount,
      advancePaid: advanceAmount,
      status: 'confirmed',
      paymentStatus: paymentMethod === 'cash' ? 'unpaid' : 'advance_paid',
      assignedGentsLead: 'Venkatesh Rao (Gents Captain)',
      assignedLadiesLead: 'Satyavathi Amma (Ladies Lead)',
      createdAt: new Date().toISOString()
    };

    try {
      // Save directly to Firestore collection /bookings
      const bookingRef = doc(db, 'bookings', bookingId);
      await setDoc(bookingRef, newBooking);
      onBookingSuccess(newBooking);
    } catch (error) {
      console.warn('Firestore write notice (storing in local persistent store):', error);
      // Save in local state fallback as well so user has seamless workflow
      const existing = JSON.parse(localStorage.getItem('caterpro_local_bookings') || '[]');
      existing.unshift(newBooking);
      localStorage.setItem('caterpro_local_bookings', JSON.stringify(existing));
      onBookingSuccess(newBooking);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D241E]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#FDFBF7] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E8E2D9] overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Modal Header */}
        <div className="bg-[#2D241E] text-white px-5 py-4 flex items-center justify-between shrink-0 border-b border-[#4A3728]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E67E22] flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">{t('booking_title')}</h3>
              <p className="text-xs text-[#FADBB9]">
                {lang === 'te' ? '100% గ్యారెంటీ సర్వీస్ & వెరిఫైడ్ స్టాఫ్' : '100% Guaranteed Catering & Verified Crew'}
              </p>
            </div>
          </div>
          <button 
            id="close-booking-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#4A3728] hover:bg-[#7A6E63] text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmitBooking} className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
              {errorMessage}
            </div>
          )}

          {/* Quick Summary Pill */}
          <div className="bg-white border border-[#E8E2D9] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs shadow-xs">
            <div>
              <span className="font-bold text-[#4A3728] block">{quote?.eventType?.toUpperCase()} Celebration</span>
              <span className="text-[#7A6E63]">{quote?.eventDate} • {guestCount} Guests</span>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <span className="text-[10px] text-[#7A6E63] font-bold block">👨 {gentsStaffCount} Gents + 👩 {ladiesStaffCount} Ladies</span>
                <span className="font-extrabold text-[#E67E22] text-sm">Advance: ₹{advanceAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#4A3728] mb-1">
                {t('your_name')} <span className="text-[#E67E22]">*</span>
              </label>
              <input
                id="booking-input-name"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Ramesh Varma"
                className="w-full bg-white border border-[#E8E2D9] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A3728] focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3728] mb-1">
                {t('phone_number')} <span className="text-[#E67E22]">*</span>
              </label>
              <input
                id="booking-input-phone"
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. +91 9876543210"
                className="w-full bg-white border border-[#E8E2D9] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A3728] focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3728] mb-1">
              {t('email_address')}
            </label>
            <input
              id="booking-input-email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="e.g. ramesh@gmail.com"
              className="w-full bg-white border border-[#E8E2D9] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A3728] focus:ring-2 focus:ring-[#E67E22]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3728] mb-1">
              {t('event_address')} <span className="text-[#E67E22]">*</span>
            </label>
            <textarea
              id="booking-input-address"
              required
              rows={2}
              value={eventAddress}
              onChange={(e) => setEventAddress(e.target.value)}
              placeholder={lang === 'te' ? 'ఫంక్షన్ హాల్ పేరు, రోడ్ నంబర్, ప్రాంతం, ల్యాండ్‌మార్క్...' : 'Function hall name, street, locality, landmark...'}
              className="w-full bg-white border border-[#E8E2D9] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A3728] focus:ring-2 focus:ring-[#E67E22]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3728] mb-1">
              {t('special_notes')}
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder={lang === 'te' ? 'ఉదా: తక్కువ కారం, ప్యూర్ వెజ్ సెక్షన్ వేరుగా ఉండాలి...' : 'e.g., Less spicy biryani, separate pure veg counter...'}
              className="w-full bg-white border border-[#E8E2D9] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A3728] focus:ring-2 focus:ring-[#E67E22]"
            />
          </div>

          {/* Payment Method Selector */}
          <div className="pt-2 border-t border-[#E8E2D9]">
            <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider mb-2">
              {t('payment_mode')}
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-[#FFF4E8] border-[#E67E22] text-[#E67E22] ring-2 ring-[#E67E22]/20'
                    : 'bg-white border-[#E8E2D9] text-[#4A3728] hover:bg-[#F5F1EB]'
                }`}
              >
                <Smartphone className="w-5 h-5 text-[#E67E22]" />
                <span>UPI (GPay/PhonePe)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-[#FFF4E8] border-[#E67E22] text-[#E67E22] ring-2 ring-[#E67E22]/20'
                    : 'bg-white border-[#E8E2D9] text-[#4A3728] hover:bg-[#F5F1EB]'
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#4A3728]" />
                <span>Cards / NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-[#FFF4E8] border-[#E67E22] text-[#E67E22] ring-2 ring-[#E67E22]/20'
                    : 'bg-white border-[#E8E2D9] text-[#4A3728] hover:bg-[#F5F1EB]'
                }`}
              >
                <Banknote className="w-5 h-5 text-[#E67E22]" />
                <span>Cash at Venue</span>
              </button>
            </div>

            {paymentMethod === 'upi' && (
              <div className="mt-3 bg-white p-3 rounded-xl border border-[#E8E2D9] text-xs space-y-1 shadow-xs">
                <div className="flex justify-between font-bold text-[#4A3728]">
                  <span>Pay to Official CaterPro Merchant UPI:</span>
                  <span className="bg-[#FFF4E8] border border-[#FADBB9] text-[#E67E22] px-2 py-0.5 rounded text-[11px]">caterpro@icici</span>
                </div>
                <p className="text-[11px] text-[#7A6E63]">
                  {lang === 'te' ? 'అడ్వాన్స్ చెల్లించిన వెంటనే మీకు అధికారిక SMS & WhatsApp రశీదు వస్తుంది.' : 'Instant automated confirmation receipt sent to your phone.'}
                </p>
              </div>
            )}
          </div>

          {/* Action Submit */}
          <div className="pt-3">
            <button
              id="confirm-payment-and-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{lang === 'te' ? 'బుకింగ్ నమోదు అవుతోంది...' : 'Confirming Reservation...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>
                    {t('proceed_payment')} (₹{advanceAmount.toLocaleString('en-IN')})
                  </span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
