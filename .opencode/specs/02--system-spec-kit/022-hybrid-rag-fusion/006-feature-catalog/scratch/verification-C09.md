OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce98-1ca6-7930-934e-559371d9d9e7
--------
user
You are a feature catalog verification agent. Read these specific feature snippet files: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md through /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md (files 01 through 05). For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. 

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
mcp: code_mode starting
mcp: spec_kit_memory starting
mcp: sequential_thinking starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m verifying those five feature catalog snippets against the actual `mcp_server` code and checking their listed source paths. I’ll first look for any deeper `AGENTS.md` files in scope, then read the feature files and the referenced implementation files side by side so we can compare the docs to reality precisely.
exec
/bin/zsh -lc "rg --files -g 'AGENTS.md' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/AGENTS.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/03--commands-and-skills/sk-mcp/001-mcp-clickup-creation/context/clickup-cli-main/AGENTS.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/AGENTS.md
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Verify feature catalog markdown snippets against referenced source code and identify missing or invalid source file paths" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 751ms:
[
  {
    "skill": "sk-code--full-stack",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !code(multi), !intent:implementation, code(name), file~, test~"
  },
  {
    "skill": "sk-doc",
    "kind": "skill",
    "confidence": 0.83,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !intent:documentation, !markdown, code~, markdown"
  }
]
codex
I’ve confirmed there isn’t a deeper `AGENTS.md` under the `system-spec-kit` feature catalog path, so the repo-level instructions apply here. Skill routing recommended `sk-code--full-stack` and `sk-doc`; I’m loading just the relevant guidance from those skill files now, then I’ll inspect the five feature snippets and their referenced implementation files.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--full-stack/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-doc/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "for f in .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/0{1,2,3,4,5}-*.md; do printf 'FILE:%s\\n' \""'$f"; rg -n "''^## Source Files|''^## Current Reality|''^- " "$f"; printf '"'\\n'; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
---
name: sk-doc
description: "Unified markdown and OpenCode component specialist providing document quality enforcement, content optimization, component creation workflows (skills, agents, commands), ASCII flowcharts and install guides."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.1.2.0
---

<!-- Keywords: sk-doc, markdown-quality, skill-creation, document-validation, ascii-flowchart, llms-txt, content-optimization, extract-structure -->

# Documentation Creation Specialist - Unified Markdown & Component Management

Unified specialist providing: (1) Document quality pipeline with structure enforcement and content optimization, (2) OpenCode component creation (skills, agents, commands) with scaffolding, validation and packaging, (3) ASCII flowchart creation for visualizing workflows and (4) Install guide creation for setup documentation.

**Core Principle**: Structure first, then content, then quality.

**Architecture**: Scripts handle deterministic parsing/metrics. AI handles quality judgment and recommendations.


## 1. WHEN TO USE

 succeeded in 52ms:
---
name: sk-code--full-stack
description: "Stack-agnostic development orchestrator guiding developers through implementation, testing, and verification phases with automatic stack detection via marker files and bundled stack-specific knowledge."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.1.0.0
---

<!-- Keywords: sk-code--web, development-orchestrator, multi-stack, stack-detection, debugging-workflow, implementation-patterns, react, nextjs, react-native, swift, go, nodejs -->

# Code Workflows - Stack-Agnostic Development Orchestrator

Unified workflow guidance for any technology stack: Go, Node.js, React/Next.js, React Native/Expo, Swift, and more.

**Core principle**: Implementation -> Testing/Debugging -> Verification (MANDATORY) = reliable, production-ready code.


## 1. WHEN TO USE

### Activation Triggers

 succeeded in 52ms:
FILE:.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md
3:## Current Reality
9:## Source Files
39:- Group: Graph signal activation
40:- Source feature title: Typed-weighted degree channel
41:- Current reality source: FEATURE_CATALOG.md

FILE:.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/02-co-activation-boost-strength-increase.md
3:## Current Reality
9:## Source Files
25:- Group: Graph signal activation
26:- Source feature title: Co-activation boost strength increase
27:- Current reality source: FEATURE_CATALOG.md

FILE:.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/03-edge-density-measurement.md
3:## Current Reality
7:## Source Files
23:- Group: Graph signal activation
24:- Source feature title: Edge density measurement
25:- Current reality source: FEATURE_CATALOG.md
codex
I’ve got the five target files and the relevant skill guidance loaded. Next I’m pulling the full `Current Reality` and `Source Files` sections, then I’ll open each referenced implementation file and look for unlisted code paths that materially participate in the feature.
exec
/bin/zsh -lc "for f in .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/0{1,2,3,4,5}-*.md; do printf '===== %s =====\\n' \""'$f"; sed -n '"'1,120p' \""'$f"; printf '"'\\n'; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "typed-weighted degree|co-activation|edge density|weight history|graph momentum|momentum score|weighted degree|history audit|activation boost|density" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
===== .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md =====
# Typed-weighted degree channel

## Current Reality

A fifth RRF channel scores memories by their graph connectivity. Edge type weights range from caused at 1.0 down to supports at 0.5, with logarithmic normalization and a hub cap (`MAX_TYPED_DEGREE=15`, `MAX_TOTAL_DEGREE=50`, `DEGREE_BOOST_CAP=0.15`) to prevent any single memory from dominating results through connections alone.

