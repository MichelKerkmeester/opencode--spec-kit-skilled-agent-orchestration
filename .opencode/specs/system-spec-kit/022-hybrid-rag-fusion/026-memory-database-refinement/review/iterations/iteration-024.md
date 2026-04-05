# Iteration 024: Memory context handler (L1 orchestration)

## Findings

### [P1] Explicit `focused` mode disables the intent-aware ranking it advertises
**File** `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`

**Issue** `memory_context` documents `focused` as the intent-optimized path, but explicit `mode: "focused"` requests do not classify intent unless the caller also supplies `intent`. `resolveEffectiveMode()` only runs the classifier inside the `requestedMode === "auto"` branch, and `executeFocusedStrategy()` then forces `autoDetectIntent: false` when delegating to `memory_search`. The same query therefore gets intent-aware ranking in `auto -> focused`, but loses that optimization in explicit `focused`, producing inconsistent results for the same logical retrieval path.

**Evidence** `memory-context.ts:726-733` only populates `detectedIntent` inside auto mode. `memory-context.ts:596-616` forwards `intent: intent ?? undefined` while hard-setting `autoDetectIntent: false`, so an explicit `focused` request without `intent` reaches `handleMemorySearch()` with neither an explicit intent nor permission to infer one.

**Fix** When `effectiveMode === "focused"` and no explicit intent was provided, either classify intent before calling `executeFocusedStrategy()` or pass `autoDetectIntent: true` through to `memory_search`. That keeps explicit `focused` behavior aligned with the auto-routed focused lane.

### [P1] Resumed sessions in auto mode are not reconstructed unless the prompt happens to contain resume keywords
**File** `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`

**Issue** The handler resolves trusted session state up front, but `resolveEffectiveMode()` discards it with `void session` and only chooses `resume` from prompt text heuristics. A caller reconnecting with a valid session and asking something like "show blockers" or "what changed" will be routed by generic intent/length heuristics instead of the resume lane, so it misses resume anchors and the auto-resume prompt-context injection.

**Evidence** `memory-context.ts:702-712` accepts the resolved session state but explicitly ignores it. `memory-context.ts:726-741` selects `resume` only when the query matches the resume regex. `memory-context.ts:1136-1147` injects `systemPromptContext` only when both `resumedSession` and `effectiveMode === "resume"` are true, so resumed sessions routed to `focused`/`deep` lose their recovery context.

**Fix** Treat `session.resumed` as a first-class routing signal in auto mode. A practical fix is to prefer `resume` whenever a trusted session is resumed and the caller did not explicitly request another mode, with the query heuristic acting as a booster rather than the sole trigger.

### [P2] Auto-discovered spec folders are found too late to be persisted for later resume recovery
**File** `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`

**Issue** The handler persists session state before running folder discovery. If the current request omits `specFolder` and discovery finds one from the prompt, the live search uses the discovered folder, but the session record still stores `null` for `spec_folder`. Any later resume flow that depends on persisted session scope can therefore reconstruct the session without the folder that this turn already recovered.

**Evidence** `memory-context.ts:997-1003` calls `sessionManager.saveSessionState()` with `specFolder: spec_folder`, which is still the raw caller input. Folder discovery happens later in `memory-context.ts:1089` via `maybeDiscoverSpecFolder()`, and that helper only mutates `options.specFolder` (`memory-context.ts:779-790`). `session-manager.ts:1034-1058` shows `saveSessionState()` writes `spec_folder` into the persisted `session_state` row.

**Fix** Run folder discovery before the first `saveSessionState()` call, or write the session state a second time after discovery when `options.specFolder` was populated. That keeps persisted resume state aligned with the scope actually used for retrieval.

### [P1] Underlying handler errors are wrapped as successful L1 context responses
**File** `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`

**Issue** The strategy helpers blindly spread the `MCPResponse` returned by `memory_search` / `memory_match_triggers` into `ContextResult`, and the main handler only converts thrown exceptions into `E_STRATEGY`. If a downstream handler returns a normal MCP error envelope (`isError: true`) instead of throwing, `memory_context` still emits a success summary like "Context retrieved via focused mode", with the real error buried inside nested `content[0].text`.

**Evidence** `memory-context.ts:549-566`, `569-593`, `596-623`, and `626-653` all return `{ strategy, mode, ...result }` without checking `result.isError`. The main try/catch at `memory-context.ts:1091-1114` only handles thrown errors, and the success envelope is always built afterward in `memory-context.ts:1155-1188`. Downstream MCP errors explicitly set `isError: true` in `envelope.ts:243-253`, so this is a realistic path, not just a theoretical one.

**Fix** After `executeStrategy()`, inspect the returned MCP payload. If `result.isError === true`, either return that error envelope directly or unwrap and re-emit it as an L1 `createMCPErrorResponse()` with preserved downstream code/details. Do not publish a success summary when the selected retrieval layer already failed.

## Summary

The highest-signal orchestration issues are mode-selection inconsistencies and error handling: explicit `focused` mode loses intent-aware ranking, resumed sessions are only reconstructed when the prompt text explicitly says "resume", and downstream MCP errors can be mislabeled as successful L1 retrievals. I also found a secondary resume-state persistence bug where auto-discovered spec folders are applied to the live search too late to be written into session state, which can weaken later recovery flows.
