import React, { useState } from 'react';
import { Tag, Plus, Trash2, FolderPlus, Layers, AlertCircle, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CategoryManagementTab: React.FC = () => {
  const { categories, products, addCategory, deleteCategory } = useStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nameBn.trim()) {
      setError('ক্যাটাগরির বাংলা নাম দিন।');
      return;
    }

    const generatedSlug = (slug || nameEn || nameBn)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '-');

    if (categories.some((c) => c.slug === generatedSlug)) {
      setError('এই স্লাগ বা ক্যাটাগরি ইতিমধ্যে বিদ্যমান।');
      return;
    }

    addCategory({
      name: nameEn.trim() ? `${nameBn.trim()} (${nameEn.trim()})` : nameBn.trim(),
      nameBn: nameBn.trim(),
      slug: generatedSlug,
      description: description.trim() || undefined,
      iconName: 'Tag',
    });

    setSuccess('নতুন ক্যাটাগরি সফলভাবে যুক্ত হয়েছে!');
    setNameBn('');
    setNameEn('');
    setSlug('');
    setDescription('');
    setIsAddOpen(false);

    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = (id: string, name: string, catSlug: string) => {
    const associatedProducts = products.filter((p) => p.category === catSlug);
    if (associatedProducts.length > 0) {
      if (
        !window.confirm(
          `সতর্কতা: এই ক্যাটাগরিতে ${associatedProducts.length} টি পোশাক রয়েছে। আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?`
        )
      ) {
        return;
      }
    } else {
      if (!window.confirm(`আপনি কি "${name}" ক্যাটাগরিটি মুছে ফেলতে চান?`)) {
        return;
      }
    }

    deleteCategory(id);
  };

  return (
    <div id="category-management-tab" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <span>ক্যাটাগরি ম্যানেজমেন্ট (ক্যাটাগরি যোগ ও বাদ)</span>
            <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-mono">
              {categories.length} টি ক্যাটাগরি
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            ওয়েবসাইটে পণ্য সুনির্দিষ্টভাবে সাজানোর জন্য ক্যাটাগরি তৈরি ও নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ক্যাটাগরি যোগ করুন</span>
        </button>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.category === cat.slug).length;

          return (
            <div
              key={cat.id}
              className="p-5 bg-white border border-stone-200 rounded-2xl shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                    <Tag className="w-5 h-5" />
                  </div>

                  <span className="text-xs font-mono font-semibold bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg">
                    {productCount} টি পোশাক
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 mb-1">
                  {cat.name}
                </h3>
                
                <div className="text-[11px] font-mono text-stone-400 mb-2">
                  স্লাগ: <span className="text-stone-600 font-semibold">{cat.slug}</span>
                </div>

                {cat.description && (
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-500">
                  {productCount === 0 ? 'খালি ক্যাটাগরি' : 'সক্রিয় পণ্য তালিকাভুক্ত'}
                </span>

                <button
                  onClick={() => handleDelete(cat.id, cat.name, cat.slug)}
                  className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs"
                  title="ক্যাটাগরি মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>মুছুন</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-amber-700" />
              <span>নতুন ক্যাটাগরি তৈরি করুন</span>
            </h3>

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  ক্যাটাগরির বাংলা নাম * (যেমন: এক্সক্লুসিভ পাঞ্জাবি)
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: লুঙ্গি ও কমফোর্ট ওয়্যার"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  ইংরেজি নাম (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: Lungi & Comfort Wear"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  স্লাগ / আইডেন্টিফায়ার (ঐচ্ছিক, স্বয়ংক্রিয় হবে)
                </label>
                <input
                  type="text"
                  placeholder="e.g. lungi-wear"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  সংক্ষিপ্ত বিবরণ
                </label>
                <textarea
                  rows={2}
                  placeholder="ক্যাটাগরি সম্পর্কে এক লাইনে লিখুন..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="py-2 px-4 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold"
                >
                  ক্যাটাগরি যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
