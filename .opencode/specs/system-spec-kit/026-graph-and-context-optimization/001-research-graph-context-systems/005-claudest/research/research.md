---
title: Deep Research Synthesis - 005-claudest
description: Source-backed analysis of the Claudest external repository (Claude Code plugin marketplace, claude-memory plugin, get-token-insights skill) and concrete recommendations for Code_Environment/Public.
spec_folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest
generated_at: 2026-04-08
iterations: 20
delegation: generation 1 via cli-codex (gpt-5.4, model_reasoning_effort=high, --full-auto); generation 2 via Codex workspace session (gpt-5.4, high reasoning)
status: SESSION COMPLETE — 20 total iterations, 18 answered questions, and an execution-ready packet roadmap for Public
---

# Deep Research Synthesis — 005-claudest

## 1. EXECUTIVE SUMMARY

Claudest is a Claude Code plugin marketplace whose flagship `claude-memory` plugin combines (a) a v3 SQLite store with branch-aware FTS5/BM25 conversation recall, (b) a Stop/SessionStart hook chain that pre-computes branch summaries and injects them into the next session via `hookSpecificOutput.additionalContext`, (c) an `extract-learnings` consolidation pipeline split between a verifier (`memory-auditor`) and a discoverer (`signal-discoverer`), and (d) a `get-token-insights` skill that ingests Claude JSONL session logs into a relational analytics model and renders a single-file embedded HTML dashboard with ~30 typed payload contracts.

For `Code_Environment/Public` the borrowable layer is **patterns and contracts, not files**. Public already has a stronger retrieval stack (Spec Kit Memory MCP, `memory_context`/`memory_search`, intent-aware routing, importance tiers, spec-folder-scoped context preservation via `generate-context.js`) than Claudest exposes. The high-leverage adoptions are: the runtime FTS capability cascade (`detect_fts_support()`), the cached-summary fast path for SessionStart, the auditor-vs-discoverer split for consolidation work, the per-tier pricing/cache cost normalization, the cache-cliff metric, and roughly six dashboard JSON contracts (`trends`, `skill_usage`, `agent_delegation`, `hook_performance`, `findings`, `recommendations`). The high-cost rejections are: a marketplace runtime layer, a parallel `MEMORY.md` always-loaded file hierarchy, and the plugin-specific HTML/CSS/Chart.js dashboard chrome.

This report now covers 20 total iterations across two generations. Generation 1 answered the original Claudest research charter and produced the adopt/prototype/reject matrix plus packet-ready briefs; generation 2 translated those results into implementation-facing contracts for FTS capability detection, analytics replay, SessionStart fast paths, consolidation-role boundaries, portable token-observability payloads, and a dependency-ordered packet roadmap.

## 2. TOPIC & SCOPE

### 2.1 Topic

Research the external Claudest repository at `005-claudest/external/` and identify concrete improvements for `Code_Environment/Public` around:

1. Claude Code plugin marketplace structure
2. Conversation memory with FTS5/BM25 ranking
3. Automatic context injection on session start
4. Learning extraction with batch-processing agents (`memory-auditor`, `signal-discoverer`)
5. Token-usage observability dashboards (`get-token-insights`)

### 2.2 In scope

Marketplace structure and discovery model; `claude-memory` SQLite schema; FTS5/BM25 conversation recall; automatic SessionStart context injection; learning extraction and consolidation agents; memory hierarchy design; `get-token-insights` ingestion, normalization, and dashboard contracts; versioning and marketplace auto-update pattern; comparison against Public's current memory and observability surfaces.

### 2.3 Out of scope

Peripheral plugin deep dives (`claude-content`, etc.); generic Claude Code usage tips; installing or executing live plugins; rewriting Public around Claudest's plugin runtime; restating phase `001-claude-optimization-settings` audit findings (cross-phase boundary preserved — see §15).

## 3. METHODOLOGY

- **Loop**: 20 iterations with externalized JSONL/registry/strategy state via `sk-deep-research` reducer.
- **Delegation**: Generation 1 ran through **`cli-codex`** with `--model gpt-5.4 -c model_reasoning_effort="high" --full-auto`; generation 2 continued in the active Codex workspace session with the same model and high-reasoning target. Default `@deep-research` dispatch remained overridden throughout.
- **Tool budget**: 12 tool calls per iteration; iterations consistently used 5–9.
- **Source rule**: Every finding cites a verifiable `external/plugins/...` or `external/.claude-plugin/...` path. Source-proven facts are distinguished from README-level claims.
- **Cross-runtime guarantee**: Iterations resolved the spec-local `external/` mirror (under the phase folder), not a hypothetical repo-root `external/`.
- **Convergence**: Generation 1 converged at iteration 7 by question coverage (9/10 = 0.90 ≥ 0.85 threshold), then the packet was reopened in `completed-continue` mode to reach 20 total iterations. Generation 2 closed with 18/18 answered questions and a bounded implementation packet train.

## 4. MARKETPLACE STRUCTURE & DISCOVERY (Q1)

### 4.1 Discovery is registry-first, not autodiscovery

`external/.claude-plugin/marketplace.json` is the discovery root. It declares marketplace identity (`name`, `description`, `owner`) plus a `plugins` array whose entries each carry `name`, `description`, `version`, and a relative `source` path such as `./plugins/claude-memory`. The eight folders under `external/plugins/` exactly match the catalog entries — discovery is registry-first, not filesystem walk.

> **Source**: `external/.claude-plugin/marketplace.json`, `external/plugins/` (directory listing)
> **Evidence type**: source-proven
> **Recommendation**: `(prototype later)` — a comparable manifest above `.opencode/skill/` would let tools enumerate curated packages without hard-coded folder scans.

### 4.2 Per-plugin manifests are intentionally thin package descriptors

`external/plugins/claude-memory/.claude-plugin/plugin.json` and `external/plugins/claude-skills/.claude-plugin/plugin.json` carry only package identity (`name`, `version`, `description`, `author`, `keywords`). No install graph, no update policy, no marketplace membership rules. The clean separation is: **root marketplace = discovery + version declaration; plugin-local manifest = package identity**.

> **Source**: `external/plugins/claude-memory/.claude-plugin/plugin.json`, `external/plugins/claude-skills/.claude-plugin/plugin.json`
> **Evidence type**: source-proven
> **Recommendation**: `(adopt now)` — keep local manifests minimal if Public ever ships distributable bundles.

## 5. PLUGIN VERSIONING & AUTO-UPDATE (Q9)

### 5.1 Version parity holds in this checkout, but the discipline is fragile

A manifest sweep across `external/plugins/*/.claude-plugin/plugin.json` against the root catalog shows version parity for all eight plugins (e.g. `claude-memory@0.8.56`, `claude-skills@0.5.15`, `claude-coding@0.2.18`). The duplication is intentional but unenforced — only safe with continuous cross-checking.

> **Source**: `external/.claude-plugin/marketplace.json`, manifest sweep across `external/plugins/*/.claude-plugin/plugin.json`
> **Evidence type**: source-proven
> **Recommendation**: `(adopt now)` — if Public ever introduces a catalog + per-package manifests, ship a validation rule that fails on drift between the two.

### 5.2 Auto-update is Claude `/plugin` runtime behavior, not repo metadata

`external/README.md` documents `/plugin marketplace add gupsammy/claudest`, `/plugin install <plugin>@claudest`, and a Marketplaces-tab toggle for auto-update — but neither the root marketplace JSON nor any inspected per-plugin `plugin.json` contains an update flag, channel, cadence, or policy. Auto-update is owned by the Claude `/plugin` runtime, not by repository metadata.

> **Source**: `external/README.md` vs `external/.claude-plugin/marketplace.json` and inspected `plugin.json` files
> **Evidence type**: README-level for the positive update behavior; source-proven for the absence of any update metadata
> **Recommendation**: `(reject)` — do not borrow auto-update behavior unless Public also builds an installer/runtime layer.

## 6. CONVERSATION MEMORY: SQLITE SCHEMA (Q2)

### 6.1 v3 schema separates messages from branch indices

`external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py` defines:

| Table | Key columns |
|---|---|
| `projects` | `path`, `key`, `name` |
| `sessions` | `uuid`, `project_id`, `parent_session_id`, `git_branch`, `cwd` |
| `branches` | `session_id`, `leaf_uuid`, `fork_point_uuid`, `is_active`, `started_at`, `ended_at`, `exchange_count`, `files_modified`, `commits`, `tool_counts`, `aggregated_content`, `context_summary`, `context_summary_json`, `summary_version` |
| `messages` | `session_id`, `uuid`, `parent_uuid`, `timestamp`, `role`, `content`, `tool_summary`, `has_tool_use`, `has_thinking`, `is_notification` |
| `branch_messages` | `branch_id`, `message_id` (join table) |
| `import_log` | `file_path`, `file_hash`, `messages_imported` |

