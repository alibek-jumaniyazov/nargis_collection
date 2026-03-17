import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { getMe, login as loginApi, logout as logoutApi, register as registerApi } from '../api/services';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await loginApi({ email, password });
          const { token, user } = res.data;
          localStorage.setItem('nc_token', token);
          set({ user, token, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      register: async (fullName, email, password) => {
        set({ isLoading: true });
        try {
          const res = await registerApi({ fullName, email, password });
          const { token, user } = res.data as any;
          localStorage.setItem('nc_token', token);
          set({ user, token, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try { await logoutApi(); } catch {}
        localStorage.removeItem('nc_token');
        set({ user: null, token: null });
      },

      fetchMe: async () => {
        try {
          const res = await getMe();
          set({ user: res.data });
        } catch {
          set({ user: null, token: null });
          localStorage.removeItem('nc_token');
        }
      },
    }),
    { name: 'nc-auth', partialize: (state) => ({ token: state.token }) }
  )
);
