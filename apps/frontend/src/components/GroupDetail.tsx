import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DebtSuggestion, Expense, ExpenseCategory } from '../types';
import {
  Plus,
  Receipt,
  Scale,
  Users,
  Calendar,
  Utensils,
  Car,
  Bed,
  Sparkles,
  Zap,
  Box,
  CheckCircle,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

const CATEGORY_ICONS: Record<ExpenseCategory, React.ReactNode> = {
  FOOD: <Utensils className="w-4 h-4 text-amber-400" />,
  TRANSPORT: <Car className="w-4 h-4 text-blue-400" />,
  ACCOMMODATION: <Bed className="w-4 h-4 text-purple-400" />,
  ENTERTAINMENT: <Sparkles className="w-4 h-4 text-pink-400" />,
  SERVICES: <Zap className="w-4 h-4 text-yellow-400" />,
  OTHER: <Box className="w-4 h-4 text-slate-400" />,
};

export const GroupDetail: React.FC<{
  onOpenCreateExpense: () => void;
  onOpenSettleModal: (suggestion: DebtSuggestion) => void;
}> = ({ onOpenCreateExpense, onOpenSettleModal }) => {
  const { selectedGroup, selectedGroupBalances } = useApp();
  const [activeTab, setActiveTab] = useState<'EXPENSES' | 'BALANCES' | 'MEMBERS'>('EXPENSES');

  if (!selectedGroup) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
        Selecciona un grupo para ver sus detalles
      </div>
    );
  }

  const currency = selectedGroup.currency || 'USD';

  return (
    <div className="flex-1 flex flex-col space-y-6">
      {/* Header del Grupo */}
      <div className="bg-slate-850 border border-slate-800 rounded-3xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {selectedGroup.name}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30">
              {selectedGroup.category}
            </span>
          </div>
          {selectedGroup.description && (
            <p className="text-sm text-slate-400 mt-1">{selectedGroup.description}</p>
          )}
          <div className="flex items-center space-x-4 text-xs text-slate-400 mt-3">
            <span className="flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>{selectedGroup.members.length} participantes</span>
            </span>
            <span>•</span>
            <span>Moneda: {currency}</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">
              Gasto Acumulado: {currency} {(selectedGroupBalances?.totalGroupSpending || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Botón Acción Principal */}
        <button
          onClick={onOpenCreateExpense}
          className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold px-5 py-3 rounded-2xl text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Registrar Gasto</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('EXPENSES')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
            activeTab === 'EXPENSES'
              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Gastos ({selectedGroup.expenses?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('BALANCES')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
            activeTab === 'BALANCES'
              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Balances & Liquidación</span>
          {selectedGroupBalances?.suggestedSettlements &&
            selectedGroupBalances.suggestedSettlements.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
            )}
        </button>

        <button
          onClick={() => setActiveTab('MEMBERS')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
            activeTab === 'MEMBERS'
              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Miembros ({selectedGroup.members.length})</span>
        </button>
      </div>

      {/* TAB 1: LISTADO DE GASTOS */}
      {activeTab === 'EXPENSES' && (
        <div className="space-y-3">
          {(!selectedGroup.expenses || selectedGroup.expenses.length === 0) ? (
            <div className="text-center py-16 bg-slate-850 border border-slate-800 rounded-3xl p-6">
              <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No hay gastos registrados</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                Comienza registrando compras comunitarias, reservas o consumos compartidos.
              </p>
              <button
                onClick={onOpenCreateExpense}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Añadir Primer Gasto
              </button>
            </div>
          ) : (
            selectedGroup.expenses.map((expense: Expense) => (
              <div
                key={expense.id}
                className="bg-slate-850 border border-slate-800/80 hover:border-slate-700/90 rounded-2xl p-4 transition shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {CATEGORY_ICONS[expense.category] || CATEGORY_ICONS.OTHER}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{expense.description}</h4>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 mt-1">
                      <span className="font-medium text-slate-300">
                        Pagó <span className="text-emerald-400 font-semibold">{expense.paidBy.name}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{expense.expenseDate || 'Reciente'}</span>
                      </span>
                      <span>•</span>
                      <span className="text-slate-400">
                        Dividido entre {expense.splits?.length || 0} amigos
                      </span>
                    </div>

                    {/* Mini avatares de participantes en el split */}
                    {expense.splits && expense.splits.length > 0 && (
                      <div className="flex items-center space-x-1 mt-2">
                        <span className="text-[10px] text-slate-500 mr-1">Participan:</span>
                        {expense.splits.map((sp) => (
                          <span
                            key={sp.id}
                            title={`${sp.user.name}: ${currency} ${sp.amount}`}
                            className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 font-medium"
                          >
                            {sp.user.name.split(' ')[0]} ({currency} {Number(sp.amount).toFixed(2)})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right sm:shrink-0">
                  <div className="text-lg font-extrabold text-white">
                    {currency} {Number(expense.amount).toFixed(2)}
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    {expense.splitType === 'EQUAL' ? 'División Equitativa' : 'División Personalizada'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: BALANCES & LIQUIDACIONES (MIN CASH FLOW) */}
      {activeTab === 'BALANCES' && (
        <div className="space-y-6">
          {/* SECCIÓN 1: SUGERENCIAS DE LIQUIDACIÓN ÓPTIMA (MIN CASH FLOW) */}
          <div className="bg-gradient-to-br from-slate-850 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Liquidación Óptima de Deudas
                  </h3>
                  <p className="text-xs text-slate-400">
                    Calculado con el algoritmo <span className="text-emerald-400 font-semibold">Min Cash Flow</span> (menor número de transferencias)
                  </p>
                </div>
              </div>
            </div>

            {(!selectedGroupBalances?.suggestedSettlements ||
              selectedGroupBalances.suggestedSettlements.length === 0) ? (
              <div className="text-center py-8 bg-slate-900/50 rounded-2xl border border-slate-800">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white">¡Todas las cuentas están al día!</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  No hay deudas pendientes por saldar en este grupo.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedGroupBalances.suggestedSettlements.map((sug, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <img
                        src={
                          sug.fromUser.avatarUrl ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${sug.fromUser.name}`
                        }
                        alt={sug.fromUser.name}
                        className="w-8 h-8 rounded-full border border-rose-500/50 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs text-slate-300 truncate">
                          <span className="font-bold text-rose-300">{sug.fromUser.name}</span> le paga a
                        </div>
                        <div className="text-xs font-bold text-emerald-400 truncate">
                          {sug.toUser.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-sm font-extrabold text-white">
                        {currency} {sug.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => onOpenSettleModal(sug)}
                        className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 transition shadow-sm"
                      >
                        <span>Liquidar</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECCIÓN 2: BALANCES INDIVIDUALES */}
          <div className="bg-slate-850 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-base font-bold text-white mb-4">Estado de Balances por Miembro</h3>
            <div className="space-y-3">
              {selectedGroupBalances?.memberBalances.map((mb) => {
                const isPositive = mb.netBalance > 0.005;
                const isNegative = mb.netBalance < -0.005;

                return (
                  <div
                    key={mb.user.id}
                    className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          mb.user.avatarUrl ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${mb.user.name}`
                        }
                        alt={mb.user.name}
                        className="w-10 h-10 rounded-full border border-slate-600"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">{mb.user.name}</h4>
                        <div className="text-xs text-slate-400 flex items-center space-x-3 mt-0.5">
                          <span>Pagó: {currency} {mb.totalPaid.toFixed(2)}</span>
                          <span>•</span>
                          <span>Consumió: {currency} {mb.totalOwed.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-base font-extrabold ${
                          isPositive
                            ? 'text-emerald-400'
                            : isNegative
                            ? 'text-rose-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {isPositive
                          ? `+${currency} ${mb.netBalance.toFixed(2)}`
                          : isNegative
                          ? `${currency} ${mb.netBalance.toFixed(2)}`
                          : `${currency} 0.00`}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {isPositive
                          ? 'Le deben al miembro'
                          : isNegative
                          ? 'Debe abonar al grupo'
                          : 'Al día (saldo $0)'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MIEMBROS */}
      {activeTab === 'MEMBERS' && (
        <div className="bg-slate-850 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Participantes del Grupo</h3>
            <span className="text-xs text-slate-400">
              {selectedGroup.members.length} miembros activos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedGroup.members.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-2xl bg-slate-850 border border-slate-700/60 flex items-center space-x-3"
              >
                <img
                  src={
                    member.user.avatarUrl ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user.name}`
                  }
                  alt={member.user.name}
                  className="w-12 h-12 rounded-full border border-emerald-500/30"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-white truncate">{member.user.name}</h4>
                    {member.role === 'ADMIN' && (
                      <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{member.user.email}</p>
                  <div className="flex items-center space-x-1 text-[11px] text-slate-500 mt-1">
                    <UserCheck className="w-3 h-3 text-emerald-400" />
                    <span>Miembro activo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
