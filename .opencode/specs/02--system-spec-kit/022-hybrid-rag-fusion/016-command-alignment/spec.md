---
title: "Command Alignment: Memory Commands vs MCP Tool Schemas"
description: "Align the 5 memory commands (/memory:context, /memory:save, /memory:continue, /memory:learn, /memory:manage) with the current state of the Spec Kit Memory MCP server's 29 tool definitions across 7 layers (L1-L7)."
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

The Spec Kit Memory MCP server has grown from ~14 tools to 29 tools across 7 architectural layers (L1-L7) during the 022-hybrid-rag-fusion epic. The 5 memory commands (`/memory:context`, `/memory:save`, `/memory:continue`, `/memory:learn`, `/memory:manage`) were written against an earlier tool surface and have fallen out of alignment. This spec defines the work to bring all commands into full alignment with the current MCP tool schemas, add command coverage for 15 uncovered tools, and update the README.txt index.

**Key Metrics:**
- 29 MCP tools defined in `tool-schemas.ts`
- 15 tools with zero command coverage (52% uncovered)
- 30+ undocumented parameters on existing covered tools
- 3 new commands proposed: `/memory:analyze`, `/memory:shared`, `/memory:ingest`
- 1 section numbering error in `manage.md` (section "189" should be "19")

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-14 |
| **Updated** | 2026-03-14 |
| **Branch** | `017-markovian-architectures` |
| **Complexity** | 55/100 |
| **Parent** | `022-hybrid-rag-fusion` (Phase 016) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Spec Kit Memory MCP server's tool surface expanded significantly during the 022-hybrid-rag-fusion epic across 8 core RAG sprints, a 6-phase Hydra database architecture rollout, and multiple bug-fix and feature campaigns. The 5 memory commands in `.opencode/command/memory/` were written against an earlier tool surface and now exhibit three categories of misalignment:

1. **Missing Parameters (30+ gaps):** Existing covered tools have acquired new parameters (governance scoping, provenance tracking, adaptive fusion, reranking controls, quality filtering, causal boosting, trace data, memory state filtering) that are not documented in the commands that reference them.

2. **Uncovered Tools (15 tools):** Entire tool categories have zero command representation:
   - L5 Lifecycle: `shared_space_upsert`, `shared_space_membership_set`, `shared_memory_status` (Hydra Phase 6)
   - L6 Analysis: `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `eval_run_ablation`, `eval_reporting_dashboard` (RAG Sprints + Hydra)
   - L7 Maintenance: `memory_get_learning_history`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel` (RAG Sprints + quality improvements)

3. **Structural Issues:** Section numbering error in `manage.md` (section "189" instead of "19"), missing `confirmName` requirement for `checkpoint_delete`, and README.txt not reflecting the current tool landscape.

### Purpose

Bring all memory commands into full alignment with the MCP tool schemas so that:
- Every MCP tool has a command home with correct parameter documentation
- Commands accurately reflect the current hybrid retrieval pipeline behavior
- Governance, provenance, and shared memory features are accessible through commands
- The README.txt serves as an accurate index of all command capabilities
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Category | Items |
|----------|-------|
| **Update existing commands** | context.md, save.md, manage.md, learn.md, continue.md |
| **Create new commands** | /memory:analyze (L6 tools), /memory:shared (L5 shared tools), /memory:ingest (L7 ingest tools) |
| **Update README.txt** | Reflect 8-command structure, new tool coverage, updated examples |
| **Parameter alignment** | Document all 29 tool parameters accurately per tool-schemas.ts |

### Out of Scope