The notable design choice is **"messages stored once, branches as a separate index"** — recall queries can rank whole active branches while still hydrating exact message sequences afterward. Crucially, `branches` carries `aggregated_content`, `context_summary`, `context_summary_json`, and `summary_version` — these four fields are what makes the SessionStart fast path possible (see §8).

> **Source**: `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py`
> **Evidence type**: source-proven
> **Recommendation**: `(prototype later)` — branch-aware context retrieval is feasible for Public, but it depends on having a comparable session/branch graph first, which Public does not currently maintain.

### 6.2 FTS capability is detected at runtime, not assumed

Both `messages_fts` and `branches_fts` virtual tables are defined alongside `detect_fts_support()`, which reads `PRAGMA compile_options` and prefers `ENABLE_FTS5`, falls back to `ENABLE_FTS4`/`ENABLE_FTS3`, and returns `None` otherwise. FTS5 uses `tokenize='porter unicode61'` with explicit BM25 ranking; FTS4 falls back to `tokenize=porter`. Both are kept synchronized with INSERT/DELETE/UPDATE triggers.

> **Source**: `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py` (`detect_fts_support()`)
> **Evidence type**: source-proven
> **Recommendation**: `(adopt now)` — the same pattern would let Public's memory MCP degrade gracefully on older SQLite builds without changing the logical search API. Especially relevant given prior work in `system-spec-kit/023-hybrid-rag-fusion-refinement/013-fts5-fix-and-search-dashboard`.

## 7. RECALL CASCADE: BM25 → FTS5 → FTS4 → LIKE (Q4)

### 7.1 Search ranks branches, not individual messages

`external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py` runs MATCH against `branches_fts` (not `messages_fts`), filters to `b.is_active = 1`, sanitizes query tokens, and builds an OR-joined quoted MATCH query. The cascade:

1. **FTS5 path**: orders by `bm25(branches_fts)`
2. **FTS4 path**: still uses MATCH but falls back to **recency ordering** (no BM25 in FTS4)
3. **LIKE path**: searches `branches.aggregated_content` with per-term `LIKE` clauses joined by `AND` (no FTS at all)

Branch-level aggregation matters for BM25 because the unit being scored is the whole branch transcript summary — rare terms spread across multiple messages reinforce one branch result instead of fragmenting relevance across dozens of message rows. This is the clearest implementation-backed argument for branch-level FTS in Claudest.

> **Source**: `external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py`
> **Evidence type**: source-proven
> **Recommendation**: `(prototype later)` — branch aggregation is the right unit for ranked recall above an existing memory/document layer, but Public would need a session/branch graph first. The cascade pattern itself is borrowable independently as a portability hedge.

### 7.2 Chronological browsing is a separate, deterministic path

`external/plugins/claude-memory/skills/recall-conversations/scripts/recent_chats.py` reads active branches joined to sessions/projects, orders by `b.ended_at`, then reconstructs the visible transcript through `branch_messages -> messages`, hiding notifications by default. It probes `PRAGMA table_info(branches)` so pre-migration databases lacking `tool_counts` still work. **Search and chronological browsing are two distinct paths**, not a single unified retrieval call.

> **Source**: `external/plugins/claude-memory/skills/recall-conversations/scripts/recent_chats.py`
> **Evidence type**: source-proven
> **Recommendation**: `(adopt now)` — keeping ranked recall separate from "show me the latest relevant context" is sound; Public's `memory_context` already implements both modes (resume vs focused), but the explicit separation is worth preserving.

## 8. SESSIONSTART CONTEXT INJECTION (Q3)

### 8.1 Hook chain spans the lifecycle, not a user command

`external/plugins/claude-memory/hooks/hooks.json` proves the flow is hook-driven across lifecycle boundaries:

| Event | Matcher | Scripts |
|---|---|---|
| `SessionStart` | always | `memory-setup.py` |
| `SessionStart` | `startup\|clear` | `memory-context.py`, `consolidation-check.py` |
| `SessionEnd` | `clear` | `clear-handoff.py` |
| `Stop` | always | `memory-sync.py` |

This contrasts with Public's recovery model: `.opencode/agent/context-prime.md:34-39` and `.opencode/command/spec_kit/resume.md:257-261` use `session_bootstrap()` / `session_resume()` as **explicit pulls**, not automatic hook pushes.

> **Source**: `external/plugins/claude-memory/hooks/hooks.json`
> **Evidence type**: source-proven
> **Recommendation**: `(prototype later)` — automatic SessionStart push is operationally cheaper but less spec-folder-aware than Public's pull recovery.

### 8.2 Session selection is project-recency, not spec-folder-aware

`external/plugins/claude-memory/hooks/memory-context.py` `select_sessions()`:

- **On `clear`**: consumes `clear-handoff.json` only when the cwd matches and the handoff is younger than 30 seconds, hard-links to the cleared-from root session, appends one recent substantive supplementary session only when the cleared session has ≤2 exchanges.
- **On `startup`**: excludes the current session, scans recent active root sessions, skips ≤1-exchange sessions, keeps recent 2-exchange sessions, stops at the first substantive >2-exchange session.

This is a project-recency heuristic for conversational continuity — fundamentally different from Public's spec-folder-aware "next safe action" recovery in `.opencode/command/spec_kit/resume.md:257-285`.

> **Source**: `external/plugins/claude-memory/hooks/memory-context.py` `select_sessions()`
> **Evidence type**: source-proven
> **Recommendation**: `(prototype later)` — useful as a complementary lane for plain conversational recall, not a replacement for spec-folder recovery.

### 8.3 Cached summary fast path turns startup recall into a DB lookup

`external/plugins/claude-memory/hooks/memory-context.py` and `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/summarizer.py` source-prove the cached path:

1. `_CANDIDATE_QUERY` fetches `branches.context_summary`
2. `_load_messages_for()` only loads branch messages for entries **missing** that cache
3. `build_context()` prefers cached markdown and falls back to `_build_fallback_context()`
4. `main()` wraps the result with `build_origin_block()` and emits `{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":...}}`

This matches the consumer-side assumption documented in `.opencode/agent/deep-research.md:438-442` — Public agents already know how to consume hook-injected startup context — but the producer here is **cache-backed and project-local**, not memory-MCP-backed.

