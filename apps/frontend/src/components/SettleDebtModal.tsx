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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">Registrar Pago / Liquidar</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transfer Visual */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between">
            {/* Payer (Deudor) */}
            <div className="flex flex-col items-center text-center space-y-1.5 flex-1">
              <img
                src={
                  suggestion.fromUser.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${suggestion.fromUser.name}`
                }
                alt={suggestion.fromUser.name}
                className="w-12 h-12 rounded-full border-2 border-rose-500/60"
              />
              <span className="text-xs font-bold text-white truncate max-w-[100px]">
                {suggestion.fromUser.name}
              </span>
              <span className="text-[10px] text-rose-400 font-semibold bg-rose-950/60 px-1.5 py-0.5 rounded">
                Paga
              </span>
            </div>

            {/* Arrow & Amount */}
            <div className="flex flex-col items-center px-3">
              <span className="text-xs font-black text-emerald-400 mb-1">
                {selectedGroup.currency} {parseFloat(amount || '0').toFixed(2)}
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Receiver (Acreedor) */}
            <div className="flex flex-col items-center text-center space-y-1.5 flex-1">
              <img
                src={
                  suggestion.toUser.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${suggestion.toUser.name}`
                }
                alt={suggestion.toUser.name}
                className="w-12 h-12 rounded-full border-2 border-emerald-500/60"
              />
              <span className="text-xs font-bold text-white truncate max-w-[100px]">
                {suggestion.toUser.name}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded">
                Recibe
              </span>
            </div>
          </div>

          {/* Input Monto */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Monto a Transferir ({selectedGroup.currency})
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-base font-bold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <p className="text-xs text-slate-400">
            Al registrar este pago, el balance de {suggestion.fromUser.name} y {suggestion.toUser.name} quedará saldado en el grupo.
          </p>

          {/* Botones */}
          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
              className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 text-slate-950 font-bold px-5 py-2 rounded-xl text-sm transition shadow-md shadow-emerald-500/20"
            >
              {isSubmitting ? 'Procesando...' : 'Confirmar Liquidación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
