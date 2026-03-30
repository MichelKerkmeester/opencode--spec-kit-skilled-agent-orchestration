# Iteration 018: Claude Code Hooks Stdin/Stdout Schema

## Focus
Pin down the current, documented stdin payloads and stdout/context-injection behavior for Claude Code `PreCompact`, `SessionStart`, and `Stop` hooks, then separate that from repo-level caveats and schema-drift evidence.

## Findings
1. `PreCompact` documented stdin schema is:
   - `session_id`
   - `transcript_path`
   - `cwd`
   - `hook_event_name: "PreCompact"`
   - `trigger: "manual" | "auto"`
   - `custom_instructions: string`
   
   The docs say this is “in addition to the common input fields,” but the official example omits `permission_mode`, and the common-fields table explicitly says not all events receive it. So the current documented payload is the 6 fields above. `PreCompact` has no decision control, and its stdout is not injected into model context.

2. `SessionStart` documented stdin schema is:
   - `session_id`
   - `transcript_path`
   - `cwd`
   - `hook_event_name: "SessionStart"`
   - `source: "startup" | "resume" | "clear" | "compact"`
   - `model: string`
   - `agent_type?: string`
   
   The docs explicitly call out `source`, `model`, and optional `agent_type`. The official example again omits `permission_mode`, so it should not be assumed present for this event. I did not find a public repo type file that exposed anything more precise than the docs here.

3. `Stop` documented stdin schema is:
   - `session_id`
   - `transcript_path`
   - `cwd`
   - `permission_mode`
   - `hook_event_name: "Stop"`
   - `stop_hook_active: boolean`
   - `last_assistant_message: string`
   
   `stop_hook_active` is the loop guard: it is `true` when Claude is already continuing because of a prior stop-hook intervention. `last_assistant_message` is now documented as the final assistant response text, so transcript parsing is no longer required for that field.

4. `SessionStart` stdout injection supports both plain text and structured JSON.
   - Plain text: on exit code `0`, any text printed to stdout is added directly to Claude’s context.
   - Structured: on exit code `0`, stdout may instead be a JSON object; for `SessionStart`, `hookSpecificOutput.additionalContext` is injected into context.
   - You cannot mix arbitrary prose and JSON in the same stdout stream. If you use JSON, stdout must contain only the JSON object.

5. `hookSpecificOutput.additionalContext` is the structured context-injection channel.
   - It lives under `hookSpecificOutput` with a matching `hookEventName`.
   - For `SessionStart`, it injects a string into Claude’s context, and multiple matching hooks are concatenated.
   - The same pattern is also used on other events like `UserPromptSubmit` and `PostToolUse`.
   - For async hooks, `additionalContext` or `systemMessage` is delivered on the next turn after the background hook finishes.

6. Timeout defaults for command hooks are 600 seconds.
   - Common hook field defaults: `timeout` defaults to `600` for `command`, `30` for `prompt`, `60` for `agent`.
   - Async command hooks use the same 10-minute default unless overridden.
   - Special case: `SessionEnd` hooks default to `1.5s`, capped by `CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS`.

7. The `matcher` field for `SessionStart` filters on `source`, using regex matching.
   - Valid source values are `startup`, `resume`, `clear`, and `compact`.
   - `"*"`, `""`, or omitting `matcher` matches all occurrences.
   - Practically, `matcher: "resume|compact"` is the right shape if you want a shared handler for those two start modes.

8. A single documented hook registration does not span multiple event types.
   - Configuration is keyed by event name: `hooks: { SessionStart: [...], Stop: [...] }`.
   - So if one script should run for both `SessionStart` and `Stop`, you register it separately under each event.
   - You can still reuse the same command string in multiple event entries.

9. Hook scripts run inside Claude Code’s environment, with a few hook-specific variables documented.
   - `CLAUDE_PROJECT_DIR`: project root; available when Claude spawns the hook command.
   - `CLAUDE_CODE_REMOTE`: set to `"true"` in remote web environments, unset in local CLI.
   - `CLAUDE_ENV_FILE`: only for `SessionStart`, `CwdChanged`, and `FileChanged`; write `export ...` lines there to persist env vars for later Bash commands.
   - `CLAUDECODE` is explicitly not set in hooks.
   - The parent environment is inherited, but `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` can scrub Anthropic/cloud credentials from subprocesses, including hooks.

10. Error handling is exit-code driven, with event-specific consequences.
   - Exit `0`: success; JSON on stdout is parsed only on exit `0`.
   - Exit `2`: “blocking error.” For `Stop`, it prevents stopping and feeds stderr back to Claude. For `SessionStart` and `PreCompact`, it cannot block; stderr is shown to the user only.
   - Any other non-zero exit code: non-blocking error; stderr is shown in verbose mode and execution continues.
   - Special cases: `WorktreeCreate` fails on any non-zero exit; `WorktreeRemove` failures are debug-log only; `InstructionsLoaded` ignores exit code; `StopFailure` ignores output and exit code.

## Evidence
- Anthropic Hooks Reference: current authoritative schemas, matcher rules, stdout/JSON behavior, timeouts, async behavior, and per-event error handling.  
  https://code.claude.com/docs/en/hooks
- Anthropic Environment Variables reference: hook-relevant env vars including `CLAUDE_ENV_FILE`, `CLAUDECODE`, and subprocess env scrubbing.  
  https://code.claude.com/docs/en/env-vars
- Claude Code repo issue documenting schema drift and the addition of `last_assistant_message` to `Stop`/`SubagentStop`.  
  https://github.com/anthropics/claude-code/issues/26710
- Claude Code repo issue reporting that plugin `SessionStart` `additionalContext` did not surface correctly, which matters for implementation risk if hooks are plugin-packaged.  
  https://github.com/anthropics/claude-code/issues/16538
- Related repo issue with the same plugin-output caveat for `SessionStart`/`UserPromptSubmit`.  
  https://github.com/anthropics/claude-code/issues/12151

I did check the public `anthropics/claude-code` repository surface, but I did not find a public TS/JSON type-definition file for these hook payloads that was more authoritative than the docs. The current docs appear to be the canonical schema source; the repo issues are useful mainly for change history and edge-case caveats.

## New Information Ratio (0.0-1.0)
0.78

## Novelty Justification
Iteration 011 already had the important high-level truths: `PreCompact` stdout is not injected, `SessionStart` has source-based matching, `Stop` has `stop_hook_active`, and the system has 25 lifecycle events / 4 handler types. This pass adds the missing field-level payload definitions, clarifies that `SessionStart` supports both plain-text stdout injection and structured `additionalContext`, confirms `last_assistant_message` on `Stop`, pins the real default timeouts, explains matcher semantics precisely, and captures the repo-level plugin-output caveat.

## Recommendations for Implementation
- Use `SessionStart` as the primary lifecycle hook for context injection. Prefer structured JSON with `hookSpecificOutput.additionalContext` over plain text stdout when you want deterministic behavior.
- Do not rely on `PreCompact` stdout for injection. Treat `PreCompact` as a side-effect/logging/state-prep hook only.
- For stop gating, use synchronous `Stop` hooks and check `stop_hook_active` to avoid infinite continuation loops. Use `last_assistant_message` instead of parsing transcripts when possible.
- Register hooks separately per event. Reuse the same script if needed, but do not assume a multi-event registration syntax exists.
- If you package this as a plugin, explicitly test `SessionStart` context injection. The repo has open bug history suggesting plugin-defined `additionalContext` was at least sometimes dropped, even when settings-defined hooks worked.