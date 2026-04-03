---
title: "Deep Research Report: OpenCode LCM Plugin Fit for Packet 024 [02--system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/research]"
description: "Evaluates the opencode-lcm plugin as a transport and architecture reference for packet 024 compact code graph work, identifies broader Spec Kit Memory improvements worth porting, and maps additional improvements for the existing code-graph runtime and hook logic."
iterations: 6
trigger_phrases:
  - "deep"
  - "research"
  - "opencode"
  - "lcm"
  - "plugin"
  - "compact"
  - "code"
  - "graph"
importance_tier: "important"
contextType: "research"
---
# Deep Research Report: OpenCode LCM Plugin Fit for Packet 024

> **6 focused iterations** | scope: `external/opencode-lcm-master` as a method reference, not a dependency adoption exercise

---

## 1. Executive Summary

### Bottom Line

We should **reuse the plugin method, not the plugin backend**.

The best packet-024 move is to build a **thin OpenCode adapter plugin** that borrows `opencode-lcm`'s OpenCode insertion points:

- `event`
- `experimental.chat.system.transform`
- `experimental.chat.messages.transform`
- `experimental.session.compacting`

But that adapter should pull its actual context from **our existing retrieval stack**:

- `memory_match_triggers()`
- `memory_context({ mode: "resume", profile: "resume" })`
- `code_graph_context()` / `code_graph_query()`
- CocoIndex seed search

It should **not** introduce `opencode-lcm` as the new source of truth for long-term memory or code graph storage.

The second-pass finding is that the plugin is also useful as an **operational reference** for our existing graph runtime. Beyond prompt-time injection, it exposes patterns we can reuse for:

- worktree-aware snapshot export/import
- workspace-bounded path safety
- retention/pinning around archived state
- metadata-only artifact previews
- doctor-style integrity repair

### Why

`opencode-lcm` is strongest where packet 024 is currently weakest: **OpenCode-native prompt-time injection**. Its archive and search backend is solid, but packet 024 already has a different architecture direction:

- hybrid hook + tool reliability rather than a plugin-only recovery model [SOURCE: `decision-record.md:39-99`]
- a separate SQLite structural graph, not a graph-inside-memory archive [SOURCE: `009-code-graph-storage-query/spec.md:68-168`]
- compact graph projection plus CocoIndex complementarity, not transcript-first graph retrieval [SOURCE: `research/research.md:31-43`]

So the right adoption strategy is:

1. copy the **transport shell**
2. keep our **retrieval core**
3. selectively port a few **storage and repair ideas**

---

## 2. What The Plugin Actually Does

The plugin's README promise is accurate: it captures older conversation state outside the prompt, stores it in SQLite, and later recalls compact excerpts back into OpenCode's prompt assembly flow. [SOURCE: `external/opencode-lcm-master/README.md:55-77`]

At runtime it wires four important behaviors:

1. **Event capture**
   - archives OpenCode session/message events into an internal store [SOURCE: `external/opencode-lcm-master/src/index.ts:14-17`]
2. **Archive tools**
   - exposes status/search/describe/expand/artifact/retention/snapshot operations [SOURCE: `external/opencode-lcm-master/src/index.ts:19-220`]
3. **Prompt-time injection**
   - injects synthetic `retrieved-context` and `archive-summary` parts during `experimental.chat.messages.transform` [SOURCE: `external/opencode-lcm-master/src/store.ts:2876-2924`]
4. **Compaction carry-forward**
   - appends a compact resume note during `experimental.session.compacting` without overriding the base prompt [SOURCE: `external/opencode-lcm-master/src/index.ts:14-220`] [SOURCE: `external/opencode-lcm-master/src/store.ts:2859-2874`]

That means the plugin is not merely "search old chat history". It is a **transport-aware archive + injection loop** for OpenCode.

---

## 3. The Reusable Packet-024 Method

### 3.1 What Packet 024 Should Borrow

Packet 024 should borrow three ideas directly.

#### A. Inject compact context at prompt assembly time

The plugin proves that OpenCode's message transforms are the right place to add compact, synthetic context blocks instead of forcing the model to rediscover them by tool call first. [SOURCE: `external/opencode-lcm-master/src/store.ts:2876-2924`]

For packet 024, those synthetic blocks should be:

- `retrieved-context`
  - memory resume brief, trigger surfacing, working-memory hints
- `graph-context`
  - compact code graph neighborhood, likely seeded from latest turn files/symbols
- `archive-summary`
  - optional session digest if the thread is already long/compacted

This matches packet 024's prior "store rich, serve compact" direction. [SOURCE: `research/research.md:37-43`]

#### B. Keep compaction handoff separate from live retrieval

`opencode-lcm` distinguishes between:

