---
title: "Consolidated plan: 004-speckit-quality-and-standards [004-speckit-quality-and-standards/plan.md]"
description: "Consolidated from 004-spec-kit-templates/plan.md and 008-spec-kit-code-quality/plan.md."
SPECKIT_TEMPLATE_SOURCE: "merge-consolidation | v1.0"
trigger_phrases:
  - "consolidated"
  - "004-speckit-quality-and-standards"
importance_tier: "important"
contextType: "implementation"
---
# Consolidated plan.md

This document consolidates source documents from:
- `004-spec-kit-templates/plan.md`
- `008-spec-kit-code-quality/plan.md`

## Source: `004-spec-kit-templates/plan.md`

---
title: "Implementation Plan: SpecKit Template ToC Policy Enforcement [004-spec-kit-templates/plan.md]"
description: "Execution plan for documentation-only ToC policy enforcement and retro cleanup in scoped spec artifacts."
trigger_phrases:
  - "implementation"
  - "plan"
  - "spec kit"
  - "toc policy"
SPECKIT_TEMPLATE_SOURCE: "plan-core + level2-verify | v2.2"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: SpecKit Template ToC Policy Enforcement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | system-spec-kit Level 2 templates + spec validator |
| **Storage** | Repository filesystem |
| **Testing** | `rg` policy scan + `validate.sh` per affected folder |

### Overview
This plan executes a docs-only pass in three phases: template-based authoring of the new Level 2 spec folder, targeted removal of disallowed ToC sections from existing non-research artifacts, and validation/reporting for all affected folders.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope limited to markdown documentation in spec folders.
- [x] Target folders and required file list identified.
- [x] ToC policy clarified: only `research.md` may include ToC.

### Definition of Done
- [x] New Level 2 docs created in `007-spec-kit-templates`.
- [x] ToC sections removed from scoped non-research artifacts.
- [x] Validation executed for all requested folders.
- [x] Final concise report prepared.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation normalization workflow.

### Key Components
- **Template-aligned spec docs**: New Level 2 files in `007-spec-kit-templates`.
- **Retro cleanup set**: Existing standard artifacts in `039`, `040`, and `041`.
- **Validation layer**: `spec/validate.sh` run per target folder.

### Data Flow
1. Inspect templates and offender files.
2. Create new Level 2 docs with real task content.
3. Remove ToC blocks from scoped standard artifacts.
4. Run policy scan and folder validation commands.
5. Publish concise results.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preparation
- [x] Read system-spec-kit Level 2 templates.
- [x] Scan scoped spec artifacts for ToC offenders.
- [x] Confirm exact cleanup file set.

### Phase 2: Documentation Edits
- [x] Create `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` in `007-spec-kit-templates`.
- [x] Remove ToC sections from non-research standard artifacts in `039`, `040`, `041`.
- [x] Preserve all out-of-scope files, including `research.md`.

### Phase 3: Verification and Reporting
- [x] Run ToC policy scan on targeted standard artifacts.
- [x] Run `validate.sh` on all requested folders.
- [x] Summarize changed files and validation outcomes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Policy scan | ToC headings in standard artifacts only | `rg` |
| Folder validation | Completeness and structure checks | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <folder>` |
| Manual inspection | Confirm only ToC blocks removed | `sed`, `git diff` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/system-spec-kit/templates/level_2/*.md` | Internal | Available | Cannot produce template-aligned docs |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Internal | Available | Cannot verify requested folders |
| Existing scoped spec artifacts | Internal | Available | Retro cleanup cannot be completed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Unintended content removal or validation failures caused by cleanup edits.
- **Procedure**: Revert only affected markdown files and re-apply targeted ToC-only edits.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Preparation) ──► Phase 2 (Documentation Edits) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Preparation | None | Documentation Edits |
| Documentation Edits | Preparation | Verification |
| Verification | Documentation Edits | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preparation | Low | 20-30 min |
| Documentation Edits | Medium | 45-75 min |
| Verification | Low | 15-25 min |
| **Total** | | **80-130 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Target files confirmed in scope.
- [x] Edit pattern limited to explicit ToC blocks.
- [x] New docs authored in target spec folder only.

