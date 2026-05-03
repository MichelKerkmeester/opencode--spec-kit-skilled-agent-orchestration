---
title: "Spec: 065/005 - ambiguous debug review routing"
description: "Plan phase to improve ambiguous code/problem prompts so review or debug candidates outrank broad sk-code without overconfidence."
trigger_phrases: ["065/005 ambiguous debug review", "ambiguous routing", "CP-100"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/005-ambiguous-debug-review-routing"
    last_updated_at: "2026-05-03T12:09:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed ambiguous code-problem routing calibration"
    next_safe_action: "include_in_root_final_validation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts"
    completion_pct: 100
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
| Status | Complete |
| Parent | 065 |
| Source finding | CP-100 ambiguous routing |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The prompt `I need to figure out what's wrong with my code` routed to broad `sk-code` at moderate confidence. The desired behavior is a review/debug-oriented candidate such as `sk-code-review` or `sk-deep-review`, still with calibrated uncertainty.

Result: the prompt now routes to `sk-code-review` top-1 at confidence 0.82. A clear implementation control still routes to `sk-code` top-1 at confidence 0.95.
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
- SC-001: CP-100 changed from FAIL to PASS.
- SC-002: Confidence stayed calibrated at 0.82 and did not jump to 0.95.
- SC-003: Clear implementation prompts still route to `sk-code`.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Risk | Mitigation |
|---|---|
| Debug/review routes steal clear implementation prompts | Add positive controls for implementation requests |
<!-- /ANCHOR:risks -->
