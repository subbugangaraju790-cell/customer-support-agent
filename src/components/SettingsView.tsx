import React, { useState } from 'react';
import { SystemSettings } from '../types.ts';
import { api } from '../services/api.ts';
import {
  Settings,
  Cpu,
  Database,
  Sliders,
  CheckCircle2,
  Download,
  Terminal,
  Server,
  FileCode,
  Shield,
} from 'lucide-react';

interface SettingsViewProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: SystemSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [formData, setFormData] = useState<SystemSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateSettings(formData);
      onUpdateSettings(updated);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadDocker = () => {
    const composeContent = `version: '3.8'
services:
  memora-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
    restart: always

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: memora_ai
      POSTGRES_USER: memora
      POSTGRES_PASSWORD: memora_password
    ports:
      - "5432:5432"

  chromadb:
    image: chromadb/chroma:latest
    ports:
      - "8000:8000"
`;
    const blob = new Blob([composeContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'docker-compose.yml';
    a.click();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Platform Settings & Engine Configuration</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Configure underlying LLM reasoning models, vector memory retention, and autonomous action thresholds
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* LLM Provider Configuration */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400 pb-2 border-b border-slate-800">
            <Cpu className="w-4 h-4" />
            <span>LLM REASONING CORE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-medium">Provider Selection:</label>
              <select
                value={formData.llmProvider}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    llmProvider: e.target.value as any,
                    modelName:
                      e.target.value === 'gemini'
                        ? 'gemini-3.8-flash'
                        : e.target.value === 'ollama'
                        ? 'llama3.2:latest'
                        : 'gpt-4o',
                  })
                }
                className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="gemini">Google Gemini (Recommended - Server-side)</option>
                <option value="ollama">Ollama Local Server (http://localhost:11434)</option>
                <option value="openai">OpenAI-Compatible Custom Endpoint</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-medium">Active Model Identifier:</label>
              <input
                type="text"
                value={formData.modelName}
                onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono">
            {formData.llmProvider === 'gemini'
              ? '✓ Connected via server-side GoogleGenAI SDK using @google/genai (model: gemini-3.8-flash). Full cognitive reasoning with low latency.'
              : formData.llmProvider === 'ollama'
              ? '⚠️ Local Ollama mode: Queries will target localhost:11434 with fallback to local embedding engine.'
              : 'ℹ️ Custom OpenAI-compatible interface active.'}
          </p>
        </div>

        {/* Vector Memory Parameters */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400 pb-2 border-b border-slate-800">
            <Database className="w-4 h-4" />
            <span>VECTOR MEMORY & RETRIEVAL HYPERPARAMETERS</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-mono mb-1.5">
                <span className="text-slate-300">Semantic Cosine Similarity Cutoff:</span>
                <span className="text-cyan-400 font-bold">
                  {(formData.similarityThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.4"
                max="0.95"
                step="0.05"
                value={formData.similarityThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, similarityThreshold: parseFloat(e.target.value) })
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-mono mb-1.5">
                <span className="text-slate-300">Autonomous Action Confidence Gate:</span>
                <span className="text-amber-400 font-bold">
                  {(formData.autoActionThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.6"
                max="0.99"
                step="0.01"
                value={formData.autoActionThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, autoActionThreshold: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autonomousInvoiceHolds}
                  onChange={(e) =>
                    setFormData({ ...formData, autonomousInvoiceHolds: e.target.checked })
                  }
                  className="rounded border-slate-800 accent-amber-500 w-4 h-4"
                />
                <span className="text-slate-200">
                  Enable autonomous invoice HOLD on historical discrepancy match (Protocol EX-449)
                </span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autonomousTicketResolutions}
                  onChange={(e) =>
                    setFormData({ ...formData, autonomousTicketResolutions: e.target.checked })
                  }
                  className="rounded border-slate-800 accent-cyan-500 w-4 h-4"
                />
                <span className="text-slate-200">
                  Allow Customer Support agent to recommend verified historical fix without human gate
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Deployment Readiness */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-400 pb-2 border-b border-slate-800">
            <Server className="w-4 h-4" />
            <span>DEPLOYMENT READINESS (PYTHON / DOCKER / POSTGRES)</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The MEMORA AI prototype runs full-stack with server-side Gemini 3.8 Flash, in-memory persistent vector store, and Express API. In addition, production-grade Python FastAPI, SQLAlchemy models, ChromaDB memory engine, and Docker configuration files are bundled in the repository.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDownloadDocker}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-700 transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download docker-compose.yml</span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          {isSaved ? (
            <span className="text-xs text-emerald-400 font-mono flex items-center space-x-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Configuration saved and active.</span>
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
};
