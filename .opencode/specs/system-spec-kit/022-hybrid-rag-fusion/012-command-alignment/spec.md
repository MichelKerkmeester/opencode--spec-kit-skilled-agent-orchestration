---
title: "Command Alignment: Memory Commands vs MCP Tool [system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/spec]"
description: "Update the 012 command-alignment spec pack so it matches the live 33-tool, 4-command memory surface plus /spec_kit:resume recovery."
trigger_phrases:
  - "command alignment"
  - "memory commands"
  - "012 command alignment"
  - "tool schema alignment"
  - "mcp command reality"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 2 -->
# Specification: 012-command-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

### Executive Summary

The live Spec Kit Memory command surface no longer matches the earlier 012 reconciliation story. The repo now ships **33 MCP tools** across L1-L7, a **4-command** memory suite (`search`, `learn`, `manage`, and `save`), and session recovery owned by `/spec_kit:resume`. Retrieval plus analysis now live under `/memory:search`, while shared-memory lifecycle now lives under `/memory:manage shared`.

This spec-pack update is documentation-only and limited to the five canonical 012 files. Its job is to reconcile the pack with the repo as it exists today, preserve the historical decisions that still hold, and replace stale command-surface language from the pre-rename/pre-merge shape.

**Key Metrics**
- 33 MCP tools in `TOOL_DEFINITIONS`
- 4 live memory command files in `.opencode/command/memory/`
- 0 uncovered tools in the live README coverage matrix
- `/memory:search` is the documented home for retrieval, `memory_quick_search`, analysis/eval tooling, and `memory_get_learning_history`
- `/spec_kit:resume` is the documented home for session recovery and crash/interrupted-session continuation
- `/memory:manage ingest` is the documented home for async ingest workflows
- `/memory:manage shared` is the documented home for shared-memory lifecycle operations (`enable`, `create`, `member`, `status`)
- The command-surface rename/merge has landed: the former `analyze` command became `/memory:search`, and standalone shared-memory lifecycle was merged into `/memory:manage shared`

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (truth-reconciled) |
| **Created** | 2026-03-14 |
| **Updated** | 2026-03-27 |
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

The 012 spec pack previously described a command surface that is no longer true on disk:

1. **Historical count drift**
   - The spec pack still says the memory MCP surface has 32 tools.
   - The live tool inventory in `tool-schemas.ts` now contains 33 tools.

2. **Structural drift**
   - The spec pack still assumes a 5-command memory surface with standalone `analyze` and `shared` commands.
   - The live memory command suite is now a 4-command surface because `analyze` was renamed to `search` and shared-memory lifecycle was merged into `manage`.

3. **Ownership drift**
   - The spec pack still points retrieval and analysis to `/memory:analyze` and shared lifecycle to `/memory:shared`.
   - The live docs place `memory_context`, `memory_quick_search`, `memory_search`, `memory_match_triggers`, L6 analysis/eval tools, and `memory_get_learning_history` under `/memory:search`, while shared lifecycle now lives under `/memory:manage shared`.

4. **Scope-truth drift**
   - The earlier checklist and summary text described runtime-doc edits outside the five canonical 012 files.
   - This update must stay truthful about scope: it reflects landed live changes, but it does not claim that this pass edited command files outside the packet.

### Purpose

