import {
  CustomerProfile,
  VendorProfile,
  MemoryRecord,
  InvoiceRecord,
  AiActivityItem,
  SystemStats,
  SystemSettings,
  PipelineTrace,
} from '../types.ts';

const API_BASE = '/api';

export const api = {
  async getStats(): Promise<SystemStats> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async getActivity(): Promise<AiActivityItem[]> {
    const res = await fetch(`${API_BASE}/activity`);
    if (!res.ok) throw new Error('Failed to fetch activity');
    return res.json();
  },

  async getCustomers(): Promise<CustomerProfile[]> {
    const res = await fetch(`${API_BASE}/customers`);
    if (!res.ok) throw new Error('Failed to fetch customers');
    return res.json();
  },

  async getCustomer(id: string): Promise<{ customer: CustomerProfile; memories: MemoryRecord[] }> {
    const res = await fetch(`${API_BASE}/customers/${id}`);
    if (!res.ok) throw new Error('Failed to fetch customer');
    return res.json();
  },

  async getVendors(): Promise<VendorProfile[]> {
    const res = await fetch(`${API_BASE}/vendors`);
    if (!res.ok) throw new Error('Failed to fetch vendors');
    return res.json();
  },

  async getVendor(id: string): Promise<{ vendor: VendorProfile; memories: MemoryRecord[]; invoices: InvoiceRecord[] }> {
    const res = await fetch(`${API_BASE}/vendors/${id}`);
    if (!res.ok) throw new Error('Failed to fetch vendor');
    return res.json();
  },

  async getInvoices(): Promise<InvoiceRecord[]> {
    const res = await fetch(`${API_BASE}/invoices`);
    if (!res.ok) throw new Error('Failed to fetch invoices');
    return res.json();
  },

  async updateInvoice(id: string, status: InvoiceRecord['status'], notes?: string): Promise<InvoiceRecord> {
    const res = await fetch(`${API_BASE}/invoices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
    if (!res.ok) throw new Error('Failed to update invoice');
    return res.json();
  },

  async getMemories(targetType?: 'customer' | 'vendor', search?: string, targetId?: string): Promise<MemoryRecord[]> {
    const params = new URLSearchParams();
    if (targetType) params.append('targetType', targetType);
    if (search) params.append('search', search);
    if (targetId) params.append('targetId', targetId);

    const res = await fetch(`${API_BASE}/memories?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch memories');
    return res.json();
  },

  async createMemory(memory: Partial<MemoryRecord>): Promise<MemoryRecord> {
    const res = await fetch(`${API_BASE}/memories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memory),
    });
    if (!res.ok) throw new Error('Failed to create memory');
    return res.json();
  },

  async deleteMemory(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/memories/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete memory');
  },

  async sendCustomerSupportMessage(
    customerId: string,
    message: string,
    conversationHistory: any[] = [],
  ): Promise<{ reply: string; pipelineTrace: PipelineTrace; retrievedMemories: MemoryRecord[] }> {
    const res = await fetch(`${API_BASE}/support/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, message, conversationHistory }),
    });
    if (!res.ok) throw new Error('Failed to send support message');
    return res.json();
  },

  async analyzeInvoice(
    invoiceId?: string,
    invoiceData?: Partial<InvoiceRecord>,
  ): Promise<{
    invoice: InvoiceRecord;
    pipelineTrace: PipelineTrace;
    matchedMemories: MemoryRecord[];
    anomalies: string[];
    disputeDraft?: { to: string; subject: string; body: string } | null;
  }> {
    const res = await fetch(`${API_BASE}/ap/analyze-invoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId, invoiceData }),
    });
    if (!res.ok) throw new Error('Failed to analyze invoice');
    return res.json();
  },

  async getSettings(): Promise<SystemSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  async runOcr(sampleType: 'apex' | 'cloudscale'): Promise<{ success: boolean; ocrConfidence: number; parsedFields: any }> {
    const res = await fetch(`${API_BASE}/ocr/parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sampleType }),
    });
    if (!res.ok) throw new Error('Failed to parse OCR');
    return res.json();
  },
};
