OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce98-c563-7e10-8de1-1c9e835432ce
--------
user
You are investigating undocumented features in an MCP server. Read these source files: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts, /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts. Also check for files matching save/* and pe-orchestration* under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/. Verify these gaps: Gap 5 (Prediction-Error Save Arbitration), Gap 6 (PE Conflict Audit Journal), Gap 7 (Per-Spec-Folder Save Mutex), Gap 8 (Dry-Run Preflight for memory_save), Gap 9 (Atomic Write-Then-Index API). 

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
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m going to inspect the two handler files and all matching `lib/save/*` plus `lib/pe-orchestration*` files, then map each requested gap (5–9) to concrete code evidence with line ranges. I’ll report each one in your exact template and call out any extra capabilities I find.
exec
/bin/zsh -lc "rg --files /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib -g 'save/*' -g 'pe-orchestration*'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files -g 'AGENTS.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:

 succeeded in 52ms:
AGENTS.md
.opencode/specs/03--commands-and-skills/sk-mcp/001-mcp-clickup-creation/context/clickup-cli-main/AGENTS.md
.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/AGENTS.md
.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
codex
I found the root `AGENTS.md` in scope and now I’m enumerating the exact `lib` files that match your `save/*` and `pe-orchestration*` patterns so we can anchor evidence precisely.
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib && rg --files -g 'save/**' -g 'pe-orchestration*'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers && ls -1" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:

 succeeded in 51ms:
README.md
causal-graph.ts
causal-links-processor.ts
checkpoints.ts
chunking-orchestrator.ts
eval-reporting.ts
handler-utils.ts
index.ts
memory-bulk-delete.ts
memory-context.ts
memory-crud-delete.ts
memory-crud-health.ts
memory-crud-list.ts
memory-crud-stats.ts
memory-crud-types.ts
memory-crud-update.ts
memory-crud-utils.ts
memory-crud.ts
memory-index-alias.ts
memory-index-discovery.ts
exec
/bin/zsh -lc "find /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib -maxdepth 3 -type f | sed 's#"'^.*/mcp_server/lib/##'"' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
README.md
architecture/README.md
architecture/layer-definitions.ts
cache/README.md
cache/embedding-cache.ts
cache/scoring/composite-scoring.ts
cache/tool-cache.ts
chunking/anchor-chunker.ts
chunking/chunk-thinning.ts
cognitive/README.md
cognitive/archival-manager.ts
cognitive/attention-decay.ts
cognitive/co-activation.ts
cognitive/fsrs-scheduler.ts
cognitive/prediction-error-gate.ts
cognitive/pressure-monitor.ts
cognitive/rollout-policy.ts
cognitive/temporal-contiguity.ts
cognitive/tier-classifier.ts
cognitive/working-memory.ts
exec
/bin/zsh -lc "find /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib -type f | grep -E '/save/|pe-orchestration' | sed 's#"'^.*/mcp_server/lib/##'"' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:

