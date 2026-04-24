# Iteration 003 - Schema Reproducer and Hook Loader Trace

## Focus

Instrument the Copilot CLI 1.0.34 hook path enough to prove which schema shape executes, produce the concrete `.github/hooks/superset-notify.json` patch shape, and narrow whether the remaining `"Neither 'bash' nor 'powershell' specified in hook command configuration"` error can still be attributed to the visible project hook file.

## Actions Taken

1. Re-read iteration 002, the active strategy, the JSONL state, and the generated iteration 003 prompt.
2. Re-read the active project hook file at `.github/hooks/superset-notify.json`.
3. Traced the Copilot 1.0.34 bundled source around the parser, loader, event mapper, and executor:
   - `C1e`, `m2t`, `E1e`, `QU`, `c2t`, and `d2t` on `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js:223`.
   - `jer` on `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js:1194`.
   - `Nct`, `loadAllHooks`, and `loadHooks` on `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js:1201` and `:4998`.
4. Checked Copilot's built-in config help. It explicitly documents inline `hooks` as "same schema as .github/hooks/*.json" and says repo settings hooks act as repo-level hooks.
5. Built an isolated temp repo under `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-hook-repro-VORlle/` with a temporary `.github/hooks/superset-notify.json` using flat `bash` entries.
6. Ran Copilot 1.0.34 against that isolated repo with:
   - isolated `COPILOT_HOME`, `COPILOT_CACHE_HOME`, and `--log-dir`;
   - BYOK mode pointed at an intentionally unreachable `http://127.0.0.1:9/v1` provider;
   - `--log-level debug`, `--disable-builtin-mcps`, `--no-custom-instructions`, and `--stream off`.

The provider request was expected to fail, but hook execution occurs before the first model request, so this was sufficient to test parser plus executor acceptance without touching the real project hook config or hook scripts.

## Findings

### F15 - The accepted command schema is flat command objects keyed by event name

The 1.0.34 schema object accepts command entries with:

- `type: "command"` defaulted by the schema.
- `bash` optional.
- `powershell` optional.
- `command` optional alias.
- `cwd` optional.
- `env` optional string map.
- `timeoutSec` optional positive number.
- `timeout` optional positive-number alias.

The required-shell condition is implemented by `A1e`: at least one of `bash`, `powershell`, or `command` must exist; `QU` then transforms with `C1e`. `C1e` copies `command` into missing `bash` and `powershell`, copies `timeout` into `timeoutSec`, and removes the alias fields from the normalized object. Source: `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js:223:66844`, `:223:69089`, and `:223:69732`.

### F16 - File-based hook configs get wrapper flattening and event alias normalization before execution

`E1e` parses file JSON through `bKo`, which calls `m2t` and then `AKo` before `u2t.safeParse`. `m2t` flattens one nested `hooks` wrapper, while `AKo` maps VS Code / Claude-style event names into Copilot's canonical lowercase event names. Source: `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js:223:67195`, `:223:68458`, and `:223:71107`.

The canonical accepted event keys in `c2t` are:

- `sessionStart`
- `sessionEnd`
- `userPromptSubmitted`
- `preToolUse`
- `postToolUse`
- `postToolUseFailure`
- `errorOccurred`
- `agentStop`
- `subagentStop`
- `subagentStart`
- `preCompact`
- `permissionRequest`
- `notification`

The alias map accepts `SessionStart`, `SessionEnd`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `ErrorOccurred`, `Stop`, `SubagentStop`, `PreCompact`, `PermissionRequest`, and `Notification`. Source: `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js:223:70260` and `:223:71107`.

### F17 - The executor error means an unnormalized object reached `jer`, not that flat `bash` is invalid

The executor chooses `bash` or `powershell` from the command object and throws only if both are absent. It also logs `Executing hook: ...` immediately before spawning the shell. Source: `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js:1194:2539`.

Therefore, the observed message is not a parse-time schema error. It means the runtime hook array contained an object without `bash` or `powershell` at execution time.

### F18 - The visible project hook file already matches the executable flat `bash` shape

The current project file has `version: 1`, a `hooks` object, and flat `type: "command"` entries with `bash` plus `timeoutSec` for all four registered events:

- `sessionStart`: `.github/hooks/superset-notify.json:4`
- `sessionEnd`: `.github/hooks/superset-notify.json:11`
- `userPromptSubmitted`: `.github/hooks/superset-notify.json:18`
- `postToolUse`: `.github/hooks/superset-notify.json:25`

