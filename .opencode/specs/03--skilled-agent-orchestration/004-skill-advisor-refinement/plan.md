---
title: "Implementation Plan: Skill Advisor Refinement [template:level_3/plan.md]"
description: "Implement nine targeted skill advisor improvements with measurable routing quality and latency gates."
trigger_phrases:
  - "skill advisor plan"
  - "confidence uncertainty"
  - "latency benchmark"
  - "regression harness"
# <!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Skill Advisor Refinement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3, stdlib-only script workflow |
| **Framework** | CLI utility with argparse |
| **Storage** | File system metadata (mtime), JSON/JSONL fixtures |
| **Testing** | Script-based regression harness + benchmark harness |

### Overview
This implementation keeps the advisor conservative by default and adds explicit opt-in for confidence-only filtering. It introduces clear separation between real skills and command bridges, then improves runtime via caching and metadata precomputation while adding measurable quality and performance gates. Structural mode adds batch/persistent operation to reduce repeated subprocess startup overhead.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria measurable with pass/fail thresholds
- [x] Dependencies identified (SKILL.md structure, Python runtime)

### Definition of Done
- [x] All acceptance criteria met [E: regression-report top1_accuracy=1.0, p0_pass_rate=1.0]
- [x] Regression harness passes all P0/P1 gates [E: regression-report overall_pass=true, total_cases=34]
- [x] Benchmark report shows pass criteria met [E: benchmark-report overall_pass=true, throughput_multiplier=25.8538x]
- [x] Docs updated (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) [E: spec folder sync]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Functional pipeline with lightweight runtime service helpers.

### Key Components
- **Intent normalization layer**: Canonicalizes prompt tokens and phrase cues before scoring.
- **Discovery/cache layer**: Loads skills once per process, tracks mtimes, invalidates on change.
- **Metadata cache**: Precomputes normalized name/description token sets per skill.
- **Scoring and calibration layer**: Applies boosters, margin-aware confidence, ambiguity-aware adjustments.
- **Ranking policy layer**: Keeps command bridges separate and applies explicit-intent preference logic.
- **Execution modes**: Supports one-shot default and structural mode (`--batch` / persistent mode).

### Data Flow
CLI input -> normalize intent -> load cached skills/metadata -> score real skills and command bridges in separate pools -> calibrate confidence and uncertainty -> apply default dual-threshold or explicit confidence-only override -> emit ranked JSON output with reasoning fields.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline and design lock
- [x] Capture baseline routing quality and latency metrics on frozen dataset [E: benchmark harness runs=7].
- [x] Define fixture schema for regression and benchmark harness [E: `.opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl`].
- [x] Confirm CLI contract for default mode vs explicit `--confidence-only` [E: regression behavior checks + README flags].

### Phase 2: Core refinements
- [x] Implement default uncertainty guard retention plus explicit `--confidence-only` override [E: regression harness pass].
- [x] Implement command bridge separation with explicit slash-intent preference [E: command_bridge_fp_rate=0.0].
- [x] Implement cache + mtime invalidation, frontmatter-only parsing, and precomputed metadata [E: `skill_advisor_runtime.py` + warm p95 0.6081 ms].
- [x] Implement margin-aware confidence and ambiguity-aware adjustment [E: top1_accuracy=1.0].
- [x] Implement structural mode and batch execution path (`--batch-file`, `--batch-stdin`) [E: throughput_multiplier=25.8538x].

### Phase 3: Verification and hardening
- [x] Add permanent regression harness and protected cases [E: `skill_advisor_regression.py`, total_cases=34].
- [x] Add benchmark harness and compare before/after metrics [E: `skill_advisor_bench.py`, subprocess p95=46.9855 ms].
- [x] Update script documentation and usage examples [E: `.opencode/skill/scripts/README.md` and `.opencode/skill/scripts/SET-UP_GUIDE.md` updates].
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Functional regression | Expected top skills, confidence/uncertainty behavior | `python3 .opencode/skill/scripts/skill_advisor_regression.py --dataset .opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl --mode both` |
| Performance benchmark | One-shot vs warm cache vs structural mode | `python3 .opencode/skill/scripts/skill_advisor_bench.py --dataset .opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl --runs 7` |
| CLI integration | Flag combinations and output schema | `python3 .opencode/skill/scripts/skill_advisor.py --health` and scripted invocation cases |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing skill frontmatter (`*/SKILL.md`) | Internal | Green | Missing names/descriptions reduce ranking quality |
| Python 3 interpreter in runtime environment | External | Green | Script execution and benchmarks unavailable |
| Stable fixture dataset in repo | Internal | Green | Metrics comparison remains consistent across runs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Regression harness fails P0 gate or routing quality drops below baseline after merge candidate.
- **Procedure**: Revert modified advisor/runtime/harness files as a single set, restore prior one-shot behavior, rerun baseline command pack.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline) ────────┐
                           ├──► Phase 2 (Core Refinements) ──► Phase 3 (Verification)
