OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce99-6215-78a0-b1d5-892187285a03
--------
user
You are investigating undocumented features in an MCP server. Search for and read handler files under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/: memory-crud-health.ts, memory-crud-types.ts, memory-index-alias.ts, memory-bulk-delete.ts. Also check for save/embedding-pipeline.ts under lib/. Verify gaps 49-55: Gap 49 (Divergent alias diagnostics mode), Gap 50 (Mutation ledger audit trail), Gap 51 (Health auto-repair actions), Gap 52 (Alias divergence auto-reconcile), Gap 53 (Embedding input normalization), Gap 54 (Safety-tiered retention bulk delete), Gap 55 (Startup runtime compatibility guards). 

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
mcp: code_mode starting
mcp: spec_kit_memory starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m going to inspect the requested MCP handler and lib files directly, then map each gap (49–55) to concrete code evidence with line ranges and classify each as confirmed, false positive, or new gap. I’ll start by locating the files and the `undocumented-features-scan.md` context so the categories/status mapping stays consistent.
exec
/bin/zsh -lc "pwd && rg --files | rg 'undocumented-features-scan\\.md|memory-crud-health\\.ts|memory-crud-types\\.ts|memory-index-alias\\.ts|memory-bulk-delete\\.ts|embedding-pipeline\\.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'ls -la .opencode/skill/system-spec-kit/mcp_server/handlers && ls -la .opencode/skill/system-spec-kit/lib/save' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md
 exited 1 in 51ms:
total 792
drwxr-xr-x@ 33 michelkerkmeester  staff   1056 Mar  8 15:42 .
drwxr-xr-x@ 32 michelkerkmeester  staff   1024 Mar  8 17:53 ..
-rw-r--r--@  1 michelkerkmeester  staff   3114 Mar  1 12:31 README.md
-rw-r--r--@  1 michelkerkmeester  staff  24722 Mar  7 16:16 causal-graph.ts
-rw-r--r--@  1 michelkerkmeester  staff   5885 Mar  7 10:55 causal-links-processor.ts
-rw-r--r--@  1 michelkerkmeester  staff  14723 Mar  7 10:55 checkpoints.ts
-rw-r--r--@  1 michelkerkmeester  staff  18993 Mar  8 10:46 chunking-orchestrator.ts
-rw-r--r--@  1 michelkerkmeester  staff   5246 Mar  8 17:12 eval-reporting.ts
-rw-r--r--@  1 michelkerkmeester  staff   2575 Mar  8 17:12 handler-utils.ts
-rw-r--r--@  1 michelkerkmeester  staff   3920 Mar  8 17:12 index.ts
-rw-r--r--@  1 michelkerkmeester  staff   9732 Mar  8 17:12 memory-bulk-delete.ts
-rw-r--r--@  1 michelkerkmeester  staff  25759 Mar  7 10:55 memory-context.ts
-rw-r--r--@  1 michelkerkmeester  staff   9545 Mar  8 17:12 memory-crud-delete.ts
-rw-r--r--@  1 michelkerkmeester  staff  17049 Mar  8 17:12 memory-crud-health.ts
-rw-r--r--@  1 michelkerkmeester  staff   4502 Mar  8 17:12 memory-crud-list.ts
-rw-r--r--@  1 michelkerkmeester  staff  10063 Mar  8 17:12 memory-crud-stats.ts
-rw-r--r--@  1 michelkerkmeester  staff   2791 Mar  8 17:12 memory-crud-types.ts
-rw-r--r--@  1 michelkerkmeester  staff  10202 Mar  7 16:17 memory-crud-update.ts
-rw-r--r--@  1 michelkerkmeester  staff   2339 Mar  8 17:12 memory-crud-utils.ts
codex
I found all target handler files plus `undocumented-features-scan.md`. Next I’m reading that scan file and each target source with line numbers so we can verify each gap against actual implementation details.
exec
/bin/zsh -lc "nl -ba .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit | rg 'embedding-pipeline\\.ts"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
exec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit -type d -name lib -maxdepth 6' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts
 succeeded in 52ms:
.opencode/skill/system-spec-kit/node_modules/typescript/lib
.opencode/skill/system-spec-kit/node_modules/@huggingface/transformers/node_modules/onnxruntime-node/lib
.opencode/skill/system-spec-kit/node_modules/@huggingface/transformers/node_modules/onnxruntime-web/lib
.opencode/skill/system-spec-kit/node_modules/@huggingface/transformers/node_modules/sharp/lib
.opencode/skill/system-spec-kit/node_modules/onnxruntime-common/lib
.opencode/skill/system-spec-kit/shared/dist/lib
.opencode/skill/system-spec-kit/shared/lib
.opencode/skill/system-spec-kit/scripts/dist/lib
.opencode/skill/system-spec-kit/scripts/node_modules/tsx/node_modules/esbuild/lib
.opencode/skill/system-spec-kit/scripts/node_modules/better-sqlite3/lib
.opencode/skill/system-spec-kit/scripts/lib
.opencode/skill/system-spec-kit/mcp_server/dist/lib
.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/picomatch/lib
.opencode/skill/system-spec-kit/mcp_server/node_modules/better-sqlite3/lib
.opencode/skill/system-spec-kit/mcp_server/node_modules/eslint/node_modules/eslint-scope/lib
.opencode/skill/system-spec-kit/mcp_server/node_modules/eslint/node_modules/eslint-visitor-keys/lib
.opencode/skill/system-spec-kit/mcp_server/node_modules/eslint/node_modules/esutils/lib
.opencode/skill/system-spec-kit/mcp_server/node_modules/eslint/node_modules/optionator/lib
.opencode/skill/system-spec-kit/mcp_server/node_modules/eslint/node_modules/cross-spawn/lib
.opencode/skill/system-spec-kit/mcp_server/node_modules/eslint/node_modules/espree/lib
codex
I’ve confirmed the scan file and located `embedding-pipeline.ts` under `mcp_server/handlers/save/` (not `lib/save`). I’m now reading all five target files end-to-end with line numbers and then mapping each claimed gap to exact symbols/logic.
exec
/bin/zsh -lc 'wc -l .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     451 .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
     108 .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts
     306 .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts
     264 .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
      71 .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts
    1200 total
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Crud Health
     3	// ---------------------------------------------------------------
     4	
     5	/* ---------------------------------------------------------------
     6	   IMPORTS
     7	--------------------------------------------------------------- */
     8	
     9	import { randomUUID } from 'node:crypto';
    10	import { existsSync, readFileSync } from 'node:fs';
    11	import { resolve } from 'node:path';
    12	
    13	import { checkDatabaseUpdated } from '../core';
    14	import * as vectorIndex from '../lib/search/vector-index';
    15	import * as embeddings from '../lib/providers/embeddings';
    16	import * as triggerMatcher from '../lib/parsing/trigger-matcher';
    17	import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
    18	import { toErrorMessage } from '../utils';
    19	
    20	import { isEmbeddingModelReady } from '../core';
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Crud Types
     3	// ---------------------------------------------------------------
     4	
     5	/* ---------------------------------------------------------------
     6	   TYPES
     7	--------------------------------------------------------------- */
     8	
     9	/** Arguments for the memory_delete handler. */
    10	interface DeleteArgs {
    11	  id?: number | string;
    12	  specFolder?: string;
    13	  confirm?: boolean;
    14	}
    15	
    16	/** Arguments for the memory_update handler. */
    17	interface UpdateArgs {
    18	  id: number;
    19	  title?: string;
    20	  triggerPhrases?: string[];
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | sed -n '320,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   320	    actions: [] as string[],
   321	    warnings: [] as string[],
   322	    errors: [] as string[],
   323	  };
   324	
   325	  if (!profile) {
   326	    try {
   327	      // AI-WHY: Resolve the lazy profile so health reflects the active runtime provider
   328	      // rather than the legacy sync fallback defaults.
   329	      profile = await embeddings.getEmbeddingProfileAsync() as EmbeddingProfile | null;
   330	      providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
   331	    } catch (profileError: unknown) {
   332	      hints.push(`Embedding profile unavailable: ${sanitizeErrorForHint(toErrorMessage(profileError))}`);
   333	    }
   334	  }
   335	
   336	  const providerName = profile?.provider ?? providerMetadata.provider;
   337	  const providerModel = profile?.model ?? providerMetadata.model ?? embeddings.getModelName();
   338	  const providerDimension = profile?.dim ?? providerMetadata.dim ?? embeddings.getEmbeddingDimension();
   339	
 succeeded in 52ms:
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
     2	// MODULE: Memory Bulk Delete
     3	// ---------------------------------------------------------------
     4	// Tier-based bulk deletion of memories with safety gates.
     5	// Eliminates the need for direct DB scripts when cleaning up
     6	// deprecated/temporary memories at scale.
     7	// ---------------------------------------------------------------
     8	
     9	import { checkDatabaseUpdated } from '../core';
    10	import * as vectorIndex from '../lib/search/vector-index';
    11	import * as checkpoints from '../lib/storage/checkpoints';
    12	import * as mutationLedger from '../lib/storage/mutation-ledger';
    13	import * as causalEdges from '../lib/storage/causal-edges';
    14	import { createMCPSuccessResponse } from '../lib/response/envelope';
    15	import { toErrorMessage } from '../utils';
    16	
    17	import { appendMutationLedgerSafe } from './memory-crud-utils';
    18	import { runPostMutationHooks } from './mutation-hooks';
    19	import { buildMutationHookFeedback } from '../hooks/mutation-feedback';
    20	
