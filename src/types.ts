export type UserRole = 'admin' | 'support_agent' | 'ap_manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export type MemoryCategory =
  | 'known_issue'
  | 'environment'
  | 'troubleshooting_step'
  | 'solution_worked'
  | 'escalation_history'
  | 'customer_sentiment'
  | 'communication_style'
  | 'vendor_terms'
  | 'common_discrepancy'
  | 'historical_exception'
  | 'approval_decision'
  | 'invoice_pattern'
  | 'previous_resolution';

export interface MemoryRecord {
  id: string;
  targetType: 'customer' | 'vendor';
  targetId: string;
  targetName: string;
  category: MemoryCategory;
  title: string;
  content: string;
  confidence: number; // 0.0 to 1.0
  importance: 'critical' | 'high' | 'medium' | 'low';
  keywords: string[];
  referenceId?: string; // ticketId or invoiceId
  createdAt: string;
  accessCount: number;
  lastRecalledAt?: string;
  similarityScore?: number; // computed during search
}

export interface CustomerProfile {
  id: string;
  name: string;
  tier: 'Enterprise' | 'Growth' | 'Standard';
  contactPerson: string;
  email: string;
  environment: {
    erpSystem: string;
    version: string;
    hosting: string;
    connectorVersion: string;
    integrations: string[];
  };
  sentiment: 'Frustrated' | 'Neutral' | 'Satisfied' | 'Advocate';
  frustrationScore: number; // 0 to 100
  communicationPreference: string;
  totalTickets: number;
  openTickets: number;
  createdAt: string;
}

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  createdAt: string;
  resolvedAt?: string;
  messages: Array<{
    id: string;
    sender: 'customer' | 'agent' | 'system';
    text: string;
    timestamp: string;
    memoryRetrieved?: MemoryRecord[];
    pipelineLog?: PipelineTrace;
  }>;
}

export interface VendorProfile {
  id: string;
  name: string;
  category: string;
  paymentTerms: string; // e.g. "Net 45", "2% 10 Net 30"
  contactEmail: string;
  trustScore: number; // 0 to 100
  totalInvoices: number;
  discrepancyRate: number; // percentage
  status: 'Active' | 'Review Required' | 'Restricted';
  typicalDiscrepancies: string[];
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  sku: string;
  quantity: number;
  poQuantity?: number;
  unitPrice: number;
  poUnitPrice?: number;
  total: number;
  discrepancy?: string;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  poNumber: string;
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  totalAmount: number;
  status: 'Pending Review' | 'On Hold' | 'Approved' | 'Flagged' | 'Paid';
  paymentTerms: string;
  lineItems: InvoiceLineItem[];
  detectedAnomalies: string[];
  matchedMemories: MemoryRecord[];
  aiReasoning?: string;
  ocrConfidence: number;
  notes?: string;
}

export interface PipelineTrace {
  id: string;
  timestamp: string;
  agentType: 'Customer Support' | 'Accounts Payable';
  currentInput: string;
  retrievedMemories: MemoryRecord[];
  historicalContext: string;
  aiReasoning: string;
  businessAction: {
    actionType: string;
    details: string;
    status: 'Executed' | 'Pending Human Confirmation';
  };
  newMemoryCreated?: MemoryRecord;
  durationMs: number;
}

export interface AiActivityItem {
  id: string;
  timestamp: string;
  agent: 'Customer Support' | 'Accounts Payable' | 'Memory Core';
  actionType:
    | 'Customer memory retrieved'
    | 'Previous solution identified'
    | 'Vendor discrepancy detected'
    | 'Invoice placed on hold'
    | 'Customer sentiment changed'
    | 'New memory created'
    | 'Memory consolidated'
    | 'Autonomous resolution executed';
  summary: string;
  targetName: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
  details?: Record<string, any>;
}

export interface SystemStats {
  customers: number;
  openTickets: number;
  escalated: number;
  invoices: number;
  pendingApproval: number;
  flagged: number;
  memoryRecords: number;
  retrievalAccuracy: number;
  hoursSaved: number;
}

export interface SystemSettings {
  llmProvider: 'gemini' | 'ollama' | 'openai';
  modelName: string;
  similarityThreshold: number;
  autoActionThreshold: number;
  memoryRetentionDays: number;
  autonomousTicketResolutions: boolean;
  autonomousInvoiceHolds: boolean;
}
