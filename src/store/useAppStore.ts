import { create } from 'zustand';
import type { Transaction } from '../types';

interface AppState {
  transactions: Transaction[];
  financialScore: number;
  userName: string;
  monthlyIncome: number;
  isProcessing: boolean;
  addTransactions: (newTransactions: Transaction[]) => void;
  setUser: (name: string, income: number) => void;
  setProcessing: (status: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  transactions: [],
  financialScore: 50,
  userName: "User",
  monthlyIncome: 5000,
  isProcessing: false,
  addTransactions: (newTransactions) => set((state) => ({ transactions: [...state.transactions, ...newTransactions] })),
  setUser: (userName, monthlyIncome) => set({ userName, monthlyIncome }),
  setProcessing: (isProcessing) => set({ isProcessing }),
}));
