import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExpenseCategory, SplitType } from '../types';
import { X, Receipt, Check, Utensils, Car, Bed, Sparkles, Zap, Box } from 'lucide-react';

const CATEGORY_ITEMS: { type: ExpenseCategory; label: string; icon: React.ReactNode }[] = [
  { type: 'FOOD', label: 'Comida', icon: <Utensils className="w-3.5 h-3.5" /> },
  { type: 'TRANSPORT', label: 'Transporte', icon: <Car className="w-3.5 h-3.5" /> },
  { type: 'ACCOMMODATION', label: 'Hospedaje', icon: <Bed className="w-3.5 h-3.5" /> },
  { type: 'ENTERTAINMENT', label: 'Salidas', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { type: 'SERVICES', label: 'Servicios', icon: <Zap className="w-3.5 h-3.5" /> },
  { type: 'OTHER', label: 'Otro', icon: <Box className="w-3.5 h-3.5" /> },
];

export const CreateExpenseModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { selectedGroup, currentUser, createExpense } = useApp();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('FOOD');
  const [paidById, setPaidById] = useState<string>(currentUser?.id || '');
  const [expenseDate, setExpenseDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const [splitType] = useState<SplitType>('EQUAL');
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializar participantes cuando se abre el modal
  React.useEffect(() => {
    if (selectedGroup) {
      const allIds = selectedGroup.members.map((m) => m.user.id);
      setParticipantIds(allIds);
      if (currentUser && allIds.includes(currentUser.id)) {
        setPaidById(currentUser.id);
      } else if (allIds.length > 0) {
        setPaidById(allIds[0]);
      }
    }
  }, [selectedGroup, currentUser, isOpen]);

  if (!isOpen || !selectedGroup) return null;

  const numAmount = parseFloat(amount) || 0;
  const splitPerPerson =
    participantIds.length > 0 ? (numAmount / participantIds.length).toFixed(2) : '0.00';

  const toggleParticipant = (userId: string) => {
    if (participantIds.includes(userId)) {
      if (participantIds.length > 1) {
        setParticipantIds(participantIds.filter((id) => id !== userId));
      }
    } else {
      setParticipantIds([...participantIds, userId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || numAmount <= 0 || !paidById || participantIds.length === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createExpense(selectedGroup.id, {
        description: description.trim(),
        amount: numAmount,
        paidById,
        category,
        splitType,
        expenseDate,
        participantIds,
      });
      onClose();
      setDescription('');
      setAmount('');
    } catch (err) {
      console.error('Error creando gasto:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Registrar Gasto</h3>
              <p className="text-xs text-slate-400">Grupo: {selectedGroup.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Concepto y Monto */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Descripción / Concepto *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Cena, Cabaña, Supermercado..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Monto ({selectedGroup.currency}) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white font-bold text-emerald-400 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Pagador y Fecha */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                ¿Quién Pagó?
              </label>
              <select
                value={paidById}
                onChange={(e) => setPaidById(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {selectedGroup.members.map((m) => (
                  <option key={m.user.id} value={m.user.id}>
                    {m.user.name} {m.user.id === currentUser?.id ? '(Tú)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Fecha
              </label>
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Categoría
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORY_ITEMS.map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setCategory(item.type)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition ${
                    category === item.type
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* División de Gastos (Splits) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Dividir entre ({participantIds.length} participantes)
              </label>
              {numAmount > 0 && participantIds.length > 0 && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60">
                  {selectedGroup.currency} {splitPerPerson} c/u
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
              {selectedGroup.members.map((m) => {
                const isSelected = participantIds.includes(m.user.id);
                return (
                  <div
                    key={m.user.id}
                    onClick={() => toggleParticipant(m.user.id)}
                    className={`flex items-center space-x-2 p-2 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/60 text-white'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isSelected
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-medium truncate">{m.user.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !description.trim() || numAmount <= 0}
              className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 text-slate-950 font-bold px-5 py-2 rounded-xl text-sm transition shadow-md shadow-emerald-500/20"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Gasto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
