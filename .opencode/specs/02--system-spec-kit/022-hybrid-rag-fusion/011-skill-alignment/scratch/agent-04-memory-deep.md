# Memory System Deep Alignment Audit

## Scope

Deep comparison of the Spec Kit Memory System subsection in `SKILL.md` against the current MCP runtime and the 022 hybrid-RAG-fusion epic artifacts.

### Primary sources read

- `.opencode/skill/system-spec-kit/SKILL.md:508-590`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/implementation-summary.md:23-46`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:254-266`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-563`
- `.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:42-110`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:5-18`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:28-69`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:73-250`
- `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:80-121`
- `.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:35-141`
- `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:27-220`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:32-108`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:1-130`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:1-170`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:1-109`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:42-83,188-215`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:7-18,155-199`
- `.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:306-314`

## Executive Summary

The `SKILL.md` memory section is directionally correct but materially stale. The biggest drift is not the high-level architecture, which is mostly still right, but the operational surface area: tool count, handler count, lib topology, flag inventory, and Sprint 4-7 feature coverage all lag the actual runtime.

The most important gaps are:

1. `P0`: the runtime shape metadata is obsolete (`~682` LOC, `12` handlers, `20` lib subdirs, `25` tools).
2. `P1`: the tool table omits important current MCP tools, especially `memory_validate`, `eval_run_ablation`, and `eval_reporting_dashboard`.
3. `P1`: the feature-flag table is incomplete; it omits `SPECKIT_QUALITY_LOOP`, `SPECKIT_DOCSCORE_AGGREGATION`, `SPECKIT_CONSOLIDATION`, `SPECKIT_ENCODING_INTENT`, and `SPECKIT_ABLATION`.
4. `P1`: Sprint 4-7 concepts are only partially represented. The section misses MPAB/feedback-loop details, contradiction detection, ablation/reporting, and the sunset-audit outcome.
5. `P1`: the environment example `SPECKIT_ADAPTIVE_FUSION=1` is misleading for adaptive fusion because that implementation enables only on unset/empty/`true`, not `1`.

## A) MCP Server Description Accuracy

| Claim in `SKILL.md` | Expected / Epic framing | Verified runtime state | Gap | Priority |
|---|---|---|---|---|
| `@spec-kit/mcp-server` v`1.7.2` | Current epic still references `1.7.2` | `context-server.ts` still initializes `version: '1.7.2'` | Accurate | P2 |
| `context-server.ts` `(~682 lines)` | Epic implementation is much larger by Sprint 7 | `wc -l` shows `1073` lines | Count is badly stale | P0 |
| `12 handler files` | Sprinted runtime added ingest, eval, shared-memory, and helper splits | `handlers/index.ts` imports 13 concrete handler modules, and `handlers/README.md` documents a larger mixed surface; top-level `handlers/*.ts` count is 30 | Count is stale under any reasonable definition | P0 |
| `20 lib subdirectories` | Sprint 4-7 expanded eval, telemetry, governance, collab, response, validation, ops, etc. | `find mcp_server/lib -maxdepth 1 -type d` returns `26` subdirectories | Count is stale | P0 |
| `25 MCP tools` | Sprint 7 and Hydra-era work increased the tool surface | `TOOL_DEFINITIONS` contains `31` tools | Count is stale | P0 |
| `across 7 layers` | Epic still uses L1-L7 architecture | `layer-definitions.ts` defines `L1` through `L7` | Accurate | P2 |

### Notes

- The version number stayed stable while the file/module/tool counts grew substantially.
- This is the clearest evidence that the SKILL section was not refreshed after later sprint and Hydra additions.

## B) Tool Table Completeness

### Status of the 8 listed tools

All 8 listed tools still exist and their top-level labels are broadly correct:

- `memory_context`
- `memory_search`
- `memory_match_triggers`
- `memory_save`
- `memory_list`
- `memory_delete`
- `checkpoint_create`
- `checkpoint_restore`

The problem is not that these tools are wrong. The problem is that the table now undersells the live MCP surface and omits important tools that carry Sprint 4-7 functionality.

### Major omissions versus actual MCP tools

| Omitted tool(s) | Why omission matters | Priority |
|---|---|---|
| `memory_validate` | This is the user-facing hook for negative feedback and relevance feedback context. Without it, the SKILL section does not really explain how the feedback loop closes. | P1 |
| `memory_stats`, `memory_health` | These are part of the practical day-to-day memory workflow and are already documented in `memory_system.md`. | P2 |
| `memory_update`, `memory_bulk_delete`, `checkpoint_list`, `checkpoint_delete` | Current mutation/lifecycle surface is broader than the top table suggests. | P2 |
| `memory_index_scan`, `memory_get_learning_history` | These are core maintenance/learning tools but are absent from the highlighted table. | P2 |
| `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel` | Async ingest is a first-class current capability and not reflected at all. | P2 |
| `eval_run_ablation`, `eval_reporting_dashboard` | Sprint 7 explicitly added ablation and dashboard tooling, but the SKILL section never surfaces them. | P1 |
| `shared_space_upsert`, `shared_space_membership_set`, `shared_memory_status` | Hydra/shared-memory rollout introduced new MCP capabilities absent from the memory section. | P2 |

