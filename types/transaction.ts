export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  categoryName: string;
  categoryColor?: string;
  accountName: string;
  type: "Expense" | "Income";
}

export interface TransactionFilters {
  pageNumber?: number;
  pageSize?: number;
  categoryId?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

export interface CreateExpenseRequest {
  amount: number;
  description: string;
  categoryId: string;
  accountId: string;
  date: string;
  currency: string;
}

export interface CreateIncomeRequest {
  amount: number;
  description: string;
  categoryId: string;
  accountId: string;
  date: string;
  currency: string;
}

export interface IncomeSource {
  id: string;
  name: string;
}
