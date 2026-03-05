# Definitive Synthesis: Cross-AI Research Recommendations for system-spec-kit

## Methodology

This document is the final authoritative output of a multi-agent research effort. It cross-references three prior analyses to produce a single, verified set of recommendations:

1. **013 — Original 6-Agent Synthesis**: 16 recommendations derived from 12 research documents produced by 6 independent AI agents (3 Codex gpt-5.3-codex, 3 Gemini 3.1-pro-preview), analyzing Cognee, QMD, and ArtemXTech as external reference systems.
2. **014 — Gemini 3.1-pro Architectural Review**: Cross-referenced the 16 recommendations against the system-spec-kit Feature Catalog. Identified 5 as fully implemented, 6 as partial, 5 as not implemented.
3. **015 — Codex 5.3 Deduplication Review**: Independently cross-referenced the same 16 recommendations. Identified 3 as fully implemented, 9 as partial, 4 as not implemented.

This document performs a third independent verification against the Feature Catalog and `summary_of_new_features.md` to break ties, correct errors, and produce definitive verdicts. Every implementation claim cites specific catalog features by their ticket or section ID.

---

## 1. Meta-Analysis: How Much Was Already Built?

The most important finding of this review is that **the 023 Hybrid RAG Fusion Refinement program had already anticipated and built the majority of the original synthesis's highest-priority recommendations** before the research was conducted.

| Category | Count | Percentage |
|----------|------:|----------:|
| Fully implemented (no action needed) | 4 | 25% |
| Partially implemented (infrastructure exists, gap is bounded) | 7 | 44% |
| Not implemented (genuine net-new work) | 5 | 31% |

The original synthesis was **directionally correct but redundant by roughly half**. Its two strongest recommendations — hybrid multi-strategy retrieval (consensus 6/6) and knowledge graph overlay (consensus 5/6) — were both already implemented to production standards with extensive feature-flagging, evaluation infrastructure, and multiple refinement phases.

**What this means for planning:** The remaining work is not "build core retrieval architecture" — that is done. The remaining work is **interface polish, operational tooling, and external API ergonomics**. This is a qualitative shift from architecture to productization.

**An unacknowledged advantage:** The Feature Catalog reveals an evaluation framework (eval database with 9 metrics, ablation studies, synthetic ground truth corpus, quality proxy formula, observer-effect mitigation) that neither the original synthesis nor either reviewer mentioned. This infrastructure makes every remaining recommendation measurably safer to implement, because regressions are detectable.

---

## 2. Reviewer Agreement Matrix

The table below shows where Gemini (014) and Codex (015) agreed, where they disagreed, and my final ruling with evidence.

