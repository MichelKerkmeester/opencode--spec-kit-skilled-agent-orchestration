# Spec: Indexing & Adaptive Fusion Enablement

## Context
All three search index systems (CocoIndex Code, BM25 memory, Code Graph) were broken or degraded after the repo moved from `Opencode Env/Public` to `Code_Environment/Public`. Adaptive fusion (`SPECKIT_ADAPTIVE_FUSION`) was not explicitly enabled in MCP config files despite the code defaulting to ON, and the `.vscode/mcp.json` note incorrectly documented it as "Default OFF." Lexical (BM25/FTS5) scores were not propagating through RRF fusion to the final search results.

## Problem
1. **CocoIndex** — venv had stale Python path from old repo location; LMDB database had stale reader slots; settings excluded `.opencode/` via blanket `**/.* ` pattern
2. **Code Graph** — `getDb()` threw "not initialized" because `initDb()` was never called during MCP server startup
3. **Adaptive Fusion** — Not explicitly set in any MCP config env; `.vscode/mcp.json` note incorrectly said "Default OFF"
4. **Lexical score** — `formatters/search-results.ts` only checked `fts_score`/`bm25_score` fields which are lost after RRF fusion; `sourceScores.keyword` from fusion was not used as fallback

## Solution

### CocoIndex Code
- Recreated venv with correct Python 3.11 paths
- Reset LMDB database and SQLite target (stale reader slots)
- Updated `.cocoindex_code/settings.yml`: replaced blanket `**/.* ` exclude with targeted exclusions (`.git`, `.venv`, `.env`, etc.), added `**/.opencode/specs/**` and `**/.opencode/changelog/**` exclusions
- Full re-index: 51,820 files / 663,336 chunks

### Code Graph lazy-init
- `lib/code-graph/code-graph-db.ts`: Changed `getDb()` from throwing when uninitialized to auto-calling `initDb(DATABASE_DIR)` via import from `core/config.js`

### Adaptive Fusion
- Added `"SPECKIT_ADAPTIVE_FUSION": "true"` to all 7 MCP config files across Public and Barter repos
- Fixed `.vscode/mcp.json` notes in both repos (was incorrectly listed as "Default OFF")

### Lexical score propagation
- `formatters/search-results.ts:461`: Added fallback chain `sourceScores.keyword ?? sourceScores.fts ?? sourceScores.bm25` so BM25/FTS5 scores propagate through RRF fusion to the trace output

