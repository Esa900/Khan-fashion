import React from 'react';
import { Phone, MessageSquare, MapPin, Truck, ShieldCheck, Heart, Clock, CheckCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface StoreFooterProps {
  onSelectCategory: (cat: string) => void;
}

export const StoreFooter: React.FC<StoreFooterProps> = ({ onSelectCategory }) => {
  const { settings, categories } = useStore();

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      {/* Top Value Banner */}
      <div className="border-b border-stone-800/80 py-8 bg-stone-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3">
              <Truck className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <h5 className="text-xs sm:text-sm font-bold text-white">সারা দেশে ডেলিভারি</h5>
              <p className="text-[11px] text-stone-400 mt-0.5">ঢাকা ও ঢাকার বাইরে দ্রুত পৌঁছানো হয়</p>
            </div>
            <div className="p-3">
              <ShieldCheck className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <h5 className="text-xs sm:text-sm font-bold text-white">ক্যাশ অন ডেলিভারি</h5>
              <p className="text-[11px] text-stone-400 mt-0.5">পণ্য হাতে পেয়ে চেক করে মূল্য দিন</p>
            </div>
            <div className="p-3">
              <CheckCircle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <h5 className="text-xs sm:text-sm font-bold text-white">১০০% অরিজিনাল পণ্য</h5>
              <p className="text-[11px] text-stone-400 mt-0.5">সেরা কটন ফেব্রিক ও আধুনিক কাটিং</p>
            </div>
            <div className="p-3">
              <Clock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <h5 className="text-xs sm:text-sm font-bold text-white">২৪/৭ কাস্টমার সাপোর্ট</h5>
              <p className="text-[11px] text-stone-400 mt-0.5">যেকোনো তথ্যে ফোন বা হোয়াটসঅ্যাপ করুন</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3.5 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-stone-900 via-amber-950 to-amber-700 text-white flex items-center justify-center font-serif font-black text-xl border border-amber-500/40">
                {(settings.storeName || 'K').trim().charAt(0).toUpperCase()}
              </div>
              <span className="font-serif font-bold text-2xl text-white tracking-tight">
                {settings.storeName}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {settings.tagline || 'সেরা কোয়ালিটির জামা, কাপড় ও প্যান্ট কালেকশন।'} আপনার আভিজাত্য ও ব্যক্তিত্বের পূর্ণতা এনে দিতে আমরা প্রতিশ্রুতিবদ্ধ।
            </p>
            <div className="text-xs text-stone-400 pt-1 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3.5">
              পোশাক ক্যাটাগরি
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onSelectCategory(c.slug)}
                    className="text-stone-400 hover:text-amber-400 transition-colors"
                  >
                    • {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care & Helpline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3.5">
              কাস্টমার সাপোর্ট ও হেল্পলাইন
            </h4>
            <div className="space-y-3 text-xs text-stone-400">
              <a
                href={`tel:${settings.contactPhone}`}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 transition-colors text-stone-200"
              >
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div className="text-left">
                  <div className="text-[10px] text-stone-400">সরাসরি কল করুন</div>
                  <div className="font-bold text-white text-xs">{settings.contactPhone}</div>
                </div>
              </a>

              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-950/40 border border-emerald-900/60 hover:border-emerald-500 transition-colors text-emerald-300"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div className="text-left">
                  <div className="text-[10px] text-emerald-400">হোয়াটসঅ্যাপ সাপোর্ট</div>
                  <div className="font-bold text-white text-xs">{settings.whatsappNumber}</div>
                </div>
              </a>

              <div className="flex items-center gap-2 text-stone-400 pt-1 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>প্রতিদিন সকাল ৯টা - রাত ১১টা</span>
              </div>
            </div>
          </div>

          {/* Payment & Delivery Partner Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3.5">
              নিরাপদ পেমেন্ট ও ডেলিভারি
            </h4>
            
            <div className="space-y-3">
              <div>
                <p className="text-[11px] text-stone-400 mb-1.5 font-medium">পেমেন্ট মাধ্যম:</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 rounded text-[11px] text-amber-300 font-bold">
                    💵 ক্যাশ অন ডেলিভারি
                  </span>
                  <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 rounded text-[11px] text-pink-400 font-bold">
                    বিকাশ (bKash)
                  </span>
                  <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 rounded text-[11px] text-orange-400 font-bold">
                    নগদ (Nagad)
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[11px] text-stone-400 mb-1.5 font-medium">ডেলিভারি পার্টনার:</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 rounded text-[10px] text-stone-300">
                    Steadfast Courier
                  </span>
                  <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 rounded text-[10px] text-stone-300">
                    Pathao
                  </span>
                  <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 rounded text-[10px] text-stone-300">
                    RedX Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-stone-800 text-center text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} {settings.storeName}. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <span>বিশ্বস্ত অনলাইন ফ্যাশন ব্র্যান্ড</span>
            <span>•</span>
            <span>বাংলাদেশে তৈরি</span>
            <Heart className="w-3 h-3 text-rose-500 fill-current inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
