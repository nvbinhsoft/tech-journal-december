import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, articlesApi, tagsApi, settingsApi, auditApi, clearAccessToken, getAccessToken, setAccessToken, setSessionExpiredCallback } from './api';
import type { Article, Tag, Settings, User, Pagination } from './api/types';
import type { AuditLog } from './api/audit';
import { mockArticles, mockTags, mockSettings, mockUser, MOCK_CREDENTIALS } from './mock/data';

// Check if we're in mock mode
const isMockMode = () => import.meta.env.VITE_MOCK_DATA === 'true';

// Re-export types for backward compatibility
export type { Article, Tag, Settings };

interface BlogStore {
  // Data
  articles: Article[];
  tags: Tag[];
  settings: Settings;

  // Auth state
  isAdmin: boolean;
  user: User | null;
  sessionExpired: boolean;

  // Loading states
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;

  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  handleSessionExpired: () => void;
  clearSessionExpired: () => void;

  // Data fetching
  fetchArticles: () => Promise<void>;
  fetchTags: () => Promise<void>;
  fetchSettings: () => Promise<void>;

  // Article actions
  addArticle: (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateArticle: (id: string, article: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;

  // Tag actions
  addTag: (tag: Omit<Tag, 'id'>) => Promise<void>;
  updateTag: (id: string, tag: Partial<Tag>) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;

  // Settings actions
  updateSettings: (settings: Partial<Settings>) => Promise<void>;

  // Audit actions
  auditLogs: AuditLog[];
  auditPagination: Pagination | null;
  fetchAuditLogs: (page?: number, limit?: number) => Promise<void>;

  // Utility
  clearError: () => void;
}

export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      // Initial state
      articles: isMockMode() ? mockArticles : [],
      tags: isMockMode() ? mockTags : [],
      settings: isMockMode() ? mockSettings : {
        blogTitle: '',
        blogDescription: '',
        authorName: '',
        authorBio: '',
        socialLinks: {},
      },
      isAdmin: false,
      user: null,
      sessionExpired: false,
      isInitialized: false,
      isLoading: false,
      error: null,

      // ============================================
      // Auth Actions
      // ============================================

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          if (isMockMode()) {
            // Mock mode: check against default credentials
            if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
              set({ isAdmin: true, user: mockUser, isLoading: false });
              // Keep a token so admin state survives refresh in mock mode
              setAccessToken('mock-token');
              return true;
            }
            set({ error: 'Invalid credentials', isLoading: false });
            return false;
          }

