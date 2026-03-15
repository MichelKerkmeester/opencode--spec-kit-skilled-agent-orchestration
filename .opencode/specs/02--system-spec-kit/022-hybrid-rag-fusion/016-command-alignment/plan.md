---
title: "Plan: Command Alignment"
description: "Implementation plan for aligning 5 existing memory commands + 3 new commands with 29 MCP tools across 7 layers."
---
<!-- SPECKIT_LEVEL: 2 -->
# Plan: 016-command-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. OVERVIEW

Align the memory command suite with the current MCP tool surface. The work splits into 4 phases executed sequentially: update existing commands, create new commands, update the index, and verify.

**Effort Estimate:** ~800 LOC across 9 files (5 updates + 3 new + 1 README update)

---

## 2. PHASES

### Phase 1: Update Existing Commands (5 files)

Update each of the 5 existing command files to document all missing parameters, fix structural issues, and add missing tool references.

| Step | File | Changes | Priority |
|------|------|---------|----------|
| 1.1 | `context.md` | Add 21 missing params to MCP Tool Signature section; add concepts search mode; add governance params subsection; add includeTrace/tokenUsage to memory_context call; add advanced search params table | P1 |
| 1.2 | `save.md` | Add 10 governance/provenance/retention params to memory_save tool signature; add reference to new /memory:ingest command for bulk ingestion; add retention policy section | P1 |
| 1.3 | `manage.md` | Fix section "189" → "19"; add 20 missing params across memory_stats, memory_health, memory_list, memory_update, memory_validate, memory_bulk_delete; add confirmName to checkpoint_delete; add memory_get_learning_history section | P0 |
| 1.4 | `learn.md` | Verify tool signatures match current schemas; add confirmName note for checkpoint_delete if referenced; minor alignment updates | P2 |
| 1.5 | `continue.md` | Verify tool signatures match current schemas; add memory_get_learning_history reference for session context enrichment; minor alignment updates | P2 |

**Dependencies:** None. All steps can execute in parallel.

### Phase 2: Create New Commands (3 files)

Create 3 new command files following the established pattern from existing commands (frontmatter with description/argument-hint/allowed-tools, mandatory first action gate, sections for purpose/contract/workflow/MCP enforcement/error handling/quick reference/related commands).

| Step | File | Scope | Priority |
|------|------|-------|----------|
| 2.1 | `analyze.md` | 8 L6 Analysis tools: task_preflight, task_postflight, memory_drift_why, memory_causal_link, memory_causal_stats, memory_causal_unlink, eval_run_ablation, eval_reporting_dashboard | P1 |
| 2.2 | `shared.md` | 3 L5 Shared Memory tools: shared_space_upsert, shared_space_membership_set, shared_memory_status | P1 |
| 2.3 | `ingest.md` | 3 L7 Async Ingestion tools: memory_ingest_start, memory_ingest_status, memory_ingest_cancel | P1 |

**Dependencies:** None. All steps can execute in parallel. Reference existing commands for template pattern.

### Phase 3: Update Index (1 file)

| Step | File | Changes | Priority |
|------|------|---------|----------|
| 3.1 | `README.txt` | Update from 5-command to 8-command structure; add analyze/shared/ingest to command table; update examples; add tool coverage summary; update troubleshooting section | P1 |

**Dependencies:** Phase 1 and Phase 2 must complete first.

### Phase 4: Verification

| Step | Action | Success Criteria |
|------|--------|-----------------|
| 4.1 | Cross-reference tool-schemas.ts | Every tool in TOOL_DEFINITIONS has a command home |
| 4.2 | Parameter completeness check | Every inputSchema property documented in a command |
| 4.3 | Internal link verification | All related commands sections reference correct files |
| 4.4 | Quick reference accuracy | All quick reference tables match actual invocation patterns |

**Dependencies:** Phases 1-3 must complete first.

---

## 3. IMPLEMENTATION DETAILS

### 3.1 Pattern for Existing Command Updates

For each existing command update (Steps 1.1-1.5):

1. **Read** the command file and tool-schemas.ts
2. **Compare** every parameter in the relevant tool schemas against what the command documents
3. **Add** missing parameters using the existing documentation style:
   - For MCP Tool Signature sections: add to the `properties` in the example call
   - For parameter tables: add rows with param name, type, default, description
   - For workflow sections: reference new params where they affect the workflow
