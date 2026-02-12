import api from "./api";

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  color?: string;
  icon?: string;
  accountNumber?: string;
  institutionName?: string;
  status: "Active" | "Inactive";
}

export interface CreateAccountRequest {
  name: string;
  type: string;
  initialBalance: number;
  currency: string;
  color?: string;
  icon?: string;
  accountNumber?: string;
  institutionName?: string;
}

export interface UpdateAccountRequest {
  name: string;
  type: string;
  currency: string;
  color?: string;
  icon?: string;
  accountNumber?: string;
  institutionName?: string;
  isActive: boolean;
}

export interface AccountSummary {
  totalBalance: number;
  accountCount: number;
  monthlyIncome: number;
  monthlyExpense: number;
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: string;
  description?: string;
}

const getAccounts = async (activeOnly = true): Promise<Account[]> => {
  const response = await api.get<{ data: Account[] }>(`/api/Accounts`, {
    params: { activeOnly },
  });
  return response.data.data || [];
};

const getAccountById = async (id: string): Promise<Account> => {
  const response = await api.get<{ data: Account }>(`/api/Accounts/${id}`);
  return response.data.data;
};

const createAccount = async (data: CreateAccountRequest): Promise<Account> => {
  const response = await api.post<{ data: Account }>(`/api/Accounts`, data);
  return response.data.data;
};

const updateAccount = async (
  id: string,
  data: UpdateAccountRequest,
): Promise<Account> => {
  const response = await api.put<{ data: Account }>(
    `/api/Accounts/${id}`,
    data,
  );
  return response.data.data;
};

const deleteAccount = async (id: string): Promise<void> => {
  await api.delete(`/api/Accounts/${id}`);
};

const getSummary = async (): Promise<AccountSummary> => {
  const response = await api.get<{ data: AccountSummary }>(
    `/api/Accounts/summary`,
  );
  return response.data.data;
};

const transfer = async (data: TransferRequest): Promise<any> => {
  const response = await api.post(`/api/Accounts/transfer`, data);
  return response.data;
};

export const accountService = {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  getSummary,
  transfer,
};
