---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: Degraded-readiness envelope parity [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/tasks]"
description: "Per-REQ work units for Packet 016 — F-001 + F-003 production fixes plus F-002/F-008/F-009 supporting work."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "degraded readiness envelope parity tasks"
  - "016 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity"
    last_updated_at: "2026-04-27T22:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Decomposed work units"
    next_safe_action: "validate.sh --strict"
    blockers: []
    key_files: ["tasks.md"]
    completion_pct: 92
    open_questions: []
    answered_questions: []
---
# Tasks: Degraded-readiness envelope parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Read review-report.md §3, §4, §7 Packet A end-to-end (from ../011-post-stress-followup-research/review/)
- [x] T002 Read `context.ts:1-320`, `status.ts:1-250`, `ensure-ready.ts:507-525`, `readiness-contract.ts:1-249`, and `query.ts:780-830, 1075-1130` to lock down call shapes and existing helpers
- [x] T003 Author spec.md / plan.md / tasks.md / checklist.md / decision-record.md
- [x] T004 [P] Generate description.json + graph-metadata.json
- [x] T005 Author implementation-summary.md (filled in, NOT placeholder)
- [ ] T006 Pass `validate.sh --strict`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### F-001: code_graph_context degraded envelope (REQ-001..003)
- [x] T101 Modify `context.ts:shouldBlockReadPath()` to also return `true` when `readiness.freshness === 'error'`. Add inline comment citing packet 016 / F-001.
- [x] T102 Add `buildContextFallbackDecision()` helper mirroring `query.ts:buildFallbackDecision()` shape: returns `{ nextTool: 'rg', reason }` for crash and `{ nextTool: 'code_graph_scan', reason: 'full_scan_required' }` for full_scan_required (REQ-003).
- [x] T103 Update the blocked-envelope branch (formerly lines 146-169) to differentiate crash (`isCrash = readiness.freshness === 'error'`) vs full_scan_required: crash uses `message: 'code_graph_not_ready: ...'`, `requiredAction: 'rg'`, `blockReason: 'readiness_check_crashed'`; full_scan uses prior wording (REQ-002, REQ-003).
- [x] T104 Wrap `graphDb.getStats()` access inside the blocked envelope in try/catch so a degraded DB doesn't suppress the envelope; `lastPersistedAt: null` on failure (defense in depth).
- [x] T105 Verify the existing fallthrough error branch (lines 308-317) is no longer reachable for readiness-crash cases; it remains as last-resort for `buildContext()` failures on healthy readiness paths.

### F-002 / F-003: code_graph_status snapshot-first + isolated stats (REQ-004..006)
- [x] T106 Move `getGraphReadinessSnapshot(process.cwd())` to the TOP of `handleCodeGraphStatus()` (before any `graphDb.getStats()` access) — REQ-004.
- [x] T107 Wrap `graphDb.getStats()` in try/catch. On failure, short-circuit to a structured `status: 'error'` response that retains `data.readiness`, `data.canonicalReadiness`, `data.trustState`, `data.fallbackDecision: { nextTool: 'rg', reason: 'stats_unavailable' }`, and `data.blockReason: 'stats_unavailable'` — REQ-005.
- [x] T108 Update the post-stats catch path to preserve the snapshot via `buildReadinessBlock(...)` and emit `data.fallbackDecision: { nextTool: 'rg', reason: 'status_path_failed' }` (REQ-006). The catch path no longer returns a generic init error string.
- [x] T109 Typecheck `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` PASS.

### F-008: shared vocabulary docs
- [x] T110 Author `decision-record.md` ADR-001 (shared vocabulary vs handler-local payloads) and ADR-002 (snapshot-first AND isolate-stats: defense in depth).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### F-009: extend readiness-contract suite (REQ-007)
- [x] T201 Add `canonicalReadinessFromFreshness('error') === 'missing'` assertion.
- [x] T202 Add `queryTrustStateFromFreshness('error') === 'unavailable'` assertion + extend the canonical-union sweep to include 'error'.
- [x] T203 Add `buildQueryGraphMetadata({ freshness: 'error', ... })` returns `undefined` and does NOT consult the db helper.
- [x] T204 Add `buildReadinessBlock({ freshness: 'error', ... })` augments with `canonicalReadiness: 'missing'`, `trustState: 'unavailable'` (and preserves raw fields).

