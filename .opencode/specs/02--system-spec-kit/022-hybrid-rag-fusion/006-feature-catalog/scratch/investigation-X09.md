OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce99-4e74-72c0-a9cc-4e133a927bff
--------
user
You are investigating undocumented features in an MCP server. Search for and read search internal files under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/: search/intent-classifier.ts, search/evidence-gap-detector.ts, search/session-boost.ts, search/fsrs.ts (or scoring/fsrs*), search/anchor-metadata.ts, pipeline/stage2-fusion.ts. Verify gaps 43-48: Gap 43 (Hybrid intent classifier), Gap 44 (Evidence-gap Z-score detection), Gap 45 (Session attention boost), Gap 46 (Temporal-structural coherence scoring), Gap 47 (Anchor region metadata enrichment), Gap 48 (Validation-signal score adjustment). 

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
I’m going to inspect the target MCP server files directly and map each requested gap (43-48) to concrete code evidence with line ranges. I’ll first locate the files and the category list source, then verify each feature one by one.
exec
/bin/zsh -lc 'pwd && ls -la' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files | rg 'undocumented-features-scan\\.md|\\.opencode/skill/system-spec-kit/mcp_server/lib/(search/(intent-classifier|evidence-gap-detector|session-boost|fsrs|anchor-metadata)\\.ts|pipeline/stage2-fusion\\.ts|scoring/fsrs)'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
total 336
drwxr-xr-x  28 michelkerkmeester  staff    896 Mar  8 17:37 .
drwxr-xr-x   6 michelkerkmeester  staff    192 Mar  2 15:50 ..
drwxr-xr-x@ 11 michelkerkmeester  staff    352 Mar  4 11:33 .agents
drwxr-xr-x@ 10 michelkerkmeester  staff    320 Mar  5 07:28 .claude
drwxr-xr-x@  9 michelkerkmeester  staff    288 Mar  6 19:44 .codex
-rw-r--r--@  1 michelkerkmeester  staff   7278 Mar  8 17:39 .copilot_verification_f38.json
-rw-r--r--   1 michelkerkmeester  staff    651 Feb 22 14:15 .env
-rw-r--r--@  1 michelkerkmeester  staff    562 Feb 22 14:15 .env.example
lrwxr-xr-x@  1 michelkerkmeester  staff      7 Mar  4 09:35 .gemini -> .agents
drwxr-xr-x  18 michelkerkmeester  staff    576 Mar  8 18:09 .git
drwxr-xr-x@  4 michelkerkmeester  staff    128 Mar  5 17:46 .github
-rw-r--r--@  1 michelkerkmeester  staff   3631 Mar  1 16:27 .gitignore
drwxr-xr-x@ 13 michelkerkmeester  staff    416 Mar  8 16:55 .opencode
drwxr-xr-x@  3 michelkerkmeester  staff     96 Feb 27 09:44 .superset
-rw-r--r--@  1 michelkerkmeester  staff   3304 Feb 25 10:53 .utcp_config.json
drwxr-xr-x   5 michelkerkmeester  staff    160 Feb 20 22:07 .vscode
-rw-r--r--@  1 michelkerkmeester  staff  19491 Feb 25 09:04 AGENTS.md
-rw-r--r--@  1 michelkerkmeester  staff  23383 Feb 25 09:04 AGENTS_example_fs_enterprises.md
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/lib | rg 'stage2-fusion\\.ts|stage2|fusion|fsrs'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
codex
I found all requested files (including `pipeline/stage2-fusion.ts`), plus the `undocumented-features-scan.md` source. Next I’m extracting exact line-level evidence and the category taxonomy so each gap can be labeled precisely.
exec
/bin/zsh -lc "nl -ba .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
/bin/zsh -lc 'rg -n "''^#|''^##|category|Category|''^[0-9]{2}-|''^'"\\|\\s*[0-9]{2}\\s*\\|\" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
Total output lines: 688

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
/bin/zsh -lc "rg --files | rg 'feature_catalog\\.md"'$|feature-catalog'"\\.md"'$|catalog.*'"\\.md"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/mcp-code-mode/references/tool_catalog.md
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/04-causal-chain-tracing-memorydriftwhy.md
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/13-strict-zod-schema-validation.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md
codex
I’ve located the canonical 20-category catalog and will pull its category labels next so the `SUGGESTED_CATEGORY` field uses the exact taxonomy rather than a guess.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Evidence Gap Detector
     3	// ---------------------------------------------------------------
     4	// Transparent Reasoning Module (TRM): Z-score confidence check
     5	// on RRF scores to detect low-confidence retrieval and inject
     6	// warnings for the MCP markdown output layer.
     7	// ---------------------------------------------------------------
     8	
     9	/* ---------------------------------------------------------------
    10	   1. CONSTANTS
    11	   --------------------------------------------------------------- */
    12	
    13	/** Z-score threshold below which retrieval confidence is considered low. */
    14	const Z_SCORE_THRESHOLD = 1.5;
    15	
    16	/** Absolute minimum score; any top score below this triggers a gap. */
    17	const MIN_ABSOLUTE_SCORE = 0.015;
    18	
    19	/**
    20	 * Minimum number of memory nodes that must be connected to matched graph
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Intent Classifier
     3	// ---------------------------------------------------------------
     4	/* --- 1. TYPES & CONSTANTS --- */
     5	
     6	type IntentType = 'add_feature' | 'fix_bug' | 'refactor' | 'security_audit' | 'understand' | 'find_spec' | 'find_decision';
     7	
     8	interface IntentResult {
     9	  intent: IntentType;
    10	  confidence: number;
    11	  scores: Record<IntentType, number>;
    12	  keywords: string[];
    13	}
    14	
    15	interface IntentWeights {
    16	  recency: number;
    17	  importance: number;
    18	  similarity: number;
    19	  contextType: string | null;
    20	}
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Session Boost
     3	// ---------------------------------------------------------------
     4	
     5	import type Database from 'better-sqlite3';
     6	import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';
     7	
     8	const SESSION_BOOST_MULTIPLIER = 0.15;
     9	const MAX_COMBINED_BOOST = 0.20;
    10	
    11	let db: Database.Database | null = null;
    12	
    13	interface RankedSearchResult extends Record<string, unknown> {
    14	  id: number;
    15	  score?: number;
    16	  rrfScore?: number;
    17	  similarity?: number;
    18	}
    19	
    20	interface SessionBoostMetadata {
codex
I’ve captured concrete evidence for gaps 44 and 45 already. I’m now reading the remaining sections of `intent-classifier.ts`, plus `fsrs.ts`, `anchor-metadata.ts`, and `stage2-fusion.ts` to confirm 43/46/47/48 and check for additional undocumented capabilities.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts | sed -n '260,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   260	 */
   261	function isExplicitSpecLookup(query: string): boolean {
   262	  return (
   263	    /(?:find|show|get)\s+(?:me\s+)?(?:the\s+)?(?:spec|specification|requirements|scope|plan|checklist)/i.test(query) ||
   264	    /(?:spec|specification)\s+for\s+/i.test(query) ||
   265	    /what\s+(?:are|is|was|were)\s+the\s+(?:requirements|scope|plan)/i.test(query)
   266	  );
   267	}
   268	
   269	/**
   270	 * Compute a deterministic normalized embedding for text.
   271	 *
   272	 * @param text - Input text to embed
   273	 * @returns Normalized Float32Array embedding vector
   274	 */
   275	function toDeterministicEmbedding(text: string): Float32Array {
   276	  const vec = new Float32Array(CENTROID_EMBED_DIM);
   277	  const tokens = text.toLowerCase().match(/[a-z0-9_]+/g) ?? [];
   278	  for (const token of tokens) {
   279	    const idx = hashToken(token) % CENTROID_EMBED_DIM;
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: FSRS
     3	// ---------------------------------------------------------------
     4	// AI-WHY: Augments FSRS stability scores with graph centrality so that
     5	// central nodes decay slower and peripheral nodes decay faster.
     6	
     7	/* --- 1. INTERFACES --- */
     8	
     9	/**
    10	 * Minimal graph interface required by `computeGraphCentrality`.
    11	 * Defined locally — no imports outside this module's rootDir.
    12	 */
    13	interface MemoryGraphLike {
    14	  /** All graph nodes keyed by node id. */
    15	  nodes: Map<string, unknown>;
    16	  /** Map from node id → list of node ids that point INTO it (inbound edges). */
    17	  inbound: Map<string, string[]>;
    18	  /** Map from node id → list of node ids that this node points TO (outbound edges). */
    19	  outbound: Map<string, string[]>;
    20	}
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Anchor Metadata
     3	// ---------------------------------------------------------------
     4	// Sprint 5 Phase B — S2 template anchor optimization
     5	//
     6	// PURPOSE: Parse ANCHOR tags from memory content and attach the
     7	// resulting metadata to search pipeline rows. This is a PURE
     8	// ANNOTATION step — no scores are modified.
     9	//
    10	// ANCHOR FORMAT:
    11	//   <!-- ANCHOR:id --> ... content ... <!-- /ANCHOR:id -->
    12	//
    13	// ANCHOR ID CONVENTION (for type extraction):
    14	//   Structured IDs follow the pattern: TYPE-keywords-NNN
    15	//   e.g.  DECISION-pipeline-003  → type = "DECISION"
    16	//         state                  → type = "state"
    17	//         summary                → type = "summary"
    18	//
    19	// Integration point: called at the end of Stage 2 fusion, after
    20	// all scoring signals have been applied (signals 1-7). Adding
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts | sed -n '520,760p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   520	    };
   521	  }).sort((a, b) =>
   522	    ((b.intentAdjustedScore as number) || 0) - ((a.intentAdjustedScore as number) || 0)
   523	  );
   524	}
   525	
   526	/**
   527	 * Get search query weights based on detected intent.
   528	 *
   529	 * @param query - Raw user query string
   530	 * @returns Weight adjustments derived from auto-detected intent
   531	 */
   532	function getQueryWeights(query: string): IntentWeights {
   533	  const result = classifyIntent(query);
   534	  return getIntentWeights(result.intent);
   535	}
   536	
   537	/**
   538	 * Check if an intent type is valid.
   539	 *
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Stage2 Fusion
     3	// ---------------------------------------------------------------
     4	// AI-GUARD: Sprint 5 (R6): 4-Stage Retrieval Pipeline
     5	//
     6	// I/O CONTRACT:
     7	//   Input:  Stage2Input { candidates: PipelineRow[], config, stage1Metadata }
     8	//   Output: Stage2Output { scored: PipelineRow[], metadata }
     9	//   Key invariants:
    10	//     - Every score modification in the pipeline happens exactly once here
    11	//     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
    12	//     - scored is sorted descending by effective composite score on exit
    13	//   Side effects:
    14	//     - FSRS write-back to memory_index (when trackAccess=true) — DB write
    15	//     - Learned trigger and negative-feedback reads from DB
    16	//
    17	// PURPOSE: Single point for ALL scoring signals. Intent weights are
    18	// applied ONCE here only — this is the architectural guard against
    19	// the G2 double-weighting recurrence bug.
    20	//
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '360,760p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   360	    }
   361	  } catch (err: unknown) {
   362	    const message = err instanceof Error ? err.message : String(err);
   363	    console.warn(`[stage2-fusion] learned trigger query failed: ${message}`);
   364	    learnedBoostMap = new Map();
   365	  }
   366	
   367	  // -- Negative feedback stats (batch load) --
   368	  let negativeFeedbackStats = new Map<number, { negativeCount: number; lastNegativeAt: number | null }>();
   369	  if (isNegativeFeedbackEnabled()) {
   370	    try {
   371	      const memoryIds = results.map((r) => r.id);
   372	      negativeFeedbackStats = getNegativeFeedbackStats(db as Parameters<typeof getNegativeFeedbackStats>[0], memoryIds);
   373	    } catch (err: unknown) {
   374	      const message = err instanceof Error ? err.message : String(err);
   375	      console.warn(`[stage2-fusion] negative feedback stats failed: ${message}`);
   376	    }
   377	  }
   378	
   379	  // -- Apply combined adjustments --
exec
/bin/zsh -lc 'rg -n "classifyIntent|detectIntent|INTENT_LAMBDA_MAP|getIntentWeights" .opencode/skill/system-spec-kit/mcp_server/lib' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "detectEvidenceGap|predictGraphCoverage|formatEvidenceGapWarning|Z_SCORE_THRESHOLD" .opencode/skill/system-spec-kit/mcp_server/lib' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "applySessionBoost|getAttentionBoost|SESSION_BOOST_MULTIPLIER|sessionBoost" .opencode/skill/system-spec-kit/mcp_server/lib' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "applyValidationSignalScoring|validationMetadata|qualityFactor|specLevelBonus|completionBonus|checklistBonus" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "computeStructuralFreshness|computeGraphCentrality" .opencode/skill/system-spec-kit/mcp_server/lib' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "extractAnchorMetadata|enrichResultsWithAnchorMetadata|anchorMetadata" .opencode/skill/system-spec-kit/mcp_server/lib' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:14:import { INTENT_LAMBDA_MAP, classifyIntent } from './intent-classifier';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:177:/** Fallback lambda (diversity vs relevance) when intent is not in INTENT_LAMBDA_MAP. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:714:      const intent = options.intent || classifyIntent(query).intent;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:878:              const mmrLambda = INTENT_LAMBDA_MAP[intent] ?? MMR_DEFAULT_LAMBDA;
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:378:function classifyIntent(query: string): IntentResult {
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:458: * Detect intent (alias for classifyIntent).
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:463:function detectIntent(query: string): IntentResult {
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:464:  return classifyIntent(query);
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:473:function getIntentWeights(intent: IntentType): IntentWeights {
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:488:  const weights = getIntentWeights(intent);
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:533:  const result = classifyIntent(query);
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:534:  return getIntentWeights(result.intent);
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:583:const INTENT_LAMBDA_MAP: Readonly<Record<string, number>> = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:598:  INTENT_LAMBDA_MAP,
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:609:  classifyIntent,
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:610:  detectIntent,
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:611:  getIntentWeights,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:35:import { INTENT_LAMBDA_MAP } from '../intent-classifier';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:49:/** Fallback lambda (diversity vs relevance) when intent is not in INTENT_LAMBDA_MAP. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:182:          const mmrLambda = (INTENT_LAMBDA_MAP as Record<string, number>)[intent] ?? MMR_DEFAULT_LAMBDA;
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:40:import { detectEvidenceGap, formatEvidenceGapWarning } from '../evidence-gap-detector';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:265:    const trm = detectEvidenceGap(scores);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:270:      evidenceGapWarning = formatEvidenceGapWarning(trm);
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:14:const Z_SCORE_THRESHOLD = 1.5;
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:57: * Minimal graph interface required by `predictGraphCoverage`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:82:export function predictGraphCoverage(
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:131: * - The top score's Z-score falls below `Z_SCORE_THRESHOLD` (flat distribution),
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:138:export function detectEvidenceGap(rrfScores: number[]): TRMResult {
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:176:    : zScore < Z_SCORE_THRESHOLD || topScore < MIN_ABSOLUTE_SCORE;
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:188: * @param trm - TRMResult from `detectEvidenceGap`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:191:export function formatEvidenceGapWarning(trm: TRMResult): string {
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:199:export { Z_SCORE_THRESHOLD, MIN_ABSOLUTE_SCORE, MIN_GRAPH_MEMORY_NODES };
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:43:  sessionBoost?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:237:    const sessionBoost = typeof item.sessionBoost === 'number' ? Math.max(0, item.sessionBoost) : 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:238:    const allowedBoost = Math.max(0, Math.min(causalBoost, MAX_COMBINED_BOOST - sessionBoost));
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:8:const SESSION_BOOST_MULTIPLIER = 0.15;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:57:function capCombinedBoost(sessionBoost: number, causalBoost: number = 0): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:58:  const boundedSession = Math.max(0, sessionBoost);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:69:  const rawBoost = attentionScore * SESSION_BOOST_MULTIPLIER;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:73:function getAttentionBoost(sessionId: string | null | undefined, memoryIds: number[]): Map<number, number> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:107:    console.warn(`[session-boost] getAttentionBoost failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:125:function applySessionBoost(
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:143:  const boosts = getAttentionBoost(normalizedSessionId, memoryIds);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:162:          sessionBoost: boost,
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:196:  SESSION_BOOST_MULTIPLIER,
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:202:  getAttentionBoost,
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:203:  applySessionBoost,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:52:import * as sessionBoost from '../session-boost';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:486:    sessionBoostApplied: false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:503:      const { results: boosted, metadata: sbMeta } = sessionBoost.applySessionBoost(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:508:      metadata.sessionBoostApplied = sbMeta.applied;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:711:        sessionBoostApplied: metadata.sessionBoostApplied,
 succeeded in 51ms:
110:function applyValidationSignalScoring(results: PipelineRow[]): PipelineRow[] {
114:    const metadata = row.validationMetadata as ValidationMetadataLike | undefined;
122:    const qualityFactor = 0.9 + (quality * 0.2); // [0.9, 1.1]
123:    const specLevelBonus = typeof metadata.specLevel === 'number' && Number.isFinite(metadata.specLevel)
127:    const completionBonus = metadata.completionStatus === 'complete'
133:    const checklistBonus = metadata.hasChecklist ? 0.01 : 0;
134:    const multiplier = clampMultiplier(qualityFactor + specLevelBonus + completionBonus + checklistBonus);
685:  // importance_tier, completion markers) and attach as `validationMetadata` key,
689:    results = applyValidationSignalScoring(results);
747:  applyValidationSignalScoring,
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:10: * Minimal graph interface required by `computeGraphCentrality`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:39:export function computeStructuralFreshness(
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:62:export function computeGraphCentrality(
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:104:export function extractAnchorMetadata(content: string): AnchorMetadata[] {
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:155: * as `anchorMetadata`. Rows without content (or with no anchors) are returned
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:165:export function enrichResultsWithAnchorMetadata(results: PipelineRow[]): PipelineRow[] {
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:173:    const anchors = extractAnchorMetadata(content);
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:178:      anchorMetadata: anchors,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:63:import { enrichResultsWithAnchorMetadata } from '../anchor-metadata';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:677:    results = enrichResultsWithAnchorMetadata(results);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:745:  enrichResultsWithAnchorMetadata,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Stage4 Filter
     3	// ---------------------------------------------------------------
     4	// AI-WHY: Sprint 5 (R6): Final stage of the 4-stage retrieval pipeline.
     5	//
     6	// ARCHITECTURAL INVARIANT: Stage 4 MUST NOT modify scores.
     7	// Any ordering change after Stage 3 is a bug. Score fields on
     8	// Stage4ReadonlyRow are compile-time readonly; the runtime assertion
     9	// via captureScoreSnapshot / verifyScoreInvariant provides a second
    10	// defence-in-depth layer.
    11	//
    12	// I/O CONTRACT:
    13	//   Input:  Stage4Input { results: Stage4ReadonlyRow[], config }
    14	//   Output: Stage4Output { final: Stage4ReadonlyRow[], metadata, annotations }
    15	//   Key invariants:
    16	//     - No score field (similarity, score, rrfScore, intentAdjustedScore,
    17	//       attentionScore, importance_weight) may change between input and output
    18	//     - Ordering from Stage 3 is preserved for all surviving rows
    19	//     - final contains only rows at or above config.minState priority
    20	//   Side effects:
exec
/bin/zsh -lc "rg -n \"predictGraphCoverage\\(\" .opencode/skill/system-spec-kit/mcp_server/lib" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:82:export function predictGraphCoverage(
exec
/bin/zsh -lc "rg -n \"from './fsrs'|from '../search/fsrs'|computeStructuralFreshness|structural freshness|centrality\" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/lib | head -n 200" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:4:// AI-WHY: Augments FSRS stability scores with graph centrality so that
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:25: * Compute structural freshness by augmenting an FSRS stability score
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:26: * with a graph centrality factor.
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:29: *   structural_freshness = fsrs_stability * graph_centrality_normalized
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:31: * Central nodes (high centrality) retain more freshness, peripheral
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:32: * nodes (low centrality) decay faster — reflecting the intuition that
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:36: * @param centrality - Normalized graph centrality value, clamped to [0, 1].
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:39:export function computeStructuralFreshness(
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:41:  centrality: number
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:44:  const c = Math.min(1, Math.max(0, centrality));
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:49: * Compute normalized degree centrality for a node in a graph.
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:52: *   degree_centrality = (inDegree + outDegree) / (2 * (totalNodes - 1))
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:58: * @param nodeId - The id of the node to compute centrality for.
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:60: * @returns Normalized degree centrality in [0, 1].
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:77:  const centrality = (inDegree + outDegree) / (2 * (totalNodes - 1));
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:80:  return Math.min(1, Math.max(0, centrality));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:33:// v19: degree_snapshots + community_assignments (N2 graph centrality)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:284:| `fsrs.ts`                  | -      | TypeScript | Temporal-structural coherence: FSRS stability augmented with graph centrality |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:587:The 5th RRF channel computes degree centrality with per-edge-type weights:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:33:// v19: degree_snapshots + community_assignments (N2 graph centrality)
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '680,940p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   680	                id: item.id,
   681	                degreeScore: item.degreeScore,
   682	              })),
   683	              weight: 0.4,
   684	            });
   685	          }
   686	        }
   687	      } catch (_err: unknown) {
   688	        // AI-GUARD: Non-critical — degree channel failure does not block pipeline
   689	      }
   690	    }
   691	
   692	    // Merge keyword results after all channels complete
   693	    const keywordResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [
   694	      ...ftsChannelResults,
   695	      ...bm25ChannelResults,
   696	    ];
   697	
   698	    if (lists.length > 0) {
   699	      // T008: Track multi-source and graph-only results
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Hybrid Search
     3	// ---------------------------------------------------------------
     4	// AI-WHY: Combines vector, FTS, and BM25 search with fallback
     5	
     6	/* --- 1. IMPORTS --- */
     7	
     8	// Local
     9	import { getIndex } from './bm25-index';
    10	import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
    11	import { hybridAdaptiveFuse } from '@spec-kit/shared/algorithms/adaptive-fusion';
    12	import { CO_ACTIVATION_CONFIG, spreadActivation } from '../cache/cognitive/co-activation';
    13	import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
    14	import { INTENT_LAMBDA_MAP, classifyIntent } from './intent-classifier';
    15	import { fts5Bm25Search } from './sqlite-fts';
    16	import {
    17	  isMMREnabled,
    18	  isCrossEncoderEnabled,
    19	  isLocalRerankerEnabled,
    20	  isSearchFallbackEnabled,
 succeeded in 50ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Stage3 Rerank
     3	// ---------------------------------------------------------------
     4	// AI-GUARD: 4-Stage Retrieval Pipeline: Stage 3 of 4
     5	//
     6	// Responsibilities (in execution order):
     7	//   1. Cross-encoder reranking   — re-scores results via neural model
     8	//   2. MMR diversity pruning     — maximal marginal relevance (SPECKIT_MMR flag)
     9	//   3. MPAB chunk collapse        — dedup chunks, reassemble parents
    10	//
    11	// Pipeline position constraint (Sprint 4):
    12	// MPAB MUST remain AFTER RRF fusion (Stage 2).
    13	//   Stage 3 is the only stage that may change scores after Stage 2.
    14	//
    15	// I/O CONTRACT:
    16	//   Input:  Stage3Input { scored: PipelineRow[], config }
    17	//   Output: Stage3Output { reranked: PipelineRow[], metadata }
    18	//   Key invariants:
    19	//     - reranked is sorted descending by effective score after all steps
    20	//     - Chunk rows (parent_id != null) are collapsed; only parent rows exit
codex
I’ve confirmed the code paths for all six targets and I’m now doing a quick cross-check against the feature catalog to classify each as an actual gap vs false positive with higher confidence.
exec
/bin/zsh -lc "rg -n \"evidence gap|Z-score|TRM|graph coverage\" .opencode/skill/system-spec-kit/feature_catalog -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"intent classifier|classifyIntent|INTENT_LAMBDA_MAP|intent weights|seven intent|7-intent\" .opencode/skill/system-spec-kit/feature_catalog -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"session boost|working memory attention|session attention\" .opencode/skill/system-spec-kit/feature_catalog -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"validation signal|qualityScore|specLevel|completionStatus|checklistBonus|validation metadata\" .opencode/skill/system-spec-kit/feature_catalog -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"anchor metadata|ANCHOR tags|extractAnchorMetadata|anchor region\" .opencode/skill/system-spec-kit/feature_catalog -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"temporal-structural coherence|structural freshness|fsrs\\.ts|graph centrality\" .opencode/skill/system-spec-kit/feature_catalog -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:13:Stage 4 (Filter and Annotate) enforces a "no score changes" invariant through dual enforcement. At compile time, `Stage4ReadonlyRow` declares all six score fields as `Readonly`, making assignment a TypeScript error. At runtime, `captureScoreSnapshot()` records all scores before operations and `verifyScoreInvariant()` checks them afterward, throwing a `[Stage4Invariant]` error on any mismatch. Within this invariant, Stage 4 applies memory state filtering (removing rows below `config.minState` with optional per-tier hard limits), evidence gap detection via TRM Z-score analysis and annotation metadata for feature flags and state statistics. Session deduplication is explicitly excluded from Stage 4 and runs post-cache in the handler to avoid double-counting.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:228:The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:283:Stage 4 (Filter and Annotate) enforces a "no score changes" invariant through dual enforcement. At compile time, `Stage4ReadonlyRow` declares all six score fields as `Readonly`, making assignment a TypeScript error. At runtime, `captureScoreSnapshot()` records all scores before operations and `verifyScoreInvariant()` checks them afterward, throwing a `[Stage4Invariant]` error on any mismatch. Within this invariant, Stage 4 applies memory state filtering (removing rows below `config.minState` with optional per-tier hard limits), evidence gap detection via TRM Z-score analysis and annotation metadata for feature flags and state statistics. Session deduplication is explicitly excluded from Stage 4 and runs post-cache in the handler to avoid double-counting.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1018:- **CR-P2-5:** `Number.isFinite` guards on evidence gap detector scores.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1615:Stage 4 (Filter and Annotate) enforces the "no score changes" invariant via dual enforcement: compile-time `Stage4ReadonlyRow` readonly fields plus runtime `verifyScoreInvariant()` assertion checking all six score fields. Within this invariant, it applies memory state filtering, TRM evidence gap detection and annotation metadata.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:2382:| `SPECKIT_TRM` | `true` | boolean | `lib/search/search-flags.ts` | Enables the Transparent Reasoning Module (evidence-gap detection). Stage 4 runs a TRM Z-score analysis to detect evidence gaps and annotate results accordingly. |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:7:The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a+N2b), FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:17:Stage 4 (Filter and Annotate) enforces the "no score changes" invariant via dual enforcement: compile-time `Stage4ReadonlyRow` readonly fields plus runtime `verifyScoreInvariant()` assertion checking all six score fields. Within this invariant, it applies memory state filtering, TRM evidence gap detection and annotation metadata.
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md:16:- **CR-P2-5:** `Number.isFinite` guards on evidence gap detector scores.
.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/01-1-search-pipeline-features-speckit.md:72:| `SPECKIT_TRM` | `true` | boolean | `lib/search/search-flags.ts` | Enables the Transparent Reasoning Module (evidence-gap detection). Stage 4 runs a TRM Z-score analysis to detect evidence gaps and annotate results accordingly. |
 succeeded in 53ms:
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md:5:A corpus of 110 query-relevance pairs covers all seven intent types with at least five queries per type and at least three complexity tiers (simple factual, moderate relational, complex multi-hop).
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:228:The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:264:After these stages, Maximal Marginal Relevance reranking promotes result diversity using intent-specific lambda values (from `INTENT_LAMBDA_MAP`, default 0.7). Co-activation spreading takes the top 5 results, traverses the co-activation graph and applies a 0.25x boost to returned activation scores. A fan-effect divisor helper exists in `co-activation.ts`, but the Stage 2 hot path currently applies the spread score directly.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:279:Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. The current runtime order is: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a momentum + N2b depth), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:895:A corpus of 110 query-relevance pairs covers all seven intent types with at least five queries per type and at least three complexity tiers (simple factual, moderate relational, complex multi-hop).
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1229:A full pipeline trace through `hybrid-search.ts`, `intent-classifier.ts` and `adaptive-fusion.ts` investigated whether intent weights applied at two separate points was a bug. The answer: intentional design.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1231:System A (`INTENT_WEIGHT_PROFILES` in adaptive fusion) controls how much each channel contributes during RRF fusion. System B (`INTENT_WEIGHT_ADJUSTMENTS` in the intent classifier) controls how result attributes (similarity, importance, recency) are weighted after fusion. These operate on different dimensions at different pipeline stages and serve complementary purposes.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1233:A minor inefficiency exists (recency boost from System A is discarded when System B re-scores), but it is harmless. No code change needed. The 4-stage pipeline (R6) resolved this structurally: Stage 2 applies intent weights only for non-hybrid search types via an `isHybrid` boolean gate, so the code path for double-weighting is absent by design.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1609:Stage 2 (Fusion and Signal Integration) applies all scoring signals in a fixed order: session boost, causal boost, co-activation spreading (2a), community co-retrieval from precomputed `community_assignments` (N2c, 2b), graph signals (N2a+N2b  -- additive momentum and depth bonuses, 2c), FSRS testing effect, intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection runs before graph signals so injected rows can also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:2361:| `SPECKIT_MMR` | `true` | boolean | `lib/search/search-flags.ts` | Enables Maximal Marginal Relevance reranking after fusion to promote result diversity. Uses intent-specific lambda values from `INTENT_LAMBDA_MAP` (default 0.7). Requires embeddings to be loaded from `vec_memories` for top-N candidates. |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:11:Stage 2 (Fusion and Signal Integration) applies scoring/enrichment in a fixed order: session boost, causal boost, co-activation spreading, community co-retrieval (N2c from precomputed `community_assignments`), graph signals (N2a+N2b — additive momentum/depth bonuses), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection (N2c) runs before graph signals (N2a+N2b) so injected rows also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md:5:A full pipeline trace through `hybrid-search.ts`, `intent-classifier.ts` and `adaptive-fusion.ts` investigated whether intent weights applied at two separate points was a bug. The answer: intentional design.
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md:7:System A (`INTENT_WEIGHT_PROFILES` in adaptive fusion) controls how much each channel contributes during RRF fusion. System B (`INTENT_WEIGHT_ADJUSTMENTS` in the intent classifier) controls how result attributes (similarity, importance, recency) are weighted after fusion. These operate on different dimensions at different pipeline stages and serve complementary purposes.
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md:9:A minor inefficiency exists (recency boost from System A is discarded when System B re-scores), but it is harmless. No code change needed. The 4-stage pipeline (R6) resolved this structurally: Stage 2 applies intent weights only for non-hybrid search types via an `isHybrid` boolean gate, so the code path for double-weighting is absent by design.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:9:Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. The current runtime order is: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a momentum + N2b depth), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.
.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/01-1-search-pipeline-features-speckit.md:51:| `SPECKIT_MMR` | `true` | boolean | `lib/search/search-flags.ts` | Enables Maximal Marginal Relevance reranking after fusion to promote result diversity. Uses intent-specific lambda values from `INTENT_LAMBDA_MAP` (default 0.7). Requires embeddings to be loaded from `vec_memories` for top-N candidates. |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:7:The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a+N2b), FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md:13:After these stages, Maximal Marginal Relevance reranking promotes result diversity using intent-specific lambda values (from `INTENT_LAMBDA_MAP`, default 0.7). Co-activation spreading takes the top 5 results, traverses the co-activation graph and applies a 0.25x boost to returned activation scores. A fan-effect divisor helper exists in `co-activation.ts`, but the Stage 2 hot path currently applies the spread score directly.
 succeeded in 50ms:
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:228:The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:232:The parameter surface is wide. You control result count (`limit`, 1-100), spec folder scoping, tier and context type filtering, intent (explicit or auto-detected), reranking toggle, length penalty, temporal decay, minimum memory state (`minState`, default `"WARM"`, range HOT through ARCHIVED), constitutional inclusion, content inclusion, anchor filtering, session dedup, session boosting, causal boosting, minimum quality threshold, cache bypass and access tracking. Most defaults are sensible. You typically send a query and a session ID and let everything else run at defaults.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:279:Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. The current runtime order is: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a momentum + N2b depth), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1609:Stage 2 (Fusion and Signal Integration) applies all scoring signals in a fixed order: session boost, causal boost, co-activation spreading (2a), community co-retrieval from precomputed `community_assignments` (N2c, 2b), graph signals (N2a+N2b  -- additive momentum and depth bonuses, 2c), FSRS testing effect, intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection runs before graph signals so injected rows can also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:2321:| `SPECKIT_CAUSAL_BOOST` | `true` | boolean | `lib/search/causal-boost.ts` | Enables causal-neighbor graph boosting. Top seed results (up to 25% of result set, capped at 5) walk the causal edge graph up to 2 hops, applying a per-hop boost capped at 0.05. Combined causal + session boost ceiling is 0.20. |
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/10-causal-neighbor-boost-and-injection.md:7:The combined causal + session boost ceiling is 0.20, preventing runaway score inflation from graph-dense clusters. The feature is gated by `SPECKIT_CAUSAL_BOOST` (default `true`). When disabled, results pass through without graph-based score adjustment.
.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/01-1-search-pipeline-features-speckit.md:11:| `SPECKIT_CAUSAL_BOOST` | `true` | boolean | `lib/search/causal-boost.ts` | Enables causal-neighbor graph boosting. Top seed results (up to 25% of result set, capped at 5) walk the causal edge graph up to 2 hops, applying a per-hop boost capped at 0.05. Combined causal + session boost ceiling is 0.20. |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:9:Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. The current runtime order is: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a momentum + N2b depth), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:7:The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a+N2b), FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:11:The parameter surface is wide. You control result count (`limit`, 1-100), spec folder scoping, tier and context type filtering, intent (explicit or auto-detected), reranking toggle, length penalty, temporal decay, minimum memory state (`minState`, default `"WARM"`, range HOT through ARCHIVED), constitutional inclusion, content inclusion, anchor filtering, session dedup, session boosting, causal boosting, minimum quality threshold, cache bypass and access tracking. Most defaults are sensible. You typically send a query and a session ID and let everything else run at defaults.
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:11:Stage 2 (Fusion and Signal Integration) applies scoring/enrichment in a fixed order: session boost, causal boost, co-activation spreading, community co-retrieval (N2c from precomputed `community_assignments`), graph signals (N2a+N2b — additive momentum/depth bonuses), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection (N2c) runs before graph signals (N2a+N2b) so injected rows also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.
 succeeded in 51ms:
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md:1:# Implemented: graph centrality and community detection
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md:28:- Source feature title: Implemented: graph centrality and community detection
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md:15:**Preserved (NOT dead):** `computeStructuralFreshness` and `computeGraphCentrality` in `fsrs.ts` were identified as planned architectural components (not concluded experiments) and retained.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:183:  - [Implemented: graph centrality and community detection](#implemented-graph-centrality-and-community-detection)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1992:**Preserved (NOT dead):** `computeStructuralFreshness` and `computeGraphCentrality` in `fsrs.ts` were identified as planned architectural components (not concluded experiments) and retained.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:2209:### Implemented: graph centrality and community detection
 succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:89:  - [ANCHOR tags as graph nodes](#anchor-tags-as-graph-nodes)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:228:The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:279:Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. The current runtime order is: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a momentum + N2b depth), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1138:### ANCHOR tags as graph nodes
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1609:Stage 2 (Fusion and Signal Integration) applies all scoring signals in a fixed order: session boost, causal boost, co-activation spreading (2a), community co-retrieval from precomputed `community_assignments` (N2c, 2b), graph signals (N2a+N2b  -- additive momentum and depth bonuses, 2c), FSRS testing effect, intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection runs before graph signals so injected rows can also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:11:Stage 2 (Fusion and Signal Integration) applies scoring/enrichment in a fixed order: session boost, causal boost, co-activation spreading, community co-retrieval (N2c from precomputed `community_assignments`), graph signals (N2a+N2b — additive momentum/depth bonuses), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection (N2c) runs before graph signals (N2a+N2b) so injected rows also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md:1:# ANCHOR tags as graph nodes
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md:33:- Source feature title: ANCHOR tags as graph nodes
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:9:Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. The current runtime order is: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a momentum + N2b depth), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:7:The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a+N2b), FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
 succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md:5:Spec document validation metadata integrates into the scoring layer as an additional ranking dimension in Stage 2. Four signal sources contribute: importance tier mapped to a numeric quality score (constitutional=1.0 through deprecated=0.1), the direct `quality_score` database column, `<!-- SPECKIT_LEVEL: N -->` content marker extraction and validation completion markers (`<!-- VALIDATED -->`, `<!-- VALIDATION: PASS -->`).
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:9:Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. The current runtime order is: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a momentum + N2b depth), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:11:Stage 2 (Fusion and Signal Integration) applies scoring/enrichment in a fixed order: session boost, causal boost, co-activation spreading, community co-retrieval (N2c from precomputed `community_assignments`), graph signals (N2a+N2b — additive momentum/depth bonuses), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection (N2c) runs before graph signals (N2a+N2b) so injected rows also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/06-mutation-hook-result-contract-expansion.md:5:The shared mutation hook result contract was expanded to include `latencyMs` and cache-clear booleans. Callers now receive explicit timing and cache invalidation signals from post-mutation hook execution.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:7:The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a+N2b), FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:228:The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:279:Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. The current runtime order is: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a momentum + N2b depth), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1609:Stage 2 (Fusion and Signal Integration) applies all scoring signals in a fixed order: session boost, causal boost, co-activation spreading (2a), community co-retrieval from precomputed `community_assignments` (N2c, 2b), graph signals (N2a+N2b  -- additive momentum and depth bonuses, 2c), FSRS testing effect, intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection runs before graph signals so injected rows can also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1657:Spec document validation metadata integrates into the scoring layer as an additional ranking dimension in Stage 2. Four signal sources contribute: importance tier mapped to a numeric quality score (constitutional=1.0 through deprecated=0.1), the direct `quality_score` database column, `<!-- SPECKIT_LEVEL: N -->` content marker extraction and validation completion markers (`<!-- VALIDATED -->`, `<!-- VALIDATION: PASS -->`).
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
     1	# Temporal-structural coherence scoring
     2	
     3	## Current Reality
     4	
     5	The quality loop handler (`handlers/quality-loop.ts`) includes a coherence dimension in its quality score breakdown. The coherence score measures how well a memory's content structure aligns with its temporal context — whether the claimed relationships (references to other memories, spec folder associations, causal links) are consistent with the chronological ordering of events. Incoherent memories that reference future events or claim relationships with non-existent predecessors receive a lower coherence score, which reduces their overall quality assessment.
     6	
     7	The coherence signal feeds into the composite quality score alongside trigger coverage, anchor density, and token budget efficiency. A low coherence score can trigger a quality loop rejection, preventing temporally inconsistent content from entering the index.
     8	
     9	## Source Files
    10	
    11	### Implementation
    12	
    13	| File | Layer | Role |
    14	|------|-------|------|
    15	| `mcp_server/handlers/quality-loop.ts` | Handler | Quality loop with coherence scoring |
    16	
    17	### Tests
    18	
    19	| File | Focus |
    20	|------|-------|
 succeeded in 53ms:
     1	# Validation signals as retrieval metadata
     2	
     3	## Current Reality
     4	
     5	Spec document validation metadata integrates into the scoring layer as an additional ranking dimension in Stage 2. Four signal sources contribute: importance tier mapped to a numeric quality score (constitutional=1.0 through deprecated=0.1), the direct `quality_score` database column, `<!-- SPECKIT_LEVEL: N -->` content marker extraction and validation completion markers (`<!-- VALIDATED -->`, `<!-- VALIDATION: PASS -->`).
     6	
     7	The combined multiplier is bounded to 0.8-1.2 via a clamping function, composed of quality factor (0.9-1.1), spec level bonus (0-0.06), completion bonus (0-0.04) and checklist bonus (0-0.01). Well-maintained documentation ranks slightly above neglected documentation when both are relevant. No feature flag; always active.
     8	
     9	## Source Files
    10	
    11	### Implementation
    12	
    13	| File | Layer | Role |
    14	|------|-------|------|
    15	| `mcp_server/lib/search/pipeline/types.ts` | Lib | Type definitions |
    16	| `mcp_server/lib/search/validation-metadata.ts` | Lib | Validation signal metadata |
    17	| `shared/contracts/retrieval-trace.ts` | Shared | Retrieval trace contract |
    18	
    19	### Tests
    20	
 succeeded in 53ms:
     1	# 4-stage pipeline architecture
     2	
     3	## Current Reality
     4	
     5	The pipeline refactor (R6) restructures the retrieval flow into four bounded stages with clear responsibilities and a strict score-immutability invariant in the final stage.
     6	
     7	Stage 1 (Candidate Generation) executes search channels based on query type. Multi-concept queries generate one embedding per concept. Deep mode expands into up to 3 query variants via `expandQuery()`. When embedding expansion is active and R15 does not classify the query as "simple", a baseline and expanded-query search run in parallel with deduplication. Constitutional memory injection appends up to 5 constitutional rows when none appear in the initial candidate set. Quality score and tier filters run at the end of Stage 1.
     8	
     9	Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. The current runtime order is: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a momentum + N2b depth), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.
    10	
    11	Stage 3 (Rerank and Aggregate) handles cross-encoder reranking (optional, gated by `SPECKIT_CROSS_ENCODER`) and MPAB chunk collapse with parent reassembly. Chunks are grouped by parent ID, the best chunk per group is elected by score, and full parent content is loaded from the database. On DB failure, the best-chunk row is emitted as a fallback. Non-chunks and reassembled parents merge and sort descending by effective score.
    12	
    13	Stage 4 (Filter and Annotate) enforces a "no score changes" invariant through dual enforcement. At compile time, `Stage4ReadonlyRow` declares all six score fields as `Readonly`, making assignment a TypeScript error. At runtime, `captureScoreSnapshot()` records all scores before operations and `verifyScoreInvariant()` checks them afterward, throwing a `[Stage4Invariant]` error on any mismatch. Within this invariant, Stage 4 applies memory state filtering (removing rows below `config.minState` with optional per-tier hard limits), evidence gap detection via TRM Z-score analysis and annotation metadata for feature flags and state statistics. Session deduplication is explicitly excluded from Stage 4 and runs post-cache in the handler to avoid double-counting.
    14	
    15	The pipeline is the sole runtime path. `SPECKIT_PIPELINE_V2` is deprecated — `isPipelineV2Enabled()` is hardcoded to `true` and the legacy `postSearchPipeline` was removed in Phase 017.
    16	
    17	---
    18	
    19	## Source Files
    20	
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts | sed -n '210,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
   210	    boostedCount: 0,
   211	    injectedCount: 0,
   212	    maxBoostApplied: 0,
   213	    traversalDepth: MAX_HOPS,
   214	  };
   215	
   216	  if (!metadata.enabled || !Array.isArray(results) || results.length === 0 || !db) {
   217	    return { results, metadata };
   218	  }
   219	
   220	  const seedLimit = Math.max(1, Math.min(MAX_SEED_RESULTS, Math.ceil(results.length * SEED_FRACTION)));
   221	  const seedIds = results.slice(0, seedLimit).map((item) => item.id);
   222	  const neighborBoosts = getNeighborBoosts(seedIds);
   223	  if (neighborBoosts.size === 0) {
   224	    return { results, metadata };
   225	  }
   226	
   227	  const existingIds = new Set(results.map((item) => item.id));
   228	  // AI-WHY: reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
   229	  const lowestScore = Math.max(0.0001, results.map((item) => resolveBaseScore(item)).reduce((a, b) => Math.min(a, b), Infinity));
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/lib | rg 'scoring/fsrs|/fsrs'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts
exec
/bin/zsh -lc 'rg -n "applyValidationSignalScoring|validationMetadata|bounded|0.8|1.2" .opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "classifyIntent|INTENT_LAMBDA_MAP|negative pattern|MIN_CONFIDENCE_THRESHOLD" .opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "detectEvidenceGap|predictGraphCoverage|Z_SCORE_THRESHOLD|formatEvidenceGapWarning" .opencode/skill/system-spec-kit/mcp_server/tests/evidence-gap-detector.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "applySessionBoost|calculateSessionBoost|MAX_COMBINED_BOOST|working_memory" .opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "extractAnchorMetadata|enrichResultsWithAnchorMetadata|nested|malformed" .opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
12:    CREATE TABLE working_memory (
48:  it('T010/T011: getAttentionBoost reads working_memory rows by session and IDs', () => {
52:      INSERT INTO working_memory (session_id, memory_id, attention_score)
77:      INSERT INTO working_memory (session_id, memory_id, attention_score)
87:    const { results, metadata } = sessionBoost.applySessionBoost(fusedResults, 'session-C');
 succeeded in 52ms:
5:// Covers: extractAnchorMetadata and enrichResultsWithAnchorMetadata
7:// that calls enrichResultsWithAnchorMetadata as signal step 8.
12:  extractAnchorMetadata,
13:  enrichResultsWithAnchorMetadata,
21:// SECTION 1: extractAnchorMetadata — core parsing
24:describe('extractAnchorMetadata — parsing', () => {
29:      expect(extractAnchorMetadata('')).toEqual([]);
34:      expect(extractAnchorMetadata(null as unknown as string)).toEqual([]);
38:      expect(extractAnchorMetadata(undefined as unknown as string)).toEqual([]);
42:      expect(extractAnchorMetadata('   \n  \t  ')).toEqual([]);
47:      expect(extractAnchorMetadata(content)).toEqual([]);
62:      const result = extractAnchorMetadata(content);
79:      const result = extractAnchorMetadata(content);
96:      const result = extractAnchorMetadata(content);
107:      const result = extractAnchorMetadata(content);
121:      const result = extractAnchorMetadata(content);
140:      const result = extractAnchorMetadata(content);
161:      const result = extractAnchorMetadata(content);
181:      const result = extractAnchorMetadata(content);
197:      const result = extractAnchorMetadata(content);
 succeeded in 53ms:
8:import { INTENT_LAMBDA_MAP } from '../lib/search/intent-classifier';
104:    const result = intentClassifier.classifyIntent('add a new feature');
112:    const result = intentClassifier.classifyIntent('');
118:    const result = intentClassifier.classifyIntent(null);
135:        const result = intentClassifier.classifyIntent(query);
246:        const result = intentClassifier.classifyIntent(query);
276:      const result = intentClassifier.classifyIntent(query);
299:      const result = intentClassifier.classifyIntent(query);
322:      const result = intentClassifier.classifyIntent(query);
345:      const result = intentClassifier.classifyIntent(query);
368:      const result = intentClassifier.classifyIntent(query);
401:    const result = intentClassifier.classifyIntent(query);
548:        const result = intentClassifier.classifyIntent(query);
572:        const result = intentClassifier.classifyIntent(query);
624:  it('C138-T1: classifyIntent returns one of 7 valid intent types', () => {
626:    const result = intentClassifier.classifyIntent('fix the login error');
630:  it('C138-T2: classifyIntent returns confidence between 0 and 1', () => {
631:    const result = intentClassifier.classifyIntent('explain the architecture');
648:      const result = intentClassifier.classifyIntent(query);
654:    const result = intentClassifier.classifyIntent('test query');
 succeeded in 53ms:
9:  detectEvidenceGap,
10:  formatEvidenceGapWarning,
11:  Z_SCORE_THRESHOLD,
25:    const result = detectEvidenceGap(scores);
28:    expect(result.zScore).toBeGreaterThan(Z_SCORE_THRESHOLD);
37:    const result = detectEvidenceGap(scores);
40:    expect(result.zScore).toBeLessThan(Z_SCORE_THRESHOLD);
46:    const result = detectEvidenceGap(scores);
57:    const result = detectEvidenceGap([]);
67:    const result = detectEvidenceGap([0.85]);
76:    const result = detectEvidenceGap([0.01]);
87:    const belowThreshold = detectEvidenceGap([0.5, 0.2, 0.2]);
93:    const stillBelow = detectEvidenceGap([0.9, 0.1, 0.1]);
97:    const aboveThreshold = detectEvidenceGap([0.95, 0.05, 0.05, 0.05]);
99:    expect(aboveThreshold.zScore).toBeGreaterThan(Z_SCORE_THRESHOLD);
105:    const result = detectEvidenceGap(scores);
113:    const result = detectEvidenceGap(scores);
121:  it('T10: formatEvidenceGapWarning produces correct markdown', () => {
123:    const warning = formatEvidenceGapWarning(trm);
134:    const result = detectEvidenceGap(scores);
 exited 1 in 53ms:

exec
/bin/zsh -lc "rg -n \"validation|qualityScore|specLevel|completionStatus|checklist|applyValidationSignalScoring|0\\.8|1\\.2\" .opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 53ms:

codex
I’ve confirmed implementation evidence and also checked catalog coverage. I’m doing one final pass to make sure there isn’t a deeper `AGENTS.md` override in scope before I format the final gap-by-gap report.
exec
/bin/zsh -lc 'find . -name AGENTS.md -print' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 329ms:
./.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/AGENTS.md
./.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
./.opencode/specs/03--commands-and-skills/sk-mcp/001-mcp-clickup-creation/context/clickup-cli-main/AGENTS.md
./AGENTS.md
codex
---
GAP_NUMBER: 43  
FEATURE_NAME: Hybrid intent classifier with per-intent weighting and MMR lambda mapping  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:34-120,122-198,275-455,473-523,583-591`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:14,714-716,878-879`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:35,181-183`  
DRAFT_DESCRIPTION: The intent classifier is hybrid: it combines deterministic centroid similarity, keyword matches, and regex patterns into a weighted score per intent. It supports seven intents and applies disambiguation rules (negative-pattern penalties and explicit spec-lookup biasing). The module also exports intent-specific scoring weights and `INTENT_LAMBDA_MAP`, which is consumed by both hybrid search and Stage 3 MMR reranking.  
SUGGESTED_CATEGORY: 12--query-intelligence  
SIGNIFICANCE: LOW  
NOTES: Implementation is active in ranking paths (hybrid + stage3), not just a helper.
---

---
GAP_NUMBER: 44  
FEATURE_NAME: Evidence-gap Z-score detection with graph-coverage precheck  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:13-24,82-125,138-179,191-193`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:40,259-277`  
DRAFT_DESCRIPTION: The TRM detector computes mean/stddev/top-score Z-score over retrieval scores and flags low-confidence evidence when statistical separation is weak or absolute score is too low. It includes defensive handling for empty input, single-score input, non-finite values, and zero-variance distributions. A graph-topology early coverage precheck is implemented in the same module for low-connectivity detection.  
SUGGESTED_CATEGORY: 14--pipeline-architecture  
SIGNIFICANCE: LOW  
NOTES: `predictGraphCoverage()` exists but appears uninvoked in current pipeline call paths.
---

---
GAP_NUMBER: 45  
FEATURE_NAME: Session attention boost (working-memory driven)  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:8-10,57-71,73-110,125-193`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:52,498-513`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:237-239`  
DRAFT_DESCRIPTION: Session boost reads `attention_score` from `working_memory` for the active session and matched memory IDs, then applies bounded multiplicative score increases. The boost factor is derived from attention and capped by a combined session+causal ceiling. Stage 2 applies this only on the hybrid path when enabled and when a session ID is present.  
SUGGESTED_CATEGORY: 01--retrieval  
SIGNIFICANCE: LOW  
NOTES: Rollout is feature-gated via `SPECKIT_SESSION_BOOST`.
---

---
GAP_NUMBER: 46  
FEATURE_NAME: Temporal-structural coherence utility scoring (FSRS x centrality)  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:39-46,62-80`  
DRAFT_DESCRIPTION: `fsrs.ts` implements structural freshness as `stability * centrality` with clamping to `[0,1]`. It also computes normalized graph degree centrality using inbound/outbound edges and node-count normalization. Together these functions provide a temporal-structural coherence signal primitive.  
SUGGESTED_CATEGORY: 11--scoring-and-calibration  
SIGNIFICANCE: LOW  
NOTES: No direct runtime call sites were found in current `lib/search` pipeline modules.
---

---
GAP_NUMBER: 47  
FEATURE_NAME: Anchor region metadata enrichment (line-aware, typed)  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:56-63,77-86,104-148,165-181`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:63,672-681`  
DRAFT_DESCRIPTION: Anchor enrichment parses `<!-- ANCHOR:id --> ... <!-- /ANCHOR:id -->` regions and emits structured metadata (`id`, `type`, `startLine`, `endLine`). Type extraction supports uppercase prefix conventions and preserves simple IDs. Stage 2 injects `anchorMetadata` onto result rows after score-affecting steps, preserving score immutability for this phase.  
SUGGESTED_CATEGORY: 14--pipeline-architecture  
SIGNIFICANCE: LOW  
NOTES: Parser supports nested anchors and tolerates malformed/unmatched tags.
---

---
GAP_NUMBER: 48  
FEATURE_NAME: Validation-signal score adjustment in Stage 2  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:81-86,93-101,110-142,683-690,695-699`  
DRAFT_DESCRIPTION: Stage 2 computes a validation multiplier from `qualityScore`, `specLevel`, `completionStatus`, and checklist presence, then applies it to the base score. The multiplier is bounded to `[0.8, 1.2]` to keep ranking effects controlled. This runs immediately after validation metadata enrichment and before final Stage 2 output sorting.  
SUGGESTED_CATEGORY: 14--pipeline-architecture  
SIGNIFICANCE: LOW  
NOTES: Post-adjustment reconciliation keeps `intentAdjustedScore` aligned with final `score`.
---

---
GAP_NUMBER: NEW-1  
FEATURE_NAME: Intent disambiguation guardrails (negative patterns + confidence floor)  
STATUS: NEW_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:169-187,407-447`  
DRAFT_DESCRIPTION: The classifier applies explicit negative-pattern penalties to suppress misleading intent matches (for example, “how to fix” patterns reducing `understand`). It also enforces a minimum confidence floor, defaulting weak classifications to `understand`. This is a concrete anti-misclassification behavior beyond basic intent scoring.  
SUGGESTED_CATEGORY: 12--query-intelligence  
SIGNIFICANCE: MEDIUM  
NOTES: Not listed explicitly in gaps 43-48.
---

---
GAP_NUMBER: NEW-2  
FEATURE_NAME: Deterministic provider-free centroid embedding classifier core  
STATUS: NEW_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:122-128,130-167,275-304,313-339,364-368`  
DRAFT_DESCRIPTION: Intent embedding vectors are built locally from hashed bag-of-words tokens using deterministic centroids. This avoids external embedding-provider dependency while retaining semantic-style intent separation. The centroids are built at module initialization and reused for fast classification.  
SUGGESTED_CATEGORY: 12--query-intelligence  
SIGNIFICANCE: MEDIUM  
NOTES: Distinct capability from generic “intent classifier” wording.
---

---
GAP_NUMBER: NEW-3  
FEATURE_NAME: Stage 2 post-signal score reconciliation guard  
STATUS: NEW_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:695-699`  
DRAFT_DESCRIPTION: After all Stage 2 score mutations, the pipeline enforces a reconciliation step so `intentAdjustedScore` cannot fall behind final `score`. This is a consistency guard for downstream consumers reading either field. It reduces silent divergence risk between ranking fields.  
SUGGESTED_CATEGORY: 11--scoring-and-calibration  
SIGNIFICANCE: LOW  
NOTES: Not represented in the 43-48 gap list.
---
tokens used
121,965
---
GAP_NUMBER: 43  
FEATURE_NAME: Hybrid intent classifier with per-intent weighting and MMR lambda mapping  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:34-120,122-198,275-455,473-523,583-591`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:14,714-716,878-879`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:35,181-183`  
DRAFT_DESCRIPTION: The intent classifier is hybrid: it combines deterministic centroid similarity, keyword matches, and regex patterns into a weighted score per intent. It supports seven intents and applies disambiguation rules (negative-pattern penalties and explicit spec-lookup biasing). The module also exports intent-specific scoring weights and `INTENT_LAMBDA_MAP`, which is consumed by both hybrid search and Stage 3 MMR reranking.  
SUGGESTED_CATEGORY: 12--query-intelligence  
SIGNIFICANCE: LOW  
NOTES: Implementation is active in ranking paths (hybrid + stage3), not just a helper.
---

---
GAP_NUMBER: 44  
FEATURE_NAME: Evidence-gap Z-score detection with graph-coverage precheck  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:13-24,82-125,138-179,191-193`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:40,259-277`  
DRAFT_DESCRIPTION: The TRM detector computes mean/stddev/top-score Z-score over retrieval scores and flags low-confidence evidence when statistical separation is weak or absolute score is too low. It includes defensive handling for empty input, single-score input, non-finite values, and zero-variance distributions. A graph-topology early coverage precheck is implemented in the same module for low-connectivity detection.  
SUGGESTED_CATEGORY: 14--pipeline-architecture  
SIGNIFICANCE: LOW  
NOTES: `predictGraphCoverage()` exists but appears uninvoked in current pipeline call paths.
---

---
GAP_NUMBER: 45  
FEATURE_NAME: Session attention boost (working-memory driven)  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:8-10,57-71,73-110,125-193`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:52,498-513`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:237-239`  
DRAFT_DESCRIPTION: Session boost reads `attention_score` from `working_memory` for the active session and matched memory IDs, then applies bounded multiplicative score increases. The boost factor is derived from attention and capped by a combined session+causal ceiling. Stage 2 applies this only on the hybrid path when enabled and when a session ID is present.  
SUGGESTED_CATEGORY: 01--retrieval  
SIGNIFICANCE: LOW  
NOTES: Rollout is feature-gated via `SPECKIT_SESSION_BOOST`.
---

---
GAP_NUMBER: 46  
FEATURE_NAME: Temporal-structural coherence utility scoring (FSRS x centrality)  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:39-46,62-80`  
DRAFT_DESCRIPTION: `fsrs.ts` implements structural freshness as `stability * centrality` with clamping to `[0,1]`. It also computes normalized graph degree centrality using inbound/outbound edges and node-count normalization. Together these functions provide a temporal-structural coherence signal primitive.  
SUGGESTED_CATEGORY: 11--scoring-and-calibration  
SIGNIFICANCE: LOW  
NOTES: No direct runtime call sites were found in current `lib/search` pipeline modules.
---

---
GAP_NUMBER: 47  
FEATURE_NAME: Anchor region metadata enrichment (line-aware, typed)  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:56-63,77-86,104-148,165-181`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:63,672-681`  
DRAFT_DESCRIPTION: Anchor enrichment parses `<!-- ANCHOR:id --> ... <!-- /ANCHOR:id -->` regions and emits structured metadata (`id`, `type`, `startLine`, `endLine`). Type extraction supports uppercase prefix conventions and preserves simple IDs. Stage 2 injects `anchorMetadata` onto result rows after score-affecting steps, preserving score immutability for this phase.  
SUGGESTED_CATEGORY: 14--pipeline-architecture  
SIGNIFICANCE: LOW  
NOTES: Parser supports nested anchors and tolerates malformed/unmatched tags.
---

---
GAP_NUMBER: 48  
FEATURE_NAME: Validation-signal score adjustment in Stage 2  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:81-86,93-101,110-142,683-690,695-699`  
DRAFT_DESCRIPTION: Stage 2 computes a validation multiplier from `qualityScore`, `specLevel`, `completionStatus`, and checklist presence, then applies it to the base score. The multiplier is bounded to `[0.8, 1.2]` to keep ranking effects controlled. This runs immediately after validation metadata enrichment and before final Stage 2 output sorting.  
SUGGESTED_CATEGORY: 14--pipeline-architecture  
SIGNIFICANCE: LOW  
NOTES: Post-adjustment reconciliation keeps `intentAdjustedScore` aligned with final `score`.
---

---
GAP_NUMBER: NEW-1  
FEATURE_NAME: Intent disambiguation guardrails (negative patterns + confidence floor)  
STATUS: NEW_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:169-187,407-447`  
DRAFT_DESCRIPTION: The classifier applies explicit negative-pattern penalties to suppress misleading intent matches (for example, “how to fix” patterns reducing `understand`). It also enforces a minimum confidence floor, defaulting weak classifications to `understand`. This is a concrete anti-misclassification behavior beyond basic intent scoring.  
SUGGESTED_CATEGORY: 12--query-intelligence  
SIGNIFICANCE: MEDIUM  
NOTES: Not listed explicitly in gaps 43-48.
---

---
GAP_NUMBER: NEW-2  
FEATURE_NAME: Deterministic provider-free centroid embedding classifier core  
STATUS: NEW_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:122-128,130-167,275-304,313-339,364-368`  
DRAFT_DESCRIPTION: Intent embedding vectors are built locally from hashed bag-of-words tokens using deterministic centroids. This avoids external embedding-provider dependency while retaining semantic-style intent separation. The centroids are built at module initialization and reused for fast classification.  
SUGGESTED_CATEGORY: 12--query-intelligence  
SIGNIFICANCE: MEDIUM  
NOTES: Distinct capability from generic “intent classifier” wording.
---

---
GAP_NUMBER: NEW-3  
FEATURE_NAME: Stage 2 post-signal score reconciliation guard  
STATUS: NEW_GAP  
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:695-699`  
DRAFT_DESCRIPTION: After all Stage 2 score mutations, the pipeline enforces a reconciliation step so `intentAdjustedScore` cannot fall behind final `score`. This is a consistency guard for downstream consumers reading either field. It reduces silent divergence risk between ranking fields.  
SUGGESTED_CATEGORY: 11--scoring-and-calibration  
SIGNIFICANCE: LOW  
NOTES: Not represented in the 43-48 gap list.
---
