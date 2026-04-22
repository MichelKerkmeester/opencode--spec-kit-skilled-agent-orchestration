# Iteration 004 - Repo Settings Hook Collision Root Cause

## Focus

Instrument the hook invocation path by source inspection rather than by editing the real hook config or hook scripts. The goal was to identify which post-parse hook source can add a callback that eventually calls `jer()` with an object that has neither `bash` nor `powershell`.

## Actions Taken

1. Re-read iteration 003, the active strategy, the findings registry, JSONL history, and the iteration 004 prompt.
2. Traced the Copilot CLI 1.0.34 hook merge path in `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js`.
3. Checked the active project hook and settings files without mutating them:
   - `.github/hooks/superset-notify.json`
   - `.claude/settings.local.json`
   - `.codex/settings.json`
   - `/Users/michelkerkmeester/.copilot/config.json`
4. Searched real Copilot logs for the failing executor message and inspected a representative current-session failure.
5. Ruled out the prior next-focus suspects `wireSessionStoreTracking` and ad-hoc SDK hooks as direct raw-command-object sources.

## Findings

### F21 - Copilot 1.0.34 reads `.claude/settings*.json` as repo settings, not only `.github/hooks/*.json`

The repo settings loader `f2t()` reads four project settings files from the repository root:

- `.claude/settings.json`
- `.claude/settings.local.json`
- `.github/copilot/settings.json`
- `.github/copilot/settings.local.json`

It parses `hooks` from those settings via `SWr`, whose picked schema includes `hooks`. Source: `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js:223:72332`, `:224:3353`, `:224:3525`, and `:224:3629`.

This answers the previously open part of KQ-4: the runtime reads more than `.github/hooks/*.json`; repo settings can inject hooks too.

### F22 - Repo settings hooks are merged into the same hook execution list as `.github/hooks/*.json`

`loadAllHooks()` first loads `.github/hooks/*.json`, then pushes `l.hooks` from repo settings into the repo hook config list before `loadHooks()` calls `Nct()` and `ntr()`. Source: `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js:4998:10626` and `:4998:10727`.

Therefore a malformed or cross-runtime `hooks` block in `.claude/settings.local.json` can reach the Copilot executor even if `.github/hooks/superset-notify.json` is perfectly valid.

### F23 - The active `.claude/settings.local.json` contains Claude-style nested hook wrappers

The current project file has:

- `hooks.UserPromptSubmit[0].hooks[0].command` at `.claude/settings.local.json:24-32`.
- `hooks.SessionStart[0].hooks[0].command` at `.claude/settings.local.json:47-53`.
- Similar nested wrappers for `PreCompact` and `Stop` at `.claude/settings.local.json:36-68`.

The top-level `UserPromptSubmit` entry at `.claude/settings.local.json:26-34` has a nested `hooks` array, but it does not have top-level `bash`, `powershell`, or `command`. That shape is normal for Claude settings but is an executor-time landmine when Copilot treats the wrapper itself as a command config.

### F24 - Alias normalization converts `UserPromptSubmit` into `userPromptSubmitted` before execution

Copilot has a VS Code / Claude compatibility alias map where `UserPromptSubmit` becomes `userPromptSubmitted`; `dZe()` applies this alias to hook config objects and preserves wrapper objects with an added `_vsCodeCompat` field. Sources: `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js:223:70875` and `:1201:1098`.

This is the bridge from the active Claude-style key in `.claude/settings.local.json` to the Copilot event whose real logs show the executor failure.

### F25 - The sessionStart/userPromptSubmitted asymmetry is explained by different filtering in `ntr()`

`ntr()` handles `sessionStart` differently from `userPromptSubmitted`:

- `sessionStart` filters entries with `a => a.type === "command"` before wrapping them with `g2()`.
- `userPromptSubmitted` maps every entry through `g2()` without the same `type === "command"` filter.

Sources: `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js:1201:3732`, `:1201:3784`, and `:1201:4358`.

`g2()` then calls the executor adapter with the original entry object, and `jer()` throws the observed error if that object has no top-level `bash` or `powershell`. Sources: `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js:1201:9237` and `:1194:2793`.

This provides a direct answer to KQ-2: `SessionStart` can appear to succeed or at least avoid this specific failure because the Claude wrapper is skipped, while `UserPromptSubmit` fails because the wrapper is executed as if it were a command object.

### F26 - Session-store and ad-hoc SDK hooks are not the direct source of the missing-shell object