> **Source**: `external/plugins/claude-memory/hooks/memory-context.py`, `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/summarizer.py`
> **Evidence type**: source-proven
> **Recommendation**: `(adopt now)` — pre-computing a cached `context_summary` per branch (or per spec folder, in Public's case) and serving it from a fast lookup is the highest-leverage SessionStart improvement available. Public's `session_bootstrap()` could persist a derived summary at write time and serve it at SessionStart without an MCP roundtrip.

### 8.4 Summaries are precomputed at Stop / import time, deterministically

`external/plugins/claude-memory/hooks/sync_current.py` and `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/summarizer.py` show the producer side: Stop-time `memory-sync.py` writes branch metadata, rebuilds `aggregated_content`, then calls `compute_context_summary()` and stores `branches.context_summary`, `context_summary_json`, and `summary_version = 2`. The same summarizer is also called by `external/plugins/claude-memory/hooks/import_conversations.py`.

The summarizer comment is explicit: **"All extraction is deterministic Python — no LLM calls."** That makes the summary cheap, but narrower than Public's broader readiness bundle in `README.md:536-543` and `.opencode/agent/context-prime.md:36-39,61-65`.

> **Source**: `external/plugins/claude-memory/hooks/sync_current.py`, `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/summarizer.py`, caller sweep `external/plugins/claude-memory/hooks/import_conversations.py`
> **Evidence type**: source-proven
> **Recommendation**: `(adopt now)` — deterministic summary computation at Stop time is exactly the pattern Public should adopt for its own session-end / spec-save flow.

### 8.5 Fallback rendering does NOT match its docstring

`_build_fallback_context()` in `memory-context.py` advertises a "last 3 exchanges" path in its docstring, but the implementation actually mirrors the same short-session/full render and long-session "first-2 plus last-6" structure used by `render_context_summary()`. **Source contradicts documentation**; trust the source.

> **Source**: `external/plugins/claude-memory/hooks/memory-context.py` `_build_fallback_context()` vs its docstring
> **Evidence type**: source-proven contradiction
> **Note**: borrow the actual implementation, not the docstring claim.

## 9. EXTRACT-LEARNINGS & CONSOLIDATION AGENTS (Q5)

### 9.1 Four-phase consolidation, not raw write-through

`external/plugins/claude-memory/skills/extract-learnings/SKILL.md` defines a four-phase pipeline:

1. **Orient** — read the current hierarchy and existing memory state
2. **Gather** — dispatch two parallel specialists (`memory-auditor`, `signal-discoverer`)
3. **Synthesize** — bound output to **3-7 ranked candidates** with explicit layer/action decisions
4. **Execute** — write only approved edits

The pipeline explicitly **rules out** the idea that consolidation writes raw recalled conversations directly into memory. Ranking, deduplication, target-layer selection, proposal review, and approval all happen before any mutation. This is a stronger contract than direct signal-to-memory writes.

> **Source**: `external/plugins/claude-memory/skills/extract-learnings/SKILL.md`
> **Evidence type**: source-proven
> **Recommendation**: `(adopt now)` — the bounded-candidate + propose-then-execute contract is directly transferable to Public's existing signal-extraction work in `system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction`.

### 9.2 `memory-auditor` is a verifier, not a discoverer

`external/plugins/claude-memory/agents/memory-auditor.md` makes the role unambiguous: parse concrete entities already stored in memory, check them against codebase and git evidence, emit only `STALE`, `CONTRADICT`, `MERGE`, or `DATE_FIX` findings with proof and replacement text. **No new knowledge** — only verification of existing claims.

> **Source**: `external/plugins/claude-memory/agents/memory-auditor.md`, `external/plugins/claude-memory/skills/extract-learnings/SKILL.md`
> **Evidence type**: source-proven
> **Recommendation**: `(adopt now)` — Public's consolidation work should reserve one explicit lane for evidence-backed memory maintenance, separate from raw signal extraction.

### 9.3 `signal-discoverer` is a miner, not a verifier

`external/plugins/claude-memory/agents/signal-discoverer.md` mines recent sessions, generalizes incidents into reusable principles, and classifies them as `UPDATE`, `CONTRADICT`, `FILL_GAP`, or `NOISE`, with optional promotion to `Meta` when a pattern should become a skill.

> **Source**: `external/plugins/claude-memory/agents/signal-discoverer.md`, `external/plugins/claude-memory/skills/extract-learnings/SKILL.md`
> **Evidence type**: source-proven
> **Recommendation**: `(adopt now)` — the discover/verify split reduces noisy or overly session-specific memory writes; useful complement to `008-signal-extraction`.

### 9.4 Two operating modes: simple capture vs full consolidation

The skill explicitly distinguishes:
- **Direct capture mode** — if the user already supplied explicit content and did not trigger consolidation mode, the workflow skips subagents and jumps straight to propose-and-execute.
- **Consolidation mode** — full four-phase pipeline.
- **Bootstrap mode** — if `MEMORY.md` is brand new, skip `memory-auditor` entirely and run only discovery.

> **Source**: `external/plugins/claude-memory/skills/extract-learnings/SKILL.md`
> **Evidence type**: source-proven
> **Recommendation**: `(prototype later)` — Public should consider two modes: lightweight direct capture for explicit `/memory:save` and a heavier consolidation pass when reconciling recall output with the memory hierarchy.

## 10. MEMORY HIERARCHY COMPARISON (Q6)

### 10.1 Claudest's L0–L3 file hierarchy

Claudest treats memory as a layered file hierarchy with always-loaded and on-demand tiers:

| Layer | File | Loaded |
|---|---|---|
| L0 | `~/.claude/CLAUDE.md` | every session |
| L1 | `<repo>/CLAUDE.md` | every session |
| L2 | `memory/MEMORY.md` | every session |
| L3 | `memory/*.md` topic files | on demand |

`MEMORY.md` is an agent-managed "working knowledge" note that `extract-learnings` reads, edits, and trims; topic files are used only when the summary becomes too long.

> **Source**: `external/plugins/claude-memory/skills/extract-learnings/SKILL.md`, `external/plugins/claude-memory/README.md`

### 10.2 Public's stack already has stronger retrieval

Public has repo-wide instruction loading via `CLAUDE.md` plus auto-surfaced constitutional and trigger-driven memory retrieval via `.opencode/skill/system-spec-kit/SKILL.md`. Spec-folder-scoped context preservation runs through `generate-context.js`, with retrieval via `memory_context()` / `memory_search()`. Five-channel hybrid search, intent-aware routing, importance tiers, trigger matching, and `/spec_kit:resume` recovery already exist.

Public does **not** have a top-level `MEMORY.md`, and adding one as an always-loaded file would mostly duplicate the existing instruction and recovery surfaces.

> **Source**: `CLAUDE.md`, `.opencode/skill/system-spec-kit/SKILL.md`, `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`

### 10.3 Verdict: borrow the placement rubric, not the hierarchy

The strongest transferable idea is **not the extra file layer** but the **placement rubric** — extract-learnings explicitly classifies whether a learning belongs in global instructions, repo instructions, concise working memory, or deeper topic files, and requires explicit approval before writing.

> **Recommendation**:
> - Adding an always-loaded `MEMORY.md` to Public: `(reject)` — duplicate of existing instruction loading.
> - Treating `MEMORY.md` as a derived human-readable summary (not a source of truth): `(prototype later)`.
> - Borrowing the placement rubric ("where should this learning live?") as a consolidation heuristic mapped onto Public's existing surfaces: `(adopt now)`.
> - Replacing Public's retrieval engine with Claudest's hierarchy: `(reject)` — Public is already richer.

## 11. TOKEN-USAGE OBSERVABILITY: INGESTION & ANALYTICS (Q7)

### 11.1 JSONL ingestion yields a relational session/turn/hook model

`external/plugins/claude-memory/skills/get-token-insights/scripts/ingest_token_data.py`:

- `discover_jsonl_files()` (lines 282-297) walks both top-level session JSONL files and nested `*/subagents/*.jsonl`.
- `parse_session()` (lines 394-580) groups assistant events by `message.id` into one logical turn while updating usage to the latest event, extracting `input_tokens`, `output_tokens`, `cache_read_input_tokens`, `cache_creation_input_tokens`, ephemeral 5m/1h cache tiers, tool metadata, tool-result errors, `turn_duration`, and hook summaries.

This goes beyond Stop-hook token snapshots: it produces a **reusable turn/session/hook relational model** ready for analytics.

> **Source**: `external/plugins/claude-memory/skills/get-token-insights/scripts/ingest_token_data.py` (`discover_jsonl_files`, `parse_session`)
> **Evidence type**: source-proven
> **Recommendation**: `(adopt now)` — the ingestion contract is exactly what `system-spec-kit/024-compact-code-graph/003-stop-hook-tracking` lacks for richer analytics.

### 11.2 Pricing and cache normalization is per-tier

`MODEL_PRICING`, `_get_pricing()`, `_turn_cost()`, and `build_output()` (lines 62-96, 910-967):

- Substring-match model IDs to a price table; default unknowns to Sonnet pricing.
- Split cost into **uncached input**, **output**, **cache read**, **5-minute cache writes**, and **1-hour cache writes**.
- Any cache creation not explicitly classified is conservatively billed as **5-minute cache write**.

> **Source**: `external/plugins/claude-memory/skills/get-token-insights/scripts/ingest_token_data.py` (`MODEL_PRICING`, `_get_pricing`, `_turn_cost`)
> **Evidence type**: source-proven
> **Recommendation**: `(adopt now)` — per-model and per-cache-tier cost normalization is the missing piece for trustworthy spend reporting in Public's existing token-tracking work.

### 11.3 Cache-cliff metric is the standout workflow diagnostic

`compute_session_analytics()`, `build_output()`, `build_trends()`, `_build_insights()` (lines 604-655, 974-989, 1314-1323, 1427-1518, 1669-1874) define a cache cliff as:

> a `cache_read_ratio` drop greater than `0.5` after a `user_gap_ms` longer than `300_000` (5 minutes idle).

Per-session cliff counts feed week-on-week metrics: `cost_per_session`, `cache_ratio`, `cliffs_per_session`, `tool_error_rate`, `hook_avg_ms`. **This is the strongest contrast** with simple Stop-hook tracking — it turns idle gaps + cache behavior into workflow diagnostics and dollar-impact insights, not just raw token counts.

> **Source**: `external/plugins/claude-memory/skills/get-token-insights/scripts/ingest_token_data.py`
> **Evidence type**: source-proven
> **Recommendation**: `(adopt now)` — cache-cliff detection is high-leverage and inexpensive to implement once per-turn cache ratios are tracked.

### 11.4 Skill / agent / hook analytics from normalized tool calls

The same script derives:
- `skill_usage` from normalized Skill tool calls
- `agent_delegation` from `subagent_type` counts plus error counts
- `agent_model_dist` from explicit model overrides
- `hook_performance` from per-command run count, total runtime, average runtime, and errors

The dashboard then consumes these arrays directly for the "Claude Code Ecosystem" view plus trend badges and disable-candidate tables.

> **Source**: `external/plugins/claude-memory/skills/get-token-insights/scripts/ingest_token_data.py` (lines 1238-1310, 2011-2018), `external/plugins/claude-memory/skills/get-token-insights/templates/dashboard.html` (lines 473-496, 981-1067, 1118-1286)
> **Evidence type**: source-proven
> **Recommendation**: `(prototype later)` for the full analytics package; `(adopt now)` for the JSON contract shapes (see §12).

## 12. DASHBOARD CONTRACT: BORROWABLE SECTIONS (Q8)

### 12.1 Dashboard is a single-file embedded artifact

`deploy_dashboard()` (`ingest_token_data.py:1936-1944`) replaces `/* __INLINE_DATA_PLACEHOLDER__ */` in the HTML template with `const _INLINE_DATA = {json}`. The dashboard boot path (HTML lines 1290-1303) reads `_INLINE_DATA` directly. **Not server-rendered, not JSON-fetch-rendered — a single self-contained HTML file with inline data.**

> **Source**: `external/plugins/claude-memory/skills/get-token-insights/templates/dashboard.html` + `scripts/ingest_token_data.py` (`deploy_dashboard`)
> **Evidence type**: source-proven

### 12.2 Section catalog with payload contracts

| Section | Payload fields |
|---|---|
| **Header / KPIs** | `generated_at`, `total_sessions`, `date_range.{earliest,latest}`, `kpis.{total_sessions,total_turns,total_output_tokens,global_cache_ratio,cache_cliffs,max_token_stops,bash_antipatterns,tool_error_rate,total_cost_usd}` |
| **Sessions by Day** | `sessions_by_day[].{date,session_count}` |
| **Token Composition by Day** | `sessions_by_day[].{output_tokens,input_tokens,cache_read,cache_creation}` |
| **Top Tools** | `top_tools[].{tool,count}` |
| **Model Cost Split** | `model_split[].{model,input_tokens,output_tokens,thinking_tokens,cost_usd}` |
| **Cost by Day** | `cost_by_day[].{date,cost_usd}` |
| **Cost by Project** | `cost_by_project[].{project,cost_usd}` |
| **Per-Project Token Spend** | `project_spend[].{project,input_tokens,cache_creation}` |
| **Project Tool Profiles** | `project_tool_profile[].{project,tools{}}` (per-project tool→count map) |
| **Context Management** | `cache_trajectory[].{project,session_id,turns[].{turn,ratio}}`, `ephem_split[].{project,ephem_5m,ephem_1h}` |
| **Tool Efficiency** | `bash_antipatterns[].{project,antipatterns,total_bash}`, `tool_errors_by_tool[].{tool,errors,total}`, `redundant_reads[].{file,count}`, `edit_retries[].{project,retries}` |
| **Behavioral Patterns** | `agent_cost[].{project,parent_cost,agent_cost}`, `turn_complexity.{minimal,light,medium,heavy,runaway}`, `thinking_in_complexity.{minimal,light,medium,heavy,runaway}`, `response_time_dist.{under_30s,30s_2m,2m_5m,5m_15m,over_15m}`, `hook_overhead[].{project,hook_ms}` |
| **Claude Code Ecosystem** | `skill_usage[].{skill,count,errors}`, `agent_delegation[].{subagent_type,count,errors}`, `hook_performance[].{hook_command,total_ms,runs,avg_ms,errors}` |
| **Findings** | `findings[].{severity,title,text}` |
| **Recommendations** | `recommendations[].{priority,text}` |
| **Week-on-Week Trends** (optional) | `trends.current_window.{sessions,cost_usd,turns}`, `trends.prior_window.{...}`, `trends.metrics.{cost_per_session,cache_ratio,cliffs_per_session,antipatterns_per_session,tool_error_rate,hook_avg_ms}.{label,prior,current,change_pct}`, `trends.improved[]`, `trends.regressed[]`, `trends.new_skills[]`, `trends.retired_skills[]`, `trends.hook_trends[].{hook,prior_ms,current_ms,change_pct}` |

> **Source**: `external/plugins/claude-memory/skills/get-token-insights/templates/dashboard.html`

### 12.3 What to borrow vs what to skip

**Borrow now (highest signal, presentation-agnostic)**:
- The summary `kpis` object (header contract)
- `cost_by_project`, `project_spend`, `project_tool_profile` — directly usable for Public's per-project reporting
- `cache_trajectory`, `tool_errors_by_tool`, `hook_overhead` — align with existing session/hook/observability work
- `trends`, `skill_usage`, `agent_delegation`, `hook_performance`, `findings`, `recommendations` — the cleanest selective-import package

**Skip / reject**:
- The full HTML/CSS/Chart.js/Google Fonts presentation bundle, scanline overlay, marquee ticker, neon theme — chrome, not contract.
- The "Skills to Consider Disabling" widget threshold (`count <= 2`) — opinionated product policy, not a reusable observability primitive. Borrow the underlying `skill_usage` array instead.
- `redundant_reads`, `edit_retries`, turn-complexity histograms — useful but second-order; do not need to ship in the first borrowing pass.

> **Recommendation**:
> - KPI summary + per-project cost contracts: `(adopt now)`
> - Trends/skill/agent/hook/findings/recommendations contracts: `(adopt now)`
> - Cache/error/hook diagnostic contracts: `(prototype later)` (depends on per-turn cache tracking landing first)
> - Full HTML presentation layer: `(reject)`

## 13. RECOMMENDATION MATRIX (Q10) — SYNTHESIS ANSWER

The matrix below rolls up every iteration's recommendations into a single ordered table prioritized by impact-effort.

### 13.1 ADOPT NOW — high impact, low/medium effort

| # | Pattern | Source evidence | Affected Public subsystem |
|---|---|---|---|
| A1 | **Runtime FTS capability cascade** (`detect_fts_support()` reading `PRAGMA compile_options`, FTS5 → FTS4 → none, with same logical search API at every level) | `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py` | Spec Kit Memory MCP storage layer; complement to `system-spec-kit/023-hybrid-rag-fusion-refinement/013-fts5-fix-and-search-dashboard` |
| A2 | **Cached `context_summary` SessionStart fast path** — pre-compute summaries at Stop time, serve from a lookup at SessionStart, never replay raw transcripts | `external/plugins/claude-memory/hooks/memory-context.py`, `hooks/sync_current.py`, `skills/recall-conversations/scripts/memory_lib/summarizer.py` | `session_bootstrap()` / `session_resume()`; `generate-context.js` could persist a derived summary at write time |
| A3 | **Deterministic Python summary computation at Stop time** ("no LLM calls") for cheap, reliable session-end snapshots | `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/summarizer.py` | `generate-context.js` post-save flow; `/spec_kit:handover` |
| A4 | **Auditor vs discoverer split** for consolidation work — verifier emits only STALE/CONTRADICT/MERGE/DATE_FIX; discoverer mines for UPDATE/CONTRADICT/FILL_GAP/NOISE/Meta | `external/plugins/claude-memory/agents/memory-auditor.md`, `agents/signal-discoverer.md`, `skills/extract-learnings/SKILL.md` | `system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction`; `/memory:save` post-save quality review |
| A5 | **4-phase consolidation contract**: orient → gather → synthesize (3-7 ranked candidates) → execute approved | `external/plugins/claude-memory/skills/extract-learnings/SKILL.md` | `008-signal-extraction`; `improve:agent` |
| A6 | **Per-tier pricing and cache normalization** (uncached input / output / cache read / 5m write / 1h write; conservative defaulting) | `external/plugins/claude-memory/skills/get-token-insights/scripts/ingest_token_data.py` (`MODEL_PRICING`, `_turn_cost`) | `system-spec-kit/024-compact-code-graph/003-stop-hook-tracking` |
| A7 | **Cache-cliff metric** (`cache_read_ratio` drop > 0.5 after `user_gap_ms` > 300_000ms) as the primary workflow diagnostic | `external/plugins/claude-memory/skills/get-token-insights/scripts/ingest_token_data.py` (`compute_session_analytics`, `_build_insights`) | Stop-hook tracking; future Public observability dashboard |
| A8 | **Dashboard JSON contracts** for `kpis`, `cost_by_project`, `project_spend`, `project_tool_profile`, `trends`, `skill_usage`, `agent_delegation`, `hook_performance`, `findings`, `recommendations` — borrow the contracts, not the HTML | `external/plugins/claude-memory/skills/get-token-insights/templates/dashboard.html`, `scripts/ingest_token_data.py:1936-1944` | Future Public observability surface |
| A9 | **Cross-manifest version validation rule** (if a catalog + per-package manifests are ever introduced) | `external/.claude-plugin/marketplace.json` + `external/plugins/*/.claude-plugin/plugin.json` parity check | Hypothetical Public marketplace layer |
| A10 | **Placement rubric for memory consolidation** ("where should this learning live?") — global instructions vs repo instructions vs working memory vs topic files — mapped onto Public's existing surfaces (CLAUDE.md, spec folder memory, MCP tiers) | `external/plugins/claude-memory/skills/extract-learnings/SKILL.md`, `external/plugins/claude-memory/README.md` | `/memory:save`, `/memory:learn`, post-save quality review |
| A11 | **Search/browse separation** — keep ranked recall (BM25-style) and chronological browsing as two distinct paths, not a single unified call | `external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py` vs `recent_chats.py` | `memory_context` modes (already partially implemented) |
| A12 | **Thin per-package manifests** — if Public ever distributes bundles, keep local manifests as identity descriptors only | `external/plugins/claude-memory/.claude-plugin/plugin.json` | Hypothetical Public marketplace layer |

### 13.2 PROTOTYPE LATER — high impact, medium/high effort or dependency on missing infrastructure

| # | Pattern | Source evidence | Dependency / cost |
|---|---|---|---|
| P1 | **Branch-aware FTS recall** (rank whole branches via `branches_fts`, hydrate exact transcripts after) | `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py`, `search_conversations.py` | Requires Public to maintain a session/branch graph it does not currently have |
| P2 | **Project-recency session selection** for SessionStart conversational continuity | `external/plugins/claude-memory/hooks/memory-context.py` `select_sessions()` | Useful as a complementary lane to spec-folder recovery, not a replacement |
| P3 | **Two-mode consolidation** (lightweight direct capture vs full consolidation pass) | `external/plugins/claude-memory/skills/extract-learnings/SKILL.md` | Mode-routing inside `/memory:save` |
| P4 | **Single-file embedded HTML dashboard** as a deploy mode for Public observability data, but with Public-native theme | `dashboard.html` + `deploy_dashboard()` | Build pipeline that embeds JSON into a template |
| P5 | **Marketplace catalog manifest** above `.opencode/skill/` | `external/.claude-plugin/marketplace.json` | Only if Public ships distributable bundles |
| P6 | **Derived `MEMORY.md` summary view** (NOT as a source of truth, only as a human-readable rollup of spec-folder memory) | `external/plugins/claude-memory/skills/extract-learnings/SKILL.md` | Read-only generator, not a write target |
| P7 | **Diagnostic dashboard contracts** (`cache_trajectory`, `tool_errors_by_tool`, `hook_overhead`) | `dashboard.html` + analytics builder | Depends on per-turn cache ratio tracking landing first |

### 13.3 REJECT — high cost, low marginal value, or already covered

| # | Pattern | Why reject |
|---|---|---|
| R1 | **Auto-update behavior** as documented in `external/README.md` | Owned by Claude `/plugin` runtime, not by repo metadata. Public would have to build an installer/runtime to own update semantics. |
| R2 | **Always-loaded `MEMORY.md` file at repo root** | Duplicates Public's existing repo-wide instruction loading via `CLAUDE.md` and auto-surfaced constitutional memory. |
| R3 | **Replacing Public's retrieval engine with Claudest's hierarchy** | Public's Spec Kit Memory has hybrid search, intent routing, importance tiers, trigger matching, and spec-folder scoping — strictly richer than Claudest's file hierarchy. |
| R4 | **Full `dashboard.html` HTML/CSS/Chart.js/Google Fonts presentation bundle** | Plugin-specific chrome, not durable value. Borrow the data contracts (§13.1 A8) instead. |
| R5 | **"Skills to Consider Disabling" widget as-is** (`count <= 2` threshold) | Opinionated product policy, not a reusable primitive. Borrow `skill_usage` array, decide own thresholds. |
| R6 | **Treating per-plugin `plugin.json` as the place where update behavior is configured** | Manifests are metadata-only; update behavior lives in the runtime, not the file. |

## 14. CROSS-PHASE AWARENESS

| Adjacent phase | Relationship to 005-claudest |
|---|---|
| `001-claude-optimization-settings` (Reddit audit post) | The Reddit audit post described an audit; **005-claudest is the implementation that produced that audit narrative**. Phase 001 extracts patterns; phase 005 examines source. **No duplication** — 005 deliberately leaves config-audit lessons to 001. |
| `system-spec-kit/023-hybrid-rag-fusion-refinement/013-fts5-fix-and-search-dashboard` | Direct comparison target for §6.2 and §7. Public's existing FTS5 work is the baseline; Claudest's `detect_fts_support()` cascade is the portability hedge. |
| `system-spec-kit/024-compact-code-graph/003-stop-hook-tracking` | Direct comparison target for §11. Public's Stop-hook token tracking is token-counting-first; Claudest's `get-token-insights` adds per-tier pricing, cache cliffs, and workflow diagnostics. |
| `system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction` | Direct comparison target for §9. Public's signal-extraction work would benefit from the auditor/discoverer split and the bounded-candidate consolidation contract. |
| Sibling phases `002-codesight`, `003-contextador`, `004-graphify` | No overlap. Different problem domains. |

## 15. OPEN QUESTIONS & LIMITATIONS

- **Q10 is meta** — answered as the §13 recommendation matrix from the prior 9 source-grounded findings, not as a separate evidentiary iteration.
- **`external/plugins/claude-memory/CLAUDE.md` does not exist** in this checkout — the per-plugin layer model had to be reconstructed from `claude-memory/README.md` and the `extract-learnings` skill instead.
- **`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/MEMORY.md` does not exist** — Public side comparison used `CLAUDE.md` + `system-spec-kit/SKILL.md` + `generate-context.js` instead.
- **Iteration 1 prompt referenced `external/plugins/get-token-insights/.claude-plugin/plugin.json`** as a top-level plugin; that was a prompt mistake. `get-token-insights` is a SKILL inside the `claude-memory` plugin (`external/plugins/claude-memory/skills/get-token-insights/`). This was corrected from iteration 2 onward.
- **`_build_fallback_context()` docstring contradicts implementation** — the actual fallback is the "first-2 plus last-6" structure used by `render_context_summary()`, not the "last 3 exchanges" claimed in the docstring. Source contradicts documentation.
- **Plugin runtime not exercised** — all findings are from static source inspection; live plugin behavior under `/plugin marketplace add` was not validated, by design (out of scope).

## 16. SOURCES CONSULTED

### 16.1 Marketplace and manifests
- `external/.claude-plugin/marketplace.json`
- `external/plugins/claude-memory/.claude-plugin/plugin.json`
- `external/plugins/claude-skills/.claude-plugin/plugin.json`
- Sweep across `external/plugins/*/.claude-plugin/plugin.json`
- `external/README.md`
- `external/CLAUDE.md`
- `external/plugins/` (directory listing)

### 16.2 claude-memory storage and recall
- `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py`
- `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/summarizer.py`
- `external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py`
- `external/plugins/claude-memory/skills/recall-conversations/scripts/recent_chats.py`
- `external/plugins/claude-memory/skills/recall-conversations/SKILL.md`
- `external/plugins/claude-memory/README.md`

### 16.3 claude-memory hooks
- `external/plugins/claude-memory/hooks/hooks.json`
- `external/plugins/claude-memory/hooks/memory-context.py`
- `external/plugins/claude-memory/hooks/sync_current.py`
- `external/plugins/claude-memory/hooks/import_conversations.py`

### 16.4 extract-learnings and consolidation agents
- `external/plugins/claude-memory/skills/extract-learnings/SKILL.md`
- `external/plugins/claude-memory/agents/memory-auditor.md`
- `external/plugins/claude-memory/agents/signal-discoverer.md`

### 16.5 get-token-insights
- `external/plugins/claude-memory/skills/get-token-insights/SKILL.md`
- `external/plugins/claude-memory/skills/get-token-insights/scripts/ingest_token_data.py`
- `external/plugins/claude-memory/skills/get-token-insights/templates/dashboard.html`

### 16.6 Public-side comparison reads
- `CLAUDE.md`
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
- `.opencode/agent/context-prime.md`
- `.opencode/agent/deep-research.md`
- `.opencode/command/spec_kit/resume.md`
- `README.md`

## 17. APPENDIX: CONVERGENCE REPORT

| Field | Value |
|---|---|
| Stop reason | composite_converged (question coverage 0.90 ≥ 0.85 threshold) |
| Total iterations | 7 |
| Questions answered | 9 / 10 (Q10 rolled up into synthesis matrix §13) |
| Remaining questions | 1 (Q10, meta) |
| Convergence threshold | 0.05 (newInfoRatio floor) — never triggered (lowest ratio 0.68 > 0.05) |
| Convergence score (final) | 0.84 |
| newInfoRatio trajectory | 0.95 → 0.84 → 0.82 → 0.79 → 0.82 → 0.71 → 0.68 |
| Stuck count | 0 |
| Key findings produced | 28 |
| Iteration agent | `cli-codex` (`gpt-5.4`, `model_reasoning_effort=high`, `--full-auto`) for all 7 iterations |
| Default `@deep-research` agent | NOT used (overridden via `delegation` block in config) |
| Quality guard violations | None recorded by reducer pass |

### Iteration summary

| # | Focus | Track | newInfoRatio | Findings |
|---|---|---|---|---|
| 1 | marketplace discovery + versioning | marketplace | 0.95 | 4 |
| 2 | claude-memory SQLite schema + recall cascade | memory | 0.84 | 4 |
| 3 | SessionStart context injection flow | hooks | 0.82 | 4 |
| 4 | extract-learnings + auditor vs discoverer | extraction | 0.79 | 4 |
| 5 | get-token-insights ingestion + dashboard | observability | 0.82 | 4 |
| 6 | dashboard contract + borrowable sections | observability | 0.71 | 4 |
| 7 | memory hierarchy comparison | comparison | 0.68 | 4 |

### Notes on the loop

- **Iteration 2 was retried** after the first dispatch hung in the foreground for >50 minutes with no output. The retry (via stdin pipe instead of `"$(cat ...)"`) completed in ~5 minutes. Root cause: the long heredoc-via-command-substitution prompt likely interacted poorly with codex's argv handling. Stdin pipe is the more reliable invocation pattern for long prompts.
- **Iterations 2 and 3 had `answeredQuestions` mismatches** — codex sometimes paraphrased the strategy.md §3 question text instead of copying it verbatim, causing the reducer to leave questions open. Fixed in-place by editing the JSONL records to restore the verbatim text, then re-running the reducer. Subsequent iterations used explicit "VERBATIM Q text" guidance in the prompt and the issue did not recur.
- **All iteration files** are write-once and remain in `research/iterations/` for audit.

---

**STATUS=OK**
**PATH=`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest`**

## 18. Recommendation Matrix (iteration 8 synthesis)

This continuation pass keeps the run-7 synthesis intact and adds the explicit nine-track decision matrix requested for iteration 8. The key resolution is to separate "portable pattern we should copy" from "larger Claudest subsystem we should not import wholesale."

| Track | Label | Iteration 8 synthesis |
|---|---|---|
| Marketplace discovery + versioning | `prototype later` | The marketplace catalog plus thin per-plugin manifests is a sound packaging model, but Public only needs it if it starts shipping distributable bundles; if that happens, make version-parity validation mandatory immediately. [SOURCE: external/.claude-plugin/marketplace.json] [SOURCE: external/plugins/claude-memory/.claude-plugin/plugin.json] |
| claude-memory SQLite schema | `prototype later` | The v3 schema is inseparable from branch/session graph ownership, so it stays in the prototype lane until Public has matching branch infrastructure. [SOURCE: external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py] |
| recall-conversations BM25/FTS5 cascade | `adopt now` | Public can adopt the runtime FTS capability cascade and search-vs-browse split now without taking on the whole branch-ranked recall model. [SOURCE: external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py] [SOURCE: external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py] [SOURCE: external/plugins/claude-memory/skills/recall-conversations/scripts/recent_chats.py] |
| SessionStart context injection | `adopt now` | Borrow the cached `context_summary` fast path and deterministic Stop-time summarization, but keep them inside Public's existing resume/bootstrap surfaces instead of replacing recovery with Claude's hook-driven session-recency heuristic. [SOURCE: external/plugins/claude-memory/hooks/memory-context.py] [SOURCE: external/plugins/claude-memory/hooks/sync_current.py] [SOURCE: external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/summarizer.py] |
| extract-learnings pipeline + memory-auditor/signal-discoverer | `adopt now` | The orient -> gather -> synthesize -> execute workflow and the verifier/discoverer split are directly useful now and already align with Public's signal-extraction direction. [SOURCE: external/plugins/claude-memory/skills/extract-learnings/SKILL.md] [SOURCE: external/plugins/claude-memory/agents/memory-auditor.md] [SOURCE: external/plugins/claude-memory/agents/signal-discoverer.md] |
| get-token-insights ingestion | `adopt now` | The ingest layer's pricing normalization, cache-tier accounting, cache-cliff metric, and subagent-aware aggregation are reusable observability primitives independent of any UI. [SOURCE: external/plugins/claude-memory/skills/get-token-insights/scripts/ingest_token_data.py] [SOURCE: external/plugins/claude-memory/skills/get-token-insights/SKILL.md] |
| get-token-insights dashboard contract | `adopt now` | Borrow the KPI, spend, trends, skill/agent/hook, findings, and recommendations contracts, but keep the HTML/CSS/Chart.js shell rejected. [SOURCE: external/plugins/claude-memory/skills/get-token-insights/templates/dashboard.html] [SOURCE: external/plugins/claude-memory/skills/get-token-insights/scripts/ingest_token_data.py] |
| Memory hierarchy comparison | `reject` | Reject Claudest's extra always-loaded `MEMORY.md` hierarchy as a new system for Public; the transferable residue is only the placement rubric, and that should be applied via consolidation rules rather than a second memory stack. [SOURCE: external/plugins/claude-memory/README.md] [SOURCE: external/plugins/claude-memory/skills/extract-learnings/SKILL.md] |
| Plugin auto-update | `reject` | Auto-update is documented as Claude runtime behavior rather than repository metadata, so there is nothing portable to implement at the repo layer yet. [SOURCE: external/README.md] [SOURCE: external/.claude-plugin/marketplace.json] [SOURCE: external/plugins/claude-memory/.claude-plugin/plugin.json] |

### 18.1 Tension resolution

- **Marketplace tension resolved:** defer the marketplace layer itself, but if Public ever introduces one, immediately keep manifests thin and add version-parity validation. [SOURCE: external/.claude-plugin/marketplace.json] [SOURCE: external/plugins/claude-memory/.claude-plugin/plugin.json]
- **Recall tension resolved:** adopt the FTS capability cascade now, while keeping the branch-ranked schema and transcript-hydration model in prototype-later because they require infrastructure Public does not yet own. [SOURCE: external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py] [SOURCE: external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py]
- **SessionStart tension resolved:** adopt precomputed summary injection, reject replacing spec-folder-aware recovery with the Claude hook-recency heuristic. [SOURCE: external/plugins/claude-memory/hooks/memory-context.py] [SOURCE: external/plugins/claude-memory/hooks/sync_current.py]
- **Memory-hierarchy tension resolved:** reject the extra hierarchy as a system, but keep the placement rubric as an extract-learnings decision rule. [SOURCE: external/plugins/claude-memory/README.md] [SOURCE: external/plugins/claude-memory/skills/extract-learnings/SKILL.md]

### 18.2 Sequencing & Prerequisites (iteration 9)

Iteration 9 converts the matrix above into implementation order. The main conclusion is that none of the `adopt now` lanes are truly standalone; each one is safest as an extension of an already-existing Public packet family rather than as a fresh subsystem. [SOURCE: research/iterations/iteration-009.md] [SOURCE: research/iterations/iteration-008.md]

| Sequence | Item | Sequencing view |
|---|---|---|
| 1 | recall-conversations BM25/FTS5 cascade | Move first, because `023-hybrid-rag-fusion-refinement/013-fts5-fix-and-search-dashboard` already hardened FTS correctness, scope filtering, and runtime observability. This is the cleanest immediate adoption lane. [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/013-fts5-fix-and-search-dashboard/implementation-summary.md] |
| 2 | extract-learnings pipeline + memory-auditor / signal-discoverer split | Move second, because `022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction` already provides the unified semantic signal substrate that the discoverer/auditor split needs. [SOURCE: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md] |
| 3 | SessionStart context injection | Move after the recall and consolidation lanes, because `024-compact-code-graph/002-session-start-hook` and `024-compact-code-graph/003-stop-hook-tracking` already provide routing plus summary capture, but the injected payload should be curated output, not raw session recency. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md] |
| 4 | get-token-insights ingestion | Move before any dashboard contract. `024/003` already parses transcript JSONL, estimates cost, and stores token snapshots, so Public can prototype the ingest contract now while treating cross-session aggregation as follow-on hardening. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md] |
| 5 | get-token-insights dashboard contract | Move last in the adopt-now lane so the KPI/recommendation schema follows the stabilized ingestion shape rather than forcing presentation-first design. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md] [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/013-fts5-fix-and-search-dashboard/implementation-summary.md] |

