export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED';

export type PaymentMethod = 'CASH_ON_DELIVERY';

export interface Address {
  id: string;
  houseFlat: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles: Role[];
  addresses: Address[];
  wishlistProductIds: string[];
  active: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  active: boolean;
  displayOrder: number;
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  discountPrice?: number;
  sku: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  images: string[];
  stockQuantity: number;
  minStockThreshold: number;
  specifications: Record<string, string>;
  tags: string[];
  featured: boolean;
  newArrival: boolean;
  active: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  imageUrl: string;
  price: number;
  quantity: number;
  total: number;
}

export interface StatusTimelineEntry {
  status: OrderStatus;
  note: string;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  couponCode?: string;
  customerNotes?: string;
  cancellationReason?: string;
  returnReason?: string;
  statusHistory: StatusTimelineEntry[];
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  approved: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount?: number;
  expiryDate?: string;
  usageLimit: number;
  timesUsed: number;
  active: boolean;
  createdAt?: string;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  lowStockProductsCount: number;
  orderStatusDistribution: Record<string, number>;
  monthlySales: Record<string, number>;
}
