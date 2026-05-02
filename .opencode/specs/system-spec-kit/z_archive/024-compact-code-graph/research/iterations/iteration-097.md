# Research Iteration 097: Context Preservation Without PreCompact

## Focus
Investigate how non-hook CLIs can detect context loss (compaction, long conversations, context drift) and recover without PreCompact hooks, using MCP-side session continuity tracking.

## Findings

### Current State

`compact-inject.ts` tails the last ~50 transcript lines, extracts active files, topics, spec folder, and "attention" identifiers, runs `mergeCompactBrief`, optionally auto-surfaces constitutional memories, then caches the payload as `pendingCompactPrime` in hook state for the Claude session. `session-prime.ts` reads and clears that cache on `source=compact`, injects the recovered brief, and still tells the model to call `memory_context({ mode: "resume", profile: "resume" })` for full state.

Non-hook CLIs lack that event. They only have manual doc instructions plus generic MCP continuity primitives: `memory_context` resume mode, trusted `effectiveSessionId`, working-memory event counters, inferred mode, and persisted session identity in `session-manager`.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts`; `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts`]

### Problem

Non-hook CLIs silently lose context during long conversations with no automatic recovery mechanism. The PreCompact hook intercepts compaction events and caches recovery data; without it, the LLM's context window can be truncated and the model continues without realizing it has lost critical task state, spec folder references, and file modification history.

## Proposals

### Proposal A: MCP Session Health Monitor

- Description: Add a `session_health` tool/endpoint that scores likely context continuity using existing MCP-side signals: trusted `effectiveSessionId`, event counter continuity, last session-state update, working-memory prompt context availability, token-pressure ratio, and elapsed wall-clock gap since last tool call. Return `ok | warning | stale` plus recovery hints and a recommended next action (`memory_context` resume, re-read runtime doc, inspect spec folder).
- LOC estimate: 180-320
- Files to change:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/` (new `session-health` handler)
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
  - tests for the new handler
- Dependencies:
  - Existing `effectiveSessionId`
  - Existing `saveSessionState()`
  - Existing `getSessionEventCounter()`, `getSessionPromptContext()`
  - Existing token-pressure plumbing
- Risk: LOW-MEDIUM — mostly additive, but health scoring can produce false positives if heuristics are too eager.

### Proposal B: Periodic Auto-Save Checkpoints

- Description: Automatically create lightweight session checkpoints every N continuity-relevant tool calls or every M minutes. Do not run full `generate-context.js` every time; instead persist a compact session checkpoint record first, then optionally promote to a full memory save only when thresholds are crossed or the session becomes stale. Best source fields: current task, spec folder, last action, top working-memory items, recent tool names, and session summary.
- LOC estimate: 260-420
- Files to change:
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts`
  - possibly `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` (if adding a lighter JSON input contract)
  - tests for checkpoint cadence and dedupe
- Dependencies:
  - `session-manager` durable session table
  - working-memory prompt context
  - `generate-context.js` JSON-primary path
- Risk: MEDIUM — stronger durability, but more writes and more chances for noisy or duplicate saves if not rate-limited.

### Proposal C: Tool-Call Gap Detection with Recovery Injection

- Description: When MCP sees a suspicious gap before the next tool call, inject a recovery payload into the next tool response envelope metadata/hints. This is the closest non-hook analogue to Claude's post-compaction injection. Trigger on elapsed gap, session mismatch, empty working-memory context after a previously active session, or sudden reset-like query patterns ("where was I", "resume", repeated onboarding questions). Payload should include last spec folder, last task, checkpoint freshness, and a one-line instruction to call `memory_context(...resume...)`.
- LOC estimate: 140-260
- Files to change:
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts` or hint injection helpers
  - possibly `hooks/memory-surface.ts` if sharing injection format
- Dependencies:
  - existing envelope `meta` / `hints` injection path in `context-server.ts`
  - existing session save data
- Risk: LOW — reuses current response envelope pattern; main risk is warning fatigue.

### Proposal D: Enhanced Gate Doc Self-Monitoring Instructions

- Description: Strengthen `CODEX.md`, `GEMINI.md`, `AGENTS.md`, and root `CLAUDE.md` so non-hook runtimes proactively self-check continuity. Add explicit triggers: after long tool streaks, after >15 minutes idle, after repeated "what next"/"where was I" prompts, after unusually generic user follow-up, or when prior file/spec references disappear from working context. Instruct the model to call `memory_context({ input: "resume previous work continue session", mode: "resume", profile: "resume" })` and optionally `session_health`.
- LOC estimate: 40-90
- Files to change:
  - `CLAUDE.md`
  - `CODEX.md`
  - `GEMINI.md`
  - `AGENTS.md`
- Dependencies:
  - none beyond docs; stronger if paired with Proposal A
- Risk: LOW — cheap and cross-runtime, but still relies on model compliance.

## Recommendation

Best path: **A + C + D**, with **B in lightweight form only**.

A gives a runtime-agnostic truth source for session health.

C turns that truth into practical recovery nudges without hooks by injecting warnings into normal MCP tool responses.

D improves model-side compliance immediately with zero code changes.

B is valuable, but full memory-file autosave is heavier and noisier; start with checkpoint records in `session-manager`, then only escalate to `generate-context.js` when health becomes `stale` or at session end.

## Cross-Runtime Impact

| Runtime | Current Context Preservation | After Implementation | Parity Change |
|---------|------------------------------|---------------------|---------------|
| Claude Code | Full PreCompact hook | Hook + session health + fallback injection | 100% stays 100% |
| OpenCode | Manual only | Health checks + injected recovery hints + docs | 60% -> 85% |
| Codex CLI | `CODEX.md` instructions | Docs + health tool + gap-triggered hints | 55% -> 82% |
| Copilot CLI | None/manual memory use | Health tool + response hints + docs | 50% -> 80% |
| Gemini CLI | None/manual memory use | Health tool + response hints + docs | 50% -> 80% |

## Next Steps

1. Add `session_health` using existing `effectiveSessionId`, session state, working-memory context, and timestamp-gap heuristics.

2. Inject `sessionHealth` warnings into normal MCP envelopes in `context-server.ts`.

3. Update runtime docs to call `session_health` + `memory_context(...resume...)` on explicit drift triggers.

4. Optionally add lightweight checkpoint persistence before full autosave promotion.

## Metadata
- Model: GPT-5.4 via Copilot CLI
- Effort: high
- Runtime: ~1m 35s
- Token usage: ~490k in, ~6.1k out
