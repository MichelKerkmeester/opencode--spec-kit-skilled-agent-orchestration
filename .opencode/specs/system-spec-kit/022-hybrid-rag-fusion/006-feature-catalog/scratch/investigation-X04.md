OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce98-ec85-74a2-8a41-8bef043d772f
--------
user
You are investigating undocumented features in an MCP server. Search for and read these source files under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/: search/cross-encoder.ts, search/hybrid-search.ts (or hybrid-search*), search/causal-boost.ts (or causal-boost*), search/artifact-routing.ts. Verify these gaps: Gap 14 (Provider-Based Neural Reranking), Gap 15 (Quality-Aware 3-Tier Fallback), Gap 16 (Causal Neighbor Boost + Injection), Gap 17 (Artifact-Class Retrieval Routing). 

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
I’ll investigate those MCP server files directly and map each requested gap (14–17) to concrete code evidence with line ranges. First I’m running the required routing/context gate checks, then I’ll read the target files and produce the structured gap-by-gap output plus any newly discovered capabilities.
exec
/bin/zsh -lc "python3 '.opencode/skill/scripts/skill_advisor.py' \"Investigate undocumented MCP server features in system-spec-kit search modules and verify gaps 14-17 with source evidence\" --threshold 0.8" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 635ms:
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
    "skill": "sk-code-opencode",
    "kind": "skill",
    "confidence": 0.93,
    "uncertainty": 0.31,
    "passes_threshold": true,
    "reason": "Matched: !mcp, !mcp(multi), !server(multi), check~, system"
  },
  {
    "skill": "mcp-clickup",
    "kind": "skill",
exec
/bin/zsh -lc "node '.opencode/skill/system-spec-kit/scripts/dist/memory/match-triggers.js' \"Investigate undocumented MCP server features in system-spec-kit search modules and verify gaps 14-17 with source evidence\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:
node:internal/modules/cjs/loader:1458
  throw err;
  ^

Error: Cannot find module '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/match-triggers.js'
    at Module._resolveFilename (node:internal/modules/cjs/loader:1455:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1065:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1070:22)
    at Module._load (node:internal/modules/cjs/loader:1241:25)
    at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
    at node:internal/main/run_main_module:33:47 {
  code: 'MODULE_NOT_FOUND',
  requireStack: []
}

Node.js v25.6.1
codex
I’ve completed the required skill routing: `system-spec-kit` was recommended with high confidence (0.95), so I’m loading that skill guidance now before inspecting the target source files. I also attempted a direct `memory_match_triggers` script invocation, but that script path does not exist in this workspace, so I’ll continue with explicit evidence-based code inspection.
exec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/SKILL.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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

codex
I’m now locating `undocumented-features-scan.md` and the exact target `search/*` implementation files so we can anchor each gap to precise line ranges. Next I’ll extract the relevant blocks with numbered lines for evidence.
exec
/bin/zsh -lc "rg --files '.opencode/skill/system-spec-kit/mcp_server/lib/search'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files | rg 'undocumented-features-scan\\.md"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/reranker.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/context-budget.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts
 succeeded in 52ms:
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md
codex
I found all target files, including exact `cross-encoder.ts`, `hybrid-search.ts`, `causal-boost.ts`, and `artifact-routing.ts`. Next I’m pulling the gap definitions from `undocumented-features-scan.md` and then mapping each one to code evidence.
exec
/bin/zsh -lc "nl -ba '.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "Gap 14|Gap 15|Gap 16|Gap 17|''^#|''^##|Category|SUGGESTED_CATEGORY|existing categories" '"'.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
 succeeded in 50ms:
1:# Undocumented Features Scan — MCP Server vs Feature Catalog
9:## Executive Summary
21:## High-Significance Gaps (17)
23:### Server & Operations
32:### Save Path & Mutation
42:### Discovery & Indexing
50:### Search & Retrieval
62:## Medium-Significance Gaps (25)
64:### Cognitive & Scoring
76:### Evaluation & Telemetry
88:### Infrastructure
99:### Storage & Parsing
111:## Low-Significance Gaps (13)
131:## Deduplication Notes
141:## Recommendations
codex
I’ve pulled the exact gap definitions for 14–17. I still need the list of the “20 existing categories” so I can assign each gap to a valid category name instead of guessing, and I’m locating that now.
exec
/bin/zsh -lc "rg --files '.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "''^##|''^#|''^'"\\d{2}-|Category|categories|feature catalog\" '.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/spec.md
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/plan.md
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/checklist.md
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C18.md
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C08.md
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C19.md
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/generate-source-files.mjs
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X04.md
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C16.md
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C06.md
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C12.md
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C02.md
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X10.md
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X01.md
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C13.md
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C03.md
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X05.md
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C17.md
 succeeded in 51ms:
Total output lines: 851

.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:1:# Decision Record: Feature Catalog Audit & Remediation
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:9:## ADR-001: 30-Agent Partitioning Strategy
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:11:### Metadata
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:21:### Context
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:25:### Constraints
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:33:### Decision
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:37:**How it works**: Stream 1 agents each cover 1-3 categories (5-12 snippet files) and verify descriptions + paths against source code. Stream 2 agents each cover a functional zone of the MCP server (4-6 source files) and verify specific gaps from the scan.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:41:### Alternatives Considered
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:53:### Consequences
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:71:### Five Checks Evaluation
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:85:### Implementation
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:95:## ADR-002: Gap Classification Methodology
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:97:### Metadata
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:107:### Context
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:111:### Constraints
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:119:### Decision
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:121:**We chose**: 3-tier significance (HIGH/MEDIUM/LOW) crossed with 6-action remediation categories, producing a prioritized manifest.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:123:**How it works**: Each finding gets a significance tier AND an action category. Action categories map to priorities: PATH-VALIDATE is P0, DESC-UPDATE/PATH-ADD/PATH-REMOVE/REWRITE is P1, NEW-FEATURE high-sig is P1, NEW-FEATURE med/low is P2, CATEGORY-MOVE is P2.
codex
I have the gap definitions and now I’m extracting the canonical list of existing 20 catalog categories from the feature catalog directory so each suggested category is valid and consistent.
exec
/bin/zsh -lc "find '.opencode/skill/system-spec-kit/feature_catalog' -maxdepth 1 -type d | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files '.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog
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
 succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/06-cross-document-entity-linking.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/09-contextual-tree-injection.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/04-lightweight-consolidation.md
codex
Next I’m reading the actual implementation files with line numbers and cross-checking them against current feature catalog snippets to determine whether each item is still an actual gap or now documented (false positive).
exec
/bin/zsh -lc "rg -n \"cross-encoder|rerank|reranker|Voyage|Cohere|provider-based|neural rerank\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"fallback|tier|degrad|all-channel|structural SQL|channel forcing\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"causal neighbor|injection|2-hop|artifact class|artifact routing|artifact-class|class routing\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
Total output lines: 240

.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md:67:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md:71:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/02-system-statistics-memorystats.md:95:| `mcp_server/lib/search/local-reranker.ts` | Lib | Local GGUF reranker |
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/02-system-statistics-memorystats.md:134:| `shared/algorithms/mmr-reranker.ts` | Shared | MMR reranking algorithm |
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/02-system-statistics-memorystats.md:143:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/02-system-statistics-memorystats.md:209:| `mcp_server/tests/local-reranker.vitest.ts` | Local reranker tests |
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/02-system-statistics-memorystats.md:219:| `mcp_server/tests/mmr-reranker.vitest.ts` | MMR reranker tests |
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/02-system-statistics-memorystats.md:232:| `mcp_server/tests/reranker.vitest.ts` | Reranker dispatch tests |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md:11:**Dead module-level state:** `stmtCache` Map (archival-manager.ts — never populated), `lastComputedAt` (community-detection.ts — set but never read), `activeProvider` cache (cross-encoder.ts — never populated), `flushCount` (access-tracker.ts — never incremented), 3 dead config fields in working-memory.ts (`decayInterval`, `attentionDecayRate`, `minAttentionScore`).
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:56:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md:95:| `mcp_server/lib/search/local-reranker.ts` | Lib | Local GGUF reranker |
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md:134:| `shared/algorithms/mmr-reranker.ts` | Shared | MMR reranking algorithm |
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md:143:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md:209:| `mcp_server/tests/local-reranker.vitest.ts` | Local reranker tests |
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md:219:| `mcp_server/tests/mmr-reranker.vitest.ts` | MMR reranker tests |
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md:232:| `mcp_server/tests/reranker.vitest.ts` | Reranker dispatch tests |
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md:62:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md:93:| `mcp_server/lib/search/local-reranker.ts` | Lib | Local GGUF reranker |
 succeeded in 51ms:
Total output lines: 308

.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md:122:| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md:126:| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:103:| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md:9:Checkpoints are the safety net for destructive operations. `memory_bulk_delete` creates one by default before bulk deletion, unless explicitly skipped for lower-risk tiers. `checkpoint_restore` brings it all back. The cycle works because checkpoints include vector embeddings alongside metadata, so restored memories are immediately searchable without re-running embedding generation.
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md:125:| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md:5:The archival manager (`lib/cognitive/archival-manager.ts`) is a background job that identifies dormant memories and transitions them to archived status. It queries `memory_index` for memories that have not been accessed within a configurable threshold period, demotes their tier classification, and optionally removes their BM25 index entries and vector embeddings to reclaim storage. Archived memories remain in the database for SQL-based recovery but are excluded from default search result sets.
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md:7:The archival sweep runs periodically and respects tier-based protection: constitutional and critical-tier memories are never auto-archived. Access tracker data (`access_count`, `last_access_at`) drives the dormancy decision. The archival manager lazy-loads the tier classifier to avoid circular dependencies at import time.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:20:  - [Quality-aware 3-tier search fallback](#quality-aware-3-tier-search-fallback)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:25:  - [Tier-based bulk deletion (memory_bulk_delete)](#tier-based-bulk-deletion-memory_bulk_delete)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:102:  - [Stage 3 effectiveScore fallback chain](#stage-3-effectivescore-fallback-chain)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:153:  - [Tier-2 fallback channel forcing](#tier-2-fallback-channel-forcing)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:217:Retrieval telemetry records mode selection and pressure-override fallbacks for observability when extended telemetry is enabled.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:232:The parameter surface is wide. You control result count (`limit`, 1-100), spec folder scoping, tier and context type filtering, intent (explicit or auto-detected), reranking toggle, length penalty, temporal decay, minimum memory state (`minState`, default `"WARM"`, range HOT through ARCHIVED), constitutional inclusion, content inclusion, anchor filtering, session dedup, session boosting, causal boosting, minimum quality threshold, cache bypass and access tracking. Most defaults are sensible. You typically send a query and a session ID and let everything else run at defaults.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:243:Where this tool gets interesting is the cognitive pipeline. When you provide a session ID with `include_cognitive=true`, the system applies FSRS-based attention decay (scores degrade each turn via `0.98^(turn-1)` exponential decay), memory activation (matched memories get their attention score set to 1.0), co-activation spreading (each activated memory spreads activation to related memories through the co-occurrence graph), tier classification (maps effective retrievability to HOT, WARM, COLD, DORMANT or ARCHIVED) and tiered content injection.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:245:Tiered content injection is the most visible effect. HOT memories return their full file content read from disk. WARM memories return the first 150 characters as a summary. COLD memories and below return no content at all. This tiering means recently active and highly relevant memories arrive with full context while dormant ones arrive as lightweight pointers.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:256:The engine under the hood. `hybrid-search.ts` orchestrates multi-channel retrieval with five search channels, adaptive fusion, diversity reranking and a multi-tier fallback chain. This pipeline provides the candidate generation and fusion components used by Stage 1 of the 4-stage pipeline (the sole runtime path since the legacy V1 path was removed in Phase 017).
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:262:Five operational stages run between fusion and delivery. Stage A (query complexity routing, `SPECKIT_COMPLEXITY_ROUTER`) restricts active channels for simple queries to just vector and FTS, moderate queries add BM25, and complex queries get all five. Stage B (RSF shadow fusion, `SPECKIT_RSF_FUSION`) is historical and no longer active in runtime ranking; RSF artifacts are retained for compatibility/testing references only. Stage C (channel enforcement, `SPECKIT_CHANNEL_MIN_REP`) ensures every contributing channel has at least one result in top-k with a 0.005 quality floor. Stage D (confidence truncation, `SPECKIT_CONFIDENCE_TRUNCATION`) trims the irrelevant tail using a 2x-median gap elbow heuristic. Stage E (dynamic token budget, `SPECKIT_DYNAMIC_TOKEN_BUDGET`) computes tier-aware token limits (simple 1,500, moderate 2,500, complex 4,000).
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:266:The fallback chain (`searchWithFallback()`) provides resilience. When `SPECKIT_SEARCH_FALLBACK` is enabled, the default path is a three-tier degradation flow: Tier 1 primary retrieval (default minimum similarity 0.3), Tier 2 widened retrieval at 0.1 with all channels forced on, and Tier 3 structural SQL search as last resort. When `SPECKIT_SEARCH_FALLBACK` is disabled, the legacy two-pass path is used (0.3 then 0.17). The system is designed to avoid empty returns except on hard failures.
 succeeded in 51ms:
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md:7:The framework uses dependency injection for the search function, making it testable without the full pipeline. Statistical significance is assessed via a sign test using log-space binomial coefficient computation (preventing overflow for n>50, fixed in Sprint 8). Verdict classification ranges from CRITICAL (channel removal causes significant regression) through negligible to HARMFUL (channel removal actually improves results). Results are stored in `eval_metric_snapshots` with negative timestamp IDs to distinguish ablation runs from production evaluation data. Runs behind the `SPECKIT_ABLATION` flag.
.opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:86:| `mcp_server/lib/search/retrieval-directives.ts` | Lib | Constitutional retrieval injection |
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:148:  - [Constitutional memory as expert knowledge injection](#constitutional-memory-as-expert-knowledge-injection)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:155:  - [Contextual tree injection](#contextual-tree-injection)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:228:The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:243:Where this tool gets interesting is the cognitive pipeline. When you provide a session ID with `include_cognitive=true`, the system applies FSRS-based attention decay (scores degrade each turn via `0.98^(turn-1)` exponential decay), memory activation (matched memories get their attention score set to 1.0), co-activation spreading (each activated memory spreads activation to related memories through the co-occurrence graph), tier classification (maps effective retrievability to HOT, WARM, COLD, DORMANT or ARCHIVED) and tiered content injection.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:245:Tiered content injection is the most visible effect. HOT memories return their full file content read from disk. WARM memories return the first 150 characters as a summary. COLD memories and below return no content at all. This tiering means recently active and highly relevant memories arrive with full context while dormant ones arrive as lightweight pointers.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:277:Stage 1 (Candidate Generation) executes search channels based on query type. Multi-concept queries generate one embedding per concept. Deep mode expands into up to 3 query variants via `expandQuery()`. When embedding expansion is active and R15 does not classify the query as "simple", a baseline and expanded-query search run in parallel with deduplication. Constitutional memory injection appends up to 5 constitutional rows when none appear in the initial candidate set. Quality score and tier filters run at the end of Stage 1.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:279:Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. The current runtime order is: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a momentum + N2b depth), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:678:The framework uses dependency injection for the search function, making it testable without the full pipeline. Each channel ablation wraps in a try-catch so a failure in one channel's ablation produces partial results rather than a total failure. Statistical significance is assessed via a sign test (exact binomial distribution) because it is reliable with small query sets where a t-test would be unreliable. Verdict classification ranges from CRITICAL (channel removal causes significant regression) through negligible to HARMFUL (channel removal actually improves results).
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:945:The framework uses dependency injection for the search function, making it testable without the full pipeline. Statistical significance is assessed via a sign test using log-space binomial coefficient computation (preventing overflow for n>50, fixed in Sprint 8). Verdict classification ranges from CRITICAL (channel removal causes significant regression) through negligible to HARMFUL (channel removal actually improves results). Results are stored in `eval_metric_snapshots` with negative timestamp IDs to distinguish ablation runs from production evaluation data. Runs behind the `SPECKIT_ABLATION` flag.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1112:The Stage 2 `applyCommunityBoost()` step injects up to 3 community co-members (0.3x the source score) using whatever assignments already exist in `community_assignments`. Community injection runs at Stage 2 position 2b (between causal boost and graph signals) so injected rows also receive N2a+N2b momentum/depth adjustments. Runs behind the `SPECKIT_COMMUNITY_DETECTION` flag (default ON).
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1605:Stage 1 (Candidate Generation) executes search channels based on query type: multi-concept, deep mode with query expansion, embedding expansion with R15 mutual exclusion, or standard hybrid search. The R8 memory summary channel runs in parallel when the scale gate is met (>5K memories), merging and deduplicating results by memory ID. Summary candidates now pass through the same `minQualityScore` filter as other candidates (Sprint 8 fix). Constitutional memory injection and quality/tier filtering run at the end of Stage 1.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1607:**Phase 017 update:** The query embedding is now cached at function scope for reuse in the constitutional injection path, saving one API call per search. The constitutional injection count is tracked and passed through the orchestrator to Stage 4 output metadata (previously hardcoded to 0).
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1609:Stage 2 (Fusion and Signal Integration) applies all scoring signals in a fixed order: session boost, causal boost, co-activation spreading (2a), community co-retrieval from precomputed `community_assignments` (N2c, 2b), graph signals (N2a+N2b  -- additive momentum and depth bonuses, 2c), FSRS testing effect, intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection runs before graph signals so injected rows can also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1741:- **Constitutional count passthrough (#15):** Stage 1's constitutional injection count flows through the orchestrator to Stage 4 output metadata.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1742:- **Embedding caching (#16):** Stage 1 caches the query embedding at function scope for reuse in the constitutional injection path, saving one API call per search.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1834:### Constitutional memory as expert knowledge injection
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1843:See [`15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md`](15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md) for full implementation and test file listings.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1929:### Contextual tree injection
exec
/bin/zsh -lc "rg -n \"artifact routing|artifact-class|artifact class|artifact-aware|artifact result limiting|artifact bucket\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:228:The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:279:Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. The current runtime order is: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a momentum + N2b depth), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1609:Stage 2 (Fusion and Signal Integration) applies all scoring signals in a fixed order: session boost, causal boost, co-activation spreading (2a), community co-retrieval from precomputed `community_assignments` (N2c, 2b), graph signals (N2a+N2b  -- additive momentum and depth bonuses, 2c), FSRS testing effect, intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection runs before graph signals so injected rows can also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:9:Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. The current runtime order is: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a momentum + N2b depth), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:7:The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a+N2b), FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:11:Stage 2 (Fusion and Signal Integration) applies scoring/enrichment in a fixed order: session boost, causal boost, co-activation spreading, community co-retrieval (N2c from precomputed `community_assignments`), graph signals (N2a+N2b — additive momentum/depth bonuses), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection (N2c) runs before graph signals (N2a+N2b) so injected rows also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md:16:In the non-hybrid flow, after Step 4 applies `intentAdjustedScore`, subsequent pipeline steps (artifact routing, feedback signals) write to the `score` field. Since `resolveEffectiveScore()` prefers `intentAdjustedScore` over `score`, later modifications were invisible in final ranking. A synchronization pass now updates `intentAdjustedScore` from the post-signal `score` using `Math.max(intentAdjustedScore, score)` to preserve the higher value while ensuring all pipeline signal contributions are reflected in the final ranking.
exec
/bin/zsh -lc "wc -l '.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "wc -l '.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "wc -l '.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "wc -l '.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     542 .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
 succeeded in 52ms:
    1706 .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
 succeeded in 51ms:
     364 .opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts
 succeeded in 51ms:
     302 .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts
codex
I confirmed file sizes and will now extract just the relevant sections with line numbers (not full files) for each gap: reranker providers/fallbacks, hybrid fallback tiers, causal neighbor traversal/injection, and artifact-class routing policies.
exec
/bin/zsh -lc "rg -n \"provider|voyage|cohere|local|cache|latency|penalty|circuit|rerank|fallback|three-tier|tier|degrad\" '.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"searchWithFallback|fallback|tier|degrad|all channels|structural|checkDegradation|minSimilarity|min quality|record\" '.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"causal|neighbor|hop|inject|absent|seed|top|boost|graph|edge|limit\" '.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"artifact|class|weight|recency|boost|max|routing|policy|limit|bucket\" '.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
5:// Neural reranking via external APIs (Voyage rerank-2, Cohere
6:// rerank-english-v3.0) or a local cross-encoder model
7:// (ms-marco-MiniLM-L-6-v2). When no provider is configured the
8:// module returns a positional fallback (scored 0–0.5) and marks
9:// results with scoringMethod:'fallback' so callers can distinguish
14://   providers invoke real ML-based reranking — either cloud APIs
15://   that run neural rerankers server-side (Voyage, Cohere) or a
16://   local cross-encoder model.  The positional fallback is NOT a
37:  voyage: {
38:    name: 'voyage',
39:    model: 'rerank-2',
40:    endpoint: 'https://api.voyageai.com/v1/rerank',
45:  cohere: {
46:    name: 'cohere',
47:    model: 'rerank-english-v3.0',
48:    endpoint: 'https://api.cohere.ai/v1/rerank',
53:  local: {
54:    name: 'local',
56:    endpoint: 'http://localhost:8765/rerank',
90:  rerankerScore: number;
 succeeded in 52ms:
4:// Graph-traversal score boosting via causal edge relationships.
5:// Walks the causal_edges graph up to MAX_HOPS, amplifying scores
6:// for results related to top seed results via weighted CTE.
13:/** Maximum graph traversal depth. Beyond 2 hops, signal degrades and queries become expensive. */
15:/** Per-hop boost cap. 0.05 keeps causal nudge subtle relative to semantic scores (~0.5–1.0). */
17:/** Combined causal + session boost ceiling to prevent runaway amplification. */
19:/** Top fraction of result set used as graph walk seed nodes. */
21:/** Absolute cap on seed nodes regardless of result set size. */
25: * C138-P2: Relation-type weight multipliers for causal edge traversal.
27: * amplify the boost while weaker ones (contradicts) attenuate it.
49:  boostedCount: number;
50:  injectedCount: number;
57:/** Check whether the causal boost feature flag is enabled. */
62:/** Store the database reference used by causal edge traversal queries. */
80: * and dropping non-finite values to guard against DB query injection.
93: * Compute the hop-distance decay boost: MAX_BOOST_PER_HOP / hopDistance,
94: * capped at MAX_BOOST_PER_HOP so closer neighbors get the full signal.
96:function computeBoostByHop(hopDistance: number): number {
97:  if (!Number.isFinite(hopDistance) || hopDistance <= 0) return 0;
98:  const rawBoost = MAX_BOOST_PER_HOP / hopDistance;
 succeeded in 52ms:
4:// AI-WHY: Combines vector, FTS, and BM25 search with fallback
64:  minSimilarity?: number;
76:   * Internal fallback override: when true, bypass complexity routing and
122:  routing?: { tier: string; channels: string[]; skippedChannels: string[] };
130:  tokenBudget?: { tier: string; budget: number; applied: boolean };
135:/** Fallback tier in the 3-tier degradation chain. */
138:/** Why degradation was triggered at a given tier. */
146:/** Record of a single degradation event during tiered fallback. */
148:  tier: FallbackTier;
155: * Absolute quality floor for degradation checks.
158: * high fixed threshold causes false degradations. Use a conservative floor and
166:/** Minimum result count: must have >= this many results to stay at current tier. */
230: * @param graphFn - Optional graph search function for causal/structural retrieval.
396: * @deprecated Use hybridSearchEnhanced() or searchWithFallback() instead. This function uses naive per-source
398: * Retained as internal fallback only.
408:    minSimilarity = 0,
424:        minSimilarity,
541:    // subset (e.g., simple queries skip graph+degree). When disabled, all channels run.
560:        tier: routeResult.tier,
567:    // Compute tier-aware budget early so it's available for downstream truncation.
 succeeded in 51ms:
4:// Splits retrieval strategy by artifact class for class-specific
24:  artifactClass: ArtifactClass;
30:  recencyBias: number;
32:  maxResults: number;
34:  boostFactor: number;
47:  artifactBoostApplied?: number;
56:    artifactClass: 'spec',
59:    recencyBias: 0.2,
60:    maxResults: 5,
61:    boostFactor: 1.0,
64:    artifactClass: 'plan',
67:    recencyBias: 0.3,
68:    maxResults: 5,
69:    boostFactor: 1.0,
72:    artifactClass: 'tasks',
75:    recencyBias: 0.5,
76:    maxResults: 10,
77:    boostFactor: 0.9,
80:    artifactClass: 'checklist',
83:    recencyBias: 0.4,
exec
/bin/zsh -lc "sed -n '1,260p' '.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X02.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts' | sed -n '261,542p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts' | sed -n '120,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts' | sed -n '1020,1505p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
 succeeded in 52ms:
   120	interface Sprint3PipelineMeta {
   121	  /** Query complexity routing result (SPECKIT_COMPLEXITY_ROUTER). */
   122	  routing?: { tier: string; channels: string[]; skippedChannels: string[] };
   123	  /** RSF shadow fusion result (SPECKIT_RSF_FUSION) — shadow-mode only, not used for ranking. */
   124	  rsfShadow?: { resultCount: number; topRsfScore: number };
   125	  /** Channel enforcement result (SPECKIT_CHANNEL_MIN_REP). */
   126	  enforcement?: { applied: boolean; promotedCount: number; underRepresentedChannels: string[] };
   127	  /** Confidence truncation result (SPECKIT_CONFIDENCE_TRUNCATION). */
   128	  truncation?: { truncated: boolean; originalCount: number; truncatedCount: number };
   129	  /** Dynamic token budget result (SPECKIT_DYNAMIC_TOKEN_BUDGET). */
   130	  tokenBudget?: { tier: string; budget: number; applied: boolean };
   131	}
   132	
   133	/* --- 4. PI-A2: DEGRADATION TYPES --- */
   134	
   135	/** Fallback tier in the 3-tier degradation chain. */
   136	type FallbackTier = 1 | 2 | 3;
   137	
   138	/** Why degradation was triggered at a given tier. */
   139	interface DegradationTrigger {
 succeeded in 52ms:
   261	
   262	  const data = await response.json() as { data: RerankApiResult[] };
   263	
   264	  return data.data.map((item: RerankApiResult) => ({
   265	    ...documents[item.index],
   266	    rerankerScore: item.relevance_score,
   267	    score: item.relevance_score,
   268	    originalRank: inputRankMap.get(documents[item.index].id) ?? item.index,
   269	    provider: 'voyage',
   270	    scoringMethod: 'cross-encoder' as const,
   271	  })).sort((a: RerankResult, b: RerankResult) => b.rerankerScore - a.rerankerScore);
   272	}
   273	
   274	async function rerankCohere(
   275	  query: string,
   276	  documents: RerankDocument[]
   277	): Promise<RerankResult[]> {
   278	  const config = PROVIDER_CONFIG.cohere;
   279	  const apiKey = process.env[config.apiKeyEnv];
   280	  if (!apiKey) throw new Error('COHERE_API_KEY not set');
 succeeded in 52ms:
  1020	  }
  1021	
  1022	  return hybridSearch(query, embedding, options);
  1023	}
  1024	
  1025	/**
  1026	 * Search with automatic fallback chain.
  1027	 * When SPECKIT_SEARCH_FALLBACK=true: delegates to the 3-tier quality-aware
  1028	 * fallback (searchWithFallbackTiered). Otherwise: C138-P0 two-pass adaptive
  1029	 * fallback — primary at minSimilarity=0.3, retry at 0.17.
  1030	 *
  1031	 * @param query - The search query string.
  1032	 * @param embedding - Optional embedding vector for semantic search.
  1033	 * @param options - Hybrid search configuration options.
  1034	 * @returns Results from the first non-empty stage.
  1035	 */
  1036	async function searchWithFallback(
  1037	  query: string,
  1038	  embedding: Float32Array | number[] | null,
  1039	  options: HybridSearchOptions = {}
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts' | sed -n '1,302p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts' | sed -n '1,364p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Causal Boost
     3	// ---------------------------------------------------------------
     4	// Graph-traversal score boosting via causal edge relationships.
     5	// Walks the causal_edges graph up to MAX_HOPS, amplifying scores
     6	// for results related to top seed results via weighted CTE.
     7	// ---------------------------------------------------------------
     8	
     9	import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';
    10	
    11	import type Database from 'better-sqlite3';
    12	
    13	/** Maximum graph traversal depth. Beyond 2 hops, signal degrades and queries become expensive. */
    14	const MAX_HOPS = 2;
    15	/** Per-hop boost cap. 0.05 keeps causal nudge subtle relative to semantic scores (~0.5–1.0). */
    16	const MAX_BOOST_PER_HOP = 0.05;
    17	/** Combined causal + session boost ceiling to prevent runaway amplification. */
    18	const MAX_COMBINED_BOOST = 0.20;
    19	/** Top fraction of result set used as graph walk seed nodes. */
    20	const SEED_FRACTION = 0.25;
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Artifact Routing
     3	// ---------------------------------------------------------------
     4	// Splits retrieval strategy by artifact class for class-specific
     5	// retrieval policies with deterministic branch behavior.
     6	// ---------------------------------------------------------------
     7	
     8	/* -----------------------------------------------------------
     9	   1. TYPES
    10	----------------------------------------------------------------*/
    11	
    12	type ArtifactClass =
    13	  | 'spec'
    14	  | 'plan'
    15	  | 'tasks'
    16	  | 'checklist'
    17	  | 'decision-record'
    18	  | 'implementation-summary'
    19	  | 'memory'
    20	  | 'research'
codex
I’ve extracted the implementation evidence with exact line numbers. I’m now cross-checking whether these behaviors already have dedicated feature catalog coverage to determine whether each is still a real gap or now a false positive.
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md' | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/10-causal-neighbor-boost-and-injection.md' | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"artifact-routing\\.ts|artifact routing|artifact-class|artifact class\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"cross-encoder\\.ts|Voyage|Cohere|RERANKER_LOCAL|length penalty|reranker provider|provider\" '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration' '.opencode/skill/system-spec-kit/feature_catalog/01--retrieval' '.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	# Causal neighbor boost and injection
     2	
     3	## Current Reality
     4	
     5	After Stage 2 fusion produces a ranked result set, the causal boost module walks the `causal_edges` graph to amplify scores for memories related to top-ranked seed results. Up to 25% of the result set (capped at 5) serves as seed nodes. The graph walk traverses up to 2 hops via a weighted recursive CTE, applying a per-hop boost capped at 0.05. Relation-type weight multipliers (supersedes > leads_to > relates_to) scale the boost so stronger causal relationships receive proportionally more amplification.
     6	
     7	The combined causal + session boost ceiling is 0.20, preventing runaway score inflation from graph-dense clusters. The feature is gated by `SPECKIT_CAUSAL_BOOST` (default `true`). When disabled, results pass through without graph-based score adjustment.
     8	
     9	## Source Files
    10	
    11	### Implementation
    12	
    13	| File | Layer | Role |
    14	|------|-------|------|
    15	| `mcp_server/lib/search/causal-boost.ts` | Lib | Causal neighbor graph walk and boost application |
    16	| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Stage 2 fusion invoking causal boost |
    17	| `mcp_server/lib/search/pipeline/types.ts` | Lib | Pipeline type definitions |
    18	| `mcp_server/lib/search/session-boost.ts` | Lib | Session boost (shared ceiling with causal) |
    19	
    20	### Tests
 succeeded in 51ms:
     1	# Quality-aware 3-tier search fallback
     2	
     3	## Current Reality
     4	
     5	Adaptive search degradation chain in `searchWithFallbackTiered()`. Tier 1: enhanced hybrid search (minSimilarity=0.3, standard channels). Quality check via `checkDegradation()`: fails if topScore < 0.02 AND relativeGap < 0.2, OR resultCount < 3. On fail, Tier 2: widened search (minSimilarity=0.1, all channels forced). Same quality check. On fail, Tier 3: structural SQL fallback (ORDER BY importance_tier, importance_weight). Tier 3 scores are calibrated to max 50% of existing top score to prevent outranking semantic hits. Degradation events are attached as non-enumerable `_degradation` property on the result set. Gated by `SPECKIT_SEARCH_FALLBACK` (default: true, graduated).
     6	
     7	## Source Files
     8	
     9	### Implementation
    10	
    11	| File | Layer | Role |
    12	|------|-------|------|
    13	| `mcp_server/lib/search/hybrid-search.ts` | Lib | Multi-channel search orchestration with tiered fallback |
    14	| `mcp_server/lib/search/pipeline/stage4-filter.ts` | Lib | Stage 4 filtering and quality check |
    15	
    16	### Tests
    17	
    18	| File | Focus |
    19	|------|-------|
    20	| `mcp_server/tests/hybrid-search.vitest.ts` | Hybrid search orchestration |
 succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:11:Stage 2 (Fusion and Signal Integration) applies scoring/enrichment in a fixed order: session boost, causal boost, co-activation spreading, community co-retrieval (N2c from precomputed `community_assignments`), graph signals (N2a+N2b — additive momentum/depth bonuses), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection (N2c) runs before graph signals (N2a+N2b) so injected rows also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md:114:| `mcp_server/lib/search/artifact-routing.ts` | Lib | Artifact type routing |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md:113:| `mcp_server/lib/search/artifact-routing.ts` | Lib | Artifact type routing |
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md:106:| `mcp_server/lib/search/artifact-routing.ts` | Lib | Artifact type routing |
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:228:The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:279:Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. The current runtime order is: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a momentum + N2b depth), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1609:Stage 2 (Fusion and Signal Integration) applies all scoring signals in a fixed order: session boost, causal boost, co-activation spreading (2a), community co-retrieval from precomputed `community_assignments` (N2c, 2b), graph signals (N2a+N2b  -- additive momentum and depth bonuses, 2c), FSRS testing effect, intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection runs before graph signals so injected rows can also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md:16:In the non-hybrid flow, after Step 4 applies `intentAdjustedScore`, subsequent pipeline steps (artifact routing, feedback signals) write to the `score` field. Since `resolveEffectiveScore()` prefers `intentAdjustedScore` over `score`, later modifications were invisible in final ranking. A synchronization pass now updates `intentAdjustedScore` from the post-signal `score` using `Math.max(intentAdjustedScore, score)` to preserve the higher value while ensuring all pipeline signal contributions are reflected in the final ranking.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/08-context-server-success-hint-append.md:113:| `mcp_server/lib/search/artifact-routing.ts` | Lib | Artifact type routing |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:9:Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. The current runtime order is: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a momentum + N2b depth), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:7:The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a+N2b), FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:53:| `mcp_server/lib/search/artifact-routing.ts` | Lib | Artifact type routing |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:65:| `mcp_server/lib/search/artifact-routing.ts` | Lib | Artifact type routing |
 succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:37:| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding provider dispatch |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:48:| `mcp_server/lib/search/cross-encoder.ts` | Lib | Cross-encoder reranking |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:104:| `shared/embeddings/factory.ts` | Shared | Embedding provider factory |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:106:| `shared/embeddings/providers/hf-local.ts` | Shared | HuggingFace local provider |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:107:| `shared/embeddings/providers/openai.ts` | Shared | OpenAI embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:108:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:139:| `mcp_server/tests/embeddings.vitest.ts` | Embedding provider tests |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:31:| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding provider dispatch |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:42:| `mcp_server/lib/search/cross-encoder.ts` | Lib | Cross-encoder reranking |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:98:| `shared/embeddings/factory.ts` | Shared | Embedding provider factory |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:100:| `shared/embeddings/providers/hf-local.ts` | Shared | HuggingFace local provider |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:101:| `shared/embeddings/providers/openai.ts` | Shared | OpenAI embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:102:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:133:| `mcp_server/tests/embeddings.vitest.ts` | Embedding provider tests |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:11:The parameter surface is wide. You control result count (`limit`, 1-100), spec folder scoping, tier and context type filtering, intent (explicit or auto-detected), reranking toggle, length penalty, temporal decay, minimum memory state (`minState`, default `"WARM"`, range HOT through ARCHIVED), constitutional inclusion, content inclusion, anchor filtering, session dedup, session boosting, causal boosting, minimum quality threshold, cache bypass and access tracking. Most defaults are sensible. You typically send a query and a session ID and let everything else run at defaults.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:45:| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding provider dispatch |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:59:| `mcp_server/lib/search/cross-encoder.ts` | Lib | Cross-encoder reranking |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:118:| `shared/embeddings/factory.ts` | Shared | Embedding provider factory |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:120:| `shared/embeddings/providers/hf-local.ts` | Shared | HuggingFace local provider |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:121:| `shared/embeddings/providers/openai.ts` | Shared | OpenAI embedding provider |
exec
/bin/zsh -lc "rg --files '.opencode/skill/system-spec-kit/feature_catalog' | rg -i 'artifact|routing'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:

exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/09-contextual-tree-injection.md' | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
     1	# Contextual tree injection
     2	
     3	## Current Reality
     4	
     5	**IMPLEMENTED (Sprint 019).** Returned chunks are prefixed with hierarchical context headers in the format `[parent > child — description]` (max 100 chars), using existing PI-B3 cached spec folder descriptions. Gated by `SPECKIT_CONTEXT_HEADERS` (default `true`) and injected after Stage 4 token-budget truncation.
     6	
     7	## Source Files
     8	
     9	### Implementation
    10	
    11	| File | Layer | Role |
    12	|------|-------|------|
    13	| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
    14	| `mcp_server/core/config.ts` | Core | Server configuration |
    15	| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
    16	| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |
    17	| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
    18	| `mcp_server/lib/errors/core.ts` | Lib | Error type definitions |
    19	| `mcp_server/lib/errors/recovery-hints.ts` | Lib | Error recovery hints |
    20	| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
exec
/bin/zsh -lc "rg -n \"Provider-Based Neural Reranking|neural reranking|cross-encoder reranking|Voyage/Cohere|Voyage|Cohere|length penalty\" '.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md' '.opencode/skill/system-spec-kit/feature_catalog/01--retrieval' '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:228:The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:232:The parameter surface is wide. You control result count (`limit`, 1-100), spec folder scoping, tier and context type filtering, intent (explicit or auto-detected), reranking toggle, length penalty, temporal decay, minimum memory state (`minState`, default `"WARM"`, range HOT through ARCHIVED), constitutional inclusion, content inclusion, anchor filtering, session dedup, session boosting, causal boosting, minimum quality threshold, cache bypass and access tracking. Most defaults are sensible. You typically send a query and a session ID and let everything else run at defaults.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:281:Stage 3 (Rerank and Aggregate) handles cross-encoder reranking (optional, gated by `SPECKIT_CROSS_ENCODER`) and MPAB chunk collapse with parent reassembly. Chunks are grouped by parent ID, the best chunk per group is elected by score, and full parent content is loaded from the database. On DB failure, the best-chunk row is emitted as a fallback. Non-chunks and reassembled parents merge and sort descending by effective score.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1321:**IMPLEMENTED (Sprint 019).** *(Overlap note: implements the previously unimplemented `RERANKER_LOCAL` flag while `SPECKIT_CROSS_ENCODER` remains the existing default-on rerank control.)* Stage 3 reranking currently supports Cohere and Voyage remote APIs. This feature adds a Node-native GGUF execution path via `node-llama-cpp` in `lib/search/local-reranker.ts`, integrating into the existing Stage 3 reranking slot. `node-llama-cpp` is declared as an `optionalDependency` to avoid blocking installs on platforms without native build support.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1613:Stage 3 (Rerank and Aggregate) handles optional cross-encoder reranking (gated by `SPECKIT_CROSS_ENCODER`) and MPAB chunk collapse with parent reassembly preserving document order.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:2334:| `SPECKIT_CROSS_ENCODER` | `true` | boolean | `lib/search/search-flags.ts` | Enables cross-encoder reranking in Stage 3 of the 4-stage pipeline. When enabled, the reranker rescores candidates using a more expensive cross-attention model. Disabling falls back to vector-only ranking from fusion. |
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:2454:| `COHERE_API_KEY` | _(none)_ | string | `tests/search-limits-scoring.vitest.ts` | API key for the Cohere reranker provider. When present, the cross-encoder reranker uses Cohere's rerank API. Falls back to local or Voyage reranker when absent. |
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:2456:| `EMBEDDINGS_PROVIDER` | `'auto'` | string | `lib/providers/embeddings.ts` | Selects the embedding provider. Valid values include `'auto'`, `'openai'`, `'hf-local'`, and `'voyage'`. In `'auto'` mode, the system selects based on available API keys (Voyage preferred over OpenAI, local fallback). |
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:2459:| `VOYAGE_API_KEY` | _(none)_ | string | `tests/embeddings.vitest.ts` | API key for the Voyage AI embeddings and reranker provider. In `'auto'` mode, Voyage is preferred over OpenAI when this key is present. |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:11:Stage 3 (Rerank and Aggregate) handles cross-encoder reranking (optional, gated by `SPECKIT_CROSS_ENCODER`) and MPAB chunk collapse with parent reassembly. Chunks are grouped by parent ID, the best chunk per group is elected by score, and full parent content is loaded from the database. On DB failure, the best-chunk row is emitted as a fallback. Non-chunks and reassembled parents merge and sort descending by effective score.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:108:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:7:The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a+N2b), FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:11:The parameter surface is wide. You control result count (`limit`, 1-100), spec folder scoping, tier and context type filtering, intent (explicit or auto-detected), reranking toggle, length penalty, temporal decay, minimum memory state (`minState`, default `"WARM"`, range HOT through ARCHIVED), constitutional inclusion, content inclusion, anchor filtering, session dedup, session boosting, causal boosting, minimum quality threshold, cache bypass and access tracking. Most defaults are sensible. You typically send a query and a session ID and let everything else run at defaults.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:122:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md:53:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md:60:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md:81:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md:81:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:138:| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
codex
I found dedicated catalog entries for gaps 15 and 16, so those look resolved rather than currently undocumented. I’m now finalizing the gap statuses and checking for additional undocumented behaviors in these files (especially around artifact routing and fallback metadata).
exec
/bin/zsh -lc "rg -n \"artifact|applyRoutingWeights|getStrategyForQuery|artifact routing|maxResults\" '.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:

exec
/bin/zsh -lc "rg -n \"_degradation|Object\\.defineProperty|calibrateTier3Scores|canonicalResultId|mergeResults\" '.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
372:  // canonicalResultId() prevents duplicate rows when one channel emits
377:    merged.set(canonicalResultId(r.id), r);
381:    const canonicalId = canonicalResultId(r.id);
507:    const canonicalId = canonicalResultId(r.id);
703:          const key = canonicalResultId(r.id);
955:      const degradationMeta = (reranked as unknown as Record<string, unknown>)['_degradation'];
968:        Object.defineProperty(reranked, '_s4shadow', {
976:        Object.defineProperty(reranked, '_s4attribution', {
1012:        Object.defineProperty(reranked, '_s3meta', { value: s3meta, enumerable: false, configurable: true });
1155:function canonicalResultId(id: number | string): string {
1302:function calibrateTier3Scores(
1366:function mergeResults(
1373:    byId.set(canonicalResultId(r.id), r);
1376:    const key = canonicalResultId(r.id);
1403: * @returns Results with _degradation metadata attached as non-enumerable property.
1420:    Object.defineProperty(limitedTier1, '_degradation', {
1443:  results = mergeResults(results, tier2Results);
1454:    Object.defineProperty(limitedTier2, '_degradation', {
1468:  const calibratedTier3 = calibrateTier3Scores(results, tier3Results);
1469:  results = mergeResults(results, calibratedTier3);
exec
/bin/zsh -lc "rg -n \"artifact-routing|getStrategyForQuery|applyRoutingWeights|artifact result limiting|artifact\" '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts' '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts' '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:106: * Uses quality metadata extracted from spec artifacts to apply a bounded
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:275: * Apply artifact routing weight boosts to results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:277: * When the routing system detected a known artifact class with non-zero
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:310:      artifactBoostApplied: boostFactor,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:489:    artifactRoutingApplied: false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:633:  if (config.artifactRouting && config.artifactRouting.confidence > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:635:      const routed = applyArtifactRouting(results, config.artifactRouting);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:637:      metadata.artifactRoutingApplied = true;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:640:      console.warn(`[stage2-fusion] artifact routing failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:663:    config.artifactRouting &&
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:664:    config.artifactRouting.confidence > 0 &&
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:665:    typeof config.artifactRouting.strategy?.maxResults === 'number' &&
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:666:    config.artifactRouting.strategy.maxResults > 0 &&
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:667:    results.length > config.artifactRouting.strategy.maxResults
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:669:    results = results.slice(0, config.artifactRouting.strategy.maxResults);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:714:        artifactRoutingApplied: metadata.artifactRoutingApplied,
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts' | sed -n '240,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   240	    // Normalise similarity from 0–100 to 0–1 for proper weight combination
   241	    const similarityRaw = typeof row.similarity === 'number' && Number.isFinite(row.similarity)
   242	      ? row.similarity
   243	      : resolveBaseScore(row) * 100; // fall back to base score rescaled
   244	
   245	    const similarity = Math.max(0, Math.min(1, similarityRaw / 100));
   246	    const importance = typeof row.importance_weight === 'number' && Number.isFinite(row.importance_weight)
   247	      ? row.importance_weight
   248	      : 0.5;
   249	
   250	    // Recency: use created_at as the timestamp (ISO string stored in DB)
   251	    const recencyTimestamp = (row.created_at as string | undefined) ?? '';
   252	    const importanceTier = (row.importance_tier as string | undefined) ?? 'normal';
   253	    const recency = computeRecencyScore(recencyTimestamp, importanceTier);
   254	
   255	    const intentScore =
   256	      similarity * weights.similarity +
   257	      importance * weights.importance +
   258	      recency * weights.recency;
   259	
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts' | sed -n '600,730p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
   600	  // P3-09 FIX: Only when explicitly opted in via trackAccess.
   601	  // Write-back is fire-and-forget; errors per-row are swallowed inside
   602	  // applyTestingEffect so they never abort the pipeline.
   603	  if (config.trackAccess) {
   604	    try {
   605	      const db = requireDb();
   606	      applyTestingEffect(db, results);
   607	    } catch (err: unknown) {
   608	      const message = err instanceof Error ? err.message : String(err);
   609	      console.warn(`[stage2-fusion] testing effect skipped (db unavailable): ${message}`);
   610	    }
   611	  }
   612	
   613	  // AI-WHY: -- 4. Intent weights --
   614	  // G2 PREVENTION: Only apply for non-hybrid search types.
   615	  // Hybrid search (RRF / RSF) incorporates intent weighting during fusion —
   616	  // applying it again here would double-count, causing the G2 bug.
   617	  if (!isHybrid && config.intentWeights) {
   618	    try {
   619	      const weighted = applyIntentWeightsToResults(results, config.intentWeights);
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md' | sed -n '1,24p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md' | sed -n '1,24p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md' | sed -n '1,28p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	# Local GGUF reranker via node-llama-cpp
     2	
     3	## Current Reality
     4	
     5	**IMPLEMENTED (Sprint 019).** Implements the `RERANKER_LOCAL` flag with `node-llama-cpp` in Stage 3 using `bge-reranker-v2-m3.Q4_K_M.gguf` (~350MB). Default 4GB free memory requirement (lower 512MB threshold when custom `SPECKIT_RERANKER_MODEL` is set). Sequential per-candidate inference; on Apple Silicon with small GGUF (~100MB) expect 200-400ms for top-20 (CHK-113). Falls back to existing RRF scoring when local execution is unavailable. New file: `lib/search/local-reranker.ts`.
     6	
     7	## Source Files
     8	
     9	### Implementation
    10	
    11	| File | Layer | Role |
    12	|------|-------|------|
    13	| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
    14	| `mcp_server/core/config.ts` | Core | Server configuration |
    15	| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
    16	| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
    17	| `mcp_server/lib/errors/core.ts` | Lib | Error type definitions |
    18	| `mcp_server/lib/errors/recovery-hints.ts` | Lib | Error recovery hints |
    19	| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
    20	| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
 succeeded in 51ms:
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
 succeeded in 51ms:
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
/bin/zsh -lc "rg -n \"scoringMethod|fallback'|fallback\\)|0\\.5 - \\(|positional scoring|artifactBoostApplied|getStrategyForQuery|confidence\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"canonicalResultId|mem:\\\\d+|_s4shadow|_s4attribution|_s3meta\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md:32:| `mcp_server/lib/scoring/confidence-tracker.ts` | Lib | Confidence tracking |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md:83:| `mcp_server/tests/confidence-tracker.vitest.ts` | Confidence tracking tests |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md:36:| `mcp_server/lib/scoring/confidence-tracker.ts` | Lib | Confidence tracking |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md:87:| `mcp_server/tests/confidence-tracker.vitest.ts` | Confidence tracking tests |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md:34:| `mcp_server/lib/scoring/confidence-tracker.ts` | Lib | Confidence tracking |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md:85:| `mcp_server/tests/confidence-tracker.vitest.ts` | Confidence tracking tests |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md:30:| `mcp_server/lib/scoring/confidence-tracker.ts` | Lib | Confidence tracking |
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md:81:| `mcp_server/tests/confidence-tracker.vitest.ts` | Confidence tracking tests |
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md:5:Search results often contain a long tail of irrelevant items. Rather than returning a fixed number, confidence truncation detects where relevant results end. It computes consecutive score gaps across the ranked list, finds the median gap, and looks for the first gap exceeding 2x the median. That point is the "relevance cliff." Everything below it is trimmed.
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md:17:| `mcp_server/lib/search/confidence-truncation.ts` | Lib | Confidence-based truncation |
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md:23:| `mcp_server/tests/confidence-truncation.vitest.ts` | Truncation behavior |
.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md:45:| `mcp_server/lib/search/confidence-truncation.ts` | Lib | Confidence-based truncation |
.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md:108:| `mcp_server/tests/confidence-truncation.vitest.ts` | Truncation behavior |
.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md:47:| `mcp_server/lib/search/confidence-truncation.ts` | Lib | Confidence-based truncation |
.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md:110:| `mcp_server/tests/confidence-truncation.vitest.ts` | Truncation behavior |
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:20:  - [Quality-aware 3-tier search fallback](#quality-aware-3-tier-search-fallback)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:99:  - [Negative feedback confidence signal](#negative-feedback-confidence-signal)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:109:  - [Confidence-based result truncation](#confidence-based-result-truncation)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:262:Five operational stages run between fusion and delivery. Stage A (query complexity routing, `SPECKIT_COMPLEXITY_ROUTER`) restricts active channels for simple queries to just vector and FTS, moderate queries add BM25, and complex queries get all five. Stage B (RSF shadow fusion, `SPECKIT_RSF_FUSION`) is historical and no longer active in runtime ranking; RSF artifacts are retained for compatibility/testing references only. Stage C (channel enforcement, `SPECKIT_CHANNEL_MIN_REP`) ensures every contributing channel has at least one result in top-k with a 0.005 quality floor. Stage D (confidence truncation, `SPECKIT_CONFIDENCE_TRUNCATION`) trims the irrelevant tail using a 2x-median gap elbow heuristic. Stage E (dynamic token budget, `SPECKIT_DYNAMIC_TOKEN_BUDGET`) computes tier-aware token limits (simple 1,500, moderate 2,500, complex 4,000).
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:402:Positive feedback adds 0.1 to the memory's confidence score (capped at 1.0). Negative feedback subtracts 0.05 (floored at 0.0). The base confidence for any memory starts at 0.5. The asymmetry between positive (+0.1) and negative (-0.05) increments is intentional. It takes one good validation to raise confidence by 0.1 but two bad validations to cancel that out. This bias toward preservation reflects the assumption that a memory might be unhelpful for one query but still valuable for another.
 succeeded in 51ms:
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md:5:Mixed ID formats (`42`, `"42"`, `mem:42`) caused deduplication failures in hybrid search. Normalization was applied in `combinedLexicalSearch()` for the new pipeline and in legacy `hybridSearch()` for the dedup map. Regression tests `T031-LEX-05` and `T031-BASIC-04` verify the fix.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:780:Mixed ID formats (`42`, `"42"`, `mem:42`) caused deduplication failures in hybrid search. Normalization was applied in `combinedLexicalSearch()` for the new pipeline and in legacy `hybridSearch()` for the dedup map. Regression tests `T031-LEX-05` and `T031-BASIC-04` verify the fix.
exec
/bin/zsh -lc "rg -n \"artifactBoostApplied|boostFactor|maxResults|semanticWeight|keywordWeight|recencyBias|getStrategyForQuery|FILE_PATH_PATTERNS|QUERY_PATTERNS\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"p95|latencyTracker|cache TTL|CACHE_TTL|circuit breaker|half-open|scoringMethod|positional fallback\" '.opencode/skill/system-spec-kit/feature_catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:

 succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:2201:The estimated 7.1 MB storage savings (3.9% of 180 MB total DB) did not justify 5.32% estimated recall risk, custom quantized BLOB complexity, or KL-divergence calibration overhead. Re-evaluate when the corpus grows approximately 4x (above 10K memories), sustained p95 exceeds 50ms, or the embedding provider changes to dimensions above 1,536.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:2405:| `TOOL_CACHE_TTL_MS` | `60000` | number | `lib/cache/tool-cache.ts` | Default time-to-live in milliseconds for tool cache entries. After this duration, entries are treated as expired and evicted on next access or cleanup sweep. Default is 60 seconds (60,000 ms). |
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/01-int8-quantization-evaluation.md:9:The estimated 7.1 MB storage savings (3.9% of 180 MB total DB) did not justify 5.32% estimated recall risk, custom quantized BLOB complexity, or KL-divergence calibration overhead. Re-evaluate when the corpus grows approximately 4x (above 10K memories), sustained p95 exceeds 50ms, or the embedding provider changes to dimensions above 1,536.
.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/02-2-session-and-cache.md:17:| `TOOL_CACHE_TTL_MS` | `60000` | number | `lib/cache/tool-cache.ts` | Default time-to-live in milliseconds for tool cache entries. After this duration, entries are treated as expired and evicted on next access or cleanup sweep. Default is 60 seconds (60,000 ms). |
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/03-observer-effect-mitigation.md:5:Measurement infrastructure should not degrade the system it measures. A health check compares search p95 latency with eval logging enabled versus disabled and fires an alert when overhead exceeds 10%. In practice, measured overhead stays within the 5ms p95 budget. If the eval database becomes unavailable (disk full, file lock, corruption), search continues normally with logging silently disabled. The system never blocks a user query to record an evaluation metric.
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md:5:The tool cache (`lib/cache/tool-cache.ts`) provides a per-tool, TTL-based in-memory cache that sits in front of expensive operations like embedding generation and database queries. Each cache entry is keyed by a SHA-256 hash of the tool name plus input parameters and expires after a configurable TTL (default 60 seconds via `TOOL_CACHE_TTL_MS`). Maximum cache size is governed by `TOOL_CACHE_MAX_ENTRIES` (default 1000) with oldest-entry eviction on overflow.
codex
---
GAP_NUMBER: 14  
FEATURE_NAME: Provider-Resolved Neural Reranker Orchestration  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `mcp_server/lib/search/cross-encoder.ts:36-61,176-187,232-350,356-463,475-498`  
DRAFT_DESCRIPTION: `cross-encoder.ts` implements provider-priority neural reranking with `Voyage -> Cohere -> local`, gated by `SPECKIT_CROSS_ENCODER`. It has provider-specific endpoints/models/timeouts and normalizes rerank output into a unified shape (`rerankerScore`, `originalRank`, `provider`, `scoringMethod`). Runtime behavior includes optional length penalties, TTL+bounded cache, and latency tracking. On missing provider, circuit-open state, or provider error, it returns deterministic positional fallback scores marked as `scoringMethod: 'fallback'`.  
SUGGESTED_CATEGORY: `11--scoring-and-calibration`  
SIGNIFICANCE: HIGH  
NOTES: Catalog mentions cross-encoder use, but this provider arbitration + resilience/telemetry depth is still under-documented as a standalone behavior.

---
GAP_NUMBER: 15  
FEATURE_NAME: Quality-Aware 3-Tier Fallback with Degradation Metadata  
STATUS: FALSE_POSITIVE  
SOURCE_FILES: `mcp_server/lib/search/hybrid-search.ts:135-167,1036-1044,1092-1149,1298-1327,1335-1361,1386-1485`  
DRAFT_DESCRIPTION: The search path uses a quality-gated 3-tier chain when fallback is enabled: Tier 1 standard hybrid, Tier 2 widened all-channel retrieval, Tier 3 structural SQL retrieval. Degradation is triggered by low quality (`topScore`/`relativeGap`) or insufficient count, and each degradation step is recorded. Tier 3 structural rows are score-calibrated before merge to avoid overpowering stronger semantic rows. Returned arrays carry non-enumerable `_degradation` metadata for traceability.  
SUGGESTED_CATEGORY: `01--retrieval`  
SIGNIFICANCE: HIGH  
NOTES: This is now documented in `feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md:1-5`; however, that doc currently drifts on score-cap details versus implementation.

---
GAP_NUMBER: 16  
FEATURE_NAME: Causal Neighbor Boost with Graph-Based Neighbor Injection  
STATUS: FALSE_POSITIVE  
SOURCE_FILES: `mcp_server/lib/search/causal-boost.ts:13-36,103-187,203-287`  
DRAFT_DESCRIPTION: The module seeds from top-ranked results, performs a weighted recursive causal traversal up to 2 hops, and computes hop-decayed boost values per neighbor. Existing results get bounded multiplicative uplift with a combined causal+session ceiling. Missing neighbors discovered via traversal are fetched from `memory_index` and injected into the result set. Metadata reports whether boosting/injection happened and how many rows were affected.  
SUGGESTED_CATEGORY: `10--graph-signal-activation`  
SIGNIFICANCE: HIGH  
NOTES: This is now documented in `feature_catalog/10--graph-signal-activation/10-causal-neighbor-boost-and-injection.md:1-7`; relation-type details in docs are partially stale vs code.

---
GAP_NUMBER: 17  
FEATURE_NAME: Artifact-Class Retrieval Strategy Routing  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `mcp_server/lib/search/artifact-routing.ts:12-127,137-199,241-304,312-340`; `mcp_server/lib/search/pipeline/stage2-fusion.ts:275-315,633-670`  
DRAFT_DESCRIPTION: Retrieval policy is split across 9 artifact classes, each with strategy parameters (`semanticWeight`, `keywordWeight`, `recencyBias`, `maxResults`, `boostFactor`). Classification is done from file paths and query patterns, producing a confidence-scored routing decision. Stage 2 applies class-specific score boosts and enforces per-class `maxResults` before later stages. This is materially richer than the current broad “artifact routing” mentions.  
SUGGESTED_CATEGORY: `01--retrieval`  
SIGNIFICANCE: HIGH  
NOTES: I found no dedicated feature snippet documenting the class table, classifier logic, and max-result policy behavior end-to-end.

---
GAP_NUMBER: NEW-01  
FEATURE_NAME: Rerank Score Provenance Discriminator  
STATUS: NEW_GAP  
SOURCE_FILES: `mcp_server/lib/search/cross-encoder.ts:93-99,365-375,380-388,455-463`  
DRAFT_DESCRIPTION: Rerank outputs explicitly tag score provenance via `scoringMethod: 'cross-encoder' | 'fallback'`. Fallback scoring uses a separate positional band and provider marker so consumers can distinguish synthetic degradation output from true neural reranker output. This creates a machine-readable reliability signal on every rerank result row.  
SUGGESTED_CATEGORY: `11--scoring-and-calibration`  
SIGNIFICANCE: MEDIUM  
NOTES: I did not find this discriminator behavior documented as its own feature.

---
GAP_NUMBER: NEW-02  
FEATURE_NAME: Confidence-Scored Artifact Query Classification  
STATUS: NEW_GAP  
SOURCE_FILES: `mcp_server/lib/search/artifact-routing.ts:154-199,241-304`  
DRAFT_DESCRIPTION: The artifact router includes its own query classifier using keyword + regex scoring per artifact class, then normalizes to a confidence value. It also supports a low-confidence spec-folder tiebreak path when direct query evidence is absent. This is a distinct routing-intelligence layer beyond static file-type matching.  
SUGGESTED_CATEGORY: `12--query-intelligence`  
SIGNIFICANCE: MEDIUM  
NOTES: This appears undocumented compared with the current high-level references to artifact routing.
tokens used
143,746
---
GAP_NUMBER: 14  
FEATURE_NAME: Provider-Resolved Neural Reranker Orchestration  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `mcp_server/lib/search/cross-encoder.ts:36-61,176-187,232-350,356-463,475-498`  
DRAFT_DESCRIPTION: `cross-encoder.ts` implements provider-priority neural reranking with `Voyage -> Cohere -> local`, gated by `SPECKIT_CROSS_ENCODER`. It has provider-specific endpoints/models/timeouts and normalizes rerank output into a unified shape (`rerankerScore`, `originalRank`, `provider`, `scoringMethod`). Runtime behavior includes optional length penalties, TTL+bounded cache, and latency tracking. On missing provider, circuit-open state, or provider error, it returns deterministic positional fallback scores marked as `scoringMethod: 'fallback'`.  
SUGGESTED_CATEGORY: `11--scoring-and-calibration`  
SIGNIFICANCE: HIGH  
NOTES: Catalog mentions cross-encoder use, but this provider arbitration + resilience/telemetry depth is still under-documented as a standalone behavior.

---
GAP_NUMBER: 15  
FEATURE_NAME: Quality-Aware 3-Tier Fallback with Degradation Metadata  
STATUS: FALSE_POSITIVE  
SOURCE_FILES: `mcp_server/lib/search/hybrid-search.ts:135-167,1036-1044,1092-1149,1298-1327,1335-1361,1386-1485`  
DRAFT_DESCRIPTION: The search path uses a quality-gated 3-tier chain when fallback is enabled: Tier 1 standard hybrid, Tier 2 widened all-channel retrieval, Tier 3 structural SQL retrieval. Degradation is triggered by low quality (`topScore`/`relativeGap`) or insufficient count, and each degradation step is recorded. Tier 3 structural rows are score-calibrated before merge to avoid overpowering stronger semantic rows. Returned arrays carry non-enumerable `_degradation` metadata for traceability.  
SUGGESTED_CATEGORY: `01--retrieval`  
SIGNIFICANCE: HIGH  
NOTES: This is now documented in `feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md:1-5`; however, that doc currently drifts on score-cap details versus implementation.

---
GAP_NUMBER: 16  
FEATURE_NAME: Causal Neighbor Boost with Graph-Based Neighbor Injection  
STATUS: FALSE_POSITIVE  
SOURCE_FILES: `mcp_server/lib/search/causal-boost.ts:13-36,103-187,203-287`  
DRAFT_DESCRIPTION: The module seeds from top-ranked results, performs a weighted recursive causal traversal up to 2 hops, and computes hop-decayed boost values per neighbor. Existing results get bounded multiplicative uplift with a combined causal+session ceiling. Missing neighbors discovered via traversal are fetched from `memory_index` and injected into the result set. Metadata reports whether boosting/injection happened and how many rows were affected.  
SUGGESTED_CATEGORY: `10--graph-signal-activation`  
SIGNIFICANCE: HIGH  
NOTES: This is now documented in `feature_catalog/10--graph-signal-activation/10-causal-neighbor-boost-and-injection.md:1-7`; relation-type details in docs are partially stale vs code.

---
GAP_NUMBER: 17  
FEATURE_NAME: Artifact-Class Retrieval Strategy Routing  
STATUS: CONFIRMED_GAP  
SOURCE_FILES: `mcp_server/lib/search/artifact-routing.ts:12-127,137-199,241-304,312-340`; `mcp_server/lib/search/pipeline/stage2-fusion.ts:275-315,633-670`  
DRAFT_DESCRIPTION: Retrieval policy is split across 9 artifact classes, each with strategy parameters (`semanticWeight`, `keywordWeight`, `recencyBias`, `maxResults`, `boostFactor`). Classification is done from file paths and query patterns, producing a confidence-scored routing decision. Stage 2 applies class-specific score boosts and enforces per-class `maxResults` before later stages. This is materially richer than the current broad “artifact routing” mentions.  
SUGGESTED_CATEGORY: `01--retrieval`  
SIGNIFICANCE: HIGH  
NOTES: I found no dedicated feature snippet documenting the class table, classifier logic, and max-result policy behavior end-to-end.

---
GAP_NUMBER: NEW-01  
FEATURE_NAME: Rerank Score Provenance Discriminator  
STATUS: NEW_GAP  
SOURCE_FILES: `mcp_server/lib/search/cross-encoder.ts:93-99,365-375,380-388,455-463`  
DRAFT_DESCRIPTION: Rerank outputs explicitly tag score provenance via `scoringMethod: 'cross-encoder' | 'fallback'`. Fallback scoring uses a separate positional band and provider marker so consumers can distinguish synthetic degradation output from true neural reranker output. This creates a machine-readable reliability signal on every rerank result row.  
SUGGESTED_CATEGORY: `11--scoring-and-calibration`  
SIGNIFICANCE: MEDIUM  
NOTES: I did not find this discriminator behavior documented as its own feature.

---
GAP_NUMBER: NEW-02  
FEATURE_NAME: Confidence-Scored Artifact Query Classification  
STATUS: NEW_GAP  
SOURCE_FILES: `mcp_server/lib/search/artifact-routing.ts:154-199,241-304`  
DRAFT_DESCRIPTION: The artifact router includes its own query classifier using keyword + regex scoring per artifact class, then normalizes to a confidence value. It also supports a low-confidence spec-folder tiebreak path when direct query evidence is absent. This is a distinct routing-intelligence layer beyond static file-type matching.  
SUGGESTED_CATEGORY: `12--query-intelligence`  
SIGNIFICANCE: MEDIUM  
NOTES: This appears undocumented compared with the current high-level references to artifact routing.
