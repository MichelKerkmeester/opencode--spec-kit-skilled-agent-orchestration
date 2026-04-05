OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce97-ed70-7ce3-9975-1b526e478098
--------
user
You are a feature catalog verification agent. Read these specific feature snippet files: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md, /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md, /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md, /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md, /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md, /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md. For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. 

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
mcp: code_mode starting
mcp: spec_kit_memory starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a read-only verification pass: first I’ll load the relevant skill guidance and inspect the six feature snippets, then I’ll cross-check each listed source file under `mcp_server/` against the actual implementation.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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

exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Verify six system-spec-kit feature catalog snippets against actual mcp_server code, checking Current Reality accuracy, path validity, and missing source files" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 695ms:
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !spec, !system-spec-kit(explicit), document~, files~, folder"
  },
  {
    "skill": "sk-code-full-stack",
    "kind": "skill",
    "confidence": 0.94,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !code(multi), !intent:implementation, code(name), files, specification~"
  },
  {
    "skill": "sk-code-opencode",
    "kind": "skill",
codex
Skill routing points to `system-spec-kit`, which fits this verification task, so I’m following that workflow while keeping this read-only. I’m also checking for any deeper `AGENTS.md` files that might govern the feature catalog or `mcp_server` folders before I compare docs to code.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files -g 'AGENTS.md' .opencode ." in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Chunk collapse deduplication

## Current Reality

Duplicate chunk rows appeared in default search mode because the deduplication logic only ran when `includeContent=true`. Most queries use the default `includeContent=false` path, which means most users saw duplicates. The conditional gate was removed so dedup now runs on every search request regardless of content settings. A small fix, but one that affected every standard query.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/chunking/anchor-chunker.ts` | Lib | Anchor-aware chunking |
| `mcp_server/lib/chunking/chunk-thinning.ts` | Lib | Chunk thinning |
| `mcp_server/lib/scoring/mpab-aggregation.ts` | Lib | MPAB chunk aggregation |

### Tests

| File | Focus |
|------|-------|
 succeeded in 52ms:
# Co-activation fan-effect divisor

## Current Reality

Hub memories with many connections dominated co-activation results no matter what you searched for. If a memory had 40 causal edges, it showed up everywhere.

A fan-effect divisor helper (`1 / sqrt(neighbor_count)`) exists in `co-activation.ts`, but Stage 2 hot-path boosting currently applies spread-activation scores directly via the configured co-activation strength multiplier. The guard logic remains in the helper path with bounded division behavior.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |

### Tests

| File | Focus |
|------|-------|
 succeeded in 52ms:
# Graph channel ID fix

## Current Reality

The graph search channel had a 0% hit rate in production. Zero. The system was designed as a multi-channel retrieval engine, but the graph channel contributed nothing because `graph-search-fn.ts` compared string-formatted IDs (`mem:${edgeId}`) against numeric memory IDs at two separate locations.

Both comparison points now extract numeric IDs, and the graph channel returns results for queries where causal edge relationships exist. This was the single highest-impact bug in the system because it meant an entire retrieval signal was dead on arrival.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
| `mcp_server/lib/search/graph-flags.ts` | Lib | Graph feature flags |
| `mcp_server/lib/search/graph-search-fn.ts` | Lib | Graph degree scoring |
| `mcp_server/lib/search/search-types.ts` | Lib | Search type definitions |
 succeeded in 52ms:
# SHA-256 content-hash deduplication

## Current Reality

Before this change, re-saving identical content triggered a full embedding API call every time. That costs money and adds latency for zero value.

An O(1) SHA-256 hash lookup in the `memory_index` table now catches exact duplicates within the same spec folder before the embedding step. When you re-save the same file, the system skips embedding generation entirely. Change one character, and embedding proceeds as normal. No false positives on distinct content because the check is cryptographic, not heuristic.

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/handlers/save/dedup.ts` | Handler | Deduplication logic |
| `mcp_server/handlers/save/types.ts` | Handler | Type definitions |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook |
 succeeded in 52ms:
# Database and schema safety

## Current Reality

Four database-layer bugs were fixed:

**B1 — Reconsolidation column reference:** `reconsolidation.ts` referenced a non-existent `frequency_counter` column that would crash at runtime during merge operations. Replaced with `importance_weight` using `Math.min(1.0, currentWeight + 0.1)` merge logic.

**B2 — DDL inside transaction:** `checkpoints.ts` placed DDL statements (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ADD COLUMN`) inside a `database.transaction()` block. SQLite silently auto-commits on DDL, which corrupted the transaction boundary during checkpoint restore. DDL now runs before `BEGIN`; only DML is wrapped in the transaction.

**B3 — SQL operator precedence:** `causal-edges.ts` had `WHERE a AND b OR c` without parentheses, matching wrong rows on edge deletion. Fixed to `WHERE a AND (b OR c)`.

**B4 — Missing changes guard:** `memory-save.ts` UPDATE statements reported success even when zero rows were updated. Added `.changes > 0` guards so callers can distinguish actual updates from no-ops.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
 succeeded in 51ms:
# Guards and edge cases

## Current Reality

Two guard/edge-case issues were fixed:

**E1 — Temporal contiguity double-counting:** `temporal-contiguity.ts` had an O(N^2) nested loop that processed both (A,B) and (B,A) pairs, double-counting boosts. Fixed inner loop to `j = i + 1`.

**E2 — Wrong-memory fallback:** `extraction-adapter.ts` fell back to resolving the most-recent memory ID on entity resolution failure, silently linking to the wrong memory. The fallback was removed; the function returns `null` on resolution failure.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/errors/core.ts` | Lib | Error type definitions |
| `mcp_server/lib/errors/index.ts` | Lib | Module barrel export |
| `mcp_server/lib/errors/recovery-hints.ts` | Lib | Error recovery hints |

 succeeded in 51ms:
./AGENTS.md
.opencode/specs/03--commands-and-skills/sk-mcp/001-mcp-clickup-creation/context/clickup-cli-main/AGENTS.md
./.opencode/specs/03--commands-and-skills/sk-mcp/001-mcp-clickup-creation/context/clickup-cli-main/AGENTS.md
./.opencode/specs/system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
.opencode/specs/system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
./.opencode/specs/system-spec-kit/024-sqlite-to-turso/context/turso-main/AGENTS.md
.opencode/specs/system-spec-kit/024-sqlite-to-turso/context/turso-main/AGENTS.md
codex
I have the six snippets in hand now. Next I’m locating the real implementation points for each bug/fix so I can tell the difference between “listed path exists” and “this file actually owns the behavior described.”
exec
/bin/zsh -lc 'rg -n "includeContent|dedup|duplicate chunk|collapse" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "mem:|graph channel|graph-search|edgeId|numeric IDs|candidateMemoryIds|memoryIds" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"fan-effect|fan effect|sqrt\\(|neighbor_count|co-activation strength|spread-activation|coactivation|co-activation\" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"temporal-contiguity|extraction-adapter|most-recent memory|most recent memory|returns null|j = i \\+ 1|j=i\\+1|resolution failure\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "SHA-256|SHA256|sha256|content_hash|contentHash|embedding step|embedding generation|duplicate" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"reconsolidation|frequency_counter|importance_weight|CREATE TABLE IF NOT EXISTS|ALTER TABLE ADD COLUMN|database\\.transaction\\(|WHERE .*AND .*OR|\\.changes > 0|changes > 0|causal-edges|memory-save|checkpoint|checkpoints\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:60:  dedupStats: {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:355:    console.warn(`[session-manager] Database not initialized for batch dedup. dbUnavailableMode=${SESSION_CONFIG.dbUnavailableMode}. ${allow ? 'Allowing' : 'Blocking'} batch.`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:665:      dedupStats: { enabled: false, filtered: 0, total: results?.length || 0 },
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:691:    dedupStats: {
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:169:├── session-manager.vitest.ts              # Session deduplication
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:270:├── integration-session-dedup.vitest.ts    # Session dedup integration
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:291:├── content-hash-dedup.vitest.ts          # Content hash deduplication
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:667:| Embedding Cache | `embedding-cache.vitest.ts` | Embedding cache deduplication and hit rates |
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:138:    it('T033.1: -ing suffix removal + double-consonant dedup', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:139:      // AI-WHY: Fix #18 — "running" → "runn" → "run" (doubled consonant collapsed)
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:3:description: "Session management for the Spec Kit Memory MCP server. Handles session deduplication, crash recovery and context persistence."
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:6:  - "session deduplication"
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:12:> Session management for the Spec Kit Memory MCP server. Handles deduplication and crash recovery with context persistence.
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:40:| Token Savings | ~50% | On follow-up queries via deduplication |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:63: session-manager.ts  # Session deduplication, crash recovery, state management (~28KB)
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:71:| `session-manager.ts` | Core session tracking, deduplication, state persistence, CONTINUE_SESSION.md |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:140:const { filtered, dedupStats } = filterSearchResults(sessionId, results);
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:142:console.log(`Filtered ${dedupStats.filtered} duplicates`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:143:console.log(`Token savings: ${dedupStats.tokenSavingsEstimate}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:254:| Session dedup disabled | Check `DISABLE_SESSION_DEDUP` env var |
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:84:    it('T528-5: Missing edgeId for CausalUnlink rejected', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:230:├── graph-search-fn.vitest.ts              # Graph search functions
.opencode/skill/system-spec-kit/mcp_server/tests/degree-computation.vitest.ts:18:} from '../lib/search/graph-search-fn';
.opencode/skill/system-spec-kit/mcp_server/tests/degree-computation.vitest.ts:342:    it('handles numeric IDs by converting to strings', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:46: * When all channels active (baseline): returns memoryIds 1..count (high quality).
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:272:    it('disables graph channel correctly', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:4:// Validates the full search pipeline works with the graph channel
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:111:  it('graph-search-fn exports: createUnifiedGraphSearchFn', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:112:    const mod = await import('../lib/search/graph-search-fn');
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:272:  it('setting SPECKIT_GRAPH_UNIFIED=true enables the graph channel flag', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:16:} from '../lib/search/graph-search-fn';
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:23: * Handles SQL patterns used by the committed graph-search-fn.ts:
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:295:      // Committed computeMaxTypedDegree takes only database (no memoryIds)
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:8:import { clearDegreeCache, computeDegreeScores } from '../lib/search/graph-search-fn';
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:475:    let edgeId: number;
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:479:      edgeId = causalEdges.insertEdge('1', '2', 'caused', 0.5, 'original');
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:483:      const ok = causalEdges.updateEdge(edgeId, { strength: 0.9 });
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:490:      const ok = causalEdges.updateEdge(edgeId, { evidence: 'updated evidence' });
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:497:      const ok = causalEdges.updateEdge(edgeId, { strength: 0.3, evidence: 'both updated' });
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:505:      causalEdges.updateEdge(edgeId, { strength: 5.0 });
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:541:  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:62:    // N = 2, bonus = 0.3 * 0.4 / sqrt(2) = 0.12 / 1.41421356... = 0.08485281...
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:64:    const expected = 0.8 + (0.3 * 0.4) / Math.sqrt(2);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:80:    // N = 10, bonus = 0.3 * 4.45 / sqrt(10) = 1.335 / 3.16227766... = 0.42213203...
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:83:    const expected = 0.9 + (0.3 * sumRemaining) / Math.sqrt(10);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:100:    // N = 3, bonus = 0.3 * 1.0 / sqrt(3) = 0.3 / 1.73205... = 0.17320508...
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:102:    const expected = 0.5 + (0.3 * 1.0) / Math.sqrt(3);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:113:    // N = 3, bonus = 0.3 * 1.2 / sqrt(3) = 0.36 / 1.73205... = 0.20784609...
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:115:    const expected = 0.9 + (0.3 * (0.9 + 0.3)) / Math.sqrt(3);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:231:    const expected = 0.8 + (0.3 * 0.4) / Math.sqrt(2);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:263:    // mem-2 MPAB: 0.5 + 0.3 * 1.5 / sqrt(4) = 0.5 + 0.45/2 = 0.725
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:214:    norm = Math.sqrt(norm);
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:231:  norm = Math.sqrt(norm);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:262:  const denom = Math.sqrt(normA) * Math.sqrt(normB);
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:37:The test suite validates all critical functionality of the Spec Kit Memory MCP server. Tests cover cognitive memory features (attention decay, working memory, co-activation and confidence tracking), tier classification, summary generation, search pipelines, MCP tool handlers and integration scenarios. All tests use **Vitest** as the test framework with `.vitest.ts` file extensions.
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:126:├── co-activation.vitest.ts                # Related memory activation
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:419:| Cognitive | Attention decay, working memory, co-activation, tier classification |
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:611:npx vitest run tests/attention-decay.vitest.ts tests/co-activation.vitest.ts tests/working-memory.vitest.ts tests/tier-classifier.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:657:| Co-Activation | `co-activation.vitest.ts` | Related memory boosting, spreading activation |
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:3:// Converted from: co-activation.test.ts (custom runner)
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:94:import { initExtractionAdapter } from './lib/extraction/extraction-adapter';
.opencode/skill/system-spec-kit/shared/embeddings.ts:545:/** Get current embedding profile (sync - returns null if not initialized) */
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:59:  it('returns null for single-segment path', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:63:  it('returns null for empty string', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:79:  it('returns null for path with leading slash only', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:80:    // "/foo" has lastSlash at 0, so <= 0 guard returns null
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:31: * Delegates to the spec.md file in the same directory (or returns null).
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:189:    it('RF5: Flag OFF means reconsolidate returns null', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:642:    it('RO5: Flag OFF returns null (normal store)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:56:    // Negative quality_score is treated as absent. Without a tier, returns null.
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:236:  it('T15: returns null when row has no signals (no tier, no quality_score, no content)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:243:  it('T15b: returns null for unknown/missing importance_tier with no other signals', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:209:  it('proceeds without rollback metadata when checkpoint creation returns null on non-critical tier', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:257:  it('aborts critical tier bulk delete when checkpoint creation returns null', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:78:  // T015-03: Cache miss returns null for unknown hash
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:80:  it('T015-03: cache miss returns null', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:427:  it('returns null for a missing file', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:432:  it('returns null for malformed JSON content', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:672:  it('returns null for missing spec.md', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:738:  it('returns null for missing description.json', () => {
 succeeded in 51ms:
Total output lines: 644

.opencode/skill/system-spec-kit/shared/chunking.ts:15: * Maximum text length for embedding generation.
.opencode/skill/system-spec-kit/shared/embeddings.ts:68: * Generate SHA256 hash key for cache lookup.
.opencode/skill/system-spec-kit/shared/embeddings.ts:80:  return crypto.createHash('sha256').update(`${providerName}:${text}`).digest('hex').substring(0, 32);
.opencode/skill/system-spec-kit/shared/embeddings.ts:591:  // Core embedding generation
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:63:  content_hash: string | null;
.opencode/skill/system-spec-kit/shared/index.ts:81:  // Core embedding generation
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts:19: * Canonical shared implementation — replaces duplicates in memory-indexer.ts and memory-parser.ts.
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts:32: * Canonical shared implementation — replaces duplicates in memory-indexer.ts and memory-parser.ts.
.opencode/skill/system-spec-kit/mcp_server/README.md:66:- **Session awareness** prevents duplicate context and saves tokens
.opencode/skill/system-spec-kit/mcp_server/README.md:573:Prevents duplicate memories from polluting the index:
.opencode/skill/system-spec-kit/mcp_server/README.md:965:// - variants[] with filePath + contentHash
.opencode/skill/system-spec-kit/shared/types.ts:453: * Previously duplicated across:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:137:    // AI-WHY: Persist mutated content from quality loop; recompute content_hash
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:141:      parsed.contentHash = memoryParser.computeContentHash(parsed.content);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:245:    SELECT id, content_hash FROM memory_index
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:251:  `).get(parsed.specFolder, canonicalFilePath, filePath) as { id: number; content_hash: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:316:        check_duplicates: !force,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:396: * `indexMemoryFile` requires async embedding generation while
 succeeded in 52ms:
Total output lines: 1252

.opencode/skill/system-spec-kit/mcp_server/context-server.ts:64:import * as checkpointsLib from './lib/storage/checkpoints';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:700:  initDbState({ vectorIndex, checkpoints: checkpointsLib, accessTracker, hybridSearch, sessionManager, incrementalIndex });
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:845:    checkpointsLib.init(database);
.opencode/skill/system-spec-kit/shared/normalization.ts:32:  importance_weight: number;
.opencode/skill/system-spec-kit/shared/normalization.ts:125:    importanceWeight: row.importance_weight,
.opencode/skill/system-spec-kit/shared/normalization.ts:170:  if (memory.importanceWeight !== undefined) row.importance_weight = memory.importanceWeight;
.opencode/skill/system-spec-kit/shared/normalization.ts:215:  if (row.importance_weight !== undefined) mem.importanceWeight = row.importance_weight;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:11:import * as checkpoints from '../lib/storage/checkpoints';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:13:import * as causalEdges from '../lib/storage/causal-edges';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:102:  // Create auto-checkpoint before bulk deletion (unless explicitly skipped)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:103:  let checkpointName: string | null = null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:109:      const checkpoint = checkpoints.createCheckpoint({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:113:          reason: `auto-checkpoint before bulk delete of ${affectedCount} "${tier}" memories`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:120:      if (!checkpoint) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:121:        const checkpointError = `Checkpoint creation failed before deleting ${tier} memories`;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:123:          throw new Error(`${checkpointError}. Aborting high-safety bulk delete.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:125:        console.warn(`[memory-bulk-delete] ${checkpointError}. Proceeding without rollback.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:127:        checkpointName = checkpoint.name;
codex
The initial search is already showing a pattern: some snippets look tightly aligned, while others have source-file lists that point to broad surrounding modules instead of the concrete implementation files. I’m drilling into the actual fix sites now so I can call out exactly what is accurate versus merely adjacent.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts | sed -n '130,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts | sed -n '360,410p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts | sed -n '1,130p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '1138,1175p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   130	  if (!sanitized) return [];
   131	
   132	  // AI-WHY: BM25-inspired weights: title(10) highest signal, content(5), triggers(2), folder(1)
   133	  // Find memory IDs matching the query via FTS5, then join to causal_edges
   134	  const rows = (database.prepare(`
   135	    SELECT ce.id, ce.source_id, ce.target_id, ce.relation, ce.strength,
   136	           -bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) AS fts_score
   137	    FROM causal_edges ce
   138	    JOIN memory_fts ON (
   139	      memory_fts.rowid = CAST(ce.source_id AS INTEGER)
   140	      OR memory_fts.rowid = CAST(ce.target_id AS INTEGER)
   141	    )
   142	    WHERE memory_fts MATCH ?
   143	    ORDER BY (ce.strength * (-bm25(memory_fts, 10.0, 5.0, 2.0, 1.0))) DESC
   144	    LIMIT ?
   145	  `) as Database.Statement).all(sanitized, limit) as Array<CausalEdgeRow & { fts_score: number }>;
   146	
   147	  // Return one candidate entry per memory node (source_id and target_id) with
   148	  // numeric IDs matching memory_index.id (INTEGER column) in the hybrid search
   149	  // pipeline (MMR reranking filters with typeof id === 'number').
 succeeded in 52ms:
   360	 *
   361	 * - Excludes constitutional memories (returns 0 to prevent artificial inflation)
   362	 * - Uses in-memory cache for repeated lookups
   363	 * - Computes global max once per batch for normalization
   364	 *
   365	 * @param database  - An open better-sqlite3 Database instance
   366	 * @param memoryIds - Array of memory IDs to compute scores for
   367	 * @returns Map of memoryId (string) to normalized boost score in [0, 0.15]
   368	 */
   369	function computeDegreeScores(
   370	  database: Database.Database,
   371	  memoryIds: Array<string | number>
   372	): Map<string, number> {
   373	  const results = new Map<string, number>();
   374	  if (memoryIds.length === 0) return results;
   375	
   376	  // Identify constitutional memories (excluded from degree boosting)
   377	  const constitutionalIds = new Set<string>();
   378	  try {
   379	    const placeholders = memoryIds.map(() => '?').join(',');
 succeeded in 51ms:
  1138	      source: 'structural',
  1139	      title: (row.title as string) ?? undefined,
  1140	      file_path: row.file_path as string,
  1141	      importance_tier: row.importance_tier as string,
  1142	      spec_folder: row.spec_folder as string,
  1143	    }));
  1144	  } catch (error: unknown) {
  1145	    const msg = error instanceof Error ? error.message : String(error);
  1146	    console.warn(`[hybrid-search] Structural search failed: ${msg}`);
  1147	    return [];
  1148	  }
  1149	}
  1150	
  1151	/**
  1152	 * Normalize result IDs to a canonical key used for deduplication and source tracking.
  1153	 * Handles number-vs-string drift (`42` vs `"42"`) and legacy `mem:42` forms.
  1154	 */
  1155	function canonicalResultId(id: number | string): string {
  1156	  if (typeof id === 'number') {
  1157	    return String(id);
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// TEST: UNIFIED GRAPH SEARCH FUNCTION
     3	// Causal edge channel only
     4	// ---------------------------------------------------------------
     5	
     6	import { describe, it, expect, vi, beforeEach } from 'vitest';
     7	import { createUnifiedGraphSearchFn } from '../lib/search/graph-search-fn';
     8	
     9	const mockAll = vi.fn();
    10	const mockGet = vi.fn();
    11	const mockStatement = { all: mockAll, get: mockGet };
    12	const mockPrepare = vi.fn().mockReturnValue(mockStatement);
    13	const mockDb = {
    14	  prepare: mockPrepare,
    15	} as unknown as import('better-sqlite3').Database;
    16	
    17	function makeCausalRow(
    18	  overrides: Partial<{
    19	    id: string;
    20	    source_id: string;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '648,708p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts | sed -n '100,135p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/degree-computation.vitest.ts | sed -n '332,352p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   648	
   649	    // AI-WHY: Degree channel re-ranks based on causal-edge connectivity.
   650	    // Graduated: default-ON. Set SPECKIT_DEGREE_BOOST=false to disable.
   651	    // Degree channel (T002: 5th RRF channel) — also gated by Sprint 3 routing
   652	    if (activeChannels.has('degree') && db && isDegreeBoostEnabled()) {
   653	      try {
   654	        // Collect all numeric IDs from existing channels
   655	        const allResultIds = new Set<number>();
   656	        for (const list of lists) {
   657	          for (const r of list.results) {
   658	            const id = r.id;
   659	            if (typeof id === 'number') allResultIds.add(id);
   660	          }
   661	        }
   662	
   663	        if (allResultIds.size > 0) {
   664	          const degreeScores = computeDegreeScores(db, Array.from(allResultIds));
   665	
   666	          // Build a ranked list sorted by degree score (highest first)
   667	          const degreeItems: Array<{ id: number; degreeScore: number }> = [];
 succeeded in 52ms:
   100	
   101	  it('hybrid-search exports: init, hybridSearch, hybridSearchEnhanced, searchWithFallback, getGraphMetrics, resetGraphMetrics', async () => {
   102	    const mod = await import('../lib/search/hybrid-search');
   103	    expect(typeof mod.init).toBe('function');
   104	    expect(typeof mod.hybridSearch).toBe('function');
   105	    expect(typeof mod.hybridSearchEnhanced).toBe('function');
   106	    expect(typeof mod.searchWithFallback).toBe('function');
   107	    expect(typeof mod.getGraphMetrics).toBe('function');
   108	    expect(typeof mod.resetGraphMetrics).toBe('function');
   109	  });
   110	
   111	  it('graph-search-fn exports: createUnifiedGraphSearchFn', async () => {
   112	    const mod = await import('../lib/search/graph-search-fn');
   113	    expect(typeof mod.createUnifiedGraphSearchFn).toBe('function');
   114	  });
   115	
   116	  it('graph-flags exports: isGraphUnifiedEnabled', async () => {
   117	    const mod = await import('../lib/search/graph-flags');
   118	    expect(typeof mod.isGraphUnifiedEnabled).toBe('function');
   119	  });
 succeeded in 51ms:
   332	      const scoreOne = scores.get('1');
   333	      const scoreTwo = scores.get('2');
   334	      // Memory 1 has degree ~2.72 (3 edges)
   335	      // Memory 2 has degree: as source 2->3 (enabled, 0.5) = 0.4, as target 1->2 (caused, 1.0) = 1.0 => 1.4
   336	      // Memory 1 should score higher than Memory 2
   337	      expect(scoreOne).toBeDefined();
   338	      expect(scoreTwo).toBeDefined();
   339	      expect(scoreOne!).toBeGreaterThan(scoreTwo!);
   340	    });
   341	
   342	    it('handles numeric IDs by converting to strings', () => {
   343	      const scores = computeDegreeScores(testDb, [1, 2]);
   344	      expect(scores.has('1')).toBe(true);
   345	      expect(scores.has('2')).toBe(true);
   346	    });
   347	  });
   348	
   349	  // -----------------------------------------------------------
   350	  // 8. Edge type weight constants
   351	  // -----------------------------------------------------------
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts | sed -n '112,205p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '170,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"includeContent.*collapseAndReassembleChunkResults|collapseAndReassembleChunkResults\\(|includeContent\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '724,760p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   112	});
   113	
   114	/* ---------------------------------------------------------------
   115	   T002: Chunk Collapse Dedup — G3 Fix
   116	   collapseAndReassembleChunkResults is exported via __testables.
   117	   Tests verify dedup runs regardless of the includeContent flag.
   118	--------------------------------------------------------------- */
   119	describe('T002: Chunk Collapse Dedup (G3)', () => {
   120	  const { collapseAndReassembleChunkResults } = handler.__testables;
   121	
   122	  // Minimal MemorySearchRow-compatible shape used across these tests.
   123	  function makeRow(
   124	    id: number,
   125	    parentId: number | null,
   126	    extra: Partial<ChunkReassemblyInput> = {}
   127	  ): ChunkReassemblyInput {
   128	    return {
   129	      id,
   130	      title: `Memory ${id}`,
   131	      parent_id: parentId,
 succeeded in 51ms:
   170	
   171	  if (Array.isArray(row.sources)) {
   172	    for (const source of row.sources) {
   173	      if (typeof source === 'string' && source.trim().length > 0) {
   174	        channels.add(source.trim());
   175	      }
   176	    }
   177	  }
   178	
   179	  if (typeof row.source === 'string' && row.source.trim().length > 0) {
   180	    channels.add(row.source.trim());
   181	  }
   182	
   183	  if (Array.isArray(row.channelAttribution)) {
   184	    for (const source of row.channelAttribution) {
   185	      if (typeof source === 'string' && source.trim().length > 0) {
   186	        channels.add(source.trim());
   187	      }
   188	    }
   189	  }
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:382:    const prepared = memorySearch.__testables.collapseAndReassembleChunkResults([
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:118:  includeContent?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:274:  includeContent: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:301:  includeContent,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:326:    includeContent,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:376:function collapseAndReassembleChunkResults(results: MemorySearchRow[]): ChunkReassemblyResult {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:599:    includeContent: includeContent = false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:748:    includeContent,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:790:          includeContent,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:876:          includeContent,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:70:  includeContent?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:745:            const collapsed = collapseAndReassembleChunkResults(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:962:        includeContent: options.includeContent ?? false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1580: * @param options - Optional includeContent flag and queryId for overflow logging.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1586:  options?: { includeContent?: boolean; queryId?: string }
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1589:  const includeContent = options?.includeContent ?? false;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1603:  // AI-WHY: Single-result overflow with includeContent: return summary fallback
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1604:  if (sorted.length === 1 && includeContent) {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:117:   Tests verify dedup runs regardless of the includeContent flag.
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:148:    const result = collapseAndReassembleChunkResults([]);
 succeeded in 52ms:
   724	      }
   725	
   726	      const fused = fuseResultsMulti(lists);
   727	
   728	      let fusedHybridResults: HybridSearchResult[] = fused.map(toHybridResult);
   729	      const limit = options.limit || DEFAULT_LIMIT;
   730	
   731	      // AI-WHY: -- Sprint 4 Stage: R1 MPAB chunk-to-memory aggregation (after fusion, before state filter) --
   732	      // When enabled, collapses chunk-level results back to their parent memory
   733	      // documents using MPAB scoring (sMax + 0.3 * sum(remaining) / sqrt(N)). This prevents
   734	      // multiple chunks from the same document dominating the result list.
   735	      // MINOR-1 fix: isMpabEnabled() and isDocscoreAggregationEnabled() check the same env var
   736	      if (isDocscoreAggregationEnabled()) {
   737	        try {
   738	          const chunkResults = fusedHybridResults.filter(
   739	            r => (r as Record<string, unknown>).parentMemoryId != null && (r as Record<string, unknown>).chunkIndex != null
   740	          );
   741	          if (chunkResults.length > 0) {
   742	            const nonChunkResults = fusedHybridResults.filter(
   743	              r => (r as Record<string, unknown>).parentMemoryId == null || (r as Record<string, unknown>).chunkIndex == null
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '720,820p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '360,470p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   360	  return applyRoutingWeights(results as WeightedResult[], routingResult.strategy) as MemorySearchRow[];
   361	}
   362	
   363	function parseNullableInt(value: unknown): number | null {
   364	  if (typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value)) {
   365	    return value;
   366	  }
   367	  if (typeof value === 'string' && value.trim().length > 0) {
   368	    const parsed = Number(value);
   369	    if (Number.isFinite(parsed) && Number.isInteger(parsed)) {
   370	      return parsed;
   371	    }
   372	  }
   373	  return null;
   374	}
   375	
   376	function collapseAndReassembleChunkResults(results: MemorySearchRow[]): ChunkReassemblyResult {
   377	  if (!Array.isArray(results) || results.length === 0) {
   378	    return {
   379	      results: [],
 succeeded in 51ms:
   720	    } else {
   721	      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
   722	    }
   723	  }
   724	
   725	  // AI-TRACE:C136-08: Create retrieval trace at pipeline entry
   726	  const trace = createTrace(
   727	    normalizedQuery || (concepts ? concepts.join(', ') : ''),
   728	    sessionId,
   729	    detectedIntent || undefined
   730	  );
   731	
   732	  // AI-TRACE:T012-T015: Build cache key args
   733	  const cacheArgs = buildCacheArgs({
   734	    normalizedQuery,
   735	    hasValidConcepts,
   736	    concepts,
   737	    specFolder,
   738	    limit,
   739	    mode,
exec
/bin/zsh -lc "rg -n \"collapseAndReassembleChunkResults\\(|__testables\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '1040,1090p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts | sed -n '1,210p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
376:function collapseAndReassembleChunkResults(results: MemorySearchRow[]): ChunkReassemblyResult {
1056:export const __testables = {
 succeeded in 51ms:
  1040	        });
  1041	      }
  1042	    }
  1043	  } catch (error: unknown) { /* eval logging must never break search */ }
  1044	
  1045	  return responseToReturn;
  1046	}
  1047	
  1048	/* ---------------------------------------------------------------
  1049	   11. EXPORTS
  1050	--------------------------------------------------------------- */
  1051	
  1052	export {
  1053	  handleMemorySearch,
  1054	};
  1055	
  1056	export const __testables = {
  1057	  filterByMinQualityScore,
  1058	  resolveQualityThreshold,
  1059	  buildCacheArgs,
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Mpab Aggregation
     3	// ---------------------------------------------------------------
     4	// Multi-Parent Aggregated Bonus (MPAB) for chunk-to-memory score aggregation.
     5	// Pipeline position: after RRF fusion, before state filtering.
     6	// Feature flag: SPECKIT_DOCSCORE_AGGREGATION (default OFF)
     7	
     8	/* --- 1. TYPES --- */
     9	
    10	/**
    11	 * Result of MPAB aggregation for a single parent memory.
    12	 * Contains the aggregated score and metadata about the chunks
    13	 * that contributed to it.
    14	 */
    15	export interface MpabResult {
    16	  /** Unique identifier of the parent memory document. */
    17	  parentMemoryId: number | string;
    18	  /** MPAB-aggregated score: sMax + 0.3 * sum(remaining) / sqrt(N). */
    19	  mpabScore: number;
    20	  /** Number of chunk hits that contributed to this score. */
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server | rg 'co-activation\\.ts"'$|temporal-contiguity'"\\.ts"'$|extraction-adapter'"\\.ts"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts | sed -n '1,130p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '520,565p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts | sed -n '60,110p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
   520	      const { results: boosted, metadata: cbMeta } = causalBoost.applyCausalBoost(results);
   521	      results = boosted as PipelineRow[];
   522	      metadata.causalBoostApplied = cbMeta.applied;
   523	    } catch (err: unknown) {
   524	      const message = err instanceof Error ? err.message : String(err);
   525	      console.warn(`[stage2-fusion] causal boost failed: ${message}`);
   526	    }
   527	  }
   528	
   529	  // -- 2a. Co-activation spreading --
   530	  // Gated behind SPECKIT_COACTIVATION flag. Takes the top-N results as seeds,
   531	  // performs spreading activation traversal, and boosts scores of results that
   532	  // appear in the co-activation graph. Matches V1 hybrid-search behavior.
   533	  if (isCoActivationEnabled()) {
   534	    try {
   535	      const topIds = results
   536	        .slice(0, SPREAD_ACTIVATION_TOP_N)
   537	        .map(r => r.id)
   538	        .filter((id): id is number => typeof id === 'number');
   539	
 succeeded in 50ms:
    60	
    61	    it('maxHops is 2', () => {
    62	      expect(coActivation.CO_ACTIVATION_CONFIG.maxHops).toBe(2);
    63	    });
    64	  });
    65	
    66	  /* -------------------------------------------------------------
    67	     boostScore()
    68	  ---------------------------------------------------------------- */
    69	
    70	  describe('boostScore()', () => {
    71	    // Production signature: boostScore(baseScore, relatedCount, avgSimilarity)
    72	    // R17 fan-effect divisor formula:
    73	    //   raw_boost   = boostFactor * (relatedCount / maxRelated) * (avgSimilarity / 100)
    74	    //   fan_divisor = sqrt(max(1, relatedCount))
    75	    //   boost       = max(0, raw_boost / fan_divisor)
    76	    //   result      = baseScore + boost
    77	
    78	    it('No related memories returns base score', () => {
    79	      expect(coActivation.boostScore(0.5, 0, 80)).toBe(0.5);
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts
 succeeded in 50ms:
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
/bin/zsh -lc "rg -n \"function spreadActivation|activationScore|boostScore\\(|fanDivisor|Math\\.sqrt\\(Math\\.max\\(1, relatedCount\\)\\)\" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts | sed -n '220,335p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts | sed -n '309,352p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   309	describe('T003a: Co-activation sublinear scaling (R17 fan-effect)', () => {
   310	
   311	  it('T003a.1 — doubling relatedCount does NOT double the boost (pure fan-effect)', () => {
   312	    const base = 0.5;
   313	    const sim = 80;
   314	
   315	    const boost2 = boostScore(base, 2, sim) - base;
   316	    const boost4 = boostScore(base, 4, sim) - base;
   317	
   318	    // AI-WHY: Pure fan-effect — more connections dilute each relationship's contribution.
   319	    // Total boost DECREASES as relatedCount increases (1/sqrt(n) decay).
   320	    expect(boost4).toBeLessThan(boost2);
   321	    expect(boost4).toBeGreaterThan(0); // still positive
   322	  });
   323	
   324	  it('T003a.2 — fan-effect decay verified across 5 data points', () => {
   325	    const base = 0.0;
   326	    const sim = 100;
   327	    const counts = [1, 2, 3, 4, 5];
   328	    const boosts = counts.map(c => boostScore(base, c, sim));
 succeeded in 51ms:
42:  activationScore: number;
84:function boostScore(
95:  const fanDivisor = Math.sqrt(Math.max(1, relatedCount));
96:  const boost = Math.max(0, perNeighborBoost / fanDivisor);
288:function spreadActivation(
322:        activationScore: Math.round(current.score * 1000) / 1000,
364:  return results.sort((a, b) => b.activationScore - a.activationScore);
 succeeded in 51ms:
   220	    return 0;
   221	  }
   222	}
   223	
   224	/**
   225	 * Get causally related memories for a given memory ID from the causal_edges table.
   226	 * This surfaces memories connected by causal relationships (caused, enabled, supports, etc.)
   227	 * which may be semantically dissimilar but contextually important.
   228	 */
   229	function getCausalNeighbors(
   230	  memoryId: number,
   231	  limit: number = CO_ACTIVATION_CONFIG.maxRelated
   232	): RelatedMemory[] {
   233	  if (!db) return [];
   234	
   235	  try {
   236	    const memIdStr = String(memoryId);
   237	    const rows = (db.prepare(`
   238	      SELECT
   239	        CASE WHEN ce.source_id = ? THEN CAST(ce.target_id AS INTEGER)
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts | sed -n '334,370p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '900,925p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   900	      // C138: Co-activation spreading — enrich with temporal neighbors
   901	      const topIds = reranked
   902	        .slice(0, SPREAD_ACTIVATION_TOP_N)
   903	        .map(r => r.id)
   904	        .filter((id): id is number => typeof id === 'number');
   905	      if (topIds.length > 0) {
   906	        try {
   907	          const spreadResults: SpreadResult[] = spreadActivation(topIds);
   908	          // Boost scores of results that appear in co-activation graph
   909	          if (spreadResults.length > 0) {
   910	            const spreadMap = new Map(spreadResults.map(sr => [sr.id, sr.activationScore]));
   911	            for (const result of reranked) {
   912	              const boost = spreadMap.get(result.id as number);
   913	              if (boost !== undefined) {
   914	                (result as Record<string, unknown>).score =
   915	                  ((result.score as number) ?? 0) + boost * CO_ACTIVATION_CONFIG.boostFactor;
   916	              }
   917	            }
   918	          }
   919	          // AI-TRACE: P1-2 FIX: Re-sort after co-activation boost to ensure boosted results
 succeeded in 51ms:
   334	    // Deduplicate by ID, keeping the higher similarity score
   335	    const neighborMap = new Map<number, RelatedMemory>();
   336	    for (const rel of similarityNeighbors) {
   337	      neighborMap.set(rel.id, rel);
   338	    }
   339	    for (const rel of causalNeighbors) {
   340	      const existing = neighborMap.get(rel.id);
   341	      if (!existing || rel.similarity > existing.similarity) {
   342	        neighborMap.set(rel.id, rel);
   343	      }
   344	    }
   345	
   346	    for (const rel of neighborMap.values()) {
   347	      if (visited.has(rel.id)) continue;
   348	
   349	      const decayedScore = current.score * CO_ACTIVATION_CONFIG.decayPerHop * (rel.similarity / 100);
   350	      if (decayedScore < 0.01) continue;
   351	
   352	      queue.push({
   353	        id: rel.id,
codex
I’ve confirmed one important nuance already: the co-activation snippet’s narrative matches the code, but its source list is incomplete because the “Stage 2 hot path” it mentions lives in pipeline files that aren’t listed. I’m doing the same implementation-vs-list check for the remaining three heavier features now.
exec
/bin/zsh -lc 'test -e .opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts && echo exists || echo missing' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '220,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts | sed -n '796,810p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts | sed -n '1,185p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts | sed -n '1,90p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
exists
 succeeded in 51ms:
   220	        };
   221	      }
   222	
   223	      if (qualityGateResult.wouldReject) {
   224	        console.warn(`[memory-save] TM-04: Quality gate WARN-ONLY for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
   225	      }
   226	    } catch (qgErr: unknown) {
   227	      const message = qgErr instanceof Error ? qgErr.message : String(qgErr);
   228	      console.warn(`[memory-save] TM-04: Quality gate error (proceeding with save): ${message}`);
   229	      // AI-GUARD: Quality gate errors must not block saves
   230	    }
   231	  }
   232	
   233	  // PE GATING
   234	  const peResult = evaluateAndApplyPeDecision(
   235	    database, parsed, embedding, force, validation.warnings, embeddingStatus, filePath,
   236	  );
   237	  if (peResult.earlyReturn) return peResult.earlyReturn;
   238	
   239	  // -- Sprint 4: TM-06 Reconsolidation-on-Save --
exec
/bin/zsh -lc "rg -n \"checkContentHashDedup|content_hash.*spec_folder|duplicate content|embedding.*skip|status === 'duplicate'|content-hash dedup\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   796	      database.exec(`ALTER TABLE memory_index ADD COLUMN context_type TEXT DEFAULT 'general'`);
   797	      console.warn('[vector-index] Migration: Added context_type column');
   798	    } catch (e: unknown) {
   799	      if (!get_error_message(e).includes('duplicate column')) throw e;
   800	    }
   801	  }
   802	
   803	  if (!column_names.includes('content_hash')) {
   804	    try {
   805	      database.exec(`ALTER TABLE memory_index ADD COLUMN content_hash TEXT`);
   806	      console.warn('[vector-index] Migration: Added content_hash column');
   807	    } catch (e: unknown) {
   808	      if (!get_error_message(e).includes('duplicate column')) throw e;
   809	    }
   810	  }
 succeeded in 50ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Test — SHA256 Content-Hash Dedup (TM-02)
     3	// ---------------------------------------------------------------
     4	// Verifies that the fast-path dedup check in indexMemoryFile()
     5	// returns 'duplicate' for identical content (same spec_folder,
     6	// same content_hash) and proceeds to embed for changed content.
     7	
     8	import { describe, it, expect, beforeAll, afterAll } from 'vitest';
     9	import Database from 'better-sqlite3';
    10	import * as path from 'path';
    11	import * as os from 'os';
    12	import * as fs from 'fs';
    13	import * as crypto from 'crypto';
    14	
    15	/* -------------------------------------------------------------
    16	   HELPERS
    17	---------------------------------------------------------------- */
    18	
    19	function sha256(content: string): string {
    20	  return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
 succeeded in 50ms:
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
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:398:        ? 'SELECT id, file_path FROM memory_index WHERE content_hash = ? AND spec_folder = ? LIMIT 1'
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:401:      const paramsArray: unknown[] = spec_folder ? [content_hash, spec_folder] : [content_hash];
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:43:export function checkContentHashDedup(
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:214:    message: result.message ?? (result.status === 'duplicate' ? 'Memory skipped (duplicate content)' : `Memory ${result.status} successfully`),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:291:  } else if (result.status === 'duplicate') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:116:          SELECT id, content_hash, spec_folder, file_path
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:251:        SELECT file_path, content_hash, spec_folder
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:835:      "query": "memory_save keeps failing with duplicate content hash error",
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:25: * needed for the content-hash dedup check.
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:56:function checkContentHashDedup(
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:111:      const result = checkContentHashDedup(db, 'specs/test-folder', hash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:120:      const result = checkContentHashDedup(db, 'specs/test-folder', hash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:125:      const content = 'This is duplicate content saved under two different paths.';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:138:      const result = checkContentHashDedup(db, 'specs/dedup-test', hash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:164:      const result = checkContentHashDedup(db, 'specs/changed-content', modifiedHash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:178:      const result = checkContentHashDedup(db, 'specs/pending-test', hash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:190:      const result = checkContentHashDedup(db, folder, hash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:247:      const result = checkContentHashDedup(db, folder, hash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:265:      const result = checkContentHashDedup(db, folder, hash);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:381:        } else if (result.status === 'duplicate') {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '50,190p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts | sed -n '1,170p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts | sed -n '200,310p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Dedup
     3	// ---------------------------------------------------------------
     4	
     5	import type Database from 'better-sqlite3';
     6	
     7	import type { ParsedMemory } from '../../lib/parsing/memory-parser';
     8	import type { IndexResult } from './types';
     9	
    10	export function checkExistingRow(
    11	  database: Database.Database,
    12	  parsed: ParsedMemory,
    13	  canonicalFilePath: string,
    14	  filePath: string,
    15	  force: boolean,
    16	  warnings: string[] | undefined,
    17	): IndexResult | null {
    18	  const existing = database.prepare(`
    19	    SELECT id, content_hash FROM memory_index
    20	    WHERE spec_folder = ?
 succeeded in 52ms:
    50	} from './quality-loop';
    51	
    52	// Save pipeline modules (CR-P2-4 decomposition)
    53	import type {
    54	  IndexResult,
    55	  SaveArgs,
    56	  AtomicSaveParams,
    57	  AtomicSaveOptions,
    58	  AtomicSaveResult,
    59	} from './save';
    60	import { applyPostInsertMetadata } from './save/db-helpers';
    61	import { checkExistingRow, checkContentHashDedup } from './save/dedup';
    62	import { generateOrCacheEmbedding } from './save/embedding-pipeline';
    63	import { evaluateAndApplyPeDecision } from './save/pe-orchestration';
    64	import { runReconsolidationIfEnabled } from './save/reconsolidation-bridge';
    65	import { createMemoryRecord } from './save/create-record';
    66	import { runPostInsertEnrichment } from './save/post-insert';
    67	import { buildIndexResult, buildSaveResponse } from './save/response-builder';
    68	
    69	// Re-exports used by other modules
 succeeded in 51ms:
   200	    }
   201	    postMutationFeedback = buildMutationHookFeedback('save', postMutationHooks);
   202	  }
   203	
   204	  const response: Record<string, unknown> = {
   205	    status: result.status,
   206	    id: result.id,
   207	    specFolder: result.specFolder,
   208	    title: result.title,
   209	    triggerPhrases: result.triggerPhrases,
   210	    contextType: result.contextType,
   211	    importanceTier: result.importanceTier,
   212	    qualityScore: result.qualityScore,
   213	    qualityFlags: result.qualityFlags,
   214	    message: result.message ?? (result.status === 'duplicate' ? 'Memory skipped (duplicate content)' : `Memory ${result.status} successfully`),
   215	  };
   216	  if (postMutationFeedback) {
   217	    response.postMutationHooks = postMutationFeedback.data;
   218	  }
   219	
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts | sed -n '170,235p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '430,455p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"frequency_counter|importance_weight|Math\\.min\\(1\\.0, currentWeight \\+ 0\\.1\\)\" .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts .opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts | sed -n '560,720p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"database\\.transaction\\(|CREATE TABLE IF NOT EXISTS checkpoints|ALTER TABLE checkpoints ADD COLUMN|ensureCheckpointsTable|ensureCheckpointColumns\" .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts .opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"WHERE .*AND \\(.*OR.*\\)|WHERE .*AND .*OR .*|deleteEdge\\(|changes > 0|\\.changes > 0\" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts .opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   430	    const msg = error instanceof Error ? error.message : String(error);
   431	    console.warn(`[causal-edges] updateEdge error: ${msg}`);
   432	    return false;
   433	  }
   434	}
   435	
   436	function deleteEdge(edgeId: number): boolean {
   437	  if (!db) return false;
   438	
   439	  try {
   440	    const result = (db.prepare(
   441	      'DELETE FROM causal_edges WHERE id = ?'
   442	    ) as Database.Statement).run(edgeId);
   443	    if ((result as { changes: number }).changes > 0) {
   444	      invalidateDegreeCache();
   445	    }
   446	    return (result as { changes: number }).changes > 0;
   447	  } catch (error: unknown) {
   448	    const msg = error instanceof Error ? error.message : String(error);
   449	    console.warn(`[causal-edges] deleteEdge error: ${msg}`);
 succeeded in 51ms:
   170	  return 'complement';
   171	}
   172	
   173	/* ---------------------------------------------------------------
   174	   6. MERGE OPERATION
   175	   --------------------------------------------------------------- */
   176	
   177	/**
   178	 * Merge a new memory into an existing one (similarity >= 0.88).
   179	 *
   180	 * Combines content by appending new unique sections to the existing
   181	 * memory, boosts the importance_weight, and updates the embedding
   182	 * to reflect the merged content.
   183	 *
   184	 * @param existingMemory - The existing memory to merge into
   185	 * @param newMemory - The new memory being saved
   186	 * @param db - The database instance
   187	 * @param generateEmbedding - Optional callback to regenerate embedding for merged content
   188	 * @returns MergeResult with merge details
   189	 */
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:10://   boost importance_weight)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:38:  importance_weight?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:181: * memory, boosts the importance_weight, and updates the embedding
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:202:  // Boost importance_weight on merge (capped at 1.0)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:203:  const currentWeight = existingMemory.importance_weight ?? 0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:204:  const boostedWeight = Math.min(1.0, currentWeight + 0.1);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:229:            importance_weight = ?,
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:71:    importance_weight: 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:91:        importance_weight REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:340:    it('MP1: Merges content and boosts importance_weight', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:343:        INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, importance_weight, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:350:        importance_weight: 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:364:      const row = testDb.prepare('SELECT content_text, importance_weight FROM memory_index WHERE id = 100').get();
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:365:      expect(row.importance_weight).toBeCloseTo(0.6);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:370:    it('MP2: importance_weight defaults to 0.5 if not present', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:372:        INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, importance_weight, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:379:        importance_weight: undefined,
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:557:        INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, importance_weight, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:562:        makeSimilarMemory({ id: 400, similarity: 0.90, content_text: 'Existing content', importance_weight: 0.5 }),
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:659:        INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, importance_weight, created_at, updated_at)
 succeeded in 50ms:
   560	
   561	    return (row as CheckpointEntry) || null;
   562	  } catch (error: unknown) {
   563	    const msg = toErrorMessage(error);
   564	    console.warn(`[checkpoints] getCheckpoint error: ${msg}`);
   565	    return null;
   566	  }
   567	}
   568	
   569	function restoreCheckpoint(nameOrId: string | number, clearExisting: boolean = false): RestoreResult {
   570	  const database = getDatabase();
   571	  const result: RestoreResult = { restored: 0, skipped: 0, errors: [], workingMemoryRestored: 0 };
   572	
   573	  try {
   574	    const checkpoint = getCheckpoint(nameOrId);
   575	    if (!checkpoint || !checkpoint.memory_snapshot) {
   576	      result.errors.push('Checkpoint not found or empty');
   577	      return result;
   578	    }
   579	
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:48:    CREATE TABLE IF NOT EXISTS checkpoints (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:260:        CREATE TABLE IF NOT EXISTS checkpoints (
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:393:    const checkpointInfo = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:700:    const restoreTx = database.transaction(() => {
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:532:      const ok = causalEdges.deleteEdge(edgeId);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:538:      causalEdges.deleteEdge(edgeId);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:544:      const ok = causalEdges.deleteEdge(99999);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:411:      const changed = (result as { changes: number }).changes > 0;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:436:function deleteEdge(edgeId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:443:    if ((result as { changes: number }).changes > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:446:    return (result as { changes: number }).changes > 0;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:462:    if ((result as { changes: number }).changes > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:533:        if (deleteEdge(edge.id)) deleted++;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:672:      return (result as { changes: number }).changes > 0;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '454,470p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts | sed -n '230,275p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"source_id = \\? AND \\(target_id = \\? OR source_id = \\?\\)|WHERE .*\\(.*OR.*\\)\" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts .opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"changes > 0|updated_at = datetime\\('now'\\)|UPDATE memory_index|return .*changes\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
   230	
   231	  vectorIndex.updateMemory({
   232	    id: memoryId,
   233	    title: parsed.title ?? undefined,
   234	    triggerPhrases: parsed.triggerPhrases,
   235	    importanceWeight,
   236	    embedding: embedding,
   237	    encodingIntent: isEncodingIntentEnabled() ? classifyEncodingIntent(parsed.content) : undefined,
   238	    documentType: parsed.documentType || 'memory',
   239	    specLevel,
   240	    contentText: parsed.content,
   241	    qualityScore: parsed.qualityScore,
   242	    qualityFlags: parsed.qualityFlags,
   243	  });
   244	
   245	  const fileMetadata = incrementalIndex.getFileMetadata(parsed.filePath);
   246	  const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;
   247	
   248	  const updateResult = database.prepare(`
   249	    UPDATE memory_index
 succeeded in 53ms:
   454	function deleteEdgesForMemory(memoryId: string): number {
   455	  if (!db) return 0;
   456	
   457	  try {
   458	    const result = (db.prepare(`
   459	      DELETE FROM causal_edges
   460	      WHERE source_id = ? OR target_id = ?
   461	    `) as Database.Statement).run(memoryId, memoryId);
   462	    if ((result as { changes: number }).changes > 0) {
   463	      invalidateDegreeCache();
   464	    }
   465	    return (result as { changes: number }).changes;
   466	  } catch (error: unknown) {
   467	    const msg = error instanceof Error ? error.message : String(error);
   468	    console.warn(`[causal-edges] deleteEdgesForMemory error: ${msg}`);
   469	    return 0;
   470	  }
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:165:      UPDATE memory_index
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:171:          updated_at = datetime('now')
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:201:      UPDATE memory_index
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:203:          updated_at = datetime('now')
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:249:    UPDATE memory_index
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:256:        updated_at = datetime('now'),
 exited 1 in 52ms:

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts | sed -n '275,305p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"if \\(updateResult\\.changes === 0\\)|if \\(.*changes.*=== 0\\)|return .*updateResult\\.changes\" .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "REINFORCE|SUPERSEDE|unchanged|duplicate|changes === 0" .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   275	    memoryId
   276	  );
   277	
   278	  if ((updateResult as { changes: number }).changes === 0) {
   279	    return {
   280	      status: 'error',
   281	      id: memoryId,
   282	      specFolder: parsed.specFolder,
   283	      title: parsed.title,
   284	      error: `Memory ${memoryId} not found in memory_index, update had no effect`,
   285	    };
   286	  }
   287	
   288	  return {
   289	    status: 'updated',
   290	    id: memoryId,
   291	    specFolder: parsed.specFolder,
   292	    title: parsed.title,
   293	    triggerPhrases: parsed.triggerPhrases,
   294	    contextType: parsed.contextType,
 succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:175:    if ((updateResult as { changes: number }).changes === 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:207:    if ((result as { changes: number }).changes === 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:278:  if ((updateResult as { changes: number }).changes === 0) {
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:294:  it('leaves properly closed anchors unchanged', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:37:      const validActions = ['CREATE', 'UPDATE', 'REINFORCE', 'SUPERSEDE', 'CREATE_LINKED'];
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:59:    it('T511: Near-duplicate (sim=0.97) NOT created as new', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:63:    it('T512: Near-duplicate triggers REINFORCE action', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:67:    it('T513: Exact duplicate (sim=1.0) returns REINFORCE', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:83:    it('T517: REINFORCE includes candidate reference', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:87:    it('T518: REINFORCE includes similarity in reason', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:91:    it('T519: REINFORCE action count trackable', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:105:    it('T522: Contradiction triggers SUPERSEDE action', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:133:    it('T529: SUPERSEDE includes contradiction details', () => {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '100,170p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '520,545p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "WHERE .* OR .*|AND .* OR .*|OR .*AND" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"operator precedence|parentheses|delete wrong rows|deleteEdge\\(|deleteEdgesForMemory\" .opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
460:      WHERE source_id = ? OR target_id = ?
694:      WHERE source_id = ? OR target_id = ?
721:         OR (last_accessed IS NOT NULL AND last_accessed < datetime('now', '-' || ? || ' days'))
 succeeded in 52ms:
   520	    return [];
   521	  }
   522	}
   523	
   524	// AI-WHY: Fix #28 (017-refinement-phase-6) — Automated orphan edge cleanup
   525	function cleanupOrphanedEdges(): { deleted: number } {
   526	  if (!db) return { deleted: 0 };
   527	  try {
   528	    const orphaned = findOrphanedEdges();
   529	    let deleted = 0;
   530	    // AI: Fix F20 — wrap multi-step mutation in transaction for atomicity.
   531	    const runInTransaction = db.transaction(() => {
   532	      for (const edge of orphaned) {
   533	        if (deleteEdge(edge.id)) deleted++;
   534	      }
   535	    });
   536	    runInTransaction();
   537	    return { deleted };
   538	  } catch (error: unknown) {
   539	    const msg = error instanceof Error ? error.message : String(error);
 succeeded in 52ms:
   100	    clearDegreeCache();
   101	  } catch (_error: unknown) {
   102	    // AI-GUARD: cache invalidation is best-effort; never block edge mutations
   103	  }
   104	}
   105	
   106	/* -------------------------------------------------------------
   107	   4. INITIALIZATION
   108	----------------------------------------------------------------*/
   109	
   110	function init(database: Database.Database): void {
   111	  db = database;
   112	
   113	  // AI-TRACE: A4-P2-2: Defensive traversal indexes — the canonical creation lives in
   114	  // vector-index-impl.ts migration v8 (CHK-062).  These IF NOT EXISTS guards
   115	  // ensure the indexes are present even when the module is initialised outside
   116	  // the normal migration path (e.g. tests, standalone scripts).
   117	  try {
   118	    database.exec('CREATE INDEX IF NOT EXISTS idx_causal_source ON causal_edges(source_id)');
   119	    database.exec('CREATE INDEX IF NOT EXISTS idx_causal_target ON causal_edges(target_id)');
 succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:19://         deleteEdge, deleteEdgesForMemory, getGraphStats,
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:532:      const ok = causalEdges.deleteEdge(edgeId);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:538:      causalEdges.deleteEdge(edgeId);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:544:      const ok = causalEdges.deleteEdge(99999);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:550:     deleteEdgesForMemory
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:553:  describe('deleteEdgesForMemory', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:554:    it('DM1: deleteEdgesForMemory removes 3 edges', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:562:      const count = causalEdges.deleteEdgesForMemory('2');
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:573:      causalEdges.deleteEdgesForMemory('2');
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:581:      const count = causalEdges.deleteEdgesForMemory('999');
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:604:    it('DC2: deleteEdgesForMemory invalidates cached degree scores', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:608:      const deleted = causalEdges.deleteEdgesForMemory('1');
.opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts:131:      const deleted = causalEdges.deleteEdge(deleteTarget);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts:218:      const deleted = causalEdges.deleteEdge(edgeIdToDelete);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts:226:      causalEdges.deleteEdge(edgeIdToDelete);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '170,230p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "source_id.*target_id|target_id.*source_id|DELETE FROM causal_edges|SELECT .*causal_edges" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '680,730p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
   170	    const rowId = database.transaction(() => {
   171	      // AI-WHY: Check if edge exists (for weight_history logging on conflict update).
   172	      // This SELECT is intentional: we need the old strength to decide whether
   173	      // to write a weight_history row after the upsert. The subsequent INSERT
   174	      // uses last_insert_rowid() to avoid a second post-upsert SELECT.
   175	      const existing = (database.prepare(`
   176	        SELECT id, strength FROM causal_edges
   177	        WHERE source_id = ? AND target_id = ? AND relation = ?
   178	      `) as Database.Statement).get(sourceId, targetId, relation) as { id: number; strength: number } | undefined;
   179	
   180	      (database.prepare(`
   181	        INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence, created_by)
   182	        VALUES (?, ?, ?, ?, ?, ?)
   183	        ON CONFLICT(source_id, target_id, relation) DO UPDATE SET
   184	          strength = excluded.strength,
   185	          evidence = COALESCE(excluded.evidence, causal_edges.evidence)
   186	      `) as Database.Statement).run(sourceId, targetId, relation, clampedStrength, evidence, createdBy);
   187	
   188	      const row = (database.prepare(`
   189	        SELECT id FROM causal_edges WHERE source_id = ? AND target_id = ? AND relation = ?
 succeeded in 51ms:
176:        SELECT id, strength FROM causal_edges
177:        WHERE source_id = ? AND target_id = ? AND relation = ?
181:        INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence, created_by)
183:        ON CONFLICT(source_id, target_id, relation) DO UPDATE SET
189:        SELECT id FROM causal_edges WHERE source_id = ? AND target_id = ? AND relation = ?
262:      SELECT * FROM causal_edges
279:      SELECT * FROM causal_edges
296:      SELECT * FROM causal_edges
337:      const nextId = direction === 'forward' ? edge.target_id : edge.source_id;
400:          'SELECT strength FROM causal_edges WHERE id = ?'
441:      'DELETE FROM causal_edges WHERE id = ?'
459:      DELETE FROM causal_edges
460:      WHERE source_id = ? OR target_id = ?
483:    const total = (db.prepare('SELECT COUNT(*) as count FROM causal_edges') as Database.Statement).get() as { count: number };
484:    const byRelation = (db.prepare('SELECT relation, COUNT(*) as count FROM causal_edges GROUP BY relation') as Database.Statement).all() as Array<{ relation: string; count: number }>;
485:    const avgStrength = (db.prepare('SELECT AVG(strength) as avg FROM causal_edges') as Database.Statement).get() as { avg: number | null };
486:    const sources = (db.prepare('SELECT COUNT(DISTINCT source_id) as count FROM causal_edges') as Database.Statement).get() as { count: number };
487:    const targets = (db.prepare('SELECT COUNT(DISTINCT target_id) as count FROM causal_edges') as Database.Statement).get() as { count: number };
513:      SELECT ce.* FROM causal_edges ce
640:        'SELECT strength FROM causal_edges WHERE id = ?'
 succeeded in 51ms:
   680	    console.warn(`[causal-edges] rollbackWeights error: ${msg}`);
   681	    return false;
   682	  }
   683	}
   684	
   685	/* -------------------------------------------------------------
   686	   11. EDGE BOUNDS & COUNTING (N3-lite NFR-R01)
   687	----------------------------------------------------------------*/
   688	
   689	function countEdgesForNode(nodeId: string): number {
   690	  if (!db) return 0;
   691	  try {
   692	    const row = (db.prepare(`
   693	      SELECT COUNT(*) as count FROM causal_edges
   694	      WHERE source_id = ? OR target_id = ?
   695	    `) as Database.Statement).get(nodeId, nodeId) as { count: number };
   696	    return row.count;
   697	  } catch (error: unknown) {
   698	    const msg = error instanceof Error ? error.message : String(error);
   699	    console.warn(`[causal-edges] countEdgesForNode error: ${msg}`);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts | sed -n '40,78p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts | sed -n '1,90p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts | sed -n '160,205p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts | sed -n '90,130p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'test -e .opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts && test -e .opencode/skill/system-spec-kit/mcp_server/lib/errors/index.ts && test -e .opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts && echo all-exist' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
    40	/**
    41	 * Apply temporal-contiguity boost to vector search results.
    42	 *
    43	 * For every pair of results whose timestamps fall within `windowSeconds`
    44	 * of each other, each member of the pair receives a similarity boost
    45	 * proportional to how close they are:
    46	 *
    47	 *   boost = (1 - timeDelta / windowSeconds) * BOOST_FACTOR
    48	 *   similarity *= (1 + boost)
    49	 *
    50	 * Null input returns null; empty array returns []; single item is
    51	 * returned as-is (no pairs to evaluate).
    52	 */
    53	export function vectorSearchWithContiguity(
    54	  results: Array<{ id: number; similarity: number; created_at: string }> | null,
    55	  windowSeconds: number,
    56	): Array<{ id: number; similarity: number; created_at: string }> | null {
    57	  if (results === null) return null;
    58	  if (results.length <= 1) return results.map(r => ({ ...r }));
    59	
 succeeded in 52ms:
   160	        meta?: { sessionLifecycle?: { effectiveSessionId?: string }; sessionId?: string };
   161	        data?: { sessionId?: string };
   162	      };
   163	      const fromLifecycle = parsed?.meta?.sessionLifecycle?.effectiveSessionId;
   164	      if (typeof fromLifecycle === 'string' && fromLifecycle.trim().length > 0) {
   165	        return fromLifecycle;
   166	      }
   167	      const fromMeta = parsed?.meta?.sessionId;
   168	      if (typeof fromMeta === 'string' && fromMeta.trim().length > 0) {
   169	        return fromMeta;
   170	      }
   171	      const fromData = parsed?.data?.sessionId;
   172	      if (typeof fromData === 'string' && fromData.trim().length > 0) {
   173	        return fromData;
   174	      }
   175	    }
   176	  } catch {
   177	    // Ignore parsing errors and fall back to default.
   178	  }
   179	
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// TEST: TEMPORAL CONTIGUITY
     3	// ---------------------------------------------------------------
     4	
     5	import { describe, it, expect, beforeAll, afterAll } from 'vitest';
     6	import * as path from 'path';
     7	import * as os from 'os';
     8	import * as fs from 'fs';
     9	
    10	import * as mod from '../lib/cache/cognitive/temporal-contiguity';
    11	import BetterSqlite3 from 'better-sqlite3';
    12	
    13	describe('Temporal Contiguity Tests (T502)', () => {
    14	  let testDb!: InstanceType<typeof BetterSqlite3>;
    15	  let tmpDbPath: string = '';
    16	
    17	  function seedMemories(memories: Array<{ title: string; spec_folder: string; created_at: string; importance_tier?: string }>) {
    18	    const stmt = testDb.prepare(`
    19	      INSERT INTO memory_index (spec_folder, file_path, title, created_at, importance_tier)
    20	      VALUES (?, ?, ?, ?, ?)
 succeeded in 51ms:
    90	    const row = db?.prepare(`
    91	      SELECT session_id, memory_id, attention_score, source_tool, source_call_id, extraction_rule_id, redaction_applied
    92	      FROM working_memory
    93	      WHERE memory_id = 101
    94	    `).get() as Record<string, unknown>;
    95	
    96	    expect(row.memory_id).toBe(101);
    97	    expect(row.attention_score).toBe(0.9);
    98	    expect(row.source_tool).toBe('Read');
    99	    expect(row.source_call_id).toBe('call-read-1');
   100	    expect(row.extraction_rule_id).toBe('read-spec');
   101	    expect(row.redaction_applied).toBe(0);
   102	  });
   103	
   104	  it('T035a/T035b/T035c: redaction applies and skips insert when no memory_id resolved', async () => {
   105	    // The bash-git-commit rule matches this content, redaction fires on the token,
   106	    // but resolveMemoryIdFromText() returns null (no "id": pattern, no spec.md path).
   107	    // Without a resolvable memory_id the adapter skips the working_memory insert.
   108	    const metricsBefore = getExtractionMetrics();
   109	
 succeeded in 52ms:
all-exist
codex
I’ve checked the concrete implementation points for all six features now. I’m running one clean existence pass over every listed path so the final report can separate “description mismatch,” “listed path missing,” and “listed paths exist but the actual implementation lives elsewhere.”
codex
The sandbox is refusing here-doc temp files, so I’m switching to a straight `python3 -c` invocation for the path-existence pass. No changes to the workspace, just a safer way to collect the same evidence.
exec
/bin/zsh -lc "python3 -c \"from pathlib import Path; import re; base=Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit'); feats=['feature_catalog/08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md','feature_catalog/08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md','feature_catalog/08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md','feature_catalog/08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md','feature_catalog/08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md','feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md'];
for rel in feats:
 p=base/rel; t=p.read_text(); paths=re.findall(r'"'`([''^`]+)`'"', t); print('FEATURE', p.name); [print('OK' if (base/x).exists() else 'MISSING', x) for x in paths]; print()\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 53ms:
zsh:3: unmatched "
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path; import re; base=Path(\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit\"); feats=[\"feature_catalog/08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md\",\"feature_catalog/08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md\",\"feature_catalog/08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md\",\"feature_catalog/08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md\",\"feature_catalog/08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md\",\"feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md\"]; 
for rel in feats:
    p=base/rel; t=p.read_text(); paths=re.findall(r\""'`([''^`]+)`", t); print("FEATURE", p.name); 
    for x in paths: print("OK" if (base/x).exists() else "MISSING", x); 
    print()'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 1.00s:
FEATURE 01-graph-channel-id-fix.md
MISSING graph-search-fn.ts
MISSING mem:${edgeId}
OK mcp_server/lib/cognitive/rollout-policy.ts
OK mcp_server/lib/parsing/content-normalizer.ts
OK mcp_server/lib/search/bm25-index.ts
OK mcp_server/lib/search/graph-flags.ts
OK mcp_server/lib/search/graph-search-fn.ts
OK mcp_server/lib/search/search-types.ts
OK mcp_server/lib/search/spec-folder-hierarchy.ts
OK mcp_server/tests/bm25-index.vitest.ts
OK mcp_server/tests/content-normalizer.vitest.ts
OK mcp_server/tests/graph-flags.vitest.ts
OK mcp_server/tests/graph-search-fn.vitest.ts
OK mcp_server/tests/rollout-policy.vitest.ts
OK mcp_server/tests/spec-folder-hierarchy.vitest.ts

FEATURE 02-chunk-collapse-deduplication.md
MISSING includeContent=true
MISSING includeContent=false
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path; import re; base=Path(\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit\"); feats=[\"feature_catalog/08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md\",\"feature_catalog/08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md\",\"feature_catalog/08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md\",\"feature_catalog/08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md\",\"feature_catalog/08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md\",\"feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md\"]; 
for rel in feats:
    p=base/rel; t=p.read_text().splitlines(); paths=[]; in_src=False
    for line in t:
        if line.strip()==\"## Source Files\": in_src=True; continue
        if in_src and line.startswith(\"## \"): break
        if in_src:
            m=re.match(r\"\\|\\s*"'`([''^`]+)`'"\\s*\\|\", line)
            if m: paths.append(m.group(1))
    print(p.name)
    bad=[x for x in paths if not (base/x).exists()]
    print(\"BAD\", bad if bad else \"NONE\")
'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 636ms:
01-graph-channel-id-fix.md
BAD NONE
02-chunk-collapse-deduplication.md
BAD NONE
03-co-activation-fan-effect-divisor.md
BAD NONE
04-sha-256-content-hash-deduplication.md
BAD NONE
05-database-and-schema-safety.md
BAD NONE
06-guards-and-edge-cases.md
BAD NONE
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts | sed -n '188,230p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"includeContent|collapseAndReassembleChunkResults\\(\" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts | sed -n '401,470p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
210:    await collapseAndReassembleChunkResults(results);
411:async function collapseAndReassembleChunkResults(
 succeeded in 53ms:
   188	
   189	          results = diversified.map((candidate): PipelineRow => {
   190	            const existing = rowMap.get(candidate.id);
   191	            if (existing) return existing;
   192	            return { id: candidate.id as number, score: candidate.score };
   193	          });
   194	        }
   195	      }
   196	    } catch (mmrErr: unknown) {
   197	      // AI-GUARD: Non-critical — MMR failure does not block pipeline
   198	      console.warn(`[stage3-rerank] MMR diversity pruning failed: ${toErrorMessage(mmrErr)}`);
   199	    }
   200	  }
   201	
   202	  // AI-GUARD: -- Step 3: MPAB chunk collapse + parent reassembly -----------
   203	  //
   204	  // MPAB must remain AFTER RRF (Stage 2 constraint). This step runs
   205	  // here in Stage 3 — never move it upstream.
   206	  const mpabStart = Date.now();
   207	  const beforeMpab = results.length;
 succeeded in 53ms:
   401	 *   5. If the DB query succeeds, emit a reassembled parent row.
   402	 *   6. If the DB query fails, fall back to the best-chunk content.
   403	 *   7. Merge non-chunks + reassembled parents, sort by score descending.
   404	 *
   405	 * Pipeline position constraint: this function MUST NOT be called before
   406	 * RRF fusion (Stage 2). It is intentionally placed in Stage 3.
   407	 *
   408	 * @param results - Scored pipeline rows from (optionally reranked) Stage 3.
   409	 * @returns Object with aggregated rows and chunk reassembly statistics.
   410	 */
   411	async function collapseAndReassembleChunkResults(
   412	  results: PipelineRow[]
   413	): Promise<{ results: PipelineRow[]; stats: ChunkReassemblyStats }> {
   414	  const stats: ChunkReassemblyStats = {
   415	    collapsedChunkHits: 0,
   416	    chunkParents: 0,
   417	    reassembled: 0,
   418	    fallback: 0,
   419	  };
   420	
codex
---
FEATURE: 01-graph-channel-id-fix
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: NONE
NOTES: `graph-search-fn.ts` now emits numeric `source_id`/`target_id` candidates in both query paths, and `graph-search-fn.vitest.ts` verifies no `mem:` IDs are returned. The listed files are broader than the direct fix, but the core implementation is present.
---
FEATURE: 02-chunk-collapse-deduplication
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage3-rerank.ts, mcp_server/handlers/memory-search.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The behavior matches code: chunk collapse no longer depends on `includeContent`. The source list omits the active V2 collapse path in `stage3-rerank.ts` and the handler-level includeContent regression helper in `memory-search.ts`.
---
FEATURE: 03-co-activation-fan-effect-divisor
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage2-fusion.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `lib/cognitive/co-activation.ts` still has the `1 / sqrt(relatedCount)` helper behavior, but the active Stage 2 fusion path applies `spreadActivation()` scores directly via `CO_ACTIVATION_CONFIG.boostFactor`. The description is right; the source list omits that active caller.
---
FEATURE: 04-sha-256-content-hash-deduplication
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/memory-save.ts, mcp_server/lib/validation/preflight.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The fast-path hash dedup is real in `handlers/save/dedup.ts`, and `memory-save.ts` invokes it before embedding generation. `preflight.ts` also performs exact content-hash duplicate checks. The current list omits those save-flow entry points.
---
FEATURE: 05-database-and-schema-safety
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/storage/reconsolidation.ts, mcp_server/lib/storage/checkpoints.ts, mcp_server/lib/storage/causal-edges.ts, mcp_server/handlers/pe-gating.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: B1, B2, and B4 are traceable in `reconsolidation.ts`, `checkpoints.ts`, and `pe-gating.ts`, but those direct fix files are not listed. B4 does not live in `memory-save.ts` now. B3 is the weakest claim: the current `causal-edges.ts` does not visibly contain the exact `WHERE a AND (b OR c)` form described, so that wording should be rechecked.
---
FEATURE: 06-guards-and-edge-cases
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/cognitive/temporal-contiguity.ts, mcp_server/lib/extraction/extraction-adapter.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The code matches the description: `temporal-contiguity.ts` uses `j = i + 1`, and `extraction-adapter.ts` returns `null` when resolution fails. The current source list points to error modules rather than the actual guard and edge-case implementations.
---
tokens used
154,501
---
FEATURE: 01-graph-channel-id-fix
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: NONE
NOTES: `graph-search-fn.ts` now emits numeric `source_id`/`target_id` candidates in both query paths, and `graph-search-fn.vitest.ts` verifies no `mem:` IDs are returned. The listed files are broader than the direct fix, but the core implementation is present.
---
FEATURE: 02-chunk-collapse-deduplication
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage3-rerank.ts, mcp_server/handlers/memory-search.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The behavior matches code: chunk collapse no longer depends on `includeContent`. The source list omits the active V2 collapse path in `stage3-rerank.ts` and the handler-level includeContent regression helper in `memory-search.ts`.
---
FEATURE: 03-co-activation-fan-effect-divisor
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage2-fusion.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `lib/cognitive/co-activation.ts` still has the `1 / sqrt(relatedCount)` helper behavior, but the active Stage 2 fusion path applies `spreadActivation()` scores directly via `CO_ACTIVATION_CONFIG.boostFactor`. The description is right; the source list omits that active caller.
---
FEATURE: 04-sha-256-content-hash-deduplication
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/memory-save.ts, mcp_server/lib/validation/preflight.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The fast-path hash dedup is real in `handlers/save/dedup.ts`, and `memory-save.ts` invokes it before embedding generation. `preflight.ts` also performs exact content-hash duplicate checks. The current list omits those save-flow entry points.
---
FEATURE: 05-database-and-schema-safety
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/storage/reconsolidation.ts, mcp_server/lib/storage/checkpoints.ts, mcp_server/lib/storage/causal-edges.ts, mcp_server/handlers/pe-gating.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: B1, B2, and B4 are traceable in `reconsolidation.ts`, `checkpoints.ts`, and `pe-gating.ts`, but those direct fix files are not listed. B4 does not live in `memory-save.ts` now. B3 is the weakest claim: the current `causal-edges.ts` does not visibly contain the exact `WHERE a AND (b OR c)` form described, so that wording should be rechecked.
---
FEATURE: 06-guards-and-edge-cases
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/cognitive/temporal-contiguity.ts, mcp_server/lib/extraction/extraction-adapter.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The code matches the description: `temporal-contiguity.ts` uses `j = i + 1`, and `extraction-adapter.ts` returns `null` when resolution fails. The current source list points to error modules rather than the actual guard and edge-case implementations.
---
