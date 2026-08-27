import React, { createContext, useContext, useState, useEffect } from 'react';
import { Group, User, GroupBalanceSummary } from '../types';
import { api } from '../services/api';

interface AppContextType {
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  groups: Group[];
  selectedGroup: Group | null;
  setSelectedGroup: (group: Group | null) => void;
  selectedGroupBalances: GroupBalanceSummary | null;
  isLoading: boolean;
  isBackendConnected: boolean;
  loadInitialData: () => Promise<void>;
  selectGroupById: (id: string) => Promise<void>;
  refreshBalances: (groupId: string) => Promise<void>;
  createGroup: (data: { name: string; description?: string; category?: any; currency?: string; initialMemberIds?: string[] }) => Promise<Group>;
  createExpense: (groupId: string, data: any) => Promise<void>;
  settleDebt: (groupId: string, data: { payerId: string; receiverId: string; amount: number }) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedGroupBalances, setSelectedGroupBalances] = useState<GroupBalanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const isHealthy = await api.checkHealth();
      setIsBackendConnected(isHealthy);

      if (isHealthy) {
        // Intentar seed inicial
        try {
          await api.seedData();
        } catch {
          // Si ya existe, continuar
        }
      }

      const [usersData, groupsData] = await Promise.all([
        api.getUsers(),
        api.getGroups(),
      ]);

      setUsers(usersData);
      if (usersData.length > 0 && !currentUser) {
        setCurrentUser(usersData[0]);
      }

      setGroups(groupsData);
      if (groupsData.length > 0 && !selectedGroup) {
        setSelectedGroup(groupsData[0]);
        const balances = await api.getGroupBalances(groupsData[0].id);
        setSelectedGroupBalances(balances);
      }
    } catch (err) {
      console.error('Error cargando datos iniciales:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectGroupById = async (id: string) => {
    try {
      setIsLoading(true);
      const group = await api.getGroup(id);
      setSelectedGroup(group);
      const balances = await api.getGroupBalances(id);
      setSelectedGroupBalances(balances);
    } catch (err) {
      console.error('Error al seleccionar grupo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalances = async (groupId: string) => {
    try {
      const [updatedGroup, balances] = await Promise.all([
        api.getGroup(groupId),
        api.getGroupBalances(groupId),
      ]);
      setSelectedGroup(updatedGroup);
      setSelectedGroupBalances(balances);

      // Actualizar listado de grupos
      const allGroups = await api.getGroups();
      setGroups(allGroups);
    } catch (err) {
      console.error('Error refrescando balances:', err);
    }
  };

  const createGroup = async (data: any) => {
    const newGroup = await api.createGroup(data);
    const updatedGroups = await api.getGroups();
    setGroups(updatedGroups);
    await selectGroupById(newGroup.id);
    return newGroup;
  };

  const createExpense = async (groupId: string, data: any) => {
    await api.createExpense(groupId, data);
    await refreshBalances(groupId);
  };

  const settleDebt = async (groupId: string, data: any) => {
    await api.createSettlement(groupId, data);
    await refreshBalances(groupId);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        setCurrentUser,
        groups,
        selectedGroup,
        setSelectedGroup,
        selectedGroupBalances,
        isLoading,
        isBackendConnected,
        loadInitialData,
        selectGroupById,
        refreshBalances,
        createGroup,
        createExpense,
        settleDebt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};
