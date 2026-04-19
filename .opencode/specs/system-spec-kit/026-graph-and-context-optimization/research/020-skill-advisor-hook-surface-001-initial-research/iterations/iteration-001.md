# Iteration 001 - Hook Trigger Enumeration

## Focus

Enumerate existing hook trigger points per runtime for the 020 skill-advisor hook surface research. This pass is intentionally enumeration-only: no implementation proposal, no architecture ranking, and no child-packet decomposition yet.

## Actions

- Read the packet strategy and config to confirm Q1-Q10 and iteration 1 scope.
- Read the cross-runtime hook docs and runtime hook files under `mcp_server/hooks/{claude,gemini,copilot}/`.
- Read shared hook utility modules: `memory-surface.ts`, `index.ts`, `mutation-feedback.ts`, `response-hints.ts`, and `shared-provenance.ts`.
- Read `lib/code-graph/startup-brief.ts` as the pattern reuse reference from parent ADR-002.
- Checked runtime registration surfaces in `.claude/settings.local.json`, `.gemini/settings.json`, and `.github/hooks/`.

## Enumeration Results

### Runtime Trigger Matrix

| Runtime | Trigger event | Registered in repo | Script or file | Current behavior | Per-prompt equivalent? |
| --- | --- | --- | --- | --- | --- |
| Claude | `SessionStart` | Yes, `.claude/settings.local.json` | `hooks/claude/session-prime.ts` | Reads hook stdin, routes `source` values `startup`, `resume`, `clear`, and `compact`, then emits startup or recovery context through stdout. Uses `buildStartupBrief()` on startup. | No. Session start only. |
| Claude | `PreCompact` | Yes, `.claude/settings.local.json` | `hooks/claude/compact-inject.ts` | Reads transcript tail, builds merged compact context from memory/code graph/CocoIndex path, writes pending compact prime into hook state, emits no stdout payload. | No. Compaction only. |
| Claude | `Stop` | Yes, `.claude/settings.local.json` | `hooks/claude/session-stop.ts` | Parses Claude transcript usage, records producer metadata and session summary, retargets active spec folder when transcript evidence changes, and may run context autosave. | No. End-of-session only. |
| Claude | `UserPromptSubmit` | No current Spec Kit registration found | None in current hook settings or hook scripts | No implemented advisor surface. Prior memory notes mention `UserPromptSubmit` was demoted in adjacent cache-warning sequencing, but current evidence is the settings/scripts absence. | Gap. This is the Claude-native event that would most directly match advisor-on-prompt, but it is not wired here. |
| Claude | `PreToolUse` | No current Spec Kit registration found | None in current hook settings or hook scripts | Not implemented in the current Spec Kit hook surface. | No. |
| Claude | `PostToolUse` | No current Spec Kit registration found | None in current hook settings or hook scripts | Not implemented in the current Spec Kit hook surface. | No. |
| Claude | `Notification` | No current Spec Kit registration found | None in current hook settings or hook scripts | Not implemented in the current Spec Kit hook surface. | No. |
| Gemini | `SessionStart` | Yes, `.gemini/settings.json` | `hooks/gemini/session-prime.ts` | Emits Gemini JSON with `hookSpecificOutput.additionalContext`; routes `source` values `startup`, `resume`, `clear`, and defensive `compact`. Uses `buildStartupBrief()` on startup. | No. Session start only. |
| Gemini | `PreCompress` | Yes, `.gemini/settings.json` | `hooks/gemini/compact-cache.ts` | Reads transcript tail and caches fallback compact context for later recovery. | No. Compression only. |
| Gemini | `BeforeAgent` | Yes, `.gemini/settings.json` | `hooks/gemini/compact-inject.ts` | Checks for pending compact cache and injects once through Gemini additional context; normal non-post-compress turns are no-op. | Partial-looking but not suitable as-is. It fires before the agent, but current implementation is one-shot compact recovery, not every prompt advisor routing. |
| Gemini | `SessionEnd` | Yes, `.gemini/settings.json` | `hooks/gemini/session-stop.ts` | Persists active spec folder and summary from transcript/prompt response. Does not parse Gemini token usage. | No. End-of-session only. |
| Gemini | `AfterAgent` | Typed input support only | `hooks/gemini/shared.ts`, consumed by `session-stop.ts` | `GeminiHookInput` includes `prompt_response`; `session-stop.ts` uses it for summary extraction. No registered `AfterAgent` hook in `.gemini/settings.json`. | No. |
| Copilot | `sessionStart` | Wrapper exists under `.github/hooks/scripts/session-start.sh`; Superset config also lists it | `hooks/copilot/session-prime.ts` | Startup banner surface. Reads stdin, calls `buildStartupBrief()` if available, falls back open on script failure or missing dist file. | No. Session start only. |
| Copilot | Compact cache event | Script exists, but no direct `.github/hooks` registration found for Spec Kit | `hooks/copilot/compact-cache.ts` | Reads transcript tail from stdin payload and stores pending compact prime with shared provenance. | No. Cache producer only. |
| Copilot | `source=compact` recovery | Handled by session-prime when wrapper forwards it | `hooks/copilot/session-prime.ts` | Recovers a pending compact payload and clears it after stdout. | No. Recovery path only. |
| Copilot | `userPromptSubmitted` | Listed only in `.github/hooks/superset-notify.json` | External `/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh userPromptSubmitted`, not Spec Kit advisor hook code | Notification integration exists outside the Spec Kit hook scripts. It does not call the skill advisor or shared startup-brief pattern. | Possible external wrapper signal, but not an implemented Spec Kit advisor hook. |
| Copilot | `postToolUse` | Listed only in `.github/hooks/superset-notify.json` | External `/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh postToolUse`, not Spec Kit advisor hook code | Notification integration only. | No. |