- a **resume note** for compaction continuity [SOURCE: `external/opencode-lcm-master/src/store.ts:3242-3275`]
- **retrieved hits** for current-turn relevance [SOURCE: `external/opencode-lcm-master/src/store.ts:2937-3219`]

Packet 024 should do the same. Compaction note content and current-turn graph/memory retrieval should stay separate so we do not confuse "what happened before" with "what is relevant now."

#### C. Use bounded, staged retrieval rather than raw archive dump

The plugin's retrieval is explicitly budgeted:

- scope order
- per-scope budgets
- per-result-type quotas
- stop conditions
- TF-IDF filtering before phrase/query expansion [SOURCE: `external/opencode-lcm-master/src/options.ts:37-80`] [SOURCE: `external/opencode-lcm-master/src/store.ts:2937-3219`] [SOURCE: `external/opencode-lcm-master/src/store-search.ts:49-164`]

Packet 024 should reuse that mindset when composing graph + memory + CocoIndex payloads in OpenCode:

- current turn / active files
- current spec folder
- wider workspace

This maps cleanly onto packet 024's earlier floors-and-overflow budget thinking. [SOURCE: `research/research.md:31-43`]

### 3.2 What Packet 024 Should Not Borrow

#### Do not adopt a second long-memory backend as primary truth

The plugin's SQLite archive is good engineering, but it would duplicate an existing memory platform. Spec Kit Memory already has memory retrieval, working-memory boosts, session bootstrap, and startup digests. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:642-712`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:365-417`]

If we copied the whole LCM store into production as another main backend, we would create:

- drift between archives
- duplicate indexing paths
- duplicate retention/repair logic
- ambiguous "which memory result is canonical?" behavior

#### Do not treat transcript archive as the code graph

Packet 024 phase 009 already defines a clean structural graph store with `code_files`, `code_nodes`, and `code_edges`. [SOURCE: `009-code-graph-storage-query/spec.md:81-168`]

`opencode-lcm`'s archive is session-first. It is valuable for **session memory**, not as a replacement for the structural code graph. Its summary DAG summarizes archived conversation slices, not import/call relationships. [SOURCE: `external/opencode-lcm-master/src/store.ts:922-960`] [SOURCE: `external/opencode-lcm-master/src/store.ts:3580-3665`]

---

## 4. Recommended Packet-024 Architecture

### Recommendation: Thin OpenCode Adapter Plugin

Build a new OpenCode plugin for packet 024 that does the following:

#### `event`

- record lightweight session metadata needed for OpenCode-side routing
- optionally cache recent file/symbol hints and a compaction digest
- do not mirror the entire memory store yet

#### `experimental.chat.system.transform`

