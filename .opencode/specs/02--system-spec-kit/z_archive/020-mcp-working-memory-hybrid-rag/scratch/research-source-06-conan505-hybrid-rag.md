# Research Source 06: conan505/Hybrid-RAG

## 1) Executive summary

Hybrid-RAG is an early-stage Python/FastAPI RAG system that already implements document upload, async processing, semantic retrieval, reranking, and cost-aware LLM routing, but does not yet implement true hybrid retrieval (keyword + semantic fusion), despite naming and README claims. The codebase is practical and composable, with useful production-minded patterns (fallbacks, structured logging, service boundaries), while several TODOs and contract mismatches indicate MVP maturity rather than production readiness. [SOURCE: /tmp/conan505-hybrid-rag/README.md:22] [SOURCE: /tmp/conan505-hybrid-rag/app/api/routes/search.py:51] [SOURCE: /tmp/conan505-hybrid-rag/app/services/rag.py:97]

## 2) System architecture overview

- Backend entrypoint is FastAPI with startup/shutdown lifecycle and route mounting for health, documents, search, and chat. [SOURCE: /tmp/conan505-hybrid-rag/app/main.py:77]
- Core backend layers are organized into `api/routes` (transport), `services` (business logic), `models` (data structures/ORM), `storage` (external object storage), and `worker` (async ingestion pipeline). [SOURCE: /tmp/conan505-hybrid-rag/README.md:84] [SOURCE: /tmp/conan505-hybrid-rag/app/worker/processor.py:1]
- Data plane spans Postgres (metadata/chunks), R2 (files), and Qdrant (vectors), with Cohere for embeddings/rerank and Groq/Gemini for generation. [SOURCE: /tmp/conan505-hybrid-rag/.env.example:16] [SOURCE: /tmp/conan505-hybrid-rag/app/services/vector_store.py:1] [SOURCE: /tmp/conan505-hybrid-rag/app/services/llm/router.py:1]
- Frontend (Next.js) uses typed API helpers and SSE streaming against `/api/v1/chat` and `/api/v1/query`. [SOURCE: /tmp/conan505-hybrid-rag/frontend/src/lib/api.ts:10] [SOURCE: /tmp/conan505-hybrid-rag/frontend/src/lib/api.ts:123]

## 3) Core logic flows and data structures

### Ingestion flow

1. Upload endpoint validates MIME/size plus cloud-cost guardrails (max docs/storage).
2. File stored in R2 (or local fake key fallback).
3. Document record created with `pending` status.
4. Processing endpoint schedules background task.
5. Worker transitions status -> extracts text -> chunks -> embeds -> upserts vectors -> marks completed/failed.

[SOURCE: /tmp/conan505-hybrid-rag/app/api/routes/documents.py:69] [SOURCE: /tmp/conan505-hybrid-rag/app/api/routes/documents.py:120] [SOURCE: /tmp/conan505-hybrid-rag/app/api/routes/documents.py:281] [SOURCE: /tmp/conan505-hybrid-rag/app/worker/processor.py:46] [SOURCE: /tmp/conan505-hybrid-rag/app/worker/processor.py:64] [SOURCE: /tmp/conan505-hybrid-rag/app/worker/processor.py:115]

### Retrieval and answer flow

1. Query endpoint calls semantic search service.
2. Search service generates query embedding, queries Qdrant, converts hits, reranks top results.
3. RAG service builds context string with a char cap.
4. LLM router picks provider by complexity heuristics + API key availability.
5. Chat endpoint returns streaming SSE chunks or non-streamed response.

[SOURCE: /tmp/conan505-hybrid-rag/app/api/routes/search.py:55] [SOURCE: /tmp/conan505-hybrid-rag/app/services/search.py:24] [SOURCE: /tmp/conan505-hybrid-rag/app/services/rag.py:55] [SOURCE: /tmp/conan505-hybrid-rag/app/services/llm/router.py:53] [SOURCE: /tmp/conan505-hybrid-rag/app/api/routes/chat.py:78]

### Primary data structures

- `Document` and `DocumentChunk` SQLAlchemy models persist ingestion state and searchable chunk text.
- `SearchResult` dataclass standardizes retrieval objects across search/rerank/RAG.
- `RoutingDecision` and `RAGResponse` capture model-choice telemetry and token usage.

