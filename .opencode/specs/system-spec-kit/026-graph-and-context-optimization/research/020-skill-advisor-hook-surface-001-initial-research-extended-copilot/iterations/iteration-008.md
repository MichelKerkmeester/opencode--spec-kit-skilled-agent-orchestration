# Iteration 008 - X8 Concurrent-Session Race Conditions

## Focus

Define the concurrency contract for two Claude sessions in the same workspace, with emphasis on three named failure modes: skill-graph recompute visibility, shared hook-state persistence, and process-cache versus disk-cache divergence. The required outcome is an implementation-ready locking and snapshotting design plus a concrete test scenario list.

## Inputs Read

- Packet prompt and state:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/prompts/iteration-8.md`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/deep-research-state.jsonl`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/deep-research-strategy.md`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md`
- Live runtime sources:
  - `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
  - `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py`
  - `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`

## Existing Constraints We Must Preserve

Wave 1 already established that prompt-hook failures must fail open and that reuse of model-visible guidance has to obey freshness boundaries instead of trusting stale process state. X8 therefore is not allowed to solve concurrency by "just restart the process" or by silently reusing whichever snapshot happens to be in memory. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md:60-78] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md:183-231]

## Current Runtime Facts

### 1. The SQLite skill-graph path already gives committed-snapshot reads

The live skill-graph database opens in WAL mode, and the indexer applies node/edge mutation inside a single `database.transaction(...)` before updating scan metadata. That means a concurrent reader should see either the old committed graph or the new committed graph, not a half-written set of rows. The primary race on the SQLite path is therefore **staleness**, not torn visibility. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:182-200] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:520-601]

### 2. The JSON fallback path *does* have a truncate/rewrite window

The fallback compiler writes `skill-graph.json` directly with `open(..., "w")` and then streams the new JSON payload into that same path. The advisor loads that JSON when SQLite is unavailable or when the auto-compile fallback is used. That means the fallback path can expose an empty or partially rewritten file to a concurrent reader unless it is upgraded to temp-file-plus-rename semantics. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:781-787] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:447-452]

### 3. The dominant live bug is process-cache divergence

`_load_skill_graph()` returns the process-global `_SKILL_GRAPH` immediately once it has been populated, with no hot-path freshness probe. By contrast, discovered `SKILL.md` records *do* revalidate against a `(path, mtime_ns, size)` signature. Two concurrent Claude sessions can therefore agree on live discovery while disagreeing on graph boosts if one process warmed `_SKILL_GRAPH` before another session triggered a recompute. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:431-445] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:159-169] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:231-269]

### 4. Hook-state persistence already avoids torn file reads, but not lost updates

Per-session hook state is written via a unique temp path followed by `renameSync`, and reads reject a candidate when the file's `mtimeMs` changes during the read. The tests also prove overlapping writes use distinct temp names. So the checked-in path already defends against "reader saw half a JSON file." The unresolved race is different: `updateState()` still does load -> merge -> save with no lock or compare-and-swap guard, so two writers updating different fields on the same session can drop each other's changes via last-writer-wins replacement. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:424-458] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:543-579] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:948-965] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:188-241]

### 5. Cross-session continuity selection is scope-sensitive, not purely session-local

The startup brief and cached summary helpers retrieve continuity from hook-state lookups scoped by `specFolder` and/or `claudeSessionId`. When a concrete `claudeSessionId` is present, the lookup stays session-specific. But the shared selection primitives explicitly allow `specFolder` scope and then choose the newest matching state, which means two active sessions on the same spec folder can compete for "most recent continuity" in any path that does not carry the active Claude session ID through to the lookup. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:179-203] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:365-426] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487-492]

## X8 Concurrency Contract

### A. Resource classes and lock scope

| Resource | Current authority | Required lock scope | Reader model |
| --- | --- | --- | --- |
| SQLite skill graph | `skill-graph.sqlite` + metadata rows | **Workspace-scoped graph rebuild lock** | Readers stay non-blocking and consume the last committed SQLite snapshot |
| JSON fallback graph | `skill-graph.json` | **Same workspace-scoped graph rebuild lock** | Readers must treat active rebuild as unavailable/stale unless they can prove a committed generation |
| Claude hook state | `${tmpdir}/speckit-claude-hooks/<project>/<session>.json` | **Per-session lock** | Readers can stay lock-free because temp+rename already prevents torn files |
| Cached prompt/brief state | Process memory (`_SKILL_GRAPH`, runtime skill cache, startup brief consumers) | **No blocking lock; generation check only** | Readers must compare cached generation to disk generation before reuse |

### B. Snapshot identity

Every graph-backed decision should carry a `graphSnapshotId` made from:

1. `skill_graph_source` (`sqlite` vs `json`)
2. the persisted graph generation (`last_scan_timestamp` for SQLite, file mtime+size or explicit generation file for JSON)
3. the live discovery signature hash derived from `(path, mtime_ns, size)`

If any component changes, the process cache is stale even if the in-memory object is still valid JSON/Python. This turns the current "sticky forever" `_SKILL_GRAPH` behavior into "sticky until generation mismatch." [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:431-445] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:2632-2713] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:159-169]

### C. Writer protocol

1. **Acquire workspace graph lock** before any skill-graph rebuild or JSON fallback export.
2. **Rebuild into a new committed snapshot**, not in place:
   - SQLite path may keep its current transaction model because WAL already gives snapshot isolation.
   - JSON fallback must switch from direct overwrite to temp-file-plus-rename.
3. **Publish generation last**:
   - for SQLite, update scan metadata only after the transaction commits;
   - for JSON, atomically swap the file and then update an adjacent generation marker if needed.
4. **Release lock** after the committed generation is visible.

The crucial property is that readers never need to watch partial progress: they either consume the last committed snapshot or notice that a newer generation exists and reload. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:520-601] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:781-787]

### D. Reader protocol

1. Read the current generation/fingerprint.
2. If the in-process cache generation matches, reuse it.
3. If it mismatches, reload from disk.
4. If a rebuild lock is present:
   - **SQLite** readers still use the last committed snapshot and mark the result `stale` until the new generation lands.
   - **JSON fallback** readers must refuse to parse a file being rewritten; return degraded/unavailable and fail open instead of risking partial JSON.

This preserves model-visible safety: concurrency pressure downgrades freshness, not correctness.

### E. Hook-state update discipline

`saveState()` is already atomic at the file level, but `updateState()` is not atomic at the semantic level because it merges against whatever `loadState()` returned a moment earlier. X8 therefore needs one of two equivalent protections on the per-session file:

1. **Advisory per-session lock** around read-merge-write, or
2. **Revisioned compare-and-swap** (`revision` field in state, retry on mismatch).

Either way, the contract is: concurrent updates to disjoint fields (`sessionSummary`, `pendingCompactPrime`, `metrics`, `producerMetadata`) must converge, not silently drop the earlier patch. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:372-421] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:948-965]

### F. Cross-session continuity rule

Session-scoped consumers must prefer `claudeSessionId` whenever it is available. `specFolder`-only lookup is acceptable only as an explicit fallback and should surface ambiguity if more than one fresh state matches the folder. The safe rule is:

> session ID beats spec-folder recency; recency only arbitrates within a single session scope, never across concurrent active sessions.

That avoids one Claude session inheriting another session's continuity just because both are pointed at the same packet. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:179-203] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:365-426]

## Test Scenario List

1. **SQLite rebuild while reading** — Session A triggers `skill_graph_scan`; Session B repeatedly loads graph-backed recommendations. Assert B sees either the pre-commit snapshot or the post-commit snapshot, never a reduced row count or partial edge set. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:520-601]
2. **JSON fallback concurrent load** — Force SQLite unavailable, have Session A export JSON while Session B calls `_load_skill_graph()`. Assert no partial-JSON parse succeeds; reader either gets the old snapshot or a degraded/unavailable result. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:781-787] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:447-452]
3. **Process-cache invalidation after rebuild** — Warm `_SKILL_GRAPH`, mutate graph metadata in another session, rebuild, then analyze another prompt in the original process. Assert generation mismatch forces reload before graph boosts are applied. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:431-445]
4. **Same-session dual writer** — Two concurrent `updateState()` calls modify disjoint fields on the same session file. Assert the persisted record contains both updates after lock/CAS retry instead of last-writer-wins loss. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:948-965]
5. **Torn-read defense stays intact** — While a writer replaces a session file, a reader attempts to load it. Assert it either reads a valid state or returns `mtime_changed`, never partial JSON. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:543-579]
6. **Spec-folder ambiguity** — Two fresh session files share the same `lastSpecFolder`. A spec-folder-only cached summary lookup should reject as ambiguous or require explicit session ID instead of choosing whichever state updated last. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:365-426]

## Determination

**X8 is answered.** The main concurrency hazard is **not** "SQLite readers see half-written rows." The checked-in SQLite path already gives committed-snapshot semantics. The real packet-026 gap is a three-part split:

1. JSON fallback writes are not atomic.
2. Process caches are generation-blind after warmup.
3. Hook-state read-merge-write operations can lose concurrent updates unless they gain a per-session lock or CAS revision.

That makes the correct fix a hybrid of **workspace-scoped rebuild locking**, **generation-tagged cache invalidation**, and **per-session state update serialization**, with fail-open degraded behavior on ambiguous or rebuilding snapshots.

## Ruled Out

### 1. "Just add a TTL" as the concurrency solution

Ruled out because the current race is not bounded by time alone. A stale process cache can remain logically wrong until process exit, and a same-session lost update can happen inside a single second. Time-based expiry reduces dwell time but does not establish read-consistent snapshots or merge safety. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:431-445] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:948-965]

### 2. Treating the SQLite path as the primary torn-read problem

Ruled out because the live DB uses WAL and one transaction for index mutation. The half-written risk is the JSON fallback export path, not the normal SQLite snapshot path. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:182-200] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:781-787]

## Decisions

- **Use a workspace-scoped graph rebuild lock plus generation-tagged snapshot IDs.**
- **Keep SQLite readers non-blocking; they should consume the last committed snapshot and downgrade freshness while a rebuild is in flight.**
- **Upgrade JSON fallback export to temp-file-plus-rename before concurrent use is considered safe.**
- **Serialize `updateState()` semantically with a per-session lock or revisioned CAS retry, not just atomic file replacement.**
- **Require session-ID-first continuity selection; spec-folder-only reuse must not silently cross active sessions.**

## Question Status

- **X8 answered**: packet 026 now has a concrete concurrency design for concurrent Claude sessions, including lock scope, read-consistent snapshotting, and a focused test matrix.

## Next Focus

Iteration 9 should move to X9 and determine whether advisor brief text needs the same NFKC/canonical-fold hardening before becoming model-visible, especially when skill names, descriptions, and cached continuity are composed into a shared prompt surface.
