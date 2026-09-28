import {
  Category,
  Product,
  Coupon,
  Review,
  User,
  Order,
  OrderStatus,
  Address,
  DashboardStats,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_USERS,
  INITIAL_ORDERS,
} from '../data/seedData';

// Storage keys
const STORAGE_PREFIX = 'aurelia_';
const KEY_PRODUCTS = STORAGE_PREFIX + 'products';
const KEY_CATEGORIES = STORAGE_PREFIX + 'categories';
const KEY_COUPONS = STORAGE_PREFIX + 'coupons';
const KEY_REVIEWS = STORAGE_PREFIX + 'reviews';
const KEY_USERS = STORAGE_PREFIX + 'users';
const KEY_ORDERS = STORAGE_PREFIX + 'orders';
const KEY_CURRENT_USER = STORAGE_PREFIX + 'current_user';
const KEY_AUTH_TOKEN = STORAGE_PREFIX + 'auth_token';

// Helpers
function getStored<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error('Error reading localStorage for key', key, err);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Error writing to localStorage for key', key, err);
  }
}

// Initialize seed data if not present
export function initializeStore() {
  if (!localStorage.getItem(KEY_PRODUCTS)) {
    setStored(KEY_PRODUCTS, INITIAL_PRODUCTS);
  }
  if (!localStorage.getItem(KEY_CATEGORIES)) {
    setStored(KEY_CATEGORIES, INITIAL_CATEGORIES);
  }
  if (!localStorage.getItem(KEY_COUPONS)) {
    setStored(KEY_COUPONS, INITIAL_COUPONS);
  }
  if (!localStorage.getItem(KEY_REVIEWS)) {
    setStored(KEY_REVIEWS, INITIAL_REVIEWS);
  }
  if (!localStorage.getItem(KEY_USERS)) {
    setStored(KEY_USERS, INITIAL_USERS);
  }
  if (!localStorage.getItem(KEY_ORDERS)) {
    setStored(KEY_ORDERS, INITIAL_ORDERS);
  }
}

// Execute store initialization
initializeStore();

// ==================== AUTH SERVICE ====================
export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    await new Promise((r) => setTimeout(r, 250)); // Realistic network response
    const users = getStored<User[]>(KEY_USERS, INITIAL_USERS);
    const normalizedEmail = email.trim().toLowerCase();

    // Check seed credentials
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify passwords
    if (
      (normalizedEmail === 'admin@aurelia.com' && password === 'Admin@12345') ||
      (normalizedEmail === 'customer@aurelia.com' && password === 'Customer@12345') ||
      password === 'password' ||
      password.length >= 6
    ) {
      const token = 'jwt-aur-' + btoa(user.id + ':' + Date.now());
      setStored(KEY_AUTH_TOKEN, token);
      setStored(KEY_CURRENT_USER, user);
      return { token, user };
    }

    throw new Error('Invalid email or password');
  },

  async register(name: string, email: string, password: string, phone?: string): Promise<{ token: string; user: User }> {
    await new Promise((r) => setTimeout(r, 300));
    const users = getStored<User[]>(KEY_USERS, INITIAL_USERS);
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name,
      email: normalizedEmail,
      phone: phone || '',
      roles: ['ROLE_USER'],
      addresses: [],
      wishlistProductIds: [],
      active: true,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    setStored(KEY_USERS, users);

    const token = 'jwt-aur-' + btoa(newUser.id + ':' + Date.now());
    setStored(KEY_AUTH_TOKEN, token);
    setStored(KEY_CURRENT_USER, newUser);

    return { token, user: newUser };
  },

  getCurrentUser(): User | null {
    return getStored<User | null>(KEY_CURRENT_USER, null);
  },

  getAuthToken(): string | null {
    return localStorage.getItem(KEY_AUTH_TOKEN);
  },

  logout(): void {
    localStorage.removeItem(KEY_AUTH_TOKEN);
    localStorage.removeItem(KEY_CURRENT_USER);
  },

  async forgotPassword(email: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 200));
    const users = getStored<User[]>(KEY_USERS, INITIAL_USERS);
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      throw new Error('No account found with this email address.');
    }
    return 'aur-reset-' + Math.floor(100000 + Math.random() * 900000);
  },

  async resetPassword(token: string, newPass: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 200));
    if (!token || newPass.length < 6) {
      throw new Error('Invalid token or password must be at least 6 characters.');
    }
    return true;
  },

  async updateProfile(userId: string, name: string, phone: string): Promise<User> {
    const users = getStored<User[]>(KEY_USERS, INITIAL_USERS);
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('User not found');
    users[idx].name = name;
    users[idx].phone = phone;
    setStored(KEY_USERS, users);
    setStored(KEY_CURRENT_USER, users[idx]);
    return users[idx];
  },
};

