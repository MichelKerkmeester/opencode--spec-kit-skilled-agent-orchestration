---
title: "Command Alignment: Memory Commands vs MCP Tool Schemas"
description: "Truth-reconcile the 011 command-alignment spec pack to the live 33-tool, 6-command Spec Kit Memory surface."
trigger_phrases:
  - "command alignment"
  - "memory commands"
  - "011 command alignment"
  - "tool schema alignment"
  - "MCP command reality"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 2 -->
# Specification: 011-command-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## EXECUTIVE SUMMARY

The live Spec Kit Memory command surface no longer matches the original 011 planning story. The repo now ships **33 MCP tools** across L1-L7 and a **6-command** memory suite: `analyze`, `continue`, `learn`, `manage`, `save`, and `shared`. Retrieval is no longer owned by a standalone `context.md`; that responsibility now lives inside `/memory:analyze`, which also documents `memory_quick_search`, analysis/eval tooling, and learning history.

This spec-pack update is documentation-only. Its job is to reconcile `spec.md`, `plan.md`, and `tasks.md` with the repo as it exists today, preserve the historical implementation decisions that still hold, and narrow the remaining gap list to issues that are still real.

**Key Metrics**
- 33 MCP tools in `TOOL_DEFINITIONS`
- 6 live memory command files in `.opencode/command/memory/`
- 0 uncovered tools in the live README coverage matrix
- `/memory:analyze` is the documented home for retrieval, `memory_quick_search`, analysis/eval tooling, and `memory_get_learning_history`
- `/memory:manage ingest` is the documented home for async ingest workflows
- The last visible runtime-doc drift cluster for this phase is concentrated in `analyze.md` and `shared.md`: the `analyze.md` Appendix A 12-vs-13 mismatch, governed retrieval parameter under-documentation, and stale `shared.md` create/member contract wording

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (truth-reconciled) |
| **Created** | 2026-03-14 |
| **Updated** | 2026-03-21 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../010-skill-alignment/spec.md |
| **Successor** | ../012-agents-alignment/spec.md |
| **Complexity** | 42/100 |
| **Parent** | `022-hybrid-rag-fusion` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 011 spec pack still describes an older transition state that is no longer true on disk:

1. **Historical count drift**
   - The spec pack still says the memory MCP surface has 32 tools.
   - The live tool inventory in `tool-schemas.ts` now contains 33 tools.

2. **Structural drift**
   - The spec pack still assumes a 7-command target surface.
   - The live command suite is already a 6-command surface because retrieval was merged into `analyze.md` and `context.md` no longer exists.

3. **Ownership drift**
   - The spec pack still treats retrieval as a `context.md` concern.
   - The live docs place `memory_context`, `memory_quick_search`, `memory_search`, `memory_match_triggers`, L6 analysis/eval tools, and `memory_get_learning_history` under `/memory:analyze`.

4. **Remaining-gap drift**
   - The earlier spec pack still frames many items as missing even though `shared.md`, `analyze.md`, `/memory:manage ingest`, and the README coverage matrix already exist.
   - The remaining gap list should now be narrow and factual: most command-alignment work has shipped, with only the last observable runtime-doc drift cluster still requiring closeout.

### Purpose

Bring the 011 planning docs into line with live repo truth so that:
- the spec pack describes the current 33-tool, 6-command memory surface
- `/memory:analyze` is recorded as the command home for retrieval plus `memory_quick_search`
- the spec distinguishes completed alignment work from the last runtime-doc drift cluster that this pass closes
- later audits can use 011 as a reliable source instead of re-litigating already-shipped command changes
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Category | Items |
|----------|-------|
| **Spec-pack reconciliation** | `spec.md`, `plan.md`, and `tasks.md` only |
| **Live-surface alignment** | Update all count, ownership, and command-structure claims to match the current repo |
| **Truthful gap recording** | Keep only gaps that are still observable in live command docs |
| **Source-of-truth references** | Reassert `tool-schemas.ts` plus `schemas/tool-input-schemas.ts` as the validation baseline |

### Out of Scope

