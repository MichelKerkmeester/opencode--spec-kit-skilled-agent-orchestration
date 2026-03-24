---
title: "Command Alignment: Memory Commands vs MCP Tool Schemas"
description: "Truth-reconcile the 012 command-alignment spec pack to the live 33-tool, 6-command Spec Kit Memory surface."
trigger_phrases:
  - "command alignment"
  - "memory commands"
  - "012 command alignment"
  - "tool schema alignment"
  - "MCP command reality"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 2 -->
# Specification: 012-command-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## EXECUTIVE SUMMARY

The live Spec Kit Memory command surface no longer matches the original 012 planning story. The repo now ships **33 MCP tools** across L1-L7 and a **6-command** memory suite: `analyze`, `continue`, `learn`, `manage`, `save`, and `shared`. Retrieval is no longer owned by a standalone context.md; that responsibility now lives inside `/memory:analyze`, which also documents `memory_quick_search`, analysis/eval tooling, and learning history.

This spec-pack update is documentation-only. Its job is to reconcile `spec.md`, `plan.md`, and `tasks.md` with the repo as it exists today, preserve the historical implementation decisions that still hold, and narrow the remaining gap list to issues that are still real.

**Key Metrics**
- 33 MCP tools in `TOOL_DEFINITIONS`
- 6 live memory command files in `.opencode/command/memory/`
- 0 uncovered tools in the live README coverage matrix
- `/memory:analyze` is the documented home for retrieval, `memory_quick_search`, analysis/eval tooling, and `memory_get_learning_history`
- `/memory:manage ingest` is the documented home for async ingest workflows
- The runtime-doc drift cluster in analyze.md and shared.md was resolved during the 2026-03-21 reconciliation pass: analyze.md Appendix A now says 13 tools (was 12), governed retrieval parameters are documented, and shared.md create/member contract now includes tenantId and actor identity

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
| **Predecessor** | ../011-skill-alignment/spec.md |
| **Successor** | ../013-agents-alignment/spec.md |
| **Complexity** | 42/100 |
| **Parent** | `022-hybrid-rag-fusion` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 012 spec pack previously described an older transition state that was no longer true on disk:

1. **Historical count drift**
   - The spec pack still says the memory MCP surface has 32 tools.
   - The live tool inventory in `tool-schemas.ts` now contains 33 tools.

2. **Structural drift**
   - The spec pack still assumes a 7-command target surface.
   - The live command suite is already a 6-command surface because retrieval was merged into analyze.md and context.md no longer exists.

3. **Ownership drift**
   - The spec pack still treats retrieval as a context.md concern.
   - The live docs place `memory_context`, `memory_quick_search`, `memory_search`, `memory_match_triggers`, L6 analysis/eval tools, and `memory_get_learning_history` under `/memory:analyze`.

4. **Remaining-gap drift**
   - The earlier spec pack framed many items as missing even though shared.md, analyze.md, `/memory:manage ingest`, and the README coverage matrix already existed.
   - The remaining gap list was narrowed to factual items: the runtime-doc drift cluster in analyze.md and shared.md was resolved during the 2026-03-21 reconciliation pass.

### Purpose

