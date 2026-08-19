import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy 
} from 'firebase/firestore';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MessageSquare, 
  Printer, 
  Star, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Search
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Booking } from '../types';

interface MyBookingsViewProps {
  onOpenNewQuote: () => void;
  onOpenReviewModal: (booking: Booking) => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  onOpenNewQuote,
  onOpenReviewModal
}) => {
  const { lang, t } = useLanguage();
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // Load bookings from Firestore if user is logged in
    let unsubscribe = () => {};

    const loadBookings = () => {
      try {
        const bookingsCol = collection(db, 'bookings');
        
        // Listen to all bookings if admin or user specific
        unsubscribe = onSnapshot(bookingsCol, (snapshot) => {
          const list: Booking[] = [];
          snapshot.forEach((doc) => {
            list.push(doc.data() as Booking);
          });
          
          // Merge with any local storage bookings
          const localBookings: Booking[] = JSON.parse(localStorage.getItem('caterpro_local_bookings') || '[]');
          const combined = [...list, ...localBookings];
          // Deduplicate by bookingId
          const uniqueMap = new Map<string, Booking>();
          combined.forEach(b => uniqueMap.set(b.bookingId, b));
          const uniqueList = Array.from(uniqueMap.values());
          
          // Sort by creation or event date
          uniqueList.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setBookings(uniqueList);
          setLoading(false);
        }, (error) => {
          console.warn('Firestore snapshot notice, loading from local storage:', error);
          const localBookings: Booking[] = JSON.parse(localStorage.getItem('caterpro_local_bookings') || '[]');
          setBookings(localBookings);
          setLoading(false);
        });
      } catch (err) {
        console.warn('Firestore read notice:', err);
        const localBookings: Booking[] = JSON.parse(localStorage.getItem('caterpro_local_bookings') || '[]');
        setBookings(localBookings);
        setLoading(false);
      }
    };

    loadBookings();

    return () => unsubscribe();
  }, [user]);

  const filteredBookings = bookings.filter(b => 
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.eventLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { label: t('status_confirmed'), bg: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
      case 'in_progress':
        return { label: t('status_in_progress'), bg: 'bg-blue-50 text-blue-800 border-blue-300' };
      case 'completed':
        return { label: t('status_completed'), bg: 'bg-purple-50 text-purple-800 border-purple-300' };
      case 'cancelled':
        return { label: t('status_cancelled'), bg: 'bg-red-50 text-red-800 border-red-300' };
      default:
        return { label: t('status_pending'), bg: 'bg-[#FFF4E8] text-[#E67E22] border-[#FADBB9]' };
    }
  };

  const calculateDaysLeft = (eventDateStr: string) => {
    const today = new Date();
    const eventDate = new Date(eventDateStr);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div id="my-bookings-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4E8] border border-[#FADBB9] text-[#E67E22] text-xs font-bold mb-2 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-[#E67E22]" />
            <span>{lang === 'te' ? 'ఆర్డర్ నిర్వహణ & లైవ్ ట్రాకింగ్' : 'Order Management & Live Tracking'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#4A3728] tracking-tight">
            {t('my_bookings_title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6E63] mt-1">
            {lang === 'te' 
              ? 'మీ ఈవెంట్ బుకింగ్స్, కేటాయించిన జెంట్స్ & లేడీస్ స్టాఫ్ కెప్టెన్లు మరియు రశీదులను ఇక్కడ చూడండి.' 
              : 'Track your catering schedule, assigned staff team captains, and download vouchers.'}
          </p>
        </div>

        <button
          onClick={onOpenNewQuote}
          className="self-start sm:self-auto bg-[#E67E22] hover:bg-[#D35400] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-amber-100" />
          <span>{lang === 'te' ? '+ కొత్త బుకింగ్ చేసుకోండి' : '+ Book New Event'}</span>
        </button>
      </div>

      {/* Search Filter if multiple bookings */}
      {bookings.length > 0 && (
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6E63]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'te' ? 'బుకింగ్ ID లేదా పేరు ద్వారా వెతకండి...' : 'Search by Booking ID, Name or Venue...'}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#E8E2D9] rounded-xl text-xs font-medium text-[#4A3728] focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
          />
        </div>
      )}

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-6">
          {filteredBookings.map((b) => {
            const statusInfo = getStatusBadge(b.status);
            const daysLeft = calculateDaysLeft(b.eventDate);

            return (
              <div
                key={b.bookingId}
                id={`booking-card-${b.bookingId}`}
                className="bg-white rounded-2xl border border-[#E8E2D9] hover:border-[#E67E22] shadow-xs hover:shadow-md transition-all p-5 sm:p-6 space-y-4"
              >
                {/* Top Row: Ref ID + Status + Countdown */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E2D9] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-[#F5F1EB] text-[#4A3728] px-2.5 py-1 rounded-md border border-[#E8E2D9]">
                      ID: {b.bookingId}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${statusInfo.bg}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {daysLeft > 0 ? (
                    <div className="flex items-center gap-1 text-xs font-bold text-[#E67E22] bg-[#FFF4E8] px-3 py-1 rounded-full border border-[#FADBB9]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {daysLeft} {lang === 'te' ? 'రోజులు మిగిలి ఉన్నాయి (Event Countdown)' : 'Days left to event'}
                      </span>
                    </div>
                  ) : daysLeft === 0 ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      🎉 {lang === 'te' ? 'నేడే ఈవెంట్ రోజు (Today!)' : 'Event is Today!'}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-[#7A6E63] bg-[#F5F1EB] px-3 py-1 rounded-full">
                      ✓ {lang === 'te' ? 'ఈవెంట్ ముగిసింది' : 'Event Completed'}
                    </span>
                  )}
                </div>

                {/* Event Core Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  {/* Left: Venue & Date */}
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-[#4A3728]">
                      {b.serviceTitle}
                    </h3>
                    <div className="space-y-1 text-[#7A6E63]">
                      <p className="flex items-center gap-1.5 font-medium text-[#4A3728]">
                        <Calendar className="w-3.5 h-3.5 text-[#E67E22]" />
                        <strong>{b.eventDate}</strong> ({b.eventTime})
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
                        <span className="line-clamp-2">{b.eventLocation}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#E67E22]" />
                        <span><strong>{b.guestCount}</strong> {lang === 'te' ? 'అతిథులు' : 'Guests Expected'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Middle: Assigned Gents & Ladies Team */}
                  <div className="bg-[#FDFBF7] p-3.5 rounded-xl border border-[#E8E2D9] space-y-2.5">
                    <p className="text-[10px] font-bold text-[#7A6E63] uppercase tracking-wider">
                      {t('assigned_team')}
                    </p>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#4A3728] font-bold flex items-center gap-1">
                          👨 {lang === 'te' ? 'జెంట్స్ లీడ్' : 'Gents Captain'}:
                        </span>
                        <span className="font-semibold text-[#4A3728]">{b.assignedGentsLead || 'Venkatesh Rao'}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#E67E22] font-bold flex items-center gap-1">
                          👩 {lang === 'te' ? 'లేడీస్ లీడ్' : 'Ladies Lead'}:
                        </span>
                        <span className="font-semibold text-[#4A3728]">{b.assignedLadiesLead || 'Satyavathi Amma'}</span>
                      </div>

                      <div className="pt-1.5 border-t border-[#E8E2D9] flex items-center justify-between text-[11px] text-[#7A6E63]">
                        <span>Staff Deployed:</span>
                        <strong className="text-[#4A3728]">
                          {b.gentsStaffCount} Gents + {b.ladiesStaffCount} Ladies
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Right: Payment & Balance */}
                  <div className="bg-[#FFF4E8] p-3.5 rounded-xl border border-[#FADBB9] flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#E67E22] uppercase tracking-wider block">
                        {t('total_amount')}
                      </span>
                      <span className="text-lg font-black text-[#4A3728]">
                        ₹{b.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Advance Paid:</span>
                        <span>₹{b.advancePaid.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-[#7A6E63]">
                        <span>Balance Due:</span>
                        <span>₹{(b.totalAmount - b.advancePaid).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold self-start">
                      Payment: {b.paymentStatus.toUpperCase()}
                    </span>
                  </div>

                </div>

                {/* Menu Preview */}
                {b.selectedMenu && b.selectedMenu.length > 0 && (
                  <div className="pt-2 border-t border-[#E8E2D9] flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="font-bold text-[#7A6E63] mr-1">Menu:</span>
                    {b.selectedMenu.map((m, idx) => (
                      <span key={idx} className="bg-[#F5F1EB] text-[#4A3728] px-2 py-0.5 rounded border border-[#E8E2D9]">
                        {m}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Actions: Call, WhatsApp, Receipt, Review */}
                <div className="pt-2 border-t border-[#E8E2D9] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <a
                      href="tel:+919876543210"
                      className="px-3 py-1.5 rounded-lg bg-[#F5F1EB] hover:bg-[#FFF4E8] text-[#4A3728] text-xs font-bold flex items-center gap-1.5 transition-colors border border-[#E8E2D9]"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#7A6E63]" />
                      <span>{lang === 'te' ? 'టీమ్ కెప్టెన్‌కు కాల్' : 'Call Lead'}</span>
                    </a>

                    <a
                      href={`https://wa.me/919876543210?text=Hi%20CaterPro%2C%20regarding%20my%20booking%20${b.bookingId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors border border-emerald-200"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenReviewModal(b)}
                      className="px-3 py-1.5 rounded-lg border border-[#FADBB9] bg-[#FFF4E8] hover:bg-[#FADBB9]/60 text-[#E67E22] text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 text-[#E67E22] fill-[#E67E22]" />
                      <span>{t('write_review')}</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-lg bg-[#2D241E] hover:bg-[#4A3728] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#FADBB9]" />
                      <span>{t('download_receipt')}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#E8E2D9] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FFF4E8] text-[#E67E22] border border-[#FADBB9] flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#4A3728]">{t('no_bookings_yet')}</h3>
            <p className="text-xs text-[#7A6E63] max-w-md mx-auto mt-1">
              {lang === 'te' 
                ? 'మీరు మా స్మార్ట్ కొటేషన్ కాలిక్యులేటర్ ద్వారా సులభంగా జెంట్స్ & లేడీస్ స్టాఫ్ మరియు ఫుడ్ క్యాటరింగ్ బుక్ చేసుకోవచ్చు.' 
                : 'Plan your event with our instant quotation calculator and book verified catering staff.'}
            </p>
          </div>
          <button
            onClick={onOpenNewQuote}
            className="bg-[#E67E22] hover:bg-[#D35400] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm"
          >
            ⚡ {t('instant_quote_btn')}
          </button>
        </div>
      )}

    </div>
  );
};