- Editing runtime command docs such as `.opencode/command/memory/analyze.md`
- MCP server implementation changes
- New MCP tool creation
- Cross-runtime command or agent docs
- Spec-folder artifacts outside `spec.md`, `plan.md`, and `tasks.md`

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| D1 | Updated `spec.md` | Reflect the live 33-tool, 6-command memory-command reality |
| D2 | Updated `plan.md` | Rebase the plan from "implement missing commands" to "reconcile planning docs against shipped state" |
| D3 | Updated `tasks.md` | Replace stale implementation tasks with reconciliation and verification tasks |
| D4 | Drift closeout record | Explicitly record and close the remaining `analyze.md` and `shared.md` documentation drift without overstating broader gaps |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CA-001 | The spec pack uses the live 33-tool inventory | `spec.md`, `plan.md`, and `tasks.md` no longer claim a 32-tool surface |
| CA-002 | The spec pack uses the live 6-command suite | The pack no longer claims a 7-command target surface |
| CA-003 | The spec pack removes the standalone `context.md` assumption | Retrieval ownership is documented under `/memory:analyze`, not under a missing command file |
| CA-004 | `/memory:analyze` is documented as the command home for retrieval plus `memory_quick_search` | The pack explicitly assigns `memory_context`, `memory_quick_search`, `memory_search`, and `memory_match_triggers` to `/memory:analyze` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CA-005 | The pack distinguishes shipped work from remaining drift | `shared.md`, `analyze.md`, `/memory:manage ingest`, and README coverage are treated as existing, not planned |
| CA-006 | The pack preserves true ownership decisions | `/memory:analyze history <specFolder>` remains the documented home for `memory_get_learning_history`; `/memory:manage ingest` remains the async ingest home |
| CA-007 | Source-of-truth guidance remains explicit | The pack names both `tool-schemas.ts` and `schemas/tool-input-schemas.ts` as validation inputs |
| CA-008 | Residual runtime drift is recorded and closed narrowly | The pack records the observed `analyze.md` and `shared.md` mismatches as the final runtime-doc drift cluster and reflects their closeout in this pass |

### P2 - Desired

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CA-009 | Historical context remains understandable | The pack explains that 011 originally targeted a 7-command transition before retrieval was merged into `analyze.md` |
| CA-010 | Verification guidance is grep-friendly | The pack includes concrete stale-string checks for `32`, `7 commands`, and `context.md` assumptions |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 011 pack describes the live 33-tool inventory and does not repeat the older 32-tool count as present-day truth.
- **SC-002**: The 011 pack describes the live 6-command memory suite and does not treat `context.md` as an existing command file.
- **SC-003**: `/memory:analyze` is documented as the command home for retrieval, `memory_quick_search`, analysis/eval tooling, and learning history.
- **SC-004**: The pack records the last runtime-doc drift cluster accurately and no longer treats it as open after the live command docs are reconciled.

### Acceptance Scenarios

### Scenario A: Count Audit

Given the live schema sources,
when a reviewer compares 011 against `tool-schemas.ts`,
then the pack describes a 33-tool surface and does not repeat the older 32-tool count.

### Scenario B: Command-Surface Audit

Given `.opencode/command/memory/`,
when a reviewer compares 011 against the live command directory,
then the pack describes a 6-command suite and does not assume a standalone `context.md`.

### Scenario C: Ownership Audit

Given `analyze.md` and `README.txt`,
when a reviewer checks retrieval ownership,
then `/memory:analyze` is documented as the command home for retrieval, `memory_quick_search`, analysis/eval tooling, and learning history.

### Scenario D: Remaining-Gap Audit

Given the live memory command docs,
when a reviewer compares them against the reconciled 011 pack,
then already-shipped alignment work is not restated as missing and only still-observable drift remains on the gap list.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:gap-analysis -->
## 6. GAP ANALYSIS

### 6.1 Live Command-Surface Snapshot

| Command | Live Status | Notes |
|---------|-------------|-------|
| `/memory:analyze` | PRESENT | Unified retrieval + analysis command; owns retrieval, `memory_quick_search`, L6 tools, and learning history |
| `/memory:continue` | PRESENT | Recovery workflow command |
| `/memory:learn` | PRESENT | Constitutional-memory workflow wrapper |
| `/memory:manage` | PRESENT | Maintenance, mutation, checkpoint, and ingest workflows |
| `/memory:save` | PRESENT | Save workflow command |
| `/memory:shared` | PRESENT | Shared-memory lifecycle command |
| `context.md` | ABSENT BY DESIGN | Retrieval was merged into `analyze.md`; do not treat this as a missing file |

### 6.2 Current Tool-Ownership Reality

