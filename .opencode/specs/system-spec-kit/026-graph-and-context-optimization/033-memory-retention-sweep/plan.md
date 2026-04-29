---
title: "Plan: Memory Retention Sweep"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Level 2 plan for retention sweep implementation and validation."
trigger_phrases:
  - "033 retention plan"
  - "memory retention sweep plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep"
    last_updated_at: "2026-04-29T14:03:15Z"
    last_updated_by: "cli-codex"
    recent_action: "Retention sweep complete"
    next_safe_action: "Orchestrator commit"
    blockers: []
    completion_pct: 100
---
# Plan: Memory Retention Sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, better-sqlite3, Vitest |
| **Framework** | system-spec-kit MCP server |
| **Scope** | Retention cleanup over indexed memory rows |
| **Testing** | `npm run build`, targeted Vitest, strict spec validator |
| **Runtime Code** | Handler, scheduler, MCP tool registration |

### Overview

Implement one retention sweep core used by both manual MCP invocation and the scheduled session-manager interval. Deletions reuse the existing vector-index deletion path so FTS/vector/ancillary cleanup stays consistent with normal memory deletion.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Packet folder identified. [EVIDENCE: user requested `033-memory-retention-sweep`]
- [x] Source research identified. [EVIDENCE: `../013-automation-reality-supplemental-research/research/research-report.md:149-161`]
- [x] Deletion path identified. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:575-623`]

### Definition of Done

- [x] Packet docs created with required metadata. [EVIDENCE: seven packet files exist]
- [x] Sweep implementation and MCP tool are complete. [EVIDENCE: `memory-retention-sweep.ts` and `memory_retention_sweep` registration]
- [x] Scheduled interval is enabled by default and configurable. [EVIDENCE: `session-manager.ts:204-290`]
- [x] Targeted test passes. [EVIDENCE: `npx vitest run memory-retention-sweep`]
- [x] MCP server build succeeds. [EVIDENCE: `npm run build`]
- [x] Strict validator exits 0. [EVIDENCE: final `validate.sh --strict` run]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Use a small reusable retention module/handler that accepts a database handle and `dryRun`. Manual MCP calls obtain the active vector-index DB; session-manager startup passes its initialized DB to the same sweep.

### Key Components

- **Retention sweep handler**: selects expired rows, deletes them through `deleteMemory`, writes governance audit/history/ledger entries, and returns summary.
- **Scheduler**: dedicated interval in `session-manager.ts` with `SPECKIT_RETENTION_SWEEP` and `SPECKIT_RETENTION_SWEEP_INTERVAL_MS`.
- **Tool registration**: `tool-schemas.ts`, `tools/memory-tools.ts`, `tools/types.ts`, and handler exports.

### Data Flow

`memory_index.delete_after` -> expired candidate query -> dry-run candidate report or transactional delete -> history/governance/ledger audit -> summary.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create seven Level 2 packet files.
- [x] Initialize continuity at 5%.

### Phase 2: Implementation
- [x] Add retention sweep handler/core.
- [x] Register `memory_retention_sweep` schema and dispatch.
- [x] Hook scheduled sweep into session-manager without touching session cleanup behavior.
- [x] Add targeted Vitest coverage.
- [x] Update README, ENV reference, and governance JSDoc/comment.

### Phase 3: Validation
- [x] Run targeted Vitest file.
- [x] Run MCP server build.
- [x] Run strict packet validator.
- [x] Update checklist and implementation summary to complete.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/integration | Retention behavior and audit rows | `npx vitest run memory-retention-sweep` |
| TypeScript build | Compile all MCP server code | `npm run build` |
| Packet validation | Required docs, anchors, metadata | `validate.sh --strict` |
| Scope review | Ensure only requested surfaces changed | `git diff --name-only` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 013 research report | Internal | Available | Source-of-truth for P1-2 |
| 031 doc truth pass | Packet | Complete dependency | Upstream remediation chain |
| vector-index deletion path | Runtime | Available | Required for index integrity |
| governance audit | Runtime | Available | Required audit trail |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Build or targeted tests fail in a way that cannot be repaired within packet scope.
- **Procedure**: Revert packet 033 runtime/doc edits only; leave unrelated working-tree state untouched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Implementation) -> Phase 3 (Validation)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | User packet contract | Implementation |
| Implementation | Source code reads | Validation |
| Validation | Completed runtime/docs edits | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Implementation | Medium | 1-2 hours |
| Validation | Medium | 20-40 minutes |
| **Total** | | **~2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Existing deletion helpers read.
- [x] Existing scheduler read.
- [x] Existing tool registration read.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Runtime diff revert; retention deletions are not run during tests against production DB.
<!-- /ANCHOR:enhanced-rollback -->