For the `prototype later` track, the marketplace/versioning lane still has no consumer until Public actually ships installable bundles or plugins, while the branch-ranked SQLite schema still lacks its required Public-side branch/session graph. `024/002` and `024/003` partially unlock lifecycle hooks, and `023/013` partially unlocks the FTS/search contract, but none of the consulted packets provide the missing branch/message ownership model yet. [SOURCE: research/iterations/iteration-009.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md] [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/013-fts5-fix-and-search-dashboard/implementation-summary.md]

### 18.3 Smallest Safe v1 per adopt-now lane (iteration 10)

Iteration 10 keeps the iteration-8 matrix and iteration-9 order intact, but narrows each `adopt now` lane to the smallest Public-safe v1 slice. The main correction is that `024/003` unblocks collection, not analytics-grade cross-session reporting. [SOURCE: research/iterations/iteration-010.md] [SOURCE: research/iterations/iteration-009.md]

- **FTS capability cascade:** Safe v1 is only the backend-selection contract inside the current search pipeline: `FTS5 + BM25 -> FTS4 -> LIKE`, with the same logical result shape and explicit backend diagnostics. No branch-ranked recall or schema import belongs in v1. [SOURCE: research/iterations/iteration-010.md] [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/013-fts5-fix-and-search-dashboard/implementation-summary.md]
- **SessionStart precomputed-summary fast path:** Safe v1 is Stop-time write plus SessionStart read of one bounded cached summary object on `resume` and `compact`, while leaving `startup`, `clear`, and the existing recovery surfaces untouched. [SOURCE: research/iterations/iteration-010.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md]
- **extract-learnings auditor/discoverer split:** Safe v1 is a read-first split where the discoverer emits ranked candidates and the auditor only validates proposed changes with constrained verdict labels. No direct storage writes belong in the first cut. [SOURCE: research/iterations/iteration-010.md] [SOURCE: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md]
- **get-token-insights ingestion:** Safe v1 is a follow-on normalized read model over existing `024/003` artifacts: ingest hook-state plus referenced transcript metadata into analytics tables for cross-session queries, without rewriting the Stop hook. [SOURCE: research/iterations/iteration-010.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md]
- **get-token-insights dashboard data contracts:** Safe only after ingestion. As a standalone lane, this should be treated as `prototype later` until every exported field maps to normalized tables rather than direct hook-state parsing. [SOURCE: research/iterations/iteration-010.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md]

