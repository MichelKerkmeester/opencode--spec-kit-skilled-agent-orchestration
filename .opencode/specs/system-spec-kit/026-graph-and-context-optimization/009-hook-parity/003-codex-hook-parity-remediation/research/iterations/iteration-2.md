# Iteration 2: 0.122.0 hook execution probes
## Focus
This pass moved from the already-answered Q1/Q2 doc surface into exact Codex CLI 0.122.0 behavior. I used the official hooks docs plus an isolated temporary `HOME` probe to verify stdin payloads, context placement, exit-code behavior, timeout behavior, and environment inheritance without modifying `~/.codex/hooks.json`.
## Actions Taken
1. Re-read the official Codex hooks documentation for config discovery, feature flag, stdin, stdout, exit code, timeout, event taxonomy, and ordering semantics: https://developers.openai.com/codex/hooks
2. Confirmed the installed binary is `codex-cli 0.122.0` at `/opt/homebrew/Caskroom/codex/0.122.0/codex-aarch64-apple-darwin` using local CLI output.
3. Confirmed `~/.codex/hooks.json` still registers only `/Users/michelkerkmeester/.superset/hooks/notify.sh` for `SessionStart`, `UserPromptSubmit`, and `Stop`, then left it untouched.
4. Located the exact release archive candidate for 0.122.0 as `rust-v0.122.0`; shell fetch was blocked by network policy, but the release/source archive identity is corroborated by the archive listing and original GitHub tag URL: https://github.com/openai/codex/archive/refs/tags/rust-v0.122.0.tar.gz
5. Created temporary probe config only under `/tmp/codex-probe-home/.codex` with `[features] codex_hooks = true` and temporary hook scripts under `/tmp/codex-hook-probe`; ran `codex exec` with fake `HOME` to avoid modifying real `~/.codex/hooks.json`.
6. Captured empirical 0.122.0 transcripts and hook logs from `/tmp/codex-hook-probe/observed.log` and `/tmp/codex-probe-home/.codex/sessions/2026/04/22/*.jsonl`.
## Findings
- Q1: Codex 0.122.0 did not run hooks from the temporary home until `[features] codex_hooks = true` was present, matching the official docs that hooks are behind the `codex_hooks` feature flag. Source: https://developers.openai.com/codex/hooks
- Q1: `SessionStart` stdin in the 0.122.0 probe was a JSON object with `session_id`, `transcript_path`, `cwd`, `hook_event_name`, `model`, `permission_mode`, and `source`. This matches the official "Every command hook receives one JSON object on stdin" contract and the documented SessionStart fields. Sources: https://developers.openai.com/codex/hooks and `/tmp/codex-hook-probe/observed.log`
- Q1: `UserPromptSubmit` stdin in the 0.122.0 probe was a JSON object with `session_id`, `turn_id`, `transcript_path`, `cwd`, `hook_event_name`, `model`, `permission_mode`, and `prompt`. This matches the documented common fields plus `turn_id` and `prompt`. Sources: https://developers.openai.com/codex/hooks and `/tmp/codex-hook-probe/observed.log`
- Q2: `SessionStart` plain stdout is model-visible developer context, not just a notification. The probe emitted `PROBE_SESSION_CONTEXT_VISIBLE`, and the transcript recorded it as a `response_item` with role `developer` before the user prompt. Sources: https://developers.openai.com/codex/hooks and `/tmp/codex-probe-home/.codex/sessions/2026/04/22/rollout-2026-04-22T09-40-19-019db421-fdfe-7490-ba32-9017a448e87b.jsonl`
- Q2: `UserPromptSubmit` JSON `hookSpecificOutput.additionalContext` is also model-visible developer context. In the non-blocking probe, the transcript order was user message first, then a `developer` response item containing `PROBE_JSON_CONTEXT_VISIBLE`. Sources: https://developers.openai.com/codex/hooks and `/tmp/codex-probe-home/.codex/sessions/2026/04/22/rollout-2026-04-22T09-40-19-019db421-fdfe-7490-ba32-9017a448e87b.jsonl`
- Q3/Q7: `UserPromptSubmit` exit code `2` with stderr acts as a blocker/decline. The probe logged the hook input, Codex emitted `turn.completed` with zero model tokens, and the transcript never recorded the blocked prompt as a user response item before completion. Sources: https://developers.openai.com/codex/hooks and `/tmp/codex-probe-home/.codex/sessions/2026/04/22/rollout-2026-04-22T09-39-33-019db421-472e-7bd1-9af8-cb8e3c76e6d2.jsonl`
- Q3: Ordinary non-zero exit code `1` did not abort the turn in the 0.122.0 probe. Codex recorded the user message and proceeded to the model request; the later failure was only the sandbox's expected network/DNS failure. Source: `/tmp/codex-probe-home/.codex/sessions/2026/04/22/rollout-2026-04-22T09-43-57-019db425-510d-7e70-ab4b-38bbacb6fdad.jsonl`
- Q4: A `UserPromptSubmit` hook with `"timeout": 1` and a script that slept for five seconds did not abort the turn. Codex recorded the user message after approximately the timeout interval and proceeded to the model request; the hook's post-sleep stdout was not recorded. Sources: https://developers.openai.com/codex/hooks and `/tmp/codex-probe-home/.codex/sessions/2026/04/22/rollout-2026-04-22T09-42-22-019db423-dc42-7493-ac52-70de870bc778.jsonl`
- Q5: Official docs state multiple matching command hooks for the same event are launched concurrently, so hook registration order is not a serial execution guarantee. Source: https://developers.openai.com/codex/hooks
- Q6: Official docs list the exposed current hook events as `SessionStart`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `UserPromptSubmit`, and `Stop`; they also state which events honor matchers today. Source: https://developers.openai.com/codex/hooks
- Q7: The official `UserPromptSubmit` contract documents blocking via JSON `{"decision":"block","reason":"..."}` or exit code `2` plus stderr; this pass found no documented prompt-transform contract for `UserPromptSubmit`. Source: https://developers.openai.com/codex/hooks
- Q8: Hooks inherit the parent/session environment rather than a tight sanitized subset. The temporary probe saw the fake `HOME`, a long inherited `PATH` with Codex-injected temporary `arg0` prefixes, and custom `PROBE_CUSTOM_ENV=codex-env-probe`; `CODEX_HOME` was empty because it was not set. Source: `/tmp/codex-hook-probe/observed.log`
## Questions Answered
- Q1 advanced to empirical 0.122.0 confirmation: `SessionStart` and `UserPromptSubmit` receive JSON objects on stdin with the expected event-specific fields.
- Q2 advanced to exact ordering: `SessionStart` stdout is injected as developer context before the user prompt; `UserPromptSubmit.additionalContext` is injected as developer context after the user message.
- Q3 advanced materially: exit code `2` blocks/declines `UserPromptSubmit`, while exit code `1` did not abort in the probe.
- Q4 advanced materially: configured timeout is enforced as a skip/continue behavior for the probed `UserPromptSubmit` command, not as a turn abort.
- Q5 reaffirmed from official docs: same-event command hooks launch concurrently.
- Q6 reaffirmed from official docs: six documented events are exposed.
- Q7 advanced: blocking is supported; prompt transformation remains unsupported/undocumented in the observed contract.
- Q8 answered empirically: hooks inherit key parent env values plus Codex path augmentation.
## Questions Remaining
- Q3: Map all non-zero exit statuses across all events, especially `Stop`, `PreToolUse`, `PostToolUse`, and `PermissionRequest`.
- Q4: Confirm whether timeout emits UI/event-stream warnings in interactive TUI mode, since the non-interactive transcript did not show a clear timeout warning.
- Q6: Confirm from tagged source whether any internal event exists without docs/config discovery.
- Q7: Confirm from tagged source parser/schema that `updatedInput` or equivalent prompt transformation is rejected, ignored, or absent for `UserPromptSubmit`.
## Next Focus
Iteration 3 should inspect tagged source or generated schemas for non-`UserPromptSubmit` exit handling and prompt-transform fields, then reconcile event-specific fail-open/fail-closed behavior.
