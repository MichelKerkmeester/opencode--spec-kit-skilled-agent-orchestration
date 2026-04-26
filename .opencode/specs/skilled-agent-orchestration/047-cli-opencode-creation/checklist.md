---
title: "Verification Checklist: cli-opencode Skill Creation [skilled-agent-orchestration/047-cli-opencode-creation/checklist]"
description: "Verification Date: pending"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
trigger_phrases:
  - "cli-opencode skill checklist"
  - "047-cli-opencode-creation checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/047-cli-opencode-creation"
    last_updated_at: "2026-04-26T05:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Drafted checklist with 32 P0/P1/P2 items"
    next_safe_action: "Approve ADRs in decision-record.md, dispatch implementation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0470000000000000000000000000000000000000000000000000000000000004"
      session_id: "047-cli-opencode-creation"
      parent_session_id: "skilled-agent-orchestration"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: cli-opencode Skill Creation

<!-- SPECKIT_LEVEL: 3 -->
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

- [ ] CHK-001 [P0] Spec, plan, tasks, decision-record present and synchronized
- [ ] CHK-002 [P0] All 5 ADRs in decision-record.md reviewed and approved by operator
- [ ] CHK-003 [P0] `opencode` v1.3.17+ confirmed at expected install path
- [ ] CHK-004 [P1] Pre-implementation regression baseline captured under scratch/baseline-regression.log
- [ ] CHK-005 [P1] Pre-implementation commit tagged `pre-047-cli-opencode-implementation`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] All 36 tasks marked [x] with (verified) evidence
- [ ] CHK-011 [P0] Skill folder contains exactly 9 files matching the universal cli-* blueprint
- [ ] CHK-012 [P0] SKILL.md frontmatter has `name`, `description`, `allowed-tools`, `version` (4 mandatory fields)
- [ ] CHK-013 [P0] SKILL.md body has all 8 anchored sections in canonical order
- [ ] CHK-014 [P0] Self-invocation guard present in Section 1 (When NOT to use) AND Section 2 (smart-router pseudocode)
- [ ] CHK-015 [P1] SKILL.md length within ~450-650 lines (sibling band)
- [ ] CHK-016 [P1] All references files cite cli_reference.md baseline opencode v1.3.17
- [ ] CHK-017 [P1] No emojis in skill files (HVR rule unless explicitly invoked)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Strict spec validation passes 0/0 on this packet
- [ ] CHK-021 [P0] `python3 skill_graph_compiler.py --validate-only` passes 0/0
- [ ] CHK-022 [P0] `bash init-skill-graph.sh` completes without health failures
- [ ] CHK-023 [P0] `/doctor:skill-advisor:auto` retune produces non-empty diff for cli-opencode entries
- [ ] CHK-024 [P0] Advisor regression suite passes baseline (no regression on existing 4 cli-* siblings)
- [ ] CHK-025 [P0] Acceptance Scenario 1 passes — external Claude Code → opencode dispatch
- [ ] CHK-026 [P0] Acceptance Scenario 2 passes — in-OpenCode parallel detached session
- [ ] CHK-027 [P0] Acceptance Scenario 3 passes — self-invocation refused with explicit error
- [ ] CHK-028 [P0] Acceptance Scenario 4 passes — advisor scores cli-opencode ≥ 0.80 confidence on the golden prompt
- [ ] CHK-029 [P0] Acceptance Scenario 5 passes — both READMEs reflect "five CLI skills" reality
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in skill files
- [ ] CHK-031 [P0] No new file reads outside workspace (skill prompts respect workspace boundary)
- [ ] CHK-032 [P0] Self-invocation guard reliably refuses cycles in TUI / acp / serve modes
- [ ] CHK-033 [P1] `--share` URL handling documented as opt-in (operator confirmation required before publishing)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] Implementation summary populated post-implementation with concrete artifact citations
- [ ] CHK-041 [P0] Decision record covers all 5 ADRs with Context / Decision / Alternatives / Consequences / Five-Checks / Implementation
- [ ] CHK-042 [P0] All 4 existing cli-* graph-metadata.json files have a sibling edge to cli-opencode (round-trip symmetry)
- [ ] CHK-043 [P0] Changelog v1.0.0.0.md published with sk-doc compact format
- [ ] CHK-044 [P0] All 8 specific edit points in `.opencode/skill/README.md` applied
- [ ] CHK-045 [P0] All 2 specific edit points in `.opencode/README.md` applied
- [ ] CHK-046 [P1] sk-doc DQI score ≥ 90 on changelog v1.0.0.0.md
- [ ] CHK-047 [P1] Cross-references between this packet and 046-cli-codex-tone-of-voice present
- [ ] CHK-048 [P2] GitHub release published for v1.0.0.0 (operator confirmation)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P0] Skill folder under correct path: `.opencode/skill/cli-opencode/`
- [ ] CHK-051 [P0] Changelog bucket under correct path: `.opencode/changelog/cli-opencode/`
- [ ] CHK-052 [P0] No skill files leaked outside the cli-opencode folder (no scope creep)
- [ ] CHK-053 [P1] References folder contains exactly 4 files matching the universal blueprint
- [ ] CHK-054 [P1] Assets folder contains exactly 2 files matching the universal blueprint
- [ ] CHK-055 [P1] No scripts/ or constitutional/ folder created (sibling skills do not have these)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 24 | [ ]/24 |
| P1 Items | 10 | [ ]/10 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->
