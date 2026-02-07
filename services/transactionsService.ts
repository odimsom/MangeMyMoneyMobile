import { PaginatedResponse } from "@/types/common";
import {
    CreateExpenseRequest,
    CreateIncomeRequest,
    IncomeSource,
    Transaction,
    TransactionFilters,
} from "@/types/transaction";
import api from "./api";

const getTransactions = async (filters: TransactionFilters) => {
  // The API might have separate endpoints for expenses and incomes,
  // or a unified one. Based on dashboardService, we have /api/Expenses.
  const response = await api.get<{ data: PaginatedResponse<Transaction> }>(
    `/api/Expenses`,
    {
      params: filters,
    },
  );

  // Adding type to each transaction for UI display
  const transactionsRaw = response.data.data?.data || [];
  const transactions: Transaction[] = transactionsRaw.map((t: any) => ({
    ...t,
    type: "Expense",
  }));

  // To strictly match PaginatedResponse<Transaction>
  const result: PaginatedResponse<Transaction> = {
    ...response.data.data,
    data: transactions,
  };

  return result;
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
