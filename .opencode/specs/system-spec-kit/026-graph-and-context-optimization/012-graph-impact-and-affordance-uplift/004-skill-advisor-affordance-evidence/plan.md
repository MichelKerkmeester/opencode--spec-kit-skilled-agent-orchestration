---
title: "Implementation Plan: Skill Advisor Affordance Evidence (012/004)"
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Implement affordance normalization, then route sanitized evidence through existing Skill Advisor derived and graph-causal lanes. Validate with focused scorer, compiler, static, and documentation checks."
trigger_phrases:
  - "012/004 plan"
  - "affordance evidence plan"
  - "skill advisor affordance plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-graph-impact-and-affordance-uplift/004-skill-advisor-affordance-evidence"
    last_updated_at: "2026-04-25T14:03:00+02:00"
    last_updated_by: "copilot-gpt-5.5"
    recent_action: "Normalized plan doc"
    next_safe_action: "Review local commit"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Skill Advisor Affordance Evidence (012/004)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Python 3 |
| **Framework** | Vitest, Python script test harness |
| **Storage** | Skill Advisor graph metadata and scorer projection inputs |
| **Testing** | Vitest, `npm run typecheck`, Python test suite, static scans |

### Overview

The implementation adds an allowlist normalizer for structured affordance inputs, then feeds sanitized triggers and edges into existing scoring surfaces. The scorer normalizes request-time inputs before lane execution, while the compiler treats `derived.affordances[]` as derived metadata without expanding entity kinds.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented [EVIDENCE: spec.md scope and requirements]
- [x] Success criteria measurable [EVIDENCE: spec.md SC-001 through SC-006]
- [x] Dependencies identified [EVIDENCE: 012/001 license approval recorded in implementation-summary.md]

### Definition of Done

- [x] All acceptance criteria met [EVIDENCE: focused Vitest, Python suite, and static scans pass]
- [x] Tests passing for packet scope [EVIDENCE: 20 focused Vitest tests and 53 Python tests pass]
- [x] Docs updated [EVIDENCE: feature catalog, playbook, checklist, and implementation summary updated]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Input normalization before scoring with narrow derived and graph-causal integration.

### Key Components

- **Affordance normalizer**: Accepts structured affordance objects, strips unsafe content, and emits stable normalized triggers and edges.
- **Fusion scorer**: Normalizes raw affordance options once and passes normalized data to lane scorers.
- **Derived lane**: Adds low-weight sanitized affordance trigger matches under `derived_generated`.
- **Graph-causal lane**: Adds request-local affordance edges using existing `EDGE_MULTIPLIER` keys.
- **Python compiler**: Converts `derived.affordances[]` into derived signals and existing sparse adjacency.

### Data Flow

Raw affordance inputs enter `scoreAdvisorPrompt()`, pass through `normalize()`, then contribute to existing derived and graph-causal lane scores. Compile-time affordances follow the same allowlist shape and become graph signals without new entity kinds.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read agent brief and pt-02 RISK-05 constraints.
- [x] Confirm 012/001 license approval.
- [x] Read scorer, compiler, projection, and test files before editing.

### Phase 2: Core Implementation

- [x] Create `affordance-normalizer.ts`.
- [x] Wire normalized affordances through fusion and existing lanes.
- [x] Extend Python compiler support for `derived.affordances[]`.
- [x] Preserve entity kind and relation allowlists.

### Phase 3: Verification

- [x] Add allowlist, privacy, lane attribution, and routing fixture tests.
- [x] Add Python compiler affordance and entity-kind tests.
- [x] Add feature catalog and manual playbook docs.
- [x] Record full-directory test blockers that sit outside packet scope.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Normalizer privacy and allowlist behavior | Vitest |
| Unit | Lane attribution and native scorer behavior | Vitest |
| Regression | Routing recall and explicit-trigger precedence | Vitest |
| Compiler | Derived affordance compilation and entity-kind invariant | Python test suite |
| Static | `ALLOWED_ENTITY_KINDS` and `EDGE_MULTIPLIER` literals | grep and file inspection |
| Documentation | DQI for catalog and playbook entries | sk-doc `extract_structure.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 012/001 license audit | Internal | Green | Clean-room adaptation would stop without approval |
| pt-02 RISK-05 | Internal research | Green | Defines privacy and schema constraints |
| Existing scorer lanes | Internal code | Green | Affordance evidence must reuse these lanes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Affordance evidence leaks raw phrases, creates new lane attribution, or changes graph schema invariants.
- **Procedure**: Revert the local commit for 012/004 and rerun the focused scorer and Python compiler suites.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup ──► Core Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 012/001 license approval | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Commit handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1 hour |
| Core Implementation | Medium | 4 hours |
| Verification | Medium | 2 hours |
| **Total** | | **7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Focused tests run.
- [x] Static allowlist scans run.
- [x] Documentation evidence recorded.

### Rollback Procedure

1. Revert the 012/004 commit.
2. Run the focused Skill Advisor scorer tests.
3. Run the Python Skill Advisor test suite.
4. Confirm affordance API references are gone from scorer options.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Code revert only.
<!-- /ANCHOR:enhanced-rollback -->

---