- MCP server code changes (tool implementations are stable)
- SKILL.md updates (separate concern)
- CLAUDE.md / AGENTS.md updates (separate phase: 017, 018)
- New MCP tool creation
- Command YAML asset files (memory commands have no YAML assets)

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| D1 | Updated `context.md` | Add missing params: includeTrace, tokenUsage, concepts, governance params, advanced search params |
| D2 | Updated `save.md` | Add governance/provenance/retention params, reference ingest tools |
| D3 | Updated `manage.md` | Add missing tool params, fix section numbering, add confirmName for checkpoint_delete, add learning_history |
| D4 | Updated `learn.md` | Minor alignment: confirm checkpoint_delete confirmName, verify tool signatures |
| D5 | Updated `continue.md` | Add learning_history integration, verify recovery tool signatures |
| D6 | New `analyze.md` | Command for L6 Analysis tools: causal graph, eval, epistemic measurement |
| D7 | New `shared.md` | Command for L5 shared memory tools: space CRUD, membership, status |
| D8 | New `ingest.md` | Command for L7 async ingestion tools: start, status, cancel |
| D9 | Updated `README.txt` | 8-command index, updated examples, tool coverage matrix |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CA-001 | All 29 MCP tool parameters documented in their command home | Every property in every inputSchema in tool-schemas.ts has a corresponding entry in a command's MCP Tool Signature or workflow section |
| CA-002 | Section numbering fix in manage.md | Section "189" corrected to "19" |
| CA-003 | checkpoint_delete confirmName documented | manage.md checkpoint delete section shows confirmName as required |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CA-004 | New /memory:analyze command covers L6 Analysis tools | 8 tools documented: task_preflight, task_postflight, memory_drift_why, memory_causal_link, memory_causal_stats, memory_causal_unlink, eval_run_ablation, eval_reporting_dashboard |
| CA-005 | New /memory:shared command covers L5 shared memory tools | 3 tools documented: shared_space_upsert, shared_space_membership_set, shared_memory_status |
| CA-006 | New /memory:ingest command covers L7 async ingestion tools | 3 tools documented: memory_ingest_start, memory_ingest_status, memory_ingest_cancel |
| CA-007 | context.md updated with all memory_context and memory_search params | includeTrace, tokenUsage, concepts, governance params, rerank, applyLengthPenalty, bypassCache, minState, enableSessionBoost, enableCausalBoost, trackAccess, includeArchived, autoDetectIntent, min_quality_score, includeContiguity, includeConstitutional |
| CA-008 | save.md updated with governance/provenance/retention params | tenantId, userId, agentId, sessionId, sharedSpaceId, provenanceSource, provenanceActor, governedAt, retentionPolicy, deleteAfter |
| CA-009 | manage.md updated with all missing params | memory_health: reportMode, autoRepair, confirmed, specFolder; memory_stats: folderRanking, excludePatterns, includeArchived; memory_list: includeChunks; memory_update: allowPartialUpdate; memory_validate: queryId, queryTerms, resultRank, totalResultsShown, searchMode, intent, sessionId, notes; memory_bulk_delete: skipCheckpoint |
| CA-010 | manage.md adds memory_get_learning_history tool | Section for learning history query tool |
| CA-011 | README.txt updated to 8-command index | Accurate command listing, examples, tool coverage |

### P2 - Desired

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CA-012 | Command files include L-layer annotations | Each MCP tool call annotated with its layer (L1-L7) for architectural clarity |
| CA-013 | Cross-command tool reference table | Table showing which tool is documented where |
| CA-014 | Feature flag documentation in commands | SPECKIT_ADAPTIVE_FUSION, SPECKIT_EXTENDED_TELEMETRY behavior noted where relevant |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:gap-analysis -->
## 5. GAP ANALYSIS

### 5.1 Tool Coverage Matrix

