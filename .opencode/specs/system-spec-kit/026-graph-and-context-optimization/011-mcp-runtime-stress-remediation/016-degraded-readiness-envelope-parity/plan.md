---
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Implementation Plan: Degraded-readiness envelope parity [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/plan]"
description: "Plan for converging code_graph_context (F-001) and code_graph_status (F-003) onto the shared degraded-readiness vocabulary that code_graph_query already ships, plus the F-002/F-008/F-009 supporting work. Two-handler patch + two-test suite (one new, one extended) + decision-record."
trigger_phrases:
  - "degraded readiness envelope parity plan"
  - "016 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity"
    last_updated_at: "2026-04-27T22:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan from review-report.md §7 Packet A scope"
    next_safe_action: "Walk tasks.md Phase 1 → 2 → 3"
    blockers: []
    key_files: ["plan.md"]
    completion_pct: 92
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Degraded-readiness envelope parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | MCP server, code-graph subsystem |
| **Storage** | sqlite (graph DB) — READ-ONLY for this packet |
| **Testing** | vitest |

### Overview
Two surgical handler patches + two test suite changes, all anchored on existing primitives:

1. **`context.ts`**: extend `shouldBlockReadPath()` to also block on `freshness === 'error'`, and emit a degraded envelope mirroring `code_graph_query.buildBlockedReadPayload()` (with `nextTool: 'rg'` for crash, `nextTool: 'code_graph_scan'` for full_scan_required). Isolate `graphDb.getStats()` access inside the blocked envelope so a stats throw doesn't bubble up.
2. **`status.ts`**: move `getGraphReadinessSnapshot()` ahead of `graphDb.getStats()`; isolate stats in try/catch and short-circuit to a structured `status: 'error'` payload that retains `readiness`, `canonicalReadiness`, `trustState`, and `fallbackDecision` when stats throw. Update the post-stats catch to do the same.
3. **`tests/readiness-contract.vitest.ts`**: append `error → missing/unavailable` fixtures plus the `buildQueryGraphMetadata` short-circuit check.
4. **`tests/code-graph-degraded-readiness-envelope-parity.vitest.ts`** (new): F-001 + F-003 contract + cross-handler parity sweep proving handlers project onto the SAME `missing` / `unavailable` / `rg` shape on crash.

No new mutating surface. No change to `getGraphReadinessSnapshot`, `buildContext`, or `readiness-contract.ts`. The shared vocabulary already exists at `readiness-contract.ts:73-87, 109-123`; this packet wires the two handlers that didn't yet honor it on crash paths.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] review-report.md §3, §4, §7 Packet A read end-to-end
- [x] `context.ts:57-59, 132-143, 253, 308-317` (F-001 evidence) read
- [x] `status.ts:161-169, 239-248` (F-003 evidence) read
- [x] `readiness-contract.ts:73-87, 109-123, 241-248` (the helper that already maps `error` correctly; tests are the gap) read
- [x] `query.ts:791-808, 810-830, 1093-1121` (canonical `fallbackDecision` shape we mirror) read

### Definition of Done
- [x] All REQ-001..010 PASS
- [x] New degraded-readiness-envelope-parity vitest passes (7/7)
- [x] Extended readiness-contract.vitest.ts passes (19/19, was 13/13)
- [x] Existing code-graph-status-readiness-snapshot.vitest.ts passes (10/10) without modification
- [x] Existing code-graph-context-cocoindex-telemetry-passthrough.vitest.ts passes without modification
- [x] Code-graph regression suite passes (60/60)
- [x] Typecheck passes (`npx tsc --noEmit`)
- [ ] `validate.sh --strict` PASS
- [ ] Live `code_graph_status` + `code_graph_context` probe on degraded DB (deferred per packet 008 daemon-rebuild protocol)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
**Shared vocabulary, handler-local payloads.** All three handlers (`context`, `status`, `query`) emit the SAME canonical fields on degraded paths (`readiness`, `canonicalReadiness`, `trustState`, `graphAnswersOmitted`, `fallbackDecision`) but each retains its tool-specific wrapping payload (`queryMode`, `subject`, `totalNodes`, etc.). This was implicit before; this packet makes it explicit and tested. See decision-record.md ADR-001.

