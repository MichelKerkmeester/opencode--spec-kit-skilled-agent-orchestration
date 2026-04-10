# Iteration 021: CROSS-SYSTEM PATTERNS

## Focus
CROSS-SYSTEM PATTERNS: Compare patterns from this system against the other 4 research phases. What converges across all systems? What's unique to this one?

## Findings
### Finding 1: All five systems encode a memory-usage protocol above the storage engine
- **Source**: `001-engram-main/external/internal/mcp/mcp.go:53-138,375-395`; `002-mex-main/external/AGENTS.md:37-42`; `002-mex-main/external/SYNC.md:9-21`; `003-modus-memory-main/external/internal/mcp/memory.go:7-39`; `004-opencode-mnemosyne-main/external/src/index.ts:95-223`; `005-mempalace/external/mempalace/mcp_server.py:155-176`
- **What it does**: Engram uses `ProfileAgent`/`ProfileAdmin`, eager vs deferred tools, and a `mem_context` core tool; Mex forces `ROUTER.md`/sync discipline; Modus trims to 11 memory tools; Mnemosyne injects a compaction action card; MemPalace returns `PALACE_PROTOCOL` in `status`.
- **Why it matters**: The strongest convergence is not on SQLite, markdown, vectors, or graphs. It is that agents need a taught operating protocol. For Spec Kit Memory, the next win is a thinner memory action card/profile over existing `memory_context`, `memory_search`, `memory_save`, `session_bootstrap`, and recovery flows.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Recovery, repair, and review stay outside the primary recall path across the whole set
- **Source**: `001-engram-main/external/internal/store/store.go:948-1069,1613-1667`; `002-mex-main/external/SYNC.md:9-21`; `002-mex-main/external/src/sync/brief-builder.ts:7-97`; `003-modus-memory-main/external/internal/mcp/vault.go:856-897`; `004-opencode-mnemosyne-main/external/src/index.ts:138-223`; `005-mempalace/external/mempalace/mcp_server.py:70-100`; `005-mempalace/external/mempalace/repair.py:1-28`
- **What it does**: Engram keeps `mem_search` on observations while `FormatContext()` renders prompts/sessions and `AddObservation()` handles dedupe/upsert; Mex runs drift -> targeted brief -> fix loops; Modus exposes explicit decay/reinforce operations; Mnemosyne separates recall from store/delete and compaction reminders; MemPalace keeps WAL and repair/rebuild commands outside search.
- **Why it matters**: Cross-system agreement is that one universal search endpoint should not also own repair, review, recovery, and governance. Public should keep `memory_search` narrow and continue growing explicit doctor/review/passive-capture lanes around it.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Cheap structural narrowing is universal; only the shape differs
- **Source**: `001-engram-main/external/internal/store/store.go:1462-1584`; `002-mex-main/external/src/sync/brief-builder.ts:58-96`; `003-modus-memory-main/external/internal/mcp/vault.go:75-101`; `004-opencode-mnemosyne-main/external/src/index.ts:27-30,96-134`; `005-mempalace/external/mempalace/mcp_server.py:213-256`
- **What it does**: Engram narrows with `topic_key`, `project`, and `scope`; Mex narrows repair work to specific drifted files with local filesystem/git context; Modus appends connected docs; Mnemosyne splits `project` vs `global`; MemPalace filters by `wing`/`room`.
- **Why it matters**: The shared pattern is not “better global ranking.” It is “give the agent a cheap narrowing primitive before broader search.” Public already has scopes, anchors, graph routing, and code-search separation; the missing slice is a simpler human-facing exact/thread/timeline lane.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: What is unique to Engram is its prompt-and-session digest lane, not its FTS stack
- **Source**: `001-engram-main/external/internal/mcp/mcp.go:350-395,515-562`; `001-engram-main/external/internal/store/store.go:754-804,1613-1667`; `002-mex-main/external/AGENTS.md:37-42`; `003-modus-memory-main/external/internal/mcp/memory.go:7-39`; `004-opencode-mnemosyne-main/external/src/index.ts:96-223`; `005-mempalace/external/mempalace/mcp_server.py:169-176`
- **What it does**: Engram alone persists user prompts, recent sessions, session summaries, and observations as separate artifacts, then renders them together through `FormatContext()` exposed as `mem_context`. The other systems teach startup rituals or memory usage, but do not combine a dedicated prompt log and session table into one deterministic digest lane this way.
- **Why it matters**: This is the most reusable Engram-specific idea. Public should keep prompt/session continuity outside `memory_search` and add a deterministic recent-session digest inside `session_bootstrap`/`session_resume`, while still avoiding a second explicit lifecycle authority.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: What is unique to Engram is revisioned thread identity in the write path
- **Source**: `001-engram-main/external/internal/mcp/mcp.go:302-324`; `001-engram-main/external/internal/store/store.go:948-1069,1474-1515`; `002-mex-main/external/AGENTS.md:37-42`; `003-modus-memory-main/external/internal/mcp/vault.go:75-101`; `004-opencode-mnemosyne-main/external/src/index.ts:138-201`; `005-mempalace/external/mempalace/mcp_server.py:231-256`
- **What it does**: Engram’s `topic_key` path suggests a stable key, upserts by `project + scope + topic_key`, increments `revision_count`, increments `duplicate_count` on near-duplicate saves, and gives slash-form exact keys a direct search shortcut ahead of FTS. The other systems have patterns, adjacency, scopes, or taxonomy filters, but not this exact write-path identity model.
- **Why it matters**: This is Engram’s clearest unique contribution. For Public, the safe port is an explicit `thread_key` plus exact lookup / chronology-around-hit for long-lived decisions and bug lines, not a retreat from hybrid retrieval into lexical-only ranking.
- **Recommendation**: prototype later
- **Impact**: high

## Assessment
- New information ratio: 0.27

## Recommended Next Focus
Turn the convergence into a four-track adoption matrix: `1)` thin startup/compaction memory action card, `2)` doctor/review/repair surfaces around existing retrieval, `3)` `thread_key` + exact lookup/timeline prototype, `4)` explicit non-goals: no second lifecycle authority, no scope replatforming, no collapse of code search into memory search.


Total usage est:        1 Premium request
API time spent:         4m 16s
Total session time:     4m 34s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.6m in, 17.8k out, 1.5m cached, 10.5k reasoning (Est. 1 Premium request)
