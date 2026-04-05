export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export interface Metric {
  totalSpend: number;
  savingsRate: number;
  trend: 'up' | 'down' | 'stable';
}

export interface UserState {
  name: string;
  financialScore: number;
  metrics: Metric;
}
