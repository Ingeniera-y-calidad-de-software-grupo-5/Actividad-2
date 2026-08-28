import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GroupCategory } from '../types';
import { X, Plane, Home, PartyPopper, Check, Users } from 'lucide-react';

export const CreateGroupModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { users, currentUser, createGroup } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GroupCategory>('TRIP');
  const [currency, setCurrency] = useState('USD');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    currentUser ? [currentUser.id] : [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      if (selectedUserIds.length > 1) {
        setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
      }
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await createGroup({
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        currency,
        initialMemberIds: selectedUserIds,
      });
      onClose();
      setName('');
      setDescription('');
    } catch (err) {
      console.error('Error al crear grupo:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 bg-slate-850 shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Crear Nuevo Grupo</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario con Scroll Interno */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Nombre */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Nombre del Grupo *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Viaje a Bariloche 2026, Casa..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Tipo de Grupo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'TRIP', label: 'Viaje', icon: <Plane className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                { type: 'HOUSE', label: 'Casa', icon: <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                { type: 'EVENT', label: 'Evento', icon: <PartyPopper className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
              ].map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setCategory(item.type as GroupCategory)}
                  className={`flex items-center justify-center space-x-1.5 py-2 px-2 sm:px-3 rounded-xl border text-xs font-semibold transition ${
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

          {/* Moneda y Descripción */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="col-span-1">
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Moneda
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 sm:py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="ARS">ARS ($)</option>
                <option value="CLP">CLP ($)</option>
                <option value="MXN">MXN ($)</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Descripción
              </label>
              <input
                type="text"
                placeholder="Notas opcionales"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Participantes */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Participantes ({selectedUserIds.length} seleccionados)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
              {users.map((u) => {
                const isSelected = selectedUserIds.includes(u.id);
                return (
                  <div
                    key={u.id}
                    onClick={() => toggleUser(u.id)}
                    className={`flex items-center space-x-2 p-2 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/60 text-white'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                        isSelected
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <img
                      src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                      alt={u.name}
                      className="w-5 h-5 rounded-full shrink-0"
                    />
                    <span className="text-xs font-medium truncate">{u.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer de Acciones Fijo */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 text-slate-950 font-bold px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm transition shadow-md shadow-emerald-500/20"
            >
              {isSubmitting ? 'Creando...' : 'Crear Grupo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