codex
I’ve read three of the target handlers and confirmed concrete implementations for alias diagnostics, auto-repair logic, and safety-tiered bulk delete. Next I’ll read `embedding-pipeline.ts` and trace referenced implementations (`mutation-ledger`, startup checks) so each gap gets an evidence-backed status.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server | rg 'startup-checks\\.ts|mutation-ledger\\.ts|memory-index\\.ts|memory-crud-utils\\.ts|context-server\\.ts|startup'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"divergent_aliases|autoRepair|MutationLedgerInput|appendMutationLedgerSafe|recordDivergenceReconcileHook|reconcile|normalize|frontmatter|anchor|comment|startup-checks|ABI|SQLite version|compatib\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Embedding Pipeline
     3	// ---------------------------------------------------------------
     4	
     5	import path from 'path';
     6	import type Database from 'better-sqlite3';
     7	
     8	import * as embeddings from '../../lib/providers/embeddings';
     9	import { lookupEmbedding, storeEmbedding } from '../../lib/cache/embedding-cache';
    10	import { normalizeContentForEmbedding } from '../../lib/parsing/content-normalizer';
    11	import type { ParsedMemory } from '../../lib/parsing/memory-parser';
    12	import { toErrorMessage } from '../../utils';
    13	
    14	export interface EmbeddingResult {
    15	  embedding: Float32Array | null;
    16	  status: 'success' | 'pending';
    17	  failureReason: string | null;
    18	}
    19	
    20	export async function generateOrCacheEmbedding(
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts
 succeeded in 52ms:
Total output lines: 1845

.opencode/skill/system-spec-kit/mcp_server/context-server.ts:59:import { detectNodeVersionMismatch, checkSqliteVersion } from './startup-checks';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:830:    // Check SQLite version meets minimum requirement (3.35.0+)
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:67: * Check that SQLite version meets minimum requirement (3.35.0+)
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:77:        `[spec-kit] WARNING: SQLite version ${version} detected. ` +
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:81:      console.error(`[spec-kit] SQLite version: ${version} (meets 3.35.0+ requirement)`);
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:84:    console.warn(`[spec-kit] Could not determine SQLite version: ${(e as Error).message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:46:  reportMode?: 'full' | 'divergent_aliases';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:49:  autoRepair?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:72:interface MutationLedgerInput {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:106:  MutationLedgerInput,
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:31:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, limit: { type: 'number', description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Caller-supplied session identifier. If omitted, server generates an ephemeral UUID for this call only (not persisted across requests).' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:84:      anchors: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:87:        description: 'Specific anchor IDs to extract from content. If provided, returned content will be filtered to only these sections. Requires includeContent: true.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:172:  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 1500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:173:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:198:        enum: ['full', 'divergent_aliases'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:200:        description: 'Report mode. full returns system diagnostics; divergent_aliases returns compact divergent alias triage output.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:205:        description: 'Maximum divergent alias groups to return when reportMode=divergent_aliases (max 200).'
codex
I confirmed `startup-checks.ts` exists and that some of these behaviors are implemented outside the five requested files (notably mutation ledger and startup guards). I’m now reading those implementation files and the feature-catalog category list so I can assign each gap to one of the existing 20 categories accurately.
exec
/bin/zsh -lc 'ls -la .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/startup-checks.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "''^## |''^### |Category|'"\\|\\s*[0-9]{2}\\s*\\|\" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
total 136
drwxr-xr-x  12 michelkerkmeester  staff    384 Mar  8 18:49 .
drwxr-xr-x@ 29 michelkerkmeester  staff    928 Mar  8 18:30 ..
drwxr-xr-x@  5 michelkerkmeester  staff    160 Mar  8 18:44 .backup-20260308-184419
-rw-r--r--@  1 michelkerkmeester  staff   2921 Mar  8 18:48 checklist.md
-rw-r--r--@  1 michelkerkmeester  staff   8685 Mar  8 18:48 decision-record.md
-rw-r--r--@  1 michelkerkmeester  staff    497 Mar  8 18:49 description.json
drwxr-xr-x   3 michelkerkmeester  staff     96 Mar  8 10:10 memory
-rw-r--r--@  1 michelkerkmeester  staff   9277 Mar  8 18:46 plan.md
drwxr-xr-x@ 35 michelkerkmeester  staff   1120 Mar  8 18:58 scratch
-rw-r--r--@  1 michelkerkmeester  staff   8683 Mar  8 18:45 spec.md
-rw-r--r--@  1 michelkerkmeester  staff   4403 Mar  8 18:46 tasks.md
-rw-r--r--@  1 michelkerkmeester  staff  12378 Mar  7 18:37 undocumented-features-scan.md
 succeeded in 50ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Startup Checks
     3	// ---------------------------------------------------------------
     4	// Non-critical startup checks extracted from context-server.ts (T303).
     5	// ---------------------------------------------------------------
     6	
     7	import path from 'path';
     8	import fs from 'fs';
     9	
    10	/* ---------------------------------------------------------------
    11	   1. NODE VERSION MISMATCH DETECTION
    12	--------------------------------------------------------------- */
    13	
    14	interface NodeVersionMarker {
    15	  nodeVersion: string;
    16	  moduleVersion: string;
    17	  platform: string;
    18	  arch: string;
    19	  createdAt: string;
    20	}
 succeeded in 51ms:
Total output lines: 502

.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:9:## ADR-001: 30-Agent Partitioning Strategy
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:11:### Metadata
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:21:### Context
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:25:### Constraints
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:33:### Decision
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:41:### Alternatives Considered
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:53:### Consequences
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:71:### Five Checks Evaluation
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:85:### Implementation
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:95:## ADR-002: Gap Classification Methodology
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:97:### Metadata
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:107:### Context
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:111:### Constraints
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:119:### Decision
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:127:### Alternatives Considered
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:139:### Consequences
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:150:### Five Checks Evaluation
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:164:### Implementation
exec
/bin/zsh -lc "nl -ba .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/plan.md | sed -n '210,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "C0[1-9]|C1[0-9]|C20|01-|02-|03-|04-|05-|06-|07-|08-|09-|10-|11-|12-|13-|14-|15-|16-|17-|18-|19-|20-" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X0*.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog | rg 'verification-C[0-9]{2}\\.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   210	## L3: AGENT PARTITIONING
   211	
   212	### Stream 1: Verification Agents (C01-C20)
   213	
   214	| Agent | Categories | ~Files |
   215	|-------|-----------|--------|
   216	| C01 | 01-retrieval | 9 |
   217	| C02 | 02-mutation | 8 |
   218	| C03 | 03-discovery + 04-maintenance + 05-lifecycle | 8 |
   219	| C04 | 06-analysis + 07-evaluation | 9 |
   220	| C05 | 08-bug-fixes (1-6) | 6 |
   221	| C06 | 08-bug-fixes (7-12) | 6 |
   222	| C07 | 09-eval-measurement (1-8) | 8 |
   223	| C08 | 09-eval-measurement (9-15) | 7 |
   224	| C09 | 10-graph-signal (1-5) | 5 |
   225	| C10 | 10-graph-signal (6-9) + 11-scoring (1-4) | 8 |
   226	| C11 | 11-scoring (5-10) | 6 |
   227	| C12 | 11-scoring (11-19) | 9 |
   228	| C13 | 12-query-intelligence | 8 |
   229	| C14 | 13-memory-quality (1-9) | 9 |
 succeeded in 52ms:
Total output lines: 652

.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md:70:.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md:80:/bin/zsh -lc "nl -ba .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md:83:     3	> **Date:** 2026-03-07
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md:102:/bin/zsh -lc 'rg -n "''^#|''^##|category|Category|''^[0-9]{2}-|''^'"\\|\\s*[0-9]{2}\\s*\\|\" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md:105:.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:1:# Decision Record: Feature Catalog Audit & Remediation
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md:106:.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:9:## ADR-001: 30-Agent Partitioning Strategy
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md:107:.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:11:### Metadata
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md:108:.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:21:### Context
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md:109:.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:25:### Constraints
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md:110:.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:33:### Decision
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md:111:.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:35:**We chose**: Two-stream partitioning with 20 Copilot agents for category-contiguous verification and 10 Codex agents for architecture-zone gap investigation.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md:112:.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:41:### Alternatives Considered
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md:113:.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:53:### Consequences
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md:114:.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:71:### Five Checks Evaluation
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md:115:.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:85:### Implementation
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md:116:.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:95:## ADR-002: Gap Classification Methodology
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md:117:.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:97:### Metadata
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md:118:.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:107:### Context
 succeeded in 51ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C18.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C08.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C19.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C16.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C06.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C12.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C02.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C13.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C03.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C17.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C07.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C10.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C14.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C20.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C04.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C15.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C05.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C11.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C01.md
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts | sed -n '460,660p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Mutation Ledger
     3	// ---------------------------------------------------------------
     4	// Append-only audit trail for all memory mutations
     5	// SQLite triggers enforce immutability (no UPDATE/DELETE on ledger)
     6	// ---------------------------------------------------------------
     7	
     8	import { createHash } from 'crypto';
     9	import type Database from 'better-sqlite3';
    10	
    11	/* -------------------------------------------------------------
    12	   1. TYPES
    13	----------------------------------------------------------------*/
    14	
    15	type MutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';
    16	
    17	interface MutationLedgerEntry {
    18	  id: number;
    19	  timestamp: string;
    20	  mutation_type: MutationType;
 succeeded in 51ms:
   460	
   461	        for (const folder of affectedSpecFolders) {
   462	          const rows = selectDocIds.all(folder) as Array<{ document_type: string; id: number }>;
   463	          const docIds: Record<string, number> = {};
   464	
   465	          for (const row of rows) {
   466	            if (row.document_type && typeof row.id === 'number') {
   467	              docIds[row.document_type] = row.id;
   468	            }
   469	          }
   470	
   471	          if (Object.keys(docIds).length >= 2) {
   472	            const chainResult = createSpecDocumentChain(docIds);
   473	            chainsCreated += chainResult.inserted;
   474	            foldersProcessed++;
   475	          }
   476	        }
   477	
   478	        if (chainsCreated > 0) {
   479	          console.error(`[memory-index-scan] Spec 126: Created ${chainsCreated} causal chain edges across ${foldersProcessed} spec folders`);
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Crud Utils
     3	// ---------------------------------------------------------------
     4	
     5	/* ---------------------------------------------------------------
     6	   IMPORTS
     7	--------------------------------------------------------------- */
     8	
     9	import * as mutationLedger from '../lib/storage/mutation-ledger';
    10	import { toErrorMessage } from '../utils';
    11	
    12	import type { DatabaseExtended } from './types';
    13	import type { MemoryHashSnapshot, MutationLedgerInput } from './memory-crud-types';
    14	
    15	/* ---------------------------------------------------------------
    16	   HELPERS
    17	--------------------------------------------------------------- */
    18	
    19	/** Retrieve a memory's hash snapshot from the database. Returns null if unavailable. */
    20	function getMemoryHashSnapshot(database: DatabaseExtended | null, memoryId: number): MemoryHashSnapshot | null {
codex
I now have direct evidence for startup guards and the reconcile flow integration in `memory_index_scan`. I’m pulling the rest of `mutation-ledger.ts` to capture the retry/escalation behavior line-accurately, then I’ll finalize gap statuses and list any additional undocumented capabilities found.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '780,860p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '30,110p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts | sed -n '340,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
    30	import { dispatchTool } from './tools';
    31	
    32	// Handler modules (only indexSingleFile needed directly for startup scan)
    33	import {
    34	  indexSingleFile,
    35	  indexMemoryFile,
    36	  handleMemoryStats,
    37	} from './handlers';
    38	import { runPostMutationHooks } from './handlers/mutation-hooks';
    39	
    40	// Utils
    41	import { validateInputLengths } from './utils';
    42	
    43	// Hooks
    44	import {
    45	  MEMORY_AWARE_TOOLS,
    46	  extractContextHint,
    47	  autoSurfaceMemories,
    48	  autoSurfaceAtToolDispatch,
    49	  autoSurfaceAtCompaction,
 succeeded in 51ms:
   780	  } else {
   781	    // T016-T019: Lazy loading - skip warmup, model loads on first use
   782	    console.error('[context-server] Lazy loading enabled - embedding model will initialize on first use');
   783	    console.error('[context-server] Set SPECKIT_EAGER_WARMUP=true to restore eager warmup');
   784	    // Mark embedding as "ready" since it will self-initialize on first use
   785	    setEmbeddingModelReady(true);
   786	  }
   787	
   788	  // Integrity check and module initialization
   789	  try {
   790	    const report = vectorIndex.verifyIntegrity();
   791	    console.error(`[context-server] Integrity check: ${report.totalMemories}/${report.totalMemories + report.missingVectors} valid entries`);
   792	    if (report.orphanedVectors > 0) console.error(`[context-server] WARNING: ${report.orphanedVectors} orphaned entries detected`);
   793	
   794	    // Validate embedding dimension matches database
   795	    const dimValidation = vectorIndex.validateEmbeddingDimension();
   796	    if (!dimValidation.valid) {
   797	      console.error(`[context-server] ===== EMBEDDING DIMENSION MISMATCH =====`);
   798	      console.error(`[context-server] ${dimValidation.warning}`);
   799	      console.error(`[context-server] =========================================`);
 succeeded in 51ms:
   340	): DivergenceEscalationPayload {
   341	  return {
   342	    code: 'E_DIVERGENCE_RECONCILE_RETRY_EXHAUSTED',
   343	    normalizedPath: policy.normalizedPath,
   344	    attempts: policy.attemptsSoFar,
   345	    maxRetries: policy.maxRetries,
   346	    recommendation: 'manual_triage_required',
   347	    reason: `Auto-reconcile exhausted after ${policy.maxRetries} attempt(s)`,
   348	    variants: normalizeVariants(variants),
   349	  };
   350	}
   351	
   352	function recordDivergenceReconcileHook(
   353	  db: Database.Database,
   354	  input: RecordDivergenceReconcileInput
   355	): RecordDivergenceReconcileResult {
   356	  initLedger(db);
   357	
   358	  const normalizedPath = normalizePath(input.normalizedPath);
   359	  if (normalizedPath.length === 0) {
exec
/bin/zsh -lc 'rg -n "detectNodeVersionMismatch|checkSqliteVersion|startup-checks" .opencode/skill/system-spec-kit/mcp_server/context-server.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
59:import { detectNodeVersionMismatch, checkSqliteVersion } from './startup-checks';
690:  detectNodeVersionMismatch();
831:    checkSqliteVersion(database);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '666,714p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   666	      void fileWatcher.close();
   667	      fileWatcher = null;
   668	    }
   669	  });
   670	  runCleanupStep('local-reranker', () => {
   671	    void disposeLocalReranker();
   672	  });
   673	  runCleanupStep('vectorIndex', () => vectorIndex.closeDb());
   674	  process.exit(1);
   675	});
   676	
   677	process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
   678	  console.error('[context-server] Unhandled rejection at:', promise, 'reason:', reason);
   679	  // P1-10 FIX: Exit after flush to avoid running in undefined state
   680	  // AI-WHY: Short delay allows pending stderr writes to flush before exit
   681	  setTimeout(() => process.exit(1), EXIT_FLUSH_DELAY_MS);
   682	});
   683	
   684	/* ---------------------------------------------------------------
   685	   8. MAIN
exec
/bin/zsh -lc "rg -n \"appendMutationLedgerSafe\\(|mutationType:|decisionMeta:|actor:\\s*'mcp:|mutation ledger\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:165:      appendMutationLedgerSafe(database, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:166:        mutationType: 'update',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:177:        decisionMeta: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:184:        actor: 'mcp:memory_update',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:189:  // Record in mutation ledger (single entry for bulk operation)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:190:  appendMutationLedgerSafe(database, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:191:    mutationType: 'delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:196:    decisionMeta: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:205:    actor: 'mcp:memory_bulk_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:39:function appendMutationLedgerSafe(database: DatabaseExtended | null, input: MutationLedgerInput): void {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:58:    console.warn(`[memory-crud] mutation ledger append failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:76:          appendMutationLedgerSafe(database, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:77:            mutationType: 'delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:82:            decisionMeta: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:89:            actor: 'mcp:memory_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:173:          appendMutationLedgerSafe(database, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:174:            mutationType: 'delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:179:            decisionMeta: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:187:            actor: 'mcp:memory_delete',
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts | sed -n '48,116p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts | sed -n '140,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts | sed -n '148,214p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
    48	
    49	  const { id, specFolder, confirm } = args;
    50	  if (!id && !specFolder) throw new Error('Either id or specFolder is required');
    51	  if (specFolder !== undefined && typeof specFolder !== 'string') throw new Error('specFolder must be a string');
    52	  if (specFolder && !id && !confirm) throw new Error('Bulk delete requires confirm: true');
    53	
    54	  let numericId: number | null = null;
    55	  if (id !== undefined && id !== null) {
    56	    numericId = parseMemoryId(id);
    57	  }
    58	
    59	  let deletedCount = 0;
    60	  let checkpointName: string | null = null;
    61	  const database = vectorIndex.getDb();
    62	
    63	  if (numericId !== null) {
    64	    const singleSnapshot = getMemoryHashSnapshot(database, numericId);
    65	
    66	    // AI-WHY: T2-5 transaction wrapper — wraps single-delete path (memory delete, causal edge
    67	    // AI-WHY: cleanup, ledger append) in a transaction for atomicity on error.
 succeeded in 51ms:
   140	      vectorIndex.updateMemory(updateParams);
   141	
   142	      // AI-WHY: T2-6 — BM25 index stores title + trigger phrases; must re-index when either changes
   143	      // so keyword search reflects the updated content.
   144	      if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled()) {
   145	        try {
   146	          const row = database.prepare(
   147	            'SELECT title, content_text, trigger_phrases, file_path FROM memory_index WHERE id = ?'
   148	          ).get(id) as { title: string | null; content_text: string | null; trigger_phrases: string | null; file_path: string | null } | undefined;
   149	          if (row) {
   150	            const textParts: string[] = [];
   151	            if (row.title) textParts.push(row.title);
   152	            if (row.content_text) textParts.push(row.content_text);
   153	            if (row.trigger_phrases) textParts.push(row.trigger_phrases);
   154	            if (row.file_path) textParts.push(row.file_path);
   155	            const text = textParts.join(' ');
   156	            if (text.trim()) {
   157	              bm25Index.getIndex().addDocument(String(id), text);
   158	            }
   159	          }
 succeeded in 50ms:
   148	        }
   149	      } catch (cpErr: unknown) {
   150	        const message = toErrorMessage(cpErr);
   151	        console.error(`[memory-delete] Failed to create checkpoint: ${message}`);
   152	        // AI-GUARD: confirm is always true here (validated at function entry) — safe to proceed without checkpoint.
   153	        console.warn('[memory-delete] Proceeding without backup (user confirmed)');
   154	        checkpointName = null;
   155	      }
   156	    }
   157	
   158	    // AI-WHY: snapshot-then-delete is safe under single-process better-sqlite3; re-evaluate if multi-process support is added
   159	    if (database) {
   160	      causalEdges.init(database);
   161	      const bulkDeleteTx = database.transaction(() => {
   162	        for (const memory of memories) {
   163	          if (vectorIndex.deleteMemory(memory.id)) {
   164	            deletedCount++;
   165	            deletedIds.push(memory.id);
   166	            causalEdges.deleteEdgesForMemory(String(memory.id));
   167	          }
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Content Normalizer
     3	// ---------------------------------------------------------------
     4	// Sprint 7 / S1 — Smarter Memory Content Generation
     5	// ---------------------------------------------------------------
     6	//
     7	// Purpose: Normalize raw markdown content before it is passed to
     8	//   embedding generation or BM25 indexing.  Raw markdown contains
     9	//   structural noise (YAML frontmatter, HTML comment anchors, pipe
    10	//   table syntax, fence markers, checkbox notation) that degrades
    11	//   the quality of semantic embeddings and keyword retrieval.
    12	//
    13	// Integration points (do NOT modify those files here — reference only):
    14	//   - memory-parser.ts  ~line 159  : `content` is assigned from readFileWithEncoding()
    15	//       → wrap with normalizeContentForEmbedding() before passing to generateDocumentEmbedding()
    16	//   - memory-save.ts    ~line 1093 : before generateDocumentEmbedding(parsed.content)
    17	//       → normalizeContentForEmbedding(parsed.content)
    18	//   - bm25-index.ts     ~line 245  : where `content_text` is used for token building
    19	//       → normalizeContentForBM25(content_text)
    20	//
exec
/bin/zsh -lc "rg -n \"divergent_aliases|alias conflict|autoRepair|mutation ledger|mutation_ledger|normalizeContentForEmbedding|frontmatter|bulk delete|constitutional|startup check|Node version|sqlite_version|ABI|reconcile\" .opencode/skill/system-spec-kit/feature_catalog -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md:11:After restore, vectors are restored from the checkpoint snapshot when vector payloads are present. The restore handler then clears in-memory search/constitutional caches, rebuilds BM25 from live DB content when BM25 is enabled, and refreshes the trigger cache. This keeps restored memories immediately discoverable without forcing a full re-embedding pass.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/07-standalone-admin-cli.md:5:Non-MCP `spec-kit-cli` entry point (`cli.ts`) for database maintenance. Four commands: `stats` (tier distribution, top folders, schema version), `bulk-delete` (with --tier, --folder, --older-than, --dry-run, --skip-checkpoint; constitutional/critical tiers require folder scope), `reindex` (--force, --eager-warmup), `schema-downgrade` (--to 15, --confirm). Transaction-wrapped deletions, checkpoint creation before bulk-delete, mutation ledger recording. Invoked as `node cli.js <command>` from any directory.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:148:  - [Constitutional memory as expert knowledge injection](#constitutional-memory-as-expert-knowledge-injection)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:169:  - [Memory health autoRepair metadata](#memory-health-autorepair-metadata)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:232:The parameter surface is wide. You control result count (`limit`, 1-100), spec folder scoping, tier and context type filtering, intent (explicit or auto-detected), reranking toggle, length penalty, temporal decay, minimum memory state (`minState`, default `"WARM"`, range HOT through ARCHIVED), constitutional inclusion, content inclusion, anchor filtering, session dedup, session boosting, causal boosting, minimum quality threshold, cache bypass and access tracking. Most defaults are sensible. You typically send a query and a session ID and let everything else run at defaults.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:277:Stage 1 (Candidate Generation) executes search channels based on query type. Multi-concept queries generate one embedding per concept. Deep mode expands into up to 3 query variants via `expandQuery()`. When embedding expansion is active and R15 does not classify the query as "simple", a baseline and expanded-query search run in parallel with deduplication. Constitutional memory injection appends up to 5 constitutional rows when none appear in the initial candidate set. Quality score and tier filters run at the end of Stage 1.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:330:`memory_save` is the entry point for getting content into the memory system. You give it a file path. It reads the file, parses metadata from the frontmatter (title, trigger phrases, spec folder, importance tier, context type, causal links), generates a vector embedding and indexes everything into the SQLite database.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:332:Before embedding generation, content normalization strips structural markdown noise. Seven primitives (frontmatter, anchors, HTML comments, code fences, tables, lists, headings) run in sequence to produce cleaner text for the embedding model. BM25 has a separate normalization entry point (`normalizeContentForBM25`) that currently delegates to the embedding normalizer, and it is used on rebuild-from-database paths. In live save paths, raw content is passed to BM25 tokenization (`addDocument`) before tokenizer normalization.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:348:Safety mechanisms run deep. Path security validation checks the file against an allowlist of base paths. File type validation accepts only `.md` and `.txt` in approved directories. Pre-flight validation checks anchor format, detects duplicates and estimates token budget before investing in embedding generation. A per-spec-folder mutex lock prevents TOCTOU race conditions when multiple saves target the same folder. SHA-256 content hashing skips unchanged files. A mutation ledger records every create, update, reinforce and supersede action for audit. The trigger matcher cache, tool cache and constitutional cache are all invalidated on write. If embedding generation fails, the memory is still stored and searchable via BM25/FTS5 with the embedding marked as pending for later re-indexing.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:350:Document type affects importance weighting automatically: constitutional files get 1.0, spec documents 0.8, plans 0.7, memory files 0.5 and scratch files 0.25.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:365:A pre-update hash snapshot is captured for the mutation ledger. Every update records the prior hash, new hash, actor and decision metadata for full auditability.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:376:Single deletes run inside a database transaction: remove the memory record via `vectorIndex.deleteMemory(id)`, clean up associated causal graph edges via `causalEdges.deleteEdgesForMemory(id)` and record a mutation ledger entry. If any step fails, the entire transaction rolls back. This atomicity guarantee was added in Phase 018 (CR-P1-1) to prevent partial deletes from leaving orphaned data.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:378:Bulk deletes by spec folder are more involved. Unless the caller sets `skipCheckpoint=true`, the system first creates an auto-checkpoint with a timestamped name (like `pre-cleanup-2026-02-28T12-00-00`) so you can roll back if the deletion was a mistake. Then it deletes all matching memories inside a database transaction with per-memory causal edge cleanup and per-memory mutation ledger entries. The entire operation is atomic: either all memories in the folder are deleted or none are. The response includes the checkpoint name and a restore command hint when a checkpoint was created.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:387:For large-scale cleanup operations. Instead of targeting a folder, you target an importance tier: delete all deprecated memories, or all temporary memories older than 30 days. The tool counts affected memories first (so the response tells you exactly how many were deleted), then deletes within a database transaction. A safety checkpoint is created unless `skipCheckpoint=true`; constitutional/critical tiers still require checkpoint creation.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:389:Constitutional and critical tier memories receive extra protection. Unscoped deletion of these tiers is refused outright. You must provide a `specFolder` to delete constitutional or critical memories in bulk. The `skipCheckpoint` speed optimization, which skips the safety checkpoint for faster execution, is also rejected for these tiers. If the checkpoint creation itself fails for constitutional/critical, the entire operation aborts. For lower tiers, a checkpoint failure triggers a warning but the deletion proceeds because the risk of losing deprecated or temporary memories is low.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:391:Each deleted memory gets its causal graph edges removed. A single consolidated mutation ledger entry (capped at 50 linked memory IDs to avoid ledger bloat) records the bulk operation. All caches are invalidated after deletion.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:419:`memory-crud-update.ts` gained a `database.transaction(() => {...})()` wrapper around its mutation steps (vectorIndex.updateMemory, BM25 re-index, mutation ledger). `memory-crud-delete.ts` gained the same for its single-delete path (memory delete, vector delete, causal edge delete, mutation ledger). Cache invalidation operations remain outside the transaction as in-memory-only operations. Both include null-database fallbacks.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:439:Contradiction detection uses regex patterns. All decisions are logged to the `memory_conflicts` table with similarity score, chosen action, contradiction flag, reason, and spec_folder. Document-type-aware weighting adjusts thresholds (constitutional=1.0 down to scratch=0.25). The engine is always active unless `force: true` is passed to bypass arbitration.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:480:Two report modes. Full mode checks database connectivity, embedding model readiness, vector search availability, FTS5 index consistency and alias conflicts. The FTS5 check compares row counts between `memory_index` and `memory_fts` tables. If they diverge, something went wrong during indexing and the system suggests running `memory_index_scan` with `force: true` to rebuild. Alias conflict detection finds files that exist under both `specs/` and `.opencode/specs/` paths, which happens in projects with symlinks or path normalization issues.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:482:The response reports overall status as "healthy" or "degraded" along with server version, uptime in seconds, embedding provider details (provider name, model, dimension) and the database file path. "Degraded" does not mean broken. It means something needs attention: a disconnected embedding provider, an FTS mismatch or unresolved alias conflicts.
codex
---
GAP_NUMBER: 49  
FEATURE_NAME: Divergent alias diagnostics mode (`reportMode="divergent_aliases"`)  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:45-50`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:80-85`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:130-196`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:276-307`  
DRAFT_DESCRIPTION: The health handler supports a dedicated `divergent_aliases` report mode that isolates alias divergence triage from full system health output. It computes grouped conflicts where `specs/` and `.opencode/specs/` variants coexist with differing hashes, supports `specFolder` scoping, and enforces a bounded `limit` (max 200). The response is compact and includes actionable hints when additional groups exist beyond the current page.  
SUGGESTED_CATEGORY: `03--discovery`  
SIGNIFICANCE: LOW  
NOTES: In this mode, `autoRepair` is explicitly ignored and surfaced as a hint.

---
GAP_NUMBER: 50  
FEATURE_NAME: Mutation ledger audit trail (typed + runtime append path)  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:60-81`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:39-55`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:89-116`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:140-164`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:165-185`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:76-90`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:190-206`  
DRAFT_DESCRIPTION: The codebase has a concrete append-only mutation ledger, not just type placeholders. Writes include mutation type, prior/new hashes, actor, linked IDs, and structured decision metadata, and UPDATE/DELETE on the ledger are blocked by DB triggers. CRUD handlers actively append ledger entries for update, single delete, bulk folder delete, and tier-based bulk delete paths.  
SUGGESTED_CATEGORY: `02--mutation`  
SIGNIFICANCE: LOW  
NOTES: `memory-crud-types.ts` defines the contract; actual persistence is in `lib/storage/mutation-ledger.ts`.

---
GAP_NUMBER: 51  
FEATURE_NAME: Health auto-repair actions (`autoRepair`)  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:45-50`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:213-224`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:316-323`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:349-392`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:397-410`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:432-434`  
DRAFT_DESCRIPTION: `memory_health` accepts `autoRepair` and performs real remediation in full mode when integrity checks fail. It rebuilds FTS5 and refreshes trigger caches on mismatch, then verifies post-repair consistency. It also attempts orphan causal-edge cleanup and returns structured repair telemetry (`attempted`, `repaired`, `actions`, `warnings`, `errors`).  
SUGGESTED_CATEGORY: `03--discovery`  
SIGNIFICANCE: LOW  
NOTES: Repair is conditional and best-effort; failures are reported without crashing the handler.

---
GAP_NUMBER: 52  
FEATURE_NAME: Alias divergence auto-reconcile with bounded retry/escalation  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:49-57`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:200-234`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:238-306`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:249-259`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:280-315`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:352-430`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:492-523`  
DRAFT_DESCRIPTION: After alias conflict detection, the index scan runs reconcile hooks that schedule bounded retries and escalate when retry budgets are exhausted. Reconcile state is persisted through mutation-ledger `reindex` entries with policy metadata and escalation payloads. The index scan response surfaces reconcile counts, exhaustion notices, and hook errors as operator-facing hints.  
SUGGESTED_CATEGORY: `04--maintenance`  
SIGNIFICANCE: LOW  
NOTES: This is orchestration/audit escalation logic, not direct content auto-merge.

---
GAP_NUMBER: 53  
FEATURE_NAME: Embedding input normalization before vectorization  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:44-48`; `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:38-69`; `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:218-233`  
DRAFT_DESCRIPTION: The embedding pipeline normalizes content before provider embedding generation on cache misses. The normalizer strips YAML frontmatter, anchor tags, and HTML comments (plus other markdown-structure cleanup) to reduce embedding noise. This confirms explicit pre-vectorization normalization in runtime flow, not only in utility code.  
SUGGESTED_CATEGORY: `13--memory-quality-and-indexing`  
SIGNIFICANCE: LOW  
NOTES: File location is `handlers/save/embedding-pipeline.ts` (not `lib/save/embedding-pipeline.ts`).

---
GAP_NUMBER: 54  
FEATURE_NAME: Safety-tiered retention bulk delete  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:49-65`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:102-139`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:140-142`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:170-187`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:190-206`  
DRAFT_DESCRIPTION: Bulk deletion enforces tier-specific safety gates: constitutional/critical deletes require explicit `specFolder` scope and cannot use `skipCheckpoint`. For those high-safety tiers, checkpoint creation is mandatory and failure aborts the operation. Deletions then run transactionally with causal-edge cleanup and consolidated ledger recording.  
SUGGESTED_CATEGORY: `02--mutation`  
SIGNIFICANCE: LOW  
NOTES: Lower tiers can proceed after checkpoint failure with warning-only behavior.

---
GAP_NUMBER: 55  
FEATURE_NAME: Startup runtime compatibility guards (Node ABI + SQLite version)  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:23-59`; `.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:66-85`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:59`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:688-690`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:830-832`  
DRAFT_DESCRIPTION: A dedicated startup-checks module validates runtime compatibility at process boot. It detects Node module ABI drift via a persisted marker file and checks SQLite runtime version against minimum requirements. Both checks are invoked from the main startup path and emit operational warnings for remediation.  
SUGGESTED_CATEGORY: `04--maintenance`  
SIGNIFICANCE: LOW  
NOTES: These guards are non-blocking warnings; they do not hard-stop startup by themselves.

---

NEW CAPABILITIES FOUND (not in gaps 49-55):

---
GAP_NUMBER: NEW-1  
FEATURE_NAME: Persistent embedding cache hit/miss/store path in save pipeline  
STATUS: NEW_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:35-53`  
DRAFT_DESCRIPTION: The embedding pipeline performs persistent cache lookup keyed by content hash + model before provider calls. Cache hits return embeddings immediately, while misses generate and then store vectors for future reuse. This reduces repeated provider calls during re-index/save operations.  
SUGGESTED_CATEGORY: `14--pipeline-architecture`  
SIGNIFICANCE: LOW  
NOTES: Works alongside normalization and async pending mode.

---
GAP_NUMBER: NEW-2  
FEATURE_NAME: Age-filtered retention deletion (`olderThanDays`) in bulk delete  
STATUS: NEW_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:67-69`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:85-88`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:153-156`  
DRAFT_DESCRIPTION: Tier-based bulk delete supports a time-based retention filter through `olderThanDays`. The filter is validated, applied in count queries, and reused in selection/deletion queries for consistent scope. This enables cleanup policies beyond pure tier scoping.  
SUGGESTED_CATEGORY: `02--mutation`  
SIGNIFICANCE: LOW  
NOTES: Complements checkpoint safety controls.

---
GAP_NUMBER: NEW-3  
FEATURE_NAME: Alias reconcile candidate expansion beyond sample-capped summaries  
STATUS: NEW_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:251-260`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:200-234`  
DRAFT_DESCRIPTION: Reconcile hooks do not rely only on capped conflict samples. When summary counts exceed sample size, the handler expands to full candidate discovery from index rows before scheduling retries/escalations. This prevents silent under-processing in large divergence sets.  
SUGGESTED_CATEGORY: `04--maintenance`  
SIGNIFICANCE: LOW  
NOTES: This behavior is specifically designed to overcome summary sample limits.
tokens used
202,470
---
GAP_NUMBER: 49  
FEATURE_NAME: Divergent alias diagnostics mode (`reportMode="divergent_aliases"`)  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:45-50`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:80-85`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:130-196`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:276-307`  
DRAFT_DESCRIPTION: The health handler supports a dedicated `divergent_aliases` report mode that isolates alias divergence triage from full system health output. It computes grouped conflicts where `specs/` and `.opencode/specs/` variants coexist with differing hashes, supports `specFolder` scoping, and enforces a bounded `limit` (max 200). The response is compact and includes actionable hints when additional groups exist beyond the current page.  
SUGGESTED_CATEGORY: `03--discovery`  
SIGNIFICANCE: LOW  
NOTES: In this mode, `autoRepair` is explicitly ignored and surfaced as a hint.

---
GAP_NUMBER: 50  
FEATURE_NAME: Mutation ledger audit trail (typed + runtime append path)  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:60-81`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:39-55`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:89-116`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:140-164`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:165-185`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:76-90`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:190-206`  
DRAFT_DESCRIPTION: The codebase has a concrete append-only mutation ledger, not just type placeholders. Writes include mutation type, prior/new hashes, actor, linked IDs, and structured decision metadata, and UPDATE/DELETE on the ledger are blocked by DB triggers. CRUD handlers actively append ledger entries for update, single delete, bulk folder delete, and tier-based bulk delete paths.  
SUGGESTED_CATEGORY: `02--mutation`  
SIGNIFICANCE: LOW  
NOTES: `memory-crud-types.ts` defines the contract; actual persistence is in `lib/storage/mutation-ledger.ts`.

---
GAP_NUMBER: 51  
FEATURE_NAME: Health auto-repair actions (`autoRepair`)  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:45-50`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:213-224`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:316-323`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:349-392`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:397-410`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:432-434`  
DRAFT_DESCRIPTION: `memory_health` accepts `autoRepair` and performs real remediation in full mode when integrity checks fail. It rebuilds FTS5 and refreshes trigger caches on mismatch, then verifies post-repair consistency. It also attempts orphan causal-edge cleanup and returns structured repair telemetry (`attempted`, `repaired`, `actions`, `warnings`, `errors`).  
SUGGESTED_CATEGORY: `03--discovery`  
SIGNIFICANCE: LOW  
NOTES: Repair is conditional and best-effort; failures are reported without crashing the handler.

---
GAP_NUMBER: 52  
FEATURE_NAME: Alias divergence auto-reconcile with bounded retry/escalation  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:49-57`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:200-234`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:238-306`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:249-259`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:280-315`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:352-430`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:492-523`  
DRAFT_DESCRIPTION: After alias conflict detection, the index scan runs reconcile hooks that schedule bounded retries and escalate when retry budgets are exhausted. Reconcile state is persisted through mutation-ledger `reindex` entries with policy metadata and escalation payloads. The index scan response surfaces reconcile counts, exhaustion notices, and hook errors as operator-facing hints.  
SUGGESTED_CATEGORY: `04--maintenance`  
SIGNIFICANCE: LOW  
NOTES: This is orchestration/audit escalation logic, not direct content auto-merge.

---
GAP_NUMBER: 53  
FEATURE_NAME: Embedding input normalization before vectorization  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:44-48`; `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:38-69`; `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:218-233`  
DRAFT_DESCRIPTION: The embedding pipeline normalizes content before provider embedding generation on cache misses. The normalizer strips YAML frontmatter, anchor tags, and HTML comments (plus other markdown-structure cleanup) to reduce embedding noise. This confirms explicit pre-vectorization normalization in runtime flow, not only in utility code.  
SUGGESTED_CATEGORY: `13--memory-quality-and-indexing`  
SIGNIFICANCE: LOW  
NOTES: File location is `handlers/save/embedding-pipeline.ts` (not `lib/save/embedding-pipeline.ts`).

---
GAP_NUMBER: 54  
FEATURE_NAME: Safety-tiered retention bulk delete  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:49-65`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:102-139`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:140-142`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:170-187`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:190-206`  
DRAFT_DESCRIPTION: Bulk deletion enforces tier-specific safety gates: constitutional/critical deletes require explicit `specFolder` scope and cannot use `skipCheckpoint`. For those high-safety tiers, checkpoint creation is mandatory and failure aborts the operation. Deletions then run transactionally with causal-edge cleanup and consolidated ledger recording.  
SUGGESTED_CATEGORY: `02--mutation`  
SIGNIFICANCE: LOW  
NOTES: Lower tiers can proceed after checkpoint failure with warning-only behavior.

---
GAP_NUMBER: 55  
FEATURE_NAME: Startup runtime compatibility guards (Node ABI + SQLite version)  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:23-59`; `.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:66-85`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:59`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:688-690`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:830-832`  
DRAFT_DESCRIPTION: A dedicated startup-checks module validates runtime compatibility at process boot. It detects Node module ABI drift via a persisted marker file and checks SQLite runtime version against minimum requirements. Both checks are invoked from the main startup path and emit operational warnings for remediation.  
SUGGESTED_CATEGORY: `04--maintenance`  
SIGNIFICANCE: LOW  
NOTES: These guards are non-blocking warnings; they do not hard-stop startup by themselves.

---

NEW CAPABILITIES FOUND (not in gaps 49-55):

---
GAP_NUMBER: NEW-1  
FEATURE_NAME: Persistent embedding cache hit/miss/store path in save pipeline  
STATUS: NEW_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:35-53`  
DRAFT_DESCRIPTION: The embedding pipeline performs persistent cache lookup keyed by content hash + model before provider calls. Cache hits return embeddings immediately, while misses generate and then store vectors for future reuse. This reduces repeated provider calls during re-index/save operations.  
SUGGESTED_CATEGORY: `14--pipeline-architecture`  
SIGNIFICANCE: LOW  
NOTES: Works alongside normalization and async pending mode.

---
GAP_NUMBER: NEW-2  
FEATURE_NAME: Age-filtered retention deletion (`olderThanDays`) in bulk delete  
STATUS: NEW_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:67-69`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:85-88`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:153-156`  
DRAFT_DESCRIPTION: Tier-based bulk delete supports a time-based retention filter through `olderThanDays`. The filter is validated, applied in count queries, and reused in selection/deletion queries for consistent scope. This enables cleanup policies beyond pure tier scoping.  
SUGGESTED_CATEGORY: `02--mutation`  
SIGNIFICANCE: LOW  
NOTES: Complements checkpoint safety controls.

---
GAP_NUMBER: NEW-3  
FEATURE_NAME: Alias reconcile candidate expansion beyond sample-capped summaries  
STATUS: NEW_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:251-260`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:200-234`  
DRAFT_DESCRIPTION: Reconcile hooks do not rely only on capped conflict samples. When summary counts exceed sample size, the handler expands to full candidate discovery from index rows before scheduling retries/escalations. This prevents silent under-processing in large divergence sets.  
SUGGESTED_CATEGORY: `04--maintenance`  
SIGNIFICANCE: LOW  
NOTES: This behavior is specifically designed to overcome summary sample limits.