### Sprint 4-7 alignment

| Sprint topic | Tool impact | Present in 8-tool table? | Gap | Priority |
|---|---|---|---|---|
| Sprint 4 feedback loop | Mostly extends `memory_search`, `memory_save`, and `memory_validate` | Only `memory_search` and `memory_save` | Missing `memory_validate`; feedback loop looks more passive than it is | P1 |
| Sprint 5 pipeline refactor | Mostly inside `memory_search` and `memory_context` | Partially | Tool presence is okay, but the table does not convey Stage 4 invariant, MPAB stage placement, or query-expansion behavior | P2 |
| Sprint 6 indexing/graph | Mostly inside save/search/index tooling | Partially | No exposure of contradiction/consolidation or weight-history concepts | P1 |
| Sprint 7 eval/reporting | New dedicated MCP tools | No | `eval_run_ablation` and `eval_reporting_dashboard` absent | P1 |

### Additional drift

`references/memory/memory_system.md` says "23 tools", but the live runtime exposes 31. So the subordinate reference has stale counts too, not just `SKILL.md`.

## C) Feature Flag Accuracy

### The 10 listed flags

| Flag in `SKILL.md` | Claimed default | Verified implementation | Status | Priority |
|---|---|---|---|---|
| `SPECKIT_ADAPTIVE_FUSION` | on | Adaptive fusion enables when unset/empty/`true`; disabled by explicit `false` | Default claim correct | P2 |
| `SPECKIT_EXTENDED_TELEMETRY` | off | Enabled only on exact `true` | Correct | P2 |
| `SPECKIT_INDEX_SPEC_DOCS` | on | Disabled only by explicit `false` in scan discovery path | Correct | P2 |
| `SPECKIT_SAVE_QUALITY_GATE` | on | Default-on via `isFeatureEnabled` and quality-gate helper | Correct | P2 |
| `SPECKIT_RECONSOLIDATION` | off | Explicit opt-in only (`true`) | Correct | P2 |
| `SPECKIT_NEGATIVE_FEEDBACK` | on | Default-on via rollout policy | Correct | P2 |
| `SPECKIT_LEARN_FROM_SELECTION` | on | Disabled only by explicit `false` | Correct | P2 |
| `SPECKIT_EMBEDDING_EXPANSION` | on | Default-on, graduated; tests assert default `true` | Correct | P2 |
| `SPECKIT_AUTO_ENTITIES` | on | Default-on via rollout policy | Correct | P2 |
| `SPECKIT_ENTITY_LINKING` | on | Default-on via rollout policy | Correct | P2 |

### Missing or stale flag coverage

| Missing / stale flag topic | Verified state | Why it matters | Priority |
|---|---|---|---|
| `SPECKIT_QUALITY_LOOP` | Exists, default `false`, opt-in only | `SKILL.md` describes verify-fix-verify as if it is simply part of save-time processing, but the actual feature is gated and off by default | P1 |
| `SPECKIT_DOCSCORE_AGGREGATION` | Exists, default-on | Sprint 4 MPAB/document aggregation is part of the feedback/quality story and should be represented | P1 |
| `SPECKIT_CONSOLIDATION` | Exists, default-on | Sprint 6 contradiction detection and Hebbian strengthening live behind this flag | P1 |
| `SPECKIT_ENCODING_INTENT` | Exists, default-on | Sprint 6 encoding-intent capture is omitted from the flag story | P2 |
| `SPECKIT_ABLATION` | Exists, default `false` | Sprint 7 ablation tooling is invisible without this flag | P1 |
| `SPECKIT_PIPELINE_V2` | Deprecated/inert, always effectively on | The section never states that V2 is now the sole runtime path | P2 |
| `SPECKIT_MEMORY_ROADMAP_PHASE` and canonical `SPECKIT_MEMORY_*` flags | Canonical names now exist alongside legacy `SPECKIT_HYDRA_*` aliases | `SKILL.md` still frames the roadmap metadata entirely in legacy Hydra naming | P1 |

### Usage example error

`SKILL.md` says: `Set via environment variable before starting the MCP server (e.g., SPECKIT_ADAPTIVE_FUSION=1)`.

That example is unsafe for at least one real implementation:

- `adaptive-fusion.ts` enables only for unset/empty/`true`, not `1`
- therefore `SPECKIT_ADAPTIVE_FUSION=1` does not match the actual contract

This is a documentation bug, not just drift.

