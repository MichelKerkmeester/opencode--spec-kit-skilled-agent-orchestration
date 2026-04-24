---
title: "Deep Research Report: OpenCode LCM Plugin [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/research]"
description: "Evaluates the opencode-lcm plugin as a transport and architecture reference for packet 024 compact code graph work, identifies broader Spec Kit Memory improvements worth porting, maps additional improvements for the existing code-graph runtime and hook logic, incorporates 10 delegated cli-copilot GPT-5.4 high iterations, and adds 10 live-runtime loader iterations for the surviving plugin.auth startup crash."
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
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/research"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["research.md"]
iterations: 26
---
# Deep Research Report: OpenCode LCM Plugin Fit for Packet 024

> **26 focused iterations** | scope: `external/opencode-lcm-master` as a method reference plus a live OpenCode runtime-loader extension for the surviving packet-030 startup crash

> Extension note: iterations `007` through `016` were delegated via `cli-copilot` to `gpt-5.4` at `high` effort in 5 waves of 2, then folded back into this packet synthesis.

> Runtime extension note: iterations `017` through `026` investigated the live `plugin.auth` startup crash using the real Homebrew OpenCode binary, the Superset wrapper/config root, and the packet-030 local plugin files.

---

## 1. Executive Summary

### Bottom Line

We should **reuse the plugin method, not the plugin backend**.

For the surviving live startup crash, we should also **trust the packed runtime loader over the local plugin type declarations**.

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

For packet `030` specifically, the live runtime extension changed the immediate implementation guidance:

- use a **single callable plugin export only**
- avoid non-function exports like `id`
- do not rely on the bare package-style plugin specifier for the local repo plugin
- prefer local file auto-loading from `.opencode/plugin(s)/` or an explicit `file://...` plugin specifier

The second-pass finding is that the plugin is also useful as an **operational reference** for our existing graph runtime. Beyond prompt-time injection, it exposes patterns we can reuse for:

- worktree-aware snapshot export/import
- workspace-bounded path safety
- retention/pinning around archived state
- metadata-only artifact previews
- doctor-style integrity repair

The extended Copilot pass sharpened that further. The current best dependency order is:

1. build a shared payload/provenance composition layer
2. build the OpenCode adapter against that layer
3. harden the graph/runtime ops around path identity, doctor/export/import, and previews

And the cleanest future packet split is now:

1. OpenCode transport adapter under packet 024
2. code-graph operations hardening under packet 024
3. memory archive durability outside packet 024

### Why

`opencode-lcm` is strongest where packet 024 is currently weakest: **OpenCode-native prompt-time injection**. Its archive and search backend is solid, but packet 024 already has a different architecture direction:

- hybrid hook + tool reliability rather than a plugin-only recovery model [SOURCE: `decision-record.md:39-99`]
- a separate SQLite structural graph, not a graph-inside-memory archive [SOURCE: `009-code-graph-storage-query/spec.md:68-168`]
- compact graph projection plus CocoIndex complementarity, not transcript-first graph retrieval [SOURCE: `research/research.md:31-43`]

So the right adoption strategy is:

1. copy the **transport shell**
2. keep our **retrieval core**
3. selectively port a few **storage and repair ideas**
4. align packet-030’s live plugin registration with the actual OpenCode loader semantics before continuing feature work

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
- query-aware seed disambiguation and low-signal suppression inside existing graph retrieval surfaces
- unified stale/readiness semantics across `ensure-ready`, `status`, startup priming, and `session_health`
- a shared payload/provenance contract that the future OpenCode adapter can consume without cloning runtime logic

---

## 7. What The 10 Extra Copilot Iterations Added

The delegated GPT-5.4 high pass did not overturn the earlier direction, but it made the next moves much more specific.

### 7.1 Startup And Resume Need Better Provenance Semantics

The strongest startup/resume refinement is that provenance should split into:

- **surface provenance**: where the payload came from
- **data provenance**: whether it is live, cached, imported, rebuilt, or rehomed

The delegated pass also showed that future import flows should follow:

- `imported-unverified`
- `rebuilt`
- `ready`

rather than presenting imported state as immediately ready. [SOURCE: `research/iterations/iteration-007.md:7-33`]

### 7.2 Compaction Should Use WorkingSetTracker And Pre-Merge Selection

The delegated compaction pass exposed two practical gaps:

1. `WorkingSetTracker` already exists but the compact path still leans on transcript heuristics
2. the main budget gap is before `mergeCompactBrief()`, not inside it

It also identified the need for an anti-feedback sanitizer so previously injected compact text does not pollute future compact-brief extraction. [SOURCE: `research/iterations/iteration-008.md:7-37`]

### 7.3 Graph Export/Import Needs Identity Rewriting, Not Raw Dumps

