import React from 'react';
import { CheckCircle, Package, Phone, Calendar, ArrowRight, Printer } from 'lucide-react';
import { Order } from '../types';
import { useStore } from '../context/StoreContext';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const { settings } = useStore();

  if (!isOpen || !order) return null;

  return (
    <div
      id="order-success-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto p-6 sm:p-8 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-50 shadow-inner animate-bounce">
          <CheckCircle className="w-9 h-9" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-stone-900">
          ধন্যবাদ! আপনার অর্ডারটি গ্রহণ করা হয়েছে
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          আমাদের কাস্টমার প্রতিনিধি শীঘ্রই কল করে আপনার অর্ডারটি কনফার্ম করবেন।
        </p>

        {/* Order Details Card */}
        <div className="mt-5 p-4 bg-stone-50 rounded-xl border border-stone-200 text-left space-y-2 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200">
            <span className="text-stone-500 font-medium">অর্ডার আইডি:</span>
            <span className="font-mono font-bold text-amber-800 text-sm bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              #{order.id}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-stone-500">গ্রাহকের নাম:</span>
            <span className="font-semibold text-stone-800">{order.customerName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-stone-500">মোবাইল:</span>
            <span className="font-semibold text-stone-800 font-mono">{order.phone}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-stone-500">ঠিকানা:</span>
            <span className="font-semibold text-stone-800 text-right max-w-[200px] truncate">{order.address}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-stone-500">পেমেন্ট মেথড:</span>
            <span className="font-semibold text-stone-800 uppercase">
              {order.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : order.paymentMethod}
            </span>
          </div>

          <div className="flex justify-between pt-2 border-t border-stone-200 text-stone-900 font-bold text-sm">
            <span>মোট প্রদেয় বিল:</span>
            <span className="text-amber-800 font-black">
              {settings.currencySymbol}{order.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-500">
          <Package className="w-4 h-4 text-amber-700" />
          <span>সম্ভাব্য ডেলিভারি সময়: <strong>২ - ৩ কার্যদিবস</strong></span>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.print()}
            className="py-2.5 px-4 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>রসিদ প্রিন্ট করুন</span>
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            <span>আরও কেনাকাটা করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