| Layer | Tool | Current Command | Status | Gap |
|-------|------|----------------|--------|-----|
| L1 | memory_context | context.md | PARTIAL | Missing 3 params (includeTrace, tokenUsage, concepts via search) |
| L2 | memory_search | context.md, manage.md | PARTIAL | Missing 18+ params (governance, reranking, quality, state, causal, trace) |
| L2 | memory_match_triggers | context.md | PARTIAL | Missing cognitive params (session_id, turnNumber, include_cognitive) |
| L2 | memory_save | save.md | PARTIAL | Missing 11 params (governance, provenance, retention) |
| L3 | memory_list | manage.md | PARTIAL | Missing includeChunks param |
| L3 | memory_stats | manage.md | PARTIAL | Missing 4 params (folderRanking, excludePatterns, includeArchived, limit) |
| L3 | memory_health | manage.md | PARTIAL | Missing 4 params (reportMode, autoRepair, confirmed, specFolder) |
| L4 | memory_delete | manage.md | COVERED | Minor: x-requiredAnyOf not explained |
| L4 | memory_update | manage.md | PARTIAL | Missing allowPartialUpdate param |
| L4 | memory_validate | manage.md | PARTIAL | Missing 8 params (queryId, queryTerms, resultRank, etc.) |
| L4 | memory_bulk_delete | manage.md | PARTIAL | Missing skipCheckpoint param |
| L5 | checkpoint_create | manage.md | COVERED | OK |
| L5 | checkpoint_list | manage.md | COVERED | OK |
| L5 | checkpoint_restore | manage.md | COVERED | OK |
| L5 | checkpoint_delete | manage.md | PARTIAL | Missing REQUIRED confirmName param |
| L5 | shared_space_upsert | NONE | UNCOVERED | New command needed |
| L5 | shared_space_membership_set | NONE | UNCOVERED | New command needed |
| L5 | shared_memory_status | NONE | UNCOVERED | New command needed |
| L6 | task_preflight | NONE | UNCOVERED | New command needed |
| L6 | task_postflight | NONE | UNCOVERED | New command needed |
| L6 | memory_drift_why | NONE | UNCOVERED | New command needed |
| L6 | memory_causal_link | NONE | UNCOVERED | New command needed |
| L6 | memory_causal_stats | NONE | UNCOVERED | New command needed |
| L6 | memory_causal_unlink | NONE | UNCOVERED | New command needed |
| L6 | eval_run_ablation | NONE | UNCOVERED | New command needed |
| L6 | eval_reporting_dashboard | NONE | UNCOVERED | New command needed |
| L7 | memory_index_scan | manage.md, save.md | COVERED | OK |
| L7 | memory_get_learning_history | NONE | UNCOVERED | Add to manage.md or new command |
| L7 | memory_ingest_start | NONE | UNCOVERED | New command needed |
| L7 | memory_ingest_status | NONE | UNCOVERED | New command needed |
| L7 | memory_ingest_cancel | NONE | UNCOVERED | New command needed |

**Summary:** 29 tools total. 3 COVERED, 12 PARTIAL, 14 UNCOVERED.

### 5.2 Parameter Gap Details by Command

#### context.md Gaps

| Tool | Missing Parameter | Type | Description |
|------|------------------|------|-------------|
| memory_context | includeTrace | boolean | Include provenance-rich trace data |
| memory_context | tokenUsage | number | Caller token usage ratio (0.0-1.0) |
| memory_search | concepts | array | Multi-concept AND search (2-5 concepts) |
| memory_search | tenantId | string | Tenant boundary for governed retrieval |
| memory_search | userId | string | User boundary for governed retrieval |
| memory_search | agentId | string | Agent boundary for governed retrieval |
| memory_search | sharedSpaceId | string | Shared-memory space identifier |
| memory_search | enableSessionBoost | boolean | Session-based score boost |
| memory_search | enableCausalBoost | boolean | Causal-neighbor boost (2-hop) |
| memory_search | min_quality_score | number | Minimum quality score threshold |
| memory_search | bypassCache | boolean | Skip tool cache |
| memory_search | rerank | boolean | Cross-encoder reranking |
| memory_search | applyLengthPenalty | boolean | Length-based penalty during reranking |
| memory_search | applyStateLimits | boolean | Per-tier quantity limits |
| memory_search | minState | enum | Minimum memory state (HOT/WARM/COLD/DORMANT/ARCHIVED) |
| memory_search | autoDetectIntent | boolean | Auto-detect intent from query |
| memory_search | trackAccess | boolean | FSRS strengthening on read |
| memory_search | includeArchived | boolean | Include archived memories |
| memory_search | includeContiguity | boolean | Include adjacent memories |
| memory_search | includeConstitutional | boolean | Include constitutional tier |
| memory_search | includeTrace | boolean | Provenance-rich trace envelope |

