"""
MEMORA AI — Persistent Business Memory Agents
FastAPI Backend Reference Implementation
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from .models import CustomerQueryRequest, InvoiceAnalysisRequest
from .memory_engine import PersistentMemoryEngine

app = FastAPI(
    title="MEMORA AI — Persistent Business Memory Agents",
    description="Cognitive memory-first agent platform for Customer Support and AP",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

memory_engine = PersistentMemoryEngine()

@app.get("/")
def read_root():
    return {
        "platform": "MEMORA AI",
        "status": "ONLINE",
        "memory_engine": "ACTIVE",
        "vector_backend": "ChromaDB"
    }

@app.post("/api/support/query")
async def support_query(request: CustomerQueryRequest):
    # STEP 1: Current Input received
    # STEP 2: Memory Retrieval
    memories = memory_engine.retrieve_customer_memories(request.customer_id, request.message)
    
    # STEP 3: Historical Context compiled
    # STEP 4: AI Reasoning
    response_text = "I retrieved your previous incident history. Checking the authentication token cache..."
    
    # STEP 5 & 6: Action & New Memory
    return {
        "response": response_text,
        "retrieved_memories": memories,
        "action": "Triggered SAP connector status check"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