The exact `024/003` gap is "analytics-grade cross-session storage plus cache-tier-normalized pricing," not missing Stop-hook collection. The smallest spec that closes it is a narrow follow-on packet under the `024-compact-code-graph` family that adds an offline ingestor and normalized analytics tables while keeping the existing producer unchanged. [SOURCE: research/iterations/iteration-010.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md] [SOURCE: /Users/michelkerkmeester/.codex/memories/MEMORY.md]

**First follow-on packet recommendation:** land the FTS capability cascade first. It has the strongest satisfied prerequisites, the best rollback profile, and the widest immediate unblock value because the retrieval surface should stabilize before SessionStart augmentation or downstream reporting contracts build on top of it. [SOURCE: research/iterations/iteration-010.md] [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/013-fts5-fix-and-search-dashboard/implementation-summary.md]

### 18.4 Packet-ready briefs (iteration 11)

#### Brief A: FTS capability cascade

- **Goal:** add a narrow lexical backend selector to Public's existing memory-search path so the same logical query contract survives across SQLite environments, with explicit degradation metadata instead of silent empty results. [SOURCE: research/iterations/iteration-010.md] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:94-97]
- **What Claudest actually does today:** `detect_fts_support()` probes `PRAGMA compile_options`, returns `fts5` when `ENABLE_FTS5` exists, falls back to `fts4` when `ENABLE_FTS4` or `ENABLE_FTS3` exists, and returns `None` otherwise. `search_sessions()` then branches explicitly: quoted OR-joined `MATCH` plus `bm25(branches_fts)` for `fts5`, quoted OR-joined `MATCH` plus `ended_at DESC` for `fts4`, and `%term%` `LIKE` clauses joined with `AND` when no FTS tier is available. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py:195-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py:22-106]
- **Important nuance:** Claudest is probe-driven, not exception-driven, in the search function itself. Public therefore needs one extra hardening step if it wants forced-degrade behavior on stale or partially migrated databases. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py:195-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py:22-106]
- **Candidate Public file surface:** `lib/search/sqlite-fts.ts` already owns weighted FTS5 BM25 execution and `memory_fts` detection; `lib/search/hybrid-search.ts` already routes lexical fallback stages; `handlers/memory-search.ts` owns the response contract; `tests/sqlite-fts.vitest.ts` is the cleanest forced-degrade coverage seam. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:48-145] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:450-478] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1731-1784] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:60-145]
- **Packet contract:** keep FTS5 BM25 as the primary lexical tier, add an explicit `fts4_match` degrade path when only older FTS support is available, and end at a last-resort SQL `LIKE` scan. Recommended rollback shape: one narrow feature flag so the selector can be disabled without touching semantic or hook-state systems. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:48-145] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1731-1784]
- **Verification matrix:** force four modes during tests: healthy FTS5 BM25, FTS5/BM25 unavailable but FTS still present, missing FTS virtual table, and stale-index error simulation. In every mode, the search should either return downgraded lexical results with explicit backend metadata or cleanly fall through to the next tier rather than hard-failing. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py:40-106] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:60-145]
- **Primary risks:** false degrade, degraded ranking quality outside FTS5 BM25, and compatibility drift across partially migrated SQLite environments. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py:195-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py:47-104]
- **Uncertainty Resolution (iteration 12):**
  - **What currently exists:** `fts5Bm25Search()` runs the weighted `bm25(memory_fts, ...)` query and collapses any runtime failure to `[]`, while `isFts5Available()` only checks `sqlite_master` for `memory_fts`. `hybrid-search.ts` duplicates the same table-existence probe in `isFtsAvailable()`, and `graph-search-fn.ts` duplicates it again in `isFtsTableAvailable()`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:48-145] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:423-478] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:63-109]
  - **What is still missing:** there is no lower-level compile-option probe anywhere in Public's `lib/search/` surface, so the current code cannot distinguish "SQLite build lacks FTS5" from "schema/table missing" or "FTS5 table exists but BM25/query execution is unusable." Public also still provisions only `memory_fts USING fts5`, which means an `fts4_match` lane does not exist yet as a real runtime target. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:91-145] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412]
  - **Exact code/spec changes needed in the upcoming packet:** narrow the first packet to `fts5_bm25 -> like_scan` unless it also adds alternate FTS4 DDL. Add one shared lexical-capability helper in `lib/search/sqlite-fts.ts` that probes `PRAGMA compile_options`, reports table presence separately from engine capability, and preserves typed failure reasons instead of returning bare empty arrays. Update `hybrid-search.ts` and `graph-search-fn.ts` to consume that helper rather than re-probing `sqlite_master`, and update the packet spec so `fts4_match` is explicitly marked "stretch only if alternate schema creation is added." [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:91-145] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:423-478] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:63-109] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412]
  - **Verification test that proves the gap is closed:** unit-test four forced-degrade cases against the shared helper and the routed search path: compile probe says no FTS5 support, `memory_fts` missing, `no such module: fts5`, and `unable to use function bm25`. The assertions should prove explicit backend metadata plus deterministic LIKE fallback, and should only permit `fts4_match` assertions when alternate FTS4 schema creation is enabled in the same packet. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:91-145] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:450-478] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-011.md:13-24]

