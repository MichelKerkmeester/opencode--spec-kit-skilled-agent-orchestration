OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce98-86b4-7650-a8ec-64ee075e9ed7
--------
user
You are a feature catalog verification agent. Read each feature snippet file in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/ (9 files). For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. 

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
I’m verifying the 9 feature catalog snippets against the `mcp_server` code and checking that every listed source path exists. I’ll first locate any deeper `AGENTS.md` files that apply, then read the feature snippets and the referenced implementation files side by side.
exec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements -maxdepth 1 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files -g 'AGENTS.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/04-lightweight-consolidation.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/06-cross-document-entity-linking.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/09-contextual-tree-injection.md
 succeeded in 52ms:
AGENTS.md
.opencode/specs/03--commands-and-skills/sk-mcp/001-mcp-clickup-creation/context/clickup-cli-main/AGENTS.md
.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/AGENTS.md
codex
I’ve confirmed there isn’t a deeper `AGENTS.md` under the target tree, so the repo-root guidance applies here. Next I’m loading that guidance plus the relevant skill routing so I can do the verification in the project’s expected way.
exec
/bin/zsh -lc "sed -n '1,260p' AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# AI Assistant Framework (Universal Template)

> **Universal behavior framework** defining guardrails, standards, and decision protocols.

---

## 1. 🚨 CRITICAL RULES

**HARD BLOCKERS (The "Four Laws" of Agent Safety):**
1. **READ FIRST:** Never edit a file without reading it first. Understand context before modifying.
2. **SCOPE LOCK:** Only modify files explicitly in scope. **NO** "cleaning up" or "improving" adjacent code. Scope in `spec.md` is FROZEN.
3. **VERIFY:** Syntax checks and tests **MUST** pass before claiming completion. **NO** blind commits.
4. **HALT:** Stop immediately if uncertain, if line numbers don't match, or if tests fail. (See "Halt Conditions" below).

**OPERATIONAL MANDATES:**
- **All file modifications require a spec folder** (Gate 3).
- **Never lie or fabricate** - use "UNKNOWN" when uncertain.
- **Clarify** if confidence < 80% (see §5 Confidence Framework).
- **Use explicit uncertainty:** Prefix claims with "I'M UNCERTAIN ABOUT THIS:".

