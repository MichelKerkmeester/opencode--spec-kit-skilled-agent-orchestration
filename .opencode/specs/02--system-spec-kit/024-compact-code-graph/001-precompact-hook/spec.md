# Phase 1: Compaction Context Injection (PreCompact + SessionStart)

## Summary
Implement a two-step compaction context injection: PreCompact **precomputes** critical context and caches it, then SessionStart(source=compact) **injects** it into the conversation.

**CORRECTION (iteration 011):** Claude Code's PreCompact hook does NOT inject stdout into model context. Only SessionStart and UserPromptSubmit support context injection via stdout. The corrected design uses PreCompact for precomputation and SessionStart(source=compact) for injection.

## What Exists
- `autoSurfaceAtCompaction(sessionContext, options)` in `hooks/memory-surface.ts`
- `COMPACTION_TOKEN_BUDGET = 4000` tokens
- Constitutional memories auto-surface infrastructure
- `autoSurfaceMemories()` core function with trigger matching + embedding search
- SessionStart hook supports `source` matcher: `startup`, `resume`, `clear`, `compact`

## CocoIndex Integration

CocoIndex Code MCP (existing, deployed) can enrich the PreCompact precomputation:
- **Semantic neighbors**: Query CocoIndex for code semantically related to active symbols/files from the session
- **Complements structural context**: While Memory MCP provides session/constitutional context, CocoIndex provides code-relevance context
- **Optional enrichment**: If CocoIndex is available, query `mcp__cocoindex_code__search` with active file/symbol context; if unavailable, proceed without (graceful degradation)
- **Budget impact**: CocoIndex results share the 4000-token compaction budget with memory results

## Token Budget Allocation (Iteration 049)

The PreCompact pipeline must allocate the 4000-token compaction budget across 3 sources using a floors + overflow pool model:

| Source | Floor | Priority | Trim Order |
|---|---:|---|---|
| Constitutional Memory | 700 | Highest — trim last | 6th (last) |
| Code Graph | 1200 | High — structural working set | 4th |
| CocoIndex | 900 | Medium — semantic neighbors | 3rd |
| Triggered Memory | 400 | Lower — session-relevant | 2nd |
| Overflow Pool | 800 | Redistributed from empty sources | — |

**Rules:**
- If a source returns nothing, its floor flows to the overflow pool
- Trim order (first dropped): second-hop graph → semantic analogs → triggered → graph neighbors → session state → constitutional
- CocoIndex snippets trimmed to ≤600 chars (~175-225 tokens each)
- Code graph projected to compact brief (~700-1000 tokens for 1-root, 5-neighbor, 8-edge)

## Latency Budget (Iteration 046)

PreCompact has a 2-second hard cap. Recommended warm-cache allocation:

| Phase | Time | Hard Cap |
|---|---|---|
| Parse + cache lookup | 50-75ms | — |
| CocoIndex search | 450-700ms | 800ms |
| Graph expansion (1-hop) | 250-450ms | 500ms |
| Reverse semantic augment | 250-350ms | Skip if <400ms remain |
| Merge + format | 150-250ms | — |
| Slack | 150-250ms | — |
| **Total** | **1.3-1.8s** | **2.0s** |

## Architecture (Corrected)

```
Auto-compact triggered by Claude Code:
  1. PreCompact hook fires → compact-precompute.js
     - Reads transcript tail for session context
     - Calls autoSurfaceAtCompaction(context)
     - Optionally queries CocoIndex for semantic neighbors of active symbols
     - Writes result to .claude/compact-context-cache.json
     - Output: nothing (PreCompact stdout is NOT injected)

  2. SessionStart(source=compact) fires immediately after
     → compact-inject.js
     - Reads .claude/compact-context-cache.json
     - Outputs cached context to stdout
     - Claude Code injects this into the new compacted conversation
     - Deletes cache file after injection
```

## What to Build

### 1. `scripts/hooks/compact-precompute.js`
```
Input:  stdin JSON from Claude Code PreCompact event
        { "trigger": "auto"|"manual", "custom_instructions": "..." }
Output: writes to .claude/compact-context-cache.json (NOT stdout)
Timeout: <2 seconds
```

**Logic:**
1. Parse stdin JSON
2. Read transcript tail (~50 recent lines) for session context
3. Call `autoSurfaceAtCompaction(context)` — direct import from compiled dist
4. Write surfaced memories + constitutional context to cache file
5. Exit cleanly (no stdout output)

### 2. `scripts/hooks/compact-inject.js`
```
Input:  stdin JSON from Claude Code SessionStart event (source=compact)
        { "source": "compact", "session_id": "...", ... }
Output: stdout text (injected into conversation by Claude Code)
Timeout: <2 seconds
```

**Logic:**
1. Parse stdin JSON, verify source === "compact"
2. Read `.claude/compact-context-cache.json`
3. If cache exists and is fresh (<5 minutes old):
   - Output cached context to stdout
   - Delete cache file
4. If no cache: call `memory_context({ mode: "resume" })` as fallback
5. Output formatted context block (≤4000 tokens)

### 3. Hook Registration
Add to `.claude/settings.local.json`:
```json
{
  "hooks": {
    "PreCompact": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "node .opencode/skill/system-spec-kit/mcp_server/scripts/hooks/compact-precompute.js"
      }]
    }],
    "SessionStart": [{
      "matcher": "compact",
      "hooks": [{
        "type": "command",
        "command": "node .opencode/skill/system-spec-kit/mcp_server/scripts/hooks/compact-inject.js"
      }]
    }]
  }
}
```

**Key:** SessionStart matcher is `"compact"` — only fires on compaction, not on normal session starts.

## Acceptance Criteria
- [ ] PreCompact hook fires and precomputes context to cache file
- [ ] SessionStart(source=compact) hook fires and injects cached context
- [ ] Surfaced context includes constitutional memories + relevant prior work
- [ ] Output stays within 4000 token budget
- [ ] Both scripts complete in <2 seconds each
- [ ] Graceful degradation when MCP unavailable
- [ ] Cache file cleaned up after injection
- [ ] Existing hooks in settings.local.json preserved (merge-safe)

## Files Modified
- NEW: `.opencode/skill/system-spec-kit/mcp_server/scripts/hooks/compact-precompute.js`
- NEW: `.opencode/skill/system-spec-kit/mcp_server/scripts/hooks/compact-inject.js`
- EDIT: `.claude/settings.local.json` (add PreCompact + SessionStart hooks)

## LOC Estimate
~80-100 lines (compact-precompute.js) + ~60-80 lines (compact-inject.js) + ~15 lines (settings.json)
