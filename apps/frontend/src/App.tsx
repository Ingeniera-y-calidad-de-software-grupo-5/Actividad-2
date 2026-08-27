import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardSummary } from './components/DashboardSummary';
import { GroupDetail } from './components/GroupDetail';
import { CreateGroupModal } from './components/CreateGroupModal';
import { CreateExpenseModal } from './components/CreateExpenseModal';
import { SettleDebtModal } from './components/SettleDebtModal';
import { DebtSuggestion } from './types';
import { Loader2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { isLoading, selectedGroup, setSelectedGroup, groups } = useApp();

  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isCreateExpenseOpen, setIsCreateExpenseOpen] = useState(false);
  const [settleModalData, setSettleModalData] = useState<{
    isOpen: boolean;
    suggestion: DebtSuggestion | null;
  }>({
    isOpen: false,
    suggestion: null,
  });

  const handleOpenSettleModal = (suggestion: DebtSuggestion) => {
    setSettleModalData({
      isOpen: true,
      suggestion,
    });
  };

  const handleGoHome = () => {
    if (groups.length > 0) {
      setSelectedGroup(groups[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Navbar Superior */}
      <Navbar
        onOpenCreateGroup={() => setIsCreateGroupOpen(true)}
        onGoHome={handleGoHome}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading && !selectedGroup ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
            <p className="text-sm font-medium text-slate-400">
              Conectando con AmigoGasto Backend & MySQL...
            </p>
          </div>
        ) : (
          <>
            {/* Resumen de Métricas Financieras */}
            <DashboardSummary />

            {/* Layout en 2 Columnas (Sidebar de Grupos + Detalle del Grupo) */}
            <div className="flex flex-col md:flex-row gap-6">
              <Sidebar onOpenCreateGroup={() => setIsCreateGroupOpen(true)} />
              <GroupDetail
                onOpenCreateExpense={() => setIsCreateExpenseOpen(true)}
                onOpenSettleModal={handleOpenSettleModal}
              />
            </div>
          </>
        )}
      </main>

      {/* Modales */}
      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
      />

      <CreateExpenseModal
        isOpen={isCreateExpenseOpen}
        onClose={() => setIsCreateExpenseOpen(false)}
      />

      <SettleDebtModal
        isOpen={settleModalData.isOpen}
        suggestion={settleModalData.suggestion}
        onClose={() => setSettleModalData({ isOpen: false, suggestion: null })}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