exec
/bin/zsh -c 'python3 .opencode/skill/scripts/skill_advisor.py "Verify 9 feature catalog markdown snippets in .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements against implementation files in .opencode/skill/system-spec-kit/mcp_server: check Current Reality accuracy, listed Source Files existence, and identify missing source files" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 671ms:
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !/system-spec-kit(explicit), !spec, !system-spec-kit(explicit), document~, files~"
  },
  {
    "skill": "sk-code--opencode",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !opencode, check~, opencode(name), system"
  },
  {
    "skill": "sk-code--full-stack",
    "kind": "skill",
codex
SKILL ROUTING: `system-spec-kit` was the highest-confidence match, so I’m using that guidance for this verification pass. I’m reading just the relevant parts of the skill and then I’ll audit each feature snippet against the implementation files it cites.
exec
/bin/zsh -lc 'rg -n "feature catalog|Current Reality|Source Files|verification|mcp_server" .opencode/skill/system-spec-kit/SKILL.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
93:- `references/validation/` for checklist policy, verification rules, and decision formats.
361:| **2**  | 100-499      | Level 1 + checklist.md                                | Quality gates, verification, NFRs           |
527:> **Search architecture:** The search pipeline uses a 4-stage architecture (candidate generation → fusion → reranking → filtering). See [search/README.md](./mcp_server/lib/search/README.md) for pipeline details, scoring algorithms, and graph signal features.
649:6. **Claim done without checklist verification** - Level 2+ requirement
780:| MCP Server        | `mcp_server/context-server.ts`                                             | Spec Kit Memory MCP (~682 lines)  |
781:| Database          | `mcp_server/dist/database/context-index.sqlite`                            | Vector search index (canonical runtime path) |
 succeeded in 50ms:
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

Plan update
Read-only verification workflow: inspect feature snippets, inspect referenced implementation files, then synthesize a per-feature accuracy report.
  → Read the 9 feature catalog snippets and extract each Current Reality and Source Files section
  • Inspect the referenced mcp_server implementation files and verify listed paths exist
  • Identify any missing implementation files and produce the required per-feature report
codex
I’ve got the verification workflow set: first extract each snippet’s claims and source-file list, then compare those against the actual `mcp_server` implementation and look for omitted files. I’m reading the nine catalog entries now so I can build a complete check matrix before I inspect code.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/04-lightweight-consolidation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/06-cross-document-entity-linking.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/09-contextual-tree-injection.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Dual-scope memory auto-surface

## Current Reality

Memory auto-surface hooks fire at two lifecycle points beyond explicit search: tool dispatch for non-memory-aware tools (using extracted context hints), and session compaction (when context is compressed, critical memories are re-injected).

Each hook point has a per-point token budget of 4,000 tokens maximum. The tool dispatch hook checks incoming tool arguments for context hints (input, query, prompt, specFolder, filePath or concepts) and surfaces constitutional-tier and trigger-matched memories, but skips memory-aware tools to avoid recursive surfacing loops. Memory-aware tools are handled in-band by the context-server pre-dispatch branch (`autoSurfaceMemories` / `autoSurfaceAtCompaction`). Constitutional memories are cached for 1 minute via an in-memory cache.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface UX hook |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
 succeeded in 51ms:
# Constitutional memory as expert knowledge injection

## Current Reality

Constitutional-tier memories receive a `retrieval_directive` metadata field formatted as explicit instruction prefixes for LLM consumption. Examples: "Always surface when: user asks about memory save rules" or "Prioritize when: debugging search quality."

Rule patterns are extracted from content using a ranked list of imperative verbs (must, always, never, should, require) and condition-introducing words (when, if, for, during). Scanning is capped at 2,000 characters from the start of content, and each directive component is capped at 120 characters. The `enrichWithRetrievalDirectives()` function maps over results without filtering or reordering. The enrichment is wired into `hooks/memory-surface.ts` before returning results.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/retrieval-directives.ts` | Lib | Constitutional retrieval injection |

### Tests

| File | Focus |
|------|-------|
 succeeded in 51ms:
# Lightweight consolidation

## Current Reality

Four sub-components handle ongoing memory graph maintenance as a weekly batch cycle. Contradiction scanning finds memory pairs above 0.85 cosine similarity with keyword negation conflicts using a dual strategy: vector-based (cosine on sqlite-vec embeddings) plus heuristic fallback (word overlap). Both use a `hasNegationConflict()` keyword asymmetry check against approximately 20 negation terms (not, never, deprecated, replaced, and others). The system surfaces full contradiction clusters rather than isolated pairs via 1-hop causal edge neighbor expansion.

Hebbian edge strengthening reinforces recently accessed edges at +0.05 per cycle with a 30-day decay of 0.1, respecting the auto-edge strength cap. Staleness detection flags edges unfetched for 90 or more days without deleting them. Edge bounds enforcement reports current edge counts versus the 20-edge-per-node maximum.

All weight modifications are logged to the `weight_history` table. The cycle fires after every successful `memory_save` when enabled. Runs behind the `SPECKIT_CONSOLIDATION` flag (default ON).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
| `mcp_server/lib/search/graph-search-fn.ts` | Lib | Graph degree scoring |
 succeeded in 50ms:
# Spec folder hierarchy as retrieval structure

## Current Reality

Spec folder paths from memory metadata are parsed into an in-memory hierarchy tree. The `buildHierarchyTree()` function performs two-pass construction: the first pass creates nodes from all distinct `spec_folder` values including implicit intermediate parents, the second pass links children to parents via path splitting.

The `queryHierarchyMemories()` function returns parent, sibling and ancestor memories with relevance scoring: self receives 1.0, parent 0.8, grandparent 0.6, sibling 0.5, with a floor of 0.3. The graph search function traverses this tree so that related folders surface as contextual results alongside direct matches, making spec folder organization a direct retrieval signal rather than metadata that only serves filtering. Always active with no feature flag.

**Sprint 8 update:** A WeakMap TTL cache (60s, keyed by database instance) was added to `buildHierarchyTree()` to avoid full-scan reconstruction on every search request. An `invalidateHierarchyCache()` export allows explicit cache clearing when hierarchy data changes.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/spec-folder-hierarchy.ts` | Lib | Spec folder hierarchy traversal |

### Tests

 succeeded in 50ms:
# Cross-document entity linking

## Current Reality

Memories in different spec folders often discuss the same concepts without any explicit connection between them. A decision record in one folder mentions "embedding cache" and an implementation summary in another folder implements it, but the retrieval system has no way to connect them unless a causal edge exists.

Cross-document entity linking bridges this gap using the entity catalog populated by R10. The `buildEntityCatalog()` function groups entities from the `memory_entities` table by canonical name. The `findCrossDocumentMatches()` function identifies entities appearing in two or more distinct spec folders, which represent genuine cross-document relationships.

For each cross-document match, `createEntityLinks()` inserts causal edges with `relation='supports'`, `strength=0.7` and `created_by='entity_linker'`. The `supports` relation was chosen over adding a new relation type to avoid ALTER TABLE complexity on the SQLite `causal_edges` CHECK constraint. Entity-derived links are genuinely supportive relationships: if two documents reference the same entity, they support each other's context.

An infrastructure gate checks that the `entity_catalog` has entries before running. Without R10 providing extracted entities, S5 has nothing to operate on. The `runEntityLinking()` orchestrator chains catalog build, match finding and edge creation with statistics reporting.

**Sprint 8 update:** Two performance improvements were applied to `entity-linker.ts`: (1) a parallel `Set` was added for `catalogSets` providing O(1) `.has()` lookups instead of O(n) `.includes()` in inner loops, and (2) a `batchGetEdgeCounts()` function replaced N+1 individual `getEdgeCount` queries with a single batch query.

A density guard prevents runaway edge creation: current global edge density is computed as `total_edges / total_memories` and checked before link generation begins. The linker also checks projected post-insert global density before creating links. If either check exceeds the configured threshold, new entity links are skipped to avoid overwhelming the graph. The threshold is controlled by `SPECKIT_ENTITY_LINKING_MAX_DENSITY` (default `1.0`), and invalid or negative values fall back to `1.0`. Runs behind the `SPECKIT_ENTITY_LINKING` flag (default ON). Depends on a populated `entity_catalog` (typically produced by R10 auto-entities).

---

## Source Files

 succeeded in 50ms:
# Provenance-rich response envelopes

## Current Reality

**IMPLEMENTED (Sprint 019).** Search results gain optional provenance envelopes (default `includeTrace: false`) exposing internal pipeline scoring that is currently dropped at Stage 4 exit. When enabled, responses include `scores` (semantic, lexical, fusion, intentAdjusted, composite, rerank, attention), `source` (file, anchorIds, anchorTypes, lastModified, memoryState), and `trace` (channelsUsed, pipelineStages, fallbackTier, queryComplexity, expansionTerms, budgetTruncated, scoreResolution).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token metrics display |
| `mcp_server/lib/response/envelope.ts` | Lib | Response envelope formatting |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/types.ts` | Shared | Type definitions |
| `shared/utils/token-estimate.ts` | Shared | Token estimation utility |

### Tests

 succeeded in 50ms:
# Memory summary search channel

## Current Reality

Large memory files bury their key information in paragraphs of context. A 2,000-word implementation summary might contain three sentences that actually answer a retrieval query. Searching against the full content dilutes embedding similarity with irrelevant noise.

R8 generates extractive summaries at save time using a pure-TypeScript TF-IDF implementation with zero dependencies. The `computeTfIdf()` function scores each sentence by term frequency times inverse document frequency across all sentences in the document, normalized to [0,1]. The `extractKeySentences()` function selects the top-3 scoring sentences and returns them in original document order rather than score order, preserving narrative coherence.

Generated summaries are stored in the `memory_summaries` table alongside a summary-specific embedding vector computed by the same embedding function used for full content. The `querySummaryEmbeddings()` function performs cosine similarity search against these summary embeddings, returning results as `PipelineRow` objects compatible with the main pipeline.

**Sprint 8 update:** A `LIMIT` clause was added to the unbounded summary query in `memory-summaries.ts` (capped at `Math.max(limit * 10, 1000)`) to prevent full-table scans on large corpora. Summary candidates in Stage 1 now also pass through the same `minQualityScore` filter applied to other candidates.

The summary channel runs as a parallel search channel in Stage 1 of the 4-stage pipeline, alongside hybrid, vector and multi-concept channels. It follows the R12 embedding expansion pattern: execute in parallel, merge results and deduplicate by memory ID with baseline results taking priority. This is deliberately a parallel channel rather than a pre-filter to avoid recall loss.

A runtime scale gate activates the channel only when the system exceeds 5,000 indexed memories with successful embeddings. Below that threshold, the summary channel adds overhead without measurable benefit because the base channels already cover the corpus effectively. The code exists regardless of scale; the gate simply skips execution. Runs behind the `SPECKIT_MEMORY_SUMMARIES` flag (default ON).

## Source Files

### Implementation

 succeeded in 51ms:
# Tier-2 fallback channel forcing

## Current Reality

A `forceAllChannels` option was added to hybrid search. When the tier-2 quality fallback activates, it now sets `forceAllChannels: true` to ensure all retrieval channels execute, bypassing the simple-route channel reduction that could skip BM25 or graph channels. Regression test `C138-P0-FB-T2` verifies the behavior.

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/channel-enforcement.ts` | Lib | Channel enforcement |
| `mcp_server/lib/search/channel-representation.ts` | Lib | Channel min-representation |

### Tests

| File | Focus |
 succeeded in 51ms:
# Contextual tree injection

## Current Reality

**IMPLEMENTED (Sprint 019).** Returned chunks are prefixed with hierarchical context headers in the format `[parent > child — description]` (max 100 chars), using existing PI-B3 cached spec folder descriptions. Gated by `SPECKIT_CONTEXT_HEADERS` (default `true`) and injected after Stage 4 token-budget truncation.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/errors/core.ts` | Lib | Error type definitions |
| `mcp_server/lib/errors/recovery-hints.ts` | Lib | Error recovery hints |
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
codex
The catalog entries are loaded, and a couple already look like they may be overclaiming or carrying broad file lists that don’t obviously map to the described behavior. I’m checking the actual implementation surface now by tracing the named functions, flags, and feature hooks in `mcp_server` and then I’ll separate real dependencies from incidental ones.
exec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/mcp_server/lib/search -maxdepth 1 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/mcp_server/tests -maxdepth 1 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/mcp_server/lib/storage -maxdepth 1 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/mcp_server/hooks -maxdepth 1 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md
.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts
.opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/context-budget.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/README.md
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fallback.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/api-key-validation.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/api-validation.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/batch-processor.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts
exec
/bin/zsh -lc 'rg -n "buildHierarchyTree|queryHierarchyMemories|invalidateHierarchyCache|WeakMap|TTL|hierarchy cache" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "consolidation|weight_history|SPECKIT_CONSOLIDATION|hasNegationConflict|negation|runConsolidation|runReconsolidation|staleness|edge count|20-edge|weekly|memory_save" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "autoSurfaceMemories|autoSurfaceAtCompaction|extractContextHints|CONSTITUTIONAL_CACHE_TTL_MS|memory-aware|tool dispatch|compaction" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "retrieval_directive|enrichWithRetrievalDirectives|extractRuleDirective|directive" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:157: * - Session TTL: 30 minutes
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:161:  sessionTtlMinutes: parseInt(process.env.SESSION_TTL_MINUTES as string, 10) || 30,
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:11:  buildHierarchyTree,
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:15:  queryHierarchyMemories,
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:118:// --- 3. buildHierarchyTree ---
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:120:describe('buildHierarchyTree', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:132:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:155:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:170:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:180:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:187:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:198:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:217:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:243:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:254:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:261:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:268:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:289:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:301:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:308:    const tree = buildHierarchyTree(db);
exec
/bin/zsh -lc 'rg -n "buildEntityCatalog|findCrossDocumentMatches|createEntityLinks|runEntityLinking|entity_linker|SPECKIT_ENTITY_LINKING|MAX_DENSITY|batchGetEdgeCounts|catalogSets|supports" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "memory_summaries|computeTfIdf|extractKeySentences|querySummaryEmbeddings|SPECKIT_MEMORY_SUMMARIES|minQualityScore|5000|summary" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "forceAllChannels|tier-2|fallback|channel forcing|C138-P0-FB-T2" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "includeTrace|provenance|trace|scores|budgetTruncated|scoreResolution|fallbackTier|channelsUsed|pipelineStages|expansionTerms" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
Total output lines: 364

.opencode/skill/system-spec-kit/mcp_server/context-server.ts:238:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:171:  name: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:326:  memory_save: memorySaveSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:357:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding'],
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:34:  'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:49:    case 'memory_save':           return handleMemorySave(parseArgs<SaveArgs>(validateToolArgs('memory_save', args)));
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:53:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:395:- `memory_save` (index new memories)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:511:### memory_save: Index a Memory File
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:513:`memory_save()` indexes a single new or updated memory file into the database. For bulk indexing, use `memory_index_scan()` instead.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:901:           memory_save, memory_index_scan, memory_stats
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:215:| Full validation | `runPreflight()` | Before memory_save |
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:47:  'memory_save',
.opencode/skill/system-spec-kit/mcp_server/README.md:263:| `memory_save`        | Index a single memory file                                                                         | ~1s                 |
.opencode/skill/system-spec-kit/mcp_server/README.md:342:| L2    | Core          | 1500         | `memory_search`, `memory_match_triggers`, `memory_save` |
.opencode/skill/system-spec-kit/mcp_server/README.md:623:│   ├── memory-save.ts      # memory_save + PE gating
.opencode/skill/system-spec-kit/mcp_server/README.md:1073:# Check memory states (use <> not != in zsh to avoid glob negation)
.opencode/skill/system-spec-kit/mcp_server/README.md:1104:| `scripts/core/workflow.ts` | Tree thinning for spec folder consolidation (token-budget-aware merge of low-value nodes) |
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:47:  autoSurfaceMemories,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:49:  autoSurfaceAtCompaction,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:293:            autoSurfacedContext = await autoSurfaceAtCompaction(contextHint);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:295:            autoSurfacedContext = await autoSurfaceMemories(contextHint);
.opencode/skill/system-spec-kit/mcp_server/README.md:214:| `handlers/`   | Handler modules for tool dispatch and infrastructure                    |
.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:4:// Re-exports all tool dispatch modules for context-server (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:17:/** All tool dispatch modules in priority order */
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:4:// Shared types for tool dispatch modules (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:5:  - "tool dispatch"
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:134:async function autoSurfaceMemories(contextHint: string): Promise<AutoSurfaceResult | null> {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:180: * Fires at tool dispatch lifecycle points. Extracts a context hint from
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:182: * the standard autoSurfaceMemories path.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:206:  // Skip memory-aware tools to prevent recursive surfacing loops
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:219:  return autoSurfaceMemories(contextHint);
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:227: * autoSurfaceAtCompaction
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:229: * Fires at session compaction lifecycle points. Surfaces memories relevant
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:231: * across the compaction boundary.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:243:async function autoSurfaceAtCompaction(
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:258:  // as for tool dispatch: COMPACTION_TOKEN_BUDGET = 4000.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:259:  return autoSurfaceMemories(sessionContext.trim());
exec
/bin/zsh -lc 'rg -n "SPECKIT_CONTEXT_HEADERS|context headers|hierarchical context headers|buildContextHeader|prefix.*parent > child|PI-B3|description|after Stage 4" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:8:import { enrichWithRetrievalDirectives } from '../lib/search/retrieval-directives';
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:22:  /** PI-A4: LLM-consumable retrieval directive, e.g. "Always surface when: …" */
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:23:  retrieval_directive?: string;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:151:    // PI-A4: Enrich constitutional memories with retrieval_directive metadata.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:153:    const enrichedConstitutional = enrichWithRetrievalDirectives(constitutional);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:2:// Constitutional memory as retrieval directives
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:15:  enrichWithRetrievalDirectives,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:18:} from '../lib/search/retrieval-directives';
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:45:    const directive = extractRetrievalDirective(content, 'Read First Rule');
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:46:    expect(directive).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:47:    expect(directive!.surfaceCondition).toMatch(/^Always surface when:/);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:48:    expect(directive!.source).toBe('Read First Rule');
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:53:    const directive = extractRetrievalDirective(content, 'Verify Syntax');
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:54:    expect(directive).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:55:    expect(directive!.rulePattern).toContain('must verify');
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:60:    const directive = extractRetrievalDirective(content, 'Gate Rule');
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:61:    expect(directive).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:62:    expect(directive!.surfaceCondition).toMatch(/^Always surface when:/);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:67:    const directive = extractRetrievalDirective(content, 'Review Rule');
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:68:    expect(directive).not.toBeNull();
 succeeded in 51ms:
Total output lines: 388

.opencode/skill/system-spec-kit/mcp_server/README.md:716:**Auto-detection priority:** `EMBEDDINGS_PROVIDER` env > `VOYAGE_API_KEY` detected > `OPENAI_API_KEY` detected > HuggingFace local (768d, default fallback)
.opencode/skill/system-spec-kit/mcp_server/README.md:746:| `SPECKIT_SEARCH_FALLBACK`       | `true`  | PI-A2 3-tier fallback chain |
.opencode/skill/system-spec-kit/mcp_server/README.md:866:- `contentSource` (`reassembled_chunks` or `file_read_fallback`)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:561:- `fallback`: Whether degraded-mode fallback triggered
.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json:21:  "_note_smartRanking": "LIVE CONFIG - read by vector-index-impl.ts:2802-2804 (apply_smart_ranking). Weights sum to 1.0. Code fallback defaults: relevance=0.5, recency=0.3, access=0.2.",
.opencode/skill/system-spec-kit/mcp_server/utils/json-helpers.ts:18:/** Parses JSON and returns a fallback value on failure. */
.opencode/skill/system-spec-kit/mcp_server/utils/json-helpers.ts:19:export function safeJsonParse<T = unknown>(str: string | null | undefined, fallback: T): T {
.opencode/skill/system-spec-kit/mcp_server/utils/json-helpers.ts:20:  if (!str) return fallback;
.opencode/skill/system-spec-kit/mcp_server/utils/json-helpers.ts:24:    return fallback;
.opencode/skill/system-spec-kit/mcp_server/utils/json-helpers.ts:28:/** Stringifies JSON and returns a fallback value on failure. */
.opencode/skill/system-spec-kit/mcp_server/utils/json-helpers.ts:29:export function safeJsonStringify(value: unknown, fallback: string = 'null', space?: number): string {
.opencode/skill/system-spec-kit/mcp_server/utils/json-helpers.ts:33:    return fallback;
.opencode/skill/system-spec-kit/mcp_server/utils/json-helpers.ts:38:export function safeJsonParseTyped<T = unknown>(str: string | null | undefined, expectedType: ExpectedJsonType, fallback: T): T {
.opencode/skill/system-spec-kit/mcp_server/utils/json-helpers.ts:39:  const parsed = safeJsonParse(str, fallback);
.opencode/skill/system-spec-kit/mcp_server/utils/json-helpers.ts:43:      return (Array.isArray(parsed) ? parsed : fallback) as T;
.opencode/skill/system-spec-kit/mcp_server/utils/json-helpers.ts:47:        : fallback;
.opencode/skill/system-spec-kit/mcp_server/utils/json-helpers.ts:49:      return (typeof parsed === 'string' ? parsed : fallback) as T;
.opencode/skill/system-spec-kit/mcp_server/utils/json-helpers.ts:51:      return (typeof parsed === 'number' && !isNaN(parsed) ? parsed : fallback) as T;
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/README.md:324:The causal graph supports 6 relationship types for tracing decision history:
.opencode/skill/system-spec-kit/mcp_server/README.md:333:| `supports`     | A provides evidence or support for B          |
.opencode/skill/system-spec-kit/mcp_server/README.md:704:| `SPECKIT_ENTITY_LINKING_MAX_DENSITY` | `1.0`                      | S5 density guard threshold for cross-document entity linking |
.opencode/skill/system-spec-kit/mcp_server/README.md:706:S5 density guard behavior in `lib/search/entity-linker.ts`: if current global edge density (`causal_edges / memory_index`) is already above the threshold, entity linking is skipped for that run. During link creation, inserts that would push projected density above the threshold are skipped. Invalid values (non-numeric or non-finite) and negative values for `SPECKIT_ENTITY_LINKING_MAX_DENSITY` fall back to `1.0`.
.opencode/skill/system-spec-kit/mcp_server/README.md:793:| `SPECKIT_ENTITY_LINKING`       | `true`  | Links memories sharing extracted entities (S5) |
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:71:  'supports',
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:472:The server supports phase folders for multi-phase spec work. Phase folders follow the pattern `specs/NNN-name/001-phase/`. Use the `--recursive` flag in `validate.sh` to validate all phases in a spec folder at once. The `recommend-level.sh` script applies phase detection scoring automatically.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:544:When enabled, this feature adjusts the balance between vector similarity and keyword relevance based on the detected task type. It supports 7 task types: `add_feature`, `fix_bug`, `refactor`, `understand`, `plan`, `debug` and `resume`. For example, `fix_bug` boosts exact-match keyword signals while `understand` emphasizes semantic similarity.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:845:| `.opencode/skill/system-spec-kit/scripts/validate.sh` | Spec folder validator (supports --recursive) |
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:323:  description: '[L6:Analysis] Trace causal chain for a memory to answer "why was this decision made?" Traverses causal edges up to maxDepth hops, grouping results by relationship type (caused, enabled, supersedes, contradicts, derived_from, supports). Use to understand decision lineage and memory relationships. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:324:  inputSchema: { type: 'object', additionalProperties: false, properties: { memoryId: { oneOf: [{ type: 'number' }, { type: 'string', minLength: 1 }], description: 'Memory ID to trace causal lineage for (required)' }, maxDepth: { type: 'number', default: 3, description: 'Maximum traversal depth (default: 3, max: 10)' }, direction: { type: 'string', enum: ['outgoing', 'incoming', 'both'], default: 'both', description: 'Traversal direction: outgoing (what this caused), incoming (what caused this), or both' }, relations: { type: 'array', items: { type: 'string', enum: ['caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'] }, description: 'Filter to specific relationship types' }, includeMemoryDetails: { type: 'boolean', default: true, description: 'Include full memory details in results' } }, required: ['memoryId'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:330:  inputSchema: { type: 'object', additionalProperties: false, properties: { sourceId: { oneOf: [{ type: 'number' }, { type: 'string', minLength: 1 }], description: 'Source memory ID (the cause/enabler/superseder)' }, targetId: { oneOf: [{ type: 'number' }, { type: 'string', minLength: 1 }], description: 'Target memory ID (the effect/superseded)' }, relation: { type: 'string', enum: ['caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'], description: 'Relationship type' }, strength: { type: 'number', default: 1.0, description: 'Relationship strength (0.0-1.0)' }, evidence: { type: 'string', description: 'Evidence or reason for this relationship' } }, required: ['sourceId', 'targetId', 'relation'] },
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:47:  by_supports: FlatEdge[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:98:    by_supports: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:142:      case 'supports': return result.by_supports;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:165:    by_supports: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:182:      case 'supports': merged.by_supports.push(edge); break;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:229:    by_supports: allowed.has('supports') ? chain.by_supports : [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:313:        chain = forwardFlat || backwardFlat || { all: [], by_cause: [], by_enabled: [], by_supersedes: [], by_contradicts: [], by_derived_from: [], by_supports: [], total_edges: 0, max_depth_reached: false };
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:317:      chain = tree ? flattenCausalTree(tree, maxDepth, mappedDirection) : { all: [], by_cause: [], by_enabled: [], by_supersedes: [], by_contradicts: [], by_derived_from: [], by_supports: [], total_edges: 0, max_depth_reached: false };
 succeeded in 52ms:
Total output lines: 812

.opencode/skill/system-spec-kit/mcp_server/context-server.ts:450:    // Aggregate per-file results into a summary
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:105:  minQualityScore: boundedNumber(0, 1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:355:  memory_search: ['query', 'concepts', 'specFolder', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace'],
.opencode/skill/system-spec-kit/mcp_server/cli.ts:384:  // Extract summary from MCP response
.opencode/skill/system-spec-kit/mcp_server/cli.ts:397:        console.log(`\n  ${envelope.summary || 'Scan complete'}`);
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:122:    expect(envelope.summary.toLowerCase()).toContain('no');
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:192:  it('C6: Constitutional results counted in summary', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:202:    expect(envelope.summary).toContain('2 constitutional');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:154:    summary: `Queued ingest job ${job.id} (${job.filesTotal} file(s))`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:191:    summary: `Ingest job ${job.id}: ${job.state} (${job.filesProcessed}/${job.filesTotal})`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:221:      summary: `Ingest job ${job.id} is already terminal (${job.state})`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:230:    summary: `Cancelled ingest job ${cancelled.id}`,
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:76:- Script prints a concise progress summary on stdout and exits non-zero on fatal startup failures.
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:323:      summary: 'No matching memories found',
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:425:            // prefix match for composite anchor IDs (e.g. 'summary' matches
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:426:            // 'summary-session-1770903150838-...'). Prefers shortest match to
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:491:  // REQ-019: Build summary based on result characteristics
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:492:  const summary = constitutionalCount > 0
 succeeded in 51ms:
Total output lines: 1034

.opencode/skill/system-spec-kit/mcp_server/context-server.ts:368:                // (not just results) so trace metadata is included in the budget.
.opencode/skill/system-spec-kit/mcp_server/README.md:65:- **Causal graph** traces decision lineage ("Why did we choose JWT?")
.opencode/skill/system-spec-kit/mcp_server/README.md:496:The search subsystem uses a 4-stage pipeline (candidate generation, fusion + signal enrichment, reranking + aggregation, filtering + annotation). Each stage has bounded score mutation rules and an immutability invariant on upstream scores. See `lib/search/README.md` for detailed architecture and per-stage module mapping.
.opencode/skill/system-spec-kit/mcp_server/README.md:568:| **debug**          | 1 hour    | "Stack trace from crash"                |
.opencode/skill/system-spec-kit/mcp_server/README.md:750:| `SPECKIT_SCORE_NORMALIZATION`   | `true`  | Normalize RRF/composite scores to [0,1] |
.opencode/skill/system-spec-kit/mcp_server/README.md:756:| `SPECKIT_RESPONSE_TRACE`        | `false` | Include provenance-rich `scores` / `source` / `trace` response envelopes by default |
.opencode/skill/system-spec-kit/mcp_server/README.md:805:| `working_memory`     | Session-scoped attention scores                                    |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:535:- Causal relationship tools support explicit dependency and provenance tracing
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:83:  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:116:  includeTrace: z.boolean().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:354:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:355:  memory_search: ['query', 'concepts', 'specFolder', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:219:          scores: memoryIds.map(() => 1.0), // trigger matches are binary
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:346:      // AI-WHY: Clamp to [0,1] — retrievability * decay or wmEntry scores
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:52:  includeTrace?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:86:  includeTrace?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:229:/** Arguments for causal drift trace requests. */
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:31:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, limit: { type: 'number', description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Caller-supplied session identifier. If omitted, server generates an ephemeral UUID for this call only (not persisted across requests).' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' } }, required: ['input'] },
 succeeded in 51ms:
Total output lines: 543

.opencode/skill/system-spec-kit/mcp_server/core/README.md:3:description: "Configuration, database-state coordination, and shared runtime guards for the Spec Kit Memory MCP server."
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:490:- `input`: Your query or task description
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:4:// All MCP tool definitions (names, descriptions, input schemas).
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:21:  description: string;
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:30:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 2000.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:31:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, limit: { type: 'number', description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Caller-supplied session identifier. If omitted, server generates an ephemeral UUID for this call only (not persisted across requests).' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:37:  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires either query (string) OR concepts (array of 2-5 strings) for multi-concept AND search. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. Token Budget: 1500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:49:        description: 'Multiple concepts for AND search (requires 2-5 concepts). Results must match ALL concepts.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:51:      specFolder: { type: 'string', description: 'Limit search to a specific spec folder (e.g., "011-spec-kit-memory-upgrade")' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:52:      limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum number of results to return (1-100)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:55:        description: 'Session identifier for working memory and session deduplication (REQ-001). When provided with enableDedup=true, prevents duplicate memories from being returned in the same session (~50% token savings on follow-up queries).'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:60:        description: 'Enable session deduplication (REQ-001). When true and sessionId provided, filters out already-sent memories.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:62:      tier: { type: 'string', description: 'Filter by importance tier (constitutional, critical, important, normal, temporary, deprecated)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:63:      contextType: { type: 'string', description: 'Filter by context type (decision, implementation, research, etc.)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:64:      useDecay: { type: 'boolean', default: true, description: 'Apply temporal decay scoring to results' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:65:      includeContiguity: { type: 'boolean', default: false, description: 'Include adjacent/contiguous memories in results' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:69:        description: 'Include constitutional tier memories at top of results (default: true)'
codex
I’ve finished the broad symbol search and can now see where the implementations really live. I’m running a stricter path audit next so I can flag nonexistent or clearly irrelevant paths separately from accurate descriptions.
exec
/bin/zsh -c "python3 -c \"from pathlib import Path; import re; root=Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public'); feat_dir=root/'.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements'; base=root/'.opencode/skill/system-spec-kit';
for f in sorted(feat_dir.glob('*.md')):
    text=f.read_text(); section=text.split('## Source Files',1)[1] if '## Source Files' in text else ''; paths=re.findall(r'"'`([''^`]+)`'"', section); print(f.name); [print('  %s :: %s' % (p, 'OK' if ((base/p).exists() if (p.startswith('mcp_server/') or p.startswith('shared/')) else (root/p).exists()) else 'MISSING')) for p in paths]\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:
zsh:3: unmatched "
exec
/bin/zsh -c "node -e 'const fs=require(\"fs\"); const path=require(\"path\"); const root=\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public\"; const featDir=path.join(root,\".opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements\"); const base=path.join(root,\".opencode/skill/system-spec-kit\"); const files=fs.readdirSync(featDir).filter(f=>f.endsWith(\".md\")).sort(); for (const file of files){ const text=fs.readFileSync(path.join(featDir,file),\"utf8\"); const idx=text.indexOf(\"## Source Files\"); const section=idx>=0?text.slice(idx):\"\"; const paths=[...section.matchAll(/"'`([''^`]+)`/g)].map(m=>m[1]); console.log(file); for (const p of paths){ const full=(p.startsWith("mcp_server/")||p.startsWith("shared/"))?path.join(base,p):path.join(root,p); console.log(`  ${p} :: ${fs.existsSync(full)?"OK":"MISSING"}`); } }'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
01-dual-scope-memory-auto-surface.md
  mcp_server/configs/cognitive.ts :: OK
  mcp_server/core/config.ts :: OK
  mcp_server/hooks/memory-surface.ts :: OK
  mcp_server/lib/cache/embedding-cache.ts :: OK
  mcp_server/lib/interfaces/vector-store.ts :: OK
  mcp_server/lib/parsing/content-normalizer.ts :: OK
  mcp_server/lib/parsing/trigger-matcher.ts :: OK
  mcp_server/lib/providers/embeddings.ts :: OK
  mcp_server/lib/scoring/interference-scoring.ts :: OK
  mcp_server/lib/search/bm25-index.ts :: OK
  mcp_server/lib/search/retrieval-directives.ts :: OK
  mcp_server/lib/search/vector-index-aliases.ts :: OK
  mcp_server/lib/search/vector-index-mutations.ts :: OK
  mcp_server/lib/search/vector-index-queries.ts :: OK
  mcp_server/lib/search/vector-index-schema.ts :: OK
  mcp_server/lib/search/vector-index-store.ts :: OK
  mcp_server/lib/search/vector-index-types.ts :: OK
  mcp_server/lib/search/vector-index.ts :: OK
  mcp_server/lib/utils/canonical-path.ts :: OK
exec
/bin/zsh -lc "sed -n '240,340p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
  ].filter(Boolean).join(' ');
}

