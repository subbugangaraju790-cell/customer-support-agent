from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class MemoryRecordSchema(BaseModel):
    id: str
    target_type: str = Field(..., description="customer or vendor")
    target_id: str
    target_name: str
    category: str
    title: str
    content: str
    confidence: float = 0.95
    importance: str = "high"
    keywords: List[str] = []
    reference_id: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    access_count: int = 0

class CustomerQueryRequest(BaseModel):
    customer_id: str
    message: str
    conversation_history: Optional[List[Dict[str, Any]]] = []

class InvoiceAnalysisRequest(BaseModel):
    vendor_id: str
    invoice_number: str
    po_number: str
    line_items: List[Dict[str, Any]]
    total_amount: float

class PipelineTraceResponse(BaseModel):
    agent_type: str
    current_input: str
    retrieved_memories: List[Dict[str, Any]]
    historical_context: str
    ai_reasoning: str
    business_action: Dict[str, Any]
    new_memory_created: Optional[Dict[str, Any]] = None
    duration_ms: int
