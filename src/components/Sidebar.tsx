import React from 'react';
import {
  LayoutDashboard,
  Headphones,
  Users,
  Brain,
  Receipt,
  FileSpreadsheet,
  Building2,
  Database,
  Search,
  Activity,
  Settings,
  Cpu,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export type NavItem =
  | 'dashboard'
  | 'customer_support'
  | 'customers'
  | 'customer_memory'
  | 'accounts_payable'
  | 'invoices'
  | 'vendors'
  | 'vendor_memory'
  | 'memory_explorer'
  | 'ai_activity'
  | 'settings';

interface SidebarProps {
  currentTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
  memoryCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, memoryCount = 8742 }) => {
  const { user, hasAccess } = useAuth();

  const navLinks: Array<{
    id: NavItem;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    roles?: ('admin' | 'support_agent' | 'ap_manager')[];
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'customer_support',
      label: 'Customer Support',
      icon: Headphones,
      badge: 'Agent AI',
      roles: ['admin', 'support_agent'],
    },
    { id: 'customers', label: 'Customers', icon: Users, roles: ['admin', 'support_agent'] },
    { id: 'customer_memory', label: 'Customer Memory', icon: Brain, badge: 'Vector', roles: ['admin', 'support_agent'] },
    {
      id: 'accounts_payable',
      label: 'Accounts Payable',
      icon: Receipt,
      badge: 'Agent AI',
      roles: ['admin', 'ap_manager'],
    },
    { id: 'invoices', label: 'Invoices', icon: FileSpreadsheet, roles: ['admin', 'ap_manager'] },
    { id: 'vendors', label: 'Vendors', icon: Building2, roles: ['admin', 'ap_manager'] },
    { id: 'vendor_memory', label: 'Vendor Memory', icon: Database, badge: 'Rules', roles: ['admin', 'ap_manager'] },
    { id: 'memory_explorer', label: 'Memory Explorer', icon: Search },
    { id: 'ai_activity', label: 'AI Activity', icon: Activity, badge: 'Live' },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] },
  ];

  return (
    <aside className="w-64 bg-[#0a0f1d]/95 backdrop-blur-xl border-r border-slate-800/80 flex flex-col h-screen shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wider bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
              MEMORA AI
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
              Persistent Memory
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navLinks.map((item) => {
          const isActive = currentTab === item.id;
          const isAllowed = item.roles ? hasAccess(item.roles) : true;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              disabled={!isAllowed}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : isAllowed
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  : 'text-slate-600 cursor-not-allowed opacity-50'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <item.icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase tracking-wider ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Status Panel - Required by Prompt */}
      <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2.5 shadow-inner">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold tracking-wider">AI STATUS</span>
          </div>
          <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>ONLINE</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono pt-1.5 border-t border-slate-800/80">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Brain className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold tracking-wider">MEMORY ENGINE</span>
          </div>
          <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
            <span>ACTIVE</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-mono text-right pt-0.5">
          {memoryCount.toLocaleString()} Vectors Loaded
        </div>
      </div>
    </aside>
  );
};
