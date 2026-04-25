# Iteration 006 - Claude Compatibility Check and Convergence

## Focus

Test Claude Code compatibility of adding Copilot-safe top-level fields to a Claude-style hook wrapper. Iteration 005 proved that Copilot CLI 1.0.34 can ingest `.claude/settings.local.json` wrappers and execute a `UserPromptSubmit` wrapper object directly, causing the missing-shell failure unless the wrapper has top-level `bash` or `powershell`. The open question was whether adding top-level `type`, `bash`, and `timeoutSec` breaks Claude Code's own nested hook execution.

## Actions Taken

1. Re-read iteration 005, the strategy, state JSONL, delta format, active `.github/hooks/superset-notify.json`, and active `.claude/settings.local.json`.
2. Consulted the current official Claude Code hooks reference for the supported Claude hook nesting model.
3. Built an isolated Claude Code repro under `/tmp/claude-hook-compat-iter006-1776869539/` with a `UserPromptSubmit` wrapper containing:
   - Copilot-only top-level fields: `type`, `bash`, and `timeoutSec`.
   - The normal Claude nested `hooks[0].command` and `timeout` fields.
4. Ran Claude Code 2.1.117 non-interactively with:
   - isolated `HOME`
   - `--settings /tmp/claude-hook-compat-iter006-1776869539/settings-patched.json`
   - `--debug hooks`
   - `--debug-file /tmp/claude-hook-compat-iter006-1776869539/logs/claude-debug.log`
   - `--include-hook-events --output-format=stream-json`
   - intentionally unreachable `ANTHROPIC_BASE_URL=http://127.0.0.1:9`
5. Confirmed that the nested Claude hook executed successfully before the expected API connection failure, while the top-level `bash` marker was not created.

## Findings

### F32 - Official Claude Code hook docs use matcher wrappers with nested hook handlers

The current Claude Code hooks reference defines hooks in JSON settings files with three levels: hook event, matcher group, and hook handler. Its examples place executable command handlers inside the matcher group's inner `hooks` array. Source: `https://code.claude.com/docs/en/hooks` lines 284-293 and 392-421.

The same reference states that `UserPromptSubmit` has no matcher support and always fires on every occurrence, while handler command hooks require `command` and use `timeout` in seconds. Source: `https://code.claude.com/docs/en/hooks` lines 333-350 and 413-421.

This matches the active project Claude shape: `.claude/settings.local.json:24-34` has `hooks.UserPromptSubmit[0].hooks[0].command` and `timeout`, with no top-level `bash` or `powershell`.

### F33 - Claude Code 2.1.117 accepts top-level Copilot-only fields on a `UserPromptSubmit` wrapper

The isolated settings file added `type`, `bash`, and `timeoutSec` to the matcher wrapper while preserving the nested Claude command. Source: `/tmp/claude-hook-compat-iter006-1776869539/settings-patched.json:3-15`.

Claude Code 2.1.117 accepted this settings file and emitted a `hook_started` event followed by a successful `hook_response` for `UserPromptSubmit`. Source: shell-command timestamp `2026-04-22T14:52Z`, command `HOME=/tmp/claude-hook-compat-iter006-1776869539/home ANTHROPIC_API_KEY=dummy ANTHROPIC_BASE_URL=http://127.0.0.1:9 claude -p 'iteration 006 hook compatibility smoke' --settings /tmp/claude-hook-compat-iter006-1776869539/settings-patched.json --debug hooks --debug-file /tmp/claude-hook-compat-iter006-1776869539/logs/claude-debug.log --include-hook-events --output-format=stream-json --dangerously-skip-permissions --max-budget-usd 0.01 --verbose`.

The persisted Claude transcript records a `hook_success` attachment for `UserPromptSubmit` with the nested command string, `exitCode: 0`, and `durationMs: 9`. Source: `/tmp/claude-hook-compat-iter006-1776869539/home/.claude/projects/-private-tmp-claude-hook-compat-iter006-1776869539-repo/ab8cd5fc-dac5-47c4-8cb1-6b9aeca85381.jsonl:7`.

The debug log also records `Hook UserPromptSubmit (UserPromptSubmit) success` with the nested hook context. Source: `/tmp/claude-hook-compat-iter006-1776869539/logs/claude-debug.log:131-132`.

### F34 - Claude ignored the top-level Copilot `bash` field and executed only the nested Claude command

The nested command wrote `/tmp/claude-hook-compat-iter006-1776869539/nested-command.log`; that marker exists and contains `NESTED_CLAUDE_COMMAND_EXECUTED`. Source: `/tmp/claude-hook-compat-iter006-1776869539/nested-command.log:1`.

The top-level `bash` command would have written `/tmp/claude-hook-compat-iter006-1776869539/top-level-bash.log`, but that file was missing after the run. Source: shell-command timestamp `2026-04-22T14:56Z`, command `for f in nested-command.log top-level-bash.log claude-debug.log; do ...; done` printed `FILE /tmp/claude-hook-compat-iter006-1776869539/top-level-bash.log` followed by `MISSING`.

This is the desired cross-runtime behavior: Copilot can execute the top-level `bash` no-op (proved in iteration 005), while Claude Code continues to execute the nested `command` handler and ignores the Copilot-only top-level fields.

### F35 - The corrected `.github/hooks/superset-notify.json` patch remains the flat Copilot `bash` shape

The active project hook file already uses `version: 1`, canonical event keys, and flat command objects with `type: "command"`, `bash`, and `timeoutSec`. Source: `.github/hooks/superset-notify.json:1-33`.

