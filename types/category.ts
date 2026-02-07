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