Bring the 012 planning docs into line with live repo truth so that:
- the spec pack describes the current 33-tool, 6-command memory surface
- `/memory:analyze` is recorded as the command home for retrieval plus `memory_quick_search`
- the spec distinguishes completed alignment work from the runtime-doc drift cluster that was resolved in this pass
- later audits can use 012 as a reliable source instead of re-litigating already-shipped command changes
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Category | Items |
|----------|-------|
| **Spec-pack reconciliation** | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` |
| **Runtime-doc drift closeout** | Reconcile runtime command docs (analyze.md, shared.md) to resolve the drift cluster identified in this pass |
| **Live-surface alignment** | Update all count, ownership, and command-structure claims to match the current repo |
| **Truthful gap recording** | Record gaps that were resolved during this pass and verify no new drift remains |
| **Source-of-truth references** | Reassert `tool-schemas.ts` plus `schemas/tool-input-schemas.ts` as the validation baseline |

### Out of Scope

- MCP server implementation changes
- New MCP tool creation
- Cross-runtime command or agent docs
- Spec-folder artifacts outside the five canonical files

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| D1 | Updated `spec.md` | Reflect the live 33-tool, 6-command memory-command reality |
| D2 | Updated `plan.md` | Rebase the plan from "implement missing commands" to "reconcile planning docs against shipped state" |
| D3 | Updated `tasks.md` | Replace stale implementation tasks with reconciliation and verification tasks |
| D4 | Drift closeout record | Resolved the analyze.md and shared.md runtime-doc drift (13-tool count, governed retrieval params, tenantId/actor identity, auto-grant behavior) during the 2026-03-21 reconciliation pass |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CA-001 | The spec pack uses the live 33-tool inventory | `spec.md`, `plan.md`, and `tasks.md` no longer claim a 32-tool surface |
| CA-002 | The spec pack uses the live 6-command suite | The pack no longer claims a 7-command target surface |
| CA-003 | The spec pack removes the standalone context.md assumption | Retrieval ownership is documented under `/memory:analyze`, not under a missing command file |
| CA-004 | `/memory:analyze` is documented as the command home for retrieval plus `memory_quick_search` | The pack explicitly assigns `memory_context`, `memory_quick_search`, `memory_search`, and `memory_match_triggers` to `/memory:analyze` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CA-005 | The pack distinguishes shipped work from resolved drift | shared.md, analyze.md, `/memory:manage ingest`, and README coverage are treated as existing, not planned; former drift is recorded as resolved |
| CA-006 | The pack preserves true ownership decisions | `/memory:analyze history <specFolder>` remains the documented home for `memory_get_learning_history`; `/memory:manage ingest` remains the async ingest home |
| CA-007 | Source-of-truth guidance remains explicit | The pack names both `tool-schemas.ts` and `schemas/tool-input-schemas.ts` as validation inputs |
| CA-008 | Runtime drift was resolved in this pass | The pack records that the analyze.md and shared.md mismatches were resolved during the 2026-03-21 reconciliation pass |

### P2 - Desired

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CA-009 | Historical context remains understandable | The pack explains that 012 originally targeted a 7-command transition before retrieval was merged into analyze.md |
| CA-010 | Verification guidance is grep-friendly | The pack includes concrete stale-string checks for `32`, `7 commands`, and context.md assumptions |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 012 pack describes the live 33-tool inventory and does not repeat the older 32-tool count as present-day truth.
- **SC-002**: The 012 pack describes the live 6-command memory suite and does not treat context.md as an existing command file.
- **SC-003**: `/memory:analyze` is documented as the command home for retrieval, `memory_quick_search`, analysis/eval tooling, and learning history.
- **SC-004**: The pack records the runtime-doc drift cluster as resolved during the 2026-03-21 reconciliation pass.

### Acceptance Scenarios

### Scenario A: Count Audit

Given the live schema sources,
when a reviewer compares 012 against `tool-schemas.ts`,
then the pack describes a 33-tool surface and does not repeat the older 32-tool count.

### Scenario B: Command-Surface Audit

Given `.opencode/command/memory/`,
when a reviewer compares 012 against the live command directory,
then the pack describes a 6-command suite and does not assume a standalone context.md.

### Scenario C: Ownership Audit

Given analyze.md and `README.txt`,
when a reviewer checks retrieval ownership,
then `/memory:analyze` is documented as the command home for retrieval, `memory_quick_search`, analysis/eval tooling, and learning history.

### Scenario D: Remaining-Gap Audit

Given the live memory command docs,
when a reviewer compares them against the reconciled 012 pack,
then already-shipped alignment work is not restated as missing and the former drift cluster is recorded as resolved.
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
| context.md | ABSENT BY DESIGN | Retrieval was merged into analyze.md; do not treat this as a missing file |

### 6.2 Current Tool-Ownership Reality

| Surface | Current Reality | Reconciliation Outcome |
|---------|-----------------|------------------------|
| Tool inventory | 33 tools in `TOOL_DEFINITIONS` | 012 must use 33 everywhere |
| Retrieval home | `/memory:analyze` | 012 must stop assigning retrieval to context.md |
| Quick search home | `/memory:analyze` | 012 must explicitly name `memory_quick_search` there |
| Learning history home | `/memory:analyze history <specFolder>` | Keep current ownership decision |
| Shared-memory home | `/memory:shared` | Treat as already shipped |
| Async ingest home | `/memory:manage ingest` | Treat as already shipped |
| README coverage matrix | Present and already maps 33 tools | Treat as existing evidence, not future work |

### 6.3 Drift Resolved in This Pass

The following runtime-doc drift was identified and resolved during the 2026-03-21 reconciliation pass:

| Location | Drift (resolved) | Resolution |
|----------|-------------------|------------|
| `.opencode/command/memory/analyze.md` Appendix A and retrieval notes | Intro sentence said the command owned 12 tools, while the tool-coverage table listed 13 and included `memory_quick_search`; governed retrieval parameters were under-documented | Updated to 13 tools; governed retrieval parameters now documented |
| `.opencode/command/memory/shared.md` create/member contract | Create/member docs omitted required `tenantId` and actor identity, and denied the first-create owner auto-grant behavior present in the live schema | tenantId and actor identity now present; auto-grant behavior documented |

### 6.4 Source-of-Truth Notes

- `tool-schemas.ts` is the canonical ordered tool inventory and property-definition source.
- `schemas/tool-input-schemas.ts` is the command-facing validation mirror and should be consulted for alias/parameter parity.
- `README.txt` is current evidence for 33-tool command ownership, but 012 should still defer to the schema files when counts change.
<!-- /ANCHOR:gap-analysis -->

---

<!-- ANCHOR:implementation-decisions -->
## 7. RECONCILED DECISIONS

The following decisions remain authoritative after truth reconciliation:

1. `memory_get_learning_history` belongs to `/memory:analyze history <specFolder>`.
2. Retrieval ownership lives in `/memory:analyze`; no standalone context.md command exists anymore.
3. `memory_quick_search` belongs with the rest of the retrieval surface under `/memory:analyze`.
4. Shared-memory lifecycle tools belong to `/memory:shared`.
5. Async ingestion tools belong to `/memory:manage ingest`.
6. The spec pack describes already-shipped command docs as existing; formerly open drift items are recorded as resolved.
<!-- /ANCHOR:implementation-decisions -->

---

<!-- ANCHOR:approach -->
## 8. APPROACH

### Phase 0: Verify Live Reality

Confirm the current tool count, command-file count, command ownership, and the absence of context.md.

### Phase 1: Rewrite 012 as a Reconciliation Record

Update `spec.md`, `plan.md`, and `tasks.md` so they describe the shipped 6-command memory suite and the current 33-tool schema surface.

### Phase 2: Resolve Runtime-Doc Drift

Reduce the old "missing command" narrative, resolve the runtime-doc drift in analyze.md (12-to-13 tool count, governed retrieval params) and shared.md (tenantId, actor identity, auto-grant behavior).

### Phase 3: Verify the Reconciled Pack

Run targeted stale-string checks and spec validation so the 012 pack no longer reintroduces 32-tool, 7-command, or context.md assumptions.
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| Historical notes get mistaken for current gaps | Medium | Reword every gap section around present-tense repo state |
| Future schema changes make 012 stale again | Medium | Keep schema files as the explicit source of truth |
| Resolved runtime-doc drift gets overstated in future reads | Low | Drift is recorded as resolved with specific evidence from the 2026-03-21 pass |
| Old memory files inside the spec folder still mention older counts | Low | Keep this pass scoped to `spec.md`, `plan.md`, and `tasks.md` only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The runtime-doc drift in analyze.md and shared.md was resolved during the 2026-03-21 reconciliation pass.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Epic**: ../spec.md
- **Tool Inventory**: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- **Parameter Mirror**: `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- **Memory Command Directory**: `.opencode/command/memory/`
- **Current Coverage Index**: `.opencode/command/memory/README.txt`

---

<!--
SPEC: 012-command-alignment
Level 2 - Complete (truth-reconciled 2026-03-21)
Current reality: 33-tool schema surface, 6-command memory suite, retrieval merged into analyze
Drift cluster resolved: analyze.md updated to 13 tools, shared.md contract updated with tenantId/actor/auto-grant
-->

---

## Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../011-skill-alignment/spec.md |
| **Next Phase** | ../013-agents-alignment/spec.md |
