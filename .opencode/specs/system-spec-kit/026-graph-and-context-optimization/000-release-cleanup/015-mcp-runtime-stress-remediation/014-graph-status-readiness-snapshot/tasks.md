---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: code_graph_status read-only readiness snapshot [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/014-graph-status-readiness-snapshot/tasks]"
description: "Per-REQ work units for Packet 014 — read-only readiness snapshot helper + status handler wiring."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "graph status readiness snapshot tasks"
  - "014 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/014-graph-status-readiness-snapshot"
    last_updated_at: "2026-04-27T19:54:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Decomposed work units"
    next_safe_action: "validate.sh --strict"
    blockers: []
    key_files: ["tasks.md"]
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: code_graph_status read-only readiness snapshot

<!-- SPECKIT_LEVEL: 1 -->
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
- [x] T001 Author spec.md / plan.md / tasks.md
- [x] T002 [P] Author checklist.md
- [x] T003 [P] Generate description.json + graph-metadata.json
- [x] T004 Author implementation-summary.md (filled in, not placeholder)
- [ ] T005 Pass `validate.sh --strict`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T101 Read `code_graph/lib/ensure-ready.ts` lines 1-468; identify the `detectState()` private (lines 142-226) as the read-only branch.
- [x] T102 Add `GraphReadinessSnapshot` interface with `{ freshness, action, reason }` shape.
- [x] T103 Add `getGraphReadinessSnapshot(rootDir): GraphReadinessSnapshot` export. Wrap `detectState(rootDir)` in try/catch; on crash return `{ freshness: 'error', action: 'none', reason: 'readiness probe crashed: <msg>' }`.
- [x] T104 Verify the helper does NOT call `cleanupDeletedTrackedFiles`, `cacheReadyResult`, `setLastGitHead`, or `indexWithTimeout` (read-only contract per REQ-001).
- [x] T105 Patch `code_graph/handlers/status.ts`: import `getGraphReadinessSnapshot`; replace `getGraphFreshness(process.cwd())` + hard-coded `action: 'none'` with the snapshot's `action` and richer `reason`.
- [x] T106 Preserve the existing top-level `freshness` field on the status response so existing callers do not break (REQ-005).
- [x] T107 Typecheck: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` PASS.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T201 Create `tests/code-graph-status-readiness-snapshot.vitest.ts` with criteria A–E.
- [x] T202 Test A: fresh → `readiness.action === "none"`.
- [x] T203 Test B: empty → `readiness.action === "full_scan"`, reason matches /empty/i.
- [x] T204 Test C: broad stale (>50 files) → `readiness.action === "full_scan"`, reason matches /exceed selective threshold/.
- [x] T205 Test D: bounded stale → `readiness.action === "selective_reindex"`, reason matches /newer mtime/.
- [x] T206 Test E (most important): mock-surface assertion that NO write-side `code-graph-db` export and NO `ensureCodeGraphReady` is invoked during status; assert `getGraphReadinessSnapshot` is called with `process.cwd()`.
- [x] T207 Trust-state regression: `empty` projects to `canonicalReadiness: "missing"`, `trustState: "absent"`.
- [x] T208 Run targeted vitest: `npx vitest run tests/code-graph-status-readiness-snapshot.vitest.ts` PASS (9/9).
- [x] T209 Run regression: `npx vitest run tests/file-watcher.vitest.ts` PASS (21/21) — `DEFAULT_DEBOUNCE_MS=2000` unchanged.
- [x] T210 Run regression: `npx vitest run tests/code-graph-query-fallback-decision.vitest.ts tests/readiness-contract.vitest.ts` PASS (21/21).
- [ ] T211 `validate.sh --strict` — driver-side gate.
- [ ] T212 Daemon restart + live `code_graph_status` probe (per packet 008) — driver-side gate.
- [ ] T213 Mark all REQ-001..005 PASSED on completion.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Phase 1 + Phase 2 + Phase 3 (T201-T210) complete
- [x] REQ-001 (read-only contract) covered by Test E
- [x] REQ-002 (action surfacing) covered by Tests A–D
- [x] REQ-003 (side-effect freedom) covered by Test E
- [x] REQ-004 (debounce unchanged) covered by file-watcher regression
- [x] REQ-005 (freshness shape preserved) covered by handler patch + parsing in tests
- [ ] `validate.sh --strict` PASS recorded in implementation-summary.md
- [ ] Live probe verification recorded post-restart
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: spec.md
- **Plan**: plan.md
- **Checklist**: checklist.md
- **Implementation summary**: implementation-summary.md
- **Sources**: ../011-post-stress-followup-research/research/research.md §5 (Q-P2); ../010-stress-test-rerun-v1-0-2/findings.md §3
- **Companion**: ../008-mcp-daemon-rebuild-protocol (restart procedure); ../005-code-graph-fast-fail (related readiness vocabulary)
<!-- /ANCHOR:cross-refs -->