4. **Verify** the tool call examples use the correct parameter names (snake_case vs camelCase per schema)

### 3.2 Pattern for New Commands

For each new command (Steps 2.1-2.3), use this template structure derived from existing commands:

```
---
description: [one-line description]
argument-hint: "[argument format]"
allowed-tools: [list of MCP tools this command uses]
---

# MANDATORY FIRST ACTION - DO NOT SKIP
[Argument validation gate]

# Command Name
[Purpose section]

## 1. PURPOSE
## 2. CONTRACT
## 3. ARGUMENT ROUTING
## 4. MCP ENFORCEMENT MATRIX
## 5. WORKFLOW
## 6. [Mode-specific sections]
## N-2. ERROR HANDLING
## N-1. QUICK REFERENCE
## N. RELATED COMMANDS
```

### 3.3 New Command: /memory:analyze

**Argument Routing:**
```
$ARGUMENTS
    ├─ Empty → OVERVIEW DASHBOARD
    ├─ "preflight <spec> <task>" → EPISTEMIC PREFLIGHT
    ├─ "postflight <spec> <task>" → EPISTEMIC POSTFLIGHT
    ├─ "causal <memoryId>" → CAUSAL TRACE (memory_drift_why)
    ├─ "link <sourceId> <targetId> <relation>" → CREATE CAUSAL LINK
    ├─ "unlink <edgeId>" → REMOVE CAUSAL LINK
    ├─ "causal-stats" → CAUSAL GRAPH STATS
    ├─ "ablation [channels]" → RUN ABLATION STUDY
    └─ "dashboard [filters]" → EVAL REPORTING DASHBOARD
```

**Allowed Tools:** task_preflight, task_postflight, memory_drift_why, memory_causal_link, memory_causal_stats, memory_causal_unlink, eval_run_ablation, eval_reporting_dashboard

### 3.4 New Command: /memory:shared

**Argument Routing:**
```
$ARGUMENTS
    ├─ Empty → STATUS OVERVIEW
    ├─ "create <spaceId> <tenantId> <name>" → CREATE/UPDATE SPACE
    ├─ "member <spaceId> <type> <id> <role>" → SET MEMBERSHIP
    └─ "status [tenantId] [userId] [agentId]" → INSPECT ROLLOUT
```

**Allowed Tools:** shared_space_upsert, shared_space_membership_set, shared_memory_status

### 3.5 New Command: /memory:ingest

**Argument Routing:**
```
$ARGUMENTS
    ├─ Empty → LIST ACTIVE JOBS
    ├─ "start <paths...> [--folder <spec>]" → START INGESTION
    ├─ "status <jobId>" → CHECK JOB STATUS
    └─ "cancel <jobId>" → CANCEL JOB
```

**Allowed Tools:** memory_ingest_start, memory_ingest_status, memory_ingest_cancel

### 3.6 manage.md Specific Fixes

1. **Section numbering:** Line 839, change `## 189. RELATED COMMANDS` to `## 19. RELATED COMMANDS`
2. **checkpoint_delete:** Add `confirmName` (string, REQUIRED) to checkpoint delete section. Must exactly match `name`.
3. **New section:** Add "Learning History" section for `memory_get_learning_history` tool between Health and Checkpoints (as section 15.5 or renumber).
4. **memory_stats params:** Add `folderRanking` (enum: count/recency/importance/composite), `excludePatterns` (array), `includeArchived` (boolean), `limit` (number).
5. **memory_health params:** Add `reportMode` (enum: full/divergent_aliases), `autoRepair` (boolean), `confirmed` (boolean), `specFolder` (string).
6. **memory_validate params:** Add 8 new params: queryId, queryTerms, resultRank, totalResultsShown, searchMode, intent, sessionId, notes.
7. **memory_update params:** Add `allowPartialUpdate` (boolean).
8. **memory_list params:** Add `includeChunks` (boolean).
9. **memory_bulk_delete params:** Add `skipCheckpoint` (boolean).

---

## 4. EXECUTION ORDER

```
Phase 1 (parallel):  1.1 ──┐
                      1.2 ──┤
                      1.3 ──┤── All 5 existing command updates
                      1.4 ──┤
                      1.5 ──┘
                           │
Phase 2 (parallel):  2.1 ──┐
                      2.2 ──┤── 3 new commands
                      2.3 ──┘
                           │
Phase 3 (sequential): 3.1 ── README.txt update
                           │
Phase 4 (sequential): 4.1 ── Cross-reference verification
                      4.2 ── Parameter completeness
                      4.3 ── Link verification
                      4.4 ── Quick reference check
```

