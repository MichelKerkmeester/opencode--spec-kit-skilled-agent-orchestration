---
title: "Tasks: Command Alignment"
description: "Task breakdown for aligning memory commands with MCP tool schemas."
---
<!-- SPECKIT_LEVEL: 2 -->
# Tasks: 016-command-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## TASK SUMMARY

| Metric | Value |
|--------|-------|
| Total Tasks | 23 |
| Phase 1 (Update Existing) | 11 tasks (T01-T09c) |
| Phase 2 (New Commands) | 6 tasks (T10-T15) |
| Phase 3 (Index Update) | 2 tasks (T16-T17) |
| Phase 4 (Verification) | 4 tasks (T18-T21) |
| Estimated LOC | ~900 |
| Parallelizable | Phases 1+2 fully parallel |

---

## PHASE 1: UPDATE EXISTING COMMANDS

### T01: Update context.md — memory_context params
- **Priority:** P1
- **File:** `.opencode/command/memory/context.md`
- **Action:** Add missing `memory_context` parameters to MCP Tool Signature section
- **Params to add:**
  - `includeTrace` (boolean, default false) — Include provenance-rich trace data
  - `tokenUsage` (number, 0.0-1.0) — Caller token usage ratio
- **Acceptance:** Both params appear in the MCP Tool Signature code example and workflow step 3
- [ ] Done

### T02: Update context.md — memory_search advanced params
- **Priority:** P1
- **File:** `.opencode/command/memory/context.md`
- **Action:** Add new "Advanced Search Parameters" subsection documenting memory_search params that affect context retrieval
- **Params to add (18 params):**
  - `concepts` (array, 2-5 strings) — Multi-concept AND search
  - `tenantId`, `userId`, `agentId`, `sharedSpaceId` — Governance boundaries
  - `enableSessionBoost` (boolean) — Session-based score boost
  - `enableCausalBoost` (boolean) — Causal-neighbor boost (2-hop traversal)
  - `min_quality_score` (number, 0-1) — Minimum quality score threshold
  - `bypassCache` (boolean) — Skip tool cache for fresh results
  - `rerank` (boolean, default true) — Cross-encoder reranking
  - `applyLengthPenalty` (boolean, default true) — Length-based penalty during reranking
  - `applyStateLimits` (boolean) — Per-tier quantity limits
  - `minState` (enum: HOT/WARM/COLD/DORMANT/ARCHIVED) — Minimum memory state filter
  - `autoDetectIntent` (boolean, default true) — Auto-detect intent from query
  - `trackAccess` (boolean, default false) — Write FSRS strengthening updates on read
  - `includeArchived` (boolean) — Include archived memories
  - `includeContiguity` (boolean) — Include adjacent memories
  - `includeConstitutional` (boolean, default true) — Include constitutional tier
  - `includeTrace` (boolean) — Provenance-rich trace envelope
- **Acceptance:** All 18 params documented in a reference table; workflow notes which are commonly used vs advanced
- [ ] Done

### T03: Update save.md — governance/provenance/retention params
- **Priority:** P1
- **File:** `.opencode/command/memory/save.md`
- **Action:** Add "Governance & Provenance Parameters" subsection to MCP Tool Signature section
- **Params to add (10 params):**
  - `tenantId` (string) — Tenant boundary for governed ingest
  - `userId` (string) — User boundary for governed ingest
  - `agentId` (string) — Agent boundary for governed ingest
  - `sessionId` (string) — Session boundary for governed ingest
  - `sharedSpaceId` (string) — Shared-memory space for collaboration saves
  - `provenanceSource` (string) — Required when governance guardrails enabled
  - `provenanceActor` (string) — Required when governance guardrails enabled
  - `governedAt` (string) — ISO timestamp, defaults to now
  - `retentionPolicy` (enum: keep/ephemeral/shared) — Retention class
  - `deleteAfter` (string) — ISO timestamp for retention sweep
- **Acceptance:** All 10 params in a dedicated table; workflow notes that these are "Multi-Agent / Enterprise" features
- [ ] Done

### T04: Update save.md — reference ingest command
- **Priority:** P2
- **File:** `.opencode/command/memory/save.md`
- **Action:** Add cross-reference to `/memory:ingest` in the Related Commands section and in the indexing options section for bulk file ingestion use cases
- **Acceptance:** Related Commands section includes `/memory:ingest` entry
- [ ] Done

### T05: Update manage.md — fix section numbering
- **Priority:** P0
- **File:** `.opencode/command/memory/manage.md`
- **Action:** Change section "189" to "19" (line ~839: `## 189. RELATED COMMANDS` → `## 19. RELATED COMMANDS`)
- **Acceptance:** Section numbering is sequential 1-21 with no jumps
- [ ] Done

