# Updated Synthesis: Cross-AI Recommendations vs. Current Feature Catalog (Deduplicated)

## Methodology

This update keeps the original synthesis scope (the same 16 recommendations across Tier 1/2/3), then cross-references each recommendation against:

1. `feature_catalog.md` (system-of-record for implemented capabilities and deferrals)
2. `summary_of_new_features.md` (023 implementation delta log)

Status labels used:

- **ALREADY IMPLEMENTED**
- **PARTIALLY IMPLEMENTED**
- **NOT YET IMPLEMENTED**
- **PLANNED/DEFERRED**
- **UNCLEAR — needs verification** (used when docs are suggestive but not explicit)

Consensus scores and agent attribution from the original synthesis are preserved below.

---

## Executive Summary

Most recommendations are no longer net-new.

- **Fully implemented:** 3/16
- **Partially implemented:** 9/16
- **Not yet implemented:** 4/16
- **Planned/deferred (explicitly):** 0/16 (for this recommendation set)

The strongest outcome from this review is that the 023 refinement already delivered the core architecture many recommendations asked for: hybrid retrieval pipeline, graph-aware retrieval, and spec-hierarchy contexting.  
What remains is mostly **productization and interface completion**: MCP contract cleanup, async job APIs, richer provenance envelopes, daemon/watcher ops, and a few innovation items.

---

## Tier 1: Remaining High-Impact Gaps

### 1. MCP contract completion (from original 1.3, consensus 5/6)

