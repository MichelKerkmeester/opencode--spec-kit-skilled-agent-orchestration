---
title: "Verification Checklist: Remove mcp-clickup skill"
description: "QA checklist for the mcp-clickup skill removal sweep."
trigger_phrases: ["checklist mcp-clickup removal", "053 checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/053-cli-skill-removal-mcp-clickup"
    last_updated_at: "2026-04-30T08:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored verification checklist"
    next_safe_action: "Mark items as evidence accumulates during execution"
    blockers: []
    completion_pct: 10
---
# Verification Checklist: Remove mcp-clickup skill

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-007) [EVIDENCE: spec.md ANCHOR:requirements lists all 7 requirements with acceptance criteria]
- [x] CHK-002 [P0] Technical approach defined in plan.md (5 phases) [EVIDENCE: plan.md ANCHOR:phases — Setup / Deletions / Advisor / Docs / Verify]
- [x] CHK-003 [P1] Reference inventory complete (12 files mapped) [EVIDENCE: spec.md "Files to Change" table — 12 rows]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] All edited JSON files parse via `python3 -m json.tool`
- [ ] CHK-011 [P0] No bare-token `clickup` references accidentally removed in mcp-code-mode docs
- [ ] CHK-012 [P1] Edits preserve surrounding formatting (table alignment, JSON indentation)
- [ ] CHK-013 [P1] Edit tool old_string/new_string sufficiently scoped (no replace_all on common tokens)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Repo-wide `grep -rn "mcp-clickup"` outside `.opencode/specs/` and observability returns zero
- [ ] CHK-021 [P0] `validate.sh --strict` against this spec folder exits ≤ 1
- [ ] CHK-022 [P1] `skill_advisor.py` import-syntactically valid (`python3 -c "import ast; ast.parse(open('skill_advisor.py').read())"`)
- [ ] CHK-023 [P1] `lexical.ts` and `explicit.ts` still match the surrounding TS shape (no dangling commas / broken object literals)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets touched (deletion + reference cleanup only) [EVIDENCE: deleted skill folder contained only install scripts and docs; no env/credential files]
- [x] CHK-031 [P0] Input validation N/A (no input surfaces touched) [EVIDENCE: no runtime/CLI/HTTP surfaces modified — config and docs only]
- [x] CHK-032 [P1] Auth/authz N/A [EVIDENCE: no auth code paths modified]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md / plan.md / tasks.md remain synchronized post-edit
- [ ] CHK-041 [P1] implementation-summary.md authored after deletions+edits with file-by-file evidence
- [ ] CHK-042 [P2] Outward-facing READMEs (root + skill + install) all reflect 21-skill / 17-skill counts consistently
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (none expected) [EVIDENCE: `ls scratch/` shows only `.gitkeep`]
- [x] CHK-051 [P1] scratch/ cleaned before completion (only .gitkeep) [EVIDENCE: `ls scratch/` shows only `.gitkeep`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 3/8 |
| P1 Items | 9 | 4/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-04-30
<!-- /ANCHOR:summary -->
