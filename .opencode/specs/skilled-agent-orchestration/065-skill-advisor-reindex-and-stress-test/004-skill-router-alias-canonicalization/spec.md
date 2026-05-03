---
title: "Spec: 065/004 - skill-router alias canonicalization"
description: "Plan phase to normalize accepted aliases between command ids and skill ids in router scenarios and advisor outputs."
trigger_phrases: ["065/004 alias canonicalization", "skill router aliases", "deep review alias"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/004-skill-router-alias-canonicalization"
    last_updated_at: "2026-05-03T11:10:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Created follow-on phase from stress-test finding CP-103"
    next_safe_action: "plan_and_execute_alias_canonicalization"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Spec: 065/004 - skill-router alias canonicalization

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| Level | 1 |
| Status | Planned |
| Parent | 065 |
| Source finding | CP-103 multi-skill workflow |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

CP-103 expected `spec_kit:deep-review`, while the advisor returned `sk-deep-review`. The underlying capability was present, but the campaign could only score it as WARN because accepted aliases are not formalized.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: define canonical ids and accepted alias sets for command/skill bridge routes, then update stress scenario scoring to use them. Out of scope: changing deep-review behavior itself.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
| ID | Requirement |
|---|---|
| REQ-001 | Alias groups exist for command ids and skill ids where both are legitimate |
| REQ-002 | CP-103 can be scored without false WARN from naming mismatch |
| REQ-003 | Existing advisor output format remains prompt-safe |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- SC-001: CP-103 changes from WARN to PASS under alias-aware scoring.
- SC-002: Alias handling is documented and regression-tested.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Risk | Mitigation |
|---|---|
| Alias groups hide real route mistakes | Keep aliases narrow and explicit |
<!-- /ANCHOR:risks -->
