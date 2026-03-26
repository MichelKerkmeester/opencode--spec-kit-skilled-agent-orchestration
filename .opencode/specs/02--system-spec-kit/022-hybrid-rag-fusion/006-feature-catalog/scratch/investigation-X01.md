OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce98-b1eb-7061-831f-f16fd55a8574
--------
user
You are investigating undocumented features in an MCP server. Read these source files: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts, /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts, /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts, /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts. Verify these gaps from the scan: Gap 1 (Standalone Admin CLI in cli.ts), Gap 2 (Cross-Process DB Hot Rebinding in core/db-state.ts), Gap 3 (Startup Pending-File Recovery in context-server.ts), Gap 4 (Watcher Delete/Rename Cleanup in context-server.ts). For each gap, confirm it exists in the source code, document the exact implementation, and classify it. 

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
I’m going to inspect the four MCP server files directly and map each requested gap to exact code locations, then I’ll classify each as confirmed, false positive, or new gap with precise line ranges. I’ll start by reading the files with line numbers and searching for logic tied to admin CLI, DB rebinding, startup recovery, and watcher cleanup.
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
 succeeded in 52ms:
     1	#!/usr/bin/env node
     2	// ---------------------------------------------------------------
     3	// MODULE: Cli
     4	// ---------------------------------------------------------------
     5	// Standalone CLI for bulk database operations, runnable from any
     6	// directory. Resolves its own modules via __dirname so
     7	// better-sqlite3 and sqlite-vec load correctly regardless of cwd.
     8	//
     9	// Usage:
    10	//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js stats
    11	//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js bulk-delete --tier deprecated
    12	//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js reindex [--force] [--eager-warmup]
    13	//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js schema-downgrade --to 15 --confirm
    14	// ---------------------------------------------------------------
    15	
    16	// Core modules (resolved relative to this file's location)
    17	import * as vectorIndex from './lib/search/vector-index';
    18	import * as checkpointsLib from './lib/storage/checkpoints';
    19	import * as accessTracker from './lib/storage/access-tracker';
    20	import * as causalEdges from './lib/storage/causal-edges';
 succeeded in 52ms:
Total output lines: 1009

     1	// ---------------------------------------------------------------
     2	// MODULE: Context Server
     3	// ---------------------------------------------------------------
     4	// T303: Decomposed — tool schemas in tool-schemas.ts, dispatch
     5	// logic in tools/*.ts. This file retains server init, startup,
     6	// shutdown, and main orchestration only.
     7	// ---------------------------------------------------------------
     8	
     9	import fs from 'fs';
    10	import path from 'path';
    11	
    12	/* ---------------------------------------------------------------
    13	   1. MODULE IMPORTS
    14	--------------------------------------------------------------- */
    15	
    16	// MCP SDK
    17	import { Server } from '@modelcontextprotocol/sdk/server/index.js';
    18	import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Db State
     3	// ---------------------------------------------------------------
     4	
     5	import fs from 'fs/promises';
     6	import { DB_UPDATED_FILE } from './config';
     7	import type { DatabaseExtended } from '@spec-kit/shared/types';
     8	
     9	/* ---------------------------------------------------------------
    10	   1. TYPES
    11	   --------------------------------------------------------------- */
    12	
    13	/** Minimal vector index interface for database operations */
    14	export interface VectorIndexLike {
    15	  initializeDb(): void;
    16	  getDb(): DatabaseLike | null;
    17	  closeDb?(): void;
    18	  vectorSearch?: unknown;
    19	}
    20	
