import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, Wallet, RefreshCw, Database, Server } from 'lucide-react';

export const Navbar: React.FC<{ onOpenCreateGroup: () => void; onGoHome: () => void }> = ({
  onOpenCreateGroup,
  onGoHome,
}) => {
  const { users, currentUser, setCurrentUser, isBackendConnected, loadInitialData } = useApp();

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onGoHome}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Amigo<span className="text-emerald-400">Gasto</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full uppercase">
                  SplitWise Collab
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Gestión Inteligente de Gastos Grupales</p>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Backend Connection Badge */}
            <div
              className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isBackendConnected
                  ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-700 text-amber-300'
              }`}
              title={
                isBackendConnected
                  ? 'Conectado a Backend NestJS & MySQL en Docker'
                  : 'Modo Offline / Local Fallback'
              }
            >
              {isBackendConnected ? (
                <>
                  <Database className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>NestJS + MySQL Activo</span>
                </>
              ) : (
                <>
                  <Server className="w-3.5 h-3.5 text-amber-400" />
                  <span>Modo Standalone</span>
                </>
              )}
            </div>

            {/* Selector de Usuario Activo (Perspectiva) */}
            <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700/80 rounded-xl p-1.5">
              <div className="text-xs text-slate-400 pl-2 font-medium hidden sm:inline">
                Perspectiva:
              </div>
              <div className="relative flex items-center">
                <select
                  aria-label="Seleccionar usuario activo"
                  className="bg-transparent text-slate-200 text-xs font-medium rounded-lg px-2 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer appearance-none"
                  value={currentUser?.id || ''}
                  onChange={(e) => {
                    const found = users.find((u) => u.id === e.target.value);
                    if (found) setCurrentUser(found);
                  }}
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id} className="bg-slate-800 text-slate-100">
                      {u.name}
                    </option>
                  ))}
                </select>
                {currentUser?.avatarUrl && (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full ml-1 border border-emerald-500/50"
                  />
                )}
              </div>
            </div>

            {/* Recargar Datos */}
            <button
              onClick={() => loadInitialData()}
              title="Refrescar datos y sincronizar"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Botón Crear Grupo */}
            <button
              onClick={onOpenCreateGroup}
              className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 transition shadow-sm shadow-emerald-500/20"
            >
              <Users className="w-4 h-4" />
              <span>Nuevo Grupo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
