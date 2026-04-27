---
title: "Tasks: Phase Parent Generator Pointer + Polish"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task list for the deferred follow-on items from 001-validator-and-docs."
trigger_phrases:
  - "phase parent followon tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-phase-parent-documentation/002-generator-and-polish"
    last_updated_at: "2026-04-27T12:20:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks.md task list"
    next_safe_action: "Author checklist.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase Parent Generator Pointer + Polish

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> **Sub-phase A — Generator Pointer-Write + Bubble-Up.** Generator emits pointer fields on every save touching a phase parent or its child.

- [ ] T001 Add `isPhaseParent` import to `mcp_server/lib/memory/generate-context.ts`
- [ ] T002 Phase-parent save branch: parent target writes `derived.last_active_child_id = null`, `derived.last_active_at = ISO_8601_NOW`
- [ ] T003 Bubble-up branch: child save also updates parent's `graph-metadata.json` with child's `packet_id` + timestamp
- [ ] T004 Atomic write helper for `graph-metadata.json` (temp + rename) to prevent torn writes
- [ ] T005 Rebuild `scripts/dist/memory/generate-context.js` from TS source
- [ ] T006 [P] vitest fixture: parent save writes pointer (REQ-001)
- [ ] T007 [P] vitest fixture: child save bubbles up to parent (REQ-002)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> **Sub-phase B — Create.sh + Templates.** Lean template becomes the default for new phase decompositions.

- [ ] T008 Patch `scripts/spec/create.sh --phase` mode: parent scaffolds from `templates/phase_parent/spec.md` (placeholders filled); children unchanged
- [ ] T009 [P] Create `templates/context-index.md` (~40 LOC) with brief Author Instructions
- [ ] T010 [P] Update `templates/resource-map.md` Author Instructions §Scope shape — phase-parent guidance ("pick one mode, state in Scope line")
- [ ] T011 Acceptance test for REQ-003: `bash create.sh "Test feat" --phase --phases 2 --dry-run` → parent contents exactly `{spec.md, description.json, graph-metadata.json}`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> **Sub-phase C — Resume + Hook Brief + Validator + E2E.** Closes the loop and adds reviewer guardrails.

- [ ] T012 Patch `.opencode/command/spec_kit/resume.md` step 3b: pointer-first when fresh (<24h), list-fallback when stale/missing, `--no-redirect` bypass
- [ ] T013 Patch resume YAML asset(s) to mirror the redirect logic
- [ ] T014 Patch `references/hooks/skill-advisor-hook.md`: brief assembler honors phase-parent redirect
- [ ] T015 [P] Create `scripts/rules/check-phase-parent-content.sh` (severity warn, code-fence aware, scans forbidden narrative tokens)
- [ ] T016 [P] Register `PHASE_PARENT_CONTENT` rule in `scripts/lib/validator-registry.json`
- [ ] T017 Manual end-to-end: `/spec_kit:plan :with-phases --phases 2 "test-feature"` → edit child → save → resume parent → confirm pointer redirect; trace under `scratch/e2e-trace.txt`
- [ ] T018 Regression: `validate.sh --strict` on `026-graph-and-context-optimization/` matches current baseline (no new errors)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks (T001–T013, T017–T018) marked `[x]` with evidence
- [ ] No `[B]` blocked tasks remaining
- [ ] vitest covers REQ-001 (parent pointer write) + REQ-002 (child bubble-up)
- [ ] Manual E2E trace captured under `scratch/e2e-trace.txt`
- [ ] 026 regression passes (no new errors)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Predecessor (Phase 1 — shipped)**: See `../001-validator-and-docs/`
<!-- /ANCHOR:cross-refs -->
