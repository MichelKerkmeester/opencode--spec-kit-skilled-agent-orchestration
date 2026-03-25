OpenAI Codex v0.116.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d23db-1446-7711-8242-6e6f867c7d96
--------
user
You are a code review agent. Review the codebase for MAINTAINABILITY issues.

CONTEXT: Spec Kit Memory MCP server (Node.js/CommonJS). Check code patterns, documentation quality, and change safety.

SCOPE: Read key files across .opencode/skill/system-spec-kit/mcp_server/, scripts/dist/, and shared/.
Focus on: Dead code, unused imports/exports, inconsistent patterns, missing JSDoc on public APIs, overly complex functions, magic numbers, tight coupling, unclear control flow.

OUTPUT FORMAT:
# Iteration 014: Code Maintainability Review
## Agent: codex / gpt-5.4 / high
## Dimension: maintainability
## Files Reviewed
(list files)
## Findings
### [SEVERITY]-[NNN]: [Title]
- Severity: P0|P1|P2
- Evidence: [file:line]
- Description: ...
- Impact: ...
- Fix: ...
## Summary
- Total findings: N (P0: N, P1: N, P2: N)
- newFindingsRatio: X.XX

Note: Do NOT flag DORMANT/deprecated annotations as dead code needing removal — the project policy is to remove dead code entirely, not annotate it. Only flag actual dead code still present.
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: cocoindex_code starting
mcp: spec_kit_memory starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a maintainability-focused code review across the Spec Kit Memory server areas you named. I’ll first route to the right local review skill, map the target files, and then read the highest-signal modules before I write findings.
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts/dist .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts
.opencode/skill/system-spec-kit/mcp_server/eslint.config.mjs
.opencode/skill/system-spec-kit/scripts/dist/wrap-all-templates.d.ts.map
.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index.sqlite
.opencode/skill/system-spec-kit/shared/mcp_server/database/README.md
.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite
.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite-wal
.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite-shm
.opencode/skill/system-spec-kit/shared/mcp_server/database/speckit_memory.db
.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index.sqlite-shm
.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index.sqlite-wal
.opencode/skill/system-spec-kit/shared/chunking.ts
.opencode/skill/system-spec-kit/shared/config.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts
.opencode/skill/system-spec-kit/scripts/dist/loaders/index.d.ts.map
exec
/bin/zsh -lc "rg --files -g 'AGENTS.md' . .opencode/skill/system-spec-kit" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
./AGENTS.md
./.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Code review the Spec Kit Memory MCP server for maintainability issues across .opencode/skill/system-spec-kit/mcp_server/, scripts/dist/, and shared/. Focus on dead code, unused imports/exports, inconsistent patterns, missing JSDoc on public APIs, overly complex functions, magic numbers, tight coupling, and unclear control flow." --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 1.42s:
2026-03-25 08:17:58.897 xcodebuild[83597:13845171]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:17:59.014 xcodebuild[83597:13845157] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-PlSJAnfF' (errno=Operation not permitted)
2026-03-25 08:17:59.408 xcodebuild[83883:13845639]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:17:59.525 xcodebuild[83883:13845624] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !/system-spec-kit(explicit), !intent:memory, !memory, !spec, !system-spec-kit(explicit)"
  },
  {
    "skill": "sk-code--review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
codex
I’ve mapped the review surface and confirmed there isn’t a deeper `AGENTS.md` overriding the root guidance in the paths we care about. The generated `dist/` trees are very large, so I’m going to prioritize the source entry points and the highest-fanout modules, then use the compiled output only when it reveals public API/documentation drift.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--opencode/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
name: sk-code--opencode
description: Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC) with language detection routing, universal patterns, and quality checklists.
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.2.0.0
---

<!-- Keywords: opencode style, script standards, mcp code quality, node code style, typescript style, ts standards, python style, py standards, bash style, shell script, json format, jsonc config, code standards opencode -->

# Code Standards - OpenCode System Code

Multi-language code standards for OpenCode system code across JavaScript, TypeScript, Python, Shell, and JSON/JSONC.

**Core Principle**: Consistency within language + Clarity across languages = maintainable system code.


## 1. WHEN TO USE

### Activation Triggers

 succeeded in 0ms:
---
name: sk-code--review
description: "Stack-agnostic code review baseline skill with findings-first severity analysis, mandatory security/correctness minimums, and adaptive overlay compatibility with sk-code--opencode, sk-code--web, and sk-code--full-stack standards."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.0.0
---

<!-- Keywords: sk-code--review, code-review, pull-request, findings-first, security-review, quality-gate, stack-agnostic, baseline-overlay -->

# Code Review Baseline - Stack-Agnostic Findings-First Review

Universal `sk-code` review baseline for any codebase, implemented by `sk-code--review` and paired with one `sk-code--*` overlay skill for stack-specific rules.

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

Use this skill when:
- A user asks for code review, PR review, quality gate, or merge readiness.
codex
SKILL ROUTING: `sk-code--review` + `sk-code--opencode` + `mcp-coco-index`. I’m skipping `system-spec-kit` itself as a workflow skill here because this is a read-only review pass, not a spec-folder or implementation workflow.

Plan:
1. Use semantic search to locate the highest-fanout maintainability hotspots and public entry points.
2. Read the source modules those searches converge on in `mcp_server/`, `shared/`, and selected `scripts/dist/` outputs.
3. Cross-check for maintainability patterns the user called out: dead code, unused exports/imports, missing public API docs, complexity, magic numbers, and coupling.
4. Synthesize only evidence-backed findings with severity and exact file:line references.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/mcp-coco-index/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
name: mcp-coco-index
description: "Semantic code search via vector embeddings. CocoIndex Code enables natural-language discovery of relevant code, patterns, and implementations. CLI for direct use; MCP exposes a single `search` tool for AI agent integration."
allowed-tools: [Bash, Read, Grep, Glob]
version: 1.0.0
---

<!-- Keywords: cocoindex-code, semantic-search, vector-embeddings, code-search, mcp-server, ccc, codebase-indexing, voyage-code-3, all-MiniLM-L6-v2 -->

# CocoIndex Code - Semantic Code Search via Vector Embeddings

Natural language code search through two complementary approaches: CLI (ccc) for speed and one-off queries, MCP server (1 tool: `search`) for AI agent integration via stdio transport.


<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