Each event's command field is direct `bash`: `.github/hooks/superset-notify.json:7`, `:14`, `:21`, and `:28`.

This makes the visible repo hook file unlikely to be the rejected runtime object unless another loader mutates it after parse.

### F19 - Isolated empirical reproducer proves the flat patch shape executes

The isolated reproducer used this temporary config:

`/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-hook-repro-VORlle/repo/.github/hooks/superset-notify.json`

The temp config used `version: 1`, `hooks`, and flat `bash` entries. Source: `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-hook-repro-VORlle/repo/.github/hooks/superset-notify.json:1`.

Run evidence:

- Shell command timestamp: `2026-04-22T14:12:37.402Z` to `2026-04-22T14:13:22.459Z`.
- Copilot log file: `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-hook-repro-VORlle/logs/process-1776867158201-98351.log`.
- `userPromptSubmitted` logged `Executing hook` at line 25 and `Spawned hook command` at line 26.
- `sessionStart` logged `Executing hook` at line 66 and `Spawned hook command` at line 67.
- The marker file was written by both hooks at `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-hook-repro-VORlle/hook-marker.log:1` and `:2`.

The run did not log `Hook execution failed: Neither 'bash' nor 'powershell' specified...` for the isolated flat `bash` config. The model-provider call failed later by design because the local sandbox forbade running a listener and the provider URL was intentionally unreachable.

### F20 - The concrete patch is the flat `bash` shape; in the current repo it is already applied

The concrete patch shape for `.github/hooks/superset-notify.json` is:

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

This is identical to the current file shape at `.github/hooks/superset-notify.json:1-33`, so iteration 3 rules out "flat `bash` is invalid" and shifts the root-cause question to an additional hook source or runtime injection path.

## Questions Answered

### KQ-1: Current schema

Answered for file-based hooks. Copilot 1.0.34 accepts `version: 1`, `hooks`, canonical event keys, `type: "command"`, and at least one of `bash`, `powershell`, or `command`. It also accepts one nested `hooks` wrapper and event aliases when parsing `.github/hooks/*.json` files through `E1e`.

### KQ-3: Did a new required key replace flat `bash`?

No. Flat `bash` is still accepted and executed. `command` is an alias, not a replacement.

### KQ-7: Corrected JSON patch

The corrected patch is the flat `bash` shape shown above. The current repo file already matches it.

### KQ-8: Does old `bash` fail silently?

No evidence that flat `bash` fails. The isolated run produced successful `Executing hook` and `Spawned hook command` log lines.

## Questions Remaining

1. Which runtime hook source is adding the object that reaches `jer` without `bash` or `powershell`?
2. Does session-store tracking (`wireSessionStoreTracking` / `CUn`) add raw hook command objects that bypass `E1e`?
3. Are remote/ACP/ad-hoc hooks involved through `createHooksProxy` or connection-owned hook injection?
4. Why did the active real logs report the executor failure while the visible repo config is already executable?

## Ruled Out

- Flat `bash` command entries in `.github/hooks/*.json` are not invalid on Copilot CLI 1.0.34. The isolated reproducer executed them.
- A patch that only rewrites `.github/hooks/superset-notify.json` to the current flat `bash` shape is not sufficient to explain the existing real-session failure, because that shape is already present.

## Dead Ends

- A local OpenAI-compatible fake provider server could not be used because the sandbox rejected `listen(127.0.0.1)` with `EPERM`. This was worked around by using an unreachable BYOK URL after confirming hooks fire before provider calls.

## Convergence

Not converged. This iteration delivered a primary-source-backed schema explanation, a concrete patch shape, and an isolated empirical reproducer for successful flat-hook execution. It did not identify the original rejected runtime object from the real failing session, so the next iteration should instrument the runtime hook array immediately before `xR` invokes hook callbacks or inspect session-store/ad-hoc hook injection paths.

## Next Focus

Instrument the hook invocation array rather than the file parser. The most promising source path is `wireSessionStoreTracking` and any ad-hoc hook update that can merge objects into `session.getEffectiveHooks()` after `.github/hooks/*.json` has already been parsed. Add scratch diagnostics around `xR` to log each callback's origin or around `loadHooks` / `nH` to count and label user, repo, plugin, session-store, and ad-hoc hook sources before execution.