          // API mode: call real API
          const response = await authApi.login({ email, password });
          set({
            isAdmin: true,
            user: response.user,
            isLoading: false
          });
          return true;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({ error: message, isLoading: false });
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          if (!isMockMode()) {
            await authApi.logout();
          }
        } catch {
          // Ignore logout errors
        } finally {
          clearAccessToken();
          set({
            isAdmin: false,
            user: null,
            isLoading: false
          });
        }
      },

      checkAuth: async () => {
        const token = getAccessToken();
        if (!token) {
          set({ isAdmin: false, user: null });
          return;
        }

        if (isMockMode()) {
          // In mock mode, if we have a token stored, consider user logged in
          set({ isAdmin: true, user: mockUser });
          return;
        }

        try {
          const user = await authApi.getCurrentUser();
          set({ isAdmin: true, user });
        } catch {
          clearAccessToken();
          set({ isAdmin: false, user: null });
        }
      },

      handleSessionExpired: () => {
        clearAccessToken();
        set({
          isAdmin: false,
          user: null,
          sessionExpired: true,
        });
      },

      clearSessionExpired: () => {
        set({ sessionExpired: false });
      },

      // ============================================
      // Data Fetching
      // ============================================

      fetchArticles: async () => {
        if (isMockMode()) {
          // In mock mode, articles are already loaded from initial state
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const { isAdmin } = get();
          if (isAdmin) {
            const response = await articlesApi.getAdminArticles();
            set({ articles: response.data, isLoading: false });
          } else {
            const response = await articlesApi.getPublicArticles();
            set({ articles: response.data, isLoading: false });
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch articles';
          set({ error: message, isLoading: false });
        }
      },

      fetchTags: async () => {
        if (isMockMode()) {
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const tags = await tagsApi.getPublicTags();
          set({ tags, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch tags';
          set({ error: message, isLoading: false });
        }
      },

      fetchSettings: async () => {
        if (isMockMode()) {
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const settings = await settingsApi.getPublicSettings();
          set({ settings, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch settings';
          set({ error: message, isLoading: false });
        }
      },

      // ============================================
      // Article Actions
      // ============================================

      addArticle: async (article) => {
        set({ isLoading: true, error: null });

        try {
          if (isMockMode()) {
            const id = Date.now().toString();
            const now = new Date().toISOString();
            const newArticle: Article = {
              ...article,
              id,
              createdAt: now,
              updatedAt: now,
            };
            set((state) => ({
              articles: [newArticle, ...state.articles],
              isLoading: false,
            }));
            return;
          }

          const newArticle = await articlesApi.createArticle({
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: article.content,
            coverImage: article.coverImage,
            tags: article.tags,
            published: article.published,
          });
          set((state) => ({
            articles: [newArticle, ...state.articles],
            isLoading: false,
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to create article';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      updateArticle: async (id, updates) => {
        set({ isLoading: true, error: null });

        try {
          if (isMockMode()) {
            set((state) => ({
              articles: state.articles.map((article) =>
                article.id === id
                  ? { ...article, ...updates, updatedAt: new Date().toISOString() }
                  : article
              ),
              isLoading: false,
            }));
            return;
          }

          const updatedArticle = await articlesApi.updateArticle(id, updates);
          set((state) => ({
            articles: state.articles.map((article) =>
              article.id === id ? updatedArticle : article
            ),
            isLoading: false,
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update article';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      deleteArticle: async (id) => {
        set({ isLoading: true, error: null });

        try {
          if (!isMockMode()) {
            await articlesApi.deleteArticle(id);
          }

          set((state) => ({
            articles: state.articles.filter((article) => article.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete article';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // ============================================
      // Tag Actions
      // ============================================

      addTag: async (tag) => {
        set({ isLoading: true, error: null });

        try {
          if (isMockMode()) {
            const id = Date.now().toString();
            set((state) => ({
              tags: [...state.tags, { ...tag, id }],
              isLoading: false,
            }));
            return;
          }

          const newTag = await tagsApi.createTag(tag);
          set((state) => ({
            tags: [...state.tags, newTag],
            isLoading: false,
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to create tag';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      updateTag: async (id, updates) => {
        set({ isLoading: true, error: null });

        try {
          if (isMockMode()) {
            set((state) => ({
              tags: state.tags.map((tag) =>
                tag.id === id ? { ...tag, ...updates } : tag
              ),
              isLoading: false,
            }));
            return;
          }

          const updatedTag = await tagsApi.updateTag(id, updates);
          set((state) => ({
            tags: state.tags.map((tag) =>
              tag.id === id ? updatedTag : tag
            ),
            isLoading: false,
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update tag';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      deleteTag: async (id) => {
        set({ isLoading: true, error: null });

        try {
          if (!isMockMode()) {
            await tagsApi.deleteTag(id);
          }

          set((state) => ({
            tags: state.tags.filter((tag) => tag.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete tag';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // ============================================
      // Settings Actions
      // ============================================

      updateSettings: async (updates) => {
        set({ isLoading: true, error: null });

        try {
          if (isMockMode()) {
            set((state) => ({
              settings: { ...state.settings, ...updates },
              isLoading: false,
            }));
            return;
          }

          const updatedSettings = await settingsApi.updateSettings(updates);
          set({ settings: updatedSettings, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update settings';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // ============================================
      // Audit Actions
      // ============================================

      auditLogs: [],
      auditPagination: null,

      fetchAuditLogs: async (page = 1, limit = 20) => {
        if (isMockMode()) {
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const response = await auditApi.getAuditLogs({ page, limit });
          set({
            auditLogs: response.data,
            auditPagination: response.pagination,
            isLoading: false
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch audit logs';
          set({ error: message, isLoading: false });
        }
      },

      // ============================================
      // Utility
      // ============================================

      clearError: () => set({ error: null }),
    }),
    {
      name: 'blog-storage',
      partialize: (state) => ({
        // Persist auth for API mode; persist data too in mock mode so refresh keeps local edits
        isAdmin: state.isAdmin,
        user: state.user,
        ...(isMockMode()
          ? {
            articles: state.articles,
            tags: state.tags,
            settings: state.settings,
          }
          : {}),
      }),
    }
  )
);

// Initialize: check auth and fetch data on app start
export async function initializeStore() {
  const store = useBlogStore.getState();

  // Check if user is authenticated
  await store.checkAuth();

  // Fetch initial data (only in API mode; mock mode already has data)
  if (!isMockMode()) {
    await Promise.all([
      store.fetchArticles(),
      store.fetchTags(),
      store.fetchSettings(),
    ]);
  }

  useBlogStore.setState({ isInitialized: true });
}

// Set up session expired callback
setSessionExpiredCallback(() => {
  useBlogStore.getState().handleSessionExpired();
});
