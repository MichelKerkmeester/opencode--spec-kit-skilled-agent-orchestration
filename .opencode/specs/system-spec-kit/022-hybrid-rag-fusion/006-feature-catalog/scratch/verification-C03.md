OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce97-d5e3-7420-a5be-44deae58dcbc
--------
user
You are a feature catalog verification agent. Read each feature snippet file in these directories: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/03--discovery/ (3 files), /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/04--maintenance/ (2 files), /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/ (7 files). For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. 

OUTPUT FORMAT (repeat for each feature file):
---
FEATURE: [filename without path]
DESCRIPTION_ACCURATE: [YES/NO/PARTIAL - does Current Reality match source code?]
CODE_PATHS_VALID: [YES/NO - do all listed file paths exist?]
INVALID_PATHS: [list any paths that do not exist, or NONE]
MISSING_CODE_PATHS: [list source files that implement this but are not listed, or NONE]
SEVERITY: [HIGH/MEDIUM/LOW - how important are any issues found]
RECOMMENDED_ACTION: [NONE/UPDATE_DESCRIPTION/UPDATE_PATHS/BOTH/REWRITE]
NOTES: [brief explanation of any issues]
---

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
I’m verifying each feature snippet against the actual `system-spec-kit` MCP server code. First I’m locating the 12 feature files, checking the relevant instructions/skill routing, and then I’ll compare each snippet’s `Current Reality` and `Source Files` against the code.
exec
/bin/zsh -lc 'pwd && test -d .opencode/skill/system-spec-kit/mcp_server && echo MCP_SERVER_PRESENT' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/feature_catalog/03--discovery .opencode/skill/system-spec-kit/feature_catalog/04--maintenance .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
MCP_SERVER_PRESENT
 succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/02-system-statistics-memorystats.md
.opencode/skill/system-spec-kit/feature_catalog/04--maintenance/02-startup-runtime-compatibility-guards.md
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/01-memory-browser-memorylist.md
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md
.opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Verify system-spec-kit feature catalog snippets against mcp_server source code for accuracy and completeness" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 610ms:
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !spec, !system-spec-kit(explicit), document~, folder, kit(name)"
  },
  {
    "skill": "sk-code-full-stack",
    "kind": "skill",
    "confidence": 0.93,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !code(multi), !intent:implementation, code(name), specification~, spec~"
  },
  {
    "skill": "sk-code-opencode",
    "kind": "skill",
codex
Skill routing points to `system-spec-kit`, so I’m pulling just the relevant guidance and then extracting each feature’s `Current Reality` and `Source Files` sections. After that I’ll map those claims onto the actual `mcp_server` implementation and call out anything missing.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "for f in .opencode/skill/system-spec-kit/feature_catalog/03--discovery/*.md .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/*.md .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/*.md; do printf '===== %s =====\\n' \""'$f"; awk '"'BEGIN{show=0} /"'^## Current Reality/{show=1} /''^## Source Files/{if(show){print; next}} /''^## /&&show&&$0!="## Current Reality"&&$0!="## Source Files"{show=0} show{print}'"' \""'$f"; printf '"'\\n'; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 2.2.26.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.


## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `specs/007-auth-feature/`) that contains all documentation for a single feature or task:

 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts
.opencode/skill/system-spec-kit/mcp_server/eslint.config.mjs
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts
 succeeded in 51ms:
Total output lines: 1682

===== .opencode/skill/system-spec-kit/feature_catalog/03--discovery/01-memory-browser-memorylist.md =====
## Current Reality

Paginated browsing of everything the memory system knows. You can sort by creation date, update date or importance weight. Filter by spec folder. Optionally include child chunk rows alongside parent memories (off by default for cleaner browsing).

Each entry shows its numeric ID, spec folder, title, creation and update timestamps, importance weight, trigger phrase count and file path. The response includes a total count and pagination hints (like "More results available: use offset: 40") for navigating forward. Default page size is 20, maximum is 100.

This is the starting point for any manual memory management workflow. Need to delete a specific memory? Browse to find its ID. Want to audit what is indexed under a spec folder? Filter by folder and scan the results. Wondering why a memory is not surfacing in search? Look up its importance weight and tier here.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/core/db-state.ts` | Core | Database state management |
codex
I’ve got the feature list and the MCP server file inventory. Now I’m doing the code-level pass: extracting each snippet’s exact claims and lining them up with the handlers, schemas, startup code, and tests that actually implement those behaviors.
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"), path=require(\"path\"); const dirs=[\".opencode/skill/system-spec-kit/feature_catalog/03--discovery\",\".opencode/skill/system-spec-kit/feature_catalog/04--maintenance\",\".opencode/skill/system-spec-kit/feature_catalog/05--lifecycle\"]; const files=dirs.flatMap(d=>fs.readdirSync(d).filter(f=>f.endsWith(\".md\")).map(f=>path.join(d,f))).sort(); for(const f of files){ const text=fs.readFileSync(f,\"utf8\"); const m1=text.match(/"'^## Current Reality'"\\n\\n([\\s\\S]*?)(?="'^## Source Files'"\\n)/m); const m2=text.match(/"'^## Source Files'"\\n\\n### Implementation\\n\\n([\\s\\S]*?)(?="'^### Tests'"\\n|\\Z)/m); console.log("'`===== ${path.basename(f)} =====`); console.log("CURRENT_REALITY:"); console.log(m1?m1[1].trim():"NONE"); console.log("IMPLEMENTATION_PATHS:"); if(m2){ const matches=[...m2[1].matchAll(/`([''^`]+)`/g)].map(x=>x[1]); for(const p of matches) console.log(p);} else console.log("NONE"); console.log(""); }'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
===== 01-memory-browser-memorylist.md =====
CURRENT_REALITY:
Paginated browsing of everything the memory system knows. You can sort by creation date, update date or importance weight. Filter by spec folder. Optionally include child chunk rows alongside parent memories (off by default for cleaner browsing).

Each entry shows its numeric ID, spec folder, title, creation and update timestamps, importance weight, trigger phrase count and file path. The response includes a total count and pagination hints (like "More results available: use offset: 40") for navigating forward. Default page size is 20, maximum is 100.

This is the starting point for any manual memory management workflow. Need to delete a specific memory? Browse to find its ID. Want to audit what is indexed under a spec folder? Filter by folder and scan the results. Wondering why a memory is not surfacing in search? Look up its importance weight and tier here.
IMPLEMENTATION_PATHS:
mcp_server/configs/cognitive.ts
mcp_server/core/config.ts
mcp_server/core/db-state.ts
mcp_server/core/index.ts
mcp_server/formatters/token-metrics.ts
mcp_server/handlers/causal-links-processor.ts
mcp_server/handlers/chunking-orchestrator.ts
mcp_server/handlers/handler-utils.ts
mcp_server/handlers/memory-crud-delete.ts
mcp_server/handlers/memory-crud-health.ts
mcp_server/handlers/memory-crud-list.ts
mcp_server/handlers/memory-crud-stats.ts
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "memory_list|memory_stats|memory_health|memory_index_scan|checkpoint_create|checkpoint_list|checkpoint_restore|checkpoint_delete|memory_ingest_start|memory_ingest_status|memory_ingest_cancel" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Memory Crud
// ---------------------------------------------------------------

