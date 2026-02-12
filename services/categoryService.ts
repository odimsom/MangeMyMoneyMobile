import api from "./api";

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  type: string;
  transactionType: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  type: string;
  transactionType: string;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
}

const getCategories = async (transactionType?: string): Promise<Category[]> => {
  const url = transactionType
    ? `/api/Categories?transactionType=${transactionType}`
    : `/api/Categories`;
  const response = await api.get<{ data: Category[] }>(url);
  return response.data.data || [];
};

const getExpenseCategories = async (): Promise<Category[]> => {
  const response = await api.get<{ data: Category[] }>(
    `/api/Categories/expenses`,
  );
  return response.data.data || [];
};

const getIncomeCategories = async (): Promise<Category[]> => {
  const response = await api.get<{ data: Category[] }>(
    `/api/Categories/income`,
  );
  return response.data.data || [];
};

const getCategoryById = async (id: string): Promise<Category> => {
  const response = await api.get<{ data: Category }>(`/api/Categories/${id}`);
  return response.data.data;
};

const createCategory = async (
  category: CreateCategoryRequest,
): Promise<Category> => {
  const response = await api.post<{ data: Category }>(
    `/api/Categories`,
    category,
  );
  return response.data.data;
};

const updateCategory = async (
  id: string,
  category: UpdateCategoryRequest,
): Promise<Category> => {
  const response = await api.put<{ data: Category }>(
    `/api/Categories/${id}`,
    category,
  );
  return response.data.data;
};

const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/api/Categories/${id}`);
};

export const categoryService = {
  getCategories,
  getExpenseCategories,
  getIncomeCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
