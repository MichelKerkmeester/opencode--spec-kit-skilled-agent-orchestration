---
title: "Implementation Plan: 008-hydra-db-based-features"
description: "Closure plan for the Hydra parent pack, all six phase packs, supporting operator docs, and the remaining runtime truth-sync regressions."
trigger_phrases:
  - "implementation plan"
  - "hydra roadmap"
  - "truth sync"
  - "phase pack normalization"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: 008-hydra-db-based-features

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation over a TypeScript and Node.js runtime |
| **Framework** | `system-spec-kit` v2.2 templates, spec validation, Vitest, and repo-local CLI configuration docs |
| **Storage** | Parent pack, six child phase packs, `mcp_server/`, and supporting operator docs |
| **Testing** | Recursive spec validation, targeted Vitest regressions, full `mcp_server` and scripts verification, alignment-drift checks |

### Overview
This closure plan finishes the Hydra parent pack and all six child phase packs as one coherent documentation set, fixes the remaining runtime truth-sync defects found in review, refreshes March 17 2026 verification evidence, and records live prompt proof for all five required CLIs. The work is intentionally corrective rather than expansive: no new Hydra capability is introduced beyond the already shipped roadmap slices.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent and phase validation failures were reproduced locally.
- [x] Runtime review findings were isolated to shared-space owner enforcement and retention-sweep database routing.
- [x] Active Level 3 and Level 3+ templates were reviewed before rewriting the spec-pack docs.

### Definition of Done
- [x] Parent pack and phase packs follow active template structure and required anchors.
- [x] Absorbed `017-markovian-architectures` content and dead references are removed from the Hydra pack.
- [x] Recorded March 17 2026 evidence totals are consistent in authoritative Hydra closure docs.
- [x] Shared-space owner enforcement and retention deletion routing are covered by passing regression tests.
- [x] CLI documentation now includes live five-CLI prompt proof evidence with timestamps and command outcomes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-first closure over an already shipped modular runtime. The parent pack coordinates, the phase packs hold detailed delivery history, and the runtime plus regression tests remain the truth source for behavior claims.

### Key Components
- **Parent pack**: root `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`
- **Phase packs**: `001-` through `006-`, each normalized to active Level 3+ structure
- **Runtime fixes**: `shared-spaces.ts`, `retention.ts`, `vector-index-mutations.ts`
- **Regression tests**: Hydra truth-sync, shared-space, and retention-governance suites
- **Operator docs**: `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` and `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`

### Data Flow
1. Reproduce validation and review failures.
2. Normalize parent and phase pack structure to the active templates.
3. Fix runtime defects uncovered by the review.
4. Refresh evidence wording and counts, then capture live five-CLI proof.
5. Re-run spec validation, runtime suites, scripts suites, and alignment drift checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Audit parent-pack drift, phase-pack drift, and CLI-proof requirements.
- [x] Reproduce runtime review defects with targeted source and test inspection.
- [x] Lock the March 17 2026 evidence set to the commands rerun in this closure pass.

### Phase 2: Core Implementation
- [x] Normalize the parent pack to active Level 3 template structure.
- [x] Normalize all six child phase packs to active Level 3+ template structure.
- [x] Remove stale merged `017` content and dead doc references.
- [x] Fix shared-space owner enforcement and retention sweep deletion routing.
- [x] Align install and manual-testing docs with live five-CLI proof evidence requirements.

### Phase 3: Verification
- [x] Re-run root and recursive phase validation.
- [x] Re-run targeted Hydra runtime regressions and the full `mcp_server` suite.
- [x] Re-run scripts-side multi-CLI closure checks and alignment-drift validation.
- [x] Run and capture live prompt proof for Claude Code, OpenCode, Codex, Gemini, and Copilot.
- [x] Tighten the Hydra truth-sync regression test to pin authoritative dates and totals.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec Validation | Parent pack plus six child phase packs | `validate.sh`, recursive validation |
| Runtime Regression | Shared-space access, retention deletion, Hydra truth-sync | Vitest |
| Package Verification | TypeScript compile, build, focused Hydra lane, full suite | `npx tsc --noEmit`, `npm run build`, `npm run test:hydra:phase1`, `npm test` |
| Scripts Verification | Scripts type/build checks and multi-CLI capture lanes | `npm run check`, `npm run build`, targeted `npm test -- --run ...` |
| Standards Drift | Documentation/code alignment checks | `verify_alignment_drift.py` |

