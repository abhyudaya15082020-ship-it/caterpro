import React from 'react';
import { 
  ChefHat, 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Heart 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-[#2D241E] text-[#F5F1EB] pt-12 pb-8 border-t border-[#4A3728]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#4A3728]/80">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E67E22] flex items-center justify-center text-white font-black text-2xl shadow-sm">
                C
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">Cater<span className="text-[#E67E22]">Pro</span></span>
                <span className="text-[10px] block font-bold text-[#FADBB9] tracking-widest uppercase">
                  {lang === 'te' ? 'జెంట్స్ & లేడీస్ క్యాటరింగ్' : 'Gents & Ladies Staff'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#E8E2D9]/80 leading-relaxed">
              {lang === 'te' 
                ? 'తెలంగాణ మరియు ఆంధ్రప్రదేశ్‌లోని అన్ని శుభకార్యాలకు, వివాహాలకు నైపుణ్యం కలిగిన జెంట్స్ మరియు లేడీస్ క్యాటరింగ్ సిబ్బంది & రుచికరమైన సాంప్రదాయ వంటకాలు.' 
                : 'South India’s premier catering & event staffing marketplace. Hire verified Gents buffet servers, master cooks, and traditional Ladies dining hospitality crews.'}
            </p>

            <div className="flex items-center gap-2 text-xs text-[#FADBB9] font-bold bg-[#4A3728]/70 p-2.5 rounded-xl border border-[#7A6E63]/40">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#E67E22]" />
              <span>{lang === 'te' ? '100% పరిశుభ్రత & యూనిఫాం ధరించిన సిబ్బంది' : '100% Hygiene & Uniformed Crew'}</span>
            </div>
          </div>

          {/* Col 2: Specialized Staffing */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-[#E67E22]">
              {lang === 'te' ? '👨 జెంట్స్ & 👩 లేడీస్ సిబ్బంది' : '👨 Gents & 👩 Ladies Crew'}
            </h4>
            <ul className="space-y-2 text-[#E8E2D9]/70">
              <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                <span>•</span> <span>👨 Buffet Servers & Waiters</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                <span>•</span> <span>👨 Hyderabadi Biryani Ustads</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                <span>•</span> <span>👨 Vessel Cleaners & Setup Helpers</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                <span>•</span> <span>👩 Traditional Banana Leaf Dining Servers</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                <span>•</span> <span>👩 Hot Bobbatlu, Jalebi & Sweets Makers</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                <span>•</span> <span>👩 Hospitality & Welcome Hostesses</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Cities */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-[#E67E22]">
              {lang === 'te' ? 'సర్వీస్ అందుబాటులో ఉన్న నగరాలు' : 'Service Areas'}
            </h4>
            <ul className="space-y-2 text-[#E8E2D9]/70">
              <li className="hover:text-white transition-colors">📍 Hyderabad & Secunderabad</li>
              <li className="hover:text-white transition-colors">📍 Vijayawada & Guntur</li>
              <li className="hover:text-white transition-colors">📍 Visakhapatnam & Vizianagaram</li>
              <li className="hover:text-white transition-colors">📍 Warangal & Hanamkonda</li>
              <li className="hover:text-white transition-colors">📍 Rajahmundry & Kakinada</li>
              <li className="hover:text-white transition-colors">📍 Tirupati, Nellore & Kurnool</li>
            </ul>
          </div>

          {/* Col 4: 24/7 Helpline & Support */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-[#E67E22]">
              {lang === 'te' ? '24/7 సహాయ కేంద్రం & బుకింగ్స్' : '24/7 Helpline & Support'}
            </h4>
            <div className="space-y-2.5">
              <a 
                href="tel:+919876543210" 
                className="flex items-center gap-2.5 text-[#F5F1EB] hover:text-[#E67E22] transition-colors bg-[#4A3728]/80 p-2.5 rounded-xl border border-[#7A6E63]/30"
              >
                <Phone className="w-4 h-4 text-[#E67E22] shrink-0" />
                <div>
                  <span className="text-[10px] text-[#E8E2D9]/70 font-bold block">Toll Free Call</span>
                  <span className="font-bold text-white">+91 98765 43210</span>
                </div>
              </a>

              <a 
                href="https://wa.me/919876543210?text=Hi%20CaterPro%20Catering%20Help" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[#F5F1EB] hover:text-white transition-colors bg-[#E67E22] hover:bg-[#D35400] p-2.5 rounded-xl text-white font-bold"
              >
                <MessageSquare className="w-4 h-4 text-white shrink-0" />
                <div>
                  <span className="text-[10px] text-amber-100 font-bold block">Instant WhatsApp</span>
                  <span className="font-bold">Chat with Event Specialist</span>
                </div>
              </a>

              <p className="text-[11px] text-[#E8E2D9]/60">
                Main Hub: Banjara Hills Rd #12, Hyderabad & Benz Circle, Vijayawada.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E8E2D9]/60 gap-3">
          <p>© {new Date().getFullYear()} CaterPro - Catering Supply & Staffing Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[#E8E2D9]/80">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#E67E22] fill-[#E67E22] inline" />
            <span>for Telugu Weddings, Events & Feasts</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
