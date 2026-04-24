# Iteration 9: Codex hook stdin and stdout contract
## Focus
This iteration targeted Q1 and Q2: the exact stdin payload format Codex sends to command hooks, and whether hook stdout is injected into model-visible context.

## Actions Taken
1. Checked the official Codex hooks documentation, now published at https://developers.openai.com/codex/hooks, with attention to common input fields, event-specific output handling, timeout, matcher behavior, concurrency, and event taxonomy.
2. Read generated wire schemas in the OpenAI Codex repository for `SessionStart` and `UserPromptSubmit` input and output:
   - https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/session-start.command.input.schema.json
   - https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/user-prompt-submit.command.input.schema.json
   - https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/user-prompt-submit.command.output.schema.json
3. Read Codex hook engine source for command execution, dispatcher behavior, `SessionStart` output parsing, and `UserPromptSubmit` output parsing:
   - https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/engine/command_runner.rs
   - https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/engine/dispatcher.rs
   - https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/events/session_start.rs
   - https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/events/user_prompt_submit.rs
4. Confirmed the local runtime version with `codex --version`: `codex-cli 0.122.0`.
5. Read local hook config and Superset notify hook without modifying either:
   - `/Users/michelkerkmeester/.codex/hooks.json`
   - `/Users/michelkerkmeester/.superset/hooks/notify.sh`

## Findings
- Q1: Codex command hooks receive exactly one JSON object on stdin. The official docs state this directly, and common fields include `session_id`, `transcript_path`, `cwd`, `hook_event_name`, and `model`; turn-scoped hooks add `turn_id` in event-specific tables. Primary source: https://developers.openai.com/codex/hooks
- Q1: The generated `SessionStart` input schema requires `cwd`, `hook_event_name`, `model`, `permission_mode`, `session_id`, `source`, and `transcript_path`; `source` currently includes `startup`, `resume`, and `clear` in the schema, while docs describe current runtime matcher values as `startup` and `resume`. Primary source: https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/session-start.command.input.schema.json
- Q1: The generated `UserPromptSubmit` input schema requires `cwd`, `hook_event_name`, `model`, `permission_mode`, `prompt`, `session_id`, `transcript_path`, and `turn_id`, confirming that the user prompt is passed in the JSON payload under `prompt`, not as raw stdin text. Primary source: https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/user-prompt-submit.command.input.schema.json
- Q1: Source confirms the implementation serializes `SessionStartCommandInput` / `UserPromptSubmitCommandInput` with `serde_json::to_string(...)`, then `command_runner` writes those bytes to the hook process stdin. Primary sources: https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/events/session_start.rs and https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/events/user_prompt_submit.rs and https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/engine/command_runner.rs
- Q2: For `SessionStart`, plain stdout is added as extra developer context; JSON stdout may use `hookSpecificOutput.additionalContext`, which is also added as extra developer context. Primary source: https://developers.openai.com/codex/hooks
- Q2: For `UserPromptSubmit`, plain stdout is added as extra developer context; JSON stdout may use `hookSpecificOutput.additionalContext`, and that text is added as extra developer context. Primary source: https://developers.openai.com/codex/hooks
- Q2: Source-level tests and parser paths confirm the docs: `session_start.rs` has a `plain_stdout_becomes_model_context` test, and both `session_start.rs` and `user_prompt_submit.rs` append parsed or plain additional context into `additional_contexts_for_model`. Primary sources: https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/events/session_start.rs and https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/events/user_prompt_submit.rs
- Q3/Q7: `UserPromptSubmit` supports the Claude-style blocker pattern: return JSON `{"decision":"block","reason":"..."}` or exit code `2` with a blocking reason on stderr. The source marks status `Blocked`, sets `should_stop = true`, and captures the reason as feedback. Primary sources: https://developers.openai.com/codex/hooks and https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/events/user_prompt_submit.rs
- Q4: Timeout is configured per command hook in seconds; `timeoutSec` is an alias; omitted timeout defaults to `600` seconds. Source confirms `timeout_sec.unwrap_or(600).max(1)` and `tokio::time::timeout(...)` returns an error string `hook timed out after {timeout}s`. Primary sources: https://developers.openai.com/codex/hooks and https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/engine/discovery.rs and https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/engine/command_runner.rs
- Q5: Matching hooks from multiple files all run; multiple matching command hooks for the same event are launched concurrently. Source confirms `execute_handlers` uses `futures::future::join_all(...)`; selection preserves declaration/display order for result aggregation, but execution is concurrent, so one matching hook cannot prevent another from starting. Primary sources: https://developers.openai.com/codex/hooks and https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/engine/dispatcher.rs
- Q6: Official docs and generated schemas expose six hook events in the current taxonomy: `SessionStart`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `UserPromptSubmit`, and `Stop`. Primary sources: https://developers.openai.com/codex/hooks and https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/user-prompt-submit.command.output.schema.json
- Q8: The command runner sets current directory and stdio but does not call `env_clear`; by Rust/Tokio command defaults, this implies inherited parent environment. Local Superset hook also depends on inherited `SUPERSET_*` env vars. This is evidence but still worth validating with a controlled probe in iteration 10 because the official docs do not explicitly specify env sanitization. Primary source: https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/engine/command_runner.rs

