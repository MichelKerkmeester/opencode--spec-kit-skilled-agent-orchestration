# Research Source 07: gwyer/hybrid-rag-project

## 1) Executive summary

This repository implements a local-first hybrid RAG stack that combines semantic retrieval (Chroma + embeddings) and lexical retrieval (BM25), then exposes that capability through both a REST API and a stdio MCP server for Claude integration. The system is notable for (a) document-type-aware retrieval paths (structured CSV vs text-like docs), (b) async ingestion progress telemetry, and (c) explicit structured-data tools alongside free-form RAG querying. For Spec Kit Memory MCP, the most relevant ideas are: separation of retrieval modes by content type, explicit workflow state tracking, and tool-level contracts that enforce task boundaries.  
[SOURCE: README.md:7] [SOURCE: src/hybrid_rag/hybrid_retriever.py:14] [SOURCE: scripts/mcp/server_claude.py:289]

## 2) System architecture overview

- Ingestion layer: `DocumentLoaderUtility` loads `.txt/.pdf/.md/.docx/.csv`, chunks text-like files, and tags metadata (`source_file`, `file_type`, `doc_category`).  
  [SOURCE: src/hybrid_rag/document_loader.py:39] [SOURCE: src/hybrid_rag/document_loader.py:111]
- Retrieval layer: either classic hybrid ensemble (vector + BM25) or a document-type-aware retriever that runs separate pipelines and reweights merged results.  
  [SOURCE: scripts/mcp/server_claude.py:116] [SOURCE: src/hybrid_rag/hybrid_retriever.py:108]
- Generation layer: LangChain retrieval chain with prompt-constrained answers over retrieved context using local Ollama models.  
  [SOURCE: scripts/mcp/server.py:141] [SOURCE: scripts/mcp/server_claude.py:141]
- Integration layer: FastAPI endpoints (`/ingest`, `/query`, `/status`) and MCP tools (`ingest_documents`, `get_ingestion_status`, `query_documents`, structured dataset tools).  
  [SOURCE: scripts/mcp/server.py:169] [SOURCE: scripts/mcp/server_claude.py:293]

## 3) Core logic flows and data structures

### Ingestion flow

1. Load config and initialize embedding + LLM clients.  
   [SOURCE: scripts/mcp/server_claude.py:73]
2. Resolve relative data path to absolute, instantiate loader, stream progress callbacks.  
   [SOURCE: scripts/mcp/server_claude.py:183] [SOURCE: scripts/mcp/server_claude.py:191]
3. Loader scans files, per-extension parsing, chunking for text-like docs, metadata tagging including `doc_category`.  
   [SOURCE: src/hybrid_rag/document_loader.py:86] [SOURCE: src/hybrid_rag/document_loader.py:119]
4. Build vector store and retriever graph; set ingestion state to completed/failed.  
   [SOURCE: scripts/mcp/server_claude.py:109] [SOURCE: scripts/mcp/server_claude.py:213]

### Query flow

1. MCP tool handler receives `query_documents`.  
   [SOURCE: scripts/mcp/server_claude.py:464]
2. Guard: fail fast if `rag_chain` is not initialized.  
   [SOURCE: scripts/mcp/server_claude.py:253]
3. Execute retrieval+generation chain with `{input: query}`.  
   [SOURCE: scripts/mcp/server_claude.py:261]
4. Return answer plus bounded context snippets and source metadata.  
   [SOURCE: scripts/mcp/server_claude.py:263]

### Key data structures

- `ingestion_status` dict: `{status, progress, current_file, files_processed, total_files, documents_loaded, error_message, stage}` enables observable long-running work.  
  [SOURCE: scripts/mcp/server_claude.py:60]
- `Document.metadata` enriched with `source_file`, `file_type`, `doc_category`, and runtime retrieval fields (`retrieval_score`, `retrieval_source`).  
  [SOURCE: src/hybrid_rag/document_loader.py:117] [SOURCE: src/hybrid_rag/hybrid_retriever.py:90]
- `StructuredQueryEngine.dataframes` map dataset names to in-memory pandas frames for deterministic table operations.  
  [SOURCE: src/hybrid_rag/structured_query.py:22]

## 4) Integration mechanisms

- MCP server over stdio (`mcp.server`, `stdio_server`) with explicit tool registration and per-tool input schemas; this is a strong contract boundary for agent integrations.  
  [SOURCE: scripts/mcp/server_claude.py:14] [SOURCE: scripts/mcp/server_claude.py:289]
- FastAPI service for non-MCP integrations exposes ingestion/query/status endpoints and Pydantic request/response models.  
  [SOURCE: scripts/mcp/server.py:10] [SOURCE: scripts/mcp/server.py:39]
- Configuration-driven behavior (`config.yaml`) controls model choice, retrieval depth (`k`), weighting, and feature flags (separate retrievers).  
  [SOURCE: config/config.yaml:20] [SOURCE: config/config.yaml:34]
- Structured-data path is integrated as first-class tools (`list_datasets`, `count_by_field`, `filter_dataset`, `get_dataset_stats`) rather than forcing all requests through generative QA.  
  [SOURCE: scripts/mcp/server_claude.py:342] [SOURCE: scripts/mcp/server_claude.py:518]

## 5) Design patterns/architectural decisions

- **Hybrid retrieval composition:** Ensemble of dense+lexical retrievers for robustness across synonym-heavy and exact-token queries.  
  [SOURCE: scripts/mcp/server.py:136]
- **Content-type specialization:** Separate CSV/text retrieval with weighted fusion instead of one universal retriever.  
  [SOURCE: src/hybrid_rag/hybrid_retriever.py:124]
