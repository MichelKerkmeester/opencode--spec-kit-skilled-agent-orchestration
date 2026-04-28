---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification: code_graph_status read-only readiness snapshot [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/014-graph-status-readiness-snapshot/spec]"
description: "P2 follow-up to v1.0.2 stress test (research §5 / Q-P2). Adds a non-mutating getGraphReadinessSnapshot() helper and wires it into code_graph_status so readiness.action surfaces full_scan / selective_reindex / none instead of always emitting 'none'. Closes the 4-hour staleness drift observability gap from 010 findings §3 without lowering DEFAULT_DEBOUNCE_MS=2000."
trigger_phrases:
  - "014-graph-status-readiness-snapshot"
  - "code_graph_status readiness action"
  - "graph readiness snapshot"
  - "getGraphReadinessSnapshot helper"
  - "read-only readiness probe"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/014-graph-status-readiness-snapshot"
    last_updated_at: "2026-04-27T19:54:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored packet from 011 research §5 / Q-P2"
    next_safe_action: "Run validate.sh --strict, then commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts"
    completion_pct: 90
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: code_graph_status read-only readiness snapshot

<!-- SPECKIT_LEVEL: 1 -->
<!-- PHASE_LINKS_PARENT: ../spec.md; PREDECESSOR: 013-graph-degraded-stress-cell; SUCCESSOR: 015-cocoindex-seed-telemetry-passthrough -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Implemented |
| **Created** | 2026-04-27 |
| **Sources** | 011 research §5 (Q-P2); 010 findings.md Recommendation §3 (4h staleness drift) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
v1.0.2 stress test pre-flight detected a 4-hour staleness drift on the live code graph (`010 findings.md` lines 123-126). The watcher itself is fine — existing tests cover rapid saves, default-window coalescing, rename/delete cleanup, burst renames, concurrent renames, and symlink alias dedup with `DEFAULT_DEBOUNCE_MS=2000`. The actionable gap is **observability**, not throughput: `code_graph_status` collapses readiness-action to `"none"` (handlers/status.ts:163-194) while `ensure-ready.ts:151-217` already distinguishes:

- `full_scan` (empty graph, no tracked files, HEAD changes, broad stale)
- `selective_reindex` (bounded stale files)
- `none` (fresh)

Operators currently can't tell whether drift is "fresh" vs "needs full scan" vs "needs selective reindex" — they have to invoke `code_graph_scan` (mutating) just to find out. This is the exact pathology research §5.2 identified.

### Purpose
Add a read-only `getGraphReadinessSnapshot(rootDir)` helper that returns the same `{action, freshness, reason}` triplet `ensureCodeGraphReady` would, but WITHOUT touching the cache, the deleted-file cleanup, or the inline indexer. Wire it into `code_graph_status` so operators get a diagnostic readiness action without invoking `code_graph_scan`. Leave `DEFAULT_DEBOUNCE_MS=2000` unchanged per research §5.3 (rejected as first fix).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New `getGraphReadinessSnapshot(rootDir)` export in `mcp_server/code_graph/lib/ensure-ready.ts` (read-only).
- Wire snapshot into `mcp_server/code_graph/handlers/status.ts` lines 158-225, replacing hard-coded `action: 'none'` with snapshot-derived value.
- Vitest coverage for fresh / empty / broad-stale / bounded-stale / error states plus side-effect freedom.
- Re-verify existing file-watcher debounce tests still pass with 2000ms unchanged.