**Use when**:
tool cocoindex_code.search({"query":"main entry points and orchestration for Spec Kit Memory MCP server maintainability, public APIs, handler registration, save pipeline","languages":"typescript","paths":[".opencode/skill/system-spec-kit/mcp_server/**/*.ts",".opencode/skill/system-spec-kit/shared/**/*.ts"],"limit":10,"refresh_index":true})
cocoindex_code.search({"query":"main entry points and orchestration for Spec Kit Memory MCP server maintainability, public APIs, handler registration, save pipeline","languages":"typescript","paths":[".opencode/skill/system-spec-kit/mcp_server/**/*.ts",".opencode/skill/system-spec-kit/shared/**/*.ts"],"limit":10,"refresh_index":true}) failed in 3ms:
{
  "content": [
    {
      "type": "text",
      "text": "Error executing tool search: 1 validation error for searchArguments\nlanguages\n  Input should be a valid list [type=list_type, input_value='typescript', input_type=str]\n    For further information visit https://errors.pydantic.dev/2.12/v/list_type"
    }
  ],
  "isError": true
}
tool cocoindex_code.search({"query":"public API exports and module barrel files for Spec Kit Memory MCP server and shared utilities","languages":"typescript","paths":[".opencode/skill/system-spec-kit/mcp_server/**/*.ts",".opencode/skill/system-spec-kit/shared/**/*.ts"],"limit":10,"refresh_index":false})
cocoindex_code.search({"query":"public API exports and module barrel files for Spec Kit Memory MCP server and shared utilities","languages":"typescript","paths":[".opencode/skill/system-spec-kit/mcp_server/**/*.ts",".opencode/skill/system-spec-kit/shared/**/*.ts"],"limit":10,"refresh_index":false}) failed in 0ms:
{
  "content": [
    {
      "type": "text",
      "text": "Error executing tool search: 1 validation error for searchArguments\nlanguages\n  Input should be a valid list [type=list_type, input_value='typescript', input_type=str]\n    For further information visit https://errors.pydantic.dev/2.12/v/list_type"
    }
  ],
  "isError": true
}
codex
The first semantic search call failed on argument shape, so I’m retrying with the MCP tool’s list format and narrowing the search to the source trees. After that I’ll open the concrete files those hits point to and inspect the public module boundaries.
tool cocoindex_code.search({"query":"main entry points and orchestration for Spec Kit Memory MCP server maintainability, public APIs, handler registration, save pipeline","languages":["typescript"],"paths":[".opencode/skill/system-spec-kit/mcp_server/**/*.ts",".opencode/skill/system-spec-kit/shared/**/*.ts"],"limit":8,"refresh_index":true})
cocoindex_code.search({"query":"main entry points and orchestration for Spec Kit Memory MCP server maintainability, public APIs, handler registration, save pipeline","languages":["typescript"],"paths":[".opencode/skill/system-spec-kit/mcp_server/**/*.ts",".opencode/skill/system-spec-kit/shared/**/*.ts"],"limit":8,"refresh_index":true}) success in 8.61s:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [],\n  \"total_returned\": 0,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [],
    "total_returned": 0,
    "offset": 0,
    "message": null
  },
  "isError": false
}
tool cocoindex_code.search({"query":"public API exports and module barrel files for Spec Kit Memory MCP server and shared utilities","languages":["typescript"],"paths":[".opencode/skill/system-spec-kit/mcp_server/**/*.ts",".opencode/skill/system-spec-kit/shared/**/*.ts"],"limit":8,"refresh_index":false})
cocoindex_code.search({"query":"public API exports and module barrel files for Spec Kit Memory MCP server and shared utilities","languages":["typescript"],"paths":[".opencode/skill/system-spec-kit/mcp_server/**/*.ts",".opencode/skill/system-spec-kit/shared/**/*.ts"],"limit":8,"refresh_index":false}) success in 376ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [],\n  \"total_returned\": 0,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [],
    "total_returned": 0,
    "offset": 0,
    "message": null
  },
  "isError": false
}
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--review/references/review_core.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: Review Core Doctrine
description: Shared findings-first review doctrine for both single-pass and deep-review workflows.
---

# Review Core Doctrine

Shared doctrine consumed by both `@review` and `@deep-review`.

---

## 1. SEVERITY DEFINITIONS

| Level | Meaning | Handling |
| --- | --- | --- |
| P0 | Blocker: exploitable security issue, auth bypass, destructive data loss | Block merge |
| P1 | Required: correctness bug, spec mismatch, must-fix gate issue | Fix before merge |
| P2 | Suggestion: non-blocking improvement, documentation polish, style or maintainability follow-up | Optional or schedule follow-up |

Escalation rule: if confidence is low but impact is high, classify toward the higher severity and state the uncertainty explicitly.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Context Server
// ───────────────────────────────────────────────────────────────
// T303: Decomposed — tool schemas in tool-schemas.ts, dispatch
// Logic in tools/*.ts. This file retains server init, startup,
// Shutdown, and main orchestration only.
import fs from 'fs';
import path from 'path';

