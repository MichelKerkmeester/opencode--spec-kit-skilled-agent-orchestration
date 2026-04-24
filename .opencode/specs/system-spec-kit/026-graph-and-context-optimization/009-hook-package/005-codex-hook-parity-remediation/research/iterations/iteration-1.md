# Iteration 1: stdin payloads and context injection
## Focus
This pass focused on Q1 and Q2: the command-hook stdin payload for `SessionStart` and `UserPromptSubmit`, and whether hook stdout becomes model-visible context. I also captured directly adjacent contract facts from the same primary docs where they reduce uncertainty for later iterations.
## Actions Taken
1. Opened the official Codex hooks documentation and extracted the documented runtime, config, input, output, timeout, event, and blocker semantics: https://developers.openai.com/codex/hooks
2. Opened the generated upstream hook schemas for `SessionStart` and `UserPromptSubmit` command inputs and `UserPromptSubmit` command output: https://github.com/openai/codex/tree/main/codex-rs/hooks/schema/generated
3. Opened the raw generated schemas for exact JSON field requirements: https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/session-start.command.input.schema.json, https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/user-prompt-submit.command.input.schema.json, https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/user-prompt-submit.command.output.schema.json
4. Checked the upstream `hook_runtime.rs` path that runs `UserPromptSubmit` hooks and records additional contexts after accepting the user prompt: https://github.com/openai/codex/blob/main/codex-rs/core/src/hook_runtime.rs
5. Verified local runtime and installed hook configuration without modifying it: `codex-cli 0.122.0`; `~/.codex/hooks.json` registers only `/Users/michelkerkmeester/.superset/hooks/notify.sh` for `SessionStart`, `UserPromptSubmit`, and `Stop`; `notify.sh` accepts stdin but also tolerates argv input.
## Findings
- Q1: Codex command hooks receive a single JSON object on stdin, not plain text or empty stdin. The official docs state this for every command hook, and the generated schemas define object payloads. Source: https://developers.openai.com/codex/hooks and https://github.com/openai/codex/tree/main/codex-rs/hooks/schema/generated
- Q1: `SessionStart` stdin requires `cwd`, `hook_event_name`, `model`, `permission_mode`, `session_id`, `source`, and `transcript_path`. Its `source` enum is `startup`, `resume`, or `clear` in the generated schema. Source: https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/session-start.command.input.schema.json
- Q1: `UserPromptSubmit` stdin requires `cwd`, `hook_event_name`, `model`, `permission_mode`, `prompt`, `session_id`, `transcript_path`, and `turn_id`. Source: https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/user-prompt-submit.command.input.schema.json
- Q2: For `SessionStart`, plain stdout is added as extra developer context; JSON stdout can also supply `hookSpecificOutput.additionalContext`, which is likewise added as extra developer context. Source: https://developers.openai.com/codex/hooks
- Q2: For `UserPromptSubmit`, plain stdout is added as extra developer context; JSON stdout supports `hookSpecificOutput.additionalContext`, also added as extra developer context. Source: https://developers.openai.com/codex/hooks and https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/user-prompt-submit.command.output.schema.json
- Q2: Upstream runtime code for `UserPromptSubmit` records the user prompt first, then records hook additional contexts; the context conversion keeps multiple context items separate and ordered as developer-role messages in the code test. This answers "injected vs notification" as injected, and suggests append-after-prompt ordering for accepted prompts, though this still deserves tag-specific verification for 0.122.0. Source: https://github.com/openai/codex/blob/main/codex-rs/core/src/hook_runtime.rs
- Q4: Hook config accepts `timeout` in seconds and `timeoutSec` as an alias; omitted timeout defaults to 600 seconds. Timeout kill/skip behavior still needs code-level confirmation. Source: https://developers.openai.com/codex/hooks
- Q5: Multiple matching command hooks for the same event are launched concurrently, so registration order is not a serial ordering guarantee. Source: https://developers.openai.com/codex/hooks
- Q6: The documented event taxonomy is `SessionStart`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `UserPromptSubmit`, and `Stop`; generated schemas exist for those six events. Source: https://developers.openai.com/codex/hooks and https://github.com/openai/codex/tree/main/codex-rs/hooks/schema/generated
- Q7: `UserPromptSubmit` can block a prompt with JSON stdout `{ "decision": "block", "reason": "..." }` or with exit code 2 plus stderr reason. The docs do not document prompt transformation for this event. Source: https://developers.openai.com/codex/hooks and https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/user-prompt-submit.command.output.schema.json
## Questions Answered
- Q1 advanced strongly: official docs and generated schemas establish JSON-object stdin for `SessionStart` and `UserPromptSubmit`, including required fields.
- Q2 advanced strongly: stdout is model-context injection for `SessionStart` and `UserPromptSubmit`, not merely notification. Current source suggests `UserPromptSubmit` additional contexts are recorded after the accepted user prompt and preserved in hook-output order.
- Q4 advanced partially: timeout unit, alias, and default are documented; timeout failure behavior remains open.
- Q5 advanced strongly: multiple same-event command hooks launch concurrently, so there is no serial registration-order execution contract.
- Q6 advanced strongly: six events are documented and schema-backed in current upstream docs.
- Q7 advanced strongly for the decline/block pattern: block is supported; transform remains undocumented and needs source confirmation as unsupported.
## Questions Remaining
- Q2: Confirm exact placement against the 0.122.0 tag or installed binary, not only current upstream `main`.
- Q3: General exit-code semantics beyond `0` success and `2` blocker/continuation are not fully mapped.
- Q4: Timeout behavior on expiry, including process kill, status, and whether the turn proceeds, remains open.
- Q6: Confirm whether 0.122.0 exposes exactly the six documented events or whether any internal event exists without config discovery.
- Q7: Confirm source-level handling for prompt transformation fields such as updated input, if any.
- Q8: Environment propagation remains unanswered.
## Next Focus
Iteration 2 should inspect the 0.122.0 source/tag or installed package internals for command execution, exit-code parsing, timeout handling, and environment propagation.
