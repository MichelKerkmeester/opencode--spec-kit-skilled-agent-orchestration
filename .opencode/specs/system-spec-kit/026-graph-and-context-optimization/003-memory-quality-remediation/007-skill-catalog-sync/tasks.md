---
title: "Tasks: Phase 7 — Skill Catalog Sync"
description: "Task format: T7xx [modifier] Phase 7 setup, 10 review iterations, synthesis, downstream sync, and verification."
trigger_phrases:
  - "phase 7 tasks"
  - "skill catalog sync tasks"
  - "phase 7 review wave"
importance_tier: important
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + phase-child + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-quality-remediation/007-skill-catalog-sync"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["tasks.md"]

---
# Tasks: Phase 7 — Skill Catalog Sync

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + phase-child + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[G]` | Gate or required checkpoint |

**Task Format**: `T7xx [modifier] Description (primary file or artifact)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T701 Confirm the Phase 6 -> Phase 7 handoff criteria before the audit begins.
- [x] T702 Freeze the final post-dedupe baseline from Phase 6 for all downstream comparisons.
- [x] T703 Create the ten review outputs and the findings JSONL in `research/`.
- [x] T704 [G] Pass GATE 1 with 10 iteration files plus a valid findings JSONL.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Sub-PR-14 (P0 Must-Fix)

- [ ] T705 Fix `F004.1` in `.opencode/skill/system-spec-kit/references/templates/template_guide.md`.
- [ ] T706 Fix `F007.1` in `.opencode/command/memory/save.md`.
- [ ] T707 Fix `F008.1` in `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts`.
- [ ] T708 Fix `F008.2` in `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts`.

### Sub-PR-15 (P1 Should-Fix)

- [ ] T709 Fix `F003.1` in `.opencode/skill/system-spec-kit/SKILL.md`.
- [ ] T710 Fix `F004.2` in `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`.
- [ ] T711 Fix `F004.3` in `.opencode/skill/system-spec-kit/references/memory/memory_system.md`.
- [ ] T712 Fix `F004.4` in `.opencode/skill/system-spec-kit/references/workflows/execution_methods.md`.
- [ ] T713 Fix `F007.2` in `.opencode/command/memory/save.md`.
- [ ] T714 Fix `F009.1` in `.opencode/agent/orchestrate.md`.
- [ ] T715 Fix `F009.2` in `.claude/agents/orchestrate.md`.
- [ ] T716 Fix `F010.1` in `.opencode/skill/system-spec-kit/README.md`.

### Deferred And Matrix Publication

- [ ] T717 Record `F004.5` as deferred with rationale in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-remediation/007-skill-catalog-sync/implementation-summary.md`.
- [x] T718 Publish `research/review-report.md` and freeze the 13-row matrix.
- [x] T719 Record the four confirmed-current surfaces as no-change in the review report.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T720 Re-check every changed downstream surface against the final Phase 1-6 behavior.
- [ ] T721 Run the full memory-quality regression suite after Sub-PR-14 and Sub-PR-15 land.
- [ ] T722 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-remediation/007-skill-catalog-sync --strict`.
- [ ] T723 Update `checklist.md` with row-by-row evidence for all 13 matrix items.
- [ ] T724 Update `implementation-summary.md` with applied fixes, confirmed-current surfaces, and any P1/P2 deferrals.
<!-- /ANCHOR:phase-3 -->

---

### Task Dependencies

| Task | Depends On | Reason |
|------|------------|--------|
| `T705-T708` | `T701-T704` | Sub-PR-14 depends on the completed review matrix. |
| `T709-T716` | `T701-T704` | Sub-PR-15 depends on the completed review matrix. |
| `T717` | `T718` | Deferral rationale belongs in the frozen matrix record. |
| `T720-T724` | `T705-T719` | Verification depends on the full changed and no-change surface set. |

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All required `T701-T724` tasks are marked `[x]` or explicitly deferred with rationale
- [x] Ten review outputs exist
- [x] Parity matrix records all ten surfaces
- [ ] Phase validator exits cleanly
- [ ] Final downstream parity record published
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent Spec**: `../spec.md`
- **Phase 6 Spec**: `../006-memory-duplication-reduction/spec.md`
<!-- /ANCHOR:cross-refs -->
