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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Tarjeta Balance Neto */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-card relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Tu Balance Neto
          </span>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              netBalance > 0
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : netBalance < 0
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-slate-700/50 text-slate-400'
            }`}
          >
            {netBalance > 0 ? (
              <TrendingUp className="w-5 h-5" />
            ) : netBalance < 0 ? (
              <TrendingDown className="w-5 h-5" />
            ) : (
              <DollarSign className="w-5 h-5" />
            )}
          </div>
        </div>

        <div className="mt-3">
          <div
            className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${
              netBalance > 0
                ? 'text-emerald-400'
                : netBalance < 0
                ? 'text-rose-400'
                : 'text-slate-200'
            }`}
          >
            {netBalance > 0 ? `+${currency} ${netBalance.toFixed(2)}` : `${currency} ${netBalance.toFixed(2)}`}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {netBalance > 0
              ? 'Te deben dinero en este grupo'
              : netBalance < 0
              ? 'Tienes pagos pendientes a saldar'
              : 'Tus cuentas están perfectamente al día'}
          </p>
        </div>

        {/* Barra decorativa */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 ${
            netBalance > 0 ? 'bg-emerald-500' : netBalance < 0 ? 'bg-rose-500' : 'bg-slate-700'
          }`}
        />
      </div>

      {/* Tarjeta Pagado por Ti */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-card relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Pagado por Ti
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            {currency} {totalPaid.toFixed(2)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Gastos que abonaste inicialmente</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
      </div>

      {/* Tarjeta Tu Consumo Real */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-card relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Tu Consumo Real
          </span>
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <PieChart className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            {currency} {totalOwed.toFixed(2)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Porción asignada según splits</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500" />
      </div>

      {/* Tarjeta Total del Grupo */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-card relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Gasto Total del Grupo
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl lg:text-3xl font-extrabold tracking-tight text-amber-400">
            {currency} {(selectedGroupBalances?.totalGroupSpending || 0).toFixed(2)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {selectedGroup?.expenses?.length || 0} gastos registrados
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
      </div>
    </div>
  );
};