### File x Trigger Matrix

| File | Runtime | Trigger event or surface | Notes |
| --- | --- | --- | --- |
| `hooks/README.md` | Shared | Directory overview | States `hooks/` is a utility layer, not standalone hook registration; documents Claude lifecycle scripts as `PreCompact`, `SessionStart`, and `Stop`. |
| `hooks/claude/README.md` | Claude | `PreCompact`, `SessionStart`, `Stop` | Documents the Claude lifecycle flow: `PreCompact -> cache context -> SessionStart(compact) -> inject cached context`; `SessionStart(startup)` and `Stop`. |
| `hooks/claude/shared.ts` | Claude/shared | stdin/stdout helper | Defines Claude hook stdin shape with `session_id`, `transcript_path`, `trigger`, `source`, `stop_hook_active`, and `last_assistant_message`; no prompt-submit field or handler. |
| `hooks/claude/hook-state.ts` | Shared via Claude state | State persistence | Provides shared temp state, compact-prime validation, semantic safety checks, and pending compact prime lifecycle for all three runtime ports. |
| `hooks/claude/claude-transcript.ts` | Claude | Stop transcript parser | Parses Claude JSONL transcript usage for stop-hook metrics; not a trigger registration point. |
| `hooks/claude/compact-inject.ts` | Claude | `PreCompact` | Builds and caches compact context; explicitly does not inject stdout on `PreCompact`. |
| `hooks/claude/session-prime.ts` | Claude | `SessionStart` | Handles source-aware startup/resume/clear/compact routing and reuses `buildStartupBrief()` for startup. |
| `hooks/claude/session-stop.ts` | Claude | `Stop` | Processes stop hook state, transcript metrics, spec retargeting, session summary, and autosave. |
| `hooks/gemini/README.md` | Gemini | `SessionStart`, compaction, stop support | Names session prime, compact inject, session stop, compact cache, and shared helpers. |
| `hooks/gemini/shared.ts` | Gemini | stdin/stdout helper | Defines `hook_event_name`, `source`, `trigger`, `prompt`, `prompt_response`, and `reason`; formats `additionalContext` for injection. |
| `hooks/gemini/session-prime.ts` | Gemini | `SessionStart` | Startup/resume/clear/defensive compact routing; calls `buildStartupBrief()` for startup. |
| `hooks/gemini/compact-cache.ts` | Gemini | `PreCompress` | Caches compact context from transcript tail. |
| `hooks/gemini/compact-inject.ts` | Gemini | `BeforeAgent` | One-shot compact recovery injection only; no-op when no pending compact payload exists. |
| `hooks/gemini/session-stop.ts` | Gemini | `SessionEnd` | Persists active spec folder and summary from Gemini stop context; does not parse token usage. |
| `hooks/copilot/README.md` | Copilot | `sessionStart` | Documents only the current Copilot SessionStart banner hook. |
| `hooks/copilot/session-prime.ts` | Copilot | `sessionStart`, defensive `source=compact` | Emits startup banner from `buildStartupBrief()` or recovers compact payload if wrapper passes `source=compact`. |
| `hooks/copilot/compact-cache.ts` | Copilot | Compact-cache wrapper input | Caches fallback compact context, but current `.github/hooks` search did not show a direct Spec Kit registration for it. |
| `hooks/index.ts` | Shared MCP module | Barrel exports | Exports memory surfacing, compaction helper, mutation feedback, response hints, and session tracking. Gemini hooks are explicitly standalone and not barrel-exported. |
| `hooks/memory-surface.ts` | Shared MCP module | Tool dispatch, compaction, first-tool auto-prime | Provides `autoSurfaceAtToolDispatch()`, `autoSurfaceAtCompaction()`, and `primeSessionIfNeeded()` for MCP/server integration. These are not runtime prompt-submit hooks. |
| `hooks/mutation-feedback.ts` | Shared MCP module | Post-mutation feedback | Formats post-mutation cache clear/invalidation feedback; not a runtime lifecycle trigger. |
| `hooks/response-hints.ts` | Shared MCP module | Response-envelope hints | Appends auto-surface hints and token metadata to MCP JSON envelopes; not a runtime lifecycle trigger. |
| `hooks/shared-provenance.ts` | Shared runtime helper | Compact recovery provenance | Shared sanitization and provenance wrapper used across Claude/Gemini/Copilot compact recovery. |
| `lib/code-graph/startup-brief.ts` | Shared pattern reference | Startup brief producer | Builds `startupSurface`, structural context, session continuity, and shared payload envelope with fail-open/missing/stale semantics. This is the shape to mirror for an advisor brief producer later. |