[SOURCE: /tmp/conan505-hybrid-rag/app/models/document.py:31] [SOURCE: /tmp/conan505-hybrid-rag/app/models/document.py:94] [SOURCE: /tmp/conan505-hybrid-rag/app/models/search.py:11] [SOURCE: /tmp/conan505-hybrid-rag/app/services/llm/router.py:44] [SOURCE: /tmp/conan505-hybrid-rag/app/services/rag.py:42]

## 4) Integration mechanisms

- Environment-driven settings via Pydantic Settings with cached singleton access. [SOURCE: /tmp/conan505-hybrid-rag/app/config.py:9] [SOURCE: /tmp/conan505-hybrid-rag/app/config.py:80]
- Cloudflare R2 integrated via S3-compatible boto3 client and generated date-partitioned keys. [SOURCE: /tmp/conan505-hybrid-rag/app/storage/r2.py:19] [SOURCE: /tmp/conan505-hybrid-rag/app/storage/r2.py:50]
- Qdrant integration includes collection auto-create and payload index on `document_id`; chunk IDs mapped to deterministic UUIDv5 for vector IDs. [SOURCE: /tmp/conan505-hybrid-rag/app/services/vector_store.py:54] [SOURCE: /tmp/conan505-hybrid-rag/app/services/vector_store.py:79] [SOURCE: /tmp/conan505-hybrid-rag/app/services/vector_store.py:116]
- Cohere embeddings/rerank and Groq/Gemini generation are encapsulated in service adapters with fallback behavior when keys are absent. [SOURCE: /tmp/conan505-hybrid-rag/app/services/embeddings.py:23] [SOURCE: /tmp/conan505-hybrid-rag/app/services/reranker.py:46] [SOURCE: /tmp/conan505-hybrid-rag/app/services/llm/router.py:111]

## 5) Design patterns/architectural decisions

- Service-layer separation keeps API routes thin and business logic testable/reusable. [SOURCE: /tmp/conan505-hybrid-rag/app/api/routes/chat.py:57] [SOURCE: /tmp/conan505-hybrid-rag/app/services/rag.py:76]
- Progressive degradation is explicit: mock embeddings, in-memory Qdrant, local R2 key fallback. [SOURCE: /tmp/conan505-hybrid-rag/app/services/search.py:50] [SOURCE: /tmp/conan505-hybrid-rag/app/services/vector_store.py:47] [SOURCE: /tmp/conan505-hybrid-rag/app/api/routes/documents.py:129]
- Async orchestration around sync SDKs prioritizes delivery speed over maximal throughput (documented in code comments). [SOURCE: /tmp/conan505-hybrid-rag/app/storage/r2.py:84] [SOURCE: /tmp/conan505-hybrid-rag/app/services/document_processor.py:49]
- Cost control is elevated to first-class logic (query complexity routing + upload/storage limits). [SOURCE: /tmp/conan505-hybrid-rag/app/services/llm/router.py:53] [SOURCE: /tmp/conan505-hybrid-rag/app/api/routes/documents.py:22]

## 6) Technical dependencies/requirements

- Python >=3.11, FastAPI/Uvicorn, SQLAlchemy async, asyncpg, Pydantic v2 settings. [SOURCE: /tmp/conan505-hybrid-rag/pyproject.toml:7] [SOURCE: /tmp/conan505-hybrid-rag/pyproject.toml:22]
- AI/retrieval stack: Cohere, Groq, Google Gemini SDK, qdrant-client, PyMuPDF. [SOURCE: /tmp/conan505-hybrid-rag/pyproject.toml:40] [SOURCE: /tmp/conan505-hybrid-rag/pyproject.toml:46]
- Required runtime envs: database, R2, Qdrant, and API keys for embedding/LLM providers. [SOURCE: /tmp/conan505-hybrid-rag/.env.example:13]
- Frontend dependency path: Next.js app configured to hit backend `NEXT_PUBLIC_API_URL` with `/api/v1` prefix. [SOURCE: /tmp/conan505-hybrid-rag/frontend/src/lib/api.ts:10]

## 7) Current limitations/constraints

