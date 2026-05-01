# Iteration 030: FINAL EXTENDED SYNTHESIS

## Focus
FINAL EXTENDED SYNTHESIS: integrate the full 30-iteration run, update the adopt/prototype/reject map, and collapse Engram’s ideas into one definitive recommendation set for Spec Kit Memory.

## Findings
### Finding 1: Add a deterministic recent-session digest, but keep Public’s existing trust-bound resume/bootstrap authority
- **Source**: `001-engram-main/external/internal/store/store.go:1613-1667`; `001-engram-main/external/internal/mcp/mcp.go:375-395,460-562`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400-614`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163-240`
- **What it does**: Engram’s strongest reusable idea is not `mem_session_start`/`mem_session_end`; it is the bounded, deterministic digest over recent sessions, prompts, and observations that `mem_context` exposes. Public already has the stronger substrate in `session_resume`/`session_bootstrap`, but it lacks an equally cheap, stable recent-history block.
- **Why it matters**: This is the highest-leverage continuity win from the full research run: better startup clarity, better compaction survival, and zero need to split lifecycle authority.
- **Recommendation**: adopt now
- **Priority**: P1
- **Effort**: 3/5
- **Impact score**: 5/5
- **Impact**: high

### Finding 2: Package memory usage as a thin action card plus one-command runtime setup, not as duplicated runtime-specific logic
- **Source**: `001-engram-main/external/README.md:35-58`; `001-engram-main/external/docs/AGENT-SETUP.md:27-36,111-122,147-158`; `001-engram-main/external/docs/PLUGINS.md:13-37,48-57,76-120`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:741-811`
- **What it does**: Engram wins hard on DX: setup is productized, recovery instructions are portable, and plugins stay thin while the core memory semantics stay centralized.
- **Why it matters**: Public already has the better memory core; what it lacks is a similarly easy install/bootstrap/export story. This should be a delivery-layer improvement over existing `session_bootstrap`, `session_resume`, `memory_context`, and health surfaces.
- **Recommendation**: adopt now
- **Priority**: P2
- **Effort**: 3/5
- **Impact score**: 5/5
- **Impact**: high

### Finding 3: Keep semantic-first hybrid retrieval as the main recall engine, but add an explicit exact-key lexical lane for handles and artifact names
- **Source**: `001-engram-main/external/internal/store/store.go:1474-1519,1546-1583,3384-3391`; `001-engram-main/external/docs/ARCHITECTURE.md:86-116`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:48-56,113-164`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:973-1253,1747-1779`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184-520`
- **What it does**: Engram proves the value of deterministic exact-key lookup, but not of lexical-first retrieval overall. Public’s semantic-first fusion, reranking, trigger lane, and lexical sublanes are already stronger; the gap is a first-class exact-handle lane for artifact names and future thread keys.
- **Why it matters**: This is the cleanest search improvement surfaced across iterations 5, 8, 20, 21, and 26: exact identifiers should bypass ambiguity, while concept discovery should stay semantic-first.
- **Recommendation**: adopt now
- **Priority**: P3
- **Effort**: 2/5
- **Impact score**: 5/5
- **Impact**: high

### Finding 4: Add a read-only doctor/scorecard surface over existing diagnostics instead of widening `memory_search`
- **Source**: `001-engram-main/external/internal/mcp/mcp.go:399-411,415-457`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:296-594`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:33-195`; `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:223-326`; `.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:73-78,102-220,691-727`
- **What it does**: Across the run, the consistent pattern was that recovery, repair, review, and benchmarking should sit beside recall, not inside it. Public already has the pieces; it lacks a single operator-facing composite.
- **Why it matters**: This is the fastest way to improve observability and usability without touching ranking semantics or weakening trust boundaries.
- **Recommendation**: adopt now
- **Priority**: P4
- **Effort**: 3/5
- **Impact score**: 4/5
- **Impact**: high