Phase 1.5 (Fixture Lock) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline | None | Core Refinements, Fixture Lock |
| Fixture Lock | Baseline | Core Refinements, Verification |
| Core Refinements | Baseline, Fixture Lock | Verification |
| Verification | Core Refinements | Done |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline + Fixture Lock | Medium | 3-4 hours |
| Core Refinements | High | 10-14 hours |
| Verification + Docs | Medium | 4-6 hours |
| **Total** | | **17-24 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline metrics artifact captured and archived [E: benchmark and regression report outputs]
- [x] Regression dataset version pinned [E: committed JSONL fixture path]
- [x] New flags documented in README [E: `--confidence-only`, batch mode examples]

### Rollback Procedure
1. Revert advisor refinement commit(s) touching script files in this scope.
2. Re-run baseline command pack to confirm previous behavior restoration.
3. Re-run `--health` and baseline regression command for sanity validation.
4. Document rollback result in spec checklist evidence lines.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (fixture files can be reverted by git rollback)
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐      ┌────────────────────┐      ┌────────────────────┐
│ Baseline +   │─────►│ Core Advisor Logic │─────►│ Regression + Bench │
│ Fixture Lock │      │ and Runtime Cache  │      │ Gates + Docs       │
└──────────────┘      └─────────┬──────────┘      └────────────────────┘
                                │
                         ┌──────▼──────┐
                         │ Structural  │
                         │ Mode Track  │
                         └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline Harness | None | Baseline metrics JSON | Core logic merge |
| Runtime Cache Layer | Baseline Harness | Warm-path latency gains | Benchmark closure |
| Calibration Layer | Intent normalization | Stable ranking outputs | Regression closure |
| Structural Mode | Runtime cache + calibration | Batch throughput gains | Final completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline capture and fixture lock** - 3 hours - CRITICAL
2. **Default filtering + command bridge separation + calibration** - 8 hours - CRITICAL
3. **Regression and benchmark gate completion** - 5 hours - CRITICAL

**Total Critical Path**: 16 hours

**Parallel Opportunities**:
- Frontmatter parser optimization and metadata precompute can run in parallel with intent normalization.
- Structural mode implementation can run in parallel with regression fixture authoring after baseline lock.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline Locked | Dataset + baseline metrics committed to artifacts | Achieved |
| M2 | Core Refinements Complete | All nine improvements implemented in scope | Achieved |
| M3 | Release Ready | Regression and latency gates pass with evidence | Achieved |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:architecture -->
## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Dual-threshold remains default; confidence-only is explicit override

**Status**: Accepted

**Context**: The current behavior can bypass uncertainty safety when threshold is explicitly set, which increases overconfident routing in ambiguous prompts.

**Decision**: Keep dual-threshold filtering as default in all modes. Add `--confidence-only` to intentionally bypass uncertainty filtering.

**Consequences**:
- Safer default behavior aligned with uncertainty guard intent.
- Slightly stricter filtering by default; mitigated with explicit override for power users.

**Alternatives Rejected**:
- Keep confidence-only behavior tied to explicit `--threshold`: rejected due to hidden safety downgrade.

<!-- /ANCHOR:architecture -->
---

### AI Execution Protocol

### Pre-Task Checklist
- Confirm regression fixture path resolves and contains the protected case IDs (`U001-U004`, `C001-C010`) before changing scoring logic.
- Confirm benchmark output location `.opencode/skill/scripts/out/` is writable so latency evidence can be regenerated after edits.
- Confirm CLI contract remains backward compatible for one-shot mode (`python3 .../skill_advisor.py "prompt"`) before enabling structural mode paths.

### Execution Rules
- Keep dual-threshold filtering as the default path; only bypass uncertainty filtering when `--confidence-only` is explicitly supplied.
- Keep command bridges and real skills in separate candidate pools and apply slash-intent preference only when the input explicitly signals command intent.
- Keep runtime changes scoped to `.opencode/skill/scripts/` advisor files and preserve existing JSON response shape.
- Re-run both regression and benchmark harnesses after any scoring, cache, or parser modification.

### Status Reporting Format
- Report each implementation checkpoint as: `STATUS | component | result | evidence`.
- Example for this spec: `DONE | calibration layer | top1_accuracy=1.0 | .opencode/skill/scripts/out/regression-report.json`.
- Example for performance gate: `DONE | structural mode | throughput_multiplier=25.8538x | .opencode/skill/scripts/out/benchmark-report.json`.

### Blocked Task Protocol
- If a P0/P1 gate fails, mark the related task as blocked in `tasks.md` and include the failing gate ID and command output path.
- If benchmark or regression harness cannot execute due to environment issues, stop merge-readiness claims and document blocker details plus mitigation attempt.
- Resume only after blocker evidence is updated and the failed gate is rerun with passing output.

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
