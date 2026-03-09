OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce98-d8f1-7130-88f7-e758901d028c
--------
user
You are investigating undocumented features in an MCP server. Read these source files under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/: handlers/memory-index*.ts (all files matching this pattern), also check for causal-links-processor.ts and vector-index-mutations.ts under lib/ or handlers/. Verify these gaps: Gap 10 (Spec Document Discovery + Level Inference), Gap 11 (Auto Spec-Document Causal Chains), Gap 12 (Declarative Causal Link Ingestion), Gap 13 (Deferred Lexical-Only Indexing). 

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
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: code_mode starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
You want a source-level verification of Gaps 10–13 in the Spec Kit MCP server, plus any new undocumented capabilities in the same area. I’m going to scan the requested `mcp_server` files first, then map each gap to concrete implementation lines and report status with evidence.
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server | rg 'handlers/memory-index.*\\.ts|causal-links-processor\\.ts|vector-index-mutations\\.ts|undocumented-features-scan\\.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts
codex
I found all requested implementation files, including `memory-index*`, `causal-links-processor.ts`, and `vector-index-mutations.ts`. Next I’ll read them alongside `undocumented-features-scan.md` so each gap status is grounded in exact line evidence.
exec
/bin/zsh -lc "rg --files | rg 'undocumented-features-scan\\.md"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/undocumented-features-scan.md
exec
/bin/zsh -lc 'rg -n "Gap 1[0-3]|GAP 1[0-3]|Gap10|Gap11|Gap12|Gap13" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/undocumented-features-scan.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:

codex
The scan file is in `.opencode/specs/.../011-feature-catalog/undocumented-features-scan.md`; I’m opening it directly now because the gap headers use a different format than expected.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/undocumented-features-scan.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Undocumented Features Scan — MCP Server vs Feature Catalog

> **Date:** 2026-03-07
> **Method:** 10 GPT-5.4 agents scanned 203 TypeScript source files against the 156-feature catalog
> **Raw findings:** 91 | **After dedup + false-positive removal:** 55 genuine gaps

---

## Executive Summary

The scan found **55 undocumented or significantly under-documented capabilities** across the MCP server codebase. These fall into three tiers:

- **17 High-significance gaps** — Major capabilities with no catalog coverage
- **25 Medium-significance gaps** — Substantial sub-features or extensions not mentioned
- **13 Low-significance gaps** — Infrastructure details or minor extensions

Most gaps are in the **infrastructure/operational layer** (server lifecycle, crash recovery, circuit breakers) and the **cognitive/scoring subsystems** (FSRS scheduling, working memory, type taxonomy) — areas the catalog describes at a high level but whose implementation depth far exceeds the documentation.

---

