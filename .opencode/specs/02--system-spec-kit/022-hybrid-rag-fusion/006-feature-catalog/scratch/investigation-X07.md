OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce99-2762-79e1-ab02-b3e248b60b5d
--------
user
You are investigating undocumented features in an MCP server. Search for and read infrastructure files under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/: ops/job-queue.ts, providers/retry-manager.ts, cache/tool-cache.ts, learning/corrections.ts, architecture/layer-definitions.ts. Also check for any circuit breaker implementations. Verify gaps 32-37: Gap 32 (Durable Ingest Job Queue), Gap 33 (Embedding Retry Orchestrator), Gap 34 (Circuit-Broken Reranker Failover), Gap 35 (Tool-Level TTL Cache), Gap 36 (Correction Tracking with Undo), Gap 37 (7-Layer Tool Architecture Metadata). 

OUTPUT FORMAT (repeat for each gap):
---
GAP_NUMBER: [from undocumented-features-scan.md]
FEATURE_NAME: [descriptive name]
STATUS: [CONFIRMED_GAP/NEW_GAP/FALSE_POSITIVE]
SOURCE_FILES: [file:line-range for implementation]
DRAFT_DESCRIPTION: [2-5 sentence Current Reality text]
SUGGESTED_CATEGORY: [which of the 20 existing categories]
SIGNIFICANCE: [HIGH/MEDIUM/LOW]
NOTES: [additional context]
---

