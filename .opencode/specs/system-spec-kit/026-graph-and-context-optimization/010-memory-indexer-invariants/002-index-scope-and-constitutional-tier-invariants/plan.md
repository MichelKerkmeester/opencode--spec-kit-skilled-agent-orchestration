---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
title: "Implementation Plan: Index Scope and Constitutional Tier Invariants"
description: "Implement one shared index-scope helper, wire it into memory and code-graph scanning, add a save-time constitutional tier gate, then clean the polluted SQLite state with a transactional maintenance CLI."
trigger_phrases:
  - "026/011 plan"
  - "index scope invariants plan"
  - "constitutional tier cleanup plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/002-index-scope-and-constitutional-tier-invariants"
    last_updated_at: "2026-04-24T14:10:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Wave-2 remediation complete"
    next_safe_action: "Run pass-3 deep-review to confirm zero remaining P0/P1 scope debt, or close packet"
    status: "wave-2-remediation-complete"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The memory invariant enforcement point will be shared helper plus save-time guard."
      - "The constitutional downgrade target is important."
---
# Implementation Plan: Index Scope and Constitutional Tier Invariants

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js 20+, SQLite |
| **Framework** | MCP server plus script package |
| **Storage** | `better-sqlite3` + `sqlite-vec` Voyage-4 DB |
| **Testing** | Vitest |

### Overview
This packet introduced one shared path-scope module and used it as the lowest-risk source of truth for memory and code-graph exclusions. Wave-1 closed the release-blocking bypasses, and Wave-2 completed the deferred hardening: cleanup auditing, SSOT unification, realpath enforcement, walker caps, and the final operator/spec documentation refresh.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (or documented carryover failures isolated from this packet)
- [x] Docs updated (spec/plan/tasks/checklist/decision record/implementation summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared policy helper plus defense-in-depth enforcement

### Key Components
- **`lib/utils/index-scope.ts`**: Canonical path-segment exclusions for memory and code graph.
- **Memory discovery and classification**: `memory-index-discovery.ts`, `spec-doc-paths.ts`, and `memory-parser.ts` align discovery and admissibility.
- **Save pipeline guard**: `memory-save.ts` rejects excluded paths and downgrades invalid constitutional tiers.
- **Cleanup CLI**: `scripts/memory/cleanup-index-scope-violations.ts` removes or rewrites polluted rows and verifies invariants.

### Data Flow
Path candidates are normalized once and checked against shared segment rules before discovery or save continues. Parsed saves keep their normal tier extraction flow, then a save-time gate adjusts invalid constitutional values before persistence. Existing DB pollution is handled separately by a maintenance CLI that deletes invalid rows, rewrites duplicate references, and prints before/after counts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Packet and Shared Helper
- [x] Create the Level 3 packet and parent metadata updates
- [x] Add `lib/utils/index-scope.ts`
- [x] Decide and document helper semantics in `decision-record.md`

### Phase 2: Memory and Code-Graph Enforcement
- [x] Wire memory discovery, spec-doc classification, and `isMemoryFile()` to the shared helper
- [x] Add save-time path rejection plus constitutional tier downgrade
- [x] Wire code-graph recursive and specific-file scans to the shared helper while preserving existing exclusions

### Phase 3: Cleanup and Verification
- [x] Add focused Vitest coverage
- [x] Add cleanup CLI and README docs
- [x] Run validation, build, tests, dry-run/apply/verify cleanup, and capture the results
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `shouldIndexForMemory`, `shouldIndexForCodeGraph`, `isMemoryFile()` constitutional README exclusion behavior | Vitest |
| Integration | Memory scan discovery skips `z_future`; save path downgrades invalid constitutional tiers and preserves valid ones | Vitest with temp fixtures/mocks |
| Manual | Cleanup dry-run, apply, verify against the live Voyage-4 DB | Node CLI + SQLite-backed inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `better-sqlite3` + `sqlite-vec` runtime load | Internal | Green | Cleanup CLI cannot inspect or mutate the Voyage-4 DB |
| Existing `mcp_server` typecheck/build | Internal | Green | Dist outputs would not ship the helper or cleanup script |
| Focused Vitest harnesses for memory save and scanner discovery | Internal | Green | Regression proof would be weak |
| Broader `test:core` baseline | Internal | Yellow | Carryover failures may need documentation even if focused tests pass |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Typecheck/build regressions, invariant helper false positives, or cleanup verification mismatch.
- **Procedure**: Revert the helper wiring and cleanup CLI changes, restore the DB from checkpoint or backup if cleanup was already applied, then rerun focused tests to confirm the previous behavior.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌───────────────────────┐
│ Packet + Metadata     │
└──────────┬────────────┘
           ▼
┌───────────────────────┐
│ Shared Index Scope    │
│ Helper                │
└───────┬─────────┬─────┘
        ▼         ▼
┌──────────────┐  ┌─────────────────┐
│ Memory Paths │  │ Code Graph Scan │
└──────┬───────┘  └────────┬────────┘
       ▼                   ▼
┌────────────────────────────────────┐
│ Tests + Cleanup CLI + Verification │
└────────────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Packet docs | Investigation evidence | Accepted scope and decisions | Helper implementation |
| Shared helper | Investigation evidence | Canonical exclusion logic | Memory and code-graph wiring |
| Memory/code-graph wiring | Shared helper | Enforced invariants in runtime paths | Focused verification |
| Cleanup CLI | Shared helper + schema inspection | Removed pollution and verify mode | Final verification summary |
<!-- /ANCHOR:dependency-graph -->