Notes:
- The March 17 2026 rerun set recorded `283` passed files, `7790` passed tests, `11` skipped, and `28` todo in `mcp_server`.
- The scripts-side targeted multi-CLI closure suite passed `7` files and `54` tests.
- Live prompt proof was captured for all five required CLIs with timestamped command results.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Active `system-spec-kit` Level 3 and 3+ templates | Internal documentation | Green | Parent and phase packs cannot be normalized reliably |
| Hydra phase folders `001-` through `006-` | Internal documentation | Green | Parent coordination narrative loses detailed backing |
| `mcp_server` runtime and tests | Internal code | Green | Behavior claims cannot be proven or corrected |
| Scripts multi-CLI capture suites and live CLI binaries | Internal tooling | Green | CLI-proof validation and evidence capture cannot complete |
| March 17 2026 rerun set | Internal evidence | Green | Counts and claims drift again |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: spec validation regresses, runtime regressions fail, or the updated docs overstate behavior the rerun set does not prove.
- **Procedure**:
1. Revert the closure edits to the affected doc or runtime slice only.
2. Re-run the targeted validation or regression command for that slice.
3. Restore the last truthful wording or behavior before broadening scope again.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Audit -> Doc Normalization -> Runtime Fixes -> Verification -> Final Truth-Sync
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit | None | All later closure work |
| Doc Normalization | Audit | Verification |
| Runtime Fixes | Audit | Verification |
| Verification | Doc Normalization + Runtime Fixes | Final reporting |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit | Medium | 45-60 minutes |
| Doc Normalization | High | 2-3 hours |
| Runtime Fixes | Medium | 30-60 minutes |
| Verification | Medium | 60-90 minutes |
| **Total** | | **4-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Validation failures reproduced before edits
- [x] Runtime defects isolated before code changes
- [x] Evidence totals locked to a dated rerun set

### Rollback Procedure
1. Revert the affected runtime or documentation slice.
2. Re-run the most local failing validator or test.
3. Re-apply only the subset that is supported by evidence.

### Data Reversal
- **Has data migrations?** No new migrations in this closure pass
- **Reversal procedure**: Revert doc changes or targeted runtime fixes only
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Templates + Existing Hydra Docs + Runtime Review
                 |
                 v
         Parent/Phase Normalization
                 |
                 +----> Runtime Fixes
                 |           |
                 +-----------+
                        |
                        v
                 Verification Sweep
                        |
                        v
                 Final Truth-Sync Docs
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Doc normalization | Templates + existing Hydra pack | Clean parent and phase structure | Verification |
| Runtime fixes | Review findings + runtime code | Corrected behavior and tests | Verification |
| Verification sweep | Normalized docs + runtime fixes | Pass or fail evidence | Final reporting |
| Truth-sync docs | Verification sweep | Authoritative closure record | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Reproduce validation and runtime defects.
2. Normalize parent and phase spec packs.
3. Apply runtime fixes and refresh regression tests.
4. Re-run validation and package suites.

**Total Critical Path**: 4 ordered closure stages

**Parallel Opportunities**:
- Parent-pack docs and phase-pack docs can be normalized in parallel.
- Runtime regression fixes can run in parallel with CLI-proof capture preparation.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Root template parity restored | Root `spec.md`, `plan.md`, and `decision-record.md` follow Level 3 structure and anchors | Documentation normalization complete |
| M2 | Evidence truth-sync complete | Root closure docs consistently report `283` files, `7790` tests, `11` skipped, and `28` todo; targeted Hydra suite recorded as `53` tests | Verification evidence updated |
| M3 | Live proof gate complete | Live prompt proof recorded for Claude Code, OpenCode, Codex, Gemini, and Copilot with command-level evidence | Final review pass complete |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Build Versioned Memory State on Top of Current Schema

**Status**: Accepted

**Context**: The roadmap required lineage and `asOf` support without destabilizing the existing memory stack.

**Decision**: Extend the current schema incrementally with append-first lineage and active projection semantics.

**Consequences**:
- Preserves migration safety and existing retrieval behavior.
- Requires stronger compatibility and integrity test coverage as lineage depth grows.

---

### ADR-002: Unify Graph and Feedback Inside Current MCP Server First

**Status**: Accepted

**Context**: Existing retrieval, causal, and ranking modules already provided enough surface to ship value without introducing a new service boundary.

**Decision**: Keep graph and adaptive feedback integration in-process before considering an external graph subsystem.

**Consequences**:
- Delivers faster roadmap value with lower operational overhead.
- Increases local module coupling and requires disciplined instrumentation.

---

### ADR-003: Enforce Governance Before Shared Memory Rollout

**Status**: Accepted

**Context**: Shared-memory access adds collaboration value but materially increases scope-leakage and compliance risk if launched before governance controls.

**Decision**: Ship hierarchical scope enforcement, auditability, retention, and deletion controls before enabling shared-memory collaboration live.

**Consequences**:
- Aligns rollout with safety and compliance requirements.
- Adds governance implementation and validation work before broader collaboration enablement.
