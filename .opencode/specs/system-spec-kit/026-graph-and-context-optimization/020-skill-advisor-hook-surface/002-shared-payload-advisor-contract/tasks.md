---
title: "Tasks: Shared-Payload Advisor Contract"
description: "Task list for 020/002 — additive envelope extension."
trigger_phrases:
  - "020 002 tasks"
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/002-shared-payload-advisor-contract"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T001"
    blockers: []
    key_files: []

---
# Tasks: Shared-Payload Advisor Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending | `[x]` complete | P0/P1/P2 severity
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P0] Read `lib/context/shared-payload.ts` and existing tests to understand current enum + coerce structure
- [ ] T002 [P0] Read research.md §Pattern Parallel Map + research-extended.md §X9 for contract details
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P0] Extend producer enum to include `"advisor"` (`lib/context/shared-payload.ts`)
- [ ] T004 [P0] Extend source-kind enum with `"skill-inventory"`, `"skill-graph"`, `"advisor-runtime"`
- [ ] T005 [P0] Define `AdvisorEnvelopeMetadata` TypeScript interface with freshness/confidence/uncertainty/skillLabel/status fields
- [ ] T006 [P0] Update `coerceSharedPayloadEnvelope()` to validate advisor metadata whitelist
- [ ] T007 [P0] Add privacy-rejection validator: reject `kind: "user-prompt"` source refs + unanchored `sha256:*` paths
- [ ] T008 [P1] Add JSDoc with `@see` tag pointing at research.md
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 [P0] Write `mcp_server/tests/shared-payload-advisor.vitest.ts` with 6 acceptance scenarios
- [ ] T010 [P0] Run `vitest run shared-payload-advisor` green
- [ ] T011 [P0] Run full `shared-payload*.vitest.ts` suite (no regression)
- [ ] T012 [P0] Run `tsc --noEmit` clean across mcp_server
- [ ] T013 [P0] Mark all P0 items in `checklist.md` with `[x]` + evidence
- [ ] T014 [P0] Update `implementation-summary.md` with Files Changed table + verification results
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 tasks marked `[x]` with evidence
- 6 vitest scenarios green
- `tsc --noEmit` clean
- Children 003-008 listed in parent 020/spec.md as downstream consumers
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Pattern reference: `../001-initial-research/` (converged)
- Source: `../../../../../skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`
<!-- /ANCHOR:cross-refs -->
