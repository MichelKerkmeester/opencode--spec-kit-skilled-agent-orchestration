# Iteration 020: FINAL SYNTHESIS

## Focus
FINAL SYNTHESIS: Classify EVERY finding as adopt-now / prototype-later / new-feature-needed / reject. Executive summary.

**Executive summary:** Borrow **Modus’s operator surfaces**, not its weaker retrieval shortcuts. **Adopt now:** graded `memory_review`, doctor-style summary, and a strict one-retrieval-core rule. **New feature needed:** authoritative `memory_due` and a durable proposal inbox. **Prototype later:** connected-doc appendix, weak-result lexical fallback, and content-level contradiction linting. **Reject:** fuzzy result-cache reuse, permissive markdown ingestion, default write-on-read as policy, and unenforced trust-stage metadata.

## Findings

### Finding 1: Explicit graded review is the best immediate transfer
- **Source**: `external/internal/mcp/vault.go:885-897`; `external/internal/vault/facts.go:160-217`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,65-71,197-215`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:298-316`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648-790`
- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: A doctor-style summary should ship beside review
- **Source**: `external/cmd/modus-memory/doctor.go:13-242`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:378-594`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:236-273`
- **What it does**: Modus’s `doctor` turns vault health into a one-screen operator report. Public already has deeper health and repair machinery—FTS rebuild, orphan cleanup, degraded/healthy state, confirmation-gated repair—but exposes it as a richer technical envelope.
- **Why it matters for us**: This is mostly presentation work, not backend work. It improves operator trust immediately while preserving Public’s stronger repair semantics underneath.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 3: Keep one retrieval core; Modus’s split fact-search paths are a warning
- **Source**: `external/internal/index/indexer.go:287-340`; `external/internal/vault/facts.go:290-337`; `external/internal/mcp/vault.go:273-317`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:771-809`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts:1-32`
- **What it does**: Modus has multiple fact-search contracts for the same memory objects: `Index.SearchFacts`, a separate in-memory `factStore`, and `Vault.SearchFacts` fallback behavior. Public routes `memory_search` through one pipeline contract via `executePipeline`.
- **Why it matters for us**: This is the strongest architectural lesson from Modus’s weaknesses. Public should keep specialized search surfaces as thin wrappers over the canonical pipeline instead of growing parallel ranking rules that will drift.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: `memory_due` is real product value, but it needs an authoritative due-state contract first
- **Source**: `external/internal/mcp/vault.go:273-317,856-897`; `external/internal/vault/facts.go:64-157,160-217`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:65-71,177-215`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519-520`
- **What it does**: Modus visibly ties search recall, reinforce, decay, and archive to one fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and opt-in access effects, and computes `nextReviewDate`, but does not expose an operator-facing due queue.
- **Why it matters for us**: This is the biggest missing workflow surface in Public. But it should not ship until “due” is defined as either persisted state (`next_review_at`) or a deterministic derivation from existing FSRS fields.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 5: Durable proposal inboxes are the best non-retrieval idea Modus has
- **Source**: `external/internal/vault/prs.go:10-118`; `external/internal/mcp/vault.go:681-777`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:417-452`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:681-790`
- **What it does**: Modus persists risky knowledge changes as markdown PR artifacts, then merge/reject outcomes reinforce or weaken linked beliefs. Public already produces advisory reconsolidation recommendations and confidence feedback, but the recommendation is transient and not stored as a durable review object.
- **Why it matters for us**: Public’s next gap is operator workflow, not mutation safety. A persistent inbox for reconsolidation, supersession, promotion, and deprecation proposals would let existing confidence and mutation systems work as a real review loop.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 6: Connected-doc hints are worth prototyping only as an explanation appendix
- **Source**: `external/internal/index/crossref.go:154-214,248-280`; `external/internal/mcp/vault.go:75-101,901-924`
- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
- **Why it matters for us**: The transferable part is explanation, not ranking. Public can test a “related memories” appendix without diluting stronger graph-backed or hybrid scoring paths.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 7: Lexical-only expansion belongs only in weak-result recovery
- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:28-58,280-299`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:525-529,771-809`
- **What it does**: Modus asks the Librarian for 3-5 keyword variants, searches each, deduplicates, and caps results. It is lightweight, but ungrounded and union-first.
- **Why it matters for us**: Public already has a more complex retrieval pipeline, so copying this as a mainline branch would mostly add noise and latency. The only credible transfer is a tightly bounded fallback when hybrid retrieval is weak.
- **Recommendation**: prototype later
- **Impact**: low

### Finding 8: Content-level contradiction and duplicate-fact linting is still worth a prototype
- **Source**: `external/cmd/modus-memory/doctor.go:42-158`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:455-555`
- **What it does**: Modus’s `doctor` explicitly flags missing `subject`/`predicate`, duplicate `subject+predicate` pairs, and contradictory values for the same pair. Public’s current health surface is stronger on infrastructure integrity than on fact-content linting.
- **Why it matters for us**: This complements Public’s existing infra health checks instead of replacing them. It is one of the few Modus hygiene ideas that adds net-new value.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 9: Reject Modus’s fuzzy Jaccard result-cache contract
- **Source**: `external/internal/index/cache.go:10-17,41-119`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:502-529,718-755`
- **What it does**: Modus reuses cached result sets on exact hash hits or Jaccard-similar query term sets. Public’s search surface has too many scoring knobs—scope, archived filtering, session/causal boost, rerank, quality thresholds, trace/profile flags—for fuzzy query reuse to be safe.
- **Why it matters for us**: This is the wrong cache contract for Public. Similar text is not enough to guarantee equivalent retrieval intent or scoring context.
- **Recommendation**: reject
- **Impact**: high

### Finding 10: Reject Modus’s permissive markdown parse/write contract
- **Source**: `external/internal/markdown/parser.go:98-159,161-186`; `external/internal/markdown/writer.go:10-52`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220-220`
- **What it does**: Modus treats malformed YAML as body, skips parse failures during scans, and writes markdown directly with minimal validation. That is good for a personal vault, but it optimizes for permissiveness over authoritative ingestion.
- **Why it matters for us**: Public’s memory layer is intentionally more governed. Regressing to Modus’s permissive storage contract would weaken memory integrity for little gain.
- **Recommendation**: reject
- **Impact**: high