### Finding 5: Prototype metadata-first `thread_key` plus chronology-around-hit, but do not copy Engram’s overwrite-first upsert model
- **Source**: `001-engram-main/external/internal/store/store.go:948-1068,1474-1519,3201-3278`; `001-engram-main/external/internal/mcp/mcp.go:302-324,416-457`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:92-178`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:345-444`
- **What it does**: Engram’s unique architectural idea is stable topic identity tied to exact lookup and surrounding chronology. The value is real, but its live-row upsert pattern is too lossy for Public’s evidence-rich markdown save model.
- **Why it matters**: This is worth exploring for long-lived ADRs, research lines, and bug threads, but only as additive metadata and follow-up retrieval affordances.
- **Recommendation**: prototype later
- **Priority**: P5
- **Effort**: 4/5
- **Impact score**: 4/5
- **Impact**: high

### Finding 6: Governed passive capture plus hygiene telemetry is the main true net-new feature area
- **Source**: `001-engram-main/external/internal/store/store.go:959-1056,3396-3495`; `001-engram-main/external/internal/mcp/mcp.go:565-590`; `.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:1-213`; `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:218-280`
- **What it does**: Engram treats passive capture as a first-class extraction path and reports useful yield metrics (`Extracted`, `Saved`, `Duplicates`). It also exposes hygiene metadata (`revision_count`, `duplicate_count`, `deleted_at`, `last_seen_at`) more directly than Public does today.
- **Why it matters**: If Public adds a session-end or passive-learning lane, it should arrive with provenance, reviewability, transactional semantics, and explicit hygiene/yield scorecarding from day one.
- **Recommendation**: NEW FEATURE
- **Priority**: P6
- **Effort**: 4/5
- **Impact score**: 5/5
- **Impact**: high

### Finding 7: Delivery-layer tool bundles are worth prototyping, but only as packaging over the full Spec Kit Memory surface
- **Source**: `001-engram-main/external/internal/mcp/mcp.go:7-13,50-79,121-138,169-210,375-619`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:230-239,733-756`
- **What it does**: Engram’s `ProfileAgent`/`ProfileAdmin` split helps discoverability and reduces prompt clutter, but it is primarily a packaging trick, not a core memory-system innovation.
- **Why it matters**: The action-card/setup work should land first. Actual profile-aware registration or beginner bundles can come later if the broad Public tool surface still proves noisy.
- **Recommendation**: prototype later
- **Priority**: P7
- **Effort**: 2/5
- **Impact score**: 3/5
- **Impact**: medium

### Finding 8: Explicitly reject Engram’s permissive lifecycle/scope model and its lexical-first recovery shortcuts as design targets for Public
- **Source**: `001-engram-main/external/internal/mcp/mcp.go:187-192,253-258,385-390,515-562`; `001-engram-main/external/internal/store/store.go:959-976,1462-1584`; `001-engram-main/external/plugin/opencode/engram.ts:423-447`; `001-engram-main/external/plugin/claude-code/scripts/post-compaction.sh:30-88`; `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:357-435`; `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:158-165,177-193,218-280,456-493`
- **What it does**: The most dangerous things to copy are Engram’s silent session auto-create behavior, coarse `project`/`personal` scope model, second explicit lifecycle authority, model-authored compaction writeback checkpointing, and lexical-first retrieval as a replacement for Public’s hybrid stack.
- **Why it matters**: These all cut directly against Public’s strongest existing advantages: trusted session handling, governed scopes, spec-folder authority, transport-owned recovery, and semantic/graph-aware retrieval.
- **Recommendation**: reject
- **Priority**: P8
- **Effort**: 1/5
- **Impact score**: 5/5
- **Impact**: high

## Assessment
- New information ratio: 0.14

## Recommended Next Focus
Implement P1-P4 as the production track, isolate P5-P7 as bounded prototypes, and record P8 as explicit non-goals so future work does not accidentally regress session trust, scope governance, or semantic-first retrieval.


Total usage est:        1 Premium request
API time spent:         2m 14s
Total session time:     2m 30s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  677.8k in, 9.9k out, 600.1k cached, 4.4k reasoning (Est. 1 Premium
 request)
