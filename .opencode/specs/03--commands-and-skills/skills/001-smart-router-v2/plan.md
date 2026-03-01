---
title: "Implementation Plan: Smart Router V2 Rollout [001-smart-router-v2/plan]"
description: "This rollout updates 10 skill definition files to Smart Router V2 behavior using weighted keyword classification, recursive references/assets discovery, and stack/language detec..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "smart"
  - "router"
  - "rollout"
  - "034"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Smart Router V2 Rollout

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation and skill routing metadata |
| **Framework** | OpenCode skill framework with template-driven spec workflow |
| **Storage** | Filesystem only (Public repo + Barter repo) |
| **Testing** | Spec validation script and manual routing scenario checks |

### Overview
This rollout updates 10 skill definition files to Smart Router V2 behavior using weighted keyword classification, recursive references/assets discovery, and stack/language detection where applicable. The implementation is documentation-driven and preserves existing entry points, constraints, and skill invocation semantics. Verification focuses on routing fidelity, consistency of scoring semantics, and non-breaking behavior across Public and Barter targets.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` Sections 2-3)
- [x] Success criteria measurable (`spec.md` Section 5)
- [x] Dependencies identified (`spec.md` Section 6)

### Definition of Done
- [ ] All acceptance criteria met across 10 target skill files
- [ ] Skill routing checks pass for weighted classification and fallback behavior
- [ ] Docs synchronized (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Phased documentation-first rollout with backward-compatible in-place skill definition updates.

### Key Components
- **Routing Classification Layer**: Replaces first-hit matching with weighted intent scoring and threshold-based fallback.
- **Discovery Layer**: Adds recursive references/assets traversal with bounded depth and safe no-directory fallback.
- **Stack Detection Layer**: Adds marker-based stack/language detection for workflow-code targets.
- **Compatibility Guardrail Layer**: Preserves existing invocation APIs, command naming, and constraints.

### Data Flow
User prompt terms are scored against skill-specific weighted keyword groups, then optional recursive resources and stack/language markers refine the final route selection; if confidence is low, routing falls back to the current generic path so behavior remains stable.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm 10 rollout targets and repository boundaries (Public 8 + Barter 2)
- [x] Establish Level 3 spec documentation baseline in target spec folder
- [ ] Prepare comparison checklist for pre/post routing behavior

### Phase 2: Core Implementation
- [ ] Apply weighted keyword classification updates to Public skill files (8 targets)
- [ ] Apply weighted keyword classification updates to Barter skill files (2 targets)
- [ ] Add recursive references/assets discovery documentation where directories exist
- [ ] Add stack/language detection routing details to code workflow skills
- [ ] Preserve current invocation semantics and explicit constraints in every updated skill

### Phase 3: Verification
- [ ] Validate all modified skill docs for consistency and non-breaking semantics
- [ ] Run scenario-based routing checks for weighted scores, ties, and fallback
- [ ] Confirm cross-repo parity where behavior should match
- [ ] Complete implementation summary and close checklist evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A (documentation-only routing spec updates) | N/A |
| Integration | Skill routing semantics across 10 targets | Manual scenario matrix |
| Manual | Prompt-to-route validation and fallback behavior | CLI inspection + reviewer walkthrough |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Access to Public skill files | Internal | Green | Public rollout cannot proceed |
| Access to Barter skill files | External directory | Green | Cross-repo parity validation delayed |
| Existing template and validation scripts | Internal | Green | Documentation quality checks reduced |
| Current skill behavior baseline | Internal | Yellow | Accuracy improvement claims become weaker |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Routing regressions, ambiguity spikes, or any observed breaking behavior in skill invocation.
- **Procedure**: Revert modified SKILL.md targets to previous commit state in the affected repository, then re-run manual scenario checks to confirm baseline behavior restoration.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Docs + Baseline) ───────────────┐
                                         ├──► Phase 2A (Public 8) ──┐
Phase 1b (Routing Scenario Matrix) ──────┘                          ├──► Phase 3 (Verify + Closeout)
                                         └──► Phase 2B (Barter 2) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Public rollout, Barter rollout |
| Public rollout | Setup | Verification |
| Barter rollout | Setup | Verification |
| Verification | Public rollout, Barter rollout | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Medium | 5-8 hours |
| Verification | Medium | 2-4 hours |
| **Total** | | **8-14 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline snapshots captured for each target skill file
- [ ] Rollout sequence documented (Public first, Barter second)
- [ ] Verification scenario matrix prepared

### Rollback Procedure
1. Stop rollout in the current repository and record failing scenario.
2. Revert modified target SKILL.md files to previous known-good revision.
3. Re-run manual route checks for the failing scenario plus fallback cases.
4. Record root cause and patch plan before attempting another rollout pass.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐      ┌────────────────────────┐      ┌─────────────────────┐
│   Phase 1            │─────►│   Phase 2A + 2B        │─────►│   Phase 3           │
│   Spec + Baseline    │      │   Public + Barter Docs │      │   Verification      │
└──────────────────────┘      └───────────┬────────────┘      └─────────────────────┘
                                          │
                                  ┌───────▼────────┐
                                  │  ADR Alignment │
                                  │  + Scoring Map │
                                  └────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Target inventory | None | Canonical 10-file rollout list | Public/Barter updates |
| Public rollout docs | Target inventory | Updated Public skill routing docs | Final verification |
| Barter rollout docs | Target inventory | Updated Barter skill routing docs | Final verification |
| Verification matrix | Public + Barter rollout docs | Readiness decision and closeout evidence | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Finalize target inventory and scoring model assumptions** - 1 hour - CRITICAL
2. **Update 8 Public skill documents with Smart Router V2 rules** - 3-5 hours - CRITICAL
3. **Update 2 Barter skill documents with parity rules** - 1-2 hours - CRITICAL
4. **Run verification matrix and close checklist evidence** - 2-4 hours - CRITICAL

**Total Critical Path**: 7-12 hours

**Parallel Opportunities**:
- Public skill updates can run in two workstreams (code-related vs workflow-related skills).
- Barter updates can begin once Public patterns are stable enough for copy-aligned adaptation.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Documentation Baseline Complete | Level 3 spec docs validated in target folder | Current phase |
| M2 | Public 8 Rollout Complete | All Public targets updated with Smart Router V2 content | Implementation phase |
| M3 | Barter 2 Rollout Complete | Both Barter targets updated and aligned to rollout model | Implementation phase |
| M4 | Release Ready | Verification matrix confirms non-breaking routing behavior | Closeout phase |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Weighted Scoring with Safe Fallback

**Status**: Accepted

**Context**: First-hit keyword matching is brittle for multi-signal prompts and causes avoidable routing mismatches.

**Decision**: Use weighted keyword scoring with confidence thresholds and preserve fallback to generic routing when confidence is low.

**Consequences**:
- Better routing precision for composite requests.
- Additional documentation complexity mitigated by shared scoring guidelines.

**Alternatives Rejected**:
- Deterministic first-hit matching: rejected due to poor handling of mixed-intent prompts.

---

<!-- ANCHOR:ai-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm target file is in-scope for this spec.
- Confirm no SKILL.md implementation edits are made during documentation-only phase.
- Confirm anchors remain valid after each documentation edit.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| R1 | Read files before modifying them |
| R2 | Keep scope locked to Smart Router V2 rollout documentation |
| R3 | Preserve backward-compatible intent in implementation instructions |
| R4 | Record verification evidence for completed checklist items |

### Status Reporting Format
- Current phase
- Completed tasks
- Pending tasks
- Warnings or blockers

### Blocked Task Protocol
If a task is blocked, mark it `[B]`, document blocker reason and dependency, propose a specific unblocking action, and continue non-blocked tasks in the same phase.
<!-- /ANCHOR:ai-protocol -->

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
