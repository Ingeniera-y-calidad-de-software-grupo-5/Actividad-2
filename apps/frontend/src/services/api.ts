import axios from 'axios';
import {
  Group,
  User,
  Expense,
  GroupBalanceSummary,
  Settlement,
  GroupCategory,
  SplitType,
  ExpenseCategory,
  ExpenseSplit,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock Data de Respaldo en memoria si el backend estuviera en arranque
let mockUsers: User[] = [
  {
    id: 'u-1',
    name: 'Santiago López',
    email: 'santiago@amigogasto.app',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  },
  {
    id: 'u-2',
    name: 'Martina Rossi',
    email: 'martina@amigogasto.app',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: 'u-3',
    name: 'Lucas Benítez',
    email: 'lucas@amigogasto.app',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
  },
  {
    id: 'u-4',
    name: 'Valentina Gómez',
    email: 'valentina@amigogasto.app',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  },
];

let mockGroups: Group[] = [
  {
    id: 'g-1',
    name: 'Viaje a Bariloche 2026',
    description: 'Cabaña, comidas, pases de esquí y traslados',
    category: 'TRIP' as GroupCategory,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    members: mockUsers.map((u, i) => ({
      id: `gm-${i + 1}`,
      user: u,
      role: i === 0 ? 'ADMIN' : 'MEMBER',
      joinedAt: new Date().toISOString(),
    })),
    expenses: [
      {
        id: 'exp-1',
        description: 'Alquiler Cabaña Cerro Catedral (3 noches)',
        amount: 240,
        category: 'ACCOMMODATION' as ExpenseCategory,
        splitType: 'EQUAL' as SplitType,
        expenseDate: '2026-08-20',
        createdAt: new Date().toISOString(),
        paidBy: mockUsers[0],
        splits: mockUsers.map((u) => ({
          id: `sp-1-${u.id}`,
          user: u,
          amount: 60,
          percentage: 25,
          isSettled: false,
        })),
      },
      {
        id: 'exp-2',
        description: 'Cena de Bienvenida Asado & Vinos',
        amount: 100,
        category: 'FOOD' as ExpenseCategory,
        splitType: 'EQUAL' as SplitType,
        expenseDate: '2026-08-21',
        createdAt: new Date().toISOString(),
        paidBy: mockUsers[1],
        splits: mockUsers.map((u) => ({
          id: `sp-2-${u.id}`,
          user: u,
          amount: 25,
          percentage: 25,
          isSettled: false,
        })),
      },
      {
        id: 'exp-3',
        description: 'Carga de Combustible Ruta 40',
        amount: 60,
        category: 'TRANSPORT' as ExpenseCategory,
        splitType: 'EQUAL' as SplitType,
        expenseDate: '2026-08-22',
        createdAt: new Date().toISOString(),
        paidBy: mockUsers[2],
        splits: [mockUsers[0], mockUsers[1], mockUsers[2]].map((u) => ({
          id: `sp-3-${u.id}`,
          user: u,
          amount: 20,
          percentage: 33.33,
          isSettled: false,
        })),
      },
    ],
    settlements: [],
  },
  {
    id: 'g-2',
    name: 'Departamento Palermo',
    description: 'Convivencia, internet y compras comunitarias',
    category: 'HOUSE' as GroupCategory,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    members: [mockUsers[0], mockUsers[1], mockUsers[3]].map((u, i) => ({
      id: `gm-h-${i + 1}`,
      user: u,
      role: i === 0 ? 'ADMIN' : 'MEMBER',
      joinedAt: new Date().toISOString(),
    })),
    expenses: [
      {
        id: 'exp-h-1',
        description: 'Fibra Óptica 1Gbps + Expensas',
        amount: 90,
        category: 'SERVICES' as ExpenseCategory,
        splitType: 'EQUAL' as SplitType,
        expenseDate: '2026-08-15',
        createdAt: new Date().toISOString(),
        paidBy: mockUsers[3],
        splits: [mockUsers[0], mockUsers[1], mockUsers[3]].map((u) => ({
          id: `sp-h1-${u.id}`,
          user: u,
          amount: 30,
          percentage: 33.33,
          isSettled: false,
        })),
      },
    ],
    settlements: [],
  },
];

export const api = {
  async checkHealth(): Promise<boolean> {
    try {
      await apiClient.get('/users');
      return true;
    } catch {
      return false;
    }
  },

  async seedData(): Promise<any> {
    try {
      const res = await apiClient.post('/seed');
      return res.data;
    } catch {
      return { message: 'Seed local en memoria activo' };
    }
  },

  async getUsers(): Promise<User[]> {
    try {
      const res = await apiClient.get<User[]>('/users');
      if (res.data && res.data.length > 0) return res.data;
      return mockUsers;
    } catch {
      return mockUsers;
    }
  },

  async createUser(data: { name: string; email: string; avatarUrl?: string }): Promise<User> {
    try {
      const res = await apiClient.post<User>('/users', data);
      return res.data;
    } catch {
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
        createdAt: new Date().toISOString(),
      };
      mockUsers.push(newUser);
      return newUser;
    }
  },

  async getGroups(): Promise<Group[]> {
    try {
      const res = await apiClient.get<Group[]>('/groups');
      if (res.data && res.data.length > 0) return res.data;
      return mockGroups;
    } catch {
      return mockGroups;
    }
  },

  async getGroup(id: string): Promise<Group> {
    try {
      const res = await apiClient.get<Group>(`/groups/${id}`);
      return res.data;
    } catch {
      const found = mockGroups.find((g) => g.id === id);
      if (!found) throw new Error('Grupo no encontrado');
      return found;
    }
  },

  async createGroup(data: {
    name: string;
    description?: string;
    category?: GroupCategory;
    currency?: string;
    initialMemberIds?: string[];
  }): Promise<Group> {
    try {
      const res = await apiClient.post<Group>('/groups', data);
      return res.data;
    } catch {
      const memberUsers = mockUsers.filter((u) => (data.initialMemberIds || []).includes(u.id));
      const newGroup: Group = {
        id: `g-${Date.now()}`,
        name: data.name,
        description: data.description,
        category: data.category || 'TRIP',
        currency: data.currency || 'USD',
        createdAt: new Date().toISOString(),
        members: memberUsers.map((u, i) => ({
          id: `gm-${Date.now()}-${i}`,
          user: u,
          role: i === 0 ? 'ADMIN' : 'MEMBER',
          joinedAt: new Date().toISOString(),
        })),
        expenses: [],
        settlements: [],
      };
      mockGroups.unshift(newGroup);
      return newGroup;
    }
  },

  async addMemberToGroup(groupId: string, userId: string): Promise<any> {
    try {
      const res = await apiClient.post(`/groups/${groupId}/members`, { userId });
      return res.data;
    } catch {
      const g = mockGroups.find((grp) => grp.id === groupId);
      const u = mockUsers.find((usr) => usr.id === userId);
      if (g && u) {
        g.members.push({
          id: `gm-${Date.now()}`,
          user: u,
          role: 'MEMBER',
          joinedAt: new Date().toISOString(),
        });
      }
      return { success: true };
    }
  },

  async createExpense(
    groupId: string,
    data: {
      description: string;
      amount: number;
      paidById: string;
      category?: ExpenseCategory;
      splitType?: SplitType;
      expenseDate?: string;
      participantIds?: string[];
    },
  ): Promise<Expense> {
    try {
      const res = await apiClient.post<Expense>(`/groups/${groupId}/expenses`, data);
      return res.data;
    } catch {
      const g = mockGroups.find((grp) => grp.id === groupId);
      const payer = mockUsers.find((u) => u.id === data.paidById) || mockUsers[0];
      const participantIds = data.participantIds && data.participantIds.length > 0
        ? data.participantIds
        : (g?.members.map((m) => m.user.id) || [payer.id]);

      const splitAmount = Math.round((data.amount / participantIds.length) * 100) / 100;
      const splits: ExpenseSplit[] = participantIds.map((pId) => {
        const u = mockUsers.find((usr) => usr.id === pId) || payer;
        return {
          id: `sp-${Date.now()}-${pId}`,
          user: u,
          amount: splitAmount,
          percentage: Number((100 / participantIds.length).toFixed(2)),
          isSettled: false,
        };
      });

      const newExpense: Expense = {
        id: `exp-${Date.now()}`,
        description: data.description,
        amount: data.amount,
        category: data.category || 'FOOD',
        splitType: data.splitType || 'EQUAL',
        expenseDate: data.expenseDate || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        paidBy: payer,
        splits,
      };

      if (g) {
        g.expenses = g.expenses || [];
        g.expenses.unshift(newExpense);
      }
      return newExpense;
    }
  },

  async getGroupBalances(groupId: string): Promise<GroupBalanceSummary> {
    try {
      const res = await apiClient.get<GroupBalanceSummary>(`/groups/${groupId}/balances`);
      return res.data;
    } catch {
      const g = mockGroups.find((grp) => grp.id === groupId);
      if (!g) {
        return {
          groupId,
          totalGroupSpending: 0,
          memberBalances: [],
          suggestedSettlements: [],
        };
      }

      const map = new Map<string, { user: User; paid: number; owed: number; stPaid: number; stRec: number }>();
      for (const m of g.members) {
        map.set(m.user.id, { user: m.user, paid: 0, owed: 0, stPaid: 0, stRec: 0 });
      }

      let total = 0;
      for (const exp of g.expenses || []) {
        total += exp.amount;
        if (map.has(exp.paidBy.id)) {
          map.get(exp.paidBy.id)!.paid += exp.amount;
        }
        for (const sp of exp.splits || []) {
          if (map.has(sp.user.id)) {
            map.get(sp.user.id)!.owed += sp.amount;
          }
        }
      }

      for (const st of g.settlements || []) {
        if (map.has(st.payer.id)) map.get(st.payer.id)!.stPaid += st.amount;
        if (map.has(st.receiver.id)) map.get(st.receiver.id)!.stRec += st.amount;
      }

      const memberBalances = Array.from(map.values()).map((v) => ({
        user: v.user,
        totalPaid: Number(v.paid.toFixed(2)),
        totalOwed: Number(v.owed.toFixed(2)),
        settlementsPaid: Number(v.stPaid.toFixed(2)),
        settlementsReceived: Number(v.stRec.toFixed(2)),
        netBalance: Number((v.paid - v.owed + (v.stPaid - v.stRec)).toFixed(2)),
      }));

      // Min Cash Flow simplificado en memoria
      const netArr = memberBalances.map((b) => ({ user: b.user, balance: b.netBalance }));
      const suggestedSettlements = [];
      while (true) {
        netArr.sort((a, b) => a.balance - b.balance);
        const debtor = netArr[0];
        const creditor = netArr[netArr.length - 1];
        if (!debtor || !creditor || debtor.balance >= -0.01 || creditor.balance <= 0.01) break;
        const transfer = Math.round(Math.min(Math.abs(debtor.balance), creditor.balance) * 100) / 100;
        if (transfer > 0) {
          suggestedSettlements.push({
            fromUser: debtor.user,
            toUser: creditor.user,
            amount: transfer,
          });
          debtor.balance += transfer;
          creditor.balance -= transfer;
        } else {
          break;
        }
      }

      return {
        groupId,
        totalGroupSpending: Number(total.toFixed(2)),
        memberBalances,
        suggestedSettlements,
      };
    }
  },

  async createSettlement(groupId: string, data: { payerId: string; receiverId: string; amount: number }): Promise<Settlement> {
    try {
      const res = await apiClient.post<Settlement>(`/groups/${groupId}/settlements`, data);
      return res.data;
    } catch {
      const g = mockGroups.find((grp) => grp.id === groupId);
      const payer = mockUsers.find((u) => u.id === data.payerId) || mockUsers[0];
      const receiver = mockUsers.find((u) => u.id === data.receiverId) || mockUsers[1];
      const settlement: Settlement = {
        id: `st-${Date.now()}`,
        payer,
        receiver,
        amount: data.amount,
        status: 'COMPLETED',
        createdAt: new Date().toISOString(),
      };
      if (g) {
        g.settlements = g.settlements || [];
        g.settlements.unshift(settlement);
      }
      return settlement;
    }
  },
};
