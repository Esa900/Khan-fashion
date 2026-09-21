import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldAlert } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onCheckout,
}) => {
  const { cart, cartTotal, cartCount, updateCartQuantity, removeFromCart, clearCart, settings } = useStore();

  if (!isOpen) return null;

  const freeShippingDifference = settings.freeShippingAbove - cartTotal;
  const eligibleForFreeShipping = cartTotal >= settings.freeShippingAbove;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        id="cart-drawer-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Drawer Panel */}
      <div
        id="cart-drawer-panel"
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-700" />
            <h2 className="font-bold text-stone-900 text-base">
              শপিং কার্ট ({cartCount})
            </h2>
          </div>
          <button
            id="close-cart-drawer-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        {settings.freeShippingAbove > 0 && cart.length > 0 && (
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 text-xs">
            {eligibleForFreeShipping ? (
              <p className="text-emerald-800 font-semibold flex items-center gap-1.5">
                🎉 অভিনন্দন! আপনি ফ্রি হোম ডেলিভারি পাচ্ছেন।
              </p>
            ) : (
              <div>
                <p className="text-amber-900 font-medium mb-1">
                  আর <strong className="text-amber-800">{settings.currencySymbol}{freeShippingDifference.toLocaleString()}</strong> টাকার কেনাকাটায় ফ্রি ডেলিভারি!
                </p>
                <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (cartTotal / settings.freeShippingAbove) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <ShoppingBag className="w-16 h-16 text-stone-300 mb-3 stroke-1" />
              <p className="text-base font-semibold text-stone-700">আপনার কার্ট খালি রয়েছে</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                আমাদের দারুণ সব পাঞ্জাবি, শার্ট, ডেনিম প্যান্ট ও জামা কালেকশন থেকে পছন্দ করুন।
              </p>
              <button
                onClick={onClose}
                className="mt-5 py-2.5 px-6 rounded-xl bg-amber-700 text-white text-xs font-semibold hover:bg-amber-800 shadow-sm transition-all"
              >
                কেনাকাটা শুরু করুন
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                className="flex gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 relative group"
              >
                {/* Image */}
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-24 object-cover rounded-lg bg-stone-200 flex-shrink-0"
                />

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                      {item.product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                      <span>সাইজ: <strong className="text-stone-700">{item.selectedSize}</strong></span>
                      <span>•</span>
                      <span>কালার: <strong className="text-stone-700">{item.selectedColor}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-200/60">
                    {/* Qty controls */}
                    <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.product.id,
                            item.selectedSize,
                            item.selectedColor,
                            item.quantity - 1
                          )
                        }
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.product.id,
                            item.selectedSize,
                            item.selectedColor,
                            item.quantity + 1
                          )
                        }
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="text-xs font-bold text-stone-900">
                        {settings.currencySymbol}{(item.product.salePrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                  className="absolute top-2 right-2 text-stone-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>মোট পণ্য মূল্য:</span>
              <span className="font-bold text-stone-900 text-base">
                {settings.currencySymbol}{cartTotal.toLocaleString()}
              </span>
            </div>
            
            <p className="text-[11px] text-stone-500">
              * ডেলিভারি চার্জ চেকআউটে ঠিকানার ভিত্তিতে যুক্ত হবে।
            </p>

            <button
              id="proceed-checkout-btn"
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Order Now (Checkout)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={clearCart}
              className="w-full text-center text-xs text-stone-500 hover:text-rose-600 font-medium py-1 transition-colors"
            >
              কার্ট পরিষ্কার করুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