### Rollback Procedure
1. Restore prior markdown content for affected files.
2. Re-run targeted ToC scan to confirm pre/post behavior.
3. Re-apply scoped edits with manual inspection.
4. Re-run folder validation commands.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

## Source: `008-spec-kit-code-quality/plan.md`

---
title: "Implementation Plan: Spec Kit Code Quality Completion Run [008-spec-kit-code-quality/plan.md]"
description: "Execution plan for phase 008 hardening across system-spec-kit and mcp_server, including baseline stabilization, read-only review coverage, moderate modularization, README modernization, standards propagation, and final verification/context save."
trigger_phrases:
  - "implementation plan"
  - "phase 008"
  - "quality hardening"
  - "baseline tests"
SPECKIT_TEMPLATE_SOURCE: "plan-core + level2-verify + level3-arch | v2.2"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Spec Kit Code Quality Completion Run

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript + Node.js + Vitest + Markdown documentation |
| **Framework** | `system-spec-kit` skill workspace with `mcp_server` quality gates |
| **Storage** | Filesystem + SQLite-backed memory index paths in `mcp_server` |
| **Testing** | `npm --prefix .opencode/skill/system-spec-kit test` + focused Vitest suites + validation script |

### Overview
The plan executes in five ordered phases: baseline stabilization of the locked failing triad, full read-only review wave coverage, moderate surgical modularization, scoped README modernization plus standards propagation, and final verification/context save. Predecessor phase `004` is treated as complete context; this phase is the quality closure lane.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Locked decisions captured in spec (`chatgpt` runtime path, max six review lanes, baseline triad must be fixed, moderate modularization depth, README scope boundary).
- [ ] Baseline failing assertions reproducible via focused command set.
- [ ] Review wave lane template and bounded summary schema prepared.

### Definition of Done
- [ ] Baseline triad failures resolved in focused and full reruns.
- [ ] Read-only review wave completed with consolidated findings.
- [ ] Modularization gate and regression checks pass.
- [ ] README modernization limited to repo-owned scope.
- [ ] `sk-code--opencode` propagation completed or no-delta documented.
- [ ] Final verification matrix, spec validation, and context save completed.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Quality-hardening pipeline with staged stabilization and bounded parallel review orchestration.

### Key Components
- **Baseline Stabilization Lane**: Fixes locked failing assertions before structural edits.
- **Review Wave Orchestrator**: Up to six read-only lanes producing bounded summaries.
- **Moderate Modularization Lane**: Focused extraction in oversized handlers with API stability constraints.
- **Documentation Scope Filter**: README discovery/update rules that exclude vendor/generated trees.
- **Standards Propagation Gate**: Conditional updates to `sk-code--opencode` when net-new patterns are introduced.
- **Verification and Memory Closure Lane**: Full quality command matrix plus `generate-context.js` save.

### Data Flow
1. Reproduce and isolate locked failing triad.
2. Apply targeted fixes and confirm focused pass.
3. Execute six-lane read-only review and rank findings.
4. Apply moderate modularization and constrained README/standards updates.
5. Run final matrix (lint/test/validation), generate completion artifacts, and save context.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:ai-protocol -->
## 4. AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm modifications stay within approved phase scope.
- [ ] Confirm no file edits occur before relevant source/template reads.
- [ ] Confirm lane concurrency does not exceed six parallel leaf reviews.

### Execution Rules