codex
I confirmed there are currently no files under `lib/` matching `save/*` or `pe-orchestration*`, so I’m now reading `memory-save.ts` and `pe-gating.ts` in full to trace where each gap is or isn’t implemented.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Save Handler
     3	// ---------------------------------------------------------------
     4	/* --- 1. DEPENDENCIES --- */
     5	
     6	// Node built-ins
     7	import { randomUUID } from 'node:crypto';
     8	import path from 'path';
     9	
    10	// Shared packages
    11	import { validateFilePath } from '@spec-kit/shared/utils/path-security';
    12	
    13	// Internal modules
    14	import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core';
    15	import { createFilePathValidator } from '../utils/validators';
    16	import * as memoryParser from '../lib/parsing/memory-parser';
    17	import * as transactionManager from '../lib/storage/transaction-manager';
    18	import * as preflight from '../lib/validation/preflight';
    19	import { requireDb } from '../utils';
    20	import type { MCPResponse } from './types';
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Prediction Error Gating Helpers
     3	// ---------------------------------------------------------------
     4	
     5	import * as vectorIndex from '../lib/search/vector-index';
     6	import * as fsrsScheduler from '../lib/cache/cognitive/fsrs-scheduler';
     7	import * as incrementalIndex from '../lib/storage/incremental-index';
     8	import { classifyEncodingIntent } from '../lib/search/encoding-intent';
     9	import { isEncodingIntentEnabled } from '../lib/search/search-flags';
    10	import { requireDb, toErrorMessage } from '../utils';
    11	import { detectSpecLevelFromParsed } from './handler-utils';
    12	
    13	interface ParsedMemory {
    14	  specFolder: string;
    15	  filePath: string;
    16	  title: string | null;
    17	  triggerPhrases: string[];
    18	  content: string;
    19	  contentHash: string;
    20	  contextType: string;
codex
I’ve confirmed core evidence in both handler files, and next I’m reading the `handlers/save/` orchestration modules (especially `pe-orchestration`) to verify whether Gap 5 is implemented there versus missing under `lib/`.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save && ls -1" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
create-record.ts
db-helpers.ts
dedup.ts
embedding-pipeline.ts
index.ts
pe-orchestration.ts
post-insert.ts
reconsolidation-bridge.ts
response-builder.ts
types.ts
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Pe Orchestration
     3	// ---------------------------------------------------------------
     4	
     5	import type Database from 'better-sqlite3';
     6	
     7	import * as predictionErrorGate from '../../lib/cache/cognitive/prediction-error-gate';
     8	import type { ParsedMemory } from '../../lib/parsing/memory-parser';
     9	import { getMemoryHashSnapshot, appendMutationLedgerSafe } from '../memory-crud-utils';
    10	import {
    11	  findSimilarMemories,
    12	  reinforceExistingMemory,
    13	  markMemorySuperseded,
    14	  updateExistingMemory,
    15	  logPeDecision,
    16	} from '../pe-gating';
    17	import type { PeDecision, SimilarMemory, IndexResult } from './types';
    18	
    19	export interface PeOrchestrationResult {
    20	  decision: PeDecision;
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Index
     3	// ---------------------------------------------------------------
     4	
     5	export * from './types';
     6	export * from './db-helpers';
     7	export * from './dedup';
     8	export * from './embedding-pipeline';
     9	export * from './pe-orchestration';
    10	export * from './reconsolidation-bridge';
    11	export * from './create-record';
    12	export * from './post-insert';
    13	export * from './response-builder';
codex
I’ve located concrete PE orchestration logic in `handlers/save/pe-orchestration.ts`; next I’m pulling `undocumented-features-scan.md` (and the 20 category list) so I can map each gap to the right category in your requested format.
exec
/bin/zsh -lc "rg --files /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public -g 'undocumented-features-scan.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/undocumented-features-scan.md
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/undocumented-features-scan.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"category|Category|20\" /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
 succeeded in 51ms:
Total output lines: 496

/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:16:| **Date** | 2026-03-08 |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:35:**We chose**: Two-stream partitioning with 20 Copilot agents for category-contiguous verification and 10 Codex agents for architecture-zone gap investigation.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:88:- 20 verification reports created in `scratch/verification-C[01-20].md`
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:102:| **Date** | 2026-03-08 |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:123:**How it works**: Each finding gets a significance tier AND an action category. Action categories map to priorities: PATH-VALIDATE is P0, DESC-UPDATE/PATH-ADD/PATH-REMOVE/REWRITE is P1, NEW-FEATURE high-sig is P1, NEW-FEATURE med/low is P2, CATEGORY-MOVE is P2.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:181:| **Date** | 2026-03-08 |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:188:The prior scan recommended creating new categories (Server Operations, Save Path Intelligence, Infrastructure/Resilience) and splitting catch-all categories (08-Bug-fixes, 14-Pipeline). We need to decide whether to restructure during this audit or keep the current 20-category taxonomy.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:193:- The monolithic `feature_catalog.md` uses category-based section ordering
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:194:- Other tooling (generate-source-files.mjs, replace-monolith-source-files.mjs) depends on category directory names
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:200:**We chose**: Keep the existing 20-category structure for this audit. New features go into the closest existing category. Restructuring is deferred to a separate spec.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:202:**How it works**: Gap investigation agents suggest a category for each new feature. The synthesis phase validates the suggestion against existing categories and assigns the closest match. Category restructuring tracked as a separate future task.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:210:| **Keep 20 (chosen)** | No breaking changes, focused scope | Some categories become crowded | 8/10 |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:214:**Why this one**: Category restructuring is a significant change that would triple the scope of this audit. The current 20 categories can house new features, even if imperfect.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:225:- Some categories may have 20+ features. Mitigation: Track as future improvement
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:235:| 3 | **Sufficient?** | PASS | 20 categories can absorb 55 new features |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:246:- Agent prompts specify: suggest existing category from the 20 options
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:249:**How to roll back**: Create new categories if the 20-category structure proves inadequate during remediation.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/spec.md:5:created: "2025-12-01"
exec
/bin/zsh -lc "find /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/feature_catalog -maxdepth 1 -mindepth 1 -type d | sed 's#"'^.*/feature_catalog/##'"' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.github
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
codex
I pulled the 20 existing category directories; now I’m checking whether these five items are already documented in the feature catalog (to distinguish `CONFIRMED_GAP` vs `FALSE_POSITIVE`).
exec
/bin/zsh -lc "rg -n \"Prediction-Error Save Arbitration|PE Conflict Audit Journal|Per-Spec-Folder Save Mutex|Dry-Run Preflight|atomicSaveMemory|memory_conflicts|withSpecFolderLock|memory_save\" /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/feature_catalog -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "find /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/feature_catalog -type f -name '*.md' | sed 's#"'^.*/feature_catalog/##'"' | grep -E 'atomic|preflight|mutex|prediction|conflict|save|memory-save|pe' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:5:**IMPLEMENTED (Sprint 019).** Ingestion moves to a SQLite-persisted job queue (`lib/ops/job-queue.ts`) with lifecycle states `queued → parsing → embedding → indexing → complete/failed/cancelled`, a single sequential worker (one job processing at a time, rest queued), and three new tools: `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`. Coexists with the existing `asyncEmbedding` path in `memory_save` as an alternative for batch operations.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md:1:# Dry-run preflight for memory_save
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md:5:The `memory_save` tool accepts a `dryRun` parameter that runs the full save pipeline — content normalization, quality gate evaluation, deduplication check, token budget estimation — without committing any changes to the database or writing files to disk. The response includes what would have happened: whether the save would pass quality gates, the computed quality score breakdown, any near-duplicate warnings, and the estimated token cost.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md:31:- Source feature title: Dry-run preflight for memory_save
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:22:  - [Memory indexing (memory_save)](#memory-indexing-memory_save)
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:328:### Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:330:`memory_save` is the entry point for getting content into the memory system. You give it a file path. It reads the file, parses metadata from the frontmatter (title, trigger phrases, spec folder, importance tier, context type, causal links), generates a vector embedding and indexes everything into the SQLite database.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:439:Contradiction detection uses regex patterns. All decisions are logged to the `memory_conflicts` table with similarity score, chosen action, contradiction flag, reason, and spec_folder. Document-type-aware weighting adjusts thresholds (constitutional=1.0 down to scratch=0.25). The engine is always active unless `force: true` is passed to bypass arbitration.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:501:Each file that passes through to indexing goes through the full `memory_save` pipeline, which means content normalization, quality gating, reconsolidation, chunk thinning and encoding-intent capture all apply automatically. Large files are split into chunks, and anchor-aware chunk thinning drops low-scoring chunks before they enter the index.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1747:- **Atomic save error tracking (#22):** `atomicSaveMemory` now tracks rename-failure state with a `dbCommitted` flag for better error reporting.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1864:All weight modifications are logged to the `weight_history` table. The cycle fires after every successful `memory_save` when enabled. Runs behind the `SPECKIT_CONSOLIDATION` flag (default ON).
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2078:Shared post-mutation hook automation now runs for `memory_save`, `memory_update`, `memory_delete`, and `memory_bulk_delete`, including atomic save paths. This removes per-handler follow-up drift and makes mutation side effects consistent.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2159:`atomicSaveMemory()` now returns the same `postMutationHooks` envelope shape and UX hint payloads as the primary save path. The finalized follow-up pass also preserved structured partial-indexing guidance so callers can handle partial success consistently. Atomic save responses no longer require special-case parsing compared with standard save responses.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2435:| `MEMORY_ALLOWED_PATHS` | _(cwd)_ | string | `tests/regression-010-index-large-files.vitest.ts` | Colon-separated list of filesystem paths that are allowlisted for memory file access. Used in path security validation to restrict which directories `memory_save` can read from. Defaults to `cwd` if not set. |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md:5:On server startup, the transaction manager scans for leftover `_pending` files created by interrupted atomic-write operations. If a previous `memory_save` wrote the pending file and committed the DB row but crashed before renaming, the pending file is the only surviving copy of the content. The recovery routine finds these orphans via `findPendingFiles()`, renames each to its final path, and increments `totalRecoveries` in the transaction metrics.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/08-prediction-error-save-arbitration.md:5:5-action decision engine during the save path. Examines semantic similarity of new content against existing memories: REINFORCE (>=0.95, boost FSRS stability), UPDATE (0.85-0.94 no contradiction, in-place update), SUPERSEDE (0.85-0.94 with contradiction, deprecate old + create new), CREATE_LINKED (0.70-0.84, new memory + causal edge), CREATE (<0.70, standalone). Contradiction detection via regex patterns. All decisions are logged to the `memory_conflicts` table with similarity, action, contradiction flag, reason, and spec_folder. Document-type-aware weighting (constitutional=1.0 down to scratch=0.25). Always active unless `force: true` is passed.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:1:# Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:5:`memory_save` is the entry point for getting content into the memory system. You give it a file path. It reads the file, parses metadata from the frontmatter (title, trigger phrases, spec folder, importance tier, context type, causal links), generates a vector embedding and indexes everything into the SQLite database.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:221:- Source feature title: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:11:Each file that passes through to indexing goes through the full `memory_save` pipeline, which means content normalization, quality gating, reconsolidation, chunk thinning and encoding-intent capture all apply automatically. Large files are split into chunks, and anchor-aware chunk thinning drops low-scoring chunks before they enter the index.
 succeeded in 51ms:
01--retrieval/04-hybrid-search-pipeline.md
01--retrieval/05-4-stage-pipeline-architecture.md
02--mutation/01-memory-indexing-memorysave.md
02--mutation/06-transaction-wrappers-on-mutation-handlers.md
02--mutation/08-prediction-error-save-arbitration.md
02--mutation/10-per-memory-history-log.md
05--lifecycle/06-startup-pending-file-recovery.md
06--analysis/05-epistemic-baseline-capture-taskpreflight.md
10--graph-signal-activation/01-typed-weighted-degree-channel.md
13--memory-quality-and-indexing/04-spec-folder-description-discovery.md
13--memory-quality-and-indexing/06-reconsolidation-on-save.md
13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md
13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md
14--pipeline-architecture/01-4-stage-pipeline-refactor.md
14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md
14--pipeline-architecture/03-chunk-ordering-preservation.md
14--pipeline-architecture/04-template-anchor-optimization.md
14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md
14--pipeline-architecture/06-learned-relevance-feedback.md
14--pipeline-architecture/07-search-pipeline-safety.md
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/prediction-error-gate.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Prediction Error Gate
     3	// ---------------------------------------------------------------
     4	
     5	import type Database from 'better-sqlite3';
     6	
     7	/* -------------------------------------------------------------
     8	   1. CONSTANTS
     9	----------------------------------------------------------------*/
    10	
    11	const THRESHOLD = {
    12	  DUPLICATE: 0.95,
    13	  HIGH_MATCH: 0.85,
    14	  MEDIUM_MATCH: 0.70,
    15	  LOW_MATCH: 0.50,
    16	} as const;
    17	
    18	const ACTION = {
    19	  CREATE: 'CREATE',
    20	  UPDATE: 'UPDATE',
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/prediction-error-gate.ts | sed -n '320,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   320	    existing_memory_id: existingMemoryId,
   321	    similarity,
   322	    reason,
   323	    contradiction_detected: contradiction.detected ? 1 : 0,
   324	    contradiction_type: contradiction.type,
   325	    new_content_preview: newContentPreview,
   326	    existing_content_preview: existingContentPreview,
   327	    spec_folder: specFolder,
   328	  };
   329	}
   330	
   331	/**
   332	 * Log a conflict record to the database.
   333	 */
   334	function logConflict(record: ConflictRecord): void {
   335	  if (!db) return;
   336	
   337	  try {
   338	    (db.prepare(`
   339	      INSERT INTO memory_conflicts (
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/prediction-error-gate.ts | sed -n '520,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   520	  formatConflictRecord,
   521	  logConflict,
   522	  getConflictStats,
   523	  getRecentConflicts,
   524	  batchEvaluate,
   525	  calculateSimilarityStats,
   526	  filterRelevantCandidates,
   527	  getActionPriority,
   528	  truncateContent,
   529	};
   530	
   531	export type {
   532	  ActionType,
   533	  EvaluationResult,
   534	  ContradictionResult,
   535	  ConflictRecord,
   536	  ConflictStats,
   537	  BatchEvaluationResult,
   538	};
exec
/bin/zsh -lc "for f in /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/08-prediction-error-save-arbitration.md /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/18-atomic-write-then-index-api.md; do echo \"=== "'$f ==="; nl -ba "$f" | sed -n '"'1,220p'; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"memory_conflicts|conflict|audit|journal|mutex|lock|spec-folder|withSpecFolderLock|dryRun|atomicSaveMemory|getAtomicityMetrics\" /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/feature_catalog -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
=== /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/08-prediction-error-save-arbitration.md ===
     1	# Prediction-error save arbitration
     2	
     3	## Current Reality
     4	
     5	5-action decision engine during the save path. Examines semantic similarity of new content against existing memories: REINFORCE (>=0.95, boost FSRS stability), UPDATE (0.85-0.94 no contradiction, in-place update), SUPERSEDE (0.85-0.94 with contradiction, deprecate old + create new), CREATE_LINKED (0.70-0.84, new memory + causal edge), CREATE (<0.70, standalone). Contradiction detection via regex patterns. All decisions are logged to the `memory_conflicts` table with similarity, action, contradiction flag, reason, and spec_folder. Document-type-aware weighting (constitutional=1.0 down to scratch=0.25). Always active unless `force: true` is passed.
     6	
     7	## Source Files
     8	
     9	### Implementation
    10	
    11	| File | Layer | Role |
    12	|------|-------|------|
    13	| `mcp_server/handlers/pe-gating.ts` | Handler | Prediction error gating entry point |
    14	| `mcp_server/handlers/save/pe-orchestration.ts` | Handler | PE orchestration flow |
    15	| `mcp_server/lib/cognitive/prediction-error-gate.ts` | Lib | Prediction error computation |
    16	| `mcp_server/handlers/save/create-record.ts` | Handler | Record creation logic |
    17	
    18	### Tests
    19	
 succeeded in 50ms:
Total output lines: 193

/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md:28:- Current reality source: audit-D04 gap backfill
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md:31:- Current reality source: audit-D04 gap backfill
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md:30:- Current reality source: audit-D04 gap backfill
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md:5:Independent reviews by Gemini 3.1 Pro and Codex gpt-5.3-codex identified 14 issues missed by the original audit. Key fixes:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/02-memory-metadata-update-memoryupdate.md:11:A pre-update hash snapshot is captured for the mutation ledger. Every update records the prior hash, new hash, actor and decision metadata for full auditability.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md:100:| `mcp_server/lib/search/spec-folder-hierarchy.ts` | Lib | Spec folder hierarchy traversal |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md:240:| `mcp_server/tests/spec-folder-hierarchy.vitest.ts` | Folder hierarchy tests |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/10-per-memory-history-log.md:5:The `memory_history` table records a per-memory audit trail of state changes. Each row captures the memory ID, the type of event (created, updated, merged, archived, restored), a timestamp, and optional metadata about the change. This provides a complete lifecycle history for any individual memory, enabling operations like "show me everything that happened to memory #42."
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/10-per-memory-history-log.md:32:- Current reality source: audit-D04 gap backfill
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/03-3-mcp-configuration.md:7:| `MCP_ANCHOR_STRICT` | `false` | boolean | `lib/validation/preflight.ts` | When `'true'`, enforces strict anchor format validation during pre-flight checks. Invalid anchor IDs cause the save to be rejected. Default is lenient mode which logs warnings but does not block. |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md:5:The `memory_save` tool accepts a `dryRun` parameter that runs the full save pipeline — content normalization, quality gate evaluation, deduplication check, token budget estimation — without committing any changes to the database or writing files to disk. The response includes what would have happened: whether the save would pass quality gates, the computed quality score breakdown, any near-duplicate warnings, and the estimated token cost.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md:16:| `mcp_server/handlers/save/types.ts` | Handler | Type definitions including dryRun flag |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md:18:| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod schema with dryRun parameter |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md:19:| `mcp_server/tool-schemas.ts` | Core | Tool schema with dryRun option |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md:32:- Current reality source: audit-D04 gap backfill
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md:57:| `mcp_server/lib/search/spec-folder-hierarchy.ts` | Lib | Spec folder hierarchy traversal |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md:156:| `mcp_server/tests/spec-folder-hierarchy.vitest.ts` | Folder hierarchy tests |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:15:- **Atomic save error tracking (#22):** `atomicSaveMemory` now tracks rename-failure state with a `dbCommitted` flag for better error reporting.
codex
I’ve now validated gaps 5–8 directly in the handler code; I’m doing one quick pass through `transaction-manager.ts` so the Gap 9 atomicity notes are precise (especially around partial-success behavior).
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Transaction Manager
     3	// ---------------------------------------------------------------
     4	// AI-GUARD: Atomic file + index operations with pending file recovery
     5	// ---------------------------------------------------------------
     6	
     7	import * as fs from 'fs';
     8	import * as path from 'path';
     9	
    10	/* -------------------------------------------------------------
    11	   1. CONSTANTS
    12	----------------------------------------------------------------*/
    13	
    14	const PENDING_SUFFIX = '_pending';
    15	const TEMP_SUFFIX = '.tmp';
    16	
    17	/* -------------------------------------------------------------
    18	   2. INTERFACES
    19	----------------------------------------------------------------*/
    20	
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Types
     3	// ---------------------------------------------------------------
     4	
     5	import { buildMutationHookFeedback } from '../../hooks/mutation-feedback';
     6	import type { ParsedMemory } from '../../lib/parsing/memory-parser';
     7	
     8	export interface ValidationResult {
     9	  valid: boolean;
    10	  errors: string[];
    11	  warnings: string[];
    12	}
    13	
    14	export interface SimilarMemory {
    15	  id: number;
    16	  similarity: number;
    17	  content: string;
    18	  stability: number;
    19	  difficulty: number;
    20	  file_path: string;
codex
I’m drafting the final gap verdicts now; I’ll do a quick check of prior investigation output format in this repo so I mirror the expected status semantics exactly (`CONFIRMED_GAP` vs `FALSE_POSITIVE`).
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X05.md | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	OpenAI Codex v0.111.0 (research preview)
     2	--------
     3	workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
     4	model: gpt-5.3-codex
     5	provider: openai
     6	approval: never
     7	sandbox: read-only
     8	reasoning effort: xhigh
     9	reasoning summaries: none
    10	session id: 019cce99-0065-7bb2-8a80-fed11cff810d
    11	--------
    12	user
    13	You are investigating undocumented features in an MCP server. Read the cognitive subsystem files under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/: fsrs-scheduler.ts, archival-manager.ts, working-memory.ts, co-activation.ts, temporal-contiguity.ts. Also check /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/configs/ for memory-types.ts and type-inference.ts. Verify these gaps: Gap 18 (FSRS v4 Review Scheduling), Gap 19 (Automatic Archival Subsystem), Gap 20 (Session-Scoped Working Memory), Gap 21 (Hybrid Spreading Activation), Gap 22 (Temporal Contiguity Layer), Gap 23 (9-Type Memory Taxonomy + Inference). 
    14	
    15	OUTPUT FORMAT (repeat for each gap):
    16	---
    17	GAP_NUMBER: [from undocumented-features-scan.md]
    18	FEATURE_NAME: [descriptive name]
    19	STATUS: [CONFIRMED_GAP/NEW_GAP/FALSE_POSITIVE]
    20	SOURCE_FILES: [file:line-range for implementation]
exec
/bin/zsh -lc "rg -n \"GAP_NUMBER|STATUS|NEW capabilities|FEATURE_NAME\" /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X05.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
17:GAP_NUMBER: [from undocumented-features-scan.md]
18:FEATURE_NAME: [descriptive name]
19:STATUS: [CONFIRMED_GAP/NEW_GAP/FALSE_POSITIVE]
27:Also report any NEW capabilities you find in these files that are not in the gap list.
exec
/bin/zsh -lc "rg -n \"GAP_NUMBER:|FEATURE_NAME:|STATUS:\" /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X*.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X03.md:17:GAP_NUMBER: [from undocumented-features-scan.md]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X03.md:18:FEATURE_NAME: [descriptive name]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X03.md:19:STATUS: [CONFIRMED_GAP/NEW_GAP/FALSE_POSITIVE]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X07.md:17:GAP_NUMBER: [from undocumented-features-scan.md]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X07.md:18:FEATURE_NAME: [descriptive name]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X07.md:19:STATUS: [CONFIRMED_GAP/NEW_GAP/FALSE_POSITIVE]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X10.md:17:GAP_NUMBER: [from undocumented-features-scan.md]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X10.md:18:FEATURE_NAME: [descriptive name]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X10.md:19:STATUS: [CONFIRMED_GAP/NEW_GAP/FALSE_POSITIVE]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X08.md:17:GAP_NUMBER: [from undocumented-features-scan.md]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X08.md:18:FEATURE_NAME: [descriptive name]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X08.md:19:STATUS: [CONFIRMED_GAP/NEW_GAP/FALSE_POSITIVE]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X09.md:17:GAP_NUMBER: [from undocumented-features-scan.md]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X09.md:18:FEATURE_NAME: [descriptive name]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X09.md:19:STATUS: [CONFIRMED_GAP/NEW_GAP/FALSE_POSITIVE]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X05.md:17:GAP_NUMBER: [from undocumented-features-scan.md]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X05.md:18:FEATURE_NAME: [descriptive name]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X05.md:19:STATUS: [CONFIRMED_GAP/NEW_GAP/FALSE_POSITIVE]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X01.md:17:GAP_NUMBER: [from undocumented-features-scan.md]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X01.md:18:FEATURE_NAME: [descriptive name]
exec
/bin/zsh -lc "rg -n \"STATUS: (CONFIRMED_GAP|FALSE_POSITIVE|NEW_GAP)\" /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/investigation-X*.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 55ms:

codex
---
GAP_NUMBER: 5  
FEATURE_NAME: Prediction-Error Save Arbitration  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `handlers/save/pe-orchestration.ts:25-163`; `handlers/pe-gating.ts:99-131`; `lib/cache/cognitive/prediction-error-gate.ts:18-24,200-290`  
DRAFT_DESCRIPTION: The save pipeline runs a 5-action PE decision flow (`CREATE`, `UPDATE`, `SUPERSEDE`, `REINFORCE`, `CREATE_LINKED`) after similarity candidate lookup in the same spec folder. `force: true` bypasses this arbitration path, while normal flow applies action-specific behavior (reinforce stability, in-place update, supersede old record, or create new).  
SUGGESTED_CATEGORY: `02--mutation`  
SIGNIFICANCE: HIGH  
NOTES: No `lib/save/*` or `lib/pe-orchestration*` files exist; orchestration lives in `handlers/save/pe-orchestration.ts`.
---

---
GAP_NUMBER: 6  
FEATURE_NAME: PE Conflict Audit Journal  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `handlers/pe-gating.ts:299-337`; `lib/cache/cognitive/prediction-error-gate.ts:267-281,334-424`  
DRAFT_DESCRIPTION: PE outcomes are persisted to `memory_conflicts` with action, similarity, contradiction fields, reason, and spec folder metadata. The code also exposes conflict analytics helpers (`getConflictStats`, `getRecentConflicts`) for audit visibility, with best-effort error handling when logging fails.  
SUGGESTED_CATEGORY: `02--mutation`  
SIGNIFICANCE: HIGH  
NOTES: There are two logging paths (`logPeDecision` and `logConflict`) with slightly different payload detail.
---

---
GAP_NUMBER: 7  
FEATURE_NAME: Per-Spec-Folder Save Mutex  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `handlers/memory-save.ts:87-103,161-169,276`  
DRAFT_DESCRIPTION: Saves are serialized per `specFolder` through an in-process promise-chain mutex (`SPEC_FOLDER_LOCKS` + `withSpecFolderLock`). Dedup, chunking, embedding, PE decisions, and create/update behavior all run inside this lock to reduce TOCTOU races for concurrent saves into the same folder.  
SUGGESTED_CATEGORY: `14--pipeline-architecture`  
SIGNIFICANCE: HIGH  
NOTES: Mutex scope is process-local, not cross-process/distributed.
---

---
GAP_NUMBER: 8  
FEATURE_NAME: Dry-Run Preflight for `memory_save`  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `handlers/memory-save.ts:287-323,324-350,352-373`  
DRAFT_DESCRIPTION: `memory_save` accepts `dryRun` and returns a non-mutating preflight result envelope (`status: "dry_run"`, pass/fail, structured validation details, hints). In dry-run mode, execution exits before indexing/write operations, so callers can validate safely before committing.  
SUGGESTED_CATEGORY: `13--memory-quality-and-indexing`  
SIGNIFICANCE: HIGH  
NOTES: This is preflight-only dry-run, not full pipeline simulation.
---

---
GAP_NUMBER: 9  
FEATURE_NAME: Atomic Write-Then-Index API  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `handlers/memory-save.ts:391-406,407-499,501-504`; `lib/storage/transaction-manager.ts:157-236,60-62`  
DRAFT_DESCRIPTION: `atomicSaveMemory()` performs atomic file write via pending-file rename semantics, then runs indexing asynchronously and reports partial success when indexing fails. The API includes retry guidance and exposes transaction metrics through `getAtomicityMetrics()`.  
SUGGESTED_CATEGORY: `14--pipeline-architecture`  
SIGNIFICANCE: HIGH  
NOTES: Handler comments explicitly state this is not fully atomic across file write + index update.
---

NEW capabilities found outside gaps 5–9:
- PE mutation-ledger enrichment with prior/new hash snapshots and decision metadata on REINFORCE/UPDATE (`handlers/save/pe-orchestration.ts:69-93,111-139`).
- Defensive PE fallback that downgrades invalid action outputs (missing `existingMemoryId`) to `CREATE` (`handlers/save/pe-orchestration.ts:55-64`).
- Conflict analytics utilities beyond raw logging (`batchEvaluate`, similarity stats, action priority helpers) in the PE gate library (`lib/cache/cognitive/prediction-error-gate.ts:430-504`).
tokens used
93,278
---
GAP_NUMBER: 5  
FEATURE_NAME: Prediction-Error Save Arbitration  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `handlers/save/pe-orchestration.ts:25-163`; `handlers/pe-gating.ts:99-131`; `lib/cache/cognitive/prediction-error-gate.ts:18-24,200-290`  
DRAFT_DESCRIPTION: The save pipeline runs a 5-action PE decision flow (`CREATE`, `UPDATE`, `SUPERSEDE`, `REINFORCE`, `CREATE_LINKED`) after similarity candidate lookup in the same spec folder. `force: true` bypasses this arbitration path, while normal flow applies action-specific behavior (reinforce stability, in-place update, supersede old record, or create new).  
SUGGESTED_CATEGORY: `02--mutation`  
SIGNIFICANCE: HIGH  
NOTES: No `lib/save/*` or `lib/pe-orchestration*` files exist; orchestration lives in `handlers/save/pe-orchestration.ts`.
---

---
GAP_NUMBER: 6  
FEATURE_NAME: PE Conflict Audit Journal  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `handlers/pe-gating.ts:299-337`; `lib/cache/cognitive/prediction-error-gate.ts:267-281,334-424`  
DRAFT_DESCRIPTION: PE outcomes are persisted to `memory_conflicts` with action, similarity, contradiction fields, reason, and spec folder metadata. The code also exposes conflict analytics helpers (`getConflictStats`, `getRecentConflicts`) for audit visibility, with best-effort error handling when logging fails.  
SUGGESTED_CATEGORY: `02--mutation`  
SIGNIFICANCE: HIGH  
NOTES: There are two logging paths (`logPeDecision` and `logConflict`) with slightly different payload detail.
---

---
GAP_NUMBER: 7  
FEATURE_NAME: Per-Spec-Folder Save Mutex  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `handlers/memory-save.ts:87-103,161-169,276`  
DRAFT_DESCRIPTION: Saves are serialized per `specFolder` through an in-process promise-chain mutex (`SPEC_FOLDER_LOCKS` + `withSpecFolderLock`). Dedup, chunking, embedding, PE decisions, and create/update behavior all run inside this lock to reduce TOCTOU races for concurrent saves into the same folder.  
SUGGESTED_CATEGORY: `14--pipeline-architecture`  
SIGNIFICANCE: HIGH  
NOTES: Mutex scope is process-local, not cross-process/distributed.
---

---
GAP_NUMBER: 8  
FEATURE_NAME: Dry-Run Preflight for `memory_save`  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `handlers/memory-save.ts:287-323,324-350,352-373`  
DRAFT_DESCRIPTION: `memory_save` accepts `dryRun` and returns a non-mutating preflight result envelope (`status: "dry_run"`, pass/fail, structured validation details, hints). In dry-run mode, execution exits before indexing/write operations, so callers can validate safely before committing.  
SUGGESTED_CATEGORY: `13--memory-quality-and-indexing`  
SIGNIFICANCE: HIGH  
NOTES: This is preflight-only dry-run, not full pipeline simulation.
---

---
GAP_NUMBER: 9  
FEATURE_NAME: Atomic Write-Then-Index API  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `handlers/memory-save.ts:391-406,407-499,501-504`; `lib/storage/transaction-manager.ts:157-236,60-62`  
DRAFT_DESCRIPTION: `atomicSaveMemory()` performs atomic file write via pending-file rename semantics, then runs indexing asynchronously and reports partial success when indexing fails. The API includes retry guidance and exposes transaction metrics through `getAtomicityMetrics()`.  
SUGGESTED_CATEGORY: `14--pipeline-architecture`  
SIGNIFICANCE: HIGH  
NOTES: Handler comments explicitly state this is not fully atomic across file write + index update.
---

NEW capabilities found outside gaps 5–9:
- PE mutation-ledger enrichment with prior/new hash snapshots and decision metadata on REINFORCE/UPDATE (`handlers/save/pe-orchestration.ts:69-93,111-139`).
- Defensive PE fallback that downgrades invalid action outputs (missing `existingMemoryId`) to `CREATE` (`handlers/save/pe-orchestration.ts:55-64`).
- Conflict analytics utilities beyond raw logging (`batchEvaluate`, similarity stats, action priority helpers) in the PE gate library (`lib/cache/cognitive/prediction-error-gate.ts:430-504`).