Phases 1 and 2 can execute in parallel. Phase 3 depends on 1+2. Phase 4 depends on 3.

---

## 5. RESEARCH FINDINGS

### Multi-Agent Research (10 agents dispatched)

Research was conducted via 10 parallel agents:
- **5 Copilot (gpt-5.3-codex):** Per-command gap analysis against tool-schemas.ts
- **3 Sonnet (native Claude):** Hydra capabilities, RAG sprint impact, uncovered tool matrix
- **1 Codex (gpt-5.4):** Tool layer architecture cross-reference
- **1 Gemini (gemini-3.1-pro):** New command structure proposals

Key findings synthesized into the gap analysis in spec.md section 5.

### Source of Truth

`tool-schemas.ts` is the canonical source for all MCP tool definitions. The `TOOL_DEFINITIONS` array at the bottom of the file contains the ordered list of all 29 tools. Each tool's `inputSchema.properties` object defines the complete parameter surface.

---

## 6. RISKS & MITIGATIONS

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| manage.md becomes too long | Medium | Medium | Keep advanced params in dedicated "Advanced Parameters" subsections; use collapsible sections if format supports it |
| analyze.md too complex (8 tools) | Medium | Low | Group tools by function: epistemic (2), causal (4), eval (2); use clear argument routing |
| Governance params irrelevant for single-user | Low | Low | Mark as "Multi-Agent / Enterprise" with skip guidance |
| Tool schemas change during implementation | Low | Medium | Implementation reads tool-schemas.ts live; no hardcoded assumptions |

---

## 7. OPEN QUESTIONS

1. Should `memory_get_learning_history` go in `manage.md` or in the new `analyze.md`? (Recommendation: `manage.md` since it's L7 Maintenance, not L6 Analysis)
2. Should governance params (tenantId, userId, agentId) be documented in every command that uses memory_search, or in a shared reference section? (Recommendation: shared reference in README.txt + brief mention in each command)
3. Should feature flag behavior (SPECKIT_ADAPTIVE_FUSION, SPECKIT_EXTENDED_TELEMETRY) be documented per-command or in a central reference? (Recommendation: brief per-command notes with full details in SKILL.md. Per S2 agent finding: do NOT hardcode flag names in commands — reference the flag registry, since Sprint 7 sunsets earlier sprint flags.)
4. Should eval tools (eval_run_ablation, eval_reporting_dashboard) be in `/memory:analyze` or a separate `/memory:eval`? (S3 agent proposed separate `/memory:eval`; current plan groups them in `/memory:analyze` for fewer command files. Either is viable.)
5. Should ingest tools get their own `/memory:ingest` command or be subcommands of `/memory:manage`? (S3 agent proposed extending manage.md; current plan uses a separate command for clarity. Decision: keep separate — manage.md is already 866 lines.)

## 8. AGENT RESEARCH INSIGHTS (for implementation reference)

Key insights from multi-agent research that should inform implementation:

- **S1 (Hydra):** Governed ingest rejection (Phase 5 REQ-502) — saves without `provenanceSource`/`provenanceActor` are rejected when governance guardrails active. save.md needs a "Governance Mode" callout explaining when these fields are required vs optional.
- **S1 (Hydra):** Kill switch (`shared_space_upsert.killSwitch`) is an emergency operation for instantly disabling shared spaces. Needs prominent documentation in /memory:shared.
- **S2 (RAG Sprints):** Sprint 6 N3-lite auto-populates `contradicts` edges (tagged `created_by='auto'`). The `/memory:analyze causal` docs should explain system-generated vs user-created edges.
- **S2 (RAG Sprints):** `specFolder` on memory_search is now a performance optimization (early pre-filter before Stage 1 candidate generation), not just a relevance filter. context.md should note this.
- **S2 (RAG Sprints):** `tokenUsage` on memory_context ties into lifecycle hooks (`hooks/memory-surface.ts`) and 4000-token per-point budget. context.md should document when to pass this.
- **S3 (Coverage):** Recommends `memory_get_learning_history` as `manage history <spec>` subcommand. Adopted.

---

<!--
PLAN: 016-command-alignment (~200 lines)
4 phases, 13 steps, 9 deliverables
Phases 1+2 parallelizable, 3+4 sequential
-->
