import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DebtSuggestion } from '../types';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';

export const SettleDebtModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  suggestion: DebtSuggestion | null;
}> = ({ isOpen, onClose, suggestion }) => {
  const { selectedGroup, settleDebt } = useApp();
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (suggestion) {
      setAmount(suggestion.amount.toString());
    }
  }, [suggestion, isOpen]);

  if (!isOpen || !selectedGroup || !suggestion) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setIsSubmitting(true);
    try {
      await settleDebt(selectedGroup.id, {
        payerId: suggestion.fromUser.id,
        receiverId: suggestion.toUser.id,
        amount: numAmount,
      });
      onClose();
    } catch (err) {
      console.error('Error registrando pago de liquidación:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 bg-slate-850 shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Registrar Pago / Liquidar</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transfer Visual & Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            {/* Payer */}
            <div className="flex flex-col items-center text-center space-y-1 flex-1">
              <img
                src={
                  suggestion.fromUser.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${suggestion.fromUser.name}`
                }
                alt={suggestion.fromUser.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-rose-500/60 shrink-0"
              />
              <span className="text-[11px] sm:text-xs font-bold text-white truncate max-w-[80px] sm:max-w-[100px]">
                {suggestion.fromUser.name}
              </span>
              <span className="text-[9px] sm:text-[10px] text-rose-400 font-semibold bg-rose-950/60 px-1.5 py-0.5 rounded">
                Paga
              </span>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center px-2 shrink-0">
              <span className="text-[11px] sm:text-xs font-black text-emerald-400 mb-1">
                {selectedGroup.currency} {parseFloat(amount || '0').toFixed(2)}
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            {/* Receiver */}
            <div className="flex flex-col items-center text-center space-y-1 flex-1">
              <img
                src={
                  suggestion.toUser.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${suggestion.toUser.name}`
                }
                alt={suggestion.toUser.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-emerald-500/60 shrink-0"
              />
              <span className="text-[11px] sm:text-xs font-bold text-white truncate max-w-[80px] sm:max-w-[100px]">
                {suggestion.toUser.name}
              </span>
              <span className="text-[9px] sm:text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded">
                Recibe
              </span>
            </div>
          </div>

          {/* Input Monto */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Monto a Transferir ({selectedGroup.currency})
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 sm:py-2.5 text-sm sm:text-base font-bold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <p className="text-[11px] sm:text-xs text-slate-400">
            Al registrar este pago, el balance entre {suggestion.fromUser.name} y {suggestion.toUser.name} se actualizará inmediatamente.
          </p>

          {/* Botones */}
          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
              className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 text-slate-950 font-bold px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm transition shadow-md shadow-emerald-500/20"
            >
              {isSubmitting ? 'Procesando...' : 'Confirmar Liquidación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
