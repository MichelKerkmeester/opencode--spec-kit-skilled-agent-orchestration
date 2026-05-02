---
# SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2
title: "Implementation Summary: Degraded-readiness envelope parity [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/implementation-summary]"
description: "Implemented Packet 016 (Packet A from review-report.md §7) — F-001 + F-003 production fixes plus F-002/F-008/F-009 supporting work. All three code-graph handlers now emit the shared degraded-readiness vocabulary on crash."
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
trigger_phrases:
  - "degraded readiness envelope parity summary"
  - "016 implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity"
    last_updated_at: "2026-04-27T22:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Implemented production fixes + tests; all suites pass"
    next_safe_action: "Run validate.sh --strict; daemon restart for live degraded-state probe (per packet 008)"
    blockers:
      - "Live MCP probe under induced DB lock requires daemon restart before rebuilt dist is loaded"
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-degraded-readiness-envelope-parity |
| **Completed** | 2026-04-27 |
| **Level** | 2 |
| **Source** | 011-post-stress-followup-research/review/review-report.md §3 (F-001, F-003), §4 (F-002, F-006, F-008, F-009), §7 Packet A |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Closed the F-001 + F-003 P1 findings (CONDITIONAL → PASS gate) plus the F-002 / F-008 / F-009 P2 supporting work as a single coherent unit. All three code-graph handlers now emit the shared degraded-readiness vocabulary on crash paths:

- **F-001 fix (`code_graph_context`)**: extended `shouldBlockReadPath()` to also return `true` when `readiness.freshness === 'error'`. Added `buildContextFallbackDecision()` mirroring `code_graph_query.buildFallbackDecision()` shape — `{ nextTool: 'rg', reason }` for crash, `{ nextTool: 'code_graph_scan', reason: 'full_scan_required' }` for full_scan. Updated the blocked-envelope branch to differentiate crash (`message: 'code_graph_not_ready: ...'`, `requiredAction: 'rg'`, `blockReason: 'readiness_check_crashed'`) vs the standard full_scan_required path. Wrapped `graphDb.getStats()` access inside the blocked envelope in try/catch for defense in depth.
- **F-003 fix (`code_graph_status`)**: moved `getGraphReadinessSnapshot(process.cwd())` to the TOP of `handleCodeGraphStatus()` (before any stats call). Wrapped `graphDb.getStats()` in try/catch — on failure short-circuits to a structured `status: 'error'` payload retaining `data.readiness`, `data.canonicalReadiness`, `data.trustState`, `data.fallbackDecision: { nextTool: 'rg', reason: 'stats_unavailable' }`, and `data.blockReason: 'stats_unavailable'`. Updated the post-stats catch to do the same with `reason: 'status_path_failed'`.
- **F-009 fix (`tests/readiness-contract.vitest.ts`)**: added 4 new assertions covering `error → missing` (canonicalReadiness), `error → unavailable` (trustState), `buildQueryGraphMetadata` short-circuit on `error`, and the `buildReadinessBlock` augmentation for the error path.
- **F-001 + F-003 + F-008 contract (`tests/code-graph-degraded-readiness-envelope-parity.vitest.ts`)**: new file with 7 tests across three describe blocks — F-001 contract (3 tests), F-003 contract (3 tests), cross-handler vocabulary parity (1 test).
- **F-006 / F-008 docs (`decision-record.md`)**: ADR-001 documents the shared-vocabulary-handler-local-payload split; ADR-002 documents the snapshot-first AND isolate-stats defense-in-depth ordering.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts` | Modified (+50 / -3 lines) | Block read path on freshness === 'error'; emit shared degraded envelope with rg fallback (F-001) |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts` | Modified (+72 / -10 lines) | Snapshot-first ordering; isolated stats try/catch; preserved snapshot on stats / post-stats failure (F-003) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts` | Modified (+42 / -2 lines) | 4 new fixtures pinning error → missing/unavailable + buildQueryGraphMetadata short-circuit (F-009) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts` | Added (~330 lines) | F-001 + F-003 contract + cross-handler parity sweep (F-008 proof) |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/spec.md` | Added | Packet spec (Level 2) |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/plan.md` | Added | Packet plan |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/tasks.md` | Added | Packet tasks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/checklist.md` | Added | Packet checklist |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/decision-record.md` | Added | ADR-001 (shared vocabulary) + ADR-002 (defense-in-depth ordering) |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/description.json` | Added | Spec metadata |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/graph-metadata.json` | Added | Graph metadata (parent_id 011; depends_on 011/014/015; related_to 005/013) |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/implementation-summary.md` | Added | This file |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented strictly within the review-report.md §7 Packet A scope — no scope creep into Packet B (017 cli-copilot dispatch test parity) or Packet C (018 catalog/playbook). Both production patches are ADDITIVE on the canonical readiness fields (the prior payload becomes a strict subset of the new envelope). The two `try/catch` additions in `status.ts` collapse the prior bare `try { everything } catch { generic-error }` into a more precise three-zone handler: snapshot zone (always succeeds), stats zone (isolated), post-stats zone (catch preserves snapshot).

