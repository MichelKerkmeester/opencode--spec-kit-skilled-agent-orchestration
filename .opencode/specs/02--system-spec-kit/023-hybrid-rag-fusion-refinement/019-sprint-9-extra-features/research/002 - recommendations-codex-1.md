# Document 2: Actionable Recommendations

## Executive Summary

For `system-spec-kit` and the memory MCP server, the highest-value path is:

1. **Lock MCP contracts and tool schemas first** (QMD pattern),
2. **Decouple ingestion and retrieval via job states** (Cognee pattern),
3. **Add strategy-based retrieval and backend adapters** (hybrid of both),
4. **Preserve operational simplicity by default** (QMD ergonomics).

This sequence yields fast wins without committing early to heavy infra.

---

## 1. Applicable Patterns for Your Use Case

[Assumes: your current memory MCP server already supports basic save/retrieve/search over spec-folder memory.]

### 1.1 Contract-first MCP API (High impact, low effort)

Adopt strict schema validation for every tool payload (QMD `mcp.ts` style).

**Concrete pattern**
- Define typed schemas for:
  - `memory.add`
  - `memory.search`
  - `memory.get_context`
  - `memory.index_status`
  - `memory.switch_namespace`

**Example (TypeScript-style)**
```ts
const SearchInput = z.object({
  query: z.string().min(2),
  namespace: z.string().default("default"),
  strategy: z.enum(["semantic", "keyword", "hybrid"]).default("hybrid"),
  topK: z.number().int().min(1).max(50).default(10),
  includeSources: z.boolean().default(true),
});
```

### 1.2 Retrieval strategy registry (High impact, medium effort)

Use Cognee-like `SearchType` dispatch and keep one stable MCP tool (`search`) with pluggable strategies.

**Concrete pattern**
```ts
const strategies = {
  semantic: semanticSearch,
  keyword: keywordSearch,
  hybrid: hybridSearch,
  recency: recencyBoostSearch,
};
return strategies[input.strategy](input);
```

### 1.3 Namespaced memory databases (Medium/high impact, low/medium effort)

Adopt QMD-like DB management primitives:
- `list_namespaces`
- `create_namespace`
- `switch_namespace`
- `delete_namespace` (guarded)

This immediately improves context isolation between specs/projects/phases.

### 1.4 Source-rich result envelopes (High impact, low effort)

Return metadata similar to QMD (`file`, `section`, `created_at`, `spec_folder`, `score`, `reason`).

This boosts explainability and reduces hallucinated context merges.

---

## 2. Integration Opportunities

### 2.1 Ingestion pipeline state machine

Borrow Cognee’s “cognify run” idea:

- `queued -> parsing -> embedding -> indexing -> complete|failed`
- expose `memory.index_status(job_id)` via MCP.

**Benefit:** better reliability for large memory refresh operations.

### 2.2 Backend abstraction layer

Use QMD adapter ergonomics + Cognee extensibility:
- `VectorStoreAdapter` (SQLite/pgvector/Qdrant),
- `EmbeddingAdapter` (OpenAI-compatible/local providers).

Keep defaults local; allow upgrade path without API changes.

### 2.3 Optional graph overlay for spec relationships

Borrow Cognee graph orientation gradually:
- Maintain edges like:
  - `spec -> task`
  - `task -> file`
  - `file -> decision`
  - `decision -> follow_up`

Use this initially for reranking (not full graph query language yet).

---

## 3. Architecture Improvements to Adopt

## 3.1 Proposed target architecture

- **Layer 1: MCP Contract Layer**
  - strict schemas
  - stable tool names
- **Layer 2: Orchestration Layer**
  - ingestion jobs + retries
  - strategy dispatch
- **Layer 3: Retrieval Layer**
  - semantic/keyword/hybrid plugins
- **Layer 4: Storage/Provider Adapters**
  - vector store + embedding adapters
- **Layer 5: Observability**
  - run IDs, latency, failure reasons, reindex hints

[Assumes: current architecture has less explicit layering and limited indexing telemetry.]

### 3.2 Minimal schema for memory entries

```json
{
  "id": "mem_xxx",
  "namespace": "specs/121-child",
  "content": "decision or context chunk",
  "kind": "decision|state|next-step|fact",
  "source": {
    "file": "specs/121-child/plan.md",
    "section": "Risks",
    "timestamp": "2026-03-03T12:00:00Z"
  },
  "signals": {
    "tags": ["memory", "pipeline"],
    "recency": 0.87,
    "confidence": 0.76
  }
}
```