### Out of Scope
- **Lowering `DEFAULT_DEBOUNCE_MS`** — research §5.3 explicitly rejects this as the first fix. Reconsider only if the snapshot lands and operators still observe drift.
- Mutating any cache/cleanup behavior in `ensureCodeGraphReady`.
- Adding a snapshot to other handlers (query/scan/context); this packet covers status only.
- Daemon restart procedure (covered by packet 008).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` | Modify | Add `getGraphReadinessSnapshot()` + `GraphReadinessSnapshot` type |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts` | Modify | Use snapshot's `action` + `reason` when building readiness block |
| `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts` | Create | Coverage for criteria A–E from spec §5 |
| `spec.md` / `plan.md` / `tasks.md` / `checklist.md` / `implementation-summary.md` | Create | Packet docs |
| `description.json` / `graph-metadata.json` | Create | Spec metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `getGraphReadinessSnapshot(rootDir)` MUST return `{ freshness, action, reason }` without mutating any state. | No call to `cleanupDeletedTrackedFiles`, no `setLastGitHead`, no inline indexer, no debounce cache write. Direct verification: side-effect-free test asserts no mutating `code-graph-db` exports invoked. |
| REQ-002 | `code_graph_status` MUST surface the snapshot's `action` value in `readiness.action`. | Tests A–D pass: fresh→none, empty→full_scan, broad-stale→full_scan, bounded-stale→selective_reindex. |
| REQ-003 | `code_graph_status` MUST be side-effect free. | Test E: handler invocation does NOT call any write-side `code-graph-db` export and does NOT call `ensureCodeGraphReady`. |
| REQ-004 | Existing file-watcher debounce tests MUST continue to pass with `DEFAULT_DEBOUNCE_MS=2000` unchanged. | `npx vitest run tests/file-watcher.vitest.ts` PASS. |
| REQ-005 | The existing `freshness` field shape on `code_graph_status` responses MUST remain unchanged so existing callers don't break. | Field still emitted at top level + inside `readiness`; only `readiness.action` and `readiness.reason` get richer. |

### Acceptance Scenarios

**Given** an empty code graph, **when** `code_graph_status` is called, **then** `data.readiness.action === "full_scan"` and `data.readiness.reason` describes the empty state.

**Given** a fresh code graph, **when** `code_graph_status` is called, **then** `data.readiness.action === "none"` and all 12 data-mutating `code-graph-db` exports are asserted `not.toHaveBeenCalled()` (mock-surface verification, equivalent at the API boundary — if the handler never invokes a mutating export, the DB cannot be mutated).

**Given** stale-but-bounded files, **when** `code_graph_status` is called, **then** `data.readiness.action === "selective_reindex"`.

**Given** broad stale (>50 files), **when** `code_graph_status` is called, **then** `data.readiness.action === "full_scan"`.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001 (criterion A)**: Fresh state → `readiness.action: "none"` (test passes).
- **SC-002 (criterion B)**: Empty graph → `readiness.action: "full_scan"`, reason describes empty (test passes).
- **SC-003 (criterion C)**: Broad stale → `readiness.action: "full_scan"` (test passes).
- **SC-004 (criterion D)**: Bounded stale → `readiness.action: "selective_reindex"` (test passes).
- **SC-005 (criterion E — most important)**: `code_graph_status` invocation does NOT mutate the DB. Verified by mock-surface assertions: no write-side `code-graph-db` export called; no `ensureCodeGraphReady` invocation.
- **SC-006**: Existing file-watcher debounce tests continue to pass (`DEFAULT_DEBOUNCE_MS=2000` untouched).
- **SC-007**: `validate.sh --strict` PASS (errors 0).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Snapshot helper accidentally inherits cache/cleanup logic from `ensureCodeGraphReady`. | High | Helper extracts ONLY the `detectState()` branch; explicitly does NOT call `cleanupDeletedTrackedFiles`, `cacheReadyResult`, `setLastGitHead`, or `indexWithTimeout`. |
| Risk | Daemon caches `dist/` and won't pick up the new helper until restart. | Medium | Per packet 008 protocol — daemon rebuild required before live probe. |
| Risk | Lowering debounce silently improves things AND introduces reindex thrash. | Low (avoided) | We explicitly do NOT change debounce per research §5.3. Snapshot first; measure; tune later only if drift persists. |
| Dependency | 011 research §5 / Q-P2 (research source). | Internal — Closed | Source of truth. |
| Dependency | 010 findings §3 (problem statement). | Internal — Closed | 4-hour staleness drift evidence. |
| Dependency | 008 mcp-daemon-rebuild-protocol. | Internal — Closed | Restart procedure for live probe. |
| Dependency | 005 code-graph-fast-fail. | Internal — Closed (related) | Same readiness vocabulary; no overlap in scope. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should other code-graph handlers (query, scan, context) also surface the snapshot in their non-blocked responses? Default: NO for v1; this packet covers status only. Reconsider once operators report value.
- Should the snapshot reason be summarized vs verbatim from `detectState()`? Default: verbatim — operators want to see the underlying detail (e.g. "120 stale files exceed selective threshold (50)") to pick the right action without round-tripping.
<!-- /ANCHOR:questions -->
