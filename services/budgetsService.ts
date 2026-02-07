import { Budget } from "@/types/budget";
import api from "./api";

const getBudgets = async () => {
  const response = await api.get<{ data: Budget[] }>(`/api/Budgets`);
  return response.data.data || [];
};

const createBudget = async (data: Partial<Budget>) => {
  const response = await api.post<{ data: Budget }>(`/api/Budgets`, data);
  return response.data.data;
};

export const budgetsService = {
  getBudgets,
  createBudget,
};