---

## 4. Implementation Strategies (Prioritized by Impact/Effort)

### Phase 1 (2-5 days): Fast foundation wins

1. Add strict MCP schemas and response envelopes.
2. Introduce namespaces and switching tools.
3. Add source metadata to every result.
4. Add structured logs with run/request IDs.

**Expected outcome:** immediate reliability and debuggability improvements with low code churn.

### Phase 2 (1-2 weeks): Retrieval quality step-up

1. Implement strategy registry (`semantic`, `keyword`, `hybrid`).
2. Add recency weighting and metadata filters.
3. Add top-K + score threshold controls per request.
4. Add regression test fixtures for retrieval quality.

**Expected outcome:** better relevance and lower false positives.

### Phase 3 (2-4 weeks): Pipeline + adapter maturity

1. Build ingestion job lifecycle with status APIs.
2. Add adapter interfaces for vector store/embedding providers.
3. Keep local default backend; optional external backend plugin.
4. Add migration command for re-embedding/index rebuild.

**Expected outcome:** scalable architecture without sacrificing local-first onboarding.

### Phase 4 (optional): Graph-assisted memory

1. Capture lightweight edges at ingest.
2. Add graph-aware reranking for ambiguous queries.
3. Evaluate quality gains before deeper graph investment.

**Expected outcome:** improved multi-hop context retrieval for complex specs.

---

## 5. Risks and Considerations

1. **Over-engineering risk**
- Avoid shipping full Cognee-level complexity early.
- Mitigation: feature flags + phased rollout.

2. **Operational sprawl**
- Too many backend/provider choices can increase support burden.
- Mitigation: define “blessed defaults” and compatibility tiers.

3. **Migration risk**
- Embedding model or dimension changes can invalidate indexes.
- Mitigation: versioned index metadata + background reindex jobs.

4. **Quality drift**
- Hybrid retrieval tuning can regress silently.
- Mitigation: golden query benchmark suite tied to CI.

5. **Security/privacy**
- Provider flexibility may leak sensitive data if misconfigured.
- Mitigation: explicit “local-only mode” and provider allowlist policies.

---

## 6. Specific Code Patterns to Leverage

### 6.1 From QMD: tool schema rigor
Use `zod`-like validation directly at MCP boundary (see `src/mcp.ts`).

### 6.2 From QMD: provider factory split
Separate “embedding model creation” from “query model creation” (see `src/llm.ts`) so you can swap providers by env/config without touching retrieval code.

### 6.3 From Cognee: search type dispatch
Implement typed retrieval modes (see `cognee/search.py` behavior) to keep API stable while evolving internals.

### 6.4 From Cognee: pipeline run IDs + retries
Add job context and retry accounting (as in `cognify` flow) to prevent brittle one-shot indexing.

### 6.5 From both: MCP as durable interface
Keep MCP tool names stable and version responses instead of breaking fields.

---

## 7. Migration / Adoption Pathways

### Path A: Conservative (recommended)
- Keep current backend and add contracts + strategies first.
- Add adapters behind existing APIs.
- Migrate data lazily on read/reindex.

**Best when:** low risk tolerance and existing users/tools depend on current behavior.

### Path B: Parallel-run
- Spin up v2 memory MCP endpoint with new architecture.
- Mirror writes to v1 and v2.
- Compare retrieval quality/latency on sampled queries.
- Cut over after acceptance thresholds.

**Best when:** you need measurable confidence before migration.

### Path C: Namespace-first transformation
- Introduce namespace model and metadata schema now.
- Migrate retrieval and adapters incrementally per namespace.

**Best when:** projects/specs are naturally partitioned and migration can be gradual.

---

## 8. Recommended Next Step Set (Practical)

1. Implement strict MCP schemas + source-rich result envelope.
2. Add namespace management tools.
3. Implement hybrid retrieval strategy registry.
4. Add index job state tracking (`queued/running/failed/completed`).
5. Define adapter interfaces and ship one local + one external backend.
6. Create a benchmark set of real spec-memory queries for regression tracking.

These six steps deliver most of the value from Cognee/QMD patterns while preserving operational simplicity.