| # | Recommendation | Gemini Verdict | Codex Verdict | Final Verdict | Ruling Basis |
|---|---------------|---------------|--------------|---------------|-------------|
| 1.1 | Hybrid multi-strategy retrieval | IMPLEMENTED | PARTIAL | **IMPLEMENTED** | 5-channel pipeline (R6), complexity router (R15), RRF, MMR, fallback chain all operational. Codex's "strategy explainability" gap is valid but minor. |
| 1.2 | Knowledge graph overlay | IMPLEMENTED | IMPLEMENTED | **IMPLEMENTED** | `causal_edges` table, `memory_causal_link`, R10 entity extraction, S5 cross-doc linking, N2 graph signals. |
| 1.3 | MCP tool contract redesign | PARTIAL | PARTIAL | **PARTIAL** | Tool split done (`memory_search`/`memory_context`/`memory_list`/etc). Phase 017 schema hardening. No Zod `.strict()` validation or versioned contracts found in catalog. |
| 1.4 | Contextual trees for spec folders | **PARTIAL** | IMPLEMENTED | **PARTIAL** | PI-B3 descriptions used for routing in `memory_context`. **But**: no string-prepended context headers in returned chunks. Gemini was correct; Codex overcalled this. |
| 1.5 | Source-rich structured results | IMPLEMENTED | **PARTIAL** | **PARTIAL** | Internal PipelineRow has 6 score fields, S2 anchors, S3 validation. **But**: unclear whether per-channel scoring breakdown and retrieval traces are exposed in public MCP responses. Codex was correct; Gemini overcalled this. |
| 2.1 | Async ingestion pipeline | PARTIAL | PARTIAL | **PARTIAL** | `asyncEmbedding` flag exists, pending embeddings tracked. No job ID / state machine / status polling tools. |
| 2.2 | Local GGUF reranking | PARTIAL | PARTIAL | **PARTIAL** | `SPECKIT_CROSS_ENCODER` (default ON), `RERANKER_LOCAL` flag, Cohere/Voyage APIs. No `node-llama-cpp` or GGUF integration in catalog. |
| 2.3 | Warm server / daemon mode | NOT IMPL | NOT IMPL | **NOT IMPL** | Only `stdio` transport. `SPECKIT_LAZY_LOADING` and `SPECKIT_EAGER_WARMUP` mitigate cold starts partially. No HTTP daemon. |
| 2.4 | Backend adapter abstraction | NOT IMPL | PARTIAL | **NOT IMPL** | Embedding provider abstracted (auto/openai/hf-local/voyage). **But** the recommendation targets storage layer (IVectorStore, IGraphStore), which is tightly coupled to SQLite. Codex conflated embedding providers with storage adapters. |
| 2.5 | Metadata-first querying | IMPLEMENTED | IMPLEMENTED | **IMPLEMENTED** | Tiered content injection (HOT/WARM/COLD), `includeContent=false` parameter across search tools. |
| 2.6 | Namespace management | NOT IMPL | NOT IMPL | **NOT IMPL** | `specFolder` filter for logical scoping. No CRUD namespace tools or physical DB isolation. |
| 2.7 | Session continuity | IMPLEMENTED | PARTIAL | **IMPLEMENTED** | `memory_context` resume mode targets state/next-steps/blocker anchors. `SPECKIT_AUTO_RESUME`. Working memory with attention scores. The proposed `memory_continue` is functionally covered by existing resume mode. |
| 3.1 | ANCHOR as graph nodes | PARTIAL | PARTIAL | **PARTIAL** | S2 parses anchors and derives semantic types. Annotations on pipeline rows only — not promoted to graph nodes. |
| 3.2 | AST-level section retrieval | PARTIAL | PARTIAL | **PARTIAL** | R7 anchor-aware chunk thinning exists. No `read_spec_section` tool or Markdown AST parsing. |
| 3.3 | Real-time filesystem watching | NOT IMPL | NOT IMPL | **NOT IMPL** | Pull-based `memory_index_scan` only. No `chokidar` or file watcher. |
| 3.4 | Dynamic server instructions | NOT IMPL | NOT IMPL | **NOT IMPL** | `memory_stats` and `memory_health` tools exist but no instruction synthesis at MCP server initialization. |

**Agreement rate:** 11 of 16 items (69%) — reviewers agreed on verdict. 5 items had divergent verdicts.

**Reviewer quality assessment:**
- **Gemini** was cleaner and more decisive but slightly overconfident, calling 1.5 (source-rich results) and 2.7 (session continuity) fully implemented when gaps remain in the external API surface.
- **Codex** was more cautious and more accurate on borderline cases (1.4, 1.5), but overcalled 1.4 (contextual trees) as implemented and inflated 2.4 (backend adapters) by counting embedding providers.
- **Neither reviewer was dramatically wrong.** The main value of dual review was catching the cases where one saw "implemented" and the other saw a gap.

---

## 3. Net-New Recommendations

The following recommendations represent the actual remaining work. Items already implemented have been removed. Each entry includes what needs building, what exists to build on, effort sizing, priority, and an implementation sketch.

### Priority P0 — Do First (Foundation for Everything Else)

#### P0-1: Strict MCP Schema Validation & Versioning

**What needs building:** Wrap all MCP tool inputs in strict Zod schemas with `.strict()` enforcement to reject unexpected keys. Add versioned tool aliases (`memory_search_v2`) for schema-breaking changes.

**What already exists:** Tool split by intent is complete. Phase 017 schema hardening provides partial validation. The tool surface is mature (~20 tools).

**Effort:** S (2-3 days) | **Priority:** P0 | **Original consensus:** 5/6

```typescript
import { z } from 'zod';

const MemorySearchInput = z.object({
  query: z.string().min(2).max(1000),
  strategy: z.enum(["auto", "semantic", "keyword", "hybrid"]).default("auto"),
  specFolder: z.string().optional(),
  topK: z.number().int().min(1).max(50).default(10),
  includeContent: z.boolean().default(false),
  sessionId: z.string().uuid().optional(),
}).strict(); // Reject hallucinated parameters

// Apply to handler:
server.tool("memory_search", async (rawInput) => {
  const input = MemorySearchInput.parse(rawInput); // Throws on invalid
  return await handleSearch(input);
});
```

