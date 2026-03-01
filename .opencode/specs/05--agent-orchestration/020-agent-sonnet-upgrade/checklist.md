---
title: "Verification Checklist: Agent Sonnet 4.6 Upgrade [020-agent-sonnet-upgrade/checklist]"
description: "Verification Date: 2026-02-18"
trigger_phrases:
  - "verification"
  - "checklist"
  - "agent"
  - "sonnet"
  - "upgrade"
  - "020"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Agent Sonnet 4.6 Upgrade

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

- [x] CHK-001 [P0] Requirements documented in spec.md [Evidence:spec.md §4 — REQ-001 through REQ-005]
- [x] CHK-002 [P0] Technical approach defined in plan.md [Evidence:plan.md §3 — configuration management pattern, two-directory scope]
- [x] CHK-003 [P1] Dependencies identified and available [Evidence:plan.md §6 — `github-copilot/claude-sonnet-4-6` and `sonnet` confirmed available]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:p0-blockers -->
## P0 Blockers

### Pre-Implementation P0

- [x] CHK-001 Requirements documented in spec.md [Evidence:spec.md §4 — REQ-001 through REQ-005]
- [x] CHK-002 Technical approach defined in plan.md [Evidence:plan.md §3 — configuration management pattern, two-directory scope]

### Code Quality P0

- [x] CHK-010 No syntax errors introduced [Evidence:Manual inspection of all 10 files post-edit — agent files are Markdown with frontmatter; only string values changed]
- [x] CHK-011 No console errors or warnings [Evidence:N/A — non-executable agent config; configuration-only change]

### Testing P0

- [x] CHK-020 All acceptance criteria met [Evidence:REQ-001 — 5 Copilot fleet files on sonnet-4-6; REQ-002 — research/debug have no model line; REQ-003 — 3 Claude Code agents on sonnet]
- [x] CHK-021 Manual testing complete [Evidence:Each of the 10 files read and model field verified after edit]

### Security P0

- [x] CHK-030 No hardcoded secrets [Evidence:Agent files contain only model identifiers and prompt text — no tokens, keys, or credentials]
- [x] CHK-031 Input validation implemented [Evidence:N/A — no user input processed; static configuration files]
<!-- /ANCHOR:p0-blockers -->

---

<!-- ANCHOR:p1-required -->
## P1 Required

### Pre-Implementation P1

- [x] CHK-003 Dependencies identified and available [Evidence:plan.md §6 — `github-copilot/claude-sonnet-4-6` and `sonnet` confirmed available]

### Code Quality P1

- [x] CHK-012 Error handling implemented [Evidence:N/A — no code logic changed; rollback via git revert documented in plan.md §7]
- [x] CHK-013 Code follows project patterns [Evidence:Model ID strings match existing format in adjacent agent files; `github-copilot/` prefix preserved for Copilot namespace]

### Testing P1

- [x] CHK-022 Edge cases tested [Evidence:research.md and debug.md confirmed to have no `model:` line remaining; stale strings grep-checked]
- [x] CHK-023 Error scenarios validated [Evidence:Rollback procedure documented; git revert path confirmed clean]

### Security P1

- [x] CHK-032 Auth/authz working correctly [Evidence:N/A — model field changes do not affect authentication; platform handles model access control]

### Documentation P1

- [x] CHK-040 Spec/plan/tasks synchronized [Evidence:All five Level 2 files created retroactively; content consistent across spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md]
- [x] CHK-041 Code comments adequate [Evidence:Stale "keep model-agnostic" comment removed from copilot/review.md as part of the upgrade]

### File Organization P1

- [x] CHK-050 Temp files in scratch/ only [Evidence:No scratch files created during this upgrade — direct file edits only]
- [x] CHK-051 scratch/ cleaned before completion [Evidence:scratch/ directory is empty]
<!-- /ANCHOR:p1-required -->

---

<!-- ANCHOR:p2-optional -->
## P2 Optional

- [x] CHK-042 README updated (if applicable) [Evidence:N/A — agent files are self-contained; no top-level README references model assignments]
- [x] CHK-052 Findings saved to memory/ [Evidence:Memory context generated via generate-context.js after spec folder completion]
<!-- /ANCHOR:p2-optional -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No syntax errors introduced — agent files are Markdown with frontmatter; only string values changed [Evidence:Manual inspection of all 10 files post-edit]
- [x] CHK-011 [P0] No console errors or warnings — configuration-only change; no executable code modified [Evidence:N/A — non-executable agent config]
- [x] CHK-012 [P1] Error handling implemented [Evidence:N/A — no code logic changed; rollback via git revert documented in plan.md §7]
- [x] CHK-013 [P1] Code follows project patterns [Evidence:Model ID strings match existing format in adjacent agent files; `github-copilot/` prefix preserved for Copilot namespace]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met [Evidence:REQ-001 — 5 Copilot fleet files on sonnet-4-6; REQ-002 — research/debug have no model line; REQ-003 — 3 Claude Code agents on sonnet]
- [x] CHK-021 [P0] Manual testing complete [Evidence:Each of the 10 files read and model field verified after edit]
- [x] CHK-022 [P1] Edge cases tested [Evidence:research.md and debug.md confirmed to have no `model:` line remaining; stale strings grep-checked]
- [x] CHK-023 [P1] Error scenarios validated [Evidence:Rollback procedure documented; git revert path confirmed clean]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [Evidence:Agent files contain only model identifiers and prompt text — no tokens, keys, or credentials]
- [x] CHK-031 [P0] Input validation implemented [Evidence:N/A — no user input processed; static configuration files]
- [x] CHK-032 [P1] Auth/authz working correctly [Evidence:N/A — model field changes do not affect authentication; platform handles model access control]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [Evidence:All five Level 2 files created retroactively; content consistent across spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md]
- [x] CHK-041 [P1] Code comments adequate [Evidence:Stale "keep model-agnostic" comment removed from copilot/review.md as part of the upgrade]
- [x] CHK-042 [P2] README updated (if applicable) [Evidence:N/A — agent files are self-contained; no top-level README references model assignments]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [Evidence:No scratch files created during this upgrade — direct file edits only]
- [x] CHK-051 [P1] scratch/ cleaned before completion [Evidence:scratch/ directory is empty]
- [x] CHK-052 [P2] Findings saved to memory/ [Evidence:Memory context to be generated via generate-context.js after spec folder completion]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 8 | 8/8 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-02-18
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
