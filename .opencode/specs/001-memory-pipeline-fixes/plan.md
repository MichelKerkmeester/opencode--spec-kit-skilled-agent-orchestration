---
title: "Implementation Plan: Memory Pipeline Fixes [template:level_2/plan.md]"
description: "This plan delivers seven bounded TypeScript bug fixes in the system-spec-kit memory pipeline, then rebuilds and verifies the affected workspace packages using existing commands."
trigger_phrases:
  - "implementation plan"
  - "memory pipeline"
  - "bug fixes"
  - "typescript workspace"
  - "verification"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: Memory Pipeline Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node.js 18+ |
| **Framework** | Monorepo workspace utilities for system-spec-kit CLI and shared libraries |
| **Storage** | None directly changed in scope |
| **Testing** | TypeScript build/typecheck, Vitest in `scripts`, workspace smoke tests from `.opencode/skill/system-spec-kit/package.json` |

### Overview
This work is a bounded repair pass across the system-spec-kit memory pipeline. The implementation should correct seven targeted behaviors in extraction, summarization, trigger generation, and embedding metadata propagation, then rebuild the affected packages and run the repository's existing verification commands so the fixes land with evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement is clear and scoped to seven requested fixes.
- [x] Success criteria are measurable and tied to build and verification evidence.
- [x] Internal workspace dependencies and target files are identified.

### Definition of Done
- [ ] All seven acceptance criteria are met in the named source files.
- [ ] Build and existing verification commands pass or are deferred with explicit user approval.
- [ ] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` are updated with final evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: layered TypeScript workspace with shared library utilities and CLI-side extraction/summarization modules.

### Key Components
- **`scripts` package extraction pipeline**: Handles session collection, decision extraction, phase classification, title building, and semantic summarization.
- **`shared` package utilities**: Provides trigger extraction and embedding configuration behavior shared across workspace consumers.
- **Workspace build and test commands**: Supply the existing compile and verification path that must confirm the fixes without inventing new tooling.

### Data Flow
Session and memory inputs enter the `scripts` extraction pipeline, which classifies session state, derives decisions, generates titles and key outcomes, and emits trigger candidates. Shared embedding utilities then attach model metadata used by downstream consumers. The fix set should preserve that flow while correcting the seven identified decision points and validating the rebuilt outputs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm current baseline behavior and any existing failing tests for the seven requested issues.
- [ ] Review package build and test commands in `.opencode/skill/system-spec-kit`, `scripts`, and `shared`.
- [ ] Identify whether generated `dist/` outputs are tracked and need review after rebuild.

### Phase 2: Core Implementation
- [ ] Apply the five `scripts` package fixes for title building, session status inference, phase override handling, decision confidence, and key outcomes summarization.
- [ ] Apply the two `shared` package fixes for trigger extraction quality and embedding model propagation.
- [ ] Keep the implementation tightly scoped to the seven requested behaviors and adjacent defensive checks only.

### Phase 3: Verification
- [ ] Rebuild the affected packages and inspect any generated output changes.
- [ ] Run existing workspace and package verification commands with evidence captured in `checklist.md`.
- [ ] Update `implementation-summary.md` with actual outcomes, verification results, and any approved deferrals.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Existing `scripts` tests that cover extractors, summarizers, and related utilities | `npm run test --workspace=scripts`, Vitest |
| Integration | Workspace-level compile and smoke paths for shared and scripts packages | `npm run build`, `npm run test`, `npm run typecheck` from `.opencode/skill/system-spec-kit` as needed |
| Manual | Targeted spot checks for the seven regression scenarios if automated coverage is incomplete | Local command output review and checklist evidence |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/system-spec-kit/package.json` workspace scripts | Internal | Green | Without workspace commands, rebuild and end-to-end verification become inconsistent. |
| `.opencode/skill/system-spec-kit/scripts/package.json` build and test scripts | Internal | Green | The `scripts` package fixes cannot be validated through the repository's normal path. |
| Existing TypeScript project references and generated `dist/` conventions | Internal | Yellow | If project references or generated outputs are already out of sync, verification may surface unrelated failures that need documentation. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any fix causes regressions in session summaries, phase/status inference, trigger extraction quality, or embedding metadata propagation, or the affected packages stop building cleanly.
- **Procedure**: Revert the source changes in the seven target files, rebuild the affected packages to restore prior generated output, and rerun the baseline verification commands to confirm the rollback state.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Baseline review ───► Source fixes ───► Rebuild + tests ───► Final evidence
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core implementation, verification |
| Core Implementation | Setup | Rebuild, tests, final summary |
| Verification | Core Implementation | Completion sign-off |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5-1 hour |
| Core Implementation | Medium | 3-5 hours |
| Verification | Medium | 1-2 hours |
| **Total** | | **4.5-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline outputs or failing scenarios captured for the seven requested fixes.
- [ ] Generated `dist/` changes reviewed before merge.
- [ ] Final verification evidence attached in `checklist.md`.

### Rollback Procedure
1. Revert the source edits in the seven target files.
2. Rebuild `.opencode/skill/system-spec-kit/scripts` and `.opencode/skill/system-spec-kit/shared` or the full workspace if required by project references.
3. Rerun the original verification commands to confirm the repository is back to the pre-fix state.
4. Document the rollback reason and any unresolved failure in `implementation-summary.md`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
