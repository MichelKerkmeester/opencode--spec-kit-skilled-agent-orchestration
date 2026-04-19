---
title: "Tasks: Description Regen Contract"
description: "Task list for shared schema + unified merge helper."
trigger_phrases: ["description regen tasks"]
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/005-description-regen-contract"
    last_updated_at: "2026-04-19T00:03:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Description merge contract implemented; focused verification complete"
    next_safe_action: "Resolve unrelated baseline failures before claiming T015 full-suite green"
---
# Tasks: Description Regen Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` completed in this run with cited evidence
- `[ ]` intentionally left open because the dispatch constraint or external baseline blocks closure
- `T### [P?] Description (file path)` remains the canonical task format
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read research: 019/001/004 research.md strategy comparison + recommended strategy — evidence: [research.md](./../../research/019-system-hardening-pt-01/research.md) lines 7-9 and 69-83; status: design anchored before implementation.
- [x] T002 [P0] Catalog the 28 rich description.json files for regression — evidence: [research.md](./../../research/019-system-hardening-pt-01/research.md) lines 69-83 plus live sweep confirmation `28 total = 27 under 026 + 1 archived backup`; status: temp-copy regen sweep passed.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P0] Create the live description schema in `mcp_server/lib/description/description-schema.ts` — evidence: [.opencode/skill/system-spec-kit/mcp_server/lib/description/description-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/description/description-schema.ts:3); status: landed in the live runtime path.
- [x] T004 [P0] Define Zod schema classes for canonical-derived, canonical-authored, tracking, known-authored-optional, and passthrough fields — evidence: [.opencode/skill/system-spec-kit/mcp_server/lib/description/description-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/description/description-schema.ts:46); status: landed with `.passthrough()` and reserved-key classification.
- [x] T005 [P0] Export types consumed by FolderDescription and PerFolderDescription — evidence: [.opencode/skill/system-spec-kit/mcp_server/lib/description/description-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/description/description-schema.ts:65) and [.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:46); status: landed.
- [x] T006 [P0] Create the live merge helper in `mcp_server/lib/description/description-merge.ts` — evidence: [.opencode/skill/system-spec-kit/mcp_server/lib/description/description-merge.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/description/description-merge.ts:43); status: landed in the live runtime path.
- [x] T007 [P0] Implement field-level merge policy for canonical regenerate, tracking preserve, authored allowlist preserve, and unknown passthrough — evidence: [.opencode/skill/system-spec-kit/mcp_server/lib/description/description-merge.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/description/description-merge.ts:52); status: landed.
- [x] T008 [P0] Route `getDescriptionWritePayload()` through the shared helper — evidence: [.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:236); status: landed.
- [x] T009 [P0] Route 018 R4 `mergePreserveRepair()` through the shared helper — evidence: [.opencode/skill/system-spec-kit/mcp_server/lib/description/repair.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/description/repair.ts:19); status: landed.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 [P0] Cover the 5 field classes across both lanes with focused tests — evidence: [.opencode/skill/system-spec-kit/mcp_server/tests/description/description-merge.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/description/description-merge.vitest.ts:24); status: `117/117` focused description suites green.
- [x] T011 [P0] Run regen on the 28 rich description.json files — evidence: temp-copy sweep executed on 28 rich files (`27` under `026` + `1` archived backup); status: pass.
- [x] T012 [P0] Verify `title`, `type`, `trigger_phrases`, and `path` survive regen on all 28 files — evidence: [.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:735) plus temp-copy sweep result `failureCount=0`; status: pass.
- [x] T013 [P0] Verify unknown-key passthrough with a synthetic fixture — evidence: [.opencode/skill/system-spec-kit/mcp_server/tests/description/repair-specimens.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/description/repair-specimens.vitest.ts:219) plus temp-copy sample `synthetic_passthrough`; status: pass.
- [ ] T014 [P1] Commit and push midpoint checkpoint — blocked by dispatch constraint: do not commit or push in this run.
- [ ] T015 [P0] Make the full `@spec-kit/mcp-server` suite green — blocked by unrelated baseline failures outside this packet (for example `handler-memory-save.vitest.ts`, `memory-context.resume-gate-d.vitest.ts`, `modularization.vitest.ts`, `startup-brief.vitest.ts`).
- [x] T016 [P0] Update checklist.md with final verification evidence — evidence: [checklist.md](./checklist.md) updated with code and verification outcomes; status: completed in this run.
- [x] T017 [P0] Update implementation-summary.md with delivery and verification status — evidence: [implementation-summary.md](./implementation-summary.md) populated with delivered changes and verification status; status: completed in this run.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- Implementation scope is complete for the description merge contract.
- Release-style closure is blocked only on unrelated baseline failures in the broader `@spec-kit/mcp-server` suite.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Parent: `../spec.md`
- Source: `../../research/019-system-hardening-pt-01/research.md`
<!-- /ANCHOR:cross-refs -->