Bring the 012 planning docs into line with live repo truth so that:
- the spec pack describes the current 33-tool, 4-command memory surface plus `/spec_kit:resume` session recovery
- `/memory:search` is recorded as the command home for retrieval plus `memory_quick_search`
- `/spec_kit:resume` is recorded as the command home for session recovery
- `/memory:manage shared` is recorded as the command home for shared-memory lifecycle
- later audits can use 012 as a reliable source instead of re-litigating already-landed rename/merge work
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Category | Items |
|----------|-------|
| **Spec-pack reconciliation** | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` |
| **Live-surface alignment** | Update all count, ownership, and command-structure claims to match the current repo |
| **Truthful scope recording** | Reflect landed rename/merge work without claiming command-file edits in this pass |
| **Source-of-truth references** | Reassert `tool-schemas.ts` plus `schemas/tool-input-schemas.ts` as the validation baseline |

### Out of Scope

- MCP server implementation changes
- New MCP tool creation
- Command-file edits outside the five canonical 012 docs
- Spec-folder artifacts outside the five canonical files

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| D1 | Updated `spec.md` | Reflect the live 33-tool, 4-command memory-command reality plus `/spec_kit:resume` recovery ownership |
| D2 | Updated `plan.md` | Rebase the plan from "implement missing commands" to "reconcile planning docs against shipped state" |
| D3 | Updated `tasks.md` | Replace stale implementation tasks with reconciliation and verification tasks |
| D4 | Rename/merge alignment record | Record that retrieval/analysis now live under `search`, while shared-memory lifecycle now lives under `manage shared` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| REQ-001 | The spec pack uses the live 33-tool inventory (legacy `CA-001`) | `spec.md`, `plan.md`, and `tasks.md` no longer claim a 32-tool surface |
| REQ-002 | The spec pack uses the live 4-command memory suite (legacy `CA-002`) | The pack no longer presents standalone `analyze` or `shared` commands as current live commands |
| REQ-003 | The spec pack records live retrieval and recovery ownership correctly (legacy `CA-003`) | Retrieval ownership is documented under `/memory:search`, while session recovery is documented under `/spec_kit:resume` |
| REQ-004 | Shared-memory lifecycle is documented under `/memory:manage shared` (legacy `CA-004`) | The pack explicitly assigns `enable`, `create`, `member`, and `status` shared workflows to `/memory:manage shared` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| REQ-005 | The pack preserves true ownership decisions (legacy `CA-005`) | `/memory:search history <specFolder>` remains the documented home for `memory_get_learning_history`; `/memory:manage ingest` remains the async ingest home |
| REQ-006 | Source-of-truth guidance remains explicit (legacy `CA-006`) | The pack names both `tool-schemas.ts` and `schemas/tool-input-schemas.ts` as validation inputs |
| REQ-007 | Source-of-truth guidance remains explicit (legacy `CA-007`) | The pack names both `tool-schemas.ts` and `schemas/tool-input-schemas.ts` as validation inputs |
| REQ-008 | Scope remains truthful in this pass (legacy `CA-008`) | The pack reflects landed live changes without claiming command-file edits outside the five canonical docs |

### P2 - Desired

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| REQ-009 | Historical context remains understandable (legacy `CA-009`) | The pack explains that 012 previously described a 5-command surface before `analyze` became `search` and `shared` merged into `manage` |
| REQ-010 | Verification guidance is grep-friendly (legacy `CA-010`) | The pack includes concrete stale-string checks for `32`, `/memory:analyze`, `/memory:shared`, and stale 5-command wording |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 012 pack describes the live 33-tool inventory and does not repeat the older 32-tool count as present-day truth.
- **SC-002**: The 012 pack describes the live 4-command memory suite and does not treat `analyze` or `shared` as standalone current command files.
- **SC-003**: `/memory:search` is documented as the command home for retrieval, `memory_quick_search`, analysis/eval tooling, and learning history.
- **SC-004**: `/spec_kit:resume` is documented as the command home for session recovery and crash/interrupted-session continuation.
- **SC-005**: `/memory:manage shared` is documented as the command home for shared-memory lifecycle.
- **SC-006**: The pack does not claim edits outside the five canonical 012 docs.

### Acceptance Scenarios

### Scenario A: Count Audit

**Given** the live schema sources, **when** a reviewer compares 012 against `tool-schemas.ts`, **then** the pack describes a 33-tool surface and does not repeat the older 32-tool count.

### Scenario B: Command-Surface Audit

**Given** `.opencode/command/memory/` and `.opencode/command/spec_kit/resume.md`, **when** a reviewer compares 012 against the live command directories, **then** the pack describes a 4-command memory suite, assigns session recovery to `/spec_kit:resume`, and does not present `analyze` or `shared` as current command files.

### Scenario C: Ownership Audit

**Given** `/memory:search`, `/memory:manage shared`, and `README.txt`, **when** a reviewer checks command ownership, **then** `/memory:search` is documented as the command home for retrieval plus analysis, and `/memory:manage shared` is documented as the command home for shared-memory lifecycle.

### Scenario D: Scope Audit

**Given** the live memory command docs and the five canonical 012 files, **when** a reviewer compares scope claims against actual edits, **then** the pack reflects landed live changes without claiming runtime-doc edits outside the packet.
<!-- /ANCHOR:success-criteria -->

---

### Appendix: Gap Analysis & Reconciliation Record

#### A.1 Live Command-Surface Snapshot

| Command | Live Status | Notes |
|---------|-------------|-------|
| `/memory:search` | PRESENT | Unified retrieval + analysis command; owns retrieval, `memory_quick_search`, L6 tools, and learning history |
| `/memory:learn` | PRESENT | Constitutional-memory workflow wrapper |
| `/memory:manage` | PRESENT | Maintenance, mutation, checkpoint, ingest, and nested shared-lifecycle workflows |
| `/memory:save` | PRESENT | Save workflow command |
| `/memory:analyze` | ABSENT BY DESIGN | Renamed to `/memory:search`; do not treat as a live command |
| `/memory:shared` | ABSENT BY DESIGN | Merged into `/memory:manage shared`; do not treat as a live command |
| `/spec_kit:resume` | PRESENT | Session recovery plus structured continuation workflow |
| context.md | ABSENT BY DESIGN | Retrieval is owned by `/memory:search`; do not treat this as a missing file |

#### A.2 Current Tool-Ownership Reality

| Surface | Current Reality | Reconciliation Outcome |
|---------|-----------------|------------------------|
| Tool inventory | 33 tools in `TOOL_DEFINITIONS` | 012 must use 33 everywhere |
| Retrieval home | `/memory:search` | 012 must stop assigning retrieval to old `analyze` wording |
| Session recovery home | `/spec_kit:resume` | 012 must stop assigning recovery to `/memory:continue` |
| Quick search home | `/memory:search` | 012 must explicitly name `memory_quick_search` there |
| Learning history home | `/memory:search history <specFolder>` | Keep current ownership decision |
| Shared-memory home | `/memory:manage shared` | Treat nested shared subcommands as the live surface |
| Async ingest home | `/memory:manage ingest` | Treat as already shipped |
| README coverage matrix | Present and already maps 33 tools | Treat as existing evidence, not future work |

#### A.3 Rename/Merge Changes Reflected in This Pass

The following live command-surface changes are already present on disk and must be reflected by the canonical 012 pack:

| Location | Drift (resolved) | Resolution |
|----------|-------------------|------------|
| `.opencode/command/memory/search.md` | The retrieval+analysis command now uses the `search` name instead of `analyze` | 012 must reference `/memory:search` everywhere |
| `.opencode/command/memory/manage.md` | Shared-memory lifecycle moved under `shared` subcommands on `manage` | 012 must reference `/memory:manage shared` instead of a standalone `/memory:shared` command |

#### A.4 Source-of-Truth Notes

- `tool-schemas.ts` is the canonical ordered tool inventory and property-definition source.
- `schemas/tool-input-schemas.ts` is the command-facing validation mirror and should be consulted for alias/parameter parity.
- `README.txt` is current evidence for 33-tool command ownership, but 012 should still defer to the schema files when counts change.
---

#### A.5 Reconciled Decisions

The following decisions remain authoritative after truth reconciliation:

1. `memory_get_learning_history` belongs to `/memory:search history <specFolder>`.
2. Retrieval ownership lives in `/memory:search`; no standalone context.md command exists anymore.
3. Session recovery ownership lives in `/spec_kit:resume`; `/memory:continue` is no longer part of the live command surface.
4. `memory_quick_search` belongs with the rest of the retrieval surface under `/memory:search`.
5. Shared-memory lifecycle tools belong to `/memory:manage shared`.
6. Async ingestion tools belong to `/memory:manage ingest`.
7. This pass updates only the five canonical 012 docs and should not claim edits outside that scope.
---

#### A.6 Approach

### Phase 0: Verify Live Reality

Confirm the current tool count, command-file count, command ownership, and the absence of standalone `analyze` and `shared` command files.

### Phase 1: Rewrite 012 as a Reconciliation Record

Update the canonical 012 docs so they describe the shipped 4-command memory suite, the `/spec_kit:resume` recovery ownership model, and the current 33-tool schema surface.

### Phase 2: Align Ownership Language

Replace stale `analyze` and standalone `shared` ownership language with `/memory:search` and `/memory:manage shared`.

### Phase 3: Verify the Reconciled Pack

Run targeted stale-string checks and spec validation so the 012 pack no longer reintroduces 32-tool, `/memory:analyze`, `/memory:shared`, or stale 5-command assumptions.
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| Historical notes get mistaken for current gaps | Medium | Reword every gap section around present-tense repo state |
| Future schema changes make 012 stale again | Medium | Keep schema files as the explicit source of truth |
| Rename/merge details get partially updated | Medium | Grep for stale `analyze`, `shared`, and `5-command` wording after edits |
| Scope claims overstate what this pass changed | Low | Keep every evidence note limited to the five canonical docs plus live repo references |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The live rename/merge outcome is clear on disk: `search` owns retrieval+analysis and `manage shared` owns shared-memory lifecycle.
<!-- /ANCHOR:questions -->

---

### Related Documents

- **Parent Epic**: ../spec.md
- **Tool Inventory**: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- **Parameter Mirror**: `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- **Memory Command Directory**: `.opencode/command/memory/`
- **Current Coverage Index**: `.opencode/command/memory/README.txt`

---

<!--
SPEC: 012-command-alignment
Level 2 - Complete (truth-reconciled 2026-03-27)
Current reality: 33-tool schema surface, 4-command memory suite, session recovery owned by /spec_kit:resume
Live rename/merge reflected: analyze -> search, shared -> manage shared
-->

---

### Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../011-skill-alignment/spec.md |
| **Next Phase** | ../013-agents-alignment/spec.md |