/** Register a callback to be invoked asynchronously after each tool call completes. */
export function registerAfterToolCallback(fn: AfterToolCallback): void {
  afterToolCallbacks.push(fn);
}

/* ---------------------------------------------------------------
   3. SERVER INITIALIZATION
--------------------------------------------------------------- */

const server = new Server(
  { name: 'context-server', version: '1.7.2' },
  { capabilities: { tools: {} } }
);
const serverWithInstructions = server as unknown as { setInstructions?: (instructions: string) => void };

/* ---------------------------------------------------------------
   4. TOOL DEFINITIONS (T303: from tool-schemas.ts)
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Memory Surface
// ---------------------------------------------------------------

// Lib modules
import * as vectorIndex from '../lib/search/vector-index';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import { enrichWithRetrievalDirectives } from '../lib/search/retrieval-directives';

import type { Database } from '@spec-kit/shared/types';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

interface ConstitutionalMemory {
  id: number;
  specFolder: string;
  filePath: string;
  title: string;
 succeeded in 51ms:
// ---------------------------------------------------------------
// TEST: Dual-Scope Memory Auto-Surface Hooks
// ---------------------------------------------------------------
// Covers:
//   - autoSurfaceAtToolDispatch: fires at tool dispatch lifecycle point
//   - autoSurfaceAtCompaction:   fires at session compaction lifecycle point
//   - Token budget constants (4000 max per point)
//   - Config flag disabling both hooks
//   - No regression in existing autoSurfaceMemories behaviour
// ---------------------------------------------------------------

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock transitive DB dependencies before importing the module under test
vi.mock('../lib/search/vector-index', () => ({
  initializeDb: vi.fn(),
  getDb: vi.fn(() => null),
}));

vi.mock('../lib/parsing/trigger-matcher', () => ({
exec
/bin/zsh -lc "sed -n '130,175p' .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,380p' .opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
/* ---------------------------------------------------------------
   5. AUTO-SURFACE MEMORIES
--------------------------------------------------------------- */

