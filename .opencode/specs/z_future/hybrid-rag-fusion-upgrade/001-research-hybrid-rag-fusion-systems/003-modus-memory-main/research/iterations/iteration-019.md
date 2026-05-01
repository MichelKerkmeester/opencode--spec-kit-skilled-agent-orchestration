# Iteration 019: PRIORITY RANKING

## Focus
PRIORITY RANKING: Rank ALL findings by impact x feasibility. Create a concrete adoption roadmap.

## Findings

### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
- **Source**: `external/internal/mcp/memory.go:7-15`; `external/internal/mcp/vault.go:885-897`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,197-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:529-585,840-877,1194-1202`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:300-316`
- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
- **Recommendation**: **adopt now**
- **Impact**: **high**

### Finding 2: Rank 2 (15/25, tie-broken ahead) — a doctor-style summary should ship in the same tranche as `memory_review`
- **Source**: `external/cmd/modus-memory/doctor.go:13-242`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:236-273`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:378-443,455-555`
- **What it does**: Modus turns index and vault diagnostics into a one-screen operator summary. Public already has the deeper machinery: `memory_health` with confirmation-gated auto-repair, FTS rebuild, orphan-edge cleanup, orphan-vector cleanup, and degraded/healthy reporting. The gap is presentation, not backend capability.
- **Why it matters for us**: This is nearly pure formatter work and improves operator trust immediately. It ranks ahead of `memory_due` despite lower raw strategic upside because it is safer, independent, and can ship without any FSRS contract decisions.
- **Recommendation**: **adopt now**
- **Impact**: **medium**

### Finding 3: Rank 3 (15/25, tie-broken behind) — `memory_due` is the biggest strategic win, but only after a due-state contract is fixed
- **Source**: `external/internal/mcp/vault.go:273-317,856-897`; `external/internal/vault/facts.go:64-157,160-217`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:65-71,177-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:467-473,1813-1888`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:505-520`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1194-1202`
- **What it does**: Modus exposes the full review lifecycle visibly: search recall, explicit reinforce, decay, and archive all operate over the same fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and `last_accessed`, and `processReview()` computes `nextReviewDate`, but no persisted `next_review_at` column exists and write-on-read remains opt-in through `trackAccess=false`.
- **Why it matters for us**: This is the most valuable missing product surface, but it should not ship first. If Public adds a queue before deciding whether “due” is persisted (`next_review_at`) or deterministically derived from `stability + last_review`, operators will see a review inbox that can drift from actual FSRS behavior.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

### Finding 4: Rank 4 (9/25) — connected-doc hints are worth prototyping only as an explanation lane
- **Source**: `external/internal/index/crossref.go:9-214,248-260`; `external/internal/index/indexer.go:109-136,277-285`; `external/internal/mcp/vault.go:75-101,901-924`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:520-700`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1474-1503`
- **What it does**: Modus builds a lightweight adjacency layer from subject/tag/entity overlap and appends “connected docs not in results above” as an extra hint surface. Public already has stronger graph-backed enrichment via causal boosts, neighbor injection, and co-activation, but not a simple metadata-derived explanation appendix.
- **Why it matters for us**: The feasible transfer is not ranking logic; it is result explanation. That makes this a useful prototype for operator trust, but not a top roadmap item. If it affects scoring too early, it risks duplicating or diluting better graph evidence already present in Public.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 5: Rank 5 (6/25) — Modus-style librarian expansion belongs last, and only as weak-result recovery
- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:280-299`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:4-18,88-176`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616-740`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:173-251`
- **What it does**: Modus uses an LLM to emit 3-5 lexical variants, then merges deduped fact results across those variants. Public already has deep-mode reformulation, corpus-seeded variants, and graph-expanded recovery paths; its remaining gap is not “can expand queries,” but “when is an extra lexical branch worth the latency and noise.”
- **Why it matters for us**: This has the weakest impact x feasibility score because it overlaps the most with existing Public machinery and carries the highest risk of branch explosion. The only credible adoption path is a bounded fallback for weak-result cases, never an always-on copy of Modus’s librarian path.
- **Recommendation**: **prototype later**
- **Impact**: **low**

### Finding 6: The concrete roadmap should follow dependency order, not just raw desirability
- **Source**: `external/internal/mcp/memory.go:7-15`; `external/internal/mcp/vault.go:75-101,273-317,885-924`; `external/cmd/modus-memory/doctor.go:13-242`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:197-215`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:236-316`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:378-555`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:467-473,1813-1888`
- **What it does**: The ranking resolves into a four-phase roadmap: **Phase 1** ship `memory_review` plus a doctor-style summary; **Phase 2** define the authoritative due-state contract and then add `memory_due`; **Phase 3** pilot connected-doc explanations as a non-scoring appendix; **Phase 4** run a feature-flagged lexical-expansion experiment only on weak-result fallback paths.
- **Why it matters for us**: This sequence matches the real code dependencies. Phase 1 uses existing Public primitives with low integration risk. Phase 2 is the first place schema and lifecycle semantics matter. Phases 3-4 stay explicitly out of the main ranking path until they prove incremental value over current causal and deep-mode behavior.
- **Recommendation**: **adopt now**
- **Impact**: **high**

## Sources Consulted
- `research/iterations/iteration-016.md`
- `research/iterations/iteration-017.md`
- `research/iterations/iteration-018.md`
- `external/internal/mcp/memory.go`
- `external/internal/mcp/vault.go`
- `external/internal/vault/facts.go`
- `external/internal/index/facts.go`
- `external/internal/index/crossref.go`
- `external/internal/index/indexer.go`
- `external/internal/librarian/search.go`
- `external/cmd/modus-memory/doctor.go`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`

## Assessment
- New information ratio: **0.67**
- Questions addressed: which candidate should ship first; how to break the tie between high-impact and low-risk candidates; whether `memory_due` is blocked by missing persisted due-state; whether connected-docs and lexical expansion belong on the mainline roadmap or only in prototype lanes.
- Questions answered: the correct roadmap is **not** “build the biggest feature first.” Public should ship **`memory_review` first**, pair it with a **doctor-style summary**, then formalize the due-state contract before building **`memory_due`**. Connected-doc hints are worth testing only as explanation, and lexical expansion should be the final, tightly bounded experiment.

## Reflection
- What worked: Re-ranking the iteration-017 candidates against actual Public surface gaps clarified that the bottleneck is operator actionability, not search math. Checking tool exposure (`memory_health`, `memory_validate`, `trackAccess`) against Modus’s explicit MCP tools made the roadmap dependency chain much clearer than impact scoring alone.
- What did not work: The phase packet does not currently contain the reducer-owned deep-research state files, so the ranking had to be reconstructed from prior iteration reports plus source evidence instead of reading a canonical strategy/dashboard packet. That did not block the analysis, but it reduced the amount of loop metadata available for convergence-style bookkeeping.

## Recommended Next Focus
Finalize iteration 020 as a closing synthesis: specify the Public API shape for `memory_review` and `memory_due`, decide whether due state is persisted or derived, and define success metrics for the two later prototypes (connected-doc appendix and weak-result lexical fallback).


Total usage est:        1 Premium request
API time spent:         4m 34s
Total session time:     4m 52s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.2m in, 17.2k out, 1.1m cached, 5.9k reasoning (Est. 1 Premium request)
