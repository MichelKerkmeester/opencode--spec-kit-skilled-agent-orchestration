---
title: "Spec: 065/005 - ambiguous debug review routing"
description: "Plan phase to improve ambiguous code/problem prompts so review or debug candidates outrank broad sk-code without overconfidence."
trigger_phrases: ["065/005 ambiguous debug review", "ambiguous routing", "CP-100"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/005-ambiguous-debug-review-routing"
    last_updated_at: "2026-05-03T11:10:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Created follow-on phase from stress-test finding CP-100"
    next_safe_action: "plan_and_execute_ambiguous_debug_review_routing"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Spec: 065/005 - ambiguous debug review routing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| Level | 1 |
| Status | Planned |
| Parent | 065 |
| Source finding | CP-100 ambiguous routing |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The prompt `I need to figure out what's wrong with my code` routed to broad `sk-code` at moderate confidence. The desired behavior is a review/debug-oriented candidate such as `sk-code-review` or `sk-deep-review`, still with calibrated uncertainty.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: tune ambiguous code-problem routing so review/debug candidates outrank broad implementation routing. Out of scope: making every vague code prompt high confidence.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
| ID | Requirement |
|---|---|
| REQ-001 | CP-100 top1 is review/debug-oriented |
| REQ-002 | CP-100 confidence remains between 0.40 and 0.85 |
| REQ-003 | Clear implementation requests still route to `sk-code` |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- SC-001: CP-100 changes from FAIL to PASS.
- SC-002: Confidence stays calibrated and does not jump to an overconfident 0.95.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Risk | Mitigation |
|---|---|
| Debug/review routes steal clear implementation prompts | Add positive controls for implementation requests |
<!-- /ANCHOR:risks -->
