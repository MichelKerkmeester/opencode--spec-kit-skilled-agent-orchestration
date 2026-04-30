---
title: "Tasks: CLI Matrix Adapter Runners"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks | v2.2"
description: "Task ledger for packet 036 CLI matrix adapter runner implementation."
trigger_phrases:
  - "023-cli-matrix-adapter-runners"
  - "CLI matrix adapter"
  - "matrix runner adapters"
  - "cli-codex adapter"
  - "cli-copilot adapter"
  - "cli-gemini adapter"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners"
    last_updated_at: "2026-04-29T17:16:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Tasks complete"
    next_safe_action: "Run targeted smoke"
    blockers: []
    completion_pct: 100
---
# Tasks: CLI Matrix Adapter Runners

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

- [x] T001 [P0] Read packet 030 spec and plan. [EVIDENCE: `spec.md` cites `030.../spec.md:48` and `030.../plan.md:54`]
- [x] T002 [P0] Read packet 035 findings/results/log examples. [EVIDENCE: `spec.md` cites `035.../findings.md:15` and `:75`]
- [x] T003 [P0] Determine adapter target location. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/` created]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Implement shared adapter contract and result normalization. [EVIDENCE: `adapter-common.ts:14`, `:16`, `:24`, `:97`]
- [x] T005 [P0] Implement cli-codex adapter. [EVIDENCE: `adapter-cli-codex.ts:11`]
- [x] T006 [P0] Implement cli-copilot adapter. [EVIDENCE: `adapter-cli-copilot.ts:9`]
- [x] T007 [P0] Implement cli-gemini adapter. [EVIDENCE: `adapter-cli-gemini.ts:9`]
- [x] T008 [P0] Implement cli-claude-code adapter. [EVIDENCE: `adapter-cli-claude-code.ts:9`]
- [x] T009 [P0] Implement cli-opencode adapter. [EVIDENCE: `adapter-cli-opencode.ts:11`]
- [x] T010 [P0] Implement timeout behavior. [EVIDENCE: `adapter-common.ts:134`]
- [x] T011 [P0] Implement spawn-error `BLOCKED` behavior. [EVIDENCE: `adapter-common.ts:124`, `:151`]
- [x] T012 [P1] Implement expected-signal PASS detection. [EVIDENCE: `adapter-common.ts:70`, `:163`]
- [x] T013 [P0] Create 70-cell manifest. [EVIDENCE: JSON sanity check output `70`, `14`, `5`, `F11-cli-gemini`]
- [x] T014 [P1] Create prompt templates. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F1-spec-folder.md` through `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F14-search-w3-w13.md`]
- [x] T015 [P0] Implement meta-runner. [EVIDENCE: `run-matrix.ts:238`]
- [x] T016 [P1] Implement filter and executor CLI flags. [EVIDENCE: `run-matrix.ts:90`, `:240`]
- [x] T017 [P1] Implement per-cell JSONL and `summary.tsv` outputs. [EVIDENCE: `run-matrix.ts:172`, `:180`, `:263`]
- [x] T018 [P1] Implement aggregate pass-rate output. [EVIDENCE: `run-matrix.ts:193`, `:263`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 [P0] Add five adapter smoke test files. [EVIDENCE: `mcp_server/tests/matrix-adapter-*.vitest.ts`]
- [x] T020 [P1] Add runner README. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/README.md:12`, `:31`, `:64`]
- [x] T021 [P1] Update MCP server README. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:1301`, `:1322`]
- [x] T022 [P0] Run required verification. [EVIDENCE: `npm run build` exit 0; `npx vitest run matrix-adapter` 5 files, 10 tests passed; strict validator exit 0]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remain.
- [x] Manual verification passed through build, targeted Vitest, and strict validator.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- [ ] D001 [P1] Run real external CLI smoke/auth checks. [OWNER: packet 037]
- [ ] D002 [P1] Fix F11 Copilot hook parity. [OWNER: packet 038]
- [ ] D003 [P1] Split/harden F12 progressive validator timeout. [OWNER: packet 039]
- [ ] D004 [P1] Create F13 native/inline stress-cycle runner. [OWNER: packet 040]

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
