---
title: "Verification Checklist: sk-doc README and HVR Improvements [03--commands-and-skills/032-sk-doc-readme-hvr-improvements/checklist]"
description: "Verification checklist for the sk-doc HVR, README template, and README creation standards upgrade packet."
trigger_phrases:
  - "verification"
  - "checklist"
  - "sk-doc"
  - "readme"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: sk-doc README and HVR Improvements

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

- [ ] CHK-001 [P0] Requirements documented in `spec.md`
- [ ] CHK-002 [P0] Technical approach defined in `plan.md`
- [ ] CHK-003 [P1] Exemplar README patterns extracted from `.opencode/skill/system-spec-kit/README.md`, `.opencode/skill/system-spec-kit/mcp_server/README.md`, and `.opencode/skill/system-spec-kit/SHARED_MEMORY_DATABASE.md`
- [ ] CHK-004 [P1] Template source and modeling references confirmed in `.opencode/skill/sk-doc/assets/skill/skill_reference_template.md` and `.opencode/skill/sk-doc/references/specific/install_guide_creation.md`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

### D1: HVR Rules
- [ ] CHK-010 [P0] `.opencode/skill/sk-doc/references/global/hvr_rules.md` keeps valid frontmatter and numbered H2 sections
- [ ] CHK-011 [P0] HVR guidance uses `ANCHOR:slug` markers only as documented text, not broken literal anchors in this packet
- [ ] CHK-012 [P0] Structural AI-tell patterns and scoring calibration are reflected in the packet summary
- [ ] CHK-013 [P1] Related cli-codex notes in `.opencode/skill/cli-codex/SKILL.md` and `.opencode/skill/cli-codex/assets/prompt_templates.md` are cited accurately
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

### D2: README Template
- [ ] CHK-020 [P0] `.opencode/skill/sk-doc/assets/documentation/readme_template.md` is cited with the correct repo path
- [ ] CHK-021 [P0] Two-tier voice, numbered subsections, and table patterns are described consistently across packet docs
- [ ] CHK-022 [P1] Template-related claims match the committed README template content
- [ ] CHK-023 [P1] Packet docs no longer contain stale relative references to missing markdown files
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

### D3: README Creation Reference
- [ ] CHK-030 [P0] `.opencode/skill/sk-doc/references/specific/readme_creation.md` is cited with the correct repo path
- [ ] CHK-031 [P0] Documentation-only changes introduce no secrets or unsafe command guidance
- [ ] CHK-032 [P1] The packet keeps workflow guidance separate from the reusable template and HVR rules
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] Cross-references among the sk-doc files resolve to committed repo files
- [ ] CHK-041 [P1] `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` describe the same three deliverables and related follow-ups
- [ ] CHK-042 [P1] cli-codex follow-up references remain aligned with `.opencode/skill/cli-codex/SKILL.md` and `.opencode/skill/cli-codex/assets/prompt_templates.md`
- [ ] CHK-043 [P2] Memory artifacts are retained only as supporting context, not as primary evidence
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Packet-specific repairs stay inside `.opencode/specs/03--commands-and-skills/032-sk-doc-readme-hvr-improvements/`
- [ ] CHK-051 [P1] Temporary notes remain in `scratch/` only
- [ ] CHK-052 [P2] Remaining non-blocking warnings are documented for later cleanup
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 9 | 0/9 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-03-31
<!-- /ANCHOR:summary -->

---