codex
I’ve confirmed the `cli.ts` and `db-state.ts` pieces and now I’m drilling into the truncated middle of `context-server.ts` so we can pin exact line ranges for pending-file recovery and watcher delete/rename cleanup. Next I’ll pull focused line windows around those functions and callbacks.
exec
/bin/zsh -lc "rg -n \"startupScan|pending|_pending|recover|removeIndexedMemoriesForFile|removeFn|fileWatcher|rename|unlink|delete\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts' | sed -n '400,740p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts' | sed -n '740,1020p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
90:// T107: Transaction manager for pending file recovery on startup (REQ-033)
114:  recovered: number;
199:    const pending = typeof byStatus.pending === 'number' ? byStatus.pending : 0;
210:      staleCount: pending + failed + retry,
397:    // REQ-004: Include recovery hints in all error responses
411:let startupScanInProgress = false;
414: * T107: Recover pending memory files on MCP startup.
415: * CHK-188: Pending files processed by recovery job on next startup.
417: * Scans for files with _pending suffix (created when index failed after file write)
420:async function recoverPendingFiles(basePath: string): Promise<PendingRecoveryResult> {
421:  console.error('[context-server] Checking for pending memory files...');
448:    const rawResults = scanLocations.flatMap(loc => transactionManager.recoverAllPendingFiles(loc));
452:    const recovered = rawResults.filter(r => r.recovered).length;
453:    const failed = found - recovered;
455:    const recoveryResult: PendingRecoveryResult = {
458:      recovered,
463:    if (recoveryResult.found > 0) {
464:      console.error(`[context-server] Pending file recovery: ${recoveryResult.recovered} recovered, ${recoveryResult.failed} failed (${recoveryResult.found} total)`);
466:      console.error('[context-server] No pending memory files found');
469:    return recoveryResult;
 succeeded in 51ms:
   400	    return {
   401	      content: [{ type: 'text', text: JSON.stringify(errorResponse, null, 2) }],
   402	      isError: true
   403	    };
   404	  }
   405	});
   406	
   407	/* ---------------------------------------------------------------
   408	   6. STARTUP SCAN & PENDING FILE RECOVERY
   409	--------------------------------------------------------------- */
   410	
   411	let startupScanInProgress = false;
   412	
   413	/**
   414	 * T107: Recover pending memory files on MCP startup.
   415	 * CHK-188: Pending files processed by recovery job on next startup.
   416	 *
   417	 * Scans for files with _pending suffix (created when index failed after file write)
   418	 * and attempts to index them.
   419	 */
 succeeded in 51ms:
   740	
   741	  // T016-T019: Lazy Embedding Model Loading
   742	  // Default: Skip warmup at startup for <500ms cold start
   743	  // Set SPECKIT_EAGER_WARMUP=true for legacy eager warmup behavior
   744	  const eagerWarmup: boolean = embeddings.shouldEagerWarmup();
   745	
   746	  if (eagerWarmup) {
   747	    // Legacy behavior: Warm up embedding model synchronously at startup
   748	    const WARMUP_TIMEOUT = 60000;
   749	    let warmupCompleted = false;
   750	
   751	    const warmupEmbedding = async (): Promise<boolean> => {
   752	      try {
   753	        console.error('[context-server] Warming up embedding model (eager mode)...');
   754	        const startTime = Date.now();
   755	        await embeddings.generateEmbedding('warmup test');
   756	        warmupCompleted = true;
   757	        setEmbeddingModelReady(true);
   758	        console.error(`[context-server] Embedding model ready (${Date.now() - startTime}ms)`);
   759	        return true;
codex
I now have exact implementations for all four targeted areas. I’ll quickly locate `undocumented-features-scan.md` (and the existing 20-category taxonomy) so I can classify each gap against the right category names instead of guessing.
exec
/bin/zsh -lc "rg --files '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' | rg 'undocumented-features-scan\\.md|category|categories|undocumented-features'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-figma/assets/tool_categories.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-clickup/assets/tool_categories.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/testing/runner/tests/snapshot_tests/joins/snapshots/joins__self-join-category-hierarchy.snap
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/testing/runner/tests/snapshot_tests/analyze/snapshots/analyze__query-after-analyze-category.snap
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
/bin/zsh -lc 'rg -n "20 existing categories|existing categories|Feature Catalog|categories|''^## .*Category|''^[0-9]{2}-" '"'/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 56ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:1:# Decision Record: Feature Catalog Audit & Remediation
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:37:**How it works**: Stream 1 agents each cover 1-3 categories (5-12 snippet files) and verify descriptions + paths against source code. Stream 2 agents each cover a functional zone of the MCP server (4-6 source files) and verify specific gaps from the scan.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:121:**We chose**: 3-tier significance (HIGH/MEDIUM/LOW) crossed with 6-action remediation categories, producing a prioritized manifest.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:123:**How it works**: Each finding gets a significance tier AND an action category. Action categories map to priorities: PATH-VALIDATE is P0, DESC-UPDATE/PATH-ADD/PATH-REMOVE/REWRITE is P1, NEW-FEATURE high-sig is P1, NEW-FEATURE med/low is P2, CATEGORY-MOVE is P2.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:135:**Why this one**: The 6 action categories map directly to what needs to be done to fix each issue, and the significance tiers set execution priority.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:167:- Agent prompts include the 6 action categories
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:188:The prior scan recommended creating new categories (Server Operations, Save Path Intelligence, Infrastructure/Resilience) and splitting catch-all categories (08-Bug-fixes, 14-Pipeline). We need to decide whether to restructure during this audit or keep the current 20-category taxonomy.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:202:**How it works**: Gap investigation agents suggest a category for each new feature. The synthesis phase validates the suggestion against existing categories and assigns the closest match. Category restructuring tracked as a separate future task.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:210:| **Keep 20 (chosen)** | No breaking changes, focused scope | Some categories become crowded | 8/10 |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:211:| Add 3 new categories | Better organization | Breaks tooling, scripts, references | 4/10 |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:214:**Why this one**: Category restructuring is a significant change that would triple the scope of this audit. The current 20 categories can house new features, even if imperfect.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:225:- Some categories may have 20+ features. Mitigation: Track as future improvement
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:233:| 1 | **Necessary?** | PASS | Must decide before agents suggest categories |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:235:| 3 | **Sufficient?** | PASS | 20 categories can absorb 55 new features |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:247:- Remediation manifest maps new features to existing categories
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:249:**How to roll back**: Create new categories if the 20-category structure proves inadequate during remediation.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/spec.md:2:title: "Feature Catalog Comprehensive Audit & Remediation"
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/spec.md:8:# Feature Catalog Comprehensive Audit & Remediation
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/spec.md:17:The Spec Kit Memory MCP server's feature catalog (~180 snippet files across 20 categories) has accumulated documentation drift: inaccurate descriptions, invalid code paths, and 55 undocumented capabilities discovered by a prior 10-agent scan. This spec covers the full audit and remediation: verifying every existing feature against source code, investigating all gaps, and producing corrected documentation.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/spec.md:85:| REQ-001 | Every snippet file verified by at least one agent | 20 verification reports covering all 20 categories |
exec
/bin/zsh -lc "rg -n \"C0[1-9]|C1[0-9]|C20|Category C|20 categories|category C\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:214:**Why this one**: Category restructuring is a significant change that would triple the scope of this audit. The current 20 categories can house new features, even if imperfect.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:235:| 3 | **Sufficient?** | PASS | 20 categories can absorb 55 new features |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/spec.md:17:The Spec Kit Memory MCP server's feature catalog (~180 snippet files across 20 categories) has accumulated documentation drift: inaccurate descriptions, invalid code paths, and 55 undocumented capabilities discovered by a prior 10-agent scan. This spec covers the full audit and remediation: verifying every existing feature against source code, investigating all gaps, and producing corrected documentation.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/spec.md:85:| REQ-001 | Every snippet file verified by at least one agent | 20 verification reports covering all 20 categories |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/spec.md:127:- **NFR-C01**: All 20 categories verified by at least one agent
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/spec.md:128:- **NFR-C02**: All 55 known gaps addressed (no gap left uninvestigated)
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/spec.md:156:| Scope | 20/25 | 180 snippet files, ~216 source files, 20 categories |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/plan.md:163:│   (done)     │     │  │ Stream 1: C01-C20      │  │     │              │     │              │
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/plan.md:193:- Stream 1 (C01-C20) and Stream 2 (X01-X10) run simultaneously
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/plan.md:212:### Stream 1: Verification Agents (C01-C20)
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/plan.md:216:| C01 | 01-retrieval | 9 |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/plan.md:217:| C02 | 02-mutation | 8 |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/plan.md:218:| C03 | 03-discovery + 04-maintenance + 05-lifecycle | 8 |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/plan.md:219:| C04 | 06-analysis + 07-evaluation | 9 |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/plan.md:220:| C05 | 08-bug-fixes (1-6) | 6 |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/plan.md:221:| C06 | 08-bug-fixes (7-12) | 6 |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/plan.md:222:| C07 | 09-eval-measurement (1-8) | 8 |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/plan.md:223:| C08 | 09-eval-measurement (9-15) | 7 |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/plan.md:224:| C09 | 10-graph-signal (1-5) | 5 |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/plan.md:225:| C10 | 10-graph-signal (6-9) + 11-scoring (1-4) | 8 |
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/plan.md' | sed -n '206,242p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   206	| M4 | Documentation Updated | tasks.md and checklist.md reflect findings | Phase D |
   207	
   208	---
   209	
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
exec
/bin/zsh -lc "rg --files '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit' | rg '/(01-retrieval|02-mutation|03-discovery|04-maintenance|05-lifecycle|06-analysis|07-evaluation|08-bug-fixes|09-eval-measurement|10-graph-signal|11-scoring|12-query-intelligence|13-memory-quality|14-pipeline|15-retrieval-enhancements|16-tooling|17-governance|18-ux-hooks|19-decisions|20-flags)/'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:

exec
/bin/zsh -lc "find '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' -type d -name '01-retrieval' -o -name '16-tooling' -o -name '14-pipeline' | head -n 50" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 335ms:

codex
I found the scan and the category taxonomy source. I’m now checking the verification notes to align each gap to the same category naming convention (so the `SUGGESTED_CATEGORY` fields use the exact canonical labels).
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C19.md' | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	OpenAI Codex v0.111.0 (research preview)
     2	--------
     3	workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
     4	model: gpt-5.4
     5	provider: openai
     6	approval: never
     7	sandbox: read-only
     8	reasoning effort: xhigh
     9	reasoning summaries: none
    10	session id: 019cce98-9286-7410-b899-dfbdc0d5e8af
    11	--------
    12	user
    13	You are a feature catalog verification agent. Read each feature snippet file in: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/ (8 files), /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/ (2 files). For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. 
    14	
    15	OUTPUT FORMAT (repeat for each feature file):
    16	---
    17	FEATURE: [filename without path]
    18	DESCRIPTION_ACCURATE: [YES/NO/PARTIAL - does Current Reality match source code?]
    19	CODE_PATHS_VALID: [YES/NO - do all listed file paths exist?]
    20	INVALID_PATHS: [list any paths that do not exist, or NONE]
exec
/bin/zsh -lc "find '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog' -maxdepth 1 -type d | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/.github
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/03--discovery
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/04--maintenance
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/07--evaluation
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks
exec
/bin/zsh -lc "rg -n \"pending-file|pending file|recover pending|startup scan|watcher delete|standalone admin cli|hot rebinding|db hot\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md:1:# Startup pending-file recovery
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md:5:On server startup, the transaction manager scans for leftover `_pending` files created by interrupted atomic-write operations. If a previous `memory_save` wrote the pending file and committed the DB row but crashed before renaming, the pending file is the only surviving copy of the content. The recovery routine finds these orphans via `findPendingFiles()`, renames each to its final path, and increments `totalRecoveries` in the transaction metrics.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md:7:Recovery is automatic and requires no user intervention. If the pending file is stale (the DB row was never committed), it is logged and left for manual review rather than silently deleted.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md:15:| `mcp_server/lib/storage/transaction-manager.ts` | Lib | Atomic write + pending-file recovery |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md:27:- Source feature title: Startup pending-file recovery
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:145:  - [Cross-process DB hot rebinding](#cross-process-db-hot-rebinding)
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1808:### Cross-process DB hot rebinding
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/17-cross-process-db-hot-rebinding.md:1:# Cross-process DB hot rebinding
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/17-cross-process-db-hot-rebinding.md:13:| `mcp_server/core/db-state.ts` | Core | Database state management and hot rebinding |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/17-cross-process-db-hot-rebinding.md:25:- Source feature title: Cross-process DB hot rebinding
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/21-atomic-pending-file-recovery.md:1:# Atomic pending-file recovery
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/21-atomic-pending-file-recovery.md:7:The `findPendingFiles()` function scans the memory directories for files matching the `_pending` suffix. Each discovered pending file is checked against the database: if the corresponding DB row exists (committed), the file is renamed to its final path completing the interrupted operation. The `recoverPendingFile()` function handles individual file recovery and updates the `totalRecoveries` metric. This mechanism ensures zero data loss from interrupted save operations.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/21-atomic-pending-file-recovery.md:28:- Source feature title: Atomic pending-file recovery
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/18-atomic-write-then-index-api.md:5:The `memory_save` handler offers an atomic write-then-index mode where file writing and database indexing are coupled in a single transactional unit. The transaction manager writes the memory content to a `_pending` temporary file, inserts the database row (memory_index, vec_memories, BM25 tokens) inside a SQLite transaction, and only renames the pending file to its final path after the DB commit succeeds. If the DB transaction fails, the pending file is cleaned up and no partial state is left on disk.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/18-atomic-write-then-index-api.md:7:This ensures that a memory file and its corresponding index entry either both exist or neither does. The `AtomicSaveResult` interface reports `dbCommitted` status so callers can distinguish between a full success and a partial commit (DB succeeded but rename failed, leaving a pending file for startup recovery).
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X01.md' | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	OpenAI Codex v0.111.0 (research preview)
     2	--------
     3	workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
     4	model: gpt-5.3-codex
     5	provider: openai
     6	approval: never
     7	sandbox: read-only
     8	reasoning effort: xhigh
     9	reasoning summaries: none
    10	session id: 019cce98-b1eb-7061-831f-f16fd55a8574
    11	--------
    12	user
    13	You are investigating undocumented features in an MCP server. Read these source files: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts, /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts, /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts, /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts. Verify these gaps from the scan: Gap 1 (Standalone Admin CLI in cli.ts), Gap 2 (Cross-Process DB Hot Rebinding in core/db-state.ts), Gap 3 (Startup Pending-File Recovery in context-server.ts), Gap 4 (Watcher Delete/Rename Cleanup in context-server.ts). For each gap, confirm it exists in the source code, document the exact implementation, and classify it. 
    14	
    15	OUTPUT FORMAT (repeat for each gap):
    16	---
    17	GAP_NUMBER: [from undocumented-features-scan.md]
    18	FEATURE_NAME: [descriptive name]
    19	STATUS: [CONFIRMED_GAP/NEW_GAP/FALSE_POSITIVE]
    20	SOURCE_FILES: [file:line-range for implementation]
exec
/bin/zsh -lc "rg -n \"dynamic instructions|token budget|api key validation|graceful shutdown|WAL|warmup|runtime compatibility|node version|sqlite version|auto-surface|afterTool callback|generated-call|file watcher\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
97:| 37 | **7-Layer Tool Architecture Metadata** | `architecture/layer-definitions.ts` | Per-layer token budgets, tool-to-layer mapping, progressive disclosure, task-based recommendations |
127:| 55 | Startup runtime compatibility guards | `startup-checks.ts` | Node ABI drift check, SQLite version validation |
exec
/bin/zsh -lc "rg -n \"dynamic server instructions|api key validation|token budget|graceful shutdown|lazy loading|warmup timeout|after-tool callback|wal mode|journal_mode\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md:5:The layer definitions module (`lib/architecture/layer-definitions.ts`) defines a 7-layer MCP architecture (L1 through L7) where each layer has a designated token budget, priority level, use case description, and list of assigned tools. Layer IDs map to task types (`search`, `browse`, `modify`, `checkpoint`, `analyze`, `maintenance`, `default`) so the system can recommend the appropriate layer for a given operation.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md:7:Each `LayerDefinition` includes: `id`, `name`, `description`, `tokenBudget`, `priority`, `useCase`, and `tools[]`. The architecture metadata is used by the context handler to enforce per-layer token budgets and by the query classifier to route requests to the correct tool subset. This provides structural governance over which tools are available at each abstraction level and how many tokens each layer can consume.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:110:  - [Dynamic token budget allocation](#dynamic-token-budget-allocation)
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:115:  - [Pre-flight token budget validation](#pre-flight-token-budget-validation)
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:211:Each mode has a token budget. Quick gets 800 tokens. Focused gets 1,500. Deep gets 2,000. Resume gets 1,200. After retrieval, the orchestrator estimates token count (1 token per 4 characters) and enforces the budget by stripping lowest-scored results from the tail until the response fits. A dedicated `enforceTokenBudget()` function handles the truncation with detailed tracking of original and returned result counts. When your overall context is running high, a pressure policy kicks in. When the `tokenUsage` ratio exceeds 0.60, the system downgrades to focused mode. Above 0.80, it switches to quick mode. The pressure policy is gated by `SPECKIT_PRESSURE_POLICY` and subject to rollout percentage via `SPECKIT_ROLLOUT_PERCENT`. You can override the mode and intent manually, but the auto-detection handles most cases correctly.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:262:Five operational stages run between fusion and delivery. Stage A (query complexity routing, `SPECKIT_COMPLEXITY_ROUTER`) restricts active channels for simple queries to just vector and FTS, moderate queries add BM25, and complex queries get all five. Stage B (RSF shadow fusion, `SPECKIT_RSF_FUSION`) is historical and no longer active in runtime ranking; RSF artifacts are retained for compatibility/testing references only. Stage C (channel enforcement, `SPECKIT_CHANNEL_MIN_REP`) ensures every contributing channel has at least one result in top-k with a 0.005 quality floor. Stage D (confidence truncation, `SPECKIT_CONFIDENCE_TRUNCATION`) trims the irrelevant tail using a 2x-median gap elbow heuristic. Stage E (dynamic token budget, `SPECKIT_DYNAMIC_TOKEN_BUDGET`) computes tier-aware token limits (simple 1,500, moderate 2,500, complex 4,000).
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:348:Safety mechanisms run deep. Path security validation checks the file against an allowlist of base paths. File type validation accepts only `.md` and `.txt` in approved directories. Pre-flight validation checks anchor format, detects duplicates and estimates token budget before investing in embedding generation. A per-spec-folder mutex lock prevents TOCTOU race conditions when multiple saves target the same folder. SHA-256 content hashing skips unchanged files. A mutation ledger records every create, update, reinforce and supersede action for audit. The trigger matcher cache, tool cache and constitutional cache are all invalidated on write. If embedding generation fails, the memory is still stored and searchable via BM25/FTS5 with the embedding marked as pending for later re-indexing.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1386:### Dynamic token budget allocation
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1392:The savings add up. If 60% of your queries are simple, you recover roughly 40% of the token budget that was previously wasted on over-delivering.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1414:Every memory save operation now computes a quality score based on trigger phrase coverage, anchor format, token budget and content coherence. When the score falls below 0.6, the system auto-fixes by re-extracting triggers, normalizing anchors and trimming content to budget. Then it scores again.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1436:### Pre-flight token budget validation
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1827:Each hook point has a per-point token budget of 4,000 tokens maximum. The tool dispatch hook checks incoming tool arguments for context hints (input, query, prompt, specFolder, filePath or concepts) and surfaces constitutional-tier and trigger-matched memories, but skips memory-aware tools to avoid recursive surfacing loops. Memory-aware tools are handled in-band by the context-server pre-dispatch branch (`autoSurfaceMemories` / `autoSurfaceAtCompaction`). Constitutional memories are cached for 1 minute via an in-memory cache.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:2418:| `MCP_CHARS_PER_TOKEN` | `3.5` | number | `lib/validation/preflight.ts` | Characters-per-token ratio used for token budget estimation during pre-flight validation. Affects whether a memory file is flagged as too large before embedding generation begins. |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:2421:| `MCP_MAX_MEMORY_TOKENS` | `8000` | number | `lib/validation/preflight.ts` | Maximum token budget per memory (estimated via `MCP_CHARS_PER_TOKEN`). Pre-flight validation warns when a memory exceeds this limit. |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:2423:| `MCP_TOKEN_WARNING_THRESHOLD` | `0.8` | number | `lib/validation/preflight.ts` | Fraction of `MCP_MAX_MEMORY_TOKENS` at which a token budget warning is emitted. At 0.8, a warning fires when estimated tokens exceed 80% of the max. |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:23:Safety mechanisms run deep. Path security validation checks the file against an allowlist of base paths. File type validation accepts only `.md` and `.txt` in approved directories. Pre-flight validation checks anchor format, detects duplicates and estimates token budget before investing in embedding generation. A per-spec-folder mutex lock prevents TOCTOU race conditions when multiple saves target the same folder. SHA-256 content hashing skips unchanged files. A mutation ledger records every create, update, reinforce and supersede action for audit. The trigger matcher cache, tool cache and constitutional cache are all invalidated on write. If embedding generation fails, the memory is still stored and searchable via BM25/FTS5 with the embedding marked as pending for later re-indexing.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md:7:Each hook point has a per-point token budget of 4,000 tokens maximum. The tool dispatch hook checks incoming tool arguments for context hints (input, query, prompt, specFolder, filePath or concepts) and surfaces constitutional-tier and trigger-matched memories, but skips memory-aware tools to avoid recursive surfacing loops. Memory-aware tools are handled in-band by the context-server pre-dispatch branch (`autoSurfaceMemories` / `autoSurfaceAtCompaction`). Constitutional memories are cached for 1 minute via an in-memory cache.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:9:Each mode has a token budget. Quick gets 800 tokens. Focused gets 1,500. Deep gets 2,000. Resume gets 1,200. After retrieval, the orchestrator estimates token count (1 token per 4 characters) and enforces the budget by stripping lowest-scored results from the tail until the response fits. A dedicated `enforceTokenBudget()` function handles the truncation with detailed tracking of original and returned result counts. When your overall context is running high, a pressure policy kicks in. When the `tokenUsage` ratio exceeds 0.60, the system downgrades to focused mode. Above 0.80, it switches to quick mode. The pressure policy is gated by `SPECKIT_PRESSURE_POLICY` and subject to rollout percentage via `SPECKIT_ROLLOUT_PERCENT`. You can override the mode and intent manually, but the auto-detection handles most cases correctly.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md:1:# Dynamic token budget allocation
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md:9:The savings add up. If 60% of your queries are simple, you recover roughly 40% of the token budget that was previously wasted on over-delivering.
exec
/bin/zsh -lc "rg -n \"API key|dynamic instructions|graceful shutdown|journal_mode|WAL|afterTool|callId|shutdown|cleanup deadline|embedding warmup|lazy loading\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:

codex
I’ve pinned the exact line ranges for all four requested gaps and validated category names against the 20-category taxonomy. I’m now synthesizing the final gap-by-gap report in your required block format, plus a short set of additional capabilities from these files that are not in the original 1–4 list.
codex
---
GAP_NUMBER: 1  
FEATURE_NAME: Standalone Admin CLI (`spec-kit-cli`)  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `mcp_server/cli.ts:1-14,44-76,82-93,174-344,350-404,410-447,453-483`  
DRAFT_DESCRIPTION: `cli.ts` is a standalone Node entrypoint (`#!/usr/bin/env node`) that runs outside MCP transport and exposes direct DB admin commands. It implements command parsing and dispatch for `stats`, `bulk-delete`, `reindex`, and `schema-downgrade`. The bulk-delete path includes tier safety rules (for example requiring folder scope for `constitutional`/`critical`) and optional checkpointing before deletion. The reindex path reuses handler logic via dynamic import, and the process explicitly closes the DB on completion.  
SUGGESTED_CATEGORY: `16--tooling-and-scripts`  
SIGNIFICANCE: HIGH  
NOTES: This is operationally independent from normal MCP tool invocation and behaves like an admin maintenance binary.

---
GAP_NUMBER: 2  
FEATURE_NAME: Cross-Process DB Hot Rebinding  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `mcp_server/core/db-state.ts:84-96,102-121,123-169`  
DRAFT_DESCRIPTION: `db-state.ts` watches a shared marker file (`DB_UPDATED_FILE`) and triggers rebinding when a newer timestamp is detected. `checkDatabaseUpdated()` compares marker time to `lastDbCheck` and calls `reinitializeDatabase()` on change. Reinitialization is mutex-protected, closes/reopens the DB connection, clears runtime caches, and re-initializes dependent modules (`checkpoints`, `accessTracker`, `hybridSearch`, `sessionManager`, `incrementalIndex`). This is explicit stale-handle recovery logic for multi-process mutation scenarios.  
SUGGESTED_CATEGORY: `14--pipeline-architecture`  
SIGNIFICANCE: HIGH  
NOTES: The mutex prevents concurrent rebind races and the dependency re-init prevents dangling DB handles across modules.

---
GAP_NUMBER: 3  
FEATURE_NAME: Startup Pending-File Recovery  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `mcp_server/context-server.ts:411-475,477-537,1005-1006`  
DRAFT_DESCRIPTION: On startup, the server runs `recoverPendingFiles()` before normal indexing, after embedding readiness check. Recovery scans constrained locations (`specs`, `.opencode/specs`, and discovered `constitutional` directories) and calls `transactionManager.recoverAllPendingFiles()` per location. Results are aggregated into recovered/failed totals and logged, with non-fatal error fallback. `startupScan()` is launched asynchronously via `setImmediate()` once MCP transport is connected.  
SUGGESTED_CATEGORY: `05--lifecycle`  
SIGNIFICANCE: HIGH  
NOTES: Recovery is integrated into boot flow, not a manual maintenance action.

---
GAP_NUMBER: 4  
FEATURE_NAME: Watcher Delete/Rename Cleanup  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `mcp_server/context-server.ts:610-652,959-972`  
DRAFT_DESCRIPTION: `context-server.ts` defines `removeIndexedMemoriesForFile()` to delete indexed rows when a watched file is removed (including rename-away cleanup path). It first attempts canonical-path matching (`canonical_file_path` or `file_path`), then falls back to `file_path`-only SQL for older schema compatibility. Each matched row is deleted through `vectorIndex.deleteMemory()`, and post-mutation hooks run as a non-throwing best effort. The watcher wiring passes this cleanup function as `removeFn` when starting `startFileWatcher()`.  
SUGGESTED_CATEGORY: `16--tooling-and-scripts`  
SIGNIFICANCE: HIGH  
NOTES: Rename/delete event detection originates in the watcher implementation; this file provides the cleanup execution path and registration.

---
GAP_NUMBER: NEW-1  
FEATURE_NAME: Startup API-Key Preflight Gate  
STATUS: NEW_GAP  
SOURCE_FILES: `mcp_server/context-server.ts:702-739`  
DRAFT_DESCRIPTION: Server startup performs preflight embedding API-key validation and can hard-fail boot on invalid credentials. The failure path prints provider/error/action guidance and exits with code 1 unless bypassed via `SPECKIT_SKIP_API_VALIDATION=true`. Validation warnings are logged without blocking startup. This is a startup reliability and operator-feedback capability not included in the requested 1-4 gap set.  
SUGGESTED_CATEGORY: `05--lifecycle`  
SIGNIFICANCE: MEDIUM  
NOTES: This materially changes startup behavior from “fail on first use” to “fail fast at boot”.

---
GAP_NUMBER: NEW-2  
FEATURE_NAME: Dynamic MCP Server Instructions from Live Stats  
STATUS: NEW_GAP  
SOURCE_FILES: `mcp_server/context-server.ts:182-241,989-995`  
DRAFT_DESCRIPTION: The server computes runtime instructions from live memory stats and active search-channel configuration, then injects them via `setInstructions`. The generated text includes indexed-memory counts, stale-memory warnings, and key-tool hints. This is gated by `SPECKIT_DYNAMIC_INIT` and is non-fatal if generation fails. It is a dynamic operator/client guidance capability not in the provided gap subset.  
SUGGESTED_CATEGORY: `18--ux-hooks`  
SIGNIFICANCE: MEDIUM  
NOTES: This affects client-facing initialization context rather than retrieval correctness directly.

---
GAP_NUMBER: NEW-3  
FEATURE_NAME: Deterministic Graceful Shutdown with Async Cleanup Deadline  
STATUS: NEW_GAP  
SOURCE_FILES: `mcp_server/context-server.ts:543-607,654-655`  
DRAFT_DESCRIPTION: Shutdown uses a centralized sequence with idempotence guard, synchronous + asynchronous cleanup steps, and a hard deadline timer. It explicitly awaits watcher/reranker cleanup, closes DB and transport, then exits; a force-exit fallback triggers if cleanup exceeds the deadline. Signal handlers (`SIGTERM`/`SIGINT`) are wired to this path. This is a concrete lifecycle-resilience feature beyond the requested four gaps.  
SUGGESTED_CATEGORY: `05--lifecycle`  
SIGNIFICANCE: MEDIUM  
NOTES: The design avoids resource leaks that can occur when async cleanup is fire-and-forget during process exit.
tokens used
91,285
---
GAP_NUMBER: 1  
FEATURE_NAME: Standalone Admin CLI (`spec-kit-cli`)  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `mcp_server/cli.ts:1-14,44-76,82-93,174-344,350-404,410-447,453-483`  
DRAFT_DESCRIPTION: `cli.ts` is a standalone Node entrypoint (`#!/usr/bin/env node`) that runs outside MCP transport and exposes direct DB admin commands. It implements command parsing and dispatch for `stats`, `bulk-delete`, `reindex`, and `schema-downgrade`. The bulk-delete path includes tier safety rules (for example requiring folder scope for `constitutional`/`critical`) and optional checkpointing before deletion. The reindex path reuses handler logic via dynamic import, and the process explicitly closes the DB on completion.  
SUGGESTED_CATEGORY: `16--tooling-and-scripts`  
SIGNIFICANCE: HIGH  
NOTES: This is operationally independent from normal MCP tool invocation and behaves like an admin maintenance binary.

---
GAP_NUMBER: 2  
FEATURE_NAME: Cross-Process DB Hot Rebinding  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `mcp_server/core/db-state.ts:84-96,102-121,123-169`  
DRAFT_DESCRIPTION: `db-state.ts` watches a shared marker file (`DB_UPDATED_FILE`) and triggers rebinding when a newer timestamp is detected. `checkDatabaseUpdated()` compares marker time to `lastDbCheck` and calls `reinitializeDatabase()` on change. Reinitialization is mutex-protected, closes/reopens the DB connection, clears runtime caches, and re-initializes dependent modules (`checkpoints`, `accessTracker`, `hybridSearch`, `sessionManager`, `incrementalIndex`). This is explicit stale-handle recovery logic for multi-process mutation scenarios.  
SUGGESTED_CATEGORY: `14--pipeline-architecture`  
SIGNIFICANCE: HIGH  
NOTES: The mutex prevents concurrent rebind races and the dependency re-init prevents dangling DB handles across modules.

---
GAP_NUMBER: 3  
FEATURE_NAME: Startup Pending-File Recovery  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `mcp_server/context-server.ts:411-475,477-537,1005-1006`  
DRAFT_DESCRIPTION: On startup, the server runs `recoverPendingFiles()` before normal indexing, after embedding readiness check. Recovery scans constrained locations (`specs`, `.opencode/specs`, and discovered `constitutional` directories) and calls `transactionManager.recoverAllPendingFiles()` per location. Results are aggregated into recovered/failed totals and logged, with non-fatal error fallback. `startupScan()` is launched asynchronously via `setImmediate()` once MCP transport is connected.  
SUGGESTED_CATEGORY: `05--lifecycle`  
SIGNIFICANCE: HIGH  
NOTES: Recovery is integrated into boot flow, not a manual maintenance action.

---
GAP_NUMBER: 4  
FEATURE_NAME: Watcher Delete/Rename Cleanup  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `mcp_server/context-server.ts:610-652,959-972`  
DRAFT_DESCRIPTION: `context-server.ts` defines `removeIndexedMemoriesForFile()` to delete indexed rows when a watched file is removed (including rename-away cleanup path). It first attempts canonical-path matching (`canonical_file_path` or `file_path`), then falls back to `file_path`-only SQL for older schema compatibility. Each matched row is deleted through `vectorIndex.deleteMemory()`, and post-mutation hooks run as a non-throwing best effort. The watcher wiring passes this cleanup function as `removeFn` when starting `startFileWatcher()`.  
SUGGESTED_CATEGORY: `16--tooling-and-scripts`  
SIGNIFICANCE: HIGH  
NOTES: Rename/delete event detection originates in the watcher implementation; this file provides the cleanup execution path and registration.

---
GAP_NUMBER: NEW-1  
FEATURE_NAME: Startup API-Key Preflight Gate  
STATUS: NEW_GAP  
SOURCE_FILES: `mcp_server/context-server.ts:702-739`  
DRAFT_DESCRIPTION: Server startup performs preflight embedding API-key validation and can hard-fail boot on invalid credentials. The failure path prints provider/error/action guidance and exits with code 1 unless bypassed via `SPECKIT_SKIP_API_VALIDATION=true`. Validation warnings are logged without blocking startup. This is a startup reliability and operator-feedback capability not included in the requested 1-4 gap set.  
SUGGESTED_CATEGORY: `05--lifecycle`  
SIGNIFICANCE: MEDIUM  
NOTES: This materially changes startup behavior from “fail on first use” to “fail fast at boot”.

---
GAP_NUMBER: NEW-2  
FEATURE_NAME: Dynamic MCP Server Instructions from Live Stats  
STATUS: NEW_GAP  
SOURCE_FILES: `mcp_server/context-server.ts:182-241,989-995`  
DRAFT_DESCRIPTION: The server computes runtime instructions from live memory stats and active search-channel configuration, then injects them via `setInstructions`. The generated text includes indexed-memory counts, stale-memory warnings, and key-tool hints. This is gated by `SPECKIT_DYNAMIC_INIT` and is non-fatal if generation fails. It is a dynamic operator/client guidance capability not in the provided gap subset.  
SUGGESTED_CATEGORY: `18--ux-hooks`  
SIGNIFICANCE: MEDIUM  
NOTES: This affects client-facing initialization context rather than retrieval correctness directly.

---
GAP_NUMBER: NEW-3  
FEATURE_NAME: Deterministic Graceful Shutdown with Async Cleanup Deadline  
STATUS: NEW_GAP  
SOURCE_FILES: `mcp_server/context-server.ts:543-607,654-655`  
DRAFT_DESCRIPTION: Shutdown uses a centralized sequence with idempotence guard, synchronous + asynchronous cleanup steps, and a hard deadline timer. It explicitly awaits watcher/reranker cleanup, closes DB and transport, then exits; a force-exit fallback triggers if cleanup exceeds the deadline. Signal handlers (`SIGTERM`/`SIGINT`) are wired to this path. This is a concrete lifecycle-resilience feature beyond the requested four gaps.  
SUGGESTED_CATEGORY: `05--lifecycle`  
SIGNIFICANCE: MEDIUM  
NOTES: The design avoids resource leaks that can occur when async cleanup is fire-and-forget during process exit.