/* ───────────────────────────────────────────────────────────────
   1. MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

// MCP SDK
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// Core modules
import {
exec
/bin/zsh -lc 'rg -n "''^export |''^async function |''^function |module'"\\\\.exports|exports\\\\.\" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/api .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts .opencode/skill/system-spec-kit/shared/index.ts .opencode/skill/system-spec-kit/shared/config.ts .opencode/skill/system-spec-kit/shared/paths.ts .opencode/skill/system-spec-kit/shared/chunking.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/shared/config.ts:9:export function getDbDir(): string | undefined {
.opencode/skill/system-spec-kit/shared/config.ts:13:function findUp(filename: string, startDir: string): string | undefined {
.opencode/skill/system-spec-kit/shared/config.ts:23:function resolvePackageRoot(): string {
.opencode/skill/system-spec-kit/shared/config.ts:41:export const DB_UPDATED_FILE: string = (() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:10:export type {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:24:export {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:30:export { checkExistingRow, checkContentHashDedup } from './dedup';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:32:export type { EmbeddingResult } from './embedding-pipeline';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:33:export {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:38:export type { PeOrchestrationResult } from './pe-orchestration';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:39:export { evaluateAndApplyPeDecision } from './pe-orchestration';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:41:export type { ReconsolidationBridgeResult } from './reconsolidation-bridge';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:42:export { runReconsolidationIfEnabled } from './reconsolidation-bridge';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:44:export { createMemoryRecord } from './create-record';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:46:export type { PostInsertEnrichmentResult } from './post-insert';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:47:export { runPostInsertEnrichment } from './post-insert';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:49:export { buildIndexResult, buildSaveResponse } from './response-builder';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:51:export { SPEC_FOLDER_LOCKS, withSpecFolderLock } from './spec-folder-mutex';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:53:export {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:63:export {
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/api/index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Index
// ────────────────────────────────────────────────────────────────
// @public — single entry point for all public API surfaces.
// ARCH-1 consumer scripts import from '../../mcp_server/api'
// Instead of reaching into lib/ internals.

export {
  runAblation,
  storeAblationResults,
  formatAblationReport,
  toHybridSearchFlags,
  isAblationEnabled,
  ALL_CHANNELS,
  type AblationChannel,
  type AblationSearchFn,
  type AblationReport,
  runBM25Baseline,
  recordBaselineMetrics,
  type BM25SearchFn,
 succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Index
// ────────────────────────────────────────────────────────────────

import * as memorySearch from './memory-search';
import * as memoryTriggers from './memory-triggers';
import * as memorySave from './memory-save';
import * as memoryCrud from './memory-crud';
import * as memoryIndex from './memory-index';
import * as memoryBulkDelete from './memory-bulk-delete';
import * as checkpoints from './checkpoints';
import * as sessionLearning from './session-learning';
import * as causalGraph from './causal-graph';
import * as evalReporting from './eval-reporting';
import * as sharedMemory from './shared-memory';
// T061: L1 Orchestration - unified entry point
import * as memoryContext from './memory-context';
import * as memoryIngest from './memory-ingest';

// Feature catalog: Transaction wrappers on mutation handlers
codex
I’ve confirmed the public surfaces are heavily barrel-driven, which is usually where maintainability drift hides. Next I’m checking the biggest orchestration files and the shared barrel exports for documentation gaps, export sprawl, and places where internal modules are coupled directly into the public API.
exec
/bin/zsh -lc 'wc -l .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts .opencode/skill/system-spec-kit/shared/index.ts .opencode/skill/system-spec-kit/mcp_server/api/index.ts .opencode/skill/system-spec-kit/mcp_server/api/indexing.ts .opencode/skill/system-spec-kit/shared/chunking.ts .opencode/skill/system-spec-kit/shared/config.ts .opencode/skill/system-spec-kit/shared/paths.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    1136 .opencode/skill/system-spec-kit/mcp_server/context-server.ts
     180 .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts
      68 .opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts
     230 .opencode/skill/system-spec-kit/shared/index.ts
     111 .opencode/skill/system-spec-kit/mcp_server/api/index.ts
      62 .opencode/skill/system-spec-kit/mcp_server/api/indexing.ts
     110 .opencode/skill/system-spec-kit/shared/chunking.ts
      47 .opencode/skill/system-spec-kit/shared/config.ts
      69 .opencode/skill/system-spec-kit/shared/paths.ts
    2013 total
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Index
// ───────────────────────────────────────────────────────────────
// Re-export barrel consumed by test suites. Production code imports
// from concrete sub-modules (./dedup, ./embedding-pipeline, etc.).

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Atomic-save parity and partial-indexing hints

export type {
  ValidationResult,
  SimilarMemory,
  PeDecision,
  IndexResult,
  CausalLinksResult,
  AtomicSaveParams,
  AtomicSaveOptions,
  AtomicSaveResult,
  SaveArgs,
  PostInsertMetadataFields,
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/api/indexing.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/shared/index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Indexing
// ────────────────────────────────────────────────────────────────
// @public — scripts should import from here, not core/ or handlers/ internals.
// ARCH-1 exposes only the runtime bootstrap and indexing hooks needed
// By reindex orchestration without widening the general public surface.

import type { EmbeddingProfile, MCPResponse } from '@spec-kit/shared/types';

import { init as initDbState, setEmbeddingModelReady } from '../core';
import { handleMemoryIndexScan } from '../handlers';

import { generateEmbedding, getEmbeddingProfile } from './providers';
import { initHybridSearch, vectorIndex } from './search';
import { initAccessTracker, initCheckpoints } from './storage';

/** Arguments for memory index scan requests. */
export interface MemoryIndexScanArgs {
  specFolder?: string | null;
  force?: boolean;
 succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------
// Central export surface for all shared modules.
// Re-exports types, utilities, embeddings, scoring, and chunking.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// 1. TYPE DEFINITIONS
// ---------------------------------------------------------------
export type {
  // DB normalization types
  MemoryDbRow,
  Memory,
  // Database interface types (canonical)
  PreparedStatement,
  Database,
  DatabaseExtended,
  // Embedding types
  EmbeddingProfileData,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/config.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Config
     3	// ---------------------------------------------------------------
     4	
     5	import fs from 'fs';
     6	import path from 'path';
     7	
     8	/** Get db dir. */
     9	export function getDbDir(): string | undefined {
    10	  return process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || undefined;
    11	}
    12	
    13	function findUp(filename: string, startDir: string): string | undefined {
    14	  let dir = startDir;
    15	  while (true) {
    16	    if (fs.existsSync(path.join(dir, filename))) return dir;
    17	    const parent = path.dirname(dir);
    18	    if (parent === dir) return undefined;
    19	    dir = parent;
    20	  }
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/paths.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Paths
     3	// ---------------------------------------------------------------
     4	
     5	import fs from 'fs';
     6	import path from 'path';
     7	
     8	import { getDbDir } from './config';
     9	
    10	function findUp(startDir: string, predicate: (dir: string) => boolean): string | undefined {
    11	  let dir = startDir;
    12	  while (true) {
    13	    if (predicate(dir)) return dir;
    14	    const parent = path.dirname(dir);
    15	    if (parent === dir) return undefined;
    16	    dir = parent;
    17	  }
    18	}
    19	
    20	function hasPackageJson(dir: string): boolean {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/chunking.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Chunking
     3	// ---------------------------------------------------------------
     4	// Feature catalog: Anchor-aware chunk thinning
     5	
     6	import type { PriorityPatterns, PriorityBuckets } from './types';
     7	
     8	// ---------------------------------------------------------------
     9	// 1. CONFIGURATION
    10	//
    11	// These constants are the SINGLE SOURCE OF TRUTH for text length limits.
    12	// Other modules (embeddings.ts, hf-local.ts) import from here.
    13	// ---------------------------------------------------------------
    14	
    15	/**
    16	 * Maximum text length for embedding generation.
    17	 * This value is used across all embedding providers.
    18	 * Based on nomic-embed-text-v1.5 context window (~8192 tokens).
    19	 */
    20	export const MAX_TEXT_LENGTH: number = 8000;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '150,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   150	  specFolderCount: number;
   151	  activeCount: number;
   152	  staleCount: number;
   153	}
   154	
   155	type AfterToolCallback = (tool: string, callId: string, result: unknown) => Promise<void>;
   156	
   157	const afterToolCallbacks: Array<AfterToolCallback> = [];
   158	
   159	/** Timeout (ms) for waiting on embedding model readiness during startup scan. */
   160	const EMBEDDING_MODEL_TIMEOUT_MS = 30_000;
   161	
   162	/** Timeout (ms) for API key validation during startup. */
   163	const API_KEY_VALIDATION_TIMEOUT_MS = 5_000;
   164	
   165	function isMutationStatus(status: string | undefined): boolean {
   166	  return status === 'indexed' || status === 'updated' || status === 'reinforced' || status === 'deferred';
   167	}
   168	
   169	let generatedCallIdCounter = 0;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '620,900p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '420,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   420	/* ───────────────────────────────────────────────────────────────
   421	   6. STARTUP SCAN & PENDING FILE RECOVERY
   422	──────────────────────────────────────────────────────────────── */
   423	
   424	let startupScanInProgress = false;
   425	
   426	/**
   427	 * T107: Recover pending memory files on MCP startup.
   428	 * CHK-188: Pending files processed by recovery job on next startup.
   429	 *
   430	 * Scans for files with _pending suffix (created when index failed after file write)
   431	 * and attempts to index them.
   432	 */
   433	async function recoverPendingFiles(basePath: string): Promise<PendingRecoveryResult> {
   434	  console.error('[context-server] Checking for pending memory files...');
   435	
   436	  try {
   437	    // BUG-028 FIX: Restrict scan to known memory file locations to prevent OOM when scanning large workspaces.
   438	    // P1 follow-up: derive those known locations from all allowed memory roots so startup recovery matches ingest roots.
   439	    const configuredMemoryRoot = process.env.MEMORY_BASE_PATH;
 succeeded in 0ms:
   620	    await cleanupFn();
   621	  } catch (error: unknown) {
   622	    console.error(`[context-server] ${label} cleanup failed:`, error);
   623	  }
   624	}
   625	
   626	async function fatalShutdown(reason: string, exitCode: number): Promise<void> {
   627	  if (shuttingDown) return;
   628	  shuttingDown = true;
   629	  console.error(`[context-server] ${reason}`);
   630	
   631	  runCleanupStep('sessionManager', () => sessionManager.shutdown());
   632	  runCleanupStep('archivalManager', () => archivalManager.cleanup());
   633	  runCleanupStep('retryManager', () => retryManager.stopBackgroundJob());
   634	  runCleanupStep('shadowEvaluationRuntime', () => shadowEvaluationRuntime.stopShadowEvaluationScheduler());
   635	  runCleanupStep('accessTracker', () => accessTracker.reset());
   636	  runCleanupStep('toolCache', () => toolCache.shutdown());
   637	
   638	  let deadlineTimer: NodeJS.Timeout | undefined;
   639	  const cleanup = (async () => {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '900,1160p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   900	    }
   901	
   902	    if (isLearnedFeedbackEnabled()) {
   903	      try {
   904	        const migrated = migrateLearnedTriggers(database);
   905	        const isolated = verifyFts5Isolation(database);
   906	        console.error(`[context-server] Learned triggers ready (migrated=${migrated}, fts5Isolated=${isolated})`);
   907	      } catch (learnedErr: unknown) {
   908	        const message = learnedErr instanceof Error ? learnedErr.message : String(learnedErr);
   909	        throw new Error(`[context-server] Learned feedback migration/isolation failed: ${message}`);
   910	      }
   911	    }
   912	
   913	    // Check SQLite version meets minimum requirement (3.35.0+)
   914	    checkSqliteVersion(database);
   915	
   916	    // T076: Verify WAL mode is active for operational concurrency guarantees.
   917	    const walRow = database.prepare('PRAGMA journal_mode').get() as { journal_mode?: string } | undefined;
   918	    const journalMode = String(walRow?.journal_mode ?? '').toLowerCase();
   919	    if (journalMode !== 'wal') {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/api/index.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Index
     3	// ────────────────────────────────────────────────────────────────
     4	// @public — single entry point for all public API surfaces.
     5	// ARCH-1 consumer scripts import from '../../mcp_server/api'
     6	// Instead of reaching into lib/ internals.
     7	
     8	export {
     9	  runAblation,
    10	  storeAblationResults,
    11	  formatAblationReport,
    12	  toHybridSearchFlags,
    13	  isAblationEnabled,
    14	  ALL_CHANNELS,
    15	  type AblationChannel,
    16	  type AblationSearchFn,
    17	  type AblationReport,
    18	  runBM25Baseline,
    19	  recordBaselineMetrics,
    20	  type BM25SearchFn,
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/README.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Handlers"
description: "MCP tool handler surface plus internal handler helpers for save/index orchestration."
trigger_phrases:
  - "MCP handlers"
  - "memory handlers"
  - "request handlers"
---


# Handlers

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. IMPLEMENTED STATE](#2--implemented-state)
- [3. HARDENING NOTES](#3--hardening-notes)
- [4. TELEMETRY NOTES](#4--telemetry-notes)
- [5. RELATED](#5--related)
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/shared/README.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Shared Library Modules"
description: "Consolidated TypeScript modules shared between CLI scripts and MCP server for embeddings, retrieval algorithms, contracts, config, and utility logic."
trigger_phrases:
  - "shared library modules"
  - "embeddings trigger extractor shared"
  - "shared TypeScript modules"
---

# Shared Library Modules

> Consolidated TypeScript modules shared between CLI scripts and MCP server for embeddings, scoring, normalization, and utility logic. Source files are `.ts`. `shared/dist/` is generated CommonJS build output.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/api/README.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "MCP Server Public API"
description: "Stable public surface for external consumers including scripts, evals, and automation."
trigger_phrases:
  - "public api"
  - "api surface"
  - "eval api"
  - "search api"
---


# MCP Server Public API

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. AVAILABLE MODULES](#2--available-modules)
- [3. CONSUMER POLICY](#3--consumer-policy)
- [4. MIGRATION GUIDE](#4--migration-guide)
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Save Handler Pipeline"
description: "Decomposed pipeline modules for the memory_save MCP tool handler, covering dedup, embedding, PE gating, record creation, reconsolidation and response assembly."
trigger_phrases:
  - "save handler"
  - "memory save pipeline"
  - "save modules"
  - "memory indexing"
---


# Save Handler Pipeline

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. PIPELINE FLOW](#3--pipeline-flow)
- [4. KEY CONCEPTS](#4--key-concepts)
codex
I’ve now checked the top-level READMEs too, because a lot of maintainability here depends on whether the barrels and boundaries are actually documented the way the code behaves. I’m sampling a few `scripts/dist/` entry points next so the review covers the generated consumer surface as requested, then I’ll lock findings.
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/scripts/dist | rg '/index\\\\.(js|d\\\\.ts)"'$|config/index'"\\\\.js"'$|loaders/index'"\\\\.js"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/api/indexing.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Indexing
     3	// ────────────────────────────────────────────────────────────────
     4	// @public — scripts should import from here, not core/ or handlers/ internals.
     5	// ARCH-1 exposes only the runtime bootstrap and indexing hooks needed
     6	// By reindex orchestration without widening the general public surface.
     7	
     8	import type { EmbeddingProfile, MCPResponse } from '@spec-kit/shared/types';
     9	
    10	import { init as initDbState, setEmbeddingModelReady } from '../core';
    11	import { handleMemoryIndexScan } from '../handlers';
    12	
    13	import { generateEmbedding, getEmbeddingProfile } from './providers';
    14	import { initHybridSearch, vectorIndex } from './search';
    15	import { initAccessTracker, initCheckpoints } from './storage';
    16	
    17	/** Arguments for memory index scan requests. */
    18	export interface MemoryIndexScanArgs {
    19	  specFolder?: string | null;
    20	  force?: boolean;
exec
/bin/zsh -lc 'rg -n "''^export (function|async function|const|class|interface)|''^export '"\\{|"'^export '"\\*\" .opencode/skill/system-spec-kit/mcp_server/api .opencode/skill/system-spec-kit/shared | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:8:export {
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:27:export {
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:35:export {
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:45:export {
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:52:export {
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:58:export {
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:68:export {
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:74:export * as sessionBoost from '../lib/search/session-boost';
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:75:export * as causalBoost from '../lib/search/causal-boost';
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:76:export * as workingMemory from '../lib/cognitive/working-memory';
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:77:export {
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:85:export {
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:93:export {
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:106:export {
.opencode/skill/system-spec-kit/mcp_server/api/providers.ts:7:export {
.opencode/skill/system-spec-kit/mcp_server/api/providers.ts:13:export * as retryManager from '../lib/providers/retry-manager';
.opencode/skill/system-spec-kit/mcp_server/api/storage.ts:8:export { init as initCheckpoints } from '../lib/storage/checkpoints';
.opencode/skill/system-spec-kit/mcp_server/api/storage.ts:9:export { init as initAccessTracker } from '../lib/storage/access-tracker';
.opencode/skill/system-spec-kit/shared/chunking.ts:20:export const MAX_TEXT_LENGTH: number = 8000;
.opencode/skill/system-spec-kit/shared/chunking.ts:22:export const RESERVED_OVERVIEW: number = 500;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/api/providers.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Providers
     3	// ────────────────────────────────────────────────────────────────
     4	// @public — scripts should import from here, not lib/ internals.
     5	// ARCH-1 re-exports provider functions through a stable surface.
     6	
     7	export {
     8	  generateEmbedding,
     9	  generateQueryEmbedding,
    10	  getEmbeddingProfile,
    11	} from '../lib/providers/embeddings';
    12	
    13	export * as retryManager from '../lib/providers/retry-manager';
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/api/search.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Search
     3	// ────────────────────────────────────────────────────────────────
     4	// @public — scripts should import from here, not lib/ internals.
     5	// ARCH-1 stable re-export surface for search functionality.
     6	// Consumer scripts import from here instead of reaching into lib/search/.
     7	
     8	export {
     9	  init as initHybridSearch,
    10	  hybridSearchEnhanced,
    11	  type HybridSearchOptions,
    12	  type HybridSearchResult,
    13	} from '../lib/search/hybrid-search';
    14	
    15	export {
    16	  fts5Bm25Search,
    17	  isFts5Available,
    18	} from '../lib/search/sqlite-fts';
    19	
    20	export * as vectorIndex from '../lib/search/vector-index';
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/api/storage.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Storage
     3	// ────────────────────────────────────────────────────────────────
     4	// @public — scripts should import from here, not lib/ internals.
     5	// ARCH-1 exposes minimal storage initialization hooks needed by
     6	// Operational scripts without importing mcp_server/lib/storage directly.
     7	
     8	export { init as initCheckpoints } from '../lib/storage/checkpoints';
     9	export { init as initAccessTracker } from '../lib/storage/access-tracker';
exec
/bin/zsh -lc "find .opencode/skill/system-spec-kit/scripts/dist -maxdepth 3 \\( -path '*/index.js' -o -path '*/config/index.js' -o -path '*/loaders/index.js' \\) | sort | sed -n '1,80p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/dist/config/index.js
.opencode/skill/system-spec-kit/scripts/dist/core/index.js
.opencode/skill/system-spec-kit/scripts/dist/extractors/index.js
.opencode/skill/system-spec-kit/scripts/dist/loaders/index.js
.opencode/skill/system-spec-kit/scripts/dist/renderers/index.js
.opencode/skill/system-spec-kit/scripts/dist/spec-folder/index.js
.opencode/skill/system-spec-kit/scripts/dist/utils/index.js
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/dist/config/index.js" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
"use strict";
// ---------------------------------------------------------------
// MODULE: Config Barrel
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllExistingSpecsDirs = exports.findActiveSpecsDir = exports.getSpecsDirectories = exports.CONFIG = void 0;
// ───────────────────────────────────────────────────────────────
// 1. CONFIG BARREL
// ───────────────────────────────────────────────────────────────
// Re-exports CONFIG and spec-directory utilities so that non-core
// modules (extractors, renderers, loaders, etc.) can import from
// '../config' instead of reaching into '../core'.
//
// This eliminates the upward-dependency from extractors → core
// while keeping the canonical implementation in core/config.ts.
var config_1 = require("../core/config");
Object.defineProperty(exports, "CONFIG", { enumerable: true, get: function () { return config_1.CONFIG; } });
Object.defineProperty(exports, "getSpecsDirectories", { enumerable: true, get: function () { return config_1.getSpecsDirectories; } });
Object.defineProperty(exports, "findActiveSpecsDir", { enumerable: true, get: function () { return config_1.findActiveSpecsDir; } });
Object.defineProperty(exports, "getAllExistingSpecsDirs", { enumerable: true, get: function () { return config_1.getAllExistingSpecsDirs; } });
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/dist/loaders/index.js" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
"use strict";
// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCollectedData = void 0;
// ───────────────────────────────────────────────────────────────
// 1. INDEX
// ───────────────────────────────────────────────────────────────
// Barrel export for data loading modules
var data_loader_1 = require("./data-loader");
Object.defineProperty(exports, "loadCollectedData", { enumerable: true, get: function () { return data_loader_1.loadCollectedData; } });
//# sourceMappingURL=index.js.map
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/dist/core/index.js" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/dist/spec-folder/index.js" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
"use strict";
// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFolderAlignment = exports.validateContentAlignment = exports.validateTelemetrySchemaDocsDrift = exports.formatTelemetrySchemaDocsDriftDiffs = exports.computeTelemetrySchemaDocsFieldDiffs = exports.calculateAlignmentScore = exports.extractObservationKeywords = exports.extractConversationTopics = exports.setupContextDirectory = exports.filterArchiveFolders = exports.detectSpecFolder = exports.ALIGNMENT_CONFIG = void 0;
// ───────────────────────────────────────────────────────────────
// 1. INDEX
// ───────────────────────────────────────────────────────────────
// Barrel export for spec folder detection, validation, and setup modules
const folder_detector_1 = require("./folder-detector");
Object.defineProperty(exports, "detectSpecFolder", { enumerable: true, get: function () { return folder_detector_1.detectSpecFolder; } });
Object.defineProperty(exports, "filterArchiveFolders", { enumerable: true, get: function () { return folder_detector_1.filterArchiveFolders; } });
const alignment_validator_1 = require("./alignment-validator");
Object.defineProperty(exports, "ALIGNMENT_CONFIG", { enumerable: true, get: function () { return alignment_validator_1.ALIGNMENT_CONFIG; } });
Object.defineProperty(exports, "extractConversationTopics", { enumerable: true, get: function () { return alignment_validator_1.extractConversationTopics; } });
Object.defineProperty(exports, "extractObservationKeywords", { enumerable: true, get: function () { return alignment_validator_1.extractObservationKeywords; } });
Object.defineProperty(exports, "calculateAlignmentScore", { enumerable: true, get: function () { return alignment_validator_1.calculateAlignmentScore; } });
Object.defineProperty(exports, "computeTelemetrySchemaDocsFieldDiffs", { enumerable: true, get: function () { return alignment_validator_1.computeTelemetrySchemaDocsFieldDiffs; } });
Object.defineProperty(exports, "formatTelemetrySchemaDocsDriftDiffs", { enumerable: true, get: function () { return alignment_validator_1.formatTelemetrySchemaDocsDriftDiffs; } });
 succeeded in 0ms:
"use strict";
// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.findChildFolderAsync = exports.findChildFolderSync = exports.SEARCH_MAX_DEPTH = exports.CATEGORY_FOLDER_PATTERN = exports.SPEC_FOLDER_BASIC_PATTERN = exports.SPEC_FOLDER_PATTERN = exports.getAllExistingSpecsDirs = exports.findActiveSpecsDir = exports.getSpecsDirectories = exports.CONFIG = void 0;
// ───────────────────────────────────────────────────────────────
// 1. INDEX
// ───────────────────────────────────────────────────────────────
// Barrel export for core modules (config, spec-folder utilities)
// Workflow.ts not exported here to avoid circular dependencies
// Import directly: import { runWorkflow } from './core/workflow';
var config_1 = require("./config");
Object.defineProperty(exports, "CONFIG", { enumerable: true, get: function () { return config_1.CONFIG; } });
Object.defineProperty(exports, "getSpecsDirectories", { enumerable: true, get: function () { return config_1.getSpecsDirectories; } });
Object.defineProperty(exports, "findActiveSpecsDir", { enumerable: true, get: function () { return config_1.findActiveSpecsDir; } });
Object.defineProperty(exports, "getAllExistingSpecsDirs", { enumerable: true, get: function () { return config_1.getAllExistingSpecsDirs; } });
var subfolder_utils_1 = require("./subfolder-utils");
Object.defineProperty(exports, "SPEC_FOLDER_PATTERN", { enumerable: true, get: function () { return subfolder_utils_1.SPEC_FOLDER_PATTERN; } });
Object.defineProperty(exports, "SPEC_FOLDER_BASIC_PATTERN", { enumerable: true, get: function () { return subfolder_utils_1.SPEC_FOLDER_BASIC_PATTERN; } });
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Index
     3	// ---------------------------------------------------------------
     4	// Central export surface for all shared modules.
     5	// Re-exports types, utilities, embeddings, scoring, and chunking.
     6	// ---------------------------------------------------------------
     7	
     8	// ---------------------------------------------------------------
     9	// 1. TYPE DEFINITIONS
    10	// ---------------------------------------------------------------
    11	export type {
    12	  // DB normalization types
    13	  MemoryDbRow,
    14	  Memory,
    15	  // Database interface types (canonical)
    16	  PreparedStatement,
    17	  Database,
    18	  DatabaseExtended,
    19	  // Embedding types
    20	  EmbeddingProfileData,
 succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Index
     3	// ────────────────────────────────────────────────────────────────
     4	
     5	import * as memorySearch from './memory-search';
     6	import * as memoryTriggers from './memory-triggers';
     7	import * as memorySave from './memory-save';
     8	import * as memoryCrud from './memory-crud';
     9	import * as memoryIndex from './memory-index';
    10	import * as memoryBulkDelete from './memory-bulk-delete';
    11	import * as checkpoints from './checkpoints';
    12	import * as sessionLearning from './session-learning';
    13	import * as causalGraph from './causal-graph';
    14	import * as evalReporting from './eval-reporting';
    15	import * as sharedMemory from './shared-memory';
    16	// T061: L1 Orchestration - unified entry point
    17	import * as memoryContext from './memory-context';
    18	import * as memoryIngest from './memory-ingest';
    19	
    20	// Feature catalog: Transaction wrappers on mutation handlers
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/api/README.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	---
     2	title: "MCP Server Public API"
     3	description: "Stable public surface for external consumers including scripts, evals, and automation."
     4	trigger_phrases:
     5	  - "public api"
     6	  - "api surface"
     7	  - "eval api"
     8	  - "search api"
     9	---
    10	
    11	
    12	# MCP Server Public API
    13	
    14	<!-- ANCHOR:table-of-contents -->
    15	## TABLE OF CONTENTS
    16	
    17	- [1. OVERVIEW](#1--overview)
    18	- [2. AVAILABLE MODULES](#2--available-modules)
    19	- [3. CONSUMER POLICY](#3--consumer-policy)
    20	- [4. MIGRATION GUIDE](#4--migration-guide)
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/README.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	---
     2	title: "Shared Library Modules"
     3	description: "Consolidated TypeScript modules shared between CLI scripts and MCP server for embeddings, retrieval algorithms, contracts, config, and utility logic."
     4	trigger_phrases:
     5	  - "shared library modules"
     6	  - "embeddings trigger extractor shared"
     7	  - "shared TypeScript modules"
     8	---
     9	
    10	# Shared Library Modules
    11	
    12	> Consolidated TypeScript modules shared between CLI scripts and MCP server for embeddings, scoring, normalization, and utility logic. Source files are `.ts`. `shared/dist/` is generated CommonJS build output.
    13	
    14	---
    15	
    16	<!-- ANCHOR:table-of-contents -->
    17	## TABLE OF CONTENTS
    18	
    19	- [1. OVERVIEW](#1--overview)
    20	- [2. QUICK START](#2--quick-start)
codex
I have the main findings now. I’m doing one last pass on the generated `scripts/dist` barrels only to confirm whether they amplify the source-side boundary problems before I finalize the review.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/config/index.js | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Config Barrel
     4	// ---------------------------------------------------------------
     5	Object.defineProperty(exports, "__esModule", { value: true });
     6	exports.getAllExistingSpecsDirs = exports.findActiveSpecsDir = exports.getSpecsDirectories = exports.CONFIG = void 0;
     7	// ───────────────────────────────────────────────────────────────
     8	// 1. CONFIG BARREL
     9	// ───────────────────────────────────────────────────────────────
    10	// Re-exports CONFIG and spec-directory utilities so that non-core
    11	// modules (extractors, renderers, loaders, etc.) can import from
    12	// '../config' instead of reaching into '../core'.
    13	//
    14	// This eliminates the upward-dependency from extractors → core
    15	// while keeping the canonical implementation in core/config.ts.
    16	var config_1 = require("../core/config");
    17	Object.defineProperty(exports, "CONFIG", { enumerable: true, get: function () { return config_1.CONFIG; } });
    18	Object.defineProperty(exports, "getSpecsDirectories", { enumerable: true, get: function () { return config_1.getSpecsDirectories; } });
    19	Object.defineProperty(exports, "findActiveSpecsDir", { enumerable: true, get: function () { return config_1.findActiveSpecsDir; } });
    20	Object.defineProperty(exports, "getAllExistingSpecsDirs", { enumerable: true, get: function () { return config_1.getAllExistingSpecsDirs; } });
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/core/index.js | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Index
     4	// ---------------------------------------------------------------
     5	Object.defineProperty(exports, "__esModule", { value: true });
     6	exports.findChildFolderAsync = exports.findChildFolderSync = exports.SEARCH_MAX_DEPTH = exports.CATEGORY_FOLDER_PATTERN = exports.SPEC_FOLDER_BASIC_PATTERN = exports.SPEC_FOLDER_PATTERN = exports.getAllExistingSpecsDirs = exports.findActiveSpecsDir = exports.getSpecsDirectories = exports.CONFIG = void 0;
     7	// ───────────────────────────────────────────────────────────────
     8	// 1. INDEX
     9	// ───────────────────────────────────────────────────────────────
    10	// Barrel export for core modules (config, spec-folder utilities)
    11	// Workflow.ts not exported here to avoid circular dependencies
    12	// Import directly: import { runWorkflow } from './core/workflow';
    13	var config_1 = require("./config");
    14	Object.defineProperty(exports, "CONFIG", { enumerable: true, get: function () { return config_1.CONFIG; } });
    15	Object.defineProperty(exports, "getSpecsDirectories", { enumerable: true, get: function () { return config_1.getSpecsDirectories; } });
    16	Object.defineProperty(exports, "findActiveSpecsDir", { enumerable: true, get: function () { return config_1.findActiveSpecsDir; } });
    17	Object.defineProperty(exports, "getAllExistingSpecsDirs", { enumerable: true, get: function () { return config_1.getAllExistingSpecsDirs; } });
    18	var subfolder_utils_1 = require("./subfolder-utils");
    19	Object.defineProperty(exports, "SPEC_FOLDER_PATTERN", { enumerable: true, get: function () { return subfolder_utils_1.SPEC_FOLDER_PATTERN; } });
    20	Object.defineProperty(exports, "SPEC_FOLDER_BASIC_PATTERN", { enumerable: true, get: function () { return subfolder_utils_1.SPEC_FOLDER_BASIC_PATTERN; } });
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/spec-folder/index.js | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/loaders/index.js | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Index
     4	// ---------------------------------------------------------------
     5	Object.defineProperty(exports, "__esModule", { value: true });
     6	exports.loadCollectedData = void 0;
     7	// ───────────────────────────────────────────────────────────────
     8	// 1. INDEX
     9	// ───────────────────────────────────────────────────────────────
    10	// Barrel export for data loading modules
    11	var data_loader_1 = require("./data-loader");
    12	Object.defineProperty(exports, "loadCollectedData", { enumerable: true, get: function () { return data_loader_1.loadCollectedData; } });
    13	//# sourceMappingURL=index.js.map
 succeeded in 0ms:
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Index
     4	// ---------------------------------------------------------------
     5	Object.defineProperty(exports, "__esModule", { value: true });
     6	exports.validateFolderAlignment = exports.validateContentAlignment = exports.validateTelemetrySchemaDocsDrift = exports.formatTelemetrySchemaDocsDriftDiffs = exports.computeTelemetrySchemaDocsFieldDiffs = exports.calculateAlignmentScore = exports.extractObservationKeywords = exports.extractConversationTopics = exports.setupContextDirectory = exports.filterArchiveFolders = exports.detectSpecFolder = exports.ALIGNMENT_CONFIG = void 0;
     7	// ───────────────────────────────────────────────────────────────
     8	// 1. INDEX
     9	// ───────────────────────────────────────────────────────────────
    10	// Barrel export for spec folder detection, validation, and setup modules
    11	const folder_detector_1 = require("./folder-detector");
    12	Object.defineProperty(exports, "detectSpecFolder", { enumerable: true, get: function () { return folder_detector_1.detectSpecFolder; } });
    13	Object.defineProperty(exports, "filterArchiveFolders", { enumerable: true, get: function () { return folder_detector_1.filterArchiveFolders; } });
    14	const alignment_validator_1 = require("./alignment-validator");
    15	Object.defineProperty(exports, "ALIGNMENT_CONFIG", { enumerable: true, get: function () { return alignment_validator_1.ALIGNMENT_CONFIG; } });
    16	Object.defineProperty(exports, "extractConversationTopics", { enumerable: true, get: function () { return alignment_validator_1.extractConversationTopics; } });
    17	Object.defineProperty(exports, "extractObservationKeywords", { enumerable: true, get: function () { return alignment_validator_1.extractObservationKeywords; } });
    18	Object.defineProperty(exports, "calculateAlignmentScore", { enumerable: true, get: function () { return alignment_validator_1.calculateAlignmentScore; } });
    19	Object.defineProperty(exports, "computeTelemetrySchemaDocsFieldDiffs", { enumerable: true, get: function () { return alignment_validator_1.computeTelemetrySchemaDocsFieldDiffs; } });
    20	Object.defineProperty(exports, "formatTelemetrySchemaDocsDriftDiffs", { enumerable: true, get: function () { return alignment_validator_1.formatTelemetrySchemaDocsDriftDiffs; } });
codex
# Iteration 014: Code Maintainability Review
## Agent: codex / gpt-5.4 / high
## Dimension: maintainability
## Files Reviewed
- [.opencode/skill/system-spec-kit/mcp_server/context-server.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [.opencode/skill/system-spec-kit/mcp_server/api/index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/index.ts)
- [.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts)
- [.opencode/skill/system-spec-kit/mcp_server/api/providers.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/providers.ts)
- [.opencode/skill/system-spec-kit/mcp_server/api/search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/search.ts)
- [.opencode/skill/system-spec-kit/mcp_server/api/storage.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/storage.ts)
- [.opencode/skill/system-spec-kit/mcp_server/api/README.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/README.md)
- [.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts)
- [.opencode/skill/system-spec-kit/mcp_server/handlers/README.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md)
- [.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts)
- [.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md)
- [.opencode/skill/system-spec-kit/shared/index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/index.ts)
- [.opencode/skill/system-spec-kit/shared/config.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/config.ts)
- [.opencode/skill/system-spec-kit/shared/paths.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/paths.ts)
- [.opencode/skill/system-spec-kit/shared/chunking.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/chunking.ts)
- [.opencode/skill/system-spec-kit/shared/README.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/README.md)
- [.opencode/skill/system-spec-kit/scripts/dist/config/index.js](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/dist/config/index.js)
- [.opencode/skill/system-spec-kit/scripts/dist/core/index.js](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/dist/core/index.js)
- [.opencode/skill/system-spec-kit/scripts/dist/loaders/index.js](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/dist/loaders/index.js)
- [.opencode/skill/system-spec-kit/scripts/dist/spec-folder/index.js](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/dist/spec-folder/index.js)

## Findings
### [P1-001]: `context-server.ts` is still a multi-responsibility bootstrap monolith
- Severity: P1
- Evidence: [context-server.ts:1](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1), [context-server.ts:275](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L275), [context-server.ts:433](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L433), [context-server.ts:749](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L749)
- Description: The file header says this module “retains server init, startup, shutdown, and main orchestration only,” but the file still owns request handlers, auto-surface dispatch behavior, pending-file recovery, startup scanning, shutdown sequencing, watcher callbacks, background job startup, and transport wiring. At 1136 lines, `main()` alone spans most of the runtime lifecycle.
- Impact: Small operational changes now require touching one file that mixes unrelated concerns, which raises regression risk and makes safe refactoring slower.
- Fix: Split runtime composition into focused modules such as `startup-validation`, `background-services`, `watcher-lifecycle`, `shutdown`, and `server-bootstrap`, leaving `main()` as thin composition glue.

### [P2-002]: Database root/path resolution is duplicated and already diverges
- Severity: P2
- Evidence: [shared/config.ts:13](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/config.ts#L13), [shared/config.ts:23](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/config.ts#L23), [shared/paths.ts:10](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/paths.ts#L10), [shared/paths.ts:31](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/paths.ts#L31), [shared/README.md:37](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/README.md#L37)
- Description: `shared/config.ts` and `shared/paths.ts` each implement their own upward search and package-root resolution, but they use different heuristics. One checks for `package.json` plus `mcp_server/database`; the other prefers workspace directories and only later falls back to `package.json`.
- Impact: Layout or packaging changes can be fixed in one place and silently stay broken in the other, which is exactly the kind of drift shared infrastructure is supposed to prevent.
- Fix: Centralize package-root and database-dir resolution in one helper and derive both `DB_PATH` and `DB_UPDATED_FILE` from that single source.

### [P2-003]: Barrel files expose overlapping access paths instead of a crisp boundary
- Severity: P2
- Evidence: [api/index.ts:4](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/index.ts#L4), [api/index.ts:57](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/index.ts#L57), [handlers/index.ts:28](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts#L28), [handlers/index.ts:166](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts#L166), [shared/index.ts:82](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/index.ts#L82), [scripts/dist/config/index.js:10](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/dist/config/index.js#L10), [scripts/dist/core/index.js:10](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/dist/core/index.js#L10)
- Description: The codebase uses barrels to expose narrow APIs, raw constants, compatibility aliases, whole namespaces, and direct submodule references at the same time. `handlers/index.ts` exports camelCase handlers, snake_case aliases, and entire module namespaces; `api/index.ts` re-exports deep internals; `shared/index.ts` exports a very broad mixed surface; generated `scripts/dist` barrels preserve the same overlap.
- Impact: This widens the effective public surface, makes dead-code detection harder, and turns internal refactors into change-safety problems because consumers have too many legitimate import paths.
- Fix: Separate `public`, `compat`, and `internal/test` barrels, remove namespace re-exports from public entry points, and keep generated barrels restricted to the supported tier only.

### [P2-004]: Public API documentation has already drifted behind the exported surface
- Severity: P2
- Evidence: [api/README.md:33](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/README.md#L33), [api/index.ts:57](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/index.ts#L57), [api/providers.ts:7](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/providers.ts#L7), [api/search.ts:8](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/search.ts#L8)
- Description: `api/README.md` documents only the high-level module set, but `api/index.ts` also exposes folder discovery, entity extraction, session/causal/working-memory namespaces, extraction metrics, architecture metadata, shared rollout metrics, and roadmap flags. The thin public re-export modules also do not add symbol-level TSDoc, so once the README drifts there is no precise source of truth for consumers.
- Impact: Onboarding and API evolution both get riskier because it is unclear which exports are intentionally supported versus merely reachable.
- Fix: Either narrow `api/index.ts` to match the documented contract or expand the docs/TSDoc to enumerate supported exports and their stability level.

## Summary
- Total findings: 4 (P0: 0, P1: 1, P2: 3)
- newFindingsRatio: 1.00
tokens used
143,026
# Iteration 014: Code Maintainability Review
## Agent: codex / gpt-5.4 / high
## Dimension: maintainability
## Files Reviewed
- [.opencode/skill/system-spec-kit/mcp_server/context-server.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [.opencode/skill/system-spec-kit/mcp_server/api/index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/index.ts)
- [.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts)
- [.opencode/skill/system-spec-kit/mcp_server/api/providers.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/providers.ts)
- [.opencode/skill/system-spec-kit/mcp_server/api/search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/search.ts)
- [.opencode/skill/system-spec-kit/mcp_server/api/storage.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/storage.ts)
- [.opencode/skill/system-spec-kit/mcp_server/api/README.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/README.md)
- [.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts)
- [.opencode/skill/system-spec-kit/mcp_server/handlers/README.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md)
- [.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts)
- [.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md)
- [.opencode/skill/system-spec-kit/shared/index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/index.ts)
- [.opencode/skill/system-spec-kit/shared/config.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/config.ts)
- [.opencode/skill/system-spec-kit/shared/paths.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/paths.ts)
- [.opencode/skill/system-spec-kit/shared/chunking.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/chunking.ts)
- [.opencode/skill/system-spec-kit/shared/README.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/README.md)
- [.opencode/skill/system-spec-kit/scripts/dist/config/index.js](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/dist/config/index.js)
- [.opencode/skill/system-spec-kit/scripts/dist/core/index.js](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/dist/core/index.js)
- [.opencode/skill/system-spec-kit/scripts/dist/loaders/index.js](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/dist/loaders/index.js)
- [.opencode/skill/system-spec-kit/scripts/dist/spec-folder/index.js](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/dist/spec-folder/index.js)

## Findings
### [P1-001]: `context-server.ts` is still a multi-responsibility bootstrap monolith
- Severity: P1
- Evidence: [context-server.ts:1](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1), [context-server.ts:275](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L275), [context-server.ts:433](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L433), [context-server.ts:749](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L749)
- Description: The file header says this module “retains server init, startup, shutdown, and main orchestration only,” but the file still owns request handlers, auto-surface dispatch behavior, pending-file recovery, startup scanning, shutdown sequencing, watcher callbacks, background job startup, and transport wiring. At 1136 lines, `main()` alone spans most of the runtime lifecycle.
- Impact: Small operational changes now require touching one file that mixes unrelated concerns, which raises regression risk and makes safe refactoring slower.
- Fix: Split runtime composition into focused modules such as `startup-validation`, `background-services`, `watcher-lifecycle`, `shutdown`, and `server-bootstrap`, leaving `main()` as thin composition glue.

### [P2-002]: Database root/path resolution is duplicated and already diverges
- Severity: P2
- Evidence: [shared/config.ts:13](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/config.ts#L13), [shared/config.ts:23](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/config.ts#L23), [shared/paths.ts:10](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/paths.ts#L10), [shared/paths.ts:31](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/paths.ts#L31), [shared/README.md:37](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/README.md#L37)
- Description: `shared/config.ts` and `shared/paths.ts` each implement their own upward search and package-root resolution, but they use different heuristics. One checks for `package.json` plus `mcp_server/database`; the other prefers workspace directories and only later falls back to `package.json`.
- Impact: Layout or packaging changes can be fixed in one place and silently stay broken in the other, which is exactly the kind of drift shared infrastructure is supposed to prevent.
- Fix: Centralize package-root and database-dir resolution in one helper and derive both `DB_PATH` and `DB_UPDATED_FILE` from that single source.

### [P2-003]: Barrel files expose overlapping access paths instead of a crisp boundary
- Severity: P2
- Evidence: [api/index.ts:4](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/index.ts#L4), [api/index.ts:57](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/index.ts#L57), [handlers/index.ts:28](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts#L28), [handlers/index.ts:166](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts#L166), [shared/index.ts:82](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/index.ts#L82), [scripts/dist/config/index.js:10](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/dist/config/index.js#L10), [scripts/dist/core/index.js:10](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/dist/core/index.js#L10)
- Description: The codebase uses barrels to expose narrow APIs, raw constants, compatibility aliases, whole namespaces, and direct submodule references at the same time. `handlers/index.ts` exports camelCase handlers, snake_case aliases, and entire module namespaces; `api/index.ts` re-exports deep internals; `shared/index.ts` exports a very broad mixed surface; generated `scripts/dist` barrels preserve the same overlap.
- Impact: This widens the effective public surface, makes dead-code detection harder, and turns internal refactors into change-safety problems because consumers have too many legitimate import paths.
- Fix: Separate `public`, `compat`, and `internal/test` barrels, remove namespace re-exports from public entry points, and keep generated barrels restricted to the supported tier only.

### [P2-004]: Public API documentation has already drifted behind the exported surface
- Severity: P2
- Evidence: [api/README.md:33](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/README.md#L33), [api/index.ts:57](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/index.ts#L57), [api/providers.ts:7](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/providers.ts#L7), [api/search.ts:8](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/search.ts#L8)
- Description: `api/README.md` documents only the high-level module set, but `api/index.ts` also exposes folder discovery, entity extraction, session/causal/working-memory namespaces, extraction metrics, architecture metadata, shared rollout metrics, and roadmap flags. The thin public re-export modules also do not add symbol-level TSDoc, so once the README drifts there is no precise source of truth for consumers.
- Impact: Onboarding and API evolution both get riskier because it is unclear which exports are intentionally supported versus merely reachable.
- Fix: Either narrow `api/index.ts` to match the documented contract or expand the docs/TSDoc to enumerate supported exports and their stability level.

## Summary
- Total findings: 4 (P0: 0, P1: 1, P2: 3)
- newFindingsRatio: 1.00
