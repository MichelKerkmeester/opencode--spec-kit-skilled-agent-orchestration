---
title: "Verification Checklist: Routing Accuracy Hardening"
description: "Verification for Wave A+B+optional C."
trigger_phrases: ["routing accuracy checklist"]
importance_tier: "critical"
contextType: "checklist"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/004-routing-accuracy-hardening"
    last_updated_at: "2026-04-18T23:45:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Verify post-implementation"
---
# Verification Checklist: Routing Accuracy Hardening

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
- [x] CHK-001 [P0] Research reviewed: ../../research/019-system-hardening-001-initial-research-005-routing-accuracy/research.md [Evidence: Ranked Proposals drove Wave A/B/C order]
- [x] CHK-002 [P0] Labeled corpus copied as regression fixture [Evidence: `tests/routing-accuracy/labeled-prompts.jsonl` has 200 rows]
- [x] CHK-003 [P0] Baseline metrics captured [Evidence: research baseline Gate 3 F1 68.6%, advisor 53.5%; Wave A report captured pre-Wave-B Gate 3 F1 68.6%]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] Wave A: command-bridge mapping table in skill_advisor.py [Evidence: `COMMAND_BRIDGE_OWNER_NORMALIZATION`]
- [x] CHK-011 [P0] Wave A: explicit-invocation guard with carve-outs [Evidence: `_should_guard_command_bridge_normalization()` and T243-SA-018]
- [x] CHK-012 [P0] Wave B: deep-loop positive markers in gate-3-classifier.ts [Evidence: expanded `RESUME_TRIGGERS` and classifier tests]
- [x] CHK-013 [P1] Wave C precision guards implemented [Evidence: negation, prompt-only, and deep-loop read-only guards keep historical regressions at 0]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] Advisor accuracy >= 60% on corpus [Evidence: final corpus advisor accuracy 0.600]
- [x] CHK-021 [P0] Gate 3 F1 >= 83% on corpus [Evidence: final corpus Gate 3 F1 0.9766]
- [x] CHK-022 [P0] Historical false-positives (analyze/decompose/phase) unchanged [Evidence: final corpus `historical_false_positive_regressions: []`]
- [x] CHK-023 [P0] Joint matrix TT>=108, FT<=12, FF<=15 [Evidence: final corpus TT 115, FT 5, FF 1]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-030 [P0] Normalization does not break slash-command routing [Evidence: T243-SA-017 routes `/memory:save`, `/spec_kit:resume`, deep-research, and deep-review command bridges to owning skills]
- [x] CHK-031 [P0] Guard prevents over-flattening implementation targets [Evidence: T243-SA-018 keeps quoted/reference implementation prompts guarded]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] spec.md / plan.md / tasks.md aligned with implementation [Evidence: tasks.md completed; plan/spec status updated]
- [x] CHK-041 [P1] implementation-summary.md populated [Evidence: final Wave A/B/C implementation summary added]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-050 [P1] No orphan files [Evidence: scorer, runner, fixture, and JSON reports are under `tests/routing-accuracy/` or packet-local evidence paths]
- [x] CHK-051 [P1] Regression fixture in expected path [Evidence: `tests/routing-accuracy/labeled-prompts.jsonl`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 4 | 4/4 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-04-19

Status: Passed. Final corpus metrics: advisor accuracy 60.0%, Gate 3 F1 97.66%, joint TT 115 / TF 79 / FT 5 / FF 1.
<!-- /ANCHOR:summary -->