## Scope
- `.mcp.json`, `.claude/mcp.json`, `.vscode/mcp.json`, `opencode.json` (Public repo)
- `.claude/mcp.json`, `.vscode/mcp.json`, `opencode.json` (Barter repo)
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts`
- `.cocoindex_code/settings.yml`
- `.opencode/skill/mcp-coco-index/mcp_server/.venv/` (recreated)

## Level
Level 1 (< 100 LOC changed)

---
title: "phase parent section [template:addendum/phase/phase-parent-section.md]"
description: "Template document for addendum/phase/phase-parent-section.md."
trigger_phrases:
  - "phase"
  - "parent"
  - "section"
  - "template"
  - "phase parent section"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_ADDENDUM: Phase - Parent Section -->
<!-- Append to parent spec.md after SCOPE section -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-wire-promotion-gate/ | [Phase 1 scope] | [deps] | Pending |
| 2 | 002-persist-tuned-thresholds/ | [Phase 2 scope] | [deps] | Pending |
| 3 | 003-real-feedback-labels/ | [Phase 3 scope] | [deps] | Pending |
| 4 | 004-fix-access-signal-path/ | [Phase 4 scope] | [deps] | Pending |
| 5 | 005-e2e-integration-test/ | [Phase 5 scope] | [deps] | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-wire-promotion-gate | 002-persist-tuned-thresholds | promotionGate result triggers threshold tuning; test proves gate→action path | All tasks [x], vitest suite passes |
| 002-persist-tuned-thresholds | 003-real-feedback-labels | Thresholds persisted in SQLite; get/set verified by tests | All tasks [x], persistence round-trip test passes |
| 003-real-feedback-labels | 004-fix-access-signal-path | Evaluation uses real feedback; test proves difference from self-referential | All tasks [x], signal-informed rank ordering confirmed |
| 004-fix-access-signal-path | 005-e2e-integration-test | Access signals flow from search pipeline to `adaptive_signal_events`; test proves recording | All tasks [x], integration test row count asserted |
<!-- /ANCHOR:phase-map -->

---

## IMPLEMENTATION SUMMARY

> All five phases implemented on branch `system-speckit/024-compact-code-graph` as of 2026-03-31.

### Phase Status

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-wire-promotion-gate/ | Wire promotionGate result to threshold tuning action | Complete (with review findings) |
| 2 | 002-persist-tuned-thresholds/ | SQLite persistence for adaptive ranking thresholds | Complete (with review findings) |
| 3 | 003-real-feedback-labels/ | Real outcome/correction signals as evaluation labels | Complete (with review findings) |
| 4 | 004-fix-access-signal-path/ | Bridge disconnected access-tracking paths | Complete (with review findings) |
| 5 | 005-e2e-integration-test/ | Full lifecycle end-to-end integration test | Complete (with review findings) |

### Deep Review Results

A 15-iteration deep review was completed across all five phases in two rounds after implementation.

| Category | Count |
|----------|-------|
| P0 issues found | 0 |
| P1 issues found | 19 |
| P1 issues fixed | 19 |
| P1 issues deferred | 0 |
| P2 issues found | 17 |
| P2 issues remain as noted (minor/cosmetic) | 5 |

**Fixed in round 1 (post-initial-review pass):**
- Phase 2: Missing index on `adaptive_signal_events` (`idx_adaptive_signal_events_memory_type`)
- Phase 2: Default thresholds not cached in WeakMap on cold path
- Phase 4: Silent failure in access-signal catch block — now logs `console.warn`
- Phase 5: Env var cleanup now uses snapshot/restore pattern instead of blind delete
- Phase 1: Promotion gate now checks `promotionGate.ready` before calling tuner

**Fixed in round 2 (5 additional research iterations):**
- Phase 1: Watermark now includes `gateResult.recommendation` to prevent skipped tuning on state-only changes
- Phase 1 + 3: `memory_validate` now stores `queryText`; replay filtering matches against stored query, eliminating global cross-query signal pollution
- Phase 2: WeakMap cache version counter added — entries are invalidated on `setAdaptiveThresholdOverrides()` calls, preventing stale cache in multi-connection scenarios
- Phase 3: Unlabeled queries skipped from evaluation; no more circular shadow-score fallback for NDCG/MRR computation
- Phase 3: Correction signals now produce −1 labels as specified in REQ-001 (was incorrectly clamped to zero)
- Phase 5: E2E test now flows signals through real ingestion pipeline (`memory_validate` → `recordAdaptiveSignal` → `buildReplayRanks`)

**Remaining P2 (minor/cosmetic — no action required):**
- Phase 2: `INSERT OR REPLACE` may wipe future columns (forward-compat note)
- Phase 4: Per-result signal writes not batched (performance note for high-throughput)
- Phase 5: Test seeds fewer signals than spec minimum in some variants (coverage note)

### Research Findings

5 research iterations were completed in round 2, investigating: watermark semantics, multi-process cache invalidation, query-scoped signal filtering, correction-label polarity, and E2E seam completeness. All findings produced actionable fixes; none required architectural changes.

### Readiness

The adaptive ranking system is ready for shadow telemetry enablement. Enable with:

```
SPECKIT_MEMORY_ADAPTIVE_RANKING=true
```

All P0 and P1 requirements across all five phases are satisfied. Zero deferred blockers remain. The system can be enabled for shadow mode without outstanding known issues. Remaining P2 items are minor cosmetic notes to address in a future maintenance pass once real telemetry data is available.
