---
title: "Tasks: Hook Plugin Per Runtime Testing"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks | v2.2"
description: "Task ledger for live per-runtime hook and plugin validation."
trigger_phrases:
  - "043-hook-plugin-per-runtime-testing"
  - "runtime hook tests"
  - "per-runtime hook validation"
  - "cli skill hook tests"
  - "hook live testing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/043-hook-plugin-per-runtime-testing"
    last_updated_at: "2026-04-29T21:12:00+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Tasks complete"
    next_safe_action: "Review findings matrix"
    blockers: []
    completion_pct: 100
---
# Tasks: Hook Plugin Per Runtime Testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.2 -->

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

- [x] T001 [P0] Read hook contract and per-runtime docs. [EVIDENCE: `spec.md` ready gate]
- [x] T002 [P0] Read CLI skill invocation docs. [EVIDENCE: `plan.md` ready gate]
- [x] T003 [P0] Read matrix adapter runner reference. [EVIDENCE: `plan.md` ready gate]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Create shared runner helpers. [EVIDENCE: `runners/common.ts`]
- [x] T005 [P0] Create Claude runner. [EVIDENCE: `runners/test-claude-hooks.ts`]
- [x] T006 [P0] Create Codex runner. [EVIDENCE: `runners/test-codex-hooks.ts`]
- [x] T007 [P0] Create Copilot runner. [EVIDENCE: `runners/test-copilot-hooks.ts`]
- [x] T008 [P0] Create Gemini runner. [EVIDENCE: `runners/test-gemini-hooks.ts`]
- [x] T009 [P0] Create OpenCode plugin runner. [EVIDENCE: `runners/test-opencode-plugins.ts`]
- [x] T010 [P0] Create three-wide orchestrator. [EVIDENCE: `runners/run-all-runtime-hooks.ts`]
- [x] T011 [P1] Create operator quickstart. [EVIDENCE: `runners/README.md`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 [P0] Execute live orchestrator. [EVIDENCE: five files under `results/`]
- [x] T013 [P0] Capture per-cell JSONL. [EVIDENCE: `results/*.jsonl`]
- [x] T014 [P0] Confirm no secret-like values in results. [EVIDENCE: targeted `rg` exit 0]
- [x] T015 [P0] Write findings matrix. [EVIDENCE: `findings.md`]
- [x] T016 [P0] Run strict validator. [EVIDENCE: strict validator exit 0]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remain.
- [x] Live runtime evidence is written to packet-local JSONL.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: See `findings.md`
<!-- /ANCHOR:cross-refs -->
