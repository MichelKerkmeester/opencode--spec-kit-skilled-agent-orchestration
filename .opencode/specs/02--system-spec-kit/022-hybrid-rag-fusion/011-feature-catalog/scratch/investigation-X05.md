OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce99-0065-7bb2-8a80-fed11cff810d
--------
user
You are investigating undocumented features in an MCP server. Read the cognitive subsystem files under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/: fsrs-scheduler.ts, archival-manager.ts, working-memory.ts, co-activation.ts, temporal-contiguity.ts. Also check /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/configs/ for memory-types.ts and type-inference.ts. Verify these gaps: Gap 18 (FSRS v4 Review Scheduling), Gap 19 (Automatic Archival Subsystem), Gap 20 (Session-Scoped Working Memory), Gap 21 (Hybrid Spreading Activation), Gap 22 (Temporal Contiguity Layer), Gap 23 (9-Type Memory Taxonomy + Inference). 

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
I’ll inspect the seven files you listed, map each requested gap (18–23) to concrete implementation evidence with line ranges, and then classify each as `CONFIRMED_GAP`, `FALSE_POSITIVE`, or `NEW_GAP`. I’m starting by reading those files directly and extracting the relevant code paths.
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/configs/memory-types.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/configs/type-inference.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:
nl: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/configs/memory-types.ts: No such file or directory
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Temporal Contiguity
     3	// ---------------------------------------------------------------
     4	// Boost search results when memories are temporally adjacent,
     5	// query temporal neighbors, and build spec-folder timelines.
     6	// ---------------------------------------------------------------
     7	
     8	import type Database from 'better-sqlite3';
     9	
    10	/* -------------------------------------------------------------
    11	   1. CONSTANTS
    12	----------------------------------------------------------------*/
    13	
    14	export const DEFAULT_WINDOW = 3600;   // 1 hour in seconds
    15	export const MAX_WINDOW = 86400;      // 24 hours in seconds
    16	
    17	const BOOST_FACTOR = 0.15;
    18	// AI-WHY: Cap the cumulative contiguity boost per result so that a cluster of
    19	// many temporally-close memories cannot inflate a score unboundedly.
    20	const MAX_TOTAL_BOOST = 0.5;
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Working Memory
     3	// ---------------------------------------------------------------
     4	// AI-WHY: Session-based attention management
     5	// DECAY STRATEGY (ADR-004): This module handles SESSION-SCOPED decay
     6	// only (event-distance based: score * pow(0.85, eventsElapsed)). It operates on
     7	// the working_memory table, NOT memory_index. This is intentionally
     8	// independent of FSRS long-term decay — different time scale, different
     9	// domain (ephemeral session attention vs persistent memory scoring).
    10	// The T214/T008 decay/delete separation (floor=0.05, deleteThreshold=0.01)
    11	// ensures stable resting state and explicit low-score eviction.
    12	// ---------------------------------------------------------------
    13	
    14	import type Database from 'better-sqlite3';
    15	import { isFeatureEnabled } from './rollout-policy';
    16	
    17	/* --- 1. CONFIGURATION --- */
    18	
    19	interface WorkingMemoryConfigType {
    20	  enabled: boolean;
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Fsrs Scheduler
     3	// ---------------------------------------------------------------
     4	// AI-GUARD: CANONICAL FSRS CONSTANTS & ALGORITHM
     5	// Free Spaced Repetition Scheduler v4 algorithm implementation
     6	//
     7	// T301: TWO-DOMAIN DECAY MODEL (Single Source of Truth)
     8	// -----------------------------------------------------
     9	// Long-term memory (this file):
    10	//   FSRS v4 power-law: R(t) = (1 + FSRS_FACTOR * t/S)^FSRS_DECAY
    11	//   Timescale: days/weeks. Constants: FSRS_FACTOR=19/81, FSRS_DECAY=-0.5
    12	// All long-term decay consumers MUST import constants from this file.
    13	//
    14	// Working memory (working-memory.ts — separate system, intentionally decoupled):
    15	//   Linear multiplicative: score * 0.95 per tick
    16	//   Timescale: minutes. Operates on session-scoped attention scores only.
    17	//
    18	// DECAY STRATEGY (ADR-004): This is the CANONICAL long-term decay
    19	// algorithm. All temporal decay for persistent memories should route
    20	// through calculateRetrievability(). Formula: R(t) = (1 + 19/81 * t/S)^(-0.5)
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Co Activation
     3	// ---------------------------------------------------------------
     4	// Spreading activation for related memory retrieval
     5	
     6	import type Database from 'better-sqlite3';
     7	
     8	/* --- 1. CONFIGURATION --- */
     9	
    10	/**
    11	 * Default co-activation boost strength when SPECKIT_COACTIVATION_STRENGTH is not set.
    12	 *
    13	 * Intentional deviation from Sprint 1 spec (which listed 0.2): empirical tuning raised
    14	 * this to 0.25 for better discovery recall. The R17 fan-effect divisor (sqrt scaling)
    15	 * keeps hub-node inflation in check, so a higher raw factor remains safe. Tests are
    16	 * written against 0.25 and serve as the authoritative contract going forward.
    17	 */
    18	const DEFAULT_COACTIVATION_STRENGTH = 0.25;
    19	
    20	const CO_ACTIVATION_CONFIG = {
 succeeded in 50ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Archival Manager
     3	// ---------------------------------------------------------------
     4	// Background archival job for dormant/archived memories
     5	// ---------------------------------------------------------------
     6	
     7	import type Database from 'better-sqlite3';
     8	
     9	/* -------------------------------------------------------------
    10	   1. DEPENDENCIES (lazy-loaded)
    11	----------------------------------------------------------------*/
    12	
    13	// AI-WHY: Lazy-load tier-classifier to avoid circular dependencies
    14	let tierClassifierModule: Record<string, unknown> | null = null;
    15	
    16	function getTierClassifier(): Record<string, unknown> | null {
    17	  if (tierClassifierModule !== null) return tierClassifierModule;
    18	  try {
    19	    // eslint-disable-next-line @typescript-eslint/no-require-imports
    20	    tierClassifierModule = require('./tier-classifier');
 exited 1 in 50ms:
nl: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/configs/type-inference.ts: No such file or directory
codex
I found all five cognitive files and captured their implementations; two config paths didn’t exist at `mcp_server/configs`. Next I’ll locate the actual `memory-types.ts` and `type-inference.ts` paths and map them into the same gap analysis.
exec
/bin/zsh -lc "rg --files '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server' | rg 'memory-types\\.ts|type-inference\\.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server' | rg 'undocumented-features-scan\\.md|gap|document'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts
 succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/evidence-gap-detector.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts
exec
/bin/zsh -lc "rg --files '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' | rg 'undocumented-features-scan\\.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/undocumented-features-scan.md
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/undocumented-features-scan.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Type Inference
     3	// ---------------------------------------------------------------
     4	// CONFIG: TYPE INFERENCE
     5	// ---------------------------------------------------------------
     6	
     7	import {
     8	  MEMORY_TYPES,
     9	  PATH_TYPE_PATTERNS,
    10	  KEYWORD_TYPE_MAP,
    11	  getDefaultType,
    12	  isValidType,
    13	} from './memory-types';
    14	
    15	import type { MemoryTypeName, MemoryTypeConfig } from './memory-types';
    16	
    17	// ---------------------------------------------------------------
    18	// 1. TYPES
    19	// ---------------------------------------------------------------
    20	
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Types
     3	// ---------------------------------------------------------------
     4	// CONFIG: MEMORY TYPES
     5	// ---------------------------------------------------------------
     6	
     7	// ---------------------------------------------------------------
     8	// 1. TYPES
     9	// ---------------------------------------------------------------
    10	
    11	/**
    12	 * Describes the MemoryTypeConfig shape.
    13	 */
    14	export interface MemoryTypeConfig {
    15	  halfLifeDays: number | null;
    16	  description: string;
    17	  autoExpireDays: number | null;
    18	  decayEnabled: boolean;
    19	}
    20	
 succeeded in 51ms:
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
/bin/zsh -lc "ls -1 '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
checklist.md
decision-record.md
description.json
memory
plan.md
scratch
spec.md
tasks.md
undocumented-features-scan.md
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/description.json'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	{
     2	  "specFolder": "02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog",
     3	  "level": 3,
     4	  "description": "Feature Catalog Comprehensive Audit & Remediation",
     5	  "keywords": [
     6	    "feature",
     7	    "catalog",
     8	    "audit",
     9	    "remediation",
    10	    "verification"
    11	  ],
    12	  "lastUpdated": "2026-03-08T18:45:00.000Z",
    13	  "specId": "011",
    14	  "folderSlug": "feature-catalog",
    15	  "parentChain": [
    16	    "02--system-spec-kit",
    17	    "022-hybrid-rag-fusion"
    18	  ],
    19	  "memorySequence": 0,
    20	  "memoryNameHistory": []
exec
/bin/zsh -lc "rg -n \"category|categories|01-|20|Feature Catalog|catalog\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
Total output lines: 1082

/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:1:# Decision Record: Feature Catalog Audit & Remediation
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:16:| **Date** | 2026-03-08 |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:35:**We chose**: Two-stream partitioning with 20 Copilot agents for category-contiguous verification and 10 Codex agents for architecture-zone gap investigation.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:37:**How it works**: Stream 1 agents each cover 1-3 categories (5-12 snippet files) and verify descriptions + paths against source code. Stream 2 agents each cover a functional zone of the MCP server (4-6 source files) and verify specific gaps from the scan.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:79:| 5 | **Open Horizons?** | PASS | Pattern reusable for future catalog audits |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:88:- 20 verification reports created in `scratch/verification-C[01-20].md`
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:89:- 10 investigation reports created in `scratch/investigation-X[01-10].md`
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:102:| **Date** | 2026-03-08 |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:121:**We chose**: 3-tier significance (HIGH/MEDIUM/LOW) crossed with 6-action remediation categories, producing a prioritized manifest.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:123:**How it works**: Each finding gets a significance tier AND an action category. Action categories map to priorities: PATH-VALIDATE is P0, DESC-UPDATE/PATH-ADD/PATH-REMOVE/REWRITE is P1, NEW-FEATURE high-sig is P1, NEW-FEATURE med/low is P2, CATEGORY-MOVE is P2.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:135:**Why this one**: The 6 action categories map directly to what needs to be done to fix each issue, and the significance tiers set execution priority.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:167:- Agent prompts include the 6 action categories
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:181:| **Date** | 2026-03-08 |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:188:The prior scan recommended creating new categories (Server Operations, Save Path Intelligence, Infrastructure/Resilience) and splitting catch-all categories (08-Bug-fixes, 14-Pipeline). We need to decide whether to restructure during this audit or keep the current 20-category taxonomy.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:193:- The monolithic `feature_catalog.md` uses category-based section ordering
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:194:- Other tooling (generate-source-files.mjs, replace-monolith-source-files.mjs) depends on category directory names
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:200:**We chose**: Keep the existing 20-category structure for this audit. New features go into the closest existing category. Restructuring is deferred to a separate spec.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/decision-record.md:202:**How it works**: Gap investigation agents suggest a category for each new feature. The synthesis phase validates the suggestion against existing categories and assigns the closest match. Category restructuring tracked as a separate future task.
codex
I’ve located the scan file and confirmed these six are listed as medium-significance cognitive gaps there. I’m now pulling the current feature-catalog category list so each gap can be mapped to one of the existing 20 categories accurately.
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
/bin/zsh -lc "rg -n \"FSRS v4 Review Scheduling|Automatic Archival Subsystem|Session-Scoped Working Memory|Hybrid Spreading Activation|Temporal Contiguity Layer|9-Type Memory Taxonomy|memory taxonomy|type inference|working memory|archival subsystem|spreading activation|temporal contiguity\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md:1:# Automatic archival subsystem
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md:30:- Source feature title: Automatic archival subsystem
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md:25:| `mcp_server/lib/config/type-inference.ts` | Lib | Memory type inference |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md:62:| `mcp_server/lib/config/type-inference.ts` | Lib | Memory type inference |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md:30:| `mcp_server/lib/config/type-inference.ts` | Lib | Memory type inference |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:215:Session management is built in. You can pass a `sessionId` for cross-turn deduplication (the system tracks which memories were already sent in this session and skips them) and working memory integration (attention-scored memories from previous turns carry over). In resume mode with `autoResumeEnabled`, the handler pulls working memory context items and injects them as `systemPromptContext` into the response. If you do not pass a session ID, an ephemeral UUID is generated for that single call.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:829:The `cleanupOldSessions()` method in the working memory manager compared `last_focused` timestamps (stored via SQLite `CURRENT_TIMESTAMP` as `YYYY-MM-DD HH:MM:SS`) against JavaScript `toISOString()` output (`YYYY-MM-DDTHH:MM:SS.sssZ`). The lexicographic comparison failed because space (ASCII 32) sorts before `T` (ASCII 84), causing active sessions to be incorrectly deleted. The fix replaces the JavaScript Date comparison with SQLite-native `datetime()` math: `DELETE FROM working_memory_sessions WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')`, keeping the comparison entirely within SQLite's datetime system.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2347:| `SPECKIT_EVENT_DECAY` | `true` | boolean | `lib/cognitive/working-memory.ts` | Enables FSRS-based attention decay in the working memory system. Scores decay each turn via exponential degradation. When disabled, attention scores do not degrade over the session. |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2377:| `SPECKIT_SESSION_BOOST` | `true` | boolean | `lib/search/session-boost.ts` | Enables session-attention boosting. Memories from the current session's working memory receive a 0.15× score boost. Combined with causal boost, the ceiling is 0.20. Uses session identity for rollout-based gating. |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2383:| `SPECKIT_WORKING_MEMORY` | `true` | boolean | `lib/cognitive/working-memory.ts` | Enables the working memory system which tracks attention scores for memories seen in the current session. Working memory context is injected during resume mode and influences session-boost scoring. |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md:1:# Tool-result extraction to working memory
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md:5:The working memory module (`lib/cognitive/working-memory.ts`) captures salient results from tool invocations and stores them as session-scoped attention items. When a retrieval tool returns results, the system extracts key findings and inserts them into the `working_memory` table with an attention score. These extracted items persist across turns within the same session, enabling cross-turn context continuity.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md:7:The checkpoint module (`lib/storage/checkpoints.ts`) also participates by preserving working memory state during checkpoint creation so that restored sessions retain their accumulated tool-result context. Attention scores decay with an event-distance model (0.85 per event elapsed) with a floor of 0.05 and explicit eviction at 0.01, ensuring that recent tool results remain prominent while older ones gracefully fade.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md:16:| `mcp_server/lib/storage/checkpoints.ts` | Lib | Checkpoint preservation of working memory |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md:24:| `mcp_server/tests/checkpoint-working-memory.vitest.ts` | Checkpoint working memory tests |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md:29:- Source feature title: Tool-result extraction to working memory
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/03--discovery/02-system-statistics-memorystats.md:64:| `mcp_server/lib/config/type-inference.ts` | Lib | Memory type inference |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md:21:| `mcp_server/lib/config/type-inference.ts` | Lib | Memory type inference |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/03-implemented-auto-entity-extraction.md:25:| `mcp_server/tests/checkpoint-working-memory.vitest.ts` | Checkpoint working memory |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:69:| `mcp_server/lib/config/type-inference.ts` | Lib | Memory type inference |
exec
/bin/zsh -lc "rg -n \"fsrs|review scheduling|spreading activation|co-activation|memory taxonomy|meta-cognitive|type inference|working memory\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog' | head -n 200" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
Total output lines: 196

/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md:25:| `mcp_server/lib/config/type-inference.ts` | Lib | Memory type inference |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md:21:| `mcp_server/lib/config/type-inference.ts` | Lib | Memory type inference |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:22:| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:23:| `mcp_server/lib/cognitive/fsrs-scheduler.ts` | Lib | FSRS scheduling algorithm |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:121:| `mcp_server/tests/co-activation.vitest.ts` | Co-activation spreading tests |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:142:| `mcp_server/tests/fsrs-scheduler.vitest.ts` | FSRS scheduler tests |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md:5:The legacy V1 pipeline  was the root cause of 3 of 4 P0 bugs: an inverted `STATE_PRIORITY` map, divergent scoring order in `postSearchPipeline()`, and a mismatched `MAX_DEEP_QUERY_VARIANTS=6`. Since V2 was already the default, removing the dead code resolved all three at once. Deleted functions: `STATE_PRIORITY`, `MAX_DEEP_QUERY_VARIANTS`, `buildDeepQueryVariants()`, `strengthenOnAccess()`, `applyTestingEffect()`, `filterByMemoryState()`, `applyCrossEncoderReranking()`, `applyIntentWeightsToResults()`, `shouldApplyPostSearchIntentWeighting()`, `postSearchPipeline()`. The `isPipelineV2Enabled()` function now always returns `true` with a deprecation comment. Unused imports (`fsrsScheduler`, `tierClassifier`, `crossEncoder`) were removed.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md:18:| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md:89:| `mcp_server/tests/co-activation.vitest.ts` | Co-activation spreading tests |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md:72:| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md:73:| `mcp_server/lib/cognitive/fsrs-scheduler.ts` | Lib | FSRS scheduling algorithm |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md:80:| `mcp_server/lib/config/type-inference.ts` | Lib | Memory type inference |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md:239:| `mcp_server/tests/checkpoint-working-memory.vitest.ts` | Checkpoint working memory |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md:243:| `mcp_server/tests/co-activation.vitest.ts` | Co-activation spreading tests |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md:279:| `mcp_server/tests/fsrs-scheduler.vitest.ts` | FSRS scheduler tests |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:11:Stage 2 (Fusion and Signal Integration) applies scoring/enrichment in a fixed order: session boost, causal boost, co-activation spreading, community co-retrieval (N2c from precomputed `community_assignments`), graph signals (N2a+N2b — additive momentum/depth bonuses), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection (N2c) runs before graph signals (N2a+N2b) so injected rows also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:30:| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:31:| `mcp_server/lib/cognitive/fsrs-scheduler.ts` | Lib | FSRS scheduling algorithm |
exec
/bin/zsh -lc "ls -1 '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
01-typed-weighted-degree-channel.md
02-co-activation-boost-strength-increase.md
03-edge-density-measurement.md
04-weight-history-audit-tracking.md
05-graph-momentum-scoring.md
06-causal-depth-signal.md
07-community-detection.md
08-graph-and-cognitive-memory-fixes.md
09-anchor-tags-as-graph-nodes.md
10-causal-neighbor-boost-and-injection.md
11-temporal-contiguity-layer.md
exec
/bin/zsh -lc "find '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog' -type f -name '*.md' | rg -n 'fsrs|working-memory|memory-type|type-inference|spreading|co-activation|archival|temporal|taxonomy|inference'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
18:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/02-co-activation-boost-strength-increase.md
19:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/11-temporal-contiguity-layer.md
26:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md
99:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md
112:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md
117:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md
175:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/11-temporal-contiguity-layer.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/02-co-activation-boost-strength-increase.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	# Automatic archival subsystem
     2	
     3	## Current Reality
     4	
     5	The archival manager (`lib/cognitive/archival-manager.ts`) is a background job that identifies dormant memories and transitions them to archived status. It queries `memory_index` for memories that have not been accessed within a configurable threshold period, demotes their tier classification, and optionally removes their BM25 index entries and vector embeddings to reclaim storage. Archived memories remain in the database for SQL-based recovery but are excluded from default search result sets.
     6	
     7	The archival sweep runs periodically and respects tier-based protection: constitutional and critical-tier memories are never auto-archived. Access tracker data (`access_count`, `last_access_at`) drives the dormancy decision. The archival manager lazy-loads the tier classifier to avoid circular dependencies at import time.
     8	
     9	## Source Files
    10	
    11	### Implementation
    12	
    13	| File | Layer | Role |
    14	|------|-------|------|
    15	| `mcp_server/lib/cognitive/archival-manager.ts` | Lib | Background archival job logic |
    16	| `mcp_server/lib/storage/access-tracker.ts` | Lib | Access pattern tracking for dormancy detection |
    17	| `mcp_server/lib/search/vector-index-queries.ts` | Lib | Vector index query methods |
    18	| `mcp_server/lib/search/sqlite-fts.ts` | Lib | SQLite FTS5 interface |
    19	
    20	### Tests
 succeeded in 51ms:
     1	# Temporal contiguity layer
     2	
     3	## Current Reality
     4	
     5	The temporal contiguity module (`lib/cognitive/temporal-contiguity.ts`) boosts search result scores when memories were created close together in time. Given a set of search results, it queries for temporally adjacent memories within a configurable window (default 1 hour, max 24 hours) and applies a boost factor of 0.15 per temporally proximate neighbor, capped at a cumulative maximum of 0.50 per result.
     6	
     7	The module also provides `queryTemporalNeighbors()` for direct temporal neighborhood lookups and `buildSpecFolderTimeline()` for constructing chronological timelines within a spec folder. This captures the cognitive principle that memories formed close together in time are often contextually related — the temporal contiguity effect from memory psychology.
     8	
     9	## Source Files
    10	
    11	### Implementation
    12	
    13	| File | Layer | Role |
    14	|------|-------|------|
    15	| `mcp_server/lib/cognitive/temporal-contiguity.ts` | Lib | Temporal proximity boost and timeline queries |
    16	
    17	### Tests
    18	
    19	| File | Focus |
    20	|------|-------|
 succeeded in 52ms:
     1	# Tool-result extraction to working memory
     2	
     3	## Current Reality
     4	
     5	The working memory module (`lib/cognitive/working-memory.ts`) captures salient results from tool invocations and stores them as session-scoped attention items. When a retrieval tool returns results, the system extracts key findings and inserts them into the `working_memory` table with an attention score. These extracted items persist across turns within the same session, enabling cross-turn context continuity.
     6	
     7	The checkpoint module (`lib/storage/checkpoints.ts`) also participates by preserving working memory state during checkpoint creation so that restored sessions retain their accumulated tool-result context. Attention scores decay with an event-distance model (0.85 per event elapsed) with a floor of 0.05 and explicit eviction at 0.01, ensuring that recent tool results remain prominent while older ones gracefully fade.
     8	
     9	## Source Files
    10	
    11	### Implementation
    12	
    13	| File | Layer | Role |
    14	|------|-------|------|
    15	| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Working memory with tool-result extraction |
    16	| `mcp_server/lib/storage/checkpoints.ts` | Lib | Checkpoint preservation of working memory |
    17	
    18	### Tests
    19	
    20	| File | Focus |
 succeeded in 52ms:
     1	# Co-activation boost strength increase
     2	
     3	## Current Reality
     4	
     5	The co-activation boost multiplier jumped from 0.1x to 0.25-0.3x. At 0.1x, the graph signal investment was barely visible in retrieval results, roughly 5% effective contribution at hop 2.
     6	
     7	The new multiplier targets 15% or higher contribution, which is enough to matter without overwhelming the vector and lexical channels. You can tune the exact value through the `SPECKIT_COACTIVATION_STRENGTH` environment variable. A dark-run measurement sequence isolates A7 contribution by comparing R4-only results against R4+A7 results.
     8	
     9	## Source Files
    10	
    11	### Implementation
    12	
    13	| File | Layer | Role |
    14	|------|-------|------|
    15	| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |
    16	
    17	### Tests
    18	
    19	| File | Focus |
    20	|------|-------|
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	# Classification-based decay
     2	
     3	## Current Reality
     4	
     5	Not all memories should decay at the same rate. A decision record from six months ago is still relevant. A scratch note from last Tuesday probably is not.
     6	
     7	FSRS decay rates now vary by a two-dimensional multiplier matrix. On the context axis: decisions never decay (stability set to Infinity), research memories get 2x stability, and implementation/discovery/general memories follow the standard rate. On the tier axis: constitutional and critical memories never decay, important memories get 1.5x stability, normal memories follow the standard, temporary memories decay at 0.5x and deprecated at 0.25x.
     8	
     9	The combined multiplier uses `Infinity` for never-decay cases, which produces `R(t) = 1.0` for all t without special-case logic. Runs behind the `SPECKIT_CLASSIFICATION_DECAY` flag.
    10	
    11	## Source Files
    12	
    13	### Implementation
    14	
    15	| File | Layer | Role |
    16	|------|-------|------|
    17	| `mcp_server/lib/cognitive/attention-decay.ts` | Lib | FSRS attention decay |
    18	| `mcp_server/lib/cognitive/fsrs-scheduler.ts` | Lib | FSRS scheduling algorithm |
    19	| `mcp_server/lib/scoring/composite-scoring.ts` | Lib | Composite score computation |
    20	| `mcp_server/lib/scoring/folder-scoring.ts` | Lib | Folder scoring implementation |
exec
/bin/zsh -lc 'rg -n "''^# .*working memory|''^# .*FSRS|''^# .*review scheduling|''^# .*type inference|''^# .*taxonomy|''^# .*spreading activation|''^# .*co-activation" '"'/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md:1:# Tool-result extraction to working memory
codex
I’ve confirmed two of the six are now explicitly backfilled in the feature catalog, while others appear only as incidental mentions (not dedicated feature entries). I’ll finish by classifying each gap status and adding truly new capabilities I can evidence from code line ranges.
exec
/bin/zsh -lc "rg -n \"event_counter|mention_count|MAX_MENTION_COUNT|source_tool|redaction_applied|getSessionPromptContext|DECAY_FLOOR|DELETE_THRESHOLD\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"inferDocumentTypeFromPath|SPEC_DOCUMENT_CONFIGS|DocumentType|meta-cognitive|PATH_TYPE_PATTERNS|KEYWORD_TYPE_MAP|TIER_TO_TYPE_MAP\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"RELATED_CACHE|TTL|getRelatedMemories cache|causalNeighbors|spreadActivation|best-first|decayPerHop\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1127:- **WM score clamping (#29):** Working memory scores clamped to `[DECAY_FLOOR, 1.0]` to prevent mention boost from exceeding normalized range.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md:11:- **WM score clamping (#29):** Working memory scores clamped to `[DECAY_FLOOR, 1.0]` to prevent mention boost from exceeding normalized range.
 exited 1 in 52ms:

 succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1670:Ten safeguards protect against noise: a 100+ stop-word denylist, rate cap of 3 terms per selection and 8 per memory, 30-day TTL decay, FTS5 isolation verified by 5 critical tests, noise floor (top-3 exclusion), 1-week shadow period (log-but-don't-apply), rollback mechanism, provenance audit log, 72-hour minimum memory age and sprint gate review.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1704:**SQL-level:** Causal edge upsert reduced from 3 DB round-trips to 2 by eliminating the post-upsert SELECT via `lastInsertRowid`. Spec folder hierarchy tree cached with a 60-second WeakMap TTL keyed by database instance.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1851:**Sprint 8 update:** A WeakMap TTL cache (60s, keyed by database instance) was added to `buildHierarchyTree()` to avoid full-scan reconstruction on every search request. An `invalidateHierarchyCache()` export allows explicit cache clearing when hierarchy data changes.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2400:| `SESSION_TTL_MINUTES` | `30` | number | `lib/session/session-manager.ts` | How long session deduplication records are retained after last use, in minutes. Sessions older than this are cleaned up on the next periodic maintenance pass. |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2405:| `TOOL_CACHE_TTL_MS` | `60000` | number | `lib/cache/tool-cache.ts` | Default time-to-live in milliseconds for tool cache entries. After this duration, entries are treated as expired and evicted on next access or cleanup sweep. Default is 60 seconds (60,000 ms). |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/06-learned-relevance-feedback.md:7:Ten safeguards protect against noise: a 100+ stop-word denylist, rate cap of 3 terms per selection and 8 per memory, 30-day TTL decay, FTS5 isolation verified by 5 critical tests, noise floor (top-3 exclusion), 1-week shadow period (log-but-don't-apply), rollback mechanism, provenance audit log, 72-hour minimum memory age and sprint gate review.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/08-performance-improvements.md:11:**SQL-level:** Causal edge upsert reduced from 3 DB round-trips to 2 by eliminating the post-upsert SELECT via `lastInsertRowid`. Spec folder hierarchy tree cached with a 60-second WeakMap TTL keyed by database instance.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md:1:# Tool-level TTL cache
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md:5:The tool cache (`lib/cache/tool-cache.ts`) provides a per-tool, TTL-based in-memory cache that sits in front of expensive operations like embedding generation and database queries. Each cache entry is keyed by a SHA-256 hash of the tool name plus input parameters and expires after a configurable TTL (default 60 seconds via `TOOL_CACHE_TTL_MS`). Maximum cache size is governed by `TOOL_CACHE_MAX_ENTRIES` (default 1000) with oldest-entry eviction on overflow.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md:15:| `mcp_server/lib/cache/tool-cache.ts` | Lib | TTL-based tool cache with eviction |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md:27:- Source feature title: Tool-level TTL cache
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/02-2-session-and-cache.md:12:| `SESSION_TTL_MINUTES` | `30` | number | `lib/session/session-manager.ts` | How long session deduplication records are retained after last use, in minutes. Sessions older than this are cleaned up on the next periodic maintenance pass. |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/02-2-session-and-cache.md:17:| `TOOL_CACHE_TTL_MS` | `60000` | number | `lib/cache/tool-cache.ts` | Default time-to-live in milliseconds for tool cache entries. After this duration, entries are treated as expired and evicted on next access or cleanup sweep. Default is 60 seconds (60,000 ms). |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md:9:**Sprint 8 update:** A WeakMap TTL cache (60s, keyed by database instance) was added to `buildHierarchyTree()` to avoid full-scan reconstruction on every search request. An `invalidateHierarchyCache()` export allows explicit cache clearing when hierarchy data changes.
exec
/bin/zsh -lc "rg -n \"inferDocumentTypeFromPath|SPEC_DOCUMENT_CONFIGS|PATH_TYPE_PATTERNS|KEYWORD_TYPE_MAP|TIER_TO_TYPE_MAP|meta-cognitive\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog' || true" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:

exec
/bin/zsh -lc "rg -n \"co-activation.*causal|causal neighbors|spreadActivation|maxHops|decayPerHop|related_memories\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog' || true" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:724:Hub memories with many connections dominated co-activation results no matter what you searched for. If a memory had 40 causal edges, it showed up everywhere.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md:5:Hub memories with many connections dominated co-activation results no matter what you searched for. If a memory had 40 causal edges, it showed up everywhere.
exec
/bin/zsh -lc "rg -n \"processReview|calculateRetrievability|calculateOptimalInterval|nextReviewDate|FSRS v4\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog' || true" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:

exec
/bin/zsh -lc "rg -n \"archival_stats|totalArchived|totalUnarchived|getRecentErrors|background job started\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog' || true" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:

exec
/bin/zsh -lc "rg -n \"redaction_applied|source_tool|source_call_id|extraction_rule_id|event_counter|mention_count\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog' || true" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:

exec
/bin/zsh -lc "rg -n \"SPECKIT_CLASSIFICATION_DECAY|getClassificationDecayMultiplier|context_type|importance_tier\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog' || true" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md:9:The combined multiplier uses `Infinity` for never-decay cases, which produces `R(t) = 1.0` for all t without special-case logic. Runs behind the `SPECKIT_CLASSIFICATION_DECAY` flag.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md:5:Async embedding fallback via `index_memory_deferred()`. When embedding generation fails (API timeout, rate limit), memories are inserted with `embedding_status='pending'` and are immediately searchable via BM25/FTS5 (title, trigger_phrases, content_text) and structural SQL (importance_tier, importance_weight). Vector search requires `embedding_status='success'`. Deferred memories skip embedding dimension validation and `vec_memories` insertion. Background retry via the retry manager or CLI reindex increments `retry_count` and updates status. Failure reason is recorded for diagnostics.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/01-1-search-pipeline-features-speckit.md:13:| `SPECKIT_CLASSIFICATION_DECAY` | `true` | boolean | `lib/scoring/composite-scoring.ts` | Applies intent-classification-based decay scoring to composite scores. When disabled, classification signals do not reduce scores for mismatched intent types. |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:314:On quality failure, Tier 2 widens the search (minSimilarity=0.1, all channels forced). If Tier 2 also fails the same quality check, Tier 3 falls back to structural SQL ordering by importance_tier and importance_weight. Tier 3 scores are calibrated to max 50% of the existing top score, preventing structural results from outranking semantic hits. Degradation events are attached as a non-enumerable `_degradation` property on the result set. The feature is gated by `SPECKIT_SEARCH_FALLBACK` (default: true, graduated).
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1196:The combined multiplier uses `Infinity` for never-decay cases, which produces `R(t) = 1.0` for all t without special-case logic. Runs behind the `SPECKIT_CLASSIFICATION_DECAY` flag.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1588:Async embedding fallback via `index_memory_deferred()`. When embedding generation fails due to API timeout or rate limiting, memories are inserted with `embedding_status='pending'` and become immediately searchable via BM25/FTS5 (title, trigger_phrases, content_text) and structural SQL (importance_tier, importance_weight). Vector search remains unavailable until `embedding_status='success'`.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2323:| `SPECKIT_CLASSIFICATION_DECAY` | `true` | boolean | `lib/scoring/composite-scoring.ts` | Applies intent-classification-based decay scoring to composite scores. When disabled, classification signals do not reduce scores for mismatched intent types. |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md:5:Adaptive search degradation chain in `searchWithFallbackTiered()`. Tier 1: enhanced hybrid search (minSimilarity=0.3, standard channels). Quality check via `checkDegradation()`: fails if topScore < 0.02 AND relativeGap < 0.2, OR resultCount < 3. On fail, Tier 2: widened search (minSimilarity=0.1, all channels forced). Same quality check. On fail, Tier 3: structural SQL fallback (ORDER BY importance_tier, importance_weight). Tier 3 scores are calibrated to max 50% of existing top score to prevent outranking semantic hits. Degradation events are attached as non-enumerable `_degradation` property on the result set. Gated by `SPECKIT_SEARCH_FALLBACK` (default: true, graduated).
codex
---
GAP_NUMBER: 18
FEATURE_NAME: FSRS v4 Review Scheduling Engine
STATUS: CONFIRMED_GAP
SOURCE_FILES: mcp_server/lib/cognitive/fsrs-scheduler.ts:30-35,74-89,95-128,133-175,180-209
DRAFT_DESCRIPTION: The module implements a full FSRS v4-style review scheduler, not just a decay helper. It computes retrievability from elapsed days and stability, updates stability/difficulty by review grade, calculates optimal interval for target retention, and emits `nextReviewDate`. `processReview()` returns a complete updated review state (`stability`, `difficulty`, `reviewCount`, `retrievability`, timestamps). This depth is broader than incidental FSRS mentions in current catalog entries.
SUGGESTED_CATEGORY: 11--scoring-and-calibration
SIGNIFICANCE: MEDIUM
NOTES: No dedicated feature entry was found for the review scheduling API surface (`processReview`, `calculateOptimalInterval`, etc.).
---

---
GAP_NUMBER: 19
FEATURE_NAME: Automatic Archival Subsystem
STATUS: FALSE_POSITIVE
SOURCE_FILES: mcp_server/lib/cognitive/archival-manager.ts:71-80,125-150,244-310,367-408,410-563
DRAFT_DESCRIPTION: The archival subsystem is implemented with candidate scanning, archive/unarchive operations, BM25 synchronization, and periodic background execution. It also includes schema migration support for `is_archived` and protection for top tiers. This capability is now already documented in the catalog as a standalone entry. So it is not an undocumented gap in the current state.
SUGGESTED_CATEGORY: 05--lifecycle
SIGNIFICANCE: LOW
NOTES: Existing doc file: `feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md`; some text appears drifted (e.g., mentions not reflected in current code).
---

---
GAP_NUMBER: 20
FEATURE_NAME: Session-Scoped Working Memory Subsystem
STATUS: CONFIRMED_GAP
SOURCE_FILES: mcp_server/lib/cognitive/working-memory.ts:43-67,171-212,261-287,302-420,439-576
DRAFT_DESCRIPTION: The code implements a full session-scoped working-memory store with schema, session lifecycle, LRU capacity control, and per-session retrieval utilities. It includes event-distance decay, mention boosting, floor/eviction semantics, and prompt-context extraction. It also stores extraction provenance/redaction metadata in dedicated columns. Current catalog coverage emphasizes extraction usage, not the full subsystem behavior.
SUGGESTED_CATEGORY: 01--retrieval
SIGNIFICANCE: MEDIUM
NOTES: Dedicated coverage for the full manager API (not just extraction integration) appears missing.
---

---
GAP_NUMBER: 21
FEATURE_NAME: Hybrid Spreading Activation (Similarity + Causal Graph)
STATUS: CONFIRMED_GAP
SOURCE_FILES: mcp_server/lib/cognitive/co-activation.ts:107-169,229-365
DRAFT_DESCRIPTION: `spreadActivation()` traverses both similarity neighbors (`related_memories`) and causal neighbors (`causal_edges`) in one propagation routine. It deduplicates neighbors by ID, keeps stronger edges, applies per-hop decay, and ranks with a best-first queue. This is a hybrid graph traversal capability rather than a simple scalar co-activation boost. Current docs mainly cover boost strength/fan-effect tuning.
SUGGESTED_CATEGORY: 10--graph-signal-activation
SIGNIFICANCE: MEDIUM
NOTES: Existing co-activation docs do not clearly document the dual-graph traversal contract.
---

---
GAP_NUMBER: 22
FEATURE_NAME: Temporal Contiguity Layer
STATUS: FALSE_POSITIVE
SOURCE_FILES: mcp_server/lib/cognitive/temporal-contiguity.ts:14-20,53-93,103-139,145-174
DRAFT_DESCRIPTION: The module implements temporal proximity boosting, neighbor lookup within a time window, and timeline construction. It includes bounded cumulative boost logic and both pure and DB-backed APIs. This is already documented as a standalone feature entry in the current catalog. Therefore it is not currently an undocumented gap.
SUGGESTED_CATEGORY: 10--graph-signal-activation
SIGNIFICANCE: LOW
NOTES: Existing catalog text uses stale function names (`queryTemporalNeighbors`, `buildSpecFolderTimeline`) versus current exports (`getTemporalNeighbors`, `buildTimeline`).
---

---
GAP_NUMBER: 23
FEATURE_NAME: 9-Type Memory Taxonomy + Multi-Signal Type Inference
STATUS: CONFIRMED_GAP
SOURCE_FILES: mcp_server/lib/config/memory-types.ts:24-33,52-107,136-256; mcp_server/lib/config/type-inference.ts:59-66,75-274,319-339
DRAFT_DESCRIPTION: The config defines nine memory types with half-life, expiry, and decay behavior plus path/keyword mappings. Inference runs via a clear precedence chain: explicit frontmatter, tier mapping, path patterns, keyword scoring, then default with confidence output. Validation utilities also flag type/file mismatches. This subsystem appears materially implemented but lacks a dedicated feature entry.
SUGGESTED_CATEGORY: 13--memory-quality-and-indexing
SIGNIFICANCE: MEDIUM
NOTES: Path correction: files are under `mcp_server/lib/config/` (not `mcp_server/configs/`).
---

---
GAP_NUMBER: NEW-1
FEATURE_NAME: Co-Activation Related-Memory Cache + Embedding Backfill
STATUS: NEW_GAP
SOURCE_FILES: mcp_server/lib/cognitive/co-activation.ts:51-66,107-169,174-222
DRAFT_DESCRIPTION: The module has a TTL + size-capped cache for related-memory lookups, reducing repeated DB fetches during multi-hop activation. It also supports `populateRelatedMemories()` to compute and persist relation JSON from embedding-based similarity search. This is an operational optimization/data-population capability beyond the listed gap names. It appears undocumented as a standalone feature.
SUGGESTED_CATEGORY: 10--graph-signal-activation
SIGNIFICANCE: MEDIUM
NOTES: No direct catalog references were found for `RELATED_CACHE` or embedding-driven relation backfill behavior.
---

---
GAP_NUMBER: NEW-2
FEATURE_NAME: Wraparound-Safe Event Counter Clock for Working Memory Decay
STATUS: NEW_GAP
SOURCE_FILES: mcp_server/lib/cognitive/working-memory.ts:31-35,422-431,479-537,545-576
DRAFT_DESCRIPTION: Working-memory decay is driven by per-session event counters, not wall-clock deltas. The implementation handles modulo wraparound (`2^31`) and computes safe event distance before applying decay/boost logic. This gives deterministic turn/event-based forgetting behavior for long-lived sessions. This mechanism is more specific than the generic “event decay” description.
SUGGESTED_CATEGORY: 01--retrieval
SIGNIFICANCE: MEDIUM
NOTES: No direct catalog references were found for `event_counter`/wraparound semantics.
---

---
GAP_NUMBER: NEW-3
FEATURE_NAME: Durable Archival Stats Persistence and Error Ledger
STATUS: NEW_GAP
SOURCE_FILES: mcp_server/lib/cognitive/archival-manager.ts:155-230,569-584
DRAFT_DESCRIPTION: Archival metrics are persisted across restarts using a dedicated `archival_stats` table and loaded at init. The module tracks totals, last scan time, and bounded recent errors with reset/read APIs. This adds durable operational observability to archival behavior, beyond basic archive/unarchive flow. It appears unlisted as a separate capability.
SUGGESTED_CATEGORY: 05--lifecycle
SIGNIFICANCE: LOW
NOTES: Not present in the gap list and not found as an explicit catalog capability entry.
---
tokens used
89,440
---
GAP_NUMBER: 18
FEATURE_NAME: FSRS v4 Review Scheduling Engine
STATUS: CONFIRMED_GAP
SOURCE_FILES: mcp_server/lib/cognitive/fsrs-scheduler.ts:30-35,74-89,95-128,133-175,180-209
DRAFT_DESCRIPTION: The module implements a full FSRS v4-style review scheduler, not just a decay helper. It computes retrievability from elapsed days and stability, updates stability/difficulty by review grade, calculates optimal interval for target retention, and emits `nextReviewDate`. `processReview()` returns a complete updated review state (`stability`, `difficulty`, `reviewCount`, `retrievability`, timestamps). This depth is broader than incidental FSRS mentions in current catalog entries.
SUGGESTED_CATEGORY: 11--scoring-and-calibration
SIGNIFICANCE: MEDIUM
NOTES: No dedicated feature entry was found for the review scheduling API surface (`processReview`, `calculateOptimalInterval`, etc.).
---

---
GAP_NUMBER: 19
FEATURE_NAME: Automatic Archival Subsystem
STATUS: FALSE_POSITIVE
SOURCE_FILES: mcp_server/lib/cognitive/archival-manager.ts:71-80,125-150,244-310,367-408,410-563
DRAFT_DESCRIPTION: The archival subsystem is implemented with candidate scanning, archive/unarchive operations, BM25 synchronization, and periodic background execution. It also includes schema migration support for `is_archived` and protection for top tiers. This capability is now already documented in the catalog as a standalone entry. So it is not an undocumented gap in the current state.
SUGGESTED_CATEGORY: 05--lifecycle
SIGNIFICANCE: LOW
NOTES: Existing doc file: `feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md`; some text appears drifted (e.g., mentions not reflected in current code).
---

---
GAP_NUMBER: 20
FEATURE_NAME: Session-Scoped Working Memory Subsystem
STATUS: CONFIRMED_GAP
SOURCE_FILES: mcp_server/lib/cognitive/working-memory.ts:43-67,171-212,261-287,302-420,439-576
DRAFT_DESCRIPTION: The code implements a full session-scoped working-memory store with schema, session lifecycle, LRU capacity control, and per-session retrieval utilities. It includes event-distance decay, mention boosting, floor/eviction semantics, and prompt-context extraction. It also stores extraction provenance/redaction metadata in dedicated columns. Current catalog coverage emphasizes extraction usage, not the full subsystem behavior.
SUGGESTED_CATEGORY: 01--retrieval
SIGNIFICANCE: MEDIUM
NOTES: Dedicated coverage for the full manager API (not just extraction integration) appears missing.
---

---
GAP_NUMBER: 21
FEATURE_NAME: Hybrid Spreading Activation (Similarity + Causal Graph)
STATUS: CONFIRMED_GAP
SOURCE_FILES: mcp_server/lib/cognitive/co-activation.ts:107-169,229-365
DRAFT_DESCRIPTION: `spreadActivation()` traverses both similarity neighbors (`related_memories`) and causal neighbors (`causal_edges`) in one propagation routine. It deduplicates neighbors by ID, keeps stronger edges, applies per-hop decay, and ranks with a best-first queue. This is a hybrid graph traversal capability rather than a simple scalar co-activation boost. Current docs mainly cover boost strength/fan-effect tuning.
SUGGESTED_CATEGORY: 10--graph-signal-activation
SIGNIFICANCE: MEDIUM
NOTES: Existing co-activation docs do not clearly document the dual-graph traversal contract.
---

---
GAP_NUMBER: 22
FEATURE_NAME: Temporal Contiguity Layer
STATUS: FALSE_POSITIVE
SOURCE_FILES: mcp_server/lib/cognitive/temporal-contiguity.ts:14-20,53-93,103-139,145-174
DRAFT_DESCRIPTION: The module implements temporal proximity boosting, neighbor lookup within a time window, and timeline construction. It includes bounded cumulative boost logic and both pure and DB-backed APIs. This is already documented as a standalone feature entry in the current catalog. Therefore it is not currently an undocumented gap.
SUGGESTED_CATEGORY: 10--graph-signal-activation
SIGNIFICANCE: LOW
NOTES: Existing catalog text uses stale function names (`queryTemporalNeighbors`, `buildSpecFolderTimeline`) versus current exports (`getTemporalNeighbors`, `buildTimeline`).
---

---
GAP_NUMBER: 23
FEATURE_NAME: 9-Type Memory Taxonomy + Multi-Signal Type Inference
STATUS: CONFIRMED_GAP
SOURCE_FILES: mcp_server/lib/config/memory-types.ts:24-33,52-107,136-256; mcp_server/lib/config/type-inference.ts:59-66,75-274,319-339
DRAFT_DESCRIPTION: The config defines nine memory types with half-life, expiry, and decay behavior plus path/keyword mappings. Inference runs via a clear precedence chain: explicit frontmatter, tier mapping, path patterns, keyword scoring, then default with confidence output. Validation utilities also flag type/file mismatches. This subsystem appears materially implemented but lacks a dedicated feature entry.
SUGGESTED_CATEGORY: 13--memory-quality-and-indexing
SIGNIFICANCE: MEDIUM
NOTES: Path correction: files are under `mcp_server/lib/config/` (not `mcp_server/configs/`).
---

---
GAP_NUMBER: NEW-1
FEATURE_NAME: Co-Activation Related-Memory Cache + Embedding Backfill
STATUS: NEW_GAP
SOURCE_FILES: mcp_server/lib/cognitive/co-activation.ts:51-66,107-169,174-222
DRAFT_DESCRIPTION: The module has a TTL + size-capped cache for related-memory lookups, reducing repeated DB fetches during multi-hop activation. It also supports `populateRelatedMemories()` to compute and persist relation JSON from embedding-based similarity search. This is an operational optimization/data-population capability beyond the listed gap names. It appears undocumented as a standalone feature.
SUGGESTED_CATEGORY: 10--graph-signal-activation
SIGNIFICANCE: MEDIUM
NOTES: No direct catalog references were found for `RELATED_CACHE` or embedding-driven relation backfill behavior.
---

---
GAP_NUMBER: NEW-2
FEATURE_NAME: Wraparound-Safe Event Counter Clock for Working Memory Decay
STATUS: NEW_GAP
SOURCE_FILES: mcp_server/lib/cognitive/working-memory.ts:31-35,422-431,479-537,545-576
DRAFT_DESCRIPTION: Working-memory decay is driven by per-session event counters, not wall-clock deltas. The implementation handles modulo wraparound (`2^31`) and computes safe event distance before applying decay/boost logic. This gives deterministic turn/event-based forgetting behavior for long-lived sessions. This mechanism is more specific than the generic “event decay” description.
SUGGESTED_CATEGORY: 01--retrieval
SIGNIFICANCE: MEDIUM
NOTES: No direct catalog references were found for `event_counter`/wraparound semantics.
---

---
GAP_NUMBER: NEW-3
FEATURE_NAME: Durable Archival Stats Persistence and Error Ledger
STATUS: NEW_GAP
SOURCE_FILES: mcp_server/lib/cognitive/archival-manager.ts:155-230,569-584
DRAFT_DESCRIPTION: Archival metrics are persisted across restarts using a dedicated `archival_stats` table and loaded at init. The module tracks totals, last scan time, and bounded recent errors with reset/read APIs. This adds durable operational observability to archival behavior, beyond basic archive/unarchive flow. It appears unlisted as a separate capability.
SUGGESTED_CATEGORY: 05--lifecycle
SIGNIFICANCE: LOW
NOTES: Not present in the gap list and not found as an explicit catalog capability entry.
---
