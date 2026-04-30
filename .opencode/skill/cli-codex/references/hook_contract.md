---
title: "Codex CLI Hook Contract"
description: "Codex CLI hook configuration, event payloads, stdout injection, exit semantics, and Spec Kit Memory parity wiring."
trigger_phrases:
  - "codex hooks"
  - "codex hook contract"
  - "codex startup context"
  - "codex advisor brief"
---

# Codex CLI Hook Contract

Codex CLI 0.122.0 supports native hooks behind the `codex_hooks` feature flag.
Spec Kit Memory uses the native `SessionStart` and `UserPromptSubmit` surfaces
to inject startup context and the compact skill-advisor brief.

## 1. Activation

Hooks are inert unless enabled:

```toml
[features]
codex_hooks = true
```

`codex --enable codex_hooks ...` is an equivalent process-local override. The
Superset `codex` wrapper already passes this flag, but `~/.codex/config.toml`
should still include it so direct Codex invocations behave the same way.

## 2. Registration

Codex reads hook entries from `~/.codex/hooks.json` using the Claude-style
outer array plus nested `hooks` array shape:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node /absolute/path/to/session-start.js",
            "timeout": 3
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node /absolute/path/to/user-prompt-submit.js",
            "timeout": 3
          }
        ]
      }
    ]
  }
}
```

When appending Spec Kit Memory hooks, preserve existing Superset `notify.sh`
entries. Multiple hooks for one event run concurrently, so hook commands must be
idempotent and must not rely on registration order.

## 3. Event Inputs

Hook commands receive JSON on stdin. Current generated schemas use snake_case
field names and reject unknown properties.

`SessionStart` required shape:

```json
{
  "session_id": "uuid",
  "transcript_path": null,
  "cwd": "/workspace",
  "hook_event_name": "SessionStart",
  "model": "gpt-5.5",
  "permission_mode": "default",
  "source": "startup"
}
```

`source` is `startup`, `resume`, or `clear`.

`UserPromptSubmit` adds turn-scoped prompt fields:

```json
{
  "session_id": "uuid",
  "turn_id": "uuid",
  "transcript_path": null,
  "cwd": "/workspace",
  "hook_event_name": "UserPromptSubmit",
  "model": "gpt-5.5",
  "permission_mode": "default",
  "prompt": "user prompt"
}
```

## 4. Event Outputs

Use JSON output for model-visible context:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Advisor: live; use sk-code 0.91/0.23 pass."
  }
}
```

For `SessionStart`, set `"hookEventName": "SessionStart"` and put startup
context in `additionalContext`.

Codex also accepts plain stdout for context on injecting events, but JSON is the
preferred Spec Kit path because it is explicit and testable. Context is recorded
as a developer-role message in the conversation state. For `SessionStart`, it is
placed before the first user prompt; for `UserPromptSubmit`, it is placed after
the submitted user message.

## 5. Exit and Timeout Semantics

| Condition | Behavior |
| --- | --- |
| Exit `0` | Success. Output is parsed and injected when `additionalContext` is present. |
| `UserPromptSubmit` exit `2` with stderr | Blocks the turn; stderr becomes the reason. |
| Other non-zero exits | Fail-open. Codex logs the hook failure and continues the turn. |
| Timeout | Fail-open. Default is 600 seconds unless `timeout` / `timeoutSec` is set. |

Spec Kit hooks use short per-hook timeouts in registration and return `{}` on
fail-open paths. The prompt hook emits a bounded stale advisory on cold-start
timeout so the user can see the advisor surface is installed.

## 6. Spec Kit Memory Wiring

Installed paths:

- `SessionStart`: `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/session-start.js`
- `UserPromptSubmit`: `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js`

Manual smoke checks:

```bash
printf '%s\n' '{"session_id":"s1","hook_event_name":"SessionStart","source":"startup","cwd":"'"$PWD"'","model":"gpt-5.5","permission_mode":"default"}' \
  | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/session-start.js
```

```bash
printf '%s\n' '{"prompt":"implement TypeScript hook","cwd":"'"$PWD"'"}' \
  | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js
```

Expected stdout is `{}` or a JSON object with
`hookSpecificOutput.additionalContext`; for matching work prompts it should be
non-empty and start with `Advisor:` on the prompt hook.

## 7. Sources

- OpenAI Codex source schema:
  `https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/schema.rs`
- OpenAI Codex issue evidence for five native events and `codex_hooks` flag:
  `https://github.com/openai/codex/issues/16226`
- OpenAI Codex issue evidence for `UserPromptSubmit.additionalContext` becoming
  model-visible developer context:
  `https://github.com/openai/codex/issues/16933`
- Packet-local synthesis:
  `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/005-codex-hook-parity-remediation/research/007-deep-review-remediation-pt-02/research.md`

## 8. OVERVIEW

_TODO: populate this section_

---

## 9. OVERVIEW

_TODO: populate this section_

---
