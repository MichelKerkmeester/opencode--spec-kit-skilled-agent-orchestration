# Phase 022: Gemini CLI Hook Porting

## What This Is

Gemini CLI (v0.33.1+) supports hooks but we haven't configured any. Claude Code has full hook support (PreCompact, SessionStart, Stop). This phase ports the Claude hooks to Gemini's lifecycle format.

## Plain-English Summary

**Problem:** Gemini CLI has hook support but we're not using it. Gemini users get the same weak experience as Codex/Copilot even though their CLI can do better.

**Solution:** Create Gemini-native hook scripts that map to Gemini's lifecycle events. Not a direct copy of Claude hooks — Gemini's lifecycle is different, so we adapt the concepts.

## How Claude Hooks Map to Gemini

| Claude Event | Gemini Equivalent | Notes |
|-------------|-------------------|-------|
| `SessionStart` | `SessionStart` | Direct match for startup/resume/clear |
| `PreCompact` | `PreCompress` | Gemini calls it "compress" not "compact" |
| `SessionStart(compact)` | `BeforeAgent` (one-shot) | Inject cached context before first agent turn |
| `Stop` | `AfterAgent` + `AfterModel` | Split into per-turn and per-model hooks |

## What to Build

### 1. Session Prime (highest priority)

Port `session-prime.ts` to Gemini format. This is the easiest win because `SessionStart` maps directly.

**New file:** `mcp_server/hooks/gemini/session-prime.ts`
- Same logic as Claude version: detect source (startup/resume/clear), output appropriate context
- Different: Gemini stdin/stdout format may differ slightly

### 2. Compact Cache + Inject (two-phase)

Claude combines PreCompact + SessionStart(compact) into one flow. Gemini needs two separate hooks:
- `PreCompress` → cache critical context to temp file (same as Claude's compact-inject)
- `BeforeAgent` (one-shot) → read cached context and inject it

**New files:**
- `mcp_server/hooks/gemini/compact-cache.ts`
- `mcp_server/hooks/gemini/compact-inject.ts`

### 3. Session Stop

Rebuild as `AfterAgent` + `AfterModel` instead of a single Stop hook. Don't reuse `claude-transcript.ts` — Gemini's transcript format is different.

**New file:** `mcp_server/hooks/gemini/session-stop.ts`

### 4. Settings Registration

**Edit:** `.gemini/settings.json` — add hooks block pointing to the new scripts

### 5. Shared Core Extraction (if port is stable)

If the Gemini hooks work well, extract shared helpers so Claude and Gemini don't drift:
- Shared: context gathering, budget calculation, state management
- Runtime-specific: stdin/stdout format, transcript parsing, event names

## Files to Change

| File | Change |
|------|--------|
| New `mcp_server/hooks/gemini/session-prime.ts` | Session start priming |
| New `mcp_server/hooks/gemini/compact-cache.ts` | Pre-compress context caching |
| New `mcp_server/hooks/gemini/compact-inject.ts` | Post-compress context injection |
| New `mcp_server/hooks/gemini/session-stop.ts` | After-agent session tracking |
| `.gemini/settings.json` | Hook registration |

## Cross-Runtime Impact

| Runtime | Before | After |
|---------|--------|-------|
| Gemini CLI | 50% (0 hooks configured) | 85% (5-6 hooks) |
| All others | No change | No change |

## Estimated LOC: 140-260
## Risk: MEDIUM — Gemini hook API may have undocumented differences from Claude
## Dependencies: None — can be done independently

---

## Implementation Status (Post-Review Iterations 041-050)

| Item | Status | Evidence |
|------|--------|----------|
| 1. Session Prime (SessionStart) | DONE | hooks/gemini/session-prime.ts (165 lines) |
| 2a. Compact Cache (PreCompress) | DONE | hooks/gemini/compact-cache.ts (138 lines) |
| 2b. Compact Inject (BeforeAgent) | DONE | hooks/gemini/compact-inject.ts (83 lines) — F055 FIXED (sanitized payload now used) |
| 3. Session Stop (SessionEnd) | DONE | hooks/gemini/session-stop.ts (114 lines) |
| 4. Settings Registration | DONE | .gemini/settings.json hook block |
| 5. Shared utilities | DONE | hooks/gemini/shared.ts (89 lines) — parseGeminiStdin, formatGeminiOutput |

### Review Findings (iter 046)
- F055 (P2): sanitized payload unused in compact-inject.ts. FIXED (iter 041-050 fixes)
- F056 (P2): session-stop reads transcript without size limit. DEFERRED (practical risk is low)
