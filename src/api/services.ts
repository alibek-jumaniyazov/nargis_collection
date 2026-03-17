import api from './client';
import type { Product, Category, Banner, FilterState, Order } from '../types';

// ─── Products ────────────────────────────────────────────────────────────────
export const getProducts = (filters?: FilterState) =>
  api.get<{ products: Product[]; total: number }>('/products', { params: filters });

export const getProductBySlug = (slug: string) =>
  api.get<Product>(`/products/${slug}`);

export const getFeaturedProducts = () =>
  api.get<Product[]>('/products?isFeatured=true&limit=8');

export const getNewArrivals = () =>
  api.get<Product[]>('/products?isNewArrival=true&limit=8');

// ─── Categories ──────────────────────────────────────────────────────────────
export const getCategories = () =>
  api.get<Category[]>('/categories');

export const getCategoryBySlug = (slug: string) =>
  api.get<Category>(`/categories/${slug}`);

// ─── Banners ─────────────────────────────────────────────────────────────────
export const getBanners = () =>
  api.get<Banner[]>('/banners');

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const register = (data: { fullName: string; email: string; password: string }) =>
  api.post('/auth/register', data);

export const login = (data: { email: string; password: string }) =>
  api.post<{ token: string; user: any }>('/auth/login', data);

export const getMe = () =>
  api.get('/auth/me');

export const logout = () =>
  api.post('/auth/logout');

// ─── Orders ──────────────────────────────────────────────────────────────────
export const createOrder = (data: any) =>
  api.post<Order>('/orders', data);

export const getMyOrders = () =>
  api.get<Order[]>('/orders/my');

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export const addToWishlist = (productId: string) =>
  api.post('/wishlist', { productId });

export const removeFromWishlist = (productId: string) =>
  api.delete(`/wishlist/${productId}`);

export const getWishlist = () =>
  api.get('/wishlist');
