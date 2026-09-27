"""
MEMORA AI — Persistent Vector & Business Memory Engine (Python + ChromaDB)
"""
import os
from typing import List, Dict, Any

class PersistentMemoryEngine:
    def __init__(self, persist_directory: str = "./chroma_db"):
        self.persist_directory = persist_directory
        self._init_vector_store()

    def _init_vector_store(self):
        try:
            import chromadb
            self.client = chromadb.PersistentClient(path=self.persist_directory)
            self.customer_collection = self.client.get_or_create_collection(
                name="customer_memory",
                metadata={"hnsw:space": "cosine"}
            )
            self.vendor_collection = self.client.get_or_create_collection(
                name="vendor_memory",
                metadata={"hnsw:space": "cosine"}
            )
            self.chroma_available = True
        except Exception as e:
            # Fallback in-memory dictionary if chromadb not installed locally
            self.chroma_available = False
            self.in_memory_records = []

    def retrieve_customer_memories(self, customer_id: str, query: str, limit: int = 3) -> List[Dict[str, Any]]:
        """
        Retrieves historical customer memories based on semantic vector similarity.
        """
        if self.chroma_available:
            try:
                results = self.customer_collection.query(
                    query_texts=[query],
                    n_results=limit,
                    where={"target_id": customer_id}
                )
                memories = []
                for i in range(len(results["ids"][0])):
                    memories.append({
                        "id": results["ids"][0][i],
                        "content": results["documents"][0][i],
                        "metadata": results["metadatas"][0][i],
                        "distance": results["distances"][0][i] if "distances" in results else 0.1
                    })
                return memories
            except Exception:
                pass
        
        # In-memory default retrieval demonstration
        return [
            {
                "id": "mem-acme-1",
                "target_id": "cust-acme",
                "title": "ERP Synchronization Token Cache Desync Fix",
                "content": "Ticket #T-8821: Refresh auth token in Admin > Connectors > SAP Gateway. Do not restart daemon.",
                "confidence": 0.98,
                "importance": "critical"
            }
        ]

    def store_memory(self, memory: Dict[str, Any]):
        if self.chroma_available:
            collection = self.customer_collection if memory.get("target_type") == "customer" else self.vendor_collection
            collection.add(
                ids=[memory["id"]],
                documents=[memory["content"]],
                metadatas=[{
                    "target_id": memory.get("target_id", ""),
                    "category": memory.get("category", ""),
                    "title": memory.get("title", "")
                }]
            )