### Key Components

- **`code_graph/handlers/context.ts`** (modified):
  - `shouldBlockReadPath()` now also returns `true` when `readiness.freshness === 'error'`.
  - New helper `buildContextFallbackDecision()` mirrors `query.ts:buildFallbackDecision()` shape — `nextTool: 'rg' | 'code_graph_scan'`, `reason: <descriptive-string>`.
  - The blocked-envelope branch differentiates crash (`isCrash = true`) from full_scan_required: distinct `message`, `requiredAction`, `blockReason`. Stats access wrapped in try/catch so a degraded DB doesn't suppress the envelope.
- **`code_graph/handlers/status.ts`** (modified):
  - `getGraphReadinessSnapshot(process.cwd())` moves to the top of the handler.
  - `graphDb.getStats()` wrapped in try/catch. On failure: short-circuit to a structured `status: 'error'` payload with snapshot-derived readiness + `fallbackDecision: { nextTool: 'rg', reason: 'stats_unavailable' }`.
  - Post-stats catch path now preserves the snapshot via the same `buildReadinessBlock(...)` projection (instead of returning a generic init error string).
- **`tests/readiness-contract.vitest.ts`** (extended): three new assertions across the three describe blocks that already cover the helper API.
- **`tests/code-graph-degraded-readiness-envelope-parity.vitest.ts`** (new): 7 tests across three describe blocks — F-001 (3), F-003 (3), cross-handler parity (1).

### Data Flow

