// Types for the entire Nargis Collection platform

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'customer';
  phone?: string;
  addresses?: Address[];
  wishlist?: string[];
  createdAt: string;
}

export interface Address {
  id: string;
  title: string;
  city: string;
  district: string;
  addressLine: string;
  zipCode: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  gender: 'women' | 'men' | 'unisex';
  isActive: boolean;
}

export interface ProductSize {
  size: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  category: Category;
  collection?: string;
  gender: 'women' | 'men' | 'unisex';
  colors: string[];
  sizes: ProductSize[];
  images: string[];
  coverImage: string;
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  rating: number;
  reviewCount: number;
  isPublished: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'cash' | 'card';
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  addressLine: string;
  zipCode: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
}

export interface FilterState {
  category?: string;
  gender?: string;
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'featured';
  search?: string;
}