Also report any NEW capabilities you find in these files that are not in the gap list.

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents. Complete with direct tool calls only.
Depth: 1
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: spec_kit_memory starting
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m going to verify each requested gap directly from the MCP server source by reading the exact infrastructure files and pulling line-referenced evidence. First I’ll locate the scan document and inspect the target files, then I’ll summarize each gap in your required template plus any new capabilities.
exec
/bin/zsh -lc "pwd; rg --files | rg 'undocumented-features-scan\\.md|\\.opencode/skill/system-spec-kit/mcp_server/lib/(ops/job-queue\\.ts|providers/retry-manager\\.ts|cache/tool-cache\\.ts|learning/corrections\\.ts|architecture/layer-definitions\\.ts)|AGENTS\\.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
.opencode/install_guides/SET-UP - AGENTS.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts
.opencode/specs/03--commands-and-skills/sk-mcp/001-mcp-clickup-creation/context/clickup-cli-main/AGENTS.md
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts
.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/AGENTS.md
.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Job Queue
     3	// ---------------------------------------------------------------
     4	// Sprint 9 fixes: true sequential worker, meaningful state transitions,
     5	// continue-on-error for bulk ingestion, SQLITE_BUSY async retry on DB writes,
     6	// crash recovery with re-enqueue, and original-path progress tracking.
     7	
     8	import { requireDb, toErrorMessage } from '../../utils';
     9	
    10	/**
    11	 * Defines the IngestJobState type.
    12	 */
    13	export type IngestJobState =
    14	  | 'queued'
    15	  | 'parsing'
    16	  | 'embedding'
    17	  | 'indexing'
    18	  | 'complete'
    19	  | 'failed'
    20	  | 'cancelled';
 succeeded in 52ms:
     1	# Undocumented Features Scan — MCP Server vs Feature Catalog
     2	
     3	> **Date:** 2026-03-07
     4	> **Method:** 10 GPT-5.4 agents scanned 203 TypeScript source files against the 156-feature catalog
     5	> **Raw findings:** 91 | **After dedup + false-positive removal:** 55 genuine gaps
     6	
     7	---
     8	
     9	## Executive Summary
    10	
    11	The scan found **55 undocumented or significantly under-documented capabilities** across the MCP server codebase. These fall into three tiers:
    12	
    13	- **17 High-significance gaps** — Major capabilities with no catalog coverage
    14	- **25 Medium-significance gaps** — Substantial sub-features or extensions not mentioned
    15	- **13 Low-significance gaps** — Infrastructure details or minor extensions
    16	
    17	Most gaps are in the **infrastructure/operational layer** (server lifecycle, crash recovery, circuit breakers) and the **cognitive/scoring subsystems** (FSRS scheduling, working memory, type taxonomy) — areas the catalog describes at a high level but whose implementation depth far exceeds the documentation.
    18	
    19	---
    20	
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Tool Cache
     3	// ---------------------------------------------------------------
     4	
     5	import crypto from 'crypto';
     6	
     7	/* ---------------------------------------------------------------
     8	   1. TYPES
     9	--------------------------------------------------------------- */
    10	
    11	interface ToolCacheConfig {
    12	  enabled: boolean;
    13	  defaultTtlMs: number;
    14	  maxEntries: number;
    15	  cleanupIntervalMs: number;
    16	}
    17	
    18	interface CacheEntry<T = unknown> {
    19	  value: T;
    20	  expiresAt: number;
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Retry Manager
     3	// ---------------------------------------------------------------
     4	
     5	// Node stdlib
     6	import * as fsPromises from 'fs/promises';
     7	
     8	// Internal modules
     9	import * as vectorIndex from '../search/vector-index';
    10	import { computeContentHash, lookupEmbedding, storeEmbedding } from '../cache/embedding-cache';
    11	import { normalizeContentForEmbedding } from '../parsing/content-normalizer';
    12	import { generateDocumentEmbedding, getModelName } from './embeddings';
    13	
    14	// Type imports
    15	import type { MemoryDbRow } from '@spec-kit/shared/types';
    16	
    17	/* ---------------------------------------------------------------
    18	   1. TYPES
    19	--------------------------------------------------------------- */
    20	
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Corrections
     3	// ---------------------------------------------------------------
     4	// LEARNING: CORRECTIONS TRACKING
     5	// ---------------------------------------------------------------
     6	
     7	import type Database from 'better-sqlite3';
     8	
     9	/* -------------------------------------------------------------
    10	   TYPE DEFINITIONS
    11	---------------------------------------------------------------- */
    12	
    13	/**
    14	 * Describes the CorrectionTypes shape.
    15	 */
    16	export interface CorrectionTypes {
    17	  readonly SUPERSEDED: 'superseded';
    18	  readonly DEPRECATED: 'deprecated';
    19	  readonly REFINED: 'refined';
    20	  readonly MERGED: 'merged';
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Layer Definitions
     3	// ---------------------------------------------------------------
     4	// LIB: LAYER DEFINITIONS
     5	// T060: 7-Layer MCP Architecture with Token Budgets
     6	// ---------------------------------------------------------------
     7	
     8	/* ---------------------------------------------------------------
     9	   1. LAYER TYPES
    10	   --------------------------------------------------------------- */
    11	
    12	/** Individual layer definition in the 7-layer architecture */
    13	export interface LayerDefinition {
    14	  id: string;
    15	  name: string;
    16	  description: string;
    17	  tokenBudget: number;
    18	  priority: number;
    19	  useCase: string;
    20	  tools: string[];
codex
I’ve pulled the target files with line numbers and confirmed they contain substantial implementations for all six listed gaps. Next I’m scanning the broader MCP server for circuit-breaker patterns so we can validate Gap 34 precisely and surface any additional resilience features.
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n --hidden --glob '"'!**/node_modules/**'"' \"circuit|breaker|half-open|half_open|cooldown\" '.opencode/skill/system-spec-kit/mcp_server/lib'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n --hidden --glob '"'!**/node_modules/**'"' \"PROVIDER_FAILURE_THRESHOLD|Circuit|circuitState|isOpen\" '.opencode/skill/system-spec-kit/mcp_server/lib/search'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n --hidden --glob '"'!**/node_modules/**'"' \"category|##|Catalog|Feature Catalog|SUGGESTED_CATEGORY|existing categories\" '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Cross Encoder
     3	// ---------------------------------------------------------------
     4	//
     5	// Neural reranking via external APIs (Voyage rerank-2, Cohere
     6	// rerank-english-v3.0) or a local cross-encoder model
     7	// (ms-marco-MiniLM-L-6-v2). When no provider is configured the
     8	// module returns a positional fallback (scored 0–0.5) and marks
     9	// results with scoringMethod:'fallback' so callers can distinguish
    10	// real model scores from synthetic ones.
    11	//
    12	// T204 / OQ-02 DECISION (2026-02-10):
    13	//   The filename "cross-encoder.ts" is ACCURATE.  All three
    14	//   providers invoke real ML-based reranking — either cloud APIs
    15	//   that run neural rerankers server-side (Voyage, Cohere) or a
    16	//   local cross-encoder model.  The positional fallback is NOT a
    17	//   cross-encoder, but is already clearly separated via the
    18	//   scoringMethod discriminator.  No rename required.
    19	// ---------------------------------------------------------------
    20	
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:287:  // If specFolder hints at an artifact type, use it as tiebreaker
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:122:// AI-WHY: T3-15 circuit breaker — prevents cascading failures when external
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:124:// failures, the circuit opens and calls skip the API for COOLDOWN_MS, returning
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:134:const circuitBreakers = new Map<string, CircuitState>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:137:  let state = circuitBreakers.get(provider);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:140:    circuitBreakers.set(provider, state);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:149:    // Cooldown elapsed — half-open: allow one attempt
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:168:    console.warn(`[cross-encoder] Circuit breaker OPEN for ${provider} after ${state.failures} consecutive failures. Cooldown: ${CIRCUIT_COOLDOWN_MS}ms`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:378:  // AI-WHY: T3-15 — Circuit breaker check. When the provider has failed
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:503:  circuitBreakers.clear();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:437: * `id ASC` is used as a deterministic tie-breaker when timestamps are equal.
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:105:// AI-WHY: T3-15 circuit breaker — prevents the background retry job from
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:108:// circuit opens for PROVIDER_COOLDOWN_MS, causing retryEmbedding to skip
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:135:    console.warn(`[retry-manager] Embedding provider circuit breaker OPEN after ${providerFailures} consecutive failures. Cooldown: ${PROVIDER_COOLDOWN_MS}ms`);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:271:      // T3-15: Skip API call if provider circuit breaker is open
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:273:        return { success: false, error: 'Embedding provider circuit breaker open — skipping API call' };
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:129:interface CircuitState {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:134:const circuitBreakers = new Map<string, CircuitState>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:136:function getCircuit(provider: string): CircuitState {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:145:function isCircuitOpen(provider: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:146:  const state = getCircuit(provider);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:158:  const state = getCircuit(provider);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:164:  const state = getCircuit(provider);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:168:    console.warn(`[cross-encoder] Circuit breaker OPEN for ${provider} after ${state.failures} consecutive failures. Cooldown: ${CIRCUIT_COOLDOWN_MS}ms`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:378:  // AI-WHY: T3-15 — Circuit breaker check. When the provider has failed
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:380:  if (isCircuitOpen(provider)) {
 succeeded in 51ms:
Total output lines: 662

.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:1:# Decision Record: Feature Catalog Audit & Remediation
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:9:## ADR-001: 30-Agent Partitioning Strategy
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:11:### Metadata
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:21:### Context
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:25:### Constraints
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:33:### Decision
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:35:**We chose**: Two-stream partitioning with 20 Copilot agents for category-contiguous verification and 10 Codex agents for architecture-zone gap investigation.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:41:### Alternatives Considered
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:53:### Consequences
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:71:### Five Checks Evaluation
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:85:### Implementation
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:95:## ADR-002: Gap Classification Methodology
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:97:### Metadata
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:107:### Context
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:111:### Constraints
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:119:### Decision
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:123:**How it works**: Each finding gets a significance tier AND an action category. Action categories map to priorities: PATH-VALIDATE is P0, DESC-UPDATE/PATH-ADD/PATH-REMOVE/REWRITE is P1, NEW-FEATURE high-sig is P1, NEW-FEATURE med/low is P2, CATEGORY-MOVE is P2.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:127:### Alternatives Considered
exec
/bin/zsh -lc "ls -1 '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
01--retrieval
02--mutation
03--discovery
04--maintenance
05--lifecycle
06--analysis
07--evaluation
08--bug-fixes-and-data-integrity
09--evaluation-and-measurement
10--graph-signal-activation
11--scoring-and-calibration
12--query-intelligence
13--memory-quality-and-indexing
14--pipeline-architecture
15--retrieval-enhancements
16--tooling-and-scripts
17--governance
18--ux-hooks
19--decisions-and-deferrals
20--feature-flag-reference
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	---
     2	title: "Spec Kit Memory  -- Feature Catalog"
     3	description: "Unified reference combining the complete system feature inventory and the refinement program changelog for the Spec Kit Memory MCP server."
     4	---
     5	
     6	# Spec Kit Memory  -- Feature Catalog
     7	
     8	This document combines two complementary views of the Spec Kit Memory MCP server into a single reference. The **System Reference** section describes what the system is today  -- every tool, pipeline stage and capability organized by MCP layer. The **Refinement Program** section describes what was changed and why  -- every improvement delivered across the refinement program, with ticket IDs and implementation details.
     9	
    10	## Contents
    11	
    12	- [Retrieval](#retrieval)
    13	  - [Unified context retrieval (memory_context)](#unified-context-retrieval-memory_context)
    14	  - [Semantic and lexical search (memory_search)](#semantic-and-lexical-search-memory_search)
    15	  - [Trigger phrase matching (memory_match_triggers)](#trigger-phrase-matching-memory_match_triggers)
    16	  - [Hybrid search pipeline](#hybrid-search-pipeline)
    17	  - [4-stage pipeline architecture](#4-stage-pipeline-architecture)
    18	  - [BM25 trigger phrase re-index gate](#bm25-trigger-phrase-re-index-gate)
    19	  - [AST-level section retrieval tool](#ast-level-section-retrieval-tool)
    20	  - [Quality-aware 3-tier search fallback](#quality-aware-3-tier-search-fallback)
exec
/bin/zsh -lc "rg -n \"ingest|job queue|memory_ingest|async ingestion|ingestion job\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"retry|embedding_status|background retry|retry manager|backoff\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"circuit breaker|circuit|half-open|rerank failover|fallback\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"7-layer|layer architecture|token budget|L1|L2|L3|L4|L5|L6|L7|tool-to-layer\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"correction|undo|superseded|deprecated|refined|merged|memory_corrections\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"tool cache|withCache|TTL|cache invalidation|invalidateOnWrite|canonical\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:1:# Async ingestion job lifecycle
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:5:**IMPLEMENTED (Sprint 019).** Ingestion moves to a SQLite-persisted job queue (`lib/ops/job-queue.ts`) with lifecycle states `queued → parsing → embedding → indexing → complete/failed/cancelled`, a single sequential worker (one job processing at a time, rest queued), and three new tools: `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`. Coexists with the existing `asyncEmbedding` path in `memory_save` as an alternative for batch operations.
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:18:| `mcp_server/handlers/memory-ingest.ts` | Handler | Ingestion handler |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:24:| `mcp_server/lib/ops/job-queue.ts` | Lib | Async job queue |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:81:| `mcp_server/tests/handler-memory-ingest.vitest.ts` | Ingest handler validation |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:110:- Source feature title: Async ingestion job lifecycle
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:41:  - [Async ingestion job lifecycle](#async-ingestion-job-lifecycle)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:562:### Async ingestion job lifecycle
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:566:A dedicated background job queue in `lib/ops/job-queue.ts` manages ingestion tasks through a state machine: `queued → parsing → embedding → indexing → complete/failed/cancelled`. Three new MCP tools provide direct control: `memory_ingest_start` (returns nanoid-style job ID in <100ms), `memory_ingest_status` (returns progress, files processed, errors), and `memory_ingest_cancel` (stops in-progress jobs). The queue processes files sequentially through a single worker to avoid SQLite contention. On server restart, incomplete jobs are reset to `queued` and automatically re-enqueued. All runtime DB operations use async `withBusyRetry` with exponential backoff to yield the event loop during SQLITE_BUSY retries.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:571:See [`05--lifecycle/05-async-ingestion-job-lifecycle.md`](05--lifecycle/05-async-ingestion-job-lifecycle.md) for full implementation and test file listings.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md:40:| `mcp_server/handlers/memory-ingest.ts` | Handler | Ingestion handler |
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md:91:| `mcp_server/lib/ops/job-queue.ts` | Lib | Async job queue |
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md:271:| `mcp_server/tests/handler-memory-ingest.vitest.ts` | Ingest handler validation |
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/08-context-server-success-hint-append.md:41:| `mcp_server/handlers/memory-ingest.ts` | Handler | Ingestion handler |
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/08-context-server-success-hint-append.md:98:| `mcp_server/lib/ops/job-queue.ts` | Lib | Async job queue |
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/08-context-server-success-hint-append.md:290:| `mcp_server/tests/handler-memory-ingest.vitest.ts` | Ingest handler validation |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md:41:| `mcp_server/handlers/memory-ingest.ts` | Handler | Ingestion handler |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md:98:| `mcp_server/lib/ops/job-queue.ts` | Lib | Async job queue |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md:290:| `mcp_server/tests/handler-memory-ingest.vitest.ts` | Ingest handler validation |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md:42:| `mcp_server/handlers/memory-ingest.ts` | Handler | Ingestion handler |
 succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md:71:| `shared/utils/retry.ts` | Shared | Shared retry utility |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md:109:| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md:110:| `mcp_server/tests/retry.vitest.ts` | Retry utility tests |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md:75:| `shared/utils/retry.ts` | Shared | Shared retry utility |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md:113:| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md:114:| `mcp_server/tests/retry.vitest.ts` | Retry utility tests |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:60:| `shared/utils/retry.ts` | Shared | Shared retry utility |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:91:| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:92:| `mcp_server/tests/retry.vitest.ts` | Retry utility tests |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md:69:| `shared/utils/retry.ts` | Shared | Shared retry utility |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md:107:| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md:108:| `mcp_server/tests/retry.vitest.ts` | Retry utility tests |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md:73:| `shared/utils/retry.ts` | Shared | Shared retry utility |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md:112:| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md:113:| `mcp_server/tests/retry.vitest.ts` | Retry utility tests |
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:564:**IMPLEMENTED (Sprint 019).** *(Overlap note: supersedes the current lightweight `asyncEmbedding` path in memory-save.ts, which uses `setImmediate()` + `retryManager.retryEmbedding()` for single-file async saves.)* Bulk indexing of large spec directories can hit MCP timeout limits. This feature introduces a full job lifecycle with SQLite persistence for crash recovery.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:566:A dedicated background job queue in `lib/ops/job-queue.ts` manages ingestion tasks through a state machine: `queued → parsing → embedding → indexing → complete/failed/cancelled`. Three new MCP tools provide direct control: `memory_ingest_start` (returns nanoid-style job ID in <100ms), `memory_ingest_status` (returns progress, files processed, errors), and `memory_ingest_cancel` (stops in-progress jobs). The queue processes files sequentially through a single worker to avoid SQLite contention. On server restart, incomplete jobs are reset to `queued` and automatically re-enqueued. All runtime DB operations use async `withBusyRetry` with exponential backoff to yield the event loop during SQLITE_BUSY retries.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1588:Async embedding fallback via `index_memory_deferred()`. When embedding generation fails due to API timeout or rate limiting, memories are inserted with `embedding_status='pending'` and become immediately searchable via BM25/FTS5 (title, trigger_phrases, content_text) and structural SQL (importance_tier, importance_weight). Vector search remains unavailable until `embedding_status='success'`.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1590:Deferred memories skip embedding dimension validation and `vec_memories` insertion entirely. Background retry via the retry manager or CLI reindex increments `retry_count` and updates the status field. The failure reason is recorded for diagnostics. This ensures that no memory is lost due to transient embedding failures  -- lexical searchability is preserved as a degraded-but-functional baseline.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:2016:The watcher implements a 2-second debounce and uses TM-02 SHA-256 content hashing to deduplicate identical writes. On `add` events, the hash cache is pre-seeded so the first subsequent `change` event can properly deduplicate (without seeding, every first change triggers a redundant reindex). ENOENT errors are handled gracefully when a file is rapidly created then deleted before the debounce timer fires. An exponential backoff retry mechanism (3 retries with delays of 1s, 2s, and 4s) handles `SQLITE_BUSY` locks during concurrent write operations. The watcher is registered for cleanup in the server shutdown handler (async-with-deadline) to prevent process leaks. This subsystem is controlled by the `SPECKIT_FILE_WATCHER` flag (default `false`) and watches only configured spec directories (no arbitrary path traversal).
 succeeded in 50ms:
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md:1:# Dynamic token budget allocation
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md:9:The savings add up. If 60% of your queries are simple, you recover roughly 40% of the token budget that was previously wasted on over-delivering.
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md:31:- Source feature title: Dynamic token budget allocation
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md:5:The `memory_save` tool accepts a `dryRun` parameter that runs the full save pipeline — content normalization, quality gate evaluation, deduplication check, token budget estimation — without committing any changes to the database or writing files to disk. The response includes what would have happened: whether the save would pass quality gates, the computed quality score breakdown, any near-duplicate warnings, and the estimated token cost.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:5:You send a query or prompt. The system figures out what you need. That is the core idea behind `memory_context`: an L1 orchestration layer that auto-detects your task intent and routes to the best retrieval strategy without you having to pick one.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:9:Each mode has a token budget. Quick gets 800 tokens. Focused gets 1,500. Deep gets 2,000. Resume gets 1,200. After retrieval, the orchestrator estimates token count (1 token per 4 characters) and enforces the budget by stripping lowest-scored results from the tail until the response fits. A dedicated `enforceTokenBudget()` function handles the truncation with detailed tracking of original and returned result counts. When your overall context is running high, a pressure policy kicks in. When the `tokenUsage` ratio exceeds 0.60, the system downgrades to focused mode. Above 0.80, it switches to quick mode. The pressure policy is gated by `SPECKIT_PRESSURE_POLICY` and subject to rollout percentage via `SPECKIT_ROLLOUT_PERCENT`. You can override the mode and intent manually, but the auto-detection handles most cases correctly.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:23:Safety mechanisms run deep. Path security validation checks the file against an allowlist of base paths. File type validation accepts only `.md` and `.txt` in approved directories. Pre-flight validation checks anchor format, detects duplicates and estimates token budget before investing in embedding generation. A per-spec-folder mutex lock prevents TOCTOU race conditions when multiple saves target the same folder. SHA-256 content hashing skips unchanged files. A mutation ledger records every create, update, reinforce and supersede action for audit. The trigger matcher cache, tool cache and constitutional cache are all invalidated on write. If embedding generation fails, the memory is still stored and searchable via BM25/FTS5 with the embedding marked as pending for later re-indexing.
.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/03-3-mcp-configuration.md:8:| `MCP_CHARS_PER_TOKEN` | `3.5` | number | `lib/validation/preflight.ts` | Characters-per-token ratio used for token budget estimation during pre-flight validation. Affects whether a memory file is flagged as too large before embedding generation begins. |
.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/03-3-mcp-configuration.md:11:| `MCP_MAX_MEMORY_TOKENS` | `8000` | number | `lib/validation/preflight.ts` | Maximum token budget per memory (estimated via `MCP_CHARS_PER_TOKEN`). Pre-flight validation warns when a memory exceeds this limit. |
.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/03-3-mcp-configuration.md:13:| `MCP_TOKEN_WARNING_THRESHOLD` | `0.8` | number | `lib/validation/preflight.ts` | Fraction of `MCP_MAX_MEMORY_TOKENS` at which a token budget warning is emitted. At 0.8, a warning fires when estimated tokens exceed 80% of the max. |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md:5:Every memory save operation now computes a quality score based on trigger phrase coverage, anchor format, token budget and content coherence. When the score falls below 0.6, the system auto-fixes by re-extracting triggers, normalizing anchors and trimming content to budget. Then it scores again.
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/13-strict-zod-schema-validation.md:5:**IMPLEMENTED (Sprint 019).** All 28 MCP tool inputs (L1-L7) have Zod runtime schemas defined in `mcp_server/schemas/tool-input-schemas.ts` (re-exported via `tool-schemas.ts`), controlled by `SPECKIT_STRICT_SCHEMAS` (`.strict()` vs `.passthrough()`). Hallucinated parameters from calling LLMs are rejected with clear Zod errors and logged to stderr for audit trail (CHK-029). Adds `zod` dependency.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md:11:Five operational stages run between fusion and delivery. Stage A (query complexity routing, `SPECKIT_COMPLEXITY_ROUTER`) restricts active channels for simple queries to just vector and FTS, moderate queries add BM25, and complex queries get all five. Stage B (RSF shadow fusion, `SPECKIT_RSF_FUSION`) is historical and no longer active in runtime ranking; RSF artifacts are retained for compatibility/testing references only. Stage C (channel enforcement, `SPECKIT_CHANNEL_MIN_REP`) ensures every contributing channel has at least one result in top-k with a 0.005 quality floor. Stage D (confidence truncation, `SPECKIT_CONFIDENCE_TRUNCATION`) trims the irrelevant tail using a 2x-median gap elbow heuristic. Stage E (dynamic token budget, `SPECKIT_DYNAMIC_TOKEN_BUDGET`) computes tier-aware token limits (simple 1,500, moderate 2,500, complex 4,000).
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md:1:# 7-layer tool architecture metadata
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md:5:The layer definitions module (`lib/architecture/layer-definitions.ts`) defines a 7-layer MCP architecture (L1 through L7) where each layer has a designated token budget, priority level, use case description, and list of assigned tools. Layer IDs map to task types (`search`, `browse`, `modify`, `checkpoint`, `analyze`, `maintenance`, `default`) so the system can recommend the appropriate layer for a given operation.
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md:7:Each `LayerDefinition` includes: `id`, `name`, `description`, `tokenBudget`, `priority`, `useCase`, and `tools[]`. The architecture metadata is used by the context handler to enforce per-layer token budgets and by the query classifier to route requests to the correct tool subset. This provides structural governance over which tools are available at each abstraction level and how many tokens each layer can consume.
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md:15:| `mcp_server/lib/architecture/layer-definitions.ts` | Lib | 7-layer architecture definitions and routing |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md:28:- Source feature title: 7-layer tool architecture metadata
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md:7:The coherence signal feeds into the composite quality score alongside trigger coverage, anchor density, and token budget efficiency. A low coherence score can trigger a quality loop rejection, preventing temporally inconsistent content from entering the index.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:110:  - [Dynamic token budget allocation](#dynamic-token-budget-allocation)
 succeeded in 51ms:
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/19-embedding-retry-orchestrator.md:5:The retry manager (`lib/providers/retry-manager.ts`) orchestrates background retry of failed embedding operations. When the primary embedding provider is unavailable or returns errors during `memory_save` or `memory_index_scan`, the affected memories are marked with `embedding_status = 'pending'` and stored without vectors (lexical-only fallback). The retry manager runs as a background job with configurable interval and batch size, picking up pending memories and re-attempting embedding generation.
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md:14:- **CR-P1-8:** Config env var fallback chain (`SPEC_KIT_DB_DIR || SPECKIT_DB_DIR`).
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/03-chunk-ordering-preservation.md:5:When multi-chunk results collapse back into a single memory during MPAB aggregation, chunks are now sorted by their original `chunk_index` so the consuming agent reads content in document order rather than score order. Full parent content is loaded from the database when possible. On DB failure, the best-scoring chunk is emitted as a fallback with `contentSource: 'file_read_fallback'` metadata.
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:19:**Phase 017 update:** The legacy `postSearchPipeline` path  was removed entirely. `isPipelineV2Enabled()` now always returns `true` regardless of the `SPECKIT_PIPELINE_V2` env var (deprecated). The V2 4-stage pipeline is the only code path. A shared `resolveEffectiveScore()` function in `pipeline/types.ts` replaced both Stage 2's `resolveBaseScore()` and Stage 3's local `effectiveScore()`, ensuring a consistent fallback chain (`intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1]) across all stages.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md:5:`memory-crud-update.ts` gained a `database.transaction(() => {...})()` wrapper around its mutation steps (vectorIndex.updateMemory, BM25 re-index, mutation ledger). `memory-crud-delete.ts` gained the same for its single-delete path (memory delete, vector delete, causal edge delete, mutation ledger). Cache invalidation operations remain outside the transaction as in-memory-only operations. Both include null-database fallbacks.
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md:5:The `qualityGateActivatedAt` timestamp in `save-quality-gate.ts` was stored purely in-memory. Every server restart reset the 14-day warn-only countdown, preventing the quality gate from graduating to enforcement mode. The fix adds SQLite persistence to the `config` table using the existing key-value store pattern. `isWarnOnlyMode()` lazy-loads from DB when the in-memory value is null. `setActivationTimestamp()` writes to both memory and DB. All DB operations are non-fatal with graceful fallback.
.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/01-1-search-pipeline-features-speckit.md:50:| `SPECKIT_MEMORY_SUMMARIES` | `true` | boolean | `lib/search/search-flags.ts` | R8 TF-IDF extractive summary generation. At index time, generates a top-3-sentence extractive summary for each memory and joins those sentences into summary text. Summaries serve as a lightweight search channel for fallback matching. |
.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/01-1-search-pipeline-features-speckit.md:66:| `SPECKIT_SEARCH_FALLBACK` | `true` | boolean | `lib/search/search-flags.ts` | PI-A2 quality-aware 3-tier fallback chain. With flag ON: Tier 1 primary retrieval (0.3), Tier 2 widened retrieval (0.1, all channels), Tier 3 structural SQL fallback. With flag OFF: legacy two-pass fallback (0.3 then 0.17). |
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md:1:# Tier-2 fallback channel forcing
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md:5:A `forceAllChannels` option was added to hybrid search. When the tier-2 quality fallback activates, it now sets `forceAllChannels: true` to ensure all retrieval channels execute, bypassing the simple-route channel reduction that could skip BM25 or graph channels. Regression test `C138-P0-FB-T2` verifies the behavior.
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md:29:- Source feature title: Tier-2 fallback channel forcing
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md:5:Async embedding fallback via `index_memory_deferred()`. When embedding generation fails (API timeout, rate limit), memories are inserted with `embedding_status='pending'` and are immediately searchable via BM25/FTS5 (title, trigger_phrases, content_text) and structural SQL (importance_tier, importance_weight). Vector search requires `embedding_status='success'`. Deferred memories skip embedding dimension validation and `vec_memories` insertion. Background retry via the retry manager or CLI reindex increments `retry_count` and updates status. Failure reason is recorded for diagnostics.
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md:15:| `mcp_server/handlers/save/embedding-pipeline.ts` | Handler | Embedding generation pipeline with fallback |
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/04-weight-history-audit-tracking.md:7:Edge bounds are enforced at insert time. Auto-generated edges (those with `created_by='auto'`) are rejected when a node already has 20 edges (`MAX_EDGES_PER_NODE`) and clamped to a maximum strength of 0.5 (`MAX_AUTO_STRENGTH`). A `rollbackWeights()` function restores edges from weight history with a fallback to the oldest entry if timestamp matching fails due to same-millisecond updates.
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md:9:**C2 — Citation fallback chain:** `composite-scoring.ts` fell back through `last_accessed` then `updated_at` when no citation data existed, conflating recency with citation authority. The fallback chain was removed; the function returns 0 when no citation data exists.
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md:1:# Stage 3 effectiveScore fallback chain
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md:5:`effectiveScore()` in `stage3-rerank.ts` only checked `score` then `similarity/100`, skipping `intentAdjustedScore` and `rrfScore` from Stage 2 enrichment. The fix updated the fallback chain to: `intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1] with `isFinite()` guards. Cross-encoder document mapping and MMR candidate scoring now use `effectiveScore()` instead of inline fallbacks. A `stage2Score` field was added to `PipelineRow` in `types.ts` for auditability when Stage 3 overwrites scores.
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md:118:- Source feature title: Stage 3 effectiveScore fallback chain
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md:5:**IMPLEMENTED (Sprint 019).** Search results gain optional provenance envelopes (default `includeTrace: false`) exposing internal pipeline scoring that is currently dropped at Stage 4 exit. When enabled, responses include `scores` (semantic, lexical, fusion, intentAdjusted, composite, rerank, attention), `source` (file, anchorIds, anchorTypes, lastModified, memoryState), and `trace` (channelsUsed, pipelineStages, fallbackTier, queryComplexity, expansionTerms, budgetTruncated, scoreResolution).
.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/04-4-memory-and-storage.md:9:| `MEMORY_DB_DIR` | _(legacy fallback)_ | string | `lib/search/vector-index-impl.ts` | Legacy fallback for the database directory. Superseded by `SPEC_KIT_DB_DIR`. Precedence order: `SPEC_KIT_DB_DIR` > `MEMORY_DB_DIR` > default `database/` directory adjacent to the server root. |
 succeeded in 50ms:
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md:5:After embedding generation, the save pipeline checks the top-3 most similar memories in the same spec folder. Similarity at or above 0.88 triggers a merge where content is combined and the `importance_weight` is incremented via `Math.min(1.0, currentWeight + 0.1)`. Similarity between 0.75 and 0.88 triggers conflict resolution: the old memory is deprecated and a `supersedes` causal edge is created. Below 0.75, the memory stores as a new complement.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:9:The interesting part is what happens before the record is created. A Prediction Error (PE) gating system compares the new content against existing memories via cosine similarity and decides one of five actions. CREATE stores a new record when no similar memory exists. REINFORCE boosts the FSRS stability of an existing duplicate without creating a new entry (the system already knows this, so it strengthens the memory). UPDATE overwrites an existing high-similarity memory in-place when the new version supersedes the old. SUPERSEDE marks the old memory as deprecated, creates a new record and links them with a causal edge. CREATE_LINKED stores a new memory with a relationship edge to a similar but distinct existing memory.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:13:Reconsolidation-on-save runs after embedding generation when `SPECKIT_RECONSOLIDATION` is enabled (default ON). The system checks the top-3 most similar memories in the same spec folder. Similarity at or above 0.88 triggers a merge where content is combined and `importance_weight` is boosted (capped at 1.0). Similarity between 0.75 and 0.88 triggers conflict resolution: the old memory is deprecated and a `supersedes` causal edge is created. Below 0.75, the memory stores unchanged. A checkpoint must exist for the spec folder before reconsolidation can run.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md:9:Auto-promotion fires unconditionally on every positive validation. When a normal-tier memory accumulates 5 positive validations, it is promoted to important. When an important-tier memory reaches 10, it is promoted to critical. A throttle safeguard limits promotions to 3 per 8-hour rolling window. Constitutional, critical, temporary and deprecated tiers are non-promotable. The response includes `autoPromotion` metadata showing whether promotion was attempted, the previous and new tier, and the reason.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:15:The pipeline is the sole runtime path. `SPECKIT_PIPELINE_V2` is deprecated — `isPipelineV2Enabled()` is hardcoded to `true` and the legacy `postSearchPipeline` was removed in Phase 017.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md:1:# Correction tracking with undo
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md:5:The corrections module (`lib/learning/corrections.ts`) tracks inter-memory relationship signals during the learning pipeline. When a memory supersedes, deprecates, refines, or merges with another, the correction is recorded with before/after stability scores and applied penalty/boost values. Four correction types are supported: `superseded`, `deprecated`, `refined`, and `merged`.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md:7:Each correction adjusts the stability scores of both the original and correcting memories: the original receives a penalty while the correction receives a boost. Stability changes are tracked in a `StabilityChanges` structure for audit purposes. The feature is gated by `SPECKIT_RELATIONS` (default `true`). When disabled, relational learning corrections are skipped and no stability adjustments are applied.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md:15:| `mcp_server/lib/learning/corrections.ts` | Lib | Correction tracking and stability adjustment |
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md:21:| `mcp_server/tests/corrections.vitest.ts` | Correction tracking tests |
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md:26:- Source feature title: Correction tracking with undo
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md:30:| `mcp_server/lib/learning/corrections.ts` | Lib | Learning corrections |
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md:79:| `mcp_server/tests/corrections.vitest.ts` | Learning corrections tests |
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md:9:- **Postflight re-correction (#35):** `task_postflight` SELECT now matches `phase IN ('preflight', 'complete')` so re-posting updates the existing record instead of failing.
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/08-agent-consumption-instrumentation.md:5:Instrumentation wiring remains present in retrieval handlers (`memory_search`, `memory_context`, `memory_match_triggers`), but the runtime logger is currently inert/deprecated (`isConsumptionLogEnabled()` hardcoded `false`). Calls remain fail-safe no-ops for compatibility while telemetry paths stay structurally available.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/10-per-memory-history-log.md:5:The `memory_history` table records a per-memory audit trail of state changes. Each row captures the memory ID, the type of event (created, updated, merged, archived, restored), a timestamp, and optional metadata about the change. This provides a complete lifecycle history for any individual memory, enabling operations like "show me everything that happened to memory #42."
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md:5:For large-scale cleanup operations. Instead of targeting a folder, you target an importance tier: delete all deprecated memories, or all temporary memories older than 30 days. The tool counts affected memories first (so the response tells you exactly how many were deleted), creates a safety checkpoint, then deletes within a database transaction.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md:7:Constitutional and critical tier memories receive extra protection. Unscoped deletion of these tiers is refused outright. You must provide a `specFolder` to delete constitutional or critical memories in bulk. The `skipCheckpoint` speed optimization, which skips the safety checkpoint for faster execution, is also rejected for these tiers. If the checkpoint creation itself fails for constitutional/critical, the entire operation aborts. For lower tiers, a checkpoint failure triggers a warning but the deletion proceeds because the risk of losing deprecated or temporary memories is low.
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md:32:| `mcp_server/lib/learning/corrections.ts` | Lib | Learning corrections |
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md:81:| `mcp_server/tests/corrections.vitest.ts` | Learning corrections tests |
 succeeded in 50ms:
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md:48:| `mcp_server/lib/utils/canonical-path.ts` | Lib | Canonical path resolution |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:37:| `mcp_server/lib/utils/canonical-path.ts` | Lib | Canonical path resolution |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md:46:| `mcp_server/lib/utils/canonical-path.ts` | Lib | Canonical path resolution |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md:52:| `mcp_server/lib/utils/canonical-path.ts` | Lib | Canonical path resolution |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md:50:| `mcp_server/lib/utils/canonical-path.ts` | Lib | Canonical path resolution |
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md:117:| `mcp_server/lib/utils/canonical-path.ts` | Lib | Canonical path resolution |
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:60:  - [Canonical ID dedup hardening](#canonical-id-dedup-hardening)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:230:A deep mode expands the query into up to 3 variants using `expandQuery()`, runs hybrid search for each variant in parallel and merges results with deduplication. Results are cached per parameter combination via `toolCache.withCache()`, and session deduplication runs after cache so that cache hits still respect session state.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:348:Safety mechanisms run deep. Path security validation checks the file against an allowlist of base paths. File type validation accepts only `.md` and `.txt` in approved directories. Pre-flight validation checks anchor format, detects duplicates and estimates token budget before investing in embedding generation. A per-spec-folder mutex lock prevents TOCTOU race conditions when multiple saves target the same folder. SHA-256 content hashing skips unchanged files. A mutation ledger records every create, update, reinforce and supersede action for audit. The trigger matcher cache, tool cache and constitutional cache are all invalidated on write. If embedding generation fails, the memory is still stored and searchable via BM25/FTS5 with the embedding marked as pending for later re-indexing.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:769:Current mapping: legacy Phase 016 content is canonically tracked under `007-combined-bug-fixes` (historical source folded from retired `009-post-review-remediation-epic`).
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:782:Current mapping: legacy Phase 018 content is canonically tracked under `007-combined-bug-fixes` (historical source folded from retired `010-cross-ai-audit`).
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:789:See [`08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md`](08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md) for full implementation and test file listings.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1311:- **Shared resolveEffectiveScore (#11):** A single function in `pipeline/types.ts` replaces both Stage 2's `resolveBaseScore()` and Stage 3's local `effectiveScore()`. Uses the canonical fallback chain: `intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1].
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1527:Deduplicated entities are stored in the `memory_entities` table with a UNIQUE constraint on `(memory_id, entity_text)`. The `entity_catalog` table maintains canonical names with Unicode-aware alias normalization (`/[^\p{L}\p{N}\s]/gu`  -- preserving letters and numbers from all scripts) and a `memory_count` field tracking how many memories reference each entity. An `edge_density` check (`totalEdges / totalMemories`) provides a diagnostic metric.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1568:Current mapping: legacy Phase 015 content is canonically tracked under `007-combined-bug-fixes` (historical source folded from retired `009-post-review-remediation-epic`).
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1670:Ten safeguards protect against noise: a 100+ stop-word denylist, rate cap of 3 terms per selection and 8 per memory, 30-day TTL decay, FTS5 isolation verified by 5 critical tests, noise floor (top-3 exclusion), 1-week shadow period (log-but-don't-apply), rollback mechanism, provenance audit log, 72-hour minimum memory age and sprint gate review.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1704:**SQL-level:** Causal edge upsert reduced from 3 DB round-trips to 2 by eliminating the post-upsert SELECT via `lastInsertRowid`. Spec folder hierarchy tree cached with a 60-second WeakMap TTL keyed by database instance.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1715:Current mapping: legacy Phase 017 content is canonically tracked under `007-combined-bug-fixes` (historical source folded from retired `009-post-review-remediation-epic`).
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1851:**Sprint 8 update:** A WeakMap TTL cache (60s, keyed by database instance) was added to `buildHierarchyTree()` to avoid full-scan reconstruction on every search request. An `invalidateHierarchyCache()` export allows explicit cache clearing when hierarchy data changes.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1894:Cross-document entity linking bridges this gap using the entity catalog populated by R10. The `buildEntityCatalog()` function groups entities from the `memory_entities` table by canonical name. The `findCrossDocumentMatches()` function identifies entities appearing in two or more distinct spec folders, which represent genuine cross-document relationships.
exec
/bin/zsh -lc "rg -n \"circuit[- ]broken reranker failover|reranker failover|circuit breaker.*rerank|cross-encoder.*circuit\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:

exec
/bin/zsh -lc "rg --files '.opencode/skill/system-spec-kit/feature_catalog' | rg 'cross-encoder|reranker|rerank|fallback'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md
codex
I found matching feature-catalog entries for several of these gaps, so I’m now cross-checking those docs against the source to distinguish true gaps from already-documented or partially-documented features.
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/19-embedding-retry-orchestrator.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md' | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	# Embedding retry orchestrator
     2	
     3	## Current Reality
     4	
     5	The retry manager (`lib/providers/retry-manager.ts`) orchestrates background retry of failed embedding operations. When the primary embedding provider is unavailable or returns errors during `memory_save` or `memory_index_scan`, the affected memories are marked with `embedding_status = 'pending'` and stored without vectors (lexical-only fallback). The retry manager runs as a background job with configurable interval and batch size, picking up pending memories and re-attempting embedding generation.
     6	
     7	Each retry attempt uses the embedding cache to avoid redundant API calls for content that was previously embedded successfully. The retry stats (`pending`, `retry`, `failed` counts) are exposed for monitoring. Failed memories increment a `retry_count` for progressive backoff. The orchestrator coordinates with the index-refresh module to ensure retried embeddings are properly inserted into `vec_memories`.
     8	
     9	## Source Files
    10	
    11	### Implementation
    12	
    13	| File | Layer | Role |
    14	|------|-------|------|
    15	| `mcp_server/lib/providers/retry-manager.ts` | Lib | Background retry job with batch processing |
    16	| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding provider dispatch |
    17	| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding cache for retry dedup |
    18	| `mcp_server/lib/storage/index-refresh.ts` | Lib | Index refresh for retried embeddings |
    19	
    20	### Tests
 succeeded in 52ms:
     1	# Async ingestion job lifecycle
     2	
     3	## Current Reality
     4	
     5	**IMPLEMENTED (Sprint 019).** Ingestion moves to a SQLite-persisted job queue (`lib/ops/job-queue.ts`) with lifecycle states `queued → parsing → embedding → indexing → complete/failed/cancelled`, a single sequential worker (one job processing at a time, rest queued), and three new tools: `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`. Coexists with the existing `asyncEmbedding` path in `memory_save` as an alternative for batch operations.
     6	
     7	## Source Files
     8	
     9	### Implementation
    10	
    11	| File | Layer | Role |
    12	|------|-------|------|
    13	| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
    14	| `mcp_server/core/config.ts` | Core | Server configuration |
    15	| `mcp_server/core/db-state.ts` | Core | Database state management |
    16	| `mcp_server/core/index.ts` | Core | Module barrel export |
    17	| `mcp_server/formatters/token-metrics.ts` | Formatter | Token metrics display |
    18	| `mcp_server/handlers/memory-ingest.ts` | Handler | Ingestion handler |
    19	| `mcp_server/handlers/types.ts` | Handler | Type definitions |
    20	| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
 succeeded in 51ms:
     1	# Correction tracking with undo
     2	
     3	## Current Reality
     4	
     5	The corrections module (`lib/learning/corrections.ts`) tracks inter-memory relationship signals during the learning pipeline. When a memory supersedes, deprecates, refines, or merges with another, the correction is recorded with before/after stability scores and applied penalty/boost values. Four correction types are supported: `superseded`, `deprecated`, `refined`, and `merged`.
     6	
     7	Each correction adjusts the stability scores of both the original and correcting memories: the original receives a penalty while the correction receives a boost. Stability changes are tracked in a `StabilityChanges` structure for audit purposes. The feature is gated by `SPECKIT_RELATIONS` (default `true`). When disabled, relational learning corrections are skipped and no stability adjustments are applied.
     8	
     9	## Source Files
    10	
    11	### Implementation
    12	
    13	| File | Layer | Role |
    14	|------|-------|------|
    15	| `mcp_server/lib/learning/corrections.ts` | Lib | Correction tracking and stability adjustment |
    16	
    17	### Tests
    18	
    19	| File | Focus |
    20	|------|-------|
 succeeded in 51ms:
     1	# Tool-level TTL cache
     2	
     3	## Current Reality
     4	
     5	The tool cache (`lib/cache/tool-cache.ts`) provides a per-tool, TTL-based in-memory cache that sits in front of expensive operations like embedding generation and database queries. Each cache entry is keyed by a SHA-256 hash of the tool name plus input parameters and expires after a configurable TTL (default 60 seconds via `TOOL_CACHE_TTL_MS`). Maximum cache size is governed by `TOOL_CACHE_MAX_ENTRIES` (default 1000) with oldest-entry eviction on overflow.
     6	
     7	Cache statistics (hits, misses, evictions, invalidations, hit rate) are tracked for observability. A periodic cleanup sweep removes expired entries. Tool-specific invalidation allows targeted cache busting after mutations without flushing the entire cache. The cache is wired into multiple handlers including `memory_search`, `memory_save`, `memory_delete`, and `memory_bulk_delete` via the mutation hooks system.
     8	
     9	## Source Files
    10	
    11	### Implementation
    12	
    13	| File | Layer | Role |
    14	|------|-------|------|
    15	| `mcp_server/lib/cache/tool-cache.ts` | Lib | TTL-based tool cache with eviction |
    16	| `mcp_server/handlers/mutation-hooks.ts` | Handler | Cache invalidation on mutations |
    17	
    18	### Tests
    19	
    20	| File | Focus |
 succeeded in 51ms:
     1	# 7-layer tool architecture metadata
     2	
     3	## Current Reality
     4	
     5	The layer definitions module (`lib/architecture/layer-definitions.ts`) defines a 7-layer MCP architecture (L1 through L7) where each layer has a designated token budget, priority level, use case description, and list of assigned tools. Layer IDs map to task types (`search`, `browse`, `modify`, `checkpoint`, `analyze`, `maintenance`, `default`) so the system can recommend the appropriate layer for a given operation.
     6	
     7	Each `LayerDefinition` includes: `id`, `name`, `description`, `tokenBudget`, `priority`, `useCase`, and `tools[]`. The architecture metadata is used by the context handler to enforce per-layer token budgets and by the query classifier to route requests to the correct tool subset. This provides structural governance over which tools are available at each abstraction level and how many tokens each layer can consume.
     8	
     9	## Source Files
    10	
    11	### Implementation
    12	
    13	| File | Layer | Role |
    14	|------|-------|------|
    15	| `mcp_server/lib/architecture/layer-definitions.ts` | Lib | 7-layer architecture definitions and routing |
    16	| `mcp_server/handlers/memory-context.ts` | Handler | Context handler using layer metadata |
    17	
    18	### Tests
    19	
    20	| File | Focus |
 succeeded in 50ms:
     1	# Semantic and lexical search (memory_search)
     2	
     3	## Current Reality
     4	
     5	This is the primary search tool, and it does a lot. You give it a natural language query (or a multi-concept array of 2-5 strings where all concepts must match), and it runs the full hybrid retrieval pipeline.
     6	
     7	The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a+N2b), FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
     8	
     9	A deep mode expands the query into up to 3 variants using `expandQuery()`, runs hybrid search for each variant in parallel and merges results with deduplication. Results are cached per parameter combination via `toolCache.withCache()`, and session deduplication runs after cache so that cache hits still respect session state.
    10	
    11	The parameter surface is wide. You control result count (`limit`, 1-100), spec folder scoping, tier and context type filtering, intent (explicit or auto-detected), reranking toggle, length penalty, temporal decay, minimum memory state (`minState`, default `"WARM"`, range HOT through ARCHIVED), constitutional inclusion, content inclusion, anchor filtering, session dedup, session boosting, causal boosting, minimum quality threshold, cache bypass and access tracking. Most defaults are sensible. You typically send a query and a session ID and let everything else run at defaults.
    12	
    13	## Source Files
    14	
    15	### Implementation
    16	
    17	| File | Layer | Role |
    18	|------|-------|------|
    19	| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
    20	| `mcp_server/core/config.ts` | Core | Server configuration |
exec
/bin/zsh -lc "rg -n \"cross-encoder\\.ts|cross-encoder|rerank-2|Cohere|Voyage|circuit\" '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration' '.opencode/skill/system-spec-kit/feature_catalog/01--retrieval' '.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md:44:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/09-contextual-tree-injection.md:71:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:11:Stage 3 (Rerank and Aggregate) handles cross-encoder reranking (optional, gated by `SPECKIT_CROSS_ENCODER`) and MPAB chunk collapse with parent reassembly. Chunks are grouped by parent ID, the best chunk per group is elected by score, and full parent content is loaded from the database. On DB failure, the best-chunk row is emitted as a fallback. Non-chunks and reassembled parents merge and sort descending by effective score.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:48:| `mcp_server/lib/search/cross-encoder.ts` | Lib | Cross-encoder reranking |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:108:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:134:| `mcp_server/tests/cross-encoder-extended.vitest.ts` | Cross-encoder extended |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:135:| `mcp_server/tests/cross-encoder.vitest.ts` | Cross-encoder tests |
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md:26:| `mcp_server/lib/search/cross-encoder.ts` | Lib | Cross-encoder reranking |
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md:60:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md:76:| `mcp_server/tests/cross-encoder-extended.vitest.ts` | Cross-encoder extended |
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md:77:| `mcp_server/tests/cross-encoder.vitest.ts` | Cross-encoder tests |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md:81:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:7:The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a+N2b), FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:59:| `mcp_server/lib/search/cross-encoder.ts` | Lib | Cross-encoder reranking |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:122:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:152:| `mcp_server/tests/cross-encoder-extended.vitest.ts` | Cross-encoder extended |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:153:| `mcp_server/tests/cross-encoder.vitest.ts` | Cross-encoder tests |
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md:24:| `mcp_server/lib/search/cross-encoder.ts` | Lib | Cross-encoder reranking |
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md:53:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md:69:| `mcp_server/tests/cross-encoder-extended.vitest.ts` | Cross-encoder extended |
exec
/bin/zsh -lc "rg -n \"circuit breaker open|half-open|cooldown|provider circuit\" '.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/19-embedding-retry-orchestrator.md' '.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md' '.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md' '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"state transition conflict|compare-and-swap|expected '\\\\{|error log truncated|MAX_STORED_ERRORS|continue on file error\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"enhanceDescription|getLayerPrefix|getLayerDocumentation|layer prefix|\\[L1:|progressive disclosure\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"invalidateByPattern|regex pattern|pattern invalidation|invalidateByTool|tool-specific invalidation\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md:75:| `mcp_server/tests/handler-memory-index-cooldown.vitest.ts` | Index cooldown validation |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:152:| `mcp_server/tests/handler-memory-index-cooldown.vitest.ts` | Index cooldown validation |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:173:| `mcp_server/tests/handler-memory-index-cooldown.vitest.ts` | Index cooldown validation |
 exited 1 in 53ms:

 exited 1 in 53ms:

 succeeded in 51ms:
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:439:Contradiction detection uses regex patterns. All decisions are logged to the `memory_conflicts` table with similarity score, chosen action, contradiction flag, reason, and spec_folder. Document-type-aware weighting adjusts thresholds (constitutional=1.0 down to scratch=0.25). The engine is always active unless `force: true` is passed to bypass arbitration.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/08-prediction-error-save-arbitration.md:5:5-action decision engine during the save path. Examines semantic similarity of new content against existing memories: REINFORCE (>=0.95, boost FSRS stability), UPDATE (0.85-0.94 no contradiction, in-place update), SUPERSEDE (0.85-0.94 with contradiction, deprecate old + create new), CREATE_LINKED (0.70-0.84, new memory + causal edge), CREATE (<0.70, standalone). Contradiction detection via regex patterns. All decisions are logged to the `memory_conflicts` table with similarity, action, contradiction flag, reason, and spec_folder. Document-type-aware weighting (constitutional=1.0 down to scratch=0.25). Always active unless `force: true` is passed.
exec
/bin/zsh -lc "rg -n \"undo|causal edge|is_undone|undone_at|restore\" '.opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
1:# Correction tracking with undo
26:- Source feature title: Correction tracking with undo
exec
/bin/zsh -lc "rg -n \"circuit|cooldown|half-open|failure threshold|open\" '.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/19-embedding-retry-orchestrator.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 53ms:

codex
---
GAP_NUMBER: 32  
FEATURE_NAME: Durable Ingest Job Queue  
STATUS: FALSE_POSITIVE  
SOURCE_FILES: mcp_server/lib/ops/job-queue.ts:13-20, mcp_server/lib/ops/job-queue.ts:164-207, mcp_server/lib/ops/job-queue.ts:376-453, mcp_server/lib/ops/job-queue.ts:455-517  
DRAFT_DESCRIPTION: The ingest queue is implemented as a SQLite-backed state machine with persisted job records, per-file progress counters, and stored error history. It runs through `queued → parsing → embedding → indexing → complete/failed/cancelled`, processes one job at a time, resumes interrupted jobs on startup, and continues processing even when individual files fail.  
SUGGESTED_CATEGORY: 05--lifecycle  
SIGNIFICANCE: LOW  
NOTES: Already documented in `feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md`.
---

---
GAP_NUMBER: 33  
FEATURE_NAME: Embedding Retry Orchestrator  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: mcp_server/lib/providers/retry-manager.ts:85-99, mcp_server/lib/providers/retry-manager.ts:143-190, mcp_server/lib/providers/retry-manager.ts:239-330, mcp_server/lib/providers/retry-manager.ts:454-529, mcp_server/lib/providers/retry-manager.ts:105-137  
DRAFT_DESCRIPTION: The retry manager orchestrates pending/retry/failed embedding states with backoff delays, batch retry processing, and a recurring background worker. It also includes a provider circuit breaker that opens after repeated failures and suppresses outbound embedding calls during cooldown. The orchestrator is documented, but this circuit-breaker behavior is not captured in the current catalog entry.  
SUGGESTED_CATEGORY: 14--pipeline-architecture  
SIGNIFICANCE: MEDIUM  
NOTES: Circuit breaker implementation exists here even though `19-embedding-retry-orchestrator.md` does not mention it.
---

---
GAP_NUMBER: 34  
FEATURE_NAME: Circuit-Broken Reranker Failover  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: mcp_server/lib/search/cross-encoder.ts:122-170, mcp_server/lib/search/cross-encoder.ts:378-389, mcp_server/lib/search/cross-encoder.ts:451-464  
DRAFT_DESCRIPTION: The reranker has per-provider circuit breakers with failure counting, open-state cooldown, and half-open recovery behavior. When open (or when rerank requests fail), it bypasses API calls and returns positional fallback scores marked as `scoringMethod: 'fallback'`. This resilience path is implemented but not explicitly documented as a standalone feature in current catalog text.  
SUGGESTED_CATEGORY: 11--scoring-and-calibration  
SIGNIFICANCE: MEDIUM  
NOTES: Circuit breaker implementations found in codebase are in `cross-encoder.ts` and `providers/retry-manager.ts`.
---

---
GAP_NUMBER: 35  
FEATURE_NAME: Tool-Level TTL Cache  
STATUS: FALSE_POSITIVE  
SOURCE_FILES: mcp_server/lib/cache/tool-cache.ts:49-54, mcp_server/lib/cache/tool-cache.ts:75-114, mcp_server/lib/cache/tool-cache.ts:120-159, mcp_server/lib/cache/tool-cache.ts:236-257, mcp_server/lib/cache/tool-cache.ts:263-301, mcp_server/lib/cache/tool-cache.ts:314-338  
DRAFT_DESCRIPTION: The tool cache uses canonicalized argument hashing (SHA-256), per-entry TTL expiration, bounded size with oldest-entry eviction, and periodic cleanup. It also supports write-triggered invalidation for read tools and is exposed through `withCache(...)` wrappers with hit/miss/eviction telemetry.  
SUGGESTED_CATEGORY: 11--scoring-and-calibration  
SIGNIFICANCE: LOW  
NOTES: Already documented in `feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md`.
---

---
GAP_NUMBER: 36  
FEATURE_NAME: Correction Tracking with Undo  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: mcp_server/lib/learning/corrections.ts:232-275, mcp_server/lib/learning/corrections.ts:356-528, mcp_server/lib/learning/corrections.ts:537-625  
DRAFT_DESCRIPTION: Corrections are persisted with type (`superseded/deprecated/refined/merged`), before/after stability values, and undo metadata (`is_undone`, `undone_at`). `record_correction(...)` applies stability penalty/boost atomically and can mirror the correction as a causal edge; `undo_correction(...)` restores prior stability and removes the mirrored edge. The catalog entry exists but does not currently describe the undo execution path and causal-edge rollback mechanics.  
SUGGESTED_CATEGORY: 02--mutation  
SIGNIFICANCE: MEDIUM  
NOTES: `feature_catalog/02--mutation/09-correction-tracking-with-undo.md` mentions the feature but omits operational undo details.
---

---
GAP_NUMBER: 37  
FEATURE_NAME: 7-Layer Tool Architecture Metadata  
STATUS: FALSE_POSITIVE  
SOURCE_FILES: mcp_server/lib/architecture/layer-definitions.ts:43-116, mcp_server/lib/architecture/layer-definitions.ts:127-132, mcp_server/lib/architecture/layer-definitions.ts:173-213  
DRAFT_DESCRIPTION: The architecture metadata defines L1–L7 layers with per-layer token budgets, priorities, use cases, and tool assignments. It also provides tool-to-layer lookup and task-type-based recommended layer paths for progressive disclosure.  
SUGGESTED_CATEGORY: 14--pipeline-architecture  
SIGNIFICANCE: LOW  
NOTES: Already documented in `feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md`.
---

---
GAP_NUMBER: NEW-01 (not in undocumented-features-scan.md)  
FEATURE_NAME: Optimistic State-Transition Conflict Guard (Ingest Queue)  
STATUS: NEW_GAP  
SOURCE_FILES: mcp_server/lib/ops/job-queue.ts:274-289  
DRAFT_DESCRIPTION: Ingest state changes use an expected-current-state update (`WHERE id = ? AND state = ?`) to detect concurrent transition races. If no rows are changed, the queue throws a transition-conflict error instead of silently overwriting state.  
SUGGESTED_CATEGORY: 05--lifecycle  
SIGNIFICANCE: MEDIUM  
NOTES: This concurrency guard is not represented in gaps 32-37 and is not called out in current lifecycle feature text.
---

---
GAP_NUMBER: NEW-02 (not in undocumented-features-scan.md)  
FEATURE_NAME: Regex-Based Tool Cache Invalidation  
STATUS: NEW_GAP  
SOURCE_FILES: mcp_server/lib/cache/tool-cache.ts:205-227  
DRAFT_DESCRIPTION: Beyond per-tool invalidation, the cache supports regex/string pattern invalidation over `toolName`, enabling targeted busts across tool families. This allows narrower invalidation scopes than full cache clears after subsystem changes.  
SUGGESTED_CATEGORY: 11--scoring-and-calibration  
SIGNIFICANCE: LOW  
NOTES: Current tool-cache catalog text describes targeted invalidation generally, but not this explicit regex/pattern API.
---

---
GAP_NUMBER: NEW-03 (not in undocumented-features-scan.md)  
FEATURE_NAME: Layer Prefix/Documentation Rendering Utilities  
STATUS: NEW_GAP  
SOURCE_FILES: mcp_server/lib/architecture/layer-definitions.ts:145-162, mcp_server/lib/architecture/layer-definitions.ts:224-238  
DRAFT_DESCRIPTION: The layer module can prepend `[L#:Name]` metadata to tool descriptions and generate a full human-readable architecture document string. These utilities make layer metadata directly consumable in UX/docs surfaces, not just internal routing.  
SUGGESTED_CATEGORY: 14--pipeline-architecture  
SIGNIFICANCE: LOW  
NOTES: Not listed in gaps 32-37 and only partially implied by the current 7-layer feature description.
---
tokens used
115,560
---
GAP_NUMBER: 32  
FEATURE_NAME: Durable Ingest Job Queue  
STATUS: FALSE_POSITIVE  
SOURCE_FILES: mcp_server/lib/ops/job-queue.ts:13-20, mcp_server/lib/ops/job-queue.ts:164-207, mcp_server/lib/ops/job-queue.ts:376-453, mcp_server/lib/ops/job-queue.ts:455-517  
DRAFT_DESCRIPTION: The ingest queue is implemented as a SQLite-backed state machine with persisted job records, per-file progress counters, and stored error history. It runs through `queued → parsing → embedding → indexing → complete/failed/cancelled`, processes one job at a time, resumes interrupted jobs on startup, and continues processing even when individual files fail.  
SUGGESTED_CATEGORY: 05--lifecycle  
SIGNIFICANCE: LOW  
NOTES: Already documented in `feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md`.
---

---
GAP_NUMBER: 33  
FEATURE_NAME: Embedding Retry Orchestrator  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: mcp_server/lib/providers/retry-manager.ts:85-99, mcp_server/lib/providers/retry-manager.ts:143-190, mcp_server/lib/providers/retry-manager.ts:239-330, mcp_server/lib/providers/retry-manager.ts:454-529, mcp_server/lib/providers/retry-manager.ts:105-137  
DRAFT_DESCRIPTION: The retry manager orchestrates pending/retry/failed embedding states with backoff delays, batch retry processing, and a recurring background worker. It also includes a provider circuit breaker that opens after repeated failures and suppresses outbound embedding calls during cooldown. The orchestrator is documented, but this circuit-breaker behavior is not captured in the current catalog entry.  
SUGGESTED_CATEGORY: 14--pipeline-architecture  
SIGNIFICANCE: MEDIUM  
NOTES: Circuit breaker implementation exists here even though `19-embedding-retry-orchestrator.md` does not mention it.
---

---
GAP_NUMBER: 34  
FEATURE_NAME: Circuit-Broken Reranker Failover  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: mcp_server/lib/search/cross-encoder.ts:122-170, mcp_server/lib/search/cross-encoder.ts:378-389, mcp_server/lib/search/cross-encoder.ts:451-464  
DRAFT_DESCRIPTION: The reranker has per-provider circuit breakers with failure counting, open-state cooldown, and half-open recovery behavior. When open (or when rerank requests fail), it bypasses API calls and returns positional fallback scores marked as `scoringMethod: 'fallback'`. This resilience path is implemented but not explicitly documented as a standalone feature in current catalog text.  
SUGGESTED_CATEGORY: 11--scoring-and-calibration  
SIGNIFICANCE: MEDIUM  
NOTES: Circuit breaker implementations found in codebase are in `cross-encoder.ts` and `providers/retry-manager.ts`.
---

---
GAP_NUMBER: 35  
FEATURE_NAME: Tool-Level TTL Cache  
STATUS: FALSE_POSITIVE  
SOURCE_FILES: mcp_server/lib/cache/tool-cache.ts:49-54, mcp_server/lib/cache/tool-cache.ts:75-114, mcp_server/lib/cache/tool-cache.ts:120-159, mcp_server/lib/cache/tool-cache.ts:236-257, mcp_server/lib/cache/tool-cache.ts:263-301, mcp_server/lib/cache/tool-cache.ts:314-338  
DRAFT_DESCRIPTION: The tool cache uses canonicalized argument hashing (SHA-256), per-entry TTL expiration, bounded size with oldest-entry eviction, and periodic cleanup. It also supports write-triggered invalidation for read tools and is exposed through `withCache(...)` wrappers with hit/miss/eviction telemetry.  
SUGGESTED_CATEGORY: 11--scoring-and-calibration  
SIGNIFICANCE: LOW  
NOTES: Already documented in `feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md`.
---

---
GAP_NUMBER: 36  
FEATURE_NAME: Correction Tracking with Undo  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: mcp_server/lib/learning/corrections.ts:232-275, mcp_server/lib/learning/corrections.ts:356-528, mcp_server/lib/learning/corrections.ts:537-625  
DRAFT_DESCRIPTION: Corrections are persisted with type (`superseded/deprecated/refined/merged`), before/after stability values, and undo metadata (`is_undone`, `undone_at`). `record_correction(...)` applies stability penalty/boost atomically and can mirror the correction as a causal edge; `undo_correction(...)` restores prior stability and removes the mirrored edge. The catalog entry exists but does not currently describe the undo execution path and causal-edge rollback mechanics.  
SUGGESTED_CATEGORY: 02--mutation  
SIGNIFICANCE: MEDIUM  
NOTES: `feature_catalog/02--mutation/09-correction-tracking-with-undo.md` mentions the feature but omits operational undo details.
---

---
GAP_NUMBER: 37  
FEATURE_NAME: 7-Layer Tool Architecture Metadata  
STATUS: FALSE_POSITIVE  
SOURCE_FILES: mcp_server/lib/architecture/layer-definitions.ts:43-116, mcp_server/lib/architecture/layer-definitions.ts:127-132, mcp_server/lib/architecture/layer-definitions.ts:173-213  
DRAFT_DESCRIPTION: The architecture metadata defines L1–L7 layers with per-layer token budgets, priorities, use cases, and tool assignments. It also provides tool-to-layer lookup and task-type-based recommended layer paths for progressive disclosure.  
SUGGESTED_CATEGORY: 14--pipeline-architecture  
SIGNIFICANCE: LOW  
NOTES: Already documented in `feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md`.
---

---
GAP_NUMBER: NEW-01 (not in undocumented-features-scan.md)  
FEATURE_NAME: Optimistic State-Transition Conflict Guard (Ingest Queue)  
STATUS: NEW_GAP  
SOURCE_FILES: mcp_server/lib/ops/job-queue.ts:274-289  
DRAFT_DESCRIPTION: Ingest state changes use an expected-current-state update (`WHERE id = ? AND state = ?`) to detect concurrent transition races. If no rows are changed, the queue throws a transition-conflict error instead of silently overwriting state.  
SUGGESTED_CATEGORY: 05--lifecycle  
SIGNIFICANCE: MEDIUM  
NOTES: This concurrency guard is not represented in gaps 32-37 and is not called out in current lifecycle feature text.
---

---
GAP_NUMBER: NEW-02 (not in undocumented-features-scan.md)  
FEATURE_NAME: Regex-Based Tool Cache Invalidation  
STATUS: NEW_GAP  
SOURCE_FILES: mcp_server/lib/cache/tool-cache.ts:205-227  
DRAFT_DESCRIPTION: Beyond per-tool invalidation, the cache supports regex/string pattern invalidation over `toolName`, enabling targeted busts across tool families. This allows narrower invalidation scopes than full cache clears after subsystem changes.  
SUGGESTED_CATEGORY: 11--scoring-and-calibration  
SIGNIFICANCE: LOW  
NOTES: Current tool-cache catalog text describes targeted invalidation generally, but not this explicit regex/pattern API.
---

---
GAP_NUMBER: NEW-03 (not in undocumented-features-scan.md)  
FEATURE_NAME: Layer Prefix/Documentation Rendering Utilities  
STATUS: NEW_GAP  
SOURCE_FILES: mcp_server/lib/architecture/layer-definitions.ts:145-162, mcp_server/lib/architecture/layer-definitions.ts:224-238  
DRAFT_DESCRIPTION: The layer module can prepend `[L#:Name]` metadata to tool descriptions and generate a full human-readable architecture document string. These utilities make layer metadata directly consumable in UX/docs surfaces, not just internal routing.  
SUGGESTED_CATEGORY: 14--pipeline-architecture  
SIGNIFICANCE: LOW  
NOTES: Not listed in gaps 32-37 and only partially implied by the current 7-layer feature description.
---
