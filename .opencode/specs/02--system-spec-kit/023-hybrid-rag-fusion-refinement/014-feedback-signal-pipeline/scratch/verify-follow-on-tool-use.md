# Verify: follow_on_tool_use Feedback Signal — Live End-to-End

## Goal

Confirm that the implicit feedback pipeline emits **all five event types** — including `follow_on_tool_use` — through the live MCP server. The critical scenario: a non-search tool (like `memory_stats`) that has **no `sessionId` parameter** must still correlate with a prior search via the sticky `lastKnownSessionId` fallback in `context-server.ts`.

---

## Background

The feedback signal pipeline (`context-server.ts` lines 283–287, 773, 876–877) stores the session ID from any tool call that provides one into a module-level `lastKnownSessionId` variable. When a non-search tool fires, the follow-on check at line 876 falls back: `sessionTrackingId ?? lastKnownSessionId`. This lets tools like `memory_stats` (which accept no `sessionId`) emit `follow_on_tool_use` events against the last known session.

The five implicit feedback event types are:
1. `search_shown` — emitted when search results are returned
2. `result_cited` — emitted when `includeContent: true` and results contain content
3. `query_reformulated` — emitted when a follow-up query has 0.3–0.8 Jaccard similarity to a prior query
4. `same_topic_requery` — emitted when similarity > 0.8 (near-identical requery)
5. `follow_on_tool_use` — emitted when any non-search MCP tool is called within 60s of a search

All events are **shadow-only** (REQ-D4-001): they log to `feedback_events` but do not affect search ranking. `feedbackSignalsApplied: off` in traces is expected and correct.

---

## Verification Sequence

Run these steps **exactly in order**:

### Step 0: Baseline

```sql
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite \
  "SELECT type, COUNT(*) as cnt FROM feedback_events GROUP BY type ORDER BY cnt DESC;"
```

Record all counts. `follow_on_tool_use` should already be > 0 from prior sessions.

### Step 1: Generate a session ID

Generate a fresh UUID (e.g. `uuidgen` in bash). This will be your session ID for steps 2–5.

### Step 2: Seed the session with a search

```
memory_search({
  query: "feedback signal pipeline",
  includeContent: true,
  includeTrace: true,
  bypassCache: true,
  sessionId: "<your-uuid>",
  specFolder: "02--system-spec-kit/023-hybrid-rag-fusion-refinement/014-feedback-signal-pipeline",
  limit: 5
})
```

This seeds the session: emits `search_shown` + `result_cited`, stores `shownMemoryIds` in the tracker, and writes `lastKnownSessionId`.

### Step 3: Call a sessionless tool (the critical test)

```
memory_stats({})
```

**No `sessionId` parameter.** This is the exact gap the sticky-session fix addresses. The server should:
1. Resolve `sessionTrackingId` → `undefined` (no param)
2. Fall back to `lastKnownSessionId` (set in step 2)
3. Call `logFollowOnToolUse(db, followOnSessionId)` → emit `follow_on_tool_use` events

### Step 4: Second search (tests query_reformulated)

```
memory_search({
  query: "feedback signal pipeline implementation",
  bypassCache: true,
  sessionId: "<same-uuid>",
  specFolder: "02--system-spec-kit/023-hybrid-rag-fusion-refinement/014-feedback-signal-pipeline",
  limit: 5
})
```

The query overlaps with step 2 but differs ("implementation" added). Should trigger `query_reformulated`.

### Step 5: Identical requery (tests same_topic_requery)

Wait **at least 2 seconds** (to avoid the 1-second dedup window), then rerun the **exact same** `memory_search` from step 4 with the same session ID.

Should trigger `same_topic_requery`.

### Step 6: Check results

**Global counts:**
```sql
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite \
  "SELECT type, COUNT(*) as cnt FROM feedback_events GROUP BY type ORDER BY cnt DESC;"
```

**Session-specific counts:**
```sql
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite \
  "SELECT type, COUNT(*) FROM feedback_events WHERE session_id = '<your-uuid>' GROUP BY type;"
```

---

## Expected Results

| Event Type | Expected for Your Session | Source Step |
|---|---|---|
| `search_shown` | > 0 | Steps 2, 4, 5 |
| `result_cited` | > 0 | Step 2 (includeContent: true) |
| `follow_on_tool_use` | **> 0** | Step 3 (memory_stats, no sessionId) |
| `query_reformulated` | > 0 | Step 4 (similar but different query) |
| `same_topic_requery` | > 0 | Step 5 (identical requery after >1s) |

### Pass criteria
- All five event types present in session-specific query
- `follow_on_tool_use` > 0 specifically (this was the bug)
- `feedbackSignalsApplied: off` in search traces (shadow-only, by design)
- No errors in any tool call

### Fail indicators
- `follow_on_tool_use` = 0 after step 3 → sticky session fallback not working
- Missing event types → check if `SPECKIT_IMPLICIT_FEEDBACK_LOG` env var is set
- Tool errors → check `dist/context-server.js` is rebuilt from latest source

---

## Key Files

| File | Role |
|---|---|
| `mcp_server/context-server.ts:283-287` | `lastKnownSessionId` declaration |
| `mcp_server/context-server.ts:773` | Sticky write: `if (sessionTrackingId) lastKnownSessionId = sessionTrackingId` |
| `mcp_server/context-server.ts:876-877` | Fallback read: `sessionTrackingId ?? lastKnownSessionId` |
| `mcp_server/lib/feedback/query-flow-tracker.ts` | `logFollowOnToolUse()`, `trackQueryAndDetect()`, similarity thresholds |
| `mcp_server/lib/feedback/feedback-ledger.ts` | `logFeedbackEvent()` — single storage path for all event types |
| `mcp_server/database/context-index.sqlite` | `feedback_events` table |
| `specs/.../014-feedback-signal-pipeline/implementation-summary.md` | Packet documentation |

---

## Report Format

After running the sequence, report:
1. Baseline counts (step 0) vs final counts (step 6) — delta per event type
2. Session-specific counts — all five types and their values
3. Whether `follow_on_tool_use > 0` — explicit yes/no
4. Any errors or unexpected state
5. `feedbackSignalsApplied` value from search traces (expected: `off`)
