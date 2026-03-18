---
title: "Verification Checklist: cli-claude-code Skill"
description: "Verification Date: 2026-03-02"
trigger_phrases:
  - "cli-claude-code checklist"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: cli-claude-code Skill

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
  [EVIDENCE: spec.md created with 10 requirements (REQ-001 through REQ-010)]
- [x] CHK-002 [P0] Technical approach defined in plan.md
  [EVIDENCE: plan.md created with 3 phases, architecture, dependencies]
- [x] CHK-003 [P1] Dependencies identified and available
  [EVIDENCE: cli-codex template, .opencode/agent/*.md, skill_advisor.py all accessible]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] SKILL.md has 8 standard sections with anchor comments
  [EVIDENCE: when-to-use, smart-routing, how-it-works, rules, references, success-criteria, integration-points, related-resources]
- [x] CHK-011 [P0] All 4 reference files exist and are complete
  [EVIDENCE: cli_reference.md (15.0KB), agent_delegation.md (14.8KB), claude_tools.md (14.4KB), integration_patterns.md (15.3KB)]
- [x] CHK-012 [P1] prompt_templates.md exists with 10 categories
  [EVIDENCE: assets/prompt_templates.md (15.3KB), 10 anchored sections]
- [x] CHK-013 [P1] README.md companion guide with 8 sections
  [EVIDENCE: README.md (12.2KB), 8 sections matching cli-codex pattern]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] skill_advisor.py returns cli-claude-code with confidence >= 0.8
  [EVIDENCE: `python3 skill_advisor.py "use claude code cli"` returns confidence 0.95]
- [x] CHK-021 [P0] Symlink resolves correctly
  [EVIDENCE: `readlink .claude/skills/cli-claude-code` returns `../../.opencode/skill/cli-claude-code`]
- [x] CHK-022 [P1] All files exist (ls -la verification)
  [EVIDENCE: 2 root files + 4 references + 1 asset = 7 skill files total]
- [x] CHK-023 [P1] Model IDs consistent across all files
  [EVIDENCE: claude-opus-4-6, claude-sonnet-4-6, claude-haiku-4-5-20251001 used consistently]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in any skill files
  [EVIDENCE: All API key references use placeholder `your-key-here` or env var patterns]
- [x] CHK-031 [P0] `--permission-mode bypassPermissions` flagged as dangerous
  [EVIDENCE: SKILL.md NEVER rule #1 and ESCALATE IF rule #4 both flag this]
- [x] CHK-032 [P1] CLAUDECODE nesting detection documented
  [EVIDENCE: Nesting check appears in SKILL.md, cli_reference.md, README.md, integration_patterns.md]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  [EVIDENCE: All spec docs created and aligned with Level 2 templates]
- [x] CHK-041 [P1] 3 READMEs updated
  [EVIDENCE: .opencode/skill/README.md (4 matches), .opencode/README.md (1 match), README.md (1 match)]
- [x] CHK-042 [P2] Cross-references to sibling skills
  [EVIDENCE: cli-gemini and cli-codex referenced in SKILL.md Sections 7-8 and README.md Section 8]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Spec folder complete with all Level 2 files
  [EVIDENCE: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md]
- [x] CHK-051 [P1] No temp files outside scratch/
  [EVIDENCE: No scratch/ directory needed for this task]
- [x] CHK-052 [P2] 3-way comparison table in claude_tools.md
  [EVIDENCE: Section 3 contains 17-row comparison table (Claude Code vs Gemini CLI vs Codex CLI)]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 8 | 8/8 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-03-02
<!-- /ANCHOR:summary -->
