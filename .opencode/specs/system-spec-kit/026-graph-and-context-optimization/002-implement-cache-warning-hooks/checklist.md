---
title: "Verification Checklist: Cache-Warning Hook System [template:level_3/checklist.md]"
description: "Verification Date: [YYYY-MM-DD]"
trigger_phrases:
  - "verification"
  - "checklist"
  - "producer patch"
  - "replay isolation"
importance_tier: "normal"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["checklist.md"]

---
# Verification Checklist: Cache-Warning Hook System

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `spec.md` reflects the producer-only re-scope and no longer promises an active six-phase warning rollout [EVIDENCE: `spec.md` status and scope now reflect the producer-first packet.]
- [x] CHK-002 [P0] `research.md` points to the canonical 2026-04-08 synthesis and Claudest continuation order [EVIDENCE: `research.md` names the authoritative synthesis, ranked guidance, and Claudest continuation sources.]
- [x] CHK-003 [P0] FTS helper plus forced-degrade tests are documented as the hard predecessor [EVIDENCE: predecessor wording is present across `spec.md`, `plan.md`, and `research.md`; `tests/sqlite-fts.vitest.ts` passed.]
- [x] CHK-004 [P0] `plan.md` documents replay isolation, bounded producer patch, and idempotent verification [EVIDENCE: `plan.md` phases and testing strategy are now marked complete.]
- [x] CHK-005 [P0] Packet docs explicitly defer `UserPromptSubmit`, startup fast path work, and `.claude/settings.local.json` mutation [EVIDENCE: packet docs defer those surfaces and `git diff --name-only -- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts .claude/settings.local.json` returned no changes.]
- [x] CHK-006 [P1] Follow-on continuity packet order is documented honestly [EVIDENCE: docs hand off to analytics reader, cached-summary consumer, workflow split, and token contracts.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Planned code touch set is limited to `hook-state.ts`, `session-stop.ts`, and replay or test infrastructure [EVIDENCE: scoped status shows only those runtime files plus replay harness and tests changed.]
- [x] CHK-011 [P0] Producer metadata remains additive-only in `HookState` [EVIDENCE: `producerMetadata` was added without replacing existing session metrics or continuity fields.]
- [x] CHK-012 [P0] `claudeSessionId` remains the primary persisted identity [EVIDENCE: replay suite asserts the persisted state keeps `claudeSessionId` for the active session.]
- [x] CHK-013 [P1] `speckitSessionId` remains nullable rather than becoming a forced primary contract in this packet [EVIDENCE: `HookState.speckitSessionId` is nullable and tests assert `null` by default.]
- [x] CHK-014 [P0] No analytics reader, dashboard, or publication logic is introduced in the Stop writer lane [EVIDENCE: `session-stop.ts` keeps default autosave behavior, only writes additive metadata, and the runtime scope excludes analytics readers.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Replay harness isolates temp state and fails on out-of-bound writes [EVIDENCE: `createStopReplaySandbox()` enforces sandboxed `TMPDIR` and throws on touched paths outside the sandbox.]
- [x] CHK-021 [P0] One-pass Stop-path replay validation exists [EVIDENCE: `tests/hook-session-stop-replay.vitest.ts` validates first-pass producer persistence.]
- [x] CHK-022 [P0] Double-replay idempotency validation exists [EVIDENCE: `tests/hook-session-stop-replay.vitest.ts` runs the same transcript twice.]
- [x] CHK-023 [P0] Double replay proves stable session totals [EVIDENCE: replay suite asserts second-run metrics equal first-run metrics.]
- [x] CHK-024 [P0] Double replay proves no duplicate turn ingestion or duplicate producer markers [EVIDENCE: replay suite asserts second run parses 0 new messages and leaves exactly one state file.]
- [x] CHK-025 [P1] `session-prime.ts` remains unchanged in active scope or additive-safe only [EVIDENCE: `git diff --name-only -- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts .claude/settings.local.json` returned no changes.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No new network calls or external services are introduced [EVIDENCE: implementation is local-only TypeScript state and test infrastructure.]
- [x] CHK-031 [P0] Hook stdout contract remains unchanged [EVIDENCE: `session-stop.ts` still writes diagnostics to stderr only and emits no new stdout contract.]
- [x] CHK-032 [P1] Replay validation does not mutate live settings or live state outside the sandbox [EVIDENCE: replay harness disables autosave, uses isolated `TMPDIR`, and fails on out-of-bound touched paths.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `research.md` are synchronized [EVIDENCE: packet docs were updated together and strict validation passed.]
- [x] CHK-041 [P0] Packet language keeps `session_bootstrap()` and memory resume authoritative [EVIDENCE: spec, plan, research, and decision record still preserve bootstrap and memory resume authority.]
- [x] CHK-042 [P1] Historical phase-001 warning research is retained only as context, not active authority [EVIDENCE: `research.md` keeps phase-001 findings as upstream context only.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No runtime enablement files are added to active scope [EVIDENCE: `.claude/settings.local.json` and `session-prime.ts` remained unchanged.]
- [x] CHK-051 [P1] Scratch or temporary validation artifacts are cleaned before completion [EVIDENCE: no packet-local scratch or temp artifacts were left behind.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | [x]/17 |
| P1 Items | 8 | [x]/8 |
| P2 Items | 0 | [x]/0 |

**Verification Date**: 2026-04-08
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Decision record explains the re-scope from warning-consumer rollout to producer-first packet [EVIDENCE: ADR-001 documents the packet re-scope.]
- [x] CHK-101 [P0] Decision record preserves the writer/consumer boundary [EVIDENCE: ADR-001 keeps the active implementation boundary at `session-stop.ts` plus `hook-state.ts`.]
- [x] CHK-102 [P0] Decision record makes the FTS predecessor explicit [EVIDENCE: ADR-001 constraints and decision text call out the predecessor lane.]
- [x] CHK-103 [P0] Decision record defers `UserPromptSubmit`, SessionStart fast path, and settings mutation to later packets [EVIDENCE: ADR-001 decision and consequences sections defer those consumers.]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Packet performs no runtime rollout by itself [EVIDENCE: runtime scope stops at producer metadata and replay verification.]
- [x] CHK-121 [P0] Follow-on packet order is documented for later continuity work [EVIDENCE: dependency graph and research pointer list the follow-on order.]
- [x] CHK-122 [P1] Rollback section in `plan.md` matches the re-scoped packet [EVIDENCE: rollback keeps producer changes narrow and preserves the producer-only re-scope.]
<!-- /ANCHOR:deploy-ready -->