- Claimed hybrid search is not implemented; keyword endpoint is 501 and search type still `semantic`. [SOURCE: /tmp/conan505-hybrid-rag/app/api/routes/search.py:45] [SOURCE: /tmp/conan505-hybrid-rag/app/api/routes/search.py:142]
- RAG path currently invokes semantic search only and carries TODO for hybrid expansion. [SOURCE: /tmp/conan505-hybrid-rag/app/services/rag.py:97]
- README architecture and roadmap are partially stale/inconsistent (e.g., diagram says "Go API Server" while actual code is Python FastAPI). [SOURCE: /tmp/conan505-hybrid-rag/README.md:41] [SOURCE: /tmp/conan505-hybrid-rag/app/main.py:1]
- Cleanup and health checks are incomplete (R2/Qdrant delete TODOs, detailed health pending checks). [SOURCE: /tmp/conan505-hybrid-rag/app/api/routes/documents.py:224] [SOURCE: /tmp/conan505-hybrid-rag/app/api/routes/health.py:60]
- Default CORS production origin is placeholder, requiring deployment hardening. [SOURCE: /tmp/conan505-hybrid-rag/app/main.py:93]

## 8) Key learnings for TARGET_SYSTEM_DESCRIPTION=system-spec-kit + Spec Kit Memory MCP

- Preserve strict interface boundaries: keep transport (MCP/API) thin and delegate ranking/retrieval/routing decisions to service modules; this improves testability and future provider swaps. [SOURCE: /tmp/conan505-hybrid-rag/app/api/routes/chat.py:57] [SOURCE: /tmp/conan505-hybrid-rag/app/services/llm/router.py:147]
- Treat graceful degradation as a designed feature: explicit local/mock fallbacks can unblock development, but must be labeled and measured so they do not mask production readiness gaps. [SOURCE: /tmp/conan505-hybrid-rag/app/services/search.py:53] [SOURCE: /tmp/conan505-hybrid-rag/app/services/vector_store.py:48]
- Keep IDs deterministic across stores: UUIDv5 mapping from logical IDs avoids cross-system drift and simplifies traceability/debugging. [SOURCE: /tmp/conan505-hybrid-rag/app/services/vector_store.py:116]
- External docs must continuously reflect code truth; stale architecture claims materially degrade research quality and onboarding accuracy. [SOURCE: /tmp/conan505-hybrid-rag/README.md:41] [SOURCE: /tmp/conan505-hybrid-rag/app/main.py:77]
- Define "hybrid" behavior in executable code, not API labels; avoid semantic mismatch between naming and implementation. [SOURCE: /tmp/conan505-hybrid-rag/app/api/routes/search.py:31] [SOURCE: /tmp/conan505-hybrid-rag/app/api/routes/search.py:142]

## 9) Concrete code references

- App bootstrap and router registration: `/tmp/conan505-hybrid-rag/app/main.py:77`
- Upload + cost guardrails: `/tmp/conan505-hybrid-rag/app/api/routes/documents.py:69`
- Background processing trigger: `/tmp/conan505-hybrid-rag/app/api/routes/documents.py:281`
- Worker orchestration (extract/chunk/embed/upsert): `/tmp/conan505-hybrid-rag/app/worker/processor.py:64`
- Semantic retrieval + rerank: `/tmp/conan505-hybrid-rag/app/services/search.py:24`
- RAG context assembly + generation: `/tmp/conan505-hybrid-rag/app/services/rag.py:55`
- LLM routing heuristics: `/tmp/conan505-hybrid-rag/app/services/llm/router.py:53`
- Qdrant collection/index and deterministic IDs: `/tmp/conan505-hybrid-rag/app/services/vector_store.py:54`
- R2 integration: `/tmp/conan505-hybrid-rag/app/storage/r2.py:19`
- Unimplemented keyword search marker: `/tmp/conan505-hybrid-rag/app/api/routes/search.py:142`

## 10) [Assumes: X] + confidence

- [Assumes] Analysis is based on default branch snapshot cloned on 2026-02-19 and excludes any unmerged/private branches or external infra configs.
- [Assumes] README statements are treated as intended design, while code is treated as source of truth for implementation status.
- Confidence: 91/100