## Questions Answered
- Q1: Advanced to answered. Codex passes one JSON object on stdin for command hooks. `SessionStart` includes common fields plus `source`; `UserPromptSubmit` includes common fields plus `turn_id` and `prompt`. Evidence: official docs, generated schemas, and serialization source.
- Q2: Advanced to answered for `SessionStart` and `UserPromptSubmit`. Plain stdout and `hookSpecificOutput.additionalContext` become extra developer context for both events. Evidence: official docs plus event parser source/tests.
- Q3: Advanced. Exit `0` with no output succeeds; `UserPromptSubmit` can block via JSON `decision:block` with reason or exit code `2` with reason on stderr; other non-zero exits fail the hook run. Evidence: official docs and `user_prompt_submit.rs`.
- Q4: Advanced to answered. Default timeout is 600 seconds, minimum effective timeout is 1 second, timeout produces a failed hook run error. Evidence: official docs, discovery source, command runner source.
- Q5: Advanced to answered. Multiple matching command hooks launch concurrently, with selected handler order preserved for aggregation. Evidence: official docs and dispatcher source.
- Q6: Advanced to answered. Current taxonomy is `SessionStart`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `UserPromptSubmit`, `Stop`. Evidence: official docs and generated schema enum.
- Q7: Advanced to answered for decline/block, not transform. `UserPromptSubmit` can decline/block but no evidence supports prompt transformation; `updatedInput` is explicitly unsupported/fail-open for `PreToolUse`, and no `updatedInput` field appears in `UserPromptSubmit` output schema. Evidence: official docs and generated schema.
- Q8: Advanced but not fully closed. Source implies env inheritance, but docs omit an explicit env contract.

## Questions Remaining
- Q8: Explicit env var propagation contract still needs a direct controlled probe or upstream source statement for `HOME`, `PATH`, `OPENAI_API_KEY`, and custom env vars.
- Q2 nuance: Confirm exact placement/rendering of extra developer context in the transcript/model input pipeline: docs say "extra developer context", but not whether it is prepended or appended relative to other developer messages.
- Q7 nuance: Confirm there is no prompt transform path for `UserPromptSubmit`; current schema lacks it, but a source grep for `updatedInput` across all hook output parsers would close it more tightly.

## Next Focus
Iteration 10 should run a non-mutating source pass plus, if permitted by the loop owner, a temporary isolated probe in a throwaway `$CODEX_HOME` to verify env propagation and the exact transcript placement of hook-injected developer context without touching the real `~/.codex/hooks.json`.
