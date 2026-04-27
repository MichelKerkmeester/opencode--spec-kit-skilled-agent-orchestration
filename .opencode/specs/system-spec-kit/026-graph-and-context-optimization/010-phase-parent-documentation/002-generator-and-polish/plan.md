---
title: "Implementation Plan: Phase Parent Generator Pointer + Polish"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Three-phase rollout (Generator+Bubble, Create+Templates, Resume+Validator+E2E) of the deferred phase-parent items."
trigger_phrases:
  - "phase parent followon plan"
  - "phase parent pointer plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-phase-parent-documentation/002-generator-and-polish"
    last_updated_at: "2026-04-27T12:20:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md three-phase rollout"
    next_safe_action: "Author tasks.md"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase Parent Generator Pointer + Polish

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (generator), Bash (create.sh, validator), Markdown (templates, docs) |
| **Framework** | system-spec-kit (validator + generator + memory + command surface) |
| **Storage** | Filesystem only (existing `graph-metadata.json` `derived` section) |
| **Testing** | vitest (generator pointer-write + bubble-up), bash fixture tests (create.sh output, validator) |

### Overview
Three sequential sub-phases land the deferred work additively. Sub-phase A wires the generator pointer-write + bubble-up branch (read `isPhaseParent`, atomic JSON update). Sub-phase B swaps `create.sh --phase` to the lean template and lands the supporting `templates/context-index.md` + `resource-map.md` polish. Sub-phase C wires the resume redirect, hook brief, content validator (P2), and end-to-end manual test. Each sub-phase ships independently; the critical path is A → C (resume needs pointer to demonstrate redirect).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 001-validator-and-docs has shipped (lean trio enforcement live)
- [ ] `isPhaseParent` ESM JS available at `scripts/dist/spec/is-phase-parent.js`
- [ ] `graph-metadata.json` schema accepts optional `last_active_child_id` / `last_active_at` (already in 001)

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001..REQ-004)
- [ ] All P1 acceptance criteria met OR user-approved deferral (REQ-005..REQ-008)
- [ ] vitest covers REQ-001 (parent save writes pointer) and REQ-002 (child save bubbles up)
- [ ] Manual end-to-end (REQ-008) trace stored under `scratch/e2e-trace.txt`
- [ ] `validate.sh --strict` regression preserved on `026-graph-and-context-optimization/`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered policy enforcement, additive: generator emits pointer → resume reads pointer → reviewer's content validator scans spec.md. Each layer is independently disable-able via env var or flag for safe rollout.

### Key Components

- **Generator phase-parent branch** — in `mcp_server/lib/memory/generate-context.ts`. Imports `isPhaseParent` (mcp_server CJS twin or shared shim). On save, branches:
  1. Save target is a phase parent → write `derived.last_active_child_id = null`, `derived.last_active_at = now()`.
  2. Save target is a child whose direct parent is a phase parent → after writing child's metadata, ALSO update parent's `graph-metadata.json` with that child's `packet_id` and `now()`.
- **`create.sh --phase` parent template swap** — when `PHASE_MODE=true` and creating the parent folder, copy `templates/phase_parent/spec.md` (with placeholder filling) instead of running the level-N copy + addendum injection. Children unchanged.
- **`/spec_kit:resume` pointer redirect** — in `resume.md` step 3b: read `derived.last_active_child_id`, check `derived.last_active_at` is within 24h, recurse directly into the child. Fall back to existing list behavior when pointer is null/stale.
- **`check-phase-parent-content.sh`** — token-scan validator (severity `warn`). Runs only when `is_phase_parent($folder)` returns true. Forbidden tokens: `consolidat[a-z]*`, `merged from`, `renamed from`, `collapsed`, `X→Y`, `reorganization`. Code-fence aware (skips matches inside ```fences```).

### Data Flow

