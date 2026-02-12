import api from "./api";

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  spentAmount: number;
  currency: string;
  period: "Monthly" | "Yearly";
  startDate: string;
  endDate: string;
  percentage: number;
}

export interface CreateBudgetRequest {
  categoryId: string;
  amount: number;
  period: "Monthly" | "Yearly";
  startDate: string;
  endDate: string;
  currency: string;
}

export interface UpdateBudgetRequest {
  amount: number;
  period: "Monthly" | "Yearly";
  startDate: string;
  endDate: string;
}

export interface BudgetProgress {
  budgetId: string;
  categoryName: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  daysRemaining: number;
  status: "OnTrack" | "NearLimit" | "OverBudget";
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: "Active" | "Completed" | "Paused" | "Cancelled";
  currency: string;
}

const getBudgets = async () => {
  const response = await api.get<{ data: Budget[] }>(`/api/Budgets`);
  return response.data.data || [];
};

const createBudget = async (data: CreateBudgetRequest) => {
  const response = await api.post<{ data: Budget }>(`/api/Budgets`, data);
  return response.data.data;
};

const updateBudget = async (id: string, data: UpdateBudgetRequest) => {
  const response = await api.put<{ data: Budget }>(`/api/Budgets/${id}`, data);
  return response.data.data;
};

const deleteBudget = async (id: string) => {
  await api.delete(`/api/Budgets/${id}`);
};

const getGoals = async () => {
  const response = await api.get<{ data: SavingsGoal[] }>(`/api/SavingsGoals`);
  return response.data.data || [];
};

export const budgetsService = {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getGoals,
};
