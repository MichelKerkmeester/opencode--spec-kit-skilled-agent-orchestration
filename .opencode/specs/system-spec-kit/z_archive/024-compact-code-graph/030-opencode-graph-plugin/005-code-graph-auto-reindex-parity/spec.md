---
title: "Feature [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/005-code-graph-auto-reindex-parity/spec]"
description: "Implements the Phase 5 runtime pass that brings code graph on-use freshness behavior closer to CocoIndex without removing existing debounce, timeout, and stale-reporting safety rails."
trigger_phrases:
  - "code graph auto reindex parity"
  - "phase 5"
  - "cocoindex parity"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/005-code-graph-auto-reindex-parity"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: Code Graph Auto-Reindex Parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 5 is the bounded follow-on under packet `030-opencode-graph-plugin` that is now implemented. Its goal was to make structural graph freshness behave more like CocoIndex: detect staleness on use, perform bounded inline refresh when safe, including small post-commit drift, and fall back to explicit stale reporting when refresh would be too expensive or risky.

**Key Decisions**: Reuse the existing `ensureCodeGraphReady()` engine, keep debounce and timeout protections, and mimic CocoIndex behavior without turning code graph reads into unbounded rescans.

**Critical Dependencies**: `ensure-ready.ts`, `code_graph_context`, `code_graph_query`, structural freshness reporting, and the packet-030 graph-ops contract.

---

### Phase Context

This is **Phase 5** of the OpenCode Graph Plugin phased execution specification.

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 5 |
| **Predecessor** | `004-cross-runtime-startup-surfacing-parity` |
| **Successor** | `031-copilot-startup-hook-wiring` |
| **Handoff Criteria** | Runtime behavior, verification, and packet truth-sync are sufficient for future recovery and follow-on review. |

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-04 |
| **Branch** | `main` |
| **Parent Spec** | `030-opencode-graph-plugin` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code graph already has an auto-readiness engine, but the main structural read paths currently call it with inline indexing disabled. That means the system can detect stale or missing graph state on use, yet still leave the user to run `code_graph_scan` manually. CocoIndex behaves closer to the desired UX because its MCP `search` path refreshes incrementally on the first query by default.

### Purpose
Bring code graph on-use freshness behavior closer to CocoIndex while preserving structural safety. The desired result is: small stale sets refresh inline, larger stale states report clearly and recommend manual rescan, and all of it remains bounded by debounce, timeout, and explicit readiness signaling.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reuse `ensureCodeGraphReady()` as the canonical auto-refresh engine
- Enable bounded inline auto-reindex for `code_graph_context` and `code_graph_query`
- Preserve debounce and timeout safeguards
- Keep selective reindex for small stale sets, including safe post-commit HEAD drift, and fallback stale-reporting for expensive refreshes
- Align code graph UX language with CocoIndex-style “refresh on first use” behavior where truthful
- Add tests proving the inline/non-inline boundaries

