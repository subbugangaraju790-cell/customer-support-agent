import React, { useState, useEffect } from 'react';
import {
  InvoiceRecord,
  VendorProfile,
  MemoryRecord,
  PipelineTrace,
} from '../types.ts';
import { api } from '../services/api.ts';
import {
  Receipt,
  Building2,
  Brain,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Layers,
  FileText,
  Mail,
  Send,
  Eye,
  ArrowRight,
  RefreshCw,
  Scan,
  TrendingDown,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AccountsPayableAgentProps {
  invoices: InvoiceRecord[];
  vendors: VendorProfile[];
  initialInvoiceId?: string;
  onRefreshStats: () => void;
}

export const AccountsPayableAgent: React.FC<AccountsPayableAgentProps> = ({
  invoices,
  vendors,
  initialInvoiceId = 'inv-889',
  onRefreshStats,
}) => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(initialInvoiceId);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceRecord | null>(null);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [vendorMemories, setVendorMemories] = useState<MemoryRecord[]>([]);
  const [pipelineTrace, setPipelineTrace] = useState<PipelineTrace | null>(null);
  const [disputeDraft, setDisputeDraft] = useState<{ to: string; subject: string; body: string } | null>(
    null,
  );
  const [isAuditing, setIsAuditing] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showOcrDrawer, setShowOcrDrawer] = useState(false);
  const [managerOverrideNote, setManagerOverrideNote] = useState('');
  const [expandedTrace, setExpandedTrace] = useState(true);

  useEffect(() => {
    loadInvoice(selectedInvoiceId);
  }, [selectedInvoiceId, invoices]);

  const loadInvoice = async (invId: string) => {
    const inv = invoices.find((i) => i.id === invId) || invoices[0];
    if (!inv) return;
    setCurrentInvoice(inv);

    try {
      const vData = await api.getVendor(inv.vendorId);
      setVendor(vData.vendor);
      setVendorMemories(vData.memories);

      // If it's already analyzed or has matched memories
      if (inv.matchedMemories && inv.matchedMemories.length > 0) {
        setDisputeDraft({
          to: vData.vendor.contactEmail,
          subject: `Discrepancy Notice & Hold: Invoice ${inv.invoiceNumber} (PO ${inv.poNumber})`,
          body: `Dear ${vData.vendor.name} Accounts Receivable,\n\nOur automated AP memory auditing system has flagged Invoice ${inv.invoiceNumber} for a pricing discrepancy on SKU-848.\n\n- Contracted PO #PO-8820 Unit Price: $145.00\n- Invoiced Unit Price: $165.00 (+ $20.00 / unit x 100 = +$2,000.00 delta)\n\nIn accordance with Master Services Agreement Clause 14.2 and Exception Protocol EX-449, this invoice has been placed on ADMINISTRATIVE HOLD. Please issue a corrected invoice or credit memo in the amount of $2,000.00 to resume processing.\n\nSincerely,\nMEMORA AP Autonomous Agent`,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const runCognitiveAudit = async () => {
    if (!currentInvoice) return;
    setIsAuditing(true);

    try {
      const res = await api.analyzeInvoice(currentInvoice.id);
      setCurrentInvoice(res.invoice);
      setPipelineTrace(res.pipelineTrace);
      if (res.disputeDraft) {
        setDisputeDraft(res.disputeDraft);
      }
      onRefreshStats();
      // Reload vendor data to get any new memories formed
      if (vendor) {
        const vData = await api.getVendor(vendor.id);
        setVendorMemories(vData.memories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleUpdateStatus = async (status: InvoiceRecord['status']) => {
    if (!currentInvoice) return;
    try {
      const updated = await api.updateInvoice(currentInvoice.id, status, managerOverrideNote);
      setCurrentInvoice(updated);
      onRefreshStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateOcr = async (type: 'apex' | 'cloudscale') => {
    try {
      const ocrRes = await api.runOcr(type);
      if (ocrRes.success) {
        setShowOcrDrawer(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

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
      {/* Top Header & Invoice Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">Accounts Payable Agent</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                Autonomous Discrepancy Defense
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cross-examines incoming invoices against historical vendor memory, PO contracts, and exception rules
            </p>
          </div>
        </div>

        {/* Invoice Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <label className="text-xs text-slate-400 font-mono">Select Invoice:</label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => setSelectedInvoiceId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
            >
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} - {inv.vendorName} (${inv.totalAmount.toLocaleString()} - {inv.status})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={runCognitiveAudit}
            disabled={isAuditing}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
          >
            {isAuditing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Cognitive Memory Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Invoice & Discrepancy Detection + Vendor Memory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Cols: Visual Invoice Document & Cognitive Pipeline Trace */}
        <div className="lg:col-span-8 space-y-4">
          {currentInvoice && (
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-6">
              {/* Invoice Document Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-extrabold text-white tracking-tight">
                      {currentInvoice.invoiceNumber}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        currentInvoice.status,
                      )}`}
                    >
                      {currentInvoice.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    PO Reference: <span className="text-cyan-400 font-mono font-semibold">{currentInvoice.poNumber}</span> | Date: {currentInvoice.invoiceDate}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-white font-mono tracking-tight">
                    ${currentInvoice.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Payment Terms: <span className="text-amber-400 font-semibold">{currentInvoice.paymentTerms}</span>
                  </div>
                </div>
              </div>

              {/* Detected Anomalies Banner (If any) */}
              {currentInvoice.detectedAnomalies.length > 0 && (
                <div className="rounded-xl bg-amber-950/40 border border-amber-500/50 p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>HISTORICAL VENDOR ANOMALY DETECTED (CONFIDENCE: 99%)</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-200">
                    {currentInvoice.detectedAnomalies.map((ano, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{ano}</span>
                      </div>
                    ))}
                  </div>

                  {currentInvoice.aiReasoning && (
                    <div className="mt-2 pt-2 border-t border-amber-900/60 text-xs text-amber-200/90 leading-relaxed font-sans">
                      <strong className="text-amber-300 font-mono">AI Cognitive Assessment:</strong> {currentInvoice.aiReasoning}
                    </div>
                  )}

                  {/* Quick Action Buttons for Anomaly */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      onClick={() => handleUpdateStatus('On Hold')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Place On Hold (Protocol EX-449)</span>
                    </button>
                    {disputeDraft && (
                      <button
                        onClick={() => setShowDisputeModal(true)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center space-x-1.5 transition-all"
                      >
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span>View Drafted Dispute Notice ($2,000 Credit Demand)</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateStatus('Approved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-medium flex items-center space-x-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Manager Override & Approve</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Line Items Table */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-bold">
                  Audited Line Items & PO Comparison
                </h4>
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                      <tr>
                        <th className="p-3">SKU & Description</th>
                        <th className="p-3 text-right">Invoiced Qty</th>
                        <th className="p-3 text-right">Invoiced Unit $</th>
                        <th className="p-3 text-right">Contract PO $</th>
                        <th className="p-3 text-right">Total $</th>
                        <th className="p-3">Audit Delta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
                      {currentInvoice.lineItems.map((li) => {
                        const hasMarkup = li.poUnitPrice && li.unitPrice > li.poUnitPrice;

                        return (
                          <tr
                            key={li.id}
                            className={hasMarkup ? 'bg-amber-950/20' : 'hover:bg-slate-800/40'}
                          >
                            <td className="p-3">
                              <div className="font-semibold text-white">{li.sku}</div>
                              <div className="text-[11px] text-slate-400">{li.description}</div>
                            </td>
                            <td className="p-3 text-right font-mono text-slate-200">{li.quantity}</td>
                            <td
                              className={`p-3 text-right font-mono font-bold ${
                                hasMarkup ? 'text-amber-400' : 'text-slate-200'
                              }`}
                            >
                              ${li.unitPrice.toFixed(2)}
                            </td>
                            <td className="p-3 text-right font-mono text-slate-400">
                              {li.poUnitPrice ? `$${li.poUnitPrice.toFixed(2)}` : 'N/A'}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-white">
                              ${li.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="p-3">
                              {hasMarkup ? (
                                <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                                  <span>+${(li.unitPrice - li.poUnitPrice!).toFixed(2)} Markup</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>PO Match</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Subtotal & Tax Breakdown */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>${currentInvoice.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tax:</span>
                    <span>${currentInvoice.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-slate-800">
                    <span>Total Amount:</span>
                    <span className="text-cyan-400">
                      ${currentInvoice.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cognitive Architecture Trace for AP */}
          {currentInvoice && currentInvoice.matchedMemories.length > 0 && (
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    AP Cognitive Memory Pipeline Trace
                  </h3>
                </div>
                <button
                  onClick={() => setExpandedTrace(!expandedTrace)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  {expandedTrace ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {expandedTrace && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="font-mono text-cyan-400 font-bold">1. Current Input (OCR Scanned)</span>
                    <p className="text-slate-300 text-[11px]">
                      Invoice {currentInvoice.invoiceNumber} with {currentInvoice.lineItems.length} items. Total: ${currentInvoice.totalAmount.toFixed(2)}. SKU-848 billed at $165.00.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/40 space-y-1">
                    <span className="font-mono text-amber-400 font-bold">2. Memory Retrieval</span>
                    <p className="text-slate-300 text-[11px]">
                      Retrieved {currentInvoice.matchedMemories.length} historical memories for {currentInvoice.vendorName}. Matched past pricing discrepancy and Exception Protocol EX-449.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="font-mono text-indigo-400 font-bold">3. Historical Context Injected</span>
                    <p className="text-slate-300 text-[11px]">
                      Contract terms: Net 45. PO #PO-8820 clause 14.2 explicitly stipulates fixed pricing at $145.00 for SKU-848 with required credit memo on overage.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-1">
                    <span className="font-mono text-emerald-400 font-bold">4. Business Action & Writeback</span>
                    <p className="text-slate-300 text-[11px]">
                      Placed on HOLD. Generated dispute letter to {vendor?.contactEmail}. Indexed new memory record for recurrence tracking.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 4 Cols: Vendor Profile & Historical Vendor Memory Repository */}
        <div className="lg:col-span-4 space-y-4">
          {/* Vendor Profile Card */}
          {vendor && (
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Vendor Intelligence
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    vendor.trustScore < 70
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  Trust Score: {vendor.trustScore}/100
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px]">Vendor Name:</span>
                  <p className="font-semibold text-white">{vendor.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 text-[11px]">Payment Terms:</span>
                    <p className="font-semibold text-amber-400 font-mono">{vendor.paymentTerms}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Discrepancy Rate:</span>
                    <p className="font-semibold text-rose-400 font-mono">{vendor.discrepancyRate}%</p>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Common Discrepancy Patterns:</span>
                  <div className="mt-1 space-y-1">
                    {vendor.typicalDiscrepancies.map((td, idx) => (
                      <div
                        key={idx}
                        className="text-[11px] text-slate-300 bg-slate-950 p-1.5 rounded border border-slate-800/80 flex items-start space-x-1.5"
                      >
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{td}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vendor Memories in Vector Store */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 shadow-lg flex flex-col h-[460px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Vendor Memories ({vendorMemories.length})
                </h3>
              </div>
              <span className="text-[10px] text-amber-400 font-mono">Persistent AP</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
              {vendorMemories.map((mem) => {
                const getCategoryBadge = (cat: string) => {
                  switch (cat) {
                    case 'common_discrepancy':
                      return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
                    case 'historical_exception':
                      return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
                    case 'approval_decision':
                      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
                    default:
                      return 'bg-slate-800 text-slate-300 border-slate-700';
                  }
                };

                return (
                  <div
                    key={mem.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition-all text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${getCategoryBadge(
                          mem.category,
                        )}`}
                      >
                        {mem.category.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Recalled {mem.accessCount}x
                      </span>
                    </div>

                    <h4 className="font-semibold text-white leading-snug">{mem.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                      {mem.content}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] font-mono text-slate-400">
                      <span>Conf: {(mem.confidence * 100).toFixed(0)}%</span>
                      {mem.referenceId && (
                        <span className="text-amber-400 font-semibold">Ref: {mem.referenceId}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Dispute Notice Modal */}
      {showDisputeModal && disputeDraft && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Automated Vendor Dispute Notice</h3>
              </div>
              <button
                onClick={() => setShowDisputeModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-mono text-[11px]">Recipient:</label>
                <div className="font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-200">
                  {disputeDraft.to}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-mono text-[11px]">Subject:</label>
                <div className="font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-200">
                  {disputeDraft.subject}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-mono text-[11px]">Draft Message Body:</label>
                <textarea
                  readOnly
                  rows={8}
                  value={disputeDraft.body}
                  className="w-full font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowDisputeModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Dispute notice transmitted to vendor accounts receivable.');
                  setShowDisputeModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
