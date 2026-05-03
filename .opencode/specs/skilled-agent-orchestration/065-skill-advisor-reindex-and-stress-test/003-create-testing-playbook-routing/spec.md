---
title: "Spec: 065/003 - create testing playbook routing"
description: "Plan phase to route testing-playbook creation prompts to create:testing-playbook instead of generic documentation skills."
trigger_phrases: ["065/003 testing playbook routing", "create testing playbook", "CP-105"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/003-create-testing-playbook-routing"
    last_updated_at: "2026-05-03T12:05:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed CP-105 testing-playbook route calibration"
    next_safe_action: "include_in_root_final_validation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Spec: 065/003 - create testing playbook routing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| Level | 1 |
| Status | Complete |
| Parent | 065 |
| Source finding | CP-105 adversarial confusable |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The prompt `create a test playbook for stressing this skill` routed to generic `sk-doc` at 0.866 and did not surface `create:testing-playbook`. This phase exists to make the dedicated testing-playbook creation route win for that intent.

Result: the prompt now routes to `create:testing-playbook` as top-1 at confidence 0.8387. `sk-doc` remains present as a documentation-adjacent secondary candidate, but no longer wins CP-105.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: route metadata, command/skill trigger phrases, and regression coverage for testing-playbook creation. Out of scope: broad sk-doc behavior changes.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
| ID | Requirement |
|---|---|
| REQ-001 | CP-105 surfaces `create:testing-playbook` in top-3 with confidence >= 0.6 |
| REQ-002 | Generic documentation prompts still route to `sk-doc` |
| REQ-003 | `improve:agent` and deep-review routes do not overclaim CP-105 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- SC-001: CP-105 changed from FAIL to PASS.
- SC-002: Existing create-agent and advisor regression gates remain green.
- SC-003: Full advisor test suite, typecheck, and build pass after the route calibration.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Risk | Mitigation |
|---|---|
| Over-routing all playbook mentions to creation | Add control prompts for reading or reviewing playbooks |
<!-- /ANCHOR:risks -->
