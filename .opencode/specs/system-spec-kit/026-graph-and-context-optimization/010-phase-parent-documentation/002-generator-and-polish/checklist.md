---
title: "Verification Checklist: Phase Parent Generator Pointer + Polish"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
description: "P0/P1/P2 verification checklist for the deferred follow-on packet."
trigger_phrases:
  - "phase parent followon checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-phase-parent-documentation/002-generator-and-polish"
    last_updated_at: "2026-04-27T12:20:00Z"
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
# Verification Checklist: Phase Parent Generator Pointer + Polish

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

- [ ] CHK-001 [P0] Phase 1 (`001-validator-and-docs`) confirmed shipped — evidence: `../001-validator-and-docs/implementation-summary.md` + 026 regression PASS
- [ ] CHK-002 [P0] `isPhaseParent` ESM JS available at `scripts/dist/spec/is-phase-parent.js` — evidence: `node -e "import { isPhaseParent } from '...'"` works
- [ ] CHK-003 [P0] `graph-metadata.json` schema accepts `last_active_child_id` / `last_active_at` — evidence: `check-graph-metadata.sh` lines 40-41
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Generator TS source compiles without errors and ESM dist regenerated — evidence: `npx tsc --build` clean
- [ ] CHK-011 [P0] Atomic write helper used for parent `graph-metadata.json` updates — evidence: temp + rename pattern in commit diff
- [ ] CHK-012 [P0] Generator does not write pointer fields when target is NOT a phase parent — evidence: vitest fixture covers non-phase-parent case
- [ ] CHK-013 [P1] `check-phase-parent-content.sh` is code-fence aware (does not flag tokens inside ```fences```) — evidence: fixture test
- [ ] CHK-014 [P1] `create.sh --phase` patch preserves child template behavior — evidence: dry-run output shows children get level-N templates
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] vitest REQ-001: parent save writes pointer fields — pass
- [ ] CHK-021 [P0] vitest REQ-002: child save bubbles up to parent — pass
- [ ] CHK-022 [P0] vitest REQ-002 atomic-write: concurrent child saves produce eventually-consistent pointer (last writer wins) — pass
- [ ] CHK-023 [P0] Manual E2E REQ-008: `/spec_kit:plan :with-phases --phases 2` → edit child → save → resume parent → lands in child — trace stored
- [ ] CHK-024 [P1] Resume `--no-redirect` flag bypasses pointer and shows parent surface — evidence: command transcript
- [ ] CHK-025 [P1] Resume falls back to listing when pointer is null OR stale (>24h) — evidence: stale-pointer fixture test
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No new file-write paths beyond canonical save / `generate-context.js` / `create.sh` — evidence: diff review
- [ ] CHK-031 [P1] Atomic write prevents torn JSON state under interrupt/crash — evidence: SIGTERM mid-write fixture (best-effort)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] CLAUDE.md / AGENTS.md mention pointer mechanism (already mentioned in 001 — verify still consistent post-impl)
- [ ] CHK-041 [P1] `templates/context-index.md` Author Instructions clearly state when to use ("only when reorganized")
- [ ] CHK-042 [P1] `templates/resource-map.md` Author Instructions sharpened for phase-parent mode (one mode, state in Scope line)
- [ ] CHK-043 [P1] `resume.md` and YAML asset documents the `--no-redirect` flag and 24h staleness window
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] E2E trace kept in `scratch/` (not at root)
- [ ] CHK-051 [P1] vitest fixtures use tmpdir, not committed test-data folders
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 11 | 0/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
