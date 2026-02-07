import { Account, CreateAccountRequest } from "@/types/account";
import api from "./api";

const getAccounts = async (activeOnly = true) => {
  const response = await api.get<{ data: Account[] }>(`/api/Accounts`, {
    params: { activeOnly },
  });
  return response.data.data || [];
};

const getAccountById = async (id: string) => {
  const response = await api.get<{ data: Account }>(`/api/Accounts/${id}`);
  return response.data.data;
};

const createAccount = async (data: CreateAccountRequest) => {
  const response = await api.post<{ data: Account }>(`/api/Accounts`, data);
  return response.data.data;
};

const updateAccount = async (
  id: string,
  data: Partial<CreateAccountRequest>,
) => {
  const response = await api.put<{ data: Account }>(
    `/api/Accounts/${id}`,
    data,
  );
  return response.data.data;
};

const deleteAccount = async (id: string) => {
  await api.delete(`/api/Accounts/${id}`);
};

export const accountService = {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
};