### T06: Update manage.md — add missing tool params
- **Priority:** P1
- **File:** `.opencode/command/memory/manage.md`
- **Action:** Add missing parameters to existing tool documentation sections
- **Changes:**
  - **Section 7 (Stats):** Add `folderRanking` (enum), `excludePatterns` (array), `includeArchived` (boolean), `limit` (number) to stats tool signature and dashboard
  - **Section 8 (Scan):** Verify `memory_index_scan` params match tool-schemas.ts (currently aligned)
  - **Section 10 (Tier):** No changes needed
  - **Section 11 (Triggers):** No changes needed
  - **Section 12 (Validate):** Add `queryId`, `queryTerms`, `resultRank`, `totalResultsShown`, `searchMode`, `intent`, `sessionId`, `notes` to validate tool signature
  - **Section 13 (Delete):** Note `x-requiredAnyOf` dual-mode (id OR specFolder+confirm)
  - **Section 14 (Health):** Add `reportMode` (enum: full/divergent_aliases), `autoRepair` (boolean), `confirmed` (boolean), `specFolder` (string) to health tool signature and dashboard
  - **Section 15 (Bulk Delete):** Add `skipCheckpoint` (boolean) to bulk delete signature
  - **Section 16 (Checkpoints):** Add `confirmName` (string, REQUIRED) to checkpoint_delete. Note it must exactly match `name`.
- **Acceptance:** Every property in the relevant tool schemas has a corresponding entry in manage.md
- [ ] Done

### T07: Update manage.md — add memory_get_learning_history section
- **Priority:** P1
- **File:** `.opencode/command/memory/manage.md`
- **Action:** Add new "Learning History" section (between Health and Checkpoints, as section 15.5 or renumber)
- **Content:**
  - Trigger: `/memory:manage learning-history <specFolder>`
  - Tool: `spec_kit_memory_memory_get_learning_history`
  - Params: specFolder (required), sessionId (optional), limit (default 10), onlyComplete (boolean), includeSummary (boolean)
  - Dashboard format showing preflight/postflight records with Learning Index deltas
- **Acceptance:** Learning history subcommand documented with tool signature, dashboard format, and example
- [ ] Done

### T08: Update manage.md — add memory_list includeChunks and memory_update allowPartialUpdate
- **Priority:** P1
- **File:** `.opencode/command/memory/manage.md`
- **Action:** Add `includeChunks` param to memory_list tool signature (Section 6 MCP Enforcement Matrix). Add `allowPartialUpdate` param to memory_update tool signature (Section 10 Tier Management or wherever update is documented).
- **Acceptance:** Both params documented in tool signatures
- [ ] Done

### T09: Update learn.md and continue.md — minor alignment
- **Priority:** P2
- **Files:** `.opencode/command/memory/learn.md`, `.opencode/command/memory/continue.md`
- **Action:**
  - learn.md: Verify `memory_save`, `memory_search`, `memory_index_scan`, `memory_delete` tool signatures match current schemas. Add any missing params.
  - continue.md: Verify `memory_context`, `memory_search`, `memory_list`, `memory_stats` tool signatures match current schemas. Add `memory_get_learning_history` reference for enriching recovery context.
- **Acceptance:** Tool signatures in both files match tool-schemas.ts; continue.md references learning history
- [ ] Done

---

### T09b: Document behavioral changes in save.md and context.md
- **Priority:** P1
- **Files:** `.opencode/command/memory/save.md`, `.opencode/command/memory/context.md`
- **Action:** Add behavioral documentation for Sprint 4-5 features:
  - **save.md**: Document reconsolidation-on-save behavior (merge/replace/store-new thresholds at 0.88/0.75) behind `SPECKIT_RECONSOLIDATION` flag. Document pre-storage quality gate (3-layer: structural, content-quality-score, semantic-dedup >0.92) behind `SPECKIT_SAVE_QUALITY_GATE`. Note that `dryRun` is the probe mechanism for the quality gate.
  - **context.md**: Document that `mode: "deep"` (R12 query expansion) is mutually exclusive with R15 simple-query classification. Deep mode silently no-ops on simple queries.
- **Acceptance:** Both behavioral notes appear in relevant workflow sections with feature flag references
- [ ] Done

### T09c: Document auto-promotion in manage.md validate section
- **Priority:** P1
- **File:** `.opencode/command/memory/manage.md`
- **Action:** In the Validate Mode section, explain that `wasUseful=true` drives auto-promotion (normal→important at 5 positives, important→critical at 10). `wasUseful=false` applies a 0.3-floor confidence multiplier. The new params (queryTerms, resultRank, etc.) support learned feedback extraction for R11.
- **Acceptance:** Auto-promotion behavior documented with thresholds
- [ ] Done

