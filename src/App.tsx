import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { ThreeLineMenu } from './components/ThreeLineMenu';
import { AdminPasswordModal } from './components/AdminPasswordModal';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StoreHero } from './components/StoreHero';
import { StoreFooter } from './components/StoreFooter';
import { FloatingHelp } from './components/FloatingHelp';
import { Product, CartItem, Order } from './types';
import { Sparkles, SlidersHorizontal, ArrowUpDown, Layers, ShoppingBag } from 'lucide-react';

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'panjabi': return '🪡';
    case 'pant': return '👖';
    case 'jama': return '👗';
    case 'kapor': return '🧵';
    case 'shirts': return '👔';
    case 'tshirts': return '👕';
    default: return '✨';
  }
};

const StoreContent: React.FC = () => {
  const { products, categories, settings, isAdminAuthenticated } = useStore();

  // Navigation & UI States
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [isThreeLineOpen, setIsThreeLineOpen] = useState(false);
  const [isAdminPasswordOpen, setIsAdminPasswordOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Direct checkout item
  const [directBuyItem, setDirectBuyItem] = useState<CartItem | null>(null);

  // Product modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Store Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  // Trigger Admin
  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setCurrentView('admin');
    } else {
      setIsAdminPasswordOpen(true);
    }
  };

  const handleAdminSuccess = () => {
    setIsAdminPasswordOpen(false);
    setCurrentView('admin');
  };

  // Quick Order (from Card)
  const handleQuickOrder = (prod: Product) => {
    const size = prod.sizes?.[0] || 'Free Size';
    const color = prod.colors?.[0] || 'Standard';
    setDirectBuyItem({
      product: prod,
      selectedSize: size,
      selectedColor: color,
      quantity: 1,
    });
    setIsCheckoutOpen(true);
  };

  // Instant Buy (from Detail Modal)
  const handleInstantBuy = (prod: Product, size: string, color: string, quantity: number) => {
    setSelectedProduct(null);
    setDirectBuyItem({
      product: prod,
      selectedSize: size,
      selectedColor: color,
      quantity,
    });
    setIsCheckoutOpen(true);
  };

  // Order Success handler
  const handleOrderSuccess = (order: Order) => {
    setIsCheckoutOpen(false);
    setDirectBuyItem(null);
    setCompletedOrder(order);
    setIsSuccessOpen(true);
  };

  // Filter and sort products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.salePrice - b.salePrice;
    if (sortBy === 'price-desc') return b.salePrice - a.salePrice;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    // Default featured / sales count
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  // If admin view is requested & authenticated
  if (currentView === 'admin' && isAdminAuthenticated) {
    return <AdminDashboard onBackToStore={() => setCurrentView('store')} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col selection:bg-amber-200 selection:text-amber-950 font-sans">
      {/* Header */}
      <Header
        onOpenThreeLine={() => setIsThreeLineOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* 3-Line Menu Drawer */}
      <ThreeLineMenu
        isOpen={isThreeLineOpen}
        onClose={() => setIsThreeLineOpen(false)}
        onOpenAdmin={handleOpenAdmin}
        onSelectCategory={setSelectedCategory}
        currentCategory={selectedCategory}
      />

      {/* Main Catalog Body */}
      <main id="products-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Category Filter Pills (Ordered by user requirement: Jama, Kapor, Pant, Panjabi, Shirts) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-700" />
              <span>ক্যাটাগরি অনুযায়ী পোশাক নির্বাচন করুন</span>
            </h2>
            <span className="text-xs text-stone-500 font-medium">
              মোট {sortedProducts.length} টি আইটেম
            </span>
          </div>

          {/* Categories Tab Row */}
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 scrollbar-none py-1">
            {/* All Products pill */}
            <button
              id="cat-pill-all"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 border shadow-2xs ${
                selectedCategory === 'all'
                  ? 'bg-stone-900 text-white border-stone-900 ring-2 ring-amber-600/30 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <span className="text-sm">✨</span>
              <span>সব পোশাক</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                selectedCategory === 'all' ? 'bg-amber-500 text-stone-950' : 'bg-stone-100 text-stone-600'
              }`}>
                {products.length}
              </span>
            </button>

            {/* Individual categories */}
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              const count = products.filter((p) => p.category === cat.slug).length;

              return (
                <button
                  key={cat.id}
                  id={`cat-pill-${cat.slug}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 border shadow-2xs ${
                    isSelected
                      ? 'bg-amber-800 text-white border-amber-900 ring-2 ring-amber-600/30 shadow-sm'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <span className="text-sm">{getCategoryIcon(cat.slug)}</span>
                  <span>{cat.name}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-amber-950 text-amber-200' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort & active search summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-200">
          <div>
            {searchQuery ? (
              <p className="text-sm text-stone-700">
                অনুসন্ধানের ফলাফল: "<strong>{searchQuery}</strong>" ({sortedProducts.length} টি পোশাক পাওয়া গেছে)
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-stone-600">
                {selectedCategory === 'all'
                  ? `${settings.storeName}-এর সর্বশেষ ও জনপ্রিয় পোশাকসমূহ`
                  : categories.find((c) => c.slug === selectedCategory)?.description || 'নির্বাচিত কালেকশন'}
              </p>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              ক্রমানুসার:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-3 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 outline-none focus:ring-2 focus:ring-amber-600 cursor-pointer"
            >
              <option value="featured">জনপ্রিয় কালেকশন (Featured)</option>
              <option value="price-asc">দাম: কম থেকে বেশি</option>
              <option value="price-desc">দাম: বেশি থেকে কম</option>
              <option value="newest">নতুন সংযোজিত (Newest)</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8">
            <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-3 stroke-1" />
            <h3 className="text-base font-bold text-stone-800">কোনো পোশাক খুঁজে পাওয়া যায়নি</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              ভিন্ন কোনো নাম অথবা অন্য ক্যাটাগরি নির্বাচন করে চেষ্টা করুন।
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 py-2 px-4 rounded-xl bg-amber-700 text-white text-xs font-semibold hover:bg-amber-800 transition-colors"
            >
              সকল পোশাক দেখুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {sortedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={(p) => setSelectedProduct(p)}
                onQuickOrder={handleQuickOrder}
              />
            ))}
          </div>
        )}
      </main>

      {/* Bottom Trust & Order Highlights Banner */}
      {!searchQuery && (
        <StoreHero
          onShopNow={() => {
            const el = document.getElementById('products-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Store Footer */}
      <StoreFooter
        onSelectCategory={(slug) => {
          setSelectedCategory(slug);
          const el = document.getElementById('products-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Admin Password Modal (ESA006##) */}
      <AdminPasswordModal
        isOpen={isAdminPasswordOpen}
        onClose={() => setIsAdminPasswordOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onInstantBuy={handleInstantBuy}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setDirectBuyItem(null);
        }}
        onSuccess={handleOrderSuccess}
        directBuyItem={directBuyItem}
      />

      {/* Order Success Modal */}
      <OrderSuccessModal
        order={completedOrder}
        isOpen={isSuccessOpen}
        onClose={() => {
          setIsSuccessOpen(false);
          setCompletedOrder(null);
        }}
      />

      {/* Floating Fast Helpline & Order Button */}
      <FloatingHelp onOpenCart={() => setIsCartOpen(true)} />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
