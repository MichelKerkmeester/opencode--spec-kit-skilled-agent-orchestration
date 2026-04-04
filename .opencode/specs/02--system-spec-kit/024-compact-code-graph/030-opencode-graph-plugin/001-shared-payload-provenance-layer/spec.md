---
title: "Feature Specification: Shared Payload and Provenance Layer [02--system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/001-shared-payload-provenance-layer]"
description: "Define the shared runtime contract for compact payload composition, provenance, trust state, and compaction-safe handoff before any OpenCode adapter work begins."
trigger_phrases:
  - "shared payload and provenance layer"
  - "packet 030"
  - "level 3"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Shared Payload and Provenance Layer

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 1 turned a research recommendation into runtime code by introducing one shared payload/provenance contract across startup, recovery, and compaction. The Level 3 repair keeps that same shipped scope intact and adds the architecture context needed for future recovery and review.

**Key Decisions**: Use one shared payload module instead of surface-specific payload logic, and enforce anti-feedback guardrails before the transport layer consumes compaction output.

**Critical Dependencies**: Packet 030 research synthesis, existing lifecycle handlers, and the compaction hooks that persist cached payload metadata.

---

### Phase Context

This is **Phase 1 of 4** of the OpenCode Graph Plugin phased execution specification.

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-opencode-transport-adapter |
| **Handoff Criteria** | The documented phase boundary, verification evidence, and Level 3 artifacts are sufficient for packet recovery and successor review. |

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-03 |
| **Branch** | `main` |
| **Parent Spec** | `030-opencode-graph-plugin` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research found that the real prerequisite is not the OpenCode adapter shell itself, but a shared payload/provenance composition layer. Without that layer, an adapter would either duplicate retrieval logic or invent its own incomplete trust and budgeting rules.

### Purpose
Define the shared contract that every later packet-030 runtime surface should consume, so transport and graph operations can stay thin and consistent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define shared payload types for startup, message-transform, and compaction injections
- Define provenance fields and trust-state semantics
- Define pre-merge selection rules and anti-feedback compaction boundaries
- Wire the shared contract into startup, resume, health, bootstrap, and compaction producers
- Document the handoff criteria for later packet phases

