---
title: "Gate E — Runtime Migration"
description: "Canonical cutover."
trigger_phrases: ["gate e", "runtime migration"]
importance_tier: "important"
contextType: "implementation"
status: complete
closed_by_commit: TBD
_memory:
  continuity:
    packet_pointer: "018/005-gate-e-runtime-migration"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Spec sync"
    next_safe_action: "Run"
    key_files: ["spec.md"]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Gate E — Runtime Migration

---

## Executive Summary

Gate E is the canonical cutover for phase 018. The runtime no longer uses a staged rollout ladder, shadow mode, observation windows, or archived-tier continuity semantics. This phase flips the new path to the only live continuity path immediately, removes rollout-era framing from the active surfaces, and updates the mapped command, agent, skill, and README files so the repo describes the shipped contract honestly.

The operator-facing recovery surface is `/spec_kit:resume`. Canonical continuity is sourced from packet artifacts in this order: `../handover.md`, `_memory.continuity`, then the canonical spec docs. Legacy memory files are supporting artifacts only, not the source of truth.

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| Level | 3 |
| Priority | P0 |
| Status | Complete |
| Created | 2026-04-11 |
| Updated | 2026-04-12 |
| Branch | `main` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The previous Gate E packet was still written as a rollout state machine with `shadow_only`, dual-write buckets, hold windows, and post-flip observation gates. That is no longer the intended behavior. If the packet docs stay in that shape, the phase spec becomes an obstacle to the implementation instead of a truthful guide for it.

### Purpose

Make the new continuity path canonical immediately, remove the retired rollout model from the active guidance, and drive parity across the mapped doc surfaces so operators, agents, and delegated CLIs all describe the same live contract.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Flip the new path to the only live canonical continuity path.
- Remove rollout-era continuity concepts from active guidance:
  - `shadow_only`
  - dual-write buckets
  - 7-day and 180-day holds
  - EWMA decision ladders
  - archived-tier continuity and legacy fallback language
- Align the mapped Gate E surfaces called out by the packet resource map:
  - commands
  - workflow YAMLs
  - agents
  - CLI handback docs
  - `sk-*` skills and system-spec-kit internal docs
  - top-level docs and sub-READMEs
- Keep `/spec_kit:resume` as the recovery surface and make canonical spec docs the continuity source of truth.
- Update packet-local closeout docs for truthful implementation and verification reporting.

### Out of Scope

- Re-opening Gate C or Gate D writer and reader design.
- Editing research iterations, resource-map artifacts, or sibling packet docs.
- Reintroducing any staged rollout or observation framework.
- Inventing completion evidence that has not been captured yet.

### Files in This Packet

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Rewrite scope and requirements to the single-flip runtime model |
| `plan.md` | Modify | Replace staged rollout plan with immediate cutover plus parity plan |
| `tasks.md` | Modify | Reflect current execution slices and remaining exit-gate work |
| `checklist.md` | Modify | Verify against the single canonical contract and parity evidence |
| `decision-record.md` | Modify | Record the immediate-cutover and canonical-doc decisions |
| `implementation-summary.md` | Modify | Report the current implementation state and pending closeout evidence |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. Requirements

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Canonical continuity is the only live runtime path | Feature-flag or routing behavior is set to canonical unconditionally, or the retired flag path is removed entirely |
| REQ-002 | No rollout-era continuity model remains in active Gate E guidance | Packet docs and updated repo surfaces no longer instruct operators to use shadow, dual-write, observation, EWMA, or archived-tier continuity behavior |
| REQ-003 | Recovery guidance uses canonical continuity sources | `/spec_kit:resume` is the recovery surface and packet continuity resolves from `handover.md -> _memory.continuity -> spec docs` |
| REQ-004 | Broad doc parity remains tied to the mapped surface inventory | The Gate E fanout updates the required command, agent, skill, CLI, and README surfaces or records honest remaining gaps |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | CLI handback docs match the shipped `generate-context.js` contract | The 8 `cli-*` skill and prompt-template files use the current JSON-primary contract and precedence rules |
| REQ-006 | Packet closeout stays evidence-backed | `implementation-summary.md` reports actual touched files, validation state, and any still-pending proof |
| REQ-007 | Packet validation is run before Gate E is claimed complete | Packet-local markdown validation succeeds and any repo-wide completion claim cites real validator output |
| REQ-008 | Packet guidance remains structurally valid under the active spec template | Required headers, anchors, and continuity frontmatter blocks pass validation |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- SC-001: The active runtime path is canonical without a shadow or dual-write control plane.
- SC-002: Updated repo surfaces describe canonical continuity, spec-doc primacy, and `/spec_kit:resume` consistently.
- SC-003: Packet closeout material reports real validation and implementation evidence without rollout-era placeholders.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Entry gate truth from prior packets | If Gates B, C, or D are not actually complete, this packet could overstate readiness | Keep entry-gate assumptions explicit and avoid marking runtime verification complete without current evidence |
| Risk | Doc fanout drifts from the shipped save contract | Delegated CLI or operator instructions could regress | Keep the CLI handback batch tied to the current `generate-context.js` behavior |
| Risk | Packet docs claim full parity too early | Gate E could appear closed while repo-wide fanout is still running | Mark only evidence-backed tasks and keep pending checks open |
| Risk | Old continuity terms remain in overlooked surfaces | Operators may continue following retired instructions | Use resource-map-driven sweeps and targeted grep verification |
<!-- /ANCHOR:risks -->