import { handleMemoryDelete } from './memory-crud-delete';
import { handleMemoryUpdate } from './memory-crud-update';
import { handleMemoryList } from './memory-crud-list';
import { handleMemoryStats } from './memory-crud-stats';
import { handleMemoryHealth } from './memory-crud-health';
import { setEmbeddingModelReady, isEmbeddingModelReady } from '../core';

/* ---------------------------------------------------------------
   EXPORTS
--------------------------------------------------------------- */

export {
  handleMemoryDelete,
  handleMemoryUpdate,
  handleMemoryList,
  handleMemoryStats,
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Checkpoints
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. LIB MODULE IMPORTS
--------------------------------------------------------------- */

import * as checkpoints from '../lib/storage/checkpoints';
import * as vectorIndex from '../lib/search/vector-index';
import * as bm25Index from '../lib/search/bm25-index';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as confidenceTracker from '../lib/scoring/confidence-tracker';
import { executeAutoPromotion } from '../lib/search/auto-promotion';
import { recordSelection } from '../lib/search/learned-feedback';
import { recordUserSelection } from '../lib/eval/ground-truth-feedback';
import { recordNegativeFeedbackEvent } from '../lib/scoring/negative-feedback';
import { checkDatabaseUpdated } from '../core';
import { requireDb, toErrorMessage } from '../utils';

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Memory Ingest Handlers
// ---------------------------------------------------------------

import { randomBytes } from 'node:crypto';
import path from 'node:path';

import { ALLOWED_BASE_PATHS, DATABASE_PATH, checkDatabaseUpdated } from '../core';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import {
  createIngestJob,
  enqueueIngestJob,
  getIngestJob,
  cancelIngestJob,
  getIngestProgressPercent,
  type IngestJob,
} from '../lib/ops/job-queue';

import type { MCPResponse } from './types';

 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:231:    ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:238:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:490:      console.error('[context-server] Run memory_index_scan manually after model loads');
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:178:  name: 'memory_list',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:184:  name: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:190:  name: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:273:  name: 'checkpoint_create',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:279:  name: 'checkpoint_list',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:285:  name: 'checkpoint_restore',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:291:  name: 'checkpoint_delete',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:389:  name: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:401:  name: 'memory_ingest_start',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:424:  name: 'memory_ingest_status',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:437:  name: 'memory_ingest_cancel',
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:327:  memory_list: memoryListSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:328:  memory_stats: memoryStatsSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:329:  memory_health: memoryHealthSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:334:  checkpoint_create: checkpointCreateSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:335:  checkpoint_list: checkpointListSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:336:  checkpoint_restore: checkpointRestoreSchema as unknown as ToolInputSchema,
codex
I’ve narrowed the verification to the real implementation hotspots. Next I’m reading the specific handlers and support modules for list/stats/health/indexing, startup guards, checkpoints, ingestion, pending-file recovery, and archival so I can judge each snippet on behavior rather than just file existence.
exec
/bin/zsh -lc "sed -n '1,420p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,460p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Memory Crud List
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { safeJsonParseTyped } from '../utils/json-helpers';

import type { MCPResponse } from './types';
import type { ListArgs } from './memory-crud-types';

/* ---------------------------------------------------------------
   CORE LOGIC
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Memory Crud Stats
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */

import * as fs from 'fs';

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as folderScoring from '../lib/scoring/folder-scoring';
import type { FolderMemoryInput } from '../lib/scoring/folder-scoring';
import { getGraphMetrics } from '../lib/search/hybrid-search';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import type { MCPResponse } from './types';
import type { StatsArgs } from './memory-crud-types';
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Memory Index
// ---------------------------------------------------------------

import path from 'path';

/* ---------------------------------------------------------------
   1. CORE AND UTILS IMPORTS
--------------------------------------------------------------- */

import { getLastScanTime, setLastScanTime, checkDatabaseUpdated } from '../core';
import { INDEX_SCAN_COOLDOWN, DEFAULT_BASE_PATH, BATCH_SIZE } from '../core/config';
import { processBatches, requireDb, toErrorMessage, type RetryErrorResult } from '../utils';
import { getCanonicalPathKey } from '../lib/utils/canonical-path';

/* ---------------------------------------------------------------
   2. LIB MODULE IMPORTS
--------------------------------------------------------------- */

import * as memoryParser from '../lib/parsing/memory-parser';
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Memory Crud Health
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */

import { randomUUID } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { isEmbeddingModelReady } from '../core';
exec
/bin/zsh -lc "sed -n '421,620p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    try {
      // AI-WHY: Determine which spec folders had spec document changes in this scan.
      // We use parsed document type (not basename) to avoid false positives
      // from memory/plan.md or similar filenames.
      const affectedSpecFolders = new Set<string>();
      for (const fileResult of results.files) {
        if (!fileResult.specFolder || fileResult.status === 'failed') {
          continue;
        }

        if (!fileResult.filePath) {
          continue;
        }

        const docType = memoryParser.extractDocumentType(fileResult.filePath);
        if (
          docType !== 'memory' &&
          docType !== 'constitutional'
        ) {
          affectedSpecFolders.add(fileResult.specFolder);
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Memory Index Discovery Helpers
// ---------------------------------------------------------------

/* ------- 1. DEPENDENCIES ------- */

import fs from 'fs';
import path from 'path';

import { toErrorMessage } from '../utils';
import { getCanonicalPathKey } from '../lib/utils/canonical-path';

/* ------- 2. CONSTANTS ------- */

/** Well-known spec folder document filenames. */
const SPEC_DOCUMENT_FILENAMES = new Set([
  'spec.md',
  'plan.md',
  'tasks.md',
  'checklist.md',
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Memory Index Alias Conflict Helpers
// ---------------------------------------------------------------

/* ------- 1. DEPENDENCIES ------- */

import { requireDb, toErrorMessage } from '../utils';
import * as mutationLedger from '../lib/storage/mutation-ledger';

/* ------- 2. TYPES ------- */

const DOT_OPENCODE_SPECS_SEGMENT = '/.opencode/specs/';
const SPECS_SEGMENT = '/specs/';
const MAX_ALIAS_CONFLICT_SAMPLES = 5;
const DIVERGENCE_RECONCILE_ACTOR = 'memory-index-scan';

interface AliasConflictRow {
  file_path: string;
  content_hash: string | null;
}
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Incremental Index
// ---------------------------------------------------------------
// Mtime-based incremental indexing for fast re-indexing
// ---------------------------------------------------------------

// Node stdlib
import * as fs from 'fs';

// External packages
import type Database from 'better-sqlite3';

// Internal modules
import { getCanonicalPathKey } from '../utils/canonical-path';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const MTIME_FAST_PATH_MS = 1000; // Skip if mtime within 1 second
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Canonical Path
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

function normalizePathKey(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');
  return process.platform === 'win32' ? normalized.toLowerCase() : normalized;
}

/**
 * Canonical identity for path deduplication.
 *
 * - Uses realpath when possible so symlink aliases collapse to one key.
 * - Falls back to resolved absolute path when file does not exist.
 */
export function getCanonicalPathKey(filePath: string): string {
  try {
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/startup-checks.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "pending|recoverPending|findPendingFiles|totalRecoveries|transaction manager|startup" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts .opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Startup Checks
// ---------------------------------------------------------------
// Non-critical startup checks extracted from context-server.ts (T303).
// ---------------------------------------------------------------

import path from 'path';
import fs from 'fs';

/* ---------------------------------------------------------------
   1. NODE VERSION MISMATCH DETECTION
--------------------------------------------------------------- */

interface NodeVersionMarker {
  nodeVersion: string;
  moduleVersion: string;
  platform: string;
  arch: string;
  createdAt: string;
}
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Transaction Manager
// ---------------------------------------------------------------
// AI-GUARD: Atomic file + index operations with pending file recovery
// ---------------------------------------------------------------

import * as fs from 'fs';
import * as path from 'path';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const PENDING_SUFFIX = '_pending';
const TEMP_SUFFIX = '.tmp';

/* -------------------------------------------------------------
   2. INTERFACES
----------------------------------------------------------------*/

 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Context Server
// ---------------------------------------------------------------
// T303: Decomposed — tool schemas in tool-schemas.ts, dispatch
// logic in tools/*.ts. This file retains server init, startup,
// shutdown, and main orchestration only.
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

/* ---------------------------------------------------------------
   1. MODULE IMPORTS
--------------------------------------------------------------- */

// MCP SDK
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:27:    it.todo('should mark active sessions as interrupted on startup — needs seeded active sessions in SQLite before reset');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:63:    it.todo('should transition from active to interrupted on crash simulation — needs startup reset fixture to verify crash recovery status updates');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:4:// AI-GUARD: Atomic file + index operations with pending file recovery
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:14:const PENDING_SUFFIX = '_pending';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:24:  totalRecoveries: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:51:  totalRecoveries: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:67:  metrics.totalRecoveries = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:88:function getOriginalPath(pendingPath: string): string {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:89:  const dir = path.dirname(pendingPath);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:90:  const ext = path.extname(pendingPath);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:91:  const base = path.basename(pendingPath, ext);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:158: * Execute an atomic save with pending file pattern.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:159: * 1. Write to pending path
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:161: * 3. Rename pending to final
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:163: * AI-WHY: This function provides file-system-level atomicity (write-to-pending + rename),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:174:  const pendingPath = getPendingPath(filePath);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:177:    // Step 1: Write to pending path
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:178:    const dir = path.dirname(pendingPath);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:182:    fs.writeFileSync(pendingPath, content, 'utf-8');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:197:      // Database failed - clean up pending file
exec
/bin/zsh -lc "sed -n '281,420p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[transaction-manager] findPendingFiles error: ${msg}`);
    return [];
  }
}

/**
 * Recover a single pending file by renaming to its original path.
 */
function recoverPendingFile(pendingPath: string): RecoveryResult {
  try {
    const originalPath = getOriginalPath(pendingPath);

    // If original exists and is newer, delete pending
    if (fs.existsSync(originalPath)) {
      const pendingStats = fs.statSync(pendingPath);
      const originalStats = fs.statSync(originalPath);

      if (originalStats.mtimeMs > pendingStats.mtimeMs) {
exec
/bin/zsh -lc "sed -n '404,545p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
  }
});

/* ---------------------------------------------------------------
   6. STARTUP SCAN & PENDING FILE RECOVERY
--------------------------------------------------------------- */

let startupScanInProgress = false;

/**
 * T107: Recover pending memory files on MCP startup.
 * CHK-188: Pending files processed by recovery job on next startup.
 *
 * Scans for files with _pending suffix (created when index failed after file write)
 * and attempts to index them.
 */
async function recoverPendingFiles(basePath: string): Promise<PendingRecoveryResult> {
  console.error('[context-server] Checking for pending memory files...');

  try {
exec
/bin/zsh -lc 'test -d .opencode/skill/system-spec-kit/shared && echo SHARED_PRESENT || echo SHARED_MISSING' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
SHARED_PRESENT
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"), path=require(\"path\"); const base=path.resolve(\".opencode/skill/system-spec-kit\"); const dirs=[\"feature_catalog/03--discovery\",\"feature_catalog/04--maintenance\",\"feature_catalog/05--lifecycle\"]; const files=dirs.flatMap(d=>fs.readdirSync(path.join(base,d)).filter(f=>f.endsWith(\".md\")).map(f=>path.join(base,d,f))).sort(); for(const f of files){ const text=fs.readFileSync(f,\"utf8\"); const paths=[...text.matchAll(/"'`([''^`]+)`/g)].map(m=>m[1]).filter(p=>p.includes("/") && (p.startsWith("mcp_server/") || p.startsWith("shared/"))); const invalid=paths.filter(p=>!fs.existsSync(path.join(base,p))); console.log(path.basename(f)+"|"+invalid.length+"|"+(invalid.join(",")||"NONE")); }'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
01-memory-browser-memorylist.md|1|mcp_server/tests/retry.vitest.ts
02-system-statistics-memorystats.md|1|mcp_server/tests/retry.vitest.ts
03-health-diagnostics-memoryhealth.md|1|mcp_server/tests/retry.vitest.ts
01-workspace-scanning-and-indexing-memoryindexscan.md|1|mcp_server/tests/retry.vitest.ts
02-startup-runtime-compatibility-guards.md|0|NONE
01-checkpoint-creation-checkpointcreate.md|1|mcp_server/tests/retry.vitest.ts
02-checkpoint-listing-checkpointlist.md|1|mcp_server/tests/retry.vitest.ts
03-checkpoint-restore-checkpointrestore.md|1|mcp_server/tests/retry.vitest.ts
04-checkpoint-deletion-checkpointdelete.md|1|mcp_server/tests/retry.vitest.ts
05-async-ingestion-job-lifecycle.md|1|mcp_server/tests/retry.vitest.ts
06-startup-pending-file-recovery.md|0|NONE
07-automatic-archival-subsystem.md|0|NONE
exec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,340p' .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Archival Manager
// ---------------------------------------------------------------
// Background archival job for dormant/archived memories
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. DEPENDENCIES (lazy-loaded)
----------------------------------------------------------------*/

// AI-WHY: Lazy-load tier-classifier to avoid circular dependencies
let tierClassifierModule: Record<string, unknown> | null = null;

function getTierClassifier(): Record<string, unknown> | null {
  if (tierClassifierModule !== null) return tierClassifierModule;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    tierClassifierModule = require('./tier-classifier');
 succeeded in 52ms:
// ---------------------------------------------------------------
// TEST: ARCHIVAL MANAGER
// ---------------------------------------------------------------

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import * as archivalManager from '../lib/cache/cognitive/archival-manager';
import Database from 'better-sqlite3';

/* ─────────────────────────────────────────────────────────────
   TEST SETUP
──────────────────────────────────────────────────────────────── */

type TestDatabase = Database.Database;
type TestMemoryInput = {
  spec_folder?: string;
  file_path?: string;
  title?: string;
  importance_tier?: string;
  created_at?: string;
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Access Tracker
// ---------------------------------------------------------------
// Batched access tracking with accumulator
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const ACCUMULATOR_THRESHOLD = 0.5;
const INCREMENT_VALUE = 0.1;
// AI-TRACE: P4-14 FIX: Cap accumulator Map size to prevent unbounded memory growth
const MAX_ACCUMULATOR_SIZE = 10000;

/* -------------------------------------------------------------
   2. INTERFACES
----------------------------------------------------------------*/
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Job Queue
// ---------------------------------------------------------------
// Sprint 9 fixes: true sequential worker, meaningful state transitions,
// continue-on-error for bulk ingestion, SQLITE_BUSY async retry on DB writes,
// crash recovery with re-enqueue, and original-path progress tracking.

import { requireDb, toErrorMessage } from '../../utils';

/**
 * Defines the IngestJobState type.
 */
export type IngestJobState =
  | 'queued'
  | 'parsing'
  | 'embedding'
  | 'indexing'
  | 'complete'
  | 'failed'
  | 'cancelled';
exec
/bin/zsh -lc 'ls -ld .opencode/skill/system-spec-kit/mcp_server/lib/cache .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive .opencode/skill/system-spec-kit/mcp_server/lib/cognitive' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "is_archived|archived_at|removeDocument|delete.*vector|exclude.*archived|archival" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts .opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
drwxr-xr-x@  7 michelkerkmeester  staff  224 Mar  8 15:37 .opencode/skill/system-spec-kit/mcp_server/lib/cache
lrwxr-xr-x@  1 michelkerkmeester  staff   12 Feb 16 19:41 .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive -> ../cognitive
drwxr-xr-x@ 13 michelkerkmeester  staff  416 Mar  8 15:34 .opencode/skill/system-spec-kit/mcp_server/lib/cognitive
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:78:  const archivalFilter = !includeArchived
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:79:    ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)'
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:95:      ${archivalFilter}
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:5:// Converted from: t206-search-archival.test.ts (custom runner)
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:66:describe('T206 - Source code contains is_archived filter', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:67:  it('T206-SRC1: vector-index-queries.ts has is_archived filters (>= 3)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:72:    const vsFilterCount = (viSource.match(/is_archived IS NULL OR.*is_archived\s*=\s*0/g) || []).length;
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:76:  it('T206-SRC2: multi_concept_search uses archival_filter', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:81:    expect(viSource).toContain('archival_filter');
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:82:    expect(viSource).toContain('${archival_filter}');
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:85:  it('T206-SRC3: hybrid-search has is_archived filter in ftsSearch', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:99:    expect(hsSource).toContain('is_archived');
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:125:    expect(viSource).toContain('is_archived IS NULL OR is_archived = 0');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:4:// Background archival job for dormant/archived memories
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:30:    removeDocument: (id: string) => boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:113:const archivalStats: ArchivalStats = {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:137:    const hasArchived = columns.some(c => c.name === 'is_archived');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:140:      db.exec('ALTER TABLE memory_index ADD COLUMN is_archived INTEGER DEFAULT 0');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:141:      db.exec('CREATE INDEX IF NOT EXISTS idx_archived ON memory_index(is_archived)');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:142:      console.error('[archival-manager] Added is_archived column');
exec
/bin/zsh -lc "sed -n '341,620p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '341,620p' .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,340p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    errors = [truncationNotice, ...truncatedTail];
  }

  const updatedAt = nowIso();
  await withBusyRetry(() =>
    db.prepare(`
      UPDATE ingest_jobs
      SET errors_json = ?, updated_at = ?
      WHERE id = ?
    `).run(JSON.stringify(errors), updatedAt, jobId)
  );

  return {
    ...current,
    errors,
    updatedAt,
  };
}

async function cancelIngestJob(jobId: string): Promise<IngestJob> {
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Checkpoints
// ---------------------------------------------------------------
// Gzip-compressed database checkpoints with embedding preservation
// ---------------------------------------------------------------

// Node stdlib
import * as zlib from 'zlib';

// External packages
import type Database from 'better-sqlite3';

// Internal utils
import { toErrorMessage } from '../../utils/db-helpers';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const MAX_CHECKPOINTS = 10;
 succeeded in 52ms:

/**
 * Validates a single memory row from a checkpoint snapshot.
 * Throws on invalid data — caller should reject the entire restore.
 *
 * Strict on identity fields (id, file_path, spec_folder).
 * Required-but-lenient on INSERT-needed fields (must be present, type flexible).
 * Optional fields (anchor_id, embedding_*, etc.) may be null/undefined for
 * backwards compatibility with older checkpoint formats.
 */
function validateMemoryRow(row: unknown, index: number): void {
  if (!row || typeof row !== 'object') {
    throw new Error(`Checkpoint row ${index}: not an object (got ${typeof row})`);
  }
  const r = row as Record<string, unknown>;

  // --- Strict identity fields (core to INSERT and data integrity) ---
  if (typeof r.id !== 'number' || !Number.isFinite(r.id)) {
    throw new Error(`Checkpoint row ${index}: id must be a finite number, got ${typeof r.id} (${String(r.id)})`);
  }
exec
/bin/zsh -lc "sed -n '621,980p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
      return result;
    }

    // AI-GUARD: P0-005 FIX: Split INSERT strategy by restore mode.
    // clearExisting mode: INSERT OR REPLACE is safe (table was already emptied).
    // merge mode: INSERT OR REPLACE triggers CASCADE DELETE on working_memory
    // via the FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE CASCADE.
    // Use INSERT OR IGNORE + explicit UPDATE to avoid the delete-reinsert cycle.
    const memoryInsertStmt = memoryRestoreColumns.length > 0
      ? database.prepare(`
          INSERT OR ${clearExisting ? 'REPLACE' : 'IGNORE'} INTO memory_index (${memoryRestoreColumns.join(', ')})
          VALUES (${memoryRestoreColumns.map(() => '?').join(', ')})
        `) as Database.Statement
      : null;

    const nonIdColumns = memoryRestoreColumns.filter(c => c !== 'id');
    const memoryUpdateStmt = (!clearExisting && nonIdColumns.length > 0)
      ? database.prepare(`
          UPDATE memory_index SET ${nonIdColumns.map(c => `${c} = ?`).join(', ')}
          WHERE id = ?
exec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Memory Bulk Delete
// ---------------------------------------------------------------
// Tier-based bulk deletion of memories with safety gates.
// Eliminates the need for direct DB scripts when cleaning up
// deprecated/temporary memories at scale.
// ---------------------------------------------------------------

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as checkpoints from '../lib/storage/checkpoints';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import * as causalEdges from '../lib/storage/causal-edges';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { appendMutationLedgerSafe } from './memory-crud-utils';
import { runPostMutationHooks } from './mutation-hooks';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback';

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '150,460p' .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "asyncEmbedding|async embedding|async_embedding" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Tool Input Schemas
// ---------------------------------------------------------------
// Centralized strict Zod validation schemas for MCP tool inputs.
// Strict mode is controlled by SPECKIT_STRICT_SCHEMAS (default: true).
// ---------------------------------------------------------------

import { z, ZodError, type ZodType } from 'zod';

type ToolInput = Record<string, unknown>;
type ToolInputSchema = ZodType<ToolInput>;

export const getSchema = <T extends z.ZodRawShape>(shape: T): z.ZodObject<T> => {
  const strict = process.env.SPECKIT_STRICT_SCHEMAS !== 'false';
  const base = z.object(shape);
  return strict ? base.strict() : base.passthrough();
};

// Sprint 9 fix: safeNumericPreprocess.pipe(z.number()) silently coerces "", null, false → 0.
// Use a safe preprocessor that only accepts actual numbers or numeric strings.
 succeeded in 51ms:
        enum: ['auto', 'deep'],
        default: 'auto',
        description: 'Search mode. "auto" uses standard retrieval. "deep" enables multi-query expansion for broader recall.'
      },
      includeTrace: {
        type: 'boolean',
        default: false,
        description: 'When true (or when SPECKIT_RESPONSE_TRACE=true), include provenance-rich scores/source/trace envelope fields in each result.'
      }
    }
  },
};

const memoryMatchTriggers: ToolDefinition = {
  name: 'memory_match_triggers',
  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 1500.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', description: 'User prompt or text to match against trigger phrases' }, limit: { type: 'number', default: 3, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
};

// T306: Added asyncEmbedding parameter for non-blocking embedding generation
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:169:// T306: Added asyncEmbedding parameter for non-blocking embedding generation
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:173:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:142:  asyncEmbedding: z.boolean().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:357:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:108:async function indexMemoryFile(filePath: string, { force = false, parsedOverride = null as ReturnType<typeof memoryParser.parseMemoryFile> | null, asyncEmbedding = false } = {}): Promise<IndexResult> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:183:  const embeddingResult = await generateOrCacheEmbedding(database, parsed, filePath, asyncEmbedding);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:271:    asyncEmbedding,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:287:  const { filePath: file_path, force = false, dryRun = false, skipPreflight = false, asyncEmbedding = false } = args;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:384:  const result = await indexMemoryFile(validatedPath, { force, parsedOverride: parsedForPreflight, asyncEmbedding });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:386:  return buildSaveResponse({ result, filePath: file_path, asyncEmbedding, requestId });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:396: * `indexMemoryFile` requires async embedding generation while
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:430:    indexResult = await indexMemoryFile(file_path, { force, asyncEmbedding: true });
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:52:  asyncEmbedding: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:60:  asyncEmbedding: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:74:  asyncEmbedding,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:147:  if (asyncEmbedding && embeddingStatus === 'pending') {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:153:        console.warn(`[memory-save] T306: Immediate async embedding attempt failed for #${memoryId}: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:173:export function buildSaveResponse({ result, filePath, asyncEmbedding, requestId }: BuildSaveResponseParams): MCPResponse {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:272:    if (asyncEmbedding) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:97:  asyncEmbedding?: boolean; // AI-TRACE:T306: When true, embedding generation is deferred (non-blocking)
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/cli.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Cli
// ---------------------------------------------------------------
// Standalone CLI for bulk database operations, runnable from any
// directory. Resolves its own modules via __dirname so
// better-sqlite3 and sqlite-vec load correctly regardless of cwd.
//
// Usage:
//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js stats
//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js bulk-delete --tier deprecated
//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js reindex [--force] [--eager-warmup]
//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js schema-downgrade --to 15 --confirm
// ---------------------------------------------------------------

// Core modules (resolved relative to this file's location)
import * as vectorIndex from './lib/search/vector-index';
import * as checkpointsLib from './lib/storage/checkpoints';
import * as accessTracker from './lib/storage/access-tracker';
import * as causalEdges from './lib/storage/causal-edges';
exec
/bin/zsh -lc "rg -n \"detectNodeVersionMismatch\\(|checkSqliteVersion\\(\" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/cli.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/cli.ts:460:  detectNodeVersionMismatch();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:690:  detectNodeVersionMismatch();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:831:    checkSqliteVersion(database);
exec
/bin/zsh -lc "sed -n '672,845p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
  });
  runCleanupStep('vectorIndex', () => vectorIndex.closeDb());
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('[context-server] Unhandled rejection at:', promise, 'reason:', reason);
  // P1-10 FIX: Exit after flush to avoid running in undefined state
  // AI-WHY: Short delay allows pending stderr writes to flush before exit
  setTimeout(() => process.exit(1), EXIT_FLUSH_DELAY_MS);
});

/* ---------------------------------------------------------------
   8. MAIN
--------------------------------------------------------------- */

async function main(): Promise<void> {
  // Node version mismatch detection (non-blocking)
  detectNodeVersionMismatch();

exec
/bin/zsh -lc 'rg -n "startup-checks|detectNodeVersionMismatch|checkSqliteVersion" .opencode/skill/system-spec-kit/mcp_server/tests .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:59:import { detectNodeVersionMismatch, checkSqliteVersion } from './startup-checks';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:690:  detectNodeVersionMismatch();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:831:    checkSqliteVersion(database);
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:66:    'startup-checks.js',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:19:const STARTUP_CHECKS_FILE = path.join(SERVER_DIR, 'startup-checks.ts')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:338:      '../startup-checks',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:461:      vi.doMock('../startup-checks', () => ({ detectNodeVersionMismatch: vi.fn() }))
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1425:    // T53: detectNodeVersionMismatch called
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1426:    it('T53: detectNodeVersionMismatch() called at startup', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1427:      expect(sourceCode).toMatch(/detectNodeVersionMismatch\(\)/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1579:      { module: './startup-checks', name: 'Startup checks (T303)' },
.opencode/skill/system-spec-kit/mcp_server/README.md:610:├── startup-checks.ts       # Startup validation
.opencode/skill/system-spec-kit/mcp_server/cli.ts:25:import { detectNodeVersionMismatch } from './startup-checks';
.opencode/skill/system-spec-kit/mcp_server/cli.ts:460:  detectNodeVersionMismatch();
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:23:export function detectNodeVersionMismatch(): void {
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:70:export function checkSqliteVersion(db: { prepare: (sql: string) => { get: () => unknown } }): void {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:19:const STARTUP_CHECKS_FILE = path.join(SERVER_DIR, 'startup-checks.ts')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:338:      '../startup-checks',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:461:      vi.doMock('../startup-checks', () => ({ detectNodeVersionMismatch: vi.fn() }))
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1425:    // T53: detectNodeVersionMismatch called
exec
/bin/zsh -lc 'rg -n "recoverPendingFiles|Pending file recovery|recoverAllPendingFiles|Atomicity metrics|Checking for pending memory files" .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:18:  recoverAllPendingFiles,
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:183:    const results = recoverAllPendingFiles(TEST_DIR!);
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:364:    const results = recoverAllPendingFiles(TEST_DIR!);
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:508:        recoverAllPendingFiles: vi.fn(() => []),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1542:    // T63: recoverPendingFiles function exists
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1543:    it('T63: recoverPendingFiles() defined', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1544:      expect(sourceCode).toMatch(/async\s+function\s+recoverPendingFiles/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1548:    it('T64: recoverPendingFiles called in startupScan', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1549:      expect(sourceCode).toMatch(/await\s+recoverPendingFiles\(basePath\)/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1559:    it('T66: Pending file recovery errors caught', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1560:      const recoveryCatch = /recoverPendingFiles[\s\S]*?catch\s*\(error/
exec
/bin/zsh -lc 'rg -n "memory_list|memory_stats|memory_health|handleMemoryList|handleMemoryStats|handleMemoryHealth" .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:414:    it('should invalidate memory_list_folders on write', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:415:      const listFoldersKey = generateCacheKey('memory_list_folders', {});
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:416:      set(listFoldersKey, ['folder1', 'folder2'], { toolName: 'memory_list_folders' });
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:47:    tool: 'memory_list',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:48:    handler: 'handleMemoryList',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:53:    tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:54:    handler: 'handleMemoryStats',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:59:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:60:    handler: 'handleMemoryHealth',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:105:      const { result, skipped } = await callHandlerSafe('handleMemoryHealth', {});
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:131:      const { result, skipped } = await callHandlerSafe('handleMemoryHealth', {});
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:139:      const { result, skipped } = await callHandlerSafe('handleMemoryHealth', {});
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:147:      const { result, skipped } = await callHandlerSafe('handleMemoryHealth', {});
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:155:      const { result, skipped } = await callHandlerSafe('handleMemoryHealth', {});
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:170:        name: 'memory_health returns response with correct structure',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:171:        handler: 'handleMemoryHealth',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:176:        name: 'memory_stats returns response with correct structure',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:177:        handler: 'handleMemoryStats',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:194:        name: 'memory_list returns response with correct structure',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:195:        handler: 'handleMemoryList',
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"), path=require(\"path\"); const base=path.resolve(\".opencode/skill/system-spec-kit/feature_catalog\"); const checks={\"01-memory-browser-memorylist.md\":[\"mcp_server/tool-schemas.ts\",\"mcp_server/schemas/tool-input-schemas.ts\",\"mcp_server/tools/memory-tools.ts\",\"mcp_server/handlers/index.ts\",\"mcp_server/tests/handler-memory-crud.vitest.ts\",\"mcp_server/tests/mcp-input-validation.vitest.ts\",\"mcp_server/tests/mcp-response-envelope.vitest.ts\"],\"02-system-statistics-memorystats.md\":[\"mcp_server/tool-schemas.ts\",\"mcp_server/schemas/tool-input-schemas.ts\",\"mcp_server/tools/memory-tools.ts\",\"mcp_server/handlers/index.ts\",\"mcp_server/lib/scoring/folder-scoring.ts\",\"mcp_server/lib/search/hybrid-search.ts\",\"mcp_server/tests/handler-memory-crud.vitest.ts\",\"mcp_server/tests/mcp-input-validation.vitest.ts\"],\"03-health-diagnostics-memoryhealth.md\":[\"mcp_server/tool-schemas.ts\",\"mcp_server/schemas/tool-input-schemas.ts\",\"mcp_server/tools/memory-tools.ts\",\"mcp_server/handlers/index.ts\",\"mcp_server/handlers/memory-index-alias.ts\",\"mcp_server/tests/handler-memory-crud.vitest.ts\",\"mcp_server/tests/mcp-input-validation.vitest.ts\"],\"01-workspace-scanning-and-indexing-memoryindexscan.md\":[\"mcp_server/tool-schemas.ts\",\"mcp_server/schemas/tool-input-schemas.ts\",\"mcp_server/tools/lifecycle-tools.ts\",\"mcp_server/handlers/index.ts\",\"mcp_server/handlers/memory-index-discovery.ts\",\"mcp_server/handlers/memory-index-alias.ts\",\"mcp_server/lib/storage/incremental-index.ts\",\"mcp_server/lib/utils/canonical-path.ts\",\"mcp_server/tests/handler-memory-index.vitest.ts\",\"mcp_server/tests/handler-memory-index-cooldown.vitest.ts\"],\"02-startup-runtime-compatibility-guards.md\":[\"mcp_server/startup-checks.ts\",\"mcp_server/context-server.ts\",\"mcp_server/cli.ts\",\"mcp_server/tests/context-server.vitest.ts\",\"mcp_server/tests/modularization.vitest.ts\"],\"01-checkpoint-creation-checkpointcreate.md\":[\"mcp_server/tool-schemas.ts\",\"mcp_server/schemas/tool-input-schemas.ts\",\"mcp_server/tools/checkpoint-tools.ts\",\"mcp_server/handlers/index.ts\",\"mcp_server/lib/storage/checkpoints.ts\",\"mcp_server/handlers/memory-bulk-delete.ts\",\"mcp_server/tests/handler-checkpoints.vitest.ts\",\"mcp_server/tests/checkpoint-limit.vitest.ts\"],\"02-checkpoint-listing-checkpointlist.md\":[\"mcp_server/tool-schemas.ts\",\"mcp_server/schemas/tool-input-schemas.ts\",\"mcp_server/tools/checkpoint-tools.ts\",\"mcp_server/handlers/index.ts\",\"mcp_server/lib/storage/checkpoints.ts\",\"mcp_server/tests/handler-checkpoints.vitest.ts\",\"mcp_server/tests/checkpoints-storage.vitest.ts\"],\"03-checkpoint-restore-checkpointrestore.md\":[\"mcp_server/tool-schemas.ts\",\"mcp_server/schemas/tool-input-schemas.ts\",\"mcp_server/tools/checkpoint-tools.ts\",\"mcp_server/handlers/index.ts\",\"mcp_server/lib/storage/checkpoints.ts\",\"mcp_server/tests/handler-checkpoints.vitest.ts\",\"mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts\"],\"04-checkpoint-deletion-checkpointdelete.md\":[\"mcp_server/tool-schemas.ts\",\"mcp_server/schemas/tool-input-schemas.ts\",\"mcp_server/tools/checkpoint-tools.ts\",\"mcp_server/handlers/index.ts\",\"mcp_server/lib/storage/checkpoints.ts\",\"mcp_server/tests/handler-checkpoints.vitest.ts\"],\"05-async-ingestion-job-lifecycle.md\":[\"mcp_server/tool-schemas.ts\",\"mcp_server/schemas/tool-input-schemas.ts\",\"mcp_server/tools/lifecycle-tools.ts\",\"mcp_server/handlers/index.ts\",\"mcp_server/lib/ops/job-queue.ts\",\"mcp_server/handlers/memory-save.ts\",\"mcp_server/tests/handler-memory-ingest.vitest.ts\",\"mcp_server/tests/job-queue.vitest.ts\",\"mcp_server/tests/review-fixes.vitest.ts\"],\"06-startup-pending-file-recovery.md\":[\"mcp_server/lib/storage/transaction-manager.ts\",\"mcp_server/context-server.ts\",\"mcp_server/tests/transaction-manager.vitest.ts\",\"mcp_server/tests/context-server.vitest.ts\"],\"07-automatic-archival-subsystem.md\":[\"mcp_server/lib/cognitive/archival-manager.ts\",\"mcp_server/lib/storage/access-tracker.ts\",\"mcp_server/lib/search/vector-index-queries.ts\",\"mcp_server/lib/search/sqlite-fts.ts\",\"mcp_server/tests/archival-manager.vitest.ts\",\"mcp_server/tests/search-archival.vitest.ts\",\"mcp_server/context-server.ts\"]}; for(const [file,cands] of Object.entries(checks)){ let full; for(const dir of [\"03--discovery\",\"04--maintenance\",\"05--lifecycle\"]){ const p=path.join(base,dir,file); if(fs.existsSync(p)){ full=p; break; } } const text=fs.readFileSync(full,\"utf8\"); const listed=new Set([...text.matchAll(/"'`([''^`]+)`/g)].map(m=>m[1])); const missing=cands.filter(c=>!listed.has(c)); console.log(file+"|"+(missing.join(",")||"NONE")); }'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
01-memory-browser-memorylist.md|mcp_server/tools/memory-tools.ts,mcp_server/handlers/index.ts,mcp_server/tests/mcp-input-validation.vitest.ts
02-system-statistics-memorystats.md|mcp_server/tools/memory-tools.ts,mcp_server/handlers/index.ts,mcp_server/tests/mcp-input-validation.vitest.ts
03-health-diagnostics-memoryhealth.md|mcp_server/tools/memory-tools.ts,mcp_server/handlers/index.ts,mcp_server/tests/mcp-input-validation.vitest.ts
01-workspace-scanning-and-indexing-memoryindexscan.md|mcp_server/tools/lifecycle-tools.ts,mcp_server/handlers/index.ts
02-startup-runtime-compatibility-guards.md|NONE
01-checkpoint-creation-checkpointcreate.md|mcp_server/tools/checkpoint-tools.ts,mcp_server/handlers/index.ts,mcp_server/handlers/memory-bulk-delete.ts,mcp_server/tests/checkpoint-limit.vitest.ts
02-checkpoint-listing-checkpointlist.md|mcp_server/tools/checkpoint-tools.ts,mcp_server/handlers/index.ts
03-checkpoint-restore-checkpointrestore.md|mcp_server/tools/checkpoint-tools.ts,mcp_server/handlers/index.ts,mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts
04-checkpoint-deletion-checkpointdelete.md|mcp_server/tools/checkpoint-tools.ts,mcp_server/handlers/index.ts
05-async-ingestion-job-lifecycle.md|mcp_server/tools/lifecycle-tools.ts,mcp_server/handlers/index.ts,mcp_server/handlers/memory-save.ts,mcp_server/tests/review-fixes.vitest.ts
06-startup-pending-file-recovery.md|mcp_server/tests/context-server.vitest.ts
07-automatic-archival-subsystem.md|mcp_server/context-server.ts
exec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/folder-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Folder Scoring
// ---------------------------------------------------------------
// SCORING: FOLDER SCORING BARREL
// ---------------------------------------------------------------

export * from '@spec-kit/shared/scoring/folder-scoring';
exec
/bin/zsh -lc "sed -n '1,340p' .opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Folder Scoring
// ---------------------------------------------------------------
// Canonical location (moved from mcp_server/lib/scoring/folder-scoring.js)

import type {
  ArchivePattern,
  FolderScore,
  FolderScoreOptions,
  Memory,
  ScoreWeights,
  TierWeights,
} from '../types';

/**
 * Loose input type for folder-scoring functions.
 * Accepts any partial Memory (camelCase) plus arbitrary extra fields
 * (snake_case DB columns, search-enriched properties, etc.).
 */
export type FolderMemoryInput = Partial<Memory> & Record<string, unknown>;
exec
/bin/zsh -lc "sed -n '260,340p' .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
      restored: result
    },
    hints: clear_existing
      ? ['Previous data was cleared before restore', 'Search indexes rebuilt']
      : ['Restore merged with existing data - duplicates may exist', 'Search indexes rebuilt'],
    startTime: startTime
  });
}

/* ---------------------------------------------------------------
   6. CHECKPOINT DELETE HANDLER
--------------------------------------------------------------- */

/** Handle checkpoint_delete tool - permanently removes a named checkpoint */
async function handleCheckpointDelete(args: CheckpointDeleteArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const { name, confirmName } = args;

  if (!name || typeof name !== 'string') {
exec
/bin/zsh -lc "sed -n '330,520p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
  if (!db) return { isArchived: false, shouldArchive: false };

  try {
    const memory = (db.prepare(
      'SELECT * FROM memory_index WHERE id = ?'
    ) as Database.Statement).get(memoryId) as Record<string, unknown> | undefined;

    if (!memory) return { isArchived: false, shouldArchive: false };

    const isArchived = (memory.is_archived as number) === 1;

    // Check with tier classifier if available
    const classifier = getTierClassifier();
    let shouldArchive = false;
    if (classifier && typeof classifier.shouldArchive === 'function') {
      shouldArchive = classifier.shouldArchive(memory) as boolean;
    }

    return { isArchived, shouldArchive };
  } catch (error: unknown) {
exec
/bin/zsh -lc "sed -n '520,620p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
  const result = archiveBatch(candidates.map(c => c.id));

  // Persist updated stats (P5-06)
  saveArchivalStats();

  console.error(
    `[archival-manager] Scan complete: ${candidates.length} candidates, ${result.archived} archived`
  );

  return { scanned: candidates.length, archived: result.archived };
}

function startBackgroundJob(intervalMs: number = ARCHIVAL_CONFIG.backgroundJobIntervalMs): void {
  if (backgroundJob) {
    clearInterval(backgroundJob);
  }

  backgroundJob = setInterval(() => {
    try {
      runArchivalScan();
exec
/bin/zsh -lc "rg -n \"startBackgroundJob\\(|archivalManager\\.\" .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
579:  runCleanupStep('archivalManager', () => archivalManager.cleanup());
660:  runCleanupStep('archivalManager', () => archivalManager.cleanup());
889:      archivalManager.init(database);
891:      archivalManager.startBackgroundJob();
892:      if (archivalManager.isBackgroundJobRunning()) {
905:      const retryJobResult = retryManager.startBackgroundJob({
exec
/bin/zsh -lc 'rg -n "initIngestJobQueue|memory-ingest|processFile" .opencode/skill/system-spec-kit/mcp_server/context-server.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
97:import { initIngestJobQueue } from './lib/ops/job-queue';
946:      const ingestInit = initIngestJobQueue({
947:        processFile: async (filePath: string) => {
exec
/bin/zsh -lc "sed -n '934,962p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
          }
        }
      } else {
        console.warn('[context-server] Session manager initialization returned:', sessionResult.error);
      }
    } catch (sessionErr: unknown) {
      const message = sessionErr instanceof Error ? sessionErr.message : String(sessionErr);
      console.warn('[context-server] Session manager failed:', message);
    }

    // P0-3: Async ingestion job queue initialization + crash recovery reset.
    try {
      const ingestInit = initIngestJobQueue({
        processFile: async (filePath: string) => {
          await indexMemoryFile(filePath, { asyncEmbedding: true });
        },
      });
      if (ingestInit.resetCount > 0) {
        console.error(`[context-server] Ingest crash recovery reset ${ingestInit.resetCount} incomplete job(s) to queued`);
      }
exec
/bin/zsh -lc 'rg -n "is_archived|includeArchived|archival_filter" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
69:  includeArchived?: boolean;
325: * @param options - Optional limit, specFolder filter, and includeArchived flag.
330:  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
334:  const { limit = DEFAULT_LIMIT, specFolder, includeArchived = false } = options;
340:    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
341:    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
361: * @param options - Optional limit, specFolder filter, and includeArchived flag.
366:  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
413:    includeArchived = false,
426:        includeArchived,
444:    const ftsResults = ftsSearch(query, { limit, specFolder, includeArchived });
594:          includeArchived: options.includeArchived || false,
codex
---
FEATURE: 01-memory-browser-memorylist.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/memory-tools.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Core listing behavior matches `handlers/memory-crud-list.ts`, but the description implies you can inspect tier in this tool; the handler returns `importanceWeight` but not `importanceTier`. Source list also omits the tool-dispatch file and includes one stale test path.
---

---
FEATURE: 02-system-statistics-memorystats.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/memory-tools.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: `memory_stats` exists and returns the dashboard described, but ranking details are overstated: `importance` sorting uses computed importance score, not simply highest tier present, and `validationScore` is currently a fixed placeholder from shared folder scoring. Source list also misses the tool-dispatch file and includes a stale test path.
---

---
FEATURE: 03-health-diagnostics-memoryhealth.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/memory-tools.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Health checks, FTS mismatch detection, alias reports, and divergent alias mode are implemented, but overall `status` only becomes `degraded` when the embedding model or DB is unavailable; FTS mismatch and alias conflicts are surfaced via hints, not status. Source list also omits the tool-dispatch file and includes a stale test path.
---

---
FEATURE: 01-workspace-scanning-and-indexing-memoryindexscan.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/lifecycle-tools.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The scan/index behavior matches `handlers/memory-index.ts`, `memory-index-discovery.ts`, alias reconciliation, incremental indexing, and mtime safety logic. The main issues are a stale listed test path and an omitted lifecycle tool-dispatch file.
---

---
FEATURE: 02-startup-runtime-compatibility-guards.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: `startup-checks.ts` does perform Node ABI mismatch checks and is used by `context-server.ts` and `cli.ts`, but the marker is created on first runtime if missing, not strictly at build time, and the module also contains a SQLite version compatibility check that the description omits.
---

---
FEATURE: 01-checkpoint-creation-checkpointcreate.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/checkpoint-tools.ts, mcp_server/handlers/memory-bulk-delete.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Checkpoint creation really does gzip snapshot state, enforce a max of 10 retained checkpoints, include metadata/git branch, and preserve vectors for restore. The source list misses the checkpoint tool-dispatch layer and the bulk-delete handler referenced in the description, and it includes one stale test path.
---

---
FEATURE: 02-checkpoint-listing-checkpointlist.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/checkpoint-tools.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The handler returns newest-first limited checkpoint metadata and supports `specFolder` filtering, but it is not truly paginated because there is no offset/page cursor support. The source list also omits the checkpoint tool-dispatch file and includes a stale test path.
---

---
FEATURE: 03-checkpoint-restore-checkpointrestore.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/checkpoint-tools.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Restore behavior matches the code: gzip decompression, row validation, atomic `clearExisting` transaction behavior, logical-key duplicate skipping in merge mode, vector restore, cache clears, BM25 rebuild, and trigger refresh. The main issue is incomplete/stale path coverage.
---

---
FEATURE: 04-checkpoint-deletion-checkpointdelete.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/checkpoint-tools.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The delete flow matches the handler and storage code, including the `confirmName` safety gate and boolean success result. The path list is the problem here, not the behavior description.
---

---
FEATURE: 05-async-ingestion-job-lifecycle.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/lifecycle-tools.ts, mcp_server/handlers/memory-save.ts, mcp_server/context-server.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The job queue is SQLite-backed, stateful, sequential, and exposed through the three ingest tools exactly as described. The snippet misses important wiring files: `memory-save.ts` for the `asyncEmbedding` coexistence claim, `context-server.ts` for queue initialization/crash recovery, and the lifecycle tool dispatcher.
---

---
FEATURE: 06-startup-pending-file-recovery.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: HIGH
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: Startup recovery is real and `transaction-manager.ts` increments `totalRecoveries`, but the stale-file behavior in the description is wrong. The code does not inspect DB commit state and leave stale pending files for manual review; it attempts to rename pending files back to the original path, and deletes the pending file only when the original file already exists and is newer.
---

---
FEATURE: 07-automatic-archival-subsystem.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/context-server.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: Automatic archival exists and does run as a background job, but the description overstates what it does. The current code marks memories with `is_archived`, syncs BM25 removal/re-addition, and excludes archived memories from default search paths; it does not demote tiers or remove vector embeddings. The source list also omits `context-server.ts`, which starts and stops the archival background job.
---
tokens used
178,168
---
FEATURE: 01-memory-browser-memorylist.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/memory-tools.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Core listing behavior matches `handlers/memory-crud-list.ts`, but the description implies you can inspect tier in this tool; the handler returns `importanceWeight` but not `importanceTier`. Source list also omits the tool-dispatch file and includes one stale test path.
---

---
FEATURE: 02-system-statistics-memorystats.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/memory-tools.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: `memory_stats` exists and returns the dashboard described, but ranking details are overstated: `importance` sorting uses computed importance score, not simply highest tier present, and `validationScore` is currently a fixed placeholder from shared folder scoring. Source list also misses the tool-dispatch file and includes a stale test path.
---

---
FEATURE: 03-health-diagnostics-memoryhealth.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/memory-tools.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Health checks, FTS mismatch detection, alias reports, and divergent alias mode are implemented, but overall `status` only becomes `degraded` when the embedding model or DB is unavailable; FTS mismatch and alias conflicts are surfaced via hints, not status. Source list also omits the tool-dispatch file and includes a stale test path.
---

---
FEATURE: 01-workspace-scanning-and-indexing-memoryindexscan.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/lifecycle-tools.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The scan/index behavior matches `handlers/memory-index.ts`, `memory-index-discovery.ts`, alias reconciliation, incremental indexing, and mtime safety logic. The main issues are a stale listed test path and an omitted lifecycle tool-dispatch file.
---

---
FEATURE: 02-startup-runtime-compatibility-guards.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: `startup-checks.ts` does perform Node ABI mismatch checks and is used by `context-server.ts` and `cli.ts`, but the marker is created on first runtime if missing, not strictly at build time, and the module also contains a SQLite version compatibility check that the description omits.
---

---
FEATURE: 01-checkpoint-creation-checkpointcreate.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/checkpoint-tools.ts, mcp_server/handlers/memory-bulk-delete.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Checkpoint creation really does gzip snapshot state, enforce a max of 10 retained checkpoints, include metadata/git branch, and preserve vectors for restore. The source list misses the checkpoint tool-dispatch layer and the bulk-delete handler referenced in the description, and it includes one stale test path.
---

---
FEATURE: 02-checkpoint-listing-checkpointlist.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/checkpoint-tools.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The handler returns newest-first limited checkpoint metadata and supports `specFolder` filtering, but it is not truly paginated because there is no offset/page cursor support. The source list also omits the checkpoint tool-dispatch file and includes a stale test path.
---

---
FEATURE: 03-checkpoint-restore-checkpointrestore.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/checkpoint-tools.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Restore behavior matches the code: gzip decompression, row validation, atomic `clearExisting` transaction behavior, logical-key duplicate skipping in merge mode, vector restore, cache clears, BM25 rebuild, and trigger refresh. The main issue is incomplete/stale path coverage.
---

---
FEATURE: 04-checkpoint-deletion-checkpointdelete.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/checkpoint-tools.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The delete flow matches the handler and storage code, including the `confirmName` safety gate and boolean success result. The path list is the problem here, not the behavior description.
---

---
FEATURE: 05-async-ingestion-job-lifecycle.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/lifecycle-tools.ts, mcp_server/handlers/memory-save.ts, mcp_server/context-server.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The job queue is SQLite-backed, stateful, sequential, and exposed through the three ingest tools exactly as described. The snippet misses important wiring files: `memory-save.ts` for the `asyncEmbedding` coexistence claim, `context-server.ts` for queue initialization/crash recovery, and the lifecycle tool dispatcher.
---

---
FEATURE: 06-startup-pending-file-recovery.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: HIGH
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: Startup recovery is real and `transaction-manager.ts` increments `totalRecoveries`, but the stale-file behavior in the description is wrong. The code does not inspect DB commit state and leave stale pending files for manual review; it attempts to rename pending files back to the original path, and deletes the pending file only when the original file already exists and is newer.
---

---
FEATURE: 07-automatic-archival-subsystem.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/context-server.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: Automatic archival exists and does run as a background job, but the description overstates what it does. The current code marks memories with `is_archived`, syncs BM25 removal/re-addition, and excludes archived memories from default search paths; it does not demote tiers or remove vector embeddings. The source list also omits `context-server.ts`, which starts and stops the archival background job.
---
