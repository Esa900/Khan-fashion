import React, { useState } from 'react';
import { Settings, Save, AlertTriangle, Check, Phone, Truck, ShieldCheck, Bell } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StoreSettings } from '../../types';

export const StoreControlTab: React.FC = () => {
  const { settings, updateSettings } = useStore();

  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [saveToast, setSaveToast] = useState(false);

  React.useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  return (
    <div id="store-control-tab" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <span>স্টোর কন্ট্রোল ও সেটিংস (Store Control)</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${formData.isStoreOpen ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'}`}>
              {formData.isStoreOpen ? '● স্টোর সক্রিয় (Open)' : '● স্টোর সাময়িক বন্ধ'}
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            ওয়েবসাইটের নাম, ফোন নম্বর, হোয়াটসঅ্যাপ, নোটিশ ব্যানার ও ডেলিভারি চার্জ পরিবর্তন করলেই পুরো স্টোরে সাথে সাথে আপডেট হবে।
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all self-start sm:self-auto active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>সেভ করুন ও লাইভ দেখুন</span>
        </button>
      </div>

      {saveToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2.5 shadow-sm animate-scale-up">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>সকল স্টোর সেটিংস (নাম, ফোন, নোটিশ, ডেলিভারি ফি) সফলভাবে সংরক্ষিত ও লাইভ স্টোরে যুক্ত হয়েছে!</span>
        </div>
      )}

      {/* Realtime Live Preview Strip */}
      <div className="p-4 bg-stone-900 text-white rounded-2xl border border-stone-800 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-[11px] text-stone-400 font-semibold border-b border-stone-800 pb-1.5">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            লাইভ প্রিভিউ (আপনার স্টোরে যেভাবে দেখা যাবে)
          </span>
          <span className="text-amber-400 font-mono">Realtime Store Header</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-stone-800 via-amber-950 to-amber-700 text-white flex items-center justify-center font-serif font-black text-lg border border-amber-500/40">
              {(formData.storeName || 'K').trim().charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-serif font-black text-base tracking-tight text-white flex items-center gap-1">
                <span>{(formData.storeName || 'Khan Fashion')}</span>
              </div>
              <div className="text-[10px] text-stone-400">
                {formData.tagline || 'প্রিমিয়াম কালেকশন • ক্যাশ অন ডেলিভারি'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-stone-800 text-amber-300 border border-stone-700 font-mono">
              📞 {formData.contactPhone || 'ফোন নম্বর নেই'}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 text-emerald-300 border border-emerald-800 font-mono">
              💬 WhatsApp: {formData.whatsappNumber || 'হোয়াটসঅ্যাপ নেই'}
            </span>
          </div>
        </div>

        {formData.isNoticeActive && formData.noticeBannerText && (
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs rounded-lg flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="line-clamp-1">{formData.noticeBannerText}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Basic Brand Information */}
        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>ব্র্যান্ড ও দোকানের তথ্য</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                স্টোরের নাম (Store Name) *
              </label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-600 font-bold text-stone-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                ট্যাগলাইন (Tagline)
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                যোগাযোগের ফোন নম্বর
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-600 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                হোয়াটসঅ্যাপ নম্বর (WhatsApp Support)
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-600 font-mono"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-stone-700 mb-1">
              দোকান বা আউটলেটের ঠিকানা
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none"
            />
          </div>
        </div>

        {/* Announcement / Notice Banner */}
        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-700" />
              <span>ওয়েবসাইট নোটিশ ব্যানার (Notice Bar)</span>
            </h3>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNoticeActive}
                onChange={(e) => setFormData({ ...formData, isNoticeActive: e.target.checked })}
                className="text-amber-700 rounded focus:ring-amber-600"
              />
              <span className="text-xs font-semibold text-stone-700">ব্যানার চালু রাখুন</span>
            </label>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-stone-700 mb-1">
              নোটিশ বার্তা (ওয়েবসাইটের শীর্ষে প্রদর্শিত হবে)
            </label>
            <input
              type="text"
              value={formData.noticeBannerText}
              onChange={(e) => setFormData({ ...formData, noticeBannerText: e.target.value })}
              placeholder="যেমন: 🔥 ঈদ ধামাকা অফার! ১৫০০ টাকার কেনাকাটায় সারাদেশে ফ্রি হোম ডেলিভারি!"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>
        </div>

        {/* Delivery & Shipping Control */}
        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-700" />
            <span>ডেলিভারি চার্জ ও ফ্রি শিপিং নিয়ন্ত্রণ</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                ঢাকা সিটির ভেতরে ডেলিভারি চার্জ (৳)
              </label>
              <input
                type="number"
                min={0}
                value={formData.deliveryFeeInsideDhaka}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryFeeInsideDhaka: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                ঢাকার বাইরে ডেলিভারি চার্জ (৳)
              </label>
              <input
                type="number"
                min={0}
                value={formData.deliveryFeeOutsideDhaka}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryFeeOutsideDhaka: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                ফ্রি ডেলিভারি ন্যূনতম অর্ডার (৳)
              </label>
              <input
                type="number"
                min={0}
                value={formData.freeShippingAbove}
                onChange={(e) =>
                  setFormData({ ...formData, freeShippingAbove: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none font-mono"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                (০ দিলে ফ্রি ডেলিভারি অফ থাকবে)
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Financial Payments (bKash / Nagad) */}
        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-pink-600" />
            <span>মোবাইল ব্যাংকিং পেমেন্ট নম্বর</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                বিকাশ (bKash) নম্বর ও টাইপ
              </label>
              <input
                type="text"
                value={formData.bkashNumber}
                onChange={(e) => setFormData({ ...formData, bkashNumber: e.target.value })}
                placeholder="017xxxxxxxx (Personal/Merchant)"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                নগদ (Nagad) নম্বর ও টাইপ
              </label>
              <input
                type="text"
                value={formData.nagadNumber}
                onChange={(e) => setFormData({ ...formData, nagadNumber: e.target.value })}
                placeholder="017xxxxxxxx (Personal)"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save */}
        <div className="flex items-center justify-end pt-4 border-t border-stone-200">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>পরিবর্তন সংরক্ষণ করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
};