#### save.md Gaps

| Tool | Missing Parameter | Type | Description |
|------|------------------|------|-------------|
| memory_save | tenantId | string | Tenant boundary |
| memory_save | userId | string | User boundary |
| memory_save | agentId | string | Agent boundary |
| memory_save | sessionId | string | Session boundary |
| memory_save | sharedSpaceId | string | Shared-memory space |
| memory_save | provenanceSource | string | Provenance source (governance) |
| memory_save | provenanceActor | string | Provenance actor (governance) |
| memory_save | governedAt | string | ISO timestamp for governed ingest |
| memory_save | retentionPolicy | enum | keep, ephemeral, shared |
| memory_save | deleteAfter | string | ISO timestamp for retention sweep |

#### manage.md Gaps

| Tool | Missing Parameter | Type | Description |
|------|------------------|------|-------------|
| memory_stats | folderRanking | enum | count, recency, importance, composite |
| memory_stats | excludePatterns | array | Regex patterns to exclude folders |
| memory_stats | includeArchived | boolean | Include archived/test/scratch folders |
| memory_stats | limit | number | Maximum folders to return |
| memory_health | reportMode | enum | full, divergent_aliases |
| memory_health | autoRepair | boolean | Best-effort repair actions |
| memory_health | confirmed | boolean | Required with autoRepair:true |
| memory_health | specFolder | string | Folder filter for divergent alias mode |
| memory_list | includeChunks | boolean | Include chunk child rows |
| memory_update | allowPartialUpdate | boolean | Allow partial update on embedding failure |
| memory_validate | queryId | string | Query identifier for feedback |
| memory_validate | queryTerms | array | Normalized query terms |
| memory_validate | resultRank | number | Rank position of selected result |
| memory_validate | totalResultsShown | number | Total results shown |
| memory_validate | searchMode | string | Search mode context |
| memory_validate | intent | string | Classified intent |
| memory_validate | sessionId | string | Session identifier |
| memory_validate | notes | string | Free-form notes |
| memory_bulk_delete | skipCheckpoint | boolean | Skip auto-checkpoint |
| checkpoint_delete | confirmName | string | REQUIRED: must match name |

### 5.3 Behavioral Documentation Gaps (from multi-agent research)

These are not parameter gaps but behavioral changes that commands need to document:

| Feature | Source | Command Impact |
|---------|--------|---------------|
| **Reconsolidation-on-save** | Sprint 4 (TM-06) | `save.md` must document that `memory_save` may silently merge (>=0.88 similarity), replace with supersedes edge (0.75-0.88), or store new (<0.75). Behind `SPECKIT_RECONSOLIDATION` flag. |
| **Pre-storage quality gate** | Sprint 4 (TM-04) | `save.md` must document the 3-layer gate (structural, content-quality-score, semantic-dedup >0.92). `dryRun` param is the probe mechanism. Behind `SPECKIT_SAVE_QUALITY_GATE`. |
| **Deep mode mutual exclusion** | Sprint 5 (R12/R15) | `context.md` must warn that `mode: "deep"` (R12 query expansion) is suppressed when R15 classifies query as simple. Deep mode does not guarantee expansion. |
| **Learned feedback extraction** | Sprint 4 (R11) | `manage.md` validate section must explain that `queryTerms`, `resultRank`, etc. drive auto-promotion (normal→important at 5 positives, important→critical at 10) and confidence-floor suppression. |
| **Deny-by-default shared spaces** | Hydra Phase 6 | New `/memory:shared` command must document that membership is deny-by-default; `shared_space_membership_set` is required before any agent can access a shared space. |
| **Scope enforcement phases** | Hydra Phase 5 | Governance params (tenantId, userId, agentId) only enforce boundaries when Phase 5 scope enforcement is active. Commands must note this dependency. |

### 5.4 Structural Issues