`wireSessionStoreTracking()` merges `CUn(...).hooks`, and `CUn()` only returns a `postToolUse` callback function (`N_s(...)`), not a raw command config object. Sources: `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js:4998:11678` and `:3869:3315`.

Ad-hoc SDK hooks are also callback functions produced by `createHooksProxy()`, which call `hooks.invoke` over the protocol. Sources: `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js:5446:18924` and `:5446:27044`.

So the prior focus is narrowed: these paths can add hooks, but their shape is function callbacks and does not match the raw object that makes `jer()` throw.

### F27 - Current real logs match the repo-settings collision timing

A representative real Copilot log shows the failure at `/Users/michelkerkmeester/.copilot/logs/process-1776839086530-10837.log:15869`, immediately before model request setup begins at `:15875` and before the next `"Sending request to the AI model"` group at `:15878`.

This timing is consistent with `userPromptSubmitted` hook execution before the provider call. It is also consistent with iteration 003's isolated run, where a clean `.github/hooks/*.json` flat `bash` config logged `Executing hook` / `Spawned hook command` before the intentionally unreachable BYOK provider failed.

## Corrected Patch Status

The concrete `.github/hooks/superset-notify.json` patch from iteration 003 remains the correct Copilot file-hook shape:

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

However, iteration 004 shows that this patch alone cannot guarantee success while Copilot also ingests `.claude/settings.local.json` and executes the Claude `UserPromptSubmit` wrapper. The visible `.github/hooks/superset-notify.json` file is not the likely rejected object.

## Questions Answered

### KQ-2: Why does `sessionStart` succeed while `userPromptSubmitted` fails?

Answered. Copilot's `ntr()` filters `sessionStart` entries to `type === "command"` before execution, so the Claude wrapper object is skipped. `userPromptSubmitted` lacks that filter and wraps every entry with `g2()`, so the Claude wrapper object reaches `jer()` without top-level `bash` or `powershell`.

### KQ-4: Which config-file path is Copilot CLI 1.0.34 actually reading?

Expanded. Copilot reads `.github/hooks/*.json`, user config hooks, plugin hooks, inline option hooks, and repo settings hooks. Repo settings include `.claude/settings.json`, `.claude/settings.local.json`, `.github/copilot/settings.json`, and `.github/copilot/settings.local.json`.

### KQ-7: What is the corrected JSON patch for `.github/hooks/superset-notify.json`?

Still answered by iteration 003. The current `.github/hooks/superset-notify.json` already matches the valid flat `bash` patch. The root cause now appears to require an additional remediation outside that file: prevent Copilot from ingesting Claude-style nested settings hooks or make the shared repo settings hook shape Copilot-safe.

## Questions Remaining

1. What is the least disruptive implementation fix that preserves Claude Code hooks while preventing Copilot from executing Claude-style wrappers?
2. Can a live or isolated Copilot run show the failure disappears after neutralizing `.claude/settings.local.json` ingestion while keeping `.github/hooks/superset-notify.json` enabled?
3. Does Copilot provide any supported config flag to ignore `.claude/settings*.json` repo settings without disabling all hooks?
4. After the root-cause fix, does `$HOME/.copilot/copilot-instructions.md` `Refreshed:` advance on each live prompt?

## Ruled Out

- `wireSessionStoreTracking` as the direct missing-shell source. It contributes function callbacks, not raw command objects.
- Ad-hoc SDK hook proxying as the direct missing-shell source. It contributes function callbacks that send `hooks.invoke` requests, not raw command objects.
- `.codex/settings.json` as the active Copilot repo-settings source. The traced `f2t()` repo settings loader reads `.claude/settings*` and `.github/copilot/settings*`, not `.codex/settings.json`.

## Convergence

Not converged. Iteration 003 already completed the schema answer, `.github/hooks` patch shape, and isolated success reproducer. Iteration 004 adds a high-confidence root-cause path for the original real-session failure and answers KQ-2/KQ-4, but the loop still lacks an empirical run proving the failure disappears after the extra repo-settings remediation.

## Next Focus

Build an isolated reproducer with both a valid `.github/hooks/superset-notify.json` and a Claude-style `.claude/settings.local.json` `UserPromptSubmit` wrapper. Confirm it logs the same missing-shell failure, then test the smallest mitigation that preserves the `.github/hooks` flat `bash` hook while neutralizing the Claude wrapper for Copilot.
