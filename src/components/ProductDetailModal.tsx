import React, { useState } from 'react';
import { X, ShoppingBag, Zap, ShieldCheck, Truck, RefreshCw, Check, Phone, MessageSquare } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onInstantBuy: (product: Product, size: string, color: string, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onInstantBuy,
}) => {
  const { settings, addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAddedToast, setIsAddedToast] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');

  // Initialize size and color on product load
  React.useEffect(() => {
    if (product) {
      if (product.sizes?.length > 0) setSelectedSize(product.sizes[0]);
      if (product.colors?.length > 0) setSelectedColor(product.colors[0]);
      setActiveImage(product.imageUrl);
      setQuantity(1);
      setIsAddedToast(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const allImages = [product.imageUrl, ...(product.galleryImages || [])].filter(
    (url, idx, arr) => Boolean(url) && arr.indexOf(url) === idx
  );

  const handleAddToCart = () => {
    addToCart(product, selectedSize || 'Free Size', selectedColor || 'Standard', quantity);
    setIsAddedToast(true);
    setTimeout(() => {
      setIsAddedToast(false);
    }, 2500);
  };

  const handleBuyNow = () => {
    onInstantBuy(product, selectedSize || 'Free Size', selectedColor || 'Standard', quantity);
  };

  const cleanPhone = settings.contactPhone.replace(/[^0-9+]/g, '');
  const cleanWA = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const discountPercent =
    product.regularPrice > product.salePrice
      ? Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100)
      : 0;

  return (
    <div
      id="product-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in"
    >
      <div
        id="product-detail-modal-container"
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          id="close-product-detail-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md transition-all"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Image & Gallery */}
        <div className="md:w-1/2 bg-stone-100 relative min-h-[300px] md:min-h-[460px] flex flex-col justify-between">
          <div className="relative flex-1 flex items-center justify-center p-2">
            <img
              src={activeImage || product.imageUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center max-h-[360px] md:max-h-[420px] rounded-xl shadow-xs"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                {discountPercent}% ছাড়
              </span>
            )}
          </div>

          {/* Multiple Image Thumbnails */}
          {allImages.length > 1 && (
            <div className="p-3 bg-white/90 backdrop-blur-xs border-t border-stone-200 flex items-center gap-2 overflow-x-auto">
              {allImages.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-12 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    (activeImage || product.imageUrl) === imgUrl
                      ? 'border-amber-600 ring-2 ring-amber-600/30 shadow-xs scale-105'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} view ${i + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details */}
        <div className="md:w-1/2 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-800 font-bold mb-1">
              {settings.storeName} • এক্সক্লুসিভ
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
              {product.name}
            </h2>

            {/* Pricing */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-stone-900">
                {settings.currencySymbol}{product.salePrice.toLocaleString()}
              </span>
              {product.regularPrice > product.salePrice && (
                <span className="text-sm sm:text-base text-stone-400 line-through">
                  {settings.currencySymbol}{product.regularPrice.toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  সেভ করুন {settings.currencySymbol}{(product.regularPrice - product.salePrice).toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {product.fabric && (
              <div className="mt-2 text-xs text-stone-500">
                <span className="font-semibold text-stone-700">ফ্যাব্রিক / কাপড়:</span> {product.fabric}
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                    সাইজ সিলেক্ট করুন:
                  </span>
                  <span className="text-xs text-stone-500 font-mono">
                    সিলেক্টেড: <strong className="text-stone-800">{selectedSize}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[42px] py-1.5 px-3 rounded-lg text-xs font-bold border transition-all ${
                          isSelected
                            ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                    কালার / রঙ:
                  </span>
                  <span className="text-xs text-stone-500">
                    {selectedColor}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                পরিমাণ (Qty):
              </span>
              <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-stone-700 hover:bg-stone-200 text-sm font-bold"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-bold text-stone-900 min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  className="px-3 py-1.5 text-stone-700 hover:bg-stone-200 text-sm font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-stone-500">
                Stock: {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Action Buttons & 4 Options (Requested in Image 2) */}
          <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
            {isAddedToast && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                Added to Cart successfully!
              </div>
            )}

            {/* 4 Options Grid (2x2) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {/* Option 1: ADD TO CART (Orange) */}
              <button
                id="modal-add-to-cart-btn"
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="py-3 px-2 sm:px-4 rounded-xl bg-gradient-to-r from-[#f95700] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">ADD TO CART</span>
              </button>

              {/* Option 2: BUY NOW (Dark Slate/Black) */}
              <button
                id="modal-buy-now-btn"
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="py-3 px-2 sm:px-4 rounded-xl bg-[#0f172a] hover:bg-black text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-40"
              >
                <Zap className="w-4 h-4 fill-current text-amber-400 flex-shrink-0" />
                <span className="truncate">BUY NOW</span>
              </button>

              {/* Option 3: Order On WhatsApp (Green) */}
              <a
                id="modal-whatsapp-order-btn"
                href={`https://wa.me/${cleanWA}?text=${encodeURIComponent(
                  `Hello ${settings.storeName}! I want to order:\nProduct: ${product.name}\nSize: ${selectedSize || 'Standard'}\nColor: ${selectedColor || 'Standard'}\nQuantity: ${quantity}\nPrice: ${settings.currencySymbol}${(product.salePrice * quantity).toLocaleString()}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-2 sm:px-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md transition-all active:scale-95 text-center"
              >
                <MessageSquare className="w-4 h-4 fill-current flex-shrink-0" />
                <span className="truncate">Order On WhatsApp</span>
              </a>

              {/* Option 4: Call For Order (Deep Blue) */}
              <a
                id="modal-call-order-btn"
                href={`tel:${cleanPhone}`}
                className="py-3 px-2 sm:px-4 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md transition-all active:scale-95 text-center"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Call For Order</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-stone-500 text-center">
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-amber-700 mb-0.5" />
                <span>সারাদেশে ক্যাশ অন ডেলিভারি</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-amber-700 mb-0.5" />
                <span>১০০% প্রিমিয়াম কোয়ালিটি</span>
              </div>
              <div className="flex flex-col items-center">
                <RefreshCw className="w-4 h-4 text-amber-700 mb-0.5" />
                <span>৭ দিনের সহজ রিটার্ন</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
