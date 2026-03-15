---
title: "Command Alignment: Memory Commands vs MCP Tool Schemas"
description: "Align the memory command documentation set with the current 32-tool Spec Kit Memory MCP surface across L1-L7."
trigger_phrases:
  - "command alignment"
  - "memory commands"
  - "016 command alignment"
  - "tool schema alignment"
  - "MCP command gap"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 2 -->
# Specification: 016-command-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## EXECUTIVE SUMMARY

The Spec Kit Memory MCP server now exposes **32 tools** across 7 architectural layers (L1-L7). The memory command suite still documents only the original 5 commands and does not cover 16 tools at all, leaving the command surface incomplete and several existing docs stale against the live schema. This spec aligns the command docs with the current repo truth by updating the 5 existing command files, adding 3 new command files, and refreshing the memory command README.

**Key Metrics**
- 32 MCP tools in `TOOL_DEFINITIONS`
- 16 tools currently have zero command coverage (50% uncovered)
- 8-command target surface after alignment
- 1 reserved new subcommand: `/memory:manage history <specFolder>`
- Live documentation source of truth is the combined command-facing surface from `tool-schemas.ts` and `schemas/tool-input-schemas.ts`
- `shared_memory_enable` (tool #32) added as part of the default-off enablement feature

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-14 |
| **Updated** | 2026-03-15 |
| **Branch** | `017-markovian-architectures` |
| **Complexity** | 58/100 |
| **Parent** | `022-hybrid-rag-fusion` (Phase 016) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 5 command docs in `.opencode/command/memory/` were written against an earlier MCP surface and now lag the live server in three ways:

1. **Uncovered tools:** 16 tools have no command home today.
   - L5 lifecycle/shared memory: `shared_space_upsert`, `shared_space_membership_set`, `shared_memory_status`, `shared_memory_enable`
   - L6 analysis: `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `eval_run_ablation`, `eval_reporting_dashboard`
   - L7 maintenance: `memory_get_learning_history`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`

2. **Stale parameter docs:** existing command docs do not describe the full current retrieval, mutation, compatibility, and telemetry surface.
   - `context.md` is missing advanced `memory_search` controls, the deprecated `minQualityScore` alias, and `memory_match_triggers` cognitive parameters.
   - `save.md` is missing governance/provenance/retention details present in the live tool definition.
   - `manage.md` is missing current stats/health/list/update/validate/bulk-delete/history details.

3. **Structural drift:** the docs still contain stale command naming and incomplete workflow ownership.
   - `manage.md` still has the `## 189. RELATED COMMANDS` numbering error.
   - `checkpoint_delete` still lacks required `confirmName` documentation.
   - The README still describes a 5-command suite instead of the planned 8-command surface.
   - The history workflow is not yet locked to `/memory:manage history <specFolder>`.

### Purpose

Bring the memory command docs into full alignment with the current MCP tool schemas so that:
- every live tool has a documented command home
- every live command-facing property and compatibility alias is documented
- shared memory, analysis, and ingest workflows are discoverable from commands
- the README is an accurate index of the final 8-command memory suite
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Category | Items |
|----------|-------|
| **Update existing commands** | `context.md`, `save.md`, `manage.md`, `learn.md`, `continue.md` |
| **Create new commands** | `/memory:analyze`, `/memory:shared`, `/memory:ingest` |
| **Update README.txt** | Reflect final 8-command structure, examples, and tool coverage |
| **History ownership** | Reserve `memory_get_learning_history` under `/memory:manage history <specFolder>` |
| **Parameter alignment** | Document the live command-facing surface defined by `tool-schemas.ts` plus `ALLOWED_PARAMETERS` in `schemas/tool-input-schemas.ts` |

### Out of Scope

- MCP server implementation changes
- SKILL.md updates
- CLAUDE.md / AGENTS.md updates
- New MCP tool creation
- Spec-folder artifacts outside `spec.md`, `plan.md`, and `tasks.md` for this refinement pass

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| D1 | Updated `context.md` | Add missing `memory_context`, `memory_search`, and `memory_match_triggers` docs, including the `minQualityScore` compatibility alias |
| D2 | Updated `save.md` | Add governance/provenance/retention coverage and `/memory:ingest` cross-reference |
| D3 | Updated `manage.md` | Add missing mutation/health/history docs, fix numbering, and document `confirmName` |
| D4 | Updated `learn.md` | Verify current schema references and checkpoint-delete behavior notes |
| D5 | Updated `continue.md` | Add history reference and refresh recovery tool signatures |
| D6 | New `analyze.md` | Command home for all L6 analysis and eval tools |
| D7 | New `shared.md` | Command home for all L5 shared-memory tools |
| D8 | New `ingest.md` | Command home for all L7 async ingest tools |
| D9 | Updated `README.txt` | Accurate 8-command index, examples, and tool coverage matrix |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CA-001 | All 32 live MCP tools have a command home | Every tool in `TOOL_DEFINITIONS` is documented in exactly one primary command home, with cross-references where helpful |
| CA-002 | All live command-facing properties and aliases are documented | Every property listed in `tool-schemas.ts` and every allowed parameter listed in `ALLOWED_PARAMETERS` has a corresponding documentation entry, including compatibility aliases such as `minQualityScore` |
| CA-003 | `manage.md` numbering error is fixed | `## 189. RELATED COMMANDS` is corrected to the proper section number |
| CA-004 | `checkpoint_delete` safety contract is documented | `manage.md` states that `confirmName` is required and must exactly match `name` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CA-005 | New `/memory:analyze` command covers all L6 analysis tools | `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `eval_run_ablation`, and `eval_reporting_dashboard` are documented there |
| CA-006 | New `/memory:shared` command covers all L5 shared-memory tools | `shared_space_upsert`, `shared_space_membership_set`, `shared_memory_status`, and `shared_memory_enable` are documented there |
| CA-007 | New `/memory:ingest` command covers all L7 async ingest tools | `memory_ingest_start`, `memory_ingest_status`, and `memory_ingest_cancel` are documented there |
| CA-008 | `context.md` documents the current retrieval surface | Includes `includeTrace`, `tokenUsage`, advanced `memory_search` parameters, deprecated `minQualityScore`, and `memory_match_triggers` cognitive parameters (`session_id`, `turnNumber`, `include_cognitive`) |
| CA-009 | `save.md` documents the current save surface | Includes governance/provenance/retention details and explicit routing to `/memory:ingest` for async bulk ingestion |
| CA-010 | `manage.md` owns learning history | `/memory:manage history <specFolder>` is documented as the command home for `memory_get_learning_history` |
| CA-011 | `manage.md` documents all missing mutation/discovery parameters | Includes `includeChunks`, `allowPartialUpdate`, current stats/health parameters, validation telemetry fields, and `skipCheckpoint` |
| CA-012 | README reflects the final 8-command suite | Commands, examples, and coverage table are internally consistent and use the final `history` subcommand name everywhere |

### P2 - Desired

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CA-013 | Command docs include layer annotations | MCP tool references clearly indicate their L1-L7 layer where helpful |
| CA-014 | README includes a command-to-tool coverage matrix | Every tool is mapped to its primary command home |
| CA-015 | Feature-flag notes are decision-safe | Commands mention feature flags only where they still materially change command behavior in the current codebase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 5. ACCEPTANCE SCENARIOS

### Scenario A: Coverage Audit

Given the current `TOOL_DEFINITIONS` list,
when the command docs are audited,
then all 32 tools have a documented home and no uncovered tools remain.

### Scenario B: Retrieval Compatibility Audit

Given `context.md`,
when a reviewer compares it against the current retrieval schemas,
then advanced `memory_search`, `memory_match_triggers`, and `minQualityScore` compatibility behavior are all documented.

### Scenario C: Manage History Audit

Given `manage.md`,
when a reviewer looks up learning history and checkpoint deletion workflows,
then the doc uses `/memory:manage history <specFolder>` and documents `confirmName` as required.

### Scenario D: README Index Audit

Given `README.txt`,
when a reviewer compares it against the final command suite,
then it shows 8 commands, current examples, and a complete tool coverage table.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:gap-analysis -->
## 6. GAP ANALYSIS

### 6.1 Current Tool Coverage Matrix

| Layer | Tool | Current Command | Status | Gap |
|-------|------|----------------|--------|-----|
| L1 | `memory_context` | `context.md`, `continue.md` | PARTIAL | Missing `includeTrace` / `tokenUsage` coverage in command docs |
| L2 | `memory_search` | `context.md`, `manage.md`, `learn.md`, `continue.md` | PARTIAL | Advanced params, compatibility alias, and governance docs incomplete |
| L2 | `memory_match_triggers` | `context.md` | PARTIAL | Missing `session_id`, `turnNumber`, `include_cognitive` docs |
| L2 | `memory_save` | `save.md`, `learn.md` | PARTIAL | Governance/provenance/retention docs missing from command set |
| L3 | `memory_list` | `manage.md`, `learn.md`, `continue.md` | PARTIAL | Missing `includeChunks` docs |
| L3 | `memory_stats` | `manage.md`, `save.md`, `learn.md`, `continue.md` | PARTIAL | Missing ranking/filter parameter docs |
| L3 | `memory_health` | `manage.md` | PARTIAL | Missing current health/report params |
| L4 | `memory_delete` | `manage.md`, `learn.md` | PARTIAL | Dual-mode contract needs clearer explanation |
| L4 | `memory_update` | `manage.md`, `save.md` | PARTIAL | Missing `allowPartialUpdate` docs |
| L4 | `memory_validate` | `manage.md` | PARTIAL | Missing feedback telemetry parameter docs |
| L4 | `memory_bulk_delete` | `manage.md` | PARTIAL | Missing `skipCheckpoint` docs |
| L5 | `checkpoint_create` | `manage.md` | COVERED | Keep aligned |
| L5 | `checkpoint_list` | `manage.md` | COVERED | Keep aligned |
| L5 | `checkpoint_restore` | `manage.md` | COVERED | Keep aligned |
| L5 | `checkpoint_delete` | `manage.md` | PARTIAL | Missing required `confirmName` docs |
| L5 | `shared_space_upsert` | NONE | UNCOVERED | New `/memory:shared` command needed |
| L5 | `shared_space_membership_set` | NONE | UNCOVERED | New `/memory:shared` command needed |
| L5 | `shared_memory_status` | NONE | UNCOVERED | New `/memory:shared` command needed |
| L5 | `shared_memory_enable` | NONE | UNCOVERED | New `/memory:shared` command needed |
| L6 | `task_preflight` | NONE | UNCOVERED | New `/memory:analyze` command needed |
| L6 | `task_postflight` | NONE | UNCOVERED | New `/memory:analyze` command needed |
| L6 | `memory_drift_why` | NONE | UNCOVERED | New `/memory:analyze` command needed |
| L6 | `memory_causal_link` | NONE | UNCOVERED | New `/memory:analyze` command needed |
| L6 | `memory_causal_stats` | NONE | UNCOVERED | New `/memory:analyze` command needed |
| L6 | `memory_causal_unlink` | NONE | UNCOVERED | New `/memory:analyze` command needed |
| L6 | `eval_run_ablation` | NONE | UNCOVERED | New `/memory:analyze` command needed |
| L6 | `eval_reporting_dashboard` | NONE | UNCOVERED | New `/memory:analyze` command needed |
| L7 | `memory_index_scan` | `manage.md`, `save.md`, `learn.md` | COVERED | Keep aligned |
| L7 | `memory_get_learning_history` | NONE | UNCOVERED | Add to `/memory:manage history <specFolder>` |
| L7 | `memory_ingest_start` | NONE | UNCOVERED | New `/memory:ingest` command needed |
| L7 | `memory_ingest_status` | NONE | UNCOVERED | New `/memory:ingest` command needed |
| L7 | `memory_ingest_cancel` | NONE | UNCOVERED | New `/memory:ingest` command needed |

**Summary:** 32 tools total, 16 uncovered, 16 already documented somewhere but still requiring partial-alignment work.

### 6.2 Document-Specific Gaps

| Document | Gap Summary |
|----------|-------------|
| `context.md` | Missing `memory_context` trace/budget params, advanced `memory_search` controls, deprecated `minQualityScore`, and `memory_match_triggers` cognitive parameters |
| `save.md` | Missing governance/provenance/retention details and async ingest routing guidance |
| `manage.md` | Missing history subcommand, current stats/health/mutation telemetry params, and checkpoint-delete safety docs |
| `learn.md` | Needs schema-sync verification against current delete/search/save references |
| `continue.md` | Needs current retrieval signature verification and explicit history enrichment reference |
| `README.txt` | Still describes a 5-command suite and omits current tool ownership |

### 6.3 Behavioral Documentation Gaps

| Feature | Command Impact |
|---------|----------------|
| Deep retrieval fallback | `context.md` must state that `mode: "deep"` does not guarantee query expansion for simple queries |
| Learned feedback extraction | `manage.md` validate docs must explain that telemetry params support learned feedback and promotion behavior |
| Deny-by-default shared spaces | `/memory:shared` must state that membership is required before access |
| Governance boundaries | Commands should explain that tenant/user/agent scoping matters only when scope enforcement is active |

### 6.4 Source-of-Truth Notes

- `tool-schemas.ts` is the canonical ordered tool inventory and property definition source.
- `schemas/tool-input-schemas.ts` is the validation/allowed-parameter mirror and must be checked for aliases and command-facing parameter parity.
- The refinement assumes command docs must describe the live command-facing surface exposed by those files, not older draft counts or earlier sprint-era summaries.
<!-- /ANCHOR:gap-analysis -->

---

<!-- ANCHOR:implementation-decisions -->
## 7. IMPLEMENTATION DECISIONS

The following decisions are locked for implementation:

1. `memory_get_learning_history` belongs to `/memory:manage history <specFolder>`.
2. Eval tools remain inside `/memory:analyze`; no `/memory:eval` command is introduced.
3. Shared-memory lifecycle tools belong to `/memory:shared`.
4. Async ingestion tools belong to `/memory:ingest`, not `/memory:manage`.
5. `context.md` must treat `minQualityScore` as a deprecated alias of `min_quality_score`, not a separate capability.
6. Feature flags should be documented only where they materially affect command behavior in the current repo.
7. Verification must produce a generated 32-tool coverage table so implementation can prove nothing was missed.
<!-- /ANCHOR:implementation-decisions -->

---

<!-- ANCHOR:approach -->
## 8. APPROACH

### Phase 0: Schema Sync

Start implementation by comparing `TOOL_DEFINITIONS` in `tool-schemas.ts` with `ALLOWED_PARAMETERS` in `schemas/tool-input-schemas.ts` and generating a tool-to-command coverage baseline.

### Phase 1: Update Existing Commands

Update `context.md`, `save.md`, `manage.md`, `learn.md`, and `continue.md` to match the current surface, reserve `/memory:manage history`, and remove stale legacy history naming.

### Phase 2: Create New Commands

Create `/memory:analyze`, `/memory:shared`, and `/memory:ingest` using the established command pattern and the implementation decisions above.

### Phase 3: Update the README

Refresh the memory README to reflect the final 8-command structure, current examples, and a complete tool coverage matrix.

### Phase 4: Verify Coverage and Consistency

Confirm that every live tool and every live parameter has a documented home, command names are internally consistent, and README/index references match the final command structure.
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:risks -->
## 9. RISKS

| Risk | Impact | Mitigation |
|------|--------|------------|
| Command docs become too large | Medium | Group advanced parameters into dedicated subsections and keep primary workflows readable |
| Shared/governance features confuse single-agent readers | Low | Label those sections as advanced or rollout-dependent rather than presenting them as always-on |
| Schema files drift again before implementation | Medium | Phase 0 schema sync is mandatory and should be rerun before command edits start |
| README and per-command docs diverge | Medium | Verification must include command-name, subcommand-name, and tool-home consistency checks |
<!-- /ANCHOR:risks -->

---

## RELATED DOCUMENTS

- **Parent Epic**: `022-hybrid-rag-fusion/spec.md`
- **Tool Inventory**: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- **Parameter Mirror**: `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- **Command Directory**: `.opencode/command/memory/`
- **Hydra Source Context**: `014-hydra-db-based-features/`
- **RAG Sprint Source Context**: `005-core-rag-sprints-0-to-9/`

---

<!--
SPEC: 016-command-alignment
Level 2 planning artifact refreshed on 2026-03-15
Scope: planning docs only for 5 command updates + 3 new commands + 1 README update
Source of truth: tool-schemas.ts + schemas/tool-input-schemas.ts (32 tools)
-->