**Risk:** Backward compatibility — existing callers may pass undocumented parameters that `.strict()` will reject. Mitigation: audit current usage before enforcing, use `.passthrough()` as an intermediate step.

---

#### P0-2: Provenance-Rich Response Envelopes

**What needs building:** Standardize the MCP response format to expose the rich internal scoring and tracing metadata that already exists in PipelineRow but may not reach the calling agent.

**What already exists:** Stage 4 PipelineRow with 6 score fields (S2 anchor metadata, S3 validation metadata, TRM evidence gap detection). The internal data is there; the gap is in what the public API returns.

**Effort:** M (4-5 days) | **Priority:** P0 | **Original consensus:** 4-5/6

```typescript
// Canonical response envelope per result
interface MemoryResult {
  id: string;
  specFolder: string;
  title: string;
  content: string | null;
  source: {
    file: string;
    anchorIds: string[];
    anchorTypes: string[];     // From S2 semantic typing
    lastModified: string;
  };
  scores: {
    semantic: number;
    lexical: number;
    fusion: number;
    composite: number;
    effective: number;
    rerank: number | null;
  };
  trace: {
    channelsUsed: string[];
    pipelineStages: string[];
    fallbackTier: number | null;
    queryComplexity: string;   // From R15
    expansionTerms: string[];  // From R12
  };
  validation: {
    state: string;             // ACTIVE, STALE, ARCHIVED, etc.
    evidenceGaps: string[];    // From TRM
  };
}
```

**Note:** This may already be partially exposed. Code-level verification is needed before implementation to avoid duplicate work. Check what `formatSearchResults()` currently returns.

---

#### P0-3: Async Ingestion Job Lifecycle

**What needs building:** A background job queue with state machine, progress tracking, and 2-3 new MCP tools (`memory_ingest_start`, `memory_ingest_status`, optional `memory_ingest_cancel`).

**What already exists:** `asyncEmbedding: true` in `memory_save` defers embedding generation. Pending embeddings are tracked. `memory_index_scan` supports incremental retry. The building blocks are present; the gap is a user-facing job lifecycle.

**Effort:** M (5-7 days) | **Priority:** P0 | **Original consensus:** 3/6 (Codex-only)

```typescript
// New tool: memory_ingest_start
// Returns immediately with a job handle
server.tool("memory_ingest_start", async (input) => {
  const { paths, specFolder } = IngestStartInput.parse(input);
  const jobId = `job_${nanoid(12)}`;
  backgroundQueue.enqueue({
    id: jobId, paths, specFolder,
    state: 'queued', progress: 0, errors: [],
  });
  return { jobId, state: 'queued', filesTotal: paths.length };
});

// New tool: memory_ingest_status
server.tool("memory_ingest_status", async (input) => {
  const job = backgroundQueue.get(input.jobId);
  if (!job) return { error: 'Job not found' };
  return {
    jobId: job.id,
    state: job.state,  // queued → parsing → embedding → indexing → complete | failed
    progress: job.progress,
    filesProcessed: job.filesProcessed,
    filesTotal: job.filesTotal,
    errors: job.errors,
  };
});

// State machine: queued → parsing → embedding → indexing → complete | failed
// Partial results committed on failure; failed files logged for retry
```

**Why P0 despite only 3/6 consensus:** MCP timeout constraints are a real operational blocker for bulk indexing. The Gemini agents did not deprioritize this — they simply focused elsewhere. The need is confirmed by the existence of `asyncEmbedding` as a workaround.

---

### Priority P1 — Do Next (Quality and Ergonomics)

#### P1-4: Contextual Tree Injection into Chunks

**What needs building:** String-prepend hierarchical context headers into returned memory chunks so agents understand the broader context without additional round-trips.

**What already exists:** PI-B3 cached one-sentence descriptions per spec folder. S4 hierarchy parsing. Tree thinning (PI-B1). The hierarchy data is available; it is currently used for internal routing, not for external context enrichment.

**Effort:** S (1-2 days) | **Priority:** P1 | **Original consensus:** 4/6

