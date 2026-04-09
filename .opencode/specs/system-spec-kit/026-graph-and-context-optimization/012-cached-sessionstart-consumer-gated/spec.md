---
title: "Feature Specification: Cached SessionStart Consumer (Gated) [template:level_3/spec.md]"
description: "Guarded consumer packet for cached SessionStart summaries that stays additive to authoritative resume flows and only activates when fidelity and freshness gates pass."
trigger_phrases:
  - "012-cached-sessionstart-consumer-gated"
  - "cached SessionStart consumer"
  - "fidelity and freshness gates"
  - "resume compact continuity"
  - "026-graph-and-context-optimization"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Cached SessionStart Consumer (Gated)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Create the guarded consumer packet described by recommendation `R3`: cached SessionStart summaries may be consumed only when fidelity and freshness checks pass, and only as additive continuity for `resume`, `compact`, and optional startup hints. This packet rides on top of `R2` and packet `002`, which produce the persisted Stop-summary metadata the consumer reads. The upstream artifact is treated as a compact continuity wrapper, not as a second packet narrative owner.

**Key Decisions**: Keep `session_bootstrap()` and memory resume authoritative; treat cached summaries as optional inputs only; fail closed to live reconstruction whenever fidelity, freshness, scope, or invalidation checks fail; require frozen-corpus proof before the consumer is considered ready.

**Critical Dependencies**: Recommendation `R2` in `recommendations.md:15-23`, packet `002-implement-cache-warning-hooks`, and the producer-side metadata contract that persists timestamp, scope, invalidation metadata, transcript identity, and carried-forward cache token fields before any consumer logic runs.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-08 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | `011-graph-payload-validator-and-trust-preservation` |
| **Successor** | `013-warm-start-bundle-conditional-validation` |
| **Research Citation** | `001-research-graph-context-systems/research/recommendations.md:25-33` with producer context from `:15-23` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The research kept the fast-path idea for cached SessionStart continuity, but only as a guarded consumer layered on top of the producer artifact from `R2`. Cached summaries can reduce cost and startup work, yet they can also harm correctness when lossy summaries, stale artifacts, or heuristic session selection are treated as authoritative.

### Purpose

Open the narrow consumer packet in the continuity lane:

- validate fidelity before a cached Stop-summary artifact is consumed
- enforce freshness, invalidation, and scope gates before reuse
- route valid cached content additively through existing `resume` and `compact` continuity paths
- surface optional startup hints only when a valid cached summary exists
- prove the guarded consumer does not underperform live reconstruction on a frozen resume corpus
<!-- /ANCHOR:problem -->

> **Memory save contract (cross-ref):** Memory saves in this packet follow the compact retrieval wrapper contract owned by `026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/`, the implementation host for the `001-research-graph-context-systems/006-research-memory-redundancy/` research findings. Canonical narrative ownership stays in `decision-record.md` and `implementation-summary.md`; memory files carry only canonical-doc pointers, distinguishing evidence, continuation state, and recovery metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Fidelity checks on cached Stop-summary artifacts before any SessionStart consumer path uses them.
- Freshness gates covering timestamp, invalidation metadata, and scope compatibility.
- Additive routing through existing `session_bootstrap()` and `session-resume.ts` continuity paths without replacing their authoritative live behavior.
- Compact wrapper assumptions: the cached artifact may carry distinguishing evidence and continuity state, but long-form packet meaning still lives in canonical packet docs when those docs exist.
- Optional startup hints in `session-prime.ts` only when a cached summary clears all gates.
- Frozen resume corpus evaluation that compares guarded cached consumption against live reconstruction and requires equal-or-better pass rate.
- Explicit documentation that `session_bootstrap()` remains the authoritative producer and that this packet is purely additive.

### Out of Scope

