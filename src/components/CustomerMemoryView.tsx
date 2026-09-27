import React, { useState } from 'react';
import { MemoryRecord, CustomerProfile } from '../types.ts';
import { api } from '../services/api.ts';
import {
  Brain,
  Search,
  Plus,
  Filter,
  Trash2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Tag,
  Clock,
} from 'lucide-react';

interface CustomerMemoryViewProps {
  memories: MemoryRecord[];
  customers: CustomerProfile[];
  onRefreshMemories: () => void;
}

export const CustomerMemoryView: React.FC<CustomerMemoryViewProps> = ({
  memories,
  customers,
  onRefreshMemories,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [customerFilter, setCustomerFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Memory Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCustomer, setNewCustomer] = useState(customers[0]?.id || 'cust-acme');
  const [newCategory, setNewCategory] = useState<MemoryRecord['category']>('solution_worked');
  const [newImportance, setNewImportance] = useState<MemoryRecord['importance']>('high');
  const [newKeywords, setNewKeywords] = useState('');

  const customerMemoriesOnly = memories.filter((m) => m.targetType === 'customer');

  const filtered = customerMemoriesOnly.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    const matchesCustomer = customerFilter === 'all' || m.targetId === customerFilter;

    return matchesSearch && matchesCategory && matchesCustomer;
  });

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const targetCust = customers.find((c) => c.id === newCustomer);

    try {
      await api.createMemory({
        targetType: 'customer',
        targetId: newCustomer,
        targetName: targetCust?.name || 'Acme Corp',
        category: newCategory,
        title: newTitle,
        content: newContent,
        importance: newImportance,
        keywords: newKeywords.split(',').map((k) => k.trim()).filter(Boolean),
        confidence: 0.98,
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
    if (confirm('Delete this memory record from the vector index?')) {
      try {
        await api.deleteMemory(id);
        onRefreshMemories();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'solution_worked', label: 'Solutions That Worked' },
    { id: 'known_issue', label: 'Known Issues' },
    { id: 'environment', label: 'Environment Blueprints' },
    { id: 'customer_sentiment', label: 'Customer Sentiment & Style' },
    { id: 'troubleshooting_step', label: 'Troubleshooting Steps' },
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div>
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Customer Memory Repository</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              {filtered.length} Indexed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Persistent episodic and semantic memories retrieved across customer support tickets
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs flex items-center space-x-2 transition-all shadow-md shadow-cyan-500/20 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Memory</span>
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
              placeholder="Search vector memories, keywords..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Customers</option>
            {customers.map((cust) => (
              <option key={cust.id} value={cust.id}>
                {cust.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-[11px] font-mono text-slate-500">
          HNSW Metric: <span className="text-cyan-400">Cosine Distance</span>
        </div>
      </div>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((mem) => {
          const getCategoryBadge = (cat: string) => {
            switch (cat) {
              case 'solution_worked':
                return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
              case 'known_issue':
                return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
              case 'environment':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
              case 'customer_sentiment':
                return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
              default:
                return 'bg-slate-800 text-slate-300 border-slate-700';
            }
          };

          return (
            <div
              key={mem.id}
              className="rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 p-5 space-y-3 shadow-lg transition-all"
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
                    <span className="text-xs font-semibold text-cyan-300">{mem.targetName}</span>
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
                    <span className="text-cyan-400 font-semibold">Ref: {mem.referenceId}</span>
                  )}
                  <span>Conf: {(mem.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Memory Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Index New Customer Memory</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMemory} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Customer:</label>
                <select
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="solution_worked">Solution That Worked</option>
                  <option value="known_issue">Known Issue</option>
                  <option value="environment">Environment Specification</option>
                  <option value="customer_sentiment">Customer Sentiment & Style</option>
                  <option value="troubleshooting_step">Troubleshooting Step</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium">Memory Title:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. ERP Synchronization Token Cache Desync Fix"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium">Memory Content / Diagnostic Rule:</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe the historical incident, root cause, and the exact remediation that worked..."
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-cyan-500 leading-relaxed font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium">Trigger Keywords (comma separated):</label>
                <input
                  type="text"
                  value={newKeywords}
                  onChange={(e) => setNewKeywords(e.target.value)}
                  placeholder="erp, sync, token, stopped working, sap"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
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
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20"
                >
                  Index Into Vector Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
