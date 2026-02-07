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
