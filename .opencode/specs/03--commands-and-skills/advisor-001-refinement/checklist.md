---
title: "Verification Checklist: Skill Advisor Refinement [template:level_3/checklist.md]"
description: "Level 3 verification gates for routing quality, safety defaults, and latency targets."
trigger_phrases:
  - "skill advisor verification"
  - "regression gate"
  - "benchmark gate"
# <!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
importance_tier: "critical"
contextType: "verification"
---
# Verification Checklist: Skill Advisor Refinement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

## P0

- CHK-001, CHK-002, CHK-010, CHK-011, CHK-020, CHK-021, CHK-030, CHK-031, CHK-100, CHK-120, CHK-121 are hard blockers.

## P1

- CHK-003, CHK-012, CHK-013, CHK-022, CHK-023, CHK-032, CHK-040, CHK-041, CHK-050, CHK-051, CHK-110, CHK-111, CHK-122, CHK-123, CHK-130, CHK-131, CHK-140, CHK-141 are required unless explicitly deferred.

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` [EVIDENCE: File: `spec.md` requirements and success criteria updated]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` [EVIDENCE: File: `plan.md` architecture/phases/completion gates updated]
- [x] CHK-003 [P1] Scope boundary explicitly limited to advisor workflow and adjacent script files [EVIDENCE: File: implemented file list remains under `.opencode/skill/scripts/*`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Advisor script runs without runtime errors for normal and edge prompts [EVIDENCE: Report: regression harness `overall_pass=true`, `total_cases=34`]
- [x] CHK-011 [P0] `--health` output returns valid JSON and non-empty skill inventory [EVIDENCE: Report: `skills_found=16`, `command_bridges_found=2`]
- [x] CHK-012 [P1] Malformed frontmatter and missing metadata handled gracefully [EVIDENCE: Test: `parse_frontmatter_fast` malformed/valid temp-file checks returned expected null/dict results]
- [x] CHK-013 [P1] Changes remain in approved scope only (`.opencode/skill/scripts/*`) [EVIDENCE: File: implemented files are all under `.opencode/skill/scripts/*` plus spec-folder docs]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All P0 requirements REQ-001..REQ-005 pass [EVIDENCE: Report: regression `overall_pass=true`, `p0_pass_rate=1.0`]
- [x] CHK-021 [P0] Default behavior keeps uncertainty guard active even with threshold [EVIDENCE: Test: implemented coverage item #1 with regression pass]
- [x] CHK-022 [P1] Confidence-only override works only when explicit flag is set [EVIDENCE: Test: implemented coverage item #2 with README flag docs]
- [x] CHK-023 [P1] Command bridge separation works for slash and non-slash prompts [EVIDENCE: Report: `command_bridge_fp_rate=0.0`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets, tokens, or credentials introduced in new scripts [EVIDENCE: Test: secret-pattern scan across `.opencode/skill/scripts/*.py` returned no matches]
- [x] CHK-031 [P0] Batch/persistent mode validates input payload shape before processing [EVIDENCE: Test: invalid batch inputs returned structured JSON errors with exit code 2]
- [x] CHK-032 [P1] No new shell-execution or network dependencies introduced [EVIDENCE: Test: no `requests/urllib/http/socket` imports and no `shell=` execution paths]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist/decision-record synchronized for same scope and goals [EVIDENCE: File: all docs updated to completed nine-improvement state]
- [x] CHK-041 [P1] CLI help text and script docs explain new flags and defaults [EVIDENCE: File: `.opencode/skill/scripts/README.md` and `.opencode/skill/scripts/SET-UP_GUIDE.md` updated for `--confidence-only`, `--batch-file`, `--batch-stdin`]
- [x] CHK-042 [P2] Optional examples for common prompts added to script docs [File: `.opencode/skill/scripts/README.md` and `.opencode/skill/scripts/SET-UP_GUIDE.md` include confidence-only and batch examples]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Benchmark and regression artifacts written under `.opencode/skill/scripts/out/` only [EVIDENCE: File: `out/regression-report.json`, `out/benchmark-report.json`]
- [x] CHK-051 [P1] No ad-hoc temp files committed outside approved paths [EVIDENCE: File: implemented file list contains no temp artifacts]
- [ ] CHK-052 [P2] Context saved via `generate-context.js` after implementation completion [Reason: memory save step not part of this documentation update]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 10/11 |
| P1 Items | 18 | 18/18 |
| P2 Items | 12 | 6/12 |

**Verification Date**: 2026-03-03
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md` [EVIDENCE: File: ADR-001..ADR-004]
- [x] CHK-101 [P1] All ADRs include status and deciders [EVIDENCE: File: decision-record metadata tables]
- [x] CHK-102 [P1] Alternatives include rationale and score [EVIDENCE: File: alternatives sections include rationale + score]
- [x] CHK-103 [P2] Rollback and migration impact documented (script-only, no data migration) [File: `plan.md` rollback sections]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Warm and cold latency targets met [EVIDENCE: Report: warm p95 `0.6081 ms`; subprocess p95 `46.9855 ms`]
- [x] CHK-111 [P1] Structural mode throughput target >=2.0x met [EVIDENCE: Report: `throughput_multiplier=25.8538x`]
- [x] CHK-112 [P2] Benchmark repeated across at least 7 runs to reduce noise [Command: benchmark command used `--runs 7`]
- [x] CHK-113 [P2] Before/after benchmark report committed under `out/` [File: `.opencode/skill/scripts/out/benchmark-report.json`]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure tested via command pack re-run on reverted state [Reason: rollback drill evidence not provided]
- [x] CHK-121 [P0] Default CLI behavior remains backward compatible for one-shot mode [EVIDENCE: Test: one-shot subprocess benchmark path passes with default behavior]
- [x] CHK-122 [P1] Regression harness integrated into routine verification workflow [EVIDENCE: Command: regression command and gate metrics documented in tasks/checklist]
- [x] CHK-123 [P1] Script-level runbook documented in script docs [EVIDENCE: File: `.opencode/skill/scripts/README.md` and `.opencode/skill/scripts/SET-UP_GUIDE.md` harness and flag docs]
- [ ] CHK-124 [P2] Optional CI integration notes added [Reason: optional CI notes not included in supplied evidence]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Script-level security review completed (no command injection risk introduced) [EVIDENCE: Test: `subprocess.run` appears only in benchmark harness and no `shell=` usage]
- [x] CHK-131 [P1] No new third-party dependency added; stdlib-only maintained [EVIDENCE: Test: AST import inventory shows stdlib-only modules in changed advisor scripts]
- [ ] CHK-132 [P2] Input validation abuse cases covered in regression dataset [Reason: abuse-case mapping not included in supplied report summary]
- [x] CHK-133 [P2] Artifact data contains no sensitive user content [Report: `out/regression-report.json` and `out/benchmark-report.json` contain synthetic prompts and metrics only]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] Spec documents synchronized on exact nine-improvement scope [EVIDENCE: File: spec/plan/tasks/checklist/decision-record updated in this spec folder]
- [x] CHK-141 [P1] CLI usage docs include new flags and mode examples [EVIDENCE: File: `.opencode/skill/scripts/README.md` and `.opencode/skill/scripts/SET-UP_GUIDE.md` updates]
- [x] CHK-142 [P2] Optional user-facing guidance updated where needed [File: `.opencode/skill/scripts/README.md` and `.opencode/skill/scripts/SET-UP_GUIDE.md` updated with new flags and examples]
- [ ] CHK-143 [P2] Post-implementation handover notes prepared [Reason: handover.md not requested in this task]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| TBD | Technical Lead | [ ] Approved | |
| TBD | Product Owner | [ ] Approved | |
| TBD | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

## Validation Commands and Gate Criteria

```bash
python3 .opencode/skill/scripts/skill_advisor.py --health
python3 .opencode/skill/scripts/skill_advisor_regression.py --dataset .opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl --mode both --out .opencode/skill/scripts/out/regression-report.json
python3 .opencode/skill/scripts/skill_advisor_bench.py --dataset .opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl --runs 7 --out .opencode/skill/scripts/out/benchmark-report.json
```

| Gate | Pass Criteria |
|------|---------------|
| Routing quality | Top-1 accuracy >= 92% |
| Safety default | P0 uncertainty-guard cases pass 100% |
| Command bridge discipline | False-positive bridge rate <= 5% on non-slash prompts |
| Latency | Warm p95 <= 20 ms; cold p95 <= 55 ms |
| Structural mode | Throughput >= 2.0x baseline |

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
