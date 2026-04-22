# Iteration 10: Stdin, context injection, and env contract closure
## Focus
This final iteration closed the remaining Q1/Q2/Q8 uncertainty with official docs, source-level hook runtime evidence, and an isolated local `CODEX_HOME` probe that did not modify the real `~/.codex/hooks.json`.

## Actions Taken
1. Re-read the official Codex hooks documentation for stdin, stdout, timeout, event taxonomy, matcher, and concurrency semantics: https://developers.openai.com/codex/hooks
2. Re-read generated command schemas for `SessionStart` and `UserPromptSubmit` stdin/output shapes:
   - https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/session-start.command.input.schema.json
   - https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/user-prompt-submit.command.input.schema.json
   - https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/user-prompt-submit.command.output.schema.json
3. Re-read hook command execution, discovery, and dispatcher source:
   - https://github.com/openai/codex/blob/main/codex-rs/hooks/src/engine/command_runner.rs
   - https://github.com/openai/codex/blob/main/codex-rs/hooks/src/engine/discovery.rs
   - https://github.com/openai/codex/blob/main/codex-rs/hooks/src/engine/dispatcher.rs
4. Re-read hook runtime source for where hook-provided additional context is recorded into model-visible conversation items: https://github.com/openai/codex/blob/main/codex-rs/core/src/hook_runtime.rs
5. Ran an isolated local probe with `CODEX_HOME=/tmp/codex-hook-contract-probe-home`, `--enable codex_hooks`, and temporary `SessionStart`/`UserPromptSubmit` command hooks. The model call failed due restricted network, but both hooks completed before the API connection attempt; probe output confirmed stdin JSON, stdout context injection into the transcript, and inherited env vars. Local runtime source: `codex --version` reported `codex-cli 0.122.0`.
6. Re-checked the real local hook registration and Superset notification hook without modifying either:
   - `/Users/michelkerkmeester/.codex/hooks.json`
   - `/Users/michelkerkmeester/.superset/hooks/notify.sh`

## Findings
- Q1: `SessionStart` receives one JSON object on stdin, not argv/plain text/empty input. The schema requires `cwd`, `hook_event_name`, `model`, `permission_mode`, `session_id`, `source`, and `transcript_path`; the isolated 0.122.0 probe observed exactly those fields for startup. Primary source: https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/session-start.command.input.schema.json
- Q1: `UserPromptSubmit` receives one JSON object on stdin with the user prompt in the `prompt` field. The schema requires `cwd`, `hook_event_name`, `model`, `permission_mode`, `prompt`, `session_id`, `transcript_path`, and `turn_id`; the probe observed those fields with `prompt:"Reply with only: ok"`. Primary source: https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/user-prompt-submit.command.input.schema.json
- Q1/Q8: Source confirms Codex writes the serialized input JSON to child stdin and sets `current_dir`, `stdin`, `stdout`, `stderr`, and `kill_on_drop`; it does not call `env_clear` or construct a sanitized env in the hook runner. Combined with the probe, this supports inherited parent env with Codex path augmentation rather than a sanitized subset. Primary source: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/engine/command_runner.rs
- Q2: Plain stdout from `SessionStart` and `UserPromptSubmit` is model-visible extra developer context, not just notification/logging. The docs explicitly say plain stdout is added as extra developer context for both events; the probe transcript showed hook stdout recorded as `role:"developer"` items. Primary source: https://developers.openai.com/codex/hooks
- Q2: Placement is event-dependent in 0.122.0. `SessionStart` additional context is recorded before the user prompt is recorded; `UserPromptSubmit` additional context is recorded after the user message is recorded, as an additional model-visible context item. Source shows `SessionStart` calls `.record_additional_contexts(...)` immediately after the hook outcome, while `UserPromptSubmit` stores `additional_contexts` in `PendingInputRecord::UserMessage` and `record_pending_input` records the user prompt before `record_additional_contexts`. Primary source: https://github.com/openai/codex/blob/main/codex-rs/core/src/hook_runtime.rs
- Q3/Q7: `UserPromptSubmit` can decline/block but not transform the prompt. Docs support JSON `{"decision":"block","reason":"..."}` and exit code `2` with a blocking reason on stderr; the generated output schema contains `decision`, `reason`, and `hookSpecificOutput.additionalContext`, but no `updatedInput`/prompt replacement field. Primary sources: https://developers.openai.com/codex/hooks and https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/user-prompt-submit.command.output.schema.json
- Q4: Hook timeout is per command, in seconds; `timeoutSec` is an alias; omitted timeout defaults to 600 seconds. Source confirms `timeout_sec.unwrap_or(600).max(1)`, and command execution returns an error string on timeout. Primary sources: https://developers.openai.com/codex/hooks and https://github.com/openai/codex/blob/main/codex-rs/hooks/src/engine/discovery.rs
- Q5/Q6: Multiple matching hooks from all discovered `hooks.json` files run; multiple matching command hooks for the same event launch concurrently. Current official event taxonomy is `SessionStart`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `UserPromptSubmit`, and `Stop`; the generated hook-event enum matches that list. Primary sources: https://developers.openai.com/codex/hooks and https://github.com/openai/codex/blob/main/codex-rs/hooks/src/engine/dispatcher.rs
- Q8: Empirical 0.122.0 probe observed inherited `HOME`, `PATH`, `OPENAI_API_KEY`, and a custom `CODEX_PROBE_CUSTOM_ENV` inside both `SessionStart` and `UserPromptSubmit` hook processes. `PATH` was not sanitized; Codex prepended temporary arg0 directories before the parent path. Source-level relevance: the hook runner builds a `tokio::process::Command` without clearing or overriding env. Primary source: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/engine/command_runner.rs

## Questions Answered
- Q1: Answered. Both `SessionStart` and `UserPromptSubmit` command hooks receive a single JSON object on stdin. `SessionStart` includes `source`; `UserPromptSubmit` includes `turn_id` and `prompt`.
- Q2: Answered. Plain stdout and JSON `hookSpecificOutput.additionalContext` are injected into model-visible extra developer context. In 0.122.0 transcript ordering, `SessionStart` context appears before the user prompt, while `UserPromptSubmit` context is recorded after the user prompt as an additional developer-context item.
- Q3: Answered. Exit `0` is normal completion. Exit `2` is a hook-specific blocking/continuation signal where supported. Other non-zero exits fail the hook run rather than becoming normal prompt text.
- Q4: Answered. Default timeout is 600 seconds, minimum effective timeout is 1 second, and timeout is reported as a hook error.
- Q5: Answered. Matching command hooks execute concurrently; aggregation preserves handler/result association but one hook cannot prevent another matching hook from starting.
- Q6: Answered. Current taxonomy is `SessionStart`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `UserPromptSubmit`, and `Stop`.
- Q7: Answered. `UserPromptSubmit` can decline/block with a reason; no verified transform/rewrite field exists for the prompt.
- Q8: Answered for 0.122.0. Hooks inherit parent environment variables, with Codex path augmentation, not a documented sanitized subset.

## Questions Remaining
- None for the requested codex-cli 0.122.0 contract. Residual risk is version drift because official docs mark hooks experimental and under active development.

## Next Focus
No iteration 11 is needed; synthesize the final contract from iterations 1-10 and mark the deep-research loop converged.