---

## PHASE 2: CREATE NEW COMMANDS

### T10: Create analyze.md — argument routing and structure
- **Priority:** P1
- **File:** `.opencode/command/memory/analyze.md`
- **Action:** Create new command file with frontmatter, mandatory first action, purpose, contract, and argument routing sections
- **Frontmatter:**
  ```yaml
  description: Deep analysis tools - causal graph tracing, epistemic measurement, evaluation studies, and reporting dashboards
  argument-hint: "[preflight|postflight|causal|link|unlink|causal-stats|ablation|dashboard] [args]"
  allowed-tools: Read, spec_kit_memory_task_preflight, spec_kit_memory_task_postflight, spec_kit_memory_memory_drift_why, spec_kit_memory_memory_causal_link, spec_kit_memory_memory_causal_stats, spec_kit_memory_memory_causal_unlink, spec_kit_memory_eval_run_ablation, spec_kit_memory_eval_reporting_dashboard
  ```
- **Routing:** 8 subcommands per plan.md section 3.3
- **Acceptance:** File exists with correct frontmatter, routing logic, and placeholder sections
- [ ] Done

### T11: Create analyze.md — tool workflows and MCP enforcement
- **Priority:** P1
- **File:** `.opencode/command/memory/analyze.md`
- **Action:** Implement all 8 subcommand workflows with MCP tool signatures, dashboard formats, error handling, quick reference, and related commands
- **Tool Signatures (from tool-schemas.ts):**
  - task_preflight: specFolder, taskId, knowledgeScore, uncertaintyScore, contextScore, knowledgeGaps, sessionId
  - task_postflight: specFolder, taskId, knowledgeScore, uncertaintyScore, contextScore, gapsClosed, newGapsDiscovered
  - memory_drift_why: memoryId, maxDepth, direction, relations, includeMemoryDetails
  - memory_causal_link: sourceId, targetId, relation, strength, evidence
  - memory_causal_stats: (no params)
  - memory_causal_unlink: edgeId
  - eval_run_ablation: channels, groundTruthQueryIds, recallK, storeResults, includeFormattedReport
  - eval_reporting_dashboard: sprintFilter, channelFilter, metricFilter, limit, format
- **Acceptance:** All 8 tool workflows documented with correct params, MCP enforcement matrix, dashboards
- [ ] Done

### T12: Create shared.md — complete command
- **Priority:** P1
- **File:** `.opencode/command/memory/shared.md`
- **Action:** Create complete command file for L5 shared memory tools
- **Frontmatter:**
  ```yaml
  description: Manage shared memory spaces - create spaces, set memberships, inspect rollout status
  argument-hint: "[create|member|status] [args]"
  allowed-tools: Read, spec_kit_memory_shared_space_upsert, spec_kit_memory_shared_space_membership_set, spec_kit_memory_shared_memory_status
  ```
- **Tool Signatures:**
  - shared_space_upsert: spaceId, tenantId, name, rolloutEnabled, rolloutCohort, killSwitch
  - shared_space_membership_set: spaceId, subjectType, subjectId, role
  - shared_memory_status: tenantId, userId, agentId
- **Sections:** Purpose, contract, argument routing, MCP enforcement, 3 subcommand workflows, error handling, quick reference, related commands
- **Acceptance:** Complete command file matching existing patterns; all 3 tool params documented
- [ ] Done

### T13: Create ingest.md — complete command
- **Priority:** P1
- **File:** `.opencode/command/memory/ingest.md`
- **Action:** Create complete command file for L7 async ingestion tools
- **Frontmatter:**
  ```yaml
  description: Async bulk memory ingestion - start, monitor, and cancel batch indexing jobs
  argument-hint: "[start <paths...>] | [status <jobId>] | [cancel <jobId>]"
  allowed-tools: Read, Bash, spec_kit_memory_memory_ingest_start, spec_kit_memory_memory_ingest_status, spec_kit_memory_memory_ingest_cancel
  ```
- **Tool Signatures:**
  - memory_ingest_start: paths (array, required), specFolder (optional)
  - memory_ingest_status: jobId (required)
  - memory_ingest_cancel: jobId (required)
- **Sections:** Purpose, contract, argument routing, MCP enforcement, 3 subcommand workflows (start/status/cancel), error handling, quick reference, related commands
- **Acceptance:** Complete command file; all 3 tool params documented; differentiates from /memory:save (single file) and /memory:manage scan (workspace scan)
- [ ] Done