Priority: `P1`

## D) Key Concepts Coverage

| Concept requested | Present in `SKILL.md`? | Verified implementation state | Assessment | Priority |
|---|---|---|---|---|
| 4-stage pipeline | Yes | Pipeline README documents all 4 stages plus Stage 4 immutability invariant | Covered, but summarized too lightly for current complexity | P2 |
| Adaptive fusion | Yes | Shared adaptive-fusion algorithm still implements 7 intent profiles | Covered and basically accurate | P2 |
| Mutation ledger | Yes | Real module is append-only, immutable via SQLite triggers, but mutation types are broader than listed and not centered on `reinforce` | Partially covered, wording is stale | P1 |
| Retrieval telemetry | Yes | Real telemetry includes latency breakdowns, mode/fallback/quality, roadmap architecture, graph health, adaptive metrics, trace payload, graph-walk diagnostics, and lifecycle forecast | Covered only at a simplified/stale level | P1 |

### Concept-specific notes

#### 4-stage pipeline

The section correctly says "candidate generation -> fusion -> reranking -> filtering". What it misses is the key Sprint 5 invariant:

- Stage 4 must not change scores
- Stage 2 is the authoritative signal-integration point
- Stage 3 preserves Stage 2 score auditability

This is not fatal, but the current one-line summary underspecifies the architectural contract.

#### Mutation ledger

The current runtime ledger includes mutation types:

- `create`
- `update`
- `delete`
- `merge`
- `archive`
- `restore`
- `reindex`

`SKILL.md` says "create, update, delete, reinforce". That is no longer the best description of the current ledger semantics.

#### Retrieval telemetry

The current telemetry model is much richer than "4 dimensions plus Hydra metadata". It now includes:

- stage-level latency breakdown
- mode selection and pressure
- fallback/degraded mode
- quality proxy
- roadmap architecture snapshot
- graph health
- adaptive-mode telemetry
- trace payload
- transition diagnostics
- graph-walk diagnostics
- lifecycle forecast diagnostics

## E) Missing Sprint 4-7 Topics

| Topic | Expected state from epic / runtime | Coverage in `SKILL.md` | Gap assessment | Priority |
|---|---|---|---|---|
| Feedback loop | Sprint 4 delivered MPAB aggregation, learned relevance feedback safeguards, shadow scoring, and channel attribution | Only indirect mention via `SPECKIT_LEARN_FROM_SELECTION` and validation scoring | Major omission of how feedback actually works | P1 |
| Quality gate | Sprint 4 pre-storage gate with 0.4 threshold and warn-only rollout | Explicitly covered | Good | P2 |
| Reconsolidation | Sprint 4 merge/supersede/store-new thresholds plus checkpoint safety | Mentioned, but checkpoint prerequisite and threshold bands are omitted | Partial | P2 |
| Query expansion | Sprint 5 R12 embedding expansion with R15 simple-query suppression | Mentioned only via flag and broad pipeline text | Missing mutual exclusion and execution semantics | P2 |
| Weight-history | Sprint 6a audit provenance on causal-edge strength changes | Not mentioned | Missing | P2 |
| Contradiction detection | Sprint 6a N3-lite contradiction scan + Hebbian strengthening | Not mentioned | Missing | P1 |
| Ablation framework | Sprint 7 `eval_run_ablation` plus R13-S3 reporting dashboard | Not mentioned | Missing | P1 |
| Flag sunset audit | Sprint 7 completed flag sunset audit | Not mentioned | Missing | P2 |

## Highest-Priority Corrections

### P0

- Replace the server shape line in `SKILL.md` with current measured/runtime-backed counts.
- Stop claiming `25` tools and `12` handlers.

### P1

- Add `memory_validate`, `eval_run_ablation`, and `eval_reporting_dashboard` to the surfaced tool story.
- Add missing flags: `SPECKIT_QUALITY_LOOP`, `SPECKIT_DOCSCORE_AGGREGATION`, `SPECKIT_CONSOLIDATION`, `SPECKIT_ABLATION`.
- Fix the adaptive-fusion env-var example so it uses `true`, not `1`.
- Expand the "Key Concepts" section to cover:
  - MPAB / learned feedback / shadow scoring
  - contradiction detection
  - richer retrieval telemetry
  - canonical memory-roadmap flag names

### P2

- Improve pipeline wording to include the Stage 4 score-immutability invariant.
- Add mention of query-expansion suppression on simple queries.
- Add weight-history and flag-sunset-audit references.

## Bottom Line

The memory section is still usable as a high-level orientation aid, but it no longer reflects the actual post-Sprint-7 memory system with enough fidelity to act as a reliable source of truth. The most serious issue is stale operational metadata; the next-most serious issue is that several important Sprint 4-7 capabilities are either absent or documented only as faint hints rather than as real runtime features.
