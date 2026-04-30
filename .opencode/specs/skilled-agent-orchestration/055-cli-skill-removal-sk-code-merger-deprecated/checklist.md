---
title: "Verification Checklist: Remove sk-code-full-stack and sk-code-web"
description: "QA checklist for the sk-code-merger deprecated-pair hard-removal sweep."
trigger_phrases: ["checklist 055", "055 sk-code-merger cleanup"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/055-cli-skill-removal-sk-code-merger-deprecated"
    last_updated_at: "2026-04-30T10:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored verification checklist"
    next_safe_action: "Mark items as evidence accumulates during execution"
    blockers: []
    completion_pct: 10
---
# Verification Checklist: Remove sk-code-full-stack and sk-code-web

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-009) [EVIDENCE: spec.md ANCHOR:requirements lists all 9 requirements with acceptance criteria]
- [x] CHK-002 [P0] Technical approach defined in plan.md (3 phases, 8 sub-phases) [EVIDENCE: plan.md ANCHOR:phases — Setup / Implementation (2A-2H) / Verification]
- [x] CHK-003 [P1] Reference inventory complete (352 hits, 70+ files) [EVIDENCE: spec.md "Files to Change" + 3 Explore agent reports]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] All edited JSON files parse via `python3 -m json.tool`
- [ ] CHK-011 [P0] No load-bearing pointer left dangling — sk-code self-contained after edits
- [ ] CHK-012 [P1] Edits preserve formatting (table alignment, JSON indentation)
- [ ] CHK-013 [P1] Edit tool old_string/new_string sufficiently scoped
- [ ] CHK-014 [P1] `skill_advisor.py` AST-parses cleanly post-edit
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Repo-wide `grep -rn "sk-code-full-stack\|sk-code-web"` outside specs/observability/this packet/intentional residuals returns zero
- [ ] CHK-021 [P0] `validate.sh --strict` against this spec folder exits 0 errors 0 warnings
- [ ] CHK-022 [P1] Per-DB `sqlite3 .dump | grep -c` returns zero outside this packet
- [ ] CHK-023 [P1] Cross-runtime agent definitions all retargeted (4 files synced)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets touched (deletion + reference cleanup only) [EVIDENCE: deleted skill folders contain only docs and reference markdown; no env/credential files]
- [x] CHK-031 [P0] Input validation N/A (no input surfaces touched) [EVIDENCE: only config and docs modified]
- [x] CHK-032 [P1] Auth/authz N/A [EVIDENCE: no auth code paths modified]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md / plan.md / tasks.md remain synchronized post-edit
- [ ] CHK-041 [P1] implementation-summary.md authored with file-by-file evidence
- [ ] CHK-042 [P2] Outward-facing READMEs (root + skill + install) reflect 20-skill / 15-skill counts consistently
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
| P0 Items | 9 | 3/9 |
| P1 Items | 11 | 4/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-04-30
<!-- /ANCHOR:summary -->
