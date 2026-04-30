---
title: "Verification Checklist: References and READMEs Lean-Trio Sync"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
description: "P0/P1/P2 verification checklist for the 13-file doc-sync packet."
trigger_phrases:
  - "phase parent doc sync checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/014-phase-parent-documentation/003-references-and-readme-sync"
    last_updated_at: "2026-04-27T13:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md"
    next_safe_action: "Run final strict validation; refresh metadata"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    completion_pct: 75
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: References and READMEs Lean-Trio Sync

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

- [ ] CHK-001 [P0] Phases 001 + 002 + validator follow-on confirmed shipped — evidence: `../001-validator-and-docs/implementation-summary.md` + `../002-generator-and-polish/implementation-summary.md` exist; `010/spec.md` phase manifest lists both as complete
- [ ] CHK-002 [P0] Canonical wording sources are in shipped state — evidence: AGENTS.md §3 has Phase Parent row; CLAUDE.md §1 has phase-parent ladder branch; SKILL.md has Phase Parent Mode paragraph
- [ ] CHK-003 [P0] 026 regression baseline captured — evidence: `validate.sh --strict --json` output saved before any 003 edits land
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `phase_definitions.md` parent structure block matches lean trio — evidence: lines around 86–109 show only `spec.md`, `description.json`, `graph-metadata.json` at parent; no `memory/` in children
- [ ] CHK-011 [P0] `save_workflow.md` Phase Parent Save Routing sub-section present — evidence: new section after current Output Format describes pointer-write at parent and bubble-up at child
- [ ] CHK-012 [P0] `validation_rules.md` PHASE_PARENT_CONTENT documented — evidence: rule summary table row + dedicated section + Phase Parent row in FILE_EXISTS matrix
- [ ] CHK-013 [P0] Top-level `README.md` reflects phase-parent mode — evidence: level matrix Phase Parent row; structure diagram phase-parent note; phase decomposition lean-template mention
- [ ] CHK-014 [P0] `templates/README.md` STRUCTURE table includes new templates — evidence: rows for `phase_parent/` and `context-index.md`
- [ ] CHK-015 [P1] All MEDIUM and LOW edits cite the canonical mirror source they copied wording from
- [ ] CHK-016 [P1] No new contradictions introduced between updated docs and existing canonical sources — evidence: spot-read each updated section against AGENTS.md / SKILL.md
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] T014 grep sweep returns zero stale matches: `grep -nrE "├── plan\.md.*coordination|memory/.*Parent-level context" .opencode/skill/system-spec-kit/references/`
- [ ] CHK-021 [P0] T015 cross-doc grep lists all 10 target files
- [ ] CHK-022 [P0] T016 `validate.sh --strict` on this packet passes modulo SPEC_DOC_INTEGRITY forward-reference noise — evidence: 1 expected error (SPEC_DOC_INTEGRITY only), no other error classes
- [ ] CHK-023 [P0] T017 026 regression: parent-level error rules unchanged from baseline (3 rules) — evidence: JSON diff
- [ ] CHK-024 [P1] T018 pointer dogfood: `/memory:save` against 003 updates 010 parent's `derived.last_active_child_id` to point to 003 with fresh timestamp
- [ ] CHK-025 [P1] PHASE_PARENT_CONTENT does NOT advisory-warn on this packet's spec.md (validator self-trigger guarded by HTML-comment + code-fence skip; verify with `validate.sh --strict --no-recursive` on the lean 010 parent and check warnings list)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No new file-write paths introduced beyond the standard `Edit` / `Write` tools — evidence: diff review
- [ ] CHK-031 [P1] No documentation accidentally exposes secret paths, API keys, or other sensitive content
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] All 5 CRITICAL files updated (T001–T005)
- [ ] CHK-041 [P1] All 5 MEDIUM files updated (T006–T011) OR explicit deferral
- [ ] CHK-042 [P2] LOW files updated (T012–T013) OR documented deferral
- [ ] CHK-043 [P1] Spec/plan/tasks/checklist of this packet itself reference the canonical sources rather than re-coining language
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Implementation evidence (file:line citations) recorded inline in `tasks.md` `[x]` rows
- [ ] CHK-051 [P1] No temp files left in `scratch/` after completion (or retention reason documented in implementation-summary.md)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 9 | 0/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
