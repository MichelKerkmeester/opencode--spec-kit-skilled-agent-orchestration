# Iteration 003 — Merged Findings

**Focus**: MCP handlers (CRUD + save pipeline), search/context/trigger handlers, hooks, cognitive/scoring, session management
**Agents**: copilot-C1 (CRUD/save), copilot-C2 (search/hooks), codex-A1 (cognitive/scoring/session)
**New findings**: 24

---

## P1 (HIGH)

### [BUG] save/pe-orchestration.ts: Premature supersession (C1)
- **File(s)**: mcp_server/handlers/save/pe-orchestration.ts:101-122
- **Description**: Marks existing memory as superseded BEFORE new record created. If create/enrichment fails, old row stays deprecated with no replacement.

### [BUG] memory-crud-utils.ts: Swallowed ledger failures (C1)
- **File(s)**: mcp_server/handlers/memory-crud-utils.ts:43-64
- **Description**: Swallows ledger write failures. DB mutations commit while audit history silently disappears.

### [BUG] Error formatting not uniform across CRUD (C1)
- **File(s)**: memory-crud-delete.ts:68-75, memory-crud-update.ts:41-78
- **Description**: Delete/update throw raw errors, unlike list/stats/health which return MCP envelopes.

### [BUG] memory-crud-health.ts: Partial failure reported as success (C1)
- **File(s)**: mcp_server/handlers/memory-crud-health.ts:320-359
- **Description**: Logs DB read failures and continues with defaulted values. Reports "success" with incomplete diagnostics.

### [BUG] save/db-helpers.ts: Hidden review_count clobber (C1)
- **File(s)**: mcp_server/handlers/save/db-helpers.ts:53-57
- **Description**: Always injects `review_count = 0` when caller omits field. Can clobber existing review state.

### [STANDARDS] Raw handler errors reach MCP with wrong contract (C2)
- **File(s)**: memory-save.ts:729-847, memory-bulk-delete.ts:48-80, memory-ingest.ts:135-152
- **Description**: Expected validation/policy failures lose tool-specific code, details, and recovery shape vs handlers returning structured MCP errors.

### [BUG] session-learning: NaN scores accepted (A1)
- **File(s)**: mcp_server/handlers/session-learning.ts:189, 413
- **Description**: `validateScores()` checks `typeof === 'number'` and `< 0` / `> 100`, both false for NaN. NaN can be persisted and poison averages.

### [BUG] session-manager: Batch dedup breaks for id-less memories (A1)
- **File(s)**: mcp_server/lib/session/session-manager.ts:343, 706
- **Description**: Dedup map uses `Map<number, boolean>`, id-less rows never represented. Already-sent id-less memories can be returned again.

---

## P2 (MEDIUM)

### [BUG] memory-crud-update: No-op updates produce side effects (C1)
- **File(s)**: mcp_server/handlers/memory-crud-update.ts:83-87, 140-149, 193-225

### [BUG] save/embedding-pipeline: Cache key mismatch (C1)
- **File(s)**: mcp_server/handlers/save/embedding-pipeline.ts:111-126, 150-166

### [BUG] save/dedup: Pending rows excluded from dedup (C1)
- **File(s)**: mcp_server/handlers/save/dedup.ts:14-16, 162-264

### [BUG] save/post-insert: Entity linking global not incremental (C1)
- **File(s)**: mcp_server/handlers/save/post-insert.ts:71-123

### [BUG] save/reconsolidation-bridge: Partial state on throw (C1)
- **File(s)**: mcp_server/handlers/save/reconsolidation-bridge.ts:58-67, 210-214

### [UX] memory_index_scan suppresses mutation hook results (C2)
- **File(s)**: mcp_server/handlers/memory-index.ts:264-269, 539-546

### [BUG] memory_context: ID underreporting for trigger results (C2)
- **File(s)**: mcp_server/handlers/memory-context.ts:873-876

### [BUG] memory-index-discovery: Silent directory drop (C2)
- **File(s)**: mcp_server/handlers/memory-index-discovery.ts:60-97

### [BUG] session-manager: CONTINUE_SESSION.md mutates state (A1)
- **File(s)**: mcp_server/lib/session/session-manager.ts:897, 1071

### [BUG] session-learning: Stale schema flag across DB swaps (A1)
- **File(s)**: mcp_server/handlers/session-learning.ts:163, 166

### [BUG] working-memory: Mixed timestamp formats in cleanup (A1)
- **File(s)**: mcp_server/lib/cognitive/working-memory.ts:45, 127, 251

### [BUG] co-activation: Stale relations never cleared (A1)
- **File(s)**: mcp_server/lib/cognitive/co-activation.ts:57, 113, 178, 223

---

## P3 (LOW)

### [LOGIC] BM25 indexing semantics differ between save and update (C1)
### [LOGIC] memory-crud-stats: excludePatterns doc says regex, impl is substring (C1)
### [LOGIC] save/create-record + save/dedup: Duplicated scope normalization (C1)
### [LOGIC] Classification-decay flag handling inconsistent with scheduler (A1)

---

## Statistics
- P1: 8, P2: 12, P3: 4 = 24 new
- Cumulative: 90 findings
- newInfoRatio: 0.65 (24/37)
