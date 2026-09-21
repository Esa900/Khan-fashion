import React from 'react';
import { Menu, Search, ShoppingBag, ShieldCheck, Sparkles, Phone, MessageSquare, Truck, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  onOpenThreeLine: () => void;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentView: 'store' | 'admin';
  setCurrentView: (view: 'store' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenThreeLine,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  currentView,
  setCurrentView,
}) => {
  const { settings, cartCount, cartTotal, isAdminAuthenticated } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all shadow-xs">
      {/* Top Micro Announcement Bar */}
      <div className="bg-stone-900 text-stone-300 text-[11px] py-1.5 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 overflow-hidden">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium whitespace-nowrap">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{settings.noticeBannerText || 'প্রিমিয়াম কোয়ালিটির পোশাক • নতুন সিজন স্পেশাল অফার'}</span>
            </span>
            <span className="hidden md:flex items-center gap-1 text-stone-400 whitespace-nowrap">
              <Truck className="w-3 h-3 text-amber-500" />
              <span>সারা দেশে হোম ডেলিভারি</span>
            </span>
            <span className="hidden lg:flex items-center gap-1 text-stone-400 whitespace-nowrap">
              <Clock className="w-3 h-3 text-amber-500" />
              <span>২৪-৪৮ ঘণ্টার মধ্যে ফাস্ট শিপিং</span>
            </span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 text-stone-300">
            <a
              href={`tel:${settings.contactPhone}`}
              className="hover:text-amber-400 transition-colors flex items-center gap-1 font-semibold"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>কল: {settings.contactPhone}</span>
            </a>
            <span className="text-stone-700 hidden sm:inline">|</span>
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
            >
              <MessageSquare className="w-3 h-3" />
              <span>হোয়াটসঅ্যাপ</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Left: 3-line hamburger menu + Brand */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <button
              id="hamburger-menu-btn"
              onClick={onOpenThreeLine}
              className="p-2 sm:p-2.5 rounded-xl border border-stone-200/90 text-stone-700 hover:text-stone-950 hover:bg-stone-100/80 transition-all flex items-center gap-2 group shadow-2xs"
              aria-label="3-line navigation menu"
              title="মেনু"
            >
              <Menu className="w-5 h-5 text-stone-800 group-hover:scale-105 transition-transform" />
              <span className="hidden sm:inline text-xs font-semibold text-stone-800">
                মেনু
              </span>
            </button>

            {/* Logo and Brand */}
            <button
              id="brand-logo-btn"
              onClick={() => setCurrentView('store')}
              className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-stone-900 via-amber-950 to-amber-700 text-white flex items-center justify-center font-serif font-black text-xl sm:text-2xl shadow-sm border border-amber-500/40 group-hover:border-amber-400 transition-colors">
                {(settings.storeName || 'K').trim().charAt(0).toUpperCase()}
              </div>
              <div className="leading-tight">
                <div className="font-serif font-black text-lg sm:text-2xl tracking-tight text-stone-900 flex items-center gap-1">
                  {(() => {
                    const parts = (settings.storeName || 'Khan Fashion').trim().split(/\s+/);
                    if (parts.length === 1) {
                      return <span>{parts[0]}</span>;
                    }
                    return (
                      <>
                        <span>{parts[0]}</span>
                        <span className="text-amber-700 font-sans font-extrabold ml-1">{parts.slice(1).join(' ')}</span>
                      </>
                    );
                  })()}
                </div>
                <div className="hidden xs:block text-[10px] sm:text-xs text-stone-500 font-medium tracking-wide">
                  {settings.tagline || 'প্রিমিয়াম কালেকশন • ক্যাশ অন ডেলিভারি'}
                </div>
              </div>
            </button>
          </div>

          {/* Center: Search Bar (Store View) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="desktop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="পাঞ্জাবি, শার্ট, ডেনিম জিন্স, টি-শার্ট, কুর্তি খুঁজুন..."
                className="w-full pl-10 pr-10 py-2.5 bg-stone-50/90 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:ring-2 focus:ring-amber-700 focus:bg-white focus:border-amber-700 outline-none transition-all placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-stone-400 hover:text-stone-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Hotline Call Button on Header */}
            <a
              href={`tel:${settings.contactPhone}`}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl border border-amber-200 bg-amber-50/80 hover:bg-amber-100/90 text-amber-950 text-xs font-semibold transition-all shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-amber-700" />
              <span>{settings.contactPhone}</span>
            </a>

            {/* View Switcher: Only visible if already authenticated */}
            {isAdminAuthenticated && (
              <button
                id="toggle-admin-view-btn"
                onClick={() => setCurrentView(currentView === 'admin' ? 'store' : 'admin')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  currentView === 'admin'
                    ? 'bg-amber-700 text-white border-amber-800 shadow-sm'
                    : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{currentView === 'admin' ? 'স্টোরে ফিরুন' : 'ড্যাশবোর্ড'}</span>
              </button>
            )}

            {/* Shopping Cart Trigger */}
            <button
              id="open-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white shadow-sm hover:shadow-md transition-all group"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span
                    id="cart-badge-count"
                    className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-stone-900 animate-scale-up"
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] text-stone-300 font-medium">Cart</span>
                <span className="text-xs font-bold text-amber-300">
                  {settings.currencySymbol}{cartTotal.toLocaleString()}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পাঞ্জাবি, শার্ট, ডেনিম প্যান্ট, টি-শার্ট খুঁজুন..."
              className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:ring-2 focus:ring-amber-700 focus:bg-white outline-none transition-all placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-stone-400"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
