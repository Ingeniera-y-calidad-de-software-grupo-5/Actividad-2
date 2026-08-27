import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Group, GroupCategory } from '../types';
import { Plane, Home, PartyPopper, Tag, Plus, ChevronRight } from 'lucide-react';

const CATEGORY_ICONS: Record<GroupCategory, React.ReactNode> = {
  TRIP: <Plane className="w-4 h-4 text-sky-400" />,
  HOUSE: <Home className="w-4 h-4 text-emerald-400" />,
  EVENT: <PartyPopper className="w-4 h-4 text-amber-400" />,
  OTHER: <Tag className="w-4 h-4 text-purple-400" />,
};

const CATEGORY_NAMES: Record<GroupCategory, string> = {
  TRIP: 'Viajes',
  HOUSE: 'Casas Compartidas',
  EVENT: 'Eventos Sociales',
  OTHER: 'Otros Grupos',
};

export const Sidebar: React.FC<{ onOpenCreateGroup: () => void }> = ({ onOpenCreateGroup }) => {
  const { groups, selectedGroup, selectGroupById } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredGroups =
    filterCategory === 'ALL'
      ? groups
      : groups.filter((g) => g.category === filterCategory);

  return (
    <aside className="w-full md:w-80 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col h-full backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white">Tus Grupos</h2>
          <p className="text-xs text-slate-400">Selecciona o crea un grupo</p>
        </div>
        <button
          onClick={onOpenCreateGroup}
          className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition"
          title="Crear Nuevo Grupo"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Categorías Filter Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
        <button
          onClick={() => setFilterCategory('ALL')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
            filterCategory === 'ALL'
              ? 'bg-slate-700 text-white'
              : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          Todos ({groups.length})
        </button>
        {(['TRIP', 'HOUSE', 'EVENT'] as GroupCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap flex items-center space-x-1 transition ${
              filterCategory === cat
                ? 'bg-slate-700 text-white'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{CATEGORY_NAMES[cat]}</span>
          </button>
        ))}
      </div>

      {/* Lista de Grupos */}
      <div className="space-y-2 overflow-y-auto flex-1 pr-1">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No hay grupos en esta categoría
          </div>
        ) : (
          filteredGroups.map((group: Group) => {
            const isSelected = selectedGroup?.id === group.id;
            return (
              <div
                key={group.id}
                onClick={() => selectGroupById(group.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-500/60 shadow-sm shadow-emerald-500/10'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-500/20' : 'bg-slate-700/60'
                    }`}
                  >
                    {CATEGORY_ICONS[group.category] || CATEGORY_ICONS.OTHER}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-emerald-400 transition">
                      {group.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{group.members?.length || 0} miembros</span>
                      <span>•</span>
                      <span>{group.currency}</span>
                    </div>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition ${
                    isSelected
                      ? 'text-emerald-400 translate-x-0.5'
                      : 'text-slate-600 group-hover:text-slate-400'
                  }`}
                />
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