```typescript
function injectContextualTree(result: PipelineRow): PipelineRow {
  if (!result.specFolder) return result;
  const desc = descriptionCache.get(result.specFolder);
  const parts = result.specFolder.split('/').slice(-2);
  const header = desc
    ? `[${parts.join(' > ')} — ${desc.slice(0, 80)}]`
    : `[${parts.join(' > ')}]`;
  if (header.length < 100 && result.content_text) {
    result.content_text = `${header}\n${result.content_text}`;
  }
  return result;
}
```

**Risk:** Token budget inflation. Strict truncation to < 100 characters per header is mandatory. Feature-flag for opt-out (`SPECKIT_CONTEXT_HEADERS`).

---

#### P1-5: Local GGUF Reranker Productization

**What needs building:** Integrate `node-llama-cpp` to run quantized GGUF reranker models (0.5-0.6B parameters) entirely within the Node process, replacing remote API calls for cross-encoder reranking.

**What already exists:** `SPECKIT_CROSS_ENCODER` (default ON) gating Stage 3 reranking. `RERANKER_LOCAL` flag. Cohere and Voyage API integrations. The reranking pipeline slot exists; the gap is a node-native execution path.

**Effort:** M (5-8 days) | **Priority:** P1 | **Original consensus:** 3/6 (Gemini-primary)

```typescript
// lib/search/local-reranker.ts
import { getLlama } from 'node-llama-cpp';

const MODEL_PATH = process.env.SPECKIT_RERANKER_MODEL
  || './models/bge-reranker-v2-m3.gguf';
const MIN_FREE_MEM_MB = 4096;

async function canUseLocalReranker(): Promise<boolean> {
  if (process.env.RERANKER_LOCAL !== 'true') return false;
  const freeMem = os.freemem() / (1024 * 1024);
  if (freeMem < MIN_FREE_MEM_MB) return false;
  try { await fs.access(MODEL_PATH); return true; }
  catch { return false; }
}

export async function rerankLocal(
  query: string, candidates: PipelineRow[]
): Promise<PipelineRow[]> {
  if (!(await canUseLocalReranker())) return candidates; // Fallback to RRF
  const llama = await getLlama();
  const model = await llama.loadModel({ modelPath: MODEL_PATH });
  const ctx = await model.createContext();
  for (const c of candidates) {
    c.rerankScore = await computeCrossEncoderScore(ctx, query, c.content_text);
  }
  return candidates.sort((a, b) => b.rerankScore - a.rerankScore);
}
```

**Risk:** VRAM contention on machines running IDE LLM concurrently. Default to OFF; opt-in via `RERANKER_LOCAL=true`. Automatic fallback when memory is insufficient.

---

#### P1-6: Dynamic Server Instructions at MCP Initialization

**What needs building:** Generate a concise memory system overview at MCP server startup and inject it into the server's instruction payload, giving calling LLMs immediate awareness of available knowledge.

**What already exists:** `memory_stats` and `memory_health` tools provide the data. The gap is composing this data into startup instructions rather than requiring a tool call.

**Effort:** S (1-2 days) | **Priority:** P1 | **Original consensus:** 1/6 (unique Codex-2 insight)

```typescript
// In context-server.ts initialization
async function buildServerInstructions(): Promise<string> {
  const stats = await getMemoryStats();
  return [
    `Memory: ${stats.totalMemories} memories, ${stats.specFolders} spec folders.`,
    `Active: ${stats.activeCount} | Stale: ${stats.staleCount}`,
    stats.staleCount > 10 ? `Warning: ${stats.staleCount} stale memories.` : '',
    `Channels: vector, FTS5, BM25, graph, degree.`,
    `Tools: memory_search (retrieval), memory_context (orchestrated), memory_save (index).`,
  ].filter(Boolean).join(' ');
}
server.setInstructions(await buildServerInstructions());
```

**Why P1 despite only 1/6 consensus:** Low effort, immediate value. Eliminates a cold-start information asymmetry at zero runtime cost.

---

#### P1-7: Real-Time Filesystem Watching

**What needs building:** A `chokidar`-based file watcher that detects changes in spec directories and triggers targeted re-indexing with debounced deduplication.

**What already exists:** `memory_index_scan` for pull-based indexing with incremental retry. SHA-256 content-hash deduplication (TM-02). WAL mode for SQLite. The re-indexing pipeline exists; the gap is triggering it automatically.

