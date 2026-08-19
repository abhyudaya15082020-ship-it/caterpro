import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  HeartHandshake 
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Booking, Review } from '../types';

interface ReviewModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: (review: Review) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  booking,
  isOpen,
  onClose,
  onReviewSubmitted
}) => {
  const { lang, t } = useLanguage();
  const { profile, user } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [foodRating, setFoodRating] = useState<number>(5);
  const [staffRating, setStaffRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const reviewId = 'rev-' + Date.now().toString(36);
    const newReview: Review = {
      reviewId,
      bookingId: booking.bookingId,
      serviceId: booking.serviceId,
      userId: user?.uid || profile?.userId || 'usr_guest',
      userName: booking.customerName || profile?.name || 'Customer',
      rating,
      foodRating,
      staffRating,
      comment: comment || 'Excellent catering and very well coordinated Gents and Ladies staff crew!',
      eventDate: booking.eventDate,
      createdAt: new Date().toISOString()
    };

    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      await setDoc(reviewRef, newReview);
      onReviewSubmitted(newReview);
      onClose();
    } catch (err) {
      console.warn('Firestore write review fallback:', err);
      onReviewSubmitted(newReview);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D241E]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#FDFBF7] w-full max-w-lg rounded-2xl shadow-2xl border border-[#E8E2D9] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-[#2D241E] text-white px-5 py-4 flex items-center justify-between border-b border-[#4A3728]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E67E22] flex items-center justify-center text-white">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">{t('write_review')}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#4A3728] hover:bg-[#7A6E63] text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          <div className="bg-white p-3.5 rounded-xl border border-[#E8E2D9] shadow-xs">
            <p className="font-bold text-[#4A3728]">{booking.serviceTitle}</p>
            <p className="text-[#7A6E63]">{booking.eventDate} • {booking.eventLocation}</p>
          </div>

          {/* Overall Rating */}
          <div className="space-y-1 text-center py-2">
            <label className="font-bold text-[#4A3728] block uppercase tracking-wider">
              {lang === 'te' ? 'మొత్తం అనుభవం రేటింగ్' : 'Overall Experience Rating'}
            </label>
            <div className="flex items-center justify-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125"
                >
                  <Star className={`w-7 h-7 ${star <= rating ? 'text-[#E67E22] fill-[#E67E22]' : 'text-[#E8E2D9]'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Specific Rating: Food vs Staff */}
          <div className="grid grid-cols-2 gap-3 bg-[#FFF4E8] p-3 rounded-xl border border-[#FADBB9]">
            <div className="space-y-1 text-center">
              <span className="font-bold text-[#4A3728] block">🍛 Food Taste</span>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setFoodRating(s)}>
                    <Star className={`w-4 h-4 ${s <= foodRating ? 'text-[#E67E22] fill-[#E67E22]' : 'text-[#E8E2D9]'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-center">
              <span className="font-bold text-[#4A3728] block">👥 Staff Service</span>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setStaffRating(s)}>
                    <Star className={`w-4 h-4 ${s <= staffRating ? 'text-[#E67E22] fill-[#E67E22]' : 'text-[#E8E2D9]'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="font-bold text-[#4A3728] block mb-1">
              {lang === 'te' ? 'మీ అభిప్రాయం / సూచనలు' : 'Your Review & Comments'}
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={lang === 'te' ? 'వంటకాల రుచి, జెంట్స్ మరియు లేడీస్ స్టాఫ్ సేవల గురించి మీ అనుభవాన్ని తెలపండి...' : 'Tell us about the food quality, punctuality, and staff hospitality...'}
              className="w-full bg-white border border-[#E8E2D9] rounded-xl p-3 focus:ring-2 focus:ring-[#E67E22] text-[#4A3728] font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{t('submit')}</span>
          </button>

        </form>

      </div>
    </div>
  );
};