| Rule ID | Rule | Enforcement |
|--------|------|-------------|
| TASK-SEQ-001 | Baseline triad stabilization executes before modularization edits | Prevents refactor masking root-cause failures |
| TASK-SCOPE-002 | README updates limited to repo-owned paths under `system-spec-kit` | Blocks vendor/generated drift |
| TASK-PAR-003 | Read-only review wave uses max six parallel lanes | Preserves bounded synthesis and deterministic closure |
| TASK-STD-004 | `sk-code--opencode` propagation is conditional and evidence-based | Avoids unnecessary standards churn |

### Status Reporting Format
`[PHASE:<id>] [STATE:pending|in_progress|blocked|done] [EVIDENCE:<artifact-or-command>]`

### Blocked Task Protocol
1. Mark task `[B]` with blocking cause and impacted requirement IDs.
2. Capture last successful command/output path.
3. Escalate with options: unblock dependency, narrow scope, or defer with approval.
4. Resume only after blocker disposition is recorded in tasks/checklist.
<!-- /ANCHOR:ai-protocol -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Baseline Stabilization
- [ ] Reproduce locked failing triad from current baseline.
- [ ] Fix `graph-search-fn`, `query-expander`, and `memory-save-extended` failing assertions.
- [ ] Verify focused reruns for the triad and store evidence outputs.

### Phase 2: Full Read-Only Review Wave
- [ ] Run six-or-fewer read-only lanes with bounded summary format.
- [ ] Consolidate lane outputs into prioritized remediation inventory.
- [ ] Confirm review coverage completeness before structural edits proceed.

### Phase 3: Moderate Surgical Modularization
- [ ] Apply focused extraction to oversized handler seams (`memory-index`, selective `memory-save` sections).
- [ ] Keep existing exported interfaces and response contracts stable.
- [ ] Pass modularization gate and regression reruns.

### Phase 4: README Modernization + Standards Propagation
- [ ] Generate README scope manifest (repo-owned only, exclusions enforced).
- [ ] Modernize in-scope READMEs for clarity and consistency.
- [ ] Apply conditional `sk-code--opencode` propagation updates when deltas are real.

### Phase 5: Final Verification + Context Save
- [ ] Execute full verification command matrix.
- [ ] Validate phase folder and finalize checklist/implementation summary.
- [ ] Save context via `generate-context.js`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Baseline triad reruns | Three locked failing assertions | `vitest run tests/graph-search-fn.vitest.ts tests/query-expander.vitest.ts tests/memory-save-extended.vitest.ts` |
| Modularization gate | Oversized module threshold and structure checks | `vitest run tests/modularization.vitest.ts` |
| Full regression | Workspace-wide quality confirmation | `npm --prefix .opencode/skill/system-spec-kit test` |
| Lint gate | MCP server TypeScript linting | `npm --prefix .opencode/skill/system-spec-kit/mcp_server run lint` |
| Spec validation | Phase documentation integrity | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-spec-kit-code-quality` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/system-spec-kit/mcp_server` runtime and tests | Internal | Available | Cannot reproduce/fix baseline failures |
| `vitest` + Node workspace scripts | Internal | Available | Verification matrix cannot be completed |
| README path inventory under `system-spec-kit` | Internal | Available | README modernization scope cannot be enforced |
| `sk-code--opencode` references/checklists | Internal | Available | Standards propagation gate cannot be resolved |
| `generate-context.js` memory save script | Internal | Available | Closure context persistence cannot be completed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

