---
title: "Ta [system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/tasks]"
description: "Task breakdown for implementing the packet-02 skill-advisor parity, MCP-surface, and telemetry findings while keeping every task traced to a concrete 014 finding."
trigger_phrases:
  - "tasks"
  - "skill-advisor hook improvements"
  - "014-f-001"
  - "014-f-007"
  - "bucket b"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements"
    last_updated_at: "2026-04-24T08:05:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Converted packet-02 findings into Level-2 setup, implementation, and verification tasks"
    next_safe_action: "Start Phase 1 setup tasks and land the P1 implementation tasks in finding order"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/plan.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/research/014-skill-advisor-hook-improvements-pt-02/findings-registry.json"
    completion_pct: 10
    status: "tasks-ready"
---
# Tasks: Skill-Advisor Hook Improvements

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

**Priority meanings**: `P0` = shipped-behavior regression or blocker, `P1` = required correctness/parity/quality work, `P2` = optional follow-up or polish.

**Task Format**: `T-### [P?] [Priority] Description (finding ID; target files)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-001 [P] [P1] Add OpenCode threshold/render regression scaffolds for `014-F-001` and `014-F-002` (`.opencode/plugins/spec-kit-skill-advisor.js`, `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`).
- [ ] T-002 [P] [P1] Add Codex shared-brief parity fixtures for `014-F-003` (`.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`).
- [ ] T-003 [P] [P1] Establish explicit workspaceRoot and threshold-semantic baseline assertions for `014-F-004` and `014-F-005` (`.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md`).
- [ ] T-004 [P] [P1] Capture durable-diagnostics and outcome-event baseline expectations for `014-F-006` and `014-F-007` (`.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-005 [P1] Implement OpenCode effective-threshold unification for `014-F-001` (`.opencode/plugins/spec-kit-skill-advisor.js`, `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`, `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`).
- [ ] T-006 [P1] Route OpenCode native rendering onto shared brief invariants for `014-F-002` (`.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`).
- [ ] T-007 [P1] Normalize the Codex prompt-time fast path against the shared builder for `014-F-003` (`.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`).
- [ ] T-008 [P1] Add explicit workspace selection across public advisor tools for `014-F-004` (`.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md`).
- [ ] T-009 [P1] Publish aggregate-vs-runtime threshold semantics in validation outputs for `014-F-005` (`.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md`).
- [ ] T-010 [P1] Add a durable prompt-safe diagnostics sink and health surface for `014-F-006` (`.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`).
- [ ] T-011 [P1] Add accepted/corrected/ignored outcome capture for `014-F-007` (`.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-012 [P1] Run OpenCode parity regressions for `014-F-001` and `014-F-002` to confirm threshold and render parity across `.opencode/plugins/spec-kit-skill-advisor.js`, `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`.
- [ ] T-013 [P1] Run Codex parity regressions for `014-F-003` against `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts`, and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`.
- [ ] T-014 [P1] Run validator and cross-consistency checks for `014-F-004` and `014-F-005` across `schemas/advisor-tool-schemas.ts`, `handlers/advisor-recommend.ts`, `handlers/advisor-validate.ts`, and `README.md`.
- [ ] T-015 [P1] Run telemetry persistence and outcome-learning verification for `014-F-006` and `014-F-007` across `lib/metrics.ts`, runtime hook adapters, and any handler-level analysis output added during implementation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1-3 tasks for `014-F-001` through `014-F-007` are marked `[x]`
- [ ] No `[B]` blocked tasks remain for the P1 finding set
- [ ] Verification confirms one shared threshold/render/operator contract across OpenCode, Codex, MCP validation, and prompt-safe telemetry surfaces
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `./spec.md` (`REQ-003`, `REQ-004`, `REQ-005`; scope boundaries in Section 3)
- **Research synthesis**: `../../research/014-skill-advisor-hook-improvements-pt-02/research.md`
- **Findings registry**: `../../research/014-skill-advisor-hook-improvements-pt-02/findings-registry.json`
- **Merged synthesis bucket**: `../../research/013-014-pt-02-merged-synthesis.md` — `Bucket B: 014-skill-advisor-hook-improvements plan inputs`
- **Merged findings**: `../../research/013-014-pt-02-merged-findings.json`
- **Plan**: `./plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
