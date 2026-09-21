import React from 'react';
import { X, Shield, ShoppingBag, Phone, MessageSquare, Tag, Info, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface ThreeLineMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin: () => void;
  onSelectCategory: (categorySlug: string) => void;
  currentCategory: string;
}

export const ThreeLineMenu: React.FC<ThreeLineMenuProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
  onSelectCategory,
  currentCategory,
}) => {
  const { categories, settings, isAdminAuthenticated } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        id="three-line-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Drawer */}
      <div
        id="three-line-drawer"
        className="relative ml-0 mr-auto w-full max-w-xs bg-stone-900 text-stone-100 h-full shadow-2xl flex flex-col z-10 overflow-y-auto animate-slide-right"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-black text-stone-950 text-base shadow-sm">
                {(settings.storeName || 'K').trim().charAt(0).toUpperCase()}
              </div>
              <span className="font-bold text-lg tracking-wide text-stone-100">
                {settings.storeName || 'Khan Fashion'}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {settings.tagline || 'এক্সক্লুসিভ ক্লোথিং & লাইফস্টাইল'}
            </p>
          </div>
          <button
            id="close-three-line-menu-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Line Menu Item: Just App Name with Smile Emoji as requested */}
        <div className="p-3 border-b border-stone-800">
          <button
            id="admin-panel-menu-btn"
            onClick={() => {
              onClose();
              onOpenAdmin();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-stone-200 hover:text-white hover:bg-stone-800/80 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">😊</span>
              <span className="font-semibold">{settings.storeName || 'Khan Fashion'}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* Categories Section */}
        <div className="p-4 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-amber-500" /> ক্যাটাগরি কালেকশন
          </div>
          
          <div className="space-y-1">
            <button
              id="cat-drawer-all"
              onClick={() => {
                onSelectCategory('all');
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                currentCategory === 'all'
                  ? 'bg-amber-600/20 text-amber-400 font-semibold border border-amber-500/30'
                  : 'text-stone-300 hover:bg-stone-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-amber-500" />
                <span>সব পোশাক (All Products)</span>
              </div>
              {currentCategory === 'all' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            {categories.map((cat) => {
              const isSelected = currentCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  id={`cat-drawer-${cat.slug}`}
                  onClick={() => {
                    onSelectCategory(cat.slug);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                    isSelected
                      ? 'bg-amber-600/20 text-amber-400 font-semibold border border-amber-500/30'
                      : 'text-stone-300 hover:bg-stone-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span className="truncate">{cat.name}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Quick Help & Info */}
          <div className="mt-6 pt-4 border-t border-stone-800 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-500" /> সরাসরি যোগাযোগ
            </div>
            
            <a
              href={`tel:${settings.contactPhone}`}
              className="flex items-center gap-2.5 px-3 py-2 text-xs text-stone-300 hover:text-amber-400 hover:bg-stone-800/50 rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-500" />
              <span>কল করুন: {settings.contactPhone}</span>
            </a>

            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 text-xs text-stone-300 hover:text-emerald-400 hover:bg-stone-800/50 rounded-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>হোয়াটসঅ্যাপ সাপোর্ট</span>
            </a>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-stone-800/80 bg-stone-950 text-center text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {settings.storeName || 'Khan Fashion'}. সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </div>
  );
};