### T14: Register new commands in command system
- **Priority:** P1
- **Files:** Check if commands auto-register via directory presence or need explicit registration
- **Action:** Verify that placing .md files in `.opencode/command/memory/` is sufficient for command registration (check if any manifest or index needs updating beyond README.txt)
- **Acceptance:** New commands are invocable via `/memory:analyze`, `/memory:shared`, `/memory:ingest`
- [ ] Done

### T15: Add related command cross-references
- **Priority:** P2
- **Files:** All 8 command files
- **Action:** Update the "Related Commands" section at the bottom of each command file to reference the new commands where relevant:
  - context.md → add analyze, shared
  - save.md → add ingest, shared
  - manage.md → add analyze, ingest
  - learn.md → no changes needed
  - continue.md → add analyze (learning history)
  - analyze.md → reference context, manage, save
  - shared.md → reference save, manage, context
  - ingest.md → reference save, manage
- **Acceptance:** Every command's Related Commands section is accurate and complete
- [ ] Done

---

## PHASE 3: UPDATE INDEX

### T16: Update README.txt — 8-command structure
- **Priority:** P1
- **File:** `.opencode/command/memory/README.txt`
- **Action:** Update the README to reflect 8 commands instead of 5:
  - Section 2 (Commands): Add analyze, shared, ingest to command table
  - Section 3 (Structure): Add 3 new files to directory tree
  - Section 4 (Usage Examples): Add examples for new commands
  - Section 5 (Manage Subcommands): Add learning-history subcommand
  - Section 6 (Troubleshooting): Add troubleshooting for new commands
  - Section 7 (Related Documents): Verify links
- **Acceptance:** README.txt accurately describes all 8 commands with examples
- [ ] Done

### T17: Add tool coverage matrix to README.txt
- **Priority:** P2
- **File:** `.opencode/command/memory/README.txt`
- **Action:** Add a "Tool Coverage" section showing which MCP tool is documented in which command
- **Format:**
  ```
  | Tool | Layer | Command |
  |------|-------|---------|
  | memory_context | L1 | context |
  | memory_search | L2 | context |
  | ... | ... | ... |
  ```
- **Acceptance:** 29-row table with every tool mapped to its command home
- [ ] Done

---

## PHASE 4: VERIFICATION

### T18: Cross-reference tool-schemas.ts
- **Priority:** P0
- **Action:** Read TOOL_DEFINITIONS array from tool-schemas.ts. For each of the 29 tools, verify it appears in at least one command file with correct parameter documentation.
- **Acceptance:** 29/29 tools have command homes; zero uncovered tools remain
- [ ] Done

### T19: Parameter completeness check
- **Priority:** P0
- **Action:** For each tool, compare every property in its inputSchema.properties against the command file that documents it. Flag any missing params.
- **Acceptance:** 0 missing parameters across all 29 tools
- [ ] Done

### T20: Internal link verification
- **Priority:** P1
- **Action:** Check that all "Related Commands" sections in all 8 command files reference correct command names and descriptions
- **Acceptance:** No broken or stale cross-references
- [ ] Done

### T21: Quick reference accuracy
- **Priority:** P1
- **Action:** Verify all quick reference tables at the bottom of each command file match the actual invocation patterns and argument routing
- **Acceptance:** Every quick reference entry produces the documented result
- [ ] Done

---

## TASK DEPENDENCY GRAPH

```
Phase 1 (parallel):
  T01 ─┐
  T02 ─┤
  T03 ─┤
  T04 ─┤
  T05 ─┤── No dependencies, all parallel
  T06 ─┤
  T07 ─┤
  T08 ─┤
  T09 ─┘

Phase 2 (parallel):
  T10 → T11 (T11 depends on T10 for structure)
  T12 ─┐
  T13 ─┤── Independent of each other
  T14 ─┘
  T15 (depends on T10-T14 completing)

Phase 3 (depends on Phase 1+2):
  T16 (depends on T01-T15)
  T17 (depends on T16)

Phase 4 (depends on Phase 3):
  T18 ─┐
  T19 ─┤── Can run in parallel
  T20 ─┤
  T21 ─┘
```

---

## PROGRESS TRACKING

| Phase | Tasks | Complete | % |
|-------|-------|----------|---|
| Phase 1: Update Existing | T01-T09c | 0/11 | 0% |
| Phase 2: New Commands | T10-T15 | 0/6 | 0% |
| Phase 3: Index Update | T16-T17 | 0/2 | 0% |
| Phase 4: Verification | T18-T21 | 0/4 | 0% |
| **Total** | **T01-T21** | **0/23** | **0%** |

---

<!--
TASKS: 016-command-alignment (~250 lines)
21 tasks across 4 phases
Phase 1+2 parallelizable (15 tasks)
Phase 3+4 sequential (6 tasks)
-->