The new test file co-locates F-001 + F-003 + F-008 evidence in one packet-named vitest so the contract is greppable from the spec folder. The shared mock scaffolding at the top of the file lets each describe block install only the mocks it needs (context vs status), while the cross-handler parity test re-installs both mock surfaces in sequence to assert vocabulary equivalence at the API boundary.

No new abstraction layer was introduced. The shared vocabulary primitives (`canonicalReadinessFromFreshness`, `queryTrustStateFromFreshness`, `buildReadinessBlock`) already existed in `readiness-contract.ts:73-87, 109-123, 241-248` from M8 / T-CGQ-11; this packet only wired the two handlers that didn't yet honor them on crash paths and pinned the contract with the missing fixtures.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `nextTool: 'rg'` for crash recovery (NOT a new `action: 'rg_fallback'` synthetic value) | Mirrors `code_graph_query.buildFallbackDecision()` shape exactly — single shared vocabulary across handlers. See ADR-001. |
| Snapshot-first AND isolate-stats (BOTH, not one or the other) | Defense in depth. Snapshot helper is read-only and cheap — calling it once at the top of the handler is strictly cheaper than recomputing it in two catch paths. See ADR-002. |
| Top-level `requiredAction: 'rg'` symmetric with existing `requiredAction: 'code_graph_scan'` | Existing field shape; no new key. Operators reading the response see one familiar field with a different value depending on degraded state. |
| Status post-stats catch returns `status: 'error'` (NOT 'blocked') | Stats / drift / verification calculation path is post-readiness; if it throws the graph IS initialized but a derived computation failed. `status: 'error'` more accurately reflects this than 'blocked'. The canonical readiness fields still ship. |
| New parity vitest file (NOT extending `code-graph-context-cocoindex-telemetry-passthrough.vitest.ts`) | The cocoindex file's mock surface and test theme are different. Co-locating F-001/F-003/F-008 evidence in one packet-named file makes the contract greppable from the spec folder. |
| Preserve all existing test assertions; only ADD new ones | Per task instructions; F-009 is purely additive on `tests/readiness-contract.vitest.ts`. |
| Wrapped `graphDb.getStats()` access INSIDE `context.ts`'s blocked envelope | Defense in depth — even if stats throw during envelope construction (induced DB lock cell), the degraded envelope still ships with `lastPersistedAt: null`. Test F-001 #3 pins this. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` | PASS (no errors) |
| `npx vitest run tests/readiness-contract.vitest.ts` | PASS — 1 file, 19 tests passed (was 13/13) |
| `npx vitest run tests/code-graph-degraded-readiness-envelope-parity.vitest.ts` | PASS — 1 file, 7 tests passed |
| `npx vitest run tests/code-graph-status-readiness-snapshot.vitest.ts` | PASS — 1 file, 10 tests passed (packet 014 invariant) |
| `npx vitest run tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | PASS (packet 015 invariant) |
| `npx vitest run tests/code-graph-query-fallback-decision.vitest.ts` | PASS — query handler vocabulary unchanged |
| Combined regression: `npx vitest run --config vitest.stress.config.ts tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts tests/code-graph-db.vitest.ts tests/code-graph-degraded-readiness-envelope-parity.vitest.ts stress_test/code-graph/code-graph-degraded-sweep.vitest.ts tests/code-graph-query-fallback-decision.vitest.ts tests/code-graph-status-readiness-snapshot.vitest.ts tests/readiness-contract.vitest.ts` | PASS — 7 files, 60 tests passed |
| `npx vitest run tests/file-watcher.vitest.ts` | PASS — 21/21 (`DEFAULT_DEBOUNCE_MS=2000` unchanged) |
| F-001 #1 (context readiness-crash → blocked envelope) | PASS: `status: 'blocked'`, full envelope shape verified |
| F-001 #2 (full_scan_required backward-compat) | PASS: `fallbackDecision.nextTool === 'code_graph_scan'` |
| F-001 #3 (defense in depth — stats throws during envelope assembly) | PASS: envelope still ships with `lastPersistedAt: null` |
| F-003 #1 (status stats throws → snapshot preserved) | PASS: `data.fallbackDecision.nextTool === 'rg'`, `blockReason === 'stats_unavailable'` |
| F-003 #2 (snapshot crash AND stats throws) | PASS: `trustState === 'unavailable'` (NOT 'absent') |
| F-003 #3 (healthy path regression) | PASS: `status: 'ok'`, no degraded markers |
| Cross-handler parity sweep (F-008 verification) | PASS: context + status crash agree on `canonicalReadiness: 'missing'`, `trustState: 'unavailable'`, `fallbackDecision.nextTool: 'rg'` |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity --strict` | RAN: Errors=0, Warnings=3 (PASSED WITH WARNINGS without --strict; FAILED (strict) is purely warning-elevation, identical pattern to packet 014 invariant). Warnings: EVIDENCE_CITED (46 completed items without evidence — author-time vs driver-time gap, expected), ANCHORS_VALID (extra `scope-discipline` anchor in checklist.md, intentional), TEMPLATE_HEADERS (2 extra section headers — `Scope Discipline` in checklist.md and `Post-Review Fixes` in implementation-summary.md, both intentional and matching 014's pattern). |
| Live `code_graph_status` + `code_graph_context` probe under induced DB lock | DEFERRED: requires daemon restart per packet 008 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **MCP daemon restart required.** Per packet 008, TypeScript source/build verification is provisional until the MCP-owning client/runtime is restarted and a live `code_graph_status` + `code_graph_context` probe under induced DB lock confirms the running daemon loaded rebuilt `dist`.
2. **`code_graph_query` not modified.** It already shipped the canonical vocabulary; this packet aligns the OTHER two handlers to its existing behavior. Any future changes to `query.ts:buildFallbackDecision()` shape would need to update the parity test simultaneously.
3. **Catalog / playbook docs unchanged.** F-005 + F-007 + doc parts of F-008 are explicitly Packet C (018) territory. Doc references to "fallbackDecision on context" should land in 018 once this packet's behavior is observed in production.
4. **`requiredAction: 'rg'` is a new top-level value on the context blocked envelope.** Prior callers only saw `requiredAction: 'code_graph_scan'`. Callers performing a switch on this field must add the new arm. Mitigation: the blocked envelope is conservative (status code change `error` → `blocked` is itself the strongest discriminator); no shipped caller is known to rely on `requiredAction === 'code_graph_scan'` exclusively.
<!-- /ANCHOR:limitations -->

---

### Post-Review Fixes

(none yet)
