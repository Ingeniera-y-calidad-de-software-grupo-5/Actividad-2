export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt?: string;
}

export type GroupCategory = 'TRIP' | 'HOUSE' | 'EVENT' | 'OTHER';

export interface GroupMember {
  id: string;
  user: User;
  role: 'ADMIN' | 'MEMBER';
  joinedAt: string;
}

export type ExpenseCategory = 'FOOD' | 'TRANSPORT' | 'ACCOMMODATION' | 'ENTERTAINMENT' | 'SERVICES' | 'OTHER';
export type SplitType = 'EQUAL' | 'EXACT' | 'PERCENTAGE';

export interface ExpenseSplit {
  id: string;
  user: User;
  amount: number;
  percentage: number;
  isSettled: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  splitType: SplitType;
  expenseDate: string;
  createdAt: string;
  paidBy: User;
  splits: ExpenseSplit[];
}

export interface Settlement {
  id: string;
  payer: User;
  receiver: User;
  amount: number;
  status: 'COMPLETED' | 'PENDING';
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  category: GroupCategory;
  currency: string;
  createdAt: string;
  members: GroupMember[];
  expenses?: Expense[];
  settlements?: Settlement[];
}

export interface UserBalance {
  user: User;
  totalPaid: number;
  totalOwed: number;
  settlementsPaid: number;
  settlementsReceived: number;
  netBalance: number;
}

export interface DebtSuggestion {
  fromUser: User;
  toUser: User;
  amount: number;
}

export interface GroupBalanceSummary {
  groupId: string;
  totalGroupSpending: number;
  memberBalances: UserBalance[];
  suggestedSettlements: DebtSuggestion[];
}
