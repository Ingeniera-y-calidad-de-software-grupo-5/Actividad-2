import React from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Sparkles } from 'lucide-react';

export const DashboardSummary: React.FC = () => {
  const { currentUser, selectedGroupBalances, selectedGroup } = useApp();

  const userBalance = selectedGroupBalances?.memberBalances.find(
    (mb) => mb.user.id === currentUser?.id,
  );

  const netBalance = userBalance?.netBalance || 0;
  const totalPaid = userBalance?.totalPaid || 0;
  const totalOwed = userBalance?.totalOwed || 0;
  const currency = selectedGroup?.currency || 'USD';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6">
      {/* Tarjeta Balance Neto */}
      <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-3.5 sm:p-5 shadow-card relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate pr-1">
            Tu Balance
          </span>
          <div
            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${
              netBalance > 0
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : netBalance < 0
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-slate-700/50 text-slate-400'
            }`}
          >
            {netBalance > 0 ? (
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : netBalance < 0 ? (
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </div>
        </div>

        <div className="mt-2 sm:mt-3">
          <div
            className={`text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight truncate ${
              netBalance > 0
                ? 'text-emerald-400'
                : netBalance < 0
                ? 'text-rose-400'
                : 'text-slate-200'
            }`}
          >
            {netBalance > 0 ? `+${currency} ${netBalance.toFixed(2)}` : `${currency} ${netBalance.toFixed(2)}`}
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate hidden xs:block">
            {netBalance > 0
              ? 'Te deben dinero'
              : netBalance < 0
              ? 'Tienes pagos pendientes'
              : 'Al día ($0.00)'}
          </p>
        </div>
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 ${
            netBalance > 0 ? 'bg-emerald-500' : netBalance < 0 ? 'bg-rose-500' : 'bg-slate-700'
          }`}
        />
      </div>

      {/* Tarjeta Pagado por Ti */}
      <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-3.5 sm:p-5 shadow-card relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate pr-1">
            Pagaste
          </span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <div className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white truncate">
            {currency} {totalPaid.toFixed(2)}
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate hidden xs:block">
            Total aportado
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
      </div>

      {/* Tarjeta Tu Consumo Real */}
      <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-3.5 sm:p-5 shadow-card relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate pr-1">
            Consumo
          </span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
            <PieChart className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <div className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white truncate">
            {currency} {totalOwed.toFixed(2)}
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate hidden xs:block">
            Tu parte en splits
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500" />
      </div>

      {/* Tarjeta Total del Grupo */}
      <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-3.5 sm:p-5 shadow-card relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate pr-1">
            Total Grupo
          </span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <div className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-amber-400 truncate">
            {currency} {(selectedGroupBalances?.totalGroupSpending || 0).toFixed(2)}
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate hidden xs:block">
            {selectedGroup?.expenses?.length || 0} gastos
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
      </div>
    </div>
  );
};
