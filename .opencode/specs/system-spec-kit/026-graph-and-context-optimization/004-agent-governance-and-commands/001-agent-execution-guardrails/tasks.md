---
title: "Tasks: Phase 4 — Agent Execution Guardrails"
description: "Task format: T4xx [modifier] review three AGENTS files, keep the lean request-analysis block under Critical Rules, verify direct transition into Tools & Search, and close the packet."
trigger_phrases:
  - "phase 4 tasks"
  - "agent execution guardrails tasks"
  - "agents guardrail packet tasks"
importance_tier: important
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + phase-child + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/001-agent-execution-guardrails"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["tasks.md"]

---
# Tasks: Phase 4 — Agent Execution Guardrails

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

**Task Format**: `T4xx [modifier] Description (primary file or artifact)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T401 Read `AGENTS_example_fs_enterprises.md` and capture the insertion point under Section 1 `## 1. CRITICAL RULES`.
- [x] T402 Read `AGENTS.md` in the Public workspace and capture the parallel insertion point.
- [x] T403 Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/AGENTS.md` and capture the parallel insertion point.
- [x] T404 [G] Build the eight-point guardrail matrix plus the structure checklist for keeping the lean request-analysis block under Critical Rules, deleting the standalone request-analysis section, removing duplicate scaffolding, retaining later-heading renumbering, and fixing the `§4 Confidence Framework` cross-reference, then freeze the phase scope to the three AGENTS files plus packet docs and verification only.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T405 Update `AGENTS_example_fs_enterprises.md` so `### Request Analysis & Execution` stays under Critical Rules, the old standalone request-analysis section is removed, duplicate support scaffolding is gone, the block keeps only `Flow` plus `#### Execution Behavior`, and later headings remain renumbered.
- [x] T406 Update `AGENTS.md` in the Public workspace with the same lean structural and wording changes.
- [x] T407 Update `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/AGENTS.md` with the same lean structural and wording changes.
- [x] T408 [G] Re-read all three edited AGENTS files and confirm the wording stays explicit, scoped, and safety-compatible, the request-analysis block stays under Critical Rules, duplicate scaffolding is gone, the block transitions directly into `### Tools & Search`, later headings remain renumbered, and the `§4 Confidence Framework` reference is correct.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T409 Update `checklist.md` with direct evidence for all three AGENTS files, including the lean moved block, deleted section, removed duplicate scaffolding, renumbered headings, and corrected cross-reference.
- [x] T410 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/001-agent-execution-guardrails --strict`.
- [x] T411 Update `implementation-summary.md` with the exact AGENTS-file changes and packet verification results.
- [x] T412 Confirm the final file set stayed limited to the three AGENTS targets plus packet documentation and verification.
<!-- /ANCHOR:phase-3 -->

---

### Task Dependencies

| Task | Depends On | Reason |
|------|------------|--------|
| `T405-T407` | `T401-T404` | The edit plan depends on reading all three files and freezing scope first. |
| `T408` | `T405-T407` | Cross-file verification requires all three AGENTS edits plus the structural move and renumbering to exist. |
| `T409-T412` | `T407-T408` | Checklist, validation, summary, and final scope review depend on completed edits and evidence. |

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All `T401-T412` tasks are marked `[x]`
- [x] All three AGENTS files contain all eight requested guardrails under the lean moved Critical Rules subsection
- [x] Packet validator exits cleanly
- [x] Same-session implementation summary published
- [x] Final scope stayed limited to the three AGENTS targets plus packet docs and verification
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
- **Parent Packet**: `../`
<!-- /ANCHOR:cross-refs -->
