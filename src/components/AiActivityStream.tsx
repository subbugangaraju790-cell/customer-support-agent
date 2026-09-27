import React, { useState } from 'react';
import { AiActivityItem } from '../types.ts';
import {
  Activity,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Brain,
  Sparkles,
  Bot,
  RefreshCw,
  Search,
} from 'lucide-react';

interface AiActivityStreamProps {
  activities: AiActivityItem[];
  onRefresh: () => void;
}

export const AiActivityStream: React.FC<AiActivityStreamProps> = ({
  activities,
  onRefresh,
}) => {
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = activities.filter((act) => {
    const matchesAgent = agentFilter === 'all' || act.agent === agentFilter;
    const matchesSeverity = severityFilter === 'all' || act.severity === severityFilter;
    const matchesSearch =
      act.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.actionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.targetName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesAgent && matchesSeverity && matchesSearch;
  });

  const getSeverityBadge = (severity: AiActivityItem['severity']) => {
    switch (severity) {
      case 'success':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'warning':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            <h2 className="text-lg font-bold text-white">Autonomous Agent Activity Stream</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold">
              Live Stream
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit log of memory retrievals, anomaly detections, and autonomous business actions
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-all border border-slate-700 self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search activity, entity, action..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
            />
          </div>

          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Agents</option>
            <option value="Customer Support">Customer Support</option>
            <option value="Accounts Payable">Accounts Payable</option>
            <option value="Memory Core">Memory Core</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Severities</option>
            <option value="info">Info / Retrieval</option>
            <option value="success">Success / Resolution</option>
            <option value="warning">Warning / Discrepancy</option>
            <option value="critical">Critical / Hold</option>
          </select>
        </div>

        <span className="text-[11px] font-mono text-slate-500">
          Showing {filtered.length} of {activities.length} Events
        </span>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-2.5">
        {filtered.map((act) => (
          <div
            key={act.id}
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                {act.agent === 'Customer Support' ? (
                  <Bot className="w-4 h-4 text-cyan-400" />
                ) : act.agent === 'Accounts Payable' ? (
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                ) : (
                  <Brain className="w-4 h-4 text-purple-400" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[9px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getSeverityBadge(
                      act.severity,
                    )}`}
                  >
                    {act.actionType}
                  </span>
                  <span className="font-semibold text-white">{act.targetName}</span>
                </div>
                <p className="text-slate-300 leading-snug">{act.summary}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 shrink-0 text-[11px] font-mono text-slate-400 md:text-right">
              <div>
                <span className="text-cyan-400 block font-semibold">{act.agent}</span>
                <span>
                  {new Date(act.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
