// ===========================================
// 🔐 AUTH STORE
// Zustand store for authentication state
// ===========================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import apiClient, { ApiResponse } from '@/lib/api';

// ===========================================
// 📋 TYPES
// ===========================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT';
  tenantId: string | null;
  permissions: string[];
  isEmailVerified: boolean;
  phone?: string;
  tenant?: {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
  } | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

// ===========================================
// 🏪 AUTH STORE
// ===========================================

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post<ApiResponse<{
            user: User;
            tokens: { accessToken: string; refreshToken: string };
          }>>('/auth/login', { email, password });

          if (response.data.success && response.data.data) {
            const { user, tokens } = response.data.data;

            // Store tokens in cookies
            Cookies.set('accessToken', tokens.accessToken, {
              expires: 1 / 96, // 15 minutes
              sameSite: 'lax',
            });
            Cookies.set('refreshToken', tokens.refreshToken, {
              expires: 7, // 7 days
              sameSite: 'lax',
            });

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: message,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await apiClient.post('/auth/logout');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear tokens
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      fetchUser: async () => {
        const token = Cookies.get('accessToken');

        if (!token) {
          set({ isLoading: false });
          return;
        }

        set({ isLoading: true });

        try {
          const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');

          if (response.data.success && response.data.data?.user) {
            set({
              user: response.data.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ===========================================
// 🔧 PERMISSION HELPERS
// ===========================================

export function useHasPermission(permission: string): boolean {
  const { user } = useAuthStore();

  if (!user) return false;

  // Super Admin has all permissions
  if (user.role === 'SUPER_ADMIN') return true;

  return user.permissions.includes(permission);
}

export function useHasRole(...roles: User['role'][]): boolean {
  const { user } = useAuthStore();

  if (!user) return false;

  return roles.includes(user.role);
}

export function useIsAdmin(): boolean {
  const { user } = useAuthStore();

  if (!user) return false;

  return user.role === 'SUPER_ADMIN' || user.role === 'SCHOOL_ADMIN';
}

export function useIsSuperAdmin(): boolean {
  const { user } = useAuthStore();

  return user?.role === 'SUPER_ADMIN';
}