Constitutional memories are excluded from degree boosting because they already receive top-tier visibility. The channel runs behind the `SPECKIT_DEGREE_BOOST` feature flag with a degree cache that invalidates only on graph mutations, not per query. When a memory has zero edges, the channel returns 0 rather than failing.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
| `mcp_server/lib/search/graph-flags.ts` | Lib | Graph feature flags |
| `mcp_server/lib/search/graph-search-fn.ts` | Lib | Graph degree scoring |
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:78:import * as coActivation from './lib/cache/cognitive/co-activation';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:26:import * as coActivation from '../lib/cache/cognitive/co-activation';
.opencode/skill/system-spec-kit/mcp_server/README.md:647:│   ├── cognitive/          # FSRS, PE gating, state model, co-activation, rollout policy
.opencode/skill/system-spec-kit/mcp_server/README.md:704:| `SPECKIT_ENTITY_LINKING_MAX_DENSITY` | `1.0`                      | S5 density guard threshold for cross-document entity linking |
.opencode/skill/system-spec-kit/mcp_server/README.md:706:S5 density guard behavior in `lib/search/entity-linker.ts`: if current global edge density (`causal_edges / memory_index`) is already above the threshold, entity linking is skipped for that run. During link creation, inserts that would push projected density above the threshold are skipped. Invalid values (non-numeric or non-finite) and negative values for `SPECKIT_ENTITY_LINKING_MAX_DENSITY` fall back to `1.0`.
.opencode/skill/system-spec-kit/mcp_server/README.md:747:| `SPECKIT_DEGREE_BOOST`          | `true`  | Typed-weighted degree channel |
.opencode/skill/system-spec-kit/mcp_server/README.md:788:| `SPECKIT_SAVE_QUALITY_GATE`    | `true`  | Pre-storage quality gate rejects content below 0.4 signal density (TM-04) |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:109:        const density = typeof linkResult.edgeDensity === 'number'
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:112:        const threshold = typeof linkResult.densityThreshold === 'number'
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:113:          ? linkResult.densityThreshold.toFixed(3)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:115:        console.error(`[entity-linking] Skipped by density guard (density=${density}, threshold=${threshold})`);
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:9:import { clearRelatedCache } from '../lib/cache/cognitive/co-activation';
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:165:  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 1500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:166:  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', description: 'User prompt or text to match against trigger phrases' }, limit: { type: 'number', default: 3, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:562:- `quality`: Result quality score based on embedding confidence and match density
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:528:    const density = computeEdgeDensity(db);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:529:    expect(density).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:544:    const density = computeEdgeDensity(db);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:545:    expect(density).toBe(6 / 4);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:546:    expect(density).toBe(1.5);
codex
I’ve already spotted one likely drift point: the codebase contains both `lib/cognitive/co-activation.ts` and `lib/cache/cognitive/co-activation.ts`, and the live search pipeline currently imports the cache-scoped path. I’m checking each feature’s listed paths for existence and then tracing which files the runtime actually uses so I can separate “exists” from “actually implements the feature.”
exec
/bin/zsh -lc 'ls -1 .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/lib/cognitive .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive .opencode/skill/system-spec-kit/mcp_server/lib/graph .opencode/skill/system-spec-kit/mcp_server/lib/storage .opencode/skill/system-spec-kit/mcp_server/lib/eval .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive:
README.md
archival-manager.ts
attention-decay.ts
co-activation.ts
fsrs-scheduler.ts
prediction-error-gate.ts
pressure-monitor.ts
rollout-policy.ts
temporal-contiguity.ts
tier-classifier.ts
working-memory.ts

.opencode/skill/system-spec-kit/mcp_server/lib/cognitive:
README.md
archival-manager.ts
attention-decay.ts
co-activation.ts
fsrs-scheduler.ts
prediction-error-gate.ts
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Graph Flags
// ---------------------------------------------------------------
// AI-WHY: Legacy compatibility shim retained for test/runtime imports.

import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';

/**
 * Unified graph channel gate (default-on, explicit opt-out with `'false'`).
 */
export function isGraphUnifiedEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_GRAPH_UNIFIED');
}
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Graph Search Fn
// ---------------------------------------------------------------
// Causal graph search channel — uses FTS5 for node matching

import { sanitizeFTS5Query } from './bm25-index';
import { queryHierarchyMemories } from './spec-folder-hierarchy';

import type Database from 'better-sqlite3';
import type { GraphSearchFn } from './search-types';

// --- 1. TYPES ---

interface CausalEdgeRow {
  id: string;
  source_id: string;
  target_id: string;
  relation: string;
  strength: number;
}
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Graph Signals
// ---------------------------------------------------------------
// Deferred feature — gated via SPECKIT_GRAPH_SIGNALS
// ---------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. IMPORTS
// ---------------------------------------------------------------------------

import type Database from 'better-sqlite3';

// ---------------------------------------------------------------------------
// 2. SESSION CACHE
// ---------------------------------------------------------------------------

/** Maximum number of entries allowed in each session-scoped cache. */
const CACHE_MAX_SIZE = 10000;

