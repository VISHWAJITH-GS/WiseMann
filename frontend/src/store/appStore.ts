import { create } from 'zustand';
import type { Store, User, Budget, Product, Recommendation, AIMessage } from '../types';

interface AppState {
  // User & Store
  currentUser: User | null;
  currentStore: Store | null;
  
  // Data
  budget: Budget | null;
  products: Product[];
  recommendations: Recommendation[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  selectedProductId: string | null;
  dataFreshness: string | null;
  
  // Chat
  aiMessages: AIMessage[];
  
  // Actions
  setCurrentUser: (user: User) => void;
  setCurrentStore: (store: Store) => void;
  setBudget: (budget: Budget) => void;
  setProducts: (products: Product[]) => void;
  setRecommendations: (recommendations: Recommendation[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setSelectedProductId: (id: string | null) => void;
  setDataFreshness: (freshness: string) => void;
  addAIMessage: (message: AIMessage) => void;
  clearAIMessages: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  currentStore: null,
  budget: null,
  products: [],
  recommendations: [],
  isLoading: false,
  error: null,
  selectedProductId: null,
  dataFreshness: null,
  aiMessages: [],
  
  setCurrentUser: (user) => set({ currentUser: user }),
  setCurrentStore: (store) => set({ currentStore: store }),
  setBudget: (budget) => set({ budget }),
  setProducts: (products) => set({ products }),
  setRecommendations: (recommendations) => set({ recommendations }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setSelectedProductId: (id) => set({ selectedProductId: id }),
  setDataFreshness: (freshness) => set({ dataFreshness: freshness }),
  addAIMessage: (message) => 
    set((state) => ({ aiMessages: [...state.aiMessages, message] })),
  clearAIMessages: () => set({ aiMessages: [] }),
  reset: () => set({
    currentUser: null,
    currentStore: null,
    budget: null,
    products: [],
    recommendations: [],
    isLoading: false,
    error: null,
    selectedProductId: null,
    dataFreshness: null,
    aiMessages: [],
  }),
}));