The delegated snapshot pass clarified that our biggest portability blocker is path-derived identity:

- file paths are part of graph identity
- symbol IDs are path-derived
- raw DB dumps are therefore not portable across worktrees as-is

It also strengthened the recommendation to distinguish structural conflicts from content dedupe and to treat import as a finalize-and-repair pipeline. [SOURCE: `research/iterations/iteration-009.md:7-33`]

### 7.4 Retention, Deduplication, And Preview Should Be Treated As Operational Mechanics

The delegated retention pass added mechanism detail that the earlier report only summarized:

- lineage-aware leaf-only pruning
- hash-after-redaction dedupe
- backfill/evacuation from inline payloads into blob storage
- privacy and preview coupled at ingest time

It also made the asymmetry between mature memory archival semantics and still-ephemeral graph/runtime state much clearer. [SOURCE: `research/iterations/iteration-010.md:7-33`]

### 7.5 Existing Graph Retrieval Surfaces Can Improve Without Replacement

The delegated graph-retrieval pass found several additive improvements:

- use `seed.query` during disambiguation
- reduce first-anchor bias in `code_graph_context`
- move from slice-first to overfetch-then-trim
- add low-signal suppression to the semantic bridge

These are useful because they improve the current graph tools directly instead of assuming a new archive backend is needed. [SOURCE: `research/iterations/iteration-011.md:7-31`]

### 7.6 Graph Health Surfaces Need One Readiness Model

The delegated health pass identified a subtle but important issue:

- `ensure-ready`
- `session_health`
- startup priming
- structural bootstrap

do not currently use one shared stale/readiness model.

It also showed that read paths already compute useful readiness diagnostics and then throw them away. [SOURCE: `research/iterations/iteration-012.md:7-31`]

### 7.7 The Adapter Boundary And Future Packet Split Are Now Much Clearer

The last delegated passes sharpened three planning points:

1. the adapter should be a transport facade only [SOURCE: `research/iterations/iteration-013.md:7-28`]
2. over-porting plugin archive patterns would create concrete collision risks [SOURCE: `research/iterations/iteration-014.md:7-31`]
3. the next work should be sequenced as shared payload layer -> adapter -> graph ops hardening, and split into three future packets rather than one combined follow-on [SOURCE: `research/iterations/iteration-015.md:7-26`] [SOURCE: `research/iterations/iteration-016.md:7-34`]

---

## 8. What This Suggests For Other Existing Code Graph / Hook Logic

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

## 9. Recommended Follow-On Work

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
- shared stale/readiness diagnostics
- query-aware seed disambiguation and low-signal suppression
- snapshot export/import
- worktree-aware recovery metadata
- workspace-safe file operations
- metadata-only artifact previews
- stronger compaction-state handling via WorkingSetTracker + pre-merge selection

This is the best next step if the goal is broader graph/runtime quality rather than OpenCode transport.

### Option D: Memory Archive Durability Packet

Move the broader memory-backend upgrades out of packet 024 into a separate track:

- pre-index privacy compiler
- deduplicated blob tier
- portable archive snapshots
- optional expandable summary DAGs

This is the best fit if we want to improve storage durability without confusing the structural graph track.

### Option E: Full LCM-Style Parallel Archive

Not recommended for v1.

Only revisit if we later conclude that OpenCode needs a plugin-local archive for performance or transport reasons that cannot be solved by reusing our current stores.

---

## 10. Final Recommendation

### Packet 024

Build a **thin OpenCode adapter plugin** that copies `opencode-lcm`'s OpenCode injection method and routes it to our existing memory + compact-code-graph stack.

But do not start with the plugin shell alone. First extract a **shared payload/provenance composition layer** from the existing runtime so the adapter consumes one stable contract instead of reassembling startup, bootstrap, graph, and compaction payloads itself.

### Spec Kit Memory

Port these ideas in priority order:

1. doctor-style integrity/repair surface
2. deduplicated large-payload storage
3. pre-index privacy filtering
4. portable snapshot export/import
5. optional expandable summary DAGs for large archives

### Existing Code Graph / Hook Runtime

Port these ideas in priority order:

1. shared payload/provenance composition and consistent stale/readiness diagnostics
2. `WorkingSetTracker`-aware compaction plus pre-merge selection and anti-feedback sanitization
3. query-aware seed disambiguation, overfetch-then-trim, and low-signal suppression in existing graph retrieval
4. `code_graph_doctor` and deeper integrity checks
5. workspace-safe path resolution plus normalized worktree identity for new file-based flows
6. worktree-aware snapshot export/import for graph-adjacent runtime state
7. metadata-only preview summaries and retention/pinning for non-text/runtime artifacts

### Future Packet Split

The cleanest decomposition is now:

1. **Packet A under 024**: OpenCode transport adapter only
2. **Packet B under 024**: public code-graph operations hardening
3. **Packet C outside 024**: memory archive durability and storage-layer upgrades

### Do Not Do

- do not replace Spec Kit Memory with `opencode-lcm`
- do not collapse the code graph into a session archive
- do not fork the external plugin wholesale before proving the thin-adapter path
- do not replace the current compact-merger / structural-bootstrap design with a transcript-first archive design
- do not create a second persistent recovery authority beside hook cache plus `session_resume` / `session_bootstrap`
- do not introduce a second snapshot plane inside packet 024 that overlaps existing checkpoint semantics

That gives us the best part of the plugin, which is **OpenCode-native context injection plus better operational durability patterns**, while preserving the architecture packet 024 has already been steering toward and avoiding the over-port failure modes the extended delegated research surfaced.

---

## 11. Live Startup Crash Extension

### New Research Question

Why does live OpenCode still fail with:

`TypeError: null is not an object (evaluating 'plugin.auth')`

even after the earlier prompt-shape and export-shape adjustments?

### What The Live Runtime Actually Does

The packed Homebrew OpenCode binary contains the decisive loader behavior:

- it auto-discovers local plugin files from `{plugin,plugins}/*.{ts,js}`
- it converts discovered local plugin files to `file://` URIs
- it treats configured plugin values that do not start with `file://` as package specifiers and installs them
- it imports configured plugin modules and invokes **every unique module export** as a plugin function before pushing the returned hook object into the live hook list

That combination is not fully visible from the local `@opencode-ai/plugin` type declarations alone.

### What This Means For Packet 030

The live runtime findings change the immediate packet-030 guidance in four important ways.

#### A. Single-function export is the safest shape

The current loader does not filter exports by type before invocation. That means module shapes like:

- plugin function export
- extra `id` string export
- extra metadata export

are unsafe because the loader can still attempt to invoke the non-function export.

The safest shape is:

- one callable plugin export only

This matches the active Superset plugin pattern and the external `opencode-lcm` pattern much better than a mixed metadata + function module.

#### B. Local plugin file loading is different from package plugin loading

The local packet-030 plugin file under `.opencode/plugins/` can be auto-discovered as a local file plugin.

But the explicit repo config entry:

- `"spec-kit-compact-code-graph"`

does **not** mean “load this local file.” Under the live loader it means:

- treat it as a package specifier
- install it like an npm package if needed
- then import that package specifier

So the current explicit config entry is semantically different from the local plugin file path.

#### C. Duplicate name resolution is now a real risk

The runtime deduplicates plugins by plugin name.

That means a local `file://...spec-kit-compact-code-graph.js` plugin and a bare package-style `"spec-kit-compact-code-graph"` plugin can collapse into the same effective plugin name, with one source winning over the other depending on merge order.

This is now one of the strongest explanations for why packet-030 behavior has looked inconsistent across restarts.

#### D. The `plugin.auth` crash is still best explained by plugin materialization, not prompt payloads

The binary contains both:

- a guarded auth UI path using `if (plugin && plugin.auth)`
- and an unguarded enumeration path that directly dereferences `plugin.auth`

So the live crash is most consistent with a nullish hook entry or plugin materialization problem entering the auth-related hook list, not with the compact-code-graph message payload itself.

### Updated Root-Cause Ranking

From strongest to weakest current hypotheses:

1. **Plugin registration/resolution mismatch**
   - local file plugin and explicit package-style specifier do not mean the same thing
2. **Mixed export shape**
   - non-function exports are unsafe under the live loader
3. **Version-skew-driven false confidence**
   - local `@opencode-ai/plugin` types do not fully describe the packed binary behavior
4. **Prompt payload shape**
   - still relevant for messages-transform stability, but no longer the best explanation for this particular startup crash

### Updated Immediate Fix Strategy

The highest-confidence next implementation path is now:

1. collapse the packet-030 plugin back to a **single callable export only**
2. remove non-function exports like `id`
3. stop using the bare package-style plugin specifier for the local repo plugin
4. choose one local-loading strategy:
   - rely on `.opencode/plugin(s)/` auto-loading, or
   - use an explicit `file://...` plugin specifier
5. retest startup before changing any more prompt-transform behavior

### Relationship To `opencode-lcm`

The external plugin still matters, but the new lesson is different.

Before the loader extension, `opencode-lcm` was mainly telling us:

- how to inject context into OpenCode

Now it is also telling us, indirectly, what **not** to do:

- do not overcomplicate the module export shape
- do not mix transport work with ambiguous loader/packaging assumptions
- keep the plugin shell thin and runtime-compatible first

So the packet-024 architectural recommendation still stands, but the packet-030 implementation sequence changes:

1. fix live loader compatibility first
2. keep startup injection stable
3. only then reintroduce richer current-turn injection behavior