codex
I’ve loaded the gap definitions. I’m now reading each target implementation file with line numbers so I can confirm whether each gap is real, false positive, or already implemented in a different form.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Index Discovery Helpers
     3	// ---------------------------------------------------------------
     4	
     5	/* ------- 1. DEPENDENCIES ------- */
     6	
     7	import fs from 'fs';
     8	import path from 'path';
     9	
    10	import { toErrorMessage } from '../utils';
    11	import { getCanonicalPathKey } from '../lib/utils/canonical-path';
    12	
    13	/* ------- 2. CONSTANTS ------- */
    14	
    15	/** Well-known spec folder document filenames. */
    16	const SPEC_DOCUMENT_FILENAMES = new Set([
    17	  'spec.md',
    18	  'plan.md',
    19	  'tasks.md',
    20	  'checklist.md',
 succeeded in 50ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Index Alias Conflict Helpers
     3	// ---------------------------------------------------------------
     4	
     5	/* ------- 1. DEPENDENCIES ------- */
     6	
     7	import { requireDb, toErrorMessage } from '../utils';
     8	import * as mutationLedger from '../lib/storage/mutation-ledger';
     9	
    10	/* ------- 2. TYPES ------- */
    11	
    12	const DOT_OPENCODE_SPECS_SEGMENT = '/.opencode/specs/';
    13	const SPECS_SEGMENT = '/specs/';
    14	const MAX_ALIAS_CONFLICT_SAMPLES = 5;
    15	const DIVERGENCE_RECONCILE_ACTOR = 'memory-index-scan';
    16	
    17	interface AliasConflictRow {
    18	  file_path: string;
    19	  content_hash: string | null;
    20	}
 succeeded in 50ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Index
     3	// ---------------------------------------------------------------
     4	
     5	import path from 'path';
     6	
     7	/* ---------------------------------------------------------------
     8	   1. CORE AND UTILS IMPORTS
     9	--------------------------------------------------------------- */
    10	
    11	import { getLastScanTime, setLastScanTime, checkDatabaseUpdated } from '../core';
    12	import { INDEX_SCAN_COOLDOWN, DEFAULT_BASE_PATH, BATCH_SIZE } from '../core/config';
    13	import { processBatches, requireDb, toErrorMessage, type RetryErrorResult } from '../utils';
    14	import { getCanonicalPathKey } from '../lib/utils/canonical-path';
    15	
    16	/* ---------------------------------------------------------------
    17	   2. LIB MODULE IMPORTS
    18	--------------------------------------------------------------- */
    19	
    20	import * as memoryParser from '../lib/parsing/memory-parser';
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts | sed -n '320,760p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Causal Links Processor
     3	// ---------------------------------------------------------------
     4	
     5	import type BetterSqlite3 from 'better-sqlite3';
     6	
     7	import type { CausalLinks } from '../lib/parsing/memory-parser';
     8	import * as causalEdges from '../lib/storage/causal-edges';
     9	import { toErrorMessage } from '../utils';
    10	import { escapeLikePattern } from './handler-utils';
    11	
    12	interface CausalLinkMapping {
    13	  relation: typeof causalEdges.RELATION_TYPES[keyof typeof causalEdges.RELATION_TYPES];
    14	  reverse: boolean;
    15	}
    16	
    17	interface CausalLinksResult {
    18	  processed: number;
    19	  inserted: number;
    20	  resolved: number;
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Vector Index Mutations
     3	// ---------------------------------------------------------------
     4	// Split from vector-index-store.ts — contains ALL mutation functions:
     5	// index, update, delete, and status/confidence updates.
     6	
     7	import { getCanonicalPathKey } from '../utils/canonical-path';
     8	import { createLogger } from '../utils/logger';
     9	import * as embeddingsProvider from '../providers/embeddings';
    10	import {
    11	  to_embedding_buffer,
    12	  get_error_message,
    13	} from './vector-index-types';
    14	import {
    15	  initialize_db,
    16	  get_embedding_dim,
    17	  init_prepared_statements,
    18	  clear_constitutional_cache,
    19	  refresh_interference_scores_for_folder,
    20	  sqlite_vec_available as get_sqlite_vec_available,
 succeeded in 51ms:
   320	    results.skipped_hash = 0;
   321	    results.incremental.fast_path_skips = categorized.toSkip.length;
   322	    results.incremental.hash_checks = categorized.toUpdate.length;
   323	
   324	    for (const unchangedPath of categorized.toSkip) {
   325	      if (constitutionalSet.has(getCachedKey(unchangedPath))) {
   326	        results.constitutional.alreadyIndexed++;
   327	      }
   328	    }
   329	
   330	    const categorizeTime = Date.now() - startCategorize;
   331	    console.error(`[memory-index-scan] Incremental mode: ${filesToIndex.length}/${files.length} files need indexing (categorized in ${categorizeTime}ms)`);
   332	    console.error(`[memory-index-scan] Fast-path skips: ${results.incremental.fast_path_skips}, Hash checks: ${results.incremental.hash_checks}`);
   333	  }
   334	
   335	  if (filesToDelete.length > 0) {
   336	    const staleDeleteResult = deleteStaleIndexedRecords(filesToDelete);
   337	    results.staleDeleted = staleDeleteResult.deleted;
   338	    results.staleDeleteFailed = staleDeleteResult.failed;
   339	  }
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts | sed -n '360,760p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   360	      } catch (e: unknown) {
   361	        console.warn(`[vector-index] Vector deletion failed for memory ${id}: ${get_error_message(e)}`);
   362	      }
   363	    }
   364	
   365	    // AI-WHY: Fix #20 (017-refinement-phase-6) — Clean all ancillary records
   366	    const ancillaryTables = [
   367	      'DELETE FROM degree_snapshots WHERE memory_id = ?',
   368	      'DELETE FROM community_assignments WHERE memory_id = ?',
   369	      'DELETE FROM memory_summaries WHERE memory_id = ?',
   370	      'DELETE FROM memory_entities WHERE memory_id = ?',
   371	    ];
   372	    for (const sql of ancillaryTables) {
   373	      try { database.prepare(sql).run(id); } catch (_error: unknown) { /* table may not exist */ }
   374	    }
   375	    try {
   376	      database.prepare('DELETE FROM causal_edges WHERE source_id = ? OR target_id = ?').run(id, id);
   377	    } catch (_error: unknown) { /* table may not exist */ }
   378	
   379	    const result = database.prepare('DELETE FROM memory_index WHERE id = ?').run(id);
exec
/bin/zsh -lc "rg -n \"processCausalLinks|causalLinks|caused_by|supersedes|derived_from|blocks|related_to|detectSpecLevel\\(|findSpecDocuments\\(|index_memory_deferred|indexMemoryDeferred\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
Total output lines: 321

.opencode/skill/system-spec-kit/mcp_server/README.md:330:| `supersedes`   | A replaces B as the current truth             |
.opencode/skill/system-spec-kit/mcp_server/README.md:332:| `derived_from` | A was built upon or derived from B            |
.opencode/skill/system-spec-kit/mcp_server/README.md:897:// Returns causal chain: causedBy, enabledBy, supersedes
.opencode/skill/system-spec-kit/mcp_server/README.md:903:// Document that decision A supersedes decision B
.opencode/skill/system-spec-kit/mcp_server/README.md:907:  relation: 'supersedes',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:126: * Extracted from duplicate blocks in handleTaskPreflight and handleTaskPostflight.
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:44:  by_supersedes: FlatEdge[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:46:  by_derived_from: FlatEdge[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:95:    by_supersedes: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:97:    by_derived_from: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:139:      case 'supersedes': return result.by_supersedes;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:141:      case 'derived_from': return result.by_derived_from;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:162:    by_supersedes: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:164:    by_derived_from: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:179:      case 'supersedes': merged.by_supersedes.push(edge); break;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:181:      case 'derived_from': merged.by_derived_from.push(edge); break;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:226:    by_supersedes: allowed.has('supersedes') ? chain.by_supersedes : [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:228:    by_derived_from: allowed.has('derived_from') ? chain.by_derived_from : [],
codex
I confirmed call sites exist beyond the core files, so I’m checking those integration points now (post-insert enrichment and deferred-index call paths) to ensure each gap is truly implemented end-to-end, not just declared.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts | sed -n '130,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Post Insert
     3	// ---------------------------------------------------------------
     4	
     5	import type BetterSqlite3 from 'better-sqlite3';
     6	import type * as memoryParser from '../../lib/parsing/memory-parser';
     7	
     8	import * as embeddings from '../../lib/providers/embeddings';
     9	import { processCausalLinks } from '../causal-links-processor';
    10	import {
    11	  isAutoEntitiesEnabled,
    12	  isMemorySummariesEnabled,
    13	  isEntityLinkingEnabled,
    14	} from '../../lib/search/search-flags';
    15	import { extractEntities, filterEntities, storeEntities, updateEntityCatalog } from '../../lib/extraction/entity-extractor';
    16	import { generateAndStoreSummary } from '../../lib/search/memory-summaries';
    17	import { runEntityLinking } from '../../lib/search/entity-linker';
    18	import { toErrorMessage } from '../../utils';
    19	
    20	interface CausalLinksResult {
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Create Record
     3	// ---------------------------------------------------------------
     4	
     5	import path from 'path';
     6	import type BetterSqlite3 from 'better-sqlite3';
     7	
     8	import * as vectorIndex from '../../lib/search/vector-index';
     9	import * as bm25Index from '../../lib/search/bm25-index';
    10	import * as predictionErrorGate from '../../lib/cache/cognitive/prediction-error-gate';
    11	import * as fsrsScheduler from '../../lib/cache/cognitive/fsrs-scheduler';
    12	import * as incrementalIndex from '../../lib/storage/incremental-index';
    13	import type * as memoryParser from '../../lib/parsing/memory-parser';
    14	import { toErrorMessage } from '../../utils';
    15	
    16	import { calculateDocumentWeight, isSpecDocumentType } from '../pe-gating';
    17	import { detectSpecLevelFromParsed } from '../handler-utils';
    18	import { classifyEncodingIntent } from '../../lib/search/encoding-intent';
    19	import { isEncodingIntentEnabled } from '../../lib/search/search-flags';
    20	import { applyPostInsertMetadata } from './db-helpers';
 succeeded in 52ms:
   130	  const thinningResult = thinChunks(chunkResult.chunks);
   131	  const retainedChunks = thinningResult.retained;
   132	  if (retainedChunks.length === 0) {
   133	    console.warn(`[memory-save] No chunks retained after thinning for ${filePath}`);
   134	    return { status: 'warning', id: 0, specFolder: parsed.specFolder ?? '',
   135	             title: parsed.title ?? '', message: 'Zero chunks retained after thinning' };
   136	  }
   137	  const droppedChunkCount = thinningResult.dropped.length;
   138	  const parentEncodingIntent = isEncodingIntentEnabled()
   139	    ? classifyEncodingIntent(parsed.content)
   140	    : undefined;
   141	  console.error(`[memory-save] Chunking ${filePath}: ${chunkResult.strategy} strategy, ${chunkResult.chunks.length} chunks`);
   142	  if (droppedChunkCount > 0) {
   143	    console.error(`[memory-save] Chunk thinning retained ${retainedChunks.length}/${chunkResult.chunks.length} chunks`);
   144	  }
   145	
   146	  // AI-GUARD: Wrap parent setup in transaction to prevent check-then-delete race condition
   147	  const setupParent = database.transaction(() => {
   148	    const existing = database.prepare(`
   149	      SELECT id FROM memory_index
exec
/bin/zsh -lc "rg -n \"detectSpecLevelFromParsed|detectSpecLevel\\(\" .opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
15:// - detectSpecLevelFromParsed: extracted from causal-links-processor.ts
33:export function detectSpecLevelFromParsed(filePath: string): number | null {
     1	// ---------------------------------------------------------------
     2	// MODULE: Handler Utils
     3	// ---------------------------------------------------------------
     4	// Shared utilities extracted from handler modules to break dependency cycles.
     5	//
     6	// GROWTH POLICY (T033):
     7	// - ONLY add functions extracted from handler modules to break circular deps
     8	// - Each function MUST document its origin handler in a JSDoc comment
     9	// - Max 5 functions — if exceeded, split into domain-specific modules
    10	//   (e.g., handler-sql-utils.ts, handler-spec-utils.ts)
    11	// - Do NOT add general-purpose utilities here — use shared/ instead
    12	//
    13	// Current contents:
    14	// - escapeLikePattern: extracted from memory-save.ts
    15	// - detectSpecLevelFromParsed: extracted from causal-links-processor.ts
    16	// ---------------------------------------------------------------
    17	
    18	import fs from 'fs';
exec
/bin/zsh -lc 'rg -n "causalLinks|caused_by|supersedes|derived_from|blocks|related_to|hasCausalLinks" .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
25:  caused_by: string[];
26:  supersedes: string[];
27:  derived_from: string[];
28:  blocks: string[];
29:  related_to: string[];
54:  causalLinks: CausalLinks;
55:  hasCausalLinks: boolean;
191:  const causalLinks = extractCausalLinks(content);
209:    causalLinks: causalLinks,
210:    hasCausalLinks: hasCausalLinks(causalLinks),
576:  const causalLinks: CausalLinks = {
577:    caused_by: [],
578:    supersedes: [],
579:    derived_from: [],
580:    blocks: [],
581:    related_to: []
585:  const causalBlockMatch = content.match(/(?:^|\n)\s*causalLinks:\s*\n((?:\s+[a-z_]+:[\s\S]*?)*)(?=\n[a-z_]+:|\n```|\n---|\n\n|\n#|$)/i);
588:    return causalLinks;
597:    // Check for sub-key (e.g., "  caused_by:")
598:    const keyMatch = line.match(/^\s{2,}(caused_by|supersedes|derived_from|blocks|related_to):\s*$/);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts | sed -n '150,250p' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts | sed -n '540,700p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   150	    for (let i = 0; i < contentBuffer.length - 1; i += 2) {
   151	      const temp = contentBuffer[i];
   152	      contentBuffer[i] = contentBuffer[i + 1];
   153	      contentBuffer[i + 1] = temp;
   154	    }
   155	    return contentBuffer.toString('utf16le');
   156	  }
   157	
   158	  // No BOM detected, assume UTF-8
   159	  return buffer.toString('utf-8');
   160	}
   161	
   162	/** Parse a memory file and extract all metadata */
   163	export function parseMemoryFile(filePath: string): ParsedMemory {
   164	  if (!fs.existsSync(filePath)) {
   165	    throw new Error(`Memory file not found: ${filePath}`);
   166	  }
   167	
   168	  const content = readFileWithEncoding(filePath);
   169	  // Spec 126: Infer document type from file path
exec
/bin/zsh -lc "rg -n \"createSpecDocumentChain|SPEC_DOCUMENT_CHAIN|spec document chain|create spec document\" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '1,260p' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '260,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
556:function createSpecDocumentChain(documentIds: Record<string, number>): { inserted: number; failed: number } {
760:  createSpecDocumentChain,
     1	// ---------------------------------------------------------------
     2	// MODULE: Causal Edges
     3	// ---------------------------------------------------------------
     4	// Causal relationship graph for memory lineage
     5	// ---------------------------------------------------------------
     6	
     7	import type Database from 'better-sqlite3';
     8	import { clearDegreeCache } from '../search/graph-search-fn';
     9	
    10	/* -------------------------------------------------------------
    11	   1. CONSTANTS
    12	----------------------------------------------------------------*/
    13	
    14	const RELATION_TYPES = Object.freeze({
    15	  CAUSED: 'caused',
    16	  ENABLED: 'enabled',
    17	  SUPERSEDES: 'supersedes',
    18	  CONTRADICTS: 'contradicts',
exec
/bin/zsh -lc 'rg -n "''^##'"\\s+[0-9]{2}-|"'^###'"\\s+[0-9]{2}-|Category\" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:202:**How it works**: Gap investigation agents suggest a category for each new feature. The synthesis phase validates the suggestion against existing categories and assigns the closest match. Category restructuring tracked as a separate future task.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:214:**Why this one**: Category restructuring is a significant change that would triple the scope of this audit. The current 20 categories can house new features, even if imperfect.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/spec.md:96:| REQ-007 | Analysis summary with aggregate statistics | Category-level pass/fail counts |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/checklist.md:83:| Category | Total | Verified |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/verification-C07.md:452:export type QueryCategory =
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X02.md:206:/bin/zsh -lc "rg -n \"category|Category|20\" /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X02.md:240:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:202:**How it works**: Gap investigation agents suggest a category for each new feature. The synthesis phase validates the suggestion against existing categories and assigns the closest match. Category restructuring tracked as a separate future task.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X02.md:242:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:214:**Why this one**: Category restructuring is a significant change that would triple the scope of this audit. The current 20 categories can house new features, even if imperfect.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X04.md:137:/bin/zsh -lc 'rg -n "Gap 14|Gap 15|Gap 16|Gap 17|''^#|''^##|Category|SUGGESTED_CATEGORY|existing categories" '"'.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/undocumented-features-scan.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X04.md:178:/bin/zsh -lc 'rg -n "''^##|''^#|''^'"\\d{2}-|Category|categories|feature catalog\" '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/verification-C14.md:315:/bin/zsh -lc "rg -n \"SignalCategory|correction|preference|neutral|prefer|actually|I was wrong|detect|signal|signal categories|vocab|vocabulary|true-mem|category\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/signal-vocab.vitest.ts' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/verification-C14.md:339:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:10:export type SignalCategory = 'correction' | 'preference' | 'neutral';
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/verification-C14.md:341:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:14:  category: SignalCategory;
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/verification-C14.md:350:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:341:const SIGNAL_BOOSTS: Record<Exclude<SignalCategory, 'neutral'>, number> = {
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X10.md:299:/bin/zsh -lc 'rg -n "''^## |''^### |Category|'"\\|\\s*[0-9]{2}\\s*\\|\" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X10.md:385:.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X09.md:102:/bin/zsh -lc 'rg -n "''^#|''^##|category|Category|''^[0-9]{2}-|''^'"\\|\\s*[0-9]{2}\\s*\\|\" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X05.md:292:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:202:**How it works**: Gap investigation agents suggest a category for each new feature. The synthesis phase validates the suggestion against existing categories and assigns the closest match. Category restructuring tracked as a separate future task.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X09.md:102:/bin/zsh -lc 'rg -n "''^#|''^##|category|Category|''^[0-9]{2}-|''^'"\\|\\s*[0-9]{2}\\s*\\|\" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X01.md:229:/bin/zsh -lc 'rg -n "20 existing categories|existing categories|Feature Catalog|categories|''^## .*Category|''^[0-9]{2}-" '"'/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 56ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X01.md:237:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:202:**How it works**: Gap investigation agents suggest a category for each new feature. The synthesis phase validates the suggestion against existing categories and assigns the closest match. Category restructuring tracked as a separate future task.
exec
/bin/zsh -lc 'rg -n "C0[1-9]|C1[0-9]|C20|Category C|''^## C|Feature Catalog" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog -g '"'*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
Total output lines: 266

.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:1:# Decision Record: Feature Catalog Audit & Remediation
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/spec.md:2:title: "Feature Catalog Comprehensive Audit & Remediation"
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/spec.md:8:# Feature Catalog Comprehensive Audit & Remediation
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/spec.md:127:- **NFR-C01**: All 20 categories verified by at least one agent
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/spec.md:128:- **NFR-C02**: All 55 known gaps addressed (no gap left uninvestigated)
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/plan.md:2:title: "Implementation Plan: Feature Catalog Audit & Remediation"
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/plan.md:11:# Implementation Plan: Feature Catalog Audit & Remediation
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/plan.md:163:│   (done)     │     │  │ Stream 1: C01-C20      │  │     │              │     │              │
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/plan.md:193:- Stream 1 (C01-C20) and Stream 2 (X01-X10) run simultaneously
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/plan.md:212:### Stream 1: Verification Agents (C01-C20)
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/plan.md:216:| C01 | 01-retrieval | 9 |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/plan.md:217:| C02 | 02-mutation | 8 |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/plan.md:218:| C03 | 03-discovery + 04-maintenance + 05-lifecycle | 8 |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/plan.md:219:| C04 | 06-analysis + 07-evaluation | 9 |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/plan.md:220:| C05 | 08-bug-fixes (1-6) | 6 |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/plan.md:221:| C06 | 08-bug-fixes (7-12) | 6 |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/plan.md:222:| C07 | 09-eval-measurement (1-8) | 8 |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/plan.md:223:| C08 | 09-eval-measurement (9-15) | 7 |
exec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/feature_catalog -maxdepth 1 -mindepth 1 -type d | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/feature_catalog/.github
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval
.opencode/skill/system-spec-kit/feature_catalog/02--mutation
.opencode/skill/system-spec-kit/feature_catalog/03--discovery
.opencode/skill/system-spec-kit/feature_catalog/04--maintenance
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle
.opencode/skill/system-spec-kit/feature_catalog/06--analysis
.opencode/skill/system-spec-kit/feature_catalog/07--evaluation
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts
.opencode/skill/system-spec-kit/feature_catalog/17--governance
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals
exec
/bin/zsh -lc "rg -n \"SPECKIT_INDEX_SPEC_DOCS|includeSpecDocs|specFolder filter|session|title LIKE|sqlite_vec|embedding_status = 'pending'|failure_reason|reference resolution|causalLinksResult\" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/undocumented-features-scan.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
28:| 2 | **Cross-Process DB Hot Rebinding** | `core/db-state.ts` | Shared marker file detects external mutations → reopens DB → rebinds hybrid search, checkpoints, session manager, etc. |
117:| 45 | Session attention boost | `search/session-boost.ts` | Working memory attention → bounded multiplicative result boost |
135:**Already documented (14 false positives from Agent 2):** Mode-based orchestration, token-pressure override, spec folder auto-discovery, resume-mode injection, multi-concept search, quality threshold filter, session dedup, archived retrieval, trace emission — all described in the memory_context and memory_search catalog entries.
137:**Cross-agent duplicates (12 merged):** PE arbitration (Agents 3+7), PE conflict journal (Agents 3+7), spec-document causal chaining (Agents 4+9), mutation ledger (Agents 4+9), schema downgrade (Agents 1+9), evidence-gap detection (Agents 5+6), multi-concept search (Agents 1+2+5), session dedup (Agents 1+2+10), circuit breaker patterns (Agents 5+10), pressure monitoring (Agents 2+7).
codex
I’ve confirmed all four target gaps are implemented in code and mapped exact call paths with line-level evidence. I’m now formatting the final report in your requested block structure, including additional capabilities from these files that are not in the current gap list.
codex
---
GAP_NUMBER: 10  
FEATURE_NAME: Spec Document Discovery + Spec Level Inference  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: handlers/memory-index-discovery.ts:16-25,46-114,121-160; handlers/handler-utils.ts:33-67; handlers/memory-index.ts:183; handlers/save/create-record.ts:42-45,64-65,77-79  
DRAFT_DESCRIPTION: The server actively discovers spec documents by scanning both `.opencode/specs` and `specs`, matching 8 canonical spec doc filenames, and deduping by canonical path. Discovery supports optional `specFolder` filtering and excludes `scratch/`, `memory/`, `node_modules/`, and hidden directories. Spec level inference is implemented via `SPECKIT_LEVEL` marker parsing with sibling-file heuristics as fallback (`decision-record.md` => level 3, `checklist.md` => level 2, else level 1). Inferred level is persisted on saved indexed records.  
SUGGESTED_CATEGORY: 03--discovery  
SIGNIFICANCE: HIGH  
NOTES: There are two similar level-inference implementations (`detectSpecLevel` and `detectSpecLevelFromParsed`), both currently active in different paths.  
---

---
GAP_NUMBER: 11  
FEATURE_NAME: Auto Spec-Document Causal Chains  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: handlers/memory-index.ts:418-486,450-456,461-475; lib/storage/causal-edges.ts:549-594  
DRAFT_DESCRIPTION: After `memory_index_scan`, the server detects spec folders with changed non-memory documents and auto-builds causal edges for those folders. It queries latest IDs per spec doc type, then creates a chain (`spec -> plan -> tasks -> implementation_summary`) plus support edges (`checklist -> spec`, `decision_record -> plan`, `research -> spec`). This is executed automatically when `includeSpecDocs` is enabled and at least two doc types exist. Failures are logged and do not abort the scan.  
SUGGESTED_CATEGORY: 10--graph-signal-activation  
SIGNIFICANCE: HIGH  
NOTES: Chain creation is change-triggered (affected folders in current scan), not a full rebuild of every folder each run.  
---

---
GAP_NUMBER: 12  
FEATURE_NAME: Declarative Causal Link Ingestion  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: lib/parsing/memory-parser.ts:190-191,573-639,644-647; handlers/save/post-insert.ts:50-65; handlers/causal-links-processor.ts:29-35,37-92,95-164  
DRAFT_DESCRIPTION: Memory parsing extracts declarative causal links from a `causalLinks:` block with `caused_by`, `supersedes`, `derived_from`, `blocks`, and `related_to`. Post-insert enrichment automatically processes those links and inserts causal edges. Reference resolution is robust (numeric ID, session/path pattern, exact title, partial title), and unresolved references are reported instead of hard-failing saves. Duplicate edge insertions are handled idempotently via uniqueness handling.  
SUGGESTED_CATEGORY: 02--mutation  
SIGNIFICANCE: HIGH  
NOTES: Implementation expects the links inside a `causalLinks` block rather than top-level standalone frontmatter keys.  
---

---
GAP_NUMBER: 13  
FEATURE_NAME: Deferred Lexical-Only Indexing  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: lib/search/vector-index-mutations.ts:158-229; handlers/save/create-record.ts:38-40,54-82,116-126; handlers/chunking-orchestrator.ts:171-190,285-296,315-323  
DRAFT_DESCRIPTION: When embeddings are unavailable, records are inserted through `indexMemoryDeferred` with `embedding_status='pending'`, retry metadata, and no vector write. Save/chunking flows still index lexical content (BM25 path), so entries are retrievable before vector embeddings complete. Existing rows can also be updated back into deferred-pending state with failure reason. This is implemented in both normal save and chunked save paths.  
SUGGESTED_CATEGORY: 13--memory-quality-and-indexing  
SIGNIFICANCE: HIGH  
NOTES: Deferred behavior is explicit and first-class, not just error logging around embedding failures.  
---

---
GAP_NUMBER: NEW-1  
FEATURE_NAME: Spec-Doc Indexing Kill Switch + Per-Scan Toggle  
STATUS: NEW_GAP  
SOURCE_FILES: handlers/memory-index-discovery.ts:47-50; handlers/memory-index.ts:143-145,183  
DRAFT_DESCRIPTION: Spec-document indexing can be disabled globally via `SPECKIT_INDEX_SPEC_DOCS=false` and also controlled per scan via `includeSpecDocs`. This creates two independent control planes (runtime env + tool argument) for spec-doc ingestion. I did not find this control behavior called out in the current 55-gap list.  
SUGGESTED_CATEGORY: 20--feature-flag-reference  
SIGNIFICANCE: MEDIUM  
NOTES: This affects operational behavior and troubleshooting when spec docs appear “missing” from index results.  
---

---
GAP_NUMBER: NEW-2  
FEATURE_NAME: Multi-Strategy Causal Reference Resolution Cascade  
STATUS: NEW_GAP  
SOURCE_FILES: handlers/causal-links-processor.ts:37-92  
DRAFT_DESCRIPTION: Causal link references are resolved through a staged strategy: numeric ID, session/date/path `LIKE` lookup, exact title, then partial title. This goes beyond simple ID-only ingestion and materially improves declarative link usability. The gap list mentions declarative ingestion, but not this resolution cascade depth.  
SUGGESTED_CATEGORY: 12--query-intelligence  
SIGNIFICANCE: MEDIUM  
NOTES: The relaxed resolution path also introduces ambiguity risk when partial title matches collide.  
---

---
GAP_NUMBER: NEW-3  
FEATURE_NAME: sqlite-vec Capability Fallback in “Normal” Index Path  
STATUS: NEW_GAP  
SOURCE_FILES: lib/search/vector-index-mutations.ts:121-126,142-148  
DRAFT_DESCRIPTION: Even when an embedding vector is provided, the normal `index_memory` path conditionally marks `embedding_status` as `pending` if `sqlite_vec` is unavailable. Metadata insert proceeds, while vector-table write is skipped, preserving record availability. This is a distinct runtime-capability fallback separate from explicit deferred indexing calls.  
SUGGESTED_CATEGORY: 14--pipeline-architecture  
SIGNIFICANCE: MEDIUM  
NOTES: This behavior can mask infrastructure problems unless operators monitor pending embedding backlog.  
---
tokens used
93,435
---
GAP_NUMBER: 10  
FEATURE_NAME: Spec Document Discovery + Spec Level Inference  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: handlers/memory-index-discovery.ts:16-25,46-114,121-160; handlers/handler-utils.ts:33-67; handlers/memory-index.ts:183; handlers/save/create-record.ts:42-45,64-65,77-79  
DRAFT_DESCRIPTION: The server actively discovers spec documents by scanning both `.opencode/specs` and `specs`, matching 8 canonical spec doc filenames, and deduping by canonical path. Discovery supports optional `specFolder` filtering and excludes `scratch/`, `memory/`, `node_modules/`, and hidden directories. Spec level inference is implemented via `SPECKIT_LEVEL` marker parsing with sibling-file heuristics as fallback (`decision-record.md` => level 3, `checklist.md` => level 2, else level 1). Inferred level is persisted on saved indexed records.  
SUGGESTED_CATEGORY: 03--discovery  
SIGNIFICANCE: HIGH  
NOTES: There are two similar level-inference implementations (`detectSpecLevel` and `detectSpecLevelFromParsed`), both currently active in different paths.  
---

---
GAP_NUMBER: 11  
FEATURE_NAME: Auto Spec-Document Causal Chains  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: handlers/memory-index.ts:418-486,450-456,461-475; lib/storage/causal-edges.ts:549-594  
DRAFT_DESCRIPTION: After `memory_index_scan`, the server detects spec folders with changed non-memory documents and auto-builds causal edges for those folders. It queries latest IDs per spec doc type, then creates a chain (`spec -> plan -> tasks -> implementation_summary`) plus support edges (`checklist -> spec`, `decision_record -> plan`, `research -> spec`). This is executed automatically when `includeSpecDocs` is enabled and at least two doc types exist. Failures are logged and do not abort the scan.  
SUGGESTED_CATEGORY: 10--graph-signal-activation  
SIGNIFICANCE: HIGH  
NOTES: Chain creation is change-triggered (affected folders in current scan), not a full rebuild of every folder each run.  
---

---
GAP_NUMBER: 12  
FEATURE_NAME: Declarative Causal Link Ingestion  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: lib/parsing/memory-parser.ts:190-191,573-639,644-647; handlers/save/post-insert.ts:50-65; handlers/causal-links-processor.ts:29-35,37-92,95-164  
DRAFT_DESCRIPTION: Memory parsing extracts declarative causal links from a `causalLinks:` block with `caused_by`, `supersedes`, `derived_from`, `blocks`, and `related_to`. Post-insert enrichment automatically processes those links and inserts causal edges. Reference resolution is robust (numeric ID, session/path pattern, exact title, partial title), and unresolved references are reported instead of hard-failing saves. Duplicate edge insertions are handled idempotently via uniqueness handling.  
SUGGESTED_CATEGORY: 02--mutation  
SIGNIFICANCE: HIGH  
NOTES: Implementation expects the links inside a `causalLinks` block rather than top-level standalone frontmatter keys.  
---

---
GAP_NUMBER: 13  
FEATURE_NAME: Deferred Lexical-Only Indexing  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: lib/search/vector-index-mutations.ts:158-229; handlers/save/create-record.ts:38-40,54-82,116-126; handlers/chunking-orchestrator.ts:171-190,285-296,315-323  
DRAFT_DESCRIPTION: When embeddings are unavailable, records are inserted through `indexMemoryDeferred` with `embedding_status='pending'`, retry metadata, and no vector write. Save/chunking flows still index lexical content (BM25 path), so entries are retrievable before vector embeddings complete. Existing rows can also be updated back into deferred-pending state with failure reason. This is implemented in both normal save and chunked save paths.  
SUGGESTED_CATEGORY: 13--memory-quality-and-indexing  
SIGNIFICANCE: HIGH  
NOTES: Deferred behavior is explicit and first-class, not just error logging around embedding failures.  
---

---
GAP_NUMBER: NEW-1  
FEATURE_NAME: Spec-Doc Indexing Kill Switch + Per-Scan Toggle  
STATUS: NEW_GAP  
SOURCE_FILES: handlers/memory-index-discovery.ts:47-50; handlers/memory-index.ts:143-145,183  
DRAFT_DESCRIPTION: Spec-document indexing can be disabled globally via `SPECKIT_INDEX_SPEC_DOCS=false` and also controlled per scan via `includeSpecDocs`. This creates two independent control planes (runtime env + tool argument) for spec-doc ingestion. I did not find this control behavior called out in the current 55-gap list.  
SUGGESTED_CATEGORY: 20--feature-flag-reference  
SIGNIFICANCE: MEDIUM  
NOTES: This affects operational behavior and troubleshooting when spec docs appear “missing” from index results.  
---

---
GAP_NUMBER: NEW-2  
FEATURE_NAME: Multi-Strategy Causal Reference Resolution Cascade  
STATUS: NEW_GAP  
SOURCE_FILES: handlers/causal-links-processor.ts:37-92  
DRAFT_DESCRIPTION: Causal link references are resolved through a staged strategy: numeric ID, session/date/path `LIKE` lookup, exact title, then partial title. This goes beyond simple ID-only ingestion and materially improves declarative link usability. The gap list mentions declarative ingestion, but not this resolution cascade depth.  
SUGGESTED_CATEGORY: 12--query-intelligence  
SIGNIFICANCE: MEDIUM  
NOTES: The relaxed resolution path also introduces ambiguity risk when partial title matches collide.  
---

---
GAP_NUMBER: NEW-3  
FEATURE_NAME: sqlite-vec Capability Fallback in “Normal” Index Path  
STATUS: NEW_GAP  
SOURCE_FILES: lib/search/vector-index-mutations.ts:121-126,142-148  
DRAFT_DESCRIPTION: Even when an embedding vector is provided, the normal `index_memory` path conditionally marks `embedding_status` as `pending` if `sqlite_vec` is unavailable. Metadata insert proceeds, while vector-table write is skipped, preserving record availability. This is a distinct runtime-capability fallback separate from explicit deferred indexing calls.  
SUGGESTED_CATEGORY: 14--pipeline-architecture  
SIGNIFICANCE: MEDIUM  
NOTES: This behavior can mask infrastructure problems unless operators monitor pending embedding backlog.  
---