**Effort:** S-M (3-5 days) | **Priority:** P1 | **Original consensus:** 1/6 (unique Gemini-2 insight)

```typescript
import chokidar from 'chokidar';

function startWatcher(specsDir: string, reindexFn: (path: string) => Promise<void>) {
  const pending = new Map<string, NodeJS.Timeout>();
  const watcher = chokidar.watch(specsDir, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 1000 },
  });
  watcher.on('change', (filePath) => {
    if (!filePath.endsWith('.md')) return;
    if (pending.has(filePath)) clearTimeout(pending.get(filePath)!);
    pending.set(filePath, setTimeout(async () => {
      pending.delete(filePath);
      await retryWithBackoff(() => reindexFn(filePath), { maxRetries: 3 });
    }, 2000));
  });
  return watcher;
}
```

**Risk:** SQLite `SQLITE_BUSY` from concurrent watcher and agent writes. Mandatory: WAL mode enforcement, exponential backoff retry. The existing TM-02 content-hash dedup prevents redundant re-indexing.

---

### Priority P2 — Optional / Innovation (Build When Needed)

#### P2-8: Warm Server / Daemon Mode

**Status:** NOT IMPLEMENTED | **Effort:** L | **Consensus:** 3-4/6

HTTP daemon with warm caches and multi-transport support (stdio, HTTP, SSE). **Recommendation: defer.** The MCP protocol specification is evolving and may standardize transport negotiation. Building a custom daemon now risks throwaway work. The existing `SPECKIT_EAGER_WARMUP` flag partially mitigates cold-start costs. Monitor MCP SDK developments before investing.

#### P2-9: Backend Storage Adapter Abstraction

**Status:** NOT IMPLEMENTED | **Effort:** M-L | **Consensus:** 3/6

Extract `IVectorStore`, `IGraphStore`, `IDocumentStore` interfaces. **Recommendation: defer.** This is a classic premature abstraction risk. SQLite with sqlite-vec and FTS5 handles the current scale well. Abstract when there is a concrete scaling pressure (corpus > 100K memories, multi-node deployment, enterprise multi-tenancy). Embedding provider abstraction already exists and demonstrates the pattern.

#### P2-10: Namespace Management

**Status:** NOT IMPLEMENTED | **Effort:** S-M | **Consensus:** 2/6

CRUD tools for hard namespace isolation (`list_namespaces`, `create_namespace`, `switch_namespace`, `delete_namespace`). **Recommendation: defer.** The `specFolder` filter provides adequate logical isolation for current use cases. Build when multi-tenant or large monorepo scenarios create demand.

#### P2-11: ANCHOR Tags as Graph Nodes

**Status:** PARTIAL (S2 parsing exists, graph promotion does not) | **Effort:** S-M | **Consensus:** 1/6

Convert `<!-- ANCHOR: architecture -->` into typed graph nodes (`ArchitectureNode`) with distinct edge rules. **Recommendation: spike first.** This is the most creative unique insight from the entire research corpus (Gemini-2). It would create a deterministic knowledge graph from existing markdown conventions without expensive LLM extraction. Worth a 2-day spike to validate the approach, but not production-priority.

#### P2-12: AST-Level Section Retrieval

**Status:** PARTIAL (R7 chunk thinning exists, no heading-level API) | **Effort:** M | **Consensus:** 1/6

Expose `read_spec_section(filePath, heading)` using Markdown AST parsing via `remark`. **Recommendation: nice to have.** The existing chunk thinning and anchor-aware indexing provide reasonable granularity. This becomes more valuable as individual spec documents grow very large (>1000 lines).

---

## 4. Implementation Roadmap

### Phase 1: Hardening and Ergonomics (1-2 weeks)

All items are independent and can be parallelized.

| Item | Effort | Dependencies | Deliverable |
|------|--------|-------------|-------------|
| P0-1: Zod schema validation | S (2-3d) | None | Strict input contracts on all tools |
| P0-2: Response envelopes | M (4-5d) | None (but defines P1-4 format) | Canonical response type with scores + trace |
| P1-6: Dynamic server instructions | S (1-2d) | None | Index overview at MCP init |

**Expected outcome:** Immediate reliability improvement. LLM tool-call failures from malformed parameters are eliminated. Calling agents can inspect scoring and trace retrieval behavior.

