import React, { useState } from 'react';
import { CustomerProfile } from '../types.ts';
import { Users, Server, ExternalLink, Search, Sparkles, Shield, ChevronRight } from 'lucide-react';
import { NavItem } from './Sidebar.tsx';

interface CustomersListProps {
  customers: CustomerProfile[];
  onSelectCustomer: (customerId: string) => void;
  onNavigate: (tab: NavItem) => void;
}

export const CustomersList: React.FC<CustomersListProps> = ({
  customers,
  onSelectCustomer,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.environment.erpSystem.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Enterprise Customer Directory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Environment blueprints, sentiment metrics, and SLA profiles stored in persistent memory
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers, ERPs, contacts..."
            className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((cust) => (
          <div
            key={cust.id}
            className="rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 p-5 space-y-4 shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-white">{cust.name}</h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {cust.tier}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Contact: <span className="text-slate-200 font-medium">{cust.contactPerson}</span> ({cust.email})
                </p>
              </div>

              <div className="text-right">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    cust.frustrationScore > 50
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  Sentiment: {cust.sentiment} ({cust.frustrationScore}%)
                </span>
              </div>
            </div>

            {/* Environment Blueprint */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-xs">
              <div className="flex items-center space-x-1.5 text-cyan-400 font-mono text-[11px] font-semibold">
                <Server className="w-3.5 h-3.5" />
                <span>ENVIRONMENT BLUEPRINT</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">ERP System:</span>
                  <p className="text-slate-200 font-medium">{cust.environment.erpSystem}</p>
                </div>
                <div>
                  <span className="text-slate-500">Version:</span>
                  <p className="text-slate-200 font-medium">{cust.environment.version}</p>
                </div>
                <div>
                  <span className="text-slate-500">Infrastructure:</span>
                  <p className="text-slate-200 font-medium">{cust.environment.hosting}</p>
                </div>
                <div>
                  <span className="text-slate-500">Connector Gateway:</span>
                  <p className="text-cyan-300 font-mono font-medium">{cust.environment.connectorVersion}</p>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <div className="text-slate-400 font-mono text-[11px]">
                Open Tickets: <span className="text-white font-bold">{cust.openTickets}</span> / Total: {cust.totalTickets}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    onSelectCustomer(cust.id);
                    onNavigate('customer_support');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center space-x-1 transition-all shadow-sm"
                >
                  <span>Open Support Agent</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
