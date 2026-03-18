---
title: "Tasks: Skill Advisor Refinement [template:level_3/tasks.md]"
description: "Task Format with explicit owner, action, status, dependencies, and measurable outputs."
trigger_phrases:
  - "skill advisor tasks"
  - "routing quality gates"
  - "latency benchmark tasks"
# <!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Skill Advisor Refinement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?]` + explicit fields `Owner`, `Action`, `Status`, `Dependencies`, `Artifacts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Baseline and Scope Lock

| ID | Owner | Action | Status | Dependencies | Artifacts |
|----|-------|--------|--------|--------------|-----------|
| T001 | @general | Capture baseline routing and latency metrics for current advisor. | Completed | None | [Report: `benchmark-report.json` includes subprocess and warm p95] |
| T002 | @general | Create and lock regression fixture dataset covering all 9 improvement areas plus protected legacy cases. | Completed | T001 | [File: `.opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl`] |
| T003 [P] | @general | Define CLI contract for default dual-threshold vs explicit `--confidence-only`, plus structural mode flags. | Completed | T001 | [File: `.opencode/skill/scripts/README.md` and `.opencode/skill/scripts/SET-UP_GUIDE.md` new flags] |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Core Implementation

| ID | Owner | Action | Status | Dependencies | Artifacts |
|----|-------|--------|--------|--------------|-----------|
| T004 | @general | Implement default uncertainty guard retention when threshold is set. | Completed | T003 | [Test: `skill_advisor.py` with regression `overall_pass=true`] |
| T005 | @general | Add explicit `--confidence-only` override path. | Completed | T004 | [File: `skill_advisor.py`; README flag docs] |
| T006 [P] | @general | Separate command bridges from real skills and apply explicit slash-intent exception path. | Completed | T002 | [Report: health `command_bridges_found=2`; regression `command_bridge_fp_rate=0.0`] |
| T007 [P] | @general | Add per-process discovery cache with mtime invalidation and fast frontmatter-only parsing. | Completed | T002 | [Report: `skill_advisor_runtime.py`; benchmark warm p95 `0.6081 ms`] |
| T008 | @general | Precompute normalized metadata for scoring hot path. | Completed | T007 | [File: `skill_advisor_runtime.py` metadata cache path] |
| T009 | @general | Add margin-aware and ambiguity-aware confidence calibration. | Completed | T006, T008 | [Report: regression `top1_accuracy=1.0`] |
| T010 | @general | Add structural batch mode (`--batch-file`, `--batch-stdin`) to reduce subprocess overhead. | Completed | T007, T009 | [Report: benchmark `throughput_multiplier=25.8538x`] |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification and Documentation

| ID | Owner | Action | Status | Dependencies | Artifacts |
|----|-------|--------|--------|--------------|-----------|
| T011 | @general | Implement permanent regression harness with pass/fail gates for routing quality and safety behavior. | Completed | T004-T010 | [Test: `skill_advisor_regression.py`; `total_cases=34`] |
| T012 [P] | @general | Implement benchmark harness for before/after latency and throughput reporting. | Completed | T007, T010 | [Test: `skill_advisor_bench.py`; runs=7 output] |
| T013 | @general | Run validation command pack and archive outputs for checklist evidence. | Completed | T011, T012 | [Report: `regression-report.json` overall_pass=true; `benchmark-report.json` overall_pass=true] |
| T014 | @general | Update `.opencode/skill/scripts/README.md` and `.opencode/skill/scripts/SET-UP_GUIDE.md` with new flags and benchmark/regression commands. | Completed | T010-T013 | [File: both docs updated with `--confidence-only`, batch flags, harness commands] |
| T015 | @general | Final docs sync and checklist evidence completion for spec folder artifacts only. | Completed | T013, T014 | [File: spec folder docs transitioned to implementation-complete state] |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked completed and status moved from Pending to Completed [Report: T001-T015 complete]
- [x] No `[B]` blocked tasks remaining [Report: none tagged blocked]
- [x] Regression gate pass criteria met [Report: regression report]:
  - Top-1 routing accuracy >= 92%
  - Command-bridge false-positive rate <= 5% on non-slash prompts
  - P0 safety cases pass 100%
- [x] Performance gate pass criteria met [Report: benchmark report]:
  - Warm-call p95 <= 20 ms
  - Cold-call p95 <= 55 ms
  - Structural mode throughput >= 2.0x baseline
- [x] Script documentation aligned to implementation reality in both README and setup guide [File: `.opencode/skill/scripts/README.md`, `.opencode/skill/scripts/SET-UP_GUIDE.md`]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Architecture Decisions**: See `decision-record.md`

---

## Validation Command Pack

```bash
python3 .opencode/skill/scripts/skill_advisor.py --health
python3 .opencode/skill/scripts/skill_advisor_regression.py --dataset .opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl --mode both --out .opencode/skill/scripts/out/regression-report.json
python3 .opencode/skill/scripts/skill_advisor_bench.py --dataset .opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl --runs 7 --out .opencode/skill/scripts/out/benchmark-report.json
```

## Before/After Metrics Plan

| Metric | Baseline Source | Target | Gate Type |
|--------|-----------------|--------|-----------|
| Top-1 routing accuracy | `out/regression-report.json` | >= 92% | PASS (`1.0`) |
| Command bridge false-positive rate (non-slash intents) | `out/regression-report.json` | <= 5% | PASS (`0.0`) |
| Warm p95 latency | `out/benchmark-report.json` | <= 20 ms | PASS (`0.6081 ms`) |
| Cold p95 latency | `out/benchmark-report.json` | <= 55 ms | PASS (`46.9855 ms`) |
| Structural mode throughput multiplier | `out/benchmark-report.json` | >= 2.0x | PASS (`25.8538x`) |
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
