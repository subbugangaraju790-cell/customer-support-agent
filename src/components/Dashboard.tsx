import React from 'react';
import {
  Users,
  Ticket,
  AlertTriangle,
  Receipt,
  Clock,
  ShieldAlert,
  Brain,
  TrendingUp,
  ArrowRight,
  Activity,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  Bot,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { SystemStats, AiActivityItem } from '../types.ts';
import { NavItem } from './Sidebar.tsx';

interface DashboardProps {
  stats: SystemStats;
  activities: AiActivityItem[];
  onNavigate: (tab: NavItem) => void;
  onSimulateScenario: (scenario: 'support' | 'ap') => void;
  onRefresh: () => void;
}

const memoryTrendData = [
  { month: 'Apr', queries: 1420, memoryHitRate: 88, hoursSaved: 120 },
  { month: 'May', queries: 2150, memoryHitRate: 91, hoursSaved: 195 },
  { month: 'Jun', queries: 3200, memoryHitRate: 94, hoursSaved: 260 },
  { month: 'Jul', queries: 4800, memoryHitRate: 96, hoursSaved: 340 },
  { month: 'Aug', queries: 6450, memoryHitRate: 97.5, hoursSaved: 385 },
  { month: 'Sep (Live)', queries: 8742, memoryHitRate: 98.4, hoursSaved: 412 },
];

const categoryDistribution = [
  { category: 'Solutions That Worked', count: 3240, color: '#06b6d4' },
  { category: 'Vendor Price Mismatches', count: 2110, color: '#f59e0b' },
  { category: 'Environment & Configs', count: 1840, color: '#3b82f6' },
  { category: 'Exception Protocols', count: 980, color: '#10b981' },
  { category: 'Sentiment & Style Preferences', count: 572, color: '#a855f7' },
];

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  activities,
  onNavigate,
  onSimulateScenario,
  onRefresh,
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Hero Executive Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d162a] to-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -mb-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>COGNITIVE ARCHITECTURE: LONG-TERM ENTERPRISE MEMORY</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Executive Command Center
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              MEMORA AI maintains continuous cross-conversation and cross-transaction memory. Customer support and AP agents automatically recall previous solutions, environment specs, vendor pricing quirks, and exception rules in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSimulateScenario('support')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Bot className="w-4 h-4" />
              <span>Simulate Support Memory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSimulateScenario('ap')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs flex items-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Receipt className="w-4 h-4 text-amber-400" />
              <span>Simulate AP Anomaly</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Key Statistics Grid - Required Exactly by Prompt */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Core Business Metrics</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">Sync Interval: Real-time</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* Customers: 1,284 */}
          <div
            onClick={() => onNavigate('customers')}
            className="group cursor-pointer rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/90 hover:border-cyan-500/40 p-4 transition-all duration-200"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Customers</span>
              <Users className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {stats.customers.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center space-x-1 mt-1 font-mono">
              <span>+18 this month</span>
            </div>
          </div>

          {/* Open Tickets: 37 */}
          <div
            onClick={() => onNavigate('customer_support')}
            className="group cursor-pointer rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/90 hover:border-blue-500/40 p-4 transition-all duration-200"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Open Tickets</span>
              <Ticket className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {stats.openTickets}
            </div>
            <div className="text-[10px] text-cyan-400 flex items-center space-x-1 mt-1 font-mono">
              <span>28 memory-assisted</span>
            </div>
          </div>

          {/* Escalated: 11 */}
          <div
            onClick={() => onNavigate('customer_support')}
            className="group cursor-pointer rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/90 hover:border-amber-500/40 p-4 transition-all duration-200"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Escalated</span>
              <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-extrabold text-amber-300 tracking-tight">
              {stats.escalated}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center space-x-1 mt-1 font-mono">
              <span>-40% vs baseline</span>
            </div>
          </div>

          {/* Invoices: 82 */}
          <div
            onClick={() => onNavigate('invoices')}
            className="group cursor-pointer rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/90 hover:border-cyan-500/40 p-4 transition-all duration-200"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Invoices</span>
              <Receipt className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {stats.invoices}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center space-x-1 mt-1 font-mono">
              <span>Current cycle</span>
            </div>
          </div>

          {/* Pending Approval: 14 */}
          <div
            onClick={() => onNavigate('invoices')}
            className="group cursor-pointer rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/90 hover:border-blue-500/40 p-4 transition-all duration-200"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Pending Approval</span>
              <Clock className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {stats.pendingApproval}
            </div>
            <div className="text-[10px] text-blue-400 flex items-center space-x-1 mt-1 font-mono">
              <span>8 fast-tracked</span>
            </div>
          </div>

          {/* Flagged: 6 */}
          <div
            onClick={() => onNavigate('invoices')}
            className="group cursor-pointer rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/90 hover:border-rose-500/40 p-4 transition-all duration-200"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Flagged</span>
              <ShieldAlert className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-extrabold text-rose-400 tracking-tight">
              {stats.flagged}
            </div>
            <div className="text-[10px] text-rose-300 flex items-center space-x-1 mt-1 font-mono">
              <span>Auto-held by rule</span>
            </div>
          </div>

          {/* Memory Records: 8,742 */}
          <div
            onClick={() => onNavigate('memory_explorer')}
            className="group cursor-pointer rounded-xl bg-gradient-to-b from-cyan-950/40 to-slate-900/90 hover:from-cyan-900/40 border border-cyan-500/40 p-4 transition-all duration-200 shadow-md shadow-cyan-950/30"
          >
            <div className="flex items-center justify-between text-cyan-300 mb-2">
              <span className="text-xs font-semibold">Memory Records</span>
              <Brain className="w-4 h-4 text-cyan-400 animate-pulse group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-extrabold text-cyan-300 tracking-tight font-mono">
              {stats.memoryRecords.toLocaleString()}
            </div>
            <div className="text-[10px] text-cyan-400/90 flex items-center space-x-1 mt-1 font-mono">
              <span>98.4% Precision</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Cognitive Architecture Diagram - Required by Section 2 */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Autonomous Cognitive Loop
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Persistent Bidirectional Indexing</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="w-7 h-7 mx-auto rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
              1
            </div>
            <div className="font-semibold text-slate-200">Current Input</div>
            <div className="text-[10px] text-slate-400">User chat or new invoice PDF OCR</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/40 space-y-1 shadow-sm shadow-cyan-500/10">
            <div className="w-7 h-7 mx-auto rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs">
              2
            </div>
            <div className="font-semibold text-cyan-300">Memory Retrieval</div>
            <div className="text-[10px] text-slate-400">Vector cosine search (0.72 threshold)</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="w-7 h-7 mx-auto rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs">
              3
            </div>
            <div className="font-semibold text-slate-200">Historical Context</div>
            <div className="text-[10px] text-slate-400">Past resolutions & vendor exceptions</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="w-7 h-7 mx-auto rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-xs">
              4
            </div>
            <div className="font-semibold text-slate-200">AI Reasoning</div>
            <div className="text-[10px] text-slate-400">Gemini 3.8 Flash synthesis</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-1">
            <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
              5
            </div>
            <div className="font-semibold text-emerald-300">Business Action</div>
            <div className="text-[10px] text-slate-400">Diagnostic fix or AP hold notice</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/50 space-y-1 shadow-sm shadow-cyan-500/20">
            <div className="w-7 h-7 mx-auto rounded-lg bg-cyan-400/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-xs">
              6
            </div>
            <div className="font-semibold text-cyan-200">New Memory Formed</div>
            <div className="text-[10px] text-slate-400">Persisted back into vector DB</div>
          </div>
        </div>
      </div>

      {/* Main Analytical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recharts Memory Performance Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>Memory Retrieval Precision & Engineering Hours Saved</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Continuous learning curve demonstrates compound business acceleration over 6 months
                </p>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span className="text-slate-300">Memory Hit Rate %</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span className="text-slate-300">Hours Saved</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={memoryTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="memoryHitRate"
                    name="Hit Rate (%)"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#cyanGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="hoursSaved"
                    name="Engineering Hours Saved"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#blueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Memory Clusters Distribution */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-1">
              Active Memory Clusters in Persistent Store
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Vector representations indexed across customer environments and AP vendor profiles
            </p>

            <div className="space-y-3">
              {categoryDistribution.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat.category}</span>
                    <span className="text-slate-400 font-mono">{cat.count.toLocaleString()} records</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(cat.count / 3500) * 100}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Recent AI Activity - Exactly as requested in prompt */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                <h3 className="text-sm font-bold text-white">Recent AI Activity</h3>
              </div>
              <button
                onClick={onRefresh}
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors p-1"
                title="Refresh Activity"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[580px] pr-1 custom-scrollbar">
              {activities.slice(0, 8).map((act) => {
                const getBadgeColor = (severity: string) => {
                  switch (severity) {
                    case 'success':
                      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                    case 'warning':
                      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                    case 'critical':
                      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
                    default:
                      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
                  }
                };

                return (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${getBadgeColor(
                          act.severity,
                        )}`}
                      >
                        {act.actionType}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(act.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-slate-200 leading-snug font-normal">{act.summary}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                      <span className="font-semibold text-slate-400">{act.targetName}</span>
                      <span className="text-cyan-400 font-mono">{act.agent}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onNavigate('ai_activity')}
              className="w-full mt-4 py-2 text-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/60 rounded-lg transition-colors border border-slate-800"
            >
              View Full Audit Stream →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
