---
title: "Plan: Memory Search State Filter Fix + Folder Discovery Follow-up"
description: "Document and verify deep recursive discovery, canonical root dedupe, recursive staleness checks, and graceful invalid-path cache behavior."
importance_tier: "normal"
contextType: "implementation"
---
# Plan: Memory Search State Filter Fix + Folder Discovery Follow-up

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js MCP server) |
| **Framework** | Internal MCP search modules |
| **Storage** | SQLite-backed memory index (already in place) |
| **Testing** | Vitest (`folder-discovery*.vitest.ts`) |

### Overview
This follow-up enhancement keeps the existing memory-search architecture but hardens folder discovery behavior. The implementation adds depth-limited recursive discovery (max depth 8), canonical-path dedupe for aliased roots, recursive staleness checks, and graceful empty-cache behavior when explicit non-empty input paths are invalid/nonexistent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md`)
- [x] Success criteria measurable (`REQ-001`..`REQ-005`)
- [x] Dependencies identified (filesystem canonical-path behavior + discovery recursion boundaries)

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (`folder-discovery.vitest.ts`, `folder-discovery-integration.vitest.ts`)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted robustness enhancement in existing folder-discovery path for memory search.

### Key Components
- **Folder discovery (`folder-discovery.ts`)**: Discovers spec folders, dedupes roots, and drives staleness/cache checks.
- **Unit tests (`folder-discovery.vitest.ts`)**: Verify recursive discovery, depth cap, and invalid-path behavior.
- **Integration tests (`folder-discovery-integration.vitest.ts`)**: Verify alias-dedupe and recursive staleness behavior across realistic folder layouts.

### Data Flow
Input paths and candidate spec roots are collected -> canonical root dedupe is applied -> recursive discovery resolves nested spec folders (max depth 8) -> staleness checks and description-cache operations run against discovered folders. Fix is constrained to folder-discovery logic and direct tests.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm current folder-discovery behavior for deep nesting and alias roots
- [x] Confirm desired behavior for invalid/nonexistent explicit input paths

### Phase 2: Core Implementation
- [x] Add depth-limited recursive discovery (max depth 8)
- [x] Add canonical-path dedupe for alias roots while preserving first candidate path
- [x] Update staleness checks to use recursive discovered spec folders
- [x] Ensure `ensureDescriptionCache` returns empty cache object for invalid/nonexistent non-empty input paths

### Phase 3: Verification
- [x] Run unit folder-discovery tests and capture outcomes
- [x] Run integration folder-discovery tests and capture outcomes
- [x] Run typecheck/build and alignment drift verification
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Recursive discovery, depth cap, invalid input path behavior | Vitest |
| Integration | Alias root dedupe and recursive staleness behavior | Vitest |
| Build/Type Safety | Compile + type verification | npm scripts |
| Consistency | Alignment drift check for MCP server subtree | Python verification script |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Filesystem canonical path resolution | Internal/OS | Green | Incorrect canonicalization would break root dedupe guarantees |
| Existing folder-discovery fixtures | Internal | Green | Without deep fixture coverage, recursion correctness cannot be proven |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Discovery misses nested folders, duplicate alias traversal, or invalid-path cache regression.
- **Procedure**: Revert folder-discovery patch set and re-run folder-discovery unit/integration tests plus typecheck/build.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Inspect discovery behavior) ──► Phase 2 (Implement recursive + dedupe fixes) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inspect | None | Fix, Verify |
| Fix | Inspect | Verify |
| Verify | Fix | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inspect discovery behavior | Medium | 1-2 hours |
| Core implementation | Medium | 2-3 hours |
| Verification | Medium | 1-2 hours |
| **Total** | | **4-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Snapshot baseline test output for comparison
- [x] Confirm no unrelated test failures in touched suite
- [x] Confirm scope excludes unrelated pipeline/scoring behavior

### Rollback Procedure
1. Revert folder-discovery patch set.
2. Re-run `tests/folder-discovery.vitest.ts` and `tests/folder-discovery-integration.vitest.ts`.
3. Re-run `npm run typecheck && npm run build` in `.opencode/skill/system-spec-kit`.
4. Re-run alignment drift verification and capture evidence.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
