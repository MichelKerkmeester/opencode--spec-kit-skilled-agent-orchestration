---
title: "Plan: Memory Search Bug Fixes (Unified)"
description: "Canonical Level 2 execution plan for both workstreams under spec 013"
importance_tier: "normal"
contextType: "implementation"
---
# Plan: Memory Search Bug Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. Summary

This unified plan captures the documented bug-fix workstreams for `013-memory-search-bug-fixes`:

1. Stateless filename/generic-slug parity stabilization.
2. Folder-discovery robustness follow-up, including the stale-cache shrink remediation.

Approach stayed intentionally narrow: adjust only the affected workflow/utilities/tests for workstream A and folder-discovery module/tests for workstream B.
<!-- /ANCHOR:summary -->

---

## Technical Context

| Aspect | Context |
|--------|---------|
| Stack | TypeScript/Node.js |
| Scope A | `.opencode/skill/system-spec-kit/scripts/*` workflow + utility + tests |
| Scope B | `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` + direct tests |
| Validation Tooling | Vitest, `tsc`, alignment drift script, spec validator |
| Build Constraint | Full `npm run typecheck && npm run build` now passes in `.opencode/skill/system-spec-kit` |

---

## Architecture

The solution keeps architecture unchanged and applies targeted behavior fixes:
- Stateless enrichment routing remains in workflow path with explicit JSON/file-backed guard and invocation-local config restoration after `runWorkflow()`.
- Generic-task parity remains centralized in slug/enrichment utility semantics.
- Folder discovery stays in existing module, expanded with bounded recursion, canonical root dedupe, and graceful invalid-path handling.

---

<!-- ANCHOR:architecture -->
## 2. Technical Approach

### Workstream A
- Preserve spec-title fallback enrichment for stateless generic tasks.
- Enforce explicit stateless-only guard (`JSON/file-backed` path bypasses enrichment).
- Restore invocation-local config state after each `runWorkflow()` call so file-backed runs cannot leak `CONFIG.DATA_FILE` into later stateless runs.
- Align generic-task classification with slug behavior (`implementation-and-updates` included).
- Keep template rendering honest by preserving original `implSummary.task` in `IMPL_TASK`.

### Workstream B
- Add depth-limited recursive discovery (max depth 8).
- Dedupe alias roots by canonical path while preserving first candidate path behavior.
- Evaluate staleness over recursive discovered folders.
- Cover stale-cache shrink behavior when a previously cached spec folder disappears.
- Return empty cache object for invalid/nonexistent non-empty explicit input paths.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 3. Implementation Phases

### Phase 1: Stateless Filename + Slug Parity
- [x] Add/keep stateless enrichment fallback path.
- [x] Add stateless-only enrichment guard.
- [x] Align generic-task semantics with slug behavior.
- [x] Add regression tests for JSON-vs-stateless behavior, workflow seam restoration, and slug outcomes.

### Phase 2: Folder Discovery Follow-up
- [x] Implement recursive discovery with max depth 8.
- [x] Implement canonical-path root dedupe with first-candidate retention.
- [x] Route staleness checks through recursive discoveries.
- [x] Add stale-cache shrink follow-up coverage for deleted cached folders.
- [x] Implement graceful empty-cache return for invalid/nonexistent explicit input paths.

### Phase 3: Verification + Documentation Consolidation
- [x] Run targeted workstream tests and compile checks.
- [x] Consolidate duplicate root/addendum docs into one canonical Level 2 packet.
- [x] Normalize references to standard filenames only.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 4. Testing Strategy

| Test Type | Scope | Evidence |
|-----------|-------|----------|
| Regression tests | Stateless task enrichment, workflow seam restoration, and slug parity | `npm run test:task-enrichment` -> 13 passed |
| Unit tests | Folder discovery recursion/depth/invalid paths | `npm run test --workspace=mcp_server -- tests/folder-discovery.vitest.ts` |
| Integration tests | Alias-root dedupe + recursive staleness behavior, including stale-cache shrink coverage (`T046-10c`, `T046-10d`) | `npm run test --workspace=mcp_server -- tests/folder-discovery-integration.vitest.ts` -> 27 passed, 0 failed |
| Type/build checks | Type safety and build consistency | `npx tsc --noEmit` (PASS), `npm run typecheck && npm run build` (PASS) |
| Alignment check | MCP subtree drift check | `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/mcp_server` (PASS) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 5. Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Existing memory workflow utilities/tests | Green | Needed for stateless vs JSON behavior proof and file-backed/stateless seam coverage |
| Filesystem canonical path behavior | Green | Needed for alias-root dedupe correctness |
| Vitest/type/build tooling | Green | Required for verification evidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 6. Rollback Plan

- Revert targeted workstream files if regression appears.
- Re-run targeted test suites and compile checks to confirm restoration.
- Keep rollback scope limited to touched workflow/util and folder-discovery test surfaces.
<!-- /ANCHOR:rollback -->