```
[SAVE FLOW — child of phase parent]
  edit child files → /memory:save → generate-context.ts
                                    ├─ writes child's _memory.continuity (existing)
                                    ├─ refreshes child's description.json + graph-metadata.json (existing)
                                    └─ NEW: detects parent is phase parent → updates parent's
                                       graph-metadata.json derived.last_active_child_id + last_active_at

[RESUME FLOW — at phase parent with fresh pointer]
  /spec_kit:resume <parent>  →  isPhaseParent(parent) === true
                              →  read parent graph-metadata.json
                                 derived.last_active_child_id (non-null, last_active_at < 24h ago)
                              →  recurse directly into child (skip listing)
                              →  apply child resume ladder

[RESUME FLOW — at phase parent with stale/missing pointer]
  /spec_kit:resume <parent>  →  isPhaseParent(parent) === true
                              →  pointer null OR last_active_at > 24h ago
                              →  fall back to existing list-children behavior
                              →  user picks child manually

[CREATE FLOW — :with-phases]
  /spec_kit:plan :with-phases  →  create.sh --phase
                                   ├─ NEW: parent gets templates/phase_parent/spec.md (lean)
                                   └─ each child gets templates/level_N/* (full)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup — Generator Pointer-Write + Bubble-Up

> **Sub-phase A.** Smallest atomic change; everything downstream depends on the generator emitting the pointer correctly.

- [ ] T001 Add `isPhaseParent` import to `mcp_server/lib/memory/generate-context.ts` (use mcp_server CJS twin from `mcp_server/lib/spec/is-phase-parent.ts`)
- [ ] T002 Add phase-parent branch in save flow: when target folder `isPhaseParent` === true, write `derived.last_active_child_id = null`, `derived.last_active_at = ISO_8601_NOW`
- [ ] T003 Add bubble-up logic: after writing a child's metadata, if `isPhaseParent(parent_of_child)`, also patch parent's `graph-metadata.json` with child's `packet_id` and timestamp
- [ ] T004 Atomic write helper for graph-metadata.json (temp file + rename) to prevent torn writes under concurrent saves
- [ ] T005 Rebuild `scripts/dist/memory/generate-context.js` from updated TS source
- [ ] T006 vitest fixture: assert REQ-001 (parent save writes pointer with `last_active_child_id = null`)
- [ ] T007 vitest fixture: assert REQ-002 (child save updates BOTH child's continuity AND parent's pointer)

### Phase 2: Implementation — Create.sh + Templates

> **Sub-phase B.** Surface the lean template by default and ship the migration-bridge / resource-map polish.

- [ ] T008 Patch `scripts/spec/create.sh --phase` mode: parent scaffolds from `templates/phase_parent/spec.md` (placeholders filled with feature-name, packet-id); children unchanged
- [ ] T009 [P] Create `templates/context-index.md` (~40 LOC) with Author Instructions explaining "use only when phase parent has been reorganized; never auto-scaffolded"
- [ ] T010 [P] Update `templates/resource-map.md` Author Instructions §Scope shape: "at phase parents, prefer parent-aggregate OR per-child mode, not both — pick one and state in Scope line"
- [ ] T011 Create fixture spec via `bash create.sh "Test phase parent" --phase --phases 2 --level 2 --dry-run` and assert parent contents are exactly `{spec.md, description.json, graph-metadata.json}` (REQ-003)

### Phase 3: Verification — Resume + Hook Brief + Validator + E2E

> **Sub-phase C.** Closes the loop end-to-end and adds reviewer guardrails.

- [ ] T012 Patch `.opencode/command/spec_kit/resume.md` step 3b: pointer-first redirect when fresh (<24h), list-fallback when stale/missing, `--no-redirect` bypass
- [ ] T013 Patch resume YAML asset (`assets/spec_kit_resume_*.yaml`) to mirror the redirect logic
- [ ] T014 Patch `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`: brief assembler honors phase-parent redirect
- [ ] T015 [P] Create `scripts/rules/check-phase-parent-content.sh` (severity warn, code-fence aware) scanning forbidden narrative tokens
- [ ] T016 [P] Register `PHASE_PARENT_CONTENT` rule in `scripts/lib/validator-registry.json`
- [ ] T017 Manual end-to-end test: `/spec_kit:plan :with-phases --phases 2 "test-feature"`, edit a child, save, resume parent. Confirm pointer redirect lands in child. Trace stored under `scratch/e2e-trace.txt`
- [ ] T018 Run `validate.sh --strict` regression on `026-graph-and-context-optimization/` after all changes — must show no new errors vs current baseline
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (TS) | `isPhaseParent` already-shipped + new pointer-write helper functions | vitest |
| Integration | parent save writes pointer; child save bubbles up | vitest + tmpdir fixtures |
| Atomic write | concurrent child saves produce eventually-consistent pointer | vitest with promise.all + sleep jitter |
| Bash | `create.sh --phase` parent contents | scripts/tests harness with `--dry-run` mode |
| Validator | `check-phase-parent-content.sh` flags forbidden tokens; code-fence exemption holds | scripts/tests fixtures |
| Manual E2E | `/spec_kit:plan :with-phases` → edit child → save → resume parent → land in child | command transcript captured under scratch/ |
| Regression | 026 strict validation matches current baseline | bash + JSON diff |

### Acceptance Scenarios

**Given** a phase parent at `specs/foo/`, **when** I run `/memory:save specs/foo/`, **then** `specs/foo/graph-metadata.json` has `derived.last_active_child_id = null` and `derived.last_active_at` within 5 seconds of the save.

**Given** a child at `specs/foo/001-bar/`, **when** I run `/memory:save specs/foo/001-bar/`, **then** the parent at `specs/foo/graph-metadata.json` has `derived.last_active_child_id = "specs/foo/001-bar"` and a fresh `last_active_at`.

**Given** a phase parent with a fresh pointer (<24h), **when** I run `/spec_kit:resume specs/foo/`, **then** the command lands directly in the active child without listing.

**Given** a phase parent with a stale pointer (>24h ago) OR null pointer, **when** I run `/spec_kit:resume specs/foo/`, **then** the command lists all children with statuses for me to pick.

**Given** I run `bash create.sh "Test feat" --phase --phases 2`, **when** I `ls specs/NNN-test-feat/`, **then** I see exactly `spec.md description.json graph-metadata.json` plus the two child folders.

**Given** a phase parent's `spec.md` contains "we consolidated 29 phases into 9", **when** I run `validate.sh --strict`, **then** I get a `PHASE_PARENT_CONTENT` warning naming the offending tokens.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `isPhaseParent()` (ESM JS + shell) | Internal | Green | Already shipped in 001 |
| `templates/phase_parent/spec.md` | Internal | Green | Already shipped in 001 |
| `graph-metadata.json` schema accepts `last_active_child_id` / `last_active_at` | Internal | Green | Already shipped in 001 |
| `validator-registry.json` rule registration mechanism | Internal | Green | Existing infrastructure |
| `/spec_kit:resume` step 3b list behavior | Internal | Green | Existing fallback path remains valid |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Generator pointer-write breaks existing saves OR resume redirect lands in wrong child OR validator false-positives on legitimate spec.md content.
- **Procedure**: 
  1. Revert generator phase-parent branch (single commit) — pointer fields stop being written, schema still accepts them, no consumers break.
  2. Revert resume redirect — falls back to existing list behavior automatically.
  3. Disable content validator via `SPECKIT_RULES` env var or revert registry registration.
  4. Templates and `create.sh` patches stay (additive, harmless if unused).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Generator+Bubble) ──► Phase 3 (Resume+Validator+E2E)
                              ▲
Phase 2 (Create+Templates) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | 001-validator-and-docs | Phase 3 (resume needs pointer) |
| Phase 2 | 001-validator-and-docs | None (template/create work independent) |
| Phase 3 | Phase 1 (pointer mechanism), Phase 2 (lean default) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 — Generator + Bubble-Up | Medium | 2-3 hours |
| Phase 2 — Create.sh + Templates | Low | 1-2 hours |
| Phase 3 — Resume + Hook Brief + Validator + E2E | Medium | 2-4 hours |
| **Total** | | **5-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Generator branch tested via vitest fixture before landing
- [ ] Resume redirect tested with both fresh and stale pointer states
- [ ] Validator false-positive test with code-fenced "merged" mention

### Rollback Procedure
1. Revert generator commit — pointer stops writing; existing saves unaffected.
2. Revert resume redirect commit — list fallback resumes immediately.
3. Disable content validator: `export SPECKIT_RULES="$(grep -v PHASE_PARENT_CONTENT)"` or revert registry.
4. Run `validate.sh --strict` on test phase parents to confirm no regressions.

### Data Reversal
- **Has data migrations?** No. Pointer fields are additive; absence is silently tolerated.
- **Reversal procedure**: Optional one-shot `scripts/spec/strip-phase-parent-pointers.sh` to clear the fields if desired.
<!-- /ANCHOR:enhanced-rollback -->
