---
title: "Verification Checklist: Split [skilled-agent-orchestration/036-sk-deep-research-review-split/checklist]"
description: "Verification checklist for the deep-research/deep-review split."
trigger_phrases:
  - "036 checklist"
  - "deep-review split verification"
  - "review mode split checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/036-sk-deep-research-review-split"
    last_updated_at: "2026-04-13T10:38:46Z"
    last_updated_by: "copilot"
    recent_action: "Applied follow-up advisor evidence calibration and sibling-edge cleanup"
    next_safe_action: "Keep packet docs synced with any future deep-review or advisor adjustments"
    blockers: []
    key_files:
      - ".opencode/skill/skill-advisor/scripts/skill_advisor.py"
      - ".opencode/skill/sk-deep-review/graph-metadata.json"
      - ".opencode/skill/sk-deep-research/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:036-sk-deep-research-review-split"
      session_id: "036-sk-deep-research-review-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Advisor evidence calibration now separates graph-heavy matches and deep sibling edges were removed."
template_source_header: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
---
# Verification Checklist: Split sk-deep-research Review Mode into sk-deep-review

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] CHK-001 [P0] Split scope documented in spec.md with research and review responsibilities separated
- [ ] CHK-002 [P0] Technical approach documented in plan.md across skill, wrapper, routing, and docs surfaces
- [ ] CHK-003 [P1] Representative shipped evidence reviewed from changelog and handover artifacts before reconstruction
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No stale `/spec_kit:deep-research:review` guidance remains in the updated command/skill documentation set
- [ ] CHK-011 [P0] `sk-deep-review` and `sk-deep-research` references do not contradict each other
- [ ] CHK-012 [P1] Runtime wrapper names and YAML asset names use the deep-review naming consistently
- [ ] CHK-013 [P1] Root documentation reflects separate deep-research and deep-review capabilities
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Acceptance scenarios in spec.md are satisfied by the shipped split
- [ ] CHK-021 [P0] Review routing and research routing can be explained from the final docs without ambiguity
- [ ] CHK-022 [P1] Changelog and upgrade guidance mention the breaking rename
- [ ] CHK-023 [P1] Spec-folder documents stay internally consistent after compliance repair
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets or credentials were introduced by the command and skill split
- [ ] CHK-031 [P0] Deprecated command guidance is explicit enough to avoid accidental misuse
- [ ] CHK-032 [P1] Cross-runtime wrappers do not hide or reintroduce the old review suffix path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, tasks.md, checklist.md, and implementation-summary.md refer to the same split outcome
- [ ] CHK-041 [P1] Implementation summary cites only shipped evidence preserved in repository artifacts
- [ ] CHK-042 [P2] Follow-up work for automation and replay testing is recorded without being misrepresented as complete
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Required Level 2 spec documents exist in this folder
- [ ] CHK-051 [P1] No temporary reconstruction files are stored in the spec folder
- [ ] CHK-052 [P2] Additional implementation evidence can be saved to `memory/` later if needed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 0/7 |
| P1 Items | 9 | 0/9 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-03-31
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
