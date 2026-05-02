---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: Scenario Design [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/001-scenario-design/tasks]"
description: "Authoring tasks for corpus + rubric + matrix + scripts in sub-phase 001."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "scenario design tasks"
  - "corpus authoring"
  - "dispatch script tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/001-scenario-design"
    last_updated_at: "2026-04-26T14:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Decomposed sub-phase work units"
    next_safe_action: "Hand off to 002 for execution"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
# Tasks: Scenario Design

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Create sub-phase folder (already done by parent)
- [x] T002 [P] Read all 3 CLI skill SKILL.md files
- [x] T003 [P] Cross-reference 005 defects packet for known-bug cells
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T101 Author 9 scenarios with prompt + expected + tools + indicators + cross-ref (spec.md §Scenario Corpus)
- [x] T102 [P] Author 5-dim rubric with 0/1/2 anchors (spec.md §Scoring Rubric)
- [x] T103 [P] Author per-CLI dispatch matrix (spec.md §Dispatch Matrix)
- [x] T104 [P] Author output schema with meta.json + score.md formats (spec.md §Output Schema)
- [x] T105 [P] Author scoring methodology (spec.md §Scoring Methodology)
- [x] T106 [P] Author plan.md (corpus authoring methodology)
- [x] T107 [P] Author description.json + graph-metadata.json
- [x] T108 [P] Author implementation-summary.md
- [ ] T109 Author dispatch script `scripts/dispatch-cli-codex.sh`
- [ ] T110 [P] Author dispatch script `scripts/dispatch-cli-copilot.sh` (with concurrency guard)
- [ ] T111 [P] Author dispatch script `scripts/dispatch-cli-opencode.sh`
- [ ] T112 Author orchestrator `scripts/run-all.sh`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T201 `bash -n scripts/*.sh` syntax check passes
- [ ] T202 Smoke test: dispatch S1 against each CLI manually; verify output capture
- [ ] T203 `validate.sh --strict` against this sub-phase passes
- [ ] T204 Rubric inter-rater spot-check (score 1 cell with 2 scorers; expect ±1 agreement)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T001-T108 marked `[x]`
- [ ] T109-T112 (dispatch scripts) authored
- [ ] T201-T203 verification tasks pass
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (corpus + rubric + matrix + output schema + methodology)
- **Plan**: See `plan.md` (authoring methodology)
- **Parent root packet**: `../spec.md`
- **Sibling sub-phase (execution)**: `../002-scenario-execution/`
- **Sibling defects packet**: `../../005-memory-search-runtime-bugs/`
- **CLI skills referenced**:
  - `.opencode/skill/cli-codex/SKILL.md`
  - `.opencode/skill/cli-copilot/SKILL.md`
  - `.opencode/skill/cli-opencode/SKILL.md`
<!-- /ANCHOR:cross-refs -->
