# Research Iteration 103: Gemini CLI Hook Support Gap Analysis

## Focus
Analyze the gap between Claude hooks and Gemini hooks, and determine the strategy to port Claude hook functionality to Gemini CLI format.

## Findings

### Current State

Claude already has three project-wired context-preservation hooks: `SessionStart -> session-prime.js`, `PreCompact -> compact-inject.js`, and `Stop -> session-stop.js`. They handle startup/resume priming, pre-compaction cache generation, and per-turn/session state capture. [SOURCE: .claude/settings.local.json] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts]

Gemini in this repo has MCP servers, agents, and instruction-file config, but no `hooks` section at all, so none of that runtime-specific preservation exists today. [SOURCE: .gemini/settings.json]

Gemini CLI now supports a real hook system with `BeforeTool`, `AfterTool`, `BeforeAgent`, `AfterAgent`, `SessionStart`, `SessionEnd`, `PreCompress`, `BeforeModel`, `AfterModel`, and `BeforeToolSelection`. [SOURCE: google-gemini/gemini-cli/docs/hooks/reference.md] [SOURCE: google-gemini/gemini-cli/packages/core/src/hooks/types.ts]

### Problem

Gemini CLI is no longer missing hooks as a platform; this project is missing Gemini hook configuration. That leaves Gemini with static instructions and MCP access, but without dynamic session priming, pre-compression cache/recovery, or per-turn state capture. In practical context-preservation terms, Gemini is still around 50% parity, but it can likely reach about 80-85% with a focused port.

## Analysis

### Claude Hook Events

Relevant Claude event families for this gap:

- `SessionStart` -- startup/resume/clear/compact entry point; can inject context. This project uses it for priming and compact recovery. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts]
- `PreCompact` -- fires before compaction; this project uses it to build and cache a merged recovery brief. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts]
- `Stop` -- post-turn lifecycle hook; this project uses it for token snapshots, spec-folder detection, summary extraction, and auto-save hints. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts]
- Broader Claude surface also includes prompt, tool, notification, session-end, and subagent lifecycle hooks; those matter for general parity, but not for the current preservation port.

### Gemini Hook Events

Official Gemini names:

- `BeforeTool` = preToolCall
- `AfterTool` = postToolCall
- `BeforeAgent` = preUserPrompt
- `AfterModel` = postModelResponse at model-chunk level
- `AfterAgent` = post-turn/final-response hook
- `SessionStart`, `SessionEnd`, `Notification`, `PreCompress`
- `BeforeModel`, `BeforeToolSelection` are Gemini-only extras

Important Gemini contract differences:

- Hooks must emit JSON on `stdout`, not raw text.
- `SessionStart.source` is only `startup | resume | clear`; there is no `compact` source.
- `PreCompress` is advisory-only and cannot directly alter compression.
- `AfterAgent` carries `prompt`, `prompt_response`, `stop_hook_active`.
- `AfterModel` exposes `llm_response`, including usage metadata, and fires per chunk.

### Event Mapping

| Claude Event | Gemini Equivalent | Gap | Port Strategy |
|-------------|-------------------|-----|---------------|
| `SessionStart` | `SessionStart` | Close match, but Gemini has no `source=compact`; output must be JSON `additionalContext`, not plain stdout text | Port startup/resume/clear directly; wrap rendered context into `hookSpecificOutput.additionalContext` |
| `PreCompact` | `PreCompress` | Gemini has no post-compaction re-entry event; advisory only | Cache merged brief at `PreCompress`, then inject once on next `BeforeAgent` or `BeforeModel` |
| `Stop` | `AfterAgent` + `SessionEnd` + `AfterModel` | Claude has one post-turn hook; Gemini splits responsibilities | Use `AfterAgent` for summary/spec detection, `AfterModel` for usage, `SessionEnd` for cleanup only |
| `UserPromptSubmit` | `BeforeAgent` | Good functional match | Use for one-shot compact-context reinjection and prompt-time resume hints |
| `PreToolUse` | `BeforeTool` | Good match | Not required for core port, but available if later needed |
| `PostToolUse` | `AfterTool` | Good match | Optional future parity for tool-result augmentation |
| `Notification` | `Notification` | Good match | Optional future parity |
| `PostCompact` | None | No direct equivalent | Simulate with `PreCompress` + deferred `BeforeAgent`/`BeforeModel` injection |
| `SubagentStart/Stop` | None | No Gemini equivalent surfaced in official hook types | No port; leave as gap |

