---
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Implementation Plan: code_graph_status read-only readiness snapshot [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/014-graph-status-readiness-snapshot/plan]"
description: "Add a read-only getGraphReadinessSnapshot() helper extracted from ensure-ready.ts detection logic; wire into code_graph_status so readiness.action surfaces the correct full_scan / selective_reindex / none state."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "graph status readiness snapshot plan"
  - "014 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/014-graph-status-readiness-snapshot"
    last_updated_at: "2026-04-27T19:54:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan"
    next_safe_action: "Daemon restart + live probe (per packet 008)"
    blockers: []
    key_files: ["plan.md"]
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: code_graph_status read-only readiness snapshot

<!-- SPECKIT_LEVEL: 1 -->
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
Additive read-only helper. The snapshot function reuses the `detectState()` private from `ensure-ready.ts` (lines 142-226) but skips every mutating step on the path that follows (cleanup, cache, inline index, head update). The status handler stops hard-coding `readiness.action: 'none'` and instead carries through the snapshot's action.

No watcher behavior change. No debounce change. No new mutating surface. The change is observability-only, exactly as research §5.3 / Option #1 prescribed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 011 research §5 / Q-P2 read end-to-end
- [x] `ensure-ready.ts` detection logic understood (lines 142-226 vs cache/cleanup at 329-373)
- [x] `status.ts` consumer site identified (lines 158-225)
- [x] file-watcher invariant pinned (`DEFAULT_DEBOUNCE_MS=2000` MUST NOT change)

### Definition of Done
- [x] All REQs PASS
- [x] New vitest file passes
- [x] file-watcher.vitest.ts continues to pass
- [x] Typecheck passes (`npx tsc --noEmit`)
- [ ] dist marker grep PASS (post-build verification)
- [ ] Live probe verifies non-mutation after daemon restart (per packet 008)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only diagnostic surface co-located with the existing mutating one. Mirrors `getGraphFreshness()` (already in `ensure-ready.ts`) which is also a non-mutating projection of `detectState()`.

### Key Components
- `code_graph/lib/ensure-ready.ts` — adds `getGraphReadinessSnapshot(rootDir): GraphReadinessSnapshot` next to `getGraphFreshness()`.
- `code_graph/handlers/status.ts` — replaces `getGraphFreshness(process.cwd())` + hard-coded `action: 'none'` with `getGraphReadinessSnapshot(process.cwd())`; carries through `snapshot.action` and `snapshot.reason`.

### Data Flow
```
code_graph_status
   └─> getGraphReadinessSnapshot(rootDir)
          └─> detectState(rootDir)          [private, read-only]
                 ├─ COUNT(*) FROM code_nodes        — read
                 ├─ getCurrentGitHead(rootDir)      — read (git rev-parse)
                 ├─ getLastGitHead()                — read
                 ├─ getTrackedFiles()               — read
                 ├─ partitionTrackedFiles(...)      — pure (filesystem stat)
                 └─ ensureFreshFiles(existingFiles) — read
   └─> buildReadinessBlock({ freshness, action: snapshot.action, ... })
```
No write surface is touched on this path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Source
- [x] Read `ensure-ready.ts` lines 1-468 to confirm `detectState()` is the only readonly portion.
- [x] Add `GraphReadinessSnapshot` interface (`{ freshness, action, reason }`).
- [x] Add `getGraphReadinessSnapshot(rootDir)` function. Catches probe crash and returns `{ freshness: 'error', action: 'none', reason: 'readiness probe crashed: ...' }`.
- [x] Patch `status.ts` to import `getGraphReadinessSnapshot` and use it instead of `getGraphFreshness` + hard-coded `action: 'none'`.

### Phase 2: Tests
- [x] Create `code-graph-status-readiness-snapshot.vitest.ts`.
- [x] Test A: fresh → readiness.action="none".
- [x] Test B: empty → readiness.action="full_scan", reason describes empty.
- [x] Test C: broad stale → readiness.action="full_scan".
- [x] Test D: bounded stale → readiness.action="selective_reindex".
- [x] Test E (most important): mock-surface verification that NO write-side `code-graph-db` export and NO `ensureCodeGraphReady` is invoked during a status call.
- [x] Trust-state regression: empty maps to `canonicalReadiness: "missing"`, `trustState: "absent"`.
- [x] Re-run `tests/file-watcher.vitest.ts` (existing file watcher coverage with 2000ms debounce).

### Phase 3: Verify
- [x] Typecheck (`npx tsc --noEmit`) PASS.
- [x] `npx vitest run tests/code-graph-status-readiness-snapshot.vitest.ts` PASS (9/9).
- [x] `npx vitest run tests/file-watcher.vitest.ts` PASS (21/21).
- [x] `npx vitest run tests/code-graph-query-fallback-decision.vitest.ts tests/readiness-contract.vitest.ts` regression PASS (21/21).
- [x] Update `implementation-summary.md`.
- [ ] Run `validate.sh --strict` (deferred to driver post-author).
- [ ] Daemon restart + live `code_graph_status` probe (deferred per packet 008).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Per-state snapshot routing through `code_graph_status` | vitest with hoisted module mocks |
| Side-effect | No write-side DB export; no `ensureCodeGraphReady` call | vitest mock-surface assertions |
| Regression | Existing file-watcher debounce tests at 2000ms | vitest |
| Live probe | Non-mutation in real daemon (post-restart) | MCP `code_graph_status` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 011 research §5 / Q-P2 | Internal | Green | Source of truth |
| 010 findings.md §3 | Internal | Green | Problem evidence (4h drift) |
| 008 mcp-daemon-rebuild-protocol | Internal | Green | Live probe gating |
| 005 code-graph-fast-fail (related) | Internal | Green | Same readiness vocabulary; no overlap |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `code_graph_status` callers depend on `readiness.action === 'none'` always being emitted (none currently do, per grep).
- **Procedure**: Revert the two-line patch in `status.ts` to restore the hard-coded `action: 'none'`. The new `getGraphReadinessSnapshot` helper can stay (it is purely additive and not invoked elsewhere). Tests for that helper continue to pass on their own.
- **Risk window**: Low — the change is additive metadata on an MCP read-tool response. No schema-breaking field rename.
<!-- /ANCHOR:rollback -->