## Questions Answered

- Q1 partial answer: Current checked-in Spec Kit hook surfaces do not provide a skill-advisor per-prompt hook equivalent. Claude has no registered `UserPromptSubmit` in `.claude/settings.local.json`; Gemini has a registered `BeforeAgent`, but the current implementation is one-shot compact recovery and returns immediately when no pending compact payload exists; Copilot has `userPromptSubmitted` only in an external Superset notification config, not in the Spec Kit advisor hook scripts. Codex CLI hook availability remains unanswered because this iteration focused on the requested Claude/Gemini/Copilot hook files and registration surfaces.

Answered questions count for reducer: 1 partial of 10.

## Gaps

- No current Spec Kit implementation fires an advisor brief on every user prompt.
- The shared MCP `autoSurfaceAtToolDispatch()` can infer context from tool args, but it fires at tool dispatch, not at prompt submission.
- Gemini `BeforeAgent` is the closest runtime hook shape for prompt-time injection, but current code deliberately treats it as compact recovery only.
- Copilot's external Superset `userPromptSubmitted` signal may be useful as wrapper evidence, but it is not wired to `hooks/copilot/*` and should not be treated as existing advisor behavior.
- Codex CLI equivalent remains open for a later iteration.

## Next Focus

Iteration 2 should investigate the actual prompt-submit availability and wrapper feasibility for Codex CLI, Claude `UserPromptSubmit`, Gemini `BeforeAgent`, and Copilot/Superset-style wrapper events, then separate native hook support from wrapper-only support.

## Ruled Out

- Treating `memory-surface.ts` as the per-prompt runtime hook. It is a shared MCP/server helper for tool dispatch, compaction, and first-tool auto-priming, not a runtime prompt-submit registration.
- Treating Copilot Superset notifications as implemented Spec Kit advisor hooks. They show a possible event signal (`userPromptSubmitted`) but route to an external notification script, not to the skill advisor or startup-brief-style producer.
