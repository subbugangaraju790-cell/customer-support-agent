import React, { useState } from 'react';
import { VendorProfile } from '../types.ts';
import { Building2, Search, AlertTriangle, ShieldCheck, ChevronRight, Receipt } from 'lucide-react';
import { NavItem } from './Sidebar.tsx';

interface VendorsListProps {
  vendors: VendorProfile[];
  onSelectVendor: (vendorId: string) => void;
  onNavigate: (tab: NavItem) => void;
}

export const VendorsList: React.FC<VendorsListProps> = ({
  vendors,
  onSelectVendor,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.paymentTerms.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>Enterprise Vendor Directory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Vendor reliability profiles, contractual payment terms, and persistent exception rules
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vendors, categories, terms..."
            className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 w-64"
          />
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((vendor) => (
          <div
            key={vendor.id}
            className="rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 p-5 space-y-4 shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{vendor.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Category: <span className="text-slate-200">{vendor.category}</span>
                </p>
              </div>

              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  vendor.trustScore < 70
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                Trust Score: {vendor.trustScore}/100
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono">
              <div>
                <span className="text-slate-500 text-[10px]">Payment Terms:</span>
                <p className="text-amber-400 font-semibold">{vendor.paymentTerms}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Historical Discrepancy Rate:</span>
                <p className="text-rose-400 font-semibold">{vendor.discrepancyRate}%</p>
              </div>
            </div>

            {/* Typical Discrepancies */}
            <div className="space-y-1.5 text-xs">
              <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider font-semibold">
                Historical Behavior & Patterns:
              </span>
              <div className="space-y-1">
                {vendor.typicalDiscrepancies.map((d, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 flex items-start space-x-2"
                  >
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                Processed Invoices: <span className="text-white font-bold">{vendor.totalInvoices}</span>
              </span>

              <button
                onClick={() => {
                  onSelectVendor(vendor.id);
                  onNavigate('vendor_memory');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center space-x-1 transition-all border border-slate-700"
              >
                <span>View Memory Rules</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