- **Trigger**: Regression introduced by targeted fixes, modularization extraction, or scoped documentation updates.
- **Procedure**:
1. Revert phase-local commits in reverse order of phases.
2. Re-run focused failing-test triad to confirm baseline rollback state.
3. Re-run modularization test and lint/test matrix for integrity confirmation.
4. Re-open blocker note with cause and revised mitigation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 9. L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline) ──► Phase 2 (Review Wave) ──► Phase 3 (Modularization) ──► Phase 4 (Docs/Standards) ──► Phase 5 (Verify/Save)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline Stabilization | None | Review Wave, Modularization, Final Verify |
| Review Wave | Baseline Stabilization | Modularization Prioritization |
| Modularization | Baseline Stabilization + Review Findings | Docs/Standards, Final Verify |
| README/Standards | Modularization | Final Verify |
| Verify/Save | All prior phases | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 10. L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline Stabilization | Medium | 2-4 hours |
| Read-Only Review Wave | Medium | 2-3 hours |
| Moderate Modularization | High | 3-6 hours |
| README + Standards Propagation | Medium | 1-2 hours |
| Final Verification + Context Save | Medium | 1-2 hours |
| **Total** | | **9-17 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 11. L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Capture pre-change baseline command outputs.
- [ ] Confirm selective file-touch list is available.
- [ ] Confirm no out-of-scope directories are staged.

### Rollback Procedure
1. Revert modularization edits first, then baseline fixes, then docs updates.
2. Run focused triad tests to verify rollback fidelity.
3. Run `npm --prefix .opencode/skill/system-spec-kit test` to confirm baseline behavior.
4. Re-document failure cause and updated action plan before reattempt.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A (source and docs only).
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## 12. L3: DEPENDENCY GRAPH

```
┌──────────────────────┐
│ Phase 1 Baseline     │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│ Phase 2 Review Wave  │
└───────┬────────┬─────┘
        │        │
┌───────▼───┐ ┌──▼─────────────┐
│ Phase 3A  │ │ Phase 3B       │
│ Memory    │ │ Modularization │
│ Fixes     │ │ Extraction     │
└───────┬───┘ └──┬─────────────┘
        │        │
        └──┬─────┘
           ▼
┌──────────────────────┐
│ Phase 4 Docs/Std     │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ Phase 5 Verify/Save  │
└──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline triad fixes | Current failing assertions | Green targeted reruns | Review + modularization |
| Read-only review lanes | Baseline reproduction context | Prioritized remediation queue | Modularization sequence |
| Moderate modularization | Baseline green + review input | Maintainable handlers + passing modularization test | Docs/Standards + final verify |
| README modernization | Updated code boundaries | Scoped docs refresh | Final verify |
| Standards propagation | Actual code-pattern deltas | Updated or waived `sk-code--opencode` docs | Final verify |
| Final verify + context save | All above | Closure-ready evidence and saved context | Completion claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## 13. L3: CRITICAL PATH

1. **Baseline triad stabilization** - 2-4 hours - CRITICAL
2. **Read-only review synthesis** - 1-2 hours - CRITICAL
3. **Moderate modularization + modularization test pass** - 3-6 hours - CRITICAL
4. **Final verification matrix and context save** - 1-2 hours - CRITICAL

**Total Critical Path**: 7-14 hours

**Parallel Opportunities**:
- Review lanes can run in parallel up to six concurrent bounded summaries.
- README modernization prep and standards-delta analysis can overlap after modularization risk is bounded.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:commands -->
## 14. VERIFICATION COMMAND MATRIX

| Gate | Command | Expected Result |
|------|---------|-----------------|
| Baseline triad | `npm --prefix .opencode/skill/system-spec-kit/mcp_server run test -- tests/graph-search-fn.vitest.ts tests/query-expander.vitest.ts tests/memory-save-extended.vitest.ts` | All targeted failures resolved |
| Modularization | `npm --prefix .opencode/skill/system-spec-kit/mcp_server run test -- tests/modularization.vitest.ts` | Oversized-module gate passes |
| Lint | `npm --prefix .opencode/skill/system-spec-kit/mcp_server run lint` | No blocking lint errors |
| Full suite | `npm --prefix .opencode/skill/system-spec-kit test` | No unresolved P0 failures |
| Spec validation | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-spec-kit-code-quality` | Exit `0` or `1` with documented warnings |
| Context save | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 02--system-spec-kit/022-hybrid-rag-fusion/008-spec-kit-code-quality` | Memory file generated successfully |
<!-- /ANCHOR:commands -->
