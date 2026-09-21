import React, { useState } from 'react';
import { Search, Filter, Eye, Trash2, Phone, MapPin, CheckCircle, Clock, Truck, Package, XCircle, FileText, X, Printer } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

export const OrderListTab: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder, settings } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            পেন্ডিং (Pending)
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <CheckCircle className="w-3 h-3 text-blue-600" />
            কনফার্মড (Confirmed)
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <Truck className="w-3 h-3 text-purple-600" />
            শিপমেন্টে (Shipped)
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Package className="w-3 h-3 text-emerald-600" />
            ডেলিভার্ড (Delivered)
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            বাতিলকৃত (Cancelled)
          </span>
        );
      default:
        return null;
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`আপনি কি সত্যিই অর্ডার #${id} মুছে ফেলতে চান?`)) {
      deleteOrder(id);
      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
      }
    }
  };

  return (
    <div id="order-list-tab" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <span>কাস্টমার অর্ডার তালিকা (Order List)</span>
            <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-mono">
              {orders.length} টি অর্ডার
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            গ্রাহকদের সকল অর্ডার পর্যবেক্ষণ করুন, স্ট্যাটাস পরিবর্তন করুন এবং বিস্তারিত ইনভয়েস দেখুন।
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অর্ডার আইডি, কাস্টমার নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
          {[
            { key: 'all', label: 'সকল' },
            { key: 'pending', label: 'পেন্ডিং' },
            { key: 'confirmed', label: 'কনফার্ম' },
            { key: 'shipped', label: 'শিপমেন্ট' },
            { key: 'delivered', label: 'ডেলিভার্ড' },
            { key: 'cancelled', label: 'বাতিল' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === tab.key
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">অর্ডার আইডি ও সময়</th>
                <th className="py-3.5 px-3">গ্রাহকের বিবরণ</th>
                <th className="py-3.5 px-3">পোশাকের আইটেমসমূহ</th>
                <th className="py-3.5 px-3">বিল ও পেমেন্ট</th>
                <th className="py-3.5 px-3">বর্তমান স্ট্যাটাস</th>
                <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    কোনো অর্ডার পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleDateString('bn-BD', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });
                  const timeStr = new Date(order.createdAt).toLocaleTimeString('bn-BD', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* ID & Date */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          #{order.id}
                        </span>
                        <div className="text-[11px] text-stone-500 mt-1">
                          {dateStr} • {timeStr}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-stone-900">{order.customerName}</div>
                        <a
                          href={`tel:${order.phone}`}
                          className="text-stone-600 hover:text-amber-800 flex items-center gap-1 mt-0.5 font-mono text-[11px]"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{order.phone}</span>
                        </a>
                        <div className="text-[11px] text-stone-500 max-w-[180px] truncate mt-0.5" title={order.address}>
                          {order.address} ({order.district})
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-stone-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                              <span className="font-medium line-clamp-1 max-w-[160px]">{item.productName}</span>
                              <span className="text-stone-400 font-mono">({item.size}, x{item.quantity})</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total & Payment */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-bold text-stone-900 font-mono text-sm">
                          {settings.currencySymbol}{order.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-[10px] uppercase tracking-wide font-semibold text-stone-500 mt-0.5">
                          {order.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : `${order.paymentMethod} (পেইড)`}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="py-1 px-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-amber-600"
                        >
                          <option value="pending">⏳ পেন্ডিং</option>
                          <option value="confirmed">✓ কনফার্মড</option>
                          <option value="shipped">🚚 শিপমেন্টে</option>
                          <option value="delivered">🎉 ডেলিভার্ড</option>
                          <option value="cancelled">✕ বাতিল</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg border border-stone-200 text-stone-700 hover:text-amber-800 hover:bg-amber-50 transition-colors"
                            title="বিস্তারিত ইনভয়েস দেখুন"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="অর্ডার মুছুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail / Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto p-6 space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-bold text-stone-900">
                  অর্ডার ইনভয়েস #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Box */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 text-xs">
              <div className="font-bold text-stone-900 mb-1">গ্রাহকের বিবরণ:</div>
              <div className="flex justify-between">
                <span className="text-stone-500">নাম:</span>
                <span className="font-semibold text-stone-800">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">মোবাইল নম্বর:</span>
                <span className="font-semibold text-stone-800 font-mono">{selectedOrder.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">সম্পূর্ণ ঠিকানা:</span>
                <span className="font-semibold text-stone-800 text-right max-w-[240px]">{selectedOrder.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">ডেলিভারি জোন:</span>
                <span className="font-semibold text-stone-800">
                  {selectedOrder.zone === 'inside_dhaka' ? 'ঢাকা সিটির ভেতরে' : `ঢাকার বাইরে (${selectedOrder.district})`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">পেমেন্ট মেথড:</span>
                <span className="font-semibold text-stone-800 uppercase">
                  {selectedOrder.paymentMethod} {selectedOrder.trxId && `(TrxID: ${selectedOrder.trxId})`}
                </span>
              </div>
              {selectedOrder.notes && (
                <div className="flex justify-between pt-1 border-t border-stone-200 text-amber-900">
                  <span>গ্রাহকের নোট:</span>
                  <span className="font-medium italic">{selectedOrder.notes}</span>
                </div>
              )}
            </div>

            {/* Ordered Items List */}
            <div>
              <div className="text-xs font-bold text-stone-800 mb-2">অর্ডারকৃত পোশাকসমূহ:</div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-14 object-cover rounded-lg bg-stone-200 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-stone-900 line-clamp-1">{item.productName}</div>
                      <div className="text-[11px] text-stone-500">
                        সাইজ: {item.size} • কালার: {item.color} • পরিমাণ: {item.quantity} পিস
                      </div>
                    </div>
                    <div className="font-bold text-stone-900 font-mono text-right">
                      {settings.currencySymbol}{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Calculation */}
            <div className="pt-3 border-t border-stone-200 space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>সাবটোটাল:</span>
                <span>{settings.currencySymbol}{selectedOrder.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>ডেলিভারি চার্জ:</span>
                <span>{settings.currencySymbol}{selectedOrder.deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-stone-950 pt-1 border-t border-stone-200">
                <span>সর্বমোট বিল:</span>
                <span className="text-amber-800">{settings.currencySymbol}{selectedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-stone-200 flex justify-between gap-2">
              <button
                onClick={() => window.print()}
                className="py-2 px-3.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="py-2 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
