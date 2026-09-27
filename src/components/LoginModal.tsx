import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types.ts';
import { Sparkles, ShieldCheck, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useAuth();
  const [email, setEmail] = useState('alex.mercer@memora.ai');
  const [password, setPassword] = useState('••••••••••••');

  if (!isLoginModalOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('support') || email.includes('jordan')) {
      login('support_agent');
    } else if (email.includes('ap') || email.includes('hernandez')) {
      login('ap_manager');
    } else {
      login('admin');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#070b14]/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-700/80 p-8 shadow-2xl shadow-cyan-500/10 space-y-6">
        {/* Glow decoration */}
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl -mt-10 pointer-events-none" />

        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[2px] shadow-xl shadow-cyan-500/20">
            <div className="w-full h-full bg-[#070b14] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-wider text-white">MEMORA AI</h1>
          <p className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-semibold">
            Persistent Business Memory Agents
          </p>
        </div>

        {/* Standard Email / Password Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-medium block mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2"
          >
            <span>SIGN IN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Users Selector - Required by Prompt */}
        <div className="space-y-2 pt-4 border-t border-slate-800">
          <p className="text-[11px] font-mono text-slate-400 text-center uppercase tracking-wider">
            Or select a 1-click Demo Persona:
          </p>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => login('admin')}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-center transition-all group"
            >
              <div className="text-xs font-bold text-purple-300 group-hover:text-purple-200">Admin</div>
              <div className="text-[9px] text-slate-500 font-mono mt-0.5">Full Platform</div>
            </button>

            <button
              onClick={() => login('support_agent')}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-center transition-all group"
            >
              <div className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200">Support Agent</div>
              <div className="text-[9px] text-slate-500 font-mono mt-0.5">Support & Memory</div>
            </button>

            <button
              onClick={() => login('ap_manager')}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-center transition-all group"
            >
              <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200">AP Manager</div>
              <div className="text-[9px] text-slate-500 font-mono mt-0.5">Invoices & Vendors</div>
            </button>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-500 font-mono">
          Persistent JWT Session Simulated with RBAC
        </div>
      </div>
    </div>
  );
};
