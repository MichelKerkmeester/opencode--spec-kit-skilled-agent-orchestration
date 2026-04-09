---
title: "Feature Specification: Cache-Warning Hook System [template:level_3/spec.md]"
description: "Research-aligned rescope of packet 002 from a six-phase warning prototype to a bounded producer-side continuity prerequisite packet."
trigger_phrases:
  - "cache warning hook"
  - "stop-hook metadata patch"
  - "replay isolation"
  - "continuity prerequisite"
  - "claudest continuation"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Cache-Warning Hook System

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This packet no longer treats the earlier six-phase warning-hook prototype as the active plan. The canonical 2026-04-08 research narrowed the safe early continuity lane to two things: truthful predecessor ordering and a bounded producer-side metadata patch inside `session-stop.ts` and `hook-state.ts` after the FTS helper and forced-degrade tests exist [SOURCE: research.md §1; §2].

**Key Decisions**: Keep `session_bootstrap()` and memory resume authoritative; keep producer work inside `session-stop.ts` plus `hook-state.ts`; treat the persisted artifact as a compact continuity wrapper rather than a second packet narrative; do not mutate `.claude/settings.local.json`; do not implement `UserPromptSubmit` or a new SessionStart warning fast path in this packet [SOURCE: research.md §2; §4].

**Critical Dependencies**: The FTS capability helper and forced-degrade matrix are hard predecessors, and replay isolation is still required before any producer patch can be trusted [SOURCE: research.md §2]. The FTS capability cascade predecessor work is now explicitly owned by new phase 010-fts-capability-cascade-floor (R7, recommendations.md:65-73).

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Implemented — predecessor verified |
| **Created** | 2026-04-06 |
| **Branch** | `026-graph-and-context-optimization/002-implement-cache-warning-hooks` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | `001-research-graph-context-systems` |
| **Successor** | `003-memory-quality-issues` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet `002` was originally framed as a six-phase cache-warning rollout with `SessionStart` estimator and `UserPromptSubmit` behavior. The canonical research now says that framing is too aggressive: warm-start and warning consumers are conditional, additive, and later in the continuity lane, while the defensible near-term work is a bounded producer-side metadata patch plus replay-safe verification [SOURCE: research.md §1; §2; §4].

### Purpose

Define a research-aligned Level 3 packet that captures the producer-side continuity prerequisite work for this lane:

- explicit predecessor dependency on FTS helper plus forced-degrade tests
- replay harness isolation and side-effect fencing
- bounded Stop-hook metadata persistence in `session-stop.ts` and `hook-state.ts`
- idempotent verification and handoff to later packets
<!-- /ANCHOR:problem -->

> **Memory save contract (cross-ref):** Memory saves in this packet follow the compact retrieval wrapper contract owned by `026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/`, the implementation host for the `001-research-graph-context-systems/006-research-memory-redundancy/` research findings. Canonical narrative ownership stays in `decision-record.md` and `implementation-summary.md`; memory files carry only canonical-doc pointers, distinguishing evidence, continuation state, and recovery metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Confirm and document the predecessor dependency on the FTS capability helper plus truthful forced-degrade tests.
- Build or refine replay-safe hook validation that isolates `TMPDIR`, stubs autosave where needed, and detects out-of-bound writes.
- Extend `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` with additive producer metadata needed for later continuity and analytics packets.
- Extend `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` to persist bounded metadata after transcript parsing without turning Stop into an analytics reader.
- Prove idempotent replay behavior for the producer patch before any later cached-summary consumer or warning surface is considered.
- Keep long-form packet meaning in `decision-record.md` and `implementation-summary.md` when those docs exist, while the producer artifact remains a compact continuity wrapper.

### Out of Scope

