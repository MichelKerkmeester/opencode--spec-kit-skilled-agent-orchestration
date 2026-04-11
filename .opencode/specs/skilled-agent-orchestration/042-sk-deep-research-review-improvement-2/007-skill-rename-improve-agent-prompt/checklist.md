---
title: "Phase 7 Checklist: Skill Rename Verification"
description: "P0/P1 verification items for the rename phase."
trigger_phrases:
  - "phase 7 checklist"
  - "skill rename checklist"
importance_tier: "normal"
contextType: "checklist"
---
# Verification Checklist: Skill Rename

<!-- ANCHOR:protocol -->
## Verification Protocol

- P0 items MUST be `[x]` with evidence before Phase 7 completes.
- P1 items MUST be `[x]` or documented deferral.
- P2 items may defer with a reason.
- Evidence format: `[EVIDENCE: command or path — what was observed]`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Confirm no pre-existing `sk-improve-agent` / `sk-improve-prompt` collisions outside phase folder. [EVIDENCE: grep returned only `spec.md` and `description.json` inside 007]
- [x] CHK-002 [P0] Predecessor phase 006 complete. [EVIDENCE: `006-graph-testing-and-playbook-alignment/implementation-summary.md` exists]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] `git mv` used (not delete+add) for all four folder renames. [EVIDENCE: `git status` shows R entries]
- [x] CHK-004 [P0] Text replacements are mechanical (no semantic edits). [EVIDENCE: sed pipeline only substitutes string tokens]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-005 [P0] Residual grep returns zero matches for `sk-agent-improver` outside `.git/`. [EVIDENCE: grep command post-run]
- [x] CHK-006 [P0] Residual grep returns zero matches for `sk-prompt-improver` outside `.git/`. [EVIDENCE: grep command post-run]
- [x] CHK-007 [P0] `.opencode/skill/sk-improve-agent/SKILL.md` exists. [EVIDENCE: `ls` post-rename]
- [x] CHK-008 [P0] `.opencode/skill/sk-improve-prompt/SKILL.md` exists. [EVIDENCE: `ls` post-rename]
- [x] CHK-009 [P1] `skill_advisor.py` regression fixtures updated and still loadable. [EVIDENCE: file content + python syntax check]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-010 [P1] No secrets exposed by rename (strings are skill identifiers only). [EVIDENCE: rename strings are public skill IDs]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-011 [P0] `implementation-summary.md` created with file counts and verification evidence.
- [x] CHK-012 [P1] Changelog entry written under renamed `.opencode/changelog/15--sk-improve-agent/` (or packet-local nested changelog).
- [x] CHK-013 [P1] Memory file saved via `generate-context.js`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-014 [P0] Both renamed changelog folders exist at the correct paths. [EVIDENCE: `ls .opencode/changelog/14--sk-improve-prompt` and `15--sk-improve-agent`]
- [x] CHK-015 [P1] No dangling references to old paths in `.opencode/specs/descriptions.json`. [EVIDENCE: grep post-run]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- Total P0 items: 9 (CHK-001, 002, 003, 004, 005, 006, 007, 008, 011, 014) — all marked `[x]` after implementation.
- Total P1 items: 5 (CHK-009, 010, 012, 013, 015) — all marked `[x]` after implementation.
- Status: filled in at Step 11 of the workflow.
<!-- /ANCHOR:summary -->