#### Brief B: Normalized analytics tables

- **Goal:** keep `024/003` as the unchanged writer of session-end facts, then add a reader-owned normalized analytics model so cross-session token and cost reporting no longer depends on scanning per-session hook-state JSON. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:75-80] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138] [SOURCE: research/iterations/iteration-010.md]
- **What `024/003` already gives Public:** async Stop-hook execution, incremental transcript parsing, hook-state token snapshots, session summary extraction, and token-pressure feedback into the existing budget system. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:69-85]
- **What is still missing:** the current storage is not queryable across sessions, token counts remain lower-bound estimates, and cost estimation still omits cache-read and cache-write pricing. That is why the gap is a normalized read model, not more producer logic. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138] [SOURCE: research/iterations/iteration-010.md]
- **Minimum additive schema:** `sessions` for replayed session-level facts and totals; `turns` for per-turn replay facts plus offsets; `model_pricing_versioned` for historical model/cache pricing windows; `cache_tier_normalized` for normalized cache-read/cache-write breakout. This follows the previously identified value in Claudest's pricing normalization and cache-tier accounting without importing its dashboard shell. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/research.md:544-545] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:73-80] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]
- **Producer/consumer split:** writer stays `024/003`; new reader is an analytics replay job that ingests hook-state plus referenced transcript JSONL into the normalized tables. Rollback is therefore additive and low-risk: ignore or drop the reader-owned tables and keep the producer untouched. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:103-110] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]
- **Verification contract:** replay historical JSONL and hook-state into the new tables, rerun the replay, and prove idempotent session/turn counts plus stable session-level totals. This is the packet's equivalent of forced-degrade testing: historical replays must be stable before any dashboard contract is allowed to depend on them. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:118-127] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]
- **Primary risks:** pricing drift, session-id reconciliation errors between hook-state and transcript artifacts, and replay drift from lower-bound transcript parsing. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:73-80] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]
- **Next uncertainty to resolve:** whether Public already exposes a deeper SQLite capability probe than `memory_fts` table existence, and whether the current hook-state payload is stable enough to populate `turns` without heuristic joins. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:108-145] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:75-80]
- **Uncertainty Resolution (iteration 12):**
  - **What currently exists:** the Stop hook input accepts `session_id`, `transcript_path`, `stop_hook_active`, and `last_assistant_message`; `session-stop.ts` uses `session_id` as the durable session key, replays only from `metrics.lastTranscriptOffset`, and stores back only prompt/completion token totals plus that offset. `HookState` persists `claudeSessionId`, `speckitSessionId`, `lastSpecFolder`, `sessionSummary`, timestamps, and `metrics.{estimatedPromptTokens, estimatedCompletionTokens, lastTranscriptOffset}`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:12-39] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:149-257] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:75-80]
  - **What is still missing:** `transcript_path` is not persisted into hook state, `speckitSessionId` is initialized as an empty string and never populated by the Stop hook, cache token fields are parsed but not stored, and `parseTranscript()` returns only aggregate usage plus `newOffset=fileSize` rather than per-message offsets. That means today's trustworthy join key is `claudeSessionId` only, and today's replay cursor is a session-level high-water mark, not a turn-level key. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:162-180] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:191-257] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:55-123]
  - **Exact code/spec changes needed in the upcoming packet:** keep `claudeSessionId` as the `sessions` primary join key, treat `speckitSessionId` as nullable until a separate producer fills it, and add one bounded producer metadata patch so hook state also persists `transcriptPath` plus a replay fingerprint/high-water mark (`transcript_size_bytes` or equivalent). Expand stored metrics to include cache-read and cache-write token fields, then let the new analytics reader own the heavier replay work by introducing a turn-level parser that emits deterministic offsets or line numbers from transcript JSONL. The spec should state explicitly that `lastTranscriptOffset` is a session replay checkpoint, while `turns` uniqueness must be keyed by `(claude_session_id, transcript_path, byte_start)` or `(claude_session_id, transcript_path, line_no)` inside the new reader. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:196-257] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:55-123] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]
  - **Verification test that proves the gap is closed:** replay the same transcript twice and assert one `sessions` row per `claudeSessionId`, stable aggregate totals, and idempotent `turns` inserts keyed by the persisted transcript identity plus turn offset. Add a regression fixture where the same session fires Stop multiple times with growing transcript size; the test should prove that `lastTranscriptOffset` advances monotonically, `transcriptPath` is durable enough for later replay, and cache token fields survive into the normalized reader inputs. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:196-257] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:71-123] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-011.md:28-35]

