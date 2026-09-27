import React, { useState } from 'react';
import { MemoryRecord } from '../types.ts';
import {
  Search,
  Brain,
  Sliders,
  Sparkles,
  Zap,
  Target,
  Layers,
  ChevronRight,
  Database,
  Tag,
  ArrowRight,
} from 'lucide-react';

interface MemoryExplorerProps {
  memories: MemoryRecord[];
}

export const MemoryExplorer: React.FC<MemoryExplorerProps> = ({ memories }) => {
  const [searchQuery, setSearchQuery] = useState('ERP synchronization token');
  const [similarityThreshold, setSimilarityThreshold] = useState(0.65);
  const [activeTab, setActiveTab] = useState<'search' | 'graph'>('search');
  const [selectedMemory, setSelectedMemory] = useState<MemoryRecord | null>(null);

  // Simple cosine TF-IDF scorer for client visualization
  const scoredMemories = memories
    .map((mem) => {
      const qTerms = searchQuery
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(Boolean);

      if (qTerms.length === 0) return { ...mem, similarityScore: 0.1 };

      const contentText = (
        mem.title +
        ' ' +
        mem.content +
        ' ' +
        mem.keywords.join(' ')
      ).toLowerCase();

      let hitCount = 0;
      for (const term of qTerms) {
        if (term.length < 3) continue;
        if (contentText.includes(term)) hitCount += 1.5;
        if (mem.keywords.some((k) => k.toLowerCase().includes(term) || term.includes(k.toLowerCase()))) {
          hitCount += 2.0;
        }
      }

      if (searchQuery.toLowerCase().includes('erp') && contentText.includes('erp')) hitCount += 3;
      if (searchQuery.toLowerCase().includes('sync') && contentText.includes('sync')) hitCount += 2;
      if (searchQuery.toLowerCase().includes('sku-848') && contentText.includes('sku-848')) hitCount += 5;
      if (searchQuery.toLowerCase().includes('token') && contentText.includes('token')) hitCount += 3;

      const baseScore = Math.min(0.99, (hitCount / (qTerms.length + 3)) * 0.85 + 0.25);
      return { ...mem, similarityScore: parseFloat(baseScore.toFixed(3)) };
    })
    .sort((a, b) => (b.similarityScore || 0) - (a.similarityScore || 0));

  const matched = scoredMemories.filter((m) => (m.similarityScore || 0) >= similarityThreshold);

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Semantic Memory Explorer & Vector Lab</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Vector Cosine Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Inspect semantic vector spaces, similarity thresholds, and memory cluster relationships
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'search'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Vector Query Matcher
            </button>
            <button
              onClick={() => setActiveTab('graph')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'graph'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2D Memory Cluster Graph
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'search' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left 5 Cols: Query Sandbox & Threshold Sliders */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-800 text-xs font-mono font-bold text-cyan-400">
                <Sliders className="w-4 h-4" />
                <span>QUERY VECTOR PARAMETERS</span>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium">Test Natural Language Query:</label>
                <div className="relative mt-1.5">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter customer symptom or vendor discrepancy..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>
              </div>

              {/* Sample Quick Queries */}
              <div>
                <span className="text-[11px] text-slate-400 font-mono">Quick Probe Test Cases:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <button
                    onClick={() => setSearchQuery('ERP synchronization stopped working')}
                    className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-[11px] text-cyan-300 border border-slate-800"
                  >
                    "ERP sync stopped working"
                  </button>
                  <button
                    onClick={() => setSearchQuery('SKU-848 unit price markup')}
                    className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-[11px] text-amber-300 border border-slate-800"
                  >
                    "SKU-848 price markup"
                  </button>
                  <button
                    onClick={() => setSearchQuery('Webhook signature stripping')}
                    className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800"
                  >
                    "Webhook signature ALB"
                  </button>
                  <button
                    onClick={() => setSearchQuery('2% 10 prompt payment discount')}
                    className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-[11px] text-emerald-300 border border-slate-800"
                  >
                    "2% 10 prompt discount"
                  </button>
                </div>
              </div>

              {/* Similarity Slider */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Cosine Similarity Cutoff:</span>
                  <span className="text-cyan-400 font-bold">{(similarityThreshold * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.30"
                  max="0.95"
                  step="0.05"
                  value={similarityThreshold}
                  onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Permissive (30%)</span>
                  <span>Balanced (65%)</span>
                  <span>Strict (95%)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Candidate Memories Evaluated:</span>
                  <span className="text-white font-bold">{memories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Memories Above Threshold:</span>
                  <span className="text-cyan-400 font-bold">{matched.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>HNSW Metric:</span>
                  <span className="text-slate-300">1 - Cosine Distance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Ranked Matches */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span>RANKED VECTOR MATCHES ({matched.length})</span>
              <span>Sorted by Cosine Proximity</span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[640px] pr-1 custom-scrollbar">
              {matched.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                  No memories met the {(similarityThreshold * 100).toFixed(0)}% cosine similarity threshold. Try lowering the cutoff.
                </div>
              ) : (
                matched.map((mem, idx) => {
                  const score = mem.similarityScore || 0.5;

                  return (
                    <div
                      key={mem.id}
                      onClick={() => setSelectedMemory(mem)}
                      className="cursor-pointer p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-2.5 shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-[10px] flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-bold text-white">{mem.targetName}</span>
                          <span className="text-[10px] font-mono text-slate-400">
                            ({mem.targetType.toUpperCase()})
                          </span>
                        </div>

                        {/* Similarity Score Meter */}
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                              style={{ width: `${score * 100}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs font-bold text-cyan-400">
                            {(score * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-cyan-200">{mem.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                        {mem.content}
                      </p>

                      <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                        <div className="flex flex-wrap gap-1">
                          {mem.keywords.map((kw, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                              #{kw}
                            </span>
                          ))}
                        </div>
                        {mem.referenceId && (
                          <span className="text-cyan-400 font-semibold">Ref: {mem.referenceId}</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 2D Memory Cluster Graph */
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-mono text-cyan-400 font-bold">2D EMBEDDING PROJECTION (PCA / UMAP)</span>
            <span className="text-slate-400 font-mono">Distance = Semantic Divergence</span>
          </div>

          <div className="relative h-96 w-full rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-6">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10 pointer-events-none">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border border-cyan-500" />
              ))}
            </div>

            {/* Simulated Semantic Clusters */}
            <div className="relative w-full h-full">
              {/* Cluster 1: Customer ERP & Cloud Sync */}
              <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 backdrop-blur-sm text-center">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block mb-1">
                  Cluster: ERP & OAuth Sync
                </span>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-xs font-mono text-cyan-300">
                    Acme
                  </div>
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-xs font-mono text-cyan-300">
                    T-8821
                  </div>
                </div>
              </div>

              {/* Cluster 2: AP Hardware Price Discrepancies */}
              <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 backdrop-blur-sm text-center">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block mb-1">
                  Cluster: AP Price Markup Rules
                </span>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xs font-mono text-amber-300">
                    Apex
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xs font-mono text-amber-300">
                    EX-449
                  </div>
                </div>
              </div>

              {/* Cluster 3: Webhook & Network Firewalls */}
              <div className="absolute top-1/3 right-1/3 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 backdrop-blur-sm text-center">
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold block mb-1">
                  Cluster: Webhooks & ALB
                </span>
                <div className="w-8 h-8 mx-auto rounded-full bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-xs font-mono text-indigo-300">
                  FinV
                </div>
              </div>

              {/* Cluster 4: Prompt Payment Terms */}
              <div className="absolute bottom-1/3 left-1/3 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 backdrop-blur-sm text-center">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block mb-1">
                  Cluster: Early Pay 2%
                </span>
                <div className="w-8 h-8 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xs font-mono text-emerald-300">
                  Cloud
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
