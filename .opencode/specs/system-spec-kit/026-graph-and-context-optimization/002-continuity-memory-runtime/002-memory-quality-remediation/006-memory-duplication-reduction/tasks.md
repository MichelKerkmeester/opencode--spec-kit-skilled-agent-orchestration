---
title: "...ext-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/006-memory-duplication-reduction/tasks]"
description: "Task format: T6xx [modifier] Phase 6 setup, five research iterations, synthesis, implementation, and verification."
trigger_phrases:
  - "phase 6 tasks"
  - "memory duplication tasks"
  - "phase 6 research wave"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/006-memory-duplication-reduction"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["tasks.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + phase-child + level2-verify | v2.2 -->"
---
# Tasks: Phase 6 — Memory Duplication Reduction

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

**Task Format**: `T6xx [modifier] Description (primary file or artifact)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T601 Confirm the five iteration outputs are present and frozen as the implementation input.
- [ ] T602 Rebuild or verify `research/findings-registry.json` so all five iterations are represented.
- [ ] T603 Create or refresh `research/research.md` as the canonical remediation matrix for Phase 6.
- [ ] T604 [G] Record the post-Phase-6 deferrals (`F002.3`, `F002.4`, `F003.2`, `F004.3`, `F005.3`, `F005.4`) before implementation begins.
- [ ] T604a [G] Re-enable the 26 legacy tests deferred in the core contract landing. The compact-wrapper contract was flipped in the runtime (`memory-template-contract.ts` SECTION_RULES, `workflow.ts` default context binding, `collect-session-data.ts` canonical-doc detection, the template retrieval-wrapper TOC) outside this packet's implementation window, and 8 test files were marked `describe.skip` with `TODO(003-006)` comments because their assertions target the old packet-shape rendered sections. Files to migrate back to green: `memory-render-fixture.vitest.ts`, `memory-quality-phase2-pr4.test.ts`, `memory-quality-phase6-extractors.test.ts`, `memory-quality-phase6-template.test.ts`, `auto-detection-fixes.vitest.ts`, `workflow-e2e.vitest.ts`, `workflow-session-id.vitest.ts`, `workflow-warning.vitest.ts`. Acceptance: each file's skipped describe block is re-enabled with assertions rewritten against the compact wrapper output (`CANONICAL SOURCES`, `OVERVIEW`, `DISTINGUISHING EVIDENCE` sections) and vitest returns zero skipped tests for these 8 files.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T605 [G] Freeze the approved `PR-12` / `PR-13` matrix before code changes begin.
- [ ] T606 Implement `F001.1` in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` to remove unconditional scaffold-trigger injection.
- [ ] T607 Implement `F001.3` across `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`, `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts`, and `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts` to collapse hyphen/space and title/path near-duplicates.
- [ ] T608 Implement `F002.1` across `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts` and `.opencode/skill/system-spec-kit/templates/context_template.md` to eliminate repeated `### OBSERVATION: Observation` headings.
- [ ] T609 Implement `F002.2` across `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` and `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts` to collapse proposition triple-restatement.
- [ ] T610 Implement `F003.1` in `.opencode/skill/system-spec-kit/scripts/core/alignment-validator.ts` to keep one carrier row while removing repeated `Merged from ...` description inflation.
- [ ] T611 Implement `F004.1` in `.opencode/skill/system-spec-kit/templates/context_template.md` to collapse completed-session closure echoes to one surface.
- [ ] T612 Implement `F004.2` in `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` to replace clipped `Last:` fragments with boundary-safe behavior.
- [ ] T613 Implement `F005.1` across `.opencode/skill/system-spec-kit/templates/context_template.md`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`, and `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts` to remove redundant section-identity triplets safely.
- [ ] T614 Implement `F005.2` across `.opencode/skill/system-spec-kit/templates/context_template.md`, `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts`, and `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` to establish one metadata single source of truth.

### Optional `PR-13`

- [ ] T615 Decide from replay evidence whether `F001.2` needs the bounded migration/hardening pass.
- [ ] T616 If approved, implement `F001.2` across `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`, and `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T617 Run replay/fixture verification for each remediation-matrix row that shipped in `PR-12`, plus `PR-13` if used.
- [ ] T618 Confirm new residual-duplication reviewer assertions complement existing `CHECK-D1..D8` coverage without regressing valid outputs.
- [ ] T619 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/006-memory-duplication-reduction --strict`.
- [ ] T620 Update `checklist.md` with Phase 6 verification evidence and explicit defer notes.
- [ ] T621 Update `implementation-summary.md` with the final post-dedupe state, shipped findings, deferred findings, and Phase 7 handoff notes.
<!-- /ANCHOR:phase-3 -->

---

### Task Dependencies

| Task | Depends On | Reason |
|------|------------|--------|
| `T605` | `T601-T604` | The remediation matrix must be frozen before implementation begins. |
| `T606-T614` | `T605` | `PR-12` follows the approved live-path scope only. |
| `T615-T616` | `T606-T614` | `PR-13` is optional and should be driven by post-`PR-12` evidence. |
| `T617-T621` | `T606-T616` | Verification depends on the final shipped scope. |

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All shipped-scope tasks from `T601-T621` are marked `[x]`
- [ ] Five iteration outputs and a complete findings registry exist
- [ ] Approved remediation set documented in `research/research.md`
- [ ] Phase validator exits cleanly
- [ ] Phase 7 handoff notes recorded with explicit post-Phase-6 deferrals
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent Spec**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