| Surface | Current Reality | Reconciliation Outcome |
|---------|-----------------|------------------------|
| Tool inventory | 33 tools in `TOOL_DEFINITIONS` | 011 must use 33 everywhere |
| Retrieval home | `/memory:analyze` | 011 must stop assigning retrieval to `context.md` |
| Quick search home | `/memory:analyze` | 011 must explicitly name `memory_quick_search` there |
| Learning history home | `/memory:analyze history <specFolder>` | Keep current ownership decision |
| Shared-memory home | `/memory:shared` | Treat as already shipped |
| Async ingest home | `/memory:manage ingest` | Treat as already shipped |
| README coverage matrix | Present and already maps 33 tools | Treat as existing evidence, not future work |

### 6.3 Remaining Observable Drift

| Location | Residual Drift | Why It Still Matters |
|----------|----------------|----------------------|
| `.opencode/command/memory/analyze.md` Appendix A and retrieval notes | Intro sentence says the command owns 12 tools, while the tool-coverage table lists 13 and includes `memory_quick_search`; governed retrieval parameters are under-documented | `/memory:analyze` is the live retrieval home, so count and parameter drift there misstates the command contract |
| `.opencode/command/memory/shared.md` create/member contract | Create/member docs omit required `tenantId` and actor identity, and still deny the first-create owner auto-grant behavior in the live schema | `/memory:shared` is the live shared-memory home, so schema-contract drift here misstates access and ownership behavior |

### 6.4 Source-of-Truth Notes

- `tool-schemas.ts` is the canonical ordered tool inventory and property-definition source.
- `schemas/tool-input-schemas.ts` is the command-facing validation mirror and should be consulted for alias/parameter parity.
- `README.txt` is current evidence for 33-tool command ownership, but 011 should still defer to the schema files when counts change.
<!-- /ANCHOR:gap-analysis -->

---

<!-- ANCHOR:implementation-decisions -->
## 7. RECONCILED DECISIONS

The following decisions remain authoritative after truth reconciliation:

1. `memory_get_learning_history` belongs to `/memory:analyze history <specFolder>`.
2. Retrieval ownership lives in `/memory:analyze`; no standalone `context.md` command exists anymore.
3. `memory_quick_search` belongs with the rest of the retrieval surface under `/memory:analyze`.
4. Shared-memory lifecycle tools belong to `/memory:shared`.
5. Async ingestion tools belong to `/memory:manage ingest`.
6. The spec pack should describe already-shipped command docs as existing and reserve the gap list for real residual drift only.
<!-- /ANCHOR:implementation-decisions -->

---

<!-- ANCHOR:approach -->
## 8. APPROACH

### Phase 0: Verify Live Reality

Confirm the current tool count, command-file count, command ownership, and the absence of `context.md`.

### Phase 1: Rewrite 011 as a Reconciliation Record

Update `spec.md`, `plan.md`, and `tasks.md` so they describe the shipped 6-command memory suite and the current 33-tool schema surface.

### Phase 2: Record Only Remaining Drift

Reduce the old "missing command" narrative to the small amount of drift that is still observable, specifically the `analyze.md` appendix count mismatch.

### Phase 3: Verify the Reconciled Pack

Run targeted stale-string checks and spec validation so the 011 pack no longer reintroduces 32-tool, 7-command, or `context.md` assumptions.
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:risks -->
## 9. RISKS

| Risk | Impact | Mitigation |
|------|--------|------------|
| Historical notes get mistaken for current gaps | Medium | Reword every gap section around present-tense repo state |
| Future schema changes make 011 stale again | Medium | Keep schema files as the explicit source of truth |
| Residual runtime-doc drift gets overstated | Low | Record only directly verified drift, not inferred gaps |
| Old memory files inside the spec folder still mention older counts | Low | Keep this pass scoped to `spec.md`, `plan.md`, and `tasks.md` only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for this reconciliation pass. The only follow-up surfaced by the audit is a runtime-doc cleanup: update `.opencode/command/memory/analyze.md` Appendix A so its intro count matches the 13-tool matrix.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Epic**: `022-hybrid-rag-fusion/spec.md`
- **Tool Inventory**: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- **Parameter Mirror**: `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- **Memory Command Directory**: `.opencode/command/memory/`
- **Current Coverage Index**: `.opencode/command/memory/README.txt`

---

<!--
SPEC: 011-command-alignment
Level 2 - Complete (truth-reconciled 2026-03-21)
Current reality: 33-tool schema surface, 6-command memory suite, retrieval merged into analyze
Residual drift still observed: analyze.md Appendix A says 12 tools while its matrix lists 13
-->

---

## Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../010-skill-alignment/spec.md |
| **Next Phase** | ../012-agents-alignment/spec.md |
