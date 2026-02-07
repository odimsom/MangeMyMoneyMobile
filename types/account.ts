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
