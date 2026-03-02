---
title: "Verification Checklist: cli-copilot Skill"
description: "Verification Date: pending"
trigger_phrases:
  - "cli-copilot checklist"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: cli-copilot Skill

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
- [ ] CHK-003 [P1] Dependencies identified and available (cli-claude-code template, Copilot CLI research)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] SKILL.md has 8 standard sections with anchor comments
- [ ] CHK-011 [P0] All 4 reference files exist and are complete
- [ ] CHK-012 [P1] prompt_templates.md exists with 10 categories
- [ ] CHK-013 [P1] README.md companion guide with 8 sections
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] skill_advisor.py returns cli-copilot with confidence >= 0.8
- [ ] CHK-021 [P0] Symlink resolves correctly
- [ ] CHK-022 [P1] All files exist (ls -la verification)
- [ ] CHK-023 [P1] Multi-model IDs consistent across all files (7+ models from 3 providers)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets (GH_TOKEN, GITHUB_TOKEN as placeholders only)
- [ ] CHK-031 [P0] `--allow-all-tools` flagged as requiring explicit user approval
- [ ] CHK-032 [P1] Cloud delegation security implications documented
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] 3 READMEs updated
- [ ] CHK-042 [P2] Cross-references to sibling skills (cli-gemini, cli-codex, cli-claude-code)
- [ ] CHK-043 [P2] 4-way comparison table in copilot_tools.md
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Spec folder complete with all Level 2 files
- [ ] CHK-051 [P1] AI-agnostic language verified (no hardcoded conductor)
- [ ] CHK-052 [P2] Changelog entry created
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | [ ]/7 |
| P1 Items | 8 | [ ]/8 |
| P2 Items | 3 | [ ]/3 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->