### Phase 2: Operational Reliability (2-3 weeks)

| Item | Effort | Dependencies | Deliverable |
|------|--------|-------------|-------------|
| P0-3: Async ingestion jobs | M (5-7d) | Phase 1 schemas | Job lifecycle: start/status/cancel tools |
| P1-4: Contextual tree injection | S (1-2d) | P0-2 envelope format | Context headers in returned chunks |
| P1-7: Filesystem watching | S-M (3-5d) | None | Auto re-index on file changes |

**Expected outcome:** Reliable bulk indexing without MCP timeouts. Agents receive contextually enriched chunks. Index stays fresh without manual scans.

### Phase 3: Retrieval Excellence (2-4 weeks)

| Item | Effort | Dependencies | Deliverable |
|------|--------|-------------|-------------|
| P1-5: Local GGUF reranker | M (5-8d) | Phase 1 test infra | Node-native cross-encoder reranking |

**Expected outcome:** API-free reranking option for air-gapped or latency-sensitive deployments.

### Phase 4: Innovation (ongoing, demand-driven)

| Item | Trigger to Build |
|------|-----------------|
| P2-8: Daemon mode | MCP SDK standardizes HTTP transport |
| P2-9: Storage adapters | Corpus exceeds 100K memories or multi-node needed |
| P2-10: Namespaces | Multi-tenant deployment demand |
| P2-11: ANCHOR graph nodes | Successful 2-day spike |
| P2-12: AST section retrieval | Spec docs regularly exceed 1000 lines |

---

## 5. Risks and Mitigations

| Risk | Source | Mitigation |
|------|--------|-----------|
| Schema strictness breaks existing callers | P0-1 | Audit current parameter usage before `.strict()`. Use `.passthrough()` as transitional step. |
| Response envelope inflates token usage | P0-2, P1-4 | Envelope fields are opt-in via `includeTrace: true`. Context headers capped at 100 chars. |
| Async jobs add operational complexity | P0-3 | In-process queue (no Redis). Job records persisted to SQLite for crash recovery. |
| GGUF reranker starves IDE LLM of memory | P1-5 | Default OFF. Memory threshold check before loading. Automatic fallback to RRF. |
| File watcher causes SQLITE_BUSY | P1-7 | WAL mode enforced. Exponential backoff retry (3 attempts). Content-hash dedup prevents redundant writes. |
| Premature abstraction (adapters, namespaces) | P2-9, P2-10 | Deferred until concrete demand. SQLite handles current scale. |

---

## Appendix A — Already Implemented (Removed from Active Recommendations)

These recommendations from the original 6-agent synthesis are **fully operational** in the current system and require no further work:

| Recommendation | Consensus | Evidence from Feature Catalog |
|---------------|----------:|------------------------------|
| 1.1 Hybrid multi-strategy retrieval | 6/6 | R6 4-stage pipeline, 5 search channels (Vector/FTS5/BM25/Graph/Degree), R15 query complexity router, adaptive RRF fusion, R12 embedding expansion, 3-tier fallback chain, MMR diversity reranking, co-activation spreading. |
| 1.2 Knowledge graph overlay | 5/6 | `causal_edges` table with 6 relation types, `memory_causal_link`/`stats`/`unlink`/`drift_why` tools, R10 auto entity extraction (5 regex rules, `memory_entities` table), S5 cross-document entity linking, N2a graph momentum, N2b causal depth, N3-lite consolidation engine. |
| 2.5 Metadata-first querying | 2/6 | Tiered content injection (HOT=full content, WARM=150 chars, COLD=none), `includeContent=false` parameter in `memory_search` and `memory_list`, chunk collapse dedup (G3) on all paths. |
| 2.7 Session continuity | 2/6 | `memory_context` resume mode targeting state/next-steps/blocker anchors, `SPECKIT_AUTO_RESUME`, working memory with attention-scored carry-forward, session deduplication, cross-turn context injection. |

---

## Appendix B — Source Attribution

Each remaining recommendation traced to the original 6 research agents (C = Codex gpt-5.3-codex, G = Gemini 3.1-pro-preview):

