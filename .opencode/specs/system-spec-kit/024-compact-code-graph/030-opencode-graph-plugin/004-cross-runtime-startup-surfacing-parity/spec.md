---
title: "Feature Specification: Cross-Runtime Startup Surfacing Parity [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/004-cross-runtime-startup-surfacing-parity]"
description: "Implements the follow-on phase that extends OpenCode's startup/session-context surfacing model to the other repo-managed CLI runtimes without reopening the completed packet 030 runtime phases."
trigger_phrases:
  - "cross-runtime startup surfacing parity"
  - "packet 030"
  - "level 3"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Cross-Runtime Startup Surfacing Parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 4 extended the shipped startup experience beyond OpenCode. The Level 3 repair keeps that runtime/config parity claim intact and turns the phase into a durable packet artifact with explicit runtime boundaries and evidence.

**Key Decisions**: Center parity on the shared startup brief, keep Codex bootstrap-based, and use the existing runtime-specific entry points instead of inventing a new universal hook model.

**Critical Dependencies**: OpenCode as the reference surface, the Claude and Gemini session-prime hooks, the Copilot banner hook, and the Codex `context-prime` bootstrap path.

---

### Phase Context

This is **Phase 4 of 4** of the OpenCode Graph Plugin phased execution specification.

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-code-graph-operations-hardening |
| **Successor** | 005-code-graph-auto-reindex-parity |
| **Handoff Criteria** | The documented phase boundary, verification evidence, and Level 3 artifacts are sufficient for packet recovery and successor review. |

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-04-03 |
| **Branch** | `main` |
| **Parent Spec** | `030-opencode-graph-plugin` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
OpenCode now injects a structured startup digest and session-context surfacing through the packet-030 plugin layer, but the other repo-managed CLI runtimes still split startup behavior across hooks, injected context, and manual bootstrap instructions. That left the startup UX inconsistent across runtimes and made the OpenCode delivery feel like a one-off instead of the reference behavior.

### Purpose
Complete the follow-on phase that aligns startup/session-context surfacing across Codex, Claude, Gemini, and Copilot with the OpenCode startup reference while preserving the already-completed packet 030 runtime phases.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory the current startup and session-context surfacing behavior for OpenCode, Claude, Gemini, Codex, and Copilot
- Define the shared startup-status contract and runtime-specific fallback model
- Implement the runtime/config/test surfaces required for the delivered parity pass
- Update packet 030 documentation so phase 004 is recorded as completed and truthful