- **Feature-flagged migration path:** `use_separate_retrievers` toggles advanced behavior while preserving backward-compatible baseline.  
  [SOURCE: scripts/mcp/server_claude.py:116]
- **Observable async orchestration:** background task + progress callback + staged status model (`loading_files`, `building_index`, `completed`).  
  [SOURCE: scripts/mcp/server_claude.py:166] [SOURCE: scripts/mcp/server_claude.py:180]
- **Contract-first tooling:** MCP `Tool` definitions with strict input schemas reduce ambiguity at integration boundaries.  
  [SOURCE: scripts/mcp/server_claude.py:293]

## 6) Technical dependencies/requirements

- Runtime: Python 3.9+ with local Ollama endpoint (`http://localhost:11434`) and models (`nomic-embed-text`, `llama3.1:latest`).  
  [SOURCE: README.md:76] [SOURCE: config/config.yaml:5]
- Retrieval stack: LangChain family + Chroma + rank-bm25 + Ollama adapters.  
  [SOURCE: requirements.txt:1] [SOURCE: requirements.txt:6]
- Integration stack: FastAPI/Uvicorn/Pydantic for HTTP, `mcp` package for stdio tool server.  
  [SOURCE: requirements.txt:7] [SOURCE: requirements.txt:16]
- Structured querying: pandas-backed CSV operations.  
  [SOURCE: requirements.txt:17] [SOURCE: src/hybrid_rag/structured_query.py:5]

## 7) Current limitations/constraints

- State is process-local globals (`rag_chain`, `documents`, `ingestion_status`), which limits multi-tenant isolation and horizontal scaling.  
  [SOURCE: scripts/mcp/server_claude.py:51] [SOURCE: scripts/mcp/server_claude.py:60]
- No explicit auth/authorization in REST/MCP surfaces; local-trust model assumed.  
  [SOURCE: scripts/mcp/server.py:159] [SOURCE: scripts/mcp/server_claude.py:420]
- Structured query helpers use substring matching (`str.contains`) and in-memory frames; accuracy and memory behavior may degrade at larger enterprise scale.  
  [SOURCE: src/hybrid_rag/structured_query.py:77] [SOURCE: src/hybrid_rag/structured_query.py:22]
- Query preprocessing module exists but is not clearly wired into live server query path, indicating partial/optional feature integration.  
  [SOURCE: src/hybrid_rag/query_preprocessor.py:103] [SOURCE: scripts/mcp/server_claude.py:249]
- Reliability strategy is test-script-driven rather than policy-enforced at runtime.  
  [SOURCE: tests/test_rag_boundaries.py:40] [SOURCE: tests/test_reliability_score.py:36]

## 8) Key learnings for TARGET_SYSTEM_DESCRIPTION=system-spec-kit + Spec Kit Memory MCP

1. **Introduce retrieval mode partitioning by artifact type:** Spec docs, checklist/task state, and memory notes should not share a single retrieval policy; weighting by artifact class can improve precision.  
   Analogy from repo: CSV vs text split and weighted merge.  
   [SOURCE: src/hybrid_rag/hybrid_retriever.py:125]
2. **Persist explicit workflow-state telemetry:** A canonical status object (`stage`, `progress`, `error_message`) helps agents safely coordinate async or long-running operations (e.g., indexing, validation, migration).  
   [SOURCE: scripts/mcp/server_claude.py:60]
3. **Prefer tool-specialization over overloading one semantic query tool:** Structured operations (count/filter/stats) should remain deterministic tools; avoid routing these through generative retrieval where exactness matters.  
   [SOURCE: scripts/mcp/server_claude.py:342] [SOURCE: src/hybrid_rag/structured_query.py:50]
4. **Use feature flags for architectural upgrades:** Keep old retrieval path available during rollout; improves safety for production memory systems.  
   [SOURCE: scripts/mcp/server_claude.py:116]
5. **Carry metadata through the full path:** Source/type/category/retrieval-score metadata enables explainability and downstream scoring/reranking for memory relevance audits.  
   [SOURCE: src/hybrid_rag/document_loader.py:117] [SOURCE: src/hybrid_rag/hybrid_retriever.py:90]

## 9) Concrete code references

- `src/hybrid_rag/document_loader.py:19` - multi-format loader + chunking + metadata tagging.
- `src/hybrid_rag/hybrid_retriever.py:14` - `DocumentTypeAwareRetriever` and weighted merge logic.
- `src/hybrid_rag/hybrid_retriever.py:108` - factory building text/CSV split retrievers.
- `src/hybrid_rag/structured_query.py:11` - pandas-backed structured query engine.
- `scripts/mcp/server_claude.py:60` - ingestion state model.
- `scripts/mcp/server_claude.py:166` - async ingestion orchestration.
- `scripts/mcp/server_claude.py:289` - MCP tool catalog and contracts.
- `scripts/mcp/server.py:169` - REST `/ingest` and RAG chain construction path.
- `config/config.yaml:34` - feature flag + retriever weighting parameters.
- `tests/test_rag_boundaries.py:83` - strict anti-hallucination prompt/testing baseline.

## 10) [Assumes: X] + confidence

- **Assumes:** analysis is based on repository `main` at time of retrieval and static code inspection only (no runtime execution with Ollama, no benchmark re-validation).
- **Assumes:** architecture docs include illustrative examples that may not be byte-for-byte runtime behavior; source code was treated as authoritative when discrepancies appear.
- **Assumes:** mapping to Spec Kit Memory MCP is pattern-transfer analysis, not a claim of direct drop-in compatibility.
- **Confidence:** 84/100.
