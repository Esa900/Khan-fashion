import React, { useState } from 'react';
import { MessageSquare, Phone, X, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FloatingHelpProps {
  onOpenCart?: () => void;
}

export const FloatingHelp: React.FC<FloatingHelpProps> = ({ onOpenCart }) => {
  const { settings, cartCount } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const cleanPhone = settings.contactPhone.replace(/[^0-9+]/g, '');
  const cleanWA = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5">
      {/* Expanded Quick Contact Popover */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-stone-200/90 p-4 w-72 mb-1 animate-scale-up">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                {(settings.storeName || 'KF').trim().substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">{settings.storeName} হেল্পলাইন</h4>
                <p className="text-[10px] text-emerald-600 font-medium">● অনলাইনে আছেন</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-700 p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-600 mb-3">
            যেকোনো পোশাক অর্ডার করতে বা সাইজ জানতে সরাসরি আমাদের কল অথবা হোয়াটসঅ্যাপ করুন:
          </p>

          <div className="space-y-2">
            <a
              href={`https://wa.me/${cleanWA}?text=${encodeURIComponent(`হ্যালো ${settings.storeName}, আমি একটি পোশাক অর্ডার করতে চাই।`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>হোয়াটসঅ্যাপে অর্ডার করুন</span>
            </a>

            <a
              href={`tel:${cleanPhone}`}
              className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>সরাসরি ফোন করুন: {settings.contactPhone}</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <div className="flex items-center gap-2">
        {onOpenCart && cartCount > 0 && (
          <button
            onClick={onOpenCart}
            className="md:hidden flex items-center gap-1.5 py-2.5 px-4 bg-stone-900 text-white rounded-full shadow-xl border border-amber-500/40 text-xs font-bold active:scale-95 transition-transform"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Cart ({cartCount})</span>
          </button>
        )}

        <button
          id="floating-help-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-full shadow-2xl hover:shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95 group border-2 border-white"
          aria-label="Contact and Order Helpline"
        >
          <MessageSquare className="w-5 h-5 fill-current text-white animate-pulse" />
          <span className="text-xs font-bold whitespace-nowrap">
            অর্ডারে সাহায্য নিন
          </span>
        </button>
      </div>
    </div>
  );
};
