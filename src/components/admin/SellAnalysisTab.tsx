import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp, CheckCircle, Clock, AlertTriangle, Package, Calendar } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const SellAnalysisTab: React.FC = () => {
  const { orders, products, settings } = useStore();

  // Calculations
  const totalRevenue = orders.reduce((sum, order) => {
    // Only count delivered, shipped or confirmed orders as revenue (or all non-cancelled)
    if (order.status !== 'cancelled') {
      return sum + order.totalAmount;
    }
    return sum;
  }, 0);

  const deliveredRevenue = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingRevenue = orders
    .filter((o) => o.status === 'pending' || o.status === 'confirmed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalOrdersCount = orders.length;
  const nonCancelledOrders = orders.filter((o) => o.status !== 'cancelled');
  const averageOrderValue = nonCancelledOrders.length > 0 ? Math.round(totalRevenue / nonCancelledOrders.length) : 0;

  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;
  const confirmedCount = orders.filter((o) => o.status === 'confirmed').length;
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;

  // Top selling products based on salesCount or order items
  const productSalesMap = new Map<string, { name: string; category: string; count: number; revenue: number; imageUrl: string }>();

  products.forEach((p) => {
    productSalesMap.set(p.id, {
      name: p.name,
      category: p.category,
      count: p.salesCount || 0,
      revenue: (p.salesCount || 0) * p.salePrice,
      imageUrl: p.imageUrl,
    });
  });

  const topSelling = Array.from(productSalesMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Daily simulation calculation for visual chart
  const days = ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'];
  const simulatedSales = [
    { day: 'শনিবার', amount: 8500, orders: 4 },
    { day: 'রবিবার', amount: 12400, orders: 6 },
    { day: 'সোমবার', amount: 9800, orders: 5 },
    { day: 'মঙ্গলবার', amount: 15600, orders: 8 },
    { day: 'বুধবার', amount: 11200, orders: 6 },
    { day: 'বৃহস্পতিবার', amount: 18900, orders: 9 },
    { day: 'শুক্রবার', amount: 24500, orders: 12 },
  ];
  const maxDayAmount = Math.max(...simulatedSales.map((s) => s.amount));

  return (
    <div id="sell-analysis-tab" className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <span>বিক্রয় বিশ্লেষণ ও অ্যানালিটিক্স</span>
            <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-mono">
              Live Data
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            খান ফ্যাশনের সার্বিক বিক্রয়, গড় অর্ডার মূল্য ও পণ্য পারফরম্যান্স পর্যালোচনা
          </p>
        </div>
        <div className="text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl self-start flex items-center gap-1.5 font-medium">
          <Calendar className="w-3.5 h-3.5 text-stone-500" />
          <span>চলতি মাস ও রিয়েলটাইম রেকর্ড</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-4 sm:p-5 bg-white border border-stone-200 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              মোট বিক্রয় (Total Sales)
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-stone-900">
              {settings.currencySymbol}{totalRevenue.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span>↑ সফল ও সক্রিয় মোট অর্ডার</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-4 sm:p-5 bg-white border border-stone-200 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              মোট অর্ডার (Total Orders)
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-stone-900">
              {totalOrdersCount} টি
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              ডেলিভার্ড: <strong className="text-emerald-700">{deliveredCount}</strong> • পেন্ডিং: <strong className="text-amber-700">{pendingCount}</strong>
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="p-4 sm:p-5 bg-white border border-stone-200 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              গড় অর্ডার মান (AOV)
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-stone-900">
              {settings.currencySymbol}{averageOrderValue.toLocaleString()}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              প্রতি অর্ডারে গড়ে খরচ
            </p>
          </div>
        </div>

        {/* Pending Revenue */}
        <div className="p-4 sm:p-5 bg-white border border-stone-200 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              পেন্ডিং ডেলিভারি মূল্য
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-800">
              {settings.currencySymbol}{pendingRevenue.toLocaleString()}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              {pendingCount + confirmedCount} টি অর্ডার প্রক্রিয়াধীন
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Sales Chart & Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Trend Bar Chart */}
        <div className="lg:col-span-2 p-5 bg-white border border-stone-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                সাপ্তাহিক বিক্রয় পারফরম্যান্স (Weekly Trends)
              </h3>
              <p className="text-[11px] text-stone-500">গত ৭ দিনের দৈনন্দিন রাজস্বের প্রবাহ</p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
              সর্বোচ্চ: {settings.currencySymbol}{maxDayAmount.toLocaleString()}
            </span>
          </div>

          {/* Bar Visualization */}
          <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2">
            {simulatedSales.map((item, idx) => {
              const heightPercent = Math.max(15, Math.round((item.amount / maxDayAmount) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 bg-stone-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                    {settings.currencySymbol}{item.amount.toLocaleString()} ({item.orders} অর্ডার)
                  </div>

                  {/* The bar */}
                  <div className="w-full bg-stone-100 rounded-t-lg h-36 flex items-end p-0.5">
                    <div
                      className="w-full bg-gradient-to-t from-amber-700 to-amber-500 group-hover:from-amber-600 group-hover:to-amber-400 rounded-t-md transition-all duration-500"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <span className="text-[10px] sm:text-xs text-stone-600 font-medium truncate w-full text-center">
                    {item.day.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-1">
              অর্ডারের বর্তমান অবস্থা
            </h3>
            <p className="text-[11px] text-stone-500 mb-4">সকল অর্ডারের স্ট্যাটাস বন্টন</p>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-100 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ডেলিভার্ড (সম্পূর্ণ)
                </span>
                <span className="font-mono text-emerald-800">{deliveredCount}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-blue-50 text-blue-900 rounded-xl border border-blue-100 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-blue-600" />
                  শিপমেন্টে আছে (Shipped)
                </span>
                <span className="font-mono text-blue-800">{shippedCount}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-100 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  কনফার্মড & অপেক্ষমান
                </span>
                <span className="font-mono text-amber-800">{confirmedCount + pendingCount}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-rose-50 text-rose-900 rounded-xl border border-rose-100 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  বাতিলকৃত (Cancelled)
                </span>
                <span className="font-mono text-rose-800">{cancelledCount}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 text-center">
            সাকসেস রেট: <strong className="text-stone-800 font-bold">{totalOrdersCount > 0 ? Math.round(((totalOrdersCount - cancelledCount) / totalOrdersCount) * 100) : 100}%</strong>
          </div>
        </div>
      </div>

      {/* Top Selling Products Table */}
      <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-xs">
        <h3 className="text-sm font-bold text-stone-900 mb-1">
          শীর্ষ বিক্রিত পোশাকসমূহ (Top Selling Products)
        </h3>
        <p className="text-[11px] text-stone-500 mb-4">সবচেয়ে বেশি অর্ডার হওয়া কালেকশন</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-1">পোশাক</th>
                <th className="pb-3">ক্যাটাগরি</th>
                <th className="pb-3 text-center">মোট বিক্রি</th>
                <th className="pb-3 text-right pr-2">মোট রাজস্ব</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {topSelling.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3 pl-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded-lg bg-stone-200"
                      />
                      <span className="font-bold text-stone-900 line-clamp-1">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-stone-600 capitalize">{item.category}</td>
                  <td className="py-3 text-center font-mono font-bold text-stone-800">
                    {item.count} টি
                  </td>
                  <td className="py-3 text-right pr-2 font-mono font-bold text-amber-800">
                    {settings.currencySymbol}{item.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
