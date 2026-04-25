---
title: "Verification Checklist: Skill Advisor Setup Command [system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/checklist]"
description: "Verification Date: 2026-04-25"
trigger_phrases:
  - "skill advisor setup command checklist"
  - "012-skill-advisor-setup-command checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command"
    last_updated_at: "2026-04-25T14:30:00Z"
    last_updated_by: "deepseek-v4-pro"
    recent_action: "Created checklist.md"
    next_safe_action: "Verify all items"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0120000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-skill-advisor-setup"
      parent_session_id: "026-phase-root-flatten-2026-04-21"
    completion_pct: 0
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
---
# Verification Checklist: Skill Advisor Setup Command

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available (skill_graph_scan, advisor test suite)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Command markdown follows existing spec_kit conventions (resume.md, plan.md patterns)
- [ ] CHK-011 [P0] YAML workflows are valid (parse without error, contain required keys)
- [ ] CHK-012 [P1] Command frontmatter has correct allowed-tools and argument-hint
- [ ] CHK-013 [P1] README.txt update follows existing table format
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All advisor tests pass after scoring changes (220/220)
- [ ] CHK-021 [P0] skill_graph_scan completes without errors
- [ ] CHK-022 [P1] Interactive mode approval gates work correctly
- [ ] CHK-023 [P1] Auto mode runs without blocking on user input
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in command or workflow files
- [ ] CHK-031 [P0] Command does not modify files outside allowed paths
- [ ] CHK-032 [P1] Confirmation required before mutation in interactive mode
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Install guide SET-UP - Skill Advisor.md follows existing guide pattern
- [ ] CHK-041 [P1] Spec/plan/tasks synchronized (no contradictions)
- [ ] CHK-042 [P2] Parent context-index.md updated with 012 phase entry
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Command files in `.opencode/command/spec_kit/`
- [ ] CHK-051 [P1] Workflow assets in `.opencode/command/spec_kit/assets/`
- [ ] CHK-052 [P1] Install guide in `.opencode/install_guides/`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | [ ]/5 |
| P1 Items | 7 | [ ]/7 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: 2026-04-25
<!-- /ANCHOR:summary -->
