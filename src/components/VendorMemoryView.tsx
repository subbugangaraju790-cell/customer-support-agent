import React, { useState } from 'react';
import { MemoryRecord, VendorProfile } from '../types.ts';
import { api } from '../services/api.ts';
import {
  Database,
  Search,
  Plus,
  Trash2,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Building2,
} from 'lucide-react';

interface VendorMemoryViewProps {
  memories: MemoryRecord[];
  vendors: VendorProfile[];
  onRefreshMemories: () => void;
}

export const VendorMemoryView: React.FC<VendorMemoryViewProps> = ({
  memories,
  vendors,
  onRefreshMemories,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [vendorFilter, setVendorFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Memory Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newVendor, setNewVendor] = useState(vendors[0]?.id || 'vend-apex');
  const [newCategory, setNewCategory] = useState<MemoryRecord['category']>('common_discrepancy');
  const [newImportance, setNewImportance] = useState<MemoryRecord['importance']>('critical');
  const [newKeywords, setNewKeywords] = useState('');

  const vendorMemoriesOnly = memories.filter((m) => m.targetType === 'vendor');

  const filtered = vendorMemoriesOnly.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    const matchesVendor = vendorFilter === 'all' || m.targetId === vendorFilter;

    return matchesSearch && matchesCategory && matchesVendor;
  });

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const targetVen = vendors.find((v) => v.id === newVendor);

    try {
      await api.createMemory({
        targetType: 'vendor',
        targetId: newVendor,
        targetName: targetVen?.name || 'Apex Industrial Supplies',
        category: newCategory,
        title: newTitle,
        content: newContent,
        importance: newImportance,
        keywords: newKeywords.split(',').map((k) => k.trim()).filter(Boolean),
        confidence: 0.99,
      });

      setIsAddModalOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewKeywords('');
      onRefreshMemories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this vendor memory rule?')) {
      try {
        await api.deleteMemory(id);
        onRefreshMemories();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const categories = [
    { id: 'all', label: 'All Memory Categories' },
    { id: 'common_discrepancy', label: 'Common Discrepancies' },
    { id: 'historical_exception', label: 'Historical Exception Protocols' },
    { id: 'approval_decision', label: 'Approval Decisions' },
    { id: 'vendor_terms', label: 'Payment Terms Rules' },
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Vendor Memory Repository</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
              {filtered.length} Rules Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical pricing discrepancies, exception protocols, and credit memo resolutions
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-all shadow-md shadow-amber-500/20 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vendor Rule</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vendor rules, SKUs, protocols..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Vendors</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-[11px] font-mono text-slate-500">
          Enforcement: <span className="text-amber-400">Autonomous Hold & Pre-approval</span>
        </div>
      </div>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((mem) => {
          const getCategoryBadge = (cat: string) => {
            switch (cat) {
              case 'common_discrepancy':
                return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
              case 'historical_exception':
                return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
              case 'approval_decision':
                return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
              default:
                return 'bg-slate-800 text-slate-300 border-slate-700';
            }
          };

          return (
            <div
              key={mem.id}
              className="rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 p-5 space-y-3 shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getCategoryBadge(
                        mem.category,
                      )}`}
                    >
                      {mem.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-amber-300">{mem.targetName}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">{mem.title}</h3>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Recalled {mem.accessCount}x
                  </span>
                  <button
                    onClick={() => handleDelete(mem.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete Memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                {mem.content}
              </p>

              {/* Keywords and Meta */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[10px] font-mono">
                <div className="flex flex-wrap items-center gap-1">
                  {mem.keywords.map((kw, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400">
                      #{kw}
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-2 text-slate-500">
                  {mem.referenceId && (
                    <span className="text-amber-400 font-semibold">Protocol: {mem.referenceId}</span>
                  )}
                  <span>Conf: {(mem.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Vendor Memory Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Index New Vendor Rule</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMemory} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Vendor:</label>
                <select
                  value={newVendor}
                  onChange={(e) => setNewVendor(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="common_discrepancy">Common Discrepancy</option>
                  <option value="historical_exception">Historical Exception Protocol</option>
                  <option value="approval_decision">Approval Decision</option>
                  <option value="vendor_terms">Payment Terms Rule</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium">Rule Title:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Line item SKU-848 price markup threshold"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium">Rule Content & Mandate:</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe the discrepancy behavior, PO contract requirement, and action (e.g. place on hold, request credit memo)..."
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-amber-500 leading-relaxed font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium">Trigger Keywords (comma separated):</label>
                <input
                  type="text"
                  value={newKeywords}
                  onChange={(e) => setNewKeywords(e.target.value)}
                  placeholder="sku-848, markup, unit price, freight, hold"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20"
                >
                  Save AP Memory Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
