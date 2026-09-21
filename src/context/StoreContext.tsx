import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { Product, Category, Order, CartItem, StoreSettings, OrderStatus } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SETTINGS } from '../data/initialData';
import { db, handleFirestoreError, OperationType, testFirestoreConnection } from '../lib/firebase';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: StoreSettings;
  cart: CartItem[];
  isAdminAuthenticated: boolean;
  isFirestoreConnected: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  // Category actions
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  // Order actions
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  // Store Settings actions
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  resetAllData: () => Promise<void>;
  // Cart actions
  addToCart: (product: Product, selectedSize: string, selectedColor: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const ADMIN_PASSWORD_KEY = 'ESA006##';
const STORAGE_PREFIX = 'khan_fashion_';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local cache initialization for instant rendering before Firestore stream arrives
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}products`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}categories`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_CATEGORIES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}orders`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ORDERS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}settings`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_SETTINGS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}cart`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(`${STORAGE_PREFIX}admin_auth`) === 'true';
  });

  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(false);

  // 1. Initial Connection Validation
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setIsFirestoreConnected(connected);
    });
  }, []);

  // 2. Real-Time Firestore Sync for Products
  useEffect(() => {
    const productsRef = collection(db, 'products');

    const unsubscribe = onSnapshot(
      productsRef,
      async (snapshot) => {
        setIsFirestoreConnected(true);
        if (snapshot.empty) {
          // Seed Firestore with initial catalog if empty
          try {
            const batch = writeBatch(db);
            INITIAL_PRODUCTS.forEach((prod) => {
              const docRef = doc(db, 'products', prod.id);
              batch.set(docRef, prod);
            });
            await batch.commit();
          } catch (seedErr) {
            console.warn('Initial seeding error:', seedErr);
          }
        } else {
          const loadedProducts: Product[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              name: data.name || '',
              category: data.category || 'panjabi',
              regularPrice: Number(data.regularPrice) || 0,
              salePrice: Number(data.salePrice) || 0,
              stock: Number(data.stock) ?? 10,
              sizes: Array.isArray(data.sizes) ? data.sizes : ['Free Size'],
              colors: Array.isArray(data.colors) ? data.colors : ['Standard'],
              description: data.description || '',
              fabric: data.fabric || '',
              imageUrl: data.imageUrl || '',
              galleryImages: Array.isArray(data.galleryImages) ? data.galleryImages : [],
              productType: data.productType || '',
              fit: data.fit || '',
              isFeatured: !!data.isFeatured,
              salesCount: Number(data.salesCount) || 0,
              createdAt: data.createdAt || new Date().toISOString(),
            };
          });

          // Sort products: newest first
          loadedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setProducts(loadedProducts);
          localStorage.setItem(`${STORAGE_PREFIX}products`, JSON.stringify(loadedProducts));
        }
      },
      (error) => {
        console.warn('Firestore products listener:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // 3. Real-Time Firestore Sync for Categories
  useEffect(() => {
    const catRef = collection(db, 'categories');

    const unsubscribe = onSnapshot(
      catRef,
      async (snapshot) => {
        if (snapshot.empty) {
          try {
            const batch = writeBatch(db);
            INITIAL_CATEGORIES.forEach((cat) => {
              const docRef = doc(db, 'categories', cat.id);
              batch.set(docRef, cat);
            });
            await batch.commit();
          } catch (err) {
            console.warn('Category seed error:', err);
          }
        } else {
          const loadedCats = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Category));
          setCategories(loadedCats);
          localStorage.setItem(`${STORAGE_PREFIX}categories`, JSON.stringify(loadedCats));
        }
      },
      (error) => {
        console.warn('Firestore categories listener:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // 4. Real-Time Firestore Sync for Orders
  useEffect(() => {
    const ordersRef = collection(db, 'orders');

    const unsubscribe = onSnapshot(
      ordersRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedOrders = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Order));
          loadedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(loadedOrders);
          localStorage.setItem(`${STORAGE_PREFIX}orders`, JSON.stringify(loadedOrders));
        }
      },
      (error) => {
        console.warn('Firestore orders listener:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // 5. Real-Time Firestore Sync for Store Settings
  useEffect(() => {
    const settingsDocRef = doc(db, 'settings', 'general');

    const unsubscribe = onSnapshot(
      settingsDocRef,
      async (docSnap) => {
        if (docSnap.exists()) {
          const loadedSettings = docSnap.data() as StoreSettings;
          setSettings(loadedSettings);
          localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(loadedSettings));
        } else {
          try {
            await setDoc(settingsDocRef, INITIAL_SETTINGS);
          } catch (e) {
            console.warn('Settings seed error:', e);
          }
        }
      },
      (error) => {
        console.warn('Firestore settings listener:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Cart Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}cart`, JSON.stringify(cart));
  }, [cart]);

  // Admin Auth
  const loginAdmin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD_KEY) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(`${STORAGE_PREFIX}admin_auth`, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(`${STORAGE_PREFIX}admin_auth`);
  };

  // Product Actions (Sync to Firestore Cloud Database)
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<void> => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: new Date().toISOString(),
      salesCount: 0,
    };

    // Optimistic local state update
    setProducts((prev) => [newProduct, ...prev]);

    try {
      await setDoc(doc(db, 'products', id), newProduct);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `products/${id}`);
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>): Promise<void> => {
    // Optimistic local state update
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));

    try {
      await setDoc(doc(db, 'products', id), updatedFields, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    // Optimistic local state update
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));

    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  // Category Actions
  const addCategory = async (categoryData: Omit<Category, 'id'>): Promise<void> => {
    const id = `cat-${Date.now()}`;
    const newCategory: Category = {
      ...categoryData,
      id,
    };

    setCategories((prev) => [...prev, newCategory]);

    try {
      await setDoc(doc(db, 'categories', id), newCategory);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `categories/${id}`);
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    setCategories((prev) => prev.filter((c) => c.id !== id));

    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
    }
  };

  // Order Actions
  const placeOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `KF-${randomNum}`,
      createdAt: new Date().toISOString(),
    };

    // Optimistically deduct stock
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        const orderItem = newOrder.items.find((i) => i.productId === prod.id);
        if (orderItem) {
          const newStock = Math.max(0, prod.stock - orderItem.quantity);
          const newSales = (prod.salesCount || 0) + orderItem.quantity;
          return { ...prod, stock: newStock, salesCount: newSales };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);

    try {
      // Save order to Firestore
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);

      // Sync updated stock for ordered items to Firestore
      for (const item of newOrder.items) {
        const currentProd = products.find((p) => p.id === item.productId);
        if (currentProd) {
          const updatedStock = Math.max(0, currentProd.stock - item.quantity);
          const updatedSales = (currentProd.salesCount || 0) + item.quantity;
          await setDoc(
            doc(db, 'products', item.productId),
            { stock: updatedStock, salesCount: updatedSales },
            { merge: true }
          );
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${newOrder.id}`);
    }

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));

    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const deleteOrder = async (orderId: string): Promise<void> => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));

    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `orders/${orderId}`);
    }
  };

  // Settings Actions
  const updateSettings = async (newSettings: Partial<StoreSettings>): Promise<void> => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(updated));

    try {
      await setDoc(doc(db, 'settings', 'general'), updated, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/general');
    }
  };

  const resetAllData = async (): Promise<void> => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setSettings(INITIAL_SETTINGS);
    setCart([]);

    try {
      const batch = writeBatch(db);
      INITIAL_PRODUCTS.forEach((p) => batch.set(doc(db, 'products', p.id), p));
      INITIAL_CATEGORIES.forEach((c) => batch.set(doc(db, 'categories', c.id), c));
      batch.set(doc(db, 'settings', 'general'), INITIAL_SETTINGS);
      await batch.commit();
    } catch (e) {
      console.warn('Reset error:', e);
    }
  };

  // Cart Actions
  const addToCart = (product: Product, selectedSize: string, selectedColor: string, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, selectedSize, selectedColor, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)
      )
    );
  };

  const updateCartQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        settings,
        cart,
        isAdminAuthenticated,
        isFirestoreConnected,
        loginAdmin,
        logoutAdmin,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        updateSettings,
        resetAllData,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