Iteration 005 proved that this shape logs successful Copilot execution in the combined repro, then proved the missing-shell failure comes from the additional Claude wrapper when it lacks top-level `bash`. Source: `/tmp/copilot-hook-repro-iter005c-1776868850/broken/logs/process-1776868851140-10267.log:26` and `/tmp/copilot-hook-repro-iter005c-1776868850/broken/logs/process-1776868851140-10267.log:29`.

Therefore the `.github/hooks/superset-notify.json` patch is still:

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [
      {
        "type": "command",
        "bash": "/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh sessionStart",
        "timeoutSec": 5
      }
    ],
    "sessionEnd": [
      {
        "type": "command",
        "bash": "/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh sessionEnd",
        "timeoutSec": 5
      }
    ],
    "userPromptSubmitted": [
      {
        "type": "command",
        "bash": "/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh userPromptSubmitted",
        "timeoutSec": 5
      }
    ],
    "postToolUse": [
      {
        "type": "command",
        "bash": "/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh postToolUse",
        "timeoutSec": 5
      }
    ]
  }
}
```

### F36 - The implementation-safe additional patch is to make the Claude wrapper Copilot-safe

The minimal additional patch for the active collision is to add top-level `type`, `bash`, and `timeoutSec` to the Claude `UserPromptSubmit` wrapper while preserving the nested Claude command:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "type": "command",
        "bash": "true",
        "timeoutSec": 3,
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js'",
            "timeout": 3
          }
        ]
      }
    ]
  }
}
```

Iteration 005 showed Copilot executes the top-level command and stops throwing. Iteration 006 shows Claude Code still executes the nested command and does not execute the top-level `bash` field. Sources: `/tmp/copilot-hook-repro-iter005c-1776868850/mitigated/logs/process-1776868939747-14186.log:29`, `/tmp/copilot-hook-repro-iter005c-1776868850/mitigated/logs/process-1776868939747-14186.log:31`, `/tmp/claude-hook-compat-iter006-1776869539/home/.claude/projects/-private-tmp-claude-hook-compat-iter006-1776869539-repo/ab8cd5fc-dac5-47c4-8cb1-6b9aeca85381.jsonl:7`, and shell-command timestamp `2026-04-22T14:56Z` showing the top-level `bash` marker missing.

## Questions Answered

### KQ-1 / KQ-3: Current accepted schema

Answered for Copilot file hooks by iterations 003-005 and reinforced here for the cross-runtime collision. Copilot file hooks use flat `bash` or `powershell` command objects. Claude Code settings use nested matcher wrappers whose executable command is in the inner `hooks` array as `command`.

### KQ-2: Why `sessionStart` succeeds while `userPromptSubmitted` fails

Answered. `sessionStart` filters differently, while `userPromptSubmitted` executes the Claude wrapper object after alias normalization. The failure is not the visible `.github/hooks` flat `bash` entry; it is the raw Claude wrapper reaching Copilot's executor without top-level `bash` or `powershell`.

### KQ-4: Which config paths are read

Answered. Copilot reads `.github/hooks/*.json` and also merges repo settings hooks including `.claude/settings.local.json`. Claude Code reads `.claude/settings.local.json` as a local project settings source. Sources: prior Copilot source trace in iteration 004 and `https://code.claude.com/docs/en/hooks` lines 296-306.

### KQ-7: Corrected patch

Answered. Keep `.github/hooks/superset-notify.json` in the flat Copilot `bash` shape and add a top-level no-op Copilot command to the Claude `UserPromptSubmit` wrapper. The latter is now empirically compatible with Claude Code 2.1.117.

### KQ-10: End-to-end real project refresh timestamp

Not run in this research-only iteration because the directive explicitly forbade mutating `.github/hooks/superset-notify.json` or hook scripts, and the active fix requires editing `.claude/settings.local.json`. The remaining validation belongs to the follow-on implementation packet: apply the wrapper patch, run a real project Copilot prompt, and check that `$HOME/.copilot/copilot-instructions.md` `Refreshed:` advances.

## Ruled Out

- **R7 - Claude rejects wrapper objects with top-level Copilot-only fields.** The isolated Claude Code 2.1.117 smoke accepted the settings file, emitted successful hook events, wrote the nested marker, and persisted a `hook_success` attachment. Sources: `/tmp/claude-hook-compat-iter006-1776869539/settings-patched.json:3-15`, `/tmp/claude-hook-compat-iter006-1776869539/nested-command.log:1`, and `/tmp/claude-hook-compat-iter006-1776869539/home/.claude/projects/-private-tmp-claude-hook-compat-iter006-1776869539-repo/ab8cd5fc-dac5-47c4-8cb1-6b9aeca85381.jsonl:7`.
- **R8 - Claude executes the top-level Copilot `bash` field as an extra hook.** The top-level marker file was missing after the run, while the nested marker existed. Source: shell-command timestamp `2026-04-22T14:56Z`, marker inspection command.

## Convergence

### Convergence signal met

Research-only convergence is met. The loop now has:

1. A primary-source-backed schema explanation for both sides of the collision.
2. A concrete `.github/hooks/superset-notify.json` patch shape.
3. An empirical Copilot repro where the flat hook executes successfully and the unsafe Claude wrapper reproduces the missing-shell failure.
4. An empirical Copilot wrapper mitigation where the failure disappears.
5. An empirical Claude Code compatibility repro showing the same wrapper mitigation preserves Claude's nested command execution.

The only remaining work is implementation and a real-project smoke after editing `.claude/settings.local.json`, which is outside this research-only iteration.

## Next Focus

Hand off to implementation: patch `.claude/settings.local.json` `UserPromptSubmit[0]` with top-level `type: "command"`, `bash: "true"`, and `timeoutSec: 3`; leave the nested Claude `hooks[0].command` unchanged; then run a real Copilot prompt smoke and verify both Copilot hook logs and the `Refreshed:` timestamp.
