import React, { useState } from 'react';
import { X, CheckCircle, Truck, Phone, User, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CartItem, Order, OrderItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (order: Order) => void;
  directBuyItem?: CartItem | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  directBuyItem,
}) => {
  const { cart, cartTotal, settings, placeOrder, clearCart } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('ঢাকা');
  const [zone, setZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Determine items to order (either from cart or single direct buy)
  const itemsToOrder: CartItem[] = directBuyItem ? [directBuyItem] : cart;

  if (itemsToOrder.length === 0) {
    return null;
  }

  const subtotal = itemsToOrder.reduce(
    (sum, item) => sum + item.product.salePrice * item.quantity,
    0
  );

  const isFreeShipping = settings.freeShippingAbove > 0 && subtotal >= settings.freeShippingAbove;
  const deliveryFee = isFreeShipping
    ? 0
    : zone === 'inside_dhaka'
    ? settings.deliveryFeeInsideDhaka
    : settings.deliveryFeeOutsideDhaka;

  const totalAmount = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim()) {
      setError('অনুগ্রহ করে আপনার নাম লিখুন।');
      return;
    }
    if (!phone.trim() || phone.trim().length < 11) {
      setError('অনুগ্রহ করে একটি সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)');
      return;
    }
    if (!address.trim()) {
      setError('অনুগ্রহ করে আপনার সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন।');
      return;
    }

    if (paymentMethod !== 'cod' && !trxId.trim()) {
      setError('বিকাশ বা নগদ পেমেন্টের ট্রানজেকশন আইডি (TrxID) প্রদান করুন।');
      return;
    }

    setIsSubmitting(true);

    setTimeout(async () => {
      const orderItems: OrderItem[] = itemsToOrder.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        imageUrl: item.product.imageUrl,
        price: item.product.salePrice,
        size: item.selectedSize,
        color: item.selectedColor,
        quantity: item.quantity,
      }));

      const newOrder = await placeOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        district: zone === 'inside_dhaka' ? 'ঢাকা' : district.trim() || 'অন্যান্য জেলা',
        zone,
        paymentMethod,
        paymentPhone: paymentPhone.trim() || undefined,
        trxId: trxId.trim() || undefined,
        notes: notes.trim() || undefined,
        items: orderItems,
        subtotal,
        deliveryFee,
        totalAmount,
        status: 'pending',
      });

      if (!directBuyItem) {
        clearCart();
      }

      setIsSubmitting(false);
      onSuccess(newOrder);
    }, 400);
  };

  return (
    <div
      id="checkout-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto animate-fade-in"
    >
      <div
        id="checkout-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <span>অর্ডার সম্পন্ন করুন</span>
              <span className="text-amber-400 font-normal text-xs">
                (১ মিনিটে দ্রুত অর্ডার)
              </span>
            </h2>
            <p className="text-xs text-stone-300">
              পণ্য হাতে পেয়ে মূল্য পরিশোধের সুবিধা (Cash on Delivery)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Delivery Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-700" />
              আপনার তথ্য ও ডেলিভারি ঠিকানা
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  আপনার পূর্ণ নাম *
                </label>
                <input
                  id="checkout-name-input"
                  type="text"
                  required
                  placeholder="যেমন: তানভীর আহমেদ"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-600 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  মোবাইল নম্বর * (১১ ডিজিট)
                </label>
                <input
                  id="checkout-phone-input"
                  type="tel"
                  required
                  placeholder="017xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-600 focus:bg-white outline-none"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                সম্পূর্ণ ঠিকানা (বাসা নং, রোড, এরিয়া, থানা) *
              </label>
              <textarea
                id="checkout-address-input"
                required
                rows={2}
                placeholder="যেমন: বাড়ি # ১২, রোড # ৫, সেক্টর # ৭, উত্তরা, ঢাকা"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-600 focus:bg-white outline-none resize-none"
              />
            </div>

            {/* Delivery Area Selection */}
            <div className="mt-3">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                ডেলিভারি এরিয়া সিলেক্ট করুন
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    zone === 'inside_dhaka'
                      ? 'border-amber-700 bg-amber-50/70 text-amber-950 font-semibold'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryZone"
                      checked={zone === 'inside_dhaka'}
                      onChange={() => setZone('inside_dhaka')}
                      className="text-amber-700 focus:ring-amber-600"
                    />
                    <span className="text-xs sm:text-sm">ঢাকা সিটির ভেতরে</span>
                  </div>
                  <span className="text-xs font-bold text-amber-800">
                    {isFreeShipping ? 'ফ্রি' : `${settings.currencySymbol}${settings.deliveryFeeInsideDhaka}`}
                  </span>
                </label>

                <label
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    zone === 'outside_dhaka'
                      ? 'border-amber-700 bg-amber-50/70 text-amber-950 font-semibold'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryZone"
                      checked={zone === 'outside_dhaka'}
                      onChange={() => setZone('outside_dhaka')}
                      className="text-amber-700 focus:ring-amber-600"
                    />
                    <span className="text-xs sm:text-sm">ঢাকার বাইরে (সারাদেশ)</span>
                  </div>
                  <span className="text-xs font-bold text-amber-800">
                    {isFreeShipping ? 'ফ্রি' : `${settings.currencySymbol}${settings.deliveryFeeOutsideDhaka}`}
                  </span>
                </label>
              </div>
            </div>

            {zone === 'outside_dhaka' && (
              <div className="mt-3">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  আপনার জেলা / শহর
                </label>
                <input
                  type="text"
                  placeholder="যেমন: চট্টগ্রাম / সিলেট / রাজশাহী / খুলনা"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm outline-none"
                />
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="pt-3 border-t border-stone-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-amber-700" />
              মূল্য পরিশোধের পদ্ধতি (Payment Method)
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-amber-700 bg-amber-50 text-amber-950 font-bold shadow-xs'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="text-xs font-bold">ক্যাশ অন ডেলিভারি</div>
                <div className="text-[10px] text-stone-500 mt-0.5">হাতে পেয়ে টাকা দিন</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-600 bg-pink-50 text-pink-900 font-bold shadow-xs'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="text-xs font-bold text-pink-700">বিকাশ (bKash)</div>
                <div className="text-[10px] text-stone-500 mt-0.5">সেন্ড মানি / মার্চেন্ট</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'nagad'
                    ? 'border-orange-600 bg-orange-50 text-orange-900 font-bold shadow-xs'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="text-xs font-bold text-orange-700">নগদ (Nagad)</div>
                <div className="text-[10px] text-stone-500 mt-0.5">সেন্ড মানি</div>
              </button>
            </div>

            {/* bKash / Nagad Info Box */}
            {paymentMethod !== 'cod' && (
              <div className="mt-3 p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs">
                <p className="text-stone-700 font-medium">
                  আমাদের {paymentMethod === 'bkash' ? 'বিকাশ' : 'নগদ'} নম্বর:{' '}
                  <strong className="text-stone-900 select-all font-mono">
                    {paymentMethod === 'bkash' ? settings.bkashNumber : settings.nagadNumber}
                  </strong>
                </p>
                <p className="text-[11px] text-stone-500">
                  উক্ত নম্বরে মোট <strong>{settings.currencySymbol}{totalAmount.toLocaleString()}</strong> টাকা পাঠিয়ে ট্রানজেকশন আইডি দিন।
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      যে নম্বর থেকে পাঠিয়েছেন:
                    </label>
                    <input
                      type="text"
                      placeholder="01xxxxxxxxx"
                      value={paymentPhone}
                      onChange={(e) => setPaymentPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      ট্রানজেকশন আইডি (TrxID) *:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9J8B2910"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Box */}
          <div className="p-3.5 bg-stone-100 rounded-xl space-y-1.5 text-xs text-stone-700">
            <div className="font-bold text-stone-900 mb-1">অর্ডার সামারি ({itemsToOrder.length} টি আইটেম)</div>
            <div className="flex justify-between">
              <span>পণ্য মূল্য:</span>
              <span>{settings.currencySymbol}{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>ডেলিভারি চার্জ:</span>
              <span>
                {deliveryFee === 0 ? 'ফ্রি' : `${settings.currencySymbol}${deliveryFee.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-stone-200 text-stone-950 font-extrabold text-sm">
              <span>সর্বমোট প্রদেয় বিল:</span>
              <span className="text-amber-800 text-base">{settings.currencySymbol}{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="submit-order-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>অর্ডার প্রসেস হচ্ছে...</span>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 text-amber-300" />
                <span>অর্ডার নিশ্চিত করুন ({settings.currencySymbol}{totalAmount.toLocaleString()})</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
