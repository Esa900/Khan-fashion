import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Package,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Star,
  Layers,
  CheckCircle2,
  FileImage,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface CategoryPreset {
  name: string;
  badge: string;
  types: string[];
  sizes: string[];
  fabrics: string[];
  colors: string[];
  defaultDescription: string;
  photos: { label: string; url: string }[];
}

const CATEGORY_PRESETS: Record<string, CategoryPreset> = {
  panjabi: {
    name: 'পাঞ্জাবি (Panjabi)',
    badge: 'Men Ethnic',
    types: ['সেমি-লং পাঞ্জাবি', 'কাবলি সেট', 'লং ডিজাইনার পাঞ্জাবি', 'স্লিম ফিট পাঞ্জাবি', 'রেগুলার ফিট পাঞ্জাবি', 'ডিজাইনার এমব্রয়ডারি'],
    sizes: ['38', '40', '42', '44', '46'],
    fabrics: ['১০০% প্রিমিয়াম সুতি কটন', 'জ্যাকোয়ার্ড কটন', 'কাতান সিল্ক', 'লাক্সারি লিনেন', 'ভিসকস ব্লেন্ড'],
    colors: ['সাদা (White)', 'কালো (Black)', 'নেভি ব্লু (Navy)', 'মেরুন (Maroon)', 'অফ-হোয়াইট (Off-White)', 'অলিভ (Olive)'],
    defaultDescription: 'প্রিমিয়াম সুতি কাপড়ের চমৎকার ডিজাইনের আরামদায়ক পাঞ্জাবি। যেকোনো উৎসব বা অনুষ্ঠানে পরার জন্য উপযুক্ত।',
    photos: [
      { label: 'রয়েল ব্ল্যাক সেমি-লং', url: 'https://images.unsplash.com/photo-1621786030685-2e8f660d22ba?auto=format&fit=crop&w=800&q=80' },
      { label: 'হোয়াইট কটন পাঞ্জাবি', url: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=800&q=80' },
      { label: 'গোল্ডেন এমব্রয়ডারি', url: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80' },
      { label: 'মেরুন কাবলি পাঞ্জাবি', url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  tshirts: {
    name: 'টি-শার্ট ও পোলো (T-Shirts & Polo)',
    badge: 'Casual Wear',
    types: ['রাউন্ড নেক টি-শার্ট', 'পোলো কলার শার্ট', 'ওভারসাইজড ড্রপ শোল্ডার', 'স্লিম ফিট কটন টি-শার্ট', 'স্পোর্টস ড্রাইড ফিট'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    fabrics: ['180 GSM কম্বড কটন', '200 GSM প্রিমিয়াম কটন', '220 GSM পিকে কটন (Pique)', 'সফট ডাবল পিকে'],
    colors: ['ব্ল্যাক (Black)', 'হোয়াইট (White)', 'রয়্যাল ব্লু (Royal Blue)', 'বটল গ্রীন (Bottle Green)', 'চকোলেট', 'অ্যাশ (Heather Ash)'],
    defaultDescription: 'হাই কোয়ালিটি কটন ফেব্রিকে তৈরি আরামদায়ক টি-শার্ট। ১০০% কালার গ্যারান্টি ও প্রি-শ্রাঙ্ক ফেব্রিক।',
    photos: [
      { label: 'দারাজ ট্রেন্ডিং গ্রাফিক', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' },
      { label: 'প্রিমিয়াম পোলো শার্ট', url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80' },
      { label: 'ব্ল্যাক মিনিমাল টি-শার্ট', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80' },
      { label: 'ওভারসাইজড ড্রপ শোল্ডার', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  shirts: {
    name: 'শার্ট (Shirts)',
    badge: 'Formal & Smart',
    types: ['ফুল হাতা ফরমাল', 'ফুল হাতা ক্যাজুয়াল', 'হাফ হাতা সামার শার্ট', 'কিউবান কলার শার্ট', 'ডেনিম ক্যাজুয়াল শার্ট'],
    sizes: ['M', 'L', 'XL', 'XXL', '15', '15.5', '16'],
    fabrics: ['১০০% অক্সফোর্ড কটন', 'টুইল কটন', 'লিনেন কটন ব্লেন্ড', 'সফট ফিনিশ চেম্ব্রে'],
    colors: ['হোয়াইট (White)', 'স্কাই ব্লু (Sky Blue)', 'নেভি ব্লু (Navy)', 'ব্ল্যাক (Black)', 'অলিভ (Olive)', 'চেক প্রিন্ট'],
    defaultDescription: 'প্রিমিয়াম কোয়ালিটির ফরমাল ও ক্যাজুয়াল শার্ট। নিখুঁত সেলাই ও আধুনিক কাটিংয়ে তৈরি।',
    photos: [
      { label: 'ক্যাজুয়াল ব্লু শার্ট', url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80' },
      { label: 'হোয়াইট ফরমাল শার্ট', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80' },
      { label: 'চেক ক্যাজুয়াল শার্ট', url: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80' },
      { label: 'কটন ক্যাজুয়াল ফুল হাতা', url: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  pant: {
    name: 'প্যান্ট ও জিন্স (Pants & Jeans)',
    badge: 'Bottoms',
    types: ['স্লিম ফিট ডেনিম', 'ন্যারো ফিট জিন্স', 'স্ট্রেইট রেগুলার জিন্স', 'ফরমাল চিনো গ্যাবার্ডিন', 'কার্গো জগার্স'],
    sizes: ['28', '30', '32', '34', '36', '38'],
    fabrics: ['স্ট্রেচেবল ডেনিম (Stretch Denim)', '১০০% কটন গ্যাবার্ডিন', 'টুইল চিনো ফেব্রিক', 'সফট ওয়াশ ডেনিম'],
    colors: ['ডিপ ব্লু (Deep Blue)', 'র ওয়াশ (Raw Wash)', 'ফেডেড ব্লু (Faded Blue)', 'ব্ল্যাক (Jet Black)', 'অ্যাশ (Grey)', 'বিস্কুট কালার'],
    defaultDescription: 'আরামদায়ক স্ট্রেচেবল ডেনিম প্যান্ট। নিখুঁত ফিটিং ও দীর্ঘস্থায়ী ওয়াশ কোয়ালিটি।',
    photos: [
      { label: 'ক্লাসিক ডেনিম জিন্স', url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80' },
      { label: 'চিনো গ্যাবার্ডিন প্যান্ট', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80' },
      { label: 'স্লিম ব্লু জিন্স', url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80' },
      { label: 'ব্ল্যাক স্ট্রেচ ডেনিম', url: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  jama: {
    name: 'জামা ও কুর্তি (Ladies Collection)',
    badge: 'Women Festive',
    types: ['ওয়ান পিস কুর্তি', 'টু পিস সেট', 'থ্রি পিস সালোয়ার কামিজ', 'লং ফ্লোরাল গাউন', 'আনারকলি'],
    sizes: ['36', '38', '40', '42', '44', 'Free Size'],
    fabrics: ['প্রিমিয়াম সুতি লন (Cotton Lawn)', 'জর্জেট (Georgette)', 'সিল্ক ও কাতান', 'লিনেন ফেব্রিক'],
    colors: ['মেরুন (Maroon)', 'রোজ পিংক (Pink)', 'মেজেন্টা (Magenta)', 'পেস্ট কালার', 'ব্ল্যাক (Black)', 'নেভি ব্লু'],
    defaultDescription: 'চমৎকার কারুকাজ করা আরামদায়ক লেডিস পোশাক। আধুনিক ডিজাইন ও ট্রেন্ডি কালার কম্বিনেশন।',
    photos: [
      { label: 'ডিজাইনার সুতি কুর্তি', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
      { label: 'ফ্লোরাল গাউন থ্রি-পিস', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80' },
      { label: 'এমব্রয়ডারি থ্রি-পিস', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  kapor: {
    name: 'কাপড় ও থান (Fabrics & Than)',
    badge: 'Unstitched',
    types: ['থান কাপড় (প্রতি গজ)', 'থান কাপড় (প্রতি মিটার)', 'সম্পূর্ণ রোল থান'],
    sizes: ['১ গজ', '২ গজ', '২.৫ গজ', '৩ গজ', '১ থান (Roll)'],
    fabrics: ['১০০% সুতি ভয়েল থান', 'জ্যাকোয়ার্ড থান', 'প্রিমিয়াম কটন থান', 'জর্জেট থান'],
    colors: ['সকল কালার উপলব্ধ', 'সাদা থান', 'কালো থান', 'নেভি ব্লু থান'],
    defaultDescription: 'সেরা সুতার তৈরি নিখুঁত বহরের থান কাপড়। পাঞ্জাবি, শার্ট বা কামিজ বানানোর জন্য সেরা।',
    photos: [
      { label: 'প্রিমিয়াম সুতি থান', url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80' },
      { label: 'রংবেরঙের ফ্যাব্রিক রোল', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80' },
    ],
  },
};

export const ProductManagementTab: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, settings } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('panjabi');
  const [formProductType, setFormProductType] = useState('');
  const [formRegularPrice, setFormRegularPrice] = useState<number>(1500);
  const [formSalePrice, setFormSalePrice] = useState<number>(1200);
  const [formStock, setFormStock] = useState<number>(25);
  const [formSizes, setFormSizes] = useState<string>('38, 40, 42, 44');
  const [formColors, setFormColors] = useState<string>('কালো, সাদা, নেভি ব্লু');
  const [formFabric, setFormFabric] = useState('১০০% প্রিমিয়াম সুতি কটন');
  const [formDescription, setFormDescription] = useState('প্রিমিয়াম কোয়ালিটির আরামদায়ক পোশাক।');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formGalleryImages, setFormGalleryImages] = useState<string[]>([]);
  const [formIsFeatured, setFormIsFeatured] = useState(true);

  // Photo upload tab state: 'upload' | 'url' | 'presets'
  const [photoUploadTab, setPhotoUploadTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Current active preset based on category
  const activePreset = CATEGORY_PRESETS[formCategory] || CATEGORY_PRESETS.panjabi;

  // When category changes in the form, intelligently provide type suggestions
  const handleCategoryChange = (catSlug: string) => {
    setFormCategory(catSlug);
    const preset = CATEGORY_PRESETS[catSlug];
    if (preset) {
      if (preset.types?.length > 0) {
        setFormProductType(preset.types[0]);
      }
      if (preset.sizes?.length > 0 && (!formSizes || formSizes.trim() === '')) {
        setFormSizes(preset.sizes.join(', '));
      }
      if (preset.fabrics?.length > 0 && (!formFabric || formFabric.trim() === '')) {
        setFormFabric(preset.fabrics[0]);
      }
      if (preset.colors?.length > 0 && (!formColors || formColors.trim() === '')) {
        setFormColors(preset.colors.slice(0, 3).join(', '));
      }
      if (!formDescription || formDescription.trim() === '') {
        setFormDescription(preset.defaultDescription);
      }
    }
  };

  const resetForm = () => {
    const defaultCat = categories[0]?.slug || 'panjabi';
    const preset = CATEGORY_PRESETS[defaultCat] || CATEGORY_PRESETS.panjabi;
    setFormName('');
    setFormCategory(defaultCat);
    setFormProductType(preset.types[0] || '');
    setFormRegularPrice(1500);
    setFormSalePrice(1200);
    setFormStock(25);
    setFormSizes(preset.sizes.join(', '));
    setFormColors(preset.colors.slice(0, 3).join(', '));
    setFormFabric(preset.fabrics[0] || '১০০% প্রিমিয়াম কটন');
    setFormDescription(preset.defaultDescription);
    setFormImageUrl(preset.photos[0]?.url || '');
    setFormGalleryImages(preset.photos.slice(1).map((p) => p.url));
    setFormIsFeatured(false);
    setManualUrlInput('');
    setEditingProduct(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormProductType(prod.productType || '');
    setFormRegularPrice(prod.regularPrice);
    setFormSalePrice(prod.salePrice);
    setFormStock(prod.stock);
    setFormSizes(prod.sizes?.join(', ') || '');
    setFormColors(prod.colors?.join(', ') || '');
    setFormFabric(prod.fabric || '');
    setFormDescription(prod.description);
    setFormImageUrl(prod.imageUrl);
    setFormGalleryImages(prod.galleryImages || []);
    setFormIsFeatured(!!prod.isFeatured);
    setManualUrlInput('');
    setIsAddModalOpen(true);
  };

  // Image Upload Handlers (Device files via FileReader)
  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setFormImageUrl((prev) => {
            if (!prev) {
              return dataUrl;
            } else {
              setFormGalleryImages((g) => (g.includes(dataUrl) ? g : [...g, dataUrl]));
              return prev;
            }
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleAddManualUrl = () => {
    const clean = manualUrlInput.trim();
    if (!clean) return;
    if (!formImageUrl) {
      setFormImageUrl(clean);
    } else if (!formGalleryImages.includes(clean)) {
      setFormGalleryImages((prev) => [...prev, clean]);
    }
    setManualUrlInput('');
  };

  const handleAddPresetPhoto = (url: string) => {
    if (!formImageUrl) {
      setFormImageUrl(url);
    } else if (!formGalleryImages.includes(url) && formImageUrl !== url) {
      setFormGalleryImages((prev) => [...prev, url]);
    }
  };

  const handleMakeMainImage = (url: string) => {
    if (url === formImageUrl) return;
    const oldMain = formImageUrl;
    setFormImageUrl(url);
    setFormGalleryImages((prev) => [oldMain, ...prev.filter((u) => u !== url)].filter(Boolean));
  };

  const handleRemoveImage = (url: string) => {
    if (url === formImageUrl) {
      if (formGalleryImages.length > 0) {
        setFormImageUrl(formGalleryImages[0]);
        setFormGalleryImages((prev) => prev.slice(1));
      } else {
        setFormImageUrl('');
      }
    } else {
      setFormGalleryImages((prev) => prev.filter((u) => u !== url));
    }
  };

  // Toggle size chip into the comma-separated string
  const toggleSize = (size: string) => {
    const current = formSizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (current.includes(size)) {
      setFormSizes(current.filter((s) => s !== size).join(', '));
    } else {
      setFormSizes([...current, size].join(', '));
    }
  };

  // Toggle color chip into the comma-separated string
  const toggleColor = (color: string) => {
    const cleanColor = color.replace(/\s*\(.*?\)/, '').trim();
    const current = formColors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    if (current.includes(cleanColor)) {
      setFormColors(current.filter((c) => c !== cleanColor).join(', '));
    } else {
      setFormColors([...current, cleanColor].join(', '));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sizesArray = formSizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const colorsArray = formColors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const mainImg = formImageUrl || activePreset.photos[0]?.url || 'https://images.unsplash.com/photo-1621786030685-2e8f660d22ba?auto=format&fit=crop&w=800&q=80';

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formName,
        category: formCategory,
        productType: formProductType,
        regularPrice: Number(formRegularPrice),
        salePrice: Number(formSalePrice),
        stock: Number(formStock),
        sizes: sizesArray.length > 0 ? sizesArray : ['Free Size'],
        colors: colorsArray.length > 0 ? colorsArray : ['Standard'],
        fabric: formFabric,
        description: formDescription,
        imageUrl: mainImg,
        galleryImages: formGalleryImages,
        isFeatured: formIsFeatured,
      });
    } else {
      addProduct({
        name: formName,
        category: formCategory || categories[0]?.slug || 'panjabi',
        productType: formProductType,
        regularPrice: Number(formRegularPrice),
        salePrice: Number(formSalePrice),
        stock: Number(formStock),
        sizes: sizesArray.length > 0 ? sizesArray : ['Free Size'],
        colors: colorsArray.length > 0 ? colorsArray : ['Standard'],
        fabric: formFabric,
        description: formDescription,
        imageUrl: mainImg,
        galleryImages: formGalleryImages,
        isFeatured: formIsFeatured,
      });
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে "${name}" প্রোডাক্টটি মুছে ফেলতে চান?`)) {
      deleteProduct(id);
    }
  };

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.productType && prod.productType.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // All combined pictures for current form
  const allCurrentPhotos = [formImageUrl, ...formGalleryImages].filter(Boolean);

  return (
    <div id="product-management-tab" className="space-y-6 animate-fade-in">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <span>পণ্য ব্যবস্থাপনা (Products)</span>
            <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
              মোট: {products.length}টি
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            নতুন পোশাক যোগ করুন, একাধিক ছবি আপলোড করুন ও স্মার্ট ক্যাটাগরি অপশন নির্বাচন করুন।
          </p>
        </div>

        <button
          id="add-new-product-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পোশাক যোগ করুন</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="পোশাকের নাম বা টাইপ খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-700 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            সকল ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c.slug).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === c.slug
                    ? 'bg-amber-700 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">পোশাক ও ছবি</th>
                <th className="py-3 px-3">ক্যাটাগরি ও টাইপ</th>
                <th className="py-3 px-3">মূল্য</th>
                <th className="py-3 px-3">স্টক</th>
                <th className="py-3 px-3">সাইজ</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    কোনো পোশাক পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          {(prod.galleryImages?.length || 0) > 0 && (
                            <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] text-center font-mono py-0.5">
                              +{(prod.galleryImages?.length || 0)} ছবি
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 line-clamp-1">{prod.name}</div>
                          <div className="text-[11px] text-stone-500 font-normal">
                            {prod.fabric || 'রেগুলার ফেব্রিক'}
                          </div>
                          {prod.isFeatured && (
                            <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded text-[9px] font-bold">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="space-y-0.5">
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-800 rounded-md text-xs font-semibold">
                          {categories.find((c) => c.slug === prod.category)?.name || prod.category}
                        </span>
                        {prod.productType && (
                          <div className="text-[10px] text-amber-800 font-semibold">
                            {prod.productType}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono">
                      <div className="font-bold text-stone-900">
                        {settings.currencySymbol}
                        {prod.salePrice.toLocaleString()}
                      </div>
                      {prod.regularPrice > prod.salePrice && (
                        <div className="text-[11px] text-stone-400 line-through">
                          {settings.currencySymbol}
                          {prod.regularPrice.toLocaleString()}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => updateProduct(prod.id, { stock: Math.max(0, prod.stock - 1) })}
                          className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                          title="স্টক ১ কমান"
                        >
                          -
                        </button>
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                            prod.stock <= 5
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-stone-100 text-stone-800'
                          }`}
                        >
                          {prod.stock}
                        </span>
                        <button
                          onClick={() => updateProduct(prod.id, { stock: prod.stock + 1 })}
                          className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                          title="স্টক ১ বাড়ান"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {prod.sizes?.slice(0, 3).map((s) => (
                          <span key={s} className="px-1.5 py-0.5 bg-stone-100 rounded text-[10px] font-mono">
                            {s}
                          </span>
                        ))}
                        {(prod.sizes?.length || 0) > 3 && (
                          <span className="text-[10px] text-stone-400">+{prod.sizes.length - 3}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                          title="এডিট করুন"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-stone-950 font-black">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    {editingProduct ? 'পোশাকের তথ্য পরিবর্তন করুন' : 'নতুন পোশাক যুক্ত করুন'}
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    একাধিক ছবি ও ক্যাটাগরি স্মার্ট অপশন নির্বাচন করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
              {/* Category Selection with Instant Smart Detection */}
              <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-900 flex items-center gap-1.5 text-xs sm:text-sm">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>১. ক্যাটাগরি নির্বাচন করুন (Smart Category)</span>
                  </label>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-amber-200/70 text-amber-900 rounded-full">
                    {activePreset.badge}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((c) => {
                    const isSelected = formCategory === c.slug;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleCategoryChange(c.slug)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-700 text-white border-amber-800 shadow-xs font-bold scale-[1.02]'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400 hover:bg-amber-50/30'
                        }`}
                      >
                        <span className="text-xs">{c.name}</span>
                        <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-amber-200' : 'text-stone-400'}`}>
                          {CATEGORY_PRESETS[c.slug]?.badge || 'Fashion'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Instant Product Type Detection Badges */}
                {activePreset.types && activePreset.types.length > 0 && (
                  <div className="pt-2 border-t border-amber-200/60">
                    <div className="text-[11px] font-bold text-amber-950 mb-1.5 flex items-center gap-1">
                      <span>📌 {activePreset.name}-এর জন্য প্রোডাক্ট টাইপ সিলেক্ট করুন:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activePreset.types.map((typeOption) => {
                        const isChosen = formProductType === typeOption;
                        return (
                          <button
                            key={typeOption}
                            type="button"
                            onClick={() => {
                              setFormProductType(typeOption);
                              if (!formName || formName.trim() === '') {
                                setFormName(`প্রিমিয়াম ${typeOption}`);
                              }
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                              isChosen
                                ? 'bg-stone-900 text-amber-300 font-bold shadow-xs'
                                : 'bg-white text-stone-700 border border-stone-300 hover:border-amber-600 hover:bg-amber-50'
                            }`}
                          >
                            {isChosen && '✓ '}
                            {typeOption}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Title and Product Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    পোশাকের নাম / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={`যেমন: প্রিমিয়াম ${formProductType || activePreset.types[0] || 'পাঞ্জাবি'}`}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    টাইপ / ফিট (Product Type)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: সেমি-লং / স্লিম ফিট"
                    value={formProductType}
                    onChange={(e) => setFormProductType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-600 outline-none font-semibold text-amber-900"
                  />
                </div>
              </div>

              {/* Comprehensive Picture Upload Options */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="font-bold text-stone-900 flex items-center gap-1.5 text-xs sm:text-sm">
                    <ImageIcon className="w-4 h-4 text-amber-700" />
                    <span>২. পোশাকের ছবি আপলোড করুন (সকল মাধ্যম সাপোর্টেড)</span>
                  </label>
                  <span className="text-[11px] text-stone-500">
                    {allCurrentPhotos.length > 0 ? `মোট ${allCurrentPhotos.length}টি ছবি যুক্ত আছে` : 'কমপক্ষে ১টি ছবি আবশ্যক'}
                  </span>
                </div>

                {/* Upload Method Tabs */}
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setPhotoUploadTab('upload')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      photoUploadTab === 'upload'
                        ? 'bg-amber-700 text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>ডিভাইস থেকে আপলোড</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoUploadTab('url')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      photoUploadTab === 'url'
                        ? 'bg-amber-700 text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>অনলাইন লিংক (URL)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoUploadTab('presets')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      photoUploadTab === 'presets'
                        ? 'bg-amber-700 text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>রেডি ক্যাটালগ</span>
                  </button>
                </div>

                {/* Tab 1: Device File Upload with Drag & Drop */}
                {photoUploadTab === 'upload' && (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`p-5 rounded-xl border-2 border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isDragging
                        ? 'border-amber-600 bg-amber-50/80 scale-[1.01]'
                        : 'border-stone-300 bg-white hover:border-amber-500 hover:bg-stone-50/50'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-2 shadow-xs">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-stone-800">
                      কম্পিউটার বা মোবাইল থেকে ছবি সিলেক্ট করুন
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1">
                      একসাথে এক বা একাধিক ছবি ড্র্যাগ অ্যান্ড ড্রপ করুন অথবা ক্লিক করুন (JPG, PNG, WebP)
                    </p>
                  </div>
                )}

                {/* Tab 2: Manual URL Paste */}
                {photoUploadTab === 'url' && (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... বা যেকোনো ইমেজের লিংক দিন"
                      value={manualUrlInput}
                      onChange={(e) => setManualUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddManualUrl();
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddManualUrl}
                      disabled={!manualUrlInput.trim()}
                      className="px-4 py-2 bg-stone-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                      <span>যোগ করুন</span>
                    </button>
                  </div>
                )}

                {/* Tab 3: Presets from Curated Category Catalog */}
                {photoUploadTab === 'presets' && (
                  <div>
                    <span className="text-[11px] text-stone-500 block mb-2">
                      {activePreset.name}-এর জন্য প্রস্তুতকৃত হাই-রেজুলেশন ছবি (ক্লিক করলেই যুক্ত হবে):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {activePreset.photos.map((photo, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAddPresetPhoto(photo.url)}
                          className="group relative rounded-xl overflow-hidden border border-stone-200 hover:border-amber-600 transition-all text-left bg-white shadow-2xs"
                        >
                          <img
                            src={photo.url}
                            alt={photo.label}
                            referrerPolicy="no-referrer"
                            className="w-full h-20 object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="p-1.5 text-[10px] font-bold text-stone-800 truncate">
                            {photo.label}
                          </div>
                          <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-black shadow-xs">
                            +
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Uploaded Images Gallery List */}
                {allCurrentPhotos.length > 0 && (
                  <div className="pt-2 border-t border-stone-200">
                    <span className="text-[11px] font-bold text-stone-800 block mb-2">
                      সংযুক্ত ছবিসমূহ ({allCurrentPhotos.length}টি) - প্রথমটি মূল কাভার হিসেবে থাকবে:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {allCurrentPhotos.map((imgUrl, idx) => {
                        const isMain = idx === 0;
                        return (
                          <div
                            key={idx}
                            className={`relative rounded-xl overflow-hidden border-2 transition-all p-1 bg-white flex flex-col justify-between ${
                              isMain
                                ? 'border-amber-600 ring-2 ring-amber-600/30 shadow-xs'
                                : 'border-stone-200'
                            }`}
                          >
                            <div className="relative w-full h-24 rounded-lg overflow-hidden bg-stone-100">
                              <img
                                src={imgUrl}
                                alt={`Product view ${idx + 1}`}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              {isMain && (
                                <span className="absolute top-1 left-1 bg-amber-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  মূল কাভার
                                </span>
                              )}
                            </div>

                            <div className="mt-1.5 flex items-center justify-between gap-1">
                              {!isMain ? (
                                <button
                                  type="button"
                                  onClick={() => handleMakeMainImage(imgUrl)}
                                  className="text-[10px] text-amber-800 hover:text-amber-900 font-bold underline"
                                >
                                  কাভার বানান
                                </button>
                              ) : (
                                <span className="text-[10px] text-emerald-700 font-bold">✓ কাভার ফটো</span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(imgUrl)}
                                className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                                title="ছবি মুছুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing and Stock */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    রেগুলার মূল্য (৳) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formRegularPrice}
                    onChange={(e) => setFormRegularPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-600 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    অফার মূল্য (৳) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formSalePrice}
                    onChange={(e) => setFormSalePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-600 outline-none font-mono font-bold text-amber-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    স্টক পরিমাণ *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-600 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Dynamic Size Picker & Input */}
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-stone-700">
                    সাইজসমূহ (Sizes)
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormSizes(activePreset.sizes.join(', '))}
                    className="text-[11px] text-amber-800 hover:underline font-bold"
                  >
                    + সব সাইজ যোগ করুন
                  </button>
                </div>

                {/* Quick Size Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {activePreset.sizes.map((sz) => {
                    const activeSizes = formSizes.split(',').map((s) => s.trim());
                    const isSelected = activeSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSize(sz)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                          isSelected
                            ? 'bg-amber-700 text-white shadow-xs'
                            : 'bg-white text-stone-700 border border-stone-300 hover:border-amber-600'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  value={formSizes}
                  onChange={(e) => setFormSizes(e.target.value)}
                  placeholder="38, 40, 42, 44 or M, L, XL"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs outline-none"
                />
              </div>

              {/* Fabric & Dynamic Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Fabric Selection */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-stone-700">
                    ফেব্রিক / কাপড়ের ধরন
                  </label>
                  <input
                    type="text"
                    value={formFabric}
                    onChange={(e) => setFormFabric(e.target.value)}
                    placeholder="যেমন: ১০০% প্রিমিয়াম লাক্সারি সুতি কটন"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs outline-none"
                  />
                  <div className="flex flex-wrap gap-1">
                    {activePreset.fabrics.slice(0, 3).map((fab, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormFabric(fab)}
                        className="text-[10px] px-2 py-0.5 bg-stone-100 hover:bg-amber-100 text-stone-700 rounded transition-colors"
                      >
                        {fab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors Selection */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-stone-700">
                    কালারসমূহ (Colors)
                  </label>
                  <input
                    type="text"
                    value={formColors}
                    onChange={(e) => setFormColors(e.target.value)}
                    placeholder="কালো, নেভি ব্লু, সাদা, মেরুন"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs outline-none"
                  />
                  <div className="flex flex-wrap gap-1">
                    {activePreset.colors.slice(0, 4).map((col, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleColor(col)}
                        className="text-[10px] px-2 py-0.5 bg-stone-100 hover:bg-amber-100 text-stone-700 rounded transition-colors"
                      >
                        + {col.replace(/\s*\(.*?\)/, '')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  বিস্তারিত বিবরণ (Description)
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="form-is-featured"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  className="text-amber-700 rounded focus:ring-amber-600"
                />
                <label htmlFor="form-is-featured" className="text-xs text-stone-700 font-medium">
                  এই পোশাকটি হট কালেকশন / Featured লিস্টে রাখুন
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-stone-200 text-stone-700 font-semibold hover:bg-stone-50 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  {editingProduct ? 'পরিবর্তন সংরক্ষণ করুন' : 'পণ্য যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
