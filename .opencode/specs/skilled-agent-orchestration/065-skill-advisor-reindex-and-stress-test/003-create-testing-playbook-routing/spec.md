---
title: "Spec: 065/003 - create testing playbook routing"
description: "Plan phase to route testing-playbook creation prompts to create:testing-playbook instead of generic documentation skills."
trigger_phrases: ["065/003 testing playbook routing", "create testing playbook", "CP-105"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/003-create-testing-playbook-routing"
    last_updated_at: "2026-05-03T11:10:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Created follow-on phase from stress-test finding CP-105"
    next_safe_action: "plan_and_execute_testing_playbook_routing"
    blockers: []
    key_files: []
    completion_pct: 0
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
| Status | Planned |
| Parent | 065 |
| Source finding | CP-105 adversarial confusable |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The prompt `create a test playbook for stressing this skill` routed to generic `sk-doc` at 0.866 and did not surface `create:testing-playbook`. This phase exists to make the dedicated testing-playbook creation route win for that intent.
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
- SC-001: CP-105 changes from FAIL to PASS.
- SC-002: Existing create-agent and sk-doc gates remain green.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Risk | Mitigation |
|---|---|
| Over-routing all playbook mentions to creation | Add control prompts for reading or reviewing playbooks |
<!-- /ANCHOR:risks -->
