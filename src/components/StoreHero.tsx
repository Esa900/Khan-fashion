import React from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Award, ArrowUp, Phone, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface StoreHeroProps {
  onShopNow: () => void;
}

export const StoreHero: React.FC<StoreHeroProps> = ({ onShopNow }) => {
  const { settings } = useStore();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-950 to-black text-white border-t border-b border-stone-800 my-8">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Brand Trust Proposition */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings.storeName} এক্সক্লুসিভ কালেকশন • ১০০% কোয়ালিটি গ্যারান্টি</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white leading-tight">
              কেন <span className="text-amber-400 font-sans">{settings.storeName}</span> থেকে পোশাক কিনবেন?
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              আমরা দিচ্ছি প্রতিটি কাপড়ে সেরা সুতার নিখুঁত বুনন ও দীর্ঘস্থায়ী রঙের নিশ্চয়তা। 
              সারা দেশে ক্যাশ অন ডেলিভারিতে পার্সেল দেখে নেওয়ার সুবিধা রয়েছে।
            </p>

            {/* Quality Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-stone-300 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>প্রিমিয়াম কোয়ালিটি ফেব্রিক</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>পার্সেল খুলে দেখে পেমেন্ট</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>সহজ এক্সচেঞ্জ সুবিধা</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>দ্রুত সারা দেশে ডেলিভারি</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={onShopNow}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-900/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <ArrowUp className="w-4 h-4" />
                <span>সব পোশাক দেখুন</span>
              </button>
              
              <a
                href={`tel:${settings.contactPhone}`}
                className="py-3 px-5 rounded-xl bg-stone-800/90 hover:bg-stone-800 text-stone-200 text-xs sm:text-sm font-semibold border border-stone-700 transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>সরাসরি অর্ডার: {settings.contactPhone}</span>
              </a>
            </div>
          </div>

          {/* Right: 4 High-end Feature Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">ক্যাশ অন ডেলিভারি</h4>
                <p className="text-[11px] text-stone-400 mt-1 leading-snug">পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন নিশ্চিন্তে</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">১০০% কটন ফেব্রিক</h4>
                <p className="text-[11px] text-stone-400 mt-1 leading-snug">অত্যন্ত আরামদায়ক ও ১০০% কালার গ্যারান্টি</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <RefreshCw className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">সহজ এক্সচেঞ্জ</h4>
                <p className="text-[11px] text-stone-400 mt-1 leading-snug">সাইজ ফিটিং সমস্যা হলে দ্রুত পরিবর্তনের সুবিধা</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">বিশ্বস্ত শপ</h4>
                <p className="text-[11px] text-stone-400 mt-1 leading-snug">সারা দেশের হাজারো সন্তুষ্ট গ্রাহকের আস্থা</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