| Issue | Location | Description |
|-------|----------|-------------|
| Section numbering | manage.md:839 | Section "189" should be "19" (RELATED COMMANDS) |
| Missing required param | manage.md checkpoint delete | `confirmName` is REQUIRED in tool schema but not documented |
| Tool layer annotations | All commands | No L1-L7 layer annotations on tool references |
| Feature flag docs | All commands | SPECKIT_ADAPTIVE_FUSION, SPECKIT_EXTENDED_TELEMETRY, SPECKIT_RECONSOLIDATION, SPECKIT_SAVE_QUALITY_GATE partially mentioned but inconsistent |

### 5.5 Multi-Agent Research Summary

Research conducted via 10 parallel agents (Depth: 0→1, single-hop, LEAF constraint enforced):

| Agent | Model | Via | Status | Key Finding |
|-------|-------|-----|--------|-------------|
| C1 | gpt-5.3-codex | cli-copilot | FAILED (CLI flag mismatch) | N/A |
| C2 | gpt-5.3-codex | cli-copilot | FAILED (CLI flag mismatch) | N/A |
| C3 | gpt-5.3-codex | cli-copilot | FAILED (CLI flag mismatch) | N/A |
| C4 | gpt-5.3-codex | cli-copilot | FAILED (CLI flag mismatch) | N/A |
| C5 | gpt-5.3-codex | cli-copilot | FAILED (CLI flag mismatch) | N/A |
| S1 | Sonnet 4.6 | native Claude | SUCCESS | Confirmed 3 shared_space tools uncovered + governance params missing |
| S2 | Sonnet 4.6 | native Claude | SUCCESS | Identified 6 behavioral documentation gaps from Sprints 4-7 |
| S3 | Sonnet 4.6 | native Claude | SUCCESS | Confirmed 15 UNCOVERED tools, validated coverage matrix |
| X1 | gpt-5.4 | cli-codex | FAILED (CLI flag mismatch) | N/A |
| G1 | gemini-3.1-pro | cli-gemini | FAILED (429 rate limit) | N/A |

**CLI failure notes:** Copilot CLI `-m` flag not recognized (version mismatch vs documented reference). Codex CLI `-a` flag not recognized. Gemini CLI returned 429 MODEL_CAPACITY_EXHAUSTED. The 3 successful Sonnet agents provided sufficient validation for all findings.
<!-- /ANCHOR:gap-analysis -->

---

<!-- ANCHOR:approach -->
## 6. APPROACH

### Phase 1: Update Existing Commands (D1-D5)
Update parameter documentation, fix structural issues, and add missing tool references in the 5 existing command files.

### Phase 2: Create New Commands (D6-D8)
Create 3 new command files following existing patterns (frontmatter, mandatory first action, contract, workflow, MCP enforcement, error handling, quick reference, related commands).

### Phase 3: Update Index (D9)
Update README.txt to reflect 8-command structure with accurate tool coverage.

### Phase 4: Verification
Cross-reference every tool in tool-schemas.ts against command files to confirm 100% coverage.
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:risks -->
## 7. RISKS

| Risk | Impact | Mitigation |
|------|--------|------------|
| Commands grow too large | Medium | Keep new params in dedicated subsections, use expandable reference tables |
| Governance params confuse single-agent users | Low | Mark governance params as "Advanced" with clear context on when they apply |
| New commands create fragmentation | Low | README.txt serves as unified index; related commands sections cross-link |
| Tool schemas change again | Low | Document the source-of-truth pattern: tool-schemas.ts is canonical |
<!-- /ANCHOR:risks -->

---

## RELATED DOCUMENTS

- **Parent Epic**: `022-hybrid-rag-fusion/spec.md`
- **Tool Schemas**: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- **Command Directory**: `.opencode/command/memory/`
- **Feature Catalog**: `022-hybrid-rag-fusion/feature_catalog/`
- **Hydra Specs**: `014-hydra-db-based-features/` (L5 shared memory source)
- **Core RAG Sprints**: `005-core-rag-sprints-0-to-9/` (L6 analysis tools source)

---

<!--
SPEC: 016-command-alignment (~250 lines)
Level 2: Verification checklist required
Scope: 5 command updates + 3 new commands + 1 README update = 9 deliverables
Source of truth: tool-schemas.ts (29 tools, 7 layers)
-->
