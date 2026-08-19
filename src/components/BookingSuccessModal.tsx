import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Printer, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Users, 
  FileText, 
  X, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Booking } from '../types';

interface BookingSuccessModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onViewMyBookings: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  booking,
  isOpen,
  onClose,
  onViewMyBookings
}) => {
  const { lang, t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppReceipt = () => {
    const text = lang === 'te' ?
`*CaterPro ధృవీకరించబడిన బుకింగ్ రశీదు:*
🎉 బుకింగ్ ID: ${booking.bookingId}
👤 కస్టమర్: ${booking.customerName}
📞 ఫోన్: ${booking.customerPhone}
📅 ఈవెంట్ తేదీ: ${booking.eventDate} (${booking.eventTime})
📍 వేదిక: ${booking.eventLocation}
👥 అతిథులు: ${booking.guestCount} మంది
👨 జెంట్స్ స్టాఫ్: ${booking.gentsStaffCount} మంది
👩 లేడీస్ స్టాఫ్: ${booking.ladiesStaffCount} మంది
💰 మొత్తం బిల్లు: ₹${booking.totalAmount.toLocaleString('en-IN')}
✅ అడ్వాన్స్ చెల్లించబడింది: ₹${booking.advancePaid.toLocaleString('en-IN')}
⏳ బ్యాలెన్స్: ₹${(booking.totalAmount - booking.advancePaid).toLocaleString('en-IN')}

స్టాఫ్ లీడ్స్:
- జెంట్స్ కెప్టెన్: ${booking.assignedGentsLead}
- లేడీస్ లీడ్: ${booking.assignedLadiesLead}

CaterProను ఎంచుకున్నందుకు ధన్యవాదాలు!` :
`*CaterPro Confirmed Catering Receipt:*
🎉 Booking ID: ${booking.bookingId}
👤 Name: ${booking.customerName}
📞 Phone: ${booking.customerPhone}
📅 Event Date: ${booking.eventDate} (${booking.eventTime})
📍 Venue: ${booking.eventLocation}
👥 Guests: ${booking.guestCount} pax
👨 Gents Staff: ${booking.gentsStaffCount}
👩 Ladies Staff: ${booking.ladiesStaffCount}
💰 Grand Total: ₹${booking.totalAmount.toLocaleString('en-IN')}
✅ Advance Paid: ₹${booking.advancePaid.toLocaleString('en-IN')}
⏳ Balance: ₹${(booking.totalAmount - booking.advancePaid).toLocaleString('en-IN')}

Assigned Leads:
- Gents Captain: ${booking.assignedGentsLead}
- Ladies Lead: ${booking.assignedLadiesLead}

Thank you for choosing CaterPro!`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D241E]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#FDFBF7] w-full max-w-xl rounded-3xl shadow-2xl border border-[#E8E2D9] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Top Celebration Banner */}
        <div className="bg-[#2D241E] text-white p-6 text-center relative border-b border-[#4A3728]">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-[#4A3728] hover:bg-[#7A6E63] text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-full bg-[#E67E22] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-[#FFF4E8] border border-[#FADBB9] text-[#E67E22] text-xs font-bold mb-1">
            ✓ {lang === 'te' ? 'బుకింగ్ విజయవంతంగా నమోదైంది' : 'Booking Successfully Confirmed'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {lang === 'te' ? 'మీ ఈవెంట్ క్యాటరింగ్ ఆర్డర్ ఖరారైంది!' : 'Your Event is Booked & Confirmed!'}
          </h2>
          <p className="text-xs text-[#FADBB9] mt-1">
            Reference ID: <strong className="font-mono tracking-wider bg-white/20 px-2 py-0.5 rounded text-white">{booking.bookingId}</strong>
          </p>
        </div>

        {/* Receipt Voucher Body */}
        <div className="p-6 space-y-4">
          
          <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 space-y-3 text-xs shadow-xs">
            <div className="flex justify-between border-b border-[#E8E2D9] pb-2">
              <span className="text-[#7A6E63] font-bold uppercase">{t('your_name')}</span>
              <span className="font-bold text-[#4A3728]">{booking.customerName} ({booking.customerPhone})</span>
            </div>

            <div className="flex justify-between border-b border-[#E8E2D9] pb-2">
              <span className="text-[#7A6E63] font-bold uppercase">{t('event_date')}</span>
              <span className="font-bold text-[#4A3728]">{booking.eventDate} ({booking.eventTime})</span>
            </div>

            <div className="flex justify-between border-b border-[#E8E2D9] pb-2">
              <span className="text-[#7A6E63] font-bold uppercase">{t('guest_count')}</span>
              <span className="font-bold text-[#4A3728]">{booking.guestCount} Guests</span>
            </div>

            {/* Staff Assigned */}
            <div className="grid grid-cols-2 gap-2 bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E2D9]">
              <div>
                <span className="text-[10px] text-[#4A3728] font-bold block">👨 Gents Staff ({booking.gentsStaffCount})</span>
                <span className="font-bold text-[#4A3728] text-[11px]">{booking.assignedGentsLead}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#E67E22] font-bold block">👩 Ladies Staff ({booking.ladiesStaffCount})</span>
                <span className="font-bold text-[#4A3728] text-[11px]">{booking.assignedLadiesLead}</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="pt-2 flex justify-between items-baseline font-bold text-[#4A3728]">
              <span>{t('total_amount')}:</span>
              <span className="text-base text-[#E67E22]">₹{booking.totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-baseline font-semibold text-emerald-700">
              <span>{t('advance_required')} Paid:</span>
              <span className="text-sm">₹{booking.advancePaid.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-baseline text-[#7A6E63] text-[11px]">
              <span>{t('balance_amount')}:</span>
              <span>₹{(booking.totalAmount - booking.advancePaid).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl border border-[#E8E2D9] bg-white hover:bg-[#F5F1EB] text-[#4A3728] text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4 text-[#7A6E63]" />
              <span>{t('download_receipt')}</span>
            </button>

            <button
              onClick={handleWhatsAppReceipt}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{lang === 'te' ? 'WhatsApp రశీదు' : 'WhatsApp Receipt'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onViewMyBookings();
            }}
            className="w-full py-3 rounded-xl bg-[#E67E22] hover:bg-[#D35400] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>{lang === 'te' ? 'నా బుకింగ్స్ పేజీ చూడండి' : 'Go to My Bookings & Track Order'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};
