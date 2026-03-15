---
title: "Tasks: Command Alignment"
description: "Executable task breakdown for aligning the memory command docs with the current 32-tool MCP schema surface."
---
<!-- SPECKIT_LEVEL: 2 -->
# Tasks: 016-command-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:task-summary -->
## TASK SUMMARY

| Metric | Value |
|--------|-------|
| Total Tasks | 24 |
| Phase 0 (Schema Sync) | 3 tasks (T00-T02) |
| Phase 1 (Update Existing) | 8 tasks (T03-T10) |
| Phase 2 (New Commands) | 6 tasks (T11-T16) |
| Phase 3 (README Update) | 2 tasks (T17-T18) |
| Phase 4 (Verification) | 5 tasks (T19-T23) |
| Estimated LOC | ~900 |
| Parallelizable | Phase 1 and Phase 2 are mostly parallel after Phase 0 |
<!-- /ANCHOR:task-summary -->

---

<!-- ANCHOR:phase-0 -->
## PHASE 0: SCHEMA SYNC

### T00: Recount live tool inventory
- **Priority:** P0
- **Files:** `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- **Action:** Count `TOOL_DEFINITIONS` and record the live total as 32 in the implementation notes and verification outputs.
- **Acceptance:** The implementation pass uses 32 as the only valid tool count and removes any stale older count references.
- **Covers:** CA-001
- [x] Done

### T01: Build command-facing parameter baseline
- **Priority:** P0
- **Files:** `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- **Action:** Compare tool properties against `ALLOWED_PARAMETERS` to create the parameter and alias baseline used for command-doc updates.
- **Acceptance:** A current list exists for every tool showing the parameters and aliases that the command docs must cover.
- **Covers:** CA-002
- [x] Done

### T02: Generate pre-change coverage table
- **Priority:** P0
- **Files:** `.opencode/command/memory/*.md`, `.opencode/command/memory/README.txt`
- **Action:** Generate a tool-to-command coverage table for the current docs to confirm which tools are uncovered and which are partial.
- **Acceptance:** The implementation pass starts from a generated 32-row coverage baseline with 16 uncovered tools identified.
- **Covers:** CA-001, CA-014
- [x] Done
<!-- /ANCHOR:phase-0 -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: UPDATE EXISTING COMMANDS

### T03: Update `context.md` for `memory_context`
- **Priority:** P1
- **File:** `.opencode/command/memory/context.md`
- **Action:** Add missing `memory_context` parameters to the primary tool signature and workflow sections.
- **Parameters to document:**
  - `includeTrace`
  - `tokenUsage`
- **Acceptance:** Both parameters appear in the main tool signature and in workflow guidance that explains when they matter.
- **Covers:** CA-008
- [x] Done

### T04: Update `context.md` for advanced retrieval and trigger cognition
- **Priority:** P1
- **File:** `.opencode/command/memory/context.md`
- **Action:** Expand retrieval docs to cover the current `memory_search` and `memory_match_triggers` surface.
- **Parameters and compatibility items to document:**
  - `concepts`
  - `tenantId`, `userId`, `agentId`, `sharedSpaceId`
  - `enableSessionBoost`, `enableCausalBoost`
  - `min_quality_score`
  - `minQualityScore` as a deprecated alias of `min_quality_score`
  - `bypassCache`, `rerank`, `applyLengthPenalty`, `applyStateLimits`, `minState`
  - `autoDetectIntent`, `trackAccess`, `includeArchived`, `includeContiguity`, `includeConstitutional`, `includeTrace`
  - `session_id`, `turnNumber`, `include_cognitive`
- **Acceptance:** `context.md` fully documents the advanced retrieval surface, including the deprecated alias and trigger-cognition parameters.
- **Covers:** CA-002, CA-008
- [x] Done

### T05: Update `save.md` for governance/provenance/retention
- **Priority:** P1
- **File:** `.opencode/command/memory/save.md`
- **Action:** Add the current governance, provenance, and retention parameter docs to the save command.
- **Parameters to document:**
  - `tenantId`, `userId`, `agentId`, `sessionId`, `sharedSpaceId`
  - `provenanceSource`, `provenanceActor`, `governedAt`
  - `retentionPolicy`, `deleteAfter`
- **Acceptance:** `save.md` contains a dedicated section for these parameters and explains that they are rollout-dependent advanced behavior.
- **Covers:** CA-002, CA-009
- [x] Done

### T06: Update `save.md` routing and behavioral notes
- **Priority:** P1
- **File:** `.opencode/command/memory/save.md`
- **Action:** Add explicit `/memory:ingest` routing for async bulk ingestion and retain only behavior notes that still change the command contract in the current repo.
- **Acceptance:** `save.md` clearly distinguishes synchronous save/indexing from async ingest workflows and references `/memory:ingest` in the correct sections.
- **Covers:** CA-009, CA-015
- [x] Done