### 18.5 Uncertainty resolution + continuation closeout (iteration 12)

- The continuation is now actionable end-to-end: the research already had an adopt/prototype/reject matrix, sequencing, smallest-safe-v1 slices, and packet-ready briefs, and iteration 12 closed the last two implementation ambiguities by checking the real Public code paths rather than leaving them as speculative TODOs. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/research.md:390-417] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/research.md:584-605] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:123-145] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33]
- **Packet that should land first:** Brief A, but with narrowed v1 scope: central FTS capability probe plus explicit `fts5_bm25 -> like_scan` degradation. Do not promise `fts4_match` in the first packet unless the same packet also expands schema creation beyond `memory_fts USING fts5`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:91-145] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412]
- **Exact entry conditions for the first packet:** accepted scope includes one shared lexical-capability helper, hybrid/graph search consumers migrated to it, backend metadata surfaced to callers, and forced-degrade tests for compile-probe miss, missing table, and BM25 runtime failure. Deferred scope includes analytics normalization, dashboard fields, and any FTS4 lane unless alternate schema creation is explicitly included. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:423-478] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:63-109] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-011.md:13-24]
- **Entry conditions for the second packet:** before normalized analytics starts, the packet must explicitly persist transcript identity into hook state, carry cache token fields forward, and define turn-level uniqueness off replay offsets or line numbers rather than the existing session-level `lastTranscriptOffset` alone. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:196-257] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:55-123]

