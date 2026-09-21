export interface Product {
  id: string;
  name: string;
  category: string; // matches Category.slug or Category.id
  regularPrice: number;
  salePrice: number;
  stock: number;
  sizes: string[]; // e.g. ['M', 'L', 'XL', 'XXL'] or ['28', '30', '32', '34']
  colors: string[]; // e.g. ['Navy Blue', 'Black', 'Maroon']
  description: string;
  fabric?: string;
  imageUrl: string;
  galleryImages?: string[];
  productType?: string;
  fit?: string;
  isFeatured?: boolean;
  salesCount?: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  iconName?: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  imageUrl: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  district: string;
  zone: 'inside_dhaka' | 'outside_dhaka';
  paymentMethod: 'cod' | 'bkash' | 'nagad';
  paymentPhone?: string;
  trxId?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  contactPhone: string;
  whatsappNumber: string;
  noticeBannerText: string;
  isNoticeActive: boolean;
  deliveryFeeInsideDhaka: number;
  deliveryFeeOutsideDhaka: number;
  freeShippingAbove: number;
  isStoreOpen: boolean;
  bkashNumber: string;
  nagadNumber: string;
  currencySymbol: string;
  address: string;
}
