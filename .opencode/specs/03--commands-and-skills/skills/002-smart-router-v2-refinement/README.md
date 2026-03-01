# Smart Router V2 Refinement - Ambiguity & Efficiency Improvements

**Spec Folder**: `002-smart-router-v2-refinement`  
**Level**: 3 (Architecture decisions, risk matrix, user stories)  
**Status**: Draft (ready for implementation)  
**Created**: 2026-02-17

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. SUCCESS TARGETS](#success-targets)
- [3. DOCUMENTS](#documents)
- [4. QUICK START](#quick-start)
- [5. DEPENDENCIES](#dependencies)
- [6. ROLLBACK PLAN](#rollback-plan)
- [7. VERIFICATION HIGHLIGHTS](#verification-highlights)
- [8. ARCHITECTURE DECISIONS (ADRS)](#architecture-decisions-adrs)
- [9. IMPLEMENTATION TARGETS](#implementation-targets)
- [10. UNRESOLVED ITEMS](#unresolved-items)
- [11. RELATED SPECS](#related-specs)

## 1. OVERVIEW

This spec documents refinements to Smart Router V2 (baseline: 001-smart-router-v2) addressing ambiguity handling gaps and efficiency weaknesses discovered during initial deployment.

### Key Refinements

1. **Adaptive Top-N Intent Selection**: Expand from top-2 to top-3 candidates when score delta <0.15 or multi-symptom prompts detected
2. **Expanded Synonym Lexicon**: 7+ noisy terms ("janky", "unstable", "freeze", "dirty workspace", "flaky", "intermittent", "wonky")
3. **Strong UNKNOWN Fallback**: Explicit disambiguation checklist (3-5 items) when aggregate score <0.5
4. **Verification Command Disambiguation**: React/React Native marker collision resolution with priority order
5. **Test Suite Alignment**: Pseudocode validation, heading parser safety, ambiguity-focused fixtures
6. **Optional Benchmark Harness**: Hidden-resource discovery timing, ambiguity resilience scoring with JSON report

---

## Success Targets

- **60%+ ambiguity accuracy** on new test fixtures (baseline <40% from V2)
- **25% improvement** in hidden-resource discovery time (via benchmark harness)
- **Backward compatibility** with V2 baseline (all existing tests continue passing)

---

## Documents

| File | Lines | Purpose |
|------|-------|---------|
| `spec.md` | 314 | Requirements, user stories, risk matrix, complexity assessment |
| `plan.md` | 370 | Technical approach, phases, dependency graph, 3 ADRs |
| `tasks.md` | 291 | 27 granular tasks across 5 phases with verification commands |
| `checklist.md` | 295 | 30+ verification items (13 P0, 12 P1, 5 P2) with evidence requirements |
| `decision-record.md` | 368 | 3 ADRs (top-N threshold, synonym lexicon, UNKNOWN fallback) |

**Total**: 1,638 lines of Level 3 documentation

---

## Quick Start

### Implementation Phases

1. **Phase 1**: Synonym Lexicon & Top-N Adaptive Logic (3-5 hours)
2. **Phase 2**: UNKNOWN Fallback & Verification Disambiguation (4-6 hours)
3. **Phase 3**: Test Suite Enhancements (5-8 hours)
4. **Phase 4**: Benchmark Harness - Optional (2-4 hours)
5. **Phase 5**: Documentation & Verification (2-3 hours)

**Total Effort**: 16-26 hours

### Critical Path

1. T001: Synonym mappings → 1-2 hours (blocks all downstream)
2. T003: Top-N adaptive selector → 2-3 hours (core refinement)
3. T006: UNKNOWN fallback → 1.5 hours (P0 requirement)
4. T012-T015: Test suite enhancements → 4-6 hours (verification dependency)
5. T024-T026: Test execution + accuracy verification → 1-2 hours (DoD gates)

**Critical Path Total**: 11-17 hours

---

## Dependencies

- **Smart Router V2 baseline** (001-smart-router-v2) must be complete
- **Test suite infrastructure** coordination (pseudocode parsing work in progress)
- **router-rules.json** format compatibility
- **SKILL.md ANCHOR conventions** preserved

---

## Rollback Plan

**Trigger**: Ambiguity accuracy <60% OR test suite regressions

**Procedure**:
1. Set feature flag: `ROUTER_TOP_N_ADAPTIVE=false`
2. Revert SKILL.md changes to V2 baseline: `git restore .opencode/skill/sk-code--*/SKILL.md .opencode/skill/sk-git/SKILL.md`
3. Revert router-rules.json: `git restore ...001-smart-router-v2/scratch/smart-router-tests/router-rules.json`
4. Re-run test suite to verify V2 baseline behavior restored
5. Preserve fixtures and benchmark harness (no rollback needed)

---

## Verification Highlights

### P0 Requirements (MUST complete)

- [ ] REQ-001: Adaptive top-N intent selection (2→3 when delta <0.15)
- [ ] REQ-002: Expanded synonym lexicon (7+ noisy terms)
- [ ] REQ-003: Strong UNKNOWN fallback bundles with disambiguation checklist
- [ ] REQ-004: Candidate verification command sets for ambiguous stacks
- [ ] REQ-005: Test suite alignment (pseudocode validation, heading parser safety)

### P1 Requirements (complete OR user-approved deferral)

- [ ] REQ-006: Ambiguity-focused test scenario fixtures
- [ ] REQ-007: Optional benchmark harness for efficiency reporting
- [ ] REQ-008: Documentation of top-N adaptive methodology

---

## Architecture Decisions (ADRs)

### ADR-001: Top-N Adaptive Expansion Threshold (Delta 0.15)
- **Status**: Proposed
- **Decision**: Use delta 0.15 for top-2 → top-3 expansion
- **Rationale**: Balances ambiguity accuracy (60%+ target) with performance (<2ms overhead)
- **Alternatives Rejected**: Delta 0.10 (too sensitive), 0.20 (misses close cases), fixed top-3 (high overhead)

### ADR-002: Centralized Synonym Lexicon (router-rules.json)
- **Status**: Proposed
- **Decision**: Single source of truth in router-rules.json with skill-specific context hints
- **Rationale**: Consistency across skills, lightweight maintenance, supports skill-specific interpretation
- **Alternatives Rejected**: Distributed per-skill (duplication), external API (overkill), no expansion (fails goal)

### ADR-003: UNKNOWN Fallback Disambiguation Checklist (3-5 Items)
- **Status**: Proposed
- **Decision**: 3-5 item actionable checklist with graceful degradation
- **Rationale**: Balances disambiguation power (60%+ improvement) with workflow speed (8-10 seconds avg)
- **Alternatives Rejected**: 7-10 items (too slow), 1-2 items (insufficient), no checklist (fails goal)

---

## Implementation Targets

### Skills Affected (4 files)
- `.opencode/skill/sk-code--full-stack/SKILL.md` (primary implementation)
- `.opencode/skill/sk-code--web/SKILL.md` (synonym + UNKNOWN fallback)
- `.opencode/skill/sk-code--opencode/SKILL.md` (synonym + UNKNOWN fallback)
- `.opencode/skill/sk-git/SKILL.md` (synonym + UNKNOWN fallback)

### Test Suite (4 files)
- `router-rules.json` (synonym lexicon + top-N thresholds)
- `run-smart-router-tests.mjs` (pseudocode validation + heading parser safety)
- `fixtures/ambiguity-close-score.json` (NEW: delta <0.15 test cases)
- `fixtures/ambiguity-multi-symptom.json` (NEW: multi-symptom prompts)

### Benchmark (1 file, optional)
- `../001-smart-router-v2/scratch/smart-router-tests/benchmark-smart-router.mjs` (efficiency measurement + JSON report)

---

## Unresolved Items

*(Tracked in this README section and related spec artifacts.)*

- Optimal delta threshold validation (0.15 proposed, may require tuning after deployment)
- React/React Native marker collision priority order (React Native > React proposed, may need user testing)
- Synonym lexicon quarterly review process ownership (maintainer TBD)
- Benchmark harness CI/CD integration recommendation (manual vs automated)

---

## Related Specs

- **Parent Spec (Baseline)**: `../001-smart-router-v2/` (Smart Router V2 initial deployment)
- **Test Suite Location**: `../001-smart-router-v2/scratch/smart-router-tests/`

---

**Last Updated**: 2026-02-17  
**Next Review**: After Phase 3 completion (test suite enhancements)