### F-001 + F-003 + F-008: dedicated parity vitest (REQ-001..006, REQ-008)
- [x] T205 Create `tests/code-graph-degraded-readiness-envelope-parity.vitest.ts`.
- [x] T206 F-001 #1: `ensureCodeGraphReady` rejects → `status: 'blocked'`, full envelope shape verified (`graphAnswersOmitted`, canonicalReadiness, trustState, requiredAction, blockReason, fallbackDecision.nextTool='rg').
- [x] T207 F-001 #2: ensureCodeGraphReady resolves with `freshness: 'empty', action: 'full_scan'` → standard full_scan_required envelope, `fallbackDecision.nextTool === 'code_graph_scan'`. Backward-compat regression.
- [x] T208 F-001 #3: defense in depth — readiness rejects AND `getStats()` throws inside the envelope assembly → envelope still ships, `lastPersistedAt: null`, `fallbackDecision.nextTool === 'rg'`.
- [x] T209 F-003 #1: snapshot returns `empty/full_scan`, `getStats()` throws → `status: 'error'`, readiness preserved, `fallbackDecision.nextTool === 'rg'`, `blockReason === 'stats_unavailable'`.
- [x] T210 F-003 #2: snapshot returns `error/none`, `getStats()` throws → `trustState: 'unavailable'` (NOT 'absent').
- [x] T211 F-003 #3: healthy path regression — snapshot fresh, stats OK → `status: 'ok'`, no `degraded` marker, no `fallbackDecision`.
- [x] T212 Cross-handler parity (REQ-008): context crash AND status crash agree on `canonicalReadiness: 'missing'`, `trustState: 'unavailable'`, `fallbackDecision.nextTool: 'rg'`, `graphAnswersOmitted: true`.

### Regression sweep
- [x] T213 `npx vitest run tests/readiness-contract.vitest.ts` PASS (19/19, was 13/13).
- [x] T214 `npx vitest run tests/code-graph-degraded-readiness-envelope-parity.vitest.ts` PASS (7/7).
- [x] T215 `npx vitest run tests/code-graph-status-readiness-snapshot.vitest.ts` PASS (10/10) — packet 014 invariant.
- [x] T216 `npx vitest run tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` PASS — packet 015 invariant (REQ-010).
- [x] T217 `npx vitest run tests/code-graph-query-fallback-decision.vitest.ts` PASS — query handler vocabulary unchanged.
- [x] T218 Combined code-graph regression: `npx vitest run --config vitest.stress.config.ts tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts tests/code-graph-db.vitest.ts tests/code-graph-degraded-readiness-envelope-parity.vitest.ts stress_test/code-graph/code-graph-degraded-sweep.vitest.ts tests/code-graph-query-fallback-decision.vitest.ts tests/code-graph-status-readiness-snapshot.vitest.ts tests/readiness-contract.vitest.ts` PASS (60/60).
- [x] T219 `npx vitest run tests/file-watcher.vitest.ts` PASS (21/21) — `DEFAULT_DEBOUNCE_MS=2000` unchanged.

### Driver-side gates
- [ ] T220 `validate.sh --strict` PASS recorded in implementation-summary.md.
- [ ] T221 Daemon restart + live `code_graph_status` + `code_graph_context` probe under induced DB lock — deferred per packet 008.
- [ ] T222 Mark all REQ-001..010 PASSED on completion.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Phase 1 + Phase 2 + Phase 3 (T201..T219) complete
- [x] REQ-001..003 covered by F-001 tests in the new parity vitest
- [x] REQ-004..006 covered by F-003 tests in the new parity vitest
- [x] REQ-007 covered by extended readiness-contract.vitest.ts (4 new assertions)
- [x] REQ-008 covered by the cross-handler parity test
- [x] REQ-009 covered by un-modified packet 014 vitest still passing
- [x] REQ-010 covered by un-modified packet 015 vitest still passing
- [ ] `validate.sh --strict` PASS recorded in implementation-summary.md
- [ ] Live degraded probe verification recorded post-restart
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: spec.md
- **Plan**: plan.md
- **Checklist**: checklist.md
- **Decision Record**: decision-record.md
- **Implementation Summary**: implementation-summary.md
- **Sources**: ../011-post-stress-followup-research/review/review-report.md §3 (F-001, F-003), §4 (F-002, F-006, F-008, F-009), §7 Packet A
- **Companions**: ../014-graph-status-readiness-snapshot (snapshot helper foundation); ../015-cocoindex-seed-telemetry-passthrough (cocoindex healthy path); ../013-graph-degraded-stress-cell (stress cell this remediation closes); ../005-code-graph-fast-fail (related readiness vocabulary)
<!-- /ANCHOR:cross-refs -->
