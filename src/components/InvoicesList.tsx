import React, { useState } from 'react';
import { InvoiceRecord } from '../types.ts';
import {
  FileSpreadsheet,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Eye,
  DollarSign,
} from 'lucide-react';
import { NavItem } from './Sidebar.tsx';

interface InvoicesListProps {
  invoices: InvoiceRecord[];
  onSelectInvoice: (invoiceId: string) => void;
  onNavigate: (tab: NavItem) => void;
}

export const InvoicesList: React.FC<InvoicesListProps> = ({
  invoices,
  onSelectInvoice,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.poNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: InvoiceRecord['status']) => {
    switch (status) {
      case 'On Hold':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Approved':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Flagged':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            <span>Accounts Payable Invoice Ledger</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit queue cross-referenced against historical vendor memory and PO agreements
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search invoice #, vendor, PO..."
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="On Hold">On Hold (Discrepancy)</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* Invoice Ledger Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
            <tr>
              <th className="p-4">Invoice #</th>
              <th className="p-4">Vendor & Category</th>
              <th className="p-4">PO Reference</th>
              <th className="p-4">Due Date</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4">Audit Status</th>
              <th className="p-4">Memory Finding</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
            {filtered.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                <td className="p-4">
                  <div className="font-semibold text-slate-200">{inv.vendorName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Terms: {inv.paymentTerms}</div>
                </td>
                <td className="p-4 font-mono text-cyan-400 font-semibold">{inv.poNumber}</td>
                <td className="p-4 font-mono text-slate-400">{inv.dueDate}</td>
                <td className="p-4 text-right font-mono font-bold text-white text-sm">
                  ${inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                      inv.status,
                    )}`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="p-4 max-w-xs">
                  {inv.detectedAnomalies.length > 0 ? (
                    <div className="text-[11px] text-amber-300 truncate font-medium">
                      ⚠️ {inv.detectedAnomalies[0]}
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>PO line items verified</span>
                    </div>
                  )}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      onSelectInvoice(inv.id);
                      onNavigate('accounts_payable');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center space-x-1 transition-all border border-slate-700"
                  >
                    <span>Audit</span>
                    <ArrowRight className="w-3 h-3 text-amber-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
