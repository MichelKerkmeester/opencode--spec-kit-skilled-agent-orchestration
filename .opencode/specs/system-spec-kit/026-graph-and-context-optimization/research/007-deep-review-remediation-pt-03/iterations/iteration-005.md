# Iteration 005 - Claude Wrapper Collision Reproducer and Mitigation

## Focus

Build the isolated reproducer requested by iteration 004: a temp repo with both a valid `.github/hooks/superset-notify.json` flat `bash` hook and a Claude-style `.claude/settings.local.json` `UserPromptSubmit` wrapper. Then test the smallest mitigation that keeps the `.github/hooks` flat hook enabled while making the Claude wrapper safe when Copilot 1.0.34 treats the wrapper itself as an executable command object.

## Actions Taken

1. Re-read iteration 003, iteration 004, the strategy, findings registry, state JSONL, active project hook files, and the generated iteration 005 prompt.
2. Confirmed the active project `.github/hooks/superset-notify.json` still uses flat `type: "command"` plus `bash` entries for `sessionStart`, `sessionEnd`, `userPromptSubmitted`, and `postToolUse`.
3. Confirmed the active `.claude/settings.local.json` still uses Claude-style nested wrappers: `hooks.UserPromptSubmit[0].hooks[0].command`.
4. Built an isolated two-case repro under `/tmp/copilot-hook-repro-iter005c-1776868850/` using the Copilot 1.0.34 shipped JS entrypoint directly:
   - `broken`: valid `.github/hooks/superset-notify.json` plus a Claude `UserPromptSubmit` wrapper with no top-level `bash` or `powershell`.
   - `mitigated`: the same valid `.github/hooks/superset-notify.json` plus the same nested Claude wrapper, augmented with top-level Copilot-safe `type: "command"`, `bash`, and `timeoutSec`.
5. Ran both cases with `--allow-all`, isolated `COPILOT_HOME`, isolated `COPILOT_CACHE_HOME`, isolated `--log-dir`, and a deliberately unreachable BYOK provider (`http://127.0.0.1:9/v1`) so hook execution happens before the expected provider failure.

## Findings

### F28 - The combined repro reproduces the exact missing-shell failure while the flat `.github/hooks` entry still executes

The `broken` repro had a valid `.github/hooks/superset-notify.json` flat `bash` entry and a Claude-style wrapper at `.claude/settings.local.json:1` with only a nested `hooks` array. The run started at `2026-04-22T14:40:50Z` and ended at `2026-04-22T14:42:18Z`. Source: `/tmp/copilot-hook-repro-iter005c-1776868850/summary.txt:1`.

Copilot logged successful execution of the flat `.github/hooks` `userPromptSubmitted` command first, then immediately logged the target error:

- `/tmp/copilot-hook-repro-iter005c-1776868850/broken/logs/process-1776868851140-10267.log:26` — `Executing hook` for `broken github userPromptSubmitted`.
- `/tmp/copilot-hook-repro-iter005c-1776868850/broken/logs/process-1776868851140-10267.log:28` — `Spawned hook command`.
- `/tmp/copilot-hook-repro-iter005c-1776868850/broken/logs/process-1776868851140-10267.log:29` — `Hook execution failed: Error: Neither 'bash' nor 'powershell' specified in hook command configuration`.
- `/tmp/copilot-hook-repro-iter005c-1776868850/broken/hook-marker.log:1` — marker written by the flat `.github/hooks` `userPromptSubmitted` command.

This decisively separates two facts: the flat `.github/hooks` schema is executable, and the failure comes from the additional Claude wrapper object that Copilot also merged into `userPromptSubmitted`.

### F29 - Adding a top-level Copilot-safe no-op command to the Claude wrapper neutralizes the failure

The `mitigated` repro kept the nested Claude wrapper shape but added top-level `type: "command"`, `bash`, and `timeoutSec` to the wrapper object. Source: `/tmp/copilot-hook-repro-iter005c-1776868850/mitigated/repo/.claude/settings.local.json:1`.

The run started at `2026-04-22T14:42:18Z` and ended at `2026-04-22T14:43:49Z`. Source: `/tmp/copilot-hook-repro-iter005c-1776868850/summary.txt:2`.

Copilot logged successful execution of both the valid `.github/hooks` command and the Copilot-safe wrapper command:

- `/tmp/copilot-hook-repro-iter005c-1776868850/mitigated/logs/process-1776868939747-14186.log:26` — `Executing hook` for `mitigated github userPromptSubmitted`.
- `/tmp/copilot-hook-repro-iter005c-1776868850/mitigated/logs/process-1776868939747-14186.log:28` — `Spawned hook command`.
- `/tmp/copilot-hook-repro-iter005c-1776868850/mitigated/logs/process-1776868939747-14186.log:29` — `Executing hook` for `mitigated copilot-safe claude-wrapper-noop`.
- `/tmp/copilot-hook-repro-iter005c-1776868850/mitigated/logs/process-1776868939747-14186.log:31` — `Spawned hook command`.
- `/tmp/copilot-hook-repro-iter005c-1776868850/mitigated/hook-marker.log:1` — marker written by the `.github/hooks` command.
- `/tmp/copilot-hook-repro-iter005c-1776868850/mitigated/hook-marker.log:2` — marker written by the Copilot-safe wrapper command.

A targeted search found no `Neither 'bash' nor 'powershell'` or `Hook execution failed` line in the mitigated log. Source: shell command timestamp `2026-04-22T14:44Z`, command `rg -n "Neither 'bash' nor 'powershell'|Hook execution failed" /tmp/copilot-hook-repro-iter005c-1776868850/mitigated/logs/process-*.log || true`, exit 0 with no output.

