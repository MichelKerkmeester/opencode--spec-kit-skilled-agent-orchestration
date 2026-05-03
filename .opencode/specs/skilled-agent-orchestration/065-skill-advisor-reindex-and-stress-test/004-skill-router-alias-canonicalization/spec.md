---
title: "Spec: 065/004 - skill-router alias canonicalization"
description: "Plan phase to normalize accepted aliases between command ids and skill ids in router scenarios and advisor outputs."
trigger_phrases: ["065/004 alias canonicalization", "skill router aliases", "deep review alias"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/004-skill-router-alias-canonicalization"
    last_updated_at: "2026-05-03T12:07:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed command/skill alias canonicalization"
    next_safe_action: "include_in_root_final_validation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts"
    completion_pct: 100
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
| Status | Complete |
| Parent | 065 |
| Source finding | CP-103 multi-skill workflow |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

CP-103 expected `spec_kit:deep-review`, while the advisor returned `sk-deep-review`. The underlying capability was present, but the campaign could only score it as WARN because accepted aliases are not formalized.

Result: narrow alias groups now canonicalize command ids and skill ids for command-backed skills. CP-103 can treat `spec_kit:deep-review`, `/spec_kit:deep-review`, `command-spec-kit-deep-review`, and `sk-deep-review` as the same capability while leaving unrelated skills distinct.
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
- SC-003: Alias groups remain narrow enough to avoid masking unrelated route misses.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Risk | Mitigation |
|---|---|
| Alias groups hide real route mistakes | Keep aliases narrow and explicit |
<!-- /ANCHOR:risks -->
