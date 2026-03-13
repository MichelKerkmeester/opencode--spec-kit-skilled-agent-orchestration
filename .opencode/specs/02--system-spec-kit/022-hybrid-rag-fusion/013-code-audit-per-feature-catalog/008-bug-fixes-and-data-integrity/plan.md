---
title: "Implementation Plan: bug-fixes-and-data-integrity [template:level_2/plan.md]"
description: "Execution plan for causal-link reliability fixes, regression hardening, scripts testability repair, and evidence-truthful documentation sync."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
trigger_phrases:
  - "implementation plan"
  - "causal link"
  - "verification alignment"
  - "scripts testability"
  - "phase 001-018"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: bug-fixes-and-data-integrity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | Spec Kit Memory MCP server + docs/spec packet workflow |
| **Storage** | SQLite + markdown artifacts |
| **Testing** | Vitest (`mcp_server`, `scripts`) + packet validation |

### Overview
This plan executes a targeted remediation bundle discovered during the phase `001` to `018` review:
1. Fix causal-link lock/busy masking so infra failures surface correctly.
2. Add deterministic regressions for the corrected failure mode.
3. Replace weak test branches and stale wording in docs/playbook/readmes.
4. Repair scripts package local testability and keep packet verification claims truthful.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement and boundaries documented
- [x] Scope locked to review findings and user-approved file set
- [x] Verification evidence sources identified

### Definition of Done
- [x] Runtime and test fixes landed for causal-link, incremental-index, and scripts path issues
- [x] Targeted verification completed (`typecheck`, targeted MCP vitest, selected scripts suites)
- [x] Full `scripts` package `npm test` completed end-to-end and reflected in checklist (`Test Files 9 passed (9)`, `Tests 150 passed (150)`, `Duration 77.49s`)
- [x] Packet docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) synchronized to real state
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Monolith

### Key Components
- **Storage edge insert path**: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`
- **Causal graph handler path**: `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- **Regression suites**: causal-edge, causal-graph integration, incremental-index v1/v2, scripts unit suites
- **Documentation surfaces**: root README, test README, watcher catalog, manual playbook, spec packet docs

### Data Flow
Review findings were mapped to concrete files, code/test fixes were applied first, documentation surfaces were synchronized next, and verification evidence was captured and closed with full package-level check/test results.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm review findings and reproduction surface for causal-link lock/busy flake
- [x] Confirm stale documentation claims and path placeholders needing correction
- [x] Lock edits to approved files and packet scope only

### Phase 2: Core Implementation
- [x] Update causal edge insert behavior to rethrow lock/busy DB errors
- [x] Add storage-level and handler-level causal regressions for lock/busy -> `E022`
- [x] Replace incremental-index symlink pass-through fallback assertions with explicit capability gating
- [x] Apply scripts package/test path fixes and remove stale artifact file

### Phase 3: Documentation Alignment
- [x] Refresh stale counts/coverage language in root and tests READMEs
- [x] Update watcher feature note to current coverage wording
- [x] Replace playbook "missing coverage" statement with explicit matrix for 29 entries
- [x] Rewrite packet docs to match true implementation and verification state

### Phase 4: Verification
- [x] `npm run typecheck` in `.opencode/skill/system-spec-kit`
- [x] `npm run check` in `.opencode/skill/system-spec-kit/mcp_server`
- [x] `npm run check` in `.opencode/skill/system-spec-kit/scripts`
- [x] Targeted MCP vitest run for causal and incremental suites
- [x] Selected scripts vitest suites run individually
- [x] Full scripts package `npm test` completed (`Test Files 9 passed (9)`, `Tests 150 passed (150)`, `Duration 77.49s`)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Type Safety | `system-spec-kit` workspace | `npm run typecheck` |
| Package Quality Gates | `mcp_server` and `scripts` package checks | `npm run check` |
| Targeted Runtime Regression | causal-link + incremental-index suites | `npm test -- --run ...` in `mcp_server` |
| Scripts Local Reliability | focused suites for path/import/file-writer behavior | `npm test -- --run ...` in `scripts` |
| Full Package Verification | all scripts tests | `npm test` in `scripts` (complete: 9 files, 150 tests) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing review findings for phases `001` to `018` | Internal | Green | Scope rationale and acceptance mapping lose traceability |
| Local workspace code changes already landed | Internal | Green | Packet cannot be synchronized to real implementation state |
| Verification outputs captured in packet docs | Internal | Green | Future audits can trace completion evidence precisely |
| Spec packet validation (`validate.sh`) | Internal | Green | Structural quality gates for markdown docs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Regressions fail after doc sync, or lock/busy behavior mapping is shown incorrect.
- **Procedure**:
1. Revert affected code/docs commits for this packet.
2. Re-run targeted MCP and scripts suites.
3. Restore prior packet docs and re-apply corrections with updated evidence.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ---> Phase 2 (Code/Test Fixes) ---> Phase 3 (Docs Sync) ---> Phase 4 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Code/Test Fixes, Docs Sync |
| Code/Test Fixes | Setup | Docs Sync, Verification |
| Docs Sync | Code/Test Fixes | Verification |
| Verification | Code/Test Fixes, Docs Sync | Final packet closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1-2 hours |
| Core Implementation | High | 4-7 hours |
| Documentation Alignment | Medium | 2-4 hours |
| Verification | Medium | 2-3 hours |
| **Total** | | **9-16 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Scope lock preserved (no unrelated feature work)
- [x] Targeted regression coverage present for causal-lock path
- [x] Full scripts package suite completion captured

### Rollback Procedure
1. Revert causal-edge/storage and scripts-path patches.
2. Re-run causal/incremental suites and key scripts tests.
3. Reconcile packet docs/checklist to reverted evidence.
4. Re-open unresolved task IDs in `tasks.md`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