/** Session-scoped cache for momentum scores (memoryId -> momentum). */
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Causal Edges
// ---------------------------------------------------------------
// Causal relationship graph for memory lineage
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { clearDegreeCache } from '../search/graph-search-fn';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const RELATION_TYPES = Object.freeze({
  CAUSED: 'caused',
  ENABLED: 'enabled',
  SUPERSEDES: 'supersedes',
  CONTRADICTS: 'contradicts',
  DERIVED_FROM: 'derived_from',
  SUPPORTS: 'supports',
codex
The implementation split is becoming clearer: several feature snippets list files that exist, but some of the live runtime wiring now goes through newer modules than the snippets mention. I’m reading the specific functions and call sites now so I can judge each feature against the real execution path, not just the existence of utility files.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/co-activation.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Edge Density (Sprint 1 T003)
     3	// ---------------------------------------------------------------
     4	// AI-WHY: 
     5	// Measures the edge density of the causal graph:
     6	//   density = edge_count / total_memories
     7	//
     8	// This denominator makes sparse non-empty graphs measurable.
     9	// Fallback for legacy/partial datasets: if total_memories is 0,
    10	// use unique participating nodes as denominator.
    11	//
    12	// Density classifications:
    13	//   >= 1.0  → "dense"    — graph is highly connected
    14	//   0.5–1.0 → "moderate" — sufficient for graph signals
    15	//   < 0.5   → "sparse"   — R10 escalation recommended
    16	//
    17	// When density < 0.5 an R10 escalation recommendation is generated
    18	// and included in the result.
    19	
    20	import type Database from 'better-sqlite3';
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Graph Search Fn
     3	// ---------------------------------------------------------------
     4	// Causal graph search channel — uses FTS5 for node matching
     5	
     6	import { sanitizeFTS5Query } from './bm25-index';
     7	import { queryHierarchyMemories } from './spec-folder-hierarchy';
     8	
     9	import type Database from 'better-sqlite3';
    10	import type { GraphSearchFn } from './search-types';
    11	
    12	// --- 1. TYPES ---
    13	
    14	interface CausalEdgeRow {
    15	  id: string;
    16	  source_id: string;
    17	  target_id: string;
    18	  relation: string;
    19	  strength: number;
    20	}
 succeeded in 52ms:
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
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts | sed -n '260,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts | sed -n '260,420p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '260,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts | sed -n '180,380p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
   260	 * separate debounce (lastEdgeCount + computedThisSession) to skip
   261	 * re-computation when the graph is unchanged.  No additional optimization
   262	 * is needed at this time.
   263	 *
   264	 * Cache warmup strategy:
   265	 *   - The cache is populated lazily: entries are written on first access via
   266	 *     computeDegreeScores() as each memory ID is encountered during a search.
   267	 *   - Cold-start (empty cache): every ID in a batch triggers a DB query
   268	 *     (computeTypedDegree SQL). The global max degree is recomputed per-batch
   269	 *     since it is not cached separately.
   270	 *   - Subsequent requests: hits are served from the Map without touching the DB.
   271	 *   - Invalidation: clearDegreeCache() wipes all entries on causal edge
   272	 *     insert/update/delete so the next batch recomputes from current DB state.
   273	 */
   274	const degreeCache = new Map<string, number>();
   275	
   276	/**
   277	 * Compute the raw typed-weighted degree for a single memory node.
   278	 *
   279	 * Counts edges where the memory appears as source OR target,
 succeeded in 51ms:
   260	        ) as Database.Statement).get(row.neighbor_id) as Record<string, unknown> | undefined;
   261	
   262	        if (fullMemory) {
   263	          results.push({
   264	            ...(fullMemory as RelatedMemory),
   265	            // Map edge strength (0-1) to similarity scale (0-100) for consistent scoring
   266	            similarity: Math.round(row.strength * 100),
   267	          });
   268	        }
   269	      } catch (_err: unknown) { // AI-GUARD: Causal neighbor lookup failure — skip
   270	        // Skip individual failures
   271	      }
   272	    }
   273	
   274	    return results;
   275	  } catch (error: unknown) {
   276	    const msg = error instanceof Error ? error.message : String(error);
   277	    console.warn(`[co-activation] getCausalNeighbors error: ${msg}`);
   278	    return [];
   279	  }
 succeeded in 50ms:
   260	  try {
   261	    return (db.prepare(`
   262	      SELECT * FROM causal_edges
   263	      WHERE source_id = ?
   264	      ORDER BY strength DESC
   265	      LIMIT ?
   266	    `) as Database.Statement).all(sourceId, limit) as CausalEdge[];
   267	  } catch (error: unknown) {
   268	    const msg = error instanceof Error ? error.message : String(error);
   269	    console.warn(`[causal-edges] getEdgesFrom error: ${msg}`);
   270	    return [];
   271	  }
   272	}
   273	
   274	function getEdgesTo(targetId: string, limit: number = MAX_EDGES_LIMIT): CausalEdge[] {
   275	  if (!db) return [];
   276	
   277	  try {
   278	    return (db.prepare(`
   279	      SELECT * FROM causal_edges
 succeeded in 51ms:
   180	  } catch (_error: unknown) {
   181	    return null;
   182	  }
   183	}
   184	
   185	/**
   186	 * Parse and validate the maximum edge density threshold for S5 linking.
   187	 * Accepts finite non-negative values; invalid inputs fall back to default.
   188	 */
   189	function sanitizeDensityThreshold(value: unknown): number {
   190	  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value));
   191	  if (!Number.isFinite(parsed) || parsed < 0) {
   192	    return DEFAULT_MAX_EDGE_DENSITY;
   193	  }
   194	  return parsed;
   195	}
   196	
   197	/**
   198	 * Resolve S5 density threshold from env var with safe fallback.
   199	 */
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '620,780p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "degree_snapshots|weight_history|clearGraphSignalsCache|clearDegreeCache|computeDegreeScores|SPECKIT_DEGREE_BOOST|SPECKIT_GRAPH_SIGNALS|SPECKIT_COACTIVATION_STRENGTH|SPECKIT_GRAPH_UNIFIED" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/context-server.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '860,980p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   620	  if (!db) return [];
   621	  try {
   622	    return (db.prepare(`
   623	      SELECT * FROM weight_history WHERE edge_id = ? ORDER BY changed_at DESC LIMIT ?
   624	    `) as Database.Statement).all(edgeId, limit) as WeightHistoryEntry[];
   625	  } catch (error: unknown) {
   626	    const msg = error instanceof Error ? error.message : String(error);
   627	    console.warn(`[causal-edges] getWeightHistory error: ${msg}`);
   628	    return [];
   629	  }
   630	}
   631	
   632	function rollbackWeights(edgeId: number, toTimestamp: string): boolean {
   633	  if (!db) return false;
   634	  const database = db;
   635	  try {
   636	    // AI-WHY: Wrap SELECTs + UPDATE + logWeightChange in a transaction for atomicity
   637	    const changed = database.transaction(() => {
   638	      // Get current strength before rollback
   639	      const current = (database.prepare(
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:8:import { clearGraphSignalsCache } from '../lib/graph/graph-signals';
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:46:    clearGraphSignalsCache();
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:41:    it('boostFactor is 0.25 (configurable via SPECKIT_COACTIVATION_STRENGTH)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:7:// Verifies SPECKIT_GRAPH_UNIFIED env semantics and behavior when
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:50:      delete process.env.SPECKIT_GRAPH_UNIFIED;
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:54:      delete process.env.SPECKIT_GRAPH_UNIFIED;
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:62:      process.env.SPECKIT_GRAPH_UNIFIED = 'true';
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:67:      delete process.env.SPECKIT_GRAPH_UNIFIED;
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:70:      process.env.SPECKIT_GRAPH_UNIFIED = 'false';
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:73:      delete process.env.SPECKIT_GRAPH_UNIFIED;
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:78:      process.env.SPECKIT_GRAPH_UNIFIED = 'TRUE';
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:83:      process.env.SPECKIT_GRAPH_UNIFIED = '1';
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:88:      process.env.SPECKIT_GRAPH_UNIFIED = 'yes';
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:93:      process.env.SPECKIT_GRAPH_UNIFIED = 'True';
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:98:      process.env.SPECKIT_GRAPH_UNIFIED = '';
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:103:      process.env.SPECKIT_GRAPH_UNIFIED = 'false';
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:117:      delete process.env.SPECKIT_GRAPH_UNIFIED;
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:126:      delete process.env.SPECKIT_GRAPH_UNIFIED;
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:184:      delete process.env.SPECKIT_GRAPH_UNIFIED;
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:189:      delete process.env.SPECKIT_GRAPH_UNIFIED;
 succeeded in 51ms:
   860	                  new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4)
   861	                );
   862	              }
   863	            }
   864	
   865	            const mmrCandidates: MMRCandidate[] = [];
   866	            for (const r of reranked) {
   867	              const emb = embeddingMap.get(r.id as number);
   868	              if (emb) {
   869	                mmrCandidates.push({
   870	                  id: r.id as number,
   871	                  score: (r.score as number) ?? 0,
   872	                  embedding: emb,
   873	                });
   874	              }
   875	            }
   876	
   877	            if (mmrCandidates.length >= MMR_MIN_CANDIDATES) {
   878	              const mmrLambda = INTENT_LAMBDA_MAP[intent] ?? MMR_DEFAULT_LAMBDA;
   879	              const diversified = applyMMR(mmrCandidates, { lambda: mmrLambda, limit });
 succeeded in 51ms:
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
codex
I’ve now confirmed the core degree, co-activation, density, momentum, and audit implementations. The remaining check is the “wiring” layer: migrations, mutation hooks, and stage-2 search fusion are where some of these snippets are either fully accurate or a little behind the codebase.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '500,660p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '620,700p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "applyGraphSignals|co-activation spreading|momentum|graph signals|degree boost|computeDegreeScores|SPECKIT_DEGREE_BOOST" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts | sed -n '120,210p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   500	  // when the full hybrid result set is available for ordering.
   501	  if (isHybrid && config.enableSessionBoost && config.sessionId) {
   502	    try {
   503	      const { results: boosted, metadata: sbMeta } = sessionBoost.applySessionBoost(
   504	        results,
   505	        config.sessionId
   506	      );
   507	      results = boosted as PipelineRow[];
   508	      metadata.sessionBoostApplied = sbMeta.applied;
   509	    } catch (err: unknown) {
   510	      const message = err instanceof Error ? err.message : String(err);
   511	      console.warn(`[stage2-fusion] session boost failed: ${message}`);
   512	    }
   513	  }
   514	
   515	  // -- 2. Causal boost --
   516	  // Only for hybrid search type — causal graph traversal is seeded from the
   517	  // top results after session boost has re-ordered them.
   518	  if (isHybrid && config.enableCausalBoost) {
   519	    try {
 succeeded in 50ms:
   120	 */
   121	export function isConsolidationEnabled(): boolean {
   122	  return isFeatureEnabled('SPECKIT_CONSOLIDATION');
   123	}
   124	
   125	/**
   126	 * R16: Encoding-intent capture at index time.
   127	 * Records intent metadata (document, code, structured_data) alongside embeddings.
   128	 * Default: TRUE (graduated). Set SPECKIT_ENCODING_INTENT=false to disable.
   129	 */
   130	export function isEncodingIntentEnabled(): boolean {
   131	  return isFeatureEnabled('SPECKIT_ENCODING_INTENT');
   132	}
   133	
   134	// -- Deferred Features (graduated to default-ON) --
   135	
   136	/**
   137	 * N2a+N2b: Graph momentum scoring and causal depth signals.
   138	 * Default: TRUE (enabled). Set SPECKIT_GRAPH_SIGNALS=false to disable.
   139	 */
 succeeded in 51ms:
   620	      if (bm25ChannelResults.length > 0) {
   621	        // AI-WHY: BM25 weight 0.6 is lowest lexical channel — in-memory BM25 index
   622	        // has less precise scoring than SQLite FTS5 BM25; kept for coverage breadth.
   623	        lists.push({ source: 'bm25', results: bm25ChannelResults, weight: 0.6 });
   624	      }
   625	    }
   626	
   627	    // Graph channel (T008: metrics collection) — gated by Sprint 3 routing
   628	    const useGraph = (options.useGraph !== false) && activeChannels.has('graph');
   629	    if (useGraph && graphSearchFn) {
   630	      try {
   631	        graphMetrics.totalQueries++; // counted only if channel executes
   632	        const graphResults = graphSearchFn(query, {
   633	          limit: options.limit || DEFAULT_LIMIT,
   634	          specFolder: options.specFolder,
   635	          intent: options.intent,
   636	        });
   637	        if (graphResults.length > 0) {
   638	          graphMetrics.graphHits++;
   639	          lists.push({ source: 'graph', results: graphResults.map((r: Record<string, unknown>) => ({
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:26:import { computeDegreeScores } from './graph-search-fn';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:180:/** Number of top results used as seeds for co-activation spreading. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:650:    // Graduated: default-ON. Set SPECKIT_DEGREE_BOOST=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:664:          const degreeScores = computeDegreeScores(db, Array.from(allResultIds));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:26://   2c. Graph signals           — N2a momentum + N2b causal depth
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:66:import { applyGraphSignals } from '../../graph/graph-signals';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:90:/** Number of top results used as seeds for co-activation spreading. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:469: *   2c. Graph signals      (N2a+N2b — momentum + depth)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:564:      console.warn(`[stage2-fusion] co-activation spreading failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:569:  // Inject community co-members into result set before graph signals
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:570:  // so injected rows also receive momentum/depth adjustments.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:586:  // Additive score adjustments for graph momentum and causal depth.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:590:      const signaled = applyGraphSignals(results, db);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:595:      console.warn(`[stage2-fusion] graph signals failed: ${message}`);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts | sed -n '260,420p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts | sed -n '340,390p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts | sed -n '520,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Mutation Hooks
     3	// ---------------------------------------------------------------
     4	
     5	import * as triggerMatcher from '../lib/parsing/trigger-matcher';
     6	import * as toolCache from '../lib/cache/tool-cache';
     7	import { clearConstitutionalCache } from '../hooks/memory-surface';
     8	import { clearGraphSignalsCache } from '../lib/graph/graph-signals';
     9	import { clearRelatedCache } from '../lib/cache/cognitive/co-activation';
    10	
    11	import type { MutationHookResult } from './memory-crud-types';
    12	
    13	export type { MutationHookResult };
    14	
    15	function runPostMutationHooks(
    16	  operation: string,
    17	  context: Record<string, unknown> = {}
    18	): MutationHookResult {
    19	  const startTime = Date.now();
    20	
 succeeded in 51ms:
   260	    const { adjacency, allNodes, inDegree } = buildAdjacencyList(db);
   261	
   262	    if (allNodes.size === 0) {
   263	      for (const id of uncached) {
   264	        depthCache.set(id, 0);
   265	        results.set(id, 0);
   266	      }
   267	      return results;
   268	    }
   269	
   270	    // Find root nodes
   271	    const roots: number[] = [];
   272	    for (const nodeId of allNodes) {
   273	      if ((inDegree.get(nodeId) ?? 0) === 0) {
   274	        roots.push(nodeId);
   275	      }
   276	    }
   277	
   278	    if (roots.length === 0) {
   279	      for (const id of uncached) {
 succeeded in 51ms:
   340	  });
   341	
   342	  return update_memory_tx();
   343	}
   344	
   345	/**
   346	 * Deletes a memory and its related index records.
   347	 * @param id - The memory identifier.
   348	 * @returns True when a memory was deleted.
   349	 */
   350	export function delete_memory(id: number): boolean {
   351	  const database = initialize_db();
   352	  const sqlite_vec = get_sqlite_vec_available();
   353	
   354	  const delete_memory_tx = database.transaction(() => {
   355	    database.prepare('DELETE FROM memory_history WHERE memory_id = ?').run(id);
   356	
   357	    if (sqlite_vec) {
   358	      try {
   359	        database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
 succeeded in 51ms:
   520	      try {
   521	        database.exec('ALTER TABLE memory_index ADD COLUMN interference_score REAL DEFAULT 0');
   522	        logger.info('Migration v17: Added interference_score column (TM-01)');
   523	      } catch (e: unknown) {
   524	        if (!get_error_message(e).includes('duplicate column')) {
   525	          console.warn('[VectorIndex] Migration v17 warning (interference_score):', get_error_message(e));
   526	        }
   527	      }
   528	
   529	      try {
   530	        database.exec('CREATE INDEX IF NOT EXISTS idx_interference_score ON memory_index(interference_score)');
   531	        logger.info('Migration v17: Created interference_score index');
   532	      } catch (e: unknown) {
   533	        console.warn('[VectorIndex] Migration v17 warning (idx_interference_score):', get_error_message(e));
   534	      }
   535	    },
   536	
   537	    18: () => {
   538	      try {
   539	        database.exec(`
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"from '../cache/cognitive/rollout-policy'|from '../../cache/cognitive/rollout-policy'|from './rollout-policy'|isFeatureEnabled\\(\" .opencode/skill/system-spec-kit/mcp_server/lib" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Search Flags
     3	// ---------------------------------------------------------------
     4	// Default-on runtime gates for search pipeline controls
     5	//
     6	// Production-ready flags graduated to default-ON.
     7	// Set SPECKIT_<FLAG>=false to disable any graduated feature.
     8	
     9	import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';
    10	
    11	/**
    12	 * Graph-guided MMR diversity reranking.
    13	 * Default: TRUE (enabled). Set SPECKIT_MMR=false to disable.
    14	 */
    15	export function isMMREnabled(): boolean {
    16	  return isFeatureEnabled('SPECKIT_MMR');
    17	}
    18	
    19	/**
    20	 * Transparent Reasoning Module (evidence-gap detection).
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:7:import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:71:  return isFeatureEnabled('SPECKIT_EXTRACTION', identity);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts:6:import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts:12:  return isFeatureEnabled('SPECKIT_GRAPH_UNIFIED');
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:6:import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:29:  return isFeatureEnabled('SPECKIT_SESSION_BOOST', sessionId ?? undefined);
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:9:import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:59:  return isFeatureEnabled('SPECKIT_CAUSAL_BOOST');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:9:import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:16:  return isFeatureEnabled('SPECKIT_MMR');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:24:  return isFeatureEnabled('SPECKIT_TRM');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:32:  return isFeatureEnabled('SPECKIT_MULTI_QUERY');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:40:  return isFeatureEnabled('SPECKIT_CROSS_ENCODER');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:48:  return isFeatureEnabled('SPECKIT_SEARCH_FALLBACK');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:56:  return isFeatureEnabled('SPECKIT_FOLDER_DISCOVERY');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:66:  return isFeatureEnabled('SPECKIT_DOCSCORE_AGGREGATION');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:74:  return isFeatureEnabled('SPECKIT_SAVE_QUALITY_GATE');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:82:  return isFeatureEnabled('SPECKIT_RECONSOLIDATION');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:90:  return isFeatureEnabled('SPECKIT_NEGATIVE_FEEDBACK');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:111:  return isFeatureEnabled('SPECKIT_EMBEDDING_EXPANSION');
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Rollout Policy
     3	// ---------------------------------------------------------------
     4	
     5	const DEFAULT_ROLLOUT_PERCENT = 100;
     6	
     7	function getRolloutPercent(): number {
     8	  const raw = process.env.SPECKIT_ROLLOUT_PERCENT;
     9	  if (typeof raw !== 'string' || raw.trim().length === 0) {
    10	    return DEFAULT_ROLLOUT_PERCENT;
    11	  }
    12	
    13	  const parsed = Number.parseInt(raw, 10);
    14	  if (!Number.isFinite(parsed)) {
    15	    return DEFAULT_ROLLOUT_PERCENT;
    16	  }
    17	
    18	  return Math.max(0, Math.min(100, parsed));
    19	}
    20	
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Rollout Policy
     3	// ---------------------------------------------------------------
     4	
     5	const DEFAULT_ROLLOUT_PERCENT = 100;
     6	
     7	function getRolloutPercent(): number {
     8	  const raw = process.env.SPECKIT_ROLLOUT_PERCENT;
     9	  if (typeof raw !== 'string' || raw.trim().length === 0) {
    10	    return DEFAULT_ROLLOUT_PERCENT;
    11	  }
    12	
    13	  const parsed = Number.parseInt(raw, 10);
    14	  if (!Number.isFinite(parsed)) {
    15	    return DEFAULT_ROLLOUT_PERCENT;
    16	  }
    17	
    18	  return Math.max(0, Math.min(100, parsed));
    19	}
    20	
exec
/bin/zsh -lc "rg -n \"touchEdgeAccess|getStaleEdges|updateEdge\\(|weight_history|created_by|last_accessed|MAX_EDGES_PER_NODE|MAX_AUTO_STRENGTH\" .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node -e \"const fs=require('fs'); const path=require('path'); const root=path.resolve('.opencode/skill/system-spec-kit'); const feats=['feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md','feature_catalog/10--graph-signal-activation/02-co-activation-boost-strength-increase.md','feature_catalog/10--graph-signal-activation/03-edge-density-measurement.md','feature_catalog/10--graph-signal-activation/04-weight-history-audit-tracking.md','feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md']; for (const feat of feats){ const text=fs.readFileSync(path.join(root,feat),'utf8'); const paths=[...text.matchAll(/"'`(mcp_server'"\\/["'^`]+)`/g)].map(m=>m[1]); console.log('"'FEATURE:'+path.basename(feat)); for (const p of paths){ console.log((fs.existsSync(path.join(root,p))?'OK   ':'MISS ')+p);} console.log(''); }\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "degree_snapshots|snapshotDegrees|computeMomentum|applyGraphSignals|graph signals|SPECKIT_GRAPH_SIGNALS" .opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"runPostMutationHooks\\(|clearGraphSignalsCache\\(|insertEdge\\(|updateEdge\\(|deleteEdge\\(|rollbackWeights\\(\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:13:  getStaleEdges,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:15:  MAX_EDGES_PER_NODE,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:16:  MAX_AUTO_STRENGTH,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:334: * All weight changes are logged to weight_history via updateEdge().
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:345:        SELECT id, strength, last_accessed, created_by FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:346:        WHERE last_accessed IS NOT NULL
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:347:          AND last_accessed > datetime('now', '-7 days')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:355:          // Auto edges cannot exceed MAX_AUTO_STRENGTH
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:356:          const cappedStrength = edge.created_by === 'auto'
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:357:            ? Math.min(newStrength, MAX_AUTO_STRENGTH)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:361:            updateEdge(edge.id, { strength: cappedStrength }, 'hebbian', 'hebbian-strengthening');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:369:        SELECT id, strength, last_accessed, created_by FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:370:        WHERE (last_accessed IS NULL AND extracted_at < datetime('now', '-' || ? || ' days'))
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:371:           OR (last_accessed IS NOT NULL AND last_accessed < datetime('now', '-' || ? || ' days'))
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:377:          updateEdge(edge.id, { strength: newStrength }, 'hebbian', 'decay-30-day');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:399:  return getStaleEdges(STALENESS_THRESHOLD_DAYS);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:408: * - MAX_EDGES_PER_NODE = 20
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:419:    maxAllowed: MAX_EDGES_PER_NODE,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:420:    canAddAuto: currentCount < MAX_EDGES_PER_NODE,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:42:const MAX_EDGES_PER_NODE = 20;
 exited 1 in 52ms:
zsh:1: unmatched "
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:3:// Covers: snapshotDegrees, computeMomentum,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:4://         computeCausalDepthScores, applyGraphSignals, clearGraphSignalsCache
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:10:  snapshotDegrees,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:11:  computeMomentum,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:12:  computeMomentumScores,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:14:  applyGraphSignals,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:44:    CREATE TABLE degree_snapshots (
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:77:    INSERT OR REPLACE INTO degree_snapshots (memory_id, degree_count, snapshot_date)
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:99:  // 1. snapshotDegrees
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:101:  describe('snapshotDegrees', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:103:      const result = snapshotDegrees(db);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:110:      const result = snapshotDegrees(db);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:114:      const rows = db.prepare('SELECT * FROM degree_snapshots ORDER BY memory_id').all() as Array<{
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:131:      const result = snapshotDegrees(db);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:134:      const rows = db.prepare('SELECT * FROM degree_snapshots ORDER BY memory_id').all() as Array<{
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:150:      const result1 = snapshotDegrees(db);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:155:      const result2 = snapshotDegrees(db);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:159:      const rows = db.prepare('SELECT * FROM degree_snapshots').all();
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:169:      const result = snapshotDegrees(db);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:178:  // 2. computeMomentum
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:213:      postMutationHooks = runPostMutationHooks('bulk-delete', { specFolder, tier, deletedCount });
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:148:        causalEdges.insertEdge(edgeSourceId, edgeTargetId, mapping.relation, 1.0, `Auto-extracted from ${link_type} in memory file`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:453:      postMutationHooks = runPostMutationHooks('atomic-save', {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:205:    postMutationHooks = runPostMutationHooks('update', { memoryId: id });
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:502:    const edge = causalEdges.insertEdge(String(sourceId), String(targetId), safeRelation, strength ?? 1.0, evidence ?? null);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:682:    const result: { deleted: boolean } = { deleted: causalEdges.deleteEdge(edgeId) };
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:15:function runPostMutationHooks(
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:46:    clearGraphSignalsCache();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:206:      postMutationHooks = runPostMutationHooks('delete', { specFolder, deletedCount });
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:193:      postMutationHooks = runPostMutationHooks('save', { specFolder: result.specFolder, filePath });
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:341:        edgeId = causalEdges.insertEdge(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:334: * All weight changes are logged to weight_history via updateEdge().
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:361:            updateEdge(edge.id, { strength: cappedStrength }, 'hebbian', 'hebbian-strengthening');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:377:          updateEdge(edge.id, { strength: newStrength }, 'hebbian', 'decay-30-day');
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:42:export function clearGraphSignalsCache(): void {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:129:function insertEdge(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:230:      const id = insertEdge(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:368:function updateEdge(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:436:function deleteEdge(edgeId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:533:        if (deleteEdge(edge.id)) deleted++;
codex
One subtle but important thing surfaced in the momentum feature: `clearGraphSignalsCache()` is wired in `handlers/mutation-hooks.ts`, but the direct causal-edge handlers appear to call `causalEdges.insertEdge/deleteEdge` without invoking those hooks. I’m checking that path now because it affects whether the snippet’s cache-invalidation claim is fully true or only partially true.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts | sed -n '470,720p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"runPostMutationHooks\\(\" .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts .opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'for f in .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/0{1,2,3,4,5}-*.md; do echo "FEATURE:${f##*/}"; while IFS= read -r p; do rel=${p#
}; if [ -e ".opencode/skill/system-spec-kit/$p" ]; then echo "OK   $p"; else echo "MISS $p"; fi; done < <(grep -o '"'"'`mcp_server/[''^`]*`'"' \""'$f" | tr -d '"'"'`'"'); echo; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   470	    await checkDatabaseUpdated();
   471	
   472	    vectorIndex.initializeDb();
   473	    const db = vectorIndex.getDb();
   474	    if (!db) {
   475	      return createMCPErrorResponse({
   476	        tool: 'memory_causal_link',
   477	        error: 'Database not initialized. Server may still be starting up.',
   478	        code: 'E020',
   479	        details: {},
   480	        recovery: getRecoveryHint('memory_causal_link', 'E020'),
   481	        startTime: startTime
   482	      });
   483	    }
   484	    causalEdges.init(db);
   485	
   486	    const validRelations = Object.values(causalEdges.RELATION_TYPES) as string[];
   487	    if (!validRelations.includes(relation)) {
   488	      return createMCPErrorResponse({
   489	        tool: 'memory_causal_link',
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const root=path.resolve(\".opencode/skill/system-spec-kit\");const feats=[\"feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md\",\"feature_catalog/10--graph-signal-activation/02-co-activation-boost-strength-increase.md\",\"feature_catalog/10--graph-signal-activation/03-edge-density-measurement.md\",\"feature_catalog/10--graph-signal-activation/04-weight-history-audit-tracking.md\",\"feature_catalog/10--graph-momentum-scoring.md\"];'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:453:      postMutationHooks = runPostMutationHooks('atomic-save', {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:193:      postMutationHooks = runPostMutationHooks('save', { specFolder: result.specFolder, filePath });
 succeeded in 52ms:
FEATURE:01-typed-weighted-degree-channel.md
OK   mcp_server/lib/cognitive/rollout-policy.ts
OK   mcp_server/lib/parsing/content-normalizer.ts
OK   mcp_server/lib/search/bm25-index.ts
OK   mcp_server/lib/search/graph-flags.ts
OK   mcp_server/lib/search/graph-search-fn.ts
OK   mcp_server/lib/search/search-types.ts
OK   mcp_server/lib/search/spec-folder-hierarchy.ts
OK   mcp_server/tests/bm25-index.vitest.ts
OK   mcp_server/tests/content-normalizer.vitest.ts
OK   mcp_server/tests/degree-computation.vitest.ts
OK   mcp_server/tests/graph-flags.vitest.ts
OK   mcp_server/tests/graph-scoring-integration.vitest.ts
OK   mcp_server/tests/graph-search-fn.vitest.ts
OK   mcp_server/tests/rollout-policy.vitest.ts
OK   mcp_server/tests/rrf-degree-channel.vitest.ts
OK   mcp_server/tests/spec-folder-hierarchy.vitest.ts

FEATURE:02-co-activation-boost-strength-increase.md
OK   mcp_server/lib/cognitive/co-activation.ts
 succeeded in 53ms:

codex
I’ve finished the file-by-file verification and I’m doing one last consistency pass to avoid false positives. The main pattern is documentation drift: most listed paths exist, but a few snippets miss newer runtime wiring files, and two descriptions include behavior claims that the current code doesn’t fully back up.
exec
/bin/zsh -lc 'cmp -s .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts && echo SAME_ROLLOUT || echo DIFF_ROLLOUT' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'cmp -s .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/co-activation.ts && echo SAME_COACT || echo DIFF_COACT' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "entity-linking|density guard|computeEdgeDensity|getGlobalEdgeDensityStats" .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts .opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"0\\.25|0\\.3|dark-run|A7|R4-only|co-activation\" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts .opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
SAME_ROLLOUT
 succeeded in 53ms:
SAME_COACT
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:18:/** S5 density guard default: skip entity linking when projected density exceeds this threshold. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:21:/** Environment variable for overriding S5 density guard threshold. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:214:export function computeEdgeDensity(db: Database.Database): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:215:  return getGlobalEdgeDensityStats(db).density;
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:222:function getGlobalEdgeDensityStats(
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:295:  const densityStats = getGlobalEdgeDensityStats(db);
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:348:        // AI-GUARD: Global density guard: skip linking if this insert would push density
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:501:    const { density } = getGlobalEdgeDensityStats(db);
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:535:  getGlobalEdgeDensityStats,
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:695:      expect(typeof __testables.getGlobalEdgeDensityStats).toBe('function');
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:3:// Converted from: co-activation.test.ts (custom runner)
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:4:// Aligned with production co-activation.ts named exports
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:8:import * as coActivation from '../lib/cache/cognitive/co-activation';
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:41:    it('boostFactor is 0.25 (configurable via SPECKIT_COACTIVATION_STRENGTH)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:42:      expect(coActivation.CO_ACTIVATION_CONFIG.boostFactor).toBe(0.25);
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:83:      // perNeighborBoost = 0.25 * (80/100) = 0.2
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:88:      const perNeighborBoost = 0.25 * (80 / 100);
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:94:      // perNeighborBoost = 0.25 * (100/100) = 0.25
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:96:      // boost = 0.25 / 2.236 ≈ 0.1118
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:99:      const expectedBoost = 0.25 / Math.sqrt(5);
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:198:      // rawBoost = 0.25 * (5/5) * (95/100) = 0.2375
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:202:      const rawBoost = 0.25 * (5 / 5) * (95 / 100);
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:216:      // perNeighborBoost = 0.25 * (90/100) = 0.225
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:249:      // perNeighborBoost = 0.25 * (80/100) = 0.2
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:254:      const perNeighborBoost = 0.25 * (80 / 100);
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:262:      // perNeighborBoost = 0.25 * 1 = 0.25
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:264:      // boost = 0.25 / 2.236 ≈ 0.1118
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:265:      expect(result).toBeCloseTo(base + 0.25 / Math.sqrt(5), 5);
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:4:// T002 (degree as 5th RRF channel) + T003a (co-activation boost)
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:342:  // The co-activation module reads env vars at import time,
codex
---
FEATURE: 01-typed-weighted-degree-channel.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts), [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts), [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts)
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The typed-degree math, constitutional exclusion, log normalization, `SPECKIT_DEGREE_BOOST` gating, and mutation-only cache invalidation are real, but the snippet names `MAX_TYPED_DEGREE=15` as a cap even though the code uses `DEFAULT_MAX_TYPED_DEGREE` as a fallback. The live degree channel is wired in `hybrid-search.ts`, gated in `search-flags.ts`, and invalidated from `causal-edges.ts`; `graph-flags.ts` is not the degree-boost gate.
---
FEATURE: 02-co-activation-boost-strength-increase.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [co-activation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/co-activation.ts), [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts), [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Current code clearly sets the default boost to `0.25` and allows override via `SPECKIT_COACTIVATION_STRENGTH`, but I found no code-backed `0.25-0.3` range, no `0.1x` baseline, and no dark-run/A7 measurement flow. The listed file exists, but the active runtime imports/tests use the identical cache-scoped mirror under `lib/cache/cognitive/`, and actual score application happens in the search pipeline files above.
---
FEATURE: 03-edge-density-measurement.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [entity-linker.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts)
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The density formula is now `total_edges / total_memories`, and the entity-linking density guard uses that same global-density metric. The snippet is accurate, but the runtime guard behavior it mentions lives in `entity-linker.ts`, which is not listed.
---
FEATURE: 04-weight-history-audit-tracking.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts), [consolidation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts)
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `causal-edges.ts` does implement `created_by`, `last_accessed`, `weight_history`, auto-edge bounds, strength clamping, and `rollbackWeights()`. The missing pieces are important though: `vector-index-schema.ts` creates the table/columns, and `consolidation.ts` is the N3-lite consumer that relies on this audit/provenance data. Several listed search files are incidental, not core to this feature.
---
FEATURE: 05-graph-momentum-scoring.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts), [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts), [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts), [mutation-hooks.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts)
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: The core momentum logic is real: `current_degree - degree_7d_ago`, `degree_snapshots`, daily uniqueness, 7-day lookback, additive bonus capped at `+0.05`, and `SPECKIT_GRAPH_SIGNALS` gating. But the cache is a process-global `Map`, not truly request/session-scoped, and the claim that caches clear on edge mutations is only partially true: `clearGraphSignalsCache()` is wired via `mutation-hooks.ts`, while direct causal-edge handlers in `handlers/causal-graph.ts` do not invoke those hooks.
---
tokens used
160,021
---
FEATURE: 01-typed-weighted-degree-channel.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts), [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts), [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts)
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The typed-degree math, constitutional exclusion, log normalization, `SPECKIT_DEGREE_BOOST` gating, and mutation-only cache invalidation are real, but the snippet names `MAX_TYPED_DEGREE=15` as a cap even though the code uses `DEFAULT_MAX_TYPED_DEGREE` as a fallback. The live degree channel is wired in `hybrid-search.ts`, gated in `search-flags.ts`, and invalidated from `causal-edges.ts`; `graph-flags.ts` is not the degree-boost gate.
---
FEATURE: 02-co-activation-boost-strength-increase.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [co-activation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/co-activation.ts), [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts), [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Current code clearly sets the default boost to `0.25` and allows override via `SPECKIT_COACTIVATION_STRENGTH`, but I found no code-backed `0.25-0.3` range, no `0.1x` baseline, and no dark-run/A7 measurement flow. The listed file exists, but the active runtime imports/tests use the identical cache-scoped mirror under `lib/cache/cognitive/`, and actual score application happens in the search pipeline files above.
---
FEATURE: 03-edge-density-measurement.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [entity-linker.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts)
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The density formula is now `total_edges / total_memories`, and the entity-linking density guard uses that same global-density metric. The snippet is accurate, but the runtime guard behavior it mentions lives in `entity-linker.ts`, which is not listed.
---
FEATURE: 04-weight-history-audit-tracking.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts), [consolidation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts)
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `causal-edges.ts` does implement `created_by`, `last_accessed`, `weight_history`, auto-edge bounds, strength clamping, and `rollbackWeights()`. The missing pieces are important though: `vector-index-schema.ts` creates the table/columns, and `consolidation.ts` is the N3-lite consumer that relies on this audit/provenance data. Several listed search files are incidental, not core to this feature.
---
FEATURE: 05-graph-momentum-scoring.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts), [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts), [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts), [mutation-hooks.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts)
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: The core momentum logic is real: `current_degree - degree_7d_ago`, `degree_snapshots`, daily uniqueness, 7-day lookback, additive bonus capped at `+0.05`, and `SPECKIT_GRAPH_SIGNALS` gating. But the cache is a process-global `Map`, not truly request/session-scoped, and the claim that caches clear on edge mutations is only partially true: `clearGraphSignalsCache()` is wired via `mutation-hooks.ts`, while direct causal-edge handlers in `handlers/causal-graph.ts` do not invoke those hooks.
---
