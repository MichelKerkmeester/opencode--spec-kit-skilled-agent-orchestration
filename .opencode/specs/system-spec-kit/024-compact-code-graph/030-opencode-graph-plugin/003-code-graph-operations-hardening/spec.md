---
title: "Feature Specification: Code Graph Operations Hardening [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/003-code-graph-operations-hardening]"
description: "Harden the graph/runtime layer with clearer readiness semantics, doctor-style repair, export/import design, path identity rules, and safe previews after the transport boundary is stable."
trigger_phrases:
  - "code graph operations hardening"
  - "packet 030"
  - "level 3"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Code Graph Operations Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 3 added one reusable graph-operations hardening contract below the transport shell. The Level 3 repair keeps that shipped runtime scope intact and explains the portability and repair boundaries cleanly.

**Key Decisions**: Normalize readiness in one helper, reuse `memory_health` as the bounded repair surface, and use metadata-only previews instead of raw artifact dumps.

**Critical Dependencies**: The stable transport boundary from Phase 2 and the session-facing handlers that now emit `graphOps` output.

---

### Phase Context

This is **Phase 3 of 4** of the OpenCode Graph Plugin phased execution specification.

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-opencode-transport-adapter |
| **Successor** | 004-cross-runtime-startup-surfacing-parity |
| **Handoff Criteria** | The documented phase boundary, verification evidence, and Level 3 artifacts are sufficient for packet recovery and successor review. |

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-03 |
| **Branch** | `main` |
| **Parent Spec** | `030-opencode-graph-plugin` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The additional research showed that the current graph runtime is good at compact context generation but still thin on durability, portability, and integrity operations. Readiness semantics were inconsistent, raw DB export/import was unsafe, and metadata-only preview discipline was missing or under-specified.

### Purpose
Implement the packet-local graph/runtime hardening track that lands after the transport shell is stable, so the layer beneath it becomes more trustworthy and portable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Readiness and stale-state reporting consistency
- Doctor-style repair guidance for graph/runtime integrity
- Export/import design boundaries for graph-adjacent runtime state
- Path identity and worktree-aware safety rules
- Metadata-only preview behavior for non-text artifacts

### Out of Scope
- Building a second memory backend
- Replacing the structural graph model
- Reworking the transport adapter contract

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts` | Create | Implement the graph operations hardening contract and preview helper |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts` | Modify | Emit graph ops output for health surfaces |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` | Modify | Emit graph ops output for resume surfaces |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Modify | Emit graph ops output for bootstrap surfaces |
| `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts` | Create | Verify the graph-ops hardening helper |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Readiness semantics are unified | Session health, resume, and bootstrap use a consistent `ready/stale/missing` model |
| REQ-002 | Graph integrity repair is specified | Doctor-style checks and repair boundaries are documented |
| REQ-003 | Export/import is not treated as a raw DB dump | Phase docs define portable identity, collision handling, and post-import repair expectations |
| REQ-004 | Safe previews are bounded | Non-text artifacts are represented as metadata-only previews |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Path and worktree identity rules are explicit | Relative and absolute path handling are documented clearly |
| REQ-006 | Transport boundary stays intact | Graph hardening remains below the OpenCode transport shell |
| REQ-007 | Session-facing handlers emit graphOps output | Health, resume, and bootstrap surfaces all expose the hardening contract |
| REQ-008 | Phase docs reflect Level 3 closeout accurately | Checklist, ADR, and implementation summary align to the same delivered runtime scope |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The runtime hardening work is clearly separated from the adapter shell and the memory backend.
- **SC-002**: Readiness, repair, and export/import responsibilities are concrete enough for later operations work.
- **SC-003**: Future portability work no longer depends on raw path-derived assumptions alone.
- **SC-004**: Phase 3 now stands as a complete Level 3 artifact instead of a Level 1 phase stub.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
### Acceptance Scenarios

**Given** a session surface needs structural readiness guidance, **when** the graph-ops helper runs, **then** it emits one canonical readiness model regardless of whether the surface is health, resume, or bootstrap.

**Given** a runtime wants graph portability guidance, **when** the graph-ops helper runs, **then** it returns doctor guidance, export/import boundaries, and preview expectations without replacing the graph backend.

**Given** a non-text artifact is encountered, **when** the helper prepares preview data, **then** it emits metadata only instead of raw binary content.

**Given** a future import/export flow is considered, **when** the phase docs are read, **then** they explicitly reject raw DB dumps as the portability strategy.

**Given** the transport phase is already complete, **when** Phase 3 is reviewed, **then** it leaves hook mapping untouched and works beneath that layer.

**Given** strict validation is rerun later, **when** Phase 3 docs are checked, **then** the phase validates as clean Level 3 documentation.

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Stable adapter boundary from Phase 2 | High | Keep Phase 3 below the transport shell |
| Risk | Scope expands into general memory durability | High | Keep long-memory backend work explicitly out of packet 030 |
| Risk | Export/import design ignores current path identity limits | Medium | Make portable identity and repair requirements explicit |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Readiness output should be compact enough for session surfaces to reuse directly.
- **NFR-P02**: Preview output should stay metadata-only so it does not flood runtime context.

### Security
- **NFR-S01**: No raw binary artifact dumps are introduced.
- **NFR-S02**: Portability guidance must not weaken workspace boundary rules.

### Reliability
- **NFR-R01**: Health, resume, and bootstrap stay aligned on the same readiness semantics.
- **NFR-R02**: Phase 3 docs validate cleanly as a standalone Level 3 phase artifact.

---

## 8. EDGE CASES

### Data Boundaries
- Missing graph index still yields a structured `missing` readiness state.
- Imported or rebuilt state remains explicit even before full portability tooling exists.

### Error Scenarios
- Failed repair guidance must not present itself as an executed repair.
- Unsafe artifact previews must never surface raw content.

### State Transitions
- Fresh graph scan can move state from missing to ready.
- Imported or rebuilt graph state remains provisional until later operations confirm it.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Touches multiple handler outputs and operational boundaries |
| Risk | 19/25 | Portability and trust-state mistakes would mislead later follow-ons |
| Research | 17/20 | Built directly from the extended packet research |
| Multi-Agent | 4/15 | One graph-ops workstream |
| Coordination | 8/15 | Requires transport-boundary discipline and session-surface alignment |
| **Total** | **68/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Graph hardening drifts into transport redesign | H | L | Keep transport-only wording in Phase 2 and graph-only wording in Phase 3 |
| R-002 | Portability guidance implies raw DB export is safe | H | M | Document collision handling and repair expectations explicitly |

---

## 11. USER STORIES

### US-001: Trust Readiness Output (Priority: P0)

**As a maintainer, I want health, resume, and bootstrap to agree on graph readiness, so that I can trust session guidance.**

**Acceptance Criteria**:
1. Given a graph is stale, when any session-facing handler emits `graphOps`, then it uses the same stale-state wording.
2. Given a graph is missing, when a session starts, then the recommended repair action is explicit.

---

### US-002: Keep Artifact Preview Safe (Priority: P1)

**As a maintainer, I want non-text previews to stay metadata-only, so that the runtime does not leak or bloat context with raw artifacts.**

**Acceptance Criteria**:
1. Given a non-text artifact is encountered, when preview data is produced, then only metadata is shown.
2. Given future portability work follows later, when this phase is reviewed, then path identity and repair rules are already explicit.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- No blocking open questions remain for Phase 3.
- The remaining follow-on is a future operational tool surface outside packet 030, not a Phase 3 gap.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Packet**: See `../spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