- Replacing `session_bootstrap()` or memory resume as the authority surface.
- Producer-side metadata patch work that belongs to `002-implement-cache-warning-hooks`.
- New dashboard, analytics reader, or reporting surfaces.
- Heuristic session selection or summary reuse without a fidelity gate.
- Any change that makes cached summaries mandatory instead of optional and fail-closed.
- Any expectation that the cached summary is a full packet narrative or a replacement for canonical packet docs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Modify | Add the guarded cached-summary consumer path while preserving authoritative live reconstruction. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` | Modify | Route valid cached summaries additively through existing resume and compact continuity seams. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | Modify | Surface optional startup hints only when a valid cached summary exists. |
| `.opencode/skill/system-spec-kit/scripts/tests/` | Create | Add the frozen resume corpus and equal-or-better comparison checks. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/spec.md` | Read-only dependency | Confirm producer contract, ownership boundary, and metadata fields consumed by this packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Cached summaries must pass a fidelity gate before they are consumed. | The consumer rejects summaries that are missing required producer fields, fail schema or completeness checks, or cannot prove they came from the bounded Stop-summary producer path. |
| REQ-002 | Cached summaries must pass a freshness gate before they are consumed. | Timestamp, invalidation metadata, and scope-bound candidate selection tied to the active `specFolder` and/or session identity must all pass before cached reuse is allowed. |
| REQ-003 | The consumer must stay additive to current continuity surfaces. | Valid cached summaries feed existing `resume` and `compact` continuity paths without replacing live reconstruction as the source of truth. |
| REQ-004 | Startup hints remain optional and gated. | `session-prime.ts` emits startup hints only when a valid cached summary exists and never invents hints from stale or partial artifacts. |
| REQ-005 | Packet acceptance mirrors the research requirement exactly. | `SessionStart uses cached summaries only when fidelity and freshness checks pass, routes them through additive resume and compact continuity paths plus optional startup hints, and a frozen resume corpus shows equal-or-better pass rate relative to live reconstruction.` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | This packet must preserve producer and authority boundaries from `R2` and packet `002`. | No code or doc path claims the cached consumer replaces `session_bootstrap()` or memory resume as authority, and no packet doc treats the cached artifact as a second long-form narrative owner. |
| REQ-007 | Consumer invalidation must be explicit rather than heuristic. | Rejection reasons name failed gate categories such as stale timestamp, invalidated scope, `scope_unknown_fail_closed`, or fidelity mismatch instead of relying on guesswork. |
| REQ-008 | Resume-corpus evaluation must compare guarded cache consumption against the current live baseline. | Frozen corpus outputs show the guarded path matches or exceeds live reconstruction pass rate before the packet is eligible to move beyond draft. |
| REQ-009 | Fail-closed behavior must be the default. | Any missing producer metadata, unknown scope, or unreadable cached summary falls back to live reconstruction without partial cached injection. |

### P2 - Nice-to-have (ship if low-risk)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Packet docs keep startup-hint language precise. | Documentation clearly frames hints as optional additive guidance, not a second continuity owner. |
| REQ-011 | Verification keeps invalidation cases visible. | Corpus or unit fixtures cover at least one stale, one scope-mismatch, and one fidelity-failure example. |
| REQ-012 | Successor handoff stays explicit. | Packet-local docs point `013-warm-start-bundle-conditional-validation` to this packet as the guarded consumer prerequisite. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Fidelity and freshness gates exist and fail closed before any cached SessionStart summary is consumed.
- **SC-002**: Valid cached summaries enrich existing `resume` and `compact` continuity paths without replacing authoritative live reconstruction.
- **SC-003**: `session-prime.ts` emits optional startup hints only when a valid cached summary exists.
- **SC-004**: Frozen-corpus evaluation shows equal-or-better pass rate for the guarded cached path relative to live reconstruction.
- **SC-005**: Packet docs keep `session_bootstrap()` and memory resume explicit as the authoritative surfaces.
<!-- /ANCHOR:success-criteria -->

---


### Acceptance Scenarios

**Given** a cached Stop-summary artifact is missing required producer metadata, **when** SessionStart begins, **then** the consumer rejects the artifact and uses live reconstruction only.

**Given** a cached summary is present but invalidated by timestamp, scope, or producer-side invalidation markers, **when** the consumer evaluates it, **then** it fails closed without partial additive injection.

**Given** a cached summary passes fidelity and freshness checks, **when** `session_bootstrap()` or `session-resume.ts` runs, **then** the cached content is routed additively through existing `resume` and `compact` continuity paths.

**Given** a valid cached summary exists, **when** `session-prime.ts` prepares startup hints, **then** it may surface optional hints but must not replace authoritative resume or bootstrap state.

**Given** the frozen resume corpus is executed, **when** guarded cached reuse is compared with live reconstruction, **then** the cached consumer shows equal-or-better pass rate before the packet can be treated as ready.

**Given** a later packet attempts to package this consumer as a default warm-start bundle, **when** the scope is checked, **then** that work is deferred to successor packet `013` rather than absorbed here.

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | **R-001: Producer metadata from packet `002` is incomplete or drifts** | High | Re-read the producer spec and keep the consumer blocked until required metadata fields are durable and trustworthy. |
| Risk | **R-002: Cached summaries are treated as authoritative too early** | High | Preserve `session_bootstrap()` and memory resume as authority and keep the consumer strictly additive. |
| Risk | **R-003: Fidelity gate is too weak and admits lossy artifacts** | High | Require explicit producer identity, completeness, and fail-closed validation before any reuse. |
| Risk | **R-004: Freshness or scope invalidation is under-specified** | High | Keep timestamp, invalidation metadata, and scope compatibility separate and mandatory. |
| Risk | **R-005: Frozen corpus shows a cost win but a correctness regression** | High | Keep the packet in draft until the guarded consumer matches or exceeds live reconstruction pass rate. |
| Risk | **R-006: Startup hints expand into a second owner surface** | Medium | Limit hints to optional additive output in `session-prime.ts` and document the boundary repeatedly. |
<!-- /ANCHOR:risks -->