- inject a short startup digest based on our existing startup-instructions/session-snapshot logic
- reuse current concepts:
  - last spec folder
  - graph freshness
  - session quality
  - recommended first action [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:665-712`]

#### `experimental.chat.messages.transform`

- inspect the latest user turn and recent file references
- generate a bounded retrieval package:
  - memory resume/trigger output
  - compact graph neighborhood
  - optional CocoIndex semantic seed matches
- inject synthetic text parts the way `opencode-lcm` does, but sourced from our own logic [SOURCE: `external/opencode-lcm-master/src/store.ts:2876-2924`]

#### `experimental.session.compacting`

- inject a short packet-024 resume block
- include:
  - spec folder
  - active files
  - graph freshness
  - next steps / blockers
- keep it separate from full retrieval output, just as `opencode-lcm` separates resume notes from current-turn recall [SOURCE: `external/opencode-lcm-master/src/store.ts:2859-2874`] [SOURCE: `external/opencode-lcm-master/src/store.ts:3242-3275`]

### Why This Is The Best Fit

It closes the real gap in packet 024:

- **today:** OpenCode mostly recovers through tool calls and startup instructions
- **after adapter:** OpenCode gets packet-024 context at prompt assembly time

It also keeps prior packet decisions intact:

- hybrid hook + tool philosophy remains valid [SOURCE: `decision-record.md:39-99`]
- code graph remains a separate structural subsystem [SOURCE: `009-code-graph-storage-query/spec.md:68-168`]
- CocoIndex remains the semantic complement, not a duplicate graph layer [SOURCE: `decision-record.md:119-120`] [SOURCE: `research/research.md:37-42`]

---

## 5. What The Plugin Suggests For Spec Kit Memory In General

There are several ideas worth porting even if we never build the OpenCode adapter.

### 5.1 Doctor-Style Integrity Repair

`lcm_doctor` is one of the strongest pieces in the plugin. It checks for:

- summary-state mismatches
- invalid summary DAGs
- FTS drift
- lineage drift
- orphan blobs

and can repair them in-place. [SOURCE: `external/opencode-lcm-master/src/store.ts:1369-1605`]

Spec Kit Memory already has health checks, but an equally compact "doctor" surface with clearer scoped repair actions would improve operator trust, especially for:

- graph/memory cross-index drift
- stale derived tables
- orphaned payload rows
- resume/session-state inconsistencies

### 5.2 Deduplicated Large-Payload Storage

The `artifacts` + `artifact_blobs` split is valuable. The plugin stores searchable preview metadata in the main row and deduplicates full content by hash in a shared blob table. [SOURCE: `external/opencode-lcm-master/src/store.ts:897-920`]

That pattern would help our memory system where repeated large tool/file payloads appear across:

- session captures
- recovery payloads
- large file/tool evidence
- imported/exported memory snapshots

### 5.3 Pre-Index Privacy Filtering

The privacy layer is small but pragmatic:

- exclude certain tools entirely
- exclude sensitive paths
- regex-redact content before storage/indexing [SOURCE: `external/opencode-lcm-master/src/privacy.ts:3-122`]

Spec Kit Memory already has governance/scoping concepts, but adding a pre-index privacy compiler for raw archival surfaces would reduce risk when storing verbose tool payloads or file captures.

### 5.4 Portable Snapshot Export/Import

The plugin's portable archive snapshots are more than checkpoints: they are transfer/merge primitives. [SOURCE: `external/opencode-lcm-master/README.md:71-78`] [SOURCE: `external/opencode-lcm-master/src/index.ts:19-220`]

That is useful beyond rollback:

- move research/session context between worktrees
- share portable history across environments
- preserve curated archives separate from a live DB

### 5.5 Expandable Summary DAGs

The summary-node tree is a strong pattern for **very large** archives. [SOURCE: `external/opencode-lcm-master/src/store.ts:3580-3665`]

We should not rush to wrap every memory result in a DAG, but the pattern is attractive for:

- long session archives
- deep-research lineage summaries
- progressively explorable handovers

It gives a middle ground between:

- one tiny summary paragraph
- replaying full raw history

---

## 6. Comparison Against Current Spec Kit Memory

### Already Present In Our Stack

These LCM ideas are already covered, at least partially:

- startup/system guidance [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:642-712`]
- session recovery digests [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:665-712`]
- tool-based auto-surfacing of important memories [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:365-417`]
- working-memory attention boost [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:345-362`]
- hook-capable lifecycle support for non-OpenCode runtimes [SOURCE: `.opencode/skill/system-spec-kit/references/config/hook_system.md:21-57`]
- compact startup graph briefing [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:47-115`]
- bounded structural bootstrap contracts [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:204-260`]
- budget-aware compaction merge plus file-level deduplication [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:106-197`]

### Still Missing Or Weaker

- OpenCode-native prompt-time injection shell
- doctor-grade repair loop with explicit scoped fixes
- deduplicated large-payload blob tier
- portable import/export archive surface
- optional expandable session/archive DAGs
- graph-runtime export/import and worktree-aware handoff
- workspace-safe path enforcement for any future file-based graph/runtime operations
- provenance-rich startup/compaction signals beyond counts and last-scan age
- metadata-only previews for non-text artifacts referenced in recovery flows

---

## 7. What This Suggests For Other Existing Code Graph / Hook Logic

### 7.1 Keep The Current Startup And Compaction Foundations

The broad comparison did **not** show a need to replace our current compact-context assembly path.

We should keep:

- `buildStartupBrief()` for compact structural orientation [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:47-115`]
- `buildStructuralBootstrapContract()` for bounded startup/recovery summaries [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:204-260`]
- `session-prime.ts` as the hook-injection layer for hook-capable runtimes [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:99-155`]
- `mergeCompactBrief()` as the token-budget and deduplication engine for compaction payloads [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:106-197`]

The LCM comparison strengthens these design choices rather than undermining them.

### 7.2 Upgrade Startup And Resume Provenance

Current startup and bootstrap logic is compact and useful, but it still mostly reports:

- counts
- top highlights
- last scan age
- last session summary
- recommended action

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:65-105`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:223-257`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:118-155`]

`opencode-lcm` suggests making recovery payloads more provenance-rich without making them dramatically larger. The next upgrade should add signals such as:

- whether the payload is live, cached, stale, or imported
- age of the last compact brief
- active worktree identity
- top working-set files/symbols, not only global startup highlights

This is a trust and operator-clarity improvement, not a retrieval overhaul.

### 7.3 Add Doctor, Snapshot, And Retention Surfaces Around The Graph Runtime

Our current public graph MCP surface is intentionally narrow:

- `code_graph_scan`
- `code_graph_query`
- `code_graph_status`
- `code_graph_context`

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:5-13`]