### Out of Scope
- Replacing the structural graph model
- Turning every stale condition into an inline full rescan
- Reworking CocoIndex itself
- Changing packet 030 phases 001-004 beyond parent-packet follow-on references

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts` | Modify | Tune bounded auto-reindex decisions and return metadata |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts` | Modify | Allow safe inline refresh behavior on read |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts` | Modify | Allow safe inline refresh behavior on structural queries |
| `.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts` | Modify | Cover bounded inline refresh decisions |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts` | Modify | Verify query path behavior when graph is stale |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts*.vitest.ts` | Modify | Verify context path behavior when graph is stale |
| `../spec.md` | Modify | Record Phase 5 as the completed bounded follow-on |
| `../plan.md` | Modify | Add the new follow-on implementation track |
| `../tasks.md` | Modify | Close the Phase 5 packet tasks after implementation |
| `../checklist.md` | Modify | Reflect that Phase 5 is implemented and verified |
| `../decision-record.md` | Modify | Record the follow-on decision boundary |
| `../implementation-summary.md` | Modify | Note that Phase 5 is now shipped as the bounded auto-refresh pass |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | On-use stale detection stays automatic | Structural reads still detect empty/stale/fresh graph state on use |
| REQ-002 | Small stale sets can refresh inline | `code_graph_context` and `code_graph_query` can trigger bounded inline reindex when the refresh cost is within the defined safety limit |
| REQ-003 | Expensive refreshes do not block reads indefinitely | Full rescans or oversized stale sets return stale-readiness guidance instead of unbounded inline work |
| REQ-004 | CocoIndex parity stays truthful | Docs and runtime behavior mirror CocoIndex’s “refresh on first use” idea without claiming exact same implementation when they differ |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Existing debounce and timeout protections remain active | `ensureCodeGraphReady()` still debounces checks and times out auto-index work |
| REQ-006 | Readiness metadata remains explicit | Handlers still surface whether the graph was fresh, stale, selectively refreshed, or left stale intentionally |
| REQ-007 | Query and context paths behave consistently | `code_graph_query` and `code_graph_context` use the same bounded-inline policy |
| REQ-008 | Tests cover both inline and non-inline branches | Handler and ensure-ready tests prove safe refresh and safe refusal paths |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Small stale graph changes, including safe post-commit drift, refresh automatically during structural queries.
- **SC-002**: Large stale graph states remain bounded and clearly reported instead of triggering unsafe inline full rescans.
- **SC-003**: Query/context users experience code graph freshness closer to CocoIndex’s first-use refresh behavior.
- **SC-004**: Parent packet docs truthfully show all completed phases through Phase 5 while preserving the bounded read-path safety limits.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
### Acceptance Scenarios

**Given** the graph is fresh, **when** a structural query runs, **then** no reindex work occurs and the query returns immediately.

**Given** a small number of tracked files are stale, **when** `code_graph_query` or `code_graph_context` runs, **then** the handler performs bounded inline selective reindex and returns fresh structural data.

**Given** git `HEAD` changed but only a small number of tracked files are stale on disk, **when** a structural read runs, **then** the handler still takes the selective inline reindex path instead of forcing read-time full-scan refusal.

**Given** the stale set exceeds the safe inline threshold, **when** a structural query runs, **then** the handler skips inline full rescan and returns stale-readiness guidance plus the recommended next action.

**Given** the code graph is empty, **when** a structural read runs, **then** the response makes the missing-state explicit and recommends `code_graph_scan`.

**Given** the graph freshness check is triggered repeatedly during rapid consecutive reads, **when** the handlers run within the debounce window, **then** they reuse the existing readiness decision instead of thrashing the indexer.

**Given** packet 030 is reviewed later, **when** the parent packet docs are opened, **then** Phase 5 is visible as a completed bounded follow-on rather than a queued gap.

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `ensure-ready.ts` auto-index engine | High | Reuse it rather than inventing a parallel freshness path |
| Dependency | Existing structural handlers | High | Keep changes localized to context/query read behavior |
| Risk | Inline reindex makes structural queries feel slow | High | Keep debounce, timeout, and small-stale-set limits |
| Risk | Docs overclaim exact CocoIndex equivalence | Medium | Use “mimics” or “parity” language only where behavior matches |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Inline auto-reindex stays bounded by the existing timeout guard.
- **NFR-P02**: Fresh graph reads should not do extra work.

### Security
- **NFR-S01**: No path-expansion or root-dir protections are weakened.
- **NFR-S02**: Inline reindex must stay workspace-bounded.

### Reliability
- **NFR-R01**: Read handlers must still return a valid response even if inline refresh is skipped or times out.
- **NFR-R02**: Debounce prevents repeated stale checks from thrashing the indexer.

---

## 8. EDGE CASES

### Data Boundaries
- Empty graph should remain a clear `missing`/`empty` case, not a silent no-op.
- Deleted tracked files should still be cleaned up even when inline reindex is skipped.

### Error Scenarios
- Inline reindex timeout must not break the structural read response.
- Broad branch-switch or post-commit full-scan detection should not silently run if the safe-inline policy says no.

### State Transitions
- `fresh` -> no reindex
- `stale` with small delta -> selective inline reindex
- `stale` with large delta -> stale guidance, no inline full rescan
- `empty` -> explicit scan guidance

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 21/25 | Runtime code, tests, and parent packet truth-sync |
| Risk | 21/25 | Read-path latency and stale/fresh correctness both matter |
| Research | 17/20 | Backed by packet-030 research and direct code inspection |
| Multi-Agent | 4/15 | One focused implementation stream |
| Coordination | 8/15 | Parent-child packet sync plus handler/test alignment |
| **Total** | **71/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Structural queries get slower due to inline reindex | H | M | Bound inline refresh to small stale sets and existing timeout |
| R-002 | Full rescans accidentally happen on read paths | H | L | Keep explicit refusal path for large stale sets and empty/full-scan states |
| R-003 | Packet docs overstate Phase 5 beyond its bounded implementation | M | M | Keep the docs explicit that inline selective refresh landed, but inline full scans still remain disabled on read paths |

---

## 11. USER STORIES

### US-001: Fresh Structural Queries Without Manual Rescan (Priority: P0)

**As a** developer using structural queries, **I want** small stale graph drift to refresh automatically, **so that** I do not have to manually run `code_graph_scan` for normal day-to-day changes.

**Acceptance Criteria**:
1. Given a handful of files changed, including a small post-commit delta, when I call `code_graph_query`, then the graph refreshes inline and the query returns current results.
2. Given the graph is already fresh, when I call `code_graph_context`, then the handler skips reindex work and returns quickly.

### US-002: Safe Stale Guidance for Expensive Refreshes (Priority: P1)

**As a** maintainer, **I want** large or risky graph refreshes to be surfaced clearly instead of forced inline, **so that** I retain control over expensive rescans.

**Acceptance Criteria**:
1. Given the graph is stale due to a large branch change, when a structural read runs, then the response explains the stale state and recommends `code_graph_scan`.
2. Given inline refresh would exceed the safe threshold, when the handler runs, then it does not trigger an inline full rescan.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- The inline-safe threshold still needs final implementation calibration against the current `ensureCodeGraphReady()` timing and stale-set metadata.
- CocoIndex-style first-use refresh parity should stay behaviorally similar, not wording-identical, unless the runtime flow ends up matching more closely than expected.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Packet**: See `../spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
