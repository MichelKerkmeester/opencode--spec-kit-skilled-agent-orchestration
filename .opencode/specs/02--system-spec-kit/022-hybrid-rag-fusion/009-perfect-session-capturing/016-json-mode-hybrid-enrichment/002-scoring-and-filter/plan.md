---
title: "Implementation Plan: Scoring and Filter — Quality Scorer Recalibration and Contamination Filter Expansion"
description: "Implements quality scorer recalibration by removing the +0.20 bonus system and adds contamination filter coverage to 4 uncleaned text fields plus 7 missing pattern categories. Sequential execution across 7 files, no new dependencies."
trigger_phrases:
  - "scoring filter implementation plan"
  - "recalibrate quality scorer"
  - "extend contamination filter"
  - "filterContamination workflow"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Scoring and Filter

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | None — standalone pipeline scripts |
| **Storage** | None — pipeline transforms only |
| **Testing** | Vitest (existing test suite) |

### Overview

This plan addresses two defects identified in Domain C (Quality Scoring Accuracy) and Domain E (Hallucination and Error Prevention) of the Round 2 deep research investigation. The work is sequential across 7 files: fix the calibration test import first, then recalibrate the scorer, then extend the contamination filter calls in workflow.ts, then add missing filter patterns, then add the projectPhase override, then propagate it through input-normalizer.ts, and finally wire post-save findings back to the score. Each step can be verified independently before the next begins.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Round 2 research complete with source-level citations (../research.md)
- [x] Sibling phase 001-initial-enrichment complete (workflow.ts changes won't conflict)
- [x] Live scorer confirmed: extractors/quality-scorer.ts imported at workflow.ts:39
- [x] Dead-code scorer confirmed: core/quality-scorer.ts is NOT imported anywhere in production paths
- [ ] Existing Vitest suite baseline run recorded before any changes

### Definition of Done

- [ ] All P0 requirements met and verified against acceptance criteria in spec.md
- [ ] All P1 requirements met OR individually approved for deferral
- [ ] `npx vitest run` passes (no regressions)
- [ ] quality-scorer-calibration.vitest.ts imports extractors/quality-scorer.ts and passes
- [ ] checklist.md P0 items all marked [x] with evidence

### AI Execution Protocol

- [ ] Pre-Task Checklist documented for this implementation pass.
- [ ] Execution Rules documented for this implementation pass.
- [ ] Status Reporting Format documented for this implementation pass.
- [ ] Blocked Task Protocol documented for this implementation pass.

### Pre-Task Checklist

- [ ] Re-read `extractors/quality-scorer.ts`, `core/workflow.ts`, and `post-save-review.ts` before editing.
- [ ] Confirm the live scorer import path and dead-code scorer path before changing tests or calibration logic.
- [ ] Keep edits scoped to the seven target files listed in `spec.md`.
- [ ] Re-check acceptance criteria in `spec.md` before marking implementation tasks complete.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope Lock | Edit only the files listed in `spec.md`; do not reopen sibling packets. |
| Read First | Re-read each target function in full before editing. |
| Verify Per Phase | Re-run the relevant Vitest or manual validation after each implementation phase. |
| Evidence First | Do not mark checklist items complete without explicit evidence. |

### Status Reporting Format

`Phase 002: <status> -> <artifact or validation result>`

### Blocked Task Protocol

1. Stop if the live scorer or workflow import path does not match the documented scope.
2. Document any user-approved deferral before continuing with later phases.
3. Re-run the affected verification step before resuming work after a blocker is cleared.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Pipeline transformation — all changes are within the generate-context.js build tree. No new abstractions, no new dependencies.

### Key Components

- **extractors/quality-scorer.ts**: Live scorer. Remove bonus constants (lines 113-205); recalibrate so penalty weight drives the final score meaningfully.
- **core/workflow.ts**: Orchestrator. Extend `filterContamination` call sites at lines 548-602 to cover 4 additional field locations.
- **extractors/contamination-filter.ts**: Pattern library. Add 7 missing categories as additional string entries in the existing pattern array structure.
- **extractors/session-extractor.ts**: Session assembly. Add `resolveProjectPhase()` following the exact pattern of `resolveContextType()` (line 188) and `resolveImportanceTier()`.
- **utils/input-normalizer.ts**: Normalization. Propagate `projectPhase` field through both fast-path and slow-path branches (lines 437-491).
- **core/post-save-review.ts**: Post-save analysis. Compute penalty from finding severity; pass to a scorer adjustment hook.
- **tests/quality-scorer-calibration.vitest.ts**: Test fix. Change 1 import line (line 5).

### Data Flow

```
JSON input
  → input-normalizer.ts (projectPhase propagated)
    → session-extractor.ts (resolveProjectPhase() called)
      → workflow.ts (filterContamination extended to all text fields)
        → extractors/quality-scorer.ts (bonuses removed, score discriminative)
          → core/post-save-review.ts (findings fed back to score)
            → saved memory file
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Foundation Fixes (P0 — no-risk, high-confidence)

- [ ] P1-T1 Run `npx vitest run` and record baseline pass/fail state
- [ ] P1-T2 Fix quality-scorer-calibration.vitest.ts: change import on line 5 from `core/quality-scorer` to `extractors/quality-scorer` (1 LOC)
- [ ] P1-T3 Run calibration tests; confirm they now exercise the live scorer

### Phase 2: Scorer Recalibration (P0)

- [ ] P2-T1 Read extractors/quality-scorer.ts lines 113-205 to understand current bonus constants and penalty structure
- [ ] P2-T2 Remove the three bonus additions (+0.05 messages, +0.05 tools, +0.10 decisions)
- [ ] P2-T3 Verify penalty math: five simultaneous MEDIUM penalties = 5 * (-0.03 each) = -0.15 from a 1.00 base → 0.85 (discriminative)
- [ ] P2-T4 Adjust penalty weights if needed so the score range 0.60-1.00 is actively used for real sessions
- [ ] P2-T5 Run calibration tests; confirm new score distribution matches expectations

### Phase 3: Contamination Filter Extension (P0)

- [ ] P3-T1 Read workflow.ts lines 548-602 to map all existing filterContamination call sites
- [ ] P3-T2 Add filterContamination call for `_JSON_SESSION_SUMMARY` (guard for undefined)
- [ ] P3-T3 Add filterContamination call for each entry in `_manualDecisions` array
- [ ] P3-T4 Add filterContamination call for each entry in `recentContext` array
- [ ] P3-T5 Add filterContamination call for `technicalContext` KEY strings and VALUE strings
- [ ] P3-T6 Manual test: save with hedging text in sessionSummary; confirm cleaned output

### Phase 4: Missing Contamination Categories (P1)

- [ ] P4-T1 Read contamination-filter.ts and enumerate current 29 patterns
- [ ] P4-T2 Add hedging phrases category ("I think", "it seems", "perhaps", "might be", "could be")
- [ ] P4-T3 Add conversational acknowledgment ("Certainly!", "Of course!", "Sure!", "Absolutely!")
- [ ] P4-T4 Add meta-commentary ("As an AI", "As a language model", "I should note")
- [ ] P4-T5 Add instruction echoing (repetition of prompt fragments as opening sentences)
- [ ] P4-T6 Add markdown artifacts (stray backtick blocks, orphaned headers in prose fields)
- [ ] P4-T7 Add safety disclaimers ("I'm not able to", "I cannot", "Please consult a professional")
- [ ] P4-T8 Add redundant certainty markers ("It is important to note", "It is worth mentioning")
- [ ] P4-T9 Run contamination filter unit tests; confirm no over-stripping of valid content

### Phase 5: projectPhase Override (P1)

- [ ] P5-T1 Read session-extractor.ts lines 188-207 to understand resolveContextType() and resolveImportanceTier() patterns
- [ ] P5-T2 Implement resolveProjectPhase() following the same explicit-override pattern
- [ ] P5-T3 Read input-normalizer.ts lines 437-491 (fast path) and slow path to find projectPhase handling
- [ ] P5-T4 Add projectPhase propagation in fast-path branch
- [ ] P5-T5 Add projectPhase propagation in slow-path branch
- [ ] P5-T6 Manual test: JSON save with `"projectPhase": "IMPLEMENTATION"` produces `PROJECT_PHASE: IMPLEMENTATION` in saved file

### Phase 6: Post-Save Review Score Feedback (P1)

- [ ] P6-T1 Read post-save-review.ts to understand finding severity output structure
- [ ] P6-T2 Compute penalty from findings: HIGH = -0.10, MEDIUM = -0.05 per finding (or chosen values per ADR-003)
- [ ] P6-T3 Add score adjustment hook: apply accumulated penalty to quality_score after post-save review completes
- [ ] P6-T4 Document final penalty values in decision-record.md ADR-003
- [ ] P6-T5 Manual test: trigger a HIGH post-save finding and confirm quality_score is lower than pre-review value

### Phase 7: Verification

- [ ] P7-T1 Run full `npx vitest run` suite; confirm zero regressions
- [ ] P7-T2 Perform end-to-end save with a deliberately low-quality JSON payload; confirm quality_score < 0.80
- [ ] P7-T3 Perform end-to-end save with contaminated text fields; confirm cleaned output in saved file
- [ ] P7-T4 Mark all checklist.md P0 items with evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | extractors/quality-scorer.ts scoring function with synthetic inputs | Vitest (quality-scorer-calibration.vitest.ts) |
| Unit | contamination-filter.ts pattern matching against hedging/boilerplate strings | Vitest (existing filter tests) |
| Integration | Full save pipeline with contaminated JSON payload; inspect output file | Manual / npx node generate-context.js |
| Integration | Full save with `projectPhase` supplied; inspect frontmatter | Manual |
| Regression | Full Vitest suite | `npx vitest run` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001-initial-enrichment complete | Internal | Green (complete) | workflow.ts edits would conflict |
| extractors/quality-scorer.ts confirmed as live scorer | Internal | Green (confirmed: workflow.ts:39) | Risk of editing dead code |
| Vitest suite baseline | Internal | Must record before Phase 1 | Cannot verify regressions |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Vitest suite regression count increases by more than 2, or end-to-end saves start failing after any phase
- **Procedure**: `git diff scripts/` to identify which files changed in the current phase; revert those files only; re-run tests to confirm baseline restored
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Foundation) ──► Phase 2 (Scorer) ──► Phase 3 (Filter Extension)
                                                        │
                                               Phase 4 (Filter Patterns)
                                                        │
                                               Phase 5 (projectPhase) ──► Phase 6 (Post-Save) ──► Phase 7 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Foundation | Baseline test run | Scorer, Filter Extension |
| Scorer | Foundation | Verification |
| Filter Extension | Foundation | Filter Patterns |
| Filter Patterns | Filter Extension | Verification |
| projectPhase Override | Foundation | Post-Save Feedback |
| Post-Save Feedback | projectPhase Override | Verification |
| Verification | All prior phases | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Foundation Fixes | Low | 15-30 min |
| Scorer Recalibration | Medium | 1-2 hours |
| Filter Extension (workflow.ts) | Medium | 1-2 hours |
| Filter Patterns (7 categories) | Low | 30-60 min |
| projectPhase Override | Medium | 1-2 hours |
| Post-Save Feedback | Medium | 1-2 hours |
| Verification | Low | 30-60 min |
| **Total** | | **5-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Vitest baseline recorded (pass count before changes)
- [ ] No feature flags needed (internal pipeline change)
- [ ] No data migration (score values in new saves only)

### Rollback Procedure

1. `git stash` or `git checkout -- scripts/` to revert all changes in the scripts directory
2. Run `npx vitest run` to confirm baseline restored
3. Re-examine research.md citations before retrying

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A — quality_score in previously saved memories is unaffected; only new saves use the recalibrated scorer
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
quality-scorer-calibration.vitest.ts (import fix)
        │
        ▼
extractors/quality-scorer.ts (bonus removal)
        │
        ├──► core/workflow.ts (filter extension) ──► extractors/contamination-filter.ts (new patterns)
        │
        └──► extractors/session-extractor.ts (resolveProjectPhase)
                        │
                        ▼
             utils/input-normalizer.ts (propagation)
                        │
                        ▼
              core/post-save-review.ts (score feedback)
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Calibration test fix | None | Verified test baseline | Scorer recalibration confidence |
| Scorer recalibration | Test fix | Discriminative quality_score | Post-save feedback |
| Filter extension | None | Cleaned additional fields | Nothing (independent of scorer) |
| Filter patterns | Filter extension | Broader contamination coverage | Nothing |
| resolveProjectPhase | None | Correct PROJECT_PHASE in output | Normalization propagation |
| Normalization propagation | resolveProjectPhase | projectPhase in session data | Post-save feedback |
| Post-save feedback | Scorer, normalization | Updated quality_score | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Calibration test import fix** — 15 min — CRITICAL (unlocks scorer work)
2. **Scorer recalibration** — 1-2 hours — CRITICAL
3. **Filter extension in workflow.ts** — 1-2 hours — CRITICAL (P0)
4. **resolveProjectPhase + propagation** — 2-3 hours — CRITICAL (P1)
5. **Post-save score feedback** — 1-2 hours — CRITICAL (P1)

**Total Critical Path**: ~6-10 hours

**Parallel Opportunities**:
- Filter pattern additions (Phase 4) can run in parallel with projectPhase work (Phase 5)
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | P0 foundations complete | Calibration test passes, scorer recalibrated, filter extended to all fields | End of Phase 3 |
| M2 | P1 enhancements complete | 7 filter categories added, projectPhase override works, post-save feedback active | End of Phase 6 |
| M3 | Release ready | Full Vitest suite green, checklist.md P0 items verified with evidence | End of Phase 7 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Bonus Removal vs. Rebalancing

**Status**: Proposed

**Context**: The +0.20 max bonus for normal session activity (message count, tool usage, decisions) makes the scorer unable to distinguish good saves from bad ones. Two approaches were considered: remove bonuses entirely, or rebalance so bonuses are smaller and penalties are larger.

**Decision**: Remove the bonus system entirely. Base the score on penalty accumulation from a 1.0 starting point. Clean sessions naturally score 1.0; problematic sessions score proportionally lower based on penalty weight.

**Consequences**:
- Score distribution becomes meaningful (0.60-1.00 range used actively)
- Existing saves keep their stored quality_score; only new saves are scored differently

**Alternatives Rejected**:
- Rebalancing (halving bonuses, doubling penalties): More complex, still arbitrary; removal is simpler and more honest about what the scorer measures.

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
