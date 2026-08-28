import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, Wallet, RefreshCw, Database, Server, Menu } from 'lucide-react';

export const Navbar: React.FC<{
  onOpenCreateGroup: () => void;
  onGoHome: () => void;
  onToggleMobileSidebar?: () => void;
}> = ({ onOpenCreateGroup, onGoHome, onToggleMobileSidebar }) => {
  const { users, currentUser, setCurrentUser, isBackendConnected, loadInitialData } = useApp();

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-slate-900/95">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Left: Mobile Menu Trigger + Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            {onToggleMobileSidebar && (
              <button
                onClick={onToggleMobileSidebar}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
                aria-label="Abrir menú de grupos"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div
              className="flex items-center space-x-2.5 cursor-pointer min-w-0"
              onClick={onGoHome}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black shrink-0">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base sm:text-xl tracking-tight text-white truncate">
                    Amigo<span className="text-emerald-400">Gasto</span>
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full uppercase shrink-0">
                    SplitWise
                  </span>
                </div>
                <p className="hidden md:block text-[11px] text-slate-400 font-medium truncate">
                  Gestión Inteligente de Gastos Grupales
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            {/* Backend Connection Badge (Desktop) */}
            <div
              className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
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
            <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl p-1 sm:p-1.5 max-w-[140px] sm:max-w-[200px]">
              <div className="text-[11px] text-slate-400 pl-1.5 font-medium hidden xl:inline">
                Ver como:
              </div>
              <div className="relative flex items-center min-w-0">
                <select
                  aria-label="Seleccionar usuario activo"
                  className="bg-transparent text-slate-200 text-xs font-medium rounded-lg pl-1.5 pr-5 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer appearance-none truncate max-w-[90px] sm:max-w-[130px]"
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
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full ml-1 border border-emerald-500/50 shrink-0"
                  />
                )}
              </div>
            </div>

            {/* Botón Refrescar */}
            <button
              onClick={() => loadInitialData()}
              title="Refrescar datos y sincronizar"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Botón Crear Grupo */}
            <button
              onClick={onOpenCreateGroup}
              className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm flex items-center space-x-1 sm:space-x-1.5 transition shadow-sm shadow-emerald-500/20 shrink-0"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Grupo</span>
              <span className="sm:hidden">Grupo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
