
export type Currency = "USD" | "EUR" | "DOP";

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  currency: string;
}

export interface Expense {
  id: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  categoryName: string;
  categoryColor?: string;
  accountName: string;
}

export interface AccountSummary {
  totalBalance: number;
  currency: string;
  activeAccountsCount: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  categoryColor?: string;
  percentage: number;
  amount: number;
}

export interface DailySummary {
  date: string;
  amount: number;
}
