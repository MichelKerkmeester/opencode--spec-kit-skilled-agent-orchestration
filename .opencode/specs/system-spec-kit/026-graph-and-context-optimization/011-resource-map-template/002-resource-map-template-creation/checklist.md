---
title: "...m-spec-kit/026-graph-and-context-optimization/011-resource-map-template/002-resource-map-template-creation/checklist]"
description: "P0/P1/P2 verification for the new template and its wiring across every discovery surface."
trigger_phrases:
  - "026/012 checklist"
  - "resource map checklist"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/002-resource-map-template-creation"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 checklist"
    next_safe_action: "Rerun validator"
    blockers: []
    completion_pct: 90
    open_questions: []
    answered_questions: []
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
---
# Verification Checklist: Resource Map Template

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified (mcp_server tsc, validate.sh, cli-codex/cli-copilot executors)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] spec-doc-paths.ts append is syntactically valid (npm run typecheck exits 0)
- [x] CHK-011 [P0] No console errors or warnings in the classifier edit
- [x] CHK-012 [P1] Error handling unchanged (additive-only constant edit)
- [x] CHK-013 [P1] Template file follows the repo's markdown frontmatter pattern (title, description, trigger_phrases, importance_tier, contextType)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] validate.sh --strict on this packet exits 0
- [x] CHK-021 [P0] Manual smoke read of the new template (frontmatter parses, ten category sections present)
- [x] CHK-022 [P1] Edge cases documented in spec L2:EDGE CASES (phase-child splits, aggregated parent shape)
- [x] CHK-023 [P1] Error scenarios documented (typecheck fail rollback, placeholder leftovers)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (content-only edit)
- [x] CHK-031 [P0] No new input surfaces to validate
- [x] CHK-032 [P1] No auth/authz changes
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks synchronized
- [x] CHK-041 [P1] New template includes author instructions block at the bottom
- [x] CHK-042 [P2] READMEs updated (all five across templates/, plus skill README and CLAUDE.md)
- [x] CHK-043 [P1] SKILL.md updated in canonical spec docs, cross-cutting templates, and distributed governance blocks
- [x] CHK-044 [P1] references/templates/level_specifications.md updated in Cross-cutting Templates and each level Optional Files
- [x] CHK-045 [P1] feature_catalog entry created (category 22)
- [x] CHK-046 [P1] manual_testing_playbook entry created (category 22)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files outside scratch/
- [x] CHK-051 [P1] scratch/ clean (none created for this packet)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 6/7 (CHK-020 pending validator rerun) |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-04-24
<!-- /ANCHOR:summary -->