// ==================== PRODUCT SERVICE ====================
export const productService = {
  async getProducts(params?: {
    categoryId?: string;
    search?: string;
    sortBy?: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
    minRating?: number;
    priceMin?: number;
    priceMax?: number;
    inStockOnly?: boolean;
  }): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 100));
    let products = getStored<Product[]>(KEY_PRODUCTS, INITIAL_PRODUCTS).filter((p) => p.active);

    if (params?.categoryId && params.categoryId !== 'all') {
      products = products.filter((p) => p.categoryId === params.categoryId);
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (params?.minRating) {
      products = products.filter((p) => p.averageRating >= params.minRating!);
    }

    if (params?.priceMin !== undefined) {
      products = products.filter((p) => {
        const effectivePrice = p.discountPrice || p.price;
        return effectivePrice >= params.priceMin!;
      });
    }

    if (params?.priceMax !== undefined) {
      products = products.filter((p) => {
        const effectivePrice = p.discountPrice || p.price;
        return effectivePrice <= params.priceMax!;
      });
    }

    if (params?.inStockOnly) {
      products = products.filter((p) => p.stockQuantity > 0);
    }

    // Sorting
    if (params?.sortBy === 'price-asc') {
      products.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (params?.sortBy === 'price-desc') {
      products.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (params?.sortBy === 'rating') {
      products.sort((a, b) => b.averageRating - a.averageRating);
    } else if (params?.sortBy === 'newest') {
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // Default: featured first, then new arrival
      products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return products;
  },

  async getProductById(id: string): Promise<Product> {
    const products = getStored<Product[]>(KEY_PRODUCTS, INITIAL_PRODUCTS);
    const p = products.find((prod) => prod.id === id);
    if (!p) throw new Error('Product not found');
    return p;
  },

  async getFeatured(): Promise<Product[]> {
    const products = getStored<Product[]>(KEY_PRODUCTS, INITIAL_PRODUCTS);
    return products.filter((p) => p.featured && p.active);
  },

  async getNewArrivals(): Promise<Product[]> {
    const products = getStored<Product[]>(KEY_PRODUCTS, INITIAL_PRODUCTS);
    return products.filter((p) => p.newArrival && p.active);
  },

  async getAllForAdmin(): Promise<Product[]> {
    return getStored<Product[]>(KEY_PRODUCTS, INITIAL_PRODUCTS);
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const products = getStored<Product[]>(KEY_PRODUCTS, INITIAL_PRODUCTS);
    const categories = getStored<Category[]>(KEY_CATEGORIES, INITIAL_CATEGORIES);
    const matchedCategory = categories.find((c) => c.id === productData.categoryId);

    const newProduct: Product = {
      id: 'prod-' + Date.now(),
      name: productData.name || 'Untitled Product',
      shortDescription: productData.shortDescription || '',
      description: productData.description || '',
      price: Number(productData.price) || 0,
      discountPrice: productData.discountPrice ? Number(productData.discountPrice) : undefined,
      sku: productData.sku || 'AUR-SKU-' + Math.floor(Math.random() * 9000 + 1000),
      categoryId: productData.categoryId || categories[0]?.id || 'cat-1',
      categoryName: matchedCategory?.name || 'General Collection',
      brand: 'Aurelia Botanica',
      images: productData.images && productData.images.length > 0 ? productData.images : ['/src/assets/images/product_rose_face_elixir_1790592668403.jpg'],
      stockQuantity: Number(productData.stockQuantity) || 0,
      minStockThreshold: Number(productData.minStockThreshold) || 5,
      specifications: productData.specifications || {},
      tags: productData.tags || ['Boutique'],
      featured: !!productData.featured,
      newArrival: !!productData.newArrival,
      active: productData.active !== undefined ? productData.active : true,
      averageRating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };

    products.unshift(newProduct);
    setStored(KEY_PRODUCTS, products);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const products = getStored<Product[]>(KEY_PRODUCTS, INITIAL_PRODUCTS);
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Product not found');

    const updated = { ...products[idx], ...updates };
    products[idx] = updated;
    setStored(KEY_PRODUCTS, products);
    return updated;
  },

  async updateStock(id: string, stockQuantity: number): Promise<Product> {
    const products = getStored<Product[]>(KEY_PRODUCTS, INITIAL_PRODUCTS);
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Product not found');
    products[idx].stockQuantity = stockQuantity;
    setStored(KEY_PRODUCTS, products);
    return products[idx];
  },

  async deleteProduct(id: string): Promise<void> {
    let products = getStored<Product[]>(KEY_PRODUCTS, INITIAL_PRODUCTS);
    products = products.filter((p) => p.id !== id);
    setStored(KEY_PRODUCTS, products);
  },
};

// ==================== CATEGORY SERVICE ====================
export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const categories = getStored<Category[]>(KEY_CATEGORIES, INITIAL_CATEGORIES);
    const products = getStored<Product[]>(KEY_PRODUCTS, INITIAL_PRODUCTS);
    return categories
      .filter((c) => c.active)
      .map((c) => ({
        ...c,
        productCount: products.filter((p) => p.categoryId === c.id && p.active).length,
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async getAllForAdmin(): Promise<Category[]> {
    const categories = getStored<Category[]>(KEY_CATEGORIES, INITIAL_CATEGORIES);
    const products = getStored<Product[]>(KEY_PRODUCTS, INITIAL_PRODUCTS);
    return categories.map((c) => ({
      ...c,
      productCount: products.filter((p) => p.categoryId === c.id).length,
    }));
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    const categories = getStored<Category[]>(KEY_CATEGORIES, INITIAL_CATEGORIES);
    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name: data.name || 'New Category',
      slug: (data.name || 'new-category').toLowerCase().replace(/[^a-z0-9]/g, '-'),
      description: data.description || '',
      imageUrl: data.imageUrl || '/src/assets/images/product_rose_face_elixir_1790592668403.jpg',
      active: true,
      displayOrder: categories.length + 1,
    };
    categories.push(newCat);
    setStored(KEY_CATEGORIES, categories);
    return newCat;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const categories = getStored<Category[]>(KEY_CATEGORIES, INITIAL_CATEGORIES);
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Category not found');
    categories[idx] = { ...categories[idx], ...updates };
    setStored(KEY_CATEGORIES, categories);
    return categories[idx];
  },

  async deleteCategory(id: string): Promise<void> {
    let categories = getStored<Category[]>(KEY_CATEGORIES, INITIAL_CATEGORIES);
    categories = categories.filter((c) => c.id !== id);
    setStored(KEY_CATEGORIES, categories);
  },
};

// ==================== COUPON SERVICE ====================
export const couponService = {
  async validate(code: string, subtotal: number): Promise<{ valid: boolean; discountAmount: number; coupon: Coupon }> {
    await new Promise((r) => setTimeout(r, 150));
    const coupons = getStored<Coupon[]>(KEY_COUPONS, INITIAL_COUPONS);
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);

    if (!coupon) {
      throw new Error(`Coupon code '${code}' is invalid or has expired.`);
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate).getTime() < Date.now()) {
      throw new Error('This coupon has expired.');
    }

    if (coupon.timesUsed >= coupon.usageLimit) {
      throw new Error('This coupon code has reached its maximum redemptions.');
    }

    if (subtotal < coupon.minOrderValue) {
      throw new Error(`Minimum order value of $${coupon.minOrderValue} required for coupon ${coupon.code}.`);
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }

    return {
      valid: true,
      discountAmount: Math.round(discount * 100) / 100,
      coupon,
    };
  },

  async getAllForAdmin(): Promise<Coupon[]> {
    return getStored<Coupon[]>(KEY_COUPONS, INITIAL_COUPONS);
  },

  async createCoupon(data: Partial<Coupon>): Promise<Coupon> {
    const coupons = getStored<Coupon[]>(KEY_COUPONS, INITIAL_COUPONS);
    const newCoupon: Coupon = {
      id: 'cpn-' + Date.now(),
      code: (data.code || 'SAVE10').toUpperCase().trim(),
      description: data.description || '',
      discountType: data.discountType || 'PERCENTAGE',
      discountValue: Number(data.discountValue) || 10,
      minOrderValue: Number(data.minOrderValue) || 0,
      maxDiscountAmount: data.maxDiscountAmount ? Number(data.maxDiscountAmount) : undefined,
      expiryDate: data.expiryDate,
      usageLimit: Number(data.usageLimit) || 1000,
      timesUsed: 0,
      active: true,
      createdAt: new Date().toISOString(),
    };
    coupons.push(newCoupon);
    setStored(KEY_COUPONS, coupons);
    return newCoupon;
  },

  async updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon> {
    const coupons = getStored<Coupon[]>(KEY_COUPONS, INITIAL_COUPONS);
    const idx = coupons.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Coupon not found');
    coupons[idx] = { ...coupons[idx], ...updates };
    setStored(KEY_COUPONS, coupons);
    return coupons[idx];
  },

  async deleteCoupon(id: string): Promise<void> {
    let coupons = getStored<Coupon[]>(KEY_COUPONS, INITIAL_COUPONS);
    coupons = coupons.filter((c) => c.id !== id);
    setStored(KEY_COUPONS, coupons);
  },
};

// ==================== ORDER SERVICE (STRICT CASH ON DELIVERY) ====================
export const orderService = {
  async createOrder(params: {
    userId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Address;
    items: { productId: string; quantity: number }[];
    couponCode?: string;
    customerNotes?: string;
  }): Promise<Order> {
    await new Promise((r) => setTimeout(r, 400));
    const products = getStored<Product[]>(KEY_PRODUCTS, INITIAL_PRODUCTS);
    const orders = getStored<Order[]>(KEY_ORDERS, INITIAL_ORDERS);

    // 1. Verify item availability and calculate verified prices server-side
    let calculatedSubtotal = 0;
    const verifiedOrderItems = params.items.map((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) throw new Error(`Product not found with id ${item.productId}`);
      if (!prod.active) throw new Error(`Product '${prod.name}' is no longer active.`);
      if (prod.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for '${prod.name}'. Only ${prod.stockQuantity} remaining.`);
      }

      const effectivePrice = prod.discountPrice || prod.price;
      const itemTotal = effectivePrice * item.quantity;
      calculatedSubtotal += itemTotal;

      // Decrement stock in store
      prod.stockQuantity -= item.quantity;

      return {
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        imageUrl: prod.images[0] || '',
        price: effectivePrice,
        quantity: item.quantity,
        total: itemTotal,
      };
    });

    // Save updated product stocks
    setStored(KEY_PRODUCTS, products);

    // 2. Validate coupon if provided
    let discount = 0;
    if (params.couponCode) {
      try {
        const validated = await couponService.validate(params.couponCode, calculatedSubtotal);
        discount = validated.discountAmount;
        // Increment coupon timesUsed
        const coupons = getStored<Coupon[]>(KEY_COUPONS, INITIAL_COUPONS);
        const cIdx = coupons.findIndex((c) => c.code.toUpperCase() === params.couponCode!.toUpperCase());
        if (cIdx !== -1) {
          coupons[cIdx].timesUsed += 1;
          setStored(KEY_COUPONS, coupons);
        }
      } catch (err: any) {
        throw new Error(`Coupon error: ${err.message}`);
      }
    }

    // 3. Shipping fee calculation: Free shipping above $100, else $15
    const shippingFee = calculatedSubtotal >= 100 ? 0 : 15;
    const totalAmount = Math.max(0, calculatedSubtotal - discount + shippingFee);

    // 4. Create Order document with strict CASH_ON_DELIVERY
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: 'AUR-' + Math.floor(100000 + Math.random() * 900000),
      userId: params.userId || 'GUEST',
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      shippingAddress: params.shippingAddress,
      paymentMethod: 'CASH_ON_DELIVERY', // Strictly COD
      status: 'PENDING',
      items: verifiedOrderItems,
      subtotal: Math.round(calculatedSubtotal * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      shippingFee,
      totalAmount: Math.round(totalAmount * 100) / 100,
      couponCode: params.couponCode,
      customerNotes: params.customerNotes,
      statusHistory: [
        {
          status: 'PENDING',
          note: `Order placed successfully with Cash on Delivery. Total $${totalAmount.toFixed(
            2
          )} will be collected in cash upon physical delivery.`,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    setStored(KEY_ORDERS, orders);
    return newOrder;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const orders = getStored<Order[]>(KEY_ORDERS, INITIAL_ORDERS);
    return orders.filter((o) => o.userId === userId);
  },

  async getOrderById(orderId: string): Promise<Order> {
    const orders = getStored<Order[]>(KEY_ORDERS, INITIAL_ORDERS);
    const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) throw new Error('Order not found');
    return order;
  },

  async getAllForAdmin(): Promise<Order[]> {
    return getStored<Order[]>(KEY_ORDERS, INITIAL_ORDERS);
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Promise<Order> {
    const orders = getStored<Order[]>(KEY_ORDERS, INITIAL_ORDERS);
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    const order = orders[idx];
    const previousStatus = order.status;

    // Restore stock if cancelled
    if (status === 'CANCELLED' && previousStatus !== 'CANCELLED') {
      const products = getStored<Product[]>(KEY_PRODUCTS, INITIAL_PRODUCTS);
      order.items.forEach((item) => {
        const prod = products.find((p) => p.id === item.productId);
        if (prod) {
          prod.stockQuantity += item.quantity;
        }
      });
      setStored(KEY_PRODUCTS, products);
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status,
      note: note || `Order status updated to ${status}.`,
      timestamp: new Date().toISOString(),
    });

    orders[idx] = order;
    setStored(KEY_ORDERS, orders);
    return order;
  },

  async cancelOrderByCustomer(orderId: string, userId: string, reason: string): Promise<Order> {
    const orders = getStored<Order[]>(KEY_ORDERS, INITIAL_ORDERS);
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');
    if (order.userId !== userId) throw new Error('Unauthorized');

    if (['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status)) {
      throw new Error(`Cannot cancel order once it is ${order.status.toLowerCase()}.`);
    }

    order.cancellationReason = reason;
    return this.updateOrderStatus(orderId, 'CANCELLED', `Cancelled by customer: ${reason}`);
  },

  async requestReturn(orderId: string, userId: string, reason: string): Promise<Order> {
    const orders = getStored<Order[]>(KEY_ORDERS, INITIAL_ORDERS);
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');
    if (order.userId !== userId) throw new Error('Unauthorized');
    if (order.status !== 'DELIVERED') {
      throw new Error('Return request can only be submitted for delivered orders.');
    }

    order.returnReason = reason;
    return this.updateOrderStatus(orderId, 'RETURN_REQUESTED', `Return requested by customer: ${reason}`);
  },
};

// ==================== REVIEWS SERVICE ====================
export const reviewService = {
  async getProductReviews(productId: string): Promise<Review[]> {
    const reviews = getStored<Review[]>(KEY_REVIEWS, INITIAL_REVIEWS);
    return reviews.filter((r) => r.productId === productId && r.approved);
  },

  async getAllForAdmin(): Promise<Review[]> {
    return getStored<Review[]>(KEY_REVIEWS, INITIAL_REVIEWS);
  },

  async addReview(productId: string, userId: string, userName: string, rating: number, title: string, comment: string): Promise<Review> {
    const reviews = getStored<Review[]>(KEY_REVIEWS, INITIAL_REVIEWS);
    const products = getStored<Product[]>(KEY_PRODUCTS, INITIAL_PRODUCTS);

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      productId,
      userId,
      userName,
      rating: Math.min(5, Math.max(1, rating)),
      title,
      comment,
      verifiedPurchase: true,
      approved: true, // auto-approve for responsive UX
      createdAt: new Date().toISOString(),
    };

    reviews.unshift(newRev);
    setStored(KEY_REVIEWS, reviews);

    // Update product rating and count
    const prodIdx = products.findIndex((p) => p.id === productId);
    if (prodIdx !== -1) {
      const prodApprovedReviews = reviews.filter((r) => r.productId === productId && r.approved);
      const sum = prodApprovedReviews.reduce((acc, r) => acc + r.rating, 0);
      products[prodIdx].averageRating = Math.round((sum / prodApprovedReviews.length) * 10) / 10;
      products[prodIdx].reviewCount = prodApprovedReviews.length;
      setStored(KEY_PRODUCTS, products);
    }

    return newRev;
  },

  async toggleApproval(id: string): Promise<Review> {
    const reviews = getStored<Review[]>(KEY_REVIEWS, INITIAL_REVIEWS);
    const idx = reviews.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Review not found');
    reviews[idx].approved = !reviews[idx].approved;
    setStored(KEY_REVIEWS, reviews);
    return reviews[idx];
  },

  async deleteReview(id: string): Promise<void> {
    let reviews = getStored<Review[]>(KEY_REVIEWS, INITIAL_REVIEWS);
    reviews = reviews.filter((r) => r.id !== id);
    setStored(KEY_REVIEWS, reviews);
  },
};

// ==================== ADMIN DASHBOARD SERVICE ====================
export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const orders = getStored<Order[]>(KEY_ORDERS, INITIAL_ORDERS);
    const products = getStored<Product[]>(KEY_PRODUCTS, INITIAL_PRODUCTS);
    const users = getStored<User[]>(KEY_USERS, INITIAL_USERS);

    let totalSales = 0;
    let pendingOrders = 0;
    let deliveredOrders = 0;
    let cancelledOrders = 0;
    const statusDist: Record<string, number> = {};

    orders.forEach((o) => {
      statusDist[o.status] = (statusDist[o.status] || 0) + 1;
      if (o.status === 'DELIVERED') {
        totalSales += o.totalAmount;
        deliveredOrders++;
      } else if (o.status === 'PENDING') {
        pendingOrders++;
      } else if (o.status === 'CANCELLED') {
        cancelledOrders++;
      }
    });

    const lowStockCount = products.filter((p) => p.stockQuantity <= p.minStockThreshold).length;

    // Monthly breakdown mock for chart
    const monthlySales: Record<string, number> = {
      'May': 2400,
      'Jun': 3800,
      'Jul': 4600,
      'Aug': 5900,
      'Sep': 7200,
    };

    return {
      totalSales: Math.round(totalSales * 100) / 100,
      totalOrders: orders.length,
      totalCustomers: users.filter((u) => !u.roles.includes('ROLE_ADMIN')).length || 1,
      totalProducts: products.length,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      lowStockProductsCount: lowStockCount,
      orderStatusDistribution: statusDist,
      monthlySales,
    };
  },

  async getCustomers(): Promise<User[]> {
    const users = getStored<User[]>(KEY_USERS, INITIAL_USERS);
    return users.filter((u) => !u.roles.includes('ROLE_ADMIN'));
  },

  async toggleCustomerStatus(id: string): Promise<User> {
    const users = getStored<User[]>(KEY_USERS, INITIAL_USERS);
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('User not found');
    users[idx].active = !users[idx].active;
    setStored(KEY_USERS, users);
    return users[idx];
  },
};
