import React from 'react';
import { ShoppingBag, ShoppingCart, Eye, Zap, Star } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onQuickOrder: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onQuickOrder,
}) => {
  const { settings, categories } = useStore();

  const discountPercent =
    product.regularPrice > product.salePrice
      ? Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100)
      : 0;

  const categoryObj = categories.find((c) => c.slug === product.category);

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-white border border-stone-200/90 rounded-2xl overflow-hidden hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
    >
      {/* Product Image Area */}
      <div
        className="relative aspect-[3/4] bg-stone-100 overflow-hidden cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
              {discountPercent}% ছাড়
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-stone-900/90 backdrop-blur-xs text-amber-300 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-400/40 shadow-sm">
              ★ সেরা পছন্দ
            </span>
          )}
        </div>

        {/* Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
            <span className="bg-amber-950/85 backdrop-blur-xs text-amber-200 text-[10px] font-medium px-2 py-0.5 rounded-md border border-amber-600/30">
              মাত্র {product.stock} টি অবশিষ্ট
            </span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider shadow-md">
              স্টক শেষ (Sold Out)
            </span>
          </div>
        )}

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4 pointer-events-none group-hover:pointer-events-auto">
          <button
            id={`quick-view-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-3 bg-white/95 hover:bg-white text-stone-900 rounded-full shadow-lg hover:scale-110 transition-all"
            title="ডিটেইলস দেখুন"
          >
            <Eye className="w-4 h-4 text-stone-800" />
          </button>
        </div>
      </div>

      {/* Details Area */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] sm:text-[11px] font-semibold text-amber-800 uppercase tracking-wide">
              {categoryObj?.nameBn || categoryObj?.name || product.category}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              <span>4.9</span>
            </span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-2 hover:text-amber-800 cursor-pointer transition-colors leading-snug"
          >
            {product.name}
          </h3>

          {/* Sizes badges */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1">
              <span className="text-[10px] text-stone-400">Size:</span>
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="px-1.5 py-0.2 bg-stone-100 text-stone-700 rounded text-[10px] font-mono border border-stone-200"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[10px] text-stone-400 font-mono">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Order CTA */}
        <div className="mt-3.5 pt-2.5 border-t border-stone-100">
          <div className="flex items-baseline justify-between gap-2 mb-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-stone-900">
                {settings.currencySymbol}{product.salePrice.toLocaleString()}
              </span>
              {product.regularPrice > product.salePrice && (
                <span className="text-xs text-stone-400 line-through">
                  {settings.currencySymbol}{product.regularPrice.toLocaleString()}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                Save {settings.currencySymbol}{(product.regularPrice - product.salePrice).toLocaleString()}
              </span>
            )}
          </div>

          {/* Action Buttons (English as requested in Image 1) */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              id={`quick-cart-btn-${product.id}`}
              onClick={() => onQuickView(product)}
              disabled={product.stock === 0}
              className="w-full py-2 px-1 sm:px-2 rounded-xl border border-orange-500 bg-white hover:bg-orange-50/80 text-orange-600 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-2xs hover:shadow-xs disabled:opacity-40"
              title="Add To Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
              <span className="truncate">Add To Cart</span>
            </button>

            <button
              id={`quick-order-btn-${product.id}`}
              onClick={() => onQuickOrder(product)}
              disabled={product.stock === 0}
              className="w-full py-2 px-1 sm:px-2 rounded-xl bg-gradient-to-r from-[#f95700] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white text-[11px] sm:text-xs font-black flex items-center justify-center gap-1 sm:gap-1.5 shadow-2xs transition-all hover:shadow-sm disabled:opacity-40 active:scale-95"
              title="Order Now"
            >
              <Zap className="w-3.5 h-3.5 fill-current flex-shrink-0 text-white" />
              <span className="truncate">Order Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