### Out of Scope
- Registering OpenCode hooks
- Building export/import tooling
- Building doctor/repair tooling

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/context/shared-payload.ts` | Create | Shared payload/provenance envelope, trust-state helpers, and pre-merge selection metadata |
| `mcp_server/lib/code-graph/startup-brief.ts` | Modify | Emit a shared startup payload contract alongside the existing startup brief |
| `mcp_server/lib/session/session-snapshot.ts` | Modify | Add structural-context provenance to the shared structural bootstrap contract |
| `mcp_server/handlers/session-resume.ts` | Modify | Emit a shared resume payload contract |
| `mcp_server/handlers/session-health.ts` | Modify | Emit a shared health payload contract |
| `mcp_server/handlers/session-bootstrap.ts` | Modify | Emit a shared bootstrap payload contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared payload contract exists | Startup, message, and compaction payload shapes are defined and emitted by runtime producers |
| REQ-002 | Provenance and trust states are explicit | Live, cached, stale, imported, rebuilt, and rehomed states are documented and represented consistently |
| REQ-003 | Compaction avoids self-reinforcing summary loops | Anti-feedback filtering is applied before new compact context is built |
| REQ-004 | Shared contract is used by lifecycle handlers | Startup, resume, health, and bootstrap outputs expose the common payload/provenance model |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Pre-merge candidate selection is documented | Phase docs explain why selection happens before merge |
| REQ-006 | Recovery surfaces preserve cached payload provenance | Hook-state and recovery messaging expose cached payload markers cleanly |
| REQ-007 | Successor phases can consume the contract directly | Transport and graph-op phases do not redefine payload semantics |
| REQ-008 | Phase docs reflect Level 3 closeout accurately | Checklist, ADR, and implementation summary all align to the same delivered runtime scope |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The shared runtime contract is clear enough to unblock Phase 2 without redesign.
- **SC-002**: Provenance semantics distinguish source from trust state instead of flattening them.
- **SC-003**: Compaction rules clearly separate continuity notes from current-turn retrieval.
- **SC-004**: Phase 1 now stands as a complete Level 3 artifact instead of a Level 1 phase stub.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
### Acceptance Scenarios

**Given** startup, resume, health, bootstrap, and compaction surfaces emit payloads, **when** Phase 2 consumes them, **then** it can reuse one shared contract instead of redefining payload semantics.

**Given** cached compact payloads are recovered during a later session, **when** new compaction input is prepared, **then** anti-feedback guards remove wrapper noise before pre-merge selection happens.

**Given** a maintainer inspects shared-payload.ts, **when** they compare it against the phase docs, **then** the common envelope and trust-state vocabulary line up.

**Given** a recovery surface emits cached payload metadata, **when** the user resumes a session, **then** provenance markers still explain where the recovered content came from.

**Given** the graph-ops phase follows later, **when** it reads the handoff criteria, **then** it does not need to redefine shared payload semantics.

**Given** strict validation is rerun later, **when** Phase 1 docs are checked, **then** the phase validates as clean Level 3 documentation.

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Parent research synthesis | High | Keep the phase focused on codifying the locked findings, not re-researching them |
| Risk | Contract too vague for the adapter | High | Require explicit payload fields and handoff criteria |
| Risk | Phase grows into transport or graph implementation | Medium | Keep transport and graph-ops work explicitly out of scope |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The shared contract must stay compact enough for runtime surfaces to reuse without duplicating logic.
- **NFR-P02**: The phase docs must make successor handoff clear in one read.

### Security
- **NFR-S01**: No secrets or credentials appear in payload examples or evidence.
- **NFR-S02**: The phase keeps external reference material out of the runtime contract.

### Reliability
- **NFR-R01**: Lifecycle producers stay internally consistent under the shared contract.
- **NFR-R02**: Phase 1 docs validate cleanly as a standalone Level 3 phase artifact.

---

## 8. EDGE CASES

### Data Boundaries
- Empty startup payload still renders a valid shared envelope.
- Missing graph or memory inputs still preserve provenance and trust-state fields.

### Error Scenarios
- Recovered compact wrapper lines must be stripped before compaction rebuild.
- Cached payload metadata must not be mistaken for live retrieval output.

### State Transitions
- Phase 1 complete, Phase 2 pending remains a supported transition.
- Cached-to-live trust-state progression remains explicit in later recovery flows.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 19/25 | Touches multiple lifecycle producers and compaction surfaces |
| Risk | 18/25 | Bad payload semantics would ripple into later phases |
| Research | 16/20 | Directly grounded in packet research |
| Multi-Agent | 4/15 | One runtime contract workstream |
| Coordination | 8/15 | Requires accurate predecessor/successor handoff |
| **Total** | **65/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Adapter phase redefines payload semantics | H | M | Keep Phase 2 transport-only and handoff-oriented |
| R-002 | Compaction recovery reuses wrapper noise as fresh context | H | L | Preserve anti-feedback filtering in hooks and merger |

---

## 11. USER STORIES

### US-001: Reuse One Shared Contract (Priority: P0)

**As a transport-layer maintainer, I want one payload/provenance contract, so that I do not have to reinvent payload semantics in later phases.**

**Acceptance Criteria**:
1. Given Phase 2 consumes shared payloads, when it builds hook output, then it can rely on one shared envelope.
2. Given a handler emits lifecycle payloads, when they are inspected, then provenance and trust state are already present.

---

### US-002: Prevent Compaction Drift (Priority: P1)

**As a maintainer, I want compaction guardrails embedded in the shared layer, so that later phases do not amplify stale summaries.**

**Acceptance Criteria**:
1. Given cached compact output exists, when a new compact brief is built, then wrapper text is filtered out.
2. Given recovery metadata is shown to the user, when a session resumes, then cached vs live state remains visible.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- No blocking open questions remain for Phase 1.
- Imported and rebuilt trust states remain forward-compatible for later portability work.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Packet**: See `../spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