`code_graph_status` reports counts, freshness, schema version, parse health, and file sizes, but it does not repair anything. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:9-47`]

`ensureCodeGraphReady()` handles empty graphs, git-head drift, deleted tracked files, stale mtimes, and inline reindexing, but it is still a freshness helper rather than a full integrity-management surface. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:93-166`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:219-260`]

The plugin points toward three follow-on upgrades:

1. **`code_graph_doctor`**
   - integrity checks + optional repair for graph drift and orphan cleanup
2. **snapshot export/import**
   - portable graph-adjacent state transfer, merge safety, and worktree handoff
3. **retention/pinning**
   - durable compaction/runtime state with explicit cleanup rules instead of age-only temp cleanup

The doctor and retention ideas are directly reinforced by LCM's repair and retention logic. [SOURCE: `external/opencode-lcm-master/src/store.ts:1369-1605`] [SOURCE: `external/opencode-lcm-master/src/store-retention.ts:43-152`]

### 7.4 Make File-Based Operations Explicitly Workspace- And Worktree-Safe

If we add any snapshot or artifact-preview flow, we should explicitly port two small but high-value patterns:

- workspace-bounded path resolution [SOURCE: `external/opencode-lcm-master/src/workspace-path.ts:3-20`]
- normalized worktree identity [SOURCE: `external/opencode-lcm-master/src/worktree-key.ts:1-4`]

Today, our hook state is keyed by hashed cwd/session id and stored under tmpdir, which is good for one-session durability but not a full portable identity model. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:32-45`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:67-103`]

That means any future export/import or cross-worktree recovery feature should not reuse raw cwd strings or unconstrained paths as its only safety mechanism.

### 7.5 Add Metadata-Only Artifact Previews To Recovery Workflows

The preview-provider pattern is useful even if we never adopt the rest of the plugin archive. It shows how to summarize non-text artifacts without dumping raw content:

- fingerprint and size
- byte peek
- image dimensions
- PDF page estimates
- ZIP entry counts

[SOURCE: `external/opencode-lcm-master/src/preview-providers.ts:143-260`]

This would improve:

- artifact-heavy research sessions
- debugging sessions involving generated outputs
- future startup/compaction payloads that mention non-text files

Importantly, it is a **metadata-only** strategy, which keeps token cost and privacy risk low.

### 7.6 What Not To Change

Do not replace the current compact merger or structural bootstrap model.

Those pieces already align with the right architecture:

- bounded token budgets
- source-aware merging
- file-level deduplication
- compact structural orientation

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:106-197`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:204-260`]

LCM helps us improve the **operational shell** around those pieces, not substitute for them.

---

## 8. Recommended Follow-On Work

### Option A: Minimal Packet-024 Follow-On

Create a follow-on packet for an **OpenCode compact-context adapter plugin**.

Scope:

- inject startup digest
- inject compact graph + memory context in `experimental.chat.messages.transform`
- inject compaction note
- no new archive DB in v1

This is the recommended next step.

### Option B: Hybrid Adapter + Tiny Local Cache

Same as Option A, plus:

- a very small plugin-local cache for recent session hints and compaction digests
- no attempt to replace Spec Kit Memory

This is reasonable if OpenCode plugin latency becomes an issue.

### Option C: Graph-Runtime Hardening Packet

Create a separate follow-on focused on the existing graph/runtime stack:

- `code_graph_doctor`
- snapshot export/import
- worktree-aware recovery metadata
- workspace-safe file operations
- metadata-only artifact previews

This is the best next step if the goal is broader graph/runtime quality rather than OpenCode transport.

### Option D: Full LCM-Style Parallel Archive

Not recommended for v1.

Only revisit if we later conclude that OpenCode needs a plugin-local archive for performance or transport reasons that cannot be solved by reusing our current stores.

---

## 9. Final Recommendation

### Packet 024

Build a **thin OpenCode adapter plugin** that copies `opencode-lcm`'s OpenCode injection method and routes it to our existing memory + compact-code-graph stack.

### Spec Kit Memory

Port these ideas in priority order:

1. doctor-style integrity/repair surface
2. deduplicated large-payload storage
3. pre-index privacy filtering
4. portable snapshot export/import
5. optional expandable summary DAGs for large archives

### Existing Code Graph / Hook Runtime

Port these ideas in priority order:

1. `code_graph_doctor` and deeper integrity checks
2. worktree-aware snapshot export/import for graph-adjacent runtime state
3. provenance-richer startup and compaction payloads
4. workspace-safe path resolution for any new file-based runtime operations
5. metadata-only preview summaries for non-text artifacts

### Do Not Do

- do not replace Spec Kit Memory with `opencode-lcm`
- do not collapse the code graph into a session archive
- do not fork the external plugin wholesale before proving the thin-adapter path
- do not replace the current compact-merger / structural-bootstrap design with a transcript-first archive design

That gives us the best part of the plugin, which is **OpenCode-native context injection plus better operational durability patterns**, while preserving the architecture packet 024 has already been steering toward.
