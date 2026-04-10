# Iteration 017: INTEGRATION FEASIBILITY

## Focus
INTEGRATION FEASIBILITY: For top 5 adoption candidates, how hard would they be to integrate into Spec Kit Memory?

## Findings

### Finding 1: **Medium integration** — operator-visible review queue is the highest-value Modus pattern
- **Source**: `external/internal/mcp/vault.go:273-343,856-897`; `external/internal/index/facts.go:187-229`; `external/internal/vault/facts.go:64-157,160-264`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:125-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:467-509,2339-2343`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:529-579,840-870`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42-320`
- **What it does**: Modus makes the full decay loop visible: `memory_search` reinforces recalled facts, `memory_decay_facts` runs the sweep, `memory_archive_stale` archives low-confidence facts, `memory_reinforce` lets an operator review a fact directly, and result formatting exposes tier/staleness cues. Public already has the harder backend pieces: FSRS columns in `memory_index`, canonical review math, strengthening-on-access, and archival machinery. The missing piece is a first-class due/review queue.
- **Why it matters for us**: This is the clearest “control-plane gap.” Integration is **medium**, not high, because Public does **not** need new decay math or new storage; it needs a new MCP surface that turns existing `stability`, `difficulty`, `last_review`, `review_count`, archival state, and promotion signals into an actionable inbox.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

### Finding 2: **Low integration** — a doctor-style summary fits Public almost immediately
- **Source**: `external/cmd/modus-memory/doctor.go:13-242`; `external/cmd/modus-memory/main.go:130-147`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:343-520`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:479-540`
- **What it does**: Modus’s `doctor` composes one-screen triage from existing index state: counts, missing fact fields, duplicate subject/predicate pairs, contradictions, empty docs, and directory distribution. Public already has deeper primitives than Modus—health diagnostics, FTS repair, orphan-edge cleanup, checkpoint restore, and post-restore index rebuilds—but they are exposed as richer technical envelopes rather than a compact operator summary.
- **Why it matters for us**: Integration is **low** because the data is already there. This is mostly formatter/reporting work: a friendlier “doctor” mode layered on `memory_health`, not a new subsystem.
- **Recommendation**: **adopt now**
- **Impact**: **medium**

### Finding 3: **Medium integration** — Modus-style lexical expansion can reuse Public’s deep-mode hooks
- **Source**: `external/internal/librarian/search.go:10-53`; `external/internal/mcp/vault.go:21-58,280-331`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:4-18,88-176,200-260`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616-740`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:173-251`
- **What it does**: Modus expands one query into 3-5 lexical variants, runs retrieval per variant, and merges deduped results. Public already has three nearby hooks: corpus-grounded LLM reformulation, deep-mode query decomposition, and graph-expanded fallback queries. So integration is not about inventing expansion; it is about deciding whether a **lighter lexical-only branch** should run before or beside the current deep pipeline.
- **Why it matters for us**: Integration is **medium** because the insertion points already exist, but the value is incremental, not foundational. Public must avoid duplicating its current deep-mode expansion stack or adding noisy variant fan-out across vector, FTS, BM25, and graph lanes.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 4: **Medium integration** — connected-doc hints are feasible, but should stay explanatory first
- **Source**: `external/internal/index/crossref.go:9-214`; `external/internal/index/indexer.go:113-136,277-289`; `external/internal/mcp/vault.go:75-101,901-925`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:520-700`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1474-1503`
- **What it does**: Modus builds an in-memory metadata adjacency map from subject/tag/entity overlap, weights subject/entity/tag at `3/2/1`, and appends “connected” documents that were not in the main ranked set. Public already has stronger structural enrichment—causal-neighbor boost, neighbor injection, and co-activation spreading—but those are graph-driven, not simple frontmatter co-membership summaries.
- **Why it matters for us**: Integration is **medium**. Public should not replace causal machinery with Modus’s simpler adjacency model, but it could add a lightweight explanation layer: “related by shared subject/tag/entity” as an appendix or secondary lane. That would improve operator comprehension without perturbing the main ranking path too aggressively.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 5: **Low integration** — Public can expose explicit review/reinforce actions without enabling global write-on-read
- **Source**: `external/internal/mcp/vault.go:311-317,885-897`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,198-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:529-579,840-870`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:517-520,771-802`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42-320`
- **What it does**: Modus exposes both automatic reinforcement on recall and an explicit `memory_reinforce` tool. Public already has the underlying grade model (`AGAIN/HARD/GOOD/EASY`), review processing, and strengthening-on-access logic, but keeps write-back behind `trackAccess=false` and has no first-class `memory_reinforce`/`memory_review` tool in the current schema set.
- **Why it matters for us**: Integration is **low** because the math and columns already exist. The work is mostly safe API design: expose explicit review as a deliberate operator action, instead of flipping Public toward Modus-style default write-on-read.
- **Recommendation**: **adopt now**
- **Impact**: **medium**

## Sources Consulted
- `external/internal/index/bm25.go`
- `external/internal/index/cache.go`
- `external/internal/librarian/search.go`
- `external/internal/index/indexer.go`
- `external/internal/index/facts.go`
- `external/internal/index/crossref.go`
- `external/internal/vault/facts.go`
- `external/internal/mcp/vault.go`
- `external/internal/mcp/memory.go`
- `external/cmd/modus-memory/doctor.go`
- `external/cmd/modus-memory/main.go`
- `external/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`

## Assessment
- **New information ratio**: **0.79**
- **Questions addressed**: which Modus ideas already have insertion points in Public; whether the missing work is backend math or operator surface; which candidates are low/medium integration versus truly invasive; whether connected-result hints overlap with Public graph features; whether librarian expansion is still meaningful given Public deep-mode reformulation.
- **Questions answered**: the best Modus transfers are mostly **control-plane additions**. Public already has stronger FSRS storage, lexical lanes, repair flows, and graph enrichment than Modus; the main feasible gains are a **review queue**, an **explicit review action**, and a **doctor-style summary**, with lexical expansion and connected-doc hints as bounded prototypes rather than architectural changes.

## Reflection
- **What worked**: Tracing Modus’s MCP handlers back into the underlying index and fact implementations made the integration story much clearer than comparing algorithms alone. The key move was matching each Modus surface against an existing Public insertion point—`processReview`, `strengthenOnAccess`, `memory_health`, deep-mode reformulation, and causal boost.
- **What did not work**: README speed and simplicity claims do not help much with feasibility ranking. The important question here was not “is Modus fast?” but “does Public already have the hard part?”, and that answer came from code paths, not marketing copy.

## Recommended Next Focus
Evaluate a concrete Public design for `memory_due` + `memory_review`: one tool that lists due/stale/promotion-eligible/archival-candidate memories, and one tool that applies graded FSRS review updates explicitly, then compare whether a metadata-based “connected docs” appendix improves operator trust beyond current causal/contiguity enrichment.


Total usage est:        1 Premium request
API time spent:         6m 32s
Total session time:     7m 7s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  2.8m in, 18.6k out, 2.6m cached, 9.0k reasoning (Est. 1 Premium request)
