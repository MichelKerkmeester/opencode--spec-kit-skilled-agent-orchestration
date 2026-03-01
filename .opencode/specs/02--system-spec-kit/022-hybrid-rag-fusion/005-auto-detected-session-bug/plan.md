---
title: "Implementation Plan: Auto-Detected Session Selection Bug [template:level_2/plan.md]"
description: "This plan updates spec-folder auto-detection to use deterministic candidate normalization and confidence-aware selection. The approach preserves existing priority order while adding stronger filtering, scoring, and regression coverage."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
trigger_phrases:
  - "implementation"
  - "plan"
  - "auto-detected session bug"
  - "folder detector"
  - "plan core"
importance_tier: "high"
contextType: "implementation"
---
# Implementation Plan: Auto-Detected Session Selection Bug

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) + Markdown command specs |
| **Framework** | Internal SpecKit scripting/runtime modules |
| **Storage** | Local filesystem + optional SQLite session_learning lookup |
| **Testing** | Node-based functional script tests and focused regression assertions |

### Overview
The fix centers on `folder-detector.ts`, where current auto-detection can over-trust mtime and return stale archived context. Implementation adds deterministic alias normalization, active-folder preference, and confidence gates that require confirmation or safe fallback when ambiguous. Supporting command docs and regression tests are updated to keep behavior and guidance aligned.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing for new regression matrix
- [x] Docs updated and synchronized across spec/plan/tasks/checklist
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic heuristic ranking with confidence gate and explicit fallback.

### Key Components
- **Candidate Canonicalization Layer**: normalizes `specs/` and `.opencode/specs/` references to one comparable path identity.
- **Candidate Filter and Scorer**: excludes archive/fixture folders by default, then ranks remaining candidates with stable tie-breakers beyond raw mtime.
- **Confidence Decision Gate**: when score gap is low or threshold not met, requires user confirmation or a deterministic safe fallback.

### Data Flow
Input sources (CLI arg, JSON data, session-learning DB, CWD, auto-detect scan) are resolved in existing priority order. Auto-detect path candidates are normalized, filtered, and scored; if confidence is high, best candidate is selected directly. If confidence is low, the flow prompts for confirmation or applies a documented fallback path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup and Baseline
- [x] Confirm current behavior and reproduce archived-folder misselection case.
- [x] Define deterministic scoring/tie-break rules and confidence threshold constants.
- [x] Prepare regression fixtures for alias, archive, and mtime distortion cases.

### Phase 2: Core Implementation
- [x] Add canonical alias normalization for `.opencode/specs` and `specs`.
- [x] Apply active non-archived preference with explicit archive/fixture filtering.
- [x] Replace mtime-only winner logic with deterministic composite scoring.
- [x] Add low-confidence confirmation/fallback behavior and rationale output.

### Phase 3: Verification and Documentation
- [x] Add or update functional regression tests covering REQ-001 through REQ-004.
- [x] Update command docs (`resume.md`, `handover.md`) for behavior parity.
- [x] Run validation/tests and capture evidence in checklist + implementation summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit-style functional checks | Candidate normalization/filtering/scoring behavior in folder detector | Existing Node test scripts in `scripts/tests/` |
| Integration behavior checks | Full priority chain with mixed folder sets and confidence outcomes | `test-folder-detector-functional.js` updates |
| Manual | Reproduce wrong archived selection and verify corrected auto-detect output | Terminal execution of relevant SpecKit commands |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing folder-detector priority chain | Internal | Green | Incorrect reordering could regress explicit argument handling. |
| Alignment/confidence utilities | Internal | Green | Low-confidence flow may be inconsistent without synchronized thresholds. |
| Regression test harness in `scripts/tests/` | Internal | Green | Missing coverage would allow this bug to recur silently. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Regression tests fail for explicit CLI/data selection or users report new misrouting after deployment.
- **Procedure**: Revert detector scoring/filter updates, restore prior stable behavior, and keep enhanced test fixtures for iteration.
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline) ─────┐
                        ├──► Phase 2 (Detector Fix) ──► Phase 3 (Verify)
Phase 1.5 (Test Matrix) ┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline | None | Detector Fix, Test Matrix |
| Test Matrix | Baseline | Detector Fix, Verify |
| Detector Fix | Baseline, Test Matrix | Verify |
| Verify | Detector Fix | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and Baseline | Medium | 1-2 hours |
| Core Implementation | Medium | 3-5 hours |
| Verification and Documentation | Medium | 2-3 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created for modified detector files
- [ ] Regression suite updated with new bug scenarios
- [ ] Selection rationale logging enabled for diagnosis

### Rollback Procedure
1. Revert detector and alignment changes in the targeted files.
2. Re-run regression suite to confirm pre-change stability.
3. Verify `/spec_kit:resume` and `/spec_kit:handover` explicit-path behavior manually.
4. Document rollback reason and failing scenario in this spec folder.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