### Finding 11: Reject default write-on-read as Public’s default policy
- **Source**: `external/internal/mcp/vault.go:311-317`; `external/internal/vault/facts.go:188-217`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519-520,797-802`
- **What it does**: Modus treats every returned fact as a successful recall and asynchronously reinforces it. Public already supports access effects, but keeps them explicit with `trackAccess=false` by default.
- **Why it matters for us**: Public’s graded FSRS model is stronger than Modus’s success-only reinforce loop. Default write-on-read would blur retrieval and review, inflate successful-recall history, and make future due-state less trustworthy.
- **Recommendation**: reject
- **Impact**: high

### Finding 12: Reject trust-stage metadata unless it becomes real gating
- **Source**: `external/internal/vault/trust.go:11-82`; `external/internal/mcp/vault.go:610-635,681-777`; repo search on `external/internal/**/*.go` shows trust-stage calls only in trust read/write surfaces
- **What it does**: Modus persists trust stage and exposes get/set tools, but current code does not use that state to gate PR or other mutation tools. It is posture metadata, not enforced runtime policy.
- **Why it matters for us**: Public should not copy symbolic governance. If autonomy stages are added, they must actually gate review, proposal, or mutation flows.
- **Recommendation**: reject
- **Impact**: medium

## Sources Consulted
- `external/internal/index/bm25.go`
- `external/internal/index/cache.go`
- `external/internal/index/crossref.go`
- `external/internal/index/facts.go`
- `external/internal/index/indexer.go`
- `external/internal/librarian/search.go`
- `external/internal/markdown/parser.go`
- `external/internal/markdown/writer.go`
- `external/internal/mcp/memory.go`
- `external/internal/mcp/vault.go`
- `external/internal/vault/facts.go`
- `external/internal/vault/prs.go`
- `external/internal/vault/trust.go`
- `external/internal/vault/missions.go`
- `external/internal/learnings/learnings.go`
- `external/internal/vault/vault.go`
- `external/cmd/modus-memory/doctor.go`
- `external/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- `research/iterations/iteration-010.md`
- `research/iterations/iteration-012.md`
- `research/iterations/iteration-013.md`
- `research/iterations/iteration-014.md`
- `research/iterations/iteration-015.md`
- `research/iterations/iteration-017.md`
- `research/iterations/iteration-018.md`
- `research/iterations/iteration-019.md`

## Assessment
- New information ratio: 0.39
- Questions addressed: which Modus patterns still survive final scrutiny; which ones are operator-surface wins versus retrieval regressions; whether broader control-plane ideas like PRs and trust stages hold up in code; what the final adopt/prototype/reject map should be.
- Questions answered: Public should **not** become “Modus with hybrid search.” It should keep its stronger hybrid/governed core, **ship review + doctor first**, then add **due-state and proposal workflow** as real product surfaces, while rejecting Modus’s fuzzy caching, permissive markdown semantics, and default write-on-read policy.

## Reflection
- What worked: The best synthesis came from tracing every promising Modus surface back to its actual state mutation path, then comparing that against the concrete Public MCP surface. That separated “good operator UX” from “unsafe simplification.”
- What did not work: Modus’s README value proposition is directionally right, but most of the final classification turned on source-level details the README does not encode—especially duplicate retrieval paths, success-only reinforce semantics, and the non-enforced trust-stage model.

## Recommended Next Focus
Turn this synthesis into implementation design: define the Public `memory_review` API first, add a doctor-style formatter over `memory_health`, then write the due-state ADR (`persisted next_review_at` vs deterministic derivation) before scoping `memory_due` and the proposal inbox.


Total usage est:        1 Premium request
API time spent:         4m 14s
Total session time:     4m 32s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.3m in, 14.8k out, 1.1m cached, 6.4k reasoning (Est. 1 Premium request)