| Recommendation | Original Agents | Key Contribution |
|---------------|----------------|-----------------|
| P0-1: Schema validation | C1, C2, C3, G1, G3 (5/6) | C1: Zod schemas. C2: intent-split query/get/multi_get. C3: functional grouping. G1: speckit_get_status. G3: memory_traverse parameters. |
| P0-2: Response envelopes | C1, C2, C3, G2, G3 (4-5/6) | C1: JSON envelope with score/kind/source. C2: structured return with id/score/line_start. C3: score components + reason codes. G2/G3: telemetry references. |
| P0-3: Async ingestion | C1, C2, C3 (3/6, Codex-only) | C1: pipeline state machine. C2: ingest_start/status/cancel tools. C3: memory_index_start/status. |
| P1-4: Contextual trees | C2, C3, G1, G3 (4/6) | C2: global-spec-phase inheritance. C3: 5-level hierarchy. G1: prepend parent context (code). G3: domain context injection (code). |
| P1-5: GGUF reranker | C3, G2, G3 (3/6) | G2: `node-llama-cpp` code pattern + fallback logic. G3: `SPECKIT_LLM_RERANK` flag + latency concern. C3: reranking in fusion (partial). |
| P1-6: Dynamic init | C2 only (1/6) | Dynamic instructions at init, inspired by QMD `buildInstructions()`. |
| P1-7: FS watching | G2 only (1/6) | `chokidar` + debounced hashing + targeted re-indexing. |
| P2-8: Daemon mode | C2, C3, G2, G3 (3-4/6) | C2: stdio vs HTTP transport. C3: multi-transport + warm cache + health endpoint. |
| P2-9: Storage adapters | C1, C2, G2 (3/6) | G2: IVectorStore/IGraphStore/IDocumentStore interfaces. C1: VectorStore/Embedding adapters. |
| P2-10: Namespaces | C1, C2 (2/6, Codex-only) | C1: list/create/switch/delete primitives. C2: named indexes for isolation. |
| P2-11: ANCHOR nodes | G2 only (1/6) | Most creative unique insight: anchors as typed graph entity nodes. |
| P2-12: AST sections | G1 only (1/6) | Heading-based nodes + `read_spec_section` tool. |

### Inspiration Source Summary

| Pattern Origin | What It Contributed | Primary Recommendations |
|---------------|-------------------|------------------------|
| **Cognee** | Graph overlay, async pipelines, lifecycle tools, ontology enforcement | P0-3, P2-9 |
| **QMD** | Hybrid retrieval, Zod schemas, local GGUF reranking, warm daemon, smart chunking | P0-1, P0-2, P1-5, P1-7, P2-8 |
| **ArtemXTech** | Session continuity, metadata-first querying, context rot awareness | (Already implemented: 2.5, 2.7) |

---

## Appendix C — Definitive Classification Summary

| # | Recommendation | Final Status | Priority | Effort | Action |
|---|---------------|-------------|----------|--------|--------|
| 1.1 | Hybrid retrieval | IMPLEMENTED | — | — | None required |
| 1.2 | Graph overlay | IMPLEMENTED | — | — | None required |
| 1.3 | MCP contracts | PARTIAL | P0 | S | Zod `.strict()` + versioning |
| 1.4 | Contextual trees | PARTIAL | P1 | S | String-prepend context headers |
| 1.5 | Structured results | PARTIAL | P0 | M | Canonical response envelope |
| 2.1 | Async ingestion | PARTIAL | P0 | M | Job lifecycle tools |
| 2.2 | GGUF reranking | PARTIAL | P1 | M | `node-llama-cpp` integration |
| 2.3 | Daemon mode | NOT IMPL | P2 | L | Defer: await MCP SDK evolution |
| 2.4 | Storage adapters | NOT IMPL | P2 | M-L | Defer: await scaling need |
| 2.5 | Metadata-first | IMPLEMENTED | — | — | None required |
| 2.6 | Namespaces | NOT IMPL | P2 | S-M | Defer: await multi-tenant demand |
| 2.7 | Session continuity | IMPLEMENTED | — | — | None required |
| 3.1 | ANCHOR nodes | PARTIAL | P2 | S-M | Spike first, then decide |
| 3.2 | AST sections | PARTIAL | P2 | M | Nice to have |
| 3.3 | FS watching | NOT IMPL | P1 | S-M | `chokidar` + debounced re-index |
| 3.4 | Dynamic init | NOT IMPL | P1 | S | Startup instruction synthesis |
