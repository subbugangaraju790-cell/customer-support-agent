import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Sidebar, NavItem } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { CustomerSupportAgent } from './components/CustomerSupportAgent.tsx';
import { CustomersList } from './components/CustomersList.tsx';
import { CustomerMemoryView } from './components/CustomerMemoryView.tsx';
import { AccountsPayableAgent } from './components/AccountsPayableAgent.tsx';
import { InvoicesList } from './components/InvoicesList.tsx';
import { VendorsList } from './components/VendorsList.tsx';
import { VendorMemoryView } from './components/VendorMemoryView.tsx';
import { MemoryExplorer } from './components/MemoryExplorer.tsx';
import { AiActivityStream } from './components/AiActivityStream.tsx';
import { SettingsView } from './components/SettingsView.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import {
  SystemStats,
  AiActivityItem,
  CustomerProfile,
  VendorProfile,
  InvoiceRecord,
  MemoryRecord,
  SystemSettings,
} from './types.ts';
import { api } from './services/api.ts';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavItem>('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust-acme');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('inv-889');

  // Application Data
  const [stats, setStats] = useState<SystemStats>({
    customers: 1284,
    openTickets: 37,
    escalated: 11,
    invoices: 82,
    pendingApproval: 14,
    flagged: 6,
    memoryRecords: 8742,
    retrievalAccuracy: 98.4,
    hoursSaved: 412,
  });
  const [activities, setActivities] = useState<AiActivityItem[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [memories, setMemories] = useState<MemoryRecord[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    llmProvider: 'gemini',
    modelName: 'gemini-3.8-flash',
    similarityThreshold: 0.65,
    autoActionThreshold: 0.85,
    memoryRetentionDays: 365,
    autonomousTicketResolutions: true,
    autonomousInvoiceHolds: true,
  });

  const [isLoading, setIsLoading] = useState(true);

  const loadAllData = async () => {
    try {
      const [sData, aData, cData, vData, iData, mData, cfgData] = await Promise.all([
        api.getStats(),
        api.getActivity(),
        api.getCustomers(),
        api.getVendors(),
        api.getInvoices(),
        api.getMemories(),
        api.getSettings(),
      ]);

      setStats(sData);
      setActivities(aData);
      setCustomers(cData);
      setVendors(vData);
      setInvoices(iData);
      setMemories(mData);
      setSettings(cfgData);
    } catch (err) {
      console.error('Data load note:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSimulateScenario = (scenario: 'support' | 'ap') => {
    if (scenario === 'support') {
      setSelectedCustomerId('cust-acme');
      setCurrentTab('customer_support');
    } else {
      setSelectedInvoiceId('inv-889');
      setCurrentTab('accounts_payable');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070b14] text-slate-100 font-sans">
      {/* Sidebar with Bottom AI STATUS & MEMORY ENGINE Badges */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        memoryCount={stats.memoryRecords}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gradient-to-b from-[#0a0f1d] via-[#070b14] to-[#05080f]">
        <Header
          currentTabName={currentTab}
          onOpenQuickDemo={handleSimulateScenario}
        />

        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {currentTab === 'dashboard' && (
            <Dashboard
              stats={stats}
              activities={activities}
              onNavigate={setCurrentTab}
              onSimulateScenario={handleSimulateScenario}
              onRefresh={loadAllData}
            />
          )}

          {currentTab === 'customer_support' && (
            <CustomerSupportAgent
              customers={customers}
              initialCustomerId={selectedCustomerId}
              onRefreshStats={loadAllData}
            />
          )}

          {currentTab === 'customers' && (
            <CustomersList
              customers={customers}
              onSelectCustomer={(cid) => {
                setSelectedCustomerId(cid);
                setCurrentTab('customer_support');
              }}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'customer_memory' && (
            <CustomerMemoryView
              memories={memories}
              customers={customers}
              onRefreshMemories={loadAllData}
            />
          )}

          {currentTab === 'accounts_payable' && (
            <AccountsPayableAgent
              invoices={invoices}
              vendors={vendors}
              initialInvoiceId={selectedInvoiceId}
              onRefreshStats={loadAllData}
            />
          )}

          {currentTab === 'invoices' && (
            <InvoicesList
              invoices={invoices}
              onSelectInvoice={(invId) => {
                setSelectedInvoiceId(invId);
                setCurrentTab('accounts_payable');
              }}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'vendors' && (
            <VendorsList
              vendors={vendors}
              onSelectVendor={(vId) => {
                setCurrentTab('vendor_memory');
              }}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'vendor_memory' && (
            <VendorMemoryView
              memories={memories}
              vendors={vendors}
              onRefreshMemories={loadAllData}
            />
          )}

          {currentTab === 'memory_explorer' && (
            <MemoryExplorer memories={memories} />
          )}

          {currentTab === 'ai_activity' && (
            <AiActivityStream
              activities={activities}
              onRefresh={loadAllData}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={setSettings}
            />
          )}
        </main>
      </div>

      <LoginModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
