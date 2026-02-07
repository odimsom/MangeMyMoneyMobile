import { PaginatedResponse } from "@/types/common";
import {
    AccountSummary,
    CategoryBreakdown,
    DailySummary,
    Expense,
    FinancialSummary,
} from "@/types/dashboard";
import api from "./api";

const getFinancialSummary = async (fromDate: string, toDate: string) => {
  const response = await api.get<{ data: FinancialSummary }>(
    `/api/Reports/summary`,
    {
      params: { fromDate, toDate },
    },
  );
  return response.data.data;
};

const getAccountSummary = async () => {
  const response = await api.get<{ data: AccountSummary }>(
    `/api/Accounts/summary`,
  );
  return response.data.data;
};

const getTopCategories = async (fromDate: string, toDate: string) => {
  const response = await api.get<{ data: CategoryBreakdown[] }>(
    `/api/Expenses/summary/category`,
    {
      params: { fromDate, toDate },
    },
  );
  return response.data.data || [];
};

const getRecentTransactions = async () => {
  const response = await api.get<{ data: PaginatedResponse<Expense> }>(
    `/api/Expenses`,
    {
      params: { PageNumber: 1, PageSize: 5 },
    },
  );
  return response.data.data?.data || [];
};

const getDailyExpenses = async (fromDate: string, toDate: string) => {
  const response = await api.get<{ data: DailySummary[] }>(
    `/api/Expenses/summary/daily`,
    {
      params: { fromDate, toDate },
    },
  );
  return response.data.data || [];
};

export const dashboardService = {
  getFinancialSummary,
  getAccountSummary,
  getTopCategories,
  getRecentTransactions,
  getDailyExpenses,
};
