import React, { useState } from 'react';
import { 
  ChefHat, 
  Search, 
  Sparkles, 
  Check, 
  Plus, 
  Flame, 
  Coffee, 
  Cake, 
  Utensils 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ALL_MENU_ITEMS } from '../data/initialData';
import { MenuItem } from '../types';

interface FoodMenuShowcaseProps {
  onAddMenuItemToQuote: (item: MenuItem) => void;
  onOpenFullQuote: () => void;
}

export const FoodMenuShowcase: React.FC<FoodMenuShowcaseProps> = ({
  onAddMenuItemToQuote,
  onOpenFullQuote
}) => {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [searchDish, setSearchDish] = useState<string>('');
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);

  const categories = [
    { id: 'all', labelTe: 'అన్ని వంటకాలు', labelEn: 'All Dishes' },
    { id: 'starter', labelTe: 'స్టార్టర్స్', labelEn: 'Starters' },
    { id: 'rice_biryani', labelTe: 'బిర్యానీ & అన్నం', labelEn: 'Biryani & Rice' },
    { id: 'main_nonveg', labelTe: 'నాన్-వెజ్ కూరలు', labelEn: 'Non-Veg Feasts' },
    { id: 'main_veg', labelTe: 'వెజ్ కూరలు', labelEn: 'Veg Curries' },
    { id: 'breads', labelTe: 'రోటీ / నాన్', labelEn: 'Breads & Rotis' },
    { id: 'sweets_dessert', labelTe: 'స్వీట్స్ & డెజర్ట్స్', labelEn: 'Sweets & Desserts' },
    { id: 'live_counters', labelTe: 'లైవ్ స్టాళ్లు', labelEn: 'Live Counters' },
    { id: 'drinks', labelTe: 'వెల్‌కమ్ డ్రింక్స్', labelEn: 'Welcome Drinks' },
  ];

  const filteredItems = ALL_MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDiet = 
      dietFilter === 'all' ? true :
      dietFilter === 'veg' ? item.isVeg : !item.isVeg;
    const matchesSearch = 
      item.nameEn.toLowerCase().includes(searchDish.toLowerCase()) ||
      item.nameTe.includes(searchDish);
    return matchesCategory && matchesDiet && matchesSearch;
  });

  const handleAddItem = (item: MenuItem) => {
    onAddMenuItemToQuote(item);
    if (!addedItemIds.includes(item.id)) {
      setAddedItemIds(prev => [...prev, item.id]);
      setTimeout(() => {
        setAddedItemIds(prev => prev.filter(id => id !== item.id));
      }, 2000);
    }
  };

  return (
    <section id="food-menu-showcase" className="py-10 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4E8] border border-[#FADBB9] text-[#E67E22] text-xs font-bold mb-2 shadow-2xs">
              <ChefHat className="w-3.5 h-3.5 text-[#E67E22]" />
              <span>{lang === 'te' ? 'రాయల్ క్యాటరింగ్ మెనూ' : 'Royal Catering Menu Catalog'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#4A3728] tracking-tight">
              {lang === 'te' ? 'రుచికరమైన సాంప్రదాయ & ఆధునిక వంటకాలు' : 'Authentic Andhra, Telangana & Hyderabadi Menu'}
            </h2>
            <p className="text-sm text-[#7A6E63] mt-1">
              {lang === 'te' 
                ? 'మీరు కోరుకున్న వంటకాలను సెలెక్ట్ చేసి తక్షణ కొటేషన్ పొందండి.' 
                : 'Browse our signature dishes and customize your event catering quotation in seconds.'}
            </p>
          </div>

          <button
            id="build-custom-menu-btn"
            onClick={onOpenFullQuote}
            className="self-start md:self-auto bg-[#E67E22] hover:bg-[#D35400] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-100" />
            <span>{lang === 'te' ? 'పూర్తి మెనూతో కొటేషన్ తయారు చేయండి' : 'Open Custom Menu Builder'}</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-4 mb-6 space-y-3 shadow-xs">
          
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6E63]" />
              <input
                type="text"
                value={searchDish}
                onChange={(e) => setSearchDish(e.target.value)}
                placeholder={lang === 'te' ? 'వంటకం పేరు వెతకండి (బిర్యానీ, పనీర్, స్వీట్స్)...' : 'Search dish (Biryani, Paneer, Jalebi)...'}
                className="w-full pl-10 pr-3 py-2 bg-[#F5F1EB] border border-[#E8E2D9] rounded-xl text-xs font-medium text-[#4A3728] focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white"
              />
            </div>

            {/* Veg / Non-Veg Filter Toggle */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#F5F1EB] p-1 rounded-xl border border-[#E8E2D9] text-xs font-bold">
              <button
                onClick={() => setDietFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  dietFilter === 'all' ? 'bg-[#2D241E] text-white' : 'text-[#4A3728] hover:bg-white'
                }`}
              >
                {lang === 'te' ? 'అన్నీ' : 'All'}
              </button>
              <button
                onClick={() => setDietFilter('veg')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                  dietFilter === 'veg' ? 'bg-emerald-600 text-white' : 'text-emerald-800 hover:bg-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>{lang === 'te' ? 'కేవలం వెజ్' : 'Pure Veg'}</span>
              </button>
              <button
                onClick={() => setDietFilter('nonveg')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                  dietFilter === 'nonveg' ? 'bg-red-700 text-white' : 'text-red-800 hover:bg-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span>{lang === 'te' ? 'నాన్-వెజ్' : 'Non-Veg'}</span>
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#E67E22] text-white shadow-xs'
                      : 'bg-[#F5F1EB] text-[#4A3728] hover:bg-[#FFF4E8] border border-[#E8E2D9]'
                  }`}
                >
                  {lang === 'te' ? cat.labelTe : cat.labelEn}
                </button>
              );
            })}
          </div>

        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((dish) => {
            const isAdded = addedItemIds.includes(dish.id);
            return (
              <div
                key={dish.id}
                id={`menu-item-${dish.id}`}
                className="bg-white rounded-2xl border border-[#E8E2D9] hover:border-[#E67E22] p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center ${
                        dish.isVeg 
                          ? 'border-emerald-600 text-emerald-600' 
                          : 'border-red-600 text-red-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                      </span>

                      {dish.isPopular && (
                        <span className="bg-[#FFF4E8] text-[#E67E22] border border-[#FADBB9] text-[10px] font-extrabold px-1.5 py-0.2 rounded-md">
                          ★ {lang === 'te' ? 'స్పెషల్' : 'Special'}
                        </span>
                      )}
                    </div>

                    {dish.priceExtra && dish.priceExtra > 0 ? (
                      <span className="text-[11px] font-bold text-[#E67E22] bg-[#FFF4E8] border border-[#FADBB9] px-1.5 py-0.5 rounded-md">
                        +₹{dish.priceExtra}
                      </span>
                    ) : null}
                  </div>

                  <h4 className="text-sm font-bold text-[#4A3728] group-hover:text-[#E67E22] transition-colors">
                    {lang === 'te' ? dish.nameTe : dish.nameEn}
                  </h4>
                  <p className="text-[11px] text-[#7A6E63] font-medium">
                    {lang === 'te' ? dish.nameEn : dish.nameTe}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#E8E2D9] flex items-center justify-between">
                  <span className="text-[10px] text-[#7A6E63] uppercase font-bold tracking-wider">
                    {dish.category.replace('_', ' ')}
                  </span>

                  <button
                    onClick={() => handleAddItem(dish)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#F5F1EB] hover:bg-[#FFF4E8] text-[#4A3728] hover:text-[#E67E22] border border-[#E8E2D9]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>{lang === 'te' ? 'జోడించబడింది' : 'Added'}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>{lang === 'te' ? 'కొటేషన్‌కు జోడించు' : 'Add to Quote'}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#E8E2D9]">
            <ChefHat className="w-10 h-10 text-[#7A6E63] mx-auto mb-2" />
            <p className="text-[#4A3728] font-bold text-sm">
              {lang === 'te' ? 'ఎలాంటి వంటకాలు కనుగొనబడలేదు' : 'No matching dishes found'}
            </p>
            <p className="text-[#7A6E63] text-xs mt-1">
              {lang === 'te' ? 'దయచేసి సెర్చ్ ఫిల్టర్లను మార్చండి.' : 'Try changing your search keywords or diet filter.'}
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
