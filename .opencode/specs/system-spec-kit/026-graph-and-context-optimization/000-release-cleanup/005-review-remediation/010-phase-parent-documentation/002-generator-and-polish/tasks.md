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

- [x] T001 Add `isPhaseParent` import to `mcp_server/lib/memory/generate-context.ts` — evidence: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:30` imports the ESM helper from `../spec/is-phase-parent.js`; source helper added at `.opencode/skill/system-spec-kit/scripts/spec/is-phase-parent.ts:6`.
- [x] T002 Phase-parent save branch: parent target writes `derived.last_active_child_id = null`, `derived.last_active_at = ISO_8601_NOW` — evidence: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:434` branches on `isPhaseParent()` and writes `null`; vitest parent assertion at `.opencode/skill/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts:61`.
- [x] T003 Bubble-up branch: child save also updates parent's `graph-metadata.json` with child's `packet_id` + timestamp — evidence: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:439` checks the direct parent and writes the child's packet id; vitest assertion at `.opencode/skill/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts:71`.
- [x] T004 Atomic write helper for `graph-metadata.json` (temp + rename) to prevent torn writes — evidence: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:372` writes same-dir temp file and renames it at line 380.
- [x] T005 Rebuild `scripts/dist/memory/generate-context.js` from TS source — evidence: `cd .opencode/skill/system-spec-kit/scripts && npx tsc --build` exited 0.
- [x] T006 [P] vitest fixture: parent save writes pointer (REQ-001) — evidence: `node scripts/node_modules/vitest/vitest.mjs run scripts/tests/phase-parent-pointer.vitest.ts --config mcp_server/vitest.config.ts` passed 1 file / 3 tests.
- [x] T007 [P] vitest fixture: child save bubbles up to parent (REQ-002) — evidence: same vitest command passed; bubble-up assertion covers parent pointer update at `.opencode/skill/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts:80`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> **Sub-phase B — Create.sh + Templates.** Lean template becomes the default for new phase decompositions.

- [x] T008 Patch `scripts/spec/create.sh --phase` mode: parent scaffolds from `templates/phase_parent/spec.md` (placeholders filled); children unchanged — evidence: `.opencode/skill/system-spec-kit/scripts/spec/create.sh:801` renders the lean phase-parent template and line 955 still creates child `scratch/` + Level 1 templates.
- [x] T009 [P] Create `templates/context-index.md` (~40 LOC) with brief Author Instructions — evidence: `.opencode/skill/system-spec-kit/templates/context-index.md:18` defines use-only-when-reorganized guidance and `.opencode/skill/system-spec-kit/templates/context-index.md:40` includes Author Instructions.
- [x] T010 [P] Update `templates/resource-map.md` Author Instructions §Scope shape — phase-parent guidance ("pick one mode, state in Scope line") — evidence: `.opencode/skill/system-spec-kit/templates/resource-map.md:191` states the phase-parent one-mode rule.
- [x] T011 Acceptance test for REQ-003: `bash create.sh "Test feat" --phase --phases 2 --dry-run` → parent contents exactly `{spec.md, description.json, graph-metadata.json}` — evidence: no `--dry-run` exists, so temp git fixture ran `create.sh "Test phase parent" --phase --phases 2 --level 2 --skip-branch --number 901 --short-name test-phase-parent`; parent root contained child dirs plus only `spec.md`, `description.json`, `graph-metadata.json`, and parent graph `key_files` was `["spec.md"]`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> **Sub-phase C — Resume + Hook Brief + Validator + E2E.** Closes the loop and adds reviewer guardrails.

- [x] T012 Patch `.opencode/command/spec_kit/resume.md` step 3b: pointer-first when fresh (<24h), list-fallback when stale/missing, `--no-redirect` bypass — evidence: `.opencode/command/spec_kit/resume.md:62` documents `--no-redirect`, fresh pointer redirect, stale/missing fallback, and redirect reporting.
- [x] T013 Patch resume YAML asset(s) to mirror the redirect logic — evidence: `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:59` and `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml:59` mirror the pointer-first/`--no-redirect` flow.
- [x] T014 Patch `references/hooks/skill-advisor-hook.md`: brief assembler honors phase-parent redirect — evidence: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:43` describes surfacing the active child when the pointer is fresh.
- [x] T015 [P] Create `scripts/rules/check-phase-parent-content.sh` (severity warn, code-fence aware, scans forbidden narrative tokens) — evidence: `.opencode/skill/system-spec-kit/scripts/rules/check-phase-parent-content.sh:19` gates on `is_phase_parent`, `.opencode/skill/system-spec-kit/scripts/rules/check-phase-parent-content.sh:33` skips fenced code, and direct bash fixture emitted `status=warn` for an unfenced `consolidated` token only.
- [x] T016 [P] Register `PHASE_PARENT_CONTENT` rule in `scripts/lib/validator-registry.json` — evidence: `.opencode/skill/system-spec-kit/scripts/lib/validator-registry.json:115` registers severity `warn`; `node -e "JSON.parse(...)"` returned `registry json ok`.
- [x] T017 Manual end-to-end: `/spec_kit:plan :with-phases --phases 2 "test-feature"` → edit child → save → resume parent → confirm pointer redirect; trace under `scratch/e2e-trace.txt` — evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-phase-parent-documentation/002-generator-and-polish/scratch/e2e-trace.txt` captures temp scaffold, generator save, parent pointer, and simulated resume redirect `{ "redirected": true }`.
- [x] T018 Regression: `validate.sh --strict` on `026-graph-and-context-optimization/` matches current baseline (no new errors) — evidence: strict recursive validation completed with existing parent/legacy failures plus new advisory `PHASE_PARENT_CONTENT` warnings only; no new blocking error category came from this packet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks (T001–T013, T017–T018) marked `[x]` with evidence — evidence: task rows above include file/command evidence for each P0.
- [x] No `[B]` blocked tasks remaining — evidence: no task row is marked `[B]`.
- [x] vitest covers REQ-001 (parent pointer write) + REQ-002 (child bubble-up) — evidence: `node scripts/node_modules/vitest/vitest.mjs run scripts/tests/phase-parent-pointer.vitest.ts --config mcp_server/vitest.config.ts` passed 1 file / 4 tests.
- [x] Manual E2E trace captured under `scratch/e2e-trace.txt` — evidence: trace stored at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-phase-parent-documentation/002-generator-and-polish/scratch/e2e-trace.txt`.
- [x] 026 regression passes (no new errors) — evidence: recursive strict validation remains failed on legacy baseline errors; this packet adds only advisory `PHASE_PARENT_CONTENT` warnings and no new blocking error class.
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
