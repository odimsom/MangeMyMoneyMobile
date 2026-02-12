import api from "./api";

export interface PaginatedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

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

const getTransactions = async (filters: TransactionFilters) => {
  // Assuming /api/Expenses handles fetching transactions for now.
  // Ideally this should fetch both or have a separate endpoint.
  // The web implementation maps them to 'Expense'.
  const response = await api.get<{ data: PaginatedResponse<Transaction> }>(
    `/api/Expenses`,
    {
      params: filters,
    },
  );

  const transactionsRaw = response.data.data?.data || [];
  // Force type casting or mapping if the API doesn't return 'type'
  // Note: If the API returns 'type', this override might be wrong.
  // But following web logic:
  const transactions = transactionsRaw.map((t: any) => ({
    ...t,
    type: "Expense" as const,
  }));

  // We need to construct the full paginated response structure
  return {
    ...response.data.data,
    data: transactions,
  } as PaginatedResponse<Transaction>;
};

const createExpense = async (data: CreateExpenseRequest) => {
  const response = await api.post<{ data: Transaction }>(`/api/Expenses`, data);
  return response.data.data;
};

const createIncome = async (data: CreateIncomeRequest) => {
  const response = await api.post<{ data: Transaction }>(`/api/Income`, data);
  return response.data.data;
};

const getIncomeSources = async () => {
  const response = await api.get<{ data: IncomeSource[] }>(
    `/api/Income/sources`,
  );
  return response.data.data || [];
};

export const transactionsService = {
  getTransactions,
  createExpense,
  createIncome,
  getIncomeSources,
};
