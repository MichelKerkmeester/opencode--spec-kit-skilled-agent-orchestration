---
title: "Verification Checklist: Advisor Phrase-Booster Tailoring"
description: "Regression harness is the P0 gate. Top-1 accuracy ≥0.92, zero P0 fixture regressions."
trigger_phrases:
  - "advisor phrase booster checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "026-graph-and-context-optimization/013-advisor-phrase-booster-tailoring"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "spec-kit-start"
    recent_action: "Authored Level 2 checklist with regression threshold gates"
    next_safe_action: "Execute Phase 1 baseline, then run through checks per phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-kit-start-013-2026-04-15"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Advisor Phrase-Booster Tailoring

<!-- SPECKIT_LEVEL: 2 -->
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

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-021)
- [ ] CHK-002 [P0] Technical approach defined in plan.md with 3 serial phases
- [ ] CHK-003 [P0] Baseline regression metrics captured: `scratch/baseline-regression.json` exists with `top1_accuracy` + `p0_pass_rate` + per-case results
- [ ] CHK-004 [P0] Baseline confidence captured for 5 REQ-010 queries: `scratch/baseline-queries.md` exists
- [ ] CHK-005 [P1] Git HEAD clean in `.opencode/skill/skill-advisor/` before starting
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:audit -->
## Audit Phase Outputs

- [ ] CHK-010 [P0] Multi-word inventory generated: `scratch/multi-word-inventory.md` lists all multi-word keys in INTENT_BOOSTERS and MULTI_SKILL_BOOSTERS
- [ ] CHK-011 [P0] Per-key disposition table in `scratch/phrase-boost-delta.md`: every multi-word key classified as `duplicate-remove`, `migrate`, or `schema-violation`
- [ ] CHK-012 [P1] 5+ new PHRASE candidate entries drafted with rationale
- [ ] CHK-013 [P0] No `schema-violation` findings OR all escalated to user before proceeding
<!-- /ANCHOR:audit -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-020 [P0] Zero multi-word keys remain in INTENT_BOOSTERS: grep returns 0 (REQ-001)
- [ ] CHK-021 [P0] Python AST parses `skill_advisor.py` cleanly: `python3 -c "import ast; ast.parse(...)"` exits 0 (REQ-005)
- [ ] CHK-022 [P0] Every deleted key has documented disposition (duplicate/migrated/obsolete) (REQ-002)
- [ ] CHK-023 [P1] Inline comment distinguishing INTENT_BOOSTERS vs PHRASE_INTENT_BOOSTERS role added
- [ ] CHK-024 [P1] No silent weight changes: migrated weights match source, OR any deviation is documented
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] Regression harness exits 0 with `--min-top1-accuracy 0.92`: `scratch/post-regression.json` shows `top1_accuracy ≥ 0.92` (REQ-003)
- [ ] CHK-031 [P0] P0 fixture pass rate ≥ baseline: post-P0 ≥ pre-P0 (REQ-004)
- [ ] CHK-032 [P1] 5 REQ-010 representative queries show ≥0.10 confidence uplift or NONE→match transition (REQ-010)
- [ ] CHK-033 [P1] 5+ new P1 fixture cases added using correct schema (REQ-012)
- [ ] CHK-034 [P2] Bench harness p95 latency within current +5% (REQ-020)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No hardcoded secrets introduced (N/A — dict edits only)
- [ ] CHK-041 [P0] No new external imports / network calls (dict data changes only)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] spec.md / plan.md / tasks.md / checklist.md synchronized (REQ-IDs, CHK-IDs consistent)
- [ ] CHK-051 [P0] `implementation-summary.md` authored post-implementation with before/after metrics + per-key disposition narrative
- [ ] CHK-052 [P1] `scratch/phrase-boost-delta.md` preserved as permanent artifact
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] All temp files in `scratch/` (baseline-*.json, baseline-queries.md, multi-word-inventory.md, post-regression.json)
- [ ] CHK-061 [P0] No files written outside: `skill_advisor.py`, `skill_advisor_regression_cases.jsonl`, this spec folder
- [ ] CHK-062 [P1] After checklist P0 gate passes: remove `scratch/baseline-*.json` and `*-inventory.md` (transient); keep `phrase-boost-delta.md`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | [ ]/14 |
| P1 Items | 10 | [ ]/10 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: [YYYY-MM-DD] (populate on completion)

**Evidence Index:**
- `scratch/baseline-regression.json` → CHK-003, CHK-031
- `scratch/baseline-queries.md` → CHK-004, CHK-032
- `scratch/multi-word-inventory.md` → CHK-010
- `scratch/phrase-boost-delta.md` → CHK-011, CHK-013, CHK-022, CHK-052
- `scratch/post-regression.json` → CHK-030, CHK-031
- Python AST output → CHK-021
- `implementation-summary.md` → CHK-051
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist (~115 lines)
- Regression harness is the P0 gate
- 14 P0 + 10 P1 + 1 P2 = 25 total checks
-->