### Out of Scope
- Reopening the delivered runtime phases 001-003
- Reworking the completed packet 030 implementation in phases 001-003
- Extending packet 030 into memory durability or broader cross-packet architecture changes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../tasks.md` | Modify | Mark the parity follow-on as implemented and verified |
| `../checklist.md` | Modify | Update packet-level verification wording for phase 004 completion |
| `../implementation-summary.md` | Modify | Record the completed parity pass in the parent closeout |
| `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts` | Modify | Provide shared startup brief content reusable across runtimes |
| `.codex/agents/context-prime.toml` | Modify | Align Codex bootstrap output with the same startup surface |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A shared startup surface exists for runtime parity | Startup output begins with the same startup-status block across the targeted runtime surfaces |
| REQ-002 | Runtime-specific startup and recovery messaging stays aligned | Claude and Gemini SessionStart output, the Copilot banner hook, and Codex bootstrap output all use the same startup-status structure |
| REQ-003 | Completed packet work stays clearly closed | Parent and child docs continue to mark phases 001-003 complete while phase 004 closes as the parity follow-on |
| REQ-004 | OpenCode remains the reference behavior | Other runtimes align to the OpenCode startup surface instead of redefining it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Verification is explicit | Runtime/config checks and packet validation prove the parity implementation landed cleanly |
| REQ-006 | Hook-capable and hookless runtime paths are separated clearly | Claude/Gemini/Copilot use hook wiring while Codex uses bootstrap output without forcing one runtime model onto all CLIs |
| REQ-007 | Copilot wiring stays documented truthfully | The docs distinguish between the repo-local tracked hook config and any broader per-user or per-repo rollout assumptions |
| REQ-008 | Phase docs reflect Level 3 closeout accurately | Checklist, ADR, and implementation summary align to the same delivered parity scope |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Claude, Gemini, Copilot, and Codex now surface the same startup-status shape as the OpenCode reference.
- **SC-002**: Packet 030 docs distinguish the original runtime phases from the completed parity follow-on.
- **SC-003**: Strict packet validation passes after the runtime/code/doc truth-sync.
- **SC-004**: Phase 4 now stands as a complete Level 3 artifact instead of a Level 1 phase stub.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
### Acceptance Scenarios

**Given** a targeted CLI runtime starts after this phase, **when** startup context is surfaced, **then** the user sees the shared `Session context received. Current state:` block before runtime-specific detail.

**Given** packet 030 is reviewed after this implementation, **when** the parent packet docs are read, **then** phases 001-003 remain clearly complete and phase 004 is recorded as the delivered parity follow-on.

**Given** Copilot starts in this workspace, **when** the banner hook runs, **then** it uses the shared startup surface rather than a one-off string.

**Given** Codex starts without a native session hook, **when** `context-prime` runs, **then** it still mirrors the same startup-status structure.

**Given** a maintainer checks whether the runtime models are identical, **when** the phase docs are read, **then** they still distinguish hook-capable and hookless paths clearly.

**Given** strict validation is rerun later, **when** Phase 4 docs are checked, **then** the phase validates as clean Level 3 documentation.

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | OpenCode plugin startup surfacing | High | Keep OpenCode behavior as the reference rather than redesigning it during parity work |
| Dependency | Existing Claude and Gemini session-prime hooks | High | Reuse the current hook entry points instead of creating parallel startup surfaces |
| Risk | Expanding the phase into a broader runtime rewrite | High | Keep the phase limited to startup/session-context surfacing parity |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Startup-status output should stay short enough to remain readable across runtimes.
- **NFR-P02**: Parity work should reuse the shared startup brief instead of duplicating strings per runtime.

### Security
- **NFR-S01**: No secrets or credentials appear in startup banners or config examples.
- **NFR-S02**: Copilot and Codex runtime/config nuances remain explicitly documented.

### Reliability
- **NFR-R01**: Hook-capable and hookless runtimes remain clearly separated.
- **NFR-R02**: Phase 4 docs validate cleanly as a standalone Level 3 phase artifact.

---

## 8. EDGE CASES

### Data Boundaries
- Missing memory context still results in a valid minimal startup surface.
- Missing CocoIndex remains represented explicitly rather than omitted.

### Error Scenarios
- Hook-capable runtimes must not pretend they share Codex bootstrap behavior.
- Local Copilot config must not be described as a tracked repo artifact.

### State Transitions
- OpenCode reference state stays fixed while parity extends around it.
- Codex remains bootstrap-based until a future native hook exists.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Touches multiple runtime entry points and packet truth-sync |
| Risk | 18/25 | Overstating parity or hook capability would mislead later sessions |
| Research | 16/20 | Grounded in packet research and shipped runtime/config work |
| Multi-Agent | 4/15 | One startup parity workstream |
| Coordination | 9/15 | Requires parent/child docs and runtime/config parity to stay aligned |
| **Total** | **67/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Parity wording overstates runtime capability | H | M | Keep hook-capable and hookless paths explicit |
| R-002 | Copilot repo-local tracked config is mistaken for a universal cross-repo guarantee | M | M | Keep the repo-local wiring explicit and avoid implying every repo already has the same hooks configured |

---

## 11. USER STORIES

### US-001: See the Same Startup Shape Everywhere (Priority: P0)

**As a user switching between runtimes, I want startup context to look familiar, so that recovery feels consistent across tools.**

**Acceptance Criteria**:
1. Given Claude or Gemini starts, when startup context is shown, then it leads with the same startup-status block as OpenCode.
2. Given Codex starts, when `context-prime` runs, then it presents the same top-level startup shape without a native hook.

---

### US-002: Preserve Runtime-Specific Truth (Priority: P1)

**As a maintainer, I want parity docs to stay honest about runtime differences, so that future work builds on the right surface.**

**Acceptance Criteria**:
1. Given Copilot uses a local banner hook, when the phase docs are read, then they state that nuance explicitly.
2. Given a future runtime hook appears for Codex, when this phase is reviewed, then the current bootstrap-based parity path is still clearly documented.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- No blocking open questions remain for Phase 4.
- A future Codex-native hook could replace the bootstrap-based parity path, but that is not part of packet 030.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Packet**: See `../spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
