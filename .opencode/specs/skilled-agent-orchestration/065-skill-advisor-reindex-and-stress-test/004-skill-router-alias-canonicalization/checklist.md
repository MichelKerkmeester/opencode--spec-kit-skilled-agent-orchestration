---
title: "Checklist: 065/004 - skill-router alias canonicalization"
description: "Verification checklist for command/skill alias canonicalization."
trigger_phrases: ["065/004 checklist", "alias canonicalization checklist"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/004-skill-router-alias-canonicalization"
    last_updated_at: "2026-05-03T12:07:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed checklist with CP-103 alias evidence"
    next_safe_action: "root_final_validation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Checklist: 065/004 - skill-router alias canonicalization

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|---|---|---|
| P0 | Hard blocker | Cannot complete phase |
| P1 | Required | Must complete or document deferral |
| P2 | Optional | Can defer with reason |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Reproduce CP-103 WARN.
  - Evidence: baseline CP-103 contained the right deep-review skill under `sk-deep-review`, while the expected id was command-shaped.
- [x] CHK-002 [P1] Inventory command ids and skill ids.
  - Evidence: alias groups cover only known command-backed skills.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Alias groups are explicit and narrow.
  - Evidence: each alias group is a fixed set, not a prefix, regex, or fuzzy match.
- [x] CHK-011 [P1] Alias handling does not hide real route misses.
  - Evidence: unrelated ids still compare false unless they are in the same canonical group.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] CP-103 scores PASS under alias-aware criteria.
  - Evidence: `sk-deep-review` 0.95 satisfies the deep-review command expectation through alias canonicalization.
- [x] CHK-021 [P1] Deep-review and create-agent controls remain green.
  - Evidence: CP-103 includes `sk-deep-review` and `create:agent`; native scorer tests cover both.
- [x] CHK-022 [P1] Advisor or report scoring tests pass.
  - Evidence: focused tests passed 23 tests; full advisor tests passed 297 tests.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Alias pairs are documented with canonical target and accepted ids.
  - Evidence: `aliases.ts` lists canonical groups and the Python fallback mirrors them.
- [x] CHK-FIX-002 [P1] Resource map updated with changed and checked files.
  - Evidence: `resource-map.md` lists alias module, fallback parity, and regression tests.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] Alias metadata does not expose raw prompt content.
  - Evidence: alias metadata contains route ids only.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Implementation summary records alias groups and CP-103 before/after.
  - Evidence: `implementation-summary.md` records the CP-103 WARN cause and alias-aware PASS.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Alias docs/tests live in expected advisor or spec paths.
  - Evidence: runtime helper lives under `lib/scorer/` and phase evidence lives under `004-skill-router-alias-canonicalization`.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---:|---:|
| P0 Items | 4 | 4/4 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-03
<!-- /ANCHOR:summary -->