## Proposals

### Proposal A: Full Hook Port to Gemini

- Description: Port the three Claude behaviors into Gemini-native hook files without refactoring Claude. Because compaction needs a deferred injection point, this is really a 4-hook Gemini setup: `SessionStart`, `PreCompress`, `BeforeAgent`/`BeforeModel`, `AfterAgent` (+ optional `AfterModel`).
- LOC estimate: 180-320
- Files to change: `.gemini/settings.json`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts`
- Dependencies: Gemini JSON-output adapter, Gemini-specific state dir, build output under `dist/hooks/gemini`, usage handling via `AfterModel` or Gemini transcript format
- Risk: MEDIUM — fastest path, but duplicates logic and still must solve the compaction mismatch cleanly

### Proposal B: Shared Hook Core with Runtime Adapters

- Description: Extract runtime-neutral logic for state storage, section rendering, compact-brief generation, summary extraction, and spec detection; keep Claude/Gemini entrypoints as thin adapters.
- LOC estimate: 260-480
- Files to change: existing Claude hook files, new shared hook-core modules, new Gemini adapters, `.gemini/settings.json`
- Dependencies: state-schema neutralization (`speckit-claude-hooks` is currently Claude-branded), JSON-vs-raw-output adapters, event-specific adapter layer
- Risk: MEDIUM-HIGH — best long-term architecture, but touches already-working Claude behavior

### Proposal C: Gemini-Native Workflow Hooks

- Description: Do not clone Claude semantics exactly. Use `SessionStart` for startup/resume, `PreCompress` to cache, `BeforeAgent` to reinject, `AfterAgent` for per-turn summary/spec state, and `AfterModel` for token/usage data.
- LOC estimate: 140-260
- Files to change: `.gemini/settings.json`, Gemini hook files only
- Dependencies: one-shot cache consumption logic, `AfterModel` usage accumulator, optional fallback if no usable transcript schema
- Risk: LOW-MEDIUM — lowest coupling and best fit to Gemini's actual model, but parity is behavioral rather than 1:1

## Recommendation

Best approach: **Proposal C, implemented with Proposal B boundaries in mind**.

Why: Gemini is not missing hooks; it has a different lifecycle. The biggest mismatch is Claude's `PreCompact -> SessionStart(source=compact)` pattern, which Gemini cannot reproduce exactly because `SessionStart` has no `compact` source and `PreCompress` is advisory-only. A Gemini-native flow is cleaner:

- `SessionStart` for startup/resume/clear priming
- `PreCompress` to compute/cache recovery state
- `BeforeAgent` to inject cached compact recovery once
- `AfterAgent` for summary/spec-folder state
- `AfterModel` for token/usage snapshots
- `SessionEnd` only for best-effort cleanup

That should deliver most of the value without destabilizing Claude.

## Cross-Runtime Impact

| Runtime | Current Hook Coverage | After Implementation | Parity Change |
|---------|---------------------|---------------------|---------------|
| Claude Code | 25 events | No change | 100% stays 100% |
| Gemini CLI | 0 events configured | 5-6 events configured (`SessionStart`, `PreCompress`, `BeforeAgent`, `AfterAgent`, `AfterModel`, optional `SessionEnd`) | ~50% -> ~85% |

## Next Steps

1. Add a `hooks` block to `.gemini/settings.json`; Gemini registration lives there, not in `.claude/settings.local.json`.
2. Port `session-prime` first. This is the highest-confidence win because `SessionStart` maps directly for `startup`, `resume`, and `clear`.
3. Split `compact-inject` into two Gemini phases: `PreCompress` cache writer and `BeforeAgent` one-shot injector.
4. Rebuild `session-stop` as `AfterAgent` + `AfterModel`, not as a direct transcript-parser clone. The current `claude-transcript.ts` is Claude-specific and should not be reused as-is. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts]
5. If the Gemini port proves stable, then extract shared core helpers so Claude and Gemini stop drifting.

## Metadata
- Model: GPT-5.4 via Copilot CLI
- Effort: high