**Status:** PARTIALLY IMPLEMENTED  
**What exists:** Broad MCP tool surface already split by function (`memory_search`, `memory_context`, `memory_list`, `memory_health`, `memory_index_scan`, mutation tools, lifecycle tools), plus schema hardening improvements (e.g., Phase 017 “Schema params exposed #13”).  
**Evidence:** `memory_search` / `memory_context` / `memory_list` sections; Phase 017 schema hardening; preflight validation and strict parameter handling.  
**Remaining gap:** Finish explicit intent-split retrieval contract pattern (`query/get/multi_get/status`) and contract versioning semantics at tool level.

### 2. Async ingestion jobs with status/cancel APIs (from original 2.1, consensus 3/6)

**Status:** PARTIALLY IMPLEMENTED  
**What exists:** `memory_save` supports `asyncEmbedding` and pending embeddings; `memory_index_scan` supports incremental indexing/retry behavior.  
**Evidence:** `memory_save` async embedding path; `memory_index_scan` maintenance flow.  
**Remaining gap:** Add explicit long-running job API (`start/status/cancel`) with job IDs, progress states, and timeout-safe orchestration.

### 3. Provenance-complete structured retrieval envelopes (from original 1.5, consensus 4–5/6)

**Status:** PARTIALLY IMPLEMENTED (**UNCLEAR on some fields**)  
**What exists:** Rich pipeline metadata exists (anchor metadata S2, validation metadata S3, stage scoring, filtering annotations).  
**Evidence:** S2 Template anchor optimization; S3 Validation metadata; R6 stage architecture.  
**Remaining gap:** Guarantee stable, documented envelope fields in tool responses for:
- source file + section/line provenance
- score breakdown by channel/stage
- retrieval trace (`channels_run`, `fallback_reason`, etc.)

**UNCLEAR — needs verification:** Whether line-level provenance (`line_start`) and full trace fields are consistently emitted by public MCP responses.

### 4. Session continuity “snapshot” primitive (from original 2.7, consensus 2/6)

**Status:** PARTIALLY IMPLEMENTED  
**What exists:** Resume mode, auto-resume, working memory, session dedup, and contextual carry-forward.  
**Evidence:** `memory_context` resume mode + `SPECKIT_AUTO_RESUME`; session manager + working memory features.  
**Remaining gap:** Add explicit `memory_continue`-style structured output (`state`, `decisions`, `next_steps`, `open_risks`, `evidence_refs`) as a first-class tool.

---

## Tier 2: Important But Secondary Gaps

### 5. Hybrid strategy formalization (from original 1.1, consensus 6/6)

**Status:** PARTIALLY IMPLEMENTED  
**What exists:** Full multi-channel hybrid retrieval with adaptive fusion, RRF, query complexity routing, expansion, fallback tiers.  
**Evidence:** Hybrid search pipeline; R6 4-stage pipeline; R15/R12/R2/R15-ext/FUT-7 features.  
**Remaining gap:** Formalize a clear external strategy registry/contract and deterministic strategy explainability in responses (why a path was chosen).

### 6. Local reranker hardening (from original 2.2, consensus 3/6)

**Status:** PARTIALLY IMPLEMENTED  
**What exists:** Cross-encoder reranking and local reranker path (`RERANKER_LOCAL`) are present.  
**Evidence:** `SPECKIT_CROSS_ENCODER`; environment reference for `RERANKER_LOCAL`; Stage 3 reranking.  
**Remaining gap:** Productize local GGUF path and resource governance (VRAM checks, automatic fallback strategy, performance guardrails).

**UNCLEAR — needs verification:** Whether current local reranker implementation is GGUF/`node-llama-cpp` equivalent versus other local provider wiring.

### 7. Warm daemon / multi-transport runtime (from original 2.3, consensus 3–4/6)

**Status:** NOT YET IMPLEMENTED  
**What exists:** Startup behavior controls (`SPECKIT_LAZY_LOADING`, `SPECKIT_EAGER_WARMUP`) but no documented HTTP/SSE daemon mode.  
**Evidence:** Feature flag reference for loading behavior.  
**Remaining gap:** Implement daemonized runtime with transport matrix (`stdio`, `http`, optional `sse`) and health endpoint semantics outside MCP tool calls.

### 8. Real-time filesystem watcher for auto re-index (from original 3.3, consensus 1/6 unique)

**Status:** NOT YET IMPLEMENTED  
**What exists:** `memory_index_scan` sync workflow and robust incremental indexing.  
**Evidence:** `memory_index_scan` maintenance section.  
**Remaining gap:** Add watch mode (debounced change detection + targeted re-index + lock/backoff policy).

### 9. AST-level section retrieval / heading-granular reads (from original 3.2, consensus 1/6 unique)

**Status:** PARTIALLY IMPLEMENTED  
**What exists:** Chunking, anchor-aware chunk thinning, anchor metadata extraction, chunk order preservation.  
**Evidence:** R7/S2/B2 sections.  
**Remaining gap:** Add explicit heading/section retrieval APIs (e.g., `read_spec_section`) based on Markdown AST boundaries.

---

## Tier 3: Innovation / Structural Optional Work

### 10. Backend adapter abstraction (from original 2.4, consensus 3/6)

**Status:** PARTIALLY IMPLEMENTED  
**What exists:** Some provider and storage abstraction patterns already exist (embedding providers, vector index internals, configurable DB paths).  
**Evidence:** embedding/provider config sections; vector/store modularity references.  
**Remaining gap:** Formalize top-level storage interfaces (`IVectorStore`, `IGraphStore`, `IDocumentStore`) with clean swap boundaries.

### 11. Namespace management primitives (from original 2.6, consensus 2/6)

**Status:** NOT YET IMPLEMENTED  
**What exists:** Spec-folder scoping and DB path configuration, but no explicit namespace CRUD/switch tooling.  
**Evidence:** `memory_search`/`memory_list` scoping + DB env options.  
**Remaining gap:** Add namespace lifecycle APIs and isolation semantics.

### 12. ANCHOR tags as graph node resolver (from original 3.1, consensus 1/6 unique)

**Status:** PARTIALLY IMPLEMENTED  
**What exists:** Anchor parsing and semantic anchor typing (S2), plus graph infrastructure and entity linking.  
**Evidence:** S2 Template anchor optimization; graph + causal tooling.  
**Remaining gap:** Promote anchor classes into typed graph nodes/edges automatically at ingestion.

### 13. Dynamic startup instructions from live memory inventory (from original 3.4, consensus 1/6 unique)

**Status:** NOT YET IMPLEMENTED  
**What exists:** Strong retrieval+stats tools exist, but no startup instruction synthesis flow is documented.  
**Evidence:** `memory_stats`, `memory_health`, but no init-instruction builder feature.  
**Remaining gap:** Generate concise runtime instruction payload at server init (coverage, staleness, hot folders, etc.).

---

## Implementation Roadmap (Net-New Only)

### Phase 1 (1–2 weeks): Contract + Continuity Foundations
- Finalize MCP retrieval contract split and versioning (Tier 1 #1)
- Add structured session continuity snapshot tool (Tier 1 #4)
- Define canonical response envelope schema with provenance/trace requirements (Tier 1 #3, schema only)

### Phase 2 (2–4 weeks): Operational Reliability
- Implement async ingestion jobs (`start/status/cancel`) with progress state machine (Tier 1 #2)
- Add filesystem watch mode with debounce and write-lock-safe retry policy (Tier 2 #8)
- Add daemon runtime mode + transport options + lifecycle docs (Tier 2 #7)

### Phase 3 (2–4 weeks): Retrieval Productization
- Complete hybrid strategy explainability contract (Tier 2 #5)
- Productize local reranker controls (resource checks/fallbacks) (Tier 2 #6)
- Add section/heading retrieval endpoint over AST chunk index (Tier 2 #9)

### Phase 4 (optional/ongoing): Architecture Extensions
- Storage adapter interfaces (Tier 3 #10)
- Namespace APIs (Tier 3 #11)
- Anchor-to-graph node automation (Tier 3 #12)
- Dynamic startup instruction synthesis (Tier 3 #13)

---

## Risks & Considerations (Updated)

1. **Scope confusion risk:** Since much is already implemented, remaining work is easy to over-scope into refactors. Keep changes contract-focused.
2. **Backward compatibility risk:** Tool contract cleanup must preserve existing callers; versioning and aliases are mandatory.
3. **Operational contention risk:** Watcher + async jobs can increase SQLite contention; WAL/retry strategy must be part of design.
4. **Observability risk:** New async/daemon paths need first-class telemetry, or debugging will regress.
5. **Performance risk:** AST-sectioning and local reranking should be benchmark-gated and fall back cleanly.

---

## Implementation Gap Analysis

| Original Recommendation | Original Tier | Consensus | Status | Evidence from Catalog/Summary | Net-New Gap |
|---|---|---:|---|---|---|
| 1.1 Hybrid multi-strategy retrieval | Tier 1 | 6/6 | PARTIALLY IMPLEMENTED | Hybrid pipeline + R6 4-stage + R15/R12/R2/RRF/fallback | External strategy registry + explainability contract |
| 1.2 SQLite graph overlay | Tier 1 | 5/6 | ALREADY IMPLEMENTED | Causal graph tools (`memory_causal_link/stats/unlink/drift_why`), graph channels, N2/S5/R10 | None |
| 1.3 MCP tool contract redesign | Tier 1 | 5/6 | PARTIALLY IMPLEMENTED | Broad tool split + schema hardening (#13) + validation layers | Intent-clean retrieval contract and versioning polish |
| 1.4 Contextual trees for hierarchy | Tier 1 | 4/6 | ALREADY IMPLEMENTED | S4 Spec folder hierarchy retrieval + PI-B3 description discovery + hierarchy cache | None |
| 1.5 Source-rich structured provenance | Tier 1 | 4–5/6 | PARTIALLY IMPLEMENTED (UNCLEAR on some fields) | S2/S3 metadata + stage scoring model | Standardize trace/provenance envelope fields and guarantees |
| 2.1 Async ingestion + job status | Tier 2 | 3/6 | PARTIALLY IMPLEMENTED | `memory_save asyncEmbedding`, pending embeddings, scan retry behavior | Job lifecycle API with IDs/progress/cancel |
| 2.2 Local GGUF reranking | Tier 2 | 3/6 | PARTIALLY IMPLEMENTED | Stage 3 cross-encoder + `RERANKER_LOCAL` path | GGUF-specific productization + resource governance |
| 2.3 Warm daemon / multi-transport | Tier 2 | 3–4/6 | NOT YET IMPLEMENTED | Only warmup/loading flags documented; no daemon/HTTP/SSE feature | Add daemon runtime + transport matrix |
| 2.4 Backend adapter abstraction | Tier 2 | 3/6 | PARTIALLY IMPLEMENTED | Provider/storage modularity exists in parts | Formal top-level store interfaces |
| 2.5 Metadata-first querying | Tier 2 | 2/6 | ALREADY IMPLEMENTED | `memory_list` metadata browsing + optional content inclusion patterns | None |
| 2.6 Namespace/database management | Tier 2 | 2/6 | NOT YET IMPLEMENTED | Folder scoping + DB config exist, but no namespace CRUD APIs | Add namespace lifecycle tools |
| 2.7 Session continuity primitives | Tier 2 | 2/6 | PARTIALLY IMPLEMENTED | Resume mode, auto-resume, working memory, session dedup | Dedicated structured continuity snapshot tool |
| 3.1 ANCHOR tags as graph nodes | Tier 3 | 1/6 | PARTIALLY IMPLEMENTED | S2 anchor parsing + graph infra present | Automatic anchor-type → graph-node mapping |
| 3.2 Smart markdown chunking at AST level | Tier 3 | 1/6 | PARTIALLY IMPLEMENTED | R7 chunk thinning + S2 anchor metadata + B2 ordering | Heading/AST section-level retrieval API |
| 3.3 Real-time filesystem watching | Tier 3 | 1/6 | NOT YET IMPLEMENTED | `memory_index_scan` exists (pull-based sync) | Push/watch indexing mode |
| 3.4 Dynamic server init instructions | Tier 3 | 1/6 | NOT YET IMPLEMENTED | Stats/health tools exist but no init instruction synthesis | Build startup instruction snapshot |

---

## Appendix

### A. Removed From Active Recommendations (Fully Implemented)

1. **Graph overlay on SQLite (1.2)**  
   Removed because graph storage, traversal, and retrieval signals are implemented and operational (causal tools + N2/S5/R10 ecosystem).

2. **Contextual trees / hierarchy contexting (1.4)**  
   Removed because hierarchy-based retrieval is implemented (S4), with additional folder discovery and hierarchy caching enhancements.

3. **Metadata-first querying (2.5)**  
   Removed because metadata-oriented browsing and lightweight retrieval workflows already exist through current discovery/search surfaces.

### B. Preserved Consensus & Attribution (Original Data Retained)

- Original consensus counts remain unchanged for all 16 recommendations (as shown in Gap Analysis).
- Original cross-agent attribution themes are retained conceptually:
  - **Codex-heavy:** async ingestion lifecycle, contract/tooling rigor
  - **Gemini-heavy:** local reranking, metadata/session continuity ergonomics
  - **Cross-platform strong overlap:** hybrid retrieval, graph usage, structured outputs, hierarchy contexting

### C. Bottom-Line Assessment

The catalog shows substantial implementation maturity.  
The updated roadmap should now prioritize **interface coherence and operational ergonomics**, not core retrieval architecture rebuild.
