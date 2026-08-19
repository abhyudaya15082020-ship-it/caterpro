import React, { useState } from 'react';
import { 
  Utensils, 
  Users, 
  Calendar, 
  FileText, 
  ShoppingBag, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Globe, 
  Menu as MenuIcon, 
  X, 
  UserCheck, 
  LogOut, 
  ChefHat, 
  Sparkles,
  ChevronDown,
  MapPin
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onOpenQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuote
}) => {
  const { lang, setLang, t } = useLanguage();
  const { user, profile, role, signInWithGoogle, signInAsGuest, switchRole, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);

  const toggleLanguage = () => {
    setLang(lang === 'te' ? 'en' : 'te');
  };

  const navItems = [
    { id: 'services', label: t('nav_home'), icon: Utensils },
    { id: 'staff', label: t('nav_staff'), icon: Users },
    { id: 'menu', label: t('nav_menu'), icon: ChefHat },
    { id: 'bookings', label: t('nav_my_bookings'), icon: Calendar },
    { id: 'vendor', label: t('nav_vendor_portal'), icon: ShoppingBag },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E2D9] shadow-xs">
      {/* Top Notification & Quick Hotline Bar */}
      <div className="bg-[#2D241E] text-[#FDFBF7] text-xs px-4 py-1.5 flex flex-wrap justify-between items-center border-b border-[#4A3728]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E67E22]/20 border border-[#E67E22]/40 text-[#E67E22]">
            ⭐ 100% Verified Staff
          </span>
          <span className="hidden sm:inline font-medium text-[#F5F1EB]">
            {lang === 'te' 
              ? '👨 జెంట్స్ & 👩 లేడీస్ క్యాటరింగ్ సర్వీసెస్ | హైదరాబాద్, విజయవాడ, వైజాగ్ & రాయలసీమ'
              : '👨 Gents & 👩 Ladies Specialized Catering Crews | AP & Telangana'}
          </span>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <div className="hidden md:flex items-center bg-[#4A3728]/60 text-[#F5F1EB] px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-[#7A6E63]/40">
            <span className="text-[#E67E22] mr-1">📍</span>
            <span>Hyderabad, Telangana & AP</span>
          </div>
          <a 
            id="nav-call-support"
            href="tel:+919876543210" 
            className="flex items-center gap-1 text-[#F5F1EB] hover:text-[#E67E22] transition-colors font-medium text-xs"
          >
            <Phone className="w-3.5 h-3.5 text-[#E67E22]" />
            <span className="hidden md:inline">+91 98765 43210</span>
            <span className="md:hidden">Call</span>
          </a>
          <a 
            id="nav-whatsapp-support"
            href="https://wa.me/919876543210?text=Hi%20CaterPro%2C%20I%20need%20catering%20and%20staff%20service"
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 bg-[#E67E22] hover:bg-[#D35400] text-white px-2 py-0.5 rounded text-[11px] font-semibold transition-colors shadow-xs"
          >
            <MessageSquare className="w-3 h-3" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo in Natural Tones */}
          <div 
            id="brand-logo-btn"
            onClick={() => { setActiveTab('services'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 bg-[#E67E22] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-sm group-hover:scale-105 transition-transform">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-[#4A3728] group-hover:text-[#E67E22] transition-colors">
                  CaterPro
                </h1>
                <span className="bg-[#FFF4E8] text-[#E67E22] border border-[#FADBB9] text-[10px] font-bold px-2 py-0.5 rounded-full hidden sm:inline">
                  {lang === 'te' ? 'జెంట్స్ + లేడీస్' : 'Gents + Ladies'}
                </span>
              </div>
              <p className="text-[11px] text-[#7A6E63] font-medium line-clamp-1">
                {t('app_tagline')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-[#2D241E] text-[#FDFBF7] shadow-xs' 
                      : 'text-[#4A3728] hover:text-[#E67E22] hover:bg-[#F5F1EB]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E67E22]' : 'text-[#7A6E63]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Language, Instant Quote, Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher */}
            <button
              id="language-switch-btn"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#E8E2D9] bg-[#F5F1EB] hover:bg-[#FFF4E8] hover:border-[#FADBB9] text-[#4A3728] text-xs font-bold transition-all shadow-2xs"
              title="Switch between Telugu and English"
            >
              <Globe className="w-3.5 h-3.5 text-[#E67E22]" />
              <span>{lang === 'te' ? 'English' : 'తెలుగు'}</span>
            </button>

            {/* Quick Quotation Button in Natural Saffron Terracotta */}
            <button
              id="nav-quote-builder-btn"
              onClick={onOpenQuote}
              className="hidden sm:flex items-center gap-1.5 bg-[#E67E22] hover:bg-[#D35400] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-100" />
              <span>{lang === 'te' ? '⚡ కొటేషన్ కాలిక్యులేటర్' : '⚡ Instant Quote'}</span>
            </button>

            {/* Role & Auth Controls */}
            <div className="relative">
              {user || profile ? (
                <div className="relative">
                  <button
                    id="user-profile-menu-btn"
                    onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                    className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-[#E8E2D9] bg-[#F5F1EB] hover:bg-white text-[#4A3728] text-xs font-medium transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#E67E22] text-white flex items-center justify-center text-xs font-bold">
                      {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate font-bold text-[#4A3728]">
                      {profile?.name || 'User'}
                    </span>
                    <span className="text-[10px] bg-[#FFF4E8] text-[#E67E22] border border-[#FADBB9] px-1.5 py-0.2 rounded font-bold uppercase">
                      {role}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#7A6E63]" />
                  </button>

                  {authDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E8E2D9] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-[#E8E2D9]">
                        <p className="text-xs font-bold text-[#4A3728] truncate">{profile?.name || 'CaterPro User'}</p>
                        <p className="text-[11px] text-[#7A6E63] truncate">{profile?.email || 'guest@caterpro.com'}</p>
                      </div>

                      {/* Switch Role Section */}
                      <div className="px-3 py-1.5">
                        <p className="text-[10px] font-bold text-[#7A6E63] uppercase tracking-wider mb-1 px-1">
                          {lang === 'te' ? 'రోల్ మార్చండి (Switch Mode)' : 'Switch Role'}
                        </p>
                        {(['customer', 'vendor', 'admin'] as UserRole[]).map((r) => (
                          <button
                            key={r}
                            onClick={() => {
                              switchRole(r);
                              setAuthDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                              role === r ? 'bg-[#FFF4E8] text-[#E67E22] font-bold' : 'text-[#4A3728] hover:bg-[#F5F1EB]'
                            }`}
                          >
                            <span className="capitalize">
                              {r === 'customer' ? '👤 Customer (కస్టమర్)' : r === 'vendor' ? '🏪 Vendor (వెండర్)' : '🛡️ Super Admin'}
                            </span>
                            {role === r && <span className="text-[#E67E22] text-xs">✓</span>}
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-[#E8E2D9] my-1"></div>

                      <button
                        onClick={() => {
                          logout();
                          setAuthDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{lang === 'te' ? 'లాగౌట్ (Logout)' : 'Logout'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    id="guest-login-btn"
                    onClick={() => signInAsGuest('customer')}
                    className="px-2.5 py-1.5 text-xs font-bold text-[#4A3728] hover:text-[#E67E22] hover:bg-[#F5F1EB] rounded-xl transition-colors"
                  >
                    {lang === 'te' ? 'గెస్ట్ లాగిన్' : 'Guest'}
                  </button>
                  <button
                    id="google-login-btn"
                    onClick={signInWithGoogle}
                    className="flex items-center gap-1.5 bg-[#2D241E] hover:bg-[#4A3728] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{lang === 'te' ? 'లాగిన్' : 'Login'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#4A3728] hover:text-[#2D241E] hover:bg-[#F5F1EB] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5 text-[#4A3728]" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E2D9] bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive 
                    ? 'bg-[#FFF4E8] text-[#E67E22] font-bold border border-[#FADBB9]' 
                    : 'text-[#4A3728] hover:bg-[#F5F1EB]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#E67E22]' : 'text-[#7A6E63]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-[#E8E2D9]">
            <button
              onClick={() => {
                onOpenQuote();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#E67E22] hover:bg-[#D35400] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{t('instant_quote_btn')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
