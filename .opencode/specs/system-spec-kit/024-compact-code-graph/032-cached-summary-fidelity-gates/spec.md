---
title: "Feature Specification: Cached Summary [system-spec-kit/024-compact-code-graph/032-cached-summary-fidelity-gates/spec]"
description: "Route the next continuity packet into the existing 024 train by turning cached summaries into a guarded consumer instead of a new authority surface."
trigger_phrases:
  - "032-cached-summary-fidelity-gates"
  - "cached summary fidelity gates"
  - "024-compact-code-graph"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/032-cached-summary-fidelity-gates"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: Cached Summary Fidelity Gates

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_ADDENDUM: Phase - Child Header -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 32 (`032-cached-summary-fidelity-gates`) |
| **Predecessor** | `031-normalized-analytics-reader` |
| **Successor** | `033-fts-forced-degrade-hardening` |

---

## EXECUTIVE SUMMARY

Route the next continuity packet into the existing 024 train by turning cached summaries into a guarded consumer instead of a new authority surface.

**Key Decisions**: Cached summaries stay additive or hint-only; bootstrap and resume retain authority.

**Critical Dependencies**: Completed producer seam in 026/002, normalized analytics reader in 024/031, measurement packet 026/005, and optional packet 033 if FTS truth gaps remain.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-04-08 |
| **Branch** | `main` |
| **Parent Packet** | `024-compact-code-graph` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research kept cached startup value only under fidelity and freshness gates. Public already has producer metadata and a normalized reader, but it does not yet define the guarded consumer contract that decides when cached summary state is trustworthy enough to prefer as a hint.

### Purpose
Open the consumer-side cached-summary packet in the train without shifting startup authority away from existing recovery surfaces.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define the cached-summary consumer contract and its freshness, fidelity, transcript-identity, and invalidation gates.
- Use existing producer metadata and analytics reader substrate instead of reopening writer logic.
- Scope consumption to additive startup or resume hints and compact continuity.
- Define a frozen resume corpus for pass-rate evaluation against live reconstruction.

### Out of Scope
- Changing Stop-hook producer logic.
- Making cached summaries the new authority surface.
- Opening dashboard or publication work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | Modify | Add guarded cached-summary consumption for startup or resume hints. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` | Read-first targeted modify | Consume existing producer metadata without redefining the writer contract. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Modify | Preserve bootstrap authority while exposing additive cached-summary hints. |
| `.opencode/skill/system-spec-kit/mcp_server/tests` | Modify | Add frozen resume-corpus checks for fidelity-gated summary use. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Cached summary use is gated by freshness, fidelity, transcript identity, and invalidation metadata. | The consumer declines cached summaries unless all required gates pass. |
| REQ-002 | Bootstrap and live recovery remain authoritative. | Bootstrap and deeper resume flows continue to win when the cached summary is stale, lossy, or invalid. |
| REQ-003 | Evaluation uses a frozen resume corpus. | The packet defines pass-rate checks that compare cached-summary use against live reconstruction. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Cached summaries stay additive or hint-only. | The consumer does not replace the underlying recovery surface. |
| REQ-005 | The packet cites 033 only if an FTS truth audit still finds gaps. | The consumer can proceed directly if lexical-path truth is already sufficient. |




### P2 - Nice-to-have (ship if low-risk)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Packet docs stay explicit about draft-versus-shipped boundaries. | Spec, plan, tasks, and implementation summary do not overclaim runtime delivery. |
| REQ-007 | Parent or successor handoff notes remain visible. | Dependencies and follow-on activation notes stay explicit in packet-local docs and parent trackers. |
| REQ-008 | Strict validation remains part of the activation gate. | The packet keeps strict validation and focused verification as mandatory before implementation is claimed complete. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Cached summaries are consumed only when they are demonstrably fresh and faithful.
- **SC-002**: Bootstrap and live recovery remain authoritative when the cached path is weak.
- **SC-003**: A frozen resume corpus exists to judge whether the consumer improves or preserves pass rate.
<!-- /ANCHOR:success-criteria -->

---


### Acceptance Scenarios

**Given** this packet is reviewed before runtime work starts, **when** a maintainer reads the spec, **then** the packet stays clearly marked as draft planning work rather than shipped behavior.

**Given** a dependency named in this packet is still incomplete, **when** implementation planning resumes, **then** the docs direct the maintainer to stop and re-verify the predecessor instead of assuming readiness.

**Given** someone proposes a broader subsystem rewrite while working this packet, **when** they compare the request to the spec, **then** the packet boundary rejects that scope expansion.

**Given** a future implementation changes the named owner surfaces, **when** packet docs are updated, **then** the successor and parent handoff notes are updated at the same time.

**Given** verification discovers stale, weak, or contradictory evidence, **when** the packet is evaluated for activation, **then** the packet remains draft until focused checks pass cleanly.

**Given** a later session needs to understand why this packet exists, **when** the spec is read in isolation, **then** the research-backed seam, dependency order, and out-of-scope boundaries are all still obvious.

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Startup hints quietly become a new authority surface | High | Keep the consumer additive and document bootstrap precedence. |
| Risk | Lossy cached summaries reduce correctness while appearing faster | High | Gate with fidelity checks and use the frozen resume corpus. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Keep the packet focused on cached-summary consumer logic and resume-corpus evaluation rather than broad subsystem work.

### Security
- **NFR-S01**: Stay inside current runtime and data-exposure boundaries.

### Reliability
- **NFR-R01**: The same input state should produce the same contract or gating outcome.

---

## 8. EDGE CASES

### Data Boundaries
- Missing predecessor contract: keep the packet blocked until the dependency is satisfied.
- Mixed-authority or partial signals: fail closed instead of inventing stronger certainty than the data supports.

### Error Scenarios
- Scope drift: reject changes that invent a new owner surface outside this packet.
- Verification failure: keep the packet in draft until focused tests or corpus checks pass.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Cross-packet contract or runtime seam |
| Risk | 16/25 | Authority, freshness, or publication boundaries |
| Research | 10/20 | Research is settled but implementation mapping still matters |
| Multi-Agent | 4/15 | One primary workstream with supporting verification |
| Coordination | 7/15 | Depends on predecessor and successor packet handoff |
| **Total** | **55/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Scope expands beyond the approved seam | H | M | Keep packet ownership and out-of-scope rules explicit. |
| R-002 | Predecessor assumptions drift | M | M | Re-verify dependencies before implementation starts. |

---

## 11. USER STORIES

### US-001: Prefer safe cached hints (Priority: P0)

As a user, I want cached summaries to speed up startup only when they are still trustworthy so continuity stays correct.

**Acceptance Criteria**:
1. Given a cached summary with passing gates, when startup or resume occurs, then it is used additively as a hint.

---

### US-002: Fail closed on weak summaries (Priority: P1)

As a maintainer, I want stale or lossy summaries rejected so bootstrap and live recovery remain authoritative.

**Acceptance Criteria**:
1. Given a cached summary that fails any gate, when recovery runs, then live reconstruction is preferred.

---

## 12. OPEN QUESTIONS

- Which fidelity checks should be mandatory for the first packet: transcript identity, coverage ratio, cache age, or all of them together?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
