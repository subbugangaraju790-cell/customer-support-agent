import React, { useState, useEffect, useRef } from 'react';
import {
  CustomerProfile,
  MemoryRecord,
  PipelineTrace,
} from '../types.ts';
import { api } from '../services/api.ts';
import {
  Bot,
  User,
  Send,
  Brain,
  Sparkles,
  Server,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Terminal,
  MessageSquare,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface CustomerSupportAgentProps {
  customers: CustomerProfile[];
  initialCustomerId?: string;
  onRefreshStats: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'customer' | 'agent';
  text: string;
  timestamp: string;
  pipelineTrace?: PipelineTrace;
  retrievedMemories?: MemoryRecord[];
}

export const CustomerSupportAgent: React.FC<CustomerSupportAgentProps> = ({
  customers,
  initialCustomerId = 'cust-acme',
  onRefreshStats,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(initialCustomerId);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [customerMemories, setCustomerMemories] = useState<MemoryRecord[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCustomerData(selectedCustomerId);
  }, [selectedCustomerId]);

  const loadCustomerData = async (cid: string) => {
    try {
      const data = await api.getCustomer(cid);
      setCustomer(data.customer);
      setCustomerMemories(data.memories);

      // Preload realistic conversation history demonstration
      if (cid === 'cust-acme') {
        setMessages([
          {
            id: 'm-seed-1',
            sender: 'customer',
            text: 'My ERP synchronization is not working.',
            timestamp: 'Aug 14, 2026 (Ticket #T-8821 Archive)',
          },
          {
            id: 'm-seed-2',
            sender: 'agent',
            text: `Hello Sarah. I have diagnosed your SAP S/4HANA connector.

The root cause is an OAuth bearer token cache desync following your automated quarterly rotation.
Resolution:
1. Trigger manual authentication token refresh in Admin > Connectors > SAP Gateway.
2. Flush the Redis token cache.
3. ⚠️ Do NOT restart the entire daemon process as doing so will drop queued sync packets in Kafka.

[Resolution verified and indexed into persistent memory.]`,
            timestamp: 'Aug 14, 2026 (Resolved & Saved to Vector DB)',
          },
        ]);
      } else {
        setMessages([
          {
            id: 'm-seed-0',
            sender: 'agent',
            text: `Hello! I am MEMORA Support Agent. I have loaded ${data.customer.name}'s environment specifications and past incident memories into active context. How can I assist you today?`,
            timestamp: 'Just now',
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading || !customer) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'customer',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await api.sendCustomerSupportMessage(customer.id, text, messages);
      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pipelineTrace: res.pipelineTrace,
        retrievedMemories: res.retrievedMemories,
      };

      setMessages((prev) => [...prev, agentMsg]);
      if (res.pipelineTrace) {
        setExpandedTraceId(res.pipelineTrace.id);
      }
      onRefreshStats();
      // Reload memories to show newly created memory
      const updated = await api.getCustomer(customer.id);
      setCustomerMemories(updated.memories);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSelectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      {/* Top Header & Customer Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">Customer Support Agent</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Persistent Memory Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Demonstrates cross-session memory recall for enterprise customers
            </p>
          </div>
        </div>

        {/* Customer Selector */}
        <div className="flex items-center space-x-3">
          <label className="text-xs text-slate-400 font-mono">Select Customer Profile:</label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.tier} Tier - {c.environment.erpSystem})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Chat Workspace + Live Working Memory Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Cols: Chat Conversation Simulator & Cognitive Steps */}
        <div className="lg:col-span-8 flex flex-col h-[740px] rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden">
          {/* Active Context Banner */}
          {customer && (
            <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3 truncate">
                <span className="font-semibold text-white">{customer.name}</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">Contact: {customer.contactPerson}</span>
                <span className="text-slate-600">|</span>
                <span className="text-cyan-400 font-mono">{customer.environment.erpSystem}</span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-[10px] text-slate-400 font-mono">Frustration:</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    customer.frustrationScore > 50
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {customer.frustrationScore}% ({customer.sentiment})
                </span>
              </div>
            </div>
          )}

          {/* Quick-Action Scenario Prompts - Core Differentiator Triggers */}
          <div className="p-3 bg-[#0a0f1d] border-b border-slate-800/80">
            <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-cyan-300 font-semibold">One-Click Memory Proof Scenarios:</span>
              </span>
              <span className="text-[10px] text-slate-500">Test cross-conversation recall</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSendMessage('It stopped working again.')}
                className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>Scenario 1: "It stopped working again."</span>
                <ArrowRight className="w-3 h-3 text-cyan-400" />
              </button>
              <button
                onClick={() => handleSendMessage('Should we restart the server daemon to fix this?')}
                className="px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>Scenario 2: "Should we restart the server daemon?"</span>
                <ArrowRight className="w-3 h-3 text-indigo-400" />
              </button>
              <button
                onClick={() =>
                  handleSendMessage('Can you confirm what port we mapped for inbound mutual TLS in our VPC?')
                }
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center space-x-1.5 transition-all"
              >
                <span>Scenario 3: Recall VPC firewall port</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-[#070b14]/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-2 mb-1 px-1">
                  {msg.sender === 'customer' ? (
                    <>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {customer?.contactPerson || 'Customer'}
                      </span>
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center">
                        <Bot className="w-2.5 h-2.5 text-slate-950" />
                      </div>
                      <span className="text-[11px] text-cyan-300 font-mono font-semibold">
                        MEMORA Autonomous Agent
                      </span>
                    </>
                  )}
                  <span className="text-[10px] text-slate-600 font-mono">{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[88%] rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.sender === 'customer'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Retrieved Memory Indicators */}
                  {msg.retrievedMemories && msg.retrievedMemories.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 flex items-center space-x-1">
                        <Brain className="w-3 h-3" />
                        <span>RECALLED {msg.retrievedMemories.length} MEMORIES:</span>
                      </span>
                      {msg.retrievedMemories.map((m) => (
                        <span
                          key={m.id}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-semibold"
                        >
                          {m.referenceId ? `#${m.referenceId}: ` : ''}
                          {m.title.slice(0, 32)}... (
                          {((m.similarityScore || 0.95) * 100).toFixed(0)}%)
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Cognitive Architecture Trace Accordion */}
                  {msg.pipelineTrace && (
                    <div className="mt-3 pt-2 border-t border-slate-800">
                      <button
                        onClick={() =>
                          setExpandedTraceId(
                            expandedTraceId === msg.pipelineTrace?.id ? null : msg.pipelineTrace!.id,
                          )
                        }
                        className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-semibold transition-colors"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>
                          {expandedTraceId === msg.pipelineTrace.id
                            ? 'Hide Cognitive Memory Pipeline Trace'
                            : 'View Cognitive Memory Pipeline Trace (6 Steps)'}
                        </span>
                        {expandedTraceId === msg.pipelineTrace.id ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>

                      {expandedTraceId === msg.pipelineTrace.id && (
                        <div className="mt-3 p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2.5 text-[11px] font-mono">
                          <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
                            <span className="text-cyan-400 font-bold">COGNITIVE TRACE LOG</span>
                            <span>Latency: {msg.pipelineTrace.durationMs}ms</span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-blue-400 font-bold">1. Current Input:</span>
                            <p className="text-slate-300 pl-2">"{msg.pipelineTrace.currentInput}"</p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-cyan-400 font-bold">
                              2. Memory Retrieval ({msg.pipelineTrace.retrievedMemories.length} hits):
                            </span>
                            <div className="pl-2 space-y-1">
                              {msg.pipelineTrace.retrievedMemories.map((rm) => (
                                <p key={rm.id} className="text-slate-300">
                                  • [{rm.category.toUpperCase()}] "{rm.title}" — Score:{' '}
                                  {((rm.similarityScore || 0.95) * 100).toFixed(0)}%
                                </p>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-indigo-400 font-bold">3. Historical Context:</span>
                            <p className="text-slate-400 pl-2 text-[10px] leading-tight line-clamp-2">
                              {msg.pipelineTrace.historicalContext.slice(0, 160)}...
                            </p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-purple-400 font-bold">4. AI Reasoning:</span>
                            <p className="text-slate-300 pl-2">{msg.pipelineTrace.aiReasoning}</p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-emerald-400 font-bold">5. Business Action:</span>
                            <p className="text-emerald-300 pl-2">
                              {msg.pipelineTrace.businessAction.actionType}:{' '}
                              {msg.pipelineTrace.businessAction.details}
                            </p>
                          </div>

                          {msg.pipelineTrace.newMemoryCreated && (
                            <div className="space-y-1 pt-1 border-t border-slate-800">
                              <span className="text-cyan-300 font-bold flex items-center space-x-1">
                                <Sparkles className="w-3 h-3 text-cyan-400" />
                                <span>6. New Memory Persisted to Vector Store:</span>
                              </span>
                              <p className="text-cyan-200 pl-2 text-[10px]">
                                "{msg.pipelineTrace.newMemoryCreated.title}" (ID:{' '}
                                {msg.pipelineTrace.newMemoryCreated.id})
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 text-xs text-cyan-400 font-mono py-2">
                <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                <span>MEMORA Agent retrieving semantic vector memories & reasoning...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask as ${customer?.contactPerson || 'Customer'} (e.g. "It stopped working again", "Check ERP sync status")...`}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-medium"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-medium text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-cyan-500/20"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right 4 Cols: Live Customer Memory Inspector & Environment */}
        <div className="lg:col-span-4 space-y-4">
          {/* Customer Specs Card */}
          {customer && (
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Customer Environment
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                  {customer.tier} Tier
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px]">ERP System:</span>
                  <p className="font-semibold text-slate-200">
                    {customer.environment.erpSystem} ({customer.environment.version})
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Hosting & VPC:</span>
                  <p className="font-semibold text-slate-200">{customer.environment.hosting}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Connector Gateway:</span>
                  <p className="font-semibold text-cyan-300 font-mono">
                    {customer.environment.connectorVersion}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Communication Preference:</span>
                  <p className="text-slate-300 text-[11px] italic bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    "{customer.communicationPreference}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Active Memories in Vector Store for this Customer */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 shadow-lg flex flex-col h-[480px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Indexed Memories ({customerMemories.length})
                </h3>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">ChromaDB Cosine</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
              {customerMemories.map((mem) => {
                const getCategoryBadge = (cat: string) => {
                  switch (cat) {
                    case 'solution_worked':
                      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
                    case 'known_issue':
                      return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
                    case 'environment':
                      return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
                    case 'customer_sentiment':
                      return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
                    default:
                      return 'bg-slate-800 text-slate-300 border-slate-700';
                  }
                };

                return (
                  <div
                    key={mem.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all text-xs space-y-1.5"
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
                        <span className="text-cyan-400 font-semibold">Ref: {mem.referenceId}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
