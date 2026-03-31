---
title: "Implementation Plan: MCP Runtime Hardening [02--system-spec-kit/022-hybrid-rag-fusion/025-mcp-runtime-hardening/plan]"
description: "Parallel codex exec agents implement T020-T025: DB dimension tests, lifecycle tests, log sanitization, and doc consolidation."
trigger_phrases:
  - "mcp runtime hardening plan"
  - "025 implementation plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: MCP Runtime Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Vitest, Markdown |
| **Framework** | MCP server (spec_kit_memory), better-sqlite3 |
| **Storage** | SQLite (context-index.sqlite) |
| **Testing** | Vitest + packet validation |

### Overview
Four `codex exec` agents (GPT-5.4) implement T020-T025 in parallel: Agent A writes DB dimension integrity tests, Agent B writes lifecycle/shutdown tests, Agent C adds log sanitization code+tests, Agent D consolidates launcher docs. Claude validates and finalizes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear — 024 follow-on gaps fully documented
- [x] Success criteria measurable — 20 new tests + no regressions
- [x] Dependencies identified — all files explored in planning phase

### Definition of Done
- [x] All 20 new test cases pass
- [x] `npm run test:core` passes (1 pre-existing timeout unrelated)
- [x] `buildErrorResponse()` sanitizes credentials
- [x] Packet validates
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive hardening: new test files + targeted sanitization fix + doc consolidation.

### Key Components
- **Test Layer**: 4 new vitest files covering dimension integrity, lifecycle, stage2b, and error sanitization
- **Sanitization Layer**: Recursive `sanitizeErrorField()` + `sanitizeDetails()` in `lib/errors/core.ts` with circular-reference guard; `cleanup-helpers.ts` for side-effect-free shutdown logging
- **Doc Layer**: Consolidated guidance across 9 surfaces (3 READMEs, env vars, install guide, feature catalog, playbook, descriptions.json, 024 cross-refs)

### Data Flow
```
codex agents (parallel) -> new test files + code changes + doc updates
    -> vitest validation -> regression check -> packet finalization
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Parallel Implementation (codex exec)
- [x] Agent A: T020 — `tests/db-dimension-integrity.vitest.ts` (5 tests)
- [x] Agent B: T021 — `tests/lifecycle-shutdown.vitest.ts` (4 tests) + `tests/stage2b-enrichment-extended.vitest.ts` (3 tests)
- [x] Agent C: T022 — `lib/errors/core.ts` (recursive sanitizeDetails + regex hardening) + `lib/utils/cleanup-helpers.ts` + `context-server.ts` + `tests/error-sanitization.vitest.ts` (8 tests)
- [x] Agent D: T023 — 3 doc file updates

### Phase 2: Validation
- [x] Run new test files (20/20 pass)
- [x] Run regression tests (132/132 pass)
- [x] Run `npm run test:core` (8631 pass, 1 pre-existing timeout)
- [x] GPT-5.4 code review round 1 + round 2 (xhigh): all findings resolved
- [x] `npm run build` — dist/ rebuilt and verified

### Phase 3: Finalize
- [x] T024: Update 024 packet cross-references
- [x] T025: Document 026+ routing rule
- [x] Complete checklist and implementation-summary
- [x] Run packet validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| New tests | 4 files, 20 test cases | `npx vitest run tests/<file>` |
| Regression | Existing remediation tests | `npx vitest run tests/vector-index-store-remediation.vitest.ts tests/tool-cache.vitest.ts tests/stage2b-enrichment.vitest.ts tests/retry-manager.vitest.ts` |
| Full suite | All core tests | `npm run test:core` |
| Packet | Template compliance | `validate.sh 025-mcp-runtime-hardening` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 024 landed fixes | Internal | Green | Tests would have no base to validate against |
| vector-index-store exports | Internal | Green | Tests import from existing public API |
| `get_error_message()` in vector-index-types | Internal | Green | Already exported and used elsewhere |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New tests fail or existing tests regress after T022 code changes
- **Procedure**: Revert `lib/errors/core.ts` and `context-server.ts` changes; delete new test files; keep doc updates (non-breaking)
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Agents A,B,C,D parallel) -> Phase 2 (Validation) -> Phase 3 (Finalize)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Implementation | Spec folder creation | Validation |
| Validation | All 4 agents complete | Finalize |
| Finalize | Validation passes | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Parallel implementation | Medium | 15-20 min (agents) |
| Validation | Low | 10 min |
| Finalize | Low | 5 min |
| **Total** | | **30-35 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations involved
- [x] Changes are additive (new files) except T022 (2 existing files)
- [x] T022 changes are minimal and isolated

### Rollback Procedure
1. Revert `lib/errors/core.ts` to remove `sanitizeErrorField()`
2. Revert `context-server.ts` lines 635, 644 to raw error logging
3. Delete 4 new test files
4. Doc updates can remain (non-breaking)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