## 7. Non-Functional Requirements

### Performance

- NFR-P01: Post-flip verification must report actual sample-save and validator evidence when available. Placeholder metrics are not acceptable closeout evidence.

### Reliability

- NFR-R01: Canonical continuity guidance must not depend on retired fallback tiers or observation-state coordination.

### Maintainability

- NFR-M01: Packet docs must describe the current runtime in plain, stable terms that do not require readers to reconstruct earlier rollout history.

## 8. EDGE CASES

- If a sample save still depends on retired flag plumbing, the packet remains in progress and the runtime validation items stay open.
- If some doc slices are complete but the full mapped fanout is not, the packet may report partial progress but not close the parity requirement.
- If `generate-context.js` behavior changes again before final closeout, the CLI contract checks must be rerun before completion is claimed.
- If the parent `../handover.md` or `_memory.continuity` guidance drifts from the packet docs, `/spec_kit:resume` guidance must be re-synced before closeout.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Canonical cutover plus a large mapped doc fanout |
| Risk | 20/25 | Runtime truth and operator guidance must move together |
| Research | 10/20 | Scope is grounded in prior packet research and resource maps |
| Multi-Agent | 8/15 | Parallel doc batches are required for the broad fanout |
| Coordination | 11/15 | Runtime, CLI contract, and packet closeout must stay aligned |
| Total | 71/100 | Level 3 |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Runtime flips but guidance stays stale | High | Medium | Finish mapped parity fanout before closeout |
| R-002 | CLI handback docs drift from save contract | High | Medium | Keep 8-file CLI batch tied to live contract checks |
| R-003 | Packet claims completion without validation evidence | High | Medium | Keep checklist items open until proof is attached |

## 11. USER STORIES

### US-001: Operator Uses the Canonical Path

As an operator, I want Gate E to describe one canonical continuity path, so I can execute and validate the migration without threading through retired rollout states.

### US-002: Agent Resumes from Canonical Continuity

As an agent or delegated CLI, I want continuity recovery to prioritize `../handover.md`, `_memory.continuity`, and canonical spec docs, so resume behavior follows the actual source of truth.

### US-003: Documentation Matches Runtime Reality

As a repo reader, I want command, skill, agent, and README docs to match the live runtime contract, so I do not learn a rollout model that no longer exists.

### Acceptance Scenarios

1. **Given** the old rollout ladder text still appears in the packet, **when** Gate E packet docs are rewritten, **then** the phase describes an immediate canonical migration instead of staged rollout buckets.
2. **Given** `/spec_kit:resume` is the operator recovery surface, **when** continuity guidance is read, **then** it points to `../handover.md`, `_memory.continuity`, and canonical spec docs in that order.
3. **Given** the CLI handback files are part of the Gate E fanout, **when** the packet describes contract alignment, **then** it references the current JSON-primary `generate-context.js` behavior.
4. **Given** runtime validation is rerun in the completion pass, **when** checklist and summary files are updated, **then** the packet closes only with attached validator, sample-save, and CLI-contract evidence.
5. **Given** some doc slices were updated outside this packet, **when** implementation progress is summarized, **then** the packet records those slices as supporting evidence without inflating final update counts.
6. **Given** strict packet validation runs after the rewrite, **when** template and frontmatter issues surface, **then** the packet is corrected before closeout is reported.

### AI Execution Protocol

### Pre-Task Checklist

- Confirm this packet only touches the owned markdown files in `005-gate-e-runtime-migration/`.
- Treat resource-map artifacts and research iterations as read-only evidence sources.
- Record only evidence-backed completion status.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-018E | Keep edits inside the owned packet markdown files only | Prevents cross-packet churn |
| AI-TRUTH-018E | Rewrite to the current canonical model, not the retired rollout design | Keeps the packet useful |
| AI-EVIDENCE-018E | Do not mark checks complete without direct evidence | Avoids false closeout |
| AI-RESUME-018E | Keep `/spec_kit:resume` and canonical spec docs as the recovery contract | Matches the new continuity model |

### Status Reporting Format

- Start state: packet rewrite status, known execution evidence, and open closeout blockers.
- Work state: owned file updates plus any validator failures being resolved.
- End state: validated, pending runtime proof, or complete with attached evidence.

### Blocked Task Protocol

1. Stop if a packet claim depends on validator output or runtime proof that has not been produced yet.
2. Leave the relevant checklist items open.
3. Record the missing evidence in `implementation-summary.md`.

<!-- ANCHOR:questions -->
## 12. Open Questions

- None inside packet scope. Remaining uncertainty is execution evidence, not packet design.
<!-- /ANCHOR:questions -->

## 13. Related Documents

- Implementation Plan: `plan.md`
- Task Breakdown: `tasks.md`
- Verification Checklist: `checklist.md`
- Decision Record: `decision-record.md`
- Current Closeout State: `implementation-summary.md`