### T07: Update `manage.md` for numbering and checkpoint safety
- **Priority:** P0
- **File:** `.opencode/command/memory/manage.md`
- **Action:** Fix the `## 189. RELATED COMMANDS` numbering error and document `confirmName` as required for checkpoint deletion.
- **Acceptance:** The section numbering is corrected and `checkpoint_delete` explicitly requires `confirmName` to exactly match `name`.
- **Covers:** CA-003, CA-004
- [x] Done

### T08: Update `manage.md` for current mutation/discovery parameters
- **Priority:** P1
- **File:** `.opencode/command/memory/manage.md`
- **Action:** Add all currently missing stats, health, list, update, validate, and bulk-delete docs.
- **Parameters to document:**
  - `memory_stats`: `folderRanking`, `excludePatterns`, `includeScores`, `includeArchived`, `limit`
  - `memory_health`: `reportMode`, `limit`, `specFolder`, `autoRepair`, `confirmed`
  - `memory_list`: `includeChunks`
  - `memory_update`: `allowPartialUpdate`
  - `memory_validate`: `queryId`, `queryTerms`, `resultRank`, `totalResultsShown`, `searchMode`, `intent`, `sessionId`, `notes`
  - `memory_bulk_delete`: `skipCheckpoint`
- **Acceptance:** `manage.md` documents every currently missing parameter listed above and explains dual-mode delete behavior where relevant.
- **Covers:** CA-002, CA-011
- [x] Done

### T09: Add `/memory:manage history <specFolder>`
- **Priority:** P1
- **File:** `.opencode/command/memory/manage.md`
- **Action:** Add a dedicated history section and lock the subcommand name to `history`.
- **Tool to document:** `spec_kit_memory_memory_get_learning_history`
- **Parameters to document:** `specFolder`, `sessionId`, `limit`, `onlyComplete`, `includeSummary`
- **Acceptance:** `manage.md` uses `/memory:manage history <specFolder>` consistently and does not use any legacy hyphenated history name.
- **Covers:** CA-010
- [x] Done

### T10: Refresh `learn.md` and `continue.md`
- **Priority:** P2
- **Files:** `.opencode/command/memory/learn.md`, `.opencode/command/memory/continue.md`
- **Action:** Verify current schema references in both files and add the history workflow reference where needed.
- **Acceptance:** Both files remain aligned with current tool signatures, and `continue.md` references `/memory:manage history <specFolder>` for richer recovery context.
- **Covers:** CA-002
- [x] Done
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: CREATE NEW COMMANDS

### T11: Create `analyze.md` structure and routing
- **Priority:** P1
- **File:** `.opencode/command/memory/analyze.md`
- **Action:** Create the new command with frontmatter, mandatory first action, contract, routing, enforcement, and related-command sections.
- **Subcommands to reserve:**
  - `preflight`
  - `postflight`
  - `causal`
  - `link`
  - `unlink`
  - `causal-stats`
  - `ablation`
  - `dashboard`
- **Acceptance:** `analyze.md` exists with the complete routing skeleton and the correct tool ownership.
- **Covers:** CA-005
- [x] Done

### T12: Implement `analyze.md` tool workflows
- **Priority:** P1
- **File:** `.opencode/command/memory/analyze.md`
- **Action:** Document all L6 analysis/eval tool signatures, workflows, dashboards, and error handling.
- **Tools to document:**
  - `task_preflight`
  - `task_postflight`
  - `memory_drift_why`
  - `memory_causal_link`
  - `memory_causal_stats`
  - `memory_causal_unlink`
  - `eval_run_ablation`
  - `eval_reporting_dashboard`
- **Acceptance:** `analyze.md` is the clear command home for all 8 L6 tools.
- **Covers:** CA-005, CA-013, CA-015
- [x] Done

### T13: Create `shared.md`
- **Priority:** P1
- **File:** `.opencode/command/memory/shared.md`
- **Action:** Create the shared-memory command with enable/create/member/status flows and deny-by-default rollout notes.
- **Tools to document:**
  - `shared_space_upsert`
  - `shared_space_membership_set`
  - `shared_memory_status`
  - `shared_memory_enable`
- **Acceptance:** `shared.md` exists and fully documents shared-space enablement, creation, membership, and status inspection.
- **Covers:** CA-006, CA-013, CA-015
- [x] Done

### T14: Create `ingest.md`
- **Priority:** P1
- **File:** `.opencode/command/memory/ingest.md`
- **Action:** Create the async ingest command with start/status/cancel flows.
- **Tools to document:**
  - `memory_ingest_start`
  - `memory_ingest_status`
  - `memory_ingest_cancel`