async function autoSurfaceMemories(contextHint: string): Promise<AutoSurfaceResult | null> {
  const startTime = Date.now();

  try {
    // Get constitutional memories (always surface)
    const constitutional = await getConstitutionalMemories();

    // Get triggered memories via fast phrase matching
    const triggered = triggerMatcher.matchTriggerPhrases(contextHint, 5);

    const latencyMs = Date.now() - startTime;

    // Only return if we have something to surface
    if (constitutional.length === 0 && triggered.length === 0) {
      return null;
    }
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Retrieval Directives
// ---------------------------------------------------------------
// PI-A4: Constitutional memory as retrieval directives (Sprint 5, deferred from Sprint 4 REC-07)
//
// Adds a `retrieval_directive` metadata field to constitutional-tier memories.
// Directives are formatted as explicit instruction prefixes ("Always surface when:",
// "Prioritize when:") so LLMs receive actionable retrieval guidance alongside the
// memory content.
//
// Design contract:
//   - Pure content transformation only — scoring logic is NOT touched.
//   - extractRetrievalDirective is deterministic and synchronous.
//   - enrichWithRetrievalDirectives is a map over results; it never filters or reorders.

import * as fs from 'fs';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */
 succeeded in 51ms:
// --- TEST: Retrieval Directives ---
// Constitutional memory as retrieval directives
//
// Tests cover:
//   1. Extraction from various constitutional memory content formats
//   2. Directive prefix patterns validated ("Always surface when:", "Prioritize when:")
//   3. Content with no clear rule pattern (title-only fallback)
//   4. Enrichment of result arrays (correct field attachment, no reordering)
//   5. No scoring logic changes (content transformation only)

import { describe, it, expect } from 'vitest';
import {
  extractRetrievalDirective,
  formatDirectiveMetadata,
  enrichWithRetrievalDirectives,
  type RetrievalDirective,
  type ConstitutionalResult,
} from '../lib/search/retrieval-directives';

/* ---------------------------------------------------------------
exec
/bin/zsh -lc "sed -n '1,340p' .opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,140p' .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '385,560p' .opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Spec Folder Hierarchy
// ---------------------------------------------------------------
// Builds a spec folder hierarchy from stored spec_folder paths
// and enables hierarchy-aware retrieval (REQ-S6-006).
//
// Parses folder paths like "02--system-spec-kit/140-hybrid-rag/006-sprint-5"
// into a tree structure where each path segment is a node, allowing child
// folders to discover and retrieve memories from parent/sibling folders.

import type Database from 'better-sqlite3';

// --- 0. HIERARCHY TREE CACHE ---
//
// buildHierarchyTree does a full scan of spec_folder values on every call.
// The hierarchy changes only when new spec folders are created, so we cache
// the result with a TTL. A single cached value per database instance is
// sufficient — no full LRU library needed.

const HIERARCHY_CACHE_TTL_MS = 60_000; // 60 seconds
 succeeded in 51ms:
describe('queryHierarchyMemories', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  it('returns memories from self, parent, and sibling folders', () => {
    insertMemory(db, 1, '003-foo', 'root-memory');
    insertMemory(db, 2, '003-foo/140-bar', 'parent-memory');
    insertMemory(db, 3, '003-foo/140-bar/006-sprint', 'self-memory');
    insertMemory(db, 4, '003-foo/140-bar/007-sprint', 'sibling-memory');

    const results = queryHierarchyMemories(db, '003-foo/140-bar/006-sprint');

    expect(results.length).toBeGreaterThanOrEqual(3);

    const folders = results.map(r => r.spec_folder);
    expect(folders).toContain('003-foo/140-bar/006-sprint');
    expect(folders).toContain('003-foo/140-bar');
exec
/bin/zsh -lc "sed -n '110,140p' .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,620p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '280,330p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
export function isEmbeddingExpansionEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_EMBEDDING_EXPANSION');
}

// -- Indexing and Graph flags --

/**
 * N3-lite: Consolidation engine — contradiction scan, Hebbian strengthening,
 * staleness detection, edge bounds enforcement.
 * Default: TRUE (graduated). Set SPECKIT_CONSOLIDATION=false to disable.
 */
export function isConsolidationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CONSOLIDATION');
}

/**
 * R16: Encoding-intent capture at index time.
 * Records intent metadata (document, code, structured_data) alongside embeddings.
 * Default: TRUE (graduated). Set SPECKIT_ENCODING_INTENT=false to disable.
 */
exec
/bin/zsh -lc "sed -n '530,560p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: N3-lite Consolidation Engine
// ---------------------------------------------------------------
// Lightweight graph maintenance: contradiction scan, Hebbian
// strengthening, staleness detection, edge bounds enforcement.
// Sprint 6a — behind SPECKIT_CONSOLIDATION flag.
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { isConsolidationEnabled } from '../search/search-flags';
import {
  updateEdge,
  getStaleEdges,
  countEdgesForNode,
  MAX_EDGES_PER_NODE,
  MAX_AUTO_STRENGTH,
  MAX_STRENGTH_INCREASE_PER_CYCLE,
  STALENESS_THRESHOLD_DAYS,
  DECAY_STRENGTH_AMOUNT,
  DECAY_PERIOD_DAYS,
 succeeded in 52ms:
    response.causalLinks = result.causalLinks;
    if ((result.causalLinks as Record<string, unknown>).inserted as number > 0) {
      hints.push(`Created ${(result.causalLinks as Record<string, unknown>).inserted} causal graph edge(s)`);
    }
    if ((result.causalLinks as Record<string, unknown>).unresolved_count as number > 0) {
      hints.push(`${(result.causalLinks as Record<string, unknown>).unresolved_count} causal link reference(s) could not be resolved`);
    }
  }

  if (postMutationFeedback) {
    hints.push(...postMutationFeedback.hints);
  } else if (result.status === 'duplicate') {
    hints.push('Duplicate content matched an existing indexed memory, so caches were left unchanged');
  }

  if (result.embeddingStatus === 'success') {
    retryManager.processRetryQueue(2).catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[memory-save] Opportunistic retry failed [requestId=${requestId}]:`, message);
    });
 succeeded in 51ms:
        database.exec('CREATE INDEX IF NOT EXISTS idx_interference_score ON memory_index(interference_score)');
        logger.info('Migration v17: Created interference_score index');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v17 warning (idx_interference_score):', get_error_message(e));
      }
    },

    18: () => {
      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS weight_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            edge_id INTEGER NOT NULL REFERENCES causal_edges(id) ON DELETE CASCADE,
            old_strength REAL NOT NULL,
            new_strength REAL NOT NULL,
            changed_by TEXT DEFAULT 'manual',
            changed_at TEXT DEFAULT (datetime('now')),
            reason TEXT
          )
        `);
exec
/bin/zsh -lc "rg -n \"MAX_EDGES_PER_NODE|MAX_AUTO_STRENGTH|MAX_STRENGTH_INCREASE_PER_CYCLE|STALENESS_THRESHOLD_DAYS|DECAY_STRENGTH_AMOUNT|DECAY_PERIOD_DAYS|updateEdge\\(\" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
 succeeded in 52ms:
42:const MAX_EDGES_PER_NODE = 20;
43:const MAX_AUTO_STRENGTH = 0.5;
44:const MAX_STRENGTH_INCREASE_PER_CYCLE = 0.05;
45:const STALENESS_THRESHOLD_DAYS = 90;
46:const DECAY_STRENGTH_AMOUNT = 0.1;
47:const DECAY_PERIOD_DAYS = 30;
144:  // NFR-R01: Auto edges capped at MAX_AUTO_STRENGTH
146:    ? Math.min(strength, MAX_AUTO_STRENGTH)
157:  // NFR-R01: Edge bounds — reject if node already has MAX_EDGES_PER_NODE auto edges
160:    if (edgeCount >= MAX_EDGES_PER_NODE) {
161:      console.warn(`[causal-edges] Edge bounds: node ${sourceId} has ${edgeCount} edges (max ${MAX_EDGES_PER_NODE}), rejecting auto edge`);
368:function updateEdge(
715:function getStaleEdges(thresholdDays: number = STALENESS_THRESHOLD_DAYS): CausalEdge[] {
740:  MAX_EDGES_PER_NODE,
741:  MAX_AUTO_STRENGTH,
742:  MAX_STRENGTH_INCREASE_PER_CYCLE,
743:  STALENESS_THRESHOLD_DAYS,
744:  DECAY_STRENGTH_AMOUNT,
745:  DECAY_PERIOD_DAYS,
exec
/bin/zsh -lc 'rg -n "rollout-policy|isInRollout|rollout" .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:9:import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:193: * Honors SPECKIT_ROLLOUT_PERCENT global rollout policy.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:203: * Honors SPECKIT_ROLLOUT_PERCENT global rollout policy.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,420p' .opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "summary channel|querySummaryEmbeddings|shouldUseSummaryChannel|memory_summaries|SPECKIT_MEMORY_SUMMARIES|minQualityScore" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-flags.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Memory Summaries
// ---------------------------------------------------------------
// Gated via SPECKIT_MEMORY_SUMMARIES

import type Database from 'better-sqlite3';
import { generateSummary } from './tfidf-summarizer';
import { isMemorySummariesEnabled } from './search-flags';

// ---------------------------------------------------------------------------
// 1. INTERFACES
// ---------------------------------------------------------------------------

interface SummarySearchResult {
  id: number;
  memoryId: number;
  similarity: number;
}

// ---------------------------------------------------------------------------
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Tfidf Summarizer
// ---------------------------------------------------------------
// Pure TypeScript, zero dependencies
// ---------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. INTERFACES
// ---------------------------------------------------------------------------

interface ScoredSentence {
  text: string;
  score: number;
  index: number;
}

// ---------------------------------------------------------------------------
// 2. CONSTANTS
// ---------------------------------------------------------------------------

 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:19:  querySummaryEmbeddings,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:67:    CREATE TABLE memory_summaries (
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:355:    const row = db.prepare('SELECT * FROM memory_summaries WHERE memory_id = ?').get(1) as any;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:383:    const row = db.prepare('SELECT summary_embedding FROM memory_summaries WHERE memory_id = ?').get(1) as any;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:399:    const row = db.prepare('SELECT key_sentences FROM memory_summaries WHERE memory_id = ?').get(1) as any;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:413:    const row = db.prepare('SELECT summary_embedding FROM memory_summaries WHERE memory_id = ?').get(1) as any;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:419:   5. Memory Summaries Storage — querySummaryEmbeddings
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:422:describe('querySummaryEmbeddings', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:442:    const results = querySummaryEmbeddings(db, queryEmb!, 10);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:452:    const results = querySummaryEmbeddings(db, queryEmb, 10);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:464:    const results = querySummaryEmbeddings(db, queryEmb!, 2);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:478:    const results = querySummaryEmbeddings(db, queryEmb!, 10);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:489:    const results = querySummaryEmbeddings(db, queryEmb, 10);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:502:    const results = querySummaryEmbeddings(db, queryEmb!, 10);
exec
/bin/zsh -lc "sed -n '200,320p' .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "generateAndStoreSummary|querySummaryEmbeddings|checkScaleGate|memory_summaries|isMemorySummariesEnabled" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
        type_inference_source: parsed.memoryTypeSource,
        stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
        difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
        file_mtime_ms: fileMtimeMs,
        embedding_status: 'partial',
        quality_score: parsed.qualityScore ?? 0,
        quality_flags: JSON.stringify(parsed.qualityFlags ?? []),
      });

      return { parentId: pid, isUpdate: false };
    }
  });

  const { parentId, isUpdate: existingParentUpdated } = setupParent();
  // Use existingParentUpdated below for mutation ledger (replaces `existing` variable)
  const existing = existingParentUpdated;
  const useSafeSwap = existing;

  // Index BM25 for parent with summary
  if (bm25Index.isBm25Enabled()) {
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:34:// v20: memory_summaries + memory_entities + entity_catalog (R8/R10/S5)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:629:          CREATE TABLE IF NOT EXISTS memory_summaries (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:639:        database.exec('CREATE INDEX IF NOT EXISTS idx_memory_summaries_memory ON memory_summaries(memory_id)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:640:        logger.info('Migration v20: Created memory_summaries table (R8)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:643:          console.warn('[VectorIndex] Migration v20 warning (memory_summaries):', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:12:  isMemorySummariesEnabled,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:16:import { generateAndStoreSummary } from '../../lib/search/memory-summaries';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:84:  if (isMemorySummariesEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:86:      const summaryResult = await generateAndStoreSummary(
 succeeded in 52ms:
// @ts-nocheck
// ---------------------------------------------------------------
// TEST: Memory Summaries (TF-IDF Summarizer + Storage)
// Covers: TF-IDF extractive summarizer and memory summary storage
// ---------------------------------------------------------------

import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';

import {
  computeTfIdf,
  extractKeySentences,
  generateSummary,
  __testables as tfidfTestables,
} from '../lib/search/tfidf-summarizer';

import {
  generateAndStoreSummary,
  querySummaryEmbeddings,
  checkScaleGate,
exec
/bin/zsh -lc 'rg -n "querySummaryEmbeddings|checkScaleGate|isMemorySummariesEnabled|summaryCandidates|summaryResults|minQualityScore|memory_summaries" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '320,430p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,130p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:

 exited 1 in 52ms:

 succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Post Insert
// ---------------------------------------------------------------

import type BetterSqlite3 from 'better-sqlite3';
import type * as memoryParser from '../../lib/parsing/memory-parser';

import * as embeddings from '../../lib/providers/embeddings';
import { processCausalLinks } from '../causal-links-processor';
import {
  isAutoEntitiesEnabled,
  isMemorySummariesEnabled,
  isEntityLinkingEnabled,
} from '../../lib/search/search-flags';
import { extractEntities, filterEntities, storeEntities, updateEntityCatalog } from '../../lib/extraction/entity-extractor';
import { generateAndStoreSummary } from '../../lib/search/memory-summaries';
import { runEntityLinking } from '../../lib/search/entity-linker';
import { toErrorMessage } from '../../utils';

interface CausalLinksResult {
codex
I’m in the integration pass now. A few features look solid at the module level, but I’m checking whether the catalog also captured the real integration points, because several behaviors are implemented across both a core module and the calling pipeline.
exec
/bin/zsh -lc 'rg -n "forceAllChannels|tiered fallback|fallback tier|force all channels|channel reduction" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts .opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/channel.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "includeTrace|SPECKIT_RESPONSE_TRACE|formatSearchResults|scores =|trace =|source =|token-metrics|budgetTruncated" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "SPECKIT_CONTEXT_HEADERS|buildDescriptionTailMap|injectContextualTree|description.json|context headers" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "querySummaryEmbeddings|checkScaleGate|generateAndStoreSummary|memory_summaries|isMemorySummariesEnabled" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:5:import { estimateTokens } from '../../formatters/token-metrics';
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:9:import { estimateTokens } from './token-metrics';
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:104:  budgetTruncated: boolean;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:236:  let budgetTruncated = false;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:264:    if (meta.budgetTruncated === true || meta.truncated === true) {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:265:      budgetTruncated = true;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:297:    budgetTruncated,
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:306:export async function formatSearchResults(
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:314:  includeTrace: boolean = false
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:366:    if (includeTrace) {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:368:      formattedResult.scores = {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:377:      formattedResult.source = {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:386:      formattedResult.trace = extractTrace(rawResult, extraData);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:35:import { formatSearchResults } from '../formatters';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:136:  includeTrace?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:173:      if (typeof source === 'string' && source.trim().length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:179:  if (typeof row.source === 'string' && row.source.trim().length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:185:      if (typeof source === 'string' && source.trim().length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:283:  includeTrace?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:310:  includeTrace = false,
 succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:79:  forceAllChannels?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:146:/** Record of a single degradation event during tiered fallback. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:544:    const activeChannels = options.forceAllChannels
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1041:  // AI-WHY: PI-A2: Delegate to tiered fallback when flag is enabled
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1428:  // TIER 2: Widen search — lower similarity, force all channels
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1440:    forceAllChannels: true,
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:231:  it('T045-13: tiered fallback attaches _degradation as non-enumerable', async () => {
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:8:type InjectContextualTreeInput = Parameters<typeof __testables.injectContextualTree>[0];
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:9:type InjectContextualTreeResult = ReturnType<typeof __testables.injectContextualTree>;
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:33:    const injected = __testables.injectContextualTree(row, cache);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:56:    const injected = __testables.injectContextualTree(row, cache);
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:31: * Per-folder description stored as `description.json` inside each spec folder.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:224:        // AI-WHY: Also check description.json mtime so aggregate cache staleness
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:227:          const descPath = path.join(discoveredFolder.folderPath, 'description.json');
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:233:          // description.json may not exist yet — ignore.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:449:      // Prefer per-folder description.json if fresh
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:548: * Preserves memorySequence and memoryNameHistory from existing description.json.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:583:  // Preserve existing tracking data if description.json already exists
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:602: * Load a PerFolderDescription from `description.json` in the given folder.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:609:  const descPath = path.join(folderPath, 'description.json');
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:623: * Save a PerFolderDescription to `description.json` using atomic write.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:637:  const descPath = path.join(folderPath, 'description.json');
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:644: * Check whether a per-folder description.json is stale.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:645: * Compares description.json mtime vs spec.md mtime.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:646: * Missing description.json = stale.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:649: * @returns true if description.json is missing or older than spec.md.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:652:  const descPath = path.join(folderPath, 'description.json');
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:12:  isMemorySummariesEnabled,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:16:import { generateAndStoreSummary } from '../../lib/search/memory-summaries';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:84:  if (isMemorySummariesEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:86:      const summaryResult = await generateAndStoreSummary(
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:27:  isMemorySummariesEnabled,
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:78:  { flag: 'SPECKIT_MEMORY_SUMMARIES', checker: isMemorySummariesEnabled },
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:95:  isMemorySummariesEnabled: vi.fn(() => false),
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:29:import { generateAndStoreSummary, querySummaryEmbeddings, checkScaleGate } from '../lib/search/memory-summaries';
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:35:  isMemorySummariesEnabled,
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:97:    CREATE TABLE memory_summaries (
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:198:      expect(isMemorySummariesEnabled()).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:211:      expect(isMemorySummariesEnabled()).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:427:      const result = await generateAndStoreSummary(db, 1, content, mockEmbedding);
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:432:      const row = db.prepare('SELECT * FROM memory_summaries WHERE memory_id = 1').get();
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:436:    it('querySummaryEmbeddings returns results', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:442:        `INSERT INTO memory_summaries (memory_id, summary_text, summary_embedding, key_sentences)
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:447:      const results = querySummaryEmbeddings(db, queryEmb, 10);
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:454:    it('checkScaleGate returns false for small databases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:455:      expect(checkScaleGate(db)).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:369:      'DELETE FROM memory_summaries WHERE memory_id = ?',
exec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '500,560p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1400,1450p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '520,560p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Stage1 Candidate Gen
// ---------------------------------------------------------------
// Sprint 5 (R6): 4-Stage Retrieval Pipeline Architecture
// ---------------------------------------------------------------
//
// Responsibility: Execute search channels and collect raw candidate results.
// This stage performs NO scoring modifications — it only retrieves candidates
// from the appropriate search channel based on search type.
//
// Search channels handled:
//   - multi-concept: Generate per-concept embeddings, run multiConceptSearch
//   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
//   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
//                         Suppressed when R15 classifies query as "simple" (mutual exclusion)
//   - hybrid: searchWithFallback → falls back to vector on failure
//   - vector: Direct vectorSearch
//
// Post-channel operations:
//   - Constitutional memory injection (if not already present)
 succeeded in 51ms:
      (r) => r.importance_tier !== 'constitutional'
    );
  }

  // -- Quality Score Filtering ------------------------------------------------

  candidates = filterByMinQualityScore(candidates, qualityThreshold);

  // -- R8: Summary Embedding Channel ---------------------------------------
  // When SPECKIT_MEMORY_SUMMARIES is enabled (default-ON) and scale gate is
  // met (>5000 indexed), run a parallel search on summary embeddings and merge
  // results. Pattern follows R12 embedding expansion: run in parallel, merge
  // + deduplicate by ID.
  if (isMemorySummariesEnabled()) {
    try {
      const db = requireDb();
      if (checkScaleGate(db)) {
        const summaryEmbedding: Float32Array | number[] | null =
          queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));

 succeeded in 52ms:
 * @param query - The search query string.
 * @param embedding - Optional embedding vector for semantic search.
 * @param options - Hybrid search configuration options.
 * @returns Results with _degradation metadata attached as non-enumerable property.
 */
async function searchWithFallbackTiered(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  const degradationEvents: DegradationEvent[] = [];

  // TIER 1: Standard enhanced search
  const tier1Options = { ...options, minSimilarity: options.minSimilarity ?? 0.3 };
  let results = await hybridSearchEnhanced(query, embedding, tier1Options);

  const tier1Trigger = checkDegradation(results);
  if (!tier1Trigger) {
    const limitedTier1 = applyResultLimit(results, options.limit);
    // Tier 1 passed quality thresholds — attach empty degradation metadata
 succeeded in 51ms:
 * Enhanced hybrid search with RRF fusion.
 * All search channels use synchronous better-sqlite3; sequential execution
 * is correct — Promise.all would add overhead without achieving parallelism.
 */
async function hybridSearchEnhanced(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  try {
    const lists: Array<{
      source: string;
      results: Array<{ id: number | string; [key: string]: unknown }>;
      weight?: number;
    }> = [];

    // Sprint 3: Pipeline metadata collector (populated by flag-gated stages)
    const s3meta: Sprint3PipelineMeta = {};

    // AI-WHY: -- Sprint 3 Stage A: Query Classification + Routing (SPECKIT_COMPLEXITY_ROUTER) --
exec
/bin/zsh -lc "rg -n \"generateDocumentEmbedding|generateQueryEmbedding\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib/search | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:199:      const emb = await embeddings.generateQueryEmbedding(concept);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:222:    // to avoid a duplicate generateQueryEmbedding() call.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:224:      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:239:              const variantEmbedding = await embeddings.generateQueryEmbedding(variant);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:323:              embeddings.generateQueryEmbedding(expanded.combinedQuery).then(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:410:      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:474:        cachedEmbedding ?? queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:518:          queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:94:      newEmbedding = await embeddings.generateDocumentEmbedding(embeddingInput);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:47:        embedding = await embeddings.generateDocumentEmbedding(normalizedContent);
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:8:import { generateQueryEmbedding } from '../lib/providers/embeddings';
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:82:    const embedding = await generateQueryEmbedding(query);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:140:              return embeddings.generateDocumentEmbedding(content);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:90:        (text: string) => embeddings.generateQueryEmbedding(text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:593:    const embedding = await embeddings.generateQueryEmbedding(query.trim());
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1394:export { generate_query_embedding as generateQueryEmbedding };
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:256:          chunkEmbedding = await embeddings.generateDocumentEmbedding(normalizeContentForEmbedding(chunk.content));
exec
/bin/zsh -lc "sed -n '1,560p' .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,140p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "entity_catalog|memory_entities|storeEntities|updateEntityCatalog" .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:15:import { extractEntities, filterEntities, storeEntities, updateEntityCatalog } from '../../lib/extraction/entity-extractor';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:73:        const entityResult = storeEntities(database, id, filtered);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:74:        updateEntityCatalog(database, filtered);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:126: * Store extracted entities in the memory_entities table.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:135:export function storeEntities(
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:142:      INSERT OR REPLACE INTO memory_entities
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:159:    console.warn(`[entity-extractor] storeEntities failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:169: * Upsert entities into entity_catalog with alias normalization.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:181:export function updateEntityCatalog(
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:189:      'SELECT id, aliases, memory_count FROM entity_catalog WHERE canonical_name = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:192:      INSERT INTO entity_catalog (canonical_name, aliases, entity_type, memory_count, created_at)
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:196:      UPDATE entity_catalog
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:239:    console.warn(`[entity-extractor] updateEntityCatalog failed: ${msg}`);
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Post Insert
// ---------------------------------------------------------------

import type BetterSqlite3 from 'better-sqlite3';
import type * as memoryParser from '../../lib/parsing/memory-parser';

import * as embeddings from '../../lib/providers/embeddings';
import { processCausalLinks } from '../causal-links-processor';
import {
  isAutoEntitiesEnabled,
  isMemorySummariesEnabled,
  isEntityLinkingEnabled,
} from '../../lib/search/search-flags';
import { extractEntities, filterEntities, storeEntities, updateEntityCatalog } from '../../lib/extraction/entity-extractor';
import { generateAndStoreSummary } from '../../lib/search/memory-summaries';
import { runEntityLinking } from '../../lib/search/entity-linker';
import { toErrorMessage } from '../../utils';

interface CausalLinksResult {
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Entity Linker
// ---------------------------------------------------------------
// Gated via SPECKIT_ENTITY_LINKING
// Creates causal edges between memories sharing entities across spec folders.
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { isEntityLinkingEnabled } from './search-flags';

// ---------------------------------------------------------------------------
// 1. CONSTANTS
// ---------------------------------------------------------------------------

/** Maximum causal edges per node to prevent graph density explosion. */
const MAX_EDGES_PER_NODE = 20;

/** S5 density guard default: skip entity linking when projected density exceeds this threshold. */
const DEFAULT_MAX_EDGE_DENSITY = 1.0;

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1420,1450p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Channel Enforcement
// ---------------------------------------------------------------
// Pipeline-ready wrapper around the channel min-representation check.
// Provides a single enforceChannelRepresentation() entry point for
// use inside the hybrid-search pipeline after RRF/RSF fusion.
//
// Feature flag: SPECKIT_CHANNEL_MIN_REP (default: disabled)
// Delegates core logic to channel-representation.ts.
// ---------------------------------------------------------------

import {
  analyzeChannelRepresentation,
  isChannelMinRepEnabled,
} from './channel-representation';

/* ---------------------------------------------------------------
   1. INTERFACES
   --------------------------------------------------------------- */

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Channel Representation
// ---------------------------------------------------------------
/* --- 1. CONSTANTS --- */

/** Minimum similarity / relevance score for a result to qualify for promotion.
 * AI-WHY: QUALITY_FLOOR changed from 0.2 to 0.005 (Sprint 10, D3). The original 0.2
 * assumed normalized [0,1] scores, but raw RRF scores (~0.01-0.03) never exceeded that
 * threshold, causing channel-representation promotion to silently reject ALL RRF results.
 * The 0.005 floor prevents promoting genuinely irrelevant results while remaining
 * compatible with both raw RRF scores and normalized [0,1] scores. */
export const QUALITY_FLOOR = 0.005;

/** Env-var name for the feature flag. */
const FEATURE_FLAG = 'SPECKIT_CHANNEL_MIN_REP';

/* --- 2. INTERFACES --- */

/** A single item that may appear in a top-k result set. */
interface TopKItem {
 succeeded in 52ms:
    Object.defineProperty(limitedTier1, '_degradation', {
      value: degradationEvents,
      enumerable: false,
      configurable: true,
    });
    return limitedTier1;
  }

  // TIER 2: Widen search — lower similarity, force all channels
  const tier1CountBefore = results.length;

  console.error(`[hybrid-search] Tier 1→2 degradation: ${tier1Trigger.reason} (topScore=${tier1Trigger.topScore.toFixed(3)}, count=${tier1Trigger.resultCount})`);

  const tier2Options: HybridSearchOptions = {
    ...options,
    minSimilarity: 0.1,
    useBm25: true,
    useFts: true,
    useVector: true,
    useGraph: true,
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Test — Search Fallback Tiered
// ---------------------------------------------------------------
// Tests: Feature flag gating, tier progression, structuralSearch,
//        degradation metadata, result merging, R15 invariant

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  searchWithFallback,
  structuralSearch,
  hybridSearchEnhanced,
  __testables,
  init,
  DEGRADATION_QUALITY_THRESHOLD,
  DEGRADATION_MIN_RESULTS,
} from '../lib/search/hybrid-search';
import type { HybridSearchResult, DegradationEvent } from '../lib/search/hybrid-search';
import { isSearchFallbackEnabled } from '../lib/search/search-flags';

exec
/bin/zsh -lc 'rg -n "C138-P0-FB-T2" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:688:  it('C138-P0-FB-T2: tier-2 fallback forces all channels for simple-routed queries', async () => {
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,430p' .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '600,910p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// @ts-nocheck
// ---------------------------------------------------------------
// TEST: MCP RESPONSE ENVELOPE
// ---------------------------------------------------------------

import { describe, it, expect } from 'vitest';

import * as handlers from '../handlers/index';

// ---------------------------------------------------------------
// Helper: Check if a response follows the MCP envelope format
// ---------------------------------------------------------------
function validateMCPEnvelope(result: any): {
  valid: boolean;
  hasContent: boolean;
  hasTypeText: boolean;
  hasTextString: boolean;
  isValidJSON: boolean;
  parsedData: any;
  issues: string[];
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Envelope
// ---------------------------------------------------------------

import { estimateTokens } from '../../formatters/token-metrics';

// ---------------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------------

/**
 * Describes the ResponseMeta shape.
 */
export interface ResponseMeta {
  tool: string;
  tokenCount: number;
  tokenBudget?: number;
  latencyMs?: number;
  cacheHit: boolean;
  isError?: boolean;
 succeeded in 52ms:
    anchors,
    bypassCache: bypassCache = false,
    sessionId,
    enableDedup: enableDedup = true,
    intent: explicitIntent,
    autoDetectIntent: autoDetectIntent = true,
    minState: minState = 'WARM',
    applyStateLimits: applyStateLimits = false,
    rerank = true, // AI-TRACE:C138-P2: Enable reranking by default for better result quality
    applyLengthPenalty: applyLengthPenalty = true,
    trackAccess: trackAccess = false, // AI-TRACE:P3-09: opt-in, off by default
    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
    enableSessionBoost: enableSessionBoost = isSessionBoostEnabled(),
    enableCausalBoost: enableCausalBoost = isCausalBoostEnabled(),
    minQualityScore,
    min_quality_score,
    mode,
    includeTrace: includeTraceArg = false,
  } = args;
  const includeTraceByFlag = process.env.SPECKIT_RESPONSE_TRACE === 'true';
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Search Results Formatter
// ---------------------------------------------------------------

// Node stdlib
import fs from 'fs';

// Internal modules
import { estimateTokens } from './token-metrics';

// Import path security utilities (migrated from shared/utils.js)
import { validateFilePath } from '../lib/utils/path-security';

// Import memory parser for anchor extraction (SK-005)
import * as memoryParser from '../lib/parsing/memory-parser';

// REQ-019: Standardized Response Structure
import {
  createMCPSuccessResponse,
  createMCPEmptyResponse,
exec
/bin/zsh -lc "sed -n '980,1035p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1204,1295p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,140p' .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '176,190p' .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
        });
      }

      // AI-WHY: Preserve Stage 4 trace metadata as explicit result fields so downstream
      // formatters can opt-in to provenance-rich envelopes without relying on
      // non-enumerable array shadow properties.
      if ((s4shadowMeta !== undefined || s4attributionMeta !== undefined || degradationMeta !== undefined) && reranked.length > 0) {
        reranked = reranked.map((row): HybridSearchResult => ({
          ...row,
          traceMetadata: {
            stage4: s4shadowMeta ?? null,
            attribution: s4attributionMeta ?? null,
            degradation: degradationMeta ?? null,
            budgetTruncated: budgeted.truncated,
            budgetLimit: budgetResult.budget,
            // AI-TRACE: CHK-038: Wire queryComplexity from router classification into trace
            queryComplexity: routeResult.tier,
          },
        }));
      }
 succeeded in 52ms:
// AI-WHY: Sprint 9 fix: Memoize description map to avoid rebuilding on every search query.
// Cache invalidates after 60 seconds so folder renames are eventually picked up.
// M5 fix: Return stale cache immediately and refresh asynchronously to avoid
// blocking the search hot path with synchronous filesystem crawls.
let descMapCache: { map: Map<string, string>; timestamp: number } | null = null;
let descMapRefreshing = false;
const DESC_MAP_TTL_MS = 60_000;

function rebuildDescriptionTailMap(): Map<string, string> {
  const descByTail = new Map<string, string>();
  const cache = ensureDescriptionCache(getSpecsBasePaths());
  if (!cache || !Array.isArray(cache.folders)) {
    return descByTail;
  }

  for (const entry of cache.folders) {
    const specFolder = typeof entry.specFolder === 'string' ? entry.specFolder : '';
    const description = typeof entry.description === 'string' ? entry.description : '';
    if (!specFolder || !description) continue;
    const folderParts = specFolder.split('/').filter(Boolean);
 succeeded in 53ms:

/** Whether causal-edge degree-based re-ranking is enabled (SPECKIT_DEGREE_BOOST). */
export function isDegreeBoostEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_DEGREE_BOOST');
}

/**
 * P1-4: Contextual tree headers for Stage 4 result enrichment.
 * Default: TRUE. Set SPECKIT_CONTEXT_HEADERS=false to disable.
 */
export function isContextHeadersEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CONTEXT_HEADERS');
}

/**
 succeeded in 53ms:
// ---------------------------------------------------------------
// TEST: Contextual Tree Headers (Sprint 9 P1-4 / T063-T065)
// ---------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { __testables } from '../lib/search/hybrid-search';

type InjectContextualTreeInput = Parameters<typeof __testables.injectContextualTree>[0];
type InjectContextualTreeResult = ReturnType<typeof __testables.injectContextualTree>;

function getContent(row: InjectContextualTreeResult): string | undefined {
  const content = (row as Record<string, unknown>).content;
  return typeof content === 'string' ? content : undefined;
}

describe('Contextual tree injection', () => {
  it('T063: injects contextual header in expected format', () => {
    const row: InjectContextualTreeInput = {
      id: 1,
      score: 1,
exec
/bin/zsh -lc "rg -n \"includeTrace|scores\\:|trace\\:|source\\:\" .opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:338:      source: 'vector',
exec
/bin/zsh -lc "sed -n '300,350p' .opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    const envelope = parseEnvelope(res);
    const result = envelope.data.results[0];
    expect(result.content).toBe(null);
    expect(typeof result.contentError).toBe('string');
    expect(result.contentError.length).toBeGreaterThan(0);
  });

  it('C15: precomputed chunk content bypasses file read', async () => {
    const mockResults = [{
      id: 51,
      spec_folder: 'specs/010-test',
      file_path: '/nonexistent/path.md',
      title: 'Chunk Parent',
      isChunk: true,
      parentId: 999,
      chunkIndex: 0,
      chunkLabel: 'intro',
      chunkCount: 3,
      contentSource: 'reassembled_chunks',
      precomputedContent: 'Reassembled content from chunks.',
exec
/bin/zsh -lc "sed -n '350,415p' .opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
      false,
      null,
      null,
      null,
      {},
      true,
    );
    const envelope = parseEnvelope(res);
    expect(envelope.data.results[0].trace.channelsUsed).toEqual(expect.arrayContaining(['vector', 'fts', 'trigger']));
    expect(envelope.data.results[0].trace.channelsUsed).not.toContain('graph');
  });
});

/* ==================================================================
   SECTION D: formatAgeString
================================================================== */

describe('formatAgeString', () => {
  it('D1: null returns "never"', () => {
    expect(formatAgeString(null)).toBe('never');
exec
/bin/zsh -lc "sed -n '660,715p' .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    const metrics = hybridSearch.getGraphMetrics();
    expect(metrics.totalQueries).toBeGreaterThanOrEqual(1);
    expect(metrics.graphHits).toBeGreaterThanOrEqual(1);
  });

  it('C138-P0-T5: adaptive graph weight from fusion profile applied', async () => {
    // The graph channel weight should come from the adaptive fusion weights,
    // not the hardcoded 0.5. For 'understand' intent, graphWeight = 0.15
    const results = await hybridSearch.hybridSearchEnhanced('authentication', mockEmbedding, { limit: 10 });
    // Verify results returned (graph was included in fusion)
    expect(results.length).toBeGreaterThan(0);
  });
});

describe('C138-P0: Adaptive Fallback in searchWithFallback', () => {
  it('C138-P0-FB-T1: two-pass fallback tags results with fallbackRetry', async () => {
    // Use a vector search that returns nothing to force fallback scenarios
    const emptyVectorSearch = () => [];
    const mockDb = createMockDb();
    // Init with empty search functions — will rely on FTS/BM25 from mock DB
exec
/bin/zsh -lc "sed -n '715,760p' .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
      await hybridSearch.searchWithFallback('auth', embedding, { limit: 1 });

      expect(graphSearchCallCount).toBeGreaterThanOrEqual(1);
    } finally {
      if (savedFallback === undefined) {
        delete process.env.SPECKIT_SEARCH_FALLBACK;
      } else {
        process.env.SPECKIT_SEARCH_FALLBACK = savedFallback;
      }
      if (savedRouter === undefined) {
        delete process.env.SPECKIT_COMPLEXITY_ROUTER;
      } else {
        process.env.SPECKIT_COMPLEXITY_ROUTER = savedRouter;
      }
    }
  });
});

describe('Sprint 1 Search-Core Fixes (Task #2)', () => {
  const ORIGINAL_ENV = {
Plan update
All nine feature snippets have been checked against the implementation and their listed paths have been validated. I’ve identified the catalog entries with description mismatches, invalid paths, and missing core integration files.
  ✓ Read the 9 feature catalog snippets and extract each Current Reality and Source Files section
  ✓ Inspect the referenced mcp_server implementation files and verify listed paths exist
  ✓ Identify any missing implementation files and produce the required per-feature report
codex
---
FEATURE: 01-dual-scope-memory-auto-surface.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/context-server.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `hooks/memory-surface.ts` matches the described behavior, but the catalog omits the real `context-server.ts` integration path and includes one nonexistent test file.
---
FEATURE: 02-constitutional-memory-as-expert-knowledge-injection.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/hooks/memory-surface.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `retrieval-directives.ts` matches the description; the only meaningful omission is the hook file that actually attaches `retrieval_directive` metadata to surfaced constitutional memories.
---
FEATURE: 03-spec-folder-hierarchy-as-retrieval-structure.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/graph-search-fn.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The hierarchy module matches the writeup, but retrieval integration happens in `graph-search-fn.ts`, which is not listed.
---
FEATURE: 04-lightweight-consolidation.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/save/response-builder.ts, mcp_server/lib/search/vector-index-schema.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Core N3-lite behavior is present, but the catalog overstates save-time execution: code checks consolidation after saves and only runs when the 7-day cadence gate is due. The save hook and `weight_history` schema migration are also omitted.
---
FEATURE: 05-memory-summary-search-channel.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/save/post-insert.ts, mcp_server/lib/search/pipeline/stage1-candidate-gen.ts, mcp_server/lib/search/vector-index-schema.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: TF-IDF summarization is real, but summaries are embedded with `generateQueryEmbedding`, not the full-content document-embedding path, and `querySummaryEmbeddings()` returns summary-hit rows rather than `PipelineRow`s. Stage 1 wrapping/merging lives elsewhere.
---
FEATURE: 06-cross-document-entity-linking.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/save/post-insert.ts, mcp_server/lib/extraction/entity-extractor.ts, mcp_server/lib/search/vector-index-schema.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `entity-linker.ts` matches the described logic, but the catalog misses the R10 population path, the save-time invocation path, and the schema support behind it.
---
FEATURE: 07-tier-2-fallback-channel-forcing.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/hybrid-search.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The described `forceAllChannels` behavior is implemented in `hybrid-search.ts` and verified there; the listed channel-representation files are not the core implementation.
---
FEATURE: 08-provenance-rich-response-envelopes.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/formatters/search-results.ts, mcp_server/handlers/memory-search.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The provenance fields and `includeTrace` behavior are built in the search formatter and wired through `memory_search`; `lib/response/envelope.ts` is only the generic MCP wrapper.
---
FEATURE: 09-contextual-tree-injection.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/lib/search/hybrid-search.ts, mcp_server/lib/search/folder-discovery.ts, mcp_server/lib/search/search-flags.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Header injection, description-cache lookup, and flag gating live in `hybrid-search.ts`/`folder-discovery.ts`/`search-flags.ts`; the catalog omits those core files and includes one nonexistent test path.
---
tokens used
241,146
---
FEATURE: 01-dual-scope-memory-auto-surface.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/context-server.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `hooks/memory-surface.ts` matches the described behavior, but the catalog omits the real `context-server.ts` integration path and includes one nonexistent test file.
---
FEATURE: 02-constitutional-memory-as-expert-knowledge-injection.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/hooks/memory-surface.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `retrieval-directives.ts` matches the description; the only meaningful omission is the hook file that actually attaches `retrieval_directive` metadata to surfaced constitutional memories.
---
FEATURE: 03-spec-folder-hierarchy-as-retrieval-structure.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/graph-search-fn.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The hierarchy module matches the writeup, but retrieval integration happens in `graph-search-fn.ts`, which is not listed.
---
FEATURE: 04-lightweight-consolidation.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/save/response-builder.ts, mcp_server/lib/search/vector-index-schema.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Core N3-lite behavior is present, but the catalog overstates save-time execution: code checks consolidation after saves and only runs when the 7-day cadence gate is due. The save hook and `weight_history` schema migration are also omitted.
---
FEATURE: 05-memory-summary-search-channel.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/save/post-insert.ts, mcp_server/lib/search/pipeline/stage1-candidate-gen.ts, mcp_server/lib/search/vector-index-schema.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: TF-IDF summarization is real, but summaries are embedded with `generateQueryEmbedding`, not the full-content document-embedding path, and `querySummaryEmbeddings()` returns summary-hit rows rather than `PipelineRow`s. Stage 1 wrapping/merging lives elsewhere.
---
FEATURE: 06-cross-document-entity-linking.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/save/post-insert.ts, mcp_server/lib/extraction/entity-extractor.ts, mcp_server/lib/search/vector-index-schema.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `entity-linker.ts` matches the described logic, but the catalog misses the R10 population path, the save-time invocation path, and the schema support behind it.
---
FEATURE: 07-tier-2-fallback-channel-forcing.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/hybrid-search.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The described `forceAllChannels` behavior is implemented in `hybrid-search.ts` and verified there; the listed channel-representation files are not the core implementation.
---
FEATURE: 08-provenance-rich-response-envelopes.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/formatters/search-results.ts, mcp_server/handlers/memory-search.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The provenance fields and `includeTrace` behavior are built in the search formatter and wired through `memory_search`; `lib/response/envelope.ts` is only the generic MCP wrapper.
---
FEATURE: 09-contextual-tree-injection.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/lib/search/hybrid-search.ts, mcp_server/lib/search/folder-discovery.ts, mcp_server/lib/search/search-flags.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Header injection, description-cache lookup, and flag gating live in `hybrid-search.ts`/`folder-discovery.ts`/`search-flags.ts`; the catalog omits those core files and includes one nonexistent test path.
---
