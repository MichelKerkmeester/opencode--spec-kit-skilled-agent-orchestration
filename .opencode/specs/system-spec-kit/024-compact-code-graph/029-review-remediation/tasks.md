---
title: "Tasks: Review Remediation [024/029]"
description: "Task tracking for the active deep-review blocker set and the optional advisory follow-up."
trigger_phrases:
  - "029 tasks"
  - "review remediation tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Review Remediation

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[~]` | In progress |
| `[x]` | Completed with implementation or verification evidence |
| `[P]` | Parallelizable after dependency clearance |
| `[B]` | Blocked pending a contract decision or prior workstream |

**Task Format**: `T### [priority/workstream] Description (primary file surface)`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [WS-0] Read the active review registry and adjacent phase packet style (`../review/review-report.md`, `../028-startup-highlights-remediation/`).
- [x] T002 [WS-0] Confirm the child packet stays limited to `029-review-remediation` and excludes parent packet edits plus `030-opencode-plugin/`.
- [x] T003 [WS-1] Decide the truth-sync direction for `session_bootstrap`: add `nextActions` or downgrade the contract surfaces (`session-bootstrap.ts`, `tool-schemas.ts`, MCP README).
- [x] T004 [WS-2] Decide the root evidence ownership model for shipped Phase 015/016 status before implementation begins (root summary refresh vs checklist repointing vs both).
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [WS-1] Align `session_bootstrap` handler output with every documented public contract surface (`.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/README.md`).
- [x] T006 [WS-2][P] Repair root packet evidence so checklist proof agrees with actual shipped status for phases 015 and 016 (`../implementation-summary.md`, `../checklist.md`).
- [x] T007 [WS-3][P] Add Gemini compact-recovery provenance fencing or narrow the claim to the live behavior (`.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts`).
- [x] T008 [WS-3][P] Replace transcript-frequency autosave targeting with validated active-session packet selection (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`).
- [x] T009 [WS-4] Truth-sync Phase 021 to the bootstrap-first recovery contract and mark superseded guidance explicitly if kept for history (`../021-cross-runtime-instruction-parity/spec.md`, `../021-cross-runtime-instruction-parity/implementation-summary.md`, `AGENTS.md`).
- [x] T010 [WS-5] Implement or relax the Phase 027 hard structural budget claim so packet docs and runtime behavior agree (`../027-opencode-structural-priming/spec.md`, `../027-opencode-structural-priming/plan.md`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts`).
- [x] T011 [WS-6] Align `context-prime` structural Prime Package wording across OpenCode, Claude, and the live Codex runtime surfaces if the advisory is accepted for this pass (`.opencode/agent/context-prime.md`, `.claude/agents/context-prime.md`, `.codex/agents/context-prime.toml`).
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 [WS-1] Verify `session_bootstrap` now returns or documents exactly the same shape across handler, schema, and README.
- [x] T013 [WS-2] Verify root checklist evidence no longer points to stale shipped-status claims.
- [x] T014 [WS-3] Verify Gemini recovery payloads are fenced and Claude autosave chooses the authoritative packet in multi-spec transcripts.
- [x] T015 [WS-4/WS-5] Verify Phase 021 and Phase 027 no longer contradict the current bootstrap-first and structural-budget contracts.
- [x] T016 [WS-0] Re-run strict validation for this phase packet and targeted validation for any changed sibling packet docs.
- [x] T017 [WS-0] Run a focused post-remediation review sweep on the parent packet with focus on root traceability, hook safety, and bootstrap contracts.
- [x] T018 [WS-6] If advisory work shipped, verify cross-runtime `context-prime` copies share the intended Prime Package shape.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All blocker workstreams WS-1 through WS-5 are closed with evidence or explicitly downgraded claims.
- [x] The parent packet can be re-reviewed without the current six active P1 findings.
- [x] Advisory WS-6 is either completed or consciously deferred as maintenance debt.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Review Source**: `../review/review-report.md`
- **Adjacent pattern reference**: `../028-startup-highlights-remediation/spec.md`, `../028-startup-highlights-remediation/plan.md`, `../028-startup-highlights-remediation/tasks.md`, `../028-startup-highlights-remediation/checklist.md`
- **Root packet evidence surfaces**: `../checklist.md`, `../implementation-summary.md`
- **Key sibling packets**: `../021-cross-runtime-instruction-parity/`, `../027-opencode-structural-priming/`
<!-- /ANCHOR:cross-refs -->