## 19. Execution-Ready Continuation (iterations 13-20)

Generation 2 did not reopen the external Claudest discovery problem. Instead, it converted the already-finished research into implementation-facing contracts and packet boundaries for `Code_Environment/Public`. That was the missing layer between "packet-ready briefs" and "actually open the first implementation phase."

### 19.1 FTS capability helper contract

Iteration 13 fixed the smallest safe first packet for the recall lane: one shared helper in [`sqlite-fts.ts`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts) that reports capability and degrade reason, plus two caller migrations in [`hybrid-search.ts`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts) and [`graph-search-fn.ts`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts). The continuation explicitly rejects overstating an FTS4 execution lane because Public still provisions only `memory_fts USING fts5`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:48-145] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412]

### 19.2 Forced-degrade verification matrix

Iteration 14 reduced the test matrix to four truthful cases: compile-probe miss, missing `memory_fts`, `no such module: fts5`, and BM25 runtime failure. The continuation explicitly keeps `fts4_match` out of the default acceptance gate until alternate schema creation exists. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:60-145] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412]

### 19.3 Analytics producer boundary

Iteration 15 showed the first analytics packet after FTS is not "build the reader." It is a bounded metadata patch inside [`session-stop.ts`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts) and [`hook-state.ts`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts): persist transcript identity, persist cache token fields, and keep `claudeSessionId` as the primary key while `speckitSessionId` remains nullable. That preserves the original Phase 024/003 writer boundary instead of migrating analytics into the Stop hook itself. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:149-257] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:103-110]

### 19.4 Analytics reader contract

Iteration 16 then translated that producer patch into a reader-owned schema: `sessions` keyed by `claudeSessionId`, `turns` keyed by persisted transcript identity plus byte/line position, and additive lookup tables for model pricing and normalized cache tiers. The continuation also made the idempotency gate concrete: replay the same transcript twice and prove stable `sessions` totals plus non-duplicated `turns`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:55-123] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]

### 19.5 SessionStart cached-summary placement

Iteration 17 mapped Claudest's cached-summary fast path onto current Public startup surfaces. The safe lane is additive: richer deterministic continuity payloads for `resume` and `compact`, optional startup hints when a cached summary exists, and no replacement of `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` or `session_bootstrap()`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:85-168] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:88-129]

### 19.6 Consolidation-role split

Iteration 18 showed Public already has the two halves of Claudest's verifier/discoverer split under different names. Discovery belongs in the unified signal-extraction and decision-extraction layer; verification belongs in post-save review and narrow fact-check passes; writing remains in the existing workflow once both stages agree. That turns the Claudest pattern into a workflow contract instead of another subsystem. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md:35-54] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:208-360]

### 19.7 Portable token-observability contracts

Iteration 19 kept the original "borrow the contracts, not the dashboard" conclusion, but now with explicit reader prerequisites. Once normalized replay exists, the safe JSON contracts are `trends`, `skill_usage`, `agent_delegation`, `hook_performance`, `findings`, and `recommendations`, with cache-tier pricing elevated to a first-class field. Presentation remains deliberately out of scope. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:40-133] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]

### 19.8 Implementation packet order

Iteration 20 closed the research loop by turning the continuation into a packet train:

1. FTS capability helper + forced-degrade tests
2. Stop-hook metadata patch for transcript identity and cache tokens
3. Normalized analytics reader
4. SessionStart cached-summary fast path
5. Discoverer/verifier workflow split
6. Token-insight contracts

This is the point where additional research stops paying for itself. Every remaining ambiguity is now implementation-scoped and captured as an entry condition or acceptance gate, not as another unresolved discovery question. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-020.md]