```
code_graph_context (crash)
   └─> ensureCodeGraphReady throws
   └─> readiness = { freshness: 'error', action: 'none', reason, error }
   └─> shouldBlockReadPath(readiness) → true            [F-001 fix]
   └─> buildContextFallbackDecision(readiness) → { nextTool: 'rg', reason }
   └─> blocked envelope: status='blocked', message='code_graph_not_ready: ...',
                         readiness, canonicalReadiness, trustState,
                         graphAnswersOmitted=true, requiredAction='rg',
                         blockReason='readiness_check_crashed', fallbackDecision

code_graph_status (stats crash)
   └─> snapshot = getGraphReadinessSnapshot(rootDir)    [F-003 ordering fix]
   └─> try { stats = graphDb.getStats() } catch { statsError = msg }
   └─> if (!stats) → degraded envelope: status='error',
                     readiness=buildReadinessBlock({ ...snapshot }),
                     fallbackDecision: { nextTool: 'rg', reason: 'stats_unavailable' }
                                                         [F-003 isolation fix]
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Source patches
- [x] Modify `context.ts:shouldBlockReadPath()` to block on `freshness === 'error'`.
- [x] Add `buildContextFallbackDecision()` helper to `context.ts` mirroring `query.ts` shape.
- [x] Update the blocked-envelope branch to differentiate crash vs full_scan_required and emit `fallbackDecision`. Wrap `getStats()` in try/catch.
- [x] Modify `status.ts` to move `getGraphReadinessSnapshot()` ahead of `graphDb.getStats()`.
- [x] Wrap `getStats()` in try/catch; short-circuit to degraded envelope on failure.
- [x] Update post-stats catch path to preserve the snapshot.
- [x] Typecheck `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` PASS.

### Phase 2: Tests
- [x] Extend `tests/readiness-contract.vitest.ts`:
  - [x] `canonicalReadinessFromFreshness('error') === 'missing'`
  - [x] `queryTrustStateFromFreshness('error') === 'unavailable'`
  - [x] `buildQueryGraphMetadata({ freshness: 'error', ... })` returns `undefined`, db NOT consulted
  - [x] Sweep includes 'error' in the canonical-union projection check
  - [x] `buildReadinessBlock({ freshness: 'error', ... })` augments with `canonicalReadiness: 'missing'`, `trustState: 'unavailable'`
- [x] Create `tests/code-graph-degraded-readiness-envelope-parity.vitest.ts`:
  - [x] F-001 #1: ensureCodeGraphReady throws → status='blocked', envelope preserved, fallbackDecision.nextTool='rg'
  - [x] F-001 #2: backward-compat — `freshness: 'empty'`, `action: 'full_scan'` → standard full_scan_required envelope, fallbackDecision.nextTool='code_graph_scan'
  - [x] F-001 #3: defense in depth — readiness crash AND `getStats()` throws → envelope still ships with `lastPersistedAt: null`
  - [x] F-003 #1: snapshot returns `empty/full_scan`, stats throws → status='error', readiness preserved, fallbackDecision.nextTool='rg', blockReason='stats_unavailable'
  - [x] F-003 #2: snapshot returns `error/none`, stats throws → trustState='unavailable' (NOT 'absent')
  - [x] F-003 #3: healthy path regression — snapshot fresh, stats OK → status='ok', no degraded markers
  - [x] Cross-handler parity: context crash + status crash agree on `canonicalReadiness: 'missing'`, `trustState: 'unavailable'`, `fallbackDecision.nextTool: 'rg'`

### Phase 3: Verify
- [x] `npx vitest run tests/readiness-contract.vitest.ts` PASS (19/19).
- [x] `npx vitest run tests/code-graph-degraded-readiness-envelope-parity.vitest.ts` PASS (7/7).
- [x] `npx vitest run tests/code-graph-status-readiness-snapshot.vitest.ts` PASS (10/10) — packet 014 regression.
- [x] `npx vitest run tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` PASS — packet 015 regression.
- [x] Code-graph regression: `npx vitest run tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts tests/code-graph-db.vitest.ts tests/code-graph-degraded-readiness-envelope-parity.vitest.ts tests/code-graph-degraded-sweep.vitest.ts tests/code-graph-query-fallback-decision.vitest.ts tests/code-graph-status-readiness-snapshot.vitest.ts tests/readiness-contract.vitest.ts` PASS (60/60).
- [x] `npx vitest run tests/file-watcher.vitest.ts` PASS (21/21) — `DEFAULT_DEBOUNCE_MS=2000` unchanged.
- [x] Typecheck PASS.
- [x] Author `implementation-summary.md` (filled in, not placeholder).
- [ ] `validate.sh --strict` — driver-side gate.
- [ ] Daemon restart + live degraded-state probe — driver-side gate (per packet 008).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `error → missing/unavailable` projections | vitest with hoisted module mocks |
| Contract | F-001 + F-003 envelope shape per handler | vitest mock-surface |
| Cross-handler | Vocabulary parity sweep (context vs status crash) | vitest, single test file |
| Regression | Existing packet 014 + 015 + 005 + readiness-contract suites | vitest |
| Live probe | Real daemon + induced DB lock | MCP `code_graph_status` / `code_graph_context` (deferred) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 011-post-stress-followup-research / review-report.md | Internal | Green | Source of truth |
| 014-graph-status-readiness-snapshot | Internal | Green | Read-only snapshot helper is the F-003 foundation |
| 015-cocoindex-seed-telemetry-passthrough | Internal | Green | Healthy-path tests must stay green |
| 013-graph-degraded-stress-cell | Internal | Green (related) | Stress cell this remediation closes |
| 005-code-graph-fast-fail | Internal | Green (related) | Same readiness vocabulary; no overlap |
| 008-mcp-daemon-rebuild-protocol | Internal | Green | Live probe gating |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a downstream caller hard-codes a check on `status === 'error'` for the readiness-crash branch and breaks when the new envelope ships `status === 'blocked'`. (None known per grep.)
- **Procedure**:
  1. Revert `context.ts` `shouldBlockReadPath()` to the prior single-condition form.
  2. Revert the `context.ts` blocked-envelope branch to the prior shape.
  3. Revert `status.ts` snapshot reordering and stats try/catch.
  4. Tests in `tests/readiness-contract.vitest.ts` and `tests/code-graph-degraded-readiness-envelope-parity.vitest.ts` continue to compile but the new contract assertions fail — DELETE the new test file, REVERT the new assertions in `tests/readiness-contract.vitest.ts`.
- **Risk window**: Low. The blocked envelope is a strict superset of the prior degraded payload — callers that read `data.readiness` continue to see it; callers that read the top-level `error` field still see a descriptive `message` string.
<!-- /ANCHOR:rollback -->
