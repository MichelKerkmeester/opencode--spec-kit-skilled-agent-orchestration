---
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
title: "Implementation Plan: sk-code--opencode Alignment Hardening [040-sk-code-opencode-alignment-hardening/plan]"
description: "This document preserves the existing technical decisions and adds validator-required readme structure."
trigger_phrases:
  - "implementation"
  - "plan"
  - "code"
  - "opencode"
  - "alignment"
  - "040"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: sk-code--opencode Alignment Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---
## 0. OVERVIEW
This document preserves the existing technical decisions and adds validator-required readme structure.

## DOCUMENT SECTIONS
Use the anchored sections below for complete details.


<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 |
| **Framework** | Standard library only (`argparse`, `os`, `json`, `re`) |
| **Storage** | None |
| **Testing** | `pytest` (unit/behavior fixtures) + CLI smoke runs |

### Overview
This implementation hardens verifier signal quality by reducing path noise, narrowing rule applicability, and fixing scan correctness gaps (.mts coverage, JSONC line mapping, overlapping-root duplicates). Work is constrained to verifier logic, regression fixtures/tests, and usage documentation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

## 2A. AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm target files match scope in `spec.md` Section 3
- [ ] Confirm each task maps to REQ-002 through REQ-012
- [ ] Confirm baseline command/output artifact is captured before logic edits

### Task Execution Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| TASK-SEQ | Execute phases in order: Setup -> Implementation -> Verification | Do not start Phase 3 before Phase 2 pass criteria |
| TASK-SCOPE | Edit only verifier/test/doc files listed in `spec.md` | Reject out-of-scope refactors |
| TASK-EVIDENCE | Every completed checklist item needs evidence | Reference command output or file path |

### Status Reporting Format
- Use: `STATUS: <phase> | <task-id> | <state> | <evidence>`
- Example: `STATUS: Phase 2 | T013 | done | test_verify_alignment_drift.py::test_ts_header_scope`

### Blocked Task Protocol
1. Mark task `[B]` in `tasks.md` with the blocking condition.
2. Capture blocker evidence in `scratch/` and summarize in `checklist.md`.
3. Stop dependent tasks until blocker is resolved or explicitly deferred.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Rule-driven scanner pipeline with policy filters.

### Key Components
- **Root Normalizer**: Resolves and deduplicates CLI roots and file paths before checking.
- **Path Policy Filter**: Applies explicit include/exclude semantics for noisy trees and rule targeting.
- **Language Router**: Maps extensions (including `.mts`) to rule evaluators.
- **JSONC Cleaner**: Strips comments while preserving line alignment.
- **Reporter**: Emits deterministic summary and findings with stable ordering.

### Data Flow
1. Parse repeated `--root` arguments.
2. Normalize roots and walk filesystem with exclusion policy.
3. Deduplicate candidate files by normalized path.
4. Route files by extension and path context to rule checks.
5. Emit deterministic summary and actionable findings.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture baseline run command and output artifact (`853` scanned / `354` violations)
- [ ] Add regression fixture tree for each defect class
- [ ] Add failing tests that reproduce current defects

### Phase 2: Core Implementation
- [ ] Implement root normalization + overlap deduplication
- [ ] Add path exclusions for known noise directories
- [ ] Add `.mts` support in extension routing
- [ ] Introduce TS module-header applicability policy for production modules only
- [ ] Make JSONC block-comment stripping line-preserving
- [ ] Resolve `tsconfig` comment false-positive path

### Phase 3: Verification
- [ ] Run targeted tests and full verifier regression suite
- [ ] Run post-change baseline comparison against same roots
- [ ] Update README and finalize checklist evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `strip_jsonc_comments`, path-policy helpers, dedupe helpers | `pytest` |
| Integration | End-to-end verifier runs on synthetic fixture trees | `pytest` + subprocess |
| Manual | Baseline re-run on repository roots and output diff review | shell CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py` | Internal | Green | No implementation possible without script edits |
| Fixture directory under `.opencode/skill/sk-code--opencode/tests/fixtures/` | Internal | Yellow | Incomplete fixtures reduce confidence in fixes |
| `pytest` runtime availability | Internal | Yellow | Slows verification and defect containment |
| Existing CLI consumers of verifier output | Internal | Green | Output/exit regressions can break automation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Post-change scan hides expected violations or runtime overhead exceeds NFR-P01.
- **Procedure**: Revert verifier logic changes, keep fixtures/tests, rerun baseline command to confirm restoration of pre-change behavior.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline + Fixtures) ───► Phase 2 (Hardening Logic) ───► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline + Fixtures | None | Hardening Logic |
| Hardening Logic | Baseline + Fixtures | Verification |
| Verification | Hardening Logic | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline + Fixtures | Medium | 3-4 hours |
| Core Hardening Logic | High | 6-10 hours |
| Verification + Docs | Medium | 3-5 hours |
| **Total** | | **12-19 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline output artifact saved
- [ ] Regression tests in place
- [ ] Post-change output diff reviewed

### Rollback Procedure
1. Revert verifier script changes in one commit.
2. Re-run baseline command on same roots.
3. Confirm counts and key rule distribution return to expected pre-change profile.
4. Keep tests/fixtures to prevent future regressions.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐
│  Baseline + Fixtures │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Scanner Hardening   │
│  (dedupe + filtering)│
└───────┬────────┬─────┘
        │        │
        ▼        ▼
┌──────────────┐  ┌──────────────────┐
│ TS/.mts Rules│  │ JSONC Line Mapping│
└───────┬──────┘  └─────────┬────────┘
        └──────────┬────────┘
                   ▼
           ┌───────────────┐
           │ Verification   │
           └───────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline Harness | None | Reproducible before metrics | Scanner Hardening |
| Scanner Hardening | Baseline Harness | Correct file set | TS/.mts Rules, JSONC |
| TS/.mts Rules | Scanner Hardening | Reduced TS header noise + `.mts` coverage | Verification |
| JSONC Mapping | Scanner Hardening | Correct JSONC diagnostics | Verification |
| Verification | TS/.mts Rules, JSONC Mapping | Pass/fail and metric deltas | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Establish baseline + regression fixtures** - 3-4 hours - CRITICAL
2. **Implement dedupe/filtering/coverage/mapping changes** - 6-10 hours - CRITICAL
3. **Run validation and compare metrics** - 3-5 hours - CRITICAL

**Total Critical Path**: 12-19 hours

**Parallel Opportunities**:
- Fixture authoring and README update can run in parallel once requirements are fixed.
- TS applicability tests and JSONC mapping tests can be built concurrently.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline and fixtures ready | Defect set fully reproduced in tests | End of Phase 1 |
| M2 | Core hardening merged | REQ-002 through REQ-008 implemented | End of Phase 2 |
| M3 | Release-ready verifier | Success criteria SC-001 through SC-005 met | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Policy-Driven Scan Filtering and Rule Applicability

**Status**: Accepted

**Context**: Baseline findings show rule and path overreach causing high noise.

**Decision**: Add explicit path-policy and rule-applicability layers before rule execution.

**Consequences**:
- Improved signal quality and maintainable filtering logic.
- Requires fixture-backed governance to avoid accidental blind spots.

**Alternatives Rejected**:
- Ad hoc per-rule string checks: rejected due to high drift and low maintainability.
