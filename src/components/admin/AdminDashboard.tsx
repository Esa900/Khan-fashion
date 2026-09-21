import React, { useState } from 'react';
import { BarChart3, Package, Layers, ShoppingCart, Sliders, LogOut, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SellAnalysisTab } from './SellAnalysisTab';
import { ProductManagementTab } from './ProductManagementTab';
import { CategoryManagementTab } from './CategoryManagementTab';
import { OrderListTab } from './OrderListTab';
import { StoreControlTab } from './StoreControlTab';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

type AdminTab = 'analytics' | 'products' | 'categories' | 'orders' | 'control';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const { logoutAdmin, orders, products, categories, settings } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const handleLogout = () => {
    logoutAdmin();
    onBackToStore();
  };

  return (
    <div id="admin-dashboard-container" className="min-h-screen bg-stone-100 flex flex-col">
      {/* Admin Top Bar */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* Left: Brand + Smile emoji tag */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToStore}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
                title="ওয়েবসাইটে ফিরে যান"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">স্টোরে ফিরুন</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-stone-950 font-black text-sm">
                  K
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5 leading-none">
                    <span>{settings.storeName || 'Khan Fashion'}</span>
                    <span className="text-amber-400">😊</span>
                    <span className="hidden xs:inline text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-300 ml-1">
                      অ্যাডমিন
                    </span>
                  </h1>
                  <span className="text-[10px] text-stone-400 font-mono">
                    সুরক্ষিত কন্ট্রোল প্যানেল (Pass: ESA006##)
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Logout & Quick Switch */}
            <div className="flex items-center gap-2">
              <button
                id="admin-logout-btn"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-rose-950 hover:text-rose-300 border border-stone-700 text-stone-300 text-xs font-semibold transition-colors"
                title="লগআউট"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Header */}
        <div className="bg-stone-950/90 border-t border-stone-800 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 sm:space-x-2 py-2">
              {/* Tab 1: Sell Analysis */}
              <button
                id="tab-analytics"
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'bg-amber-600 text-stone-950 shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>বিক্রয় বিশ্লেষণ (Sell Analysis)</span>
              </button>

              {/* Tab 2: Products (Add / Remove) */}
              <button
                id="tab-products"
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'bg-amber-600 text-stone-950 shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>পোশাক ও পণ্য ({products.length})</span>
              </button>

              {/* Tab 3: Categories (Add / Remove) */}
              <button
                id="tab-categories"
                onClick={() => setActiveTab('categories')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'categories'
                    ? 'bg-amber-600 text-stone-950 shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>ক্যাটাগরি ({categories.length})</span>
              </button>

              {/* Tab 4: Order List */}
              <button
                id="tab-orders"
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap relative ${
                  activeTab === 'orders'
                    ? 'bg-amber-600 text-stone-950 shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>অর্ডার তালিকা ({orders.length})</span>
                {pendingOrdersCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>

              {/* Tab 5: Store Control */}
              <button
                id="tab-control"
                onClick={() => setActiveTab('control')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'control'
                    ? 'bg-amber-600 text-stone-950 shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>স্টোর কন্ট্রোল (Store Control)</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'analytics' && <SellAnalysisTab />}
        {activeTab === 'products' && <ProductManagementTab />}
        {activeTab === 'categories' && <CategoryManagementTab />}
        {activeTab === 'orders' && <OrderListTab />}
        {activeTab === 'control' && <StoreControlTab />}
      </main>

      {/* Admin Footer */}
      <footer className="bg-stone-900 text-stone-500 text-xs py-4 px-4 text-center border-t border-stone-800">
        <p>Khan Fashion • সিকিউর ম্যানেজমেন্ট সিস্টেম</p>
      </footer>
    </div>
  );
};