### F30 - Non-interactive repros need `--allow-all` before prompt/session hooks execute

Direct `node app.js -p ...` repro attempts without `--allow-all` started Copilot 1.0.34 but did not log project hook execution, even with `.github/hooks/*.json` present. Adding `--allow-all` produced `Executing hook` and `Spawned hook command` log lines in a one-hook probe. Source: `/tmp/copilot-app-direct-probe-allow-1776868746/logs/process-1776868747513-5736.log:26`, `/tmp/copilot-app-direct-probe-allow-1776868746/logs/process-1776868747513-5736.log:27`, and `/tmp/copilot-app-direct-probe-allow-1776868746/marker.log:1`.

This is a harness requirement, not a schema change: the same `.github/hooks` schema executed once the non-interactive run allowed tool/hook execution.

### F31 - The corrected `.github/hooks/superset-notify.json` patch remains unchanged

The iteration 003 patch remains the correct Copilot file-hook schema: `version: 1`, canonical event keys, and flat command entries with top-level `type: "command"`, `bash`, and `timeoutSec`. The mitigated repro used that same shape and Copilot logged successful execution. Source: `/tmp/copilot-hook-repro-iter005c-1776868850/mitigated/repo/.github/hooks/superset-notify.json:1`, `/tmp/copilot-hook-repro-iter005c-1776868850/mitigated/logs/process-1776868939747-14186.log:26`, and `/tmp/copilot-hook-repro-iter005c-1776868850/mitigated/logs/process-1776868939747-14186.log:31`.

The additional fix needed for the real project is not another `.github/hooks/superset-notify.json` rewrite. It is to make the repo-settings Claude wrapper Copilot-safe, or otherwise prevent Copilot from ingesting that wrapper.

## Concrete Patch Guidance

### `.github/hooks/superset-notify.json`

No new patch is required beyond the flat `bash` shape already identified in iteration 003 and currently present in the project:

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

### Additional repo-settings mitigation

For the active Claude wrapper collision, the empirically confirmed minimal mitigation is to add a top-level Copilot-safe command to each Claude wrapper object that Copilot may execute directly. The nested Claude `hooks` array can remain in place:

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

The test used a marker-writing `bash` command instead of `true` to prove Copilot executed the top-level command. In the real file, `true` is sufficient if the goal is only to neutralize Copilot while preserving the nested Claude command for Claude Code.

## Questions Answered

### KQ-2: Why does `sessionStart` succeed while `userPromptSubmitted` fails?

Now empirically confirmed. The broken repro logged the flat `.github/hooks` `userPromptSubmitted` command successfully, then logged the missing-shell failure from the additional Claude wrapper object. This matches iteration 004's source trace: `userPromptSubmitted` maps every entry through `g2()` while `sessionStart` filters entries by `type === "command"` before wrapping. Source: `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js:1201:3732`, `:1201:3784`, and `:1201:4358`; empirical log sources: `/tmp/copilot-hook-repro-iter005c-1776868850/broken/logs/process-1776868851140-10267.log:26` and `/tmp/copilot-hook-repro-iter005c-1776868850/broken/logs/process-1776868851140-10267.log:29`.

### KQ-4: Which config-file path is Copilot CLI 1.0.34 actually reading?

Still answered by iteration 004 and empirically reinforced here: Copilot merges `.github/hooks/*.json` with repo settings hooks from `.claude/settings.local.json`. The combined repro needed both files to reproduce the exact collision. Source: `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js:4998:10626` and `:4998:10727`; repro files: `/tmp/copilot-hook-repro-iter005c-1776868850/broken/repo/.github/hooks/superset-notify.json:1` and `/tmp/copilot-hook-repro-iter005c-1776868850/broken/repo/.claude/settings.local.json:1`.

### KQ-7: What is the corrected JSON patch for `.github/hooks/superset-notify.json`?

Answered and unchanged. The flat `bash` patch is correct and executable. The original blocker requires an additional `.claude/settings.local.json` mitigation because the rejected runtime object is not the `.github/hooks` entry.

## Ruled Out

- **R5 - Offline mode as a reproducer path.** `COPILOT_OFFLINE=true` skips the project hook path in this harness, so it cannot validate the hook collision. Source: `/tmp/copilot-hook-repro-iter005-1776868231/broken/logs/process-1776868232393-81309.log:1` and absence of `Executing hook` lines in that offline run.
- **R6 - Rewriting `.github/hooks/superset-notify.json` alone as the complete remediation.** The broken repro proves the flat `.github/hooks` command can execute and the missing-shell failure can still occur immediately afterward from the Claude wrapper. Source: `/tmp/copilot-hook-repro-iter005c-1776868850/broken/logs/process-1776868851140-10267.log:26` and `/tmp/copilot-hook-repro-iter005c-1776868850/broken/logs/process-1776868851140-10267.log:29`.

## Convergence

Not converged. Iteration 005 resolves the biggest empirical gap left by iteration 004: the combined repro now confirms the root-cause collision and a minimal wrapper mitigation. Remaining work is narrower:

1. Validate that adding top-level `bash: "true"` to the active `.claude/settings.local.json` remains acceptable to Claude Code itself.
2. Apply the mitigation in a follow-on implementation packet.
3. Run a real project Copilot smoke where `$HOME/.copilot/copilot-instructions.md` `Refreshed:` advances after a prompt.

## Next Focus

Test Claude Code compatibility of the top-level no-op fields on the wrapper object. If Claude ignores the extra `type`, `bash`, and `timeoutSec` fields while still executing nested `hooks[0].command`, the implementation path is straightforward. If Claude rejects unknown fields, the fallback is to move/condition the Claude hook config so Copilot does not ingest a raw nested wrapper.