---

### Hard Rules

- **Authority preservation**: `session_bootstrap()` and memory resume remain authoritative.
- **Producer dependency**: this packet consumes only the producer-side artifact and metadata emitted by packet `002`.
- **Fail-closed consumer**: any failed fidelity or freshness check falls back to live reconstruction.
- **No analytics surface**: do not add dashboards, normalized readers, or publication contracts here.
- **No heuristic session selection**: consumer activation must be gated by validated producer metadata, not inference.

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Guard evaluation should be lightweight relative to live reconstruction so the additive path remains a real fast-path candidate.
- **NFR-P02**: Frozen-corpus evaluation must measure correctness first and avoid overstating speed wins.

### Security
- **NFR-S01**: No new network calls, secret-bearing config changes, or unsafe output channels may be introduced.
- **NFR-S02**: Hook stdout remains reserved for the existing runtime contract; diagnostics stay on stderr.

### Reliability
- **NFR-R01**: The same producer artifact and current scope state must produce the same gate outcome.
- **NFR-R02**: Missing or partially written cached summaries must degrade safely to live reconstruction.

### Operability
- **NFR-O01**: Failed fidelity or freshness checks should remain diagnosable in logs or test output.
- **NFR-O02**: Successor packet `013` must inherit a clear handoff boundary from this consumer packet.

---

## 8. EDGE CASES

### Data Boundaries
- Cached summary present but missing transcript identity: reject the artifact and use live reconstruction.
- Cached summary present with mismatched scope or packet context: reject reuse rather than trimming fields opportunistically.
- Producer metadata present but invalidation markers updated since write time: treat the summary as stale even if the summary payload itself parses.

### Error Scenarios
- Packet `002` has not yet landed the required producer fields: this packet remains blocked.
- Fidelity gate passes on structure but fails semantic completeness: fail closed and capture the mismatch in tests.
- Frozen corpus shows parity on some scenarios but regression on others: keep the packet in draft and do not activate the consumer as ready.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Crosses bootstrap, resume, startup hints, and frozen-corpus verification seams |
| Risk | 19/25 | Authority, freshness, and correctness regression boundaries are easy to overstep |
| Research | 11/20 | Research is settled, but R2 to R3 dependency mapping must stay exact |
| Multi-Agent | 4/15 | One primary packet with supporting test and doc work |
| Coordination | 10/15 | Requires explicit predecessor and successor handoff discipline |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Producer metadata contract from `002` changes under this packet | H | M | Keep the predecessor explicit and re-verify fields before implementation. |
| R-002 | Cached summaries bypass live authority in one code path | H | M | Keep consumer routing additive only and test fail-closed behavior. |
| R-003 | Fidelity checks are too shallow to detect lossy artifacts | H | M | Require structural and producer-origin checks before consumption. |
| R-004 | Freshness scope rules are ambiguous across sessions | H | M | Validate timestamp, invalidation metadata, and scope separately. |
| R-005 | Startup hints encourage treating cached data as stronger than it is | M | M | Keep hints optional, additive, and explicitly non-authoritative. |

---

## 11. USER STORIES

### US-001: Reuse cached summaries safely (Priority: P1)

As a maintainer, I want cached SessionStart summaries to be reused only when their fidelity and freshness are trustworthy so that continuity can improve without regressing correctness.

**Acceptance Criteria**:
1. Given a cached summary fails any required gate, when SessionStart runs, then live reconstruction remains the only active path.
2. Given a cached summary passes all gates, when continuity surfaces run, then the cached content is injected additively rather than replacing the live path.

---

### US-002: Preserve authoritative continuity owners (Priority: P1)

As a reviewer, I want `session_bootstrap()` and memory resume to stay authoritative so that cached summaries never become an accidental second owner surface.

**Acceptance Criteria**:
1. Given packet docs and code are reviewed, when authority boundaries are traced, then bootstrap and resume remain the canonical owners.

---

### US-003: Prove the fast path is not worse than the baseline (Priority: P1)

As a packet owner, I want a frozen resume corpus comparison so that any claimed warm-start improvement preserves or improves correctness relative to live reconstruction.

**Acceptance Criteria**:
1. Given the frozen corpus is executed, when the guarded cached path is compared to live reconstruction, then the pass rate is equal or better before readiness is claimed.

---

## 12. OPEN QUESTIONS

- Should fidelity require only required-field completeness, or also version and producer-schema compatibility checks before consumption?
- Where should gate-failure observability live so that debugging remains useful without creating a new analytics surface?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
