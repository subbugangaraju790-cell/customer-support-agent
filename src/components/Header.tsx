import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types.ts';
import { ShieldCheck, UserCheck, LogOut, Sparkles, Database, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentTabName: string;
  onOpenQuickDemo?: (scenario: 'support' | 'ap') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTabName, onOpenQuickDemo }) => {
  const { user, switchRole, logout, setIsLoginModalOpen } = useAuth();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = React.useState(false);

  const roles: Array<{ role: UserRole; title: string; color: string }> = [
    { role: 'admin', title: 'Admin (Alex Mercer)', color: 'text-purple-400' },
    { role: 'support_agent', title: 'Support Agent (Jordan Lee)', color: 'text-cyan-400' },
    { role: 'ap_manager', title: 'AP Manager (Michael Hernandez)', color: 'text-amber-400' },
  ];

  return (
    <header className="h-16 bg-[#0a0f1d]/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between z-20">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-bold text-white capitalize tracking-wide flex items-center space-x-2">
          <span>{currentTabName.replace(/_/g, ' ')}</span>
        </h2>
        <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800 font-mono">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>HNSW Cosine Vector Store</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-300 font-semibold">Gemini 3.8 Flash Active</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Quick Test Action Buttons for Reviewers */}
        {onOpenQuickDemo && (
          <div className="hidden lg:flex items-center space-x-2">
            <button
              onClick={() => onOpenQuickDemo('support')}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm"
              title="Test: ERP sync stopped working again (Ticket T-8821 memory recall)"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Simulate Support Memory</span>
            </button>
            <button
              onClick={() => onOpenQuickDemo('ap')}
              className="px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-500/40 text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm"
              title="Test: Apex Industrial repeats SKU-848 price markup (Auto-hold EX-449)"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Simulate AP Anomaly</span>
            </button>
          </div>
        )}

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center space-x-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-[11px] text-white">
              {user?.name.charAt(0) || 'U'}
            </div>
            <div className="text-left">
              <p className="font-semibold leading-tight text-white">{user?.name || 'Guest User'}</p>
              <p className="text-[10px] text-cyan-400 font-mono capitalize">
                {user?.role.replace('_', ' ') || 'Sign in'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Switch Demo User Role
              </div>
              {roles.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    switchRole(r.role);
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                    user?.role === r.role ? 'bg-cyan-500/10 text-cyan-300 font-semibold' : 'text-slate-300'
                  }`}
                >
                  <span className={r.color}>{r.title}</span>
                  {user?.role === r.role && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
              <div className="border-t border-slate-800 mt-1 pt-1">
                <button
                  onClick={() => {
                    setIsRoleDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center space-x-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out / Switch Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