- **Acceptance:** `ingest.md` exists and clearly differentiates async ingest from `/memory:save` and `/memory:manage scan`.
- **Covers:** CA-007, CA-013
- [x] Done

### T15: Verify command registration assumptions
- **Priority:** P1
- **Files:** `.opencode/command/memory/`
- **Action:** Confirm whether directory presence is sufficient for new command discovery and document any additional registration steps if they exist.
- **Acceptance:** The implementation pass knows whether any explicit registration beyond file creation is required.
- **Covers:** CA-005, CA-006, CA-007
- [x] Done

### T16: Add related-command cross-links
- **Priority:** P2
- **Files:** All 8 command files
- **Action:** Update related-command sections so the final suite cross-links correctly.
- **Acceptance:** Every command references the correct adjacent commands and uses the final `history` name consistently.
- **Covers:** CA-012, CA-013
- [x] Done
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: UPDATE README

### T17: Refresh README structure and examples
- **Priority:** P1
- **File:** `.opencode/command/memory/README.txt`
- **Action:** Expand the README from 5 commands to 8 and refresh the usage examples.
- **Required updates:**
  - command table
  - directory tree
  - usage examples
  - manage subcommand list using `history`
  - troubleshooting notes for the new commands
- **Acceptance:** README describes the final 8-command suite and uses only final subcommand names.
- **Covers:** CA-012
- [x] Done

### T18: Add README coverage matrix
- **Priority:** P1
- **File:** `.opencode/command/memory/README.txt`
- **Action:** Add a complete tool-to-command coverage table for all 32 tools.
- **Acceptance:** Every live tool is mapped to its primary command home in the README.
- **Covers:** CA-012, CA-014
- [x] Done
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## PHASE 4: VERIFICATION

### T19: Generate post-change 32-tool coverage table
- **Priority:** P0
- **Files:** Command docs + live schema files
- **Action:** Generate a post-change coverage table from the live 32-tool inventory and store or report it as verification evidence.
- **Acceptance:** The generated table shows 32/32 tools mapped with zero uncovered tools.
- **Covers:** CA-001, CA-014
- [x] Done

### T20: Run parameter and alias completeness audit
- **Priority:** P0
- **Files:** Command docs + live schema files
- **Action:** Compare every documented command home against the combined property surface from `tool-schemas.ts` and `ALLOWED_PARAMETERS`.
- **Acceptance:** All live properties and aliases, including `minQualityScore`, are documented.
- **Covers:** CA-002
- [x] Done

### T21: Grep stale strings and naming drift
- **Priority:** P1
- **Files:** Command docs, README, planning docs
- **Action:** Search for stale older-count text, legacy hyphenated history naming, and unresolved open-question phrasing.
- **Acceptance:** No stale counts, stale subcommand names, or unresolved open-question text remain.
- **Covers:** CA-012
- [x] Done

### T22: Verify requirement-to-task traceability
- **Priority:** P1
- **Files:** `spec.md`, `tasks.md`
- **Action:** Check that each acceptance requirement in `spec.md` maps cleanly to at least one concrete task.
- **Acceptance:** No requirement is left without an owning task.
- **Covers:** CA-001, CA-002, CA-003, CA-004, CA-005, CA-006, CA-007, CA-008, CA-009, CA-010, CA-011, CA-012, CA-013, CA-014, CA-015
- [x] Done

### T23: Run spec validation and record known out-of-scope result
- **Priority:** P1
- **Files:** Spec folder
- **Action:** Run the spec validator after the doc edits and record that missing `checklist.md` is a known out-of-scope artifact for this refinement pass.
- **Acceptance:** Validation is rerun, and any remaining failure caused only by missing `checklist.md` is explicitly noted.
- **Covers:** CA-012
- [x] Done
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:dependencies -->
## TASK DEPENDENCY GRAPH

```text
Phase 0:
  T00 -> T01 -> T02

Phase 1:
  T03 ─┐
  T04 ─┤
  T05 ─┤
  T06 ─┤
  T07 ─┤── start after T02
  T08 ─┤
  T09 ─┤
  T10 ─┘

Phase 2:
  T11 -> T12
  T13 ─┐
  T14 ─┤── start after T02
  T15 ─┤
  T16 ─┘ (depends on T11-T15)

Phase 3:
  T17 -> T18

Phase 4:
  T19 ─┐
  T20 ─┤
  T21 ─┤── start after T18
  T22 ─┤
  T23 ─┘
```
<!-- /ANCHOR:dependencies -->

---

<!--
TASKS: 016-command-alignment
24/24 tasks complete
Built around 32-tool schema sync, fixed command ownership, and proof-oriented verification
-->
