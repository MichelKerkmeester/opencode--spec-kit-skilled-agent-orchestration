---
title: "Implementation Plan: Code Graph Auto-Reindex Parity [02--system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/005-code-graph-auto-reindex-parity]"
description: "Implements the bounded runtime work that makes code graph freshness on use behave more like CocoIndex while preserving selective-inline safety limits."
trigger_phrases:
  - "code graph auto reindex parity plan"
  - "phase 5 plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Code Graph Auto-Reindex Parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript runtime handlers, tests, Markdown, JSON |
| **Framework** | Packet 024 compact code graph runtime with CocoIndex-style freshness parity |
| **Storage** | Existing packet 030 folder plus `mcp_server` runtime files |
| **Testing** | `npx tsc --noEmit`, targeted `vitest`, strict packet validation |

### Overview
This phase makes the structural graph behave more like CocoIndex on first use. The main implementation strategy is to reuse `ensureCodeGraphReady()` and let read paths selectively refresh when the stale set is small enough, including safe post-commit HEAD drift, while keeping explicit stale guidance when refresh would be too large or too slow.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem and scope are documented
- [x] Existing code path for freshness detection is identified
- [x] Safety constraints are explicit

### Definition of Done
- [x] Read handlers use bounded inline refresh where safe
- [x] Tests prove inline refresh and safe refusal paths
- [x] Parent packet docs are truth-synced
- [x] Strict packet validation passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bounded inline freshness parity

### Key Components
- **`ensureCodeGraphReady()`**: canonical freshness detector and refresh engine
- **`code_graph_query` / `code_graph_context` handlers**: main read paths that need bounded inline behavior
- **Safety rails**: debounce, timeout, selective/full-scan split, stale-readiness guidance
- **Parent packet truth-sync**: records Phase 5 as delivered and verified after runtime work lands

### Data Flow
On structural read, the handler checks graph readiness. If the graph is fresh, it proceeds with no extra work. If the graph is stale with a small delta, it allows bounded selective inline reindex. If the stale condition implies a full rescan or expensive refresh, it returns the structural response with explicit stale guidance and recommended follow-up.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Freshness Policy
- [x] Confirm the safe inline threshold and reuse the existing timeout/debounce boundaries
- [x] Define when stale detection should refresh inline versus only report guidance

### Phase 2: Runtime Wiring
- [x] Update `code_graph_context` and `code_graph_query` to allow bounded inline refresh
- [x] Preserve safe behavior for empty graphs, broad full rescans, broad branch changes, and timeouts while allowing small post-commit drift to self-heal inline

### Phase 3: Verification and Truth-Sync
- [x] Add or update tests for fresh, selective-inline, and stale-report-only paths
- [x] Update parent packet docs to record the follow-on honestly
- [x] Rerun strict packet validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Engine Tests | `ensureCodeGraphReady()` inline versus non-inline decisions | `tests/ensure-ready.vitest.ts` |
| Handler Tests | `code_graph_query` and `code_graph_context` behavior under stale graph states | targeted `vitest` suites |
| Typecheck | Runtime code remains valid after handler contract changes | `npx tsc --noEmit` |
| Packet Validation | Phase and parent docs stay validator-clean | strict recursive `validate.sh` |
<!-- /ANCHOR:testing -->

---

### AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm runtime edits stay inside the structural graph freshness path.
- Confirm CocoIndex parity claims stay behavior-based and truthful.
- Confirm large stale states still remain bounded.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| `RUNTIME-SCOPE` | Touch only structural freshness/read-path files plus packet-local docs. |
| `SAFETY-FIRST` | Never remove debounce, timeout, or workspace-bounded protections. |
| `TRUTH-FIRST` | Do not claim exact CocoIndex equivalence where behavior still differs. |

### Status Reporting Format
- `in-progress`: note which runtime or packet area is active.
- `blocked`: note the stale/full-rescan safety conflict or failing test.
- `completed`: note changed files and the exact verification commands.

### Blocked Task Protocol
- If inline refresh becomes too broad, keep the task open and revert to stale-report-only behavior.
- If tests expose unsafe full-rescan behavior on read paths, treat that as a blocker.

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `ensure-ready.ts` | Internal | Green | No canonical freshness engine to extend |
| Structural handler tests | Internal | Green | Read-path safety cannot be proven |
| Parent packet 030 docs | Internal | Green | Follow-on phase would not be visible in packet recovery |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Inline refresh broadens into unsafe full rescans, latency spikes, or failing handler tests.
- **Procedure**: Restore `allowInlineIndex: false` behavior on read paths, keep stale-readiness guidance, and revert the Phase 5 packet wording from delivered back to bounded-unshipped status.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Freshness Policy ──► Runtime Wiring ──► Verification and Truth-Sync
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Freshness Policy | Existing ensure-ready engine | Runtime Wiring |
| Runtime Wiring | Policy decisions | Verification |
| Verification and Truth-Sync | Runtime wiring | Phase closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Freshness Policy | Medium | 1 focused implementation pass |
| Runtime Wiring | Medium | 1-2 focused runtime/test passes |
| Verification and Truth-Sync | Medium | 1 verification pass |
| **Total** |  | **Active follow-on phase** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Existing safe behavior identified
- [x] Rollback path identified
- [x] Validation gate selected

### Rollback Procedure
1. Revert the bounded inline refresh wiring in structural handlers.
2. Restore the previous read-path safety behavior.
3. Rerun the targeted handler and ensure-ready tests.
4. Keep packet docs accurate about what did or did not ship.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: restore handler logic and re-run targeted checks
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
ensure-ready engine ──► bounded inline policy ──► structural read handlers ──► tests and packet truth-sync
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Freshness Engine Reuse | Existing `ensureCodeGraphReady()` | Canonical decision path | Handler wiring |
| Handler Wiring | Engine reuse + policy | Bounded inline refresh | Verification |
| Verification | Handler wiring + tests | Evidence-backed phase closeout | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Define bounded inline policy - completed - CRITICAL
2. Wire structural handlers to the policy - completed - CRITICAL
3. Prove fresh/selective/stale-refusal behavior in tests - completed - CRITICAL
4. Truth-sync parent packet docs - completed - CRITICAL

**Total Critical Path**: One runtime implementation pass plus one verification pass
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Freshness policy locked | Inline vs non-inline rules documented and accepted | Completed |
| M2 | Runtime wiring landed | Structural read paths mimic CocoIndex-style first-use refresh where safe | Completed |
| M3 | Verification complete | Tests and packet validation pass | Completed |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Reuse the Existing Freshness Engine

**Status**: Proposed

**Context**: The code graph already has a freshness detector and inline indexing engine. The main gap is that structural read paths currently disable inline indexing.

**Decision**: Reuse `ensureCodeGraphReady()` and change the read-path policy rather than inventing a parallel auto-refresh subsystem.
