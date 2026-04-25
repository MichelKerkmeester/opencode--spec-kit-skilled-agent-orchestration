---
title: "Tasks [system-spec-kit/026-graph-and-context-optimization/007-code-graph/004-code-graph-hook-improvements/tasks]"
description: "Task plan for implementing the code-graph resolver, scan, startup, and bounded-context fixes defined by packet 013 research and merged Bucket A synthesis."
trigger_phrases:
  - "tasks"
  - "code-graph hook improvements"
  - "013"
  - "hook daemon parity"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/004-code-graph-hook-improvements"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Level 2 task list created"
    next_safe_action: "Start Phase 1 setup tasks and create the regression baselines listed in T001-T003"
    blockers:
      - "checklist.md is still missing for this Level 2 packet"
      - "spec.md still lacks required anchor/template markers"
    key_files:
      - "tasks.md"
      - "plan.md"
      - "spec.md"
    completion_pct: 35
    open_questions:
      - "Whether 013-F-005 will be solved by transport propagation or by removing the unused sharedPayload contract"
    answered_questions:
      - "Phase 2 tasks must map directly to the P0/P1 findings from pt-02 research and merged synthesis"
template_source_marker: "tasks-core | v2.2"
---
# Tasks: Code-Graph Hook Improvements

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] T001 Build blocked-read regression scaffolds for `013-F-001` in `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts` and `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`
- [ ] T002 Build ambiguous CALLS subject-selection baselines for `013-ZC-F-001` and `013-ZC-F-003` in `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`
- [ ] T003 [P] Capture current semantic-seed, graph-quality-summary, and startup/context contract expectations for `013-F-002`, `013-F-003`, `013-F-004`, `013-F-005`, and `013-F-006` across `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`, and `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 P0 Address `013-ZC-F-001` by making CALLS subject resolution prefer callable implementation nodes in `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts` with paired regression coverage in `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`
- [ ] T005 P1 Address `013-ZC-F-002` by extending ambiguity warning payloads and selected-candidate metadata in `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts` and `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`
- [ ] T006 P1 Address `013-ZC-F-003` by replacing first-candidate ambiguity assertions with wrapper-vs-function `calls_from` and `calls_to` regressions in `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`
- [ ] T007 P1 Address `013-F-001` by returning an explicit blocked/degraded `full_scan` contract from `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts` and `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`, with matching updates in `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts` and `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`
- [ ] T008 P1 Address `013-F-002` by preserving CocoIndex `score`, `snippet`, and range fidelity in `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts` and `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`, with ranking coverage in `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`
- [ ] T009 P1 Address `013-F-003` by clearing persisted enrichment summaries on null-summary scans in `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts` and `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`, with overwrite-then-clear coverage in `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts`
- [ ] T010 P2 Address `013-F-004` by surfacing graph-quality summary readers in `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`, and `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`
- [ ] T011 P2 Address `013-F-005` by enforcing one startup payload contract across `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`, and `.opencode/skill/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts`
- [ ] T012 P2 Address `013-F-006` by making bounded-work deadlines and partial-output metadata real in `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`, and `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`
- [ ] T013 P2 Address `013-ZC-F-004` by verifying the operation-aware resolver against sibling `handle*` shadow patterns in `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts` and `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Run targeted Vitest regression suites for `013-ZC-F-001`, `013-ZC-F-002`, `013-ZC-F-003`, `013-ZC-F-004`, `013-F-001`, `013-F-002`, `013-F-003`, `013-F-005`, and `013-F-006` using `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`, and `.opencode/skill/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts`
- [ ] T015 [P] Run cross-consistency `rg` checks for `013-ZC-F-002`, `013-F-004`, `013-F-005`, and `013-F-006` across `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`, and `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`
- [ ] T016 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/004-code-graph-hook-improvements --strict` to verify packet-doc alignment for `013-ZC-F-001`, `013-F-001`, `013-F-003`, and `013-F-005`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 and P1 tasks for `013-ZC-F-001`, `013-ZC-F-002`, `013-ZC-F-003`, `013-F-001`, `013-F-002`, and `013-F-003` are marked `[x]`
- [ ] No `[B]` blocked tasks remain for the resolver, blocked-read, scan metadata, or startup/context parity lanes
- [ ] Verification evidence covers validator output, cross-consistency grep results, and focused Vitest runs for every target file family named above
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md` Section 3 (scope guardrails), `spec.md` REQ-004, `spec.md` REQ-005, and `spec.md` SC-003
- **Research packet**: `../../research/013-code-graph-hook-improvements-pt-02/research.md` and `../../research/013-code-graph-hook-improvements-pt-02/findings-registry.json`
- **Merged synthesis**: `../../research/013-014-pt-02-merged-synthesis.md` section `Bucket A: 013-code-graph-hook-improvements plan inputs` and `../../research/013-014-pt-02-merged-findings.json`
- **Packet-local investigation**: `code-graph-zero-calls-investigation.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