- Any new `UserPromptSubmit` hook, warning copy, or soft-block behavior.
- Any mutation to `.claude/settings.local.json` for new warning or startup hooks.
- Any `session-prime.ts` fast path that changes `resume`, `compact`, or startup behavior in this packet.
- Any analytics reader, dashboard, pricing normalization, or token-insight publication contract.
- Any attempt to make cached summaries or hook metadata authoritative over `session_bootstrap()` or `memory_context(...resume...)`.
- Any long-form packet-style summary artifact that duplicates canonical packet docs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` | Modify | Add bounded producer metadata while keeping `claudeSessionId` primary and `speckitSessionId` nullable. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` | Modify | Persist bounded transcript identity and cache-token carry-forward fields after transcript parsing. |
| `.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts` | Create or refine | Isolated replay harness with side-effect detection for producer verification. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/*.vitest.ts` | Modify | Add replay and idempotency coverage for the producer patch. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | Read-only verification | Confirm no consumer fast path is introduced in this packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Packet `002` records the FTS helper plus forced-degrade matrix as a hard predecessor. | `spec.md`, `plan.md`, and `tasks.md` all state that this packet is not the first continuity implementation packet and depends on the earlier FTS hardening lane [SOURCE: research.md §2]. |
| REQ-002 | Replay validation is isolated before any producer patch is treated as trustworthy. | Harness provisions isolated temp state, fences autosave side effects, and reports out-of-bound writes as failures rather than warnings [SOURCE: research.md §2]. |
| REQ-003 | `hook-state.ts` gains additive producer metadata for continuity handoff. | State keeps `claudeSessionId` primary, leaves `speckitSessionId` nullable, and adds bounded fields for `lastClaudeTurnAt`, transcript identity or reference, and cache-token carry-forward without introducing a reader schema here [SOURCE: research.md §2]. |
| REQ-004 | `session-stop.ts` persists the producer metadata after transcript parsing without becoming an analytics reader or second narrative owner. | Stop remains a writer-only boundary, persists bounded metadata after parse, emits a compact continuity wrapper, and does not absorb normalized reader, dashboard, publication logic, or canonical packet-doc ownership [SOURCE: research.md §2; §4]. |
| REQ-005 | Replay verification includes idempotency, not just one-pass success. | Replaying the same transcript twice proves stable session-level totals and no duplicate turn ingestion or duplicate producer state rows [SOURCE: research.md §2]. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | This packet must preserve startup authority boundaries. | No doc or code path in this packet claims cached summary or Stop metadata replaces `session_bootstrap()` or `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` [SOURCE: research.md §4]. |
| REQ-007 | `session-prime.ts` remains additive or unchanged in this packet. | Verification shows no new `resume`, `compact`, or startup consumer fast path is introduced here [SOURCE: research.md §2]. |
| REQ-008 | The packet explicitly hands off deferred work to later continuity packets. | Follow-on notes name the later packets for normalized analytics reader, cached-summary consumer, workflow split, and token-observability contracts [SOURCE: research.md §2]. |

### P2 - Nice-to-have (ship if low-risk)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | The packet documents the historical phase-001 warning research as context, not authority. | `research.md` keeps the earlier findings visible while clearly reclassifying them as upstream context rather than the active source of truth [SOURCE: research.md §3]. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Packet docs all align to the canonical 2026-04-08 research instead of the earlier six-phase warning rollout.
- **SC-002**: Replay harness or equivalent verification proves isolated producer validation with explicit side-effect failure modes.
- **SC-003**: The planned code change set is limited to `hook-state.ts`, `session-stop.ts`, and replay or test infrastructure; `session-prime.ts` remains unchanged in active scope.
- **SC-004**: The producer patch persists bounded metadata only and does not introduce an analytics reader, dashboard contract, or startup authority shift.
- **SC-005**: The packet explicitly defers cached-summary consumers and direct warning surfaces until later prerequisite gates are satisfied.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | **R-001: FTS prerequisite missing** | High | Keep the predecessor dependency explicit and do not claim this packet is ready to implement ahead of that lane [SOURCE: research.md §2]. |
| Risk | **R-002: Producer and consumer boundaries blur again** | High | Keep work inside `session-stop.ts` plus `hook-state.ts`; no SessionStart fast path or `UserPromptSubmit` work here [SOURCE: research.md §2; §4]. |
| Risk | **R-003: Replay evidence is polluted by autosave or shared temp state** | High | Isolate `TMPDIR`, stub autosave where needed, and fail on out-of-bound writes [SOURCE: research.md §2]. |
| Risk | **R-004: Cached or persisted summaries are treated as authoritative too early** | High | Preserve `session_bootstrap()` and memory resume as authoritative; defer any cached-summary consumer until later gates [SOURCE: research.md §4]. |
| Risk | **R-005: Packet keeps stale wording from the older warning prototype** | Medium | Synchronize `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `research.md` in one update pass. |

### Hard Rules

- **No runtime enablement in this packet**: do not add `.claude/settings.local.json` mutations or new hook registrations.
- **No direct warning consumer in this packet**: do not implement `UserPromptSubmit` or a new warning-only `SessionStart` branch here.
- **Producer-only boundary**: Stop may persist bounded metadata, but it must not become the analytics reader or publication surface.
- **Authority preservation**: `session_bootstrap()` and `memory_context(...resume...)` remain authoritative.
- **Idempotency required**: replay verification must prove stable repeated ingestion before later consumer packets are considered.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Replay validation for the producer patch must stay within existing hook timeout and test-runtime expectations.
- **NFR-P02**: The producer patch must not add a second transcript parse or heavy reader logic to `session-stop.ts`.

### Security
- **NFR-S01**: No new external services, network calls, or secret-bearing config changes may be introduced.
- **NFR-S02**: Hook stdout remains reserved for the existing runtime contract; diagnostics stay on stderr.

### Reliability
- **NFR-R01**: Producer metadata remains additive in `HookState`; no migration layer or second state file is introduced.
- **NFR-R02**: Replay tests prove idempotent handling for repeated transcript ingestion attempts.

### Operability
- **NFR-O01**: Follow-on consumer work must still have a clear handoff path in the packet docs.
- **NFR-O02**: Replay isolation choices must be explicit and diagnosable.

---

## 8. EDGE CASES

### Data Boundaries
- Missing transcript identity or reference: the producer patch must degrade safely without inventing reader-level structure.
- Missing cache token inputs: producer metadata may remain partial, but it must not fabricate precision.
- Replayed transcript with identical offsets: verification must prove no duplicate producer records or duplicated downstream-ready markers.

### Error Scenarios
- FTS predecessor not yet landed: packet cannot honestly claim implementation readiness.
- Replay harness still writes outside the sandbox: validation fails and the producer patch remains untrusted.
- SessionStart temptation creeps back in: packet docs must treat any startup consumer path as follow-on work, not current scope.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Narrower than the original packet, but still crosses writer, state, and test seams. |
| Risk | 20/25 | Producer or authority drift would poison later continuity packets. |
| Research | 19/20 | Scope now depends directly on the canonical consolidation and Claudest continuation order. |
| Multi-Agent | 2/15 | Work is sequential and packet-local. |
| Coordination | 13/15 | Requires exact predecessor wording, replay isolation, and cross-doc synchronization. |
| **Total** | **70/100** | **Level 3 because the packet defines a prerequisite seam for later continuity work and must preserve exact boundaries.** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Packet is implemented before the FTS helper plus forced-degrade predecessor lands. | High | Medium | Keep predecessor wording explicit across all packet docs. |
| R-002 | Stop becomes an analytics reader instead of a bounded writer. | High | Medium | Limit active scope to producer metadata only. |
| R-003 | Cached summary or warning consumers are reintroduced before fidelity or freshness gates exist. | High | High | Defer those consumers explicitly and keep `session_bootstrap()` authoritative. |
| R-004 | Replay validation shows one-pass success but misses idempotency failures. | High | Medium | Require double-replay verification before completion. |
| R-005 | Old six-phase warning language survives in one or more packet docs. | Medium | Medium | Validate all spec docs together and patch drift before closeout. |

---

## 11. USER STORIES

### US-001: Preserve a Trustworthy Producer Boundary (Priority: P0)

**As a** maintainer of the continuity lane, **I want** packet `002` to stop at the producer-side metadata patch, **so that** later analytics and cached-summary consumers build on a trustworthy seam instead of speculative warning UX.

**Acceptance Scenarios**:

- **Given** the packet is reviewed against canonical research, **When** scope is finalized, **Then** active work is limited to replay isolation plus `session-stop.ts` and `hook-state.ts` producer metadata.
- **Given** later continuity packets consume this metadata, **When** they are planned, **Then** they inherit a stable writer boundary rather than an already-collapsed reader contract.

---

### US-002: Verify Producer Changes Without Side Effects (Priority: P0)

**As a** hook author, **I want** replay-safe validation and idempotency checks, **so that** Stop-hook metadata changes can be trusted before any consumer or analytics work begins.

**Acceptance Scenarios**:

- **Given** replay execution starts, **When** the harness runs, **Then** it isolates temp state and reports any out-of-bound write as a failure.
- **Given** the same transcript is replayed twice, **When** verification completes, **Then** session totals remain stable and duplicate turn ingestion does not occur.

---

### US-003: Keep Startup Authority Intact (Priority: P1)

**As a** continuity-system maintainer, **I want** this packet to avoid new SessionStart or direct-warning behavior, **so that** `session_bootstrap()` and memory resume stay authoritative until later gates are satisfied.

**Acceptance Scenarios**:

- **Given** packet `002` completes, **When** a user resumes work, **Then** existing bootstrap and resume guidance remain the authoritative recovery path.
- **Given** follow-on cached-summary or warning work is planned later, **When** it references packet `002`, **Then** it treats this packet as a producer prerequisite, not a complete warm-start feature.

---

## 12. OPEN QUESTIONS

1. Which exact transcript-identity field shape should be persisted in `HookState` without prematurely introducing the later reader schema?
2. Can the replay harness prove idempotency at the writer seam alone, or does it need a minimal reader-side fixture harness in the follow-on packet?
3. Should the packet title remain unchanged for continuity, or should a later packet rename clean up the historical "cache-warning" label once the implementation lane stabilizes?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
